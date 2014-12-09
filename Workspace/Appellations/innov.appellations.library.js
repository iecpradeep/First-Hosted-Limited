/**************************************************************************************
 * Name:		(Innov.LHK.library.js)
 * 
 * Script Type:	library
 * 
 * Client:		WineSuite
 *
 * Version:		1.0.0 - 08 Aug 2012 - first release - Innov
 * 				1.0.1 - 10 Jun 2013 - update rotations adjustment - only update rotation qtys where transactions have occurred
 									- check if a po is present and if not retrieve the rotation position and recalc
				1.1.0 - 25 Jun 2013 - Added error trapping and reportin PAL
 *
 * Author:		FHL
 * 
 * Purpose:		general library
 * 
 * Script: 		n/a
 * Deploy: 		n/a
 * 
 * Notes:		This now separated from SuiteBundles version
 * 
 **************************************************************************************/


var Log=function(b)
{
	this.type=b;
	this.write=function(a)
	{
		nlapiLogExecution(b,a);
	};

	this.error=function(a)
	{
		a=null!=a.getCode?a.getCode()+": "+a.getDetails():"Error: "+(null!=a.message?a.message:a);
		nlapiLogExecution(b,"ERROR: "+a);
	};
};

var isBlank=function(b)
{
	return""==b||null==b||void 0==b||32==b.toString().charCodeAt()?!0:!1;
};

var days_between=function(b,a)
{
	var c=b.getTime(),d=a.getTime(),c=Math.abs(c-d);
	return Math.round(c/864E5);
};

//Custom List
var SaleType = function()
{
	this.DUTY_PAID = '2';
	this.ENPRIM = '8';
	this.EXPORT = '10';
	this.EXPORT_EU_DUTY_PAID = '6';
	this.EXPORT_EU_UNDER_BOND = '3';
	this.EXPORT_OUTSIDE_EU = '7';
	this.IN_BOND = '1';
	this.SAMPLES = '5';
	this.STANDARD = '9';
	this.STORAGE = '4';
};

var Currency = function()
{
	this.GBP = '1';
	this.USD = '2';
	this.EUR = '4';
	this.CHF = '5';
	this.HKD = '6';
};

//Global Variables
var BASE_UNITS_PURCHASED = 'custrecord_loyqtyordered';
var CASE_BOTTLE_ON_PO = 'custrecord_rotation_item_units_purchased';

var BASE_UNIT_SOLD = 'custrecord_lotqtysold';
var CASE_BOTTLE_SOLD = 'custrecord_rotation_item_units_sold';

var BASE_UNITS_AVAILABLE = 'custrecord_loycurrentavailable';
var CASE_BOTTLE_AVAILABLE = 'custrecord_rotation_item_units_available';


/**
 * update rotations
 * 1.0.1
 */

var updateRotationRecord = function(rotationId)
{
	try
	{
		var obj = nlapiLoadRecord('customrecord_rotation', rotationId);
		var itemId = obj.getFieldValue('custrecord_lotitem');
		var unit = obj.getFieldValue('custrecord_item_uom'); //Base UOM
		var unitType = obj.getFieldValue('custrecord_rotation_polineunits'); //PO UOM
		var conversionRate = getConversionRate(unit, unitType);


		var arr = getItemLines(rotationId, itemId);
		var adjustment = getRotationInventoryAdjItems(rotationId, itemId);
		var transfer = getRotationInventoryTransferItems(rotationId, itemId);


		update(arr, conversionRate, obj, adjustment, transfer);
	}
	catch(e)
	{
		errorHandler('updateRotationRecord', e);
	}
};

/**
 * update rotations
 * 1.0.1 
 * check if a po is present and if not retrieve the rotation position and recalc
 * */

var update = function(arr, conversionRate, obj, adjustment, transfer)
{

	var baseunitPurchased = parseInt(0);
	var baseQty = parseInt(0);
	var salesOrderqty = parseInt(0);
	var poFound = false;

	// loop thru transaction lines associated with rotation and calc
	// baseunitPurchased & baseQty 


	try
	{
		for(var i in arr)
		{
			var recordType = arr[i].recordtype;
			var recordId = arr[i].recordid;
			var quantity = arr[i].quantity;

			if(recordType == 'creditmemo')
			{
				var createdFrom = nlapiLookupField('transaction', recordId, 'createdfrom');
				if(!isBlank(createdFrom))
				{
					var isRetAuth = nlapiLookupField('transaction', createdFrom, 'type');
					if(isRetAuth != 'RtnAuth')
					{
						var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
						var tbaseQty = parseInt(quantity);
						baseunitPurchased += parseInt(tbaseunitPurchased);
						baseQty += parseInt(tbaseQty);
					}
				}
			}

			if(recordType == 'returnauthorization')
			{
				//Update Rotation Record
				var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
				var tbaseQty = parseInt(quantity);

				baseunitPurchased += parseInt(tbaseunitPurchased);
				baseQty += parseInt(tbaseQty);
			}


			if(recordType == 'purchaseorder')
			{
				//Update Rotation Record
				var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
				var tbaseQty = parseInt(quantity);

				baseunitPurchased += parseInt(tbaseunitPurchased);
				baseQty += parseInt(tbaseQty);
				poFound = true;
			}

			if(recordType == 'vendorreturnauthorization')
			{
				//Update Rotation Record

				if(quantity > 0)
				{
					quantity = parseInt(quantity) * parseInt(-1); //convert to positive
				}

				var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
				var tbaseQty = parseInt(quantity);

				baseunitPurchased += parseInt(tbaseunitPurchased);
				baseQty += parseInt(tbaseQty);
			}

			else if(recordType == 'salesorder')
			{
				var isclosed = isClosed('salesorder', recordId);
				if(!isclosed)
				{
					salesOrderqty += parseInt(quantity);
				}
			}
		}

		//Set Base Units Purchased; Case Bottle on PO
		// check if any transactions have been found before updating 1.0.1

		obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
		obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);

		var itemId = obj.getFieldValue('custrecord_lotitem');
		var linkedRecord = '';

		linkedRecord = obj.getFieldValue('custrecord_lhk_po_link');

		if(!isBlank(linkedRecord))
		{
			var isInvAdjustment = nlapiLookupField('transaction', linkedRecord, 'type');
			if(isInvAdjustment == 'InvAdjst')
			{
				//Get the Item quantity in the inventory adjustment

				var filters = [new nlobjSearchFilter('internalid', null, 'is', linkedRecord), new nlobjSearchFilter('item', null, 'is', itemId)];

				var columns = [new nlobjSearchColumn('quantityuom'), new nlobjSearchColumn('quantity')];

				var s = nlapiSearchRecord('transaction', null, filters, columns);

				for (var i = 0; s != null && i< s.length; i++)
				{
					var qty = 0;
					qty = s[i].getValue('quantity'); //Quantity Unit
					var qtyuom = 0;
					qtyuom = s[i].getValue('quantityuom'); //Quantity

					if(qty < 0)
					{
						baseunitPurchased = parseInt(qty * parseInt(-1)) * parseInt(conversionRate);
						baseQty = parseInt(qty * parseInt(-1));

						obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
						obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);
					}
				}

			}

			if(isInvAdjustment == 'TrnfrOrd')
			{
				//Get the Item quantity in the inventory transfer

				var filters = [new nlobjSearchFilter('internalid', null, 'is', linkedRecord), new nlobjSearchFilter('item', null, 'is', itemId)];

				var columns = [new nlobjSearchColumn('quantityuom'), new nlobjSearchColumn('quantity')];

				var s = nlapiSearchRecord('transaction', null, filters, columns);

				for (var i = 0; s != null && i< s.length; i++)
				{
					var qty = s[i].getValue('quantity'); //Quantity Unit
					var qtyuom = s[i].getValue('quantityuom'); //Quantity

					if(qtyuom < 0)
					{
						baseunitPurchased = parseInt(qtyuom * parseInt(-1)) * parseInt(conversionRate);
						baseQty = parseInt(qtyuom * parseInt(-1));

						obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
						obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);
					}
				}
			}
		}

		//Update Sales Order
		var baseUnitSold = parseInt(salesOrderqty) * parseInt(conversionRate);
		var adjustmentSold = parseInt(adjustment) * parseInt(conversionRate);
		var transferSold = parseInt(transfer) * parseInt(conversionRate);
		var caseBottleSold = parseInt(salesOrderqty);

		// 1.0.1 check if a po is present and if not retrieve the rotation position and recalc
		if (poFound != true)
		{
			baseunitPurchased = obj.getFieldValue('custrecord_orig_base_units_purchased');
			baseQty = obj.getFieldValue('custrecord_orig_base_quantity');

			if(baseunitPurchased==null && baseQty==null)
			{
				baseunitPurchased = obj.getFieldValue(BASE_UNITS_AVAILABLE);
				baseQty = obj.getFieldValue(CASE_BOTTLE_AVAILABLE);

				obj.setFieldValue('custrecord_orig_base_units_purchased', baseunitPurchased);
				obj.setFieldValue('custrecord_orig_base_quantity', baseQty);
			}
		}

		//Recalculate
		var baseUnitsAvailable = parseInt(baseunitPurchased) - (parseInt(baseUnitSold) + parseInt(adjustmentSold) + parseInt(transferSold));
		// var caseBottleAvailable = parseInt(baseQty) - (parseInt(caseBottleSold) + parseInt(adjustment) + parseInt(transfer));


		//1.1.0 PAL - Fixed the error "nlapiGetFieldValue" call on a Record Object.
		var origCaseBottle = obj.getFieldValue('custrecord_orig_casesbottles_available');
		var buPerCaseBottle = obj.getFieldValue('custrecord_po_line_uom_qty');
		var caseBottleAvail = parseInt(origCaseBottle) / parseInt(buPerCaseBottle);

		// update fields
		// check if any transactions have been found before updating 1.0.1

		obj.setFieldValue(BASE_UNIT_SOLD, baseUnitSold);
		obj.setFieldValue(CASE_BOTTLE_SOLD, caseBottleSold);
		obj.setFieldValue(BASE_UNITS_AVAILABLE, baseUnitsAvailable);
		obj.setFieldValue(CASE_BOTTLE_AVAILABLE, caseBottleAvail);
	}
	catch(e)
	{
		errorHandler('update e', e);
	}

	try
	{
		if(!isBlank(linkedRecord))
		{
			var linkType = nlapiLookupField('transaction', linkedRecord, 'type');
			if(linkType == 'PurchOrd')
			{
				var ordType = nlapiLookupField('purchaseorder', linkedRecord, 'custbody_po_order_type');
				if(ordType == 1 || ordType == 3 || ordType == 4)
				{
					//set to Duty Paid
					obj.setFieldValue('custrecord_rotation_ordertype', '1');
				}
				else if(ordType == 2 || ordType == 5)
				{
					//set to In Bond
					obj.setFieldValue('custrecord_rotation_ordertype', '2');
				}
			}
		}
		nlapiSubmitRecord(obj, true);
	}
	catch(ex)
	{
		errorHandler('update ex', ex);
	}
};




var getConversionRate = function(unit, unitType)
{
	var conversionrate = '';

	try
	{
		var obj = nlapiLoadRecord('unitstype', unit);
		var count = obj.getLineItemCount('uom');

		if(count > 0)
		{
			for(var i = 1; i <= count; i++)
			{
				var internalid = obj.getLineItemValue('uom', 'internalid', i);
				if(internalid == unitType)
				{
					conversionrate = obj.getLineItemValue('uom', 'conversionrate', i);
					break;
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('getConversionRate', e);
	}

	return conversionrate;
};





var getItemLines = function(rotationId, itemId)
{

	var result = [];
	try
	{
		var filters =
			[
			 new nlobjSearchFilter('custcol_tran_rotation', null, 'is', rotationId),
			 new nlobjSearchFilter('item', null, 'is', itemId)
			 ];

		var s = nlapiSearchRecord('transaction', 'customsearch_innov_rotation_update', filters, null);

		for (var i = 0; s != null && i< s.length; i++)
		{
			var recordType = s[i].getRecordType(); //sales order, vendor bill, purchase orders
			var recordId = s[i].getId(); //transaction ID
			var qty = s[i].getValue('quantityuom'); //Quantity
			var qtyCM = 0;
			qtyCM = s[i].getValue('quantity'); //Quantity

			if(qty < 0)
			{
				qty = parseInt(-1) * parseInt(qty);
			}

			result.push
			(
					{
						'recordtype' : recordType,
						'recordid' : recordId,
						'quantity' : qty
					}
			);
		}
	}
	catch(e)
	{
		errorHandler('getItemLines', e);
	}

	return result;
};




var timedRefresh = function(timeoutPeriod) 
{
	try
	{
		setTimeout("location.reload(true);",timeoutPeriod);
	}
	catch(e)
	{
		errorHandler('timedRefresh', e);
	}
};





var getRotationInventoryAdjItems = function(rotationId, itemId)
{
	var qtyToAdjust = 0;
	
	try
	{
		var columns = [new nlobjSearchColumn('item'), new nlobjSearchColumn('quantity'), new nlobjSearchColumn('quantityuom')];
		var filters = [new nlobjSearchFilter('mainline', null, 'is', 'F'), new nlobjSearchFilter('custbody_original_rotation', null, 'is', rotationId)];
		var s = nlapiSearchRecord('inventoryadjustment', null, filters, columns);

		for (var i = 0; s != null && i< s.length; i++)
		{
			var item = s[i].getValue('item');
			var adjustqtyby = s[i].getValue('quantityuom');

			if(item == itemId)
			{
				if(adjustqtyby < 0)
				{
					qtyToAdjust += parseInt(adjustqtyby);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('getRotationInventoryAdjItems', e);
	}

	var temp = 0;

	try
	{
		temp = parseInt(qtyToAdjust) * parseInt(-1);
	}
	catch(e)
	{
		errorHandler('getRotationInventoryAdjItems Catch2', e);
	}



	return temp;
};

var getRotationInventoryTransferItems = function(rotationId, itemId)
{

	var qtyToTransfer = parseInt(0);


	try
	{
		var columns =
			[
			 new nlobjSearchColumn('item'),
			 new nlobjSearchColumn('quantityuom')
			 ];

		var filters =
			[
			 new nlobjSearchFilter('mainline', null, 'is', 'F'),
			 new nlobjSearchFilter('custcol_tran_rotation', null, 'is', rotationId)
			 ];

		var s = nlapiSearchRecord('transferorder', null, filters, columns);

		for(var i = 0; s != null && i< s.length; i++)
		{
			var item = s[i].getValue('item');
			var quantity = s[i].getValue('quantityuom');

			if(item == itemId)
			{
				if(quantity > 0)
				{
					qtyToTransfer += parseInt(quantity);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('getRotationInventoryTransferItems', e);
	}

	return qtyToTransfer;
};




var unique = function(arrayName)
{

	var newArray=new Array();
	try
	{
		label:for(var i=0; i<arrayName.length;i++)
		{
			for(var j=0; j<newArray.length;j++ )
			{
				if(newArray[j]==arrayName[i])
					continue label;
			}
			newArray[newArray.length] = arrayName[i];
		}

	}
	catch(e)
	{
		errorHandler('unique', e);
	}

	return newArray;
};






var OrderType = function()
{
	try
	{
		this.DUTY_PAID = '1';
		this.DUTY_PAID_PRIVATE = '3';
		this.EU_DUTY_PAID = '4';
		this.IN_BOND = '2';
		this.EU_IN_BOND = '5';
	}
	catch(e)
	{
		errorHandler('OrderType', e);
	}
};




var isClosed = function(transaction, id)
{
	try
	{
		var isclose = nlapiLookupField(transaction, id, 'status');
		if(isclose != null)
		{
			if(isclose == 'closed')
			{
				return true;
			}
			else
			{
				return false;
			}
		}
	}
	catch(e)
	{
		errorHandler('isClosed', e);
	}
};


/*********************************************************************
 * 
 * errorHandler
 * 
 * @param sourceFunction
 * @param e
 */
function errorHandler(sourceFunction, e)
{
	try
	{
		nlapiLogExecution('ERROR', 'Function name: ' + sourceFunction, e.message);
	}
	catch(error)
	{
		nlapiLogExecution('ERROR', 'Error function Errored', e.message);
	}
}

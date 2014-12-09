var Log=function(b){this.type=b;this.write=function(a){nlapiLogExecution(b,a)};this.error=function(a){a=null!=a.getCode?a.getCode()+": "+a.getDetails():"Error: "+(null!=a.message?a.message:a);nlapiLogExecution(b,"ERROR: "+a)}},isBlank=function(b){return""==b||null==b||void 0==b||32==b.toString().charCodeAt()?!0:!1},days_between=function(b,a){var c=b.getTime(),d=a.getTime(),c=Math.abs(c-d);return Math.round(c/864E5)};

//Custom List
var SaleType = function(){
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
}

var Currency = function(){
	this.GBP = '1';
	this.USD = '2';
	this.EUR = '4';
	this.CHF = '5';
	this.HKD = '6';
}

//Global Variables
var BASE_UNITS_PURCHASED = 'custrecord_loyqtyordered';
var CASE_BOTTLE_ON_PO = 'custrecord_rotation_item_units_purchased';

var BASE_UNIT_SOLD = 'custrecord_lotqtysold';
var CASE_BOTTLE_SOLD = 'custrecord_rotation_item_units_sold';

var BASE_UNITS_AVAILABLE = 'custrecord_loycurrentavailable';
var CASE_BOTTLE_AVAILABLE = 'custrecord_rotation_item_units_available';


var update = function(arr, conversionRate, obj, adjustment, transfer){

	var baseunitPurchased = parseInt(0);
	var baseQty = parseInt(0);
	var salesOrderqty = parseInt(0);

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

			log.write('Credit Memo :' + tbaseQty);
		}

		if(recordType == 'returnauthorization')
		{
			//Update Rotation Record
			var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
			var tbaseQty = parseInt(quantity);

			baseunitPurchased += parseInt(tbaseunitPurchased);
			baseQty += parseInt(tbaseQty);

			log.write('Return Authorization :' + tbaseQty);
		}


		if(recordType == 'purchaseorder')
		{
			//Update Rotation Record
			var tbaseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
			var tbaseQty = parseInt(quantity);

			baseunitPurchased += parseInt(tbaseunitPurchased);
			baseQty += parseInt(tbaseQty);

			log.write('Purchase Order :' + tbaseQty);
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

			log.write('Vendor Authorization :' + tbaseQty);
		}

		else if(recordType == 'salesorder')
		{
			var isclosed = isClosed('salesorder', recordId);
			if(!isclosed)
			{
				salesOrderqty += parseInt(quantity);
				log.write('Sales Order :' + salesOrderqty);
			}
		}
	}

	//Set Base Units Purchased; Case Bottle on PO
	obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
	obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);

	var itemId = obj.getFieldValue('custrecord_lotitem');
	var linkedRecord = obj.getFieldValue('custrecord_lhk_po_link');

	if(!isBlank(linkedRecord))
	{
		var isInvAdjustment = nlapiLookupField('transaction', linkedRecord, 'type');
		if(isInvAdjustment == 'InvAdjst')
		{
			//Get the Item quantity in the inventory adjustment

			var filters =
			[
				new nlobjSearchFilter('internalid', null, 'is', linkedRecord),
				new nlobjSearchFilter('item', null, 'is', itemId)
			];

			var columns =
			[
				new nlobjSearchColumn('quantityuom'),
				new nlobjSearchColumn('quantity')
			];

			var s = nlapiSearchRecord('transaction', null, filters, columns);

			for (var i = 0; s != null && i< s.length; i++)
			{
				var qty = s[i].getValue('quantity'); //Quantity Unit
				var qtyuom = s[i].getValue('quantityuom'); //Quantity

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

			var filters =
			[
				new nlobjSearchFilter('internalid', null, 'is', linkedRecord),
				new nlobjSearchFilter('item', null, 'is', itemId)
			];

			var columns =
			[
				new nlobjSearchColumn('quantityuom'),
				new nlobjSearchColumn('quantity')
			];

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

	obj.setFieldValue(BASE_UNIT_SOLD, baseUnitSold);
	obj.setFieldValue(CASE_BOTTLE_SOLD, caseBottleSold);

	//Recalculate
	var baseUnitsAvailable = parseInt(baseunitPurchased) - (parseInt(baseUnitSold) + parseInt(adjustmentSold) + parseInt(transferSold));
	var caseBottleAvailable = parseInt(baseQty) - (parseInt(caseBottleSold) + parseInt(adjustment) + parseInt(transfer));

	obj.setFieldValue(BASE_UNITS_AVAILABLE, baseUnitsAvailable);
	obj.setFieldValue(CASE_BOTTLE_AVAILABLE, caseBottleAvailable);


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
	catch(ex){}
}

var getConversionRate = function(unit, unitType){
	var obj = nlapiLoadRecord('unitstype', unit);
	var count = obj.getLineItemCount('uom');

	if(count > 0)
	{
		for(var i = 1; i <= count; i++)
		{
			var internalid = obj.getLineItemValue('uom', 'internalid', i);
			if(internalid == unitType)
			{
				var conversionrate = obj.getLineItemValue('uom', 'conversionrate', i);
				break;
			}
		}
	}
	return conversionrate;
}

var getItemLines = function(rotationId, itemId){

	var result = [];

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
		var qtyCM = s[i].getValue('quantity'); //Quantity

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
	return result;
}

var timedRefresh = function(timeoutPeriod) {
	setTimeout("location.reload(true);",timeoutPeriod);
}

var getRotationInventoryAdjItems = function(rotationId, itemId){

	var qtyToAdjust = parseInt(0);

	var columns =
	[
		new nlobjSearchColumn('item'),
		new nlobjSearchColumn('quantity'),
		new nlobjSearchColumn('quantityuom')
	]

	var filters =
	[
		new nlobjSearchFilter('mainline', null, 'is', 'F'),
		new nlobjSearchFilter('custbody_original_rotation', null, 'is', rotationId)
	];

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


	var temp = parseInt(qtyToAdjust) * parseInt(-1);
	return temp;
}

var getRotationInventoryTransferItems = function(rotationId, itemId){

	var qtyToTransfer = parseInt(0);

	var columns =
	[
		new nlobjSearchColumn('item'),
		new nlobjSearchColumn('quantityuom')
	]

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

	return qtyToTransfer;
}

var unique = function(arrayName){

	var newArray=new Array();

	label:for(var i=0; i<arrayName.length;i++)
	{
		for(var j=0; j<newArray.length;j++ )
		{
			if(newArray[j]==arrayName[i])
			continue label;
		}
		newArray[newArray.length] = arrayName[i];
	}
	return newArray;
}

var updateRotationRecord = function(rotationId){

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

var OrderType = function(){
	this.DUTY_PAID = '1';
	this.DUTY_PAID_PRIVATE = '3';
	this.EU_DUTY_PAID = '4';
	this.IN_BOND = '2';
	this.EU_IN_BOND = '5';
}

var isClosed = function(transaction, id){
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
	catch(ex)
	{
		log.error(ex);
	}
}
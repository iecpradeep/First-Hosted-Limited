var Log=function(b){this.type=b;this.write=function(a){nlapiLogExecution(b,a)};this.error=function(a){a=null!=a.getCode?a.getCode()+": "+a.getDetails():"Error: "+(null!=a.message?a.message:a);nlapiLogExecution(b,"ERROR: "+a)}},isBlank=function(b){return""==b||null==b||void 0==b||32==b.toString().charCodeAt()?!0:!1},days_between=function(b,a){var c=b.getTime(),d=a.getTime(),c=Math.abs(c-d);return Math.round(c/864E5)};

var update = function(arr, conversionRate, obj, adjustment, transfer){

	var baseunitPurchased = parseInt(0);
	var baseQty = parseInt(0);
	var salesOrderqty = parseInt(0);

	for(var i in arr)
	{
		var recordType = arr[i].recordtype;
		var recordId = arr[i].recordid;
		var quantity = arr[i].quantity;

		if(recordType == 'purchaseorder')
		{
			//Update Rotation Record
			baseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
			baseQty = parseInt(quantity);

			obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
			obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);
		}

		if(recordType == 'creditmemo')
		{
			//Update Rotation Record
			baseunitPurchased = parseInt(quantity) * parseInt(conversionRate);
			baseQty = parseInt(quantity);

			obj.setFieldValue(BASE_UNITS_PURCHASED, baseunitPurchased);
			obj.setFieldValue(CASE_BOTTLE_ON_PO, baseQty);
		}

		else if(recordType == 'salesorder')
		{
			salesOrderqty += parseInt(quantity);
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
	
	log.write('BASE_UNIT_SOLD: ' + baseUnitSold + ' | CASE_BOTTLE_SOLD: ' + caseBottleSold + ' | BASE_UNITS_AVAILABLE: ' + baseUnitsAvailable + ' | CASE_BOTTLE_AVAILABLE: ' + caseBottleAvailable);

	try
	{
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

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId + ' | Qty: ' + qty);

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
		new nlobjSearchColumn('quantity')
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
		var adjustqtyby = s[i].getValue('quantity');

		if(item == itemId)
		{
			if(adjustqtyby > 0)
			{
				qtyToAdjust += parseInt(adjustqtyby);
			}
		}
	}

	log.write('Qty to Adjust: ' + qtyToAdjust);

	return qtyToAdjust;
}

var getRotationInventoryTransferItems = function(rotationId, itemId){

	var qtyToTransfer = parseInt(0);

	var columns =
	[
		new nlobjSearchColumn('item'),
		new nlobjSearchColumn('quantity')
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
		var quantity = s[i].getValue('quantity');

		if(item == itemId)
		{
			if(quantity > 0)
			{
				qtyToTransfer += parseInt(quantity);
			}
		}
	}

	log.write('Final Qty to Transfer: ' + qtyToTransfer);

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

	log.write('Item ID: ' + itemId + ' | Unit: ' + unit + ' | Unit type: ' + unitType + ' | Conversionrate: ' + conversionRate);

	var arr = getItemLines(rotationId, itemId);
	var adjustment = getRotationInventoryAdjItems(rotationId, itemId);
	var transfer = getRotationInventoryTransferItems(rotationId, itemId);

	log.write('Adjustment qty: ' + adjustment + ' | Transfer qty: ' + transfer);

	update(arr, conversionRate, obj, adjustment, transfer);
}
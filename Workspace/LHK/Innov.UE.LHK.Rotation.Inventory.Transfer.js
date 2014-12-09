/**
* @fileOverview
* @name Innov.UE.LHK.Rotation.Inventory.Transfer.js
* @author Innov - Eli Beltran
* 08-07-2012
* @version 1.0
* Deployed as User Event Script in Rotation Inventory Transfer
* @description:
*/
var log = new Log('DEBUG');

var beforeLoad = function(type, form, request){
	if(type == 'create'){

		var item = request.getParameter('item');
		var rotation = request.getParameter('rotation');

		nlapiSetFieldValue('custrecord_lhk_rit_item', item);
		nlapiSetFieldValue('custrecord_lhk_rit_rotation', rotation);

		nlapiSetFieldValue('custrecord_lhk_rit_transfer_price', '0.00');
		nlapiSetFieldValue('custrecord_lhk_rit_transfer_amount', '0.00');
	}
	if(type == 'edit'){

		var transferPrice = nlapiSetFieldValue('custrecord_lhk_rit_transfer_price');
		if(isBlank(transferPrice)){
			nlapiSetFieldValue('custrecord_lhk_rit_transfer_price', '0.00');
			nlapiSetFieldValue('custrecord_lhk_rit_transfer_amount', '0.00');
		}
	}
}

var beforeSubmit = function(type){
}

var afterSubmit = function(type){

	if(type == 'create' || type == 'edit'){

		var rotationId = nlapiGetFieldValue('custrecord_lhk_rit_rotation');
		
		log.write('Original Rotation Record : ' + rotationId);

		updateRotationRecord(rotationId);

		var objArray = [];
    
		//Get Rotation Inventory Details
		var obj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var inventoryTransferID = obj.getFieldValue('custrecord_lhk_rit_itid');
    
		if(!isBlank(inventoryTransferID))
		{
			return false;
			//Do not create a new Inventory Transfer Record
		}
    
		var item = obj.getFieldValue('custrecord_lhk_rit_item'); //Item
		var rotation = obj.getFieldValue('custrecord_lhk_rit_rotation'); //Rotation
		var quantity = obj.getFieldValue('custrecord_lhk_rit_transferqty'); //Qty To Transfer
		var fromLocation = obj.getFieldValue('custrecord_lhk_rit_fromlocation'); //From Location
		var toLocation = obj.getFieldValue('custrecord_lhk_rit_tolocation'); //To Location
		var date = obj.getFieldValue('custrecord_lhk_rit_date'); //Date
		var rate = obj.getFieldValue('custrecord_lhk_rit_transfer_price'); //Transfer Price
		var availableQty = obj.getFieldValue('custrecord_lhk_rit_availableqty'); //Available Qty
    var packSize = obj.getFieldValue('custrecord_lhk_rit_packsize');
    
		var newRotationName = obj.getFieldValue('custrecord_lhk_rit_newrotationname'); //New Rotation Name
		var newOrderType = obj.getFieldValue('custrecord_lhk_rit_newordertype'); //New Order Type
		var newGBPCost = obj.getFieldValue('custrecord_lhk_rit_newpackcost'); //New Pack GBP Cost 
    
		log.write('Item: ' + item + ' | Qty: ' + quantity + ' | From Loc:' + fromLocation + ' | To Loc:' + toLocation + ' | Date: ' + date);
    
		objArray.push
		(
			{
				'item' : item,
				'quantity' : quantity,
				'fromLocation' : fromLocation,
				'toLocation' : toLocation,
				'date' : date,
				'rotation' : rotation,
				'rate' : rate,
				'newRotationName' : newRotationName,
				'newOrderType' : newOrderType,
				'newGBPCost' : newGBPCost,
				'availableQty' : availableQty,
				'packSize' : packSize
			}
		);
    
		if(!isBlank(objArray)){
			var transferId = createTransferOrder(objArray);
			createNewRotationRecord(objArray, rotationId, transferId);
		}
	}
}

var createTransferOrder = function(objArray){
	var createObj = nlapiCreateRecord('transferorder');
	createObj.setFieldValue('trandate', objArray[0].date);
	createObj.setFieldValue('location', objArray[0].fromLocation);
	createObj.setFieldValue('transferlocation', objArray[0].toLocation);
	createObj.setFieldValue('custbody_innov_rotation_link', nlapiGetRecordId());
	//createObj.setFieldValue('orderstatus', 'B');

	createObj.insertLineItem('item', 1);
	createObj.setLineItemValue('item', 'item', 1, objArray[0].item);
	createObj.setLineItemValue('item', 'quantity', 1, objArray[0].quantity);
	createObj.setLineItemValue('item', 'custcol_tran_rotation', 1, objArray[0].rotation);
	createObj.setLineItemValue('item', 'rate', 1, objArray[0].rate);

	var transferID = nlapiSubmitRecord(createObj);
	if(!isBlank(transferID))
	{
		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_rit_itid', transferID);
	}
	
	return transferID;
	log.write('Inventory Transfer: ' + transferID);
}

var createNewRotationRecord = function(objArray, rotationId, transferId){
	
	var create = nlapiCopyRecord('customrecord_rotation', rotationId);
	var unit = create.getFieldValue('custrecord_item_uom'); //Base UOM
	var unitType = create.getFieldValue('custrecord_rotation_polineunits'); //PO UOM	
	var conversionRate = getConversionRate(unit, unitType);

	var name = objArray[0].newRotationName; //Name
	var packSize = objArray[0].packSize; //Pack Size
	var newBaseQuantity = objArray[0].quantity; //Base Units Available
	var newOrderType = objArray[0].newOrderType;
	var newGbpCost = objArray[0].newGBPCost;
	
	log.write('Name: ' + name + ' | Packsize: ' + packSize  + ' | New base qty: ' + newBaseQuantity + ' | New GBP Cost: ' + newGbpCost);

	create.setFieldValue('name', name);
	create.setFieldValue('custrecord_rotationname', name);
	create.setFieldValue('custrecord_loyqtyordered', newBaseQuantity);
	create.setFieldValue('custrecord_lotqtysold', 0);
	create.setFieldValue('custrecord_loycurrentavailable', newBaseQuantity);
	create.setFieldValue('custrecord_item_received', newBaseQuantity);
	create.setFieldValue('custrecord_rotation_item_units_available', parseInt(newBaseQuantity) * parseInt(conversionRate)); //Calculate based on units
	create.setFieldValue('custrecord_rotation_item_units_sold', 0);
	create.setFieldValue('custrecord_rotation_item_units_purchased', newBaseQuantity);
	create.setFieldValue('custrecord_rotation_polineunits', packSize);
	create.setFieldValue('custrecord_rotation_gbp_unitcost', newGbpCost);
	create.setFieldValue('custrecord_lhk_po_link', transferId);
	
	try
	{
		var newRotationId = nlapiSubmitRecord(create, true);
		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_ria_newrotationrecord', newRotationId);
		
		//Create links from Transfer Order
		nlapiSubmitField('transferorder', transferId, 'custbody_original_rotation', rotationId);
		nlapiSubmitField('transferorder', transferId, 'custbody_new_rotation_record', newRotationId);
		
		log.write('New Rotation ID: ' + newRotationId);
	}
	catch(ex)
	{
		log.error(ex);
	}
}

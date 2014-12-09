/**
* @fileOverview
* @name Innov.UE.LHK.Rotation.Inventory.Adjustment.js
* @author Innov - Eli Beltran
* 08-08-2012
* @version 1.0
* Deployed as User Event Script in Rotation Inventory Adjustment
* @description:
*/
var log = new Log('DEBUG');

var ROTATION_RECORD = 'customrecord_rotation';

var beforeLoad = function(type, form, request){
	if(type == 'create'){

		var item = request.getParameter('item');
		var rotation = request.getParameter('rotation');

		nlapiSetFieldValue('custrecord_lhk_ria_item', item);
		nlapiSetFieldValue('custrecord_lhk_ria_originalrotation', rotation);

		nlapiSetFieldValue('custrecord_lhk_rit_transfer_price', '0.00');
		nlapiSetFieldValue('custrecord_lhk_rit_transfer_amount', '0.00');
	}
}

var beforeSubmit = function(type){
}

var afterSubmit = function(type){

	if(type == 'create')
	{
		//Get Rotation Inventory Details
		var obj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var rotationId = obj.getFieldValue('custrecord_lhk_ria_originalrotation');

		//Create New Rotation Record
		var newRotRec = createNewRotationRecord(obj);

		//Create Inventory Adjustment
		createInventoryAdjustment(obj, newRotRec);		
		
		//Update Rotation Record
		updateRotationRecord(rotationId);
	}

	if(type == 'edit')
	{
		//Get Rotation Inventory Details
		var obj = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
		var rotationId = obj.getFieldValue('custbody_original_rotation');
		
		//Update Rotation Record
		updateRotationRecord(rotationId);
	}
}

var createInventoryAdjustment = function(obj, newRotRec){
	
	var date = obj.getFieldValue('custrecord_lhk_ria_date');
	var item = obj.getFieldValue('custrecord_lhk_ria_item'); //Item
	var location = obj.getFieldValue('custrecord_lhk_ria_location');
	var originalRotationRecord = obj.getFieldValue('custrecord_lhk_ria_originalrotation');
	var newRotationRecord = obj.getFieldValue('custrecord_lhk_ria_newrotationrecord');
	var isCreateNewRotation = obj.getFieldValue('custrecord_ria_nonewrotation'); 
	var account = obj.getFieldValue('custrecord_ria_writeoffaccount'); 
	
	
	var originalRotation = nlapiLookupField(ROTATION_RECORD, obj.getFieldValue('custrecord_lhk_ria_originalrotation'), 'name');
	var newRotation = obj.getFieldValue('custrecord_lhk_ria_newrotation');
	
	//Negative Quantity
	var oldPackSize = obj.getFieldValue('custrecord_lhk_ria_originalpacksize');
	var oldQtyToBreak = parseInt(obj.getFieldValue('custrecord_lhk_ria_qtytobreak')) * -1;
	
	//Positive Quantity
	var newPackSize = obj.getFieldValue('custrecord_lhk_ria_newunitstype');
	var newCaseBottle = obj.getFieldValue('custrecord_new_case_bottle');

	var createObj = nlapiCreateRecord('inventoryadjustment');
	
	if(!isBlank(account))
	{
		createObj.setFieldValue('account', account); //Wine Write Off Account
	}
	else
	{
		createObj.setFieldValue('account', '53'); //3200 Opening Balance
	}

	createObj.setFieldValue('trandate', date); //Date
	createObj.setFieldValue('adjlocation', location); //Location
	
	log.write('------ Inventory  Adjustment Details START ------');
	
	log.write('Date: ' + date + ' | Original Rotation: ' + originalRotationRecord + ' | New Rotation: ' + newRotationRecord + ' | Account: ' + account);
	
	log.write('------ Inventory  Adjustment Details END ------');

	createObj.insertLineItem('inventory', 1);
	createObj.setLineItemValue('inventory', 'item', 1, item);
	createObj.setLineItemValue('inventory', 'units', 1, oldPackSize);
	createObj.setLineItemValue('inventory', 'adjustqtyby', 1, oldQtyToBreak);  //Negative adjustment
	createObj.setLineItemValue('inventory', 'location', 1, location);
	createObj.setLineItemValue('inventory', 'memo', 1, originalRotation);
	
	
	createObj.insertLineItem('inventory', 2);
	createObj.setLineItemValue('inventory', 'item', 2, item);
	createObj.setLineItemValue('inventory', 'units', 2, newPackSize);
	createObj.setLineItemValue('inventory', 'adjustqtyby', 2, newCaseBottle);  //Negative adjustment
	createObj.setLineItemValue('inventory', 'location', 2, location);	
	createObj.setLineItemValue('inventory', 'memo', 2, newRotation);
	
	log.write('------ Adjustment Details START ------');
	log.write('Item: ' + item + ' | Units: ' + oldPackSize + ' | Quantity: ' + oldQtyToBreak + ' | Location : ' +  location + ' | memo: ' +  originalRotation);	
	log.write('Item: ' + item + ' | Units: ' + newPackSize + ' | Quantity: ' + newCaseBottle + ' | Location : ' +  location + ' | memo: ' +  newRotation);
	log.write('------ Adjustment Details END ------');
	
	createObj.setFieldValue('custbody_original_rotation', originalRotationRecord);
	
	if(newRotRec != 0)
	{	
		createObj.setFieldValue('custbody_new_rotation_record', newRotRec);
	}
	
	var inventoryAdjustmentID = nlapiSubmitRecord(createObj, true);
	
	if(!isBlank(inventoryAdjustmentID))
	{
		log.write('Inventory Adjustments ID: ' + inventoryAdjustmentID);
		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_ria_inventoryadjustment', inventoryAdjustmentID); //Submit a link to the Rotation Inventory Adjustment record for this new Inventory Adjustment record
		
		if(newRotRec != 0)
		{
			nlapiSubmitField('customrecord_rotation', newRotRec, 'custrecord_lhk_po_link', inventoryAdjustmentID);  //Submit a link to the NEW Rotation record for this new Inventory Adjustment record
		}
	}
}

var createNewRotationRecord = function(obj){

	var rotationRecord = obj.getFieldValue('custrecord_lhk_ria_originalrotation');

	log.write('------ Create New Rotation Record START ------');
	log.write('Original Rotation: ' + rotationRecord);
	
	var create = nlapiCopyRecord('customrecord_rotation', rotationRecord);

	var name = obj.getFieldValue('custrecord_lhk_ria_newrotation'); //Name
	var packSize = obj.getFieldValue('custrecord_lhk_ria_newunitstype'); //Pack Size
	var newBaseQuantity = obj.getFieldValue('custrecord_ria_new_case_bottle'); //Base Units Available
	var newCaseBottle = obj.getFieldValue('custrecord_new_case_bottle');
	var newCurrencyCost = obj.getFieldValue('custrecord_ria_new_currency_cost');
	var newGbpCost = obj.getFieldValue('custrecord_ria_gpb_cost');
	
	create.setFieldValue('name', name);
	create.setFieldValue('custrecord_rotationname', name);
	create.setFieldValue('custrecord_loyqtyordered', newBaseQuantity);
	create.setFieldValue('custrecord_lotqtysold', 0);
	create.setFieldValue('custrecord_loycurrentavailable', newBaseQuantity);
	create.setFieldValue('custrecord_item_received', newBaseQuantity);
	create.setFieldValue('custrecord_rotation_item_units_available', newCaseBottle);
	create.setFieldValue('custrecord_rotation_item_units_sold', 0);
	create.setFieldValue('custrecord_rotation_item_units_purchased', newCaseBottle);
	create.setFieldValue('custrecord_rotation_unitscost', newCurrencyCost);
	create.setFieldValue('custrecord_rotation_polineunits', packSize);
	create.setFieldValue('custrecord_rotation_unitscost', newCurrencyCost);
	create.setFieldValue('custrecord_rotation_gbp_unitcost', newGbpCost);
	
	log.write('Name: ' + name + ' | Pack size: ' + packSize + ' | Base Units: ' + newBaseQuantity);
	log.write('Case Units: ' + newCaseBottle + ' | Cost: ' + newCurrencyCost + ' | ' + newGbpCost);
	log.write('------ Create New Rotation Record END ------');
	
	try
	{
		var isCreateNewRotation = obj.getFieldValue('custrecord_ria_nonewrotation'); 
		if(isCreateNewRotation == 'F')
		{
			var newRotationRecordID = nlapiSubmitRecord(create, true);
			log.write('New Rotation ID: ' + newRotationRecordID);
			nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_lhk_ria_newrotationrecord', newRotationRecordID);
			return newRotationRecordID;
		}
		else
		{
			return 0;
		}
	}
	catch(ex)
	{
		log.error(ex);
	}
}

/**
* @fileOverview
* @name Innov.UE.LHK.PO.Rotation.js
* @author Innov - Eli Beltran
* 07-24-2012
* @version 1.0
* Deployed as User-Event Script on Purchase Order Record
* @description: Rotation Record Script
* 07-25-2012
* Added function: 'storeExchangeRate'
*	Created a hidden field 'custbody_exchange_rate_static' that store the value of Exchange Rate on creation of the PO.
*	On Item Receipt and Bill (of that PO) the exchange rate is forced to set on whatever value set on the custom field
*/

var log = new Log('DEBUG');

var beforeSubmit = function(type){

	if(type == 'delete')
	{
		log.write('Before Submit Type: ' + type);

		var poNum = nlapiGetFieldValue('tranid');
		log.write('PO Number: ' + poNum);

		//Loop on all Item lines with Rotation record
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		var poNum = nlapiGetFieldValue('tranid');
		log.write('PO Number: ' + poNum);

		////PO Num; Use as a parameter on the search to delete all the Rotation Record associated with the PO
		var params = [];
		params['custscript_rotation_ponumber'] = poNum;
		nlapiScheduleScript('customscript_innov_delete_rotation', 'customdeploy1', params);
	}
}

var afterSubmit = function(type){

	log.write('After Submit Type: ' + type);

	if(type == 'create')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();
		var obj = nlapiLoadRecord(recordType, recordId);

		if(!isBlank(obj))
		{
			storeExchangeRate(obj);
			nlapiSubmitRecord(obj, true);
		}
	}

	if(type == 'edit')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);

		var obj = nlapiLoadRecord(recordType, recordId);
		var POLineOrderType = obj.getFieldValue('custbody_po_order_type'); //PO Order Type
		var POExpectedDelivery = obj.getFieldValue('custbody_receiveby'); //Receipt Due Date
		var POLineCurrency = obj.getFieldValue('currency'); //Currency
		var POLineExchangeRate = obj.getFieldValue('exchangerate'); //Exchange Rate
		var PurchaseDate = obj.getFieldValue('trandate'); //Date
		var PONumber = obj.getFieldValue('tranid'); //PO Number
		var POLocation = obj.getFieldValue('location'); //Location

		var itemCount = obj.getLineItemCount('item');

		log.write('Item Count: ' + itemCount);

		if(itemCount > 0)
		{
			var getAllRotationRecord = [];

			for(var i = 1; i <= itemCount; i++)
			{
				var rotationFields = [];
				var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
				
				if(!isBlank(rotationRecord))
				{
					getAllRotationRecord.push(rotationRecord);
				}

				//Get Line Item Values
				var item = obj.getLineItemValue('item', 'item', i); //Item
				var quantity = obj.getLineItemValue('item', 'quantity', i); //Quantity
				var uom = obj.getLineItemValue('item', 'custcol_fhl_uom', i); //Item UOM
				var units = obj.getLineItemValue('item','units', i); //Units
				var rate = parseFloat(obj.getLineItemValue('item','rate', i));
				var gbpcost = parseFloat(rate * POLineExchangeRate);
				var unitsConversionRate = obj.getLineItemValue('item','unitconversionrate', i); //Units

				log.write('Rotation Record: ' + rotationRecord);

				if(!isBlank(rotationRecord))
				{
					rotationFields.push
					(
						{
							'rotationId' : rotationRecord,
							'item' : item,
							'quantity' : quantity,
							'uom' : uom,
							'rate' : rate,
							'units' : units,
							'gbpcost' : gbpcost,
							'poordertype' : POLineOrderType,
							'poexpecteddelivery' : POExpectedDelivery,
							'polinecurrency' : POLineCurrency,
							'polineexchangerate' : POLineExchangeRate,
							'purchasedate' : PurchaseDate,
							'ponumber' : PONumber,
							'polocation' : POLocation,
							'unitsrate' : unitsConversionRate
						}
					);
	
					if(!isBlank(rotationRecord) && !isBlank(rotationFields))
					{
						log.write('---- Update Rotation Record ----');
						updateRotationRecord(type, rotationFields);
					}
				}
			}
		}

		//Validate if there are deleted lines
		//Search Rotation Record associated in this PO.
		var activeRotation = getActiveRotationRecord(recordId);
		
		for(var z in activeRotation)
		{
			for(var y in getAllRotationRecord)
			{
				if(activeRotation[z] == getAllRotationRecord[y])
				{
					log.write('Active Rotation: ' + activeRotation[z]);
					nlapiSubmitField('customrecord_rotation', activeRotation[z], 'isinactive', 'F');
					break;
				}
				else
				{
					log.write('Not in Rotation: ' + activeRotation[z]);
					//Deactivate
					nlapiSubmitField('customrecord_rotation', activeRotation[z], 'isinactive', 'T');
				}
			}
		}
		
	}
}

var getActiveRotationRecord = function(poNum){
	var filters =
	[
		new nlobjSearchFilter('custrecord_lhk_po_link', null, 'is', poNum),
		new nlobjSearchFilter('isinactive', null, 'is', 'F')
	];

	var s = nlapiSearchRecord('customrecord_rotation',null, filters, null);
	var activeRotation = [];

	if(s != null)
	{
		for (var a = 0; a < s.length; a++)
		{
			activeRotation.push(s[a].getId());
		}
	}

	return activeRotation;
}

var updateRotationRecord = function(type, rotationFields){

	if(type == 'edit')
	{
		
		var quantity2 = parseInt(rotationFields[0].quantity) * parseInt(rotationFields[0].unitsrate);
		
		//Update Rotation Record
		var rotRecord = nlapiLoadRecord('customrecord_rotation', rotationFields[0].rotationId);
		rotRecord.setFieldValue('custrecord_lotitem', rotationFields[0].item);
		rotRecord.setFieldValue('custrecord_loyqtyordered', quantity2);
		rotRecord.setFieldValue('custrecord_loycurrentavailable', quantity2);
		rotRecord.setFieldValue('custrecord_item_uom', rotationFields[0].uom);
		rotRecord.setFieldValue('custrecord_rotation_ordertype', rotationFields[0].poordertype);
		rotRecord.setFieldValue('custrecord_rotation_expecteddelivery', rotationFields[0].poexpecteddelivery);
		rotRecord.setFieldValue('custrecord_rotation_currency', rotationFields[0].polinecurrency);
		rotRecord.setFieldValue('custrecord_rotation_fxrate', rotationFields[0].polineexchangerate);
		rotRecord.setFieldValue('custrecord_rotation_unitscost', rotationFields[0].rate);
		rotRecord.setFieldValue('custrecord_rotation_polineunits', rotationFields[0].units);
		rotRecord.setFieldValue('custrecord_rotation_item_units_purchased', rotationFields[0].quantity);  //Case(s)/Bottle(s) on PO
		rotRecord.setFieldValue('custrecord_rotation_item_units_available', rotationFields[0].quantity); //Removed 08.06.2012 as per LHK Customisation Test Cases 140712_v3Examples Docs
		rotRecord.setFieldValue('custrecord_rotation_gbp_unitcost', rotationFields[0].gbpcost);
		rotRecord.setFieldValue('custrecord_rotation_purchase_date', rotationFields[0].purchasedate);
		rotRecord.setFieldValue('custrecord_rotation_ponumber', rotationFields[0].ponumber);
		rotRecord.setFieldValue('custrecord_rotation_location', rotationFields[0].polocation);

		try
		{
			var id = nlapiSubmitRecord(rotRecord, true);
		}
		catch(ex)
		{
			log.error(ex);
		}

	}
	else if(type == 'delete')
	{
		log.write('Delete Rotation Record: ' + rotationRecord);
		var PO_CLOSED = '1';
		//Set status of rotation record to po-closed
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_status', PO_CLOSED); //Item Receipt Record
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'isinactive', 'T'); //Item Receipt Record
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rot_tbd', 'T'); //Item Receipt Record
	}
}

var storeExchangeRate = function(obj){
	var exchangerate = obj.getFieldValue('exchangerate');
	obj.setFieldValue('custbody_exchange_rate_static', exchangerate);
}

var log = new Log('DEBUG');

var beforeSubmit = function(type){

	var poNum = nlapiGetFieldValue('tranid');
	log.write('PO Number: ' + poNum);

	if(type == 'delete')
	{
		log.write('Before Submit Type: ' + type);

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

	if(type == 'edit')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);

		var obj = nlapiLoadRecord(recordType, recordId);

		log.write('Object' + obj);

		var itemCount = obj.getLineItemCount('item');
		log.write('Item Count: ' + itemCount);

		if(itemCount > 0)
		{
			for(var i = 1; i <= itemCount; i++)
			{
				var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
				var pofxrate = parseFloat(obj.getLineItemValue('item', 'exchangerate', i));
				var linerate = parseFloat(obj.getLineItemValue('item','rate', i));
				var gbpcost = parseFloat(linerate * pofxrate);

				var quantity = obj.getLineItemValue('item', 'quantity', i); //Amount Reserved (linked to SO)

				log.write('Rotation Record: ' + rotationRecord + ' | Quantity: ' + quantity);

				if(!isBlank(rotationRecord) && !isBlank(quantity))
				{
					updateRotationRecord(type, rotationRecord, quantity, pofxrate, gbpcost);
				}
			}
		}
	}

}

var updateRotationRecord = function(type, rotationRecord, quantity, pofxrate, gbpcost){

	if(type == 'edit')
	{
		//Update Base Unit Purchased
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_loyqtyordered', quantity);
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_loycurrentavailable', quantity);
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_item_units_purchased', quantity); //GPB Cost
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_item_units_available', quantity); //GPB Cost
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_fxrate', pofxrate); //FX rate
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_gbp_unitcost', gbpcost); //GPB Cost
	
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
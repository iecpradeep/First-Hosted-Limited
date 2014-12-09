/**
* @fileOverview
* @name Innov.UE.LHK.ItemFullfillment.PO.Vendor.Credits.js
* @author Innov - Eli Beltran
* 07-12-2012
* @version 1.0
* Deployed as User-Event Script on Item Fulfillment
* @description: Update the Rotation Record - returned item less received on the Rotation record.
* Will only work on items Item Fulfillment = Vendor Auth type.
* Will set the Rotation Shipping Status record back to 'With Supplier'
*/

var log = new Log('DEBUG');

var afterSubmit = function(type){

	log.write('Type: ' + type);

	if(type == 'create')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);

		var obj = nlapiLoadRecord(recordType, recordId);
		var orderType = obj.getFieldValue('ordertype');

		log.write(orderType);

		if(orderType == 'VendAuth')
		{
			var itemCount = obj.getLineItemCount('item');
			log.write('Item Count: ' + itemCount);
	
			if(itemCount > 0)
			{
				for(var i = 1; i <= itemCount; i++)
				{
					var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
					var quantity = obj.getLineItemValue('item', 'quantity', i); //Amount Reserved (linked to SO)
	
					log.write('Rotation Record: ' + rotationRecord + ' | Quantity: ' + quantity);
	
					if(!isBlank(rotationRecord) && !isBlank(quantity))
					{
						try
						{
							updateRotationRecord(type, rotationRecord, quantity, recordId);
						}
						catch(ex)
						{
							log.error(ex);
						}
					}
				}
			}
		}
	}
}

var updateRotationRecord = function(type, rotationRecord, quantity, recordId){
	
	var log = new Log('DEBUG');
	
	if(type == 'create')
	{
		//Update Base Unit Purchased
		nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_shippingstatus', '1'); // Shipping Status = 'With Supplier'
		
		//Load Rotation Record
		
		var obj = nlapiLoadRecord('customrecord_rotation', rotationRecord);
		if(!isBlank(obj))
		{
			var received = obj.getFieldValue('custrecord_item_received');
			//Deduct Received to Returned
			var newQuantity = parseInt(received) - parseInt(quantity) ;
			//Set new Received Value;
			obj.setFieldValue('custrecord_item_received', newQuantity);
			try
			{
				var id = nlapiSubmitRecord(obj, true);
				log.write('Updated Rotation Record ID: ' + id + ' | Received set to : ' + newQuantity);
			}
			catch(ex)
			{
				log.error(ex);
			}
		}
	}
}
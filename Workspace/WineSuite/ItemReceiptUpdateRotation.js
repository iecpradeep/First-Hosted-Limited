/**
* @fileOverview
* @name Innov.Innov.UE.LHK.ItemReceipt.SO.js
* @author Innov - Eli Beltran
* 07-18-2012
* @version 1.0
* Deployed as User-Event Script on Item Receipt
* @description: Update the Rotation Record 
* For Vendor Authorization Type:
* - Quantity Received less the Base Units Sold 	
* - Quantity Received plus the Base Units Available
* For Purchase Order Type:
* - Quantity Received plus the Base Units Available
* 07-25-2012
* - Set Rotation Record status to 'In Stock' on Item Receipt
*/

var log = new Log('DEBUG');

var afterSubmit = function(type){

	log.write('Type: ' + type);

	if(type == 'create')
	{
		var recordType = nlapiGetRecordType(); //itemreceipt
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);

		var obj = nlapiLoadRecord(recordType, recordId);
		var orderType = obj.getFieldValue('ordertype');
		
		if(orderType == 'PurchOrd') //Will Only Work on Purchase Order
		{
			var itemCount = obj.getLineItemCount('item');
			log.write('Item Count: ' + itemCount);
	
			if(itemCount > 0)
			{
				for(var i = 1; i <= itemCount; i++)
				{
					var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
	
					if(!isBlank(rotationRecord))
					{
						try
						{
							updateRotationRecord(type, orderType, rotationRecord);
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
};

var updateRotationRecord = function(type, orderType, rotationRecord){
	
	var log = new Log('DEBUG');
	
	if(type == 'create')
	{
		if(orderType == 'PurchOrd')
		{
			//Load Rotation Record
			var obj = nlapiLoadRecord('customrecord_rotation', rotationRecord); // Shipping Status = 'With Supplier'
			
			if(!isBlank(obj))
			{
				try
				{
					var IN_STOCK = '3';
					//Set new Received Value;
					obj.setFieldValue('custrecord_rotation_shippingstatus', IN_STOCK); //Set to Instock
					var id = nlapiSubmitRecord(obj, true);
					log.write('Updated Rotation Record ID: ' + id);
				}
				catch(ex)
				{
					log.error(ex);
				}
			}				
		}
	}
}
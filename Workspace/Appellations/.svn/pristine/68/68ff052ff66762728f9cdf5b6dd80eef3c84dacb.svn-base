/**
* @fileOverview
* @name Innov.UE.LHK.Vendor.Return.Authorization.js
* @author Innov - Eli Beltran
* 08-10-2012
* @version 1.0
* Deployed as User-Event Script on Vendor Return Authorization
* @description:
* 1.	Edit existing Rotation on each line
* 2.	Units Qty set into custrecord_rotation_item_units_purchased
* 3.	No Change into custrecord_rotation_item_units_available
* 4.	No change into custrecord_rotation_item_units_sold
* 5.	No Further details updated as this will be controlled by editing the PO lines.
*/

var log = new Log('DEBUG');

var afterSubmit = function(type){
	if(type == 'create')
	{
		var recordType = nlapiGetRecordType();
		
		if(recordType == 'vendorcredit' || recordType == 'vendorreturnauthorization')
		{
			var obj = nlapiLoadRecord(recordType, nlapiGetRecordId());
			var createdfrom = obj.getFieldValue('createdfrom');
			
			if(recordType == 'vendorcredit' && isBlank(createdfrom))
			{
				//Halt Script if Vendor Credit is not from Bill
				return false;
			}
			
			var count = obj.getLineItemCount('item');
			if(count > 0)
			{
				for(var i = 1; i <= count; i++)
				{
					var quantity = obj.getLineItemValue('item', 'quantity', i);
					var rotationID = obj.getLineItemValue('item', 'custcol_tran_rotation', i);
					if(!isBlank(rotationID))
					{
						//Get Purchased Available in Rotation Record
						//var rotationPOQty = nlapiLookupField('customrecord_rotation', rotationID, 'custrecord_rotation_item_units_purchased');
						var rotationPOQty = nlapiLookupField('customrecord_rotation', rotationID, 'custrecord_item_received');
						if(!isBlank(rotationPOQty))
						{
							var currentQty = parseInt(rotationPOQty);
							var returnQty = parseInt(quantity);
							var newQty = currentQty - returnQty;
							if(newQty >= 0)
							{
								//New Quantity
								//nlapiSubmitField('customrecord_rotation', rotationID, 'custrecord_rotation_item_units_purchased', newQty);
								nlapiSubmitField('customrecord_rotation', rotationID, 'custrecord_item_received', newQty);
							}
						}
					}
				}
			}
		}
	}
}

function createSoldItemStorage()
{

var numLines = nlapiGetLineItemCount('item');
var custrecord_parent_customer = nlapiGetFieldValue('entity');
var custrecord_processing_transaction = nlapiGetFieldValue('createdfrom');


		if (numLines > 0)
		{
		for (i=1; i <= numLines; i++)
			{
			nlapiSelectLineItem('item', i);
			var Selected = nlapiGetCurrentLineItemValue('item', 'item');
			var custrecord_item_record = nlapiGetCurrentLineItemValue('item', 'item');
			var custrecord_item_qty = nlapiGetCurrentLineItemValue('item', 'quantity');
			var custrecord_item_lot = nlapiGetCurrentLineItemValue('item', 'custcol_tran_rotation');
			
			if (custrecord_item_record != 28)
				{
				var newSoldItemRecord = nlapiCreateRecord('customrecord_lot_reservation');
	
				newSoldItemRecord.setFieldValue('custrecord_parent_customer', custrecord_parent_customer);
				newSoldItemRecord.setFieldValue('custrecord_processing_transaction', custrecord_processing_transaction);
				newSoldItemRecord.setFieldValue('custrecord_item_record', custrecord_item_record);
				newSoldItemRecord.setFieldValue('custrecord_item_qty', custrecord_item_qty);
				newSoldItemRecord.setFieldValue('custrecord_item_lot', custrecord_item_lot);
				newSoldItemRecord.setFieldValue('custrecord_line_processed', custrecord_line_processed);
						
						
						try
							{
							var reservationID = nlapiSubmitRecord(newSoldItemRecord);
							}
							catch (soldLineError)
							{
							nlapiLogExecution('ERROR','Error in Submission', soldLineError);
							}
				}
			}
		}
return true;
}
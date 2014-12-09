function saleOrderWeb(type,record)
{
	try
	{
		var actualRecordid = nlapiGetRecordId(); 
		var actualRecord = nlapiLoadRecord('salesorder', actualRecordid);
       		var source = nlapiGetFieldValue('source');
		
		var currentContext = nlapiGetContext();   

		//if(currentContext.getExecutionContext()=="webstore")
		//{

			//set location to Iternet fulfillment center
			var itemqty = actualRecord.getLineItemCount('item');
			for(var i = 1; i<=itemqty; i++)
			{
				actualRecord.selectLineItem('item', i);
				rotation=actualRecord.getCurrentLineItemValue('item','custcol_rotation_website');
				actualRecord.setCurrentLineItemValue('item','custcol_tran_rotation',rotation);
				actualRecord.commitLineItem('item');

			}

			nlapiSubmitRecord(actualRecord);	
	
		//}
		
	}catch(e){	
		nlapiLogExecution('ERROR', 'Source',e);
	} 

}


function updateShipmentDates()
{
	
	// load open sales orders
	
	var orderSearchResults = nlapiSearchRecord('salesorder','customsearch_updateshipmentdates');
	
	for (var i=0; orderSearchResults != null && i < orderSearchResults.length; i++)
	{
		var orderResult = orderSearchResults[i];

		var orderRecord = nlapiLoadRecord('salesorder',orderResult.getId());

		lineCount = orderRecord.getLineItemCount('item');
		
		// Note first line item is line id 1 not 0
		for (var lineNum=1; lineCount != null && lineNum <= lineCount; lineNum++)
		{
			lineShipId = orderRecord.getLineItemText('item','custcol1',lineNum);
						
			if (lineShipId != null && lineShipId != '')
			{
				
				switch(lineShipId) 
				{
					case '1':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody6'));
						break;
					
					case '2':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody7'));
						break;

					case '3':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody8'));
						break;

					case '4':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody9'));
						break;

					case '5':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody10'));
						break;

					case '6':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody20'));
						break;

					case '7':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody21'));
						break;

					case '8':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody22'));
						break;

					case '9':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody23'));
						break;

					case '10':
						orderRecord.setLineItemValue('item', 'custcol2',lineNum,orderRecord.getFieldValue('custbody24'));
						break;



				} //switch
				
			} //if
			
		} //for lineNum
	
		nlapiSubmitRecord(orderRecord,false,false);
		
	} //for i
		
	return true;
		
} //function

function removeLines()
{
	var lineCount = nlapiGetLineItemCount('item');
	//alert(lineCount);
	
	for (var lineNum = 1; lineNum <= lineCount; lineNum++)
	{
		var checked = nlapiGetLineItemValue('item','custcol_removeline',lineNum);
		
		//alert(checked);
		if (checked == 'F') 
		{	
			nlapiSelectLineItem('item',lineNum);
			nlapiRemoveLineItem('item');
			lineNum--;
				
		} //if
		
	} //for
	
} //function removeLines

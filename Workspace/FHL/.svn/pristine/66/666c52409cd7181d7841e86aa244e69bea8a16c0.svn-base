function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID='not found';
	
	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	
	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
		
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('comments');
		
		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);
		
		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('comments');
			}
		}
	}
	catch(e)
	{
		//errorHandler(e);
	}     	      
	
	return internalID;
}


function deletePayments()
{
	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter('createdby', null, 'is', '19964'); //change this to employee ID
	itemSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');                         

	// search columns
	itemSearchColumns[0] = new nlobjSearchColumn('trandate');

	var searchresults = nlapiSearchRecord('customerpayment', null, itemSearchFilters, itemSearchColumns);

	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		try
		{
			var searchresult = searchresults[ i ];
			nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());
		}
		catch(e)
		{
			
			// ignore it
		}
	}
}
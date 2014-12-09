/*****************************************
 * Name:	 Expense Report Customisations
 * Author:   FHL - D Birt - A Nixon - P Lewis
 * Client: 	 Aepona
 * Date:     03 MAR 2012
 * Version:  1.0.12 - Maintenance 1 version
 ******************************************/

function clearLines()
{
	// search filters
	var clearFilters = new Array();
	
	clearFilters[0] = new nlobjSearchFilter('lastmodified', null, 'onOrBefore',  'daysago02');
	clearFilters[1] = new nlobjSearchFilter('custrecord_exp_claimid', null, 'is',  '@NONE@');

	// search columns
	var clearColumns = new Array();
	
	clearColumns[0] = new nlobjSearchColumn('internalid');
	
	var clearSearchResults = nlapiSearchRecord('customrecord_expenseline', null, clearFilters, clearColumns );
	
	for(var i = 0; i < clearSearchResults.length  ; i++)
	{
		var recordID = clearSearchResults[i].getValue(clearColumns[0]);
	
		nlapiDeleteRecord('customrecord_expenseline', recordID);
		nlapiLogExecution('DEBUG', 'Deleted Record #: ' + recordID);
	}
	
	try
	{
		nlapiLogExecution('DEBUG', 'The number of results returned is: ' + clearSearchResults.length);
	}
	catch(error)
	{
		nlapiLogExecution('ERROR', 'An error occured becasue: ' + error);
	}
	
	return true;
}
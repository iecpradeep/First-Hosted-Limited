/*******************************************************
 * Name:		MRF Offers Customer Suitelet
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 17/09/2012 - Initial version - SB
 * 				1.0.1 - 04/10/2012 - Change to work with multiselect instead of text - SB
 * 				1.0.2 - 05/10/2012 - Bugfix so that it does not return anything if no results found - SB
 *
 * Author:		A. Morganti
 * 				S. Boot
 * 
 * Purpose:		Retrieves Offers Applied from the field 
 * 				custbody_applied_order_offers in the
 * 				custom customer record. 
 * 
 * Script: 		offers_customer_suitelet.js
 * Deploy: 		customdeploy_offers_customer_suitelet
 * 
 *******************************************************/

var debug = request.getParameter('debug');
var inDebug = true;

/**
 * Entry function
 */
function main()
{
	var customerId = request.getParameter('customer');
	
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	var recordId = offersSearch('customrecord_cust_applied_offers', 'custrecord_customer', customerId);
	
	response.write('offersString = "' + recordId + '";');
}

/**
 * generic search - returns internal ID
 * @param table
 * @param fieldToSearch
 * @param valueToSearch
 */
function offersSearch(table, fieldToSearch, valueToSearch)
{
	var offersString = '';

	// Arrays
	var filters = new Array();
	var columns = new Array();

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(fieldToSearch, null, 'anyOf', valueToSearch);

		// return columns
		columns[0] = new nlobjSearchColumn('custrecord_offers');

		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, filters, columns);

		if(itemSearchResults != null)
		{
			if(itemSearchResults.length > 0)
			{
				var searchResult = itemSearchResults[0];
				offersString = searchResult.getValue('custrecord_offers');
			}
		}
	}
	catch(e)
	{
		//errorHandler(e);
	}     	      

	return offersString;
}

/**
 * general error handler
 * 
 * @param e
 */
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error: ' + errorMessage + ' ' + errorDesc, e.toString() );
	updateScreenErrorInformation();

}
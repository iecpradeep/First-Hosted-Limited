/*****************************************************************************
 *	Name		:	consolidatedInvoices
 *	Script Type	:	Scheduled 
 *	Client		: 	Align BV
 *
 *	Version		:	1.0.0 - 15/03/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To create consolidated invoices
 * 
 * 	Script		: 	
 * 	Deploy		: 
 * 
 * 	Library		: 
 * 
 **********************************************************************/
//Declaring global variables
var context = null;
var savedSearch = null;
var soFilters = new Array();
var soFilterIndex = 0;
var columnNameValueIntIds = new Array();
var searchType = null;

/***************************************************************************
 * 
 * consolidateSalesOrders Function - The main function
 * 
 **************************************************************************/
function consolidateSalesOrders()
{
	
	try
	{
		//Call initialiseDates function
		initialise();
		getSavedSearchResults();
		loadSalesOrders();
		
	}
	catch(e)
	{
		errorHandler("consolidateSalesOrders : ", e);
	} 
}




/**********************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * 
 * 
 **********************************************************************/
function initialise()
{
	//getting the context
	context = nlapiGetContext();
	
	//getting the saved search internal id from the script parameters  
	savedSearch = context.getSetting('SCRIPT', 'custscript_savedsearch');

}


/**********************************************************************
 * getSavedSearchResults Function - run and get the parametered saved search's results
 *  
 * 
 **********************************************************************/
function getSavedSearchResults()
{
	//Declaring the local variables
	var loadedSearch = null;
	var resultsSet = null;
	var searchResults = null;
	var columnName = new Array();
	var columns = new Array();
	var columnNameValue = null;
		
	try
	{
		loadedSearch = nlapiLoadSearch(searchType, savedSearch);		//load saved Search
		resultsSet = loadedSearch.runSearch();							//run loaded saved search
		searchResults = resultsSet.getResults(0, 1000);					//get saved search results
	
		columns = searchResults[0].getAllColumns();						//get all the columns in saved search
		searchType = searchResults[0].getRecordType();					//get type of the search
		
		//if there are any result
		if(searchResults != null)
		{
			//iterating through the search results
			for(var i = 0 ; i < searchResults.length; i++)
			{
				//iterating through the columns
				for(var index = 0; index < columns.length ; index++)
				{
					//returns the internal id of the column 
					/*
					 * (note: this will return the internal id of the column in particular saved search type)
					 *  example : if the result is type of 'customer' and the column is 'name', then this will return 'entityid' 
					 */
					columnName[index] =  columns[index].getName();			
					
					columnNameValue = searchResults[i].getValue(columnName[index]);			//getting the value under each column
					//if use searchResults[i].getid() it will not return for each column
				
					nlapiLogExecution('debug', 'columnNameValue id' + [i] ,columnNameValue[i]);
					nlapiLogExecution('debug', 'columnNameValue ' + [i] ,searchResults[i].getValue(columnName[index]));
					
					//getting the internal id of the returned value 
					//Reason : columnNameValue[i] will return the value of particular result under the the column
					columnNameValueIntIds[i] = genericSearch(searchType, columnName[index], columnNameValue);
							
				}
				
			}

			
		}
		else
		{
			nlapiLogExecution('debug', 'results', 'No Results');
		}
	
	}
	catch(e)
	{
		errorHandler("getSavedSearchResults : " ,e);
	} 
	
}



/**********************************************************************
 * getSavedSearchResults Function - run and get the parametered saved search's results
 *  
 *'SalesOrd:B' - Pending Fulfillment
 *'SalesOrd:D' - Partially Fulfilled
 *'SalesOrd:E' - Pending Billing / Partially Fulfilled
 * 
 **********************************************************************/
function loadSalesOrders()
{
	var soColumns = new Array();
	var soResults = new Array();

	try
	{
		nlapiLogExecution('audit', 'columnNameValueIntIds[i]', columnNameValueIntIds);		
		soFilters[soFilterIndex] = new nlobjSearchFilter('type', null, 'is', 'SalesOrd');
		soFilters[soFilterIndex++] = new nlobjSearchFilter('status', null, 'anyof', 'SalesOrd:B','\SalesOrd:D','\SalesOrd:E');
		soFilters[soFilterIndex++] = new nlobjSearchFilter('mainline', null, 'is','T');	
		soFilters[soFilterIndex++] = new nlobjSearchFilter('mainline', null, 'is','T');	
		soFilters[soFilterIndex++] = new nlobjSearchFilter('custbody_ordertypealign', null, 'is',2);	//for consolidation
		
		if(searchType == 'customer')
		{
			soFilters[soFilterIndex++] = new nlobjSearchFilter('entity', null, 'is',columnNameValueIntIds);
		
		}	
		
		if(searchType == 'item')
		{
			soFilters[soFilterIndex++] = new nlobjSearchFilter('item', null, 'is',columnNameValueIntIds);
			
		}	
		
		soColumns[0] = new nlobjSearchColumn('entity');
		soColumns[1] = new nlobjSearchColumn('status');
		soColumns[2] = new nlobjSearchColumn('tranid');
		soColumns[3] = new nlobjSearchColumn('custbody_ordertypealign');

		soResults = nlapiSearchRecord('salesorder', null, soFilters, soColumns);
	
		
		if(soResults != null)
		{
			nlapiLogExecution('debug', 'soResults', soResults.length);
			for(var i = 0; i < soResults.length; i++)
			{
				//nlapiLogExecution('debug', 'soResults entity' +[i], soResults[i].getText(soColumns[0]));
				nlapiLogExecution('debug', 'soResults entity id' +[i], soResults[i].getValue(soColumns[0]));
				nlapiLogExecution('debug', 'soResults status' +[i], soResults[i].getText(soColumns[1]));
				nlapiLogExecution('debug','soResults tran id' +[i], soResults[i].getText(soColumns[2]));
				nlapiLogExecution('debug','soResults tran id' +[i], soResults[i].getText(soColumns[3]));
			}
		}
		else
		{
			nlapiLogExecution('debug', 'results', 'No Results');
		}
	}
	catch(e)
	{
		
		errorHandler("loadSalesOrders : ", e);
	}

}
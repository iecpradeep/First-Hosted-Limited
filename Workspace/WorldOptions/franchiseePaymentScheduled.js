/**************************************************************************************************************************************************************************
 * Name: 			franchiseePaymentReport.js
 * Script Type: 	Scheduled
 * Client: 			World Options
 * 
 * Version: 		1.0.0 - 21/03/2013 - 1st release - AM
 * Author: 			FHL
 * Purpose: 		This script updates all invoices with a payment date to be used on the Payments by Franchisee saved search
 * 		
 * Script: 			custscript_franchiseepaymentscheduled
 * Deploy: 			customdeploy_franchiseepaymentschedule
 * 
 * Library: 		No Library.js [TODO]
 * 
 * Note:			This scheduled script runs every day at 12:00 am and has no End Date
 * 
 **************************************************************************************************************************************************************************/

// Declare Global Variables
var invoiceIds= new Array();
var record = 'invoice';


/*********************************************************************
 * getPayments
 * 
 * Main function that is called by deployment.
 * 
 * @returns {Boolean}
 *********************************************************************/
function getPayments()
{
	// Declare Variables
	var retVal = true;
	try
	{
		updateRecords(record);
	}
	catch(err)
	{
		nlapiLogExecution('error', 'getPayments', e.message);
	}
	return retVal;
}


/********************************************************************
 * updateRecords(recordType)
 * 
 * 
 * @param recordType
 * @returns {Boolean}
 ********************************************************************/
function updateRecords(recordType)
{
	// Declare Variables
	var searchColumns = new Array();
	var searchFilters = new Array();
	var searchResults = null;
	var scriptUsageLimit = 40;
	var submittedInvoice = 0;
	var loadedRecord = null;
	var date = null;
	var retVal = true;
	
	try
	{
		while(invoiceIds != null)
		{
			runSavedSearches();

			for ( var i = 0; i < invoiceIds.length; i++) 
			{
				nlapiLogExecution('error', 'searchPayment invoiceId length', invoiceIds.length);

				loadedRecord = nlapiLoadRecord(recordType, invoiceIds[i]);

				nlapiLogExecution('error', 'searchPayment loadedRecorded', invoiceIds[i]);

				searchColumns[0] = new nlobjSearchColumn('trandate',null,null);

				searchFilters[0] = new nlobjSearchFilter('appliedtotransaction', null, 'is', invoiceIds[i]);

				searchResults = nlapiSearchRecord('customerpayment', null, searchFilters, searchColumns);

				if (searchResults != null)
				{			
					nlapiLogExecution('error', 'searchInvoicesPaidInFull searchResults', searchResults.length);

					for ( var index = 0; index < searchResults.length; index++)
					{
						context = nlapiGetContext();
						nlapiLogExecution('error', 'searchPayment context.getRemainingUsage()', context.getRemainingUsage());
						if(context.getRemainingUsage() <= scriptUsageLimit)
						{
							//reschedule this script.
							nlapiLogExecution('error', 'Recorded Rescheduling for Payment Date field to be updated', 'Units left: ' + context.getRemainingUsage());
							nlapiScheduleScript('customscript_franchiseepaymentscheduled', 'customdeploy_franchiseepaymentschedule');
							return true;//[TODO] - Should only be one return point
						}
						else 
						{
							//Get the date value
							date = searchResults[index].getValue(searchColumns[0]);
							nlapiLogExecution('error', 'searchPayment date', date);
							//Add the date and tick the checkbox.
							loadedRecord.setFieldValue('custbody_paymentdate', date);
							loadedRecord.setFieldValue('custbody_paymentdateadded', 'F');//[TODO] Alter to F
						}
					}
				}
				submittedInvoice = nlapiSubmitRecord(loadedRecord);
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('error', 'searchPayment', e.message);
	}
	return retVal;
}


/********************************************************************
 * runSavedSearches
 * 
 * Runs Saved Search until script usage is reached.
 ********************************************************************/
function runSavedSearches()
{
	// Declare Variables
	var reportName = '';

	try
	{
		reportName = 'customsearch_invoicespaidinfull';

		runSavedSearch(0,1000, reportName);
		runSavedSearch(1000,2000, reportName);
		runSavedSearch(2000,3000, reportName);
		runSavedSearch(3000,4000, reportName);
		runSavedSearch(4000,5000, reportName);
		runSavedSearch(5000,6000, reportName);
		runSavedSearch(6000,7000, reportName);	
	}
	catch(e)
	{
		nlapiLogExecution('error', 'runSavedSearches', e.message);
	}
}


/********************************************************************
 * runSavedSearch(from, to, savedSearch)
 * 
 * @param from
 * @param to
 * @param savedSearch
 ********************************************************************/
function runSavedSearch(from, to, savedSearch)
{	
	// Declare Variables
	var columns = new Array();
	var savedSearchResults = null;
	var runSearch = null;
	var loadSearch = null;
	var arrayIndex = 0;

	try
	{
		//Loading the saved search
		loadSearch = nlapiLoadSearch('transaction', savedSearch);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		savedSearchResults = runSearch.getResults(from,to);

		columns = savedSearchResults[0].getAllColumns();
		
		//if the savedSearchResults array is not empty
		if(savedSearchResults != null)
		{			
			//looping through the array
			for(var index = 0; index < savedSearchResults.length; index++)
			{				
				//Putting the values into the savedSearchResults array
				invoiceIds[arrayIndex] = savedSearchResults[index].getValue(columns[0]);
				arrayIndex++;	
			}
			nlapiLogExecution('error', 'runSavedSearch arrayIndex ', arrayIndex);
		}
		else
		{
			// Set the Array to 0
			arrayIndex = 0;
		}
	}
	catch(e)
	{
		nlapiLogExecution('error', 'runSavedSearch', e.message);
	}
}



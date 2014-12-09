/**************************************************************************************************************************************************************************
 * Name: 			franchiseePaymentReport.js
 * Script Type: 	User Event
 * Client: 			World Options
 * 
 * Version: 		1.0.0 - 21/03/2013 - 1st release - AM
 * Author: 			FHL
 * Purpose: 		When a Payment is saved the field custbody_paymentdate, will have the date added to it. 
 * 					This date is used in the Customer Payment by Franchisee Saved Search.
 * 		
 * Script: 			custscript_franchiseepay
 * Deploy: 			customdeploy_franchiseepaymentreport
 * 
 * Library: 		WO_Library.js
 * 
 **************************************************************************************************************************************************************************/
var searchColumns = new Array();
var searchFilters = new Array();
var invoiceSearchColumns = new Array();
var invoiceSearchFilters = new Array();
var record = 'invoice';
var invoiceId = 0;

/********************************************************************
 * searchPayment
 * 
 * After Submit Function used to call scheduled script franchiseePaymentScheduled.js
 ********************************************************************/
function searchPayment()
{	
	try
	{
		nlapiScheduleScript('customscript_franchiseepaymentscheduled', 'customdeploy_franchiseepaymentschedule');
//		updateRecords(record);
	}
	catch(e)
	{
		nlapiLogExecution('error', 'searchPayment', e.message);
	}
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
	var invNo = 0; 
	try
	{
		invNo = nlapiGetLineItemValue('apply', 'refnum', 1);
		
		invoiceId = genericSearch('invoice', 'tranid', invNo);

		record = nlapiLoadRecord(recordType, invNo);
	
		searchColumns[0] = new nlobjSearchColumn('trandate',null,null);

		searchFilters[0] = new nlobjSearchFilter('appliedtotransaction', null, 'is', invoiceId);

		searchResults = nlapiSearchRecord('customerpayment', null, searchFilters, searchColumns);

		if (searchResults != null)
		{			
			nlapiLogExecution('error', 'searchInvoicesPaidInFull searchResults', searchResults.length);

			for ( var index = 0; index < searchResults.length; index++)
			{
				date = searchResults[index].getValue(searchColumns[0]);
				nlapiLogExecution('error', 'searchPayment date', date);

				record.setFieldValue('custbody_paymentdate', date);
				record.setFieldValue('custbody_paymentdateadded', 'T');
			}
		}
		submittedInvoice = nlapiSubmitRecord(record);
	}
	catch(e)
	{
		nlapiLogExecution('error', 'updateRecords', e.message);
	}
}



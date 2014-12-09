/*************************************************************************
 * Name: UserEvent_CostOfSales_Invoice.js
 * Script Type: Inline HTML Portlet
 * Client: World Options Limited
 * 
 * Version: 1.0.0 - 14th August 2012 - Initial release - PAL
 *   			 1.0.1 - 21st August 2012 - Wrote function afterSubmitCOGSJournal()
 * 
 * Author: FHL
 * Purpose: Creates an IFrame inside an Inline HTML Portlet, and displays the page within it.
 *  
 * Script: customscript_usereventlastactivity
 * Deploy: customdeploy_usereventlastactivity
 *   
 * 
 **************************************************************************/

var invoiceRecordType = 'invoice';
 
var invoiceRecordId = 0;
var invoiceRecord = new nlobjRecord();

var journalRecordId = 0;
var journalRecord = new nlobjRecord();
var journalRecordType = 'journal';

var inDebug = true;
 
 /*********************************
  * main entry point
  * 
  *********************************/
function afterSubmitCOGSJournal()
{
	try
	{
		
	}
	catch(e)
	{
		
	}
}


function logdb(title, description)
{
	try
	{
		
	}
	catch(e)
	{
		
	}
}

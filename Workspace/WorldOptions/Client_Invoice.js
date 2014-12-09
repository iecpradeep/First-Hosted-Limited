/*************************************************************************
 * Name: Client_Invoice.js
 * Script Type: Client
 * Client: World Options Limited
 * 
 * Version: 1.0.0 - 24th August 2012 - Initial release - PAL
 * 
 * Author: FHL
 * Purpose: Client Script Validation and Calculation for Invoice Record.
 *  
 * Script: customscript_clientinvoice
 * Deploy: customdeploy_clientinvoice
 *   
 * 
 **************************************************************************/

var invoiceRecordType = 'invoice';

 
var invoiceRecordId = 0;
var invoiceRecord = new nlobjRecord();

var journalRecordId = 0;
var journalRecord = new nlobjRecord();
var journalRecordType = 'journal';
 
 /*********************************
  * main entry point
  * 
  *********************************/
function clientOnSave()
{
	try
	{
		
	}
	catch(e)
	{
		return confirm('An error has occurred:\n\n' + e.message + '\n\nYou can ignore this error by pressing OK. Press Cancel to stay on the record without saving.');		
	}
	return true;
}

function clientOnChange(type, name, linenum)
{
	
}

/*************************************************************************
 * Name: 	RESTPostTransactions.js
 * Script: 	REST
 * Client: 	Align BV
 * 
 * Version: 1.0.0 - 13 Jun 2012 - 1st release - JM
 * 			1.0.1 - 20 Jul 2012 - amended - apply credit note number 
 *
 * Author: 	FHL
 * Purpose: REST Web Service calls to create audit records which also house the CSV data
 * 			updating an audit record will trigger a user event to load the csv and post invoice/payment/cr
 * 			the user event is called customscript_usereventinvoicepost
 * 
 * Script: customscript_restinvoicepost
 * Deploy: customdeploy_restinvoicepost
**************************************************************************/
 
/**
 * handles the payload from the web service call
 * 
 */
function postCSVTransactionToAudit(datain)
{
	var contents='';
	var retVal = '';

	contents = datain.contents;
		
	retVal = auditTrail(contents);
	
	return retVal;
}

/**
 * creates an audit record and adds the CSV payload to it
 * 1.0.1 split out credit note number
 */
function auditTrail(CSVtopost)
{

	var desc = 'Invoice Post ' + Date();
	var auditID = null;
	var retVal = 'OK';
	var csvSplit = CSVtopost.split(',');
	var invoiceNumber = '';
	var creditNoteNumber = '';
	
	try
	{
		var newAudit = nlapiCreateRecord('customrecord_invoiceaudit');
		
		invoiceNumber = csvSplit[4];
		invoiceNumber = invoiceNumber.substring(6,invoiceNumber.length-6);

		creditNoteNumber = csvSplit[6];
		creditNoteNumber = creditNoteNumber.substring(6,creditNoteNumber.length-6);

		
		newAudit.setFieldValue('name', desc);
		newAudit.setFieldValue('custrecord_description', desc);
		newAudit.setFieldValue('custrecord_processed', 'FALSE');
		newAudit.setFieldValue('custrecord_payload', CSVtopost);
		newAudit.setFieldValue('custrecord_invoicenumber', invoiceNumber);
		newAudit.setFieldValue('custrecord_status', 'Awaiting processing');

		newAudit.setFieldValue('custrecord_creditnote', creditNoteNumber);

		auditID = nlapiSubmitRecord(newAudit, true);
		nlapiLogExecution('DEBUG', 'transaction registered', CSVtopost);
		
	}
    catch(e)
    {
    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
    	retVal = 'Upload Failed';
    }     	      

    return retVal;
}
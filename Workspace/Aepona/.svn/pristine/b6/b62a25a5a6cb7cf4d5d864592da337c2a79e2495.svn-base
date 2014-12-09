/*****************************************************************************
 * Name: library.js
 * Script Type: library
 * Test ML 2
 * Client: Aepona
 * 
 * Version: 1.0.0 - 27th March 2012 - 1st release - JM
 * 
 * Author: John Mackay, FHL
 * Purpose: common library functions
 *****************************************************************************/


/**
 * Log Event - create an event record in customer record type: executionLog
 * 
 * @param module
 * @param message
 */
function logFHLEvent(module,message)
{
	
	var id;
	var record;

	try
	{
	
		record = nlapiCreateRecord('customrecordexecutionlog');
		
		record.setFieldValue('custrecordmodule', module);
		record.setFieldValue('custrecorddetails', message);
	
		id = nlapiSubmitRecord(record, true);
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'logFHLEvent Error', e);
		
	}
		
		
}
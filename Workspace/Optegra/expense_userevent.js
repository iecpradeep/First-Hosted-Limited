/*******************************************************
 * Name: expense_userevent.js - Optegra User Event Script for Expense Report
 * Script Type:	User Event
 *
 * Version:	1.0.0 - Initial Release - PAL
 *
 * Author:	FHL
 * Purpose:	Get the Status of the Expense Report.
 *          
 *******************************************************/
var recordType = '';
var expenseRecord = '';
var expenseRecordID = '';
var expenseStatusID = '';

/***********
 * Entry point to the After Submit for Expense Claim.
 */
 function AfterSubmitGetStatus()

{
	return true;
	try
	{
		expenseRecordID = nlapiGetRecordId();
		recordType = nlapiGetRecordType();
		expenseRecord = nlapiLoadRecord(recordType, expenseRecordID);
		expenseStatusID = expenseRecord.getFieldValue('status');
		nlapiLogExecution('DEBUG','Expense Claim Status', expenseStatusID);
		
		switch(expenseStatusID)
		{
			case "":
			
				break;
			default:
				
				break;
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','Expense Claim Error getting Status', e.message);
	}
	
	return true;
 }

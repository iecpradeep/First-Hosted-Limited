/*****************************************
 * Name:	 Expense Claim Print Link
 * Author:   FHL - P lewis
 * Client: 	 Aepona
 * Date:     07 Feb 2012
 * Version:  1.0.05
 ******************************************/

function AfterSubmitExpense(type)
{
	var ExpenseRecord = '';
	var ExpenseID = nlapiGetRecordId();
	var RecordType = nlapiGetRecordType();
	var ExpenseRecordID = '';
	//On Create, Edit and XEdit of the Transaction...
	if (type == 'create' || type == 'edit' || type == 'xedit') {
		try 
		{
			nlapiLogExecution('DEBUG', 'ExpenseRecord Submit');
			ExpenseRecord = nlapiLoadRecord(RecordType, ExpenseID);
			ExpenseRecord.setFieldValue('custbody_exp_printclaim', 'https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=74&deploy=1&custparam_claimid=' + ExpenseID);
			ExpenseRecordID = nlapiSubmitRecord(ExpenseRecord);
			nlapiLogExecution('DEBUG','Script Check, all successfull.', ExpenseRecordID);
		} 
		catch (e) 
		{
			nlapiLogExecution('ERROR', 'ExpenseRecord Submit Record Error: ', e.message);
		}
	}

	return true;	
}
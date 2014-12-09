/***********************************************************************************************************************
 * Name: 		Journal CSV restriction alert
 * Script Type: User Event
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 06/12/2012 - Initial release - AL
 * 				1.0.1 - 07/12/2012 - Forcing error so the journal cannot be created
 * 				
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	To send alert to finance when the journal is created via CSV with mistakes
 * 				(non-posting accounts are used or cost center is not entered where required)
 * 
 * Script: 		Journal CSV restriction.js
 * Deploy: 		customscript_journalcsvrestrictionalert
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=3853&c=3524453&h=35a60c2eed7509f86786&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/

function beforeSubmit() {
	
	var context = nlapiGetContext();

	if (context.getExecutionContext() == 'csvimport'){

	//var number = nlapiGetFieldValue('tranid');
	//nlapiLogExecution('DEBUG','Number', number);
	var ID = nlapiGetRecordId();
	var user = nlapiGetUser();
	var mail = nlapiLookupField('employee',user,'email');
	nlapiLogExecution('DEBUG','Id', ID);
	var lineNum = nlapiGetLineItemCount('line');
	nlapiLogExecution('DEBUG','Lines', lineNum);

	var errorFound = false;
	
	
	for ( var i = 1; i <= lineNum; i++) {

		var A = nlapiGetLineItemValue('line', 'account', i);
		nlapiLogExecution('DEBUG','A', A);
		
		
		var text = nlapiGetLineItemText('line', 'account', i);
		nlapiLogExecution('DEBUG','text', text);
		
		var startsWith = text.charAt(0);
		nlapiLogExecution('DEBUG','startsWith', startsWith);

		
		var center = String(nlapiGetLineItemText('line','department', i)).length;
		nlapiLogExecution('DEBUG','center', center);

		var B = nlapiLookupField('account',A,'custrecord_posting');
		nlapiLogExecution('DEBUG','B', B);

		
		if ((B == 'F') || (startsWith == '6' && center == 0)
				|| (startsWith == '7' && center == 0)
				|| (startsWith == '8' && center == 0)) {
				errorFound = true;
				nlapiLogExecution('DEBUG','errorFound', errorFound);
		}//if

	}//for

	if (errorFound == true)
		{
		
		//var number = nlapiLookupField('journalentry',ID,'tranid');
				
		//nlapiSendEmail(67307, mail, 'Journal Entry '+ number,'Dear User,<br><br>You created journal which might be invalid. Please check if the accounts used are posting accounts and if cost centers are filled in wherever required.<br><br><a href="https://system.sandbox.netsuite.com/app/accounting/transactions/journal.nl?id='+ ID +'">Open Journal</a>',null,null,null,null);
		nlapiSendEmail(67307, mail, 'Journal Entry','Dear User,<br><br>You are trying to create an invalid journal. Please check if the accounts used are posting accounts and if cost centers are filled in wherever required.',null,null,null,null);
		nlapiSetFieldValue('custbody_journal_restrictions','Please validate journal entry');
			
		}
	}
	else
		{
			return true;
		
		}

	
}
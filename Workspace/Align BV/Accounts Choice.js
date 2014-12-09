/*************************************************************************************************************************
 * Name: 		Bank Accounts Choice/AP Accounts Choice
 * Script Type: User Event
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/07/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Accounts Choice.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1139&c=3524453&h=db54527238304ef8dc7a&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/



/**
 * Applies to Bank Accounts Choice
 */
function BankAccounts() 
{
	var myField = nlapiGetField('account');
	var options = myField.getSelectOptions('101', 'contains');
}

/**
 * Applies to Accounts Choice
 */
function APAccounts()
{	
	var myField = nlapiGetField('account');
	var options = myField.getSelectOptions('201', 'contains');	
}

/**
 * 
 */
function DefAccounts()
{	
	var myField = nlapiGetField('acctdeferral');
	var options = myField.getSelectOptions('146', 'contains');	
}


/*************************************************************************************************************************
 * Name: 		Delete Dead Transactions
 * Script Type: Scheduled
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 17/07/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		deletedeadtransactions.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4128&c=3524453&h=30c55d5883a176052cb1&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @returns {Boolean}
 */
function deleteDeadTransactions()
{
	nlapiDeleteRecord('vendorbill', 12995);
	nlapiDeleteRecord('vendorbill', 9058);
	nlapiDeleteRecord('purchaseorder', 10278);

	return true;
}  //function

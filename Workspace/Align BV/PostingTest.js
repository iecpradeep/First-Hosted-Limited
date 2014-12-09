/***********************************************************************************************************************
 * Name: 		Subsidiary default
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		PostingTest.js
 * Deploy: 		customscript103
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4030&c=3524453&h=47ec34195f6076f9766f&_xt=.js 
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @returns {Boolean}
 */
function PostingAccount() {

	var A = nlapiGetCurrentLineItemValue('line', 'account');
	var text = nlapiGetCurrentLineItemText('line', 'account');
	var startsWith = text.charAt(0);
	var center = String(nlapiGetCurrentLineItemText('line', 'department')).length;


	var record = nlapiLoadRecord('account', A);
	var B = record.getFieldValue('custrecord_posting');


	if (B == 'F') 
	{
		alert('This is non-posting account!');
	}
	else if ((startsWith == '6' && center == 0) || (startsWith == '7' && center == 0))
	{            	
		alert('Cost Center needs to be entered!');
	}
	else
	{

		return true;
	}
}



/**
 * @returns {Boolean}
 */
function Subsidiary()
{
	nlapiSetFieldValue('subsidiary','2', null, true);
	nlapiDisableField('subsidiary', true);
	return true;
}


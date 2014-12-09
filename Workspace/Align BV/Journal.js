/***********************************************************************************************************************
 * Name: 		
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Journal.js
 * Deploy: 		
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4028&c=3524453&h=bbd912b6a669e1bf1360&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @returns {Boolean}
 */
function validate() 
{
	var A = nlapiGetCurrentLineItemValue('line', 'account');
	var text = nlapiGetCurrentLineItemText('line', 'account');
	var startsWith = text.charAt(0);
	var center = String(nlapiGetCurrentLineItemText('line', 'department')).length;
	var customer = String(nlapiGetCurrentLineItemText('line', 'entity')).length;
	var AR = text.substring(0,4);

	var record = nlapiLoadRecord('account', A);
	var B = record.getFieldValue('custrecord_posting');


	if (B == 'F')
	{
		alert('This is non-posting account!');
	}
	else if ((startsWith == '6' && center == 0) || (startsWith == '7' && center == 0) || (startsWith == '8' && center == 0))
	{            	
		alert('Cost Center needs to be entered!');
	}
	else if ((AR == '1161' && customer == 0))
	{
		var alertText = 'You are trying to post on AR account without specifying customer';

		alertText += '\n\nPress OK to continue and add this journal line, \npress CANCEL to return to the journal line.';

		var response = confirm(alertText);

		if (response == true)
		{
			return true;
		} //if
		else
		{
			return false;
		} //else
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

/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function onchange(type, name)
{
	if ((name == 'custbody_journal_type') && (nlapiGetFieldText('custbody_journal_type') == "AR Journal"))
	{
		nlapiSetFieldValue('approved', 'T');
		return true;
	}
	else 
	{
		return true;
	}
}

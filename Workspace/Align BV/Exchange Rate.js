/*************************************************************************************************************************
 * Name: 		Exchange Rate Disable
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 17/07/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Exchange Rate.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4027&c=3524453&h=4553352f4472db679d06&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/



/**
 * @returns {Boolean}
 */
function Exchange()
{		
	nlapiDisableField('exchangerate', true);
	
	return true;	
}

/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function LineInit(type, name)
{	
	if (type == 'Purchase Order')
	{
		nlapiSetCurrentLineItemValue('item','rate', '0');
		return true;
	}
	else
	{
		return true;
	}
}

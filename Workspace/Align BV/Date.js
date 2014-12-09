/*************************************************************************************************************************
 * Name: 		
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release - 
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Date.js
 * Deploy: 		
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4227&c=3524453&h=b373410fd4057f4415c1&_xt=.js 
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function date_check(type,name)
{	
	if (name == 'trandate')
	{
		var today = new Date();
		var trandate = nlapiGetFieldValue('trandate');
		var a = Date.parse(today);
		var x = trandate.split('/');
	    var newdate = x[1] + '/' + x[0] + '/' + x[2];
	    var b = Date.parse(newdate);
    
    	if (b > a)
    	{
			alert ('Date in the future is not allowed');
			nlapiSetFieldValue('trandate','');
    	}
		else
		{
			return true;
		}    	
	}
	else
	{		
		return true;
	}
}

/**
 * 
 */
function taxDisable()
{	
	//Disable line item tax fields
    nlapiDisableLineItemField('expense','taxrate1',true);
    nlapiDisableLineItemField('expense','taxcode',true);
    nlapiDisableLineItemField('expense','tax1amt',true);
    nlapiDisableLineItemField('expense','grossamt',true);
}
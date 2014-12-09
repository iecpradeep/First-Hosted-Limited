/*************************************************************************************************************************
 * Name: 		
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 21/06/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		getID.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1033&c=3524453&h=4267a1c9325b00da600c&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * Get internal ID of a body field
 * 
 * @param type
 * @param name
 * @param linenum
 */
function getBodyFieldID(type, name, linenum)
{
	//only run for current user
	if (nlapiGetUser() == 3)
	{
		//Set field id
		if (name == '')
		{
			//Throw alert showing internal ID
			var reqID = nlapiGetFieldValue(name);
			alert('Internal ID: ' + reqID);
		}
	}
}

/**
 * Get internal ID of a sublist field
 * 
 * @param type
 * @param name
 * @param linenum
 */
function getSublistFieldID(type, name, linenum)
{
	//only run for current user
	//if (nlapiGetUser() == 3)
	//{
		//Set sublist and field ids
		//if (type == '' && name == '')
		//{
			//Throw alert showing ID
			//nlapiSelectLineItem(type, linenum);
			var reqID = nlapiGetCurrentLineItemValue(type, name);
			alert('Field ID: ' + name);
		//}
	//}
}
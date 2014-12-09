/********************************************************************
 * Name:		beforeLoad.js
 * Script Type:	User Event
 *
 * Version:		1.0.1 – 16/11/2012 – 1st release - AM
 *
 * Author:		FHL
 * 
 * Purpose:		A description of the purpose of this script,
 *            	together with its method of deployment.
 * 
 * Script: 		[TODO] The script record id – custscript_script
 * Deploy: 		[TODO] The script deployment record id – customdeploy_script
 *
 * Notes:		[TODO] If the script is linked to a form
 * 
 * Library: 	[TODO]library.js
 * 
 ********************************************************************/


/**
 * before record load
 * 
 * @param type
 * @param form
 */
function beforeLoadButton(type, form)
{

	var currentContext = null;   
//	var currentUserID = 0;

	try
	{

		currentContext = nlapiGetContext();   
		currentUserID = currentContext.getUser();

		if( (currentContext.getExecutionContext() == 'userinterface') && (type == 'edit' || type == 'view'))
		{     
			
			form.addButton('custpage_customer','Call Customer', "callSuitelet");
			form.setScript('customscript_callsuitelet');	
		}	
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'beforeLoadButton', e.message);
	}
}
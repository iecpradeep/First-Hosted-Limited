/*********************************************************************************************************************************************************
 * Name:			voicenetAddBtn.js
 * Script Type:		User Event
 * Client:			Cloud Computing Services
 *
 * Version:			1.0.0 – 15/01/2013 – 1st release - AM
 *
 * Author:			FHL
 * Purpose:			To add a button to the required entity types.
 * 
 * Script: 			custscript_voicenetcustaddbtn
 * Deploy: 			customdeploy_voicenetcustaddbtn - Customer
 * 					customdeploy_voicenetempaddbtn  - Employee
 * 					customdeploy_voicenetsuppaddbtn - Supplier
 * 					customdeploy_voicenetpartaddbtn - Partner
 * 					customdeploy_voicenetcontaddbtn - Contact
 * 
 * Library: 		library.js
 * 
 *
 * Notes:			This script applies a buttons to the customer, employee, supplier, partner and contact forms.
 * 
 *********************************************************************************************************************************************************/


/*****************************************************************************
 * voicenetCallBtn - Call Client script if type is in view.
 * 
 * @param type
 * @param form
 *****************************************************************************/
function voicenetCallBtn(type, form)
{
	try
	{
		if(type == 'view')
		{     
			form.setScript('customscript_voicenetcallclient');	
		}	
	}
	catch(e)
	{
		errorHandler("voicenetCallBtn ", e);
	}
}


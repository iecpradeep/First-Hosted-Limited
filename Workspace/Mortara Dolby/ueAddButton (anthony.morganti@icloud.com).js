/***********************************************************************************************
 * Name: Add Service Report Buttons
 * Script Type: User Event
 * Client: Mortara Dolby
 * 
 * Version: 1.0.0 - 2 May 2012 - 1st release - MJL
 * 			1.0.1 - 28 Feb 2013 - change to reflect generation of Quote instead of SO - MJL
 *
 * Author: Matthew Lawrence, Mike Lewis, FHL
 * Purpose: Add a button on to the case record before load that creates or amends a Sales Order
 * 
 * Sales Order Button:
 * User Event script: Add Create Sales Order Button
 * Script ID: customscript_ue_addsalesorderbutton  
 * Deployment ID: customdeploy_ue_addsalesorderbutton
 * 
 * Service Report Button:
 * User Event script: Add Print Service Report Button
 * Script ID: customscript_ue_addprintsrbutton  
 * Deployment ID: customdeploy_ue_addprintsrbutton
 ***********************************************************************************************/

/**
 * Places custom button before load onto case form in view mode
 *  
 * 1.0.1 change to reflect generation of Quote instead of SO - MJL
 * 
 * @param type
 * @param form
 */ 
function addSOButton(type, form)
{
	if (type == 'view')
	{
		form.addButton('custpage_createsalesorder','Create/Update Quote', "callSOSuitelet"); //1.0.1
		form.setScript('customscript_client_callsosuitelet');	
	}	
}

/**
 * Adds service report button onto form if it is in 'View' mode 
 * @param type
 * @param form
 */
function addSRButton(type, form)
{
	if (type == 'view')
	{
		form.addButton('custpage_printservicereport','Print Service Report','callSRSuitelet');
		form.setScript('customscript_client_callsrsuitelet');
	}
}
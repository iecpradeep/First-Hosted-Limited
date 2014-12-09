/**********************************************************************************************************
 * Name:		Web Store Display Name	
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 26/10/2012 - Initial version - AM
 * 				1.0.1 - 27/10/2012 - Amend comments - AM
 *
 * Author:		A.Morganti
 * 
 * Purpose:		Set field value custitem_storedisplayname to contain 'Store Display Name' 
 * 				value which can be used to display in the web site basket.
 * 
 * Script: 		webstore_displayname.js
 * Deploy:		customdeploy1	Inventory Part
 * Deploy:		customdeploy2	Assembly Build
 * Deploy:		customdeploy3	Item Fulfillment
 * Deploy:		customdeploy4	Non-Inventory Part	
 * Deploy:		customdeploy5	Service	 	
 * Deploy:		customdeploy6	Other Charge Item
 * Deploy:		customdeploy7	Item Group
 * Deploy:		customdeploy8	Kit Item		
 * Deploy: 		customdeploy9	Assembly Unbuild	
 * Deploy:		customdeploy10	Build/Assembly Item	
 * 
 **********************************************************************************************************/


/**
 * @param type
 */
function beforeSubmit(type)
{
	try
	{
		//Define the value of the type argument.
		if ( type == 'create' || type == 'edit')
		{
			// Get the Field Value.
			var displayname = nlapiGetFieldValue('storedisplayname');
			
			// Set the Custom Field.
			nlapiSetFieldValue('custitem_storedisplayname', displayname);
		}
	} 
	catch(e)
	{
		// Handle any Errors that might be thrown.
		nlapiLogExecution('ERROR', 'Type not found: ', e.message);
	}
}


/*****************************************************************************
 * Name:		custNameRegWebUE.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 12/06/2013 - Initial release - SB
 * 				1.0.1 - 24/06/2013 - Update to use Salutation list - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Take name from 3 fields and join to make name field
 * 
 * Script: 		customscript_cust_name_reg_web_ue
 * Deploy: 		customdeploy_cust_name_reg_web_ue
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

/**
 * Main Function
 * @returns
 */
function afterSubmit(type)
{
	try
	{
		// Only when creating a new customer
		if (type == 'create')
		{
			// Load new customer record
			var customerId = nlapiGetNewRecord().getId();
			var customer = nlapiLoadRecord('customer', customerId);
			var salutation = customer.getFieldText('custentity_salutation');
			
			// If there's a salutation in the field, set it to the NetSuite native field
			if (salutation != '')
			{
				customer.setFieldValue('salutation', salutation);
				nlapiSubmitRecord(customer);
			}
		}
	}
	catch(e)
	{
		errorHandler('afterSubmit', e);
	}
	
}
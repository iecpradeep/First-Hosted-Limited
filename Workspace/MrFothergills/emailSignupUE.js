/*****************************************************************************
 * Name:		emailSignupUE.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 28/06/2013 - Initial release - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		
 * 
 * Script: 		customscript_news_email_ue
 * Deploy: 		customdeploy_news_email_ue
 * 				
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

function beforeSubmit(type)
{
	try
	{
		// If creating a new Email Signup
		if (type == 'create')
		{
			// Don't do anything if customer already selected
			var customerId = nlapiGetFieldValue('custrecord_cr_customer');
			
			if (!customerId)
			{
				// Match email and brand to detect duplicate customer
				var email = nlapiGetFieldValue('custrecord_ne_email');
				var brand = nlapiGetFieldValue('custrecord_ne_brand');
				
				var existingCustomer = genericSearchTwoParams('customer', 'email', email, 'custentity_mrf_cust_brand', brand);
				
				var salutation = nlapiGetFieldValue('custrecord_ne_salutation');
				var firstName = nlapiGetFieldValue('custrecord_ne_firstname');
				var lastName = nlapiGetFieldValue('custrecord_ne_lastname');
				var globalSubscriptionStatus = '1'; // Soft Opt-In
				var leadSource = nlapiGetFieldValue('custrecord_ne_leadsource');
				var webLead = 'T';
				
				// Customer exists
				if (existingCustomer > 0 && email && brand)
				{
					// Update Customer
					var customer = nlapiLoadRecord('customer', existingCustomer);
					
					// Update Salutation
					if (salutation)
					{
						customer.setFieldValue('custentity_salutation', salutation);
					}
					
					// Update First Name
					if (firstName)
					{
						customer.setFieldValue('firstname', firstName);
					}
					
					// Update Last Name
					if (lastName)
					{
						customer.setFieldValue('lastname', lastName);
					}
					
					customer.setFieldValue('globalsubscriptionstatus', globalSubscriptionStatus);
					customer.setFieldValue('leadsource', leadSource);
					customer.setFieldValue('weblead', webLead);
					
					nlapiSubmitRecord(customer);
					nlapiSetFieldValue('custrecord_ne_customer', existingCustomer);
				}
				else
				{
					// Create Lead
					var customer = nlapiCreateRecord('lead');
					
					customer.setFieldValue('custentity_mrf_cust_brand', brand);
					customer.setFieldValue('custentity_salutation', salutation);
					customer.setFieldValue('firstname', firstName);
					customer.setFieldValue('lastname', lastName);
					customer.setFieldValue('email', email);
					customer.setFieldValue('globalsubscriptionstatus', globalSubscriptionStatus);
					customer.setFieldValue('leadsource', leadSource);
					customer.setFieldValue('weblead', webLead);
					
					customerId = nlapiSubmitRecord(customer);
					nlapiSetFieldValue('custrecord_ne_customer', customerId);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('beforeSubmit', e);
	}
}
/*****************************************************************************
 * Name:		catRequestUE.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 26/06/2013 - Initial release - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		
 * 
 * Script: 		customscript_cat_req_ue
 * Deploy: 		customdeploy_cat_req_ue
 * 				
 * 
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:                redundant replace by catRequest.js
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * 
 * Library: 	Library.js
 *************************************************************************************/

function beforeSubmit(type)
{
	try
	{
		// If creating a new Catalogue Request
		if (type == 'create')
		{
			// Don't do anything if customer already selected
			var customerId = nlapiGetFieldValue('custrecord_cr_customer');
			
			if (!customerId)
			{
				// Match email and brand to detect duplicate customer
				var email = nlapiGetFieldValue('custrecord_cr_email');
				var brand = nlapiGetFieldValue('custrecord_cr_brand');
				
				var existingCustomer = genericSearchTwoParams('customer', 'email', email, 'custentity_mrf_cust_brand', brand);

				var salutation = nlapiGetFieldValue('custrecord_cr_salutation');
				var firstName = nlapiGetFieldValue('custrecord_cr_firstname');
				var lastName = nlapiGetFieldValue('custrecord_cr_lastname');
				var address1 = nlapiGetFieldValue('custrecord_cr_addr1');
				var address2 = nlapiGetFieldValue('custrecord_cr_addr2');
				var address3 = nlapiGetFieldValue('custrecord_cr_addr3');
				var city = nlapiGetFieldValue('custrecord_cr_city');
				var state = nlapiGetFieldValue('custrecord_cr_state');
				var country = 'GB';
				var zip = nlapiGetFieldValue('custrecord_cr_zip');
				var phone = nlapiGetFieldValue('custrecord_cr_phone');
				var email = nlapiGetFieldValue('custrecord_cr_email');
				
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
					
					// Update Phone
					if (phone)
					{
						customer.setFieldValue('phone', phone);
					}
					
					// If Address 1, City and Zip not empty and don't match a current address, add them
					if (address1 && city && zip)
					{
						var addressFoundLineNumber = 0;
						
						// Loop over current addresses
						for (var i = 1; i <= customer.getLineItemCount('addressbook'); i++)
						{
							var lineAddress1 = customer.getLineItemValue('addressbook', 'addr1', i);
							var lineCity = customer.getLineItemValue('addressbook', 'city', i);
							var lineZip = customer.getLineItemValue('addressbook', 'zip', i);
							
							if (lineAddress1.toLowerCase() == address1.toLowerCase() &&
								lineCity.toLowerCase() == city.toLowerCase() &&
								lineZip.toLowerCase() == zip.toLowerCase())
							{
								addressFoundLineNumber = i;
							}
						}
						
						if (addressFoundLineNumber == 0)
						{
							// Add new address
							customer.selectNewLineItem('addressbook');
							customer.setCurrentLineItemValue('addressbook', 'addr1', address1);
							customer.setCurrentLineItemValue('addressbook', 'addr2', address2);
							customer.setCurrentLineItemValue('addressbook', 'addr3', address3);
							customer.setCurrentLineItemValue('addressbook', 'city', city);
							customer.setCurrentLineItemValue('addressbook', 'state', state);
							customer.setCurrentLineItemValue('addressbook', 'country', country);
							customer.setCurrentLineItemValue('addressbook', 'zip', zip);
							//customer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
							customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
							customer.commitLineItem('addressbook');
						}
						else
						{
							customer.selectLineItem('addressbook', addressFoundLineNumber);
							customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
							customer.commitLineItem('addressbook');
						}
					}
					
					nlapiSubmitRecord(customer);
					nlapiSetFieldValue('custrecord_cr_customer', existingCustomer);
				}
				// Customer doesn't exist
				else
				{
					// Create Customer
					var customer = nlapiCreateRecord('lead');
					
					customer.setFieldValue('custentity_mrf_cust_brand', brand);
					customer.setFieldValue('custentity_salutation', salutation);
					customer.setFieldValue('firstname', firstName);
					customer.setFieldValue('lastname', lastName);
					customer.setFieldValue('phone', phone);
					customer.setFieldValue('email', email);
					customer.setFieldValue('weblead', 'T');
					
					customer.selectNewLineItem('addressbook');
					customer.setCurrentLineItemValue('addressbook', 'addr1', address1);
					customer.setCurrentLineItemValue('addressbook', 'addr2', address2);
					customer.setCurrentLineItemValue('addressbook', 'addr3', address3);
					customer.setCurrentLineItemValue('addressbook', 'city', city);
					customer.setCurrentLineItemValue('addressbook', 'state', state);
					customer.setCurrentLineItemValue('addressbook', 'country', country);
					customer.setCurrentLineItemValue('addressbook', 'zip', zip);
					customer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
					customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
					customer.commitLineItem('addressbook');
					
					customerId = nlapiSubmitRecord(customer);
					nlapiSetFieldValue('custrecord_cr_customer', customerId);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('beforeSubmit', e);
	}
}
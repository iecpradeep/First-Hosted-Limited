/**********************************************************************************************************
 * Name:		caseEmailsUE.js
 * 
 * Script Type:	User Event
 * 
 * Version:		1.0.0 - 14/06/2013 - Initial release - SB
 * 				1.0.1 - 23/06/2013 - Create lead if not already in system - SB
 * 				1.0.2 - 12/07/2013 - Manage duplicate customers - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Find correct customer submitting the Case
 * 				Have some sort of intelligence to automatically categorise Cases
 * 
 * Script: 		
 * Deploy: 		
 * 
 * Libraries:	Library.js
 *  	
 **********************************************************************************************************/

/**
 * Match up the customer submitting the Case
 * @param type
 */
function beforeSubmit(type)
{

	var customerId = 0;
	var filters = new Array();
	var columns = new Array();
	var searchResults = null;
	
	if (type == 'create')
	{
		// Update existing case?
		updateExistingCase();
		
		// Search for Customer where cust:brand = case:brand AND cust:email = case:email
		var caseCompany = nlapiGetFieldText('company');
		var caseBrand = nlapiGetFieldValue('custevent_mrf_campaign_brand');
		var caseEmail = nlapiGetFieldValue('email');
		var caseSalutation = nlapiGetFieldValue('custevent_salutation');
		var caseSalutationText = nlapiGetFieldText('custevent_salutation');
		
		if (/^1 .*/.test(caseCompany)) // 1.0.2 E.g. if '1 Customer, Anonymous'
		{
			// If brand not already set by form
			// Create/Update is being done via email
			if (!caseBrand)
			{
				// Update existing case?
				updateExistingCase();
				
				// Get brand from inbound email mapping
				var inboundEmail = nlapiGetFieldValue('inboundemail');
				
				filters[0] = new nlobjSearchFilter('custrecord_email', null, 'is', inboundEmail);
				
				columns[0] = new nlobjSearchColumn('custrecord_brand_mapping');
				
				searchResults = nlapiSearchRecord('customrecord_support_brand_mapping', null, filters, columns);
				
				if (searchResults)
				{
					// Get the Brand
					caseBrand = searchResults[0].getValue('custrecord_brand_mapping');
					
					// Set it on the case
					nlapiSetFieldValue('custevent_mrf_campaign_brand', caseBrand);
				}
			}
			
			// Find customer
			if (caseEmail && caseBrand)
			{
				customerId = genericSearchTwoParams('customer', 'email', caseEmail, 'custentity_mrf_cust_brand', caseBrand);
				
				// Customer exists
				if (customerId > 0)
				{
					// Set Company field to the customer ID
					nlapiSetFieldValue('company', customerId);
				}
				else // Create customer
				{
					var customer = nlapiCreateRecord('lead');
					
					customer.setFieldValue('custentity_mrf_cust_brand', caseBrand);
					customer.setFieldValue('custentity_salutation', caseSalutation);
					customer.setFieldValue('salutation', caseSalutationText);
					customer.setFieldValue('firstname', nlapiGetFieldValue('custevent_firstname'));
					customer.setFieldValue('lastname', nlapiGetFieldValue('custevent_lastname'));
					customer.setFieldValue('phone', nlapiGetFieldValue('phone'));
					customer.setFieldValue('email', caseEmail);
					customer.setFieldValue('weblead', 'T');
					
					if (nlapiGetFieldValue('custevent_addr1'))
					{
						customer.selectNewLineItem('addressbook');
						customer.setCurrentLineItemValue('addressbook', 'addr1', nlapiGetFieldValue('custevent_addr1'));
						customer.setCurrentLineItemValue('addressbook', 'addr2', nlapiGetFieldValue('custevent_addr2'));
						//customer.setCurrentLineItemValue('addressbook', 'addr3', address3);
						customer.setCurrentLineItemValue('addressbook', 'city', nlapiGetFieldValue('custevent_city'));
						customer.setCurrentLineItemValue('addressbook', 'state', nlapiGetFieldValue('custevent_state'));
						customer.setCurrentLineItemValue('addressbook', 'country', nlapiGetFieldValue('custevent_country'));
						customer.setCurrentLineItemValue('addressbook', 'zip', nlapiGetFieldValue('custevent_zip'));
						customer.setCurrentLineItemValue('addressbook', 'defaultbilling', 'T');
						customer.setCurrentLineItemValue('addressbook', 'defaultshipping', 'T');
						customer.commitLineItem('addressbook');
					}
					
					customerId = nlapiSubmitRecord(customer);
					nlapiSetFieldValue('company', customerId);
				}
			}
		}
//		else // Customer created or manually set
//		{
//			// Check they are not a duplicate
//			var customer = null;
//			customerId = nlapiGetFieldValue('company');
//			
//			// Find customer
//			if (caseEmail && caseBrand)
//			{
//				var existCustomerId = genericSearchTwoParams('customer', 'email', caseEmail, 'custentity_mrf_cust_brand', caseBrand);
//				
//				// Customer exists (newly created customers wouldn't have a brand set at this point)
//				if (existCustomerId > 0)
//				{
//					// Set Company field to the customer ID
//					nlapiSetFieldValue('company', existCustomerId);
//					
//					// Delete duplicate customer record
//					//nlapiDeleteRecord('customer', customerId);
//					
//					// Customer is now the existing customer
//					customerId = existCustomerId;
//				}
//			}
//			
//			customer = nlapiLoadRecord('customer', customerId);
//			
//			// Customer has no brand
//			if (!customer.getFieldValue('custentity_mrf_cust_brand'))
//			{
//				customer.setFieldValue('custentity_mrf_cust_brand', caseBrand);
//				
//				// Make sure salutation is correct
//				customer.setFieldValue('custentity_salutation', caseSalutation);
//				customer.setFieldValue('salutation', caseSalutationText);
//				
//				nlapiSubmitRecord(customer, true);
//			}
//			else if (caseBrand != customer.getFieldValue('custentity_mrf_cust_brand'))
//			{
//				// Fallback to stop call centre staff selecting correct customer, but wrong brand
//				customerId = genericSearchTwoParams('customer', 'email', caseEmail, 'custentity_mrf_cust_brand', caseBrand);
//				
//				if (customerId > 0)
//				{
//					// Set Company field to the customer ID
//					nlapiSetFieldValue('company', customerId);
//				}
//			}
//		}
	}
}

/**
 * If the incoming message has a ref, use it to update existing case
 */
function updateExistingCase()
{
	// Update existing case
	var incomingMessage = nlapiGetFieldValue('incomingmessage');
	var caseIntID = '';
	
	// Parse internal ID out of message body
	var caseRef = incomingMessage.match(/\[#\d+-\d+\]/g);
	if (caseRef)
	{
		caseRef = caseRef[0];
		
		caseIntID = caseRef.match(/-\d+/);
		if (caseIntID)
		{
			caseIntID = caseIntID[0];
			caseIntID = caseIntID.replace('-', '');
			
			if (caseIntID)
			{
				// Load existing case
				var updateCase = nlapiLoadRecord('supportcase', caseIntID);
				
				// Set message
				updateCase.setFieldValue('outgoingmessage', incomingMessage);
				
				// Submit existing case
				nlapiSubmitRecord(updateCase);
				
				// Throw an error to abort new case creation
				throw nlapiCreateError(ERR_CODE.NO_ERR_ABORT_SUBMIT.Code,
				        ERR_CODE.NO_ERR_ABORT_SUBMIT.Msg, true);
			}
		}
	}
}

var ERR_CODE =
{
    NO_ERR_ABORT_SUBMIT : {
        Code:'NO_ERROR_ABORT_SUBMIT', 
        Msg:'Intentionally thrown exception to abort record submit'}
};

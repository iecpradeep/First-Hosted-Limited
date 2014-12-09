/*******************************************************
 * Name:		Offer Add Suitelet
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 03/10/2012 - Initial version - SB
 * 				1.0.1 - 15/10/2012 - Added clear function - SB
 * 				1.1.0 - 24/10/2012 - Add offer driven by offerId (promoCode defunct) - SB
 * 										Implemented customer offer toggling - SB
 * 				1.1.1 - 28/10/2012 - Add a parameter for adding only - SB
 * 				1.1.2 - 21/11/2012 - If customerId not passed, drop out gracefully - SB
 * 				1.1.3 - 22/11/2012 - Store ccode - SB
 * 				1.1.4 - 23/11/2012 - Store text campaign code JM
 *
 * Author:		S. Boot
 * 
 * Purpose:		Add requested offer to the customer's custom record
 * 
 * Script: 		offer_add_suitelet.js
 * Deploy: 		customdeploy_mrf_offer_add_suitelet
 * 
 *******************************************************/

var customerId = 0;
var customerLogin = '';
var clear = '';
var offerId = '0';
var addOnly = false;
var customerCustomRecord = null;
var output = 'Promotion cannot be applied';
var ccode = ''; // 1.1.3

function main()
{
	// Get URL parameters
	customerId = request.getParameter('customer');
	customerLogin = request.getParameter('login');
	offerId = request.getParameter('oid');
	clear = request.getParameter('clear');
	addOnly = request.getParameter('addonly'); // 1.1.1
	ccode = request.getParameter('ccode'); // 1.1.3
	
	if (addOnly == 'T')
	{
		addOnly = true;
	}
	else
	{
		addOnly = false;
	}

	// Check customer ID relates to login
	if (checkCustomer())
	{
		if (offerId)
		{
			// Initialise customer's custom record
			initCustomerCustomRecord();

			// Add it to the applied order offers
			applyOfferToCustomer();
		}
		
		if (ccode)
		{
			// Initialise customer's custom record
			initCustomerCustomRecord();
			
			// Add it to the applied order offers
			applyCcodeToCustomer();
		}
		
		// 1.0.1 - Clearing of offers
		if (clear == 'T')
		{
			// Initialise customer's custom record
			initCustomerCustomRecord();
			
			clearOffers();
		}
	}
	else // 1.1.2
	{
		output = '';
	}
	
	response.write(output);
}

/**
 * Adds a layer of security to check that the customer relates to their login
 */
function checkCustomer()
{
	var retVal = false;
	
	if (customerId) // 1.1.2
	{
		// Lookup customer's email
		var login = nlapiLookupField('customer', customerId, 'email');
	
		// Compare customer's given login with their email
		if (customerLogin == login)
		{
			retVal = true;
		}
	}
	
	return retVal;
}

/**
 * Gets the customer's custom record,
 * or creates it if it doesn't exist
 */
function initCustomerCustomRecord()
{
	// Do a search for the customer's custom record
	var columns = new Array();
	var filters = new Array();
	
	filters[0] = new nlobjSearchFilter('custrecord_customer', null, 'anyOf', customerId);
	
	var searchResults = nlapiSearchRecord('customrecord_cust_applied_offers', null, filters, columns);
	
	if (searchResults)
	{
		customerCustomRecord = nlapiLoadRecord('customrecord_cust_applied_offers', searchResults[0].getId());
	}
	else
	{
		customerCustomRecord = nlapiCreateRecord('customrecord_cust_applied_offers');
		customerCustomRecord.setFieldValue('custrecord_customer', customerId);
	}
}

/**
 * Returns true if the offer has already been spent
 * @returns {Boolean}
 */
function isOfferSpent()
{
	var retVal = true;
	var spentOffers = new Array();
	
	// Get the list of spent offers
	spentOffers = customerCustomRecord.getFieldValues('custrecord_spent_offers');
	
	if (spentOffers != null)
	{
		// If the offer is NOT spent
		if (spentOffers.indexOf(offerId) < 0)
		{
			retVal = false;
		}
	}
	else // Empty array means nothing has been spent
	{
		retVal = false;
	}
	
	return retVal;
}

/**
 * generic search - returns internal ID
 * 
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID = '';

	// Arrays
	var filters = new Array();
	var columns = new Array();

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is', valueToSearch);                          

		// perform search
		itemSearchResults = nlapiSearchRecord(table, null, filters, columns);

		if(itemSearchResults != null)
		{
			if(itemSearchResults.length > 0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getId();
			}
		}
	}
	catch(e)
	{
		errorHandler('genericSearch', e);
	}     	      

	return internalID;
}

/**
 * Apply ccode to the customer's custom record
 */
function applyCcodeToCustomer()
{
	try
	{
		var campaignId = genericSearch('campaign', 'title', ccode);
		
		if (customerCustomRecord.getFieldValue('custrecord_campaigncode') != campaignId)
		{
			customerCustomRecord.setFieldValue('custrecord_campaigncode', campaignId);
			customerCustomRecord.setFieldValue('custrecord_campaigncodetext', ccode);	// 1.1.4
			
			nlapiSubmitRecord(customerCustomRecord);
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', e.message);
	}
}

/**
 * Returns true if the offer has been applied to the customer's custom record
 */
function applyOfferToCustomer()
{
	try
	{
		var currentOffers = new Array();
		var newOffers = new Array();
	
		// Apply the offer to the custrecord_offers multiselect
		currentOffers = customerCustomRecord.getFieldValues('custrecord_offers');
		
		if (!currentOffers)
		{
			currentOffers = new Array();
		}

		// Submit only if the offer is not already in the list
		var indexOfOffer = currentOffers.indexOf(offerId);

		if (indexOfOffer < 0)
		{
			// Check if the offer hasn't been spent
			if (!isOfferSpent())
			{
				newOffers = currentOffers.concat([offerId]);
				customerCustomRecord.setFieldValue('custrecord_setby', 'applyOfferToCustomer');//SSS
				customerCustomRecord.setFieldValues('custrecord_offers', newOffers);
				nlapiSubmitRecord(customerCustomRecord);
			
				output = 'Your chosen offer has been applied to your basket.';
			}
			else
			{
				output = 'Your chosen offer has already been used.';
			}
		}
		// Else remove the offer
		else
		{
			if (!addOnly) // 1.1.1
			{
				// I would have used Array.splice() here, but NetSuite doesn't support it
				for(var i = 0; i < currentOffers.length; i++)
				{
					if (i != indexOfOffer)
					{
						newOffers.push(currentOffers[i]);
					}
				}
				customerCustomRecord.setFieldValue('custrecord_setby', 'applyOfferToCustomer');//SSS
				customerCustomRecord.setFieldValues('custrecord_offers', newOffers);
				nlapiSubmitRecord(customerCustomRecord);
				
				output = 'Your chosen offer has been removed.';
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', e.message);
	}
}

/**
 * 1.0.1 - Clears all applied offers from customer's custom record
 */
function clearOffers()
{
	try
	{
		var currentOffers = new Array();
	
		// Apply the offer to the custrecord_offers multiselect
		currentOffers = customerCustomRecord.getFieldValues('custrecord_offers');
		
		if (!currentOffers)
		{
			currentOffers = new Array();
		}

		// Submit only if the offer is not already in the list
		if (currentOffers.length > 0)
		{
			customerCustomRecord.setFieldValues('custrecord_offers', new Array());
			nlapiSubmitRecord(customerCustomRecord);
			
			output = 'Offers cleared';
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', e.message);
	}
}
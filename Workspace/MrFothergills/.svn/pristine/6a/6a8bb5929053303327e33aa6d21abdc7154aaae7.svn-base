/*******************************************************
 * Name:		MRF Offers Suitelet
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 13/09/2012 - Initial version - AM
 *				1.0.1 - 14/09/2012 - Fixed bug in getOfferIdByPromoCode search - SB
 *				1.0.2 - 04/10/2012 - Fixed multiple bugs - SB
 *
 * Author:		A. Morganti
 * 				S. Boot
 * 
 * Purpose:	
 * 
 * Script: 		offers_suitelet.js
 * Deploy: 		customdeploy_mrf_offers_suitelet
 * 
 *******************************************************/

var debug = request.getParameter('debug');

var inDebug = true;


/**
 * 
 */
function main()
{
	var promoCode = request.getParameter('pc');
	var customerId = request.getParameter('customer');

	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	var offerId = getOfferIdByPromoCode(promoCode);
	
	var recordId = genericSearch('customrecord_cust_applied_offers', 'custrecord_customer', customerId);
	
	var cust = null;
	
	if (recordId > 0)
	{
		cust = nlapiLoadRecord('customrecord_cust_applied_offers', recordId);
		
		var spentOffersArray = cust.getFieldValues('custrecord_spent_offers');

		if(spentOffersArray instanceof Array)
		{
			if(spentOffersArray.indexOf(offerId) >= 0)
			{
				if(inDebug)
				{
					nlapiLogExecution('DEBUG', 'SpentOffersArray 2' + spentOffersArray[0]);
				}
				
				offerId = -1;
			}
			
		}
	}

	response.write('offerId = ' + offerId + ';');
}

/**
 * generic search - returns internal ID
 * 
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID = 0;

	// Arrays
	var filters = new Array();
	var columns = new Array();

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(fieldToSearch, null, 'anyOf', valueToSearch);                          

		// perform search
		var searchResults = nlapiSearchRecord(table, null, filters, columns);

		if(searchResults != null)
		{
			if(searchResults.length > 0)
			{
				var searchResult = searchResults[0];
				internalID = searchResult.getId();
			}
		}
	}
	catch(e)
	{
		//errorHandler(e);
	}     	      

	return internalID;
}




/**
 * @param promoCode
 * @returns {Number}
 * 
 *  1.0.1
 */
function getOfferIdByPromoCode(promoCode)
{
	var internalID = 0;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters
		searchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		searchFilters[1] = new nlobjSearchFilter('custrecord_optional_offer', null, 'is', 'T');
		searchFilters[2] = new nlobjSearchFilter('custrecord_promo_code', null, 'is', promoCode);

		// perform search
		var searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, searchFilters, searchColumns);

		if(searchResults)
		{
			internalID = searchResults[0].getId();
		}
	}
	catch(e)
	{
	}     	      

	return internalID;
}




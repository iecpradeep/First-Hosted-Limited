/*************************************************************************************************************************
 * Name: 		Record Offers 
 * Script Type: Client 
 * 
 * XXX
 * 
 * Version: 	1.0.0 - 02/08/2012 - Initial release - AM
 * 				1.0.1 - 13/08/2012 - Changed to use Saved Search instead of Category - SB
 * 								 	 Allow the addition of Items and populate by Saved Search - SB
 * 				1.0.2 - 13/08/2012 - Fixed bug where all items are added upon save - SB
 * 				1.1.0 - 21/08/2012 - Added support for sourcing customers from saved search - SB
 * 				1.2.0 - 29/08/2012 - Added function to disable fields in the Transaction Total Offers
 * 									 depending Transaction Offer Type selection - AM
 * 				1.2.1 - 30/08/2012 - Fixed bug with Edit option not enabling selected 'Transaction Total Offers' -AM
 * 
 * Author: 		A. Morganti 
 * 				S. Boot
 * 
 * Purpose: 	Provides a selection of Items and Item Saved Searches that when selected 
 * 				populate the Item Selected Box. The selected Items are then applied to the Offer created.
 * 
 * Script: 		CustRecOffers_Client.js
 * Deploy: 		customdeploy_offers_client
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=2796&c=3322617&h=abb44902c7dd3a12c6b8&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/

// -->> GLOBAL VARIABLES <<--
// Declare search variables
var searchResults = null;
var customerResults = null;
var offerTotalType = null;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @param {String}
 *            type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientOffersPageInit(type) 
{	
	//1.2.1 - Enables selected field on start - AM
	disableTransFields();	
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 * @appliedtorecord recordType
 * 
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientOffersSaveRecord() 
{
	return true;
}

/**
 * @param type
 * @param name
 * @param linenum
 * @returns
 */
function clientOffersFieldChanged(type, name, linenum) 
{
	if (name == 'custrecord_itemsavedsearch') 
	{
		sourceItems();
	}
	if (name == 'custrecord_mrf_custsearch')
	{
		sourceCustomers();
	}
	if (name == 'custrecord_offertranstype')
	{
		disableTransFields();
	}
}

/**
 * 
 * 1.2.0 - Disables and Enables fields depending on 
 * 'Transaction Offer Type' selection.
 */
function disableTransFields()
{
	offerTotalType = nlapiGetFieldValue('custrecord_offertranstype');

	switch(parseInt(offerTotalType))
	{
	case 1:
		nlapiDisableField('custrecord_offertransgetpercentoff', true);
		nlapiDisableField('custrecord_offertransgetamtoff', false);
		nlapiDisableField('custrecord_offertransgetfreeitemqty', true);
		nlapiDisableField('custrecord_offertransgetfreeitem', true);
		nlapiDisableField('custrecord_for_price_', true);
		break;
	case 2:
		nlapiDisableField('custrecord_offertransgetpercentoff', false);
		nlapiDisableField('custrecord_offertransgetamtoff', true);
		nlapiDisableField('custrecord_offertransgetfreeitemqty', true);
		nlapiDisableField('custrecord_offertransgetfreeitem', true);
		nlapiDisableField('custrecord_for_price_', true);
		break;
	case 3:
		nlapiDisableField('custrecord_offertransgetpercentoff', true);
		nlapiDisableField('custrecord_offertransgetamtoff', true);
		nlapiDisableField('custrecord_offertransgetfreeitemqty', false);
		nlapiDisableField('custrecord_offertransgetfreeitem', false);
		nlapiDisableField('custrecord_for_price_', false);
		break;
	default:
		
		break;
	}
}

/**
 * @returns {Boolean}
 */
function sourceItems() 
{
	var retVal = false;

	if (nlapiGetFieldValue('custrecord_mrf_itemsavedsearch'))
	{ // 1.0.2
		var savedSearch = nlapiGetFieldValue('custrecord_mrf_itemsavedsearch');

		// Define search filters
		var filters = [];

		// Define search columns
		var columns = [];

		searchResults = nlapiSearchRecord('inventoryitem', savedSearch, filters, columns);

		var internalIdArray = [];

		if (searchResults)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
				internalIdArray.push(searchResults[i].getId());
			}
		}

		if (internalIdArray.length != 0) 
		{
			var items = nlapiGetFieldValues('custrecord_offerbuythisitem');
			var categoryItemsConcat = internalIdArray.concat(items);
			nlapiSetFieldValues('custrecord_offerbuythisitem', categoryItemsConcat, true, true);
			retVal = true;
		} 
		else 
		{
			alert("The Saved Search has no associated Items.");
		}
		
		nlapiSetFieldValue('custrecord_mrf_itemsavedsearch', null, false, true);
		
	} 
	else 
	{
		retVal = true;
	}

	return retVal;
}

/**
 * @returns {Boolean}
 */
function sourceCustomers() {
	var retVal = false;

	if (nlapiGetFieldValue('custrecord_mrf_custsearch'))
	{
		var savedSearch = nlapiGetFieldValue('custrecord_mrf_custsearch');

		// Define search filters
		var filters = [];

		// Define search columns
		var columns = [];

		customerResults = nlapiSearchRecord('customer', savedSearch, filters, columns);

		var internalIdArray = [];

		if (customerResults)
		{
			for (var i = 0; i < customerResults.length; i++)
			{
				internalIdArray.push(customerResults[i].getId());
			}
		}

		if (internalIdArray.length != 0) 
		{
			var customers = nlapiGetFieldValues('custrecord_offercustomersearch');
			var customersConcat = internalIdArray.concat(customers);
			nlapiSetFieldValues('custrecord_offercustomersearch', customersConcat, true, true);
			retVal = true;
		} 
		else 
		{
			alert("The Saved Search has no associated Customers.");
		}
		
		nlapiSetFieldValue('custrecord_mrf_custsearch', '', false, true);
		
	} 
	else 
	{
		retVal = true;
	}

	return retVal;
}

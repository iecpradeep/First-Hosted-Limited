/*************************************************************************************************************************
 * Name: 		custRecOffers_client.js 
 * Script Type: Client 
 * 
 * Version: 	1.0.0 - 02/08/2012 - Initial release - AM
 * 				1.0.1 - 13/08/2012 - Changed to use Saved Search instead of Category - SB
 * 								 	 Allow the addition of Items and populate by Saved Search - SB
 * 				1.0.2 - 13/08/2012 - Fixed bug where all items are added upon save - SB
 * 				1.1.0 - 21/08/2012 - Added support for sourcing customers from saved search - SB
 * 				1.2.0 - 29/08/2012 - Added function to disable fields in the Transaction Total Offers
 * 									 depending Transaction Offer Type selection - AM
 * 				1.2.1 - 30/08/2012 - Fixed bug with Edit option not enabling selected 'Transaction Total Offers' - AM
 * 				1.2.2 - 09/10/2012 - Reset field values if another option is selected. - AM
 * 				1.2.3 - 22/10/2012 - amended - changed inventory item to item - need BOMS and KITS also
 * 				1.2.4 - 05/11/2012 - amended - remove 1000 item restriction - JM
 * 								   - provided ability to have static or dynamic items for item line offers
 * 				1.2.5 - 08/03/2013 - amended as per offers re-structuring - added get items saved search and extension 
 * 
 * Author: 		FHL 
 * 
 * Purpose: 	client script to support the setup of offers 
 * 
 * Script: 		customscript_record_offers
 * Deploy: 		customdeploy_record_offers
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=2796&c=3322617&h=abb44902c7dd3a12c6b8&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/

//-->> GLOBAL VARIABLES <<--
//Declare search variables
var searchResults = null;
var customerResults = null;
var offerTotalType = null;
var internalIdArray = [];
var copyIdArray = [];

var savedSearch = null;



/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 */
function clientOffersPageInit(type) 
{	
	//1.2.1 - Enables selected field on start - AM
	//disableTransFields();	
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your
 * script deployment.
 * 
 */
function clientOffersSaveRecord() 
{
	return true;
}

/**
 * field changed event
 */
function clientOffersFieldChanged(type, name, linenum) 
{

	var offerType = '';

	try
	{



		if (name == 'custrecord_mrf_itemsavedsearch') 
		{
			savedSearch = nlapiGetFieldValue('custrecord_mrf_itemsavedsearch');

			if(savedSearch.length>0)
			{
				sourceItems();

				nlapiSetFieldValues('custrecord_offerbuythisitem', copyIdArray, true, true);

				if(internalIdArray.length==0)
				{
					nlapiSetFieldValue('custrecord_ofthisitemextension', '', true, true);
				}
				else
				{
					nlapiSetFieldValue('custrecord_ofthisitemextension', internalIdArray, true, true);
				}
			}
		}

		if (name == 'custrecord_getitemssavedsearch') 
		{
			savedSearch = nlapiGetFieldValue('custrecord_getitemssavedsearch');

			if(savedSearch.length>0)
			{

				sourceItems();

				nlapiSetFieldValues('custrecord_offergetthisactualitem', copyIdArray, true, true);

				if(internalIdArray.length==0)
				{
					nlapiSetFieldValue('custrecord_gettheseitemsextension', '', true, true);
				}
				else
				{
					nlapiSetFieldValue('custrecord_gettheseitemsextension', internalIdArray, true, true);
				}
			}
		}


		if (name == 'custrecord_m_offer_type')
		{
			offerType = nlapiGetFieldText('custrecord_m_offer_type');

			if(offerType == 'Pick and Mix Offer')
			{
				alert('Pick and Mix Offer - only the price needs to be filled in for the Get Items.');
				disableFieldsIfPickAndMix();
			}

			if(offerType == 'Line Quantity Offer')
			{
				alert('Line Item Offer Selected - Please fill out Quanlify and Get Item fields.');
				enableFieldsIfLineQtyOffer();
			}
		}

	}
	catch(e)
	{
		alert('error');
	}

}


/**
 * clear static items
 * 1.2.4 - added 
 * 'Transaction Offer Type' selection.
 */

function clearStaticItems()
{

	if(nlapiGetFieldValue('custrecord_dynamicitems')=='T')
	{
		internalIdArray = [];
		nlapiSetFieldValue('custrecord_ofthisitemextension', '', true, true);
		nlapiSetFieldValues('custrecord_offerbuythisitem', internalIdArray, true, true);
		alert('Static Items Cleared');
	}
	else
	{
		sourceItems();
	}

}

/**
 * 
 * disable fields that are not needed for reader offers 
 * 
 */

function disableFieldsIfPickAndMix()
{

	try
	{


		nlapiSetFieldValue('custrecord_offergetthisfreeqty', '', true, true);
		nlapiSetFieldValue('custrecord_getitemssavedsearch', '', true, true);
		nlapiSetFieldValue('custrecord_offergetthisactualitem', '', true, true);
		//nlapiSetFieldValue('custrecord_itempercentoff', '', true, true);


		nlapiDisableField('custrecord_offergetthisfreeqty', true);
		nlapiDisableField('custrecord_getitemssavedsearch', true);		
		nlapiDisableField('custrecord_offergetthisactualitem', true);
		//nlapiDisableField('custrecord_itempercentoff', true);


	}
	catch(e)
	{
		errorHandler("disableFieldsIfPickAndMix", e);
	}

}

/**
 * 
 * enable fields that are needed line item offers 
 * 
 */

function enableFieldsIfLineQtyOffer()
{

	try
	{

		nlapiDisableField('custrecord_offergetthisfreeqty', false);
		nlapiDisableField('custrecord_getitemssavedsearch', false);		
		nlapiDisableField('custrecord_offergetthisactualitem', false);
		nlapiDisableField('custrecord_itempercentoff', false);


	}
	catch(e)
	{
		errorHandler("enableFieldsIfLineQtyOffer", e);
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

		nlapiDisableField('custrecord_offertransgetamtoff', false);
		nlapiDisableField('custrecord_offertransgetpercentoff', true);		
		nlapiDisableField('custrecord_offertransgetfreeitemqty', true);
		nlapiDisableField('custrecord_offertransgetfreeitem', true);
		nlapiDisableField('custrecord_for_price_', true);

		// Reset the Fields if needed
		nlapiSetFieldValue('custrecord_offertransgetpercentoff', '');
		nlapiSetFieldValue('custrecord_offertransgetfreeitemqty', '');
		nlapiSetFieldValue('custrecord_offertransgetfreeitem', '');
		nlapiSetFieldValue('custrecord_for_price_', '');	

		break;

	case 2:
		nlapiDisableField('custrecord_offertransgetpercentoff', false);
		nlapiDisableField('custrecord_offertransgetamtoff', true);
		nlapiDisableField('custrecord_offertransgetfreeitemqty', true);
		nlapiDisableField('custrecord_offertransgetfreeitem', true);
		nlapiDisableField('custrecord_for_price_', true);

		// Reset the Fields if needed
		nlapiSetFieldValue('custrecord_offertransgetamtoff', '');
		nlapiSetFieldValue('custrecord_offertransgetfreeitemqty', '');
		nlapiSetFieldValue('custrecord_offertransgetfreeitem', '');
		nlapiSetFieldValue('custrecord_for_price_', '');

		break;

	case 3:
		nlapiDisableField('custrecord_offertransgetpercentoff', true);
		nlapiDisableField('custrecord_offertransgetamtoff', true);
		nlapiDisableField('custrecord_offertransgetfreeitemqty', false);
		nlapiDisableField('custrecord_offertransgetfreeitem', false);
		nlapiDisableField('custrecord_for_price_', false);

		// Reset the Fields if needed
		nlapiSetFieldValue('custrecord_offertransgetpercentoff', '');
		nlapiSetFieldValue('custrecord_offertransgetamtoff', '');

		break;

	default:

		break;
	}
}

/**
 * Get Items using saved search
 * 1.2.3 - need BOMS returning
 * 1.2.4 - remove 1000 item restriction and allow dynamic population of items
 * 
 * @returns {Boolean} - success/failure
 */
function sourceItems() 
{

	var retVal = false;
	var filters = [];
	var columns = [];
	var items = null;
	var categoryItemsConcat = [];

	try
	{

		alert('Fetching static items, may take a moment....');


		internalIdArray = [];
		runSavedSearch(0, 500, savedSearch);

		if (internalIdArray.length != 0) 
		{
			//items = nlapiGetFieldValues('custrecord_offerbuythisitem');
			//categoryItemsConcat = internalIdArray.concat(items);
			//nlapiSetFieldValues('custrecord_offerbuythisitem', categoryItemsConcat, true, true);

			for (var i = 0; i < internalIdArray.length; i++)
			{
				copyIdArray[i] = internalIdArray[i];
			}


			//nlapiSetFieldValues('custrecord_offerbuythisitem', internalIdArray, true, true);
			retVal = true;

			// place any results more than 501 into the extension field
			internalIdArray = [];
			runSavedSearch(501, 1000, savedSearch);
			runSavedSearch(1001, 2000, savedSearch);
			runSavedSearch(2001, 3000, savedSearch);
			runSavedSearch(3001, 4000, savedSearch);
			runSavedSearch(4001, 5000, savedSearch);
		} 
		else 
		{
			alert("The Saved Search has no associated Items.");
		}

	}
	catch(e)
	{
		alert("too many items: "+e.message);
		errorHandler("sourceItems:",e);
	}

	alert('Item sourcing complete.');
	return retVal;
}

/**
 * @returns {Boolean}
 */
function sourceCustomers() 
{
	var retVal = false;

	if (nlapiGetFieldValue('custrecord_mrf_custsearch'))
	{
		var savedSearch = nlapiGetFieldValue('custrecord_mrf_custsearch');

		// Define search filters
		var filters = [];

		// Define search columns
		var columns = [];

		var customerResults = nlapiSearchRecord('customer', savedSearch, filters, columns);

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

/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 * 1.2.4 - 05/11/2012 - amended - remove 1000 item restriction - JM
 ************************************************************************************/

function runSavedSearch(from, to, savedSearch)
{

	var loadSearch = null;
	var runSearch = null;

	try
	{

		//Loading the saved search
		loadSearch = nlapiLoadSearch('item', savedSearch);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		searchResults = runSearch.getResults(from,to);

		if (searchResults)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
				internalIdArray.push(searchResults[i].getId());
			}
		}

	}
	catch(e)
	{

		errorHandler("runSavedSearch:",e);
	}


}





/**
 * general error handler
 * 
 * @param e
 */
function errorHandler(sourceRoutine, e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error: ' + errorMessage + " in " + sourceRoutine, e.toString() );

}


/**
 * get error message
 * 
 * @param e
 */

function getErrorMessage(e)
{
	var retVal='';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}

	return retVal;
}


/**********************************************************************************************************
 * Name:		offers.js
 * 
 * 
 * Script Type:	Client scriptable record
 * 
 * 
 *				1.3.1 - 21/09/2012 - refactor main. - JM
 *				1.3.2 - 03/10/2012 - Get item/order offers working - SB
 *				1.3.3 - 03/10/2012 - Add web-only code
 *										Removed redundant, buggy triggerItem code from itemFree - SB
 *				1.3.4 - 05/10/2012 - Store all spent offers, not just the ones with a promo code
 *										Make order % discounts accurate - SB
 *				1.3.5 - 08/10/2012 - Allow removal of offers when clearing basket - SB
 *				1.3.6 - 15/10/2012 - Calculations added to orderDiscountCurrency 
 *										and orderDiscountPercent - AM
 *				1.3.7 - 15/10/2012 - Alter variable name so it does not override a global variable - AM
 *				1.3.8 - 15/10/2012 - item free in a group remove qty used - addItemToBasket added - implement campaigns driving offers
 *				1.3.9 - 24/10/2012 - Workaround for NetSuite defect #233757 
 *										(new cart line not rendered upon custom FieldChanged event) - SB
 *				1.4.0 - 26/10/2012 - Clear the campaign code upon submitting an order - SB - JM removed old version information
 *				1.4.1 - 26/10/2012 - Add bogo multi qty functionality + get % off your x order - JM
 *				1.4.2 - 29/10/2012 - Ignore shipping items - SB + added calc to get ex vat prices for items JM
 *				1.4.3 - 30/10/2012 - Fixed permissions issue and rounding in cart - SB
 *				1.4.4 - 30/10/2012 - Check for valid campaign without customer - JM
 *				1.4.5 - 02/11/2012 - If there is already a shipping item, update with promo shipping - SB
 *										No permission for some roles to Campaign, so change search on text value - SB
 *				1.4.6 - 02/11/2012 - Moved position of validateAndApply line select to improve performance - SB
 *										Use mrf_shipping.js library to calculate shipping - SB
 *				1.4.7 - 02/11/2012 - customBeforeSubmit() calculates shipping before order is submitted - SB
 *				1.4.8 - 03/11/2012 - Bugfix in removeCurrent Promotions - SB
 *										Use cache for offer search results - SB
 *										Line item in getFormInformation() not required - SB
 *				1.4.9 - 05/11/2012 - Bugfix in removeCurrent Promotions + allow more than 1000 items to be used in an offer - JM - HACK 
 *									 if value being added to cart with value - ask agent if they wish to add
 *									 Allow items to be checked dynamically
 *				1.5.0 - 12/11/2012 - Brand segregation - SB
 *				1.5.1 - 16/11/2012 - populate the partner field if populated - JM
 *				1.5.2 - 16/11/2012 - bug fixes - JM
 *				1.5.3 - 23/11/2012 - Save campaign as lead source - SB
 *				1.5.4 - 23/11/2012 - Shipping only on standard order type - SB
 *				1.5.5 - 26/11/2012 - Fix bug for campaign ID - JM
 *				1.5.6 - 28/11/2012 - Bugfix brandId not getting parsed correctly in switch statement - SB
 *				1.5.7 - 29/11/2012 - Changed errorHandler to show function name first - SB 
 *	
 * Author:		FHL
 * 
 * Purpose:		Apply campaign offers to basket
 * 
 * Script: 		customscript_offers_client
 * Libraries: 	mrf_shipping.js
 * Deploy: 		customdeploy_offers_client
 * Form: 		MRF Mr Fothergills Brand Sales Order (this is a scriptable record)
 * 
 **********************************************************************************************************/

//Code management variables
var inDebug = false;
var user = nlapiGetUser();

//Search variables
var filters = new Array();
var columns = new Array();
var searchResults = null; 			// Offers Search results
var campaignSearchResults = null; 	// campaign Search results 1.3.8
var derivedCampaignCode = null;		// campaign code 1.3.8
var itemSearchResults = [];			// 1.3.8 
var percentOffXOrderSavedSearchIntId = 0;			// 1.4.1
var dynamicItems = 'F';				// 1.4.9
var itemSavedSearch = '';			// 1.4.9
var partner = null;					// 1.5.1

var searchResultsCache = null; 		// Cache for non-optional Offers

//Check variables
var qualifyItems = [];
var dateCheckSuccess = false;
var selectedCustomer = 0;
var customerCheckSuccess = false;
var offerType = 0;
var previousApplied = null;
var previousAppliedOrder = null;
var promotionCheckSuccess = true;
var appliedOffers = [];
var applicableOffers = [];			// 1.3.8
var applyOfferId = 0;

//SO field variables
var transactionDate = null;

//SO line variables
var taxCode = null;
var selectedItem = null;
var itemQuantity = 0;
var itemRate = 0;
var isShipping = false;
var currentLineNumber = 0;

//Item offer discount variables
var currentDiscount = 0;

//Order offer discount variables
var orderTotal = 0;
var spendOver = 0;
//var newOrderTotal = 0;
var offerTotalType = null;
var discountPercentage = 0;
var discountCurrency = 0;
var orderItemCurrencyValue = 0;
var orderItemQuantity = 0;
var orderItemName = 0;

//free item 
var boughtQuantity = null;
var givenQuantity = null;
var givenItem =  null;
var givenPrice = null;

var offerId = null;
var addedItems = [];
var addedQtys = [];
var enteredOffers = new Array();

var errorDesc = '';
var offerCode = '';
var isAdded = 'F';

//******************************************************************
//promotion code extracted from the body field on the sales order
//******************************************************************
var promotionCodeEnteredByUser = '';
var promoEnteredIntID = 0;		// 1.5.5


/**************************************************************************************************************
 * get item - Add promotion to offers list 
 * 1.4.4 - amended to check campaign code is valid without checking the customer
 * 
 * @param type
 * @param name
 * @param linenum
 ***************************************************************************************************************/
function getItem(type, name, linenum)
{

	
	getFormInformation();

	// Back office only
	if (name == 'custbody_order_offers' && promotionCodeEnteredByUser.length > 0)
	{

		// check if the campaign is valid 1.4.4
		if(runSavedSearchCampaigns(promotionCodeEnteredByUser, 0) == true)
		{
			// 1.5.3 Set the current campaign as the lead source
			var campaignId = genericSearch('campaign', 'title', derivedCampaignCode);
			nlapiSetFieldValue('leadsource', campaignId, false, true);
			
			fetchOffers();
			updateScreenErrorInformation();
		}
		else
		{
			alert('Please enter a valid campaign code.');
		}

	}

	// Web only - apply offers if this field changes
	if (name == 'custbody_applied_order_offers_string')
	{
		// Reset JavaScript output
		nlapiSetFieldValue('custbody_js', '', false, true);
		
		lookUpCampaignCode();		// 1.5.3
		storePromoCodesWeb(name);
		applyOffers();
		calcShipping(); // 1.4.6 mrf_shipping.js
		cartLineBugWorkaround(); // 1.3.9
		updateScreenErrorInformation();
	}


}

//lookup the campaigncode
//1.5.3
function lookUpCampaignCode()
{
	var custoffersIntId = 0;
	var appliedOffers = null;
	
	try
	{
		custoffersIntId = genericSearch('customrecord_cust_applied_offers', 'custrecord_customer', selectedCustomer);

		if(custoffersIntId != 0)
		{
			appliedOffers = nlapiLoadRecord('customrecord_cust_applied_offers', custoffersIntId);
			promotionCodeEnteredByUser = appliedOffers.getFieldValue('custrecord_campaigncodetext');
			promoEnteredIntID = appliedOffers.getFieldValue('custrecord_campaigncode');
		}

		// [hack] this value should not be zero 1.5.5
		if(promoEnteredIntID==0)
		{
			promoEnteredIntID = genericSearch('campaign', 'title' ,promotionCodeEnteredByUser);
		}
	}
	catch(e)
	{
		errorHandler("lookUpCampaignCode", e);
	}

}

//deal with campaigns and valid offers
//1.3.8 added

function checkCampaign()
{

	try
	{

		appliedOffers = [];
		applicableOffers = [];	

		// check, get or set the campaign code
		if(runSavedSearchCampaigns(promotionCodeEnteredByUser, selectedCustomer) == false)
		{
			alert('No valid campaigns for customer, defaulting to Generic Campaign.');
		}

		// get the offers associated with the campaign
		if(retrieveOffersAssociatedWithCampaign(derivedCampaignCode)==true)
		{
			alert("Valid campaign selected, please select applicable offers.");
		}
		else
		{
			alert("No valid offers associated with campaign.");
		}

		// update the sales order screen fields
		updateSalesOrderFormFields();
	}
	catch(e)
	{
		errorHandler("checkCampaign", e);		
	}

}

function fetchOffers()
{

	try
	{

		appliedOffers = [];
		applicableOffers = [];	


		// get the offers associated with the campaign
		if(retrieveOffersAssociatedWithCampaign(promotionCodeEnteredByUser)==true)
		{
			alert("Valid campaign selected, please select applicable offers.");
		}
		else
		{
			alert("No valid offers associated with campaign."); 
		}

		// update the sales order screen fields
		updateSalesOrderFormFields();
	}
	catch(e)
	{
		errorHandler("checkCampaign", e);		
	}


}


/** 
 * apply promotion button click 
 * @returns {Boolean}
 */

function ApplyPromotionsButtonClick()
{

	getFormInformation();
	lookUpCampaignCode();		// 1.5.5
	
	// move applicable offers to applied offers
	applicableOffers = [];
	applicableOffers = applicableOffers.concat(nlapiGetFieldValues('custbody_applicable_order_offers')); // 1.1.5/1.2.1
	appliedOffers = applicableOffers;

	updateSalesOrderFormFields();
	applyOffers();
	calcShipping(); // 1.4.6 mrf_shipping.js
	updateScreenErrorInformation();
}


/** 
 * apply promotion button click 
 * @returns {Boolean}
 */

function getPromotionsButtonClick()
{
	//****************************************
	// check the basket for promotions that
	// do not require a promo code, if they exist as a promotion
	// add them to the promotions selected list and apply 
	// the promotion normally
	//****************************************
	getFormInformation();
	checkCampaign();
	updateScreenErrorInformation();
}

/**
 * clear promotions
 * 1.3.9 added
 */
function clearPromotionsButtonClick()
{
	try
	{
		appliedOffers = [];
		applicableOffers = [];
		derivedCampaignCode= '';

		removeCurrentPromotions();
		updateSalesOrderFormFields();

	}
	catch(e)
	{
		errorHandler('clearPromotionsButtonClick', e);
	}

}


/** 
 * Get information off the form 
 * 1.4.8 Current line item info not required
 * @returns {Boolean}
 */
function getFormInformation()
{
	var retVal = false;

	try
	{
		// get the date of the transaction
		transactionDate = nlapiGetFieldValue('trandate');

		//	get the specified customer
		selectedCustomer = nlapiGetFieldValue('entity');

		// Applied order offers
		appliedOffers = appliedOffers.concat(nlapiGetFieldValues('custbody_applied_order_offers')); // 1.1.5/1.2.1

		// get the value of the promotion code entered
		promotionCodeEnteredByUser = nlapiGetFieldValue('custbody_order_offers');

	}
	catch(e)
	{
		errorHandler('getFormInformation', e);
	}

	return retVal;
}


/************************************************************************************
 * add promotion if valid to the list
 * 
 *************************************************************************************/

function addPromotionToList()
{
	if(checkPromotionCriteriaAreMet() == false)
	{
		errorDesc = errorDesc + 'Promotion criteria not met';
	}

	updateSalesOrderFormFields();
}

/************************************************************************************
 * Apply item offers
 *  - Remove all promotions that have been applied to the order
 * 	- Process all the item offers that have been input by promotion code 1.3.2
 *  - Then process all the order offers that have been input by promotion code 1.3.2
 *  - Then process all the item offers that do not require a promotion code 1.3.2
 *  - Then process all the order offers that do not require a promotion code  1.3.2
 * 
 *************************************************************************************/
function applyOffers()
{
	// Reset messages
	errorDesc = '';

	try
	{
		removeCurrentPromotions();

		//*****************************************************
		// loop through promotions and basket and recalc whole order
		// 
		//*****************************************************

		var newEnteredOffers = new Array();
		newEnteredOffers = nlapiGetFieldValues('custbody_applied_order_offers');

		// Weird NetSuite behaviour - comes back with empty string in [0] element if list is empty
		if(newEnteredOffers instanceof Array)
		{
			if (newEnteredOffers.length == 1)
			{
				if (newEnteredOffers[0] == '')
				{
					// Force to be an empty array
					newEnteredOffers = new Array();
				}
			}
		}

		// 1.4.8 If the entered offers have changed, reset the optOfferSearch() results
		// Else it will use the previous results without needing to search again
		if (enteredOffers.length != newEnteredOffers.length)
		{
			enteredOffers = newEnteredOffers;
			searchResults = null;
		}
		else
		{
			for (var i = 0; i < enteredOffers.length; i++)
			{
				if (enteredOffers[i] != newEnteredOffers[i])
				{
					enteredOffers = newEnteredOffers;
					searchResults = null;
					break;
				}
			}
		}

		/* =====================================================
		 * Process offers
		 * =====================================================
		 * Instead of doing a lookup on each entered offer, 
		 * return all values in one search result object and 
		 * iterate over that, to enhance performance.
		 * 
		 */

		// Put promo code offers into searchResults
		if(optOfferSearch() == true)
		{
			processOffers();
		}

		// 1.3.8 no concept of optional v non optional now
		// Put non-optional offers into searchResults
		//if(nonOptOfferSearch() == true)
		//{
		//processOffers();
		//}

	}
	catch(e)
	{
		errorHandler("applyOffers", e);
	}

}

/**
 * Process and apply current offer
 * 1.3.8 - try catch added
 */
function processOffers()
{

	
	
	try
	{
		// for each offer result found...
		for(var i = 0; i < searchResults.length; i++)
		{
			// Get offer details from search result
			getOfferInformation(i);

			// add the items in the basket to 2 arrays
			pushIteminSalesOrderToArrays();

			// Check if offer valid and apply it
			validateAndApply(i);
		}

	}
	catch(e)
	{
		errorHandler("processOffers", e);	
	}

}


/************************************************************************************
 * validate and apply 
 * 1.3.8 - try catch added
 * 1.4.6 - move nlapiSelectLineItem function to child functions to improve performance
 * 1.5.2 - only loop for the entered items
 *************************************************************************************/

function validateAndApply(result)
{
	
	var linesInBasket = 0;
	
	try
	{
		// for each item in the basket
		
		linesInBasket = nlapiGetLineItemCount('item');
		
		//for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
		for (var line = 1; line <= linesInBasket; line++)
		{
			getLineItemData(line);

			if (isShipping == false) // 1.4.2
			{
				// check if this line has an offer code added already 
				// or if the line has been added through another promotion
				// if so ignore
				//if(offerCode.length == 0)
				//{
				// Check if selected line item is an offer trigger item

				if(checkIfItemQualifies(selectedItem) == true)
				{
					// 1.4.6 Set current line number globally for use in child functions if necessary 
					//nlapiSelectLineItem('item', line);
					currentLineNumber = line;

					// apply the specific promotion
					if(applySpecificPromotion(result) == false)
					{
						errorDesc = errorDesc + 'OfferId ' + offerId + ' did not apply\n';
					}
					//		}
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("validateAndApply", e);
	}
}

/**
 * search for the selected offers
 * 1.3.9 - remove the optional filter 
 * @returns {Boolean}
 */
function optOfferSearch()
{
	// set retval to false
	var retVal = false;

	// Don't bother if there are no promo codes
	if (enteredOffers.length > 0)
	{
		// clear out the search arrays
		filters = [];
		columns = [];

		// columns
		returnColumns();

		// Filters
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F'); // Not inactive
		// 1.3.9 
		//	filters[1] = new nlobjSearchFilter('custrecord_optional_offer', null, 'is', 'T'); // Offers with promo codes
		filters[1] = new nlobjSearchFilter('internalid', null, 'anyOf', enteredOffers); // Offers entered by promo code

		// Execute the search to populate the cache if the cache isn't already populated
		if (searchResults == null)
		{
			searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);
		}

		if(searchResults)
		{
			// set the retVal to true as results were found
			retVal = true;
		}
	}

	return retVal;
}

/**
 * @returns {Boolean}
 */
function nonOptOfferSearch()
{
	// set retval to false
	var retVal = false;

	// clear out the search arrays
	filters = [];
	columns = [];

	// columns
	returnColumns();

	// Filters
	filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F'); // Not inactive
	filters[1] = new nlobjSearchFilter('custrecord_optional_offer', null, 'is', 'F'); // No promo code

	// Execute the search to populate the cache if the cache isn't already populated
	if (!searchResultsCache)
	{
		searchResultsCache = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);
	}

	// Get the results from the cache
	searchResults = searchResultsCache;

	if(searchResults)
	{
		// set the retVal to true as results were found
		retVal = true;
	}

	return retVal;
}

/************************************************************************************
 * remove all promotion info from basket
 * 	
 *************************************************************************************/

function removeCurrentPromotions()
{

	var rate = 0;
	var qty = 0;

	try
	{

		// Remove order total discount
		nlapiSetFieldValue('discountitem', '', false, true);
		nlapiSetFieldValue('discountrate', '', false, true);

		// for each item in the basket
		for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
		{
			getLineItemData(line);

			if(isAdded == 'T')
			{
				nlapiSelectLineItem('item', line); // 1.4.6
				nlapiRemoveLineItem('item', line);
				line = 0; // Reset the loop as we now have unknown number of lines

				//[hack] script has timing issues without this line
				alert("Removing offers");

			}
			//else if(nlapiGetCurrentLineItemValue('item', 'custcol_lineoffer') > 0) // 1.4.8
			else if(offerCode > 0) // 1.4.8
			{
				nlapiSelectLineItem('item', line); // 1.4.6

				rate = nlapiGetCurrentLineItemValue('item', 'rate');
				qty = nlapiGetCurrentLineItemValue('item', 'quantity');

				nlapiSetCurrentLineItemValue('item', 'amount', rate*qty, false, true);
				nlapiSetCurrentLineItemValue('item', 'custcol_lineoffer', '', false, true);
				nlapiCommitLineItem('item');
			}
		}

	}
	catch(e)
	{
		errorHandler("removeCurrentPromotions", e);
	}


}

/************************************************************************************
 * update the promo code list and clear the promo code field
 * 1.3.8 applicable offers added 	
 * 1.5.1 populate the partner field
 *************************************************************************************/

function updateSalesOrderFormFields()
{
	//**********************************************
	// add promo code to list and clear promo code
	// 1.1.1
	// set the promotion field back to an empty value
	//**********************************************
	nlapiSetFieldValues('custbody_applied_order_offers', appliedOffers, false, true);
	nlapiSetFieldValues('custbody_applicable_order_offers', applicableOffers, false, true);	// 1.3.8
	nlapiSetFieldValue('custbody_order_offers', derivedCampaignCode, false, true);

	nlapiSetFieldValue('partner', partner, false, true);				// 1.5.1
		
}


/***************************************************************************************
 * add items in basket to two arrays
 * 
 * 
 **************************************************************************************/

function pushIteminSalesOrderToArrays()
{
	addedItems = new Array();
	addedQtys = new Array();

	// Loops through item sublist and get IDs and quantities
	for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
	{
		// We don't care about applied offer items...
		if (!nlapiGetLineItemValue('item', 'custcol_lineoffer', line))
		{
			getLineItemData(line);

			// 1.4.2 nor shipping items
			if (isShipping == false)
			{
				addedItems.push(selectedItem);
				addedQtys.push(itemQuantity);
			}
		}
	}

}


/**************************************************************************************
 * check Promotion Criteria Are Met
 * 		- lookup promotion reference record
 * 		- extract value from it
 * 		- add to promo list if not already present
 * 		- check promo dates are valid
 * 		- check customer is in audience
 * 
 * 
 * @returns {Boolean} success or failure
 *************************************************************************************/
function checkPromotionCriteriaAreMet()
{
	// set the retVal
	var promotionCode = '';
	var retVal = false;
	var fromDate = null;
	var toDate = null;

	//***************************************************************************************************
	// check the pomotion exists based on the promotion code entered by the user
	//
	//***************************************************************************************************

	if(getPromotionInformation() == true)
	{

		//*************************************************
		// check if we added the promo code to the list
		//		- check dates fall within range
		//		- check customer is in audience
		//		- TODO: Check if offer spent
		//************************************************

		if(addToListIfNotAlreadyPresent(promotionCode))
		{	
			// do date check with the following parameters
			fromDate = searchResults[0].getValue(columns[0]);
			toDate = searchResults[0].getValue(columns[1]);

			dateCheckSuccess = checkDate(fromDate, toDate, transactionDate);

			// if the date is valid
			if(dateCheckSuccess)
			{
				// do a comparison of the selected customer and the customer on the offer
				customerCheckSuccess = checkCustomer(0);

				// if customer is correct
				if(customerCheckSuccess)
				{
					retVal = true;


				}
				else
				{
					errorDesc = errorDesc + 'Not valid for customer\n';
				}
			}
			else
			{
				errorDesc = errorDesc + 'Promotion outside valid date\n';
			}
		}
		else
		{
			errorDesc = errorDesc + 'Promotion already in use\n';
		}
	}

	return retVal;

}



/**************************************************************************************
 * check Promotion Criteria Are Met
 * 		- lookup promotion reference record
 * 		- extract value from it
 * 		- add to promo list if not already present
 * 		- check promo dates are valid
 * 
 * 		- check customer is in audience
 * 1.4.9 allow more than 1000 items
 * 
 * @returns {Boolean} success or failure
 *************************************************************************************/
function getPromotionInformation()
{
	// set the retVal
	var retVal = false;
	var qualItems = '';


	try
	{


		//***************************************************************************************************
		// check the pomotion exists based on the promotion code entered by the user
		//
		//***************************************************************************************************

		if(getOfferBasedOnPromoCode(promotionCodeEnteredByUser))
		{
			// extract the values from the offer reference record
			offerId = searchResults[0].getId();
			qualItems = searchResults[0].getValue(columns[5]);

			qualItems = qualItems + "," + searchResults[0].getValue(columns[22]); 	// 1.4.9 item extension

			// gets the items that have been statically assigned to the offer
			
			if (qualItems)
			{
				qualifyItems = qualItems.split(',');
			}
			else
			{
				qualifyItems = new Array();
			}

			offerType = searchResults[0].getValue(columns[4]);
			promotionCode = searchResults[0].getValue(columns[6]);


			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("getPromotionInformation", e);
	}


	return retVal;

}



/**************************************************************************************
 * check Promotion Criteria Are Met
 * 		- lookup promotion reference record
 * 		- extract value from it
 * 		- add to promo list if not already present
 * 		- check promo dates are valid
 * 		- check customer is in audience
 * 1.4.9 allow more than 1000 items
 * 
 * @returns {Boolean} success or failure
 *************************************************************************************/
function getOfferInformation(index)
{

	var qualItems = '';
	var extensionItems = '';

	try
	{ 

		offerId = searchResults[index].getId();
		qualItems = searchResults[index].getValue(columns[5]);

		extensionItems = searchResults[index].getValue(columns[22]); 	// 1.4.9 item extension + 1.5.2 index was 0

		if(extensionItems.length>0)
		{
			qualItems = qualItems + "," + extensionItems; 			// 1.4.9 item extension
		}

		offerType = searchResults[index].getValue(columns[4]);
		promotionCode = searchResults[index].getValue(columns[6]);
		dynamicItems = searchResults[index].getValue(columns[23]);
		itemSavedSearch = searchResults[index].getValue(columns[24]);

		// gets the items that have been statically assigned to the offer

		if (qualItems)
		{
			qualifyItems = qualItems.split(',');
		}
		else
		{
			qualifyItems = new Array();
		}

	}
	catch(e)
	{
		errorHandler("getOfferInformation", e);
	}

}



/***************************************************************************************
 * check if the item qualifies
 * 
 * 
 * if no items are listed for qualification assume all items are valid
 * 1.4.9 - check for dynamic flag and run saved search if dynamic
 * @returns {Boolean} - returns all offers
 * 
 **************************************************************************************/

function checkIfItemQualifies(currentItemCodeIntID)
{
	var retVal = false;

	try
	{

		//***************************
		// dynamic checks
		//***************************
		if(dynamicItems=='T' && itemSavedSearch)
		{
			retVal = checkDynamicItemsQualify(currentItemCodeIntID);
		}
		else
		{
			//***************************
			// static checks
			//***************************
			if(qualifyItems.length == 0)
			{
				retVal = true;
			}
			else
			{
				if (qualifyItems.indexOf(currentItemCodeIntID) >= 0)
				{
					retVal = true;
				}
			}
		}

	}
	catch(e)
	{
		errorHandler("checkIfItemQualifies", e);	
	}

	return retVal;
}

/************************************************************************************
 * check Dynamic Items Qualify
 * 1.4.9	
 *************************************************************************************/

function checkDynamicItemsQualify(currentItemCodeIntID)
{

	var retVal = false;
	var criteria = null;

	try
	{
		criteria =[[ 'internalid', 'is', currentItemCodeIntID ]];

		if(runSavedSearchWithCriteria(0, 10, itemSavedSearch, 'item', criteria)==true)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("checkDynamicItemsQualify", e);
	}

	return retVal;
}


/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 *
 * filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
 *
 ************************************************************************************/

function runSavedSearchWithCriteria(from, to, savedSearch, type, criteria)
{
	var loadSearch = null;
	var runSearch = null;
	var SSsearchResults = null;
	var retVal=false;

	try
	{
		//Loading the saved search
		loadSearch = nlapiLoadSearch(type, savedSearch);

		// set the filter for the search
		loadSearch.setFilterExpression(criteria);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		SSsearchResults = runSearch.getResults(from,to);

		if (SSsearchResults)
		{
			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("runSavedSearchWithCriteria", e);
	}

	return retVal;

}



/***************************************************************************************
 * returns all offers reference records from the offers custom record
 * 
 * @returns {Boolean} - returns all offers
 * 
 **************************************************************************************/
function getOfferBasedOnPromoCode(promoCode)
{
	// set retval to false
	var retVal = false;

	// clear out the search arrays
	var filters = new Array();

	searchResults = null;

	// set up the columns for the search
	returnColumns();

	// setup the filters
	filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	filters[1] = new nlobjSearchFilter('custrecord_optional_offer', null, 'is', 'T');
	filters[2] = new nlobjSearchFilter('custrecord_promo_code', null, 'is', promoCode);

	// Execute search
	searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);

	if(searchResults)
	{
		// set the retVal to true as results were found
		errorDesc = errorDesc + 'Promotion code found ' + promoCode + '\n';
		retVal = true;
	}
	else
	{
		errorDesc = errorDesc + 'Promotion code not found ' + promoCode + '\n';
		retVal = false;
	}

	return retVal;
}

/**
 * Stores all the search columns for:
 * 1. Manual Search
 * 2. Order Search
 * 3. Automation Search
 * 
 * 1.4.1 bogo multi qty column added + % off x order
 * 1.4.9 item extension added to allow more than 1000 items
 */
function returnColumns()
{
	columns[0] = new nlobjSearchColumn('custrecord_offeractivatedate');
	columns[1] = new nlobjSearchColumn('custrecord_offerenddate');
	columns[2] = new nlobjSearchColumn('custrecord_offeravailableto');
	columns[3] = new nlobjSearchColumn('custrecord_offercustomersearch');
	columns[4] = new nlobjSearchColumn('custrecord_m_offer_type');
	columns[5] = new nlobjSearchColumn('custrecord_offerbuythisitem');
	columns[6] = new nlobjSearchColumn('custrecord_promo_code');
	columns[7] = new nlobjSearchColumn('custrecord_offertranstype');
	columns[8] = new nlobjSearchColumn('custrecord_offerspendover');
	columns[9] = new nlobjSearchColumn('custrecord_offertransgetamtoff');
	columns[10] = new nlobjSearchColumn('custrecord_offertransgetpercentoff');
	columns[11] = new nlobjSearchColumn('custrecord_item_for_price');
	columns[12] = new nlobjSearchColumn('custrecord_for_price_');
	columns[13] = new nlobjSearchColumn('custrecord_offertransgetfreeitemqty');
	columns[14] = new nlobjSearchColumn('custrecord_offertransgetfreeitem');
	columns[15] = new nlobjSearchColumn('custrecord_offerbuythisqty');
	columns[16] = new nlobjSearchColumn('custrecord_offergetthisfreeqty');
	columns[17] = new nlobjSearchColumn('custrecord_offergetthisactualitem');
	columns[18] = new nlobjSearchColumn('custrecord_offergetthispricetype');
	// Sort on custrecord_offertranstype so that non-order offers apply last
	columns[19] = columns[7].setSort(true); // true = descending
	columns[20] = new nlobjSearchColumn('custrecord_bogomultiquantity');		// 1.4.1 bogo multi qty check box
	columns[21] = new nlobjSearchColumn('custrecord_percentoffyourxorder');		// 1.4.1 saved search for % off 1st order etc
	columns[22] = new nlobjSearchColumn('custrecord_ofthisitemextension');		// 1.4.9 item extension
	columns[23] = new nlobjSearchColumn('custrecord_dynamicitems');				// 1.4.9 dynamic items
	columns[24] = new nlobjSearchColumn('custrecord_mrf_itemsavedsearch');		// 1.4.9 dynamic items saved search

}



/************************************************************************
 * add to the promotions list if not alread present
 * 
 * @param promotion code
 * returns boolean success/failure
 *************************************************************************/

function addToListIfNotAlreadyPresent(promoCode)
{
	var retVal = false;

	if (appliedOffers.indexOf(offerId) < 0) // if not already in the array - 1.1.3 AM
	{
		appliedOffers.push(offerId);
	}

	retVal = true;

	return retVal;
}

/**
 * triggered by field change
 * WEB ONLY - the field for the trigger 'custbody_applied_order_offers_string' is a hidden field on web
 * performs the following
 * 		1. create/update applied offers CRS i.e. add promo code to custom record - maintain state
 * 		2. apply offers
 *
 * @param name
 */

function storePromoCodesWeb(name)
{
	try
	{
		// 1.2.0
		if(name == 'custbody_applied_order_offers_string')
		{	
			// Save the string in the customer record
			// If the record exists load it and update
			// otherwise create it and update
	
			var recordId = genericSearch('customrecord_cust_applied_offers', 'custrecord_customer', nlapiGetFieldValue('entity'));
			var cust = null;
	
			if (recordId == 0)
			{
				cust = nlapiCreateRecord('customrecord_cust_applied_offers');
				cust.setFieldValue('custrecord_customer', selectedCustomer);
			}
			else
			{
				cust = nlapiLoadRecord('customrecord_cust_applied_offers', recordId);
			}
			
			// 1.5.3
			// Get the campaign code from custom record
			var campaign = cust.getFieldValue('custrecord_campaigncode');
			
			if (campaign)
			{
				// Set the current campaign as the lead source
				nlapiSetFieldValue('leadsource', campaign, false, true);
			}
	
			// Store the offers in this string
			var offersString = '' + nlapiGetFieldValue('custbody_applied_order_offers_string');
			var offerArray = new Array();

			// Remove any whitespaces
			offersString = offersString.replace(/\s/g, '');
			// Remove any random numbers sent here to force a FieldChanged event
			offersString = offersString.replace(/T.*T/, '');
	
			// 1.3.5 - Allow removal by making empty string an empty array
			if (offersString)
			{
				offerArray = offersString.split(',');
			}
	
			// Get the current array of applied offers from the custom record
			var appliedOffersArray = cust.getFieldValues('custrecord_offers');
	
			if (!appliedOffersArray)
			{
				appliedOffersArray = new Array();
			}
	
			// New array where the non-duplicates are stored
			var newOffersArray = new Array();
	
			// Filter duplicates
			for (key in offerArray)
			{
				if (newOffersArray.indexOf(offerArray[key]) < 0)
				{
					newOffersArray.push(offerArray[key]);
				}
			}
	
			// Set the applied offers field on the cust record
			cust.setFieldValues('custrecord_offers', newOffersArray);
	
			// Submit the record if we have changed it
			if (newOffersArray.length != appliedOffersArray.length || recordId <= 0)
			{
				cust.setFieldValue('custrecord_setby', 'storePromoCodesWeb' + Math.random());
				nlapiSubmitRecord(cust, false, false);
			}
	
			// Set the offers in the SO multi-select
			nlapiSetFieldValues('custbody_applied_order_offers', newOffersArray, false, true);
		}
	}
	catch(e)
	{
		errorHandler("storePromoCodesWeb", e);
	}
}

/**
 * recalc - web only
 * Use this custom function to link to the Recalc client event. 
 * In Scriptable Cart, the action can only be 'commit' or 'remove.' 
 * Note that only events related to items are applicable to Scriptable Cart.
 * @param type
 * @param action
 */
function customRecalcWeb(type, action)
{
	// DEBUG - hardcoded web customform IDs
	if (nlapiGetFieldValue('customform') == '109' || nlapiGetFieldValue('customform') == '110')
	{
		// A line item has been added
		// Or a line item has been removed
		if (type == 'item' && action == 'commit'|| type == 'item' && action == 'remove')
		{
			nlapiLogExecution('DEBUG', 'customRecalcWeb item recalc');
			// Put stored (applied) offers into SO field
			getCustAppliedOffers();

			// Apply offers
			applyOffers();
		}
	}
}

/**
 * Gets the customer's applied offers - for web
 */
function getCustAppliedOffers()
{
	var appliedOffersArray = new Array();
	var customerId = nlapiGetFieldValue('entity');
	var recordId = 0;
	var cust = null;

	if (customerId)
	{
		recordId = genericSearch('customrecord_cust_applied_offers', 'custrecord_customer', customerId);

		if (recordId > 0)
		{
			cust = nlapiLoadRecord('customrecord_cust_applied_offers', recordId);

			// Get the applied offers
			appliedOffersArray = cust.getFieldValues('custrecord_offers');

			if(!(appliedOffersArray instanceof Array))
			{
				appliedOffersArray = new Array();
			}

			// Set the applied offers into the SO field
			nlapiSetFieldValues('custbody_applied_order_offers', appliedOffersArray, false, true);
		}
	}
}

/**
 * get invoice line info
 * @param index (1 based)
 */


function getLineItemData(index)
{
	var retVal = false;

	try
	{
		// get the currently selected item
		selectedItem = nlapiGetLineItemValue('item','item', index);

		// get tax code
		taxCode = nlapiGetLineItemValue('item', 'taxcode', index);

		// get the item quantity
		itemQuantity = parseInt(nlapiGetLineItemValue('item','quantity', index));

		// get the item rate
		itemRate = parseFloat(nlapiGetLineItemValue('item','rate', index));

		// get promotion application data
		offerCode = nlapiGetLineItemValue('item', 'custcol_lineoffer', index);
		isAdded = nlapiGetLineItemValue('item', 'custcol_promotionlineadded', index);

		// 1.4.2
		if (nlapiGetLineItemValue('item', 'custcol_isshipping', index) == 'T')
		{
			isShipping = true;
		}
		else
		{
			isShipping = false;
		}

		if(taxCode.length > 0)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("getLineItemData", e);
	}

	return retVal;
}

/**********************************************************
 * apply Specific Promotion
 * 
 * 
 * @param searchCount - array position for seachresults
 * @returns {Boolean}
 **********************************************************/
function applySpecificPromotion(searchCount)
{
	var retVal = false;

	nlapiLogExecution('DEBUG', 'inside applySpecificPromotion ' + offerType);

	
	try
	{
		
		// Hard coded from the list record: offer type
		switch(parseInt(offerType))
		{
		// Line item discounts	
		case 1:
		case 2:

			retVal = itemDiscountMain(searchCount);

			break;

			// Order discounts
		case 3:
		case 4:

			retVal = orderDiscountMain(searchCount);
			break;

			// free line item
		case 5:

			retVal = itemFree(searchCount);

			break;

			// free order item
		case 6:

			retVal = orderDiscountMain(searchCount);

			break;

		case 10:
			// 1.4.1 added
			retVal = precentOffXOrder(searchCount);
		default:

			if(inDebug)
			{
				nlapiLogExecution('DEBUG','DEFAULT');
			}

		break;

		}

		if(retVal)
		{
			if(inDebug)
			{
				nlapiLogExecution('DEBUG', 'Index of offer applied: ', searchCount);
			}
		}
	}
	catch(e)
	{
		errorHandler("applySpecificPromotion", e);
	}

	return retVal;
}

/**
 * get %xx off your xx (ie 1st) order
 *  
 * Version 1.4.1
 * updated 1.5.5
 * @returns {Boolean}
 */
function precentOffXOrder(currentSearchResult) 
{

	var retVal = false;

	// get the offer variables
	orderDiscountVariables(currentSearchResult);
	
	// run the saved search
		
	// 1.5.5
	// if(runSavedSearchPercentOffOrder(promotionCodeEnteredByUser, selectedCustomer, percentOffXOrderSavedSearchIntId)==true)
	if(runSavedSearchPercentOffOrder(promoEnteredIntID, selectedCustomer, percentOffXOrderSavedSearchIntId)==true)
	{

		// magic number [todo]
		nlapiSetFieldValue('discountitem', 15516, false, true); 
		nlapiSetFieldValue('discountrate', "-" + discountPercentage + "%", false, true);
	}

	return retVal;	

}



/**
 * Item discount main operation
 * 
 * Version 1.0.1
 * @returns {Boolean}
 */
function itemDiscountMain(currentSearchResult)
{	
	var retVal = false;

	// boughtquantity is a promotion citeria field i.e. does our qty entered match or exceed the value on the promotion

	// columns[15] = custrecord_offerbuythisqty
	boughtQuantity = parseInt(searchResults[currentSearchResult].getValue(columns[15]));

	// if the order total is greater than or equal to the specified quantity, apply the discount
	if(itemQuantity >= boughtQuantity)
	{
		retVal = itemDiscountCalculation(currentSearchResult);
	}
	else
	{
		errorDesc = 'Quantity bought (' + itemQuantity + ') needs to be ' + boughtQuantity + ' or more to qualify\n';
	}

	return retVal;
}

/**
 * @returns {Boolean}
 */
function itemDiscountCalculation(currentSearchResult)
{
	var retVal = false;

	// columns[18] = custrecord_offergetthispricetype
	var discount = searchResults[currentSearchResult].getValue(columns[18]);
	var rate = 0;

	// is there a percent sign in the string and removes it
	if (discount.search(/\%/) >= 0)
	{
		// Subtract %
		rate = parseFloat(discount);
		rate = itemRate - ((itemRate/100)*rate);
	}
	else
	{
		// Subtract currency
		rate = itemRate - parseFloat(discount);
	}

	nlapiSelectLineItem('item', currentLineNumber); // 1.4.6

	// set the price level to -1 for custom
	nlapiSetCurrentLineItemValue('item', 'price', -1, false, true);

	// set the price of amount and gross amount to the offer set price
	nlapiSetCurrentLineItemValue('item', 'amount', rate*itemQuantity, false, true);
	nlapiSetCurrentLineItemValue('item', 'custcol_lineoffer', offerId, false, true);

	nlapiCommitLineItem('item');

	retVal = true;

	return retVal;
}

/**
 * Adds a free item to the line based on a automatic or manual offer
 * 
 * Version 1.0.1
 * version 1.3.8
 * Version 1.4.1 bogo option applied
 * 1.4.9 - dynamic item check
 * @param currentSearchResult
 * @returns {Boolean}
 */
function itemFree(currentSearchResult)
{
	var retVal = false;
	var qualifiedQuantity = 0;
	var bogoMultiple = 0;		// 1.4.1
	var bogoOption = 'F';		// 1.4.1

	try
	{

		// get the search results and place them in variables
		boughtQuantity = parseInt(searchResults[currentSearchResult].getValue(columns[15]));
		givenQuantity = parseInt(searchResults[currentSearchResult].getValue(columns[16]));
		givenItem =  searchResults[currentSearchResult].getValue(columns[17]);
		givenPrice = searchResults[currentSearchResult].getValue(columns[11]);
		bogoOption = searchResults[currentSearchResult].getValue(columns[20]);		// 1.4.1 bogo multi qty

		// We need to know which items qualify for this offer
		var qualifiedAddedItemIndexes = new Array();

		for (var i = 0; i < addedItems.length; i++)
		{
			//zzzzz
			// 1.4.9 check dynamic too if set
			if(checkIfItemQualifies(addedItems[i]) == true)
			{
				qualifiedAddedItemIndexes.push(i);
			}

			//if (qualifyItems.indexOf(addedItems[i]) >= 0)
			//	{
			//	qualifiedAddedItemIndexes.push(i);
			//}
		}

		// Get qualified item's combined quantities
		qualifiedQuantity = 0;

		for (var i = 0; i < qualifiedAddedItemIndexes.length; i++)
		{
			qualifiedQuantity += addedQtys[qualifiedAddedItemIndexes[i]];
		}

		if (qualifiedQuantity >= boughtQuantity)
		{  


			// bogo calc - if multi qty required for bogo work out the qty to add
			// 1.4.1
			if(bogoOption == 'T')
			{
				bogoMultiple =  Math.floor(qualifiedQuantity/boughtQuantity);
				givenQuantity = bogoMultiple;
			}

			// [TODO] Loop over all the qualified items by indexes
			// set current line values
			nlapiSelectLineItem('item', currentLineNumber); // 1.4.6
			nlapiSetCurrentLineItemValue('item', 'custcol_lineoffer', offerId, false, true);
			nlapiCommitLineItem('item');

			// 1.3.8 add item to basket - removed to function
			addItemToBasket();

			// remove qty used 1.3.8 [hack]
			for (var i = 0; i < qualifiedAddedItemIndexes.length; i++)
			{
				addedQtys[qualifiedAddedItemIndexes[i]] = 0;
			}		

			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("itemFree", e);
		retVal = false;

	}


	return retVal;
}

/**
 * Main operator for order discounts
 * 
 * Version 1.0.1
 * @param currentSearchResult
 * @returns {Boolean}
 */
function orderDiscountMain(currentSearchResult)
{
	var retVal = false;

	orderDiscountVariables(currentSearchResult);
	
	nlapiLogExecution('DEBUG', 'inside orderDiscountMain ' + offerTotalType);

	
	// If the order total is greater than the spend amount
	if(parseFloat(orderTotal) > parseFloat(spendOver))
	{
		// switch based off selected value in field
		switch(parseInt(offerTotalType))
		{
		case 1:
			// Discount currency
			retVal = orderDiscountCurrency();
			break;
		case 2:// Discount percentage
			retVal = orderDiscountPercent();
			break;
		case 3:// Free/discounted item
			retVal = itemFreeOrder(currentSearchResult);
			break;
		default:
			break;
		}
	}

	return retVal;
}

/**
 * Places all the required values into any variables used in the orderDiscount functions
 * 1.3.8 - remove the draw down on the order total 
 *  @param currentSearchResult
 * Version 1.0.1
 * Version 1.4.1
 */
function orderDiscountVariables(currentSearchResult)
{
	// fill out variables 
	offerTotalType = searchResults[currentSearchResult].getValue(columns[7]);
	spendOver = searchResults[currentSearchResult].getValue(columns[8]);
	discountPercentage = searchResults[currentSearchResult].getValue(columns[10]);
	discountCurrency = searchResults[currentSearchResult].getValue(columns[9]);
	orderItemCurrencyValue = searchResults[currentSearchResult].getValue(columns[11]);
	orderItemQuantity = searchResults[currentSearchResult].getValue(columns[13]);

	percentOffXOrderSavedSearchIntId = searchResults[currentSearchResult].getValue(columns[21]);	// 1.4.1

	// remove the percentage sign from the discount percent
	discountPercentage = parseFloat(discountPercentage);

	// get the current discount
	currentDiscount = nlapiGetFieldValue('discountrate');

	// remove the minus sign from the currency discount
	currentDiscount = currentDiscount.replace('-', '');

	// get the order value where no promotions have been applied
	// Loop through all line items. If they have no offer applied to them, add up the total
	orderTotal = 0; // !! inc tax !!

	for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
	{
		// 1.4.2
		if (nlapiGetLineItemValue('item', 'custcol_isshipping', line) != 'T')
		{
			// 1.3.8 - remove order draw down
			//if (!nlapiGetLineItemValue('item', 'custcol_lineoffer', line))
			//{
			var amount = parseFloat(nlapiGetLineItemValue('item', 'amount', line));
			var taxRate = parseFloat(nlapiGetLineItemValue('item', 'taxrate1', line));

			taxRate = taxRate/100;

			orderTotal += Math.round(amount*(1+taxRate)*100)/100;
			//} 1.3.8
		}
	}

	// if this field is not populated then set it to 0
	if(currentDiscount.length <= 0)
	{
		currentDiscount = 0;
	}
}

/**
 * 1.4.1 removed for now not needed for go live
 * A order discount for 
 * @returns 
 */
function orderDiscountCurrency()
{
	var retVal = false;
	// 1.3.7 - Alter variable name so it does not overide a global variable  
//	var taxRateForLine = null;


//	// removed
//	if(true==false)
//	{

//	// 1.3.6
//	try
//	{

//	// Loop over all the item lines
//	for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
//	{	
//	// If there is no Offer applied to the line Item
//	// Nor a shipping item
//	if(!nlapiGetLineItemValue('item', 'custcol_lineoffer', line) && 
//	nlapiGetLineItemValue('item', 'custcol_isshipping', line) != 'T')
//	{
//	nlapiSelectLineItem('item', line);

//	// Calculate discount
//	rate = nlapiGetLineItemValue('item', 'rate', line);
//	qty = nlapiGetLineItemValue('item', 'quantity', line);			
//	taxrate1 = 	nlapiGetLineItemValue('item', 'taxrate1', line);
//	//total

//	// Calculate the tax for the items
//	taxRateForLine = (rate * qty) * (parseFloat(taxrate1)/100);

//	// Calculate the amount to be discounted from each order
//	var discountAmount = (((rate*qty)+ taxRateForLine)/ orderTotal) * discountCurrency;

//	nlapiSelectLineItem('item', currentLineNumber); // 1.4.6
//	nlapiSetCurrentLineItemValue('item', 'custcol_discount_amount', discountAmount);
//	nlapiCommitLineItem('item');
//	}	

//	}

//	// Set discountitem magic number [todo]
//	nlapiSetFieldValue('discountitem', 15516, false, true); // Set to Promotional Discount 1.2.2

//	// Set the discount field to this new total
//	nlapiSetFieldValue('discountrate', "-" + discountCurrency, false, true);

//	// Set all the lines to have an offer applied to them
//	setAllLinesWithoutOfferToOffer();

//	retVal = true;

//	}
//	catch(e)
//	{
//	errorHandler('orderDiscountCurrency', e);

//	retVal = false;
//	}

//	}

	return retVal;
}

/**
 * @returns {Boolean}
 */
function orderDiscountPercent()
{
	var retVal = false;

	try
	{
		// Set discountitem	[todo] nagic number
		nlapiSetFieldValue('discountitem', 15516, false, true); 
		// Set the discount field to this new total
		
		nlapiSetFieldValue('discountrate', "-" + discountPercentage + "%", false, true);		// 1.5.2 was the line below
		//nlapiSetFieldValue('discountrate', "-" + orderDiscountPercent + "%", false, true);

		retVal = true;
	}
	catch(e)
	{
		errorHandler('orderDiscountPercent', e);
		retVal = false;
	}

	return retVal;
}

/**
 * Adds a free item to the order
 * 1.3.8 add item function introduced
 * @param currentSearchResult
 * @returns {Boolean}
 */
function itemFreeOrder(currentSearchResult)
{
	var retVal = false;
	var offerApplied = false;


	// get the search results and place them in variables
	givenQuantity = searchResults[currentSearchResult].getValue(columns[13]);
	givenItem =  searchResults[currentSearchResult].getValue(columns[14]);
	givenPrice = searchResults[currentSearchResult].getValue(columns[12]);

	// Check the offer has not already been applied
	for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
	{
		if (parseInt(nlapiGetLineItemValue('item', 'custcol_lineoffer', line)) == offerId)
		{
			offerApplied = true;
		}
	}

	if (!offerApplied)
	{
		setAllLinesWithoutOfferToOffer();

		// add the item to the basket 1.3.8
		addItemToBasket();


		retVal = true;
	}

	return retVal;
}

/**
 * add item to basket
 * 1.3.8 added to consolidate various add routines
 * 1.4.2 amended 30/10/2012 - get price EX VAT
 * 1.4.9 amended 05/11/2012 - ask before adding if the item has a value
 */
function addItemToBasket()
{

	var amount = 0;
	var vatAmount = 0;
	var priceEXVat=0;
	var response = true;
	var desc='';
	var iCode = '';


	try
	{
		nlapiSelectNewLineItem('item');
		nlapiSetCurrentLineItemValue('item', 'item', givenItem, false, true);

		// 1.4.5 Modify shipping item
		if (nlapiGetCurrentLineItemValue('item', 'custcol_isshipping') == 'T')
		{
			for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
			{
				if (nlapiGetLineItemValue('item', 'custcol_promotionlineadded', line) != 'T' 
					&& nlapiGetLineItemValue('item', 'custcol_isshipping', line) == 'T')
				{
					nlapiCancelLineItem('item');
					nlapiSelectLineItem('item', line);
					nlapiSetCurrentLineItemValue('item', 'item', givenItem, false, true);
					break;
				}
			}
		}

		nlapiSetCurrentLineItemValue('item', 'quantity', givenQuantity, false, true);

		// set the price level to -1 for custom
		nlapiSetCurrentLineItemValue('item', 'price', -1, false, true);

		//*******************************
		// get the item price EX VAT
		// 1.4.2 added 30/10/2012
		//*******************************

		priceEXVat = getPriceExVat(nlapiGetCurrentLineItemValue('item', 'taxrate1'), givenPrice);

		// set the price of amount to the offer set price
		nlapiSetCurrentLineItemValue('item', 'rate', priceEXVat, false, true);

		amount = priceEXVat * givenQuantity;
		nlapiSetCurrentLineItemValue('item', 'amount', amount, false, true);

		vatAmount = Math.round((givenPrice - priceEXVat) * 100)/100;
		nlapiSetCurrentLineItemValue('item', 'tax1amt', vatAmount, false, true);


		nlapiSetCurrentLineItemValue('item', 'custcol_promotionlineadded', 'T', false, true);
		nlapiSetCurrentLineItemValue('item', 'custcol_lineoffer', offerId, false, true);

		// 1.4.9 ask
		if(priceEXVat != 0)
		{
			desc = nlapiGetCurrentLineItemValue('item', 'description');
			iCode = nlapiGetCurrentLineItemText('item', 'item');

			response = confirm('Are you sure you wish to add this item to the basket: ' + iCode + " " + desc + " for £" + givenPrice + " each");
		}

		if(response==true)
		{
			nlapiCommitLineItem('item');
		}
	}
	catch(e)
	{
		errorHandler('addItemToBasket', e);
	}

}


/**
 * Applies the offerId to all lines that do not have an offer
 * 1.3.8 - remove setting flag - disable this routine
 */
function setAllLinesWithoutOfferToOffer()
{
//	// Loop over all the lines without offers applied and apply the offer
//	for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
//	{
//	if(!nlapiGetLineItemValue('item', 'custcol_lineoffer', line) && 
//	nlapiGetLineItemValue('item', 'custcol_isshipping', line) != 'T')
//	{
//	nlapiSelectLineItem('item', line);

//	// 1.3.8 
//	//nlapiSetCurrentLineItemValue('item', 'custcol_lineoffer', offerId, false, true);
//	nlapiCommitLineItem('item');
//	}
//	}
}

/**
 * User Event (Before Submit)
 * @param type
 */
function customBeforeSubmit(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'type', type);
		// If the record is new or has been updated
		if (type == 'create' || type == 'edit')
		{
			// Calculate the shipping only if we're on the standard order type (not a refund etc)
			if (nlapiGetFieldValue('custbody_mrf_tran_ordertype') == '1') // 1.5.4
			{
				calcShipping(); // 1.4.7
			}
		}
	}
	catch(e)
	{
		errorHandler("customBeforeSubmit", e);
	}
}


/**
 * User Event (After Submit)
 * 
 * @param type
 * 
 *  1.3.0
 */
function salesOrderSaved(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'type', type);
		if(type == 'create')
		{
			var custRecordChanged = false;

			// Save the string in the customer record.
			var recordId = genericSearch('customrecord_cust_applied_offers', 'custrecord_customer', nlapiGetFieldValue('entity'));

			// Check to see if there are any recordId's and if so Load them or Create them
			if (recordId == 0)
			{
				cust = nlapiCreateRecord('customrecord_cust_applied_offers');			
				cust.setFieldValue('custrecord_customer', nlapiGetFieldValue('entity'));
			}
			else
			{
				cust = nlapiLoadRecord('customrecord_cust_applied_offers', recordId);
			}

			// Get the applied offers by looping over the item list and storing all the offers used
			var appliedOffersArray = new Array();

			for (var line = 0; line < nlapiGetLineItemCount('item'); line++)
			{
				var lineAppliedOfferId = nlapiGetLineItemValue('item', 'custcol_lineoffer', line);

				if (lineAppliedOfferId > 0)
				{
					// Filter duplicates
					if (appliedOffersArray.indexOf(lineAppliedOfferId) < 0)
					{
						// Push offer into array
						appliedOffersArray.push(lineAppliedOfferId);
					}
				}
			}

			// If the campaign code is set, clear it
			if (cust.getFieldValue('custrecord_campaigncode') > 0)
			{
				cust.setFieldValue('custrecord_campaigncode', '');
				custRecordChanged = true;
			}

			// Get the current spent offers
			var spentOffersArray = cust.getFieldValues('custrecord_spent_offers');

			if(!(spentOffersArray instanceof Array))
			{
				spentOffersArray = new Array();
			}

			// Concatenate the values with values that are already stored
			var newSpentOffersArray = spentOffersArray.concat(appliedOffersArray);

			// Submit the record if we have added anything to the record
			if (newSpentOffersArray.length > spentOffersArray.length || !(recordId > 0))
			{
				// Set the spent offers
				cust.setFieldValues('custrecord_spent_offers', newSpentOffersArray);

				custRecordChanged = true;
			}

			if (custRecordChanged)
			{
				nlapiSubmitRecord(cust, false, false);
			}
		}

	}
	catch(e)
	{
		errorHandler("salesordersaved", e);
	}

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
 * @param startDate
 * @param endDate
 * @param tranDate
 * @returns {Boolean}
 */
function checkDate(startDate,endDate, tranDate)
{
	var retVal = false;

	var convertedStartDate = null;
	var convertedEndDate = null;
	var convertedTranDate = null;

	// change the strings to dates	
	convertedStartDate = nlapiStringToDate(startDate);
	convertedEndDate = nlapiStringToDate(endDate);
	convertedTranDate = nlapiStringToDate(tranDate);

	// change the date into milliseconds since 1971..
	startDate = Date.parse(convertedStartDate);
	endDate = Date.parse(convertedEndDate);
	tranDate = Date.parse(convertedTranDate);

	// do a check to find out if the tranDate is within the specified start and end dates
	if(tranDate >= startDate && tranDate <= endDate)
	{
		retVal = true;
	}
	else
	{
		alert('The selected item does not fall within the selected offer date range');
	}

	return retVal;
}

/**
 * @param currentSearchResult
 * @returns {Boolean}
 */
function checkCustomer(currentSearchResult)
{	
	var retVal = false;	
	var qualifyCustomers = '';
	var custArray = new Array();

	try
	{
		// using the custom list_offeravaiabletolist
		// 1 - all customers
		// 2 - defined below
		if(searchResults[currentSearchResult].getValue(columns[2]) == 2)
		{

			// 1.1.2 - Check if entity is eligible
			qualifyCustomers = searchResults[currentSearchResult].getValue(columns[3]);
			custArray = qualifyCustomers.split(',');

			if(custArray.indexOf(selectedCustomer) >= 0)
			{
				retVal = true;
			}
		}
		else
		{
			// return true as all customers can use this offer
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('checkCustomer', e);
		retVal = false;
	}

	return retVal;
}


/**
 * general error handler
 * 
 * @param e
 * 
 * 1.5.7 - Function name appears near start of title for ease of readability
 */
function errorHandler(sourceRoutine, e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'Unexpected Error in ' + sourceRoutine + ': ' + errorMessage, e.toString());
	updateScreenErrorInformation();

}

/**
 * update screen error information
 * 
 * @param e
 */
function updateScreenErrorInformation()
{
	nlapiSetFieldValue('custbody_offersinformation', errorDesc , false, true);
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


//**********************************************************************************************************************************
//1.3.8 - added 
//search campaigns that are valid for this customer 
//if only customer code supplied is used to deduce the latest campaign the customer is associated with
//if both campaign and customer supplied - used to verify the customer is part of that campaign
//where customer is not part of a campaign, default to 'Generic Campaign'
//1.4.4 - amended 31/10 - check for valid campaign without customer


//params:
//campaign code = 'F13109'
//customer internal ID = 2163
//brandId = [-1=Ignore,1=MRF,2=DTB,3=WLM,4=JNS]

//sets/returns:
//success/failure
//campaigncode

//example use: runSavedSearchCampaigns('Summer into Autum', 2163);
//**********************************************************************************************************************************


function runSavedSearchCampaigns(campaignCode, customer, brandId)
{

	var savedSearch = 'customsearch_latestcampaigns';
	var genericCampaign = 'Generic Campaign';
	var criteria = null;
	var loadSearch = null;
	var runSearch = null; 
	var campaignSearchResults = null;
	var retVal = false;
	var searchResult = null;

	try
	{
		// 1.5.0
		switch(parseInt(brandId)) // 1.5.6
		{
		case 2:
			genericCampaign = 'DTB Generic Campaign';
			break;
		case 3:
			genericCampaign = 'WLM Generic Campaign';
			break;
		case 4:
			genericCampaign = 'JNS Generic Campaign';
			break;
		default:
			genericCampaign = 'Generic Campaign';
		}

		// if the customer has been entered without a campaign code
		if (customer != 0 && campaignCode.length == 0)
		{
			criteria = [[ 'internalid', 'is', customer ]];
		}

		// campaign code entered without a valid campaign code 1.4.4
		if (customer == 0 && campaignCode.length != 0)
		{
			criteria = [[ 'campaignresponse.title', 'is', campaignCode ]];
		}

		// if the customer has been entered with a campaign code
		if (customer != 0 && campaignCode.length != 0)
		{
			criteria = [[ 'internalid', 'is', customer  ],'and',[ 'campaignresponse.title','is', campaignCode ]];
		}

		// if only a campaign has been entered - default to the generic campaign
//		if(customer==0 && campaignCode.length!=0)
//		{
//		campaignCode = genericCampaign;
//		criteria =[[ 'campaignresponse.title', 'is', campaignCode]];
//		}

		//Loading the saved search
		loadSearch = nlapiLoadSearch('customer', savedSearch);
		
		// default to the generic code if nothing found
		derivedCampaignCode = genericCampaign;

		// set the filter for the search
		if(criteria != null)
		{
			loadSearch.setFilterExpression(criteria);
			
			// Running the loaded search
			runSearch = loadSearch.runSearch();

			// Getting the first 100 results
			campaignSearchResults = runSearch.getResults(0, 100);

			if (campaignSearchResults != null)
			{
				if (campaignSearchResults.length > 0)
				{
					searchResult = campaignSearchResults[0];

					// [hack] [magicnumber] - remove when time permits
					var columns = searchResult.getAllColumns();
					var column = columns[2];

					// get the campaign code
					derivedCampaignCode = searchResult.getValue(column);

					retVal = true;
				}

			}
		}
		else
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("runSavedSearchCampaigns", e);
		retVal = false;
	}


	return retVal;
}

/**
 * get Partner From Campaign
 * 
 * @param campCode
 */
function getPartnerFromCampaign(campCode)
{

	var partnerID = null;
	var campIntID = 0;
	var partnerCampaign = null;

	try
	{
		campIntID = genericSearch('campaign', 'title', campCode);
		partnerCampaign = nlapiLoadRecord('campaign', campIntID);
		partnerID = partnerCampaign.getFieldValue('custevent_mrf_campaign_partner');
	}
	catch(e)
	{
		errorHandler("getPartnerFromCampaign", e);
	}
	
	return partnerID; 

}


//**********************************************************************************************************************************
//1.3.8 added
//1.4.5 No permission for Campaign for some users (i.e. MRF Customer Services role) so added formula
//get offers associated with a campaign
// 1.5.1 get partner for campaign

//params:
//campaign code = 'F13109'

//sets/returns:
//success/failure
//sets an array of offers = applicableOffers
//**********************************************************************************************************************************


function retrieveOffersAssociatedWithCampaign(campCode)
{
	var retVal = false;
	var offersRetVal = 0;

	try
	{
		offersRetVal = genericSearchAdvanced('customrecord_mrfoffer', 'formulatext', campCode, 'contains', '{custrecord_mrf_offer_campaign}');

		if(offersRetVal != 0)
		{
			copyOffersToArray();
			partner = getPartnerFromCampaign(campCode);	
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("retrieveOffersAssociatedWithCampaign", e);
	}

	return retVal;
}



/**
 * generic search with operator and formula
 * 1.3.8 added genericSearchOperator
 * 1.4.5 formula added - renamed genericSearchAdvanced
 * 
 * @param table
 * @param fieldToSearch
 * @param valueToSearch
 * @param operator
 * @returns {Number}
 */

function genericSearchAdvanced(table, fieldToSearch, valueToSearch, operator, formula)
{
	var internalID = 0;

	// Arrays
	var filters = new Array();
	var columns = new Array();

	//search filters                  
	filters[0] = new nlobjSearchFilter(fieldToSearch, null, operator, valueToSearch);

	if (formula != '' && formula != null)
	{
		filters[0].setFormula(formula);
	}

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

	return internalID;
}


/**
 * 1.3.8 copy search offers to array
 */
function copyOffersToArray()
{

	try
	{
		for ( var i = 0; itemSearchResults!= null && i < itemSearchResults.length; i++ )
		{
			applicableOffers[i] = itemSearchResults[i].getId();
		}

	}
	catch(e)
	{
		errorHandler("copyOffersToArray", e);
	}

}


/**
 * 1.3.9
 * NetSuite does not render HTML for new cart lines added in a 
 * custom FieldChanged function (defect #233757). 
 * This code generates JavaScript that enables offershelper.js to show
 * all the cart lines on the Review & Submit page. 
 */
function cartLineBugWorkaround()
{
	try
	{
		var context = nlapiGetContext();
		var js = 'var cartLines = new Array();';

		// Loop over all line items and produce code to replicate cart
		for (var i = 1; i <= nlapiGetLineItemCount('item'); i++)
		{
			var onHand = nlapiGetLineItemValue('item', 'custcol_onhand', i);
			var stockWarning = '';

			if (onHand <= 0)
			{
				stockWarning = '<b>(Out of Stock)</b><br><div class="errortext bglt" border="1">This item may be back-ordered.</div>';
			}

			// Generate JavaScript for the web page
			js += 'cartLines.push(new CartLine(\''
				+ nlapiGetLineItemValue('item', 'custcol_mrf_itemcode', i) + '\','
				+ '\'/s.nl/c.' + context.getCompany() + '/it.A/id.' + nlapiGetLineItemValue('item', 'item', i) + '/.f\','
				+ '\'' + nlapiGetLineItemValue('item', 'custcol_storedisplayname', i) + '\','
				+ nlapiGetLineItemValue('item', 'quantity', i) + ','
				+ '\'' + nlapiGetLineItemValue('item', 'description', i) + '\',' 
				+ nlapiGetLineItemValue('item', 'rate', i) + ','
				+ parseFloat(nlapiGetLineItemValue('item', 'tax1amt', i)) + ','
				+ '\'' + stockWarning + '\','
				+ '\'' + nlapiGetLineItemValue('item', 'custcol_lineoffer', i) + '\',' 
				+ '\'' + nlapiGetLineItemValue('item', 'custcol_isshipping', i) + '\'));';
		}

		js += '$(document).ready(function(){generateCart(cartLines);});';

		// Set the js in a custom field, accessed and executed by getField()
		// in the Review/Submit message area
		nlapiSetFieldValue('custbody_js', nlapiGetFieldValue('custbody_js') + js, false, true);
	}
	catch(e)
	{
		errorHandler('cartLineBugWorkaround', e);
	}
}

//**********************************************************************************************************************************
//1.4.1 - added 
//1.5.5 - ameneded to use the lead source 
//find transactions for this customer in this campaign

//params:
//campaign code = 'F13109'
//customer internal ID = 2163
//internal id for saved search = 169

//sets/returns:
//success/failure

//example use: runSavedSearchPercentOffOrder('Summer into Autum', 2163, 169);
//**********************************************************************************************************************************

function runSavedSearchPercentOffOrder(campaignCode, customer, savedSearch)
{

	var criteria = null;
	var loadSearch = null;
	var runSearch = null; 
	var campaignSearchResults = null;
	var retVal = false;

	try
	{

		// if the customer has been entered with a campaign code
		if(customer!=0 && campaignCode.length!=0)
		{
			// zzzz
			//criteria =[[ 'name', 'is', customer  ],'and',[ 'custbody_order_offers','is', campaignCode ]];
			criteria =[[ 'name', 'is', customer  ],'and',[ 'leadsource','is', campaignCode ]];

			//Loading the saved search
			loadSearch = nlapiLoadSearch('transaction', savedSearch);

			// set the filter for the search
			if(criteria!=null)
			{
				loadSearch.setFilterExpression(criteria);
			}

			//Running the loaded search
			runSearch = loadSearch.runSearch();

			//Getting the first 1000 results
			//[todo] sense check
			campaignSearchResults = runSearch.getResults(0,100);

			retVal = true;		// if no orders found, success

			if(campaignSearchResults != null)
			{
				if(campaignSearchResults.length > 0)
				{
					retVal = false;
				}

			}
		}
	}
	catch(e)
	{
		errorHandler("runSavedSearchPercentOffOrder", e);
		retVal = false;
	}


	return retVal;
}


//*********************************************************
//get the price of an item EX Vat - 1.4.2 added 30/10/2012
//params:
//itemCode
//price

//returns:
//price minus the VAT

//harness: getPriceExVat(15370, 4.95)
//*********************************************************

function getPriceExVat(taxRate, price)
{
	var priceEXVat = 0;
	var vatRate = 0;

	try
	{
		priceEXVat = price;

		// lookup the item to determine the vat code
		vatRate = taxRate;
		vatRate = parseFloat(vatRate);

		// reduced the price by the VAT percentage
		if(vatRate != 0)
		{
			vatRate = 1 + (vatRate/100);
			priceEXVat = price / vatRate;
			priceEXVat = Math.round(priceEXVat * 100) / 100;
		}
	}
	catch(e)
	{
		errorHandler('getPriceExVat', e);
	}

	return priceEXVat;
}
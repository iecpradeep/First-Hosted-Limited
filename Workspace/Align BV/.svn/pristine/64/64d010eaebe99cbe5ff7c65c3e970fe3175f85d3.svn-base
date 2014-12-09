/*************************************************************************************
 * Name:		discountsEngine.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 1st release 06/03/2013 LD
 *
 * Author:		FHL
 * 
 * Purpose:		Calculate discount(s) for a give item(s) / customer / order combination
 * 
 * Script: 		customscript_discounts_engine
 * Deploy: 		customdeploy_usereventdiscountsengine
 * 
 * Notes:		triggered by creation / update of an estimates record		
 * 
 * Libraries: 	library.js, libraryXML.js
 *************************************************************************************/
/*
 * Run-time settings for this deployment instance
 * Check for non-default run-time settings during initialise() ...
 */
var debugOn = false;
var transformToSalesOrder = true;
var deleteAfterTransform = false;
var isManualOrder = '';

// Core variables / parameters
// recordType will be the context for execution options
var recordType = '';    
var estimateID = null; // The ID will be worked out via initialise()
var estimateObj = null;
var estimateCurrencyID = null; //Used for fixed price discounting
var estimateRecord = null;
var itemListCount = 0;
var itemIgnoreCount = 0;
var itemInvoiceCount = 0;

//Outgoing Sales Order record
var salesOrderObj = null;
var salesOrderID = 0;
var orderNumber = null;
var AlignOrderNumber = null;
var AlignOrderDate = null;

// Record and log the discount before / after
var estimateTotalBefore = 0.00;
var estimateTotalAfter = 0.00;

// Doctor (customer) related parameters - the customer/entity ID, name
// The parent customer entity name - will be null if not a child entity after init()
var entityID = null; // 
var parentEntityID = null;
var customerInternalID = null;
var parentCustomerInternalID = null;
var customerChannel = null;
var customerARaccount = null;
var customerRecord = new Object();
var customerFamilyIDs = new Array();
var billingAddressCountryID = null;

// Patient / coupon related parameters can be used for coupons activation
// If couponsEligibilityID present, will be used to update coupon record
// once the sales order created / updated - today's date if needed to update
var patientID = null; 
var couponsEligibilityID = null;
var todayDate = new Date();
todayDate = nlapiDateToString(todayDate, 'date');

// TIBCO feed record - store the XMl discount answer here
// Events staging record if in that context
var payloadRecordID = null;
var stagingRecordID = null;

//Advantage program parameters
var advantageMin = 0;
var advantageMax = 0;
var advantageType = '';

// Discount Scheme types and rates
// Derived from custom list
var SCHEMECUSTOMERTYPE = "CUSTOMER";
var SCHEMEORDERTYPE = "ORDER";
var SCHEMEITEMTYPE = "ITEM";
var SCHEMEPATIENTTYPE = "PATIENT";
var SCHEMEFIXEDRATE = "FIXED";
var SCHEMEPERCENTRATE = "PERCENT";

//Discount Scheme & Tier & eligible search arrays 
var isEligible = false; //If it changes to true then discount process stops and is applied

var searchDiscountSchemeRows = new Array();
var schemeRow = null;
var schemeRowDate = 'trandate'; // Default, can be over-ridden during initialise
var schemeRowDateFrom = null;
var schemeRowDateTo = null;
var schemeRowCountriesArray = new Array();

var searchDiscountTierRows = new Array();
var searchDiscountTierRows = new Array();

//Discount item(s) array and associated fields
var discountItemsArray = new Array();	// will contain a list of item objects
var discountItemsCount = 0;				// number of discountItems
var discountItemRecord = null;			// each item will use this
var discountItemID = 0;
var discountItemRate = 0.00;			// Percent or fixed amount
//var AdditionalDiscountItemRecord = null;// each item will use this
//var AdditionalDiscountItemID = 0;
//var AdditionalDiscountItemRate = 0.00;	// Percent or fixed amount

//Assembly of order / item level amounts
var orderLevelDiscountTotal = 0.00;
var itemLevelDiscountTotal = 0.00;

//Pointers / counters / objects
var currentLineItem = 0;
var orderLevelDiscountCounter = 0;
var ORDERLEVELITEMID = 1384; // Fixed placeholder ID - temp
var thisDiscountItemObj = new Object();
var itemLevelDiscountCounter = 0;
var discountAmountRate = 0.00;
	
//outgoing answer for Discounts
var XMLDiscountAnswer = '';				// XML Answer assembled in this
var XMLItemAnswerList = ''; 	// The list of item discounts
var XMLOrderAnswer = '';  		// The order level discount

//The Price List Answer XML Tag definitions
var XMLDISCOUNTANSWER = 'DISCOUNTCALC';
var XMLORDERLEVEL = 'ORDERLEVELDISCOUNT';
var XMLORDERRATE = 'ORDERRATE';
var XMLORDERAMOUNT = 'ORDERAMOUNT';
var XMLORDERDESC = 'ORDERDESC';
var XMLITEMLEVELLIST = 'ITEMLEVELDISCOUNTS';
var XMLITEMDISCOUNT = 'ITEMLEVELDISCOUNT';
var XMLORDITEMINDEX = 'ORDITEMINDEX';
var XMLDISCITEMID = 'DISCDISCITEMID';
var XMLDISCITEMRATE = 'DISCDISCITEMRATE';
var XMLDISCITEMAMOUNT = 'DISCDISCITEMAMOUNT';
var XMLDISCITEMDESC = 'DISCDISCITEMDESC';

//XML Errors compilation
var XMLERRORLIST = 'DISCOUNTERRORS';
var XMLERRORITEM = 'ERRORITEM';
var XMLERRORSOURCE = 'ERRORSOURCE';
var XMLERRORMSG = 'ERRORMSG';
var XMLErrors = '';

/*
 * Main body modified to accept a TIBCO record ID parameter to trigger the engine
 * This replaces the user event driven approach used previously.
 */
function discountsEngine()
{
	//nlapiLogExecution('DEBUG', "discountsEngine()", "Before ...");

	try
	{

		initialise();

		// Only engage discounts process if order is not FOC and there are invoiceable line(s)
		if (parseFloat(estimateTotalBefore) > 0.00 && itemInvoiceCount > 0) {
			// Try each eligible scheme in turn until one is found
			for ( var thisScheme = 0; thisScheme < searchDiscountSchemeRows.length; thisScheme++) {				
				if (!isEligible) {
					// Load the next Scheme row (scheme definition)
					schemeRow = searchDiscountSchemeRows[thisScheme];
					// take the scheme and scan all tiers for eligibility
					findAnyDiscountForScheme();
				}				
			}

			applyAnyDiscount();
		}

		processEstimatetoSalesOrder();

		completeAndSaveXMLDiscountAnswer();

	}
	catch (e)
	{
		errorHandler("discountsEngine", e);
	}
	
	//nlapiLogExecution('DEBUG', "discountsEngine()", "After ...");

}

/*
 * Get the tiers / saved searches for the scheme and test against the type and
 * instance .e.g. if type = CUSTOMER then filter by entityid if type = ORDER
 * then filter by tranid if type = CUSTOMER then filter by itemid
 * 
 * If a search matches then the discount applies work out the amount and store
 * in the discounts array
 * 
 */
function findAnyDiscountForScheme()
{
	try
 	{
		// Set up the scheme parameters ready for the search filters to be
		// applied
		var schemeID = genericSearch(
				'customrecord_alignbv_pricediscountscheme', 'name', schemeRow
						.getValue('name'));
		var schemeTypeID = schemeRow
				.getValue('custrecord_alignbv_scheme_basedisc_type');
		var schemeLevel = getSchemeLevel(schemeTypeID);
		var schemeRate = getSchemeRate(schemeTypeID);
		var schemeCountries = schemeRow
				.getValue('custrecord_alignbv_scheme_countrylisttxt');
		// T/F whether to use coupons custom table
		var schemeUseCoupons = schemeRow
				.getValue('custrecord_alignbv_scheme_coupon_lookup'); 
		
		// Need to load record to obtain multi-select as no .getValues/Texts in search APIs ....?!
		var schemeRowDateArray = new Array();
		var schemeRecord = nlapiLoadRecord('customrecord_alignbv_pricediscountscheme', schemeID);
		var schemeDateSelectArray = schemeRecord.getFieldValues('custrecord_alignbv_scheme_effectivedate');
		var schemeDatesDebugText = ""; // To show list in debug trace
		
		// Build the array of date name(s) to test against
		for (var d=0; d<schemeDateSelectArray.length; d++)
		{
			schemeRowDateArray[d] = nlapiLookupField(
				'customrecord_alignbv_discount_schemedate', schemeDateSelectArray[d],
				'custrecord_alignbv_scheme_datefield_id');
			schemeDatesDebugText += schemeRowDateArray[d] + " ";
		}
		
		schemeRowDateFrom = schemeRow
				.getValue('custrecord_alignbv_scheme_effectivefrom');
		schemeRowDateTo = schemeRow
				.getValue('custrecord_alignbv_scheme_effectiveto');
		schemeRowCountriesArray = schemeCountries.split(',');

		if (debugOn)
			nlapiLogExecution('DEBUG', "discountScheme" + " ==> "
					+ schemeRow.getValue('name'), "ID = " + schemeTypeID
					+ " Level = " + schemeLevel + " Rate = " + schemeRate
					+ " schemeRowDate(s) = " + schemeDatesDebugText
					+ " schemeRowDateFrom = " + schemeRowDateFrom
					+ " schemeRowDateTo = " + schemeRowDateTo
					+ " schemeUseCoupons = " + schemeUseCoupons
					+ " schemeCountries = " + schemeCountries);

		// Now get the list of all possible tiers to apply, for this scheme
		// defined in sequence number(s) of saved search(es) to test

		var searchDiscscountTierFilters = new Array();
		searchDiscscountTierFilters[0] = new nlobjSearchFilter(
				'custrecord_alignbv_tier_type', null, 'anyof', (schemeID));

		searchDiscountTierRows = nlapiSearchRecord(
				'customrecord_alignbv_tiers_discounts',
				'customsearch_alignbv_discount_tiers',
				searchDiscscountTierFilters, null);

		// Try each eligible tier in turn - set the local tier parameters first			
		if (searchDiscountTierRows) { 
				for ( var thisTier = 0; thisTier < searchDiscountTierRows.length && !isEligible; thisTier++) {
					
					var tierRow = searchDiscountTierRows[thisTier];
					
					var tierSavedSearchID = tierRow
						.getValue('custrecord_alignbv_tier_criteria_search');
					var tierSavedSearchName = tierRow
						.getText('custrecord_alignbv_tier_criteria_search');
					var tierSeqNo = tierRow
							.getValue('custrecord_alignbv_tier_level_sequence');
					var tierMin = tierRow
							.getValue('custrecord_alignbv_tier_min_count');
					if (tierMin == null || tierMin == '')
						tierMin = 1;
					var tierMax = tierRow
							.getValue('custrecord_alignbv_tier_max_count');
					if (tierMax == null || tierMax == '')
						tierMax = 1;
					var tierFrequency = tierRow
							.getValue('custrecord_alignbv_tier_frequency');
					if (tierFrequency == null || tierFrequency == '')
						tierFrequency = 1;

					if (tierSavedSearchID) {
					var searchifEligibleObj = nlapiLoadSearch('',
							tierSavedSearchID);
					var searchType = searchifEligibleObj.getSearchType();

					// Assemble the criteria
					var criteria = new Array();
					// Work out which scheme level criteria applies in order
					// :-
					// Customer --> Order --> Item level

					switch (schemeLevel)
					{
					case SCHEMEORDERTYPE:
					case SCHEMEITEMTYPE:
					//case SCHEMEPATIENTTYPE:
						var estimateCriteria = new Array('internalid', 'is', estimateID);
							criteria.push(estimateCriteria);
						break;
					case SCHEMECUSTOMERTYPE:
						var entityCriteria = new Array();
						var entityChildCriteria = new Array('entity', 'anyof', customerFamilyIDs);
						entityCriteria.push(entityChildCriteria);
						if (entityCriteria) {
							//criteria.push('and');
							criteria.push(entityCriteria);
						}
						break;
					default:
						return null;
						break;
					}
					
					// Date range of the scheme in relation to the date type
					// used by the scheme
					// Accept if a date parameter and at least one date
					// range field present
					if (schemeRowDateArray.length > 0 && (schemeRowDateFrom || schemeRowDateTo)) {

						var dateRangeCriteria = new Array();

						if (schemeRowDateFrom && !schemeRowDateTo) {
							for ( var d = 0; d < schemeRowDateArray.length; d++) {
								if (d > 0)
									dateRangeCriteria.push('and');
								var dateRangeMultiCriteria = new Array(
										schemeRowDateArray[d], 'onorafter',
										schemeRowDateFrom);
								dateRangeCriteria.push(dateRangeMultiCriteria);
							}
						} else {
							if (!schemeRowDateFrom && schemeRowDateTo) {
								for ( var d = 0; d < schemeRowDateArray.length; d++) {
									if (d > 0)
										dateRangeCriteria.push('and');
									var dateRangeMultiCriteria = new Array(
											schemeRowDateArray[d],
											'onorbefore', schemeRowDateTo);
									dateRangeCriteria
											.push(dateRangeMultiCriteria);
								}
							} else // Both date ranges present - use within
							{
								for ( var d = 0; d < schemeRowDateArray.length; d++) {
									if (d > 0)
										dateRangeCriteria.push('and');
									var dateRangeMultiCriteria = new Array(
											schemeRowDateArray[d], 'within',
											schemeRowDateFrom, schemeRowDateTo);
									dateRangeCriteria
											.push(dateRangeMultiCriteria);
								}
							}
						}
						if (dateRangeCriteria) {
							criteria.push('and');
							criteria.push(dateRangeCriteria);
						}
					}

					// Eligible countries list - text string as multi-select is
					// buggy in UI / web browsers
					if (schemeRowCountriesArray) {
						criteria.push('and');
						var countryCriteria = new Array(
								'custbody_alignbv_billing_region', 'anyof',
								schemeRowCountriesArray);
						criteria.push(countryCriteria);
					}
					
					// set the filter for the search, preserve originals if present, 
					// add on the customised filters based on the above conditions
					if (!searchifEligibleObj.getFilters()) {
						searchifEligibleObj.setFilterExpression(criteria);
					} else {
						var tempFilters = searchifEligibleObj.getFilters();
						searchifEligibleObj.setFilterExpression(criteria);
						searchifEligibleObj.addFilters(tempFilters);
					}

					// Use this below to trace search criteria
					// as required during development
					if (debugOn)
						logCriteria(searchifEligibleObj.getFilters());

					// Running the loaded search
					var searchRows = 0;
					var itemCode = new Array();
					var itemLine = new Array();

					var searchResults = searchifEligibleObj.runSearch();

					var debugColResults = ''; // Used to assemble debug trace if needed
					searchResults.forEachResult(function(searchResult) {
						var cols = searchResult.getAllColumns();
						cols.forEach(function(c) {
							if (c.getLabel() == 'Item')
								itemCode.push(searchResult.getValue(c));
								//itemCode = searchResult.getValue(c);
							if (c.getLabel() == 'Line Sequence Number')
								itemLine.push(searchResult.getValue(c));
								//itemLine = searchResult.getValue(c);
							if (debugOn)
								debugColResults += "  Col["	+ c.getLabel() + "]=" + searchResult.getValue(c);
							return true; // return true to keep iterating
						});
						searchRows += 1; // process the search result
						return true; // return true to keep iterating
					});
					
					if (debugOn && searchResults)
						nlapiLogExecution('DEBUG', "SearchCols Results : " + searchRows + " Rows : TierMin=" + tierMin + ", TierMax=" + tierMax, debugColResults);

					// If we have a match - add the discount to the array if and only if :-
					// 1 - the number of rows is between min / max parameters 
					// 2 - the number of rows % MOD frequency = 0 i.e. every time, every 2nd, 3rd, etc.
					// 3 - a coupon available if applicable to this scheme
					if ((searchRows >= tierMin && searchRows <= tierMax) && searchRows % tierFrequency == 0)
					{
						isEligible = true;
						// Check for Coupons eligibility if applicable to this scheme's tier
						// It will return the record ID of a free coupon entry for this order
						// If none is available, is not eligible
						if (schemeUseCoupons == 'T')
						{
							if (patientID)
							{
								couponsEligibilityID = checkCouponsEligibility(tierSavedSearchName);
								if (!couponsEligibilityID)
									isEligible = false;
							}
							else
							{
								isEligible = false;
							}
						}
					}
					
					//  Only process if it passes tests above
					if (isEligible) {

						discountItemID = schemeRow
								.getValue('custrecord_alignbv_scheme_base_item');
						discountItemRecord = nlapiLoadRecord('discountitem',
								discountItemID);
						discountItemRate = tierRow
								.getValue('custrecord_alignbv_tier_base_discount');

						if (schemeRate == SCHEMEPERCENTRATE && !isNaN(discountItemRate)) {
							discountItemRate += "%";
						}

						if (schemeRate == SCHEMEFIXEDRATE) {
							if (debugOn)
								nlapiLogExecution('DEBUG', "Fixed Price Values", "custrecord_algnbv_fixedamount_usd=" + tierRow.getValue('custrecord_algnbv_fixedamount_usd')+ " custrecord_algnbv_fixedamount_gbp=" + tierRow.getValue('custrecord_algnbv_fixedamount_gbp'));

							switch (estimateCurrencyID){
							case getAlignCountryCurrency('AU'): // US Dollar
								discountItemRate = tierRow
								.getValue('custrecord_alignbv_fixedamount_usd');
								break;
							case getAlignCountryCurrency('GB'): // GB Pound
								discountItemRate = tierRow
								.getValue('custrecord_alignbv_fixedamount_gbp');
								break;
							case  getAlignCountryCurrency('CH'): // Swiss Franc
								discountItemRate = tierRow
								.getValue('custrecord_alignbv_fixedamount_chf');
								break;
							default:
								// Assume Euro
								break;
							}
						}
						
						if (!isNaN(discountItemRate)) {
							var itemObj = new Object();
							itemObj.internalid = discountItemID;
							itemObj.name = discountItemRecord
									.getFieldValue('itemid');
							itemObj.desc = schemeRow.getValue('name');
							itemObj.itemcode = itemCode.join(',');
							itemObj.itemline = itemLine.join(',');
							itemObj.schemelevel = schemeLevel;
							itemObj.schemerate = schemeRate;
							itemObj.rate = discountItemRate;

							discountItemsArray[discountItemsCount] = itemObj;
							discountItemsCount++;
						} else {
							addToErrorsXML("findAnyDiscount - No Rate", "The rate / amount is null or empty");
						}
						
						if (debugOn)
							nlapiLogExecution('DEBUG', "Discount Item "
									+ discountItemID + " : "
									+ discountItemsCount + " : discountTier("
									+ schemeID + ":" + thisTier + ") ==> "
									+ tierRow.getValue('name'), "searchRows = "
									+ searchRows + " SeqNo = "
									+ tierSeqNo + " Search = "
									+ tierSavedSearchID + " SearchType = "
									+ searchType + " schemeRate = "
									+ schemeRate + " Discount = "
									+ discountItemRate + " itemid = "
									+ itemObj.name + " itemcode(s) = " + itemObj.itemcode
									+ " itemline(s) = " + itemObj.itemline);
					}
				}
			} // For rows ...
		} // Search rows

	}
	catch (e)
	{
		errorHandler("findAnyDiscount", e);
	}

}

/*
 * Examine the discounts array, modify the estimate, assemble the Answer XML
 */
function applyAnyDiscount()
{

	try
	{
		// Only do if there are any discounts present
		if (discountItemsArray)
		{

			// Check discounts against each line item, add discounts at item level
			// Apply item level first as it may add discount line(s) to estimate
			
			
			for ( var thisEstimateItem = 1; thisEstimateItem <= itemListCount; thisEstimateItem++)
			{
				applyAnyItemLevelDiscount(thisEstimateItem);
			}

			// Now examine for Order level discount item(s)
			//applyAnyOrderLevelDiscount();

		}
	}
	catch (e)
	{
		errorHandler("applyAnyDiscount", e);
	}
}

/*
 * Examine the discounts array, modify the estimate, assemble the Answer XML
 */
function applyAnyItemLevelDiscount(thisEstimateItem)
{	
	//Use to build this item answer XML before adding to the current list XML
	var XMLItemAnswer = '';
	currentLineItem = thisEstimateItem;
	
	try
	{
		
		var thisEstimateItemid = estimateRecord.getLineItemValue('item', 'item',
				currentLineItem);
		var thisEstimateItemAmount = estimateRecord.getLineItemValue('item', 'amount',
				currentLineItem);
		var thisEstimateItemTaxCode = estimateRecord.getLineItemValue('item', 'taxcode',
				currentLineItem);

		// Check every item level discount against the item ids, if a match
		// then apply discount(s)
		for ( var thisDiscountItem = 1; thisDiscountItem <= discountItemsArray.length; thisDiscountItem++)
		{
			thisDiscountItemObj = discountItemsArray[thisDiscountItem - 1];

			if (debugOn)
				nlapiLogExecution('DEBUG', "applyAnyItemLevelDiscount(" + thisEstimateItem + ")" + thisEstimateItem + "/" + itemListCount, "currentLineItem = " + currentLineItem + " thisEstimateItemid = " + thisEstimateItemid   + " thisEstimateItemTaxCode = " + thisEstimateItemTaxCode  + " DiscItemCode(s) = " + thisDiscountItemObj.itemcode);

			var itemCodes = thisDiscountItemObj.itemcode.split(',');
			for (var thisDiscountItemCode = 0; thisDiscountItemCode < itemCodes.length; thisDiscountItemCode++) {
				if (itemCodes[thisDiscountItemCode] == thisEstimateItemid && discountAmountRate == 0.00) {

					discountAmountRate = thisDiscountItemObj.rate;

					// If last item line, add discount, else insert it
					if (thisEstimateItem == itemListCount) {
						estimateRecord.selectNewLineItem('item');
					} else {
						estimateRecord.insertLineItem('item',
								currentLineItem + 1);
					}

					estimateRecord.setCurrentLineItemValue('item', 'itemtype',
					'Discount');
					estimateRecord.setCurrentLineItemValue('item',
							'description', thisDiscountItemObj.desc);
					estimateRecord.setCurrentLineItemValue('item', 'item',
							thisDiscountItemObj.internalid);
					estimateRecord.setCurrentLineItemValue('item', 'rate',
							discountAmountRate);
					estimateRecord.setCurrentLineItemValue('item', 'taxcode',
							thisEstimateItemTaxCode);
					estimateRecord.commitLineItem('item');

					thisDiscountItemObj.discountAmount = estimateRecord
					.getLineItemValue('item', 'amount', currentLineItem);

					if (debugOn)
						nlapiLogExecution('DEBUG', "Line Index "
								+ estimateRecord
								.getCurrentLineItemIndex('item'),
								"currentLineItem = " + currentLineItem
								+ " amount = "
								+ thisDiscountItemObj.discountAmount);

					// Assemble the item answer elements
					XMLItemAnswer = createTaggedXML(XMLORDITEMINDEX,
							thisEstimateItem);
					XMLItemAnswer += createTaggedXML(XMLDISCITEMAMOUNT,
							thisDiscountItemObj.discountAmount);
					XMLItemAnswer += createTaggedXML(XMLDISCITEMID,
							thisDiscountItemObj.internalid);
					XMLItemAnswer += createTaggedXML(XMLDISCITEMRATE,
							discountAmountRate);
					XMLItemAnswer += createTaggedXML(XMLDISCITEMDESC,
							thisDiscountItemObj.name);
					// Apply wrapper XML
					XMLItemAnswer = createTaggedXML(XMLITEMDISCOUNT,
							XMLItemAnswer);
					// Append to existing XML Item Answer list
					XMLItemAnswerList += XMLItemAnswer;

					if (debugOn) {
						nlapiLogExecution('DEBUG', "XML Answer "
								+ thisDiscountItem, XMLItemAnswer);
						nlapiLogExecution('DEBUG', "Discount Item Level "
								+ thisDiscountItem + "/"
								+ discountItemsArray.length + " : Item ("
								+ thisEstimateItem + "/" + itemListCount + ":"
								+ estimateID + ") ==> " + thisEstimateItemid,
								" itemcode = " + thisDiscountItemObj.itemcode
								+ " name = " + thisDiscountItemObj.name
								+ " internalid = "
								+ thisDiscountItemObj.internalid
								+ " RateType = "
								+ thisDiscountItemObj.schemerate
								+ " Amount = "
								+ thisDiscountItemObj.schemelevel
								+ " : " + thisDiscountItemObj.rate);
					}

					itemLevelDiscountTotal = (parseFloat(itemLevelDiscountTotal) + parseFloat(discountAmountRate)).toFixed(2);
					itemLevelDiscountCounter++;
				}
			}
		}
	}
	catch (e)
	{
		errorHandler("applyAnyItemLevelDiscount: " + thisEstimateItem, e);
	}

}

function applyAnyOrderLevelDiscount()
{
	// A description of the discount based on the discount scheme name, plus rate amount
	var OrderDiscountDesc = '';
	
	try
	{

		for ( var thisDiscountItem = 1; thisDiscountItem <= discountItemsArray.length; thisDiscountItem++)
		{
			thisDiscountItemObj = discountItemsArray[thisDiscountItem - 1];

			if (thisDiscountItemObj.schemelevel == SCHEMEORDERTYPE
					|| thisDiscountItemObj.schemelevel == SCHEMECUSTOMERTYPE)
			{
				discountAmountRate = thisDiscountItemObj.rate;
				if (!isNaN(discountAmountRate))
					discountAmountRate = parseFloat(discountAmountRate)
							.toFixed(2);
				estimateRecord.setFieldValue('discountitem',
						thisDiscountItemObj.internalid);

				orderLevelDiscountTotal = parseFloat(orderLevelDiscountTotal)
						+ parseFloat(discountAmountRate);
				orderLevelDiscountCounter++;

				// Append a description item for the order level discount
				OrderDiscountDesc = thisDiscountItemObj.name + " : " + discountAmountRate;
				estimateRecord.selectNewLineItem('item');
				estimateRecord.setCurrentLineItemValue('item', 'itemtype',
						'Description');
				estimateRecord.setCurrentLineItemValue('item', 'item', ORDERLEVELITEMID);
				estimateRecord.setCurrentLineItemValue('item', 'description',
						thisDiscountItemObj.name + " : " + discountAmountRate);
				estimateRecord.commitLineItem('item');
					
				nlapiLogExecution('DEBUG', "Discount Order Level "
						+ thisDiscountItem + "/" + discountItemsArray.length
						+ ")", "name = "
						+ thisDiscountItemObj.name + " internalid = "
						+ thisDiscountItemObj.internalid + " RateType = "
						+ thisDiscountItemObj.schemerate + " Amount = "
						+ thisDiscountItemObj.rate);
			}
		}

		// Apply Order level discount if there is a value 
		// present after searching
		if (orderLevelDiscountCounter > 0)
		{
			if (thisDiscountItemObj.schemerate == SCHEMEPERCENTRATE)
				orderLevelDiscountTotal += "%";
			estimateRecord.setFieldValue('discountrate',
					orderLevelDiscountTotal);
			
			//Assemble the order discount answer elements
			XMLOrderAnswer += createTaggedXML(XMLORDERAMOUNT, estimateTotalBefore);				
			XMLOrderAnswer += createTaggedXML(XMLORDERRATE, orderLevelDiscountTotal);
			XMLOrderAnswer += createTaggedXML(XMLORDERDESC, OrderDiscountDesc);
			
			if (debugOn)
				nlapiLogExecution('DEBUG', "XMLOrderAnswer", XMLOrderAnswer);

		}
	}
	catch (e)
	{
		errorHandler("applyAnyOrderLevelDiscount: ", e);
	}

}

/*
 * Transform the Estimate to a sales order, delete Estimate if successful
 * These actions can be controlled via deployment paramaters
 */
function processEstimatetoSalesOrder()
{
	try
	{
		estimateID = nlapiSubmitRecord(estimateRecord, false, false);
		estimateObj = nlapiLoadRecord('estimate', estimateID);

		// Check the record exists and update 
		if (estimateObj)
		{
			estimateTotalAfter = estimateObj.getFieldValue('total');
			estimateObj.setFieldValue('memo', "Discount calc : Before : "
					+ estimateTotalBefore + " After : " + estimateTotalAfter);
			estimateID = nlapiSubmitRecord(estimateObj, false);

			if (estimateID > 0 && transformToSalesOrder)
			{
				salesOrderObj = nlapiTransformRecord('estimate', estimateID, 'salesorder', {
							recordmode : 'dynamic'
						});
				
				// Over-ride the dates with originals from TIBCO feed
				salesOrderObj.setFieldValue('trandate', estimateObj.getFieldValue('trandate'));
				salesOrderObj.setFieldValue('shipdate', estimateObj.getFieldValue('shipdate'));		
				salesOrderObj.setFieldValue('account', getCustomerAcctsReceivableID());
				
				// Check and close any items to be ignored or not invoiced
				var numLineItems = salesOrderObj.getLineItemCount('item');
				for (var checkCloseItem=1; checkCloseItem<=numLineItems; checkCloseItem++)
				{
					if (estimateRecord.getLineItemValue('item', 'itemtype',	checkCloseItem) != 'Discount')
					{
						var thisOrderItemIsInvoiced = estimateRecord.getLineItemValue('item', 'custcol_alignbv_to_invoice',
								checkCloseItem);
						var thisOrderItemIsIgnored = estimateRecord.getLineItemValue('item', 'custcol_alignbv_ignore_on_salesorder',
								checkCloseItem);

						if (thisOrderItemIsInvoiced == 'F' || thisOrderItemIsIgnored == 'T')
						{
							salesOrderObj.setLineItemValue('item', 'isclosed', checkCloseItem, 'T');
						} 
						
						if (debugOn)
							nlapiLogExecution('DEBUG', "Close Order item line ("
								+ checkCloseItem + "/" + numLineItems
								+ ")", "item = "
								+ estimateRecord.getLineItemValue('item', 'item',	checkCloseItem)
								+ " thisOrderItemIsInvoiced = "
								+ thisOrderItemIsInvoiced + " thisOrderItemIsIgnored = "
								+ thisOrderItemIsIgnored);
					}
				}
								
				salesOrderID = nlapiSubmitRecord(salesOrderObj, false, false);

				if (debugOn)
					nlapiLogExecution('DEBUG', "transformToSalesOrder",	'internalid: ' + salesOrderID);
				
				// Update the coupons record only if applicable
				// and if a valid sales order record exists
				if (salesOrderID && couponsEligibilityID)
				{
					var couponFields = new Array('name', 'custrecord_alignbv_order_coupon_lookup', 'custrecord_alignbv_order_coupon_useddate');
					var couponData = new Array('Align Order# ' + AlignOrderNumber + " - " + AlignOrderDate,
							salesOrderID, todayDate);
					nlapiSubmitField('customrecord_alignbv_discount_coupons', couponsEligibilityID, 
							couponFields, couponData, false);
					if (debugOn)
						nlapiLogExecution('DEBUG', "Coupon Updated: " + couponsEligibilityID,
								'salesOrderID: ' + salesOrderID + ' patientID: ' + patientID);					
				}
				
				nlapiSubmitField('customrecord_tibco_order_feed', payloadRecordID, 
						'custrecord_alignbv_ordernumber', salesOrderID, false);
				
				nlapiSubmitField('customrecord_tibco_order_feed', payloadRecordID, 
						'custrecord_alignbv_salesorder_lookup', salesOrderID, false);				
				
				// If there are no item(s) for invoicing, cancel the order immediately
				// If any items exist that are not closed, the cancel will not affect it
				if (salesOrderID > 0 && itemInvoiceCount == 0)
				{					
					nlapiSubmitField('salesorder', salesOrderID, 'status', 'SalesOrd:H', false);

					if (debugOn)
						nlapiLogExecution('DEBUG', "cancelSalesOrder",	'internalid: ' + salesOrderID);
				}
				
				if (salesOrderID > 0 && deleteAfterTransform)
				{
					nlapiDeleteRecord('estimate', estimateID);

					if (debugOn)
						nlapiLogExecution('DEBUG', "delete Estimate",
								'internalid: ' + estimateID);
				}
			}
		}
	}
	catch (e)
	{
		errorHandler("processEstimatetoSalesOrder: ", e);
	}
}

/*
 * 
 * Initialise - set up values to allow discounting to be carried out, i.e. -
 * Number of item(s) - Billing address parameters - country and currency id -
 * Display variables in log if debug enabled
 * 
 */
function initialise()
{
	try
	{

        setDeploymentParameters();

        // Determine whether context is manual sales order or TIBCO feed record UE
        recordType = nlapiGetRecordType();        

		switch (recordType) {
		case 'salesorder':
			estimateID = nlapiGetRecordId(); // load current transaction record = manual sales order
			payloadRecordID = genericSearch('customrecord_tibco_order_feed',
					'custrecord_alignbv_salesorder_lookup', estimateID);
			estimateRecord = nlapiLoadRecord('salesorder', estimateID);
			break;
		case 'customrecord_fhlevents':
			stagingRecordID = nlapiGetRecordId();
			estimateID = nlapiLookupField(recordType, stagingRecordID,
					'custrecord_fhle_salesorder');
			payloadRecordID = genericSearch('customrecord_tibco_order_feed',
					'custrecord_alignbv_salesorder_lookup', estimateID);
			estimateRecord = nlapiLoadRecord('estimate', estimateID);
			break;
		case 'customrecord_tibco_order_feed':
			payloadRecordID = nlapiGetRecordId();
			estimateID = nlapiLookupField('customrecord_tibco_order_feed',
					payloadRecordID, 'custrecord_tibco_order_estimate_lookup');
			estimateRecord = nlapiLoadRecord('estimate', estimateID);
			break;
		default:
			break;
		}

		isManualOrder = nlapiLookupField('customrecord_tibco_order_feed',
				payloadRecordID, 'custrecord_tibco_order_is_manualentry');
		
		// Override for manually or events generated orders - do not transform
		if (isManualOrder == 'T')
			transformToSalesOrder = false;
		
		entityID = estimateRecord.getFieldText('entity');
		customerInternalID = estimateRecord.getFieldValue('entity');
		customerRecord = nlapiLoadRecord('customer', customerInternalID);
		parentEntityID = customerRecord.getFieldText('parent');
		parentCustomerInternalID = customerRecord.getFieldValue('parent');
		customerChannel = customerRecord.getFieldValue('custentity_region');
		customerARaccount = null;
		customerFamilyIDs = getCustomerFamilyIDs();
		
		patientID = estimateRecord.getFieldValue('custbody_patientnumber');
		// Extract any ID between (...) e.g. (12235)
		// Note this is not best practice but patient ID is not a separate field?!
		if (patientID != null) 
			patientID = patientID.replace(/.*\(/gmi,"").replace(/\).*/gmi,"");
			
		orderNumber = estimateRecord.getFieldValue('tranid');
		orderDate = estimateRecord.getFieldValue('trandate');
		AlignOrderNumber = estimateRecord.getFieldValue('custbody_alignbv_order_number');
		AlignOrderDate = estimateRecord.getFieldValue('custbody_alignbv_order_date');
		billingAddressCountryID = estimateRecord.getFieldText('custbody_alignbv_billing_region');
		
		estimateTotalBefore = estimateRecord.getFieldValue('total');
		estimateCurrencyID =  estimateRecord.getFieldValue('currency');	
		
		// The list of all possible schemes to apply, defined in a saved search, 
		// within defined date ranges as pre the scheme from - to dates
		searchDiscountSchemeRows = nlapiSearchRecord('customrecord_alignbv_pricediscountscheme', 'customsearch_alignbv_discount_schemes', null, null);

		itemListCount = estimateRecord.getLineItemCount('item');
		for (var checkItem=1; checkItem <= itemListCount; checkItem++)
		{
			var checkItemIgnored = estimateRecord.getLineItemValue('item', 'custcol_alignbv_ignore_on_salesorder', checkItem);
			if (checkItemIgnored == 'T')
				itemIgnoreCount++;
			var checkItemInvoiced = estimateRecord.getLineItemValue('item', 'custcol_alignbv_to_invoice', checkItem);
			if (checkItemInvoiced == 'T')
				itemInvoiceCount++;
		}
		if (itemListCount == itemIgnoreCount)
			transformToSalesOrder = false;

		advantageMax = estimateRecord.getFieldValue('custbody_alignbv_advantage_max');
		advantageMin = estimateRecord.getFieldValue('custbody_alignbv_advantage_min');
		advantageType = estimateRecord.getFieldValue('custbody_alignbv_advantage_type');
		
		if (debugOn)
			logVariables();
	}
	catch (e)
	{
		errorHandler("initialise", e);
	}
}

/*
 * Lookup in the coupons table a valid combination of :
 * 1- Tier ID
 * 2- Empty order lookup (i.e. not used)
 * 3- Customer or parent customer (doctor)
 */
function  checkCouponsEligibility(theTier)
{
	// Local variables to perform search and return any record ID found
	var returnCouponID = null;
	var couponSearchFilters = new Array();
	var couponSearchColumns = new Array();

	try
	{
		// Only find records with empty order lookups i.e. not used yet
		// And only for this tier name (passed in as a parameter on each invocation)
		var orderLookupExpression = new Array('custrecord_alignbv_order_coupon_lookup', 'anyof', '@NONE@');
		var tierLookupExpression = new Array('custrecord_alignbv_coupon_tier_lookup', 'anyof', theTier);
		couponSearchFilters.push(orderLookupExpression);
		couponSearchFilters.push('and');
		couponSearchFilters.push(tierLookupExpression);

		// Check the start - end date range includes today (i.e. when the program executes)
		// Note the end date may be empty i.e. no expiry date present
		var dateCriteria = new Array();
		var dateStartCriteria = new Array('custrecord_alignbv_order_coupon_start', 'onorbefore', todayDate);
		var dateEndCriteria = new Array();
		var dateEndCriteria1 = new Array('custrecord_alignbv_order_coupon_end', 'onorafter', todayDate);
		var dateEndCriteria2 = new Array('custrecord_alignbv_order_coupon_end', 'isempty', '');
		dateEndCriteria.push(dateEndCriteria1);
		dateEndCriteria.push('or');
		dateEndCriteria.push(dateEndCriteria2);
		dateCriteria.push(dateStartCriteria);
		dateCriteria.push('and');
		dateCriteria.push(dateEndCriteria);
		couponSearchFilters.push('and');
		couponSearchFilters.push(dateCriteria);
		
		// Reference the particular customer (entity)
		// or also the parent entity - if it exists
		var entityCriteria = new Array();
		var entityChildCriteria = new Array('custrecord_alignbv_order_coupon_doctor', 'anyof', customerInternalID);
		entityCriteria.push(entityChildCriteria);		
		if (parentEntityID)
		{
			entityCriteria.push('or');
			var entityParentCriteria = new Array('custrecord_alignbv_order_coupon_doctor', 'anyof',	parentCustomerInternalID);
			entityCriteria.push(entityParentCriteria);
		}
		
		if (entityCriteria) {
			couponSearchFilters.push('and');
			couponSearchFilters.push(entityCriteria);
		}
		
		if (patientID) {
			var patientCriteria = new Array('custrecord_alignbv_order_coupon_patient', 'is', patientID);
			couponSearchFilters.push('and');
			couponSearchFilters.push(patientCriteria);
		}
		
		// Return columns - internal ID is just required
		couponSearchColumns[0] = new nlobjSearchColumn('internalid');

		// Use to trace assembled criteria during test / debug ...
		if (debugOn)
			logCriteria(couponSearchFilters);

		// perform search
		var itemSearchResults = nlapiSearchRecord('customrecord_alignbv_discount_coupons', null, couponSearchFilters, couponSearchColumns);

		if(itemSearchResults != null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[0];
				returnCouponID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("checkCouponsEligibility", e);
	}     	      

	if (debugOn)
		nlapiLogExecution('DEBUG', "checkCouponsEligibility(" + theTier + ") ==>" + returnCouponID, "Tier = " + theTier + " Doctor = " + entityID + " Parent = " + parentEntityID + " Patient = " + patientID + " todayDate = " + todayDate);

	return returnCouponID;

}

/*
 * General function to return an array of ids of any family where the 
 * supplied ID is a member i.e. parent and all associated children
 */
function getCustomerFamilyIDs()
{
	var returnTheFamilyIDs = new Array();
	
		try 
		{
		if (customerInternalID) 
		{
			// If no parent, simply return this ID on its own
			if (!parentCustomerInternalID)
			{
				returnTheFamilyIDs.push(customerInternalID);
			} 
			else 
			{
				var customerFamilySearchFilters = new Array();
				var customerFamilySearchColumns = new Array();

				customerFamilySearchFilters[0] = new nlobjSearchFilter('parent', null, 'anyof', parentCustomerInternalID);
				customerFamilySearchColumns[0] = new nlobjSearchColumn('internalid');

				// perform search
				var customerFamilySearchResults = nlapiSearchRecord('customer',
						null, customerFamilySearchFilters,
						customerFamilySearchColumns);

				if (customerFamilySearchResults) {
					for ( var thisID = 0; thisID < customerFamilySearchResults.length; thisID++) {
						returnTheFamilyIDs.push(customerFamilySearchResults[thisID].getValue(customerFamilySearchColumns[0]));
					}
				}
			}
		}
	} 
	catch (e) 
	{
		errorHandler("getCustomerFamilyIDs", e);
	}     	      
	
	return returnTheFamilyIDs;
}


/*
 * Look up the correct AR account ID based on the customer type
 * e.g. whether distributor, and whether APAC account IDs needed for AU/HK regions
 */
function getCustomerAcctsReceivableID()
{
	var returnARaccountID = null;

	try {
		if (billingAddressCountryID) {
			// Setup of A/R logic for distributors checking APAC - HK / AU
			if (customerChannel != customerChannel.replace(
					/.*distributor.*/gmi, "")) {

				if (billingAddressCountryID == 'AU') {
					customerARaccount = '1161.010';
				} else if (billingAddressCountryID == 'HK') {
					customerARaccount = '1161.011';
				} else {
					customerARaccount = '1161.002';
				}
			} else {
				customerARaccount = '1161.001';
			}

			returnARaccountID = genericSearch('account', 'number',
					customerARaccount);
		}
	} catch (e) {
		addToErrorsXML("getCustomerAcctsReceivableID", e);
	}

	return returnARaccountID;
	
}

/*
 * Look for deployment parameters and set up variables / switches accordingly
 * No input / output to this function
 */
function setDeploymentParameters()
{
	try
	{
		
	if (nlapiGetContext().getSetting('SCRIPT', 'custscript_discounts_debugtrace') == 'T')
		{ debugOn = true; } else {debugOn = false;}
		
	if (nlapiGetContext().getSetting('SCRIPT', 'custscript_transform_estimate_salesorder') == 'T')
		{ transformToSalesOrder = true; } else { transformToSalesOrder = false; }
	
	if (nlapiGetContext().getSetting('SCRIPT', 'custscript_delete_after_transform') == 'T')
		{ deleteAfterTransform = true; } else { deleteAfterTransform = false; }

	
	}
	catch (e)
	{
		errorHandler("setDeploymentParameters", e);
	}
}

/*
 * This function simply completes the XMLDiscountAnswer tags
 * and updates the TIBCO record field for discounts
 */
function completeAndSaveXMLDiscountAnswer()
{
	// Put the item answer(s) into a list wrapper
	if (XMLItemAnswerList == '')
		XMLItemAnswerList == 'No Discount Applies';
	XMLItemAnswerList = createTaggedXML(XMLITEMLEVELLIST, XMLItemAnswerList);
	// Put order level discount into a wrapper
	if (XMLDiscountAnswer == '')
		XMLDiscountAnswer == 'No Discount Applies';
	XMLOrderAnswer = createTaggedXML(XMLORDERLEVEL, XMLOrderAnswer);
	// Add the elements together
	XMLDiscountAnswer = XMLOrderAnswer + XMLItemAnswerList;
	// Complete the answer with outermost wrapper tag
	XMLDiscountAnswer = createTaggedXML(XMLDISCOUNTANSWER, XMLDiscountAnswer);
	
	//Write to the TIBCO payload record
	nlapiSubmitField('customrecord_tibco_order_feed', payloadRecordID, 
			'custrecord_alignbv_discounts_xmlcalc', XMLDiscountAnswer, false);

	if (debugOn)
		nlapiLogExecution('DEBUG', "XML Answer", XMLDiscountAnswer);

}

/*
 * Return the level of a scheme - Item, Order or Customer
 * Input - schemeType is Custom List ID number
 * Returns - the string constant for the level e.g. 'ITEM'
 */
function getSchemeLevel(schemeType)
{
	switch (parseInt(schemeType))
	{
	case 1:
	case 2:
		return SCHEMEITEMTYPE;
		break;
	case 3:
	case 4:
		return SCHEMEORDERTYPE;
		break;
	case 5:
	case 6:
		return SCHEMECUSTOMERTYPE;
		break;
	case 7:
	case 8:
		return SCHEMEPATIENTTYPE;
		break;
	default:
		return null;
		break;
	}
}

/*
 * Return the rate type of a scheme - Fixed or Percent
 * Input - schemeType is Custom List ID number
 * Returns - the string constant for the rate e.g. 'PERCENT'
 */
function getSchemeRate(schemeType)
{
	switch (parseInt(schemeType))
	{
	case 1:
	case 3:
	case 5:
	case 7:
		return SCHEMEPERCENTRATE;
		break;
	case 2:
	case 4:
	case 6:
	case 8:
		return SCHEMEFIXEDRATE;
		break;
	default:
		return null;
		break;
	}
}

/*
 * Dump out the variables in a table in execution log
 */
function logVariables()
{
	nlapiLogExecution('DEBUG', "initialise estimate(" + estimateID + ") ==> "
			+ orderNumber, "<table style='font-size: 3mm;'>"			
			+ "<tr><td>entityID</td><td>" + entityID + "</td></tr>"
			+ "<tr><td>parentEntityID</td><td>" + parentEntityID + "</td></tr>"
			+ "<tr><td>customerInternalID</td><td>" + customerInternalID + "</td></tr>"
			+ "<tr><td>customerFamilyIDs</td><td>" + customerFamilyIDs.join(',') + "</td></tr>" 
			+ "<tr><td>customerChannel</td><td>" + customerChannel + "</td></tr>"
			+ "<tr><td>billingAddressCountryID</td><td>" + billingAddressCountryID + "</td></tr>"
			+ "<tr><td>parentCustomerInternalID</td><td>" + parentCustomerInternalID + "</td></tr>"
			+ "<tr><td>itemListCount</td><td>" + itemListCount + "</td></tr>"
			+ "<tr><td>itemIgnoreCount</td><td>" + itemIgnoreCount + "</td></tr>"
			+ "<tr><td>itemInvoiceCount</td><td>" + itemInvoiceCount + "</td></tr>"
			+ "<tr><td>patientID</td><td>" + patientID + "</td></tr>"
			+ "<tr><td>estimateTotalBefore</td><td>" + estimateTotalBefore + "</td></tr>"
			+ "<tr><td>estimateID</td><td>" + estimateID + "</td></tr>"
			+ "<tr><td>estimateCurrencyID</td><td>" + estimateCurrencyID + "</td></tr>"
			+ "<tr><td>recordType</td><td>" + recordType + "</td></tr>"
			+ "<tr><td>payloadRecordID</td><td>" + payloadRecordID + "</td></tr>" 
			+ "<tr><td>advantageMax</td><td>" + advantageMax + "</td></tr>" 
			+ "<tr><td>advantageMin</td><td>" + advantageMin + "</td></tr>"
			+ "<tr><td>advantageType</td><td>" + advantageType
			+ "</td></tr></table>");
}

/*
 * Display Search criteria from a loaded saved search
 * Useful in debugging search errors / missing parameters
 */
function logCriteria(criteria)
{
	var criteriaText = "";
	for ( var c = 0; c < criteria.length; c++)
	{
		if (criteria[c].constructor == Array)
		{
			if (criteriaText != "")
				criteriaText += ", "; // Separate by commas each value
			
			for ( var p = 0; p < criteria[c].length; p++)
			{
				criteriaText += criteria[c][p] + " ";
			}
		}
		else
		{
			if (criteriaText != "")
				criteriaText += ", ";
			
			criteriaText += criteria[c];
		}
	}
	
	// Output the completed list of criteria
	nlapiLogExecution('DEBUG', criteria.length + " criteria"
			, criteriaText);
}

/*
 * Compile the error XML as encountered and write to record
 * Wrapper to errorHandler library function
 */
function addToErrorsXML(errorSource, errorDesc)
{
	var XMLErrorItem = '';
	
	try
	{
		XMLErrorItem = createTaggedXML(XMLERRORSOURCE, errorSource);
		XMLErrorItem += createTaggedXML(XMLERRORMSG, errorDesc);
		XMLErrors += createTaggedXML(XMLERRORITEM, XMLErrorItem);
		nlapiSubmitField('customrecord_tibco_order_feed', payloadRecordID, 
				'custrecord_alignbv_discounts_xmlerrors', createTaggedXML(XMLERRORLIST, XMLErrors), false);
		//status = 'Failed';
		
		// Now call the library
		errorHandler(errorSource, errorDesc);
	}
	catch(e)
	{
		errorHandler("addToError", e);
	}

}
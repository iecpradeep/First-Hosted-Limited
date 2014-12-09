/*******************************************************
 * Name:		Sales order line item customisation
 * Script Type:	Client
 *
 * Version:		1.0.0 - 21/06/2012 - Initial version
 * Author:		A.Nixon - FHL
 * Purpose:		Apply individual item discounts
 *            
 *******************************************************/

//User variables
var context = nlapiGetContext();
var userName = context.getUser();	
var userRole = context.getRole();

//Search variables
var filters = new Array();
var columns = new Array();
var searchResults = null;

//discount search variables
var discountFilters = new Array();
var discountColumns = new Array();
var discountResults = null;

//Validate line item variables
var offerType = 0;
var lineItemCount = 0;
var lineOffer = null;
var formID = null;
var itemName = '';

//field changed specific global variables
var transactionDate = null;
var selectedItem = null;
var itemSearchSuccess = false;
var dateCheckSuccess = false;
var selectedCustomer = null;
var customerCheckSuccess = false;
var allowOffer = false;

//Code management variables
var retVal = false;
var inDebug = true;

/**
 * Validate line
 * 
 * Core function to calculate offers
 * 
 * @param type			// type of field being changed
 * @param name			// name of the field
 * @param linenum		// line number	
 * @returns {Boolean}
 */
function calculateOffers(type, name, linenum)
{	
	retVal = false;

	// get the line item count
	lineItemCount = nlapiGetLineItemCount(type);
	// form internal id
	formID = nlapiGetFieldValue('customform');

	if(formID = 143)
	{

		// do a check based on debug mode
		if(inDebug == true)
		{
			nlapiLogExecution('DEBUG','Line item count total: ' +lineItemCount);
		}

		// if there are line items then start the loop
		if(lineItemCount != 0)
		{
			lineItemLoop();

			retVal = true;
		}
	}

	return retVal;
}

/**
 * @returns {Boolean}
 */
function lineItemLoop()
{
	retVal = false;

	for(var i = 1; i <= lineItemCount; i++)
	{
		getLineOffer(i);

		if(i == 1)
		{
			retVal = true;
		}
	}

	return retVal;
}


/**
 * @param lineCount
 * @returns {Boolean}
 */
function getLineOffer(lineCount)
{	
	retVal = false;

	if(inDebug == true)
	{
		nlapiLogExecution('DEBUG','Line count - getLineOffer is: ' + lineCount);
	}

	try
	{
		// get the selected line offer off of the line
		lineOffer = nlapiGetLineItemValue('item', 'custcol_lineoffer', lineCount);

		if(inDebug == true)
		{
			nlapiLogExecution('DEBUG','Line offer is: ' + lineOffer);
		}

		// search for the selected offer
		retVal = executeSearch();	

		if(retVal == true)
		{
			offerMain(lineCount);
		}

	}
	catch(e)
	{
		if(inDebug == true)
		{
			nlapiLogExecution('DEBUG','FHL - error occured in getLineOffer because: ' + e.message);
		}
	}

	return retVal;
}

/**
 * Search based on the item number and return the offer type
 * @returns {Boolean}
 */
function executeSearch()
{
	// set retval to false
	retVal=false;
	
	// redeclare search variables
	filters = new Array();
	columns = new Array();
	searchResults = null;

	// filters
	filters[0] = new nlobjSearchFilter('internalid', null, 'is', lineOffer);

	// columns
	columns[0] = new nlobjSearchColumn('custrecord_m_offer_type');

	//execute search
	searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);

	if(searchResults != null)
	{
		retVal=true;
	}

	return retVal;
}

/**
 * @param lineCount
 * @returns {Boolean}
 */
function offerMain(lineCount)
{
	retVal = false;
	
	// switch based on the offer type	
	offerType = searchResults[0].getValue(columns[0]);

	if(inDebug == true)
	{
		nlapiLogExecution('DEBUG','offer type is: ' + offerType);
	}
	
	// Hardcoded from the list record: offer type

	// Discount(currency) 1
	// Discount(%) 2
	// Spend x and get y 3
	// Free item 4
	// Save offer 5
	switch(parseInt(offerType))
	{
		// Discount (currency)
		case 1:

			break;

			// Discount (%)
		case 2:

			discountPercentage(lineCount);

			retVal == true;

			break;

		default:

			if(inDebug == true)
			{
				nlapiLogExecution('DEBUG','DEFAULT');
			}

		break;

	}

	return retVal;
}

/**
 * Field changed
 * 
 * @param type
 * @param name
 * @param linenum
 * @returns {Boolean}
 */
function getItem(type, name, linenum)
{	
	// set retVal
	retVal = false;

	if(formID = 143)
	{
		if(type == 'item' && name == 'item')
		{			
			// get the date of the transaction
			transactionDate = nlapiGetFieldValue('trandate');

			// get the currently selected item
			selectedItem = nlapiGetCurrentLineItemValue('item','item');

			//	 get the specified customer
			selectedCustomer = nlapiGetFieldValue('entity');

			// show the selected item
			if(inDebug == true)
			{
				nlapiLogExecution('DEBUG','Selected item: ' + selectedItem);
			}

			retVal = checkMain();
		}
	}

	return retVal;
}

/**
 * Search to find if an item is automated  
 * @returns {Boolean}
 */
function automationSearch()
{
	// set retval to false
	retVal=false;

	// clear out the search arrays
	filters = new Array();
	columns = new Array();
	searchResults = null;

	// filters
	filters[0] = new nlobjSearchFilter('custrecord_offerbuythisitem', null, 'is', selectedItem);
	filters[1] = new nlobjSearchFilter('custrecord_optional_offer', null, 'is', 'F');

	// columns
	columns[0] = new nlobjSearchColumn('custrecord_optional_offer');
	columns[1] = new nlobjSearchColumn('custrecord_offeractivatedate');
	columns[2] = new nlobjSearchColumn('custrecord_offerenddate');
	columns[3] = new nlobjSearchColumn('internalid');
	columns[4] = new nlobjSearchColumn('custrecord_offeravailableto');
	columns[5] = new nlobjSearchColumn('custrecord_offercustomersearch');
	
	// execute search
	
	searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);

	// print out the number of search results
	if(searchResults != null)
	{
		if(inDebug == true)
		{
			nlapiLogExecution('DEBUG','Number of search results found: ' + searchResults.length);
		}
		retVal=true;
	}

	return retVal;
}


/**
 * where all the checks are conducted
 * @returns {Boolean}
 */
function checkMain()
{
	// set the retVal
	retVal = false;

	// do a search for viable items that can be searched automatically
	itemSearchSuccess = automationSearch();

	// check the date
	if(itemSearchSuccess == true)
	{
		for(var i = 0; i < searchResults.length; i++)
		{	
			if(inDebug == true)
			{
				nlapiLogExecution('DEBUG', 'Loop starting for record #: ' + searchResults[i].getValue(columns[3]));
			}

			// do date check with the following parameters
			dateCheckSuccess = checkDate(searchResults[i].getValue(columns[1]),searchResults[i].getValue(columns[2]), transactionDate);

			// if date is valid..
			if(dateCheckSuccess == true)
			{
				// if a customer is found on the sales order
				if(selectedCustomer != null || selectedCustomer.length != 0)
				{
					// do a comparison of the selected customer and the customer on the offer
					customerCheckSuccess = checkCustomer(i);

					// if customer is correct
					if(customerCheckSuccess == true)
					{
						retVal = true;

						if(inDebug == true)
						{
							nlapiLogExecution('DEBUG','All limitations passed');
						}
					}
				}
			}
		}			
	}

	return retVal;
}

/**
 * @param startDate
 * @param endDate
 * @param tranDate
 * @returns {Boolean}
 */
function checkDate(startDate,endDate, tranDate)
{
	retVal = false;
	
	var convertedStartDate = null;
	var convertedEndDate = null;
	var convertedTranDate = null;

	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: startDate ' + startDate);
	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: endDate ' + endDate);
	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: tranDate ' + tranDate);

	// convert the dates into miliseconds since 1970 January 1
	convertedStartDate = nlapiStringToDate(startDate);
	convertedEndDate = nlapiStringToDate(endDate);
	convertedTranDate = nlapiStringToDate(tranDate);
	
	startDate = Date.parse(convertedStartDate);
	endDate = Date.parse(convertedEndDate);
	tranDate = Date.parse(convertedTranDate);
	
	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: startDate conversion ' + parseInt(startDate));
	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: endDate conversion ' + parseInt(endDate));
	nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: tranDate conversion ' + parseInt(tranDate));

	// do a check to find out if the trandate is within the specified start and end dates
	if(tranDate >= startDate && tranDate <= endDate)
	{
		retVal = true;
		nlapiLogExecution('DEBUG', 'Function: Check Date - VALID DATE');
	}
	else
	{
		nlapiLogExecution('DEBUG', 'Function: Check Date - INVALID DATE');
	}

	return retVal;
}

/**
 * @param currentSearchResult
 * @returns {Boolean}
 */
function checkCustomer(currentSearchResult)
{	
	retVal = false;		

	try
	{
		// using the custom list_offeravaiabletolist
		// 1 - all customers
		// 2 - defined below
		if(searchResults[currentSearchResult].getValue(columns[4]) == 2)
		{
			if(inDebug == true)
			{
				nlapiLogExecution('DEBUG', 'Selected customer is: ' + selectedCustomer + ' and the customer on the record is: ' + searchResults[currentSearchResult].getValue(columns[5]));
			}
			// customer has been defined, check this against the selected customer
			if(selectedCustomer == searchResults[currentSearchResult].getValue(columns[5]))
			{
				retVal = true;
			}
		}
		else
		{
			// return success as all customers can use this offer
			retVal = true;
		}
	}
	catch(e)
	{
		if(inDebug == true)
		{
			nlapiLogExecution('DEBUG','No selected customer found');
		}
	}

	return retVal;
}

/**
 * @param lineCount
 * @returns {Boolean}
 */
function discountPercentage(lineCount)
{
	// variables
	var orderTotal = 0;
	var itemAmount = 0;
	var spendOver = 0;

	// get line information
	orderTotal = nlapiGetFieldValue('total');
	itemAmount = nlapiGetLineItemValue('item', 'amount', lineCount);

	if(inDebug == true)
	{
		nlapiLogExecution('DEBUG','order total: ' + orderTotal);
		nlapiLogExecution('DEBUG','item amount: ' + itemAmount);
	}
	
	// search record for deduction information

	var discountSearchSuccess = discountSearch(lineOffer);

	if(inDebug == true)
	{	
		nlapiLogExecution('DEBUG',"Search success: " + discountSearchSuccess + " " + discountResults);
	}

	// use the results to place in deduction percentage
	spendOver = discountResults[0].getValue(discountColumns[1]);

	if(inDebug == true)
	{
		nlapiLogExecution('DEBUG','Spend over: ' + parseFloat(spendOver));
	}

	// if the order total is greater than the specified spend over, apply the discount
	if(orderTotal > spendOver)
	{
		discountCalculation(lineCount);
	}

	return true;
}


/**
 * @param lineOffer
 * @returns {Boolean}
 */
function discountSearch(lineOffer)
{

	retVal = false;
	// search record for deduction information

	//filters
	discountFilters[0] = new nlobjSearchFilter('internalid', null, 'is', lineOffer);

	// columns
	discountColumns[0] = new nlobjSearchColumn('custrecord_offergetthispricetype');
	discountColumns[1] = new nlobjSearchColumn('custrecord_offerspendover');

	//execute search
	discountResults = nlapiSearchRecord('customrecord_mrfoffer', null, discountFilters, discountColumns);

	if(discountResults)
	{
		retVal = true;

		return retVal;
	}
	else
	{
		return retVal;
	}
}

/**
 * @param lineCount
 * @returns {Boolean}
 */
function discountCalculation(lineCount)
{
	retVal = false;
	
//	var offerRecord = null;
	var discountItem = null;
	
	if(inDebug == true)
	{
		nlapiLogExecution('DEBUG','Line count: ' + lineCount);
	}
	
	discountItem = discountResults[0].getValue(discountColumns[0]);
	
	nlapiLogExecution('DEBUG', 'Search discount item' + discountResults[0].getValue(discountColumns[0]));
	
	nlapiSelectNewLineItem('item');
	nlapiSetCurrentLineItemValue('item', 'item', discountItem, false);
	nlapiCommitLineItem('item');
	
	// take the deduction away to get the new amount
	if(inDebug == true)
	{
		nlapiSetLineItemValue('item', 'description', lineCount, "success");
	}
	
	return retVal;
}


/**
 * @param type
 * @param action
 */
function customRecalc(type, action)
{
    if (type == 'item')
    {
        // call any functions related to recalc here
        foo(action);
        bar(action);
    }
}

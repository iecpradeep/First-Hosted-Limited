/***********************************************************************************
 * Name: Item Pricing Calculation
 * Script Type: User Event
 * Client: Rare Fashion
 * 
 * Version: 1.0.0 - 16 Mar 2012 - 1st release - MJL
 * 			2.0.0 - 08 May 2012 - Includes new requirements for exchange 
 * 								  rate and carriage charge - MJL
 * 			2.0.1 - 27 Feb 2012 - set GBP price inc. VAT field for item label - MJL
 *
 * Author: Matthew Lawrence, FHL
 * Purpose: Calculate RRP, wholesale and distributor price from base price
 * 
 * [TODO]: Enable code to update Euro Price for Label field following
 *         addition of EUR sublist
 ***********************************************************************************/

var itemRecType = nlapiGetRecordType();
var itemRecID = nlapiGetRecordId();	
var itemRecord = null;
var exchangeRate = null;
var carriage = null;
var rrpMultiplier = 0;
var distMultiplier = 0;
var wholesaleMultiplier = 0;
var amountColumnID = 1;

var context = null;
var costPriceLineID = 0;
var rrpLineID = 0;
var distLineID = 0;
var wholesaleLineID = 0;

/**
 * Launches after submit
 */
function itemPricingAfterSubmit()
{
	try 
	{
		checkOverride();
	}
	
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Error on record save', e.message);
		return true;
	}
	
}

/**
 * Check whether calculations have been overridden
 */
function checkOverride()
{
	var calcOverride = '';
	var retVal = false;
	
	//load current record
	itemRecord = nlapiLoadRecord(itemRecType, itemRecID);
	
	//get value of override flag
	calcOverride = itemRecord.getFieldValue('custitem_rrpoverride');
	
	nlapiLogExecution('DEBUG', 'calcOverride', calcOverride);
	
	//only run script if flag is false
	if (calcOverride == 'F')
	{
		getMarkups();
		retVal = true;
	}
	return retVal;
}		

/**
 * Get markup values, calculate prices
 * and submit item record
 */
function getMarkups()
{
	var regionID = 0;
	
	//load region 
	regionID = itemRecord.getFieldValue('custitem_region');
	recRegion = nlapiLoadRecord('customrecord_regionconstantsrrp', regionID);
	
//	nlapiLogExecution('DEBUG', 'Region record', recRegion.getId());
	
	//get markup values for price calculation
	exchangeRate = recRegion.getFieldValue('custrecord_exchangerate');
	carriage = recRegion.getFieldValue('custrecord_cpincfandd');
	rrpMultiplier = recRegion.getFieldValue('custrecord_rrpmultiplier');
	distMultiplier = recRegion.getFieldValue('custrecord_distributormultiplier');
	wholesaleMultiplier = recRegion.getFieldValue('custrecord_wholesalemultiplier');
	
//	nlapiLogExecution('DEBUG', 'Exchange rate', exchangeRate);
//	nlapiLogExecution('DEBUG', 'Carriage rate', carriage);
//	nlapiLogExecution('DEBUG', 'RRP multiplier', rrpMultiplier);
//	nlapiLogExecution('DEBUG', 'Distributor multiplier', distMultiplier);
//	nlapiLogExecution('DEBUG', 'Wholesale multiplier', wholesaleMultiplier);
	
	//calculate prices using multipliers
	priceCalcs();
}

/**
 * Get parameter values from script deployment
 * 
 * 2.0.0 - added parameters for line IDs for pricing sublist
 */
function getParams()
{
	context = nlapiGetContext();
	
	costPriceLineID = context.getSetting('SCRIPT', 'custscript_costpricelineid');
	rrpLineID = context.getSetting('SCRIPT', 'custscript_rrplineid');
	distLineID = context.getSetting('SCRIPT', 'custscript_distributorlineid');
	wholesaleLineID = context.getSetting('SCRIPT', 'custscript_wholesalelineid');
	
//	nlapiLogExecution('DEBUG', 'Base price line ID', costPriceLineID);
//	nlapiLogExecution('DEBUG', 'RRP line ID', rrpLineID);
//	nlapiLogExecution('DEBUG', 'Dist price line ID', distLineID);
//	nlapiLogExecution('DEBUG', 'Wholesale price line ID', wholesaleLineID);
}

/**
 * Calculate RRP, distributor and wholesale prices
 * 
 * 2.0.0 - broke out price calc function calls - MJL
 * 2.0.1 - set GBP price inc. VAT field for item label - MJL
 * 2.0.2 - set EUR price field for item label - MJL
 */
function priceCalcs()
{	
	var costPrice = 0;
	var rrp = 0;
	var distPrice = 0;
	var wholesalePrice = 0;

	//get matrix line IDs as parameters
	getParams();
	
	//get cost (base) price
	costPrice = nlapiGetLineItemMatrixValue('price1', 'price', costPriceLineID, amountColumnID);
	itemRecord.setFieldValue('custitem_label_ukprice', costPrice); //2.0.1 Display UK price inc. VAT on label - MJL
	//itemRecord.setFieldValue('custitem_label_europrice', costPrice); //[TODO] Uncomment this line after inclusion of EUR pricing sublist
	
	//calc and set RRP value, then return
	rrp = rrpCalc(costPrice);
	
	//use RRP value to calc and return dist and wholesale prices
	distPrice = distCalc(costPrice);
	wholesalePrice = wholesaleCalc(costPrice);
	
	//commit RRP, dist price and wholesale price lines
	itemCommit(rrp, distPrice, wholesalePrice);
	
	//submit item record
	itemSubmit();
}

/**
 * Calculates RRP value and commit
 * 
 * 2.0.0 - Includes new requirements for exchange rate 
 * 		   and carriage charge - MJL
 */
function rrpCalc(costPrice)
{
	var costPriceinGBP = 0;
	var cpFAndD = 0;
	var rrp = 0;
	
	//Calculate and set RRP price
	costPriceinGBP = costPrice / exchangeRate;
	cpFAndD = costPriceinGBP * carriage;
	rrp = cpFAndD * rrpMultiplier;
	
	//nlapiLogExecution('DEBUG', 'RRP value', rrp);
	
	//set field and commit line item
	itemRecord.selectLineItem('price1', rrpLineID);
	itemRecord.setCurrentLineItemMatrixValue('price1', 'price', amountColumnID, rrp);
	itemRecord.commitLineItem('price1');
	
	return rrp;
}

/**
 * Calculates distributor value and commit
 */
function distCalc(costPrice)
{
	var distPrice = 0;
	
	//Calculate distributor price	
	distPrice = costPrice * distMultiplier;
//	nlapiLogExecution('DEBUG', 'distPrice value', distPrice);

	return distPrice;
}

/**
 * Calculates wholesale value and commit
 */
function wholesaleCalc(costPrice)
{
	var wholesalePrice = 0;
	
	//Calculate wholesale price
	wholesalePrice = costPrice * wholesaleMultiplier;
//	nlapiLogExecution('DEBUG', 'wholesalePrice value', wholesalePrice);

	return wholesalePrice;
}

function itemCommit(rrp, distPrice, wholesalePrice)
{
	var retVal = false;
	
	try
	{
		//set field and commit line item
		itemRecord.selectLineItem('price1', rrpLineID);
		itemRecord.setCurrentLineItemMatrixValue('price1', 'price', amountColumnID, rrp.toFixed(2)); 
		itemRecord.commitLineItem('price1');
		
		itemRecord.selectLineItem('price1', distLineID);
		itemRecord.setCurrentLineItemMatrixValue('price1', 'price', amountColumnID, distPrice.toFixed(2));
		itemRecord.commitLineItem('price1'); 
		
		itemRecord.selectLineItem('price1', wholesaleLineID);
		itemRecord.setCurrentLineItemMatrixValue('price1', 'price', amountColumnID, wholesalePrice.toFixed(2));
		itemRecord.commitLineItem('price1');
		
		retVal = true;
	}
	
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Error committing line items', e.message);
	}
	return retVal;
}

/**
 * Submit item record
 */
function itemSubmit()
{
	var retVal = false;
	
	//Submission of item record
	try 
	{
		nlapiSubmitRecord(itemRecord);
		nlapiLogExecution('DEBUG', 'Record submitted', itemRecID);
		retVal = true;
	}

	catch(e) 
	{
		nlapiLogExecution('DEBUG', 'Record not submitted', e.message);
		retVal = false;
	}
	return retVal;
}

function spare()
{
	
//	distPrice = parseFloat(costPrice) + parseFloat(dpPercent);
	//nlapiLogExecution('DEBUG', 'distPrice value', distPrice);
	
//	dpResult = parseFloat(rrp / distPrice);
//	nlapiLogExecution('DEBUG', 'dpResult value', dpResult.toFixed(2));
	
//	//if price lies within correct boundaries...
//	if (dpResult >= 2.3 && dpResult <= 2.7) 
//	{
//		nlapiLogExecution('DEBUG', 'Distributor price allowed', dpResult.toFixed(2));
//	}	
	
//	else 
//	{
//		nlapiLogExecution('DEBUG', 'Distributor price not permitted', dpResult.toFixed(2));
//		retVal = false;
//	}
	
	
//	nlapiLogExecution('DEBUG', 'wpPercent value', wpPercent);
//	
//	wholesalePrice = parseFloat(costPrice) + parseFloat(wpPercent);
//	nlapiLogExecution('DEBUG', 'wholesalePrice value', wholesalePrice);
	
//	wpResult = parseFloat(rrp / wholesalePrice);
//	nlapiLogExecution('DEBUG', 'wpResult value', wpResult.toFixed(2));
//	
//	//if price lies within correct boundaries...
//	if (wpResult >= 2.7 && wpResult <= 3.2) 
//	{
//		nlapiLogExecution('DEBUG', 'Wholesale price allowed', wpResult.toFixed(2));
//	}
	
//	}
	
//	else 
//	{
//		nlapiLogExecution('DEBUG', 'Wholesale price not permitted', wpResult.toFixed(2));
//		retVal = false;
//	}
	
}
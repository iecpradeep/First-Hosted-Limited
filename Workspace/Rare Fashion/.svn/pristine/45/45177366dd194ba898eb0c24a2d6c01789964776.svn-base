/***************************************************************************
 * Name: Item Pricing Calculation
 * Script Type: User Event
 * Client: Rare Fashion
 * 
 * Version: 1.0.0 - 16 Mar 2012 - 1st release - MJL
 *
 * Author: Matthew Lawrence, FHL
 * Purpose: Calculate RRP, wholesale and distributor price from base price
 **************************************************************************/

/**
 * Launches after submit ...
 */
function itemPricingAfterSubmit()
{
	try 
	{
		getMarkups();
	}
	
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Error on record save', e.message);
		return true;
	}
	
}

/**
 * Get markup values, calculate prices
 * and submit item record
 */
function getMarkups()
{
	var itemRecType = nlapiGetRecordType();
	var itemRecID = nlapiGetRecordId();	
	var itemRecord = '';
	var rrpMarkup = 0;
	var dpMarkupRange = 0;
	var wpMarkupRange = 0;
	var rrp = 0;
	
	// load current record
	try
	{
		itemRecord = nlapiLoadRecord(itemRecType, itemRecID);
	}
	
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Unsupported type', e.message);
		return true;
	}
	
	//get markup values for price calculation
	rrpMarkup = itemRecord.getFieldValue('custitem_rrpmarkup');
	nlapiLogExecution('DEBUG', 'RRP markup', rrpMarkup);
	
	dpMarkupRange = itemRecord.getFieldValue('custitem_distmarkup');
	nlapiLogExecution('DEBUG', 'Distributor markup', dpMarkupRange);
	
	wpMarkupRange = itemRecord.getFieldValue('custitem_wholesalemarkup');
	nlapiLogExecution('DEBUG', 'Wholesale markup', wpMarkupRange);
	
	//calc and set RRP value, then return
	rrp = rrpCalc(itemRecord, rrpMarkup);
	
	//use RRP value to calc and set dist and wholesale prices
	distCalc(itemRecord, dpMarkupRange, rrp);
	wholesaleCalc(itemRecord, wpMarkupRange, rrp);
	
	//submit item record
	itemSubmit(itemRecord, itemRecID);
}	

/**
 * Calculates RRP value and commit
 */
function rrpCalc(itemRecord, rrpMarkup)
{
	var costPrice = 0;
	var rrp = 0;
	var rrpLineID = '5';
	
	//Get base price value
	costPrice = nlapiGetLineItemMatrixValue('price1', 'price', 1, 1);
	nlapiLogExecution('DEBUG', 'Cost price', costPrice);
	
	//Calculate and set RRP price
	rrp = costPrice * rrpMarkup;
	nlapiLogExecution('DEBUG', 'RRP value & rrpLineID', rrp + ', ' + rrpLineID);
	
	//set field and commit line item
	itemRecord.selectLineItem('price1', rrpLineID);
	itemRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, rrp);
	itemRecord.commitLineItem('price1');
	
	return rrp;
}

/**
 * Calculates distributor value and commit
 */
function distCalc(itemRecord, dpMarkupRange, rrp)
{
	var costPrice = 0;
	var distLineID = '2';
	var dpPercent = 0;
	var distPrice = 0;
	var dpResult = 0;
	var retVal = false;
	
	//Get base price value
	costPrice = nlapiGetLineItemMatrixValue('price1', 'price', 1, 1);
	nlapiLogExecution('DEBUG', 'Cost price', costPrice);
	
	//Calculate and set distributor price	
	dpPercent = costPrice * dpMarkupRange;
	nlapiLogExecution('DEBUG', 'dpPercent value', dpPercent);
	
	distPrice = parseFloat(costPrice) + parseFloat(dpPercent);
	nlapiLogExecution('DEBUG', 'distPrice value', distPrice);
	
	dpResult = parseFloat(rrp / distPrice);
	nlapiLogExecution('DEBUG', 'dpResult value', dpResult.toFixed(2));
	
	//if price lies within correct boundaries...
	if (dpResult >= 2.3 && dpResult <= 2.7) 
	{
		nlapiLogExecution('DEBUG', 'Distributor price allowed', dpResult.toFixed(2));
		
		//...set field and commit line item
		itemRecord.selectLineItem('price1', distLineID);
		itemRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, dpResult.toFixed(2));
		itemRecord.commitLineItem('price1'); 
		
		retVal = true;
	}
	
	else 
	{
		nlapiLogExecution('DEBUG', 'Distributor price not permitted', dpResult.toFixed(2));
		retVal = false;
	}
	return retVal;
}

/**
 * Calculates wholesale value and commit
 */
function wholesaleCalc(itemRecord, wpMarkupRange, rrp)
{
	var costPrice = 0;
	var wholesaleLineID = '6';
	var wpPercent = 0;
	var wholesalePrice = 0;
	var wpResult = 0;
	var retVal = false;
	
	//Get base price value
	costPrice = nlapiGetLineItemMatrixValue('price1', 'price', 1, 1);
	nlapiLogExecution('DEBUG', 'Cost price', costPrice);
	
	//Calculate and set wholesale price
	wpPercent = costPrice * wpMarkupRange;
	nlapiLogExecution('DEBUG', 'wpPercent value', wpPercent);
	
	wholesalePrice = parseFloat(costPrice) + parseFloat(wpPercent);
	nlapiLogExecution('DEBUG', 'wholesalePrice value', wholesalePrice);
	
	wpResult = parseFloat(rrp / wholesalePrice);
	nlapiLogExecution('DEBUG', 'wpResult value', wpResult.toFixed(2));
	
	//if price lies within correct boundaries...
	if (wpResult >= 2.7 && wpResult <= 3.2) 
	{
		nlapiLogExecution('DEBUG', 'Wholesale price allowed', wpResult.toFixed(2));
		
		//...set field and commit line item
		itemRecord.selectLineItem('price1', wholesaleLineID);
		itemRecord.setCurrentLineItemMatrixValue('price1', 'price', 1, wpResult.toFixed(2));
		itemRecord.commitLineItem('price1');
		
		retVal = true;
	}
	
	else 
	{
		nlapiLogExecution('DEBUG', 'Wholesale price not permitted', wpResult.toFixed(2));
		retVal = false;
	}
	return retVal;
}

/**
 * Submit item record
 */
function itemSubmit(itemRecord, itemRecID)
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
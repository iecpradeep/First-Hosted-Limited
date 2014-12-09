/*************************************************************************
 * Name: Create Credit Memo (createCreditMemo.js)
 * Script Type: 
 * Client: Align BV
 * 
 * Version: 1.0.0 - 20 Jul 2012 - 1st release - MJL
 * 
 * Author: FHL
 * Purpose: Creates a credit memo programmatically 
 **************************************************************************/
//Test
var recCreditMemo = null;

/**
 * Creates credit memo record
 * 
 * @returns {Boolean}
 */
function createCreditMemo()
{
	var creditMemoID = 0;
	var retVal = false;
	
	try
	{
		recCreditMemo = nlapiCreateRecord('creditmemo');
		
		setCreditHeader();
		
		setCreditLines();
		
		creditMemoID = nlapiSubmitRecord(recCreditMemo, null, true);
		
		if (creditMemoID > 0)
		{
			retVal = true;
		}
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot create credit memo', e.message);
	}
	return retVal;
}

/**
 * Sets header details
 * 
 * @returns {Boolean}
 */
function setCreditHeader()
{
	var cmCustomForm = 109;
	var cmCustomer = 2175;
	
	var retVal = false;

	try
	{
		recCreditMemo.setFieldValue('entity', cmCustomer);
		recCreditMemo.setFieldValue('customform', cmCustomForm);
		retVal = true;
		
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot set credit memo header', e.message);
	}
	return retVal;
}

/**
 * Sets line details
 * 
 * @returns {Boolean}
 */
function setCreditLines()
{
	var itemID = new Array();
	var quantity = 1;
	var priceLevel = -1;
	var rate = 0;
	var taxCode = 6;
	var region = 46;
	var channelShip = 1;
	var channelBill = 1;
	
	itemID[0] = 326;
	itemID[1] = 1032;
	
	var retVal = false;
	
	try
	{
		for ( var i = 0; i < itemID.length; i++)
		{
			recCreditMemo.selectNewLineItem('item');
			recCreditMemo.setCurrentLineItemValue('item', 'item', itemID[i]);
			recCreditMemo.setCurrentLineItemValue('item', 'quantity', quantity);
			recCreditMemo.setCurrentLineItemValue('item', 'price', priceLevel);
			recCreditMemo.setCurrentLineItemValue('item', 'rate', rate);
			recCreditMemo.setCurrentLineItemValue('item', 'taxcode', taxCode);
			recCreditMemo.setCurrentLineItemValue('item', 'custcol_region', region);
			recCreditMemo.setCurrentLineItemValue('item', 'custcol_channelshipto', channelShip);
			recCreditMemo.setCurrentLineItemValue('item', 'custcol_channelbillto', channelBill);
			recCreditMemo.commitLineItem('item');
		}
		retVal = true;
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot set credit memo lines', e.message);
	}
	return retVal;
}
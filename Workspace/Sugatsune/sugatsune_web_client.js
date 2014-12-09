
/* 
 * Sugatsune Netsuite cart processing script
 * (c) 2012
 * 
 * By jonny@nospaces.net
 * 
 * Requires custom body field "custbody_processing" attaching to the scriptable cart forms
 * and the id of the shipping item setting below.
 * Also add the id's of the cash sale and invoice custom forms in the formOk function
 */

/***********************************************************************
 * 
 *  Modified by Peter Lewis, First Hosted Limited on 13th Feb 2013.
 * 
 * 
 */



function formOk() 
{
	var customForm = '';
	var retVal = false;

	try
	{
		customForm = nlapiGetFieldValue('customform');

		if (customForm == '107' || customForm == '116') 	//107 Cash Sale, 116 Invoice
		{			// custom form ID's here
			retVal =  true;
		}
		else
		{
			log("formOk: customform=" + customForm);
			retVal =  false;
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'formOK Error', e.message);
	}

	return retVal;
}

function customInit(type)
{
	if (!formOk())
	{
		return false;
	}
	//log("customInit('" + type + "')");
}

function sugatsuneWebClientRecalc(type, action)

{
	//nlapiLogExecution('DEBUG', 'sugatsuneWebClientRecalc', 'type: ' + type + '. Action: ' + action);
	
	var retVal = true;
	var processing = '';
	var cnt = -1;
	var shipLineItem = -1;
	var total = 0;
	var shippingItemId = 7993;
	
	try
	{
		if (!formOk())
		{
			retVal = false;
		}

		if (type != 'item')
		{
			//log("customRecalc('" + type + "," + action + ") not item");
			retVal = false;
		}

		processing = nlapiGetFieldValue('custbody_processing');

		if (processing && processing == 'T')
		{
			retVal = false;	// We are in a secondary recalc, so exit
		}
		


		if(retVal == true)
		{
			nlapiSetFieldValue('custbody_processing', 'T');	// Set processing flag
			
			cnt = nlapiGetLineItemCount('item');
			shipLineItem = findItem(shippingItemId);

			while (shipLineItem > 0)
			{
				safeSelectLineItem(shipLineItem);
				nlapiRemoveLineItem('item', shipLineItem);
				shipLineItem = findItem(shippingItemId);	//log("customRecalc: removed shipping");
			}

			total = getCartTotal();

			if (total > 0 && shipLineItem < 1)
			{
				//log("customRecalc: added shipping");
				addItem(shippingItemId, 1);		// add shipping
			}

			//log("customRecalc: " + cnt + " items, total=" + total + (shipLineItem > 0 ? " shipLineItem=" + shipLineItem : ""));
		}


//		var customer = nlapiGetFieldText('customer');
//		log("testing: " + " customer=" + customer);
//		var shipcountrycode = nlapiLookupField('customer', customer_id, 'shipcountrycode');

	}
	catch (err)
	{
		//var msg = err.message ? err.message : err;
		//log("customRecalc Exception: " + msg);
		nlapiLogExecution('ERROR', 'sugatsuneWebClientRecalc', err.message);
	}
	finally
	{
		// Now, even with an error, we want to reset the processing flag
		// so use a finally-clause to ensure this happens no matter what
		nlapiSetFieldValue('custbody_processing', 'F');
		//nlapiLogExecution('DEBUG', 'sugatsuneWebClientRecalc', err.message);
	}

}

function getCartTotal()
{
	var total = 0;
	var cnt = 0;


	try
	{	
		cnt = nlapiGetLineItemCount('item');

		for (var i = 1; i <= cnt; i++)
		{
			var val = parseFloat(nlapiGetLineItemValue('item', 'amount', i));
			if (!isNaN(val))
			{
				total += val;
//				} else {	// comes through as null sometimes, nice!
//				log("customRecalc: !isNaN(val) " + nlapiGetLineItemValue('item', 'amount', i) + " line " + i);
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'GetCartTotal', e.message);
	}

	return total;
}

function customDelete(type)
{
	var processing = '';
	var itemId = '';		
	
	if (!formOk())
	{
		return false;
	}

	try
	{

		processing = nlapiGetFieldValue('custbody_processing');
		itemId = nlapiGetCurrentLineItemValue('item', 'item');
		log(processing + itemId);
		//log("customDelete: type:" + type + " item:" + itemId + " processing:" + processing);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'customDelete', e.message);
	}


	return true;
}


//BEGIN UTILITY FUNCTIONS


function getVal(colName, linenum)
{
	return nlapiGetLineItemValue("item", colName, linenum);
}

function log(val)
{
	//nlapiLogExecution('DEBUG', val);
}

//From Sample by Jason K

//This function adds the given item to the order
function addItem(itemID, qty) 
{
	try
	{
		safeSelectNewLineItem();
		nlapiSetCurrentLineItemValue('item', 'item', itemID);
		nlapiSetCurrentLineItemValue('item', 'quantity', qty);
		nlapiCommitLineItem('item');
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'addItem', e.message);
	}
}

//Sometimes, a selectNewLineItem results in an error if there's uncommitted
//values in the item list.  This makes sure this does not happen.
function safeSelectNewLineItem()
{
	try
	{
		if (notEmpty(nlapiGetCurrentLineItemValue('item', 'item')))
		{
			//log("safeSelectNewLineItem: uncommitted item");
			nlapiCommitLineItem('item');
		}
		nlapiSelectNewLineItem('item');
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'safeSelectNewLineItem', e.message);
	}
}

//Sometimes, a selectLineItem results in an error if there's uncommitted
//values in the item list.  This makes sure this does not happen.
function safeSelectLineItem(itemLine)
{
	try
	{
		if (notEmpty(nlapiGetCurrentLineItemValue('item', 'item')))
		{
			//log("safeSelectLineItem: uncommitted item");
			nlapiCommitLineItem('item');
		}

		nlapiSelectLineItem('item', itemLine);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'safeSelectLineItem', e.message);
	}
}

//General find function for the item list
function findItem(itemID) 
{
	var cnt = 0;
	var retVal = -1;
	
	try
	{
		cnt = nlapiGetLineItemCount('item');

		for (var i = 1; i <= cnt; i++) 
		{
			if (nlapiGetLineItemValue('item', 'item', i) == itemID) 
			{
				retVal = i;
				break;
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'findItem', e.message);
	}
	return retVal; // -1 means not found
}

function isEmpty(tmp) 
{
	return tmp === null || tmp === '';
}

function notEmpty(tmp) 
{
	return !isEmpty(tmp);
}
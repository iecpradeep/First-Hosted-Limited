/**********************************
 * Cord Client Script for calculating the Gift Aid Claim Rates for each Line Item and at the Transcation Level.
 * 
 * Author: Peter Lewis, First Hosted
 * 
 * Version History: 1.0.0 - Initial Version
 * 						1.1.0 - Expanded field options to work with Cash Sale
 * 
 **********************************/

//TODO: Do the TODO's :-)


var InDebug = false;

var transactionGiftAidAmountFieldName = 'custbody_giftaidamount';

//Should Income Tax ever change - this needs to be altered.
var giftAidMultiplier = 0.25;

var transactionGiftAidAmount = 0;
var supporterHasGiftAid = '';
var tranDate = '';
var supporterId = '';

/**********************************
 * 
 * @param {Object} type
 **********************************/
function myPageInit(type)
{	
	//alert('myPageInit  type=' + type);
}

/**********************************
 * 
 **********************************/
function mySaveRecord()
{	
	calculateTransactionGiftAid();
	//alert('mySaveRecord');	
	return true;
} 

/*********************************
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 */

function myValidateField(type, name, linenum)
{	
	if(linenum != null)	
	{		
		if(InDebug)
		{
			alert('myValidateField\ntype=' + type + '\nname=' + name + '\nlinenum=' + linenum);	
		}
		switch(name)
		{
			case 'amount':
			case 'quantity':
			case 'custcol_giftaidapplicable':
				//calculateLineItemGiftAid(linenum);
				break;
			default:
				break;
		}	
	}	
	return true;
}

/*********************************
 * Called on the Field Changed event
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 */

function myFieldChanged(type, name, linenum)
{
	try
	{
		if (name == 'entity') 	
		{
			supporterId = nlapiGetFieldValue('entity');
			supporterHasGiftAid = doesSupporterHaveGiftAid(supporterId);
			setGiftAidField(supporterHasGiftAid);
		}
	}	
	catch(e)
	{
		alert('Supporter Change Error:\n' +e.message);
	}

} 

/*********************************
 * 
 * @param {Object} type
 * @param {Object} name
 */

function myPostSourcing(type, name)
{	
	//alert('myPostSourcing type=' + type + ', name=' + name);
} 

/*********************************
 * 
 * @param {Object} type
 *********************************/
function myLineInit(type)
{	
	//alert('myLineInit');	
	//alert('type=' + type);
}

/*********************************
 * 
 * @param {Object} type
 *********************************/

function myValidateLine(type)
{	
	//alert('myValidateLine type=' + type);
return true;
}

/*********************************
 * 
 * @param {Object} type
 */

function myValidateInsert(type)
{	
	//alert('myValidateInsert type=' + type);
} 

/*********************************
 * 
 * @param {Object} type
 */

function myValidateDelete(type)
{	
	//alert('myValidateDelete type=' + type);
	return true;
} 

/*********************************
 * 
 * @param {Object} type
 */

function myRecalc(type)
{	
	try
	{
		if(type == 'item')
		{
			//alert('myRecalc type=' + type);
			supporterHasGiftAid = nlapiGetFieldValue('custbody_hasvalidgiftaid');
			if(supporterHasGiftAid == 'T')
			{
				supporterHasGiftAid = true;
			}
			else
			{
				supporterHasGiftAid = false;
			}

			var currentNum = nlapiGetCurrentLineItemIndex('item');
			calculateLineItemGiftAid(currentNum);	
		}
	}
	catch(e)
	{
		alert('Error recalculating Gift Aid.\n' + e.message);
	}
}

/******************
 * Pass in the Supporter ID and return whether they have Gift Aid or not
 * 
 * @param {Object} giftAidSupporterId
 */
function doesSupporterHaveGiftAid(giftAidSupporterId)
{
	try
	{
		if(giftAidSupporterId)
		{
			//Setup the Filters and the Columns to be returned
			var giftAidSearchFilter = '';
			var giftAidSearchColumns = new Array();
		
			//get the Transaction Date for the Search
			tranDate = nlapiGetFieldValue('trandate');
			
			//TODO: This needs to be verified...
			giftAidSearchFilter = [['custrecord_ga_enddate', 'after', tranDate ], 'or', [ 'custrecord_ga_enddate', 'isempty', null ] , 'and', ['custrecord_ga_donor', 'is', giftAidSupporterId ], 'and', ['custrecord_ga_startdate', 'onorbefore', tranDate ] ] ;
			giftAidSearchColumns[0] = new nlobjSearchColumn('custrecord_ga_enddate');
		
			// perform search
			var giftAidSearchResults = nlapiSearchRecord('customrecord_giftaid', null, giftAidSearchFilter, giftAidSearchColumns);
	
		
			if (giftAidSearchResults)
			{
				if(InDebug)
				{
					alert('gift Aid Search Results Length: ' + giftAidSearchResults.length);	
				}
				return true;
			}
		}
	}
	catch(e)
	{
		alert('gAerr #190\nGift Aid Error:\n' + e.message);
	}
	//If it's gotten this far then they do not have a Valid Gift Aid

	return false;
}

/************
 * Set the Gift Aid Field using JS Boolean Object.
 * 
 * @param {Object} nsHasGift
 */
function setGiftAidField(nsHasGift)
{
	try
	{
		if(nsHasGift == true)
		{
			nlapiSetFieldValue('custbody_hasvalidgiftaid', 'T');	
		}
		else
		{
			nlapiSetFieldValue('custbody_hasvalidgiftaid', 'F');
		}
	}
	catch(e)
	{
		alert('Error setting Gift Aid Field.\nError: ' + e.message);	
	}
}


function calculateLineItemGiftAid(lineNumber)
{
	try
	{
		//alert('called calclineitem');
		var gaApplicable = nlapiGetLineItemValue('item', 'custcol_giftaidapplicable', lineNumber);
		
		var currentAmount = nlapiGetLineItemValue('item','amount',lineNumber);
		currentAmount = currentAmount * giftAidMultiplier;
		
		
		if((supporterHasGiftAid == false) ||(gaApplicable == 'F'))
		{
			currentAmount = 0;
		}
		nlapiSetLineItemValue('item','custcol_giftaidamount',lineNumber, currentAmount);
	}
	catch(e)
	{
		alert('Error calculating Line Item Gift Aid: ' + e.message);
	}

	return true;
}


function calculateTransactionGiftAid()
{
	var lineItemCount = nlapiGetLineItemCount('item');
	var lineItemValue = 0;
	transactionGiftAidAmount = 0;
	//alert('Line Items: ' + lineItemCount);
	if(lineItemCount)
	{
		for(var i = 1; i <= lineItemCount; i++)
		{
			lineItemValue = nlapiGetLineItemValue('item', 'custcol_giftaidamount',i);			
			if(lineItemValue)
			{
				transactionGiftAidAmount = parseFloat(transactionGiftAidAmount) + parseFloat(lineItemValue);
			}
		}
	}
	nlapiSetFieldValue(transactionGiftAidAmountFieldName, transactionGiftAidAmount);
	return true;
}

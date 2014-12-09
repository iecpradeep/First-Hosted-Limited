
/********************************************************************
 * Name: 		itemReceipt.js
 * Script Type: Client
 *
 * Version: 	1.0.0 - 16/11/2012 - 1st release - PAL
 * 				1.0.1 - 20/12/2012 - Altered function markAllUnchecked to loop through
 * 									check boxes and uncheck them. SA
 *  										 - 
 *   
 * Author: 		First Hosted Limited
 *
 * Purpose: 	To uncheck receive check box for Item receipts.
 * 
 * Script: 		customscript_itemreceipt  
 * Deploy: 		customdeploy_itemreceipt  
 *
 * Notes: 		Custom Item Receipt
 * 
 *
 * Library: 	n/a
 ********************************************************************/


/**
 * 
 *  Page Initiation Function
 * 	1.0.1
 * 
 */
function markAllUnchecked()
{
	var itemCount = 0;

	try
	{
		itemCount = nlapiGetLineItemCount('item');
		
		//get line item count
		for(var i = 1; i <= itemCount; i++)
		{
			nlapiSelectLineItem('item', i);
			nlapiSetCurrentLineItemValue('item', 'itemreceive',false);
			nlapiCommitLineItem('item');
		}
	}
	catch(e)
	{
		errHandler('markAllUnchecked', e.message);
	}
}


/**
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 */
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}
/*******************************************************************************
 * Name: dropShipPOClient.js 
 * 
 * Script Type: Client Client: Interflow
 * 
 * Version: 1.0.0 - 27/06/2013 - First Release - LG 
 * 			1.1.0 - 03/07/2013 - Refactored - LG 
 * 
 * Author: FHL
 * 
 * Purpose: To copy description items from the related Sales Order.
 * 
 * Script: customscript_dropshippoclient  
 * Deploy: customdeploy_dropshippoclient  
 * 
 * Notes: [TODO]
 * 
 * Library: Library.js
 ******************************************************************************/

var createdFromExist = false;
var askCheck = false;
var lineCountPO = 0;
var lineCountSO = 0;
var soInternalID = '';
var soRecord = null;

/*******************************************************************************
 * 
 * clientGenerateItemsClick
 * 
 * @appliedtorecord purchaseOrder
 * 
 * @param {String} -
 *            type Sublist internal id
 * @returns {Void}
 * 
 ******************************************************************************/
function clientGenerateItemsClick(type)
{
	try
	{
		hasAttachedSO();

		if (createdFromExist == true)
		{
			askCheck = confirm('This will remove all Items in the Purchase Order and replace them with the Items from the Sales Order.\n\nAre you sure you wish to continue?');

			if (askCheck == true)
			{
				clearPOItems();
				copyFromSalesOrder();
				alert('All items have been copied. Please ensure they are correct before saving the Purchase Order.');
			}
		}
		else
		{
			alert('There is no Sales Order associated with this Purchase Order.\n\nThis function is not valid within the current execution context.');
		}
	}
	catch (e)
	{
		errHandler('clientGenerateItemsClick', e);
	}
}

/*******************************************************************************
 * 
 * hasAttachedSO - checks the Current Purchase Order for an attached Sales Order
 * 
 * 
 ******************************************************************************/
function hasAttachedSO()
{
	try
	{
		// get the value of 'createdfrom'
		soInternalID = nlapiGetFieldValue('createdfrom');

		// convert it to a string
		soInternalID = String(soInternalID);

		// if the length of the string is 0, it means it's blank
		if (soInternalID.length == 0)
		{
			// set the value to false
			createdFromExist = false;
		}
		else
		{
			// set the value to true
			createdFromExist = true;
		}
	}
	catch (e)
	{
		errHandler('hasAttachedSO', e);
	}
}

/*******************************************************************************
 * 
 * clearPOItems - iterates through the Line Items and remove them
 * 
 ******************************************************************************/
function clearPOItems()
{
	try
	{
		// get the line count of the items sublist
		lineCountPO = nlapiGetLineItemCount('item');

		// Iterates through line items from last to first
		for ( var i = lineCountPO; i >= 1; i--)
		{
			// remove the specified line item
			nlapiRemoveLineItem('item', i);
		}
	}
	catch (e)
	{
		errHandler('clearPOItems', e);
	}
}

/*******************************************************************************
 * 
 * copyFromSalesOrder - iterates through the Line Items and copies them
 * 
 ******************************************************************************/
function copyFromSalesOrder()
{
	var itemId = '';
	var itemQty = 0;
	var itemDescription = '';

	try
	{
		// load record
		soRecord = nlapiLoadRecord('salesorder', soInternalID);

		// get line item count
		lineCountSO = soRecord.getLineItemCount('item');

		// load sales order
		for ( var i = 1; i <= lineCountSO; i++)
		{
			// Gets items values from the ralated sales order.
			itemId = soRecord.getLineItemValue('item', 'item', i);

			itemDescription = soRecord.getLineItemValue('item', 'description', i);
			itemQty = parseInt(soRecord.getLineItemValue('item', 'quantity', i));

			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item', 'item', itemId, false, true);
			nlapiSetCurrentLineItemValue('item', 'description', itemDescription, true, true);
			
			if (itemQty > 0)
			{
				nlapiSetCurrentLineItemValue('item', 'quantity', itemQty);
			}
			
			nlapiCommitLineItem('item');
		}
	}
	catch (e)
	{
		errHandler('copyFromSalesOrder', e);
	}
}


/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
		alert('Error whilst executing ' + sourceFunctionName + '.\nError: ' + errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}

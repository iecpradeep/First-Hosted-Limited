/*************************************************************************************
 * Name:		dropShipCE.js
 * Script Type:	Client
 * Client:		Interflow
 *
 * Version:		1.0.0 - 27/06/2013 - First Release - LG
 *
 * Author:		FHL
 * 
 * Purpose:		To copy description items from the related Sales Order.
 * 
 * Script: 		[TODO]
 * Deploy: 		[TODO]
 * 
 * Notes:		[TODO]
 * 
 * Library: 	Library.js
 *************************************************************************************/

var salesNo = '';
var taxCode = '';

/**
 * 
 * Initialise process.
 * 
 */
function initialise()
{
	try
	{
		if(confirm("This will clear all current items and replace them with items from the related Sales Order." + "\n" + "Are you sure you want to do this?") == true)
		{
			clearLineItems();
			getItemsFromSO();
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'initialise', e.message);
	}
}

/**
 * 
 * Removes current line items.
 * 
 */
function clearLineItems()
{
	var lineCountPO = '';
	
	try
	{
		//Gets value of related Sales Order
		salesNo = nlapiGetFieldValue('createdfrom');
		
		if (salesNo != null)
		{
			lineCountPO = nlapiGetLineItemCount('item');
			
			//Iterates through line items to remove them.
			for (var i = 0; i <= lineCountPO; i++)
			{	
				nlapiRemoveLineItem('item', 1);
			}
		}
		else
		{
			alert("This Purchase Order does not have an associated Sales Order.");
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'clearLineItems', e.message);
	}
}

/**
 * 
 * Retrieves Sales Order line item values.
 * 
 */
function getItemsFromSO()
{
	var record = '';
	var lineCountSO = '';
	var itemType = '';
	var name = '';
	var description = '';
	var quantity = '';

	//zzzzzz
	try
	{
			//Loads related sales order.
			record = nlapiLoadRecord('salesorder', salesNo);
			lineCountSO = record.getLineItemCount('item');
			
			nlapiLogExecution('debug', 'getItemsFromSO lineCountSO', lineCountSO);
			//nlapiSelectLineItem('item', k);
			for (var k = 1; k <= lineCountSO ; k++)
			{
				//Gets items values from the ralated sales order.
				name = record.getLineItemValue('item', 'item', k);
				
				description = record.getLineItemValue('item', 'description', k);
				quantity = record.getLineItemValue('item', 'quantity', k);
				taxCode = nlapiLookupField('item', name, 'salestaxcode');
				//Looks up the item type.
				itemType = nlapiLookupField('item', name, 'type');
				
				nlapiLogExecution('debug', 'k', k + ',' + itemType);
				nlapiLogExecution('debug', 'name, item type, desc, qty, taxCode, k', name + ','+ itemType + ',' + description + ','+ quantity+','+taxCode + ',' +k );
				
				//alert(k);
				
				
				if (itemType != 'Description')
				{

					setNonDescriptionItem(k,name,description,quantity);
				}
				else
				{
			
		
					setDescriptionItem(k,name,description);
				}
			
				
				
				//nlapiSelectNewLineItem('item');
			}
			
			alert("Please review the Purchase Order and remove any items that are not required.");
		}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'getItemsFromSO', e.message);
	}
}

/**
 * 
 * Sets and commits a non description item.
 * 
 */
function setNonDescriptionItem(k,name,description,quantity)
{
	try	
	{

		
		//nlapiSelectLineItem('item', k);
		nlapiSetCurrentLineItemValue('item', 'item', name);
		nlapiSetCurrentLineItemValue('item', 'quantity', quantity);
		nlapiSetCurrentLineItemValue('item', 'description', description);
		//nlapiSetCurrentLineItemValue('item', 'taxcode', taxCode);
		
		nlapiCommitLineItem('item');
		nlapiSelectNewLineItem('item');
		
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'setNonDescriptionItem', e.message);
	}
}

/**
 * 
 * Sets and commits a description line item without a quantity.
 * 
 */
function setDescriptionItem(k,name,description)
{
	try	
	{

		
		//nlapiSelectLineItem('item',k);
		nlapiSetCurrentLineItemValue('item', 'item', name);
		nlapiSetCurrentLineItemValue('item', 'description', description);
		//nlapiSetCurrentLineItemValue('item', 'taxcode', taxCode);
		
		nlapiSelectNewLineItem('item');
		nlapiCommitLineItem('item');

	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'setDescriptionItem', e.message);
	}
}
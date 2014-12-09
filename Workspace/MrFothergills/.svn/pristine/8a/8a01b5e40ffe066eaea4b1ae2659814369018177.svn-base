/*************************************************************************************
 * Name:		itemDemand.js
 * 
 * Script Type:	Client
 *
 * Version:		1.0.0 - first version - PL
 * 				1.1.0 - 16 Jun 2013 - added loadStockStatus function to use item ID to retrieve item stock status - JA
 *				
 * Author:		Peter Lewis, FHL
 * 
 * Purpose:		Compares the Out of Stock behaviour against the Out of Stock fields
 * 
 * Script: 		customscript_itemdemandplanning 
 * Deploy: 		customdeploy_itemdemandplanning
 * 
 * Notes:		Deployed against the Sales Order record as a Client Script
 * 				ID 	customscript_itemdemandplanning
 * 
 * Library: 	Library.js	
 *************************************************************************************/

var currentLine = 0;

var outOfStockMessageFieldID = 'outofstockmessage';	//standard fields
var outOfStockBehaviourFieldID = 'outofstockbehavior';	//standard fields

var outOfStockMessageColumnID = 'custcol_outofstockmessage';	//custom fields - done on ns
var outOfStockBehaviourColumnID = 'custcol_outofstockbehavior';	//custom fields - done on ns

var outOfStockMessage ='';
var outOfStockBehaviour = '';
var futureStockStatus = '';
var currentStockStatus = '';

var context = '';
var executionContext = '';
var record = '';
var stockStatus = '';
var invID = '';

/**
 * validate the line
 * 
 * @returns {Boolean} - Whether the Line Validate was successful or not
 */
function lineValidate(type)
{
	var retVal = true;
	try
	{
		context = nlapiGetContext();
		executionContext = context.getExecutionContext();
		
		//1.1.0 Get the stock status from the item record  - JA
		loadStockStatus(type);
		
		if (executionContext == 'userinterface')
		{
			if (type == 'item')
			{
				outOfStockMessage = nlapiGetCurrentLineItemValue(type, outOfStockMessageColumnID);
				outOfStockBehaviour = nlapiGetCurrentLineItemValue(type, outOfStockBehaviourColumnID);
				
				switch(stockStatus)
				{
					case '3': //Over Committed
						retVal = false;
						alert('Item Over Committed and unavailable.\n\n' + outOfStockMessage);
						break;
					
					case '2': //Under Committed
						alert('Item Under Committed: item will be back ordered.\n\n' + outOfStockMessage);
						break;
					
					default:
						break;					
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('lineValidate', e);
	}
	return retVal;
}

/**
 * Get stock status of item
 * 
 * 1.1.0 added - JA
 */
function loadStockStatus(type)
{
	try
	{
		invID = nlapiGetCurrentLineItemValue(type, 'item');		
		record = nlapiLoadRecord('inventoryitem', invID );
		stockStatus = record.getFieldValue('custitem_stockstatus');
	}
	catch(e)
	{
		errorHandler('loadStockStatus', e);
	}
}


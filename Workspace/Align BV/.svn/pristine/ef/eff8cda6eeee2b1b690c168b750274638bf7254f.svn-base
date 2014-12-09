/*******************************************************************************************
 * Name:		Modify Sales Order From Estimate (modifySOFromEstimate.js)
 * Script Type:	User Event
 * Client:		Align BV
 *
 * Version:		1.0.0 - 18 Mar 2013 - first release - MJL
 * 				1.0.1 - 03 Jun 2013 - gets sales order and estimate IDs dependent on record type - MJL
 *
 * Author:		FHL
 * 
 * Purpose:		Alters existing Sales Order info after calculating offers
 * 
 * Script: 		customscript_
 * Deploy: 		customdeploy_
 * 
 * Notes:		[TODO] Remove debug code
 * 
 * Library: 	Library.js
 *******************************************************************************************/

var tibcoFeedID = 0;
var recType = '';
var recTibcoFeed = null;
var isManual = 'F';

var estimateID = 0; 
var recEstimate = null;

var customerID = 0;
var salesOrderDate = '';
var soShipDate = '';

var discountItem = 0;
var discountRate = '';

var itemCount = 0;
var itemArray = [];
var itemObj = new Object();

var soRefNo = '';
var salesOrderID = 0;
var recSalesOrder = null;

var shipCountry = '';
var billCountry = '';

/**
 * Main control block - called from deployment record
 * 
 * @param type: event on which the script is run
 */
function modifySOFromEstimate(type)
{
	
	getEstimateAndSOIds();

	
	nlapiLogExecution('DEBUG', 'modifySOFromEstimate before', 'before');
	
	if (estimateID > 0 && isManual == 'T')
	{
		nlapiLogExecution('DEBUG', 'before get estimate ', estimateID);
		
		getEstimateInfo();

		if (salesOrderID > 0)
		{
			
			nlapiLogExecution('DEBUG', 'sales order it has ', salesOrderID);

			alterSalesOrder();
		}
	}
}

/**
 * Gets sales order ID and estimate ID depending on record type
 * 
 * 1.0.1 function added - MJL 
 */
function getEstimateAndSOIds()
{
	
	var payloadRecordID = 0;
	var payloadRecord = 0;
	
	try
	{
		recType = nlapiGetRecordType();
		
		switch (recType)
		{
			case 'salesorder':
				//Load sales order
				salesOrderID = nlapiGetRecordId();
				recSalesOrder = nlapiLoadRecord(recType, salesOrderID);
				
				//Get sales order tran ID
				soRefNo = recSalesOrder.getFieldValue('tranid');
				
				isManual = recSalesOrder.getFieldValue('custbody_vat_pricedisc_override');
				
				if (soRefNo.length > 0)
				{
					//Get internal ID for Estimate
					payloadRecordID = genericSearch('customrecord_tibco_order_feed','custrecord_alignbv_ordernumber',soRefNo);
					payloadRecord = nlapiLoadRecord('customrecord_tibco_order_feed', payloadRecordID);
					estimateID = payloadRecord.getFieldValue('custrecord_tibco_order_estimate_lookup');
					
					
					//getEstimateID();
				}
				break;
				
			case 'customrecord_tibco_order_feed':
				//Load TIBCO record
				tibcoFeedID = nlapiGetRecordId();
				recTibcoFeed = nlapiLoadRecord(recType, tibcoFeedID);
				
				//Check if the sales order was manually generated
				isManual = recTibcoFeed.getFieldValue('custrecord_tibco_order_is_manualentry');
				
				if (isManual == 'T')
				{
					//Get estimate ID
					estimateID = recTibcoFeed.getFieldValue('custrecord_tibco_order_estimate_lookup');
	
					//Get sales order ref no. and lookup internal ID 
					soRefNo = recTibcoFeed.getFieldValue('custrecord_alignbv_ordernumber');
					salesOrderID = genericSearch('salesorder', 'tranid', soRefNo);
					recSalesOrder = nlapiLoadRecord(recType, salesOrderID);
				}
				break;
				
			case 'customrecord_fhlevents':
				
				stagingRecordID = nlapiGetRecordId();
				stagingRecord = nlapiLoadRecord(recType, stagingRecordID);
				salesOrderID = stagingRecord.getFieldValue('custrecord_fhle_salesorder');
				
				recSalesOrder = nlapiLoadRecord('salesorder', salesOrderID);
				
				isManual = recSalesOrder.getFieldValue('custbody_vat_pricedisc_override');
				
				soRefNo = recSalesOrder.getFieldValue('tranid');
				
				
				payloadRecordID = genericSearch('customrecord_tibco_order_feed','custrecord_alignbv_ordernumber',soRefNo);
				recTibcoFeed = nlapiLoadRecord('customrecord_tibco_order_feed', payloadRecordID);
				estimateID = recTibcoFeed.getFieldValue('custrecord_tibco_order_estimate_lookup');

				
				break;
				
				
			default:
				break;
		}
	}
	catch (e)
	{
		errorHandler('getEstimateAndSOIds', e);
	}
}

/**
 * Load estimate record from TIBCO Feed and get discount info
 */
function getEstimateInfo()
{
	try
	{
		//Load estimate
		recEstimate = nlapiLoadRecord('estimate', estimateID);
		
		//Get discount information
		discountItem = recEstimate.getFieldValue('discountitem');
		discountRate = recEstimate.getFieldValue('discountrate');
		
		//Get count of lines
		lineCount = recEstimate.getLineItemCount('item');
		
		for (var i = 1; i <= lineCount; i++)
		{
			//Create new Item object
			itemObj = new Object();
			
			//Get detail information
			recEstimate.selectLineItem('item', i);
			itemObj.itemId = recEstimate.getCurrentLineItemValue('item', 'item');
			itemObj.quantity = recEstimate.getCurrentLineItemValue('item', 'quantity');
			itemObj.desc = recEstimate.getCurrentLineItemValue('item', 'description');
			itemObj.rate = recEstimate.getCurrentLineItemValue('item', 'rate');
			itemObj.taxCode = recEstimate.getCurrentLineItemValue('item', 'taxcode');
			itemObj.shipTo = recEstimate.getCurrentLineItemValue('item', 'custcol_shipto');
			itemObj.lowerStage = recEstimate.getCurrentLineItemValue('item', 'custcol_alignbv_lowerstage');
			itemObj.upperStage = recEstimate.getCurrentLineItemValue('item', 'custcol_alignbv_upperstage');
			itemObj.alignersNo = recEstimate.getCurrentLineItemValue('item', 'custcol_alignbv_number_of_aligners');
			
			//Add object to item array
			itemArray[itemCount] = itemObj;
			itemCount++;
		}
	}
	catch(e)
	{
		errorHandler('getEstimateInfo', e);
	}
}

/**
 * Load sales order and alter info to reflect Tibco Feed calculations
 */
function alterSalesOrder()
{	
	try
	{	
		//Enter discount information
		recSalesOrder.setFieldValue('discountitem', discountItem);
		recSalesOrder.setFieldValue('discountrate', discountRate);
		
		//Clear item sublist
		removeAllLineItems(recSalesOrder, 'item');
		
		//Enter new discounted line items
		for (var i = 0; i < itemArray.length; i++)
		{	
			//Load next item from array
			itemObj = itemArray[i];
			
			//Add new line item
			recSalesOrder.selectNewLineItem('item');
			recSalesOrder.setCurrentLineItemValue('item', 'item', itemObj.itemId);
			recSalesOrder.setCurrentLineItemValue('item', 'quantity', itemObj.quantity);
			recSalesOrder.setCurrentLineItemValue('item', 'description', itemObj.desc);
			recSalesOrder.setCurrentLineItemValue('item', 'rate', itemObj.rate);
			recSalesOrder.setCurrentLineItemValue('item', 'taxcode', itemObj.taxCode);
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_shipto', itemObj.shipTo);
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_alignbv_lowerstage', itemObj.lowerStage);
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_alignbv_upperstage', itemObj.upperStage);
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_alignbv_number_of_aligners', itemObj.alignersNo);
			recSalesOrder.commitLineItem('item');
		}
		nlapiSubmitRecord(recSalesOrder);	
		nlapiLogExecution('AUDIT', 'Sales Order altered', soRefNo);
	}
	catch(e)
	{
		errorHandler('alterSalesOrder', e);
	}
}

/**
 * Get Estimate internal ID from ref no. of Sales Order
 * 
 * 1.0.1 function added - MJL
 */
function getEstimateID()
{
	var searchFilter = null;
	var searchColumn = null;
	var searchResults = null;

	try
	{
		//search filters                  
		searchFilter = new nlobjSearchFilter('custrecord_alignbv_ordernumber', null, 'is', soRefNo);                          

		// return columns
		searchColumn = new nlobjSearchColumn('custrecord_tibco_order_estimate_lookup');

		// perform search
		searchResults = nlapiSearchRecord('customrecord_tibco_order_feed', null, searchFilter, searchFilter);

		nlapiLogExecution('DEBUG', 'modifySOFromEstimate before', 'before');

		if(searchResults != null)
		{
			nlapiLogExecution('DEBUG', 'modifySOFromEstimate searchResults.length', searchResults.length);
			
			if(searchResults.length == 1)
			{
				searchResult = searchResults[0];
				estimateID = searchResult.getValue(searchColumn);
				
				nlapiLogExecution('DEBUG', 'modifySOFromEstimate estimateID', estimateID);
			}
		}
	}
	catch(e)
	{
		errorHandler("getEstimateID", e);
	}     	      
}
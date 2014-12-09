/*******************************************************************************************
 * Name:		Revert the sales order back to basket state (editSalesOrder.js)
 * Script Type:	Client
 * Client:		Mr Fothergills
 *
 * Version:		1.0.0 - 24/04/2013 - First release - JM
 *
 * Author:		FHL
 * 
 * Purpose:		Revert the sales order back to basket state - used for when the user edits an order which has been subjected to calc
 * 				
 * 
 * Script: 		customscript_editsorevert  
 * Deploy: 		customdeploy_editsorevert  
 * 
 * Notes:		on the deployment record set applies to = sales order
 * 
 * Library: 	offersLibrary.js
 *******************************************************************************************/

var recType = '';

var customerID = 0;
var salesOrderDate = '';
var soShipDate = '';

var itemCount = 0;
var itemObj = new Object();

var soRefNo = '';
var salesOrderID = 0;
var recSalesOrder = null;
var status = '';
var orderSplit = null;			// array for splitting xml out
var orderSplitLines = 0;		// number if lines in split array

var itemsArray = new Array();
var itemsCount = 0;

var offersList = '';
var savings = '';

/**
 * Main control block - called from deployment record
 * 
 * @param type: event on which the script is run
 */
function editSalesOrder(type)
{

	try
	{

		savings = nlapiGetFieldValue('custbody_savings');

		if(savings.length!=0)
		{
			loadCalculationRecord();

			if(status!='Failed' && salesOrderID!=0)
			{
				parseXMLSalesOrder();
				alterSalesOrder();
			}
		}
	}
	catch(e)
	{
		errorHandler("editSalesOrder", e);
	}

}

/**
 * 
 * loadCalculationRecord
 * 
 */
function loadCalculationRecord()
{
	var recordType = '';	
	var soRefNo = '';

	try
	{

		recordType = nlapiGetRecordType();
		salesOrderID = nlapiGetRecordId();		// load current record
		recSalesOrder = nlapiLoadRecord(recordType, salesOrderID);
		soRefNo= recSalesOrder.getFieldValue('tranid');
		payloadRecordID = genericSearch('customrecord_offerscalculation','custrecord_reference',soRefNo);
		payloadRecord = nlapiLoadRecord('customrecord_offerscalculation', payloadRecordID);

		XMLSalesOrder= payloadRecord.getFieldValue('custrecord_payload');
		XMLSalesOrder = UNencodeXML(XMLSalesOrder);
		status = payloadRecord.getFieldValue('custrecord_status');

	}
	catch(e)
	{
		errorHandler("loadCalculationRecord", e);
	}
}


/**
 * 
 * parse XML Sales Order 
 * 
 */
function parseXMLSalesOrder()
{

	try
	{

		orderSplit = null;

		orderSplit = XMLSalesOrder.split('<br>');
		orderSplitLines = orderSplit.length;

		for(var x=0; x<orderSplitLines;x++)
		{
			orderElement = orderSplit[x];
			getOrderLineDetails();
		}
	}
	catch(e)
	{
		errorHandler("parseXMLIntoSalesOrderLineArray", e);
	}
}


/**
 * get order item line details
 *   
 */
function getOrderLineDetails()
{
	try
	{
		//========================================
		// items
		//========================================
		if(orderElement.indexOf('<quantity>')!=-1)
		{
			itemObj=new Object();
			itemObj.quantity= splitOutValue(orderElement,'quantity');
			itemObj.location = "";
		}

		if(orderElement.indexOf('<itemcode>')!=-1)
		{
			itemObj.itemCode = splitOutValue(orderElement,'itemcode');
		}

		if(orderElement.indexOf('<description>')!=-1)
		{
			itemObj.description = splitOutValue(orderElement,'description');
		}

		if(orderElement.indexOf('<location>')!=-1)
		{
			itemObj.location = splitOutValue(orderElement,'location');
		}

		if(orderElement.indexOf('<priceExVAT>')!=-1)
		{
			itemObj.priceExVAT = splitOutValue(orderElement,'priceExVAT');
			itemObj.priceExVAT = parseFloat(itemObj.price); 
		}

		if(orderElement.indexOf('<price>')!=-1)
		{
			itemObj.price = splitOutValue(orderElement,'price');
			itemObj.price = parseFloat(itemObj.price); 
			itemsArray[itemsCount] = itemObj;
			itemsCount = itemsCount + 1;
		}

	}
	catch(e)
	{
		errorHandler("getOrderLineDetails", e);
	}

}

/**
 * Load sales order and alter info to reflect Tibco Feed calculations
 */
function alterSalesOrder()
{	

	var qty = 0;
	var rate = 0;
	var itemIntID = 0;

	try
	{

		// clear the savings
		// clear the items
		// add the basket items back in

		nlapiSetFieldValue('custbody_savings', '');
		clearLineItems('item');


		for (var i = 0; i < itemsArray.length; i++)
		{	
			//Load next item from array
			itemObj = itemsArray[i];

			qty = parseFloat(itemObj.quantity);
			rate = parseFloat(itemObj.priceExVAT);
			itemIntID = genericSearch('item', 'itemid', itemObj.itemCode);

			// add new line
			nlapiSelectLineItem('item', i+1);

			nlapiSetCurrentLineItemValue('item', 'item', itemIntID, false, true);
			nlapiSetCurrentLineItemValue('item', 'custcol_itemdepartment', itemIntID, false, true);

			nlapiSetCurrentLineItemValue('item', 'quantity', qty, false, true);
//			nlapiSetCurrentLineItemValue('item', 'rate', rate, false, true);				// not needed as it's lookedup from the item
//			nlapiSetCurrentLineItemValue('item', 'amount', rate*qty, false, true);

			if(itemObj.location.length!=0)
			{
				nlapiSetCurrentLineItemText('item', 'location', itemObj.location, false, true);
			}

			nlapiCommitLineItem('item');
		}
	}
	catch(e)
	{
		errorHandler('alterSalesOrder', e);
	}
}


/**
 * Removes all the line items from a sublist.
 * @param {String} listId The Id of the list/group/sublist (e.g. 'item')
 */
function clearLineItems(listId)
{

	var count = 0;

	try
	{
		count = nlapiGetLineItemCount(listId);

		for(var i = 0; i < count; i++)
		{
			nlapiSelectLineItem(listId, 1);
			nlapiRemoveLineItem(listId, 1);
		}
	}
	catch(e)
	{
		errorHandler('clearLineItems', e);
	}


}  


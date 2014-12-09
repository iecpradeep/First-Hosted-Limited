/*************************************************************************************
 * Name:		Generate XML Payload for the Sales Order (salesOrderXML.js)
 * Script Type:	User Event
 * Client:		Mr Fothergills
 *
 * Version:		1.0.0 - 13 Mar 2013 - first release - JM
 *
 * Author:		FHL
 * 
 * Purpose:		Creates an XML payload record for a sales order 
 * 
 * Script: 		customscript_salesorderxml
 * Deploy: 		customdeploy_salesorderxml  
 * 
 * Notes:		works on sales order create/after submit to populate the payload 
 * 				basket for	customrecord_offerscalculation custom record set
 * 				
 * 
 * Library: 	offersLibrary.js
 *************************************************************************************/

var OffersCalcFeedID = 0;
var recOffersCalcFeed = null;
var xmlPayload = '';

var salesOrderID = 0;
var recType = '';
var recSalesOrder = null;
var customerID = 0;
var salesOrderDate = '';
var soRefNo = 0;
var soShipDate = '';
var campaign = '';

var itemCount = 0;
var itemArray = [];
var itemObj = new Object();

var xmlPayload = '';
var payloadRecord = null;
var rndSaleOrderRef = 0;
var brand = 0;

/**
 * Main control block - called from deployment record
 */
function salesOrderXML(type)
{
	
	nlapiLogExecution('DEBUG', 'salesOrderXML', type);
	
	if (type == 'create' || type == 'edit')
	{
		getInfoFromSO();
		//clientGetSalesOrderInfo();

		if (itemArray.length > 0)
		{
			addtoOffersCalcFeed();
		}	
	}
}

/**
 * Load information from manually created Sales Order
 */
function getInfoFromSO()
{	
	var isOverridden = '';
	var lineCount = 0;
	var itemCode = '';
	var total = 0;
	var qty = 0;
	var price = 0;
	var location = 0;
	var priceExVAT = 0;

	try
	{
		//Load sales order
		recType = nlapiGetRecordType();
		salesOrderID = nlapiGetRecordId();
		recSalesOrder = nlapiLoadRecord(recType, salesOrderID);

		//Check if system VAT calculation is overridden
		//isOverridden = recSalesOrder.getFieldValue('custbody_vat_pricedisc_override');

		isOverridden = 'T';

		//If overridden...
		if (isOverridden == 'T')
		{
			//Get header information
			customerID = recSalesOrder.getFieldValue('entity');
			salesOrderDate = recSalesOrder.getFieldValue('trandate');
			soRefNo = recSalesOrder.getFieldValue('tranid');
			soShipDate = recSalesOrder.getFieldValue('shipdate');
			brand = recSalesOrder.getFieldValue('department');
			
			// [todo] comment please jsm
			brand = parseInt(brand);
			
			if(!brand)
			{
				brand = nlapiLookupField('customer',customerID, 'custentity_mrf_cust_brand');
			}


			campaign = recSalesOrder.getFieldValue('custbody_campaign');
			if(!campaign)
			{
				campaign = '';
			}

			//Get count of lines
			lineCount = recSalesOrder.getLineItemCount('item');

			for (var i = 1; i <= lineCount; i++)
			{
				//Get detail information
				itemObj = new Object();
				recSalesOrder.selectLineItem('item', i);
				itemObj.itemId = recSalesOrder.getCurrentLineItemValue('item', 'item');

				itemObj.itemRef = nlapiLookupField('item', itemObj.itemId, 'name');
				qty = recSalesOrder.getCurrentLineItemValue('item', 'quantity');
				total = recSalesOrder.getCurrentLineItemValue('item', 'grossamt');
				location = recSalesOrder.getCurrentLineItemText('item', 'location');
				priceExVAT = recSalesOrder.getCurrentLineItemValue('item', 'rate');
				
				if(qty!=0 && total!=0)
				{
					price = total/qty;
				}
				else
				{
					price = 0;
				}

				itemObj.quantity = qty;
				itemObj.desc = recSalesOrder.getCurrentLineItemText('item', 'item');			// [TODO] get description
				itemObj.price = price; 
				itemObj.priceExVAT = priceExVAT; 
				itemObj.location = location;

				//Add object to item array
				itemArray[itemCount] = itemObj;
				itemCount++;
			}
		}
	}
	catch(e)
	{
		errorHandler('createSO', e);
	}
}

/**
 * Create OffersCalc XML question and post to custom record
 */
function addtoOffersCalcFeed()
{
	try
	{
		//Create XML header
		createXMLHeader();

		for (var i = 0; i < itemArray.length; i++)
		{
			itemObj = itemArray[i];
			createXMLDetail();
		}

		xmlPayload += createXMLTagEnd('detail');
		xmlPayload += createXMLTagEnd('basket');

		//Create new OffersCalc feed record
		if (xmlPayload.length > 0)
		{
			upsertOffersCalcFeedRecord();
		}
	}
	catch(e)
	{
		errorHandler('addtoOffersCalcFeed', e);
	}
}

/**
 * Add header information to OffersCalc XML question 
 */
function createXMLHeader()
{
	try
	{
		xmlPayload = createXMLTagStart('basket');
		xmlPayload += createXMLTagStart('header');

		xmlPayload += createXMLLine('customer', customerID);
		xmlPayload += createXMLLine('reference', soRefNo);
		xmlPayload += createXMLLine('date', salesOrderDate);
		xmlPayload += createXMLLine('campaign', campaign);
		xmlPayload += createXMLLine('brand', brand);

		xmlPayload += createXMLTagEnd('header');
		xmlPayload += createXMLTagStart('detail');
	}
	catch(e)
	{
		errorHandler("createXMLHeader", e);
	}
}	

/**
 * Add detail information to OffersCalc XML question
 */
function createXMLDetail()
{

	try
	{
		xmlPayload += createXMLTagStart('orderline');

		xmlPayload += createXMLLine('quantity', itemObj.quantity);
		xmlPayload += createXMLLine('itemcode', itemObj.itemRef);
		xmlPayload += createXMLLine('description', itemObj.desc);
		xmlPayload += createXMLLine('location', itemObj.location);
		xmlPayload += createXMLLine('priceExVAT', itemObj.priceExVAT);
		xmlPayload += createXMLLine('price', itemObj.price);

		xmlPayload += createXMLTagEnd('orderline');
	}
	catch(e)
	{
		errorHandler("createXMLDetail", e);
	}
}

/**
 * Create new OffersCalc feed record
 */
function upsertOffersCalcFeedRecord()
{
	var offerCalcIntID = 0;

	try
	{
		offerCalcIntID = genericSearch('customrecord_offerscalculation','custrecord_reference',soRefNo);

		if(offerCalcIntID!=0)
		{
			payloadRecord = nlapiLoadRecord('customrecord_offerscalculation', offerCalcIntID);
		}
		else
		{
			payloadRecord = nlapiCreateRecord('customrecord_offerscalculation');
			payloadRecord.setFieldValue('custrecord_reference', soRefNo);
		}

		payloadRecord.setFieldValue('custrecord_payload', xmlPayload);
		payloadRecord.setFieldValue('custrecord_status', 'Pending');
		offerCalcIntID = nlapiSubmitRecord(payloadRecord, true);
	}
	catch(e)
	{
		errorHandler('upsertOffersCalcFeedRecord', e);
	}
}








/*************************************************************************
 * 
 * CODE BELOW NOT USED
 * CODE BELOW NOT USED
 * CODE BELOW NOT USED
 * CODE BELOW NOT USED
 * CODE BELOW NOT USED
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 *************************************************************************/














/**
 * NOT USED - NOT USED - NOT USED
 * Load information from yet to be committed client side sales order info
 * here just in case we need to do this client side - DO NOT REMOVE EVEN THOUGH THIS IS NOT USED
 */
function clientGetSalesOrderInfo()
{	
	var lineCount = 0;
	var itemCode = '';

	try
	{
		//generate sales order referemnce
		salesOrderID = rndSaleOrderRef;

		//Get header information
		customerID = nlapiGetFieldValue('entity');
		salesOrderDate = nlapiGetFieldValue('trandate');
		campaign = nlapiGetFieldValue('custbody_campaign');

		//Get count of lines
		lineCount = nlapiGetLineItemCount('item');

		for (var i = 1; i <= lineCount; i++)
		{
			//Get detail information
			itemObj = new Object();
			nlapiSelectLineItem('item', line);

			itemObj.itemId = lapiGetCurrentLineItemValue('item', 'item');
			itemCode = lapiGetCurrentLineItemText('item', 'item');
			itemCode = itemCode.substring(0,5);
			itemObj.itemRef = itemCode;

			itemObj.quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
			itemObj.desc = lapiGetCurrentLineItemText('item', 'item');		// [TODO] get description
			itemObj.price = nlapiGetCurrentLineItemValue('item', 'rate');
			//itemObj.transferPrice = recSalesOrder.getCurrentLineItemValue('item', 'amount');

			//Add object to item array
			itemArray[itemCount] = itemObj;
			itemCount++;
		}

	}
	catch(e)
	{
		errorHandler('clientGetSalesOrderInfo', e);
	}
}















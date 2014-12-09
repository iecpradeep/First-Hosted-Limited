/**************************************************************************************
 * Name:		Generate TibCo Payload (salesOrderXML.js)
 * Script Type:	User Event
 * Client:		Align BV
 *
 * Version:		1.0.0 - 13 Mar 2013 - first release - MJL
 * 				1.1.0 - 23 May 2013 - now handles XML specification 3.0 - MJL
 * 				1.1.1 - 30 May 2013 - added storing of sales order int ID to engage price/discount calc - MJL
 * 				1.1.2 - 03 Jun 2013 - gets sales order ID depending on record type - MJL
 * 				1.1.3 - 04 Jun 2013 - gets XML namespace and attributes from script parameters - MJL
 *
 * Author:		FHL
 * 
 * Purpose:		Creates a new TibCo Feed XML payload from a Sales Order for 
 * 				calculating VAT and Price/Discount information
 * 
 * Script: 		customscript_tibco_salesorder_xml (Sales Order XML)
 * Deploy: 		customdeploy_tibco_salesorder_xml
 * 
 * Notes:		[TODO] Remove debug code
 *				[TODO] Need to change event trigger from on edit to on create
 *				[TODO] Weird undefined error
 * 
 * Bugs/issues:	Item descriptions showing as undefined in Tibco Order Feed XML Payload
 * 
 * Library: 	Library.js
 **************************************************************************************/

var tibcoFeedID = 0;
var recTibcoFeed = null;

var context = null;
var xmlNamespace = '';
var xmlRootAttributes = '';
var xmlPayload = '';

var stagingRecordID = 0;
var stagingRecord = null;
var stagingStatus = '';

var salesOrderID = 0;
var recType = '';
var recSalesOrder = null;
var customerID = 0;
var customerRefNo = 0;
var salesOrderDate = '';
var soRefNo = 0;
var soShipDate = '';
var shipToRegion = '';
var billToRegion = '';

var itemCount = 0;
var itemArray = [];
var itemObj = new Object();

var isManual = '';
var xmlPayload = '';

/**
 * Main control block - called from deployment record
 * 
 * 1.1.2 added call to getSalesOrderID function - MJL
 */
function salesOrderXML(type)
{
	//if (type == 'create')
	if (type == 'create' || type == 'edit') //[TODO] This is debug code - remove before deployment
	{
		initialise();
		getSalesOrderID(); //1.1.2 MJL
		
//		if (salesOrderID > 0 && stagingStatus == 'Successful')
		if (salesOrderID > 0)
		{
			getInfoFromSO();

			if (itemArray.length > 0)
			{
				addtoTibcoFeed();
			}
		}
	}
}

/**
 * Initialise function: gets namespace and root attributes of XML from parameters
 * 
 * 1.1.3 gets XML namespace and attributes from script parameters - MJL
 */
function initialise()
{
	context = nlapiGetContext();
	//xmlNamespace = context.getSetting('SCRIPT', 'custscript_so_xml_namespace');
	//xmlNamespace = UNencodeXML(xmlNamespace);
	xmlRootAttributes = context.getSetting('SCRIPT', 'custscript_so_xml_attributes');
	
	xmlNamespace = '<?xml version="1.0" encoding="UTF-8"?>';
	//xmlRootAttributes = 'xmlns="orderxml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="orderxml netsuite-order.xsd"';
}

/**
 * Gets sales order ID depending on the record type the user event fires upon
 * 
 * 1.1.2 function added - MJL 
 */
function getSalesOrderID()
{
	
	var payloadRecordID = 0;
	
	try
	{
		recType = nlapiGetRecordType();
		nlapiLogExecution('AUDIT', 'Record Type', recType);

		switch (recType)
		{
			case 'salesorder':
				nlapiLogExecution('DEBUG', 'Is Sales Order?', recType);
				salesOrderID = nlapiGetRecordId();
				
				recSalesOrder = nlapiLoadRecord('salesorder', salesOrderID);
				soRefNo = recSalesOrder.getFieldValue('tranid');
				
				payloadRecordID = genericSearch('customrecord_tibco_order_feed','custrecord_alignbv_ordernumber',soRefNo);
				recTibcoFeed = nlapiLoadRecord('customrecord_tibco_order_feed', payloadRecordID);
				
				
				break;

			case 'customrecord_fhlevents':
				nlapiLogExecution('DEBUG', 'Is Staging Record?', recType);
				
				stagingRecordID = nlapiGetRecordId();
				stagingRecord = nlapiLoadRecord(recType, stagingRecordID);
				salesOrderID = stagingRecord.getFieldValue('custrecord_fhle_salesorder');
				
				recSalesOrder = nlapiLoadRecord('salesorder', salesOrderID);
				soRefNo = recSalesOrder.getFieldValue('tranid');
				
				stagingStatus = stagingRecord.getFieldValue('custrecord_eventsstatus');
				
				nlapiLogExecution('DEBUG', 'Sales Order ID', salesOrderID);
				nlapiLogExecution('DEBUG', 'stagingStatus', stagingStatus);
				break;

			default:
				break;
		}
	}
	catch (e)
	{
		errorHandler('getSalesOrderID', e);
	}
}

/**
 * Load information from manually created Sales Order
 */
function getInfoFromSO()
{	
	var isOverridden = '';
	var lineCount = 0;
	
	try
	{
		//Load sales order
		
	
		//Check if system VAT calculation is overridden
		isOverridden = recSalesOrder.getFieldValue('custbody_vat_pricedisc_override');
		
		//If overridden...
		if (isOverridden == 'T')
		{
			//Get header information
			customerID = recSalesOrder.getFieldValue('entity');
			customerRefNo = nlapiLookupField('customer', customerID, 'entityid', false);
			salesOrderDate = recSalesOrder.getFieldValue('trandate');
			soRefNo = recSalesOrder.getFieldValue('tranid');
			soShipDate = recSalesOrder.getFieldValue('shipdate');
			
			shipToRegion = recSalesOrder.getFieldText('custbody_alignbv_shipping_region');
			
			billToRegion = lookupAddressInfo('customer', customerID, false, true, 'country');

			// if the ship to region has not been populated, look it up from the customer
			if(!shipToRegion)
			{
				shipToRegion = lookupAddressInfo('customer', customerID, true, false, 'country');
			}
			
			
			//Convert dates to YYYY-MM-DD format
			salesOrderDate = UNreverseDate(salesOrderDate);
			soShipDate = UNreverseDate(soShipDate);

			//Get count of lines
			lineCount = recSalesOrder.getLineItemCount('item');
			
			for (var i = 1; i <= lineCount; i++)
			{
				//Get detail information
				itemObj = new Object();
				recSalesOrder.selectLineItem('item', i);
				itemObj.itemId = recSalesOrder.getCurrentLineItemValue('item', 'item');
				itemObj.itemRef = recSalesOrder.getCurrentLineItemText('item', 'item');
				itemObj.quantity = recSalesOrder.getCurrentLineItemValue('item', 'quantity');
				nlapiLogExecution('DEBUG', 'Description', recSalesOrder.getCurrentLineItemValue('item', 'description'));
			
				itemObj.desc = 'n/a';
				itemObj.transferPrice = recSalesOrder.getCurrentLineItemValue('item', 'rate'); 
				
				//Add object to item array
				itemArray[itemCount] = itemObj;
				itemCount++;
			}
		}
	}
	catch(e)
	{
		errorHandler('getInfoFromSO', e);
	}
}

/**
 * Create TibCo XML question and post to custom record
 */
function addtoTibcoFeed()
{
	try
	{
		//Create XML header
		createXMLHeader();
		
		//Create nodes for each line item
		xmlPayload += '<LINEITEMS>';
		
		for (var i = 0; i < itemArray.length; i++)
		{
			itemObj = itemArray[i];
			createXMLDetail();
		}
		
		//Add closing tags
		xmlPayload += '</LINEITEMS>';
		xmlPayload += '</ORDER>';
		
		nlapiLogExecution('AUDIT', 'xml output', xmlPayload);
		
		//Create new TibCo feed record
		if (xmlPayload.length > 0)
		{
			createTibcoFeedRecord();
		}
	
	}
	catch(e)
	{
		errorHandler('addtoTibcoFeed', e);
	}
}

/**
 * Add header information to TibCo XML question 
 */
function createXMLHeader()
{
	xmlPayload = xmlNamespace; 
	xmlPayload += '<ORDER ' + xmlRootAttributes + '>';
	xmlPayload += '<ORDERNUM>' + soRefNo + '</ORDERNUM>';
	xmlPayload += '<ORDERDATE>' + salesOrderDate + '</ORDERDATE>';
	xmlPayload += '<SHIPDATE>' + soShipDate + '</SHIPDATE>';

	xmlPayload += '<ADDRESSES>';

	xmlPayload += '<ADDRESS>';
	xmlPayload += '<TYPE>SHIPTO</TYPE>';
	xmlPayload += '<ID>' + customerRefNo + '</ID>';
	xmlPayload += '<COUNTRYCODE>' + shipToRegion + '</COUNTRYCODE>';
	xmlPayload += '</ADDRESS>';
	
	xmlPayload += '<ADDRESS>';
	xmlPayload += '<TYPE>BILLTO</TYPE>';
	xmlPayload += '<ID>' + customerRefNo + '</ID>';
	xmlPayload += '<COUNTRYCODE>' + billToRegion + '</COUNTRYCODE>';
	xmlPayload += '</ADDRESS>';
	
	xmlPayload += '</ADDRESSES>';
}	

/**
 * Add detail information to TibCo XML question
 */
function createXMLDetail()
{
	xmlPayload += '<LINEITEM>';
	xmlPayload += '<PARTNUMBER>' + itemObj.itemRef + '</PARTNUMBER>';
	//xmlPayload += '<DESCRIPTION>' + itemObj.itemDesc + '</DESCRIPTION>';
	xmlPayload += '<DESCRIPTION>TESTTESTTEST</DESCRIPTION>'; //[TODO] Weird undefined error
	xmlPayload += '<QUANTITY>' + itemObj.quantity + '</QUANTITY>';
	xmlPayload += '<TRANSFERPRICE>' + itemObj.transferPrice + '</TRANSFERPRICE>';
	xmlPayload += '</LINEITEM>';
	
	//[TODO] This is debug code - remove before deployment
	if (xmlPayload.count('undefined') > 0)
	{
		nlapiLogExecution('DEBUG', 'Undefined count', xmlPayload.count('undefined'));
	}
}

/**
 * Create new TibCo feed record
 * 
 * 1.1.1 added storing of sales order int ID to engage price/discount calc - MJL
 */
function createTibcoFeedRecord()
{
	var tibcoFeedID = 0;
	
	try
	{
		if(!recTibcoFeed)
		{
			recTibcoFeed = nlapiCreateRecord('customrecord_tibco_order_feed');
		}
		recTibcoFeed.setFieldValue('name', 'Created From Sales Order '+soRefNo); 
		recTibcoFeed.setFieldValue('custrecord_tibco_order_is_manualentry', 'T');
		recTibcoFeed.setFieldValue('custrecord_tibco_order_xmlpayload', xmlPayload);
		recTibcoFeed.setFieldValue('custrecord_alignbv_ordernumber', soRefNo); 
		recTibcoFeed.setFieldValue('custrecord_alignbv_salesorder_lookup', salesOrderID); //1.1.1 MJL
		
		tibcoFeedID = nlapiSubmitRecord(recTibcoFeed);
		nlapiLogExecution('AUDIT', 'New TIBCO Order Feed record created', tibcoFeedID);
	}
	catch(e)
	{
		errorHandler('createTibcoFeedRecord', e);
	}
}

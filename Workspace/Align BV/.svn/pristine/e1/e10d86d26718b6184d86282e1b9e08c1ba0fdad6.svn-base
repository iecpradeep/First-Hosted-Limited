// [TO DO] Map Ship / Bill to addresses from TIBCO to Estimate (dont use address book)
// [TO DO] Put JDE ship date into Effective ship date - [DONE]
// [TO DO] Put VAT comment into a custom field [DONE]
/*************************************************************************************

 *
 * Name:		listPriceEngine.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 1st release 27/2/2013 LD
 * 				2.0.0 1st release 07/05/2013 LD
 * 				Cope with new XML tag variants :- 
 *				    <ADDRESSES><ADDRESS> ...
 *						JDEID ===> ID 
 *						CLINIC ===> NAME
 *						ADDRESS[1-4] ===> ADDRESSLINE[1-4]
 *						ZIPCODE ===> POSTALCODE
 *						COUNTRY ===> COUNTRYCODE 
 *				    <LINEITEMS><LINEITEM> ...
 *						PART ===> PARTNUMBER
 *						UPPERSTAGE ===> UPPERSTAGES
 *						LOWERSTAGE ===> LOWERSTAGES
 *				2.1.0 added function to utilise native NetSuite XML APIs - MJL
 *
 * Author:		FHL
 * 
 * Purpose:		Calculate List price for a give item / country / date combination
 * 
 * Script: 		customscript_listprice_engine
 * Deploy: 		customdeploy_usereventlistpriceengine
 * 
 * Notes:		incoming payload derived from customrecord_tibco_order_feed CRS
 * 
 * THIS HAS BEEN REFACTORED ACCORDING TO FHL PROGRAMMING STANDARDS AND COMMITTED TO SVN REPOSITORY
 * BUT NOT DEPLOYED TO ALIGN DEV SANDBOX.
 * 
 * Libraries: 	library.js, libraryXML.js
 *************************************************************************************/
/*
 * Check for Debug Trace 'on' in deployment parameter ...
 * Also whether to use staging or live price data ...
 */
var debugOn = false;
var companyPrefs = nlapiLoadConfiguration('companypreferences');

//incoming record + payload
var payloadRecordID = 0;		// incoming record ID
var payloadRecord = null;		// incoming record
var XMLSalesOrder = '';			// XML Order Payload
var xmldoc = null;				// XML Order Payload in W3C Document format - MJL 
var status = '';				// has this already been processed - from record
var orderElement = '';

// The Order, Item and Address XML Tag definitions
// 2.0.0 Adds a versioning control for which XML variant is in the record
// Default - can be over-ridden during initialise() by dynamic test - see below
var XMLVersion = 2; 
var XMLORDER = 'ORDERNUM';
var XMLORDERDATE = 'ORDERDATE';
var XMLSHIPDATE = 'SHIPDATE';
var XMLCCADATE = 'CCADATE';
var XMLORDERTYPE = 'ORDERTYPE';
var XMLPATIENT = 'PATIENT';
var XMLPATIENTNAME = 'NAME';
var XMLPATIENTINITIALS = 'INITIALS';
var XMLPATIENTFIRSTNAME = 'FIRSTNAME';
var XMLPATIENTLASTNAME = 'LASTNAME';
var XMLPATIENTID = 'ID';

var XMLVATCALC = 'VATCALC';
var XMLVATCODE = 'VATCODE';
var XMLVATRATE = 'VATRATE';
var XMLVATDESC = 'VATINVOICEWORDING';

var XMLITEMLIST = 'LINEITEMS';
var XMLITEM = 'LINEITEM';
var XMLITEMCODE = 'PARTNUMBER';
var XMLITEMUPPERSTAGE = 'UPPERSTAGES';
var XMLITEMLOWERSTAGE = 'LOWERSTAGES';
var XMLITEMQUANTITY = 'QUANTITY';
var XMLITEMDESCRIPTION = 'DESCRIPTION';
var XMLITEMTRANSFERPRICE = 'TRANSFERPRICE';

var XMLADDRESSLIST = 'ADDRESSES';
var XMLADDRESSLINE = 'ADDRESSLINE';
var XMLADDRESSTYPE = 'TYPE';
var XMLADDRESSCOUNTRY = 'COUNTRYCODE';
var XMLJDEID = 'ID';

var XMLADVANTAGEMIN = 'TIERMIN';
var XMLADVANTAGEMAX = 'TIERMAX';
var XMLADVANTAGECCASEQUENCE = 'CCASEQUENCE';
var XMLADVANTAGETYPE = 'ADVANTAGETYPE';

//The Price List Answer XML Tag definitions
var XMLANSWER = 'LISTPRICECALC';
var XMLANSWERITEMINDEX = 'ITEMINDEX';
var XMLANSWERINVOICED = 'ITEMINVOICED';
var XMLANSWERCURRENCY = 'CURRENCYID';
var XMLANSWEREXCHANGERATE = 'EXCHANGERATE'; // To base (Euro)
var XMLANSWERPRICES = 'LISTPRICES';
var XMLANSWERINTERNALID = 'INTERNALID';
var XMLANSWERQUANTITY = 'QUANTITY';
var XMLANSWERPRICEQUANTITY = 'PRICEQUANTITY';
var XMLANSWERDESCRIPTION = 'DESCRIPTION';
var XMLANSWERFAMILY = 'FAMILYID';
var XMLANSWERLISTPRICE = 'LISTPRICE';

// XML Errors compilation
var XMLERRORLIST = 'LISTPRICEERRORS';
var XMLERRORITEM = 'ERRORITEM';
var XMLERRORSOURCE = 'ERRORSOURCE';
var XMLERRORMSG = 'ERRORMSG';
var XMLErrors = '';

//outgoing answer
var XMLAnswer = '';			// XML Answer assembled in this

// Order header - dates
var billDate = null;			// extracted date from XML	
var billDateNS = null;			// usable NetSuite Date
var shipDate = null;			// extracted date from XML	
var shipDateNS = null;			// usable NetSuite Date
var ccaDate = null;
var ccaDateNS = null;

var orderNumber = null;
var orderDate = '';
var ordertype = '';

var taxDesc = '';
var patientNumber = null;

// Advantage program parameters
var advantageCCAsequence = 0;
var advantageMin = 0;
var advantageMax = 0;
var advantageType = '';

// Items
var itemsArray = new Array();	// will contain a list of item objects
var itemRecord = null;			// each item
var itemsCount = 0;				// number of items
var typeIntID=0;				// type internal ID
var type = '';					// type text desc

// Addresses
var addressCount = 0;
var billingAddressJDEID = null;
var shippingAddressJDEID = null;
var shipToAddressInternalID = 0;
var shipToCountry='';
var billingAddressCountryID = null;
var shippingAddressCountryID =  null;

// Customer
var customerRecord = new Object();
var customerInternalID = 0;
var customerChannel = null;
var customerARaccount = null;
var entityID = null;
var parentEntityID = null;
var defaultBillingLine = 0;
var defaultBillingCurrency = 0;
var defaultBillingExchangeRate = 0.00;

// Estimate - will be created once all prices calculated
var estimateID = null;
var estimateRecord = new Object();

/***********************************************************************************
 * 
 * 
 * List Price Engine - main sequence
 * 
 * 
 ************************************************************************************/
function listPriceEngine()
{
	var thisListPrice = null;

	// First attempt to load this custom record's XML payload into order
	orderNumber = loadXMLTreefromSalesOrderPayload();

	// If we have an order number can try to process the items and find prices
	if (orderNumber)
	{
		// set up all order related values ready for processing
		initialise();

		//Parse Sales Order XML from TIBCO feed as XML document - MJL
		parseXMLSalesOrder();
		
		// Take each line item in turn and derive the list price
		for ( var thisItem = 1; thisItem <= itemsCount; thisItem++)
		{
			thisListPrice = calculateListPriceItem(thisItem);
			// Add the list price returned to the XML answer if it is present
			// If not, report an error - even a list price of 0.00 should be present
			if (thisListPrice != null)
			{
				addListPriceItemtoXMLAnswer(thisItem, thisListPrice);
			}
			else
			{
				addToErrorsXML("listPriceEngine : " + orderNumber, "Item No. " + thisItem + "/" + itemsCount + " : Missing List Price");
			}
		}	
		
		// Assemble the final answer and post into the record
		completeXMLAnswer();
		
		// Create the estimate record which will trigger the discounts process
		// But only if there are no errors in generating the item(s) ...
		// Write out the XML answer and new estimate id if present
		if (XMLErrors == '')
		{
			estimateID = saveDiscountCalcEstimate();
			saveSalesOrderPriceListXMLPayload();			
		}
	}
}

/*
 * XML tree created from the sales order payload in the user event record, 
 * checks well-formed XML and removes any white space and HTML adornments etc.
 * 
 * - returns the order number if successful
 * 
 */
function loadXMLTreefromSalesOrderPayload()
{
	var returnOrderNumber = null;
	var recordType = '';

	var salesRecordID = 0;
	var salesRecord = null;
	var soRefNo = 0;
	var stagingStatus = '';
	var isVATEnabled = 'F';

	if (debugOn)
	{
		nlapiLogExecution('DEBUG', "loadXMLTreefromSalesOrderPayload()" , "recordType=" + nlapiGetRecordType() + " nlapiGetRecordId()=" + nlapiGetRecordId());
	}

	try
	{
        // Determine whether context is manual sales order or TIBCO feed record UE
        recordType = nlapiGetRecordType();        

		switch (recordType) 
		{
			case 'salesorder':
				salesRecordID = nlapiGetRecordId();
				salesRecord = nlapiLoadRecord(recordType, salesRecordID);
				soRefNo = salesRecord.getFieldValue('tranid');
				isVATEnabled = salesRecord.getFieldValue('custbody_vat_pricedisc_override'); 
				payloadRecordID = genericSearch('customrecord_tibco_order_feed','custrecord_alignbv_ordernumber',soRefNo);
				break;
			
			case 'customrecord_fhlevents':
				stagingRecordID = nlapiGetRecordId();
	
				salesRecordID = nlapiLookupField(recordType, stagingRecordID, 'custrecord_fhle_salesorder'); //2.0.7 MJL
				stagingStatus = nlapiLookupField(recordType, stagingRecordID, 'custrecord_eventsstatus'); //2.0.7 MJL
	
				if (stagingStatus == 'Successful')
				{
					soRefNo = nlapiLookupField('salesorder', salesRecordID, 'tranid');
					payloadRecordID = genericSearch('customrecord_tibco_order_feed','custrecord_alignbv_ordernumber', soRefNo);
				}
				break;
			
			case 'customrecord_tibco_order_feed':
				payloadRecordID = nlapiGetRecordId();
				break;
			
			default:
				break;
		}

		//payloadRecordID = nlapiGetRecordId();
		payloadRecord = nlapiLoadRecord('customrecord_tibco_order_feed', payloadRecordID);

		status = payloadRecord.getFieldValue('custrecord_tibco_order_status');

		XMLSalesOrder = payloadRecord.getFieldValue('custrecord_tibco_order_xmlpayload');
		XMLVATCalc = payloadRecord.getFieldValue('custrecord_alignbv_vatxmlcalc');

		if (debugOn)
		{
			//nlapiLogExecution('DEBUG', "custrecord_tibco_order_xmlpayload" , nlapiEscapeXML(XMLSalesOrder));
			nlapiLogExecution('DEBUG', "custrecord_tibco_order_xmlpayload" , XMLSalesOrder);
		}	
		
		//if (XMLSalesOrder && XMLVATCalc)
		if (XMLSalesOrder)
		{

			// Strip out any unwanted white space, HTML tags from payload Rich Text field
			XMLSalesOrder = XMLSalesOrder.replace(/(\s|<BR>|&nbsp;|<\?xml.*\?>|xmlns.*xsd\"|<P>|<\/P>|<span style=\"font-size: 8pt;\">|<span class=\"Apple-tab-span\" style=\"white-space:pre\">|<\/span>)/gmi, "");
			
			// See if already escaped - if not, escape the text
			if (XMLSalesOrder.indexOf(tagXMLstart) == -1 && XMLSalesOrder.indexOf(tagXMLend) == -1)
			{
				XMLSalesOrder = nlapiEscapeXML(XMLSalesOrder);
			}
				
			//nlapiLogExecution('DEBUG', "nlapiEscapeXML(XMLSalesOrder) ==> ", nlapiEscapeXML(XMLSalesOrder));		

			if (XMLVATCalc)
			{
				// Get the VAT XML - append it to the payload so can be parsed - see below
				XMLVATCalc = XMLVATCalc.replace(/(<BR>|&nbsp;|<P>|<\/P>)/gmi, "");
			}
			
			// Parse into XML tree array, each tree element is an array element of the form :-
			// Node # : Element Name : Parent Element Node # : Number of Children : Inner XML or Data (if children == 0)
			XMLtreeSize = getXMLTree(elementXMLroot, XMLSalesOrder + XMLVATCalc);
			getXMLDocument(XMLSalesOrder, XMLVATCalc); //2.1.0 MJL

			// If a tree exists, the XML has been parsed OK
			if (XMLtree.length > 0)
			{
				returnOrderNumber = getXMLTreeElementDatabyName(XMLORDER);
				
				// Use this code to print out the tree if needed for debugging
				//if (debugOn)
				//{
					//	logXMLTree();
				//}
			}
			else // Bad record - invalid XML
			{ 
				addToErrorsXML("loadXMLSalesOrderPayload", payloadRecordID	+ ": Badly formed XML payload");
			}
		}
		else // Bad record - missing data		
		{
			addToErrorsXML("loadXMLSalesOrderPayload(" + payloadRecordID + ")", payloadRecordID	+ ": Empty XML payload for Order or VAT calculation");
		}
		
		//2.0.6 if override flag is not ticked on manual Sales Order, do not process - MJL
		if (recordType == 'salesorder' && isVATEnabled == 'F')
		{
			returnOrderNumber = null;
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "loadXMLTreefromSalesOrderPayload(" + payloadRecordID + ") ==> " + returnOrderNumber, "XML Nodes = " + XMLtree.length);
		}
	}
	catch (e)
	{
		addToErrorsXML("loadXMLSalesOrderPayload", e);
	}
	return returnOrderNumber;
}

/*
 * 
 * initialise - set up order related values to allow list pricing to be carried out, i.e.
 * 
 * - Number of item(s)
 * - Billing address parameters - country and currency id
 * - Display variables in log if debug enabled
 * 
 */
function initialise()
{
	try
	{
		
        setDeploymentParameters();

        //deprecated for CRP2
        //testAndSetXMLVersion();
		
		// Dates -  use library getDate(...) to convert to NS format date
		orderDate = getXMLTreeElementDatabyName(XMLORDERDATE);
		orderDateNS = convertJDEtoNSdate(orderDate);
		
		shipDate = getXMLTreeElementDatabyName(XMLSHIPDATE);
		shipDateNS = convertJDEtoNSdate(shipDate);
		
		ccaDate = getXMLTreeElementDatabyName(XMLCCADATE);
		ccaDateNS = convertJDEtoNSdate(ccaDate);

		taxDesc = getXMLTreeElementDatabyName(XMLVATDESC);
				
		
		// Advantage program - if not present use empty defaults ...
		advantageMin = getXMLTreeElementDatabyName(XMLADVANTAGEMIN);
		
		if (!advantageMin)
		{
			advantageMin = 0;
		}
			
		advantageMax = getXMLTreeElementDatabyName(XMLADVANTAGEMAX);
		
		if (!advantageMax)
		{
			advantageMax = 0;
		}
			
		advantageCCAsequence = getXMLTreeElementDatabyName(XMLADVANTAGECCASEQUENCE);
		
		if (!advantageCCAsequence)
		{
			advantageMin = 0;
		}
		
		advantageType = getXMLTreeElementDatabyName(XMLADVANTAGETYPE);
		
		if (!advantageType)
		{
			advantageType = '';
		}

		// Patient - varies based on XML version ...
		if (XMLVersion == 1)
		{
			patientNumber = getXMLTreeElementDatabyName(XMLPATIENTNAME) + " (" + getXMLTreeElementDatabyName(XMLPATIENTID) + ")";
		}
		else
		{
			patientNumber = getXMLTreeElementDatabyName(XMLPATIENTFIRSTNAME);
			
			if (getXMLTreeElementDatabyName(XMLPATIENTINITIALS))
			{
				patientNumber += " " + getXMLTreeElementDatabyName(XMLPATIENTINITIALS);
				patientNumber += " " + getXMLTreeElementDatabyName(XMLPATIENTLASTNAME) + " (" + getXMLTreeElementDatabyName(XMLPATIENTID, 1) + ")";
			}
				
		}
		// set the number of item(s) in the order
		itemsCount = getXMLTreeChildNumberbyName(XMLITEMLIST);

		// set the address count and which one is billing address ID
		addressCount = getXMLTreeChildNumberbyName(XMLADDRESSLIST);
		billingAddressJDEID = getBillingAddressJDEID();
		billingAddressCountryID = getAddressElement('BILLTO', XMLADDRESSCOUNTRY);
		shippingAddressJDEID = getAddressJDEID('SHIPTO');
		shippingAddressCountryID = getAddressElement('SHIPTO', XMLADDRESSCOUNTRY);
		shipToAddressInternalID = genericSearch('customer', 'entityid', shippingAddressJDEID);
		
		// the Customer record is loaded for general use throughout code
		customerRecord = getAlignCustomerRecord(billingAddressJDEID);
		customerInternalID = genericSearch('customer', 'entityid', billingAddressJDEID);
		customerChannel = customerRecord.getFieldText('custentity_channel');
		entityID = customerRecord.getFieldText('entityid');
		parentEntityID = customerRecord.getFieldText('parent');

		// Derive currency and exchange rate from the billing address line
		defaultBillingLine = customerRecord.findLineItemValue('addressbook', 'defaultbilling', 'T');
		defaultBillingCountry = customerRecord.getLineItemValue('addressbook', 'country', defaultBillingLine);
		
		if (billingAddressCountryID)
 		{
			defaultBillingCurrency = getAlignCountryCurrency(billingAddressCountryID);
			defaultBillingExchangeRate = nlapiLookupField('currency', defaultBillingCurrency, 'exchangerate');
		} 
		else
		{
			addToErrorsXML("initialise", "Missing Billing Address - JDEID :" + billingAddressJDEID);
		}

		if (debugOn)
		{
			logVariables();
		}
	}
	catch (e)
	{
		addToErrorsXML("initialise", e);
	}
}

/*
 * Look for deployment parameters and set up variables / switches accordingly
 * No input / output to this function
 */
function setDeploymentParameters()
{
	try
	{
		if (nlapiGetContext().getSetting('SCRIPT', 'custscript_pricelist_debugtrace') == 'T')
		{
			debugOn = true; 
		}
		else
		{
			debugOn = false; 
		}
	}
	catch (e)
	{
		errorHandler("setDeploymentParameters", e);
	}
}

/*
 * Main function to perform list price lookup
 * 
 * Input parameter - thisItem = the index of the item in this order / XML array - first = 1
 * 
 * Actions:
 * - Obtain tax code from VAT XML Answer (must be present)
 * - Obtain the item code (SKU) (must be present)
 * - Lookup the item record by NetSuite internal ID
 * - Build the item object from item details
 * - Store the item details in an array object - to be processed into XML and Estimate record
 * - Look up the item:country code combination for price (billing country)
 * 
 * Returns - the list price xx.xx or null if not found
 */
function calculateListPriceItem(thisItem)
{
	// The return price value
	var returnListPriceItem = null;
	
	var thisItemCode = null;
	var thisItemQuantity = null;
	var thisItemIsInvoiced = 'F';
	var thisItemTransferZeroOverride = 'F';
	var itemObj = new Object();
	
	
	var taxItem = null;
	var taxItemID = 0;
	
	// Obtain the correct tax code and it's corresponding internal ID
	// Default to INT if not a vaild code - during development use only !!!!
	taxItem = getXMLTreeElementDatabyName(XMLVATCODE, thisItem); // From VAT answer
	
	if (taxItem != 'INT' && (taxItem == null || taxItem.indexOf('-') == -1))
	{
		taxItem = 'INT';
	}
	
	taxItemID = genericSearch('salestaxitem', 'name', taxItem);

	try
	{
		// Get the particular line item code / part no. from the XML nodes array
		thisItemCode = getXMLTreeElementDatabyName(XMLITEMCODE, thisItem);
		
		if (thisItemCode)
		{
			// Cross reference from the item id to the internal id and load item record
			// Take item values required for answer assembly and store in item(s) array
			itemID = genericSearch('noninventoryitem', 'itemid', thisItemCode);
			itemRecord = nlapiLoadRecord('noninventoryitem', itemID);			
			
			if (itemRecord)
			{	
				// Whether the item will be invoiced - if 'F' will not create an estimate line item ...
				thisItemIsInvoiced = itemRecord.getFieldValue('custitem_alignbv_to_invoice');	
				thisItemTransferZeroOverride = itemRecord.getFieldValue('custitem_alignbv_transferprice_zero');	
				
				// The quantity supplied in the TIBCO feed record for this item
				thisItemQuantity = getXMLTreeElementDatabyName(XMLITEMQUANTITY, thisItem);
				
				itemObj.invoiced = thisItemIsInvoiced;
				itemObj.internalid = itemID;
				itemObj.itemid = thisItemCode;
				itemObj.quantity = thisItemQuantity;
				
				// Deprecated during CRP1 - use local description, not one supplied via TIBCO
				// itemObj.description = getXMLTreeElementDatabyName(XMLITEMDESCRIPTION, thisItem);
				itemObj.description = itemRecord.getFieldValue('displayname');
				itemObj.taxcode = taxItemID; // From VAT answer
				itemObj.family = itemRecord.getFieldValue('class');
				itemObj.upperstage = getXMLTreeElementDatabyName(XMLITEMUPPERSTAGE, thisItem);
				itemObj.lowerstage = getXMLTreeElementDatabyName(XMLITEMLOWERSTAGE, thisItem);
				itemObj.transferprice = getXMLTreeElementDatabyName(XMLITEMTRANSFERPRICE, thisItem);			
			
				// See whether the transfer price is zero and the item override flag is T
				// If both true, set price to zero and skip pricing
				if (thisItemTransferZeroOverride == 'T' && itemObj.transferprice == 0)
				{
					itemObj.listprice = 0.00;
					itemObj.pricequantity = thisItemQuantity;	
					returnListPriceItem = listPriceItemObj.price;
				}
				else
 				{
					// Work out the correct price for this product & quantity
					// (separate function)
					// Returns an object with the price / quantity to use on
					// Estimate / Order
					// Note : the quantity input may not match the value
					// returned based on Q/B type
					listPriceItemObj = getListPriceForItemQuantity(thisItemCode, thisItemQuantity);

					// If return is -1 the price is not found
					if (listPriceItemObj.price != -1) 
					{
						itemObj.listprice = listPriceItemObj.price;
						itemObj.pricequantity = listPriceItemObj.quantity;
						returnListPriceItem = listPriceItemObj.price;
					}
					else
					{
						itemObj.listprice = null;
						addToErrorsXML("calculateListPriceItem : " + thisItem + "/" + itemsCount, "Missing List Price record for item : " + thisItemCode);
					}
				}
				itemsArray[thisItem-1] = itemObj;
			}
			else // Cannot find / load the NetSuite item
			{
				addToErrorsXML("calculateListPriceItem : " + thisItem + "/" + itemsCount, "Missing Item Record : " + itemID);
			}
		}
		else // No XMLITEMCODE present
		{
			addToErrorsXML("calculateListPriceItem : " + thisItem + "/"	+ itemsCount, "Missing XML data element : " + XMLITEMCODE);
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "calculateListPriceItem(" + thisItem + "/" + itemsCount + ") ==> " + returnListPriceItem, "thisItemIsInvoiced=[" + thisItemIsInvoiced + "] ItemCode=[" + thisItemCode + "] taxItem=[" + taxItem + "] taxItemID=[" + taxItemID + "]");
		}
	}
	catch (e)
	{
		addToErrorsXML("calculateListPriceItem", e);
	}
	return returnListPriceItem;
}

/*
 * Get the right List price based on the Part No., Billing Country, Order Date, Quantity
 * Billing Country, Order Date are defined globally
 * Part No., Quantity are passed in as parameters on each line item call
 * 
 * Returns : List price (currency( or null if not found
 * 
 */
function getListPriceForItemQuantity(itemCode, quantity)
{
	var returnListPriceObj = new Object();
	returnListPriceObj.price = -1.00;
	returnListPriceObj.quantity = 0;
	returnListPriceObj.name = 'Not found';

	var listPriceTrace = '';
	var ItemCountryCode = itemCode + ':' + billingAddressCountryID;
	// Order UTC from midnight 1 Jan 1970 so we can numerically compare with list price dates
	var orderDateObj = nlapiStringToDate(orderDateNS);
	//var orderDateUTC = parseInt(Date.parse(orderDateNS));
	var orderDateUTC = parseInt(orderDateObj.getTime());
	
	//Item quantity calculations are based on Align's Item Type coding
	var itemPriceType = ''; // If the item is 'Q' the quantity
	var itemPriceDate = ''; // UTC of each price start date
	var itemPriceDateObj = new Object();
	var itemPriceDateUTC = null; // UTC of each price start date
	var itemPrice = 0.00;
	var prevPriceDateUTC = 0;
	var itemQty = parseInt(quantity);
	var itemQtyPrice = 0;
	var itemQtyMin = 0;
	var itemQtyMax = 0;

	var searchPriceFilters = new Array();
	var searchPriceColumns = new Array();
	var searchPriceResults = null;
	var searchPriceResultRow = null;
	
	try
	{
		// searchPrice filter to identify the part no and country code price list
		// Note: Append ':' to country code to ensure country unique e.g. ES: is different from ES1:
		searchPriceFilters[0] = new nlobjSearchFilter('name', null, 'contains', ItemCountryCode + ":");                          
		// return columns
		searchPriceColumns[0] = new nlobjSearchColumn('internalid');
		searchPriceColumns[1] = new nlobjSearchColumn('externalid');
		searchPriceColumns[2] = new nlobjSearchColumn('name');
		searchPriceColumns[3] = new nlobjSearchColumn('custrecord_alignbv_price_country');
		searchPriceColumns[4] = new nlobjSearchColumn('custrecord_alignbv_price_itemid');
		searchPriceColumns[5] = new nlobjSearchColumn('custrecord_alignbv_pricestartdate');
		searchPriceColumns[6] = new nlobjSearchColumn('custrecord_alignbv_price_type');
		searchPriceColumns[7] = new nlobjSearchColumn('custrecord_alignbv_price_price');
		searchPriceColumns[8] = new nlobjSearchColumn('custrecord_alignbv_price_min_qty');
		searchPriceColumns[9] = new nlobjSearchColumn('custrecord_alignbv_price_max_qty');
		
		// Sorting by name descending ensures the most recent 
		// start date is the first in any list of prices
		searchPriceColumns[10] = searchPriceColumns[2].setSort(true);

		// perform searchPrice
		searchPriceResults = nlapiSearchRecord('customrecord_alignbv_listprice', null, searchPriceFilters, searchPriceColumns);

		// Add criteria to trace
		listPriceTrace += '<tr><td>Criteria:</td><td>Part</td><td>' + itemCode + '</td><td>Country Code</td><td>' + ItemCountryCode + '</td><td>Quantity</td><td colspan="3">' + quantity + '</td><td>Date</td><td colspan="2">' + orderDateNS + '</td><td>orderDateUTC</td><td colspan="2">' + orderDateUTC + '</td></tr>';

		if (searchPriceResults)
		{
			for (var lprice=0; lprice<searchPriceResults.length; lprice++)
			{
				searchPriceResultRow = searchPriceResults[ lprice ];
				itemPriceType = searchPriceResultRow.getValue('custrecord_alignbv_price_type'); // If the item is 'Q' the quantity
				itemQtyMin = parseInt(searchPriceResultRow.getValue('custrecord_alignbv_price_min_qty'));
				itemQtyMax = parseInt(searchPriceResultRow.getValue('custrecord_alignbv_price_max_qty'));
				itemPrice = searchPriceResultRow.getValue('custrecord_alignbv_price_price');
				itemPriceDate = searchPriceResultRow.getValue('custrecord_alignbv_pricestartdate');
				itemPriceDateObj = nlapiStringToDate(itemPriceDate);
				itemPriceDateUTC = parseInt(itemPriceDateObj.getTime());
				//itemPriceDateUTC = parseInt(Date.parse(itemPriceDate));

				listPriceTrace += '<tr><td>Row</td><td>' + lprice + '</td><td>itemPriceType</td><td>' + itemPriceType + '</td><td>itemQtyMin</td><td>' + itemQtyMin + '</td><td>itemQtyMax</td><td>' + itemQtyMax + '</td><td>itemPriceDate</td><td>' + itemPriceDate + '</td><td>itemPriceDateUTC</td><td>' + itemPriceDateUTC + '</td><td>prevPriceDateUTC</td><td>' + prevPriceDateUTC + '</td><td>itemPrice</td><td>' + itemPrice + '</td></tr>';

				// Examine whether the pricing record matches the quantity and date bands parameters
				// Quantity is between Min and Max, order date on or after start date, and this start date on or after previous
				// if (itemQty >= itemQtyMin && itemQty <= itemQtyMax && orderDateUTC >= itemPriceDateUTC && prevPriceDateUTC <= itemPriceDateUTC){
				if (itemQty >= itemQtyMin && itemQty <= itemQtyMax && orderDateUTC >= itemPriceDateUTC && prevPriceDateUTC == 0)
				{	
					// If type == 'B' then ignore quantity simply set to 1
					itemQtyPrice = itemQty;
					
					if (itemPriceType == 'B')
					{
						itemQtyPrice = 1;
					}
					
					returnListPriceObj.price = parseFloat(itemPrice);
					returnListPriceObj.quantity = itemQtyPrice;
					returnListPriceObj.name = searchPriceResultRow.getValue('name');
					prevPriceDateUTC = itemPriceDateUTC;
				}
								
			}
			
			if (debugOn)
			{
				nlapiLogExecution('DEBUG', "getListPriceForItemQuantity : "	+ returnListPriceObj.name, "QtyinTIBCOfeed=" + itemQty + " QtyforPrice=" + returnListPriceObj.quantity + " Price="	+ returnListPriceObj.price);
			}
			
			if (returnListPriceObj.price == -1.00)
			{
				listPriceTrace =  "<table style='font-size: 3mm;'>" + listPriceTrace + "</table>";
				nlapiLogExecution('DEBUG', "getListPriceForItemQuantity : "	+ returnListPriceObj.name + " == null : Error trace table", listPriceTrace);
			}		
		}
	}
	catch(e)
	{
		addToErrorsXML("getListPriceForItemQuantity : " + itemCode + " : " + quantity, e);
	}
	return returnListPriceObj;
}

/*
 * Assemble an answer in the XML response string
 */
function addListPriceItemtoXMLAnswer(thisItem, thisListPrice)
{
	var thisListPriceItemXML = '';
	var answerObj = itemsArray[thisItem - 1];	

	try
	{
		// Assemble the item answer code / list price elements
		// First add an index for the line of the item
		thisListPriceItemXML += createTaggedXML(XMLANSWERITEMINDEX,	thisItem);
		
		// Is item invoiced?
		thisListPriceItemXML += createTaggedXML(XMLANSWERINVOICED, answerObj.invoiced);
		
		// Item code e.g. 8005
		thisListPriceItemXML += createTaggedXML(XMLITEMCODE, getXMLTreeElementDatabyName(XMLITEMCODE, thisItem));
		
		// Description e.g. Invisalign Full
		thisListPriceItemXML += createTaggedXML(XMLANSWERDESCRIPTION, answerObj.description);		
		
		// NetSuite internal Id - for faster lookups etc.
		thisListPriceItemXML += createTaggedXML(XMLANSWERINTERNALID, answerObj.internalid);
		
		// Quantity in TIBCO feed
		thisListPriceItemXML += createTaggedXML(XMLANSWERQUANTITY, answerObj.quantity);
		
		// Quantity to be put in Estimate line item
		thisListPriceItemXML += createTaggedXML(XMLANSWERPRICEQUANTITY,	answerObj.pricequantity);
		
		// Product family - for possible use in discounts etc.
		thisListPriceItemXML += createTaggedXML(XMLANSWERFAMILY, answerObj.family);
		
		// The list price (in local currency - the currency ID is in XML body
		thisListPriceItemXML += createTaggedXML(XMLANSWERLISTPRICE,	answerObj.listprice.toFixed(2));

		// Add the outer line item wrapper XML
		thisListPriceItemXML = createTaggedXML(XMLITEM, thisListPriceItemXML);

		// Finally append to the existing answer(s) list
		XMLAnswer += thisListPriceItemXML;
	}
	catch (e)
	{
		addToErrorsXML("addListPriceItemtoXMLAnswer", e);
	}
}

/*
 * This function simply completes the Answer tags ready for updating the TIBCO record
 */
function completeXMLAnswer()
{
	// Put the item answer(s) into a list wrapper
	XMLAnswer = createTaggedXML(XMLANSWERPRICES, XMLAnswer);
	
	// Add the exchange rate tag
	XMLAnswer = createTaggedXML(XMLANSWEREXCHANGERATE,  parseFloat(defaultBillingExchangeRate).toFixed(6)) + XMLAnswer;
	
	// Add the currency tag
	XMLAnswer = createTaggedXML(XMLANSWERCURRENCY, defaultBillingCurrency) + XMLAnswer;
	
	// Complete the answer with outermost wrapper tag
	XMLAnswer = createTaggedXML(XMLANSWER, XMLAnswer);
}

/*
 * Populate all the TIBCO XML payload fields and submit updates
 * Returns - the internal ID of the record being updated
 */
function saveSalesOrderPriceListXMLPayload()
{
	var returnSubmitID = null;

	try
	{
		payloadRecord.setFieldValue('custrecord_alignbv_listprice_xmlcalc', XMLAnswer);
		payloadRecord.setFieldValue('custrecord_alignbv_listprice_xmlerrors', XMLErrors);
		payloadRecord.setFieldValue('custrecord_alignbv_ordernumber', orderNumber);
		payloadRecord.setFieldValue('custrecord_tibco_order_status', status);
		
		//Check whether an estimate was created
		if (estimateID)
		{
			payloadRecord.setFieldValue('custrecord_tibco_order_estimate_lookup', estimateID);
		}

		returnSubmitID = nlapiSubmitRecord(payloadRecord, true);
	}
	catch(e)
	{
		addToErrorsXML("saveSalesOrderPriceListXMLPayload", e);
	}
	
	return returnSubmitID;
}

function saveDiscountCalcEstimate()
{
	var returnEstimateID = null;
	var estimateObj = null;
	
	var thisItemObj = new Object(); 
	
	try
	{
		estimateObj = nlapiCreateRecord('estimate');
		
		estimateObj.setFieldValue('customform', 111);
		estimateObj.setFieldValue('subsidiary', 2);
		estimateObj.setFieldValue('trandate', orderDateNS);
		estimateObj.setFieldValue('shipdate', shipDateNS);		
		estimateObj.setFieldValue('custbody_alignbv_cca_date', ccaDateNS);		
		estimateObj.setFieldValue('custbody_alignbv_taxengine_description', taxDesc);		
		estimateObj.setFieldValue('tranid', orderNumber);
		estimateObj.setFieldValue('custbody_alignbv_order_number', orderNumber);	
		estimateObj.setFieldValue('custbody_alignbv_order_date', orderDateNS);	
		estimateObj.setFieldValue('expectedclosedate', orderDateNS);
		estimateObj.setFieldValue('entity', customerInternalID);
		estimateObj.setFieldValue('custbody_alignbv_advantage_min', advantageMin);
		estimateObj.setFieldValue('custbody_alignbv_advantage_max', advantageMax);
		estimateObj.setFieldValue('custbody_alignbv_advantage_type', advantageType); 
		estimateObj.setFieldValue('custbody_patientnumber', patientNumber);
		estimateObj.setFieldValue('custbody_alignbv_billing_region', genericSearch('customrecord_alignbv_eucountry','name', billingAddressCountryID));
		estimateObj.setFieldValue('custbody_alignbv_shipping_region', genericSearch('customrecord_alignbv_eucountry','name', shippingAddressCountryID));
		
		// Examine each line item array object in turn, assemble the line
		for (var thisItem = 0; thisItem < itemsArray.length; thisItem++)
		{
			thisItemObj = itemsArray[thisItem];
			
			//Note: Test for invoiced T/F was deprecated 23/05/2013
			//during CRP1 testing and discussions but left in for now
			//Only add if the line item should be invoiced ....			
			//if (thisItemObj.invoiced == 'T')
			//{
				//Add a new line item
				estimateObj.selectNewLineItem('item');

				// set the item and location values on the currently selected line
				estimateObj.setCurrentLineItemValue('item', 'item', thisItemObj.internalid);
				estimateObj.setCurrentLineItemValue('item', 'quantity', thisItemObj.pricequantity);
				estimateObj.setCurrentLineItemValue('item', 'rate', thisItemObj.listprice);
				estimateObj.setCurrentLineItemValue('item', 'description', thisItemObj.description);
				estimateObj.setCurrentLineItemValue('item', 'taxcode', thisItemObj.taxcode);

				// set custom fields for stages and aligners
				estimateObj.setCurrentLineItemValue('item', 'custcol_alignbv_upperstage', thisItemObj.upperstage);
				estimateObj.setCurrentLineItemValue('item', 'custcol_alignbv_lowerstage', thisItemObj.lowerstage);
				estimateObj.setCurrentLineItemValue('item', 'custcol_alignbv_number_of_aligners', thisItemObj.quantity);

				// commit the new line to the reccord
				estimateObj.commitLineItem('item');
			//} // Test for invoiced T/F
		}
		
		// Submit the record
		returnEstimateID = nlapiSubmitRecord(estimateObj, false);
		estimateObj = nlapiLoadRecord('estimate', returnEstimateID);
		
		// Check the record exists and update memo to trigger user event / discounts engine
		if (estimateObj)
		{
			/*
			// Deprecated - temporary method to trigger discounts engine
			// ***** Remove once development completed *****
            var params = new Array();
            params['custparam_estimateid'] = returnEstimateID; 
            params['custparam_payloadid'] = payloadRecordID;

			nlapiSetRedirectURL('SUITELET', 'customscript_trigger_estimate_ue', 'customdeploy_trigger_estimate_ue', false, params);
			*/
			
			estimateObj.setFieldValue('memo', "TIBCO payload ID:" + payloadRecordID + " Estimate ID:" + returnEstimateID);
			returnEstimateID = nlapiSubmitRecord(estimateObj, false);
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "saveDiscountCalcEstimate(" + orderNumber + ") ==> " + returnEstimateID,	"Item(s) subtotal = " + estimateObj.getFieldValue('subtotal'));
		}
	}
	catch(e)
	{
		addToErrorsXML("saveDiscountCalcEstimate", e);
	}
	return returnEstimateID;
}

/*
 * Dump out the variables in a table in execution log
 */ 
function logVariables()
{
	nlapiLogExecution('DEBUG', "initialise() order ==> " + orderNumber,
			"<table style='font-size: 3mm;'><tr><td>itemsCount</td><td>"
					+ itemsCount + "</td></tr>"
					+ "<tr><td>orderDateNS</td><td>" + orderDateNS
					+ "</td></tr>"					
					+ "<tr><td>shipDateNS</td><td>" + shipDateNS
					+ "</td></tr>"					
					+ "<tr><td>ccaDateNS</td><td>" + ccaDateNS
					+ "</td></tr>"					
					+ "<tr><td>addressCount</td><td>" + addressCount
					+ "</td></tr>" 					
					+ "<tr><td>advantageMax</td><td>" + advantageMax
					+ "</td></tr>" 
					+ "<tr><td>advantageMin</td><td>" + advantageMin
					+ "</td></tr>" 
					+ "<tr><td>advantageType</td><td>" + advantageType
					+ "</td></tr>" 
					+ "<tr><td>billingAddressJDEID</td><td>"
					+ billingAddressJDEID + "</td></tr>"
					+ "<tr><td>shippingAddressJDEID</td><td>"
					+ shippingAddressJDEID + "</td></tr>"
					+ "<tr><td>billingAddressCountryID</td><td>"
					+ billingAddressCountryID + "</td></tr>"
					+ "<tr><td>shippingAddressCountryID</td><td>"
					+ shippingAddressCountryID + "</td></tr>"
					+ "<tr><td>customerInternalID</td><td>"
					+ customerInternalID + "</td></tr>"
					+ "<tr><td>customerChannel</td><td>"
					+ customerChannel + "</td></tr>"
					+ "<tr><td>customerARaccount</td><td>"
					+ customerARaccount + "</td></tr>"
					+ "<tr><td>defaultBillingLine</td><td>"
					+ defaultBillingLine + "</td></tr>"
					+ "<tr><td>defaultBillingCountry</td><td>"
					+ defaultBillingCountry + "</td></tr>"
					+ "<tr><td>defaultBillingExchangeRate</td><td>"
					+ defaultBillingExchangeRate + "</td></tr>"
					+ "<tr><td>defaultBillingCurrency</td><td>" 
					+ defaultBillingCurrency + "</td></tr>" + "</table>");
}

/*
 * For any order, find the first (and should be only) occurence of the billing
 * address ID
 */
function getBillingAddressJDEID() 
{
	var returnBillingJDEID = null;

	try 
	{
		// the billing / sell to country for the order
		// need to cycle through address(es) to find the right JDE ID
		for ( var thisAddress = 1; thisAddress <= addressCount; thisAddress++) 
		{
			if (getXMLTreeElementDatabyName(XMLADDRESSTYPE, thisAddress) == 'BILLTO') 
			{
				returnBillingJDEID = getXMLTreeElementDatabyName(XMLJDEID, thisAddress);
			}
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "getBillingAddressJDEID() ==> " + returnBillingJDEID, "XML Address Count = " + addressCount);
		}
	} 
	catch (e) 
	{
		addToErrorsXML("getBillingAddressJDEID", e);
	}
	
	return returnBillingJDEID;
}

/*
 * Find the JDEID in the address list of a give type e.g. BILLTO, SHIPTO ...
 */
function getAddressJDEID(addressType)
{
	var returnAddressJDEID = null;

	if (!addressType)
	{
		addressType = 'BILLTO';
	}
	
	try
	{
		// need to cycle through address(es) to find the right JDE ID for the type
		for (var thisAddress = 1; thisAddress <= addressCount; thisAddress++) 
		{
			if (getXMLTreeElementDatabyName(XMLADDRESSTYPE, thisAddress) == addressType)
			{
				returnAddressJDEID = getXMLTreeElementDatabyName(XMLJDEID, thisAddress);
			}
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "getAddressJDEID(" + addressType + ") ==> " + returnAddressJDEID, "XML Address Count = " + addressCount);
		}
	} 
	catch (e)
	{
		addToErrorsXML("getAddressJDEID", e);
	}
	
	return returnAddressJDEID;
}

/*
 * Perform a lookup of the Advantage program table to set the 
 * correct ID for this order based on AEC / ANC / LPC rules
 */
function getAdvantageProgramID()
{
	// Local variables to perform search and return any record ID found
	var returnProgramID = null;
	var programSearchFilters = new Array();
	var programSearchColumns = new Array();

	var programSearchResults = null;
	try
	{
		var customerLookupExpression = new Array('custrecord_alignbv_order_coupon_lookup', 'anyof', '@NONE@');
		programSearchFilters.push(customerLookupExpression);

		var entityCriteria = new Array();
		var entityChildCriteria = new Array('entity', 'anyof', entityID);
		entityCriteria.push(entityChildCriteria);

		if (parentEntityID)
		{
			entityCriteria.push('or');
			var entityParentCriteria = new Array('entity', 'anyof', parentEntityID);
			entityCriteria.push(entityParentCriteria);
		}

		if (entityCriteria)
		{
			programSearchFilters.push('and');
			programSearchFilters.push(entityCriteria);
		}

		// perform search
		programSearchResults = nlapiSearchRecord('customrecord_advantage_datafeed', null, programSearchFilters, programSearchColumns);

		if(programSearchResults != null)
		{
			if(programSearchResults.length>0)
			{
				var programSearchResult = programSearchResults[0];
				returnCouponID = programSearchResult.getValue('internalid');
			}
		}

	}
	catch(e)
	{
		errorHandler("getAdvantageProgramID", e);
	}     	      

	return returnProgramID;
}

/*
 * Convert to DD/MM/YYYY MM/DD/YYYY etc. 
 * Based on NetSuite preferences for date format
 */
function convertJDEtoNSdate(theJDEDate)
{
	var returnNSdate = '';
	var dateSeparator = '/';

	var JDEdateSeparator = '-';
	var JDEyear = '';
	var JDEmonth = '';
	var JDEday = '';
	
	var NSdateFormat = null;
	var NSprefsDateArray = new Array();

	// First obtain the particular date implementation 
	// from the Company General preferences tab / date format
	try 
	{
		companyPrefs.getFieldValue('dateformat');
		NSSeparatorTypes = ("/,-,.").split(',');
		
		for (var NStype = 0; NStype < NSSeparatorTypes.length; NStype++)
		{
			if (NSdateFormat.indexOf(NSSeparatorTypes[NStype]) > 0)
			{
				dateSeparator = NSSeparatorTypes[NStype];
				break;
			}
		}
		
		NSprefsDateArray = NSdateFormat.split(dateSeparator);
	} 
	catch (e)
	{
		addToErrorsXML('Parsing date preference into NSprefsDateArray', e);
	}
	
	
	try
	{
		if(theJDEDate)
		{
			if(theJDEDate.length == 10) // Must be YYYY-MM-DD
			{		
				var JDEdateArray = theJDEDate.split(JDEdateSeparator);
				JDEyear = JDEdateArray[0];
				JDEmonth = JDEdateArray[1];
				
				// Have to remove any leading 0's to avoid parseInt treating as octal
				// e.g. '09' ==> '9', if parseInt('09') will fail with NaN as over 8 ....
				if (JDEmonth.substring(0, 1) == '0')
				{
					JDEmonth = JDEmonth.substring(1);
				}
					
				JDEday = JDEdateArray[2];
				
				if (JDEday.substring(0, 1) == '0')
				{
					JDEday = JDEday.substring(1);
				}
					
				if (JDEdateArray.length == 3 && NSprefsDateArray.length == 3) // Must be MM/DD/YYYY
				{
					for (var dateField = 0; dateField < 3; dateField++)
					{
						if (returnNSdate)
						{
							returnNSdate += dateSeparator;
						}
							
						switch (NSprefsDateArray[dateField]) 
						{
							case 'YYYY':
								returnNSdate += JDEyear.toString();
								break;
							case 'MM':
								returnNSdate += JDEmonth;
								break;
							case 'DD':
								returnNSdate += JDEday;
								break;
						}
					}

					if (debugOn)
					{
						nlapiLogExecution('DEBUG', "convertJDEtoNSdate(" + theJDEDate + ") ==> " + returnNSdate, "dateformat = " + NSdateFormat + " dateSeparator = [" + dateSeparator + "] JDEyear = [" + JDEyear + "] JDEmonth = [" + JDEmonth + "] JDEday = [" + JDEday + "]");
					}
				}			
			}
		}
	}
	catch(e)
	{
		addToErrorsXML('convertJDEtoNSdate', e);
	}
	
	return returnNSdate;
	
}
/*
 * Find the JDEID in the address list of a give type e.g. BILLTO, SHIPTO and Element Tag e.g. COUNTRY ...
*/
function getAddressElement(addressType, XMLAddrElementTag)
{
	var returnAddressElement = null;
	
	try
	{
		
		if (addressType == '' || addressType == null)
		{
			addressType = 'BILLTO';
		}
		
		// need to cycle through address(es) to find the right JDE ID for the type
		for (var thisAddress = 1; thisAddress <= addressCount; thisAddress++)
		{
			if (getXMLTreeElementDatabyName(XMLADDRESSTYPE, thisAddress) == addressType)
			{
				returnAddressElement = getXMLTreeElementDatabyName(XMLAddrElementTag, thisAddress);
				break;
			}
		}
		
		if (debugOn)
		{
			nlapiLogExecution('DEBUG', "getAddressElement(" + addressType + ", " + XMLAddrElementTag +") ==> " + returnAddressElement, "XML Address No. = " + thisAddress);
		}
	} 
	catch (e)
	{
		addToErrorsXML("getAddressElement", e);
	}
	return returnAddressElement;
}

/*
 * Compile the error XML as encountered and write to record
 * Wrapper to errorHandler library function
 */
function addToErrorsXML(errorSource, errorDesc)
{
	var XMLErrorItem = '';
	
	try
	{
		XMLErrorItem = createTaggedXML(XMLERRORSOURCE, errorSource);
		XMLErrorItem += createTaggedXML(XMLERRORMSG, errorDesc);
		XMLErrors += createTaggedXML(XMLERRORITEM, XMLErrorItem);
		nlapiSubmitField('customrecord_tibco_order_feed', payloadRecordID, 'custrecord_alignbv_listprice_xmlerrors', addBRToXML(createTaggedXML(XMLERRORLIST, XMLErrors)), false);
		status = 'Failed';
		
		// Now call the library
		errorHandler(errorSource, errorDesc);
	}
	catch(e)
	{
		errorHandler("addToErrorsXML", e);
	}

}

// For compatibility with string-based XML parsing
function addBRToXML(theXML)
{
	return theXML.replace(tagXMLendChar + tagXMLstartChar, tagXMLendChar + '<BR>' + tagXMLstartChar);
}

/*
 * Temporary function whilst transfer to new XML format under way 
 * to keep testing running on old version in parallel
 */
function testAndSetXMLVersion()
{
	var testXMLtag = "COUNTRYCODE";
	var returnVersionNumber = 2;
	
	if (!getXMLTreeElementDatabyName(testXMLtag))
	{
		XMLVersion = 1;
		returnVersionNumber = 1;
		XMLITEMCODE = 'PART';
		XMLITEMUPPERSTAGE = 'UPPERSTAGE';
		XMLITEMLOWERSTAGE = 'LOWERSTAGE';
		XMLJDEID = 'JDEID';
		XMLADDRESSCOUNTRY = 'COUNTRY';
		XMLADDRESSLINE = 'ADDRESS';
		XMLADVANTAGEMIN = 'ADVANTAGEMIN';
		XMLADVANTAGEMAX = 'ADVANTAGEMAX';
		XMLADVANTAGETYPE = 'ADVANTAGETYPE'; // Note missing 'E' from the tag as supplied ...!

	}
	return returnVersionNumber;
}
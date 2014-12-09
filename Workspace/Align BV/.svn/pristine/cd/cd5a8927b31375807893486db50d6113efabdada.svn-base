/*************************************************************************************
 * Name:		VATEngine.js
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 1st release 19/2/2013 JM
 * 				2.0.0 cope with new XML tag variants 
 * 				2.0.1 use netsuite xml api 20/5/2013 - MJL 
 * 				2.0.2 - 23 May 2013 - check if VAT flag is checked - MJL
 * 				2.0.3 - 30 May 2013 - removed code re: old XML spec - MJL
 *  			2.0.4 - 03 Jun 2013 - add check for deployment on Staging record - MJL
 *  			2.0.5 - 04 Jun 2013 - changed if statement to switch statement - MJL
 *  			2.0.6 - 04 Jun 2013 - if override flag is not ticked on manual Sales Order, do not process - MJL
 *  			2.0.7 - 05 Jun 2013 - changed nlapiLookupField to get staging record status and sales order ID
 * 		 			  				  to overcome double-looping issue - MJL 
 *  			2.0.8 - 05 Jun 2013 - removed VAT Reg validity check SOAP service calls (moved to VATSweep.js)
 * 
 * Author:		FHL
 * 
 * Purpose:		Calculate VAT Code
 * 
 * Script: 		customscript_usereventvatengine
 * Deploy: 		customdeploy_usereventvatengine 		(TIBCO Order Feed)
 * 				customdeploy_so_vatengine				(Sales Order)
 * 				customdeploy_eventsstaging_vatengine 	(Events)
 * 				
 * 
 * Notes:		incoming payload derived from customrecord_tibco_order_feed CRS	
 * 				
 * 				Test Customer record: 192273 Euro Dental Care
 * 
 * 				Test Item records: 8563 & 8523 (VAT Engine testing)
 * 					  			   Create SO Item (Event Engine testing)
 * 
 * 				Test TIBCO records: 933 (General all-purpose testing)
 * 									1705 (Testing of Events Engine)
 *	 								1810 (General all-purpose testing)	
 * 
 * Bugs/issues	[TODO] Payloads are processed despite a non-empty status
 * 
 * Library: 	library.js
 *************************************************************************************/

var VATRule = false;


//incoming record + payload
var payloadRecordID = 0;		// incoming record ID
var payloadRecord = null;		// incoming record
var XMLSalesOrder = '';			// XML Order Payload
var status = '';				// has this already been processed
var orderElement = '';
var xmldoc = null;				// Payload in NS XML format

//header
var shipDate = null;			// extracted date from XML	
var shipDateNS = null;			// usable NetSuite Date
var orderDate = null;
var ccaDate = null;
var ordertype = '';
var pickNextCountry = false;
var billToAddressBlock = false;
var billToCustomerID = '';
var shipToCountry='';
var billToCountry = '';
var shipToCountryInternalID = 0;
var shipToEU = 'F';
var VATNumber = '';
var VATNoPresent = 'T';
var customerID = '';

//vat validation
var vatOverride = 'F';
var vatValid = 'F';
var soapRequest = '';
var serviceURL = '';
var headers = new Array();

//items
var itemsArray = new Array();	// will contain a list of item objects
var itemObj = new Object();		// each item
var itemsCount = 0;				// number of items
var orderSplit = null;			// array for splitting xml out
var orderSplitLines = 0;		// number if lines in split array
var typeIntID=0;				// type internal ID
var type = '';					// type text desc

//XML VAT Calc answer
var XMLVatCalc = '';
var tagXMLstart = "&lt;";
var tagXMLend = "&gt;";
var VATNumberToGoOnInvoiceINTID = 0;
var VATNumberToGoOnInvoice = '';
var VATTextToGoOnInvoice = '';

//XML VAT Error
var XMLError = '';
var successDesc  = 'Successful';

var VATCode = '';
var VATRate = 0;
var VATScheduleSearchResults = null;
var VATScheduleSearchResult = null;

/***********************************************************************************
 * 
 * 
 * VAT Engine
 * 
 * 
 ************************************************************************************/

function VATEngine()
{
	initialise();

	if (loadXMLSalesOrderPayload()==true)
	{
		parseXMLSalesOrder();	
		calculateVATCodes();
		constructXMLAnswer();
		saveXMLSalesOrderVATPayload();
	}
}

/**
 * initialise
 */
function initialise()
{
	try
	{
		serviceURL = 'http://ec.europa.eu/taxation_customs/vies/services/checkVatService';
	}
	catch(e)
	{
		errorHandler("initialise", e);
	}
}

/**
 * load XML Sales Order Payload and determine if the VAT should be calculated
 *
 * 2.0.2 check if VAT flag is checked - MJL
 * 2.0.4 add check for deployment on Staging record - MJL
 * 2.0.5 changed extended if statement to switch statement - MJL
 * 2.0.6 if override flag is not ticked on manual Sales Order, do not process - MJL
 * 2.0.7 changed nlapiLookupField to get staging record status and sales order ID
 * 		 to overcome double-looping issue - MJL 
 */
function loadXMLSalesOrderPayload()
{
	var retVal = true; 
	var recordType = '';	
	var soRefNo = '';
	var isVATEnabled = 'F';
	var salesRecordID = 0;
	var salesRecord = null;
	var stagingRecordID = 0;
	var stagingStatus = '';
	var manual = 'F';

	try
	{ 
		recordType = nlapiGetRecordType();

		//2.0.5 changed extended if statement to switch statement - MJL
		switch (recordType)
		{
		case 'salesorder':

			salesRecordID = nlapiGetRecordId();
			salesRecord = nlapiLoadRecord(recordType, salesRecordID);

			soRefNo = salesRecord.getFieldValue('tranid');
			isVATEnabled = salesRecord.getFieldValue('custbody_vat_pricedisc_override'); //2.0.2 check if VAT flag is checked - MJL

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
			retVal = false;
		break;
		}

		if (payloadRecordID > 0)
		{
			payloadRecord = nlapiLoadRecord('customrecord_tibco_order_feed', payloadRecordID);

			XMLSalesOrder= payloadRecord.getFieldValue('custrecord_tibco_order_xmlpayload');
			XMLSalesOrder = UNencodeXML(XMLSalesOrder);

			status = payloadRecord.getFieldValue('custrecord_tibco_order_status');
			manual = payloadRecord.getFieldValue('custrecord_tibco_order_is_manualentry');

			// user events that are triggered from a manual sales order can only calculate for manual designation
			//if(recordType!='salesorder' && manual=='T')
			//{
			//retVal = false;
			//}

			//2.0.6 if override flag is not ticked on manual Sales Order, do not process - MJL
			if (recordType == 'salesorder' && isVATEnabled == 'F')
			{
				retVal = false;
			}

			// if the payload has already been processed, do not process again
	//		if(status == 'Successful')
		//	{
		//		retVal = false;
		//	}
		}
		else
		{
			retVal = false;
		}
	}
	catch(e)
	{
		errorHandler("loadXMLSalesOrderPayload", e);
	}
	return retVal;
}

/**
 * parse XML Sales Order 
 */
function parseXMLSalesOrder()
{
	try
	{	
		//Parse payload string as XML document
		xmldoc = nlapiStringToXML(XMLSalesOrder);

		//Get order details from XML document
		getOrderHeaderDetailsXMLAPI();
		getOrderLineDetailsXMLAPI();
	}
	catch(e)
	{
		errorHandler("parseXMLSalesOrder", e);
	}
}

/**
 * 2.0.1 get order header details for new XML format using netsuite XML API 
 * 
 * 2.0.3 code related to old spec removed; this is now the only active parsing code - MJL
 */
function getOrderHeaderDetailsXMLAPI()
{
	var orderNode = null;
	var addrNodes = null;
	var addrType = '';

	try
	{		
		//Get date information
		orderNode = nlapiSelectNode(xmldoc, '//*[name()="ORDER"]');
		orderDate = nlapiSelectValue(orderNode, '//*[name()="ORDERDATE"]');
		shipDate = nlapiSelectValue(orderNode, '//*[name()="SHIPDATE"]');

		//Get addresses
		addrNodes = nlapiSelectNodes(orderNode, '//*[name()="ADDRESS"]');

		//Reverse dates; must be format yyyy-mm-dd
		if (orderDate != null)
		{
			orderDate = reverseDate(orderDate);
		}

		if (shipDate != null)
		{
			shipDate = reverseDate(shipDate);
			shipDateNS = shipDate;
		}

		//Determine address types
		for	(var i = 0; i < addrNodes.length; i++)
		{	
			addrType = nlapiSelectValue(addrNodes[i], '*[name()="TYPE"]');

			if (addrType != '')
			{
				switch (addrType)
				{
				case 'SHIPTO':
					customerID = nlapiSelectValue(addrNodes[i], '*[name()="ID"]'); // 2.0.0 new xml format checks
					shipToCountry = nlapiSelectValue(addrNodes[i], '//*[name()="COUNTRYCODE"]'); // 2.0.0 change to detect either country code tag of old or new XML format

					if (shipToCountry != '')
					{
						isCountryEU();		//Determine if this country is in the EU not now used
						//isCountryEUAlignReg();	//Determine if this country is in the EU
					}
					continue;

				case 'BILLTO':
					billToCustomerID = nlapiSelectValue(addrNodes[i], '*[name()="ID"]');
					billToCountry = nlapiSelectValue(addrNodes[i], '//*[name()="COUNTRYCODE"]');
					continue;

				default:
					continue;
				}
			}
		}
	}
	catch (e)
	{
		errorHandler("getOrderHeaderDetailsXMLAPI", e);
	}
}

/**
 * 2.0.1 get order item line details - JM
 * 
 * 2.0.3 code related to old spec removed; this is now active - MJL  
 */
function getOrderLineDetailsXMLAPI()
{
	var itemNodes = null;
	var part = '';
	var partNo = '';
	var desc = '';
	var quantity = ''; 
	var txPrice = '';

	try
	{	
		orderNode = nlapiSelectNode(xmldoc, '//*[name()="ORDER"]');
		itemNodes = nlapiSelectNodes(xmldoc, '//*[name()="LINEITEM"]');

		for (var i = 0; i < itemNodes.length; i++)
		{
			part = nlapiSelectValue(itemNodes[i], '*[name()="PART"]');
			partNo = nlapiSelectValue(itemNodes[i], '*[name()="PARTNUMBER"]');
			desc = nlapiSelectValue(itemNodes[i], '*[name()="DESCRIPTION"]');
			quantity = nlapiSelectValue(itemNodes[i], '*[name()="QUANTITY"]');
			txPrice = nlapiSelectValue(itemNodes[i], '*[name()="TRANSFERPRICE"]');

			if (part != null || partNo != null)
			{
				itemObj = new Object();

				if (part != null)
				{
					itemObj.code = part;
				}
				else if (partNo != null)
				{
					itemObj.code = partNo;
				}

				// lookup the item type
				lookupItemType(itemObj.code);
				itemObj.type = type;
				itemObj.typeIntID = typeIntID;
				itemObj.VATCode = null;
				itemObj.VATRate = null;
			}

			if (desc != null)
			{
				itemObj.desc = desc;
			}

			if (quantity != null)
			{
				itemObj.quantity = quantity;
			}

			if (txPrice != null)
			{
				itemObj.price = txPrice;

				itemsArray[itemsCount] = itemObj;
				itemsCount = itemsCount + 1;
			}
		}
	}
	catch(e)
	{
		errorHandler("getOrderLineDetailsXMLAPI", e);
	}
}

/**
 * lookup Item Type
 */
function lookupItemType(itemCode)
{
	var itemIntID = 0;
	var itemRecord = null;
	var recordType = null;

	try
	{
		itemIntID = genericSearch('item','itemid',itemCode);

		if(itemIntID != 0)
		{
			recordType = searchResult.getRecordType();

			itemRecord = nlapiLoadRecord(recordType, itemIntID);
			type = itemRecord.getFieldText('custitem_alignbv_itemtype');
			typeIntID = itemRecord.getFieldValue('custitem_alignbv_itemtype');
		}
		else
		{
			type = '';
			typeIntID = 0;
			addToError('Item not found: '+ itemCode);
		}
	}
	catch(e)
	{
		errorHandler("lookupItemType", e);
	}
}


/**
 * is Country EU Registered for align?
 */

function isCountryEUAlignReg()
{
	var euSearchFilters = new Array();
	var euSearchColumns = new Array();
	var euSearchResults = null;

	try
	{
		euSearchFilters[0] = new nlobjSearchFilter('custrecord_countrycode', null, 'is', shipToCountry);
		euSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

		euSearchResults = nlapiSearchRecord('customrecord_alignbv_vatregcodes', null, euSearchFilters, euSearchColumns);

		shipToEU = 'F';

		if(euSearchResults)
		{
			shipToEU = 'T';
		}
	}
	catch(e)
	{
		errorHandler("isCountryEUAlignReg", e);
	}

}


/**
 * is Country EU?
 */

function isCountryEU()
{
	var country = '';
	var euSearchFilters = new Array();
	var euSearchColumns = new Array();
	var euSearchResults = null;
	var euSearchResult = null;
	var euCountry = 'F';


	try
	{
		euSearchFilters[0] = new nlobjSearchFilter('custrecord_alignbv_country', null, 'isnotempty');

		euSearchColumns[0] = new nlobjSearchColumn('internalid');
		euSearchColumns[1] = new nlobjSearchColumn('custrecord_alignbv_country');
		euSearchColumns[2] = new nlobjSearchColumn('custrecord_alignbv_eu');
		euSearchColumns[3] = new nlobjSearchColumn('custrecord_alignbv_country_region');

		euSearchResults = nlapiSearchRecord('customrecord_alignbv_eucountry', null, euSearchFilters, euSearchColumns);

		shipToEU = 'F';

		if(euSearchResults)
		{
			for(var x=0; x<euSearchResults.length;x++)
			{
				euSearchResult = euSearchResults[ x ];

				//country = euSearchResult.getText('custrecord_alignbv_country');

				country = euSearchResult.getText('custrecord_alignbv_country_region');
				euCountry = euSearchResult.getValue('custrecord_alignbv_eu');

				if(country == shipToCountry)
				{
					shipToEU = euCountry;
					break;
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("lookupCountryDetails", e);
	}

}


/**
 * calculate VAT Code
 */
function calculateVATCodes()
{
	try
	{
		// get the vat reg number from the bill to address
		if(lookupAlignCustomer(billToCustomerID)==true)
		{

			// check the validity on the VAT number
			// based on the flags set on the customer record

			VATRegistrationValidity();	

			if(lookupAlignCustomer(customerID)==true)
			{
				//for each item
				for (var x = 0; x < itemsCount; x++)
				{
					// get item object from array
					itemObj = itemsArray[x];

					// lookup the VAT Code
					VATCode = 'not set due to error';
					lookupVATSchedule();

					if(VATCode.length!=0)
					{
						itemObj.VATCode = VATCode;
						itemObj.VATRate = VATRate;
						itemsArray[x] = itemObj;
					}
					else
					{
						addToError('Cannot determine VAT Code for ' + itemObj.desc);
					}
				}
				setTheVatNumberForInvoice();
			}
			else
			{
				addToError('Cannot find ship-to customer');
			}
		}
		else
		{
			addToError('Cannot find bill-to customer');
		}
	}
	catch(e)
	{
		errorHandler("calculateVATCode", e);
	}
}


/**
 * check for customers bill to VAT registration number validity
 */
function VATRegistrationValidity()
{
	var VATRegValidServiceCheck = false;

	try
	{
		VATNumber = vatNo;						// vatNo defined in the library

		if(VATNumber)
		{
			VATNoPresent = 'T';
		}
		else
		{
			VATNoPresent = 'F';
		}

		
		// check if the new vat rule should invoked
		
		if(VATRule==true)
		{

			if(vatOverride=='T' && VATNumber)		// if the override has been ticked, vat number is valid
			{
				VATNoPresent = 'T';
			}

			if(vatOverride=='F' && VATNumber)		// if the override has been not been ticked check
			{
				if(vatValid == 'T')					// check if the VAT Sweep has deemed the VAT number valid
				{
					VATNoPresent = 'T';
				}
				else
				{
					VATNoPresent = 'F';	
				}

			}
			else
			{
				VATNoPresent = 'F';
			}

		}

	}
	catch(e)
	{
		errorHandler("VATRegistrationValidity", e);
	}
}


/**
 * lookup VAT Schedule item(s) - can be many because of older de-commissioned rates
 * 
 * check for to see if date range matches the latest record - if not, check previous range
 */
function lookupVATSchedule()
{
	var internalID=0;
	var VATScheduleSearchFilters = new Array();
	var VATScheduleSearchColumns = new Array();
	var nonEU = 'T';

	try
	{
		if(shipToEU == 'T')
		{
			nonEU = 'F';
		}
		
		
		

		//search filters     
		// cant include country in search - cant get internal ID - country table not searchable
		//	VATScheduleSearchFilters[0] = new nlobjSearchFilter('custrecord_alignbv_shipto', null, 'is',shipToCountry);                          
		VATScheduleSearchFilters[0] = new nlobjSearchFilter('custrecord_alignbv_sched_type', null, 'is', itemObj.typeIntID);                      
		VATScheduleSearchFilters[1] = new nlobjSearchFilter('custrecord_alignbv_taxcodepresent', null, 'is', VATNoPresent);                      
		VATScheduleSearchFilters[2] = new nlobjSearchFilter('custrecord_alignbv_noneu', null, 'is', nonEU);                      
		VATScheduleSearchFilters[3] = new nlobjSearchFilter('custrecord_alignbv_validfrom', null, 'onOrBefore', shipDateNS);                      
		VATScheduleSearchFilters[4] = new nlobjSearchFilter('custrecord_alignbv_validto',null,'isempty');                      

		// return columns
		VATScheduleSearchColumns[0] = new nlobjSearchColumn('internalid');
		VATScheduleSearchColumns[1] = new nlobjSearchColumn('custrecord_alignbv_sched_taxcode');
		VATScheduleSearchColumns[2] = new nlobjSearchColumn('custrecord_alignbv_vatnooninv');
		VATScheduleSearchColumns[3] = new nlobjSearchColumn('custrecord_alignbv_shipto');
		VATScheduleSearchColumns[4] = new nlobjSearchColumn('custrecord_alignbv_validfrom');
		VATScheduleSearchColumns[5] = new nlobjSearchColumn('custrecord_alignbv_sched_type');
		VATScheduleSearchColumns[6] = new nlobjSearchColumn('custrecord_alignbv_vatinvoicewording');
		VATScheduleSearchColumns[7] = new nlobjSearchColumn('custrecord_shiptoregion');


		// perform search for open ended dates i.e. there is no end date
		// if cannot find - modify the search to include an end date to search for a previous
		// 'closed dated' record
		VATScheduleSearchResults = nlapiSearchRecord('customrecord_alignbv_schedule', null, VATScheduleSearchFilters, VATScheduleSearchColumns);
		VATCode = findCorrectVATCountry(shipToCountry);
		
		
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: itemObj.typeIntID', itemObj.typeIntID);
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: nonEU', nonEU);
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: shipDateNS', shipDateNS);
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: VATNoPresent',VATNoPresent);
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: shipToCountry', shipToCountry);
		nlapiLogExecution('DEBUG', 'lookupVATSchedule: VATCode', VATCode);


		//Was VAT code found?
		if(VATCode.length==0)
		{
			// perform search for 'old' vat records
			VATScheduleSearchFilters[4] = new nlobjSearchFilter('custrecord_alignbv_validto', null, 'onOrAfter', shipDateNS);
			VATScheduleSearchResults = nlapiSearchRecord('customrecord_alignbv_schedule', null, VATScheduleSearchFilters, VATScheduleSearchColumns);
			VATCode = findCorrectVATCountry(shipToCountry);

			// this rule only applies where the country is non eu and the vat code has not been
			// already found for a specific country or a specific country with an old vat code

			if(VATCode.length== 0 && shipToEU=='F')
			{
				VATScheduleSearchFilters[4] = new nlobjSearchFilter('custrecord_alignbv_validto',null,'isempty');
				VATScheduleSearchResults = nlapiSearchRecord('customrecord_alignbv_schedule', null, VATScheduleSearchFilters, VATScheduleSearchColumns);
				VATCode = findCorrectVATCountry('');

				// did we get a vat code?
				if(VATCode.length==0)
				{
					// perform search for 'old' vat records
					VATScheduleSearchFilters[4] = new nlobjSearchFilter('custrecord_alignbv_validto', null, 'onOrBefore', shipDateNS);
					VATScheduleSearchResults = nlapiSearchRecord('customrecord_alignbv_schedule', null, VATScheduleSearchFilters, VATScheduleSearchColumns);
					VATCode = findCorrectVATCountry('');
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("lookupVATSchedule", e);
	}     	      
	return internalID;
}

/**
 * 
 * findCorrectVATCountry - iterate thru results to find the correct country
 * 
 */
function findCorrectVATCountry(shipCntry)
{
	var country = '';
	var retVal = '';

	try
	{
		if (VATScheduleSearchResults != null)
		{
			
			nlapiLogExecution('DEBUG', 'findCorrectVATCountry: we have results', 'we have results');
			
			for (var x = 0; x < VATScheduleSearchResults.length; x++)
			{
				retVal = '';
				VATScheduleSearchResult = VATScheduleSearchResults[x];

				//country = VATScheduleSearchResult.getText('custrecord_alignbv_shipto');
				country = VATScheduleSearchResult.getText('custrecord_shiptoregion');
				// dealing with a non eu country

				if(shipCntry.length==0)
				{
					if(country.length==0)
					{
						retVal = VATScheduleSearchResult.getText('custrecord_alignbv_sched_taxcode');
						VATNumberToGoOnInvoiceINTID = VATScheduleSearchResult.getValue('custrecord_alignbv_vatnooninv');
						VATTextToGoOnInvoice = VATScheduleSearchResult.getValue('custrecord_alignbv_vatinvoicewording');

						// lookup the VAT Rate
						VATRate = lookupSalesVATRate(retVal);
						break;

					}
				}
				else
				{
					
					nlapiLogExecution('DEBUG', 'findCorrectVATCountry: specific country shipCntry', shipCntry);
					nlapiLogExecution('DEBUG', 'findCorrectVATCountry: specific country country', country);
					
					// dealing with a specific country
					if(shipCntry == country)
					{
						
						nlapiLogExecution('DEBUG', 'findCorrectVATCountry: specific country found', 'found');

						
						retVal = VATScheduleSearchResult.getText('custrecord_alignbv_sched_taxcode');
						VATNumberToGoOnInvoiceINTID = VATScheduleSearchResult.getValue('custrecord_alignbv_vatnooninv');
						VATTextToGoOnInvoice = VATScheduleSearchResult.getValue('custrecord_alignbv_vatinvoicewording');

						var intid = VATScheduleSearchResult.getValue('internalid');

						//===================================
						// lookup the VAT Rate
						//===================================
						VATRate = lookupSalesVATRate(retVal);
						break;

					}
				}

			}
		}
	}
	catch(e)
	{
		errorHandler("findCorrectVATCountry", e);
	}
	return retVal;
}

/**
 * lookup the VAT Rate for a given VAT Code
 */
function lookupSalesVATRate(vc)
{
	var record = null;
	var intID = 0;
	var retVal = '';

	try
	{
		intID = genericSearch('salestaxitem','name', vc);
		record = nlapiLoadRecord('salestaxitem', intID);
		retVal = record.getFieldValue('rate');

	}
	catch(e)
	{
		errorHandler("lookupSalesVATRate", e);
	}
	return retVal;
}

/**
 * get the correct vat number for the invoice
 */
function setTheVatNumberForInvoice()
{
	var record = null;
	var intID = 0;

	try
	{
		intID = genericSearch('customrecord_alignbv_vatregcodes','internalid', VATNumberToGoOnInvoiceINTID);
		record = nlapiLoadRecord('customrecord_alignbv_vatregcodes', intID);
		VATNumberToGoOnInvoice= record.getFieldValue('custrecord_alignvatnumber');

		if(VATNumberToGoOnInvoice.length==0)
		{
			addToError('Unable to set VAT Number');
		}
	}
	catch(e)
	{
		errorHandler("setTheVatNumberForInvoice", e);
	}
}

/**
 * construct XML Answer
 */
function constructXMLAnswer()
{
	var breakTag = '';

	try
	{
		breakTag = '<BR>';

		XMLVatCalc = tagXMLstart + 'VATCALC' + tagXMLend+ breakTag;
		XMLVatCalc = XMLVatCalc + tagXMLstart + 'VATNUMBER' + tagXMLend;
		XMLVatCalc = XMLVatCalc + VATNumberToGoOnInvoice;
		XMLVatCalc = XMLVatCalc + tagXMLstart + '/VATNUMBER' + tagXMLend + breakTag;

		XMLVatCalc = XMLVatCalc + tagXMLstart + 'ITEMS' + tagXMLend+ breakTag;

		for (var x = 0; x < itemsCount ; x++)
		{
			// get item object from array
			itemObj = itemsArray[x];

			XMLVatCalc = XMLVatCalc + tagXMLstart + 'ITEM' + tagXMLend;
			XMLVatCalc = XMLVatCalc + tagXMLstart + 'PRODCODE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + itemObj.code;
			XMLVatCalc = XMLVatCalc + tagXMLstart + '/PRODCODE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + tagXMLstart + 'VATCODE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + itemObj.VATCode;
			XMLVatCalc = XMLVatCalc + tagXMLstart + '/VATCODE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + tagXMLstart + 'VATRATE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + itemObj.VATRate;
			XMLVatCalc = XMLVatCalc + tagXMLstart + '/VATRATE' + tagXMLend;
			XMLVatCalc = XMLVatCalc + tagXMLstart + '/ITEM' + tagXMLend + breakTag;
		}

		XMLVatCalc = XMLVatCalc + tagXMLstart + '/ITEMS' + tagXMLend + breakTag;

		//1.0.3 adding the VAT footnote to XML answer. 
		XMLVatCalc = XMLVatCalc + tagXMLstart + 'VATINVOICEWORDING' + tagXMLend;
		XMLVatCalc = XMLVatCalc + VATTextToGoOnInvoice;
		XMLVatCalc = XMLVatCalc + tagXMLstart + '/VATINVOICEWORDING' + tagXMLend + breakTag;

		XMLVatCalc = XMLVatCalc + tagXMLstart + '/VATCALC' + tagXMLend;
	}
	catch(e)
	{
		errorHandler("constructXMLAnswer", e);
	}
}

/**
 * save XML Sales Order VAT Payload
 */
function saveXMLSalesOrderVATPayload()
{
	var submitID = 0;

	try
	{
		payloadRecord.setFieldValue('custrecord_alignbv_vatxmlcalc',XMLVatCalc);
		payloadRecord.setFieldValue('custrecord_tibco_order_status',successDesc);
		payloadRecord.setFieldValue('custrecord_alignbv_vatcalcerror',XMLError);

		submitID = nlapiSubmitRecord(payloadRecord, true);
	}
	catch(e)
	{
		errorHandler("saveXMLSalesOrderVATPayload", e);
	}
}

/**
 * save error as XML 
 */
function addToError(errorDesc)
{
	try
	{
		XMLError = XMLError +  tagXMLstart + 'ERROR' + tagXMLend;
		XMLError = XMLError +  errorDesc;
		XMLError = XMLError +  tagXMLstart + '/ERROR' + tagXMLend;

		successDesc = 'Failed';
	}
	catch(e)
	{
		errorHandler("addToError", e);
	}

}


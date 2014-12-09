/*************************************************************************************
 * Name:		createTransactionUserEvent.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 2013-04-16 - Initial release - PAL
 * 					1.1.0 - 2013-05-13 - Updated to handle Items tag and Item elements within
 * 				
 * Author:		Pete Lewis FHL
 * 
 * Purpose:		After Submit of the Audit Record, create the Transaction. If it exists however, update it.
 * 
 * Script: 		customscript_
 * Deploy: 		customdeploy_
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/
var _locationIreland = 14;
var _subsidiaryIreland = 27;

var xmlPayloadArray = new Array();
var rawItemsArray = new Array();
var itemsArray = new Array();

var itemId = '';
var itemDescription = '';
var itemName = '';
var itemPrice = '';
var itemQuantity = '';

var itemCurrentPosition = 0;

var colItemID = 0;
var colItemName = 1;
var colItemDescription = 2;
var colItemPrice = 3;
var colItemQuantity = 4;

var numberOfItemColumns = 5;

//Field Name constants to use throughout
var _fieldNameRecordType = 'custrecord_rsa_recordtype';
var _fieldNameTransaction = 'custrecord_rsa_transaction';
var _fieldNameProcessed = 'custrecord_processed';
var _fieldNameDescription = 'custrecord_description';
var _fieldNamePayload = 'custrecord_payload';
var _fieldNameStatus = 'custrecord_status';

//Field Name NetSuite Constants
var _fieldNameNSCustomer = 'customer';
var _fieldNameNSSalesRep = 'salesrep';
var _fieldNameNSTranDate = 'trandate';
var _fieldNameNSDueDate = 'duedate';
var _fieldNameNSPaymentMethod = 'paymentmethod';
var _fieldNameNSPaymentTerms = 'terms';
var _fieldNameNSCurrency = 'currency';
var _fieldNameNSTransactionTotal = 'total';
var _fieldNameNSLocation = 'location';
var _fieldNameNSSubsidiary = 'subsidiary';
var _fieldNameNSEntity = 'entity';

//UE Record Types
var _recordTypeCashSale = '2';
var _recordTypeContact = '4';
var _recordTypeCustomer = '3';
var _recordTypeSalesOrder = '1';

//NetSuite Record Types
var _nsRecordTypeSalesOrder = 'salesorder';
var _nsRecordTypeCashSale = 'cashsale';
var _nsRecordTypeCustomer = 'customer';
var _nsRecordTypeContact = 'contact';

//Status values
var _statusPending = 'pending';
var _statusProcessed = 'processed';
var _statusDoNotProcess = 'do not process';

//Processed values
var _true = 'TRUE';
var _false = 'FALSE';

//Tags
var _tagTransaction = 'transaction';
var _tagBody = 'body';
var _tagTransactionId = 'transactionid';
var _tagCustomerId = 'customerid';
var _tagCustomerName = 'customername';
var _tagTypeName = 'typename';
var _tagTypeId = 'typeid';
var _tagDate = 'date';
var _tagDueDate = 'duedate';
var _tagSalesRepId = 'salesrepid';
var _tagSalesRepName = 'salesrepname';
var _tagPaymentMethodId = 'paymentmethodid';
var _tagPaymentMethodName = 'paymentmethodname';
var _tagPaymentTermsId = 'paymenttermsid';
var _tagPaymentTermsName = 'paymenttermsname';
var _tagCurrencyId = 'currencyid';
var _tagCurrencyName = 'currencyname';
var _tagTransactionTotal = 'transactiontotal';
var _tagBillAddress = 'billaddress';
var _tagBillLine1 = 'billline1';
var _tagBillLine2 = 'billline2';
var _tagBillLine3 = 'billline3';
var _tagBillLine4 = 'billline4';
var _tagBillPostCode = 'billpostcode';
var _tagShipAddress = 'shipaddress';
var _tagShipLine1 = 'shipline1';
var _tagShipLine2 = 'shipline2';
var _tagShipLine3 = 'shipline3';
var _tagShipLine4 = 'shipline4';
var _tagShipLinePostCode = 'shippostcode';
var _tagItems = 'items';
var _tagItem = 'item';
var _tagItemId = 'itemid';
var _tagItemName = 'itemname';
var _tagItemDesc = 'itemdesc';
var _tagItemPrice = 'itemprice';
var _tagItemQty = 'itemqty';
//var _tag = '';

//Audit Record variables
var auditRecordType = '';	//this is used so we can get Record Type and use it without having to manually enter it
var auditRecordId = 0;	//Internal ID of the current record
var auditRecord = null;	//Record Object should it still exist
var auditRecordName = '';	//This is the contents of the Name field
var auditRecordDescription = '';	//Contents of the Description field e.g. CASH SALE, SALES ORDER
var auditRecordPayload = '';	//Contents of the Payload field
var auditRecordStatus = '';	//Status of the Audit field, e.g. Processed, Awaiting Processing
var auditRecordTranscationId = 0;	//Internal ID of the Transaction associated to this Audit Record
var auditRecordTransactionType = '';	//NetSuite Transaction Type of the Transaction specified above

var itemCount = 0;

//used to check which User Event Type has been initiated
var userEventType = ''; 	//default  to blank. This will hold the User Event 'type' parameter

//Transaction Variables. Note that it can be Sales Order, Cash Sale etc
var transactionRecordId = 0;
var transactionRecord = null;
var transactionRecordType = '';

//Customer details for the Transaction
var customerRecordId = 0;
var customerRecord = null;

//Record Type variables
var recordType = null;
var recordTypeId = 0;
var recordTypeFieldName = '';

///Line Item variables
var itemInternalId = 0;
var itemQuantity = 1;
var itemRate = 0.00;

//Body Fields
var bodyCustomer = null;
var bodySalesRep = null;
var bodyTransactionDate = '1/1/2013';
var bodyTransactionCurrency = null;
var bodyDueDate = '30/1/2013';
var bodyPaymentMethod = 0;
var bodyPaymentTerms = '';
var bodyCurrency = '';
var bodyItems = '';

//bill address
var bodyBillAddress = null;
var bodyBillLine1 = '';
var bodyBillLine2 = '';
var bodyBillLine3 = '';
var bodyBillLine4 = '';
var bodyBillPostCode = '';

//ship address
var bodyShipAddress = null;
var bodyShipLine1 = '';
var bodyShipLine2 = '';
var bodyShipLine3 = '';
var bodyShipLine4 = '';
var bodyShipPostCode = '';


/*************************************************************************************
 * createTransactionAfterSubmit - Main Entry Point for the User Event
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 * 
 *************************************************************************************/
function createTransactionAfterSubmit(type)
{

	try
	{
		//We will need to use the Type all around the script, so we're setting it to the global userEventType variable here
		userEventType = type.toLowerCase();

		initialiseVariables();
		checkType();

	}
	catch(e)
	{
		errorHandler('createTransactionAfterSubmit Exception', e);
	}
}


/*************************************************************************************
 *
 *  initialiseVariables - sets all the variables which will be used within the script
 * 
 *************************************************************************************/
function initialiseVariables()
{
	try
	{
		if(userEventType != 'delete')	//If the type is delete, this will fail.
		{
			auditRecordType = nlapiGetRecordType();
			auditRecordId = nlapiGetRecordId();
			auditRecord = nlapiLoadRecord(auditRecordType, auditRecordId);
			auditProcessed = auditRecord.getFieldValue(_fieldNameProcessed);
			auditStatus = auditRecord.getFieldValue(_fieldNameStatus);
			auditRecordPayload = auditRecord.getFieldValue(_fieldNamePayload);

			itemsArray = new Array(5);
			itemsArray[colItemID] = new Array();
			itemsArray[colItemName] = new Array();
			itemsArray[colItemDescription] = new Array();
			itemsArray[colItemPrice] = new Array();
			itemsArray[colItemQuantity] = new Array();




			splitPayloadToArray();

			if(auditStatus == _statusPending)
			{
				auditRecordTransactionType = auditRecord.getFieldValue(_fieldNameRecordType);
				transactionRecordId = auditRecord.getFieldValue(_fieldNameTransaction);

				if(checkTransactionExists == true)
				{
					transactionRecord = nlapiLoadRecord(auditRecordTransactionType, transactionRecordId);
					customerRecordId = transactionRecord.getFieldValue(_fieldNameCustomer);
					//customerRecord = nlapiLoadRecord('customer', customerRecordId);
				}

			}

		}
		else
		{
			//type is delete
			nlapiLogExecution('DEBUG', 'initialiseVariables', 'Type is Delete. Do not process this record as it has already been deleted.');
		}

	}
	catch(e)
	{
		errorHandler('initialiseVariables Exception', e);
	}
}

/*************************************************************************************
 * checkType
 * 
 * Checks the User Event Type, and calls the relevant function.
 * 
 *************************************************************************************/
function checkType()
{
	try
	{

		switch(userEventType)
		{
		case 'delete':
			nlapiLogExecution('AUDIT', 'Audit Record Deleted', 'Audit Record Deleted. Internal ID: ' + auditRecordId);
			break;

		case 'create':
			createTransaction();
			break;

		case 'edit':
		case 'xedit':
			updateTransaction();	//Phase II
			break;

		default:	//this is a type we do not want to handle, but it shouldn't really be triggered (e.g. Approve)
			nlapiLogExecution('DEBUG', 'checkType', 'Default Case in Switch Statement executed. userEventType: ' + userEventType);
		break;
		}
	}
	catch(e)
	{
		errorHandler('userEventType Exception', e);
	}
}

/*************************************************************************************
 * createTransaction
 * 
 * Create the Transaction Record
 * 
 *************************************************************************************/
function createTransaction()
{
	try
	{



		getBodyDetails();
		getLineItemCount();
		getItems();

		nlapiLogExecution('DEBUG', 'GetLineItemCount', itemCount);

		//create new record
		transactionRecord = nlapiCreateRecord(transactionRecordType);

		//set entity
		transactionRecord.setFieldValue(_fieldNameNSEntity, bodyCustomer);

		//set Subsidiary
		//transactionRecord.setFieldValue(_fieldNameNSSubsidiary, _subsidiaryIreland);

		//set Location
		transactionRecord.setFieldValue(_fieldNameNSLocation, _locationIreland);

		//set sales rep
		if(bodySalesRep == null || bodySalesRep == '')
		{
			bodySalesRep = nlapiGetUser();
		}

		transactionRecord.setFieldValue(_fieldNameNSSalesRep, bodySalesRep);




		//set date
		if(bodyTransactionDate != '')
		{
			//set transaction date
			//transactionRecord.setFieldValue(_fieldNameNSTranDate, bodyTransactionDate);
		}

		//set currency - should be defaulted from the Customer Record...
		if(bodyCurrency != '')
		{
			//set transaction currency
			//transactionRecord.setFieldValue('currency', bodyCurrency);
		}

		//set addresses - again, should be defaulted from the Customer Record
		if(bodyBillAddress != '')
		{
			//Phase II
		}
		if(bodyShipAddress != '')
		{
			//Phase II
		}




		//for each <item> in <items>
		for(var i=0; i<itemCount; i++)
		{
			itemId = '655';
			itemQuantity = 1;
			itemPrice = 10;

			itemId = itemsArray[colItemID][i];
			itemQuantity = itemsArray[colItemQuantity][i];
			itemPrice = itemsArray[colItemPrice][i];

			nlapiLogExecution('DEBUG', 'Inside Items loop: I = ' + i, 'ItemID: ' + itemId + ', itemQuantity: ' + itemQuantity + ', itemPrice: ' + itemPrice + ', itemCount: ' + itemCount);

			transactionRecord.selectNewLineItem('item');
			transactionRecord.setCurrentLineItemValue('item', 'item',  itemId);
			transactionRecord.setCurrentLineItemValue('item', 'quantity',  itemQuantity);
			transactionRecord.commitLineItem('item');
		}
		//next <item>

		//compare Total with Payload Total (Commented out as it's Phase II) & other checks?

		//transaction id = submit record
		transactionRecordId = nlapiSubmitRecord(transactionRecord);

		//set fields on Audit Record:
		//transaction id
		auditRecord.setFieldValue(_fieldNameTransaction,transactionRecordId);
		//tran type
		auditRecord.setFieldValue(_fieldNameRecordType,_recordTypeCashSale);
		//processed
		auditRecord.setFieldValue(_fieldNameProcessed,_true);
		//status
		auditRecord.setFieldValue(_fieldNameStatus,_statusProcessed);

		//submit Audit record
		nlapiSubmitRecord(auditRecord);

	}
	catch(e)
	{
		errorHandler('createTransaction', e);
	}
}


/*************************************************************************************
 * updateTransaction
 * 
 * Update an existing Transaction
 * 
 *************************************************************************************/
function updateTransaction()
{
	try
	{
		//Phase II
		nlapiLogExecution('DEBUG', 'updateTransaction', 'updateTransaction Called. Jumping to CreateTransaction for Phase I.');
		createTransaction();
	}
	catch(e)
	{
		errorHandler('updateTransaction', e);
	}
}


/*************************************************************************************
 * checkTransactionExists
 * 
 * @returns boolean - If the Transaction exists already, and is linked to the Audit Record, return true
 * 
 *************************************************************************************/
function checkTransactionExists()
{
	var retVal = false;
	try
	{
		if(transactionRecordId == null || transactionRecordId == 0|| transactionRecordId == '' || transactionRecordId == '0')
		{
			retVal = false;
		}
		else
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('checkTransactionExists', e);
	}
	return retVal;
}






/*************************************************************************************
 * errorHandler
 * 
 * @param errorSource - Function name of the Error Source
 * @param e - error Object to interrogate
 * 
 *************************************************************************************/
function errorHandler(errorSource, e)
{

	var errorMessage = '';

	errorMessage = e.message;
	nlapiLogExecution( 'ERROR', 'unexpected error: ' + errorSource , errorMessage);

}




/*************************************************************************************
 * 
 * splitOutValue - splits out values and returns from an XML element
 * 
 * @param {String} element - XMLString
 * @param {String} elementTag - the XML Tag to search for
 * 
 * @returns {String} - the data between the tags
 *  
 *************************************************************************************/
function splitOutValue(element, elementTag)
{
	var retVal = '';
	var splitArray = null;

	//nlapiLogExecution('debug', 'SplitOutValue ElementTag', elementTag);

	try
	{
		//if element is not empty...
		if(element.indexOf(elementTag) != -1)
		{
			//...remove tags and return value
			//nlapiLogExecution('debug', 'SplitOutValue ElementTag found', elementTag);
			element = element + '</' + elementTag + '>';
			splitArray = element.split(elementTag);

			retVal = splitArray[1];
			//nlapiLogExecution('debug', 'SplitOutValue ElementTag retVal', retVal);
			retVal = '' + retVal.substring(4, retVal.length - 5).toString();
		}
		else
		{
			//nlapiLogExecution('debug', 'SplitOutValue tag not found', elementTag + ' not found');
		}

	}
	catch(e)
	{
		errorHandler("splitOutValue", e);
	}

	return retVal;
}


/*************************************************************************************
 * convert XML converted characters back to XML
 * 
 * @param xml
 * 
 * @returns {String}
 *************************************************************************************/
function UNencodeXML(XMLString)
{
	var retVal='';

	try
	{
		XMLString = XMLString.replace(/&amp;/g,'&');
		XMLString = XMLString.replace(/&lt;/g,'<');
		XMLString = XMLString.replace(/&gt;/g,'>');
		XMLString = XMLString.replace(/&quot;/g,'\'');
		XMLString = XMLString.replace(/&#xD;/g,'\r');
		XMLString = XMLString.replace(/&#xA;/g,'\n');  

		retVal = XMLString;

	}
	catch(e)
	{
		errorHandler("UNencodeXML", e);
	}

	return retVal;
}


/*************************************************************************************
 * encodeXML - replaces the special characters within an XML String with encoded XML
 * 
 * @param {String} XMLString - the Input XML String
 * 
 * @returns {String} - the input XML encoded
 *************************************************************************************/
function encodeXML(XMLString)
{
	var retVal='';

	try
	{

		XMLString = XMLString.replace(/</gi,"&lt;");
		XMLString = XMLString.replace(/>/gi,"&gt;");
		XMLString = XMLString.replace(/&/gi,"&amp;");

		//XMLString = XMLString.replace(/\n/gi,"&#xA;");  
		//XMLString = XMLString.replace(/\r/gi,"&#xD;");
		//XMLString = XMLString.replace(/\'/gi,"&quot;");

		retVal = XMLString;

	}
	catch(e)
	{
		errorHandler("encodeXML", e);
	}

	return retVal;
}


function getBodyDetails()
{
	try
	{
		transactionRecordType = splitOutValue(auditRecordPayload ,_tagTypeName);
		//nlapiLogExecution('DEBUG', 'Transaction Type Name', transactionRecordType);		

		//Body Fields
		bodyCustomer = splitOutValue(auditRecordPayload ,_tagCustomerId);
		//nlapiLogExecution('DEBUG', 'Transaction bodyCustomer', bodyCustomer);	

		bodySalesRep = splitOutValue(auditRecordPayload ,_tagSalesRepId);
		//bodySalesRep = 1500  (John Mackay)		
		//nlapiLogExecution('DEBUG', 'Transaction bodySalesRep', bodySalesRep);	

		bodyTransactionDate =splitOutValue(auditRecordPayload ,_tagDate);
		//nlapiLogExecution('DEBUG', 'Transaction bodyTransactionDate', bodyTransactionDate);	

		bodyTransactionCurrency = splitOutValue(auditRecordPayload ,_tagCurrencyId);
		//nlapiLogExecution('DEBUG', 'Transaction bodyTransactionCurrency', bodyTransactionCurrency);	

		bodyDueDate = splitOutValue(auditRecordPayload ,_tagDueDate);
		//nlapiLogExecution('DEBUG', 'Transaction bodyDueDate', bodyDueDate);	

		bodyPaymentMethod = splitOutValue(auditRecordPayload ,_tagPaymentMethodId);
		//nlapiLogExecution('DEBUG', 'Transaction bodyPaymentMethod', bodyPaymentMethod);	

		bodyPaymentTerms = splitOutValue(auditRecordPayload ,_tagPaymentTermsId);
		//nlapiLogExecution('DEBUG', 'Transaction bodyPaymentTerms', bodyPaymentTerms);	

		bodyCurrency = splitOutValue(auditRecordPayload ,_tagCurrencyId);
		//nlapiLogExecution('DEBUG', 'Transaction bodyCurrency', bodyCurrency);	


		//bill address
		bodyBillAddress = splitOutValue(auditRecordPayload ,_tagBillAddress);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillAddress', bodyBillAddress);	

		bodyBillLine1 = splitOutValue(auditRecordPayload ,_tagBillLine1);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillLine1', bodyBillLine1);	

		bodyBillLine2 = splitOutValue(auditRecordPayload ,_tagBillLine2);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillLine2', bodyBillLine2);	

		bodyBillLine3 = splitOutValue(auditRecordPayload ,_tagBillLine3);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillLine3', bodyBillLine3);	

		bodyBillLine4 = splitOutValue(auditRecordPayload ,_tagBillLine4);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillLine4', bodyBillLine4);	

		bodyBillPostCode = splitOutValue(auditRecordPayload ,_tagBillPostCode);
		//nlapiLogExecution('DEBUG', 'Transaction bodyBillPostCode', bodyBillPostCode);	

		//ship address
		bodyShipAddress =splitOutValue(auditRecordPayload ,_tagShipAddress);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipAddress', bodyShipAddress);	

		bodyShipLine1 = splitOutValue(auditRecordPayload ,_tagShipLine1);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipLine1', bodyShipLine1);	

		bodyShipLine2 = splitOutValue(auditRecordPayload ,_tagShipLine2);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipLine2', bodyShipLine2);	

		bodyShipLine3 = splitOutValue(auditRecordPayload ,_tagShipLine3);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipLine3', bodyShipLine3);	

		bodyShipLine4 = splitOutValue(auditRecordPayload ,_tagShipLine4);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipLine4', bodyShipLine4);	

		bodyShipPostCode = splitOutValue(auditRecordPayload ,_tagShipLinePostCode);
		//nlapiLogExecution('DEBUG', 'Transaction bodyShipPostCode', bodyShipPostCode);	

	}
	catch(e)
	{
		errorHandler("getBodyDetails", e);
	}
}

/*************************************************************************************
 * 
 * getLineItemCount - Iterates through the XML Payload to check the number of times the <item> tag appears
 * 
 *************************************************************************************/
function getLineItemCount()
{
	var itemString = '';
	try
	{
		itemString = '&lt;' + _tagItem + '&gt;';
		itemCount = countOcurrences(auditRecordPayload, itemString);		

		if(itemCount == 0)
		{
			itemString = '<' + _tagItem + '>';
			itemCount = countOcurrences(auditRecordPayload, itemString);		
		}

		if(itemCount == 0)
		{
			//There are literally NO <item> tags in there...This should NOT happen
		}
		nlapiLogExecution('DEBUG', 'itemString', itemString);
	}
	catch(e)
	{
		errorHandler("getLineItemCount", e);
	}
}






/*************************************************************************************
 * 
 * @param str
 * @param value
 * @returns
 * 
 *************************************************************************************/
function countOcurrences(str, value)
{
	var regExp = new RegExp(value, "gi");
	return str.match(regExp) ? str.match(regExp).length : 0;  
}

/*************************************************************************************
 * 
 * splitPayloadToArray - Gets the Payload XML String Data and converts it to an Array, using either \n or <br>
 * 
 *************************************************************************************/
function splitPayloadToArray()
{
	try
	{
		xmlPayloadArray = auditRecordPayload.split('\n');
		nlapiLogExecution('Debug', 'splitPayloadToArray', 'Attempted with slash n: ' + xmlPayloadArray.length);

		if(xmlPayloadArray.length == 1)
		{
			xmlPayloadArray = auditRecordPayload.split('&lt;br&gt;');
			nlapiLogExecution('Debug', 'splitPayloadToArray', 'Attempted with lt;br&g: ' + xmlPayloadArray.length);
		}

		if(xmlPayloadArray.length == 1)
		{
			xmlPayloadArray = auditRecordPayload.split('&lt;BR&gt;');
			nlapiLogExecution('Debug', 'splitPayloadToArray', 'Attempted with lt;BR&g: ' + xmlPayloadArray.length);
		}

		if(xmlPayloadArray.length == 1)
		{
			xmlPayloadArray = auditRecordPayload.split('<br>');
			nlapiLogExecution('Debug', 'splitPayloadToArray', 'Attempted with br: ' + xmlPayloadArray.length);
		}

		if(xmlPayloadArray.length == 1)
		{
			xmlPayloadArray = auditRecordPayload.split('<BR>');
			nlapiLogExecution('Debug', 'splitPayloadToArray', 'Attempted with BR: ' + xmlPayloadArray.length);
		}

		if(xmlPayloadArray.length == 1)
		{
			//none of the splits worked correctly...
			nlapiLogExecution('ERROR', 'splitPayloadToArray', 'XML Payload Array Length is still 1 - WHY???');
		}
		else
		{
			xmlPayloadArray = decodeXMLArray(xmlPayloadArray);
			nlapiLogExecution('debug', 'splitPayloadToArray', 'Split to Array, and decoded XML Array');
		}
	}
	catch(e)
	{
		errorHandler('splitPayloadToArray', e);
	}
}

/*************************************************************************************
 * 
 * getItems - Gets the Items Payload XML String Data Section from the XML Payload and outputs the Items in to 
 * the itemsArray array
 * 
 *************************************************************************************/
function getItems()
{

	var bodyPayloadArrayLength = 0;

	try
	{
		itemCurrentPosition = -1;	//We need to start this at -1 as we don't want to add ANYTHING in to the array until we reach the first <item> tag

		bodyPayloadArrayLength = xmlPayloadArray.length;

		nlapiLogExecution('debug', 'bodyPayloadArrayLength', bodyPayloadArrayLength);

		for(var i = 0; i < bodyPayloadArrayLength; i++)
		{

			if(i < 6)
			{
				nlapiLogExecution('debug', 'xmlPayloadArray[i] Left()', Left(xmlPayloadArray[i], 9));
			}


			if(xmlPayloadArray[i] == '<' + _tagItem + '>')
			{
				itemCurrentPosition++;
			}

			if(itemCurrentPosition >= 0)
			{
				if(xmlPayloadArray[i].startsWith('&lt;' + _tagItemId))
				{
					itemId = splitOutValue('<' + _tagItemId + '>', itemsArray[colItemID][itemCurrentPosition] );
					itemsArray[colItemID][itemCurrentPosition] = itemId;
					nlapiLogExecution('debug', 'itemId', itemId);
				}

				if(xmlPayloadArray[i].startsWith('<' + _tagItemName))
				{
					itemName = splitOutValue('<' + _tagItemName + '>', itemsArray[colItemName][itemCurrentPosition] );
					itemsArray[colItemName][itemCurrentPosition] = itemName;
				}

				if(xmlPayloadArray[i].startsWith('<' + _tagItemDesc))
				{
					itemDescription = splitOutValue('<' + _tagItemDesc + '>', itemsArray[colItemDescription][itemCurrentPosition] );
					itemsArray[colItemDescription][itemCurrentPosition] = itemDescription;
				}

				if(xmlPayloadArray[i].startsWith('<' + _tagItemPrice))
				{
					itemPrice = splitOutValue('<' + _tagItemPrice + '>', itemsArray[colItemPrice][itemCurrentPosition] );
					itemsArray[colItemPrice][itemCurrentPosition] = itemPrice;
				}

				if(xmlPayloadArray[i].startsWith('<' + _tagItemQty))
				{
					itemQuantity = splitOutValue('<' + _tagItemQty + '>', itemsArray[colItemQuantity][itemCurrentPosition] );
					itemsArray[colItemQuantity][itemCurrentPosition] = itemQuantity;
				}

			}
			else
			{
				//nlapiLogExecution('DEBUG', 'getItemsPayload', 'I have not found the -item- tag yet. I:' + i);
			}
		}
	}
	catch(e)
	{
		errorHandler('getItemsPayload', e);
	}
}


if ( typeof String.prototype.startsWith != 'function') 
{
	String.prototype.startsWith = function(str) 
	{
		return str.length > 0 && this.substring(0, str.length) === str;
	};
};

if ( typeof String.prototype.endsWith != 'function' ) 
{
	String.prototype.endsWith = function( str ) 
	{
		return str.length > 0 && this.substring( this.length - str.length, this.length ) === str;
	};
};

/*******************************************************************
 * 
 * Gets the left most characters in the given string
 * 
 * @param str - the String you wish to get the left most characters of
 * 
 * @param n - the number of characters you wish to get
 * 
 * @returns - returns the sliced string
 * 
 *******************************************************************/
function Left(str, n)
{
	if (n <= 0)
	{
		return "";
	}
	else if (n > String(str).length)
	{
		return str;
	}
	else
	{
		return String(str).substring(0,n);
	}
}

/*******************************************************************
 * 
 * Gets the right most characters in the given string
 * 
 * @param str - the String you wish to get the right most characters of
 * 
 * @param n - the number of characters you wish to get
 * 
 * @returns - returns the sliced string
 * 
 *******************************************************************/

function Right(str, n)
{
	if (n <= 0)
	{
		return "";
	}
	else if (n > String(str).length)
	{
		return str;
	}
	else
	{
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}


/********************************************************************
 * 
 * encodeXMLArray - Pass in an Array where there are XML elements within, iterate through the
 * array, and encode all XML.
 * 
 * @param XMLArray - the Input array you wish to clean the XML from
 * @returns {Array}
 * 
 ********************************************************************/
function encodeXMLArray(XMLArray)
{
	var arrayLength = 0;
	var tempString = '';
	var cleansedString = '';
	try
	{
		arrayLength = XMLArray.length;

		if(arrayLength > 0)
		{
			for(var i = 0; i < arrayLength; i++)
			{
				tempString = XMLArray[i];

				if(i < 6)
				{
					nlapiLogExecution('DEBUG', 'encodeXMLArray', left(tempString,5));
				}
				cleansedString = encodeXML(tempString);
				XMLArray[i] = cleansedString;
			}
		}

	}
	catch(e)
	{
		errorHandler('encodeXMLArray', e);
	}
	return XMLArray;
}



/********************************************************************
 * 
 * decodeXMLArray - Pass in an Array where there are XML elements within, iterate through the
 * array, and decode all XML.
 * 
 * @param XMLArray - the Input array you wish to decode the XML
 * @returns {Array}
 * 
 ********************************************************************/
function decodeXMLArray(XMLArray)
{
	var arrayLength = 0;
	var tempString = '';
	var cleansedString = '';
	try
	{
		arrayLength = XMLArray.length;

		if(arrayLength > 0)
		{
			for(var i = 0; i < arrayLength; i++)
			{
				tempString = XMLArray[i];
				if(i < 6)
				{
					nlapiLogExecution('DEBUG', 'decodeXMLArray', Left(tempString,5));
				}

				cleansedString = UNencodeXML(tempString);
				XMLArray[i] = cleansedString;
			}
		}

	}
	catch(e)
	{
		errorHandler('decodeXMLArray', e);
	}
	return XMLArray;
}
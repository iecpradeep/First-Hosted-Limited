// [TODO] replace with descriptions i.e name
// [TODO] remove hardcoded account values 1161.002 & 1161.001

/*************************************************************************
 * Name: invoiceload.js
 * Script Type: user event
 * Client: Align BV
 * 
 * Version: 1.0.0 - 08 June 2012 - 1st release - JM
 * 			1.0.1 - 25 June 2012 - amended - MJL
 * 			1.0.2 - 28 June 2012 - region and channel field changes - looked up for ship to and bill - change the ar account based on rule
 * 			1.0.3 - 02 July 2012 - apply terms to the invoice body(header)
 * 			1.0.4 - 04 July 2012 - amended - VAT code invoice feed alteration
 * 			1.0.5 - 10 July 2012 - amended - if the terms is not present on the customer do not populate the invoice body
 * 			1.0.6 - 18 July 2012 - amended - create full credit if invoice exists
 * 											 where the invoice does not exist, create a journal - lookup account period for stand alone credit notes + invoices 
 * 			1.0.7 - 27 July 2012 - amended - parameterise hard coded values - discount item and credit memo 
 * 			1.0.8 - 27 July 2012 - amended - stand alone credit values corrected 
 * 			1.0.9 - 1  Aug  2012 - amended - corrected customer not found bug 
 * 			1.0.10- 15 Aug  2012 - amended - change item look up from contains to 'is' 
 * 			1.0.11- 15 Aug  2012 - amended - added more debug code 
 * 			1.0.12 - 31 Aug 2012 - amended - apply AR rule to credit note if no existing invoice - MJL
 * 			1.0.13 - 31 Aug 2012 - amended - added invoice ref to credit note memo field if no existing invoice - MJL
 *	 		1.0.14 - 03 Sep 2012 - amended - changed memo description for credit note w/out existing invoice - MJL
 *			1.0.15 - 05 Sep 2012 - amended - fixed leading zero in date causing due date issues - MJL 
 *			1.0.16 - 12 Sep 2012 - amended - corrected error message in credit note post - MJL
 *			1.0.17 - 12 Sep 2012 - amended - change Auto Apply flag to false - MJL
 *			1.0.18 - 17 Sep 2012 - amended - added custom fields to store the invoice number and patient information so that max cred extract can pick these values up
 *											 custbody_invoicenumber + custbody_patientnumber + need to check the status of the invoice before posting a credit i.e. if there is a payment
 *											 then we cannot post the credit against the invoice - the credit will need to be posted on account
 *											 Restructure main to simplify
 *			1.0.19 - 11 Oct 2012 - amended - changed credit routines to apply the items from the credit instead of the transformed items from the invoice + remove autoapply from postCreditNoteNotAgainstAnInvoice
 *											 plus lookup exchange rate for creditnote posted against an invoice
 *			1.0.20 - 31 Oct 2012 - amended - correct credit note posting multiple lines, removing invoice lines from a transformed invoice to credit 
 *                     18 Feb 2013 - added inter company tag for apac -- Fazalur Align Technology
 *											 
 * 
 * Author: FHL
 * Purpose: Loads CSV Payload, splits out values and creates invoice record
 * is called by a user event called customscript_usereventinvoiceload
 * 
 * Script: customscript_usereventinvoiceload 
 * Deploy: customdeploy_usereventinvoiceload
 * 
 *
 *  note - class = product family
 *   
 * 
 **************************************************************************/

var invoice='';
var itemObj=new Object();
var itemsArray = new Array();
var itemsCount=0;
var invoiceCSV='';
var invoiceRecord;
var invoiceStatus='';
var invID;
var invoiceSplit = new Array();
var invoiceElement = '';
var elementSplit;
var invoiceNo = '';
var creditNo = '';					// 1.0.6 extract credit note number
var alignCreditMemo = 0;

var invTotalNS = 0;					// 1.0.19
var remaining = 0;					// 1.0.19

var invoiceDate = '';
var invoiceAmt = '';
var auditRec=null;
var journalDeptID=0;
var journalSubsidiary=0;
var journalClass=0;
var invoicePayMethod=0;
var invoiceSalesRep=0;
var invoicePartner=0;
var invoiceTaxCode = 0;
var sd= '';
var jdeid='';
var invoiceTotal = 0;
var patientDetails = '';
var interCompanyTag ='';
var discountItem = '';

var journalIntIds = new Array();	// 1.0.6 journals
var journalCount = 0;				// 1.0.6 journal counts


var region = '';
var channel = '';
var channelDesc = '';
var regionDesc = '';
var terms = 0;


/****************************************************************
 * main
 * places CSV file into array and passes
 * variables to split function  
 * 1.0.18 simplify 
 ****************************************************************/
function processInvoiceLines(type)
{
	var process='FALSE';
	
	
	// load the audit record (which contains the csv payload)
	loadAuditRecord(type);

	if (auditRec.getFieldValue('custrecord_processed') == 'FALSE')
	{

		//=============================================
		// load parameters	
		//=============================================
		loadParameters();

		//=============================================
		// load CSV records into variables
		//=============================================
		loadCSV();

		//=============================================
		// post the transaction into NetSuite
		//=============================================
		postTransactionIntoNetSuite();
	}  
}

/**
 * load parameters for the script
 * [TODO] replace with descriptions i.e name
 * 1.0.7 - 27 July 2012 - amended - parameterise hard coded values - discount item and credit memo
 */
function loadParameters()
{
	try
	{
		journalDeptID = nlapiGetContext().getSetting('SCRIPT', 'custscript_department_intid');
		journalSubsidiary = nlapiGetContext().getSetting('SCRIPT', 'custscript_subsidiary_intid');
		journalClass = nlapiGetContext().getSetting('SCRIPT', 'custscript_class_intid');
		discountItem = nlapiGetContext().getSetting('SCRIPT', 'custscript_itemdiscountcode');		// 1.0.7
		alignCreditMemo = nlapiGetContext().getSetting('SCRIPT', 'custscript_aligncreditmemo');		// 1.0.7
		invoiceTaxCode = nlapiGetContext().getSetting('SCRIPT', 'custscript_invoice_taxcode_intid');
		
	}
	catch(e)
	{

		errorHandler(e);
		auditTrail('FAILED', 'Cannot create invoice - load parameters ' + getErrorMessage(e));

	}

}

/**
 * load csv records into variables
 * for header and details
 * 1.0.18 created to simplify
 */

function loadCSV()
{

	var invoiceLines='';

	// load the CSV from the audit record
	invoiceCSV = auditRec.getFieldValue('custrecord_payload');
	invoiceCSV = UNencodeCSV(invoiceCSV);

	// this code only deals with the invoice files
	invoiceLines = invoiceCSV.split('\n');

	//=============================================
	// get the details from the CSV structure
	//=============================================
	for (var i = 0; i < invoiceLines.length; i++)
	{

		invoiceLines[i] = invoiceLines[i].replace(', ',' '); 
		nlapiLogExecution('DEBUG', 'invline', invoiceLines[i]);
		invoiceSplit = invoiceLines[i].split(',');
		
		if (invoiceSplit.length > 5)
		{
			getInvoiceHeaderDetails();
			getInvoiceLineDetails();
		}
	}


}

/**
 * post transaction into netsuite
 * 1.0.18 created to simplify
 */

function postTransactionIntoNetSuite()
{
	
	var invIntId=0;		// 1.0.6
	var crIntId=0;		// 1.0.6
	
	// post details to netsuite
	if (invoiceNo.length > 0)
	{
		// look up the invoice
		invIntId = lookupInvoice(invoiceNo);
		
		//==========================================
		//
		// post invoice 
		//
		//==========================================
		if(invIntId =='not found' && creditNo == 0)
		{
			postInvoiceIntoNetsuite();
		}

		// deal with already posted for invoice
		if(invIntId !='not found' && creditNo == 0)
		{
			nlapiLogExecution('AUDIT', 'Invoice already posted', lookupInvoice(invoiceNo));
			auditTrail('FAILED', 'Invoice already posted');
		}

		//=============================================
		//
		// post credit
		//
		//=============================================

		if(creditNo!=0)
		{
			// check if credit memo already exists
			crIntId = genericSearch('creditmemo','tranid',creditNo);

			if(crIntId =='not found')
			{
				
				nlapiLogExecution('AUDIT', 'Invoice Status', 'Invoice status for invoice' + invoiceNo + ' is ' + invoiceStatus);
				
				//==================================================================
				// full credit note where invoice exists 1.0.6
				// 1.0.18 if invoice paid in full - cannot post against invoice
				// 1.0.19 - 11 Oct 2012 - amended - changed credit posting to always post the full invoice rather than transform the invoice into a credit - JM
				//==================================================================
				if((invIntId !='not found' && creditNo!=0) && invoiceStatus!='Paid In Full')
				{
					//postCreditNote(invIntId); //1.0.19 need to transform invoice to make associated credits work -  MJL
					// if invoice can be matched against an invoice
					if(postCreditNoteApply(invIntId)==-1)
					{
						postCreditNoteNotAgainstAnInvoice(0);
					}

				}

				//===============================================================================================
				// credit note where invoice does not exist or the invoice exists but is already paid
				// 1.0.19 - 11 Oct 2012 - amended - changed credit posting to always post the full invoice rather than transform the invoice into a credit - JM
				//===============================================================================================
				if((invIntId =='not found' && creditNo!=0) || invoiceStatus=='Paid In Full')
				{
					postCreditNoteNotAgainstAnInvoice(0);
				}
			}
			else
			{
				// deal with already posted for credit note
				nlapiLogExecution('AUDIT', 'Credit already posted', creditNo);
				auditTrail('FAILED', 'Credit already posted');
			}
		}

	}
	else
	{
		nlapiLogExecution('AUDIT', 'failed to post invoice', invoiceCSV);
		auditTrail('FAILED', 'CSV not well formed');
	} 
	

}

/**
 * load the audit record which also contains the csv payload
 * @param type
 */
function loadAuditRecord(type)
{
	var recordID = nlapiGetRecordId();

	auditRec = nlapiLoadRecord('customrecord_invoiceaudit', recordID);
	nlapiLogExecution('DEBUG', 'csv', auditRec.getFieldValue('custrecord_payload'));
}


/**
 * post invoice details to netsuite
 * 1.0.9 correction made if header not created
 */
function postInvoiceIntoNetsuite()
{

	var entity='';
	var item='';
	var auditDesc='Success';
	

	try
	{

		// set values for the invoice header
		if(invoiceHeader()==true)
		{
			for(var x=0; x<=itemsArray.length-1;x++)
			{

				nlapiLogExecution('AUDIT', 'invoice line being set', 'invoice ' + invoiceNo);

				// set details for the invoice detail line
				invoiceDetailLine(x);

			}

			applyARRuleToInvoiceHead();

			// submit header and detail records
			invID = nlapiSubmitRecord(invoiceRecord, true);
			nlapiLogExecution('AUDIT', 'success', 'invoice ' + invoiceNo);

			auditTrail('TRUE', 'Invoice Posted');
		}
		
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'failed to post invoice');
		auditTrail('FAILED', 'postInvoiceIntoNetsuite ' + getErrorMessage(e));
	}             

}


/**
 * apply account receivable rule to the invoice header
 * 
 * 1.0.2 created 29/6/2012
 */


function applyARRuleToInvoiceHead()
{

	var arInternalID=0;
	
	arInternalID = determineAccountReceivable(channelDesc);
	invoiceRecord.setFieldValue('account', arInternalID);

}

/**
 * apply account receivable rule to the credit note header if no existing invoice
 * 
 * 1.0.12 created 31/8/2012 - MJL
 */
function applyARRuleToCreditNoteHead()
{

	var arInternalID=0;
	
	arInternalID = determineAccountReceivable(channelDesc);
	creditMemo.setFieldValue('account', arInternalID);

}



/**
 * set invoice header details
 * 
 * 1.0.1 post patient details into Memo field (Description)
 * 1.0.2 add terms to the invoice body (header) 
 * 1.0.4 do not populate the invoice body with the terms where terms not set
 * 1.0.9 better error trapping
 * 1.0.16 add patient info to custom field
 */
function invoiceHeader()
{
	var postPerdiodIntID = 0;
	var retVal = true;
	var dateInvoice = null;
	
	try
	{
		

		invoiceRecord = nlapiCreateRecord("invoice");
		invoiceRecord.setFieldValue('tranid', invoiceNo);
		invoiceRecord.setFieldValue('recordtype', 'invoice');

		invoiceRecord.setFieldValue('memo', patientDetails);

		dateInvoice = reverseDate(invoiceDate);
		invoiceRecord.setFieldValue('trandate', dateInvoice);
		
		invoiceRecord.setFieldValue('custbody_patientnumber', patientDetails);		// 1.0.18
		
		if(interCompanyTag!='not found' && interCompanyTag.length > 0) {
			var interCompanyInternalID = genericSearch('customrecord_intercompanyclass','custrecord_intercompany_tagname',interCompanyTag);
                	invoiceRecord.setFieldValue('custbody_invoice_intercompany_tag', interCompanyInternalID);
		}

		// lookup customer, if it does not exist, create it
		entity = lookupCustomer(jdeid);

		if(entity!='not found')
		{

			invoiceRecord.setFieldValue('entity', entity);              

			// 1.0.4 if terms is blank do not populate
			if (terms != 0)
			{
				invoiceRecord.setFieldValue('custbody_terms', terms);
			}

			postPerdiodIntID = lookupPostingPeriod('accountingperiod',dateInvoice);		// 1.0.6 lookup posting period

			if(postPerdiodIntID != 'not found')
			{
				invoiceRecord.setFieldValue('postingperiod',postPerdiodIntID);
			}
			else
			{
				nlapiLogExecution('AUDIT', 'Cannot lookup posting period for invoice date', dateInvoice);
				retVal = false;
			}

			// to do error condition                
		}
		else
		{
			auditTrail('FAILED', 'Cannot find customer: ' + jdeid);
			retVal = false;
		}
		
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'failed to commit invoice line');
		auditTrail('FAILED', 'invoiceHeader ' + getErrorMessage(e));
		retVal=false;

	}

	return retVal;
	
}

/**
 * set invoice line item details
 *  
 * 1.0.2 changed the channel ship to bill to
 */
function invoiceDetailLine(x)
{

	var taxCode = '';
	var taxCodeInternalID=0;
	var tempClass='';
	var discPercent=0;


	try
	{

		itemObj = itemsArray[x]; 


		// change the item code if this is negative as this is a discount line
		if(itemObj.serviceAmount<0)
		{

			// store the class from the previous invoice line - this will be used for the invoice line
			// class = product family

			tempClass = journalClass;
			item = getDiscountProductCode(itemObj.code);

			journalClass = tempClass;

			// calculate the discount percentage
			discPercent = (itemObj.serviceAmount / invoiceTotal) * 100;

		}
		else
		{
			item = lookupItem(itemObj.code); // lookup item
		}

		invoiceRecord.selectNewLineItem('item');
		invoiceRecord.setCurrentLineItemValue('item', 'item', item);      
		invoiceRecord.setCurrentLineItemValue('item', 'description', itemObj.desc);

		nlapiLogExecution('DEBUG', 'Item type', invoiceRecord.getCurrentLineItemValue('item', 'itemtype'));

		invoiceRecord.setCurrentLineItemValue('item', 'rate', (itemObj.serviceAmount - itemObj.vatAmount));	

		entity = lookupCustomer(jdeid);

		// added back 2012-06-21
		invoiceRecord.setCurrentLineItemValue('item', 'custcol_shipto', itemObj.shipTo);

		// lookup the ship to customer to extract the region

		entity = lookupCustomer(itemObj.shipTo);

		invoiceRecord.setCurrentLineItemValue('item', 'custcol_region', region);		// set region for the ship to	
		invoiceRecord.setCurrentLineItemValue('item', 'custcol_channelshipto', channel);	

		entity = lookupCustomer(itemObj.billTo);

		invoiceRecord.setCurrentLineItemValue('item', 'custcol_channelbillto', channel);	


		// set the vat code
		taxCode = itemObj.vatCode;
		taxCodeInternalID = getTaxCode(taxCode);

		invoiceRecord.setCurrentLineItemValue('item', 'taxcode', taxCodeInternalID);

		// set the vat amount
		invoiceRecord.setCurrentLineItemValue('item', 'tax1amt', itemObj.vatAmount);
		invoiceRecord.setCurrentLineItemValue('item', 'class', journalClass);

		invoiceRecord.commitLineItem('item');

	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'failed to commit invoice line');
		auditTrail('FAILED', 'invoiceDetailLine' + getErrorMessage(e));

	}

}

/**
 * get discount product code
 */

function getDiscountProductCode(itemCode)
{

	var itemInternalID = '';

	try
	{
		itemInternalID = lookupItem(discountItem); // lookup item
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot find discount item');
		auditTrail('FAILED', 'getDiscountProductCode ' + getErrorMessage(e));
	}
	return itemInternalID;

}


/**
 * get invoice header details
 *  
 * 1.0.1 splitting out patient details
 * 1.0.6 extract credit note number
 */
function getInvoiceHeaderDetails()
{
	try
	{
		invoiceNo = splitOutValue(invoiceSplit[4]);
		invoiceDate = splitOutValue(invoiceSplit[5]);
		jdeid = splitOutValue(invoiceSplit[3]);
		patientDetails = splitOutValue(invoiceSplit[12]);
                interCompanyTag = splitOutValue(invoiceSplit[18]);

		creditNo = splitOutValue(invoiceSplit[6]);	// 1.0.6 extract credit notes number
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot get invoice header details');
		auditTrail('FAILED', 'getInvoiceHeaderDetails ' + getErrorMessage(e));
	}

}

/**
 * get invoice line details
 * 
 */
function getInvoiceLineDetails()
{
	
	try
	{
		itemObj = new Object();
		itemObj.code = splitOutValue(invoiceSplit[16]);
		itemObj.disccountCode = itemObj.code; 	// 1.0.6 done because the code will be overridden to the discount item code where  the item is a discount line and 
												// we need to preserve the item code so we can get the product class later

		itemObj.desc = splitOutValue(invoiceSplit[17]);
		itemObj.serviceAmount = splitOutValue(invoiceSplit[1]);

		// used to calculate the discount percentage
		if(itemObj.serviceAmount>0)
		{
			invoiceTotal = invoiceTotal + itemObj.serviceAmount;
		}

		itemObj.vatAmount = splitOutValue(invoiceSplit[2]);
		itemObj.vatCode = splitOutValue(invoiceSplit[11]);
		itemObj.billTo = splitOutValue(invoiceSplit[14]);
		itemObj.shipTo = splitOutValue(invoiceSplit[15]);

		itemsArray[itemsCount] = itemObj;
		itemsCount = itemsCount + 1;
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot get invoice line details');
		auditTrail('FAILED', 'getInvoiceLineDetails ' + getErrorMessage(e));
	}

	
}


/**
 * set the VAT code
 * 1.0.4 lookup vat code using netsuite vat descriptions - change to the invoice feed  
 */

function getTaxCode(taxCode)
{

	var internalID = 'not found';

	try
	{
		internalID = genericSearch('salestaxitem','itemid',taxCode);
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot get tax code');
		auditTrail('FAILED', 'getTaxCode ' + getErrorMessage(e));
	}

	return internalID;

}


/**
 * strip off the speech marks
 */

function splitOutValue(element)
{
	var retValue = '';

	try
	{
		retValue = element.substring(1, element.length - 1).toString();

		retValue = retValue.replace('\'','');
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot split out values');
		auditTrail('FAILED', 'splitOutValue ' + getErrorMessage(e));
	}

	return retValue;
}


/**
 * remove whitespace from a string
 */

function trim(trimString)
{
	return trimString.replace(/^\s+|\s+$/g,"");
}


/**
 * convert reverse date ie yyyymmdd date string to NS date
 */
function convertToNSDate(dateOfBirth)
{
	var retVal = '';
	var year = '';
	var month = '';
	var day = '';
	var dateObj = '';

	try
	{
		year = dateOfBirth.substring(0, 4);
		month = dateOfBirth.substring(4, 2);
		day = dateOfBirth.substring(6, 2);

		dateObj = new Date(year, month, day);

		retVal = nlapiDateToString(dateObj);
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot reverse date');
		auditTrail('FAILED', 'convertToNSDate ' + getErrorMessage(e));
	}
	
	return retVal;
}

/**
 * create journal entries for consultants
 * 1.0.3 added terms
 */
function lookupCustomer(companyID)
{
	var internalID='not found';

	// Arrays
	var customerSearchFilters = new Array();
	var customerSearchColumns = new Array();

	try
	{
		//search filters                  
		customerSearchFilters[0] = new nlobjSearchFilter('entityid', null, 'is',companyID);                          

		// search columns
		customerSearchColumns[0] = new nlobjSearchColumn('internalid');
		customerSearchColumns[1] = new nlobjSearchColumn('custentity_region'); //region
		customerSearchColumns[2] = new nlobjSearchColumn('custentity_channel'); // 
		customerSearchColumns[3] = new nlobjSearchColumn('custentity_terms'); // 

		// perform search
		var customerSearchResults = nlapiSearchRecord('customer', null, customerSearchFilters, customerSearchColumns);

		if(customerSearchResults!=null)
		{
			if(customerSearchResults.length>0)
			{
				var customerSearchResult = customerSearchResults[0];
				internalID = customerSearchResult.getValue('internalid');
				region = customerSearchResult.getValue('custentity_region');
                                regionDesc = customerSearchResult.getText('custentity_region');
				channel = customerSearchResult.getValue('custentity_channel');
				channelDesc = customerSearchResult.getText('custentity_channel');
				
				///zzzzz
				nlapiLogExecution('DEBUG', 'customer channeldesc', channelDesc);
				
				terms = customerSearchResult.getValue('custentity_terms');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', "Cannot get customer, lookupCustomer " + getErrorMessage(e));
	}             
	return internalID;
}



/**
 * create journal entries for consultants
 * 1.0.5 class looked up from item
 * 1.0.10 change from contains to is
 */
function lookupItem(itemID)
{
	var internalID='';

	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	try
	{
		//search filters 
		//itemSearchFilters[0] = new nlobjSearchFilter('itemid', null, 'contains', itemID);                          
		itemSearchFilters[0] = new nlobjSearchFilter('itemid', null, 'is', itemID);			// 1.0.10                          

		// return columns
		itemSearchColumns[0] = new nlobjSearchColumn('internalid');
		itemSearchColumns[1] = new nlobjSearchColumn('class');

		// perform search
		var itemSearchResults = nlapiSearchRecord('item', null, itemSearchFilters, itemSearchColumns);

		journalClass = '';

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				journalClass = itemSearchResult.getValue('class');
			}
		}

	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot find item, lookupItem ' + getErrorMessage(e));
	}             


	return internalID;

}



/**
 * update the audit record to indicate success or failure of a posting
 * 
 * @param success
 * @returns {Number}
 */
function auditTrail(success, status)
{

	var auditID=0;
	var desc='';

	try
	{

		desc = 'CSV Invoice: ' + invoiceNo;

		auditRec.setFieldValue('custrecord_description', desc);
		auditRec.setFieldValue('custrecord_processed', success);
		auditRec.setFieldValue('custrecord_status', status);

		auditID = nlapiSubmitRecord(auditRec, true);
		nlapiLogExecution('DEBUG', 'POSTED AUDIT UPDATE', 'AUDIT UPDATE');

	}
	catch(e)
	{
		errorHandler(e);
	}             

	return auditID;


}

/**
 * general error handler
 * 
 * @param e
 */
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());

}

/**
 * get error message
 * 
 * @param e
 */

function getErrorMessage(e)
{
	var retVal='';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}

	return retVal;
}


/**
 * reverse date i.e. 2012-05-17 to 17/5/2012
 * 
 * 1.0.15 fixed leading zero in date causing due date issues - MJL
 */

function reverseDate(dateStr)
{
	var retVal = null; 
	var day=0;
	var month=0;
	var year = '';
	var newDate='';

	try
	{

		year = dateStr.substring(0, 4);
		month = dateStr.substring(5, 7);
		day = dateStr.substring(8, 10);
		
		month = month.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		day = day.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		
		newDate = day + "/" + month + "/" + year;
		retVal =  newDate;
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot reverse date');
		auditTrail('FAILED', 'reverseDate ' + getErrorMessage(e));
	}
	return retVal;

}

/**
 * convert CSV converted characters back
 * @param CSV
 * @returns {String}
 */
function UNencodeCSV(CSVdecode)
{
	var retVal='';

	try
	{
		CSVdecode = CSVdecode.replace(/&amp;/g,'&');
		CSVdecode = CSVdecode.replace(/&lt;/g,'<');
		CSVdecode = CSVdecode.replace(/&gt;/g,'>');
		CSVdecode = CSVdecode.replace(/&quot;/g,'\'');
		CSVdecode = CSVdecode.replace(/&#xD;/g,'\r');
		CSVdecode = CSVdecode.replace(/&#xA;/g,'\n');  

		retVal = CSVdecode;
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot decode');
		auditTrail('FAILED', 'UNencodeCSV ' + getErrorMessage(e));
	}

	
	return retVal;
}


//Removes white spaces after
function rtrim(str) 
{
       var chars = "\\s";
       return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}



/**
 * lookupinvoice
 * 1.0.18 - return status of invoice
 * 1.0.19 - get sub total
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';
	var invoice = null;

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is',invoiceNo);                          
		invoiceSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');                      

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');
		
		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

		internalID='not found';
		
		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				
				invoice = nlapiLoadRecord('invoice', internalID);
				
				invoiceStatus = invoice.getFieldValue('status');		// 1.0.18
				
				invTotalNS = invoice.getFieldValue('total');			// 1.0.19 get the total from the invoice
				remaining = invoice.getFieldValue('amountpaid');	// 1.0.19 get the total from the invoice
				
				nlapiLogExecution('AUDIT', 'Invoice Status: ' + invoiceStatus, invoiceStatus);
				nlapiLogExecution('AUDIT', 'Total: ' + invTotalNS, invTotalNS);
				nlapiLogExecution('AUDIT', 'Paid Amount: ' + remaining, remaining);

				
			}
		}
	}
	catch(e)
	{
		internalID='not found';
		errorHandler(e);
		auditTrail('FAILED', 'lookupInvoice ' + getErrorMessage(e));
	}     	      

	return internalID;
}


/**
 * determine the accounts receivable nominal code
 * rule = if bill to is distributor the A/R Account is 1161.002 otherwise it's 1161.001
 * [TODO] remove hardcoded account values 1161.002 & 1161.001
 * 1.0.2   
 */
function determineAccountReceivable(billToChannelDesc)
{

	var accountReceivable = '';
	var arInternalID = '';

	try
	{

		billToChannelDesc = billToChannelDesc.toUpperCase();

		if(billToChannelDesc.indexOf('DISTRIBUTOR') != -1)
		{
			if(regionDesc=='AU') {
                              accountReceivable = '1161.010';
                        } else  if(regionDesc=='HK') {
                              accountReceivable = '1161.011';
                        } else {
                              accountReceivable = '1161.002';
                        }
		}
		else
		{
			accountReceivable = '1161.001';
		}

		nlapiLogExecution('AUDIT', 'Accounts receivable selection', accountReceivable + " : "+billToChannelDesc);

		arInternalID = genericSearch('account','number',accountReceivable);
	}
	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'cannot determine account receivable');
		auditTrail('FAILED', 'determineAccountReceivable ' + getErrorMessage(e));
	}

	
	return arInternalID;
}


/**
 * generic search - returns internal ID
 * 1.0.2 added
 */

function genericSearch(tableName, fieldToSearch, valueToSearch)
{
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);	
		auditTrail('FAILED', 'genericSearch ' + getErrorMessage(e));
	}     	      

	return internalID;
}


/**
 * generic search between - returns internal ID
 * 1.0.6 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */

function lookupPostingPeriod(tableName, valueToSearch)
{
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter('startdate', null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter('enddate', null, 'onOrAfter', valueToSearch);                          
		searchFilters[2] = new nlobjSearchFilter('isadjust', null, 'is', 'F');                          
		searchFilters[3] = new nlobjSearchFilter('isyear', null, 'is', 'F');                          
		searchFilters[4] = new nlobjSearchFilter('isquarter', null, 'is', 'F');                          
 
		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'lookupPostingPeriod ' + getErrorMessage(e));
	}     	      

	return internalID;
}




/**
 * post creditnote transaction into netsuite
 * 			1.0.6 - 20 July 2012 - added - post full credit note 
 * 			1.0.6 - 20 July 2012 - added - post full credit note
 * 			1.0.16 corrected error message MJL
 * 			1.0.17 change Auto Apply flag to false MJL
 * 			1.0.18 - 17 Sept - amended - add patient + invoice number cust fields update
 * 			1.0.19 - call findLineItemValue() to credit specific invoice - MJL
 */
function postCreditNote(invIntID)
{
	
	var creditMemoID = 0;
	var invLineNum = 0;

	try
	{
		// full credit
		
		creditMemo = nlapiTransformRecord('invoice', invIntID, 'creditmemo');

		creditMemo.setFieldValue('autoapply', 'F'); //1.0.17 change Auto Apply flag to false MJL
		
		creditMemo.setFieldValue('tranid', creditNo);
		creditMemo.setFieldValue('customform', alignCreditMemo);
		creditMemo.setFieldValue('memo', 'Credit posted for invoice: ' + invoiceNo + '\n Patient Number: ' + patientDetails);	// 1.0.18

		creditMemo.setFieldValue('custbody_patientnumber', patientDetails);		// 1.0.18
		
		if(interCompanyTag!='not found' && interCompanyTag.length > 0) {
			var interCompanyInternalID = genericSearch('customrecord_intercompanyclass','custrecord_intercompany_tagname',interCompanyTag);
		  	creditMemo.setFieldValue('custbody_invoice_intercompany_tag', interCompanyInternalID);
		}
                
                
		creditMemo.setFieldValue('custbody_invoicenumber', invoiceNo);			// 1.0.18
	
		creditMemoID = nlapiSubmitRecord(creditMemo, true); 

		auditTrail('TRUE', 'Posted Full Credit');
		nlapiLogExecution('AUDIT', 'success', 'Credit note posted for invoice: ' + invoiceNo);
	}
	catch(e)
	{
		nlapiLogExecution('AUDIT', 'failure', 'failed to post creditnote for invoice: ' + invoiceNo);
		errorHandler(e);
		auditTrail('FAILED', 'postCreditNote - Cannot post credit note ' + creditNo + ' for invoice ' + invoiceNo); //1.0.16 corrected error message MJL
	}

	return creditMemoID;

}


/**
 * post creditnote transaction into netsuite not against an invoice
 * 			1.0.6 - 20 July 2012 - added - post full credit note
 * 			1.0.8 - 30 July 2012 - amended - credit values not being posted correctly
 * 			1.0.12 - 31 Aug 2012 - amended - applies AR rule - MJL
 * 			1.0.13 - 31 Aug 2012 - amended - added invoice ref to memo field - MJL
 * 			1.0.14 - 03 Sep 2012 - amended - changed memo description - MJL
 * 			1.0.17 - 03 Sep 2012 - amended - turn off auto apply JM
 *			1.0.18 - 17 Sep 2012 - amended - added custom fields to store the invoice number and patient information so that max cred extract can pick these values up
 *											 custbody_invoicenumber + custbody_patientnumber + need to check the status of the invoice before posting a credit i.e. if there is a payment
 *											 then we cannot post the credit against the invoice - the credit will need to be posted on account
 *			1.0.19 - 11 Oct 2012 - amended - add invoice int ID to connect credit to invoice		
 */

function postCreditNoteNotAgainstAnInvoice(invIntID)
{

	var lineCount = 0;
	var item='';
	var lineTotal = 0;
	var postPerdiodIntID = 0;
	var vatAmount = 0;				// 1.0.8
	var desc = '';					// 1.0.18
	var invLineNum = 0;				// 1.0.19
	var entity='';
	var dateCredit = null;			// 1.0.19
	

	try
	{

		//******************************
		// header
		//******************************
		
		creditMemo = nlapiCreateRecord('creditmemo');
		creditMemo.setFieldValue('customform', alignCreditMemo);

		entity = lookupCustomer(jdeid);
		creditMemo.setFieldValue('entity', entity);
		
		creditMemo.setFieldValue('tranid', creditNo);
		creditMemo.setFieldValue('recordtype', 'creditmemo');
		creditMemo.setFieldValue('subsidiary', journalSubsidiary);
		
		// 1.0.19 removed autoapply
//		creditMemo.setFieldValue('autoapply', 'T'); //1.0.17 change Auto Apply flag to false MJL
		creditMemo.setFieldValue('autoapply', 'F'); //1.0.19 change Auto Apply flag to false MJL
		
		
		dateCredit = reverseDate(invoiceDate);
		creditMemo.setFieldValue('trandate',dateCredit);	// 1.0.19 
		
		creditMemo.setFieldValue('custbody_patientnumber', patientDetails);		// 1.0.18
		
                if(interCompanyTag!='not found' && interCompanyTag.length > 0) {
			var interCompanyInternalID = genericSearch('customrecord_intercompanyclass','custrecord_intercompany_tagname',interCompanyTag);
		  	creditMemo.setFieldValue('custbody_invoice_intercompany_tag', interCompanyInternalID);
		}
		
		creditMemo.setFieldValue('custbody_invoicenumber', invoiceNo);			// 1.0.18
		
		desc = 'Credit posted for previously closed invoice: '; 
		
		nlapiLogExecution('DEBUG', 'invoice status', invoiceStatus); //mjl debug [TODO]
		
		if(invoiceStatus=='Paid In Full')
		{
			desc = 'Credit posted on account for an invoice that has been paid in full: ';
			creditMemo.setFieldValue('custbody_invoiceexists', 'T');		// 1.0.18 to mark a credit where the invoice is fully paid - this is so max cred can differentiate between credits 
		}

		
		creditMemo.setFieldValue('memo', desc + invoiceNo + '\n Patient Number: ' + patientDetails); 	//1.0.13 added invoice ref + 1.0.14 changed memo description - 1.0.18 add patient info

		postPerdiodIntID = lookupPostingPeriod('accountingperiod',dateCredit);		// 1.0.6 lookup posting period

		if(postPerdiodIntID != 'not found')
		{
			creditMemo.setFieldValue('postingperiod',postPerdiodIntID);
		}
		else
		{
			nlapiLogExecution('AUDIT', 'Cannot lookup posting period for date', dateCredit);
		}
		
		//******************************
		// detail
		//******************************

		if(entity.length!=0)
		{
			// deal with credit lines
			for(var x=0; x<=itemsArray.length-1;x++)
			{

				itemObj = itemsArray[x];

				// check if this is a discount line ### NOTE A DISCOUNT IS POSITIVE FOR A CREDIT ####
				if(itemObj.serviceAmount>0)
				{
					
					// store the class from the previous invoice line - this will be used for the invoice line
					// class = product family
					item = lookupItem(itemObj.code); // lookup item
					tempClass = journalClass;
					item = getDiscountProductCode(itemObj.code);
					
					journalClass = tempClass;
					
				}
				else
				{
					item = lookupItem(itemObj.code); // lookup item
				}
				
				// 1.0.8
				lineTotal = -(itemObj.serviceAmount - itemObj.vatAmount);		
				vatAmount = -(itemObj.vatAmount);

				creditMemo.selectNewLineItem('item');
				creditMemo.setCurrentLineItemValue('item', 'item', item);      
				creditMemo.setCurrentLineItemValue('item', 'description', itemObj.desc);
				creditMemo.setCurrentLineItemValue('item', 'rate', lineTotal);

				entity = lookupCustomer(jdeid);
				creditMemo.setCurrentLineItemValue('item', 'custcol_shipto', itemObj.shipTo);

				// lookup the ship to customer to extract the region
				entity = lookupCustomer(itemObj.shipTo);

				creditMemo.setCurrentLineItemValue('item', 'custcol_region', region);		// set region for the ship to	
				creditMemo.setCurrentLineItemValue('item', 'custcol_channelshipto', channel);	

				entity = lookupCustomer(itemObj.billTo);
				creditMemo.setCurrentLineItemValue('item', 'custcol_channelbillto', channel);	

				taxCode = itemObj.vatCode;													// set tax code
				taxCodeInternalID = getTaxCode(taxCode);

				creditMemo.setCurrentLineItemValue('item', 'taxcode', taxCodeInternalID);
				creditMemo.setCurrentLineItemValue('item', 'tax1amt', vatAmount);			// set tax amount 1.0.8
				creditMemo.setCurrentLineItemValue('item', 'class', journalClass);			// product family class

				creditMemo.commitLineItem('item');

			}
			
			applyARRuleToCreditNoteHead(); //1.0.12 apply AR rule - MJL
			
			creditMemoID = nlapiSubmitRecord(creditMemo);
			nlapiLogExecution('AUDIT', 'success', desc + creditNo);
			auditTrail('TRUE', desc + creditNo);
		}
		else
		{
			nlapiLogExecution('AUDIT', 'failure', 'Cannot post credit note, cannot find customer for credit ' + creditNo + ", JDEID " + jdeid);
			auditTrail('FAILED', 'Cannot post credit note, cannot find customer for credit ' + creditNo + ", JDEID " + jdeid);
		}
	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot create credit note - postCreditNoteNotAgainstAnInvoice ' + getErrorMessage(e));
	}

}

/**
 * generic search between - returns internal ID
 * 1.0.6 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */

function lookupPostingPeriod(tableName, valueToSearch)
{
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter('startdate', null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter('enddate', null, 'onOrAfter', valueToSearch);                          
		searchFilters[2] = new nlobjSearchFilter('isadjust', null, 'is', 'F');                          
		searchFilters[3] = new nlobjSearchFilter('isyear', null, 'is', 'F');                          
		searchFilters[4] = new nlobjSearchFilter('isquarter', null, 'is', 'F');                          
 
		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);	
	}     	      

	return internalID;
}



/**
 * post creditnote transaction into netsuite
 * 			1.0.19 - created - created a credit from an invoice - delete the lines from the invoice
 * 			1.0.20 - 31 Oct 2012 - amended - correct credit note posting multiple lines, removing invoice lines from a transformed invoice to credit
 * returns -1 if credit does not match the invoice otherwise return the credit ID
 */
function postCreditNoteApply(invIntID)
{
	
	var creditMemoID = 0;
	var invLineNum = 0;
	var lineCount = 0;
	var dateCredit = null;		// 1.0.19
	var exchangeRate = 0;		// 1.0.19
	var currency = '';			// 1.0.19
	

	try
	{
		
		//************************************
		// credit note header
		//************************************
		
		creditMemo = nlapiTransformRecord('invoice', invIntID, 'creditmemo');

//		creditMemo.setFieldValue('autoapply', 'T'); //1.0.17 change Auto Apply flag to false MJL
		creditMemo.setFieldValue('autoapply', 'F'); //1.0.19 change Auto Apply flag to false MJL
		 
		creditMemo.setFieldValue('tranid', creditNo);
		creditMemo.setFieldValue('customform', alignCreditMemo);
		creditMemo.setFieldValue('memo', 'Credit posted for invoice: ' + invoiceNo + '\n Patient Number: ' + patientDetails);	// 1.0.18

		dateCredit = reverseDate(invoiceDate);
		creditMemo.setFieldValue('trandate',dateCredit);	// 1.0.19

		currency = creditMemo.getFieldValue('currency');				// get transaction currency
		exchangeRate = nlapiExchangeRate(currency,'EUR',dateCredit);	// 1.0.19 lookup exchange rate 
		creditMemo.setFieldValue('exchangerate',exchangeRate);			// 1.0.19

		
		
		creditMemo.setFieldValue('custbody_patientnumber', patientDetails);		// 1.0.18
                
                if(interCompanyTag!='not found' && interCompanyTag.length > 0) {
			var interCompanyInternalID = genericSearch('customrecord_intercompanyclass','custrecord_intercompany_tagname',interCompanyTag);
		  	creditMemo.setFieldValue('custbody_invoice_intercompany_tag', interCompanyInternalID);
		}
		
		creditMemo.setFieldValue('custbody_invoicenumber', invoiceNo);			// 1.0.18
		
		postPerdiodIntID = lookupPostingPeriod('accountingperiod',dateCredit);		// 1.0.19 lookup posting period

		if(postPerdiodIntID != 'not found')
		{
			creditMemo.setFieldValue('postingperiod',postPerdiodIntID);
		}
		else
		{
			nlapiLogExecution('AUDIT', 'Cannot lookup posting period for date', dateCredit);
		}
		
		//1.0.20 - finds line number of relevant invoice on Apply sublist and ticks Apply flag - MJL

		invLineNum = creditMemo.findLineItemValue('apply', 'refnum', invoiceNo);
		creditMemo.setLineItemValue('apply', 'apply', invLineNum, 'T');
		

		//********************************************
		// remove items from the transformed invoice
		// 1.0.20 - always remove the 1st line as line 
		// 2 will become line 1 when line 1 is removed 
		//********************************************
		lineCount = creditMemo.getLineItemCount('item');
		for(var i=1; i<=lineCount; i++)
		{
			//creditMemo.removeLineItem('item', i);	
			creditMemo.removeLineItem('item', 1);	
		}

		//*******************************
		// add credit note lines
		//*******************************
		addCreditLines(creditMemo);
		
		applyARRuleToCreditNoteHead(); //1.0.12 apply AR rule - MJL


		creditMemoID = nlapiSubmitRecord(creditMemo, true); 

		auditTrail('TRUE', 'Posted Credit');
		nlapiLogExecution('AUDIT', 'success', 'Credit note posted for invoice: ' + invoiceNo);
	}
	catch(e)
	{
		nlapiLogExecution('AUDIT', 'failure', 'postCreditNoteApply - failed to post creditnote for invoice: ' + invoiceNo);
		errorHandler(e);
		auditTrail('FAILED', 'postCreditNoteApply - Cannot post credit note ' + creditNo + ' for invoice ' + invoiceNo); //1.0.16 corrected error message MJL
		
		
		// check if the credit and invoice lines are the same
		// if they are not return -1
		if(getErrorMessage(e).indexOf('LINKED_ACCT_DONT_MATCH') != -1)
		{
			creditMemoID = -1;
		}
		
	}

	return creditMemoID;

}


/**
 * add credit note lines
 * 			1.0.19 - call findLineItemValue() to credit specific invoice - MJL
 */

function addCreditLines(creditMemo)
{


	var lineCount = 0;
	var item='';
	var lineTotal = 0;
	var postPerdiodIntID = 0;
	var vatAmount = 0;				// 1.0.8
	var desc = '';					// 1.0.18
	var invLineNum = 0;				// 1.0.19
	var entity='';	
	var taxCode = '';
	var taxCodeInternalID=0;
	
	for(var x=0; x<=itemsArray.length-1;x++)
	{

		itemObj = itemsArray[x];

		// check if this is a discount line ### NOTE A DISCOUNT IS POSITIVE FOR A CREDIT ####
		if(itemObj.serviceAmount>0)
		{
			
			// store the class from the previous invoice line - this will be used for the invoice line
			// class = product family
			item = lookupItem(itemObj.code); // lookup item
			tempClass = journalClass;
			item = getDiscountProductCode(itemObj.code);
			
			journalClass = tempClass;
			
		}
		else
		{
			item = lookupItem(itemObj.code); // lookup item
		}
		
		
		nlapiLogExecution('DEBUG', 'ITEMS', 'ITEM CODE: ' + itemObj.code);
		
		// 1.0.8
		lineTotal = -(itemObj.serviceAmount - itemObj.vatAmount);		
		vatAmount = -(itemObj.vatAmount);

		creditMemo.selectNewLineItem('item');
		creditMemo.setCurrentLineItemValue('item', 'item', item);      
		creditMemo.setCurrentLineItemValue('item', 'description', itemObj.desc);
		creditMemo.setCurrentLineItemValue('item', 'rate', lineTotal);

		entity = lookupCustomer(jdeid);
		creditMemo.setCurrentLineItemValue('item', 'custcol_shipto', itemObj.shipTo);

		// lookup the ship to customer to extract the region
		entity = lookupCustomer(itemObj.shipTo);

		creditMemo.setCurrentLineItemValue('item', 'custcol_region', region);		// set region for the ship to	
		creditMemo.setCurrentLineItemValue('item', 'custcol_channelshipto', channel);	

		entity = lookupCustomer(itemObj.billTo);
		creditMemo.setCurrentLineItemValue('item', 'custcol_channelbillto', channel);	

		taxCode = itemObj.vatCode;													// set tax code
		taxCodeInternalID = getTaxCode(taxCode);

		creditMemo.setCurrentLineItemValue('item', 'taxcode', taxCodeInternalID);
		creditMemo.setCurrentLineItemValue('item', 'tax1amt', vatAmount);			// set tax amount 1.0.8
		creditMemo.setCurrentLineItemValue('item', 'class', journalClass);			// product family class

		creditMemo.commitLineItem('item');

	}
	


}



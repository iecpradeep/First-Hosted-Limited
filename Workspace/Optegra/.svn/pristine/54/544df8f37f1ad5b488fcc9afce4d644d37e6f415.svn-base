/*************************************************************************
 * Name: xmlPayment.js
 * Script Type: user event
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 23 May 2012 - 1st release - JM
 * Version: 1.0.1 - 08 Jun 2012 - amended JM -location not being picked up from invoice 
 * Version: 1.0.2 - 22 Jun 2012 - amended JM -payment description not being populated to relate back to invoice - MODIFIED ON SITE
 *								- if not payment/invoice or creditnote - add audit information to show why not processed -
 *								-  bank account rule modification 
 * Version: 1.0.3 - 06 Jul 2012 - debug code added - removed the description update as the field does not exist
 * Version: 1.0.4 - 09 Jul 2012 - invoice load routine, error trap & post transaction error trap
 * Version: 1.0.5 - 15 Jan 2013 - allow London payments to be made 
 * 
 * 
 * Author: FHL
 * Purpose: Loads XML file, splits out values and creates invoice record
 * is called by a user event called customscript_usereventxmlpayment
 * 
 * Script: customscript_usereventxmlpayment 
 * Deploy: customdeploy_usereventxmlpayment
 *
 * fields added to transaction columns applied to sale item
 * 
 * [TODO] relate this payment back to the invoice description required 
 * 
 * 
 **************************************************************************/

var auditRec=null;
var transactionSplit;
var transactionXML='';
var paymentRec = null;

var msgID = '';
var clinic='';
var paymentTotal = '';
var paymentMethod = '';
var paymentFrom = '';
var paymentDate = '';
var comments = '';
var cuid = '';
var invoiceNo = '';

var department = 0;
var classID = 0;
var location = 0;
var subsidiary = 0;
var arAccount = 0;
var account = 0;
var invoiceIntID = 0;

var payment = null;
var invRecord = null;
var refnums = new Array();


/**
 * process payment
 */
function processPayment(type)
{
	
	var process='FALSE';
	// load the audit record (which contains the XML payload).
	loadAuditRecord(type);

	if(auditRec.getFieldValue('custrecord_processed')=='FALSE')
	{

		loadParameters();
		
		// load the xml from the audit record
		transactionXML = auditRec.getFieldValue('custrecord_payload');
		transactionXML = UNencodeXML(transactionXML);

		
		// this code only deals with the payment files
		// if not payment/invoice or creditnote - add audit information to show why not processed

		if(transactionXML.indexOf('DGLReceipt') != -1)
		{
			
			transactionSplit = transactionXML.split('</');
			   
			// get the details from the xml structure
			for(var i = 0; i < transactionSplit.length; i++)
			{
				transactionElement = transactionSplit[i];
				gettransactionDetails();
			}
			
			// post details to netsuite
			if(invoiceNo.length>0)
			{
				invoiceIntID = loadInvoice(invoiceNo);				
				posttransactionIntoNetsuite(invoiceIntID);
				
			}
			else
			{
				nlapiLogExecution('AUDIT', 'failed to post transaction', transactionXML);
				auditTrail('FAILED','XML not well formed');
			}
		}
		else
		{
			
			// if not payment/invoice or creditnote - add audit information to show why not processed
			if((transactionXML.indexOf('DGLReceipt') == -1) && (transactionXML.indexOf('DGLInvoice') == -1) && (transactionXML.indexOf('DGLCreditNote') == -1))
			{
				auditTrail('NOT SUPPORTED','Not an Invoice/Credit Note/Payment');
			}
		}
	}
	
}

/**
 * get data from xml
 */
function gettransactionDetails()
{
	//msg details
	if(transactionElement.indexOf('<MsgID>') != -1)
	{
		msgID = splitOutValue(transactionElement, 'MsgID');
	}
	
	//msg details
	if(transactionElement.indexOf('<MsgSenderLicenseName>') != -1)
	{
		clinic = splitOutValue(transactionElement, 'MsgSenderLicenseName');
	}
	
	
	
	if(transactionElement.indexOf('<PaymentTotal>') != -1)
	{
		paymentTotal = splitOutValue(transactionElement, 'PaymentTotal');
	}

	if(transactionElement.indexOf('<PaymentMethod>') != -1)
	{
		paymentMethod = splitOutValue(transactionElement, 'PaymentMethod');
	}
	   
	if(transactionElement.indexOf('<PaymentFrom>') != -1)
	{
		paymentFrom = splitOutValue(transactionElement, 'PaymentFrom');
	}
	
	if(transactionElement.indexOf('<PaymentDate>') != -1)
	{
		paymentDate = splitOutValue(transactionElement, 'PaymentDate');
	}
	   
	if(transactionElement.indexOf('<Comments>') != -1)
	{
		comments = splitOutValue(transactionElement, 'Comments');
	}
	   
	if(transactionElement.indexOf('<Cuid>') != -1)
	{
		cuid = splitOutValue(transactionElement, 'Cuid');
	}

	if(transactionElement.indexOf('<InvoiceNo>') != -1)
	{
		invoiceNo = splitOutValue(transactionElement, 'InvoiceNo');
	}
}


/**
 * post payment transaction into netsuite
 * 1.0.2 bank account rule added - memo now populated
 * 1.0.3 removed description
 * 1.0.4 - 09 Jul 2012 - post transaction error trap

 */
function posttransactionIntoNetsuite(invIntID)
{
	
	var paymentID = 0;
	var paymentDate = '';
	var applyLineNum = null; 
	var bankInternalID=0;
	var errorMessage = '';		// 1.0.4
	
	nlapiLogExecution('AUDIT', 'START INVOICE POST', 'STARTING TO POST PAYMENT FOR INVOICE: ' + invoiceNo);

	
	try
	{

		// set the payment header details
		paymentRec = nlapiTransformRecord('invoice', invIntID, 'customerpayment');
		paymentRec.setFieldValue('location', location);		// loaded from the invoice
		paymentRec.setFieldValue('payment', paymentTotal);
		paymentRec.setFieldValue('undepfunds', 'F');
				
		bankInternalID = paymentBankNominalRule(clinic);
		
		paymentRec.setFieldValue('account', bankInternalID);
		
		// modified 1.0.2 - add description
		//paymentRec.setFieldValue('description', 'Payment posted for invoice: ' + invoiceNo);	// 1.0.3 removed
		paymentRec.setFieldValue('memo', 'Payment posted for invoice: ' + invoiceNo);
		
		

		// find the correct invoice line to pay and mark it as paid
		applyLineNum = findPaymentLine();
		
		paymentRec.setLineItemValue('apply', 'apply', applyLineNum, 'T');
		
		paymentID = nlapiSubmitRecord(paymentRec, true);
		
		auditTrail('TRUE','Posted');
		nlapiLogExecution('AUDIT', 'success', 'Payment posted for invoice: ' + invoiceNo);

	}
	catch(e)
	{
		// [TODO] change to deal with error code instead of desc
		errorHandler(e);
    	nlapiLogExecution('AUDIT', 'failure', 'failed to post payment for invoice: ' + invoiceNo + ':' + getErrorMessage(e));
    	
		errorMessage = getErrorMessage(e);
		
		if (errorMessage.indexOf('That record does not exist.') > 0)
		{
			errorMessage = 'The invoice ' + invoiceNo + ' associated with this payment does not exist.'; 
		}

		if (errorMessage.indexOf('invalid invoice reference') > 0)
		{
			errorMessage = 'The invoice ' + invoiceNo + ' associated with this payment does not exist.'; 
		}
		
    	auditTrail('FAILED', errorMessage);
	}
	
	return paymentID;
}


/**
 * find the payment line to mark as paid
 * 1.0.3 debug code added
 */
function findPaymentLine()
{
	var linenum = 0;
	var destInvNo='';
    
	lineCount = paymentRec.getLineItemCount('apply');

	nlapiLogExecution('DEBUG', 'FIND PAYMENT LINE', 'NUMBER OF LINES: ' + lineCount);

	
	
	for (var i = 1; i <= lineCount; i++)
	{
		refnums[i-1] = paymentRec.getLineItemValue('apply', 'refnum', i);
		nlapiLogExecution('DEBUG', 'FIND PAYMENT LINE', 'REF NUMS: ' + refnums[i-1]);

	}
	
	nlapiLogExecution('DEBUG', 'FIND PAYMENT LINE', 'TRYING TO FIND INVOICE: ' + invoiceNo);
	
	for(var i = 1; i <= refnums.length; i++)
	{
		linenum = i;	
		destInvNo = refnums[i-1];

		if (destInvNo == invoiceNo)
		{
			nlapiLogExecution('DEBUG', 'FIND PAYMENT LINE', 'FOUND: ' + destInvNo);
			break;
		}
	}
	return linenum;
}

/**
 * load the audit record which also contains the xml payload
 * @param type
 */
function loadAuditRecord(type)
{
	
	var recordID = nlapiGetRecordId();

	try
	{
		//recordID = 16002;
		
		auditRec = nlapiLoadRecord('customrecord_xml_load_audit', recordID);

		if(auditRec.getFieldValue('custrecord_payload').indexOf('DGLReceipt') != -1)
		{
			nlapiLogExecution('DEBUG', 'xml', auditRec.getFieldValue('custrecord_payload'));
		}
		
	}
	catch(e)
	{
		errorHandler(e);		
		auditTrail('FAILED','Cannot load audit record ' + getErrorMessage(e));
	}
	

}


/**
 * load invoice
 * @param invoiceNumber
 */
function loadInvoice(invNo)
{
	var errorMessage = '';
	
	try
	{

		invoiceNumber = lookupInvoice(invNo);
		
		//invoiceNumber=7023; // this should be a search returning the ID using invno
		
		invRecord = nlapiLoadRecord('invoice', invoiceNumber);

	}
	catch(e)
	{
		invRecord = null;
		invoiceNumber=0;
		errorHandler(e);	
	}

	return invoiceNumber;

}


/**
 * load parameters for the script
 */

function loadParameters()
{
	
	try
	{
		
//	    department = 8;
//	    classID = 39;
	    location = 21;
//	    subsidiary = 6;
//	    arAccount = 2619;
	    account = 2655;

		
		
		journalFromID = nlapiGetContext().getSetting('SCRIPT', 'custscript_journal_from_intid');
		
		surgeonAccrualID = nlapiGetContext().getSetting('SCRIPT', 'custscript_consultant_fees_accrual_intid');
		anaesthAccrualID = nlapiGetContext().getSetting('SCRIPT', 'custscript_anaesthetists_fees_arul_intid');
		consumerID = nlapiGetContext().getSetting('SCRIPT', 'custscript_consumer_pack_accrual_intid');
		
		journalDeptID = nlapiGetContext().getSetting('SCRIPT', 'custscript_journal_department_intid');
		journalLocationID = nlapiGetContext().getSetting('SCRIPT', 'custscript_location_intid');
		jounralSubsidiary = nlapiGetContext().getSetting('SCRIPT', 'custscript_subsidiary_intid'); 
	
	
	}
	catch(e)
	{

    	errorHandler(e);
		auditTrail('FAILED','Cannot load invoice ' + getErrorMessage(e));
		
	}
	
	
}



/**
 * convert xml converted characters back
 * @param xml
 * @returns {String}
 */
function UNencodeXML(xmldecode)
{
    var retVal='';
    
    xmldecode = xmldecode.replace(/&amp;/g,'&');
    xmldecode = xmldecode.replace(/&lt;/g,'<');
    xmldecode = xmldecode.replace(/&gt;/g,'>');
    xmldecode = xmldecode.replace(/&quot;/g,'\'');
//xmlz = xmlz.replace('&apos;',''');
    xmldecode = xmldecode.replace(/&#xD;/g,'\r');
    xmldecode = xmldecode.replace(/&#xA;/g,'\n');  

    retVal = xmldecode;
    
    return retVal;
}

/**
 * splits out values and returns 
 */
function splitOutValue(element, elementTag)
{
	var retVal = '';
	var splitArray;
	
	//if element is not empty...
	if(element.indexOf(elementTag) != -1)
	{
		//...remove tags and return value
	    element = element + '</' + elementTag + '>';
	    splitArray = element.split(elementTag);
	
	    retVal = splitArray[1];
	    retVal = retVal.substring(1, retVal.length - 2);
	}
	return retVal;
}

/**
 * error handler
 */

function errorHandler(e)
{

	var errorMessage='';
	
	errorMessage = getErrorMessage(e);
	nlapiLogExecution( 'ERROR', 'unexpected error', e.toString());

}

/**
 * get error message string
 */

function getErrorMessage(e)
{
	var retVal='';

	if ( e instanceof nlobjError )
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal= e.toString();
	}
	
	
	return retVal;
}

/**
 * convert date
 */

function convertTransactioneDate(dateStr)
{
	
	var retVal = null; 
	var day='';
	var month='';
	var year = '';
	var newDate='';
	
	year = dateStr.substring(0,3);
	month = dateStr.substring(4,5);
	day = dateStr.substring(6,7);
	
	newDate = day +"." + month + "." + year;
	
	retVal = nlapiStringToDate(newDate); 

	return retVal;
	
}

/**
 * update the audit record to indicate success or failure of a posting
 * @param success
 * @returns {Number}
 */
function auditTrail(success, status)
{
	
	var auditID=0;
	var desc='';
	
	try
	{
		
		if(success=='NOT SUPPORTED')
		{
			desc = 'NOT SUPPORTED';
		}
		else
		{
			desc = 'XML Payment for Invoice: ' + invoiceNo;	
		}
		
		
		auditRec.setFieldValue('custrecord_description', desc);
		auditRec.setFieldValue('custrecord_processed', success);
		auditRec.setFieldValue('custrecord_status', status);
		
		if(msgID.length>0)
		{
			auditRec.setFieldValue('custrecord_fileidentifier', '_' + msgID + '.payment');
		}
		
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
 * lookupinvoice
 * 1.0.1 - set the invoice location for the payment
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';
	
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
		invoiceSearchColumns[1] = new nlobjSearchColumn('location');
	
		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				
				// set the location 1.0.1
				
				location = itemSearchResult.getValue('location');
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
* rule for applying the bank account for payments
* 1.0.2 - added 26/5
* 1.0.5 - amended allow london payments 15 Jan
* 
*	101000                  Guildford
* 	101200                  Solent
* 	101300                  Yorkshire
* 	101400                  Manchester
* 	101500                  Birmingham
* 	101100                  Corporate this is not needed for the DGL feed
* 
*/

function paymentBankNominalRule(clinic)
{
	var bankNominal = '';
	var bankNominalInternalID = 0;

	clinic = clinic.toUpperCase();
	
		
	if(clinic.indexOf('GUILDFORD') != -1)
	{
		bankNominal = '101000';
	}
	if(clinic.indexOf('SOLENT') != -1)
	{
		bankNominal = '101200';
	}
	if(clinic.indexOf('YORKSHIRE') != -1)
	{
		bankNominal = '101300';
	}
	
	if(clinic.indexOf('MANCHESTER') != -1)
	{
		bankNominal = '101400';
	}
	if(clinic.indexOf('BIRMINGHAM') != -1)
	{
		bankNominal = '101500';
	}
	
	// 1.0.5 - amended allow london payments 15 Jan
	
	if(clinic.indexOf('LONDON') != -1)
	{
		bankNominal = '101600';
	}
	
	// get the interal ID for the bank nominal
	bankNominalInternalID = genericSearch('account','number',bankNominal);	
	
	
	return bankNominalInternalID;

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
		errorHandler(e);	}     	      

	return internalID;
}

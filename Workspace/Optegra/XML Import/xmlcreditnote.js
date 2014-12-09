/*************************************************************************
 * Name: xmlcreditnote
 * Script Type: user event
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 04 May 2012 - 1st release - JM
 * 			1.0.1 - 22 June 2012 - amended - add invoice number to creditnote memo - prevent partial credits from being processed
 *			1.0.2 - 25 June 2012 - amended - splitoutvalue change - some fields are being truncated  				  
 *			1.0.3 - 06 July 2012 - amended - removed description as field does not exist - added custom form id parameter
 *			1.0.4 - 10 July 2012 - amended - do not process journals where none exist
 *			1.0.5 - 10 July 2012 - amended - check if audit record exist before trying to reverse journals
 *			1.0.6 - 25 July 2012 - amended - post a credit not against an invoice - only can do through override flag being set - if invoice exists, ignored
 *			1.0.7 - 28 June 2013 - amended - turn off auto apply for credits not on account - JM
 *
 * Author: FHL
 * Purpose: Loads XML file, splits out values and creates credit note record
 * is called by a user event called customscript_usereventxmlcreditnote
 * 
 * Script: customscript_usereventxmlcreditnote
 * Deploy: customdeploy_usereventxmlcreditnote
 *
 * fields added to transaction columns applied to sale item
 * 
 * [todo] need to prevent same credit note from being posted more than once
**************************************************************************/

var auditRec=null;
var transactionSplit;
var transactionXML='';

var comments = '';
var cuid = '';
var invoiceNo = '';
var msgID = '';

var department = 0;
var classID = 0;
var location = 0;
var subsidiary = 0;
var arAccount = 0;
var account = 0;
var invoiceTotal = 0;
var amount = 0;

var invRecord = null;
var invoiceIntID = 0;

var journal = '';
var journalNumbers = '';
var customFormIntID = 0;	// 1.0.3 added


var lineArray = new Array(2);

/**
 * 1.0.3 debug code added 
 * @param type
 */
function processCreditNote(type)
{
	
	nlapiLogExecution('DEBUG', 'the type is: ' + type, type);		// 1.0.3 debug code added
	
	var process='FALSE';
	var override = false;
	// load the audit record (which contains the XML payload).
	loadAuditRecord(type);

	override = auditRec.getFieldValue('custrecord_processed');
	
	nlapiLogExecution('DEBUG', 'CREDIT NOTE CODE STARTED' + auditRec.getFieldValue('custrecord_processed'));		// 1.0.3 debug code added
	
	if(auditRec.getFieldValue('custrecord_processed')=='FALSE')
	{

		loadParameters();
		
		// load the xml from the audit record
		transactionXML = auditRec.getFieldValue('custrecord_payload');
		transactionXML = UNencodeXML(transactionXML);

		
		// this code only deals with the creditnote files

		if(transactionXML.indexOf('DGLCreditNote') != -1)
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
				if(invoiceIntID!=0)
				{
					posttransactionIntoNetsuite(invoiceIntID);
				}
				else
				{
					// 1.0.6 check the override flag
					if(override=='T')
					{
						postCreditNoteNotAgainstAnInvoice();
					}
					else
					{

						auditTrail('FAILED', 'Cannot post credit note ' + msgID + ' for invoice ' + invoiceNo + ' as the Invoice has not yet been posted');
					}

				}
				
			}
			else
			{
				nlapiLogExecution('AUDIT', 'failed to post transaction', transactionXML);
			}
		
		}
	}
	
}



/**
 * load parameters for the script
 * 			1.0.3 - 06 July 2012 - amended - added custom form id parameter
 */

function loadParameters()
{
	
	try
	{
	    customFormIntID = nlapiGetContext().getSetting('SCRIPT', 'custscript_optegracreditintid'); 
	}
	catch(e)
	{
    	errorHandler(e);
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
	if(transactionElement.indexOf('<Amount>') != -1)
	{
		amount = splitOutValue(transactionElement, 'Amount');
	}

	if(transactionElement.indexOf('<InvoiceNo>') != -1)
	{
		invoiceNo = splitOutValue(transactionElement, 'InvoiceNo');
	}
		
	if(transactionElement.indexOf('<Date>') != -1)
	{
		crDate = splitOutValue(transactionElement, 'Date');
	}
	   
	if(transactionElement.indexOf('<CreditNoteDetail>') != -1)
	{
		creditNoteDetail = splitOutValue(transactionElement, 'CreditNoteDetail');
	}
	   

}


/**
 * post creditnote transaction into netsuite
 * 			1.0.3 - 06 July 2012 - amended - removed description as field does not exist
 * 			1.0.7 - 1.0.7 - 28 June 2013 - amended - turn off auto apply for credits not on account - JM 
 */
function posttransactionIntoNetsuite(invIntID)
{

	var creditMemoID = 0;

	try
	{
		// 1.0.1 check if partial credit - do not allow
		//
		if(isPartialCredit()==false)
		{
			// full credit
			creditMemo = nlapiTransformRecord('invoice', invIntID, 'creditmemo');
			
			
			creditMemo.setFieldValue('autoapply', 'F'); 	// 1.0.7
			creditMemo.setFieldValue('customform', customFormIntID);	// 1.0.3 added

			creditMemo.setFieldValue('memo', 'Credit posted for invoice: ' + invoiceNo);

			//reverse the journals created by the related invoice
			reverseJournals();

			creditMemoID = nlapiSubmitRecord(creditMemo, true); 

			auditTrail('TRUE', 'Posted');
			nlapiLogExecution('AUDIT', 'success', 'Credit note posted for invoice: ' + invoiceNo);
		}
		else
		{
			auditTrail('NOT SUPPORTED', 'Cannot post partial credit note ' + msgID + ' for invoice ' + invoiceNo);
		}
	}
	catch(e)
	{

		nlapiLogExecution('AUDIT', 'failure', 'failed to post creditnote for invoice: ' + invoiceNo);
		errorHandler(e);
		auditTrail('FAILED', 'Cannot post credit note ' + msgID + ' for invoice ' + invoiceNo);

	}

	return creditMemoID;


}


/**
 * reverse each journal
 *  	1.0.4 - 10 July 2012 - amended - do not process journals where none exist
 *  	1.0.5 - 24 July 2012 - amended - check if audit record found
 */		 
function reverseJournals()
{
    var journalID = '';
    var journalInternalID = '';
    var revJournalID = 0;
    var recJournal = null;
    var invoiceAuditID = 0;
    var recInvoiceAudit = null;
    var processed = ''; 
    var status = '';
    var strJournals = '';
    var journalsArray = new Array();
    
    // find the invoice audit record
    invoiceAuditID = lookupInvoiceAudit(invoiceNo);

    if(invoiceAuditID!='not found')
    {

    	recInvoiceAudit = nlapiLoadRecord('customrecord_xml_load_audit', invoiceAuditID);
    	processed = recInvoiceAudit.getFieldValue('custrecord_processed');
    	status = recInvoiceAudit.getFieldValue('custrecord_status');

    	if (processed == 'TRUE' && status == 'Posted')
    	{	
    		// extract the journal numbers and split into array
    		strJournals = recInvoiceAudit.getFieldValue('custrecord_journals');	// 1.0.4 

    		if(strJournals != null)		// 1.0.4
    		{
    			journalsArray = strJournals.split(' ');

    			// loop around the array calling the reversal routines
    			for (var i = 0; i < journalsArray.length; i++)
    			{
    				journalID = journalsArray[i];
    				journalInternalID = lookupJournal(journalID);

    				recJournal = nlapiLoadRecord('journalentry', journalInternalID);

    				getJournalHeader(recJournal);
    				getJournalLines(recJournal);

    				revJournalID = createReversedJournal();
    			}
    		}
    		else
    		{
    			nlapiLogExecution('AUDIT', 'Journal Reversal', 'No Journals to reverse: ' + invoiceNo);		// 1.0.4
    		}
    	}
    }
    else
    {
    	nlapiLogExecution('AUDIT', 'Journal Reversal', 'No Journals to reverse because the invoice was a CSV upload ' + invoiceNo);		// 1.0.4
    }
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
		//recordID = 16102;
		
		auditRec = nlapiLoadRecord('customrecord_xml_load_audit', recordID);
		if(auditRec.getFieldValue('custrecord_payload').indexOf('DGLCreditNote') != -1)
		{
			nlapiLogExecution('DEBUG', 'xml', auditRec.getFieldValue('custrecord_payload'));
		}
		
	}
	catch(e)
	{
		errorHandler(e);		
	}
	

}


/**
 * load invoice
 * @param invoiceNumber
 */
function loadInvoice(invNo)
{
	var invoiceNumber=0;
	
	try
	{
		invoiceNumber = lookupInvoice(invNo);
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
		 
		desc = 'XML Credit Note for Invoice: ' + invoiceNo;
		
		auditRec.setFieldValue('custrecord_description', desc);
		auditRec.setFieldValue('custrecord_processed', success);
		auditRec.setFieldValue('custrecord_status', status);
		auditRec.setFieldValue('custrecord_fileidentifier', '_' + msgID + '.creditnote');
		auditRec.setFieldValue('custrecord_journals', journalNumbers);
		
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
 * 1.0.1 - return total for the invoice
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';
	
	invoiceTotal = 0;
	
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
		invoiceSearchColumns[1] = new nlobjSearchColumn('total');		// 1.0.1 total
	
		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				//invoiceTotal = itemSearchResult.getFieldValue('total');
				
				var inv = nlapiLoadRecord('invoice', internalID);
				invoiceTotal = inv.getFieldValue('total');

			}
		}
	}
    catch(e)
    {
    	errorHandler(e);
    	auditTrail('FAILED', 'Invoice does not exist: ' + invoiceNo);
    }     	      
	
	return internalID;

}


/**
 * get the invoice line from the audit trail
 * 
 */

function lookupInvoiceAudit(invoiceNo)
{
	var internalID='not found';
	
	// Arrays
	var invoiceAuditSearchFilters = new Array();
	var invoiceAuditSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceAuditSearchFilters[0] = new nlobjSearchFilter('custrecord_invoicenumber', null, 'is',invoiceNo);                                           
		
		// return columns
		invoiceAuditSearchColumns[0] = new nlobjSearchColumn('internalid');
	
		// perform search
		var invoiceAuditSearchResults = nlapiSearchRecord('customrecord_xml_load_audit', null, invoiceAuditSearchFilters, invoiceAuditSearchColumns);

		if(invoiceAuditSearchResults!=null)
		{
			if(invoiceAuditSearchResults.length>0)
			{
				var invoiceAuditSearchResult = invoiceAuditSearchResults[ 0 ];
				internalID = invoiceAuditSearchResult.getValue('internalid');
			}
		}
		else
		{
			nlapiLogExecution('DEBUG', 'Audit record does not exist', 'Audit for invoice ' + invoiceNo + ' does not exist');
		}

	}
    catch(e)
    {
    	errorHandler(e);
    	auditTrail('FAILED', 'Audit record does not exist for invoice: ' + invoiceNo);
    }     	      
	
	return internalID;

}


/**
 * get journal header
 * 
 * @param recJournal
 * @returns {Boolean}
 */
function getJournalHeader(recJournal)
{
    var retVal = false;

    journalDate = recJournal.getFieldValue('trandate');
    currency = recJournal.getFieldValue('currency');
    exchangeRate = recJournal.getFieldValue('exchangerate');
    subsidiary = recJournal.getFieldValue('subsidiary');

    retVal = true;

    return retVal;
}



/**
 * fetch journal lines
 * 
 * @param recJournal
 * @returns {Boolean}
 */
function getJournalLines(recJournal)
{
    var retVal = false;

    var lineCount = recJournal.getLineItemCount('line');

    for (var i = 1; i <= lineCount; i++)
    {
        lineArray[i-1] = new Array(7);
        lineArray[i-1][0] = recJournal.getLineItemValue('line', 'account', i);
        lineArray[i-1][1] = recJournal.getLineItemValue('line', 'credit', i);
        lineArray[i-1][2] = recJournal.getLineItemValue('line', 'debit', i);
        lineArray[i-1][3] = recJournal.getLineItemValue('line', 'department', i);
        lineArray[i-1][4] = recJournal.getLineItemValue('line', 'location', i);
        lineArray[i-1][5] = recJournal.getLineItemValue('line', 'class', i);
        lineArray[i-1][6] = recJournal.getLineItemValue('line', 'memo', i);
    }
    
    retVal = true;

    return retVal;
}



/**
 * lookup journal
 * 
 * @param journalID
 * @returns {String}
 */
function lookupJournal(journalID)
{
	var internalID='';

	// Arrays
	var journalSearchFilters = new Array();
	var journalSearchColumns = new Array();

	try
	{
		//search filters                  
		journalSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is',journalID);                          

		// search columns
		journalSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var journalSearchResults = nlapiSearchRecord('journalentry', null, journalSearchFilters, journalSearchColumns);

		if(journalSearchResults!=null)
		{
			if(journalSearchResults.length>0)
			{
				var journalSearchResult = journalSearchResults[ 0 ];
				internalID = journalSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', "Cannot find journal to reverse: " + journalID + ' ' + getErrorMessage(e));
	}             

	return internalID;

}

/**
 * reverse the journals
 * 
 * @returns {Number}
 */
function createReversedJournal()
{   
	var internalID = 0;
	var revJournalRec = nlapiCreateRecord('journalentry');

	revJournalRec.setFieldValue('trandate', journalDate);
	revJournalRec.setFieldValue('currency', currency);
	revJournalRec.setFieldValue('exchangerate', exchangeRate);
	revJournalRec.setFieldValue('subsidiary', subsidiary);

	for (var i = 0; i < lineArray.length; i++)
	{
		revJournalRec.selectNewLineItem('line');
		revJournalRec.setCurrentLineItemValue('line','account', lineArray[i][0]);
		revJournalRec.setCurrentLineItemValue('line','credit', lineArray[i][2]);
		revJournalRec.setCurrentLineItemValue('line','debit', lineArray[i][1]);
		revJournalRec.setCurrentLineItemValue('line','department', lineArray[i][3]);
		revJournalRec.setCurrentLineItemValue('line','location', lineArray[i][4]);
		revJournalRec.setCurrentLineItemValue('line','class', lineArray[i][5]);
		revJournalRec.setCurrentLineItemValue('line','memo', 'Reversed ' + lineArray[i][6]);
		revJournalRec.commitLineItem('line');
	}

	internalID = nlapiSubmitRecord(revJournalRec);
	journal = nlapiLookupField('journalentry', internalID, 'tranid');
	journalNumbers = journalNumbers + ' ' + journal; 
	
	nlapiLogExecution('DEBUG', 'Reversed journals', journalNumbers);

    return internalID;
}


/**
 * check if this credit is a partial credit - not 
 */
function isPartialCredit()
{
	
	var retVal = false;

	// extract the invoice total and compare it to the credit note amount - if they are not the same
	// return true
	
	nlapiLogExecution('DEBUG', 'Invoice Amount', invoiceTotal);
	nlapiLogExecution('DEBUG', 'Credit Amount', amount);
	
	
	if(invoiceTotal!=amount)
	{
		retVal = true; 	// ie this is a partial credit
	}


	return retVal;
}



/**
 * generic search - returns internal ID
 * 1.0.2 added
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID='not found';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
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
	var retValue = '';
	var splitArray;

	//if element is not empty...
	if(element.indexOf(elementTag) != -1)
	{
		//...remove tags and return value
		element = element + '</' + elementTag + '>';
		splitArray = element.split(elementTag);

		retValue = splitArray[1];
		retValue = '' + retValue.substring(1, retValue.length - 2).toString();
	}
	return retValue;
	
}

/**
 * error handler 
 */
function errorHandler(e)
{

	if ( e instanceof nlobjError )
	{
		nlapiLogExecution( 'ERROR', 'system error', e.getCode() + '\n' + e.getDetails());
	}
	else
	{
		nlapiLogExecution( 'ERROR', 'unexpected error', e.toString());
	}

}

/**
 * convert date to string
 * 
 * @param dateStr
 * @returns
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
 * post creditnote transaction into netsuite not against an invoice
 * 			1.0.6 - 25 July 2012 - amended - post a credit not against an invoice - only can do through override flag being set - if invoice exists, ignored 
 */

function postCreditNoteNotAgainstAnInvoice()
{

	var lineCount = 0;
	var item='';
	var lineTotal = 0;
	var postPerdiodIntID = 0;
	
	try
	{


		//******************************
		// header
		//******************************
		
		creditMemo = nlapiCreateRecord('creditmemo');
		creditMemo.setFieldValue('customform', customFormIntID);
		
		// lookup customer, if it does not exist, create it
		entity = lookupCustomer(patientNo);

		if(entity.length==0)
		{
			entity = createCustomer();                
		}

		creditMemo.setFieldValue('entity', entity);
		creditMemo.setFieldValue('tranid', creditNo);
		creditMemo.setFieldValue('recordtype', 'creditmemo');
		creditMemo.setFieldValue('subsidiary', 2);		// [TODO] ZZZ journalSubsidiary);

		dateInvoice = reverseDate(invoiceDate);
		creditMemo.setFieldValue('trandate',dateInvoice);	// 1.0.6 moved to test
		creditMemo.setFieldValue('memo', 'Credit Created without Invoice');
	
		postPerdiodIntID = lookupPostingPeriod('accountingperiod',dateInvoice);		// 1.0.6 lookup posting period

		if(postPerdiodIntID != 'not found')
		{
			creditMemo.setFieldValue('postingperiod',postPerdiodIntID);
		}
		else
		{
			nlapiLogExecution('AUDIT', 'Cannot lookup posting period for date', dateInvoice);
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

				item = lookupItem(itemObj.code); // lookup item
				lineTotal = (itemObj.serviceAmount);

				creditMemo.selectNewLineItem('item');
				creditMemo.setCurrentLineItemValue('item', 'item', item);      
				creditMemo.setCurrentLineItemValue('item', 'description', itemObj.desc);
				creditMemo.setCurrentLineItemValue('item', 'rate', lineTotal);

				taxCode = itemObj.vatCode;													// set tax code
				taxCodeInternalID = getTaxCode(taxCode);
				creditMemo.setCurrentLineItemValue('item', 'taxcode', taxCodeInternalID);
				creditMemo.setCurrentLineItemValue('item', 'tax1amt', itemObj.vatAmount);	// set tax amount
				creditMemo.setCurrentLineItemValue('item', 'class', journalClass);			// product family class

				nlapiLogExecution('DEBUG', 'LASTLINE');
				
				creditMemo.commitLineItem('item');
				nlapiLogExecution('AUDIT', 'LINE COMMITTED');


			}
			
			creditMemoID = nlapiSubmitRecord(creditMemo);
			nlapiLogExecution('AUDIT', 'success', 'credit note with no invoice ' + creditNo);
			auditTrail('TRUE', 'Credit Posted, no invoice');

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
		auditTrail('FAILED', 'Cannot create credit note ' + getErrorMessage(e));
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

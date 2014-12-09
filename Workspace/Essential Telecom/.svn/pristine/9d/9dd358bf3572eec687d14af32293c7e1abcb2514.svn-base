/**********************************************************************************************************
 * Name:        cdrUserEvent
 * Script Type: User Event
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2013 - first release - JM
 * 				1.0.1 - 12 Jun 2013 - Updating the VAT codes - AS 
 * 					  - getting the Apply VAT field value from the SAles CDR record - AS
 *  
 * Author:      FHL
 * Purpose:     CDR journal creation 
 * Fires on:	create in customrecord_cdrdata
 * 
 * Script:      customscript_cdruserevent
 * Deploy:     	customdeploy_cdruserevent  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var balSheetTransferIntID = 0;
var balSheetTransferAccountDesc = '';
var defaultIncomeAccountDesc = '';

var CDRRecord = null;
var msisdncdr = 0;
var location = '';
var dataCost = 0;
var smsCost = 0;
var voiceCost = 0;
var totalCosts = 0;
var bsplJRNL = 0;
var telNo = '';
var cusRecievableAccount = '';
var cusRecievableAccountIntID = '';
var createdInvoice = 0;
var invIntId = 0;
var applyVAT = 'F';
var VATZERONAME = '';
var VATZEROINTID = 0;
var DEFAULTVATNAME = '';
var DEFAULTVATINTID = '';
var VATACCOUNT = '';
var VATACCOUNTID = 0;

/**
 * main - starting point
 *
 */

function cdrUserEvent(type)
{

	initialise();				// initialise
	loadCDRRecord();			// user event load record
	createCDRJournal();			// move from balance sheet to profit and loss 
	//postInvoiceIntoNetsuite();
	updateCDRRecord();			// update the cdr record with processing status and journal INT Id

}

/**
 * initialise
 * 
 * version 1.0.1 - Updating the VAT codes - AS
 */
function initialise()
{
	try
	{
		VATZERONAME = 'Z-GB';
		VATZEROINTID = genericSearch('salestaxitem', 'name', VATZERONAME);
		
		DEFAULTVATNAME = 'SR-GB';
		DEFAULTVATINTID = genericSearch('salestaxitem', 'name', DEFAULTVATNAME);
		
		
		INVFORMINTID = 107;
		
		BALSHEETTRANSFERACCOUNTDESC = 'Prepaid Account B/Sheet';	//[todo] lookup below using this string
		DEFAULTINCOMEACCOUNTDESC = 'Miscellaneous';					//[todo] lookup below using this string
		JOURNALLOCATION = 'United Kingdom';							//[todo] lookup below using this string
		
		balSheetTransferIntID = 258;
		incomeAccountIntID = 332;
		journalLocationIntID = genericSearch('location', 'name', JOURNALLOCATION);


	}
	catch(e)
	{
		errorHandler("initialise", e);		
	}
}

/**
 * load top up record from custom recordset
 *
 */

function loadCDRRecord()
{
	var recordID = 0;

	try
	{
		recordID = nlapiGetRecordId();
		CDRRecord = nlapiLoadRecord('customrecord_cdrdata', recordID);

		msisdncdr = 	CDRRecord.getFieldValue('custrecord_msisdncdr');
		telNo = 		CDRRecord.getFieldText('custrecord_msisdncdr');
		location = 		CDRRecord.getFieldValue('custrecord_location');
		dataCost = 		CDRRecord.getFieldValue('custrecord_datacost');
		smsCost = 		CDRRecord.getFieldValue('custrecord_smscost');
		voiceCost = 	CDRRecord.getFieldValue('custrecord_voicecost');
		totalCosts =	CDRRecord.getFieldValue('custrecord_totalcosts');
		applyVAT = 		CDRRecord.getFieldValue('custrecord_applyvat');
	}
	catch(e)
	{
		errorHandler("loadCDRRecord", e);		
	}

}


/**
 * create CDR Journal
 *
 */

function createCDRJournal()
{
	var usageDate = null;
	var journalDesc = '';
	var total = 0;
	var incomeAccountDesc = '';
	var incomeAccountIntID = 0;
	var custIntID = 0;
	var vatCode = 0;
	
	try
	{
		usageDate = nlapiDateToString(new Date());
		
		// lookup the income account based on the CDR location
		// if it cannot be found, default to the miscallaneous a/c
		

		
		incomeAccountIntID = lookupAccount();
			
		journalDesc = 'CDR Journal for Tel: ' + telNo + ' for location: ' + location;
		total = totalCosts;

		custIntID = genericSearch('customer','entityid',telNo);
		
		cusReceivableAccount = nlapiLookupField('customer', custIntID, 'receivablesaccount');
		cusReceivableAccountIntID = genericSearch('account', 'name', cusReceivableAccount);
		
		
		nlapiLogExecution('audit', 'cusRecievableAccount', cusReceivableAccount);

		nlapiLogExecution('audit', 'cusReceivableAccountIntID', cusReceivableAccountIntID);
		
		if(applyVAT == 'T')
		{
			vatCode = DEFAULTVATINTID;
		}
		else
		{
			vatCode = VATZEROINTID;
		}
		
		nlapiLogExecution('audit', 'vatCode', vatCode);
		//Format of the createJournal Function
		//createJournal(totalValue, debitAccount, creditAccount, dept, location, subsidiary, jClass, invDate, desc, entity, vatCode)
		plbsJRNL = createJournal(total, cusReceivableAccountIntID, incomeAccountIntID, 0, journalLocationIntID, 0,0, usageDate, journalDesc, custIntID,vatCode);
	}
	catch(e)
	{
		errorHandler("createCDRJournal", e);		
	}
}


/**
 * update CDR Record with status and journal ID
 *
 */
function updateCDRRecord()
{
	
	var recordID = 0;
	var statusDesc = '';
	
	try
	{
		
		// check if a invoice was created successfully, if it is update the invoice recerence
		
		if(plbsJRNL==0)
		{
			statusDesc = 'Failed, please review details';
		}
		else
		{
			statusDesc = 'Created Successfully';
			CDRRecord.setFieldValue('custrecord_cdrjrnlref', plbsJRNL);
		}
		
				
		CDRRecord.setFieldValue('custrecord_cdrstatus', statusDesc);
		recordID = nlapiSubmitRecord(CDRRecord, true);


	}
	catch(e)
	{
		errorHandler("updateCDRRecord", e);		
	}
}


/**
 * This needs to be filtered by ACCOUNT TYPE(Income). As there are several accounts with the same name.
 * 
 * @returns {Number}
 */
function lookupAccount()
{
	var incomeAccountName = '';	
	var incomeAccountIntID = -1;

	try
	{
		incomeAccountName = location;
	
		incomeAccountIntID = getRecordTypeInternalIdByName('account',incomeAccountName, 'Income');	

		if(incomeAccountIntID <= 0)
		{
			incomeAccountName = DEFAULTINCOMEACCOUNTDESC;
			incomeAccountIntID = getRecordTypeInternalIdByName('account',incomeAccountName, 'Income');	
		}	
	}
	catch(e)
	{
		nlapiLogExecution('debug', 'lookupAccount', e.message);
	}
	
	return incomeAccountIntID;
}




/**
 * post invoice into netsuite
 */
function postInvoiceIntoNetsuite()
{
	var itemIntID = 0;
	
	try
	{
		// set values for the invoice header
		createInvoiceHeader();
		itemIntID = lookupItem();
		createInvoiceDetailLine(itemIntID);
		invIntId = nlapiSubmitRecord(invoiceRecord, true);
		
	}
	catch(e)
	{
		errorHandler("postInvoiceIntoNetsuite", e);				
	}             

}


/**
 * create invoice header
 */
function createInvoiceHeader()
{

	var DESC = '';
	var usageDate = null;
	var custIntID = 0;			

	try
	{
			
		DESC = 'Sales CDR Invoice Auto Create';

		usageDate = nlapiDateToString(new Date());
		custIntID = genericSearch('customer','entityid',telNo);
		
		invoiceRecord = nlapiCreateRecord("invoice");
		
		invoiceRecord.setFieldValue('customform', INVFORMINTID); 
		invoiceRecord.setFieldValue('recordtype', 'invoice');
		invoiceRecord.setFieldValue('location',journalLocationIntID);
		invoiceRecord.setFieldValue('description', DESC);
		invoiceRecord.setFieldValue('memo', DESC);
		//invoiceRecord.setFieldValue('partner',simPartnerIntID);
		invoiceRecord.setFieldValue('trandate', usageDate);
		invoiceRecord.setFieldValue('entity', custIntID);		// customer              
		

	}
	catch(e)
	{
		errorHandler("createInvoiceHeader", e);				
	}             

}





/**
 * lookupItem - looking up for the matching item for the sales cdr record using the location
 * @returns {Number}
 */
function lookupItem()
{
	var itemName = '';	
	var nonInventoryItemIntID = -1;

	try
	{
		itemName = location;
	
		nonInventoryItemIntID = getRecordTypeInternalIdByName('item',itemName, 'NonInvtPart');	

		/*if(incomeAccountIntID <= 0)
		{
			itemName = DEFAULTINCOMEACCOUNTDESC;
			incomeAccountIntID = getRecordTypeInternalIdByName('account',incomeAccountName, 'Income');	
		}	*/
	}
	catch(e)
	{
		nlapiLogExecution('debug', 'lookupItem', e.message);
	}
	
	return nonInventoryItemIntID;
}






/**
 * post invoice line to netsuite
 */
function createInvoiceDetailLine(itemIntID)
{

	try
	{
		
		// create invoice line
		
		invoiceRecord.selectNewLineItem('item');
		invoiceRecord.setCurrentLineItemValue('item', 'item', itemIntID);      
		//invoiceRecord.setCurrentLineItemValue('item', 'description', itemObj.desc);
		invoiceRecord.setCurrentLineItemValue('item', 'amount', totalCosts);
		
		if(applyVAT == 'T')
		{
			invoiceRecord.setCurrentLineItemValue('item', 'taxcode', DEFAULTVATINTID);
		}
		else
		{
			invoiceRecord.setCurrentLineItemValue('item', 'taxcode', VATZEROINTID);
		}
	
		invoiceRecord.commitLineItem('item');
		
		
	}
	catch(e)
	{
		errorHandler("createInvoiceDetailLine", e);				
	}             

}

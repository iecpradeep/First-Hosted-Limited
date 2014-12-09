/**********************************************************************************************************
 * Name:        purchaseCDR.js
 * Script Type: User Event
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 08/02/2013 - first release - AM
 * 				1.0.1 - 11/02/2013 - setting the bill reference in the purchase CDR custom record - AS
 * 				1.0.2 - 19/02/2013 - changing the getAccountID function to getRecordTypeInternalIdByName function - AS and AM
 * 								   - setting the approvalStatus depending on whether the account name is existing or not - AS and AM
 * 				1.0.3 - 20/02/2013 - setting the bill reference to the internal ID of the bill creating (to make it unique)- AS
 * 				1.0.4 - 27/02/2013 - Altered name from billPaymentUE.js to purchaseCDR.js
 *  
 * Author:      FHL
 * Purpose:     To automatically pay bills when
 * 
 * Script:      customscript_purchasecdr
 * Deploy:     	customdeploy_purchasecdr 
 *
 * Notes:		calledgateway = supplier/vendor
 * 
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

//Declaring global variables
var DEFAULTCOGSACCOUNTDESC = '';
var DESC = '';
var BILLFORMINTID = 0;
var TAXINTID = 0;

var purchaseCDRRecord = null;
var calledgateway = 0;
var total = '';
var country = '';
var billRecord = null;
var today = new Date();
var billIntId = 0;
var createdBill = 0 ; 
var recordID = 0;
var accountIntId = 0;
var approvalStatus = 0;

/**
 * main - starting point
 *
 */
function purchaseCDRUserEvent(type)
{
	if(type == 'create' || type == 'edit')
	{
		initialise();					// initialise
		loadPurchaseCDRRecord();		// user event load record
		postBillIntoNetsuite();			// posting the bill into NetSuite
		updateCDRRecord();				// update the cdr record with bill reference
	}
}



/**
 * initialise
 *
 */
function initialise()
{
	try
	{	
		today = jsDate_To_nsDate(today);			//converting the date to netsuite date

		TAXINTID = 5;
		BILLFORMINTID = 122;										//created a custom bill for BB
		DEFAULTCOGSACCOUNTDESC = 'Miscellaneous';					//[todo] lookup below using this string
		BILLLOCATION = 'United Kingdom';							//[todo] lookup below using this string

		//balSheetTransferIntID = 258;
		cogsAccountIntID = 332;
		billLocationIntID = 3;

		DESC = 'Purchase CDR Bill Auto Create ';


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

function loadPurchaseCDRRecord()
{
	try
	{
		//getting the internal id of the currently loaded record (purchase CDR custom Record) 
		recordID = nlapiGetRecordId();

		purchaseCDRRecord = nlapiLoadRecord('customrecord_purchasecdrs', recordID);

		calledgateway = purchaseCDRRecord.getFieldValue('custrecord_callledgateway');	// supplier
		country = 		purchaseCDRRecord.getFieldValue('custrecord_country');
		total = 		purchaseCDRRecord.getFieldValue('custrecord_total');

	}
	catch(e)
	{
		errorHandler("loadPurchaseCDRRecord", e);		
	}
}


/**
 * create bill
 *
 *	version 1.0.1 - setting the bill reference in the purchase CDR custom record 
 * 
 */
function postBillIntoNetsuite()
{
	try
	{
		accountIntId = lookupAccount();

		// set values for the bill header
		createBillHeader();
		createBillDetailLine();

		billIntId = nlapiSubmitRecord(billRecord, true);

		//version 1.0.1
		//getting the internal id of the bill created in order to set it into purchase CDR record 
		// [todo] not necessary
		createdBill = nlapiLookupField('vendorbill', billIntId, 'internalid', 'F');

	}
	catch(e)
	{
		errorHandler("postInvoiceIntoNetsuite", e);				
	}             
}



/**
 * 
 * create bill header
 * version 1.0.3 - 20/02/2013 - setting the bill reference to the internal ID of the bill creating (to make it unique)- AS
 *  
 */
function createBillHeader()
{	
	var currentBillIntId = 0; 
	var lastBillIntID = 0;

	try
	{		
		//version 1.0.3
		//getting the last Bill's internal ID
		lastBillIntID = genericSearchLastRecordInternalID('vendorbill');							

		/*
		 * setting the internal Id for the current bill 
		 * Reason - you cannot get the internal ID of the record before you submit the particular record
		 */
		currentBillIntId = parseInt(lastBillIntID) +1;		

		//as parseInt returns the ID in 1 decimal point, set it back to 0 decimal points
		currentBillIntId = parseFloat(currentBillIntId).toFixed(0);

		//creating a new bill record
		billRecord = nlapiCreateRecord("vendorbill");	

		billRecord.setFieldValue('customform', BILLFORMINTID); 
		billRecord.setFieldValue('recordtype', 'vendorbill');
		billRecord.setFieldValue('location',billLocationIntID);
		billRecord.setFieldValue('memo', DESC);
		billRecord.setFieldValue('entity',calledgateway);
		billRecord.setFieldValue('trandate', today);

		/*
		 * //version 1.0.3
		 * setting the internal ID of the current bill as the transaction id (In the bills, the transaction id is not automatically generated)
		 */
		billRecord.setFieldValue('tranid', currentBillIntId);				
		billRecord.setFieldValue('approvalstatus', approvalStatus);		           
	}
	catch(e)
	{
		errorHandler("createBillHeader", e);				
	}             
}



/**
 * post bill line to NetSuite
 */
function createBillDetailLine()
{
	try
	{
		// create bill line
		billRecord.selectNewLineItem('expense');
		billRecord.setCurrentLineItemValue('expense', 'account', accountIntId);      
		billRecord.setCurrentLineItemValue('expense', 'amount', total);
		billRecord.setCurrentLineItemValue('expense', 'taxcode', TAXINTID);
		billRecord.commitLineItem('expense');	
	}
	catch(e)
	{
		errorHandler("createBillDetailLine", e);				
	}             
}

/**
 * 
 * update CDR Record with bill reference
 * 
 * version 1.0.1 - setting the bill reference in the purchase CDR custom record 
 */
function updateCDRRecord()
{
	var statusDesc = '';

	try
	{

		/* check if a bill was created successfully, 
		 * if not do not update the bill reference in purchase CDR custom record set
		 */

		if(createdBill == 0)
		{
			statusDesc = 'Failed, please review details';
		}
		else
		{
			statusDesc = 'Created Successfully';

			//version 1.0.1
			/*setting the bill reference in purchase CDR record using the internal id of the bill created. 
			 * The custrecord_vendorbillreference field is a list of transactions filtered using 'transaction type', Bill.
			 */

			purchaseCDRRecord.setFieldValue('custrecord_vendorbillreference', createdBill);

		}

		recordID = nlapiSubmitRecord(purchaseCDRRecord, true);

	}
	catch(e)
	{
		errorHandler("updateCDRRecord", e);	
	}
}


/**
 * lookup account
 * version 1.0.2 - 19/02/2013 - changing the getAccountID function to getRecordTypeInternalIdByName function - AS and AM
 * 	    					  - setting the approvalStatus depending on whether the account name is existing or not - AS and AM
 */
function lookupAccount()
{

	var cogsAccountName = '';	
	var cogsAccountIntID = -1;

	try
	{
		cogsAccountName = country;

		cogsAccountIntID = getRecordTypeInternalIdByName('account',cogsAccountName, 'COGS');		//version 1.0.2

		// pending approval - 1 , approved - 2, rejected - 3
		approvalStatus = 2; 		// setting the approval status to 'Approved' when the account name is found

		if(cogsAccountIntID <= 0)
		{
			cogsAccountName = DEFAULTCOGSACCOUNTDESC;					// Misc account of type cost of goods sold
			cogsAccountIntID = getRecordTypeInternalIdByName('account',cogsAccountName,'COGS');		//version 1.0.2

			// pending approval - 1 , approved - 2, rejected - 3
			approvalStatus = 1; 		// setting the approval status to 'pending approval' when the account name is not found

		}

	}
	catch(e)
	{
		errorHandler("lookupAccount", e);		
	}

	return cogsAccountIntID;

}

/**********************************************************************************************************
 * Name:        voucherUpdates.js
 * Script Type: User Event - applies to Invoices
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 30 Jan 2013 - changing the internal ID of the income account - AS
 *  			1.0.2 - 14 Feb 2013 - Changing the sales order variables to cash sale - AS
 * 									- Changing the loadSalesOrder() function to loadinvoice() function - AS
 * 									- Changing the loading of record 'Sales Order' record to 'Cash Sale' record - AS
 * 									- Changing the internal id of the 'setFieldValue' in 'Vouchers' Custom record set - AS
 *  			1.0.3 - 01 May 2013 - apply the code from cash Sales to Invoices - AS
 * 									- changing all the names from caslSale to invoice - AS
 * 									- changing the custrecord_invoiceref id in the code and Voucher' custom record set to custrecord_invoiceref - AS
 * 				1.0.4 - 23 May 2013 - Commenting out createPLToBSJournal function - AS
 *				1.0.5 - 29 May 2013 - splitting the voucher field value to get only the voucher number - AS
 *									- making the 'partner' field in invoice optional. Hence setting the customer as the partner in voucher record - AS
 * 
 * Author:      FHL
 * Purpose:     User event to update voucher records from sales update and to create journals for P/L to B/S transfer 
 * 
 * Script:      customscript_voucherupdates
 * Deploy:     	customdeploy_voucherupdates  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

// constants
var JOURNALLOCATION = '';

var executionEnv = '';
var context = null;

//version 1.0.2 - Changing the sales order variables to cash sale
var invoice = '';
var invoiceIntID = 0;

var custIntID = 0;
var partnerIntID = 0;	
var currentRecord = null;
var tranID = 0;
var invDate = null;
var journalLocationIntID = 0;
var plAccount = '';
var balSheetTransferIntID = 0;		// custitem_balsheetxfer - comes from item
var incomeAccountIntID = 0;			// incomeaccount - comes from item
var itemIntID = 0;					// item internal ID
//var total = 0;
var JournalIntID = 0;
var distributorComPercentage = 0;
var distributorComAmount = 0.0;
var invoiceCusIntID = 0;


/**
 * main - starting point
 * version 1.0.2 - Changing the loadSalesOrder() function to loadInvoice() function 
 * 
 * version 1.0.4 - Commenting out createPLToBSJournal function
 */

function voucherUpdates(type)
{
	initialise();
	loadInvoice();						//version 1.0.2
	checkEachOrderLineForvouchers();

}

/**
 * initialise
 *
 */
function initialise()
{
	try
	{
		
		context = nlapiGetContext();
		executionEnv = context.getExecutionContext();
		context.getSetting('SCRIPT', 'custscript_selectedvouchers');
		JOURNALLOCATION = 'United Kingdom';
		
	
		journalLocationIntID = genericSearch('location', 'name', JOURNALLOCATION);
		
		
	}
	catch(e)
	{
		errorHandler("initialise", e);		
	}
}


/**
 * loadInvoice
 * version 1.0.2 - Changing the loading of record 'Sales Order' record to 'Cash Sale' record
 */
function loadInvoice()
{
	var prevInvoiceIntID = 0;
	var prevInvoiceNumber = 0;
	var currentInvNumber = 0;
	
	try
	{
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			invoiceIntID = nlapiGetRecordId();
			currentRecord = nlapiLoadRecord('invoice', invoiceIntID);			// version 1.0.2
			partnerIntID = currentRecord.getFieldValue('partner');
			invoiceCusIntID = currentRecord.getFieldValue('entity');
			tranID = currentRecord.getFieldValue('tranid');
			//total = currentRecord.getFieldValue('total');
		//	total = currentRecord.getFieldValue('subtotal');
			invDate  = currentRecord.getFieldValue('trandate');
					

			}

	}
	catch(e)
	{
		errorHandler("loadInvoice", e);		
	}
}


/**
 * Calculate Distributor commision  
 * 
 */
function calculateDistributorCommission(valueOfVoucher)
{

	try
	{
		
		lookupDistributorCommissionRate();
			distributorComPercentage = parseFloat(distributorComPercentage);
			
			
			distributorComAmount = valueOfVoucher * distributorComPercentage/100;		//distributorComPercentage is just the value without the percentage
			distributorComAmount = Math.round(distributorComAmount*100)/100;

	}
	catch(e)
	{
		errorHandler("calculateDistributorCommission", e);		
	}


}



/**
 * lookup the distributor commission rate
 */
function lookupDistributorCommissionRate()
{
	var partnerRecord = null;


	try
	{
		partnerRecord = nlapiLoadRecord('partner', invoiceCusIntID);
		
		distributorName = partnerRecord.getFieldValue('entityid');
		
		if(voucherTypeName = 'Physical Voucher')
		{
				distributorComPercentage = partnerRecord.getFieldValue('custentity_physicaldisc');
		}
		
	}
	catch(e)
	{
		errorHandler("lookupDistributorCommissionRate", e);				
	}             

}














/**
 * check each order line for vouchers and update customrecord_voucher_ where found
 *
 * //version 1.0.3 - 25 Feb 2013 - Setting the item name into vouchers - AS
 */
function checkEachOrderLineForvouchers()
{

	var lines = null;
	var voucherFieldValues = '';
	var quantity = 0;
	
	try
	{
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			// Get the number of line items before submit
			lines = currentRecord.getLineItemCount('item');

			for ( var i = 1 ; i<= lines ; i++ )
			{
				voucherFieldValues = nlapiGetLineItemValue('item', 'custcol_vouchers', i);
				
				itemIntID = nlapiGetLineItemValue('item', 'item', i);
				quantity = 	nlapiGetLineItemValue('item', 'quantity', i);
				
				
				if(voucherFieldValues)
				{
					getItemAccounts();
					
					forEachVoucherUpdateVoucherRecords(voucherFieldValues);
				}
			}
		}

	}
	catch(e)
	{
		errorHandler("checkEachOrderLineForvouchers", e);		
	}


}

/**
 * for Each voucher Update voucher  Records
 *
 */

function forEachVoucherUpdateVoucherRecords(voucherFieldValueString,quantity)
{
	var voucherArray = new Array();
	var splitChar = '';

	try
	{

		splitChar = String.fromCharCode(5);

		voucherArray = voucherFieldValueString.split(splitChar);
		
		for(var i=0; i<=voucherArray.length; i++)
		{
			updateVoucher(voucherArray[i],quantity);
		}

	}
	catch(e)
	{
		errorHandler("forEachVoucherUpdateVoucherRecords", e);		
	}

}

/**
 * update a voucher 
 * version 1.0.2 - Changing the internal id of the 'setFieldValue' in 'Vouchers' Custom record set 
 * version 1.0.5 - splitting the voucher field value to get only the voucher number
 *               - making the 'partner' field in invoice optional. Hence setting the customer as the partner in voucher record
 * 
 */

function updateVoucher(voucherFieldValue)
{
	var voucherIntID = 0;
	var voucherRecord = null;
	var stringPosition = 0;
	var voucherNumber = '';
	var voucherValue = 0;

	try
	{
		
		if(voucherFieldValue)
		{
			//version 1.0.5 - splitting the voucher field value to get only the voucher number
			// the voucher number format is 'voucherNumber - GBP voucherValue . Example 662752779 - GBP2.50
			stringPosition = voucherFieldValue.indexOf('-');							//getting the position of the '-'
			voucherNumber = voucherFieldValue.substring(0, stringPosition -1);			//getting the voucherNumber only
			
			//searching for the voucher number
			voucherIntID = genericSearch('customrecord_vouchers','custrecord_vouchernumber',voucherNumber);
			
			voucherRecord = nlapiLoadRecord('customrecord_vouchers', voucherIntID);			//loading the voucher record
			voucherValue = voucherRecord.getFieldValue('custrecord_vouchervalue');			//getting voucher value
			voucherValue = parseFloat(voucherValue);

			calculateDistributorCommission(voucherValue);
			createPLToBSJournal(voucherValue);
			
			voucherRecord.setFieldValue('custrecord_discompercentage', distributorComPercentage);	
			voucherRecord.setFieldValue('custrecord_disamount', distributorComAmount);	
			voucherRecord.setFieldValue('custrecord_invoiceref', invoiceIntID);				//setting invoice number - version 1.0.2
			
			//version 1.0.5 - making the 'partner' field in invoice optional. Hence setting the customer as the partner in voucher record
			voucherRecord.setFieldValue('custrecord_voucherpartner', invoiceCusIntID);
			
			voucherRecord.setFieldValue('custrecord_pltobsjournal', JournalIntID);
					
			// do not update the customer ID as we are selling to the distributor
			//voucherRecord.setFieldValue('custrecord_vouchercustomer', custIntID);
			
			voucherIntID = nlapiSubmitRecord(voucherRecord, true);
		}
	}
	catch(e)
	{
		errorHandler("updateVoucher", e);		
	}

}


/**
 * get item account details for income and balance sheet transfer
 * 
 * version 1.0.1 - changing the internal ID of the income account 
 */

function getItemAccounts()
{
	
	var itemRecord = null;
	
	try
	{
		
		itemRecord = nlapiLoadRecord('inventoryitem', itemIntID);
		
		//version - 1.0.1 
		incomeAccountIntID = itemRecord.getFieldValue('incomeaccount');
		balSheetTransferIntID = itemRecord.getFieldValue('custitem_balsheetxfer');
		
	}
	catch(e)
	{
		errorHandler("getItemAccounts", e);		
	}

}


/**
 * create journal for P+L to B/S transfer
 *
 */

function createPLToBSJournal(valueOfTheVoucher)
{
	var journalDesc = '';
	var total = 0;
	
	try
	{
	
		
		total = parseFloat(valueOfTheVoucher).toFixed(2);
		
		//total is after deducting the commission from the SO amount
		journalDesc = 'Voucher P/L to B/S transfer for Invoice: ' + tranID;
		
		//Format : createJournal(totalValue, debitAccount, creditAccount, dept, location, subsidiary, jClass, invDate, desc, entity, vatCode)
		JournalIntID = createJournal(total, incomeAccountIntID,  balSheetTransferIntID, 0, journalLocationIntID, 0,0, invDate, journalDesc, custIntID,0);

	}
	catch(e)
	{
		errorHandler("createPLToBSJournal", e);		
	}
	

}



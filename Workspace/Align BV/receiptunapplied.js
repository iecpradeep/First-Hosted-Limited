/**********************************************************************************************************************************************************************
 * Name:        Calculate Unallocated Amounts (receiptunapplied.js)
 * Script Type: User Event
 * Client:      Align Technology BV
 *
 * Version:     1.0.0 - 11 Feb 2013 - first (controlled) release - MJL - see previous uncontrolled code at the end of this block (commented out and taken from DEV)
 *              1.1.0 - 15 Feb 2013 - Modified the code in Credit and deposit part- SA + AS
 *              1.1.1 - 06 Mar 2013 - Split the code into few functions in order to cater both new and existing record MJL + SA
 *              1.1.2 - 06 Mar 2013 - Into the function AfterSubmitReceipt_1 Added load existing record, calculating unapplied amount, setfield value for the existing record (which is applied as credit in new record) - MJL +SA
 *              1.1.3 - 07 Mar 2013 - Added a new function for calculating unapplied amount for existing record (which is applied as credit in new record) - SA
 *				1.1.4 - 07 Mar 2013 - Added a new function (before record submit) for setting the value to a receipt unapplied amount field in the currently using record - SA
 *				1.1.5 - 15 Mar 2013 - Added criteria for selecting line Item, that is only which is ticked apply check box - SA
 *				1.1.6 - 10 Apr 2013 - added a separate function to process old records (which is applied as credit) - SA
 *				1.1.7 - 10 Apr 2013 - Amended - called processOldRecord function inside calculation. - SA
 *
 *
 * Author:      FHL
 * Purpose:     To calculate any unallocated amount for a transaction and store in a custom field
 * 
 * Script:      customscript_receipt_unallocated (E1)
 * Deploy:      customdeploy_receipt_unapplied (E1)
 * 
 * Applies to:	Customer Payment - After Submit Receipt & Before Submit Receipt (setFieldValueForOldRecord)
 * 
 * Notes:       updates a custom field 
 *
 * Library:     Libary.js
 **********************************************************************************************************************************************************************/

var rerunCalc = false;

var newRecordId = 0;
var invoiceCount = 0;
var thisRecord = null;
var unappliedAmount = 0.00;
var paymentAmount = 0.00;
var invAmount = 0.0;
var creditCount = 0;
var depositCount = 0;
var crdAmount = 0.0;
var depAmount = 0.0;
var thisUpdated = 0;
var paymentsMade = 0.00;

var invoiceTotal = 0;
var creditTotal = 0;
var depositTotal = 0;

var isInvoiceApplied = 0;
var isCreditApplied = 0;
var isDepositApplied = 0;

var creditLine = 0;
var crdID = null;
var receipt = null;
var receiptId = 0;

/**************************************************************************************************************************
 * AfterSubmitReceipt_1(type) - performs functions such as, load records, calculates unapplied amount then set field value
 * for custom body field  for new record
 * 
 * @param type - Type of the context, e.g create, edit, view etc
 * 
 * 1.1.2 - Added load existing record, calculating unapplied amount, setfield value for the existing record (which is applied as credit in new record)
 * 1.1.6 - 10 Apr 2013 - created a separate function to process old record, So removed old record process part from this block - SA
 **************************************************************************************************************************/
function AfterSubmitReceipt(type)
{
	try
	{
		loadSubmittedRecord();
		calculateUnappliedAmount(thisRecord);
		thisRecord.setFieldValue('custbody_receipt_unapplied', unappliedAmount.toFixed(2));
	}
	catch(e)
	{
		errorHandler("AfterSubmitReceipt error", e);
	}
}

/**************************************************************************************************************************
 * loadSubmittedRecord - Load record which is currently in use.
 * 1.1.1 - Split the code into few functions in order to cater both new and existing record
 **************************************************************************************************************************/
function loadSubmittedRecord()
{	
	try
	{
		thisRecord = nlapiGetNewRecord();

		invoiceCount = thisRecord.getLineItemCount('apply');
		creditCount = thisRecord.getLineItemCount('credit');
		depositCount = thisRecord.getLineItemCount('deposit');
	}
	catch(e)
	{
		errorHandler('loadSubmittedRecord', e);
	}
}

/**************************************************************************************************************************
 * calculateUnappliedAmount - Calculates unapplied amount for the record currently in use. 
 * 1.1.1 -  Split the code into few functions in order to cater both new and existing record
 * 1.1.7 - Amended - called processOldRecord function inside calculation. - SA
 * 
 * @param record - the record that is currently in use
 **************************************************************************************************************************/
function calculateUnappliedAmount(record)
{
	try
	{	
		//  1.1.0 - Included Credit and deposit - SA
		for (var crd = 1; crd <= creditCount; crd++)
		{
			isCreditApplied = record.getLineItemValue('credit', 'apply', crd);

			if(isCreditApplied == 'T')
			{	
				crdAmount = parseFloat(thisRecord.getLineItemValue('credit', 'amount', crd));
				creditLine = crd;	

				// 1.1.7
				processOldRecord();

				creditTotal = creditTotal + crdAmount;			
			}
		}

		for (var dep = 1; dep <= depositCount; dep++)	
		{
			isDepositApplied = record.getLineItemValue('deposit', 'apply', dep);

			if(isDepositApplied == 'T')
			{
				depAmount = parseFloat(record.getLineItemValue('deposit', 'amount', dep));
				depositTotal = depositTotal + depAmount;		
			}	
		}

		invoiceTotal = 0;
		invoiceCount = thisRecord.getLineItemCount('apply');

		for (var inv = 1; inv <= invoiceCount; inv++) 
		{	
			isInvoiceApplied = record.getLineItemValue('apply', 'apply', inv);

			if(isInvoiceApplied == 'T')
			{			
				invAmount = parseFloat(record.getLineItemValue('apply', 'amount', inv));
				invoiceTotal = invoiceTotal + invAmount;
			}
		}

		paymentAmount = parseFloat(thisRecord.getFieldValue('payment'));

		if(invoiceTotal >= (creditTotal + depositTotal))	
		{
			unappliedAmount = paymentAmount - (invoiceTotal - (creditTotal + depositTotal));	
		}

		else 			
		{
			unappliedAmount = paymentAmount;
		}		

	}
	catch(e)
	{
		errorHandler('calculateUnappliedAmount(record)', e);
	}
}

/**********************************************************************************************************************************
 * calculateUnappliedAmountForOldRecord - Calculates unapplied amount for the record which is applied as credit. 
 * 
 * 1.1.3 -Added a separate function for calculating unapplied amount for existing record (which is applied as credit in new record)
 * 1.1.5 - 15 Mar 2013 - Added criteria for selecting line Item, that is only which is ticked apply check box - SA
 * @param receipt - the record which is applied as credit in the current record. 
 **********************************************************************************************************************************/
function calculateUnappliedAmountForOldRecord(receipt)
{
	try
	{	
		invoiceTotal = 0;
		invAmount = 0;
		invoiceCount = 0;

		invoiceCount = receipt.getLineItemCount('apply');

		for (var invc = 1; invc <= invoiceCount; invc++) 
		{	
			isInvoiceApplied = receipt.getLineItemValue('apply', 'apply', invc);
			// version 1.1.5 
			if(isInvoiceApplied == 'T')
			{
				invAmount = parseFloat(receipt.getLineItemValue('apply', 'amount', invc));
				invoiceTotal = invoiceTotal + invAmount;
			}
		}

		unappliedAmount = paymentAmount - invoiceTotal;	
	}
	catch(e)
	{
		errorHandler('calculateUnappliedAmountForOldRecord(receipt)', e);
	}
}

/**************************************************************************************************************************
 * loadReceiptRecord - Load the record which is applied as credit in the current record 
 * 1.1.1 - 06 Mar 2013 - Split the code into few functions in order to cater both new and existing record
 **************************************************************************************************************************/
function loadReceiptRecord()
{
	var retVal = false;
	try
	{		
		receipt = nlapiLoadRecord('customerpayment', crdID);
		paymentAmount = parseFloat(receipt.getFieldValue('payment'));		

		retVal = true;
	}

	catch(e)
	{
		errorHandler('loadReceiptRecord', e);
	}
	return retVal;
}

/****************************************************************************************************************************************************
 * setFieldValueForOldRecord - Set value to the receipt unaplied field on the new record 
 * 
 * This is the before record submit function, calling loadSubmittedRecord and calculateUnappliedAmount 
 * in order to get thisRecord and unappliedAmount
 * 
 * @param type - Type of the context, e.g create, edit
 * 
 * 1.1.4 -  Added a new function (before record submit) for setting the value to a receipt unapplied amount field in the currently using record - SA
 ***************************************************************************************************************************************************/
function setFieldValueForOldRecord(type)
{
	try
	{
		loadSubmittedRecord();
		calculateUnappliedAmount(thisRecord);

		thisRecord.setFieldValue('custbody_receipt_unapplied', unappliedAmount.toFixed(2));		
	}
	catch(e)
	{
		errorHandler("setFieldValueForCurrentRecord error", e);
	}
}

/****************************************************************************************************************************************************
 * processOldRecord- performs functions such as, load record old record, calculates unapplied amount for existing record
 * 1.1.6 - 10 Apr 2013 - created a separate function to process old record - SA
 ***************************************************************************************************************************************************/
function processOldRecord()
{	
	try
	{
		crdID = thisRecord.getLineItemValue('credit', 'internalid', creditLine);

		if (crdID != null)
		{	
			rerunCalc = loadReceiptRecord();
		}

		if(rerunCalc)
		{		
			if (receipt != null)
			{
				calculateUnappliedAmountForOldRecord(receipt);

				receipt.setFieldValue('custbody_receipt_unapplied', unappliedAmount.toFixed(2));
				receiptId = nlapiSubmitRecord(receipt, true, true);
			}
		}		

	}

	catch(e)
	{
		errorHandler("processrOldRecord error", e);
	}

}





//function beforeSubmitReceipt_1(type)
//{
//var newId = nlapiGetRecordId();
//var theContext = nlapiGetContext();


//var invoiceCount = nlapiGetLineItemCount('apply');
//var creditCount = nlapiGetLineItemCount('credit');
//var depositCount = nlapiGetLineItemCount('deposit');

//var paymentAmount = nlapiGetFieldValue('payment');

//var paymentsMade = 0.00;
//if (theContext.getExecutionContext() == 'xedit' || type == 'xedit') 
//{
//thisRecord = nlapiLoadRecord('customerpayment', newId);
//thisRecord.setFieldValue('memo', 'Test Mass Update 1');
//var thisUpdated = nlapiSubmitRecord(thisRecord, true, true);
//nlapiLogExecution('DEBUG', 'Receipt Mass Update: Type:' + type + ' Id:' + newId, 'Invoices:' + invoiceCount + ', Inv Line:' + inv + ', Payment Amount:' + paymentAmount);
//}
//else
//{
//for (var inv = 0; inv < invoiceCount; inv++) 
//{
//var invAmount = parseFloat(nlapiGetLineItemValue('apply', 'amount', inv + 1));
//if (!isNaN(invAmount)) 
//paymentsMade = paymentsMade + parseFloat(invAmount);
//}
//}
///*
//for (var crd = 0; crd < invoiceCount; crd++){
//paymentsMade = paymentsMade + parseFloat(nlapiGetLineItemValue('credit', 'amount', crd+1));
//}
//for (var dep = 0; dep < invoiceCount; dep++){
//paymentsMade = paymentsMade + parseFloat(nlapiGetLineItemValue('deposit', 'amount', dep+1));
//}
//*/
//var unappliedAmount = paymentAmount - paymentsMade;
//nlapiSetFieldValue('custbody_receipt_unapplied', unappliedAmount.toFixed(2));

//nlapiLogExecution('DEBUG','Receipt Before Submit: Id:'+newId, 'Invoices:'+invoiceCount+', Credits: '+creditCount+', Deposits: '+depositCount+', Payment Amount:'+paymentAmount+', Payments Made:'+paymentsMade+', Unapplied Amount:' + unappliedAmount);
//}

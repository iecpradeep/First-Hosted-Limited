/*************************************************************************************
 * Name:		receiptunappliedForRefund.js
 * Script Type:	User event
 *
 * Version:		1.0.0 - 10th Apr 2013 - First Release - SA
 *
 * Author:		FHL
 * 
 * Purpose:		update receipt unapplied field in the receipts record. 
 * 
 * Script: 		customscript_receiptunappliedforrefund
 * Deploy: 		customdeploy_receiptunappliedforrefund
 * 
 * Notes:		This script will trigger when customer refund applied against a receipt. receiptunapplied.js works for other scenarios.
 * 
 * Library: 	Libary.js
 *************************************************************************************/
var runCalc = false;

var thisRecord = null;
var creditCount = 0;
var isCreditApplied = 0;
var crdAmount = 0; 
var creditLine = 0;
var crdID = null;

var invoiceTotal = 0;
var invAmount = 0;
var invoiceCount = 0;

var invAmount =0;
var paymentAmount = 0;
var unappliedAmount = 0;

var isInvoiceApplied = 0;

/*****************
 * main function
 ****************/

function AfterSubmitRefund()
{
	initialise();
	process();

}


/**********************************************************************
 * 
 * initialise - get the customer refund record which is being created.
 * 
 *********************************************************************/
function initialise()
{
	try
	{
		thisRecord = nlapiGetNewRecord();

	}
	catch(e)
	{
		errorHandler("initialise", e);
	}
}

/**
 * 
 * main process
 * 
 */
function process()
{
	try
	{
		loadSubmittedRecord();

	}
	catch(e)
	{
		errorHandler("process", e);
	}
}



/**************************************************************************************************************************
 * loadSubmittedRecord - Load customer refund record.
 **************************************************************************************************************************/
function loadSubmittedRecord()
{	
	try
	{

		creditCount = thisRecord.getLineItemCount('apply');

		for (var crd = 1; crd <= creditCount; crd++)
		{
			isCreditApplied = thisRecord.getLineItemValue('apply', 'apply', crd);

			if(isCreditApplied == 'T')
			{	
				crdAmount = parseFloat(thisRecord.getLineItemValue('apply', 'amount', crd));
				creditLine = crd;	

				processReceiptRecord();
			}
		}
	}
	catch(e)
	{
		errorHandler('loadSubmittedRecord', e);
	}
}


/****************************************************************************************************************************************************
 * processReceiptRecord- calls functions such as, load record receipt record, calculates unapplied amount.
 * 1.1.6 - 10 Apr 2013 - created a separate function to process old record - SA
 ***************************************************************************************************************************************************/
function processReceiptRecord()
{	
	try
	{
		crdID = thisRecord.getLineItemValue('apply', 'internalid', creditLine);
		runCalc = loadReceiptRecord();

		if(runCalc)
		{		
			if (receipt != null)
			{
				calculateUnappliedAmount(receipt);

				receipt.setFieldValue('custbody_receipt_unapplied', unappliedAmount.toFixed(2));
				receiptId = nlapiSubmitRecord(receipt, true, true);
			}
		}
	}
		catch(e)
		{
			errorHandler("processReceiptRecord error", e);
		}
} 

/**************************************************************************************************************************
 * loadReceiptRecord - Load the record which is applied as credit in the customer refund record 
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


/**********************************************************************************************************************************
 * calculateUnappliedAmount - Calculates unapplied amount for the receipt which is applied as credit in he customer refund. 
 * 
 * @param receipt - the record which is applied as credit in the customer refund record. 
 **********************************************************************************************************************************/
function calculateUnappliedAmount(receipt)
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
		errorHandler('calculateUnappliedAmount(receipt)', e);
	}
}



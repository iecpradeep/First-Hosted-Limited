
/**********************************************************************************************************
 * Name:        Set Refund Amount    (setRefundAmount.js)
 * Script Type: User Event Script
 * Client:      Keison International Limited 
 * 
 * Version:     1.0.0 -     - first release - SA
 *
 * 
 * Author:      FHL
 * Purpose:    whenever refund is created against a deposit, need to set deposit amount in the custom field of sales order record (after making relevant calculation).
 * 
 * Script:      customscript_setrefundamount    
 * Deploy:      customdeploy_setrefundamount 
 * 
 * 
 **********************************************************************************************************/

var thisRecord = null;
var depositCount = 0;
var isDepositApplied = 0;
var depositAmount = 0; 
var depositLine = 0;
var depositID = null;

var salesOrderID = 0;

var oldRefundTotal = 0.00;
var newRefundTotal = 0.00;

/*****************
 * main function
 ****************/

function setRefundAmounts()
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
		// get the customer refund record
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

		loadSubmittedRecord();

}


/**************************************************************************************************************************
 * loadSubmittedRecord - Load customer refund record.
 **************************************************************************************************************************/
function loadSubmittedRecord()
{	
	try
	{

		depositCount = thisRecord.getLineItemCount('deposit');
		
		for (var crd = 1; crd <= depositCount; crd++)
		{
			
			isDepositApplied = thisRecord.getLineItemValue('deposit', 'apply', crd);

			// choose the deposit line which apply check box is ticked
			if(isDepositApplied == 'T')
			{	
				depositAmount = parseFloat(thisRecord.getLineItemValue('deposit', 'amount', crd));
				depositLine = crd;	
				// get the internal id of deposit record 
				depositID = thisRecord.getLineItemValue('deposit','doc', depositLine);

				receipt = nlapiLoadRecord('customerdeposit', depositID);
				
				// get the sales order ID, this will used in the calculation and setting the deposit amount filed value
				salesOrderID = receipt.getFieldValue('salesorder');
				
				// get the existing refund amount value
				oldRefundTotal = parseFloat(receipt.getFieldValue('custbody_refundtotal'));
				
				// add this refund amount to the existing refund amount.
				newRefundTotal= oldRefundTotal + depositAmount ;

				receipt.setFieldValue('custbody_refundtotal', newRefundTotal);
				receiptId = nlapiSubmitRecord(receipt, true, true);
				
				// call the library function, where it process the calculation and set the field values in the sales order
			
				
				if (salesOrderID != null)
					{
					
					updatedDepositedAmount(salesOrderID);
					}
			}
		}
	}
	catch(e)
	{
		errorHandler('loadSubmittedRecord', e);
	}
}

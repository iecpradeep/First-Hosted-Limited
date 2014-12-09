/*************************************************************************************
 * Name:		mrF_PurchaseOrder
 * 
 * Script Type:	Client Script
 *
 * Version:		1.0.0 - 17/07/2013 - first release, copied from existing code to SVN - JP
 * 				1.0.1 - 17/07/2013 - code altered to adhere to FHL coding standards - JP
 *
 * Author:		FHL
 * 
 * Purpose:		Copy the PO Receipt date to the PO Line if a line is created/validated or changed
 * 
 * Script: 		attached to 3 purchase order forms - no script record
 * Deploy: 		no deployment - form attached client script only
 * 
 * Notes:		Associated with the 
 * 
 * Library: 	library.js
 *************************************************************************************/

var headerReceiptDate = null;

/*
 * Adds duedate value into item record.
 */
function lineInitiate ()
{
	try
	{
		headerReceiptDate = nlapiGetFieldValue ( 'duedate' );
		nlapiSetCurrentLineItemValue ( 'custcol_mrf_tran_expectedreceipt', headerReceiptDate );
	}
	catch ( e )
	{
		errorHandler ( 'lineInitiate', e );
	}
}

/*
 * Checks if duedate field is changed and updates items expectedreceipt accordingly.
 */
function fieldChanged ( type, name )
{
	try
	{
		if ( name == 'duedate' )
		{
			headerReceiptDate = nlapiGetFieldValue ( 'duedate' );
			nlapiSetCurrentLineItemValue ( 'custcol_mrf_tran_expectedreceipt', headerReceiptDate );
		}
	}
	catch ( e )
	{
		errorHandler ( 'fieldChanged', e );
	}
}

/*
 * Checks each item line contains a receipt date.
 * Adds the duedate if not.
 */
function validateLine ( type, name )
{
	var lineReceiptDate = null;

	try
	{
		lineReceiptDate = nlapiGetCurrentLineItemValue ( 'item', 'custcol_mrf_tran_expectedreceipt' );
		// alert(lineReceiptDate);

		if ( lineReceiptDate == '' || lineReceiptDate == null )
		{
			headerReceiptDate = nlapiGetFieldValue ( 'duedate' );
			// alert(headReceiptDate);
			nlapiSetCurrentLineItemValue ( 'item', 'custcol_mrf_tran_expectedreceipt', headReceiptDate );
		}
	}
	catch ( e )
	{
		errorHandler ( 'validateLine', e );
	}

	return true;
}

/*************************************************************************************
 * Name:		mrF_PurchaseOrder_UE
 * 
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 17/07/2013 - first release, copied from existing code to SVN - JP
 * 				1.0.1 - 17/07/2013 - code altered to adhere to FHL coding standards - JP
 *
 * Author:		FHL
 * 
 * Purpose:		Copy the PO Receive date to each of the PO lines
 * 
 * Script: 		customscript_mrf_po_ue   
 * Deploy: 		customdeploy_mrf_po_ue
 * 
 * Notes:		Applies to "Purchase Order"
 * 
 * Library: 	library.js
 *************************************************************************************/

/*
 * Checks and sets each items expected receipt date after submit. 
 */
function onSave()
{
	var numLines = null;
	var headerReceiveBy = null;
	var updateLines = null;
	var retVal = false;

	try
	{
		numLines = nlapiGetLineItemCount('item');
		headerReceiveBy = nlapiGetFieldValue('duedate');
		updateLines = nlapiGetFieldValue('custbody_updatereceivedate');

		if (updateLines == 'T')
		{
			for (var i = 1; i <= numLines; i++)
			{
				nlapiSelectLineItem('item', i);
				nlapiSetCurrentLineItemValue('item', 'custcol_mrf_tran_expectedreceipt', headerReceiveBy);
				nlapiCommitLineItem('item');
			}
		}

		nlapiSetFieldValue('custbody_updatereceivedate', 'F');
		
		retVal = true;
	}
	catch(e)
	{
		errorHandler('onSave', e);
	}
	
	return retVal;
}
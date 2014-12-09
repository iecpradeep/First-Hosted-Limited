/*************************************************************************************
 * Name:		Sales Order Approval SS
 * Script Type:	Scheduled 
 *
 * Version:	   1.0.0 - 23.05.2013 -First release - SA
 *
 * Author:		FHL
 * 
 * Purpose:		transform the salesorder to invoice, there is one user event script(journal creation) applied on invoice, If we tarsnformrecord using a user event then journal creation script doesnt work, because one user event cannot call another usereven. that is the reason  this sheduled script is created.
 * 
 * Script: 		customscript_salesorderapprovalscheduled 
 * Deploy: 		customdeploy_salesorderapprovalscheduled 
 * 
 * Notes:		
 * 
 * Library: 	library.js
 *************************************************************************************/

function transformSalesOrder()
{
	var salesOrderId = 0;
	var context = null;
	var invoice = null;
	var invoiceID = null;

	try
	{

		context = nlapiGetContext();
		salesOrderId = context.getSetting('SCRIPT', 'custscript_salesorderid');

		invoice = nlapiTransformRecord('salesorder',salesOrderId, 'invoice');

		invoiceID = nlapiSubmitRecord(invoice, true);

	}
	catch(e)
	{
		errorHandler("transformSalesOrder", e);
	}
}

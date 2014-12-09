/*********************************************************************************************************************************************************
 * Name:			invoiceBtnUE.js
 * Script Type:		User Event - applies to Invoices
 * Client:			Blueberry
 *
 * Version:			1.0.0 – 20/02/2013 – 1st release - AM
 *					1.0.1 - 01/05/2013 - changing all the names from cashSale to Invoice - AS
 *					1.0.2 - 17/06/2013 - commenting our the invoicePrintVoucherBtn() as the customer doesn't need it- AS
 *
 * Author:			FHL
 * Purpose:			To add a button to the required entity types.
 * 
 * Script: 			custscript__invoiceprintbuttons
 * Deploy: 			customdeploy__invoiceprintbuttons
 * 
 * Library: 		library.js
 * 
 *
 * Notes:			This script applies print buttons to the cash sale.
 * 
 *********************************************************************************************************************************************************/


/*****************************************************************************
 * beforeLoad
 * 
 * version 1.0.2 - commenting our the invoicePrintVoucherBtn() as the customer doesn't need it
 *
 * @param type
 * @param form
 *****************************************************************************/
function addBtnBeforeLoad(type, form)
{
	invoicePrintSimBtn(type, form);
	//invoicePrintVoucherBtn(type, form);
}


/*****************************************************************************
 * invoicePrintSimBtn
 * 
 * @param type
 * @param form
 *****************************************************************************/
function invoicePrintSimBtn(type, form)
{
	try
	{
		if(type == 'view')
		{  
			form.addButton('custpage_createinvoicesimsale','Print Sim Cards', "callPrintSimSuitelet");
			form.setScript('customscript_invoiceprintbtnclient');	
			
		}	
	}
	catch(e)
	{
		errorHandler("invoicePrintSimBtn ", e);
	}
}


/*****************************************************************************
 * invoicePrintVoucherBtn
 * 
 * @param type
 * @param form
 *****************************************************************************/
function invoicePrintVoucherBtn(type, form)
{
	try
	{
		if(type == 'view')
		{  
			form.addButton('custpage_createinvoicevouchersale','Print Vouchers', "callPrintVoucherSuitelet");
			form.setScript('customscript_invoiceprintbtnclient');	
		}	
	}
	catch(e)
	{
		errorHandler("invoicePrintVoucherBtn ", e);
	}
}

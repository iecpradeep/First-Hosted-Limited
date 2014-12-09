/*******************************************************
 * Name:					Dolby Quotation Buttons Client Script
 * Script Type:				Client side script
 * Version:					2.0.0
 * Last Modified Date:		20th September 2011
 * Author:					Pete Lewis, First Hosted Limited.
 *******************************************************/

function disableButtons(type, form, request)
{
	try
	{
	var currentContext = nlapiGetContext();

	//Get handle to new record
	var quoteRec = nlapiGetNewRecord();
	var status = quoteRec.getFieldValue('custbody_approvalstatus');
	
	if (status != '2' && currentContext.getExecutionContext() == 'userinterface')
		{
			//Get the button before relabelling or disabling
			var salesOrderButton = form.getButton('createsalesord'); 
			var secSalesOrderButton = form.getButton('secondarycreatesalesord'); 
			var cashSaleButton = form.getButton('createcashsale'); 
			var secCashSaleButton = form.getButton('secondarycreatecashsale'); 
			var invoiceButton = form.getButton('createinvoice'); 
			var secInvoiceButton = form.getButton('secondarycreateinvoice'); 
			var signatureButton = form.getButton('custpage_send_for_signature'); 
			var secSignatureButton = form.getButton('secondarycustpage_send_for_signature'); 
			var emailButton = form.getButton('email'); 
			var secEmailButton = form.getButton('secondaryemail'); 
			
			//Disable the button in the UI
			if (salesOrderButton) salesOrderButton.setDisabled(true);
			if (secSalesOrderButton) secSalesOrderButton.setDisabled(true);
			if (cashSaleButton) cashSaleButton.setDisabled(true);
			if (secCashSaleButton) secCashSaleButton.setDisabled(true);
			if (invoiceButton) invoiceButton.setDisabled(true);
			if (secInvoiceButton) secInvoiceButton.setDisabled(true);
			if (signatureButton) signatureButton.setDisabled(true);
			if (secSignatureButton) secSignatureButton.setDisabled(true);
			if (emailButton) emailButton.setDisabled(true);
			if (secEmailButton) secEmailButton.setDisabled(true);
		
		} //if
		
	}
	catch(e)
	{
		alert('An error occurred whilst attempting to disable the buttons on this form\n\nError: ' + e.message);
	}

	
	return true;
	
} //function
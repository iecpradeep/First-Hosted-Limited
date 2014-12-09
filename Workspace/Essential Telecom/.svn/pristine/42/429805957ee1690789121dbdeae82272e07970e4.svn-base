/**************************************************************************************************************************************************************************
 * Name: 			invoiceBtnClient.js
 * Script Type: 	Client - applies to invoices
 * Client: 			Blueberry
 * 
 * Version: 		1.0.0 - 20/02/2013 - 1st release - AM
 *					1.0.1 - 01/05/2013 - changing the all the names from cashSales to invoice - AS
 * 
 * Author: 			FHL
 * Purpose: 
 * 		
 * Script: 			custscript_invoiceprintbtnclient
 * Deploy: 			customdeploy_invoiceprintbtnclient
 * 
 * Library: 		library.js
 * 
 **************************************************************************************************************************************************************************/

var context = null;
var suiteletURL = null;

/*************************************************************************************
 * callPrintSimSuitelet
 * 
 * 
 *************************************************************************************/
function callPrintSimSuitelet()
{
	var scriptSimNo = 0;
	var deploySimNo = 0;
	
	try
	{	
		context = nlapiGetContext();
		
		//pass through script ID and deploy ID as parameters
		scriptSimNo = context.getSetting('SCRIPT', 'custscript_simscriptids');
		deploySimNo = context.getSetting('SCRIPT', 'custscript_simdeployids');
		
		suiteletURL = nlapiResolveURL('SUITELET', scriptSimNo, deploySimNo);
		
		suiteletURL += '&custparam_invoiceid=' + nlapiGetRecordId();

	}
	catch(e)
	{
		errorHandler("callPrintSimSuitelet ", e);
	}
	
	window.open(suiteletURL, 'Printing Sim PDF');	
}


/*************************************************************************************
 * callPrintVoucherSuitelet
 * 
 * 
 *************************************************************************************/
function callPrintVoucherSuitelet()
{
	var scriptVoucherNo = 0;
	var deployVoucherNo = 0;
	
	try
	{
		
		context = nlapiGetContext();
		
		//automatically build the URL with the follow parameters
		scriptVoucherNo = context.getSetting('SCRIPT', 'custscript_voucherscriptids');
		deployVoucherNo = context.getSetting('SCRIPT', 'custscript_voucherdeployids');
	
		//refer the the name of the suitlet and pass the value in as a parameter
		suiteletURL = nlapiResolveURL('SUITELET', scriptVoucherNo, deployVoucherNo);
		
		//add the follow variables to pass
		suiteletURL += '&custparam_invoiceid=' + nlapiGetRecordId();

	}
	catch(e)
	{
		errorHandler("callPrintVoucherSuitelet ", e);
	}
	
	window.open(suiteletURL, 'Printing Voucher PDF');
}
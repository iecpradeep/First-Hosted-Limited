/**************************************************************************************************************************************************************************
 * Name: 			returnAuthorisationBtnClient.js
 * Script Type: 	Client
 * Client: 			Keison
 * 
 * Version: 		1.0.0 – 09/04/2013 – 1st release - AM
 *
 * Author: 			FHL
 * Purpose: 		To run the user event button when pressed.
 * 		
 * Script: 			custscript_returnauthorisationclient
 * Deploy: 			customdeploy_returnauthorisationclient	- Return Authorisation
 * 					customdeploy_vendorreturnauthorisation	- Vendor Return Authorization
 * 
 * Library: 		library.js
 * 
 **************************************************************************************************************************************************************************/


/*************************************************************************************
 * callCustomerReturnSuitelet
 * 
 * 
 *************************************************************************************/
function callCustomerReturnSuitelet()
{
	var scriptVendRetNo = 0;
	var deployVendRetNo = 0;
	var context = null;
	var suiteletURL = null;
	var params = ''; 
	var width = 500; 
	var height = 350; 

	try
	{
		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=yes'; 
		params += ', menubar=no'; 
		params += ', resizable=yes'; 
		params += ', scrollbars=no'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';

		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();

		scriptVendRetNo = context.getSetting('SCRIPT', 'custscript_customerreturnnumber');
		deployVendRetNo = context.getSetting('SCRIPT', 'custscript_customerreturnnumberdeploy');

		suiteletURL = nlapiResolveURL('SUITELET', scriptVendRetNo, deployVendRetNo);

		window.open(suiteletURL, 'Vendor Returns', params);
	}
	catch(e)
	{
		errorHandler("callVendorReturnSuitelet", e);
	} 
}


/*************************************************************************************
 * callVendorReturnSuitelet
 * 
 * 
 *************************************************************************************/
function callVendorReturnSuitelet()
{
	var scriptVendRetNo = 0;
	var deployVendRetNo = 0;
	var context = null;
	var suiteletURL = null;
	var params = ''; 
	var width = 500; 
	var height = 350; 

	try
	{
		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=yes'; 
		params += ', menubar=no'; 
		params += ', resizable=yes'; 
		params += ', scrollbars=no'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';

		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();

		scriptVendRetNo = context.getSetting('SCRIPT', 'custscript_vendorreturnnumber');
		deployVendRetNo = context.getSetting('SCRIPT', 'custscript_vendorreturnnumberdeploy');

		suiteletURL = nlapiResolveURL('SUITELET', scriptVendRetNo, deployVendRetNo);

		window.open(suiteletURL, 'Customer Returns', params);
	}
	catch(e)
	{
		errorHandler("callVendorReturnSuitelet", e);
	} 
}


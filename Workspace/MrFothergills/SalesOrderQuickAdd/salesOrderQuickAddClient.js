/**********************************************************************************************************
 * Name:        salesOrderQuickAddClient.js
 * Script Type: Client
 * Client:      Mr Fothergills
 * 
 * Version:     1.0.0 - 14/05/2013 - first release - AM
 *  
 * Author:      FHL
 * 
 * Purpose:     To call salesOrderQuickAddSuitelet.js when button is pressed.
 * 
 * Script:      customscript_salesorderquickaddclient 
 * Deploy:      customdeploy_salesorderquickaddclient 
 * 
 * Library:		offersLibrary.js
 * 
 * Form:		Sales Order
 **********************************************************************************************************/


/**
 * - salesOrderQuickAddClient
 * 
 * Main Initialise Function
 * 
 */
function salesOrderQuickAddClient()
{
	var customer = 0;
	var custBrand = 0;

	try
	{
		customer = nlapiGetFieldValue('entity');
		custBrand = nlapiGetFieldValue('department');

		if(customer)
		{
			loadSuitlet(customer, custBrand);
		}
		else
		{
			alert('You need to Add a Customer');
		}	
	}
	catch(e)
	{
		errorHandler('salesOrderQuickAddClient ', e);
	}
}


/**
 * - loadSuitlet
 * 
 * Load Window that calls itemSelectorSuitelet.js
 * 
 * @param cust
 * @param custBran
 */
function loadSuitlet(customer, custBrand)
{
	var scriptNo = '';
	var deployNo = '';
	var suiteletURL = null;
	var params = ''; 
	var width = 550; 
	var height = 300; 

	try
	{
		//Set the window variables.
		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=no'; 
		params += ', menubar=no'; 
		params += ', resizable=yes'; 
		params += ', scrollbars=yes'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';

		//Pass through script ID and deploy ID as parameters
		context = nlapiGetContext();
		scriptNo = context.getSetting('SCRIPT', 'custscript_scriptnumber');
		deployNo = context.getSetting('SCRIPT', 'custscript_deploynumber');

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

		//Add parameters to the url
		suiteletURL = suiteletURL + '&custparam_cust=' + customer;	
		suiteletURL = suiteletURL + '&custparam_brand='+ custBrand;

		window.open(suiteletURL, 'Item', params);
	}
	catch(e)
	{
		errorHandler('loadItemSelectSuitlet ', e);
	}     	      
}


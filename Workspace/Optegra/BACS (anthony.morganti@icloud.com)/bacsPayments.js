/*************************************************************************************************************************************************
 * Name: BACS Payments (bacsPayments.js)
 * Script Type: Suitelet
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 29 Jul 2012 - 1st release - JM
 * 			1.0.1 - 03 Aug 2012 - bug fix - replaced 'between' keyword with 'onorbefore/after' on date filter - MJL (feature removed as of 2.0.0)
 * 			1.0.2 - 14 Aug 2012 - bug fix - read parameters again on POST - MJL (feature removed as of 2.0.0)
 * 			1.0.3 - 23 Aug 2012 - bug fix - birmingham is location int id 24 and NOT 23 - JM (feature removed as of 2.0.0)
 * 			2.0.0 - 30 Aug 2012 - major release - this script generates the UI and gets filters, schedules new BACS create script - MJL
 *			2.0.1 - 09 Nov 2012 - amendment - adding londonAccNo to variables - AS
 * Author: FHL
 * Purpose: Creates interface for getting filter information and posts to scheduled script
 * 
 * Script : customscript_bacspayments
 * Deploy: customdeploy_bacspayments 
 * 
 * Sandbox URL: https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=188&deploy=1
 * Production URL: https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=155&deploy=1
**************************************************************************************************************************************************/

var context = null;
var subsidiaryIntId = 0;
var firstPartyAcctName = '';
var firstPartySortCode = '';
var guildfordAccNo = '';
var corporateAccNo = '';
var solentAccNo = '';
var yorkshireAccNo = '';
var manchesterAccNo = '';
var birminghamAccNo = '';
var londonAccNo = '';

var exportForm = null;
var dateFrom = null;
var dateTo = null;
var location = null;

var bacsCount = 0;

/**
 * Main function called from the Script Deployment record
 * 
 * 1.0.2 bug fix - read parameters again on POST - MJL
 * 2.0.0 on POST runs scheduled script
 */
function bacspayments(request, response) 
{
	if (request.getMethod() == 'GET')
	{
		//Creates custom form for filter information
		buildSelectionForm();
		response.writePage(exportForm);
	}
	else
	{
		runScheduledScript();
		response.write('BACS records are being created. You will receive an email when the process is complete.');
	}
}

/**
 * builds the form for the populate and bacs creation options
 */
function buildSelectionForm()
{
	exportForm = nlapiCreateForm('BACS File Creation');

	exportForm.addSubmitButton('Get Payments for selections');
	
	dateFrom = exportForm.addField('custpage_datefrom','date','Date From');
	dateTo = exportForm.addField('custpage_dateto','date','Date To');
	location = exportForm.addField('custpage_location','select','Location');
	
	lookupLocations();
}


/**
 * 2.0.0 Gets filters from UI and posts to scheduled script
 */
function runScheduledScript()
{
	var params = new Array();
	
	try
	{
		//get filter information from custom form
		dateFrom = request.getParameter('custpage_datefrom');
		dateTo = request.getParameter('custpage_dateto');
		locationID = request.getParameter('custpage_location');
		
		params['custscript_bacssched_datefrom'] = dateFrom;
		params['custscript_bacssched_dateto'] = dateTo;
		params['custscript_bacssched_location'] = locationID;
		
		nlapiScheduleScript('customscript_scheduled_bacspayments', 'customdeploy_scheduled_bacspayments', params);
	}
	catch (e)
	{
		errorHandler(e);
	}
}

/**
 * error handler
 * @param e
 */
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());
	response.write('Error: ' + errorMessage);
}

/**
 * error message
 * @param e
 */
function getErrorMessage(e)
{
	var retVal = '';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}
	return retVal;
}

/**
 * Looks up locations to add to location filter field
 * 
 * 2.0.0 added lookup of subsidiary parameter
 */
function lookupLocations()
{
	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	var itemSearchResults = null;

	//2.0.0 get subsidiary id parameter
	context = nlapiGetContext();
	subsidiaryIntId = context.getSetting('SCRIPT', 'custscript_bacs_subsidiary_intid');
	nlapiLogExecution('AUDIT', 'Subsidiary ID', subsidiaryIntId);
	
	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('subsidiary', null, 'anyof', subsidiaryIntId);    

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');
		invoiceSearchColumns[1] = new nlobjSearchColumn('name');

		// perform search
		itemSearchResults = nlapiSearchRecord('location', null, invoiceSearchFilters, invoiceSearchColumns);
		
		if(itemSearchResults!=null)
		{
			//add blank select option at top of list
			location.addSelectOption('', '', true);

			for (var i = 0; i < itemSearchResults.length; i++)
			{
				location.addSelectOption(itemSearchResults[i].getValue(invoiceSearchColumns[0]), itemSearchResults[i].getValue(invoiceSearchColumns[1]), false);
			} 
		}	
	}
	catch(e)
	{
		errorHandler(e);
	}     	      
}

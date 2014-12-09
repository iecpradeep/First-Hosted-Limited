/*************************************************************************************************************************************************
 * Name			: consolidatedInvoicesInterface.js
 * Script Type	: Suitelet
 * Client		: Align BV 
 * 
 * Version		: 1.0.0 - 21 Mar 2013 - 1st release - AS
 *
 * Author		: FHL
 * Purpose 		: Create interface for Obtain the Consolidated invoice filter information and posts to scheduled script
 * 
 * Script 		: customscript_ci_interface
 * Deploy		: customdeploy_ci_interface
 * 
 * Notes:		: uses a client script for the creation of the date range for the schedule, called: -- customscript_setdateinci
 *				  -119 refers to the saved search record type - ie list all saved searches
 *
 *					if a single customer is selected run scheduled script
 *
 *						customdeploy_consolidated_invoices_cus
 *
 *					if a group of customer is selected run scheduled script
 *
 *						customdeploy_consolidated_invoices_ss
 *
 *
 * 
 * Library		: Library.js
 ***************************************************************************************************************************************************/

//declaring global variables
var selectionForm = null;
var selectedDateFrom = null;
var selectedDateTo = null;
var selectedCustomer = '';
var selectedSavedSearch = '';
var selectedTesting = true;
var selectedSchedule = null;

/************************************************************
 * consolidatedInvoicesInterface function - Main function 
 * 
 * @param request
 * @param response
 ************************************************************/
function consolidatedInvoicesInterface(request, response) 
{

	if (request.getMethod() == 'GET')
	{
		//Creates custom form for filter information
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else
	{
		getParameters();
		
		if(selectedCustomer.length > 0)
		{
			//if a single customer is selected, then run following scheduled script
			runScheduledScript('customscript_consolidated_invoices', 'customdeploy_consolidated_invoices_cus');
		}
		
		else if (selectedSavedSearch.length >0)
		{
			//if a customer group is selected, then run following scheduled script
			runScheduledScript('customscript_consolidated_invoices', 'customdeploy_consolidated_invoices_ss');
			
		}
	

		//redirecting to the page payment proposal custom record list
		response.write('Sales orders are being consolidated.');
	}
}

/*****************************************************************
 * createSelectionForm function - creates the form to obtain the customer inputs
 * 
 *****************************************************************/
function createSelectionForm()
{
	var dateFrom = null;
	var dateTo = null;
	var customer = '';
	var savedSearch = '';
	var testing = true;
	var scheduleDaily = null;
	var scheduleWeekly = null;
	var scheduleMonthly = null;
	var noSchedule = null;
	
	try
	{
		//creating the form
		selectionForm = nlapiCreateForm('Consolidate Sales Order Selection');

		//adding fields
		customer = selectionForm.addField('customer', 'select', 'Customer', 'customer');
		
		// -119 refers to the saved search record type - ie list all saved searches
		savedSearch = selectionForm.addField('savedsearch', 'select', 'Customer Group','-119');

		dateFrom = selectionForm.addField('datefrom','date','Date From');
		dateTo = selectionForm.addField('dateto','date','Date To');
		testing = selectionForm.addField('testing','checkbox', 'Testing');
		
		//adding radio button label
		selectionForm.addField('schedule','label','Quick Date : ').setLayoutType('startrow');
		
		//adding radio buttons
		noSchedule = selectionForm.addField('scheduling', 'radio', 'None', 'noschedule');	
		scheduleDaily = selectionForm.addField('scheduling', 'radio', 'Previous Day', 'scheduledaily');
		scheduleWeekly = selectionForm.addField('scheduling', 'radio', 'Previous Week','scheduleweekly');
		scheduleMonthly = selectionForm.addField('scheduling', 'radio', 'Previous Month','schedulemonthly');
		//setting the radio button's default value
		selectionForm.getField('scheduling', 'noschedule' ).setDefaultValue( 'noschedule' );		
		
		//==========================================================
		//calling the customscript_setdateinci client script
		//for date range creation
		//==========================================================
		selectionForm.setScript('customscript_setdateinci');				
		
		//adding the submit button
		selectionForm.addSubmitButton('Consolidate Sales Orders');
	}
	catch(e)
	{
		errorHandler('createSelectionForm : ', e);
	}
}



/***********************************************************************
 *getParameters - getting the user inputs
 *
 **********************************************************************/
function getParameters()
{
	try
	{
		//get filter information from the selection form
		selectedDateFrom = request.getParameter('datefrom');
		selectedDateTo = request.getParameter('dateto');
		selectedCustomer = request.getParameter('customer');
		selectedSavedSearch = request.getParameter('savedsearch');
		selectedTesting = request.getParameter('testing');
		selectedSchedule = request.getParameter('scheduling');
	}
	catch(e)
	{
		errorHandler('getParameters : ', e);
	}
}



/***********************************************************************
 * runScheduledScript - run the scheduled scripts
 *
 * @param scriptId - script id of the script
 * @param deploymentId - deployment id of the script
 **********************************************************************/

function runScheduledScript(scriptId, deploymentId)
{
	var scriptParams = new Array();

	try
	{
		
		//setting the parameters to the scheduled script
		scriptParams['custscript_cidatefrom'] = selectedDateFrom;
		scriptParams['custscript_cidateto'] = selectedDateTo;
		scriptParams['custscript_cicustomer'] = selectedCustomer;
		scriptParams['custscript_cisavedsearch'] = selectedSavedSearch;
		scriptParams['custscript_citesting'] = selectedTesting;
		scriptParams['custscript_schedule'] = selectedSchedule;
	
		//calling the scheduled script
		nlapiScheduleScript(scriptId,deploymentId, scriptParams);
		
	}
	catch (e)
	{
		errorHandler('runScheduledScript : ', e);
	}
}


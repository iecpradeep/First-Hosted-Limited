/**
 * Module Description
 * 
 * Version    Date            Author  
 * 1.00       14 Oct 2013     Pete
 *
 */


var nsForm = null;
var buttonSchedule = null;

var requestMethod = '';

var customPage = null;
var customPageName = '';
var fldDocketFromDate = null;
var fldDocketToDate = null;
var fldScriptStatus = null;
var fldScriptConsignmentType = null;
var grpDocket = null;
var grpScript = null;
var submitButton = null;
var submitButtonName = '';

//script variables
var scheduledStatus = null;
var scriptParams = [];
var docketString = [];

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function initiateFindConsignmentForExport(request, response)
{
	try
	{
		initialise(request, response);
		generatePage(request, response);
	}
	catch(e)
	{
		errorHandler('initiateFindConsignmentForExport', e);
	}
}


function initialise(request, response)
{
	try
	{
		//do stuff
		requestMethod = request.getMethod();
		customPageName = 'Demo of Find Consignment For Export From TPN Live';
		submitButtonName = 'Find';
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function generatePage(request, response)
{
	try
	{

		customPage = nlapiCreateForm(customPageName);


		if(requestMethod == 'GET')
		{
			grpDocket = customPage.addFieldGroup('docketgroup', 'Find Dockets to Export', null);

			fldDocketFromDate = customPage.addField('custpage_docketfromdate','date','From Date',null,'docketgroup');
			fldDocketFromDate.setHelpText('Enter the date you wish to find dockets from.', false);
			fldDocketToDate = customPage.addField('custpage_dockettodate','date','To Date',null,'docketgroup');
			fldDocketToDate.setHelpText('Enter the date you wish to find dockets to.', false);
			fldScriptConsignmentType = customPage.addField('custpage_consignmenttype', 'select', 'Consignment type', null ,'docketgroup');
			fldScriptConsignmentType.addSelectOption("1", "Requester");
			fldScriptConsignmentType.addSelectOption("2", "Collector");
			fldScriptConsignmentType.addSelectOption("3", "Deliverer");
			fldScriptConsignmentType.addSelectOption("4", "All", true);
			fldScriptConsignmentType.setHelpText('Consignment type you wish to search TPN for', false);
			
			submitButton = customPage.addSubmitButton(submitButtonName);
		}

		if(requestMethod == 'POST')
		{
			grpScript = customPage.addFieldGroup('scriptgroup', 'Script Information', null);
			fldScriptStatus = customPage.addField('custpage_scriptstatus', 'inlinehtml', 'Script Status', null, 'scriptgroup');

			docketString[0] = request.getParameter('custpage_docketfromdate');
			docketString[1] = request.getParameter('custpage_dockettodate');
			docketString[2] = request.getParameter('custpage_consignmenttype');

			nlapiLogExecution('DEBUG', 'from date: ', docketString[0]);
			nlapiLogExecution('DEBUG', 'to date: ', docketString[1]);
			nlapiLogExecution('DEBUG', 'consigment type: ', docketString[2]);

			
			if(docketString[0] != null)
			{
				fldScriptStatus.setDefaultValue('Scheduling Find Consignment Script...');

				scriptParams.custscript_schedulefromdate = docketString[0];
				scriptParams.custscript_scheduletodate = docketString[1];
				scriptParams.custscript_consignmenttype = docketString[2];
				
				scheduledStatus = nlapiScheduleScript('customscript_consignment_export_sch', 'customdeploy_consignment_export_sch_dply', scriptParams);
				
				fldScriptStatus.setDefaultValue('Scheduling Find Consignment Script...' + scheduledStatus); // + '<br><br><b><a href="https://system.na1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&scripttype=66&primarykey=136">Click here</a></b> to see the Script Status');

			}
			else
			{
				fldScriptStatus.setDefaultValue('Error: Docket Dates are invalid!<br><br>Please go back and retry.');
			}
		}

		response.writePage(customPage);
	}
	catch(e)
	{
		errorHandler('generatePage', e);
	}
}




/**************************************************************************************************
 * 
 * Error Handler
 * 
 * @param sourceName - the name of the function which caused the error
 * @param e - the error object itself
 * 
 **************************************************************************************************/
function errorHandler(sourceName, e)
{
	if (e instanceof nlobjError)
	{
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}
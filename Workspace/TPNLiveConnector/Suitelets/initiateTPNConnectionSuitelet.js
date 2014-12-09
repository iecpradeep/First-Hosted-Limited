/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       11 Oct 2013     Pete
 *
 */


var nsForm = null;
var buttonSchedule = null;

var requestMethod = '';

var customPage = null;
var customPageName = '';
var fldDocketNumber = null;
var fldScriptStatus = null;
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
function initiateTPNConnection(request, response)
{
	try
	{
		initialise(request, response);
		generatePage(request, response);
	}
	catch(e)
	{
		errorHandler('initiateTPNConnection', e);
	}
}


function initialise(request, response)
{
	try
	{
		//do stuff
		requestMethod = request.getMethod();
		customPageName = 'Demo of Export From TPN Live';
		submitButtonName = 'Export';
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
			grpDocket = customPage.addFieldGroup('docketgroup', 'Docket to Export', null);

			fldDocketNumber = customPage.addField('custpage_docketnumber','text','Docket Number',null,'docketgroup');
			fldDocketNumber.setHelpText('Enter the docket number you wish to Export from TPN, and import as a Consignment into NetSuite', false);
		
			submitButton = customPage.addSubmitButton(submitButtonName);
		}

		if(requestMethod == 'POST')
		{
			grpScript = customPage.addFieldGroup('scriptgroup', 'Script Information', null);
			fldScriptStatus = customPage.addField('custpage_scriptstatus', 'inlinehtml', 'Script Status', null, 'scriptgroup');

			docketString[0] = request.getParameter('custpage_docketnumber');

			if(docketString[0] != null)
			{
				fldScriptStatus.setDefaultValue('Scheduling Export Script...');

				scriptParams.custscript_docketnumber = docketString;
				scheduledStatus = nlapiScheduleScript('customscript_getexportdocketnumber', 'customdeploy_getexportdocketnumber', scriptParams);
				//TODO: Hard coded
				fldScriptStatus.setDefaultValue('Scheduling Export Script...' + scheduledStatus + '<br><br><b><a href="https://system.na1.netsuite.com/app/common/scripting/scriptstatus.nl?sortcol=dcreated&sortdir=DESC&date=TODAY&scripttype=66&primarykey=136">Click here</a></b> to see the Script Status');
				
				
				
			}
			else
			{
				fldScriptStatus.setDefaultValue('Error: Docket Number is invalid!<br><br>Please go back and retry.');
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
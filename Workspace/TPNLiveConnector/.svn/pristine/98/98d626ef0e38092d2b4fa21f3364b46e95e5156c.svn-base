/**
 * Module Description
 * 
 * Date            Author           Remarks
 * 23 Oct 2013     Anthony			TEST SCRIPT
 *
 */

var requestMethod = '';
var customPage = null;
var customPageName = '';
var submitButtonName = '';
var submitButton = null;
var grpInformation = null;

function initiateTPNImportTest(request, response)
{
	try
	{
		initialise(request, response);
	}
	catch(e)
	{
		errorHandler('initiateTPNImportTest', e);
	}
}

function initialise(request, response)
{
	try
	{
		requestMethod = request.getMethod();
		customPageName = 'Test Import for TPN Live';
		submitButtonName = 'Import';
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function testImport(request, response)
{
	try
	{
		customPage = nlapiCreateForm(customPageName);

		if(requestMethod == 'GET')
		{
			getMethod();
		}
		if(requestMethod == 'POST') 
		{
			postMethod();
		}
	}
	catch(e)
	{
		errorHandler('testImport',e);
	}
}

function getMethod() 
{
	try
	{
		submitButton = customPage.addSubmitButton(submitButtonName);
	}
	catch(e)
	{
		errorHandler('getMethod', e);
	}
}

function postMethod() 
{
	try
	{
		grpInformation = customPage.addFieldGroup('informationgroup', 'Script information', null);
	
		// construct test string
		// post to tpn
		// get response
		// log response
	}
	catch(e)
	{
		errorHandler('postMethod', e);
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
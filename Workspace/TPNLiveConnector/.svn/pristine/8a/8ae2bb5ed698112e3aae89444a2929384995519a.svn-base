/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       02 Oct 2013     Skarn
 *
 */

var requestMethod = '';

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function viewConsignmentsEntryPoint(request, response)
{
	try
	{
		initialise(request, response);
		
	}
	catch(e)
	{
		errorHandler('viewConsignmentsEntryPoint', e);
	}
}

function initialise(request, response)
{
	try
	{
		//get any parameters required
		requestMethod = request.getMethod();
	}
	catch(e)
	{
		errorHandler('initialise', e);
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
	if ( e instanceof nlobjError )
	{
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}
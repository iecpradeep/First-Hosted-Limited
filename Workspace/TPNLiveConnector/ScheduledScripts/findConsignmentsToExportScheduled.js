/**
 * Module Description
 * 
 * Date            Author           Remarks
 * 02 Oct 2013     
 *
 */

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function findConsignmentToExportEntryPoint(type) 
{
	try
	{
		initialise();
	}
	catch(e)
	{
		errorHandler('findConsignmentToExportEntryPoint', e);
	}
}

function initialise()
{
	try
	{
		
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
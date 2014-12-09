/*************************************************************************************
 * Name:		salesOrderClient.js
 * Script Type:	Client
 *
 * Version:		1.0.0 - 24/06/2013 - First Release - Sadak
 * 				1.1.0 - 24/06/2013 - Bug fix - Pete Lewis
 *
 * Author:		FHL
 * 
 * Purpose:		To auto populate the Price for squared metre and Coverage fields
 * 				on line validate
 * 
 * Script: 		customscript_salesorderclient
 * Deploy: 		customdeploy_salesorderclient
 * 
 * Notes:		The library script breaks this script for some reason...
 * 
 * Library: 	none
 *************************************************************************************/



var rate = 0;
var quantity = 0;
var sqMPerPack = 0;
var pricePerSqM = 0;
var coverage = 0;
var lineValidated = false;


/**
 * 
 * initialise
 * 
 */
function validateSalesOrderLine(type)
{
	try
	{
		lineValidated =	calculateFieldValues();	
	}
	catch(e)
	{
		lineValidated = false;
		errorHandler('initialise', e);
	}

	return lineValidated;
}

/**
 * 
 * Gets the values from the required fields.
 * 
 */
function calculateFieldValues()
{
	var retVal = false;
	try
	{
		//alert('Current line item validate has been called');
		rate = nlapiGetCurrentLineItemValue('item', 'rate');

		nlapiLogExecution('debug', 'rate', rate);
		quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
		sqMPerPack = nlapiGetCurrentLineItemValue('item', 'custcol_sqmperpack');


		//Equations for new field values.
		pricePerSqM = rate / sqMPerPack;
		coverage = quantity * sqMPerPack;

		pricePerSqM = parseFloat(pricePerSqM);
		coverage = parseFloat(coverage);

		//Set the line item values		
		nlapiSetCurrentLineItemValue('item', 'custcol_pricemtwo', decimalToFixed(pricePerSqM, 2));
		nlapiSetCurrentLineItemValue('item', 'custcol_coverage', coverage);
		//nlapiCommitLineItem('item');
		retVal = true;
	}
	catch(e)
	{
		errorHandler("calculateFieldValues", e);
	}
	return retVal;
}


/**
 * error handler
 */

function errorHandler(functionName, e)
{
	alert(functionName + ' has detected an error.\nError message: ' + e.message);
	nlapiLogExecution('ERROR', 'unexpected error from ' + functionName, e.message);
}



/*


Object.prototype.toFixed = function(value)
{
	var retVal = 0;

	try
	{
		retVal = toFixed(this, value);
	}
	catch(e)
	{
		errorHandler('Object Prototype toFixed', e);
	}


	return retVal;
};
*/
/*********************************************
 * To round 42.14446 to 3 decimal places, you execute toFixed(42.14446, 3). The return value will be 42.144.
 * To round it DOWN, you need to subtract 0.0005 (=42.14396). Executing the above would then return 42.143.
 * To round it UP, you ADD 0.0005 (=42.14496) which, as it would still not be to the next number, still return 42.144. 
 * @governance 0.
 *
 * @param  {value}   	The number being passed in.
 * @param  {precision}   How many decimal places this number should be fixed to.
 * @return {precision}   The rounded number is returned in its now fixed state
 *
 * @since  2011
 */

function decimalToFixed(value, precision)
{
	try
	{
		var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
		return precision ? integral + '.' +  padding + fraction : integral;
	}
	catch(e)
	{
		errorHandler("decimalToFixed", e);
		return value;
	}
}
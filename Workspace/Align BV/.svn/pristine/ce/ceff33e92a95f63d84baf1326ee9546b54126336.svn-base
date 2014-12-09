/*************************************************************************************************************************
 * Name: 		Exchange Report Calc
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Exchange Report.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4228&c=3524453&h=8b90c78768bd8e846214&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function mileage(type,name)
{
	if ((type == 'expense') && (name == 'category') && (nlapiGetCurrentLineItemText('expense', 'category') == "Mileage"))
	{
		nlapiDisableLineItemField('expense','custcol_km', false);
		nlapiSetCurrentLineItemValue('expense','foreignamount', '0');
		nlapiDisableLineItemField('expense','foreignamount', true);
		nlapiDisableLineItemField('expense','amount', true);
		//var LINE = nlapiGetCurrentLineItemIndex('expense');
		//var field = nlapiGetLineItemField('expense','custcol_km', LINE);
		//field.setMandatory(true);
		var KM = nlapiGetCurrentLineItemValue('expense', 'custcol_km');
		var SUM = (KM * 0.19);
		nlapiSetCurrentLineItemValue('expense','currency', '1');
		nlapiSetCurrentLineItemValue('expense','amount', SUM);
		
		return true;
	}
	else if ((type == 'expense') && (name == 'category') && (nlapiGetCurrentLineItemText('expense', 'category') != "Mileage"))
	{
		nlapiSetCurrentLineItemValue('expense','custcol_km', '');
		nlapiSetCurrentLineItemValue('expense','foreignamount', '0');
		nlapiSetCurrentLineItemValue('expense','currency', '');
		nlapiDisableLineItemField('expense','custcol_km', true);
		nlapiDisableLineItemField('expense','foreignamount', false);
		nlapiDisableLineItemField('expense','amount', false);

		return true;
	}
	else if ((type == 'expense') && (name == 'foreignamount') && (nlapiGetCurrentLineItemText('expense', 'category') != "Mileage"))
	{
		nlapiSetCurrentLineItemValue('expense','currency', '');
		
		return true;
	}
	else
	{
		return true;
	}
}


/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function calculate(type, name)
{
	if ((type == 'expense') && (name == 'custcol_km') && (nlapiGetCurrentLineItemValue('expense', 'custcol_km') != '0'))
	{
		var KM = nlapiGetCurrentLineItemValue('expense', 'custcol_km');
		var SUM = (KM * 0.19);
		nlapiSetCurrentLineItemValue('expense','currency', '1');
		nlapiSetCurrentLineItemValue('expense','foreignamount', SUM);
		nlapiSetCurrentLineItemValue('expense','amount', SUM)

		return true;
	}
	else
	{
		return true;
	}
}


/********************************************************************
 * Name: addButtonSalesOrder_userEvent.js
 * Script Type: User Event
 *
 * Version: 1.0.0 – 4/12/2012 – 1st release - PAL
 * 
 * Author: First Hosted Limited
 *
 * Purpose: Display a button on the Sales Order which links to a Suitelet
 * 
 * Script: The script record id – 48
 * Deploy: The script deployment record id – 1
 *
 * Notes: This script is NOT linked to a form
 * 
 * Library: n/a
 * 
 ********************************************************************/

var formFieldName = 'customform';
var scriptType = 'SUITELET';
var scriptId = '49';
var scriptDeploymentId = '1';

var customForm = '';
var onClickScript = '';
var printBtn = null;
var recordId = '';

var scriptUrl = '';


/****************************
 * 
 * beforeLoad
 * 
 * @param type - passed through from NetSuite
 * @param form - passed through from NetSuite
 */
function beforeLoad(type,form)
{
	try
	{
		initialiseVariables();

		if(recordId) 
		{
			if(customForm)	//If customForm variable is present, it means they are in edit mode. We want them to save it before we print it.
			{
				onClickScript = "alert('You must save the record before attempting to print the PDFs.');";
				printBtn = form.addButton('custpage_printbtn', 'Print PDFs', onClickScript);
			}
			else
			{
				scriptUrl = nlapiResolveURL(scriptType, scriptId, scriptDeploymentId);
				//opens two new windows resolving to the same Suitelet, but passing through different Custom Forms to print from
				onClickScript += "window.open('" + scriptUrl + "&custparam_recordid=" + recordId + "&custparam_customform=" + 123 + "');";
				onClickScript += "window.open('" + scriptUrl + "&custparam_recordid=" + recordId + "&custparam_customform=" + 124 + "');";
				
				//Add the button to the form, and set the script
				printBtn = form.addButton('custpage_printbtn', 'Print PDFs', onClickScript);
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','BeforeLoad Button Add', e.message);
	}
}



function initialiseVariables()
{
	try
	{
		recordId = nlapiGetRecordId();
		customForm = nlapiGetFieldValue(formFieldName);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','initialiseVariables', e.message);
	}

}
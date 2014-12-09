/********************************************************************
 * Name: printSalesOrder_suitelet.js
 * Script Type: Suitelet
 *
 * Version: 1.0.0 – 4/12/2012 – 1st release - PAL
 * 
 * Author: First Hosted Limited
 *
 * Purpose: Pass through Internal ID and Custom Ford ID of Sales Order, and it will return the PDF
 * 
 * Script: The script record id – 49
 * Deploy: The script deployment record id – 1
 *
 * Notes: This script is NOT linked to a form
 * 
 * Library: n/a
 * 
 ********************************************************************/


var formFieldName = 'customform';
var customForm = '';

var recordId = '';
var recordObject = '';

var printFile = null;

var outputPage = '';


/****************************
 * 
 * printTransaction
 * 
 * @param request
 * @param response
 */

function printTransaction(request, response)
{   
	try
	{
		// get item record id and custom form id from URL parameter
		recordId = request.getParameter('custparam_recordid');
		customForm = request.getParameter('custparam_customform');

		if(recordId == 'null'||recordId == ''||recordId == null)
		{
			outputPage = '<html><body><script type="text/javascript">alert("You seemed to have come to this page by mistake.");</script><p>Error: No parameters passed.</p>';
			response.write(outputPage);
		}
		else
		{
			//call the printSalesOrder function, passing the Record ID and the Custom Ford ID (If passed)
			printSalesOrder(recordId, customForm);
		}
	}
	catch(e)
	{
		response.write("Error: " + e.message);
	}
}



function printSalesOrder(recordId, customForm)
{
	try
	{
		if(customForm == 'null'||customForm == ''||customForm == null)
		{
			recordObject = nlapiLoadRecord('salesorder', recordId);
			customForm = recordObject.getFieldValue(formFieldName);
		}

		printFile = nlapiPrintRecord('TRANSACTION', recordId, 'PDF', customForm);

		response.setContentType('PDF','Download' + recordId + '.pdf');	
		response.write(printFile.getValue());
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Print Sales Order', e.message);
	}
}

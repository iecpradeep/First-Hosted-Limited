/**********************************************************************************************************
 * Name:        invoicePrintClient.js
 * Script Type: Client
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 4 Jan 2013 - first release - LE
 *  
 * Author:      FHL
 * Purpose:     Calls invoicePrint.js Suitelet
 * 
 * Script:      n/a  
 * Deploy:      n/a  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

/**
 * Calls invoicePrint.js
 */
function callSuitelet()
{
	try
	{
		// [TODO] AS PER voucherSelectorClient.js
		//script ID 54 deploy ID 1
		window.open('/app/site/hosting/scriptlet.nl?script=54&deploy=1&custparam_cid');
	
	}
	catch(e)
	{
		errorHandler('initialise', e);
	
	}
}

/*
function loadInvoice()
{
	try
	{	
		var getRecId = null;
		var getRecType = null;
		var invRecord = null;
		
		//gets ID and type for invoice
		getRecId = nlapiGetRecordId();
		getRecType = nlapiGetRecordType();
		
		//loads the invoice
		invRecord = nlapiLoadRecord(getRecType, getRecord, null);
		
		//gets values of fields
		invRecord.nlapiGetFieldText('customform');
		invRecord.nlapiGetFieldText('tranid');
		invRecord.nlapiGetFieldText('entity');
		invRecord.nlapiGetFieldText('trandate');
		invRecord.nlapiGetFieldText('postingperiod');
		invRecord.nlapiGetFieldText('duedate');
		invRecord.nlapiGetFieldText('saleseffectivedate');
		invRecord.nlapiGetFieldText('location');
		invRecord.nlapiGetFieldText('subtotal');
		invRecord.nlapiGetFieldText('discounttotal');
		invRecord.nlapiGetFieldText('taxtotal');
		invRecord.nlapiGetFieldText('total');
	}
	catch(e)
	{
		('loadInvoice', e);
	}
}
*/
	/* 
	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	var params = ''; 
    var width = 500; 
    var height = 400; 
	

	try
	{
		
		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
	    params += ', location=yes'; 
	    params += ', menubar=no'; 
	    params += ', resizable=yes'; 
	    params += ', scrollbars=no'; 
	    params += ', status=no'; 
	    params += ', toolbar=no'; 
	    params += ', fullscreen=no';

		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();
		
		scriptNo = context.getSetting('SCRIPT', 'custscript_scriptid');
		deployNo = context.getSetting('SCRIPT', 'custscript_deployid');

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

		window.open(suiteletURL, 'Sim Numbers', params);
			
	}
	catch(e)
	{
		errorHandler("simSelectorClient", e);
	}     	      

}

function test()
{

	alert('hello world');

}
*/
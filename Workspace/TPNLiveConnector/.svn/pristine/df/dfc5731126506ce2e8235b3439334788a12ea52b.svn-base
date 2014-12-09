/**
 * Module Description
 * 
 * Date            Author         
 * 02 Oct 2013     Anthony Nixon
 *
 */

var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var serviceOperation = 'ConsignmentExport';
var postXML = '';
var responseObject = null;
var context = null;
var csvInformation = null;

//SOAP variables
var soapHeaders = new Array();
var responseObject = null; 
var recievingUrl = '';
var encodedCredentials = '';
var postObject = '';

// code variables
var postCode = null;

//error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;

function getDepotFromPostCodeEntryPoint()
{
	try
	{
		initialise();
		getDepotFromPostCode();
	}
	catch(e)
	{
		errorHandler('getDepotFromPostCodeEntryPoint', e);
	}
}

function initialise()
{
	try
	{
		// get post code param
		context = nlapiGetContext();
		postCode = context.getSetting('SCRIPT', 'custscript_postcode');
		
		nlapiLogExecution('DEBUG', 'Post code: ' + postCode);
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function getDepotFromPostCode()
{
	var retVal = 0;
	
	try
	{
		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/GetDepotFromPostcode';

		// build SOAP request
		postObject =  '<?xml version="1.0" encoding="utf-8"?>';
		postObject += '<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
		postObject += '<soap12:Body>';
		postObject += '<GetDepotFromPostcode xmlns="TPNImportExport">';
		postObject += '<inputPostcode>' + postCode +'</inputPostcode>';
		postObject += '</GetDepotFromPostcode>';
		postObject += '</soap12:Body>';
		postObject += '</soap12:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');

		responseCode = responseObject.getCode();
		responseBody = responseObject.getBody();

		nlapiLogExecution('DEBUG', 'response code: ', responseCode);
		nlapiLogExecution('DEBUG', 'response body: ', '<pre>' + responseBody + '</pre>');
		
		tpnErrorHandler(responseBody);
	}
	catch(e)
	{
		errorHandler('sendSoapRequest', e);
	}
	
	return retVal;
}

function tpnErrorHandler(inputString)
{
	var errorString = null;
	var errorFlag = false;
	
	try
	{
		errorString = inputString.indexOf("error");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("fail");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("-1");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("null");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		
		if(errorFlag == true)
		{
			errorCounter++;
			errorMainString += errorCounter+":" +inputString + " , ";
		}
	}
	catch(e)
	{
		errorHandler('tpnErrorHandler', e);
	}
}

function tpnErrorLogger()
{
	var tpnErrorLogRecord = null;
	var errorMethod = null;
	var tpnErrorLogRecordID = null;
	
	try
	{
		// 3 = edit consignment value
		errorMethod = 1;
		
		tpnErrorLogRecord = nlapiCreateRecord('customrecord_tpnresponseoutput');
		tpnErrorLogRecord.setFieldValue('custrecord_tro_outputmessage', errorMainString);		
		tpnErrorLogRecord.setFieldValue('custrecord_tro_tpnmethod', errorMethod);
		tpnErrorLogRecordID = nlapiSubmitRecord(tpnErrorLogRecord);
		
		nlapiLogExecution('DEBUG', 'Errors submitted under record: ' + tpnErrorLogRecordID);
		
	}
	catch(e)
	{
		errorHandler('tpnErrorLogger', e);
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

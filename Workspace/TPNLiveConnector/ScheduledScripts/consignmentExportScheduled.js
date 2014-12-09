/**************************************************************************************************
 * Module Description
 * 
 * Date created    Author/s       
 * 19 Sep 2013     Peter Lewis
 * 				   Anthony Nixon
 * 
 * Update: 18th December 2013 - Peter Lewis, Enabling Solutions.
 *
 **************************************************************************************************/

/**
 * var checkServiceName = 'CheckService';
 * var consignmentExportName = 'ConsignmentExport';
 * var consignmentImportName = 'ConsignmentImport';
 * var consignments_InvoiceProgramName = 'Consignments_InvoiceProgram';
 * var customersImportFromOldTPNName = 'CustomersImportFromOldTPN';
 * var editConsignmentName = 'EditConsignment';
 * var editPalletName = 'EditPallet';
 * var findConsignmentsToExportName = 'FindConsignmentsToExport';
 * var findPoDsForOldImplantName = 'FindPoDsForOldImplant';
 * var findPoDsToExportName = 'FindPoDsToExport';
 * var getDepotFromPostcodeName = 'GetDepotFromPostcode';
 * var getWarehouseNameFromDepotName = 'GetWarehouseNameFromDepot';
 * var PODExportName = 'PODExport';
 * var serviceExportName = 'ServiceExport';
 * var thirdPartyConsignmentExportName = 'ThirdPartyConsignmentExport';
 * var thirdPartyPODExportName = 'ThirdPartyPODExport';
 * var thirdPartyTrackingExportName = 'ThirdPartyTrackingExport';
 * var trackingExportName = 'TrackingExport';
 */

var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
//var serviceURI = 'http://test.tpnonline.net/TPNImportExport/service.asmx?op=';
var serviceOperation = 'ConsignmentExport';
var postXML = '';
var responseObject = null;
var context = null;

var genericHeader = '';
var genericFooter = '';

//SOAP variables
var soapHeaders = new Array();
var responseObject = null; 
var recievingUrl = '';
var encodedCredentials = '';
var postObject = '';

//param variables
var userName = '';
var password = '';
var fromDate = null;
var toDate = null;
var consignmentType = null;

// var date variables
var d = new Date();
var day = null;
var month = null;

//date variables
var dateSplit = null;

//error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;

/**************************************************************************************************
 * 
 * Main entry point in to the script
 * 
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 * 
 **************************************************************************************************/
function consignmentExportEntryPoint(type) 
{
	try
	{
		initialise();
		contactWebService();
	}
	catch(e)
	{
		errorHandler('entryPoint', e);
	}
}

function initialise()
{
	try
	{

		context = nlapiGetContext();

		// get username and password params - not used YET
		userName = context.getSetting('SCRIPT', 'custscript_username');
		password = context.getSetting('SCRIPT', 'custscript_password');

		nlapiLogExecution('DEBUG','user name: ' + userName);
		nlapiLogExecution('DEBUG','password: ' + password);
		
		//get Date parameters
		fromDate = context.getSetting('SCRIPT', 'custscript_schedulefromdate');	
		toDate = context.getSetting('SCRIPT', 'custscript_scheduletodate');	
		consignmentType = context.getSetting('SCRIPT', 'custscript_consignmenttype');
		
		day = d.getDate();
		month = parseInt(d.getMonth()+1);

		if(fromDate == null || toDate == null )
		{
			fromDate =  day  + "/" + month + "/" + d.getFullYear();
			toDate =  day  + "/" + month + "/" + d.getFullYear();
		}	

		nlapiLogExecution('DEBUG', 'consignment type: ', consignmentType);
		nlapiLogExecution('DEBUG', 'date to search TPN from: ', fromDate);
		nlapiLogExecution('DEBUG', 'date to search TPN to: ', toDate);

	}
	catch(e)
	{
		errorHandler('initialise', e);	
	}
}
/*******************************************************************************
 * 
 * @param serviceTypeName
 ******************************************************************************/

function contactWebService(serviceTypeName)
{
	try
	{
		responseObject = sendSOAPRequest(serviceTypeName);
	}
	catch(e)
	{
		errorHandler('contactWebService', e);
	}
}


/*****************************************************************************
 * sendSoapRequest Function - sending the soap request to TPN
 * 
 * @returns - response object
 ****************************************************************************/
function sendSOAPRequest(serviceTypeName)
{
	try
	{
		//convert the credentials to Base 64 in order to pass through via SOAP
		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');

		//soapHeaders['User-Agent-x'] = 'SuiteScript-Call';
		//soapHeaders['Authorization'] = 'Basic ' + encodedCredentials;

		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/FindConsignmentsToExport';

		// build SOAP request
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject +='<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
		postObject +='<soap12:Body>';
		postObject +='<FindConsignmentsToExport  xmlns="TPNImportExport">';
		postObject +='<Username>' + userName + '</Username>';
		postObject +='<Password>' + password + '</Password>';
		postObject +='<DateFrom>' + fromDate +'</DateFrom>';
		postObject +='<DateTo>' + toDate +'</DateTo>';
		postObject +='<ReqColDel>' + consignmentType + '</ReqColDel>';
		postObject +='</FindConsignmentsToExport >';
		postObject +='</soap12:Body>';
		postObject +='</soap12:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');

		nlapiLogExecution('DEBUG', 'Post object', postObject);
		nlapiLogExecution('DEBUG', 'response code', responseObject.getCode());
		nlapiLogExecution('DEBUG', 'response body', responseObject.getBody());

		responseBody = responseObject.getBody();
		tpnErrorHandler(responseBody);
	}
	catch(e)
	{
		errorHandler("sendSOAPRequest : " , e);
	} 

	postToNetSuite();

	return responseObject;	
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
		if(errorMainString != null)
		{
			if(errorMainString.length >0)
			{	
				// 3 = edit consignment value
				errorMethod = 1;

				tpnErrorLogRecord = nlapiCreateRecord('customrecord_tpnresponseoutput');
				tpnErrorLogRecord.setFieldValue('custrecord_tro_outputmessage', errorMainString);		
				tpnErrorLogRecord.setFieldValue('custrecord_tro_tpnmethod', errorMethod);
				tpnErrorLogRecordID = nlapiSubmitRecord(tpnErrorLogRecord);

				nlapiLogExecution('DEBUG', 'Errors submitted under record: ' + tpnErrorLogRecordID);
			}
		}
	}
	catch(e)
	{
		errorHandler('tpnErrorLogger', e);
	}
}

/************************/
function postToNetSuite()
{		
	// local variables
	var tpnResponseRecord = '';
	var tpnResponseRecordID = '';

	try
	{
		tpnResponseRecord = nlapiCreateRecord('customrecord_tpnresponse');
		tpnResponseRecord.setFieldValue('custrecord_responsecode', responseObject.getCode());
		tpnResponseRecord.setFieldValue('custrecord_responsebody', responseObject.getBody());	
		tpnResponseRecord.setFieldValue('custrecord_consignmenttype', consignmentType);
		tpnResponseRecordID = nlapiSubmitRecord(tpnResponseRecord);

		nlapiLogExecution('DEBUG', 'Record submitted under the ID: ' + tpnResponseRecordID);
	}
	catch(e)
	{		
		errorHandler('postToNetSuite',e);
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
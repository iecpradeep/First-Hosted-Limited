/*******************************************************************************
 * Module Description
 * 
 * Date            Author           Remarks
 * 02 Oct 2013     AN 
 * Last update: 2nd December 2013, Peter Lewis
 *
 *******************************************************************************/

/***|Globals***/
//test.tpnonline.net
var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var userName = '046BRYAN';
var password = 'liverpool';
var serviceOperation = 'ConsignmentImport';
var postXML = '';
var responseObject = null;
var context = null;
var csvInformation = null;

var genericHeader = '';
var genericFooter = '';

//SOAP variables
var soapHeaders = new Array();
var responseObject = null; 
var recievingUrl = '';
var encodedCredentials = '';
var postObject = '';
var companyName = null;
var programName = null;

// consignment data
var consignmentString = null;
var tpnResponseRecord = null;
var tpnResponseRecordID = null;

// csv data
var splitCsvData = null;
var recordInternalID = null;
var responseBody = null;
var splitBody = null;
var tpnDocketNo = null;
var rec = null;

//error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;

/**************************************************************************************************
 * 
 * 
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 * 
 **************************************************************************************************/
function consignmentImportEntryPoint(type) 
{
	try
	{
		initialise();
		getConsignmentData();
		sendSOAPRequest();
		attachDocketNumber();
	}
	catch(e)
	{
		errorHandler('consignmentImportEntryPoint', e);
	}
}

/**************************************************************************************************
 * 
 * 
 * 
 **************************************************************************************************/
function initialise()
{
	try
	{
		context = nlapiGetContext();
		
		userName = context.getSetting('SCRIPT', 'custscript_usernameimport');
		password = context.getSetting('SCRIPT', 'custscript_passwordimport');
		recordInternalID = context.getSetting('SCRIPT', 'custscript_record_internal_id');
		
		// this will be a param
		//TODO: Take out
		companyName = 'ukShuttle';
		
		// do not change this
		programName = 'TLC';

	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}
/**************************************************************************************************
 * 
 * 
 **************************************************************************************************/
function getConsignmentData()
{
	try
	{
		// get information from script params when called by user event TODO
		csvInformation = context.getSetting('SCRIPT', 'custscript_csvinformation');
	
		nlapiLogExecution('DEBUG', 'Information from the user event: ', csvInformation);
	}
	catch(e)
	{
		errorHandler('getConsignmentData', e);
	}
}

/**************************************************************************************************
 * 
 **************************************************************************************************/
function sendSOAPRequest()
{
	try
	{
		nlapiLogExecution('DEBUG', 'Logging in as: ' + userName + 'with password: ' + password);
		
		//convert the credentials to Base 64 in order to pass through via SOAP
		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');

		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/ConsignmentImport';

		// build SOAP request
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject +='<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
		postObject +='<soap12:Body>';
		postObject +='<ConsignmentImport xmlns="TPNImportExport">';
		postObject +='<Username>' + userName + '</Username>';
		postObject +='<Password>' + password + '</Password>';
		postObject +='<ImportData>' + csvInformation +'</ImportData>';
		postObject +='<CompanyName>' + companyName +'</CompanyName>';
		postObject +='<ProgramName>' + programName + '</ProgramName>';
		postObject +='</ConsignmentImport >';
		postObject +='</soap12:Body>';
		postObject +='</soap12:Envelope>';

		
		nlapiLogExecution('AUDIT', '### postObject ###', nlapiEscapeXML(postObject));
		
		
		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
		responseBody = responseObject.getBody();


		nlapiLogExecution('DEBUG', 'response code', responseObject.getCode());
		nlapiLogExecution('DEBUG', 'response body', responseBody);
		
		tpnResponseRecord = nlapiCreateRecord('customrecord_tpnresponseoutput');
		tpnResponseRecord.setFieldValue('custrecord_tro_xmloutput', responseBody);
		tpnResponseRecordID = nlapiSubmitRecord(tpnResponseRecord);
		nlapiLogExecution('DEBUG', 'Record submitted under the ID: ' + tpnResponseRecordID);
		
		tpnErrorHandler(responseBody);

	}
	catch(e)
	{
		errorHandler('sendSOAPRequest', e);
	}
}


/**************************************************************************************************
 * 
 * 
 **************************************************************************************************/
function attachDocketNumber()
{
	try
	{
		nlapiLogExecution('DEBUG', '######### attach docket number #### Internal ID: ' + recordInternalID);
		
		// extracting the docket number from the TPN response body
		responseBody = responseObject.getBody();
		nlapiLogExecution('AUDIT', '######### responseBody: ', nlapiEscapeXML(responseBody));
		//docket check
			
		splitBody = responseBody.split('TPN Live Docket:');
		tpnDocketNo = splitBody[1].split(',');
		tpnDocketNo = tpnDocketNo[0];
		
		nlapiLogExecution('DEBUG', 'TPN Docket number: ' + tpnDocketNo);
		
		// attaching this to the transaction record
		rec = nlapiLoadRecord('salesorder', recordInternalID);
		//rec.setFieldValue('otherrefnum', tpnDocketNo);
		rec.setFieldValue('externalid', 'TPN02:' + tpnDocketNo.trim());
		rec.setFieldValue('custbody_tpnconsignmentidentifier', 'TPN02:' + tpnDocketNo.trim());
		
		nlapiSubmitRecord(rec, true, true); 
	}
	catch(e)
	{
		errorHandler('attachDocketNumber', e);
	}
}


/**************************************************************************************************
 * 
 * 
 **************************************************************************************************/
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


/**************************************************************************************************
 * 
 * 
 **************************************************************************************************/
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


/**************************************************************************************************
 * 
 * trim Prototype for String
 * 
 * 
 **************************************************************************************************/
String.prototype.trim = function() 
{ 
	return this.replace(/^\s+|\s+$/g, ''); 
};




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
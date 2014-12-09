/**************************************************************************************************
 * Module Description
 * 
 * Date created    Author/s       
 * 19 Sep 2013     Peter Lewis
 * 				   Anthony Nixon
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

//test.tpnonline.net
var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
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

// param variables
var userName = '046BRYAN';
var password = 'liverpool';
var fromDate = null;
var toDate = null;

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
function entryPoint(type) 
{
	try
	{
		switch(type)
		{
		case 'ondemand':
			//whatever
			break;
		default:
			//damn it
			break;
		}
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
		
		// get username and password params
		userName = context.getSetting('SCRIPT', 'custscript_username');
		password = context.getSetting('SCRIPT', 'custscript_password');
		
		//get Date parameters
		fromDate = context.getSetting('SCRIPT', 'custscript_schedulefromdate');	
		toDate = context.getSetting('SCRIPT', 'custscript_scheduletodate');	

		if(fromDate == null || toDate == null )
		{
			fromDate = new Date();
			toDate = new Date();
		}	
		
		nlapiLogExecution('DEBUG', 'date to search TPN from: '+ fromDate);
		nlapiLogExecution('DEBUG', 'date to search TPN to: '+ toDate);
		
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
 * sendSoapRequest Function - sending the soap request to metapack
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
		postObject +='<ReqColDel>' + 1 + '</ReqColDel>';
		postObject +='</FindConsignmentsToExport >';
		postObject +='</soap12:Body>';
		postObject +='</soap12:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');

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
		tpnResponseRecordID = nlapiSubmitRecord(tpnResponseRecord);

		nlapiLogExecution('DEBUG', 'Record submitted under the ID: ' + tpnResponseRecordID);
	}
	catch(e)
	{		
		errorHandler('postToNetSuite',e);
	}
}

/************************************************************************************************
 * 
 * customerSearch
 * 
 * @param type - example
 * 
 ************************************************************************************************/
function customerSearch(type)
{
	var ctx = nlapiGetContext();  // instantiate the nlobjContext object
	var searchresults = nlapiSearchRecord('customer', 21); // execute a specific saved search
	ctx.setPercentComplete(0.00);  // set the percent complete parameter to 0.00

	for (var i = 0; i < searchresults.length; i++ )  // loop through the search results
	{

		// get the internal ID of each returned record, otherwise you cannot update the results
		var recid =  searchresults[i].getValue('internalid');   

		var record = nlapiLoadRecord('customer', recid);  // load each record from the search
		record.setFieldText('salesrep', 'John Doe');  // set a field display value for Sales Rep
		nlapiSubmitRecord(record, true);  // submit the record
		ctx.setPercentComplete( (100* i)/ searchresults.length );  // calculate the results

		// displays the percentage complete in the %Complete column on
		// the Scheduled Script Status page
		ctx.getPercentComplete();  // displays percentage complete  
	}
}

function tpnErrorHandler(inputString)
{
	var errorString = null;
	var errorFlag = false;
	
	try
	{
		errorString = inputString.indexOf("error");	
		if(errorString > 0)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("fail");	
		if(errorString > 0)
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
		errorMethod = 3;
		
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

//Unused until further notice
//function getExsistingDocket()
//{
//	try
//	{		
//		
//		//convert the credentials to Base 64 in order to pass through via SOAP
//		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');
//		
//		//initialise SOAP headers
//		soapHeaders['Content-type'] =  "text/xml";
//		soapHeaders['SOAPAction'] = 'TPNImportExport/ConsignmentExport';
//
//		// build SOAP request
//		postObject = '<?xml version="1.0" encoding="utf-8"?>';
//		postObject +='<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
//		postObject +='<soap12:Body>';
//		postObject +='<ConsignmentExport xmlns="TPNImportExport">';
//		postObject +='<Username>' + userName + '</Username>';
//		postObject +='<Password>' + password + '</Password>';
//		postObject +='<DocketNumbers>';
//		postObject +='<string>' + docketNo + '</string>';
//		postObject +='</DocketNumbers>';
//		postObject +='</ConsignmentExport>';
//		postObject +='</soap12:Body>';
//		postObject +='</soap12:Envelope>';
//
//		// connecting to TPN by sending the SOAP request and getting the response
//		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
//		responseBody = responseObject.getBody();
//		responseCode = responseObject.getCode();
//		
//		nlapiLogExecution('DEBUG', 'response code: ', responseCode);
//		nlapiLogExecution('DEBUG', 'response body: ', responseBody);
//		
//		if(responseCode == 200)
//		{
//			nlapiLogExecution('DEBUG', 'Correct code recieved, processing Dockets');
//			processDockets();
//		}
//		else
//		{
//			nlapiLogExecution('DEBUG', 'Incorrect code unable to process dockets');
//		}
//	}
//	catch(e)
//	{
//		errorHandler('getExsistingDocket', e);
//	}
//}
//
//function processDockets()
//{
//	try
//	{
//		responseBody = responseObject.getBody();
//		recordArray = responseBody.split("\n");
//		splitRecords = new Array();
//		
//		// creating a 2D array [x][y]
//		for(var i=0; i<recordArray.length; i++)
//		{
//			splitRecords[i] = recordArray[i].split(",");	
//		}
//		
//		// scroll through the x array - [x][y]
//		for(var i=0; i < splitRecords.length-1; i++)	
//		{
//			// pull information from the y array - [x][y]
//
//			// initialise the docket variables
//			thirdPartyIDCompare = splitRecords[i][2];
//			consignorNameCompare = splitRecords[i][9]; /** not used **/
//			consignorAddress1Compare = splitRecords[i][10]; // done
//			consignorAddress2Compare = splitRecords[i][11]; // done
//			consignorAddress3Compare = splitRecords[i][12]; // done
//			consignorAddress4Compare = splitRecords[i][13]; // done
//			consignorPostcodeCompare = splitRecords[i][14]; // done
//			consignorContactNameCompare = splitRecords[i][15]; // done
//			consignorTelephoneCompare = splitRecords[i][16]; // done
//			consignorEmailCompare = splitRecords[i][17]; // done
//			consigneeNameCompare = splitRecords[i][18]; // done
//			consigneeAddress1Compare = splitRecords[i][19]; // done
//			consigneeAddress2Compare = splitRecords[i][20]; // done
//			consigneeAddress3Compare = splitRecords[i][21]; // done
//			consigneeAddress4Compare = splitRecords[i][22]; // done
//			consigneePostcodeCompare = splitRecords[i][23]; // done
//			consigneeContactNameCompare = splitRecords[i][24]; // done
//			consigneeTelephoneCompare = splitRecords[i][25]; // done
//			consigneeEmailCompare = splitRecords[i][26]; // done
//			customerRef = splitRecords[i][3]; // done
//			depotRefCompare = splitRecords[i][4];
//			
//			// only do for the first docket
//			if(i == 0)
//			{
//				docket = docket.split("<ConsignmentExportResult>");
//				docket = docket[1];
//			}
//		}
//	}
//	catch(e)
//	{
//		errorHandler('processDockets', e);
//	}
//}
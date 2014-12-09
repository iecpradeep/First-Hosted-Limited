/**
 * Module Description
 * 
 * Date            Author           
 * 02 Oct 2013     Anthony nixon
 *
 */

/***|Globals***/
//test.tpnonline.net
var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var userName = '046BRYAN';
var password = 'liverpool';
var serviceOperation = 'ConsignmentExport';
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

//string information variables
var editInformation = null;
var splitEditInformation = null;
var fieldNameArray = new Array();

//pallet information variables
var palletFieldTypeArray = new Array();

//docket information
var tpnMaster = null;
var thirdPartyID = null;
var consignorName = null;
var consignorAddress1 = null;
var consignorAddress2 = null;
var consignorAddress3 = null;
var consignorAddress4 = null;
var consignorPostcode = null;
var consignorContactName = null;
var consignorTelephone = null;
var consignorEmail = null;
var consigneeName = null;
var consigneeAddress1 = null;
var consigneeAddress2 = null;
var consigneeAddress3 = null;
var consigneeAddress4 = null;
var consigneePostcode = null;
var consigneeContactName = null;
var consigneeTelephone = null;
var consigneeEmail = null;
var customerRef = null;
var depotRef = null;

//pallet information
var numberOfQuarterPallets = 0;
var weightOfQuarterPallets = 0;
var numberOfHalfPallets = 0;
var weightOfHalfPallets = 0;
var numberOfHalfOSPallets = 0;
var weightOfHalfOSPallets = 0;
var numberOfFullPallets = 0;
var weightOfFullPallets = 0;
var numberOfFullOSPallets = 0;
var weightOfFullOSPallets = 0;

//compare vars
var compareSplitData = null;
var docketNo = null;
var reponseBody = null;
var responseCode = null;
var recordArray = null;
var splitRecords = null;
var palletsCounted = null;
var numberOfPalletLineItems = null;

// error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;

/**
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 */
function editConsignmentEntryPoint(type) 
{
	try
	{
		initialise();
		processEditInformation();
		compareNetsuiteAndTPNFields();
		tpnErrorLogger();
		
		nlapiLogExecution('DEBUG', 'Errors from tpn: ', errorMainString);
	}
	catch(e)
	{
		errorHandler('editConsignmentEntryPoint', e);
	}
}

function initialise()
{
	try
	{
		context = nlapiGetContext();

		// get the gathered edited fields from the edit user event
		editInformation = context.getSetting('SCRIPT', 'custscript_stringinformation');

		// this will be a company param
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

function processEditInformation()
{
	try
	{
		nlapiLogExecution('DEBUG', 'edit Information: ', editInformation);
		splitEditInformation = editInformation.split(',');

		tpnMaster = splitEditInformation[0];
		thirdPartyID = splitEditInformation[1];
		docketNo = splitEditInformation[20];
		numberOfPalletLineItems = splitEditInformation[31];

		nlapiLogExecution('DEBUG', 'Docket number: ' + docketNo);

	}
	catch(e)
	{
		errorHandler('processEditInformation', e);
	}
}

function compareNetsuiteAndTPNFields()
{
	try
	{
		nlapiLogExecution('DEBUG', 'Is tpn the master: ' + tpnMaster);
		
		if(tpnMaster != true)
		{
			buildFieldNameArray();
			sendSOAPRequest();
			editPallets();
		}
		else
		{
			nlapiLogExecution('DEBUG', 'TPN is the master, unable to edit');
		}
	}
	catch(e)
	{
		errorHandler('compareNetsuiteAndTPNFields', e);
	}
}

function buildFieldNameArray()
{
	try
	{
		fieldNameArray[0] = 'TPNMASTER';
		fieldNameArray[1] = 'THIRDPARTYID';
		fieldNameArray[2] = 'CONSIGNEENAME';
		fieldNameArray[3] = 'CONSIGNEEADDRESS1';
		fieldNameArray[4] = 'CONSIGNEEADDRESS2';
		fieldNameArray[5] = 'CONSIGNEEADDRESS3';
		fieldNameArray[6] = 'CONSIGNEEADDRESS4';
		fieldNameArray[7] = 'CONSIGNEECONTACT';
		fieldNameArray[8] = 'CONSIGNEETELEPHONE';
		fieldNameArray[9] = 'CONSIGNEEEMAIL';	
		fieldNameArray[10] = 'CONSIGNORNAME';
		fieldNameArray[11] = 'CONSIGNORADDRESS1';
		fieldNameArray[12] = 'CONSIGNORADDRESS2';
		fieldNameArray[13] = 'CONSIGNORADDRESS3';
		fieldNameArray[14] = 'CONSIGNORADDRESS4';
		fieldNameArray[15] = 'CONSIGNORCONTACT';
		fieldNameArray[16] = 'CONSIGNORTELEPHONE';
		fieldNameArray[17] = 'CONSIGNOREMAIL';	
		fieldNameArray[18] = 'CUSTOMERREF';
		fieldNameArray[19] = 'DEPOTREF';
		fieldNameArray[20] = 'ACTIVE';
	}
	catch(e)
	{
		errorHandler('buildFieldNameArray', e);
	}
}

function sendSOAPRequest(serviceTypeName)
{
	try
	{
		nlapiLogExecution('DEBUG', 'THIRD PARTY ID: ' + thirdPartyID);

		//convert the credentials to Base 64 in order to pass through via SOAP
		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');

		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/EditConsignment';

		// as there will alwaye be 17 fields we loop to 19 - the first 2 fields were third partyID and a check var to see if TPN or NetSuite is master
		for(var i = 2; i < 20; i ++)
		{		
			nlapiLogExecution('DEBUG', 'Editing consignment:' + thirdPartyID,'Editing field: ' + fieldNameArray[i] + ' with value: ' + splitEditInformation[i]);

			// build SOAP request
			postObject = '<?xml version="1.0" encoding="utf-8"?>';
			postObject += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
			postObject += '<soap:Body>';
			postObject += '<EditConsignment xmlns="TPNImportExport">';
			postObject += '<Username>' + userName + '</Username>';
			postObject += '<Password>' + password + '</Password>';
			postObject += '<ThirdPartyID>' + thirdPartyID + '</ThirdPartyID>';
			postObject += '<FieldToEdit>' + fieldNameArray[i] +'</FieldToEdit>';
			postObject += '<NewData>' + splitEditInformation[i] + '</NewData>';
			postObject += '<CompanyName>'+ companyName +'</CompanyName>';
			postObject += '<ProgramName>'+ programName +'</ProgramName>';
			postObject += '</EditConsignment>';
			postObject += '</soap:Body>';
			postObject += '</soap:Envelope>';

			// connecting to TPN by sending the SOAP request and getting the response
			responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
			nlapiLogExecution('DEBUG', 'response body', responseObject.getBody());
			
			responseBody = responseObject.getBody();
			tpnErrorHandler(responseBody);
		}
	}
	catch(e)
	{
		errorHandler("sendSOAPRequest : " , e);
	} 

	return responseObject;	
}

function editPallets() 
{
	try
	{
		numberOfQuarterPallets = splitEditInformation[22];
		numberOfHalfPallets = splitEditInformation[24];
		numberOfHalfOSPallets = splitEditInformation[26];
		numberOfFullPallets = splitEditInformation[28];
		numberOfFullOSPallets = splitEditInformation[30];
		
		weightOfQuarterPallets = splitEditInformation[23];
		weightOfHalfPallets = splitEditInformation[25];
		weightOfHalfOSPallets = splitEditInformation[27];
		weightOfFullPallets = splitEditInformation[29];
		weightOfFullOSPallets = splitEditInformation[31];
		
		nlapiLogExecution('DEBUG', 'Number of quarter pallets: ' + numberOfQuarterPallets, 'Weight of quarter pallets: ' + weightOfQuarterPallets);

		//convert the credentials to Base 64 in order to pass through via SOAP
		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');

		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/EditPallet';

		
		if(numberOfFullPallets > 0)
		{
			nlapiLogExecution('DEBUG', 'full pallets will be edited..');
			for(var i = 0; i < numberOfFullPallets; i++)
			{
				nlapiLogExecution('DEBUG', 'Editing full pallet #' + i); 
				
				editPalletSoapPalletType('FULL PALLET');
				editPalletSoapPalletWeight(parseInt(weightOfFullPallets/numberOfFullPallets));
				palletsCounted = parseInt(palletsCounted+1);
				nlapiLogExecution('DEBUG', 'pallets Counted: ' + palletsCounted);
			}
		}
		if(numberOfFullOSPallets > 0)
		{
			nlapiLogExecution('DEBUG', 'full OS pallets will be edited..');
			for(var i = 0; i < numberOfFullOSPallets; i++)
			{
				nlapiLogExecution('DEBUG', 'Editing full OS pallet #' + i); 
				
				editPalletSoapPalletType('FULL OS');
				editPalletSoapPalletWeight(parseInt(weightOfFullOSPallets/numberOfFullOSPallets));
				palletsCounted = parseInt(palletsCounted+1);
				nlapiLogExecution('DEBUG', 'pallets Counted: ' + palletsCounted);
			}
		}
		if(numberOfHalfPallets > 0)
		{
			nlapiLogExecution('DEBUG', 'Half pallets will be edited..');
			for(var i = 0; i < numberOfHalfPallets; i++)
			{
				nlapiLogExecution('DEBUG', 'Editing half pallet #' + i); 
				
				editPalletSoapPalletType('HALF PALLET');
				editPalletSoapPalletWeight(parseInt(weightOfHalfPallets/numberOfHalfPallets));
				palletsCounted = parseInt(palletsCounted+1);
				nlapiLogExecution('DEBUG', 'pallets Counted: ' + palletsCounted);
			}
		}
		if(numberOfHalfOSPallets > 0)
		{
			nlapiLogExecution('DEBUG', 'Editing half OS pallet #' + i); 
			
			editPalletSoapPalletType('HALF OS');
			editPalletSoapPalletWeight(parseInt(weightOfHalfOSPallets/numberOfHalfOSPallets));
			palletsCounted = parseInt(palletsCounted+1);
			nlapiLogExecution('DEBUG', 'pallets Counted: ' + palletsCounted);
		}
		if(numberOfQuarterPallets > 0)
		{
			nlapiLogExecution('DEBUG', 'Quarter pallets will be edited..');
			for(var i = 0; i < numberOfQuarterPallets; i++)
			{
				nlapiLogExecution('DEBUG', 'Editing quarter pallet #' + i); 
				
				editPalletSoapPalletType('QUARTER');
				editPalletSoapPalletWeight(parseInt(weightOfQuarterPallets/numberOfQuarterPallets));
				palletsCounted = parseInt(palletsCounted+1);
				nlapiLogExecution('DEBUG', 'pallets Counted: ' + palletsCounted);
			}
		}

	}
	catch(e)
	{
		errorHandler('editPallets', e);
	}
}

function editPalletSoapPalletType(palletType)
{
	try
	{
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
		postObject += '<soap:Body>';
		postObject += '<EditPallet xmlns="TPNImportExport">';
		postObject += '<Username>' + userName + '</Username>';
		postObject += '<Password>' + password + '</Password>';
		postObject += '<ThirdPartyID>' + thirdPartyID + '</ThirdPartyID>';
		postObject += '<PalletNumber>' + parseInt(palletsCounted+1) + '</PalletNumber>';
		postObject += '<FieldToEdit>' + 'PALLETTYPE' + '</FieldToEdit>';
		postObject += '<NewData>' + palletType + '</NewData>';
		postObject += '<CompanyName>' + companyName + '</CompanyName>';
		postObject += '<ProgramName>' + programName + '</ProgramName>';
		postObject += '</EditPallet>';
		postObject += '</soap:Body>';
		postObject += '</soap:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
		nlapiLogExecution('DEBUG', 'response body', responseObject.getBody());
		
		responseBody = responseObject.getBody();
		tpnErrorHandler(responseBody);
	}
	catch(e)
	{
		errorHandler('editPalletSoapPalletType', e);
	}
}

function editPalletSoapPalletWeight(palletWeight)
{
	try
	{
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject += '<soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">';
		postObject += '<soap:Body>';
		postObject += '<EditPallet xmlns="TPNImportExport">';
		postObject += '<Username>' + userName + '</Username>';
		postObject += '<Password>' + password + '</Password>';
		postObject += '<ThirdPartyID>' + thirdPartyID + '</ThirdPartyID>';
		postObject += '<PalletNumber>' + parseInt(palletsCounted+1) + '</PalletNumber>';
		postObject += '<FieldToEdit>' + 'PALLETWEIGHT' + '</FieldToEdit>';
		postObject += '<NewData>' + palletWeight + '</NewData>';
		postObject += '<CompanyName>' + companyName + '</CompanyName>';
		postObject += '<ProgramName>' + programName + '</ProgramName>';
		postObject += '</EditPallet>';
		postObject += '</soap:Body>';
		postObject += '</soap:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
		nlapiLogExecution('DEBUG', 'response body', responseObject.getBody());
		
		responseBody = responseObject.getBody();
		tpnErrorHandler(responseBody);
	}
	catch(e)
	{
		errorHandler('editPalletSoapPalletWeight', e);
	}
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
			if(errorMainString.length > 0)
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
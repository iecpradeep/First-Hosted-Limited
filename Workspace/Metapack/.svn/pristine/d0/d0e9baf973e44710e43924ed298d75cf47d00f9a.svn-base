/*******************************************************
 * Name			:	SOAPScriptLibrary
 * Script Type	:	Library
 *
 * Version		:	1.0.0 - 12/07/2013 - Created - AS
 * 			
 * Author		:	FHL
 * Purpose		:	To use as the main Script Library that uses in the 
 * 					different kinds of scripts related to Metapack Integration
 * 
 *******************************************************/


/**************************************************************
 * getAndCreateSOAPMessageTemplate - get the SOAP message template 
 * 									 from the SOAP Message 
 * 		  Library CRS and creating the whole SOAP message template
**************************************************************/
function getAndCreateSOAPMessageTemplate(SOAPFunction)
{
	var libraryRecordIntID = 0;
	var libraryRecord = '';
	var SOAPMessage1 = '';
	var SOAPMessage2 = '';
	var SOAPMessage3 = '';
	var SOAPMessage4 = '';
	var SOAPMessageTemplate = '';
	var nullFlag = 'T';
	try
	{
		//getting the internal id of the SOAP function record from 'SOAP Message Library' CRS
		libraryRecordIntID = genericSearch('customrecord_soapmessagelibrary', 'custrecord_libraryelement', SOAPFunction);
		libraryRecord = nlapiLoadRecord('customrecord_soapmessagelibrary', libraryRecordIntID);
		SOAPMessage1 = libraryRecord.getFieldValue('custrecord_librarysoaprequest');
		
		if(SOAPMessage1 != null)
		{
			SOAPMessageTemplate = SOAPMessageTemplate + SOAPMessage1;
		}
		
		SOAPMessage2 = libraryRecord.getFieldValue('custrecord_librarysoaprequest2');
		
		if(SOAPMessage2 != null)
		{
			SOAPMessageTemplate = SOAPMessageTemplate + SOAPMessage2;
		}
		
		SOAPMessage3 = libraryRecord.getFieldValue('custrecord_librarysoaprequest3');
		
		if(SOAPMessage3 != null)
		{
			SOAPMessageTemplate = SOAPMessageTemplate + SOAPMessage3;
		}
		
		
		SOAPMessage4 = libraryRecord.getFieldValue('custrecord_librarysoaprequest4');
		
		if(SOAPMessage4 != null)
		{
			SOAPMessageTemplate = SOAPMessageTemplate + SOAPMessage4;
		}
		

		
	}
	catch(e)
	{
		errorHandler('getAndCreateSOAPMessageTemplate', e);
	}
	return SOAPMessageTemplate;
}




/*****************************************************************************
 * sendSOAPRequest Function - sending the SOAP request to metapack
 * 
 * @returns - response object
 ****************************************************************************/
function sendSOAPRequest(SOAPMessage, username,password,receivingUrl)
{

	//declaring local variables
	var SOAPHeaders = new Array();
	var responseObject = null; 
	var encodedCredentials = '';

	try
	{
		//passing the credentials to Base 64 in order to pass trough SOAP
		encodedCredentials = nlapiEncrypt(username + ":" + password, 'base64');
		
		nlapiLogExecution('debug', 'encodedCredentials', encodedCredentials);
		//initialising SOAP headers
		SOAPHeaders['Content-type'] =  "text/xml";
		SOAPHeaders['User-Agent-x'] = 'SuiteScript-Call';
		SOAPHeaders['Authorization'] = 'Basic ' + encodedCredentials;
		SOAPHeaders['soapAction'] = ' ';


		//connecting to the metapack by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(receivingUrl,SOAPMessage,SOAPHeaders,'POST');

	}
	catch(e)
	{
		errorHandler("sendSoapRequest : " , e);
	} 

	return responseObject;	

}





/*****************************************************************************
 * createArrayWithData Function - create a two dimensional array with actual SOAP Message Data 
 * 								  in order to create the SOAP Message 
 ****************************************************************************/
function createArrayWithSOAPData(index, header,value)
{
	var SOAPData = new Array();
	try
	{
	
		SOAPData[index] = new Array(header,value);
		

		
	}
	catch(e)
	{
		errorHandler('createArrayWithData', e);
	}
	return SOAPData;
}

/*****************************************************************************
 * setDataIntoArray Function - pushing the data into the array  
 ****************************************************************************/
function setDataIntoArray(arrayIndex, arrayName,title,value)
{
	try
	{
		arrayName[arrayIndex] = new ArrayList(title,value);
	}
	catch(e)
	{
		errorHandler('setDataIntoArray',e);
	}
}

/**********************************************************************
 * errorHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errorHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}



/*********************************************************************
 * genericSearchReturnAnyField - returns any field's value
 * 
 ********************************************************************/
function genericSearchReturnAnyField(table, fieldToSearch, valueToSearch,returnField)
{
	var returningValue = null;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn(returnField);

		// perform search
		var searchResults = nlapiSearchRecord(table, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				returningValue = searchResult.getValue(returnField);
			}
		}
	
	}
	catch(e)
	{
		errorHandler("genericSearchReturnAnyField", e);
	}     	      

	return returningValue;
}



/**
 * generic search - returns internal ID
 * 
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID=0;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(table, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}



/*****************************************************
 * replaceAll - A function which uses Regular Expressions to replace all
 * instances of the given text in the input string
 * 
 * @governance 0.
 * 
 * @param inputString - The source string you wish to replace the text FROM 
 * @param stringToReplace - The text you wish to REPLACE
 * @param stringToReplaceWith - The text you wish to REPLACE IT WITH
 * @returns {String}	-	The inputString, with all text replaced
 * 
 *****************************************************/
function replaceAll(inputString, stringToReplace, stringToReplaceWith)
{
	var retVal = "";
	var regExReplace = null;
	var caseSensitive = "gi";	//force case insensitive

	try
	{
		regExReplace=new RegExp(stringToReplace,caseSensitive);
		retVal = inputString.replace(regExReplace, stringToReplaceWith);
	}
	catch(e)
	{
		errHandler('replaceAll inputstring: ' + inputString, e);
	}

	return retVal;
}

/**********************************************************************
 * convertToFloat Function - convert the fieldValues to float values
 *  
 * @param fieldValue - value to be converted to float
 * @returns {Number} - the resulted float value
 **********************************************************************/
function convertToFloat(fieldValue)
{
	var floatValue = 0;
	try
	{
		floatValue = parseFloat(fieldValue).toFixed(2);
	}
	catch(e)
	{
		errorHandler("convertToFloat : ", e);
	}
	return floatValue;
}




/**************************************************************
 * getCompanyInformation - getting the company information
 * 
 **************************************************************/
function getCompanyInformation()
{
	try
	{
		//getting company's shipping information
		company  = nlapiLoadConfiguration('companyinformation');		//loading the company information
		companyAddress1 = company.getFieldValue('shippingaddress1');	//getting company's shipping address line 1
		companyCity = company.getFieldValue('shippingcity');			//getting company's shipping city
		companyPostCode = company.getFieldValue('shippingzip');			//getting company's shipping post code
		companyCountry = company.getFieldValue('shippingcountry');		//getting 

	}
	catch(e)
	{
		errorHandler('getCompanyInformation ', e);
	}
}



/**
 * convert xml converted characters back
 * @param xml
 * @returns {String}
 */
function decodeXML(xmldecode)
{
	var retVal='';

	try
	{
		xmldecode = xmldecode.replace(/&amp;/g,'&');
		xmldecode = xmldecode.replace(/&lt;/g,'<');
		xmldecode = xmldecode.replace(/&gt;/g,'>');
		xmldecode = xmldecode.replace(/&quot;/g,'\'');
		xmldecode = xmldecode.replace(/&#xD;/g,'\r');
		xmldecode = xmldecode.replace(/&#xA;/g,'\n');  
		//xmldecode = xmldecode.replace(/&#xA;/g,'');  
		//xmldecode = xmldecode.replace(/&gt;&#xA;/g,'');  
		retVal = xmldecode;

	}
	catch(e)
	{
		errorHandler("decodeXML", e);
	}

	return retVal;
}

/**
 * encode xml
 * @param xml
 * @returns {String}
 */
function encodeXML(XMLString)
{
	var retVal='';

	try
	{

		XMLString = XMLString.replace(/</gi,"&lt;");
		XMLString = XMLString.replace(/>/gi,"&gt;");
		XMLString = XMLString.replace(/&/gi,"&amp;");

		//		XMLString = XMLString.replace(/\n/gi,"&#xA;");  
		//	XMLString = XMLString.replace(/\r/gi,"&#xD;");
		//XMLString = XMLString.replace(/\'/gi,"&quot;");

		retVal = XMLString;

	}
	catch(e)
	{
		errorHandler("encodeXML", e);
	}

	return retVal;
}


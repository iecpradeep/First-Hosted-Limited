/*******************************************************************************
 * Module Description
 * 
 * Date Created    Author/s     
 * 23 Sep 2013     Peter Lewis
 * 				   Anthony Nixon
 *
 *******************************************************************************/
// XML variables
var serviceType = null;
var objResponse = null;
var responseXML = null;
var objResponseXML = null;
var context = null;

// TPN variables
var tpnResponseRecordID = null;
var tpnResponseRecord = null;
var consignmentType = null;

// node variables
var xmlNode = null;
var stringNode = null;
var splitNode = null;
var resultsNode = null;
var childrenNodes = new Array();
var childNodeValue = null;
var fieldValue = null;
var splitValue = null;
var docketNumber = null;
var docketString = null;

// script variables
var scheduledStatus = null;
var scriptParams = [];

/*******************************************************************************
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord TPNResponse
 * 
 * @param {String} type Operation types: create, edit, delete, xedit, approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only), dropship, specialorder, orderitems (PO only), paybills (vendor payments)
 * @returns {Void}
 * 
 *******************************************************************************/
function userEventAfterSubmit(type)
{	
	try
	{
		switch(type.toString())
		{
		case 'create':
		case 'edit':
		case 'xedit':
			initialise();
			//getServiceType();
			processConsignmentExport();

			break;
		default:
			//we don't care about this
			break;
		}
	}
	catch(e)
	{
		errorHandler('userEventAfterSubmit', e);
	}
}

/*******************************************************************************
 * 
 * Initialise all the variables which will be used throughout this User Event
 * 
 *******************************************************************************/
function initialise()
{	
	try
	{
		tpnResponseRecordID = nlapiGetRecordId();

		//load the record
		tpnResponseRecord = nlapiLoadRecord('customrecord_tpnresponse', tpnResponseRecordID);

		//get the XML from it
		responseXML= tpnResponseRecord.getFieldValue('custrecord_responsebody');
		consignmentType = tpnResponseRecord.getFieldValue('custrecord_consignmenttype');
		
		nlapiLogExecution('DEBUG', 'Consignment type: ' + consignmentType);
		
		// context
		context = nlapiGetContext();
	}
	catch(e)
	{
		errorHandler('intialise', e);
	}
}

/*******************************************************************************
 * 
 * Gets the service type - NOT IMPLEMENTED
 * 
 *******************************************************************************/
function getServiceType()
{
	try
	{
		//load record
		//get action value
		serviceType = record.getFieldValue('');

		switch(parameterType)
		{
		case 'TPNImportExport/ConsignmentExport':
			processConsignmentExport();
			break;
		case 'a':
			break;
		case 's':
			break;
		case 'd':
			break;
		default:
			break;
		}
	}
	catch(e)
	{
		errorHandler('getServiceType', e);
	}
}

/*******************************************************************************
 * 
 * process the consignment XML
 * 
 *******************************************************************************/
function processConsignmentExport()
{
	try
	{
		//responseXML = '<?xml version="1.0" encoding="utf-8"?><soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/"><soap:Body><ConsignmentExportResponse xmlns="TPNImportExport"><ConsignmentExportResult>string</ConsignmentExportResult></ConsignmentExportResponse></soap:Body></soap:Envelope>';
		responseXML = unescapeXml(responseXML);
		responseXML = responseXML.replace(' xmlns="TPNImportExport"', '');
		
		objResponseXML = nlapiStringToXML(responseXML.toString());
		
		if(objResponseXML == null)
		{
			nlapiLogExecution('DEBUG', 'Issue converting string, characters in responseXML: ' + responseXML.length);
		}
		else
		{
			// check to see if any child nodes are present
			nlapiLogExecution('DEBUG', 'objResponseXML response xml', objResponseXML.hasChildNodes());
			
			if(objResponseXML.hasChildNodes())
			{
				// select the string nodes inside of the below node
				resultsNode = nlapiSelectNodes(objResponseXML, '//FindConsignmentsToExportResult/*');
				
				// log number of nodes
				nlapiLogExecution('DEBUG', 'Number of child nodes: ' + resultsNode.length);
				
				// process each of the nodes
				processNodes();	
			}
			
			nlapiLogExecution('DEBUG', 'Docket string',docketString);
			scriptParams.custscript_docketnumber = docketString;
			scriptParams.custscript_consignmenttypedocket = consignmentType;
			scheduledStatus = nlapiScheduleScript('customscript_getexportdocketnumber', 'customdeploy_getexportdocketnumber', scriptParams);
		}
	}
	catch(e)
	{
		errorHandler('processConsignmentExport', e);
	}
}

/*******************************************************************************
 * 
 * Processes each of the nodes
 * 
 *******************************************************************************/
function processNodes()
{
	for(var i = 0; i <resultsNode.length; i++)
	{
		// get the text node child of the string child
		fieldValue = resultsNode[i].firstChild;
			
		fieldValue = fieldValue.toString();
		//split the string in half
		splitValue = fieldValue.split(":");
		
		// put the second half of the string into new variable
		docketNumber = splitValue[1];
		
		// remove unrequired part of string
		docketNumber = docketNumber.replace(/]/,'');
		
		if(docketString == null)
		{
			docketString = docketNumber+',';
		}
		else
		{
			docketString = docketString+docketNumber+',';
		}
		
		// show remaining usage - unrequired
		//nlapiLogExecution('DEBUG', 'Remaining usage: ' +context.getRemainingUsage());
		
		//print out the docket number
		//nlapiLogExecution('DEBUG', 'Docket number is: ' + docketNumber);
	}
}

function unescapeXml(escapedXml)
{
	var unescaped = escapedXml.replace(/&gt;/g, '>');
	unescaped = unescaped.replace(/&lt;/g, '<');
	return unescaped;    
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





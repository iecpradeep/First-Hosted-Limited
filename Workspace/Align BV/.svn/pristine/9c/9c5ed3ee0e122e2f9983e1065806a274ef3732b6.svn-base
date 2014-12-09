/*************************************************************************************
 * Name:		VAT Service Sweep (VATSweep.js)
 * 
 * Script Type:	Scheduled Script
 * 
 * Client:		Align BV
 *
 * Version:		1.0.0 - 11 Jun 2013 - first release - JM
 *
 * Author:		First Hosted Limited
 * 
 * Purpose:		Determines which customer VAT Reg Numbers have been updated and  
 * 				checks the validity of the VAT Registration Number via a separate 
 * 				external web service and updates customer flags appropriatly
 * 
 * Script: 		customscript_vatsweep
 * Deploy: 		customdeploy_vatsweep 
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

var contextObject = null;
var serviceURL = '';
var scriptUsageLimit = 0;
var searchResults = null;
var searchResult = null;
var customerRecord = null;
var headers = new Array();

/*******************************************************************
 * VAT Sweep 
 * 
 * 
 *******************************************************************/
function VATSweep()
{
	initialise();
	getVATRegChangedCustomers();
	checkCustomersVATRegNoAgainstWebService();

}

/*******************************************************************
 * initialise
 * 
 *******************************************************************/
function initialise()
{
	try
	{
		contextObject = nlapiGetContext();
		serviceURL = 'http://ec.europa.eu/taxation_customs/vies/services/checkVatService';
		scriptUsageLimit = 40;		// min usage limit allowed before re-schedule


	}
	catch(e)
	{
		errHandler('initialise', e);
	}
}


/******************************************************************
 * get VAT Reg Changed Customers
 * 
 ******************************************************************/
function getVATRegChangedCustomers()
{

	var intID = 0;
	
	try
	{

		intID = genericSearch('customer', 'custentity_vatregcheckreq', 'T');

	}
	catch(e)
	{
		errHandler('getVATRegChangedCustomers', e);
	}

}



/******************************************************************
 * check Customer VAT Reg No Against Web Service
 * and update the customer record
 * 
 ******************************************************************/
function checkCustomersVATRegNoAgainstWebService()
{
	var custIntID = 0;
	var billToCountry = 0;
	var VATNumber = '';
	var vatNumberValid = false;

	try
	{

		nlapiLogExecution('DEBUG', 'checkCustomersVATRegNoAgainstWebService: before searchresults', 'before searchresults');
		
		if(searchResults)
		{
			nlapiLogExecution('DEBUG', 'checkCustomersVATRegNoAgainstWebService: searchResults.length', searchResults.length);

			for(var i=0; i<searchResults.length; i++)
			{
				// load a customer
				searchResult = searchResults[ i ];
				custIntID = searchResult.getValue('internalid');
				customerRecord = nlapiLoadRecord('customer', custIntID);
				
				// extract vat number and bill to country 
				VATNumber = customerRecord.getFieldValue('vatregnumber');
				billToCountry = lookupAddressInfo('customer', custIntID, false, true, 'country');
				
				
				// call check service
				vatNumberValid = checkVATNumberOKService(billToCountry,VATNumber);
				
				// and update the customer record
				updateCustomer(vatNumberValid);	
				
				// check if the script needs to be rescheduled
				if(handleAPIGovernance()==true)
				{
					break;
				}
				
			}
		}

	}
	catch(e)
	{
		errHandler('checkCustomerVATRegNoAgainstWebService', e);
	}
}


/**
 * use the european VAT number checking service
 */
function checkVATNumberOKService(billToCountry,VATNumber)
{
	var retVal = true;		// if the service is down, return true as we dont want to update anything if the service is down
	var body = '';

	try
	{
		setupSOAPRequest(billToCountry,VATNumber);
		setupHeaders();

		//connecting to the euro vat number checker
		responseObject = nlapiRequestURL(serviceURL,soapRequest,headers,'POST');

		if(responseObject != null)
		{
			body = responseObject.getBody();
		}

		if(body.indexOf('true')!=-1)
		{
			retVal = true;
		}
		if(body.indexOf('false')!=-1)
		{
			retVal = false;
		}
	}
	catch(e)
	{
		errorHandler("checkVATNumberOKService", e);
	}
	return retVal;
}


/**
 * update customer 
 */
function updateCustomer(VATRegValidServiceCheck)
{
	var vatValidNumber = 'F';
	var submitID = 0;

	try
	{

		nlapiLogExecution('DEBUG', 'updateCustomer VATRegValidServiceCheck', VATRegValidServiceCheck);
		
		if(VATRegValidServiceCheck==true)
		{
			vatValidNumber = 'T';
		}
		
		nlapiLogExecution('DEBUG', 'updateCustomer vatValidNumber', vatValidNumber);

		customerRecord.setFieldValue('custentity_vatnumbervalid',vatValidNumber);
		customerRecord.setFieldValue('custentity_vatregcheckreq','F');
		
		
		submitID = nlapiSubmitRecord(customerRecord, true);
	}
	catch(e)
	{
		errorHandler("updateCustomer", e);
	}
}

/**
 * setup SOAP request string
 */
function setupSOAPRequest(countryCode, VATNumber)
{
	try
	{
		soapRequest = '<?xml version=\"1.0\" encoding=\"UTF-8\" standalone="no"?>'+
		'<SOAP-ENV:Envelope xmlns:SOAPSDK1="http://www.w3.org/2001/XMLSchema" xmlns:SOAPSDK2="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAPSDK3="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">'+
		'<SOAP-ENV:Body>'+
		'<checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">'+
		'<countryCode xmlns:SOAPSDK4="urn:ec.europa.eu:taxud:vies:services:checkVat:types">' + countryCode + '</countryCode>'+
		'<vatNumber xmlns:SOAPSDK5="urn:ec.europa.eu:taxud:vies:services:checkVat:types">' + VATNumber + '</vatNumber>'+
		'</checkVat>'+
		'</SOAP-ENV:Body>'+
		'</SOAP-ENV:Envelope>';
	}
	catch(e)
	{
		errorHandler('setupSOAPRequest', e);
	}
}

/**
 * set up headers
 */
function setupHeaders()
{
	try
	{
		headers['Content-type'] =  "text/xml charset=\"UTF-8\"";
		headers['User-Agent'] = 'SOAP Toolkit 3.0';
		headers['Authorization'] = '';
		headers['SOAPAction'] = "";
		headers['Host'] = 'ec.europa.eu';
		headers['Pragma'] = 'no-cache';
	}
	catch(e)
	{
		errorHandler('setupHeaders', e);
	}
}

/**
 * handle API Governance
 */

function handleAPIGovernance()
{
	var retVal = false;

	try
	{
		executionContext = nlapiGetContext();

		if(executionContext.getRemainingUsage() <= scriptUsageLimit)
		{
			//reschedule this script as the remaining usage is less than the usage limit
			nlapiLogExecution('AUDIT', 'Rescheduling VAT Sweep', 'Units left: ' + context.getRemainingUsage());
			nlapiScheduleScript(executionContext.getScriptId(), executionContext.getDeploymentId());
			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler('handleAPIGovernance', e);
	}

	return retVal;



}


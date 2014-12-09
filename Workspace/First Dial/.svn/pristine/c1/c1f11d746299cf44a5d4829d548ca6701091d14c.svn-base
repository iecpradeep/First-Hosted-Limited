/*************************************************************************************
 * Name:		voicenetTestharness.js 
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 08/10/2012 - Initial version - AM
 *
 * Author:		FHL
 * 
 * Purpose:		test harness for voicenet outbound calls
 * 
 * Script: 		 
 * Deploy: 		
 * 
 *************************************************************************************/

// Declare Global Variables
var voiceNetURL = '';
var token = '';
var callingFromNumber = '';
var headers = new Array();
var contents = '';
var numberToDial = '01270446815';


/**
 * [TODO] Add params that get number to call
 * @param numberToDial
 * 
 */
function dialNumber()
{
	try
	{
//		getNumber();
		initialise();
		contents = setupJSONContents();
		callVoiceNetService();
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'dialNumber', e.message);
//		errorHandler("dialNumber: ", e);
	}
}

//
//function getNumber()
//{
//	try
//	{
//		phoneNumber = request.getParameter('phone');
//		nlapiLogExecution('ERROR', 'phoneNumber ', phoneNumber);
//	}
//	catch(e)
//	{
//		errorHandler("getNumber: ", e);
//	}
//
//}

/**
 * 
 * initialise
 * 
 */
function initialise()
{
	try
	{
		callingFromNumber = '01239803356';
		voiceNetURL = 'https://testapi.voicenet-solutions.com/phones/{0}/calls';
		token = '9fea5c43320b4c39ec8547fdb0a45f1e';

	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'initialise', e.message);
//		errorHandler("initialise", e);
	}
}


/**
 * 
 * set up the JSON Contents for the voicenet service
 * 
 * @returns {String}
 * 
 */
function setupJSONContents()
{
	var retVal = '';
	var jsonObj = null;

	try
	{
		jsonObj = {"call":{"phone_number":numberToDial},"token":token};
		retVal =  JSON.stringify(jsonObj , replacer);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'setupJSONContents', e.message);
//		errorHandler("setupJSONContents: ", e);
	}

	return retVal;
}


/**
 * 
 * call the voicenet service
 * 
 */

function callVoiceNetService()
{
	//var response = ''; 

	try
	{
		headers['Content-Type'] = 'application/json';
		voiceNetURL = voiceNetURL.replace("{0}", callingFromNumber);
		response = nlapiRequestURL( voiceNetURL, contents , headers);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'callVoiceNetService', e.message);
//		errorHandler("callVoiceNetService: ", e);
	}
}


/**
 * 
 * JSON 
 * 
 * @param key
 * @param value
 * @returns
 * 
 */
function replacer(key, value) 
{
	try
	{
		if (typeof value == 'number' && !isFinite(value)) 
		{
			value =  String(value);
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'replacer', e.message);
//		errorHandler("replacer: ", e);
	}

	return value;
}





/**
 *
 *  test harness for debugger only - commented out specifically - do not delete
 * 
 */
function testharnessfordebugger()
{
	/*
	var headers = new Array();
	headers['Content-Type'] = 'application/json';
	var phoneNo = "01270446816";
	var token = "9fea5c43320b4c39ec8547fdb0a45f1e";
	var url = "https://testapi.voicenet-solutions.com/phones/01239803356/calls";
	var contents = {"call":{"phone_number":phoneNo },"token":token};
	var myJSONText =  JSON.stringify(contents , replacer);
	var response = nlapiRequestURL( url, myJSONText , headers);
	var a=0;

	function replacer(key, value) 
	{
	    if (typeof value == 'number' && !isFinite(value)) 
	    {
	        return String(value);
	    }
	    return value;
	}

	 */
}


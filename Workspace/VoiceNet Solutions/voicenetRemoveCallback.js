/*************************************************************************************
 * Name:		voicenetRemoveCallback.js 
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 29/01/2012 - Initial version - JM
 *
 * Author:		FHL
 * 
 * Purpose:		Turns off the Voicenet service for call backs to our URL
 * 
 * Script: 		customscript_[TODO]
 * Deploy: 		customdeploy_[TODO]
 * 
 * Library: 	library.js
 *************************************************************************************/

var voiceNetURL = '';
var token = '';
var telNumberToAssociate = '';
var headers = new Array();
var contents = '';
var callBackURL = '';
var callResponse = ''; 
var numberToReg = '';
var callDetailForm = null;

/**
 * voicenetTurnOnCallback
 */
function voicenetTurnOnCallback(request, response)
{
	try
	{
		if (request.getMethod() == 'GET')
		{
			
			getUserDetails();
			createForm();		
			response.writePage(callDetailForm);
		}
		else
		{
			initialise();
			readVoicenetConfig();
			contents = setupJSONContents();
			callVoiceNetService();
			responseToScreen();		
		}
	}
	catch(e)
	{
		errorHandler("voicenetTurnOnCallback: ", e);
	}

}


/**
 * 
 * initialise
 * [todo] parameterize
 */
function initialise()
{
	try
	{

		//prior to softcoding - left here for reference
		
		//telNumberToAssociate = '01239803356';
		//voiceNetURL = 'https://testapi.voicenet-solutions.com/phones/{0}/callbacks';
		//token = '9fea5c43320b4c39ec8547fdb0a45f1e';
		//callbackURL = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=111&deploy=1&compid=TSTDRV1027453&h=73a639d7828421f9c1a6';

		
		telNumberToAssociate = request.getParameter('custpage_regcallback');
		

	}
	catch(e)
	{
		errorHandler("initialise", e);
	}
}


/**
* 
* user fills in memo
* 
*/
function createForm()
{
	var fieldObj = null;
	
	try
	{
		//Create selection form
		callDetailForm = nlapiCreateForm('Register a Number for Callback',true);

		//Create submit button
		callDetailForm.addSubmitButton('Set.');

		//Create fields
		fieldObj = callDetailForm.addField('custpage_regcallback','text','Number to Register');
		fieldObj.setDefaultValue(numberToReg);
		
	}
	catch (e)
	{
		errorHandler('createForm', e);
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
		jsonObj = {"callback":{"callback_url":callBackURL},"token":token};
		retVal =  JSON.stringify(jsonObj , replacer);

	}
	catch(e)
	{
		errorHandler("setupJSONContents: ", e);
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

	try
	{
		headers['Content-Type'] = 'application/json';
		voiceNetURL = voiceNetURL.replace("{0}", telNumberToAssociate);
		callResponse = nlapiRequestURL( voiceNetURL, contents , headers);
	}
	catch(e)
	{
		errorHandler("callVoiceNetService: ", e);
	}
}


function responseToScreen()
{
	var html = ''; 
	
	html = html + "<html><body>";
	html += '<h1>Response (' + callResponse + ')</h1><br>';
	html += '<h1>Voicenet URL (' + voiceNetURL + ')</h1><br>';
	html += '<h1>JSON String (' + contents + ')</h1><br>';

	html += '</table></body>';

	response.write(html);


}


/**
 * get user details
 * 
 */
function getUserDetails()
{
	
	var userID = 0;
	var userRecord = null;

	try
	{
		userID = nlapiGetUser();
		userRecord = nlapiLoadRecord('employee', userID);
		numberToReg = userRecord.getFieldValue('officephone');
	}
	catch(e)
	{
		errorHandler("getUserDetails: ", e);
	}
}


/**
 * 
 * read voicenet configuration
 * 
 */
function readVoicenetConfig()
{
	var configIntID = 0;
	var configRecord = null;
	
	try
	{
		configIntID = genericSearch('customrecord_voicenetconfig','custrecord_configname','Voicenet');
		configRecord = nlapiLoadRecord('customrecord_voicenetconfig', configIntID);

		voiceNetURL = configRecord.getFieldValue('custrecord_voiceneturl');
		token = configRecord.getFieldValue('custrecord_voicenettoken');
		callBackURL = configRecord.getFieldValue('custrecord_callbackurl');
		voiceNetURL = configRecord.getFieldValue('custrecord_regcallback');
		
	}
	catch(e)
	{
		errorHandler("readVoicenetConfig: ", e);				
	}             

}

/*********************************************************************************************************************************************************
 * Name:			voicenetCall.js 
 * Script Type:		Suitelet
 * Client:			Cloud Computing Services
 *
 * Version:			1.0.0 - 08/10/2012 - Initial version - AM
 *
 * Author:			FHL
 * Purpose:			To make an outgoing call
 * 
 * Script: 			customscript_voicenetcall  
 * Deploy: 			customdeploy_voicenetcall
 * 
 * Library: 		library.js
 *
 * note:			test harness left in commented out at the end of this code - please leave in
 * 
 *********************************************************************************************************************************************************/

//Declare Global Variables
var voiceNetURL = '';
var token = '';
var headers = new Array();
var contents = '';
var numberToDial = '';	
var entityType =  '';
var internalID = 0;

var callDetailForm = null;

// current user details
var userID = 0;
var userRecord = null;
var callingFromNumber = '';
var token = '';
var callMemo = '';


/**
 * @param numberToDial
 * 
 */
function dialNumber(request, response)
{
	var retVal = true;

	try
	{
		if (request.getMethod() == 'GET')
		{
			// extract phone number to store in hidden field for the post back
			extractPhoneNumberToDial();			
			createForm();
			response.writePage(callDetailForm);
		}
		else
		{
			initialise();
			getUserDetails();
			readVoicenetConfig();
			contents = setupJSONContents();
			callVoiceNetService();
			createCallRecord();

			// Close the window after the Call is made.
			//response.writeLine( "<html><body onload='page_init()'><script language='Javascript'>function page_init() { window.close(); }</script></body></html>" );
		}
	}
	catch(e)
	{
		errorHandler("dialNumber: ", e);
	}

	return retVal;
}


/**
 * 
 * extract phone number to dial from URL param
 * 
 */
function extractPhoneNumberToDial()
{
	try
	{
		numberToDial = request.getParameter('custparam_phonenumber');
		entityType =  request.getParameter('custparam_type');
		internalID = request.getParameter('custparam_intid');
	}
	catch (e)
	{
		errorHandler('extractPhoneNumberToDial', e);
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
	var hiddenFieldObj1 = null;
	var hiddenFieldObj2 = null;
	var hiddenFieldObj3 = null;
	
	try
	{
		//Create selection form
		callDetailForm = nlapiCreateForm('Call Details ',true);

		//Create submit button
		callDetailForm.addSubmitButton('Call');

		//Create fields
		fieldObj = callDetailForm.addField('custpage_callmemo','textarea','Call Details');
		//Create fields
		
		hiddenFieldObj1 = callDetailForm.addField('custpage_phonenumbertocall','text','Phone Number');
		//hiddenFieldObj1.setDisplayType('hidden');
		hiddenFieldObj1.setDefaultValue(numberToDial);

		hiddenFieldObj2 = callDetailForm.addField('custpage_entitytype','text','Entity Type');
		//hiddenFieldObj2.setDisplayType('hidden');
		hiddenFieldObj2.setDefaultValue(entityType);
		
		hiddenFieldObj3 = callDetailForm.addField('custpage_internalid','text','hidden');
		hiddenFieldObj3.setDisplayType('hidden');
		hiddenFieldObj3.setDefaultValue(internalID);
	}
	catch (e)
	{
		errorHandler('createForm', e);
	}
}


/**
 * 
 * initialise
 * 
 */
function initialise()
{
	try
	{	
		numberToDial = request.getParameter('custpage_phonenumbertocall');
		entityType = request.getParameter('custpage_entitytype');
		internalID = request.getParameter('custpage_internalid');
		callMemo = request.getParameter('custpage_callmemo');
	}
	catch(e)
	{
		errorHandler("initialise", e);
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
//		voiceNetURL = 'https://testapi.voicenet-solutions.com/phones/{0}/calls';	
		//token = '9fea5c43320b4c39ec8547fdb0a45f1e';								

		configIntID = genericSearch('customrecord_voicenetconfig','custrecord_configname','Voicenet');
		configRecord = nlapiLoadRecord('customrecord_voicenetconfig', configIntID);

		voiceNetURL = configRecord.getFieldValue('custrecord_voiceneturl');
		token = configRecord.getFieldValue('custrecord_voicenettoken');
		
	}
	catch(e)
	{
		errorHandler("readVoicenetConfig", e);				
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
		retVal =  JSON.stringify(jsonObj , replacers);
		
		function replacers(key, value) 
		{
		    if (typeof value == 'number' && !isFinite(value)) {
		        return String(value);
		    }
		    return value;
		}
		
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
	var response = ''; 

	try
	{
		headers['Content-Type'] = 'application/json';
		voiceNetURL = 'https://api.voicenet-solutions.com/phones/01270446813/calls';// voiceNetURL.replace("{0}", callingFromNumber);
		
		nlapiLogExecution('DEBUG', 'callVoiceNetService voiceNetURL ', voiceNetURL);
		nlapiLogExecution('DEBUG', 'callVoiceNetService contents ', contents);
		nlapiLogExecution('DEBUG', 'callVoiceNetService headers ', headers['Content-Type']);
		
		response = nlapiRequestURL( voiceNetURL, contents , headers);
		
		
		nlapiLogExecution('DEBUG', 'callVoiceNetService response ', response);
	}
	catch(e)
	{
		errorHandler("callVoiceNetService: ", e);
	}
}



/**
 * @param key
 * @param value
 * @returns
 */
function replacer(key, value) 
{
    if (typeof value == 'number' && !isFinite(value)) 
    {
        return String(value);
    }
    return value;
}


/**
 * get user details
 * 
 */
function getUserDetails()
{
	try
	{
		userID = nlapiGetUser();
		userRecord = nlapiLoadRecord('employee', userID);
		callingFromNumber = userRecord.getFieldValue('officephone');
		
		nlapiLogExecution('debug', 'getUserDetails callingFromNumber', callingFromNumber);
	}
	catch(e)
	{
		errorHandler("getUserDetails: ", e);
	}
}



/**
 * create Call Record
 */
function createCallRecord()
{

	var call=null;
	var phoneCallIntID=0;
	var today = nlapiDateToString( new Date() );
	
	try
	{
		call = nlapiCreateRecord('phonecall');

		call.setFieldValue('assigned', userID);

		
		if(entityType=='customer')
		{
			call.setFieldValue('company', internalID);
		}
		if(entityType=='vendor')
		{
			call.setFieldValue('company', internalID);
		}
		if(entityType=='partner')
		{
			call.setFieldValue('company', internalID);
		}
		if(entityType=='employee')
		{
			call.setFieldValue('contact', internalID);
		}
		if(entityType=='contact')
		{
			call.setFieldValue('contact', internalID);
		}

		call.setFieldValue('customform', -150);		// standard call form
		call.setFieldValue('owner', userID);
		call.setFieldValue('phone', callingFromNumber);
		call.setFieldValue('accesslevel', 'F');
		call.setFieldValue('priority', 'MEDIUM');
		call.setFieldValue('startdate', today);
		call.setFieldValue('status', 'SCHEDULED');
		call.setFieldValue('title', callMemo);
		//call.setFieldValue('subject', 'Voicenet Call');
	//	call.setFieldValue('memo', callMemo); [todo] AM

		phoneCallIntID = nlapiSubmitRecord(call, true);
	}
	catch(e)
	{
		errorHandler("createCallRecord",e);
	}     	      

/*	if(phoneCallIntID!=0)	{
		html += '<h1>call created</h1><br>';
	}
	else
	{
		html += '<h1>call NOT created</h1><br>';

	}*/

	return phoneCallIntID;
}



/**
*
*  TEST HARNESS FOR DEBUGGER ONLY - commented out specifically - do not delete
* 
*/
function testharnessfordebugger()
{
/*	var headers = new Array();
	headers['Content-Type'] = 'application/json';
	var phoneNo = "01270446816";
	var token = "9fea5c43320b4c39ec8547fdb0a45f1e";
	var url = "https://testapi.voicenet-solutions.com/phones/01239803356/calls";
	var contents = {"call":{"phone_number":phoneNo },"token":token};
	var myJSONText =  JSON.stringify(contents , replacers);
	var response = nlapiRequestURL( url, myJSONText , headers);
	var a=0;

	function replacers(key, value) 
	{
	    if (typeof value == 'number' && !isFinite(value)) {
	        return String(value);
	    }
	    return value;
	}

*/ 
}


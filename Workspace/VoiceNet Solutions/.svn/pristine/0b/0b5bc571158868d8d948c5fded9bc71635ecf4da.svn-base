/*************************************************************************************
 * Name:		voicenetReceive.js 
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 08/10/2012 - Initial version - JM
 *
 * Author:		FHL
 * 
 * Purpose:		Receives a call from Voicenet
 * 
 * Script: 		customscript_voicenetreceive
 * Deploy: 		customdeploy_voicenetreceive
 * 
 * Notes:		needs to be deployed to work without login required
 * 
 * Library: 	library.js
 *************************************************************************************/

var targetPhone = '';
var sourcePhone = '';

function voicenetReceive(request, response)
{
	nlapiLogExecution('DEBUG', 'voicenetReceive');
	getParams(request);
	updateTelephonyRecord(sourcePhone, targetPhone,sourcePhone);
}

/**
 * extract the JSON parameters
 */

function getParams(request)
{
	var params = request.getAllParameters();
	for ( param in params )
	{
		if(param=='to')
		{
			targetPhone = params[param];
		}
		if(param=='from')
		{
			sourcePhone = params[param];
		}
	} 

}

/**
 * create Telephony Record
 */
function updateTelephonyRecord(contents,to, from)
{

	var telephony=null;
	var telephonyCallIntID = 0;
	var today =  new Date();
//	var a = today.toLocaleString();
	var myDate = nlapiDateToString(today);

	try
	{		
		telephony = nlapiCreateRecord('customrecord_telephony');
		
		telephony.setFieldValue('custrecord_targettelephone', to);
		telephony.setFieldValue('custrecord_sourcetelephone', from);
		telephony.setFieldValue('custrecord_starttime', today.toTimeString());
		telephony.setFieldValue('custrecord_telpayload',contents);
		telephony.setFieldValue('custrecord_callhandled','F');
		telephony.setFieldValue('custrecord_inbound','T');
		telephony.setFieldValue('custrecord_outbound','F');
		telephony.setFieldValue('custrecord_date', myDate);
		
		telephonyCallIntID = nlapiSubmitRecord(telephony, true);
		
		nlapiLogExecution('DEBUG', 'updateTelephonyRecord myDate', myDate);
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'updateTelephonyRecord', e.message);
		//errorHandler("updateTelephonyRecord",e);
	}     	      

	return telephonyCallIntID;

}

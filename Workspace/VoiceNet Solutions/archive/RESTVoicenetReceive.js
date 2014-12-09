/*************************************************************************************
 * Name:		RESTVoicenetReceive.js 
 * Script Type:	REST
 *
 * Version:		1.0.0 - 08/10/2012 - Initial version - JM
 *
 * Author:		FHL
 * 
 * Purpose:		REST Service for inbound calls
 * 
 * Script: 		
 * Deploy: 		
 * 
 * Library: library.js
 *************************************************************************************/

/**
 * @param {Object} dataIn Parameter object
 * @returns {Object} Output object
 */
function receiveCallData(dataIn)
{
	var contents='';
	var retVal = '';

	contents = datain.contents;
	
	updateTelephonyRecord(contents);
	
	return true;
}

/**
 * update Telephony Record
 */
function updateTelephonyRecord(contents)
{

	var telephony=null;
	var telephonyCallIntID=0;
	var today = nlapiDateToString( new Date() );

	try
	{
		telephony = nlapiCreateRecord('customrecord_telephony');
		 
		telephony.setFieldValue('custrecord_telpayload',contents);
		telephony.setFieldValue('custrecord_callhandled','F');

		telephonyCallIntID = nlapiSubmitRecord(telephony, true);

	}
	catch(e)
	{
		errorHandler("updateTelephonyRecord",e);
	}     	      

	return telephonyCallIntID;

}


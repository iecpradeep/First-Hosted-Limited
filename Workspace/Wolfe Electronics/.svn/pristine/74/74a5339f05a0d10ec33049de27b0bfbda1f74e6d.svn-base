/*************************************************************************
 * Name: 		requestURLCredUE.js
 * Script Type: User Event
 * Client: 		Destiny - MetaPack connection Test
 * 
 * Version: 	1.0.0 - 10/04/2013 - Initial release - AM
 * 
 * Author: 		FHL
 * Purpose: 	This is for testing a connection with MetaPack
 *  
 * Script: 		customscript_[TODO]
 * Deploy: 		customdeploy_[TODO]
 * 
 * 
 * Notes:		URI:		http://dm-qa.metapack.com 
 * 				User: 		destinynetsuite 
 * 				Password: 	fu2afrEt
 * 				API:		http://metapack.com/devcentre/
 * 
 *   
 * 
 **************************************************************************/


/**
 * 
 */
function doActionOnCredientialField()
{
	nlapiLogExecution('DEBUG', 'Inside the Page Init Script');
	var currentContext = nlapiGetContext();

//	Add a second tab to the form. 
	var valuefromusernamecustfield = nlapiGetFieldValue('custbody1');   //fields from save credential script
	var valuefrompasswdcustfield = nlapiGetFieldValue('custbody2');

	nlapiLogExecution('DEBUG', 'Value of Custom Field custbody1: ', valuefromusernamecustfield);
	nlapiLogExecution('DEBUG', 'Value of Custom Field custbody2: ', valuefrompasswdcustfield);

	var myDomains = new Array('merchantesolutionstest', 'www.veritrans.co.jp', 'system.netsuite.com');

//	refer script id of the use credential script here
	var usrfield = form.addCredentialField('custpage_username', 'username',
			myDomains,'customscript19', valuefromusernamecustfield, false, null); 

	var credField = form.addCredentialField('custpage_credname', 'password', myDomains, 'customscript19',
			valuefrompasswdcustfield, false, null);
} 


/**
 * 
 */
function saveCredentialField()
{
	nlapiLogExecution('DEBUG', 'Inside the Save Credential Script');

	var currentContext = nlapiGetContext();
	var credValue = nlapiGetFieldValue('custpage_username');
	var username = nlapiGetFieldValue('custpage_credname');

	nlapiLogExecution('DEBUG','Credential Value: ', credValue); 
	nlapiLogExecution('DEBUG', 'Username: ' + username); 

	nlapiSetFieldValue('custbody1', credValue);
	nlapiSetFieldValue('custbody2', username);

	var valueFromCustomField = nlapiGetFieldValue('custbody_password');

	nlapiLogExecution('DEBUG','Value of Custom Field: ', valueFromCustomField);
} 


/**
 * 
 */
function connectMES()
{
	nlapiLogExecution('DEBUG', 'Inside the connection script ');

	var currentContext = nlapiGetContext();
	var uname = nlapiGetFieldValue('custbody1');
	var pwd = nlapiGetFieldValue('custbody2');
	var url = 'https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=20&deploy=1?';
	url = url + 'profile_id=' + '$base64(('+uname+'})';
	url = url + '&profile_key=' + '{'+pwd+'}';

	nlapiLogExecution('DEBUG', 'profile id - ' + uname);
	nlapiLogExecution('DEBUG', 'key - ' + pwd);
	nlapiLogExecution('DEBUG', 'url - ' + url); 

	var creds = [uname,pwd];
	var connect = nlapiRequestURLWithCredentials(creds, url);
	var res = connect.body;

	nlapiLogExecution('DEBUG', 'response - ' , connect.body);
}
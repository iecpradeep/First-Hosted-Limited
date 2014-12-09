/*************************************************************************************
 * Name: 			callSuitelet.js
 * Script Type: 	Client
 * 
 * Version: 		1.0.1 – 16/11/2012 – 1st release - AM
 *
 * Author: 			FHL
 * Purpose: 		Calls a suitelet when relevant button is pressed
 * 
 * Script: 		 	customscript_callsuitelet
 * Deploy: 			customdeploy_callsuitelet
 * 
 *************************************************************************************/

/**
 * 
 * Calls the client script in a suitelet window 
 * 
 */
function callSuitelet()
{
	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	try
	{
		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();
		scriptNo = context.getSetting('SCRIPT', 'custscript_scriptid');
		deployNo = context.getSetting('SCRIPT', 'custscript_deployid');

		
		//create URL for suitelet using parameters
		//calls script voicenetTestharness.js
		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);
	}
	catch(e)
	{
		alert('callSuitelet' + e.message);
	}

	window.nlapiRequestURL(suiteletURL);
}

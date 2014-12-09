/*************************************************************************************
 * Name: Call Service Report Suitelets
 * Script Type: Client
 * Client: Mortara Dolby
 * 
 * Version: 1.0.0 - 2 May 2012 - 1st release - MJL
 *
 * Author: Matthew Lawrence, Mike Lewis, FHL
 * Purpose: Calls the create/amend Sales Order and print Service Report suitelets when
 * 			relevant button on case is pressed
 * 
 * Sales Order:
 * Client script: Call Sales Order Suitelet
 * Script ID: customscript_client_callsosuitelet
 * Deployment ID: customdeploy_client_callsosuitelet
 * 
 * Service Report:
 * Client script: Call Service Report Suitelet
 * Script ID: customscript_client_callsrsuitelet 
 * Deployment ID: customdeploy_client_callsrsuitelet
 *************************************************************************************/

/**
 * Calls the client script in a suitelet window 
 */
function callSOSuitelet()
{
	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	
	//pass through script ID and deploy ID as parameters
	context = nlapiGetContext();
	scriptNo = context.getSetting('SCRIPT', 'custscript_scriptid');
	deployNo = context.getSetting('SCRIPT', 'custscript_deployid');
	
	//create URL for suitelet using parameters
	//calls script soServiceReport.js
	suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);
	suiteletURL += '&custparam_caseid=' + nlapiGetRecordId();
	
	window.open(suiteletURL);	
}

/**
 * Gets the ScriptID from the script deployment
 * Gets the deploymentID from the script deployment
 * Builds the suitelet URL
 * Opens a new windows with the suitelet URL
 */
function callSRSuitelet()
{
	//automatically build the URL with the follow parameters
	var scriptID = nlapiGetContext().getSetting('SCRIPT', 'custscript_sr_scriptid');
	var deploymentID = nlapiGetContext().getSetting('SCRIPT', 'custscript_sr_deployid');

	//refer the the name of the suitlet and pass the value in as a parameter
	var suiteletURL = nlapiResolveURL('SUITELET', scriptID, deploymentID);
	
	//add the follow variables to pass
	suiteletURL += '&custparam_caseid=' + nlapiGetRecordId();
	//open the window with the URL and the parameters
	//calls script printServiceReport.js
	mywindow = window.open(suiteletURL, 'PDF printing');
}
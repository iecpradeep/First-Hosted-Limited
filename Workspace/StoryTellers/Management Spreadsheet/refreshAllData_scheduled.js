/********************************************************************
* Name: refreshAllData_scheduled.js
* Script Type: Scheduled
*
* Version: 1.0.0 - 15/11/2012 - 1st release - PAL
* 
* Author: First Hosted Limited
*
* Purpose: A scheduled script to delete all existing data, then schedule the 
* managementReport scheduled script immediately afterwards
*
* Script: The script record id - custscript_refreshalldata
* Deploy: The script deployment record id - customdeploy_refreshalldata
*
* Notes: This script is NOT linked to a form, and never will be
*
* Library: n/a
********************************************************************/

var inDebug = false;
var errorText = '';

var scriptUsageLimit = 40;

var managementDataRecordName = 'customrecord_budgets_and_actuals';

var managementDataScriptId = 66;
var managementDataScriptDeploymentId = 1;




/*******************************************************************
 * refreshAllData
 * 
 * Main entry point for the scheduled script
 * 
 * @returns {Boolean}
 * 
 *******************************************************************/
function refreshAllData()
{
	var retVal = true;
	try
	{
		//scheduleDelete();
		deleteAllRecords(managementDataRecordName);
		
		//schedule the managementReport
		scheduleScript('customscript_actuals_budget_calculation', 'customdeploy_mr_actuals_vs_budget_calc');
	}
	catch(err)
	{
		errHandler('refreshAllData', err);
	}
	return retVal;
}






/*******************************************************************
 * scheduleScript
 * 
 * Function to Schedule a Scheduled Script, based on the Script ID and the Script Deployment ID
 * 
 * @param {integer} scriptDeployment - The Internal ID of the Script Deployment
 * 
 * @param {integer} scriptId - The Internal ID of the Script
 * 
 * @returns {string} retVal - Description of what happened
 * 
 *******************************************************************/
function scheduleScript(scriptId,scriptDeployment)
{
	var retVal = '';
	var scheduleReturn = '';
	
	try
	{
		//Run some code here
		if(String(scriptDeployment) == '')
		{
			retVal = 'No Script Deployment Parameter passed through';
		}
		
		if(String(scriptId) == '')
		{
			retVal = 'No Script ID Parameter passed through';
		}
		
		scheduleReturn = nlapiScheduleScript(scriptId, scriptDeployment);
		retVal = scheduleReturn;
		
		nlapiLogExecution('AUDIT', 'Rescheduling Script', scheduleReturn);
		
	}
	catch(err)
	{
		//Handle errors here
		errorText = "There was an error on this page.\n\n";
		errorText+= "Error description: " + err.message + "\n\n";
		errorText+="Click OK to continue.\n\n";
		nlapiLogExecution('ERROR', '', errorText);
	}
	return retVal;
}







/*******************************************************************
 * deleteAllRecords
 * 
 * @param {String} recordType - Internal Record Name of the Record Type
 * 
 * @returns {Boolean} - Whether the function was successful
 * 
 *******************************************************************/
function deleteAllRecords(recordType)
{
	var deleteSearchResults = '';
	var context = '';
	

	try
	{
		while (deleteSearchResults != null) 
		{
			deleteSearchResults = nlapiSearchRecord(recordType, null, null, null);
			if(deleteSearchResults !=null)
			{
				nlapiLogExecution('AUDIT', 'Delete All Records', 'Attempting to delete ' + deleteSearchResults.length + ' records...');
				for (var i = 0; i < deleteSearchResults.length; i++)
				{
					context = nlapiGetContext();
					if(context.getRemainingUsage() <= scriptUsageLimit)
					{
						//reschedule this script.
						nlapiLogExecution('AUDIT', 'Delete All Record Rescheduling', 'Units left: ' + context.getRemainingUsage());
						nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
						return true;
					}
					else 
					{
						nlapiDeleteRecord(recordType, deleteSearchResults[i].getId());
					}
				}
			}
		}
		
		nlapiLogExecution('AUDIT', 'Delete All Records', 'All records of type ' + recordType + ' have been deleted.');
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'deleteAllRecords', e.message);
	}
	return true;
}



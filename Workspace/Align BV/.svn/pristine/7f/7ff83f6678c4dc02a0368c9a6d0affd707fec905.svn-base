

//[todo] the item has to have a price - error trapping should 'trap' this and report
//[todo] static group do not currently work - possibly down to extra item '97673' in dev being added to the group for static groups see saved 
//			search 'customsearch_campaigngroupsearch'


/*************************************************************************************
 * Name:		Create Campaign Staging Records (createCampaignStagingRecords.js)
 * Script Type:	Scheduled Script
 * Client:		Align BV
 *
 * Version:		1.0.0 - 18 Mar 2013 - first release - PAL
 * 				1.0.1 - 28 May 2013 - corrected field ID for getting campaign region - MJL
 * 				1.0.2 - 30 May 2013 - added queueForVATEngine function - MJL (removed as of 1.0.3)
 *				1.0.3 - 05 Jun 2013 - pull through campaign start date for sales orders - MJL
 *
 * Author:		First Hosted Limited
 * 
 * Purpose:		Iterates through all of the Customers within the specified CRM Group 
 * 				and creates a Campaign Staging Record if one does not already exist
 * 
 * Script: 		customscript_createcampaignstagingrecs
 * Deploy: 		customdeploy_createcampaignstagingrecs
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

var recordType = '';

var campaignId = -1;
var campaignRecord = null;
var campaignRecordId = -1;
var campaignStagingRecordId = -1;
var campaignStagingRecord = null;
var campaignGroupId = -1;
var campaignRegion = '';
var campaignStartDate = ''; //1.0.3 MJL

var groupSavedSearchId = '';
var groupRecordType = 'customer';

var customerResults = new Array();
var stagingResults = new Array();

var customerArrayLength = 0;
var stagingArrayLength = 0;

var stagingRecord = null;
var stagingRecordId = null;

var stagingRecordSalesOrderFieldName = 'custrecord_fhle_salesorder';
var stagingRecordCustomerFieldName = 'custrecord_fhle_customer';
var stagingRecordSubsidiaryFieldName = 'custrecord_fhle_subsidiary';
var stagingRecordCampaignFieldName = 'custrecord_fhle_campaign';
var stagingRecordCampaignItemsFieldName = 'custrecord_fhle_campaignitems';
var stagingRecordRegionFieldName = 'custrecord_eventregion';
var stagingRecordStartDateFieldName = 'custrecord_fhle_campaignstartdate'; //1.0.3 MJL


var campaignRecordItemsFieldName = 'item';
var campaignRegionFieldName = 'custevent_eventlocation';
var campaignStartDateFieldName = '';
var campaignRecordItems = new Array();

var scriptUsageLimit = 0;



/*******************************************************************
 * stagingRecordEntry - Main entry point for the Scheduled Script
 * 
 * 
 *******************************************************************/
function stagingRecordEntry()
{
	initialiseValues();
	getAllCustomers();	
	getAllStagingRecords();		
	clearDownCustomerArray();		
	createStagingRecords();
}

/*******************************************************************
 * initialiseValues - intialise the values needed throughout this Scheduled Script
 * 
 * 1.0.1 corrected field ID for getting campaign region - MJL
 * 1.0.3 pull through campaign start date for sales orders - MJL
 *******************************************************************/
function initialiseValues()
{
	//values initialised
	try
	{
		//getting the execution context object
		contextObject = nlapiGetContext();

		//Get the CampaignID passed through as a script parameter
		campaignId = contextObject.getSetting('SCRIPT', 'custscript_campaignid');

		logEvent('Campaign Details', campaignId);

		campaignStartDateFieldName = 'startdate';
		campaignRecordItemsFieldName = 'item';
		campaignRecordType = 'campaign';
		campaignRecordId = campaignId;

		campaignRecord = nlapiLoadRecord(campaignRecordType, campaignRecordId);

		campaignGroupId = campaignRecord.getLineItemValue('campaignemail', 'campaigngroup', 1);
		campaignRecordItems = campaignRecord.getFieldValues(campaignRecordItemsFieldName);
		campaignStartDate = campaignRecord.getFieldValue(campaignStartDateFieldName); //1.0.3 MJL
		campaignRegion = campaignRecord.getFieldValue(campaignRegionFieldName); //1.0.1 MJL
		
		scriptUsageLimit = 40;		// min usage limit allowed before re-schedule


	}
	catch(e)
	{
		errHandler('initialiseValues', e);
	}
}


/******************************************************************
 * getStagingRecordId - Searches the Staging Records to see if the Staging Record already exists.
 * If it exists, the InternalId is returned. If it doesn't exist, a -1 is returned
 * 
 * @param customerId
 * @param campaignId
 * 
 * @returns {Number}
 * 
 ******************************************************************/
function getStagingRecordId(customerId, campaignId)
{
	var recordId = -1;

	try
	{
		
		logEvent('getStagingRecordId', 'In Function');
		
	
	}
	catch(e)
	{
		errHandler('getStagingRecordId', e);
	}

	return recordId;
}



/******************************************************************
 * 
 * getAllCustomers - Gets all the Customers from the Group specified in the first line
 * 
 * 
 ******************************************************************/
function getAllCustomers()
{
	var searchFilter = null;
	var search = null;
	var resultSet = null;
	var cols = null;
	var colsString = '';


	try
	{
		//search for all customers within the Group specified on the first line of the Campaign Record Events Sublist.
		searchFilter = new nlobjSearchFilter('internalid',null,  'anyof', campaignGroupId);
		search = nlapiLoadSearch(null, 'customsearch_campaigngroupsearch');
		search.addFilter(searchFilter);

		resultSet = search.runSearch();
		resultSet.forEachResult(function(searchResult)
		{
			cols = searchResult.getAllColumns();
			colsString = '';

			cols.forEach(function(c)
			{
				colsString += c.getName() + ', ';
				if(c.getLabel() == 'groupmemberinternalid')	//We had to rename the label on the Saved Search as there were 2 Internal ID's
				{
					customerInternalID = searchResult.getValue(c.getName());
					logEvent('Customer Member InternalID', customerInternalID);
					customerResults.push(customerInternalID);	//Add to the Customer Array
				}
			});

			return true;                // return true to keep iterating
		});		
	}
	catch(e)
	{
		errHandler('getAllCustomers', e);
	}
}

/********************************************************************
 * 
 * getAllStagingRecords - Gets all the Staging Records for the current Marketing Campaign
 * 
 * 
 ********************************************************************/
function getAllStagingRecords()
{
	var searchFilter = null;
	var search = null;
	var resultSet = null;

	try
	{
		searchFilter = new nlobjSearchFilter('custrecord_fhle_campaign',null,  'anyof', campaignId);
		search = nlapiLoadSearch(null, 'customsearch_eventsstagingsearch');
		search.addFilter(searchFilter);

		resultSet = search.runSearch();
		resultSet.forEachResult(function(searchResult)
		{
			stagingResults.push(searchResult.getValue('custrecord_fhle_customer'));

			var cols = searchResult.getAllColumns();
			var colsString = '';

			cols.forEach(function(c)
			{
				colsString += c.getLabel() + ', ';
			});
			logEvent('customer colsString?', colsString);   // process the search result

			//logEvent('customer Internal ID?', searchResult.getValue('groupmemberinternalid'));   // process the search result

			return true;                // return true to keep iterating
		});		
	}
	catch(e)
	{
		errHandler('getAllStagingRecords', e);
	}
}


/*******************************************************************
 * clearDownCustomerArray - Compares the Customer Array and the Staging Record Array
 * and removes all Customers which appear in the Staging Records Array
 * 
 * 
 *******************************************************************/
function clearDownCustomerArray()
{
	var removedCustomers = 0;
	try
	{
		customerArrayLength = customerResults.length;
		stagingArrayLength = stagingResults.length;
		
		for(var c = 0; c < customerArrayLength; c++)
		{
			if(stagingResults.indexOf(customerResults[c]) != -1)
			{
				customerResults[c] = 'x';			
				removedCustomers++;
			}
		}
		
		if(removedCustomers == customerArrayLength)
		{
			//All customers have been removed!?
			logEvent('clearDownCustomerArray', 'RC and CAL match: Removed Customers: ' + removedCustomers + ', customerArrayLength: ' + customerArrayLength);
		}
		else
		{
			logEvent('clearDownCustomerArray', 'RC and CAL DO NOT MATCH: Removed Customers: ' + removedCustomers + ', customerArrayLength: ' + customerArrayLength);
		}		
	}
	catch(e)
	{
		errHandler('clearDownCustomerArray', e);
	}
}


/*******************************************************************
 * 
 * createStagingRecords - Main function to create the Staging Records which will trigger the User Events
 * 
 * @returns {Boolean}
 * 
 * 1.0.3 pull through campaign start date for sales orders - MJL
 * 
 *******************************************************************/
function createStagingRecords()
{
	var executionContext = null;
	var retVal = false;
	
	try
	{
		for(var c = 0; c < customerArrayLength; c++)
		{
			if(customerResults[c] != 'x')
			{
				stagingRecord = nlapiCreateRecord('customrecord_fhlevents');
				stagingRecord.setFieldValue(stagingRecordCampaignFieldName, campaignId);
				stagingRecord.setFieldValue(stagingRecordStartDateFieldName, campaignStartDate); //1.0.3 MJL
				stagingRecord.setFieldValue(stagingRecordRegionFieldName, campaignRegion);
				stagingRecord.setFieldValue(stagingRecordCustomerFieldName, customerResults[c]);

				campaignRecordItems = campaignRecord.getFieldValues(campaignRecordItemsFieldName);
				
				stagingRecord.setFieldValues(stagingRecordCampaignItemsFieldName, campaignRecordItems);
				
				stagingRecordId = nlapiSubmitRecord(stagingRecord);
				logEvent('createStagingRecords', 'Record Created. ID: ' + stagingRecordId);

				executionContext = nlapiGetContext();
				
				if(executionContext.getRemainingUsage() <= scriptUsageLimit)
				{
					//reschedule this script as the remaining usage is less than the usage limit
					nlapiLogExecution('AUDIT', 'Rescheduling createStagingRecords', 'Units left: ' + context.getRemainingUsage());
					nlapiScheduleScript(executionContext.getScriptId(), executionContext.getDeploymentId());
					retVal = true;
				}
			}
		}
	}
	catch(e)
	{
		errHandler('createStagingRecords', e);
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
function scheduleScript(scriptId, scriptDeploymentId)
{
	var retVal = '';

	try
	{
		//Run some code here
		if(String(scriptDeploymentId) == '')
		{
			retVal = 'No Script Deployment Parameter passed through';
		}

		if(String(scriptId) == '')
		{
			retVal = 'No Script ID Parameter passed through';
		}

		retVal = nlapiScheduleScript(scriptId, scriptDeploymentId);

		nlapiLogExecution('AUDIT', 'Rescheduling Script', retVal);

	}
	catch(e)
	{
		//Handle errors here

		errHandler('scheduleScript', e);
	}
	return retVal;
}


/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName - The Function/Subroutine of where the error was caused
 * @param errorObject - The Javascript Error Object, e.g. e
 * 
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}




/**********************************************************************
 * logEvent - Logs a DEBUG event using the nlapiLogExecution() function
 * 
 * @param logTitle - The title of the Log Execution Debug Message
 * @param logDetails - The detailed information you wish to log
 * 
 /**********************************************************************/
function logEvent(logTitle, logDetails)
{
	try
	{
		nlapiLogExecution('DEBUG', logTitle, logDetails);
	}
	catch(e)
	{
		errHandler('Log Event Error', e);
	}
}
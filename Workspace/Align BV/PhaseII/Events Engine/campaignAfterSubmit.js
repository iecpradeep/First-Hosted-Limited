/*************************************************************************************
 * Name:		Schedule Event Staging Record Creation (campaignAfterSubmit.js)
 * Script Type:	User Event
 * Client:		Align BV
 *
 * Version:		1.0.0 - 18 Mar 2013 - first release - PAL
 * 				1.0.1 - 28 May 2013 - prevent running on delete of campaign record - MJL
 * 				1.0.2 - 05 Jun 2013 - pull through campaign start date for sales orders - MJL
 *
 * Author:		First Hosted Limited
 * 
 * Purpose:		calls the scheduled script which creates the staging records
 * 
 * Script: 		customscript_campaignstagingcreation
 * Deploy: 		customdeploy_campaignstagingcreation
 * 
 * Notes:		passes a parameter which is the campaign ID to the scheduled script
 * 
 * Library: 	Library.js
 *************************************************************************************/


var campaignRecord = null;
var campaignRecordType = '';
var campaignRecordID = 0;
var campaignStartDate = 0;
var campaignCreateSalesOrders = false;
var campaignSalesOrderCreateFieldName = '';
var scriptId  = 0;
var deployId = 0;
var paramObj = null;



/*************************************************************************
 * 
 * campaignAfterSubmit - Main entry point for the User Event
 * 
 * 1.0.1 prevent running on delete of campaign record - MJL
 * 
 *************************************************************************/
function campaignAfterSubmit(type)
{
	if (type != 'delete') //1.0.1 prevent running on delete of campaign record - MJL
	{
		initialise();
		loadCampaignRecord();
		if(createStagingRequired() == true)
		{
			scheduleStagingScript();
		}
	}
	return true;
}


/*************************************************************************
 * 
 * initialise 
 * 
 *************************************************************************/
function initialise()
{
	try
	{
		// setup internal ID's for scheduled script
		scriptId  = 211;
		deployId = 1;
	}
	catch(e)
	{
		errHandler('initialise', e);
	}
}


/*************************************************************************
 * 
 * loadCampaignRecord - initialise all of the required objects for this User Event 
 * 
 *************************************************************************/
function loadCampaignRecord()
{
	try
	{
		campaignRecordID = nlapiGetRecordId();
		campaignRecordType = nlapiGetRecordType();
		campaignRecord = nlapiLoadRecord(campaignRecordType, campaignRecordID);
		campaignSalesOrderCreateFieldName = 'custevent_createsalesorders';
	}
	catch(e)
	{
		errHandler('loadCampaignRecord', e);
	}
}

/*************************************************************************
 * 
 * createStagingRequired - call this function to check to see whether the 
 * 
 * @returns {Boolean}
 * 
 *************************************************************************/
function createStagingRequired()
{
	var stagingRequired = false;
	var createSalesOrderFieldValue = 'F';

	try
	{
		createSalesOrderFieldValue = campaignRecord.getFieldValue(campaignSalesOrderCreateFieldName);
		campaignStartDate = campaignRecord.getFieldValue('startdate');

		if(createSalesOrderFieldValue == 'T' && String(campaignStartDate).length > 0)
		{
			stagingRequired = true;
		}
		else
		{
			stagingRequired = false;
		}
	}
	catch(e)
	{
		errHandler('createStagingRequired', e);
	}

	return stagingRequired;
}


/*************************************************************************
 * 
 * scheduleStagingScript - Schedules the Staging Record Creation Script
 * 
 * note: passes a parameter which is the campaign ID to the scheduled script
 * 
 *************************************************************************/
function scheduleStagingScript()
{
	try
	{
		paramObj = new Array();
		paramObj['custscript_campaignid'] = campaignRecordID;
		paramObj['custscript_campaignstartdate'] = campaignStartDate;
		nlapiScheduleScript(scriptId, deployId, paramObj);
	}
	catch(e)
	{
		errHandler('scheduleStagingScript', e);
	}
}


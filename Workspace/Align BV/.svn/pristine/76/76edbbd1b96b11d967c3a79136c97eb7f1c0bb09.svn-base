/****************************************************************************************************************************
 * Name:		Event Engine Create Sales Order (createSalesOrders.js)
 * Script Type:	User Event Script
 * Client:		Align BV
 *
 * Version:		1.0.0 - 15 Mar 2013 - first release - PAL
 * 				1.0.1 - 15 May 2013 - Introduce ship to region - JM
 * 				1.0.2 - 28 May 2013 - added checking of flag to engage VAT/Price/Discount engine - MJL (removed as of 1.0.3)
 * 				1.0.3 - 30 May 2013 - removed checking of VAT engine flag in favour of scheduled script - MJL (removed as of 1.0.4)
 * 				1.0.4 - 04 Jun 2013 - reinstated checking of flag to engage VAT/Price/Discount engine - MJL
 *				1.0.5 - 05 Jun 2013 - set campaign date to the trandate on the Sales Order - MJL
 *
 * Author:		First Hosted Limited
 * 
 * Purpose:		'After Submit User Event' to trigger the automatic creation of the sales order
 * 
 * Script: 		customscript_eventsstaginguserevent
 * Deploy: 		customdeploy_eventsstagingaftersubmit
 * 
 * Notes:		failure to create sales order will write back failure reason to staging
 * 				ensure items all have prices
 * 
 * Library: 	Library.js
 ****************************************************************************************************************************/

var stagingSalesOrderId = 0;
var stagingRecord = null;
var stagingRecordId = 0;
var stagingRecordType = '';
var stagingSubsidiaryId = 0;
var stagingCustomerId = 0;
var stagingItemsCount = 0;
var stagingRegion = 0;
var stagingDate = ''; //1.0.5 MJL

var stagingRecordSalesOrderFieldName = '';
var stagingRecordCustomerFieldName = '';
var stagingRecordSubsidiaryFieldName = '';
var stagingRecordCampaignFieldName = '';
var stagingRecordCampaignItemsFieldName = '';
var stagingRecordRegionFieldName = '';
var stagingRecordStartDateFieldName = ''; //1.0.5 MJL

var customerReceivablesAccountID = 0;

var stagingItems = new Array();
var salesOrderRecordID = 0;
var salesOrderRecord = null;

var inDebug = false;

var status = 'Failed';
var statusDesc = '';

/*******************************************************************
 * stagingRecordSubmitted
 * 
 * Main entry point for the After Submit User Event for the Staging Record Type
 * 
 *******************************************************************/

function stagingRecordSubmitted(type)
{
	if(type!='delete')
	{
		initialiseStaging();

		if(doesSalesOrderExist() == false)
		{
			createSalesOrder();
			updateStageRecordStatus();
		}
		else
		{
			nlapiLogExecution('AUDIT', 'stagingRecordSubmitted', 'Sales Order already exists. No need to create a new one.');
		}
	}
}



/*******************************************************************
 * initialiseStaging
 * 
 * Sets the variables needed to progress through the code
 * 
 * 1.0.5 add handling for campaign date - MJL
 * 
 *******************************************************************/
function initialiseStaging()
{
	try
	{
		stagingRecordId = nlapiGetRecordId();
		stagingRecordType = nlapiGetRecordType();

		stagingRecordSalesOrderFieldName = 'custrecord_fhle_salesorder';
		stagingRecordCustomerFieldName = 'custrecord_fhle_customer';
		stagingRecordSubsidiaryFieldName = 'custrecord_fhle_subsidiary';
		stagingRecordCampaignFieldName = 'custrecord_fhle_campaign';
		stagingRecordCampaignItemsFieldName = 'custrecord_fhle_campaignitems';
		stagingRecordRegionFieldName = 'custrecord_eventregion';
		stagingRecordStartDateFieldName = 'custrecord_fhle_campaignstartdate'; //1.0.5 MJL

		stagingRecord = nlapiLoadRecord(stagingRecordType, stagingRecordId);
		stagingCustomerId = stagingRecord.getFieldValue(stagingRecordCustomerFieldName);
		stagingSubsidiaryId = stagingRecord.getFieldValue(stagingRecordSubsidiaryFieldName);
		stagingRegion = stagingRecord.getFieldValue(stagingRecordRegionFieldName);
		stagingDate = stagingRecord.getFieldValue(stagingRecordStartDateFieldName); //1.0.5 MJL

	}
	catch(e)
	{
		errorHandler('initialiseStaging', e);
	}
}

/*******************************************************************
 * doesSalesOrderExist
 * 
 * Checks to see if the current Staging Record has a Sales Order linked to the Record
 * 
 * @returns {Boolean}
 * 
 *******************************************************************/
function doesSalesOrderExist()
{
	var retVal = false;

	try
	{	
		stagingSalesOrderId = stagingRecord.getFieldValue(stagingRecordSalesOrderFieldName);
		//stagingSalesOrderId = String(stagingSalesOrderId);
		//nlapiLogExecution('DEBUG', 'stagingSalesOrderId', 'Check Sales Order ID: ' + stagingSalesOrderId);

		if(stagingSalesOrderId  == null)
		{
			//no sales order assigned...
			retVal = false;
		}
		else
		{
			//the field is not blank, no need to run anymore
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('doesSalesOrderExist', e);
	}
	return retVal;

}


/*******************************************************************
 * createSalesOrder
 * 
 * Creates the Sales Order for the current Customer, with the selected Items
 * 
 * 1.0.3 removed checking of flag to engage VAT engine - MJL
 * 1.0.4 reinstated checking of flag to engage VAT engine - MJL
 * 1.0.5 set campaign date to the trandate on the Sales Order - MJL
 *******************************************************************/
function createSalesOrder()
{
	try
	{
		//get the customer receivables account ID
		customerReceivablesAccountID = getCustomerReceivablesAccount(stagingCustomerId);

		//get all the Items selected in the staging record
		getItemsFromStagingRecord();

		//create a new Sales Order record
		salesOrderRecord = nlapiCreateRecord('salesorder');

		//set the Date, Customer and Subsidiary fields
		salesOrderRecord.setFieldValue('trandate', stagingDate); //1.0.5 MJL
		salesOrderRecord.setFieldValue('entity', stagingCustomerId);
		salesOrderRecord.setFieldValue('subsidiary', stagingSubsidiaryId);
		salesOrderRecord.setFieldValue('custbody_alignbv_shipping_region', stagingRegion);
		
		//1.0.4 check VAT override flag to engage VAT engine - MJL
		salesOrderRecord.setFieldValue('custbody_vat_pricedisc_override', 'T');
		
		salesOrderRecord.setFieldValue('memo', 'Event Engine Generated'); 

		//for each Item in the Item array
		for(var i = 1; i <= stagingItemsCount; i++)
		{
			//select a new line item
			salesOrderRecord.selectNewLineItem('item');
			salesOrderRecord.setCurrentLineItemValue('item', 'item', stagingItems[i - 1]);
			salesOrderRecord.commitLineItem('item');
		}
		salesOrderRecordID = nlapiSubmitRecord(salesOrderRecord, true, true);
		nlapiLogExecution('AUDIT', 'createSalesOrder', 'Created Sales Order Record ID: ' + salesOrderRecordID);
		status = 'Successful';
	}
	catch(e)
	{
		statusDesc = 'Failed: '+e.message;
		errorHandler('createSalesOrder', e);
	}
}

/*******************************************************************
 * getCustomerReceivablesAccount
 * 
 * Gets the Customer's Accounts Receivable Account ID
 * 
 * @param customerId {number} - the Internal ID of the Customer who's AR account you wish to get
 * @returns {number} - the Internal ID of the AR Account of the respective Customer
 * 
 *******************************************************************/
function getCustomerReceivablesAccount(customerId)
{
	var accountId = 0;

	try
	{
		nlapiLogExecution('DEBUG', 'getCustomerReceivablesAccount', 'Entered Function');
		//add the customer receivable account function here	##############################################################################
		nlapiLogExecution('DEBUG', 'getCustomerReceivablesAccount', 'Exited Function');
	}
	catch(e)
	{
		errorHandler('getCustomerReceivablesAccount', e);
	}

	return accountId;
}


/*******************************************************************
 * getItemsFromStagingRecord
 * 
 * Gets the array of Items selected in the Staging Record
 * 
 *******************************************************************/
function getItemsFromStagingRecord()
{
	try
	{
		stagingItems = stagingRecord.getFieldValues(stagingRecordCampaignItemsFieldName);
		stagingItemsCount = stagingItems.length;
	}
	catch(e)
	{
		errorHandler('getItemsFromStagingRecord', e);
	}
}

/*******************************************************************
 * update stage status
 * 
 * 
 * 
 *******************************************************************/

function updateStageRecordStatus()
{

	try
	{
		stagingRecord.setFieldValue(stagingRecordSalesOrderFieldName, salesOrderRecordID);
		stagingRecord.setFieldValue('custrecord_eventsstatus', status);
		stagingRecord.setFieldValue('custrecord_statusdesc', statusDesc);
		nlapiSubmitRecord(stagingRecord, true, true);

	}
	catch(e)
	{
		errorHandler('getItemsFromStagingRecord', e);
	}
}


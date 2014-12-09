/*************************************************************************************
 * Name:		Check VAT Flags (checkVATFlag.js)
 * Script Type:	Scheduled
 *
 * Version:		1.0.0 - 30/05/2013 - 1st release - MJL
 *
 * Author:		FHL
 * 
 * Purpose:		Sweeps selected Sales Order records and checks flag to enable VAT engine
 * 
 * Script: 		customscript_checkvatflags
 * Deploy: 		customdeploy_checkvatflags
 * 				
 * Notes:		
 * 
 * Library: 	library.js
 *************************************************************************************/

var context = null;
var campaignId = '';

var orderIds = new Array();

/**
 * Main function called from script deployment 
 */
function checkVATFlag()
{
	initialise();
	getOrders();
	checkFlag();
}

function initialise()
{
	try
	{
		//getting the execution context object
		context = nlapiGetContext();

		//Get the CampaignID passed through as a script parameter
		campaignId = context.getSetting('SCRIPT', 'custscript_campaignintid');
		nlapiLogExecution('DEBUG', 'campaignid', campaignId);
	}
	catch (e)
	{
		errorHandler('initialise', e);
	}

}

/**
 * Get internal IDs for sales orders held in staging area
 */
function getOrders()
{
	var recCampaign = null;
	var stagingCount = 0;
	
	try
	{
		//Load campaign record
		recCampaign = nlapiLoadRecord('campaign', campaignId);

		//Get number of staging records
		stagingCount = recCampaign.getLineItemCount('recmachcustrecord_fhle_campaign');
		nlapiLogExecution('AUDIT', 'Number of staging records', stagingCount);

		for (var i = 0; i < stagingCount; i++)
		{
			//Store sales order IDs in array
			orderIds[i] = recCampaign.getLineItemValue('recmachcustrecord_fhle_campaign', 'custrecord_fhle_salesorder', (i + 1));
		}
	}
	catch (e)
	{
		errorHandler('getOrders', e);
	}
}

/**
 * Loop through all sales orders and mark for entry into VAT engine
 */
function checkFlag()
{
	var recOrder = null;
	var soRefNo = 0;
	var isChecked = '';
	
	try 
	{
		for (var i = 0; i < orderIds.length; i++)
		{
			//Load sales order
			recOrder = nlapiLoadRecord('salesorder', orderIds[i]);
			soRefNo = recOrder.getFieldValue('tranid');
			
			//Check whether the order has been queued already
			isChecked = recOrder.getFieldValue('custbody_vat_pricedisc_override');
			
			if (isChecked == 'F')
			{
				//Set flag to true if not already; this will trigger the VAT engine
				recOrder.setFieldValue('custbody_vat_pricedisc_override', 'T');
				nlapiSubmitRecord(recOrder);
				
				nlapiLogExecution('AUDIT', 'Sales Order queued', soRefNo);
			}
			else
			{
				nlapiLogExecution('AUDIT', 'Sales Order already queued', soRefNo);
			}
		}
	}
	catch (e)
	{
		errorHandler('checkFlag', e);
	}
}
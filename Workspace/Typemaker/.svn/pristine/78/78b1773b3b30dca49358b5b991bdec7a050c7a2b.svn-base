/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.0.0       21 Jun 2013     Peter Lewis, First Hosted Limited
 * 1.1.0	  1 Jul 2013	Peter Lewis, First Hosted Limited. Added InventoryDetail Subrecord handling.
 *
 */

//Declare all variables to be used throughout this script here. 
//This ensures they're available throughout all functions.

var recordId = 0;
var recordType = '';
var record = null;
var eventType = '';
var deliveringCountry = null;
var zoneId = null;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 */
function userEventAfterSubmit(type)
{

	try
	{
		logData('userEventAfterSubmit', 'triggered');
		initialise(type);

		switch (String(eventType))
		{		
		case 'create':			
		case 'edit':
			logData('usereventTriggered', 'Edit triggered');
		case 'xedit':
			logData('usereventTriggered', eventType);
			getZonename();
			getInventoryDetail();

			nlapiSubmitRecord(record);
			break;
		default:
			//default triggered
			logData('default Triggered', 'eventType: "' + eventType + '"');
		}

	}
	catch(e)
	{
		errHandler('userEventAfterSubmit',e);
	}
}


function initialise(type)
{
	try
	{

		recordId = nlapiGetRecordId();
		recordType = nlapiGetRecordType();
		eventType = type;
	}
	catch(e)
	{
		errHandler('initialise',e);
	}
}

function getZonename()
{
	try
	{

		record = nlapiLoadRecord(recordType, recordId);
		deliveringCountry = record.getFieldValue('shipcountry');

		logData('getZonename', deliveringCountry);

		if(deliveringCountry != ((null)||('')))
		{
			getZoneFromCountry();
			if(zoneId != ((null)||('')))
			{
				record.setFieldValue('custbody_zone', zoneId);
			}
		}
	}
	catch(e)
	{
		errHandler('getZonename',e);
	}
}

function getZoneFromCountry()
{

	// Arrays
	var SearchFilters = new Array();
	var SearchColumns = new Array();
	var itemSearchResults = null;
	var itemSearchResult = null;

	try
	{
		//search filters                  
		SearchFilters[0] = new nlobjSearchFilter('custrecord_zone_lookup_country', null, 'is',deliveringCountry);                          


		// return columns
		SearchColumns[0] = new nlobjSearchColumn('custrecord_zone_lookup_zone');

		// perform search
		itemSearchResults = nlapiSearchRecord('customrecord_zone_lookup', null, SearchFilters, SearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];
				zoneId = itemSearchResult.getValue('custrecord_zone_lookup_zone');
			}
		}
	}
	catch(e)
	{
		errHandler('getZoneFromCountry',e);
	}
}



//1.1.0 PAL.
/************************************************************************************
 * getInventoryDetail
 * 
 * Gets the inventory detail and copies to the Serial Number column for printing
 * 
 ************************************************************************************/
function getInventoryDetail()
{

	var invDetailSubrecord = null;
	var details = '';
	var lineItemQuantity = 0;
	var subRecordInternalId = 0;
	var serialNumber = '';

	try
	{
		//get line item count
		lineItemCount = record.getLineItemCount('item');

		for(var i = 1; i <= lineItemCount; i++)
		{
			lineItemQuantity = nlapiGetLineItemValue('item', 'quantity', i);
			lineItemQuantity = parseInt(lineItemQuantity);

			record.selectLineItem('item', i);

			//check to see if there is any inventory detail subrecord associated...
			invDetailSubrecord = record.viewCurrentLineItemSubrecord('item','inventorydetail');

			details = '';

			if(invDetailSubrecord != null)	//This means there is an Inventory Detail subrecord
			{
				for(var invCount = 1; invCount <= lineItemQuantity; invCount++)
				{
					invDetailSubrecord.selectLineItem('inventoryassignment', invCount);
					subRecordInternalId = invDetailSubrecord.getCurrentLineItemValue('inventoryassignment', 'issueinventorynumber');
					serialNumber = nlapiLookupField('inventorynumber', subRecordInternalId,'inventorynumber');

					if(invCount == 1)
					{
						details = serialNumber;
					}
					else
					{
						details = details + ', ' + serialNumber;
					}
				}
			}
			else
			{
				details = '';
			}

			logData('getInventoryDetail', 'line: ' + i + '. Details: ' + details);
			record.setCurrentLineItemValue('item','custcol_seriallotnumbers', details);
			record.commitLineItem('item');
		}
	}
	catch(e)
	{
		errHandler('getInventoryDetail', e);	
	}

}
/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		//alert('Error:\n' + sourceFunctionName + '\n\n' + e.message);
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}


/**********************************************************************
 * logData - Used when debugging
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function logData(source, data)
{
	//alert(source + '\n\n' + data);
	nlapiLogExecution('DEBUG', source, data);

}


/**********************************************************************
 * auditData - Used when deployed for auditing purposes
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function auditData(source, data)
{
	nlapiLogExecution('AUDIT', source, data);
}
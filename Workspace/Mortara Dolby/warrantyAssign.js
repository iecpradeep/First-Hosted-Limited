/*************************************************************************************************
 * Name:		Assign Warranty Records (warrantyCreate.js)
 * Script Type:	User Event
 * Client:      Mortara Dolby
 *
 * Version:		1.0.0 - 19 Dec 2012 - first release - MJL
 *
 * Author:		FHL
 * Purpose:		To assign warranty records to each item when an Item Fulfilment record is created
 * 
 * Script: 		customscript_warrantyassign
 * Deploy: 		customdeploy_warrantyassign
 * 
 * Notes:		Assign warranty routine complete and tested
 *              
 * Issues:      
 * 
 * Library:     Libary.js
 *************************************************************************************************/

var context = null;
var warrantyActive = 0;
var warrantyFailed = 0;

var itemFulfilmentID = 0;
var trnType = '';
var itemFulfilmentRecord = null;

var salesOrderID = 0;
var salesOrderDate = '';
var customer = 0;
var orderType = 0;
var itemFulfilmentDate = '';
var warrantyEndDate = '';
var itemLineCount = 0;

var itemObj = new Object();
var itemsArray = new Array();

var serialNumbers = new Array();

var currentDetailID = 0;

var warrantyItems = [];
var warrantyDetails = [];

var serials = '';
var serialArray = null;

/**
 * Main control block, called from script deployment
 */
function warrantyAssign(type)
{
    //if (type == 'create' || type == 'edit')
    if (type == 'create')
    {
        //Get parameters
        initialise();
        
        //Get info from fulfilment record
        getFulfilment();
        
        //Get serial number records for each item
        for (var i = 0; i < itemsArray.length; i++)
        {
            itemsArray[i] = itemObj;
            getSerials();
            
            //Get warranty item records for each serial number
            for (var j = 0; j < serialArray.length; j++)
            {
                warrantyItems[j] = genericSearch('customrecord_warrantyitem', 'custrecord_warranty_serial_item', serialArray[j]);
            }
            
            //Get warranty detail records for each warranty item
            for (var k = 0; k < warrantyItems.length; k++)
            {
                //warrantyDetails[k] = genericSearch('customrecord_warrantyitem', 'custrecord_warrantyrecord', warrantyItems[k]);
                warrantyDetails[k] = nlapiLookupField('customrecord_warrantyitem', warrantyItems[k], 'custrecord_warrantyrecord');
            }
            
            //Update warranty detail records with fulfilment information
            updateWarrantyDetails();
            
            //Set assign status on Item Fulfilment to Assigned
            //nlapiSubmitField('itemfulfillment', itemFulfilmentID, 'custbody_warranty_status', warrantyActive);
            itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyActive);
        }
    }
}

/**
 * Get parameters from script deployment
 */
function initialise()
{
	try
	{
	    context = nlapiGetContext();
	    warrantyActive = context.getSetting('SCRIPT', 'custscript_warrantyactive');
	    warrantyFailed = context.getSetting('SCRIPT', 'custscript_warrantyfailed');
	}
	catch(e)
	{
		//errorHandler('initialise', e);
	    nlapiLogExecution('ERROR', 'initialise() failure', e.message);
	}
}

/**
 * Get fulfilment record information
 */
function getFulfilment()
{
    var tempItemID = 0;
    var isWarrantyOffered = '';
    
	try
	{	 
	    //Load fulfilment record
	    itemFulfilmentID = nlapiGetRecordId();
        trnType = nlapiGetRecordType();
        itemFulfilmentRecord = nlapiLoadRecord(trnType, itemFulfilmentID);
        
        //Get fulfilment header info
        salesOrderID = itemFulfilmentRecord.getFieldValue('createdfrom');
        //orderType = nlapiLookupField('salesorder', salesOrderID, 'custbody_ordetype');
        itemFulfilmentDate = itemFulfilmentRecord.getFieldValue('trandate');       
        
        //Get number of items on fulfilment
        itemLineCount = itemFulfilmentRecord.getLineItemCount('item');
        
        for (var i = 1; i <= itemLineCount; i++)
        {
            //Select line item
            itemFulfilmentRecord.selectLineItem('item', i);
            
            //Check if warranty is offered on this item
            tempItemID = itemFulfilmentRecord.getCurrentLineItemValue('item', 'item');
            isWarrantyOffered = nlapiLookupField('inventoryitem', tempItemID, 'custitem_warrantyoffered');
                
            if (isWarrantyOffered == 'T')
            {   
                //Headers
                customer = itemFulfilmentRecord.getFieldValue('entity');
                
                //Details
                itemObj.itemID = tempItemID;
                itemObj.quantity = itemFulfilmentRecord.getCurrentLineItemValue('item', 'quantity');
                itemObj.serialNumbers = itemFulfilmentRecord.getCurrentLineItemValue('item', 'serialnumbers');
                itemObj.isWarrantyOffered = isWarrantyOffered;
                itemObj.customerWarrPeriod = nlapiLookupField('inventoryitem', itemObj.itemID, 'custitem_customerwarranty');
                
                nlapiLogExecution('DEBUG', 'Customer', customer);
                nlapiLogExecution('DEBUG', 'Customer', itemObj.itemID);
                nlapiLogExecution('DEBUG', 'Quantity', itemObj.quantity);
                nlapiLogExecution('DEBUG', 'Serial/Lot Nos', itemObj.serialNumbers);
                nlapiLogExecution('DEBUG', 'Is Warranty Offered', itemObj.isWarrantyOffered);
                nlapiLogExecution('DEBUG', 'Customer Warranty Period', itemObj.customerWarrPeriod);
                
                //Add to item array
                itemsArray[i-1] = itemObj;
            }
        }
        nlapiLogExecution('DEBUG', 'Remaining script usage after getFulfilment()', context.getRemainingUsage());
	}
	catch(e)
	{
		//errorHandler('getFulfilment', e);
	    nlapiLogExecution('ERROR', 'getFulfilment() failure', e.message);
	    itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyFailed);
	}
}

/**
 * Get Warranty Serial Number records
 */
function getSerials()
{  
    try
    {  
        //Remove line breaks and carriage returns
        serials = itemObj.serialNumbers;
        serialArray = serials.split(/[\n\r]/g);
    }
    catch(e)
    {
        //errorHandler('createWarrantySerials', e);
        nlapiLogExecution('ERROR', 'getSerials() failure', e.message);
        itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyFailed);
    }
}

/**
 * Update Warranty Detail with fulfilment info
 */
function updateWarrantyDetails()
{
    var warrantyDetailRecord = null;
    var warrantyDetailID = 0;
    
	try
	{
	    for(var i = 0; i < warrantyDetails.length; i++)
        {
	        //Load detail record
	        warrantyDetailRecord = nlapiLoadRecord('customrecord_warrantydetails', warrantyDetails[i]);
	       
	        nlapiLogExecution('DEBUG', 'Customer Warranty Period', itemObj.customerWarrPeriod);
	        
	        //Update warranty with customer and SO info
	        warrantyDetailRecord.setFieldValue('custrecord_customer', customer);
	        warrantyDetailRecord.setFieldValue('custrecord_salesorderlink', salesOrderID);
	        warrantyDetailRecord.setFieldValue('custrecord_salesorderdate', itemFulfilmentDate);
	        warrantyDetailRecord.setFieldValue('custrecord_customerwarrantyperiod', itemObj.customerWarrPeriod);
	        
	        //Get warranty end date
	        warrantyEndDate = getWarrantyEndDate();
	        warrantyDetailRecord.setFieldValue('custrecord_custwarrantyenddate', warrantyEndDate);
            
	        //Submit record
            warrantyDetailID = nlapiSubmitRecord(warrantyDetailRecord);
            nlapiLogExecution('AUDIT', 'Warranty detail record for item ' + itemObj.itemID +' altered', warrantyDetailID);
            nlapiLogExecution('DEBUG', 'Remaining script usage after createWarrantyDetail()', context.getRemainingUsage());
        }
	}
	catch(e)
	{
		//errorHandler('createWarrantyDetail', e);
	    nlapiLogExecution('ERROR', 'updateWarrantyDetails() failure', e.message);
	    itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyFailed);
	}
}

/**
 * Calculate end date for manufacturer's warranty
 */
function getWarrantyEndDate()
{
    var dateObj = null;
    var newDateObj = null;
    var newDate = '';
    
    try
    {
        dateObj = nlapiStringToDate(itemFulfilmentDate);
        newDateObj = nlapiAddMonths(dateObj, itemObj.customerWarrPeriod);
        newDate = nlapiDateToString(newDateObj);
    }
    catch (e)
    {
        //errorHandler('getWarrantyEndDate', e);
        nlapiLogExecution('ERROR', 'getWarrantyEndDate() failure', e.message);
        itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyFailed);
    }
    return newDate;
}

/**
 * generic search - returns internal ID
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
    var internalID = 'not found';

    // Arrays
    var invoiceSearchFilters = new Array();
    var invoiceSearchColumns = new Array();

    try
    {
        //search filters                  
        invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
        // return columns
        invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

        // perform search
        var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

        if(itemSearchResults!=null)
        {
            if(itemSearchResults.length>0)
            {
                var itemSearchResult = itemSearchResults[ 0 ];
                internalID = itemSearchResult.getValue('internalid');
            }
        }
    }
    catch(e)
    {
        //errorHandler('genericSearch', e);
        nlapiLogExecution('ERROR', 'genericSearch() failure', e.message);
        itemFulfilmentRecord.setFieldValue('custbody_warranty_status', warrantyFailed);
    }             
    return internalID;
}
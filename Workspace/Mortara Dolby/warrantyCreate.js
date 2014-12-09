/*************************************************************************************************
 * Name:        Create Warranty Records (warrantyCreate.js)
 * Script Type: User Event
 * Client:      Mortara Dolby
 *
 * Version:     1.0.0 - 19 Dec 2012 - first release - MJL
 *
 * Author:      FHL
 * Purpose:     To create warranty records to each item when an Item Receipt record is created
 * 
 * Script:      customscript_warrantycreate
 * Deploy:      customdeploy_warrantycreate
 * 
 * Notes:       Complete and tested in demo system, ready for deployment
 *                 
 *              [TODO - maybe] if adv inv bin tracking turned on, the serial number/lot field is 
 *              sub'd into a inventory detail sub record - call a routine (suggest 
 *              getSerialFromInvDetail) to populate itemObj.serialNumbers
 *               
 * Library:     Libary.js
 *************************************************************************************************/

var context = null;
var pendingAssign = 1;
var warrantyActive = 1;

var itemReceiptID = 0;
var trnType = '';
var itemReceiptRecord = null;

var purchaseOrderID = 0;
var orderType = 0;
var itemReceiptDate = '';
var warrantyEndDate = '';
var itemLineCount = 0;

var itemObj = new Object();
var itemsArray = new Array();

var serialNumberArray = new Array();

var currentDetailID = 0;

/**
 * Main control block, called from script deployment
 */
function warrantyCreate(type)
{
    //if (type == 'create' || type == 'edit')
    if (type == 'create')
    {
        //get parameters
        initialise();
        
        //Get information from item receipt
        getReceipt();
        
        //create warranty records
        createWarrantyRecords();
        
        //Set assign status on Item Receipt to Pending
        nlapiSubmitField('itemreceipt', itemReceiptID, 'custbody_warranty_status', pendingAssign);
   }
}


/**
 * initialise
 */
function initialise()
{
    try
    {
        context = nlapiGetContext();
        pendingAssign = context.getSetting('SCRIPT', '');
    }
    catch(e)
    {
        errorHandler('initialise', e);
    }
}

/**
 * get receipt
 */
function getReceipt()
{
    var tempItemID = 0;
    var isWarrantyOffered = '';
    
    try
    {   
        //Get item receipt record
        itemReceiptID = nlapiGetRecordId();
        trnType = nlapiGetRecordType();
        itemReceiptRecord = nlapiLoadRecord(trnType, itemReceiptID);
        
        //Get information from receipt header
        purchaseOrderID = itemReceiptRecord.getFieldValue('createdfrom');
        itemReceiptDate = itemReceiptRecord.getFieldValue('trandate');       
        
        //Get info from receipt lines
        itemLineCount = itemReceiptRecord.getLineItemCount('item');
        
        for (var i = 1; i <= itemLineCount; i++)
        {
            itemReceiptRecord.selectLineItem('item', i);
            
            //Only get items that only have Warranty Offered flag checked
            tempItemID = itemReceiptRecord.getCurrentLineItemValue('item', 'item');
            isWarrantyOffered = nlapiLookupField('inventoryitem', tempItemID, 'custitem_warrantyoffered');
                
            if (isWarrantyOffered == 'T')
            {
                //Transfer info into object and then into array
                itemObj.itemID = tempItemID;
                itemObj.quantity = itemReceiptRecord.getCurrentLineItemValue('item', 'quantity');
                itemObj.isLotItem = nlapiLookupField('inventoryitem', itemObj.itemID, 'islotitem');
                itemObj.isSerialItem = nlapiLookupField('inventoryitem', itemObj.itemID, 'isserialitem');
                
                //[TODO - maybe] if adv inv bin tracking turned on, the serial number/lot field is sub'd into a inventory detail sub record
                // call a routine (suggest getSerialFromInvDetail!!) to populate itemObj.serialNumbers
                
                getSerialFromInvDetail();
                
                itemObj.serialNumbers = itemReceiptRecord.getCurrentLineItemValue('item', 'serialnumbers');
                itemObj.isWarrantyOffered = isWarrantyOffered;
                itemObj.supplierWarrPeriod = nlapiLookupField('inventoryitem', itemObj.itemID, 'custitem_supplierwarranty');
                itemsArray[i-1] = itemObj;
            }
            else
            {
                nlapiLogExecution('ERROR', 'Warranty not offered', 'Item ' + tempItemID + ' on Purchase Order ' + purchaseOrderID);
            }
        }
        nlapiLogExecution('DEBUG', 'Remaining script usage after getReceipt()', context.getRemainingUsage());
    }
    catch(e)
    {
        //errorHandler('getReceipt', e);
        nlapiLogExecution('ERROR', 'getReceipt failure', e.message);
    }
}

/**
 * create Warranty Records
 */
function createWarrantyRecords()
{
    try
    {
        //For each item, create warranty records
        for (var i = 0; i < itemsArray.length; i++)
        {   
            itemObj = itemsArray[i];

            if (itemObj.isLotItem == 'T' || itemObj.isSerialItem == 'T')
            {
                //create serial number records
                createWarrantySerials();
            }
            else
            {
               itemObj.serialNoIds = 'N/A';
            }
            
            if (itemObj.serialNoIds != 'N/A')
            {
                //Get count of serial numbers
                serialNumberArray = itemObj.serialNoIds;

                //For every serial number, create a warr. item and detail record
                for (var j = 0; j < serialNumberArray.length; j++)
                {
                    itemObj.currentDetailID = createWarrantyDetail(j);
                    createWarrantyItems(j);
                }
            }
            else
            {
                itemObj.currentDetailID = createWarrantyDetail(j);
                createWarrantyItems(j);
            }
            nlapiLogExecution('DEBUG', '***FINAL*** Remaining script usage', context.getRemainingUsage());
        }
    }
    catch(e)
    {
        //errorHandler('createWarrantyRecords', e);
        nlapiLogExecution('ERROR', 'createWarrantyRecords failure', e.message);
    }
}

/**
 * create records for Warranty Serial Numbers
 * 
 * [HACK]: need to streamline the routine
 */
function createWarrantySerials()
{
    var serials = '';
    var serialArray = null;
    
    var warrSerialNoRecord = null;
    var tempID = 0;
    var warrSerialNoIDs = new Array();
    var lotQuantity = 0;
    
    try
    {   
        //Split Serial Number field output into individual elements
        serials = itemObj.serialNumbers;
        serialArray = serials.split(/[\n\r]/g);
        
        if (serials.length > 0)
        {   
            //If item is lot numbered...
            if (itemObj.isLotItem == 'T' && itemObj.isSerialItem == 'F')
            {
                //For each serial number, create a new record
                for (var i = 0; i < serialArray.length; i++)
                {
                    //lotQuantity = getQuantity(serialArray[i]);
                    lotQuantity = itemObj.quantity; //Massive [HACK]
                    
                    for (var j = 1; j <= lotQuantity; j++)
                    {
                        warrSerialNoRecord = nlapiCreateRecord('customrecord_serialnumbers');
                        warrSerialNoRecord.setFieldValue('name', 'LOT:' + serialArray[i] + '-item-' + j);
                        warrSerialNoRecord.setFieldValue('custrecord_sn_lot_number', serialArray[i]);
                        tempID = nlapiSubmitRecord(warrSerialNoRecord); 
                        warrSerialNoIDs.push(tempID);
                    }
                }
            }
            else if (itemObj.isLotItem == 'F' && itemObj.isSerialItem == 'T') //If not...
            {
                //For quantity ordered, create a new record
                for (var i = 1; i <= itemObj.quantity; i++)
                {
                    warrSerialNoRecord = nlapiCreateRecord('customrecord_serialnumbers');
                    warrSerialNoRecord.setFieldValue('name', serialArray[i-1]);
                    warrSerialNoRecord.setFieldValue('custrecord_sn_lot_number', serialArray[i-1]);
                    tempID = nlapiSubmitRecord(warrSerialNoRecord); 
                    warrSerialNoIDs.push(tempID);
                }
            }
            //Add to item object
            itemObj.serialNoIds = warrSerialNoIDs;
        }
        else
        {
            //Add to item object
            itemObj.serialNoIds = 'N/A'; 
        }
        nlapiLogExecution('DEBUG', 'Remaining script usage after createWarrantySerials()', context.getRemainingUsage());
    }
    catch(e)
    {
        //errorHandler('createWarrantySerials', e);
        nlapiLogExecution('ERROR', 'createWarrantySerials failure', e.message);
    }
}

/**
 * Get quantity from lot number string
 */
function getQuantity(lotNo)
{
    var quantity = 0;
    
    quantity = lotNo.substr((lotNo.length - 2), 1);
    
    return quantity;
}

/**
 * create Warranty detail record
 */
function createWarrantyDetail(j)
{
    var newWarrantyRecord = null;
    var serialName = '';
    var itemName = '';
    var newWarrantyDetailID = 0;
    
    try
    {      
        //Create warranty detail record and populate
        newWarrantyRecord = nlapiCreateRecord('customrecord_warrantydetails');
        newWarrantyRecord.setFieldValue('custrecord_wrrantystatus', warrantyActive);
        
        //If item is lot or serial numbered...
        if(itemObj.isLotItem == 'T' || itemObj.isSerialItem == 'T')
        {
            //Construct the record name from the item and serial number
            serialName = nlapiLookupField('customrecord_serialnumbers', serialNumberArray[j], 'custrecord_sn_lot_number');
            newWarrantyRecord.setFieldValue('name', serialName + ':' + itemObj.itemID);
            newWarrantyRecord.setFieldValue('custrecord_warrantyserialnumber', serialNumberArray[j]);
        }
        else //If not...
        {
            //Set the record name to the item name
            itemName = nlapiLookupField('item', itemObj.itemID, 'itemid');
            newWarrantyRecord.setFieldValue('name', itemName);
        }
                
        newWarrantyRecord.setFieldValue('custrecord_purchaseorder', purchaseOrderID);
        newWarrantyRecord.setFieldValue('custrecord_purchaseorderdate', itemReceiptDate);
        newWarrantyRecord.setFieldValue('custrecord_supplierwarrantyperiod', itemObj.supplierWarrPeriod);
        
        //Calculate and set the end date of the warranty
        warrantyEndDate = getWarrantyEndDate(); //Manufacturer warranty
        newWarrantyRecord.setFieldValue('custrecord_warrantyenddate', warrantyEndDate); //Manufacturer warranty end date
        
        //Submit record
        newWarrantyDetailID = nlapiSubmitRecord(newWarrantyRecord);
        nlapiLogExecution('AUDIT', 'New warranty detail record for item ' + itemObj.itemID +' created', newWarrantyDetailID);
        nlapiLogExecution('DEBUG', 'Remaining script usage after createWarrantyDetail()', context.getRemainingUsage());
    }
    catch(e)
    {
        //errorHandler('createWarrantyDetail', e);
        nlapiLogExecution('ERROR', 'createWarrantyDetail failure', e.message);
    }
    return newWarrantyDetailID;
}

/**
 * create Warranty items
 */
function createWarrantyItems(j)
{
    var newWarrantyItem = null;
    var newWarrantyItemID = 0;
    
    try
    {
        //Create new warranty item record
        newWarrantyItem = nlapiCreateRecord('customrecord_warrantyitem');
        newWarrantyItem.setFieldValue('custrecord_warrantyitem', itemObj.itemID);
        
        //If serials present...
        if (itemObj.serialNoIds != 'N/A')
        {
            newWarrantyItem.setFieldValue('custrecord_warranty_serial_item', serialNumberArray[j]);
        }
        else
        {
            newWarrantyItem.setFieldValue('custrecord_warranty_serial_item', '');  
        }
        
        newWarrantyItem.setFieldValue('custrecord_warrantyrecord', itemObj.currentDetailID);
        newWarrantyItem.setFieldValue('custrecord_itemactive', 'T');
        
        //Submit new record
        newWarrantyItemID = nlapiSubmitRecord(newWarrantyItem);
        nlapiLogExecution('AUDIT', 'New warranty item record for item ' + itemObj.itemID + ' created', newWarrantyItemID);
        nlapiLogExecution('DEBUG', 'Remaining script usage after createWarrantyItems()', context.getRemainingUsage());
    }
    catch(e)
    {
        //errorHandler('createWarrantyItems', e);
        nlapiLogExecution('ERROR', 'createWarrantyItems failure', e.message);
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
    
    //Convert to date object and add warranty period in months
    dateObj = nlapiStringToDate(itemReceiptDate);
    newDateObj = nlapiAddMonths(dateObj, itemObj.supplierWarrPeriod);
    newDate = nlapiDateToString(newDateObj);

    return newDate;
}
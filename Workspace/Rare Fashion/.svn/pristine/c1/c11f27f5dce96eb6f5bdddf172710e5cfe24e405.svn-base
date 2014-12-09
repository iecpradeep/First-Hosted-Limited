/*************************************************************************
 * Name: 	stockTake.js
 * Script: 	User Event
 * Client: 	Rare
 * 
 * Version: 1.0.0 - 10 Dec 2012 - 1st release - JM
 *
 * Author: 	FHL
 * Purpose: User event based on the _stocktake custom record set to update 
 * 			stock item/bin/location record
 *
 * Script:	customscript_stocktake  
 * Deploy:	customdeploy_stocktake  
 * 
 * Notes: 	saved search 'customsearch_restquery_stockitemexist' is used
 * 
 * Library:	library.js
 * **************************************************************************/

var currentStock = 0;

var locationIntID = 0;
var itemIntID = 0;
var binIntID = 0;

var locationCode = '';
var itemCode = '';
var binCode = '';

var adjustmentAmt = 0;
var stockTakeAmount = 0;
var accountIntID = 0;
var recordID = 0;
var stockTakeRecord = null;

var accountName = '';
var savedSearch = '';
var searchResults = null;

var processingDesc = '';

/******************************************************************
 * stock take - main 
 ******************************************************************/

function stockTake()
{

	initialise();
	readParameters();
	loadStockTakeRecord();
	setStockLevelAtBinLocation();
	updateStockTakeRecordStatus();

}

/**
 * initialise
 */

function initialise()
{

	
	//accountName = 'Stock';
	accountName = 'Inventory Surplus';
	savedSearch = "customsearch_restquery_stockitemexist";
	
}


/**
 * read Parameters
 */

function readParameters()
{


}

/**
 * load stock take record
 */

function loadStockTakeRecord()
{

	try
	{
		recordID = nlapiGetRecordId();
		stockTakeRecord = nlapiLoadRecord('customrecord_stocktake', recordID);
	}
	catch(e)
	{
		errorHandler('loadStockTakeRecord', e);
	}

}

/**
 * determine the current stock level and create an adjustment for the difference
 */

function setStockLevelAtBinLocation()
{

	try
	{
		lookupIntIDsForBinItemLocation();
		getCurrentStockLevels();
		createAdjustmentForTheDiffererence();
	}
	catch(e)
	{
		errorHandler('setStockLevelAtBinLocation', e);
	}

}

/**
 * lookup the internal ID's for item/bin/location and account
 */

function lookupIntIDsForBinItemLocation()
{

	try
	{
		// extract code from the stock take record
		locationCode = stockTakeRecord.getFieldValue('custrecord_location');
		itemCode = stockTakeRecord.getFieldValue('custrecord_stockitemcode');
		binCode = stockTakeRecord.getFieldValue('custrecord_binnumber');
				
		// get the internal ID's
		itemIntID = genericSearch('item','itemid',itemCode);
		locationIntID = genericSearchOperator('location', 'name', locationCode, 'contains'); 
		binIntID = genericSearch('bin','binnumber',binCode);
		
		accountIntID = genericSearch('account','name',accountName);
		
	}
	catch(e)
	{
		errorHandler('lookupIntIDsForBinItemLocation', e);
	}

}

/**
 * get the current stock level for item/bin/location
 */

function getCurrentStockLevels()
{

	var criteria = new Array();
	var searchResult = null;
	
	try
	{
		
		currentStock = 0;
		
		criteria = [[ 'binnumber', 'is', binCode ] ,'and',['internalid', 'is', itemIntID]];
		
		// saved search customsearch_restquery_stockitemexist
		
		if(runSavedSearchXMLWithCriteria(0,1000,true, savedSearch, 'item', criteria)==true)
		{
			searchResult = searchResults[ 0 ];		
			currentStock = searchResult.getValue('binonhandavail'); //[TODO] this always comes out as zero - MJL
		}
		
	}
	catch(e)
	{
		errorHandler('getCurrentStockLevels', e);
	}
	
}

/**
 * create a stock adjustment for the difference between current and new
 */

function createAdjustmentForTheDiffererence()
{

	try
	{
		
		stockTakeAmount = stockTakeRecord.getFieldValue('custrecord_quantityinbin');
		
		nlapiLogExecution('DEBUG', 'Current Stock Level', currentStock);
		
		//[TODO] Because currentStock is 0, adjustmentAmt will equal stockTakeAmount - MJL
		adjustmentAmt = stockTakeAmount - currentStock;
		
		adjustInventoryBin();
		
	}
	catch(e)
	{
		errorHandler('createAdjustmentForTheDiffererence', e);
	}

}


/**
 * adjust inventory by bin
 */
function adjustInventoryBin()
{

	var invAdj = null;
	var subRecord = null;

	//	inventory adjustment

	try
	{

		processingDesc = 'Failed';
		invAdj = nlapiCreateRecord('inventoryadjustment', {recordmode : 'dynamic'});

		invAdj.setFieldValue('account', accountIntID);
		invAdj.selectNewLineItem('inventory');
		invAdj.setCurrentLineItemValue('inventory', 'item', itemIntID);
		invAdj.setCurrentLineItemValue('inventory', 'location', locationIntID);
		invAdj.setCurrentLineItemValue('inventory', 'adjustqtyby', adjustmentAmt);

		//	inventory detail sub of adjustment record

		subRecord = invAdj.createCurrentLineItemSubrecord('inventory', 'inventorydetail');

		subRecord.selectNewLineItem('inventoryassignment');
		subRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', adjustmentAmt);
		subRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binIntID);

		subRecord.commitLineItem('inventoryassignment');

		subRecord.commit();
		invAdj.commitLineItem('inventory');
		nlapiSubmitRecord(invAdj);
		
		processingDesc = 'Success';

	}
	catch(e)
	{
		errorHandler('adjustInventoryBin', e);
	}

}

/**
 * update Stock Take Record Status
 */

function updateStockTakeRecordStatus()
{
	
	var stockUpdate=0;
	
	try
	{

		stockTakeRecord.setFieldValue('custrecord_processingstatus', processingDesc);
		
		stockUpdate = nlapiSubmitRecord(stockTakeRecord, true);

	}
	catch(e)
	{
		errorHandler(e);
	}             

	return stockUpdate;

}


//nlapiLogExecution('DEBUG', 'after location lookup', locationIntID);

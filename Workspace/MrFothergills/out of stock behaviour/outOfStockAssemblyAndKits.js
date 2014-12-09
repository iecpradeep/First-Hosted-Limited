/*************************************************************************************
 * Name:		outOfStockAssemblyAndKits.js
 * 
 * Script Type:	Scheduled Script
 *
 * Version:		1.0.1 - 1st release 25/6/2013 - JM
 * 				1.0.2 - Amended receipt date function to accurately fetch latest date. - JP, JA, SM
 *
 * Author:		FHL
 * 
 * Purpose:		Out of stock behaviour for kits and assemblies
 * 
 * Script: 		customscript_oosassemblykit
 * Deploy: 		customdeploy_oosassemblykit
 * 
 * Notes:		dependencies: 	saved search - 'customsearch_assemblykit'
 * 							 	saved search - 'customsearch_allassembliesandkits'
 *
 *								field - custitem_stockstatus	- list (Stock Status)
 *								field - custitem_receiptdate	- date
 *								field - custitem_applyoos 		- check box
 *			
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 				** customdeploy_oosinventoryitems ** MUST BE RUN 1ST
 * 
 * Library: 	library.js
 *************************************************************************************/

var context = null;
var statusInStock = '';
var statusUnderCommitted = '';
var statusOverCommitted = '';
var itemRecords = null;
var itemRecord = null;
var itemsSavedSearch = '';
var nextPoSavedSearch = '';
var poRecords = null;
var components = null;
var recipients = '';
var subject = '';
var body = '';

/**
 * 
 */
function outOfStockAssemblyAndKits()
{
	initialise();
	getAndProcessItems();
} 


/**
 * 
 * loop for item processing
 * 
 */
function getAndProcessItems()
{

	try
	{
		// run 10 times i.e. deal with 10000 items
		for(var i=0; i < 9000; i = i + 1000)
		{
			if(getItems(i,i+1000)==true)
//			if(getItems(0,20)==true)			// whilst debugging
			{
				processItems();
			}
		}
	}
	catch(e)
	{
		errorHandler("getAndProcessItems", e);	
	}
}


/**
 * 
 * initialise
 * 
 */

function initialise()
{

	try
	{
		statusInStock = '1';
		statusUnderCommitted = '2';
		statusOverCommitted = '3';
		individualKitOrAssemblySavedSearch = 'customsearch_assemblykit';
		allKitsOrAssemblysSavedSearch = 'customsearch_allassembliesandkits';
		
		
		//Get email addresses from parameters
		context = nlapiGetContext();
		recipients = context.getSetting('SCRIPT', 'custscript_oosass_recipients');
		subject = context.getSetting('SCRIPT', 'custscript_oosass_subjectline');
		body = context.getSetting('SCRIPT', 'custscript_oosass_recipients');	
	}
	catch(e)
	{
		errorHandler("initialise", e);	
	}
}

/**
 * 
 * get items - run saved search
 * 
 */
function getItems(from, to)
{

	var runSearch = null;
	var itemRecordSearch = null;
	var retVal = false;

	try
	{
		itemRecordSearch = nlapiLoadSearch('item',allKitsOrAssemblysSavedSearch);

		runSearch = itemRecordSearch.runSearch();

		//Getting the first 1000 results
		itemRecords = runSearch.getResults(from,to);

		if(itemRecords)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("getItems", e);	
	}

	return retVal;
}


/**
 * 
 * process items
 * 
 */
function processItems()
{
	try
	{
		for (var i=0; i < itemRecords.length; i++)
		{
			processIndividualKitOrAssembly(itemRecords[i]);
			dealWithGovernance();
		}
	}
	catch(e)
	{
		errorHandler("processItems", e);	
	}
}


/**
 * 
 * process individual kit or assembly
 * 
 */
//Disallow back orders but display out of stock messages
//Allow back orders but display out of stock messages
//Remove items when out of stock
//Allow back orders with no out of stock message
function processIndividualKitOrAssembly(searchResult)
{
	var saveRequired = false;
	var rectype = '';
	var itemId = '';
	var intID = 0;

	try
	{
		// load item record
		intID = searchResult.getId();
		rectype = searchResult.getRecordType();
		itemRecord = nlapiLoadRecord(rectype,intID);

		// get current kit/assembly item id
		itemId = itemRecord.getFieldValue('itemid');
		
		nlapiLogExecution('DEBUG', 'processIndividualItemRecord itemId:', itemId);

		// load the components for this assembly or kit
		if(getComponents(itemId)==true)
		{
			// check if any of the assembly or kit items matches the change criteria

			if(stepThroughComponents(rectype, intID,searchResult)==true)
			{
				submitID = nlapiSubmitRecord(itemRecord, true);
			}
		}
	}
	catch(e)
	{
		errorHandler("processIndividualKitOrAssembly", e);	
	}
} 


/**
 * 
 * step Through Components
 * 1.0.2 - Amended receipt date function to accurately fetch latest date.
 * 
 */
function stepThroughComponents(rectype,itemIntId, searchResult)
{
	var retVal = false;
	var stockStatusVal = null;
	var stockStatus = 0;
	var quantityAvailable = 0;
	var quantityOnOrder = 0;
	var quantityBackOrdered = 0;
	var safetyStockLevel = 0;
	var nextReceiptDate = null;
	var oldestReceiptDate = null;

	try
	{
		
		// 1.0.2 Added in to get Search results from Saved Search
		columns = searchResult.getAllColumns();
	
		quantityAvailable = FHLParseFloat(searchResult.getValue(columns[5]));	
		quantityBackOrdered = FHLParseFloat(searchResult.getValue(columns[6]));
		quantityOnOrder = FHLParseFloat(searchResult.getValue(columns[7]));
		safetyStockLevel = FHLParseFloat(searchResult.getValue(columns[8]));

		//nlapiLogExecution('DEBUG', 'processIndividualItemRecord quantityAvailable:', quantityAvailable);
		//nlapiLogExecution('DEBUG', 'processIndividualItemRecord quantityOnOrder:', quantityOnOrder);
		//nlapiLogExecution('DEBUG', 'processIndividualItemRecord quantityBackOrdered:', quantityBackOrdered);
		//nlapiLogExecution('DEBUG', 'processIndividualItemRecord safetyStockLevel:', safetyStockLevel);
		
		
		if ((quantityAvailable - quantityBackOrdered) > safetyStockLevel)
		{
			itemRecord.setFieldValue('custitem_stockstatus',statusInStock);
			itemRecord.setFieldValue('outofstockbehavior','Allow back orders with no out-of-stock message');
			itemRecord.setFieldValue('custitem_mrf_item_expecteddate',null);
			retVal=true;
		} 
		
		// check components for any in stock
		for (var i=0; i < components.length; i++)
		{
			stockStatus = components[i].getValue('custitem_stockstatus', 'memberitem');

			if(stockStatus == statusOverCommitted)
			{
				itemRecord.setFieldValue('custitem_stockstatus',statusOverCommitted);
				itemRecord.setFieldText('outofstockbehavior','Disallow back orders but display out-of-stock message');
				retVal=true;
				stockStatusVal = 'over';
				break;
			}
			else if(stockStatus == statusUnderCommitted)
			{
				if (stockStatusVal != 'over')
				{
					itemRecord.setFieldValue('custitem_stockstatus',statusUnderCommitted);
					itemRecord.setFieldValue('outofstockbehavior','Allow back orders but display out-of-stock message');
					retVal=true;
					stockStatusVal = 'under';
					break;
				}
			}
			else if(stockStatus == statusInStock)
			{
				if (stockStatusVal != 'over' && stockStatusVal != 'under')
				{
					itemRecord.setFieldValue('custitem_stockstatus',statusInStock);
					itemRecord.setFieldText('outofstockbehavior','Allow back orders with no out-of-stock message');
					retVal=true;
					stockStatusVal = 'in stock';
					break;
				}
			}	
		}
		
		if(retVal==true)
		{
			// get oldest receipt date
			for (var i=0; i < components.length; i++)
			{
				nextReceiptDate = components[i].getValue('custitem_mrf_item_expecteddate',  'memberitem');

				//nlapiLogExecution('DEBUG', 'stepThroughComponents nextReceiptDate', nextReceiptDate);
				
				//1.0.2 - Amended receipt date function to accurately fetch latest date.
				//added && nextReceiptDate statement and introduced brackets around or statement
				if((nextReceiptDate > oldestReceiptDate || !oldestReceiptDate) && nextReceiptDate)
				{
					oldestReceiptDate = nextReceiptDate;
				}
			}
			itemRecord.setFieldValue('custitem_mrf_item_expecteddate',oldestReceiptDate);
		}

	}
	catch(e)
	{
		errorHandler("stepThroughComponents", e);	
	}

	return retVal;
}



/**
 * 
 * send email
 * 
 */
function sendEmail(itemRecord)
{
	var itemCode = '';
	var itemDesc = '';
	var recipients = '';
	var subject = '';
	var body = '';

	try
	{
		//Get email addresses from parameters
		context = nlapiGetContext();
		recipients = context.getSetting('SCRIPT', 'custscript_oos_recipients');
		subject = context.getSetting('SCRIPT', 'custscript_oos_subjectline');
		body = context.getSetting('SCRIPT', 'custscript_oos_recipients');

		//Get item code and description from item record
		itemCode = itemRecord.getFieldValue('itemid');
		itemDesc = itemRecord.getFieldValue('displayname');

		//Append item code and description
		subject = subject + ' ' + itemDesc + ' (' + itemCode + ')';
		body = body + ' ' + itemDesc + ' (' + itemCode + ')';

		//Send email
		nlapiSendEmail(-5, recipients, subject, body);

	}
	catch(e)
	{
		errorHandler("sendEmail", e);	
	}
} 



/**
 * 
 * get components - run saved search
 * 
 */
function getComponents(itemId)
{
	var runSearch = null;
	var itemRecordSearch = null;
	var retVal = false;
	var criteria = '';

	try
	{
		
		itemId = itemId.toString();
		
		itemRecordSearch = nlapiLoadSearch('item',individualKitOrAssemblySavedSearch);
		criteria = [[ 'itemid', 'is', itemId]];
		
		itemRecordSearch.setFilterExpression(criteria);
		runSearch = itemRecordSearch.runSearch();
		
		//Getting the first 1000 results
		components = runSearch.getResults(0,1000);

		if(components)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("getComponents", e);	
	}

	return retVal;
}


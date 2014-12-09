/*************************************************************************************
 * Name:		outOfStockInventory
 * 
 * Script Type:	Scheduled Script
 *
 * Version:		1.0.1 - 1st release 10/5/2013 - JM
 * 				1.0.2 - 28/06/2013 Altered the process to get values from saved
 * 						columns instead of field values - AM
 * 				1.0.3 - 18/07/2013 Altered getReceiptDate function
 * 				2.0.1 - 24/07/2013 Heavy modifications to multiple functions to aid governance - JP.
 * 				2.0.2 - 25/07/2013 Ommited call to library function to reschedule script - JP.
 *
 * Author:		FHL
 * 
 * Purpose:		Out of stock for inventory items
 * 
 * Script: 		customscript_oosinventory  
 * Deploy: 		customdeploy_oosinventoryitems  
 * 
 * Notes:		dependencies: 	saved search - 'customsearch_oositems'
 *								saved search - 'customsearch_oosnextpo'	
 *								field - custitem_stockstatus	- list (Stock Status)
 *								field - custitem_receiptdate	- date
 *								field - custitem_applyoos 		- check box			
 * 				
 * 
 * Library: 	library.js
 *************************************************************************************/

var context = null;
var statusInStock = '';
var statusUnderCommitted = '';
var statusOverCommitted = '';
var itemRecords = null;
var itemsSavedSearch = '';
var nextPoSavedSearch = '';

function outOfStockInventory ()
{
	initialise ();
	getAndProcessItems ();
}

/**
 * initialise
 */
function initialise()
{
	try
	{
		statusInStock = '1';
		statusUnderCommitted = '2';
		statusOverCommitted = '3';
		itemsSavedSearch = 'customsearch_oositems';
		nextPoSavedSearch = 'customsearch_oosnextpo'; // called "OOS Next PO Date **Do Not Delete**"
	}
	catch ( e )
	{
		errorHandler ( "initialise", e );
	}
}

/**
 * calls the getItems function, then loops around the results, processing each item and checking the governance after such.
 */
function getAndProcessItems ()
{
	var context = null;
	
	try
	{
		context = nlapiGetContext();
		
		while (getItems () == true)
		{
			for ( var i = 0; i < itemRecords.length; i++ )
			{
				processIndividualItemRecord ( itemRecords [ i ] );

				if ( context.getRemainingUsage () < 100 )
				{
					nlapiLogExecution ( 'AUDIT', 'About to reschedule script', 'script id: ' + context.getScriptId () + ' deployment id: ' + context.getDeploymentId () );
					status = nlapiScheduleScript ( context.getScriptId (), context.getDeploymentId () );
					return;
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("getAndProcessItems", e);	
	}
}

/**
 * run saved search, add criteria to check for items NOT edited today and save in results.
 */
function getItems ()
{
	var runSearch = null;
	var itemRecordSearch = null;
	var criteria = null;
	var filters = null;
	var retVal = false;

	try
	{
		itemRecordSearch = nlapiLoadSearch ( 'item', itemsSavedSearch );

		criteria = [ [ 'lastmodifieddate', 'before', 'today' ] ];

		filters = itemRecordSearch.getFilters ();
		itemRecordSearch.setFilterExpression ( criteria );
		itemRecordSearch.addFilters ( filters );

		runSearch = itemRecordSearch.runSearch ();
		
		// Getting the 1000 results
		// 1000 results is max get.
		itemRecords = runSearch.getResults ( 0, 1000 );

		nlapiLogExecution ( 'DEBUG', 'getItems result first record id', 'record id: ' + itemRecords [ 0 ].getId ());
		//nlapiLogExecution ( 'DEBUG', 'getItems result last record id', 'record id: ' + itemRecords [ itemRecords.length ].getId () );

		if ( itemRecords )
		{
			retVal = true;
		}
	}
	catch ( e )
	{
		errorHandler ( "getItems", e );
	}

	return retVal;
}


/**
 * process individual item
 * 
 * 1.0.2 - Altered the process to get values from saved
 * 			columns instead of field values.
 */
//Disallow back orders but display out of stock messages
//Allow back orders but display out of stock messages
//Remove items when out of stock
//Allow back orders with no out of stock message
function processIndividualItemRecord ( searchResult )
{
	var itemId = 0;
	var itemRecord = null;
	var columns = null;
	var quantityAvailable = 0;
	var quantityBackOrdered = 0;
	var quantityOnOrder = 0;
	var safetyStockLevel = 0;
	var nextReceiptDate = null;
	var submitId = null;

	try
	{
		// load item record
		itemId = searchResult.getId ();

		itemRecord = nlapiLoadRecord ( 'inventoryitem', itemId );

		// 1.0.2 Added in to get Search results from Saved Search
		columns = searchResult.getAllColumns ();

		// 1.0.2 Altered to get values from the Saved Search columns
		quantityAvailable = FHLParseFloat ( searchResult.getValue ( columns [ 3 ] ) );
		quantityBackOrdered = FHLParseFloat ( searchResult.getValue ( columns [ 4 ] ) );
		quantityOnOrder = FHLParseFloat ( searchResult.getValue ( columns [ 5 ] ) );
		safetyStockLevel = FHLParseFloat ( searchResult.getValue ( columns [ 6 ] ) );

		if ( ( quantityAvailable - quantityBackOrdered ) > safetyStockLevel )
		{
			itemRecord.setFieldValue ( 'custitem_stockstatus', statusInStock );
			itemRecord.setFieldText ( 'outofstockbehavior', 'Allow back orders with no out-of-stock message' );
			itemRecord.setFieldValue ( 'custitem_mrf_item_expecteddate', null );
		}
		else
		{
			if ( ( quantityAvailable + quantityOnOrder - quantityBackOrdered ) > safetyStockLevel )
			{
				itemRecord.setFieldValue ( 'custitem_stockstatus', statusUnderCommitted );
				itemRecord.setFieldText ( 'outofstockbehavior', 'Allow back orders but display out-of-stock message' );
				nextReceiptDate = getReceiptDate ( itemId );
				itemRecord.setFieldValue ( 'custitem_mrf_item_expecteddate', nextReceiptDate );
			}
			else
			{
				itemRecord.setFieldValue ( 'custitem_stockstatus', statusOverCommitted );
				itemRecord.setFieldText ( 'outofstockbehavior', 'Disallow back orders but display out-of-stock message' );
				itemRecord.setFieldValue ( 'custitem_mrf_item_expecteddate', null );

				// send email - introduce a parameter on the script for 3 email addresses to send email to
				// sendEmail(itemRecord);
			}
		}

		submitId = nlapiSubmitRecord ( itemRecord, true );
		
		nlapiLogExecution ( 'DEBUG', 'current record processed id', 'id: ' + submitId);
		
	}
	catch ( e )
	{
		errorHandler ( "processIndividualItemRecord", e );
	}


} //function processRecord(itemId)


/**
 * get Receipt Date - runs a saved search to find
 * 1.0.3
 */
function getReceiptDate ( itemId )
{
	var loadSearch = null;
	var criteria = null;
	var filters = '';
	var runSearch = null;
	var searchLines = null;
	var recDate = null;

	// get soonest receive by/due date from PO for that item
	// -- customsearch_oosnextpo --
	// needs to be filtered by item and we need earliest date

	try
	{
		loadSearch = nlapiLoadSearch ( 'transaction', nextPoSavedSearch );

		// filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];

		criteria = [ [ 'item', 'is', itemId ] ];

		filters = loadSearch.getFilters ();
		loadSearch.setFilterExpression ( criteria );
		loadSearch.addFilters ( filters );

		// Running the loaded search
		runSearch = loadSearch.runSearch ();

		// Getting the first 10 results
		searchLines = runSearch.getResults ( 0, 10 );

		if ( searchLines )
		{
			searchResult = searchLines [ 0 ];
			recDate = searchResult.getValue ( 'duedate' );
		}
	}
	catch ( e )
	{
		errorHandler ( "getReceiptDate", e );
	}

	return recDate;
} 


/**
 * send email
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
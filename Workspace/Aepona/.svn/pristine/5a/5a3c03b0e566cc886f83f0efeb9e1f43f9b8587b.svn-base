/*************************************************************************************
 * Name:		Aepona Project Metrics script - projectmetrics_event.js
 * 
 * Script Type:	User Event
 *
 * Version:		1.0.0 1st release 5/6/2013 DB
 * 				1.0.1 amended 24/6/2013 - rev rec and rec rev calcs added

 * Author:		FHL
 * 
 * Purpose:		UE script to perform project time/cost/rev calculations
 * 				sums total hours and cost from timebill records and adds fields for both calculations
 * 				to the form
 * 
 * Script: 		customscript_projectmetrics  
 * Deploy: 		customdeploy_projectmetrics - applies to project record
 * 				
 * Notes:		the entity on a transaction created from a project is the project id	
 * 
 * Library: 	library.js
 *************************************************************************************/

var purchaseMetricsSavedSearch = '';
var expensesMetricsSavedSearch = '';
var projectRecord = null;
var recordType = '';
var currentRecordId = 0;


function beforeLoad(type)
{
	try
	{
		if (type == 'view')
		{
			initialise();
			loadCurrentRecord();
			calculateProjectCostAndHours();
			calculateProjectPurchaseMetrics();
			calculateProjectExpensesMetrics();
			calculateProjectRevRecMetrics();
			calculateProjectRecReversalMetrics();
			saveCurrentRecord();
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
}

/**
 *  initialise
 *
 */

function initialise()
{
	try
	{
		purchaseMetricsSavedSearch = 'customsearch_projmetrics_purchases';		
		expensesMetricsSavedSearch = 'customsearch_projmetrics_expenses';
		revenueCommittedSavedSearch = 'customsearch_projmetrics_revcom';
		revenueRecReversalSavedSearch = 'customsearch_projmetrics_recrev';
	}
	catch(e)
	{
		errorHandler(e);
	}
}

/**
 *  load current record details
 *
 */

function loadCurrentRecord()
{
	try
	{
		recordType = nlapiGetRecordType();
		currentRecordId = nlapiGetRecordId();
		projectRecord = nlapiLoadRecord(recordType, currentRecordId);
	}
	catch(e)
	{

		errorHandler(e);
	}
}

/**
 *  save current record
 *
 */

function saveCurrentRecord()
{
	var submitID = 0;

	try
	{
		submitID = nlapiSubmitRecord(projectRecord, true);
	}
	catch(e)
	{
		errorHandler(e);
	}
}


/**
 *  calculate Project Purchase Metrics
 *
 */

function calculateProjectPurchaseMetrics()
{
	var criteria = new Array();
	var total = 0;

	try
	{
		criteria=[[ 'entity', 'is', currentRecordId]];
		total = runSavedSearchAndTotalAColumn(purchaseMetricsSavedSearch, 'transaction', 'amount', criteria);

		projectRecord.setFieldValue('custentity_purchasestodate',total);
	}
	catch(e)
	{
		errorHandler(e);
	}
}

/**
 *  calculate Project Expense Metrics
 *
 */

function calculateProjectExpensesMetrics()
{
	var criteria = new Array();
	var total = 0;

	try
	{
		criteria=[[ 'entity', 'is', currentRecordId]];
		total = runSavedSearchAndTotalAColumn(expensesMetricsSavedSearch, 'transaction', 'amount', criteria);
		total = Math.abs(total);

		projectRecord.setFieldValue('custentity_expensestodate',total);
	}
	catch(e)
	{
		errorHandler(e);
	}
}


/**
 * calculate Project Cost And Hours 
 *
 */

function calculateProjectCostAndHours()
{
	var totalHours = 0.00;
	var totalCost = 0.00;	
	var filter = null;
	var hours = 0;
	var cost = 0;
	var searchResults = null;

	try
	{
		// perform a summary search for all time entries for this project
		filter = new nlobjSearchFilter('customer', null, 'is', currentRecordId);
		hours = new nlobjSearchColumn('durationdecimal', null, 'sum');
		cost = new nlobjSearchColumn('custcol_tt_cost', null, 'sum');

		searchResults = nlapiSearchRecord('timebill', null, filter, [hours, cost]);

		if (searchResults)
		{
			totalHours = searchResults[0].getValue('durationdecimal', null, 'sum');
			totalCost = searchResults[0].getValue('custcol_tt_cost', null, 'sum');		

			projectRecord.setFieldValue('custentity_totaltimecost',totalCost);
			projectRecord.setFieldValue('custentity_totaltimetracked',totalHours);
		}
	}
	catch(e)
	{
		errorHandler(e);
	}

	return true;
}


/**
 * calculate Project Rev Rec Metrics 
 *
 */

function calculateProjectRevRecMetrics()
{
	var criteria = new Array();
	var total = 0;

	try
	{
		criteria=[[ 'entity', 'is', currentRecordId]];
		total = runSavedSearchAndTotalAColumn(revenueCommittedSavedSearch, 'transaction', 'amountrecognized', criteria);
		total = Math.abs(total);

		projectRecord.setFieldValue('custentity_revrecognisedtodate',total);
	}
	catch(e)
	{
		errorHandler(e);
	}
}

/**
 * calculate Project Recognised revenue Reversal Metrics
 *
 */

function calculateProjectRecReversalMetrics()
{
	var criteria = new Array();
	var total = 0;

	try
	{
		criteria=[[ 'entity', 'is', currentRecordId]];
		total = runSavedSearchAndTotalAColumn(revenueRecReversalSavedSearch, 'transaction', 'amortizedamount', criteria, 'revRecSchedule');
		total = Math.abs(total);

		projectRecord.setFieldValue('custentity_revreversalstodate',total);
	}
	catch(e)
	{
		errorHandler(e);
	}
}

/**
 * run saved search and total a column 
 *
 */

function runSavedSearchAndTotalAColumn(savedSearch, savedSearchType, columnToTotal, filter, join)
{

	var loadSearch = null;
	var runSearch = null;
	var searchResults = null;
	var total = 0;
	var lineAmt = 0;
	var currentFilters = null;

	try
	{
		// Load the saved search
		// store the current filter
		// set the new filter and add in the old filter, preserving the original filter
		// run the search
		// extract results
		loadSearch = nlapiLoadSearch(savedSearchType, savedSearch);
		currentFilters = loadSearch.getFilters();
		if(currentFilters)
		{
			loadSearch.setFilterExpression(filter);
			loadSearch.addFilters(currentFilters);
		}
		else
		{
			loadSearch.setFilterExpression(filter);
		}

		runSearch = loadSearch.runSearch();
		searchResults = runSearch.getResults(0,1000);

		if(searchResults)
		{
			for(var i=0; i<searchResults.length; i++)
			{
				if(join)
				{
					lineAmt  = searchResults[i].getValue(columnToTotal, join, null);
				}
				else
				{
					lineAmt  = searchResults[i].getValue(columnToTotal);
				}
				lineAmt = parseFloat(lineAmt);
				total = total + lineAmt;
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
	}

	return total;
}






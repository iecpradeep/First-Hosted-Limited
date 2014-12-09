/**********************************************************************************************************
 * Name:        Get Pick, Pack & Ship Orders for Sublist (getPPSOrders.js)
 *
 * Script Type: Client
 * 
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 21 Jun 2013 - first release - MJL
 * 				1.0.1 - 16 Jul 2013 - bug fix - last order not displayed - MJL
 * 		 
 * Author:      FHL
 * 
 * Purpose:     Print packing slip for fulfilled orders
 * 
 * Script:     	customscript_pps_getorders
 * 
 * Notes:		
 * 				
 * Libraries:   library.js
 **********************************************************************************************************/

var location = 0;
var orderNo = 0;
var startBatchNo = 0;
var endBatchNo = 0;

var filters = new Array();
var columns = new Array();
var results = null;

var ppsArray = new Array();
var ppsObj = new Object();
var ppsCount = 0;

var ordersArray = new Array();
var ordersObj = new Object();
var ordersCount = 0;

/**
 * Main function called by form.setScript function
 */
function getPPSOrders()
{
	//Clear out arrays to allow for multiple executions
	clearArrays();
	
	if (getFilterInfo() == true)
	{
		//Search PPS records that match filter info 
		searchPPSRecords();
		getPPSInfoFromResults();
		
		//Sort results
		sortObjectArray();
		
		//Remove duplicates
		if (groupResultsByOrderNo() == true)
		{
			//Add to sublist
			populateSublist();
		}
	}
}

/**
 * Get filter info from suitelet form to perform search
 * 
 * @returns {Boolean}
 */
function getFilterInfo()
{
	var retVal = false;

	try
	{
		location = nlapiGetFieldValue('custpage_pps_location');
		orderNo = nlapiGetFieldValue('custpage_pps_orderno');
		startBatchNo = nlapiGetFieldValue('custpage_pps_startbatchno');
		endBatchNo = nlapiGetFieldValue('custpage_pps_endbatchno');

		//Define filters
		filters[0] = new nlobjSearchFilter('custrecord_pps_location', null, 'is', location);

		if (startBatchNo != '' || endBatchNo != '')
		{
			filters[1] = new nlobjSearchFilter('custrecord_batchnumber', null, 'between', startBatchNo, endBatchNo);
		}
		else
		{
			//[TODO] Be sure to comment this lines back in before deployment - MJL
			alert('You must enter both a Start Batch Number and an End Batch Number to continue.');
			retVal = false;
		}

		if (orderNo != '')
		{
			filters[2] = new nlobjSearchFilter('custrecord_pps_deliveryref', null, 'is', orderNo);
		}

		retVal = true;

	}
	catch (e)
	{
		alert('getFilterInfo error: ' + e.message);
	}
	return retVal;
}

/**
 * Search for PPS records that match criteria
 */
function searchPPSRecords()
{
	var search = null;
	var resultsSet = null;

	try
	{
		//Define columns
		columns[0] = new nlobjSearchColumn('custrecord_pps_item');
		columns[1] = new nlobjSearchColumn('custrecord_pps_process');
		columns[2] = new nlobjSearchColumn('custrecord_processingstatus');
		columns[3] = new nlobjSearchColumn('custrecord_pps_quantity');
		columns[4] = new nlobjSearchColumn('custrecord_customernumber');
		columns[5] = new nlobjSearchColumn('custrecord_pps_date');
		columns[6] = new nlobjSearchColumn('custrecord_pps_deliveryref');
		columns[7] = new nlobjSearchColumn('custrecord_batchnumber');

		//creating the saved search
		search = nlapiCreateSearch('customrecord_mrf_pickpackship', filters, columns);
		
		//Running search
		resultsSet = search.runSearch();

		//Get info from each search result
		results = resultsSet.getResults(0, 1000);
	}
	catch(e)
	{
		alert('searchPPSRecords error: ' + e.message);
	}
}

/**
 * Get PPS info from search results
 */
function getPPSInfoFromResults()
{
	var retVal = false;
	
	try
	{
		if (results != null)
		{
			for (var i = 0; i < results.length; i++)
			{	
				ppsObj = new Object();
				ppsObj.orderNo = results[i].getValue(columns[6]);
				ppsObj.orderDate = results[i].getValue(columns[5]);
				ppsObj.batchNo = results[i].getValue(columns[7]);
				ppsObj.customerID = results[i].getValue(columns[4]);

				ppsArray[ppsCount] = ppsObj;
				ppsCount++;
			}
			retVal = true;
		}
		else
		{
			alert('No records have been found that match the criteria given.');
		}
	}
	catch (e)
	{
		alert('getPPSInfoFromResults error: ' + e.message);
	}
	return retVal;
}
	
/**
 * sort the object array
 */
function sortObjectArray()
{
	try
	{
		ppsArray.sort(function(a, b)
		{
			var retVal = -1;
			
			if(a.orderNo > b.orderNo)
			{
				retVal = 1;
			}
			
			return retVal; 
		});
	}
	catch (e)
	{
		alert('sortObjectArray error: ' + e.message);
	}
}

/**
 * Group PPS search results by order number
 * 
 * 1.0.1 bug fix - last order not displayed - MJL
 */
function groupResultsByOrderNo()
{
	var retVal = false;

	try
	{	
		//If more than one result
		if (ppsCount > 1)
		{
			//for (var i = 0; i < ppsCount - 1; i++) 
			for (var i = 0; i < ppsCount; i++) //1.0.1 MJL
			{	
				//First element always gets added
				//Only add element to new array if the current element differs from the previous
				if (i != 0 && ppsArray[i].orderNo == ppsArray[i - 1].orderNo)
				{
					continue;
				}
				
				ordersArray.push(ppsArray[i]);
				ordersCount++;
			}
		}
		else //If only one result, duplicate array
		{
			ordersArray.push(ppsArray[0]);
			ordersCount++;
		}
		retVal = true;
	}
	catch (e)
	{
		alert('groupResultsByOrderNo error: ' + e.message);
	}
	return retVal;
}

/**
 * Add search results to selection sublist
 */
function populateSublist()
{
	for (var i = 0; i < ordersCount; i++)
	//for (var i = 0; i < 20; i++) //[TODO] Debug code - remove on deployment - MJL
	{	
		ordersObj = ordersArray[i];
		
		nlapiSelectLineItem('custpage_orders', (i + 1));
		nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_print', 'F');
		nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_orderdate', ordersObj.orderDate);
		nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_orderno', ordersObj.orderNo);
		//nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_batchno', ordersObj.batchNo);
		nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_customer', ordersObj.customerID);
		nlapiCommitLineItem('custpage_orders');
	}
}

/**
 * Mark or unmark all lines on sublist
 * 
 * Triggered by buttons on the sublist
 * 
 * @param markOrUnmark {Boolean}
 */
function toggleAll(markOrUnmark)
{
	var lineCount = 0;

	try
	{
		//Get number of lines on the sublist
		lineCount = nlapiGetLineItemCount('custpage_orders');

		//For each line, set the Print flag to true or false dependent on markOrUnmark parameter
		for (var i = 0; i < lineCount; i++)
		{	
			nlapiSelectLineItem('custpage_orders', (i + 1));

			if (markOrUnmark == true)
			{
				nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_print', 'T');
			}
			else
			{
				nlapiSetCurrentLineItemValue('custpage_orders', 'custpage_orders_print', 'F');
			}

			nlapiCommitLineItem('custpage_orders');
		}
	}
	catch (e)
	{
		alert('toggleAll error: ' + e.message);
	}
}

/**
 * Clear arrays for multiple executions 
 */
function clearArrays()
{
	//If arrays are filled, empty them
	if (ppsArray.length > 0 || ordersArray.length > 0)
	{
		ppsArray = new Array();
		ppsCount = 0;
		ordersArray = new Array();
		ordersCount = 0;
	}
}

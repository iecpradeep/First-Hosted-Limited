/**********************************************************************************************************
 * Name:        Pick, Pack & Ship (fulfill.js)
 * Script Type: Suitelet
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 22 Nov 2012 - first release - JM
 * Version:     1.0.1 - 04 Dec 2012 - amended - location selection added - JM
 * Version:     1.0.2 - 21 Mar 2013 - amended - Set fulfillment status in the PPS record - SA
 * Version:     1.0.3 - 21 Mar 2013 - amended - Search 242 is missing in the sandbox, so created a new search as per the spec  - SA 
 * Version:     1.0.4 - 04 Apr 2013 - amended - added sales order number field to the selection screen and added relevant filtering formula. - SA
 * Version:     1.0.5 - 29 Apr 2013 - amended - added '' (empty), instead of 0, e.g if (orderID == ''). - SA	
 * Version:     1.0.6 - 02 May 2013 - amended - added line to load fullfillment saved search and then get id. which ignores using magic number. - SA
 * Version:     1.0.7 - 23 May 2013 - amended - copy the location from the 1st line of the sales order to the body of the fulfilment - JN confirmed that
 * 													fulfilment will be done per location
 * 		 		1.0.8 - 17 Jun 2013 - added - hard-wire the location filter dependent on the menu link clicked by the user - MJL
 * 				1.0.9 - 20 Jun 2013 - added - utilise start and end batch numbers from CRS - MJL
 * 
 * Author:      FHL
 * Purpose:     Fulfill orders in the staging record set
 * 
 * Script:     	customscript_fulfill  
 * Deploy:      customdeploy_fulfill  
 * 
 * Saved Search: uses 	customsearch_fulfillment
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var objRequest = null;
var objResponse = null;

var locationFromURL = null;

var searchResult = null;
var searchResults = null;				// saved search results
var fulfillmentSearch = null;
var fulfillmentSearchIntID = 0;		
var itemQtys = new Array();
var itemQtysCopy = new Array();
var itemObj=new Object();
var itemCount = 0;
var tempSalesOrder = 0;
var qty = 0;
var item = 0;
var fulfillOrder = false;
var salesOrderIntID = 0;
var salesOrderToFulfill = 0;
var stagingIntID = 0;
var staging = null;
var processingError = '';
var location = 0;
var batchNo = 0;
var orderNo = 0;
var selectedStartBatch = 0;
var selectedEndBatch = 0;
var fldLocation = null;
var fldBatchNo = 0;
var fldStartBatch = null;
var fldEndBatch = null;
var fldOrderNo = 0;
var processMessage = '';
var fulfillmentStatus = '';


/**
 * fulfill orders
 * 
 * 1.0.8 - get location ID from menu URL - MJL
 * 1.0.9 - moved get of location ID to initialise function - MJL
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function fulfill(request, response)
{
	objRequest = request;
	objResponse = response;
	
	initialise();

	if (request.getMethod() == 'GET')
	{		
		//create and display selection form
		createFulfillForm();
		response.writePage(selectionForm);
	}
	else
	{
		if(getFormData()==true)
		{
			fulfillOrders();
		}
		createResultsForm();
		response.writePage(selectionForm);
	}

}

/******************
 * initialise
 * 
 * 1.0.6 - 02 May 2013 - amended - added line to load fullfillment saved search and then get id. which ignores using magic number. - SA
 * 1.0.9 - 20 Jun 2013 - get location from URL and load start and end batch numbers from CRS - MJL
 **********************/

function initialise()
{

	try
	{
		// load fulfillment savedsearch
		fulfillmentSearch = nlapiLoadSearch('customrecord_mrf_pickpackship', 'customsearch_fulfillment');
		// get internal id of fulfillment search
		fulfillmentSearchIntID = fulfillmentSearch.getId();
		
		
		//1.0.9 get location from URL - moved from main function - MJL
		locationFromURL = objRequest.getParameter('custparam_locationid');
		
		//1.0.9 Load default start and end batch numbers - MJL
		startBatch = loadBatchNumbers(locationFromURL, 'start');
		endBatch = loadBatchNumbers(locationFromURL, 'end');
		
		
	}
	catch (e)
	{
		errorHandler('initialise', e);

	}

}

/**
 * Creates PPS selection form
 * 
 * 1.0.4 added sales order number field to the selection screen - SA
 * 1.0.8 set location from URL and lock field - MJL
 */
function createFulfillForm()
{

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Pick Pack & Ship: Fulfillment');
		fldLocation = selectionForm.addField('custpage_pps_location','select','Location','location');
		
		//1.0.8 set location from URL and lock field - MJL
		if (locationFromURL != null)
		{
			fldLocation.setDefaultValue(locationFromURL);
			fldLocation.setDisplayType('inline'); //[TODO] This field may need to be editable; ask JM - MJL
		}
		
		fldOrderNo = selectionForm.addField('custpage_pps_orderno', 'integer', 'Sales Order Number');   //1.0.4 
		
		fldStartBatch = selectionForm.addField('custpage_pps_startbatchno', 'integer', 'Start Batch Number');
		fldEndBatch = selectionForm.addField('custpage_pps_endbatchno', 'integer', 'End Batch Number');
		fldStartBatch.setMandatory(true); //[TODO] ask JM - MJL
		fldEndBatch.setMandatory(true); //[TODO] ask JM - MJL
		
		//1.0.9 set default values for start and end batch numbers if present
		if (startBatch != -1 && endBatch != -1)
		{
			fldStartBatch.setDefaultValue(startBatch);
			fldEndBatch.setDefaultValue(endBatch);
		}
		
		//Create submit button
		selectionForm.addSubmitButton('Click here to to fulfill orders');

	}
	catch (e)
	{
		errorHandler('createFulfillForm', e);

	}

}

/**
 * Creates PPS selection form
 */
function createResultsForm()
{

	var script = null;

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm(processMessage);
		script = "alert('" + processMessage + "')";
		selectionForm.addButton('custombutton', processMessage, script);

	}
	catch (e)
	{
		errorHandler('createFinishedForm', e);

	}

}

/**
 * fulfill sales orders
 * Version:     1.0.4 - 04 Apr 2013 - amended - added sales order number field to the selection screen and added relevant filtering formula. - SA
 * Version:     1.0.5 - 29 Apr 2013 - amended - added '' (empty), instead of 0, e.g if (orderID == ''). - SA	
 */
function fulfillOrdersOld()
{

	var columns = null;
	var column = null;
	var criteria = new Array();
	var dealWithLastRecord = false;

	try
	{

		//1.0.4 
		//1.0.5 
		if(batchNo== '' && orderNo == '')
		{

			criteria =[[ 'custrecord_pps_location', 'is', location ] ,'and',[ 'custrecord_pps_process', 'is', 'F' ]];
		}
		else if(batchNo != '' && orderNo == '')
		{

			criteria =[[ 'custrecord_pps_location', 'is', location ] ,'and',[ 'custrecord_pps_process', 'is', 'F' ],'and',[ 'custrecord_batchnumber', 'is', batchNo ]];
		
		}
		else if(batchNo!= '' && orderNo != '')
		{

			criteria =[[ 'custrecord_pps_location', 'is', location ] ,'and',[ 'custrecord_pps_process', 'is', 'F' ],'and',[ 'custrecord_batchnumber', 'is', batchNo ],'and',[ 'custrecord_transactionid', 'is', orderNo ]];
		}
		else
		{
			
			criteria =[[ 'custrecord_pps_location', 'is', location ] ,'and',[ 'custrecord_pps_process', 'is', 'F' ],'and',[ 'custrecord_transactionid', 'is', orderNo ]];
		}

		// run the saved search
		runSavedSearchTrans(0, 500, fulfillmentSearchIntID, criteria);
 
		if(searchResults.length > 0)
		{

			for (var i = 0; i < searchResults.length; i++)
			{
				
				searchResult = searchResults[i];
				stagingIntID = searchResults[i].getId();

				response.write('fulfillOrders stageid ' + stagingIntID + "\n");

				columns = searchResult.getAllColumns();

				column = columns[0];		// order number is 1st column from ss
				salesOrderIntID = searchResult.getValue(column);
				column = columns[1];		// item is 2nd column from ss
				item = searchResult.getValue(column);				
				column = columns[2];		// qty is 3rd column from ss
				qty = searchResult.getValue(column);

				// store item + qty in an array (items for an order)
				dealWithStoreItemQtys(i,searchResults.length, stagingIntID);
				
				if(fulfillOrder==true && i == searchResults.length)
				{
					dealWithLastRecord=true;
				}

				// fulfill the sales order
				if(fulfillOrder==true)
				{
					fulfillSalesOrder(salesOrderToFulfill);
					markOrderLinesProcessed();
					fulfillOrder=false;
				}
				
			}
			
			// deal with last record
			if(dealWithLastRecord==false)
			{
				dealWithStoreItemQtys(i,searchResults.length, stagingIntID);
				fulfillSalesOrder(salesOrderToFulfill);
				markOrderLinesProcessed();
			}
		}
	}
	catch (e)
	{
		response.write('fulfillOrders error' + e.message + "\n");
		errorHandler('fulfillOrders', e);
	}

}

/**
 * fulfill sales orders
 * 
 * 1.0.4 added sales order number field to the selection screen and added relevant filtering formula. - SA
 * 1.0.5 added '' (empty), instead of 0, e.g if (orderID == ''). - SA
 * 1.0.9 utilises default start and end batch numbers from CRS - MJL
 */
function fulfillOrders()
{

	var columns = null;
	var column = null;
	var criteria = new Array();
	var dealWithLastRecord = false;

	try
	{

		//1.0.4 
		//1.0.5 
		if (selectedStartBatch == 0 && selectedEndBatch == 0 && orderNo == '')
		{
			criteria = [['custrecord_pps_location', 'is', location], 'and', [ 'custrecord_pps_process', 'is', 'F' ]];
		}
		else if (selectedStartBatch != 0 && selectedEndBatch != 0 && orderNo == '')
		{
			criteria = [['custrecord_pps_location', 'is', location], 'and', [ 'custrecord_pps_process', 'is', 'F' ], 'and', ['custrecord_batchnumber', 'between', selectedStartBatch, selectedEndBatch]];
		}
		else if (selectedStartBatch != 0 && selectedEndBatch != 0 && orderNo != '')
		{
			criteria = [['custrecord_pps_location', 'is', location], 'and', [ 'custrecord_pps_process', 'is', 'F' ], 'and', ['custrecord_batchnumber', 'between', selectedStartBatch, selectedEndBatch], 'and', ['custrecord_transactionid', 'is', orderNo]];
		}
		else
		{
			criteria = [['custrecord_pps_location', 'is', location], 'and', [ 'custrecord_pps_process', 'is', 'F' ], 'and', ['custrecord_transactionid', 'is', orderNo]];
		}

		// run the saved search
		runSavedSearchTrans(0, 500, fulfillmentSearchIntID, criteria);
 
		if(searchResults.length > 0)
		{

			for (var i = 0; i < searchResults.length; i++)
			{
				
				searchResult = searchResults[i];
				stagingIntID = searchResults[i].getId();

				response.write('fulfillOrders stageid ' + stagingIntID + "\n");

				columns = searchResult.getAllColumns();

				column = columns[0];		// order number is 1st column from ss
				salesOrderIntID = searchResult.getValue(column);
				column = columns[1];		// item is 2nd column from ss
				item = searchResult.getValue(column);				
				column = columns[2];		// qty is 3rd column from ss
				qty = searchResult.getValue(column);

				// store item + qty in an array (items for an order)
				dealWithStoreItemQtys(i,searchResults.length, stagingIntID);
				
				if(fulfillOrder==true && i == searchResults.length)
				{
					dealWithLastRecord=true;
				}

				// fulfill the sales order
				if(fulfillOrder==true)
				{
					fulfillSalesOrder(salesOrderToFulfill);
					markOrderLinesProcessed();
					fulfillOrder=false;
				}
				
			}
			
			// deal with last record
			if(dealWithLastRecord==false)
			{
				dealWithStoreItemQtys(i,searchResults.length, stagingIntID);
				fulfillSalesOrder(salesOrderToFulfill);
				markOrderLinesProcessed();
			}
		}
	}
	catch (e)
	{
		response.write('fulfillOrders error' + e.message + "\n");
		errorHandler('fulfillOrders', e);
	}

}



/**
 * deal with store item qtys
 * store an entire sales order in an array
 * 
 */

function dealWithStoreItemQtys(current, length, stageRecIntID)
{

	try
	{
		
		//nlapiLogExecution('debug', 'dealWithStoreItemQtys - inside log - itemCount', itemCount);
		itemCount = itemCount + 1;

		itemObj=new Object();

		itemObj.item = item;
		itemObj.qty = qty;
		itemObj.stageIntID = stageRecIntID;

		// if this is the first order
		if(current==0)
		{
			tempSalesOrder = salesOrderIntID;
			itemQtys[itemCount-1] = itemObj;
		}

		// check if the order has changed or is the last order
		// then duplicate the array
		if((salesOrderIntID !=tempSalesOrder))
		{
			salesOrderToFulfill = tempSalesOrder;
			tempSalesOrder = salesOrderIntID;
			itemQtysCopy = new Array();

			for(var i=0; i< itemQtys.length; i++)
			{
				itemQtysCopy[i] = itemQtys[i];
			}
			itemCount=1;
			itemQtys = new Array();
			fulfillOrder = true;
		}
		else
		{

			if(current==length)
			{
				salesOrderToFulfill = tempSalesOrder;
				itemQtysCopy = new Array();

				for(var i=0; i< itemQtys.length; i++)
				{
					itemQtysCopy[i] = itemQtys[i];
				}
				itemCount=1;
				itemQtys = new Array();
				fulfillOrder = true;
			}
		}
		itemQtys[itemCount-1] = itemObj;

	}
	catch(e)
	{
		response.write('dealWithStoreItemQtys error\n');
		errorHandler('dealWithStoreItemQtys', e);
	}

}


/**
 * fulfill individual sales order
 * you need to add a quantity to an item line on the fulfillment if the setting Setup > Accounting > Accounting Preferences > Order Management: "Default Items to Zero Received/Fulfilled" is checked.
 *  1.0.2 - 21 Mar 2013 - amended - Set fulfillment status in the PPS record - SA 
 *  1.0.7 - 23 May 2013 - amended - copy the location from the 1st line of the sales order to the body of the fulfilment - JN confirmed that fulfilment will be done per location
 */

function fulfillSalesOrder(orderId)
{
	var fulfillmentId = 0;
	var itemFulfillment = null;
	var itemIntId = 0;
	var arrPosn = 0;
	var qtyToFulFill = 0;
	var lineCount  = 0;
	var location = 0;
	
	try
	{
		itemFulfillment = nlapiTransformRecord('salesorder', orderId, 'itemfulfillment');
		lineCount = itemFulfillment.getLineItemCount('item');

		// match the lines from the staging table to the sales order lines
		for(var i = 1; i <= lineCount; i++)
		{
			itemIntId = itemFulfillment.getLineItemValue('item', 'item', i);
			qtyToFulFill = getItemQty(itemIntId);

			if(qtyToFulFill>0)
			{
				itemFulfillment.setLineItemValue('item', 'quantity', i, qtyToFulFill);
				location = itemFulfillment.getLineItemValue('item', 'location', i);		// store the location - assume same location being used across items for this fulfillment - 1.0.7
			}
			else
			{
				itemFulfillment.setLineItemValue('item', 'itemreceive', i, 'F');
			}
		}

		itemFulfillment.setFieldValue("shipstatus", "C");
		
		// update the fulfillment body with the location - 1.0.7
		if(location!=0)
		{
			itemFulfillment.setFieldValue("location", location);
		}
		
		fulfillmentId = nlapiSubmitRecord(itemFulfillment, true);

		processingError="Processed";
		fulfillmentStatus ="Fulfilled" ; //1.0.2
	}
	catch(e)
	{
		response.write('fulfillSalesOrder error ' + e.message + '\n');
		errorHandler('fulfillSalesOrder', e);
		processingError = "failed to fulfill: " + e.message;
		fulfillmentStatus ="Failed to fulfill" ; //1.0.2
	}

	return fulfillmentId;
}


/**
 * checking to see if the item exists in the array
 * and return the item qty from the item qty array
 * 
 */
function getItemQty(itmIntID)
{

	var itemQty = 0;
	var itemObjCode = 0;
	var itemObjQty = 0;

	try 
	{
		for(var i=0; i< itemQtysCopy.length; i++)
		{
			itemObj = itemQtysCopy[i];
			itemObjCode = itemObj.item;
			itemObjQty = itemObj.qty;

			if(itmIntID == itemObjCode && itemObjQty>0)
			{
				itemQty = itemObjQty;
				itemObj.qty = 0;				// allocate so does not get used again
				itemQtysCopy[i] = itemObj;
				
				break;
			}

		}
	} 
	catch (e) 
	{
		response.write('getItemQty error\n');
		errorHandler('getItemQty', e);
	}

	return itemQty;
}

/**
 * mark order lines as processed
 * 
 * Version:     1.0.2 - 21 Mar 2013 - amended - Set fulfillment status in the PPS record - SA
 * 
 */
function markOrderLinesProcessed()
{

	var stgIntId = 0;

	try
	{
		for(var i=0; i< itemQtysCopy.length; i++)
		{
			itemObj = itemQtysCopy[i];
			stgIntId = itemObj.stageIntID;

			nlapiSubmitField('customrecord_mrf_pickpackship', stgIntId, 'custrecord_pps_process', 'T');
			nlapiSubmitField('customrecord_mrf_pickpackship', stgIntId, 'custrecord_processingstatus', processingError);
			// 1.0.2 Set fulfillment status in the PPS record			
			nlapiSubmitField('customrecord_mrf_pickpackship', stgIntId, 'custrecord_pps_fulfillmentstatus', fulfillmentStatus);  
		}
	}
	catch(e)
	{
		errorHandler('markOrderLinesProcessed', e);
		response.write('markOrderLinesProcessed error\n');
	}
}



/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 * 1.0.1 - add location filter
 ************************************************************************************/

function runSavedSearchTrans(from, to, savedSearch, criteria)
{

	var loadSearch = null;
	var runSearch = null;

	try
	{

		//Loading the saved search
		loadSearch = nlapiLoadSearch('customrecord_mrf_pickpackship', savedSearch);

		// set location criteria 1.0.1
		loadSearch.setFilterExpression(criteria);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		searchResults = runSearch.getResults(from,to);
		var filters = loadSearch.getFilters();

	
	}
	catch(e)
	{
		response.write('runsavedsearch error\n');
		errorHandler("runSavedSearch:",e);
	}

}



/**
 * get form data
 * 
 * 1.0.4 - 04 Apr 2013 - amended - added sales order number field to the selection screen and added relevant filtering formula. - SA
 */

function getFormData()
{
	var retVal = false;

	try
	{
		//Get filter information from form
		location = objRequest.getParameter('custpage_pps_location');
		orderNo = objRequest.getParameter('custpage_pps_orderno'); //1.0.4
		
		selectedStartBatch = objRequest.getParameter('custpage_pps_startbatchno'); //1.0.9 MJL
		selectedEndBatch = objRequest.getParameter('custpage_pps_endbatchno'); //1.0.9 MJL
		
		//1.0.9 save new start and end batch number if submitted numbers differ from saved - MJL
		if (selectedStartBatch != startBatch && selectedEndBatch != endBatch)
		{
			saveBatchNumbers(location, selectedStartBatch, selectedEndBatch);
		}
		
		if(location!=0)
		{
			processMessage = 'Pick Pack & Ship: Fulfillment Complete';
			retVal = true;
		}
		else
		{
			processMessage = 'Pick Pack & Ship: You must select a location - no fulfillment records created';
		}	
	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}

	return retVal;

}








//nlapiLogExecution('debug', 'fulfillOrders - salesOrderIntID is', salesOrderIntID);
//nlapiLogExecution('debug', 'fulfillOrders - item is', item);
//nlapiLogExecution('debug', 'fulfillOrders - qty is', qty);



//var zzz=new Object();
//zzz = itemQtysCopy[i];

//nlapiLogExecution('debug', 'dealWithStoreItemQtys - SALESORDER & itemObj.item 1 ', salesOrderToFulfill +":" + zzz.item);

/**********************************************************************************************************
 * Name:        Pick, Pack & Ship (pickPackShip.js)
 * Script Type: Suitelet
 * Client:      Destiny Entertainments Limited 
 * 
 * Version:     1.0.0 - 08 Apr 2013 - First Release - SA

 * 
 * Author:      FHL
 * Purpose:     Provides a selection form for picking items and populates custom record set
 * 
 * Script:      customscript_pickpackship
 * Deploy:      customdeploy_pickpackship
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var returnValue = true;
var selectionForm = null;
var fldDepartment = null;
var fldLocation = null;
var fldSalesChannel = null;
var fldItem = null;
var fldAccount = null;
var fldCustomer = null;

var department = null;
var location = null;
var salesChannel = null;
var item = null;
var tranAccount = 0;

var status = null;
var customer = null;
var binNumber = null;
var accountNumber = null;

var orderNo = '';
var itemId = 0;
var quantity = 0;
var quantityPicked = 0;
var orderDate = null;
var tranID = 0;
var customerNumber = '';

var filters = new Array();
var columns = new Array();
var results = null;

var customRecord = null;
var newPPSRecordInternalID = 0;
var lastPPSRecordInternalId = 0;  // to compare with generic search result,

/********************************************************************************************
 * Top-level function called by Script Deployment
 ********************************************************************************************/
function pickPackShip(request, response)
{
	if (request.getMethod() == 'GET')
	{
		//create and display selection form
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else if(returnValue == true)
	{
		//get information from sales orders
		createResultsForm();
		createSalesOrderStagingRecords();

		storeLastPPSRecordInternalId();
		response.writePage(selectionForm);
	}
}

/*********************************************************************************************************************************************************
 * Creates PPS selection form

 *********************************************************************************************************************************************************/
function createSelectionForm()
{ 

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Pick Pack & Ship: Order Selection');

		//Create submit button
		selectionForm.addSubmitButton('Click here to select order data for Pick, Pack and Ship.');

		//Create fields
		fldDepartment = selectionForm.addField('custpage_pps_brand','select','Department','department'); 	    	
		fldLocation = selectionForm.addField('custpage_pps_location','select','Location','location');		
		fldSalesChannel = selectionForm.addField('custpage_pps_source','multiselect','Sales Channel','classification'); 
		fldItem = selectionForm.addField('custpage_pps_item','select','Item','item');
		fldCustomer = selectionForm.addField('custpage_pps_customer', 'select', 'Customer', 'customer');
		fldAccountNumber = selectionForm.addField('custpage_pps_accountnumber', 'select', 'Account Number', 'null');

		findAccounts(fldAccountNumber);	

	}
	catch (e)
	{
		errorHandler('createSelectionForm', e);
	}
}

/**********************************************************************
 * findAccounts Function - Finding  Accounts  
 * 							 'Account Number' select field
 * 
 * @param fldAccountNumber
 * 
 **********************************************************************/
function findAccounts(fldAccountNumber)
{
	//Declaring the local variables
	var accFilter = new Array();
	var accCol = new Array();
	var arAccount =null;
	var accIntId=null;
	var searchAcc =new Array();

	try
	{
		//Adding filters to, search the related active sales accounts 			
		accFilter[0] = new nlobjSearchFilter('isinactive',null, 'is','F');					//filtering by active accounts	

		//Getting particular columns in accounts search results 
		accCol[0] = new nlobjSearchColumn('name');											//Getting account name
		accCol[1] = new nlobjSearchColumn('internalid');									//Getting the account's internal ID

		//Searching the accounts using filters and columns 
		searchAcc = nlapiSearchRecord('account', null, accFilter, accCol);
		fldAccountNumber.addSelectOption(-1, '', true);
		//Getting the values of particular columns returned from search results
		for(var index=0; index < searchAcc.length; index++)
		{
			//Getting the account name
			arAccount = searchAcc[index].getValue(accCol[0]);

			//Getting the account's internal ID 
			accIntId = searchAcc[index].getValue(accCol[1]);

			//Adding each account to the 'select' list
			fldAccountNumber.addSelectOption(accIntId, arAccount, false);
		}
	}
	catch(e)
	{
		errorHandler("findAccounts : " +e);
	} 
}

/****************************************************************************************
 * Creates PPS selection form
 ***************************************************************************************/
function createResultsForm()
{
	var script = null;

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Pick Pack & Ship: Selection Complete');
		script = "alert('Selection Complete - please review under maintenance')";
		selectionForm.addButton('custombutton', 'Selection Complete', script);
	}		
	catch (e)
	{
		errorHandler('createResultsForm', e);

	}

}

/************************************************************************************
 * Get information from Sales Orders
 ************************************************************************************/
function createSalesOrderStagingRecords()
{
	var context = nlapiGetContext();

	try
	{
		getFormData();
		setupFilters();
		getLastPPSRecordInternalId();

		//Load existing saved search and add new filters and columns
		results = nlapiSearchRecord('transaction', null, filters, columns);

		if (results != null)
		{		
			response.write('transactions ' + results.length + '\n');

			//Put information into order object and add to array
			for (var i = 0; i < results.length; i++)
			{
				orderNo = results[i].getValue(columns[0]);
				itemId = results[i].getValue(columns[1]);
				location = results[i].getValue(columns[2]);
				quantity = results[i].getValue(columns[3]);
				orderDate = results[i].getValue(columns[4]);
				tranID = results[i].getValue(columns[5]);
				status = results[i].getValue(columns[6]);
				quantityPicked = results[i].getValue(columns[7]);
				tranAccount = results[i].getValue(columns[8]);
				binNumber = results[i].getValue(columns[9]);
				customerNumber = results[i].getValue(columns[10]);

				response.write('Usage remaining ' + context.getRemainingUsage() + '\n');
				response.write('status ' + status + '\n');

				if(context.getRemainingUsage() < 50 )
				{
					response.write('Out of script usage.... stopping.\n');
				}
				else
				{
					// only select records that have some left to pick
					// and that are not postage and packing
					if(quantityPicked < quantity)
					{			
						createStagingRecord();
					}
				}
			}
			response.write('PPS records are being created.');
		}
		else
		{
			nlapiLogExecution('ERROR', 'No results to show', 'details');
			response.write('No PPS records will be created as there are no search results.\n');
		}
	}
	catch (e)
	{
		errorHandler('createSalesOrderStagingRecords', e);
		response.write('An error has occurred while getting order info: ' + e.message + '\n');
	}
}

/*******************************************************************************************************
 * setup Filters
 * 
 * Sales Order:Pending Fulfillment = SalesOrd:B
 * Sales Order:Partially Fulfilled = SalesOrd:D	
 * Sales Order:Pending Billing/Partially Fulfilled = SalesOrd:E
 * 
 *******************************************************************************************************/

function setupFilters()
{
	var filterCount = 0;
	var statusArray = new Array();

	try
	{		
		statusArray[0] = 'SalesOrd:B';		// Pending Fulfillment = SalesOrd:B
		statusArray[1] = 'SalesOrd:D';		// Partially Fulfilled = SalesOrd:D	
		statusArray[2] = 'SalesOrd:E';		// Pending Billing/Partially Fulfilled = SalesOrd:E

		//create new filters
		filters[filterCount] = new nlobjSearchFilter('type', null, 'is', 'SalesOrd');
		filters[filterCount++] = new nlobjSearchFilter('mainline', null, 'is', 'F');
		filters[filterCount++] = new nlobjSearchFilter('taxline', null, 'is', 'F');
		filters[filterCount++] = new nlobjSearchFilter('status', null, 'anyof', statusArray);			// pendingFulfillment
		filters[filterCount++] = new nlobjSearchFilter('quantity', null, 'greaterThan', 0);				// 1.0.1 do not pick negative amounts

		if(department!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('department', null, 'is', department);
		}

		if(location!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('location', null, 'is', location);
		}

		if(customer!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('entity', null, 'is', customer);
		}

		if(item!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('item', null, 'is', item);
		}

		// 1.1.2 - Included order source in the filter
		if(salesChannel!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('class', null, 'is', salesChannel);
		}

		if(accountNumber!=-1)
		{
			filters[filterCount++] = new nlobjSearchFilter('account', null, 'is', accountNumber);
		}

		//Get additional search columns
		columns[0] = new nlobjSearchColumn('internalId');
		columns[1] = new nlobjSearchColumn('item');
		columns[2] = new nlobjSearchColumn('location');
		columns[3] = new nlobjSearchColumn('quantity');
		columns[4] = new nlobjSearchColumn('trandate');
		columns[5] = new nlobjSearchColumn('tranid').setSort();
		columns[6] = new nlobjSearchColumn('status');
		columns[7] = new nlobjSearchColumn('quantitypicked');
		columns[8] = new nlobjSearchColumn('account');
		columns[9] = new nlobjSearchColumn('binnumber','item');
		columns[10] = new nlobjSearchColumn('entity');

	}
	catch (e)
	{
		errorHandler('setupFilters', e);
	}
}

/*******************************************************
 * get form data
 * 
 ********************************************************/

function getFormData()
{
	try
	{
		//Get filter information from form
		department = request.getParameter('custpage_pps_brand');
		location = request.getParameter('custpage_pps_location');
		salesChannel = request.getParameter('custpage_pps_source');
		item = request.getParameter('custpage_pps_item');
		customer = request.getParameter('custpage_pps_customer');
		accountNumber = request.getParameter('custpage_pps_accountnumber');

	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}

}

/**********************************************************************************************
 * Create new custom records from Sales Order info

 ***********************************************************************************************/
function createStagingRecord()
{
	var newPPSRecord = null;	
	var genericSearchResults = null;

	try
	{	
		genericSearchResults = genericSearchThreeParams('customrecord_pickpackship', 'custrecord_pps_orderno', orderNo, 'custrecord_pps_item', itemId, 'custrecord_pps_location', location);

		if ((genericSearchResults == 'not found') || (genericSearchResults != 'not found' && genericSearchResults > lastPPSRecordInternalId))
		{

			//Create and populate new record
			newPPSRecord = nlapiCreateRecord('customrecord_pickpackship');

			newPPSRecord.setFieldValue('custrecord_pps_orderno', orderNo);	
			newPPSRecord.setFieldValue('custrecord_pps_item', itemId);
			newPPSRecord.setFieldValue('custrecord_pps_location', location);	
			newPPSRecord.setFieldValue('custrecord_pps_process', 'F');
			newPPSRecord.setFieldValue('custrecord_pps_quantity', quantity - quantityPicked);
			newPPSRecord.setFieldValue('custrecord_pps_date', orderDate);	
			newPPSRecord.setFieldValue('custrecord_customernumber', customerNumber);
			newPPSRecord.setFieldValue('custrecord_pps_deliveryref', tranID);
			newPPSRecord.setFieldValue('custrecord_transactionid', tranID);
			newPPSRecord.setFieldValue('custrecord_binnumber', binNumber);

			nlapiSubmitRecord(newPPSRecord);
			newPPSRecordInternalID = newPPSRecord.getId();  
		}

	}
	catch (e)
	{
		errorHandler('populateCustomRecord', e);
		response.write('An error has occurred while creating PPS records: ' + e.message + '\n');
	}
}

/***********************************************************************************************************************
 * for getting the last PPS Record Internal Id which is stored in custom record set, (to prevent duplication in the PPS record)
 * 
 *********************************************************************************************************************/
function getLastPPSRecordInternalId()
{
	try
	{
		customRecord = nlapiLoadRecord('customrecord_ppslastrecordinternalid',1);	
		lastPPSRecordInternalId = customRecord.getFieldValue('custrecord_lastppsrecordinternalid');
	}
	catch(e)
	{
		errorHandler('getLastPPSRecordInternalId', e);
	}
}

/***********************************************************************************************************************
 * for storing the last PPS record internal ID (to prevent duplication)
 * 
 ***********************************************************************************************************************/
function storeLastPPSRecordInternalId()
{

	var lastPPSInternalIdRecord = null;

	try
	{
		if (newPPSRecordInternalID != 0)
		{
			customRecord.setFieldValue('custrecord_lastppsrecordinternalid', newPPSRecordInternalID);
		}

		lastPPSInternalIdRecord = nlapiSubmitRecord(customRecord, true);


	}
	catch(e)
	{
		errorHandler('storeLastPPSRecordInternalId', e);
	}
}





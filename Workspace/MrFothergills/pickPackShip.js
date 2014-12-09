/**********************************************************************************************************
 * Name:        Pick, Pack & Ship (pickPackShip.js)
 * 
 * Script Type: Suitelet
 * 
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 22 Nov 2012 - first release - JM
 *			    1.0.1 - 10 Dec 2012 - amended  - do not pick negative transactions
 * 			    1.0.2 - 18 Mar 2013 - created  - custom fields on the order selection - SA
 * 			    1.0.3 - 18 Mar 2013 - amended - made Brand and Location field display type to be mandatory - SA 
 * 			    1.0.4 - 18 Mar 2013 - added  -  filter for the new created field. - SA
 * 				1.1.0 - 18 Mar 2013 - added  - created a new function to limit the limit order number to 4 digit (i.e 9999). - SA
 * 				1.1.1 - 19 Mar 2013 - amended  -amended priority order fields to make drop down Yes, No, and blank. - SA
 * 				1.1.2 - 19 Mar 2013 - amended  - changed "order source" field type to multi select and Included order source in the filter - SA
 *              1.1.3 - 19 Mar 2013 - created  - applied a client script to validate the length of the field, script name: customscript_pickpackshipvalidatefield - SA
 *              1.1.4 - 19 Mar 2013 - created -	Created a function to get last batch number which stored in the custom record set - SA
 * 				1.1.5 - 19 Mar 2013 - created -	Created a function to store the last batch number in the custom record set - SA
 * 				1.1.6 - 21 Mar 2013 - created -	Called a generic search form library, to prevent duplication   - SA
 * 				1.1.7 - 22 Mar 2013	- amended  - added (genericSearchResults > lastPPSRecordInternalId) in the If statement,to exclude the new records. (e.g, previously,if a sales order has exactly two  same lines then it was not adding 2nd line, lastPPSRecordInternalId is the id of last record and it sets when it script fired last time.) - SA 
 * 				1.1.8 - 04 Apr 2013	- added  - added a new field to the custom record -SA
 * 				1.1.9 - 03 May 2013	- removed reference to custbody_mrf_brandcustomer replaced with entity
 * 				1.1.10 - 13 Jun 2013	- collate all used batch numbers into a string and display at the end of the process
 * 				1.2.0 - 17 Jun 2013 - added - hard-wire the location filter dependent on the menu link clicked by the user - MJL
 * 				1.2.1 - 17 Jun 2013 - added - save start and end batch numbers to custom record - MJL
 * 				1.2.2 - 18 Jun 2013 - added -set default batch size of 9999 if chosen location is either RKY or JRH - MJL
 * 				1.2.3 - 02 Jun 2013 - added -set default batch size of 10 if chosen location is KMO - MJL
 * 				1.2.4 - 04 Jul 2013 - added check to prevent printing of duplicate batch numbers in results screen - MJL
 * 				1.2.5 - 18 Jul 2013 - compare with ordered quantity with quantity committed - MJL
 * 
 * Author:      FHL
 * 
 * Purpose:     Provides a selection form for picking items and populates custom record set
 * 
 * Script:      customscript_mrf_pickpackship
 * Deploy:      customdeploy_mrf_pickpackship
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var locationFromURL = null;

var returnValue = true;
var selectionForm = null;
var fldBrand = null;
var fldLocation = null;
var fldSource = null;
var fldPriority = null;
var fldItem = null;
var fldAccount = null;
var fldOrderType = null;
var fldDateFrom = null;
var fldDateTo = null;
var fldCustomer = null;
var fldCustomerAccount = null;
var fldLimitNumberOfOrders = 0;
var fldBatchSize =0;

var fldBatchNumbers = null;

var brand = null;
var location = null;
var source = null;
var priority = null;
var item = null;
var tranAccount = 0;
var orderType = null;
var status = null;
var customer = null;
var binNumber = null;
var accountNumber = null;
var customerType = null;
var LimitNumberOfOrders = 0;

var dateFrom = null;
var dateTo = null;

var orderNo = '';
var itemId = 0;
var quantity = 0;
var quantityPicked = 0;
var quantityOnHand = 0;
var orderDate = null;
var tranID = 0;
var cusType = '';
var customerNumber = '';
var quantityCommitted = 0;
var lineInternalID = 0;

var filters = new Array();
var columns = new Array();
var results = null;

var boxNumber = 0;
var batchNumber = 0;
var tempOrderNo = -9999;		// any old number that an order cant be

var accountIntIDPP = 174;		// internal Account ID for P&P [todo] parameter

var batchSize = 0;

var locationIntId = 0;
var customRecord = null;

var newPPSRecordInternalID = 0;
var lastPPSRecordInternalId = 0;  // to compare with generic search result,
var batchNumbersGenerated = '';

/********************************************************************************************
 * Top-level function called by Script Deployment
 * 
 * 1.2.0 - get location ID from menu URL - MJL
 ********************************************************************************************/
function pickPackShip(request, response)
{
	if (request.getMethod() == 'GET')
	{
		locationFromURL = request.getParameter('custparam_locationid'); //1.2.0 MJL

		//create and display selection form
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else if(returnValue == true)
	{
		//get information from sales orders
		createSalesOrderStagingRecords();

		createResultsForm();

		storeLastBatchNumber();
		response.writePage(selectionForm);
	}
}

/*********************************************************************************************************************************************************
 * Creates PPS selection form
 *  1.0.2 - 18 Mar 2013 - created  - custom fields on the order selection - SA
 *  1.0.3 - 18 Mar 2013 - amended - made Brand and Location field display type to be mandatory - SA
 *  1.1.1 - 19 Mar 2013 - amended  -amended priority order fields to make drop down Yes, No, and blank. - SA 
 *  1.1.2 - 19 Mar 2013 - amended  - changed "order source" field type to multi select - SA
 *  1.1.3 - 19 Mar 2013 - created  - applied a client script to validate the length of the field, script name: customscript_pickpackshipvalidatefield - SA
 *  1.2.0 - 17 Jun 2013 - added - hard-wire the location filter dependent on the menu link clicked by the user - MJL
 *  1.2.2 - 18 Jun 2013 - added -set default batch size of 9999 if chosen location is either RKY or JRH - MJL
 *  1.2.3 - 02 Jun 2013 - added -set default batch size of 10 if chosen location is KMO - MJL
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
		fldBrand = selectionForm.addField('custpage_pps_brand','select','Brand','department'); 	//
		fldBrand.setMandatory(true);     // 1.0.3  

		fldLocation = selectionForm.addField('custpage_pps_location','select','Location','location');
		fldLocation.setMandatory(true);  // 1.0.3

		//1.2.0 set location from URL and lock field - MJL
		if (locationFromURL != null)
		{
			fldLocation.setDefaultValue(locationFromURL);
			fldLocation.setDisplayType('inline'); //[TODO] This field may need to be editable; ask JM - MJL
		}

		fldSource = selectionForm.addField('custpage_pps_source','multiselect','Order Source','customlist_mrf_list_ordersource'); // 1.1.2 - 
		fldPriority = selectionForm.addField('custpage_pps_priority','select','Priority Orders'); //1.1.1 - 
		fldItem = selectionForm.addField('custpage_pps_item','select','Item','item');
		fldCustomer = selectionForm.addField('custpage_pps_customer', 'select', 'Customer', 'customer');
		// fldOrderType = selectionForm.addField('custpage_pps_ordertype','select','Order Type');
		// 1.0.2 - created custom fields
		fldAccountNumber = selectionForm.addField('custpage_pps_accountnumber', 'select', 'Account Number', 'null');
		fldCustomerType = selectionForm.addField('custpage_pps_customertype', 'select', 'Customer Type');
		fldLimitNumberOfOrders = selectionForm.addField('custpage_pps_limitnumberoforders', 'integer', 'Limit number of Orders');
		fldBatchSize = selectionForm.addField('custpage_pps_batchsize', 'integer', 'Batch Size');

		//1.2.2 set default batch size of 9999 if chosen location is either RKY or JRH - MJL
		if (locationFromURL != 1)
		{
			fldBatchSize.setDefaultValue(9999);
		}
		else
		{
			fldBatchSize.setDefaultValue(10); //1.2.3 MJL
		}

		findAccounts(fldAccountNumber);

		//Populate Customer Type field  - 1.0.2 
		fldCustomerType.addSelectOption('', '', true);
		fldCustomerType.addSelectOption('1', 'Company', false);
		fldCustomerType.addSelectOption('2', 'Individual', false);

		//Populate Priority order field  - 1.1.1 
		fldPriority.addSelectOption('', '', true);
		fldPriority.addSelectOption('1', 'Yes', false);
		fldPriority.addSelectOption('2', 'No', false);

		// applied a client script to validate the fields
		returnValue = selectionForm.setScript('customscript_pickpackshipvalidatefield');
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
		accFilter[0] = new nlobjSearchFilter('number', null, 'isnot','42600');				
		accFilter[1] = new nlobjSearchFilter('isinactive',null, 'is','F');					//filtering by active accounts


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
		script = "alert('Selection Complete - please review under maintenance - batch numbers generated: " + batchNumbersGenerated + "')";

		fldBatchNumbers = selectionForm.addField('generatedbatchnumbers','textarea', 'Batch Numbers Generated', null,batchNumbersGenerated);

		selectionForm.setFieldValues({ generatedbatchnumbers: batchNumbersGenerated});

		selectionForm.addButton('custombutton', 'Selection Complete', script);
	}		
	catch (e)
	{
		errorHandler('createResultsForm', e);

	}

}

/************************************************************************************
 * Get information from Sales Orders
 * 
 * 1.2.5 get quantity committed - MJL
 ************************************************************************************/
function createSalesOrderStagingRecords()
{
	var context = nlapiGetContext();

	try
	{
		batchNumbersGenerated = '';

		getFormData();
		setupFilters();
		getBatchNumber();
		
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
				cusType = results[i].getValue(columns[10]);
				customerNumber = results[i].getValue(columns[11]);
				quantityCommitted = results[i].getValue(columns[12]); //1.2.5 MJL
				//	lineInternalID = results[i].getValue(columns[11]);
				
				//	nlapiLogExecution('debug', 'results', +[i],results[i].getValue(location));

				response.write('Usage remaining ' + context.getRemainingUsage() + '\n');
				response.write('status ' + status + '\n');

				if(context.getRemainingUsage() < 50)
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
 * 1.0.1 - do not pick negative amounts
 * 1.0.2 - added new custom fields to the filtering.
 * 1.1.1 - amended priority order fields to make drop down Yes, No, and blank. - SA 
 * 1.1.2 - Included order source in teh filter 
 * 1.2.5 - add column for quantity committed - MJL
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
		filters[filterCount++] = new nlobjSearchFilter('account', null, 'noneOf', accountIntIDPP);		// not P&P account
		filters[filterCount++] = new nlobjSearchFilter('quantity', null, 'greaterThan', 0);				// 1.0.1 do not pick negative amounts


		if(brand!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('department', null, 'is', brand);
		}

		if(location!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('location', null, 'is', location);
		}

		if(customer!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('entity', null, 'is', customer);
		}
		// 1.1.1 - amended priority order fields to make drop down Yes, No, and blank. - SA 

		if(priority == 1)
		{
			filters[filterCount++] = new nlobjSearchFilter('custbody_mrf_tran_highpriority', null, 'is', 'T');
		}

		if(priority == 2)
		{
			filters[filterCount++] = new nlobjSearchFilter('custbody_mrf_tran_highpriority', null, 'is', 'F');
		}

		if(item!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('item', null, 'is', item);
		}


		if(dateFrom!=null && dateTo != null)
		{
			filterCount = filterCount + 1;  
		}

		// 1.0.2
		if(accountNumber!=-1)
		{
			filters[filterCount++] = new nlobjSearchFilter('account', null, 'is', accountNumber);
		}

		if(customerType == 1)
		{
			filters[filterCount++] = new nlobjSearchFilter('custbody_isperson', null, 'is', 'F');
		}
		if(customerType == 2)
		{
			filters[filterCount++] = new nlobjSearchFilter('custbody_isperson', null, 'is', 'T');
		}

		// 1.1.2 - Included order source in the filter
		if(source!=0)
		{
			filters[filterCount++] = new nlobjSearchFilter('custbody_mrf_tran_ordersource', null, 'is', source);
		}




//		filters[2] = new nlobjSearchFilter('custbody_mrf_tran_ordersource', null, 'is', source);
//		filters[4] = new nlobjSearchFilter('item', null, 'is', item);
		//filters[5] = new nlobjSearchFilter('account', null, 'is', account);
//		filters[5] = new nlobjSearchFilter('custbody_mrf_tran_ordertype', null, 'is', orderType);
//		filters[6] = new nlobjSearchFilter('mainline', null, 'is', 'F');

		//filters[8] = new nlobjSearchFilter('trandate', null, 'within', 'thisyear');

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
		columns[10] = new nlobjSearchColumn('isperson','customer');
		columns[11] = new nlobjSearchColumn('entity');
		columns[12] = new nlobjSearchColumn('quantitycommitted'); //1.2.5 MJL
		//columns[11] = new nlobjSearchColumn('custbody_mrf_brandcustomer');


	}
	catch (e)
	{
		errorHandler('setupFilters', e);
	}


}

/*******************************************************
 * get form data
 * 
 * 1.0.4 - added  filter for the new created field. - SA
 ********************************************************/

function getFormData()
{

	try
	{
		//Get filter information from form
		brand = request.getParameter('custpage_pps_brand');
		location = request.getParameter('custpage_pps_location');
		source = request.getParameter('custpage_pps_source');
		priority = request.getParameter('custpage_pps_priority');
		item = request.getParameter('custpage_pps_item');
		orderType = request.getParameter('custpage_pps_ordertype');

		customer = request.getParameter('custpage_pps_customer');

		dateFrom = request.getParameter('custpage_pps_orderdatefrom');
		dateTo = request.getParameter('custpage_pps_orderdateto');

		//1.0.4 - added  filter for the new created field.
		accountNumber = request.getParameter('custpage_pps_accountnumber');
		customerType = request.getParameter('custpage_pps_customertype');

		batchSize = request.getParameter('custpage_pps_batchsize');
		LimitNumberOfOrders = request.getParameter('custpage_pps_limitnumberoforders');

	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}

}

/**********************************************************************************************
 * Create new custom records from Sales Order info
 * 1.1.6 - 21 mar 2013 - created -	Called a generic search form library, to prevent duplication   - SA
 * 1.1.7 - added (genericSearchResults > lastPPSRecordInternalId) to exclude the new records, (e.g, previously,if a sales order has exactly two  same lines then it was not adding 2nd line, lastPPSRecordInternalId is the id of last record and it sets when it script fired last time.) - SA
 * 1.1.8 - 04 Apr 2013	- added  - added a new field to the custom record -SA 
 * 1.2.4 - 04 Jul 2013 - added check to prevent printing of duplicate batch numbers in results screen - MJL
 * 1.2.5 compare with ordered quantity with quantity committed - MJL
 ***********************************************************************************************/
function createStagingRecord()
{
	var newPPSRecord = null;	
	var genericSearchResults = null;


	//
	try
	{
		genericSearchResults = genericSearchThreeParams('customrecord_mrf_pickpackship', 'custrecord_pps_orderno', orderNo, 'custrecord_pps_item', itemId, 'custrecord_pps_location', location);
		
		// 1.1.7 - added  added (genericSearchResults > lastPPSRecordInternalId)
		if ((genericSearchResults == 'not found') || (genericSearchResults != 'not found' && genericSearchResults > lastPPSRecordInternalId))
		{
			//Create and populate new record
			newPPSRecord = nlapiCreateRecord('customrecord_mrf_pickpackship');

			newPPSRecord.setFieldValue('custrecord_pps_orderno', orderNo);	
			newPPSRecord.setFieldValue('custrecord_pps_item', itemId);
			nlapiLogExecution('DEBUG', 'createStagingRecord: itemId', itemId);
			newPPSRecord.setFieldValue('custrecord_pps_location', location);	
			newPPSRecord.setFieldValue('custrecord_pps_process', 'F');
			
			//1.2.5 compare with ordered quantity with quantity committed - MJL
			if (quantity < quantityCommitted)
			{
				newPPSRecord.setFieldValue('custrecord_pps_quantity', quantity - quantityPicked);
			}
			else
			{
				newPPSRecord.setFieldValue('custrecord_pps_quantity', quantityCommitted);
			}

			newPPSRecord.setFieldValue('custrecord_pps_date', orderDate);	
			newPPSRecord.setFieldValue('custrecord_customernumber', customerNumber);
			newPPSRecord.setFieldValue('custrecord_pps_deliveryref', tranID);
			// 1.1.8 
			newPPSRecord.setFieldValue('custrecord_transactionid', tranID);

			// allocate the box and batch number to the order line
			allocateBoxBatchNumber();

			batchNumber = String(batchNumber);

			//1.2.4 prevent printing of duplicate batch numbers in results screen - MJL
			if (batchNumbersGenerated.indexOf(batchNumber))
			{
				batchNumbersGenerated = batchNumbersGenerated + batchNumber + ' ';
			}

			newPPSRecord.setFieldValue('custrecord_boxnumber', boxNumber);
			newPPSRecord.setFieldValue('custrecord_batchnumber',batchNumber);
			newPPSRecord.setFieldValue('custrecord_binnumber', binNumber);

			//	1.1.6 - Called a generic search form library, to prevent duplication
			
			//1.2.5 only submit new record if stock has been committed for the item - MJL
			if (quantityCommitted > 0)
			{
				newPPSRecordInternalID = nlapiSubmitRecord(newPPSRecord);
			}
		}
	}
	catch (e)
	{
		errorHandler('populateCustomRecord', e);
		response.write('An error has occurred while creating PPS records: ' + e.message + '\n');
	}
}

/**********************************************************************************************************************
 * for getting the last batch number which is stored in custom record set
 * 
 * 1.1.4 - 19 mar 2013 - created -	Created a function to get last batch number which stored in the custom record set - SA
 *********************************************************************************************************************/
function getBatchNumber()
{
	try
	{
		locationIntId = genericSearch('customrecord_ppsbatchrecords', 'custrecord_batchrecordlocation', location);
		
		if(locationIntId != null)
		{
			customRecord = nlapiLoadRecord('customrecord_ppsbatchrecords', locationIntId);
			batchNumber = customRecord.getFieldValue('custrecord_batchrecord_lastbatchnumber');
			lastPPSRecordInternalId = customRecord.getFieldValue('custrecord_lastppsrecordinternalid');
			batchNumber = parseInt(batchNumber, 0);
			batchNumber = batchNumber + 1;    //  to add 1 to the last batch number . e.g if last batch number is 000001 then, new batch number should be  starting from 000002
		}
	}
	catch(e)
	{
		errorHandler('getBatchNumber', e);
	}
}


/*******************************************************************************************************************
 * for each order allocate a box number and batch number
 * box numbers 1-10 allocated, once 10th box allocated
 *******************************************************************************************************************/
function allocateBoxBatchNumber()
{ 

	try
	{

		batchNumber= parseInt(batchNumber,0);

		if(tranID != tempOrderNo)
		{
			boxNumber = boxNumber + 1;
			tempOrderNo = tranID;

		}

		if(boxNumber > batchSize)
		{
			boxNumber = 1;
			batchNumber = batchNumber + 1;

		}

	}
	catch(e)
	{
		errorHandler('allocateBoxBatchNumber', e);
	}	
}

/***********************************************************************************************************************
 * for storing the last batch number in the custom records set
 * 
 * 1.1.5 - 19 mar 2013 - function to store the last batch number in the custom record set - SA
 * 1.2.1 extract and save start and end batch numbers to custom record - MJL
 ***********************************************************************************************************************/
function storeLastBatchNumber()
{
	var batchNumberRecord = null;
	var startBatch = 0;
	var endBatch = 0;

	try
	{

		if (newPPSRecordInternalID != 0)
		{
			customRecord.setFieldValue('custrecord_lastppsrecordinternalid', newPPSRecordInternalID);
			customRecord.setFieldValue('custrecord_batchnumbersgenerated', batchNumbersGenerated);

			//1.2.1 Extract newly generated start and end batch numbers - MJL
			startBatch = getStartEndBatchNumbers(batchNumbersGenerated, 'start');
			endBatch = getStartEndBatchNumbers(batchNumbersGenerated, 'end');

			//1.2.1 save start and end batch numbers to custom record - MJL
			customRecord.setFieldValue('custrecord_reportbatchstart', startBatch);
			customRecord.setFieldValue('custrecord_reportbatchend', endBatch);	
		}

		customRecord.setFieldValue('custrecord_batchrecord_lastbatchnumber', batchNumber);
		batchNumberRecord = nlapiSubmitRecord(customRecord, true);
	}
	catch(e)
	{
		errorHandler('storeLastBatchNumber', e);
	}
}

/**
 * get Quantity on Hand by Location - runs a saved search to find
 * 
 * 1.2.5 added - MJL
 */
function getQuantityOnHand(location, itemIntId)
{
	var criteria = null;
	var searchLines = null;
	var runSearch = null;
	var onHand = 0;
	var itemLocation = 0;

	// get soonest reveive by/due date from PO for that item -- customsearch_oosnextpo -- needs to be filtered by item and we need earliest date 

	try
	{
		loadSearch = nlapiLoadSearch('item', 'customsearch_stockonhand');

		//filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];

		criteria = [['inventorylocation.internalid', 'is', location], 'and', ['internalid', 'is', itemIntId]];

		loadSearch.setFilterExpression(criteria);

		// Running the loaded search
		runSearch = loadSearch.runSearch();

		// Getting the first 10 results
		searchLines = runSearch.getResults(0, 10);
		nlapiLogExecution('DEBUG', 'getQuantityOnHand: searchLines.length', searchLines.length);
		
		if (searchLines) 
		{
			itemLocation = searchLines[0].getValue('inventorylocation');

			if (itemLocation == location)
			{
				onHand = searchLines[0].getValue('locationquantityonhand');
			}
		}
	}
	catch(e)
	{
		errorHandler("getQuantityOnHand", e);
	}
	return onHand;
}
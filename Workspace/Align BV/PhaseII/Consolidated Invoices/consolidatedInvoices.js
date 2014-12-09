/*****************************************************************************
 *	Name		:	consolidatedInvoices
 *	Script Type	:	Scheduled 
 *	Client		: 	Align BV
 *
 *	Version		:	1.0.0 - 15/03/2013  First Release - AS
 *					1.0.1 - 04/04/2013 - Setting the dates according to the Script deployment parameter - AS
 *					1.0.2 - 03/05/2013 - Setting the filters for excluding the 'consolidated' and 'for consolidation' sales orders - AS
 *									   - Setting the description, Additional Description, SO References - AS
 *					1.0.3 - 12/06/2013 - Additional filter for approved sales orders (i.e. they are pendingfulfilment) + pass tax code to consolidated
 *										 lines - JM
 *					1.0.4 - 25/06/2013 - changing the soTotal to suBTotal to get the total of 'ForConsolidation' Sales Orders - AS
 *					
 * 	Author		:	FHL 
 * 	Purpose		:	To create consolidated invoices
 * 
 * 	Script		: customscript_consolidated_invoices	
 * 	Deploy		: customdeploy_consolidated_invoices_cus,customdeploy_consolidated_invoice_ss
 * 
 * 	Library		: Library.js
 * 
 **********************************************************************/
//Declaring global variables
var context = null;
var savedSearch = null;
var soMainFilters = new Array();
var customer = '';
var dateFrom = null;
var dateTo = null;
var testing = null;
var currency = null;

var soNumber = 0;					//sales order reference
var soMainColumns = new Array();
var soMainResults = new Array();
var subTotal = 0;
var schedule = null;
var scheduleDaily = null;				
var scheduleMonthly = null;
var scheduleWeekly = null;


var fxAmount = 0;
var discountTotal = 0;
var fxDiscountTotal = 0;
var taxTotal = 0;
var fxTaxTotal = 0;
var amount = 0;
var fxRate = 0;
var calcTotal = 0 ; 
var discountRate = 0.0;
var consolidatedSoRecord  = null;
var salesRecord = null;
var patientNumber = '';

var totalTaxRate = 0;
var totalDiscountRate = 0;
var lineCount = 0;
var averageTaxRate = 0;

var newCurrency = null;
var soTotal = 0.00;

var forConsolidationSoTotal = 0.00;
var consolidatedTotal = 0.00;
var soNumbersArray = new Array();
var submittedConsolidatedRecord = null;

var CONSOLIDATEDORDERITEM = 0;							
var CONSOLIDATEDDISCOUNTITEM = 0;						
var ORDERTYPE = 0; 		
var FORCONORDERTYPE = 0;

var today = new Date();

var soIntId = 0;
var salesOrderLineItems = '';

var taxRatePC = 0; 
var taxCode = 0; 


//[TODO] - solve the rounding issue
/***************************************************************************
 * 
 * consolidateSalesOrders Function - The main function
 * 
 **************************************************************************/
function consolidatedInvoices()
{

		//Calling initialise function
		initialise();
	
		if(customer != null)
		{
			setSoMainFilters(customer);		// filters, gets data and creates con sales orders
		}
	
		if(savedSearch != null)
		{
			//getting the saved search results by 1000 records
			//each one of these - filters, gets data and creates con sales orders
			getSavedSearchResults(0,1000);
			getSavedSearchResults(1000,2000);
			getSavedSearchResults(2000,3000);
			getSavedSearchResults(3000,4000);
			getSavedSearchResults(4000,5000);
			getSavedSearchResults(5000,6000);
			getSavedSearchResults(6000,7000);
			getSavedSearchResults(7000,8000);
			
		}
		

}




/**********************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * 
 **********************************************************************/
function initialise()
{ 
	try
	{
		CONSOLIDATEDORDERITEM = genericSearch('item', 'name', 'Consolidated Order Item');						//getting the internal id of the 'Consolidated Order Item' which represents the 'for consolidation' SO
		CONSOLIDATEDDISCOUNTITEM = genericSearch('item', 'name', 'For Consolidation Sales Order Discount');		//getting the internal id of the 'For Consolidation Sales Order Discount' which represents the 'for consolidation' SO's  discount
		ORDERTYPE = genericSearch('customlist_ordertype','name','Consolidated');								//getting internal id of the 'consolidated' from the custom list called 'Order Type'

		FORCONORDERTYPE = genericSearch('customlist_ordertype','name','For Consolidation');						//getting internal id of the 'for consolidation' from the custom list called 'Order Type'
																	   
		//getting the context
		context = nlapiGetContext();
		
		//calling the getParameters function
		getParameters();
	}
	catch(e)
	{
		errorHandler('initialise :', e);
	}
}



/**********************************************************************
 * getParameters Function - get the script parameters that are passing from 
 * 								the consolidatedInvoicesInterface suitelet
 * 
 * version 1.0.1 - 04/04/2013 - Setting the dates according to the Script deployment parameter
 **********************************************************************/
function getParameters()
{ 
	var scriptedSchedule = '';
	
	try
	{
		//getting the script parameters
		savedSearch = context.getSetting('SCRIPT', 'custscript_cisavedsearch');			//saved search internal id ('Customer Group' field)
		customer = context.getSetting('SCRIPT', 'custscript_cicustomer');				// customer internal id (Customer Field)
		dateFrom = context.getSetting('SCRIPT', 'custscript_cidatefrom');				// date from ('Date From' field)
		dateTo = context.getSetting('SCRIPT', 'custscript_cidateto');					//date to ('Date To' field)
		testing = context.getSetting('SCRIPT', 'custscript_citesting');					//testing ('Testing'  checkbox)
		schedule = context.getSetting('SCRIPT', 'custscript_schedule');					// schedule ('Schedule' radio button)
		
		scriptedSchedule = context.getSetting('SCRIPT', 'custscript_scriptedschedule');	// 'Scripted schedule' script parameter in the script record
		
		//version 1.0.1 
		calculateAndSetDatesDependOnDepParaSchedule(scriptedSchedule);
		
	}
	catch(e)
	{
		errorHandler('getParameters :', e);
	}
}




/************************************************************
 * calculateAndSetDatesDependOnDepParaSchedule function - calculate and set the dates depends on the scheduled script parameter values
 * 
 * @param scriptedScheduleID  - internal id of the parameter called 'schedule' (radio button)
 * 
 ************************************************************/
function calculateAndSetDatesDependOnDepParaSchedule(scriptedScheduleID)
{
	var calcDateFrom = null;
	var scriptedScheduleName = '';
	
	try
	{
		if(scriptedScheduleID == null)
		{
			scriptedScheduleName = '';
		}
		else
		{
			//getting the name of the scripted schedule
			scriptedScheduleName = nlapiLookupField('customlist_schedulelist', scriptedScheduleID, 'name');
			
		}
		
		//checking through the radio button name (schedule parameter)
		switch (scriptedScheduleName)
		{
			case 'Schedule Daily':
				calcDateFrom  = nlapiAddDays(today, 0);				//calculate the 'Date From' by deducting 0 days from today
				dateTo = jsDate_To_nsDate(today);					//converting the dateTo to NetSuite date format
				dateFrom = jsDate_To_nsDate(calcDateFrom);			//converting the date to NetSuite date format

			break;

			case 'Schedule Weekly':
				calcDateFrom  = nlapiAddDays(today, -6);			//calculate the 'Date From' by deducting six days from today
				dateTo = jsDate_To_nsDate(today);					//converting the dateTo to NetSuite date format
				dateFrom = jsDate_To_nsDate(calcDateFrom);			//converting the date to NetSuite date format

			break;

			case 'Schedule Monthly':									
				calcDateFrom  = nlapiAddMonths(today,-1);			//calculate the 'Date From' by deducting one month from today
				dateTo = jsDate_To_nsDate(today);					//converting the dateTo to NetSuite date format
				dateFrom = jsDate_To_nsDate(calcDateFrom);			//converting the date to NetSuite date format
			break;

			default:

			break;
		}
		
	
	}
	catch(e)
	{
		errorHandler('calculateAndSetDatesDependOnDepParaSchedule : ', e);
	}
	
	
}


/**********************************************************************
 * getSavedSearchResults Function - run and get the parametered saved search's results
 * 
 * @param startingPoint	- starting record number
 * @param endingPoint	- ending record number		
 **********************************************************************/
function getSavedSearchResults(startingPoint, endingPoint)
{
	//Declaring the local variables
	var loadedSearch = null;
	var resultsSet = null;
	var searchResults = null;
	var savedSearchResultIntId = 0 ;
	
	try
	{
		loadedSearch = nlapiLoadSearch('customer', savedSearch);					//load saved Search
		resultsSet = loadedSearch.runSearch();										//run loaded saved search
		searchResults = resultsSet.getResults(startingPoint, endingPoint);			//get saved search results
	
		//if there are any result
		if(searchResults != null)
		{
			//iterating through the search results
			for(var i = 0 ; i < searchResults.length; i++)
			{
				if(i == 500)
				{
					setRecoveryPoint();
				}
				
				checkGovernance();													//Calling the checkGovernance function to check the script usage limit
				
				savedSearchResultIntId = searchResults[i].getValue('internalid');	//getting the internal ID
	
				//re-initialising the global variables to default values 
				currency = null;
				newCurrency = null;
				forConsolidationSoTotal = 0.00;
					
				setSoMainFilters(savedSearchResultIntId);							//setting the filters for retrieving the sales orders for consolidation	
									
			}
		
		}

	}
	catch(e)
	{
		errorHandler("getSavedSearchResults : " ,e);
	} 
		
}


/**********************************************************************
 * setSoMainFilters Function - setting the filters and columns for searching the sales orders
 *  
 *
 *
 * SalesOrd:A = Pending Approval
 * SalesOrd:B = Pending Fulfillment
 * SalesOrd:C = Cancelled
 * SalesOrd:D = Partially Fulfilled
 * SalesOrd:E = Pending Billing/Partially Fulfilled
 * SalesOrd:F = Pending Billing
 * SalesOrd:G = Billed
 * SalesOrd:H = Closed
 *
 * @param {recordInternalId} - customer internal ID retrieved from the script parameters
 *
 * version 1.0.2 - 03/05/2013 - Setting the filters for excluding the 'consolidated' and 'for consolidation' sales orders - AS
 *		   1.0.3 - 12/06/2013 - Additional filte for approved sales orders (i.e. they are pendingfulfilment)  							
 **********************************************************************/
function setSoMainFilters(recordInternalId)
{ 
	var soFilterIndex = 0;
	
	try
	{
		customer = recordInternalId;
		
		//setting filters for sales orders
		// version 1.0.2
		// [TODO] check this backslash issue report back AS
//		soMainFilters[soFilterIndex++] = new nlobjSearchFilter('status', null, 'noneof', 'SalesOrd:B','\SalesOrd:C');
		
		soMainFilters[soFilterIndex++] = new nlobjSearchFilter('status', null, 'is', 'SalesOrd:B');
		soMainFilters[soFilterIndex++] = new nlobjSearchFilter('mainline', null, 'is','T');	
		soMainFilters[soFilterIndex++] = new nlobjSearchFilter('custbody_ordertype', null, 'noneof',ORDERTYPE,FORCONORDERTYPE);				//for consolidation and consolidated excluded
		
		if(dateFrom != null && dateTo != null)
		{
			soMainFilters[soFilterIndex++] = new nlobjSearchFilter('trandate', null, 'within',dateFrom,dateTo);	
		}
		
		//getting only the customers resulted from saved search
		soMainFilters[soFilterIndex++] = new nlobjSearchFilter('entity', null, 'is',customer);
		
		//setting columns for sales orders
		soMainColumns[0] = new nlobjSearchColumn('internalid');		//getting internal id of the sales order
		soMainColumns[1] = new nlobjSearchColumn('tranid');			//getting order number of the sales order
		soMainColumns[2] = new nlobjSearchColumn('fxamount');		//getting foreign currency amount of the sales order
		soMainColumns[3] = new nlobjSearchColumn('taxtotal');		//getting tax total of the sales order
		soMainColumns[4] = new nlobjSearchColumn('amount');			//getting amount of the sales order
		soMainColumns[5] = new nlobjSearchColumn('trandate');		//getting transaction date of the sales order
		soMainColumns[6] = new nlobjSearchColumn('total');			//getting total of the sales order
		soMainColumns[7] = new nlobjSearchColumn('custbody_patientnumber');			//getting patient Number of the sales order
		
		
		//========================================================================
		// get the data for the consolidation and create the consolidate invoice
		//========================================================================
		getSalesOrdersMainFieldsAndCreateConsolidatedInvoice();		
		
	}
	catch(e)
	{
		
		errorHandler("loadSalesOrders : ", e);
	}

}


/**********************************************************************
 * getSalesOrdersMainFieldsAndCreateConsolidatedInvoice Function - 
 * 			searching the sales orders according to the filters 
 *  			and get the body fields of particular sales order, and create the consolidated invoice
 *   
 **********************************************************************/
function getSalesOrdersMainFieldsAndCreateConsolidatedInvoice()
{

	try
	{
		
		//getting the sales orders using the filters and the columns
		soMainResults = nlapiSearchRecord('salesorder', null, soMainFilters, soMainColumns);
	
		//if there are results
		if(soMainResults != null)
		{
			
			//========================================================================
			// create the consolidated invoice header details
			//========================================================================
			createConsolidatedSoMainFields();								//creating consolidated sales order's main fields
			
			for(var i = 0; i < soMainResults.length; i++)
			{
				soIntId = soMainResults[i].getValue(soMainColumns[0]);		//internal id
				soNumbersArray[i] = soIntId;								//passing the so's internal ID to an array
				
				soNumber = soMainResults[i].getValue(soMainColumns[1]);		//transaction id
				
				fxAmount = soMainResults[i].getValue(soMainColumns[2]);		//foreign currency amount#
				amount = soMainResults[i].getValue(soMainColumns[4]);		//main currency amount
				
				taxTotal = soMainResults[i].getValue(soMainColumns[3]);		//tax total
				soTotal = soMainResults[i].getValue(soMainColumns[6]);		//total
				
				patientNumber = soMainResults[i].getValue(soMainColumns[7]);	//patient number
				
				//========================================================================
				// loading sales order to get sales order's line item fields and other body fields 
				// that cannot be retrieved without loading the SO
				//========================================================================
				loadSalesOrder(soIntId);			
				
				if(currency == newCurrency || currency == null)
				{
					//========================================================================
					// create the consolidated invoice line items for sales orders
					//========================================================================
					calculateValues();										//calculating the values
					createConsolidatedSOItemLines(i);						//creating consolidated sales order's line items
										
					if(discountRate != null)
					{
						//========================================================================
						// create the consolidated invoice line items for discounts
						//========================================================================
						createConsolidatedSODiscountItemLines(i);			//create discount line items if there is a discount rate in the sales order
					}
					
					totalTaxRate = 0.0;						
					
				}
			}

			consolidatedSoRecord.setFieldValue('currency', newCurrency);						//setting the currency consolidated sales order
			submittedConsolidatedRecord = nlapiSubmitRecord(consolidatedSoRecord,false);		//submitting the consolidated sales order
			
			validateCSOCreation();						//validate consolidated sales order creation
		}
		//if no results
		else
		{
			nlapiLogExecution('audit', 'getSalesOrdersMainFields results', 'No Results');
		}
	}
	catch(e)
	{
		errorHandler("getSalesOrdersMainFields : ", e);
	}

}


/**********************************************************************
 * loadSalesOrder Function - Load particular sales order to get the line items
 *  
 * @param soInternalID - Internal id of the sales order to be loaded
 **********************************************************************/
function loadSalesOrder(soInternalID)
{ 
	
	try
	{
		// initialising the global variable back to default (Reason : line items and sub total should be retrieved for particular sales order only)
		salesOrderLineItems = ''; 											
		subTotal = 0;
		
		salesRecord = nlapiLoadRecord('salesorder', soInternalID);			//loading particular sales order
		
		discountRate = salesRecord.getFieldValue('discountrate');			//getting discount rate
		currency = newCurrency;												//setting the new Currency as the currency
		newCurrency = salesRecord.getFieldValue('currency');				//get the currency of the particular SO
		
		lineCount = salesRecord.getLineItemCount('item');					//get item line item count 
		
		if(lineCount > 0)
		{
			for(var lineNo = 1; lineNo <= lineCount; lineNo++)
			{
				getSoLineFields(lineNo);									//getting line item values of the particular sales order
				
			}
		}
		
	}
	catch(e)
	{
		errorHandler("loadSalesOrder : ", e);
	}

}


/**************************************************************
 * getSoLineFields - getting the items and amount of sales Order line fields and calculate the subtotal
 * (Reason - cannot get the subtotal of the whole sales order by using 'subtotal' internal id)
 * 
 * 1.0.3 pull through taxcode and rate also
 * 
 * @param record - the loaded sales order record
 * @param lineNumber - the line number
 *							
 *************************************************************/
function getSoLineFields(lineNumber)
{
	var itemAmount = 0;
	var taxRate = 0;
	var item = '';
	
	try
	{
		item = salesRecord.getLineItemText('item', 'item', lineNumber);					//getting the line item's name
		itemAmount = salesRecord.getLineItemValue('item', 'amount', lineNumber);		//getting the line item's amount
		taxRate = salesRecord.getLineItemValue('item', 'taxrate1', lineNumber);			//getting the item's tax rate 
		// 1.0.3 pull through taxcode
		taxCode = salesRecord.getLineItemValue('item', 'taxcode', lineNumber);	 
		
		if(itemAmount == null)
		{
			itemAmount = 0.0;
		}
		
		if(taxRate == null)
		{
			taxRate = 0.0;
		}
		
		//calculating the sub total 
		subTotal = parseFloat(subTotal) + parseFloat(itemAmount);
		subTotal = convertToFloat(subTotal);									//passing the subtotal to a float value to avoid errors
		
		totalTaxRate = parseFloat(taxRate) + parseFloat(totalTaxRate);
		totalTaxRate = convertToFloat(totalTaxRate);							//passing the subtotal to a float value to avoid errors
		averageTaxRate = totalTaxRate / lineCount;								//calculating the average tax rate

		
		//concatenating the items in the sales order
		salesOrderLineItems += item + '\n';

	}
	catch(e)
	{
		errorHandler('getSoLineFields ', e);
	}

}



/**********************************************************************
 * calculateValues Function - calculate the subtotal, discount total, tax total and total
 * version 1.0.4 - changing the soTotal to suBTotal to get the total of 'ForConsolidation' Sales Orders
 **********************************************************************/
function calculateValues()
{
	try
	{
		//converting the field values to float values
		fxAmount = convertToFloat(fxAmount);
		amount = convertToFloat(amount);

		fxRate = fxAmount / amount;
		fxRate = convertToFloat(fxRate);

		if(discountRate != null)
		{
			discountRate = convertToFloat(discountRate);	
			//totalDiscountRate = parseFloat(totalDiscountRate) + parseFloat(discountRate);
			
			discountTotal = subTotal * discountRate ; 									//calculating the Total discount amount				
			discountTotal = convertToFloat(discountTotal);			
		
		}

		if(discountTotal == null)
		{
			discountTotal = 0.0;
		}


		if(taxTotal == null)
		{
			taxTotal = 0.0;
		}
		
		taxTotal = convertToFloat(taxTotal);
		fxTaxTotal = taxTotal * fxRate;															//calculating the tax total in foreign currency amount
		fxTaxTotal = convertToFloat(fxTaxTotal);

		//calcTotal = subTotal + fxDiscountTotal + fxTaxTotal;									//calculating the total amount
		//calcTotal = convertToFloat(calcTotal);

		//version 1.0.4
		forConsolidationSoTotal = parseFloat(forConsolidationSoTotal) + parseFloat(subTotal);	//calculating the consolidated sales order's total
		forConsolidationSoTotal = convertToFloat(forConsolidationSoTotal);
		
		nlapiLogExecution('audit', 'sub total',subTotal);
		nlapiLogExecution('audit', 'discount total',discountTotal);
		nlapiLogExecution('audit', 'tax total', fxTaxTotal);
		nlapiLogExecution('audit', 'calc total', calcTotal);
		
		nlapiLogExecution('audit', 'calculateValues forConsolidationSoTotal', forConsolidationSoTotal);
		
	
	}
	catch(e)
	{
		errorHandler("calculateData : ", e);
	}

}



/**********************************************************************
 * createConsolidatedSoMainFields Function - create consolidated sales orders and set the body field values
 *   
 **********************************************************************/
function createConsolidatedSoMainFields()
{
	var reverseDate = '';
	
	try
	{
		reverseDate = jsDate_To_nsDate_Reverse(today);
		consolidatedSoRecord = nlapiCreateRecord('salesorder');							//creating the consolidated sales order
		consolidatedSoRecord.setFieldValue('entity', customer);							//setting the customer
	
		//consolidatedSoRecord.setFieldValue('customform', columnNameValueIntId);
	
		consolidatedSoRecord.setFieldValue('orderstatus', 'A');							//pending approval
		consolidatedSoRecord.setFieldValue('custbody_ordertype', ORDERTYPE);			//consolidated
		consolidatedSoRecord.setFieldValue('custbody_consolidatedref', reverseDate);	 		
		 
	}
	catch(e)
	{
		errHandler('createConsolidatedSoMainFields : ', e);
	}


}


/**********************************************************************
 * createConsolidatedSOLines Function - set the line item values of the consolidated sales orders representing the 'for consolidation' SOs
 * 
 * @param linNumber - particular line item's line number 
 * 
 * version 1.0.2 - Setting the description, Additional Description, SO References - AS
 **********************************************************************/
function createConsolidatedSOItemLines(lineNumber)
{
	try
	{
		var amount = 0;
		var quantity = 1;
		
		amount = subTotal * quantity ; 					//calculating amount for consolidated SO's line item
		
		//version 1.0.2
		consolidatedSoRecord.selectNewLineItem('item');
		consolidatedSoRecord.setCurrentLineItemValue('item', 'item', CONSOLIDATEDORDERITEM);						
		consolidatedSoRecord.setCurrentLineItemValue('item', 'description','Patient Number :' +patientNumber);
		consolidatedSoRecord.setCurrentLineItemValue('item', 'quantity',quantity );
		consolidatedSoRecord.setCurrentLineItemValue('item', 'rate',subTotal );
		consolidatedSoRecord.setCurrentLineItemValue('item', 'amount', amount);
	//	consolidatedSoRecord.setCurrentLineItemValue('item', 'taxrate1', averageTaxRate);
		
		consolidatedSoRecord.setCurrentLineItemValue('item', 'taxcode', taxCode);

		consolidatedSoRecord.setCurrentLineItemValue('item', 'tax1amt', fxTaxTotal);
		consolidatedSoRecord.setCurrentLineItemValue('item', 'custcol_sourcesoref',	soIntId);					//source sales order reference
		consolidatedSoRecord.setCurrentLineItemValue('item', 'custcol_additionaldescription','The Line Items in Source Sales Order are : \n' +salesOrderLineItems);
		
		consolidatedSoRecord.commitLineItem('item');
	}
	catch(e)
	{
		errorHandler('createConsolidatedSOItemLines : ', e);
	}
}


/**********************************************************************
 * createConsolidatedSODiscountItemLines Function - set the line item values of the consolidated sales orders representing the 'for consolidation' SO's discount
 * 
 * @param linNumber - particular line item's line number 
 * 
 * version 1.0.2 - Setting the description, Additional Description, SO References - AS
 **********************************************************************/
function createConsolidatedSODiscountItemLines(lineNumber)
{
	var discountValue = 0;
	var amount = 0;
	var quantity = 1;
	
	try
	{

		discountValue = subTotal * quantity * discountRate/100; 					//calculate the discount amount for whole old sales order
		discountValue = convertToFloat(discountValue);
		
		//version 1.0.2
		//setting the discount of the old sales order as a new line item in the consolidated sales order
		consolidatedSoRecord.selectNewLineItem('item');						
		consolidatedSoRecord.setCurrentLineItemValue('item', 'item', CONSOLIDATEDDISCOUNTITEM);														
		consolidatedSoRecord.setCurrentLineItemValue('item', 'description','Patient Number :' +patientNumber);
		consolidatedSoRecord.setCurrentLineItemValue('item', 'quantity',quantity );
		consolidatedSoRecord.setCurrentLineItemValue('item', 'amount', discountValue);
		consolidatedSoRecord.setCurrentLineItemValue('item', 'custcol_sourcesoref',	soIntId);
		
		consolidatedSoRecord.commitLineItem('item');
	}
	catch(e)
	{
		errorHandler('createConsolidatedSODiscountItemLines : ', e);
	}
}



/**********************************************************************
 * validateCSOCreation Function - validate consolidated sales order creation and close the child sales orders
 *  
 **********************************************************************/
function validateCSOCreation()
{
	try
	{
		if(submittedConsolidatedRecord != null)
		{
			getConsolidatedTotal();											//getting the total of the consolidated sales order in order to compare the values of the sales orders that has been consolidated.	

			nlapiLogExecution('audit', 'getSalesOrdersMainFields consolidated Total', consolidatedTotal );
			nlapiLogExecution('audit', 'getSalesOrdersMainFields for consolidated Total', forConsolidationSoTotal );

			closeOldSalesOrder();											//close the old sales orders after creating the consolidated sales order representing the particular SO
		}
	}
	catch(e)
	{
		errorHandler('validateCSOCreation :', e);
	}

}




/**********************************************************************
 * getConsolidatedTotal Function - get the total of the consolidated sales order
 *  
 **********************************************************************/
function getConsolidatedTotal()
{
	var loadConsolidatedRecord = null;
	
	try
	{
		//load the consolidated sales order 
		loadConsolidatedRecord = nlapiLoadRecord('salesorder', submittedConsolidatedRecord);
		consolidatedTotal = loadConsolidatedRecord.getFieldValue('total');						//get the total
		consolidatedTotal = convertToFloat(consolidatedTotal);									//convert the total into a float value
		
	}
	catch(e)
	{
		errorHandler('getConsolidatedTotal : ', e);
	}

}



/**********************************************************************
 * closeOldSalesOrder Function - close all the child sales orders
 *  
 **********************************************************************/
function closeOldSalesOrder()
{
	
	var lineCountNumber = 0;
	var closedSalesOrder = 0;
	var loadSalesOrder = null;
	var soId = 0;
	
	try
	{
		//if testing check box is not ticked and the total of consolidated sales order and the total of the child sales orders are equal
		if((testing != 'T' ) && (forConsolidationSoTotal == consolidatedTotal))
		{
			for(var i = 0; i < soNumbersArray.length; i++ )
			{
				soId = soNumbersArray[i];
				
				/*
				 * in order to close the child SOs, the each line item should be closed. without loading the child SO, 
				 * the line items cannot be edited.
				 */
				loadSalesOrder = nlapiLoadRecord('salesorder', soId);											//loading particular child sales order
				
				lineCountNumber = loadSalesOrder.getLineItemCount('item');										//getting the line item count of the child SO
				
				//going through the line items
				for(var lineNumber = 1 ; lineNumber <= lineCountNumber; lineNumber++)
				{
					loadSalesOrder.selectLineItem('item', lineNumber);											//select the line item to be closed
					loadSalesOrder.setCurrentLineItemValue('item', 'isclosed', 'T');							//setting the 'closed' line item field to true (closing the line item)
					loadSalesOrder.commitLineItem('item');														//submit the line item
				}
				
				loadSalesOrder.setFieldValue('custbody_consolidatedsoref', submittedConsolidatedRecord);		//set the reference of the consolidated sales order on the source sales order
				loadSalesOrder.setFieldValue('custbody_ordertype', FORCONORDERTYPE);							//mark the order as being used for consolidation
				loadSalesOrder.setFieldValue('status', 'SalesOrd:C');											//setting the whole sales order's status to 'Closed'

				closedSalesOrder = nlapiSubmitRecord(loadSalesOrder, false);									//submit the sales order
			}
		}
		
	}
	catch(e)
	{
		errorHandler('closeOldSalesOrder : ', e);
	}
}




/**********************************************************************
 * checkGovernance Function -  check the script usage limit and rescheduling the script 
 *  
 **********************************************************************/
function checkGovernance()
{
	var USAGELIMIT = 800;
	var state = '';
	
	try
	{
		if( context.getRemainingUsage() < USAGELIMIT )
		{
			state = nlapiYieldScript();

			if( state.status == 'FAILURE')
			{
				nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
				throw "Failed to yield script";
			} 
			else if ( state.status == 'RESUME' )
			{
				nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
			}
			// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
		}
	} 
	catch(e)
	{
		errorHandler('checkGovernance : ', e);
	}
}




/**********************************************************************
 * setRecoveryPoint Function - setting the recovery point if an unspected error occured when getting the results
 * The script will resume from this point after the error 
 *  
 **********************************************************************/
function setRecoveryPoint()
{
	var state = nlapiSetRecoveryPoint(); //100 point governance
	var retVal = '';
	try
	{
		if( state.status == 'SUCCESS' )
		{
											//successfully create a new recovery point
		}

		if( state.status == 'RESUME' ) 		//a recovery point was previously set, hence resuming due to some unforeseen error
		{
			nlapiLogExecution("ERROR", "Resuming script because of " + state.reason+".  Size = "+ state.size);
			handleScriptRecovery();
		}
		else if ( state.status == 'FAILURE' )  //failed to create a new recovery point
		{
			nlapiLogExecution("ERROR","Failed to create recovery point. Reason = "+state.reason + " / Size = "+ state.size);
			handleRecoveryFailure(state);
		}
	}
	catch(e)
	{
		errorHandler('setRecoveryPoint : ', e);
	}
	
	return retVal;
}
 


/**********************************************************************
 * handleRecoverFailure Function - handle the recovery failure 
 *  
 **********************************************************************/
function handleRecoverFailure(failure)
{
	var failureReason = failure.reason;
	try
	{
		switch(failureReason)
		{
		case 'SS_MAJOR_RELEASE':
			throw "Major Update of NetSuite in progress, shutting down all processes";
			break;

		case 'SS_CANCELLED':
			throw "Script Cancelled due to UI interaction";
			break;

		case 'SS_EXCESSIVE_MEMORY_FOOTPRINT':
			setRecoveryPoint();
			break;

		case 'SS_DISALLOWED_OBJECT_REFERENCE':
			throw ("Could not set recovery point because of a reference to a non-recoverable object: "+ failure.information); 
			break;
		}

	}	
	catch(e)
	{
		errorHandler('handleRecoverFailure : ', e);
	}
}




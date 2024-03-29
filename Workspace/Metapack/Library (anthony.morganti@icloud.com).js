/*******************************************************
 * Name:		Library
 * Script Type:	Library
 *
 * Version:	1.0.0 - 09/04/2013 - Created - AS
 * 			1.0.1 - 09/04/2013 - genericSearchReturnAnyField function added - AS
 * 							   - convertToFloat function added - AS
 * 			1.0.2 - 05/05/2013 - searchShippingLookupRecord function added - AS
 *
 * Author:	FHL
 * Purpose:	To share useful functionality amongst the company
 *******************************************************/

/**
 * Compares two dates and checks if the departure date is greater than the return date.
 * @governance 0.
 *
 * @param  {date}    	    The departure or start date.
 * @param  {date}	        The return or finish date.
 * @return {invalidDate}     Returns 0 or -1 depending on if the check was successful or not.
 *
 * @since  2012
 */

var searchResults = null;
var searchResult = null;
var shipCountry = '';
var vatNo = '';



function checkDate(departDate,returnDate)
{
	try
	{
		nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: depart date', departDate);
		nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: return date', returnDate);

		var dateCheckDepart = nlapiStringToDate(departDate);
		var dateCheckReturn = nlapiStringToDate(returnDate);

		var invalidDate = 0;

		var datDepart = Date.parse(dateCheckDepart);
		var datReturn = Date.parse(dateCheckReturn);

		if(datDepart > datReturn)
		{
			invalidDate = 1;
			nlapiLogExecution('DEBUG', '***RETURN IS BEFORE DEPART****');
		}

		nlapiLogExecution('DEBUG', 'depart date', datDepart);
		nlapiLogExecution('DEBUG', 'return date', datReturn);

		return invalidDate;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Check date function encountered an error: ', e.message);

		return 0;
	}

}

/**
 * Finds the difference between 2 dates in unix time and then returns this in a integer whole number.
 * @governance 0.
 *
 * @param  {date}    	    The departure or start date.
 * @param  {date}	        The return or finish date.
 * @return {invalidDate}     Returns the number of days between the two dates.
 *
 * @since  2012
 */


//sample usage
//var sDate= '12/12/2011';
//var eDate = '13/12/2014';

//a=daysBetween(sDate,eDate);

function daysBetween(date1, date2) {

	var first= nlapiStringToDate(date1);
	var second= nlapiStringToDate(date2);

	// Copy date parts of the timestamps, discarding the time parts.
	var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
	var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

	// Do the math.
	var millisecondsPerDay = 1000 * 60 * 60 * 24;
	var millisBetween = two.getTime() - one.getTime();
	var days = millisBetween / millisecondsPerDay;

	// Round down.
	return Math.floor(days);
}

function dateDiff(departDate, returnDate)
{
	try
	{
		nlapiLogExecution('DEBUG', 'depart date', departDate);
		nlapiLogExecution('DEBUG', 'return date', returnDate);

		var dateDiffRound = 0;

		var newDepartDate = nlapiStringToDate(departDate);
		var newReturnDate = nlapiStringToDate(returnDate);	

		var datDepart = Date.parse(newDepartDate);
		var datReturn = Date.parse(newReturnDate);

		nlapiLogExecution('DEBUG', 'datDepart: ' + datDepart);
		nlapiLogExecution('DEBUG', 'datReturn: ' + datReturn);

		var dateDifference = ((datReturn - datDepart)/(24*60*60*1000)-1);
		nlapiLogExecution('DEBUG', 'dateDifference', dateDifference);

		if(dateDifference > 0)
		{
			dateDiffRound = Round(dateDifference, 1);
			nlapiLogExecution('DEBUG', 'dateDiffRound', dateDiffRound);
		}
		else 
		{
			dateDiffRound = dateDifference;
		}


		return dateDiffRound;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'date diff function encountered the following error: ', e.message);

		return false;
	}
}

/**
 * Takes in a string of data and escapes any apostrophes in the string.
 * @governance 0.
 *
 * @param  {str}    	String input
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */

function escapeApos(str)
{
	str=str.replace("'","\\'");

	return str;
}

/**
 * Takes in strings that may be in a text field or have new line statements in them and escapes them
 * @governance 0.
 *
 * @param  {str}    	String input.
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */

function escapeNewLine(str)
{
	try
	{
		nlapiLogExecution('DEBUG','The string is: ' + str);
		str=str.replace(/\\n/gi, " ");
		nlapiLogExecution('DEBUG','**ESCAPED** The string is now: ' + str);
		return str;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG','Escape new line function had an error: ' + e.message);
		return false;
	}
}

/**
 * This function will manually escape a string escaping instances of line break and new line and replacing them with a whitespace. Use for converting a text area.
 * @governance 0.
 *
 * @param  {str}    	String input.
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */

function reduceString(str)
{
	str=str.replace(/\n/g,' ');
	str=str.replace(/\r/g,'');

	return str;
}

/*********************************************
 * To round 42.14446 to 3 decimal places, you execute toFixed(42.14446, 3). The return value will be 42.144.
 * To round it DOWN, you need to subtract 0.0005 (=42.14396). Executing the above would then return 42.143.
 * To round it UP, you ADD 0.0005 (=42.14496) which, as it would still not be to the next number, still return 42.144. 
 * @governance 0.
 *
 * @param  {value}   	The number being passed in.
 * @param  {precision}   How many decimal places this number should be fixed to.
 * @return {precision}   The rounded number is returned in its now fixed state
 *
 * @since  2011
 */

function toFixed(value, precision)
{
	try
	{
		var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
		return precision ? integral + '.' +  padding + fraction : integral;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Failed to fix the value', e.message);
		return value;
	}
}

/**
 * Takes in strings that may be in a text field or have new line statements in them and escapes them
 * @governance 
 * When used on standard transactions: 20
 * When used on standard non-transactions: 10
 * When used on custom records: 4
 *
 * @param  {record}    	record name string.
 * @param  {recID}    	record name string. 
 * @return {recID}       Re.
 *
 * @since  2011
 */

function submit(record, recID)
{
	var retVal = false;

	try 
	{
		nlapiSubmitRecord(record);
		nlapiLogExecution('DEBUG', 'Record submitted', recID);
		retVal = true;
	}

	catch(e) 
	{
		nlapiLogExecution('DEBUG', 'Record not submitted', e.message);
		retVal = false;
	}
	return retVal;
}

/**
 * Takes in a variable and prints it out to the NetSuite execution log 
 * DOES NOT WORK WITH CLIENT SCRIPTS
 * @governance 0
 *
 * @param  {debug}    	Variable value.
 * @return {NA}       	Returns true.
 *
 * @since  2012
 */

function dbc(debug)
{
	nlapiLogExecution('DEBUG', 'Debug check: ' + debug);

	return true;
}


/**
 * Loads a record for user event scripts
 * ONLY WORKs WITH USER EVENT SCRIPTS
 * @governance 0
 *
 * @return {NA}       	Returns the record.
 *
 * @since  2012
 */

function loadRecordUE()
{
	var recType = '';
	var record = null;
	var recID = 0;

	recType = nlapiGetRecordType();

	// load current record
	try
	{
		record = nlapiLoadRecord(recType, recID);
	}

	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Unsupported type', e.message);
	}

	return record;
}

//Removes white spaces before
function ltrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}

//Removes white spaces after
function rtrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/***********************************
 *  Gets the Fiscal Start Date in NetSuite Format
 ***********************************/

function getNSFiscalStartDate()
{	

	var NSFiscalStart = "";
	nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST');
	try
	{
		var Today = new Date();
		var StartDate = Today.getFullYear();

		if (Today.getMonth() >= 9)
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - >=9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + Today.getFullYear();
		}	 
		else
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - <9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + String(parseInt(Today.getFullYear()) - 1);
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'NSFiscalStart Error', e.message);
	}

	return NSFiscalStart;
}

/***********************************
 *  Gets the Fiscal End Date in NetSuite Format
 ***********************************/

function getNSFiscalEndDate()
{

	var Today = new Date();
	var EndDate = Today.getFullYear();
	var NSFiscalEnd = "";
	if (Today.getMonth() >= 9)
	{
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear() + 1);
	}	 
	else
	{
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear());
	}



	return NSFiscalEnd;
}

function thisyear()// returns the business year 
{
	var today = new Date();
	var year = today.getFullYear();

	if (today.getMonth() >= 10)	 
		year = today.getFullYear()+1;


	return year;

}

function isDateinRange(date,startdate,enddate)// checks if date is in the range of startdate/enddate 
{
	var input = dateConv(date,0);
	var start = dateConv(startdate,0);
	var end = dateConv(enddate,0);

	// Convert both dates to milliseconds
	var input_ms = input.getTime();
	var start_ms = start.getTime();
	var end_ms = end.getTime();

	if (input_ms>=start_ms && input_ms<=end_ms)
		return true;
	else
		return false;
}

function jsDate_To_nsDate(jsdate)// used for dateConv
{	  	
	var theDay = jsdate.getDate();
	var theMonth = jsdate.getMonth()+1;
	var theYear = jsdate.getFullYear();

	var nsdate = theDay+"/"+theMonth+"/"+theYear;

	return nsdate;

}

function nsDate_To_jsDate(nsdate)// used for dateConv 
{

	var dateStr = nsdate.split("/");  
	var theDay = dateStr[0];
	var theMonth = dateStr[1] - 1;
	var theYear = dateStr[2];    

	var jsdate= new Date(theYear ,theMonth ,theDay);
	return jsdate;

}

function dateConv(date,mode)//mode 0 = NetSuite to JS | mode 1 = JS to NetSuite 
{
	if (mode == 0)
		return nsDate_To_jsDate(date);

	if (mode == 1)
		return jsDate_To_nsDate(date);

}

function MessageBox(Data, Title)
{
	if(Title)
	{
		alert(Title + '\n\n' + Data);	
	}
	else
	{
		alert(Data);
	}

}



/**
 * lookupinvoice
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is',invoiceNo);                          
		invoiceSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');                      

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("lookupInvoice", e);
	}     	      

	return internalID;
}




/**********************************************************************
 * errorHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errorHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}




/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************
 *
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>!!!! DO NOT CALL THESE FUNCTIONS - THEY ARE EXAMPLES !!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * 
 *
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/


function listAllValuesEntity()
{
	var sCashSale = nlapiLoadRecord('customer', 715);

	var value;
	var itemVector = new Array();

	itemVector = sCashSale.getAllFields();

	for (var i = 0; i < itemVector.length; i++) 
	{
		value = sCashSale.getFieldValue(itemVector[i]);
		nlapiLogExecution('DEBUG', 'item fields '+itemVector[i]+' '+value);
	}

}

/**
 * list all values sub
 */

function listAllValues()
{
	var sCashSale = nlapiLoadRecord('cashsale', 9853);

	var value;
	var itemVector = new Array();

	itemVector = sCashSale.getAllLineItemFields('item');
	for (var i = 0; i < itemVector.length; i++) 
	{
		value = sCashSale.getLineItemValue('item', itemVector[i], 1);  // linenum 1 only
		nlapiLogExecution('DEBUG', 'item fields '+itemVector[i]+' '+value);
	}
}

function ProcessLoyaltyScheme(type)
{
	var currentContext = '';
	currentContext = nlapiGetContext();
	var usageRemaining = currentContext.getRemainingUsage();
	var TheRecord = '';
	var TheCurrentTXID = nlapiGetRecordId();
	var CurrentRecordType = '';

	if(TheCurrentTXID == -1)
	{
		nlapiLogExecution('ERROR', 'Current Transaction ID', 'Error: -1');
		return true;  //Don't stop it from saving...
	}

	CurrentRecordType = nlapiGetRecordType();


	nlapiLogExecution('DEBUG', 'Current Record ID and Type:', TheCurrentTXID  + ', ' + type);

	if(currentContext.getExecutionContext() != 'userinterface')
	{
		//we need it to work only on UserInterface for now...so silently allow it without processing.
		nlapiLogExecution('DEBUG', 'Execution Context:', currentContext.getExecutionContext());
		return true;
	}

	if(nlapiGetRole() == '3')
	{
		//only Administrator for now...
		nlapiLogExecution('DEBUG', 'Role Check: ', 'Administrator ');

	}
	else
	{
		//Non-administrator role can get lost for the time being.
		nlapiLogExecution('DEBUG', 'Role Issue','A non-administrator role ' );
		return true;
	}

	switch(type)
	{
	case 'create':
	case 'edit':
		break;
	default:
		//type is not supported here so just ignore it...
		nlapiLogExecution('DEBUG', 'Not Running', 'Unsupported type. Exiting script...');
	return true;
	}



	switch(CurrentRecordType.toString())
	{
	case 'salesorder':
	case 'cashsale':
		TheRecord = nlapiLoadRecord(CurrentRecordType, TheCurrentTXID);
		break;
	default:
		nlapiLogExecution('DEBUG', 'RecordType', CurrentRecordType );
	break;
	}


	nlapiLogExecution('DEBUG', 'Usage', usageRemaining);


	return true;
}

function projectSearch(assistant, expenditureCustomer, projectSearchResults,projectSearchFilters,projectSearchColumns)
{
	// search filters
	projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
	projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
	projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	// search columns
	projectSearchColumns[0] = new nlobjSearchColumn('entityid');
	projectSearchColumns[1] = new nlobjSearchColumn('internalid');
	// do search
	projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

	return projectSearchResults;
}

function addProjectField(assistant, projectDetails, projectSearchResults,projectSearchFilters,projectSearchColumns)
{
	// project fields
	assistant.addFieldGroup('groupproject','Project details');
	projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

	// project name array
	var projectNameArray = new Array();

	//add blank select option at top of list
	projectDetails.addSelectOption('','',true);

	for (var i = 0; i < projectSearchResults.length; i++)
	{
		projectNameArray = projectSearchResults[i].getValue(projectSearchColumns[0]).split(":");

		var projectName = projectNameArray[projectNameArray.length-2] + projectNameArray[projectNameArray.length-1];

		projectDetails.addSelectOption(projectSearchResults[i].getValue(projectSearchColumns[1]), projectName ,false);
	} //for

	return projectDetails;
}

function addCustomerField(expCustomer, assistant)
{
	// customer
	assistant.addFieldGroup('groupcustomer','Customer');
	expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

	// create search for customer records to use as select options in expCustomer
	var customerSearchFilters = new Array();
	var customerSearchColumns = new Array();

	//search filters			
	customerSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');				

	// search columns
	customerSearchColumns[0] = new nlobjSearchColumn('internalid');
	customerSearchColumns[1] = new nlobjSearchColumn('companyname');
	customerSearchColumns[2] = customerSearchColumns[1].setSort();

	// perform search
	var customerSearchResults = nlapiSearchRecord('customer', null, customerSearchFilters, customerSearchColumns);

	// if results are found to customer search, populate the expCustomer select options
	if (customerSearchResults)
	{
		//add blank select option at top of list
		expCustomer.addSelectOption('','',true);

		for (var i = 0; i < customerSearchResults.length; i++)
		{
			expCustomer.addSelectOption(customerSearchResults[i].getValue(customerSearchColumns[0]),customerSearchResults[i].getValue(customerSearchColumns[1]),false);
		} //for
	} //if

	return expCustomer;
}

/************
 *  Creates a new Automatically Generated ID
 * @param {Object} recordId Internal ID of the Settings Record
 ************/
function CreateNewID(recordId)
{

	//Declare the variables used within this function
	var prefix = '';
	var lastID = 0;
	var desiredLength = -1;
	var paddingCharacter = '0';
	var newID = 0;
	var generatedID = '';
	var padding = '';

	//First we need to get all the fields from the Custom Record
	try
	{
		prefix = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_prefix');
		lastID = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_lastid'));
		desiredLength = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_desiredlength'));
		paddingCharacter = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_paddingchar');

		//Pre-lim check to see if the PaddingCharacter will cause any headaches...
		if(paddingCharacter == null || paddingCharacter.length != 1)
		{
			nlapiLogExecution('error','GenerateNewID', 'PaddingCharacter: ' + paddingCharacter);
			return 'PaddingError';
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','GenerateNewID Error', e.message);
		return 'Error L32';
	}

	//increment the Last ID by 1
	newID = parseInt(lastID)+1;
	nlapiLogExecution('debug', 'newID: ' + newID + ', lastID = ' + lastID);
	try
	{
		//Submit this newly created field to the Custom Record
		nlapiSubmitField('customrecord_fhl_uniqueid', recordId,'custrecord_fhl_uid_lastid',newID,false);
	}
	catch(e)
	{
		//Field failed to submit field to record
		nlapiLogExecution('error','GenerateNewID Error', e.message);
	}

	//Create the Unique ID by concatenating all of the variables together
	generatedID = prefix + padding +  newID;

	while (generatedID.length<desiredLength)
	{
		padding = padding + paddingCharacter;
		generatedID = prefix + padding +  String(newID);
	}

	//At this point we should have a Unique ID of the desired length with the unique number on with the 	
	return generatedID;
}

function PurchaseInvoice_onSave()
{
	//1 is the settings for Vendor Bill
	var purchaseInvoiceSettingsRecordID = 1;
	var internalRefNum = null;

	try
	{
		internalRefNum = nlapiGetFieldValue('custbody_internalrefno');
	}
	catch(e)
	{
		//Cannot continue...
		nlapiLogExecution('error','PurchaseInvoiceSave', e.message);
		return true;
	}

	try
	{
		if(internalRefNum == null || internalRefNum.length <= 1 || internalRefNum == '')
		{
			internalRefNum = CreateNewID(purchaseInvoiceSettingsRecordID);	
			nlapiLogExecution('debug','Creating new id...','for internalrefnum');
			nlapiSetFieldValue('custbody_internalrefno', internalRefNum, false, false);
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','PurchaseInvoice_onSave', e.message);
	}
	return true;	
}



/**
 * generic search - returns internal ID
 * 
 */
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID=0;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(table, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}



/**
 * genericSearchReturnAnyField - returns any field's value
 * 
 */
function genericSearchReturnAnyField(table, fieldToSearch, valueToSearch,returnField)
{
	var returningValue = null;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn(returnField);

		// perform search
		var searchResults = nlapiSearchRecord(table, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				returningValue = searchResult.getValue(returnField);
			}
		}
	
	}
	catch(e)
	{
		errorHandler("genericSearchReturnAnyField", e);
	}     	      

	return returningValue;
}

/**
 * generic search - returns internal ID
 * 
 */
function genericSearchTwoParams(table, fieldToSearch1, valueToSearch1, fieldToSearch2, valueToSearch2)
{
	var internalID=0;

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	var itemSearchResults = null;
	var itemSearchResult = null;

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch1, null, 'is',valueToSearch1);                          
		invoiceSearchFilters[1] = new nlobjSearchFilter(fieldToSearch2, null, 'is',valueToSearch2);                          

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}

/**
 * generic search - returns internal ID
 * 
 */
function genericSearchThreeParams(table, fieldToSearch1, valueToSearch1, fieldToSearch2, valueToSearch2, fieldToSearch3, valueToSearch3)
{
	var internalID='not found';

	// Arrays
	var SearchFilters = new Array();
	var SearchColumns = new Array();
	var itemSearchResults = null;
	var itemSearchResult = null;

	try
	{
		//search filters                  
		SearchFilters[0] = new nlobjSearchFilter(fieldToSearch1, null, 'is',valueToSearch1);                          
		SearchFilters[1] = new nlobjSearchFilter(fieldToSearch2, null, 'is',valueToSearch2);
		SearchFilters[2] = new nlobjSearchFilter(fieldToSearch3, null, 'is',valueToSearch3);  
 
		// return columns
		SearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		itemSearchResults = nlapiSearchRecord(table, null, SearchFilters, SearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}



/**
 * usage: deleteallrecords('customrecord_xml_load_audit','custrecord_description'); 
 */

function deleteallrecords(recordtype,columnname)
{


	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'isnotempty');                          

	// search columns
	itemSearchColumns[0] = new nlobjSearchColumn(columnname);

	var searchresults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		try
		{
			var searchresult = searchresults[ i ];
			nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());
		}
		catch(e)
		{

			// ignore it
		}
	}
}

/**
 * usage: deleteallrecords('customrecord_xml_load_audit','custrecord_description'); 
 */

function deleteallrecordsWithFilter(recordtype,columnname, filterValue)
{


	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'is', filterValue);                          

	// search columns
	itemSearchColumns[0] = new nlobjSearchColumn(columnname);

	var searchresults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		try
		{
			var searchresult = searchresults[ i ];
			nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());
		}
		catch(e)
		{

			// ignore it
		}
	}
}


/**
 * generic search between - returns internal ID
 * 1.0.1 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */

function genericSearchBetween(tableName, fieldToSearchFrom, fieldToSearchTo, valueToSearch)
{
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter(fieldToSearchFrom, null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter(fieldToSearchTo, null, 'onOrAfter', valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearchBetween", e);	
	}     	      

	return internalID;
}


/**
 * generic search between - returns internal ID
 * 1.0.1 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */

function lookupPostingPeriod(tableName, valueToSearch)
{
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter('startdate', null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter('enddate', null, 'onOrAfter', valueToSearch);                          
		searchFilters[2] = new nlobjSearchFilter('isadjust', null, 'is', 'F');                          
		searchFilters[3] = new nlobjSearchFilter('isyear', null, 'is', 'F');                          
		searchFilters[4] = new nlobjSearchFilter('isquarter', null, 'is', 'F');                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("lookupPostingPeriod", e);	
	}     	      

	return internalID;
}


//Added version 1.1.0 - returnCSVFile

/************************
 * Return CSV File
 * 
 * @param {Object} request
 * @param {Object} response
 * 
 ************************/
function returnCSVFile(request, response){

	function escapeCSV(val){
		if(!val) return '';
		if(!(/[",\s]/).test(val)) return val;
		val = val.replace(/"/g, '""');
		return '"'+ val + '"';
	}


	function makeHeader(firstLine){
		var cols = firstLine.getAllColumns();
		var hdr = [];
		cols.forEach(function(c){
			var lbl = c.getLabel(); // column must have a custom label to be included.
			if(lbl){
				hdr.push(escapeCSV(lbl));
			}
		});
		return hdr.join(",");
	}

	function makeLine(srchRow){
		var cols = srchRow.getAllColumns();
		var line = [];
		cols.forEach(function(c){
			if(c.getLabel()){
				line.push(escapeCSV(srchRow.getText(c) || srchRow.getValue(c)));
			}
		});
		return line.join(",");
	}

	function getDLFileName(prefix){
		function pad(v){ if(v >= 10) return v; return "0"+v;}
		var now = new Date();
		return prefix + '-'+	now.getFullYear() + pad(now.getMonth()+1)+ pad(now.getDate()) + pad( now.getHours())	+pad(now.getMinutes()) + ".csv";
	}


	var srchRows = getfileLines(request); //function that returns your saved search results

	if(!srchRows)   throw nlapiCreateError("SRCH_RESULT", "No results from search");


	var fileLines = [makeHeader(srchRows[0])];

	srchRows.forEach(function(soLine){
		fileLines.push(makeLine(soLine));
	});


	response.setContentType('CSV', getDLFileName("CSV_"), 'attachment');
	response.write(fileLines.join('\r\n'));
}


/**
 * Populate select fields from record types
 */
function populateSelectFields(recordType, fieldObj)
{
	//var filters = new Array();
	var columns = new Array();
	var results = null;

	try
	{       
		// return columns
		columns[0] = new nlobjSearchColumn('internalid');
		columns[1] = new nlobjSearchColumn('name');

		// perform search
		results = nlapiSearchRecord(recordType, null, null, columns);

		if(results != null)
		{
			//add blank select option at top of list
			fieldObj.addSelectOption('', '', true);

			for (var i = 0; i < results.length; i++)
			{
				fieldObj.addSelectOption(results[i].getValue(columns[0]), results[i].getValue(columns[1]), false);
			} 
		}   
	}
	catch(e)
	{
		errorHandler("populateSelectFields", e);
	} 
}

/**
 * Bugfix for IE<9. Array.indexOf method not implemented
 */
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(obj, start)
	{
		for ( var i = (start || 0), j = this.length; i < j; i++)
		{
			if (this[i] === obj)
			{
				return i;
			}
		}
		return -1;
	};
}



/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 * 1.2.4 - 05/11/2012 - amended - remove 1000 item restriction - JM
 ************************************************************************************/

function runSavedSearch(from, to, savedSearch)
{

	var loadSearch = null;
	var runSearch = null;

	try
	{

		//Loading the saved search
		loadSearch = nlapiLoadSearch('item', savedSearch);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		searchResults = runSearch.getResults(from,to);


	}
	catch(e)
	{

		errorHandler("runSavedSearch:",e);
	}


}

/**
 * Takes an array of JSON column:value pairs and uses them as filters
 * @returns {Number}
 */
function genericSearchJSON(table, filtersArrayJSON)
{
	var retVal = 0;
	var filters = new Array();
	var searchResults = null;

	try
	{
		for (var i = 0; i < filtersArrayJSON.length; i++)
		{
			filters.push(new nlobjSearchFilter(filtersArrayJSON[i].column, null, 'is', filtersArrayJSON[i].value));
		}

		searchResults = nlapiSearchRecord(table, null, filters, new Array());

		if (searchResults)
		{
			retVal = searchResults[0].getId();
		}
	}
	catch (e)
	{
		errorHandler("genericSearchJSON:",e);
	}

	return retVal;
}

/**
 * splits out values and returns from an XML element
 *  
 */
function splitOutValue(element, elementTag)
{
	var retVal = '';
	var splitArray = null;


	try
	{

		//if element is not empty...
		if(element.indexOf(elementTag) != -1)
		{
			//...remove tags and return value
			element = element + '</' + elementTag + '>';
			splitArray = element.split(elementTag);

			retVal = splitArray[1];
			retVal = '' + retVal.substring(1, retVal.length - 2).toString();
		}

	}
	catch(e)
	{
		errorHandler("splitOutValue", e);
	}

	return retVal;
}

/**
 * convert xml converted characters back
 * @param xml
 * @returns {String}
 */
function UNencodeXML(xmldecode)
{
	var retVal='';

	try
	{
		xmldecode = xmldecode.replace(/&amp;/g,'&');
		xmldecode = xmldecode.replace(/&lt;/g,'<');
		xmldecode = xmldecode.replace(/&gt;/g,'>');
		xmldecode = xmldecode.replace(/&quot;/g,'\'');
		xmldecode = xmldecode.replace(/&#xD;/g,'\r');
		xmldecode = xmldecode.replace(/&#xA;/g,'\n');  

		retVal = xmldecode;

	}
	catch(e)
	{
		errorHandler("UNencodeXML", e);
	}

	return retVal;
}

/**
 * encode xml
 * @param xml
 * @returns {String}
 */
function encodeXML(XMLString)
{
	var retVal='';

	try
	{

		XMLString = XMLString.replace(/</gi,"&lt;");
		XMLString = XMLString.replace(/>/gi,"&gt;");
		XMLString = XMLString.replace(/&/gi,"&amp;");

		//		XMLString = XMLString.replace(/\n/gi,"&#xA;");  
		//	XMLString = XMLString.replace(/\r/gi,"&#xD;");
		//XMLString = XMLString.replace(/\'/gi,"&quot;");

		retVal = XMLString;

	}
	catch(e)
	{
		errorHandler("encodeXML", e);
	}

	return retVal;
}



/**
 * 
 * lookup currency using country to get currency
 * 
 */
function getAlignCountryCurrency(countryid)
{
	
	var returnCurrencyID = null;

	try
	{
		currencyIntID = genericSearch('customrecord_alignbv_eucountry','name', countryid);

		if(currencyIntID.length != 0)
		{
			returnCurrencyID = nlapiLookupField('customrecord_alignbv_eucountry', currencyIntID, 'custrecord_alignbv_pricelist_currency');;
		}

	}
	catch(e)
	{
		errorHandler("getAlignCurrencyID", e);
	}

	nlapiLogExecution('DEBUG', "getAlignCountryCurrency(countryid) ==> " + returnCurrencyID, "currencyIntID = " + currencyIntID);
	return returnCurrencyID;
}

/**
 * 
 * lookup customer using jdeid to get NetSuite customer record
 * 
 */
function getAlignCustomerRecord(jdeid)
{	
	var returnCustomerRecord = null;

	try
	{
		custIntID = genericSearch('customer','entityid',jdeid);

		if(custIntID.length != 0)
		{
			returnCustomerRecord = nlapiLoadRecord('customer', custIntID);;
		}

	}
	catch(e)
	{
		errorHandler("getAlignCustomerRecord", e);
	}

	return returnCustomerRecord;
}


/**
 * 
 * lookup customer using jdeid to get VAT Code and shipToCountry
 * 
 */
function lookupAlignCustomer(jdeid)
{	
	var defShipLine = 0;
	var custIntID = 0;
	var customerRecord = null;
	var retVal = false;

	try
	{
		custIntID = genericSearch('customer','entityid',jdeid);
		customerRecord = nlapiLoadRecord('customer', custIntID);

		vatNo = customerRecord.getFieldValue('vatregnumber');

		// get shipping sub and extract the ship to country 
		defShipLine = customerRecord.findLineItemValue('addressbook', 'defaultshipping', 'T');
		//shipCountry = customerRecord.getLineItemValue('addressbook', 'country', defShipLine);
		shipCountry = customerRecord.getLineItemText('addressbook', 'country', defShipLine);

		if(shipCountry.length != 0)
		{
			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("lookupAlignCustomer", e);
	}

	return retVal;
}




/**
 * get netsuite useable date
 * 12/12/2013 - incoming
 * 
 * 
 */

function getDate(dateStr)
{
	var retVal = null; 
	var day=0;
	var month=0;
	var year = '';
	var newDate='';

	try
	{

		year = dateStr.substring(6, 10);
		month = dateStr.substring(3, 5);
		day = dateStr.substring(0, 2);
		
		month = month.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		day = day.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		
		newDate = day + "/" + month + "/" + year;
		retVal =  newDate;
	}
	catch(e)
	{
		errorHandler('getDate', e);
	}
	return retVal;

}


/**
 * get netsuite useable date
 * 12/12/2013 - incoming
 * 
 * 
 */

function getDate(dateStr)
{
	var retVal = null; 
	var day=0;
	var month=0;
	var year = '';
	var newDate= new Date();

	try
	{
		newDate = nlapiStringToDate(dateStr);
		year = newDate.getFullYear();
		month = newDate.getMonth() + 1;
		day = newDate.getDate();
		
		//year = dateStr.substring(6, 10);
		//day = dateStr.substring(3, 5);
		//month = dateStr.substring(0, 2);
		
		//month = month.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		//day = day.replace(/\b0(?=\d)/g, ''); //1.0.15 removes leading zeros
		
		newDate = month + "/" + day + "/" + year;
		retVal =  newDate;
	}
	catch(e)
	{
		errorHandler('getDate', e);
	}
	return retVal;

}

/*****************************************************
 * replaceAll - A function which uses Regular Expressions to replace all
 * instances of the given text in the input string
 * 
 * @governance 0.
 * 
 * @param inputString - The source string you wish to replace the text FROM 
 * @param stringToReplace - The text you wish to REPLACE
 * @param stringToReplaceWith - The text you wish to REPLACE IT WITH
 * @returns {String}	-	The inputString, with all text replaced
 * 
 *****************************************************/

function replaceAll(inputString,stringToReplace,stringToReplaceWith)
{
	var retVal = "";
	var regExReplace = null;
	var caseSensitive = "gi";	//force case insensitive
	
	regExReplace=new RegExp(stringToReplace,caseSensitive);
	retVal = inputString.replace(regExReplace, stringToReplaceWith);
	
	return retVal;
}


/*****************************************************
 * removeAllLineItems - Removes all lines from a defined sublist
 * 						on a defined record
 * 
 * @governance 0.
 * 
 * @param record - The Record object whose sublist you wish to clear
 * @param sublist - The ID of the sublist that you wish to clear
 * @returns void
 * 
 *****************************************************/

function removeAllLineItems(record, sublist)
{
	lineCount = record.getLineItemCount(sublist);
	
	for (var i = lineCount; i >= 1; i--)
	{
		record.removeLineItem(sublist, i);
	}
}

/*****************************************************
 * convertDateDDMMToMMDD - Converts a date from dd/mm/yyyy
 * 						   format to mm/dd/yyyy format
 * 
 * @governance 0.
 * 
 * @param dateStr - date formatted as a string
 * @param sep - date separator (eg. '/' or '.')
 * @returns newDate - formatted as string
 * 
 *****************************************************/

function convertDateDDMMToMMDD(dateStr, sep)
{
	var date = null;
	var newDate = '';

	date = dateStr.split(sep);
	
	if(!parseInt(date[1]) > 12)
	{
		newDate = date[1] + sep + date[0] + sep + date[2];
	}
	else
	{
		newDate = 'N/A';
	}
	return newDate;
}

/*****************************************************
 * String.prototype.count - Counts number of occurrences
 * 						    of a string within a string
 * 
 * @governance 0.
 * 
 * @param char - search string
 * @returns Number - count of occurrances
 * 
 *****************************************************/

String.prototype.count = function(char)
{
	var str = '';
	var count = 0;
	var pos = 0;
	
	str = this.toString();
	pos = str.indexOf(char);
	 
	while (pos != -1) 
	{
	   count++;
	   pos = str.indexOf(char, pos + 1);
	}
	return count;
};




/**********************************************************************
 * convertToFloat Function - convert the fieldValues to float values
 *  
 * @param fieldValue - value to be converted to float
 * @returns {Number} - the resulted float value
 **********************************************************************/
function convertToFloat(fieldValue)
{
	var floatValue = 0;
	try
	{
		floatValue = parseFloat(fieldValue).toFixed(2);
	}
	catch(e)
	{
		errorHandler("convertToFloat : ", e);
	}
	return floatValue;
}



/**********************************************************************
 * searchShippingLookupRecord Function - search for shipping lookup record
 * 
 * 	version 1.0.2 - 05/05/2013 - searchShippingLookupRecord cfunction added - AS	
 **********************************************************************/
function searchShippingLookupRecord(itemIntID,shippingDestinationIntID)
{
	var shippingLookupFilters = new Array();
	var shippingLookupColumns = new Array();
	var shippingLookupResults = null;
	
	try
	{
		shippingLookupFilters[0] = new nlobjSearchFilter('custrecord_sl_item', null, 'is', itemIntID);						//filter by item
		shippingLookupFilters[1] = new nlobjSearchFilter('custrecord_sl_destination', null, 'is', shippingDestinationIntID);		//filter by destination
		
		shippingLookupColumns[0] = new nlobjSearchColumn('internalid');
		shippingLookupColumns[1] = new nlobjSearchColumn('custrecord_sl_charge');
		
		shippingLookupResults = nlapiSearchRecord('customrecord_shippinglookup', null, shippingLookupFilters, shippingLookupColumns);
		
	}
	catch(e)
	{
		errorHandler('searchShippingLookupRecord', e);
	}
  
return shippingLookupResults;
}

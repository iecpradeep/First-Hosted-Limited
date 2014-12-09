/*******************************************************
 * Name:		Library
 * Script Type:	Library
 *
 * Version:	1.0.0 - 10/02/2012 - Initial code functions and examples
 * 			1.0.1 - 25/07/2012 - genericsearchbetween added
 * 			1.1.0 - 9/8/2012 - Added Return CSV
 * 			1.1.1 - 30/11/2012 - Added genericSearchJSON - SB
 * 			1.1.2 - 06/05/2013 - added createJournal function - AS
 *			1.1.3 - 07/05/2013 - changed the variable names in createJournal function - AS
 *							   - added convertToFloat function - AS
 *			1.1.4 - 04/07/2013 - FHLParseFloat fixed NaN return error - JP
 *			1.1.5 - 19/07/2013 - adding postAndSetJrnlRef function - AS
 *							   - adding setJournalLineItems function - AS
 *							   - adding getOldJournalsList function - AS 
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


// sample usage
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


/**
 * error handler
 */
function errorHandler(errorSource, e)
{

	var errorMessage='';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution( 'ERROR', 'unexpected error: ' + errorSource , errorMessage);

}

/**
 * get error message string
 */
function getErrorMessage(e)
{
	var retVal='';

	if ( e instanceof nlobjError )
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal= e.toString();
	}

	return retVal;
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
	var internalID='not found';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

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
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}


/**
 * generic search - returns internal ID
 * 
 */
function genericSearchTwoParams(table, fieldToSearch1, valueToSearch1, fieldToSearch2, valueToSearch2)
{
	var internalID='not found';

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

//
//    Added version 1.1.0 - returnCSVFile
//
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
 * Bugfix for IE<9. String.indexOf method not implemented
 */
if (!String.prototype.indexOf)
{
	String.prototype.indexOf = function(obj, start)
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
 * create journal  
 * version 1.1.2 - 06/05/2013 - added createJournal function - AS
 */
function createJournal(totalValue, creditingAccount, debitingAccount, dept, location, subsidiary, jClass, invDate,  desc, entity)
{
	var journalRecord = null;
	var retVal = 0;
	var currency = 0;
	
	try
	{
		
		// get the journal record
		journalRecord = nlapiCreateRecord('journalentry');

		//convert everything to a float as we are dealing with currency
		totalValue = parseFloat(totalValue);
		debitingAccount = parseFloat(debitingAccount);
		creditingAccount = parseFloat(creditingAccount);

		journalRecord.setFieldValue('trandate',invDate);

		journalRecord.setFieldValue('custbody_customerdepartment', dept);
		journalRecord.setFieldValue('reversaldefer','F');
		journalRecord.setFieldValue('approved','T');
		
		currency = genericSearch('currency', 'name', 'GBP');		//british Pound
		
		journalRecord.setFieldValue('currency',currency);		

		if(subsidiary != 0)
		{
			journalRecord.setFieldValue('subsidiary',subsidiary);
		}

		// credit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',creditingAccount);
		journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
		
		if(dept!=0)
		{
			journalRecord.setCurrentLineItemValue('line','department',dept);
		}
		
		if(location!=0)
		{
			journalRecord.setCurrentLineItemValue('line','location',location);
		}
		
		if(jClass!=0)
		{
			journalRecord.setCurrentLineItemValue('line','class',jClass);
		}
		

		if(entity!=0)
		{
			journalRecord.setCurrentLineItemValue('line','entity',entity);
		}

		journalRecord.setCurrentLineItemValue('line','memo', desc);
		journalRecord.commitLineItem('line');   
		
		// debit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',debitingAccount);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(totalValue));

		if(dept!=0)
		{
			journalRecord.setCurrentLineItemValue('line','department',dept);
		}
		
		if(location!=0)
		{
			journalRecord.setCurrentLineItemValue('line','location',location);
		}

		if(jClass!=0)
		{
			journalRecord.setCurrentLineItemValue('line','class',jClass);
		}
		
		if(entity!=0)
		{
			journalRecord.setCurrentLineItemValue('line','entity',entity);
		}

		journalRecord.setCurrentLineItemValue('line','memo', desc);
		journalRecord.commitLineItem('line');                  

		retVal = nlapiSubmitRecord(journalRecord,true);
		nlapiLogExecution('AUDIT', 'Posted journal', retVal);
		
	}
	catch(e)
	{
		errorHandler('createJournal', e);
	}             

	return retVal;
} 
 

/**********************************************************************
 * convertToFloat Function - convert the fieldValues to float values
 *  
 * @param fieldValue - value to be converted to float
 * @returns {Number} - the resulted float value
 * 
 * version 1.1.3 - 07/05/2013 - added convertToFloat function - AS
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




/**
 * generic search - returns a specified column
 * 
 */
function genericSearchColumnReturn(table, fieldToSearch, valueToSearch, columnReturn)
{
	var internalID=0;
	var retVal = 'not found';
	
	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');
		invoiceSearchColumns[1] = new nlobjSearchColumn(columnReturn);

		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				retVal  = itemSearchResult.getValue(columnReturn);
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearchColumnReturn", e);
	}     	      

	return retVal;
}

/**
 * Gets any field value from address sublist on pre-defined record
 * 
 * @param recType {string} type of record (either Contact, Customer, Partner, Vendor or Employee)
 * @param recId {string} record ID 
 * @param defShip {boolean} is the desired address the default shipping address?
 * @param defBill {boolean} is the desired address the default billing address?
 * @param field {string} ID of the desired field
 * @returns {any} field 
 */
function lookupAddressInfo(recType, recId, defShip, defBill, field)
{
	var record = null;
	var lineNum = 0;
	var retVal = null;
	
	try
	{
		//Load record
		record = nlapiLoadRecord(recType, recId);

		//Find line number from default shipping or billing address
		if (defShip)
		{
			lineNum = record.findLineItemValue('addressbook', 'defaultshipping', 'T');
		}
		else if (defBill)
		{	
			lineNum = record.findLineItemValue('addressbook', 'defaultbilling', 'T');
		}

		if (lineNum > 0)
		{
			retVal = record.getLineItemValue('addressbook', field, lineNum);
		}
	}
	catch (e)
	{
		errorHandler('lookupAddressInfo', e)
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


/**********************************************************************
 * parse float and check for NAN
 * 1.1.4 - 04/07/2013 - FHLParseFloat fixed NaN return error - JP
 **********************************************************************/

function FHLParseFloat(value)
{
	var retVal = 0;
	
	try
	{

		if(isNaN(String(value)))
		{
			retVal = 0;
		}
		else
		{
			retVal = parseFloat(value) || 0;
		}
	}
	catch(e)
	{
		errorHandler("FHLParseFloat : ", e);
	}
	
	return retVal;
}


/**
 * Save start and end batch numbers into PPS Batch Record set
 * 
 * @param location {Number} location internal ID
 * @param startBatch {Number} starting batch number
 * @param endBatch {Number} ending batch number
 */
function saveBatchNumbers(location, startBatch, endBatch)
{
	var batchRecordIntId = 0;
	var customRecord = null;
	
	try
	{
		batchRecordIntId = genericSearch('customrecord_ppsbatchrecords', 'custrecord_batchrecordlocation', location);
		
		if(batchRecordIntId != null)
		{
			customRecord = nlapiLoadRecord('customrecord_ppsbatchrecords', batchRecordIntId);
			customRecord.setFieldValue('custrecord_reportbatchstart', startBatch);
			customRecord.setFieldValue('custrecord_reportbatchend', endBatch);
			nlapiSubmitRecord(customRecord);
		}
	}
	catch(e)
	{
		errorHandler('saveBatchNumbers', e);
	}
}

/**
 * Load start and end batch numbers from PPS Batch Record set
 * 
 * @param location {Number} location internal ID
 * @param startOrEnd {String} get start or end batch number
 */
function loadBatchNumbers(location, startOrEnd)
{
	var batchRecordIntId = 0;
	var batchNo = 0;
	
	try
	{	
		batchRecordIntId = genericSearch('customrecord_ppsbatchrecords', 'custrecord_batchrecordlocation', location);
		
		if(batchRecordIntId != null)
		{
			if (startOrEnd == 'start')
			{
				batchNo = nlapiLookupField('customrecord_ppsbatchrecords', batchRecordIntId, 'custrecord_reportbatchstart');
			}
			else if (startOrEnd == 'end')
			{
				batchNo = nlapiLookupField('customrecord_ppsbatchrecords', batchRecordIntId, 'custrecord_reportbatchend');
			}
		}
	}
	catch(e)
	{
		errorHandler('loadBatchNumbers', e);
		batchNo = -1;
	}
	return batchNo;
}

/**
 * Get start and end batch numbers from those recently generated
 * 
 * @param genNumbers {String} string of new batch numbers separated by a space
 * @param startOrEnd {String} get start or end batch number
 */
function getStartEndBatchNumbers(genNumbers, startOrEnd)
{
	var pos = 0;
	var batchNo = null;
	var pos1 = 0;
	var pos2 = 0;

	
	try
	{	
		if(genNumbers.length > 0)
		{
			if (startOrEnd == 'start')
			{
				pos = genNumbers.indexOf(' ');
				batchNo = genNumbers.substring(0, pos);
				batchNo = parseInt(batchNo);
			}
			else if (startOrEnd == 'end')
			{
				pos1 = genNumbers.lastIndexOf(' ');
				pos2 = genNumbers.lastIndexOf(' ',pos1-1);
				batchNo = genNumbers.substring(pos2+1,pos1);
				batchNo = parseInt(batchNo);
			}
		}
	}
	catch(e)
	{
		errorHandler('loadBatchNumbers', e);
		batchNo = -1;
	}
	return batchNo;
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * 
 * @returns {Void}
 */
function clientFieldChangedToSetBrand(type, name, linenum, fieldValue, fieldToSet)
{
	var entity = '';
	var customerBrand = '';
	
	try
	{	
		entity = nlapiGetFieldValue(fieldValue);

		customerBrand = nlapiLookupField('customer', entity, 'custentity_mrf_cust_brand');

		if ( customerBrand == '1')
		{
			nlapiSetFieldValue(fieldToSet, 1); //Set the Department (Brand) to Mr Fothergill's
		}
		if ( customerBrand == '2')
		{
			nlapiSetFieldValue(fieldToSet, 2); //Set the Department (Brand) to DT Brown
		}
		if ( customerBrand == '3')
		{
			nlapiSetFieldValue(fieldToSet, 3); //Set the Department (Brand) to Woolmans
		}
		if ( customerBrand == '4')
		{
			nlapiSetFieldValue(fieldToSet, 4); //Set the Department (Brand) to Johnsons
		}
 
	}
	catch(e)
	{
		errorHandler("clientFieldChangedToSetBrand ", e);
	}
}

/**
 * Separates account number from customer reference
 * 
 * @param str
 * @returns {Number}
 */
function getAccNo(str)
{
	var pos = 0;

	pos = str.indexOf(' ');
	str = str.substring(0, pos);

	return str;
}

/**
 * deal with governance i.e. yield
 */

function setRecoveryPoint()
{

	var state = null;
	var retVal = false;

	try
	{
		state = nlapiSetRecoveryPoint(); 
		if( state.status == 'SUCCESS' )
		{
			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("setRecoveryPoint", e);	
	}

}

/**
 * deal with governance i.e. yield
 */

function checkGovernance()
{
	var context = null;
	var remaining = 0;
	var state = null;
	var retVal = false;

	try
	{
		context = nlapiGetContext();
		remaining = context.getRemainingUsage(); 

		if(remaining < 20)
		{
			state = nlapiYieldScript();
			if( state.status == 'FAILURE')
			{
				errorHandler("checkGovernance", e);
			}
			else
			{
				if ( state.status == 'RESUME' )
				{
					nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
					retVal = true;
				}
			}
		}
		else
		{
			retVal = true;
		}

	}
	catch(e)
	{
		errorHandler("checkGovernance", e);	
	}


}


/**
 * generic search - returns array of internal IDs
 * 
 */
function genericSearchArray(table, fieldToSearch, valueToSearch)
{
	var internalIDs = new Array();

	// Arrays
	var filters = new Array();
	var columns = new Array();
	var results = null;

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		columns[0] = new nlobjSearchColumn('internalid');

		// perform search
		results = nlapiSearchRecord(table, null, filters, columns);

		if(results != null)
		{
			for (var i = 0; i < results.length; i++)
			{	
				internalIDs[i] = results[i].getValue('internalid');
			}
			
			internalIDs.sort(function(a, b)
			{
				var retVal = -1;
				
				if(a > b)
				{
					retVal = 1;
				}
				
				return retVal; 
			});
		}
	}
	catch(e)
	{
		errorHandler("genericSearchArray", e);
	}     	      

	return internalIDs;
}


/**
 * deal with governance i.e. yield
 */

function dealWithGovernance()
{
	var retVal = false;

	try
	{
		if(setRecoveryPoint()==true)
		{
			retVal = true;
		}

		if(checkGovernance()==true)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("dealWithGovernance", e);	
	}
	
	return retVal;
	

}

/**
 * generic search with two params - returns array of internal IDs
 * 
 */
function genericSearchArrayTwoParams(table, field1ToSearch, value1ToSearch, field2ToSearch, value2ToSearch)
{
	var internalIDs = new Array();

	// Arrays
	var filters = new Array();
	var columns = new Array();
	var results = null;

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(field1ToSearch, null, 'is', value1ToSearch);
		filters[1] = new nlobjSearchFilter(field2ToSearch, null, 'is', value2ToSearch);  
 
		// return columns
		columns[0] = new nlobjSearchColumn('internalid');

		// perform search
		results = nlapiSearchRecord(table, null, filters, columns);

		if(results != null)
		{
			for (var i = 0; i < results.length; i++)
			{	
				internalIDs[i] = results[i].getValue('internalid');
			}
			
			internalIDs.sort(function(a, b)
			{
				var retVal = -1;
				
				if(a > b)
				{
					retVal = 1;
				}
				
				return retVal; 
			});
		}
	}
	catch(e)
	{
		errorHandler("genericSearchArrayTwoParams", e);
	}     	      

	return internalIDs;
}


/***
 * postAndSetJrnlRefInvoice  function - posting the journals and set the line item value with the journal ref
 * 	
 * Used in : reverseRevenueInvoice , reverseDeferredRevenueFulfilment
 * 
 * version 1.1.5 - adding postAndSetJrnlRef function
 ****/
function postAndSetJrnlRefInvoice(journalDesc,record, amount, line,lineItemRecord,lineItemFieldName,creditingAccount,debitingAccount,date)
{
	try
	{
		//calling postJournals Function
		journalIntID = postJournals(amount,journalDesc,creditingAccount,debitingAccount,date);	
		
		nlapiLogExecution('debug', 'postAndSetJrnlRef journalIntID', journalIntID);
		nlapiLogExecution('debug', 'postAndSetJrnlRef itemfound', ItemFound);
		
		//if a journal has created
		if(journalIntID > 0)
		{
			//setting the journal reference in the record's line item 
			record.setLineItemValue(lineItemRecord, lineItemFieldName, line, journalIntID);		
		}
	}
	catch(e)
	{
		errorHandler('postAndSetJrnlRefInvoice', e);
	}
}



/***
 * postAndSetJrnlRefFulfil  function - posting the journals and set the line item value with the journal ref
 * 	
 * Used in : reverseRevenueInvoice , reverseDeferredRevenueFulfilment
 * 
 * version 1.1.5 - adding postAndSetJrnlRef function
 ****/
function postAndSetJrnlRefFulfil(journalDesc,record, amount, line,lineItemRecord,lineItemFieldName,creditingAccount,debitingAccount,date)
{
	try
	{
		//calling postJournals Function
		journalIntID = postJournals(amount,journalDesc,creditingAccount,debitingAccount,date);	

		//if a journal has created
		if(journalIntID > 0 && ItemFound == 'T')
		{
			//setting the journal reference in the record's line item 
			record.setLineItemValue(lineItemRecord, lineItemFieldName, line, journalIntID);		
		}
	}
	catch(e)
	{
		errorHandler('postAndSetJrnlRefFulfil', e);
	}
	
	return journalIntID;
}




/**********************************************************************
 * setJournalLineItems Function - setting the journal line items 
 * 
 * Used in : reverseRevenueInvoice , reverseDeferredRevenueFulfilment
 * 
 * version 1.1.5 - adding setJournalLineItems function
 ***********************************************************************/
function setJournalLineItems(journalDesc, journalRecord, totalValue, creditingAccount, debitingAccount, dept, location, entity)
{
	try
	{
		
		// credit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',creditingAccount);
		journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
		
		if(dept!=0)
		{
			journalRecord.setCurrentLineItemValue('line','department',dept);
		}
		
		if(location!=0)
		{
			journalRecord.setCurrentLineItemValue('line','location',location);
		}
		
			if(entity!=0)
		{
			journalRecord.setCurrentLineItemValue('line','entity',entity);
		}

		journalRecord.setCurrentLineItemValue('line','memo', journalDesc);
		journalRecord.commitLineItem('line');   
		
		// debit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',debitingAccount);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(totalValue));

		if(dept!=0)
		{
			journalRecord.setCurrentLineItemValue('line','department',dept);
		}
		
		if(location!=0)
		{
			journalRecord.setCurrentLineItemValue('line','location',location);
		}
		
		if(entity!=0)
		{
			journalRecord.setCurrentLineItemValue('line','entity',entity);
		}

		journalRecord.setCurrentLineItemValue('line','memo', journalDesc);
		journalRecord.commitLineItem('line');                  

	}
	catch(e)
	{
		errorHandler('setJournalLineItems', e);
	}             

} 


/**********************************************************************
 * getOldJournalsList Function - getting the old journal list in the fulfilment record for comparison purposes
 *  
 * Used in : reverseRevenueInvoice , reverseDeferredRevenueFulfilment
 * 
 * version 1.1.5 - adding getOldJournalsList function - AS 
 * 
 * @param type - type of the record - either create, delete or edit
 * @param parameterIntID - internal id of the script parameter
 **********************************************************************/

function getOldJournalsList(type,parameterIntID)
{
	var oldJournals = '';
	var oldJrnlList = new Array();
	try
	{
		//if the invoice is not creating
		if(type != 'create')
		{
			//reading the script parameter value
			oldJournals = context.getSessionObject(parameterIntID);
	
			//if the parameter is not empty
			if(oldJournals != null)
			{
				//split the parameter value by comma to get each journal's internal ID
				oldJrnlList = oldJournals.split(',', oldJournals.length);
			}
		}

	}
	catch(e)
	{
		errorHandler('getOldJournalsList', e);
	}
	return oldJrnlList;
}




/**********************************************************************
 * postJournals Function - creating and posting the journals into NetSuite
 * 
 * @param amount - amount of the particular line item (the amount to be debited and credited)
 **********************************************************************/
function postJournals(amount,journalDesc,creditingAccount,debitingAccount,date)
{
	var journalID = 0;
	
	try
	{
		
		/*
		 * Creating the journal - Library Function
		 * The format is  : createJournal(totalValue, creditingAccount, debitingAccount, dept, location, subsidiary, jClass, invDate, desc, entity)
		 * 
		 */

		journalID = createJournal(amount,creditingAccount,debitingAccount, departmentIntID, locationIntID, 0, 0, date, journalDesc, customerIntID);

	}
	catch(e)
	{

		errorHandler('postJournals', e);
	}

 return journalID;

}



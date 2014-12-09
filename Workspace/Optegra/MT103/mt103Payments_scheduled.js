/*******************************************************************************************************************
 * Name: MT103 Payments (mt103Payments_scheduled.js)
 * Script Type: Scheduled
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 07 Nov 2012 - 1st release - MJL
 * 			1.0.1 - 08 Nov 2012 - amended - changing the location lookup by location name,
 * 								  adding new location 'London',  adding genericSearch() function - AS
 *			1.0.2 - 03 Jul 2013 - Changing the task link ID of sandbox environment- AS
 *
 * Author: FHL
 * Purpose: Gets filter information from suitelet, searches for bill payments and creates MT103 records for each
 * 
 * Script : customscript_scheduled_mt103payments 
 * Deploy: customdeploy_scheduled_mt103payments
********************************************************************************************************************/

//Declaring global variables
var currency = '';
var context = null;

var environment = '';

var subsidiaryIntId = 0;
var firstPartyAcctName = '';
var firstPartySortCode = '';
var guildfordAccNo = '';
var corporateAccNo = '';
var solentAccNo = '';
var yorkshireAccNo = '';
var manchesterAccNo = '';
var birminghamAccNo = '';
var londonAccNo='';

var exportForm = null;
var dateFrom = null;
var dateTo = null;
var location = null;

var filters = new Array();
var columns = new Array();
var searchResults = null;

var entityID = 0;
var entity = null;

var entityNo = 0;
var entityAcctName = '';
var entityAcctNo = '';
var entitySortCode = '';
var isMT103 = ''; 
var firstPartyAcctNo = '';

var mt103Record = null;
var mt103RecID = 0;

var mt103Count = 0;


/******************************************************************
 * Main function called from the Script Deployment record
 * @param request
 * @param response
 ******************************************************************/
function mt103Payments_scheduled(request, response) 
{
	var message = null;
	
	//Get parameters for search
	readParameters();
	
	//Clears MT193 record set
	deleteallrecords('customrecord_mt103','custrecord_mt103_clinic');

	//Populates new records - returns either Boolean true or error message string
	message = populateData();
	
	//Send email 
	sendEmail(message);
}


/******************************************************************
 * Read parameters from script record
 * 
 ******************************************************************/
function readParameters()
{
	context = nlapiGetContext();
	environment = context.getEnvironment();
	nlapiLogExecution('AUDIT', 'Environment', environment);
	
	dateFrom = context.getSetting('SCRIPT', 'custscript_mt103sched_datefrom');
	dateTo = context.getSetting('SCRIPT', 'custscript_mt103sched_dateto');
	locationID = context.getSetting('SCRIPT', 'custscript_mt103sched_location');
	
	subsidiaryIntId = context.getSetting('SCRIPT', 'custscript_mt103sched_subsidiary_intid');
	
	firstPartyAcctName = context.getSetting('SCRIPT', 'custscript_mt103sched_firstparty_accname');
	firstPartySortCode = context.getSetting('SCRIPT', 'custscript_mt103sched_firstparty_sortcod');
	
	guildfordAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_guildford_accno');
	corporateAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_corporate_accno');
	solentAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_solent_accno');
	yorkshireAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_yorkshire_accno');
	manchesterAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_man_accno');
	birminghamAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_bir_accno');
	londonAccNo = context.getSetting('SCRIPT', 'custscript_mt103sched_london_accno');
}


/******************************************************************
 * Populates the MT103 record
 * 
 ******************************************************************/
function populateData()
{
	var retVal = null;

	try
	{		
		nlapiLogExecution('AUDIT', 'Date from', dateFrom);
		nlapiLogExecution('AUDIT', 'Date to', dateTo);
		nlapiLogExecution('AUDIT', 'Location', locationID);

		//define filters
		filters[0] = new nlobjSearchFilter('trandate', null, 'onorafter', dateFrom);
		filters[1] = new nlobjSearchFilter('trandate', null, 'onorbefore', dateTo);
		filters[2] = new nlobjSearchFilter('location', null, 'is', locationID);
		filters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');

		//return columns
		columns[0] = new nlobjSearchColumn('trandate');
		columns[1] = new nlobjSearchColumn('entity');
		columns[2] = new nlobjSearchColumn('tranid');
		columns[3] = new nlobjSearchColumn('fxamount');
		columns[4] = new nlobjSearchColumn('currency');
		
		
		//search for payments
		searchResults = nlapiSearchRecord('vendorpayment', null, filters, columns);

		//Checking if any search results
		if (searchResults != null) 
		{
			//Looping search results and populating columns
			for (var i = 0; i < searchResults.length; i++) 
			{
				entityID = searchResults[i].getValue(columns[1]);
				
				loadEntityRecord();
				
				//get entity information
				entityNo = entity.getFieldValue('entityid');
				entityAcctName = entity.getFieldValue('custentity_accountname');
				entityAcctNo = entity.getFieldValue('custentity_accountnumber');
				entitySortCode = entity.getFieldValue('custentity_sortcode');
				isMT103 = entity.getFieldValue('custentity_mt103');
				
				currency= searchResults[i].getText(columns[4]);
	
				//if entity MT103 flag is checked
				if (isMT103 == 'T')
				{
					retVal = createMT103Record(i);
				}
				else
				{
					nlapiLogExecution('AUDIT', 'Specified entity not included in MT103 run', entityNo);
				}
			}
		}
		else
		{
			nlapiLogExecution('AUDIT', 'Failure', 'No payments found');
			retVal = 'No Vendor Payments found for this Location in the specified date range.';
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
	return retVal;
}


/******************************************************************
 * Loads vendor or employee record
 * 
 ******************************************************************/
function loadEntityRecord()
{
	// if loading vendor record fails, load employee record
	try 
	{
		entity = nlapiLoadRecord('vendor', entityID);
	}
	catch(errorOne) 
	{
		try 
		{
			entity = nlapiLoadRecord('employee', entityID);
		}

		catch(errorTwo) 
		{
			nlapiLogExecution('ERROR', 'The entity specified is neither a vendor nor an employee.' + errorTwo.message);
		}
	}
}


/******************************************************************
 * Create new MT103 record from vendor payment
 * @param i
 * 
 ******************************************************************/
function createMT103Record(i)
{
	var retVal = null;
	
	try 
	{
		//create new MT103 record
		mt103Record = nlapiCreateRecord('customrecord_mt103');

		mt103Record.setFieldValue('custrecord_include', 'T'); 
		mt103Record.setFieldValue('custrecord_mt103_clinic', locationID);
		mt103Record.setFieldValue('custrecord_mt103_sortcode', entitySortCode);
		mt103Record.setFieldValue('custrecord_mt103_bankaccount', entityAcctNo);
		mt103Record.setFieldValue('custrecord_mt103_currency', currency);
		
		//only populate one entity field
		if(entity.getRecordType() == 'vendor')
		{
			mt103Record.setFieldValue('custrecord_mt103_vendor', entityID);
		}
		else 
		{
			mt103Record.setFieldValue('custrecord_mt103_employee', entityID);
		}

		mt103Record.setFieldValue('custrecord_mt103_reference', searchResults[i].getValue(columns[2]));
		mt103Record.setFieldValue('custrecord_mt103_amount', -(searchResults[i].getValue(columns[3])));
		mt103Record.setFieldValue('custrecord_mt103_accountname', entityAcctName);
		mt103Record.setFieldValue('custrecord_mt103_processingdate', searchResults[i].getValue(columns[0]));
		mt103Record.setFieldValue('custrecord_mt103_firstpartyname', firstPartyAcctName);
		mt103Record.setFieldValue('custrecord_mt103_firstpartysortcode', firstPartySortCode);

		firstPartyAcctNo = getFirstPartyAccNo(locationID);

		if (firstPartyAcctNo != 'not found')
		{
			mt103Record.setFieldValue('custrecord_mt103_firstpartyaccountnumber', firstPartyAcctNo);
			
		}

		//submit MT103 record
		mt103RecID = nlapiSubmitRecord(mt103Record);
		nlapiLogExecution('AUDIT', 'Success: MT103 record posted', mt103RecID);
		//response.write('mt103 Record created. mt103 Internal ID: ' + mt103RecID + '. Bill Payment ID: ' + searchResults[i].getValue(columns[2]) + '\n');
		mt103Count++;
		retVal = true;
	}
	catch(e)
	{
		retVal = errorHandler(e);
	}
	return retVal;
}


/******************************************************************
 * Send email confirming completion of MT103 creation
 * 
 * version 1.0.2 - Changing the task link ID of sandbox environment
 * @param message
 ******************************************************************/
function sendEmail(message)
{
	var msgSubject = '';
	var msgBody = '';
	var mt103URL = '';
	
	if(String(message) == 'true')
	{	
		msgSubject = 'complete';
		msgBody = 'completed';
		message = '';
	}
	else
	{
		msgSubject = 'failed';
		msgBody = msgSubject;
		message = '<br><br>' + message;
	}
	
	//get email information	
	userID = nlapiGetUser(); 
	userEmail = context.getEmail();
	
	//generate URL for MT103 record list
	if(environment == 'PRODUCTION')
	{
		//mt103URL = nlapiResolveURL('TASKLINK', 'LIST_CUST_99');
	}
	else
	{
		mt103URL = nlapiResolveURL('TASKLINK', 'LIST_CUST_120');		//version 1.0.2
	}
	
	//Create hyperlink from URL
	mt103URL = '<br><br><a href=' + mt103URL + '>View Record List</a>';
	
	//send email
	msgSubject = 'MT103 record creation ' + msgSubject;
	msgBody = 'MT103 creation ' + msgBody + '.<br>' + mt103Count + ' records created.' + message + mt103URL;
	//nlapiSendEmail(userID, userEmail, msgSubject, msgBody);
	nlapiSendEmail(userID, 'matthew.lawrence@firsthosted.co.uk', msgSubject, msgBody); //debug code
	nlapiSendEmail(userID, 'achala.siriwardena@firsthosted.co.uk', msgSubject, msgBody); //debug code
}


/******************************************************************
 * error handler
 * @param e
 ******************************************************************/
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());
	errorMessage = 'Error: ' + errorMessage;
	return errorMessage;
}


/******************************************************************
 * error message
 * @param e
 ******************************************************************/
function getErrorMessage(e)
{
	var retVal = '';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}
	return retVal;
}


/******************************************************************
 * Library function used to delete existing records from MT103 table
 * 
 * usage: deleteallrecords('customrecord_mt103','custrecord_mt103_clinic');
 * 
 ******************************************************************/
function deleteallrecords(recordtype,columnname)
{
	//Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();
	var searchResults = null;

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'isnotempty');                          

	//search columns
	itemSearchColumns[0] = new nlobjSearchColumn(columnname);

	//get results
	searchResults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

	for (var i = 0; searchResults != null && i < searchResults.length; i++)
	{
		try
		{
			//var searchresult = searchResults[ i ];
			nlapiDeleteRecord(searchResults[i].getRecordType(), searchResults[i].getId());
		}
		catch(e)
		{
			// ignore it
		}
	}
}

/******************************************************************
 * Gets account number for specified location (sandbox)
 *  version 1.0.1 - changing the location lookup by location name,
 * 								  adding new location 'London'  
 * @param locationID
 * @returns {String}
 ******************************************************************/
function getFirstPartyAccNo(locationID)
{
	var accNo = 'not found';
	var location = '';
	var locationName ='';
	
	location = genericSearch('location', 'internalid', locationID);
	locationName = location.substring(5,location.length);

	switch (locationName)
	{
		case 'Guildford': 
			accNo = guildfordAccNo;
			break;
			
		case 'Head Office': 
			accNo = corporateAccNo;
			break;
			
		case 'Solent': 
			accNo = solentAccNo;
			break;
			
		case 'Yorkshire': 
			accNo = yorkshireAccNo;
			break;
			
		case 'Manchester': 
			accNo = manchesterAccNo;
			break;
			
		case 'Birmingham': 
			accNo = birminghamAccNo;
			break;
			
		case 'London': 
			accNo = londonAccNo;
			break;
			
		default:
			nlapiLogExecution('AUDIT', 'No account number found for this location', locationName);
			break;
	}
	return accNo;
}




/**************************************************************************
 * generic search - returns location name
 * version 1.0.1 - adding genericSearch() function
 * 
 * @param table
 * @param fieldToSearch
 * @param valueToSearch
 * @returns {name}
 * 
 *************************************************************************/
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var locationSearchFilters = new Array();
	var locationSearchColumns = new Array();
	var location = null; 
	var locationSearchResults = new Array();
	
	try
	{
		//search filters                  
		locationSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		locationSearchColumns[0] = new nlobjSearchColumn('name');
		
		// perform search
		locationSearchResults = nlapiSearchRecord(table, null, locationSearchFilters, locationSearchColumns);

		if(locationSearchResults!=null)
		{
			
			if(locationSearchResults.length>0)
			{
				
				location = locationSearchResults[ 0 ].getValue('name');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
	}     	      

	return location;
}

/*******************************************************************************************************************
 * Name: BACS Payments (bacsPayments_scheduled.js)
 * Script Type: Scheduled
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 30 Aug 2012 - 1st release - MJL
 * 			1.0.1 - 04 Sep 2012 - amended - changed tasklink for BACS list in live - MJL
 *			1.0.2 - 09 Nov 2012 - amended - changing the location lookup by location name,
 * 								  adding new location 'London',  adding genericSearch() function - AS
 * 			1.0.3 - 02 May 2013 - amended - edited tasklink internal id, now bacs record in the sandbox and production are same - SA,
 * 
 * Author: FHL
 * Purpose: Gets filter information from suitelet, searches for bill payments and creates BACS records for each
 * 
 * Script : customscript_scheduled_bacspayments 
 * Deploy: customdeploy_scheduled_bacspayments
********************************************************************************************************************/

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
var isBACS = ''; 
var firstPartyAcctNo = '';

var bacsRecord = null;
var bacsRecID = 0;

var bacsCount = 0;

/******************************************************************
 * Main function called from the Script Deployment record
 * 
 * @param request
 * @param response
 ******************************************************************/
function bacspayments_scheduled(request, response) 
{
	var message = null;
	
	//Get parameters for search
	readParameters();
	
	//Clears BACS record set
	deleteallrecords('customrecord_bacs','custrecord_bacsclinic');

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
	
	dateFrom = context.getSetting('SCRIPT', 'custscript_bacssched_datefrom');
	dateTo = context.getSetting('SCRIPT', 'custscript_bacssched_dateto');
	locationID = context.getSetting('SCRIPT', 'custscript_bacssched_location');
	
	subsidiaryIntId = context.getSetting('SCRIPT', 'custscript_bacssched_subsidiary_intid');
	
	firstPartyAcctName = context.getSetting('SCRIPT', 'custscript_bacssched_firstparty_accname');
	firstPartySortCode = context.getSetting('SCRIPT', 'custscript_bacssched_firstparty_sortcode');
	
	guildfordAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_guildford_accnumber');
	corporateAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_corporate_accnumber');
	solentAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_solent_accnumber');
	yorkshireAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_yorkshire_accnumber');
	manchesterAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_man_accnumber');
	birminghamAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_bir_accnumber');
	londonAccNo = context.getSetting('SCRIPT', 'custscript_bacssched_london_accno');
}


/******************************************************************
 * Populates the BACS record
 * 
 ******************************************************************/
function populateData()
{
	var retVal = null;

	try
	{		

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
				isBACS = entity.getFieldValue('custentity_bacs');
				
				//if entity BACS flag is checked
				if (isBACS == 'T')
				{
					retVal = createBACSRecord(i);
				}
				else
				{
					nlapiLogExecution('AUDIT', 'Specified entity not included in BACS run', entityNo);
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
 * Create new BACS record from vendor payment
 *  @param i
 ******************************************************************/
function createBACSRecord(i)
{
	var retVal = null;
	
	try 
	{
		//create new BACS record
		bacsRecord = nlapiCreateRecord('customrecord_bacs');

		bacsRecord.setFieldValue('custrecord_include', 'T'); 
		bacsRecord.setFieldValue('custrecord_bacsclinic', locationID);
		bacsRecord.setFieldValue('custrecord_bacssortcode', entitySortCode);
		bacsRecord.setFieldValue('custrecord_bacsbankaccount', entityAcctNo);

		//only populate one entity field
		if(entity.getRecordType() == 'vendor')
		{
			bacsRecord.setFieldValue('custrecord_bacsvendor', entityID);
		}
		else 
		{
			bacsRecord.setFieldValue('custrecord_bacsemployee', entityID);
		}

		bacsRecord.setFieldValue('custrecord_bacsreference', searchResults[i].getValue(columns[2]));
		bacsRecord.setFieldValue('custrecord_bacsamount', -(searchResults[i].getValue(columns[3])));
		bacsRecord.setFieldValue('custrecord_bacsaccountname', entityAcctName);
		bacsRecord.setFieldValue('custrecord_bacsprocessingdate', searchResults[i].getValue(columns[0]));
		bacsRecord.setFieldValue('custrecord_firstpartyname', firstPartyAcctName);
		bacsRecord.setFieldValue('custrecord_firstpartysortcode', firstPartySortCode);

		//get correct account number for location
		if (environment == 'PRODUCTION')
		{					
			firstPartyAcctNo = getFirstPartyAccNo_Live(locationID);
		}
		else
		{
			firstPartyAcctNo = getFirstPartyAccNo_Sandbox(locationID);
		}

		nlapiLogExecution('AUDIT', 'First party account number', firstPartyAcctNo);

		if (firstPartyAcctNo != 'not found')
		{
			bacsRecord.setFieldValue('custrecord_firstpartyaccountnumber', firstPartyAcctNo);
		}

		//submit BACS record
		bacsRecID = nlapiSubmitRecord(bacsRecord);
		nlapiLogExecution('AUDIT', 'Success: BACS record posted', bacsRecID);
		//response.write('BACS Record created. BACS Internal ID: ' + bacsRecID + '. Bill Payment ID: ' + searchResults[i].getValue(columns[2]) + '\n');
		bacsCount++;
		retVal = true;
	}
	catch(e)
	{
		retVal = errorHandler(e);
	}
	return retVal;
}


/******************************************************************
 * Send email confirming completion of BACS creation
 * 
 * 1.0.1 changed tasklink for BACS list in live
 * 1.0.3 - 02 May 2013 - amended - edited tasklink internal id, now bacs record in the sandbox and production are same - SA
 * 
 * @param message
 ******************************************************************/
function sendEmail(message)
{
	var msgSubject = '';
	var msgBody = '';
	var bacsURL = '';
	
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
	
	//1.0.1 generate URL for BACS record list
	if(environment == 'PRODUCTION')
	{
		bacsURL = nlapiResolveURL('TASKLINK', 'LIST_CUST_99');
	}
	else
	{
		// 1.0.3 - edited tasklink internal id, now bacs record in the sandbox and production are same - SA
		bacsURL = nlapiResolveURL('TASKLINK', 'LIST_CUST_99');
	}
	
	//Create hyperlink from URL
	bacsURL = '<br><br><a href=' + bacsURL + '>View Record List</a>';
	
	//send email
	msgSubject = 'BACS record creation ' + msgSubject;
	msgBody = 'BACS creation ' + msgBody + '.<br>' + bacsCount + ' records created.' + message + bacsURL;
	nlapiSendEmail(userID, userEmail, msgSubject, msgBody);
	//nlapiSendEmail(userID, 'matthew.lawrence@firsthosted.co.uk', msgSubject, msgBody); //debug code
}


/******************************************************************
 * error handler
 * 
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
 * 
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
 * Library function used to delete existing records from BACS table
 * 
 * usage: deleteallrecords('customrecord_bacs','custrecord_bacsclinic');
 * 
 * @param recordtype
 * @param columnname
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
 *  version 1.0.2 - changing the location lookup by location name,
 * 								  adding new location 'London'  
 * @param locationID
 * @returns {String}
 ******************************************************************/
function getFirstPartyAccNo_Sandbox(locationID)
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
	  		nlapiLogExecution('AUDIT', 'No account number found for this location',locationName);
	  		break;
	}
	
	return accNo;
}

/******************************************************************
 * Gets account number for specified location (live system)
 * version 1.0.2 - changing the location lookup by location name,
 * 								  adding new location 'London' 
 * @param locationID
 * @returns {String}
 ******************************************************************/
function getFirstPartyAccNo_Live(locationID)
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
 * version 1.0.2 - adding genericSearch() function 
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


/*************************************************************************************
 * Name:		voicenetScreenPop.js 
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 08/10/2012 - Initial version - JM
 *
 * Author:		FHL
 * 
 * Purpose:		screen pop for inbound calls
 * 
 * Script: 		customscript_voicenetscreenpop
 * Deploy: 		customdeploy_voicenetscreenpop	
 * 
 * Notes:		[TODO] Comments, Field to check the entity.
 * 				
 * 
 * Library: 	library.js
 *************************************************************************************/

var userID = 0;
var userRecord = null;

var officePhone = '';
var sourceCallNumber = '';

var html = '';
var refresh = 0;
var targetURLforRefresh = '';
var targetURLforScreenPop = '';

var callIntID = 0;			// telephony internal ID
var contactIntID = 0;
var customerIntID = 0;
var supplierIntID = 0;
var employeeIntID = 0;
var callInternalID = 0;		// phonecall internal ID


var contactURL = '';
var customerURL = '';
var supplierURL = '';
var employeeURL = '';
var callURL = '';

var telephonyRecord = null;


/**
 * screen popper
 * 
 * @param request
 * @param response
 */
function screenPop(request, response)
{

	initialise();
	getUserDetails();
	constructJavaScriptOpenWindow();

	if(checkForAnyCalls()!=0)
	{
		checkWhoTheCallIsFrom();
		callInternalID = createCallRecord();
		updateTelephonyRecord();
		setupURLForScreenPop();
	}

	createHTMLToRender();		// this includes the call back and timer to keep checking if a call has arrived
}

/**
 * initialise
 * 
 * 
 */
function initialise()
{
	refresh = 2;

	targetURLforRefresh = 'https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=33&deploy=1';

	targetURLforScreenPop = 'https://system.netsuite.com/app/common/entity/custjob.nl?id=614';

	contactURL = 'https://system.netsuite.com/app/common/entity/contact.nl?id=';
	customerURL = 'https://system.netsuite.com/app/common/entity/custjob.nl?id=';
	supplierURL = 'https://system.netsuite.com/app/common/entity/vendor.nl?id=';
	employeeURL = 'https://system.netsuite.com/app/common/entity/employee.nl?id=';

	callURL = 'https://system.netsuite.com/app/crm/calendar/call.nl?id={0}&amp;e=T&l=T&whence=';
}

/**
 * check for inbound calls
 * 
 * 
 */
function checkForAnyCalls()
{
	try
	{
		callIntID = searchCalls('customrecord_telephony', 'custrecord_targettelephone' , officePhone, 'custrecord_callhandled','F');

		nlapiLogExecution('DEBUG', 'checkForAnyCalls > 0 call record found', callIntID);
	}
	catch(e)
	{
		errorHandler('checkForAnyCalls',e);
	}

	return callIntID;
}

/**
 * check who the call is from
 * 
 * 
 */
function checkWhoTheCallIsFrom()
{
	try
	{
		employeeIntID = genericSearch('employee', 'phone', sourceCallNumber);
		customerIntID = genericSearch('customer', 'phone', sourceCallNumber);
		supplierIntID = genericSearch('vendor', 'phone', sourceCallNumber);
		contactIntID = genericSearch('contact', 'phone', sourceCallNumber);
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'checkWhoTheCallIsFrom', e.message);
	}
}

/**
 * setup the url for the screen pop i.e. customer/employee/contact/supplier
 * 
 * 
 */
function setupURLForScreenPop()
{
	html += '<h1>Checking call</h1><br>';

	// set the urls for the screen pop and the create call URL
	if(employeeIntID!=0)
	{
		html += '<h1>Employee found</h1><br>';
		targetURLforScreenPop = employeeURL + employeeIntID;
	}
	if(customerIntID!=0)
	{
		html += '<h1>Customer found</h1><br>';
		targetURLforScreenPop = customerURL + customerIntID;
	}
	if(supplierIntID!=0)
	{
		html += '<h1>Supplier found</h1><br>';
		targetURLforScreenPop = supplierURL + supplierIntID;
	}
	if(contactIntID!=0)
	{
		html += '<h1>Contact found</h1><br>';
		targetURLforScreenPop = contactURL + contactIntID;
	}

	if(callInternalID!=0)
	{
		callURL = callURL.replace("{0}", callInternalID);
	}
	else
	{
		callURL='';
	}

	html += '<h1>URL To Pop for call (' + callURL + ')</h1><br>';
}

/**
 * get user details
 * 
 */
function getUserDetails()
{
	userID = nlapiGetUser();
	userRecord = nlapiLoadRecord('employee', userID);
	officePhone = userRecord.getFieldValue('officephone');
}

/**
 * create html message 
 * 
 * 
 */
function createHTMLToRender()
{
	var loadSearch = null;
	var runSearch = null;
	var searchResults = null;
	var shadeCounter = 0;
	
	
	if(callIntID==0)
	{
		html = html + "<html><body>";
	}
	else
	{
		html = html + "<html><body onLoad='popup(\"" + targetURLforScreenPop + "\", \"ad\", \"" + callURL + "\", \"call\");'>";
	}

		html += '<div class="wrapper">';
			html += '<div class="header">';	
				html += '<div class="image">';	
					html += '<img src="https://system.netsuite.com/core/media/media.nl?id=4484&c=1030551&h=3755c7f3c3e0ba68c35a" alt="ciscophone" height="200" width="200">';
				html += '</div>';		
				html += '<div class="title">';
					html += '<h2>Your telephone number is (' + officePhone + ')</h2>';
				html += '</div>';	
			html += '</div>';
			
			html += '<table id="phonetable">';
		
				//Table Headers. 
				html += '<tr>';
					html += '<th>Telephone Number</th>';
					html += '<th>Start Time</th>';
					html += '<th>Date</th>';
					html += '<th>Description</th>';
				html += '</tr>';
			
				//Load the Saved Search.
				loadSearch = nlapiLoadSearch('customrecord_telephony', 'customsearch_telephony');
				
				//Running the loaded search
				runSearch = loadSearch.runSearch();
			
				//Getting the search results of the five [TODO] Parameterise 
				searchResults = runSearch.getResults(0,5);
				
				//Display table information.
				searchResults.forEach(function(telephonyResult)
				{	
					shadeCounter++;
					
					html += '<tr'+ (shadeCounter%2==0 ? ' class=shaded' : '') + '>';
						html += '<td>'+ telephonyResult.getValue('custrecord_sourcetelephone') + '</td>';
						html += '<td>'+ telephonyResult.getValue('custrecord_starttime') + '</td>';
						html += '<td>'+ telephonyResult.getValue('custrecord_date') + '</td>';
						html += '<td>'+ telephonyResult.getValue('custrecord_notes')+'</td>';
					html += '</tr>';	
				});			
			html += '</table>';		
		html += '</div>';		
	html += '</body>';
	//Refresh the page every 2 seconds.
	html += '<meta http-equiv="refresh" content="' + refresh + ';url=' + targetURLforRefresh + '"/>';
	html += '</html>';
	
	response.write(html);
}

/**
 * construct JavaScript OpenWindow function as text
 * to add into HTML string
 * 
 */
function constructJavaScriptOpenWindow()
{
	html = html + '<head>';
	html = html + '<SCRIPT TYPE=\"text/javascript\">';
	html = html + 'function popup(mylink, windowname, callURL, callWindowName)';
	html = html + '{';
	html = html + 'if (! window.focus)return true;';
	html = html + 'var href;';

	html = html + 'if (typeof(mylink) == \"string\")';
	html = html + 'href=mylink;';
	html = html + 'else';
	html = html + 'href=mylink.href;';

	html = html + 'window.open(href, windowname, \"width=600,height=600,left=0,top=100,screenX=0,screenY=100,scrollbars=yes\");';

	html = html + 'if (typeof(callURL) == \"string\")';
	html = html + 'href=callURL;';
	html = html + 'else';
	html = html + 'href=callURL.href;';

	html = html + 'if(callURL.length!=0)';
	html = html + 'window.open(href, callWindowName, \"width=600,height=600,left=300,top=300,screenX=300,screenY=300,scrollbars=yes\");';

	html = html + 'return false;';
	html = html + '}';
	html = html + '</SCRIPT>';

	// CSS Styling.
	html += '<style type="text/css">';
		html += '#phonetable{border:1px solid #000000;float:right;margin:0px;width:100%;text-align: left;border-collapse: collapse;}';
		html += '#phonetable th{padding: 8px;font-weight: bold;font-size: 16px;color: #000000;background: #AAAAAA;font-family:Arial;}';
		html += '#phonetable td{padding: 8px;border-top: 1px solid #000000;color: #000000;}';
		html += 'div.header{height:200px;width:100%;margin:0px; background: #CCCCCC;border-top: solid 1px black;border-right: solid 1px black;border-left: solid 1px black}';
		html += 'div.wrapper{width:60%;padding:0px;margin: auto;}';
		html += 'div.image{float:left;}';
		html += 'div.title{float:left;}';
		html += '.shaded{background:#E8E8E8}';
	html += '</style>';

	html = html + '</head>';
}

/**
 * search calls - returns internal ID
 * 1.0.2 added
 */

function searchCalls(tableName, fieldToSearch, valueToSearch, extraFieldToSearch,extraValueToSearch)
{
	var internalID=0;
	var searchResult = null;

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter(extraFieldToSearch, null, 'is',extraValueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');
		searchColumns[1] = new nlobjSearchColumn('custrecord_sourcetelephone');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
				sourceCallNumber = searchResult.getValue('custrecord_sourcetelephone');
			}
		}
	}
	catch(e)
	{
		errorHandler("searchCalls",e);
	}     	      

	return internalID;
}

/**
 * create Call Record
 */
function createCallRecord()
{

	var call=null;
	var phoneCallIntID=0;
	var today = nlapiDateToString( new Date() );

	try
	{
		call = nlapiCreateRecord('phonecall');

		call.setFieldValue('assigned', userID);



		if(customerIntID!=0)
		{
			call.setFieldValue('company', customerIntID);
		}

		/*		[TODO]

		if(contactIntID!=0)
		{
			call.setFieldValue('contact', contactIntID);
		}
		else
		{
			if(customerIntID!=0)
			{
				call.setFieldValue('company', customerIntID);
			}
			else
			{
				if(supplierIntID!=0)
				{
					call.setFieldValue('company', supplierIntID);
				}
			}
		}

		 */

		call.setFieldValue('customform', -150);		// standard call form
		call.setFieldValue('owner', userID);
		call.setFieldValue('phone', sourceCallNumber);
		call.setFieldValue('accesslevel', 'F');
		//call.setFieldValue('endtime', xmltopost);
		call.setFieldValue('priority', 'MEDIUM');
		call.setFieldValue('startdate', today);
		//call.setFieldValue('starttime', xmltopost);
		call.setFieldValue('status', 'SCHEDULED');
		call.setFieldValue('title', 'Please replace this description');

		phoneCallIntID = nlapiSubmitRecord(call, true);
	}
	catch(e)
	{
		errorHandler("createCallRecord",e);
	}     	      

	if(phoneCallIntID!=0)
	{
		html += '<h1>call created</h1><br>';
	}
	else
	{
		html += '<h1>call NOT created</h1><br>';

	}

	return phoneCallIntID;
}

/**
 * update Telephony Record
 */
function updateTelephonyRecord()
{

	var telephony=null;
	var telephonyCallIntID=0;
	//var today = nlapiDateToString( new Date() );

	try
	{
		telephony = nlapiLoadRecord('customrecord_telephony', callIntID);


		//telephony.setFieldValue('custrecord_startdatetime',today);
		//telephony.setFieldValue('custrecord_enddatetime','');


		if(employeeIntID!=0)
		{
			telephony.setFieldValue('custrecord_empintid',employeeIntID);
		}
		if(customerIntID!=0)
		{
			telephony.setFieldValue('custrecord_custintid',customerIntID);
		}
		if(supplierIntID!=0)
		{
			telephony.setFieldValue('custrecord_supplierintid',supplierIntID);
		}
		if(contactIntID!=0)
		{
			telephony.setFieldValue('custrecord_contactintid',contactIntID);
		}
		if(callInternalID!=0)
		{
			telephony.setFieldValue('custrecord_callintid',callInternalID);
		}

		telephony.setFieldValue('custrecord_callhandled','T');

		telephonyCallIntID = nlapiSubmitRecord(telephony, true);

	}
	catch(e)
	{
		errorHandler("updateTelephonyRecord",e);
	}     	      

	return telephonyCallIntID;
}

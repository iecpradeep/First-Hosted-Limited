/*******************************************************************************
 * Name: RESTServices.js Script: REST web service Client: Munster
 * 
 * Version: 1.0.0 - 30 March 2013 1st release JM
 * 
 * Author: FHL Purpose: REST Web Service for saved search queries
 * 
 * Script: customscript_restservices Deploy: customdeploy_restservices
 * 
 * URL: /app/site/hosting/restlet.nl?script=286&deploy=1 External URL:
 * https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=286&deploy=1
 ******************************************************************************/

//Initialising Gloabal Variables
var fileLines = '';
var savedSearchName = '';
var searchType = '';
var criteria = '';

function restServices(datain) 
{

	var contents = '';
	var retVal = '';
	var message = '';
	
	nlapiLogExecution("DEBUG", "RESTSERVICE", datain.contents);
	
	contents = datain.contents;
	
	contents = UNencodeXML(contents);
	
	// is this a saved search type
	if (contents.indexOf('transaction') != -1) 
	{
		auditTrail("CASHSALE", contents);
		fileLines = "Success";
	}

	

	
	// is this a saved search type
	if (contents.indexOf('<SAVEDSEARCH>') != -1) 
	{	
		
		extractTypeAndSearchFromContents(contents);
		message = "saved search name: " + savedSearchName + ", type: "	+ searchType;

		auditTrail(message, contents);

		runSavedSearchXMLWithCriteria(0, 1000, true, savedSearchName,	searchType, criteria);
	}


	return fileLines;

}

/**
 * extract the saved search and type from the message
 * 
 */

function extractTypeAndSearchFromContents(contents) 
{

	var commandLines = 0;
	var element = '';
	var retVal = false;
	var commandSplit = new Array();

	try {

		commandSplit = contents.split('<BR>');
		commandLines = commandSplit.length;

		for ( var x = 0; x < commandLines; x++) 
		{
			element = commandSplit[x];
			if (element.indexOf('<SAVEDSEARCH>') != -1) 
			{
				savedSearchName = splitOutValue(element, 'SAVEDSEARCH');
			}
			if (element.indexOf('<TYPE>') != -1) {
				searchType = splitOutValue(element, 'TYPE');
			}

		}

	} catch (e) 
	{
		errorHandler("extractTypeAndSearchFromContents", e);
	}

}

function stockItemExist(query) 
{
	var itemCode = '';
	var description = '';
	var savedSearch = '';
	var criteria = null;

	savedSearch = "customsearch_restquerystockitemexist";

	// criteria =[[ 'displayname', 'contains', 'BELTED' ]];
	criteria = [ [ 'displayname', 'contains', 'BELTED TUNIC' ] ];

	// criteria =[[ 'displayname', 'contains', 'BELTED' ],'and',[ 'department',
	// , 'anyOf', 3 ]];
	// criteria =[[ 'displayname', 'contains', 'BELTED' ],'and',[ 'department',
	// 'anyOf', 3 ]];

	runSavedSearches(savedSearch, 'XML', 'item', criteria);

}

/**
 * creates an audit record and adds the CSV payload to it 1.0.1 split out credit
 * note number
 */
function auditTrail(message, payload) 
{

	var desc = 'REST Web Service ' + Date();
	var auditID = 0;
	var retVal = 'OK';
	var newAudit = null;

	try 
	{
		newAudit = nlapiCreateRecord('customrecord_restserviceaudit');

		newAudit.setFieldValue('name', desc);
		newAudit.setFieldValue('custrecord_description', message);
		newAudit.setFieldValue('custrecord_processed', 'FALSE');
		newAudit.setFieldValue('custrecord_payload', payload);
		newAudit.setFieldValue('custrecord_status', 'Awaiting processing');

		auditID = nlapiSubmitRecord(newAudit, true);

	} catch (e) 
	{
		errorHandler("auditTrail", e + " : " + message);
	}

	return retVal;
}

/*******************************************************************************
 * 
 * run the saved searches
 * 
 ******************************************************************************/

function runSavedSearches(reportName, csvxml, type, criteria) 
{
	if (csvxml == 'CSV') 
	{
		runSavedSearch(0, 1000, true, reportName);
	} 
	else 
	{
		// xml
		runSavedSearchXMLWithCriteria(0, 1000, true, reportName, type, criteria);
	}

}

/*******************************************************************************
 * 
 * Function that runs the first saved search and write the results to the CSV
 * File
 * 
 ******************************************************************************/

function runSavedSearch(from, to, header, savedSearch) 
{
	var commaLine = '';

	// Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);

	// Running the loaded search
	var runSearch = loadSearch.runSearch();

	// Getting the first 1000 results
	var searchResults = runSearch.getResults(from, to);

	// calling the makeHeader function
	if (header == true) {
		fileLines = makeHeader(searchResults[0]);
		fileLines = fileLines + '\n';
	}

	// adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine) {
		commaLine = makeLine(srLine);
		fileLines = fileLines + commaLine + '\n';
	});

}

/*******************************************************************************
 * 
 * Function that runs the first saved search and write the results to the CSV
 * File
 * 
 ******************************************************************************/

function runSavedSearchXML(from, to, header, savedSearch) {
	var commaLine = '';

	// Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);

	// Running the loaded search
	var runSearch = loadSearch.runSearch();

	// Getting the first 1000 results
	var searchResults = runSearch.getResults(from, to);

	// adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine) {
		commaLine = makeXMLLine(srLine);
		// fileLines = fileLines+ commaLine + '\n';
		fileLines = fileLines + commaLine;
	});

}

/*******************************************************************************
 * //Define new search filter expression var newFilterExpression =[[
 * 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
 * 
 * //Override filters from previous search and save new search
 * mySearch.setFilterExpression(newFilterExpression);
 * mySearch.saveSearch('Opportunities salesrep dept', 'customsearch_kr2');/*
 * 
 * /************************************************************************************
 * 
 * Function that runs the first saved search and write the results to the CSV
 * File
 * 
 * filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5
 * ],'and',[ 'department', , 'anyOf', 3 ]];
 * 
 ******************************************************************************/

function runSavedSearchXMLWithCriteria(from, to, header, savedSearch, type,
		criteria) {
	var commaLine = '';

	// Loading the saved search
	var loadSearch = nlapiLoadSearch(type, savedSearch);

	// set the filter for the search

	if (criteria) {
		loadSearch.setFilterExpression(criteria);
	}

	// Running the loaded search
	var runSearch = loadSearch.runSearch();

	// Getting the first 1000 results
	var searchResults = runSearch.getResults(from, to);

	// adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine) {
		commaLine = makeXMLLine(srLine);
		// fileLines = fileLines + commaLine + '\n';
		fileLines = fileLines + commaLine;
	});

}

/*******************************************************************************
 * 
 * Function that creating the header line of the CSV File's data
 * 
 * @param firstLine
 * @returns
 * 
 ******************************************************************************/
function makeHeader(firstLine) {
	// Getting all the columns of the 1st line from the saved search results
	var cols = firstLine.getAllColumns();
	var hdr = [];

	/*
	 * callback function that gets the column labels under each column
	 */
	cols.forEach(function(c) {
		// Getting the custom label name of the column in saved search
		var lbl = c.getLabel();

		// if there is a custom label for the column
		if (lbl) {
			// Adding the column label to the hdr array
			hdr.push(escapeCSV(lbl));
			hdr.join(",");
		}
	});

	// returning the header array
	return hdr.join(",");
}

/*******************************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
 ******************************************************************************/

function makeLine(srchRow) {
	// Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = [];

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c) {
		// if there is a custom label name for each line then
		if (c.getLabel()) {
			// Getting the value of the particular value under the column and
			// adding it to the line array
			line.push(escapeCSV(srchRow.getText(c) || srchRow.getValue(c)));

			// Separate the values by a comma
			line.join(',');
		}
	});

	// returning the line array
	return line;
}

/*******************************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
 ******************************************************************************/

function makeXMLLine(srchRow) {
	// Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = '';
	var xmlstart = '';
	var xmlend = '';
	var fieldToAdd = '';
	var label = '';

	line = '<record>';

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c) 
			{
		label = c.getLabel();

		//label = label.replace(" ", "");

		xmlstart = '<' + label + '>';
		xmlend = '</' + label + '>';
		fieldToAdd = (srchRow.getText(c) || srchRow.getValue(c));


		//[TODO] when XML parser implemented properly, re-instate these commented out lines - including the one above

		//	if(fieldToAdd.length == 0)
		//	{
		//		xmlend = '<' + label + '/>';
		//		line = line + xmlend;
		//	}
		//	else
		//	{
		line = line + xmlstart + fieldToAdd + xmlend;
		//	}

			});

	line = line + '</record>';
	line = escapeCSV(line);

	// returning the line array
	return line;
}

/*******************************************************************************
 * Function that used to remove/escape particular signs/values
 * 
 * @param val
 * @returns
 ******************************************************************************/
function escapeCSV(val) {
	// Initialising local variables
	var returnValue;

	if (!val) {
		returnValue = '';
		// return returnValue;
	}

	else if (!(/[",\s]/).test(val)) {
		returnValue = val;
		// return val;
	}

	else {
		val = val.replace(/"/g, '""');
		returnValue = ('"' + val + '"');
	}

	return returnValue;
}

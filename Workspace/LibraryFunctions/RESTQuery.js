/*************************************************************************
 * Name: 	RESTQuery.js
 * Script: 	REST web service
 * Client: 	Rare
 * 
 * Version: 1.0.0 - 13 Jun 2012 - 1st release - JM
 *
 * Author: 	FHL
 * Purpose: REST Web Service for saved search queries

 * Script: xxx  
 * Deploy: xxxx  
 * 
 * URL 	/app/site/hosting/restlet.nl?script=96&deploy=1  
 * External URL 	https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=96&deploy=1  
 * **************************************************************************/

//Initialising Gloabal Variables
var fileLines='';

/**
 * handles the payload from the web service call
 * 
 */
function restMessage(datain)
{
	var contents='';
	var retVal = '';

	contents = datain.contents;

	//contents = '<stockitemexist>';
	
	//************************************************
	// run saved search for stock items
	//************************************************
	if(contents.indexOf('stockitemexist') != -1)
	{
		stockItemExist(contents);
		
	}
	
	retVal = auditTrail(contents);

	//contents = "customsearch_restquery";
	
	//runSavedSearches(contents,'XML');
		
	
	return fileLines;
}


/*
 * 
 * XML Message structure into netsuite 
 *  <stockitemexist>
 *		<itemcode></itemcode>
 *		<description></description>
 *	</stockitemexist>
 *
 * XML Message structure returned from NetSuite
 *  <stockitemexistsqueryresults>
 *     	<item>
 *			<itemcode></itemcode>
 *			<description></description>
 *       </item>
 *       <item>
 *			<itemcode></itemcode>
 *			<description></description>
 *       </item>
 *    </stockitemexistsqueryresults >
 *
 *
 */

function stockItemExist(query)
{
	var itemCode = '';
	var description = '';
	var savedSearch = '';
	var criteria = null;

	savedSearch = "customsearch_restquerystockitemexist";
	
	//criteria =[[ 'displayname', 'contains', 'BELTED' ]];
	criteria =[[ 'displayname', 'contains', 'BELTED TUNIC' ]];
	
	
	//criteria =[[ 'displayname', 'contains', 'BELTED' ],'and',[ 'department', , 'anyOf', 3 ]];
	//criteria =[[ 'displayname', 'contains', 'BELTED' ],'and',[ 'department', 'anyOf', 3 ]];
	
	runSavedSearches(savedSearch,'XML', 'item', criteria);


}

/**
 * creates an audit record and adds the CSV payload to it
 * 1.0.1 split out credit note number
 */
function auditTrail(message)
{

	var desc = 'Stock Transaction ' + Date();
	var auditID = 0;
	var retVal = 'OK';
	var newAudit = null;
	
	try
	{
		newAudit = nlapiCreateRecord('customrecord_stockaudit');
				
		newAudit.setFieldValue('name', desc);
		newAudit.setFieldValue('custrecord_description', desc);
		newAudit.setFieldValue('custrecord_processed', 'FALSE');
		newAudit.setFieldValue('custrecord_payload', message);
		newAudit.setFieldValue('custrecord_status', 'Awaiting processing');

		auditID = nlapiSubmitRecord(newAudit, true);
		
	}
    catch(e)
    {
    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
    	retVal = 'Upload Failed';
    }     	      

    return retVal;
}


/************************************************************************************
*
* run the saved searches
* 
************************************************************************************/


function runSavedSearches(reportName,csvxml,type,criteria)
{
	if(csvxml == 'CSV')
	{
		runSavedSearch(0,1000,true, reportName);
	}
	else
	{
		// xml
		runSavedSearchXMLWithCriteria(0,1000,true, reportName, type, criteria);
	}


}


/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 * 
 ************************************************************************************/

function runSavedSearch(from, to, header, savedSearch)
{
	var commaLine = '';

	//Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);
	
	//Running the loaded search
	var runSearch = loadSearch.runSearch();
	
	//Getting the first 1000 results
	var searchResults = runSearch.getResults(from,to);
	
	//calling the makeHeader function
	if(header==true)
	{
		fileLines = makeHeader(searchResults[0]);
		fileLines = fileLines + '\n';
	}	
	
	//adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine)
	{
		commaLine = makeLine(srLine);
		fileLines = fileLines+ commaLine + '\n';
	});
	
	
}


/************************************************************************************
*
* Function that runs the first saved search and write the results to the CSV File
* 
************************************************************************************/

function runSavedSearchXML(from, to, header, savedSearch)
{
	var commaLine = '';

	//Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);
	
	//Running the loaded search
	var runSearch = loadSearch.runSearch();
	
	//Getting the first 1000 results
	var searchResults = runSearch.getResults(from,to);
	
	//adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine)
	{
		commaLine = makeXMLLine(srLine);
		fileLines = fileLines+ commaLine + '\n';
	});
	
	
}


/*
//Define new search filter expression
var newFilterExpression =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
 
//Override filters from previous search and save new search
mySearch.setFilterExpression(newFilterExpression);
mySearch.saveSearch('Opportunities salesrep dept', 'customsearch_kr2');/*

/************************************************************************************
*
* Function that runs the first saved search and write the results to the CSV File
*
* filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
*
************************************************************************************/

function runSavedSearchXMLWithCriteria(from, to, header, savedSearch, type, criteria)
{
	var commaLine = '';

	//Loading the saved search
	var loadSearch = nlapiLoadSearch(type, savedSearch);
	
	// set the filter for the search
	loadSearch.setFilterExpression(criteria);
	
	//Running the loaded search
	var runSearch = loadSearch.runSearch();
	
	//Getting the first 1000 results
	var searchResults = runSearch.getResults(from,to);
	
	//adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine)
	{
		commaLine = makeXMLLine(srLine);
		fileLines = fileLines+ commaLine + '\n';
	});
	
	
}



/*******************************************************
 * 
 * Function that creating the header line of the CSV File's data
 * 
 * @param firstLine
 * @returns
 * 
 ******************************************************/
function makeHeader(firstLine)
{
	//Getting all the columns of the 1st line from the saved search results
	var cols = firstLine.getAllColumns();
	var hdr = [];
	
	/*
	 * callback function that gets the column labels under each column 
	 */
	cols.forEach(function(c)
	{
		//Getting the custom label name of the column in saved search
		var lbl = c.getLabel(); 
		
		//if there is a custom label for the column
		if(lbl)
		{
			//Adding the column label to the hdr array
			hdr.push(escapeCSV(lbl));
			hdr.join(",");
		}
	});
		
	//returning the header array
	return hdr.join(",");
}



/************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
*************************************************************/

function makeLine(srchRow)
{
	//Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = [];

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c)
	{
		// if there is a custom label name for each line then
		if(c.getLabel())
		{
			//Getting the value of the particular value under the column and adding it to the line array
			line.push(escapeCSV(srchRow.getText(c) || srchRow.getValue(c)));
			
			//Separate the values by a comma
			line.join(',');
		}
	});

	//returning the line array
	return line;
}


/************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
*************************************************************/

function makeXMLLine(srchRow)
{
	//Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = '';
	var xmlstart = '';
	var xmlend = '';
	var fieldToAdd = '';
	
	line = '<record>';

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c)
	{
		
		xmlstart = '<'+c.getLabel() + '>';
		xmlend = '</'+c.getLabel() + '>';
		fieldToAdd = (srchRow.getText(c) || srchRow.getValue(c));
		line = line + xmlstart + fieldToAdd + xmlend; 
		
	});

	line = line + '</record>';

	line = escapeCSV(line);
	
	//returning the line array
	return line;
}



/******************************************************************
 * Function that used to remove/escape particular signs/values
 * 
 * @param val
 * @returns
 *******************************************************************/
function escapeCSV(val)
{
	//Initialising local variables
	var returnValue; 
	
	if(!val)
	{
		returnValue = '';
		//return returnValue;
	}

	else if(!(/[",\s]/).test(val))
	{
		returnValue = val;
		//return val;
	}

	else
	{
		val = val.replace(/"/g, '""');
		returnValue = ('"'+ val + '"');
	}
	
	return returnValue;
}






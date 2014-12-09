/*******************************************************
 * Name:		StockReport
 * Script Type:	suitelet
 *
 * Version:	1.0.0 - 22/08/2012  
 * 			1.0.1 - Removing unwanted code runSavedSearchTwo 28/09/2012  -AS			
 *
 * Author:	FHL (AS) 
 * Purpose:	To combine two or more saved searches and create a CSV File
 **********************************************************************/


//Initialising Gloabal Variables
var fileLines='';



/*****************************************************
 *
 * The main function 
 * 
 * @param request
 * @param response
 * 
 ****************************************************/
function mergeSavedSearches(request,response)
{
	if ( request.getMethod() == 'GET' )
	{
		var form = nlapiCreateForm('Generate Stock Report');
		
		form.addSubmitButton('Start *');
		
		 //create the fields on the form and populate them with values from the previous screen
	    var delayMessage = form.addField('custpage_label', 'text', '* - THIS PROCESS WILL TAKE SEVERAL MINTUES. Please do NOT press Back, Refresh or Submit the form again.');
	    delayMessage.setDisplayType('inline');
	    
	    response.writePage(form);
	}
	else
	{
		runSavedSearches(request,response);
	}
	
}


/************************************************************************************
*
* run the saved searches
* 
************************************************************************************/


function runSavedSearches(request,response)
{
	

	var reportName = '';
	
	reportName = 'customsearch_stocknotpo';
	
	runSavedSearch(0,1000,true, reportName);
	runSavedSearch(1000,2000,false, reportName);
	runSavedSearch(2000,3000,false, reportName);
	runSavedSearch(3000,4000,false, reportName);
	runSavedSearch(4000,5000,false, reportName);
	runSavedSearch(5000,6000,false, reportName);
	runSavedSearch(6000,7000,false, reportName);

	reportName = 'customsearch_stockonpo';

	
	runSavedSearch(0,1000,false, reportName);
	runSavedSearch(1000,2000,false, reportName);
	runSavedSearch(2000,3000,false, reportName);
	runSavedSearch(3000,4000,false, reportName);
	runSavedSearch(4000,5000,false, reportName);
	runSavedSearch(5000,6000,false, reportName);
	runSavedSearch(6000,7000,false, reportName);
	
	
	writeToFile();


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
	var loadSearch = nlapiLoadSearch('item', savedSearch);
	
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
* writes to a file in the file cabinet 
* 
************************************************************************************/
function writeToFile()
{

	response.setContentType('CSV', "NM_Stock_Report.csv", 'attachment');
	//getDLFileName("CSV_")

	response.write(fileLines);

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


/**********************************************
 * 
 * Function that sets a name for the file
 * 
 *********************************************/
function getDLFileName(prefix)
{

	//var now = new Date();
	//nlapicreateFile
		//prefix = (prefix + "NM Stock Report" +".csv");
	
			//'-'+	now.getFullYear() + pad(now.getMonth()+1)+ pad(now.getDate()) + pad( now.getHours()) +pad(now.getMinutes()) + ".csv");
	
		
	return prefix;
}



/******************************************************
 * Function that use to make the name of the CSV file
 * 
 ******************************************************/
function pad(value)
{
	//Adding a '0' in front of the month if the month <10
	if(value < 10)
	{
		value = ("0"+value); 
	}
	
	return value;
	
}
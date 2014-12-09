/*************************************************************************
 * Name: 	RESTQueryTaxItems.js
 * Script: 	REST web service
 * Client: 	FirstPOS
 * 
 * Version: 1.0.0 - 7/02/2013 - 1st release - PAL

 * 			
 * Author: 	FHL
 * Purpose: REST Web Service for saved search queries

 * Script:  customscript_restquerytaxitem
 * Deploy:  customdeploy_restquerytaxitem
 * 
 * URL 			- /app/site/hosting/restlet.nl?script=109&deploy=1   
 * External URL - https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=109&deploy=1  
 * 
 * Library - RESTQueryTaxItems.js
 * **************************************************************************/


//Initialising Global Variables
var fileLines='';


/*********************************************************
 * handles the payload from the web service call (main function)
 *  returns the records in xml/csv format (in this case, returns it in xml format)
 *  version 1.1.1 - 24/01/2013 - adding <records> tag 
 **********************************************************/
function restMessage(datain)
{
	var contents='';
	var retVal = '';

	contents = datain.contents;

	//calling stockItemExist function
	taxItemExist(contents);
		
	//retVal = auditTrail(contents);
	
	// version 1.1.1 
	//adding the <records> tag for the whole records in order to align the lines in the text file
	fileLines = "<?xml version='1.0' encoding='utf-8'?>\n" + "<records>" +  fileLines + "</records>";
	
	return fileLines;
}



function taxItemExist(query)
{
	var savedSearch = '';


	//setting the saved search that is already created in the system
	savedSearch = "customsearch_firstpostaxitem";
	
	//criteria =[[ 'displayname', 'contains', 'BELTED' ]];
	
	//calling runSavedSearches function
	runSavedSearches(savedSearch,'XML', 'taxitem');


}


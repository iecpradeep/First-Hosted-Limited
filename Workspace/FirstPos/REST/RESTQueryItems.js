/*************************************************************************
 * Name: 	RESTQueryItems.js
 * Script: 	REST web service
 * Client: 	FirstPOS
 * 
 * Version: 1.0.0 - 23/01/2013 - 1st release - JM
 * 			1.1.0 - 24/01/2013 - adding replaceAll function - AS
 * 			1.1.1 - 24/01/2013 - adding <records> tag - AS 
 * 			1.1.2 - 25/01/2013 - refactoring the code 
 * 			
 * Author: 	FHL
 * Purpose: REST Web Service for saved search queries

 * Script:  customscript_restqueryitems
 * Deploy:  customdeploy_restqueryitems
 * 
 * URL 			- 	/app/site/hosting/restlet.nl?script=108&deploy=1   
 * External URL - https://rest.na1.netsuite.com/app/site/hosting/restlet.nl?script=108&deploy=1  
 * 
 * Library - n/a
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
	stockItemExist(contents);
		
	//retVal = auditTrail(contents);
	
	// version 1.1.1 
	//adding the <records> tag for the whole records in order to align the lines in the text file
	fileLines = "<?xml version='1.0' encoding='utf-8'?>\n" + "<records>" +  fileLines + "</records>";
	
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

	//setting the saved search that is already created in the system
	savedSearch = "customsearch_firstposstockitems";
	
	//criteria =[[ 'displayname', 'contains', 'BELTED' ]];
	
	//calling runSavedSearches function
	runSavedSearches(savedSearch,'XML', 'item');


}









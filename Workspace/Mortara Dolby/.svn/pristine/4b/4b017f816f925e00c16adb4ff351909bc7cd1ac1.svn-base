/******************************************************************************************************
 * Name:			Lot Number Search for Service Report
 * Script Type:		Suitelet (called by Client on Field Change)
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 22 Jun 2012 - first release - MJL
 * 			1.0.1 - 27 Jun 2012 - added way out of suitelet if non-lot numbered item is selected - MJL
 * 			1.0.2 - 28 Jun 2012 - added location filter to line items - MJL
 *			1.0.3 - 17 Jul 2012 - refactoring - isLotNumbered function - MJL
 *			1.0.4 - 17 Jul 2012 - error handling if no location selected - MJL
 *
 * Author:	FHL
 * Purpose:	Executes lot number search and adds to the Service Line Item
 * 
 * Suitelet: SL Lot Number Search
 * Script: customscript_sl_lotnumbersearch_suitelet
 * Deployment: customdeploy_sl_lotnumbersearch_suitelet
 * 
 * Client script: Fire SL Lot Number Suitelet
 * Script: customscript_sl_lotnumbersearch_client
 * Deployments: customdeploy_case_lotnumbersearch_client (Case)
 * 				customdeploy_sl_lotnumbersearch_client (Service Line Item)
 ******************************************************************************************************/

var form = null;
var fldLotNumbers = null;
var fldCustomFormID = null;
var submitButton = null;

var lotNumbersResults = null;
var itemCount = 0;

var inventNoID = null;
var inventNo = null;
var onHand = 0;

var itemIntID = 0;
var selectedLotNo = 0;
var formID = 0;
var locationID = 0;
var slSublistID = '';

/**
 * Calls the search suitelet on field change 
 * 
 * 1.0.2 added location filter
 * 1.0.3 refactor - isLotNumbered condition
 * 
 * @param type - the selected sublist ID
 * @param name - the ID of the changed field
 */
function fireSuitelet_OnFieldChange(type, name)
{
	if (name == 'custrecord_sl_item') 
	{
		var itemID = 0;
		var scriptID = 0;
		var context = nlapiGetContext();
		
		//get form ID
		formID = nlapiGetFieldValue('customform');
		
		if (formID == '52')
		{
			//get item code
			itemID = nlapiGetFieldValue(name);
			
			if (isLotNumbered(itemID)) //1.0.3
			{
				//get script ID parameter from deployment
				scriptID = context.getSetting('SCRIPT', 'custscript_sl_suitelet_id');
				
				// pass the script and item ID to the popup functions
				lotNumberPopup(scriptID, formID, itemID);
			}
		}
		else if (formID == '54')
		{
			//get item code
			itemID = nlapiGetCurrentLineItemValue(type, name);
			
			if (isLotNumbered(itemID)) //1.0.3
			{			
				locationID = nlapiGetFieldValue('custevent_sl_location');
				
				//get script ID parameter from deployment
				scriptID = context.getSetting('SCRIPT', 'custscript_sl_suitelet_id');
				
				//pass parameters to the popup function
				lotNumberPopup(scriptID, formID, itemID, locationID, type);
			}
		}
	}
}

/**
 * 1.0.1 checks if the item is a lot numbered item
 * 1.0.3 refactor - declare variables at top of function
 * 
 * @param itemID - internal ID of the item
 * @returns retVal - boolean value
 */
function isLotNumbered(itemID)
{
	//1.0.3
	var filter = null;
	var column = null;
	var results = null;
	
	var retVal = false;
	
	filter = new nlobjSearchFilter('internalid', null, 'is', itemID);
	column = new nlobjSearchColumn('islotitem');
	
	results = nlapiSearchRecord('lotnumberedinventoryitem', null, filter, column);
	
	if (results != null)
	{
		retVal = true;
	}	
	return retVal;
}

/**
 * Creates the popup containing the suitelet
 * 
 * @param scriptID - internal ID of the script record
 * @param formID - internal ID of the custom field used
 * @param itemID - internal ID of the item
 * @param locationID - internal ID of the item stock location
 * @param slSublistID - internal ID of the Service Item sublist (only passed from case form)
 */
function lotNumberPopup(scriptID, formID, itemID, locationID, slSublistID)
{
	var suiteletURL = null;
	var scriptDeployID = '1';
    var width = 450; 
    var height = 175; 
	var params = 'width=' + width +', height =' + height;
	params += ', directories=no';
    params += ', location=yes'; 
    params += ', menubar=no'; 
    params += ', resizable=yes'; 
    params += ', scrollbars=no'; 
    params += ', status=no'; 
    params += ', toolbar=no'; 
    params += ', fullscreen=no';
    
    //automatically build the URL with the follow parameters
    suiteletURL = nlapiResolveURL('SUITELET', scriptID, scriptDeployID);
    suiteletURL += '&custpage_formid=' + formID;
    suiteletURL += '&custpage_itemid=' + itemID; 
    suiteletURL += '&custpage_locationid=' + locationID;
    suiteletURL += '&custpage_sublistid=' + slSublistID;

    //open the window with the URL and the parameters
    window.open(suiteletURL, 'Lot Numbers', params);
}

/**
 * Initiates the suitelet and gets parameters from URL
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns true
 */
function lotNumSearch(request, response)
{
	//get parameters from URL
	formID = request.getParameter('custpage_formid');
	itemIntID = request.getParameter('custpage_itemid');
	slSublistID = request.getParameter('custpage_sublistid');
	locationID = request.getParameter('custpage_locationid');
	
	//create Lot Numbers
	createForm(request, response);
	
	return true;
}

/**
 * Creates the lot numbers form and calls lot number search 
 * 
 * 1.0.4 added location ID check and error catch before running search
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns retVal - boolean value
 */
function createForm(request, response)
{
	var retVal = null;
	
	if (request.getMethod() == 'GET')
	{
		//create new form
		form = nlapiCreateForm('Lot Numbers', true);
		
		//add fields and populate
		fldLotNumbers = form.addField('lotnumber', 'select', 'Select Lot Number'); //.setBreakType('startcol');
		fldCustomFormID = form.addField('customformid', 'integer', 'Form ID').setDisplayType('hidden'); //.setBreakType('startcol');
		fldSublistID = form.addField('slsublistid', 'text', 'Sublist ID').setDisplayType('hidden');
		form.setFieldValues({location: locationID, customformid: formID, slsublistid: slSublistID});
		fldLotNumbers.addSelectOption('', '', true);
		
		//1.0.4
		if (locationID != 0)
		{
			//create and run search, process results
			lotNumbersResults = createLotNumberSearch();
			lotNumbersResults.forEachResult(processResult);

			//if no results, throw error
			if (itemCount == 0) 
			{
				response.write('No Lot Numbers for this item in this Location.');
				retVal = false;
			}
			
			//create button
			submit = form.addSubmitButton();
			
			//write the form to the page
			response.writePage(form);
			retVal = true;
		}
		else
		{
			response.write("<h3>Information</h3><p>A location must be selected before choosing a lot number.</p>");
			retVal = false;
		}
	}
	else 
	{	
		//call posting routine
		retVal = postLotNumber(request, response);
	}
	return retVal;
}

/**
 * Posts the selected lot number back to the form
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns retVal - boolean value
 */
function postLotNumber(request, response)
{	
	var retVal = null;
	
	try
	{
		//get values from the suitelet form
		selectedLotNo = request.getParameter('lotnumber');
		formID = request.getParameter('customformid');
		slSublistID = request.getParameter('slsublistid');
		
		nlapiLogExecution('AUDIT', 'Selected Lot No Int ID', selectedLotNo);
		nlapiLogExecution('AUDIT', 'Custom form ID', formID);
		
		//populate lot number field on the Case or Service Item form
		var addNewScript = '';
		addNewScript = '<script type="text/javascript">';
		
		if (formID == '52') //Case
		{
			addNewScript += 'window.opener.nlapiSetFieldValue(\'custrecord_sl_lotnumber\',\'' + selectedLotNo + '\', true, true);';
		}
		else if (formID == '54') //Service Item
		{
			addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'' + slSublistID + '\',\'custrecord_sl_lotnumber\',\'' + selectedLotNo + '\', true, true);';
		}
		
		//close suitelet
		addNewScript += 'close(); </script>';
		response.write(addNewScript);
		
		retVal = true;
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot post lot number to Service Line form', e.message);
		retVal = false;
	}
	return retVal;
}

/**
 * Processes each result from search and adds 
 * a field select option for each 
 * 
 * @param eachResult - search result object
 * @returns retVal - boolean value
 */
function processResult(eachResult)
{	
	var retVal = null;
	
	try
	{
		//start counter for error checking
		itemCount++;
		
		//get values for this result
		inventNoID = eachResult.getId();
		inventNo = eachResult.getValue('inventorynumber');
		
		// populate the selection field
		fldLotNumbers.addSelectOption(inventNoID, inventNo);
		
		//return true to keep iterating
		retVal = true;
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Could not process search results', e.message);
		retVal = false;
	}
	return retVal;
}

/**
 * Creates and runs search for inventory numbers
 * associated with a particular item code 
 * 
 * 1.0.2 added location and on hand filters
 * 
 * @returns resultSet - nlobjSearchResultSet object
 */
function createLotNumberSearch()
{
	var objLotNumberSearch = null;
	var filters = new Array();
	var columns = new Array(); 
	var resultSet = null;
	
	//search filters
	filters[0] = new nlobjSearchFilter('item', null, 'is', itemIntID);
	filters[1] = new nlobjSearchFilter('location', null, 'is', locationID);
	filters[2] = new nlobjSearchFilter('quantityonhand', null, 'greaterthan', 0);
	
	//return columns
	columns[0] = new nlobjSearchColumn('inventorynumber');
	columns[1] = new nlobjSearchColumn('item');
	
	//create search object and run
	objLotNumberSearch = nlapiCreateSearch('inventorynumber', filters, columns);
	resultSet = objLotNumberSearch.runSearch();
	
	//return results
	return resultSet;
}
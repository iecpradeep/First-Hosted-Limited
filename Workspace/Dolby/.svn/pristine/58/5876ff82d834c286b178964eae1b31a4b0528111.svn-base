/*******************************************************************************************************************************************
 * Name:			Opportunity customisation (populateSerialItem.js)
 * Script Type:		Suitelet (called by Client on Field Change)
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 30 Apr 2012 - first release - AN
 * 			1.0.1 - 13 Jul 2012 - field change - populate custom record sublist - MJL (removed as of 1.0.4)
 * 			1.0.2 - 16 Jul 2012 - clears body fields on demo stock tab - MJL (removed as of 1.0.4)
 * 			1.0.3 - 16 Jul 2012 - added start and end dates - MJL
 * 			1.0.4 - 09 Aug 2012 - transferring functionality to custom record sublist - MJL
 *  		1.0.5 - 14 Aug 2012 - internal ID for 'value' parameter instead of inventory number - MJL
 *  		1.0.6 - 15 Aug 2012 - bug fix - back button now works - MJL
 *  		1.0.7 - 16 Aug 2012 - added validation of start and end dates before line commit - MJL
 *  		1.1.0 - 03 Sep 2012 - major addition - integration of loan stock - MJL
 *  		1.1.1 - 07 Sep 2012 - remove duplicates from item list - MJL
 *  		1.1.2 - 07 Sep 2012 - apply to all forms - MJL
 *
 * Author:	FHL
 * Purpose:	Executes saved search and places results into the demo stock sublist on Opportunity record or loan stock sublist on Case record
 *******************************************************************************************************************************************/

// declare global variables
var sublistID = '';

//1.0.4 made field variables global
var stepOneSelectObj = null;
var stepOneDemoStockLocationdisabled = null;
var stepOneDemoStockLocation = null;
var stepOneDemoStockName = null;
var stepOneSublist = null;

var stepTwoSelectSerial = null;
var stepTwoDemoStockLocation = null;
var stepTwoDemoStockName = null;
var stepTwoDemoStockItemName = null;
var stepTwoSublist = null;
var stepTwoBackLocation = null;
var stepTwoBackLocationText = null;
var stepTwoBackSublist = null;

var thisItemText = ''; //1.1.1
var itemCount = 0;
var sum = 0;
var itemSum = 0;
var resultSet = null;
var serialResultSet = null;
var assistant = null;
var step = null;
var selectObj = null;
var selectSerial = null;

var isDebug = false;


//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>> CLIENT >>>>>>>>>>>>>>>>>>>>>
//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

function hideBackButton()
{
	try
	{
		document.getElementById('tbl_back').style.display = 'none';
		
		document.getElementById('tdbody_back').style.display = 'none';
	}
	catch(e)
	{
		//[TODO] Needs some form of error handling
	}
}

/**
 * Field change function
 * 
 * 1.1.0 added trigger for loan stock + debug code
 * 1.1.2 applied trigger to all forms
 * 
 * @param type
 * @param name
 * @param linenum
 * @returns {Boolean}
 */
function popSerialFieldTwo(type, name, linenum)
{	
	var recType = '';
	var locationName = 0;
	var locationTextName = '';
	var scriptDeployID = 0;
	var retVal = false;
	
	if(isDebug) //1.1.0
	{
		nlapiLogExecution('DEBUG', 'In field change function');
		alert('name: ' + name);
	}
	
	if(name == 'custrecord_demostock_location' || name == 'custrecord_loanstock_loc') //1.1.0
	{	
		recType = nlapiGetRecordType();	//1.1.2
		
		//get the location
		locationName = nlapiGetCurrentLineItemValue(type, name);
		locationTextName = nlapiGetCurrentLineItemText(type, name);
		
		scriptDeployID = nlapiGetContext().getSetting('SCRIPT', 'custscript_oppo_client_did');

		if((locationName != null || locationName.length != '0') && recType == 'opportunity') //1.1.0 + 1.1.2
		{
			nlapiSetCurrentLineItemValue(type, 'custrecord_demostock_item', '', false, true);
			nlapiSetCurrentLineItemValue(type, 'custrecord_demostock_serialno', '', false, true);
		}
		else if ((locationName != null || locationName.length != '0') && recType == 'supportcase') //1.1.0 + 1.1.2
		{
			nlapiSetCurrentLineItemValue(type, 'custrecord_loanstock_item', '', false, true);
			nlapiSetCurrentLineItemValue(type, 'custrecord_loanstock_serial', '', false, true);
		}
		
		//pass the location & text to the popup functions
		popup(type, locationName, locationTextName, scriptDeployID);
		retVal = true;
	}	
	return retVal;
}

/**
 * Creates the suitelet window
 * 
 * @param locationName		the location selected by the user on the form
 * @param locationTextName	the location NAME selected the user on the form
 * @param scriptNumber		the script deployment number
 */
function popup(sublistID, locationName, locationTextName, scriptNumber)
{
    var width  = 650; 
    var height = 485; 
    var suiteletURL = '';
    var deployID = 1;
	var params = 'width=' + width +', height =' + height;
	params += ', directories= no';
    params += ', location=yes'; 
    params += ', menubar=no'; 
    params += ', resizable=yes'; 
    params += ', scrollbars=no'; 
    params += ', status=no'; 
    params += ', toolbar=no'; 
    params += ', fullscreen=no'; 
    
    //automatically build the URL with the follow parameters
    suiteletURL = nlapiResolveURL('SUITELET', scriptNumber, deployID);
    
    //add the follow variables to pass
    suiteletURL += '&custparam_sublistid=' + sublistID;
    suiteletURL += '&custparam_locationname=' + locationName;
    suiteletURL += '&custparam_locationtext=' + locationTextName;
    
    //open the window with the URL and the parameters
    window.open(suiteletURL, 'Get Serial Numbers', params);
}

/**
 * Validate line function
 * 
 * 1.0.7 Checks that the selected start date occurs before the end date
 * 1.1.0 Validates start and end dates on loan stock custom record
 */
function validateStartAndEndDates(type)
{
	var startDate = '';
	var endDate = '';
	var objStartDate = null;
	var objEndDate = null;
	
	var retVal = true;
	
	if (type == 'recmachcustrecord_demostock_opp' || type == 'recmachcustrecord_loanstock_case')
	{
		if (type == 'recmachcustrecord_demostock_opp')
		{
			startDate = nlapiGetCurrentLineItemValue(type, 'custrecord_demostock_startdate');
			endDate = nlapiGetCurrentLineItemValue(type, 'custrecord_demostock_enddate');
		}
		else
		{
			startDate = nlapiGetCurrentLineItemValue(type, 'custrecord_loanstock_start'); //1.1.0
			endDate = nlapiGetCurrentLineItemValue(type, 'custrecord_loanstock_end'); //1.1.0
		}
		
		objStartDate = nlapiStringToDate(startDate);
		objEndDate = nlapiStringToDate(endDate);
		
		if (objEndDate < objStartDate)
		{
			alert('Please ensure that the start date does not occur after the end date.');
			retVal = false;
		}
	}
	return retVal;
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>> SUITELET >>>>>>>>>>>>>>>>>
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

/**
 * Main function: creates assistant
 * 
 * 1.1.0 renamed assistant to account for loan stock integration
 * 
 * @param request			
 * @param response
 * @returns {Boolean}
 */
function populateFieldSuitelet(request, response)
{
	var retVal = false;
	
	nlapiLogExecution('AUDIT', 'CODE START WITH METHOD', request.getMethod());
	
	// create the assistant
	assistant = nlapiCreateAssistant('Choose Serial Number', true); //1.1.0
	assistant.setOrdered(true);
	
	// add the steps to the assistant
	assistant.addStep('step1', 'step1');
	assistant.addStep('step2', 'step2');
	
	if(request.getMethod() == 'GET')
	{
		getMethod();
		retVal = true;
	}
	else
	{
		postMethod();
		retVal = true;
	}
	
	return retVal;
}

/**
 * Creates assistant steps
 */
function getMethod()
{
	// If initial step, set the Splash page and set the intial step
	if (assistant.getCurrentStep() == null)
	{
		assistant.setCurrentStep(assistant.getStep('step1'));
	}
	
	// get the current step for the wizard
	step = assistant.getCurrentStep();
	
	// print out current step
	nlapiLogExecution('AUDIT', 'Current step', step.getName());
	
	// step selection
	if (step.getName() == 'step1')
	{
		stepOne();
	}
	if (step.getName() == 'step2')
	{
		stepTwo();
	}
}

/**
 * Creates assistant step one: select item
 * 
 * 1.1.0 renamed fields to account for loan stock integration
 */
function stepOne()
{
	var stepOneSublistID = '';
	var stepOneLocationName = '';
	var stepOneLocationText = '';
	var retVal = true;
	
	stepOneSublistID = request.getParameter('custparam_sublistid');
	stepOneLocationName = request.getParameter('custparam_locationname');
	stepOneLocationText = request.getParameter('custparam_locationtext');
	
	// add assistant field elements - 1.1.0 
	stepOneSelectObj = assistant.addField('custpage_stepone_selectfield', 'select', 'Serial Numbered Items').setMandatory(true);
	stepOneDemoStockLocationdisabled = assistant.addField('custpage_stepone_dslocationdisabled', 'text', 'Selected Location').setDisplayType('disabled').setDefaultValue(stepOneLocationText);
	stepOneDemoStockLocation = assistant.addField('custpage_stepone_dslocation', 'text', 'Selected Location').setDisplayType('hidden').setDefaultValue(stepOneLocationText);
	stepOneDemoStockName = assistant.addField('custpage_stepone_dsname', 'text', 'Selected Name').setDisplayType('hidden').setDefaultValue(stepOneLocationName);
	stepOneSublist = assistant.addField('custpage_stepone_sublistid', 'text', 'Sublist ID').setDisplayType('hidden').setDefaultValue(stepOneSublistID);

	// try to act on results
	try
	{	
		resultSet = createSearch(stepOneLocationName);		
				
		// for each result call the function encapsulated
		resultSet.forEachResult(processResult);
		
		// shows the item count
		nlapiLogExecution('AUDIT', 'Result itemCount', itemCount);

		// display the items placed into the sum and item sum fields
		nlapiLogExecution('AUDIT', 'itemSum', itemSum);
		
		// if no items found, show error and return false
		if(itemCount == 0)
		{
			response.write('<h3>Error</h3><p>The Location you have selected does not contain any Items.</p>'); //1.1.0
			retVal = false;
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Cannot populate item select field', e.message);
		retVal = false;
	}
	
	response.writePage(assistant);	
	
	return retVal;
}

/**
 * Creates assistant step two: select serial number
 * 
 * 1.0.6 added hidden fields to enable the back button
 * 1.1.0 renamed assistant to account for loan stock integration
 */
function stepTwo()
{
	var prevStepOne = null;
	var stepTwoLocationText = '';
	var stepTwoLocationName = '';
	var stepTwoItemName = '';
	var stepTwoSublistID = '';
	var retVal = false;
	
	prevStepOne = assistant.getStep('step1');
	
	stepTwoLocationText = prevStepOne.getFieldValue('custpage_stepone_dslocation');
	stepTwoLocationName = prevStepOne.getFieldValue('custpage_stepone_dsname');
	stepTwoItemName = prevStepOne.getFieldValue('custpage_stepone_selectfield');
	stepTwoSublistID = prevStepOne.getFieldValue('custpage_stepone_sublistid');
	
	nlapiLogExecution('AUDIT', 'Step One Item Number', stepTwoItemName);
	nlapiLogExecution('AUDIT', 'Step One Location Name', stepTwoLocationName);
	nlapiLogExecution('AUDIT', 'Step One Location Text', stepTwoLocationText);
	
	//1.1.0
	stepTwoSelectSerial = assistant.addField('custpage_steptwo_serial', 'select', 'Serial Number').setMandatory(true);
	stepTwoDemoStockLocation = assistant.addField('custpage_steptwo_dslocation', 'text', 'Selected Location').setDisplayType('hidden').setDefaultValue(stepTwoLocationText);
	stepTwoDemoStockName = assistant.addField('custpage_steptwo_dsname', 'text', 'Selected Name').setDisplayType('hidden').setDefaultValue(stepTwoLocationName);
	stepTwoDemoStockItemName = assistant.addField('custpage_steptwo_dsitem','text','Item Name').setDisplayType('hidden').setDefaultValue(stepTwoItemName);
	stepTwoSublist = assistant.addField('custpage_steptwo_sublistid', 'text', 'Sublist ID').setDisplayType('hidden').setDefaultValue(stepTwoSublistID);
	
	//1.0.6
	stepTwoBackLocation = assistant.addField('custpage_steptwo_backlocation', 'text', 'Location ID For Back Button').setDisplayType('hidden').setDefaultValue(stepTwoLocationName); 
	stepTwoBackLocationText = assistant.addField('custpage_steptwo_backlocationtext', 'text', 'Location Text For Back Button').setDisplayType('hidden').setDefaultValue(stepTwoLocationText);
	stepTwoBackSublist = assistant.addField('custpage_steptwo_backsublistid', 'text', 'Sublist ID For Back Button').setDisplayType('hidden').setDefaultValue(stepTwoSublistID);
	
	try
	{
		// create the search and return the results
		serialResultSet = createSerialSearch(stepTwoItemName, stepTwoLocationName);	
		serialResultSet.forEachResult(processSerialResult);
		response.writePage(assistant);
		retVal = true;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Cannot populate serial number select field', e.message);
	}
	return retVal;
}

/**
 * Posts item ID and serial number to Opportunity form
 * 
 * 1.0.6 get new hidden field values for back button
 * 1.1.0 added setters for loan stock values 
 */
function postMethod()
{
	var postSublistID = '';
	var postItemName = '';
	var postSerialNumber = '';
	
	var addNewScript = '';
	
	var backSublistID = '';
	var backLocationText = '';
	var backLocationName = '';
	var params = new Array();
	
	var retVal = false;
	
	// 1: if they clicked the finish button, mark setup as done and redirect to assistant page */
	if (assistant.getLastAction() == 'finish')
	{
		nlapiLogExecution('AUDIT', 'BUTTON ACTION', 'Finish Button Pressed');
		
		assistant.setCurrentStep(assistant.getStep('step1'));
		
		postSublistID = request.getParameter('custpage_steptwo_sublistid');
		postItemName = request.getParameter('custpage_steptwo_dsitem');
		postSerialNumber = request.getParameter('custpage_steptwo_serial');
		
		nlapiLogExecution('AUDIT', 'Sublist ID', postSublistID);
		nlapiLogExecution('AUDIT', 'Item name', postItemName);
		nlapiLogExecution('AUDIT', 'Serial number', postSerialNumber);
		
		//1.0.4
		addNewScript = '<script type="text/javascript">';
		
		if (postSublistID == 'recmachcustrecord_demostock_opp') //1.1.0
		{
			addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'' + postSublistID + '\',\'custrecord_demostock_item\',\'' + postItemName + '\', true, true);';
			addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'' + postSublistID + '\',\'custrecord_demostock_serialno\',\'' + postSerialNumber + '\', true, true);';
		}
		else
		{
			//1.1.0
			addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'' + postSublistID + '\',\'custrecord_loanstock_item\',\'' + postItemName + '\', true, true);';
			addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'' + postSublistID + '\',\'custrecord_loanstock_serial\',\'' + postSerialNumber + '\', true, true);';
		}
		
		addNewScript += 'close(); </script>';
		
		response.write(addNewScript);
		retVal = true;
	}
	
	// 2: if they clicked the "cancel" button, take them to a different page (setup tab) altogether as appropriate.
	if (assistant.getLastAction() == 'cancel')
	{
		nlapiLogExecution('AUDIT', 'BUTTON ACTION', 'Cancel Button Pressed');
		
		assistant.setCurrentStep(assistant.getStep('step1'));
		
		addNewScript = '<script type="text/javascript">'; 
		addNewScript += 'close(); </script>';	
		
		response.write(addNewScript);
		retVal = true;
	}
	// 3: For all other actions (next, back, jump), process the step and redirect to assistant page
	if (assistant.getLastStep().getName() == 'step1' && assistant.getLastAction() == 'next') 
	{
		nlapiLogExecution('AUDIT', 'BUTTON ACTION', 'Next Button Pressed');
		
		assistant.setCurrentStep(assistant.getNextStep());
		assistant.sendRedirect(response);
		
		retVal = true;
	}
	if (assistant.getLastAction() == 'back')
	{	
		nlapiLogExecution('AUDIT', 'BUTTON ACTION', 'Back Button Pressed');
		
		assistant.setCurrentStep(assistant.getStep('step1'));
		
		backSublistID = request.getParameter('custpage_steptwo_backsublistid'); //1.0.6
		backLocationName = request.getParameter('custpage_steptwo_backlocation'); //1.0.6
		backLocationText = request.getParameter('custpage_steptwo_backlocationtext'); //1.0.6
		
		nlapiLogExecution('AUDIT', 'Sublist ID', backSublistID);
		nlapiLogExecution('AUDIT', 'Original Location ID', backLocationName);
		nlapiLogExecution('AUDIT', 'Original Location Text', backLocationText);
		
		params['custparam_sublistid'] = backSublistID;
		params['custparam_locationname'] = backLocationName;
		params['custparam_locationtext'] = backLocationText;
		
		nlapiSetRedirectURL('SUITELET', 'customscript_oppo_popup', 'customdeploy_oppo_pop_deploy', false, params);
		retVal = true;
	}
	return retVal;
}

/**
 * Searches for items in selected location
 */
function createSearch(locationName)
{	
	var filters = new Array();	
	var columns = new Array();
	var search = null;
	
	// Define search filters
	filters[0] = new nlobjSearchFilter('quantityavailable', null, 'greaterthan', 0);
	filters[1] = new nlobjSearchFilter('location', null, 'is', locationName);

	// Define search columns
	columns[0] = new nlobjSearchColumn('item');
	columns[1] = columns[0].setSort();
	
	// Create the saved search
	search = nlapiCreateSearch('inventorynumber', filters, columns);

	// run the search
	resultSet = search.runSearch();
	
	nlapiLogExecution('AUDIT', 'Item search ran');
	return resultSet;
}

/**
 * Adds items in selected location to select field
 * 
 * 1.1.1 remove duplicates from item list
 */
function processResult(eachResult)
{
	//start counter for error checking
	itemCount++;
	
	// process the search results
	itemSum += '\n' + eachResult.getValue('item'); 
	
	if (thisItemText != eachResult.getText('item')) //1.1.1
	{
		// populate the selection field
		stepOneSelectObj.addSelectOption(eachResult.getValue('item'), eachResult.getText('item'));
		thisItemText = eachResult.getText('item'); //1.1.1
	}
	
	// return true to keep iterating
	return true;
}

/**
 * Searches for serial numbers for selected item in selected location
 */
function createSerialSearch(itemName, locationName)
{	
	var filtersSerial = new Array();
	var columnsSerial = new Array();
	var search = null;
	
	nlapiLogExecution('AUDIT', 'Within serial search routine: Location', locationName);
	nlapiLogExecution('AUDIT', 'Within serial search routine: Item', itemName);
	
	//Define search filters
	filtersSerial[0] = new nlobjSearchFilter('quantityavailable', null, 'greaterthan', 0);
	filtersSerial[1] = new nlobjSearchFilter('item', null, 'is', itemName);
	filtersSerial[2] = new nlobjSearchFilter('location', null, 'is', locationName);

	//Define search columns
	columnsSerial[0] = new nlobjSearchColumn('inventorynumber');
	columnsSerial[1] = columnsSerial[0].setSort();
	
	//Create the saved search
	search = nlapiCreateSearch('inventorynumber', filtersSerial, columnsSerial);

	//run the search
	serialResultSet = search.runSearch();
	
	nlapiLogExecution('AUDIT', 'Serial search ran');	
	return serialResultSet;
}

/**
 * Add select options to Serial Number select field
 * 
 * 1.0.5 internal ID for 'value' parameter instead of inventory number - MJL
 */
function processSerialResult(eachResult)
{	
	//populate the selection field
	stepTwoSelectSerial.addSelectOption(eachResult.getId(), eachResult.getValue('inventorynumber'));

	//return true to keep iterating
	return true;
}

/**
* generic search - returns internal ID
*
* 1.0.4 added
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
				var itemSearchResult = itemSearchResults[0];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		//errorHandler(e);
	}     	      
	return internalID;
}

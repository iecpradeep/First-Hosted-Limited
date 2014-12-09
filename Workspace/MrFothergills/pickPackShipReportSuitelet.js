/*****************************************************************************
 *	Name		:	pickPackShipReportSuitelet.js
 *  Script Type	:	suitelet
 *	Client		: 	Mr. Fothergills
 *
 *	Version		:	1.0.0 - 31 May 2013 - First Release - AS
 *					1.1.0 - 17 Jun 2013 - load default start and end batch numbers and save submitted numbers if different - MJL
 *					1.1.1 - 25 Jun 2013 - corrected bug when passing location URL parameter - MJL
 *					1.1.2 - 27 Jun 2013 - added RKY Assembly Report - MJL
 *					1.1.3 - 28 Jun 2013 - pull through report from URL - MJL
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To Create the Pick, Pack and Ship Reports
 * 
 *  Script		: 	customscript_ppsreport	
 * 	Deploy		: 	customdeploy_ppsreport
 * 
 * 	Library		: 	Library.js
 * 
 ***************************************************************************/

var objRequest = null;
var objResponse = null;
var locationFromURL = null;
var reportIDFromURL = null;

//declaring global variables
var selectionForm = '';
var selectedLocation = '';
var selectedStartBatchNo = 0 ;
var selectedEndBatchNo = 0 ;
var selectedReportName = 0;
var selectedprinted = 'F';
var loadedSavedSearch =  0;

/***************************************************************************
 * accessVATChecker Function - The main function
 * 
 * @param request
 * @param response
 **************************************************************************/
function pickpackshipReport(request,response)
{
	try
	{
		objRequest = request;
		objResponse = response;
		
		//getting the method type
		if (request.getMethod() == 'GET')
		{	
			//1.1.0 load location ID and default start and end batch numbers - MJL
			initialise();
			
			//Creates custom form
			createSelectionForm();
			response.writePage(selectionForm);			//writing the form 
		}
		
		//if 'POST' method called (clicking the button)
		else
		{
			//1.1.0 load location ID and default start and end batch numbers - MJL
			initialise();
			loadResults();
			//processPPSRecords();
		}
	}
	catch(e)
	{
		errorHandler('pickpackshipReport', e);
	}

}

/***************************************************************************
 * initialise Function - initialise the static variables used in the script
 * 
 * 1.1.1 corrected bug when passing location URL parameter - MJL
 * 1.1.3 pull through report from URL - MJL
 * 
 **************************************************************************/
function initialise()
{
	try
	{
		//1.1.0 get location Id from URL
		locationFromURL = objRequest.getParameter('custparam_locationid');
		
		//1.1.3 get report Id from URL
		reportIDFromURL = objRequest.getParameter('custparam_reportid');
		
		//Load start and end batch numbers from CRS 
		startBatch = loadBatchNumbers(locationFromURL, 'start');
		endBatch = loadBatchNumbers(locationFromURL, 'end');
		
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

/***************************************************************************
 * createSelectionForm Function - creating the selection form to get the user input
 * 
 * 1.1.0 - load default start and end batch numbers and save submitted numbers if different - MJL
 * 1.1.1 - corrected bug when passing location URL parameter - MJL
 * 1.1.3 - pull through report from URL - MJL
 * 
 **************************************************************************/
function createSelectionForm()
{
	var addLocation = '';
	var addReport = '';
	var fldStartBatch = null;
	var fldEndBatch = null;

	try
	{
		//batchNumbers = genericSearchColumnReturn('customrecord_mrf_pickpackship', 'custrecord_pps_process', 'F', 'custrecord_batchnumber');
		selectionForm = nlapiCreateForm('Report Criteria Selection');			//creating the form
		
		addLocation = selectionForm.addField('custpage_ppslocation', 'select', 'Location', 'location');
		addLocation.setMandatory(true);											//making the field mandatory
		
		//1.1.0 set location from URL and lock field - MJL
		if (locationFromURL != null)
		{
			addLocation.setDefaultValue(locationFromURL); //1.1.1 MJL
			addLocation.setDisplayType('inline'); //1.1.1 MJL
		}
		
		addReport = selectionForm.addField('custpage_reportname', 'select', 'Report Name', 'customlist_ppsreportlist');
		addReport.setMandatory(true);
		
		//1.1.3 set report from URL and lock field - MJL
		if (reportIDFromURL != null)
		{
			addReport.setDefaultValue(reportIDFromURL); //1.1.3 MJL
			addReport.setDisplayType('inline'); //1.1.3 MJL
		}
		
		fldStartBatch = selectionForm.addField('custpage_ppsstartbatchnumber', 'text', 'Start Batch Number');
		fldEndBatch = selectionForm.addField('custpage_ppsendbatchnumber', 'text', 'End Batch Number');
		fldStartBatch.setMandatory(true); //1.1.0 MJL
		fldEndBatch.setMandatory(true); //1.1.0 MJL
		
		//1.1.0 set default values for start and end batch numbers
		if (startBatch != -1 && endBatch != -1)
		{
			fldStartBatch.setDefaultValue(startBatch);
			fldEndBatch.setDefaultValue(endBatch);
		}
		
		//selectionForm.addField('custpage_markprinted', 'checkbox', 'Mark as Printed?');
		selectionForm.addSubmitButton('Create Report');										//adding the submit button

	}
	catch(e)
	{
		errorHandler('createSelectionForm', e);
	}
}



/*******************************************************
 * get form data - getting the user inputs
 * 
 * 1.1.0 compare submitted batch numbers to those stored in CRS - MJL
 ********************************************************/
function getFormData()
{

	try
	{
		//Get filter information from form
		selectedLocation = objRequest.getParameter('custpage_ppslocation');
		selectedStartBatchNo = objRequest.getParameter('custpage_ppsstartbatchnumber');
		selectedEndBatchNo  = objRequest.getParameter('custpage_ppsendbatchnumber');
		selectedReportName = objRequest.getParameter('custpage_reportname');
		//selectedprinted = request.getParameter('custpage_markprinted');
		
		//1.1.0 save new start and end batch number if submitted numbers differ from saved - MJL
		if (selectedStartBatchNo != startBatch && selectedEndBatchNo != endBatch)
		{
			saveBatchNumbers(selectedLocation, selectedStartBatchNo, selectedEndBatchNo);
		}
	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}

}



/*******************************************************
 * loadResults - load saved search results and setting the new filters
 * 
 ********************************************************/
function loadResults()
{
	var ppsFilters = new Array();
	var savedSearchInternalID = 0;
	var outputPage = '';
	//var confirmMessage = '';
	//var filterFlag = false;
	var searchID = '';
	var locationName = '';
	var reportName = '';
	
	try
	{
		//calling getFormData function
		getFormData();
		
		//getting the name of the location
		locationName = nlapiLookupField('location', selectedLocation, 'name');
		
		//getting the name of the report
		reportName = nlapiLookupField('customlist_ppsreportlist', selectedReportName, 'name');	
		
		//calling setSavedSearchIDToLoad function
		searchID = setSavedSearchIDToLoad(locationName,reportName);

		if(searchID != 0)
		{
			//loading the existing saved search
			loadedSavedSearch = nlapiLoadSearch('customrecord_mrf_pickpackship', searchID);
	
			//creating the filters
			ppsFilters[0] = new nlobjSearchFilter('custrecord_batchnumber', null, 'between', selectedStartBatchNo, selectedEndBatchNo);
			ppsFilters[1] = new nlobjSearchFilter('custrecord_pps_location', null, 'is', selectedLocation);
			ppsFilters[2] = new nlobjSearchFilter('custrecord_pps_process', null, 'is', 'F');

			loadedSavedSearch.setFilters(ppsFilters);			//setting the new filters
			
			//saveing the saved search with new filters
			loadedSavedSearch.saveSearch(reportName, searchID);
			
			//geting the internal ID of the saved search
			savedSearchInternalID = loadedSavedSearch.getId();
			
			//confirmMessage = '<html><body><script type="text/javascript">window.confirm("Do You Want To Mark These results As Printed?");</script>';
			//outputPage = confirmMessage;
			
			//redirecting to the particular saved search
			outputPage = '<html><body><script type="text/javascript">window.location.href=\'https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid='+savedSearchInternalID + '&whence=\';</script><p>Error: No parameters passed.</p>';

		}
		else
		{
			//displaying an error message
			outputPage = '<html><body><script type="text/javascript"></script><p>Error: The report doesn\'t exists.Please Please enter the correct details again.</p>';

		}
		
		response.write(outputPage);
	}
	catch(e)
	{
		errorHandler('loadResults', e);
	}
}



/*******************************************************
 * processPPSRecords - mark the PPS records as printed
 *  
 ********************************************************/
function processPPSRecords()
{
	var runSS = '';
	var ssResults = '';

	try
	{
		if(selectedprinted == 'T')
		{
			runSS = loadedSavedSearch.runSearch();
			ssResults = runSS.getResults(0,1000);
			nlapiLogExecution('debug', 'ssResults length', ssResults.length);
		}
		
	}
	catch(e)
	{
		errorHandler('processPPSRecords', e);
	}

}



/*******************************************************
 * setSavedSearchIDToLoad - setting which saved search to load
 * 
 * 1.1.2 added RKY Assembly Report - MJL
 * 
 ********************************************************/
function setSavedSearchIDToLoad(location, report)
{
	var savedSearchID = '';
	
	try
	{
		//setting the savedsearchID to load
		if(location == 'KMO' && report == 'KMO - Bin Number Sequence')		
		{
			savedSearchID = 'customsearch_kmobinnumberlocation';
		}
		else if(location == 'KMO' && report == 'KMO - Delivery Reference Sequence')	
		{
			savedSearchID = 'customsearch_kmodeliveryreferencesequenc';
		}
		else if(location == 'JRH' && report == 'JRH - Pick Notes')	
		{
			savedSearchID = 'customsearch_jrhpicknotes';
		}
		else if(location == 'RKY' && report == 'RKY - Pre - Pick Note')	
		{
			savedSearchID = 'customsearch_prepicknote';
		}
		else if(location == 'RKY' && report == 'RKY - Clean Pick Note')	
		{
			savedSearchID = 'customsearch_rkycleanpicknote';
		}
		else if(location == 'RKY' && report == 'PR: Pick Pack and Ship Assembly Report - do not delete')	//1.1.2 MJL
		{
			savedSearchID = 'customsearch_pps_assembly_report';
		}
		else
		{
			savedSearchID = 0;
		}
	}
	catch(e)
	{
		errorHandler('setSavedSearchIDToLoad', e);
	}

	return savedSearchID;
}
/**********************************************************************************************************
 * Name:        Pick, Pack & Ship (deletePPSrecords.js)
 * Script Type: Suitelet
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 22 Nov 2012 - first release - JM
 * Version:     1.0.1 - 04 Dec 2012 - amended - location delete added
 *  
 * Author:      FHL
 * Purpose:     Remove previous PPS records
 * 
 * Script:     	customscript_removeppsrecords 
 * Deploy:      customdeploy_deleteppsrecords 
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var selectionForm = null;
var location = 0;
var fldLocation = null;
var processMessage = '';

/**
 * delete PPS Records
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function deletePPSRecords(request, response)
{


	if (request.getMethod() == 'GET')
	{
		//create and display selection form
		createDeletionForm();
		response.writePage(selectionForm);
	}
	else
	{
		//remove all existing records
		if(getFormData()==true)
		{			
			deleteallrecordsWithFilter('customrecord_mrf_pickpackship','custrecord_pps_location', location );
		}
		createResultsForm();
		response.writePage(selectionForm);
	}



}

/**
 * Creates PPS selection form
 */
function createDeletionForm()
{

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Pick Pack & Ship: Delete Previous PPS Records');
		fldLocation = selectionForm.addField('custpage_pps_location','select','Location','location'); 

		//Create submit button
		selectionForm.addSubmitButton('Click here to delete the previous PPS records');

	}
	catch (e)
	{
		errorHandler('createDeletionForm', e);

	}


}

/**
 * Creates PPS selection form
 */
function createResultsForm()
{

	var script = null;

	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm(processMessage);
		script = "alert('" + processMessage + "')";
		selectionForm.addButton('custombutton', processMessage, script);

	}
	catch (e)
	{
		errorHandler('createFinishedForm', e);

	}

}

/**
 * get form data
 */

function getFormData()
{

	var retVal = false;

	try
	{
		//Get filter information from form
		location = request.getParameter('custpage_pps_location');

		if(location!=0)
		{
			processMessage = 'Pick Pack & Ship: Deletion Complete';
			retVal = true;
		}
		else
		{
			processMessage = 'Pick Pack & Ship: You must select a location - no records were deleted';
		}

	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}

	return retVal;

}

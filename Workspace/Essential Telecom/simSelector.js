/**********************************************************************************************************
 * Name:        simSelector.js
 * Script Type: Suitelet
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 04 Feb 2013 - changing the filter for finding the sims - AS
 *  			1.0.2 - 14 Feb 2013 - changing the internal id of the filter - AS
 *  			1.0.3 - 14 Mar 2013 - Altered populateSims to search by phone number - AM
 *  			1.0.4 - 01 May 2013 - changing custrecord_cashsalereference in 'Sim Card' custom record set and the 
 *  									code to custrecord_invoicereference - AS
 *  			1.0.5 - 28 May 2013 - changing the record type of the custrecord_sim_phone_number in Sim card 
 *  									CRS to decimal Number from free-form text - AS
 *  								- adding From and To fields to the form - AS
 *  								- adding filters to search for range of sims - AS
 *  			1.0.6 - 09 Jun 2013 - commenting out the search Field related code as the phone number is now a decimal number- AS
 *  
 * Author:      FHL
 * Purpose:     Allow multiple sims to be selected (items separated by chr(5))
 * 
 * Script:      customscript_simSelector
 * Deploy:     	customdeploy_simSelector
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var simSelect = null;
var selectionForm = null;
//var searchCriteria = '';
var fromSim = null;
var toSim = null;

var searchFrom = '';
var searchTo = '';

/**
 * Top-level function called by Script Deployment
 */
function simSelector(request, response)
{
	var retVal = false;
	
	if (request.getMethod() == 'GET')
	{
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else
	{
		
		if(searchSims()==false)
		{
			// post
			retVal = postSims(request, response);
		}
		else
		{
			createSelectionForm();
			response.writePage(selectionForm);
		}
	}
	
	return retVal;
}

/**
 * create sim selection form
 * 
 *  version 1.0.5 - adding From and To fields to the form 
 *  		1.0.6 - commenting out the search Field related code as the phone number is now a decimal number							
 */
function createSelectionForm()
{
	try
	{
		
		//Create selection form
		selectionForm = nlapiCreateForm('Sim Selection',true);
		//selectionForm.setScript(nlapiGetContext().getScriptId());  //get the current script id since the function is in the same file

		//Create submit button
		selectionForm.addSubmitButton('Done.');

		//selectionForm.addField('custpage_searchfield','text', 'Search');
		
		//version 1.0.5
		fromSim = selectionForm.addField('custpage_fromfield','text', 'From');
		fromSim.setDisplaySize(30, 1);
		
		toSim = selectionForm.addField('custpage_tofield','text', 'To');
		toSim .setDisplaySize(30, 1);

		//Create fields
		simSelect = selectionForm.addField('custpage_simnumbers','multiselect','Sim');
		simSelect.setDisplaySize(250, 15);
		simSelect.setLayoutType('startrow', 'startcol');
		
		populateSims();
		
	}
	catch (e)
	{
		errorHandler('createSelectionForm', e);

	}
}


/**
 * search sims
 * 
 * version 1.0.5 - adding filters to search for range of sims
 */

function searchSims()
{
	var retVal = false;
	
	try
	{
		//getting parameters
		searchCriteria = request.getParameter('custpage_searchfield');
		
		//version 1.0.5
		searchFrom = request.getParameter('custpage_fromfield');  	
		searchTo = request.getParameter('custpage_tofield');

		//version 1.0.5
		//if(searchCriteria.length!=0)
		if (searchFrom.length != 0 && searchTo.length != 0)
		{
			retVal = true;
		}
		
	}
	catch(e)
	{
		errorHandler('searchSims', e);
	}
	
	return retVal;


}

/**
 * Looks up locations to add to location filter field
 * writePage
 * 
 * version 1.0.1 - changing the filter for finding the sims - AS
 * version 1.0.2 - changing the internal id of the filter - AS
 * version 1.0.3 - 14 Mar 2013 - Altered populateSims to search by phone number - AM
 * version 1.0.4 - 01 May 2013 - changing custrecord_acshsalereference in 'Sim Card' custom record set and the 
 *  						code to custrecord_invoicereference - AS
 *  version 1.0.5 - adding filters to search for range of sims
 */
function populateSims()
{
	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();
	var searchResults = null;
	var searchFilterIndex = 0;
	try
	{
		// filter  
		//version 1.0.2, 1.0.4
		searchFilters[searchFilterIndex] = new nlobjSearchFilter('custrecord_invoicereference', null, 'anyOf', '@NONE@');	//'invoice Reference' field is empty
	
		/*if(searchCriteria.length!=0)
		{
			searchFilters[++searchFilterIndex] = new nlobjSearchFilter('custrecord_sim_phone_number', null, 'contains', searchCriteria);
		}*/
		
		//version 1.0.5
		if(searchFrom.length != 0 && searchTo.length != 0)
		{
			searchFrom = parseInt(searchFrom);
			searchTo = parseInt(searchTo);

			searchFilters[++searchFilterIndex] = new nlobjSearchFilter('custrecord_sim_phone_number', null, 'between', searchFrom, searchTo);
		
		}
		
		// return columns
		searchColumns[0] = new nlobjSearchColumn('custrecord_sim_phone_number');

		// perform search
		searchResults = nlapiSearchRecord('customrecord_sim_card', null, searchFilters, searchColumns);
	
		if(searchResults!=null)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
				simSelect.addSelectOption(searchResults[i].getValue(searchColumns[0]), searchResults[i].getValue(searchColumns[0]), false);
					
			} 
		}	
	}
	catch(e)
	{
		errorHandler('populateSims', e);
	}     	      
}

/**
 * post sims back to cash sale line
 * 
 * @param request
 * @param response
 */
function postSims(request, response)
{
	var addNewScript = '';
	var selectedSims = null;
	var retVal = false;
	
	try
	{
		selectedSims = request.getParameter('custpage_simnumbers');
		
		addNewScript = '<script type="text/javascript">';
		addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'item\',\'custcol_simnumbers\',\'" + selectedSims + "\', true, true);";
		addNewScript += 'close(); </script>';
		
		response.write(addNewScript);
		retVal = true;
		
	}
	catch(e)
	{
		errorHandler("postSims", e);		
	}
	
	return retVal;
	

}
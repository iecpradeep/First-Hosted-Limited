/**********************************************************************************************************
 * Name:        returnAuthorisationCustomer.js
 * Script Type: Suitelet
 * Client:      Keison
 * 
 * Version:     1.0.0 – 09/04/2013 – 1st release - AM
 *  
 * Author:      FHL
 * Purpose:     Provide a window that allows Customer Returns to be selected.
 * 
 * Script:      customscript_returnauthorisationcustomer
 * Deploy:     	customdeploy_returnauthorisationcustomer
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

// Global variables
var returnSelect = null;
var selectionForm = null;

/*************************************************************************************
 * Top-level function called by Script Deployment
 * 
 * 
 *************************************************************************************/
function selectorMain(request, response)
{
	var retVal = false;
	
	if (request.getMethod() == 'GET')
	{
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else
	{
		// Post
		retVal = postReturns(request, response);
	}
	
	return retVal;
}

/*************************************************************************************
 * createSelectionForm
 * 
 * Create a form
 *************************************************************************************/
function createSelectionForm()
{
	try
	{
		// Create selection form
		selectionForm = nlapiCreateForm('Customer Returns',true);

		// Create submit button
		selectionForm.addSubmitButton('Select');

		// Create select fields
		returnSelect = selectionForm.addField('custpage_custreturns','select','Customer Returns');
		populateSelect();	
	}
	catch (e)
	{
		errorHandler('createSelectionForm', e);
	}
}


/*************************************************************************************
 * populateSelect
 * 
 * Search the Vendor Authorised Returns and add them to a select field
 *************************************************************************************/
function populateSelect()
{
	var filters = new Array();
	var columns = new Array();

	try
	{	
		filters[0] =  new nlobjSearchFilter('mainline', null, 'is', 'T');
		filters[1] =  new nlobjSearchFilter('type', null, 'is', 'RtnAuth');

		columns[0] = new nlobjSearchColumn('internalid');
		columns[1] = new nlobjSearchColumn('mainname');
		columns[2] = new nlobjSearchColumn('tranid');

		// Search record
		var searchResults = nlapiSearchRecord('transaction',null, filters, columns);
		
		if(searchResults!=null)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
				returnSelect.addSelectOption(searchResults[i].getValue(columns[2]), searchResults[i].getValue(columns[2]) + ' - ' + searchResults[i].getText(columns[1]));
			} 
		}	
	}
	catch(e)
	{
		errorHandler('populateSelect', e);
	}     	      
}

/*************************************************************************************
 * postReturns
 * 
 * Populate the field on the form with the parameter of the select field
 * 
 * @param request
 * @param response
 * @returns {Boolean}
 *************************************************************************************/
function postReturns(request, response)
{
	var addNewScript = '';
	var selectedReturns = null;
	var retVal = false;
	 
	try
	{
		selectedReturns = request.getParameter('custpage_custreturns');
		
		addNewScript = '<script type="text/javascript">';
		addNewScript += "window.opener.nlapiSetFieldValue(\'custbody_customerreturns\',\'" + selectedReturns + "\', true, true);";
		addNewScript += 'close(); </script>';
		
		response.write(addNewScript);
		retVal = true;
	}
	catch(e)
	{
		errorHandler("postReturns", e);		
	}
	
	return retVal;
}

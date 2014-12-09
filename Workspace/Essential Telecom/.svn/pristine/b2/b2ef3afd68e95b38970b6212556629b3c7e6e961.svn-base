/**********************************************************************************************************
 * Name:        voucherSelector.js
 * Script Type: Suitelet
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 04 Feb 2013 - changing the filter for finding vouchers - AS#
 * 				1.0.2 - 14 Feb 2013 - changing the internal id of the filter - AS
 * 				1.0.3 - 14 Mar 2013 - Altered populateVouchers to display type - AM
 *  			1.0.4 - 01 May 2013 - changing custrecord_cashsaleref in 'Vouchers' custom record set and the 
 *  						code to custrecord_invoiceref - AS
 *  			1.0.5 - 28 May 2013 - setting the size of the multi select field - AS
 *  								- Changing the displaying of the voucher in the invoice - AS
 *  			1.0.6 - 21 May 2013 - sorting the vouchers depending on the voucher value - AS
 *  			1.0.7 - 07 June 2013 - getting the voucher Type Internal id to get rid of magic numbers - AS
 *  
 * Author:      FHL
 * Purpose:     Allow multiple vouchers to be selected
 * 
 * Script:      customscript_voucherSelector
 * Deploy:     	customdeploy_voucherSelector
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var voucherSelect = null;
var selectionForm = null;

/**
 * Top-level function called by Script Deployment
 */
function vouhcerSelector(request, response)
{
	var retVal = true;
	
	if (request.getMethod() == 'GET')
	{
		createSelectionForm();
		response.writePage(selectionForm);
	}
	else
	{
		// post
		retVal = postvouchers(request, response);
	}
	
	return retVal;
}

/**
 * create voucher selection form
 * version 1.0.5 - setting the size of the multi select field
 */
function createSelectionForm()
{
	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Voucher Selection',true);

		//Create submit button
		selectionForm.addSubmitButton('Done.');

		//Create fields
		voucherSelect = selectionForm.addField('custpage_vouchernumbers','multiselect','Vouchers');
		
		//version 1.0.5
		voucherSelect.setDisplaySize(400, 18);		//setting the field size
		populateVouchers();
		
	}
	catch (e)
	{
		errorHandler('createSelectionForm', e);

	}
}

/**
 * Looks up locations to add to location filter field
 * writePage
 * 
 * version 1.0.1 - 04 Feb 2013 - changing the filter for finding vouchers - AS
 * version 1.0.2 - 14 Feb 2013 - changing the internal id of the filter - AS
 * version 1.0.3 - 14 Mar 2013 - Altered populateVouchers to display type - AM
 * version 1.0.4 - 01 May 2013 - changing custrecord_acshsalereference in 'Sim Card' custom record set and the 
 *  						code to custrecord_invoicereference - AS
 * version 1.0.5 - 28 May 2013 - Changing the displaying of the voucher in the invoice - AS
 * version 1.0.6 - 21 May 2013 - sorting the vouchers depending on the voucher value - AS
 * version 1.0.7 - 07 June 2013 - getting the voucher Type Internal id to get rid of magic numbers - AS
 */
function populateVouchers()
{
	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();
	var searchResults = null;
	var voucherNumber = '';
	var voucherType = '';
	var vType =  '';
	var voucherValue = '';

	try
	{
		//version 1.0.7
		//getting the internal ID of the voucher type
		voucherType = genericSearch('customlist_vouchertype', 'name', 'Physical Voucher');
	
		// filter 
		// version 1.0.1
		// version 1.0.2
		//version 1.0.4
		searchFilters[0] = new nlobjSearchFilter('custrecord_invoiceref', null, 'anyOf', '@NONE@');		// no cash 
		searchFilters[1] = new nlobjSearchFilter('custrecord_vouchertype', null, 'is', voucherType);					

		// voucher type is physical voucher
		
		// return columns
		searchColumns[0] = new nlobjSearchColumn('custrecord_vouchernumber');
		searchColumns[1] = new nlobjSearchColumn('custrecord_vouchertype');
		searchColumns[2] = new nlobjSearchColumn('custrecord_vtype');
		searchColumns[3] = new nlobjSearchColumn('custrecord_vouchervalue');
		
		//version 1.0.6
		searchColumns[4] = searchColumns[3].setSort();							//sorting by voucher value
		
		// perform search
		searchResults = nlapiSearchRecord('customrecord_vouchers', null, searchFilters, searchColumns);
		
		
		if(searchResults!=null)
		{
			for (var i = 0; i < searchResults.length; i++)
			{	
				voucherNumber = searchResults[i].getValue(searchColumns[0]);
				vType =  searchResults[i].getValue(searchColumns[2]);
				voucherValue = searchResults[i].getValue(searchColumns[3]);
				
				//voucherSelect.addSelectOption(searchResults[i].getValue(searchColumns[0]), searchResults[i].getText(searchColumns[1]) + " - " + searchResults[i].getValue(searchColumns[0])+ " - " + searchResults[i].getValue(searchColumns[2]));
				//version 1.0.5
				voucherSelect.addSelectOption(voucherNumber + ' - GBP' + voucherValue , voucherNumber + " - " + vType + '  - GBP' + voucherValue );
				
			} 
		}	
	}
	catch(e)
	{
		errorHandler('populatevouchers', e);
	}     	      
}

/**
 * post vouchers back to cash sale line
 * 
 * @param request
 * @param response
 */
function postvouchers(request, response)
{
	var addNewScript = '';
	var selectedvouchers = null;
	var retVal = false;
	var voucherValues = '';
	
	try
	{

		selectedvouchers = request.getParameter('custpage_vouchernumbers');
				
		addNewScript = '<script type="text/javascript">';
		addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'item\',\'custcol_vouchers\',\'" + selectedvouchers  + "\', true, true);";
//		addNewScript += "window.opener.nlapiCommitCurrentLineItem(\'item\');";
//		addNewScript += "window.opener.nlapiSelectNewLineItem(\'item\');";
		addNewScript += 'close(); </script>';
		
		response.write(addNewScript);
		
		retVal = true;
		
	}
	catch(e)
	{
		
		errorHandler("postvouchers", e);		
	}
	
	return retVal;
	

}



/**********************************************************************************************************
 * Name:        salesOrderQuickAddSuitelet.js
 * Script Type: Suitelet
 * Client:      Mr Fothergills
 * 
 * Version:     1.0.0 - 14/05/2013 - first release - AM
 *  
 * Author:      FHL
 * 
 * Purpose:     Easy selection of items for the Sales Order.
 * 
 * Script:      customscript_salesorderquickaddsuitelet
 * Deploy:     	customdeploy_salesorderquickaddsuitelet
 * 
 * Library:   	offersLibrary.js
 **********************************************************************************************************/

//Global Variables 
var selectionForm = null;
var itemCode = '';
var itemEntered = '';
var qty = 0;
var quantityEntered = 0;
var hiddencustomerBrand = 0;
var hiddenCustomer = null;
var customerBrand = 0;
var custBrandParam = 0;
var custParam = 0;
var customer = 0;
var errorText = '';
var errorDisplay = '';

var itemId = 0;
var itemBrand = 0;
var errorLabel = '';
var stockStatus = 0;

var itemlines = '';
var itemcodecol = '';
var qtycol = 0;
var selectedItem = null;
var lineCount = 0;

var itemLinesArray = new Array();
var itemArray = new Array;
var qtyArray = new Array();


/**
 * - itemSelector
 * 
 * Top-level function called by Script Deployment
 * 
 * @param request
 * @param response
 */
function itemSelector(request, response)
{
	if (request.getMethod() == 'GET')
	{
		//Get the parameters and create the form
		getParams(request, response);
		createSelectionForm(request, response);
		response.writePage(selectionForm);
	}
	//POST
	else
	{
		//Check the Search Criteria
		if(getSearchCriteria(request, response)==true)
		{
			postItems(request, response);
		}
		else
		{
			createSelectionForm(request, response);
			response.writePage(selectionForm);
		}
	}
}


/**
 * - getParams
 * 
 * Get the parameter information
 * 
 * @param request
 * @param response
 */
function getParams(request, response)
{
	try
	{
		custBrandParam = request.getParameter('custparam_brand');		
		customer = request.getParameter('custparam_cust');

		//Set errorDisplay display
		errorDisplay = 'hidden';
	}
	catch (e)
	{
		errorHandler('checkCustomerBrand', e);
	}
}


/**
 * createSelectionForm
 * 
 * Create an item selection form
 * 
 * @param request
 * @param response
 */
function createSelectionForm(request, response)
{
	try
	{
		//CreateSselection Form
		selectionForm = nlapiCreateForm('Add Item',true);

		//Create Buttons
		selectionForm.addSubmitButton('Submit');

		//Create Fields
		errorLabel = selectionForm.addField('custpage_errorlabel','text', 'Error').setDefaultValue(errorText);
		selectionForm.getField('custpage_errorlabel').setDisplaySize(37, 10);
		selectionForm.getField('custpage_errorlabel').setDisplayType(errorDisplay);

		hiddenCustomer = selectionForm.addField('custpage_hiddencustomer','integer','Customer Id').setDefaultValue(customer);
		selectionForm.getField('custpage_hiddencustomer').setDisplaySize(10, 10);
		selectionForm.getField('custpage_hiddencustomer').setDisplayType('hidden');

		hiddencustomerBrand = selectionForm.addField('custpage_hiddencustomerbrand','integer','Customer Brand Id').setDefaultValue(custBrandParam);
		selectionForm.getField('custpage_hiddencustomerbrand').setDisplaySize(10, 10);
		selectionForm.getField('custpage_hiddencustomerbrand').setDisplayType('hidden');

		//Create SubList
		itemlines = selectionForm.addSubList('custpage_sublist_itemlines', 'inlineeditor', 'Add Items', 'itemlines');
		itemCode = itemlines.addField('custpage_custcol_item', 'text', 'Item Code').setMandatory(true);
		itemlines.setLineItemValues(itemCode);
		qty = itemlines.addField('custpage_custcol_quantity', 'integer', 'Quantity').setMandatory(true);
		itemlines.setLineItemValues(qty);
	}
	catch(e)
	{
		errorHandler('createSelectionForm ', e);
	}
}


/**
 * - getSearchCriteria
 * 
 * Get the search criteria entered by the user
 * 
 * @param request
 * @param response
 * @returns {Boolean}
 */
function getSearchCriteria(request, response)
{
	var retVal = false;
	
	try
	{
		customerBrand = request.getParameter('custpage_hiddencustomerbrand');
		customer = request.getParameter('custpage_hiddencustomer');

		lineCount = request.getLineItemCount('custpage_sublist_itemlines');
		
		var lines = lineCount;

		for (var i=1; i <= lines; i++)
		{

			//Get the parameters entered	
			itemEntered = request.getLineItemValue('custpage_sublist_itemlines', 'custpage_custcol_item', i);
			quantityEntered = request.getLineItemValue('custpage_sublist_itemlines', 'custpage_custcol_quantity', i);
			
			//Search the Item Code Entered
			selectedItem = genericSearch('item', 'itemid', itemEntered);
			
			qtyArray.push(quantityEntered);
			itemArray.push(selectedItem);
		}

		//Check Item and customer Brands
		lookUpItemBrand();
		lookUpCustomerBrand();
		lookUpStock();

		retVal = custAndItemBrand(request, response);
	}
	catch(e)
	{
		errorHandler('getSearchCriteria ', e);
	}

	return retVal;
}

/**
 * - lookUpItemBrand
 * 
 * Look up the Item Brand
 * 
 * @returns {Boolean}
 */
function lookUpItemBrand()
{
	var retVal = false;

	try
	{
		//Get the item id and look up the Item Brand
		itemId = genericSearch('item', 'itemid', itemEntered);
		itemBrand = nlapiLookupField('item', itemId, 'department');	
	}
	catch(e)
	{
		errorHandler('lookUpCustromerBrand ', e);
	}

	return retVal;
}

/**
 * - lookUpCustomerBrand
 * 
 * Reset the Customer Brand if wrong product code entered.
 * 
 * @returns {String}
 */
function lookUpCustomerBrand()
{
	var retVal = '';

	try
	{
		//Look up the customer Brand
		custBrandParam = nlapiLookupField('entity', customer, 'custentity_mrf_cust_brand');
		retVal = custBrandParam;
	}
	catch(e)
	{
		errorHandler('lookUpCustromerBrand ', e);
	}

	return retVal;
}

/**
 * - lookUpStock
 * [TODO] - Which Stock item field to look up?
 * 
 * @returns {String}
 */
function lookUpStock()
{
	var retVal = '';

	try
	{
		//Look up the stock status on the item
		itemId = genericSearch('item', 'itemid', itemEntered);
		stockStatus = nlapiLookupField('item', itemId, 'custitem_applyoos');

		retVal = stockStatus;
	}
	catch(e)
	{
		errorHandler('lookUpStock ', e);
	}

	return retVal;
}

/**
 * - custAndItemBrand
 * 
 * Check the Customers Brand against the Item Brand entered
 * 
 * @param request
 * @param response
 * @returns {Boolean}
 */
function custAndItemBrand(request, response)
{
	var retVal = false;

	try
	{
		//Check if the parameters are empty
		if( itemEntered.length != 0)
		{
			//Check if customer brand matches the Item Brand
			if (customerBrand == itemBrand)
			{
//				if(stockStatus == 'F')
//				{
					errorDisplay = 'hidden';
					retVal = true;
//					[TODO] - Check to see if item is in stock
//				}
//				else
//				{
//					errorDisplay = 'disabled';
//					errorText = 'This item is not in Stock!';			
//				}
			}
			else
			{
				errorDisplay = 'disabled';
				errorText = 'Please enter the correct branded item!';			
			}
		}
		else
		{
			errorDisplay = 'disabled';
			errorText = 'Please enter an item!';
		}
	}
	catch(e)
	{
		errorHandler('custAndItemBrand ', e);
	}

	return retVal;
}

/**
 * - postItems
 * 
 * Post the Item to the line
 * 
 * @param request
 * @param response
 */
function postItems(request, response)
{
	var addNewScript = '';
	var url = '';
	var scriptId = 0;

	try
	{
		//Check Environment and Account and set the URL
		if(getEnvironment() && getAccountID())
		{
			// Sandbox 1
			scriptId = 162;	
		}
		else
		{
			// Sandbox 2 & Production
			scriptId = 203;
		}	
		
		url = '/app/site/hosting/scriptlet.nl?script=' + scriptId + '&deploy=1&custparam_cust=' + customer + '&custparam_brand=' + customerBrand;

		addNewScript = '<script type="text/javascript">';		
		
		for (var i=1; i <= lineCount; i++)
		{			
			addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'item\',\'item\',\'" + itemArray[i-1] + "\', true, true);";
			addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'item\',\'custcol_itemdepartment\',\'" + itemArray[i-1] + "\', true, true);";
			addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'item\',\'quantity\',\'" + qtyArray[i-1] + "\', true, true);";				
			addNewScript += "window.opener.nlapiCommitLineItem('item');";	
		}
		
		addNewScript += "window.location.href='" + url + "';";
		addNewScript += '</script>';
		addNewScript += '<body onblur="self.focus();">';
		response.write(addNewScript);
	}
	catch(e)
	{
		errorHandler("postItems ", e);	
	}
}

/**
 * @returns {Boolean}
 * 
 * Check environment
 */
function getEnvironment()
{
	var retVal = false;
	var environment = null;
	var context = null;
	var enviromentType = '';
	
	try
	{
		context = nlapiGetContext();
		environment = context.getEnvironment();

		enviromentType = 'SANDBOX';

		if(environment == enviromentType)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('getEnviroment', e);
	}

	return retVal;
}


/**
 * @returns {Boolean}
 * 
 * Check account type
 */
function getAccountID()
{
	var retVal = false;
	var context = null;
	var company = null;
	var accountId = '';
	
	try
	{
		context = nlapiGetContext();		
		company = context.getCompany();
		
		// Sandbox 1 Account
		accountId = '3322617';// Sandbox 2 '3322617_2'
		
		if(company == accountId)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('getAccountID', e);
	}

	return retVal;
}

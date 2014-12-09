/**********************************************************************************************************
 * Name:        itemSelectorClient.js
 * Script Type: Client
 * Client:      Mr Fothergills
 * 
 * Version:     1.0.0 - 09 Jan 2013 - first release - AM
 * 				1.0.1 - 11/01/2013 - Addition of library.js and errorHandler - AM
 * 				1.0.2 - 11/04/2013 - Edited Definition of Variables "scriptNo" + "deployNo" - LG
 *  
 * Author:      FHL
 * 
 * Purpose:     To Call itemSelectorSuitelet.js when button is pressed.
 * 
 * Script:      customscript_itemselectorclient   
 * Deploy:      customdeploy_itemselectorclient
 * 
 * Libraries:   library.js
 * 
 * Form:		Sales Order
 **********************************************************************************************************/



/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function itemSelectorClient(type, name, linenum)
{
	try
	{
		loadItemSelectSuitlet();
	}
	catch(e)
	{
		alert('itemSelectorClient ' + e.message);
	}
}

/**
 * 
 * Load Window that calls itemSelectorSuitelet.js
 *  1.0.1 - Addition of library.js and errorHandler
 * 
 */
function loadItemSelectSuitlet(type)
{
	var context = null;
	var scriptNo = '';
	var deployNo = '';
	var suiteletURL = null;
	var params = ''; 
	var width = 800; 
	var height = 400; 
	var campaignCode = '';

	try
	{
		campaignCode = nlapiGetFieldValue('custbody_campaign');

		// Set the window variables.
		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=yes'; 
		params += ', menubar=no'; 
		params += ', resizable=yes'; 
		params += ', scrollbars=no'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';


		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();
		//[TODO] JM please look at this.
		//scriptNo = context.getSetting('SCRIPT', 'customscript_itemselectionsuitelet');
		//deployNo = context.getSetting('SCRIPT', 'customdeploy_itemselectionsuitelet');

		//1.0.2 - Edited Definition of Variables "scriptNo" + "deployNo" - LG
		scriptNo = 'customscript_itemselectionsuitelet';
		deployNo = 'customdeploy_itemselectionsuitelet';

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

		suiteletURL += '&custparam_campaigncode=' + campaignCode;

		window.open(suiteletURL, 'Item Selector', params);
	}
	catch(e)
	{
		errorHandler('loadItemSelectSuitlet ', e);
	}     	      
}





/**********************************************************************************************************
 * Name:        simSelectorClient.js
 * Script Type: Client - applies to Invoices
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 07 Jun 2013 - adding setAndValidatePartnerField function - AS
 *  			1.0.2 - 17 Jun 2013 - set the partner field values as the customer - AS
 *  
 * Author:      FHL
 * Purpose:     Allow multiple sims to be selected
 * 
 * Script:      customscript_simselectorclient  
 * Deploy:      customdeploy_simselectorclient  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/


/**
 * Main function
 * 
 * version 1.0.1 - adding setAndValidatePartnerField function
 * 
 */
function simSelectorClient(type)
{
	var partner = 0;

	
	if(checkIfSimItem()==true)
	{
		//version 1.0.1
		partner = setAndValidatePartnerField();	
		
		if(partner)
		{
			loadSimSelectSuitlet();
		}
		else
		{
			alert('Please enter a partner in order to proceed');
		}
		
	}

}


/**
 * validatePartnerField - checking whether the partner field is empty
 * 
 * version 1.0.1 - adding setAndValidatePartnerField function
 * version 1.0.2 - set the partner field values as the customer
 */
function setAndValidatePartnerField()
{
	var partnerIntID = 0;
	var customerIntID = 0;
	try
	{
		customerIntID = nlapiGetFieldValue('entity');
		
		if(customerIntID != 0)
		{

			nlapiSetFieldValue('partner', customerIntID);			//version 1.0.2
			partnerIntID = nlapiGetFieldValue('partner');	
		}
	}
	catch(e)
	{
		errorHandler("setAndValidatePartnerField", e);
	}

	return partnerIntID;
}


/**
 * check if the line item is a sim card
 * 
 */

function checkIfSimItem()
{

	var retVal = false;
	var item = '';
	var isSim = false;

	try
	{
	
		// get item code from current line
		item = nlapiGetCurrentLineItemText('item', 'item');

		if(item.length!=0)
		{

			// check if it's a sim
			isSim = genericSearchColumnReturn('item','itemid',item,'custitem_issim');

			if(isSim =='T')
			{
				retVal = true;
			}
		}

	}
	catch(e)
	{
		alert('error ' + e.message);
		errorHandler("checkIfSimItem", e);
	}     	      

	return retVal;

}

/**
 * load sim selector suitlet
 * 
 */

function loadSimSelectSuitlet(type)
{

	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	var params = ''; 
	var width = 700; 
	var height = 400; 


	try
	{

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

		scriptNo = context.getSetting('SCRIPT', 'custscript_scriptid');
		deployNo = context.getSetting('SCRIPT', 'custscript_deployid');

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

		window.open(suiteletURL, 'Sim Numbers', params);

	}
	catch(e)
	{
		errorHandler("simSelectorClient", e);
	}     	      

}

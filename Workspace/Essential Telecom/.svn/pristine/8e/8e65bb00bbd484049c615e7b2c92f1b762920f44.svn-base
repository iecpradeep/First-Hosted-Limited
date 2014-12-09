/**********************************************************************************************************
 * Name:        simUpdates.js
 * Script Type: User Event - applies to invoices
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 28 Jan 2013 - Formatting the date to NetSuite date format - AS
 *  							   - re-correcting 'if(custIntID != 0)' in 'createCustomer' function
 *  			1.0.2 - 14 Feb 2013 - Changing the sales order variables to cash sale - AS
 * 									- Changing the loadCSalesOrder() function to loadInvoice() function - AS
 * 									- Changing the loading of record 'Sales Order' record to 'Cash Sale' record - AS
 * 									- Changing the internal id of the 'setFieldValue' in Sim Cards Custom record set - AS
 * 				1.0.3 - 14 Mar 2013 - Altered updateSimCard genericSearch to search by sim card - AM
 * 				1.0.4 - 01 May 2013 - apply the code from cash Sales to Invoices - AS
 * 									- changing all the names from caslSale to invoice - AS
 * 									- changing the custrecord_cashsalereference id in the code and Sim Card' 
 * 											custom record set to custrecord_invoicereference - AS
 * 				1.0.5 - 28 May 2013 - changing the genericSearch function to genericSearchOperator - AS
 * 				1.0.6 - 29 May 2013 - making the 'partner' field in invoice optional. Hence setting the customer as the partner in sim record - AS
 * 				1.0.7 - 06 Jun 2013 -Adding the partner in the createCustomer function - AS
 * 				1.0.8 - 18 Jun 2013 - Adding the AR account to the new and old customers - AS
 * 
 * Author:      FHL
 * Purpose:     User event to update sim records from sales update and create customers for telephone numbers
 * 
 * Script:      customscript_simupdates
 * Deploy:     	customdeploy_simupdates  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var executionEnv = '';
var context = null;

//version- 1.0.2 - 14 Feb 2013 - Changing the sales order variables to cash sale - AS
var invoice = '';
var invoiceIntID = 0;

var tranID = 0;

var custIntID = 0;
var partnerIntID = 0;	// this is a customer ID
var currentRecord = null;
var invoiceCustomerIntID = 0;
 var CUSTOMERARACCOUNTNAME = '';
 var CUSTOMERARACCOUNTINTID = 0;
/**
 * main - starting point
 * version 1.0.2 - 14 Feb 2013 - Changing the loadCSalesOrder() function to loadInvoice() function - AS
 */

function simUpdates(type)
{

	initialise();
	loadInvoice();						//version 1.0.2
	checkEachOrderLineForSims();


}

/**
 * initialise
 *
 */
function initialise()
{
	try
	{
		CUSTOMERARACCOUNTNAME = 'Sim Customer A/R';
		CUSTOMERARACCOUNTINTID = genericSearch('account', 'name', CUSTOMERARACCOUNTNAME);
		context = nlapiGetContext();
		executionEnv = context.getExecutionContext();
	}
	catch(e)
	{	

		errorHandler("initialise", e);		
	}
}


/**
 * loadInvoice
 * 
 * version 1.0.2 - 14 Feb 2013 - Changing the loading of record 'Sales Order' record to 'Cash Sale' record - AS
 *
 */
function loadInvoice()
{
	
	try
	{
		// [TODO] edit left in for speed of dev - remove at end
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			invoiceIntID = nlapiGetRecordId();								
			currentRecord = nlapiLoadRecord('invoice', invoiceIntID);			//version 1.0.2
			partnerIntID = currentRecord.getFieldValue('partner');
			invoiceCustomerIntID = currentRecord.getFieldValue('entity');
			tranID = currentRecord.getFieldValue('tranid');
			
		}

	}
	catch(e)
	{
		errorHandler("loadInvoice", e);		
	}
}


/**
 * check each order line for sims and update customrecord_sim_card where found
 *
 */
function checkEachOrderLineForSims()
{

	var lines = null;
	var simNumbers = '';

	try
	{
		// [TODO] edit left in for speed of dev - remove at end
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			// Get the number of line items before submit
			lines = currentRecord.getLineItemCount('item');
			for ( var i = 1 ; i<= lines ; i++ )
			{
				simNumbers = nlapiGetLineItemValue('item', 'custcol_simnumbers', i);
				if(simNumbers)
				{
					forEachSimUpdateSimCardRecords(simNumbers);
				}
			}
	
		}

	}
	catch(e)
	{
		errorHandler("checkEachOrderLineForSims", e);		
	}


}

/**
 * for Each Sim Update Sim Card Records
 *
 */

function forEachSimUpdateSimCardRecords(simNumbersString)
{
	var simArray = new Array();
	var splitChar = '';

	try
	{

		splitChar = String.fromCharCode(5);

		simArray = simNumbersString.split(splitChar);

		for(var i = 0; i< simArray.length; i++)
		{
			updateSimCard(simArray[i]);
		}

	}
	catch(e)
	{
		errorHandler("forEachSimUpdateSimCardRecords", e);		
	}

}

/**
 * update a sim card
 * version 1.0.2 - Changing the internal id of the 'setFieldValue' in Sim Cards Custom record set - AS
 * version 1.0.3 - 14 Mar 2013 - Altered updateSimCard genericSearch to search by sim card - AM
 * version 1.0.4 - 01 May 2013 - changing the custrecord_cashsalereference id in the code and Sim Card' 
 * 									custom record set to custrecord_invoicereference - AS
 * version 1.0.5 - 28 May 2013 - changing the genericSearch function to genericSearchOperator - AS
 * 
 * version 1.0.6 - 29 May 2013 - making the 'partner' field in invoice optional. Hence setting the customer as the partner in sim record - AS
 * 
 */

function updateSimCard(simNumber)
{
	var simIntID = 0;
	var simRecord = null;
	var telNo = '';
	var custIntID = 0;
	var today = new Date();

	try
	{

		//version 1.0.5
		simIntID = genericSearchOperator('customrecord_sim_card','custrecord_sim_phone_number',simNumber,'equalto');
		simRecord = nlapiLoadRecord('customrecord_sim_card', simIntID);

		simRecord.setFieldValue('custrecord_invoicereference', invoiceIntID);			//version 1.0.2,version 1.0.4
		
		//version 1.0.6
		simRecord.setFieldValue('custrecord_sim_partner', invoiceCustomerIntID);
		
		//format the date in to dd/mm/yyyy
		//version 1.0.1 - 28/01/2013 - AS
		today = formatDate(today);
		
		simRecord.setFieldValue('custrecord_sim_procurement_date', today);

		//***************************************************
		// create the customer
		//***************************************************
		telNo = simRecord.getFieldValue('custrecord_sim_phone_number');
		custIntID = createCustomer(telNo);

		if(custIntID != 0)
		{
			simRecord.setFieldValue('custrecord_sim_customer', custIntID);
		}

		simIntID = nlapiSubmitRecord(simRecord, true);


	}
	catch(e)
	{
		errorHandler("updateSimCard", e);		
	}


}


/********************************************************************
 * formatDate - formatting the date according to NetSute date format dd/mm/yyyy
 *
 * 	@param today - the date to convert to the NetSuite date format
 *	@returns {String} - the string date that is parsed into the NetSuite format
 *	 
 * version - 1.0.1 - 28/01/2013 - AS
 ********************************************************************/
function formatDate(today)
{	
	var month = 0;
	var date = 0;
	var year = 0;
	var formatteddate = "";
	
	try
	{
		date = today.getDate();
		month = today.getMonth() + 1;
		year = today.getFullYear();
		formatteddate = date + '/' + month + '/' + year;
	
	}
	catch(e)
	{
		errorHandler("formatDate", e);		
	}
	
	return formatteddate;
}


/**
 * create a customer for the telephone number
 *
 * version 1.0.1 - 28/01/2013 - re-correcting 'if(custIntID != 0)'
 * 		   1.0.7 - 06 Jun 2013 -Adding the partner in the createCustomer function 
 * 		   1.0.8 - 18 Jun 2013 - Adding the AR account to the new and old customers
 * 
 */

function createCustomer(telNo)
{

	var custIntID = 0;
	var newCust = null;
	var oldCust = null;
	
	try
	{
		// search to see if it already exists
		
		custIntID = genericSearch('customer','entityid',telNo);
		
		//version 1.0.1
		//if customer not found, creating a new customer
		if(custIntID == 0)
		{
			newCust = nlapiCreateRecord('customer');
	
			newCust.setFieldValue('entityid', telNo);
			newCust.setFieldValue('lastname', telNo);
			newCust.setFieldValue('firstname', telNo);
			newCust.setFieldValue('autoname', 'F');
			newCust.setFieldValue('isperson', 'T');
			newCust.setFieldValue('partner', partnerIntID);		//version 1.0.7
			newCust.setFieldValue('receivablesaccount', CUSTOMERARACCOUNTINTID);		//version 1.0.8	
			custIntID = nlapiSubmitRecord(newCust, true);
		}
		else
		{
			oldCust = nlapiLoadRecord('customer', custIntID);
			oldCust.setFieldValue('receivablesaccount', CUSTOMERARACCOUNTINTID);		//version 1.0.8
			custIntID = nlapiSubmitRecord(oldCust,true);
			
		}

	}
	catch(e)
	{
		errorHandler("createCustomer", e);		
	}


	return custIntID;
	
}

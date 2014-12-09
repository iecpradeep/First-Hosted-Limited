/*************************************************************************************
 * Name:		VAT Registration Change Notify (VATRegChange.js)
 * 
 * Script Type:	User Event
 * 
 * Client:		Align BV
 *
 * Version:		1.0.0 - 11 Jun 2013 - first release - JM
 *
 * Author:		First Hosted Limited
 * 
 * Purpose:		Checks if a VAT Reg number has been updated and notifies the  
 * 				VAT Sweep service by changing customer flags and fields 
 * 
 * Script: 		customscript_vatregchangenotofy 
 * Deploy: 		customdeploy_vatregchangenotofy
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

var customerRecord = null;

function VATRegChange()
{
	initialise();
	loadCurrentRecord();
	if(determineIfVATRegNumberHasChanged()==true)
	{
		updateCustomerFlags();
	}

}

/*******************************************************************
 * initialise
 * 
 *******************************************************************/
function initialise()
{
	try
	{


	}
	catch(e)
	{
		errHandler('initialise', e);
	}
}

/*******************************************************************
 * load current record
 * 
 *******************************************************************/
function loadCurrentRecord()
{
	
	var recordType = '';
	var currentCustomerIntID = null;
	
	try
	{
		recordType = nlapiGetRecordType();
		currentCustomerIntID = nlapiGetRecordId();
		customerRecord = nlapiLoadRecord(recordType, currentCustomerIntID);
	}
	catch(e)
	{
		errHandler('loadCurrentRecord', e);
	}
}


/******************************************************************
 * get VAT Reg Changed Customers
 * 
 ******************************************************************/
function determineIfVATRegNumberHasChanged()
{

	var currentVATReg = '';
	var prevVATReg = '';
	var retVal = false;
	
	try
	{
	
		currentVATReg = customerRecord.getFieldValue('vatregnumber');
		prevVATReg = customerRecord.getFieldValue('custentity_previousvatreg');

		// if the old vat number and new vat number are not the same, then it's changed
		
		if(currentVATReg!=prevVATReg)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errHandler('determineIfVATRegNumberHasChanged', e);
	}

	return retVal;
	
}


/**
 * update customer 
 */
function updateCustomerFlags()
{	

	try
	{

		// copy the current vat number to the previous one
		// clear the VAT override flag
		// mark the customer as requiring a VAT sweep
		// mark the customer as having an invalid VAT reg number
		
		currentVATReg = customerRecord.getFieldValue('vatregnumber');

		customerRecord.setFieldValue('custentity_previousvatreg',currentVATReg);
		
		customerRecord.setFieldValue('custentity_vatnumberoverride','F');
		customerRecord.setFieldValue('custentity_vatnumbervalid','F');
		customerRecord.setFieldValue('custentity_vatregcheckreq','T');
		
		submitID = nlapiSubmitRecord(customerRecord, true);
	}
	catch(e)
	{
		errorHandler("updateCustomer", e);
	}
}



//custentity_vatnumbervalid	Check Box	 	 	Y	 	 	 	 	 	 	 
//4/6	VAT Number Override	 	custentity_vatnumberoverride

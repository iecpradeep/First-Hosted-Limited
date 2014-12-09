/**********************************************************************************************************
 * Name:        autoSettingMemoField
 * Script Type: User Event - After Submit
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 20/06/2013 - first release - AS
 *  			
 * Author:      FHL
 * Purpose:     to set the memo field of the customer payment so that it referring to the record number in the customer statement
 * 
 * Fires on:	create in customer payments  
 * 
 * Script:      customscript_autosetmemo
 * Deploy:     	customdeploy_autosetmemo   
 * 
 * Libraries:   library.js
 **********************************************************************************************************/
var recordInternalID = 0;
var recordType = '';

/*******************************************
 * autoSettingMemoField - main function
 * 
 ******************************************/
function autoSettingMemoField(type)
{
	if(type == 'create' || type == 'edit')
	{
		initialise();
		loadAndSubmitRecord();
	}
}


/*******************************************
 * initialise - initialising the static variable 
 * 
 ******************************************/
function initialise()
{

	try
	{
		//getting the internal id of the record
		recordInternalID = nlapiGetRecordId();
		
		//getting the type of the record ex : invoice/ customer payment
		recordType = nlapiGetRecordType();
		
	}
	catch(e)
	{
		errorHandler('initialise ' , e);
	}


}

/*******************************************
 * loadAndSubmitRecord - load, set and submit the record 
 * 
 ******************************************/
function loadAndSubmitRecord()
{
	var currentRecord = '';
	var description = '';
	var tranID = 0;
	
	try
	{
		//loading the record
		currentRecord = nlapiLoadRecord(recordType, recordInternalID);
		
		//getting the transaction id
		tranID = currentRecord.getFieldValue('tranid');
		
		//if the record type is the customer payment
		if(recordType == 'customerpayment')
		{
			//setting the description
			description = 'Receipt (Payment) Reference : ' + tranID;
		}
		//if record type is invoice
		else if(recordType == 'invoice')
		{
			description = 'Invoice Reference : ' + tranID;
		}
		
		//setting the memo field
		currentRecord.setFieldValue('memo', description);
		
		//submitting the record
		nlapiSubmitRecord(currentRecord);

	}
	catch(e)
	{
		errorHandler('loadAndSubmitRecord ' , e);
	}


}
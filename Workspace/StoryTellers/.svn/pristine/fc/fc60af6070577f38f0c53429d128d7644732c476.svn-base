/*******************************************************
* Name:				The StoryTellers Purchase Order Unique ID Creator
* Script Type:		Client
* Version:				1.0.0
* Date:					6th March 2012
* Author:				Pete Lewis, First Hosted Limited.
* Checked by:		Anthony
*******************************************************/

/************
 *  Creates a new Automatically Generated ID
 * @param {Object} recordId Internal ID of the Settings Record
 ************/
function CreateNewID(recordId)
{
	
	//Declare the variables used within this function
	var prefix = '';
	var lastID = 0;
	var desiredLength = -1;
	var paddingCharacter = '0';
	var newID = 0;
	var generatedID = '';
	var padding = '';
	
	//First we need to get all the fields from the Custom Record
	try
	{
		prefix = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_prefix');
		lastID = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_lastid'));
		desiredLength = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_desiredlength'));
		paddingCharacter = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_paddingchar');
		
		//Pre-lim check to see if the PaddingCharacter will cause any headaches...
		if(paddingCharacter == null || paddingCharacter.length != 1)
		{
			nlapiLogExecution('error','GenerateNewID', 'PaddingCharacter: ' + paddingCharacter);
			return 'PaddingError';
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','GenerateNewID Error', e.message);
		return 'Error L32';
	}
	
	//increment the Last ID by 1
	newID = parseInt(lastID)+1;
	nlapiLogExecution('debug', 'newID: ' + newID + ', lastID = ' + lastID);
	try
	{
		//Submit this newly created field to the Custom Record
		nlapiSubmitField('customrecord_fhl_uniqueid', recordId,'custrecord_fhl_uid_lastid',newID,false);
	}
	catch(e)
	{
		//Field failed to submit field to record
		nlapiLogExecution('error','GenerateNewID Error', e.message);
	}
	
	//Create the Unique ID by concatenating all of the variables together
	generatedID = prefix + padding +  newID;
	
	while (generatedID.length<desiredLength)
	{
		padding = padding + paddingCharacter;
		generatedID = prefix + padding +  String(newID);
	}
	
	//At this point we should have a Unique ID of the desired length with the unique number on with the 	
	return generatedID;
}

function PurchaseInvoice_onSave()
{
	//1 is the settings for Vendor Bill
	var purchaseInvoiceSettingsRecordID = 1;
	var internalRefNum = null;
	
	try
	{
		internalRefNum = nlapiGetFieldValue('custbody_internalrefno');
	}
	catch(e)
	{
		//Cannot continue...
		nlapiLogExecution('error','PurchaseInvoiceSave', e.message);
		return true;
	}
	
	try
	{
		if(internalRefNum == null || internalRefNum.length <= 1 || internalRefNum == '')
		{
			internalRefNum = CreateNewID(purchaseInvoiceSettingsRecordID);	
			nlapiLogExecution('debug','Creating new id...','for internalrefnum');
			nlapiSetFieldValue('custbody_internalrefno', internalRefNum, false, false);
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','PurchaseInvoice_onSave', e.message);
	}
	return true;	
}


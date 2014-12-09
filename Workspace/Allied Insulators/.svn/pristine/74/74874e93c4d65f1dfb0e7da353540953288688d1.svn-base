/*******************************************************
 * Name:		Allied Insulator automatically populate Image on Transaction
 * Script Type:	User Event Script
 * Version:		1.4.0
 * Date:		December 2011
 * Author:		Peter Lewis, FHL
 *******************************************************/

 


/***
 * AfterTXSubmit (User Event)
 * @param type. Automatically passed from NetSuite - this is the event type being actioned, e.g. Create, Edit, Delete...
 * @returns {Boolean}. This is whether it was successful or not.
 */

function AfterTXSubmit(type)
{
	
	//var context = nlapiGetContext();
	var TheRecord = '';
	var TheRecordID = 0;
	var TheRecordType = '';

	
	//On both Create, Edit and XEdit of the Transaction...
	if (type == 'create' || type == 'edit' || type == 'xedit')
	{
		try
		{
			TheRecordID = nlapiGetRecordId();
			TheRecordType = nlapiGetRecordType();
			TheRecord = nlapiLoadRecord(TheRecordType , TheRecordID , null);
		}
		catch(e)
		{
			nlapiLogExecution('ERROR', 'Error loading record ' + TheRecordID, e.message);
		}
		
		try
		{
			//TheRecord.setFieldValue('', '');
			TheRecord.setFieldValue('custbody_afaq_logo',4);
			TheRecord.setFieldValue('custbody_ukas_logo',3);
			nlapiSubmitRecord(TheRecord, false, false);
		}
		catch(e)
		{
			nlapiLogExecution('ERROR', 'Error saving record ' + TheRecordID, e.message);
		}
	}
	return true;
}

function AfterSubmitFulfilment(type)
{
	var FulfilRecord = '';
	var FulfilID = nlapiGetRecordId();
	var RecordType = nlapiGetRecordType();
	var CreatedFromRecord = '';	//createdfrom
	var CreatedFromRecordID = 0;
	var CreatedFromYourRef = '';		//otherrefnum	+ custbody_yourref

	//On both Create, Edit and XEdit of the Transaction...
	if (type == 'create' || type == 'edit' || type == 'xedit') {
		try 
		{
			FulfilRecord = nlapiLoadRecord(RecordType, FulfilID);
			FulfilRecord.setFieldValue('custbody_generatepalletnotes', 'https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=46&deploy=1&custparam_cid=' + FulfilID);
		} 
		catch (e) 
		{
			nlapiLogExecution('DEBUG', 'Fulfil Record Submit', e.message);
		}
		
		try 
		{
			CreatedFromRecordID = parseInt(FulfilRecord.getFieldValue('createdfrom'));
			//nlapiLogExecution('DEBUG', 'Created From Record ID', CreatedFromRecordID);
			if (isNaN(CreatedFromRecordID)) 
			{
				//Created From is not present.
				nlapiLogExecution('DEBUG', 'Created From Record ID', 'This Item Fulfilment was not created from an existing Sales Order.');
			}
			else
			{
				CreatedFromRecord = nlapiLoadRecord('salesorder', CreatedFromRecordID);
				CreatedFromYourRef = CreatedFromRecord.getFieldValue('otherrefnum');
				FulfilRecord.setFieldValue('custbody_yourref', CreatedFromYourRef);
				//nlapiLogExecution('DEBUG', 'Created From Your Ref', CreatedFromYourRef);
			}
		} 
		catch (e) 
		{
			nlapiLogExecution('DEBUG', 'Created From... Error', e.message);
		}
		
		try 
		{
			nlapiSubmitRecord(FulfilRecord);
		} 
		catch (e) 
		{
			nlapiLogExecution('ERROR', 'Fulfilment ', e.message);
		}
		
	}

	return true;	
}

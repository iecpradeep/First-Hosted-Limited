/*******************************************************
* Name:				Generate Unique Code
* Script Type:		Client
* Version:				2.2.0
* Date:					9th May 2012 PAL
* 							
* 						2.1.0 PAL 7th November 2012 - Altered barcodeFieldID to new name
* 						2.2.0 MJL 27th February 2013 - place new barcode in UPC code field
* 
* Author:				Pete Lewis, First Hosted Limited.
* Checked by:		
*******************************************************/

	var barcodeSettingsRecordID = 1;
	var purchaseInvoiceSettingsRecordID = 2;
	var barcodeFieldID = 'custitem_barcode_1';
	
	var internalRefNum = null;
	var currentBarcode = null;
	var prefix = '';
	var lastID = 0;
	var desiredLength = -1;
	var paddingCharacter = '0';
	var newID = 0;
	var generatedID = '';
	var padding = '';
	
	
/************
 *  Creates a new Automatically Generated Code
 * @param {Object} recordId is Internal ID of the Settings Record
 ************/
function generateNewCode(recordId)
{
	
	//Declare the variables used within this function

	
	//First we need to get all the fields from the Custom Record
	try
	{
		prefix = nlapiLookupField('customrecord_barcode_generator', recordId, 'custrecord_fhl_uid_prefix');
		lastID = parseInt(nlapiLookupField('customrecord_barcode_generator', recordId, 'custrecord_fhl_uid_lastid'));
		desiredLength = parseInt(nlapiLookupField('customrecord_barcode_generator', recordId, 'custrecord_fhl_uid_desiredlength'));
		paddingCharacter = nlapiLookupField('customrecord_barcode_generator', recordId, 'custrecord_fhl_uid_paddingchar');
		
		//Pre-lim check to see if the PaddingCharacter will cause any headaches...
		if(paddingCharacter == null || paddingCharacter.length != 1)
		{
			alert('The padding character must be specified, and must only be 1 character in length.\n\nPlease ensure the settings are correct and retry.');
			nlapiLogExecution('error','generateNewCode', 'PaddingCharacter: ' + paddingCharacter);
			return 'PaddingError';
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','generateNewCode Error', e.message);
		return e.message;//'Error L32';
	}
	
	//increment the Last ID by 1
	newID = parseInt(lastID)+1;
	nlapiLogExecution('debug', 'newID: ' + newID + ', lastID = ' + lastID);
	try
	{
		//Submit this newly created field to the Custom Record
		nlapiSubmitField('customrecord_barcode_generator', recordId,'custrecord_fhl_uid_lastid',newID,false);
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

function purchaseInvoice_onSave()
{
	//2 is the settings for Vendor Bill

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

function generateNewBarcode()
{
	//2 is the settings for Barcodes
	
	try
	{
		currentBarcode = nlapiGetFieldValue(barcodeFieldID);
	}
	catch(e)
	{
		//Cannot continue...
		alert('Get Barcode Field Error: ' + e.message);
		nlapiLogExecution('error','PurchaseInvoiceSave', e.message);
		return true;
	}
	
	try
	{
		if(currentBarcode == null || currentBarcode.length <= 1 || currentBarcode == '')
		{
			currentBarcode = generateNewCode(barcodeSettingsRecordID);	
			nlapiLogExecution('debug','Creating new id...','for currentBarcode');
			nlapiSetFieldValue(barcodeFieldID, currentBarcode, false, false);
			nlapiSetFieldValue('upccode', currentBarcode, false, false); //2.2.0 place new barcode in UPC code field to ensure correct barcode format - MJL
		}
	}
	catch(e)
	{
		alert('Barcode Generator Error: ' + e.message);
		nlapiLogExecution('error','', e.message);
	}
	return true;	
}


function onFieldChange(type, name){
    if (((type == 'price1') && (name == 'price')) || ((type == 'price4') && (name == 'price'))) { // price1 = GBP, price4 = EUR
        // use custom date_price_modified field to note the last time a price (either in GBP or EUR) was changed        
        nlapiSetFieldValue('custitem_price_last_changed_date', nlapiDateToString(new Date(), 'datetimetz'), false);
        // N.B. The date is not changed unless the record is saved. 
        // Does not work for mass update of prices
    }
    return true;
}
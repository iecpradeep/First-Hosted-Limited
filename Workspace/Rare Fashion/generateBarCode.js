/*******************************************************
* Name:				Generate Unique Code
* Script Type:		User Event
* Version:				1.0.0
* Date:					5th November 2012
* Author:				Pete Lewis, First Hosted Limited.
* Checked by:		
*******************************************************/

//1 - Barcode Settings
//2 - Purchase Invoice Settings
//3 - Test Settings
var barcodeSettingsRecordID = 1;
var barcodeSettingsRecord = '';
var barcodeFieldID = 'custitem_barcode_1';

var itemRecordID = 0;
var itemRecord = '';
var recordType = '';

var childRecordID = 0;
var childRecord = '';
var childBarcode = '';

var internalRefNum = null;
var currentBarcode = null;
var prefix = '';
var lastID = 0;
var desiredLength = -1;
var paddingCharacter = '0';
var newID = 0;
var generatedID = '';
var padding = '';


/****************************************************************************************
 * 
 * generateNewMatrixChildBarcode (User Event)
 * 
 * @param type. Automatically passed from NetSuite - this is the event type being actioned, e.g. Create, Edit, Delete...
 * 
 * @return {Boolean}. This is whether it was successful or not. Returning FALSE prevents the record from saving.
 * 
 ****************************************************************************************/
function generateNewMatrixChildBarcode(type)
{
	try
	{
		itemRecordID = nlapiGetRecordId();
		recordType = nlapiGetRecordType();
		nlapiLogExecution('DEBUG','GenerateBarcode Info', 'Type: ' + type + ', RecordID: ' + itemRecordID + ', Record Type: ' + recordType);
		
		switch(String(recordType))
		{
			case 'inventoryitem':
				updateAllChildItems(itemRecordID);
				break;
				
			default:
				nlapiLogExecution('DEBUG', 'Record Type is not Inventory Item', recordType);
				break;		
		}
	}
	catch(e)
	{
			nlapiLogExecution('ERROR', 'generateNewMatrixChildBarcode', e.message);
	}	
	return true;	
}

	
/****************************************************************************************
 * 
 *  Creates a new Automatically Generated Code
 * 
 * @param {Object} settingsRecordId is Internal ID of the Settings Record
 * @return {String} newly generated code based on the Settings Record specified
 * 
 ****************************************************************************************/
function generateNewCode(settingsRecordId)
{

	
	//First we need to get all the fields from the Custom Record
	try
	{
		barcodeSettingsRecord = nlapiLoadRecord('customrecord_barcode_generator', barcodeSettingsRecordID);
		
		prefix = barcodeSettingsRecord.getFieldValue('custrecord_fhl_uid_prefix');
		//prefix = nlapiLookupField('customrecord_barcode_generator', settingsRecordId, 'custrecord_fhl_uid_prefix');
		
		lastID = barcodeSettingsRecord.getFieldValue('custrecord_fhl_uid_lastid');
		//lastID = parseInt(nlapiLookupField('customrecord_barcode_generator', settingsRecordId, 'custrecord_fhl_uid_lastid'));
		
		desiredLength = barcodeSettingsRecord.getFieldValue('custrecord_fhl_uid_desiredlength');
		//desiredLength = parseInt(nlapiLookupField('customrecord_barcode_generator', settingsRecordId, 'custrecord_fhl_uid_desiredlength'));
		
		paddingCharacter = barcodeSettingsRecord.getFieldValue('custrecord_fhl_uid_paddingchar');
		//paddingCharacter = nlapiLookupField('customrecord_barcode_generator', settingsRecordId, 'custrecord_fhl_uid_paddingchar');
		
		//Pre-lim check to see if the PaddingCharacter will cause any headaches...
		if(paddingCharacter == null || paddingCharacter.length != 1)
		{
			//alert('The padding character must be specified, and must only be 1 character in length.\n\nPlease ensure the settings are correct and retry.');
			nlapiLogExecution('error','generateNewCode', 'The padding character must be specified, and must only be 1 character in length. Please ensure the settings are correct and retry. PaddingCharacter: ' + paddingCharacter);
			return 'PaddingError';
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','generateNewCode Error', e.message);
		return e.message;//'Error L32';
	}
	
	try
	{
		//increment the Last ID by 1
		newID = parseInt(lastID)+1;
		nlapiLogExecution('DEBUG', 'newID: ' + newID + ', lastID = ' + lastID);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'NewID Error', 'NewID could not be incremented - ' + newID);
	}

	try
	{
		//Submit this newly created code to the Custom Record
		barcodeSettingsRecord.setFieldValue('custrecord_fhl_uid_lastid', newID);
		nlapiSubmitRecord(barcodeSettingsRecord);
	}
	catch(e)
	{
		//Field failed to submit field to record
		nlapiLogExecution('ERROR','Barcode Settings Submit Error', e.message);
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




/****************************************************************************************
 * 
 * Function updateAllChildItems searches for all inventoryitem records where the Parent 
 * specified is the same as the parentItemID and there is not already a barcode set
 * 
 * It then updates all inventoryitem records with a newly generated barcode.
 * 
 * @param {Object} parentItemID
 * @return {Boolean} whether the function was successful
 ****************************************************************************************/
function updateAllChildItems(parentItemID)
{
	
	nlapiLogExecution('DEBUG', 'Searching for Child Items...', 'Inventory Search - parentItemID: ' + parentItemID);
	try
		{
			var itemFilters = new Array();

			// Define search filter
			itemFilters[0] = new nlobjSearchFilter('parent', null, 'is', parentItemID);
			itemFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			itemFilters[2] = new nlobjSearchFilter(barcodeFieldID, null, 'isempty', null);
		
			var itemColumns = new Array();
			
			// Define column filters
			itemColumns[0] = new nlobjSearchColumn('internalid');
			itemColumns[1] = new nlobjSearchColumn(barcodeFieldID);
		
			var searchResults = nlapiSearchRecord('inventoryitem', null, itemFilters, itemColumns);
			
			if(searchResults == null)				//no results
			{
				nlapiLogExecution('DEBUG', 'Results', 'No Items are associated with this Item (' + parentItemID + ')');
			}
			else
			{
				for(var i=0;i<searchResults.length;i++)
				{
					try
					{
						childInternalID = searchResults[i].getValue('internalid');
						childBarcode = searchResults[i].getValue(barcodeFieldID);
						nlapiLogExecution('DEBUG', 'Child Internal ID and Barcode', 'ID: ' + childInternalID + ', Barcode: ' + childBarcode);
						childRecord = nlapiLoadRecord('inventoryitem', childInternalID);
						currentBarcode = childRecord.getFieldValue(barcodeFieldID);	
					}
					catch(e)
					{
						nlapiLogExecution('ERROR','Error loading record based on Internal ID', e.message);
						//return true;
					}
								
					try
					{
						if(currentBarcode == null || currentBarcode.length <= 1 || currentBarcode == '')
						{
							currentBarcode = generateNewCode(barcodeSettingsRecordID);	
							nlapiLogExecution('DEBUG','Creating new id...','currentBarcode is now: ' +  currentBarcode);
							childRecord.setFieldValue(barcodeFieldID, currentBarcode);
							nlapiSubmitRecord(childRecord);
						}
						else
						{
							nlapiLogExecution('DEBUG','generateNewMatrixChildBarcode already exists', currentBarcode);
						}
					}
					catch(e)
					{
						nlapiLogExecution('ERROR','Error Setting or Submitting barcode field Child Record', e.message);
					}
				}
			}
		}
		catch(e)	
		{
			nlapiLogExecution('DEBUG', 'The inventory search did not work ', e.message);
			return true;
		}
}
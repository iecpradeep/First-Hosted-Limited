/*************************************************************************************
 * Name:		Set PO Link (setPoLinkUE.js)
 * Script Type:	User Event - after record submit
 *
 * Version:		1.0.1 - First Release - Sadak
 *
 * Author:		FHL
 * 
 * Purpose:		Set PO record in purchase order line 
 * 
 * Script: 		customscript_setpolink 
 * Deploy: 		customdeploy_setpolink
 * 
 * Notes:		[todo - deployment details i.e. form associated etc]
 * 
 * Library: 	Library.js
 *************************************************************************************/

var poRecordID = 0;
var poRecord = null;
var lineCount = 0;

/**
 * 
 * setPOLink
 * 
 */
function setPOLink()
{
	try
	{
		poRecordID = nlapiGetRecordId();

		poRecord = nlapiLoadRecord('purchaseorder', poRecordID);
		
		lineCount = poRecord.getLineItemCount('item');
		
		for (var poline = 1; poline <= lineCount; poline++)
		{
			poRecord.setLineItemValue('item', 'custcol_po', poline, poRecordID);

		}
		
		nlapiSubmitRecord(poRecord);

	}
	catch(e)
	{
		errorHandler("setPOLink", e);
	}
}
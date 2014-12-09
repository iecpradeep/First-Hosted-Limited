/*************************************************************************************
 * Name:		salesOrderUE.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 17/06/2013 - First Release - LG
 *
 * Author:		FHL
 * 
 * Purpose:		To auto populate the Price for squared metre and Coverage fields
 * 				on a sales order after submit.
 * 
 * Script: 		customscript_salesorderue 
 * Deploy: 		customdeploy_salesorderue 
 * 
 * Notes:		
 * 
 * Library: 	library.js
 *************************************************************************************/

var rate = 0;
var quantity = 0;
var sqMPerPack = 0;
var pricePerSqM = 0;
var coverage = 0;
var setPrice = '';
var setCoverage = '';
var lineCount = 0;
var currentRecord = null;

/**
 * 
 * initialise
 * 
 */
function initialise(type)
{
	try
	{
		if (type == 'create' || type == "edit")
		{
			currentRecord = nlapiLoadRecord(nlapiGetRecordType(), nlapiGetRecordId());
			calculateFieldValues();
			nlapiSubmitRecord(currentRecord);
		}
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

/**
 * 
 * Gets the values from the requred fields.
 * 
 */
function calculateFieldValues()
{
	try
	{
		lineCount = currentRecord.getLineItemCount('item');
		
		//Iterates through line items to get and set values.
		for (var i = 1; i <= lineCount; i++)
		{
			currentRecord.selectLineItem('item', i);
			
			rate =  currentRecord.getCurrentLineItemValue('item', 'rate');
			quantity = currentRecord.getCurrentLineItemValue('item', 'quantity');
			sqMPerPack = currentRecord.getCurrentLineItemValue('item', 'custcol_sqmperpack');
			
			//Equations for new field values.
			pricePerSqM = rate / sqMPerPack;
			coverage = quantity * sqMPerPack;
			
			pricePerSqM = parseFloat(pricePerSqM);
			coverage = parseFloat(coverage);
			
			//Set the line item values
			currentRecord.setCurrentLineItemValue('item', 'custcol_pricemtwo', pricePerSqM.formatNumeric());
			currentRecord.setCurrentLineItemValue('item', 'custcol_coverage', coverage.formatNumeric());
			currentRecord.commitLineItem('item');
		}

	}
	catch(e)
	{
		errorHandler("calculateFieldValues", e);
	}
}

/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       20 Jun 2013     Peter Lewis, First Hosted Ltd
 *
 */

var vatRegNo = '';
var taxCodes = new Array();
var lineItemCount = 0;

var ecSalesItemId = '416';
var ESGBid  ='108';
var ESDEid = '93';
var ESPLid = '62';

var ecSaleItemFound = false;
var ESFound = false;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function clientSave()
{

	var saveRecord = true;
	try
	{
		//alert('TEST!!!');
		//return true;
		initialise();

		if(vatRegNo != '')
		{
			if(lineItemCount > 0)
			{
				sortECSaleItem();
				saveRecord = true;
			}
			else
			{
				alert('There are no line items in this Transaction.');
				saveRecord = false;
			}
		}

	}
	catch(e)
	{
		errHandler('clientSaveRecord',e);
		saveRecord = false;
	}
	return saveRecord;
}

/************************
 * initialise the variables we're going to use in this script.
 * 
 ***********************/
function initialise()
{
	try
	{
		taxCodes[0] = ESGBid;	
		taxCodes[1] = ESDEid;
		taxCodes[2] = ESPLid;	
		vatRegNo = nlapiGetFieldValue('vatregnum');
		lineItemCount = nlapiGetLineItemCount('item');

		//alert('Vat Reg No: ' + vatRegNo + '\nLine Items: ' + lineItemCount);
	}
	catch(e)	
	{
		errHandler('initialise', e);
	}
}


function sortECSaleItem()
{

	try
	{
		//check for EC Sale Item and ES Tax Code
		for(var i= 1; i<=lineItemCount; i++)
		{

			currentTaxCode = nlapiGetLineItemValue('item', 'taxcode', i);
			currentItem = nlapiGetLineItemValue('item', 'item', i);

			for(var t=0; t<taxCodes.length;t++)
			{
				//check the tax code with this line item
				//alert('Checking tax code...' + t);

				if(currentTaxCode == taxCodes[t])
				{
					ESFound = true;
					//alert('Found an ES Tax Code on Line ' + i);
				}
			}

			//check it it's an EC Sale Item
			if(currentItem == ecSalesItemId)
			{
				//alert('Found the EC Sale Item on Line ' + i);
				ecSaleItemFound = true;
			}

		}

		if((ESFound == true) && (ecSaleItemFound == false))
		{
			//add the EC Sale Item
			//alert('EC Sale Item NOT found, but ES Tax Code has been found!');
			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item', 'item', ecSalesItemId, true, true);
			nlapiCommitLineItem('item');
		}
	}
	catch(e)
	{
		errHandler('sortECSalesItem', e);
	}
}

/********************************************************************
 * pageInitialise - Called on Page Init
 * 
 * On Edit on the Invoice, check for the EC Sale Item
 * If it's there, remove it.
 * 
 ********************************************************************/
function pageInitialise()
{
	try
	{
		//on edit mode of Invoice, check line item count.
		//if greater than 0, check for EC Sales Item and remove it.
		lineItemCount = nlapiGetLineItemCount('item');

		if(lineItemCount > 0)
		{
			//go from the last item to the first item
			for(var i = lineItemCount; i >= 1; i--)
			{
				//get the Item Internal ID and compare to the ecSalesItemId
				currentItemId = nlapiGetLineItemValue('item', 'item', i);
				if(currentItemId == ecSalesItemId)
				{
					//if they match, remove the line.
					nlapiRemoveLineItem('item', i);
				}
			}
		}
		else
		{
			//alert('page initialised and line count is zero');
			//This is a new Invoice, and as such there are no line items on it.
		}

	}
	catch(e)
	{
		errHandler('pageInitialise',e);	
	}
}



/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		alert('Error:\n' + sourceFunctionName + '\n\n' + e.message);
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}


/**********************************************************************
 * logData - Used when debugging
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function logData(source, data)
{
	alert(source + '\n\n' + data);
	nlapiLogExecution('DEBUG', source, data);
}


/**********************************************************************
 * auditData - Used when deployed for auditing purposes
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function auditData(source, data)
{
	nlapiLogExecution('AUDIT', source, data);
}
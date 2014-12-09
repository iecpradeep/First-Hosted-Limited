/***********************************************************************************
 * Name: Generate EAN-13 Barcode (generateEANBarcode.js)
 * Script Type: Client
 * Client: Rare Fashion
 *
 * Version: 1.0.0 - 27 Feb 2013 - 1st release - MJL

 * Author: FHL
 * Purpose: Generate a valid EAN-13 barcode and post to Item Record
 *
 * Script:
 * Deploy:
 ***********************************************************************************/

var barcode = '';
var gs1Code = 0;
var companyCode = 0;
var itemCode = 0;
var checkDigit = 0;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment.
 * @appliedtorecord Inventory Item
 *
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function generateEANBarcode(type, name, linenum)
{
	getParameters();
	generateCode();
	makeCheckDigit();
	setFields();
}

function getParameters()
{
	//var context = null;

	//context = nlapiGetContext();

	//gs1Code = context.getSetting('SCRIPT', 'custscript_');
	//companyCode = context.getSetting('SCRIPT', 'custscript_');
	//itemCode = context.getSetting('SCRIPT', 'custscript_');
	//checkDigit = context.getSetting('SCRIPT', 'custscript_');

	gs1Code = 500;
	companyCode = 789;
	itemCode = 123456;
}

function generateCode()
{
	if ((gs1Code >= 500) && (gs1Code <= 509))
	{
		//alert('gs1Code is:' + gs1Code);

		if ((String(companyCode).length >= 3) && (String(companyCode).length <= 8) && (String(itemCode).length >= 2) && (String(itemCode).length <= 6))
		{
			//alert('companyCode is: ' + companyCode);
			//alert('itemCode is: ' + itemCode);

			if (String(companyCode).length + String(itemCode).length == 9)
			{
				barcode = String(gs1Code) + String(companyCode) + String(itemCode);
			}
		}
	}
}

function makeCheckDigit()
{
	var weight = 0;
	var sum = 0;
	var round = 0;

	for (var i = 0; i < barcode.length; i++)
	{
		if (((i + 1) % 2) == 0)
		{
			weight = 3;
		}
		else
		{
			weight = 1;
		}

		sum += parseInt(barcode.charAt(i)) * weight;
	}

	round = Math.ceil((sum + 1) / 10) * 10;
	checkDigit = round - sum;
	barcode = String(barcode) + String(checkDigit);
}

function setFields()
{
	if (String(barcode).length == 13)
	{
		//alert('New barcode: ' + barcode);
		//nlapiSetFieldValue('custitem_barcode_1', barcode);
		nlapiSetFieldValue('upccode', barcode);
	}
}

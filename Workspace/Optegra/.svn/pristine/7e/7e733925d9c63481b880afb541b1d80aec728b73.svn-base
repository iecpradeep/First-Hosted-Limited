/*******************************************************
* Name:				Optegra Purchase Order Client Script
* Script Type:		Client
* Version:				2.0.0
* 							2.0.1 PAL 6th November 2012 - commented out the DisableField on PageInit under orders from Sadak.
* 
* Date:					28th June 2012
* Author:				Darren Birt & Pete Lewis, First Hosted Limited.
* Checked by:		
*******************************************************/

var NotesDescriptionItem = '854';

function onChange(type,name)
{
	
	try 
	{
		if (name == 'custbody_vendorselect')
		{
			var vendor = nlapiGetFieldValue('custbody_vendorselect');
			nlapiSetFieldValue('entity',vendor,false, true);
	
	
	
		} //if	
	} 
	catch (e) 
	{
	
	
	
	}

	//alert('Testing Script. Return True. On Change Called.');

	return true;
}

function myPageInit(type)
{	
	//alert('myPageInit\nType=' + type);
	nlapiSetFieldValue('employee', nlapiGetUser());
	
	//2.0.1 PAL 6/11/12
	//nlapiDisableField('custbody_poapproveroverride', true);
}

function mySaveRecord()
{	
	//alert('Saving Record...Press OK to continue...');	
	return true;
} 

function myValidateField(type, name, linenum)
{	
//	alert('myValidateField\nType = ' + type + '\nName = ' + name + '\nLinenum = ' + linenum);	
	var currentItem = nlapiGetCurrentLineItemValue('item','item');
	if(currentItem == NotesDescriptionItem)
	{
		//alert('currentItem = ' + currentItem + '\n\nShould disable now...');
		nlapiDisableLineItemField('item','rate', true);
		nlapiDisableLineItemField('item','taxcode', true);
		nlapiDisableLineItemField('item','matchbilltoreceipt', true);
		nlapiDisableLineItemField('item','amount', true);
		nlapiDisableLineItemField('item','grossamt', true);
		nlapiDisableLineItemField('item','tax1amt', true);
		nlapiDisableLineItemField('item','quantity', true);
		nlapiDisableLineItemField('item','options', true);
	}
	else
	{
		nlapiDisableLineItemField('item','rate', false);
		nlapiDisableLineItemField('item','taxcode', false);
		nlapiDisableLineItemField('item','matchbilltoreceipt', false);
		nlapiDisableLineItemField('item','amount', false);
		nlapiDisableLineItemField('item','grossamt', false);
		nlapiDisableLineItemField('item','tax1amt', false);
		nlapiDisableLineItemField('item','quantity', false);
		nlapiDisableLineItemField('item','options', false);
	}
	
	return true;
}

function myFieldChanged(type, name, linenum)
{
	//alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
} 
	
function myPostSourcing(type, name)
{	
	//alert('myPostSourcing type=' + type + ', name=' + name);
} 

function myLineInit(type)
{	
	//alert('myLineInit\nType = ' + type);
}

function myValidateLine(type)
{	
	//alert('myValidateLine\nType=' + type);
	//var currentItem = nlapiGetCurrentLineItemValue('item','item');
	//alert('currentItem = ' + currentItem);
	return true;
}

function myValidateInsert(type)
{	
	//alert('myValidateInsert\nType=' + type);
} 

function myValidateDelete(type)
{	
	//alert('myValidateDelete\nType=' + type);
} 

function myRecalc(type)
{	
	//alert('myRecalc\nType=' + type);
}

/****
 * Pass in an Object and return an Integer value. If it isNaN, zero is returned.
 * @param {Object} v
 */
function intVal(v)
{ 
	//parseInt the value, to Base 10 Radix
	return parseInt(v,10) ||0;
}

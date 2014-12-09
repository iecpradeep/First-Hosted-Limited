/*************************************************************************
 * Name: purchaseinvoice_client.js
 * Script Type: client script
 * Client: Optegra/Augentis

 * Version:			1.0.0 - Created 2 July 2012
 * 					1.0.1 - Amended JM on site - check type before checking if an item description is needed
 * 					1.0.2 - Added Default Accounts Payable account
 *  
 * Author:			Pete Lewis, First Hosted Limited.
*******************************************************/

var NotesDescriptionItem = '854';

//1.0.2
var AccountsPayableID = '2917';

function onChange(type,name)
{
	
	try 
	{
		if (name == 'custbody_vendorselect')
		{
			var vendor = nlapiGetFieldValue('custbody_vendorselect');
			nlapiSetFieldValue('entity',vendor,true, true);
	
		} //if	
		
		//1.0.2
		if(name == 'entity')
		{
			nlapiSetFieldValue('account', AccountsPayableID);
		}
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
}

function mySaveRecord()
{	
	//alert('Saving Record...Press OK to continue...');	
	return true;
} 

function myValidateField(type, name, linenum)
{	
//	alert('myValidateField\nType = ' + type + '\nName = ' + name + '\nLinenum = ' + linenum);	

	return true;
}

	
function myPostSourcing(type, name)
{	
	//alert('myPostSourcing type=' + type + ', name=' + name);
} 

function myLineInit(type)
{	
	//alert('myLineInit\nType = ' + type);
}

/**
 * validate line
 * 1.0.1 - remove the check for item description
 * @param type
 * @returns {Boolean}
 */
function myValidateLine(type)
{	
	//alert('myValidateLine\nType=' + type);

	var currentLocation = nlapiGetCurrentLineItemValue('item','location');
	if(currentLocation > 0)
	{
		alert('You must enter a Location before proceeding.');
		return false;
	}
		
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





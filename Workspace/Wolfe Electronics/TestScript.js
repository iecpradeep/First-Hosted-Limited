/*******************************************************
 * 
 * Name:	Test
 * 		
 *******************************************************/

//Test

Array.prototype.POinternalID = String();
Array.prototype.ItemInternalID = String();
Array.prototype.qty = String();
Array.prototype.dueDate = String();
Array.prototype.lineNum = String();


Array.prototype.internalId = String();
Array.prototype.addressLabel = String();
Array.prototype.address = String();
Array.prototype.defaultShipping = String();
Array.prototype.defaultBilling = String();


function validateInsertTest(type)
{
	alert('Hello World');
	
	nlapiSelectNewLineItem(type);
	nlapiSetCurrentLineItemValue('item', 'item', 181);
	nlapiSetCurrentLineItemValue('item', 'description', 'test');
	nlapiSetCurrentLineItemValue('item', 'quantity', 1);
	nlapiSetCurrentLineItemValue('item', 'price', -1); //1.0.10
	nlapiSetCurrentLineItemValue('item', 'rate', '8.5');
	nlapiSetCurrentLineItemValue('item', 'amount', '8.5');
	nlapiSetCurrentLineItemValue('item', 'taxcode', 175);
	nlapiSetCurrentLineItemValue('item', 'linenumber', 0);
	nlapiCommitLineItem('item');
}

function getAddress(netsuiteFieldName)
{
	var address = nlapiGetFieldValue(netsuiteFieldName);	
	var tempAddressArray = new Array();
	tempAddressArray = address.split('|');
	
	var addressArray = new Array();
	var addressPosition = 0;
	
	for(var i=0; i<tempAddressArray.length; i++)
	{
		switch(Right(i.toString(),1))
		{
			case '0':
			case '5':
				//Address InternalId
				addressArray[addressPosition].internalId = tempAddressArray[i];
			case '1':
			case '6':
				//Address Address Label
			case '2':
			case '7':
				//Address
			case '3':
			case '8':
				//Is Default Shipping
			case '4':
			case '9':
				//Is Default Billing
				addressPosition++;
		}
	}
	
	
}

function Left(str, n){
	if (n <= 0)
	    return "";
	else if (n > String(str).length)
	    return str;
	else
	    return String(str).substring(0,n);
}
function Right(str, n){
    if (n <= 0)
       return "";
    else if (n > String(str).length)
       return str;
    else {
       var iLen = String(str).length;
       return String(str).substring(iLen, iLen - n);
    }
}

function myFieldChanged(type, name, linenum)
{
	if (name == 'memo') 
	{
		alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);

		//custcol_num_of_episodes	- number of episodes
		//custcol_item_number	- item number
		//amount	- total licence fee
		/***
		 return true;
		 var numOfEpisodes = nlapiGetLineItemValue('item', 'custcol_num_of_episodes', linenum);
		 alert('Current line index: ' + linenum + ', current num of eps: ' + numOfEpisodes + ', name: ' + name);
		 nlapiSetLineItemValue('item', 'quantity', linenum, numOfEpisodes);
		 alert('');
		 ***/
		
		var X = new Array();
		var output = '';

		X[0].POinternalID = '115';
		X[0].ItemInternalID = '53';
		X[0].qty = '1500';
		X[0].dueDate = '152012';
		X[0].lineNum = '5';

		X[1].POinternalID = '144';
		X[1].ItemInternalID = '53';
		X[1].qty = '2000';
		X[1].dueDate = '112013';
		X[1].lineNum = '12';

		output += X[0].POinternalID + '<br />';
		output += X[0].ItemInternalID + '<br />';
		output += X[0].qty + '<br />';
		output += X[0].dueDate + '<br />';
		output += X[0].lineNum + '<br />';

		output += X[1].POinternalID + '<br />';
		output += X[1].ItemInternalID + '<br />';
		output += X[1].qty + '<br />';
		output += X[1].dueDate + '<br />';
		output += X[1].lineNum + '<br />';

		alert('Output: ' + output);
	}
} 


function GetEnglishBool(value)
{
	if(value == 'T' || value == true)
	{
		return 'yes';
	}
//	else
//	{
//		return 'no';
//	}
}

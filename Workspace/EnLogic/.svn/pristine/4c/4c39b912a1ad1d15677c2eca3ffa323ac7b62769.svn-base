/*******************************************************
 * Name: 					salesOrderClient
 * Script Type: 			Client
 * Version: 				1.0.000
 * Date: 					11th July 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Client Script Functions to assist in the creation/editing of Sales Orders
 * Checked by:			
 *******************************************************/

var NumberOfPDUsPerPallette = 42;
var NumberOfPallettsFieldID = 'custbody_nopallets';


/***********************************
 * Executes on Field Changed
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 ***********************************/
function onSalesOrderFieldChange(type, name, linenum)
{
	if (type == 'item')
		{
		//alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
	}

	
	if (name == 'shipmethod') 
	
	{
		var thisMethod = nlapiGetFieldValue(name);
		//alert('ship method - myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum + '\nMethodID = ' + thisMethod);
		
		nlapiSetFieldValue('custbody_smethod', thisMethod);
		//var numOfEpisodes = nlapiGetLineItemValue('item', 'custcol_num_of_episodes', linenum);
		//alert('Current line index: ' + linenum + ', current num of eps: ' + numOfEpisodes + ', name: ' + name);
		//nlapiSetLineItemValue('item', 'quantity', linenum, numOfEpisodes);
		//alert('');
	}
	
} 
/****
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 */
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


	//alert('Current Item Qty = ' + currentItemQuantity + '\nCurrent Item Committed = ' + currentItemCommitted + '\nType=' + type);
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
	
		//alert('myValidateLine\nType=' + type);
		
		try
		{
			var currentItemQuantity = 0; //nlapiGetCurrentLineItemValue('item','quantity');
			var currentItemCommitted = 0; //nlapiGetCurrentLineItemValue('item','quantitycommitted');
			var itemTotalQuantity = 0;
			var itemTotalCommitted = 0;
			var numOfItems = nlapiGetLineItemCount('item');
			var pallettesRequired = 0;
		
		//	alert('number of lines: ' + numOfItems);
			
			if(numOfItems > 0)
			{
				for(var i=1;i<=numOfItems;i++)
				{
					currentItemCommitted = parseInt(nlapiGetLineItemValue('item', 'quantitycommitted', i));
					itemTotalCommitted = itemTotalCommitted + currentItemCommitted;	
					currentItemQuantity = parseInt(nlapiGetLineItemValue('item', 'quantity', i));
					itemTotalQuantity = itemTotalQuantity + currentItemQuantity;
				}	
			}
			
			pallettesRequired = parseInt((itemTotalQuantity / NumberOfPDUsPerPallette) + 0.999);	
			nlapiSetFieldValue(NumberOfPallettsFieldID,pallettesRequired,false,false);
		}
		catch(e)
		{
			
		}

	

}

 function DoSomething()
{
	var x= 763542;
}
 

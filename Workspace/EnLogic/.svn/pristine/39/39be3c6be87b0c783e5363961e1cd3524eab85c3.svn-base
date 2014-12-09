/*******************************************************
 * Name: 					itemsClientScript
 * Script Type: 			Client
 * Version: 				1.0.000
 * Date: 					17th April 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Client Script Functions to assist in the addition of Inventory Items
 * Checked by:			
 *******************************************************/


/************************************
 * 
 * Calculates the total number of Receptables
 * 
 ************************************/
 function calculateReceptableTotals()
 {
 	
	try
	{
		var countC13 = parseInt(nlapiGetFieldValue('custitem_rec_c13'));
		var countC19 = parseInt(nlapiGetFieldValue('custitem_rec_c19'));
		var countCCee75 = parseInt(nlapiGetFieldValue('custitem_rec_frenchcee75'));
		var countShuko74 = parseInt(nlapiGetFieldValue('custitem_rec_shuko74'));
		var countBS1363 = parseInt(nlapiGetFieldValue('custitem_rec_ukbs1363'));
		var countTotal = 0;	
		countTotal = countC13 + countC19 + countBS1363 + countCCee75  + countShuko74;
		nlapiSetFieldValue('custitem_rec_total', countTotal);
	}
	catch(e)
	{
		//there is an error
		alert('error: ' + e.message);
	}	
 }

/***********************************
 * Executes on Field Changed
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 ***********************************/
function onItemFieldChange(type, name, linenum)
{
	if (name == 'custcol_item_number') 
	{
		alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
		var numOfEpisodes = nlapiGetLineItemValue('item', 'custcol_num_of_episodes', linenum);
		alert('Current line index: ' + linenum + ', current num of eps: ' + numOfEpisodes + ', name: ' + name);
		nlapiSetLineItemValue('item', 'quantity', linenum, numOfEpisodes);
		alert('');
	}
	
	switch(name)
	{
		case 'custcol_item_number':	
			break;	
		case 'custitem_rec_c13':
		case 'custitem_rec_c19':
		case 'custitem_rec_frenchcee75':
		case 'custitem_rec_shuko74':
		case 'custitem_rec_ukbs1363':
			calculateReceptableTotals();
			break;		
		default:
			//alert('Field Changed Name: ' + name);
			break;
	}
} 
 
 

/*************************************************************************************
 * Name:		setLineItemPO.js
 * Script Type:	Client
 *
 * Version:		1.0.0 - 18/06/13 - First Release - LG
 *
 * Author:		FHL
 * 
 * Purpose:		Auto populate Item from custom item column.
 * 
 * Script: 		[todo]
 * Deploy: 		[todo]
 * 
 * Notes:		
 * 
 * Library: 	library.js
 *************************************************************************************/

function fieldChanged(type, name, linenum)
{
	try
	{
		var itemSelected = '';
		
		if(type == 'item' && name == 'custcol_itemselectpo')
		{
			//Get Item value from custom field.
			itemSelected = nlapiGetCurrentLineItemValue('item', 'custcol_itemselectpo');
			//Sets default item field.
			nlapiSetCurrentLineItemValue('item', 'item', itemSelected, true, false);
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', "fieldChanged", details);
	}
}

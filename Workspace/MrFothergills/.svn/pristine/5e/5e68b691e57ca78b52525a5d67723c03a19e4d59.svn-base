/**********************************************************************************************************
 * 
 * ************  NO LONGER USED   ********************
 * 
 * ************  Has been incorporated into offersClientValidation.js   ********************
 * 
 * 
 * 
 * 
 * Name:		setLineItem.js
 * Client:		Mr Fothergills
 * Script Type:	Client
 * 
 * Version:		1.0.0 - 06/05/2013 - 1st version AM
 *
 * Author:		FHL
 * 
 * Purpose:		Set Line Item on Field Changed Event
 * 
 * Script: 		customscript_setlineitem
 * Deploy: 		customdeploy_setlineitem
 *
 * Form: 		MRF Mr Fothergills Brand Sales Order (this is a scriptable record)
 * 
 * Libraries: 	offersLibrary.js
 *
 * 
 **********************************************************************************************************/


/**
 * clientFieldChanged
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum)
{
	var itemdepartment = '';
	
	try
	{
//		nlapiDisableLineItemField('item', 'item', true);
		
		if(type == 'item' && name == 'custcol_itemdepartment')
		{
			itemdepartment = nlapiGetCurrentLineItemValue('item', 'custcol_itemdepartment');
			
			nlapiSetCurrentLineItemValue('item', 'item', itemdepartment, true, false);
		}
	}
	catch(e)
	{
		errorHandler('clientFieldChanged ',e);
	}
}






//
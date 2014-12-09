/*******************************************************
 * Name:		mrf_shipping.js
 * Script Type:	Client
 *
 * Version:	1.0.0 - 15/08/2012 - Initial version - SB
 * 			1.0.1 - 16/08/2012 - Bugfix: shipcountry sourced after Recalc, displaying non-EU alert
 * 			1.0.2 - 30/08/2012 - Bugfix for IE<9. Array.indexOf method not implemented
 * 								 Remove Sandbox-specific code - SB
 * 			1.0.3 - 28/10/2012 - Code tidy-up - SB
 * 			2.0.0 - 29/10/2012 - Shipping now service items due to VAT-rounding issues - SB
 * 			2.0.1 - 01/11/2012 - Ignore shipping calculation if there is promotional shipping - SB
 * 			2.0.2 - 04/12/2012 - Add error message to Review & Submit page if cannot ship - SB
 * 			2.1.0 - 10/01/2013 - Support both Shipping Item and Service Item for shipping - SB
 * 
 * Author:	Stephen Boot
 * 
 * Purpose:	Custom Shipping rate logic
 * 
 *******************************************************/

var categorySearchResults = null;
var brandPrefix = '';

/*
// ClientScript
function customPageInit(type)
{
	nlapiLogExecution('DEBUG', 'Status', 'customPageInit(' + type + ')');
	
	if (type != 'create')
	{
		return true;
	}
}*/

// ClientScript
function customPostSourcing(type, name)
{
	try
	{
		if (name == 'shipaddresslist')
		{
			calcShipping();
		}
	}
	catch(e)
	{
		errorHandler('customPostSourcing', e);
	}
}
/*
// ClientScript
function customFieldChanged(type, name, linenum)
{
	nlapiLogExecution('DEBUG', 'Status', 'customOnChange(' + type + ', ' + name + ', ' + linenum + ')');
	
	if (name == 'ccsecuritycode')
	{
		calcShipping();
	}
}
*/
// ClientScript
function customRecalcShipping(type, action)
{
	try
	{
		calcShipping();
	}
	catch(e)
	{
		errorHandler('customRecalcShipping', e);
	}
}

// 1.0.2 - Bugfix for IE<9. Array.indexOf method not implemented
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(obj, start)
	{
		for ( var i = (start || 0), j = this.length; i < j; i++)
		{
			if (this[i] === obj)
			{
				return i;
			}
		}
		return -1;
	};
}

/**
 * Assigns correct shipping method
 */
function calcShipping()
{
	try
	{
		if (nlapiGetFieldValue('custbody_mrf_brandcustomer'))
		{
			var shipMethodSet = false;
			var shippingMethod = null;
			var shippingItemLine = 0;
			var shippingOfferApplied = false;
			var uk = false;
			var euCountry = false;
			var hardware = false;
			var livePlants = false;
			var seed = false;
			
			// Shipping Country
			var eu = new Array('AT','BE','BG','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE');
			var shipCountry = nlapiGetFieldValue('shipcountry');
			
			// Brand segregation
			switch(parseInt(nlapiGetFieldValue('department')))
			{
			case 1:
				brandPrefix = 'MRF';
				break;
			case 2: 
				brandPrefix = 'DTB';
				break;
			case 3:
				brandPrefix = 'WLM';
				break;
			case 4:
				brandPrefix = 'JNS';
				break;
			}
			
			if (eu.indexOf(shipCountry) >= 0)
			{
				euCountry = true;
			}
			else if(shipCountry == 'GB')
			{
				uk = true;
			}
			
			// Loop through item list and see what type of items we have
			for (var i = 1; i <= nlapiGetLineItemCount('item'); i++)
			{
				var categoryType = getCategoryTypeByReportingCategoryInternalId(nlapiGetLineItemValue('item', 'custcol_reportingcategory', i));
				
				switch(categoryType)
				{
				case 'PLANTS':
				case 'FLOWER BULBS':
				case 'FRUIT':
				case 'ONIONS/GARLIC/SHALLOTS':
				case 'SEED POTATOES':
					livePlants = true;
					break;
				case 'SEEDS':
					seed = true;
					break;
				case 'HARDWARE':
					hardware = true;
					break;
				}
			}
			
			// Set the most appropriate Shipping Item
			if (uk)
			{
				if (seed && !hardware)
				{
					shippingMethod = getShipMethodByItemId(brandPrefix + ' SEED EXPRESS');
					shipMethodSet = true;
				}
				
				if (livePlants)
				{
					shippingMethod = getShipMethodByItemId(brandPrefix + ' LIVE PLANTS STANDARD');
					shipMethodSet = true;
				}
				
				if (hardware)
				{
					shippingMethod = getShipMethodByItemId(brandPrefix + ' HEAVY BULKY');
					shipMethodSet = true;
				}
				
				if (seed && hardware)
				{
					shippingMethod = getShipMethodByItemId(brandPrefix + ' SEED HEAVY BULKY');
					shipMethodSet = true;
				}
				
				if (livePlants && hardware)
				{
					shippingMethod = getShipMethodByItemId(brandPrefix + ' LIVE PLANTS HEAVY BULKY');
					shipMethodSet = true;
				}
			}
			
			if (euCountry && seed && !livePlants && !hardware)
			{
				shippingMethod = getShipMethodByItemId(brandPrefix + ' EU SEED');
				shipMethodSet = true;
			}
			
			if (euCountry && (livePlants || hardware))
			{
				alert('We regret that we cannot supply non-seed items outside the UK.');
				
				// 2.0.2 Add alert to Review & Submit page
				var js = "$(document).ready(function(){alert('We regret that we cannot supply non-seed items outside the UK.');$('#submitter').hide();});";
				nlapiSetFieldValue('custbody_js', nlapiGetFieldValue('custbody_js') + js, false, true);
			}
			
			// Failsafe if countries catered for are not specified in Set Up Web Store
			if (!uk && !euCountry && shipCountry) // 1.0.1
			{
				alert('We regret that we cannot supply non-EU customers.');
				
				// 2.0.2 Add alert to Review & Submit page
				var js = "$(document).ready(function(){alert('We regret that we cannot supply non-EU customers.');$('#submitter').hide();});";
				nlapiSetFieldValue('custbody_js', nlapiGetFieldValue('custbody_js') + js, false, true);
			}

			// Check for shipping items in item list
			for (var line = 1; line <= nlapiGetLineItemCount('item'); line++)
			{
				if (nlapiGetLineItemValue('item', 'custcol_isshipping', line) == 'T')
				{
					// 2.0.1 Is this a shipping offer?
					if (nlapiGetLineItemValue('item', 'custcol_promotionlineadded', line) == 'T')
					{
						shippingOfferApplied = true;
					}
					else if (shippingItemLine == 0)
					{
						shippingItemLine = line;
					}
				}
			}
			
			// Set calculated shipping method if no shipping offer applied
			if (shipMethodSet && !shippingOfferApplied)
			{
				if (shippingMethod.itemType == 'SERVICE')
				{
					// Unset Shipping Item
					nlapiSetFieldValue('shipmethod', '', true, true);
					
					// If no shipping item line, create one
					if (shippingItemLine == 0)
					{
						nlapiSelectNewLineItem('item');
						nlapiSetCurrentLineItemValue('item', 'item', shippingMethod.id, false, true);
						nlapiCommitLineItem('item');
					}
					// If there already is a shipping item line, and it has a different item, change it
					else
					{
						if (nlapiGetLineItemValue('item', 'item', shippingItemLine) != shippingMethod.id)
						{
							nlapiSelectLineItem('item', shippingItemLine);
							nlapiSetCurrentLineItemValue('item', 'item', shippingMethod.id, false, true);
							nlapiCommitLineItem('item');
						}
					}
				}
				else if (shippingMethod.itemType == 'SHIPPING') // 2.1.0
				{
					// Remove shipping Service Item line
					if (shippingItemLine > 0)
					{
						nlapiRemoveLineItem('item', shippingItemLine);
					}
					
					// Set Shipping Item
					nlapiSetFieldValue('shipmethod', shippingMethod.id, true, true);
				}
			}
			
			// Remove previously calculated shipping item line if a 
			// shipping offer has been applied, or no shipping method set
			if (shippingItemLine > 0 
				&& (!shipMethodSet || shippingOfferApplied)) 
			{
				nlapiRemoveLineItem('item', shippingItemLine);
			}
			
			// 1.2.0 If there is a shipping offer applied, unset Shipping Item
			if (shipMethodSet && 
					shippingOfferApplied && 
					shippingMethod.itemType == 'SHIPPING')
			{
				nlapiSetFieldValue('shipmethod', '', true, true);
			}
		}
	}
	catch(e)
	{
		errorHandler('calcShipping', e);
	}
}

/**
 * 
 * @param reportingCategoryId
 * @returns
 */
function getCategoryTypeByReportingCategoryInternalId(reportingCategoryId)
{
	try
	{
		var categoryType = null;
	
		if (!categorySearchResults)
		{
			// Do a search of shipping items to get internalId based upon name
			var filters = new Array();
			var columns = new Array();
			columns[0] = new nlobjSearchColumn('custrecord_mrf_item_repcat_desc');
				
			categorySearchResults = nlapiSearchRecord('customrecord_mrf_item_reportingcategory', null, filters, columns);
		}
		
		if (categorySearchResults)
		{
			for (var i = 0; i < categorySearchResults.length; i++)
			{
				if (categorySearchResults[i].getId() == reportingCategoryId)
				{
					categoryType = categorySearchResults[i].getValue('custrecord_mrf_item_repcat_desc');
				}
			}
		}
		
		return categoryType;
	}
	catch(e)
	{
		errorHandler('getCategoryTypeByReportingCategoryInternalId', e);
	}
}

/**
 * Shipping Method class 2.1.0
 * @param id
 * @param itemType
 * @returns
 */
function ShippingMethod(id, itemType)
{
	this.id = id;
	this.itemType = itemType; // SERVICE or SHIPPING
}

/**
 * Renamed in 2.1.0 from getShipItemInternalIdByItemId
 * @param itemId
 * @returns ShippingMethod
 */
function getShipMethodByItemId(itemId)
{
	try
	{
		var _shippingMethod = null;
		
		var filters = new Array();
		var columns = new Array();
		
		filters[0] = new nlobjSearchFilter('name', null, 'is', itemId);
		
		columns[0] = new nlobjSearchColumn('custrecord_serviceitem');
		columns[1] = new nlobjSearchColumn('custrecord_shipitem');
		
		var searchResults = nlapiSearchRecord('customrecord_shipmethod', null, filters, columns);
		
		if (searchResults)
		{
			// If there is a Service Item
			if (searchResults[0].getValue('custrecord_serviceitem'))
			{
				_shippingMethod = new ShippingMethod(searchResults[0].getValue('custrecord_serviceitem'), 'SERVICE');
			}
			// Else if there is a Shipping Item
			else if (searchResults[0].getValue('custrecord_shipitem'))
			{
				_shippingMethod = new ShippingMethod(searchResults[0].getValue('custrecord_shipitem'), 'SHIPPING');
			}
		}
		
		return _shippingMethod;
	}
	catch(e)
	{
		errorHandler('getShipMethodByItemId', e);
	}
}


/**
 * general error handler
 * 
 * @param e
 */
function errorHandler(sourceRoutine, e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error in ' + sourceRoutine + ': ' + errorMessage, e.toString());
}
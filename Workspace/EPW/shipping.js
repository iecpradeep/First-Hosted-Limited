/********************************************************************************
 * Customer:	Edward Parker Wines
 * Version:		Version 1.4
 * Date:		21/12/2011
 * Author:		First Hosted Limited
 * Developers:  Stephen Boot
 * Notes:		Functions for Scriptable Cart
 ********************************************************************************/

// ClientScript
function customPageInit(type)
{
	nlapiLogExecution('DEBUG', 'Status', 'customPageInit(' + type + ')');
	debugInfo();
	
	if (type != 'create')
	{
		return true;
	}
	
	//shippingByPostcode();
}

// ClientScript
function customPostSourcing(type, name)
{
	nlapiLogExecution('DEBUG', 'Status', 'customPostSourcing(' + type + ', ' + name + ')');
	debugInfo();
	
	if (name == 'shipaddresslist')
	{
		shippingByPostcode();
	}
}

// ClientScript
function customOnChange(type, name, linenum)
{
	nlapiLogExecution('DEBUG', 'Status', 'customOnChange(' + type + ', ' + name + ', ' + linenum + ')');
	debugInfo();
	
	if (name == 'ccsecuritycode')
	{
		shippingByPostcode();
	}
}

// ClientScript
function customRecalc(type, action)
{
	nlapiLogExecution('DEBUG', 'Status', 'customRecalc(' + type + ', ' + action + ')');
	debugInfo();
	
	shippingByPostcode();
	
	// Make sure all locations in line items are set to Norfolk
	/*var numItems = nlapiGetLineItemCount('item');

	for (var line = 1; line <= numItems; line++)
	{
		var itemId = nlapiGetLineItemValue('item', 'item', line);
		var lineItem = nlapiSelectLineItem('item', line);
		var currLocation = nlapiGetCurrentLineItemValue('item', 'location');
		if (currLocation != '9')
		{
			nlapiSetCurrentLineItemValue('item', 'location', '9', true, true);
			nlapiCommitLineItem('item');
		}
	}*/
}

// Checks customer postcode and assigns correct shipping method
function shippingByPostcode()
{
	var shippingMethodFound = false;

	// Checks customer postcode and assigns correct shipping method
	var shippingarea = nlapiGetFieldValue('shipzip');
	
	// Strip out whitespace
	shippingarea = shippingarea.replace(' ', '');

	if (shippingarea.length > 3)
	{
		// Remove last 3 characters
		shippingarea = shippingarea.substr(0, shippingarea.length-3);
		
		// Remove digits
		shippingarea = shippingarea.replace(/\d*\w$/g, '').toUpperCase();
		shippingarea = shippingarea.replace(/\d*$/g, '');
		
		var subtotal = parseFloat(nlapiGetFieldValue('subtotal'));
		var origShipMethod = nlapiGetFieldValue('shipmethod');
		
		nlapiLogExecution('DEBUG', 'Status', 'Shipping Area Code is ' + shippingarea + ' and subtotal is ' + subtotal);
		
		// Search for shipping records that match the shipping area code and order total
		if (shippingarea.length > 0)
		{
			// 1) Find the ID of the postcode
			var filters = [];
			var columns = [];
			
			filters[0] = new nlobjSearchFilter ('name', null, 'is', shippingarea);
			columns[0] = new nlobjSearchColumn('internalId');
			
			var searchResults = nlapiSearchRecord('customrecord_postcodearea', null, filters, columns);
			var postcodeAreaId = 0;
			
			try
			{
				if(searchResults != null)
				{
					if (searchResults.length == 1)
					{
						postcodeAreaId = searchResults[0].getValue(columns[0]);
					}
				}
			}
			catch(SSS_USAGE_LIMIT_EXCEEDED)
			{	
				nlapiLogExecution('DEBUG', 'Error', 'Usage limit exceeded.');
			}
						
			// 2) Find any shipping methods for that postcode where the subtotal of the order is greater than custrecord_gt
			filters[0] = new nlobjSearchFilter('custrecord_postcodearea', null, 'anyOf', postcodeAreaId);
			filters[1] = new nlobjSearchFilter ('custrecord_gt', null, 'lessThan', subtotal);
			
			columns[0] = new nlobjSearchColumn('custrecord_shippingitem');
			
			searchResults = nlapiSearchRecord('customrecord_pc_sr_criteria', null, filters, columns);
			
			try
			{
				if(searchResults != null)
				{
					//nlapiLogExecution('DEBUG', 'Results', searchResults.length);
					
					if (searchResults.length == 1)
					{
						if (origShipMethod != searchResults[0].getValue(columns[0]))
						{
							nlapiLogExecution('DEBUG', 'Status', 'Setting shipmethod to ' + searchResults[0].getValue(columns[0]));
							nlapiSetFieldValue('shipmethod', searchResults[0].getValue(columns[0]), true, true);
						}
						hardCodeShippingCost()

						shippingMethodFound = true;

						return true;
					}
				}
				else
				{
					//nlapiLogExecution('DEBUG', 'Results', 'no results #1');
				}
			}
			catch(SSS_USAGE_LIMIT_EXCEEDED)
			{	
				nlapiLogExecution('DEBUG', 'Error', 'Usage limit exceeded.');
			}
			
			// 3) Find any shipping methods for that postcode where the subtotal of the order is less than or equal to custrecord_lte
			filters[1] = new nlobjSearchFilter ('custrecord_lte', null, 'greaterThanOrEqualTo', subtotal);
			
			searchResults = nlapiSearchRecord('customrecord_pc_sr_criteria', null, filters, columns);
			
			try
			{
				if(searchResults != null)
				{
					//nlapiLogExecution('DEBUG', 'Results', searchResults.length);
					
					if (searchResults.length == 1)
					{
						if (origShipMethod != searchResults[0].getValue(columns[0]))
						{
							nlapiLogExecution('DEBUG', 'Status', 'Setting shipmethod to ' + searchResults[0].getValue(columns[0]));
							nlapiSetFieldValue('shipmethod', searchResults[0].getValue(columns[0]), true, true);
						}
						hardCodeShippingCost()

						shippingMethodFound = true;

						return true;
					}
				}
				else
				{
					//nlapiLogExecution('DEBUG', 'Results', 'no results #2');
				}
			}
			catch(SSS_USAGE_LIMIT_EXCEEDED)
			{	
				nlapiLogExecution('DEBUG', 'Error', 'Usage limit exceeded.');
			}
		}
	}
	
	// 4) If no shipping methods found, assume TBC
	if (!shippingMethodFound)
	{
		if (origShipMethod != '3646')
		{
			nlapiLogExecution('DEBUG', 'Status', 'No shipping area criteria records found for "' + shippingarea + '". Setting shipmethod to 3646');
			nlapiSetFieldValue('shipmethod', '3646', true, true); // TBC
		}
		hardCodeShippingCost()
		
		return true;
	}
}

function hardCodeShippingCost()
{
	// Hard-code shippingcost based on selected shipmethod
	/*switch (parseInt(nlapiGetFieldValue('shipmethod')))
	{
	case 3641: // Local <= £250
		nlapiSetFieldValue('shippingcost', 10.00);
		break;
	case 3644: // National <= £350
		nlapiSetFieldValue('shippingcost', 15.00);
		break;
	default:
		nlapiSetFieldValue('shippingcost', 0.00);
		break;
	}*/
}

function debugInfo()
{
	nlapiLogExecution('DEBUG', 'Status', 'shipaddress,shipzip,shippingcost,subtotal,shipmethod = ' + nlapiGetFieldValue('shipaddress') + ',' + nlapiGetFieldValue('shipzip') + ',' + nlapiGetFieldValue('shippingcost') + ',' + nlapiGetFieldValue('subtotal') + ',' + nlapiGetFieldValue('shipmethod'));
}

// ClientScript
function customValidateLine(type)
{
	nlapiLogExecution('DEBUG', 'Status', 'customValidateLine(' + type + ')');
	debugInfo();
	
	if (type != 'item')
	{
		return true;
	}
	
	var numBottlesInCaseId = nlapiGetCurrentLineItemValue('item', 'custcol_bottlesincase');
	var numBottlesInCase = 0;
	var numQty = nlapiGetCurrentLineItemValue('item', 'quantity');
	
	numBottlesInCase = nlapiLoadRecord('customrecord_bottlesincase', numBottlesInCaseId);
	numBottlesInCase = numBottlesInCase.getFieldValue('name');

	// If quantity not a multiple of the number of bottles in case, validation fails
	if(numBottlesInCase > 0 && numQty % numBottlesInCase != 0)
	{
		alert('The quantity (' + Math.abs(numQty) + ') needs to be a multiple of ' + numBottlesInCase + ' (the number of bottles in a case).');
		return false;
	}
	
	// All validations passed. Return true.
	return true;
}

// User Event Script
function customBeforeSubmit()
{
	nlapiLogExecution('DEBUG', 'Status', 'Start customBeforeSubmit()');
	
	// Default the location to Norfolk
	nlapiLogExecution('DEBUG', 'Status', 'Defaulting the location to Norfolk');
	nlapiSetFieldValue('location', '9', true, true);
	
	return true;
}

// User Event Script
function customAfterSubmit()
{
	nlapiLogExecution('DEBUG', 'Status', 'Start customAfterSubmit()');
	
	// Set over 18 flag to true as to get to this point they would have had to agree they are 18 or over
	nlapiLogExecution('DEBUG', 'Status', 'Set customer entity id = ' + nlapiGetFieldValue('entity') + ' as over 18');
	
	var customer = nlapiLoadRecord('customer', nlapiGetFieldValue('entity'));
	customer.setFieldValue('custentity_over18', 'T');
	nlapiSubmitRecord(customer);
	
	return true;
}

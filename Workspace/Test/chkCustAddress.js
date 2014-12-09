/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       25 Feb 2013     matt
 *
 */

var customerId = 0;
var recType = '';
var recCustomer = null;

function checkCountryAndVatNo()
{	
	var defShipLine = 0;
	var shipCountry = '';
	var vatNo = '';
	
	var retVal = true;
	
	customerId = nlapiGetRecordId();
	recType = nlapiGetRecordType();
	recCustomer = nlapiLoadRecord('customer', customerId);
	
	defShipLine = recCustomer.findLineItemValue('addressbook', 'defaultshipping', 'T');
	
	shipCountry = recCustomer.getLineItemValue('addressbook', 'country', defShipLine);
	vatNo = recCustomer.getFieldValue('vatregnumber');
	
	if(shipCountry.length == 0 || vatNo.length == 0)
	{
		if (shipCountry.length == 0)
		{
			nlapiLogExecution('DEBUG', 'No country is set');
		}
		else
		{
			nlapiLogExecution('DEBUG', 'No VAT number is set');
		}
		retVal = false;
	}
	return retVal;
}
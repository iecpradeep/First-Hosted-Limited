/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.13       22 Oct 2012     Mike Lewis	   Munster AI pricing level client script.
 *
 */
function clientLineInit()

{

var cowInsem = 362; // Insert item number here...
var lineitem = nlapiGetCurrentLineItemValue('item', 'item'); // Gets the current line item value
var price = 0; // Sets the price at 0

if (lineitem == cowInsem) // If the line item selected is the same as above...
	
	{
	var pricing1 = parseInt(nlapiGetFieldText('custbody_pricing1')); // Gets the field text ( which in this case is a number in string format )
	var pricing2 = parseInt(nlapiGetFieldText('custbody_pricing2')); // Gets the field text ( which in this case is a number in string format )
	var pricing3 = nlapiGetFieldValue('custbody_pricing3'); // Checks to see if the checkbox == True
	
	if (pricing3 == 'T') // If Checkbox is true then...
		
		{
			price = (pricing1 + pricing2) / 2; // Gets the pricing1 and pricing 2, adds them together, then divides by two.
		}
	
	else // If the check box is false then...
		{
			price = pricing1 + pricing2; // calculates the price as pricing1 + pricing2
		}
	
	nlapiSetCurrentLineItemValue('item', 'amount', price); // Sets the price onto the current line item.
	
	}

return true;

}
/****************************************************************************************
 * Name:			Get Full Addresses
 * Script Type:		Client
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 02 Jul 2012 - first release - MJL
 * 			1.0.1 - 05 Jul 2012 - added setting of default flags - MJL
 *  		1.0.2 - 07 Aug 2012 - changed IDs to match standards - MJL
 *  		1.0.3 - 26 Oct 2012 - added prototype indexOf() function for use in IE - MJL
 *
 * Author:	FHL
 * Purpose:	Populate suitelet address fields on field change
 * 
 * Client script: Set Address Text Fields
 * Script: customscript_addrtxtfields
 ****************************************************************************************/

/**
 * 1.0.3 added prototype indexOf() function for use in IE
 */
Array.prototype.indexOf = function(obj)
{
	for(var i = 0; i < this.length; i++)
	{
		if (this[i] == obj)
		{
			return i;
		}
	}
	return -1;
}

/**
 * Populates address fields on suitelet on field change
 * 
 * 1.0.1 added setting of default flags
 * 1.0.2 parameterised array indices
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function getFullAddress_OnFieldChange(type, name)
{
	var arrayDump = '';
	var addrArray = null;
	var addressID = '';
	var index = 0;
	
	//[TODO] Parameterise
	var selAddress = 1;
	var isDefaultShip = 3;
	var isDefaultBill = 4;
	
	//1.0.2 changed IDs
	if (name == 'custpage_shipaddresses' || name == 'custpage_billaddresses')
	{	
		//get 2D array dump string from suitelet
		arrayDump = nlapiGetFieldValue('custpage_arraydump');
		
		//split into new array
		addrArray = arrayDump.split('|');
		
		//get internal ID of selected address
		addressID = nlapiGetFieldValue(name);
		
		//get array index of ID 
		for (var i = 0; i < addrArray.length; i++)
		{
			index = addrArray.indexOf(addressID);
			
			if (index != -1)
			{	
				selAddress = selAddress + index;
				break;
			}
		}
		
		//post full address to relevant text area field
		//1.0.1 added setting of default flags
		if (name == 'custpage_shipaddresses') //1.0.2
		{	
			isDefaultShip = isDefaultShip + index;
			nlapiSetFieldValue('custpage_selshipaddress', addrArray[selAddress]);
			nlapiSetFieldValue('custpage_isdefaultship', addrArray[isDefaultShip]);
			
		}
		else if (name == 'custpage_billaddresses') //1.0.2
		{
			isDefaultBill = isDefaultBill + index;
			nlapiSetFieldValue('custpage_selbilladdress', addrArray[selAddress]);
			nlapiSetFieldValue('custpage_isdefaultbill', addrArray[isDefaultBill]);	
		}
	}
}

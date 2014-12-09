/**************************************************************************
 * Name:			Get Full Addresses
 * Script Type:		Client
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 02 Jul 2012 - first release - MJL
 * 			1.0.1 - 05 Jul 2012 - added setting of default flags - MJL
 *  		1.0.2 - 07 Aug 2012 - changed IDs to match standards - MJL
 *  		1.1.0 - 26 Oct 2012 - reworked script to suppress indexOf() error in IE - MJL
 *
 * Author:	FHL
 * Purpose:	Populate suitelet address fields on field change
 * 
 * Client script: Set Address Text Fields
 * Script: customscript_addrtxtfields
 **************************************************************************/

Array.prototype.internalId = String();
Array.prototype.address = String();
Array.prototype.addressLabel = String();
Array.prototype.defaultShipping = String();
Array.prototype.defaultBilling = String();

var address = '';	
var tempArray = new Array();
var addressArray = new Array();
var addressPosition = 0;

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
//	var arrayDump = '';
//	var addrArray = null;
//	var addressID = '';
//	var index = 0;
//	
//	//[TODO] Parameterise
//	var selAddress = 1;
//	var isDefaultShip = 3;
//	var isDefaultBill = 4;
	
	var localAddressArray = new Array();
	//alert(addressArray);
	
	//1.0.2 changed IDs
	if (name == 'custpage_shipaddresses' || name == 'custpage_billaddresses')
	{	
		localAddressArray = getAddressesFromHidden();
		
//		//get 2D array dump string from suitelet
//		arrayDump = nlapiGetFieldValue('custpage_arraydump');
//		
//		//split into new array
//		addrArray = arrayDump.split('|');
//		
//		//get internal ID of selected address
//		addressID = nlapiGetFieldValue(name);
//		
//		//get array index of ID 
//		for (var i = 0; i < addrArray.length; i++)
//		{
//			index = addrArray.indexOf(addressID);
//			
//			if (index != -1)
//			{	
//				selAddress = selAddress + index;
//				break;
//			}
//		}
		
		for (var i = 0; i < localAddressArray.length; i++)
		{	
			//post full address to relevant text area field
			//1.0.1 added setting of default flags
			if (name == 'custpage_shipaddresses') //1.0.2
			{	
				//isDefaultShip = isDefaultShip + index;
				//nlapiSetFieldValue('custpage_selshipaddress', addrArray[selAddress]);
				//nlapiSetFieldValue('custpage_isdefaultship', addrArray[isDefaultShip]);
				
				nlapiSetFieldValue('custpage_selshipaddress', localAddressArray[i].address);
				nlapiSetFieldValue('custpage_isdefaultship', localAddressArray[i].defaultShipping);
			}
			else if (name == 'custpage_billaddresses') //1.0.2
			{
				//isDefaultBill = isDefaultBill + index;
//				nlapiSetFieldValue('custpage_selbilladdress', addrArray[selAddress]);
//				nlapiSetFieldValue('custpage_isdefaultbill', addrArray[isDefaultBill]);
				
				nlapiSetFieldValue('custpage_selshipaddress', localAddressArray[i].address);
				nlapiSetFieldValue('custpage_isdefaultship', localAddressArray[i].defaultBilling);
			}
		}
	}
}

function getAddressesFromHidden()
{	
	address = nlapiGetFieldValue('custpage_arraydump');	
	tempArray = address.split('|');
	var numofaddresses = (parseInt(tempArray.length) / 5);
	
	for(var i = 0; i < numofaddresses; i++)
	{
		addressArray[i] = new String();
	}

	addressPosition = 0;
	
	for(var i = 0; i < tempArray.length; i++)
	{	
		switch(Right(i.toString(), 1))
		{
			case '0':
			case '5':
				//Address Internal ID
				addressArray[addressPosition].internalId = tempArray[i];
				break;
			case '1':
			case '6':
				//Address Address Label
				addressArray[addressPosition].address = tempArray[i];
				break;
			case '2':
			case '7':
				//Address
				addressArray[addressPosition].addressLabel = tempArray[i];
				break;
			case '3':
			case '8':
				//Is Default Shipping
				addressArray[addressPosition].defaultShipping = tempArray[i];
				break;
			case '4':
			case '9':
				//Is Default Billing
				addressArray[addressPosition].defaultBilling = tempArray[i];
				addressPosition++;
				break;
			default:
				alert('WHAT THE?!?!?!');
		}
	}	
	//alert('Address Array dump:\n' + addressArray);
	return addressArray;
}

function Right(str, n)
{
	var retVal = '';
	
    if (n <= 0)
    {
    	retVal = '';
    }
    else if (n > String(str).length)
    {
    	retVal = str;
    }   
    else
    {
       var iLen = String(str).length;
       retVal = String(str).substring(iLen, iLen - n);
    }
    return retVal;
}
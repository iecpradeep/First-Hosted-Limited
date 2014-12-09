/**********************************************************************************************************
 * Name:        validateField  (validateFieldClient.js)
 * Script Type: Client Script
 * Client:      Destiny Entertainment
 * 
 * Version:     1.0.0 - 17 April 2013 - first release - SA
 * Version:     1.0.1 - 18 April 2013 - amended - removed using magic number and added lookupfield- SA
 * Version:     1.0.2 - 22 April 2013 - added - added block to validate shipping address field- SA
 * Version:     1.0.3 - 22 April 2013 - commented out the line for validating shipping field, it is not submiting whend elivery address exist, need to talk with Pete- SA
 * 
 * Author:      FHL
 * Purpose:     On the sales order, restrict being choosing UK as location, they need to choose sub location, not parent
 * 
 * Script:      customscript_validatefieldclient
 * Deploy:      customdeploy_validatefieldclient 
 * 
 * 
 **********************************************************************************************************/
function ValidateField()
{
	var retValue = true;	
	var fieldValue = null;
	var location = null;

	try
	{	
		fieldValue = nlapiGetFieldValue('location');
		//1.0.1
		location =	nlapiLookupField('location',fieldValue,'name');

		// chosen location is UK, then pop up message window and do not allow to submit therecord
		if (location == 'UK') 
		{	
			alert("You have selected an invalid Location. Please ensure your Location field is correctly set");
			retValue = false;
		}

	}
	catch (e)
	{
		errorHandler('ValidateField', e);
	}
	
/*	if (retValue == true)
	{	
		ValidateDeliveryAddressField();	
	}*/
	
	return retValue;
}

/*******
 * ValidateDeliveryAddressField
 * Version:     1.0.2 - 22 April 2013 - added - added block to validate shipping address field- SA
 ********/
/*function ValidateDeliveryAddressField()	

{
	var retValue = true;
	//1.0.3
	
	var orderTypeFieldValue = null ;
	var orderType = null;
	var shipAddress = null;
	

	try
	{	
		orderTypeFieldValue = nlapiGetFieldValue('custbody_ordertype');
		orderType =	nlapiLookupField('customrecord_ordertype',orderTypeFieldValue,'name');

		shipAddress = nlapiGetFieldValue('shipaddress');

		shipAddress = shipAddress.toString();

		if ((orderType == 'Delivered') && (shipAddress.length == 0))
		{	
			alert("You have not selected delivery address. Please choose it under the Delivery details tab.");
			retValue = false;
		}

	}
	catch (e)
	{
		errorHandler('ValidateDeliveryAddressField', e);
	}

	return retValue;

}*/
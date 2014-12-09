/**********************************************************************************************************
 * Name:        pickPackShipValidateField  (pickPackShipValidateFieldClientScript.js)
 * Script Type: Client Script
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 19 Mar 2013 - first release - SA

 * 
 * Author:      FHL
 * Purpose:     on the order selection screen: Validate custom fields to restrict the field length (i.e 4).
 * 
 * Script:      customscript_pickpackshipvalidatefield 
 * Deploy:      customdeploy_pickpackshipvalidatefield 
 * 
 * 
 **********************************************************************************************************/
function ValidateField(type, name)
{
	var retValue = true;
	
	var fieldValue = '';

	
	try
	{
		
		if ((name == 'custpage_pps_limitnumberoforders') || (name == 'custpage_pps_batchsize')) // field "limit number of orders"
		{	
			fieldValue = parseInt(nlapiGetFieldValue(name));

			if ((fieldValue > 9999) || (fieldValue < 0))
			{	
				alert("Invalid field value " + fieldValue.toString() + "\nPlease enter a number between 0 and 9999.");
				retValue = false;
			}
		}
	}
	catch (e)
	{
		errorHandler('ValidateField', e);

	}
	return retValue;
}


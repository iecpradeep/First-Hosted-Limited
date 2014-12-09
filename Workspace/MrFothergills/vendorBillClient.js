/********************************************************************
 * Name: vendorBillClient.js
 * Script Type: Client
 *
 * Version: 1.0.0 - 07/01/2013 - 1st release - PAL
 * 			1.1.0 - 08/01/2013 - adding the clientSaveRecord - AS and SA
 * 			  
 * Author: First Hosted Limited
 *
 * Purpose: to populate a value a field on Bill and to validate the amounts in Bill
 * 
 * Script:   
 * Deploy:   
 *
 * Notes: this is linked to the 'Custom Supplier Bill'
 * 
 * Library: n/a
 ********************************************************************/


/***************************************************************************
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 ****************************************************************************/
function clientPageInit(type)
{
	var createdFromID = '';

	try
	{
		createdFromID = getURLParameter('id');
		if(createdFromID != '')
		{
			nlapiSetFieldValue('custbody_createdfrom', createdFromID);	
		}

	}
	catch(e)
	{
		errHandler('pageInit', e);
	}

}




/************************************************************************************
 * getURLParameter - gets the specified parameter from the URL
 * 
 * @param parameterName - The URL Parameter
 * @returns - The Value of the Parameter
 ***********************************************************************************/
function getURLParameter(parameterName)
{

	var retVal = '';
	var regexS = '';  
	var regex = '';  
	var results = ''; 

	try
	{
		parameterName = parameterName.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");  
		regexS = "[\\?&]"+parameterName+"=([^&#]*)";  
		regex = new RegExp( regexS );  
		results = regex.exec(window.location.href); 

		if(results == null)   
		{
			retVal = '';  
		}
		else 
		{
			retVal = results[1];
		}
	}
	catch(e)
	{
		retVal = e.message();
	}

	return retVal;
}


/***************************************************************************
 * clientSaveRecord - to validate the vendor bill line item amount with the purchase order line item amount 
 * 
 *@returns {Void}
 ****************************************************************************/
function clientSaveRecord()
{
	//declaring local variables
	var itemValue = 0;
	var LineItemCount = 0;
	var poNumber = 0;
	var poLineItemValue = 0;
	var poRecord = '';

	try
	{
		//getting the number of line items in the vendor bill's 'items' group
		LineItemCount = nlapiGetLineItemCount('item');
		
		//getting the po number from the 'Created From' custom field in 'Vendor Bill'
		poNumber = nlapiGetFieldValue('custbody_createdfrom');
		
		//Loading the particular purchase order linking with the bill
		poRecord = nlapiLoadRecord('purchaseorder', poNumber, null);
		
		//looping through the line items in the bill
		for (var i = 1; i <= LineItemCount; i++)
		{
			//getting the line item value in 'amount' in bill
			itemValue = nlapiGetLineItemValue('item', 'rate', i);
			
			//getting the particular line item value in 'amount' in purchase order (Note : the PO and bill line item order should be the same)
			poLineItemValue = poRecord.getLineItemValue('item', 'rate', i);
			
			//compare the amount values in bill and purchase order in particular line item
			if(itemValue != poLineItemValue)
			{
				//if the values are not equal, popping up a message, else do nothing 
				alert('The Invoice price differs from the PO price - Invoice Pending Approval');
				return true;
			}
			else
			{
				 return true;
			}
		}
			
	}
	catch(e)
	{
		errHandler('clientSaveRecord', e);	
	}
   
}


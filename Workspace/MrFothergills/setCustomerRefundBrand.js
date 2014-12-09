/*************************************************************************************
 * Name:		setCustomerRefundBrand.js
 * Script Type:	Client
 *
 * Version:		1.0.0 - 19/06/2013 - Initial version - AM
 * 
 * 
 * Author:		FHL
 * 
 * Purpose:		Set the brand on the Customer Refund Form
 * 
 * 
 * Library:     Library.js 
 *************************************************************************************/


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function fieldChangeSetBrand(type, name, linenum)
{
	//Declare variable
	var entity = '';
	var brand = '';
	
	try
	{
		//Initialise variable
		entity = 'customer';
		brand = 'department';
			
		if(name == entity)
		{
			clientFieldChangedToSetBrand(type, name, linenum, entity, brand);
		}
	}
	catch(e)
	{
		errorHandler("fieldChangeSetBrand: ", e);
	}
}
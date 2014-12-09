/*************************************************************************************
 * Name:		setBrand.js
 * 
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 20/06/2013 - Initial version - AM
 * 
 * Author:		FHL
 * 
 * Purpose:		Set the customer brand on the General Sales Order Form.
 * 
 * Library:     Library.js 
 *************************************************************************************/



/**
 * @param type
 * @param form
 * @param request
 */
function beforeLoad(type,form,request)
{
	var entity = '';
	
	try
	{
		entity = nlapiGetFieldValue('entity');

		if (type == 'create' && entity!= null)
		{
			var customerBrand = nlapiLookupField('customer', entity, 'custentity_mrf_cust_brand');
			nlapiSetFieldValue('custbody_mrf_brandcustomer', entity);

			if ( customerBrand == '1')
			{
				nlapiSetFieldValue('department',1); //Set the Department (Brand) to Mr Fothergill's
			}
			if ( customerBrand == '2')
			{
				nlapiSetFieldValue('department',2); //Set the Department (Brand) to DT Brown
			}
			if ( customerBrand == '3')
			{
				nlapiSetFieldValue('department',3); //Set the Department (Brand) to Woolmans
			}
			if ( customerBrand == '4')
			{
				nlapiSetFieldValue('department',4); //Set the Department (Brand) to Johnsons
			}
		}
		else
		{
			//zzzzz
			//nlapiSetFieldValue('department','');
		}
	}
	catch(e)
	{
		errorHandler("beforeLoad", e);
	}
}

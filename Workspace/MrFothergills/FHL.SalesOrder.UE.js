/*************************************************************************************
 * Name:		FHL.SalesOrder.UE.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 15/08/2012 - Initial version - BR
 * 				1.1.0 - 10/12/2012 - Altered to only store entity and brand on
 * 									 pageInit by MRF_SalesOrder.js on Sales Forms. - AM
 * 				1.1.1 - 18/12/2012 - Give department/Brand a default setting - AM
 * 
 * Author:		FHL
 * 
 * Purpose:		Save the customer and set the Brand on the Sales Order Form
 * 
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
		
		nlapiSetFieldValue('department',1);

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
	}
	catch(e)
	{
		nlapiLogExecution('Error', 'Before Load on Sales Order Form', e.message);
	}
}

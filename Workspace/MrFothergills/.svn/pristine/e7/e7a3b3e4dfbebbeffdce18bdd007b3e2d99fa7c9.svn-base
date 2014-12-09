/*************************************************************************************
 * 
 * *******************************  NO LONGER USED   *********************************
 * 
 * ************  Has been incorporated into offersClientValidation.js   **************
 * 
 *************************************************************************************/
//[todo] merge with offerclientvalidation
//[todo] please use std error handler


/*************************************************************************************
 * Name:		MrF_SalesOrder.js
 * Script Type:	Client
 *
 * Version:		1.0.0 - 21/05/2013 - Initial version - AM
 * 				1.0.1 - 01/05/2013 - Disable Shipping Fields - AM
 * 		
 * Author:		fhl
 * 
 * Purpose:		determines which form and fields for user/role
 * 
 *************************************************************************************/

//Call Centre Role
var callCentreRole = '1015';

/** 
 * 
 * initialise
 * 
 */
function pageInit(type)
{
	try
	{
		disableLineItemFields();
	}
	catch(e)
	{
		alert( 'Page Initiate '+ e.message);
	}
	
	return true;
}


/**
 * @param type
 * 
 */
function lineinit(type)
{
	try
	{
		disableLineItemFields();
	}
	catch(e)
	{
		alert('Line Initiate '+ e.message);
	}
	
	return true;	
}


/**
 * 
 * disableLineItemFields()
 *
 * 
 * 1.0.1 - 01/05/2013 - Disable Shipping Fields - AM
 * 
 */
function disableLineItemFields()
{
	var userRole = 0;
	
	try
	{		
		userRole = nlapiGetRole();
		
//		Check if the role is MRF Call Centre Role		
		if(userRole == callCentreRole)
		{			
//			Disable Line Item Fields
			nlapiDisableLineItemField('item', 'grossamt', true);			
			nlapiDisableLineItemField('item', 'options', true);
			nlapiDisableLineItemField('item', 'item', true);
			nlapiDisableLineItemField('item', 'custcol_offerpriceincvat', true);
			nlapiDisableLineItemField('item', 'custcol_outofstockmessage', true);
			nlapiDisableLineItemField('item', 'custcol_mrf_itemprice', true);
			nlapiDisableLineItemField('item', 'tax1amt', true);
			nlapiDisableLineItemField('item', 'custcol_mrf_itemcode', true);
			nlapiDisableLineItemField('item', 'rate', true);
            nlapiDisableLineItemField('item', 'giftcertfrom', true);
            nlapiDisableLineItemField('item', 'giftcertmessage', true);
            nlapiDisableLineItemField('item', 'giftcertrecipientemail', true);
            nlapiDisableLineItemField('item', 'giftcertrecipientname', true);    
			nlapiDisableLineItemField('item', 'location', true); 		// Location
			nlapiDisableLineItemField('item', 'createwo', true); 		// Create WO
			nlapiDisableLineItemField('item', 'price', true);	 		// Price Level
			nlapiDisableLineItemField('item', 'description', true); 	// Description
			nlapiDisableLineItemField('item', 'taxcode', true);			// *VAT Code
			nlapiDisableLineItemField('item', 'altsalesamt', true); 	// Alt. Sales
			nlapiDisableLineItemField('item', 'custcol_itemcodeprint', true); 	// Item Code			
			nlapiDisableLineItemField('item', 'amount', true);
	
//			Disable Shipping Fields - 1.0.1
			nlapiDisableField('shipcarrier', true);
			nlapiDisableField('shipmethod', true);
			nlapiDisableField('shippingcost', true);
			nlapiDisableField('shippingtax1rate', true);
			nlapiDisableField('shippingtaxcode', true);
		}
	}
	catch(e)
	{
		alert('disableLineItemFields', e.message);
	}
}

















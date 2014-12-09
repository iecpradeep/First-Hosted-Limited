/**********************************************************************************************************
 * Name:		offersClientValidation.js
 * 
 * Script Type:	client
 * 
 * 
 * Version:		1.0.0 - 19/3/2013 - 1st version JM
 * 				1.0.1 - 03 May 2013	- removed reference to custbody_mrf_brandcustomer
 *
 *	
 * Author:		FHL
 * 
 * Purpose:		Validate Campaign Code Entered
 * 
 * Script: 		
 * Deploy: 		
 *
 * Form: 		MRF Mr Fothergills Brand Sales Order (this is a scriptable record)
 * 
 * Libraries: 	offersLibrary.js
 *
 * 
 **********************************************************************************************************/

var user = nlapiGetUser();

var filters = new Array();
var columns = new Array();
var searchResults = null; 			
var campaignSearchResults = null; 	
var campaignCode = '';
var campaignIntID = 0;
var customer = 0;

//Global Variables
var MRFCallCentreRoleCONST = '1015';// 1015 MRF F Call Centre Role Internal ID
var userRole = 0; 
var entity = 0;
var customerBrand = 0;
var role = 0;
var formID = new Array(4);
var department = 0;
var salesOrderForm = 0;

var grossamt = 0;
var qty = 0;
var startprice = 0;
var partnerIntID = 0;

var derivedCampaignCode = '';


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type)
{
//	var entityCustomer = 0;
	var retVal = true;
	
	try
	{
//		entityCustomer = nlapiGetFieldValue('entity');
//
//		if(entityCustomer != '' || entityCustomer != null)
//		{
//			setBrand();
//		}
		
		disableLineItemFields();	
	}
	catch(e)
	{
		errorHandler("clientPageInit", e);
	}
	return retVal;

}

/**************************************************************************************************************
 * get item 
 ***************************************************************************************************************/
function fieldChanged(type, name, linenum)
{
	var retVal = true;
	var itemdepartment = '';
	
	// Make the field in the Customer field.
	if(name == 'entity')
	{
		initialise();
		whichRole();
		setBrand();
		disableLineItemFields();
	}

	if (name == 'custbody_campaign')
	{
		checkCampaignCode();
	}

	if(type == 'item' && name == 'custcol_itemdepartment')
	{
		itemdepartment = nlapiGetCurrentLineItemValue('item', 'custcol_itemdepartment');
		nlapiSetCurrentLineItemValue('item', 'item', itemdepartment, true, false);
	}

	return retVal;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function clientLineInit(type) 
{
	var retVal = true;

	try
	{
		disableLineItemFields();
	}
	catch(e)
	{
		errorHandler("clientLineInit", e);
	}
	
	return retVal;
}

/**
 *	check Campaign Code
 * 
 */
function checkCampaignCode()
{
	var retVal = false;

	try
	{
		campaignCode = nlapiGetFieldValue('custbody_campaign');

		if(campaignCode.length > 0)
		{

			customer = nlapiGetFieldValue('entity');
			customer = customer.toUpperCase();

			if(checkIfCampaignIsValid(campaignCode)==true)
			{
				partnerIntID = getPartnerFromCampaign(campaignCode);
				if(partnerIntID!=0)
				{
					nlapiSetFieldValue('partner',partnerIntID);  //Set the Department (Brand) to Mr Fothergill's
				}
				retVal = true;
			}
			else
			{
				alert('Campaign not valid, checking for last mailed campaign code');
				campaignCode = '';
				
				if(getPromotionsButtonClick()==true)
				{
					retVal = true;
				}
			}

		}
	}
	catch(e)
	{
		errorHandler("checkCampaignCode", e);
	}

	return retVal;
}


function initialise()
{
	MRFCallCentreRoleCONST = 0;		// nlapiGetContext().getSetting('SCRIPT', 'custscript_callcentrerole');
}




/**
 * [TODO] - Check if entity field is populated or not
 *	set brand 
 * 
 */
function setBrand()
{
	try
	{
		entity = nlapiGetFieldValue('entity');
		department = nlapiGetFieldValue('department');
		salesOrderForm = nlapiGetFieldValue('customform');
		customerBrand = nlapiLookupField('customer', entity, 'custentity_mrf_cust_brand');
		nlapiSetFieldValue('entity', entity, false,true);

		if ( customerBrand == '1')
		{
			nlapiSetFieldValue('department',1); //Set the Department (Brand) to Mr Fothergill's
		}
		if ( customerBrand == '2')
		{
			nlapiSetFieldValue('department',2); //Set the Department (Brand) to Mr Fothergill's
		}
		if ( customerBrand == '3')
		{
			nlapiSetFieldValue('department',3); //Set the Department (Brand) to Mr Fothergill's
		}
		if ( customerBrand == '4')
		{
			nlapiSetFieldValue('department',4); //Set the Department (Brand) to Mr Fothergill's
		}
	}
	catch(e)
	{
		//alert("Please contact your system administrator, the call centre form is not setup.", e.message);
	}
}


/** 
 * 
 * determine which forms to use
 * 1.0.1 - added 23/11/2012
 * 
 */
function whichRole()
{
	try
	{
		userRole = nlapiGetRole();		// 1.0.1 determine user role

		// check if we are MR F Call Centre Role 
		if(userRole == MRFCallCentreRoleCONST)
		{
			role = 1;
		}
		else
		{
			role = 0;
		}
	}
	catch(e)
	{
		alert('determineWhichFormsToUse ', e.message);
	}
}


/**
 * 
 * DisableLineItemFields
 *
 */
function disableLineItemFields()
{
	try
	{	
//		Disable the line item field item
		nlapiDisableLineItemField('item', 'item', true);
		
//		Check the user role
		whichRole();

//		Check if the role is MRF Call Centre Role
		if(role == 1)
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

//			Disable Shipping Fields
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

/**
 * get Partner From Campaign
 * 
 * @param campCode
 */
function getPartnerFromCampaign(campCode)
{
	var partnerID = null;
	var campIntID = 0;
	var partnerCampaign = null;

	try
	{
		campIntID = genericSearch('campaign', 'title', campCode);

		if (campIntID) // 1.0.2
		{
			partnerCampaign = nlapiLoadRecord('campaign', campIntID);
			partnerID = partnerCampaign.getFieldValue('custevent_mrf_campaign_partner');
		}
	}
	catch(e)
	{
		errorHandler("getPartnerFromCampaign", e);
	}

	return partnerID; 
}



/** 
 * apply promotion button click 
 * @returns {Boolean}
 */

function getPromotionsButtonClick()
{
	var retVal = false;

	try
	{
		//campaignCode = nlapiGetFieldValue('custbody_campaign');
		customer = nlapiGetFieldValue('entity');
		customerBrand = nlapiGetFieldValue('department');
		
		// check, get or set the campaign code
		if(runSavedSearchCampaigns(campaignCode,customer, customerBrand) == false)
		{
			alert('No valid campaigns for customer, defaulting to Generic Campaign.');
		}

		nlapiSetFieldValue('custbody_campaign', derivedCampaignCode, false, true);

		retVal = true;
	}
	catch(e)
	{
		errorHandler("getPromotionsButtonClick", e);		
	}

	return retVal;
}




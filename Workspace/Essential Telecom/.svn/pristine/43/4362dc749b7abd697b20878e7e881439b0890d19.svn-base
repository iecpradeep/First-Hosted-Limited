/**********************************************************************************************************
 * Name:        voucherSelectorClient.js
 * Script Type: Client
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 23 May 2013 - commenting out the checking and applying of the distributor discount - AS
 *  			1.0.2 - 28 May 2013 - changing the width and height of the suitelet window - AS
 *   			1.0.3 - 07 Jun 2013 - adding setAndValidatePartnerField function - AS
 *   			1.0.4 - 17 Jun 2013 - set the partner field values as the customer - AS
 *   
// * Author:      FHL
 * Purpose:     Allow multiple vouchers to be selected & calculate distributor commission for physical vouchers
 * 
 * Script:      customscript_voucherselectorclient  
 * Deploy:      customdeploy_voucherselectorclient
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var voucherType = 0;	// 1=physical - 2=paypoint - 3=online - 4=telephone
var DISCOUNTITEM = '';	// constant


/**
 * Main function
 * 
 * version 1.0.1 - commenting out the checking and applying of the distributor discount
 * version 1.0.3 - adding setAndValidatePartnerField function
 * 
 */
function voucherSelectorClient(type)
{
	var partner = 0;
	
	initialise();

	if(checkIfVoucherItem()==true)
	{
		//version 1.0.1
		//if(applyDiscountAssociatedWithVoucherAndPartner()==true)
		//{
		
		//version 1.0.3
		partner = setAndValidatePartnerField();	
		if(partner)
		{
			loadVoucherSelectSuitlet();
		}
		else
		{
			alert('Please enter a partner in order to proceed');
		}
	}


}

/**
 * initialise
 * 
 */


function initialise()
{

	DISCOUNTITEM = 'Distributor Commission';

}


/**
 * validatePartnerField - checking whether the partner field is empty
 * 
 * version 1.0.3 - adding validatePartnerField function
 * version 1.0.4 - set the partner field values as the customer
 */
function setAndValidatePartnerField()
{
	var partnerIntID = 0;
	var customerIntID = 0;
	try
	{
		customerIntID = nlapiGetFieldValue('entity');
		
		if(customerIntID != 0)
		{
			nlapiSetFieldValue('partner', customerIntID);			//version 1.0.4
			partnerIntID = nlapiGetFieldValue('partner');			
		}
	}
	catch(e)
	{
		errorHandler("setAndValidatePartnerField", e);
	}
	
	return partnerIntID;
}
	



/**
 * check if the line item is a voucher card
 * 
 */

function checkIfVoucherItem()
{

	var retVal = false;
	var item = '';
	var isVoucher = false;

	try
	{

		// get item code from current line
		item = nlapiGetCurrentLineItemText('item', 'item');

		if(item.length!=0)
		{

			// check if it's a Voucher
			isVoucher = genericSearchColumnReturn('item','itemid',item,'custitem_isvoucher');
			voucherType = genericSearchColumnReturn('item','itemid',item,'custitem_vouchertype');	// 1=physical - 2=paypoint - 3=online - 4=telephone

			if(isVoucher =='T')
			{
				retVal = true;
			}


		}

	}
	catch(e)
	{
		errorHandler("checkIfVoucherItem", e);
	}     	      

	return retVal;

}

/**
 * load voucher selection suitlet
 * version 1.0.2 - changing the width and height of the suitelet window 
 */


function loadVoucherSelectSuitlet(type)
{

	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	var params = ''; 
	var width = 650; 				//version 1.0.2
	var height = 400; 				//version 1.0.2


	try
	{

		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=yes'; 
		params += ', menubar=no'; 
		params += ', resizable=no'; 
		params += ', scrollbars=no'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';

		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();

		scriptNo = context.getSetting('SCRIPT', 'custscript_voucherscriptid');
		deployNo = context.getSetting('SCRIPT', 'custscript_voucherdeployid');

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

		window.open(suiteletURL, 'Vouchers', params);

	}
	catch(e)
	{
		errorHandler("voucherSelectorClient", e);
	}     	      

}

/**
 * get the voucher type from the item in question and lookup the discount from the selected partner
 * only do this for physical vouchers
 */

function applyDiscountAssociatedWithVoucherAndPartner()
{
	var retVal = true;

	try
	{
		// 1=physical - 2=paypoint - 3=online - 4=telephone	

		if(voucherType==1)
		{
			if(dealWithPhysicalVoucerDiscount()==false)
			{
				retVal = false;
			}
		}
	}
	catch(e)
	{
		errorHandler("applyDiscountAssociatedWithVoucherAndPartner", e);
	}     	 

	return retVal;

}


/**
 * apply the discount for a physical voucher
 * 
 */

function dealWithPhysicalVoucerDiscount()
{

	var partnerIntID = 0;
	var discountRate = 0;
	var retVal = false;

	try
	{

		// extract the partner ID from the form
		partnerIntID = nlapiGetFieldValue('partner');

		if(partnerIntID!=0)
		{
			nlapiSetFieldText('discountitem', DISCOUNTITEM);

			discountRate = genericSearchColumnReturn('partner','internalid',partnerIntID,'custentity_physicaldisc');

			if(discountRate!=0)
			{
				nlapiSetFieldValue('discountrate', "-" + discountRate , false, true);
			}
			else
			{
				alert('No discount rate is set for physical vouchers for this partner.');
			}

			retVal = true;
		}
		else
		{
			alert('Please select a partner in order for commissions to be calculated correctly.');
		}

	}
	catch(e)
	{
		errorHandler("dealWithPhysicalVoucer", e);
	}
	
	return retVal;
	
}



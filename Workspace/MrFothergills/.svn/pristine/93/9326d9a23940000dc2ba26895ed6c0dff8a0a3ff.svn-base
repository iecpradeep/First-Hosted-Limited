/*****************************************************************************
 * Name:        FHsetPaymentAmt.js
 * 
 * Script Type: Client Script
 *
 * Version:     1.0.0 - 19/07/2013 - Refactored release - JM 
 *              
 *
 * Author:      FHL
 * 
 * Purpose:     Set the brand for a deposit 
 *              
 * Applies to:	customer deposit
 * 
 * Script:		customscript_fhl_customerdeposit 
 * Deploy:      customdeploy_fhl_customerdeposit
 *              
 * 
 * Notes:       renamed from setPaymentAmt.js to FHsetPaymentAmt.js as part of version control
 * 
 * Library:     Library.js
 *************************************************************************************/


/**
 * where the deposit is not cash or cheque set the deposit to be the same as the order total
 * 
 */

function fieldChanged(type, name)
{
	var paymentmethod = '';
	var ordertotal = 0;

	try
	{
		paymentmethod = nlapiGetFieldText('paymentmethod');

		if (paymentmethod == 'Cheque' || paymentmethod == 'Cash')
		{
			//nlapiSetFieldValue('payment','', false, false);	
		}
		else
		{
			ordertotal = nlapiGetFieldValue('custbody_mrf_cdep_sototal');
			nlapiSetFieldValue('payment', ordertotal, false, false);
		}

	}
	catch(e)
	{
		errorHandler('fieldChanged', e);
	}

	return true;
}


/**
 * on Save Event - auto set the brand for the deposit
 * 
 */

function onSave()
{
	var orderbrand = 0;

	try
	{
		orderbrand = nlapiGetFieldValue('custbody_mrf_cdep_brand');
		nlapiSetFieldValue('department', orderbrand, false, false);
	}
	catch(e)
	{
		errorHandler('onSave', e);
	}
	return true;
}
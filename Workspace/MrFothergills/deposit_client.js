/**********************************************************************************************************
 * Name:        Deposit Client (depositclient.js)
 * Script Type: Client
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 12 Apr 2013 - first release - DB
 * 				1.1.0 - 23/07/13 - Added pageInit function to match payment processing against brand - JA
 * 
 * Author:      FHL
 * Purpose:     checks that cheque batch field has been completed on save if payment type is cheque
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var chequePaymentMethod = '2';
var chequeBatch = '';
var paymentType = '';
var brandValue = '';

pageInit();

/**
 * @returns {Boolean}
 */
function paymentMethodCheck()
{
	var retVal = false;

	try
	{
		paymentType = nlapiGetFieldValue('paymentmethod');

		if (paymentType == chequePaymentMethod)
		{
			chequeBatch = nlapiGetFieldValue('custbody_mrf_tran_chequebatch');

			if (chequeBatch == null || chequeBatch == '')
			{
				alert('Error:\n\nYou must enter a cheque batch number.');
				retVal = false;
			} //if
			else
			{
				retVal = true;
			}
		} //if
		else
		{
			retVal = true;
		} //else		
	} //try
	catch(e)
	{
		alert('paymentMethodCheck '+ e.message);
	} //catch

	return retVal;
}


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function clientFieldChanged(type, name, linenum)
{
	
	if(name == 'customer')
	{
		setBrandOnPayment();
	}
}

/**
 * setBrandOnPayment
 * 
 */
function setBrandOnPayment()
{
	var customerBrand = 0;

	try
	{
		entity = nlapiGetFieldValue('customer');
		customerBrand = nlapiLookupField('customer', entity, 'custentity_mrf_cust_brand');

		if ( customerBrand == '1')
		{
			nlapiSetFieldValue('department',1); //Set the Department (Brand) to Mr Fothergill's
		}
		if ( customerBrand == '2')
		{
			nlapiSetFieldValue('department',2); //Set the Department (Brand) to D T Brown
		}
		if ( customerBrand == '3')
		{
			nlapiSetFieldValue('department',3); //Set the Department (Brand) to Woolmans
		}
		if ( customerBrand == '4')
		{
			nlapiSetFieldValue('department',4); //Set the Department (Brand) to Johnsons
		}
		nlapiDisableField('department', true);
	} //try
	catch(e)
	{
		alert('clientFieldChanged '+ e.message);
	} //catch
}

function pageInit ()
{
	try
	{
		brandValue = nlapiGetFieldValue('custbody_mrf_cdep_brand');
		if (brandValue == 1)
		{
			nlapiSetFieldValue('creditcardprocessor', 2);
		}
		if (brandValue == 2)
		{
			nlapiSetFieldValue('creditcardprocessor', 4);
		}
		if (brandValue == 3)
		{
			nlapiSetFieldValue('creditcardprocessor', 6);
		}
		if (brandValue == 4)
		{
			nlapiSetFieldValue('creditcardprocessor', 8);
		}
	} 
	catch(e)
	{
		alert('pageInit'+ e.message);
	}
}


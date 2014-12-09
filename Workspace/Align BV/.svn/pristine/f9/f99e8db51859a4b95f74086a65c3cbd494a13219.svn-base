/*************************************************************************************************************************
 * Name: 		
 * Script Type: 
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 22/08/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		vendor_bill.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=3223&c=3524453&h=1cde5b81acc4ef7fd9db&_xt=.js
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @returns {Boolean}
 */
function valid()
{
	var A = nlapiGetCurrentLineItemValue('expense', 'account');
	var CostCenter = String(nlapiGetCurrentLineItemText('expense', 'department')).length;
	var text = nlapiGetCurrentLineItemText('expense', 'account');
	var startsWith = text.charAt(0);

	if (String(A).length > 0)
	{
		var record = nlapiLoadRecord('account', A);
		var B = record.getFieldValue('custrecord_posting');

		if (B == 'F') 
		{
			alert('This is non-posting account!');
		}

		else if ((startsWith == '6' && CostCenter == 0) || (startsWith == '7' && CostCenter == 0) || (startsWith == '8' && CostCenter == 0))
		{
			alert('Cost Center needs to be entered');
		}
		else
		{
			return true;
		}
	}
	else
	{
		return true;
	}
}

/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function duedate(type,name)
{
	if (name == 'custbody_bill_date' || name == 'terms' && nlapiGetFieldValue('custbody_bill_date') != "")
	{
		try 
		{
			var billdate = nlapiGetFieldValue('custbody_bill_date');
			var newdate = billdate.split('/');
			var A = nlapiGetFieldValue('terms');
			var terms = nlapiLookupField('term',A,'daysuntilnetdue');
			var num = new Number(terms);

			var duedate = new Date(newdate[2] + '/' + newdate[1] + '/' + (newdate[0]));

			duedate.setDate(duedate.getDate() + num); 

			var dd = duedate.getDate();
			var mm = duedate.getMonth() + 1;
			var y = duedate.getFullYear();

			var display = dd + '/'+ mm + '/'+ y;

			nlapiSetFieldValue('duedate', display);
			return true;
		}//try
		catch (e)
		{
			//TODO
		}//catch
	}//if
	return true;
}//function

/**
 * 
 */
function postSource()
{
	var description = nlapiGetFieldValue('memo');
	nlapiSetCurrentLineItemValue('expense', 'memo', description);
}
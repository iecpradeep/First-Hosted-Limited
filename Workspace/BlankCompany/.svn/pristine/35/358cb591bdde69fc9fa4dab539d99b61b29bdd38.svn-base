
function recalcSave()
{
	returnBool = true;
	
	var processTax = nlapiGetFieldValue('custpage_processtax') == 'T';
	
	//alert(processTax)
	var messageStr = '';
	if(processTax)
	{
		messageStr += 'By clicking OK, tax and super will recalculate based on the paydetails entered on the payslip.';
	}
	else
	{
		messageStr += 'By clicking OK, Super will recalculate based on paydetails entered on the payslip.  Tax will NOT recalculate and will stay as entered on the payslip.';
	}
	
	returnBool = confirm(messageStr);
	return returnBool;
}


function payFieldChanged(type, fieldname, linenum)
{
	if (fieldname == '#')
	{
		
	}
}


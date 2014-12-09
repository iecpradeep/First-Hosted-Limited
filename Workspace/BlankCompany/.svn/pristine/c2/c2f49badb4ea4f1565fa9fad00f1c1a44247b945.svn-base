
function postFieldChanged(type, fieldname, linenum)
{
	
	if (fieldname == 'custpage_pay_run_id')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_sort_field')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
}

function postSave()
{
	returnBool = true;
	
	returnBool = confirm('Are you sure you want to post this payrun, after posting each payslip will be locked and changes will need to be done by an adjustment run.  \n\nOnce the pay run has completed you will be notified via email.')
	return returnBool;
}

	
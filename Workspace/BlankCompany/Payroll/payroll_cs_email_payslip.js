
function emailFieldChanged(type, fieldname, linenum)
{
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_email_payslipsMarkAll(false);
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


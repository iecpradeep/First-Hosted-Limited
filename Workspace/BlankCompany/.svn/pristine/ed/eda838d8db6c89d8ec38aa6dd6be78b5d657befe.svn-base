
function payFieldChanged(type, fieldname, linenum)
{
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_pay_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T'); 
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
}


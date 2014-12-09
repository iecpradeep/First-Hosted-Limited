
function payFieldChanged(type, fieldname, linenum)
{
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_pay_payrunMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_use_aba')
	{
		custpage_pay_payrunMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
}


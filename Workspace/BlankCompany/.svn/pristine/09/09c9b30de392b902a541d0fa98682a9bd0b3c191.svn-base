
function createPayslipFieldChanged(type, fieldname, linenum)
{
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
}


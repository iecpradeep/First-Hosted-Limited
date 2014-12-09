
function approvalFieldChanged(type, fieldname, linenum)
{
	
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_approve_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_sort_field')
	{
		custpage_approve_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
}

function approvalPageInit(type)
{
	/*var jumpAction = 'redirect'
	var lineItemCount = nlapiGetLineItemCount('custpage_approve_payslips');
	
	//alert(lineItemCount);
	
	for (var line = 1; line <= lineItemCount; line++) 
	{
		var payslipId = nlapiGetLineItemValue('custpage_approve_payslips', 'internalid', line);
		var url = "<a href=/app/site/hosting/scriptlet.nl?script=customscript_pr_sl_jumplet&deploy=customdeploy_pr_sl_jumplet&custparam_jumpaction="+jumpAction+"&custparam_redirectid="+payslipId +">View Payslip</a>";
		nlapiSetLineItemValue('custpage_approve_payslips', 'custpage_paysliplink', line, url);
	}*/
}	
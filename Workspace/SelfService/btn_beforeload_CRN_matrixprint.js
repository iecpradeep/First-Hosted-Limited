function customizeUI_CreditMemoBeforeLoad(type,form)
{
	if (nlapiGetRecordId()) 
	{
		var onclickScript = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=CRN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custpage_matrixprintbtn', 'Print Credit Memo', onclickScript);
	}
}

function customizeUI_InvoiceBeforeLoad(type,form){

	var onclickScript = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=INV&custparam_soid=" + nlapiGetRecordId() + "');";
	var printBtn = form.addButton('custpage_matrixprintbtn', 'Print Invoice', onclickScript);

}
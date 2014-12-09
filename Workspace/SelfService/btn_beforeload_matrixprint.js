function customizeUI_SalesOrderBeforeLoad(type,form){

	var onclickScript = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=ORD&custparam_soid=" + nlapiGetRecordId() + "');";
	var printBtn = form.addButton('custpage_matrixprintbtn', 'Print Order', onclickScript);
	
	var onclickScript2 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
	var printBtn = form.addButton('custpage_matrixprintbtn', 'Print Picking Note', onclickScript2);

}

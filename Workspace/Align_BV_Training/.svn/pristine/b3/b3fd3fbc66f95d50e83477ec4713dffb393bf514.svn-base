function beforeLoadAddButton_1(type, form, request){
	
    
	if (type == 'view') {
    	//Get the button before relabeling or disabling
    	var payButton = form.getButton('acceptpayment');
		payButton.setDisabled(true);
		form.addButton('custpage_showAlign', 'Show Align Details', "window.open('http://www.aligntech.com/Pages/Contact.aspx','_blank')");
	} else if (type == 'create') {
		form.addButton('custpage_showCustomers', 'Show Existing Customers', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_customersearch1', 'customdeploy_customersearch1') + "','_blank')");		
	} else {
    	//Get the button before relabeling or disabling
    	var saveButton = form.getButton('submitter');
		saveButton.setLabel('Update Customer');		
	}
}


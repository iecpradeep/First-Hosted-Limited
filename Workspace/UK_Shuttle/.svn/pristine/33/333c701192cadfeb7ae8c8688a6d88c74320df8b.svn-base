function redirect(type,form)
{
	var theContext = nlapiGetContext();
    var user = theContext.getUser();
    var role = theContext.getRole();
    var mainMenu = false;

    var custRecord = nlapiLoadRecord('customer', user);
	if (custRecord.getFieldValue('custentity_use_login_menu') == 'T')
		mainMenu = true;

	//if (isCustomerCenter() && mainMenu)
	if (mainMenu)
	{
		nlapiSetRedirectURL('SUITELET', 'customscript_customercenter_login', 'customdeploy_customercenter_login');
	}
	else
	{
		nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
	}
	
}
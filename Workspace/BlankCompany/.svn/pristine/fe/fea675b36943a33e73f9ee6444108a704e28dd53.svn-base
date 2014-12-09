function prFieldChanged(type, name, linenum){
	switch (name) {
		case "custpage_employee":
			
			// the employee can only change on a create in which case we redirect elsewhere
			document.location = nlapiResolveURL("SUITELET", "customscript_lm_sl_ess", "customdeploy_lm_sl_ess") + '&custparam_empid=' + nlapiGetFieldValue(name);
			
			break;
	}
}
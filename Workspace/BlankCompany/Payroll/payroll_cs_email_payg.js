
function emailFieldChanged(type, fieldname, linenum)
{
    var summaryId = nlapiGetFieldValue('custpage_summaryid');
    //var taxYear = nlapiGetFieldValue('custpage_tax_year');

	if (fieldname == 'custpage_summaryid')
	{
        custpage_email_paygMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}

    if (fieldname == 'custpage_tax_year' && isNullOrEmpty(summaryId))
    {
        custpage_email_paygMarkAll(false);
        nlapiSetFieldValue('custpage_refresh', 'T');
        setWindowChanged(window, false);
        document.main_form.submit();
    }
	

}



function updateFieldChanged(type, fieldname, linenum)
{
    var stage = nlapiGetFieldValue('custpage_stage');
    //alert(stage);
	if (fieldname == 'custpage_pay_period')
	{
        if(stage != 'externaleave')
        {
            custpage_update_employeesMarkAll(false);
            nlapiSetFieldValue('custpage_refresh', 'T');
            setWindowChanged(window, false);
            document.main_form.submit();
        }

	}
	
	if (fieldname == 'custpage_subsidiary')
	{
		custpage_update_employeesMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		nlapiSetFieldValue('custpage_pay_run_id', '');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_stage')
	{
		var review = nlapiGetFieldValue('custpage_review') == 'T';
		if (!review)
		{
			custpage_update_employeesMarkAll(false);
			nlapiSetFieldValue('custpage_refresh', 'T');
			setWindowChanged(window, false);	
			document.main_form.submit();
		}
		
	}
	
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_update_employeesMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if(fieldname == 'custpage_startdate')
	{
		setDates();
	}
	if (fieldname == 'custpage_pay_period' && !payroll.useSubsidiary)
	{
		setDates();
        if(stage != 'externaleave')
        {
            custpage_update_employeesMarkAll(false);
            nlapiSetFieldValue('custpage_refresh', 'T');
            setWindowChanged(window, false);
            document.main_form.submit();
        }

	}
	
	if(payroll.useSubsidiary) 
	{
		if(fieldname == 'custpage_subsidiary' || fieldname == 'custpage_pay_period')
		{
			var subsidiaryId = nlapiGetFieldValue('custpage_subsidiary');
			var frequency = nlapiGetFieldValue('custpage_pay_period');
			if (!isNullOrEmpty(subsidiaryId))
			{
				if(fieldname == 'custpage_subsidiary')
				{
					nlapiSetFieldValue('custpage_pay_period', '',false);
					nlapiSetFieldValue('custpage_startdate', '',false);
					nlapiSetFieldValue('custpage_enddate', '',false);
					//alert('yo');
					nlapiSetFieldValue('custpage_sort_field', '',false);
					nlapiSetFieldValue('custpage_country', '',false);
				}
				if (fieldname == 'custpage_pay_period')
				{
					setDates();
				}
                if(stage != 'externaleave')
                {
                    custpage_update_employeesMarkAll(false);
                    nlapiSetFieldValue('custpage_refresh', 'T');
                    setWindowChanged(window, false);
                    document.main_form.submit();
                }


			}
		}
	}
	
}

function updatePageInit(type)
{
	var subsidiaryId = nlapiGetFieldValue("custpage_subsidiary");
	
	initPayroll(subsidiaryId);	
}

function updateSave()
{
	var stage = nlapiGetFieldValue('custpage_stage');
	var returnBool = true;
	if (stage == 'accrueleave')
	{
		nlapiSetFieldValue('custpage_show_variance',"F");
		returnBool = confirm('Do you want to update the employee records selected.  By clicking OK a leave history record will be created to adjust any difference and associated to the payrun selected in this window,')
		
	}
	return returnBool;
}

function fixAccrual()
{
	nlapiSetFieldValue('custpage_stage', 'accrueleave');
	nlapiSetFieldValue('custpage_show_variance',"F");
	returnBool = confirm('Do you want to update the employee records selected.  By clicking OK a leave history record will be created to adjust any difference and associated to the payrun selected in this window,')
	if (returnBool)
	{
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
}

function back()
{
	custpage_update_employeesMarkAll(false);
	nlapiSetFieldValue('custpage_refresh', 'T');
	nlapiSetFieldValue('custpage_stage', 'reviewaccrual');
	setWindowChanged(window, false);	
	document.main_form.submit();
}

function setDates()
{
	var payPeriod = nlapiGetFieldValue('custpage_pay_period');
	var payPeriodName = nlapiGetFieldText('custpage_pay_period');
	var fromDate = nlapiStringToDate(nlapiGetFieldValue('custpage_startdate'));
	var endDate = "";
	
	if (!isNullOrEmpty(fromDate && !isNullOrEmpty(payPeriod)))
	{
		switch (payPeriod)
		{
			case PAYMONTHLY :
			endDate = nlapiAddDays(nlapiAddMonths(fromDate,'1'), '-1');
			
			break;
			case PAYWEEKLY :
			endDate = nlapiAddDays(fromDate, '6');
			
			break;
			case PAYBIWEEKLY :
			endDate = nlapiAddDays(fromDate, '13');
			break;
			
			case PAYFOURWEEKLY : 
			endDate = nlapiAddDays(fromDate, '27');
			break;
			
		}
		// search for duplicate payruns
		
		var fromDateStr = nlapiDateToString(fromDate);
		var toDateStr = nlapiDateToString(endDate);
		nlapiSetFieldValue('custpage_enddate',toDateStr,false);
	}
}

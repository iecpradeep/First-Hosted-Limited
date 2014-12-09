
function refreshpage()
{
	custpage_create_payslipsMarkAll(false);
	nlapiSetFieldValue('custpage_refresh', 'T');
	setWindowChanged(window, false);		
	document.main_form.submit();
}

function popSelectWindow(empId,lineNo)
{
	//alert('lineNo: ' + lineNo);
	var urlStr = nlapiResolveURL("SUITELET", "customscript_pr_sl_popup", "customdeploy_pr_sl_popup") + "&custparam_jumpaction=selectpayslip&custparam_empid=" + empId + "&custparam_requestid=" + 2;
 	var mywin = nlOpenWindow(urlStr,"changenextwind",400,300);
	mywin.focus();
}

function payRunFieldChanged(type, fieldname, linenum)
{
	if(fieldname == 'custpage_fromdate')
	{
		setPayRunDates();
	}
	if (fieldname == 'custpage_pay_period' && !payroll.useSubsidiary)
	{
		//setPayRunDates();
        nlapiSetFieldValue('custpage_fromdate', '',false);
        nlapiSetFieldValue('custpage_todate', '',false);
        nlapiSetFieldValue('custpage_pay_date', '',false);
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);		
		document.main_form.submit();
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
					nlapiSetFieldValue('custpage_fromdate', '',false);
					nlapiSetFieldValue('custpage_todate', '',false);
					nlapiSetFieldValue('custpage_pay_date', '',false);
					//alert('yo');
					nlapiSetFieldValue('custpage_sort_field', '',false);
					nlapiSetFieldValue('custpage_country', '',false);
				}
				if (fieldname == 'custpage_pay_period')
				{
					//setPayRunDates();
                    nlapiSetFieldValue('custpage_fromdate', '',false);
                    nlapiSetFieldValue('custpage_todate', '',false);
                    nlapiSetFieldValue('custpage_pay_date', '',false);
				}
				custpage_create_payslipsMarkAll(false);
				nlapiSetFieldValue('custpage_refresh', 'T');
				setWindowChanged(window, false);		
				document.main_form.submit();
			}
		}
	}
	
	if (fieldname == 'custpage_autopay' || fieldname == 'custpage_country' || fieldname == 'custpage_use_aba' ||fieldname == 'custpage_sort_field' )
	{
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	/*if (fieldname == 'custpage_autopay') 
	{
		var autoPayBool = nlapiGetFieldValue('custpage_autopay') == 'T';
		
		if(autoPayBool)
		{
			alert(autoPayBool + ' nlapiSetFieldDisplay - true');
			nlapiSetFieldDisplay("custpage_autopay_start_stage",true)
			nlapiSetFieldDisplay("custpage_autopay_start_stage",true)
			nlapiSetFieldDisplay("custpage_pay_period",false)
		}
	}*/
	
	
	if (fieldname == 'custpage_use_period_data')
	{
		var usePeriodDataBool = nlapiGetFieldValue('custpage_use_period_data') == 'T'
		var accrueLeaveBool = nlapiGetFieldValue('custpage_accrueleave') == 'T'
		if (usePeriodDataBool && accrueLeaveBool)
		{
			var unsetAccrue = confirm('Click OK to unset the accrue leave option if leave has already been accrued on a previous payrun and CANCEL to leave it checked')
			if(unsetAccrue)
			{
				nlapiSetFieldValue('custpage_accrueleave', 'F');
			}
		}
		
	}
	
	if (fieldname == 'custpage_autopay_stage')
	{
		var endStage = nlapiGetFieldValue('custpage_autopay_stage');
		
		//alert(endStage);
		if (endStage == 3 || endStage == 8)
		{
			custpage_create_payslipsMarkAll(false);
			nlapiSetFieldValue('custpage_refresh', 'T');
			setWindowChanged(window, false);	
			document.main_form.submit();
		}
		
	}
	if (fieldname == 'custpage_payrun_type') 
	{
		var payRunType = nlapiGetFieldValue('custpage_payrun_type');
		
		if (payRunType != PAYRUN_TYPE_STANDARD)
		{
			nlapiDisableField('custpage_accrueleave',false);
			nlapiDisableField('custpage_use_period_data',false);
			nlapiDisableField('custpage_skip_components',false);
		}
		else if (payRunType == PAYRUN_TYPE_STANDARD)
		{
			nlapiSetFieldValue('custpage_accrueleave', 'T');
			nlapiDisableField('custpage_accrueleave',true);
			nlapiSetFieldValue('custpage_use_period_data', 'F');
			nlapiDisableField('custpage_use_period_data',true);
			nlapiSetFieldValue('custpage_skip_components', 'F');
			nlapiDisableField('custpage_skip_components',true);
		}
		
		/*if (payRunType == PAYRUN_TYPE_ADJUSTMENT)
		{
			custpage_create_payslipsMarkAll(false);
			nlapiSetFieldValue('custpage_refresh', 'T');
			setWindowChanged(window, false);	
			document.main_form.submit();
		}*/
	}
	
	
	
}

function setPayRunDates()
{
	var payDate = nlapiGetFieldValue('custpage_pay_date');
	var payPeriod = nlapiGetFieldValue('custpage_pay_period');
	var payPeriodName = nlapiGetFieldText('custpage_pay_period');
	var payRunType = nlapiGetFieldValue('custpage_payrun_type');
	var payRunTypeName = nlapiGetFieldText('custpage_payrun_type');
	var fromDate = nlapiStringToDate(nlapiGetFieldValue('custpage_fromdate'));
	
	if (!isNullOrEmpty(fromDate && !isNullOrEmpty(payPeriod)))
	{
		switch (payPeriod)
		{
			case PAYMONTHLY :
			endDate = nlapiAddDays(nlapiAddMonths(fromDate,'1'), '-1');

                break;

            case PAYSEMIMONTHLY :

                if(parseInt(fromDate.getDate()) > 15)
                {
                    endDate = nlapiAddDays(nlapiAddMonths(new Date(fromDate.getFullYear(),fromDate.getMonth(),1),1),-1);
                }
                else
                {
                    endDate = nlapiAddDays(fromDate, '14')
                }
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
			
		if (payRunType == PAYRUN_TYPE_STANDARD) 
		{
			
			var filters = new Array();
			if (!isNullOrEmpty(payRunType)) 
			{
				filters.push(new nlobjSearchFilter('custrecord_pr_pr_type', null, 'anyof', payRunType));
			}
			if (!isNullOrEmpty(payPeriod)) 
			{
				filters.push(new nlobjSearchFilter('custrecord_pr_pr_pay_period', null, 'anyof', payPeriod));
			}
			if (!isNullOrEmpty(fromDateStr) && !isNullOrEmpty(toDateStr)) 
			{
				filters.push(new nlobjSearchFilter('custrecord_pr_pr_from_date', null, 'within', fromDateStr, toDateStr));
			}
			
			if (payroll.useSubsidiary) 
			{
				var subsidiaryId = nlapiGetFieldValue('custpage_subsidiary');
				//alert('subId: ' + subsidiaryId)
				if (!isNullOrEmpty(subsidiaryId))
				{
					//alert('filterset');
					filters.push(new nlobjSearchFilter('custrecord_subsidiary_id', null, 'equalto', subsidiaryId));
				}
			}
			
			var columns = new Array();
			columns.push(new nlobjSearchColumn('name'));
			
			var openPayRuns = nlapiSearchRecord('customrecord_pr_pay_run', null, filters, columns);
			
			if (openPayRuns != null) 
			{
				payRunId = openPayRuns[0].getId();
				payRunName = openPayRuns[0].getValue('name');
				if (!confirm('A payrun already exists for the period of ' + fromDateStr + ' to ' + toDateStr + '  click CANCEL to redirect to this record:\n\t- ' + payRunName + " otherwise click OK to continue with this payrun.", false)) 
				{
					// redirect to the pay slip.
					var urlStr = nlapiResolveURL("RECORD", "customrecord_pr_pay_run", payRunId, false);
					setWindowChanged(window, false);	
					document.location = urlStr;
				}
			}
			
		}
		nlapiSetFieldValue('custpage_todate',toDateStr,false);
		nlapiSetFieldValue('custpage_pay_date',toDateStr,false);
	}
}

function payRunPageInit()
{
	var subsidiaryId = nlapiGetFieldValue("custpage_subsidiary");
	
	initPayroll(subsidiaryId);	
	
	//alert('payroll object loaded')
	
	var fromDate = nlapiGetFieldValue("custpage_fromdate");
	var payPeriod = nlapiGetFieldValue("custpage_pay_period");
	var runType = nlapiGetFieldValue("custpage_payrun_type");

	if(!isNullOrEmpty(payPeriod) && !isNullOrEmpty(runType) && isNullOrEmpty(fromDate))
	{
		// lets find the most recent pay run of this type and set
		setNextRunDateFromLast(payPeriod,runType,subsidiaryId);		
	}
	
	if (runType != PAYRUN_TYPE_STANDARD)
	{
		nlapiDisableField('custpage_accrueleave',false);
	}
}


function payRunOnSave()
{
	var payDate = nlapiGetFieldValue('custpage_pay_date');
	var payPeriod = nlapiGetFieldValue('custpage_pay_period');
	var payRunType = nlapiGetFieldValue('custpage_payrun_type');
	var fromDateStr = nlapiGetFieldValue('custpage_fromdate');
	var toDateStr = nlapiGetFieldValue('custpage_todate');
	var payRollConfigured = nlapiGetFieldValue('custpage_configured');
	var employeeLineCount = nlapiGetLineItemCount("custpage_create_payslips");
    var payrollCountry = nlapiGetFieldValue('custpage_country');
    var addPayslips = nlapiGetFieldValue('custpage_add_payslip') == 'T';
    var autopay = nlapiGetFieldValue('custpage_autopay');
    var addPaySlipThreshold = 5;

    var returnValue = true;
	
	if(payRollConfigured == 'F')
	{
		alert("You cannot run the payrun until payroll has been configured, please click the link in the alert at the top of the page.");	
		return(false);
	}

	// search for duplicate payruns for standard
	
	if (payRunType == PAYRUN_TYPE_STANDARD)
	{
		var filters = new Array();
		if (!isNullOrEmpty(payRunType))
		{
			filters.push(new nlobjSearchFilter('custrecord_pr_pr_type', null, 'anyof', payRunType));
		}
		if (!isNullOrEmpty(payPeriod))
		{
			filters.push(new nlobjSearchFilter('custrecord_pr_pr_pay_period', null, 'anyof', payPeriod));
		}
		if (!isNullOrEmpty(fromDateStr) && !isNullOrEmpty(toDateStr))
		{
			filters.push(new nlobjSearchFilter('custrecord_pr_pr_from_date', null, 'within', fromDateStr,toDateStr));
		}
		
		if (payroll.useSubsidiary) 
		{
			var subsidiaryId = nlapiGetFieldValue('custpage_subsidiary');
			if (!isNullOrEmpty(subsidiaryId))
			{
				filters.push(new nlobjSearchFilter('custrecord_subsidiary_id', null, 'equalto', subsidiaryId));
			}
		}
		
		var columns = new Array()
		columns.push(new nlobjSearchColumn('name'));
		
		var openPayRuns = nlapiSearchRecord('customrecord_pr_pay_run',null,filters,columns); 
		
		if (openPayRuns!=null && !addPayslips)
		{
			payRunId = openPayRuns[0].getValue('name');
			var returnValue = confirm('There is already a payrun of that type during the period of ' + fromDateStr + ' to ' + toDateStr + ' name is: \n\t-' + payRunId + ' if you wish to continue anyway click OK otherwise click CANCEL') ;
			return returnValue;
		}
	}
	
	
	
	// super fund validation to ensure a super fund is set before processing.


	var missingSuperFundArr = [];
	var missingPayComponents = [];
	var missingTaxScale = [];
	var employeeIdsArr = [];
	var unselectLineArr = [];
	var selectedTotalInt = 0;
	
	var payRollCountry = nlapiGetFieldValue('custpage_country');
	
	for(var i=1; i <= employeeLineCount; i++)
	{
		var employeeId = nlapiGetLineItemValue("custpage_create_payslips","internalid",i);
		var empString = nlapiGetLineItemValue("custpage_create_payslips","entityid",i) + " " + nlapiGetLineItemValue("custpage_create_payslips","firstname",i) + " " + nlapiGetLineItemValue("custpage_create_payslips","lastname",i);
		var superFundId = nlapiGetLineItemValue("custpage_create_payslips","custentity_current_fund",i);
		var taxScale = nlapiGetLineItemValue("custpage_create_payslips","custentity_employee_tax_scale",i);
		
		var selectedBool = (nlapiGetLineItemValue("custpage_create_payslips","checked",i) == "T");
		
		
		selectedTotalInt += (selectedBool) ? 1 : 0;

		if(selectedBool)
		{
			if ((payRollCountry != PAYROLL_COUNTRY_LIBERIA && payRollCountry != PAYROLL_COUNTRY_UK) && (isNullOrEmpty(superFundId) || isNullOrEmpty(taxScale)))
			{	
				if (isNullOrEmpty(superFundId))
				{
					missingSuperFundArr.push(empString);
				}
				
				if (isNullOrEmpty(taxScale))
				{
					missingTaxScale.push(empString);
					unselectLineArr.push(i)
				}
				
			}
			employeeIdsArr.push(employeeId);
			// build array of employees to check for a salary/wages componenent.	
		}
		
		
	}
	
	if(selectedTotalInt == 0)
	{
		alert("Please select one or more employees before proceeding.");
		return(false);
	}
    else if(addPayslips)
    {
        if(selectedTotalInt > addPaySlipThreshold)
        {
            alert("Payslips cannot be added as you are adding more than the number allowed of " + addPaySlipThreshold + ". You can submit them in batches if you need to add more than: " + addPaySlipThreshold);
            return(false);
        }

        if(autopay == 'T')
        {
            alert("Adding payslips manually is not supported when payrun is set to Autopay, you will need to use an adjustmet run to process these employees");
            return(false);
        }

    }

	
	if(missingTaxScale.length > 0)
	{
		alert("The following employee(s) do not have a tax scale configured, you cannot process an employees pay without a tax scale and these will be unselected.  To include them in the payrun edit the employee, update their payscale and refresh this page before proceeding:\n\n\t - " + missingTaxScale.join("\n\t - "));
		
		for (var x = 0; x < unselectLineArr.length; x++) 
		{
			nlapiSetLineItemValue("custpage_create_payslips","checked",unselectLineArr[x],'F');
		}
		
			
		return false;
	}

	if(payrollCountry == PAYROLL_COUNTRY_AU && missingSuperFundArr.length > 0)
	{
		var returnValue = confirm("The following employee(s) do not have a super fund configured, click ok to continue or cancel to edit the employee record to setup a super fund:\n\n\t - " + missingSuperFundArr.join("\n\t - "));	
		//return(returnValue);
	}
	
	
	
	// check selected employee ids for a match with search that has employees with salary components and alert those that do not match.
	var empFilters = [new nlobjSearchFilter('internalid', null, 'anyof', employeeIdsArr),new nlobjSearchFilter('custrecord_pr_pc_category', 'custrecord_pr_pc_employee', 'anyof', PAY_COMPONENT_TYPE_SALARY_WAGES)];
	var columns = new Array();
	columns.push(new nlobjSearchColumn('internalid',null,'group'));
	var empWithSalarySearch = nlapiSearchRecord('employee',null,empFilters,columns);
	var empIdAssocArr = {};
	var compareEmpIdArr = {};
	for(var x=0; x < employeeIdsArr.length; x++)
	{
		empIdAssocArr[employeeIdsArr[x]] = employeeIdsArr[x];
	}
	
	if (empWithSalarySearch == null)
	{
		for (id in empIdAssocArr)
		{
			var empId = empIdAssocArr[id];
			//alert('empId: ' + empId);
			var empArr = nlapiLookupField("employee",empId,["entityid","firstname","lastname"]);
			missingPayComponents.push(empArr['entityid'] + " " + empArr['firstname'] + " " + empArr['lastname']);
		}
		
	}
	else
	{
		for(var y=0; y < empWithSalarySearch.length; y++)
		{
			var empId = empWithSalarySearch[y].getValue('internalid',null,'group');
			if (!isNullOrEmpty(empId))
			{
				compareEmpIdArr[empId] = empId
			}
		}
		
		for (id in empIdAssocArr) 
		{
			matchId = compareEmpIdArr[id];
			if (isNullOrEmpty(matchId))
			{
				var empArr = nlapiLookupField("employee",id,["entityid","firstname","lastname"]);
				missingPayComponents.push(empArr['entityid'] + " " + empArr['firstname'] + " " + empArr['lastname']);
			}		
		}
		
	}
	
	if(missingPayComponents.length > 0)
	{
		var returnValue = confirm("The following employee(s) do not have a salary or wage component configured, click ok to continue or cancel to edit the employee record to add one or exclude them from the pay run: \n\n\t - " + missingPayComponents.join("\n\t - "));	
		//return(returnValue);
	}	

	// check employee total and get the employee count
	var maxEmployeeInt = parseInt(nlapiGetFieldValue("custpage_employeelimit"));
	
	if(maxEmployeeInt > 0)
	{
		var todate = nlapiGetFieldValue("custpage_todate");
		if (!isNullOrEmpty(todate))
		{
			var employeeIdArr = getPayMonthEmployeeCount(todate);
			var employeeDictArr = {};
			
			for(var i=0; i < employeeIdArr.length; i++)
			{
				employeeDictArr[employeeIdArr[i]] = "1";
			}
			
		
			for(var i=1; i <= employeeLineCount; i++)
			{
				var employeeId = nlapiGetLineItemValue("custpage_create_payslips","internalid",i);
				var selectedBool = (nlapiGetLineItemValue("custpage_create_payslips","checked",i) == "T");
				
				if(selectedBool && isNullOrEmpty(employeeDictArr[employeeId]))
				{
					employeeIdArr.push(employeeId);
				}	
			}
			
			if(employeeIdArr.length > maxEmployeeInt)
			{
				alert("You are restricted to a maximum of " + maxEmployeeInt + " unique employees per calendar month. You cannot start this pay run as the additional employees will exceed the maximum allowed (" + employeeIdArr.length + ").");
				return(false);	
			}	
		}
			
	}
	
	return(returnValue);	
}



/* function queries the last pay run of this type and frequency to set the from date.
 * 
 */
function setNextRunDateFromLast(payPeriod,runType,subsidiaryId)
{
	var filtersArr = [new nlobjSearchFilter("custrecord_pr_pr_type",null,"anyof",runType), new nlobjSearchFilter("custrecord_pr_pr_pay_period",null,"anyof",payPeriod)];
	if(!isNullOrEmpty(subsidiaryId))
	{
		filtersArr.push(new nlobjSearchFilter("custrecord_subsidiary_id",null,"equalto",subsidiaryId));
	}
	
	var columnsArr = [new nlobjSearchColumn("custrecord_pr_pr_end_date",null,"max")];
	var searchResults = nlapiSearchRecord("customrecord_pr_pay_run",null,filtersArr,columnsArr);	

	if(!isNullOrEmpty(searchResults) && searchResults.length > 0)
	{
		var lastEndDateStr = searchResults[0].getValue("custrecord_pr_pr_end_date",null,"max");
		
		if(!isNullOrEmpty(lastEndDateStr))
		{
			var nextFromDateStr = nlapiDateToString(nlapiAddDays(nlapiStringToDate(lastEndDateStr),1));
			var fromDateObj = nlapiStringToDate(nextFromDateStr);
			var endDate = '';
			
			switch (payPeriod)
			{
				case PAYMONTHLY :
				endDate = nlapiAddDays(nlapiAddMonths(fromDateObj,'1'), '-1');

                    break;

                case PAYSEMIMONTHLY :

                    if(parseInt(fromDateObj.getDate()) > 15)
                    {
                        endDate = nlapiAddDays(nlapiAddMonths(new Date(fromDateObj.getFullYear(),fromDateObj.getMonth(),1),1),-1);
                    }
                    else
                    {
                        endDate = nlapiAddDays(fromDateObj, '14')
                    }
                    break;

                case PAYWEEKLY :
				endDate = nlapiAddDays(fromDateObj, '6');
				
				break;
				
				case PAYBIWEEKLY :
				endDate = nlapiAddDays(fromDateObj, '13');
				break;
				
				case PAYFOURWEEKLY : 
				endDate = nlapiAddDays(fromDateObj, '27');
				break;
				
			}
			
			nlapiSetFieldValue("custpage_fromdate",nextFromDateStr,false);
			if (!isNullOrEmpty(endDate))
			{
				var toDateStr = nlapiDateToString(endDate);
				nlapiSetFieldValue('custpage_todate',toDateStr,false);
				nlapiSetFieldValue('custpage_pay_date',toDateStr,false);
			}
		}
		
	}
}

function prRecalc()
{
	var countInt = nlapiGetLineItemCount("custpage_create_payslips");
    var totalAmt = 0.00;
	var totalCnt = 0;
    
    for(var i=1; i <= countInt; i++)
    {
        if(nlapiGetLineItemValue("custpage_create_payslips","checked",i) == "T")
        {
            totalCnt++;
        }
    }
    
    nlapiSetFieldValue("custpage_line_count",totalCnt);
}

function getPayMonthEmployeeCount(payDateStr)
{
	var periodDate = nlapiStringToDate(payDateStr);
	var calendarStartDate = new Date(periodDate.getFullYear(),periodDate.getMonth(),"1");
	var calendarEndDate = nlapiAddDays(nlapiAddMonths(new Date(periodDate.getFullYear(),periodDate.getMonth(),"1"),1),-1);
	var startDateStr = nlapiDateToString(calendarStartDate);
	var endDateStr = nlapiDateToString(calendarEndDate);
	var employeeIdArr = [];

	var filtersArr = 
		[
			new nlobjSearchFilter("custrecord_ps_pay_period_end",null,"within",startDateStr,endDateStr)
		];
		
	var columnsArr = [new nlobjSearchColumn("custrecord_ps_employee",null,"group")];
	var searchResults = nlapiSearchRecord("customrecord_pr_payslip",null,filtersArr,columnsArr);
	
	for(var i=0; !isNullOrEmpty(searchResults) && i < searchResults.length; i++)
	{
		employeeIdArr.push(searchResults[i].getValue("custrecord_ps_employee",null,"group"));
	}
	
	return(employeeIdArr);
}


function getSelectedLines()
{
    //alert('yo')
    var lineItemCount = nlapiGetLineItemCount('custpage_create_payslips');
    var linesSelected = 0.00;

    for(var line=1; line<=lineItemCount; line++)
    {
        linesSelected += setFloat(request.getLineItemValue('custpage_create_payslips', 'checked', line) == 'T' ? 1 : 0);
    }

    return linesSelected;
}
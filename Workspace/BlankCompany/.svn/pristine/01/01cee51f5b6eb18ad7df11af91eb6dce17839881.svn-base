var prType = "";
var prIsSubsidiaryBool = "";
var prIsMultiSubsidiaryBool = false;

function prPageInit(type)
{
    // initialise the payroll object.
    var ctxObj = nlapiGetContext();
	var prIsMultiSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");
	var subsidiaryId = (prIsMultiSubsidiaryBool) ? nlapiGetFieldValue('subsidiary') : '';
	prType = type;

	if(nlapiGetFieldValue('custpage_countrydialog') == 'T')
	{
		// pop a window requesting subsidiary be selected
		Ext.onReady(prCountryPop);
	}
	else
	{
        if(!prIsMultiSubsidiaryBool || subsidiaryId != '')
        {
            initPayroll(subsidiaryId);

            if(type == 'create' && payroll.isConfigured && !prIsMultiSubsidiaryBool)
            {
                setPayRollDefaults();
            }
        }
	}
}

function prCountryPop()
{
	var urlStr = nlapiResolveURL("TASKLINK","EDIT_EMPLOYEE") + "?custparam_country=";
	var subHtmlArr = [];

    // get fields and values
    var countryArr = JSON.parse(nlapiGetFieldValue("custpage_availablecountry"));
    countryArr.unshift({id: -1, label: 'None'});

	for(var i=0; i < countryArr.length; i++)
	{
        if(countryArr[i].label != undefined)
        {
            subHtmlArr.push("<li><a href='" + urlStr + countryArr[i].id + "'>" + countryArr[i].label + "</a>");
        }
	}

	var subsidiaryWin = new Ext.Window({
		title			: "Payroll Country Select",
		modal			: true,
		plain			: true,
		frame			: true,
		layout			: "fit",
		padding			: 10,
		width			: 600,
		height			: 400,
		autoHeight		: true,
		closeAction		: 'destroy',
		html			: '<p>Please select the payroll country before proceeding if this employee is not to be configured for payroll select None</p><ul>' + subHtmlArr.join("\n") + '</ul>'
	}).show();
}

function prValidateField(type,name, linenum)
{
	var isValidBool = true;
	
	switch(name)
	{
		case "custentity_pr_pay_leave_loading":

		if(!payrollInitBool)
		{
			alert("Please select a configured subsidiary before setting this field.");	
			isValidBool = false;
		}		
		
		break;
        case "custentity_pr_tax_code":

        isValidBool = nlapiGetFieldValue(name) == '' || isValidUkTaxCode(nlapiGetFieldValue(name));

        if(!isValidBool)
        {
            alert("The HMRC Tax code you have entered is invalid.");
        }

        break;
        case "custentity_pr_ni_number":

        isValidBool = nlapiGetFieldValue(name) == '' || isValidUkNIN(nlapiGetFieldValue(name));

        if(!isValidBool)
        {
            alert("The National Insurance number entered is invalid.");
        }

        break;
	}
	
	return(isValidBool);
}


function prEmployeeFieldChanged(type, name, linenum)
{
	
	var empId = nlapiGetRecordId();
	var payRollCountry = nlapiGetFieldValue('custentity_pr_country');
	
	if (payRollCountry == PAYROLL_COUNTRY_AU)
	{
		switch(name)
		{
			case "custentity_pr_senior_couple_status":
	
			nlapiSetFieldValue("custentity_pr_claim_senior_tax_offset",
			((nlapiGetFieldValue("custentity_pr_senior_couple_status") != "4") ? "T" : "F"),false);
	
			setTaxScale();
	
			break;		
			case "custentity_pr_resident_status":
			case "custentity_pr_claim_tax_free_threshold":
			case "custentity_pr_pay_leave_loading":
			case "custentity_pr_ml_exemption":
			case "custentity_pr_help_sfss_var":
			case "custentity_pr_flood_levy_exempt":
	
			setTaxScale();
			
			if (name == 'custentity_pr_pay_leave_loading')
			{
				var leaveLoadingBool = nlapiGetFieldValue('custentity_pr_pay_leave_loading') == 'T';
				if (leaveLoadingBool)
				{
					var leaveLoadingPct = payroll.config["cfg_leaveloadingpercentage"];
					nlapiDisableField('custentity_pr_leave_loading_percentage',false);
					nlapiSetFieldValue('custentity_pr_leave_loading_percentage',leaveLoadingPct);
				}
				else
				{
					nlapiSetFieldValue('custentity_pr_leave_loading_percentage',0.00);
					nlapiDisableField('custentity_pr_leave_loading_percentage',true);
				}
				
			}
			
			break;
			case "custentity_pr_ml_reduction":
	
			if(nlapiGetFieldValue("custentity_pr_ml_reduction") == "T")
			{
				nlapiSetFieldValue("custentity_pr_help_sfss_var",1,true);
			}
			
			break;
		}
	}
	
	switch (name)
	{
	case "supervisor":

		var approverId = nlapiGetFieldValue("custentity_pr_leave_approver");
		var supervisorId = nlapiGetFieldValue("supervisor");

		if(!isNullOrEmpty(supervisorId))
		{
			if(isNullOrEmpty(approverId))
			{
				nlapiSetFieldValue("custentity_pr_leave_approver",supervisorId,false);
			}
			else
			{
				// if the supervisor field is different to the approver field ask the
				if(supervisorId != approverId)
				{
					if(confirm("Would you also like to update the leave approver for this employee from " + nlapiGetFieldText("custentity_pr_leave_approver") + " to " + nlapiGetFieldText("supervisor")))
					{
						nlapiSetFieldValue("custentity_pr_leave_approver",supervisorId,false);
					}
				}
			}
		}

		break;
		case "custentity_pr_tfn":
		
		// validate the tax file number

		var tfnStr = nlapiGetFieldValue("custentity_pr_tfn");
		var countryId = nlapiGetFieldValue("custentity_pr_country");
		
		var isValidTFNBool = isValidTaxFileNumber(tfnStr,countryId);
		
		if(!isValidTFNBool)
		{
			alert("The tax file number " + tfnStr + " is invalid, no tax file number status will be used for tax scale.");
		}
		
		setTaxScale();
		
		break;	
		case "custentity_pay_freq":
	
		if (!isNullOrEmpty(empId))
		{
			alert('You have changed the employee pay frequency, employee pay components will be updated to the new pay period. \n\nIf this employee has bonuses or commissions that are paid on a different frequency to the employee\'s standard pay make sure you check them as they may need to be manually adjusted');
			
			/*var newFrequency = nlapiGetFieldValue('custentity_pay_freq');
			if (confirmBool)
			{
				updateURL = nlapiResolveURL("SUITELET","customscript_pr_sl_jumplet","customdeploy_pr_sl_jumplet") + "&custparam_jumpaction=updatevalues&custparam_updatefield=custentity_pay_freq" 
				+ "&custparam_newvalue=" + newFrequency + "&custparam_requestid=" + empId ;
				setWindowChanged(window, false);	
				document.location = updateURL;
			}*/
		}
		break;
		
		case "custentity_pr_standard_week":
		
		// check is employee is a waged employee to update pay component
		 var payTypeWages = nlapiGetFieldValue('custentity_pay_type') == EMP_PAY_TYPE_WAGES;
		 
		if (payTypeWages && !isNullOrEmpty(empId))
		{
			alert('You have changed the employees standard working week their normal pay component will be updated when you save this record');
			
			/*var newWorkingWeek = nlapiGetFieldValue('custentity_pr_standard_week');
			if (confirmBool)
			{
				updateURL = nlapiResolveURL("SUITELET","customscript_pr_sl_jumplet","customdeploy_pr_sl_jumplet") + "&custparam_jumpaction=updatevalues&custparam_updatefield=custentity_pr_standard_week" 
				+ "&custparam_newvalue=" + newWorkingWeek + "&custparam_requestid=" + empId ;
				setWindowChanged(window, false);	
				document.location = updateURL;
			}*/
		}
		
		break;
		
		case "custentity_employment_status":
		
		if (!isNullOrEmpty(empId)) 
		{
			alert('You have changed the employee employment status, make sure you update other employee fields to reflect this change e.g.leave entitlements');
		}
		
		break;
		
		case "custentity_pay_type":
		
		var payType = nlapiGetFieldValue('custentity_pay_type');
		
		if (!isNullOrEmpty(empId)) 
		{
			if (payType == EMP_PAY_TYPE_SALARY)
			{
				alert('You have changed the employee payment type, make sure you change the pay components to reflect this change. When moving employee from wage to salary you need to change their normal time component and create a salary component');
			}
			else
			{
				alert('You have changed the employee payment type, make sure you change the pay components to reflect this change. When moving employee from salary to wage you need to change their base salary component and create a normal time component');
			}
			
		}
		
		
		break;
		
		case "subsidiary":

		var subsidiaryId = nlapiGetFieldValue("subsidiary");
		
		if (!isNullOrEmpty(subsidiaryId))
		{
			var country = nlapiLookupField('subsidiary', subsidiaryId, 'country');
			updateValue = '';
			if (country == 'AU')
			{
				updateValue = PAYROLL_COUNTRY_AU;
			}
			else if (country == 'NZ')
			{
				updateValue = PAYROLL_COUNTRY_NZ;
			}
			else if (country == 'GB')
			{
				updateValue = PAYROLL_COUNTRY_UK;
			}
			else if (country == 'LR')
			{
				updateValue = PAYROLL_COUNTRY_LIBERIA;
			}
			
			if (!isNullOrEmpty(updateValue))
			{
				nlapiSetFieldValue('custentity_pr_country',updateValue);
			}
			
			initPayroll(subsidiaryId);
			
			if(payroll.isConfigured)
			{
				if(confirm("Do you wish to update the payroll configuration to the subsidiary defaults?"))
				{
					setPayRollDefaults();	
				}
			}
		}
		
		
		break;
		
		case "custentity_pr_country":
		
			
			
			if (payRollCountry == PAYROLL_COUNTRY_NZ)
			{
				//not supported
				/*
				var fieldObj = nlapiGetField('custentity_pr_tfn').setLabel('IRD Number');
				fieldObj.setHelpText('Enter your tax numbers as supplied by the IRD');
				fieldObj = nlapiGetField('custentity_pr_pay_leave_loading').setDisplayType('hidden')*/
				
				/*var submit = confirm('You have changed the payroll country you need to save a relaod the form so the appropriate fields are show.  Click ok to submit')
				if (submit)
				{
					nlapiSetFieldValue('custentity_pr_as_action','T');
					document.getElementById("submitter").click();
				}*/
			}
		
		break;
		
		
		case "custentity_pr_working_week":
		
			var workingWeek = nlapiGetFieldValue('custentity_pr_working_week');
			if (!isNullOrEmpty(workingWeek))
			{
				var workingDaysPerWeek = getWorkDaysPerStandardWeek(workingWeek);
				var hoursPerWeek = getHoursPerStandardWeek(workingWeek);
				var avgHoursPerDay = setFloat((hoursPerWeek/workingDaysPerWeek),2);
				nlapiSetFieldValue('custentity_pr_working_days_per_week',workingDaysPerWeek);
				nlapiSetFieldValue('custentity_pr_standard_week',hoursPerWeek);
				nlapiSetFieldValue('custentity_pr_hours_per_day',avgHoursPerDay);
			}
			
		break ;
	}
}	

/*
 * function calculates the appropriate tax scale based no 6 criteria that are applied optionally
 * 
 */	
function setTaxScaleChanged()
{
	var tfnNoStr = nlapiGetFieldValue("custentity_pr_tfn");
	var countryId = nlapiGetFieldValue("custentity_pr_country");
	var validTaxFileNoBool = isValidTaxFileNumber(tfnNoStr,countryId);
	var useDummyNumberBool = tfnNoStr == "000000000" || tfnNoStr == "111111111";
	var noTFN = (validTaxFileNoBool || useDummyNumberBool) ? "F" : "T";
	
	var residentStatusId = nlapiGetFieldValue("custentity_pr_resident_status");
	var claimTaxFree = nlapiGetFieldValue("custentity_pr_claim_tax_free_threshold");
	var payLeaveLoading = nlapiGetFieldValue("custentity_pr_pay_leave_loading"); 
	var medicareExempt = nlapiGetFieldValue("custentity_pr_ml_exemption");
	var hasSfss = nlapiGetFieldValue("custentity_pr_help_sfss_var");
	var claimSeniorOffset = nlapiGetFieldValue("custentity_pr_claim_senior_tax_offset");
	var seniorCoupleStatus = nlapiGetFieldValue("custentity_pr_senior_couple_status");
	var floodLevyExempt = nlapiGetFieldValue("custentity_pr_flood_levy_exempt") == 'T' ? 'T' : 'F';
	var jurisdictionId = nlapiGetFieldValue("custentity_pr_country");
	
	//alert('jurisdictionId: ' + jurisdictionId)

	var searchArr = ["notfn is " + noTFN + " validTaxFileNoBool is " + validTaxFileNoBool + " and resident status is " + residentStatusId + " and jurisdiction is " + jurisdictionId + " and floodlevy " + floodLevyExempt + " and senior offset is " + seniorCoupleStatus];

	alert("notfn is " + noTFN + " validTaxFileNoBool is " + validTaxFileNoBool + " useDummyNumberBool is " + useDummyNumberBool + " and resident status is " + residentStatusId + " and jurisdiction is " + jurisdictionId + " and floodlevy " + floodLevyExempt + " and senior offset is " + seniorCoupleStatus);

	var filtersArr = [
          new nlobjSearchFilter("custrecord_pr_payg_jurisdiction",null,"anyof",jurisdictionId),
		  new nlobjSearchFilter("custrecord_pr_payg_claim_threshold",null,"is",claimTaxFree),
          new nlobjSearchFilter("custrecord_pr_payg_fl_exempt",null,"is",floodLevyExempt),
          new nlobjSearchFilter("custrecord_pr_payg_claim_senior_offset",null,"is",claimSeniorOffset),
		 //new nlobjSearchFilter("custrecord_pr_payg_senior_status",null,"anyof",seniorCoupleStatus),
         new nlobjSearchFilter("custrecord_pr_payg_help_sfss",null,"anyof",hasSfss),
          new nlobjSearchFilter("custrecord_pr_payg_mlv",null,"anyof",medicareExempt),
          new nlobjSearchFilter("custrecord_pr_payg_leave_loading",null,"is",payLeaveLoading),
		  new nlobjSearchFilter("custrecord_pr_payg_no_tfn",null,"is",noTFN)
          ];
	
	//
	if(!isNullOrEmpty(residentStatusId))
	{
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_resident_status",null,"anyof",residentStatusId));
	}
	
	
	
	if(noTFN == "F" && residentStatusId == EMPLOYEE_IS_RESIDENT)
	{
		// has tax file number check tax free threshold.
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_no_tfn",null,"is",noTFN));
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_claim_threshold",null,"is",claimTaxFree));
		
		searchArr.push(" and claimTaxFree is " + claimTaxFree);
		
		if(claimTaxFree == "T")
		{
			if(claimSeniorOffset == "T")
			{
				// claiming senior offset.
				filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_senior_status",null,"anyof",seniorCoupleStatus));
				searchArr.push(" and senior status is " + seniorCoupleStatus);
			}
			else
			{
				// not claiming senior offset
				//filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_help_sfss",null,"anyof",hasSfss));
				//filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_mlv",null,"anyof",medicareExempt));
				
				searchArr.push(" and sfss is " + hasSfss + " and mlv is " + medicareExempt);
	
				if(medicareExempt == "1")
				{
					//filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_leave_loading",null,"is",payLeaveLoading));
					
					searchArr.push(" and leaveloading is " + payLeaveLoading);
				}
			}
		}
	}
	
	console.log(searchArr.join(""));
	
	var searchResults = nlapiSearchRecord("customrecord_payg_calc_type",null,filtersArr,[new nlobjSearchColumn("internalid"), new nlobjSearchColumn('name')]);		
	
	if(searchResults != null && searchResults.length > 0)
	{
		//console.log("search results " + searchResults.length);
		nlapiSetFieldValue("custentity_employee_tax_scale",searchResults[0].getId());	
		var idArr = [];
		for (var x = 0; x < searchResults.length; x++) //for (var i = 0; i < empBankAccountSearch.length; i++)
		{
			idArr.push(searchResults[x].getId());
		}
		
		alert("results: " + searchResults.length +  ' ids: ' + idArr.join("/"))
	}
	else
	{
		alert("no results");	
	}	
}

function setTaxScale()
{
	var payRollCountry = nlapiGetFieldValue('custentity_pr_country');
	if (payRollCountry == PAYROLL_COUNTRY_AU)
	{
		var tfnNoStr = nlapiGetFieldValue("custentity_pr_tfn");
		var countryId = nlapiGetFieldValue("custentity_pr_country");
		var noTFN = (isValidTaxFileNumber(tfnNoStr,countryId) && tfnNoStr != "000000000") ? "F" : "T";
		
		var residentStatusId = nlapiGetFieldValue("custentity_pr_resident_status");
		var claimTaxFree = nlapiGetFieldValue("custentity_pr_claim_tax_free_threshold");
		var payLeaveLoading = nlapiGetFieldValue("custentity_pr_pay_leave_loading"); 
		var medicareExempt = nlapiGetFieldValue("custentity_pr_ml_exemption");
		var hasSfss = nlapiGetFieldValue("custentity_pr_help_sfss_var");
		var claimSeniorOffset = nlapiGetFieldValue("custentity_pr_claim_senior_tax_offset");
		var seniorCoupleStatus = nlapiGetFieldValue("custentity_pr_senior_couple_status");
		var floodLevyExempt = nlapiGetFieldValue("custentity_pr_flood_levy_exempt");
		var jurisdictionId = nlapiGetFieldValue("custentity_pr_country");
	
		var searchStr = "notfn is " + noTFN + " and resident status is " + residentStatusId;
	
		var filtersArr = [];
		
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_no_tfn",null,"is",noTFN));
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_jurisdiction",null,"anyof",jurisdictionId))
		if (!isNullOrEmpty(residentStatusId))
		{
			filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_resident_status",null,"anyof",residentStatusId));
		}
		
		//alert("notfn is " + noTFN + " and resident status is " + residentStatusId + " and jurisdiction is " + jurisdictionId + " and floodlevy " + floodLevyExempt + " and senior offset is " + seniorCoupleStatus + " and claimTaxFree " + claimTaxFree);
		
		if(noTFN == "F")
		{
			// flood levy exemption addition tax year 2012 applys to resident and non resident
			var floodLevyExemptStr = (!isNullOrEmpty(floodLevyExempt) && floodLevyExempt == "T") ? "T" : "F";
			filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_fl_exempt",null,"is",floodLevyExemptStr));
			// end flood levy exemption addition
			if(residentStatusId == EMPLOYEE_IS_RESIDENT)
			{
				// has tax file number check tax free threshold.
				filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_claim_threshold",null,"is",claimTaxFree));
				
				searchStr += " and claimTaxFree is " + claimTaxFree;
				
				if(claimTaxFree == "T")
				{
					filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_claim_senior_offset",null,"is",claimSeniorOffset));
					searchStr += " and claimSeniorOffset is " + claimSeniorOffset;
					
					if(claimSeniorOffset == "T")
					{
						// claiming senior offset.
						filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_senior_status",null,"anyof",seniorCoupleStatus));
						searchStr += " and senior status is " + seniorCoupleStatus;
					}
					else
					{
						// not claiming senior offset
						filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_help_sfss",null,"anyof",hasSfss));
						filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_mlv",null,"anyof",medicareExempt));
						
						searchStr += " and sfss is " + hasSfss + " and mlv is " + medicareExempt;
			
						if(medicareExempt == "1")
						{
							filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_leave_loading",null,"is",payLeaveLoading));
							
							searchStr += " and leaveloading is " + payLeaveLoading;
						}
					}
				}
				else
				{
					// Help dept still applys when claim tax free threshold is no.
					filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_help_sfss",null,"anyof",hasSfss));
				}
			}
			else
			{
				// Non residents can have help dept
				filtersArr.push(new nlobjSearchFilter("custrecord_pr_payg_help_sfss",null,"anyof",hasSfss));
			}
			
			
		}
		
		var searchResults = nlapiSearchRecord("customrecord_payg_calc_type",null,filtersArr,[new nlobjSearchColumn("internalid"), new nlobjSearchColumn('name')]);		
		
		if(searchResults != null && searchResults.length > 0)
		{
			nlapiSetFieldValue("custentity_employee_tax_scale",searchResults[0].getId());	
			/*var idArr = [];
			for (var x = 0; x < searchResults.length; x++) //for (var i = 0; i < empBankAccountSearch.length; i++)
			{
				idArr.push(searchResults[x].getId());
			}
			
			alert("results: " + searchResults.length +  ' ids: ' + idArr.join("/"))*/
		}
		else
		{
			alert("no results");	
		}
	}
	
	
		
}



function setPayRollDefaults()
{
	var defaultArr = [
    "custentity_pr_country","cmp_default_country",
	"custentity_employment_status", "emp_employmentstatus",
	"custentity_pay_type","emp_paytype",
	"custentity_pr_standard_week","emp_workingweek",
	"custentity_pay_freq","emp_payfrequency",
	"custentity_pr_pay_method","emp_paymethod",
	"custentity_pr_normal_pay_day","emp_normalpayday",
	"custentity_employee_payroll_state","emp_paystate",
	"custentity_pr_award_name","emp_award",
	"custentity_payroll_ap_account","cfg_acct_ap",
	"custentity_pr_workers_comp_policy_name","cmp_workercompname",
	"custentity_pr_pay_leave_loading","emp_leaveloading",
	"custentity_pr_leave_loading_percentage","cfg_leaveloadingpercentage",
	"custentity_pr_employer_super_cont","cmp_supercontribution",
	"custentity_pr_super_threshold","cfg_superthreshold",
	"custentity_pr_super_upper_threshold","cfg_uppersuperthreshold",
	"custentity_pr_annual_leave_entitlement","emp_annualleave",
	"custentity_pr_personal_leave_entitlement","emp_personalleave",
	"custentity_pr_lsl_entitlement","emp_longserviceleave",
	"custentity_pr_payslip_method","emp_deliverymethod",
	"custentity_pr_super_expense_account","cmp_acct_super"
	];
	
	for(var i=0; i < defaultArr.length; i+=2)
	{
		try
		{
			if (i== 0)
			{
				// set payroll configured flag
				nlapiSetFieldValue('custentity_pr_payroll_configured','T',true,true);
			}
			var fieldNameStr = defaultArr[i];
			var valueStr = payroll.config[defaultArr[i+1]];
			
			if(!isNullOrEmpty(valueStr))
			{
				nlapiSetFieldValue(fieldNameStr,valueStr,true,true);
			}			
		}
		catch(ex)
		{
			var errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() + '\n' + ex.getStackTrace().join("\n") : ex.toString();
			nlapiLogExecution("error","setPayRollDefaults","exception: " + errorStr);
		}
	}
} 

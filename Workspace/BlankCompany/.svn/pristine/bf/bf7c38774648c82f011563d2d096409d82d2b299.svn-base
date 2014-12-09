
var empDetailsObj = {};
var subTypeObj = {};
var subTypeRatesObj = {};
//var ctxObj = nlapiGetContext();

function timeEntrySave()
{
	returnBool = true;
	
	calcAmount();
	
	returnBool = confirm('Are you sure you want to submit the time entered?');
	return returnBool;
}

/**
 * move this code server side at some point as its not necessary.
 */
function timeEntryOnLoad()
{
    var isSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");
    var subSidiaryId = "";
    if(isSubsidiaryBool)
    {
        subSidiaryId = nlapiGetFieldValue('custpage_subsidiary')
    }
    initPayroll(subSidiaryId);

    empDetailsObj = JSON.parse(nlapiGetFieldValue('custpage_emp_detail'));
    //alert(JSON.stringify(empDetailsObj));
	subTypeObj = getSubTypeDetails(true); // JSON.parse(nlapiGetFieldValue('custpage_subtype_detail'));
	subTypeRatesObj = getSubTypeRates(true);
	nlapiDisableLineItemField('custpage_tasklist','custpage_total_hours',true);
	nlapiDisableLineItemField('custpage_tasklist','custentity_pr_standard_week',true);



    //alert(JSON.stringify(payroll))
	
}

function submitLater()
{
	var submit = confirm('This will save time entries entered so far, you will then be able to come back and add new time entries to the payrun before processing');
	if (submit)
	{
		nlapiSetFieldValue('custpage_submit_later', 'T');
		setWindowChanged(window, false);		
		//document.main_form.submit();
		document.getElementById("submitter").click();
	}
	
}

function timeEntryFieldValidate(type, fieldname, linenum)
{
	//alert('fieldname: ' + fieldname + ' fieldValue: ' +  fieldValue)
	var returnValue = true;
	var netsuiteTimeBool = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_is_netsuite_time") == "T";
	
	if (netsuiteTimeBool)
	{
		if (fieldname == 'custpage_hours')
		{
			var oldValue = setFloat(nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_last_hours"));
			var newValue = setFloat(nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_hours"));
			//alert('oldValue: ' + oldValue + ' newValue: ' + newValue )
			if (newValue != oldValue)
			{
				alert("This summary line is based on standard time data you cannot change the number of hours.  To change this line edit the standard time records for this employee.");	
				nlapiSetCurrentLineItemValue("custpage_tasklist",fieldname,oldValue,false);
				//returnValue = false;
			}
		}
	}
	
	return returnValue;
}



function timeEntryFieldChanged(type, fieldname, linenum)
{
	var empId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'internalid');
	var isBaseTime = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_is_nt') == 'T'; 
	var isLinkedLine = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_nt_link") == "T";
	
	if (fieldname == 'custpage_pay_run_id')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	if (fieldname == 'custpage_sort_field')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	if(fieldname == 'internalid')
	{
		// lookup employe values and populate on line
		
		var baseEmpId = nlapiGetCurrentLineItemValue('custpage_tasklist','custpage_base_empid');
		
		if ((isBaseTime && !isNullOrEmpty(baseEmpId)) || isLinkedLine) 
		{
			var alertStr = 'You cannot change the employee name.  All employees must have a normal time entry.  If there is no normal time for this employee then set hours to 0';
			
			if (isLinkedLine)
			{
				alertStr = 'You cannot change the employee name as this row is linked to a normal time entry. If the entry is not valid please remove the line' ;
			}
			alert(alertStr);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'internalid',baseEmpId,false);
			return;
		}
		
		if (!isNullOrEmpty(empId))
		{
			//var empValues = nlapiLookupField('employee',empId,['custentity_employment_status','custentity_pr_standard_week','custentity_pay_type','custentity_pay_freq','custentity_pr_hourly_rate','custentity_pr_pay_leave_loading','custentity_pr_leave_loading_percentage','custentity_pr_other_leave_daily_rate','custentity_pr_annual_leave_hourly_rate','custentity_pr_working_days_per_week','custentity_pr_hours_per_day']);
			var empStatus = empDetailsObj[empId].empStatus;
			var hourlyRate = setFloat(empDetailsObj[empId].hourlyRate);
			var alHourlyRate = setFloat(empDetailsObj[empId].alHourlyRate) == 0.00 ? hourlyRate : setFloat(empDetailsObj[empId].alHourlyRate);
			var dailyRate = setFloat(empDetailsObj[empId].otherLeaveRate);
			var leaveLoading = empDetailsObj[empId].isLL == 'T';
			var leaveLoadingPercent = setFloat(empDetailsObj[empId].llPct);
			var standardWeek = empDetailsObj[empId].stdWeek;
			//alert('hourlyRate: ' +  hourlyRate)
			if (!isNullOrEmpty(empStatus))
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_employment_status',empStatus);
			}
			var empPayType = empDetailsObj[empId].custentity_pay_type;
			if (!isNullOrEmpty(empPayType))
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pay_type',empPayType);
			}
			var empPayFrequency = empDetailsObj[empId].custentity_pay_freq;
			if (!isNullOrEmpty(empPayFrequency))
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pay_freq',empPayFrequency);
			}
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',hourlyRate);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_annual_leave_hourly_rate',alHourlyRate);
			if (dailyRate>0.00)
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_other_leave_daily_rate',dailyRate);
			}
			if (leaveLoading)
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_pay_leave_loading','T');
			}
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_leave_loading_percentage',leaveLoadingPercent);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_standard_week',standardWeek);
			
			var country = empDetailsObj[empId].country;
            //alert(country);
			var hoursPerDay = setFloat(empDetailsObj[empId].custentity_pr_hours_per_day);
			var daysPerWeek = setFloat(empDetailsObj[empId].custentity_pr_working_days_per_week) == 0.00 ? '5' : setFloat(empDetailsObj[empId].custentity_pr_working_days_per_week) ;
			var standardWorkingWeek = setFloat(empDetailsObj[empId].custentity_pr_standard_week);
			if(hoursPerDay == 0.00)
			{
				if(standardWorkingWeek > 0.00)
				{
					hoursPerDay = setFloat(standardWorkingWeek/daysPerWeek,5)
				}
				switch (country) 
				{
					case PAYROLL_COUNTRY_NZ:
					case PAYROLL_COUNTRY_UK:
						
						hoursPerDay = 8;
						
						break;
						
					case PAYROLL_COUNTRY_AU:
						
						hoursPerDay = 7.5;
						
						break;
						
					default:
					
						hoursPerDay = 8;
						
						break;
				}
			}
			
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hours_per_day',hoursPerDay);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_working_days_per_week',daysPerWeek);
		}
		
		// reset hour values if employee changes
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_hours','');
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_last_hours',0.00);
		//nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_adjust_hours',0.00);
		
		
	}
	
	if (fieldname == 'custpage_days') 
	{
		var days = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_days'));
		if(days > 0.00)
		{
			var standardWeek = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_standard_week');
			var dailyHours = setFloat((standardWeek/5),4);
			var numberOfHours = setFloat((days*dailyHours),4);
			//ToDo use the working week to get the average hours per day.
					
			if (numberOfHours > 0.00)
			{
				nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_hours',numberOfHours);
			}
		}
	}

	if (fieldname == 'custpage_pay_rate_subtype')
	{
		var payRateTypeId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_subtype');
		var lastPayTypeId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_last_pay_type');
		var empId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'internalid');
		
		if (payRateTypeId == payroll.PCST.NORMAL_TIME)
		{
			if (!isNullOrEmpty(empId)) 
			{
				var empStatus = empDetailsObj[empId].custentity_employment_status;
				var payType = empDetailsObj[empId].custentity_pay_type;
				var payRunId = nlapiGetFieldValue('custpage_pay_run_id');
				var payRunType = nlapiGetFieldValue('custpage_payrun_type')
				var skipBool = nlapiGetFieldValue('custpage_skip') == 'T';
				if (payRunType == PAYRUN_TYPE_ADJUSTMENT && skipBool && payType == EMP_PAY_TYPE_SALARY) 
				{
					alert('Adding normal time for a salaried employee is not supported at this step.  You will need to enter this using the "One-off Button at the process payslips step');
					nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_subtype','');
				}
			}
		}
	
		if ((isBaseTime && payRateTypeId != payroll.PCST.NORMAL_TIME) || isLinkedLine) 
		{
			var alertStr = 'You cannot change this the time type.  All employees must have a normal time entry.  If there is no normal time for this employee then set hours to 0';
			var setTypeField = payroll.PCST.NORMAL_TIME;
			
			if (isLinkedLine)
			{
				alertStr = 'You cannot change this the time type as this row is linked to a another time entry. If the entry is not valid please remove the line'  ;
				if(!isNullOrEmpty(lastPayTypeId))
				{
					setTypeField = lastPayTypeId;
				}
			}
			alert(alertStr);
			
		
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_subtype',setTypeField,false);
			return;
		}
		
		if (!isNullOrEmpty(payRateTypeId))
		{
			//var payRateTypeValues = nlapiLookupField('customrecord_pr_pcst',payRateTypeId,['custrecord_pr_pcst_pc_type','custrecord_pr_pcst_ote','custrecord_pr_pcst_rate','custrecord_pr_pcst_ote_rate']);
	
			var ote = subTypeObj[payRateTypeId].ote;
			var oterate = subTypeObj[payRateTypeId].oteRate;
			var rate =  subTypeObj[payRateTypeId].rate;
			var rateType = subTypeObj[payRateTypeId].typeId;
			
			var useRateTable = subTypeObj[payRateTypeId].useRates == 'T';
			
			//alert('useRateTable: ' + useRateTable + ' - subTypeRatesObj: ' + JSON.stringify(subTypeRatesObj));
			
			if (!isNullOrEmpty(empId))
			{
				var country = empDetailsObj[empId].country;
				
				if(useRateTable)
				{
					var subTypeRateType = subTypeObj[payRateTypeId].rateType;
					var id = subTypeObj[payRateTypeId].id;

                    //alert('subTypeRateType: ' + subTypeRateType + ' - subTypeObj: ' + JSON.stringify(subTypeObj));

                    if(subTypeRateType == PAYRATE_GLOBAL)
                    {
                        var subTypeHourlyRate = subTypeObj[payRateTypeId].hourlyrate;
                        nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',subTypeHourlyRate);
                    }
                    else if(!isNullOrEmpty(subTypeRatesObj))
                    {
                        if(subTypeRateType == PAYRATE_TAXYEAR)
                        {
                            var keyStr = 'TY' + id + '-' + nlapiGetFieldValue('custpage_taxyear');
                            //alert('keyStr: ' + keyStr)
                            var rateTableArr = subTypeRatesObj[keyStr];
                            //alert('emp rateTableArr: ' + JSON.stringify(rateTableArr))
                            if(!isNullOrEmpty(rateTableArr))
                            {
                                //set hourly rate from the tax tables
                                // for UK statutory rates they are defined as weekly so they need to be converted to hourly
                                if (payRateTypeId == payroll.PCST.SSP)
                                {
                                    var weeklySSP = rateTableArr.weekly;
                                    var standardWeek = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_standard_week');
                                    var workingDays = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_working_days_per_week');
                                    var dailyHours = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hours_per_day');
                                    var sspDailyRate = setFloat(weeklySSP/workingDays,5);
                                    var sspHourlyRate = setFloat(sspDailyRate/dailyHours,5);

                                    //alert('weeklySSP: ' + weeklySSP + ' workingDays: ' + workingDays  + ' sspDailyRate: ' + sspDailyRate + ' dailyHours: ' + dailyHours + ' sspHourlyRate: ' + sspHourlyRate  )

                                    if (sspHourlyRate > 0.00)
                                    {
                                        nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',sspHourlyRate);
                                    }
                                }
                                else
                                {
                                    //use hourly rates
                                    var subTypeHourlyRate = setFloat(rateTableArr.hourly);
                                    if (subTypeHourlyRate > 0.00)
                                    {
                                        nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',subTypeHourlyRate);
                                    }
                                }
                            }
                        }
                        else if(subTypeRateType == PAYRATE_EMPLOYEE)
                        {
                            var keyStr = empId + '-' + payRateTypeId;
                            //alert('keyStr: ' + keyStr)
                            var rateTableArr = subTypeRatesObj[keyStr];
                            //alert('emp rateTableArr: ' + JSON.stringify(rateTableArr))
                            if (!isNullOrEmpty(rateTableArr))
                            {
                                var subTypeHourlyRate = setFloat(rateTableArr.hourly);
                                if (subTypeHourlyRate > 0.00)
                                {
                                    nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',subTypeHourlyRate);
                                }
                            }
                        }
                    }
					

				}
                //alert('country' + country +  ' payRateTypeId: ' + payRateTypeId);
				if (country == PAYROLL_COUNTRY_NZ)
				{
					if (payRateTypeId == payroll.PCST.ANNUAL_LEAVE || payRateTypeId == payroll.PCST.ANNUAL_LEAVE_INADVANCE || payRateTypeId == payroll.PCST.UNUSED_ANNUAL_LEAVE)
					{
						var alHourlyRate = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_annual_leave_hourly_rate');
                        //alert('alHourlyRate' + alHourlyRate);
						nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',alHourlyRate);
					}
					else if(rateType == PAY_COMPONENT_TYPE_LEAVE)
					{
						var NZDailyRate = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_other_leave_daily_rate');
						var standardWeek = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_standard_week');
						var workingDays = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_working_days_per_week');
						var dailyHours = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hours_per_day');
						var NZOtherLeaveHourlyRate = setFloat((NZDailyRate/dailyHours),4);
						
						if (NZOtherLeaveHourlyRate > 0.00)
						{
							nlapiSetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',NZOtherLeaveHourlyRate);
						}
						//alert('NZOtherLeaveHourlyRate: ' + NZOtherLeaveHourlyRate + ' NZDailyRate: ' + NZDailyRate + ' dailyHours: ' + dailyHours)
					}
				}
			}
			
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_ote',ote);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_hours','');
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_penalty_rate',rate);
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_ote_rate',oterate);	
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_type',rateType);	
		}
		
		//var payTypeInt = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_pay_rate_type");
		
		if (payRateTypeId == payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING)
		{
			if (payRateTypeId == payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING)
			{
				var changeLeave = confirm('Leave loading is calculated on the annual leave subtype, please select ok to change to annual leave');
				if (changeLeave)
				{
					nlapiSetCurrentLineItemValue('custpage_tasklist','custpage_pay_rate_subtype',payroll.PCST.ANNUAL_LEAVE,true);
				}
			}
		}
		
		if(!isNullOrEmpty(payRateTypeId))
		{
			nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_last_pay_type',payRateTypeId);
		}
		
		
		
	}
	
	if (fieldname == 'custpage_hours' || fieldname == 'custentity_pr_hourly_rate' || fieldname == 'custpage_penalty_rate' )
	{
		var hours = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_hours'));
		var hourlyRate = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate'));
		var penaltyRate = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_penalty_rate'));
		var oteRate = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_ote_rate'));
		var amount = setFloat((hours * hourlyRate * penaltyRate),defaultPrecision,roundingMethod);
		var oteamount = setFloat((hours * hourlyRate * oteRate),defaultPrecision,roundingMethod);
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_amount', amount);
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_ote_amount',oteamount);	
		
		var leaveLoadingAmount = 0.00;
		var empLeaveLoading = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_pay_leave_loading') == 'T'; 
		var payRateTypeId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_subtype');
		if(empLeaveLoading && payRateTypeId == payroll.PCST.ANNUAL_LEAVE)
		{
			var rate = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custentity_pr_leave_loading_percentage') / 100);
			leaveLoadingAmount =  amount *  rate;		
			
		}	
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_leave_loading_amount',leaveLoadingAmount);		

	}
	
	if(fieldname == "custpage_body_memo")
	{
		var lineItemCount = nlapiGetLineItemCount('custpage_tasklist');
		var bodyMemo = nlapiGetFieldValue(fieldname);
		for(var line=1; line<=lineItemCount; line++) 
		{
			nlapiSetLineItemValue('custpage_tasklist', 'custpage_memo', line, bodyMemo);
		}
	}
}


/**
 * 
 */
function timeEntryValidateLine()
{
	var validBool = true;
	
	// if this is a create 

	var paySubType = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_pay_rate_subtype");
	var entityId = nlapiGetCurrentLineItemValue("custpage_tasklist","internalid");
	var payTypeInt = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_pay_rate_type");
	//var hoursInt = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_hours");
	var hours = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_hours'));
	var lastHours = setFloat(nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_last_hours'));
	var adjustHours = setFloat((hours - lastHours),defaultPrecision,roundingMethod);
	//var hoursInt = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_adjust_hours");
	var empId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'internalid');
	var isBaseTime = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_is_nt') == 'T'; 
	var decreaseHours = 0.00;
	var setLine = 0.00;
	
	var adjustHoursBool = false;
	
	
	//alert(paySubType);

	if(paySubType == payroll.PCST.NORMAL_TIME && !isBaseTime)
	{
		var payRunId = nlapiGetFieldValue('custpage_pay_run_id');
		var payRunType = nlapiLookupField('customrecord_pr_pay_run',payRunId,'custrecord_pr_pr_type');
		if (payRunType != PAYRUN_TYPE_ADJUSTMENT)
		{
			alert("Only one normal type can be added per employee, please change the pay rate type or cancel the line.");
			validBool = false;
		}
		
	}
	else
	{
		if(payTypeInt == PAY_COMPONENT_TYPE_LEAVE && paySubType != payroll.PCST.TIMEINLIEU_ACCRUAL)
		{
			if(adjustHours != 0.00 && confirm("Do you want to decrease the normal time hours?",false))
			{
				// find the entry for this entity.
				adjustHoursBool = true;
				var lineCount = nlapiGetLineItemCount("custpage_tasklist");
				nlapiSetCurrentLineItemValue("custpage_tasklist","custpage_nt_link","T");
				
				for (var line = 1; line <= lineCount; line++)
				{
					var paySubTypeInt = nlapiGetLineItemValue("custpage_tasklist", "custpage_pay_rate_subtype", line);
					var lineEntityId = nlapiGetLineItemValue("custpage_tasklist", "internalid", line);
					var normalHoursFloat = setFloat(nlapiGetLineItemValue("custpage_tasklist","custpage_hours",line));
					
					if(entityId == lineEntityId && paySubTypeInt == payroll.PCST.NORMAL_TIME)
					{
						var hoursDiff = setFloat((normalHoursFloat - adjustHours),defaultPrecision,roundingMethod);
						if(hoursDiff < 0.00)
						{
							var proceed = confirm('You have entered more holiday than normal hours for this pay run.  Click ok to pay holiday time in advance.\n\nFor tax to calculate correctly you need to manually edit the time detail on the payslip to set the correct period. For future pay runs you need add the paid in advance pay component for the extra hours you have paid this employee');
							if (!proceed) 
							{
								return false;
							}
							decreaseHours = 0.00;
							
						}
						else
						{
							decreaseHours = hoursDiff;
						}
						
						setLine = line;
					}
				}				
			}
			
			var leaveAvailable = 0.00;
			var componentCategory = subTypeObj[paySubType].category;
			
			
			if (componentCategory == PAY_COMPONENT_CATEGORY_PAID_LEAVE)
			{
				switch (paySubType)
				{
					case payroll.PCST.ANNUAL_LEAVE :
					case payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING :
				
						leaveAvailable = setFloat(getLeaveTotal(payroll.PCST.ANNUAL_LEAVE_ACCRUAL, empId, null, null),4);
					
					break;
					
					case payroll.PCST.PERSONAL_CARERS_LEAVE :
					
						leaveAvailable = setFloat(getLeaveTotal(payroll.PCST.PERSONAL_LEAVE_ACCRUAL, empId, null, null),4);
					
					break;
					
					case payroll.PCST.LONG_SERVICE_LEAVE :
					
						leaveAvailable = setFloat(getLeaveTotal(payroll.PCST.LSL_ACRUAL, empId, null, null),4);
					
					break;

                    default:

                        if(payroll.config.cfg_use_custom_leave == 'T')
                        {
                            leaveAvailable = setFloat(getLeaveTotal(paySubType, empId, null, null),4);
                        }

                    break;

				}
			}
			else if (componentCategory == PAY_COMPONENT_CATEGORY_TIME_IN_LIEU)
			{
				leaveAvailable = setFloat(getLeaveTotal(payroll.PCST.TIMEINLIEU_ACCRUAL, empId, null, null),4);
			}
			
			//alert('leaveAvailable ' + leaveAvailable + ' hours ' +  hours + ' payTypeInt ' + payTypeInt);
			
			if (componentCategory != PAY_COMPONENT_CATEGORY_LEAVE_ACCRUAL && (paySubType == payroll.PCST.ANNUAL_LEAVE || paySubType == payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING || paySubType == payroll.PCST.PERSONAL_CARERS_LEAVE || paySubType == payroll.PCST.LONG_SERVICE_LEAVE || (componentCategory == PAY_COMPONENT_CATEGORY_TIME_IN_LIEU && (paySubType != payroll.PCST.ALTERNATE_HOLIDAY_ACCRUAL && paySubType != payroll.PCST.TIMEINLIEU_ACCRUAL))) && hours > leaveAvailable)
			{
				validBool = confirm('Please note the employee only has ' + leaveAvailable + ' hours leave available for this type. Taking ' +  hours + ' will put them into a negative balance.  Click OK to proceed and Cancel to change');
			}

            if(payroll.config.cfg_use_custom_leave == 'T' && componentCategory == PAY_COMPONENT_CATEGORY_PAID_LEAVE && hours > leaveAvailable)
            {
                validBool = confirm('Please note the employee only has ' + leaveAvailable + ' hours leave available for this type. Taking ' +  hours + ' will put them into a negative balance.  Click OK to proceed and Cancel to change');
            }
		}
	}
	if (validBool)
	{
		//alert(decreaseHours + ' setLine: ' + setLine)
		// only update values if line is added and check against changes in the line amounts if previously updated.
		if (decreaseHours >= 0.00)
		{
			 //alert('setting');
			 nlapiSetLineItemValue("custpage_tasklist","custpage_hours",setLine,decreaseHours);	
			 nlapiSetLineItemValue("custpage_tasklist","custpage_last_hours",setLine,decreaseHours);	
		}
		
		if (adjustHoursBool)
		{
			 // track hours that need to be reduced from normal time
			 nlapiSetCurrentLineItemValue("custpage_tasklist","custpage_adjust_normal_hours","T");
			 nlapiSetCurrentLineItemValue("custpage_tasklist","custpage_adjust_hours",hours);
		}
		
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_last_hours',hours,false);
		nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_base_empid',empId,false);
	}
	
	return(validBool);
}


/**
 * 
 */
function timeEntryValidateDelete()
{
	var deleteBool = true;

	var paySubType = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_pay_rate_subtype");
	var entityId = 	nlapiGetCurrentLineItemValue("custpage_tasklist", "internalid");
	
	var netsuiteTimeBool = nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_is_netsuite_time") == "T";

	
	if(paySubType == payroll.PCST.NORMAL_TIME)
	{
		// you cannot delete the normal time entry.	
		alert("This summary line is based on standard time data and cannot be removed here.  To remove this line change the standard time records for this employee.");	
		deleteBool = false;
	}
	else if (netsuiteTimeBool)
	{
		// you cannot delete the normal time entry.	
		alert("You cannot delete this line, as a normal time line is required for each employee.");	
		deleteBool = false;
	}
	else
	{
		if(nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_nt_link") == "T")
		{
			// we must update the normal time value associated to this record.
			var lineCount = nlapiGetLineItemCount("custpage_tasklist");


			var hoursFloat = setFloat(nlapiGetCurrentLineItemValue("custpage_tasklist","custpage_hours"),2);
			for (var line = 1; line <= lineCount; line++)
			{
				var paySubTypeInt = nlapiGetLineItemValue("custpage_tasklist", "custpage_pay_rate_subtype", line);
				var lineEntityId = nlapiGetLineItemValue("custpage_tasklist", "internalid", line);
				var normalHoursFloat = setFloat(nlapiGetLineItemValue("custpage_tasklist","custpage_hours",line),2);
				
				if(entityId == lineEntityId && paySubTypeInt == payroll.PCST.NORMAL_TIME)
				{
					nlapiSetLineItemValue("custpage_tasklist","custpage_hours",line,normalHoursFloat + hoursFloat);	
				}
			}				
		}
	}
	
	return(deleteBool);
}



function timeEntryRecalc()
{
	//alert("recalc");
	/*
	var payRateTypeId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_pay_rate_subtype');
	var lastPayTypeId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'custpage_last_pay_type');
	var empId = nlapiGetCurrentLineItemValue('custpage_tasklist', 'internalid');
	
	//alert("payRateTypeId" +  payRateTypeId);

	if (payRateTypeId == payroll.PCST.ANNUAL_LEAVE || payRateTypeId == payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING)
		{
			var empArr = nlapiLookupField("employee",empId,['custentity_pr_pay_leave_loading','custentity_pr_leave_loading_percentage']);

			var empLeaveLoading = (empArr['custentity_pr_pay_leave_loading'] == "T");

			if(empLeaveLoading && payRateTypeId == payroll.PCST.ANNUAL_LEAVE)
			{
				var changeLeave = confirm('This employee IS entitled to leave loading select ok to add leave loading');
				if (changeLeave)
				{ 
					var currentLine = setFloat(nlapiGetCurrentLineItemIndex('custpage_tasklist'))
					var newLine = currentLine + 1
					alert("addline at: " + newLine);
					nlapiInsertLineItem('custpage_tasklist',newLine);
					alert("insert");
					//nlapiSetLineItemValue('custpage_tasklist', 'internalid',newLine,empId,false);
					nlapiSetCurrentLineItemValue('custpage_tasklist', 'internalid',empId,false,false);
					//nlapiSetCurrentLineItemValue('custpage_tasklist','custpage_pay_rate_subtype',payroll.PCST.ANNUAL_LEAVE_LEAVE_LOADING,false,false);
					// convert percentage into positive number 
					//var rate = (setFloat(empArr['custentity_pr_leave_loading_percentage']) / 100);
					//alert(rate);
					nlapiSetCurrentLineItemValue('custpage_tasklist', 'custpage_penalty_rate',rate,false,false);	
					nlapiCommitLineItem('custpage_tasklist')	
				}
			}
		}*/
}

function calcAmount()
{
	//alert('yo')
	var lineItemCount = nlapiGetLineItemCount('custpage_tasklist');
	
	for(var line=1; line<=lineItemCount; line++) 
	{
		var hours = setFloat(nlapiGetLineItemValue('custpage_tasklist', 'custpage_hours',line));
		var hourlyRate = setFloat(nlapiGetLineItemValue('custpage_tasklist', 'custentity_pr_hourly_rate',line));
		var penaltyRate = setFloat(nlapiGetLineItemValue('custpage_tasklist', 'custpage_penalty_rate',line));
		var amount = setFloat(hours * hourlyRate * penaltyRate,2);
		nlapiSetLineItemValue('custpage_tasklist', 'custpage_amount', line, amount);
		var oteRate = setFloat(nlapiGetLineItemValue('custpage_tasklist', 'custpage_ote_rate',line));
		//alert(oteRate);
		var oteAmount = setFloat(hours * hourlyRate * oteRate,2);
		nlapiSetLineItemValue('custpage_tasklist', 'custpage_ote_amount', line, oteAmount);
	}
	nlapiRefreshLineItems('custpage_tasklist');
}

function getLeaveTotal(type, empId, accrualType, paySlipId)
{
	//nlapiLogExecution('debug','getLeaveTotal','type: ' + type + ' empId: ' + empId + ' accrualType: ' + accrualType + ' paySlipId: ' + paySlipId);
	
	var amount = 0.00;
	
	var columns = new Array();
	var filters = new Array();
	
	if (!isNullOrEmpty(type))
	{
		columns.push(new nlobjSearchColumn('custrecord_pr_lhr_type',null,'group'));
		filters.push(new nlobjSearchFilter('custrecord_pr_lhr_type', null, 'anyof', type));
	}
	if (!isNullOrEmpty(empId))
	{
		columns.push(new nlobjSearchColumn('custrecord_pr_lhr_employee',null,'group'));
		filters.push(new nlobjSearchFilter('custrecord_pr_lhr_employee', null, 'anyof', empId));
	}
	if (!isNullOrEmpty(accrualType))
	{
		columns.push(new nlobjSearchColumn('custrecord_pr_lhr_accrual_type',null,'group'));
		filters.push(new nlobjSearchFilter('custrecord_pr_lhr_accrual_type', null, 'anyof', accrualType));
	}
	if (!isNullOrEmpty(paySlipId))
	{
		columns.push(new nlobjSearchColumn('custrecord_pr_lhr_payslip',null,'group'));
		filters.push(new nlobjSearchFilter('custrecord_pr_lhr_payslip', null, 'anyof', paySlipId));
	}
	columns.push(new nlobjSearchColumn('custrecord_pr_lhr_hours',null,'sum'));
	
	var leaveTotalSearch = nlapiSearchRecord('customrecord_pr_leave_history', null, filters, columns);
	for (var i = 0; !isNullOrEmpty(leaveTotalSearch) && i < leaveTotalSearch.length; i++) 
	{
		amount = leaveTotalSearch[0].getValue("custrecord_pr_lhr_hours",null,"sum");
	}
	
	//nlapiLogExecution('debug','getLeaveTotal','amount: ' + amount);
	
	return amount;
	
	
}



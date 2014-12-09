var recordPrefix = "";
var prLeaveAvailableCheckPendingBool = false;
var prPartDayMaxInt = 0.00;
var prRosteredBool = false;
var prAllowOverrideBool = false;
var prType = "";
var isAccrualRequestBool = false;
var jsonUrlStr = '';


function prPageInit(type)
{
	
	prType = type;
	prRosteredBool = (nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_workingweek_rostered") == "T");
	
	if(isNullOrEmpty(nlapiGetRecordType()))
	{
		// called from the leave request.		
		recordPrefix = "custpage_";
	}

	if(type == "create")
	{
		nlapiDisableField(recordPrefix + "custrecord_pr_lr_partday",true);
        nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_accruedhours",(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_isaccrual") == 'T'));
        nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_availablehours",(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_isaccrual") != 'T'));

        prRosteredBool = (nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_workingweek_rostered") == "T");

		if(!prRosteredBool)
		{
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours",true);
		}
		
		// validate required fields
		if(prWorkingDaysInt == 0)
		{
			if(!prRosteredBool)
			{
				alert("The employee's working week is zero, please check the employee record and ensure a working week has been specified.");	
			}
			else
			{
				alert("This employee is on a rostered working week, all required hours must be entered manually");
			}
		}
	}

	var subsidiaryId = nlapiGetFieldValue("custpage_subsidiary");
	initPayroll(subsidiaryId);
	
	if(prRosteredBool)
	{
		prAvgHourPerDayFloat = 24.00;
	}
	
	// override of standard validation can only occur with the UI record (not the ESS suitelet)
	if(recordPrefix == "")
	{
		if(nlapiGetFieldText("customform").toLowerCase().indexOf("admin") != -1)
		{
			// admin form.
			prAllowOverrideBool = true;	
			
			if(prVerboseBool)
			{
				alert("running in override mode");		
			}
		}
		
		// if this is an edit we need to initialise the status of some of the fields
		if(type == "edit")
		{
			var typeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_leave_type");
			isAccrualRequestBool = (!isNullOrEmpty(typeId) && prarArr[typeId] != undefined);
			var isPartDayBool = (nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday") == "T");
			var enablePartDayBool = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start") == nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end") && !isAccrualRequestBool;
            nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_accruedhours",isAccrualRequestBool);
            nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_availablehours",!isAccrualRequestBool);

            if(!prRosteredBool && !isPartDayBool && !isAccrualRequestBool)
			{
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours",true);		
			}
			
			if(!enablePartDayBool)
			{
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_partday",true);						
			}
			else
			{
				// the max day int is set when leave is recalculated.
				prPartDayMaxInt = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours");
			}
			
			if(isNullOrEmpty(prHalfPaySubTypeArr[typeId]))
			{
				// enable the half pay field 	
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_half_pay", true);
			}			
		}
	}
}


function prFieldChanged(type,name,linenum)
{
	switch (name) 
	{
		case recordPrefix + "custrecord_pr_lr_employee":
			
			// the employee can only change on a create in which case we redirect elsewhere
		if(!isNullOrEmpty(recordPrefix))
		{
			document.location = nlapiResolveURL("SUITELET","customscript_lm_sl_ess_leaverequest","customdeploy_lm_sl_ess_leaverequest") + '&custparam_empid=' + nlapiGetFieldValue(name);
		}
		else
		{
			// supress the alert when changing the employee.
			setWindowChanged(window, false);	
			document.location = nlapiResolveURL("RECORD","customrecord_pr_leave_request",null) + '&custparam_empid=' + nlapiGetFieldValue(name);
		}
			
		break;
		case recordPrefix + "custrecord_pr_lr_partday":
		
		// get start date and end date
		var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
		var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start"); 
		
		var checkedBool = nlapiGetFieldValue(name) == "T";
		var isSingleDayBool = (!isNullOrEmpty(endDateStr) && !isNullOrEmpty(startDateStr) && endDateStr == startDateStr);
		
		// if the box is checked and its a single day.
		if(checkedBool && isSingleDayBool) 
		{
			alert("Please enter the number of hours you wish to take in the required hours field. The number of hours must be less than your normal hours.");
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours", false);
		}
		else 
		{
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours", true);
			prCalculateLeaveConsumption(startDateStr,endDateStr,(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay") == "T"));
		}
		
		break;
		case recordPrefix + "custrecord_pr_lr_leave_type":

		// the half pay field is only relevant for annual and long service types.
		
		var typeId = nlapiGetFieldValue(name);
		
		if(!isNullOrEmpty(prHalfPaySubTypeArr[typeId]))
		{
			// enable the half pay field 	
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_half_pay", false);
		}
		else 
		{
			// clear the field and disable it.
			nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay","F");
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_half_pay", true);
		}
		
		if(prarArr[typeId] != undefined)
		{
            var rate = (prarArr[typeId] > 0.00) ? prarArr[typeId] : 1.00;
			alert("You have selected " + nlapiGetFieldText(recordPrefix + "custrecord_pr_lr_leave_type") + " an accrual leave type. This type of request is generally used when an employee has worked additional hours and instead of payment receive additional leave hours. Please enter the total number of hours to accrue for the period in the required hours field.");
			isAccrualRequestBool = true;
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours",false);	
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_partday",true);

            var accrualRate = parseFloat(nlapiGetFieldValue(recordPrefix + 'custrecord_pr_lr_accrualrate'),2);
            var accrualTotalFloat = nlapiGetFieldValue(recordPrefix + 'custrecord_pr_lr_requiredhours') * ((accrualRate > 0.00) ? accrualRate : 1);
            nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_accruedhours",accrualTotalFloat);
		}
		else
		{
			isAccrualRequestBool = false;
			if(!prRosteredBool)
			{
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_requiredhours",true);	
			}
		}

        if(recordPrefix != '')
        {
            // running from suitelet so sourcing does not occur default fields.
            nlapiSetFieldValue(recordPrefix + 'custrecord_pr_lr_isaccrual',isAccrualRequestBool ? 'T': 'F');
            nlapiSetFieldValue(recordPrefix + 'custrecord_pr_lr_accrualrate',isAccrualRequestBool ? setFloat(prarArr[typeId],1): '');
        }

        // show hide the forecast field and acrued hours field
        nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_availablehours",!isAccrualRequestBool);
        nlapiSetFieldDisplay(recordPrefix + "custrecord_pr_lr_accruedhours",isAccrualRequestBool);

        // if total accrued is not empty and type is now !isAccrualRequestBool - clear accrued field and reset required hours
        if(!isAccrualRequestBool && nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_accruedhours") != '' && nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_accruedhours") != 0.00)
        {
            nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_accruedhours",'');
            var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
            var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start");

            if(!isNullOrEmpty(endDateStr) && !isNullOrEmpty(startDateStr))
            {
                prCalculateLeaveConsumption(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end"),endDateStr,(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay") == "T"));
            }
            else
            {
                nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours",'',false);
            }
        }



		prGetAvailableLeave();
		setMandatoryMedicalCertificate();

		if(recordPrefix == "")
		{
			var statusId = nlapiGetFieldValue("custrecord_pr_lr_status");
			
			if(statusId == LEAVEREQ_STATUS_PROCESSED || statusId == LEAVEREQ_STATUS_MANUAL)
			{
				alert("As time associated with this leave request has already been processed, please ensure you manually amend the leave history to reflect the change in type of leave taken. For any time entries that have not already been processed the type will be updated and processed in a subsequent run.");
			}
		}
		

		break;
		case recordPrefix + "custrecord_pr_lr_start":
		
		// default the end date if empty from the start date
		
		var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
		var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start"); 
		
		if(!isNullOrEmpty(startDateStr))
		{
			// we only need to recalculate leave consumption if we aren't triggering a change to end date.
			if(isNullOrEmpty(endDateStr) || nlapiStringToDate(endDateStr) < nlapiStringToDate(startDateStr))
			{
				endDateStr = startDateStr;
				nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_end",endDateStr,true);	
			}
			else
			{
				var startDateObj = nlapiStringToDate(startDateStr);
				var endDateObj = nlapiStringToDate(endDateStr);
				var isSingleDayBool = dateToKey(startDateObj) == dateToKey(endDateObj);
				if(!isSingleDayBool && nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday") == "T")
				{
					// clear the field
					nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_partday","F");
				}
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_partday",!isSingleDayBool || isAccrualRequestBool);
				
				prCalculateLeaveConsumption(startDateStr,endDateStr,(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay") == "T"));
				prGetAvailableLeave();
			}
		}
		else
		{
			nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours",0.0,false);
		}
		
		setMandatoryMedicalCertificate();

		
		
		break;
		case recordPrefix + "custrecord_pr_lr_end":
		
		var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
		var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start"); 

		if(!isNullOrEmpty(endDateStr))
		{
			if(isNullOrEmpty(startDateStr) ||nlapiStringToDate(endDateStr) < nlapiStringToDate(startDateStr))
			{
				startDateStr = endDateStr;
				nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_start",startDateStr,true);
			}
			else
			{
				var startDateObj = nlapiStringToDate(startDateStr);
				var endDateObj = nlapiStringToDate(endDateStr);
				var isSingleDayBool = dateToKey(startDateObj) == dateToKey(endDateObj);
				if(!isSingleDayBool && nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday") == "T")
				{
					// clear the field
					nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_partday","F");
				}
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_partday",!isSingleDayBool || isAccrualRequestBool);

				prCalculateLeaveConsumption(startDateStr,endDateStr,(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay") == "T"));
				prGetAvailableLeave();
			}
		}
		else
		{
			nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours",0.0,false);
		}
		
		setMandatoryMedicalCertificate();
		
		
		break;		
		case recordPrefix + "custrecord_pr_lr_half_pay":

		var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
		var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start"); 

		if(!isNullOrEmpty(endDateStr) && !isNullOrEmpty(startDateStr))
		{
			prCalculateLeaveConsumption(startDateStr,endDateStr,(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_half_pay") == "T"));
		}
		
		break;
		case recordPrefix + "custrecord_pr_lr_advancedate":

		var advanceDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_advancedate");
		nlapiSetFieldValue("custrecord_pr_lr_pay_in_advance",(!isNullOrEmpty(advanceDateStr)) ? "T" : "F");
			
		break;
        case recordPrefix + "custrecord_pr_lr_requiredhours":

        var accrualHoursFloat = 0.00;
        if(isAccrualRequestBool)
        {
            var accrualRate = parseFloat(nlapiGetFieldValue(recordPrefix + 'custrecord_pr_lr_accrualrate'),2);
            var accrualTotalFloat = nlapiGetFieldValue(recordPrefix + 'custrecord_pr_lr_requiredhours') * ((accrualRate > 0.00) ? accrualRate : 1);

            nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_accruedhours",accrualTotalFloat);
        }

        break;
	}
}


function prValidateField(type, name, linenum)
{
	var validBool = true;
	
	switch (name) 
	{
		case recordPrefix + "custrecord_pr_lr_requiredhours":

		var partDayBool = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday") == "T";

		if(partDayBool && !isAccrualRequestBool)
		{
			var valueFloat = parseFloat(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours"));
			
			if(valueFloat <= 0.00 || valueFloat >= prPartDayMaxInt)
			{
				alert("Part day must be more than 0 hours and less than " + prPartDayMaxInt + " hours");
				validBool = false;	
			}
		}

		break;
		case recordPrefix + "custrecord_pr_lr_status":

		if(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_status") == LEAVEREQ_STATUS_PROCESSED)
		{
			alert("Leave requests can only be marked as processed by the payrun process. Please select another status");
			validBool = false;
		}
		
		break;
		case recordPrefix + "custrecord_pr_lr_partday":

		// part day can only be selected if there is a single day.
		var isPartDayBool = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday") == "T";

		if(isPartDayBool)
		{
			var dateObj = nlapiStringToDate(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start"));

			if(prwwArr[dateObj.getDay()] == 0)
			{
				alert("Part days can only be used for a working day. Please recheck your start date");
				validBool = false;
			}
		}

		
		break;
	}
	
	return(validBool);
}

/**
 * We need to validate whether this request conflicts with any other before proceeding.
 */
function prSaveRecord()
{
	var saveBool = true;
	
	var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start");
	var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
	var recordId = (isNullOrEmpty(recordPrefix)) ? nlapiGetRecordId() : nlapiGetFieldValue(recordPrefix + "lid");

	var typeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_leave_type");
	var nowDateObj = new Date();
	var startDateObj = (!isNullOrEmpty(startDateStr)) ? nlapiStringToDate(startDateStr) : null;
	var endDateObj = (!isNullOrEmpty(endDateStr)) ? nlapiStringToDate(endDateStr) : null;
	var daysInt = (!isNullOrEmpty(endDateObj) && !isNullOrEmpty(startDateObj)) ? Math.round((endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)) + 1 : 0;

	var statusId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_status");
	var providedCertBool = (nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_provide_document") == "T");
	var requiredFloat = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours");

	if(isNullOrEmpty(recordId))
	{
		// lets check whether date is in the past.
		
		if(requiredFloat <= 0.00)
		{
			alert("The leave request cannot be processed as the leave does not require any leave hours. If you have entered part day please ensure you have at least 1 hour entered.");
			saveBool = false;	
		}
		
		if(saveBool && prRosteredBool)
		{
			// check the number of days betwen start and end date * avg hours per day > the hours added
			var maxHoursFloat = daysInt * prAvgHourPerDayFloat;	
			if(requiredFloat > maxHoursFloat)
			{
				alert("The leave request cannot be processed as the required hours entered exceeds the maximum (" + daysInt + " day(s) at " + prAvgHourPerDayFloat + " hours), please recheck required leave hours");
				saveBool = false; 
			}
		}
		
		if(saveBool && typeId == payroll.PCST.ANNUAL_LEAVE && startDateObj < nowDateObj)
		{
			saveBool = confirm("Are you sure you wished to enter annual leave in the past? click ok to proceed",false);
		}
		
		// lets check whether they have the leave available.
		if(saveBool && prCheckBalanceIdStr.indexOf('|' + typeId + '|') != -1)
		{
			// this leave type we monitor usage lets decide what to do.
			if(prLeaveAvailableCheckPendingBool)
			{
				alert("The leave request cannot be saved until a successful check has been made on your available leave, please wait a moment and retry.");	
				saveBool = false;
			}
			else
			{
				var availableFloat = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_availablehours");
				var balanceFloat =  setFloat(availableFloat - requiredFloat,2);
				
				if(balanceFloat < 0)
				{
					// if this leave type has a value for deficit days
                    var allowDeficitBool = (!isNullOrEmpty(prddArr[typeId]) && prddArr[typeId] > 0);
                    balanceFloat = setFloat(Math.abs(balanceFloat),2);

                    var deficitFloat = (allowDeficitBool) ? setFloat(prddArr[typeId] * prAvgHourPerDayFloat,2) : 0.00;

					if(allowDeficitBool && balanceFloat <= deficitFloat)
					{
						saveBool = confirm("This " + nlapiGetFieldText(recordPrefix + "custrecord_pr_lr_leave_type") + " request exceeds your available leave but is within the allowed " + prddArr[typeId] + " day(s) (" + deficitFloat + " hours), if you are happy to proceed click OK",false);
					}
					else
					{
						var alertMsgStr = "This " + nlapiGetFieldText(recordPrefix + "custrecord_pr_lr_leave_type") + " request cannot be made, as you do not have the required number of available hours. The request is for " + requiredFloat + " hours and you only have " + availableFloat + " hours available.";

						if(prAllowOverrideBool)
						{
							saveBool = confirm(alertMsgStr + " Do you wish to override this restriction? Click OK to agree and proceed or cancel otherwise.");							
						}
						else
						{
							alert(alertMsgStr);
							saveBool = false;			
						}
					}
				}
			}
			
		}
	
		if(saveBool)
		{
			if(typeId == payroll.PCST.PERSONAL_CARERS_LEAVE && !providedCertBool) 
			{
				var maxNonCertDaysInPeriodInt = payroll.config["lm_certdaysperiod"];
				var prevNonCertDaysInt = nonCertificatedLeaveDaysInt;
				var totalNonCertDaysInt = prevNonCertDaysInt + daysInt;
				
				if(maxNonCertDaysInPeriodInt > 0)
				{
					if(totalNonCertDaysInt > maxNonCertDaysInPeriodInt)
					{
						if(confirm("This leave request will exceed the maximum number of days per year than can be taken without medical certificate. If you have forgotten to check medical certificate click okay to proceed, otherwise click cancel, alter the leave type to unpaid and retry.",false))
						{
							nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_provide_document","T");						
						}
						else
						{
							saveBool = false;
						}
					}	
				}
			}
		}
		
		if(saveBool)
		{
			var existingLeaveBool = getOverlappingLeave();
			saveBool = !existingLeaveBool;
		}	
	}
	else
	{
		
		switch(statusId)
		{
			case LEAVEREQ_STATUS_APPROVED:

			if(nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_provide_document") == "T" && nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_confirm_document") == "F")	
			{
				alert("Please check you have received the medical certificate / supporting documentation before proceeding.");
				saveBool = false;	
			}

			break;	
			case LEAVEREQ_STATUS_CANCELLED:
			
			saveBool = confirm("Are you sure you wish to cancel this request?, by doing so if the leave was already approved the time represented will be deleted.",false);
			
			break;
			case LEAVEREQ_STATUS_DECLINED:
			
			saveBool = confirm("Are you sure you wish to decline this request?",false);
			
			break;
		}
	}

	return saveBool;	
}



/**
 * The amount of leave consumed is dependant on the working week record associated to the employee
 * and statutory holiday for the state this employee is associated to.
 * 
 */

function prCalculateLeaveConsumption(startDateStr, endDateStr, isHalfPayBool)
{
	if(prRosteredBool || isAccrualRequestBool) 
	{
		hoursFloat = "";
		var statHolidayArr = [];
		var statHolidayStr = "";

		// lets iterate over the days to check whether any holidays fall during this period.
		if(!isNullOrEmpty(startDateStr) && !isNullOrEmpty(endDateStr))
		{
			var startDateObj = nlapiStringToDate(startDateStr);
			var endDateObj = nlapiStringToDate(endDateStr);
			
			while (startDateObj <= endDateObj) 
			{
				var startDateTs = dateToKey(startDateObj);
				
				if (!isNullOrEmpty(prhhArr[startDateTs])) 
				{
					statHolidayArr.push(nlapiDateToString(startDateObj) + ": " + prhhArr[startDateTs]);
				}
				
				startDateObj = nlapiAddDays(startDateObj, 1);

			}			
			
			if(!isAccrualRequestBool && statHolidayArr.length > 0)
			{
				statHolidayStr = "\nNote: The following statutory holidays fall within the period of leave requested:\n\n\t- " + statHolidayArr.join("\n\t- ");	
			}			
		}
		
		if(!isAccrualRequestBool)
		{
			alert("Employee leave is rostered and cannot be calculated, please enter required hours manually." + statHolidayStr);
		}
	}
	else 
	{
		hoursFloat = 0.00;		
		if (!isNullOrEmpty(startDateStr) && !isNullOrEmpty(endDateStr))
		{
			var startDateObj = nlapiStringToDate(startDateStr);
			var endDateObj = nlapiStringToDate(endDateStr);
			
			var debugArr = [];
			var workingDayCountInt = 0;
			
			while (startDateObj <= endDateObj) 
			{
				startDateStr = nlapiDateToString(startDateObj);
				var startDateTs = dateToKey(startDateObj);
				
				if (!isNullOrEmpty(prhhArr[startDateTs])) {
					// day is a statutory holiday so consumes no time.
					debugArr.push(startDateStr + ": statholiday");
				}
				else 
				{
					var dayHoursFloat = prwwArr[startDateObj.getDay()];
					hoursFloat += dayHoursFloat;
					
					if (dayHoursFloat > 0.00) {
						workingDayCountInt++;
					}
					
					debugArr.push(startDateStr + ": " + dayHoursFloat);
				}
				
				startDateObj = nlapiAddDays(startDateObj, 1);
			}
			
			if (isHalfPayBool) {
				hoursFloat = hoursFloat / 2;
				debugArr.push("Half Pay:" + hoursFloat);
			}
			else {
				debugArr.push("Full Pay:" + hoursFloat);
			}
			
			if (prVerboseBool) {
				alert(debugArr.join("\n"));
			}
			
			prPartDayMaxInt = (startDateStr == endDateStr) ? hoursFloat : 0.00;
		}
	}

	nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_requiredhours",hoursFloat,false);
}

/*
 * 
 * Note: the maximum number of days without a certificate is configurable as parameter lm_certdays. Set to 0 to avoid any check. 
 * 
 */
function setMandatoryMedicalCertificate()
{
	var typeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_leave_type");
	var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start");
	var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
	var workingDayCountInt = 0;
	var certMandatoryDaysInt = payroll.config["lm_certmandatorydays"];
	
	if(certMandatoryDaysInt > 0)
	{		
		if (isNullOrEmpty(startDateStr) || isNullOrEmpty(endDateStr) || typeId != payroll.PCST.PERSONAL_CARERS_LEAVE) 
		{
			// criteria isn't met so lets enable the field.
			nlapiDisableField(recordPrefix + "custrecord_pr_lr_provide_document", false);
		}
		else
		{
			// get working days for period.		
			var startDateObj = nlapiStringToDate(startDateStr);
			var endDateObj = nlapiStringToDate(endDateStr);
			
			while (startDateObj <= endDateObj) 
			{
				var startDateTs = dateToKey(startDateObj);
				if (isNullOrEmpty(prhhArr[startDateTs])) 
				{
					if (prwwArr[startDateObj.getDay()] > 0.00) {
						workingDayCountInt++;
					}
				}
				startDateObj = nlapiAddDays(startDateObj, 1);
			}		
	
			if (workingDayCountInt >= certMandatoryDaysInt) 
			{
				alert("Leave Requests of Personal / Carers Leave Paid of " + certMandatoryDaysInt + " day(s) or more require a medical certificate.");
				nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_provide_document","T");
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_provide_document", true);
			}
			else
			{
				nlapiDisableField(recordPrefix + "custrecord_pr_lr_provide_document", false);
			}
		}
	}
} 

function getOverlappingLeave()
{
	var overlappingBool = false;
	var errorStr = "";

	try
	{
		var employeeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_employee");
		var startDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_start");
		var endDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
		var recordId = (isNullOrEmpty(recordPrefix)) ? nlapiGetRecordId() : nlapiGetFieldValue(recordPrefix + "lid");
		var leaveTypeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_leave_type");
		var partDayChar = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_partday");
		
		jsonUrlStr = (isNullOrEmpty(jsonUrlStr)) ? nlapiResolveURL("SUITELET","customscript_lm_sl_jsondata","customdeploy_lm_sl_jsondata") : jsonUrlStr;
		var response = nlapiRequestURL(jsonUrlStr,{
			"custparam_lid" : recordId, 
			"custparam_employeeid" : employeeId ,
			"custparam_startdate" : startDateStr, 
			"custparam_leavetype" : leaveTypeId,
			"custparam_partday" : partDayChar,
			"custparam_enddate" : endDateStr, "custparam_action" : "getexisting"},null);

		// check the response code first.
		if(response.getCode() != "200")		
		{
			// a problem occurred making the call.	
			errorStr = "LEAVE_OVERLAP_REQUEST_ERROR: The json call returned the status code " + response.getCode();	
		}
		else
		{
			if(prVerboseBool) 
			{
				alert(response.getBody());
			}
			
			var resultArr = JSON.parse(response.getBody());

			if(!resultArr['success'])
			{
				// a problem occurred whilst obtaining the data display a message.
				errorStr = "LEAVE_OVERLAP_SCRIPT_ERROR: The json call returned success of false " + resultArr["message"];
			}
			else
			{
				if(resultArr["result"]["existing"])
				{
                    // include a warning only.
                    if(isAccrualRequestBool)
                    {
                        overlappingBool = !confirm("Warning: This accrual request overlaps with an existing leave request. This can occur if you are claiming time for a leave request that you worked all or part of. If this is the case click 'OK' otherwise click 'Cancel");
                    }
                    else
                    {
                        overlappingBool = true;
                        alert(resultArr["result"]["message"]);
                    }
				}
			}
		}
	}
	catch(ex)
	{
		errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() : ex.toString();			
	}
	
	if(errorStr)
	{
		alert("We have been unable to determine whether this request overlaps with other active requests. This problem may have occurred because your session has timed out. Please login again and retry. \n\n" + errorStr);	
		overlappingBool	= true;
	}
	
	return(overlappingBool);
}


function prGetAvailableLeave()
{
	nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_availablehours","0.00",false);

	var leaveTypeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_leave_type");
	var futureDateStr = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_end");
	var employeeId = nlapiGetFieldValue(recordPrefix + "custrecord_pr_lr_employee");	

	if(leaveTypeId == payroll.PCST.BOUGHT_LEAVE)
	{
		nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_availablehours",prBoughtLeaveFloat,false);
	}
	else
	{
		if(!isNullOrEmpty(leaveTypeId) && !isNullOrEmpty(futureDateStr))
		{
			if(prCheckBalanceIdStr.indexOf('|' + leaveTypeId + '|') != -1)
			{
				// these need to be calculated dynamically.	
				prLeaveAvailableCheckPendingBool = true;		
				jsonUrlStr = (isNullOrEmpty(jsonUrlStr)) ? nlapiResolveURL("SUITELET","customscript_lm_sl_jsondata","customdeploy_lm_sl_jsondata") : jsonUrlStr;
				nlapiRequestURL(jsonUrlStr,{
					"custparam_typeid" : leaveTypeId , 
					"custparam_futuredate" : futureDateStr, 
					"custparam_action" : "getforecast",
					"custparam_employeeid" : employeeId},null,prGetAvailableLeaveHandler);
			}
			else
			{
				prLeaveAvailableCheckPendingBool = false;	
			}
		}
	}
}

function prGetAvailableLeaveHandler(response)
{
	var errorStr = "";
	try
	{
		if(response.getCode() != "200")
		{
			// a problem occurred in running the script.
			errorStr = "LEAVE_GETFORECAST_REQUEST_ERROR: The json call returned the status code " + response.getCode();	
		}
		else
		{
			if(prVerboseBool)
			{
				alert(response.getBody());
			}

			var resultArr = JSON.parse(response.getBody());

			if(!resultArr['success'])
			{
				// a problem occurred whilst obtaining the data display a message.
				errorStr = "LEAVE_GETFORECAST_SCRIPT_ERROR: The json call returned success of false " + resultArr["message"];
			}
			else
			{
				nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_availablehours",nlapiFormatCurrency(parseFloat(resultArr["result"]["available"])));
				prLeaveAvailableCheckPendingBool = false;
			}
		}
	}
	catch(ex)
	{
		errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() : ex.toString();
	}
	
	if(!isNullOrEmpty(errorStr))
	{
		alert("We have been unable to determine the leave forecast for your request. This problem may have occurred because your session has timed out. Please login again and retry. \n\n" + errorStr);	
		nlapiSetFieldValue(recordPrefix + "custrecord_pr_lr_availablehours","0.00");			
	}
}

function prOverrideProcessedDate()
{
	if(confirm("Changes to the start and end date will only change the display of this leave request in the employee's leave calendar and no changes will be made to time records previously processed or otherwise. You must manually reflect these changes by creating leave history records. Do you wish to proceed?"))
	{
		nlapiSetFieldValue("custrecord_pr_lr_override","T");
		nlapiDisableField(recordPrefix + "custrecord_pr_lr_start",false);
		nlapiDisableField(recordPrefix + "custrecord_pr_lr_end",false);
	}
}

// tree expand functions

function toggleChildren(imgObj,typeStr,childIdArr)
{
	imgObj.src = (imgObj.src.indexOf("plus") != -1) ? "/images/nav/tree/minus_" + typeStr : "/images/nav/tree/plus_" + typeStr;
	var cssDisplayStr = (imgObj.src.indexOf("plus") != -1) ? "none" : "table-row";	
	
	// update the image to reflect -
	for(var i=0; i < childIdArr.length; i++)
	{
		document.getElementById("tremp_" + childIdArr[i]).style.display = cssDisplayStr;		
	}
}


/**
 * 
 * @param dateObj
 * @return {string} formatted yyyymmdd
 */
function dateToKey(dateObj)
{
	var monthInt = dateObj.getMonth() + 1;
	var dateInt = dateObj.getDate();
	return(dateObj.getFullYear().toString() + ((monthInt < 10) ? "0" + monthInt.toString() : monthInt.toString()) + ((dateInt < 10) ? "0" + dateInt.toString() : dateInt.toString()));
}
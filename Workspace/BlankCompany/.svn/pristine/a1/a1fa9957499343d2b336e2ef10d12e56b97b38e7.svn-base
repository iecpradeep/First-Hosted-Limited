/*
 * function defaults the start date or end date when necessary
 * 
 */

var csType = "";

function leaveFieldChanged(type, name, linenum)
{
    if(name == 'custrecord_pr_alat_total_days')
    {
        var days = setFloat(nlapiGetFieldValue('custrecord_pr_alat_total_days'));
        var empId = nlapiGetFieldValue('custrecord_pr_alat_employee');
        if(days > 0.00)
        {
            var empValues = nlapiLookupField('employee',empId,['custentity_pr_hours_per_day','custentity_pr_standard_week']);
            var hoursPerDay = empValues['custentity_pr_hours_per_day'];
            var hours = 0.00;
            if(!isNullOrEmpty(hoursPerDay))
            {
                hours = setFloat(days*hoursPerDay,4);
            }
            else
            {
                //work out hours by standard working week field
                var stdWorkingWeek = setFloat(empValues['custentity_pr_standard_week']);
                if(stdWorkingWeek > 0.00)
                {
                    hours = setFloat((stdWorkingWeek/5) * days,4);
                }
            }
            if(hours > 0.00)
            {
                nlapiSetFieldValue('custrecord_pr_alat_hours',hours);
                var leaveMethod = nlapiGetFieldValue('custrecord_pr_alat_leave_accrual_method');
                if((leaveMethod == ACCRUAL_METHOD_LUMP) && (csType == 'create' || csType == 'copy'))
                {
                    nlapiSetFieldValue('custrecord_pr_alat_balance',hours);
                }
            }
        }
        else
        {
            nlapiSetFieldValue('custrecord_pr_alat_hours',0);
        }

    }

    if(csType == 'create')
    {
        if(name == 'custrecord_pr_alat_accrued_date' && nlapiGetFieldValue('custrecord_pr_alat_leave_accrual_method') == ACCRUAL_METHOD_PERIOD)
        {
            var accruedDate = nlapiGetFieldValue('custrecord_pr_alat_accrued_date');
            if(!isNullOrEmpty(accruedDate))
            {
                nlapiSetFieldValue('custrecord_pr_alat_next_accrual',accruedDate);
            }

        }
    }

}

function leavePostSourcing(type, name)
{
    //alert(type + ' - ' + name);
    if(csType == 'create' || csType == 'copy')
    {
        if(name == 'custrecord_pr_alat_accrual_rate')
        {
            var days = nlapiGetFieldValue('custrecord_pr_alat_total_days');

            if(days > 0.00)
            {
                var empId = nlapiGetFieldValue('custrecord_pr_alat_employee');
                var empValues = nlapiLookupField('employee',empId,['custentity_pr_hours_per_day','custentity_pr_standard_week']);
                var hours = 0.00;
                var hoursPerDay = empValues['custentity_pr_hours_per_day'];
                if(!isNullOrEmpty(hoursPerDay))
                {
                    hours = setFloat(days*hoursPerDay,4);
                }
                else
                {
                    //work out hours by standard working week field
                    var stdWorkingWeek = setFloat(empValues['custentity_pr_standard_week']);
                    if(stdWorkingWeek > 0.00)
                    {
                        hours = setFloat((stdWorkingWeek/5) * days,4);
                    }
                }
                if(hours > 0.00)
                {
                    nlapiSetFieldValue('custrecord_pr_alat_hours',hours);
                    var leaveMethod = nlapiGetFieldValue('custrecord_pr_alat_leave_accrual_method');
                    //alert(leaveMethod);
                    if(leaveMethod == ACCRUAL_METHOD_LUMP)
                    {
                        nlapiSetFieldValue('custrecord_pr_alat_balance',hours);
                    }
                }
            }
            else
            {
                nlapiSetFieldValue('custrecord_pr_alat_hours',0);
            }
        }
    }


}

function leavePageInit(type)
{
    csType = type;
    if(csType == 'create')
    {

    }
}

function leaveSave()
{
    var returnBool = true;

    if(csType == "create" || csType == "copy")
    {

        //check for duplicate of the same accrual time.
        var subTypeName = nlapiGetFieldText('custrecord_pr_alat_accrual_sub_type');
        var subTypeId = nlapiGetFieldValue('custrecord_pr_alat_accrual_sub_type');
        var empId = nlapiGetFieldValue('custrecord_pr_alat_employee');
        var existingLeaveRec = nlapiSearchRecord('customrecord_pr_additional_leave_type', null, [new nlobjSearchFilter('custrecord_pr_alat_accrual_sub_type', null, 'anyof', subTypeId),new nlobjSearchFilter('custrecord_pr_alat_employee', null, 'anyof', empId)], null);

        var leaveMethod = nlapiGetFieldValue('custrecord_pr_alat_leave_accrual_method');

        if(!isNullOrEmpty(leaveMethod))
        {
            var startDate = nlapiGetFieldValue('custrecord_pr_alat_accrued_date');
            var balance = setFloat(nlapiGetFieldValue('custrecord_pr_alat_balance'));

            switch (leaveMethod)
            {
                case ACCRUAL_METHOD_LUMP:

                    var days = nlapiGetFieldValue('custrecord_pr_alat_total_days');

                    if(isNullOrEmpty(startDate))
                    {
                        alert('You need to set a start date for a lump sum leave accrual');
                        returnBool = false;
                    }
                    else if(isNullOrEmpty(days))
                    {
                        alert('You need to set the initial number of days leave accrual for a lump sum type');
                        returnBool = false;
                    }
                    else
                    {
                        if (existingLeaveRec != null)
                        {
                            alert('You cannot create this leave acrrual for ' + subTypeName + ' as one already exists for this employee you will be redirect to this record. If you want to create an additional accrual amount you can manually create a leave history linked to this record and the employee');
                            var urlStr = nlapiResolveURL("RECORD", "customrecord_pr_additional_leave_type", existingLeaveRec[0].getId(), false);
                            setWindowChanged(window, false);
                            document.location = urlStr;
                            returnBool = false;
                        }
                        else
                        {
                            returnBool = confirm('If you click OK then a leave accural starting balance will be created for ' + balance + ' hours as at ' + startDate);
                        }
                    }


                    if(isNullOrEmpty(balance))
                    {
                        alert('A balance must be set for this leave method');
                        returnBool = false
                    }

                    break;

                case ACCRUAL_METHOD_PAYRUN:

                    var hours = setFloat(nlapiGetFieldValue('custrecord_pr_alat_hourly_accrual'));

                    if(hours == 0.00)
                    {
                        alert('A Leave Hourly Accrual Rate must be set for this leave method');
                        returnBool = false
                    }
                    else
                    {
                        if(balance != 0.00)
                        {
                            startDate = isNullOrEmpty(startDate) ? nlapiDateToString(new Date()) : startDate;
                            returnBool = confirm('If you click OK then a leave accural starting balance will be created for ' + balance + ' hours as at ' + startDate);
                            if(returnBool && isNullOrEmpty(nlapiGetFieldValue('custrecord_pr_alat_accrued_date')))
                            {
                                nlapiSetFieldValue('custrecord_pr_alat_accrued_date',startDate,false)
                            }
                        }
                    }



                    break;

                case ACCRUAL_METHOD_PERIOD:

                    var hours = nlapiGetFieldValue('custrecord_pr_alat_hours');
                    var frequency = nlapiGetFieldValue('custrecord_pr_alat_frequecy');
                    var nextAccrualDate = nlapiGetFieldValue('custrecord_pr_alat_next_accrual');


                    if(isNullOrEmpty(hours) || isNullOrEmpty(frequency) || isNullOrEmpty(nextAccrualDate))
                    {
                        if(isNullOrEmpty(hours))
                        {
                            alert('Total Hours Per Period must be set for this leave method');
                            returnBool = false
                        }


                        if(isNullOrEmpty(frequency))
                        {
                            alert('Frequency must be set for this leave method');
                            returnBool = false
                        }


                        if(isNullOrEmpty(nextAccrualDate))
                        {
                            alert('The next accrual date must be set for this leave method');
                            returnBool = false;
                        }
                    }
                    else
                    {
                        if(balance != 0.00)
                        {
                            startDate = isNullOrEmpty(startDate) ? nlapiDateToString(new Date()) : startDate;
                            returnBool = confirm('If you click OK then a leave accural starting balance will be created for ' + balance + ' hours as at ' + startDate);
                            if(returnBool && isNullOrEmpty(nlapiGetFieldValue('custrecord_pr_alat_accrued_date')))
                            {
                                nlapiSetFieldValue('custrecord_pr_alat_accrued_date',startDate,false)
                            }
                        }
                    }

                 break;
            }

            if (existingLeaveRec != null)
            {
                alert('You cannot create this leave acrrual for ' + subTypeName + ' as one already exists for this employee you will be redirected to this record. If you want to create an additional accrual amount you can manually create a leave history linked to this record and the employee');
                var urlStr = nlapiResolveURL("RECORD", "customrecord_pr_additional_leave_type", existingLeaveRec[0].getId(), false);
                setWindowChanged(window, false);
                document.location = urlStr;
                returnBool = false;
            }
        }
    }

    return returnBool;
}
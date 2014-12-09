/*
 * function defaults the start date or end date when necessary
 * 
 */

var csType = "";

function leaveFieldChanged(type, name, linenum)
{
    if(name == 'custrecord_pr_la_days')
    {
        var days = setFloat(nlapiGetFieldValue('custrecord_pr_la_days'));
        if(days > 0.00)
        {
            var standardWorkingWeek = setFloat(payroll.config.emp_workingweek);
            if(standardWorkingWeek > 0.00)
            {
                var hours = setFloat((standardWorkingWeek/5) * days,4);
                if(hours > 0.00)
                {
                    nlapiSetFieldValue('custrecord_pr_la_hours',hours);
                }
            }
        }
    }

    /*DAYS are used on NZ for leave rate calculations although accrual still occurs in hours in the system
    if(name == 'custrecord_pr_la_accrual_type')
    {
        var accrualType = nlapiGetFieldValue('custrecord_pr_la_accrual_type');
        if (accrualType != ANNUAL_LEAVE_UOM_HOURS)
        {
            alert('Hours is the only currently support accrual type');
            nlapiSetFieldValue('custrecord_pr_la_accrual_type',ANNUAL_LEAVE_UOM_HOURS);
        }
    }*/

}

function leavePageInit(type)
{
    csType = type;
    var isSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");
    var subSidiaryId = "";
    if(isSubsidiaryBool)
    {
        subSidiaryId = ctxObj.getSubsidiary();
    }
    initPayroll(subSidiaryId);

}

function leaveSave()
{
    var returnBool = true;

    //validate mandatory fields are set based on the leave accrual method.
    var leaveMethod = nlapiGetFieldValue('custrecord_pr_la_method');
    {
        if(!isNullOrEmpty(leaveMethod))
        {
            //confirm that leave taken and leave accrual have been set.

            var accrualSubType = nlapiGetFieldValue('custrecord_pr_la_acrualtype');
            if(isNullOrEmpty(accrualSubType))
            {
                alert('An sub type with a category of accrual must be set in the Accrual Sub Type field.');
                returnBool = false
            }

            var takenSubType = nlapiGetFieldValue('custrecord_pr_la_type');
            if(isNullOrEmpty(takenSubType))
            {
                alert('A sub type with a category of paid leave must be set in the Leave Type field');
                returnBool = false
            }

            switch (leaveMethod)
            {
                case ACCRUAL_METHOD_LUMP:

                    var hours = nlapiGetFieldValue('custrecord_pr_la_hours');
                    if(isNullOrEmpty(hours))
                    {
                        alert('Hours must be set for this leave method');
                        returnBool = false
                    }

                    break;

                case ACCRUAL_METHOD_PAYRUN:

                    break;

                case ACCRUAL_METHOD_PERIOD:

                    var hours = nlapiGetFieldValue('custrecord_pr_la_hours');
                    if(isNullOrEmpty(hours))
                    {
                        alert('Hours must be set for this leave method');
                        returnBool = false
                    }

                    var frequency = nlapiGetFieldValue('custrecord_pr_la_frequency');
                    if(isNullOrEmpty(frequency))
                    {
                        alert('Frequency must be set for this leave method');
                        returnBool = false
                    }

                    break;
            }
        }


    }


    return returnBool;
}
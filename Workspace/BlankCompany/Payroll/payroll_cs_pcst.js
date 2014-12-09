/**
 * function used to negate take entries.
 */
function saveRecord()
{
	var saveRecordBool = true;

    var updateFrom = nlapiGetFieldValue('custpage_target');
    var category = nlapiGetFieldValue('custrecord_pr_pcst_pcc');
    var leaveHistory = nlapiGetFieldValue('custrecord_pr_pcst_show_in_leave_history');

    switch (updateFrom)
    {
        case 'custrecord_pr_la_acrualtype':
        case 'custrecord_pr_alat_accrual_sub_type':

            if(category != PAY_COMPONENT_CATEGORY_LEAVE_ACCRUAL)
            {
                alert('The pay component category needs to be Leave Accrual for this type');
                saveRecordBool = false;
            }
            if(leaveHistory != 'T')
            {
                alert('Show in leave history needs to be check in order to accrue leave.');
                saveRecordBool = false;
            }



            break;

        case 'custrecord_pr_la_type':
        case 'custrecord_pr_alat_parent_pcst':

            if(category != PAY_COMPONENT_CATEGORY_PAID_LEAVE)
            {
                alert('The pay component category needs to be Leave Accrual for this type');
                saveRecordBool = false;
            }

            break;
    }


    return(saveRecordBool);
}

function validateField(type, name, linenum)
{
    return true;
}

function fieldChange(type, name, linenum)
{
    if(name == 'custrecord_pr_pcst_pcc')
    {
        var category = nlapiGetFieldValue('custrecord_pr_pcst_pcc');
        if(category == PAY_COMPONENT_CATEGORY_LEAVE_ACCRUAL)
        {
            nlapiSetFieldValue('custrecord_pr_pcst_show_in_leave_history','T');
        }
        else
        {
            nlapiSetFieldValue('custrecord_pr_pcst_show_in_leave_history','F');
        }
    }
}

function pageInit(type)
{

}

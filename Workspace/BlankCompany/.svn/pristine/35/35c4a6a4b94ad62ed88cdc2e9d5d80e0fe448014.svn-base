/**
 * function used to negate take entries.
 */
function saveRecord()
{
	var saveRecordBool = true;

	if(nlapiGetFieldValue("custrecord_pr_lhr_accrual_type") == ACCRUAL_TYPE_TAKEN)
	{
		var hoursFloat = parseFloat(nlapiGetFieldValue("custrecord_pr_lhr_hours"));
		nlapiSetFieldValue("custrecord_pr_lhr_hours",-Math.abs(hoursFloat));
	}

	return(saveRecordBool);	
}

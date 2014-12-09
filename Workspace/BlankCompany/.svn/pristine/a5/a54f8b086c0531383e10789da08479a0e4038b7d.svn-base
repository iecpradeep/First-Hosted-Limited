/*
 * function defaults the start date or end date when necessary
 * 
 */
function FBTSummaryFieldChanged(type, name, linenum)
{
	if(name == "custrecord_pr_fbts_system_calc" )
	{
		var update = (nlapiGetFieldValue('custrecord_pr_fbts_system_calc') == "T");
		if(update)
		{
			var taxYear = nlapiGetFieldValue('custrecord_pr_fbts_tax_year');
			//alert(taxYear);
			var empId = nlapiGetFieldValue('custrecord_pr_fbts_employee');
			//alert(empId);
			if(!isNullOrEmpty(empId) && !isNullOrEmpty(taxYear))
			{
				var reportableValue = setFloat(getFBTReportableValue(empId,taxYear));
				//alert(reportableValue);
				nlapiSetFieldValue("custrecord_pr_reportable_fbt",reportableValue,false);
				nlapiSetFieldValue('custrecord_pr_fbts_system_calc','F',false);
			}
		}
	}
}
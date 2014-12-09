/*
 * function defaults the start date or end date when necessary
 * 
 */
function superFundFieldChanged(type, name, linenum)
{
	if(name == "custrecord_esf_current")
	{
		var isCurrentBool = (nlapiGetFieldValue(name) == "T");
		if(isCurrentBool && isNullOrEmpty(nlapiGetFieldValue("custrecord_esf_start_date")))
		{
			nlapiSetFieldValue("custrecord_esf_start_date",nlapiDateToString(new Date()),false);
		}
		nlapiSetFieldValue("custrecord_esf_end_date",((nlapiGetFieldValue(name) == "T") ? "" : nlapiDateToString(new Date())),false);
	}
}
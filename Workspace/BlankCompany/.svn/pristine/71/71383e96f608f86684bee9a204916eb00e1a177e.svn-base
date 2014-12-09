function superFundFieldChanged(type, fieldname, linenum)
{
	if(fieldname == "custrecord_esf_current")
	{
		// if the current field is unchecked the end date value is set to todays date otherwise empty.
		var dateStr = (nlapiGetFieldValue(fieldname) == "T") ? "" : nlapiDateToString(new Date());
		nlapiSetFieldValue("custrecord_esf_end_date",dateStr,false);	
	}
}

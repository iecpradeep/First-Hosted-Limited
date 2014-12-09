function target_response_time(type, name)
{

if (name== 'priority' || name == 'item')
{

	// Declare vars

	var day_start = 8;
	var day_end = 18;
	var date_day;
	var date_month;
	var date_year;

	// Get priority of incident and lookup corresponding response time from priority table (custom record)

	var incident_priority = nlapiGetFieldValue('priority');
	var response_time = nlapiLookupField('customrecord_priority', incident_priority, 'custrecord_restime');		//change from customrecord2 to _priority and from custrecord2 to _restime


	// Get initial incident date and time from current record

	var incident_date = nlapiGetFieldValue('startdate');
	var incident_time = nlapiGetFieldValue('starttime');


	// Convert incident_date from string into date format

	incident_date_date = nlapiStringToDate(incident_date);

	// Split time into hours, minutes and am/pm flag using ':' and ' ' as markers

	var time_hour_marker = incident_time.indexOf(':');
	var time_ampm_marker = incident_time.indexOf(' ');

	var time_hour = incident_time.substring(0, time_hour_marker);
	var time_min = incident_time.substring(time_hour_marker + 1, time_ampm_marker);
	var time_ampm = incident_time.substring(time_ampm_marker + 1);

	// if time is then pm then convert to 24 hour clock for calculation purposes
	
	if ((time_ampm == 'pm') && (time_hour != 12))
	{

		time_hour = parseInt(time_hour) + 12;

	} //if


	// add hours to response target.  Check after each additional hour that working time has not been exceeded.
	// If working time exceeded then move to next day and reset working time to start of day.  If Saturday move
	// to Monday.

	for (i=0; i< response_time; i++)
	{

		time_hour = parseInt(time_hour) + 1;


		if (time_hour >= day_end)
		{
			time_hour = 8;
			
			incident_date_date = nlapiAddDays(incident_date_date, 1);
			
			// get current day			

			var day = incident_date_date.getDay();

			// if Saturday add 2 days to Monday
			
			if (day == 6)
			{
				incident_date_date = nlapiAddDays(incident_date_date, 2);
			
			} //if

		} //if

	alert(time_hour);
	alert(incident_date_date);

	} //for


	if (time_hour >= 12)
	{

		time_hour = parseInt(time_hour) - 12;
		
		var date_str = nlapiDateToString(incident_date_date);
		var text_str = time_hour + ':' + time_min + ' pm';

//		nlapiSetFieldValue('custevent2', date_str, false);
//		nlapiSetFieldValue('custevent3', text_str, false);


	alert(date_str);
	alert(text_str);

	} //if
	else
	{
		var date_str = nlapiDateToString(incident_date_date);
		var text_str = time_hour + ':' + time_min + ' am';

//		nlapiSetFieldValue('custevent2', date_str, false);
//		nlapiSetFieldValue('custevent3', text_str, false);


	alert(date_str);
	alert(text_str);


	} //else
	

} //if

} //function

function copyCase()
{

	var currentrecordid = nlapiGetRecordId();

	var newCaseRecord = nlapiCopyRecord('supportcase',currentrecordid);

	var newrecordid = nlapiSubmitRecord(newCaseRecord,true);

	var newrecordurl = nlapiResolveURL('RECORD','supportcase', newrecordid, 'EDIT');

	window.open(newrecordurl);void(0)
	
	return true;


} //function
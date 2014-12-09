function onChange(type,name)
{
	if (name == 'startdate')
	{
		var startdate = nlapiGetFieldValue('startdate');
		var employee = nlapiGetFieldValue('organizer');
		
		alert(startdate);
		alert(employee);
		
		var mySearchFilters = new Array();
		var mySearchColumns = new Array();
	
		mySearchFilters[0] = new nlobjSearchFilter('custrecord_availability_employee', null, 'is', employee);
	//	mySearchFilters[1] = new nlobjSearchFilter('custrecord_availability_date', null, 'is', startdate);
	
		mySearchColumns[0] = new nlobjSearchColumn('custrecord_availability_status');
	
		// perform search
		var mySearchResults = nlapiSearchRecord('customrecord_psavailability', null, mySearchFilters, mySearchColumns);

		if (mySearchResults)
		{
		var status = mySearchResults.getValue(mySearchColumns[0]);
		
		}

		
		nlapiSetFieldValue('custevent_availability',status,false,false);
		
		return true;
		
	} //if

} //function

function setDefaults()
{
	var user = nlapiGetUser();
	var subsidiary = nlapiGetSubsidiary();
	
	alert('user=' + user);
	alert('subsidiary=' + subsidiary);
	
	
	nlapiSetFieldValue('custevent_casereportedby',user);
	nlapiSetFieldValue('subsidiary',subsidiary);
		
	return true;
	
	
} //function

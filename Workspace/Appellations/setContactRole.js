function setRole()
{

	var tmpRole = nlapiGetFieldValue('custentity_tmpcat');
	nlapiSetFieldValue('contactrole', tmpRole);

}
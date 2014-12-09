function disableField(type, name)
{

	if (name == 'status')
	{

		if (nlapiGetFieldValue('status') == "32")
		{

			nlapiDisableField('comments',true);

		} //if
		else
		{
			nlapiDisableField('comments',false);
		
		} //else

	} //if


	return true;


} //function
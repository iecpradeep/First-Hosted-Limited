function pickingAlert(type)
{
	if type == 'edit'
	{

		var printed = nlapiGetFieldValue('printedpickingticket');
	
		if printed == 'T'
		{
			alert('WARNING: The picking process has started.  Alert warehouse if changes are made');
		
		}
	

	}	

	return true;
	
}
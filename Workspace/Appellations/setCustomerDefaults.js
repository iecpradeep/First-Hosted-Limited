function custChange(type, name)
{
	if (name == 'entityid')
		{
			var entityid = nlapiGetFieldValue('entityid');

			if (entityid != null && entityid != '')
				{
					nlapiSetFieldValue('accountnumber',entityid,false,false);

				}


		}

}
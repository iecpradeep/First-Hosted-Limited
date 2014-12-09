/*******************************************************
 * Name:		Customer Entry script
 * Script Type:	Client side
 * Version:		1.0.0
 * Version:		1.0.1 27/3/2012 jm
 * Date:		07 Feb 2011
 * Author:		FHL
 *******************************************************/

function onLoad()
{
	logFHLEvent('customentry.js: onload','start');		// 1.0.1 jm added eventlog 

	
	nlapiDisableField('subsidiary',true);

	logFHLEvent('customentry.js: onload','end');		// 1.0.1 jm added eventlog 

	return true;

} //function onLoad()

 function onChange(type,name)
 {
	 
	logFHLEvent('customentry.js: onChange','start');		// 1.0.1 jm added eventlog 

	if (name == 'custentity_groupcompany')
	{
		var groupcompany = nlapiGetFieldValue('custentity_groupcompany');
		
		if (groupcompany)
		{
			var entityid = nlapiLookupField('customrecord_entityfriendlyname',groupcompany,'custrecord_entity');
		
			nlapiSetFieldValue('subsidiary',entityid,false,false);
			
		} //if
		
	} //if

	logFHLEvent('customentry.js: onChange','end');		// 1.0.1 jm added eventlog 

	return true;
	
 } //function onChange

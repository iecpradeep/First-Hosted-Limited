function saveRecord()
{
	//
	// SJB: Call Generation
	//
	var callGenCheck = nlapiGetFieldValue('custentity_generate_call');
	
	if (nlapiGetRecordId() && // Updating (has an ID) 
		callGenCheck == 'T' && // Generate Call checkbox ticked
		nlapiGetFieldValue('custentity_callcampaign') && // Call Campaign not empty
		nlapiGetFieldValue('custentity_generatecallfor') // Generate Call For not empty
		//&& parseInt(nlapiGetRecordId()) == 35027 // Is test record (DEBUG)
	)
	{
		// Create Phone Call
		var today = nlapiDateToString( new Date() );
		var phoneCall = nlapiCreateRecord('phonecall');
		phoneCall.setFieldValue('customform', 8);
		phoneCall.setFieldValue('title', 'Call');
		phoneCall.setFieldValue('startdate', today);
		phoneCall.setFieldValue('starttime', '0:00 am');
		phoneCall.setFieldValue('endtime', '0:30 am');
		phoneCall.setFieldValue('custevent_sourcecampaign', nlapiGetFieldValue('custentity_callcampaign'));
		phoneCall.setFieldValue('assigned', nlapiGetFieldValue('custentity_generatecallfor'));
		phoneCall.setFieldValue('company', nlapiGetFieldValue('company'));
		phoneCall.setFieldValue('owner', nlapiGetUser());
		phoneCall.setFieldValue('contact', nlapiGetRecordId());
		
		var phoneCallId = nlapiSubmitRecord(phoneCall, true);
		
		// Untick Generate Call checkbox
		nlapiSetFieldValue('custentity_generate_call', 'F');
	}

	//
	// SJB: Update Classification on selected company record
	//
	if (nlapiGetFieldValue('company') 
		//&& (parseInt(nlapiGetRecordId()) == 35027 || parseInt(nlapiGetRecordId()) == 35029) // Is test record (DEBUG)
		)
	{
		try
		{

			var company = nlapiLoadRecord('customer', nlapiGetFieldValue('company'));
			var classifications = company.getFieldValues('custentity_classification');
			var classFns = new Array();
			var newClassFns = new Array();
			
			if (classifications)
			{
				classFns = classFns.concat(classifications);
			}
			
			var contactClassns = nlapiGetFieldValues('custentity_classification');
			if (contactClassns)
			{
				classFns = classFns.concat(contactClassns);
			}
			
			// Get rid of duplicates and put into new array
			var dupes = 0;
			for (var i = 0; i < classFns.length; i++)
			{
				dupes = 0;
				for (var j = 0; j < newClassFns.length; j++) 
				{
					if (classFns[i] == newClassFns[j])
					{
						dupes++;
					}
				}
				
				if (dupes == 0)
				{
					newClassFns.push(classFns[i]);
				}
			}
			
			company.setFieldValues('custentity_classification', newClassFns);
			nlapiSubmitRecord(company);
			
			// Reload the parent page (if there is one) to update values
			if (window.opener && newClassFns.length > 0)
			{
				window.opener.location.reload();
			}
		}
		catch (e)
		{
			// Not a company record, so don't do anything
		}
	}

	return true;
}

function massUpdate(rec_type, rec_id)
{
	nlapiLogExecution('DEBUG','Mass Update for Contacts', '*** STARTED ***');
	
	var contact = nlapiLoadRecord(rec_type, rec_id);
	
	//
	// SJB: Call Generation
	//
	var callGenCheck = contact.getFieldValue('custentity_generate_call');
	var currentContext = nlapiGetContext();
	
	if (callGenCheck == 'T' && // Generate Call checkbox ticked
		currentContext.getExecutionContext() == 'custommassupdate' && // Check we are in mass update script context
		contact.getFieldValue('custentity_callcampaign') && // Call Campaign not empty
		contact.getFieldValue('custentity_generatecallfor') // Generate Call For not empty
		//&& parseInt(rec_id) == 35027 // Is test record (DEBUG)
	)
	{
		// Create Phone Call
		var today = nlapiDateToString( new Date() );
		var phoneCall = nlapiCreateRecord('phonecall');
		nlapiLogExecution('DEBUG','Contact Company', '1.');
		
		phoneCall.setFieldValue('customform', 8);
		nlapiLogExecution('DEBUG','Contact Company', '2.');
		
		phoneCall.setFieldValue('title', 'Call');
		nlapiLogExecution('DEBUG','Contact Company', '3.');
		
		phoneCall.setFieldValue('startdate', today);
		nlapiLogExecution('DEBUG','Contact Company', '4.');
		
		phoneCall.setFieldValue('starttime', '0:00 am');
		nlapiLogExecution('DEBUG','Contact Company', '5.');
		
		phoneCall.setFieldValue('endtime', '0:30 am');
		nlapiLogExecution('DEBUG','Contact Company', '6.');
		
		phoneCall.setFieldValue('custevent_sourcecampaign', contact.getFieldValue('custentity_callcampaign'));
		nlapiLogExecution('DEBUG','Contact Company', '7.');
		
		phoneCall.setFieldValue('assigned', contact.getFieldValue('custentity_generatecallfor'));
		nlapiLogExecution('DEBUG','Contact Company', '8.');
		
		try {
			if(contact.getFieldValue('company') == null)
			{
				nlapiLogExecution('DEBUG','Company', 'NULL');
			}
			else
			{
				phoneCall.setFieldValue('company', contact.getFieldValue('company'));
			}	
		} 
		catch (e) 
		{
			//do nothing
			nlapiLogExecution('DEBUG','Contact Company', 'No Company to assign.');
		}

		phoneCall.setFieldValue('owner', nlapiGetUser());
		nlapiLogExecution('DEBUG','Contact Company', '9.');
		
		phoneCall.setFieldValue('contact', rec_id);
		nlapiLogExecution('DEBUG','Contact Company', '10.');
		
		var phoneCallId = nlapiSubmitRecord(phoneCall, true);
		nlapiLogExecution('DEBUG','Contact Company', '11.');
		
		// Untick Generate Call checkbox
		contact.setFieldValue('custentity_generate_call', 'F');
		nlapiLogExecution('DEBUG','Contact Company', '12.');
		
		nlapiSubmitRecord(contact, true);
		nlapiLogExecution('DEBUG','Mass Update for Contacts', '*** FINISHED ***');
	}
}


function massUpdateCompany(rec_type, rec_id)
{
	
	var customer = nlapiLoadRecord(rec_type, rec_id);
	
	//
	// SJB: Call Generation
	//
	var callGenCheck = customer.getFieldValue('custentity_generate_call');
	var currentContext = nlapiGetContext();
	
	if (callGenCheck == 'T' && // Generate Call checkbox ticked
	   currentContext.getExecutionContext() == 'custommassupdate' && // Check we are in mass update script context
	   customer.getFieldValue('custentity_callcampaign') && // Call Campaign not empty
	   customer.getFieldValue('custentity_generatecallfor') // Generate Call For not empty
	)
	{
		// Create Phone Call
		//var coName = customer.getFieldValue('companyname');
		var coName = customer.getFieldValue('id');
		var today = nlapiDateToString( new Date() );
		var phoneCall = nlapiCreateRecord('phonecall');
		phoneCall.setFieldValue('customform', 8);
		phoneCall.setFieldValue('title', 'Call');
		phoneCall.setFieldValue('startdate', today);
		phoneCall.setFieldValue('starttime', '0:00 am');
		phoneCall.setFieldValue('endtime', '0:30 am');
		phoneCall.setFieldValue('custevent_sourcecampaign', customer.getFieldValue('custentity_callcampaign'));
		//phoneCall.setFieldValue('assigned', customer.getFieldValue('custentity_generatecallfor'));
		nlapiLogExecution('DEBUG','Company ID', coName);
		phoneCall.setFieldValue('company', coName);
		phoneCall.setFieldValue('owner', nlapiGetUser());
		//phoneCall.setFieldValue('contact', rec_id);
		nlapiLogExecution('DEBUG','Phone Call','test rec_id ' + rec_id);
		var phoneCallId = nlapiSubmitRecord(phoneCall, true);
		
		// Untick Generate Call checkbox
		customer.setFieldValue('custentity_generate_call', 'F');
		nlapiSubmitRecord(customer, true);
	}
}

function test()
{
	alert('test');

}

function updatecalldetails(type,name)
{

	if (name == 'custevent_calloutcome')
	{

		var outcome = nlapiGetFieldValue('custevent_calloutcome');
		var company = nlapiGetFieldValue('company');
	

		if ((outcome != null) && (company != null))
		{

			var companyname = nlapiLookupField('customer', company, 'companyname');


			switch (outcome)
			{

				case '1':
				nlapiSetFieldValue('message','Called, Left Message.  Action: Schedule Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (LM)',false);
				break;

				case '2':
				nlapiSetFieldValue('message','Called, Not Available/No Answer. Action: Schedule Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (NA)',false);
				break;

				case '3':
				nlapiSetFieldValue('message','Called, Wrong Number. Action: Schedule Task & Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (WN)',false);
				break;

				case '4':
				nlapiSetFieldValue('message','Called, Send email. Action: Schedule Task & Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (SE)',false);
				break;

				case '5':
				nlapiSetFieldValue('message','Called, Alternate Contact Referral.  Action: Add New Contact, Schedule Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (ACR)',false);
				break;

				case '6':
				nlapiSetFieldValue('message','Called, Possible Interest.  Action: Schedule Task & Call Back.',false);
				nlapiSetFieldValue('title', companyname + ' (SUS)',false);
				break;

				case '7':
				nlapiSetFieldValue('message','Called, No Interest.  Action: Change Lead Status to Lost.',false);
				nlapiSetFieldValue('title', companyname + ' (NI)',false);
				break;

				case '8':
				nlapiSetFieldValue('message','Called, Lead Qualified.  Action: Change Lead Status, Enter APC ID, Schedule Event',false);
				nlapiSetFieldValue('title', companyname + ' (QUAL)',false);
				break;

				case '9':
				nlapiSetFieldValue('message','Called, Prospect.  Action: Change Lead Status, Verify ID Number, Create Opportunity, Schedule Event.',false);
				nlapiSetFieldValue('title', companyname + ' (PRO)',false);
				break;

				case '10':
				nlapiSetFieldValue('message','Called, Customer.  Action: Change Lead Status, Attach Order.',false);
				nlapiSetFieldValue('title', companyname + ' (CUS)',false);
				break;

				
			} //switch

			nlapiSetFieldValue('status','COMPLETE',false);

		} //if

	} //if

} //function

function saveactions()
{

	var outcome = nlapiGetFieldValue('custevent_calloutcome');

	if (outcome != null)
	{

		var company = nlapiGetFieldValue('company');
		var nextactiondate = nlapiGetFieldValue('custevent_nextactiondate');		
		var companyname = nlapiLookupField('customer', company, 'companyname');

		if (nextactiondate == '')
		{

			alert('Please enter next action date');
			return false;

		} //if


		switch (outcome)
		{


			case '1':
				var calltitle = companyname + ': Call Back';
				var record = nlapiCreateRecord('phonecall');
				var phone = nlapiGetFieldValue('phone');				

				record.setFieldValue('title', calltitle);
				record.setFieldValue('startdate',nextactiondate);
				record.setFieldValue('company',company);
				record.setFieldValue('status','SCHEDULED');
				record.setFieldValue('phone',phone);
				record.setFieldValue('message','Scheduled Call Back (Message left previously)');				

				id = nlapiSubmitRecord(record, true);	
				
				break;

			case '2':
				var calltitle = companyname + ': Call Back';
				var record = nlapiCreateRecord('phonecall');
				var phone = nlapiGetFieldValue('phone');				

				record.setFieldValue('title', calltitle);
				record.setFieldValue('startdate',nextactiondate);
				record.setFieldValue('company',company);
				record.setFieldValue('status','SCHEDULED');
				record.setFieldValue('phone',phone);
				record.setFieldValue('message','Scheduled Call Back (No Answer previously)');				

				id = nlapiSubmitRecord(record, true);	
				
				break;

			case '3':

				var tasktitle = companyname + ': Find Correct Number';
				var calltitle = companyname + ': Call Back using correct number';
				var taskrecord = nlapiCreateRecord('task');
				var callrecord = nlapiCreateRecord('phonecall');
				var phone = nlapiGetFieldValue('phone');				

				callrecord.setFieldValue('title', calltitle);
				callrecord.setFieldValue('startdate',nextactiondate);
				callrecord.setFieldValue('company',company);
				callrecord.setFieldValue('status','SCHEDULED');
				callrecord.setFieldValue('phone',phone);
				callrecord.setFieldValue('message','Scheduled Call Back (Wrong Number previously)');				

				taskrecord.setFieldValue('title', tasktitle);
				taskrecord.setFieldValue('startdate',nextactiondate);
				taskrecord.setFieldValue('company',company);
				// taskrecord.setFieldValue('status','NOTSTARTED');
				taskrecord.setFieldValue('message','Find correct number.');				


				id = nlapiSubmitRecord(callrecord, true);	
				
				id = nlapiSubmitRecord(taskrecord, true);

				break;

			case '4':

				var tasktitle = companyname + ': Send Email';
				var calltitle = companyname + ': Follow up call';
				var taskrecord = nlapiCreateRecord('task');
				var callrecord = nlapiCreateRecord('phonecall');
				var phone = nlapiGetFieldValue('phone');				

				callrecord.setFieldValue('title', calltitle);
				callrecord.setFieldValue('startdate',nextactiondate);
				callrecord.setFieldValue('company',company);
				callrecord.setFieldValue('status','SCHEDULED');
				callrecord.setFieldValue('phone',phone);
				callrecord.setFieldValue('message','Scheduled Follow Up (E-mail Sent)');				

				taskrecord.setFieldValue('title', tasktitle);
				taskrecord.setFieldValue('startdate',nextactiondate);
				taskrecord.setFieldValue('company',company);
				taskrecord.setFieldValue('status','NOT STARTED');
				taskrecord.setFieldValue('message','Send E-mail.');				


				id = nlapiSubmitRecord(callrecord, true);	
				
				id = nlapiSubmitRecord(taskrecord, true);

				break;

			case '5':
				var calltitle = companyname + ': Call New Contact';
				var record = nlapiCreateRecord('phonecall');
				var phone = nlapiGetFieldValue('phone');				

				record.setFieldValue('title', calltitle);
				record.setFieldValue('startdate',nextactiondate);
				record.setFieldValue('company',company);
				record.setFieldValue('status','SCHEDULED');
				record.setFieldValue('phone',phone);
				record.setFieldValue('message','Scheduled call to new contact. (Referred to new contact in previous call).');				

				id = nlapiSubmitRecord(record, true);	
				
				var a = new Array();
				a['User-Agent-x'] = 'SuiteScript-Call';
				var newcontacturl = nlapiResolveURL('RECORD','contact');			
				nlapiRequestURL(newcontacturl, null, a, null);

				break;






		} //switch
	
	} //if

} //function


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
		
		alert(outcome);
		alert(company);

		if (outcome != null)
		{
	

			switch (outcome)
			{


				case 1:
				nlapiSetFieldValue('message','Called ý Left Message ý Action: Log Call, Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (LM)',false);
				break;

				case 2:
				nlapiSetFieldValue('message','Called ý Not Available/No Answer ý Action: Log Call, Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (NA)',false);
				break;

				case 3:
				nlapiSetFieldValue('message','Called ý Wrong Number ý Action: Log Call, Schedule Task (find right number),Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (WN)',false);
				break;

				case 4:
				nlapiSetFieldValue('message','Called ý Send email ý Action: Schedule Task, Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (SE)',false);
				break;

				case 5:
				nlapiSetFieldValue('message','Called ý Alternate Contact Referral ý Action: Log Call, Add new contact, Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (ACR)',false);
				break;

				case 6:
				nlapiSetFieldValue('message','Called ý Possible Interest - Action: Schedule Task, Schedule Call Back',false);
				nlapiSetFieldValue('title', company + ' (SUS)',false);
				break;

				case 7:
				nlapiSetFieldValue('message','Called ý No Interest - Action: Log Call, Change Lead Status (Lost); (request referral)',false);
				nlapiSetFieldValue('title', company + ' (NI)',false);
				break;

				case 8:
				nlapiSetFieldValue('message','Called ý Lead Qualified ý Action: Log Call, Change Lead Status, Enter APC ID Number, Schedule Task or Event (Follow up Call, Demo, Webex, Info)',false);
				nlapiSetFieldValue('title', company + ' (QUAL)',false);
				break;
				
				case 9:
				nlapiSetFieldValue('message','Called ý Prospect ý Action: Log Call, Change Lead Status, Verify APC ID Number, Create Opportunity, Schedule Task or Event (Follow up Call, Demo, Webex, Info)',false);
				nlapiSetFieldValue('title', company + ' (PRO)',false);
				break;

				case 10:
				nlapiSetFieldValue('message','Called ý Customer ý Action: Log Call, Change Lead Status, Attach Order',false);
				nlapiSetFieldValue('title', company + ' (CUS)',false);
				break;


			} //switch

			nlapiSetFieldValue(status,'Completed',false);



		} //if


	} //if


} //function

function checkProjectManager()
{
	
	//var siRecord = nlapiLoadRecord('salesorder', '1');
	var siPrMgr = nlapiGetFieldValue('custbody_projectmanager');
	var siPrMgrText = nlapiGetFieldText('custbody_projectmanager');
	
	alert(siPrMgr);
	alert(siPrMgr.length);	
	alert(siPrMgrText);
	alert(siPrMgrText.length);
	if (siPrMgr == 0) {
		var bContinue = confirm('You have not selected a Project Manager.\n\nPress OK to continue WITHOUT selecting one, or press Cancel to select one.');
		
		if (bContinue) {
		//Do nothing
		alert('Ignoring the fact it is incorrect...');
		}
		else {
		//Cancel the save
		alert('Cancelling save...');
		nlapiCreateError('Project Manager','You must select a Project Manager','T');
		}
	}
	else
	{
		alert('Code to send email to Project Manager.......');
		
	}

	
}

function emailProjectManager()
{
	//Find the email address associated with the Project Manager selected in the Project Manager list...
	alert('Emailing Project Manager...');
	//Email them to tell them they have been assigned an
	
}

function pageInit(type)
{
	
}


function fieldChanged(type,name,linenum)
{
	switch(name) 
	{
		case "custpage_pr_lm_ess_msg_upcoming_show":
			
		var disableFieldBool = (nlapiGetFieldValue("custpage_pr_lm_ess_msg_upcoming_show") != "T");
		
		nlapiDisableField("custpage_pr_lm_ess_msg_upcoming",disableFieldBool);
		
		break;

	}
}

function validateDelete(type)
{
	var deleteBool = true;
	
	if(type == "custpage_leavetypes" || type == "custpage_accrualrates" || type == "custpage_employee")
	{
		alert('You do not have permission to delete this record.');
		deleteBool = false;
	}
	
 	return deleteBool;
}

function validateInsert(type)
{
	var insertBool = true;
	
	if(type == "custpage_leavetypes" || type == "custpage_accrualrates" || type == "custpage_employee")
	{
		alert('You do not have permission to insert records.');
		insertBool = false;
	}
	
 	return insertBool;	
}


function setSubsidiaryAndNext(subsidiaryId)
{
	nlapiSetFieldValue("custpage_subsidiary",subsidiaryId);
	document.getElementById("next").click();
}
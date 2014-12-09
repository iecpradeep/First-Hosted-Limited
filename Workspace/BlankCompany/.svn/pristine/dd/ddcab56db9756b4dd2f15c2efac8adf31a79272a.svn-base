function prPageInit(type)
{
	nlapiDisableField("name",true);	
}

function prFieldChanged(type, fieldname, linenum)
{
	switch(fieldname)
	{
		case "custrecord_pr_pp_taxyear":
		
		setProcessName();
		
		break;
		case "custpage_subsidiary":
		
		setProcessName();
		
		break;		
	}
}


function prSaveRecord()
{
	return(true);	
}


function setProcessName()
{
	var nameStr = "Summary Process Year End " + nlapiGetFieldText("custrecord_pr_pp_taxyear");
	var subsidiaryFullStr = nlapiGetFieldText("custpage_subsidiary");
	
	if(subsidiaryFullStr != null && subsidiaryFullStr != "")
	{
		var subIndex = subsidiaryFullStr.lastIndexOf(":");
		var subsidiaryStr = (subIndex != -1) ? subsidiaryFullStr.substr(subIndex + 2) : subsidiaryFullStr;
		
		nameStr += " (" + subsidiaryStr + ")";
	}

	nlapiSetFieldValue("name",nameStr);
}

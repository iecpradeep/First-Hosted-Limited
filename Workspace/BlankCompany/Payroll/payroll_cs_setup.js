function fieldChanged(type,name,linenum)
{
	if(type == "custpage_sublistworkcomp" && name=="name")
	{
		var lineCountInt = nlapiGetLineItemCount("custpage_sublistworkcomp");
		
		if(lineCountInt == 0)
		{
			nlapiSetCurrentLineItemValue("custpage_sublistworkcomp","custpage_default","T",false,false);
		}
	}
	
	if(type == "custpage_sublistworkcomp" && name=="custpage_default")
	{
		var isDefaultBool = (nlapiGetCurrentLineItemValue("custpage_sublistworkcomp","custpage_default") == "T");
		
		if(isDefaultBool)
		{
			var lineCountInt = nlapiGetLineItemCount("custpage_sublistworkcomp");
			
			for(var i=1; i <= lineCountInt; i++)
			{
				if(i != parseInt(linenum))
				{
					nlapiSetLineItemValue("custpage_sublistworkcomp","custpage_default",i,"F",false);	
				}
			}
		}	
	}
	
	if(name == "custpage_subsidiary")
	{
		var subId = nlapiGetFieldValue("custpage_subsidiary");

		if(isSubConfiguredArr[subId]["configured"])	
		{
			nlapiSetFieldValue("custpage_setuptype","update");
			nlapiSetFieldValue("custpage_configfrom",subId,false);
			nlapiDisableField("custpage_configfrom",true);
		}
		else
		{
			nlapiSetFieldValue("custpage_setuptype","create");
			nlapiSetFieldValue("custpage_configfrom","default",false);	
			nlapiDisableField("custpage_configfrom",false);
		}
		
		nlapiSetFieldValue("custpage_pr_cmp_default_country",isSubConfiguredArr[subId]["countryid"]);			
	}
	
	if(name == "custpage_configfrom")
	{
		var fromId = nlapiGetFieldValue("custpage_configfrom");
		nlapiSetFieldValue("custpage_pr_cmp_default_country",isSubConfiguredArr[fromId]["countryid"]);
	}

    if(name == 'custpage_hmrc_passchange')
    {
        nlapiSetFieldDisabled('custpage_hmrc_taxclear',(nlapiGetFieldValue(name) != 'T'));
    }

    if(name == 'custpage_hmrc_taxclear')
    {
        var plainStr = nlapiGetFieldValue('custpage_hmrc_taxclear').toLowerCase();
        nlapiSetFieldValue('custpage_pr_cfg_ukhmrc_taxpass',b64_md5(plainStr));
    }
}


function validateField(type,name,linenum)
{
	var validateBool = true;
	
	
	if (type == "custpage_sublistworkcomp" && name == "custpage_default") 
	{
		var valueStr = nlapiGetCurrentLineItemValue("custpage_sublistworkcomp", "custpage_default");
		if(valueStr == "F")
		{
			validateBool = false;
		}					
	}		
	
	if(name == "custpage_pr_reg_supportlog" && nlapiGetFieldValue("custpage_pr_reg_supportlog") == "F")
	{
		validateBool = confirm("Are you sure you wish to disable centralised error logging? by disabling this feature we will not be able to proactively diagnose potential configuration problems. If you still wish to disable this feature click yes.",false);
	}
	
	return(validateBool);
}


function validateDelete(type)
{
	var deleteBool = true;
	
	if(type == "compsubtype")
	{
		alert('To disable a component subtype check the inactive column.');
		deleteBool = false;
	}
	
	return deleteBool;
}


function validateInsert(type)
{
	var insertBool = true;
	
	if(type == "compsubtype")
	{
		insertBool = false;		
	}
	
	return insertBool;
}

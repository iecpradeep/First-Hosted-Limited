function payrollSaveRecord()
{
	var saveRecordBool = true;
	var countInt = getCheckCount("custpage_listleave","custpage_sel");
	var isRefreshBool = nlapiGetFieldValue("custpage_refresh") == "T";

	if(!isRefreshBool && isNullOrEmpty(nlapiGetFieldValue("custpage_actiontype")))
	{
		// when clicking save its not possible to set a field value until the save record call
		// if the refresh checkbox has not been checked and action is empty (decline sets action) set to approved
		nlapiSetFieldValue("custpage_actiontype",LEAVEREQ_STATUS_APPROVED); 
	}
	
	if(!isRefreshBool && countInt == 0)
	{
		saveRecordBool = false;
		alert("Please select one or more leave requests before proceeding.");
	}
	else
	{
		// display a confirm warning if one or more leave requests require medical certificate ask for confirmation
		var reqMedCertBool = false;
		var lineCountInt = nlapiGetLineItemCount("custpage_listleave");
		
		for(var i=1; i <= lineCountInt; i++)
		{
			if(nlapiGetLineItemValue("custpage_listleave","custpage_sel",i) == "T" && nlapiGetLineItemValue("custpage_listleave","custrecord_pr_lr_provide_document",i) == "T")
			{
				reqMedCertBool = true;
				break;
			}
		}
		
		if(reqMedCertBool)
		{
			saveRecordBool = confirm("One or more of the selected leave requests require medical certificates. Please click OK to confirm you have received the corresponding certificates.");
		}
	}
		
	if(!saveRecordBool)
	{
		// clear the action type if save is not occurring.
		nlapiSetFieldValue("custpage_actiontype","");	
	}
	
	return(saveRecordBool);
}


function getCheckCount(subListId,checkFieldId)
{
	var countInt = nlapiGetLineItemCount(subListId);
	var checkCountInt = 0;
	
	for(var i=1; i <= countInt; i++)
	{
		if(nlapiGetLineItemValue(subListId,checkFieldId,i) == "T")
		{
			checkCountInt++;	
		}
	}	
	
	return(checkCountInt);
}



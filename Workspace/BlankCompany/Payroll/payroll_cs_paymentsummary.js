function prFieldChanged(type, name, linenum)
{
	switch(name)
	{
		case "custrecord_pr_es_box_5":
		
		var valueStr = nlapiGetFieldValue("custrecord_pr_es_box_5");
		
		// if the value is empty
		if(valueStr != "" && valueStr != null)
		{
			alert("Please enter a payment type R for redundancy and T for terminate");				
		}
		else
		{
			nlapiSetFieldValue("custrecord_pr_es_box_5type","");
		}
		
		break;
	}	
}

function prValidateField(type,name, linenum)
{
	var isValidBool = true;
	
	switch(name)
	{
		case "custrecord_pr_es_box_5type":

		var typeStr = nlapiGetFieldValue("custrecord_pr_es_box_5type");
		
		if(typeStr != "" && typeStr != "R" && typeStr != "T")
		{
			alert("Please enter R for redundancy or T for termination.");
			isValidBool = false;		
		}
		
		break;
	}
	
	return(isValidBool);
}


function prSaveRecord()
{
	var saveRecordBool = true;
	
	var sumPaymentA = nlapiGetFieldValue("custrecord_pr_es_box_5");
	var sumPaymentAType = nlapiGetFieldValue("custrecord_pr_es_box_5type");

	if(!isNullOrEmpty(sumPaymentA) && isNullOrEmpty(sumPaymentAType))
	{
		alert("A Lump sum payment A cannot be entered without a type please clear the payment or enter a type value and resubmit.");
		saveRecordBool = false;
	}
	
	return(saveRecordBool);
}

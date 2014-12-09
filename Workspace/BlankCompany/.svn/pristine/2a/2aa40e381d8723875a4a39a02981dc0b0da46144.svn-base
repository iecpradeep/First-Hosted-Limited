// disallow delete 


function validateDelete(type)
{
	var deleteBool = true;
	
	if(type == "eftdetail")
	{
		alert('To disable a bank account record check the inactive column.');
		deleteBool = false;
	}
	
	return deleteBool;
}


function validateField(type,name,linenum)
{
	var validateBool = true;

	if(type == "eftdetail")
	{
		var valueStr = nlapiGetCurrentLineItemValue(type,name);
		
		switch(name)
		{
		case "custrecord_pr_ebd_bank_code":
		
		if(!isNullOrEmpty(valueStr) && !/^[A-Z]{3}$/i.test(valueStr))
		{
			alert("The bank code must comprise of 3 letters.");
			validateBool = false;
		}
		
		// field must ba 3 digit code comprising of letters
			
		break;
		case "custrecord_pr_ebd_companyid":
		
		// Must be User Identification Number which is allocated by APCA. Must be numeric, right justified, zero filled.
		// not always populated (default to 000000)
		
		if(!isNullOrEmpty(valueStr) && !/^\d{6}$/.test(valueStr))
		{
			alert("The company id must be 6 digits long, if you do not have a company id enter 000000.");
			validateBool = false;
		}
			
		break;
		case "custrecord_pr_ebd_companyname":
			
		// name of remitter (26 characters) A-Z space only.
		if(!isNullOrEmpty(valueStr) && (!/^[A-Z0-9 ]*$/i.test(valueStr) || valueStr.length > 26))
		{
			alert("Company name must contain only alphanumeric characters and be up to 26 characters long.");
			validateBool = false;			
		}
		
		break;
		case "custrecord_pr_ebd_account_bsb":
		
		if(!isNullOrEmpty(valueStr) && !/^\d{6}$/.test(valueStr))
		{
			alert("The BSB code must be be a 6 digit number entered without hyphens");
			validateBool = false;			
		}
			
		break;
		case "custrecord_pr_ebd_account_number":
			
		if(!isNullOrEmpty(valueStr) && !/^\d{5,9}$/.test(valueStr))
		{
			alert("The account number must be between 5 and 9 digits.");
			validateBool = false;			
		}
		break;
		}
	}
	
	return validateBool;
}

function saveRecord()
{
	var saveRecordBool = true;
	
	if(nlapiGetLineItemCount("eftdetail") > 0 && isNullOrEmpty(nlapiGetFieldValue("custpage_pr_cfg_eftfolder")))
	{
		alert("Please select an EFT directory for the bank details entered");
		saveRecordBool = false;
	}
	
	return saveRecordBool;
}
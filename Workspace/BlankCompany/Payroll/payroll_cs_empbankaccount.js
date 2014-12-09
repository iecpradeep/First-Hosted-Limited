var prType = "";
var EMP_BANKACCOUNT_TYPE_PRIMARY = "1";
var EMP_BANKACCOUNT_TYPE_SECONDARY = "2";
var prMaxAccountInt = 8;
var prIsPrimaryBool = false;
var prIsInactiveBool = false;
var prPrimaryId = null;

function prPageInit(type)
{
	prType = type;
	
	if(type != "create")
	{
		prIsPrimaryBool = nlapiGetFieldValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_PRIMARY;	
		prIsInactiveBool = nlapiGetFieldValue("isinactive") == "T";
	}
}

function prSaveRecord()
{
	var saveRecordBool = true;
	
	if(!isNullOrEmpty(nlapiGetFieldValue("custrecord_pr_eba_bsb_number")) && !isNullOrEmpty(nlapiGetFieldValue("custrecord_pr_eba_account_number")))
	{
		if(prType == "create")
		{
			// if there are already 3 active accounts display a warning.
			existingCountInt = getExistingActiveAccounts(nlapiGetFieldValue("custrecord_pr_eba_employee"),null);
	
			if(existingCountInt >= prMaxAccountInt && nlapiGetFieldValue("isinactive") != "T")
			{
				alert("Only " + prMaxAccountInt + " Employee Bank Accounts can be active at any one time, to proceed either create this account inactive or edit an existing account and make it inactive.");
				saveRecordBool = false;
			}

			if(saveRecordBool)
			{
				if(existingCountInt == 0)
				{
					// if there are no existing records set type to primary.
					nlapiSetFieldValue("custrecord_pr_eba_status",EMP_BANKACCOUNT_TYPE_PRIMARY);
					nlapiSetFieldValue("custrecord_pr_eba_amount",0.00);
				}
				else
				{
					if(prIsPrimaryBool && nlapiGetFieldValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_SECONDARY)
					{
						alert("This account cannot be set to secondary directly, to perform this change make another active account primary and save");
						saveRecordBool = false;	
					}
					
					if(saveRecordBool && !prIsPrimaryBool && nlapiGetFieldValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_PRIMARY)
					{
						saveRecordBool = confirm("Are you sure you wish to make this account primary, by doing so the existing primary account will be made inactive, click OK to proceed",false);
						
						if(saveRecordBool)
						{
							nlapiSetFieldValue("custrecord_pr_eba_amount",0.00);
							nlapiSubmitField("customrecord_pr_employee_bank_acc",prPrimaryId,["isinactive","custrecord_pr_eba_end_date"],["T",nlapiDateToString(new Date())]);
						}
					}
				}
				
			}
			
		}
		else
		{
			if(prIsPrimaryBool && nlapiGetFieldValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_SECONDARY)
			{
				alert("This account cannot be set to secondary directly, to perform this change make another active account primary and save");
				saveRecordBool = false;	
			}
							
			// only thing we don't allow is to set this record to inactive if its type is primary.
			if(saveRecordBool && nlapiGetFieldValue("isinactive") == "T" && prIsPrimaryBool)
			{
				alert("A primary account cannot be made inactive, edit or create a new bank account and set that as primary before setting this account inactive.");
				saveRecordBool = false;	
			}

			var existingCountInt = getExistingActiveAccounts(nlapiGetFieldValue("custrecord_pr_eba_employee"),nlapiGetRecordId());			

			if(saveRecordBool && prIsInactiveBool && nlapiGetFieldValue("isinactive") == "F" && existingCountInt >= prMaxAccountInt)
			{
				alert("There are already " + prMaxAccountInt + " bank account details active, please inactivate one before activating this record.");
				saveRecordBool = false;
			}
			
			if(saveRecordBool && !prIsPrimaryBool && nlapiGetFieldValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_PRIMARY && existingCountInt > 0)
			{
				saveRecordBool = confirm("Are you sure you wish to make this account primary, by doing so the existing primary account will be made secondary, click OK to proceed",false);
				
				if(saveRecordBool)
				{
					nlapiSetFieldValue("custrecord_pr_eba_amount",0.00);
					nlapiSubmitField("customrecord_pr_employee_bank_acc",prPrimaryId,["isinactive","custrecord_pr_eba_end_date"],["T",nlapiDateToString(new Date())]);
				}
			}

		}
		
	}
	
	return(saveRecordBool);
}


/**
 * Function checks the number of active bank accounts
 * @param {Object} employeeId
 */
function getExistingActiveAccounts(employeeId,currRecordId)
{
	//alert("getExistingActiveAccounts: " + employeeId + ",existing: " + currRecordId);

	var filtersArr = [
		new nlobjSearchFilter("custrecord_pr_eba_employee",null,"anyof",employeeId),
		new nlobjSearchFilter("isinactive",null,"is","F")
	];
	
	var columnsArr = [
		new nlobjSearchColumn("custrecord_pr_eba_status")
	];
	
	if(!isNullOrEmpty(currRecordId))
	{
		filtersArr.push(new nlobjSearchFilter("internalid",null,"noneof",currRecordId));
	}
	
	var searchResults = nlapiSearchRecord("customrecord_pr_employee_bank_acc",null,filtersArr,columnsArr);
	
	for(var i=0; !isNullOrEmpty(searchResults) && i < searchResults.length; i++)
	{
		if(searchResults[i].getValue("custrecord_pr_eba_status") == EMP_BANKACCOUNT_TYPE_PRIMARY)
		{
			prPrimaryId = searchResults[i].getId();
		}
	}
		
	return((!isNullOrEmpty(searchResults) && searchResults.length > 0) ? searchResults.length : 0);
}

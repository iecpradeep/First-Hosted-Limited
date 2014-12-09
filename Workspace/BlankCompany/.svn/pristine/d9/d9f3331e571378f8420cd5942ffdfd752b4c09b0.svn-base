
function postPayrollFieldChanged(type, name, linenum)
{
	if (name == 'custpage_pay_date')
	{
		custpage_post_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
		
}

function searchForPayruns()
{
	nlapiSetFieldValue('custpage_refresh', 'T');
	custpage_post_payslipsMarkAll(false);
	document.main_form.submit();
}

function updatePostingDate()
{
	var postDate = nlapiGetFieldValue('custpage_postdate');
	if (!isNullOrEmpty(postDate))
	{
		updateSublistValues('custpage_post_payslips','custrecord_pr_pr_end_date',postDate,null,null,true,false)
	}
	else
	{
		alert('Set the update post date');
	}
}

function saveRecord()
{
	var saveRecordBool = true;
	
	if(nlapiGetFieldValue("custpage_refresh") == "F")	
	{
		var markedIndexArr = [];
		// lets check one or more records has been checked.
		payslipCount = nlapiGetLineItemCount("custpage_post_payslips");

		for (var i = 1; i <= payslipCount; i++) 
		{
			var checked = nlapiGetLineItemValue('custpage_post_payslips', 'checked', i) == 'T'
			if (checked) 
			{
				markedIndexArr.push(i);
			}
		}		
		
		if(markedIndexArr.length == 0)
		{
			alert("Please ensure one or more payslips are selected for posting before proceeding.");
			saveRecordBool = false;
		}
	}
	return saveRecordBool;
}


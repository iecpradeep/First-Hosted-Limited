function prPageInit(type)
{
	prRecalc();
}

function prFieldChanged(type, name, linenum)
{
	switch(name)
	{
		case "custpage_payrunid":
		
		//custpage_create_payslipsMarkAll(false);
		//nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);		
		document.main_form.submit();		
		
		break;
	}
}

function prRecalc()
{
	// iterate over list and sum the checked records
	var countInt = nlapiGetLineItemCount("custpage_payslip");
	var totalAmt = 0.00;
	var totalCnt = 0;
	
	for(var i=1; i <= countInt; i++)
	{
		if(nlapiGetLineItemValue("custpage_payslip","custpage_checked",i) == "T")
		{
			totalAmt += parseFloat(nlapiGetLineItemValue("custpage_payslip","custpage_amount",i));
			totalCnt++;
		}
	}
	
	nlapiSetFieldValue("custpage_total_amount",nlapiFormatCurrency(totalAmt));
	nlapiSetFieldValue("custpage_total_payslip",totalCnt);
}

function prSaveRecord()
{
	var returnBool = true;
	var previewBool = nlapiGetFieldValue("custpage_eft_preview") == "T";
	var lineCountInt = nlapiGetLineItemCount("custpage_payslip");
	var payslipCountInt = parseFloat(nlapiGetFieldValue("custpage_total_payslip"));
	
	if(nlapiGetFieldValue("custpage_total_payslip") == 0)
	{
		returnBool = false;
		alert("Please select one or more payslips to generate");
	}
	
	if(returnBool)
	{
		// iterate over each line and check bank details exist (if they don't warn for each individual)
		var messageArr = [];
		var indexArr = [];
		for(var i=1; i <= lineCountInt; i++)
		{
			if(nlapiGetLineItemValue("custpage_payslip","custpage_checked",i) == "T" && parseInt(nlapiGetLineItemValue("custpage_payslip","custpage_paysplit",i)) == 0)
			{
				messageArr.push(nlapiGetLineItemValue("custpage_payslip","custpage_payeename",i));
				indexArr.push(i);
			}
		}
		
		if(messageArr.length > 0)
		{
			var uncheckCountInt = indexArr.length;
			var allowUnCheckBool = (payslipCountInt - uncheckCountInt) > 0;
			
			if(allowUnCheckBool)
			{
				// offer the user to uncheck the employees that don't have details.
				if(confirm("One or more of the employees selected does not have bank details configured (" + messageArr.join(", ") + ") to exclude these employees and proceed, click OK, otherwise update the employee records and reload."))
				{
					// lets uncheck each one.
					for(var i=0; i < indexArr.length; i++)
					{
						nlapiSetLineItemValue("custpage_payslip","custpage_checked",indexArr[i],"F");
					}
				}
				else
				{
					returnBool = false;
				}
				
			}
			else
			{
				// display alert.
				alert("None of the employees selected have bank details configured, please update the employee records and reload.");
				returnBool = false;
			}
		}
	}
	
	if(returnBool)
	{
		// no errors lets explain whats going on to the screen
		if(previewBool)
		{
			alert("You have selected to preview the EFT output which will display on screen.");
		}
		else
		{
			alert("This process only creates an EFT file to ensure timely payment of employees, you should still complete the normal payrun process to ensure the approval and posting steps are completed. By generating this file you are not completing your payrun.");
		}
	}
		
	return returnBool;
}

function prBackHandler()
{
	// get the payrun id and redirect to it.
	var payRunId = nlapiGetFieldValue("custpage_payrunid");
	setWindowChanged(window, false);		
	
	document.location=nlapiResolveURL("RECORD","customrecord_pr_pay_run",payRunId);

}
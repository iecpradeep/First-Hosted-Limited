
function variableEntrySave()
{
	
	var cancel = confirm("Are you sure you want to submit the variable components entered?") == false;
	if (cancel)
	{
		return false;
	}
	
	
	calcAmount();
	var saveRecordBool = true;
	var lineCheckedBool = false;

	// if one or more lines are selected, or there are no components to select proceed
	// otherwise display a warning confirmation.
	var lineCount = nlapiGetLineItemCount("custpage_entervariable");
	
	for(var i=1; i <= lineCount; i++)
	{
		if(nlapiGetLineItemValue("custpage_entervariable","custpage_checked",i) == "T")
		{
			lineCheckedBool = true;	
			break;
		}
	}
	
	if(lineCount > 0 && !lineCheckedBool)
	{
		saveRecordBool = confirm("You have not selected any components to process are you sure you wish to proceed?",false);
	}
	
	return(saveRecordBool);
}

function variableFieldChanged(type, fieldname, linenum)
{

	if (fieldname == 'custpage_empid')
	{
		custpage_enterallowancesMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_sort_field')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
		
	if (fieldname == 'custrecord_pr_pc_quantity' || fieldname == 'custrecord_pr_pc_rate')
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_quantity',linenum)); 
		var rate = setFloat(nlapiGetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_rate',linenum));
		var amount = 0.00;
		amount = qty * rate;
		nlapiSetCurrentLineItemValue('custpage_entervariable', 'custrecord_pr_pc_amount', amount);
	}
	if (fieldname == 'custpage_pay_run_id') 
	{
		custpage_entervariableMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
	
	
	
}

function calcAmount()
{
	
	var lineItemCount = nlapiGetLineItemCount('custpage_entervariable');
	
	for(var line=1; line<=lineItemCount; line++) 
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_quantity',line));
		var rate = setFloat(nlapiGetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_rate',line));
		var amount = setFloat(nlapiGetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_amount',line));
		if (amount == 0.00)
		{
			amount = qty * rate;
		}
		nlapiSetLineItemValue('custpage_entervariable', 'custrecord_pr_pc_amount', line, amount);
		
		
	}
}






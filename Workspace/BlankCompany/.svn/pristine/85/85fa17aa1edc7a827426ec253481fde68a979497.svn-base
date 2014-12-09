/*
 * $Id: payroll_cs_allowances.js 32 2010-07-05 14:25:39Z antonselfe $
 */

function allowanceEntrySave()
{
	// test comment
	calcAmount();
	return true;
}

function allowanceFieldChanged(type, fieldname, linenum)
{
	//alert(fieldname)
	if (fieldname == 'custpage_empid')
	{
		custpage_enterallowancesMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		document.main_form.submit();
	}
		
	if (fieldname == 'custrecord_pr_pc_quantity')
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_quantity',linenum)); 
		var rate = setFloat(nlapiGetLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_rate',linenum));
		var amount 
		amount = qty * rate
		nlapiSetCurrentLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_amount', amount);
	}
}

function calcAmount()
{
	
	var lineItemCount = nlapiGetLineItemCount('custpage_enterallowances');
	
	for(var line=1; line<=lineItemCount; line++) 
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_quantity',line));
		var rate = setFloat(nlapiGetLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_rate',line));
		var amount 
		amount = qty * rate;
		nlapiSetLineItemValue('custpage_enterallowances', 'custrecord_pr_pc_amount', line, amount);
	}
}






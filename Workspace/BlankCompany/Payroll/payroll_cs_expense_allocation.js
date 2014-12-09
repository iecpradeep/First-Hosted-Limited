
var summaryDataObj = {};

function allocationValidateField(type, fieldname, linenum)
{
	var returnValue = true;

	if (fieldname == 'custpage_allocation_cr') 
	{
		var allocationCredit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_cr'));
		var credit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_credit'));
		
		var oldAllocationCredit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_allocation_cr',linenum));
		//var credit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_credit',linenum));
		
		//alert('allocationCredit: ' + allocationCredit + ' oldAllocationCredit: ' + oldAllocationCredit + ' credit: ' + credit);
		
		if(allocationCredit > credit)
		{
			alert('You cannot allocate more than the posted amount of ' + credit);
			nlapiSetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_cr',oldAllocationCredit,false);
			returnValue = false;
		}
	}
	
	if (fieldname == 'custpage_allocation_dr') 
	{
		var allocationDebit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_dr'));
		var debit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_debit'));
		
		var oldAllocationDebit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_allocation_dr',linenum));
		//var debit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_debit',linenum));
		
		//alert('allocationDebit: ' + allocationDebit + ' oldAllocationDebit: ' + oldAllocationDebit + ' debit: ' + debit);
		
		if(allocationDebit > debit)
		{
			alert('You cannot allocate more than the time amount of ' + debit);
			nlapiSetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_dr',oldAllocationDebit,false);
			returnValue = false;
		}
	}
	return returnValue;
}
function allocationFieldChanged(type, fieldname, linenum)
{
	
	if (fieldname == 'custpage_pay_run_id')
	{
		//custpage_posted_detailsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_show_subtype')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_show_super')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_show_projectdetail')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_hide_emp')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_allocation_pct' || fieldname == 'custpage_allocation_cr' || fieldname == 'custpage_allocation_dr') 
	{
		//alert('summaryDataObj: ' + JSON.stringify(summaryDataObj));
		
		var showEmployee = nlapiGetFieldValue('') == 'F';
		var lineData = summaryDataObj[linenum];
		//alert(JSON.stringify(lineData));
		
		if (fieldname == 'custpage_allocation_pct')
		{
			var entityId = nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_entity_id');
			//alert('entityId - ' + entityId);
			
			nlapiSetFieldValue('custpage_auto_balance','F');
			
			var accountId = nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_account');
			var empId = nlapiGetCurrentLineItemValue('custpage_employee_id', 'custpage_employee');
			var percentage = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_pct'));
			percentage = setFloat(percentage/100);
			var lineDebit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_debit'));
			var linkedLine = lineData.linkedline
			if(lineDebit > 0.00)
			{
				var allocationDr = setFloat((percentage*debit),2);
				nlapiSetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_dr',allocationDr);
				//alert('set allocationDr: ' + allocationDr + ' linked line: ' + linkedLine)
				if(!isNullOrEmpty(linkedLine))
				{
					nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_cr',linkedLine,allocationDr);
				}
			}
			var lineCredit = setFloat(nlapiGetCurrentLineItemValue('custpage_allocation', 'custpage_credit'));
			//alert('lineCredit: ' + lineCredit + ' percentage: ' + percentage);
			
			if(lineCredit > 0.00)
			{
				var allocationCr = setFloat((percentage*lineCredit),2);
				nlapiSetCurrentLineItemValue('custpage_allocation', 'custpage_allocation_cr',allocationCr,false);
				//alert('set allocationCr: ' + allocationCr + ' linked line: ' + linkedLine)
				if(!isNullOrEmpty(linkedLine))
				{
					nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_dr',linkedLine,allocationCr);
				}
			}
			
			
			var changedValue = nlapiGetLineItemValue('custpage_allocation',fieldname,linenum)
				//set opposite value to the same so it balances
				var setField = fieldname == 'custpage_allocation_cr' ? 'custpage_allocation_dr' : 'custpage_allocation_cr';
				
				nlapiSetLineItemValue('custpage_allocation',setField,setLine,changedValue);
			
			//alert('percentage: ' + percentage + ' credit: ' + credit + ' allocationCr: ' + allocationCr);
		}
		
		var autoBalance = nlapiGetFieldValue('custpage_auto_balance') == 'T';
		//alert('autoBalance: ' + autoBalance);
		if(!isNullOrEmpty(lineData))
		{
			var isProject = lineData.type == 'project';
			if(isProject)
			{
				var changedValue = nlapiGetLineItemValue('custpage_allocation',fieldname,linenum)
				//set opposite value to the same so it balances
				var setField = fieldname == 'custpage_allocation_cr' ? 'custpage_allocation_dr' : 'custpage_allocation_cr';
				var setLine = lineData.linkedline
				nlapiSetLineItemValue('custpage_allocation',setField,setLine,changedValue);
			}
			var summaryLine = lineData.summaryLine;
			var timeLinesArr =  lineData.timeLines
			var expLinesArr = lineData.expLines;
			var projectLinesArr = lineData.projectLines;
			//alert('projectLinesArr: ' + JSON.stringify(projectLinesArr));
			var timeDebit = 0.00;
			var expenseCredit = 0.00;
			for (var i = 0; !isNullOrEmpty(timeLinesArr) && i < timeLinesArr.length; i++) 
			{
				var getLine = timeLinesArr[i];
				var timeLineDebit = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_dr',getLine));
				timeDebit = setFloat((timeDebit + timeLineDebit),2);
			}
			for (var i = 0; !isNullOrEmpty(expLinesArr) && i < expLinesArr.length; i++) 
			{
				var getLine = expLinesArr[i];
				var expLineCredit = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_cr',getLine));
				expenseCredit = setFloat((expenseCredit + expLineCredit),2);
			}
			var postingDiff = setFloat((timeDebit - expenseCredit),2);
			//alert('timeDebit: ' + timeDebit + ' expenseCredit: ' + expenseCredit + ' postingDiff: ' + postingDiff);
			
			//set new posting amounts and notice if out of balance;
			var balanceMsg = 0.00;
			var totalCredit  = summaryDataObj[summaryLine].credit;
			var totalDebit = summaryDataObj[summaryLine].debit;
			
			if(autoBalance)
			{
				autoBalance(postingDiff,timeDebit,expenseCredit,expLinesArr);
			}
			else if(Math.abs(postingDiff) > 0)
			{
				balanceMsg = postingDiff;
				nlapiSetLineItemValue('custpage_allocation', 'custpage_balance',summaryLine,balanceMsg,false);
			}
			else
			{
				nlapiSetLineItemValue('custpage_allocation', 'custpage_balance',summaryLine,balanceMsg,false);
			}
			
			recalculateSummary(expLinesArr,timeLinesArr,projectLinesArr,summaryLine);
			//reset total balance
			resetTotal();
		}
	}
}

function allocationPageInit()
{
    var jsonChunkInt = parseInt(nlapiGetFieldValue('custpage_jsonchunkno'),10);
    var jsonChunkStr = '';
   for(var i=0; i < jsonChunkInt; i++)
   {
       jsonChunkStr += nlapiGetFieldValue("custpage_json_" + i);
   }
	
	if(!isNullOrEmpty(jsonChunkStr) && jsonChunkStr != '{}')
	{
		summaryDataObj = JSON.parse(jsonChunkStr);
	}
	var lineCount = nlapiGetLineItemCount('custpage_allocation');
	for (var i = 1; i <= lineCount; i++) 
	{
		var credit = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_credit',i));
		var isSummaryLine = nlapiGetLineItemValue('custpage_allocation','custpage_summary',i) == 'T';
		if(credit > 0.00)
		{
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_dr',true,i)
		}
		else
		{
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_pct',true,i)
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_cr',true,i)
		}
		nlapiSetLineItemDisabled('custpage_allocation','custpage_balance',true,i)
		nlapiSetLineItemDisabled('custpage_allocation','custpage_debit',true,i)
		nlapiSetLineItemDisabled('custpage_allocation','custpage_credit',true,i)
		
		if(isSummaryLine)
		{
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_pct',true,i)
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_cr',true,i)
		}
		
		var isProjectLine = summaryDataObj[i].type == 'project';
		if (isProjectLine)
		{
			nlapiSetLineItemDisabled('custpage_allocation','custpage_allocation_pct',true,i)
		}
		
	}
	//nlapiDisableLineItemField('custpage_allocation','custpage_balance',true);
	
	
}

function autoBalance(postingDiff,timeDebit,expenseCredit,empExpLinesArr)
{
	if (Math.abs(postingDiff) > 0) 
	{
		// need to increase the credits (expense side)
		while (Math.abs(postingDiff) > 0) 
		{
			if(timeDebit > expenseCredit)
			{
				var rawAmountPerLine = setFloat(postingDiff/empExpLinesArr.length);
				var amountPerLine = rawAmountPerLine > 0.01 ? setFloat(rawAmountPerLine,2,'down'): 0.01;
			}
			else
			{
				var rawAmountPerLine = setFloat(postingDiff/empExpLinesArr.length)
				var amountPerLine = rawAmountPerLine < -0.01 ? setFloat(rawAmountPerLine,2,'down'): -0.01;
			}
			//alert('postingDiff: ' + postingDiff + ' rawAmountPerLine: ' + rawAmountPerLine + ' amountPerLine: ' + amountPerLine);
			for (var i = 0; !isNullOrEmpty(empExpLinesArr) && i < empExpLinesArr.length && Math.abs(postingDiff) > 0; i++) 
			{
				var getLine = empExpLinesArr[i];
				var expLineCredit = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_cr',getLine));
				var newCredit = setFloat((expLineCredit + amountPerLine),2);
				nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_cr',getLine,newCredit,false);
				postingDiff = setFloat((postingDiff - amountPerLine),2);
			}
		}
	}
}

function recalculateSummary(expLines,timeLines,projectLinesArr,summaryLine)
{
	//alert('recalculate:: expLines: ' + JSON.stringify(expLines) + ' timeLines: ' + JSON.stringify(timeLines) + ' projectLinesArr: ' + JSON.stringify(projectLinesArr) + ' summaryLine: ' + summaryLine);
	var totalDebit = 0.00;
	var totalCredit = 0.00;
	for (var i = 0; !isNullOrEmpty(expLines) && i < expLines.length; i++) 
	{
		var getLine = expLines[i];
		//alert('getLine: ' + getLine);
		var allCreditLine = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_cr',getLine));
		totalCredit = setFloat((totalCredit + allCreditLine),2);
		var lineCredit = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_credit',getLine));
		var percentageAllocation = setFloat((allCreditLine/lineCredit)* 100,2);
		nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_pct',getLine,percentageAllocation,false);
	}
	for (var i = 0; !isNullOrEmpty(timeLines) && i < timeLines.length; i++) 
	{
		var getLine = timeLines[i];
		var allDebitLine = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_dr',getLine));
		totalDebit = setFloat((totalDebit + allDebitLine),2);
	}
	
	for (var i = 0; !isNullOrEmpty(projectLinesArr) && i < projectLinesArr.length; i++) 
	{
		var getLine = projectLinesArr[i];
		var allDebitLine = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_dr',getLine));
		totalDebit = setFloat((totalDebit + allDebitLine),2);
		var allCreditLine = setFloat(nlapiGetLineItemValue('custpage_allocation','custpage_allocation_cr',getLine));
		totalCredit = setFloat((totalCredit + allCreditLine),2);
		//alert('projectLinesArr:: allDebitLine: ' + allDebitLine + ' totalDebit: ' + totalDebit + ' allCreditLine: ' + allCreditLine + ' totalCredit: ' + totalCredit);
	}
	nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_cr',summaryLine,totalCredit,false);
	nlapiSetLineItemValue('custpage_allocation', 'custpage_allocation_dr',summaryLine,totalDebit,false);
}

function resetTotal()
{
	//reset full journal balance
	//alert('resetTotal');
	var lineCount = nlapiGetLineItemCount('custpage_allocation');
	var totalAllocationCredit = 0.00;
	var totalAllocationDebit = 0.00;
	var outOfBalance = 0.00;
	for (var i = 1; i <= lineCount; i++) 
	{
		var isSummaryLine = nlapiGetLineItemValue('custpage_allocation','custpage_summary',i) == 'T';
		if(isSummaryLine)
		{
			// skip summary lines;
			continue;
		}
		var allCredit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_allocation_cr', i));
		var allDebit = setFloat(nlapiGetLineItemValue('custpage_allocation', 'custpage_allocation_dr', i));
		totalAllocationCredit = setFloat((totalAllocationCredit + allCredit));
		totalAllocationDebit = setFloat((totalAllocationDebit + allDebit));
		//alert('looping - line: ' + i + ' allCredit: ' + allCredit + ' allDebit: ' + allDebit + ' totalAllocationCredit: ' + totalAllocationCredit + ' totalAllocationDebit: ' + totalAllocationDebit)
	}
	outOfBalance = 	setFloat((totalAllocationDebit - totalAllocationCredit),2);
	//alert('resetTotal - outOfBalance: ' + outOfBalance)
	
	outOfBalance = Math.abs(outOfBalance) > 0.00 ? outOfBalance : "";
	nlapiSetFieldValue('custpage_out_balance',outOfBalance);
}

function allocationSave()
{
	var returnBool = true;
	var outOfBalanceAmt = nlapiGetFieldValue('custpage_out_balance');
	if(Math.abs(outOfBalanceAmt) > 0)
	{
		alert('You cannot create a journal as this transaction is out of balance by ' + outOfBalanceAmt + ' please correct and resubmit');
		returnBool = false ;
	}
	else
	{
		returnBool = confirm('Click OK to create the expense allocation journal for this payrun');
	}
	
	return returnBool;
}

function refreshpage()
{
	nlapiSetFieldValue('custpage_refresh', 'T');
	setWindowChanged(window, false);		
	document.main_form.submit();
}


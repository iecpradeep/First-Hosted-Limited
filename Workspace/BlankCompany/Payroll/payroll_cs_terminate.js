
function terminatePageInit()
{
	initPayroll();

    calcGross();
}

function terminateEntrySave()
{
	
	var saveRecordBool = true;
	var saveRecordBool = confirm("Are you sure you want to submit the components entered?");
	
	calcAmount();
    var country = nlapiGetFieldValue('custpage_country');
    if (country == PAYROLL_COUNTRY_NZ)
    {
        reCalc8pctGross();
    }

    // if one or more lines are selected, or there are no components to select proceed
	// otherwise display a warning confirmation.
	var lineCount = nlapiGetLineItemCount("custpage_enter_terminations");
	
	if(lineCount == -1)
	{
		saveRecordBool = confirm("You have not selected any components to process are you sure you wish to proceed?",false);
	}
	
	return saveRecordBool;
}

function terminateFieldChanged(type, fieldname, linenum)
{
	//alert ('linenum: ' + linenum) 
	if (fieldname == 'custpage_empid')
	{
		//custpage_enter_terminations(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
		
	if (fieldname == 'custrecord_pr_pc_quantity' || fieldname == 'custrecord_pr_pc_rate')
	{
		var qty = setFloat(nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_quantity'));
		//alert ('qty: ' + qty) 
		var rate = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_rate');
		//alert ('ratea: ' + rate) 
		var amount = 0.00;
		amount = qty * rate;
		//alert ('amount: ' + amount) 
		nlapiSetCurrentLineItemValue('custpage_enter_terminations', 'custpage_amount', amount);
		
		var leaveLoadingAmount = 0.00;
		var empLeaveLoading = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custpage_leave_loading') == 'T'; 
		var payRateTypeId = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_pcst');
		if(empLeaveLoading && payRateTypeId == (payroll.PCST.ANNUAL_LEAVE || payRateTypeId == payroll.PCST.UNUSED_ANNUAL_LEAVE))
		{
			var rate = setFloat(nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custpage_leave_loading_pct') / 100);
			leaveLoadingAmount =  amount *  rate;	
			
		}	
		nlapiSetCurrentLineItemValue('custpage_enter_terminations', 'custpage_leave_loading_amt',leaveLoadingAmount);	
		
	}
	if (fieldname == 'custpage_pay_run_id') 
	{
		//custpage_enter_terminationsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_fromdate') 
	{

        var payDate = nlapiGetFieldValue('custpage_pay_date');
        var payPeriod = nlapiGetFieldValue('custpage_pay_period');
        var payPeriodName = nlapiGetFieldText('custpage_pay_period');
        var payRunType = nlapiGetFieldValue('custpage_payrun_type');
        var payRunTypeName = nlapiGetFieldText('custpage_payrun_type');
        var fromDate = nlapiStringToDate(nlapiGetFieldValue('custpage_fromdate'));
        var toDateStr = nlapiGetFieldValue('custpage_todate');
        var resetDateBool = true;

        if(!isNullOrEmpty(nlapiGetFieldValue('custpage_fromdate')) && !isNullOrEmpty(payDate) && !isNullOrEmpty(toDateStr))
        {
            resetDateBool = confirm('Do you want to reset the pay date and termination date based on the pay period and the start date');
        }

        if(resetDateBool)
        {
            if (!isNullOrEmpty(fromDate && !isNullOrEmpty(payPeriod)))
            {
                switch (payPeriod)
                {
                    case PAYMONTHLY:
                        endDate = nlapiAddDays(nlapiAddMonths(fromDate, '1'), '-1');

                        break;
                    case PAYWEEKLY:
                        endDate = nlapiAddDays(fromDate, '6');

                        break;
                    case PAYBIWEEKLY:
                        endDate = nlapiAddDays(fromDate, '13');
                        break;

                }

                var fromDateStr = nlapiDateToString(fromDate);
                var toDateStr = nlapiDateToString(endDate);

                nlapiSetFieldValue('custpage_todate', toDateStr);
                nlapiSetFieldValue('custpage_pay_date', toDateStr);
            }
        }
        else
        {
            var country = nlapiGetFieldValue('custpage_country');
            if (country == PAYROLL_COUNTRY_NZ)
            {
                setWindowChanged(window, false);
                document.main_form.submit();
            }
        }
    }
	
	if (fieldname == 'custpage_todate') 
	{
        var toDate = nlapiGetFieldValue('custpage_todate');
        if(!isNullOrEmpty(toDate))
        {
            var updatePayDate = confirm('Do you want to set the pay date to the termination date');
            if(updatePayDate)
            {
                nlapiSetFieldValue('custpage_pay_date', toDate,false);
            }
        }

		nlapiSetFieldValue('custpage_refresh', 'T');
        setWindowChanged(window, false);
        document.main_form.submit();
    }

	/*if (fieldname == 'custpage_pay_date') 
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);		
		document.main_form.submit();
	}*/
	
	if (fieldname == 'custrecord_pr_pc_pcst') 
	{
		var subTypeId = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_pcst');
		var subTypeName = nlapiGetCurrentLineItemText('custpage_enter_terminations', 'custrecord_pr_pc_pcst');
		//alert(subTypeId)
		var typeId = nlapiLookupField('customrecord_pr_pcst',subTypeId,'custrecord_pr_pcst_pc_type');
		nlapiSetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_type', typeId);
		nlapiSetCurrentLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_description', subTypeName);

        var isDetailLine = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custpage_detail');
        if(isDetailLine == 'F')
        {

            nlapiSetCurrentLineItemValue('custpage_enter_terminations', 'custpage_detail', 'T');
            var detailLineArr = JSON.parse(nlapiGetFieldValue('custpage_detail_lines'));
            var newLineNo = parseInt(nlapiGetCurrentLineItemIndex('custpage_enter_terminations'));
            detailLineArr.push(newLineNo);
            var detailLineStr = JSON.stringify(detailLineArr);
            nlapiSetFieldValue('custpage_detail_lines',detailLineStr);
        }
    }
	
	if (fieldname == 'custpage_redundancy') 
	{
		var redundancyId = nlapiGetFieldValue('custpage_redundancy');
		if (!isNullOrEmpty(redundancyId))
		{
			//alert(redundancyId)
			var redundancyValuesArr = nlapiLookupField('customrecord_pr_redundancy_record',redundancyId,['custrecord_pr_rr_period_weeks','custrecord_pr_rr_tax_free_limit']);
			var defaultWeeks = redundancyValuesArr['custrecord_pr_rr_period_weeks'];
			if (!isNullOrEmpty(defaultWeeks))
			{
				nlapiSetFieldValue('custpage_weeks', defaultWeeks);
			}
			var taxFreeLimit = redundancyValuesArr['custrecord_pr_rr_tax_free_limit'];
			if (!isNullOrEmpty(taxFreeLimit))
			{
				nlapiSetFieldValue('custpage_tax_free', taxFreeLimit);
			}
		}
	}
	
	if (fieldname == 'custpage_manual_amounts')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);		
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_termination_reason')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);		
		document.main_form.submit();
	}
	
}

function calcAmount()
{
	
	var lineItemCount = nlapiGetLineItemCount('custpage_enter_terminations');
	
	for(var line=1; line<=lineItemCount; line++) 
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_quantity',line));
		//alert ('qty: ' + qty) 
		var rate = setFloat(nlapiGetLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_rate',line));
		//alert ('rate: ' + rate) 
		var amount = setFloat(nlapiGetLineItemValue('custpage_enter_terminations', 'custpage_amount',line));
		//alert ('amount: ' + amount) 
		if (amount == 0.00)
		{
			amount = qty * rate;
		}
		//alert ('amount: ' + amount) 
		nlapiSetLineItemValue('custpage_enter_terminations', 'custpage_amount', line, amount);
	}
}

function calcGross()
{

    var lineItemCount = nlapiGetLineItemCount('custpage_enter_terminations');
    var grossAmt = 0.00;

    for(var line=1; line<=lineItemCount; line++)
    {
        var amount = setFloat(nlapiGetLineItemValue('custpage_enter_terminations', 'custpage_amount',line));
        //alert ('amount: ' + amount)
        grossAmt = grossAmt + amount;

        //alert ('grossAmt: ' + grossAmt)
    }
    nlapiSetFieldValue('custpage_gross_amt',setFloat(grossAmt,2));
}


function reCalc8pctGross()
{
    var detailLineArr = JSON.parse(nlapiGetFieldValue('custpage_detail_lines'));
    if(!isNullOrEmpty(detailLineArr))
    {
        var summaryAmount = 0.00;
        var summaryLine = nlapiGetFieldValue('custpage_sum_line');
        if(!isNullOrEmpty(summaryLine))
        {
            // run through details lines to get summary and then multiple by 8% for 8% on this pay and set in summary line.
            for(var i=0; i < detailLineArr.length; i++)
            {
                var line = detailLineArr[i];
                var amount = setFloat(nlapiGetLineItemValue('custpage_enter_terminations', 'custpage_amount',line));
                summaryAmount = setFloat(summaryAmount + amount);
            }
        }

        var pctofGross = summaryAmount * 0.08;
        nlapiSetLineItemValue('custpage_enter_terminations', 'custrecord_pr_pc_quantity',summaryLine,summaryAmount);
        nlapiSetLineItemValue('custpage_enter_terminations', 'custpage_amount',summaryLine,pctofGross);
    }
}

function terminateRecalc()
{
    var isDetailLine = nlapiGetCurrentLineItemValue('custpage_enter_terminations', 'custpage_detail');
    //alert(isDetailLine);
    var country = nlapiGetFieldValue('custpage_country');
    if (country == PAYROLL_COUNTRY_NZ )
    {

        if(isDetailLine == 'T')
        {
            reCalc8pctGross();
        }

    }
    calcGross();
    return true;
}

function terminateValidateLine()
{
    return true;
}

function terminateValidateInsert()
{
    return true;
}






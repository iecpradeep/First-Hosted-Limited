var empValuesArr = [];
var _prAllObj = null;

function prPayDetailPageInit()
{
	initPayroll();
	var payDetailId = nlapiGetRecordId();
	if (isNullOrEmpty(payDetailId))
	{
		//lookup pay period and set
		var paySlipId = nlapiGetFieldValue('custrecord_psd_payslip');
		if (!isNullOrEmpty(paySlipId)) 
		{
			var paySlipPeriod = nlapiLookupField('customrecord_pr_payslip',paySlipId,'custrecord_ps_pay_freq');
			if (!isNullOrEmpty(paySlipPeriod)) 
			{
				nlapiSetFieldValue('custrecord_pr_psd_tax_period',paySlipPeriod);
			}
		}
	}
	
	var empId =  nlapiGetFieldValue('custrecord_psd_employee');
	if(!isNullOrEmpty(empId))
	{
		empValuesArr = nlapiLookupField('employee',empId,['custentity_pr_country','custentity_pr_other_leave_daily_rate','custentity_pr_standard_week','custentity_pr_working_days_per_week','custentity_pr_hours_per_day','custentity_pr_annual_leave_hourly_rate'])
	}
}

/**
 * TODO: logic to set quantity based on frequency and pay subtype, e.g for weekly and pay rates of hours set default to employee working week and disable field,
 * @param type
 * @param fieldname
 * @param linenum
 */
function prPayDetailFieldChanged(type, fieldname, linenum)
{
	try 
	{
	
		if (fieldname == 'custrecord_psd_type') 
		{
			var typeId = nlapiGetFieldValue('custrecord_psd_type');
			
			if (typeId == PAY_COMPONENT_TYPE_TAX) 
			{
				alert('If you enter a manual tax detail you will need to recalculate the payslip. This can be done from the recalculate buttons on the payslip body.');
			}
			
			if (typeId == PAY_COMPONENT_TYPE_LEAVE) 
			{
				var hourlyRate = nlapiGetFieldValue('custpage_hourly_rate');
				nlapiSetFieldValue('custrecord_pr_psd_uom',PAYROLL_UOM_HOUR);
				nlapiSetFieldValue('custrecord_psd_rate',hourlyRate);
			}
			else
			{
				nlapiSetFieldValue('custrecord_pr_psd_uom','');
				nlapiSetFieldValue('custrecord_psd_rate','');
			}
		}
		
		if (fieldname == 'custrecord_pr_psd_sub_type') 
		{
			var subTypeName = nlapiGetFieldText('custrecord_pr_psd_sub_type');
			var subTypeId = nlapiGetFieldValue('custrecord_pr_psd_sub_type');
			nlapiSetFieldValue('custrecord_psd_description', subTypeName);
			var subTypeCategory = nlapiGetFieldValue('custrecord_pr_psd_sub_type');
            defaultAccounts(fieldname);

            var expenseAccount = nlapiGetFieldValue('custrecord_pr_psd_pl_account');
			if (isNullOrEmpty(expenseAccount) && (subTypeId == payroll.PCST.EMPLOYER_SUPER && subTypeId == payroll.PCST.EMPLOYER_KIWI))
            {
                // get employer super expense account from the employee record.
                expenseAccount = nlapiGetFieldValue('custpage_super_expense_account');
            }

            var country = empValuesArr['custentity_pr_country'];
			//alert(country);
			
			if (country == PAYROLL_COUNTRY_NZ)
			{
				var subTypeCategory = nlapiLookupField('customrecord_pr_pcst',subTypeId,'custrecord_pr_pcst_pcc')
				
				if (subTypeId == payroll.PCST.ANNUAL_LEAVE || subTypeId == payroll.PCST.ANNUAL_LEAVE_INADVANCE || subTypeId == payroll.PCST.UNUSED_ANNUAL_LEAVE)
				{
					var alHourlyRate = empValuesArr['custentity_pr_annual_leave_hourly_rate'];
					nlapiSetFieldValue('custrecord_pr_psd_uom',PAYROLL_UOM_HOUR);
					nlapiSetFieldValue('custrecord_psd_rate',alHourlyRate);
				}
				else if(subTypeCategory == PAY_COMPONENT_CATEGORY_PAID_LEAVE)
				{
					// use standard hourly rate
					var hourlyRate = nlapiGetFieldValue('custpage_hourly_rate');
					nlapiSetFieldValue('custrecord_pr_psd_uom',PAYROLL_UOM_HOUR);
					nlapiSetFieldValue('custrecord_psd_rate',hourlyRate);
				}
				else if(subTypeCategory == PAY_COMPONENT_CATEGORY_UNPAID_LEAVE)
				{
					// use standard hourly rate
					nlapiSetFieldValue('custrecord_pr_psd_uom',PAYROLL_UOM_HOUR);
					nlapiSetFieldValue('custrecord_psd_rate',0);
				}
			}
			
		}

        if (fieldname == 'custrecord_pr_psd_payee')
        {
            defaultAccounts(fieldname);
        }
		
		if (fieldname == 'custrecord_pr_psd_quantity' || fieldname == 'custrecord_psd_rate') 
		{
			var qty = setFloat(nlapiGetFieldValue('custrecord_pr_psd_quantity'));
			var rate = setFloat(nlapiGetFieldValue('custrecord_psd_rate'));
			
			if (rate > 0.00 && !isNullOrEmpty(qty)) 
			{
				var amount = 0.00;
				amount = setFloat((qty * rate), defaultPrecision, roundingMethod);
				nlapiSetFieldValue('custrecord_psd_amount', amount);
			}
		}
		
		if (fieldname == 'custrecord_psd_amount') 
		{
			var subTypeId = nlapiGetFieldValue('custrecord_pr_psd_sub_type');
			if (!isNullOrEmpty(subTypeId)) 
			{
				var oteRate = setFloat(nlapiLookupField('customrecord_pr_pcst', subTypeId, 'custrecord_pr_pcst_ote_rate'));
				var amount = setFloat(nlapiGetFieldValue('custrecord_psd_amount'));
				var oteAmount = setFloat((oteRate * amount), defaultPrecision, roundingMethod);
				nlapiSetFieldValue('custrecord_pr_psd_ote_amount', oteAmount);
			}
		}
	}
	catch(ex)
	{
		// ensure not errors thrown to screen.
		// TODO: ensure errors are logged
	}
}

function prPayDetailOnSave()
{
	var isYTDBool = nlapiGetFieldValue("custrecord_psd_ytd_import") == "T";

	var returnValue = true;
	
	
	var componentType = nlapiGetFieldValue('custrecord_psd_type');  
	if (componentType == PAY_COMPONENT_TYPE_LEAVE) 
	{
		var quantity = nlapiGetFieldValue('custrecord_pr_psd_quantity');
		if (isNullOrEmpty(quantity))
		{
			alert('In order for leave to accrue correctly a quantity must be entered');
			return false;
		}
	}
	
	
	if (!isYTDBool && (componentType == PAY_COMPONENT_TYPE_TAX  || componentType == PAY_COMPONENT_TYPE_DEDUCTION || componentType == PAY_COMPONENT_TYPE_SUPER)) 
	{
		var payee = nlapiGetFieldValue('custrecord_pr_psd_payee');  
		var apAccount = nlapiGetFieldValue('custrecord_pr_psd_ap_account'); 
		
		if (isNullOrEmpty(apAccount))
		{
			if (!isNullOrEmpty(payee))
			{
				 alert("You have selected a payee who does not have an balance sheet account on their record.  Either set this manually on the pay detail or edit the payee and set the AP account on the vendor record to continue");
				 returnValue = false;
			}
			else
			{
				alert("You need to set a payee or a balance sheet account for this pay component type");
				returnValue = false;
			}
			
		}
		else if (isNullOrEmpty(payee))
		{
			
			 returnValue =  confirm("Are your sure you want to set this pay detail up without a payee.  If you do, this WILL post to the balance sheet but will NOT be able to be paid through AP");
		}
		else
		{
			returnValue = true;
		}
	}
	
	
	
	
	return returnValue;
}

function searchDuplicatePayDetails(empId,subTypeId,currentPayComponentId)
{
	var columns = new Array();
	columns.push(new nlobjSearchColumn('custrecord_psd_employee'));
    columns.push(new nlobjSearchColumn('custrecord_psd_type'));
    columns.push(new nlobjSearchColumn('custrecord_pr_psd_sub_type'));
    var filters = new Array();
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('custrecord_psd_employee', null, 'anyof', empId));
	filters.push(new nlobjSearchFilter('custrecord_pr_psd_sub_type', null, 'anyof', subTypeId));
	if(!isNullOrEmpty(currentPayComponentId))
	{
		filters.push(new nlobjSearchFilter('internalid', null, 'noneof', currentPayComponentId));
	}
	var searchResults = nlapiSearchRecord('customrecord_pr_payslip_detail', null, filters, columns);
	returnValue = isNullOrEmpty(searchResults);
	return returnValue;
	
}

function recalculateAll()
{
    var submit = confirm('By clicking OK this payslip detail will be saved and the payslip will recalculate tax, super, pensions and percentage deductions');
    if (submit)
    {
        nlapiSetFieldValue('custrecord_pr_psd_recalc', PAYROLL_ACTION_RECALC_ALL);
        //setWindowChanged(window, false);
        //document.main_form.submit();
        document.getElementById("submitter").click();
    }

}

function recalculateTotals()
{
    var submit = true; //confirm('By clicking OK this payslip detail will be saved and the payslip will recalculate totals based on the details on the payslip, tax, super, pensions and percentage deductions will NOT recalculate');
    if (submit)
    {
        nlapiSetFieldValue('custrecord_pr_psd_recalc', PAYROLL_ACTION_RECALC_TOTALS);
        //setWindowChanged(window, false);
        //document.main_form.submit();
        document.getElementById("submitter").click();
    }

}

function defaultAccounts(fieldChanged)
{
    var vendorId = nlapiGetFieldValue('custrecord_pr_psd_payee');
    var subType = nlapiGetFieldValue('custrecord_pr_psd_sub_type');
    var hasAllocation = nlapiGetFieldValue('custpage_has_allocation') == 'T';


    if(fieldChanged == 'custrecord_pr_psd_payee' && !isNullOrEmpty(vendorId))
    {
        var setBSAccountFromVendor = confirm('Do you want to set the Balance Sheet acount from the vendor default');
        if(setBSAccountFromVendor)
        {
            var vendorBSAccount = nlapiLookupField('vendor',vendorId,'custentity_payroll_ap_account');
            if(!isNullOrEmpty(vendorBSAccount))
            {
                nlapiSetFieldValue('custrecord_pr_psd_ap_account',vendorBSAccount);
            }
        }
    }
    else if (fieldChanged == 'custrecord_pr_psd_sub_type')
    {
        var expenseAccount = '';

        if(!isNullOrEmpty(subType))
        {
            if(hasAllocation)
            {
                if(_prAllObj == null)
                {
                    try
                    {
                        _prAllObj = JSON.parse(nlapiGetFieldValue("custpage_allocation"));
                    }
                    catch(ex)
                    {
                        alert("A problem occurred with dynamic account sourcing");
                    }
                }

                var subTypeExpenseObj = _prAllObj[subType];
                if(!isNullOrEmpty(subTypeExpenseObj))
                {
                    expenseAccount = subTypeExpenseObj.COA;

                    var bsAccount = subTypeExpenseObj.bsCOA;
                    if(!isNullOrEmpty(bsAccount))
                    {
                        nlapiSetFieldValue('custrecord_pr_psd_ap_account',bsAccount);
                    }
                }
            }

            if(isNullOrEmpty(expenseAccount))
            {
                expenseAccount = nlapiLookupField('customrecord_pr_pcst', subType, 'custrecord_pr_pcst_pandl_acc');
            }

            if(!isNullOrEmpty(expenseAccount))
            {
                nlapiSetFieldValue('custrecord_pr_psd_pl_account',expenseAccount);
            }

        }
        else
        {
            //clear the fields
            if(isNullOrEmpty(vendorId))
            {
                nlapiSetFieldValue('custrecord_pr_psd_ap_account',"");
            }

            nlapiSetFieldValue('custrecord_pr_psd_pl_account',"");
        }










    }
}


function prPostSource(type, fieldname, linenum)
{
}

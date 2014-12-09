
var _prAllObj = null;

function pageInit(type)
{
	try
    {
        var typeId = nlapiGetFieldValue('custrecord_pr_pc_type');
        var ctxObj = nlapiGetContext();
        var isSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");
        var subsidiaryId = "";
        var empId = nlapiGetFieldValue('custrecord_pr_pc_employee');
        var subTypeId = nlapiGetFieldValue('custrecord_pr_pc_pcst');
        var payPeriod = nlapiGetFieldValue('custrecord_pr_pc_frequency');
        if(isSubsidiaryBool && !isNullOrEmpty(empId))
        {
            // obtain the subsidiary from the employee record.
            subsidiaryId = nlapiGetFieldValue('custpage_subsidiary');
        }

        initPayroll(subsidiaryId);


        if(type == 'create')
        {
            if(isNullOrEmpty(typeId))
            {
                typeId = nlapiGetFieldValue('custpage_pc_type');
                if(!isNullOrEmpty(typeId))
                {

                    nlapiSetFieldValue('custrecord_pr_pc_type',typeId,false,true);
                }
            }

            //alert('typeId: ' + typeId + ' payPeriod: ' + payPeriod);

            // set default for new record
            if (!isNullOrEmpty(payPeriod) && typeId != PAY_COMPONENT_TYPE_SALARY_SACRIFICE)
            {
                //alert('set UOM');
                nlapiSetFieldValue('custrecord_pr_pc_uom', frequencyToUOM(payPeriod), false);
            }
            else
            if (typeId == PAY_COMPONENT_TYPE_SALARY_SACRIFICE)
            {
                nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_YEAR, false);
            }

            //alert('typeId: ' + typeId);

            if (typeId == PAY_COMPONENT_TYPE_SALARY_SACRIFICE)
            {
                nlapiSetFieldValue('custrecord_pr_pc_quantity', '1');
                //alert('set quantity');
            }

            if (typeId == PAY_COMPONENT_TYPE_DEDUCTION)
            {
                nlapiSetFieldValue('custrecord_pr_pc_quantity', '1');
            }
        }

        if (nlapiGetFieldValue('custrecord_pr_pc_is_percentage') == 'T')
		{
			nlapiDisableField('custrecord_pr_pc_variable', true);
			
			if (subTypeId == payroll.PCST.CHILD_SUPPORT_DEDUCTIONS) 
			{
				nlapiDisableField('custrecord_pr_pc_72a', true);
			}
		}
		else 
		{
			nlapiDisableField('custrecord_pr_pc_percentage', true);
			nlapiDisableField('custrecord_pr_pc_percent_type', true);
		}
		
		// enable quantity field
		
		if (typeId == PAY_COMPONENT_TYPE_ALLOWANCE) 
		{
			nlapiDisableField('custrecord_pr_pc_quantity', false);
		}
		
		// enable UOM field
		
		if (typeId == PAY_COMPONENT_TYPE_ALLOWANCE || typeId == PAY_COMPONENT_TYPE_SALARY_SACRIFICE) 
		{
			nlapiDisableField('custrecord_pr_pc_uom', false);
		}


		
		// enable frequency field
		
		if (subTypeId == payroll.PCST.BONUS || payroll.PCST.COMMISSION) 
		{
			nlapiDisableField('custrecord_pr_pc_frequency', false);
			nlapiDisableField('custrecord_pr_pc_next_pay_date', false);
		}
		
		// enable variable field
		
		if ((typeId == PAY_COMPONENT_TYPE_ALLOWANCE || typeId == PAY_COMPONENT_TYPE_DEDUCTION) || (subTypeId == payroll.PCST.BONUS || payroll.PCST.COMMISSION)) 
		{
			nlapiDisableField('custrecord_pr_pc_variable', false);
		}
		
		
		if (subTypeId == payroll.PCST.BASE_SALARY)
		{
            //do not disable quantity field for base salary, this allows decimals for < 1 FTE
			//nlapiDisableField('custrecord_pr_pc_quantity', true);
		}
		
		if (subTypeId == payroll.PCST.SALARY_SACRIFICE_FBT) 
		{
			nlapiDisableField('custrecord_pr_pc_fbt', false);
		}
		
		if (subTypeId == payroll.PCST.CHILD_SUPPORT_DEDUCTIONS) 
		{
			nlapiDisableField('custrecord_pr_pc_72a', false);
		}
	}
	catch(ex)
	{
        alert("A problem occurred during initialisation");
	}	
}



function fieldChangePayComponentSubType(typeId,subTypeId,employeeType,empWorkingWeek,payPeriod,empId)
{
	switch (subTypeId) 
	{
		case payroll.PCST.BASE_SALARY:
			
		// check employee is not a waged employee
		
		if (employeeType == EMP_PAY_TYPE_WAGES) 
		{
			alert('This employee is of type wages they cannot have a pay component which is salary');
			nlapiSetFieldValue('custrecord_pr_pc_pcst', payroll.PCST.NORMAL_TIME,false);
			nlapiSetFieldValue('custrecord_pr_pc_description', 'Normal Time',false);
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_HOUR,false);
			
			var hours = 0.00;
			var rate = 0.00;
			
			if (!isNullOrEmpty(empId))
			{
				var empValueArr = nlapiLookupField('employee',empId, ['custentity_pr_standard_week','custentity_pr_hourly_rate']);
				var defaultWorkingWeek = empValueArr['custentity_pr_standard_week'];
				rate = setFloat(empValueArr['custentity_pr_hourly_rate']);
				
				if(isNullOrEmpty(defaultWorkingWeek))
				{
					defaultWorkingWeek = payroll.config.emp_workingweek;
					if (!isNullOrEmpty(defaultWorkingWeek))
					{
						hours = convertFromWeeklyToPayPeriod(defaultWorkingWeek,payPeriod);
						nlapiSetFieldValue('custrecord_pr_pc_quantity', hours,false);
					}
					
				}
				else
				{
					hours = convertFromWeeklyToPayPeriod(defaultWorkingWeek,payPeriod);
					nlapiSetFieldValue('custrecord_pr_pc_quantity', hours,false);
				}
			}
			
			if (rate > 0.00)
			{
				nlapiSetFieldValue('custrecord_pr_pc_rate', rate,true);
			}
			else
			{
				nlapiSetFieldValue('custrecord_pr_pc_rate', '',true);
			}
			
			//clearBodyFieldValues(['custrecord_pr_pc_pcst','custrecord_pr_pc_description'],false);
		}
		else
		{
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_YEAR,false);
			nlapiSetFieldValue('custrecord_pr_pc_quantity', 1);
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);
		}

		
		
		break;
			
		case payroll.PCST.NORMAL_TIME:
			
		if (employeeType == EMP_PAY_TYPE_SALARY) 
		{
			alert('This employee is of type salary they cannot have a pay component which is normal time');
			nlapiSetFieldValue('custrecord_pr_pc_pcst', payroll.PCST.BASE_SALARY,false);
			nlapiSetFieldValue('custrecord_pr_pc_description', 'Base Salary',false);
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_YEAR,false);
			nlapiSetFieldValue('custrecord_pr_pc_quantity', 1);
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);
		}
		else
		{
			if (isNullOrEmpty(empWorkingWeek) && !isNullOrEmpty(payroll.config.emp_workingweek)) 
			{
				empWorkingWeek = payroll.config.emp_workingweek;
			}
			else if (isNullOrEmpty(empWorkingWeek) && isNullOrEmpty(payroll.config.emp_workingweek)) 
			{
				empWorkingWeek = '0';
			}
			var qty = convertFromWeeklyToPayPeriod(empWorkingWeek, payPeriod);
			// end to change at some point.
			
			nlapiSetFieldValue('custrecord_pr_pc_quantity', qty);
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_HOUR,false);
	
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_quantity','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);		
		}

		break;
						
		case payroll.PCST.SUPER_SALARY_SACRIFICE:
		
			var superFundId = nlapiGetFieldValue('custrecord_pr_pc_esf');
			
			if (!isNullOrEmpty(superFundId))
			{
				var superVendor = nlapiLookupField('customrecord_pr_employee_super_funds',superFundId,'custrecord_esf_fund_supplier');
	
				if (!isNullOrEmpty(superVendor))
				{
					nlapiSetFieldValue('custrecord_pr_pc_payee', superVendor,true);
				}
				else
				{
					alert('The employee default super fund record does not have a super supplier set');
				}
			}
			else
			{
				alert ('This employee does not have a default superfund set.');
			}
	
			enableBodyFields(['custrecord_pr_pc_reduce_employer_cont']);
			// no longer default to YES nlapiSetFieldValue('custrecord_pr_pc_reduce_employer_cont', 'T', false);
	
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_quantity','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);		

		break;
			
		case payroll.PCST.EMPLOYEE_SUPER:
			
			var superFundId = nlapiGetFieldValue('custrecord_pr_pc_esf');
			if (!isNullOrEmpty(superFundId))
			{
				var superVendor = nlapiLookupField('customrecord_pr_employee_super_funds',superFundId,'custrecord_esf_fund_supplier');
				if (!isNullOrEmpty(superVendor))
				{
					nlapiSetFieldValue('custrecord_pr_pc_payee', superVendor,true);
				}
				else
				{
					alert('The employee default super fund record does not have a super supplier set');
				}
			}
			else
			{
				alert ('This employee does not have a default superfund set.');
			}
			
			
		break;

			
		case payroll.PCST.SALARY_SACRIFICE_FBT:
		
			enableBodyFields(['custrecord_pr_pc_fbt']);
			nlapiSetFieldValue('custrecord_pr_pc_72a', '', false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_quantity','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);		
				
		break;
			
		case payroll.PCST.CHILD_SUPPORT_DEDUCTIONS:
			
			nlapiSetFieldValue('custrecord_pr_pc_uom',frequencyToUOM(payPeriod),false);
			enableBodyFields(['custrecord_pr_pc_72a']);
			nlapiSetFieldValue('custrecord_pr_pc_fbt', '', false);
			disableBodyFields(['custrecord_pr_pc_fbt','custrecord_pr_pc_quantity','custrecord_pr_pc_variable','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);		

		break;
			
		case payroll.PCST.BONUS:
		case payroll.PCST.COMMISSION:

			enableBodyFields(['custrecord_pr_pc_frequency','custrecord_pr_pc_variable','custrecord_pr_pc_next_pay_date']);
	
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_LUMP,false);
			nlapiSetFieldValue('custrecord_pr_pc_quantity', '1',false);
				
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_quantity']);		
				
		break;
		case payroll.PCST.MANUAL_TAX:
		
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			nlapiSetFieldValue('custrecord_pr_pc_quantity', '1',false);
			disableBodyFields(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_quantity']);		
			
		break;
		default:
			
			clearBodyFieldValues(['custrecord_pr_pc_72a','custrecord_pr_pc_fbt'],false);
			disableBodyFields(['custrecord_pr_pc_reduce_employer_cont','custrecord_pr_pc_72a','custrecord_pr_pc_fbt','custrecord_pr_pc_frequency','custrecord_pr_pc_next_pay_date']);		
				
			if (typeId != PAY_COMPONENT_TYPE_DEDUCTION && typeId != PAY_COMPONENT_TYPE_ALLOWANCE)
			{
				nlapiDisableField('custrecord_pr_pc_variable', true);
			}
			
			if (typeId != PAY_COMPONENT_TYPE_ALLOWANCE) 
			{
				nlapiDisableField('custrecord_pr_pc_quantity', true);
			}
					
		break;
	}
	
}

function prComponentFieldChanged(type, fieldname, linenum)
{
	var typeId = nlapiGetFieldValue('custrecord_pr_pc_type');
	var subTypeName = nlapiGetFieldText('custrecord_pr_pc_pcst');
	var subTypeId = nlapiGetFieldValue('custrecord_pr_pc_pcst');
	var empId = nlapiGetFieldValue('custrecord_pr_pc_employee');
	var UOM = nlapiGetFieldValue('custrecord_pr_pc_uom');
	var payPeriod = nlapiGetFieldValue('custrecord_pr_pc_frequency');

	switch(fieldname)
	{
		case 'custrecord_pr_pc_type':
		
		// clear quantity, amount and rate.
		clearBodyFieldValues(['custrecord_pr_pc_quantity','custrecord_pr_pc_amount','custrecord_pr_pc_rate'],false);
		
		switch(typeId)
		{
			case PAY_COMPONENT_TYPE_ALLOWANCE:
	
			disableBodyFields(['custrecord_pr_pc_uom','custrecord_pr_pc_quantity','custrecord_pr_pc_variable','custrecord_pr_pc_frequency']);
	
			break;
			case PAY_COMPONENT_TYPE_SALARY_SACRIFICE:
			
			disableBodyFields(['custrecord_pr_pc_quantity']);
			enableBodyFields(['custrecord_pr_pc_uom','custrecord_pr_pc_variable','custrecord_pr_pc_frequency']);
			nlapiSetFieldValue('custrecord_pr_pc_quantity', 1);
	
			break;
			case PAY_COMPONENT_TYPE_DEDUCTION:
	
			nlapiSetFieldValue('custrecord_pr_pc_quantity','1');
			disableBodyFields(['custrecord_pr_pc_uom','custrecord_pr_pc_quantity']);
			enableBodyFields(['custrecord_pr_pc_variable','custrecord_pr_pc_frequency']);
	
			break;
			default:
	
			disableBodyFields(['custrecord_pr_pc_uom','custrecord_pr_pc_quantity','custrecord_pr_pc_variable']);
			enableBodyFields(['custrecord_pr_pc_frequency']);
	
			break;
		}
		
		break;
        case 'custpage_dynpcst':
            nlapiSetFieldValue('custrecord_pr_pc_pcst',nlapiGetFieldValue(fieldname),true);
        break;
		case 'custrecord_pr_pc_pcst':
			
			
			nlapiSetFieldValue('custrecord_pr_pc_description', subTypeName,false);
			
			var employeeValues = "";
			var employeeType = ""; 
			var empWorkingWeek = ""; 
	
			// get Variables used for salary subtypes
			if (typeId == PAY_COMPONENT_TYPE_SALARY_WAGES && !isNullOrEmpty(empId))
			{
				employeeValues = nlapiLookupField('employee', empId, ['custentity_pr_standard_week','custentity_pay_type']);
				employeeType = employeeValues['custentity_pay_type'];
				empWorkingWeek = employeeValues['custentity_pr_standard_week'];
			}

            defaultAccounts(fieldname);
			
			fieldChangePayComponentSubType(typeId,subTypeId,employeeType,empWorkingWeek,payPeriod,empId);
			
			
			
		break;
		case 'custrecord_pr_pc_is_percentage':

		if(nlapiGetFieldValue('custrecord_pr_pc_is_percentage') == 'T') 
		{
			clearBodyFieldValues(['custrecord_pr_pc_quantity','custrecord_pr_pc_amount','custrecord_pr_pc_amount_period'],false);
			nlapiSetFieldValue('custrecord_pr_pc_variable', 'F',false);

			enableBodyFields(['custrecord_pr_pc_percentage','custrecord_pr_pc_percent_type']);		
			disableBodyFields(['custrecord_pr_pc_quantity','custrecord_pr_pc_rate','custrecord_pr_pc_amount','custrecord_pr_pc_amount_period','custrecord_pr_pc_variable']);		

			if (subTypeId == payroll.PCST.CHILD_SUPPORT_DEDUCTIONS)
			{
				nlapiDisableField('custrecord_pr_pc_72a',true);
				nlapiSetFieldValue('custrecord_pr_pc_72a','T',false);
			}
		}
		else 
		{
			disableBodyFields(['custrecord_pr_pc_percentage','custrecord_pr_pc_percent_type']);		
			enableBodyFields(['custrecord_pr_pc_quantity','custrecord_pr_pc_rate','custrecord_pr_pc_amount','custrecord_pr_pc_amount_period']);		
		}

		break;
		case 'custrecord_pr_pc_quantity':
		case 'custrecord_pr_pc_rate':
		case 'custrecord_pr_pc_uom':
		
		/*var UOM = nlapiGetFieldValue('custrecord_pr_pc_uom');
		var subType = nlapiGetFieldValue('custrecord_pr_pc_pcst');
		var type = nlapiGetFieldValue('custrecord_pr_pc_type');
		
		if((type == PAY_COMPONENT_TYPE_SALARY_WAGES && subType == payroll.PCST.BASE_SALARY) && UOM != PAYROLL_UOM_YEAR)
		{
			alert('Unit of measure for salary needs to be Year');
			nlapiSetFieldValue('custrecord_pr_pc_uom', PAYROLL_UOM_YEAR,false);
		}*/

		var qty = setFloat(nlapiGetFieldValue('custrecord_pr_pc_quantity'));
		var rate = setFloat(nlapiGetFieldValue('custrecord_pr_pc_rate'));
		
		if (rate > 0.00 && qty > 0.00 && !isNullOrEmpty(payPeriod)) 
		{
			var amount = 0.00;
			amount = qty * rate;
			nlapiSetFieldValue('custrecord_pr_pc_amount', amount);
			
			if (!isNullOrEmpty(UOM) && amount > 0.00) 
			{
				var adjustedAmount = convertUOMtoPayPeriod(payPeriod, UOM, amount);
				
				// round salary amount in favour of the employee
				if (subTypeId == payroll.PCST.BASE_SALARY) 
				{
					
					if ((companyId == '1036092_SB3' || companyId == '1036092') && (payPeriod == PAYWEEKLY || payPeriod == PAYBIWEEKLY))
					{
						if (payPeriod == PAYWEEKLY)
						{
							adjustedAmount = (amount*6)/313;
						}
						else if (payPeriod == PAYBIWEEKLY)
						{
							adjustedAmount = ((amount*6)/313)*2;
						}
					}
					
					// round up to 2 decimals
					adjustedAmount = Math.ceil(adjustedAmount * 100) / 100;
				}
				else
				{
					adjustedAmount = setFloat(adjustedAmount,2);
				}
				
				if (adjustedAmount > 0.00) 
				{
					nlapiSetFieldValue('custrecord_pr_pc_amount_period', adjustedAmount);
				}
				else 
				{
					nlapiSetFieldValue('custrecord_pr_pc_amount_period', '',false);
				}
			}
			
		}
		
		break;
		
		case 'custrecord_pr_pc_end_date':
			
			var endDate = nlapiGetFieldValue('custrecord_pr_pc_end_date');
			if ((subTypeId == payroll.PCST.BASE_SALARY || subTypeId == payroll.PCST.NORMAL_TIME) && !isNullOrEmpty(endDate))
			{
				var updateRelaseDateBool = confirm('You have set the end date for this component. If this employee is finishing click OK to set their terminaton date');
				if (updateRelaseDateBool)
				{
					nlapiSubmitField('employee',empId,'releasedate',endDate);
				}
			}
			
		break;

        case 'custrecord_pr_pc_payee':

            defaultAccounts(fieldname);

            break;
		
	}
}


function prPostSource(type, fieldname, linenum)
{

}



function defaultAccounts(fieldChanged)
{
    var vendorId = nlapiGetFieldValue('custrecord_pr_pc_payee');
    var subType = nlapiGetFieldValue('custrecord_pr_pc_pcst');
    var hasAllocation = nlapiGetFieldValue('custpage_has_allocation') == 'T';


    if(fieldChanged == 'custrecord_pr_pc_payee' && !isNullOrEmpty(vendorId))
    {
        var setBSAccountFromVendor = confirm('Do you want to set the Balance Sheet acount from the vendor default');
        if(setBSAccountFromVendor)
        {
            var vendorBSAccount = nlapiLookupField('vendor',vendorId,'custentity_payroll_ap_account');
            if(!isNullOrEmpty(vendorBSAccount))
            {
                nlapiSetFieldValue('custrecord_pr_pc_balance_sheet_acc',vendorBSAccount);
            }
        }
    }
    else if (fieldChanged == 'custrecord_pr_pc_pcst' && hasAllocation)
    {
        if(!isNullOrEmpty(subType))
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
            //alert(JSON.stringify(subTypeExpenseObj))
            if(!isNullOrEmpty(subTypeExpenseObj))
            {
                var expenseAccount = subTypeExpenseObj.COA;
                //alert('expenseAccount: ' + expenseAccount);
                if(!isNullOrEmpty(expenseAccount))
                {
                    nlapiSetFieldValue('custrecord_pr_pc_pl_acccount',expenseAccount);
                }
                var bsAccount = subTypeExpenseObj.bsCOA;
                //alert('bsAccount: ' + bsAccount);
                if(!isNullOrEmpty(bsAccount))
                {
                    nlapiSetFieldValue('custrecord_pr_pc_balance_sheet_acc',bsAccount);
                }
            }
        }
        else
        {
            //clear fields
            nlapiSetFieldValue('custrecord_pr_pc_balance_sheet_acc',"");
            nlapiSetFieldValue('custrecord_pr_pc_pl_acccount',"");
        }



    }
}


function prComponentOnSave()
{
	var currentPayComponentId = nlapiGetRecordId();
	var subTypeName = nlapiGetFieldText('custrecord_pr_pc_pcst');
	var subTypeId = nlapiGetFieldValue('custrecord_pr_pc_pcst');
	var empId = nlapiGetFieldValue('custrecord_pr_pc_employee');
	var componentType = nlapiGetFieldValue('custrecord_pr_pc_type');  

	var returnValue = true;

    var isCurrentBool = nlapiGetFieldValue('custrecord_pr_pc_current') == 'T';

	if (!isNullOrEmpty(empId) && !isNullOrEmpty(subTypeId) && !isNullOrEmpty(currentPayComponentId))
	{
		returnValue = searchDuplicatePayComponents(empId,subTypeId,currentPayComponentId);
		if (!returnValue)
		{
			returnValue = confirm('There is already a pay component '+ subTypeName + ' for this employee, click ok to continue');
		}
	}
	
	if (componentType == PAY_COMPONENT_TYPE_TAX  || componentType == PAY_COMPONENT_TYPE_DEDUCTION || componentType == PAY_COMPONENT_TYPE_SUPER) 
	{
		var payee = nlapiGetFieldValue('custrecord_pr_pc_payee');  
		var apAccount = nlapiGetFieldValue('custrecord_pr_pc_balance_sheet_acc'); 
		
		if (isNullOrEmpty(apAccount))
		{
			if (!isNullOrEmpty(payee))
			{
				 alert("You have selected a payee who does not have an balance sheet account on their record.  Either set this manually on the pay component or edit the payee and set the AP account on the vendor record to continue");
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
			
			 returnValue =  confirm("Are your sure you want to set this component up without a payee.  If you do this WILL post to the balance sheet but will NOT be able to be paid through AP");
		}
		else
		{
			returnValue = true;
		}
	}

    if((subTypeId == payroll.PCST.NORMAL_TIME || subTypeId == payroll.PCST.BASE_SALARY) && isCurrentBool)
    {
        returnValue = confirm('The pay component is flagged as CURRENT, if you save this the EMPLOYEE record will be UPDATED with the HOURLY RATE and SALARY from this pay component. \n\n If this is NOT the current pay componet hit CANCEL, uncheck the current checkbox and resave.');
    }
	
	return returnValue;
}

function searchDuplicatePayComponents(empId,subTypeId,currentPayComponentId)
{
	var columns = [
		new nlobjSearchColumn('custrecord_pr_pc_employee'),
		new nlobjSearchColumn('custrecord_pr_pc_type'),
		new nlobjSearchColumn('custrecord_pr_pc_pcst')
	];
	
    var filters = [
		new nlobjSearchFilter('isinactive', null, 'is', 'F'),
		new nlobjSearchFilter('custrecord_pr_pc_employee', null, 'anyof', empId),
		new nlobjSearchFilter('custrecord_pr_pc_pcst', null, 'anyof', subTypeId)
	];

	if(!isNullOrEmpty(currentPayComponentId))
	{
		filters.push(new nlobjSearchFilter('internalid', null, 'noneof', currentPayComponentId));
	}

	var searchResults = nlapiSearchRecord('customrecord_pr_pay_component', null, filters, columns);
	returnValue = isNullOrEmpty(searchResults);
	return returnValue;
	
}

/**
 * function sets the field value 
 * @param {Array} fieldArr an array of fieldid's that will be set to empty string
 * @param {Bool} fireFieldChangeBool
 */
function clearBodyFieldValues(fieldArr,fireFieldChangeBool)
{
	for(var i=0; i < fieldArr.length; i++)
	{
		nlapiSetFieldValue(fieldArr[i],"",fireFieldChangeBool);	
	}	
}

function disableBodyFields(fieldArr)
{
	for(var i=0; i < fieldArr.length; i++)
	{
		nlapiDisableField(fieldArr[i],true);
	}	
}

function enableBodyFields(fieldArr)
{
	for(var i=0; i < fieldArr.length; i++)
	{
		nlapiDisableField(fieldArr[i],false);
	}	
}





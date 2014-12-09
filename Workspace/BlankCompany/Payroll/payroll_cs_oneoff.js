var autoSubmit = false;	
function oneOffEntrySave()
{
	
	var cancel = confirm("Are you sure you want to submit the one off payments entered?") == false;
	if (cancel)
	{
		return false;
	}
		
	calcAmount();
	var saveRecordBool = true;
	
	var lineCount = nlapiGetLineItemCount("custpage_enteroneoff");
	if(lineCount == -1)
	{
		saveRecordBool = confirm("You have not selected any components to process are you sure you wish to proceed?",false);
	}
	
	return(saveRecordBool);
}

function oneOffFieldChanged(type, fieldname, linenum)
{

	if (fieldname == 'custpage_employee')
	{
		var empId = nlapiGetCurrentLineItemValue('custpage_enteroneoff','custpage_employee')
		var hourlyRate = setFloat(nlapiLookupField('employee',empId,'custentity_pr_hourly_rate'))
		nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_hourly_rate',hourlyRate,false);
	}
		
	if (fieldname == 'custrecord_pr_pc_quantity' || fieldname == 'custrecord_pr_pc_rate')
	{
		var qty = setFloat(nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_quantity')); 
		var rate = setFloat(nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_rate'));
		//alert('qty: '+ qty + 'rate: ' + rate)
		var amount = qty * rate;
		nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_amount', amount);
	}
	if (fieldname == 'custpage_pay_run_id') 
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
	if (fieldname == 'custrecord_pr_pc_pcst') 
	{
		var subTypeId = nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_pcst');
		payPeriod = nlapiGetFieldValue('custpage_pay_period');
		
		//alert(subTypeId)
		
		if (!isNullOrEmpty(subTypeId))
		{
			var subTypeValues = nlapiLookupField('customrecord_pr_pcst',subTypeId,
			['custrecord_pr_pcst_pc_type','custrecord_pr_pcst_ote','custrecord_pr_pcst_pandl_acc','custrecord_pr_pcst_rate','custrecord_pr_pcst_taxable','custrecord_pr_pcst_pcc','custrecord_pr_pcst_balance_sheet_acc']);
			
			var description = nlapiLookupField('customrecord_pr_pcst',subTypeId,'name');
	
			var ote = subTypeValues['custrecord_pr_pcst_ote'];
			var type = subTypeValues['custrecord_pr_pcst_pc_type'];
			var PL = subTypeValues['custrecord_pr_pcst_pandl_acc'];
			var rate = subTypeValues['custrecord_pr_pcst_rate'];
			var taxable = subTypeValues['custrecord_pr_pcst_taxable'];
			var UOM = frequencyToUOM(payPeriod);
			var category = subTypeValues['custrecord_pr_pcst_pcc'];
			var apAccount = subTypeValues['custrecord_pr_pcst_balance_sheet_acc'];
			
			var hourlyRate = nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custpage_hourly_rate')
			//alert(hourlyRate);
			
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_frequency',payPeriod,false);	
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_type',type);
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_taxable',taxable);
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_ote',ote);
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_description',description);	
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_pandl',PL);	
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_uom',UOM);	
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_quantity','',false);
			if(!isNullOrEmpty(apAccount))
			{
				nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_bs',apAccount);
			}
			
			if(category == PAY_COMPONENT_CATEGORY_NORMAL_TIME || category == PAY_COMPONENT_CATEGORY_PAID_LEAVE || category == PAY_COMPONENT_CATEGORY_UNUSED_LEAVE)
			{
				rate = hourlyRate;
			}
			else  if (category == PAY_COMPONENT_CATEGORY_OVER_TIME || category == PAY_COMPONENT_CATEGORY_PENALTY_RATE)
			{
				rate = "";
			}
			nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_rate',rate,false);	
		}
		
	}
	
	if (fieldname == 'custpage_vendor')
	{
		var payeeVendorId = nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custpage_vendor');
		if(!isNullOrEmpty(payeeVendorId))
		{
			apAccount = nlapiLookupField('entity',payeeVendorId,'custentity_payroll_ap_account');
			//nlapiLogExecution('debug','setPayeeAP','payee: ' + payeeVendorId + ' payeeAPAccount: ' + payeeAPAccount) ;
			if(!isNullOrEmpty(apAccount))
			{
				nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_bs',apAccount);	
			} 
		}
	}
	
	
	if (fieldname == 'custpage_employee') 
	{
		var empId = nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custpage_employee');
		
		//alert(empId)
		
		if (!isNullOrEmpty(empId)) 
		{
			//var empValues = nlapiLookupField('employee', empId, ['department', 'class', 'location']);
			
			var classificationBool = false;
			var fieldArr = [];
			
			//alert('useLocation: ' + payroll.useLocation + ' - ' + payroll.useDepartment + ' - ' + payroll.useClass + ' - ' + payroll.useSubsidiary) // + ' - '+ payroll.getConfiguration("cfg_complete"));
			
			if (payroll.useDepartment)
			{
				fieldArr.push("department");
				classificationBool = true;
			} 
			if (payroll.useLocation)
			{
				fieldArr.push("location");
				classificationBool = true;
			} 
			if (payroll.useClass)
			{
				fieldArr.push("class");
				classificationBool = true;
			} 
			//alert(classificationBool)
			if (classificationBool) 
			{
				var empValues = nlapiLookupField("employee", empId, fieldArr);
				var location = empValues['location'];
				if (!isNullOrEmpty(location))
				{
					nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_location',location,false);	
				}
				var department = empValues['department'];
				//alert(department);
				if (!isNullOrEmpty(department))
				{
					nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_department',department,false);	
				}
				var classification = empValues['class'];
				if (!isNullOrEmpty(classification))
				{
					nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custpage_class',classification,false);	
				}
			}
		}
	}
	if (fieldname == 'custrecord_pr_pc_frequency') 
	{
		var paidForPeriod = nlapiGetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_frequency');
		var UOM = frequencyToUOM(paidForPeriod);
		nlapiSetCurrentLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_uom',UOM);	
	}
	
	if (fieldname == 'custpage_line_count') 
	{
		var lineCount = nlapiGetFieldValue('custpage_line_count');
		if (lineCount > 20 && !autoSubmit)
		{
			var submit = confirm('You have entered more than 20 lines it is recommend that you submit these now.  Click ok to submit.  You can then come back in and add more.');
			if (submit)
			{
				autoSubmit = true;
				document.getElementById("submitter").click();
			}
		}
	}
	
}

function calcAmount()
{
	
	var lineItemCount = nlapiGetLineItemCount('custpage_enteroneoff');
	
	for(var line=1; line<=lineItemCount; line++) 
	{
		var qty = setFloat(nlapiGetLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_quantity',line));
		var rate = setFloat(nlapiGetLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_rate',line));
		var amount = setFloat(nlapiGetLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_amount',line));
		if (amount == 0.00)
		{
			amount = qty * rate;
		}
		nlapiSetLineItemValue('custpage_enteroneoff', 'custrecord_pr_pc_amount', line, amount);
		
	}
}

function oneOffRecalc()
{
	var lineCount = nlapiGetLineItemCount("custpage_enteroneoff");
	nlapiSetFieldValue('custpage_line_count',lineCount);
	//alert(lineCount);
	
}

function oneOffPageInit()
{
	initPayroll();
}






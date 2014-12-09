/**
 * Function evaluates whether valueStr is a null, empty or undefined value.
 * @param {String} valueStr
 * @return {Boolean} function returns true if defined or false otherwise.
 */
function isNullOrEmpty(valueStr)
{
	return(valueStr == null || valueStr == "" || valueStr == undefined);	
}


/**
 * function returns ensures a valid float is returned regardless of the input. 
 * If the input cannot be parsed to a float 0.00 is returned
 * @param {String} valueStr
 * @param {Float} the parseFloat result or 0.00 if NAN
 */
function setFloat(valueStr,decimalPlaces)
{
	var testFloat = parseFloat(valueStr);
	decimalPlaces = parseInt(decimalPlaces)
	if (!isNaN(decimalPlaces))
	{
		testFloat = parseFloat(testFloat.toFixed(decimalPlaces));
	}
	return(isNaN(testFloat) ? 0.00 : testFloat);
}

/**
 * Generic function for logging exception based errors should be called in all try catch clauses
 * @param {ExceptionObject} exceptionObj either javascript or nlobjError
 * 
 */
function logPayRollException(exceptionObj,variableArr)
{
	var errorStr = (exceptionObj.getCode != null) ? exceptionObj.getCode() + '\n' + exceptionObj.getDetails() + '\n' + exceptionObj.getStackTrace().join("\n") : exceptionObj.toString();

	if(!isNullOrEmpty(variableArr))
	{
		logPayRollVariables('error',errorStr,variableArr);		
	}
	else
	{
		nlapiLogExecution("error","logPayRollException",errorStr);	
	}
	
	// log the details and potential send an email to proactively manage exceptions.
}

function logPayRollVariables(typeStr,titleStr,variableArr)
{
	var debugStr = "";
	
	for(var labelStr in variableArr)
	{
		debugStr += labelStr + ": " + variableArr[labelStr] + "\n";
	}
	
	nlapiLogExecution(typeStr,titleStr,titleStr + '\n' + debugStr);
}

/**
 * Function evaluates valueObj if its null or empty returns defaultObj.
 * @param {Object} valueObj
 * @param {Object} defaultObj
 * @return {Object} valueObj is not empty or defaultObj otherwise.
 */
function isNullOrDefault(valueObj,defaultObj)
{
	//nlapiLogExecution('debug','isNullOrDefault',valueObj);	
	
	return(isNullOrEmpty(valueObj) ? defaultObj : valueObj);
}



function getSetDefault(request,fieldNameStr,defaultValue)
{
	return(!isNullOrEmpty(request.getParameter(fieldNameStr)) ? request.getParameter(fieldNameStr) : defaultValue);
}

function getSetDefaultArr(request,fieldNameStr,defaultValue)
{
	return(!isNullOrEmpty(request.getParameterValues(fieldNameStr)) ? request.getParameterValues(fieldNameStr) : defaultValue);
}


function getSetDefaultScriptParam(request,fieldNameStr,defaultValue)
{
	return(!isNullOrEmpty(request.getSetting('SCRIPT', fieldNameStr)) ? request.getSetting('SCRIPT', fieldNameStr) : defaultValue);
}

/**
 * is function has filter values are set and the function include true then apply updates 
 * to matches otherwise we exclude matches
 * 
 * @param {Object} sublist
 * @param {Object} field
 * @param {Object} value
 * @param {Object} filterField
 * @param {Object} filterValue
 * @param {Object} includeBool
 * @param {Object} refreshBool
 */
function updateSublistValues(sublist,field,value,filterField,filterValue,includeBool,refreshBool)
{
	var lineItemCount = nlapiGetLineItemCount(sublist);
	
	for(var line=1; !isNullOrEmpty(lineItemCount) && line<=lineItemCount; line++) 
	{
		if (!isNullOrEmpty(filterField) && !isNullOrEmpty(filterValue))
		{
			var checkValue = nlapiGetLineItemValue(sublist, filterField, line);

			if (checkValue == filterValue && includeBool)
			{
				nlapiSetLineItemValue(sublist, field, line, value);
			}
			else if (checkValue != filterValue && !includeBool)
			{
				nlapiSetLineItemValue(sublist, field, line, value);
			}
			
		}
		else
		{
			nlapiSetLineItemValue(sublist, field, line, value);
		}
	}

	if (refreshBool)
	{
		nlapiRefreshLineItems(sublist);
	}
}


	
/**
 * is function has filter values are set and the function include true then apply updates to matches otherwise we exclude matches
 * 
 * @param {Object} sublist
 * @param {Object} field
 * @param {Object} value
 * @param {Object} filterField
 * @param {Object} filterValue
 * @param {Object} includeBool
 */
function updateSublistValuesCurrent(sublist,field,value,filterField,filterValue,includeBool)
{

	var lineItemCount = nlapiGetLineItemCount(sublist);
	for(var line=1; line<=lineItemCount; line++) 
	{
		nlapiSelectLineItem(sublist, line);
		if (!isNullOrEmpty(filterField) && !isNullOrEmpty(filterValue))
		{
			var checkValue = nlapiGetCurrentLineItemValue(sublist, filterField);
			if (checkValue == filterValue && includeBool)
			{
				nlapiSetCurrentLineItemValue(sublist, field, value);
			}
			else if (checkValue != filterValue && !includeBool)
			{
				nlapiSetCurrentLineItemValue(sublist, field,value);
			}
		}
		else
		{
			nlapiSetCurrentLineItemValue(sublist, field, value);
		}
	}

}

function convertToWeekly(base,payPeriod)
{
	/* This function converts the pay unit to a weekly basis for use with ATO tax tables
	 * 
	 */
	var payUnit = 0.00;
	if (payPeriod == PAYMONTHLY)
	{
		payUnit =  (base*3)/13;
	}
	else if (payPeriod == PAYWEEKLY)
	{
		payUnit =  base;
	}
	else if (payPeriod == PAYBIWEEKLY)
	{
		payUnit =  base/2;
	}
	else if (payPeriod == PAYFOURWEEKLY)
	{
		payUnit =  base/4;
	}
	else if (payPeriod == PAYQUARTERLY)
	{
		payUnit =  base/13;
	}
	else if (payPeriod == PAYANNUAL)
	{
		payUnit =  base/52;
	}
	else if (payPeriod == PAYBIANNUAL)
	{
		payUnit =  base/26;
	}
	return payUnit;
}


function convertUOMtoPayPeriod(payPeriod,UOM,amount)
{
	//nlapiLogExecution('debug','convertUOMtoPayPeriod','payPeriod: ' + payPeriod + ' UOM: ' + UOM + ' amount: ' + amount);
	
	var convertedAmount = 0.00
	
	switch (payPeriod) {
	
		case PAYMONTHLY:
			
			if (UOM == PAYROLL_UOM_MONTH) {
				convertedAmount = amount;
			}
			else 
				if (UOM == PAYROLL_UOM_WEEK) {
					convertedAmount = amount * 13 / 3;
				}
				else 
					if (UOM == PAYROLL_UOM_FORTNIGHTLY) {
						convertedAmount = amount * 26 / 12;
					}
					else 
						if (UOM == PAYROLL_UOM_QUARTERLY) {
							convertedAmount = amount / 3;
						}
						else 
							if (UOM == PAYROLL_UOM_YEAR) {
								convertedAmount = amount / 12;
							}
							else 
							{
								convertedAmount = amount 
							}
			break;

        case PAYSEMIMONTHLY:

            if (UOM == PAYROLL_UOM_MONTH)
            {
                convertedAmount = amount/2;
            }
            else
            if (UOM == PAYROLL_UOM_WEEK)
            {
                convertedAmount = amount * 52 / 24;
            }
            else
            if (UOM == PAYROLL_UOM_FORTNIGHTLY)
            {
                convertedAmount = amount * 26 / 24
            }
            else
            if (UOM == PAYROLL_UOM_QUARTERLY) {
                convertedAmount = amount / 6;
            }
            else
            if (UOM == PAYROLL_UOM_YEAR) {
                convertedAmount = amount / 24;
            }
            else
            {
                convertedAmount = amount
            }
            break;

		case PAYWEEKLY:
			
			if (UOM == PAYROLL_UOM_MONTH) {
				convertedAmount = amount * 3 / 13;
			}
			else 
				if (UOM == PAYROLL_UOM_WEEK) {
					convertedAmount = amount;
				}
				else 
					if (UOM == PAYROLL_UOM_FORTNIGHTLY) {
						convertedAmount = amount / 2;
					}
					else 
						if (UOM == PAYROLL_UOM_QUARTERLY) {
							convertedAmount = amount / 13;
						}
						else 
							if (UOM == PAYROLL_UOM_YEAR) {
								convertedAmount = amount / 52;
							}
							else 
							{
								convertedAmount = amount;
							}
			
			
			break;
		case PAYBIWEEKLY:
			
			if (UOM == PAYROLL_UOM_MONTH) {
				convertedAmount = amount * 12 / 26;
			}
			else 
				if (UOM == PAYROLL_UOM_WEEK) {
					convertedAmount = amount * 2;
				}
				else 
					if (UOM == PAYROLL_UOM_FORTNIGHTLY) {
						convertedAmount = amount;
					}
					else 
						if (UOM == PAYROLL_UOM_QUARTERLY) {
							convertedAmount = amount / 13 * 2;
						}
						else 
							if (UOM == PAYROLL_UOM_YEAR) {
								convertedAmount = amount / 26;
							}
							else 
							{
								convertedAmount = amount;
							}
			
			break;
			
		case PAYFOURWEEKLY:
			
			if (UOM == PAYROLL_UOM_MONTH) {
				convertedAmount = amount * 12 / 13;
			}
			else 
				if (UOM == PAYROLL_UOM_WEEK) {
					convertedAmount = amount * 4;
				}
				else 
					if (UOM == PAYROLL_UOM_FORTNIGHTLY) {
						convertedAmount = amount * 2;
					}
					else 
						if (UOM == PAYROLL_UOM_QUARTERLY) {
							convertedAmount = amount / 13 * 4;
						}
						else 
							if (UOM == PAYROLL_UOM_YEAR) {
								convertedAmount = amount / 13;
							}
							else 
							{
								convertedAmount = amount;
							}
			
			break;
			
		case PAYQUARTERLY:
			
			if (UOM == PAYROLL_UOM_MONTH) {
				convertedAmount = amount * 3;
			}
			else 
				if (UOM == PAYROLL_UOM_WEEK) {
					convertedAmount = amount * 13;
				}
				else 
					if (UOM == PAYROLL_UOM_FORTNIGHTLY) {
						convertedAmount = amount * 26 / 4;
					}
					else 
						if (UOM == PAYROLL_UOM_QUARTERLY) {
							convertedAmount = amount;
						}
						else 
							if (UOM == PAYROLL_UOM_YEAR) {
								convertedAmount = amount * 4;
							}
							else 
							{
								convertedAmount = amount;
							}
			
			break;
			
		
			
		default:
			
			// unable to find the pay frequency.
			nlapiLogExecution('error', "PAYROLL_UOM_INVALID", "Unable to match pay period with UOM so converted amount = amount" + ' payPeriod: ' + payPeriod + ' UOM: ' + UOM);
			convertedAmount = amount;
			break;
	}
	
	return convertedAmount
}

function convertFromWeeklyToPayPeriod(base,payPeriod)
{
	/* This function converts the weekly pay unit to the payperiod for use with ATO tax tables
	 * 
	 */
	
	var payUnit = 0.00
	
	if (payPeriod == PAYMONTHLY)
		{
			payUnit = (base* 13)/3;
		}
		else if (payPeriod == PAYWEEKLY)
		{
			payUnit = base;
		}
		else if (payPeriod == PAYBIWEEKLY)
		{
			payUnit = base*2;
		}
		else if (payPeriod == PAYFOURWEEKLY)
		{
			payUnit = base*4;
		}
		else if (payPeriod == PAYQUARTERLY)
		{
			payUnit = base*13;
		}
	return payUnit;
}


/*
 * function validates Australian Business Numbers.
 * http://www.ato.gov.au/businesses/content.asp?doc=/content/13187.htm&pc=001/003/021/002/001&mnu=610&mfp=001/003&st=&cy=1
 * 
 */
function isValidABN(abnStr)
{	
	var isValidBool = false;
	var sumInt = 0;
	if(abnStr.length == 11)
	{
		var digitaArr = [];
		var weightArr = [10,1,3,5,7,9,11,13,15,17,19];
		
		for(var i=0; i < abnStr.length; i++)
		{
			digitArr.push(parseInt(abnStr[i]));	
		}
		
		digitArr[0] -= 1;
		
		for(var i=0; i < digitArr.length; i++)
		{
			sumInt += digitArr[i] * weightArr[i];
		}
		
		isValidBool = (sumInt % 89 == 0);
	}
	
	return(isValidBool);	
}


function isValidTaxFileNumber(tfnStr,countryId)
{
	var isValidBool = false;
	
	switch(countryId)
	{
		case PAYROLL_COUNTRY_AU:
			
		isValidBool = auTfnValidation(tfnStr);
		
		break;
		case PAYROLL_COUNTRY_NZ:
			
		isValidBool = nzIrdValidation(tfnStr);
		
		break;
		default:
			
		alert("Tax validation for this country is not available");
			
		break;
	}
	
	return isValidBool;
}


/**
 * function validates 9 digit australian tax file numbers.
 * 
 * @param {Object} tfnStr
 * @return {boolean} true if valid false otherwise.
 * 
 * var outputStr = auTfnValidation("648188499");
 * var outputStr = auTfnValidation("648188519");
 * var outputStr = auTfnValidation("648188527");
 * var outputStr = auTfnValidation("648188535");
 * var outputStr = auTfnValidation("353328345");
 * var outputStr = auTfnValidation("648188480");
 * 
 */
function auTfnValidation(tfnStr)
{
	var exceptionArr = {"111111111" : true};
	var isValidBool = false;

	if(tfnStr.length == 8)
	{
		// insert a zero before the check bit.
		tfnStr += tfnStr.charAt(tfnStr.length-1);
		tfnStr[7] = 0;	
	}		
	
	if(tfnStr.length == 9)
	{
		if(exceptionArr[tfnStr] != null)
		{
			// the tfn is an exception return true without
			// comparing against the check.
			isValidBool = true;
		}
		else
		{
			var weightArr = [1,4,3,7,5,8,6,9,10];
			var sumInt = 0;
	
			for(var i=0; i < tfnStr.length; i++)
			{
				
				sumInt += parseInt(tfnStr.charAt(i)) * weightArr[i];	
			}		
			
			isValidBool = (sumInt % 11 == 0);
		}
	}
	
	return(isValidBool);
}

/**
 * function validates 8 and 9 digit new zealand ird numbers.
 * 
 * @param {Object} tfnStr
 * @return {boolean} true if valid false otherwise.
 * 
 * var returnTrue1 = irdValidation("49091850"); // valid
 * var returnTrue2 = irdValidation("35901981"); // valid
 * var returnTrue3 = irdValidation("49098576"); // valid
 * var returnTrue4 = irdValidation("136410132"); // valid
 * var returnFalse5 = irdValidation("136410133"); // invalid
 * var returnFalse6 = irdValidation("9125568"); // should fail
 * var returnFalse7 = irdValidation("150000000"); // should fail
 * 
 */
function nzIrdValidation(irdStr)
{
	var isValidBool = false;
	var irdInt = parseInt(irdStr,"10");
	
	// numbers outside this range are invalid.	
	if(irdInt > 10000000 && irdInt < 150000000)
	{
		var checkDigit = irdStr[irdStr.length-1];
		var wArr = [3,2,7,6,5,4,3,2];
		var sumInt = 0;
		var remInt = 0;

		if(irdStr.length == 8)
		{
			// add a leading zero
			irdStr = "0" + irdStr;
		}
		
		for(var i=0; i < wArr.length; i++)
		{
			sumInt += irdStr[i] * wArr[i];
		}
		
		remInt = sumInt % 11;
		remInt = (remInt != 0) ? Math.abs(remInt - 11) : 0;

		if(remInt == 10)
		{
			var w2Arr = [7,4,3,2,5,2,7,6];
			
			sumInt = 0;
			for(var i=0;  i < w2Arr.length; i++)
			{
				sumInt += irdStr[i] * w2Arr[i];
			}
			
			remInt = sumInt % 11;
			remInt = (remInt != 0) ? Math.abs(remInt - 11) : 0;
		}

		isValidBool = (remInt != 10 && checkDigit == remInt);
	}
	
	return isValidBool;
}


/**
 * 
 * @param {Object} frequency
 */
function frequencyToUOM(frequency)
{
	UOM = ''
	
	switch (frequency) 
	{
		case PAYMONTHLY:
		
		UOM = PAYROLL_UOM_MONTH
		
		break ;
		
		case PAYWEEKLY:
		
		UOM = PAYROLL_UOM_WEEK
		
		break ;
		
		case PAYBIWEEKLY:
		
		UOM = PAYROLL_UOM_FORTNIGHTLY
		
		break ;
		
		case PAYFOURWEEKLY:
		
		UOM = PAYROLL_UOM_FOURWEEKLY
		
		break ;
		
		case PAYQUARTERLY:
		
		UOM = PAYROLL_UOM_QUARTERLY
		
		break ;
		
		case PAYANNUAL:
		
		UOM = PAYROLL_UOM_YEAR
		
		break ;
		
	}
	
	return UOM;
		
}

var payrollInitBool = false;
var payrollInitPendingBool = false;
var payroll = {};

/**
 * function initialises the payroll object.
 * @param {Object} subsidiaryId
 */
function initPayroll(subsidiaryId)
{
	var errorStr = "";

	if(isNullOrEmpty(subsidiaryId))
	{
		subsidiaryId = "";	
	}
	
	try
	{
		payrollInitPendingBool = true;		
		var jsonUrlStr = nlapiResolveURL("SUITELET","customscript_sl_pr_json","customdeploy_sl_pr_json");
		var response = nlapiRequestURL(jsonUrlStr,{"custparam_subsidiary": subsidiaryId},null,null);
		payrollInitPendingBool = false;		
		
		if(response.getCode() != "200")
		{
			// a problem occurred in running the script.
			errorStr = "PAYROLL_INIT_REQUEST_ERROR: The json call returned the status code " + response.getCode();	
		}
		else
		{
			var resultArr = JSON.parse(response.getBody());

			if(!resultArr['success'])
			{
				// a problem occurred whilst obtaining the data display a message.
				errorStr = "PAYROLL_INIT_SCRIPT_ERROR: The json call returned success of false " + resultArr["message"];
				payrollInitBool = false;
			}
			else
			{
				payroll = resultArr["result"];
				payrollInitBool = true;
			}
		}
	}
	catch(ex)
	{
		errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() : ex.toString();
		payrollInitBool = false;
	}
	
	if(!isNullOrEmpty(errorStr))
	{
		alert("We have been unable to initialise payroll details . This problem may have occurred because your session has timed out. Please login again and retry. \n\n" + errorStr);	
	}
}

function getFBTReportableValue(empId,taxYear,FBTType)
{
	var amount = 0.00
	var columns = new Array();
	columns.push(new nlobjSearchColumn("custrecord_pr_efbt_reportable_value",null,"sum"));
	var filters = new Array();
	if(!isNullOrEmpty(empId))
	{
		filters.push(new nlobjSearchFilter('custrecord_pr_efbt_employee', null, 'anyof', empId));
	}
    if (!isNullOrEmpty(taxYear)) 
	{
		filters.push(new nlobjSearchFilter('custrecord_pr_efbt_tax_year', null, 'anyof', taxYear));
	}
	if (!isNullOrEmpty(FBTType)) 
	{
		filters.push(new nlobjSearchFilter('custrecord_pr_fbts_employee', null, 'anyof', FBTType));
	}
	
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
    var amount = 0.00;
    //nlapiLogExecution("debug","debug","ytd pre sum is " + ytd);
    var searchResults = nlapiSearchRecord('customrecord_pr_emp_fbt', null, filters, columns);
    if (searchResults!= null)
    {
    	var amount = setFloat(searchResults[0].getValue("custrecord_pr_efbt_reportable_value",null,"sum"))
    	
    }
	return amount;
}

function getEmployeePostingAssignment(expenseAllocation,subType)
{
	//nlapiLogExecution('debug','getBasePayComponent','empId: ' + empId);
	var filters = new Array();
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('custrecord_pr_exp_type', null, 'anyof', expenseAllocation));
	filters.push(new nlobjSearchFilter('custrecord_pr_exp_pcst', null, 'anyof', subType));
	
	var columns = new Array();
	columns.push(new nlobjSearchColumn('custrecord_pr_exp_account'));
	
	var empPostingSearch = nlapiSearchRecord('customrecord_pr_expense_allocation',null,filters,columns);
	var empCOA = '';
	
	var supTypeName = nlapiLookupField('customrecord_pr_pcst',subType,'name');
	
	if (empPostingSearch != null) 
	{
		if (empPostingSearch.length == '1')
		{
			empCOA = empPostingSearch[0].getValue('custrecord_pr_exp_account');
			//nlapiLogExecution('debug','getEmployeePostingAssignment','empCOA: ' + empCOA)
		}
		else
		{
			throw nlapiCreateError("NO_UNIQUE_COA_ASSIGNMENT","NO COA FOUND FOR + " + supTypeName + 'expenseAllocation' + expenseAllocation);
		}
	}
	else
	{
		//nlapiLogExecution('debug','NO COA ASSIGNMENT FOUND','expenseAllocation: ' + expenseAllocation + ' supTypeName: ' + supTypeName);
	}
	
	return empCOA;
}


function prProgressPopup(titleStr,messageStr)
{
	var popupHtmlStr = '<TABLE width="100%" cellspacing="0" cellpadding="0" border="0"><TBODY><TR><TD style="width:10; height:30" colspan=2>'
	+ '<IMG width="10" height="100%" border="0" src="/images/icons/popup/pdiv_header_l.gif"/>'
	+ '</TD><TD style="height:30"><TABLE width="100%" height="100%" cellspacing="0" cellpadding="0" ><TBODY><TR>'
	+ '<TD valign="middle" nowrap="" style="padding-left: 2px; background-image: url(/images/icons/popup/pdiv_header_bg.gif);"></TD>'
	+ '<TD align="center" nowrap="" class="smalltextb" style="padding-right: 1px; background-image: url(/images/icons/popup/pdiv_header_bg.gif);"><FONT color="#000000">' + titleStr +  '</FONT></TD></TR></TBODY></TABLE></TD><TD style="width:10;height:30" colspan=2><IMG width="10" height="100%" border="0" src="/images/icons/popup/pdiv_header_r.gif"/></TD>'
	+ '</TR><TR style="background:#ffffff">'
	+ '<TD width=1 bgcolor="#999999"><img src="/images/nav/ns_x.gif" width=1 height=1 alt=""></TD>'
	+ '<TD width=9 bgcolor="#FFFFFF" style="background-image: url(/images/icons/popup/pdiv_b_gradient.gif); background-repeat: repeat-x; background-position: bottom;"><img src="/images/nav/ns_x.gif" width=9 height=1 alt=""/></TD>'
	+ '<TD width=100% align="center" style="background-image:url(/images/icons/popup/pdiv_b_gradient.gif); background-position:bottom; background-repeat:repeat-x">'
	+ '<table cellspacing=5 cellpadding=0 class="smalltextnolink"><tr><td width=\'100%\'>' + msgStr + '</td></tr></table> </TD>'
	+ '<TD width=9 bgcolor="#FFFFFF" style="background-image: url(/images/icons/popup/pdiv_b_gradient.gif); background-repeat: repeat-x; background-position: bottom;"><img src="/images/nav/ns_x.gif" width=9 height=1 alt=""/></TD>'
	+ '<TD width=1 bgcolor="#999999"><img src="/images/nav/ns_x.gif" width=1 height=1 alt=""></TD>'
	+ '</TR><TR>'
	+ '<TD width=10 colspan=2><IMG SRC="/images/icons/popup/pdiv_ll.gif" ALT="" WIDTH=10 HEIGHT=10 BORDER=0/></TD>'
	+ '<TD background="/images/icons/popup/pdiv_b_bg.gif" width="100%" align=left><IMG src="/images/nav/ns_x.gif" width=1 height=1 alt=""/></TD>'
	+ '<TD width=10 colspan=2><IMG SRC="/images/icons/popup/pdiv_lr.gif" ALT="" WIDTH=10 HEIGHT=10 BORDER=0/></TD></TR></TBODY></TABLE>';

	var a = nlOpenPopup(window, S_POPUP_SIMPLE, popupHtmlStr, null, false, 400, 200, null,null, false, true);
	a.resize(true,POPUP_LAYOUT_STYLE_DEFAULT);
	a.setPosition();
	a.display(true, 200);	
	a.blockInput();
}

function getHoursPerStandardWeek(workingWeekId)
{
   var weekRec = nlapiLoadRecord("customrecord_pr_working_week",workingWeekId);
   var hours = 0.00 ;
   
   for(var i=0; i < 7; i++)
   {
       hours += parseFloat(weekRec.getFieldValue("custrecord_pww_day_hour_" + i));
   }

   return hours;
}

function getWorkDaysPerStandardWeek(workingWeekId)
{
   var weekRec = nlapiLoadRecord("customrecord_pr_working_week",workingWeekId);
   var workingDaysPerStandardWeek = 0.00
   
   for(var i=0; i < 7; i++)
   {
       var dayHoursFloat = parseFloat(weekRec.getFieldValue("custrecord_pww_day_hour_" + i));
	   var addDays = setFloat(dayHoursFloat > 0.00 ? 1 : 0);
	   workingDaysPerStandardWeek += addDays;
	   nlapiLogExecution('debug','getWorkDaysPerStandardWeek','addDays: ' + addDays + 'workingDaysPerStandardWeek: ' + workingDaysPerStandardWeek);
   }

   return workingDaysPerStandardWeek;
}

function getSubTypeDetails()
{
    var subTypeArr = {};
    var columns = [
        new nlobjSearchColumn('name'),
        new nlobjSearchColumn('custrecord_pr_pcst_pc_type'),
        new nlobjSearchColumn('custrecord_pr_pcst_pcc'),
        new nlobjSearchColumn('custrecord_pr_pcst_rate'),
        new nlobjSearchColumn('custrecord_pr_pcst_taxable'),
        new nlobjSearchColumn('custrecord_pr_pcst_ote'),
        new nlobjSearchColumn('custrecord_pr_pcst_ote_rate'),
        new nlobjSearchColumn('custrecord_pr_pcst_pandl_acc'),
        new nlobjSearchColumn('custrecord_pr_pcst_accrual_account'),
        new nlobjSearchColumn('custrecord_pr_pcst_time_entry'),
        new nlobjSearchColumn('custrecord_pr_pcst_var'),
        new nlobjSearchColumn('custrecord_pr_pcst_prt_exempt'),
        new nlobjSearchColumn('custrecord_pr_pcst_super_threshold'),
        new nlobjSearchColumn('custrecord_pr_pcst_payslip_group'),
        new nlobjSearchColumn('custrecord_pr_pcst_pay_summ_loc'),
        new nlobjSearchColumn('custrecord_pr_pcst_show_pc'),
        new nlobjSearchColumn('custrecord_pr_pcst_percent_type'),
        new nlobjSearchColumn('custrecord_pr_pcst_sconst'),
        new nlobjSearchColumn('custrecord_pr_pcst_use_rate_table'),
        new nlobjSearchColumn('custrecord_pr_pcst_rate_type'),
        new nlobjSearchColumn('custrecord_pr_pcst_hourly_rate')];


    var filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')];

    var search = nlapiCreateSearch('customrecord_pr_pcst',filters,columns);
    var resultSet = search.runSearch();
    var resultCount = 0;
    resultSet.forEachResult(function(r)
    {
        subTypeArr[r.getId()] = {
            typeId : r.getValue('custrecord_pr_pcst_pc_type'),
            category : r.getValue('custrecord_pr_pcst_pcc'),
            rate : r.getValue('custrecord_pr_pcst_rate'),
            taxable : r.getValue('custrecord_pr_pcst_taxable'),
            ote : r.getValue('custrecord_pr_pcst_ote'),
            oteRate : r.getValue('custrecord_pr_pcst_ote_rate'),
            subTypeName : r.getValue('name'),
            expenseAccount : r.getValue('custrecord_pr_pcst_pandl_acc'),
            expenseAccountName :  r.getText('custrecord_pr_pcst_pandl_acc'),
            accrualAccount : r.getValue('custrecord_pr_pcst_accrual_account'),
            showInTime : r.getValue('custrecord_pr_pcst_time_entry'),
            variable : r.getValue('custrecord_pr_pcst_var'),
            payrollTaxExempt : setFloat(r.getValue('custrecord_pr_pcst_prt_exempt')),
            superThreshold : setFloat(r.getValue('custrecord_pr_pcst_super_threshold')),
            percentage : setFloat(r.getValue('custrecord_pr_pcst_pay_summ_loc')),
            showInPC : r.getValue('custrecord_pr_pcst_show_pc'),
            paymentSummaryLocation : r.getValue('custrecord_pr_pcst_percent_type'),
            id : r.getValue('custrecord_pr_pcst_sconst'),
            useRates : r.getValue('custrecord_pr_pcst_use_rate_table'),
            rateType : r.getValue('custrecord_pr_pcst_rate_type'),
            hourlyrate : r.getValue('custrecord_pr_pcst_hourly_rate')
        };

        resultCount++;
        return true;
    });

    // nlapiLogExecution("audit","getSubTypeDetails","resultcount: " + resultCount + ' len: ' + JSON.stringify(subTypeArr).length);

    return subTypeArr;
}

function getSubTypeRates(showInTimeEntryBool,empIdArr)
{
    var subRateObj = {};
	var columns = [
        new nlobjSearchColumn('custrecord_pr_pcrt_subtype'),
	    new nlobjSearchColumn('custrecord_pr_pcrt_scriptid'),
        new nlobjSearchColumn('custrecord_pr_pcrt_rate_type'),
        new nlobjSearchColumn('custrecord_pr_pcrt_employee'),
        new nlobjSearchColumn('custrecord_pr_pcrt_tax_year'),
        new nlobjSearchColumn('custrecord_pr_pcrt_hourly_rate'),
        new nlobjSearchColumn('custrecord_pr_pcrt_daily_rate'),
        new nlobjSearchColumn('custrecord_pr_pcrt_weekly_rate')];
	
	
	var filters = [new nlobjSearchFilter('isinactive', null, 'is', 'F')];
	if(showInTimeEntryBool)
	{
		filters.push(new nlobjSearchFilter('custrecord_pr_pcrt_time_entry', null, 'is', 'T'))
	}
	
	if(!isNullOrEmpty(empIdArr))
	{
		filters.push(new nlobjSearchFilter('custrecordcustrecord_pr_pcrt_rate_type', null, 'anyof', empIdArr))
	}

    var search = nlapiCreateSearch('customrecord_pr_rate_table',filters,columns);
    var resultSet = search.runSearch();
    var resultCount = 0;
    resultSet.forEachResult(function(r)
    {
		var subTypeId = r.getValue('custrecord_pr_pcrt_subtype');
		var scriptId = r.getValue('custrecord_pr_pcrt_scriptid');
		var rateType = r.getValue('custrecord_pr_pcrt_rate_type');
		var empId = r.getValue('custrecord_pr_pcrt_employee');
		var taxYear = r.getValue('custrecord_pr_pcrt_tax_year')
		
		//alert('rateType: ' + rateType + ' taxYear: ' + taxYear + ' scriptId: ' + scriptId);
		
		var keyStr = rateType == '1' ? 'TY' + scriptId + '-' + taxYear : empId + "-" + subTypeId;
		//alert('keyStr: ' + keyStr);
		
        subRateObj[keyStr] = {
            'subTypeId' : subTypeId,
            'scriptId' : r.getValue('custrecord_pr_pcrt_scriptid'),
            'rateType' : rateType,
            'emp' : empId,
            'taxYear' : taxYear,
            'hourly' : r.getValue('custrecord_pr_pcrt_hourly_rate'),
            'daily' : r.getValue('custrecord_pr_pcrt_daily_rate'),
            'weekly' :  r.getValue('custrecord_pr_pcrt_weekly_rate')
        };

        resultCount++;
        return true;
    });
	
	//alert('subRateObj: ' + JSON.stringify(subRateObj))

    nlapiLogExecution("audit","getSubTypeDetails","resultcount: " + resultCount + ' subRateObj: ' + JSON.stringify(subRateObj));

	return subRateObj;
}


function isValidUkTaxCode(inputStr)
{
	return /^(\d{1,6}[TLPVY]{1})|(K\d{1,6})|BR|0T|D0|D1|NT|FT/.test(inputStr);
}


/**
 * comprises two letters 6 numbers and 1 letter
 */
function isValidUkNIN(inputStr)
{
	// D,F,I,Q,U,V are not used as first or second letter
	//[A-CEG-HK-PRSTW-Z]{2}\n{6}[A-Z]{1}

	return /^(AA|AB|AE|AH|AK|AL|AM|AP|AR|AS|AT|AW|AX|AY|AZ BA|BB|BE|BH|BK|BL|BM|BT|CA|CB|CE|CH|CK|CL|CR|EA|EB|EE|EH|EK|EL|EM|EP|ER|ES|ET|EW|EX|EY|EZ|GY|HA|HB|HE|HH|HK|HL|HM|HP|HR|HS|HT|HW|HX|HY|HZ|JA|JB|JC|JE|JG|JH|JJ|JK|JL|JM|JN|JP|JR|JS|JT|JW|JX|JY|JZ|KA|KB|KE|KH|KK|KL|KM|KP|KR|KS|KT|KW|KX|KY|KZ|LA|LB|LE|LH|LK|LL|LM|LP|LR|LS|LT|LW|LX|LY|LZ|MA|MW|MX|NA|NB|NE|NH|NL|NM|NP|NR|NS|NW|NX|NY|NZ|OA|OB|OE|OH|OK|OL|OM|OP|OR|OS|OX|PA|PB|PC|PE|PG|PH|PJ|PK|PL|PM|PN|PP|PR|PS|PT|PW|PX|PY RA|RB|RE|RH|RK|RM|RP|RR|RS|RT|RW|RX|RY|RZ|SA|SB|SC|SE|SG|SH|SJ|SK|SL|SM|SN|SP|SR|SS|ST|SW|SX|SY|SZ TA|TB|TE|TH|TK|TL|TM|TP|TR|TS|TT|TW|TX|TY|TZ|WA|WB|WE|WK|WL|WM|WP|YA|YB|YE|YH|YK|YL|YM|YP|YR|YS|YT|YW|YX|YY|YZ|ZA|ZB|ZE|ZH|ZK|ZL|ZM|ZP|ZR|ZS|ZT|ZW|ZX|ZY)\d{6}[ABCD]{1}$/.test(inputStr);
}

function getTaxYear(payDate,jurisdiction)
{
    var taxYear;

    payDate = isNullOrEmpty(payDate) ? nlapiDateToString(new Date()) : payDate;
    //nlapiLogExecution('debug','getTaxYear','payDate: ' + payDate + ' jurisdiction: ' + jurisdiction);

    var filters = new Array();
    if(jurisdiction == PAYROLL_COUNTRY_AU || isNullOrEmpty(jurisdiction))
    {
        filters.push(new nlobjSearchFilter('custrecord_pr_tax_year_start', null, 'onorbefore', payDate));
        filters.push(new nlobjSearchFilter('custrecord_pr_tax_year_end', null, 'onorafter', payDate));
    }
    else
    {
        var countryFieldArr =  nlapiLookupField('customrecord_pr_jurisdiction',jurisdiction,['custrecord_prj_end_day','custrecord_prj_end_month']);
        var dayStr = countryFieldArr['custrecord_prj_end_day'];
        var monthStr = countryFieldArr['custrecord_prj_end_month'];
        var taxYearEndDate = getTaxYearEndDate(dayStr,monthStr,payDate);
        var taxYearStr = taxYearEndDate.getFullYear();
        //nlapiLogExecution('debug','taxYearStr','dayStr: ' + dayStr + ' monthStr: ' + monthStr + ' taxYearEndDate: ' + taxYearEndDate + ' taxYearStr: ' + taxYearStr)
        filters.push(new nlobjSearchFilter('custrecord_pr_tax_year_end_year', null, 'is', taxYearStr.toString()));
    }

    var taxYearResults = nlapiSearchRecord('customrecord_pr_tax_year',null,filters,null);

    if (taxYearResults != null)
    {
        if (taxYearResults.length == '1')
        {
            taxYear = taxYearResults[0].getId();
            //nlapiLogExecution('debug','getTaxYear','taxYear: ' + taxYear)
        }
        else
        {
            throw nlapiCreateError("NO_UNIQUE_TAX_YEAR","No UNIQUE tax year found: " + payDate);
        }
    }
    else
    {
        throw nlapiCreateError("NO_TAX_YEAR","No tax year found pay date: " + payDate);
    }

    return taxYear;
}

function getTaxYearEndDate(dayStr,monthStr,inputDateStr)
{
    var inputDate = nlapiStringToDate(inputDateStr);
    var yearEndDate = new Date(inputDate.getFullYear(),monthStr-1,dayStr);
    var currentYearEnd = inputDate > yearEndDate ? nlapiAddMonths(yearEndDate,12) : yearEndDate;

    return currentYearEnd;
}
/**
 * Function evaluates whether valueStr is a null, empty or undefined value.
 * @param {String} valueStr
 * @return {Boolean} function returns true if defined or false otherwise.
 */
function isNullOrEmpty(valueStr)
{
	return(valueStr == null || valueStr == "" || valueStr == undefined);	
}

function isNullSet(valueStr,setStr)
{
	return !isNullOrEmpty(valueStr) ? valueStr : setStr;
}


/**
 * Function returns a float number,m rounded based on the precision applying the appropriate rounding method. If parseFloat of valueStr is NaN
 * 0 will be returned, if precisionInt is NaN the parseFloat of ValueStr will be returned.
 * 
 * @param {string} valueStr
 * @param {integer} precisionInt number of decimal places to round to.
 * @param {string} roundMethodStr accepts "up" to round by ceil, "down" to round by floor, all others performs a round.
 * @returns {number} floating point representation of the number.
 */
function setFloat(valueStr,precisionInt,roundMethodStr)
{
    var resultFloat = isNaN(parseFloat(valueStr)) ? 0.00 : parseFloat(valueStr);
    //nlapiLogExecution('audit','setFloat','resultFloat: ' + resultFloat)
    precisionInt = parseInt(precisionInt);

    if(!isNaN(precisionInt) && resultFloat > 0.00)
    {
        // use toFixed to round to 1 additional level of precision
        //var roundInputStr = resultFloat.toFixed(precisionInt + 1);
        var roundInputFloat = resultFloat;

        //nlapiLogExecution('audit','setFloat','roundInputFloat: ' + roundInputFloat)

        if(roundMethodStr == 'NIround')
        {
            resultFloat = fixJSRounding(parseFloat(valueStr));
            roundInputFloat = parseFloat(resultFloat);
            var toFixedPrecision = precisionInt + 1;
            var toFixed3 = (Math.floor(fixJSRounding(resultFloat * Math.pow(10,toFixedPrecision))) / Math.pow(10,toFixedPrecision)).toFixed(toFixedPrecision);
            var lastDecimal = parseInt(toFixed3.charAt(toFixed3.length-1),10);
            roundMethodStr = (lastDecimal > 5) ? 'up' : 'down';
            //nlapiLogExecution('audit','NIround','toFixedPrecision: ' + toFixedPrecision + ' toFixed3: ' + toFixed3 + ' lastDecimal: ' + lastDecimal + ' roundMethodStr: ' + roundMethodStr + ' valueStr: ' + valueStr);
        }

        switch(roundMethodStr)
        {
            case 'up':

                resultFloat = fixJSRounding(parseFloat(valueStr));
                roundInputFloat = parseFloat(resultFloat);
                resultFloat = Math.ceil(roundInputFloat * Math.pow(10,precisionInt)) / Math.pow(10,precisionInt);

                //nlapiLogExecution('audit','roundup','valueStr: ' + valueStr + ' roundInputFloat: ' + roundInputFloat  + ' ceiling: ' + roundInputFloat * Math.pow(10,precisionInt) + ' numerator: ' + Math.pow(10,precisionInt) + ' precisionInt: ' + precisionInt + ' resultFloat: ' + resultFloat );

                break;

            case 'down':

                resultFloat = fixJSRounding(parseFloat(valueStr));
                roundInputFloat = parseFloat(resultFloat);
                //check number of decimals and if number is less than or equal to current preceision then do nothing.

                var floatStr = roundInputFloat.toString();
                var floatStrLen = floatStr.length;
                var decimalLocation = floatStr.indexOf(".");

                //nlapiLogExecution('audit','check currentPrecision1','floatStr: ' + floatStr + ' floatStrLen: ' + floatStrLen + ' decimalLocation: ' + decimalLocation);

                if(decimalLocation > 0)
                {
                    var decimalLen = floatStrLen - decimalLocation;
                    var decimalStr = floatStr.substr(decimalLocation +1,decimalLen);
                    var currentPrecision = decimalStr.length;

                    //nlapiLogExecution('audit','check currentPrecision2','decimalLen: ' + decimalLen + ' decimalStr: ' + decimalStr + ' currentPrecision: ' + currentPrecision);

                    if(currentPrecision > precisionInt)
                    {
                        resultFloat = Math.floor(fixJSRounding(roundInputFloat * Math.pow(10,precisionInt))) / Math.pow(10,precisionInt);
                    }
                }

                //nlapiLogExecution('audit','round down','valueStr: ' + valueStr + ' resultFloat: ' + resultFloat + ' number to floor: ' + fixJSRounding(roundInputFloat * Math.pow(10,precisionInt)));

                break;
            default:

                resultFloat = Math.round(roundInputFloat * Math.pow(10,precisionInt)) / Math.pow(10,precisionInt);

                break;
        }
    }

    return resultFloat;
}

function fixJSRounding (valueFloat)
{
    return Math.round(valueFloat * Math.pow(10,10)) / Math.pow(10,10);
}


/**
 * Generic function for logging exception based errors should be called in all try catch clauses
 * @param {ExceptionObject} exceptionObj either javascript or nlobjError
 * 
 */
function logPayRollException(exceptionObj,variableArr,payRunId,paySlipId,logArr)
{
	var errorDataArr = {};
	var ctxObj = nlapiGetContext();
	
	errorDataArr["exception"] = (exceptionObj.getCode != null) ? exceptionObj.getCode() + '\n' + exceptionObj.getDetails() + '\n' + exceptionObj.getStackTrace().join("\n") : exceptionObj.toString();
	errorDataArr["error"] = errorDataArr["exception"]; //getCustomExceptionMessage(exceptionObj);
	
	if(!isNullOrEmpty(ctxObj))
	{
		// lets gather some additional details from th context object to help diagnose where the problem exists:
		errorDataArr["script"] = ctxObj.getScriptId();
		errorDataArr["user"] = ctxObj.getName();
		errorDataArr["email"] = ctxObj.getEmail();
		errorDataArr["context"] = ctxObj.getExecutionContext();
		errorDataArr["role"] = ctxObj.getRole();
		errorDataArr["companyid"] = ctxObj.getCompany();
		errorDataArr["rolecenter"] = ctxObj.getRoleCenter();
		errorDataArr["environment"] = ctxObj.getEnvironment();
	}
	
	if (!isNullOrEmpty(payRunId))
	{
		createPayrollHistory(PAYROLL_ACTION_START_PAYRUN,PAYROLL_FAILURE,'Error in payroll process. Error message is: ' + errorDataArr["error"],payRunId);
	}

	if(!isNullOrEmpty(payRunId))
	{
		errorDataArr["payrunid"] = payRunId;
	}

	if(!isNullOrEmpty(paySlipId))
	{
		errorDataArr["payslipid"] = paySlipId;
	}

    if(!isNullOrEmpty(logArr))
    {
        errorDataArr["log"] = logArr;
    }
	
	if(!isNullOrEmpty(variableArr))
	{
		errorDataArr["variables"] = variableArr;
		nlapiLogExecution('error',errorDataArr["error"],JSON.stringify(variableArr,null,'\t'));
	}
	else
	{
		nlapiLogExecution("error","logPayRollException",errorDataArr["error"]);	
	}

	makeJsonRpcCall(genJsonRpcRequest("logerror",errorDataArr));
	
	// log the details and potential send an email to proactively manage exceptions.
	return(errorDataArr["error"]);
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


function getCustomExceptionMessage(exceptionObj)
{
	nlapiLogExecution("debug","getCustomExceptionMessage","called");
	var remainingUsageInt = nlapiGetContext().getRemainingUsage();
	var hrResponseStr = (exceptionObj.getCode != null) ? exceptionObj.getCode() + '\n' + exceptionObj.getDetails() : exceptionObj.toString();
	
	if(remainingUsageInt > 20 && exceptionObj.getCode != null)
	{
		try
		{
			var exCodeStr = exceptionObj.getCode();
			var exMessageStr = exceptionObj.getDetails();
			var recordId = "";
			var fieldId = "";
			var filterStr = "";

			// for currency // for subsidiary
			
			if(exCodeStr == "INVALID_KEY_OR_REF")
			{
				nlapiLogExecution("debug","getCustomExceptionMessage","in invalid key or ref");
				var rxFieldTypeStr = new RegExp(/Invalid ([a-z_]*) reference/);
				var rxId = new RegExp(/reference key (\d+)/);
				var rxFilter = new RegExp(/reference key \d+ (for.*)/);

				fieldId = (rxFieldTypeStr.test(exMessageStr)) ? exMessageStr.match(rxFieldTypeStr)[1] : "";
				recordId = (rxId.test(exMessageStr)) ? exMessageStr.match(rxId)[1] : "";
				
				if(rxFilter.test(exMessageStr))
				{
					// invalid check includes a filter.
					filterStr = exMessageStr.match(rxFilter)[1];
				}
				
				nlapiLogExecution("debug","getCustomExceptionMessage","fieldId: " + fieldId + " recordId: " + recordId);
			}

			var columnsArr = [
              new nlobjSearchColumn("custrecord_pr_xm_code"),
              new nlobjSearchColumn("custrecord_pr_xm_fieldid"),
              new nlobjSearchColumn("custrecord_pr_xm_fieldname"),
              new nlobjSearchColumn("custrecord_pr_xm_fieldsrctype"),
              new nlobjSearchColumn("custrecord_pr_xm_record"),
              new nlobjSearchColumn("custrecord_pr_xm_custommessage"),
              new nlobjSearchColumn("custrecord_pr_xm_link"),
              new nlobjSearchColumn("custrecord_pr_xm_help"),
              new nlobjSearchColumn("custrecord_pr_xm_record_labelfield")
			];
			
			var filtersArr = [new nlobjSearchFilter("custrecord_pr_xm_code",null,"is",exCodeStr)];
			
			if(!isNullOrEmpty(fieldId))
			{
				filtersArr.push(new nlobjSearchFilter("custrecord_pr_xm_fieldid",null,"is",fieldId));
			}

			var searchResults = nlapiSearchRecord("customrecord_pr_ex_message",null,filtersArr,columnsArr);			
			
			if(!isNullOrEmpty(searchResults) && searchResults.length == 1)
			{
				// we have the fields needed for a custom message.
				var rowObj = searchResults[0];
				var recordTypeStr = rowObj.getValue("custrecord_pr_xm_fieldsrctype");
				var messageStr = rowObj.getValue("custrecord_pr_xm_custommessage");
				
				var helpUrlStr = (!isNullOrEmpty(rowObj.getValue("custrecord_pr_xm_help"))) ? nlapiResolveURL("SUITELET","customscript_pr_help","customdeploy_pr_help") + "&custparam_helpid=" + rowObj.getValue("custrecord_pr_xm_help") : "";
				var recordUrlStr = (rowObj.getValue("custrecord_pr_xm_link") == "T" && !isNullOrEmpty(recordTypeStr)) ? nlapiResolveURL("RECORD",recordTypeStr,recordId) : "";
				var helpLinkStr = (!isNullOrEmpty(helpUrlStr)) ? " <a href='" + helpUrlStr + "' target='_new'>help</a> " : "";
				var recordLabelStr = (!isNullOrEmpty(recordTypeStr) && !isNaN(recordId)) ? recordTypeStr + ": " + nlapiLookupField(recordTypeStr,recordId,"companyname") : recordTypeStr + "(id: " + recordId + ")";
				var recordLinkStr =  (!isNullOrEmpty(recordUrlStr)) ? "<a href='" + recordUrlStr + "' target='_new'>" + recordLabelStr + "</a> " : "";

				// finally lets fine the name of the record
				
				hrResponseStr = recordLinkStr + helpLinkStr + messageStr + filterStr;
			}
		}
		catch(ex)
		{
			// log the exception silently
			nlapiLogExecution("debug","getCustomExceptionMessage",(ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() + '\n' + ex.getStackTrace().join("\n") : ex.toString());
		}
	}

	return hrResponseStr;
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
		var digitArr = [];
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


/**
 * function validates 9 digit australian tax file numbers.
 * 
 * @param {Object} tfnStr
 * @return {boolean} true if valid false otherwise.
 * 
 * var outputStr = isValidTaxFileNumber("648188499");
 * var outputStr = isValidTaxFileNumber("648188519");
 * var outputStr = isValidTaxFileNumber("648188527");
 * var outputStr = isValidTaxFileNumber("648188535");
 * var outputStr = isValidTaxFileNumber("353328345");
 * var outputStr = isValidTaxFileNumber("648188480");
 * 
 */
function isValidTaxFileNumber(tfnStr)
{
	var weightArr = [1,4,3,7,5,8,6,9,10];
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
 * function formats the TFN number into groups of 3 if the lenth is 9 characters.
 * @param {String} tfnStr
 */
function formatTFN(tfnStr)
{
	var outputStr = "";
	
	if(!isNullOrEmpty(tfnStr) && tfnStr.length == 9)
	{
		outputStr = tfnStr.substr(0,3) + " " + tfnStr.substr(3,3) + " " + tfnStr.substr(6,3);			
	}
	else
	{
		outputStr = tfnStr;
	}
	
	return(outputStr);
}


/**
 * function returns ABN number in format xx xxx xxx xxx
 * @param {string} abnStr
 */
function formatABN(abnStr)
{
	var outputStr = "";
	
	// first strip any non numeric characters in case formatting already exists.
	abnStr = abnStr.replace(/[^0-9]+/g,"");
	
	if(!isNullOrEmpty(abnStr) && abnStr.length == 11)
	{
		outputStr = abnStr.substr(0,2) + " " + abnStr.substr(2,3) + " " + abnStr.substr(5,3) + " " + abnStr.substr(8,3);
	}	
	else
	{
		outputStr = abnStr;
	}
	
	return(outputStr);
}


function formatCurrency(amountFloat,currSymbol)
{
	var n = setFloat(amountFloat);
	var c = 2; 
	var d = ".";
	var t = ",";
	var sym = currSymbol == undefined ? "$" : currSymbol;
	var s = n < 0 ? "-" : "";
	var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
    return s + sym + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
}


function genJsonRpcRequest(methodStr,paramArr)
{
	var ctxObj = nlapiGetContext();
	var rpcRequestObj = {
		"jsonrpc" 	: "2.0",
		"method"	: methodStr,
		"nscompid"	: ctxObj.getCompany()
	};
	
	if(!isNullOrEmpty(paramArr))
	{
		for(var keyStr in paramArr)
		{
			if(keyStr != "jsonrpc" && keyStr != "method" && keyStr != "nscompid")
			{
				rpcRequestObj[keyStr] = paramArr[keyStr];	
			}			
		}
	}
	
	var stringifyStr = JSON.stringify(rpcRequestObj);
	return(stringifyStr);
}



function makeJsonRpcCall(requestJsonRpcStr)
{
	
	var rpcResponseObj = {"jsonrpc" : "2.0"};
	var headerArr = {
		"Content-Type" : "json/application"
	};
	
	try
	{
		var htmlObj = nlapiRequestURL(URL_LISTENER,requestJsonRpcStr,headerArr);
		
		if(htmlObj.getCode() == "200")
		{
			var htmlStr = htmlObj.getBody();
			rpcResponseObj = JSON.parse(htmlStr);
		}
	}
	catch(ex)
	{
		var errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() + '\n' + ex.getStackTrace().join("\n") : ex.toString();				
		nlapiLogExecution("error","main",errorStr);
		rpcResponseObj["error"] = {"code" : "-32700", "message" : "Parse Error"}; 		
	}
	
	return(rpcResponseObj);
}

/**
 * Function returns the number number of whole days between the two supplied dates
 * @param {date} dateObj1 first date to compare
 * @param {date} dateObj2 second date to compare
 */
function daysBetween(dateObj1,dateObj2) 
{
    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24;
    return(Math.round(Math.abs(dateObj2.getTime()- dateObj1.getTime())/ONE_DAY));
}

function getSetDisplayHidden(fieldId)
{
	getSetDisplayType(fieldId,"hidden");
}

function getSetDisplayType(fieldId,displayTypeStr)
{
	var fieldObj = nlapiGetField(fieldId);
	
	if(!isNullOrEmpty(fieldObj))
	{
		fieldObj.setDisplayType(displayTypeStr);
		//nlapiLogExecution("debug","getSetDisplayType","fieldId: " + fieldId + " displayTypeStr: " + displayTypeStr);
	}
	else
	{
		nlapiLogExecution("debug","getSetDisplayType","failed: " + fieldId + " displayTypeStr: " + displayTypeStr);
	}
}

/** Function accepts the result of an nlapiSearchRecord call and converts the result set
 * into an array of associative arrays representing the ordered result set e.g.
 * 
 * @param {nlObjSearchResult} nlsResults as returned from nlapiSearchRecord
 * @see getDataFromSearchRow
 */
function getSearchData(nsResults)
{
	var resultsDataArr = {};
	
    var columnsArr = (nsResults != null && nsResults.length > 0) ? nsResults[0].getAllColumns() : new Array();
	
	for(var i=0; nsResults != null && i < nsResults.length; i++)
	{
		var resultDataArr = getDataFromSearchRow(columnsArr,nsResults[i])
		resultsDataArr[nsResults[i].getId()] = resultDataArr
	}
	
	return resultsDataArr;
}



/** function iterates over the column definition array returned from .getAllColumns and returns an associative array
 * of data representing the row. For each column found two values are returned t_fieldname, v_valuename corresponding
 * to .getText and .getValue respectively.
 * 
 * 
 * @param {nlobjColumn} columnsArr an array of nlobjColumn objects used to iterate over the searchResult row
 * @param {nlObjSearchRow} searchResult
 * @see getSearchData
 */
function getDataFromSearchRow(columnsArr,searchResult)
{
	var rowArr = {};
	var fieldNameStr = "";
	var fieldJoinStr = "";
	var fieldSummaryStr = "";
	var resultArr = [];

	for(var i=0; columnsArr != null && i < columnsArr.length; i++)
	{	
		fieldNameStr = columnsArr[i].getName();
		fieldJoinStr = columnsArr[i].getJoin();
		fieldSummaryStr = columnsArr[i].getSummary();
		
		rowArr[fieldNameStr] = searchResult.getValue(fieldNameStr,fieldJoinStr,fieldSummaryStr);
		//rowArr["t_" + fieldNameStr] = searchResult.getText(fieldNameStr,fieldJoinStr,fieldSummaryStr);
	}

	return(rowArr);	
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
        filters.push(new nlobjSearchFilter('custrecord_pr_pcrt_employee', null, 'anyof', empIdArr))
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

function getEmployeeSubTypeRate(empId,payRateTypeId,workingDays,dailyHours,taxYear)
{
    var hourlyRate = 0.00;

    var subTypeRateType = subTypeArr[payRateTypeId].rateType;
    var id = subTypeArr[payRateTypeId].id;

    if(subTypeRateType == PAYRATE_GLOBAL)
    {
        hourlyRate = subTypeArr[payRateTypeId].hourlyrate;
    }
    else if(!isNullOrEmpty(subTypeRatesObj))
    {
        if(subTypeRateType == PAYRATE_TAXYEAR)
        {
            var keyStr = 'TY' + id + '-' + taxYear;
            var rateTableArr = subTypeRatesObj[keyStr];
            if(!isNullOrEmpty(rateTableArr))
            {
                //set hourly rate from the tax tables
                // for UK statutory rates they are defined as weekly so they need to be converted to hourly
                if (payRateTypeId == payroll.getConstant("PCST","SSP"))
                {
                    var weeklySSP = rateTableArr.weekly;
                    var sspDailyRate = setFloat(weeklySSP/workingDays,5);
                    var sspHourlyRate = setFloat(sspDailyRate/dailyHours,5);

                    //alert('weeklySSP: ' + weeklySSP + ' workingDays: ' + workingDays  + ' sspDailyRate: ' + sspDailyRate + ' dailyHours: ' + dailyHours + ' sspHourlyRate: ' + sspHourlyRate  )

                    if (sspHourlyRate > 0.00)
                    {
                        hourlyRate = sspHourlyRate;
                    }
                }
                else
                {
                    //use hourly rates
                    var subTypeHourlyRate = setFloat(rateTableArr.hourly);
                    if (subTypeHourlyRate > 0.00)
                    {
                        hourlyRate = subTypeHourlyRate;
                    }
                }
            }
        }
        else if(subTypeRateType == PAYRATE_EMPLOYEE)
        {
            var keyStr = empId + '-' + payRateTypeId;
            var rateTableArr = subTypeRatesObj[keyStr];
            if (!isNullOrEmpty(rateTableArr))
            {
                hourlyRate = setFloat(rateTableArr.hourly);
            }
        }
    }

    return hourlyRate;
}

function getPartPeriodDecimal(payStartDate,startDate,payEndDate,endDate)
{
    nlapiLogExecution('audit','getPartPeriodDecimal start','payStartDate: ' + payStartDate + ' startDate: ' + startDate + ' payEndDate: ' + payEndDate + ' endDate: ' + endDate);
    var partPeriodDecimal = 0.00;
    var totalHours = setFloat(getTotalPeriodHours(startDate,endDate),5);
    var adjustHoursDiff = setFloat(getPartPeriodHours(payStartDate,startDate,payEndDate,endDate),5);
    var hoursAvailable = setFloat((totalHours - adjustHoursDiff),5);
    partPeriodDecimal = setFloat((hoursAvailable/totalHours),5);
    //nlapiLogExecution('audit','getPartPeriodDecimal end','totalHours: ' + totalHours + ' adjustHoursDiff: ' + adjustHoursDiff + ' hoursAvailable: ' + hoursAvailable + ' partPeriodDecimal: ' + partPeriodDecimal);

    return partPeriodDecimal;
}

function getTotalPeriodHours(startDateObj,endDateObj)
{
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var totalDiff = endDateObj - startDateObj;
    var totalDays = setFloat(totalDiff/ONE_DAY) + 1;
    var totalHours = setFloat((totalDays*24),4);

    //nlapiLogExecution('debug','getTotalPeriodHours','endDateObj: ' + endDateObj + ' less startDateObj: ' + startDateObj  + ' equals totalDays: ' + totalDays + ' and totalHours: ' + totalHours);

    return totalHours;

}

function getPartPeriodHours(payStartDate,startDate,payEndDate,endDate)
{
    //nlapiLogExecution('debug','getPartPeriodHours','payStartDate: ' + payStartDate + ' startDate: ' + startDate);
    var adjustDiff = 0.00;
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var ONE_HOUR = 1000 * 60 * 60;
    var adjustDiffHours = 0.00;
    var adjustDiffDays = 0.00;

    var totalDiff = endDate - startDate;

    if (!isNullOrEmpty(payStartDate) && payStartDate > startDate)
    {
        adjustDiff = payStartDate - startDate;
        adjustDiffDays += setFloat(adjustDiff/ONE_DAY);
        adjustDiffHours = setFloat((adjustDiffDays*24),4);
        //nlapiLogExecution('audit','getPartPeriodHoursSTART','payStartDate: ' + payStartDate + ' less startDate: ' + startDate + ' equals: ' + adjustDiffDays + ' days, ' + adjustDiffHours + ' hours');
    }

    if (!isNullOrEmpty(payEndDate) && endDate > payEndDate)
    {
        adjustDiff = endDate - payEndDate;
        adjustDiffDays += setFloat(adjustDiff/ONE_DAY) + 1;
        adjustDiffHours = setFloat((adjustDiffDays*24),4);
        //nlapiLogExecution('audit','getPartPeriodHoursEND','endDate: ' + endDate + ' less payEndDate: ' + payEndDate + ' equals: ' + adjustDiffDays + ' days, ' + adjustDiffHours + ' hours');
    }

    return adjustDiffHours;
}

function getYears(startDateObj,endDateObj)
{
    var ONE_DAY = 1000 * 60 * 60 * 24;
    var totalDiff = endDateObj - startDateObj;
    var totalDays = setFloat(totalDiff/ONE_DAY) + 1;
    var years = totalDays/365;

    nlapiLogExecution('audit','getYears','endDateObj: ' + endDateObj + ' less startDateObj: ' + startDateObj  + ' equals totalDays: ' + totalDays + ' and years: ' + years);

    return years;

}
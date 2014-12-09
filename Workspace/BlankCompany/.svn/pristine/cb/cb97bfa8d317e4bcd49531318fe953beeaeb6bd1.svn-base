var prType = "";

function prPageInit(type)
{
	prType = type;
	
	if(type == "create" && !isNullOrEmpty(nlapiGetFieldValue("custrecord_pr_lb_startdate")) && !isNullOrEmpty(nlapiGetFieldValue("custrecord_pr_lb_enddate")))
	{
		ShowTab("custpage_tabemployee",false);
		
		// initialise the list to disable those with overlap message.
		var lineItemCount = nlapiGetLineItemCount("custpage_employeelist");
		
		for(var i=1; i <= lineItemCount; i++)
		{
			if(nlapiGetLineItemValue("custpage_employeelist","overlapcount",i) != "0.0")
			{
				nlapiSetLineItemDisabled("custpage_employeelist","checked",true,i);
			}
			
			if(nlapiGetLineItemValue("custpage_employeelist","rostered",i) != "T")
			{
				nlapiSetLineItemDisabled("custpage_employeelist","requiredhours",true,i);
			}
		}
		
	}
	
}

function prFieldChanged(type,name,linenum)
{
	switch(name)
	{
		case "custrecord_pr_lb_startdate":
		case "custrecord_pr_lb_enddate":	
			
		// default the end date if empty from the start date
		var endDateStr = nlapiGetFieldValue("custrecord_pr_lb_enddate");
		var startDateStr = nlapiGetFieldValue("custrecord_pr_lb_startdate"); 
		var valueStr = nlapiGetFieldValue(name);
		
		if(!isNullOrEmpty(valueStr))
		{
			if(name == "custrecord_pr_lb_startdate")
			{
				// we only need to recalculate leave consumption if we aren't triggering a change to end date.
				if(isNullOrEmpty(endDateStr) || nlapiStringToDate(endDateStr) < nlapiStringToDate(startDateStr))
				{
					endDateStr = startDateStr;
					nlapiSetFieldValue("custrecord_pr_lb_enddate",endDateStr,false);	
				}
			}
			else
			{
				if(isNullOrEmpty(startDateStr) || nlapiStringToDate(endDateStr) < nlapiStringToDate(startDateStr))
				{
					startDateStr = endDateStr;
					nlapiSetFieldValue("custrecord_pr_lb_startdate",startDateStr,false);
				}
			}
			
			prRefreshPage();
		}

		break;
		case "custrecord_pr_lb_advancedate":
			
		var endDateStr = nlapiGetFieldValue("custrecord_pr_lib_enddate");
		var advanceDateStr = nlapiGetFieldValue("custrecord_pr_lb_advancedate");
		
		if(!isNullOrEmpty(advanceDateStr) && !isNullOrEmpty(endDateStr))
		{
			var endDateObj = nlapiStringToDate(endDateStr);
			var advDateObj = nlapiStringToDate(advanceDateStr);
			
			if(advDateObj.getTime() >= endDateObj.getTime())
			{
				alert("Advance Pay date must be earlier than the end date, value will be cleared.");
				nlapiSetFieldValue("custrecord_pr_lb_advancedate","",false);
			}
			
			
		}
			
		break;
		case "custpage_subsidiary":
			
		nlapiSetFieldValue("custrecord_pr_lb_subsidiary",nlapiGetFieldValue(name));
			
		case "custrecord_pr_lb_subsidiary":
		case "custpage_department":
		case "custpage_class":
		case "custpage_location":
			
		prRefreshPage();
			
		break;
	}
}
	
function prSaveRecord()
{
	// check employees have been selected
	var saveBool = true;
	var empIdArr = [];
	
	if(prType == "create")
	{
		var lineCountInt = nlapiGetLineItemCount("custpage_employeelist");

		for(var i=1; i <= lineCountInt; i++)
		{
			if(nlapiGetLineItemValue("custpage_employeelist","checked",i) == "T")
			{
				empIdArr.push(nlapiGetLineItemValue("custpage_employeelist","employeeid",i) + "_" + nlapiGetLineItemValue("custpage_employeelist","requiredhours",i));
			}
		}
		
		if(empIdArr.length == 0)
		{
			alert("Please select one or more employees to create leave requests for.");
			saveBool = false;
		}
		else
		{
			nlapiSetFieldValue("custrecord_pr_lb_json",'["' + empIdArr.join('","') + '"]');
			alert("The creation of leave records will be created as a background process, you can check on the status from this record by clicking refresh.");
		}
	}
	
	return saveBool;	
}


function prRefreshPage()
{
	// lets get all the data together and resubmit.
	var startDateStr = nlapiGetFieldValue("custrecord_pr_lb_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_lb_enddate");
	var subsidiaryId = nlapiGetFieldValue("custrecord_pr_lb_subsidiary");
	var classId = nlapiGetFieldValue("custpage_class");
	var departmentId = nlapiGetFieldValue("custpage_department");
	var locationId = nlapiGetFieldValue("custpage_location");
	var nameStr = nlapiGetFieldValue("altname");
	
	var paramArr = [
	"custparam_name=" + encodeURIComponent(nameStr),
	"custparam_subsidiary=" + encodeURIComponent(subsidiaryId),
	"custparam_startdate=" + encodeURIComponent(startDateStr),
	"custparam_enddate=" + encodeURIComponent(endDateStr)
	];
	
	if(!isNullOrEmpty(departmentId))
	{
		paramArr.push("custparam_department=" + encodeURIComponent(departmentId));
	}
	
	if(!isNullOrEmpty(classId))
	{
		paramArr.push("custparam_class=" + encodeURIComponent(classId));
	}
	
	if(!isNullOrEmpty(locationId))
	{
		paramArr.push("custparam_location=" + encodeURIComponent(locationId));
	}
	
	if(!isNullOrEmpty(startDateStr) && !isNullOrEmpty(endDateStr))
	{
		setWindowChanged(window, false);		
	
		// unfortunately we can't link to the record prior to creating it without using a tasklink where we require the internal
		// rectype.
		var matchStr = window.location.search;
		var rxRecType = /rectype=(\d*)/;
		var recTypeStr = "";
		
		if(rxRecType.test(matchStr))
		{
			recTypeStr = matchStr.match(rxRecType)[1];
		}

		if(!isNullOrEmpty(recTypeStr))
		{
			document.location = nlapiResolveURL("TASKLINK","EDIT_CUST_" + recTypeStr) + "&" + paramArr.join("&");
		}
		else
		{
			alert("Unable to resolve record type, auto refresh disabled.");
		}
	}
}


/**
 * Function ensures a duplicate record of the same type can't be created for an overlapping period.
 * 
 */
function prCheckExisting()
{
	var existingBool = false;
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");
	var reportTypeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");
	var subsidiaryId = nlapiGetFieldValue("custrecord_pr_nzems_subsidiary");
	var payDateId = nlapiGetFieldValue("custrecord_pr_nzems_paydate");
	
	//alert("startDateStr: " + startDateStr + " endDateStr: " + endDateStr + ", reportTypeId: " + reportTypeId + ", subsidiaryId: " + subsidiaryId + ", payDateId: " + payDateId);
	//need to update to address overlap.
	
	
	var filtersArr = [
	new nlobjSearchFilter("custrecord_pr_nzems_reporttype",null,"anyof",reportTypeId),                  
	new nlobjSearchFilter("custrecord_pr_nzems_startdate",null,"on",startDateStr),
	new nlobjSearchFilter("custrecord_pr_nzems_enddate",null,"on",endDateStr)
	];
	
	if(!isNullOrEmpty(payDateId))
	{
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_nzems_paydate",null,"anyof",payDateId));
	}
	
	if(!isNullOrEmpty(subsidiaryId))
	{
		filtersArr.push(new nlobjSearchFilter("custrecord_pr_nzems_subsidiary",null,"is",subsidiaryId));
	}
		
	var searchResults = nlapiSearchRecord("customrecord_pr_nz_reportsummary",null,filtersArr,[new nlobjSearchColumn("internalid")]);
	
	if(!isNullOrEmpty(searchResults) && searchResults.length > 0)
	{
		alert("An existing summary report exists or overlaps your selected period: " + searchResults[0].getId());
		existingBool = true;
	}
	
	return existingBool;
}
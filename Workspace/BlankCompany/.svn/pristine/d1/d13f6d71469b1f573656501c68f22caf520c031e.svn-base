var prType = "";

function prPageInit(type)
{
	prType = type;
	
	if(prType == "create")
	{
		// force an update of the name field
		prSetPeriodDates();
		prUpdateName();
		
		if(nlapiGetFieldValue("custrecord_pr_nzems_reporttype") == NZ_REPORT_IR348)
		{
			ShowTab("custpage_tabemployee",false);
		}
	}
	
	nlapiDisableField("custrecord_pr_nzems_file",(nlapiGetFieldValue("custrecord_pr_nzems_import") != "T"));
}

function prFieldChanged(type,name,linenum)
{
	switch(name)
	{
	case "custrecord_pr_nzems_reporttype":
		
	nlapiSetFieldValue("custrecord_pr_nzems_enddate","",false);
	nlapiSetFieldValue("custrecord_pr_nzems_startdate","",false);

	prSetPeriodDates();
	prRefreshPage();
	
	break;
	case "custrecord_pr_nzems_subsidiary":

	prRefreshPage();
		
	break;
	case "custrecord_pr_nzems_startdate":
		
	    var typeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");

        var startDateStr = nlapiGetFieldValue('custrecord_pr_nzems_startdate');
        var endDateStr =  nlapiGetFieldValue('custrecord_pr_nzems_enddate');

        if(!isNullOrEmpty(startDateStr))
        {
            if(typeId == NZ_REPORT_IR348)
            {

                //alert(startDateStr);
                var setEndDateStr =  nlapiDateToString(nlapiAddDays(nlapiAddMonths(nlapiStringToDate(startDateStr),1),-1));

                //alert('add months: ' + nlapiAddMonths(nlapiStringToDate(startDateStr),1) + ' add days: ' + nlapiAddDays(nlapiAddMonths(nlapiStringToDate(startDateStr),1),-1));

                //alert('setEndDateStr: ' + setEndDateStr);
                if(endDateStr != setEndDateStr)
                {
                    nlapiSetFieldValue('custrecord_pr_nzems_enddate',setEndDateStr)
                }

            }
            //prRefreshPage();
        }


	
	break;
	case "custrecord_pr_nzems_enddate":
	
	break;
	case "custpage_paydate":
		
	nlapiSetFieldValue("custrecord_pr_nzems_paydate",nlapiGetFieldValue("custpage_paydate"));
		
	break;
	case "custrecord_pr_nzems_paydate":
		
	prRefreshPage();
		
	break;
	
	case "custpage_hide_zero":
		
	prRefreshPage();
		
	break;

        case "custpage_subsidiary":

            prRefreshPage();

            break;
	
	case "custrecord_pr_nzems_import":
		
	var importBool = nlapiGetFieldValue("custrecord_pr_nzems_import") == "T";

	if(!importBool)
	{
		nlapiSetFieldValue("custrecord_pr_nzems_file","");
	}
	nlapiDisableField("custrecord_pr_nzems_file",!importBool);
	
	break;
	}
}

/**
 * name comprises of a number of different fields
 * @return
 */
function prUpdateName()
{
	var refDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");
	var reportTypeStr = nlapiGetFieldText("custrecord_pr_nzems_reporttype");
	var subsidiaryId = nlapiGetFieldValue("custrecord_pr_nzems_subsidiary");
	var payDateStr = nlapiGetFieldText("custrecord_pr_nzems_paydate");
	var reportTypeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");
	
	if(!isNullOrEmpty(reportTypeId))
	{
		// if pay date is not null include
		var payDateLabelStr = (!isNullOrEmpty(payDateStr)) ? " " + payDateStr : "";
		var subsidiaryLabelStr = (!isNullOrEmpty(subsidiaryId)) ? " (" + subsidiaryId + ")" : "";
		// if subsidiary is not null include.
		
		nlapiSetFieldValue("name",reportTypeStr + " " + refDateStr + payDateLabelStr + subsidiaryLabelStr);
	}
}

function prSaveRecord()
{
	var saveBool = true;
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");	
	
	if(prType == "create")
	{
		// check for overlap (perhaps this should be realtime)
		prUpdateName();
		if(prCheckExisting())
		{
			saveBool = false;
		}
		else
		{
			if(!prHasDataForPeriod())
			{
				// throw confirm
				saveBool = confirm("There are no payslip details for the period " + startDateStr + "-" + endDateStr + ", are you sure you with to proceed?",false);
			}
			
			if(saveBool)
			{
				var reportTypeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");

				switch(reportTypeId)
				{
				
				case NZ_REPORT_IR348:

				// need to encode the data into the JSON field.	
				var lineCountInt = nlapiGetLineItemCount("custpage_employeelist");
				var empIdArr = [];
				
				for(var i=1; i <= lineCountInt; i++)
				{
					if(nlapiGetLineItemValue("custpage_employeelist","checked",i) == "T")
					{
						empIdArr.push(nlapiGetLineItemValue("custpage_employeelist","employee",i));
					}
				}
				
				if(empIdArr.length == 0)
				{
					alert("Please select one or more employees to include");
					saveBool = false;
				}
				else
				{
					nlapiSetFieldValue("custrecord_pr_nzems_json","[" + empIdArr.join(",") + "]");

					if(empIdArr.length > NZ_REPORT_DETAIL_MAX)
					{
						alert("The creation of the employee summary records, and the EMS file will be performed in the background, you can check on the status from this record by clicking refresh.");
					}
				}


				break;
				case NZ_REPORT_IR345:
				
				alert("Details will now be summarised, and the EDF file created");
					
				break;
				}					
			}
		}
	}
	
	return saveBool;
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


function prHasDataForPeriod()
{
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");	

	var searchResults = nlapiSearchRecord("customrecord_pr_payslip_detail",null,[new nlobjSearchFilter("custrecord_pr_psd_reportable_date",null,"within",startDateStr,endDateStr)],[new nlobjSearchColumn("internalid",null,"count")]);

	var countInt = (!isNullOrEmpty(searchResults) && searchResults.length > 0) ? parseInt(searchResults[0].getValue("internalid",null,"count")) : 0;
	
	return (countInt > 0);
}



function prRefreshPage()
{
	// lets get all the data together and resubmit.
	var reportTypeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");
	var subsidiaryId = nlapiGetFieldValue("custrecord_pr_nzems_subsidiary");
	var payDateId = nlapiGetFieldValue("custrecord_pr_nzems_paydate");
	var hideZero = nlapiGetFieldValue("custpage_hide_zero");

	
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
			document.location = nlapiResolveURL("TASKLINK","EDIT_CUST_" + recTypeStr) + "&custparam_reporttype=" + reportTypeId + "&custparam_startdate=" + startDateStr + "&custparam_enddate=" + endDateStr + "&custparam_subsidiary=" + subsidiaryId + "&custparam_paydate=" + payDateId + "&custparam_hidezero=" + hideZero;
		}
		else
		{
			alert("Unable to resolve record type, auto refresh disabled.");
		}
	}
	
}


function prSetPeriodDates()
{
	var reportTypeId = nlapiGetFieldValue("custrecord_pr_nzems_reporttype");
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var startDateObj = null;
	var endDateObj = null;
	
	switch(reportTypeId)
	{
	case NZ_REPORT_IR348:
		
        var nowDate = (!isNullOrEmpty(startDateStr)) ? nlapiStringToDate(startDateStr) : nlapiAddMonths(new Date(),-1);
        startDateObj = new Date(nowDate.getFullYear(),nowDate.getMonth(),"1");
        endDateObj = nlapiAddDays(nlapiAddMonths(startDateObj,1),-1);
        nlapiSetFieldValue("custrecord_pr_nzems_startdate",nlapiDateToString(startDateObj),false);
        nlapiSetFieldValue("custrecord_pr_nzems_enddate",nlapiDateToString(endDateObj),false);

        break;
	case NZ_REPORT_IR345:

        if(isNullOrEmpty(startDateStr))
        {
            var nowDate = new Date();
            var dateInt = nowDate.getDate();

            if(dateInt < 15)
            {
                // default to previous month second period
                startDateObj = nlapiAddMonths(new Date(nowDate.getFullYear(),nowDate.getMonth(),"16"),-1);
                endDateObj = nlapiAddDays(new Date(nowDate.getFullYear(),nowDate.getMonth(),"1"),-1);
            }
            else
            {
                // set to current month first period.
                startDateObj = new Date(nowDate.getFullYear(),nowDate.getMonth(),"1");
                endDateObj = new Date(nowDate.getFullYear(),nowDate.getMonth(),"15");
            }

            nlapiSetFieldValue("custrecord_pr_nzems_startdate",nlapiDateToString(startDateObj),false);
            nlapiSetFieldValue("custrecord_pr_nzems_enddate",nlapiDateToString(endDateObj),false);
        }



        break;

        case NZ_REPORT_KED:
            var nowDate = (!isNullOrEmpty(startDateStr)) ? nlapiStringToDate(startDateStr) : nlapiAddMonths(new Date(),-1);
            startDateObj = new Date(nowDate.getFullYear(),nowDate.getMonth(),"1");
            endDateObj = nlapiAddDays(nlapiAddMonths(startDateObj,1),-1);
            nlapiSetFieldValue("custrecord_pr_nzems_startdate",nlapiDateToString(startDateObj),false);
            nlapiSetFieldValue("custrecord_pr_nzems_enddate",nlapiDateToString(endDateObj),false);

            break;

	default:
		
	// report hasn't been selected lets clear all values.
	nlapiSetFieldValue("custrecord_pr_nzems_startdate","");
	nlapiSetFieldValue("custrecord_pr_nzems_enddate","");
		
	break;
	}
}

function prAddRange(amtFloat)
{
	var startDateStr = nlapiGetFieldValue("custrecord_pr_nzems_startdate");
	var endDateStr = nlapiGetFieldValue("custrecord_pr_nzems_enddate");
	
	var startDateObj = nlapiStringToDate(startDateStr);
	var endDateObj = nlapiStringToDate(endDateStr);
	
	var startDate = startDateObj.getDate();
	
	if(Math.abs(amtFloat) == 1)
	{
		startDateObj = nlapiAddMonths(startDateObj,amtFloat);
		
		// if previous end date obj was 16 then should be 16 of new start date obj.
		if(endDateObj == 16)
		{
			endDateObj = new Date(startDateObj.getFullYear(),startDateObj.getMonth(),"16");
		}
		else
		{
			// last of the current month.
			endDateObj = nlapiAddDays(nlapiAddMonths(new Date(startDateObj.getFullYear(),startDateObj.getMonth(),"1"),1),-1);
		}
	}
	else
	{
		// range can be 1 - 15 or 16 - end of month.
		if(startDate == 1)
		{
			startDateObj = nlapiAddMonths(new Date(startDateObj.getFullYear(),startDateObj.getMonth(),"16"),(amtFloat > 0) ? 0 : -1);
			endDateObj = nlapiAddDays(nlapiAddMonths(new Date(startDateObj.getFullYear(),startDateObj.getMonth(),"1"),1),-1);
		}
		else
		{
			// startDate was 16 therefore set to following month.
			startDateObj = nlapiAddMonths(new Date(startDateObj.getFullYear(),startDateObj.getMonth(),"1"),((amtFloat > 0) ? 1 : 0));
			endDateObj = nlapiAddDays(startDateObj,14);
		}
	}

    nlapiSetFieldValue("custrecord_pr_nzems_enddate",nlapiDateToString(endDateObj),false);
	nlapiSetFieldValue("custrecord_pr_nzems_startdate",nlapiDateToString(startDateObj),true);

}
function prPageInit(type)
{
    nlapiDisableField("name",true);

    if(type == 'create')
    {
        var yearInt = parseInt(nlapiGetFieldText('custrecord_pr_ukeoy_taxyear'),10);
        if(!isNaN(yearInt))
        {
            nlapiSetFieldValue('name','EOY ' + yearInt.substr(2,2) + '-' + (yearInt-1).substr(2,2));
        }

    }
}

function prFieldChanged(type, fieldname, linenum)
{
    switch(fieldname)
    {
        case "custrecord_pr_ukeoy_taxyear":
        case "custrecord_pr_ukeoy_subsidiary":

        var subsidiaryId = nlapiGetFieldValue("custrecord_pr_ukeoy_subsidiary");
        var taxYearId = nlapiGetFieldValue("custrecord_pr_ukeoy_taxyear");
        var paramArr = [
            'custparam_subsidiary=' + subsidiaryId,
            'custparam_taxyear=' + taxYearId
        ];

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

        if(recTypeStr != null && recTypeStr != '')
        {
            document.location = nlapiResolveURL("TASKLINK","EDIT_CUST_" + recTypeStr) + "&" + paramArr.join("&");
        }
        else
        {
            alert("Unable to resolve record type, auto refresh disabled.");
        }

        break;
    }
}


function prSaveRecord()
{
    return(true);
}

function prRefreshPage()
{
    // lets get all the data together and resubmit.
    var startDateStr = nlapiGetFieldValue("custrecord_pr_lb_startdate");
    var endDateStr = nlapiGetFieldValue("custrecord_pr_lb_enddate");

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



function setProcessName()
{
    var nameStr = "UK EOY " + nlapiGetFieldText("custrecord_pr_pp_taxyear");
    var subsidiaryFullStr = nlapiGetFieldText("custpage_subsidiary");

    if(subsidiaryFullStr != null && subsidiaryFullStr != "")
    {
        var subIndex = subsidiaryFullStr.lastIndexOf(":");
        var subsidiaryStr = (subIndex != -1) ? subsidiaryFullStr.substr(subIndex + 2) : subsidiaryFullStr;

        nameStr += " (" + subsidiaryStr + ")";
    }

    nlapiSetFieldValue("name",nameStr);
}

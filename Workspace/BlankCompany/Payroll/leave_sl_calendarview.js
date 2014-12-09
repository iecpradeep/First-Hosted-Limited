function main(request,response)
{
    var form = nlapiCreateForm("Leave Calendar View");

    var nowDate = new Date();
    var defaultStartDate = new Date(nowDate.getFullYear(),nowDate.getMonth(),1);
    var defaultEndDate = nlapiAddDays(nlapiAddMonths(defaultStartDate,1)-1);
    var startDateStr = request.getParameter('custpage_startdate') || nlapiDateToString(defaultStartDate);
    var endDateStr = request.getParameter('custpage_enddate') || nlapiDateToString(defaultEndDate);

    form.addField("custpage_startdate","date","Start Date").setDefaultVAlue(startDateStr);
    form.addField("custpage_enddate","date","End Date").setDefaultValue(endDateStr);

    if(request.getMethod() == 'POST')
    {
        var dataArr = getCalendarLeaveForPeriod(request.getParameter('custpage_startdate'),request.getParameter('custpage_enddate'));
        dataArr["statholiday"] = getStatutoryHoliday([stateId], nlapiDateToString(startDateObj), nlapiDateToString(endDateObj));
        var htmlStr = genHtmlRequestView(dataArr, true, true, false, false, "");
        fObj = form.addField("custpage_calendarhtml", "inlinehtml", "not shown", null, "custpage_stallocation").setDefaultValue(htmlStr);
    }

    response.writePage(fObj);

}
function dailyReport()
{

	
	// setup search filters for sales orders this month by sales rep

	var soFilters = new Array();
	soFilters[0] = new nlobjSearchFilter('trandate',null,'within','thismonthtodate');
	soFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');

	var soColumns = new Array();
	soColumns[0] = new nlobjSearchColumn('tranid',null,null);
	soColumns[1] = new nlobjSearchColumn('amount',null,null);

	var soResults = nlapiSearchRecord('salesorder',null,soFilters,soColumns);

	var soTotal = 0;

	for (var i = 0; soResults != null && i < soResults.length; i++)
	{

		var so = soResults[i];
		soTotal = soTotal + so.getValue('amount');

	} //for


	// setup search filters for customers added this month by sales rep

	var custFilters = new Array();
	custFilters[0] = new nlobjSearchFilter('datecreated',null,'within','thismonthtodate');
	custFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');
	custFilters[2] = new nlobjSearchFilter('stage',null,'is','customer');

	var custResults = nlapiSearchRecord('customer',null,custFilters,null);

	var custTotal = 0;

	if (custResults != null)
	{
		custTotal = custResults.length;
	} //if


	// setup search filters for calls completed today

	var callFilters = new Array();
	callFilters[0] = new nlobjSearchFilter('completeddate',null,'on','today');
	callFilters[1] = new nlobjSearchFilter('assigned',null,'is','28642');

	var callResults = nlapiSearchRecord('phonecall',null,callFilters,null);

	var callTotal = 0;
	var callPercent = 0;

	if (callResults != null)
	{
		callTotal = callResults.length;
		callPercent = Math.round((100 / 60) * callTotal);
	} //if


	// setup search filters for open opportunities

	var oppFilters = new Array();
	oppFilters[0] = new nlobjSearchFilter('entitystatus',null,'is','In Progress');
	oppFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');

	var oppColumns = new Array();
	oppColumns[0] = new nlobjSearchColumn('tranid',null,null);
	oppColumns[1] = new nlobjSearchColumn('projectedtotal',null,null);

	var oppResults = nlapiSearchRecord('opportunity',null,oppFilters,oppColumns);

	var oppTotal = 0.00;
	var oppCount = 0;

	if (oppResults != null)
	{
		oppCount = oppResults.length;
	} //if



	for (var i = 0; oppResults != null && i < oppResults.length; i++)
	{

		var opp = oppResults[i];
		oppTotal = oppTotal + parseFloat(opp.getValue('projectedtotal'));

	} //for


	var body = 'Sales (Month to Date) = ' + soTotal + '<br>Customers Added (Month to Date) = ' + custTotal
			+ '<br>Calls Completed (Today) = ' + callTotal + ' (' + callPercent + '% of target)' + '<br>Open Opportunities (Current) = ' + oppCount
			+ '<br>Total Funnel Value = ' + oppTotal;

	nlapiSendEmail(1,-5,'End of Day Report: James Matthews',body);

	return true;	

} //function

function dailyReportPortlet(portlet,column)
{

	portlet.setTitle('Performance')

	
	// setup search filters for sales orders this month by sales rep

	var soFilters = new Array();
	soFilters[0] = new nlobjSearchFilter('trandate',null,'within','thismonthtodate');
	soFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');

	var soColumns = new Array();
	soColumns[0] = new nlobjSearchColumn('tranid',null,null);
	soColumns[1] = new nlobjSearchColumn('amount',null,null);

	var soResults = nlapiSearchRecord('salesorder',null,soFilters,soColumns);

	var soTotal = 0;

	for (var i = 0; soResults != null && i < soResults.length; i++)
	{

		var so = soResults[i];
		soTotal = soTotal + so.getValue('amount');

	} //for


	// setup search filters for customers added this month by sales rep

	var custFilters = new Array();
	custFilters[0] = new nlobjSearchFilter('datecreated',null,'within','thismonthtodate');
	custFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');
	custFilters[2] = new nlobjSearchFilter('stage',null,'is','customer');

	var custResults = nlapiSearchRecord('customer',null,custFilters,null);

	var custTotal = 0;

	if (custResults != null)
	{
		custTotal = custResults.length;
	} //if


	// setup search filters for calls completed today

	var callFilters = new Array();
	callFilters[0] = new nlobjSearchFilter('completeddate',null,'on','today');
	callFilters[1] = new nlobjSearchFilter('assigned',null,'is','28642');

	var callResults = nlapiSearchRecord('phonecall',null,callFilters,null);

	var callTotal = 0;
	var callPercent = 0;

	if (callResults != null)
	{
		callTotal = callResults.length;
		callPercent = Math.round((100 / 60) * callTotal);
	} //if


	// setup search filters for open opportunities

	var oppFilters = new Array();
	oppFilters[0] = new nlobjSearchFilter('entitystatus',null,'is','In Progress');
	oppFilters[1] = new nlobjSearchFilter('salesrep',null,'is','28642');

	var oppColumns = new Array();
	oppColumns[0] = new nlobjSearchColumn('tranid',null,null);
	oppColumns[1] = new nlobjSearchColumn('projectedtotal',null,null);

	var oppResults = nlapiSearchRecord('opportunity',null,oppFilters,oppColumns);

	var oppTotal = 0.00;
	var oppCount = 0;

	if (oppResults != null)
	{
		oppCount = oppResults.length;
	} //if



	for (var i = 0; oppResults != null && i < oppResults.length; i++)
	{

		var opp = oppResults[i];
		oppTotal = oppTotal + parseFloat(opp.getValue('projectedtotal'));

	} //for


	var body = 'Sales (Month to Date) = ' + soTotal + '<br>Customers Added (Month to Date) = ' + custTotal
			+ '<br>Calls Completed (Today) = ' + callTotal + ' (' + callPercent + '% of target)' + '<br>Open Opportunities (Current) = ' + oppCount
			+ '<br>Total Funnel Value = ' + oppTotal;


	portlet.setHtml( body );

	return true;	


}

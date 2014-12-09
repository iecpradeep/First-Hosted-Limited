


function main_reportingDisplay(request,response) 
{

        page_resultscreen(request,response);

} //function

function page_resultscreen(request, response)
{

	var form = nlapiCreateForm('Telemarketing Performance [Build 052]');
	
	form.addSubmitButton('Refresh');

    form.addTab('tab_result','Results');

	// General metrics
	
	var fld = form.addField('custpage_overall_tmc','integer','Total TMC Generated');
	fld.setDefaultValue(getTMCallsGenerated());
	fld.setDisplayType('inline');

	var fld = form.addField('custpage_overall_completed','integer','Total TMC Completed');
	fld.setDefaultValue(getTMCallsCompleted());
	fld.setDisplayType('inline');

	var fld = form.addField('custpage_overall_inprogress','integer','Total TMC In Progress');
	fld.setDefaultValue(getTMLastOutcome());
	fld.setDisplayType('inline');


	var fld = form.addField('custpage_overall_lost','integer','Total TMC>LOST');
	fld.setDefaultValue(getTMLost());
	fld.setDisplayType('inline');

	var fld = form.addField('custpage_overall_qual','integer','Total TMC>QUAL');
	fld.setDefaultValue(getTMQual());
	fld.setDisplayType('inline');

	var fld = form.addField('custpage_overall_prospect','integer','Total TMC>PROSPECT');
	fld.setDefaultValue(getTMProspect());
	fld.setDisplayType('inline');


	// User specific metrics
	
	var salesRepFilters = new Array();
	var salesRepColumns = new Array();
	
	salesRepFilters[0] = new nlobjSearchFilter('custentity_tmreporting',null,'is','T');
	
	salesRepColumns[0] = new nlobjSearchColumn('entityid');

	
	salesRepResults = nlapiSearchRecord('employee',null,salesRepFilters, salesRepColumns);
	
	resultSubList = form.addSubList('result_tab','list','Result','tab_result');

	// Set display Columns

    resultSubList.addField('custpage_salesrep','text', 'Sales Rep');
	resultSubList.addField('custpage_totalleads','text','Total Leads');
	resultSubList.addField('custpage_leadslost','text','Leads Lost');
	resultSubList.addField('custpage_totalprospects','text','Prospects');
	resultSubList.addField('custpage_tmcalls','text','TMC Generated');	
	resultSubList.addField('custpage_tmcallscompleted','text','TMC Completed');
	resultSubList.addField('custpage_tmcallsinprogress','text','TMC In Progress');
	resultSubList.addField('custpage_tmcallsoutcomelost','text','TMC>LOST');
	resultSubList.addField('custpage_tmcallsoutcomequal','text','TMC>QUAL');
	resultSubList.addField('custpage_tmcallsoutcomeprospect','text','TMC>PROSPECT');
	



	var lineNum = 1;
	var totalLeads = 0;

	for (i=0; salesRepResults != null && i < salesRepResults.length; i++)
	{

		var salesRep = salesRepResults[i].getValue('entityid');
		var salesRepId = salesRepResults[i].getId();
		
		totalLeads = getTotalLeads(salesRepId);	
		var totalProspects = getTotalProspects(salesRepId);

		var leadsLost = getLeadsLost(salesRepId);
		var leadsLostRatio = 0;
		
		if (totalLeads != 0)
		{
			leadsLostRatio = Math.round((100 / totalLeads) * leadsLost);
		} //if
		
		var tmCalls = getTMCallsGenerated(salesRepId);
		var tmCallsCompleted = getTMCallsCompleted(salesRepId);
		var tmCallsCompletedRatio = 0;
		
		if (tmCallsCompleted != 0)
		{
			tmCallsCompletedRatio = Math.round((100 / tmCalls) * tmCallsCompleted);
		} //if
		
		var tmCallsInProgress = getTMLastOutcome(salesRepId);
		var tmCallsInProgressRatio = 0;
	
		if (tmCallsInProgress != 0)
		{
			tmCallsInProgressRatio = Math.round((100 / tmCalls) * tmCallsInProgress);
		} //if
	
		var tmLost = getTMLost(salesRepId);
		var tmLostRatio = 0;
	
		if (tmLost != 0)
		{
			tmLostRatio = Math.round((100 / tmCalls) * tmLost);
		} //if
		
		var tmQual = getTMQual(salesRepId);
		var tmQualRatio = 0;
	
		if (tmQual != 0)
		{
			tmQualRatio = Math.round((100 / tmCalls) * tmQual);
		} //if
		
		var tmProspect = getTMProspect(salesRepId);
		var tmProspectRatio = 0;
	
		if (tmProspect != 0)
		{
			tmProspectRatio = Math.round((100 / tmCalls) * tmProspect);
		} //if

				
		resultSubList.setLineItemValue('custpage_salesrep',lineNum,salesRep);
		resultSubList.setLineItemValue('custpage_totalleads',lineNum,totalLeads);
		resultSubList.setLineItemValue('custpage_leadslost',lineNum,leadsLost + ' (' + leadsLostRatio + '%)');
		resultSubList.setLineItemValue('custpage_totalprospects',lineNum,totalProspects);		
 		resultSubList.setLineItemValue('custpage_tmcalls',lineNum,tmCalls);	
		resultSubList.setLineItemValue('custpage_tmcallscompleted',lineNum,tmCallsCompleted + ' (' + tmCallsCompletedRatio + '%)');	
		resultSubList.setLineItemValue('custpage_tmcallsinprogress',lineNum,tmCallsInProgress + ' (' + tmCallsInProgressRatio + '%)');	
		resultSubList.setLineItemValue('custpage_tmcallsoutcomelost',lineNum,tmLost + ' (' + tmLostRatio + '%)');	
		resultSubList.setLineItemValue('custpage_tmcallsoutcomequal',lineNum,tmQual + ' (' + tmQualRatio + '%)');	
		resultSubList.setLineItemValue('custpage_tmcallsoutcomeprospect',lineNum,tmProspect + ' (' + tmProspectRatio + '%)');	
			
  		
		lineNum++;
			
	} //for
 
     response.writePage(form);

} //function

function getTotalLeads(salesrep)
{
	var totalLeadFilters = new Array();
	var totalLeadColumns = new Array();
	
	totalLeadFilters[0] = new nlobjSearchFilter('salesrep',null,'is',salesrep);
	
	totalLeadColumns[0] = new nlobjSearchColumn('entityid');

	
	totalLeadResults = nlapiSearchRecord('lead',null,totalLeadFilters, totalLeadColumns);
	
	if (totalLeadResults != null)
	{
		return totalLeadResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTotalProspects(salesrep)
{
	var totalProspectFilters = new Array();
	var totalProspectColumns = new Array();
	
	totalProspectFilters[0] = new nlobjSearchFilter('salesrep',null,'is',salesrep);
	
	totalProspectColumns[0] = new nlobjSearchColumn('entityid');

	totalProspectResults = nlapiSearchRecord('Prospect',null,totalProspectFilters, totalProspectColumns);
	
	if (totalProspectResults != null)
	{
		return totalProspectResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getLeadsLost(salesrep)
{
	var leadLostFilters = new Array();
	var leadLostColumns = new Array();
	
	leadLostFilters[0] = new nlobjSearchFilter('salesrep',null,'is',salesrep);
	leadLostFilters[1] = new nlobjSearchFilter('status',null,'is','21')
	
	leadLostColumns[0] = new nlobjSearchColumn('entityid');

	leadLostResults = nlapiSearchRecord('lead',null,leadLostFilters, leadLostColumns);
	
	if (leadLostResults != null)
	{
		return leadLostResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMCallsGenerated(salesrep)
{
	var TMCallGeneratedFilters = new Array();
	var TMCallGeneratedColumns = new Array();
	
	if (salesrep) 
	{
		TMCallGeneratedFilters[0] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	}
	
	TMCallGeneratedColumns[0] = new nlobjSearchColumn('id');

	TMCallGeneratedResults = nlapiSearchRecord('customrecord_tmcall',null,TMCallGeneratedFilters, TMCallGeneratedColumns);
	
	if (TMCallGeneratedResults != null)
	{
		var resultCount = TMCallGeneratedResults.length;

		if (resultCount < 1000) {
			
			return resultCount;
		
		} //if
		else
		{
			
		//	while (TMCallGeneratedResults.length = 1000) 
			//{
				var topId = TMCallGeneratedResults[999].getId();
				TMCallGeneratedFilters.push = new nlobjSearchFilter('internalid',null,'greaterthan',topId);
				
				
				TMCallGeneratedResults.length = 0;
				TMCallGeneratedResults = nlapiSearchRecord('customrecord_tmcall', null, TMCallGeneratedFilters, TMCallGeneratedColumns);
				
				resultCount = resultCount + TMCallGeneratedResults.length;
				TMCallGeneratedFilters.pop();
				
			//} //while
			
			return resultCount;
									
		} //else
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMCallsCompleted(salesrep)
{
	var TMCallCompletedFilters = new Array();
	var TMCallCompletedColumns = new Array();
	

	TMCallCompletedFilters[0] = new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','T');
	
	if (salesrep) 
	{
		TMCallCompletedFilters[1] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	} //if
	
	TMCallCompletedColumns[0] = new nlobjSearchColumn('id');

	TMCallCompletedResults = nlapiSearchRecord('customrecord_tmcall',null,TMCallCompletedFilters, TMCallCompletedColumns);
	
	if (TMCallCompletedResults != null)
	{
		return TMCallCompletedResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMLastOutcome(salesrep)
{
	var TMLastOutcomeFilters = new Array();
	var TMLastOutcomeColumns = new Array();
	

	TMLastOutcomeFilters[0] = new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','F');
	TMLastOutcomeFilters[1] = new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'noneof','@NONE@');
	
	if (salesrep) 
	{
		TMLastOutcomeFilters[2] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	} //if
	
	TMLastOutcomeColumns[0] = new nlobjSearchColumn('id');

	TMLastOutcomeResults = nlapiSearchRecord('customrecord_tmcall',null,TMLastOutcomeFilters, TMLastOutcomeColumns);
	
	if (TMLastOutcomeResults != null)
	{
		return TMLastOutcomeResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMLost(salesrep)
{
	var TMLostFilters = new Array();
	var TMLostColumns = new Array();
	
	TMLostFilters[0] = new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','T');
	TMLostFilters[1] = new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'is','7');
	
	if (salesrep) 
	{
		TMLostFilters[2] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	} //if
	
	TMLostColumns[0] = new nlobjSearchColumn('id');

	TMLostResults = nlapiSearchRecord('customrecord_tmcall',null,TMLostFilters, TMLostColumns);
	
	if (TMLostResults != null)
	{
		return TMLostResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMQual(salesrep)
{
	var TMQualFilters = new Array();
	var TMQualColumns = new Array();
	
	TMQualFilters[0] = new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','T');
	TMQualFilters[1] = new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'is','8');
	
	if (salesrep) 
	{
		TMQualFilters[2] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	} //if
	
	TMQualColumns[0] = new nlobjSearchColumn('id');

	TMQualResults = nlapiSearchRecord('customrecord_tmcall',null,TMQualFilters, TMQualColumns);
	
	if (TMQualResults != null)
	{
		return TMQualResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

function getTMProspect(salesrep)
{
	var TMProspectFilters = new Array();
	var TMProspectColumns = new Array();
	
	TMProspectFilters[0] = new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','T');
	TMProspectFilters[1] = new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'is','9');
	
	if (salesrep) 
	{
		TMProspectFilters[2] = new nlobjSearchFilter('custrecord_tmc_user', null, 'is', salesrep);
	} //if
	
	TMProspectColumns[0] = new nlobjSearchColumn('id');

	TMProspectResults = nlapiSearchRecord('customrecord_tmcall',null,TMProspectFilters, TMProspectColumns);
	
	if (TMProspectResults != null)
	{
		return TMProspectResults.length;
	} //if
	else
	{
		return 0;
	} //else
	
} //function

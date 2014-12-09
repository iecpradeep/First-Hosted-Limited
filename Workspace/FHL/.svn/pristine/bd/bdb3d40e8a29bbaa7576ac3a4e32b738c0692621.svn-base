/********************************************************************************************
 * Program:		calllistdisplay.js
 * Date:		19/03/10
 * Version:		1.0.037
 ********************************************************************************************/

function main_callListDisplay(request,response) 
{

        page_resultscreen(request,response);

}

function page_resultscreen(request,response)
{
    
    var rowLimit = 150;

    var form = nlapiCreateForm('Telemarketing Call List [v1.0.036]');
   form.setScript('customscript_calllistdisplay_client');

//    var stCallSuitelet = nlapiGetContext().getSetting('script', 'customscript_calldetails');

	var salesrepid = nlapiGetUser();

	var fld = form.addField('custpage_salesrep','select','Sales Rep','employee');
   	fld.setDefaultValue(salesrepid);
   	fld.setDisplayType('inline');
	
	form.addField('spacer1','label',' ').setLayoutType('startrow');
	form.addField('spacer2','label',' ').setLayoutType('startrow');
	form.addField('spacer3','label',' ').setLayoutType('startrow');


    form.addSubmitButton('Refresh');

    form.addTab('tab_result','Not Started');
	form.addTab('tab_inprogress','In Progress');

	// Call Total Search

    var tmCallTotalColumns = [
        new nlobjSearchColumn('custrecord_tmc_companyname'),
       	new nlobjSearchColumn('custrecord_tmc_datelastaction'),
		new nlobjSearchColumn('custrecord_tmc_lastoutcome'),
		new nlobjSearchColumn('custrecord_tmc_nextactiondate'),
    ];
 
    var tmCallTotalFilters = new Array();

	tmCallTotalFilters.push(new nlobjSearchFilter('custrecord_tmc_user',null,'is',salesrepid));
	
    var tmCallTotalResults = nlapiSearchRecord('customrecord_tmcall', null, tmCallTotalFilters, tmCallTotalColumns);

	var fld = form.addField('custpage_totalcount','integer','Total Calls Assigned');

    if (tmCallTotalResults) 
	{
		fld.setDefaultValue(tmCallTotalResults.length);
	}
	else
	{
		fld.setDefaultValue(0);

	}
	fld.setDisplayType('inline');


	// Call Not Started Search
	
    var tmCallNotStartedColumns = [
        new nlobjSearchColumn('custrecord_tmc_companyname'),
       	new nlobjSearchColumn('custrecord_tmc_datelastaction'),
		new nlobjSearchColumn('custrecord_tmc_lastoutcome'),
		new nlobjSearchColumn('custrecord_tmc_nextactiondate'),
		new nlobjSearchColumn('phone','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('custentity_employees','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('custentity_turnover','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('leadsource','CUSTRECORD_TMC_COMPANYNAME'),
		
		    ];
 
    var tmCallNotStartedFilters = new Array();

    tmCallNotStartedFilters.push(new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','F'));
	tmCallNotStartedFilters.push(new nlobjSearchFilter('custrecord_tmc_user',null,'is',salesrepid));
	tmCallNotStartedFilters.push(new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'anyof','@NONE@'));
	
    var tmCallNotStartedResults = nlapiSearchRecord('customrecord_tmcall', null, tmCallNotStartedFilters, tmCallNotStartedColumns);

	var fld = form.addField('custpage_notstartedcount','integer','Calls Not Started');

    if (tmCallNotStartedResults) 
	{
		fld.setDefaultValue(tmCallNotStartedResults.length);
	}
	else
	{
		fld.setDefaultValue(0);

	}
	fld.setDisplayType('inline');


    if (tmCallNotStartedResults) 
    {
        rowLimit = tmCallNotStartedResults.length;

        var fld = form.addField('custpage_tmcallcount','integer','Telemarketing Call(s) Found',null,'tab_result');
        fld.setDefaultValue(tmCallNotStartedResults.length);
        fld.setDisplayType('inline');
        
        resultSubList = form.addSubList('result_tab','list','Result','tab_result');
        resultSubList.addField('custpage_col_link','text', 'Call');
        resultSubList.addField('custpage_col_company','text', 'Company');
        resultSubList.addField('custpage_col_date','date', 'Last Call Date');
	//	resultSubList.addField('custpage_col_lastoutcome','text','Last Outcome');
	//	resultSubList.addField('custpage_col_nextdate','date','Next Action Date');
		resultSubList.addField('custpage_col_phone','phone','Phone');
		resultSubList.addField('custpage_col_employees','text','Employees');
		resultSubList.addField('custpage_col_turnover','text','Turnover');
		resultSubList.addField('custpage_col_leadsource','text','Lead Source');
		
		
	
        var lineNum = 1;

        for (var i=0; i < rowLimit; i++) 
        {
            resultSubList.setLineItemValue('custpage_col_company',lineNum,tmCallNotStartedResults[i].getText('custrecord_tmc_companyname'));
            resultSubList.setLineItemValue('custpage_col_date',lineNum,tmCallNotStartedResults[i].getValue('custrecord_tmc_datelastaction'));
	//		resultSubList.setLineItemValue('custpage_col_lastoutcome',lineNum,tmCallNotStartedResults[i].getText('custrecord_tmc_lastoutcome'));
    //      resultSubList.setLineItemValue('custpage_col_nextdate',lineNum,tmCallNotStartedResults[i].getValue('custrecord_tmc_nextactiondate'));
    		resultSubList.setLineItemValue('custpage_col_phone',lineNum,tmCallNotStartedResults[i].getValue('phone','CUSTRECORD_TMC_COMPANYNAME'));
   			resultSubList.setLineItemValue('custpage_col_employees',lineNum,tmCallNotStartedResults[i].getValue('custentity_employees','CUSTRECORD_TMC_COMPANYNAME'));
   			resultSubList.setLineItemValue('custpage_col_turnover',lineNum,tmCallNotStartedResults[i].getValue('custentity_turnover','CUSTRECORD_TMC_COMPANYNAME'));
			resultSubList.setLineItemValue('custpage_col_leadsource',lineNum,tmCallNotStartedResults[i].getText('leadsource','CUSTRECORD_TMC_COMPANYNAME'));
	       
            var stCallUrl = nlapiResolveURL ('SUITELET','customscript_calldetails',1)+'&custpage_tmcall_id='+tmCallNotStartedResults[i].getId();
            
            resultSubList.setLineItemValue('custpage_col_link',lineNum,'<a href="javascript:void(0);" onClick="windowOpener(\''+stCallUrl+'\',830,500);">Call</a>');
          
            lineNum++;

        } //for

    } //if

    else 

    {
        var fld = form.addField('custpage_noresult','text','No Result Found',null,'tab_result');
        fld.setDisplayType('inline');

    } //else

	// Call In Progress Search

    var tmCallInProgressColumns = [
        new nlobjSearchColumn('custrecord_tmc_companyname'),
       	new nlobjSearchColumn('custrecord_tmc_datelastaction'),
		new nlobjSearchColumn('custrecord_tmc_lastoutcome'),
		new nlobjSearchColumn('custrecord_tmc_nextactiondate'),
		new nlobjSearchColumn('phone','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('custentity_employees','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('custentity_turnover','CUSTRECORD_TMC_COMPANYNAME'),
		new nlobjSearchColumn('leadsource','CUSTRECORD_TMC_COMPANYNAME'),

    ];
 
    var tmCallInProgressFilters = new Array();

    tmCallInProgressFilters.push(new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','F'));
	tmCallInProgressFilters.push(new nlobjSearchFilter('custrecord_tmc_user',null,'is',salesrepid));
	tmCallInProgressFilters.push(new nlobjSearchFilter('custrecord_tmc_lastoutcome',null,'noneof','@NONE@'));
	
	
    var tmCallInProgressResults = nlapiSearchRecord('customrecord_tmcall', null, tmCallInProgressFilters, tmCallInProgressColumns);

	var fld = form.addField('custpage_inprogresscount','integer','Calls In Progress');

    if (tmCallInProgressResults) 
	{
		fld.setDefaultValue(tmCallInProgressResults.length);
	}
	else
	{
		fld.setDefaultValue(0);

	}
	fld.setDisplayType('inline');

    if (tmCallInProgressResults) 
    {
        rowLimit = tmCallInProgressResults.length;

        var fld = form.addField('custpage_tmcallcount_ip','integer','Telemarketing Call(s) Found',null,'tab_inprogress');
        fld.setDefaultValue(tmCallInProgressResults.length);
        fld.setDisplayType('inline');
        
        inprogressSublist = form.addSubList('inprogress_tab','list','Result','tab_inprogress');
        inprogressSublist.addField('custpage_col_link','text', 'Call');
        inprogressSublist.addField('custpage_col_company','text', 'Company');
        inprogressSublist.addField('custpage_col_date','date', 'Last Call Date');
		inprogressSublist.addField('custpage_col_lastoutcome','text','Last Outcome');
		inprogressSublist.addField('custpage_col_nextdate','date','Next Action Date');
		inprogressSublist.addField('custpage_col_phone','phone','Phone');
		inprogressSublist.addField('custpage_col_employees','text','Employees');
		inprogressSublist.addField('custpage_col_turnover','text','Turnover');
		inprogressSublist.addField('custpage_col_leadsource','text','Lead Source');
	
        var lineNum = 1;

        for (var i=0; i < rowLimit; i++) 
        {
            inprogressSublist.setLineItemValue('custpage_col_company',lineNum,tmCallInProgressResults[i].getText('custrecord_tmc_companyname'));
            inprogressSublist.setLineItemValue('custpage_col_date',lineNum,tmCallInProgressResults[i].getValue('custrecord_tmc_datelastaction'));
			inprogressSublist.setLineItemValue('custpage_col_lastoutcome',lineNum,tmCallInProgressResults[i].getText('custrecord_tmc_lastoutcome'));
            inprogressSublist.setLineItemValue('custpage_col_nextdate',lineNum,tmCallInProgressResults[i].getValue('custrecord_tmc_nextactiondate'));
    		inprogressSublist.setLineItemValue('custpage_col_phone',lineNum,tmCallInProgressResults[i].getValue('phone','CUSTRECORD_TMC_COMPANYNAME'));
   			inprogressSublist.setLineItemValue('custpage_col_employees',lineNum,tmCallInProgressResults[i].getValue('custentity_employees','CUSTRECORD_TMC_COMPANYNAME'));
   			inprogressSublist.setLineItemValue('custpage_col_turnover',lineNum,tmCallInProgressResults[i].getValue('custentity_turnover','CUSTRECORD_TMC_COMPANYNAME'));
			inprogressSublist.setLineItemValue('custpage_col_leadsource',lineNum,tmCallInProgressResults[i].getText('leadsource','CUSTRECORD_TMC_COMPANYNAME'));
	       
            var stCallUrl = nlapiResolveURL ('SUITELET','customscript_calldetails',1)+'&custpage_tmcall_id='+tmCallInProgressResults[i].getId();
            
            inprogressSublist.setLineItemValue('custpage_col_link',lineNum,'<a href="javascript:void(0);" onClick="windowOpener(\''+stCallUrl+'\',830,500);">Call</a>');
          
            lineNum++;

        } //for

    } //if

    else 

    {
        var fld = form.addField('custpage_noresultinprogress','text','No Result Found',null,'tab_inprogress');
        fld.setDisplayType('inline');

    } //else

	// Call Completed Search

    var tmCallCompletedColumns = [
        new nlobjSearchColumn('custrecord_tmc_companyname'),
       	new nlobjSearchColumn('custrecord_tmc_datelastaction'),
		new nlobjSearchColumn('custrecord_tmc_lastoutcome'),
		new nlobjSearchColumn('custrecord_tmc_nextactiondate'),
		new nlobjSearchColumn('phone','custrecord_tmc_companyname'),
    ];
 
    var tmCallCompletedFilters = new Array();

    tmCallCompletedFilters.push(new nlobjSearchFilter('custrecord_tmc_terminated',null,'is','T'));
	tmCallCompletedFilters.push(new nlobjSearchFilter('custrecord_tmc_user',null,'is',salesrepid));
	
    var tmCallCompletedResults = nlapiSearchRecord('customrecord_tmcall', null, tmCallCompletedFilters, tmCallCompletedColumns);

	var fld = form.addField('custpage_completedcount','integer','Calls Completed');

    if (tmCallCompletedResults) 
	{
		fld.setDefaultValue(tmCallCompletedResults.length);
	}
	else
	{
		fld.setDefaultValue(0);

	}
	fld.setDisplayType('inline');




    response.writePage(form);
      
} //function


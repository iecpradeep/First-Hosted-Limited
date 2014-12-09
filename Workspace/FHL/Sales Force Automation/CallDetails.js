 
function main_TMCall(request,response) 
{

	if (request.getMethod() == 'GET')
	{



//	var stStage = request.getParameter('custpage_stage');

//	if (stStage)
//	{
 //      		if (stStage.indexOf('contact_') == 0) 
  //     		{
    //   			page_updateContact(request,response);
      // 		} //if
	//	else
	//	{
        		page_callscreen(request,response);

//	 	} //else
	} //if

	else

	{
       		page_saveCall(request,response);

	} //else

} //function


function page_callscreen(request,response)
{

	var stTMCallId = request.getParameter('custpage_tmcall_id');

	// load telemarketing call record
	var recTMC = nlapiLoadRecord('customrecord_tmcall',stTMCallId);
	var stCompanyId = recTMC.getFieldValue('custrecord_tmc_companyname');
	var datelastaction = recTMC.getFieldText('custrecord_tmc_datelastaction');
	var lastoutcome = recTMC.getFieldText('custrecord_tmc_lastoutcome');
	var currentuser = nlapiGetUser();
	var notes = recTMC.getFieldValue('custrecord_tmc_callnotes');


	// load customer record

	var recCustomer = nlapiLoadRecord('customer',stCompanyId);
	var stCompanyName = recCustomer.getFieldValue('entityid');
	var stPhone = recCustomer.getFieldValue('phone');
	var stEmail = recCustomer.getFieldValue('email');
	var stURL = recCustomer.getFieldValue('url');
	var stAddress = recCustomer.getFieldValue('defaultaddress');
	var stRegion = recCustomer.getFieldText('custentity_region');
	var stLeadSource = recCustomer.getFieldText('leadsource');
  	var stLeadCategory = recCustomer.getFieldText('custentity_lead_type');
	 
  
	var form = nlapiCreateForm('Telemarketing Call [v1.0.18]',true);
	form.setScript('customscript_calldetailsclient');

    
    	form.addTab('tab_call','Call Details');
    	form.addSubmitButton('Save');

	// ****************************************************************************
	// ** header section
	// ****************************************************************************


	var fld = form.addField('custpage_tmcall_id','text','TMC ID');
    	fld.setDefaultValue(stTMCallId);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyid','select','Company ID','customer');
    	fld.setDefaultValue(stCompanyId);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyname','text','Company Name');
    	fld.setDefaultValue(stCompanyName);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyphone','phone','Company Phone');
    	fld.setDefaultValue(stPhone);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyemail','email','Company Email');
    	fld.setDefaultValue(stEmail);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyurl','url','URL');
    	fld.setDefaultValue(stURL);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyaddress','textarea','Address');
    	fld.setDefaultValue(stAddress);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyregion','text','Region');
    	fld.setDefaultValue(stRegion);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_companyleadsource','text','Lead Source');
    	fld.setDefaultValue(stLeadSource);
    	fld.setDisplayType('inline');


	var fld = form.addField('custpage_companyleadcategory','text','Lead Category');
    	fld.setDefaultValue(stLeadCategory);
    	fld.setDisplayType('inline');

	var fld = form.addField('custpage_lastactiondate','text','Last Action Date');
	fld.setDefaultValue(datelastaction);
	fld.setDisplayType('inline');

	var fld = form.addField('custpage_lastoutcome','text','Last Outcome');
	fld.setDefaultValue(lastoutcome);
	fld.setDisplayType('inline');

    	var fld = form.addField('custpage_newoutcome','select','Call Outcome','customrecord_calloutcomes');
	fld.setMandatory(true);
	fld.setDisplayType('normal');

	var fld = form.addField('custpage_lastcallnotes','textarea','Last Call Notes');
	if (notes) 
	{
		fld.setDefaultValue(notes);
	}
	fld.setDisplayType('disabled');

	var fld = form.addField('custpage_callnotes','textarea','Call Notes');
	fld.setDisplayType('normal');


	var fld = form.addField('custpage_nextactiondate','date','Next Action Date');
	fld.setDisplayType('normal');

	
	


	// ****************************************************************************
	// ** contacts tab
	// ****************************************************************************

	form.addTab('tab_contact','Contact List');
	var fld = form.addField('custpage_tab3_cid','text','Contact ID','contact','tab_contact');
    	fld.setDisplayType('hidden');
//    	var fld = form.addField('custpage_tab3_cn','text','Contact Name',null,'tab_contact');
//    	var fld = form.addField('custpage_tab3_ct','text','Title',null,'tab_contact');
//    	var fld = form.addField('custpage_tab3_cp','text','Phone',null,'tab_contact');
//    	var fld = form.addField('custpage_tab3_ce','email','Email',null,'tab_contact');

    	var contactColumns = [new nlobjSearchColumn('entityid'),new nlobjSearchColumn('title'),new nlobjSearchColumn('phone'),new nlobjSearchColumn('email')];
    	var contactFilters = [new nlobjSearchFilter('company', null, 'is',stCompanyId)];
    	var contactResults = nlapiSearchRecord('contact', null, contactFilters, contactColumns);

    	if (contactResults) 
    	{

        	// add sublist
        	resultSubList = form.addSubList('result_contacts','list','Contact Results','tab_contact');
//        	resultSubList.addField('custpage_contactlist_sel','checkbox', 'Select');
        	resultSubList.addField('custpage_contactlist_name','text', 'Contact Name');
        	resultSubList.addField('custpage_contactlist_title','text', 'Title');
        	resultSubList.addField('custpage_contactlist_phone','text', 'Phone');
        	resultSubList.addField('custpage_contactlist_email','text', 'Email');
//        	var fld = resultSubList.addField('custpage_contactlist_def','checkbox', 'Default');
//        	fld.setDisplayType('inline');
        	var fld = resultSubList.addField('custpage_contactlist_id','text', 'ID');
        	fld.setDisplayType('inline');
        
        	// contact buttons
//        	resultSubList.addButton('custpage_contact_add','Add Contact','manageContact(\'add\')');
//        	resultSubList.addButton('custpage_contact_edit','Update Details','manageContact(\'edit\')');
//        	resultSubList.addButton('custpage_contact_change','Change Main Contact','manageContact(\'change\')');

        	var lineNum = 1;    
        	for (var i=0; i<contactResults.length; i++) 
        	{
            		resultSubList.setLineItemValue('custpage_contactlist_name',lineNum,contactResults[i].getValue('entityid'));
            		resultSubList.setLineItemValue('custpage_contactlist_title',lineNum,contactResults[i].getValue('title'));
            		resultSubList.setLineItemValue('custpage_contactlist_phone',lineNum,contactResults[i].getValue('phone'));
            		resultSubList.setLineItemValue('custpage_contactlist_email',lineNum,contactResults[i].getValue('email'));
            		resultSubList.setLineItemValue('custpage_contactlist_id',lineNum,contactResults[i].getId());
            
//            		if (contactResults[i].getId() == stContactId) 
//            		{
//                		resultSubList.setLineItemValue('custpage_contactlist_def',lineNum,'T');
//            		}

            		lineNum++;

        	} //for
	} //if


	// ****************************************************************************
	// ** qualification tab
	// ****************************************************************************


	form.addTab('tab_qualification','Qualification Questions');

	// search for qualification questions records

 	var qqColumns = [new nlobjSearchColumn('custrecord_qq_label'),new nlobjSearchColumn('custrecord_qq_mandatory')];
	var qqResults = nlapiSearchRecord('customrecord_qq', null, null, qqColumns);

	// loop through qualification question records and create a screen field for each

	for ( var i = 0; qqResults != null && i < qqResults.length; i++ )
	{

		var qqResult = qqResults[i];

		var question = qqResult.getValue('custrecord_qq_label');
		var mandatory = qqResult.getValue('custrecord_qq_mandatory');

		var fldname = 'custpage_tab2_' + i;

		var fld = form.addField(fldname,'text',question,null,'tab_qualification');

		if (mandatory == 'T')
		{
			fld.setMandatory(true);

		} //if

		fld.setDisplayType('normal');

	} //for


	// ****************************************************************************
	// ** telemarketing call log tab
	// ****************************************************************************

	form.addTab('tab_tmclog','Call Log');

    	var tmclogColumns = [
        	new nlobjSearchColumn('custrecord_tmclog_date'),
        	new nlobjSearchColumn('custrecord_tmclog_time'),
        	new nlobjSearchColumn('custrecord_tmclog_outcome'),
			new nlobjSearchColumn('custrecord_tmclog_notes'),
    	];

    	var tmclogFilters = new Array();

	tmclogFilters.push(new nlobjSearchFilter('custrecord_tmclog_tmcid',null,'is',stTMCallId));

    	var tmclogResults = nlapiSearchRecord('customrecord_tmclog', null, tmclogFilters, tmclogColumns);
 

	if (tmclogResults) 
	{

       		rowLimit = tmclogResults.length;

        	var fld = form.addField('custpage_tmclogcount','integer','Previous calls logged',null,'tab_tmclog');

        	fld.setDefaultValue(rowLimit);
        	fld.setDisplayType('inline');
        
		var tmclogSubList = form.addSubList('tmclog_tab','list','Result','tab_tmclog');

		tmclogSubList.addField('custpage_col_date','text', 'Date');
	        tmclogSubList.addField('custpage_col_time','text', 'Time');
        	tmclogSubList.addField('custpage_col_outcome','text', 'Outcome');
			tmclogSubList.addField('custpage_col_notes','text','Notes');
			        
        	var lineNum = 1;

	        for (var i=0; i<rowLimit; i++) 
        	{
            		tmclogSubList.setLineItemValue('custpage_col_date',lineNum,tmclogResults[i].getValue('custrecord_tmclog_date'));
            		tmclogSubList.setLineItemValue('custpage_col_time',lineNum,tmclogResults[i].getValue('custrecord_tmclog_time'));
            		tmclogSubList.setLineItemValue('custpage_col_outcome',lineNum,tmclogResults[i].getText('custrecord_tmclog_outcome'));
          			tmclogSubList.setLineItemValue('custpage_col_notes',lineNum,tmclogResults[i].getValue('custrecord_tmclog_notes'));
            		
			lineNum++;

        	} //for

    	} //if
    	else 
    	{
        	var fld = form.addField('custpage_notmclogresult','text','No previous calls found',null,'tab_tmclog');
        	fld.setDisplayType('inline');
    	
	} //else


    
	response.writePage(form);

} //function





function page_updateContact(request,response) 
{

    var stStage = request.getParameter('custpage_stage');
    var stTMCallId = request.getParameter('custpage_tmcall_id');
    var stCompanyId = request.getParameter('custpage_companyid');
    var stTab3_contactId = request.getParameter('custpage_tab3_cid');
    var stTab3_contactName = request.getParameter('custpage_tab3_cn');
    var stTab3_contactTitle = request.getParameter('custpage_tab3_ct');
    var stTab3_contactPhone = request.getParameter('custpage_tab3_cp');
    var stTab3_contactEmail = request.getParameter('custpage_tab3_ce');


    if (stStage == 'contact_add') 
    {
        var stNewContactId = updateContact(stCompanyId,stTab3_contactName,stTab3_contactTitle,stTab3_contactPhone,stTab3_contactEmail);

        if (stNewContactId) 
        {
            response.write('contact_created');
        }
    }
    
    if (stStage == 'contact_edit') 
    {

        if (stTab3_contactId) 
        {
            var stUptContactId = updateContact(stCompanyId,stTab3_contactName,stTab3_contactTitle,stTab3_contactPhone,stTab3_contactEmail,stTab3_contactId);

            if (stUptContactId) 
            {
                response.write('contact_edited');
            }
        }
    }

    if (stStage == 'contact_change') 
    {
        var stUptContactId = updateContact(stCompanyId,stTab3_contactName,stTab3_contactTitle,stTab3_contactPhone,stTab3_contactEmail,stTab3_contactId);
        nlapiSubmitField('customrecord_tm_call',stTMCallId,'custrecord_tm_call_contact',stUptContactId,true);
        response.write('contact_changed');

    }

}

// *******************************************************************************************
// * Save Call Function
// *******************************************************************************************

function page_saveCall(request,response) 
{

    
    var stCompanyId = request.getParameter('custpage_companyid');
	var stCompanyName = request.getParameter('custpage_companyname');
    var stTMCallId = request.getParameter('custpage_tmcall_id');
//	form.setScript('customscript_calldetailsclient');
    if (stTMCallId) 
    {
        // load TM Call Record
        var recTMCall = nlapiLoadRecord('customrecord_tmcall',stTMCallId);
 
    }

    var calloutcome = request.getParameter('custpage_newoutcome');
    var callnotes = request.getParameter('custpage_callnotes');
    var nextactiondate = request.getParameter('custpage_nextactiondate');
	var currentuser = nlapiGetUser();

	if (!nextactiondate)
	{
		nextactiondate = nlapiDateToString(new Date());
	}

    if (calloutcome) 
    {
        // load call outcome record

        var recCallOutcome = nlapiLoadRecord('customrecord_calloutcomes',calloutcome);

        var createopp = recCallOutcome.getFieldValue('custrecord_co_createopportunity');
        var createcall = recCallOutcome.getFieldValue('custrecord_co_createphonecall');
        var changestatus = recCallOutcome.getFieldValue('custrecord_co_changeentitystatus');
        var newstatus = recCallOutcome.getFieldValue('custrecord_co_newentitystatus');
        var terminating = recCallOutcome.getFieldValue('custrecord_co_terminal');
		var createtask = recCallOutcome.getFieldValue('custrecord_co_createtask');
		

	// create opportunity record if required

        if (createopp == 'T') 
        {

            var recOpp = nlapiCreateRecord('opportunity');
            recOpp.setFieldValue('entity',stCompanyId);
            recOpp.setFieldValue('memo',callnotes);
            
            var opp_id = nlapiSubmitRecord(recOpp,true,true);

        } //if


        // create phone call record if required
	
	if (createcall == 'T') 
        {
 
            var recCall = nlapiCreateRecord('phonecall');
	recCall.setFieldValue('assigned',currentuser);
            recCall.setFieldValue('title','Telemarketing Call');
            recCall.setFieldValue('company',stCompanyId);

            recCall.setFieldValue('startdate',nextactiondate);               

            var tmCallId = nlapiSubmitRecord(recCall,true,true);
        }

	if (createtask == 'T') 
        {
 
            var recTask = nlapiCreateRecord('task');
			recTask.setFieldValue('assigned',currentuser);
 
 			var tasktitle = 'Send Email to ' + stCompanyName;
 
            recTask.setFieldValue('title', tasktitle);
            recTask.setFieldValue('company',stCompanyId);

            recTask.setFieldValue('startdate',nextactiondate);
			recTask.setFieldValue('duedate',nextactiondate);
			
			var tmTaskId = nlapiSubmitRecord(recTask,true,true);
        }


	// change status if required

	if (changestatus == 'T')
	{
		//load customer record

		var custrecord = nlapiLoadRecord('customer',stCompanyId);


		if (newstatus)
		{
			//change status

			custrecord.setFieldValue('entitystatus',newstatus);

		} //if

		//submit record changes

		var custrecord_id = nlapiSubmitRecord(custrecord,true,true);

	} //if

	// set terminating if required

        if (terminating == 'T') 
        {
            recTMCall.setFieldValue('custrecord_tmc_terminated','T');
        }


        // update TM Call Record

        recTMCall.setFieldValue('custrecord_tmc_lastoutcome',calloutcome);
        recTMCall.setFieldValue('custrecord_tmc_callnotes',callnotes);		
        recTMCall.setFieldValue('custrecord_tmc_nextactiondate',nextactiondate);

	var d = new Date();
	recTMCall.setFieldValue('custrecord_tmc_datelastaction',nlapiDateToString(d));

        var updatedTMCallId = nlapiSubmitRecord(recTMCall,true,true);


	// create log record

	rectmclog = nlapiCreateRecord('customrecord_tmclog');
	
	rectmclog.setFieldValue('custrecord_tmclog_tmcid',stTMCallId);
	rectmclog.setFieldValue('custrecord_tmclog_date',nlapiDateToString(d));
	rectmclog.setFieldValue('custrecord_tmclog_outcome',calloutcome);
	rectmclog.setFieldValue('custrecord_tmclog_user',currentuser);
	rectmclog.setFieldValue('custrecord_tmclog_notes',callnotes);
	var rectmclogid = nlapiSubmitRecord(rectmclog,true,true);


        var stRecTMCallUrl = 'https://system.netsuite.com'+nlapiResolveURL('RECORD','customrecord_tmcall',updatedTMCallId, "view");


    }   //if


    //window.opener.ischanged = false;window.opener.location.reload(true);
 
 	  response.write('<HTML><HEAD></HEAD><BODY onload="window.opener.reloadCallListDisplay();window.close(); "></BODY></HTML>');        
 // response.write('<HTML><HEAD></HEAD><BODY>Record Saved</BODY></HTML>');        
  	// response.write('<HTML><HEAD></HEAD><BODY onload="window.close(); "></BODY></HTML>');  


} 

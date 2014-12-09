/***********************************************************************************************************************
 * Name: 		Journal Approvals
 * Script Type: Suitelet
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 21/06/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		journalapproval_suitelet.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1394&c=3524453&h=d5f04fb4f6f541ecb259&_xt=.js 
 * Production:
 * 
 ***********************************************************************************************************************/



/**
 * @param request
 * @param response
 */
function journalApproval(request,response)
{
	if (request.getMethod() == 'GET') 
	{
		var form = nlapiCreateForm('Journal Approval');
		var rowLimit = 150;

		var user = nlapiGetContext().getUser();

		form.addSubmitButton('Submit');

		var sublist = form.addSubList('sublist', 'list', 'Journals');

		sublist.addMarkAllButtons();

		sublist.addField('custpage_col_select', 'checkbox', 'Approve');
		sublist.addField('custpage_col_view', 'text', 'View');
		sublist.addField('custpage_col_date', 'date', 'Date');
		sublist.addField('custpage_col_tranid', 'text', 'Transaction Number');
		sublist.addField('custpage_col_createdby', 'text', 'Created By');
		sublist.addField('custpage_col_memo', 'text', 'Memo');
		sublist.addField('custpage_col_approvalstatus', 'text', 'Approval Status');
		sublist.addField('custpage_col_internalid', 'text', 'Internal ID');

		var journalColumns = new Array;
		var journalFilters = new Array;

		journalFilters[0] = new nlobjSearchFilter('posting', null, 'is', 'F');
		journalFilters[1] = new nlobjSearchFilter('custbody_createdby', null, 'noneof', user);

		//journalFilters[0] = new nlobjSearchFilter('type',null,'is','journalentry');

		journalColumns[0] = new nlobjSearchColumn('trandate');
		journalColumns[1] = new nlobjSearchColumn('tranid');
		journalColumns[2] = new nlobjSearchColumn('custbody_createdby');
		journalColumns[3] = new nlobjSearchColumn('posting');
		journalColumns[4] = new nlobjSearchColumn('memo');
		journalColumns[5] = new nlobjSearchColumn('internalid');

		var journalResults = nlapiSearchRecord('journalentry', null, journalFilters, journalColumns);

		if (journalResults) {
			rowLimit = journalResults.length;

			sublist.setLineItemValue('custpage_col_select', 1, 'F');
			sublist.setLineItemValue('custpage_col_view', 1, "<a href='https://system.sandbox.netsuite.com/app/accounting/transactions/transaction.nl?id=" + journalResults[0].getId() + "&e=F'>View</a>");
			sublist.setLineItemValue('custpage_col_date', 1, journalResults[0].getValue(journalColumns[0]));
			sublist.setLineItemValue('custpage_col_tranid', 1, journalResults[0].getValue(journalColumns[1]));
			sublist.setLineItemValue('custpage_col_createdby', 1, journalResults[0].getText(journalColumns[2]));
			sublist.setLineItemValue('custpage_col_memo', 1, journalResults[0].getValue(journalColumns[4]));
			sublist.setLineItemValue('custpage_col_approvalstatus', 1, journalResults[0].getValue(journalColumns[3]));
			sublist.setLineItemValue('custpage_col_internalid', 1, journalResults[0].getValue(journalColumns[5]));


			var lineNum = 2;

			for (var i = 1; i < rowLimit; i++) {

				if (journalResults[i].getValue(journalColumns[1]) != journalResults[(i - 1)].getValue(journalColumns[1])) {
					sublist.setLineItemValue('custpage_col_select', lineNum, 'F');
					sublist.setLineItemValue('custpage_col_view', lineNum, "<a href='https://system.sandbox.netsuite.com/app/accounting/transactions/transaction.nl?id=" + journalResults[i].getId() + "&e=F'>View</a>");
					sublist.setLineItemValue('custpage_col_date', lineNum, journalResults[i].getValue(journalColumns[0]));
					sublist.setLineItemValue('custpage_col_tranid', lineNum, journalResults[i].getValue(journalColumns[1]));
					sublist.setLineItemValue('custpage_col_createdby', lineNum, journalResults[i].getText(journalColumns[2]));
					sublist.setLineItemValue('custpage_col_memo', lineNum, journalResults[i].getValue(journalColumns[4]));
					sublist.setLineItemValue('custpage_col_approvalstatus', lineNum, journalResults[i].getValue(journalColumns[3]));
					sublist.setLineItemValue('custpage_col_internalid', lineNum, journalResults[i].getValue(journalColumns[5]));

					lineNum++;
				}
			} //for
		} //if
		response.writePage(form);

	} //if
	else
	{	// POST METHOD

		var form = nlapiCreateForm('Journal Approval Results');

		var lineCount = request.getLineItemCount('sublist');

		for (var i=1; i <= lineCount; i++)
		{

			var approve = request.getLineItemValue('sublist','custpage_col_select',i);
			var tranid = request.getLineItemValue('sublist','custpage_col_internalid',i);

			if (approve == 'T')
			{
				nlapiSubmitField('journalentry',tranid,'approved','T');				
			} //if
		} //for

		form.addButton('custpage_back','Return to Journal List',"window.open('" + nlapiResolveURL('TASKLINK', 'LIST_TRAN_JOURNAL') + "','_self')");

		response.writePage(form);
	} //else
} //function


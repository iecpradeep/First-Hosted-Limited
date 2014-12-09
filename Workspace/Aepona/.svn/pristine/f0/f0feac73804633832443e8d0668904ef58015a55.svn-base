/*******************************************************
 * Name:		Aepona PR Release 2 (pr2_event.js)
 * Script Type:	User Event
 * Version:		1.0.0  -			-			- First Release ?????
 * Version:		1.0.1 - 26 April 2013 - Amended -changed user role for the reject button - SA
 * Version:		1.0.2 - 29 April 2013 - Amended - Reject button should appear for the next approver (for the supervisor) - SA
 * Version:		1.0.3 - 30 April 2013 - Amended - Added Approve window which is link to the suitelet and that will update the approval note field (only for first approver  and second approver) - SA
 * Version:		1.0.4 - 30 April 2013 - Amended - show print and fax button only to the Belfast AP roles and as per send method specified in the PR. - SA
 * Version:		1.0.5 - 28 June 2013  - Amended - As per Aepona request, accounting approval (reject button) restricted to aepona company accountant role (id 1008) - SA
 * version:		1.0.6 - 28 June	2013  - Amended - show print buttor or fax button if send to method is post or fax respectively - SA
 * version:		1.0.7 - 03 July	2013  - Amended - Added try catch block - SA
 * version:		1.0.8 - 03 July	2013  - Amended - Added environment check and set scrip url accordingly - SA
 * version:		1.0.9 - 03 July	2013  - Amended - added custom fax button  - SA
 * version:		1.0.10- 05 July 2013  - Amended - added custom print button  and added the code to print the cover letter - SA
 * version:		1.0.11- 05 July 2013  - Amended - removed custom print button and label standard print button as send fax / send hard copy depends on send to method - SA
 * version:		1.0.12- 05 July 2013  - Amended - amended the line to show print and cover letter button only in approver/awaiting issue stage - SA
 * 
 * Script: 		customscript66    
 * Deploy: 		customdeploy1
 * 
 * Date:		25 March 2013
 * Author:		FHL
 * Library:		Libary.js
 *******************************************************/



/**
 * @param type
 * @returns {Boolean}
 * version:		1.0.7 - 03 July	2013  - Amended - Added try catch  - SA
 */
function calculateUSD(type)
{
	try
	{

		if (type == 'create' || type == 'edit') 
		{
			//Obtain a handle to the newly created PO
			var poRecord = nlapiGetNewRecord();
			var poRecordId = poRecord.getId();

			var currency = poRecord.getFieldValue('currency');
			var total = parseFloat(poRecord.getFieldValue('total'));
			var fxrate = 1.00;

			// target currency of 1 = USD.  No date specified so use current date.
			fxrate = parseFloat(nlapiExchangeRate(currency,1));

			var totalusd = total * fxrate;

			nlapiSubmitField('purchaseorder',poRecordId,'custbody_prusdfxrate',fxrate.toFixed(3),false);
			nlapiSubmitField('purchaseorder',poRecordId,'custbody_prtotalusd',totalusd.toFixed(2),false);
		} 

	}
	catch (e)
	{
		errHandler('calculateUSD', e);
	}
	return true;
} //function


/**
 * @param type
 * @param form
 * @param request
 * @returns {Boolean}
 * 
 * 1.0.1 - Reject button should appear only for Aeopona company accountant role (id 1008)
 * 1.0.4 show print and fax button only to the belfast AP roles 
 * 1.0.6 - 28 June	2013  - Amended - show print buttor or fax button if send to method is post or fax respectively - SA
 * version:		1.0.7 - 03 July	2013  - Amended - Added try catch  - SA
 * version:		1.0.10- 05 July 2013  - Amended - added custom print button  and added the code to print the cover letter - SA
 * version:		1.0.11- 05 July 2013  - Amended - removed custom print button and label standard print button as send fax / send hard copy depends on send to method - SA
 * version:		1.0.12- 05 July 2013  - Amended - amended the line to show print and cover letter button only in approver/awaiting issue stage - SA
 *
 */
function beforeLoad(type,form,request,response)
{
	var context = null;
	var currentDomain = '';
	var rejectScriptUrl = '';
	var approveScriptUrl = '';

	var faxButtonLink = '';
	var printButtonLink = '';
	var printUrl = '';
	var coverLetterUrl = '';
	var coverLetterLink = '';
	var tranID = '';
	var supplierID = '';
	
	var approvedAwaitingISssue = '5';

	var printTransactionRecord = null;
	try
	{
		tranID = nlapiGetRecordId();
		supplierID = nlapiLookupField('purchaseorder', tranID, 'entity');

		//version:		1.0.8 - 03 July	2013  - Amended - Added environment check and set scrip url accordingly - SA
		context = nlapiGetContext();
		switch(context.getEnvironment())
		{
		case 'SANDBOX':
			currentDomain = 'https://system.sandbox.netsuite.com';

			rejectScriptUrl = currentDomain + '/app/site/hosting/scriptlet.nl?script=111&deploy=1&compid=1246650&custpage_tranid=';
			approveScriptUrl = currentDomain + '/app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=1246650&custpage_tranid=';
			// version:		1.0.9 - added custom fax button - SA
			printUrl = currentDomain + '/app/accounting/print/NLSPrintForm.nl?printtype=transaction&trantype=purchord&method=print&hotprint=T&title=Purchase+Orders&whence=';
			//version:		1.0.10- added custom print button  and added the code to print the cover letter - SA
			coverLetterUrl = currentDomain + '/app/crm/common/crmmessage.nl?transaction='+tranID+'&entity='+supplierID+'&l=T&templatetype=MAIL';

			break;
		case 'PRODUCTION':
			currentDomain = 'https://system.netsuite.com';

			rejectScriptUrl = currentDomain + '/app/site/hosting/scriptlet.nl?script=111&deploy=1&compid=1246650&custpage_tranid=';
			approveScriptUrl = currentDomain + '/app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=1246650&custpage_tranid=';
			printUrl = currentDomain + '/app/accounting/print/NLSPrintForm.nl?printtype=transaction&trantype=purchord&method=print&hotprint=T&title=Purchase+Orders&whence=';
			//version:		1.0.10- added custom print button  and added the code to print the cover letter - SA
			coverLetterUrl = currentDomain + '/app/crm/common/crmmessage.nl?transaction='+tranID+'&entity='+supplierID+'&l=T&templatetype=MAIL';

			break;
		}

		// remove additional fields 

		var vendorNameColumn = nlapiGetLineItemField('item', 'vendorname');
		if (vendorNameColumn) vendorNameColumn.setDisplayType('hidden');

		var taxTotalField = nlapiGetField('taxtotal');
		if (taxTotalField) taxTotalField.setDisplayType('hidden');

		var subTotalField = nlapiGetField('subtotal');
		if (subTotalField) subTotalField.setDisplayType('hidden');

		var totalField = nlapiGetField('total');
		if (totalField) totalField.setDisplayType('hidden');

		//Get the button before relabeling or disabling
		var copyButton = form.getButton('autofill');
		var altcopyButton = form.getButton('secondaryautofill');
		var gotoregisterButton = form.getButton('gotoregister');

		var newButton = form.getButton('new');
		var historyButton = form.getButton('activityhistory');
		var emailButton = form.getButton('email');

		//Disable the button in the UI
		if (copyButton) copyButton.setVisible(false);
		if (altcopyButton) altcopyButton.setVisible(false);
		if (gotoregisterButton) gotoregisterButton.setVisible(false);
		if (newButton) newButton.setVisible(false);
		if (historyButton) historyButton.setVisible(false);
		if (emailButton) emailButton.setVisible(false);


		var context = nlapiGetContext();
		var UserDeptID = context.getRole();

		var user = context.getUser();
		var poRecord = nlapiGetNewRecord();
		var recordId = nlapiGetRecordId();
		var status = poRecord.getFieldValue('status');
		var stage = poRecord.getFieldValue('custbody_pr_approvalstage');
		// PO issue method (e.g email, fax, hard copy)
		var issueVia = poRecord.getFieldValue('custbody_sendtosupplier');

		var nextApprover = poRecord.getFieldValue('nextapprover');

		var printButton = form.getButton('print');
		var faxButton = form.getButton('fax');
		printButton.setLabel('Modify a Order');



		if (printButton) printButton.setVisible(false);
		if (faxButton) faxButton.setVisible(false);

		// 1.0.4 show print and fax button only to the belfast AP roles  
		// * version:		1.0.6 Amended - show print buttor or fax button if send to method is post or fax respectively - SA
		//version:		1.0.12-  amended the line to show print and cover letter button only in approver/awaiting issue stage - SA
		if(((UserDeptID == '1000') || (UserDeptID == '1002')) && (stage == approvedAwaitingISssue))
		{	

			printButtonLink = "window.open('" + printUrl+"','_blank');";
			coverLetterLink = "window.open('" + coverLetterUrl+"','_blank');";

			// issue via fax
			if ((issueVia == '3') || (issueVia == '6'))
			{	


				// version:		1.0.9 - added custom fax button - SA
				//version:		1.0.10- added custom print button  and added the code to print the cover letter - SA
				//version:		1.0.11-  removed custom print button and label standard print button as send fax  - SA
				printButton.setLabel('Send Fax');
				if (printButton) 
				{
					printButton.setVisible(true);
				}
				form.addButton('custpage_printbutton', 'Cover Fax',coverLetterLink);
			}

			// issue via print
			if ((issueVia == '1') || (issueVia == '4'))
			{

				//version:		1.0.10- added custom print button  and added the code to print the cover letter - SA
				//version:		1.0.11-  removed custom print button and label standard print button as send fax  - SA
				printButton.setLabel('Send Hard Copy');
				if (printButton) 
				{
					printButton.setVisible(true);
				}

				//form.addButton('custpage_cancel','print 2','print');
				form.addButton('custpage_faxbutton', 'Cover Letter', coverLetterLink);

			}



		}

		var nextapproverfield = form.getField('nextapprover');
		if (nextapproverfield) nextapproverfield.setDisplayType('hidden');


		//add reject button if record is pending accounting approval ||pending supervisor approval
		// 1.0.1 - Reject button should appear only for Aeopona company accountant role (id 1008)
		//  i.e approval stage = "pending supervisor approval" (stage 3))
		if ((stage == '1' && (UserDeptID == '1008'))||(stage == '3' && ( user == nextApprover)))
		{

			//version:		1.0.8 - 03 July	2013  - Amended - Added environment check and set scrip url accordingly - SA
			var rejectLink = "window.open('" + rejectScriptUrl+ nlapiGetRecordId()+"','_self');";

			var rejectButton = form.addButton('custpage_rejectbutton', 'Reject', rejectLink);

		} //if

		// Version:		1.0.3 - 30 April 2013 - Amended - Added Approve window which is link to the suitelet and that will update the approval note field
		// if stage == pending supervisor approval (3) and the user is next approver ( second approver), 
		if (stage == '3' && ( user == nextApprover))
		{

			//version:		1.0.8 - 03 July	2013  - Amended - Added environment check and set scrip url accordingly - SA
			var approveLink = "window.open('" + approveScriptUrl + nlapiGetRecordId()+"','_self');";


			var approveButton = form.addButton('custpage_approvebutton', 'Approve', approveLink);

		} //if




		if (UserDeptID == 1015) //Aepona PR Approver
		{

			/*			//var addnoteurl = "window.open('"+"/app/crm/common/note.nl?l=T&refresh=usernotes&perm=TRAN_PURCHORD&transaction="+ nlapiGetRecordId()+"');";
			var addnoteurl = "window.open('"+"/app/site/hosting/scriptlet.nl?script=85&deploy=1&compid=1246650&TID="+ nlapiGetRecordId()+"');";
			var printBtn = form.addButton('custpage_addnote', 'Add A Note', addnoteurl);
			 */
		}

		if (UserDeptID == 1000) //Belfast A/P Clerk	
			/*			{

			var printsuppliercopy = "show_preview("+ nlapiGetRecordId()+")";	
			var printBtn = form.addButton('custpage_printsuppliercopy', 'Print Supplier Copy', printsuppliercopy);

            var printBtn = form.addButton('custpage_printaeponacopy', 'Print Aepona Copy', 'printAeponaCopy');

            var enterBillurl = "window.open('"+"/app/accounting/transactions/vendbill.nl?transform=purchord&e=T&memdoc=0&id="+ nlapiGetRecordId()+"');";
            var printBtn = form.addButton('custpage_enterbill', 'Enter Bill', enterBillurl);

            var printBtn = form.addButton('custpage_markbilled', 'Mark Fully Billed', 'markFullyBilled');

            var sendmethod = nlapiGetFieldText('custbody_suppliersendmethod');
            var sendviaselected = ''
	            if (sendmethod == 'EMAIL')
	            	{
		            	//sendviaselected = "send_email("+ nlapiGetRecordId()+")";
		            	sendviaselected = "window.open('"+"/app/site/hosting/scriptlet.nl?script=67&deploy=1&compid=1246650&TID="+ nlapiGetRecordId()+"&To="+ nlapiGetFieldValue('custbody_prsuppliercontactemail')+"&Cc="+ nlapiGetFieldValue('custbody_pr_employeeemail')+"&Subject="+ nlapiGetFieldValue('tranid')+"')";
	            	}
	            	else
	            	{
		            	sendviaselected = "show_preview("+ nlapiGetRecordId()+")";
	            	}

	           	var printBtn = form.addButton('custpage_sendviaselectedmethod', 'Send Via Selected Method', sendviaselected);
			}
			 */
			return true;
	}
	catch(e)
	{
		errHandler('beforeLoad', e);
	}
} //function


/**
 * @param type
 * @param form
 * version:		1.0.7 - 03 July	2013  - Amended - Added try catch  - SA
 */
function createButtons(type,form)
{
	try
	{

		var onclickScript = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=ORD&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_printsuppliercopy', 'Print Supplier Copy', onclickScript);

		var onclickScript2 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_printaeponacopy', 'Print Aepona Note', onclickScript2);

		var onclickScript3 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_enterbill', 'Enter Bill', onclickScript3);

		var onclickScript4 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_markbilled', 'Mark Fully Billed', onclickScript4);

		var onclickScript5 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_sendviaselectedmethod', 'Send Via Selected Method', onclickScript5);

		var onclickScript6 = "window.open('" + nlapiResolveURL('SUITELET', 2, 1) + "&custparam_reptype=PIN&custparam_soid=" + nlapiGetRecordId() + "');";
		var printBtn = form.addButton('custBtn_addnote', 'Add A Note', onclickScript6);
	}
	catch(e)
	{
		errHandler('createButtons', e);
	}
}

function initialiseVariables()
{
	try
	{
		context = nlapiGetContext();
		switch(context.getEnvironment())
		{
		case 'SANDBOX':
			currentDomain = 'https://system.sandbox.netsuite.com';

			rejectLink = currentDomain + '/app/site/hosting/scriptlet.nl?script=111&deploy=1&compid=1246650&custpage_tranid=';
			approveLink = currentDomain + '/app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=1246650&custpage_tranid=';

			break;
		case 'PRODUCTION':
			currentDomain = 'https://system.netsuite.com';

			rejectLink = currentDomain + '/app/site/hosting/scriptlet.nl?script=111&deploy=1&compid=1246650&custpage_tranid=';
			approveLink = currentDomain + '/app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=1246650&custpage_tranid=';

			break;
		}


	}
	catch(e)
	{
		errHandler('initialiseVariables', e);
	}


}


/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * version:		1.0.7 - 03 July	2013  - Amended - Added try catch  - SA
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}

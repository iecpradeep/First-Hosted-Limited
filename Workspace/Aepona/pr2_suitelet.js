/*****************************************
 * Name:	 PR Suitelets
 * Author:   FHL
 * Client: 	 Aepona
 * Date:     21 March 2013
 * Version:  1.0.0 - first release ??
 * Version:  1.0.1 - 29/04/2013 - Amended - added reject button for the supervisor approval level - SA
 * Version:  1.0.2 - 29/04/2013 - Amended - rejection reason message title should be current approval stage- SA
 * Version:  1.1.0 - 30/04/2013 - Added - Added new block for populating and storing approval note- SA
 * Version:  1.1.1 - 30/04/2013 - Amended - Added the approval note to approval history record, in order to get better execution log- SA
 * Version:  1.1.2 - 04/06/2013 - Amended - Added the approval note fields in PO form, i.e first approval note and second approval note- SA
 * Version:  1.1.3 - 28/06/2013 - Amended - Set latest rejection note field which will then added into the email - SA
 * Version:  1.1.4 - 28/06/2013 - Amended - If rejected by first approver then set title with first approver- SA
 * Version:  1.1.5 - 28/06/2013 - Amended - If rejected by second approver then set title with second approver- SA
 * Version:  1.1.6 - 04/07/2013 - Added   - Added try catch block - SA
 * Version:  1.1.7 - 04/07/2013 - amended   - amended the code to return previous page when clicks on cancel button - SA
 ******************************************/


/**
 * @param request
 * @param response
 */
function supplierMaintenance(request,response)
{
	try
	{

		if (request.getMethod() == 'GET')
		{
			var form = nlapiCreateForm('Edit Supplier Contact Details', true);


			var supplierId = request.getParameter('custpage_supplierid');

			var supplierRecord = nlapiLoadRecord('vendor', supplierId);

			var supplierName = supplierRecord.getFieldValue('companyname');
			var currentEmail = supplierRecord.getFieldValue('email');
			var currentPhone = supplierRecord.getFieldValue('phone');
			var currentFax = supplierRecord.getFieldValue('fax');

			var supplierNameField = form.addField('custpage_suppliername','text','Supplier Name',null);
			var supplierEmailField = form.addField('custpage_supplieremail','email','Supplier Email',null);
			var supplierPhoneField = form.addField('custpage_supplierphone','phone','Supplier Phone',null);
			var supplierFaxField = form.addField('custpage_supplierfax','phone','Supplier Fax',null);
			var supplierInternalId = form.addField('custpage_supplierinternalid','text','SID',null);

			supplierNameField.setDefaultValue(supplierName);
			supplierEmailField.setDefaultValue(currentEmail);
			supplierPhoneField.setDefaultValue(currentPhone);
			supplierFaxField.setDefaultValue(currentFax);
			supplierInternalId.setDefaultValue(supplierId);

			supplierNameField.setDisplayType('inline');
			supplierEmailField.setDisplayType('normal');
			supplierPhoneField.setDisplayType('normal');
			supplierFaxField.setDisplayType('normal');
			supplierInternalId.setDisplayType('hidden');

			supplierNameField.setLayoutType('normal','startcol');

			form.addSubmitButton('Save');
			form.addButton('custpage_cancel','Cancel',"window.close()");

			response.writePage(form);
		}
		else //POST method
		{
			var supplierId = request.getParameter('custpage_supplierinternalid');
			var newEmail = request.getParameter('custpage_supplieremail');
			var newPhone = request.getParameter('custpage_supplierphone');
			var newFax = request.getParameter('custpage_supplierfax');

			nlapiSubmitField('vendor',supplierId,'email',newEmail);
			nlapiSubmitField('vendor',supplierId,'phone',newPhone);
			nlapiSubmitField('vendor',supplierId,'fax',newFax);

			var scripthtml = '<html><script>';

			scripthtml += 'window.opener.nlapiSetFieldValue("custbody_pr_supplier_email","' + newEmail + '",false,true);';
			scripthtml += 'window.opener.nlapiSetFieldValue("custbody_pr_supplier_phone","' + newPhone + '",false,true);';
			scripthtml += 'window.opener.nlapiSetFieldValue("custbody_pr_supplier_fax","' + newFax + '",false,true);';
			scripthtml += 'close();';
			scripthtml += '</script></html>';

			response.write(scripthtml);	
		}

	}
	catch(e)
	{
		errHandler('supplierMaintenance', e);
	}
}


/**
 * @param request
 * @param response
 *  Version:  1.0.1 - 29/04/2013 - Amended - added reject button for the supervisor approval level - SA
 *  Version:  1.0.2 - 29/04/2013 - Amended - rejection reason message title should be current approval stage- SA
 *  Version:  1.1.3 - 28/06/2013 - Amended - Set latest rejection note field which will then added into the email - SA
 *  Version:  1.1.4 - 28/06/2013 - Amended - If rejected by first approver then set title with first approver- SA
 *  Version:  1.1.5 - 28/06/2013 - Amended - If rejected by second approver then set title with second approver- SA
 *  Version:  1.1.7 - 04/07/2013 - amended   - amended the code to return previous page when clicks on cancel button - SA
 * 
 ***************/
function rejectionNotes(request,response)
{
	try
	{

		if (request.getMethod() == 'GET')
		{
			var tranId = request.getParameter('custpage_tranid');
			var tranIdText = nlapiLookupField('purchaseorder',tranId,'tranid');

			var form = nlapiCreateForm('Reject Purchase Request ' + tranIdText);

			var rejectionNotesField = form.addField('custpage_rejectionnotes','textarea','Rejection Reason',null);
			var tranIdField = form.addField('custpage_rejecttranid','text','tranid', null);

			tranIdField.setDefaultValue(tranId);

			rejectionNotesField.setDisplayType('normal');
			tranIdField.setDisplayType('hidden');

			form.addSubmitButton('Save');
			//Version:  1.1.7  amended the code to return previous page when clicks on cancel button - SA
			form.addButton('custpage_cancel','Cancel',"history.back();");

			response.writePage(form);
		}
		else //POST method
		{
			var tranId = request.getParameter('custpage_rejecttranid');
			var rejectionNotes = request.getParameter('custpage_rejectionnotes');
			var employee = nlapiGetUser();

			var newRecord = nlapiCreateRecord('customrecord_approvalhistory');
			//  Version:  1.0.1 - getting the approval stage, for the if statement- SA
			var purchaseOrder = nlapiLoadRecord('purchaseorder', tranId);
			var approvalStage = purchaseOrder.getFieldValue('custbody_pr_approvalstage');

			newRecord.setFieldValue('custrecord_ah_prtransaction',tranId);
			newRecord.setFieldValue('custrecord_ah_approver',employee);

			var firstApproverApproved = purchaseOrder.getFieldValue('custbody_firstapproverapproved');
			//1.1.3 set latest rejection note field which will then added into the email
			nlapiSubmitField('purchaseorder',tranId, 'custbody_latestrejectionnote',rejectionNotes);
			// Version:  1.0.2 - If approval stage is "pending accounting approval" (1) then set message title to "rejected by accounting" (2)- SA
			if (approvalStage == '1')
			{
				newRecord.setFieldValue('custrecord_ah_notes','Rejected by Accounting:\n\n'+ rejectionNotes);

			}
			// Version:  1.0.2 - If approval stage is not "pending accounting approval" (1), i.e "pending supervisor approval" (3) then set to message title to "rejected by supervisor" (4)- SA
			else
			{
				// Version:  1.1.4 - if rejected by first approver then set title with first approver- SA
				if(firstApproverApproved != 'T')
				{
					newRecord.setFieldValue('custrecord_ah_notes','Rejected by Supervisor (First Approver):\n\n'+ rejectionNotes);
				}
				// Version:  1.1.5 - if rejected by second approver then set title with second approver- SA
				else
				{
					newRecord.setFieldValue('custrecord_ah_notes','Rejected by Supervisor (Second Approver):\n\n'+ rejectionNotes);
				}
			}

			var id = nlapiSubmitRecord(newRecord);


			// Version:  1.0.1 - If approval stage is "pending accounting approval" (1) then set to "rejected by accounting" (2)- SA
			if (approvalStage == '1')
			{
				nlapiSubmitField('purchaseorder',tranId, 'custbody_pr_approvalstage','2');
			}
			// Version:  1.0.1 - If approval stage is not "pending accounting approval" (1), i.e "pending supervisor approval" (3) then set to "rejected by supervisor" (4)- SA
			else
			{
				nlapiSubmitField('purchaseorder',tranId, 'custbody_pr_approvalstage','4');
			}

			nlapiSetRedirectURL('RECORD','purchaseorder',tranId,false);

			/*var scripthtml = '<html><script>';

		scripthtml += 'close();';
		scripthtml += '</script></html>';

		response.write(scripthtml);
			 */	
		}

	}
	catch(e)
	{
		errHandler('rejectionNotes', e);
	}
}

/**
 * @param request
 * @param response
 *
 *  approvalNotes - Version:  1.1.0 - 30/04/2013 - Added this block for populating and storing approval note - SA  
 *				    Version:  1.1.1 - 30/04/2013 - Amended - Added the approval note to approval history record, in order to get better execution log- SA
 *					Version:  1.1.7 - 04/07/2013 - amended   - amended the code to return previous page when clicks on cancel button - SA
 */
function approvalNotes(request,response)
{
	try
	{

		if (request.getMethod() == 'GET')
		{
			var tranId = request.getParameter('custpage_tranid');
			var tranIdText = nlapiLookupField('purchaseorder',tranId,'tranid');

			var form = nlapiCreateForm('Purchase Request Approval Note ' + tranIdText);

			var approvalNotesField = form.addField('custpage_approvalnotes','textarea','Approval Notes',null);
			var tranIdField = form.addField('custpage_approvetranid','text','tranid', null);

			tranIdField.setDefaultValue(tranId);

			approvalNotesField.setDisplayType('normal');
			tranIdField.setDisplayType('hidden');

			form.addSubmitButton('Save');
			//Version:  1.1.7 - amended the code to return previous page when clicks on cancel button - SA
			form.addButton('custpage_cancel','Cancel',"history.back();");

			response.writePage(form);
		}
		else //POST method
		{
			var tranId = request.getParameter('custpage_approvetranid');
			var approvalNotes = request.getParameter('custpage_approvalnotes');
			var employee = nlapiGetUser();

			// 
			var newRecord = nlapiCreateRecord('customrecord_approvalhistory');
			newRecord.setFieldValue('custrecord_ah_prtransaction',tranId);
			newRecord.setFieldValue('custrecord_ah_approver',employee);

			var purchaseOrderRecord = nlapiLoadRecord('purchaseorder', tranId);

			var firstApproverApproved = purchaseOrderRecord.getFieldValue('custbody_firstapproverapproved');

			//Version:  1.1.2 -  if first approver is approved , it means user is second approver, so set second approval note 
			if (firstApproverApproved == 'T')
			{
				purchaseOrderRecord.setFieldValue('custbody_secondapproverapproved', 'T');
				newRecord.setFieldValue('custrecord_ah_notes','Approved by Supervisor (Second Approver):\n\n'+ approvalNotes);

				// set the second approval note only if he typed something in the approval note poped up window.
				if (approvalNotes != '')
				{

					purchaseOrderRecord.setFieldValue('custbody_prsecondapprovalnotes', '\n'+ approvalNotes);

				}
			}
			// Version:  1.1.2 - set the fields if first approver is the user. if first approver approved is not tricked it means user is first approver, so set first approval note
			else 
			{
				purchaseOrderRecord.setFieldValue('custbody_firstapproverapproved', 'T');

				newRecord.setFieldValue('custrecord_ah_notes','Approved by Supervisor (First Approver):\n\n'+ approvalNotes);

				// set the approval note if he typed something in the poped up window.
				if (approvalNotes != '')
				{
					purchaseOrderRecord.setFieldValue('custbody_prfirstapprovalnotes', '\n'+ approvalNotes);
				}
			}

			var approvalHistoryId = nlapiSubmitRecord(newRecord);
			var pOID = nlapiSubmitRecord(purchaseOrderRecord);

			nlapiSetRedirectURL('RECORD','purchaseorder',tranId,false);	

		}

	}
	catch(e)
	{
		errHandler('approvalNotes', e);
	}
}

/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
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


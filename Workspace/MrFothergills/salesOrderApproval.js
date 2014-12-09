/**********************************************************************************************************************************************************************
 * Name:        Sales Order Approval (salesOrderApproval.js)
 * Script Type: User Event
 * Client:      Mr Fothrgills
 *
 * Version:     1.0.0 - 15.03.2013 -First release - SA
 * Version:     1.0.1 - 12.04.2013 -Added - tolerance as per requirement - SA
 * Version:     1.0.2 - 12.04.2013 -Added -if statement, If deposit is created without linking sales order - SA
 * Version:     1.0.3 - 12.04.2013 -Amended - get salesorder total from the sales order record, previously it was getting from the custom field.   - SA
 * Version:     1.0.4 - 12.04.2013 -Added - added a line of code which triggers workflow (to send email when the record reach particular state).   - SA
 * Version:     1.0.5 - 16.04.2013 -Added - set field value to the custom field, in order to source those field in email - SA
 * Version:     1.0.6 - 16.04.2013 -Added - call schedule script which transformrecord (creates invoice automatically) - SA 
 *          
 * Author:      FHL
 * Purpose:     To set sales order approval status 
 * 
 * Script:   customscript_salesorderapproval   
 * Deploy:   customdeploy_salesorderapproval     
 * 
 * Applies to:	Customer Deposit - After Submit Deposit 
 * 
 * Purpose : When deposit creates against sales order, the sales order not loading so actions in the workflow (setfield value, tarsnform record) is not executing, So this script will trigger the workflow.
 * 
 * Notes:       Update  sales order status field, sales order workflow also running parallel to this, inorder to give more functionality , i.e send email to customer service
 *
 **********************************************************************************************************************************************************************/

function setOrderStatus()
{
	try
	{
		var salesOrderRecord = null;
		var salesOrderId = 0;
		var totalDepositted = 0.00;
		var salesOrderTotal = 0.00;

		var underPaidTolerance = 0;
		var overPaidTolerance = 0;

		var variance = 0;
		var variableUnsigned = 0;


		salesOrderId = nlapiGetFieldValue('salesorder');
		totalDepositted = nlapiGetFieldValue('payment');


		//1.0.3 
		salesOrderRecord =nlapiLoadRecord('salesorder', salesOrderId);
		salesOrderTotal =salesOrderRecord.getFieldValue('total');

		variance = salesOrderTotal - totalDepositted;
		variableUnsigned = Math.abs(variance);

		//5% underpaid
		underPaidTolerance = ((salesOrderTotal * 95)/100);
		// 10% overpaid
		overPaidTolerance = ((salesOrderTotal * 110)/100);

		//1.0.2
		if (salesOrderId != 0)
		{
			//1.0.1 -  if deposit total equal to the order total or underpaid deposit total within 5% of tolerance or overpaid deposit within 10% of tolerance

			if  ((salesOrderTotal == totalDepositted) || ((totalDepositted <= overPaidTolerance) && (totalDepositted >= underPaidTolerance))) 
			{		 
				// order status 'B' is stand for Pending Fulfillment

				nlapiSubmitField('salesorder', salesOrderId, 'orderstatus','B', false); 
				// 1.0.5
				nlapiSubmitField('salesorder', salesOrderId, 'custbody_variance', variableUnsigned);
				nlapiSubmitField('salesorder', salesOrderId, 'custbody_depositamount', totalDepositted);


				// 1.0.6 - call scheduled script which transforms the record to invoice, If we add transford record in userevent then userevent applied to invoice will not work (user event cannot call another user event), that is the reason we used scheduled script.
				var params = new Array();

				params['custscript_salesorderid'] = salesOrderId;

				nlapiScheduleScript('customscript_salesorderapprovalscheduled', 'customdeploy_salesorderapprovalscheduled', params);

				// 1.0.4 - trigger the workflow, because some of the actions in the workflow will not work if don't trigger. eg set field value etc.
				nlapiTriggerWorkflow('salesorder', salesOrderId, 'customworkflow_depositsalesorderapproval');


			}

			// underpaid deposit total greater than 5% of tolerance or overpaid deposit greater than 10% of tolerance
			else
			{
				// Order status 'A' is stands for Pending Approval

				nlapiSubmitField('salesorder', salesOrderId, 'orderstatus','A', false); 
				//1.0.5
				nlapiSubmitField('salesorder', salesOrderId, 'custbody_variance', variableUnsigned);
				nlapiSubmitField('salesorder', salesOrderId, 'custbody_depositamount', totalDepositted);

				// 1.0.4 - trigger the workflow, becuase some of the actions in the workflow will not work if don't trigger. eg set field value etc.
				nlapiTriggerWorkflow('salesorder', salesOrderId, 'customworkflow_depositsalesorderapproval');
			}
		}
		return true;

	}
	catch(e)
	{
		errorHandler("setOrderStatus : ", e);
	}	
}

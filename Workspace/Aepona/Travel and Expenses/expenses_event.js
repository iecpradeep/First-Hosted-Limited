/*****************************************
 * Name:	 Expense Report User event Customisations
 * Author:   FHL - D Birt - A Nixon - P lewis
 * Client: 	 Aepona
 * Date:     16 Feb 2012
 * Version:  1.0.11 - Maintenance 1 version
 ******************************************/

/**********************************************
 * function editLine
 * usage: this adds a button onto the form 
 **********************************************/

function editLine(type,form)
{
	if (type == 'view' || type == 'edit') 
	{
		//Obtain a handle to the expense report
		var expRecordId = nlapiGetRecordId();         

		var rejected = nlapiLookupField('expensereport',expRecordId,'custbody_er_rejected');
		nlapiLogExecution('DEBUG','rejected',rejected);
		var user = nlapiLookupField('expensereport',expRecordId,'custbody_er_rejectuser');
		// var username = nlapiLookupField('employee',user,'altname');

		//if rejected flag is set to true, construct additional field to be shown at top of form
		if (rejected == 'T') 
		{
			var reason = nlapiLookupField('expensereport',expRecordId,'custbody_er_rejectreason');
			nlapiLogExecution('DEBUG','reason',reason);
			var instructionsField = form.addField('custpage_instructions', 'inlinehtml', null);

			instructionsField.setDefaultValue('<b>This expense claim was previously rejected for the following reason:</b><br>' + reason);
			instructionsField.setDisplayType('inline');
			instructionsField.setLayoutType('outside', 'startrow');

		} //if  

	} //if
	
	try
	{
		if (type == 'create')
		{
			var context = nlapiGetContext();
			var userName = context.getUser();	
			var userRole = context.getRole();

			if(userRole == '1028')
			{
				nlapiLogExecution('DEBUG', 'The current role is: ' + userRole);

				var record = nlapiLoadRecord('employee', userName);
				//get the value of allow credit card
				var allowCreditCard = record.getFieldValue('custentity_allow_credit_card');
				var creditNumber = record.getFieldValue('custentity_credit_card_account');

				nlapiLogExecution('DEBUG', 'userName ' + userName + " allow card:  " + allowCreditCard + " card number " + creditNumber);

				var paymentMethod = form.getField('custbody_er_payment_method');
				var employeeCard = form.getField('custbody_employee_credit_card_id');

				employeeCard.setDefaultValue(creditNumber);

				if(allowCreditCard == 'T')
				{
					// do nothing as they can have a card
				}
				else
				{
					paymentMethod.setDefaultValue(2);
					paymentMethod.setDisplayType('Disabled');
				}
			}
			else
			{
				nlapiLogExecution('DEBUG', 'NOT 1028 -- The current role is: ' + userRole);
			}
		}
		else
		{
			if(type == 'view' || type == 'edit')
			{
				var expRecordId = nlapiGetRecordId();   
				var employee = nlapiLookupField('expensereport',expRecordId,'entity');
				
				var record = nlapiLoadRecord('employee', employee);
				//get the value of allow credit card
				var allowCreditCard = record.getFieldValue('custentity_allow_credit_card');
				var creditNumber = record.getFieldValue('custentity_credit_card_account');

				nlapiLogExecution('DEBUG', 'userName ' + employee + " allow card:  " + allowCreditCard + " card number " + creditNumber);
				
				var paymentMethod = form.getField('custbody_er_payment_method');
				var employeeCard = form.getField('custbody_employee_credit_card_id');

				employeeCard.setDefaultValue(creditNumber);
				
				if(allowCreditCard == 'T')
				{
					// do nothing as they can have a card
				}
				else
				{
					paymentMethod.setDefaultValue(2);
					paymentMethod.setDisplayType('Disabled');
				}
			}		
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG','an error occured...' + e);
	}	

	// Add the button to the form 
	var testList = form.getSubList('expense');

	try
	{
		testList.addButton('custpage_editlinebutton', 'Edit Line', 'buttonPressEdit'); 
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG','the edit line button failed to work correctly because:  ' + e);
		nlapiLogExecution('DEBUG','sublist name is:  ' + testList);
	}
	
	return true;
}

/********************************************
 * expenseLineLink - links the report to the line item records and adds field data off the form to these line items.
 * type = 'expense'
 ********************************************/

function expenseLineLink(type)
{
	try
	{
		// get the amount of lines
		var lineNum = nlapiGetLineItemCount('expense');
		nlapiLogExecution('DEBUG', 'Line number: ' + lineNum);

		// get the report id
		var expenseReportID = nlapiGetRecordId();
		nlapiLogExecution('DEBUG', 'Report id: ' + expenseReportID);

		var employeeName = nlapiGetFieldValue('entity');
		var purposeDetails = nlapiGetFieldValue('memo');
		var claimTotal = nlapiGetFieldValue('custbody_claimamount');

		// for each line add the data to the custom record ID that is on the line
		for (var i = 1; i <= parseInt(lineNum); i++) 
		{  	
			var lineRecordId = nlapiGetLineItemValue('expense', 'custcol_line_rec_id', i);
			var lineDepartment = nlapiGetLineItemValue('expense', 'department', i);
			var lineDate = nlapiGetLineItemValue('expense', 'expensedate', i);
			var lineCategory = nlapiGetLineItemValue('expense', 'category', i);
			var lineClaimAmount = nlapiGetLineItemValue('expense', 'foreignamount',i);

			nlapiLogExecution('DEBUG', 'Line Record id :' + lineRecordId);
			nlapiLogExecution('DEBUG', 'Department' + lineDepartment);
			nlapiLogExecution('DEBUG', 'Line date: ' + lineDate);
			nlapiLogExecution('DEBUG', 'Line category' + lineCategory);

			// load the line custom record
			var record = nlapiLoadRecord('customrecord_expenseline', lineRecordId);

			// input information
			record.setFieldValue('custrecord_exp_expensecategory', lineCategory);
			record.setFieldValue('custrecord_exp_claimamount', parseInt(claimTotal));
			record.setFieldValue('custrecord_exp_expensedate', lineDate);
			record.setFieldValue('custrecord_exp_department', lineDepartment);
			record.setFieldValue('custrecord_exp_claimid', expenseReportID);	
			record.setFieldValue('custrecord_exp_employee', employeeName);
			record.setFieldValue('custrecord_exp_expensepurpose', purposeDetails);
			record.setFieldValue('custrecord_exp_expenselineclaimamount', lineClaimAmount);

			// submit the changes to the lines to record
			nlapiSubmitRecord(record);
		}//; end for
	}
	catch(e)
	{
		// error
		nlapiLogExecution('DEBUG', 'Error occured in the link' + e);
	}

	return true;
}
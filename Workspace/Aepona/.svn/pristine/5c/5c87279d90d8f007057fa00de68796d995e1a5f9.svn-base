/*****************************************
 * Name:	 Expense Claim Printing
 * Author:   FHL - P lewis
 * Client: 	 Aepona
 * Date:     27 Feb 2012
 * Version:  1.0.04
 ******************************************/

function printExpenseClaim()
{
		
	var ExpenseClaimID = request.getParameter('custparam_claimid');
	var ExpenseClaimRecord = '';

	if(ExpenseClaimID == "" || ExpenseClaimID == null)
	{
		var errormsg = "<html><body><p>You cannot print this Expense Claim as it has not been saved yet, or the Expense Claim Parameter has been passed through incorrectly.</p></body></html>";
		response.write(errormsg);
		//alert('You cannot print this Expense Claim as it has not been saved yet.');
		return true;
	}

	//var errormsg = "<html><body><p><img src='http://shopping.sandbox.netsuite.com/core/media/media.nl?id=3804&c=1246650&h=97498d99fb2f690a8313'/>Correctly detected Expense Claim ID<br><br>Expense Claim Internal ID: " + ExpenseClaimID + ".</p>";

	// if a parameter has been passed
	if (ExpenseClaimID) 
	{
		
		// load item fulfillment record
		ExpenseClaimRecord = nlapiLoadRecord('expensereport',ExpenseClaimID);
		
		// get required header fields from fulfillment record and escape into xml
		var ExpenseEmployee = nlapiEscapeXML(ExpenseClaimRecord.getFieldText('entity'));
		var ExpenseNumber = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('tranid'));
		var ExpenseCompany = nlapiEscapeXML(ExpenseClaimRecord.getFieldText('subsidiary'));
		var ExpenseDepartment = '';	//get this from the first expense line
		var ExpenseSupervisor = nlapiEscapeXML(ExpenseClaimRecord.getFieldText('custbody_employee_supervisor'));; 
		var ExpenseSupervisorApprovalStatus = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('supervisorapproval'));//supervisorapproval
		if(ExpenseSupervisorApprovalStatus == 'T')
		{
			ExpenseSupervisorApprovalStatus = 'Approved';
		}
		else
		{
			ExpenseSupervisorApprovalStatus = 'Not Yet Approved';
		}
		
		var ExpenseAccountingApprovalStatus = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('accountingapproval')); //accountingapproval
		if(ExpenseAccountingApprovalStatus == 'T')
		{
			ExpenseAccountingApprovalStatus = 'Approved';
		}
		else
		{
			ExpenseAccountingApprovalStatus = 'Not Yet Approved';
		}
		
		var ExpenseDate = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('trandate'));
		var ExpensePurpose = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('memo'));
		var ExpenseClaimValue = nlapiEscapeXML(ExpenseClaimRecord.getFieldValue('custbody_claimamount'));
		var ExpenseClaimCurrency = nlapiEscapeXML(ExpenseClaimRecord.getFieldText('custbody_employeebasecurrency')); 
		
		
		var NumOfItems = ExpenseClaimRecord.getLineItemCount('expense');
		
		//create the header of the PDF
		 var pdfxml= '<?xml version="1.0"?>';
		pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		pdfxml += '<pdf>';
		pdfxml += '<head><meta name="title" value="Expense Claim" />\n<style type="text/css">.style1{height: 23px;}</style></head>';
		pdfxml += '<body background-color="white" font-size="12"  size="A4-landscape">';
		
		pdfxml += '<table style="width:100%;"><tr><td><img display="inline" src="https://system.netsuite.com/core/media/media.nl?id=1&amp;c=1246650&amp;h=e982c1aa5832b7d87713" dpi="190" /></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">&nbsp;</td></tr></table>';
		pdfxml += '<p style="font-family: Arial, Helvetica, sans-serif; font-size: large; font-weight: bold;">Expense Claim</p>';
		pdfxml += '<table width="100%"><tr><td><table style="width: 60%;"><tbody>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; width: 35%;"><strong>Name</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseEmployee + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Company</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseCompany + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Department</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">#department#</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Supervisor</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' +ExpenseSupervisor + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Supervisor Approval Status</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseSupervisorApprovalStatus + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Accounting Approval Status</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' +ExpenseAccountingApprovalStatus +'</td></tr>';
		pdfxml += '</tbody></table></td>';
		pdfxml += '<td align="right" valign="top">';
		pdfxml += '<table style="width: 50%;"><tbody><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Claim Number</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseNumber +  '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Date of Claim</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseDate + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Purpose</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpensePurpose + '</td></tr>';
		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Total Claim Value</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseClaimCurrency + ExpenseClaimValue +'</td></tr>';
		pdfxml += '</tbody></table></td></tr></table><br /><br /><table style="border: thin solid #000000; width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Date of Expense</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Expense Category</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Details</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Project</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Expense Currency</b></td>'; //custrecord_exp_currincurred
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Expense Amount</b></td>'; //custrecord_exp_amount
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Rate to Claim Currency</b></td>';//custrecord_exp_exchangerate
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Claim Amount</b></td>'; //custrecord_exp_claimpaidin
		pdfxml += '</tr>';
		
		

		//For each Expense Line Item in the Expense Claim...
		for(var I=1;I <= NumOfItems; I++)
		{
			var ExpenseLineCustomRecordID = nlapiEscapeXML(ExpenseClaimRecord.getLineItemValue('expense', 'custcol_line_rec_id', I));
			if(ExpenseLineCustomRecordID == null || ExpenseLineCustomRecordID == '')
			{
				var errormsg = "<html><body><p>You cannot print this Expense Claim as it was created before this function was implemented.</p></body></html>";
				response.write(errormsg);
				return true;
			}
			
			var ExpenseLineCustomRecord = nlapiLoadRecord('customrecord_expenseline',ExpenseLineCustomRecordID);
			ExpenseDepartment  = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldText('custrecord_exp_department'));
			
			
			
			var ExpenseLineDate = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_expensedate'));
			var ExpenseLineCategory = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldText('custrecord_exp_expensecategory'));
			var ExpenseLineDetails = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_reason'));
			var ExpenseLineProject = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldText('custrecord_exp_project'));
			var ExpenseLineSummary = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_expensesummary'));
			
			//from the Expense Claim
			var ExpenseLineExpenseCurrency = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldText('custrecord_exp_currincurred'));
			var ExpenseLineExpenseAmount = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_amount'));
			
			//From the Custom Record
			var ExpenseLineRateToClaim = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_exchangerate'));
			var ExpenseLineClaimAmount = nlapiEscapeXML(ExpenseLineCustomRecord.getFieldValue('custrecord_exp_expenselineclaimamount'));
			
			pdfxml +='<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineDate + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineCategory + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineDetails + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineProject + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineExpenseCurrency + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineExpenseAmount + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineRateToClaim + '</td>';
			pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseLineClaimAmount + '</td></tr>';
			
		
		} // for loop - I
		
		pdfxml = pdfxml.replace('#department#', ExpenseDepartment);
	
		pdfxml += '</table><br /><table width="100%" align="right"><tr><td align="right">&nbsp;<table width="300px" style="border: thin solid #000000;">';
		pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>TOTAL</b></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + ExpenseClaimValue +'</td></tr>';
		pdfxml += '</table></td></tr></table></body></pdf>';		
	
	
		try
		{
			var file = nlapiXMLToPDF(pdfxml);
			response.setContentType('PDF','ExpenseClaim.pdf');
			response.write(file.getValue());
		}
		catch(e)
		{
			var errormsg = "<html><body><p>Error: " + e.message +"</p></body></html>";
			response.write(errormsg);
		}//try
	} //if
	else
	{
		var errormsg = "<html><body><p>Error: You must save the Expense Claim before printing it. ExpenseRecordID = " + ExpenseClaimID+ ", ExpenseItems = " + NumOfItems +"</p></body></html>";
		response.write(errormsg);
	}		
	return true;
}
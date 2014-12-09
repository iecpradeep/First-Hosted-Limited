
function updateMain()
{
	alert('yo');
	var lineNo = nlapiGetFieldValue('custpage_line_number');
	alert('lineNo: ' + lineNo);
	var lastPaySlipId = nlapiGetFieldValue('custpage_payslip');
	alert('lastPaySlipId: ' + lastPaySlipId);
	var paySlipURLStr = nlapiResolveURL("RECORD","customrecord_pr_payslip",null);
	alert('paySlipURLStr: ' + paySlipURLStr);
	
	if(lastPaySlipId != null)
	{
		var value = "<a href='" + paySlipURLStr + "&id=" + lastPaySlipId + "' target='_new'>last payslip</a>"
		window.opener.nlapiSetLineItemValue('custpage_create_payslips','custpage_last_payslip',lineNo,value);
 ?		window.close();
	}
	else
	{
		alert('Select a payslip to link to')
	}
	
	return;
	
}




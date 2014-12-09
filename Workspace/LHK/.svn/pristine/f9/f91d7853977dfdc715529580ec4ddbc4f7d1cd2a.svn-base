// JavaScript Document
function getPasswordHint(params) {
	
	retemail = params.getParameter("retemail");
	nlapiLogExecution('DEBUG', 'retemail',retemail);
	var retunval = "";
	
	var filters = new Array();	
	filters.push(new nlobjSearchFilter('email', null, 'is', retemail));
	filters.push(new nlobjSearchFilter('custentity_password_hint', null, 'isnotempty', retemail));
	
	var columns = new Array();	
	columns.push(new nlobjSearchColumn('internalid'));
	columns[0].setSort(true);
	columns.push(new nlobjSearchColumn('custentity_password_hint'));
	
	
	
	var cust = nlapiSearchRecord('customer', null, filters, columns);	
	
	if(cust && cust[0]) {
		retunval = cust[0].getValue('custentity_password_hint');
		nlapiLogExecution('DEBUG', 'returnval',retunval);
	}
	
	response.write(retunval);
}


function forgetpasswordmessage(params) {
	retemail = params.getParameter("retemail");
	nlapiLogExecution('DEBUG', 'retemail',retemail);
	if(retemail) {
		var filters = new Array();	
		filters.push(new nlobjSearchFilter('email', null, 'is', retemail));	
		
		var columns = new Array();	
		columns.push(new nlobjSearchColumn('internalid'));
		
		var cust = nlapiSearchRecord('customer', null, filters, columns);
		if(cust && cust.length) {
			nlapiLogExecution('DEBUG', 'cust.length',cust.length);
			var message = nlapiCreateRecord("message");
			message.setFieldValue("author",-5);
			message.setFieldValue("emailed",'T');
			message.setFieldValue("entity",cust[0].getValue("internalid"));
			message.setFieldValue("subject","Password Change Request For LHK Fine Wines Account");
			message.setFieldValue("message","Thank you for shopping at LHK Fine Wines.<br><br>To change your password, please click the link below or carefully paste it into a browser window, being sure to copy the whole URL:<br><br><i>&lt;CHANGEPASSWORDURL&gt;</i><br><br>Thank you.");
			nlapiSubmitRecord(message);
		}
	}
	
		
}
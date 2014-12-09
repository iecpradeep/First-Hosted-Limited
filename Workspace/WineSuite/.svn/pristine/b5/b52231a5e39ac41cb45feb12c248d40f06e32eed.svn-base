function signup(params) {
	var name = params.getParameter('name');
    var email = params.getParameter('email');
	var msg='notok';
	
	try {
		date = new Date();
		var lead = nlapiCreateRecord("lead");
		lead.setFieldValue('isperson', "T");
		lead.setFieldValue('email', email);
		lead.setFieldValue('firstname', name);
		lead.setFieldValue('customform', -8);
		lead.setFieldValue('leadsource', 6);
		lead.setFieldValue('entityid', name + date.getUTCMilliseconds());
		
		//nlapiLogExecution('ERROR', 'EMAIL SIGNUP', name + email);	
		var leadId = nlapiSubmitRecord(lead,true,true);
	    msg = 'ok';
	}catch(e) {
		nlapiLogExecution('ERROR', 'EMAIL SIGNUP', e);	
	}
	
	response.write(msg);
}
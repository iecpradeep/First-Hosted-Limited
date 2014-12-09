function getHint(param) {
	
	try {
		var email = param.getParameter('email');
		
		leadsearch = nlapiSearchRecord('lead', null,  
								new nlobjSearchFilter('email', null, 'is',  email), 
								new nlobjSearchColumn("custentity_password_hint")
								);
		
		ret = 'nohint';
		if(leadsearch && leadsearch.length) {
			
			if(leadsearch[0].getValue("custentity_password_hint")) {
				ret = leadsearch[0].getValue("custentity_password_hint");
			}
		
		}
		
		response.write( ret );	
	} catch (e) {
		nlapiLogExecution('ERROR', 'customer error', e);
	}

}
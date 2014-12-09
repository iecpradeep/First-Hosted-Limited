function caseList(request, response){


	var screen = request.getParameter('custparam_screen');
	var html = '<html><body style=\"font-family:arial; font-size:11px\">';
	
	if (screen == null || screen == 1) {
	
		var returncols = new Array();
		returncols[0] = new nlobjSearchColumn('datecreated');
		returncols[1] = new nlobjSearchColumn('entity');
		returncols[2] = new nlobjSearchColumn('entitystatus');
		returncols[3] = new nlobjSearchColumn('salesrep');
		
		var searchfilters = new Array();
		searchfilters[0] = new nlobjSearchFilter('documentstatus', null, 'is', '1');
		
		
		
		
		var results = nlapiSearchRecord('opportunity', null, null, returncols);
		
		if (results != null) {
			var totalnew = results.length;
		}
		else {
			var totalnew = 0;
		}
		
		html += '<h1>Opportunities (' + totalnew + ')</h1><br>';
		
		html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:11px\"><tr><td><b>Created Date</b></td><td><b>Company</b></td><td><b>Status</b></td><td><b>Sales Rep</b></td><td><b></b></td><td> <b></b> </td></tr>';
		
		
		
		for (var i = 0; results != null && i < results.length; i++) {
		
			var currentsearchresult = results[i];
			
			var casedate = currentsearchresult.getValue('datecreated');
			var casecompany = currentsearchresult.getText('entity');
			var casenumber = currentsearchresult.getValue('entitystatus');
			var casetitle = currentsearchresult.getValue('salesrep');
			
			
			html += '<tr><td>' + casedate + '</td><td>' + casecompany + '</td><td>' + casenumber + '</td><td>' + casetitle + '</td><td>' + '</td><td>' +  '</td></tr>';
		
		} //for
		
		html += '</table></body><meta http-equiv="refresh" content="10;url=https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=21&deploy=1&custparam_screen=1"/></html>';			

	} //if screen 1
			
	// html += '</table></body><meta http-equiv="refresh" content="10"/></html>';

	response.write(html);
}
function caseList(request, response){


	var screen = request.getParameter('custparam_screen');
	var html = '<html><body style=\"font-family:arial; font-size:11px\">';
	
	if (screen == null || screen == 1) {
	
		var returncols = new Array();
		returncols[0] = new nlobjSearchColumn('createddate');
		returncols[1] = new nlobjSearchColumn('company');
		returncols[2] = new nlobjSearchColumn('casenumber');
		returncols[3] = new nlobjSearchColumn('title');
		returncols[4] = new nlobjSearchColumn('contact');
		returncols[5] = new nlobjSearchColumn('status');
		returncols[6] = new nlobjSearchColumn('assigned');
		
		var searchfilters = new Array();
		searchfilters[0] = new nlobjSearchFilter('status', null, 'is', '1');
		searchfilters[1] = new nlobjSearchFilter('type', null, 'is', '5');
		
		
		
		
		var results = nlapiSearchRecord('supportcase', null, searchfilters, returncols);
		
		if (results != null) {
			var totalnew = results.length;
		}
		else {
			var totalnew = 0;
		}
		
		html += '<h1>New Cases (' + totalnew + ')</h1><br>';
		
		html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:15px\"><tr><td><b>Case Number</b></td><td><b>Company</b></td><td><b>Contact</b></td><td><b>Subject</b></td><td><b>Status</b></td><td> <b>Date/Time</b> </td><td><b>Assigned To</br></td></tr>';
		
		
		
		for (var i = 0; results != null && i < results.length; i++) {
		
			var currentsearchresult = results[i];
			
			var casedate = currentsearchresult.getValue('createddate');
			var casecompany = currentsearchresult.getText('company');
			var casenumber = currentsearchresult.getValue('casenumber');
			var casetitle = currentsearchresult.getValue('title');
			var casecontact = currentsearchresult.getText('contact');
			var casestatus = currentsearchresult.getText('status');
			var assignedto = currentsearchresult.getText('assigned');
			
			
			
			html += '<tr><td>' + casenumber + '</td><td>' + casecompany + '</td><td>' + casecontact + '</td><td>' + casetitle + '</td><td>' + casestatus + '</td><td>' + casedate + '</td><td>' + assignedto + '</td></tr>';
		
		} //for
		
		html += '</table></body><meta http-equiv="refresh" content="20;url=https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=97&deploy=1&compid=698509&h=305487ecd206923cd790&custparam_screen=2"/></html>';			

	} //if screen 1
	else 
		if (screen == 2) 
		{
		

			
			
			var openreturncols = new Array();
			openreturncols[0] = new nlobjSearchColumn('createddate');
			openreturncols[1] = new nlobjSearchColumn('company');
			openreturncols[2] = new nlobjSearchColumn('casenumber');
			openreturncols[3] = new nlobjSearchColumn('title');
			openreturncols[4] = new nlobjSearchColumn('contact');
			openreturncols[5] = new nlobjSearchColumn('status');
			openreturncols[6] = new nlobjSearchColumn('assigned');
			
			
			var openFilters = new Array();
			openFilters[0] = new nlobjSearchFilter('stage', null, 'is', 'OPEN');
			openFilters[1] = new nlobjSearchFilter('status', null, 'noneof', '1');
			openFilters[2] = new nlobjSearchFilter('type', null, 'is', '5');
			
			
			var openresults = nlapiSearchRecord('supportcase', null, openFilters, openreturncols);

		if (openresults != null) {
			var totalopen = openresults.length;
		}
		else {
			var totalo = 0;
		}
			

			html += '<h1>Open Cases (' + totalopen + ')</h1><br>';
			
	//		html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:11px\"><tr><td><b>Case Number</b></td><td><b>Company</b></td><td><b>Contact</b></td><td><b>Subject</b></td><td><b>Status</b></td><td> <b>Date/Time</b> </td></tr>';
			html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:15px\"><tr><td><b>Case Number</b></td><td><b>Company</b></td><td><b>Contact</b></td><td><b>Subject</b></td><td><b>Status</b></td><td> <b>Date/Time</b> </td><td><b>Assigned To</br></td></tr>';



			for (var j = 0; openresults != null && j < openresults.length; j++) {
			
				var currentsearchresult = openresults[j];
				
				var casedate = currentsearchresult.getValue('createddate');
				var casecompany = currentsearchresult.getText('company');
				var casenumber = currentsearchresult.getValue('casenumber');
				var casetitle = currentsearchresult.getValue('title');
				var casecontact = currentsearchresult.getText('contact');
				var casestatus = currentsearchresult.getText('status');
				var assignedto = currentsearchresult.getText('assigned');
				
				//html += '<tr><td>' + casenumber + '</td><td>' + casecompany + '</td><td>' + casecontact + '</td><td>' + casetitle + '</td><td>' + casestatus + '</td><td>' + casedate + '</td></tr>';
				html += '<tr><td>' + casenumber + '</td><td>' + casecompany + '</td><td>' + casecontact + '</td><td>' + casetitle + '</td><td>' + casestatus + '</td><td>' + casedate + '</td><td>' + assignedto + '</td></tr>';

				
			} //for

			html += '</table></body><meta http-equiv="refresh" content="20;url=https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=97&deploy=1&compid=698509&h=305487ecd206923cd790&custparam_screen=1"/></html>';

		} //if screen 2
			
	// html += '</table></body><meta http-equiv="refresh" content="20"/></html>';

	response.write(html);
}
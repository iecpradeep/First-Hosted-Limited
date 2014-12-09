function caseList(request, response){



  	var html = '<html><body style=\"font-family:arial; font-size:11px\"><img src=\"https://system.netsuite.com/core/media/media.nl?id=536&c=698509&h=c6cc8c21449a66507447" /> <h1>New Cases</h1><br>';

	html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:11px\"><tr><td><b>Case Number</b></td><td><b>Company</b></td><td><b>Contact</b></td><td><b>Subject</b></td><td><b>Status</b></td><td> <b>Date/Time</b> </td><td><b>Product</b></td></tr>';

	
	var returncols = new Array();
	returncols[0] = new nlobjSearchColumn('createddate');
	returncols[1] = new nlobjSearchColumn('company');
	returncols[2] = new nlobjSearchColumn('casenumber');
	returncols[3] = new nlobjSearchColumn('title');
	returncols[4] = new nlobjSearchColumn('contact');
	returncols[5] = new nlobjSearchColumn('status');
	returncols[6] = new nlobjSearchColumn('issue');	


	var results = nlapiSearchRecord('supportcase', null, new nlobjSearchFilter('assigned',null,'anyof','@NONE@'), returncols);

	for ( var i = 0; results != null && i < results.length; i++ )
		{

			var currentsearchresult = results[i];

			var casedate = currentsearchresult.getValue('createddate');
			var casecompany = currentsearchresult.getText('company');
			var casenumber = currentsearchresult.getValue('casenumber');
			var casetitle = currentsearchresult.getValue('title');
			var casecontact = currentsearchresult.getText('contact');
			var casestatus = currentsearchresult.getText('status');
			var caseissue = currentsearchresult.getText('issue');
		
	
			html += '<tr><td>' + casenumber + '</td><td>' + casecompany + '</td><td>' + casecontact + '</td><td>' + casetitle + '</td><td>' + casestatus + '</td><td>' + casedate + '</td><td>' +  caseissue + '</td></tr>';

		} //for

  	html += '</table><br><h1>Open Cases</h1><br>';

	html += '<table cellpadding=\"1\" width=\"100%\" style=\"font-family:arial; font-size:11px\"><tr><td><b>Case Number</b></td><td><b>Company</b></td><td><b>Contact</b></td><td><b>Subject</b></td><td><b>Status</b></td><td> <b>Date/Time</b> </td><td><b>Product</b></td></tr>';

	
	var openreturncols = new Array();
	openreturncols[0] = new nlobjSearchColumn('createddate');
	openreturncols[1] = new nlobjSearchColumn('company');
	openreturncols[2] = new nlobjSearchColumn('casenumber');
	openreturncols[3] = new nlobjSearchColumn('title');
	openreturncols[4] = new nlobjSearchColumn('contact');
	openreturncols[5] = new nlobjSearchColumn('status');
	openreturncols[6] = new nlobjSearchColumn('issue');	


	var openresults = nlapiSearchRecord('supportcase', null, new nlobjSearchFilter('stage',null,'is','OPEN'), openreturncols);

	for ( var j = 0; openresults != null && j < openresults.length; j++ )
		{

			var currentsearchresult = openresults[j];

			var casedate = currentsearchresult.getValue('createddate');
			var casecompany = currentsearchresult.getText('company');
			var casenumber = currentsearchresult.getValue('casenumber');
			var casetitle = currentsearchresult.getValue('title');
			var casecontact = currentsearchresult.getText('contact');
			var casestatus = currentsearchresult.getText('status');			
			var caseissue = currentsearchresult.getText('issue');

			html += '<tr><td>' + casenumber + '</td><td>' + casecompany + '</td><td>' + casecontact + '</td><td>' + casetitle + '</td><td>' + casestatus + '</td><td>' + casedate + '</td><td>' +  caseissue + '</td></tr>';

		} //for

	
	html += '</table></body><meta http-equiv="refresh" content="5"/></html>';

	response.write(html);
}
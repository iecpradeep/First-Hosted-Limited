function generateStatement(request, response)
{   
	if (request.getMethod() == 'GET')
	{      
		var form = nlapiCreateForm('Generate AfterCare Statement [Build 1.0.3]');
		
		var entityField = form.addField('entity', 'select', 'Customer', 'customer');
		entityField.setLayoutType('normal', 'startcol');
		entityField.setMandatory(true);

		var startdateField = form.addField('startdate', 'date', 'Start Date');
		startdateField.setMandatory(true);		

		var enddateField = form.addField('enddate', 'date', 'End Date');
		enddateField.setMandatory(true);
		
		form.addSubmitButton();
		form.addResetButton();

		response.writePage(form);
	} //if

	else

	{      
		var entity = request.getParameter("entity");
		var startdate = request.getParameter("startdate");
		var enddate = request.getParameter("enddate");

		var custname = nlapiLookupField('customer',entity,'entityid');


   		var html = '<html><body style=\"font-family:arial; font-size:11px\"><img src=\"https://system.netsuite.com/core/media/media.nl?id=536&c=698509&h=c6cc8c21449a66507447" /> <h1>AfterCare Statement</h1><br>';

		html = html + '<table><tr><td>Customer:</td><td>' + custname + '</td></tr><tr><td>Statement Start Date: </td><td>' + startdate + '</td></tr><tr><td>Statement End Date:</td><td>' + enddate + '</td></tr></table><br><br>';		

		html = html + '<table border = 1><tr><th>Date</th><th>Case</th><th>Credits</th></tr>';


		// Calculate Opening Balance using transactions prior to startdate


		var openfilters = new Array();
		openfilters[0] = new nlobjSearchFilter('custrecord_htrans_customer',null,'is',entity);
		openfilters[1] = new nlobjSearchFilter('custrecord_htrans_date',null,'before',startdate);

		var opencolumns = new Array();
		opencolumns[0] = new nlobjSearchColumn('custrecord_htrans_date');
		opencolumns[1] = new nlobjSearchColumn('custrecord_htrans_impact');

		var opensearchresults = nlapiSearchRecord('customrecord_helplinetransaction', null, openfilters, opencolumns);

		var openingbalance = 0;

		for ( var i = 0; opensearchresults != null && i < opensearchresults.length; i++ )
		{

			var opensearchresult = opensearchresults[i];

			var transimpact = opensearchresult.getValue('custrecord_htrans_impact');

			openingbalance = openingbalance + parseInt(transimpact);

		}


		// display opening balance as first line of table

		html = html + '<tr><td>' + startdate + '</td><td>Opening Balance</td><td>' + openingbalance + '</td></tr>';

		// retrieve transactions in current period, add rows to table and keep running total

		var runningtotal = 0;

		var currentfilters = new Array();
		currentfilters[0] = new nlobjSearchFilter('custrecord_htrans_customer',null,'is',entity);
		currentfilters[1] = new nlobjSearchFilter('custrecord_htrans_date',null,'within',startdate,enddate);

		var currentcolumns = new Array();
		currentcolumns[0] = new nlobjSearchColumn('custrecord_htrans_date');
		currentcolumns[1] = new nlobjSearchColumn('custrecord_htrans_case');
		currentcolumns[2] = new nlobjSearchColumn('custrecord_htrans_impact');

		var currentsearchresults = nlapiSearchRecord('customrecord_helplinetransaction', null, currentfilters, currentcolumns);

		for ( var i = 0; currentsearchresults != null && i < currentsearchresults.length; i++ )
		{

			var currentsearchresult = currentsearchresults[i];

			var transdate = currentsearchresult.getValue('custrecord_htrans_date');
			var transcase = currentsearchresult.getText('custrecord_htrans_case');
			var transimpact = currentsearchresult.getValue('custrecord_htrans_impact');

			if (transcase == null || transcase == '')
			{
				if (parseInt(transimpact) > 0)
				{
					html = html + '<tr><td>' + transdate + '</td><td>Additional Credits</td><td>' + transimpact + '</td></tr>';
				} //if
				
				else
				{
					html = html + '<tr><td>' + transdate + '</td><td>\&nbsp</td><td>' + transimpact + '</td></tr>';
				} //else

			} //if

			else

			{
				html = html + '<tr><td>' + transdate + '</td><td>' + transcase + '</td><td>' + transimpact + '</td></tr>';
			} //else
			
			runningtotal = runningtotal + parseInt(transimpact);

		} //for

 
		// add closing balance to table and terminate html

		var closingbalance = openingbalance + runningtotal;

		html = html + '<tr><td>' + enddate + '</td><td>Closing Balance</td><td>' + closingbalance + '</td></tr></table></body></html>';

		response.write(html);    

		//prefix header with Custom-Header. See nlobjResponse.setHeader(name, value)    

		response.setHeader('Custom-Header-Demo', 'Demo');


	} //else

} //function
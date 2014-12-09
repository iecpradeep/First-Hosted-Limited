// JavaScript Document
function sellWine(params) {
	var customerID = params.getParameter('customerid');
	var fname = params.getParameter('fname');
	var lname = params.getParameter('lname');
	var email = params.getParameter('email');
	var phone = params.getParameter('phone');
	var wines = unescape(params.getParameter('wines'));
	msg = "ok";
	try {
		if(customerID == "X") {		
		
			var customersearchResults = nlapiSearchRecord('customer', null,   [new nlobjSearchFilter('email', null, 'is', email)], null);
			
			var leadsearchResults = nlapiSearchRecord('lead', null,   [new nlobjSearchFilter('email', null, 'is', email), new nlobjSearchFilter('firstname', null, 'is', fname), new nlobjSearchFilter('lastname', null, 'is', lname)], null);
			
			if(customersearchResults && customersearchResults.length) {
				customerID = customersearchResults[0].getId();
			} else if(leadsearchResults && leadsearchResults.length) {
				customerID = leadsearchResults[0].getId();
			} else {
				var lead = nlapiCreateRecord("lead");
				lead.setFieldValue('entityid', fname + ' ' + lname + ' ' +email);
				lead.setFieldValue('email', email);
				lead.setFieldValue('firstname', fname);
				lead.setFieldValue('lastname', lname);
				lead.setFieldValue('phone', phone);
				customerID = nlapiSubmitRecord(lead, true, true); 	
				var lead = nlapiLoadRecord('lead',customerID);
				lead.setFieldValue('entityid','lead-' +customerID);
				customerID = nlapiSubmitRecord(lead, true, true); 	
			}
		} 
		
		//parse wine info
		var rows = wines.split('*');
		
		var subject = "Sell Your Wines";
		var emailBody = "<table width='781' border='0' style='font-family:verdana; font-size:8pt;'><tr><td colspan='4' style='font-family:verdana; font-size:11pt; font-weight:bold'>Inquiry from "+ fname + ' ' + lname +" (" + email +")</td></tr><tr><td colspan='4'>&nbsp;</td></tr><tr><td><b>Vintage</b></td><td><b>Wine</b></td><td><b>Unit Size</b></td><td><b>Duty Status</b></td><td><b>Qty</b</td></tr>";
	
		for(i=0; i < rows.length && rows[i]; i++) {
			
			var wineinfo = rows[i].split('~');
				
			var vintage = wineinfo[0].replace(/astiSign/,'*').replace(/estiSign/,'~');
			var wine = wineinfo[1].replace(/astiSign/,'*').replace(/estiSign/,'~');
			var unitsize = wineinfo[2].replace(/astiSign/,'*').replace(/estiSign/,'~');
			var dutystatus = wineinfo[3].replace(/astiSign/,'*').replace(/estiSign/,'~');
			var qty = wineinfo[4].replace(/astiSign/,'*').replace(/estiSign/,'~');
			
			var soldwines = nlapiCreateRecord("customrecord_soldwines");
			soldwines.setFieldValue('custrecord_customer', customerID);
			soldwines.setFieldValue('custrecord_vintage', vintage);
			soldwines.setFieldValue('custrecord_wine', wine);
			soldwines.setFieldValue('custrecord_unit_size', unitsize);
			soldwines.setFieldValue('custrecord_duty_status', dutystatus);
			soldwines.setFieldValue('custrecord_qty', qty);
			nlapiSubmitRecord(soldwines, true, true); 
			
			emailBody += "<tr><td>" + vintage  + "</td><td>" + wine + "</td><td>" + unitsize + "</td><td>" +dutystatus  + "</td><td>" + qty + "</td><tr>";
		}
		emailBody += "</table>";
		
		var author = "-5"; //email from
		var recipient = "info@lhkwines.com"; //email to
		nlapiSendEmail(author, recipient, subject, emailBody);
		
	} catch(e) {
		msg="notok";
		nlapiLogExecution('ERROR', 'sell your wine', e);			
	}
	
	response.write(msg);
}


function GenerateSellWinesCSV(params)
{

	var email = "Sell Your Wines\t"
	email = email + "\n\t\t";
	
	email += "\nFirst Name\t";
	email += "\nLast Name\t";
	email += "\nPhone\t";
	email += "\nEmail\t\n";
	
	
	email = email + "\nVintage\tWine\tUnit Size\tDuty Status\tQty";
	
	var file = nlapiCreateFile('Sell Your Wines.txt', 'PLAINTEXT', email);
	response.setContentType('CSV','Sell Your Wines.xls');
	response.write( file.getValue() );	
}


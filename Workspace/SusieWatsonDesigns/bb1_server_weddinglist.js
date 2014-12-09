function BeforeLoad(type, form) {

}

function BeforeSubmit(type) {
	ClearCustomerWeddingListSettings(type);
	DeleteChildRecords(type);
}

function AfterSubmit(type) {
	EmailNewRegistration(type);
	//UpdatePurchasedWeddingListLines(type);  // Can only handle 50 lines in UE, better handled in scheduled script
}

function ClearCustomerWeddingListSettings(type) {
	try {
		if (type!="delete") return;
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custentity_bb1_weddinglist_active', null, 'is', nlapiGetRecordId(), null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('internalid');
		var results = nlapiSearchRecord('customer', null, filters, columns);
		if (results) {
			for (var i=0; i < results.length; i++)
				nlapiSubmitField("customer", results[i].getId(), "custentity_bb1_weddinglist_active", null);
		}
	}
	catch (err) {
		WriteErrorLog(err);
	}
}

function DeleteChildRecords(type) {
	if (type!="delete") return;
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_bb1_wli_parent', null, 'is', nlapiGetRecordId(), null);
	var results = nlapiSearchRecord('customrecord_bb1_wli', null, filters, null);
	if (results) {
		for (var i=0; i < results.length; i++)
			nlapiDeleteRecord("customrecord_bb1_wli", results[i].getId());
	}
}

function EmailNewRegistration(type) {
	try {
		if (type!="create") return;
		var context = nlapiGetContext();
		var template = context.getSetting("SCRIPT", "custscript_bb1_wl_reg_emailtemplate");
		var sender = context.getSetting("SCRIPT", "custscript_bb1_wl_reg_emailsender");
		var recipient = nlapiGetFieldValue("custrecord_bb1_wl_customer");
		var recipient2 = nlapiGetFieldValue("custrecord_bb1_wl_p2_email");
		var cc = (recipient2&&recipient2!="") ? new Array(recipient2) : null;
		var subject = "Thank you for registering your wedding list";
		var merged_fields = new Array();
		var activetill = nlapiStringToDate(nlapiGetFieldValue("custrecord_bb1_wl_weddingdate"))
		activetill.setDate(activetill.getDate()+42);
		merged_fields["DATE_ACTIVE_TILL"] = nlapiDateToString(activetill);
		var records = new Array();
		records["entity"] = recipient;
		var body = nlapiMergeRecord(template, 'customrecord_bb1_wl', nlapiGetRecordId(), 'customer', recipient, merged_fields);
		nlapiSendEmail(sender, recipient, subject, body.getValue(), cc, null, records);
	}
	catch (err) {
		WriteErrorLog(err);
	}
}

function UpdatePurchasedWeddingListLines(type) {
	if (type=="delete") return;
	var updated = 0, min_usage = 20, context = nlapiGetContext();

	var giftids = new Array();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, null);
	if (results) {
		for (var i=0; i < results.length; i++) {
			giftids[i] = parseInt(results[i].getId());
		}
	}

	var filters = new Array();
	filters[0] = new nlobjSearchFilter("voided", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("custcol_bb1_weddinggift2", null, "anyof", giftids, null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("custcol_bb1_weddinggift2", null, "group");
	columns[1] = new nlobjSearchColumn("quantity", null, "sum");
	var results = nlapiSearchRecord("salesorder", null, filters, columns);
	if (results && results.length > 0) {
		for (var i=0, results_l=results.length; i < results_l; i++) {
			var giftid = results[i].getValue("custcol_bb1_weddinggift2", null, "group");
			var qty = results[i].getValue("quantity", null, "sum");
			nlapiSubmitField("customrecord_bb1_wli", giftid, "custrecord_bb1_wli_purchased", qty);
			updated++;
			for (var j=giftids.length; j--;)
				if (giftids[j] == giftid) giftids.splice(j, 1);
		}
	}
	for (var j=giftids.length; j--;)
		nlapiSubmitField("customrecord_bb1_wli", giftids[j], "custrecord_bb1_wli_purchased", 0);

	nlapiLogExecution("DEBUG", "Records updated:", updated);
	nlapiLogExecution("DEBUG", "Usage remaining:", context.getRemainingUsage());
}

function WriteErrorLog(error) {
	try {
		var body = "";
		var subject = "Netsuite script error has occurred!";
		var context = nlapiGetContext();
		body = "Account: " + context.getCompany() + "\r\n";
		body += "Environment: " + context.getEnvironment() + "\r\n";
		body += "Date & Time: " + Date() + "\r\n";
		body += "Record Type: " + nlapiGetRecordType() + "\r\n";
		body += "Internal ID: " + nlapiGetRecordId() + "\r\n";
		body += "Execution Time: " + "\r\n";
		body += "Remaining Usage: " + context.getRemainingUsage() + "\r\n";
		body += "Type: " + context.getExecutionContext() + "\r\n";
		if (error instanceof nlobjError) {
			var stacktrace = error.getStackTrace();
			body += "Script: " + error.getUserEvent() + "\r\n";
			body += "Function: " + stacktrace[0] + "\r\n";
			body += "Error: " + error.getCode() + "\r\n" + error.getDetails() + "\r\n";
			body += "Stack Trace: ";
			for (var i=0; i < stacktrace.length; i++) {
				body += stacktrace[i] + "\r\n";
			}
		}
		nlapiLogExecution('ERROR','Caught exception:',body);
	}
	catch (err) {nlapiLogExecution('ERROR','Caught exception:',body);}
}
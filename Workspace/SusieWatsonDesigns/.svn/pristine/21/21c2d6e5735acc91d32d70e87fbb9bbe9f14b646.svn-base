function BeforeLoad(type, form) {
	SetWebPasswordVisible(type, form);
}

function BeforeSubmit(type) {

}

function AfterSubmit(type) {
	CheckIfUnsavedCollectionExists(type);
	CheckIfActiveWeddingListExists(type);
	CreateWeddingList(type);
}

function CreateWeddingList(type) {
	try {
		if (type=="delete" || nlapiGetFieldValue("formid")!=6) return;
		nlapiLogExecution('ERROR','role',nlapiGetRole());
		var wl = nlapiCreateRecord("customrecord_bb1_wl");
		wl.setFieldValue("altname", nlapiGetFieldValue("firstname")+" "+nlapiGetFieldValue("lastname")+" & "+nlapiGetFieldValue("custentity_bb1_weddinglist_p2_firstname")+" "+nlapiGetFieldValue("custentity_bb1_weddinglist_p2_surname"));
		wl.setFieldValue("custrecord_bb1_wl_customer", nlapiGetRecordId());
		wl.setFieldValue("custrecord_bb1_wl_weddingdate", nlapiGetFieldValue("custentity_bb1_weddinglist_date"));
		wl.setFieldValue("custrecord_bb1_wl_message", nlapiGetFieldValue("custentity_bb1_weddinglist_message"));
		wl.setFieldValue("custrecord_bb1_wl_cardsrequired", nlapiGetFieldText("custentity_bb1_weddinglist_cardsrequired"));
		wl.setFieldValue("custrecord_bb1_wl_p1_title", nlapiGetFieldValue("salutation"));
		wl.setFieldValue("custrecord_bb1_wl_p1_firstname", nlapiGetFieldValue("firstname"));
		wl.setFieldValue("custrecord_bb1_wl_p1_surname", nlapiGetFieldValue("lastname"));
		wl.setFieldValue("custrecord_bb1_wl_p2_title", nlapiGetFieldValue("custentity_bb1_weddinglist_p2_title"));
		wl.setFieldValue("custrecord_bb1_wl_p2_firstname", nlapiGetFieldValue("custentity_bb1_weddinglist_p2_firstname"));
		wl.setFieldValue("custrecord_bb1_wl_p2_surname", nlapiGetFieldValue("custentity_bb1_weddinglist_p2_surname"));
		wl.setFieldValue("custrecord_bb1_wl_p2_email", nlapiGetFieldValue("custentity_bb1_weddinglist_p2_email"));
		var wlid = nlapiSubmitRecord(wl, true);
		if (wlid) {
			nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), "custentity_bb1_weddinglist_active", wlid);
			EmailNewRegistration(wlid);
		}
		ClearWeddingListTempFields();
	}
	catch (err) {
		WriteErrorLog(err);
	}
}

function CheckIfActiveWeddingListExists(type) {
	if (type=="delete" || nlapiGetFieldValue("formid")!=6) return;
	var activelist = nlapiGetFieldValue("custentity_bb1_weddinglist_active");
	if (activelist && activelist!="") {
		var error = nlapiCreateError("WEDDINGLIST_EXISTS", "You currently have an existing wedding list and are only allowed one wedding list per user.<br><br> Please contact us by phone/email if you are having any difficulties with your wedding list.", true);
		throw error;
	}
}

function EmailNewRegistration(wlid) {
	try {
		var context = nlapiGetContext();
		var template = context.getSetting("SCRIPT", "custscript_bb1_wl_reg_emailtemplate");
		var sender = context.getSetting("SCRIPT", "custscript_bb1_wl_reg_emailsender");
		var recipient = nlapiGetRecordId();
		var recipient2 = nlapiGetFieldValue("custentity_bb1_weddinglist_p2_email");
		var cc = (recipient2&&recipient2!="") ? new Array(recipient2) : null;
		var subject = "Thank you for registering your wedding list";
		var merged_fields = new Array();
		var activetill = nlapiStringToDate(nlapiGetFieldValue("custentity_bb1_weddinglist_date"))
		activetill.setDate(activetill.getDate()+42);
		merged_fields["DATE_ACTIVE_TILL"] = nlapiDateToString(activetill);
		merged_fields["WEB_PASSWORD"] = nlapiGetFieldValue("custentity_bb1_web_password");
		var records = new Array();
		records["entity"] = recipient;
		var body = nlapiMergeRecord(template, 'customrecord_bb1_wl', wlid, 'customer', recipient, merged_fields);
		nlapiSendEmail(sender, recipient, subject, body.getValue(), cc, null, records);
	}
	catch (err) {
		WriteErrorLog(err);
	}
}

function ClearWeddingListTempFields() {  
	var parms = ["custentity_bb1_weddinglist_date", "custentity_bb1_weddinglist_message", "custentity_bb1_weddinglist_cardsrequired", "custentity_bb1_weddinglist_p2_title", "custentity_bb1_weddinglist_p2_firstname", "custentity_bb1_weddinglist_p2_surname", "custentity_bb1_weddinglist_p2_email"];
	var values = [null, null, null, null, null, null, null];
	nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), parms, values);
}

function SetWebPasswordVisible(type, form) {
	var context = nlapiGetContext();
	if (type=="delete" || context.getExecutionContext()!="userinterface") return;
	var pwd = form.getField("custentity_bb1_web_password");
	pwd.setDisplayType("normal");
}

function CheckIfUnsavedCollectionExists(type) {
	if (type!="create") return;

	var custid = nlapiGetRecordId();
	var formid = nlapiGetFieldValue("formid");
	var sessionid = nlapiGetFieldValue("custentity_bb1_cd_registration_sessionid");

	if (sessionid == null || sessionid == "") return;

	var cdid = GetCollectionID(sessionid);
	if (cdid == null) return;

	var name = "CD" + ZeroPad(nlapiGetRecordId(), 4);
	var cust_fields = nlapiLookupField("customer", custid, ["firstname","lastname","companyname"]);
	if (cust_fields["firstname"]!="" || cust_fields["lastname"]!="")
		name += " " + cust_fields["firstname"] + " " + cust_fields["lastname"];
	else
		name += " " + cust_fields["companyname"];

	try {
		nlapiSubmitField("customrecord_bb1_cd", cdid, ["name", "custrecord_bb1_cd_customer"], [name, custid]);
		nlapiSubmitField("customer", custid, "custentity_bb1_cd_active", cdid);
	}
	catch (err) { WriteErrorLog(err); }

}

function GetCollectionID(sessionid) {
	var cd = null;
	if (sessionid && sessionid!="") {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cd_sessionid', null, 'is', sessionid, null);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cd_customer', null, 'anyof', '@NONE@', null);
		var results = nlapiSearchRecord('customrecord_bb1_cd', null, filters, null);
		if (results && results.length>0)
			cd = results[0].getId();
	}
	return cd;
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
		nlapiLogExecution("ERROR","Caught exception:",body);
	}
	catch (err) {nlapiLogExecution("ERROR","Caught exception:",body);}
}

function ZeroPad(num,count) { 
	var numZeropad = num + '';
	while (numZeropad.length < count) {
		numZeropad = "0" + numZeropad; 
	}
	return numZeropad;
}
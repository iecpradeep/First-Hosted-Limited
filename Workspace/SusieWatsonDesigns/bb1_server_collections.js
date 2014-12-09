/* COLLECTION USER EVENT SUITESCRIPTS */

function BeforeLoad(type, form) {
	SetNameFieldUneditable(type, form);
}

function BeforeSubmit(type) {
	UpdateCustomersWithCollection(type);
	DeleteChildRecords(type);
}

function AfterSubmit(type) {
	AutoSetName(type);
}

function AutoSetName(type) {
	if (type=="delete") return;
	var customer = nlapiLookupField(nlapiGetRecordType(), nlapiGetRecordId(), "custrecord_bb1_cd_customer");
	var name = "CD"+ZeroPad(nlapiGetRecordId(), 4);
	if (customer && customer!="") {
		var cust_fields = nlapiLookupField("customer", customer, ["firstname","lastname","companyname"]);
		if (cust_fields["firstname"]!="" || cust_fields["lastname"]!="")
			name += " "+cust_fields["firstname"]+" "+cust_fields["lastname"];
		else
			name += " "+cust_fields["companyname"]
	}
	else {
		name += " Unsaved Collection";
	}
	nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), "name", name);
}

function UpdateCustomersWithCollection(type) {
	try {
		if (type!="delete") return;
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('custentity_bb1_cd_active', null, 'is', nlapiGetRecordId(), null);
		var results = nlapiSearchRecord('customer', null, filters, null);
		if (results) {
			for (var i=0; i < results.length; i++)
				nlapiSubmitField("customer", results[i].getId(), "custentity_bb1_cd_active", "");
		}
	}
	catch (err) {
		WriteErrorLog(err);
	}
}

function DeleteChildRecords(type) {
	if (type!="delete") return;
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', nlapiGetRecordId(), null);
	var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, null);
	if (results) {
		for (var i=0; i < results.length; i++)
			nlapiDeleteRecord("customrecord_bb1_cdi", results[i].getId());
	}
}

function SetNameFieldUneditable(type, form) {
	var context = nlapiGetContext();
	if (type=="delete" || context.getExecutionContext()!="userinterface") return;
	var name = form.getField("name");
	if (type=="create") nlapiSetFieldValue("name", "Auto name");
	name.setDisplayType("inline");
}

function ZeroPad(num,count) { 
	var numZeropad = num + '';
	while (numZeropad.length < count) {
		numZeropad = "0" + numZeropad; 
	}
	return numZeropad;
}

/* SCHEDULED SUITESCRIPTS */

function DeleteUnsavedCollections() { // Cleanup scheduled script to delete all un-saved collections created over 24 hours ago.

	var context = nlapiGetContext(), records_deleted = 0;

	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F");
	filters[1] = new nlobjSearchFilter("custrecord_bb1_cd_customer", null, "anyof", "@NONE@");
	filters[2] = new nlobjSearchFilter("lastmodified", null, "onorbefore", "daysago1");
	var collections = nlapiSearchRecord("customrecord_bb1_cd", null, filters); // 10 units

	if (collections && collections.length > 0) {

		var collection_lineids = [], collections_l = collections.length;
		for (var i=0; i < collections_l; i++)
			collection_lineids.push(collections[i].getId());

		var collection_lines = nlapiSearchRecord("customrecord_bb1_cdi", null, [new nlobjSearchFilter("custrecord_bb1_cdi_parent", null, "anyof", collection_lineids)]); // 10 units
		if (collection_lines && collection_lines.length > 0) {
			for (var i=0, collection_lines_l = collection_lines.length; i < collection_lines_l; i++) {
				if (!CheckScriptUsage(context, 20)) {
					nlapiLogExecution("DEBUG", "Collection items deleted:", records_deleted);
					return;
				}
				try {
					nlapiDeleteRecord("customrecord_bb1_cdi", collection_lines[i].getId()); // 20 units
					records_deleted++;
				}
				catch (err) { WriteErrorLog(err, false); }
			}
		}

		nlapiLogExecution("DEBUG", "Collection items deleted:", records_deleted);
		records_deleted = 0;

		for (var i=0; i < collections_l; i++) {
			if (!CheckScriptUsage(context, 20)) {
				nlapiLogExecution("DEBUG", "Collections deleted:", records_deleted);
				return;
			}
			try {
				nlapiDeleteRecord("customrecord_bb1_cd", collections[i].getId()); // 20 units
				records_deleted++;
			}
			catch (err) { WriteErrorLog(err, false); }
		}

		nlapiLogExecution("DEBUG", "Collections deleted:", records_deleted);
	}

}

function DeleteInactiveItemsFromCollections() { // Cleanup scheduled script to remove inactive/non-online items. Do not have to handle deleted items as NS will prevent deletetion of items referenced on another record.

	function DeleteCollectionItems(collection_items) {

		if (collection_items && collection_items.length > 0) {

			for (var i=0, l=collection_items.length; i < l; i++) {
				if (!CheckScriptUsage(context, 20)) break;
				try {
					nlapiDeleteRecord("customrecord_bb1_cdi", collection_items[i].getId()); // 20 units
					records_deleted++;
				}
				catch (err) { WriteErrorLog(err, false); }
			}

			nlapiLogExecution("DEBUG", "Inactive/non-web items deleted from collections:", records_deleted);
		}

	}

	var context = nlapiGetContext(), records_deleted = 0;

	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F");
	filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_cdi_item", "is", "T");
	var collection_items = nlapiSearchRecord("customrecord_bb1_cdi", null, filters); // 10 units

	DeleteCollectionItems(collection_items); // delete lines containing inactive items

	records_deleted = 0;
	filters[1] = new nlobjSearchFilter("isonline", "custrecord_bb1_cdi_item", "is", "F");
	var collection_items = nlapiSearchRecord("customrecord_bb1_cdi", null, filters); // 10 units

	DeleteCollectionItems(collection_items); // delete lines containing non-web items

}

function DeleteMarkedItemsFromCollections() { // Cleanup scheduled script to remove inactive designer item lines.

	var context = nlapiGetContext(), records_deleted = 0;

	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "T");
	var collection_items = nlapiSearchRecord("customrecord_bb1_cdi", null, filters); // 10 units

	if (collection_items && collection_items.length > 0) {

		for (var i=0, l=collection_items.length; i < l; i++) {
			if (!CheckScriptUsage(context, 20)) break;
			try {
				nlapiDeleteRecord("customrecord_bb1_cdi", collection_items[i].getId()); // 20 units
				records_deleted++;
			}
			catch (err) { WriteErrorLog(err, false); }
		}

		nlapiLogExecution("DEBUG", "Marked items deleted from collections:", records_deleted);

	}

}

/* UTILITY FUNCTIONS */

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

function CheckScriptUsage(context, points_needed, parms) {
	if (context.getRemainingUsage() < (points_needed + 20)) {
		var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), parms); // 20 units
		if (status == 'QUEUED')
			nlapiLogExecution('DEBUG','Usage limit exceeded:','Script has been successfully rescheduled.');
		else
			nlapiLogExecution('ERROR','Usage limit exceeded:','There was an error while trying to reschedule the current script.');
		return false;
	}
	return true;
}
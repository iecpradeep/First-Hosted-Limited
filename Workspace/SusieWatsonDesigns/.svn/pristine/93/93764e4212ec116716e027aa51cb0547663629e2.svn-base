function CloseOODWeddingLists() {
	var updated = 0, min_usage = 20, context = nlapiGetContext();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("custrecord_bb1_wl_closed", null, "is", "F", null);
	filters[2] = new nlobjSearchFilter("custrecord_bb1_wl_weddingdate", null, "before", "weeksago6", null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("custrecord_bb1_wl_customer");
	var results = nlapiSearchRecord("customrecord_bb1_wl", null, filters, columns);
	if (results) {
		for (var i=0; context.getRemainingUsage() > min_usage && i < results.length; i++) {
			nlapiSubmitField("customrecord_bb1_wl", results[i].getId(), "custrecord_bb1_wl_closed", "T");
			updated++;
		}
	}
	nlapiLogExecution("DEBUG", "Records updated:", updated);
	nlapiLogExecution("DEBUG", "Usage remaining:", context.getRemainingUsage());
}

function UpdatePurchasedWeddingListLines() {
	var updated = 0, min_usage = 20, context = nlapiGetContext();

	var giftids = GetActiveWeddingListLineIds();
	if (giftids.length == 0) return;

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
			for (var j=giftids.length; j--;) {
				if (giftids[j] == giftid) giftids.splice(j, 1);
			}
		}
	}
	for (var j=giftids.length; j--;)
		nlapiSubmitField("customrecord_bb1_wli", giftids[j], "custrecord_bb1_wli_purchased", 0);

	nlapiLogExecution("DEBUG", "Records updated:", updated);
	nlapiLogExecution("DEBUG", "Usage remaining:", context.getRemainingUsage());
}

function GetActiveWeddingListLineIds() {
	var a = new Array();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_parent", "is", "F", null);
	filters[2] = new nlobjSearchFilter("custrecord_bb1_wl_closed", "custrecord_bb1_wli_parent", "is", "F", null);
	//filters[3] = new nlobjSearchFilter("lastmodified", null, "before", "daysago1", null);
	var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, null);
	if (results) {
		for (var i=0, results_l=results.length; i < results_l; i++) {
			a[i] = parseInt(results[i].getId());
		}
	}
	return a;
}
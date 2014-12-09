//SWD Scriptable Cart Hooks

function PageInit(type) {   

	InjectGAScriptAfterLogin(type);

}

function SaveRecord() {

	return true;

}

function FieldChanged(type, name, linenum) {

}

function PostSourcing(type, name) {

}

function ValidateLine(type) {

	return true;

}

function Recalc(type, action) {

}

function InjectGAScriptAfterLogin(type) {

	var customerid = nlapiGetFieldValue("entity");

	if (isEmpty(customerid) || customerid == "0") return;

	var customerCategory = nlapiGetFieldValue("custbody1");

	var postloginhtml = [];

	switch (customerCategory) {
	case "1": case "4":
		postloginhtml.push(" _gaq.push(['_setCustomVar', 1, 'Trade', 'Trade', 1]);\r\n");
		break; 
	}

	nlapiSetFieldValue("custbody_bb1_sc_gascriptpostlogin", postloginhtml.join("\r\n"));

}

function Debug(title, text) {

	if (nlapiGetUser() != 6789) return;
	var debugUrl = sco_suitelet_url + "&action=write-log&title=" + title + "&log=" + text;
	nlapiRequestURL(debugUrl, null, null);

}

function isEmpty(val) {

	return (val == null || val == "");

}

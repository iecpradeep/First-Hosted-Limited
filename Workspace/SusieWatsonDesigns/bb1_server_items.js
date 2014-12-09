function BeforeLoad(type, form) {

	DisplayPatternsCategorySelect(type, form);
	HidePatternsCategoryField(type, form);

}

function BeforeSubmit(type) {

	UpdatePatternsCategoryField(type);

}

function AfterSubmit(type) {

	UE_StoreChildData(type);

}

function DisplayPatternsCategorySelect(type, form) {

	try {
		var context = nlapiGetContext();
		if (type=='delete' || context.getExecutionContext()!='userinterface') return;
		var filters = new Array();
		//filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
		//filters[1] = new nlobjSearchFilter('isonline', null, 'is', 'T', null);
		//filters[2] = new nlobjSearchFilter('hidden', null, 'is', 'F', null);
		//filters[3] = new nlobjSearchFilter('parentcategory', null, 'is', 'F', null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn('name');
		columns[1] = new nlobjSearchColumn('fullname');
		var results = nlapiSearchRecord('sitecategory', null, null, columns);
		results = results.sort(SortPatternCategories);
		var field = form.addField('custpage_bb1_patterncategory','select','Pattern Category',null,'store');
		form.insertField(field, 'custitem_bb1_patterncategory');
		field.addSelectOption('','',false);
		var current = nlapiGetFieldValue('custitem_bb1_patterncategory');
		for (var i=0; i < results.length; i++)
			field.addSelectOption(results[i].getId(), results[i].getValue('fullname'), (results[i].getId()==current?true:false));
	}
	catch (err) {
		WriteErrorLog(err);
	}

}

function SortPatternCategories(a, b) {

	var a_value = a.getValue('fullname').toLowerCase();
	var b_value = b.getValue('fullname').toLowerCase();
	if (a_value < b_value) 
		return -1;
	else if (a_value > b_value)
		return 1;
	else
		return 0;

}

function HidePatternsCategoryField(type, form) {

	try {
		var context = nlapiGetContext();
		if (type=='delete' || context.getExecutionContext()!='userinterface') return;
		var field = form.getField('custitem_bb1_patterncategory');
		if (field) field.setDisplayType('hidden');
	}
	catch (err) {
		WriteErrorLog(err);
	}

}

function UpdatePatternsCategoryField(type) {

	try {
		var context = nlapiGetContext();
		if (type=='delete' || context.getExecutionContext()!='userinterface') return;
		var patterncategory = nlapiGetFieldValue('custpage_bb1_patterncategory');
		if (patterncategory==null) return;
		nlapiSetFieldValue('custitem_bb1_patterncategory', patterncategory);
	}
	catch (err) {
		WriteErrorLog(err);
	}

}

function UE_StoreChildData(type) {

	nlapiLogExecution("DEBUG", "type", type);

	if (type == "delete") return;

	var recid = nlapiGetRecordId();
	var rectype = nlapiGetRecordType();

	nlapiLogExecution("DEBUG", "recid/rectype",  recid + "/" + rectype);

	StoreChildData(rectype, recid);

}

function StoreChildData(rectype, recid) {

	try {

		if (IsEmpty(recid)) return;

		var itemrec = nlapiLoadRecord(rectype, recid);
		var parentid = itemrec.getFieldValue("parent");
		//var parentid = nlapiLookupField(rectype, recid, "parent");

		var matrixparent = null;

		nlapiLogExecution("DEBUG", "parent id", parentid);

		if (!IsEmpty(parentid)) {
			nlapiLogExecution("DEBUG", "parent id set, check if this item is a matrix child", recid);
			var filters = [new nlobjSearchFilter("internalid", null, "is", recid),
			               new nlobjSearchFilter("matrixchild", null, "is", "T")];
			var results = nlapiSearchRecord(rectype, null, filters);
			if (results && results.length == 1) {
				matrixparent = nlapiLoadRecord(rectype, parentid);
			}
			else {
				parentid = "";
				nlapiLogExecution("DEBUG", "item is not matrix child, check if matrix parent", recid);
			}
		}

		if (IsEmpty(parentid)) {
			nlapiLogExecution("DEBUG", "parent id not set, check if this item is a matrix parent", recid);
			var filters = [new nlobjSearchFilter("internalid", null, "is", recid),
			               new nlobjSearchFilter("matrix", null, "is", "T")];
			var results = nlapiSearchRecord(rectype, null, filters);
			if (results && results.length == 1) {
				parentid = recid;
				matrixparent = itemrec;
				nlapiLogExecution("DEBUG", "item is matrix parent");
			}
		}

		if (IsEmpty(parentid) || !matrixparent) {
			nlapiLogExecution("DEBUG", "item is not matrixed so exiting");
			return;
		}

		// Get item options from parent
		var itemfields = []
		//var matrixparent = nlapiLoadRecord(rectype, parentid);
		var itemoptions = matrixparent.getFieldValues("itemoptions");

		for (var i=0, l=itemoptions.length; i < l; i++) {
			itemoptions[i] = itemoptions[i].toLowerCase();
			itemfields.push(itemoptions[i].replace(/^custcol_/, "custitem_"));
		}

		nlapiLogExecution("DEBUG", "item options", itemoptions.join(","));

		var json = [];

		var filters = [new nlobjSearchFilter("isinactive", null, "is", "F"),
		               new nlobjSearchFilter("isonline", null, "is", "T"),
		               new nlobjSearchFilter("parent", null, "is", parentid),
		               new nlobjSearchFilter("matrixchild", null, "is", "T")];
		var columns = [new nlobjSearchColumn("custitem_bb1_wasprice")];

		for (var i=0, l=itemfields.length; i < l; i++) {
			columns.push(new nlobjSearchColumn(itemfields[i]));
		}

		var items = nlapiSearchRecord("item", null, filters, columns);

		if (items) {

			nlapiLogExecution("DEBUG", "online matrix child items", items.length);

			items.sort(function(a, b) { return a.getId() - b.getId(); });

			for (var i=0; i < items.length; i++) {
				var item = items[i];
				var wasprice = (!IsEmpty(item.getValue("custitem_bb1_wasprice"))) ? parseFloat(item.getValue("custitem_bb1_wasprice")) : '0';
				var item_data = {"id": item.getId(), "wasprice": wasprice};
				for (var j=0, k=itemfields.length; j < k; j++) {
					item_data[itemoptions[j]] = item.getValue(itemfields[j]);
				}
				json.push(item_data);
			}

		}

		var matrixdata = JSON.stringify(json);

		nlapiLogExecution("DEBUG", "custitem_bb1_matrixdata", matrixdata);

		//nlapiSubmitField(rectype, parentid, "custitem_bb1_matrixdata", JSON.stringify(json));
		//var rec = nlapiLoadRecord(rectype, parentid);
		matrixparent.setFieldValue("custitem_bb1_matrixdata", matrixdata);
		var id = nlapiSubmitRecord(matrixparent, false, true);  

	}
	catch (e) {
		nlapiLogExecution("ERROR", "Failed to update child matrix data for item: " + parentid, (e instanceof nlobjError? e.getCode() + ': ' + e.getDetails() : e));
	}

}


//Mass Update Scripts


function MassUpdate_MatrixChildData(rectype, recid) {

	try {

		StoreChildData(rectype, recid);

	}
	catch (e) {

		nlapiLogExecution("ERROR", "Failed to update child matrix data for item: " + recid, (e instanceof nlobjError? e.getCode() + ': ' + e.getDetails() : e));

	}

}


//Helper functions


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
		if (error) {
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
	if (context.getRemainingUsage() < points_needed + 20) {
		var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(), parms);
		if (status == 'QUEUED') {
			nlapiLogExecution('DEBUG','Usage limit exceeded:','Script has been successfully rescheduled.');
			return true;
		}
		else {
			nlapiLogExecution('ERROR','Usage limit exceeded:','There was an error while trying to reschedule the current script.');
		}
	}
	return false;
}

function GetItemType(itemid) {
	try {
		return nlapiSearchRecord("item", null, [new nlobjSearchFilter("internalid", null, "is", itemid)])[0].getRecordType();
	}
	catch (e) {
		nlapiLogExecution("ERROR", "Failed to get type  for item: " + itemid, (e.getCode && e.getDetails ? e.getCode() + ': ' + e.getDetails() : e));
	}
}

function IsEmpty(val) {
	return (val == null || val == "");
}

function Nvl(val1, val2) {
	return (val1 == null || isNaN(val1)) ? val2 : val1;
}

var JSON;if(!JSON){JSON={};}
(function(){'use strict';function f(n){return n<10?'0'+n:n;}
if(typeof Date.prototype.toJSON!=='function'){Date.prototype.toJSON=function(key){return isFinite(this.valueOf())?this.getUTCFullYear()+'-'+
		f(this.getUTCMonth()+1)+'-'+
		f(this.getUTCDate())+'T'+
		f(this.getUTCHours())+':'+
		f(this.getUTCMinutes())+':'+
		f(this.getUTCSeconds())+'Z':null;};String.prototype.toJSON=Number.prototype.toJSON=Boolean.prototype.toJSON=function(key){return this.valueOf();};}
var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,escapable=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta={'\b':'\\b','\t':'\\t','\n':'\\n','\f':'\\f','\r':'\\r','"':'\\"','\\':'\\\\'},rep;function quote(string){escapable.lastIndex=0;return escapable.test(string)?'"'+string.replace(escapable,function(a){var c=meta[a];return typeof c==='string'?c:'\\u'+('0000'+a.charCodeAt(0).toString(16)).slice(-4);})+'"':'"'+string+'"';}
function str(key,holder){var i,k,v,length,mind=gap,partial,value=holder[key];if(value&&typeof value==='object'&&typeof value.toJSON==='function'){value=value.toJSON(key);}
if(typeof rep==='function'){value=rep.call(holder,key,value);}
switch(typeof value){case'string':return quote(value);case'number':return isFinite(value)?String(value):'null';case'boolean':case'null':return String(value);case'object':if(!value){return'null';}
gap+=indent;partial=[];if(Object.prototype.toString.apply(value)==='[object Array]'){length=value.length;for(i=0;i<length;i+=1){partial[i]=str(i,value)||'null';}
v=partial.length===0?'[]':gap?'[\n'+gap+partial.join(',\n'+gap)+'\n'+mind+']':'['+partial.join(',')+']';gap=mind;return v;}
if(rep&&typeof rep==='object'){length=rep.length;for(i=0;i<length;i+=1){if(typeof rep[i]==='string'){k=rep[i];v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}else{for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=str(k,value);if(v){partial.push(quote(k)+(gap?': ':':')+v);}}}}
v=partial.length===0?'{}':gap?'{\n'+gap+partial.join(',\n'+gap)+'\n'+mind+'}':'{'+partial.join(',')+'}';gap=mind;return v;}}
if(typeof JSON.stringify!=='function'){JSON.stringify=function(value,replacer,space){var i;gap='';indent='';if(typeof space==='number'){for(i=0;i<space;i+=1){indent+=' ';}}else if(typeof space==='string'){indent=space;}
rep=replacer;if(replacer&&typeof replacer!=='function'&&(typeof replacer!=='object'||typeof replacer.length!=='number')){throw new Error('JSON.stringify');}
return str('',{'':value});};}
if(typeof JSON.parse!=='function'){JSON.parse=function(text,reviver){var j;function walk(holder,key){var k,v,value=holder[key];if(value&&typeof value==='object'){for(k in value){if(Object.prototype.hasOwnProperty.call(value,k)){v=walk(value,k);if(v!==undefined){value[k]=v;}else{delete value[k];}}}}
return reviver.call(holder,key,value);}
text=String(text);cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return'\\u'+
	('0000'+a.charCodeAt(0).toString(16)).slice(-4);});}
if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,'@').replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,']').replace(/(?:^|:|,)(?:\s*\[)+/g,''))){j=eval('('+text+')');return typeof reviver==='function'?walk({'':j},''):j;}
throw new SyntaxError('JSON.parse');};}}());
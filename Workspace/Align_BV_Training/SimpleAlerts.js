function pageInitAlertUser_1()
{
	alert ('You have loaded a record');
}

function pageInitAlertUser_2(type)
{
	alert ('You have loaded a record ready to ' + type);
	var commentText =  'You have loaded a Customer record ready to ' + type + ' at ' + Date();
	// nlapiSetFieldValue(fldnam, value, firefieldchanged, synchronous)
	nlapiSetFieldValue('comments', commentText, false, false);
}

function beforeLoadAlertUser_1(type,form)
{
	var newId = nlapiGetRecordId();
	var newType = nlapiGetRecordType();
	nlapiLogExecution('DEBUG','Before Load Script: '+newType+' Id:'+newId, 'Form:'+form+', Operation: '+type+', Id:'+newId);
}

function beforeSubmitAlertUser_1(type)
{
	var newId = nlapiGetRecordId();
	var newType = nlapiGetRecordType();
	var currentform = nlapiGetFieldValue('customform');
	nlapiLogExecution('DEBUG','Before Submit Script: '+newType+' Id:'+newId, 'Form:'+currentform+', Operation: '+type+', Id:'+newId);
}
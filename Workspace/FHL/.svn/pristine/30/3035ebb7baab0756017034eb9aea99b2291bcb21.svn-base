function copyCase()
{

	var currentrecordid = nlapiGetRecordId();

	var newCaseRecord = nlapiCopyRecord('supportcase',currentrecordid);

	var newrecordid = nlapiSubmitRecord(newCaseRecord,true);

	var newrecordurl = nlapiResolveURL('RECORD','supportcase', newrecordid, 'EDIT');

	alert(newrecordurl);

	window.open(newrecordurl);void(0)
	
	return true;


} //function


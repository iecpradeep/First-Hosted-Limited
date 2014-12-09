function changeDepartment()
{

	var results = nlapiSearchRecord('transaction','customsearch298',null,null);

	for (var i=0; results != null && i < results.length; i++)
	{

		var result = results[i];

		var recordid = result.getId();
		var recordtype = result.getRecordType();

		var record = nlapiLoadRecord(recordtype, recordid);

		record.setFieldValue('department','13');

		recordid = nlapiSubmitRecord(record,false,true);		

	} //for


	return true;

} //function
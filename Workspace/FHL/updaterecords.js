function UpdateChildRecords()
{

	var pInternalId = nlapiGetRecordId();
	
	var recType = nlapiGetRecordType();



	var entityid = nlapiGetFieldValue('entityid');

	var salesrep = nlapiGetFieldValue('salesrep');




	var filters = new Array();

	filters[0] = new nlobjSearchFilter('parent',null, 'is', pInternalId, null);

	var columns = new Array();

	columns[0] = new nlobjSearchColumn('internalid');




	var searchresults = nlapiSearchRecord('customer',null, filters, columns);



	for ( var i = 0; i < Math.min( 10, searchresults.length ); i++)

	{

		var searchresult = searchresults[i];



		if(pInternalId != searchresult.getId())

		{



			var record = nlapiGetNewRecord();



			var temp = nlapiLoadRecord('customer',searchresult.getId());



			record = temp;


			record.setFieldValue('salesrep',salesrep);


			nlapiSubmitRecord(record);

		} //if

	} //for

	return true;

} //function
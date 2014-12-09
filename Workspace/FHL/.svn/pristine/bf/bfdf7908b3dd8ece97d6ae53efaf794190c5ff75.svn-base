/********************************************************************************************
 * Program:		createcalllist.js
 * Date:		12/02/10
 * Version:		1.1
 ********************************************************************************************/

function createCallList()
{

	// define search filters
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custentity_generate_call',null,'is','T');

	// define search columns
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('entityid');
	columns[1] = new nlobjSearchColumn('salesrep');

	// perform search
	var results = nlapiSearchRecord('customer',null,filters,columns);

	// loop through search results
	for (var i = 0; results != null && i < results.length; i++)
	{
		var result = results[i];

		// create new tmcall record and set fields
		
		var tmcrec = nlapiCreateRecord('customrecord_tmcall');
		tmcrec.setFieldValue('custrecord_tmc_companyname',result.getId());
		tmcrec.setFieldValue('custrecord_tmc_user',result.getValue('salesrep'));

		var d = new Date();
		tmcrec.setFieldValue('custrecord_tmc_nextactiondate',nlapiDateToString(d,'date'));

		// submit tmcall record		
		var tmcrecid = nlapiSubmitRecord(tmcrec,false,true);

		// load customer record and set call generation flags
		var custrecord = nlapiLoadRecord('customer',result.getId());
		custrecord.setFieldValue('custentity_generate_call','F');
		custrecord.setFieldValue('custentity_call_generated','T');

		// submit customer record changes
		var custrecordid = nlapiSubmitRecord(custrecord,true,true);

	} //for

	return true;
} //function


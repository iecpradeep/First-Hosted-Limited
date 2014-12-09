/********************************************************************************************
 * Program:		CopyNotes.js
 * Date:		18/03/10
 * Version:		1.0.001
 ********************************************************************************************/

function copyNotes()
{

	// define search filters
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_tmc_callnotes',null,'isnotempty');

	// define search columns
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('id');
	columns[1] = new nlobjSearchColumn('custrecord_tmc_callnotes');
	
	// perform search
	var results = nlapiSearchRecord('customrecord_tmcall',null,filters,columns);

	var d = new Date();

	// loop through search results
	for (var i = 0; results != null && i < results.length; i++)
	{
		var result = results[i];

		// Create TMCLog Record

		var notes = '***System Update***\n' + result.getValue('custrecord_tmc_callnotes');

		var tmclogrec = nlapiCreateRecord('customrecord_tmclog');
		tmclogrec.setFieldValue('custrecord_tmclog_notes',notes);
		tmclogrec.setFieldValue('custrecord_tmclog_date',nlapiDateToString(d,'date'));
		tmclogrec.setFieldValue('custrecord_tmclog_time',nlapiDateToString(d,'timeofday'));
		tmclogrec.setFieldValue('custrecord_tmclog_tmcid',result.getId())

		// submit tmclog record		
		var tmclogid = nlapiSubmitRecord(tmclogrec,false,true);



	} //for

	return true;
} //function


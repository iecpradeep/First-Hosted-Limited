/**
 * @author eligon
 */

//error reporting constants
var CUSTOM_ERROR_CODE = 'EASY_DELETE_RECORDS';
var SUPPRESS_ERROR_EMAIL_NOTIFICATION = false;

function main(rec_type, rec_id)
{
	try
	{
		nlapiLogExecution('DEBUG', CUSTOM_ERROR_CODE, 'Record deletion to be performed for ' + rec_type + ' record: ' + rec_id);
		nlapiDeleteRecord(rec_type, rec_id);
		nlapiLogExecution('DEBUG', CUSTOM_ERROR_CODE, 'Record deleted.');
	}
	catch (ex)
	{
		var errorMsg = ex.getCode != null ? ex.getCode() + ': ' + ex.getDetails() : 'Error: ' + (ex.message != null ? ex.message : ex);
		nlapiLogExecution('ERROR', CUSTOM_ERROR_CODE, errorMsg);
	}
}

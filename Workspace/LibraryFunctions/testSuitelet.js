/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Jun 2012     MJL
 *
 *test hello anthony
 */

/**
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function formSuitelet(request, response)
{
	var array = new Array();
	array[0] = 1;
	array[1] = 2;
	array[2] = 3;
	array[3] = 4;
	array[4] = 5;

	for (var i = 0; i < array.length; i++)
	{
		nlapiLogExecution('DEBUG', 'Array', array[i]);
	}
	
	var record = nlapiLoadRecord('customer', '129');
	
	var custname = record.getFieldText('entityid');
	
	nlapiLogExecution('DEBUG', 'Customer Name', custname);
}

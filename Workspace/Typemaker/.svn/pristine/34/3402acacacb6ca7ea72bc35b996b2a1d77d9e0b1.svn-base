/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Jul 2013     Vostro1
 *
 */

var subsidiaryId = 2;
var adjustmentAccountId = 161;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type)
{
	try
	{
		nlapiSetFieldValue('subsidiary', subsidiaryId);
	}
	catch(e)
	{
		alert('Error on Page initialise: ' + e.message);
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function clientPostSourcing(type, name) 
{
	try
	{
		if(name == 'subsidiary')
		{
			nlapiSetFieldValue('account', adjustmentAccountId);
		}

	}
	catch(e)
	{
		alert('An erorr has occurred: ' + e.message);
	}
}

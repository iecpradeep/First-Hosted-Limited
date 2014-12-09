/***********************************************************************************************************************
 * Name: 		Payment Script
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release - AL
 * 				1.0.1 - 27/11/2012 - MODS FOR PER EMPLOYEE PREFS - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		Posting.js
 * Deploy: 		customscript_payment_script
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4029&c=3524453&h=e0709f0cb69c7afb1903&_xt=.js 
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * @returns {Boolean}
 */
function PostingBank()
{

	var A = nlapiGetFieldValue('account');
	var record = nlapiLoadRecord('account', A);
	var B = record.getFieldValue('custrecord_posting');

	if (B == 'F') 
	{

		alert('The account chosen is a non-posting account!');
		//nlapiSetFieldValue('account','');
		return false;
	}

	return true;

} //function

/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function onChange(type,name)
{


	// if undeposited funds has been selected than reselect account radio button

	if (name == 'undepfunds')
	{

		var field = nlapiGetFieldValue('undepfunds');

		if (field == 'T')
		{
			nlapiSetFieldValue('undepfunds','F');
			return true;

		} //if

	} //if


	return true;

}

/**
 * @returns {Boolean}
 */
function custPayment_onSave()
{

	try 
	{
	
		var account = nlapiGetFieldValue('account');
		var date = nlapiGetFieldValue('trandate');
		var accountRecord = nlapiLoadRecord('account', account);
		var isPosting = accountRecord.getFieldValue('custrecord_posting');
		
		var employee = nlapiGetUser();
		// [todo] date =
	
		if (isPosting == 'F') 
		{
	
			alert('The account chosen is a non-posting account!');
			return false;
		}
		else
			{
		//nlapiSubmitField('customrecord_custreceiptparams', 1, 'custrecord_lastbankaccount', account);
		submitAccountPreference(employee,account,date);
		
			}

	} //try
	catch (e)
	{

	} //catch

	return true;


} //function custPayment_onSave()

function submitAccountPreference(employee,account,date)
{
	

		var recordId = getAccountPreferenceRecord(employee);
		
		if (recordId != -1)
		{
			
			// submit account and date
			nlapiSubmitField('customrecord_custreceiptparams',recordId,'custrecord_lastbankaccount',account);
			nlapiSubmitField('customrecord_custreceiptparams',recordId,'custrecord_last_date',date);
	
	
		} //if
		else // else create a new record and submit 
		{
		
			var newRecord = nlapiCreateRecord('customrecord_custreceiptparams');
			
			newRecord.setFieldValue('custrecord_prefemployee',employee);
			newRecord.setFieldValue('custrecord_lastbankaccount',account);
			newRecord.setFieldValue('custrecord_last_date',date);
								
			var id = nlapiSubmitRecord(newRecord);
			
						
		} //else

		return true;
	
} //function


/***************************************************************
 * 
 * getAccountPreferenceRecord
 * Searches for a custreceiptparams record for the specified employee
 * returns record if found or -1 if no record found.
 */
function getAccountPreferenceRecord(employee)
{

		// construct search for existing record for this employee
		var prefSearchFilters = new Array();
		var prefSearchColumns = new Array();
		
		prefSearchFilters[0] = new nlobjSearchFilter('custrecord_prefemployee',null, 'anyof', employee);
	
		prefSearchColumns[0] = new nlobjSearchColumn('custrecord_lastbankaccount');
	
		// perform search
		var prefSearchResults = nlapiSearchRecord('customrecord_custreceiptparams', null, prefSearchFilters, prefSearchColumns);

		// if search results found then submit fields to existing record
		if (prefSearchResults) 
		{
		
			// get ID of first matching record found
			var recordId = prefSearchResults[0].getId();
			return recordId;
		
		} //if
		else
		{
			return -1;
		} //else
	
} //function

/**
 * @param type
 * @param name
 * @returns {Boolean}
 */
function custPayment_postSourcing(type,name)
{

	try 
	{
		if (name == 'customer')
		{

			// get current user
			var employee = nlapiGetUser();
			
			// search for pref record for current user
			var recordId = getAccountPreferenceRecord(employee);
			
			// if record exists then set account otherwise do nothing.
			if (recordId != -1)
			{
				var account = nlapiLookupField('customrecord_custreceiptparams',recordId,'custrecord_lastbankaccount');
				nlapiSetFieldValue('account',account,false,false);
				
				
			} //if		
			
		} //if

	} //try
	catch (e) 
	{

	} //catch

	return true;

} //function custPayment_postSourcing()

function PageInit() {

	try {
		// get current user
		var employee = nlapiGetUser();

		// search for pref record for current user
		var recordId = getAccountPreferenceRecord(employee);

		// if record exists then set account otherwise do nothing.
		if (recordId != -1) {
			var date = nlapiLookupField('customrecord_custreceiptparams',
					recordId, 'custrecord_last_date');
			nlapiSetFieldValue('trandate', date, false, false);
		} // if
	} // try
	catch (e) {

	} // catch

}// function PageInit()


/**
 * @returns {Boolean}
 */
function PostingVendor(){

	var A = nlapiGetFieldValue('payablesaccount');
	var record = nlapiLoadRecord('account', A);
	var B = record.getFieldValue('custrecord_posting');

	if (B == 'F') {

		alert('The account chosen is a non-posting account!');
		nlapiSetFieldValue('payablesaccount','');

	}
	return true;
}
function createCredit()
{

	// Check that helpline credit transaction has not already been created

	if (nlapiGetFieldValue('custbody_hltranscreated') == 'T')
	{
		return true;
	} //if

	var credits = nlapiGetFieldValue('custbody_hlcredits');

	if (credits > 0)
	{

		var customer = nlapiGetFieldValue('entity');
		var orderdate = nlapiGetFieldValue('trandate');
		var tranid = nlapiGetFieldValue('tranid');

		// create new helpline transaction record

		var hltransrecord = nlapiCreateRecord('customrecord_helplinetransaction');

		// set new record fields

		hltransrecord.setFieldValue('custrecord_htrans_customer',customer);
		hltransrecord.setFieldValue('custrecord_htrans_date',orderdate);
//		hltransrecord.setFieldValue('custrecord_htrans_sourcetrans',tranid);
		hltransrecord.setFieldValue('custrecord_htrans_impact',credits);

		// commit new record

		var recordid = nlapiSubmitRecord(hltransrecord, true);
		
		nlapiSetFieldValue('custbody_hltranscreated','T');

		// load customer record

		var custrecord = nlapiLoadRecord('customer',customer);

		// calculate balance

		var currentbalance = custrecord.getFieldValue('custentity_currenthlbalance');
		var newbalance = parseInt(currentbalance) + parseInt(credits);

		// write new balance

		custrecord.setFieldValue('custentity_currenthlbalance',newbalance);

		// commit changes

		var id = nlapiSubmitRecord(custrecord,true);

	} //if

	return true;

} //function



function createDebit()
{

	// check that helpline transaction is required

	if (nlapiGetFieldValue('custcol_deductfromhelpline') == 'T')
	{


		// Check that helpline credit transaction has not already been created

		if (nlapiGetFieldValue('custcol_hltranscreated') == 'T')
		{
			return true;
		} //if

		var credits = nlapiGetFieldValue('custcol_hlcredits');

		credits = (credits-(credits * 2));

		var customer = nlapiGetFieldValue('customer');
		var trandate = nlapiGetFieldValue('trandate');
		var sourcecase = nlapiGetFieldValue('casetaskevent');
	
		// create new helpline transaction record

		var hltransrecord = nlapiCreateRecord('customrecord_helplinetransaction');

		// set new record fields

		hltransrecord.setFieldValue('custrecord_htrans_customer',customer);
		hltransrecord.setFieldValue('custrecord_htrans_date',trandate);
		hltransrecord.setFieldValue('custrecord_htrans_impact',credits);
		hltransrecord.setFieldValue('custrecord_htrans_case',sourcecase);

		// commit new record

		var recordid = nlapiSubmitRecord(hltransrecord, true);

		nlapiSetFieldValue('custcol_hltranscreated','T');

		// load customer record

		var custrecord = nlapiLoadRecord('customer',customer);

		// calculate balance

		var currentbalance = custrecord.getFieldValue('custentity_currenthlbalance');
		var newbalance = parseInt(currentbalance) + parseInt(credits);

		alert(currentbalance);
		alert(newbalance);

		// write new balance

		custrecord.setFieldValue('custentity_currenthlbalance',newbalance);

		// commit changes

		var id = nlapiSubmitRecord(custrecord,true);
		
	} //if

	return true;

} //function


/***************************************************************************************************
 * Name: Update Terms Field (updateTerms.js)
 * Script Type: User Event
 * Client: Align BV
 * 
 * Version: 1.0.0 - 23 Jul 2012 - 1st release - MJL
 * 
 * Author: FHL
 * Purpose: Updates the standard Terms field on the customer record using value from a custom field
 ***************************************************************************************************/

var terms0Days = 0;
var terms30Days = 0;
var terms45Days = 0;
var terms60Days = 0;

/**
 * Sets terms field after submit
 */
function updateTerms_afterSubmit(type)
{	
	var customerID = 0;
	var recordType = '';
	var customTerms = '';
	
	//get parameters and record ID
	getParameters();
	customerID = nlapiGetRecordId();
	recordType = nlapiGetRecordType();

	//get terms from custom field (string value)
	customTerms = nlapiLookupField(recordType, customerID, 'custentity_terms', true);
	
	//set standard terms field
	switch(customTerms)
	{
		case '0':
			nlapiSubmitField(recordType, customerID, 'terms', terms0Days);
			break;
		case '30':
			nlapiSubmitField(recordType, customerID, 'terms', terms30Days);
			break;
		case '45':
			nlapiSubmitField(recordType, customerID, 'terms', terms45Days);
			break;
		case '60':
			nlapiSubmitField(recordType, customerID, 'terms', terms60Days);
			break;
	}
}

/**
 * Gets script parameters from deployment
 */
function getParameters()
{
	var context = nlapiGetContext();
	
	terms0Days = context.getSetting('SCRIPT', 'custscript_terms_0days');
	terms30Days = context.getSetting('SCRIPT', 'custscript_terms_30days');
	terms45Days = context.getSetting('SCRIPT', 'custscript_terms_45days');
	terms60Days = context.getSetting('SCRIPT', 'custscript_terms_60days');
}
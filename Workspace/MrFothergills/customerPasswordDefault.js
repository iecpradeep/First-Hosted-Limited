/*******************************************************************************
 * Name: customerPasswordDefault
 * 
 * Script Type: User Event
 * 
 * Version: 1.0.0 - 16/07/2013 - Initial release - JP
 * 			1.0.1 - 19/07/2013 - Formatted code to increase readability ( by increasing function count ). - JP
 * 
 * Author: JP - Josh Pritchard
 * 
 * Purpose: To set a default password for a new customer if no password is defined.
 * 
 * Script: customscript_randomcustomerpassword  
 * Deploy: customdeploy_customerrandompassword
 * 
 * 
 * Notes:
 * 
 * Library: Library.js
 ******************************************************************************/

var passwordRequired = 'F';
var email = null;
var customer = null;
var password = '';
var recordId = 0;

/*
 * Function called by afterSubmit script record.
 */
function customerPasswordDefault ()
{
	try
	{
		loadCurrentRecord ();
		createPassword ();
		saveCurrentRecord ();
	}
	catch ( e )
	{
		errorHandler ( 'customerPasswordDefaultUE', e );
	}

}


/*
 * Load current customer record.
 */
function loadCurrentRecord ()
{
	try
	{
		recordId = nlapiGetRecordId ();
		customer = nlapiLoadRecord ( 'customer', recordId );

		email = customer.getFieldValue ( 'email' );
		passwordRequired = customer.getFieldValue ( 'custentity_randompassword' );

	}
	catch ( e )
	{
		errorHandler ( 'checkPassword', e );
	}
} 


/*
 * Creates a password if required.
 */
function createPassword ()
{

	try
	{
		if ( checkEmail () && passwordRequired == 'T' )
		{
			password = setToRandomPassword ();
		}
	}
	catch ( e )
	{
		errorHandler ( 'createPassword', e );
	}
} 

/*
 * Saves current record.
 */
function saveCurrentRecord ()
{
	try
	{
		if ( password )
		{
			customer.setLineItemValue ( 'contactroles', 'giveaccess', 1, 'T' );
			customer.setLineItemValue ( 'contactroles', 'password', 1, password );
			customer.setLineItemValue ( 'contactroles', 'passwordconfirm', 1, password );
			nlapiSubmitRecord ( customer, true );
		}
	}
	catch ( e )
	{
		errorHandler ( 'saveCurrentRecord', e );
	}
} 


/*
 * Checks whether an email is present - (T) or not (F).
 */
function checkEmail ()
{
	var retVal = false;

	try
	{
		if ( email != null && email != '' )
		{
			retVal = true;
		}
	}
	catch ( e )
	{
		errorHandler ( 'checkEmail', e );
	}

	return retVal;
}

/*
 * Sets the random password for the customer, with a prefix dependent on the brand.
 */
function setToRandomPassword ()
{
	var password = null;
	var prefix = null;
	var suffix = null;
	var brand = null;

	try
	{
		brand = customer.getFieldValue ( 'custentity_mrf_cust_brand' );
		randomNumbers = Math.floor ( ( Math.random () * 100000 ) + 1 );
		suffix = '#';

		switch ( brand )
		{
			case '2':
				prefix = 'DTB';
				break;
			case '6':
				//prefix = ''/* fulfilment prefix */;
				break;
			case '4':
				prefix = 'JNS';
				break;
			case '1':
				prefix = 'MRF';
				break;
			case '5':
				//prefix = ''/* Express prefix */;
				break;
			case '3':
				prefix = 'WLM';
				break;
		}

		password = prefix + randomNumbers + suffix;
	}
	catch ( e )
	{
		errorHandler ( 'setToRandomPassword', e );
	}

	return password;
}
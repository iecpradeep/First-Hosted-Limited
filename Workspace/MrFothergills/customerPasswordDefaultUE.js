/*******************************************************************************
 * Name: customerPasswordDefaultUE
 * 
 * Script Type: User Event
 * 
 * Version: 1.0.0 - 16/07/2013 - Initial release - JP
 * 
 * Author: JP - Josh Pritchard
 * 
 * Purpose: To set a default password for a new customer if no password is defined.
 * 
 * Script: customscript_customerpassworddefault
 * Deploy: customdeploy_customerpassworddefault
 * 
 * 
 * Notes:
 * 
 * Library: Library.js
 ******************************************************************************/

var passwordRequired = 'f';
var email = null;

/*
 * Initialises and runs the script.
 */
function initialise ( type )
{
	var password = null;
	
	try
	{
		passwordRequired = nlapiGetFieldValue ( 'custentity_randompassword' );
		
		nlapiLogExecution ( 'DEBUG', 'password required: ', passwordRequired );
		
		email = nlapiGetFieldValue ( 'email' );
		
		nlapiLogExecution ( 'DEBUG', 'email: ', email );

		if ( checkEmail () && passwordRequired == 'T' )
		{
			password = setToRandomPassword ();

			nlapiLogExecution ( 'DEBUG', 'Password before set text: ', nlapiGetFieldText ( 'password' ) );

			nlapiSetFieldValue ( 'giveaccess', 'T' );
			nlapiSetFieldValue ( 'accessrole', '1021' );
			nlapiSetFieldText ( 'password', password );
			nlapiSetFieldText ( 'password2', password );

			nlapiLogExecution ( 'DEBUG', 'Password set: ', password );
			nlapiLogExecution ( 'DEBUG', 'Give access: ', nlapiGetFieldValue ( 'giveaccess' ) );
		}
		else
		{
			if ( !checkEmail () && passwordRequired == 'T' )
			{
				alert ( 'No random password can be set because no email address is specified.' );
				nlapiLogExecution ( 'DEBUG', 'No email' );
			}
			else if ( passwordRequired == 'F' )
			{
				alert ( 'No random password needed.' );
				nlapiLogExecution ( 'DEBUG', 'No random password needed' );
			}
		}
	}
	catch ( e )
	{
		errorHandler ( 'checkPassword', e );
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
		brand = nlapiGetFieldValue ( 'custentity_mrf_cust_brand' );
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
/***********************************************************************************
 * Name: customerClient.js
 * Script Type: user event
 * Client: Align BV
 * 
 * Version: 1.0.0 - 1st release - add fields to customer form for  
 *			1.0.1 - 23/8/2012 - amended - additional error trapping added  JM
 * 			1.0.2 - 28/8/2012 - amended - removed execution context condition - MJL
 * 			1.0.3 - 28/8/2012 - amended - reversed mobile get and set - MJL
 * 
 * Author: FHL
 * Purpose: Add mobile number to customer form
 * 
 * Script: customscript_customerclient
 * Deploy: custdeploy_customerclient
 * 
 ***********************************************************************************/

var mobile = null;
var mobileNumber = '';
//var currentContext = nlapiGetContext();
var customer = null;
var recordID = 0;

/**
 * beforeload
 * 1.0.1 added error trapping
 * 1.0.2 removed execution context condition
 * 
 * @param type
 * @param form
 */
function beforeLoad(type, form)
{

	try
	{
		//1.0.2 if ((type=='edit' || type== 'view') && currentContext.getExecutionContext() == 'userinterface')
		if (type=='edit' || type== 'view')
		{
			recordID = nlapiGetRecordId();
			customer = nlapiLoadRecord('customer', recordID);
			mobileNumber = customer.getFieldValue('mobilephone');
		}

		//1.0.2 if (type== 'create' && currentContext.getExecutionContext() == 'userinterface')
		if (type== 'create')
		{
			customer = nlapiGetNewRecord();
			mobileNumber = customer.getFieldValue('mobilephone');
		}

		mobile = form.addField('custpage_mobilephone', 'phone', 'Mobile Phone');
		mobile.setDefaultValue(mobileNumber);	
	}
	catch(e)
	{			
		//TODO
	}
}

/**
 * beforesubmit
 *
 * 1.0.1 added error trapping
 * 1.0.3 reversed mobile get and set
 * @param type
 */
function beforeSubmit(type)
{
	var customer = null;
	
	try
	{
		customer = nlapiGetNewRecord();
//		mobileNumber = customer.getFieldValue('custpage_mobilephone');
//		customer.setFieldValue('mobilephone',mobileNumber);
		//1.0.3
		mobileNumber = customer.getFieldValue('mobilephone');
		customer.setFieldValue('custpage_mobilephone',mobileNumber);
	}
	catch(e)
	{
		//TODO
	}
}
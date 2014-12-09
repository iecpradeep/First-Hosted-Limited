/*************************************************************************
 * Name: RESTPostXMLTransactions.js
 * Script Type: REST
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 04 May 2012 - 1st release - JM
 *
 * Author: FHL
 * Purpose: REST Web Service calls to create audit records which also house the XML data
 * updating an audit record will trigger a user event to load the xml and post invoice/payment/cr
 * the user event is called customscript_usereventxmlpost
 * 
 * Script : customscript_restxmlpost  
 * Deploy: customdeploy_restxmlpost
**************************************************************************/
 

/**
 * handles the payload from the web service call
 * 
 */
function postXMLTransactionToAudit(datain)
{
	
	var contents='';
	var retVal = '';

	contents = datain.contents;
		
	retVal = auditTrail(contents);
	
	return retVal;

}

/**
 * creates an audit record and adds the XML payload to it
 * 
 */
function auditTrail(xmltopost)
{

	var desc='DGL XML Post ' + Date();
	var auditID=null;
	var retVal='OK';
	
	try
	{
		var newAudit = nlapiCreateRecord('customrecord_xml_load_audit');
		 
	
		newAudit.setFieldValue('name', desc);
		newAudit.setFieldValue('custrecord_description', desc);
		newAudit.setFieldValue('custrecord_processed', 'FALSE');
		newAudit.setFieldValue('custrecord_payload', xmltopost);
		
		auditID = nlapiSubmitRecord(newAudit, true);
		nlapiLogExecution('DEBUG', 'transaction registered', xmltopost);
		
	}
    catch(e)
    {
    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
    	retVal = 'Upload Failed';
    }     	      

    return retVal;


}
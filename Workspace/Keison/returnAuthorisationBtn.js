/*********************************************************************************************************************************************************
 * Name:			returnAuthorisationBtn.js
 * Script Type:		User Event
 * Client:			Keison
 *
 * Version:			1.0.0 – 09/04/2013 – 1st release - AM
 *
 * Author:			FHL
 * Purpose:			To add a button to the customer and vendor return forms.
 * 
 * Script: 			custscript_returnauthorisationue
 * Deploy: 			customdeploy_customerreturnauthorisation - Return Authorisation
 * 					customdeploy_vendorreturnauthorisation	 - Vendor Return Authorization
 * 
 * Library: 		library.js
 * 
 *
 * 
 *********************************************************************************************************************************************************/


/*****************************************************************************
 * beforeLoad
 * 
 * @param type
 * @param form
 *****************************************************************************/
function addBtnBeforeLoad(type, form)
{
	var recordType = nlapiGetRecordType();
	   
	if (recordType == 'returnauthorization')
	{
		custReturnAuthorisationBtn(type, form);
	}
	else
	{
		vendReturnAuthorisationBtn(type, form);
	}
}


/*****************************************************************************
 * custReturnAuthorisationBtn
 * 
 * @param type
 * @param form
 *****************************************************************************/
function custReturnAuthorisationBtn(type, form)
{
	try
	{
		if(type == 'edit')
		{  
			form.addButton('custpage_createcustreturn','Vendor Returns', "callCustomerReturnSuitelet");
			form.setScript('customscript_returnauthorisationclient');	
		}	
	}
	catch(e)
	{
		errorHandler("custReturnAuthorisationBtn ", e);
	}
}

/*****************************************************************************
 * vendReturnAuthorisationBtn
 * 
 * @param type
 * @param form
 *****************************************************************************/
function vendReturnAuthorisationBtn(type, form)
{
	try
	{
		if(type == 'edit')
		{  
			form.addButton('custpage_createvendorreturn','Customer Returns', "callVendorReturnSuitelet");
			form.setScript('customscript_returnauthorisationclient');	
		}	
	}
	catch(e)
	{
		errorHandler("vendReturnAuthorisationBtn ", e);
	}
}
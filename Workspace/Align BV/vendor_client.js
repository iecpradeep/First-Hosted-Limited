/*************************************************************************************************************************
 * Name: 		Vendor Duplicates Check
 * Script Type: Client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 16/07/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		vendor_client.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1145&c=3524453&h=a5473445622df52e125f&_xt=.js
 * Production URL:
 * 
 ***********************************************************************************************************************/



/**
 * @returns {Boolean}
 */
function onSave()
{
	var vendorName = nlapiGetFieldValue('companyname');

	var vendorSearchFilters = new Array();
	var vendorSearchColumns = new Array();

	vendorSearchFilters[0] = new nlobjSearchFilter('entityid', null, 'contains', vendorName);

	vendorSearchColumns[0] = new nlobjSearchColumn('internalid');
	vendorSearchColumns[1] = new nlobjSearchColumn('entityid');

	// perform search
	var vendorSearchResults = nlapiSearchRecord('vendor', null, vendorSearchFilters, vendorSearchColumns);

	// if search results found
	if (vendorSearchResults)
	{
		var alertText = 'Warning:  The following vendors already exist:\n\n';

		for (var i=0; i<vendorSearchResults.length; i++)
		{
			alertText += vendorSearchResults[i].getValue(vendorSearchColumns[1]);
			alertText += '\n';
		} //for

		alertText += '\nPress OK to continue and add this vendor record, \npress CANCEL to return to the vendor record and edit it.';

		var response = confirm(alertText);

		if (response == true)
		{
			return true;
		} //if
		else
		{
			return false;
		} //else
	} //if
	else
	{
		return true;
	}// else
} //function onSave()



/*************************************************************************************************************************
 * Name: 		Vendor Account Payable
 * Script Type: User Event
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 16/07/2012 - Initial release - AL
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		vendor_client.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1145&c=3524453&h=a5473445622df52e125f&_xt=.js 
 * Production URL:
 * 
 ***********************************************************************************************************************/

/**
 * @returns {Boolean}
 */
function BeforeLoad()
{
	nlapiSetFieldValue('payablesaccount', '1637');

	return true;
}

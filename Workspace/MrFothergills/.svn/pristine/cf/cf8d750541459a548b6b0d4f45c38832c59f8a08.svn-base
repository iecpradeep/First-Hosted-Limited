/*******************************************************
 * Name:		Helper Suitelet for getting itemId from internalId
 * Script Type:	Suitelet
 * Version:		1.0.0 - 21/05/2012 - Initial release - SB
 * 				1.0.1 - 22/10/2012 - Cleanup & added to SVN - SB
 * 				1.0.2 - 09/01/2013 - Validation for brand - SB
 *
 * Author:		S.Boot
 *******************************************************/

var debug = request.getParameter('debug'); // Set this to any value during development. In production, do not use

// Suitelet Default Function
function getItemInternalIdByItemId(request, response)
{
	var itemId = request.getParameter('itemid');
	var brandId = request.getParameter('brand');
	
	// Get internalId of product by itemId
	var filters = [];
	
	filters[0] = new nlobjSearchFilter('itemid', null, 'is', itemId);
	filters[1] = new nlobjSearchFilter('isonline', null, 'is', 'T');
	filters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	filters[3] = new nlobjSearchFilter('department', null, 'is', brandId);

	var itemSearch = nlapiSearchRecord('item', null, filters);
	
	var internalId = null;
	
	if (itemSearch != null)
	{
		if (itemSearch.length == 1) 
		{
			internalId = itemSearch[0].getId();
		}
	}
	
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	if (internalId)
	{
		response.write(internalId);
	}
}
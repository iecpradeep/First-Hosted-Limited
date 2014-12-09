/*******************************************************
 * Name:		Offer Description Suitelet
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 27/09/2012 - Initial version - SB
 *
 * Author:		S. Boot
 * 
 * Purpose:		Output offer name based on offerId
 * 
 * Script: 		offer_desc_suitelet.js
 * Deploy: 		customdeploy_mrf_offer_desc_suitelet
 * 
 *******************************************************/

function main()
{
	// Get URL parameter offerid
	var offerId = request.getParameter('offerid');
	var offerDescription = '';
	
	// If offerId is an actual value
	if (offerId > 0)
	{
		// Do a search for the offer record
		var filters = [];
		var columns = [];
		
		filters[0] = new nlobjSearchFilter('internalid', null, 'is', offerId);
		
		columns[0] = new nlobjSearchColumn('custrecord_mrf_offer_description');
			
		var searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);
		
		// If the offer record is found
		if (searchResults)
		{
			// Get the offer description
			offerDescription = searchResults[0].getValue('custrecord_mrf_offer_description');
		}
	}
	
	// Output the offer description
	response.write(offerDescription);
}

/*******************************************************
 * Name:		Cart Offers Suitelet
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 26/09/2012 - Initial version - SB
 * 				1.0.1 - 26/09/2012 - Bugfix when customer not logged in - SB
 * 				1.0.2 - 03/10/2012 - Added display of images and optional URL - SB
 * 				1.0.3 - 08/10/2012 - Re-implemented optional URL due to NetSuite update lags - SB
 * 				1.0.4 - 14/10/2012 - Sort by Start Date, descending - SB
 * 				1.0.5 - 15/10/2012 - Implement control buttons and carousel code - SB
 * 				1.0.6 - 19/10/2012 - Move init JavaScript to local file - SB
 * 				1.1.0 - 25/10/2012 - Offers now driven by campaigns - SB
 * 				1.1.1 - 28/10/2012 - Add HTML id to li tags - SB
 * 				1.1.2 - 30/10/2012 - Remove validation for campaigns - JM
 * 				1.1.3 - 31/10/2012 - Added campaign validation back but just check for a valid campaign without the customer - JM
 * 				1.1.4 - 31/10/2012 - Clear remembered offers when campaign changes - SB
 * 				1.1.5 - 07/11/2012 - Remove arrow left/right img tag - SB
 * 				1.1.6 - 12/11/2012 - Brand segregation - SB
 * 				1.1.7 - 22/11/2012 - Remove offer-based audience checks - SB
 * 				1.1.8 - 23/11/2012 - Deal with storing text campaign code - JM
 * 				1.1.9 - 29/11/2012 - Add try/catch to help debugging - SB
 * 										Fixed bug where no previous campaign code entered - SB
 * 				1.2.0 - 08/01/2013 - Fix bug where appliedOffers is a string and not array - SB
 * 				1.2.1 - 08/01/2013 - Set campaign code (even if derived) so lookUpCampaignCode() works in offers.js - SB
 * 				1.2.2 - 17/05/2013 - Description field deprecated. Using Name field instead - SB
 * 										No longer able to see offers from other brands - SB
 * 				1.2.3 - 23/07/2013 - Add href link to offer image - SB
 * 
 * Author:		S. Boot
 * 
 * Purpose:		Display offers in the shopping cart that are 
 * 				applicable to the customer
 * 
 * Script: 		offers_cart_suitelet.js
 * Deploy: 		customdeploy_mrf_offers_cart_suitelet
 * Libraries used: offers.js
 * 
 *******************************************************/

var ajax = true; // Output partial HTML, not entire page
var customerId = 0;
var campaignEnteredByUser = '';
var searchResults = null;
var spentOffers = new Array();
var appliedOffers = new Array();
var previousCampaignEntered = '';
var customerOffersId = 0;
var brandId = 1;

function main()
{
	try
	{
		// Get customerId from URL parameter
		customerId = request.getParameter('customer');
		
		// 1.1.6
		if (request.getParameter('brand'))
		{
			brandId = request.getParameter('brand');
		}
		
		dealWithCampaignCode();
		
		// Begin HTML
		if (!ajax)
		{
			response.write('<!DOCTYPE html>\n<html>\n<head>\n' + 
				'<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">\n' + 
				'<title>Shopping Basket</title>\n' +
				'</head>\n<body>\n');
		}
	
		// Get offers
		
		// 1.1.2 - remove search for campaign
		// runSavedSearchCampaigns(campaignEnteredByUser, customerId); // offers.js
		
		// 1.1.3 - change to just validate the camapign code
		runSavedSearchCampaigns(campaignEnteredByUser, 0, brandId); // 1.1.6 added brandId
		setEnteredCampaign(derivedCampaignCode); // 1.2.1
		
		var campaignIntID = 0;
		var results = null;
		
		campaignIntID = genericSearch('campaign', 'title', derivedCampaignCode);
	
		/// 1.1.8
		campaignEnteredByUser = derivedCampaignCode;
		dealWithCampaignCode();
		
		if(campaignIntID != 0)
		{
			// retrieve the offers associated with the campaign
			results = searchOffers(campaignIntID, brandId);
		}
		
		if (results)
		{
			// Start unordered list of offers
			response.write('<ul class="offerlist">');
			
			for (var i = 0; i < results.length; i++)
			{
				var offerId = results[i].getId();
				var offerDescription = results[i].getValue('name'); // 1.2.2
				var image = results[i].getValue('custrecord_promo_image');
				var href = results[i].getValue('custrecord_promo_img_link'); // 1.2.3
				var offerDisplay = '';
				var style = '';
				
				// If the customer hasn't already spent the offer
				if (spentOffers.indexOf(offerId) < 0)
				{
					// 1.2.3
					if (!href)
					{
						href = 'javascript:top.window.addPromo(\'' + offerId + '\');';
					}
					
					// If there is an image, display in image tag
					if (image != '')
					{
						offerDisplay = '<img src="' + image + '" alt="' + offerDescription + '" title="' + offerDescription + '">';
					}
					else // If no image, just display text
					{
						offerDisplay = offerDescription;
					}
					
					// If the offer has been added to the applied list
					if (appliedOffers.indexOf(offerId) >= 0)
					{
						// Make it appear faded
						style = ' style="opacity:0.3;filter:alpha(opacity=30);"';
					}
					
					// Output the offer as a list item
					response.write('<li id="offerlist' + offerId + '"' + style + '><a href="' +  href + '">' + offerDisplay + '</a></li>');
				}
			}
			
			response.write('</ul>');
			
			// Carousel buttons and code
			response.write('<a class="carousel-button carousel-button-left" href="javascript:offerCarousel.slideRight();"></a>');
			response.write('<a class="carousel-button carousel-button-right" href="javascript:offerCarousel.slideLeft();"></a>');
		}
		else
		{
			// No offers available
			response.write('<p>There are no promotions available at this time. </p>');
		}
		
		// End HTML
		if (!ajax)
		{
			response.write('\n</body>\n</html>');
		}
	}
	catch (e)
	{
		errorHandler('main', e);
	}
	
}

/*
 * Execute the Offers search and return the results
 */
function searchOffers(campaignIntID, brandId)
{
	try
	{
		var filters = [];
		var columns = [];
		
		filters[0] = new nlobjSearchFilter('custrecord_mrf_offer_campaign', null, 'anyOf', campaignIntID);
		filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[2] = new nlobjSearchFilter('custrecord_mrf_offer_brand', null, 'anyOf', brandId); // 1.2.2
		
		columns[0] = new nlobjSearchColumn('name'); // 1.2.2
		columns[1] = new nlobjSearchColumn('custrecord_promo_image');
		columns[2] = new nlobjSearchColumn('custrecord_offeractivatedate');
		columns[3] = columns[2].setSort(false); // 1.0.4 Sort by Start Date, descending
		columns[4] = new nlobjSearchColumn('custrecord_promo_img_link'); // 1.2.3
		
		if (!searchResults)
		{
			searchResults = nlapiSearchRecord('customrecord_mrfoffer', null, filters, columns);
		}
		
		return searchResults;
	} 
	catch (e)
	{
		errorHandler('searchOffers', e);
	}
}

/*
 * Get any offers the customer may have already used or spent
 */
function getCustomerOffers()
{
	try
	{
		var columns = [];
		var filters = [];
		
		columns[0] = new nlobjSearchColumn('custrecord_spent_offers');
		columns[1] = new nlobjSearchColumn('custrecord_offers');
		columns[2] = new nlobjSearchColumn('custrecord_campaigncode');
		
		filters[0] = new nlobjSearchFilter('custrecord_customer', null, 'is', customerId);
		
		var spentOfferResults = nlapiSearchRecord('customrecord_cust_applied_offers', null, filters, columns);
		
		if (spentOfferResults)
		{
			customerOffersId = spentOfferResults[0].getId();
			spentOffers = spentOfferResults[0].getValue('custrecord_spent_offers');
			appliedOffers = spentOfferResults[0].getValue('custrecord_offers');
			appliedOffers = appliedOffers.split(','); // 1.2.0
			previousCampaignEntered = spentOfferResults[0].getValue('custrecord_campaigncode');
		}
	}
	catch (e)
	{
		errorHandler('getCustomerOffers', e);
	}
}

/**
 * Remembers the entered campaign code in the custom record
 * @param campaignCode
 */
function setEnteredCampaign(campaignCode)
{
	try
	{
		var customerOffers = null;
		var campaignIntID = genericSearch('campaign', 'title', campaignCode);
		
		if (customerOffersId)
		{
			// Load the record
			customerOffers = nlapiLoadRecord('customrecord_cust_applied_offers', customerOffersId);
		}
		else
		{
			// Create the record
			customerOffers = nlapiCreateRecord('customrecord_cust_applied_offers');
			customerOffers.setFieldValue('custrecord_customer', customerId);
		}
		
		// 1.1.4 If campaign code has changed, clear the applied offers
		if (campaignIntID != customerOffers.getFieldValue('custrecord_campaigncode') && 
			appliedOffers.length > 0)
		{
			appliedOffers = new Array();
			customerOffers.setFieldValues('custrecord_offers', appliedOffers);
		}
		
		customerOffers.setFieldValue('custrecord_setby', 'setEnteredCampaign');// 1.1.7
		customerOffers.setFieldValue('custrecord_campaigncode', campaignIntID);
		customerOffers.setFieldValue('custrecord_campaigncodetext', derivedCampaignCode); // 1.1.8
			
		
		nlapiSubmitRecord(customerOffers);
	}
	catch (e)
	{
		errorHandler('setEnteredCampaign', e);
	}
}


/**
 * 1.1.8 - Deal with storing campaign code
 */
function dealWithCampaignCode() 
{
	try
	{
		if (customerId)
		{
			getCustomerOffers();

			// If campaign entered, use this and store it
			if (request.getParameter('ccode'))
			{
				campaignEnteredByUser = request.getParameter('ccode');
				setEnteredCampaign(campaignEnteredByUser);
			}
			// Else use a previously entered campaign, if one exists
			else if(previousCampaignEntered) // 1.1.9
			{
				campaignEnteredByUser = nlapiLookupField('campaign', previousCampaignEntered, 'title');
			}
		}
		else
		{
			// If campaign entered, use this
			if (request.getParameter('ccode'))
			{
				campaignEnteredByUser = request.getParameter('ccode');
			}
		}
	}
	catch (e)
	{
		errorHandler('dealWithCampaignCode', e);
	}
}
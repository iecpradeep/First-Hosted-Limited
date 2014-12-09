/*************************************************************************************
 * Name:		cartSuitelet.js
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 2013-03-21 - Initial release - SB
 * 				1.0.1 - 2013-04-04 - Replace & with XML &amp; - SB
 * 				1.0.2 - 2013-04-05 - Don't create duplicate records for better performance - SB
 * 				1.0.3 - 2013-04-16 - Calculation record must have been processed successfully - SB
 * 				1.0.4 - 2013-04-23 - Support JSONP for x-domain SB2 weirdness - SB
 * 				1.0.5 - 2013-06-21 - Validate code before submitting it in XML to calc engine - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Populate Offers Calculation record with XML.
 * 				Start calculation process.
 * 				Feed response back to cart.js in JSON form. 
 * 
 * Script: 		customscript_cart_suitelet
 * Deploy: 		customdeploy_cart_suitelet
 * 
 * Notes:		the prices that are in the payload field are assumed to include VAT
 * 				and will have already been subjected to price break calculations from
 * 				the BOS and web
 * 
 * Library: 	offersLibrary.js
 *************************************************************************************/

var cartRequestJSON = '';

/**
 * Main function
 */
function cartSuitelet(request, response)
{
	try
	{
		var cartRequestXML = ''; // Payload
		var cartResponseXML = ''; // Basket Answer
		var cartResponseJSON = null;
		var params = request.getAllParameters();
		var offersCalcRecord = null;
		var offersCalcRecordId = 0;
		var jsonpCallback = request.getParameter('callback'); // 1.0.4
		
		for (param in params)
		{
			// The JSON data is the parameter key name and doesn't have a value
			if (params[param] == '')
			{
				// Get JSON string from parameter key
				cartRequestJSON = param;
			}
		}
		
		// Parse the JSON string
		cartRequestJSON = JSON.parse(cartRequestJSON);
		
		// If campaign is not valid, make it empty
		if (!checkIfCampaignIsValid(cartRequestJSON.campaign))
		{
			cartRequestJSON.campaign = '';
		}
		
		// Put cartRequest data into XML format
		cartRequestXML = formatRequestXML(cartRequestJSON);

		// Search for records with the same payload
		offersCalcRecordId = findDuplicateCalculation(cartRequestJSON.reference, cartRequestXML);
		
		// If there are no matching payloads, create new record
		if (offersCalcRecordId <= 0)
		{
			// Put cartRequest into new Offers Calculation record
			offersCalcRecord = nlapiCreateRecord('customrecord_offerscalculation');
			
			offersCalcRecord.setFieldValue('custrecord_reference', cartRequestJSON.reference);
			offersCalcRecord.setFieldValue('custrecord_payload', cartRequestXML);
			
			// Save record (runs UserEvent)
			offersCalcRecordId = nlapiSubmitRecord(offersCalcRecord, true);
		}
		
		// Get cartReponse from record
		offersCalcRecord = nlapiLoadRecord('customrecord_offerscalculation', offersCalcRecordId);
		cartResponseXML = offersCalcRecord.getFieldValue('custrecord_basketanswer');
			
		// Get values from XML and put into JSON format
		cartResponseJSON = formatResponseJSON(cartResponseXML);
		
		// Set content type for output
		response.setContentType('JAVASCRIPT', 'script.js', 'inline');
		
		// Output the JSON response
		if (jsonpCallback) // 1.0.4
		{
			// JSONP
			response.write(jsonpCallback + '(' + JSON.stringify(cartResponseJSON) + ');');
		}
		else
		{
			// JSON
			response.write(JSON.stringify(cartResponseJSON));
		}
	}
	catch(e)
	{
		errorHandler('cartSuitelet', e);
	}
}

/**
 * 1.0.2 Finds calculation records to save creating duplicates
 * @param reference
 * @param cartRequestXML
 * @returns number
 */
function findDuplicateCalculation(reference, cartRequestXML)
{
	var internalID = 0;
	
	try
	{
		// Arrays
		var filters = new Array();
		var columns = new Array();
		
		// Search filters
		filters[0] = new nlobjSearchFilter('custrecord_reference', null, 'is', reference);
		filters[1] = new nlobjSearchFilter('custrecord_status', null, 'is', 'Processed'); // 1.0.3
		
	
		// Search columns
		columns[0] = new nlobjSearchColumn('internalid');
		columns[1] = new nlobjSearchColumn('custrecord_payload');
		columns[2] = columns[0].setSort(true); // Get latest ID
	
		// Perform search
		var searchResults = nlapiSearchRecord('customrecord_offerscalculation', null, filters, columns);
		
		if (searchResults)
		{
			searchResult = searchResults[0];
			
			if (searchResult.getValue('custrecord_payload') == cartRequestXML)
			{
				internalID = searchResult.getId();
			}
		}
	}
	catch(e)
	{
		errorHandler('findDuplicateCalculation', e);
	}
	
	return internalID;
}

/**
 * Convert request JSON into defined XML structure
 * @param cartRequestJSON
 * @returns {}
 */
function formatRequestXML(cartRequestJSON)
{
	try
	{
		var cartRequestXML = '';
		var headerXML = '';
		var customerXML = '';
		var referenceXML = '';
		var campaignXML = '';
		var orderLinesXML = '';
		var detailXML = '';
		var brandXML = '';
		
		// Header
		customerXML = createXMLLine('customer', encodeXML(cartRequestJSON.customer));
		referenceXML = createXMLLine('reference', encodeXML(cartRequestJSON.reference));
		dateXML = createXMLLine('date', encodeXML(jsDate_To_nsDate(new Date())));
		campaignXML = createXMLLine('campaign', encodeXML(cartRequestJSON.campaign));
		brandXML = createXMLLine('brand', encodeXML('' + cartRequestJSON.brand));
		
		headerXML = createXMLLine('header', '<br>' + customerXML + referenceXML + dateXML + campaignXML + brandXML);
		
		// Detail
		for (var i = 0; i < cartRequestJSON.detail.length; i++)
		{
			var orderLineXML = createXMLLine('quantity', cartRequestJSON.detail[i].quantity);
			orderLineXML += createXMLLine('itemcode', encodeXML(cartRequestJSON.detail[i].itemCode));
			orderLineXML += createXMLLine('description', encodeXML(cartRequestJSON.detail[i].description));
			orderLineXML += createXMLLine('price', cartRequestJSON.detail[i].price);
			
			orderLinesXML += createXMLLine('orderline', '<br>' + orderLineXML);
		}
		
		detailXML = createXMLLine('detail', '<br>' + orderLinesXML);
		
		// Basket
		cartRequestXML = createXMLLine('basket', '<br>' + headerXML + detailXML);
		
		return cartRequestXML;
	}
	catch(e)
	{
		errorHandler('formatRequestXML', e);
	}
}

/**
 * Convert XML response into JSON for web site
 * @param cartResponseXML
 * @returns {}
 */
function formatResponseJSON(cartResponseXML)
{
	try
	{
		var cartResponseJSON = {
			shipping: 0,
			totalSavings: 0,
			grandTotal: 0,
			orderLines: [],
			offers: [],
			campaign: cartRequestJSON.campaign
		};
		
		if (cartResponseXML)
		{
			// Parse XML string to W3C XML document
			var xml = UNencodeXML(cartResponseXML)
				.replace(/<br>/gi, '')
				.replace(/&/gi, '&amp;'); // 1.0.1
			
			var xmlDoc = nlapiStringToXML(xml);
			
			cartResponseJSON.shipping = nlapiSelectValue(xmlDoc, '/basket/header/shipping');
			cartResponseJSON.totalSavings = nlapiSelectValue(xmlDoc, '/basket/header/totalsavings');
			cartResponseJSON.grandTotal = nlapiSelectValue(xmlDoc, '/basket/header/grandtotal');
			
			// Order Lines
			var orderLines = nlapiSelectNodes(xmlDoc, '/basket/orderlines/orderline');
			
			for (var i = 0; i < orderLines.length; i++)
			{
				var itemCode = nlapiSelectValue(orderLines[i], './itemcode');
				var image = nlapiSelectValue(orderLines[i], './image');
				var priceIncTax = nlapiSelectValue(orderLines[i], './priceincvat');
				
				var orderLineObj = {
					itemCode: itemCode,
					image: image,
					priceIncTax: priceIncTax
				};
				
				cartResponseJSON.orderLines.push(orderLineObj);
			}
			
			// Offer Lines
			var offerLines = nlapiSelectNodes(xmlDoc, '/basket/offers/offer');
			
			for (var i = 0; i < offerLines.length; i++)
			{
				var image = nlapiSelectValue(offerLines[i], './image');
				var description = nlapiSelectValue(offerLines[i], './description');
				var saving = nlapiSelectValue(offerLines[i], './saving');
		
				var offerLineObj = {
					image: image,
					description: description,
					saving: saving
				};
				
				cartResponseJSON.offers.push(offerLineObj);
			}
		}
		
		return cartResponseJSON;
	}
	catch(e)
	{
		errorHandler('formatResponseJSON', e);
	}
}
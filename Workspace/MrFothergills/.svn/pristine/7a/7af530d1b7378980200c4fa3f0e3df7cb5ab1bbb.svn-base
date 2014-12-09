/*************************************************************************************
 * Name:		checkoutSuitelet.js
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 05/04/2013 - Initial release - SB
 * 				1.0.1 - 11/04/2013 - Add 3 additional offer fields - SB
 * 				1.1.0 - 2013-04-18 - Remove shipping service items - SB
 * 				1.1.1 - 2013-04-16 - Calculation record must have been processed successfully - SB
 * 				1.1.2 - 2013-04-23 - Support JSONP - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Feed response back to offershelper.js in JSON form. 
 * 
 * Script: 		customscript_checkout_suitelet
 * Deploy: 		customdeploy_checkout_suitelet
 * 
 * Notes:		
 * 
 * Library: 	offersLibrary.js
 *************************************************************************************/

/**
 * Main function
 */
function checkoutSuitelet(request, response)
{
	try
	{
		var checkoutResponseXML = ''; // Basket Answer
		var checkoutResponseJSON = null;
		var offersCalcRecordId = 0;
		var reference = '';
		var status = '';
		var jsonpCallback = request.getParameter('callback'); // 1.1.2
		
		// Get reference
		reference = request.getParameter('reference');
		
		// Search for records with the same payload
		offersCalcRecordId = findCalculation(reference);

		// Get cartReponse from record
		offersCalcRecord = nlapiLoadRecord('customrecord_offerscalculation', offersCalcRecordId);
		status = offersCalcRecord.getFieldValue('custrecord_status');
		
		// 1.1.1
		if (status == 'Processed')
		{
			checkoutResponseXML = offersCalcRecord.getFieldValue('custrecord_checkoutanswer');
				
			// Get values from XML and put into JSON format
			checkoutResponseJSON = formatResponseJSON(checkoutResponseXML);
		}
		else
		{
			checkoutResponseJSON = {
				shipping: 0,
				totalSavings: 0,
				grandTotal: 0,
				checkoutLines: [],
				status: ''
			};
		}
		
		// Set content type for output
		response.setContentType('JAVASCRIPT', 'script.js', 'inline');
		
		// Output the JSON response
		if (jsonpCallback) // 1.1.2
		{
			// JSONP
			response.write(jsonpCallback + '(' + JSON.stringify(checkoutResponseJSON) + ');');
		}
		else
		{
			// JSON
			response.write(JSON.stringify(checkoutResponseJSON));
		}
	}
	catch(e)
	{
		errorHandler('checkoutSuitelet', e);
	}
}

/**
 * Finds calculation record
 */
function findCalculation(reference)
{
	var internalId = 0;

	try
	{
		// Arrays
		var filters = new Array();
		var columns = new Array();
		
		// Search filters
		filters[0] = new nlobjSearchFilter('custrecord_reference', null, 'is', reference);
	
		// Search columns
		columns[0] = new nlobjSearchColumn('internalid');
		columns[1] = columns[0].setSort(true); // Get latest ID
	
		// Perform search
		var searchResults = nlapiSearchRecord('customrecord_offerscalculation', null, filters, columns);
		
		if (searchResults)
		{
			searchResult = searchResults[0];
			internalId = searchResult.getId();
		}
	}
	catch (e)
	{
		errorHandler('findCalculation', e);
	}
	
	return internalId;
}

/**
 * Formats the response JSON from the checkoutResponseXML
 * @param checkoutResponseXML
 * @returns {}
 */
function formatResponseJSON(checkoutResponseXML)
{
	var checkoutResponseJSON = {
		shipping: 0,
		totalSavings: 0,
		grandTotal: 0,
		checkoutLines: [],
		status: 'Processed'
	};
	
	try
	{
		if (checkoutResponseXML)
		{
			// Parse XML string to W3C XML document
			var xml = UNencodeXML(checkoutResponseXML)
				.replace(/<br>/gi, '')
				.replace(/&/gi, '&amp;'); // 1.0.1
			
			var xmlDoc = nlapiStringToXML(xml);
			
			checkoutResponseJSON.shipping = nlapiSelectValue(xmlDoc, '/checkout/header/shipping');
			checkoutResponseJSON.totalSavings = nlapiSelectValue(xmlDoc, '/checkout/header/totalsavings');
			checkoutResponseJSON.grandTotal = nlapiSelectValue(xmlDoc, '/checkout/header/grandtotal');
			
			// Checkout Lines
			var orderLines = nlapiSelectNodes(xmlDoc, '/checkout/detail/orderline');
			
			for (var i = 0; i < orderLines.length; i++)
			{
				var isShipping = eval(nlapiSelectValue(orderLines[i], './isshipping')); // 1.1.0 Shipping?
				
				if (!isShipping) // 1.1.0 Don't add shipping service items
				{
					var quantity = nlapiSelectValue(orderLines[i], './quantity');
					var description = nlapiSelectValue(orderLines[i], './description');
					var offerDescription = nlapiSelectValue(orderLines[i], './offerdesc');
					var offerImage = nlapiSelectValue(orderLines[i], './offerimage');
					// 1.0.1
					var offerDescription1 = nlapiSelectValue(orderLines[i], './offerdesc1');
					var offerImage1 = nlapiSelectValue(orderLines[i], './offerimage1');
					var offerDescription2 = nlapiSelectValue(orderLines[i], './offerdesc2');
					var offerImage2 = nlapiSelectValue(orderLines[i], './offerimage2');
					var offerDescription3 = nlapiSelectValue(orderLines[i], './offerdesc3');
					var offerImage3 = nlapiSelectValue(orderLines[i], './offerimage3');
					
					var itemCode = nlapiSelectValue(orderLines[i], './itemcode');
					var image = nlapiSelectValue(orderLines[i], './image');
					var priceIncTax = nlapiSelectValue(orderLines[i], './priceincvat');
					
					var orderLineObj = {
						quantity: quantity,
						itemCode: itemCode,
						image: image,
						description: description,
						priceIncTax: priceIncTax,
						offerDescription: offerDescription,
						offerImage: offerImage,
						// 1.0.1
						offerDescription1: offerDescription1,
						offerImage1: offerImage1,
						offerDescription2: offerDescription2,
						offerImage2: offerImage2,
						offerDescription3: offerDescription3,
						offerImage3: offerImage3
					};
					
					checkoutResponseJSON.checkoutLines.push(orderLineObj);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('formatResponseJSON', e);
	}
	
	return checkoutResponseJSON;
}
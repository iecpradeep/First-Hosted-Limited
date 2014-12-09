


// hi leigh - this is a sample extract for code inspection - can you apply the coding standards to the rest please


// 1. curly braces - the standard is to have them on separate lines
// 2. getXMLforDeviceRequest - this routine is too big - please refactor e.g. stockbintransfer should be in it's own function
// 3. declaration of variables should be at the top of a function rather than in the middle of code
// 4. constants such as savedSearch = "customsearch_restquery_salesorders"; should be created in an initialise function i.e. putting them all together 
// 5. function comment blocks need to be populated - i.e. arguements and return values and purpose need to be described
// 6. When the release version of this code is ready - please remove all debug code.
// 7. Use of the library - the generic error handler should be used for error trapping and to encourage code re-use
// 8. Use of the library - utility type functions should be placed in the library
// 9. Try catch on all code
// 10. No compound statements i.e. one line of code does 1 things - helps debugging and readability - i.e. 	return createTaggedXML(currentDeviceRequest + "results", getXMLResultsStatus() + theXML);
// 


// great code - if you can re-submit this once you've attended to these it would be very much appreciated
 




/*
 * 
 * 
 */

function getXMLforDeviceRequest(currentDeviceRequest) {
	var theXML = '';
	var savedSearch = 'customsearch_restquery_' + currentDeviceRequest; // Default convention
	var searchType = 'item'; // Default
	var requestResultsTag = 'itemlist'; // Default
	var criteria = new Array();

	// Check for all possible tags & values and set values if present.
	// Will be set to null if not present.
	var binID = getXMLTreeElementDatabyName('binnumber');
	var binFrom = getXMLTreeElementDatabyName('binfrom');
	var binTo = getXMLTreeElementDatabyName('binto');
	var desc = getXMLTreeElementDatabyName('description');
	var itemCode = getXMLTreeElementDatabyName('itemcode');
	var itemQty = getXMLTreeElementDatabyName('quantity');
	var salesOrderNumber = getXMLTreeElementDatabyName('salesordernumber');
	var salesOrderDate = getXMLTreeElementDatabyName('salesorderdate');
	
	try {
		switch (currentDeviceRequest) {
		case 'stockbinquery':
			savedSearch = "customsearch_restquery_stockitemexist";
			if (binID != "") {
				var binCriteria = new Array('binnumber', 'is', binID);
				criteria.push(binCriteria);
			}
			break;
		case 'stockitemexist':
			if (itemCode != ""){
				var itemCriteria = new Array('name', 'contains', itemCode);
				criteria.push(itemCriteria);
			}	
			if (itemCode != "" && desc != ""){
				criteria.push('and');
			}
			if (desc != ""){				
				var descCriteria = new Array('displayname', 'contains', desc);
				criteria.push(descCriteria);
			}
			break;
		case 'stockitembincheck':			
			savedSearch = "customsearch_restquery_stockitemexist";
			requestResultsTag = 'itemlist';
			if (binID != "") {
				var binCriteria = new Array('binnumber', 'is', binID);
				criteria.push(binCriteria);
			}
			if (itemCode != "" && binID != ""){
				criteria.push('and');
			}
			if (itemCode != "") {
				var itemCriteria = new Array('name', 'contains', itemCode);
				criteria.push(itemCriteria);
			}
			break;
		case 'stockbintransfer':
			
			var binTransferRecID =  stockBinTransfer(binFrom,binTo,itemCode,itemQty);
			if (binTransferRecID) {
				resultmessage = 'Bin transfer request Succeeded - New transfer record ID : ' + binTransferRecID ;
				issuccess = true;
				itemcount = 1;
				// Set up the item query to return with the success status results
				savedSearch = "customsearch_restquery_stockitemexist";
				requestResultsTag = 'itemlist';
				if (binFrom != "" && binTo != "") {					
					var binFromCriteria = new Array('binnumber', 'is', binFrom);
					var binToCriteria = new Array('binnumber', 'is', binTo);
					var binCriteria = new Array(binFromCriteria, 'or', binToCriteria);
					criteria.push(binCriteria);
				}
				if (itemCode != "" && binFrom != "" && binTo != ""){
					criteria.push('and');
				}
				if (itemCode != "") {
					var itemCriteria = new Array('name', 'contains', itemCode);
					criteria.push(itemCriteria);
				}
			} else {
				resultmessage = 'Bin transfer request Failed';
			}
			break;
		case 'stockadjust':
			var stockAdjustRecID =  stockAdjust(binID,itemCode,itemQty);
			if (stockAdjustRecID) {
				resultmessage = 'Stock adjustment request Succeeded - New record ID : ' + stockAdjustRecID ;
				issuccess = true;
				itemcount = 1;
				// Set up the item query to return with the success status results
				savedSearch = "customsearch_restquery_stockitemexist";
				requestResultsTag = 'itemlist';
				if (binID != "") {
					var binCriteria = new Array('binnumber', 'is', binID);
					criteria.push(binCriteria);
				}
				if (itemCode != "" && binID != ""){
					criteria.push('and');
				}
				if (itemCode != "") {
					var itemCriteria = new Array('name', 'contains', itemCode);
					criteria.push(itemCriteria);
				}
			} else {
				resultmessage = 'Stock adjustment request Failed';
			}
			break;
		case 'salesorderslist':
			searchType = 'salesorder';
			requestResultsTag = 'salesorderlist';
			if (salesOrderDate != "" && salesOrderDate != null) {
				var salesCriteria = new Array('trandate', 'on', salesOrderDate);
				criteria.push(salesCriteria);
			} else {
				var allSalesCriteria = new Array('trandate', 'after', '01/01/2012');
				criteria.push(allSalesCriteria);
			}
			break;
		case 'salesorderretrieve':
			savedSearch = "customsearch_restquery_salesorders";
			searchType = 'salesorder';
			requestResultsTag = 'salesorderitemslist';
			if (salesOrderNumber != "") {
				if (!isNaN(salesOrderNumber))
					salesOrderNumber = 0; // Void it as not numeric
				var salesCriteria = new Array('tranid', 'is', salesOrderNumber);
				criteria.push(salesCriteria);
			}
			break;
		case 'salesordersubmit':
			searchType = 'salesorder';
			// Number of children == number of items being fulfilled
			var numItems = getXMLTreeChildNumberbyName('salesordersubmit')
			var orderSubmitRecID = submitOrder(salesOrderNumber, numItems);
			if (orderSubmitRecID) {
				resultmessage = 'Sales order fulfillment request Succeeded - New record ID : ' + orderSubmitRecID ;
				issuccess = true;
				itemcount = 1;
				// Retrieve the sales order related to the fulfillment as the response XML
				savedSearch = "customsearch_restquery_salesorders";
				requestResultsTag = 'salesorderitemslist';
				var salesCriteria = new Array('tranid', 'is', salesOrderNumber);
				criteria.push(salesCriteria);
			} else {
				resultmessage = 'Sales order fulfillment request Failed';
			}
			break;
		default:
			resultmessage = "UNKNOWN DEVICE REQUEST";
		}
	} catch (e) {
		nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
		resultmessage = 'Search request Failed';
	}

	// Run any saved search to create XML rows for results
	//if (resultmessage == '') {
	if (criteria.length > 0) {
		runSavedSearches(savedSearch, 'XML', searchType, criteria);
		if (itemcount > 0)
			issuccess = true;
		
		// Perform any post-search tasks as needed based on request type
		switch (currentDeviceRequest) {
		case 'stockitembincheck': // Analyse the rows returned to see whether below or above min Qty
			if (!isNaN(itemQty)) {
				if (searchLines) {
					searchLines.forEach(function(srLine) {
						var cols = srLine.getAllColumns();
						cols.forEach(function(c) {
							if (c.getLabel() == 'quantity' && parseInt(srLine.getValue(c)) < parseInt(itemQty)){
								issuccess = false;
								if (resultmessage == "")
									resultmessage =  itemCode + " below " + itemQty + ": ";
								resultmessage += binID + ":" + srLine.getValue(c) + " "
							}
						});
					});
				}
			}
			break; //case 'stockitembincheck':
		} // switch (currentDeviceRequest)
		
		// Complete the XML results with XML tag specified
		theXML = createTaggedXML(requestResultsTag, fileLines);
	}

	// Add the results header and wrapper results tags and return XML
	return createTaggedXML(currentDeviceRequest + "results",
			getXMLResultsStatus() + theXML);
}

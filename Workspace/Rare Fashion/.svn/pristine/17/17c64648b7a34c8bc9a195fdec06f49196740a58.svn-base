/*************************************************************************
 * Name: 	RESTQuery.js
 * Script: 	REST web service
 * Client: 	Rare
 * 
 * Version: 1.0.0 - 13 Jun 2012 - 1st release (proof of concept) - JM
 * Version: 1.0.1 - 08 Nov - 07 Dec 2012- 1st release (commercial version) - LD
 *
 * Author: 	FHL
 * Purpose: REST Web Service for saved search queries

 * Script: RESTQuery.js  
 * Deploy: xxxx  
 * 
 * URL 				/app/site/hosting/restlet.nl?script=96&deploy=1  
 * External URL 	https://rest.sandbox.netsuite.com/app/site/hosting/restlet.nl?script=96&deploy=1  
 * **************************************************************************/

//Initialising Global Variables
var fileLines='';
var searchLines = new Array();
/*
 * XML standard definitions for string parsing of elements and data
 */
var tagXMLstart = "&lt;";
var tagXMLend = "&gt;";
var tagXMLstartChar = "<";
var tagXMLendChar = ">";
var tagXMLterminator = "/";
var elementXMLroot = "!?ROOT?!";
var XMLtree = new Array();
var XMLtreeSize = 0;
// The indices for each array element in the tree
var XMLtreeParent = 0;
var XMLtreeElement = 1;
var XMLtreeNumberofChildren = 2;
var XMLtreeDataOrXML = 3; // Will be data if XMLtreeNumberofChildren == 0

/*
 * The incoming device request globals for audit
 */
var currentDeviceName = '';
var currentDeviceDateTime = '';
var currentDeviceRequest = '';

/*
 * Standard header - return payload results variables <resultstatus> <issuccess></
 * issuccess > Boolean true/false <itemcount></ itemcount > Integer >= 0
 * <resultmessage></ resultmessage > Any error / system message </resultstatus>
 * 
 */
var resultstatusTag = 'resultstatus';
var issuccessTag = 'issuccess';
var issuccess = false;
var itemcountTag = 'itemcount';
var itemcount = 0;
var resultmessageTag = 'resultmessage';
var resultmessage = '';

/**
 * handles the payload from the web service call
 * 
 * 1.0.1 - Add XML Document parsing since all payloads must be well-formed XML
 * using an inbuilt library since NetSuite nlapiStringToXML(contents) is
 * unreliable
 * 
 */
function restMessage(datain)
{
	var contents='';
	var retVal = '';
	
	contents = datain.contents;

	try
	{
	    var XMLtreeSize = getXMLTree(elementXMLroot, contents);
	    //N.B : The NetSuite API could not return an XML document from the string
	    //hence the use of in-built XML node processor
		//var XMLPayload = nlapiStringToXML(contents);		//ISO-8859-1? UTF-8?
	}
    catch(e)
    {
    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
    	retVal = 'Upload Failed';
    }     	      

    // Use this code to print out the tree if needed
    /*
    for (var t=0; t<XMLtree.length; t++)
    	nlapiLogExecution('DEBUG', "XML Node : " + t, XMLtree[t][0]
    	+ " : " + XMLtree[t][1] + " : "
    	+ XMLtree[t][2] + " : "
    	+ XMLtree[t][3]);
    */
    
	// ************************************************
	// Parse the incoming XML for device header info and then
    // submit request payload to the processing function, 
    // return the XML to the calling device / application.
	// ************************************************
	try {
		
		// Expected Header XML : <devicerequest><userid>RarePDA1</userid><whenrequest>27/11/2012 12:52:34</whenrequest><therequest> ... </therequest> ... </devicerequest>
		var currentRequestChild = getXMLTreeChildElementsbyName('therequest');
		var currentDeviceName = getXMLTreeElementDatabyName('userid');
		var currentDeviceDateTime = getXMLTreeElementDatabyName('whenrequest');

		if (currentRequestChild && currentDeviceDateTime && currentDeviceDateTime) {
			currentDeviceRequest = currentRequestChild[0][XMLtreeElement];
			retVal = auditTrail(getXMLTreeElementDatabyName(currentDeviceRequest),currentDeviceName,currentDeviceRequest,currentDeviceDateTime);
			
			fileLines = getXMLforDeviceRequest(currentDeviceRequest); // The main entry point for all <therequest> ... </therequest> types

		} else {
			nlapiLogExecution('ERROR', 'BAD DEVICE REQUEST HEADER',
					'currentRequestChild=' + currentRequestChild
							+ ' currentDeviceDateTime= ' + currentDeviceDateTime
							+ ' currentDeviceName=' + currentDeviceName);
			retVal = 'Upload Failed';
		}
	} catch (e) {
		nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
		retVal = 'Upload Failed';
	}     	      
	
	return fileLines;
}

/*
 * 
 * 
 */

function getXMLforDeviceRequest(currentDeviceRequest) {
	var theXML = '';
	var savedSearch = 'customsearch_restquery_' + currentDeviceRequest; // Default convention
	var searchType = 'item'; // Default
	var requestResultsTag = 'itemlist'; // Default

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
	
	var criteria = new Array(); // This will store the parsed criteria as defined in the request
	
	var binCriteria = null;
	if (binID != "" && binID != null) 
		binCriteria = new Array('binnumber', 'is', binID);
	
	var itemCriteria = new Array();
	if (itemCode != "" && itemCode != null) {
		var itemCodeCriteria = new Array('name', 'contains', itemCode);
		var barCodeCriteria = new Array('custitem_barcode_1', 'is', itemCode);
		itemCriteria.push(itemCodeCriteria);
		itemCriteria.push('or');
		itemCriteria.push(barCodeCriteria);
	}
	
	try {
		switch (currentDeviceRequest) {
		case 'stockbinquery':
			savedSearch = "customsearch_restquery_stockitemexist";
			if (binCriteria) 
				criteria.push(binCriteria);
			break;
		case 'stockitemexist':
			if (itemCriteria)
				criteria.push(itemCriteria);
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
			if (binCriteria) 
				criteria.push(binCriteria);
			if (binCriteria && itemCriteria){
				criteria.push('and');
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
				if (itemCriteria && binFrom != "" && binTo != ""){
					criteria.push('and');
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
				//if (!isNaN(salesOrderNumber))
				//	salesOrderNumber = 0; // Void it as not numeric
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

function getXMLResultsStatus(){
	var theResultsXML = '';
	theResultsXML = createTaggedXML(issuccessTag, issuccess) +
					createTaggedXML(itemcountTag, itemcount) + 
					createTaggedXML(resultmessageTag, resultmessage);
	
	return createTaggedXML(resultstatusTag, theResultsXML);
}

function stockBinTransfer(binFrom,binTo,itemCode,quantity)
{
	var transferID = null;
	if (binFrom != '' && binTo != '' && itemCode != '' && quantity != '') {
		
		try
		{
			var newDate = new Date();			
			var newBinRecord = nlapiCreateRecord('bintransfer', {recordmode: 'dynamic'});			
			var binLocationID = genericSearchField('bin', 'binnumber', binFrom, 'location')
			var ItemCodeID = getItemIDforItemCode(itemCode);
		
			newBinRecord.setFieldValue('trandate', nlapiDateToString(newDate));
			newBinRecord.setFieldValue('location', binLocationID);
			newBinRecord.setFieldValue('subsidiary', 1);
			
			newBinRecord.selectNewLineItem('inventory');
			newBinRecord.setCurrentLineItemValue('inventory','item', ItemCodeID); // 4228 Inventory Item: 927-PURPLE-S/M hard code for testing only
			newBinRecord.setCurrentLineItemValue('inventory','quantity', quantity); 

			var bodySubRecord = newBinRecord.createCurrentLineItemSubrecord('inventory', 'inventorydetail');
			var binFromLocationID = genericSearch('bin', 'binnumber', binFrom);
			var binToLocationID = genericSearch('bin', 'binnumber', binTo);

			var qtytobuild = 1;
			for (var ctr = 1; ctr <= qtytobuild; ctr++) {
				bodySubRecord.selectNewLineItem('inventoryassignment');
				//bodySubRecord.setCurrentLineItemValue('inventoryassignment',
				//		'issueinventorynumber', 'binxfer_' + ctr);
				bodySubRecord.setCurrentLineItemValue('inventoryassignment',
						'quantity', quantity);
				bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'binnumber', binFromLocationID);
				bodySubRecord.setCurrentLineItemValue('inventoryassignment', 'tobinnumber', binToLocationID);
				bodySubRecord.commitLineItem('inventoryassignment');
			}
			bodySubRecord.commit();
			newBinRecord.commitLineItem('inventory');   			
			transferID = nlapiSubmitRecord(newBinRecord, true);
		}
	    catch(e)
	    {
	    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
	    	retVal = 'Bin transfer record creation Failed';
	    }     	      

	}
    nlapiLogExecution('DEBUG', 'binTransfer: ' + transferID, 'binFromID: ' + binFromLocationID + ' binToID: ' + binToLocationID + ' itemCode: ' + itemCode + ' transferQuantity: ' + quantity + ' ==> binTransferID: ' + transferID);
	return transferID;
}

function stockAdjust(binID, itemCode, stockQuantity) {
	var adjustID = null;

	if (binID != '' && itemCode != '' && stockQuantity != '') {

		try {

			var newAdjustRecord = null;
			newAdjustRecord = nlapiCreateRecord('inventoryadjustment', {
				recordmode : 'dynamic'
			});
			
			// Set up the record header
			var newDate = new Date();
			var accountID = 272;
			if (stockQuantity < 0)
				accountID = 273;
			var binLocationID = genericSearchField('bin', 'binnumber', binID, 'location')
			newAdjustRecord.setFieldValue('trandate',
					nlapiDateToString(newDate));
			newAdjustRecord.setFieldValue('customform', 124); // Custom form
			newAdjustRecord.setFieldValue('subsidiary', 1);
			newAdjustRecord.setFieldValue('account', accountID);
			newAdjustRecord.setFieldValue('adjlocation', binLocationID);
			//newAdjustRecord.setFieldValue('quantity', parseFloat(quantity));

			var ItemCodeID = getItemIDforItemCode(itemCode);

			newAdjustRecord.selectNewLineItem('inventory');
			newAdjustRecord.setCurrentLineItemValue('inventory', 'item',
					ItemCodeID);
			newAdjustRecord.setCurrentLineItemValue('inventory', 'location',
					binLocationID);
			newAdjustRecord.setCurrentLineItemValue('inventory', 'adjustqtyby',
					parseFloat(stockQuantity));
		    /*
			nlapiLogExecution('DEBUG', 'stockAdjust:inventory', 'adjustqtyby: ' + newAdjustRecord.getCurrentLineItemValue('inventory', 'adjustqtyby') + 
		    		' item: ' + newAdjustRecord.getCurrentLineItemValue('inventory', 'item') + 
		    		' location: ' + newAdjustRecord.getCurrentLineItemValue('inventory', 'location') +
		    		' newquantity (' + parseFloat(stockQuantity) + ') : ' + newAdjustRecord.getCurrentLineItemValue('inventory', 'adjustqtyby'));
			*/
			
			var bodySubRecord = null;
			bodySubRecord = newAdjustRecord.createCurrentLineItemSubrecord(
					'inventory', 'inventorydetail');
			var qtytobuild = 1;
			var binInternalID = genericSearch('bin', 'binnumber', binID);
			for ( var ctr = 1; ctr <= qtytobuild; ctr++) {
				bodySubRecord.selectNewLineItem('inventoryassignment');
				//bodySubRecord.setCurrentLineItemValue('inventoryassignment',
				//		'issueinventorynumber', 'binstockadjust_' + ctr);
				bodySubRecord.setCurrentLineItemValue('inventoryassignment',
						'quantity', stockQuantity);
				bodySubRecord.setCurrentLineItemValue('inventoryassignment',
						'binnumber', binInternalID);
				bodySubRecord.commitLineItem('inventoryassignment');
			}
			bodySubRecord.commit();
			newAdjustRecord.commitLineItem('inventory');
			adjustID = nlapiSubmitRecord(newAdjustRecord, true);

		} catch (e) {
			nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
			retVal = 'Stock adjustment record creation Failed';
		}

	}
    nlapiLogExecution('DEBUG', 'stockAdjust', 'binID: ' + binID + ' itemCode: ' + itemCode + ' stockQuantity: ' + stockQuantity + ' ==> stockAdjustID: ' + adjustID);
	return adjustID;
}

function submitOrder(salesOrderNumber, numItems) {
	var fulfillID = null;

	if (salesOrderNumber != '' && numItems != '') {
		try {
			// Set up the transform record Salesorder ==> Item Fulfillment
			var newDate = new Date();
			var orderInternalid = genericSearch('salesorder', 'tranid', salesOrderNumber);
			var newItemFulfillmentRecord = nlapiTransformRecord('salesorder', orderInternalid, 'itemfulfillment');

			newItemFulfillmentRecord.setFieldValue('trandate', nlapiDateToString(newDate));
			newItemFulfillmentRecord.setFieldValue('customform', 120); // RF custom form

			// First discover the no. of item(s) in the sales order and set to not 
			// fulfilled so they can be picked off from the submitted list from the PDA
			var numOrdItems = newItemFulfillmentRecord.getLineItemCount('item');
			var ordItemIDArray = new Array();
			for (var theOrdItem = 1; theOrdItem <= numOrdItems; theOrdItem++) {
				var OrdItemID = newItemFulfillmentRecord.getLineItemValue('item', 'item', theOrdItem);
				var OrdItemQty = newItemFulfillmentRecord.getLineItemValue('item', 'quantity', theOrdItem);
				// This flag below is used to simulate the 'Fulfill' check box, 
				// will set to 'F' at the end if not present in the submitted XML
				ordItemIDArray.push(new Array(OrdItemID, OrdItemQty, false)); 
			}
			
			// Examine each item scanned for a bin, item code, quantity, carton
			for ( var theItem = 1; theItem <= numItems; theItem++) {
				var itemBinID = getXMLTreeElementDatabyName(
						'binnumber', theItem);
				var binLocationID = genericSearchField('bin', 'binnumber', itemBinID, 'location')
				var itemQuantity = getXMLTreeElementDatabyName('quantity',
						theItem);
				var cartonNumber = getXMLTreeElementDatabyName('cartonnumber',
						theItem);
				var itemCode = getXMLTreeElementDatabyName('itemcode',
						theItem);
				var ItemCodeID = getItemIDforItemCode(itemCode);

				if (binLocationID && itemQuantity && itemCode && cartonNumber) {
					// Check each submitted item against the Sales Order item(s) for a match and process
					for (var theOrdFindItem = 1; theOrdFindItem <= numOrdItems; theOrdFindItem++) {
						if (ordItemIDArray[(theOrdFindItem - 1)][0] == ItemCodeID) { // Matched so process
							
							// Set 'Fulfill' so we can de-select unwanted ones at the end
							ordItemIDArray[(theOrdFindItem - 1)][2] = true; 
							
							// Trace code below - comment in /out as required
							nlapiLogExecution('DEBUG', 'submitOrderItem ' + salesOrderNumber + ' : ' + theOrdFindItem + '/' + numOrdItems, 'itemBinID: ' + itemBinID +
									' binLocationID: ' + binLocationID + ' itemcode: ' + itemCode + ' itemcodeID: ' + ItemCodeID + ' itemQuantity: ' + itemQuantity + ' cartonNumber: ' + cartonNumber);

							// Set the submitted main line item level values
							newItemFulfillmentRecord.setLineItemValue('item',
									'location', theOrdFindItem, binLocationID);
							newItemFulfillmentRecord.setLineItemValue('item',
									'quantity', theOrdFindItem, itemQuantity);
							newItemFulfillmentRecord.setLineItemValue('item',
									'custcol_cartonnumber', theOrdFindItem,
									cartonNumber);

							// Set the Inventory Detail sub record values
							newItemFulfillmentRecord.selectLineItem('item',
									theOrdFindItem);
							var bodySubRecord = null;
							bodySubRecord =	newItemFulfillmentRecord.createCurrentLineItemSubrecord('item',
										'inventorydetail');							

							var binInternalID = genericSearch('bin',
									'binnumber', itemBinID);

							bodySubRecord.selectNewLineItem('inventoryassignment');
							bodySubRecord.setCurrentLineItemValue(
									'inventoryassignment', 'binnumber',
									binInternalID);
							bodySubRecord.setCurrentLineItemValue(
									'inventoryassignment', 'quantity',
									itemQuantity);
							
							bodySubRecord.commitLineItem('inventoryassignment');
							// This next line is required, otherwise a user error is reported, leaves an empty second line ...?!
							bodySubRecord.removeLineItem('inventoryassignment', 2); 
							bodySubRecord.commit();
							newItemFulfillmentRecord.commitLineItem('item');
							
							// Trace code below - comment in /out as required
							/*
							nlapiLogExecution('DEBUG', 'fulfill:subrecord ' + theOrdFindItem + ' / ' + numOrdItems + ' AFTER',  
									bodySubRecord.getLineItemCount('inventoryassignment') + ' lines : ' +
									bodySubRecord.getLineItemValue(
											'inventoryassignment', 'quantity', 1) + ' : ' +
											bodySubRecord.getLineItemValue(
													'inventoryassignment', 'binnumber', 1));
							*/							
						}
					} // if (ordItemIDArray[theOrdItem - 1] == ItemCodeID)
				} // for (var theOrdItem = 1; theOrdItem <= numOrdItems; theOrdItem++)
			} // if (binLocationID)
			

			// De-select unwanted item(s) at the end before commit
			for ( var theOrdNotFindItem = 1; theOrdNotFindItem <= numOrdItems; theOrdNotFindItem++) {
				if (ordItemIDArray[(theOrdNotFindItem - 1)][2] == false) {
					newItemFulfillmentRecord.setLineItemValue('item',
							'itemreceive', theOrdNotFindItem, 'F');

				}
				
				// Trace code below - comment in /out as required
				/*
				nlapiLogExecution('DEBUG', 'fulfill:item ' + theOrdNotFindItem
						+ ' / ' + numOrdItems + ' AFTER',
						newItemFulfillmentRecord.getLineItemValue('item',
								'itemreceive', theOrdNotFindItem)
								+ ' : '
								+ newItemFulfillmentRecord.getLineItemValue(
										'item', 'location', theOrdNotFindItem)
								+ ' : '
								+ newItemFulfillmentRecord.getLineItemValue(
										'item', 'quantity', theOrdNotFindItem)
								+ ' : '
								+ newItemFulfillmentRecord.getLineItemValue(
										'item', 'custcol_cartonnumber',
										theOrdNotFindItem));
				*/
			}
			
			newItemFulfillmentRecord.setFieldValue('shipstatus', 'C');
			fulfillID = nlapiSubmitRecord(newItemFulfillmentRecord, false, true);
			
		} catch (e) {
			nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
			retVal = 'Item fulfillment record creation Failed';
		}
	}

	nlapiLogExecution('DEBUG', 'fulfillOrder: ' + salesOrderNumber, 'NumItems: ' + numItems + ' ==> fulfillmentID: ' + fulfillID);
	return fulfillID;
}

function getItemIDforItemCode(theItemCode){
	var theItemID = null;
	
    var itemSearchFilters = new Array();
    var itemSearchColumns = new Array();
    
    itemSearchFilters[0] = new nlobjSearchFilter('name', null, 'contains', theItemCode);
	var getItemcriteria = new Array();
	if (theItemCode != "" && theItemCode != null) {
		var itemCodeCriteria = new Array('name', 'contains', theItemCode);
		var barCodeCriteria = new Array('custitem_barcode_1', 'is', theItemCode);
		getItemcriteria.push(itemCodeCriteria);
		getItemcriteria.push('or');
		getItemcriteria.push(barCodeCriteria);
	}
    
    itemSearchColumns[0] = new nlobjSearchColumn('name');
    itemSearchColumns[1] = new nlobjSearchColumn('description');
    itemSearchColumns[2] = new nlobjSearchColumn('internalid');

    //var itemSearchResults = nlapiSearchRecord('item', null, itemSearchFilters, itemSearchColumns);
    var itemSearchResults = nlapiSearchRecord('item', null, getItemcriteria, itemSearchColumns);
    
    if (itemSearchResults) {
    	theItemID = itemSearchResults[0].getValue(itemSearchColumns[2]);
    }

    //nlapiLogExecution('DEBUG', 'getLocationIDforitemCode', 'theItemCode: ' + theItemCode + ' ==> internalid: ' + theItemID);
	return theItemID;
}


/**
 * creates an audit record and adds the CSV payload to it
 * 1.0.1 split out credit note number
 */
function auditTrail(message,id,what,when)
{

	//var desc = 'Device:' + currentDeviceName +  ' Request: ' + currentDeviceRequest + " When:" + currentDeviceDateTime;
	var desc = 'Device:' + id +  ': Request: ' + what + ": When:" + when;
	var auditID = 0;
	var retVal = 'OK';
	var newAudit = null;
	
	try
	{
		newAudit = nlapiCreateRecord('customrecord_stockaudit');
				
		newAudit.setFieldValue('name', desc);
		newAudit.setFieldValue('custrecord_description', desc);
		newAudit.setFieldValue('custrecord_processed', 'FALSE');
		newAudit.setFieldValue('custrecord_payload', message);
		newAudit.setFieldValue('custrecord_status', 'Awaiting processing');

		auditID = nlapiSubmitRecord(newAudit, true);
		
	}
    catch(e)
    {
    	nlapiLogExecution('ERROR', e.getCode(), e.getDetails());
    	retVal = 'Upload Failed';
    }     	      

    return retVal;
}


/************************************************************************************
*
* run the saved searches
* 
************************************************************************************/


function runSavedSearches(reportName,csvxml,type,criteria)
{
	if(csvxml == 'CSV')
	{
		runSavedSearch(0,1000,true, reportName);
	}
	else
	{
		// xml
		runSavedSearchXMLWithCriteria(0,1000,true, reportName, type, criteria);
	}
}


/************************************************************************************
 *
 * Function that runs the first saved search and write the results to the CSV File
 * 
 ************************************************************************************/

function runSavedSearch(from, to, header, savedSearch)
{
	var commaLine = '';

	//Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);
	
	//Running the loaded search
	var runSearch = loadSearch.runSearch();
	
	//Getting the first 1000 results
	var searchResults = runSearch.getResults(from,to);
	
	//calling the makeHeader function
	if(header==true)
	{
		fileLines = makeHeader(searchResults[0]);
		fileLines = fileLines + '\n';
	}	
	
	//adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine)
	{
		commaLine = makeLine(srLine);
		fileLines = fileLines+ commaLine + '\n';
	});
	
	
}


/************************************************************************************
*
* Function that runs the first saved search and write the results to the CSV File
* 
************************************************************************************/

function runSavedSearchXML(from, to, header, savedSearch)
{
	var commaLine = '';

	//Loading the saved search
	var loadSearch = nlapiLoadSearch('transaction', savedSearch);
	
	//Running the loaded search
	var runSearch = loadSearch.runSearch();
	
	//Getting the first 1000 results
	var searchResults = runSearch.getResults(from,to);
	
	//adding the first 1000 results into the CSV file after adding the header
	searchResults.forEach(function(srLine)
	{
		commaLine = makeXMLLine(srLine);
		fileLines = fileLines+ commaLine + '\n';
	});
	
	
}


/*
//Define new search filter expression
var newFilterExpression =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
 
//Override filters from previous search and save new search
mySearch.setFilterExpression(newFilterExpression);
mySearch.saveSearch('Opportunities salesrep dept', 'customsearch_kr2');/*

/************************************************************************************
*
* Function that runs the first saved search and write the results to the CSV File
*
* filters are set like this: var criteria =[[ 'customer.salesrep', 'anyOf', -5 ],'and',[ 'department', , 'anyOf', 3 ]];
*
************************************************************************************/

function runSavedSearchXMLWithCriteria(from, to, header, savedSearch, type,
		criteria) {
	var commaLine = '';

	// Use this code below to trace search criteria as required during development
	var criteriaText = "";
	for ( var c = 0; c < criteria.length; c++) {
		if (criteria[c].constructor == Array) {
			for ( var p = 0; p < criteria[c].length; p++) {
				criteriaText += criteria[c][p] + " ";
			}
			criteriaText += ", ";
		} else {
			criteriaText += criteria[c] +", ";
		}
	}
	nlapiLogExecution('DEBUG', criteria.length + " criteria : " + savedSearch, criteriaText);
	
	// Loading the saved search
	var loadSearch = nlapiLoadSearch(type, savedSearch);

	// set the filter for the search
	if (!loadSearch.getFilters()){
		loadSearch.setFilterExpression(criteria);		
	} else {
		var tempFilters = loadSearch.getFilters();
		loadSearch.setFilterExpression(criteria);
		loadSearch.addFilters(tempFilters);
	}

	// Running the loaded search
	var runSearch = loadSearch.runSearch();

	// Getting the first 1000 results
	//var searchResults = runSearch.getResults(from, to);
	searchLines = runSearch.getResults(from, to);
	
	if (searchLines) {
		// adding the first 1000 results into the CSV file after adding the
		// header
		searchLines.forEach(function(srLine) {
			commaLine = makeXMLLine(srLine);
			//fileLines = fileLines + commaLine + '\n';
			fileLines += createTaggedXML(type, commaLine);
		});
		
		itemcount = searchLines.length;

	}
}



/*******************************************************
 * 
 * Function that creating the header line of the CSV File's data
 * 
 * @param firstLine
 * @returns
 * 
 ******************************************************/
function makeHeader(firstLine)
{
	//Getting all the columns of the 1st line from the saved search results
	var cols = firstLine.getAllColumns();
	var hdr = [];
	
	/*
	 * callback function that gets the column labels under each column 
	 */
	cols.forEach(function(c)
	{
		//Getting the custom label name of the column in saved search
		var lbl = c.getLabel(); 
		
		//if there is a custom label for the column
		if(lbl)
		{
			//Adding the column label to the hdr array
			hdr.push(escapeCSV(lbl));
			hdr.join(",");
		}
	});
		
	//returning the header array
	return hdr.join(",");
}



/************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
*************************************************************/

function makeLine(srchRow)
{
	//Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = [];

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c)
	{
		// if there is a custom label name for each line then
		if(c.getLabel())
		{
			//Getting the value of the particular value under the column and adding it to the line array
			line.push(escapeCSV(srchRow.getText(c) || srchRow.getValue(c)));
			
			//Separate the values by a comma
			line.join(',');
		}
	});

	//returning the line array
	return line;
}


/************************************************************
 * Function that creating the lines of CSV File
 * 
 * @param srchRow
 * @returns {Array}
 * 
*************************************************************/

function makeXMLLine(srchRow)
{
	//Getting the columns of each line of the saved search
	var cols = srchRow.getAllColumns();
	var line = '';
	var xmlstart = '';
	var xmlend = '';
	var fieldToAdd = '';
	
	//line = '<record>';

	/*
	 * callback function that gets the values under each column for each line
	 */
	cols.forEach(function(c)
	{		
		fieldToAdd = (srchRow.getText(c) || srchRow.getValue(c));
		line += createTaggedXML(c.getLabel(), nlapiEscapeXML(fieldToAdd)); 		
	});

	//line = line + '</record>';

	//line = escapeCSV(line);
	
	//returning the line array
	return line;
}



/******************************************************************
 * Function that used to remove/escape particular signs/values
 * 
 * @param val
 * @returns
 *******************************************************************/
function escapeCSV(val)
{
	//Initialising local variables
	var returnValue; 
	
	if(!val)
	{
		returnValue = '';
		//return returnValue;
	}

	else if(!(/[",\s]/).test(val))
	{
		returnValue = val;
		//return val;
	}

	else
	{
		val = val.replace(/"/g, '""');
		returnValue = ('"'+ val + '"');
	}
	
	return returnValue;
}

/* XML Processing routines
 * 
 * This primary recursive function returns an array of elements 
 * as a tree of nested arrays (branches with children nodes)
 * and data strings (leaves i.e. elements with no children).
 */
function getXMLTree(theParent, theXML) {
	var numberofChildren = 0;
	
	var XMLremaining = theXML;
	
	while (XMLremaining != '') {
		// Look for <element>....</element> i.e. the next start / end tag branch
		var currentElementExp = new RegExp("^" + tagXMLstart + "[a-z]*"
				+ tagXMLend, "im"); // equates to <([A-Z][A-Z0-9]*)\b[^>]*>(.*?)</\1>
		var currentElement = new String(currentElementExp.exec(XMLremaining));
		var currentElementEndExp = new RegExp(currentElement.replace(
				tagXMLstart, tagXMLstart + tagXMLterminator), "im");
		var currentElementEnd = new String(currentElementEndExp
				.exec(XMLremaining));
		
		// Test for <element>....</element> existence
		if (currentElementExp.test(XMLremaining)
				&& currentElementEndExp.test(XMLremaining)) {
			
			numberofChildren++; //Increment for each child node
			
			var currentElementInnerXML = XMLremaining.substring(XMLremaining
					.indexOf(currentElement)
					+ currentElement.length, XMLremaining
					.indexOf(currentElementEnd));
			
			var thisElementBranch = new Array(removeTagCharacters(theParent), removeTagCharacters(currentElement), getXMLTree(currentElement, currentElementInnerXML), currentElementInnerXML);
			XMLtreeSize = XMLtree.push(thisElementBranch);			
			XMLremaining = XMLremaining.replace(currentElement,'').replace(currentElementInnerXML,'').replace(currentElementEnd,'');
		}	else {
			XMLremaining = ''; //No more elements to process
		}	
	}
	
	return numberofChildren; // If this is 0 then the calling parent will terminate i.e. at a leaf / data element
}

/*
 * Returns the tag stripped of < > /
 */
function removeTagCharacters(theXMLtag) {
	return theXMLtag.replace(tagXMLstart,'').replace(tagXMLend,'').replace(tagXMLterminator,'');
}

function createTaggedXML(theXMLtag, theInnerXML) {
	return tagXMLstartChar + theXMLtag + tagXMLendChar + theInnerXML + tagXMLstartChar + tagXMLterminator + theXMLtag + tagXMLendChar;
}

/*
 * Returns the data or XML content of first by default or nth occurence of tree record that matches element name
 */
function getXMLTreeElementDatabyName(theElementName, theIndex) {
	var theData = null;
	if (isNaN(theIndex))
		theIndex = 1;
	var currentIndex = 0;
	for ( var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeElement] == theElementName) {
			currentIndex++;
			if (currentIndex == theIndex) {
				theData = XMLtree[t][XMLtreeDataOrXML];
				break;
			}
		}
	return theData;
}

/*
 * Returns the first by default or nth occurence of tree record that matches element name
 */
function getXMLTreeElementbyName(theElementName, theIndex) {
	var theElement = new Array();
	if (isNaN(theIndex))
		theIndex = 1;
	var currentIndex = 0;
	for ( var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeElement] == theElementName) {
			currentIndex++;
			if (currentIndex == theIndex) {
				theElement = XMLtree[t];
				break;
			}
		}
	return theElement;
}


/*
 * Returns the array of child record(s) that matches element (parent) name
 */
function getXMLTreeChildElementsbyName(theElementName) {
	var theElements = new Array();
	for (var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeParent] == theElementName) {
			theElements.push(XMLtree[t]);
		}
	return theElements;
}

/*
 * Returns the array of child record(s) that matches element (parent) name
 */
function getXMLTreeChildNumberbyName(theElementName) {
	var theElementNumber = 0;
	var theElements = new Array();
	for (var t = 0; t < XMLtree.length; t++)
		if (XMLtree[t][XMLtreeParent] == theElementName) {
			theElements.push(XMLtree[t]);
		}
	if (theElements != null)
		theElementNumber = theElements.length;
	return theElementNumber;
}




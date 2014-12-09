/********************************************************************************************************************************
 * Name:        Pick, Pack & Ship Packing Slip (printPPSPackingSlip.js)
 *
 * Script Type: Suitelet
 * 
 * Client:      Mr. Fothergills Seeds Limited
 * 
 * Version:     1.0.0 - 11 Jun 2012 - first release - MJL
 * 				1.1.0 - 17 Jun 2013 - added - hard-wire the location filter dependent on the menu link clicked by the user - MJL
 * 				1.1.1 - 18 Jun 2013 - load default start and end batch numbers and save submitted numbers if different - MJL
 * 				1.1.2 - 20 Jun 2013 - addition of sublist for selecting orders to print - MJL
 * 				1.1.3 - 21 Jun 2013 - moved getAccNo function into Fothergills Library script - MJL
 * 				1.1.4 - 26 Jun 2013 - added Allow Reprinting flag to form - MJL
 * 				1.2.0 - 02 Jul 2013 - reworked PDF printing functionality to accommodate more scenarios - MJL
 * 				1.2.1 - 03 Jul 2013 - added barcode for order number - MJL
 * 				1.2.2 - 04 Jul 2013 - added function to add specified no. of line breaks to correctly position footer  - MJL
 * 				1.2.3 - 04 Jul 2013 - added try-catch blocks to functions - MJL
 * 				1.2.4 - 11 Jul 2013 - escape XML-reserved characters - MJL
 *  			1.2.5 - 17 Jul 2013 - bug fix: packing slip amalgamates locations - PPS record search now filters on location - MJL
 * 		 
 * Author:      FHL
 * 
 * Purpose:     Print packing slip for fulfilled orders
 * 
 * Script:     	customscript_pps_printpackingslip
 * Deploy:      customdeploy_pps_printpackingslip
 * 
 * Queries:		Need information for barcodes - code type? value?
 * 
 * Libraries:   library.js
 ********************************************************************************************************************************/

var objRequest = null;
var objResponse = null;

//Default batch nos.
var startBatch = null;
var endBatch = null; 

//Filters form
var selectionForm = null;
var btnGetOrders = null;
var fldLocation = null;
var fldBatchNo = null;
var fldOrderNo = null;
var fldStartBatch = null;
var fldEndBatch = null;
var fldAllowReprint = null;

//Sublist form
var sublist = null;
var subfldPrint = null;
var subfldOrderDate = null;
var subfldOrderNo = null;
var subfldBatchNo = null;
var subfldCustomer = null;
var subbtnUnmarkAll = null;

//Filter data
var location = 0;
var locationName = '';
var batchNo = 0;
var orderNo = 0;
var selectedStartBatch = 0;
var selectedEndBatch = 0;
var allowReprint = '';
var ppsIDs = new Array();
var ppsRecord = null;
var print = '';
var isPrinted = '';

var salesOrderCount = 0;
var currentSalesOrder = 0;
var tickedLineCount = 0;
var tickedLineNos = [];
var currentTickedLine = 0;
var currentTickedSalesOrder = 0;
var ppsItemCount = 0;
var currentPPSItem = 0;
var currentPPSItemID = 0;
var currentOrderLineCount = 0;

//search data
var filters = new Array();
var columns = new Array();
var results = null;
var resultCount = 0;
var isProcessed = '';

//Loaded sales order
var tempOrderNo = 0;
var salesOrderIntID = 0;
var salesOrderRecord = null;

//Parameter info
var context = null; 
var locationFromURL = null;
var logoURL = '';

//Brand address
var brandAddress = '';
var returnAddress = '';

//SO header info
var customerID = 0;
var customerRef = '';
var brand = '';
var accNo = 0; //get from customerRef
var orderNo = 0;
var orderDate = '';

var orderArray = new Array();
var orderObj = new Object();
var orderCount = 0;

//SO line info
var itemArray = new Array();
var itemObj = new Object();
var itemCount = 0;
var currentCount = 0;
var currentOrderCount = 0;
var currentLineCount = 0;

//XML for barcode
var barcodeTag = '';

//Create XML structure
var pdfxml = '';

//Create PDF file
var pdfFile = null;
var errormsg = '';

//Other stuff - may need deleting
var searchResult = null;
var searchResults = null; // saved search results
var fulfillmentSearch = null;
var fulfillmentSearchIntID = 0;		
var itemQtys = new Array();
var itemQtysCopy = new Array();
var itemObj=new Object();
var tempSalesOrder = 0;
var qty = 0;
var item = 0;
var fulfillOrder = false;
var salesOrderToFulfill = 0;
var stagingIntID = 0;
var staging = null;
var processingError = '';
var processMessage = '';
var fulfillmentStatus = '';

/**
 * Create suitelet for printing packing slips for orders
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 */
function printPPSPackingSlip(request, response)
{
	//Make request and response objects globally accessible
	objRequest = request;
	objResponse = response;

	nlapiLogExecution('AUDIT', 'Method', request.getMethod());

	if (request.getMethod() == 'GET')
	{
		context = nlapiGetContext();
		
		//create and display selection form
		initialise();
		createPrintForm();
		createSublist();
		response.writePage(selectionForm);
	}
	else
	{
		context = nlapiGetContext();
		
		if (getFormData() == true)
		{
			getSublistData(); //Get data from sublist and store in object array
			createXML(); //Get items from object array and add to XML 
		}
	}
}

/**
 * initialise
 * 
 * 1.1.0 get location ID from menu URL - MJL
 * 1.1.1 load default start and end batch numbers - MJL
 */
function initialise()
{
	try
	{	
		//1.1.0 MJL
		locationFromURL = objRequest.getParameter('custparam_locationid');
		
		//1.1.1 Load default start and end batch numbers - MJL
		startBatch = loadBatchNumbers(locationFromURL, 'start');
		endBatch = loadBatchNumbers(locationFromURL, 'end');
	}
	catch (e)
	{
		errorHandler('initialise', e);
	}
}

/**
 * Creates PPS selection form
 * 
 * 1.1.0 set location from URL and lock field - MJL
 * 1.1.4 add Allow Reprinting checkbox - MJL
 */
function createPrintForm()
{
	try
	{
		//Create selection form
		selectionForm = nlapiCreateForm('Pick Pack & Ship: Print Packing Slip');
		selectionForm.setScript('customscript_pps_getorders');
		
		fldLocation = selectionForm.addField('custpage_pps_location','select','Location','location');
		fldOrderNo = selectionForm.addField('custpage_pps_orderno', 'text', 'Sales Order Number');   //1.0.4 MJL
		fldStartBatch = selectionForm.addField('custpage_pps_startbatchno', 'text', 'Start Batch No.').setBreakType('startcol');
		fldEndBatch = selectionForm.addField('custpage_pps_endbatchno', 'text', 'End Batch No.');
		fldAllowReprint = selectionForm.addField('custpage_pps_allowreprint', 'checkbox', 'Allow Reprinting'); //1.1.4 MJL
		
		//Set fields to mandatory
		fldLocation.setMandatory(true);
		//fldOrderNo.setMandatory(true);
		fldStartBatch.setMandatory(true);
		fldEndBatch.setMandatory(true);
		
		//[TODO] Debug code - remove on deployment - MJL
		fldAllowReprint.setDefaultValue('T');

		//1.1.0 set location from URL and lock field - MJL
		if (locationFromURL != null)
		{
			fldLocation.setDefaultValue(locationFromURL);
			fldLocation.setDisplayType('inline');
		}
			
		//1.1.1 set default values for start and end batch numbers
		if (startBatch != -1 && endBatch != -1)
		{
			fldStartBatch.setDefaultValue(startBatch);
			fldEndBatch.setDefaultValue(endBatch);
		}

		//Add button to search for PPS records and add to sublist
		btnGetOrders = selectionForm.addButton('custpage_pps_getorders','Get Orders', 'getPPSOrders()');		
			
		//Create submit button
		selectionForm.addSubmitButton('Click here to print packing slips');
	}
	catch (e)
	{
		errorHandler('createPrintForm', e);
	}
}

/**
 * Create sublist for selecting orders to print
 * 
 * 1.1.3 added
 */
function createSublist()
{
	try
	{
		//Create sublist
		sublist = selectionForm.addSubList('custpage_orders', 'inlineeditor', 'Selected Orders');

		//Create sublist fields
		subfldPrint = sublist.addField('custpage_orders_print', 'checkbox', 'Print');
		subfldOrderDate = sublist.addField('custpage_orders_orderdate', 'date', 'Order Date');
		subfldOrderNo = sublist.addField('custpage_orders_orderno', 'text', 'Order Number');
		subfldCustomer = sublist.addField('custpage_orders_customer', 'select', 'Customer', 'customer');

		//Create mark/unmark all buttons
		subbtnMarkAll = sublist.addButton('custpage_orders_markall', 'Mark All', 'toggleAll(true)');
		subbtnUnmarkAll = sublist.addButton('custpage_orders_unmarkall', 'Unmark All', 'toggleAll(false)');
	}
	catch (e)
	{
		errorHandler('createSublist', e);
	}
}

/**
 * get form data
 * 
 * 1.1.4 get value of Allow Reprinting checkbox - MJL
 */
function getFormData()
{
	var retVal = false;

	try
	{
		//Get filter information from form
		location = objRequest.getParameter('custpage_pps_location');
		orderNo = objRequest.getParameter('custpage_pps_orderno'); //1.0.4
		selectedStartBatch = objRequest.getParameter('custpage_pps_startbatchno'); //1.1.1 MJL
		selectedEndBatch = objRequest.getParameter('custpage_pps_endbatchno'); //1.1.1 MJL
		allowReprint = objRequest.getParameter('custpage_pps_allowreprint'); //1.1.4 MJL
		
		//1.1.0 save new start and end batch number if submitted numbers differ from saved - MJL
		if (selectedStartBatch != startBatch && selectedEndBatch != endBatch)
		{
			saveBatchNumbers(location, selectedStartBatch, selectedEndBatch);
		}
		
		if (location != 0)
		{
			locationName = nlapiLookupField('location', location, 'name');
			processMessage = 'Pick Pack & Ship: Fulfilment Complete';			
			retVal = true;
		}
		else
		{
			processMessage = 'Pick Pack & Ship: You must select a location - no fulfillment records created';
		}	
	}
	catch (e)
	{
		errorHandler('getFormData', e);
	}
	return retVal;
}

/**
 * get data from sublist
 * 
 * 1.2.0 reworked PDF printing functionality to accommodate more scenarios - MJL
 */
function getSublistData()
{
	var retVal = false;
	
	try
	{
		salesOrderCount = objRequest.getLineItemCount('custpage_orders');
		
		for (var i = 0; i < salesOrderCount; i++)
		{
			//Make iterator global
			currentSalesOrder = i;
			
			//Get filter information from form
			print = objRequest.getLineItemValue('custpage_orders', 'custpage_orders_print', (currentSalesOrder + 1));
			
			//If marked to print...
			if (print == 'T')
			{	
				//Instantiate new order object
				orderObj = new Object();
				
				//Get order number and associated internal ID
				orderObj.orderNo = objRequest.getLineItemValue('custpage_orders', 'custpage_orders_orderno', (currentSalesOrder + 1));
				orderObj.salesOrderIntID = genericSearch('salesorder', 'tranid', orderObj.orderNo);
				
				//Load sales order record
				salesOrderRecord = nlapiLoadRecord('salesorder', orderObj.salesOrderIntID);
				
				//Get info from PPS records
				processResult();
				
				//Add new object to array
				orderArray[orderCount] = orderObj;
				orderCount++;
			}
		}
	}
	catch (e)
	{
		errorHandler('getSublistData', e);
	}
	return retVal;
}

/**
 * Get info from PPS records and create PDF
 * 
 * 1.2.0 reworked PDF printing functionality to accommodate more scenarios - MJL
 * 1.2.5 adding location filter to PPS record search - MJL
 */
function processResult() //Needs renaming
{	
	try
	{	
		//Get internal IDs of the PPS staging records associated with current order number
		ppsIDs = genericSearchArrayTwoParams('customrecord_mrf_pickpackship', 'custrecord_pps_deliveryref', orderObj.orderNo, 'custrecord_pps_location', location); //1.2.5 MJL
		ppsItemCount = ppsIDs.length;
		
		for (var i = 0; i < ppsItemCount; i++)
		{
			//Make iterator global
			currentPPSItem = i;
			currentPPSItemID = ppsIDs[currentPPSItem];

			//Load PPS staging record
			ppsRecord = nlapiLoadRecord('customrecord_mrf_pickpackship', currentPPSItemID);
			isPrinted = ppsRecord.getFieldValue('custrecord_pps_printed');

			//1.1.4 if Allow Reprint is checked, override Printed flag on PPS staging record - MJL
			if (allowReprint == 'T')
			{
				isPrinted = 'F';
			}
			
			//Only print the packing slip if Printed flag is not checked
			if (isPrinted == 'F')
			{
				if (currentPPSItem == 0)
				{
					//Instantiate new item array and object
					itemArray = new Array();
					itemCount = 0;
					
					//Get header info from order
					getHeaderInformation();	
				}
								
				//Get item detail
				getDetailInformation();
				
				//Load items into order object after last item
				if (currentPPSItem == (ppsItemCount - 1))
				{
					orderObj.items = itemArray;
				}
			}
		}
	}
	catch (e)
	{
		errorHandler('processResult', e);
	}
}

/**
 * get Header Information
 * 
 * 1.2.0 store info in order object - MJL
 * 1.2.4 escape addresses for use in XML - MJL
 */
function getHeaderInformation()
{
	try
	{		
		orderObj.customerRef = ppsRecord.getFieldText('custrecord_customernumber');
		orderObj.customerID = ppsRecord.getFieldValue('custrecord_customernumber');
		orderObj.orderDate = ppsRecord.getFieldValue('custrecord_pps_date');
		orderObj.accNo = getAccNo(orderObj.customerRef);
		
		//1.2.4 escape text for use in XML - MJL
		orderObj.customerRef = nlapiEscapeXML(orderObj.customerRef);
	}
	catch (e)
	{
		errorHandler('getHeaderInformation', e);
	}
}

/**
 * get detail Information
 * 
 * 1.2.0 store internal ID of PPS staging record - MJL
 * 1.2.4 escape text for use in XML - MJL
 */
function getDetailInformation()
{
	try
	{	//Instantiate new item object
		itemObj = new Object();
		
		//Add information to object
		itemObj.ppsId = ppsRecord.getId(); //1.2.0 MJL
		itemObj.itemId = ppsRecord.getFieldValue('custrecord_pps_item');
		itemObj.itemCode = ppsRecord.getFieldText('custrecord_pps_item');
		itemObj.itemDesc = nlapiLookupField('item', itemObj.itemId, 'displayname');
		itemObj.quantity = ppsRecord.getFieldValue('custrecord_pps_quantity');
		itemObj.total = getItemTotal(itemObj.itemId);
		
		//1.2.4 escape text for use in XML - MJL
		itemObj.itemCode = nlapiEscapeXML(itemObj.itemCode);
		itemObj.itemDesc = nlapiEscapeXML(itemObj.itemDesc);
		
		//Add object to item array
		itemArray[itemCount] = itemObj;
		itemCount++;
	}
	catch (e)
	{
		errorHandler('getDetailInformation', e);
	}
}

/**
 * Main XML creation function
 * 
 * 1.1.4 set Printed flag on current PPS record to true if Allow Reprinting is not checked - MJL
 * 1.2.0 reworked PDF printing functionality to accommodate more scenarios - MJL
 * 1.2.2 added current count of order lines for line breaking purposes - MJL
 */
function createXML()
{
	try
	{
		for (var i = 0; i < orderCount; i++)
		{	
			//Load order from array
			currentSalesOrder = i;
			orderObj = orderArray[currentSalesOrder];

			//Only define the XML doctype and namespace on the first iteration 
			if (currentSalesOrder == 0)
			{
				createXMLNamespace();
			}
						
			//Get info for header and create in XML
			if (getReportHeaderInfo() == true)
			{
				getCustomerAddress();
				createXMLHeader();
				createXMLItemTable();
			}
			
			//Get items from order
			itemArray = orderObj.items;
			currentOrderLineCount = itemArray.length; //1.2.2 MJL
			
			//For each item in the order...
			for (var j = 0; j < currentOrderLineCount; j++)
			{	
				currentPPSItem = j;
				itemObj = orderObj.items[currentPPSItem];

				//Add current item to XML table and set Printed flag to true
				addLineToItemsTable();
				setPPSPrintedFlag(); //1.1.4 MJL

				//If last item of current order, add XML footer
				if (currentPPSItem == (orderObj.items.length - 1))
				{
					createXMLFooter();
					
					//If last sales order, add page break; else create PDF from XML
					if (currentSalesOrder != (orderCount - 1))
					{
						pdfxml += '<pbr />';
					}
					else
					{
						createPDF();
					}
				}	
			}
		}		
	}
	catch (e)
	{
		errorHandler('createXML', e);
	}
}

/**
 * Get the shipping address for the customer and escape for use in XML
 * 
 * 1.2.4 escape addresses for use in XML - MJL
 */
function getCustomerAddress()
{
	try
	{
		//Get customer address and escape for XML
		customerAddress = lookupAddressInfo('customer', orderObj.customerID, true, false, 'addrtext');
		customerAddress = encodeXML(customerAddress); //1.2.4 MJL
		//customerAddress = customerAddress.replace(/&/gi, '&amp;');
		customerAddress = customerAddress.replace(/\n/g, '<br />');
	}
	catch (e)
	{
		errorHandler('getCustomerAddress', e);
	}
}

/**
 * Create XML namespace and BFO doctype for report
 */
function createXMLNamespace()
{
	try
	{
		//Namespace
		pdfxml += '<?xml version="1.0"?>';
		
		//BFO doctype
		pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		
		//Open PDF tag, create file head and open body tag
		pdfxml += '<pdf>';
		pdfxml += '<head>';
		pdfxml += '<meta name="title" value="Packing Slip" />\n';
		pdfxml += '</head>';
		pdfxml += '<body background-color="white" font-size="12" size="A4">';
	}
	catch (e)
	{
		errorHandler('addLineToItemsTable', e);
	}
}

/**
 * Create report header for PDF
 */
function createXMLHeader()
{
	try
	{
		//Create table for header (logo and company address)
		pdfxml += '<table style="width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td><img display="inline" src="' + logoURL + '" /></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px;">&nbsp;</td>';
		pdfxml += '<td><p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: large; font-weight: bold;">Packing Slip</p>';
		pdfxml += '<p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">' + brandAddress + '</p>';
		pdfxml += '</td>';
		pdfxml += '</tr>';
		pdfxml += '</table>';

		//Add line break
		pdfxml += '<br />';
		
		//Report Header (customer no, order no, order date)
		pdfxml += '<table style="width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Account Number: </b>' + orderObj.accNo + '</td>';
		pdfxml += '<td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Order Number: </b>' + orderObj.orderNo + '</td>';
		pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Date: </b>' + orderObj.orderDate + '</td>';
		pdfxml += '</tr>';
		pdfxml += '</table>';
	}
	catch (e)
	{
		errorHandler('createXMLHeader', e);
	}
}

/**
 * Create item table for PDF
 */
function createXMLItemTable()
{
	try
	{
		//Create table header for items
		pdfxml += '<table style="border: thin solid #000000; width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: White; background-color: Black;"><b>Quantity</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: White; background-color: Black;"><b>Item Code</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: White; background-color: Black;"><b>Product Description</b></td>';
		pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; color: White; background-color: Black;"><b>Total</b></td>';
		pdfxml += '</tr>';
	}
	catch (e)
	{
		errorHandler('createXMLItemTable', e);
	}
}

/**
 * Add the current item to the table on the PDF
 */
function addLineToItemsTable()
{
	try
	{
		//Add new line
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;">' + itemObj.quantity + '</td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;">' + itemObj.itemCode + '</td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;">' + itemObj.itemDesc + '</td>';
		pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;">' + parseFloat(itemObj.total).toFixed(2) + '</td>';		
		pdfxml += '</tr>';
	}
	catch (e)
	{
		errorHandler('addLineToItemsTable', e);
	}
}

/**
 * Create report footer for PDF
 * 
 * 1.2.1 added barcode for order number - MJL
 * 1.2.2 ensure that footer is correctly positioned at foot of page - MJL
 */
function createXMLFooter()
{
	try
	{	
		//Complete items table
		pdfxml += '</table><br />';
		
		//1.2.2 Ensure that footer is correctly positioned at foot of page - MJL
		addFooterPositioning();
		
		//Create table for footer
		pdfxml += '<table vertical-align="baseline" style="width:100%;">';
		
			//Top row - Notes
			pdfxml += '<tr>';
				pdfxml += '<td><p style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold;">Notes</p>';
				pdfxml += '<p style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">&nbsp;</p>'; //[TODO] Is this needed?
				pdfxml += '<p></p></td>';
			pdfxml += '</tr>';
			
			//Centre row
			pdfxml += '<tr>';
			
				//Left cell - customer address
				pdfxml += '<td><p style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">' + customerAddress + '</p></td>';
				
				//Centre cell - Barcode
				pdfxml += '<td align="center"><barcode codetype="code128" showtext="true" value="' + orderObj.orderNo + '" /></td>'; //1.2.1 MJL
				
				//Right cell - Return Address
				pdfxml += '<td><p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold;">Return Address</p>';
				pdfxml += '<p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">' + returnAddress + '</p>';
				pdfxml += '<p></p></td>';

			pdfxml += '</tr>';
			
			//Bottom row
			pdfxml += '<tr>';
			
				//Left cell - Delivery Instructions
				pdfxml += '<td><p style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold;">Delivery Instructions</p>';
				pdfxml += '<p style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">&nbsp;</p></td>'; //[TODO] Is this needed?
				
				//Centre cell - blank
				pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px;">&nbsp;</td>';
				
				//Right cell - Customer Account & Order Number
				pdfxml += '<td><p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold;">Customer Account</p>';
				pdfxml += '<p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">' + orderObj.customerRef + '</p>';
				pdfxml += '<p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; font-weight: bold;">Order Number</p>';
				pdfxml += '<p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; ">' + orderObj.orderNo + '</p></td>';
			
			pdfxml += '</tr>';
		
		//Complete footer table
		pdfxml += '</table>';
		
		//Complete footer table
		//pdfxml += '</div>';
	}
	catch (e)
	{
		errorHandler('createXMLFooter', e);
	}
}

/**
 * Create PDF file from XML
 * 
 * @param request
 * @param response
 */
function createPDF()
{
	var debug = false;
	var textfile = null;
	
	try
	{
		//Close XML document
		pdfxml += '</body></pdf>';
		
		if (!debug)
		{
			//Create PDF report
			pdfFile = nlapiXMLToPDF(pdfxml);	
			objResponse.setContentType('PDF', locationName + ' Packing Slips.pdf');	
			objResponse.write(pdfFile.getValue());
		}
		else
		{	
			textfile = nlapiCreateFile('textxml.txt', 'PLAINTEXT', pdfxml);
			objResponse.setContentType('PLAINTEXT', 'testxml.txt');
			objResponse.write(textfile.getValue());
		}

	}
	catch(e)
	{
		errorHandler('createPDF', e);
		errormsg = "<html><body><p>PDF Error: " + e.message +"</p></body></html>";
		objResponse.write(errormsg);
	}
}

/**
 * Get components of the report header
 * 
 * @returns {Boolean}
 */
function getReportHeaderInfo()
{
	var retVal = false;

	try
	{
		//brand = nlapiLookupField('salesorder', salesOrderIntID, 'department');
		brand = salesOrderRecord.getFieldValue('department');
		
		if (brand > 0)
		{
			getLogoURL();
			getCompanyAndReturnAddresses(); //For header
			retVal = true;
		}
	}
	catch (e)
	{
		errorHandler('getReportHeader', e);
	}
	return retVal;
}

/**
 * Get logo URL for relevant brand
 * 
 * 1.2.3 added try-catch block to function - MJL
 */
function getLogoURL()
{
	try
	{
		switch (brand)
		{
			case '1':		//MRF
				logoURL = context.getSetting('SCRIPT', 'custscript_logourl_mrf');
				break;

			case '2':		//DTB
				logoURL = context.getSetting('SCRIPT', 'custscript_logourl_dtb');
				break;

			case '3':		//WLMS
				logoURL = context.getSetting('SCRIPT', 'custscript_logourl_wlms');
				break;

			case '4':		//JHNS
				logoURL = context.getSetting('SCRIPT', 'custscript_logourl_jhns');
				break;

			default:
				break;
		}

		//Encode URL for use in XML
		logoURL = encodeXML(logoURL);
	}
	catch (e)
	{
		errorHandler('getLogoURL', e);
	}
}

/**
 * Get company and return addresses for relevant brand
 * 
 * 1.2.3 added try-catch block to function - MJL
 * 1.2.4 escape addresses for use in XML - MJL
 */
function getCompanyAndReturnAddresses()
{
	try
	{
		switch (brand)
		{
			case '1':		//MRF
				brandAddress = context.getSetting('SCRIPT', 'custscript_compaddr_mrf');
				returnAddress = context.getSetting('SCRIPT', 'custscript_retaddr_mrf');
				break;

			case '2':		//DTB
				brandAddress = context.getSetting('SCRIPT', 'custscript_compaddr_dtb');
				returnAddress = context.getSetting('SCRIPT', 'custscript_retaddr_dtb');
				break;

			case '3':		//WLMS
				brandAddress = context.getSetting('SCRIPT', 'custscript_compaddr_wlms');
				returnAddress = context.getSetting('SCRIPT', 'custscript_retaddr_wlms');
				break;

			case '4':		//Johnsons
				brandAddress = context.getSetting('SCRIPT', 'custscript_compaddr_jhns');
				returnAddress = context.getSetting('SCRIPT', 'custscript_retaddr_jhns');
				break;

			default:
				break;
		}
		
		//1.2.4 escape addresses for use in XML - MJL
		brandAddress = encodeXML(brandAddress);
		returnAddress = encodeXML(returnAddress);
		
		//Convert JS line breaks to XML line breaks
		brandAddress = brandAddress.replace(/\n/g, '<br />');
		returnAddress = returnAddress.replace(/\n/g, '<br />'); 
	}
	catch (e)
	{
		errorHandler('getCompanyAndReturnAddresses', e);
	}
}	


/**
 * Sets Printed flag on current PPS staging record if Allow Reprinting flag is not ticked
 * 
 * 1.1.4 added - MJL
 * 1.2.0 changed to reflect new architecture - MJL
 * 1.2.3 added try-catch block to function - MJL
 */
function setPPSPrintedFlag()
{
	try
	{
		if (allowReprint == 'F')
		{
			//nlapiSubmitField('customrecord_mrf_pickpackship', ppsIDs[currentPPSItem], 'custrecord_pps_printed', 'T');
			nlapiSubmitField('customrecord_mrf_pickpackship', itemObj.ppsId, 'custrecord_pps_printed', 'T'); //1.2.0 MJL
		}
	}
	catch (e)
	{
		errorHandler('setPPSPrintedFlag', e);
	}
}

/**
 * Gets the amount from a specified item on the current Sales Order
 * 
 * @param itemCode
 * @returns {Number}
 */
function getItemTotal(itemCode)
{
	var linenum = 0;
	var total = 0;

	try
	{		
		//Load sales order record from order no.
		//salesOrderRecord = nlapiLoadRecord('salesorder', salesOrderIntID);

		//Find line number of relevant item
		linenum = salesOrderRecord.findLineItemValue('item', 'item', itemCode);
		
		//If item found, get total (Amount)
		if (linenum != -1)
		{
			total = salesOrderRecord.getLineItemValue('item', 'amount', linenum);
		}

		//Parse as decimal and return
		if (total > 0)
		{
			total = parseFloat(total);
		}
	}
	catch (e)
	{
		errorHandler('getItemTotal', e);
	}
	return total;
}

/**
 * Adds a number of line breaks to position footer
 * 
 * [NOTE] formula is y = (x + (20 - 2x)) + 2
 * 
 * 1.2.2 added - MJL
 * 1.2.3 added try-catch block to function - MJL
 */
function addFooterPositioning()
{
	var lineBreakConstant = 20; 
	var lineBreakCount = 0;
	
	try
	{
		//Calculate no. of breaks required
		lineBreakCount = (currentOrderLineCount + (lineBreakConstant - (currentOrderLineCount * 2))) + 2;

		//Print line break for defined no. of times
		for (var i = 0; i < lineBreakCount; i++)
		{
			pdfxml += '<br />';
		}
	}
	catch (e)
	{
		errorHandler('addFooterPositioning', e);
	}
}
/*******************************************************************************************
 * Name:		Modify Sales Order From Calc (modifySOFromCalculation.js)
 * Script Type:	User Event
 * Client:		Mr Fothergills
 *
 * Version:		1.0.0 - 18/03/2013 - First release - JM
 * 				1.0.1 - 05/04/2013 - Bug fix: values default to empty - SB
 * 				1.0.2 - 03 May 2013	- removed reference to custbody_mrf_brandcustomer
 * 
 * Author:		FHL
 * 
 * Purpose:		Alters existing Sales Order info after calculating promotions
 * 				
 * 
 * Script: 		customscript_modifysofromcalculation
 * Deploy: 		customdeploy_modifysofromcalculation
 * 
 * Notes:		deployed as a user event on sales order
 * 
 * Library: 	Library.js
 *******************************************************************************************/

var recType = ''; 

var customerID = 0;
var salesOrderDate = '';
var soShipDate = '';

var itemCount = 0;
var itemObj = new Object();

var soRefNo = '';
var salesOrderID = 0;
var recSalesOrder = null;
var status = '';
var orderSplit = null;			// array for splitting xml out
var orderSplitLines = 0;		// number if lines in split array

var itemsArray = new Array();
var itemsCount = 0;

var offersList = '';
var payloadRecord = null;



/**
 * Main control block - called from deployment record
 * 
 * @param type: event on which the script is run
 */
function modifySOFromCalculation(type)
{
	loadCalculationRecord();

	if(status!='Failed' && salesOrderID!=0)
	{
		getSavings();
		parseXMLSalesOrder();
		alterSalesOrder();
	}
}

/**
 * 
 * loadCalculationRecord
 * 
 */
function loadCalculationRecord()
{
	var recordType = '';	
	var soRefNo = '';

	try
	{
		recordType = nlapiGetRecordType();
		salesOrderID = nlapiGetRecordId();		// load current record
		recSalesOrder = nlapiLoadRecord(recordType, salesOrderID);
		soRefNo= recSalesOrder.getFieldValue('tranid');
		payloadRecordID = genericSearch('customrecord_offerscalculation','custrecord_reference',soRefNo);
		payloadRecord = nlapiLoadRecord('customrecord_offerscalculation', payloadRecordID);
		XMLSalesOrder= payloadRecord.getFieldValue('custrecord_checkoutanswer');
		XMLSalesOrder = UNencodeXML(XMLSalesOrder);
		status = payloadRecord.getFieldValue('custrecord_status');

	}
	catch(e)
	{
		errorHandler("loadCalculationRecord", e);
	}
}

/**
 * get savings
 *   
 */

function getSavings()
{

	try
	{
		XMLSalesOrder= payloadRecord.getFieldValue('custrecord_basketanswer');
		XMLSalesOrder = UNencodeXML(XMLSalesOrder);

		orderSplit = XMLSalesOrder.split('<br>');
		orderSplitLines = orderSplit.length;

		for(var x=0; x<orderSplitLines;x++)
		{
			orderElement = orderSplit[x];
			getOrderHeaderDetails();
		}
	}
	catch(e)
	{
		errorHandler("getSavings", e);
	}

}

/**
 * get Order Header Details
 *   
 */
function getOrderHeaderDetails()
{

	var saving = 0;
	var shipping = 0;
	var shippingSavings = 0;

	try
	{
		if(orderElement.indexOf('<description>')!=-1)
		{
			offersList = offersList + splitOutValue(orderElement,'description');
		}
		if(orderElement.indexOf('<saving>')!=-1)
		{
			saving = splitOutValue(orderElement,'saving');
			saving = FHLFloat(saving);
			saving  = saving.toFixed(2);

			if(saving!=0)
			{
				offersList = offersList + ', saving ' + saving + '\n';
			}
		}

		if(orderElement.indexOf('<shipping>')!=-1)
		{
			shipping = splitOutValue(orderElement,'shipping');
			shipping = FHLFloat(shipping);
			shipping  = shipping.toFixed(2);

			offersList = offersList + '\nShipping total: ' + shipping + '\n';
		}

		if(orderElement.indexOf('<shippingsavings>')!=-1)
		{
			shippingSavings = splitOutValue(orderElement,'shippingsavings');
			shippingSavings = FHLFloat(shippingSavings);
			shippingSavings  = shippingSavings.toFixed(2);

			offersList = offersList + 'Shipping Savings: ' + shippingSavings + '\n';
		}


	}
	catch(e)
	{
		errorHandler("getOrderHeaderDetails", e);
	}

}

/**
 * 
 * parse XML Sales Order 
 * 
 */
function parseXMLSalesOrder()
{

	try
	{

		orderSplit = null;
		XMLSalesOrder= payloadRecord.getFieldValue('custrecord_checkoutanswer');
		XMLSalesOrder = UNencodeXML(XMLSalesOrder);

		orderSplit = XMLSalesOrder.split('<br>');
		orderSplitLines = orderSplit.length;

		for(var x=0; x<orderSplitLines;x++)
		{
			orderElement = orderSplit[x];
			getOrderLineDetails();
		}
	}
	catch(e)
	{
		errorHandler("parseXMLIntoSalesOrderLineArray", e);
	}
}



/**
 * get order item line details
 *   
 */
function getOrderLineDetails()
{
	try
	{
		//========================================
		// items
		//========================================
		if(orderElement.indexOf('<quantity>')!=-1)
		{
			itemObj=new Object();
			itemObj.quantity= splitOutValue(orderElement,'quantity');
			itemObj.location = "";
		}
		if(orderElement.indexOf('<itemcode>')!=-1)
		{
			itemObj.itemCode = splitOutValue(orderElement,'itemcode');
		}

		if(orderElement.indexOf('<description>')!=-1)
		{
			itemObj.description = splitOutValue(orderElement,'description');
		}

		if(orderElement.indexOf('<vatcode>')!=-1)
		{
			itemObj.VATCode = splitOutValue(orderElement,'vatcode');
		}

		if(orderElement.indexOf('<location>')!=-1)
		{
			itemObj.location = splitOutValue(orderElement,'location');
		}

		if(orderElement.indexOf('<priceincvat>')!=-1)
		{
			// this price needs the VAT to be knocked off before posting back - see vatrate tag 
			itemObj.price = splitOutValue(orderElement,'priceincvat');
			itemObj.price = parseFloat(itemObj.price); 
			itemObj.priceIncVAT = itemObj.price; 
		}

		if(orderElement.indexOf('<vatrate>')!=-1)
		{
			itemObj.VATRate = splitOutValue(orderElement,'vatrate');
			itemObj.VATRate = 1 + (parseFloat(itemObj.VATRate) / 100);


			// knock the vat off the price
			if(itemObj.price!=0)
			{
				itemObj.price = itemObj.price / itemObj.VATRate;
			}
		}


		if(orderElement.indexOf('<offerdesc>')!=-1)
		{
			itemObj.offerdesc = splitOutValue(orderElement,'offerdesc');
			itemsArray[itemsCount] = itemObj;
			itemsCount = itemsCount + 1;
		}

	}
	catch(e)
	{
		errorHandler("getOrderLineDetails", e);
	}

}

/**
 * Load sales order and alter info to reflect Tibco Feed calculations
 */
function alterSalesOrder()
{	

	var itemIntID = 0;
	var taxCodeIntID = 0; 

	try
	{
		//Load sales order
		//recSalesOrder = nlapiLoadRecord('salesorder', salesOrderID); // 1.0.1 Already done in loadCalculationRecord()

		// ensure custom entity and brand field are populated

		recSalesOrder.setFieldValue('custbody_savings', offersList);
		populateEntityAndBrand();	

		//Clear item sublist
		removeAllLineItems(recSalesOrder, 'item');

		//Enter new discounted line items
		for (var i = 0; i < itemsArray.length; i++)
		{	
			//Load next item from array
			itemObj = itemsArray[i];

			//Add new line item
			recSalesOrder.selectNewLineItem('item');

			taxCodeIntID = getTaxCodeIntID(itemObj.VATCode);
			itemIntID = genericSearch('item', 'itemid', itemObj.itemCode);


			recSalesOrder.setCurrentLineItemValue('item', 'item', itemIntID);
			recSalesOrder.setCurrentLineItemValue('item', 'custcol_itemdepartment', itemIntID);		// used for 
			recSalesOrder.setCurrentLineItemValue('item', 'quantity', itemObj.quantity);
			recSalesOrder.setCurrentLineItemValue('item', 'description', itemObj.description);
			recSalesOrder.setCurrentLineItemValue('item', 'price', -1);
			recSalesOrder.setCurrentLineItemValue('item', 'rate', itemObj.price);
			recSalesOrder.setCurrentLineItemValue('item', 'taxcode', taxCodeIntID);


			//		recSalesOrder.setCurrentLineItemValue('item', 'custcol_mrf_itemprice', itemObj);//[TODO] Get grossamt for an individual item.

			recSalesOrder.setCurrentLineItemValue('item', 'custcol_offerpriceincvat', itemObj.priceIncVAT);

			if(itemObj.location.length!=0)
			{
				recSalesOrder.setCurrentLineItemText('item', 'location', itemObj.location);
			}


			recSalesOrder.commitLineItem('item');
		}

		nlapiSubmitRecord(recSalesOrder);	
		nlapiLogExecution('AUDIT', 'Sales Order altered', salesOrderID);
	}
	catch(e)
	{
		errorHandler('alterSalesOrder', e);
	}
}

/**
 * ensure Entity And Brand Cust Fields Are Populated
 * and the order source and the order type
 * 1.0.2 - field custbody_mrf_brandcustomer removed
 */
function populateEntityAndBrand()
{

	var customerBrand = '';
	var entity = 0;
	var source = 0;
	var orderType = 0;
	var customForm = 0;
	var userRole = nlapiGetRole();
	var callCentreStaff = '';


	try
	{
		// Call Centre Staff Id
		callCentreStaff = '1015';
		// Get user Role Id
		userRole = nlapiGetRole();
		//Set Enviroment
		enviromentType = 'Sandbox';

		entity = recSalesOrder.getFieldValue('entity');
		customerBrand = nlapiLookupField('customer', entity, 'custentity_mrf_cust_brand');

		//1.0.2 removed
		//recSalesOrder.setFieldValue('custbody_mrf_brandcustomer',entity);
		recSalesOrder.setFieldValue('department',customerBrand);

		source = recSalesOrder.getFieldValue('custbody_mrf_tran_ordersource');
		orderType = recSalesOrder.getFieldValue('custbody_mrf_tran_ordertype');

		// 1.0.1 These will be empty if the order has originated from web
		if(!source)
		{
			recSalesOrder.setFieldValue('custbody_mrf_tran_ordersource', 1); // 1 is web
		}
		if(!orderType)
		{
			recSalesOrder.setFieldValue('custbody_mrf_tran_ordertype', 1);   // 1 is standard
		}	

		
		//Check Environment and Account
		if(getEnvironment() == true && getAccountType() == true)
		{
			// Check if the User is Call Centre Staff
			if(userRole == callCentreStaff)
			{
				//	Set the custom form for SB1 CALL CENTRE STAFF
				switch(parseInt(customerBrand))
				{
				case 1:
					customForm = 162;	// mrf sb1
					break;
				case 2:
					customForm = 165;	// dt brown sb1
					break;
				case 3:
					customForm = 166;	// woolmans sb1
					break;
				case 4:
					customForm = 167;	// johnsons sb1
					break;
				default:
					customForm = 100;	// generic form sb1
				}
			}
			else
			{
				//Set the custom form for SB1
				switch(parseInt(customerBrand))
				{
				case 1:
					customForm = 123;	// mrf sb1
					break;
				case 2:
					customForm = 101;	// dt brown sb1
					break;
				case 3:
					customForm = 102;	// woolmans sb1
					break;
				case 4:
					customForm = 116;	// johnsons sb1
					break;
				default:
					customForm = 100;	// generic form sb1
				}	  
			}
		}
		else
		{
			// Check if the User is Call Centre Staff
			if(userRole == callCentreStaff)
			{
				//Set the custom form for Production & SB2 CALL CENTRE STAFF
				switch(parseInt(customerBrand))
				{
				case 1:
					customForm = 157;	// mrf Production & sb2
					break;
				case 2:
					customForm = 130;	// dt brown Production & sb2
					break;
				case 3:
					customForm = 158;	// woolmans Production & sb2
					break;
				case 4:
					customForm = 159;	// johnsons Production & sb2
					break;
				default:
					customForm = 100;	// generic form Production & sb2
				}
			}
			else
			{
				//Set the custom form for Production & SB2
				switch(parseInt(customerBrand))
				{
				case 1:
					customForm = 144;	// mrf Production & sb2
					break;
				case 2:
					customForm = 101;	// dt brown Production & sb2
					break;
				case 3:
					customForm = 102;	// woolmans Production & sb2
					break;
				case 4:
					customForm = 116;	// johnsons Production & sb2
					break;
				default:
					customForm = 100;	// generic form Production & sb2
				}	  
			}
		}

		recSalesOrder.setFieldValue('customform', customForm);
	}
	catch(e)
	{
		errorHandler('populateEntityAndBrand', e);
	}
}


/**
 * @returns {Boolean}
 * 
 * Check environment
 */
function getEnvironment()
{
	var retVal = false;
	var environment = null;
	var context = null;
	var enviromentType = '';
	
	try
	{
		context = nlapiGetContext();
		environment = context.getEnvironment();

		enviromentType = 'SANDBOX';

		if(environment == enviromentType)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('getEnviroment', e);
	}

	return retVal;
}


/**
 * @returns {Boolean}
 * 
 * Check account type
 */
function getAccountType()
{
	var retVal = false;
	var context = null;
	var company = null;
	var accountType = '';
	
	try
	{
		context = nlapiGetContext();		
		company = context.getCompany();
		
		// Sandbox 1 Account
		accountType = '3322617';// Sandbox 2 '3322617_2'
		
		if(company == accountType)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('getAccountType', e);
	}

	return retVal;
}




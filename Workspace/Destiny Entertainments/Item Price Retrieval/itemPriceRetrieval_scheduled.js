/*****************************************************************************
 *	Name		:	itemPriceRetrieval_scheduled.js
 *  Script Type	:	Scheduled Script - Applied to Item records
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 09/04/2013  First Release - AS
 *					1.0.1 - 23/05/2013 - adding the type of the item into item search filter - AS
 *
 * 	Author		:	FHL 
 * 	Purpose		:	To get the shipping costs from metapack, calculate and setting item prices 
 * 
 *  Script		: customscript_itempriceretrieval_schedule	
 * 	Deploy		: customdeploy_itempriceretrieval_schedule  
 * 
 * 	Library		: library.js
 * 
 ***************************************************************************/
//Declaring global variables
//To get the enabled features for the customer
var context = null;
var multiCurrency = false;
var multiPrice = false;
var quantityPricing = false;

var dateLimit = null;
var today = new Date(); 				//today's date 
var nsToday = null;

var itemRecords = new Array();
var itemColumns = new Array();

var shippingDestinationRecords = new Array();
var shippingDestinationColumns = new Array();

var currencyRateValue = 0;
var currency = 0;
var currencyValidFromDate = null;

var COLUMNNUMBER = 0;

var itemRecord = null;
var basePrice = 0;
var itemIntID = '';
var itemSellingPrice = 0.00;
var itemType = null;
var itemName = '';
var averageCost = 0.0;
var volumetricWeight = 0.0;
var dimension1 = 0;
var dimension2 = 0;
var dimension3 = 0;

var shippingDestinationIntID = 0;
var shippingDestination = '';
var currency = '';
var isoCountryCode = '';
var shippingAddressLine1 = '';
var shippingAddressCity = '';
var shippingAddressPostCode = '';

var username = '';
var password = '';

var alreadyPalletisedGoodsFlag = false;
var consignmentLevelDetailsFlag = false;
var consignmentLevelDetailsFlag = false;
var consignmentValue = 0;
var consignmentWeight =0;
var fragileGoodsFlag = false;
var hazardousGoodsFlag = false;
var liquidGoodsFlag = false;
var insuranceValue = 0.0;
var maxDimension = 0;
var moreThanOneMetreGoodsFlag = false;
var moreThanTwentyFiveKgGoodsFlag = false;
var orderNumber = 0;
var parcelCount = 1;
var dutyPaid = 0.0;
var number = 0;
var parcelDepth = 0.0;
var parcelHeight = 0.0;
var parcelValue = 0.0;
var parcelWeight = 0.0;
var parcelWidth = 0.0;
var reciepientCountryCode = '';
var reciepientLine1 = '';
var reciepientLine2 = '';
var reciepientPostCode = '';
var recipientName ='';
var senderCountryCode = '';
var senderLine1 = '';
var senderLine2 = '';
var senderPostCode = '';
var senderCode = '';
var senderName = '';
var twoManLiftFlag = false;
var calculateTaxAndDuty = false;

var shippingLookupFilters = new Array();
var shippingLookupColumns = new Array();
var shippingLookupResults = null;


var context = null;
var scriptUsageLimit = 0;

var submittedShippingLookupRecord = null;

var postObject = '';

var itemCausedError = false;


/***************************************************************************
 * itemPriceRetrieval Function - The main function
 * 
 **************************************************************************/
function itemPriceRetrieval()
{
	try
	{

		//Call initialiseDates function
		initialise();

		//if those three features are enabled 
		if(multiCurrency == true && multiPrice == true && quantityPricing == true)
		{
			process();
		}

	}
	catch(e)
	{
		errorHandler("itemPriceRetrieval : " , e);
	} 
}



/*****************************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * 
 * 
 ****************************************************************************/
function initialise()
{
	try
	{
		context = nlapiGetContext();										//getting user context

		COLUMNNUMBER = 1;

		username = 'netsuite@electromarket.co.uk';
		//'destinynetsuite';
		password = 'apinetsuite1234';
		//'fu2afrEt';

		//Setting the sender's address details
		senderCountryCode = 'GBR';											
		senderLine1 = 'Unit C7, J31 Park, Motherwell Way, West Thurrock';
		senderLine2 = 'Essex';
		senderPostCode = 'RM20 3XD';
		senderCode = 'DEFAULT';
		senderName = 'DEL';


		multiCurrency = context.getFeature('MULTICURRENCY');				//checking multi-currency feature is enable or not
		multiPrice = context.getFeature('MULTPRICE');						//checking multi-price feature is enable or not
		quantityPricing = context.getFeature('QUANTITYPRICING');			//checking quantity pricing feature is enable or not

		nsToday = jsDate_To_nsDate(today);									// passing today's date to NetSuite date format

		dateLimit = context.getSetting('SCRIPT', 'custscript_datelimit');	//Getting the script parameter

		//if no date limit included, the the date limit is today's date
		if(dateLimit == null)
		{			
			dateLimit = nsToday;							
		}
		nlapiLogExecution('debug', 'dateLimit', dateLimit);
		context = nlapiGetContext();
		scriptUsageLimit = 200;
	}
	catch(e)
	{
		errorHandler('initialise :', e);
	}

}


/*****************************************************************************
 * process Function - do the processes
 *  
 ****************************************************************************/
function process()
{
	try
	{
		getItems();								//calling getItems function
		
		getShippingDestinations();				//calling getShippingDestinations function
		
		getAndSetSellingPriceforEachItem();		//calling getAndSetSellingPriceforEachItem function
	}
	catch(e)
	{

		errorHandler("process : " , e);
	} 


}


/*****************************************************************************
 * getItems Function - get all the items that needs the shipping price to be set
 * 
 * version 1.0.1 - adding the type of the item into item search filter
 *
 ****************************************************************************/
function getItems()
{
	//Declaring the local variables
	var itemFilters = new Array();
	var itemTypes = new Array();		//version 1.0.1

	try
	{
		//version 1.0.1
		itemTypes[0] = 'InvtPart';
		itemTypes[1] = 'Kit';
		itemTypes[2] = 'NonInvtPart';
		itemTypes[3] = 'OthCharge';
		itemTypes[4] = 'Payment';


		//Adding filters  
		itemFilters[0] = new nlobjSearchFilter('isinactive',null, 'is','F');										//filtering by active Items
		itemFilters[1] = new nlobjSearchFilter('custitem_itemprice_lastupdated',null, 'notonorafter',dateLimit);	//filtering by date limit
		itemFilters[2] = new nlobjSearchFilter('type',null, 'anyof',itemTypes);										//filtering by item type	version 1.0.1

		//Getting particular columns in item search results 
		itemColumns[0] = new nlobjSearchColumn('internalid');						//Getting Item's Internal ID
		itemColumns[1] = new nlobjSearchColumn('baseprice');						//Getting Item's base price
		itemColumns[2] = new nlobjSearchColumn('name');								//Getting Item's name
		itemColumns[3] = new nlobjSearchColumn('averagecost');						//getting the average cost of the item
		itemColumns[4] = new nlobjSearchColumn('custitem_volumetricweight');		//getting volumetric weight
		itemColumns[5] = new nlobjSearchColumn('custitem_kitpackavgcost');			//getting average cost of the kit/pacckage
		itemColumns[6] = new nlobjSearchColumn('custitem_dimension1');				//getting Item's dimension1
		itemColumns[7] = new nlobjSearchColumn('custitem_dimension2');				//getting Item's dimension2
		itemColumns[8] = new nlobjSearchColumn('custitem_dimension3');				//getting Item's dimension3

		//Searching the items using filters and columns 
		itemRecords = nlapiSearchRecord('item', null, itemFilters, itemColumns);		

	}
	catch(e)
	{
		errorHandler("getItems : " , e);
	} 
}



/*****************************************************************************
 * getShippingDestinations Function - get all the Shipping Destinations where the items to be shipped
 * 
 ****************************************************************************/
function getShippingDestinations()
{
	//Declaring the local variables
	var shippingDestinationFilters = new Array();

	try
	{
		//Adding filters to search the active shippingDestinations 
		shippingDestinationFilters[0] = new nlobjSearchFilter('isinactive',null, 'is','F');		

		//Getting particular columns in shippingDestination search results 
		shippingDestinationColumns[0] = new nlobjSearchColumn('internalid');						//Getting shipping destination's Internal ID
		shippingDestinationColumns[1] = new nlobjSearchColumn('name');								//Getting shipping destination's name
		shippingDestinationColumns[2] = new nlobjSearchColumn('custrecord_sd_currency');			//getting the internal id of the currency
		shippingDestinationColumns[3] = new nlobjSearchColumn('custrecord_sd_isocountrycode');		//Getting shipping destination's ISO Country code
		shippingDestinationColumns[4] = new nlobjSearchColumn('custrecord_sd_addressline1');		//Getting shipping destination's address line1
		shippingDestinationColumns[5] = new nlobjSearchColumn('custrecord_sd_city');				//Getting shipping destination's city
		shippingDestinationColumns[6] = new nlobjSearchColumn('custrecord_sd_postcode');			//Getting shipping destination's post code

		//Searching the shippingDestinations using filters and columns 
		shippingDestinationRecords = nlapiSearchRecord('customrecord_shipping_destination', null, shippingDestinationFilters, shippingDestinationColumns);		

	}
	catch(e)
	{
		errorHandler("getShippingDestinations : " , e);
	} 
}



/*****************************************************************************
 * getAndSetSellingPriceforEachItem Function - get and set the selling price for each item, each price level and for each destination
 * 
 ****************************************************************************/
function getAndSetSellingPriceforEachItem()
{
	var submittedItemRecord = 0;

	try
	{
		//if items are available
		if(itemRecords != null)
		{


			//looping through each item record
			for(var itemIndex = 0; itemIndex <= itemRecords.length; itemIndex++)
			{
				itemCausedError = false;
				nlapiLogExecution('audit', 'context.getRemainingUsage()', context.getRemainingUsage());

				if(context.getRemainingUsage() <= scriptUsageLimit || (itemIndex == itemRecords.length))
				{
					nlapiLogExecution('audit', 'rescheduling context.getRemainingUsage()', context.getRemainingUsage());

					//reschedule this script.
					nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
					return true;
				}
				else 
				{
					itemIntID = itemRecords[itemIndex].getValue(itemColumns[0]);				//getting Item's internal id
					itemType = itemRecords[itemIndex].getRecordType();							//getting Item's type
					basePrice = itemRecords[itemIndex].getValue(itemColumns[1]);				//getting Item's base price
					itemName = itemRecords[itemIndex].getValue(itemColumns[2]);					//getting Item's name
					volumetricWeight = itemRecords[itemIndex].getValue(itemColumns[4]);			//getting Item's volumetric weight
					dimension1 = itemRecords[itemIndex].getValue(itemColumns[6]);				//getting Item's dimension1
					dimension2 = itemRecords[itemIndex].getValue(itemColumns[7]);				//getting Item's dimension2
					dimension3 = itemRecords[itemIndex].getValue(itemColumns[8]);				//getting Item's dimension3

					//if the item is a Kit/package (Reason : kit package has no standard average cost, hence a custom field has been used)
					if(itemType == 'kititem')
					{
						averageCost = itemRecords[itemIndex].getValue(itemColumns[5]);
					}
					else //if the item is not a kit/package 
					{
						averageCost = itemRecords[itemIndex].getValue(itemColumns[3]);
					}

					if(averageCost == '')
					{
						averageCost = 0.1;
					}

					//The item price calculation is done only for following item types 
					//(Reason : the multi - currency,multi - pricing and quantity pricing is affecting the following types of items )			
					//switch (itemType) 
					//{
					//case 'inventoryitem':
					//case 'kititem':
					//case 'noninventoryitem':
					//	case 'otherchargeitem':
					//case 'paymentitem':

					// NOTE : (basePrice != null) is not working
					//if those records are not empty (NOTE : Without those the SOAP request will not work)
					if(basePrice != '' && (dimension1 != '' && dimension2 != '' && dimension3 != '' && volumetricWeight != ''))  			
					{
						basePrice = convertToFloat(basePrice);				//converting the base price to float value with two decimal points

						itemRecord = nlapiLoadRecord(itemType,itemIntID);	//loading the particular item record

						getPriceLevelAndCurrencyRateForEachDestination();	//calling the getPriceLevelAndCurrencyRateForEachDestination function

						//if no error in creating shipping lookup record
						if(submittedShippingLookupRecord >0)
						{
							//update the field
							itemRecord.setFieldValue('custitem_itemprice_lastupdated', nsToday);
							itemCausedError = false;
							//submitting the item record after setting all the item prices for each destination and for particular price levels 
							submittedItemRecord = nlapiSubmitRecord(itemRecord);
						}
						else
						{
							itemCausedError = true;
						}
					}
					else
					{
						itemCausedError = true;
					}

					//calling updateItemErrorFlag function
					updateItemErrorFlag();

					//	break;
					//}

				}
			}


		}

	}
	catch(e)
	{
		errorHandler("getAndSetSellingPriceforEachItem : " , e);
	} 

}



/**************************************************************************
 * 
 * updateItemErrorFlag - Loads the Item Record and sets the Item Error 
 * Flag, based on the current value of itemCausedError
 * This function also updates the itemprice_lastupdate field to ensure the
 * Item record is not returned in subsequent searches, causing infinte loops
 * 
 **************************************************************************/
function updateItemErrorFlag()
{
	var flagToSet = 'T';

	try
	{
		if(itemCausedError == true)
		{
			flagToSet = 'T';
		}
		else
		{
			flagToSet = 'F';
		}

		itemRecord = nlapiLoadRecord(itemType,itemIntID);
		itemRecord.setFieldValue('custitem_itemprice_lastupdated', nsToday);
		itemRecord.setFieldValue('custitem_haserror', flagToSet);

		submittedItemRecord = nlapiSubmitRecord(itemRecord);
	}
	catch(e)
	{
		errorHandler('updateItemErrorFlag', e);
	}

}

/*****************************************************************************
 * getPriceLevelAndCurrencyRateForEachDestination Function - get price level and currency rate for each destination
 * 
 ****************************************************************************/
function getPriceLevelAndCurrencyRateForEachDestination()
{
	var currencyRateFound = false;

	try
	{
		if(shippingDestinationRecords != null)
		{
			//looping through shipping destinations
			for(var index = 0; index < shippingDestinationRecords.length; index++)
			{
				shippingDestinationIntID = shippingDestinationRecords[index].getValue(shippingDestinationColumns[0]);		//getting shipping destination's internal id
				shippingDestination = shippingDestinationRecords[index].getValue(shippingDestinationColumns[1]);			//getting shipping destination's name
				currency = shippingDestinationRecords[index].getValue(shippingDestinationColumns[2]);						//getting shipping destination's currency
				isoCountryCode = shippingDestinationRecords[index].getValue(shippingDestinationColumns[3]);					//getting shipping destination's iso country code
				shippingAddressLine1 = shippingDestinationRecords[index].getValue(shippingDestinationColumns[4]);			//getting shipping destination's address line1
				shippingAddressCity = shippingDestinationRecords[index].getValue(shippingDestinationColumns[5]);			//getting shipping destination's address city
				shippingAddressPostCode = shippingDestinationRecords[index].getValue(shippingDestinationColumns[6]);		//getting shipping destination's post code

				//calling getCurrencyExchangeRate function
				currencyRateFound = getCurrencyExchangeRate(currency);

				//if currency rate is found
				if(currencyRateFound == true)
				{
					//calling the findPriceLevelInItemRecord function for the 'normal' price levels
					findPriceLevelInItemRecord(shippingDestination, 'NET',currency);

					//calling the findPriceLevelInItemRecord function for the 'including delivery' price levels
					findPriceLevelInItemRecord(shippingDestination, 'NET inc Del',currency);

				}
			}
		}

	}
	catch(e)
	{
		errorHandler("forEachShippingDestination : " , e);
	} 

}



/*****************************************************************************
 * getCurrencyExchangeRate Function - get the currency exchange rate and the currance rate 'valid from date' for each destination
 * 
 * @param shippingDestinationCurrency	-  currency of the shipping destination
 * @returns {Boolean}					-  whether the currency is found in the 'currency lookup' custom record set 
 * 
 ****************************************************************************/
function getCurrencyExchangeRate(shippingDestinationCurrency)
{
	//Declaring the local variables
	var currencyRateAndValidFromDate = null;			//NOTE : not returning an array, returns a String/ Object
	var currencyLookupRecordIntID = 0;
	var fieldsToReturn = new Array();					//the field need to be retrieved
	var foundFlag = false;

	try
	{
		currencyLookupRecordIntID = genericSearch('customrecord_currencyratelookup', 'custrecord_cr_currency', shippingDestinationCurrency);
		//genericSearchReturnAnyField('customrecord_currencyratelookup', 'custrecord_cr_currency', shippingDestinationCurrency, 'internalid');

		//if the currency is found in the 'Currency lookup' records
		if(currencyLookupRecordIntID > 0)
		{
			foundFlag = true;							//setting the flag to true

			//setting what fields need to be returned
			fieldsToReturn[0] = 'custrecord_cr_rate';			//currency rate
			fieldsToReturn[1] = 'custrecord_cr_validfrom';		//valid from date

			//getting the currency rate and the valid from date form the 'Currency Rate Lookup' record as an Objest
			currencyRateAndValidFromDate = nlapiLookupField('customrecord_currencyratelookup', currencyLookupRecordIntID, fieldsToReturn ,false);

			//calling splitCurrencyFieldsObject function
			splitCurrencyFieldsObject(currencyRateAndValidFromDate);
		}

	}
	catch(e)
	{
		errorHandler("getCurrencyExchangeRate : " , e);
	} 

	return foundFlag;			//returning the flag value
}




/**********************************************************************
 * splitCurrencyFields Function - splitting the string/object to separate the currency fields' values
 * 
 * @param currencyFieldsObject	- the string object that includes the currancy rateand the valid from date 
 * 
 **********************************************************************/
function splitCurrencyFieldsObject(currencyFieldsObject)
{
	try
	{
		//separating and getting particular returned fields
		currencyRateValue = currencyFieldsObject['custrecord_cr_rate'];
		currencyValidFromDate = currencyFieldsObject['custrecord_cr_validfrom'];
		currencyRateValue = convertToFloat(currencyRateValue);						//passing the currency rate value to float with two decimal points
	}
	catch(e)
	{
		errorHandler("splitCurrencyFields : " , e);
	} 

}


/*****************************************************************************
 * findPriceLevelInItemRecord Function - find price level for each destination for each item
 * 
 * @param shippingDestination	- shipping destination name (example : DE , UK)
 * @param stringToAdd			- string to add to make the price level name (either 'NET' or 'Net inc Del')
 * @param currencyIntID			- internal id of the currency of the particular destination

 ****************************************************************************/
function findPriceLevelInItemRecord(shippingDestination , stringToAdd, currencyIntID)
{
	var pricingSublistPriceLevelLineNo = 0;
	var pricingSublistIntId = 0;
	var itemPrice = 0;
	var priceLevelIntID = 0;
	var minimumShippingCost = 0;
	var priceLevelName = '';

	try
	{
		//making the price level name (Example : DE NET , DE NET inc Del)
		priceLevelName = shippingDestination + ' ' + stringToAdd;

		//getting the internal id of the particular price level name 
		priceLevelIntID  = genericSearch('pricelevel', 'name', priceLevelName);


		/**********************************************************
		 * //making the internal id of the price level sublist
		 * NOTE : The price level sublist's internal id has the format of the price2, price6;
		 * where 2 and 6 are the internal ids of the currency which can be found in List > Accounting > Currencies 
		 *********************************************************/
		pricingSublistIntId = 'price' + currencyIntID;


		//searching  and getting the line item no of the particular price level name in the particular pricing sublist
		pricingSublistPriceLevelLineNo = itemRecord.findLineItemValue(pricingSublistIntId, 'pricelevel', priceLevelIntID);

		//if the price level name found in the pricing sublist
		if(pricingSublistPriceLevelLineNo >0)
		{
			//if the price level is for normal prices (example : DE NET)
			if(stringToAdd == 'NET')
			{
				itemPrice = calculateItemCost();					//calling calculateItemCost function

			}
			else	//if the price level is for delivery prices (example : DE NET inc Del)
			{
				minimumShippingCost = getPriceFromMetapack();							//calling getPriceFromMetapack function
				nlapiLogExecution('audit', 'minimumShippingCost', minimumShippingCost);

				if(minimumShippingCost != 0)
				{
					itemPrice = calculateItemDelCost(minimumShippingCost);				//callinng calculateItemDelCost function
					createShippingRecord(minimumShippingCost);										//calling createShippingRecord function

				}

			}

			//calling setParticularPriceLevelValue function
			setParticularPriceLevelValue(pricingSublistIntId,pricingSublistPriceLevelLineNo,itemPrice);

		}

	}
	catch(e)
	{
		errorHandler('setParticularPriceLevelValue', e);
	}

}



/*****************************************************************************
 * calculateItemCost Function - calculate the cost of the items (without delivery)
 * 
 * @returns {Number}	- item price
 * 
 ****************************************************************************/
function calculateItemCost()
{
	//declaring local variables
	var itemPrice = 0.0;

	try
	{
		itemPrice = (basePrice * currencyRateValue);		
		itemPrice = convertToFloat(itemPrice);			//passing the item Price in t float value with two decimal points

	}
	catch(e)
	{
		errorHandler("calculateItemCost : " , e);
	} 

	return itemPrice;			//returning the item price
}



/*****************************************************************************
 * getPriceFromMetapack Function - get the delivery price from Metapack using SOAP
 * 
 * @returns {Number} 	- minimum shipping cost
 * 
 ****************************************************************************/
function getPriceFromMetapack()
{
	var responseObject = null;
	var body = '';
	var xmlBody = '';
	var parentNodes = null;
	var childNodes = null;
	var shippingCharge = new Array();
	var shippingCost = new Array();
	var minShippingCost = 0;
	var name = '';
	var indexOfWord = 0;

	var errorBody = 0;
	try
	{
		makeSoapRequiredData();					//calling makeSoapRequiredData function
		responseObject = sendSoapRequest();		//calling sendSoapRequest function

		//if any response from the Metapack
		if(responseObject != null)
		{
			//getting the body of the results
			body = responseObject.getBody();

			//passing the body to xml format in order to use the xml functions (Reason - the results are not in actual XML format)
			xmlBody = nlapiStringToXML(body);

			nlapiLogExecution('audit', 'itemIntID', itemIntID);
			nlapiLogExecution('audit', 'xmlBody', body);

			//getting the Parent Nodes of the 'findDeliveryOptionsReturn/findDeliveryOptionsReturn' path
			parentNodes = nlapiSelectNodes(xmlBody, '//findDeliveryOptionsReturn/findDeliveryOptionsReturn');

			nlapiLogExecution('audit', 'parentNodes.length', parentNodes.length);
			//if xmlBody is null (error) in the results
			if(parentNodes.length > 0)
			{
				//going through each parent node
				for(var i = 0; i < parentNodes.length; i++)
				{ 
					//getting the child nodes in order to count the no of child nodes in particular Parent Node
					childNodes = parentNodes[i].childNodes;

					//if there are child nodes
					if(childNodes.length > 0)
					{				
						name = nlapiSelectValue(parentNodes[i], 'name');			//getting the value of the Child Node called 'name'
						indexOfWord = name.indexOf('Letter');						//getting the index of the 'Letter' word in the name

						//if the word 'Letter'  is not found in the value of the 'name' child node (Reason : items are not send as letters)
						if( indexOfWord < 0)
						{
							shippingCharge[i] = nlapiSelectValue(parentNodes[i], 'shippingCharge');			//getting the value of the node called 'shippingCharge'
							shippingCost[i] = nlapiSelectValue(parentNodes[i], 'shippingCost');				//getting the value of the node called 'shippingCost'

						}

					}

				}	

				//getting the minimum shipping cost
				minShippingCost = Math.min.apply(Math , shippingCost);	

				nlapiLogExecution('audit', 'Metapack soap minShippingCost', minShippingCost);
			}
			else
			{
				minShippingCost = 0;
			}

		}

	}
	catch(e)
	{
		errorHandler("getPriceFromMetapack : " , e);
	} 

	return minShippingCost;

}



/*****************************************************************************
 * makeSoapRequiredFields Function - make the fields that are required in the SOAP request to Metapack
 * 
 ****************************************************************************/
function makeSoapRequiredData()
{
	try
	{

		//passing the values to floats inorder to make the calculations
		dimension1 = parseFloat(dimension1);
		dimension2 = parseFloat(dimension2);
		dimension3 = parseFloat(dimension3);

		//get the max dimension
		maxDimension = Math.max(dimension1,dimension2,dimension3);
		maxDimension = parseFloat(maxDimension);
		//setting the flag if the max Dimension is greater than 1 metre
		if(maxDimension > 1)
		{
			moreThanOneMetreGoodsFlag = true;
		}

		consignmentValue = parseFloat(averageCost);
		consignmentWeight = parseFloat(volumetricWeight);
		consignmentWeight = parseFloat(consignmentWeight);

		if(consignmentWeight > 25 )
		{
			moreThanTwentyFiveKgGoodsFlag = true;
		}

		orderNumber = 1;
		number = parseInt(number,0);
		insuranceValue = parseFloat(insuranceValue);
		parcelDepth = parseFloat(dimension1);
		parcelHeight = parseFloat(dimension2);
		parcelValue = parseFloat(averageCost);
		parcelWeight = parseFloat(volumetricWeight);
		parcelWidth = parseFloat(dimension3);

		//getting the country code of the reciepient from the 'ISO Country' custom record set
		reciepientCountryCode = nlapiLookupField('customrecord_isocountry', isoCountryCode, 'custrecord_ic_a3');

		reciepientLine1 = shippingAddressLine1;
		reciepientLine2 = shippingAddressCity;
		reciepientPostCode = shippingAddressPostCode;

		recipientName = 'Recipient A';

	}
	catch(e)
	{
		errorHandler("makeSoapRequiredFields : " , e);
	} 

}



/*****************************************************************************
 * sendSoapRequest Function - sending the soap request to metapack
 * 
 * @returns - response object
 ****************************************************************************/
function sendSoapRequest()
{

	//declaring local variables
	var soapHeaders = new Array();
	var responseObject = null; 
	var recievingUrl = '';
	var encodedCredentials = '';

	try
	{
		//passing the credentials to Base 64 in order to pass trough SOAP
		encodedCredentials = nlapiEncrypt(username + ":" + password, 'base64');

		// build SOAP request
		buildSOAPRequest();

		//initialising SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['User-Agent-x'] = 'SuiteScript-Call';
		soapHeaders['Authorization'] = 'Basic ' + encodedCredentials;
		soapHeaders['soapAction'] = ' ';

		//wsdl url of the destiny's qa account in metapack
		recievingUrl = 'http://dm-api.metapack.com/api/4.x/services/AllocationService?wsdl';
		//'http://dm-qa.metapack.com/api/4.x/services/AllocationService?wsdl';

		//connecting to the metapack by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(recievingUrl,postObject,soapHeaders,'POST');

	}
	catch(e)
	{
		errorHandler("sendSoapRequest : " , e);
	} 

	return responseObject;	

}



/*****************************************************************************
 * calculateItemDelCosts Function - calculate the cost of the items WITH delivery
 * 
 * @param shippingCost 	- minimum shipping cost retrieved from Metapack 
 * @returns {Number}	- item price with delivery
 ****************************************************************************/
function calculateItemDelCost(shippingCost)
{
	var itemPriceWithDel = 0.0;

	try
	{
		itemPriceWithDel = parseFloat(basePrice) + parseFloat(shippingCost);		
		itemPriceWithDel = itemPriceWithDel * currencyRateValue;						
		itemPriceWithDel = convertToFloat(itemPriceWithDel);							//passing the item price to float value with two decimal points

	}
	catch(e)
	{
		errorHandler("calculateItemDelCost : " , e);
	} 

	return itemPriceWithDel;

}




/*****************************************************************************
 * createShippingRecord Function - create the 'Shipping Lookup' record
 * 
 * @param itemPrice	- item price
 ****************************************************************************/
function createShippingRecord(shippingCost)
{
	//declaring local variables
	var shippingLookupRecord = null;
	var shippingLookupRecordIntID = 0;

	try
	{
		searchShippingLookupRecord(itemIntID,shippingDestinationIntID);


		//no records
		if(shippingLookupResults == null)
		{
			shippingLookupRecord = nlapiCreateRecord('customrecord_shippinglookup');					//creating the new shipping lookup record
		}
		else // if exist, then update the existing
		{
			//getting the internal ID of the existing shipping lookup record
			shippingLookupRecordIntID = shippingLookupResults[0].getValue(shippingLookupColumns[0]);			//internal ID
			shippingLookupRecord = nlapiLoadRecord('customrecord_shippinglookup', shippingLookupRecordIntID);
		}

		shippingLookupRecord.setFieldValue('custrecord_sl_item', itemIntID);						//setting the field value for item
		shippingLookupRecord.setFieldValue('custrecord_sl_destination', shippingDestinationIntID);	//setting the field value for shipping destination
		shippingLookupRecord.setFieldValue('custrecord_sl_cost', shippingCost);						//setting the cost for destiny
		shippingLookupRecord.setFieldValue('custrecord_sl_charge', shippingCost);							//setting the charge from the customer
		shippingLookupRecord.setFieldValue('custrecord_sl_currency', currency);						//setting the currency

		submittedShippingLookupRecord = nlapiSubmitRecord(shippingLookupRecord);					//saving the shipping lookup record

	}
	catch(e)
	{
		errorHandler('createShippingRecord', e);
	}
}






/*****************************************************************************
 * setParticularPriceLevelValue Function - set the calculated item price in the particular price level in particular pricing sublist
 * 
 * @param pricingSublistIntId			- internal id of the pricing sublist
 * @param pricingSublistLineItemLineNo	- line item no of the particular price level
 * @param itemCost						- cost of the item 			
 ****************************************************************************/
function setParticularPriceLevelValue(pricingSublistIntId,pricingSublistLineItemLineNo, itemPrice)
{
	try
	{
		nlapiLogExecution('audit', 'itemprice', itemPrice);
		//selecting the particular line item
		itemRecord.selectLineItem(pricingSublistIntId, pricingSublistLineItemLineNo);

		//setting the item price of the item in to current line item in the 'Qty0' column
		itemRecord.setCurrentLineItemMatrixValue(pricingSublistIntId, 'price', COLUMNNUMBER, itemPrice);

		//submitting the price sublist line item
		itemRecord.commitLineItem(pricingSublistIntId);

	}
	catch(e)
	{
		errorHandler('setParticularPriceLevelValue', e);
	}

}

/*****************************************************************************
 * build SOAP Request string
 ****************************************************************************/

function buildSOAPRequest()
{

	try
	{

		postObject = 
			'<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			'<soapenv:Body>'+
			'<ns1:findDeliveryOptions soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="urn:DeliveryManager/services">'+
			'<consignment xsi:type="ns2:Consignment" xmlns:ns2="urn:DeliveryManager/types">'+
			'<alreadyPalletisedGoodsFlag xsi:type="xsd:boolean">' + alreadyPalletisedGoodsFlag + '</alreadyPalletisedGoodsFlag>'+
			'<cardNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierConsignmentCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			' <carrierName xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierServiceCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierServiceName xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<cartonNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<consignmentCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<consignmentLevelDetailsFlag xsi:type="xsd:boolean">' + consignmentLevelDetailsFlag + '</consignmentLevelDetailsFlag>'+
			'<consignmentValue xsi:type="xsd:double">' + consignmentValue + '</consignmentValue>'+
			'<consignmentWeight xsi:type="xsd:double">' +consignmentWeight+'</consignmentWeight>'+

			' <custom1 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom10 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+	
			'<custom2 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom5 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom6 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom7 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom8 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom9 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<cutOffDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			//'<deliveryPrice xsi:type="xsd:double" xsi:nil="true"/>'+
			'<despatchDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<earliestDeliveryDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<fragileGoodsFlag xsi:type="xsd:boolean">'+fragileGoodsFlag+'</fragileGoodsFlag>'+
			'<guaranteedDeliveryDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<hazardousGoodsFlag xsi:type="xsd:boolean">'+hazardousGoodsFlag+'</hazardousGoodsFlag>'+

			'<insuranceValue xsi:type="xsd:double">'+insuranceValue+'</insuranceValue>'+
			'<liquidGoodsFlag xsi:type="xsd:boolean">'+liquidGoodsFlag+'</liquidGoodsFlag>'+
			'<maxDimension xsi:type="xsd:double">'+maxDimension+'</maxDimension>'+
			'<moreThanOneMetreGoodsFlag xsi:type="xsd:boolean">'+moreThanOneMetreGoodsFlag+'</moreThanOneMetreGoodsFlag>'+
			'<moreThanTwentyFiveKgGoodsFlag xsi:type="xsd:boolean">'+moreThanTwentyFiveKgGoodsFlag+'</moreThanTwentyFiveKgGoodsFlag>'+
			'<orderNumber xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+orderNumber+'</orderNumber>'+

			'<parcelCount xsi:type="xsd:int">'+parcelCount+'</parcelCount>'+
			'<parcels soapenc:arrayType="ns2:Parcel[1]" xsi:type="soapenc:Array" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+
			'<item xsi:type="ns2:Parcel">'+
			'<code xsi:type="soapenc:string" xsi:nil="true"/>'+
			'<dutyPaid xsi:type="xsd:double">'+dutyPaid+'</dutyPaid>'+
			'<number xsi:type="xsd:int">'+number+'</number>'+
			'<parcelDepth xsi:type="xsd:double">'+parcelDepth+'</parcelDepth>'+
			'<parcelHeight xsi:type="xsd:double">'+parcelHeight+'</parcelHeight>'+
			'<parcelValue xsi:type="xsd:double">'+parcelValue+'</parcelValue>'+
			'<parcelWeight xsi:type="xsd:double">'+parcelWeight+'</parcelWeight>'+
			'<parcelWidth xsi:type="xsd:double">'+parcelWidth+'</parcelWidth>'+
			'<products xsi:type="ns2:Product" xsi:nil="true"/>'+
			'</item>'+
			'</parcels>'+

			'<pickTicketNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<pickupPoint xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<podRequired xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<properties xsi:type="ns2:Property" xsi:nil="true"/>'+

			'<recipientAddress xsi:type="ns2:Address">'+
			'<countryCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+reciepientCountryCode+'</countryCode>'+
			'<line1 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+reciepientLine1+'</line1>'+
			'<line2 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+reciepientLine2+'</line2>'+
			'<line3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<line4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<postCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+reciepientPostCode+'</postCode>'+
			'<type xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'</recipientAddress>'+

			'<recipientCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientContactPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientEmail xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientMobilePhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientName xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+recipientName+'</recipientName>'+						'<recipientNotificationType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientVatNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			'<senderAddress xsi:type="ns2:Address">'+
			'<countryCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderCountryCode+'</countryCode>'+
			'<line1 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderLine1+'</line1>'+
			'<line2 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderLine2+'</line2>'+
			'<line3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<line4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<postCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderPostCode+'</postCode>'+
			'<type xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'</senderAddress>'+

			'<senderCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderCode+'</senderCode>'+
			'<senderContactPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderEmail xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderMobilePhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderName xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+senderName+'</senderName>'+
			'<senderNotificationType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderVatNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			'<shipmentTypeCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<shippingAccount xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<signatoryOnCustoms xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<specialInstructions1 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<specialInstructions2 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<status xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<termsOfTradeCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<transactionType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<twoManLiftFlag xsi:type="xsd:boolean">'+twoManLiftFlag+'</twoManLiftFlag>'+

			'</consignment>'+

			'<filter xsi:type="ns3:AllocationFilter" xsi:nil="true" xmlns:ns3="urn:DeliveryManager/types"/>'+

			'<calculateTaxAndDuty xsi:type="xsd:boolean"> '+calculateTaxAndDuty+' </calculateTaxAndDuty>'+

			'</ns1:findDeliveryOptions>'+
			'</soapenv:Body>'+
			'</soapenv:Envelope>';


	}
	catch(e)
	{
		errorHandler('buildSOAPRequest', e);
	}


}




/**********************************************************************
 * searchShippingLookupRecord Function - search for shipping lookup record
 * 
 **********************************************************************/
function searchShippingLookupRecord(itemIntID,shippingDestinationIntID)
{


	try
	{
		shippingLookupFilters[0] = new nlobjSearchFilter('custrecord_sl_item', null, 'is', itemIntID);						//filter by item
		shippingLookupFilters[1] = new nlobjSearchFilter('custrecord_sl_destination', null, 'is', shippingDestinationIntID);		//filter by destination

		shippingLookupColumns[0] = new nlobjSearchColumn('internalid');
		shippingLookupColumns[1] = new nlobjSearchColumn('custrecord_sl_charge');

		shippingLookupResults = nlapiSearchRecord('customrecord_shippinglookup', null, shippingLookupFilters, shippingLookupColumns);

	}
	catch(e)
	{
		errorHandler('searchShippingLookupRecord', e);
	}

	return shippingLookupResults;
}


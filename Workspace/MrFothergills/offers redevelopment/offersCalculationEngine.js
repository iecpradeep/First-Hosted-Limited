/*************************************************************************************
 * Name:		offersCalculationEngine.js
 * Script Type:	User Event
 *
 * Version:		1.0.1 - 1st release 5/3/2013 - JM
 * 				1.0.2 - Fix array out of bounds bug, incorrect error handler and case where no partner ID - SB
 * 				1.0.3 - Removed validation check for customer being in a campaign - JM
 * 				1.0.4 - enable spend over for a group and get £x off the whole order
 *
 * Author:		FHL
 * 
 * Purpose:		Calculate discounts, pricing, VAT and shipping
 * 
 * Script: 		customscript_offerscalculationengine 
 * Deploy: 		customdeploy_offerscalculationengine
 * 				customdeploy_offerscalctriggeredfromsale
 * 
 * Notes:		the prices that are in the payload field are assumed to include VAT
 * 				and will have already been subjected to price break calculations from
 * 				the BOS and web
 * 
 * Library: 	offersLibrary.js & library.js
 *************************************************************************************/

//offer types
var SPENDOVER = '';
var LINEQUANTITY = '';
var PICKANDMIX = '';
var CAMPAIGNSAVEDSEARCH = '';


//payload
var payloadRecordID = 0;
var payloadRecord = null;
var status = '';

//header
var	orderDate = null;
var	customer = "";
var	reference = "";
var	campaign = "";
var partner = "";

//items
var itemsArrayCopy = new Array();	
var itemsArray = new Array();	
var itemObj = new Object();		
var itemsCount = 0;				
var orderSplit = null;			
var orderSplitLines = 0;		
var type = '';					
var itemImage = '';				
var VATRate = 0;
var VATCode = '';
var pricesIncludeTax = 'T';	
var storedisplayname = '';
var basePrice = 0;
var itemCodeLookedUp = '';

//XML
var XMLCalcBasket = '';
var XMLCalcCheckOut = '';
var XMLError = '';
var XMLWorkings = '';
var breakTag = '<br>';
var XMLSalesOrder = '';
var tagXMLstart = "&lt;";
var tagXMLend = "&gt;";

//calculation
var qualifyItemsArray = new Array();
var getItemsArray = new Array();
var successDesc = 'Processed';
var getQuantityItems = 0;

//offers
var offerRecord = null;
var applicableOffers = [];			


//basket & checkout
var savings = new Array();
var saving = new Object();
var totalSavings = 0;
var grandTotal = 0;
var reference = 'tba';
var checkOut = '';
var savingsCount = 0;

//shipping
var shipDestination = '';
var eu = '';
var shipBandItemID = 0;
var shipBandItemEUID = 0;
var shipBandIDs = new Array();
var shipBandIDsDeDup = new Array();
var shippingTotal = 0;
var itemBasePrice = 0;
var freePP = 'F';
var offerApplied = false;
var freePostPack = 'F';
var totalShippingSavings = 0;
var postPackPrice = 0;

var derivedCampaignCode = '';
var brandIntID = 0;

/******************************************************
 * offersCalculationEngine - MAIN
 * 
 * 
 * 
 *****************************************************/

function offersCalculationEngine()
{

		
	initialise();
	loadCalculationRecord();
	if(status!='Processed' && status!='Failed')
	{
		parseXMLSalesOrder();								// split xml into vars and array
		if(loadOffersAssociatedWithCampaign()==true);		// filters by brand also
		{
			loopThruOffersDeterminingWhichApply();
		}
		writeAnswers();
	}
}

/**
 * 
 * initialise
 * 
 */
function initialise()
{
	try
	{
		SPENDOVER = 'Spend Over Offer';
		LINEQUANTITY = 'Line Quantity Offer';
		PICKANDMIX = 'Pick and Mix Offer';

		CAMPAIGNSAVEDSEARCH = 'customsearch_latestcampaigns';

		// [TODO] remove hard coding
		eu = new Array('AT','BE','BG','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IE','IT','LV','LT','LU','MT','NL','PL','PT','RO','SK','SI','ES','SE');

	}
	catch(e)
	{
		errorHandler("initialise", e);
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
	var salesRecordID = 0;
	var salesRecord = null;

	try
	{
		recordType = nlapiGetRecordType();

		// if the user event has been triggered from the sale, lookup the tranid
		// so we can lookup the calc record
		if(recordType=='salesorder')
		{
			salesRecordID = nlapiGetRecordId();		// load current record
			salesRecord = nlapiLoadRecord(recordType, salesRecordID);
			soRefNo= salesRecord.getFieldValue('tranid');
			payloadRecordID = genericSearch('customrecord_offerscalculation','custrecord_reference',soRefNo);
		}
		else
		{
			// this is the event being triggered from a calc save
			payloadRecordID = nlapiGetRecordId();		// load current record	
		}

		payloadRecord = nlapiLoadRecord('customrecord_offerscalculation', payloadRecordID);
		XMLSalesOrder= payloadRecord.getFieldValue('custrecord_payload');
		XMLSalesOrder = UNencodeXML(XMLSalesOrder);
		status = payloadRecord.getFieldValue('custrecord_status');
	}
	catch(e)
	{
		errorHandler("loadCalculationRecord", e);
	}
}


/**
 * 
 * loopThruOffersDeterminingWhichApply
 * 
 */
function loopThruOffersDeterminingWhichApply()
{
	var offerIntID = 0;
	var offerType = '';

	try
	{
		for(var x=0; x<applicableOffers.length; x++)
		{
			offerIntID = applicableOffers[x];

			if(loadOffer(offerIntID)==true)
			{
				offerType = offerRecord.getFieldText('custrecord_m_offer_type');
				offerApplied = false;

				// offer type determines calculation
				if(offerType == SPENDOVER)
				{
					dealWithSpendOverOffer();
				}
				if(offerType == LINEQUANTITY)
				{
					dealWithLineQuantityOffer();
				}
				if(offerType == PICKANDMIX)
				{
					dealWithPickAndMixOffer();
				}

				applyFreePP();		// need to check per offer type

			}
		}

		dealWithShipping();
		createWorkingsXML();
		workOutBasketDetail();
		workOutCheckOutDetail();
	}
	catch(e)
	{
		errorHandler("loopThruOffersDeterminingWhichApply", e);
	}
}

/**
 * 
 * deal With Line Quantity Offer
 * 
 */
function dealWithLineQuantityOffer()
{
	try
	{
		if(markBuyAndGetItems()==true)
		{
			sortItems();
			allocateBuyAndGetQuantities();
		}
	}
	catch(e)
	{
		errorHandler("dealWithLineQuantityOffer", e);
	}
}

/**
 * 
 * allocate buy and get item quantities 
 * 
 */

function allocateBuyAndGetQuantities()
{
	var retVal = false;
	var buyQuantity = 0;
	var qualify = 0;
	var processing = true;
	var lineCount = 0;

	try
	{
		buyQuantity = offerRecord.getFieldValue('custrecord_offerbuythisqty');	// the amount to buy to qualify 
		getQuantityItems = offerRecord.getFieldValue('custrecord_offergetthisfreeqty');	// the amount of get


		while(processing==true)
		{
			if(lineCount<=itemsArray.length-1)
			{
				itemObj = itemsArray[lineCount];

				if(itemObj.startQuantity>0 && itemObj.buyQualify==true)
				{
					qualify = qualify + parseInt(itemObj.startQuantity);
					itemObj.startQuantity = 0;

					if(qualify < buyQuantity)
					{
						itemsArray[lineCount] = itemObj;	 
					}

					if(qualify == buyQuantity)
					{
						qualify=0;		// start again
						itemsArray[lineCount] = itemObj;	 
						qualifyTotalHitSoAllocateTheGetQuantity();
					}

					if(qualify > buyQuantity)
					{
						itemObj.startQuantity = parseInt(itemObj.startQuantity) + (qualify - buyQuantity);
						qualify=0;		// start again
						itemsArray[lineCount] = itemObj;	 
						qualifyTotalHitSoAllocateTheGetQuantity();
						lineCount = lineCount - 1;		// need to revisit this line as there's some left
					}
				}
			}
			else
			{
				processing = false;
			}
			lineCount = lineCount + 1;
		}
	}
	catch(e)
	{
		errorHandler("allocateBuyAndGetQuantities", e);
	}

	return retVal;
}


/**
 * 
 * allocate buy and get item quantities for pick and mix 
 * 
 */

function determineIfPickAndMixQtyHit()
{
	var retVal = false;
	var buyQuantity = 0;
	var qualify = 0;

	try
	{
		buyQuantity = offerRecord.getFieldValue('custrecord_offerbuythisqty');	// the amount to buy to qualify 

		for(var x=0; x<itemsArray.length; x++)
		{
			itemObj = itemsArray[x];

			if(itemObj.startQuantity>0 && itemObj.buyQualify==true)
			{
				qualify = qualify + parseInt(itemObj.startQuantity);

				if(qualify >= buyQuantity)
				{
					retVal = true;
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("determineIfPickAndMixQtyHit", e);
	}

	return retVal;
}

/**
 * set Prices For Pick And Mix
 * 
 */

function setPricesForPickAndMix()
{
	var itemPrice = 0;
	var offerPrice = 0;

	try
	{
		for(var x=itemsArray.length-1; x>=0;x--)
		{
			itemObj = itemsArray[x];

			// look for the 1st get item that has a quantity left

			if(itemObj.buyQualify == true && parseInt(itemObj.startQuantity)>0)
			{
				itemObj.getQuantity = itemObj.startQuantity;
				itemObj.startQuantity = 0;

				itemObj.offerDescription = offerRecord.getFieldValue('name');
				itemObj.offerImage = offerRecord.getFieldValue('custrecord_promo_image');

				//==========================================
				// work out the offer price
				//==========================================
				itemPrice = itemObj.price;
				offerPrice = workOutGetPrice(itemPrice, itemObj.itemCode);
				itemObj.getPrice = offerPrice;

				itemsArray[x] = itemObj;
			}
		}
	}
	catch(e)
	{
		errorHandler("setPricesForPickAndMix", e);
	}
}

/**
 * 
 * qualify Total Hit So Allocate The Get Quantity
 * 
 * 
 * items are sorted with the cheapest at the bottom of the item array, so start at the bottom and work until allocated
 * & work out the price for the offer
 * 
 */
function qualifyTotalHitSoAllocateTheGetQuantity()
{
	var retVal = false;
	var itemPrice = 0;
	var offerPrice = 0;

	try
	{

		for(var y=0; y<getQuantityItems; y++)
		{
			for(var x=itemsArray.length-1; x>=0;x--)
			{
				itemObj = itemsArray[x];

				// look for the 1st get item that has a quantity left

				if(itemObj.getQualify == true && parseInt(itemObj.startQuantity)>0)
				{
					itemObj.getQuantity = parseInt(itemObj.getQuantity) + 1;
					itemObj.startQuantity = parseInt(itemObj.startQuantity) - 1;

					itemObj.offerDescription = offerRecord.getFieldValue('name');
					itemObj.offerImage = offerRecord.getFieldValue('custrecord_promo_image');

					//==========================================
					// work out the offer price
					//==========================================
					itemPrice = itemObj.price;
					offerPrice = workOutGetPrice(itemPrice, itemObj.itemCode);
					itemObj.getPrice = offerPrice;

					itemsArray[x] = itemObj;
					retVal = true;

					//x=x+1; 	// need to ensure this line is checked again for qty remaining
					//zzzzzzzzz buy 3 get 2 free bug check zzzz
					break;
				}
			}
		}
	}
	catch(e)
	{
		errorHandler("qualifyTotalHitSoAllocateTheGetQuantity", e);
	}

	return retVal;
}

/**
 * 
 * work out get price from the offer record for line item offers 
 * 
 */
function workOutGetPrice(itemPrice, itemCode)
{
	var retVal = 0;
	var price = 0;
	var priceSet = false;

	try
	{
		price = FHLFloat(offerRecord.getFieldValue('custrecord_item_for_price'));
		percentageOff = FHLFloat(offerRecord.getFieldValue('custrecord_itempercentoff'));

		// if there is a price on the offer, use it, otherwise check for a percentage off and knock if off the item price if there is one
		if(price==0 && percentageOff==0)
		{
			retVal = 0; 
			priceSet=true;
		}
		else
		{
			itemPrice = parseFloat(itemPrice);

			if(percentageOff>0)
			{
				retVal = itemPrice - (itemPrice * (percentageOff/100));
				priceSet=true;
			}

			if(price>0 && percentageOff==0)
			{
				retVal = price;
				priceSet=true;
			}
		}

		if(priceSet==false)
		{
			addToError("Cannot determine a price for: " + offerRecord.getFieldValue('name') + ", for item: " + itemCode);
		}
		else
		{
			offerApplied = true;
		}
	}
	catch(e)
	{
		errorHandler("workOutGetPrice", e);
	}

	return retVal;
}


/**
 * 
 * markBuyAndGetItems - loop thru all items in basket and marks items as buy get items 
 * 
 */

function markBuyAndGetItems()
{
	var retVal = false;
	var currentItemCodeIntID = 0;

	try
	{
		if(loadBuyItems()==true && loadGetItems()==true)
		{
			for(var x=0; x<itemsArray.length;x++)
			{
				// load basket item from array
				itemObj = itemsArray[x];
				currentItemCodeIntID = itemObj.itemIntID;

				// check if theres any left to process on this line

				if(itemObj.startQuantity>0)
				{
					// check this item is part of buy items offer
					if (qualifyItemsArray.indexOf(currentItemCodeIntID) >= 0)
					{
						itemObj.buyQualify = true;
					}
					else
					{
						itemObj.buyQualify = false;
					}
					// check if any of the items correspond to the get items
					if (getItemsArray.indexOf(currentItemCodeIntID) >= 0)
					{
						itemObj.getQualify = true;
					}
					else
					{
						itemObj.getQualify = false;
					}

				}
				else
				{
					itemObj.buyQualify = false;
					itemObj.getQualify = false;
				}

				itemsArray[x] = itemObj;
			}
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("markBuyAndGetItems", e);

	}
	return retVal;
}

/**
 * 
 * markBuyItems - loop thru all items in basket and marks items as buy  items 
 * 
 */

function markBuyItems()
{
	var retVal = false;
	var currentItemCodeIntID = 0;

	try
	{

		if(loadBuyItems()==true)
		{
			for(var x=0; x<itemsArray.length;x++)
			{


				// load basket item from array
				itemObj = itemsArray[x];
				currentItemCodeIntID = itemObj.itemIntID;

				// check if theres any left to process on this line

				if(itemObj.startQuantity>0)
				{
					// check this item is part of buy items offer
					if (qualifyItemsArray.indexOf(currentItemCodeIntID) >= 0)
					{
						itemObj.buyQualify = true;
					}
					else
					{
						itemObj.buyQualify = false;
					}

				}
				else
				{
					itemObj.buyQualify = false;
				}

				itemsArray[x] = itemObj;
			}
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("markBuyItems", e);
	}

	return retVal;
}

/**
 * 
 * markBuyAndGetItems - loop thru all items in basket and marks items as buy get items 
 * 
 */

function markGetItems()
{
	var retVal = false;
	var currentItemCodeIntID = 0;

	try
	{
		if(loadGetItems()==true)
		{
			for(var x=0; x<itemsArray.length;x++)
			{
				// load basket item from array
				itemObj = itemsArray[x];
				currentItemCodeIntID = itemObj.itemIntID;

				// check if theres any left to process on this line

				if(itemObj.startQuantity>0)
				{
					// check if any of the items correspond to the get items
					if (getItemsArray.indexOf(currentItemCodeIntID) >= 0)
					{
						itemObj.getQualify = true;
						retVal = true;
					}
					else
					{
						itemObj.getQualify = false;
					}

				}
				else
				{
					itemObj.getQualify = false;
				}
				itemsArray[x] = itemObj;
			}

		}
	}
	catch(e)
	{
		errorHandler("markGetItems", e);
	}
	return retVal;
}


/**
 * 
 * sort array into buy, get and price sequence
 * 
 *   
 * 
 */
function sortItems()
{
	try
	{

		itemsArray.sort(function(obj1,obj2)
				{
			var buyQ1 = 0;
			var getQ1 = 0;
			var price1 = 0;
			var total1 = 0;
			var buyQ2 = 0;
			var getQ2 = 0;
			var price2 = 0;
			var total2 = 0;
			var retVal = 0;

			if(obj1.buyQualify==true)
			{
				buyQ1 = 20000;			// arbitary
			}			
			if(obj1.getQualify==true)
			{
				getQ1 = 10000;			// arbitary
			}

			price1 = obj1.price;
			total1 = buyQ1 - getQ1 + price1;

			if(obj2.buyQualify==true)
			{
				buyQ2 = 20000;			// arbitary
			}			
			if(obj2.getQualify==true)
			{
				getQ2 = 10000;			// arbitary
			}

			price2 = obj2.price;
			total2 = buyQ2 - getQ2 + price2;

			if(total2>total1)
			{
				retVal = 1;
			}
			else
			{
				retVal = -1;
			}

			return retVal;

				});
	}
	catch(e)
	{
		errorHandler("sortItems", e);
	}
}

/**
 * 
 * show workings out  
 * 
 */

function createWorkingsXML()
{
	for(var x=0; x<itemsArray.length;x++)
	{
		itemObj = itemsArray[x];

		addToWorkings('itemObj.itemIntID', itemObj.itemIntID);
		addToWorkings('itemObj.itemCode', itemObj.itemCode);
		addToWorkings('itemObj.quantity', itemObj.quantity);
		addToWorkings('itemObj.price', itemObj.price);
		addToWorkings('itemObj.description', itemObj.description);
		addToWorkings('itemObj.buyQualify', itemObj.buyQualify);
		addToWorkings('itemObj.getQualify', itemObj.getQualify);
		addToWorkings('itemObj.startQuantity', itemObj.startQuantity);
		addToWorkings('itemObj.getQuantity', itemObj.getQuantity);
		addToWorkings('itemObj.getPrice', itemObj.getPrice);
		addToWorkings('itemObj.offerImage', itemObj.offerImage);
		addToWorkings('itemObj.offerDescription', itemObj.offerDescription);
		addToWorkings('itemObj.VATCode', itemObj.VATCode);
		addToWorkings('itemObj.VATRate', itemObj.VATRate);
		addToWorkings('itemObj.pricesIncludeTax', itemObj.pricesIncludeTax);
		addToWorkings('itemObj.isShipping', itemObj.isShipping);

		// three overall order discounts can apply to the order
		addToWorkings('itemObj.overalldisc', itemObj.overalldisc);
		addToWorkings('itemObj.overalldiscImage', itemObj.overalldiscImage);
		addToWorkings('itemObj.overalldiscDesc', itemObj.overalldiscDesc);
		addToWorkings('itemObj.overalldiscPercent', itemObj.overalldiscPercent);

		addToWorkings('itemObj.overalldisc1', itemObj.overalldisc1);
		addToWorkings('itemObj.overalldiscImage1', itemObj.overalldiscImage1);
		addToWorkings('itemObj.overalldiscDesc1', itemObj.overalldiscDesc1);
		addToWorkings('itemObj.overalldiscPercent1', itemObj.overalldiscPercent1);

		addToWorkings('itemObj.overalldisc2', itemObj.overalldisc2);
		addToWorkings('itemObj.overalldiscImage2', itemObj.overalldiscImage2);
		addToWorkings('itemObj.overalldiscDesc2', itemObj.overalldiscDesc2);
		addToWorkings('itemObj.overalldiscPercent2', itemObj.overalldiscPercent2);


		addToWorkings('itemObj.shippingbandgb', itemObj.shippingbandgb);
		addToWorkings('itemObj.shippingbandeu', itemObj.shippingbandeu);
		addToWorkings('itemObj.location', itemObj.location);

		addToWorkings('            ', '                   ');
	}
}

/**
 * 
 * load buy items into an array from two fields (allow index of to be used for quick search) -  
 * 
 * 		custrecord_offerbuythisitem
 *		custrecord_ofthisitemextension
 */

function loadBuyItems()
{
	var retVal = false;
	var qualifyItemsExtArray = new Array();
	var qualifyItemsExtString = '';

	try
	{
		qualifyItemsArray = offerRecord.getFieldValues('custrecord_offerbuythisitem');
		qualifyItemsExtString = offerRecord.getFieldValue('custrecord_ofthisitemextension');

		// add the two arrays together
		if (qualifyItemsExtString)
		{
			qualifyItemsExtArray = qualifyItemsExtString.split(',');

			qualifyItemsArray.concat(qualifyItemsExtArray); // 1.0.2
		}

		retVal = true;
	}
	catch(e)
	{
		errorHandler("loadBuyItems", e);
	}

	return retVal;
}

/**
 * 
 * load get items into an array from two fields (allow index of to be used for quick search) -  
 */
function loadGetItems()
{
	var retVal = false;
	var getItemsExtArray = new Array();
	var getItemsExtString = '';

	try
	{
		getItemsArray = offerRecord.getFieldValues('custrecord_offergetthisactualitem');
		getItemsExtString = offerRecord.getFieldValue('custrecord_gettheseitemsextension');

		// add the two arrays together
		if (getItemsExtString)
		{
			getItemsExtArray = getItemsExtString.split(',');
			getItemsArray.concat(getItemsExtArray); // 1.0.2
		}
		retVal = true;
	}
	catch(e)
	{
		errorHandler("loadGetItems", e); // 1.0.2
	}

	return retVal;
}

/**
 * 
 * work out Basket Detail 
 * 
 */
function workOutBasketDetail()
{
	var basket = '';

	try
	{
		extractSavings(false);

		basket += createXMLTagStart('basket');
		basket += createXMLTagStart('header');
		basket += createXMLLine('shipping', shippingTotal);
		basket += createXMLLine('shippingsavings', totalShippingSavings);
		basket += createXMLLine('totalsavings', totalSavings);
		basket += createXMLLine('grandtotal', grandTotal);
		basket += createXMLTagEnd('header');

		basket += createXMLTagStart('orderlines');

		for(var x=0; x<itemsArray.length; x++)
		{
			itemObj = itemsArray[x];
			basket += createXMLTagStart('orderline'); 
			basket += createXMLLine('itemcode', itemObj.itemCode);
			basket += createXMLLine('image', itemObj.itemImage);
			basket += createXMLLine('location', itemObj.location);	
			basket += createXMLLine('priceincvat', itemObj.price);		// price includes VAT
			basket += createXMLTagEnd('orderline');
		}
		basket += createXMLTagEnd('orderlines');

		basket += createXMLTagStart('offers'); 

		// for each item
		for(var x=0; x<savings.length; x++)
		{
			saving = savings[x];
			basket += createXMLTagStart('offer'); 
			basket += createXMLLine('image', saving.offerImage);
			basket += createXMLLine('description', saving.offerDescription);
			basket += createXMLLine('saving', saving.savingAmount);
			basket += createXMLTagEnd('offer');
		}

		basket += createXMLTagEnd('offers');
		basket += createXMLTagEnd('basket');

		XMLCalcBasket = basket;
	}
	catch(e)
	{
		errorHandler("workOutBasketDetail", e);
	}
}

/**
 * 
 * work out the checkout details 
 * 
 */

function workOutCheckOutDetail()
{
	var getQty = 0;
	var qty = 0;
	var getPrice = 0;
	var qtyRemaining = 0;
	var offerDesc = '';
	var offerImage = '';
	var overAllDiscPercent = 0;
	var overAllDiscPercent1 = 0;

	try
	{
		checkOut = createXMLTagStart('checkout');
		checkOut += createXMLTagStart('header');

		checkOut += createXMLLine('customer', customer);
		checkOut += createXMLLine('reference', reference);
		checkOut += createXMLLine('date', orderDate);
		checkOut += createXMLLine('campaign', campaign);
		checkOut += createXMLLine('shipping', shippingTotal);
		checkOut += createXMLLine('totalsavings', totalSavings);
		checkOut += createXMLLine('shippingsavings', totalShippingSavings);
		checkOut += createXMLLine('grandtotal', grandTotal);
		checkOut += createXMLTagEnd('header');

		checkOut += createXMLTagStart('detail'); 

		// for each item
		for(var x=0; x<itemsArray.length; x++)
		{
			itemObj = itemsArray[x];

			getPrice = parseFloat(itemObj.getPrice);
			getQty = parseInt(itemObj.getQuantity);
			qty = parseInt(itemObj.quantity);
			price = parseFloat(itemObj.price);
			offerDesc = itemObj.offerDescription;
			offerImage = itemObj.offerImage;
			overAllDiscPercent = FHLFloat(itemObj.overalldiscPercent);
			overAllDiscPercent1 = FHLFloat(itemObj.overalldiscPercent1);
			overAllDiscPercent2 = FHLFloat(itemObj.overalldiscPercent2);

			if(getQty!=0)
			{
				// create the get line and any remaining
				setItemForCheckout(getPrice,getQty, offerDesc, offerImage,overAllDiscPercent,overAllDiscPercent1,overAllDiscPercent2);

				qtyRemaining = qty - getQty;
				if(qtyRemaining!=0)
				{
					price = parseFloat(itemObj.price);
					offerDesc= '';
					offerImage = '';
					setItemForCheckout(price, qtyRemaining, offerDesc, offerImage,overAllDiscPercent,overAllDiscPercent1,overAllDiscPercent2);
				}
			}
			else
			{
				setItemForCheckout(price, qty, offerDesc, offerImage, overAllDiscPercent, overAllDiscPercent1,overAllDiscPercent2);	
			}
		}
		checkOut += createXMLTagEnd('detail');
		checkOut += createXMLTagEnd('checkout');
		XMLCalcCheckOut = checkOut;
	}
	catch(e)
	{
		errorHandler("workOutCheckOutDetail", e);
	}
}

/**
 * 
 * set items 
 * 
 */

function setItemForCheckout(price, qty, offerDesc, offerImage, overAllDiscPercent,overAllDiscPercent1, overAllDiscPercent2)
{
	try
	{
		checkOut += createXMLTagStart('orderline'); 

		checkOut += createXMLLine('quantity', qty);
		checkOut += createXMLLine('itemcode', itemObj.itemCode);
		checkOut += createXMLLine('image', itemObj.itemImage);
		checkOut += createXMLLine('description', itemObj.description);

		// knock off any overall discount percentage

		if(overAllDiscPercent)
		{
			price = price - (price * overAllDiscPercent);
		}

		if(overAllDiscPercent1)
		{
			price = price - (price * overAllDiscPercent1);
		}

		if(overAllDiscPercent2)
		{
			price = price - (price * overAllDiscPercent2);
		}

		checkOut += createXMLLine('priceincvat', price);

		checkOut += createXMLLine('vatcode', itemObj.VATCode);
		checkOut += createXMLLine('vatrate', itemObj.VATRate);

		//checkOut += createXMLLine('priceexvat', itemObj.getPrice);			// [todo] need to calculate
		checkOut += createXMLLine('offerdesc', offerDesc);
		checkOut += createXMLLine('offerimage', offerImage);

		checkOut += createXMLLine('offerdesc1', itemObj.overalldiscDesc);
		checkOut += createXMLLine('offerimage1', itemObj.overalldiscImage);
		checkOut += createXMLLine('offerdesc2', itemObj.overalldiscDesc1);
		checkOut += createXMLLine('offerimage2', itemObj.overalldiscImage1);
		checkOut += createXMLLine('offerdesc3', itemObj.overalldiscDesc2);
		checkOut += createXMLLine('offerimage3', itemObj.overalldiscImage2);
		checkOut += createXMLLine('location', itemObj.location);
		checkOut += createXMLLine('isshipping', itemObj.isShipping);

		checkOut += createXMLTagEnd('orderline');
	}
	catch(e)
	{
		errorHandler("extractSavings", e);
	}
}

/**
 * 
 * extract savings from items array 
 * 
 * works in two modes - 1 for the whole order, 2 based on the buy items selected which works for group calculations
 * 
 */

function extractSavings(group)
{
	var fullPriceTotal = 0;
	var offerPriceTotal = 0;
	var retVal = false;
	var lineSavings = 0;
	var lineOriginal = 0;
	var countThisLine = false;

	try
	{

		grandTotal = 0;
		totalSavings = 0;
		savingsCount = 0;
		savings = new Array();

		for(var x=0; x<itemsArray.length;x++)
		{
			// load basket item from array
			itemObj = itemsArray[x];

			// are we dealing with a group
			if(group == true &&  itemObj.buyQualify==true)
			{
				countThisLine = true;
			}
			else
			{
				countThisLine = false;
			}

			if(group == false)
			{
				countThisLine = true;
			}

			if(countThisLine == true)
			{

				// work out the full price total 
				fullPriceTotal = itemObj.price * itemObj.quantity;
				grandTotal = grandTotal + fullPriceTotal;

				//================================================================
				// work out the savings for the line
				//================================================================
				if(itemObj.getQuantity>0)
				{

					// work out the offer price total and work out savings
					offerPriceTotal = itemObj.getQuantity * itemObj.getPrice;
					lineOriginal = itemObj.getQuantity * itemObj.price;
					lineSavings = lineOriginal - offerPriceTotal; 

					addASavingLine(lineSavings, itemObj.offerImage, itemObj.offerDescription);
				}

				//================================================================
				// if an overall discount is applied, add another saving line
				//================================================================
				if(itemObj.overalldisc>0)
				{
					addASavingLine(itemObj.overalldisc, itemObj.overalldiscImage, itemObj.overalldiscDesc);
				}

				//================================================================
				// if an overall discount is applied, add another saving line
				//================================================================
				if(itemObj.overalldisc1>0)
				{
					addASavingLine(itemObj.overalldisc1, itemObj.overalldiscImage1, itemObj.overalldiscDesc1);
				}

				//================================================================
				// if an overall discount is applied, add another saving line
				//================================================================
				if(itemObj.overalldisc2>0)
				{
					addASavingLine(itemObj.overalldisc2, itemObj.overalldiscImage2, itemObj.overalldiscDesc2);
				}


			}
		}

		retVal = true;
	}
	catch(e)
	{
		errorHandler("extractSavings", e);
	}

	return retVal;
}


/**
 * 
 * add a saving detail line and provide total for 'total savings' 
 * 
 */

function addASavingLine(lineSavings, offerImage, offerDescription)
{

	var savingAmt = 0;
	var newLine = true;

	try
	{

		// check if this already exists and if it does add the savings for this line

		for(var x=0; x<savings.length;x++)
		{
			saving = savings[x];

			// if one found, consolidate
			if(saving.offerDescription == offerDescription)
			{
				savingAmt = parseFloat(saving.savingAmount);
				savingAmt = savingAmt + lineSavings;
				saving.savingAmount = savingAmt;
				savings[x] = saving;
				newLine = false;
				break;
			}
		}

		if(newLine == true)
		{
			saving = new Object();
			saving.offerImage = offerImage;
			saving.offerDescription = offerDescription;
			saving.savingAmount = lineSavings;

			savings[savingsCount] = saving;
			savingsCount = savingsCount + 1;
		}

		totalSavings = totalSavings + lineSavings;
	}
	catch(e)
	{
		errorHandler("addASavingLine", e);
	}
}

/**
 * 
 * deal with spend over offers either for
 * 1. buy over x get % discount on whole order
 * 2. buy over x get item(s) y free or for a price or for a % off
 * 3. buy over �x from a group and get an overall order discount
 */

function dealWithSpendOverOffer()
{
	var netTotal = 0;
	var compareAmount = 0;
	var freeItemQty = 0;
	var qualItemsArray = new Array();
	var amountOff = 0;
	var percentOff = 0;


	try
	{
		qualItemsArray = offerRecord.getFieldValues('custrecord_offerbuythisitem');

		// check if this is a spend over x  in a group type offer
		if(qualItemsArray)
		{
			spendOverInAGroup();
		}
		else
		{
			//========================================
			// get savings total - 
			// work out the grandtotal and savings
			//========================================
			extractSavings(false);

			netTotal = grandTotal - totalSavings;

			compareAmount = parseFloat(offerRecord.getFieldValue('custrecord_offerspendover'));

			// check if the threshold has been reached for the offer
			if(netTotal>=compareAmount)
			{
				percentOff = parseFloat(offerRecord.getFieldValue('custrecord_offertransgetpercentoff')) / 100;
				freeItemQty = parseFloat(offerRecord.getFieldValue('custrecord_offergetthisfreeqty'));
				amountOff = parseFloat(offerRecord.getFieldValue('custrecord_offertransgetamtoff'));

				// check if this is spend over x get a percentage off
				if(percentOff>0 || amountOff>0)
				{
					// if an amount off has been entered, calculate the percentage off the whole order for the amount given
					// and apply this
					if(amountOff>0)
					{
						percentOff = amountOff/netTotal;
						//percentOff = amountOff/grandTotal;
					}

					percentOffOverallOrderCalc(percentOff);
				}
				else
				{
					// deal with spend over x and get an item for free

					if(freeItemQty>0)
					{
						spendOverGetAnItem();
					}
				}
			}

		}
	}
	catch(e)
	{
		errorHandler("dealWithSpendOverOffer", e);
	}
}



/**
 * 
 * deal with if this is a spend over 10 pounds in a group type offer 
 * 1.0.4
 */

function spendOverInAGroup()
{

	var itemPercentOff = 0;
	var amountOff = 0;
	var percentOff = 0;
	

	try
	{

		if(markBuyItems()==true)
		{
			extractSavings(true);

			netTotal = grandTotal - totalSavings;
			compareAmount = parseFloat(offerRecord.getFieldValue('custrecord_offerspendover'));
			

			// check if the threshold has been reached for the offer
			if(netTotal>=compareAmount)
			{
				// get group fields
				freeItemQty = parseFloat(offerRecord.getFieldValue('custrecord_offergetthisfreeqty'));
				itemPercentOff = parseFloat(offerRecord.getFieldValue('custrecord_itempercentoff'));

				// over all order fields
				amountOff = parseFloat(offerRecord.getFieldValue('custrecord_offertransgetamtoff'));
				percentOff = parseFloat(offerRecord.getFieldValue('custrecord_offertransgetpercentoff')) / 100;

				// check if this is spend over x get a percentage off 1.0.4
				if(percentOff>0 || amountOff>0)
				{
					if(amountOff>0)
					{
						extractSavings(false);

						netTotal = grandTotal - totalSavings;
						percentOff = amountOff/netTotal;
						
						if(percentOff>1)
						{
							percentOff = 1;
						}

					}
					percentOffOverallOrderCalc(percentOff);
				}

				if(freeItemQty>0 || itemPercentOff>0)
				{
					spendOverGetAnItem();	
				}


			}
		}
	}
	catch(e)
	{
		errorHandler("spendOverInAGroup", e);
	}

}

/**
 * 
 * deal with spend over x get item(s) y for a price/discount/free
 * BIG NOTE: the target get item does not count in the calculation of the threshold
 *  
 * 
 */
function spendOverGetAnItem(freeItemQty)
{
	var retVal = false;
	var netTotal = 0;
	var compareAmount = 0;
	var theCopy = [];
	var copyObj = new Object();

	try
	{

		getQuantityItems = offerRecord.getFieldValue('custrecord_offergetthisfreeqty');	// the amount of get

		if(markGetItems()==true)
		{

			// store the current items array
			// allocate the get items and recalc the total
			// if below the threshold for the offer, reverse out the changes

			for (var i = 0; i<itemsArray.length; i++) 
			{
				copyObj = copyObject(itemsArray[i]);
				theCopy[i] = copyObj;
			}

			sortItems();
			qualifyTotalHitSoAllocateTheGetQuantity();

			extractSavings(false);
			netTotal = grandTotal - totalSavings;
			compareAmount = parseFloat(offerRecord.getFieldValue('custrecord_offerspendover'));

			// if the amount is now below the threshold, this means we did not have
			// enough in the basket to trigger the offer, so reverse out the changes

			if(netTotal<compareAmount)
			{
				for (var i = 0; i < itemsArray.length; i++) 
				{
					copyObj = copyObject(theCopy[i]);
					itemsArray[i] = copyObj;

				}
				extractSavings(false);
			}
			else
			{
				offerApplied = true;
			}

			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("spendOverGetAnItem", e);
	}

	return retVal;
}

function copyObject(obj)
{
	var newObj = {};
	for (var key in obj) 
	{
		//copy all the fields
		newObj[key] = obj[key];
	}

	return newObj;
}

/**
 * 
 * work out overall order discount per line 
 * 
 */
function percentOffOverallOrderCalc(percentOff)
{
	var origPrice = 0;
	var origQty = 0;
	var getPrice = 0;
	var getQty = 0;
	var discTotal = 0;
	var discTotal1 = 0;
	var lineAmountToDiscount = 0;

	try
	{

		for(var x=0; x<itemsArray.length; x++)
		{
			itemObj = itemsArray[x];

			origQty = itemObj.quantity;
			origPrice = itemObj.price;
			getPrice = itemObj.getPrice;
			getQty = itemObj.getQuantity;
			discTotal = itemObj.overalldisc;
			discTotal1 = itemObj.overalldisc1;
			discTotal2 = itemObj.overalldisc2;

			//lineAmountToDiscount = (((origQty - getQty) * origPrice) + (getQty * getPrice)) - (discTotal + discTotal1); 
			//zzzz
			lineAmountToDiscount = (((origQty - getQty) * origPrice) + (getQty * getPrice)) - (discTotal  + discTotal1);


			if(itemObj.overalldiscDesc.length==0)
			{
				itemObj.overalldisc = lineAmountToDiscount * percentOff;
				itemObj.overalldiscDesc = offerRecord.getFieldValue('name');
				itemObj.overalldiscImage = offerRecord.getFieldValue('custrecord_promo_image');
				itemObj.overalldiscPercent = percentOff;
			}
			else
			{
				if(itemObj.overalldiscDesc1.length==0)
				{
					itemObj.overalldisc1 = lineAmountToDiscount * percentOff;
					itemObj.overalldiscDesc1 = offerRecord.getFieldValue('name');
					itemObj.overalldiscImage1 = offerRecord.getFieldValue('custrecord_promo_image');
					itemObj.overalldiscPercent1 = percentOff;

					lineAmountToDiscount = lineAmountToDiscount - itemObj.overalldisc1;  
				}
				else
				{
					itemObj.overalldisc2 = lineAmountToDiscount * percentOff;
					itemObj.overalldiscDesc2 = offerRecord.getFieldValue('name');
					itemObj.overalldiscImage2 = offerRecord.getFieldValue('custrecord_promo_image');
					itemObj.overalldiscPercent2 = percentOff;

					lineAmountToDiscount = lineAmountToDiscount - itemObj.overalldisc2;  

				}

			}

			offerApplied = true;

			itemsArray[x] = itemObj;
		}
	}
	catch(e)
	{
		errorHandler("percentOffOverallOrderCalc", e);
	}
}


/**
 * 
 * deal with pick and mix offer types 
 * 
 */

function dealWithPickAndMixOffer()
{
	try
	{
		if(markBuyItems()==true)
		{
			if(determineIfPickAndMixQtyHit()==true)
			{
				// set prices for all get items
				setPricesForPickAndMix();
			}
		}
	}
	catch(e)
	{
		errorHandler("dealWithPickAndMixOffer", e);
	}
}


/**
 * 
 * determine if free PP should apply to the entire order 
 * 
 */

function applyFreePP()
{
	var retVal = false;

	try
	{
		if(freePostPack=='T' && offerApplied==true)
		{
			freePP = 'T';
		}
		retVal = true;	
	}
	catch(e)
	{
		errorHandler("applyFreePP", e);
	}

	return retVal;
}



/**
 * 
 * load individual offer 
 * 
 */

function loadOffer(offerIntID)
{
	var retVal = false;

	try
	{
		offerRecord = nlapiLoadRecord('customrecord_mrfoffer', offerIntID);
		freePostPack = offerRecord.getFieldValue('custrecord_offerfreepp');
		postPackPrice= FHLFloat(offerRecord.getFieldValue('custrecord_ppprice'));

		retVal = true;	

	}
	catch(e)
	{
		errorHandler("loadOffer", e);
	}

	return retVal;
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
		orderSplit = XMLSalesOrder.split('<br>');
		orderSplitLines = orderSplit.length;

		for(var x=0; x<orderSplitLines;x++)
		{
			orderElement = orderSplit[x];
			getOrderHeaderDetails();
			getOrderLineDetails();
		}
	}
	catch(e)
	{
		errorHandler("parseXMLSalesOrder", e);
	}
}

/**
 * get order header details
 *   
 */
function getOrderHeaderDetails()
{
	try
	{
		if(orderElement.indexOf('<date>')!=-1)
		{
			orderDate = splitOutValue(orderElement,'date');
		}
		if(orderElement.indexOf('<customer>')!=-1)
		{
			customer = splitOutValue(orderElement,'customer');
		}

		if(orderElement.indexOf('<reference>')!=-1)
		{
			reference = splitOutValue(orderElement,'reference');
		}
		if(orderElement.indexOf('<campaign>')!=-1)
		{
			campaign = splitOutValue(orderElement,'campaign');
		}
		if(orderElement.indexOf('<brand>')!=-1)
		{
			brandIntID = splitOutValue(orderElement,'brand');
			brandIntID = parseInt(brandIntID);
		}

	}
	catch(e)
	{
		errorHandler("getOrderHeaderDetails", e);
	}
}

/**
 * get order item line details
 *   
 */
function getOrderLineDetails()
{
	var itemIntID = 0;

	try
	{
		//========================================
		// items
		//========================================
		if(orderElement.indexOf('<quantity>')!=-1)
		{
			itemObj=new Object();
			itemObj.quantity= splitOutValue(orderElement,'quantity');
			itemObj.startQuantity = itemObj.quantity;	
			itemObj.getQuantity = 0;	
			itemObj.buyQualify = false;
			itemObj.getQualify = false;
			itemObj.getPrice = 0;
			itemObj.offerImage = '';
			itemObj.offerDescription = '';
			itemObj.isShipping = false;
			itemObj.location="";
		}
		if(orderElement.indexOf('<itemcode>')!=-1)
		{
			itemObj.itemCode = splitOutValue(orderElement,'itemcode');
			itemIntID = lookupItems(itemObj.itemCode);
			itemObj.itemIntID = itemIntID;
			itemObj.itemImage = itemImage;
			itemObj.VATCode = VATCode;	
			itemObj.VATRate = VATRate;						
			itemObj.pricesIncludeTax = pricesIncludeTax;
			itemObj.overalldisc = 0;
			itemObj.overalldiscImage = '';
			itemObj.overalldiscDesc = '';
			itemObj.overalldiscPercent = 0;

			itemObj.overalldisc1 = 0;
			itemObj.overalldiscImage1 = '';
			itemObj.overalldiscDesc1 = '';
			itemObj.overalldiscPercent1 = 0;

			itemObj.overalldisc2 = 0;
			itemObj.overalldiscImage2 = '';
			itemObj.overalldiscDesc2 = '';
			itemObj.overalldiscPercent2 = 0;

			itemObj.shippingbandgb = shipBandItemID;
			itemObj.shippingbandeu = shipBandItemEUID;


		}

		if(orderElement.indexOf('<description>')!=-1)
		{
			itemObj.description = splitOutValue(orderElement,'description');
		}

		if(orderElement.indexOf('<location>')!=-1)
		{
			itemObj.location = splitOutValue(orderElement,'location');
		}


		if(orderElement.indexOf('<price>')!=-1)
		{
			itemObj.price = splitOutValue(orderElement,'price');
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
 * 
 * lookup Item and associated values i.e. VAT code, rate etc
 * 
 */
function lookupItem(itemCode, internalID)
{
	var itemIntID = 0;
	var itemRecord = null;
	var recordType = null;
	var VATIntID = 0;

	try
	{

		if(internalID)
		{
			itemIntID = genericSearch('item','internalid',internalID);
		}
		else
		{
			itemIntID = genericSearch('item','itemid',itemCode);
		}

		if(itemIntID!=0)
		{
			recordType = searchResult.getRecordType();
			itemRecord = nlapiLoadRecord(recordType, itemIntID);
			itemImage = itemRecord.getFieldValue('custitem_mrf_ext_storedisplaythumbnail');
			VATCode = itemRecord.getFieldText('salestaxcode');
			VATIntID = itemRecord.getFieldValue('salestaxcode');
			pricesIncludeTax = itemRecord.getFieldValue('pricesincludetax');
			storedisplayname = itemRecord.getFieldValue('storedisplayname');
			itemCodeLookedUp = itemRecord.getFieldValue('itemid');

			shipBandItemID = itemRecord.getFieldValue('custitem_shippingbanding');
			shipBandItemEUID = itemRecord.getFieldValue('custitem_shippingbandingeu');

			VATRate = 0;
			if(VATIntID>0)
			{
				VATRate = nlapiLookupField('salestaxitem', VATIntID, 'rate');
			}

			if(!itemImage)
			{
				itemImage = '';
			}
		}
		else
		{
			addToError('Item not found: '+ itemCode);
			itemImage = '';
		}

	}
	catch(e)
	{
		errorHandler("lookupItem", e);
	}

	return itemIntID;
}

/**
 * 
 * WriteAnswers
 * 
 */

function writeAnswers()
{
	var submitID = 0;

	try
	{
		payloadRecord.setFieldValue('custrecord_basketanswer',XMLCalcBasket);
		payloadRecord.setFieldValue('custrecord_checkoutanswer',XMLCalcCheckOut);
		payloadRecord.setFieldValue('custrecord_status',successDesc);
		payloadRecord.setFieldValue('custrecord_calculationerrors',XMLError);
		payloadRecord.setFieldValue('custrecord_workingout',XMLWorkings);

		submitID = nlapiSubmitRecord(payloadRecord, true);

	}
	catch(e)
	{
		errorHandler("WriteAnswers", e);
	}
}


//**********************************************************************************************************************************
//retrieveOffersAssociatedWithCampaign in priority sequence and filter by brand also

//campaign code = 'F13109'
//sets/returns:
//success/failure
//sets an array of offers = applicableOffers
//**********************************************************************************************************************************


function loadOffersAssociatedWithCampaign()
{
	var retVal = false;
	var offersRetVal = 0;
	var formula = '';
	var custRec = null;

	try
	{

		// offers in a campaign will only be for one brand
		if(!campaign)
		{
			deriveGenericCampaignCode();
		}
		
		offersRetVal = genericSearchAdvancedWithSort('customrecord_mrfoffer', 'formulatext', campaign, 'contains', '{custrecord_mrf_offer_campaign}', 'custrecord_priority');

		if(offersRetVal != 0)
		{
			copyOffersToArray();
			//partner = getPartnerFromCampaign(campaign);	
			retVal = true;
		}
		else
		{
			addToError("No valid offers for campaign:" + campaign);
			successDesc = "Processed";
		}
	}
	catch(e)
	{
		errorHandler("retrieveOffersAssociatedWithCampaign", e);
	}

	return retVal;
}


/**
 * Derive or set a  Generic CampaignCode
 * 
 */

function deriveGenericCampaignCode()
{
	
	

	try
	{
		
		// check, get or set the campaign code
		runSavedSearchCampaigns(campaign, customer, brandIntID);
		campaign = derivedCampaignCode;
	
	}
	catch(e)
	{
		errorHandler("validateDeriveGenericCampaignCode", e);
	}
}

/**
 * get Partner From Campaign
 * 
 * @param campCode
 */
function getPartnerFromCampaign(campCode)
{
	var partnerID = null;
	var campIntID = 0;
	var partnerCampaign = null;

	try
	{
		campIntID = genericSearch('campaign', 'title', campCode);

		if (campIntID) // 1.0.2
		{
			partnerCampaign = nlapiLoadRecord('campaign', campIntID);
			partnerID = partnerCampaign.getFieldValue('custevent_mrf_campaign_partner');
		}
	}
	catch(e)
	{
		errorHandler("getPartnerFromCampaign", e);
	}

	return partnerID; 
}

/**
 * 1.3.8 copy search offers to array
 */
function copyOffersToArray()
{
	try
	{
		for ( var i = 0; itemSearchResults!= null && i < itemSearchResults.length; i++ )
		{
			applicableOffers[i] = itemSearchResults[i].getId();
		}
	}
	catch(e)
	{
		errorHandler("copyOffersToArray", e);
	}
}


//====================================================================================================
//.
//all shipping functionality below here
//.
//.
//.
//.
//.
//====================================================================================================


/**
 * deal With Shipping
 * 
 */

function dealWithShipping()
{

	// for each item in the basket, categorise it in terms of its shipping banding

	try
	{
		determineShippingDestination();			// i.e. UK, EU or NON EU
		workOutShippingBandings();
		addShippingBandingsToCalc();

	}
	catch(e)
	{
		errorHandler("dealWithShipping", e);
	}

}

/**
 * determine Shipping Destination
 * i.e. UK, EU or NON EU
 */

function determineShippingDestination()			
{

	var retVal = false;
	var shipCountry = '';

	try
	{
		// Lookup the shipto country from the customer
		if (customer)
		{
			shipCountry = nlapiLookupField('customer', customer, 'shipcountry');
		}

		if (eu.indexOf(shipCountry) >= 0)
		{
			shipDestination = 'EU';
		}
		else
		{
			// if no address setup assume GB
			if(shipCountry)
			{
				if(shipCountry == 'GB')
				{
					shipDestination = 'GB';
				}
				else
				{
					shipDestination = 'WORLD';
				}
			}
			else
			{
				shipDestination = 'GB';
			}
		}

		retVal = true;
	}
	catch(e)
	{
		errorHandler("determineShippingDestination", e);
	}

	return retVal;

}

/**
 * work Out Shipping Bandings
 * extract the shipping banding items and remove any duplicates
 * 
 */

function workOutShippingBandings()
{

	var retVal = false;
	var shipBandToAdd = '';

	try
	{

		// loop thru all items and dump shipping banding item ids to array
		for(var x=0; x<itemsArray.length; x++)
		{
			itemObj = itemsArray[x];

			//lookupItem(itemObj.itemCode);

			if(shipDestination=='GB')
			{
				shipBandToAdd = itemObj.shippingbandgb;
			}
			else
			{
				shipBandToAdd = itemObj.shippingbandeu;
			}

			// if there is a shipping band, add it
			if(shipBandToAdd)
			{
				shipBandIDs.push(shipBandToAdd);
			}
		}

		shipBandIDs.push('99999999999');		// ensure last item gets triggered in dedup

		// sort and remove duplicates
		shipBandIDs.sort();

		for (var i = 0; i < shipBandIDs.length - 1; i++) 
		{
			if ((shipBandIDs[i + 1] != shipBandIDs[i]) && shipBandIDs[i]!='99999999999') 
			{
				shipBandIDsDeDup.push(shipBandIDs[i]);
			}
		}

		retVal = true;

	}
	catch(e)
	{
		errorHandler("workOutShippingBandings", e);
	}

	return retVal;

}


/**
 * add Bandings To Calc
 * 
 *   
 */

function addShippingBandingsToCalc()
{

	var retVal = false;

	try
	{
		for (var x = 0; x < shipBandIDsDeDup.length; x++) 
		{

			itemObj = new Object();
			itemObj.quantity= 1;
			itemObj.startQuantity = 1;	
			itemObj.getQuantity = 0;	
			itemObj.buyQualify = false;
			itemObj.getQualify = false;
			itemObj.getPrice = 0;
			itemObj.offerImage = '';
			itemObj.offerDescription = '';
			itemObj.isShipping = true;

			itemObj.itemIntID = shipBandIDsDeDup[x];

			itemIntID = lookupItems('',itemObj.itemIntID);

			itemObj.itemCode = itemCodeLookedUp; 
			itemObj.itemImage = '';
			itemObj.VATCode = VATCode;	
			itemObj.VATRate = VATRate;						
			itemObj.pricesIncludeTax = pricesIncludeTax;
			itemObj.overalldisc = 0;
			itemObj.overalldiscImage = '';
			itemObj.overalldiscDesc = '';
			itemObj.overalldiscPercent = 0;

			itemObj.overalldisc1 = 0;
			itemObj.overalldiscImage1 = '';
			itemObj.overalldiscDesc1 = '';
			itemObj.overalldiscPercent1 = 0;

			itemObj.description = storedisplayname;

			// deal with free P+P shipping
			if(freePP=='T')
			{
				totalShippingSavings = totalShippingSavings + (itemBasePrice - postPackPrice);
				itemObj.price = postPackPrice;
				itemObj.description = storedisplayname + ' - (reduced Postage and Packing).';
			}
			else
			{
				itemObj.price = itemBasePrice;
			}

			itemsArray.push(itemObj);

			// add to shipping total

			shippingTotal = shippingTotal + (itemObj.quantity * itemObj.price);

		}

		retVal = true;
	}
	catch(e)
	{
		errorHandler("addShippingBandingsToCalc", e);
	}

	return retVal;

}


/**
 * lookup item
 * 
 */
function lookupItems(itemCode, internalID)
{


	// Arrays
	var itemSearchFilters = new Array();
	var itemReturnColumns = new Array();
	var itemSearchResults = new Array();
	var itemSearchResult = new Array();
	var retVal = 0;

	try
	{
		if(internalID)
		{
			itemSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is',internalID);
		}
		else
		{
			itemSearchFilters[0] = new nlobjSearchFilter('itemid', null, 'is',itemCode);
		}

		itemReturnColumns[0] = new nlobjSearchColumn('onlineprice');
		itemReturnColumns[1] = new nlobjSearchColumn('custitem_mrf_ext_storedisplaythumbnail');
		itemReturnColumns[2] = new nlobjSearchColumn('salestaxcode');
		itemReturnColumns[3] = new nlobjSearchColumn('pricesincludetax');
		itemReturnColumns[4] = new nlobjSearchColumn('storedisplayname');
		itemReturnColumns[5] = new nlobjSearchColumn('custitem_shippingbanding');
		itemReturnColumns[6] = new nlobjSearchColumn('custitem_shippingbandingeu');
		itemReturnColumns[7] = new nlobjSearchColumn('itemid');
		itemReturnColumns[8] = new nlobjSearchColumn('internalid');

		itemSearchResults = nlapiSearchRecord('item', null, itemSearchFilters, itemReturnColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];

				itemBasePrice = itemSearchResult.getValue('onlineprice');

				itemImage = itemSearchResult.getValue('custitem_mrf_ext_storedisplaythumbnail');
				VATCode = itemSearchResult.getText('salestaxcode');
				VATIntID = itemSearchResult.getValue('salestaxcode');
				pricesIncludeTax = itemSearchResult.getValue('pricesincludetax');
				storedisplayname = itemSearchResult.getValue('storedisplayname');
				itemCodeLookedUp = itemSearchResult.getValue('itemid');

				shipBandItemID = itemSearchResult.getValue('custitem_shippingbanding');
				shipBandItemEUID = itemSearchResult.getValue('custitem_shippingbandingeu');

				retVal  = itemSearchResult.getValue('internalid');

				VATRate = 0;
				if(VATIntID>0)
				{
					VATRate = nlapiLookupField('salestaxitem', VATIntID, 'rate');
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('getItemBasePrice',e);
	}     	      

	return retVal;
}


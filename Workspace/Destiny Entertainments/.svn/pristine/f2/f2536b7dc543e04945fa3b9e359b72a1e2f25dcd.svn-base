/*****************************************************************************
 *	Name		:	incomeForKitPackage_UE.js
 *	Script Type	:	user event - After Record Submit. 
 *	Applies To	: 	invoices
 *
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 29/04/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To calculate and the income getting from each item in Kit/package and create journals for them
 * 
 * 	Script		: 	customscript_incomeforkitpackage
 * 	Deploy		:   customdeploy_incomeforkitpackage
 * 
 * 	Library		: library.js
 * 
 ***************************************************************************/

//declaring global variables 
var avgCostOfKit = 0.00;
var recordType = '';
var recordId = 0;
var kitPackAvgCost = 0.00;
var latestShippingCharge = 0.00;
var itemAmount = 0.00;
var itemAmounWithoutShippingCharge = 0.0;

var invoiceDate = '';
var kitItemName = '';
var memberItemName = '';
var noOfJournalLines = 0;

var journalRecord = null;
var SUSPENSEACCOUNTNUMBER = 0;
var suspenseAccountIntID = 0;

var shippingLookupFilters = new Array();
var shippingLookupColumns = new Array();
var shippingLookupResults = null;
/**********************************************************************
 * calculateKitPackAvgCost Function - the main function
 * 
 **********************************************************************/
function incomeForKitPackage(type)
{
	if(type == 'create' || type == 'edit')
	{
		//initialising the static variables use in the script
		initialise();
			
		//doing the processing
		process();
	}
	
}


/**********************************************************************
 * initialise Function - initialise the static variables use in the script
 * 
 **********************************************************************/
function initialise()
{
	try
	{
		recordId = nlapiGetRecordId();			//getting the current record internal id
		recordType = nlapiGetRecordType();		//getting the current record type
		
		SUSPENSEACCOUNTNUMBER = '4100';
		
		//getting the internal id of the account to be credited
		suspenseAccountIntID = genericSearch('account', 'number', SUSPENSEACCOUNTNUMBER);
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}



/**********************************************************************
 * process Function - call processing functions
 * 
 **********************************************************************/
function process()
{
	try
	{
		getInvoiceData();						//calling getItems function
			
	}
	catch(e)
	{
		errorHandler('process', e);
	}
}

/*****************************************************************************************
 * Note : The shipping cost  for particular member item and the kit/package is NOT taking into consideration
 * when calculating the income. Reason behind this is, the percentage that the member (without shipping)
 * dedicates on the kit/package cost (without shipping) is the same as the percentage the member (with shipping)
 * dedicates on the kit/package cost (with shipping).
 * 
 *****************************************************************************************/

/**********************************************************************
 * getInvoiceData Function - get the items and the destination in the invoice  
 * 
 **********************************************************************/
function getInvoiceData()
{
	//declaring local variables
	var noOfItems = 0;
	var itemIntId = 0;
	var itemPriceLevel = 0;
	var itemType = '';
	var itemPriceLevelName = '';
	var customerIntId = 0;
	var indexOfDel = 0;
	var submittedJournalID = 0;
	
	try
	{
		invoiceDate = nlapiGetFieldValue('trandate');						//getting invoice date
		noOfItems = nlapiGetLineItemCount('item');							//getting the no of line items in the invoice 'items' list
		
		//get the customer id in order to get the shipping address
		customerIntId = nlapiGetFieldValue('entity');
		
		//looping through each item
		for(var i = 1; i <= noOfItems; i++)
		{
			nlapiSelectLineItem('item', i);									//selecting the line item
			
			itemIntId = nlapiGetCurrentLineItemValue('item', 'item');		//getting line item's internal id
			
			//looking up for item type 
			itemType = nlapiLookupField('item', itemIntId, 'type');
			
			//if the item is a kit package, then only calculate the income
			if(itemType == 'Kit')
			{
				//calling createJournalBodyFields function
				createJournalBodyFields(invoiceDate);
				
				itemPriceLevel = nlapiGetCurrentLineItemValue('item','price');					//getting line item's price level
				itemPriceLevelName = nlapiLookupField('pricelevel', itemPriceLevel, 'name');	//getting the price level name
				indexOfDel = itemPriceLevelName.indexOf('Del', 0);								//index of 'Del' word in the price level name
				
				//item amount is (selling value of the kit - vat)
				itemAmount = nlapiGetCurrentLineItemValue('item', 'amount');					//getting line item's amount (selling price of the kit without VAT)
					
				//if the 'Del' word found
				if(indexOfDel > 0)
				{
					//getting shipping charge from the customer to calculate the selling value of the kit - vat - shipping charge from customer)
					getItemCusShippingCharge(itemPriceLevelName,itemIntId);
				}
				
				//calling the function
				getItemAndMemberItemCostAndCalculateIncome(itemIntId);
			
				//submitting the journal
				submittedJournalID = nlapiSubmitRecord(journalRecord,true);
				
			}
					
		}

	}
	catch(e)
	{
		errorHandler('getInvoiceData', e);
	}
}


/**********************************************************************
 * getItemAndMemberItemCostAndCalculatePercentage Function - get the member items and related records of the kit/package  
 * 
 **********************************************************************/
function getItemAndMemberItemCostAndCalculateIncome(kitItemIntId)
{
	//declaring local variables
	var noOfMembers = 0;
	var memberItemIntId = 0;
	var memberItemQuantity = 0;
	var memberItemAvgCost = 0.00;
	var KitRecord = null;
	var memberItemTotalCost = 0.00;
	var percentageByMemberItem = 0.00;				//percentage without delivery
	var incomePriceForMemberItem = 0.00;
	var kitItemIncomeAccountID = 0;
	var memberItemName = '';
	var memberItemRevenueAccountID = 0;
	
	try
	{
		//loading the kit item record
		KitRecord = nlapiLoadRecord('kititem', kitItemIntId);
		
		kitItemName = KitRecord.getFieldValue('itemid');				//getting the kit item name
		noOfMembers = KitRecord.getLineItemCount('member');				//getting the no of member items in the kit's members' list
		
		kitPackAvgCost = KitRecord.getFieldValue('custitem_kitpackavgcost');		//get kit Item Average cost without delivery cost
		kitItemIncomeAccountID = KitRecord.getFieldValue('incomeaccount');			//getting the income account of the kit
				
		//looping through each member
		for(var i = 1; i <= noOfMembers; i++)
		{
			memberItemIntId = KitRecord.getLineItemValue('member', 'item', i);					//getting  member item internal id
			memberItemQuantity = KitRecord.getLineItemValue('member', 'quantity', i);			//getting member item quantity
		
			memberItemAvgCost = nlapiLookupField('item', memberItemIntId, 'averagecost');		//getting the 'Average Cost' from the member item record
			
			memberItemName = nlapiLookupField('item', memberItemIntId, 'itemid');				//getting the member item name
			memberItemRevenueAccountID = nlapiLookupField('item', memberItemIntId, 'incomeaccount');
		
			//if member Item's Avg Cost  is empty:
			if(memberItemAvgCost == '')
			{
				//set the average cost as 0
				memberItemAvgCost = 0.00;
			}	
				
			//calling the calculateAvgCost function
			memberItemTotalCost = calculateTotalCostPerItem(memberItemQuantity,memberItemAvgCost);
			
			//percentage dedicated by the item without delivery
			percentageByMemberItem = calculatePercentageOnKitCostByMemberItem(memberItemTotalCost);
		
			//calling calculateIncomePriceForTheMemberItem function
			incomePriceForMemberItem = calculateIncomePriceForTheMemberItem(percentageByMemberItem);
		
			// Format : createJournalLines(totalValue, creditingAccount, debitingAccount, memo)
			createJournalLines(incomePriceForMemberItem, memberItemRevenueAccountID, suspenseAccountIntID, memberItemName)
		}
		
		// Format : createJournalLines(totalValue, creditingAccount, debitingAccount, memo)
		createJournalLines(itemAmounWithoutShippingCharge, suspenseAccountIntID, kitItemIncomeAccountID, kitItemName);
	
	}
	catch(e)
	{
		errorHandler('getItemAndMemberItemCostAndCalculatePercentage', e);
	}
	
}



/**********************************************************************
 * getLatestShippingCharge Function - getting the latest shipping cost for destiny from 'shipping lookup' custom record set
 * 
 * 		
 **********************************************************************/
function getLatestShippingCharge(item,destinationID)
{
	try
	{
		//calling searchShippingLookupRecord function
		searchShippingLookupRecord(item,destinationID);
		
		//if shipping look up record is available
		if (shippingLookupResults != null)
		{
			latestShippingCharge  = shippingLookupResults[0].getValue(shippingLookupColumns[1]);		//charge from customer
		}
		else
		{
			latestShippingCharge = 0.0;
		}
		
		latestShippingCharge = parseFloat(latestShippingCharge);
	}
	catch(e)
	{
		errorHandler('getLatestShippingCharge', e);
	}
  
}


/**********************************************************************
 * calculateTotalCostPerItem Function - calculating the total cost of member item in the kit/package 
 * 
 * @param memberItemQuantity	- no of particular items included in the kit/package 
 * @param memberItemAverageCost	- average cost of member item		
 **********************************************************************/
function calculateTotalCostPerItem(memberItemQty, memberItemAverageCost)
{
	var totalCostOfMemberItem = 0.00;
	
	try
	{
		memberItemAverageCost = parseFloat(memberItemAverageCost);			//passing the average cost to float for calculation purpose
		memberItemQty = parseInt(memberItemQty, 0);							//passing the quantity to Integer value for calculation purpose
		totalCostOfMemberItem = memberItemQty * memberItemAverageCost;		//calculating the total cost of member item
		totalCostOfMemberItem = parseFloat(totalCostOfMemberItem);			//passing the total cost to a float value 		
	
	}
	catch(e)
	{
		errorHandler('calculateTotalCostPerItem', e);
	}

	return totalCostOfMemberItem;
 
}




/**********************************************************************
 * calculatePercentageOnKitCostByMemberItem Function - calculating the percentage 
 * 						dedicated by each item cost on the kit cost without delivery
 *  
 * @param memberItemTotal			- total cost of the member item 
 **********************************************************************/
function calculatePercentageOnKitCostByMemberItem(memberItemTotal)
{
	var percentageOnKitNetCostByItem = 0.00;
	
	try
	{
		memberItemTotal = parseFloat(memberItemTotal);			//passing to float for calculation purpose
		kitPackAvgCost = parseFloat(kitPackAvgCost);			//passing to float for calculation purpose
		
		//calculating the percentage
		percentageOnKitNetCostByItem = (memberItemTotal / kitPackAvgCost) * 100;
		percentageOnKitNetCostByItem = parseFloat(percentageOnKitNetCostByItem);
	}
	catch(e)
	{
		errorHandler('calculatePercentageOnKitCostByMemberItem', e);
	}
 
	 return percentageOnKitNetCostByItem;
}



/**********************************************************************
 * getItemCusShippingCharge Function - getting the delivery charge from the customer
 *  
 **********************************************************************/
function getItemCusShippingCharge(itemPriceLvlName,itemInternalId)
{
	var destinationName = '';
	var spaceIndex = 0;
	var destinationIntID = 0;

	try
	{
		//finding the index of the space in the price level name
		spaceIndex = itemPriceLvlName.indexOf(' ');
		
		//getting the 1st two letters of the destination
		destinationName = itemPriceLvlName.substring(0,spaceIndex);
		
		//getting the destination internal ID
		destinationIntID = genericSearch('customrecord_shipping_destination', 'name', destinationName);
		
		getLatestShippingCharge(itemInternalId,destinationIntID);
		
	}
	catch(e)
	{
		errorHandler('getItemCusShippingCharge', e);
	}


}



/**********************************************************************
 * calculateIncomePriceForTheMemberItem Function - getting the delivery charge from the customer
 *  
 **********************************************************************/
function calculateIncomePriceForTheMemberItem(percentageDedicated)
{
	var incomeFromItem = 0.00;
	
	try
	{
		//passing the values to float value for calculation purpose
		itemAmount = parseFloat(itemAmount);
		latestShippingCharge = parseFloat(latestShippingCharge);
		
		itemAmounWithoutShippingCharge = (itemAmount - latestShippingCharge);
		itemAmounWithoutShippingCharge = parseFloat(itemAmounWithoutShippingCharge);
		
		//calculating the income from particular member item in the kit
		incomeFromItem = (percentageDedicated/100) * (itemAmounWithoutShippingCharge);
		incomeFromItem = parseFloat(incomeFromItem);
	}
	catch(e)
	{
		errorHandler('calculateIncomePriceForTheMemberItem', e);
	}

	return incomeFromItem;
}




/**********************************************************************
 * postJournals Function - creating and posting the journals into NetSuite
 * 
 * @param amount - amount of the particular line item (the amount to be debited and credited)
 **********************************************************************/
function postJournals(amount)
{
	var journalDesc = '';
	
	try
	{
		
		journalDesc = 'Item revenue account to deferred revenue account transfer for Invoice: ' +invoiceID;

		/*
		 * Creating the journal - Library Function
		 * The format is  : createJournal(totalValue, creditingAccount, debitingAccount, dept, location, subsidiary, jClass, invDate, desc, entity)
		 * 
		 */
		
			createJournal(amount, ItemRevenueAccountIntID, deferredRevenueAccountIntID, departmentIntID, locationIntID, 0, 0, invoiceDate, journalDesc, customerIntID);
	}
	catch(e)
	{
		
		errorHandler('postJournals', e);
	}


}





/**
 * create journal  
 * version 1.1.2 - 06/05/2013 - added createJournal function - AS
 */
function createJournalBodyFields(invDate)
{
	var currency = 0;
	
	try
	{
		
		// get the journal record
		journalRecord = nlapiCreateRecord('journalentry');

		journalRecord.setFieldValue('trandate',invDate);
		journalRecord.setFieldValue('reversaldefer','F');
		journalRecord.setFieldValue('approved','T');
		
		currency = genericSearch('currency', 'name', 'GBP');		//british Pound
		
		journalRecord.setFieldValue('currency',currency);		
		
	}
	catch(e)
	{
		errorHandler('createJournal', e);
	}             

} 
 



/**
 * create journal  
 * version 1.1.2 - 06/05/2013 - added createJournal function - AS
 */
function createJournalLines(totalValue, creditingAccount, debitingAccount, memo)
{
	try
	{
		//convert everything to a float as we are dealing with currency
		totalValue = convertToFloat(totalValue);
		debitingAccount = parseFloat(debitingAccount);
		creditingAccount = parseFloat(creditingAccount);

		// credit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',creditingAccount);
		journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
		
		journalRecord.setCurrentLineItemValue('line','memo', memo);
		journalRecord.commitLineItem('line');   
		
		// debit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',debitingAccount);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(totalValue));

		journalRecord.setCurrentLineItemValue('line','memo', memo);
		journalRecord.commitLineItem('line');                  

		
	}
	catch(e)
	{
		errorHandler('createJournal', e);
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
  
}

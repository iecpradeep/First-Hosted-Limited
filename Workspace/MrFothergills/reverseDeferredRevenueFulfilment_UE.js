/*****************************************************************************
 *	Name		:	reverseRevenueInvoice_UE.js
 *	Script Type	:	user event - After Record Submit "Item Fulfillment". 
 *	Applies To	: 	item Fulfilment
 *
 *	Client		: 	Mr. Fothergills
 *
 *	Version		:	1.0.0 - 07/05/2013  First Release - AS
 *					1.0.1 - 16/05/2013 - making the journals when the status is set to 'Shipped' - AS
 *					1.0.2 - 24/06/2013 - including making of journals for P&P items as well - AS
 *					
 * 	Author		:	FHL 
 * 	Purpose		:	To reverse the deferred revenue that has been reversed in Invoices
 * 					(create journals for fulfilment line items)
 * 
 * 	Script		: 	customscript_reversedrfulfilment  
 * 	Deploy		:   customdeploy_reversedrfulfilment
 * 
 * 	Library		: 	library.js
 * 
 ***************************************************************************/

var DEFERREDREVENUEACCOUNTNUMBER = 0;
var ItemRevenueAccountIntID = 0;
var deferredRevenueAccountIntID = 0;
var customerIntID = 0;
var departmentIntID = 0;
var locationIntID = 0;
var fulfilmentDate = '';
var fulfilmentID = 0;
var createdFromrecordIntID = 0;
var itemIntId = 0;
var itemRate = 0.00;
var itemQuantity = 0;
var fulfillRecord = '';
var salesOrderRecord = '';
var itemType = '';
var serviceItemFlag = 'F';
var ItemFound = 'F';
var SOItemIntId = 0;
var noOfLineItems = 0;
var oldJournalList = new Array();
var pandpJournalList = new Array();
var newJournalList = new Array();
var journalList = new Array();
var pandpJournalIDs = new Array();
var pandpArrayIndex = 0;
var fulfilmentIntID = 0;
var fulfilmentIDs = new Array();
var firstFulfilmentID = 0;
var currentFulfilmentIntID = 0;

/**********************************************************************
 * calculateKitPackAvgCost Function - the main function
 * 
 **********************************************************************/
function reverseRevenue(type)
{
	//initialising the static variables use in the script
	initialise(type);

	//doing the processing
	process(type);

}


/**********************************************************************
 * initialise Function - initialising the static variables used in the script
 * 
 **********************************************************************/
function initialise(type)
{ 
	try
	{
		context = nlapiGetContext();
		DEFERREDREVENUEACCOUNTNUMBER = '24160';		//referred revenue account number

		//getting the internal id of the account to be credited
		deferredRevenueAccountIntID = genericSearch('account', 'number', DEFERREDREVENUEACCOUNTNUMBER);

		/***
		 * getting old journal list in order to check the new changes in the lines and add/delete the journals accordingly 
		 ***/
		if(type != 'create')
		{
			oldJournalList = getOldJournalsList(type,'custscript_oldjournallistfulfilment');
			nlapiLogExecution('debug', 'initialise oldJournalList', oldJournalList);
			pandpJournalList = getOldJournalsList(type, 'custscript_pandpjournallist');
			nlapiLogExecution('debug', 'initialise pandpJournalList', pandpJournalList);
		}
		
		if(type != 'delete')
		{		
			//to get the transaction ID of the currently creating record
			fulfilmentIntID = nlapiGetRecordId();
			fulfillRecord = nlapiLoadRecord('itemfulfillment', fulfilmentIntID);
			fulfilmentID = fulfillRecord.getFieldValue('tranid');
	
		}
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}

}



/**********************************************************************
 * process Function - doing the processing 
 * 
 * version 1.0.
 **********************************************************************/
function process(type)
{
	try
	{
		//calling checkFulfilStatus function
		checkFulfilStatus(type);

	}
	catch(e)
	{
		errorHandler('process', e);
	}

}




/**********************************************************************
 * checkFulfilStatus Function - get fulfil record fields and posting journals
 * 
 * version 1.0.1 - 16/05/2013 - making the journals when the status is set to 'Shipped' - AS
 * 
 * NOTE : Status Internal IDs
 * 		A - Picked
 * 		B - Packed
 * 		C - Shipped
 * 
 **********************************************************************/
function checkFulfilStatus(type)
{
	//declaring local variables
	var status = '';

	try
	{

		status = nlapiGetFieldValue('shipstatus');							//getting status
		createdFromrecordIntID =nlapiGetFieldValue('createdfrom');			//sales order reference related to fulfilment
		noOfLineItems = nlapiGetLineItemCount('item');

		//version 1.0.1
		//if status is shipping
		if(status == 'C')
		{
			getSOFieldsAndItemLinesAndProcess(type);						//calling the getSOFieldsAndItemLinesAndProcess Function

		}	

	}
	catch(e)
	{
		errorHandler('checkFulfilStatus', e);
	}

}


/**********************************************************************
 * getSOFieldsAndItemLines Function - getting sales order fields and line items of SO and process the data
 * 
 * version 1.0.2 - including making of journals for P&P items as well
 **********************************************************************/
function getSOFieldsAndItemLinesAndProcess(type)
{
	//declaring local variables
	var noOfSOLineItems = 0;
	var returnedValue = '';
	var pandpRecog = 'F';
	var existingJournalIntID = 0;
	var journalDesc = '';
	var itemAmt = 0;
	var newJournalIntID = 0;

	try
	{
		//loading sales order related to fulfilment
		salesOrderRecord = nlapiLoadRecord('salesorder', createdFromrecordIntID);
		departmentIntID = salesOrderRecord.getFieldValue('department');					//getting department int ID
		noOfSOLineItems = salesOrderRecord.getLineItemCount('item');					//get no of line items in SO
		pandpRecog = salesOrderRecord.getFieldValue('custbody_pandprecognized');		//getting the 'P&P recognized' field value
		
		getJournalListBeforeChanges();													//calling getJournalListBeforeChanges function
		
		//journal description to use in the journal creation
		journalDesc = 'Item revenue account to deferred revenue account transfer for Fulfilment: ' + fulfilmentID;
		
		//looping through each line item in SO
		for(var i = 1; i <= noOfSOLineItems; i++)
		{
			SOItemIntId = salesOrderRecord.getLineItemValue('item', 'item', i);			//getting  line item internal id
			itemType = nlapiLookupField('item', SOItemIntId, 'type');					//getting the type of the SO item's line item
			itemQuantity = salesOrderRecord.getLineItemValue('item', 'quantity', i);	//getting the amount of the line item		

			//calling the compareFulfilItems function
			returnedValue = getAndCompareFulfilItems();

			//if the SO item is in the fulfilment record
			if(ItemFound == 'T')
			{
				//getting the related journal int id
				existingJournalIntID = nlapiGetLineItemValue('item','custcol_revjournalref',returnedValue);
			}
			
			//version 1.0.2
			//if the item type is 'service' and the p&p is not recognized or item found in the fulfilment record
			//(reason : the P&P items will not be shown in the item fulfilment records)
			if(((itemType == 'Service') && (pandpRecog == 'F')) || ItemFound == 'T')
			{
				itemRate = salesOrderRecord.getLineItemValue('item', 'rate', i);		//getting item rate for price calculation
				itemRate = parseFloat(itemRate);

				itemAmt = calculatePrice();												//calling calculatePrice function
				getItemAccountInternalID();												//Calling getItemAccountsInternalIDs function

				/******
				 * when the invoice is created, a new journal will be created as well
				 *****/ 
				if(type == 'create')
				{
					//calling postAndSetJrnlRefFulfil function
					newJournalIntID = postAndSetJrnlRefFulfil(journalDesc,fulfillRecord,itemAmt,returnedValue,'item', 'custcol_revjournalref', ItemRevenueAccountIntID,deferredRevenueAccountIntID,fulfilmentDate);
					setJournalArrayValues(newJournalIntID, i);
				}

				/*****
				 * when the invoice is edited, if no journal found for each line item, 
				 * then create new journal, otherwise edit the existing journal
				 *****/
				else if(type == 'edit')
				{
					//if no journal for the line item	
					//(reason : the creating of fulfilment can be go through picked, packed and shiped statuses. creating of journals is done in the 'shiped' status)
					if(existingJournalIntID == null || existingJournalIntID == 0)
					{
						newJournalIntID = postAndSetJrnlRefFulfil(journalDesc,fulfillRecord,itemAmt,returnedValue,'item', 'custcol_revjournalref', ItemRevenueAccountIntID,deferredRevenueAccountIntID,fulfilmentDate);
						setJournalArrayValues(newJournalIntID, i);
					}

					//if there is an existing journal already (if the fulfilment record is created directly with 'shiped' status)
					else
					{
						recordType = 'editing';
						editJournal(existingJournalIntID, itemAmt);						//calling the editJournal function
					}
				}

				ItemFound = 'F'; 			//setting ItemFound back to false
			}
		}
		
		pandpArrayIndex = 0;

		//if the invoice is not deleted
		if(type != 'delete')
		{
			nlapiSubmitRecord(fulfillRecord);			//submit the filfilment to save the changes
	
		}
		
		//checkAndDeleteJournals(newJournalList);			//calling checkAndDeleteJournals function 

		//if the invoice is edited/ deleted
		if(type != 'create')
		{
			//assign the newJournalList to journalList array
			journalList = newJournalList;
		}

		if(type == 'delete')
		{
			journalList = new Array();
			pandpJournalIDs = new Array();
		}

		//setting the journal list to a parameter to comparison purposes 
		nlapiGetContext().setSessionObject('custscript_oldjournallistfulfilment', journalList);
		
		if(pandpJournalIDs != '')
		{
		nlapiGetContext().setSessionObject('custscript_pandpjournallist', pandpJournalIDs);
		}
				
		//calling deleteAllJournalsInFulfilment function
		deleteAllJournalsInFulfilment(pandpRecog);
	
	}
	catch(e)
	{
		errorHandler('getSOFieldsAndItemLinesAndProcess', e);
	}

}



/**********************************************************************
 * setJournalArrayValues Function - populate the arrays with the journal's internal ids and setting the 
 * 					sales order field value 
 **********************************************************************/
function setJournalArrayValues(newJrnlID, SOLineIndex)
{
	try
	{
		if (newJrnlID > 0)
		{
			//if the item is a service item (P&P item)
			if(itemType == 'Service')
			{
				//populate the P&P journal array with the P&P journal ids
				pandpJournalIDs[pandpArrayIndex] = newJrnlID;
				pandpArrayIndex = pandpArrayIndex + 1;
				
				firstFulfilmentID = nlapiGetRecordId();				//get the current fulfilment id
				nlapiGetContext().setSessionObject('custscript_firstfulfilmentid', firstFulfilmentID);			//set the fulfilment id as a parameter
								
				//setting the 'P&P recognized' field to true
				salesOrderRecord.setFieldValue('custbody_pandprecognized', 'T');
				nlapiSubmitRecord(salesOrderRecord);		//submit the sales order to save the changes

			}
			else
			{
				//populate set the newJournal array with the normal journal ids
				newJournalList[SOLineIndex-1] = newJrnlID;		
			}					
		}
	}
	catch(e)
	{
		errorHandler('setJournalArrayValues', e);
	}
}		


/**********************************************************************
 * getJournalListBeforeChanges Function - get the list of journal ids before the 
 * 							fulfilment record changes. 
 **********************************************************************/
function getJournalListBeforeChanges()
{
	var currentJournalIntID = 0;

	try
	{
		//getting the journal list before making changes 
		for(var x = 1; x <= noOfLineItems ;  x++)
		{
			currentJournalIntID = nlapiGetLineItemValue('item','custcol_revjournalref',x);
	
			if(currentJournalIntID > 0)
			{
				//put the journal IDs into arrays
				journalList[x-1] = currentJournalIntID;
				newJournalList[x-1] = currentJournalIntID;
			}	


		}
	}
	catch(e)
	{
		errorHandler('getJournalListBeforeChanges', e);
	}
}




/**********************************************************************
 * deleteAllJournalsInFulfilment Function - delete all the journals related to 
 * 						the fulfilment record when the fulfilment record is deleted. 
 **********************************************************************/
function deleteAllJournalsInFulfilment(pandpRecognizd)
{
	var firstFulfilment = 0;

	try
	{
		//reading the script parameter value
		firstFulfilment = context.getSessionObject('custscript_firstfulfilmentid');
		
		currentFulfilmentIntID = nlapiGetRecordId();
		
		if(type == 'delete')
		{

			for(var y = 0 ; y < newJournalList.length; y++ )
			{
				//deleting the particular normal journal
				nlapiDeleteRecord('journalentry', newJournalList[y]);

			}
		
			//deleting the P&P journals
			if(pandpRecognizd == 'T' && (firstFulfilment == currentFulfilmentIntID))
			{
				for(var z = 0 ; z < pandpJournalList.length; z++ )
				{
					nlapiDeleteRecord('journalentry', pandpJournalList[z]);

				}

				//setting the 'P&P recognized' field to false
				salesOrderRecord.setFieldValue('custbody_pandprecognized', 'F');
				nlapiSubmitRecord(salesOrderRecord);		//submit the sales order to save the changes
				
				//setting the 'First Fulfilment ID' parameter back to 0
				nlapiGetContext().setSessionObject('custscript_firstfulfilmentid', 0);
			}
		}
	}
	catch(e)
	{
		errorHandler('deleteAllJournalsInFulfilment', e);
	}
}




/**********************************************************************
 * compareFulfilItems Function - compare the SO line items and the fulfilment line items
 * 
 **********************************************************************/
function getAndCompareFulfilItems()
{
	var retVal = '';

	try
	{
		customerIntID = nlapiGetFieldValue('entity');						//getting customer's internal ID
		fulfilmentDate = nlapiGetFieldValue('trandate');					//getting fulfilment date

		//looping through each line item
		for(var i = 1; i <= noOfLineItems; i++)
		{
			itemIntId = nlapiGetLineItemValue('item', 'item', i);			//getting  line item internal id of the fulfilment item
		
			//if the fulfilment item and the SO item is equal
			if(SOItemIntId == itemIntId)
			{
				//set Item is found
				ItemFound = 'T';
				
				itemQuantity = nlapiGetLineItemValue('item', 'quantity', i);	//getting the amount of the line item		
				locationIntID = nlapiGetLineItemValue('item', 'location', i);	//getting location int ID

				SOItemIntId = itemIntId;		//setting the SO item to the fulfilment item
				retVal = i;						//return the line item number of the fulfilment record
				return retVal;
			}
			else
			{
				retVal = 0;
			}
		}
	}
	catch(e)
	{
		errorHandler('getAndCompareFulfilItems', e);
	}
	return retVal;
}


/**********************************************************************
 * calculatePrice Function - calculating the amount (total amount without VAT) of the item
 * 
 * @param itemInternalID - internal id of the item in particular line item
 **********************************************************************/
function calculatePrice()
{ 
	var itemAmount = 0; 
	
	try
	{
		itemQuantity = parseInt(itemQuantity, 0);
		itemAmount = itemQuantity * itemRate;
		itemAmount = convertToFloat(itemAmount);
		
	}	
	catch(e)
	{
		errorHandler('calculatePrice', e);

	}

	return itemAmount;
}


/**********************************************************************
 * getItemAccountInternalID Function - getting the item revenue account
 * 
 * @param itemInternalID - internal id of the item in particular line item
 **********************************************************************/
function getItemAccountInternalID()
{
	try
	{
		//getting revenue account id of the particular item in the line
		ItemRevenueAccountIntID = nlapiLookupField('item', SOItemIntId, 'incomeaccount');

	}	
	catch(e)
	{
		errorHandler('getItemAccountsInternalIDs', e);

	}
}



/**********************************************************************
 * editJournal Function - editing the existing journal in NetSuite
 * 
 * @param amount - amount of the particular line item (the amount to be debited and credited)
 **********************************************************************/
function editJournal(journalID, amount)
{
	var journalDesc = '';
	var journalRecord = null;
	var noOfJournalLines = 0;
	var totalValue = 0;
	var submittedJournal = 0;
	
	try
	{
		//convert everything to a float as we are dealing with currency
		totalValue = parseFloat(amount);
		debitingAccount = parseFloat(deferredRevenueAccountIntID);
		creditingAccount = parseFloat(ItemRevenueAccountIntID);

		//loading the journal record
		journalRecord = nlapiLoadRecord('journalentry', journalID);

		//getting the count of line items in the journal record
		noOfJournalLines = journalRecord.getLineItemCount('line');

		for(var index = noOfJournalLines; index >= 1; index--)
		{
			journalRecord.selectLineItem('line', index);		//selecting the line item
			journalRecord.removeLineItem('line', index);		//removing the line item
		}

		//calling the setJournalLineItems function
		journalDesc = 'Item revenue account to deferred revenue account transfer for fulfilment: ' + fulfilmentID;
		setJournalLineItems(journalDesc,journalRecord,totalValue, creditingAccount, debitingAccount, departmentIntID, locationIntID, customerIntID);

		//saving the changes in the journal by submitting the journal
		submittedJournal = nlapiSubmitRecord(journalRecord,true);

	}
	catch(e)
	{
		errorHandler('editJournal', e);
	}

}



/**********************************************************************
 * checkJournals Function - compare the old and new journal arrays and 
 * 							determine which journals needs to be deleted 
 * used when the line items has been deleted
 **********************************************************************/
function checkAndDeleteJournals(newJournal)
{
	var foundFlag = 'F';

	try
	{
		nlapiLogExecution('debug', 'checkJournals oldJournalList', oldJournalList);
		nlapiLogExecution('debug', 'checkJournals newJournal', newJournal);

		//looping through the old journal list
		for(var y = 0; y < oldJournalList.length; y++)
		{
			//looping through the new journal list 
			for(var z = 0; z < newJournal.length; z++)
			{
				//if old journal id is found in the new journal list 
				if(oldJournalList[y] == newJournal[z])
				{
					foundFlag = 'T';

					//to exit the current loop
					z = newJournal.length -1;
				}
				else
				{
					foundFlag = 'F';
				}

			}

			//if the old journal id is not found in the new journal list
			if(foundFlag == 'F')
			{
				//delete the old journal
				nlapiDeleteRecord('journalentry',oldJournalList[y]);
			}
		}
	}	
	catch(e)
	{
		errorHandler('checkAndDeleteJournals', e);

	}

}




/**
 * generic search - returns array of internal IDs
 * 
 */
function genericSearchArraySort(table, fieldToSearch, valueToSearch)
{
	var internalIDs = new Array();

	// Arrays
	var filters = new Array();
	var columns = new Array();
	var results = null;

	try
	{
		//search filters                  
		filters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
		filters[1] = new nlobjSearchFilter('mainline', null, 'is','T');   
		
		// return columns
		columns[0] = new nlobjSearchColumn('internalid');

		// perform search
		results = nlapiSearchRecord(table, null, filters, columns);

		if(results != null)
		{
			for (var i = 0; i < results.length; i++)
			{	
				internalIDs[i] = results[i].getValue('internalid');
			}
			
			internalIDs.sort(function(a, b)
			{
				var retVal = -1;
				
				if(a > b)
				{
					retVal = 1;
				}
				
				return retVal; 
			});
		}
	}
	catch(e)
	{
		errorHandler("genericSearchArraySort", e);
	}     	      

	return internalIDs;
}



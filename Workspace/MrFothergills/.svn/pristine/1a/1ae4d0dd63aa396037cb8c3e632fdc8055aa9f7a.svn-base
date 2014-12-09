/*****************************************************************************
 *	Name		:	reverseRevenueInvoice.js
 *	Script Type	:	user event - After Record Submit of invoice. 
 *	Applies To	: 	invoices
 *
 *	Client		: 	Mr. Fothergills
 *
 *	Version		:	1.0.0 - 06/05/2013  First Release - AS
 *					1.0.1 - 21/06/2013 - setting the journal ref in the column in the invoice - AS
 *					1.0.2 - 05/07/2013 - adding the creation, deletion and editing of the 
 *										 journals according to the edit, create and delete of 
 *										 the invoice and invoice lines - AS  
 *					1.0.3 - 19/07/2013 - re-formatting - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To reverse the revenue from the sales
 * 
 * 	Script		: 	customscript_reverserevenueinvoice
 * 	Deploy		:   customdeploy_reverserevenueinvoice
 * 
 * 	Library		: library.js
 * 
 ***************************************************************************/

var DEFERREDREVENUEACCOUNTNUMBER = 0;
var ItemRevenueAccountIntID = 0;
var deferredRevenueAccountIntID = 0;
var customerIntID = 0;
var departmentIntID = 0;
var locationIntID = 0;
var invoiceDate = '';
var invoiceID = 0;
var invoiceRecord = '';
var noOfLineItems = 0;
var oldJournalList = new Array();
var context = '';
var ItemFound = 'F';
	
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
	var invoiceIntID = 0;
	
	try
	{
		context = nlapiGetContext();
		
		DEFERREDREVENUEACCOUNTNUMBER = '24160';
				
		//getting the internal id of the account to be credited
		deferredRevenueAccountIntID = genericSearch('account', 'number', DEFERREDREVENUEACCOUNTNUMBER);
		
		/***
		 * getting old journal list in order to check the new changes in the lines and add/delete the journals accordingly 
		 ***/
		oldJournalList = getOldJournalsList(type,'custscript_oldjournallistinvoice');
		
		//if statement reason : to stop throwing an error when deleting
		if(type != 'delete')
		{
			//to get the transaction ID of the currently creating record
			invoiceIntID = nlapiGetRecordId();						//getting internal id of the current invoice

			invoiceRecord = nlapiLoadRecord('invoice', invoiceIntID);		//load the invoice
			invoiceID = invoiceRecord.getFieldValue('tranid');				//getting the transaction id
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
 **********************************************************************/
function process(type)
{
	try
	{
		//calling the getFieldsAndItemLines Function
		getFieldsAndItemLines(type);

	}
	catch(e)
	{
		errorHandler('process', e);
	}

}



/**********************************************************************
 * getFieldAndItemLines Function - getting the required field values 
 * 									and line item values, get accounts
 * and post,delete or edit the journals for each line item depending on the 
 * mode (create, edit,delete) of the record
 * 								
 * version 1.0.1 - setting the journal ref in the column in the invoice
 * version 1.0.2 - adding the creation, deletion and editing of the 
 *				   journals according to the edit, create and delete of 
 *				   the invoice and invoice lines - AS  
 **********************************************************************/
function getFieldsAndItemLines(type)
{
	//declaring local variables
	var itemIntId = 0;
	var itemAmount = 0.00;
	var existingJournalIntID = 0;
	var journalExist = 'T';
	var newJournalList = new Array();
	var journalList = new Array();
	var journalDesc = '';
	
	try
	{
		customerIntID = nlapiGetFieldValue('entity');				//getting customer's internal ID
		departmentIntID = nlapiGetFieldValue('department');			//getting department int ID
		locationIntID = nlapiGetFieldValue('location');				//getting location int ID
		invoiceDate = nlapiGetFieldValue('trandate');				//getting invoiced date
		noOfLineItems = nlapiGetLineItemCount('item');				//getting the no of line items 


		/**********************************************************************************
		 * To record the old journal List belongs to the invoice before making the changes
		 **********************************************************************************/
		//looping through each line item
		for(var i = 1; i <= noOfLineItems; i++)
		{
			itemIntId = nlapiGetLineItemValue('item', 'item', i);		//getting  line item internal id
			itemAmount = nlapiGetLineItemValue('item', 'amount', i);	//getting the amount of the line item		

			getItemAccountInternalID(itemIntId);						//Calling getItemAccountsInternalIDs function

			existingJournalIntID = nlapiGetLineItemValue('item','custcol_revjournalref',i);

			if(existingJournalIntID > 0)
			{
				//put the journal IDs into an array
				journalList[i-1] = existingJournalIntID;
				newJournalList[i-1] = existingJournalIntID;
			}

			journalDesc = 'Item revenue account to deferred revenue account transfer for Invoice: ' +invoiceID;

			/******
			 * when the invoice is created, a new journal will be created as well
			 *****/ 
			if(type == 'create')
			{

				postAndSetJrnlRefInvoice(journalDesc,invoiceRecord,itemAmount,i,'item', 'custcol_revjournalref', deferredRevenueAccountIntID, ItemRevenueAccountIntID,invoiceDate);

			}

			/*****
			 * when the invoice is edited, if no journal found for each line item, 
			 * then create new journal, otherwise edit the existing journal
			 *****/
			else if(type == 'edit')
			{
				if(existingJournalIntID == null)				//if no journal for the line item	
				{
					postAndSetJrnlRefInvoice(journalDesc,invoiceRecord,itemAmount,i,'item', 'custcol_revjournalref', deferredRevenueAccountIntID, ItemRevenueAccountIntID,invoiceDate);

					if(journalIntID > 0)						//if a journal has created
					{	
						newJournalList[i-1] = journalIntID;		//put the newly created journal id to the newJournalList array
					}

				}
				else											//if there is an existing journal already 
				{
					editJournal(existingJournalIntID,itemAmount);		//calling the editJournal function
				}

			}

			/******
			 * if the invoice is deleted
			 * 
			 *****/
			else if(type == 'delete')
			{
				nlapiDeleteRecord('journalentry', existingJournalIntID);		//deleting the particular journal
			}

		}

		if(type != 'delete')							//if the invoice is not deleted
		{
			nlapiSubmitRecord(invoiceRecord);			//submit the invoice to save the changes
		}

		journalExist = checkJournals(newJournalList);	//calling checkJournals function 

		if(type != 'create')							//if the invoice is edited/ deleted
		{
			journalList = newJournalList;				//assign the newJournalList to journalList array
		}


		//setting the journal list to a parameter to comparison purposes 
		nlapiGetContext().setSessionObject('custscript_oldjournallistinvoice', journalList);

	}
	catch(e)
	{
		errorHandler('getFieldsAndItemLines', e);
	}

}



/**********************************************************************
 * checkJournals Function - compare the old and new journal arrays and 
 * 							determine which journals needs to be deleted 
 * 
 **********************************************************************/
function checkJournals(newJournal)
{
	var foundFlag = 'F';
	
	try
	{
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
		errorHandler('checkJournals', e);

	}

}


/**********************************************************************
 * getItemAccountsInternalIDs Function - getting the revenue account of particular item
 * 
 * @param itemInternalID - internal id of the item in particular line item
 **********************************************************************/
function getItemAccountInternalID(itemInternalID)
{
	try
	{
		//getting revenue account id of the particular item in the line
		ItemRevenueAccountIntID = nlapiLookupField('item', itemInternalID, 'incomeaccount');

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
	
	try
	{
		//convert everything to a float as we are dealing with currency
		totalValue = parseFloat(amount);
		creditingAccount = parseFloat(deferredRevenueAccountIntID);
		debitingAccount = parseFloat(ItemRevenueAccountIntID);
		
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
		journalDesc = 'Item revenue account to deferred revenue account transfer for Invoice: ' + invoiceID;
		setJournalLineItems(journalDesc,journalRecord,totalValue, creditingAccount, debitingAccount, departmentIntID, locationIntID, customerIntID);

		//saving the changes in the journal by submitting the journal
		nlapiSubmitRecord(journalRecord,true);
	}
	catch(e)
	{
		errorHandler('editJournal', e);
	}

}





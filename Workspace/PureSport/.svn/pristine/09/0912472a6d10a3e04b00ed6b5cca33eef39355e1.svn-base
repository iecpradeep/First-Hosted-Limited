
/*******************************************************
 * Name:             Pure Rugby Transaction script
 * Script Type:      User Event
 * Version:          1.2.0
 * Date:             4th October 2011 - 13th February 2012
 * Author:           Peter Lewis, First Hosted Limited.
 *******************************************************/



/***
 * AfterTXSubmit (User Event)
 * @param type. Automatically passed from NetSuite - this is the event type being actioned, e.g. Create, Edit, Delete...
 * @returns {Boolean}. This is whether it was successful or not.
 */

function AfterTXSubmit(type)
{

	//var context = nlapiGetContext();
	var iCount = 0;
	var i = 1;
	var TheRecord = '';
	var TheRecordID = 0;
	var TheItemID = 0;
	var TheItem = '';
	var TheRecordType = '';
	var TheParentItemID = 0;
	var TheParentItem = '';


	//On both Create, Edit and XEdit of the Transaction...
	if (type == 'create' || type == 'edit' || type == 'xedit')
	{
		try
		{
			TheRecordID = nlapiGetRecordId();
			TheRecordType = nlapiGetRecordType();
			TheRecord = nlapiLoadRecord(TheRecordType , TheRecordID , null);
			iCount = TheRecord.getLineItemCount('item');

			nlapiLogExecution('DEBUG', 'Record ID', TheRecordID);

			if(1 == 2)
			{
				//Stop the annoying warnings...
				alert(iCount + i + TheItem + TheItemID + TheRecord + TheRecordID + TheRecordType);
			}

		}
		catch(e)
		{
			nlapiLogExecution('ERROR', 'Error loading record ' + TheRecordID, e.message);
		}

		if(iCount == 0)
		{
			//ignore it.
			return true;
		}

		for(i = 1; i<= iCount; i++)
		{

			try
			{      
				//nlapiLogExecution('DEBUG', 'For loop', i);
				TheItemID = TheRecord.getLineItemValue('item', 'item', i);


				switch(TheItemID.toString())
				{
				case '7012':
				case '7011':
				case '6995':
				case '6967':
				case '6998':
				case '6966':
					nlapiLogExecution('DEBUG', 'Discount detected','Ignoring this record...');
					break;
				case '9929':
					nlapiLogExecution('DEBUG', 'Web Personalisation detected','Ignoring this record...');
					break;
				case '9801':
					nlapiLogExecution('DEBUG', 'Web Delivery detected','Ignoring this record...');
					break;
				case '10998':
					nlapiLogExecution('DEBUG', 'Carrier Bag detected','Ignoring this record...');
					break;
				default:
					//nlapiLogExecution('DEBUG', 'ItemID', TheItemID);
					TheItem = nlapiLoadRecord('inventoryitem', TheItemID, false); 
				nlapiLogExecution('DEBUG', 'Item Loaded. Tripping LastModified...','custitem_update');

				//###############################
				//parent
				TheParentItemID = TheItem.getFieldValue('parent');

				var TheDate = new Date();

				if(TheParentItemID == ''||TheParentItemID == null)
				{
					//ignore it
					nlapiLogExecution('DEBUG', 'No Parent Item detected...','Ignoring...');
				}
				else
				{
					nlapiLogExecution('DEBUG', 'Parent Item ID:', TheParentItemID);
					TheParentItem = nlapiLoadRecord('inventoryitem', TheParentItemID);
					TheParentItem.setFieldValue('custitem_update', TheDate.toUTCString());
					nlapiSubmitRecord(TheParentItem, false, false);

					//function extra functionality
					inventorySearch(TheParentItemID);


				}
				//this is where to add the parent item last modified trip...
				//###############################



				TheItem.setFieldValue('custitem_update', TheDate.toUTCString());
				nlapiSubmitRecord(TheItem, false, false);
				break;
				}                                 
			}
			catch(e)
			{
				//Just ignore it as it usually means it's not an inventory item.
				nlapiLogExecution('ERROR', 'Error loading item: ' + TheItemID, 'Message: ' + e.message);
			}
		}


	}
	return true;
}


function AfterSubmit(type)
{
	var context = nlapiGetContext();


	if (type == 'create' && context.getExecutionContext() == 'webservices') 
	{

		nlapiLogExecution('DEBUG', 'Status', '*** START ***');


		//Obtain a handle to the newly created cash sale
		var csRecord = nlapiGetNewRecord();
		var csRecordId = csRecord.getId();

		nlapiLogExecution('DEBUG', 'Cash Sale Id', csRecordId);


		// cash sale journal for allocating payment amounts
		var totalValue = csRecord.getFieldValue('total');
		var cashValue = csRecord.getFieldValue('custbody_epos_cash_amount');
		var cardValue = csRecord.getFieldValue('custbody_epossalecardamount');

		nlapiLogExecution('DEBUG', 'Total Value', totalValue);
		nlapiLogExecution('DEBUG', 'Cash Value', cashValue);
		nlapiLogExecution('DEBUG', 'Card Value', cardValue);


		var jnl = createJournal(totalValue,cashValue,cardValue);

		nlapiLogExecution('DEBUG', 'Journal Id', jnl);
		nlapiLogExecution('DEBUG', 'Status', '*** END ***');
	} //if
	return true;
} //function






function inventorySearch(ParentItemID)

{
	
	nlapiLogExecution('DEBUG', 'Searching for Item Quantities...', 'Inventory Search - ParentID: ' + ParentItemID);
	try
		{
			var ParentRecord = nlapiLoadRecord('inventoryitem', ParentItemID);
			var ItemFilters = new Array();
			
			// Define search filter
			ItemFilters[0] = new nlobjSearchFilter('parent', null, 'is', ParentItemID);
			//itemfilter[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		
			var ItemColumns = new Array();
			// Define column filters
			ItemColumns[0] = new nlobjSearchColumn('quantityonhand');
			//columns[1] = new nlobjSearchColumn('internalid');
		
			var SearchResults = nlapiSearchRecord('inventoryitem', null, ItemFilters, ItemColumns);
			//nlapiLogExecution('DEBUG', 'Search Results', SearchResults[0]);
			

			if(SearchResults == null)
			{
				//no results
				nlapiLogExecution('DEBUG', 'Results', 'No Child Items are associated');
			}
			else
			{
				//searchresults.length; //is the num of results returned;
				var OnHandQty = SearchResults[0].getValue('quantityonhand', null, 'sum');
				ParentRecord.setFieldValue('custitem_itemstock', OnHandQty);
				nlapiLogExecution('DEBUG', 'internalid Results', 'Results length: ' + SearchResults.length);
			}
			nlapiSubmitRecord(ParentRecord);
		}
		catch(e)	
		{
			nlapiLogExecution('DEBUG', 'The inventory search did not work ', e.message);
			return true;
		}
}
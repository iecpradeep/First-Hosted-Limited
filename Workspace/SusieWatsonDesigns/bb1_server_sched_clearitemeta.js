
function ClearItemETAFromPOSearch()
{
	nlapiLogExecution("debug", "Starting", "Start");

	//Get the search results from the saved search ID=281
	var transSearchResults = nlapiSearchRecord('purchaseorder', 103, null, null);
	//nlapiLogExecution("debug", "Number of Results", transSearchResults.length);

	//Loop through the results
	for ( var i=0; transSearchResults != null && i < transSearchResults.length; i++ )
	{

		//Get the search result
		var transSearchResult = transSearchResults[ i ];

		var ItemID = transSearchResult.getValue("internalid","item");
		nlapiLogExecution("debug", "ItemID is: ", ItemID);

		//var ItemType = transSearchResult.getValue("baserecordtype_item");
		//nlapiLogExecution("debug", "ItemType is: ", ItemType);

		var qty = parseInt(transSearchResult.getValue("quantity"));
		nlapiLogExecution("debug", "qty is: ", qty);

		var qtyRecv = parseInt(transSearchResult.getValue("quantityshiprecv"));
		nlapiLogExecution("debug", "qtyRecv is: ", qtyRecv);

		var outStand = qty - qtyRecv;
		nlapiLogExecution("debug", "outStand is: ", outStand);

		var closed = transSearchResult.getValue("closed");
		nlapiLogExecution("debug", "closed is: ", closed);

		var itemRec = nlapiLoadRecord('inventoryitem', ItemID);

		if(closed=='T')
		{

			itemRec.setFieldValue("custitem_bb1_amtduein", "");
			itemRec.setFieldValue("custitem_bb1_nextdeldate", "");

		}
		else
		{

			if(outStand==0)
			{
				itemRec.setFieldValue("custitem_bb1_amtduein", "");
				itemRec.setFieldValue("custitem_bb1_nextdeldate", "");
			}
			else
			{
				itemRec.setFieldValue("custitem_bb1_amtduein", outStand);
			}
		}

		var submitID = nlapiSubmitRecord(itemRec);
		nlapiLogExecution("debug", "submitID", submitID);	

	}
}
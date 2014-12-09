function UpdateItemRecFromPOSearch()
{
	nlapiLogExecution("debug", "Starting", "Start");

	nlapiLogExecution("debug", "Process ALL", "Process ALL");
	//Get the search results from the saved search ID=49
	var transSearchResults = nlapiSearchRecord('purchaseorder', 51, null, null);
	nlapiLogExecution("debug", "Number of Results", transSearchResults.length);


	//Get the parameters
	/*
	var ctx=nlapiGetContext();
	var recid=ctx.getSetting("SCRIPT","custscript_bb1_poid");
	nlapiLogExecution("debug", "recid is: ", recid);


	// No PO specified - process ALL
	if (!recid || recid=="") 
	{
		nlapiLogExecution("debug", "Process ALL", "Process ALL");
		//Get the search results from the saved search ID=281
		var transSearchResults = nlapiSearchRecord('purchaseorder', 49, null, null);
		//nlapiLogExecution("debug", "Number of Results", transSearchResults.length);

	}

	//Process the single PO rec

	else
	{
		nlapiLogExecution("debug", "Process 1", "Process 1");
		var filters=[];
		filters[0]=new nlobjSearchFilter("internalid",null,"anyof",recid);

		var transSearchResults = nlapiSearchRecord('purchaseorder', 49, filters, null);
	}*/

	//Loop through the results
	//for ( var i=0; transSearchResults != null && i < 1; i++ )	
	for ( var i=0; transSearchResults != null && i < transSearchResults.length; i++ )
	{

		//Get the search result
		var transSearchResult = transSearchResults[ i ];

		var POID = transSearchResult.getValue("internalid",null,"group");
		nlapiLogExecution("debug", "POID is: ", POID);

		var PODueDate = transSearchResult.getValue("duedate",null,"min");
		nlapiLogExecution("debug", "PODueDate is: ", PODueDate);

		var POQuantity = transSearchResult.getValue("quantity", null,"group");
		nlapiLogExecution("debug", "POQuantity is: ", POQuantity);

		var ItemID = transSearchResult.getValue("internalid","item","group");
		nlapiLogExecution("debug", "ItemID is: ", ItemID);

		//var ItemType = transSearchResult.getValue("baserecordtype_item");
		//nlapiLogExecution("debug", "ItemType is: ", ItemType);

		var itemRec = nlapiLoadRecord('inventoryitem', ItemID);

		nlapiLogExecution("debug", "Delivery ETA is", itemRec.getFieldValue("custitem_bb1_nextdeldate"));	
		itemRec.setFieldValue("custitem_bb1_nextdeldate", PODueDate);
		itemRec.setFieldValue("custitem_bb1_amtduein", POQuantity);

		var submitID = nlapiSubmitRecord(itemRec);
		nlapiLogExecution("debug", "submitID", submitID);	

	}	



}
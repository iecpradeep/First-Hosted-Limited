








var savedSearch = 0;		// internal ID for fulfillment saved search
var searchResult = null;
var searchResults = null;	// saved search results
var fulfillmentSearchIntID = 242;
var itemQtys = new Array();
var itemQtysCopy = new Array();
var itemObj=new Object();
var itemCount = 0;
var tempSalesOrder = 0;
var qty = 0;
var item = 0;
var fulfill = false;
var salesOrderIntID = 0;
var salesOrderToFulfill = 0;



// test harness fulfill

fulfillOrders();

var a=0;

/**
 * fulfill sales orders
 */

function fulfillOrders()
{

	
	var columns = null;
	var column = null;
	
	

		
		runSavedSearchTrans(0, 100, 242);
		
		
		if (searchResults)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
			

				searchResult = searchResults[i];

				columns = searchResult.getAllColumns();
								
				column = columns[0];		// order number is 1st column from ss
				salesOrderIntID = searchResult.getValue(column);
column = columns[1];		// item
				item = searchResult.getValue(column);				

column = columns[4];		// qty
				qty = searchResult.getValue(column);
				

dealWithStoreItemQtys(i,searchResults.length);
			
				
				// fulfill the sales order
if(fulfill==true)
{
				fulfillSalesOrder(salesOrderToFulfill);
fulfill=false;
}
				
			}
		}

	

}


/**
 * fulfill individual sales order
 * you need to add a quantity to an item line on the fulfillment if the setting Setup > Accounting > Accounting Preferences > Order Management: "Default Items to Zero Received/Fulfilled" is checked.
 */

function fulfillSalesOrder(orderId)
{
    var fulfillmentId = 0;
    var itemFulfillment = null;
var itemIntId = 0;
var arrPosn = 0;
var qtyToFulFill = 0;
    
  
        itemFulfillment = nlapiTransformRecord('salesorder', orderId, 'itemfulfillment');

  var lineCount = itemFulfillment.getLineItemCount('item');

for(var i = 1; i <= lineCount; i++)
{

itemIntId = itemFulfillment.getLineItemValue('item', 'item', i);

qtyToFulFill = getItemQty(itemIntId);

if(qtyToFulFill>0)
{
itemFulfillment.setLineItemValue('item', 'quantity', i, qtyToFulFill);
}
}




        itemFulfillment.setFieldValue("shipstatus", "C");
        fulfillmentId = nlapiSubmitRecord(itemFulfillment, true);
     
   
    return fulfillmentId;
}


function getItemQty(itmIntID)
{

var itemQty = 0;
var itemObjCode = 0;
var itemObjQty = 0;

for(var i=0; i< itemQtysCopy.length; i++)
		{
			itemObj = itemQtysCopy[i];
itemObjCode = itemObj.item;
itemObjQty = itemObj.qty;

if(itmIntID == itemObjCode)
{
itemQty = itemObjQty;
break;
}

		}

return itemQty;
}


/************************************************************************************
*
* Function that runs the first saved search and write the results to the CSV File
* 1.2.4 - 05/11/2012 - amended - remove 1000 item restriction - JM
************************************************************************************/

function runSavedSearchTrans(from, to, savedSearch)
{

	var loadSearch = null;
	var runSearch = null;

	
		//Loading the saved search
		loadSearch = nlapiLoadSearch('customrecord_mrf_pickpackship', savedSearch);

		//Running the loaded search
		runSearch = loadSearch.runSearch();

		//Getting the first 1000 results
		searchResults = runSearch.getResults(from,to);
		
		

	

}

function dealWithStoreItemQtys(current, lngth)
{
	
	itemCount = itemCount + 1;

	itemObj=new Object();
	
	itemObj.item = item;
	itemObj.qty = qty;
	
if(current==0)
{
		tempSalesOrder = salesOrderIntID;
itemQtys[itemCount-1] = itemObj;

}
	
	if((salesOrderIntID!=tempSalesOrder) || lngth-1==current)
	{
itemQtys[itemCount-1] = itemObj;
salesOrderToFulfill = tempSalesOrder;
		tempSalesOrder = salesOrderIntID;
		itemQtysCopy = new Array();
		for(var i=0; i< itemQtys.length; i++)
		{
			itemQtysCopy[i] = itemQtys[i];
		}
		itemCount=1;
		itemQtys = new Array();
		fulfill = true;
	}
	
	
	itemQtys[itemCount-1] = itemObj;


}

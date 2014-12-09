
//[todo] standards requirement

function findBinName(branchId, itemId)
{
	var binId = -999;  // error condition by default
	var latestFilters = new Array();
	latestFilters[0] = new nlobjSearchFilter('internalid', null, 'is', itemId, null);  
	latestFilters[1] = new nlobjSearchFilter('location', 'binnumber', 'is', branchId); 
            
	var latestColumns = new Array();
	latestColumns[0] = new nlobjSearchColumn('name');
	latestColumns[1] = new nlobjSearchColumn('binnumber', 'binnumber');
            
	var latestSearchResults = nlapiSearchRecord('item', null, latestFilters, latestColumns);
	if (latestSearchResults != null)
	{ 
		var binName = latestSearchResults[0].getValue(latestColumns[1]);
//		nlapiLogExecution('DEBUG', 'bin name ', binName);  // don't seem to be able to get internal ID of bin directly from one search
	}  // end if (latestSearchResults != null)

	return binName;
	
} // end function findBinName


function getBinId(binName)
{
	var binId = -999;  // error condition by default
	var nextFilters = new Array();
	nextFilters[0] = new nlobjSearchFilter('binnumber', null, 'is', binName, null);
	var nextColumns = new Array();
	nextColumns[0] = new nlobjSearchColumn('binnumber');

	var nextSearchResults = nlapiSearchRecord('bin', null, nextFilters, nextColumns);
	if (nextSearchResults != null)
	{
		binId = nextSearchResults[0].getId();  // the internal ID of the bin
//		nlapiLogExecution('DEBUG', 'bin ID ', binId);
	}  // end if (nextSearchResults != null)
	
	return binId;
} // end function getBinId


function getBinName(binId)
{
	var nextFilters = new Array();
	nextFilters[0] = new nlobjSearchFilter('internalid', null, 'is', binId);
	var nextColumns = new Array();
	nextColumns[0] = new nlobjSearchColumn('binnumber');

	var nextSearchResults = nlapiSearchRecord('bin', null, nextFilters, nextColumns);
	if (nextSearchResults != null)
	{
		var binName = nextSearchResults[0].getValue(nextColumns[0]);
//		nlapiLogExecution('DEBUG', 'bin name ', binName);
	}  // end if (nextSearchResults != null)
	
	return binName;
} // end function getBinName


function binItemTotal(binName, itemId)
{
// advanced inventory: to obtain the total stock of a specific item held in a given bin

	var filters = new Array();
	var columns = new Array();

	filters[0] = new nlobjSearchFilter('internalid', null, 'is', itemId); 
	filters[1] = new nlobjSearchFilter('binnumber', null, 'is', binName);

	columns[0] = new nlobjSearchColumn('name');
	columns[1] = new nlobjSearchColumn('binonhandcount');

    var binItemTotal = 0;  // .setSummaryType('sum') only applies to nlobjSearchFilter 
	var searchResults = nlapiSearchRecord('inventoryitem', null, filters, columns);
	if (searchResults != null)
	{
		binItemTotal = parseInt(searchResults[0].getValue(columns[1]),10);
	}  // end if (searchResults != null)
	
	return binItemTotal;
	
} // end function binItemTotal


function TestBinSearch()
{
// test specific to Dilley IT NetSuite instance
	
	var iId = 215; // internal ID of inventory item: GC925.6.141 
	var bId = 33;  // internal ID of location: TS Manchester (Arndale) branch
	// bin ID should be 805
	// bin name (binnumber) should be 'TS0743'
	var testBinName = findBinName(bId, iId);
	nlapiLogExecution('DEBUG', 'Manchester bin name ', testBinName);
	var testBinId = getBinId(testBinName);
	nlapiLogExecution('DEBUG', 'Manchester bin ID ', testBinId);
	var nxtBinName = getBinName(testBinId);
	nlapiLogExecution('DEBUG', 'searched Manchester bin name ', nxtBinName);
	var testBinTotal = binItemTotal(testBinName, iId);
	nlapiLogExecution('DEBUG', 'Manchester bin total ', testBinTotal);

	bId = 7; // TS Dublin (Jervis Street) branch
	// bin ID should be 807
	// bin name (binnumber) should be 'TS0452'
    testBinName = findBinName(bId, iId);
	nlapiLogExecution('DEBUG', 'Dublin bin name ', testBinName);
	testBinId = getBinId(testBinName);
	nlapiLogExecution('DEBUG', 'Dublin bin ID ', testBinId);
	nxtBinName = getBinName(testBinId);
	nlapiLogExecution('DEBUG', 'searched Dublin bin name ', nxtBinName);
	testBinTotal = binItemTotal(testBinName, iId);
	nlapiLogExecution('DEBUG', 'Dublin bin total ', testBinTotal);

} // end function TestBinSearch()
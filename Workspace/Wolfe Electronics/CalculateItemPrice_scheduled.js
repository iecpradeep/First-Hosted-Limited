/*****************************************************************************
 *	Name		:	CalculateItemPrice
 *	Script Type	:	Scheduled 
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 13/03/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To calculate and set the shipping price for each item for each destination in pricing list
 * 
 * 	Script		: 	
 * 	Deploy		: 
 * 
 * 	Library		: 
 * 
 **********************************************************************/
//Declaring global variables
var context = null;
var itemIntID = 0;

/***************************************************************************
 * 
 * calculateItemPrice Function - The main function
 * 
 **************************************************************************/
function calculateItemPrice()
{
	try
	{
		//Call initialiseDates function
		initialise();
		loadItems();
		
	}
	catch(e)
	{
		errorHandler("calculateItemPrice : " +e);
	} 
}




/**********************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * 
 * 
 **********************************************************************/
function initialise()
{
	context = nlapiGetContext();

	//itemIntID = context.getSetting('SCRIPT', 'custscript_itemint');
	
}


/**********************************************************************
 * loadItems Function - Load all the items that needs the shipping price to be set
 * 
 **********************************************************************/
function loadItems()
{
	//Declaring the local variables
	/*var itemSearch = new Array();
	var itemFilters = new Array();
	var itemColumns = new Array();
	var itemShippingCost = 0.0;*/

	try
	{
		//var record = nlapiLoadRecord('item', itemIntID);
		nlapiLogExecution('Audit', 'item record', itemIntID);
		/*//Adding filters to search the active items 
		itemFilters[0] = new nlobjSearchFilter('isinactive',null, 'is','F');		//filtering by active Items
		
		//Getting particular columns in item search results 
		itemColumns[0] = new nlobjSearchColumn('internalid');						//Getting Item's Internal ID
		itemColumns[1] = new nlobjSearchColumn('custitem_averageshippingcost');		//Getting Item's 'Average Shipping Cost'
		
		//Searching the items using filters and columns 
		itemSearch = nlapiSearchRecord('item', null, itemFilters, itemColumns);		

		// Getting the values of particular columns returned from search results
		for(var index=0; index <itemSearch.length; index++)
		{
			// Getting the location name
			itemShippingCost = itemSearch[index].getValue(itemColumns[1]);

		}*/
	}
	catch(e)
	{
		errorHandler("loadItems : " +e);
	} 
}



/**********************************************************************
 * general error handler
 * 
 * @param e
 *********************************************************************/
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', errorMessage);

}


/***********************************************************************
 * get error message
 * 
 * @param e
 ***********************************************************************/

function getErrorMessage(e)
{
	var retVal='';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}

	return retVal;
}


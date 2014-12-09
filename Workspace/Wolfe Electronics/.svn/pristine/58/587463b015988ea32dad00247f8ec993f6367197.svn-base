/*****************************************************************************
 *	Name		:	ItemPriceRetrieval
 *	Script Type	:	Scheduled 
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 13/03/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To call the CalculateItemPrice_scheduled script
 * 
 * 	Script		: 	
 * 	Deploy		: 
 * 
 * 	Library		: 
 * 
 **********************************************************************/
//Declaring global variables



/***************************************************************************
 * 
 * itemPriceRetrieval Function - The main function
 * 
 **************************************************************************/
function itemPriceRetrieval(type, name)
{
	var itemIntID = 0;
	
	try
	{
		
		
		if ((name == 'custitem_averageshippingcost')) 
		{
			//Call initialiseDates function
			initialise();
			
			//alert("Please provide additional information about fieldA in the text field below.");
			itemIntID = nlapiGetRecordId();
		
			runScheduledScript(itemIntID);	
		}
		
	}
	catch(e)
	{
		errorHandler("itemPriceRetrieval : " +e);
	} 
}



/**********************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * 
 * 
 **********************************************************************/
function initialise()
{
	
}


/**********************************************************************
 * runScheduledScript Function - run the scheduled script : CalculateItemPrice_scheduled
 * 
 * 
 **********************************************************************/
function runScheduledScript(itemInternalID)
{
	var params = new Array();
	try
	{
		//params['custscript_itemint'] = itemInternalID;
		alert(itemInternalID);
		var script = nlapiScheduleScript('customscript_calculateitemprice', 'customdeploy_calculateitemprice');
		alert(script);
	}
	catch (e)
	{
		errorHandler("runScheduledScript : " +e);
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


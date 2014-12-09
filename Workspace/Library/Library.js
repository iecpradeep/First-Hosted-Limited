/**********************************************************************************************************************************************
 * Name:		Library
 * Script Type:	Library
 *
 * Version:		1.0.0 - 20/12/2014 - Initial code functions and examples
 *
 * Author:		Enabling Solutions
 * Purpose:		To share useful functionality amongst the company
 **********************************************************************************************************************************************/


/**********************************************************************
 * Error Handler
 * 
 * @param sourceName - the name of the function which caused the error
 * @param e - the error object itself
 * 
 **********************************************************************/
function errorHandler(sourceName, e)
{
	if ( e instanceof nlobjError )
	{
		alert('Error:\n\nUnexpected error in ' + sourceName + '. Code: ' + e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		alert( 'Error:\n\nUnexpected error in ' + sourceName + '.\nError Message is ' + e.message);
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}


/**********************************************************************
 * To round 42.14446 to 3 decimal places, you execute toFixed(42.14446, 3). The return value will be 42.144.
 * To round it DOWN, you need to subtract 0.0005 (=42.14396). Executing the above would then return 42.143.
 * To round it UP, you ADD 0.0005 (=42.14496) which, as it would still not be to the next number, still return 42.144. 
 * @governance 0.
 *
 * @param  {value}   	The number being passed in.
 * @param  {precision}   How many decimal places this number should be fixed to.
 * @return {precision}   The rounded number is returned in its now fixed state
 *
 * @since  2011
 ***********************************************************************/
function toFixed(value, precision)
{
	try
	{
		var precision = precision || 0,
		neg = value < 0,
		power = Math.pow(10, precision),
		value = Math.round(value * power),
		integral = String((neg ? Math.ceil : Math.floor)(value / power)),
		fraction = String((neg ? -value : value) % power),
		padding = new Array(Math.max(precision - fraction.length, 0) + 1).join('0');
		return precision ? integral + '.' +  padding + fraction : integral;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Failed to fix the value', e.message);
	}
	return value;
}


/**********************************************************************
 *
 * @return {year}   The rounded number is returned in its now fixed state
 * 
 ***********************************************************************/
function thisyear()// returns the business year 
{
	var today = new Date();
	var year = today.getFullYear();
	
	try
	{
		if (today.getMonth() >= 10)
		{
			year = today.getFullYear()+1;
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
	return year;
}


/**********************************************************************
 * left - get the left most characters
 * 
 * @param str - input string
 * @param n - how many characters you want the string to be
 * @returns - the string
 **********************************************************************/
function left(str, n)
{
	var retVal = '';
	try
	{
		if ((n <= 0) || (n == null))
		{
			//return "";
			retVal = "";
		}
		else if (n > String(str).length)
		{
			//return str;
			retVal = str;
		}
		else
		{
			//return String(str).substring(0,n);
			retVal = String(str).substring(0,n);
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
	
	return retVal;
}

/**********************************************************************
 * right - get the right most characters
 * 
 * @param str - input string
 * @param n - how many characters you want the string to be
 * @returns - the string
 **********************************************************************/
function right(str, n)
{
	var retVal = '';
	try
	{
		if ((n <= 0) || (n == null))
		{
			//return "";
			retVal = "";
		}
		else if (n > String(str).length)
		{
			//return str;
			retVal = str;
		}
		else 
		{
			var iLen = String(str).length;
			//return String(str).substring(iLen, iLen - n);
			retVal = String(str).substring(iLen, iLen - n);
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
	return retVal;
}


/**********************************************************************
 * 
 * subtractDaysFromDate - Pass in the Date and the Days to subtract, 
 * 							returns calculated date
 * 
 * @param date - The date you wish to start from
 * @param days - The number of days you wish to subtract
 *
 * @returns {Date} - The calculated date
 * 
 **********************************************************************/
function subtractDaysFromDate(date, days) 
{
	return new Date(
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate() - days,
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
	);
}


/**********************************************************************
 * isBlank - Is the string you are passing through considered blank?
 * 
 * @param inputString - The String you wish to check
 * 
 * @returns {Boolean} - The outcome. True if it is blank/null, 
 * 						false if it isn't.
 * 
 **********************************************************************/
function isBlank(inputString)
{
	var retVal = false;
	try
	{
		if((inputString == '') || (inputString == null) || (inputString.length == 0))
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('isBlank', e);
	}
	return retVal;
}


/**********************************************************************
 * 
 * trim Prototype for String
 * 
 * 
 **********************************************************************/
String.prototype.trim = function() 
{ 
	return this.replace(/^\s+|\s+$/g, ''); 
};


/**********************************************************************
 * generic search - returns internal ID
 * 
 * @param table 
 * @param fieldToSearch
 * @param valueToSearch 
 * 
 * @returns {internalID}
 * 
 **********************************************************************/
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID='not found';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          
 
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
	}     	      

	return internalID;
}


/**********************************************************************
 * generic search between - returns internal ID
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 * 
 * @param tableName
 * @param fieldToSearchFrom
 * @param fieldToSearchTo
 * @param valueToSearch
 * @returns {String}
 ***********************************************************************/
function genericSearchBetween(tableName, fieldToSearchFrom, fieldToSearchTo, valueToSearch)
{
	
	var internalID='not found';


	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();

	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter(fieldToSearchFrom, null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter(fieldToSearchTo, null, 'onOrAfter', valueToSearch);                          
 
		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				var searchResult = searchResults[ 0 ];
				internalID = searchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler(e);	
	}     	      

	return internalID;
}


/**********************************************************************
 * generic search - returns internal ID
 * 
 * @param table
 * @param fieldToSearch1
 * @param valueToSearch1
 * @param fieldToSearch2
 * @param valueToSearch2
 * @param fieldToSearch3
 * @param valueToSearch3
 * @returns {String}
 ***********************************************************************/
function genericSearchThreeParams(table, fieldToSearch1, valueToSearch1, fieldToSearch2, valueToSearch2, fieldToSearch3, valueToSearch3)
{
	var internalID='not found';

	// Arrays
	var SearchFilters = new Array();
	var SearchColumns = new Array();
	var itemSearchResults = null;
	var itemSearchResult = null;

	try
	{
		//search filters                  
		SearchFilters[0] = new nlobjSearchFilter(fieldToSearch1, null, 'is',valueToSearch1);                          
		SearchFilters[1] = new nlobjSearchFilter(fieldToSearch2, null, 'is',valueToSearch2);
		SearchFilters[2] = new nlobjSearchFilter(fieldToSearch3, null, 'is',valueToSearch3);  
 
		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		itemSearchResults = nlapiSearchRecord(table, null, SearchFilters, SearchColumns);

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch", e);
	}     	      

	return internalID;
}

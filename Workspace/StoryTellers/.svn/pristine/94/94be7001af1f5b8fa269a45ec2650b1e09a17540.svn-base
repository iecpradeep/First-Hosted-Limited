/************************************************************************
 * Script Type:	Library
 *
 * Version:		1.0.0 - 10/02/2012 - Initial code functions and examples
 * 				1.0.1 - 25/07/2012 - genericsearchbetween added
 * 				1.1.0 - 09/08/2012 - Added Return CSV
 *              1.1.1 - 21/11/2012 - Add getItemType function - MJL
 *              1.1.2 - 24/11/2012 - Function to add a button anywhere on
 *              					 a form
 *              1.1.3 - 27/11/2012 - Added replaceAll function - PAL
 *              2.0.0 - 15/12/2012 - Added Storytellers specific functions - PAL
 *              2.0.1 - 17/12/2012 - Added divideCellByAmountInToCell
 *              2.0.1 - 20/12/2012 - Added divideAmountByAmountInToCell
 *              2.1.0 - 2/1/2013 - Account Group Changes - PAL
 *              2.2.0 - 2/1/2013 - adding getCellAccountGroupByCellName function - AS
 *				2.3.0 - 04/1/2013 - adding following functions - AS
 *								* findBudgetPeriodId
 * 								* generateCellLinkByCellNameforBudgets
 *								* generateCellLinkByCellNameforActuals
 *								* generateCellLinkByCellName
 *				2.4.0 - 04/1/2013 - Adding Following functions -PAL
 *								* getCellLinkByCellTag
 *								* getCellLinkByCellName
 *				2.5.0 - 07/01/2013 - adding doDivision function - AS
 *				2.5.1 - 08/01/2013 - edited divideAmountByAmountInToCell function - AS
 *				2.6.0 - 10/01/2013 - adding subtractAmountWithAmountInToCell function - AS
 *				2.6.1 - 10/01/2013 - changing the replaceContentTag to add the links only to the required cells - AS 
 *				2.7.0 - 10/01/2013 - adding checkTagNumber function	- AS
 *						
 * Author:		FHL
 * Purpose:		To share useful functionality amongst the company
 ************************************************************************/
//declaring the global variables

var numOfRowsRequired = 47;
var numOfColumnsRequired = 20;
var startRowNumber = 8;
var asciiOffset = 67;
var prefix = '##';
var suffix = '##';

var rollingStartMonth = 0;
var currentFiscalYear = 0;
var todayDate = 0;
var rollingYear = 0;
var priorYearSameDate = null;
var lastFiscalYear = 0;

var currentMonth = '';
var currentYear = 0;
var currentDate = 0;
var today = null;
var budgetName = '';

var budgetPeriodsColumns = new Array();
var budgetPeriodResults = new Array();

var currentFullDate = '';
var currentMonthName = '';
var currentFiscalDate = null;

var fiscalyearEndDate = null;
var formattedFiscalYearStartDate = null;
var fiscalYearStartDate = null;

var nextFiscalYear = 0; 

var priorMonth = 0;
var priorMonthsYear = 0;

var rollingStartPriorMonth = 0;
var rollingPriorYear = 0;

var startDate ='1/1/2000';
var endDate = '31/12/2099';


/*************************************************************************
 * generic search - returns internal ID
 * 
 ************************************************************************/
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID='not found';

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();
	var searchResults = new Array();
	
	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		searchResults = nlapiSearchRecord(table, null, searchFilters, searchColumns);

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




/************************************************************************************************
 * usage: deleteallrecords('customrecord_xml_load_audit','custrecord_description'); 
 ***********************************************************************************************/
function deleteallrecords(recordtype,columnname)
{

	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'isnotempty');                          

	// search columns
	itemSearchColumns[0] = new nlobjSearchColumn(columnname);

	var searchresults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		try
		{
			//var searchresult = searchresults[ i ];
			nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());
		}
		catch(e)
		{

			// ignore it
		}
	}
}



/**
 * generic search between - returns internal ID
 * 1.0.1 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */

function genericSearchBetween(tableName, fieldToSearchFrom, fieldToSearchTo, valueToSearch)
{
	var internalID='not found';

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();
	var searchResults = new Array();
	var searchResult = '';
	
	try
	{
		//search filters                  

		searchFilters[0] = new nlobjSearchFilter(fieldToSearchFrom, null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter(fieldToSearchTo, null, 'onOrAfter', valueToSearch);                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
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


/**
 * generic search between - returns internal ID
 * 1.0.1 added - 
 * example use: crIntId = genericSearchBetween('accountingperiod','startdate','enddate',a);
 */
function lookupPostingPeriod(tableName, valueToSearch)
{
	var internalID='not found';

	// Arrays
	var searchFilters = new Array();
	var searchColumns = new Array();
	var searchResults = new Array();
	var searchResult = '';
	
	try
	{
		//search filters                  
		searchFilters[0] = new nlobjSearchFilter('startdate', null, 'onOrBefore', valueToSearch);                          
		searchFilters[1] = new nlobjSearchFilter('enddate', null, 'onOrAfter', valueToSearch);                          
		searchFilters[2] = new nlobjSearchFilter('isadjust', null, 'is', 'F');                          
		searchFilters[3] = new nlobjSearchFilter('isyear', null, 'is', 'F');                          
		searchFilters[4] = new nlobjSearchFilter('isquarter', null, 'is', 'F');                          

		// return columns
		searchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		searchResults = nlapiSearchRecord(tableName, null, searchFilters, searchColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
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



/*****************************************************
 * replaceAll - A function which uses Regular Expressions to replace all
 * instances of the given text in the input string
 * 
 * @governance 0.
 * 
 * @param inputString - The source string you wish to replace the text FROM 
 * @param stringToReplace - The text you wish to REPLACE
 * @param stringToReplaceWith - The text you wish to REPLACE IT WITH
 * @returns {String}	-	The inputString, with all text replaced
 * 
 *****************************************************/
function replaceAll(inputString, stringToReplace, stringToReplaceWith)
{
	var retVal = "";
	var regExReplace = null;
	var caseSensitive = "gi";	//force case insensitive

	try
	{
		regExReplace=new RegExp(stringToReplace,caseSensitive);
		retVal = inputString.replace(regExReplace, stringToReplaceWith);
	}
	catch(e)
	{
		errHandler('replaceAll inputstring: ' + inputString, e);
	}

	return retVal;
}


/*************************************************************************************
 * divideWithHandler - to ignore the 'division by 0' error 
 * 
 * @param value - the value to be divided by
 * @param divisor 
 * 
 * @returns {String} - result of the division
 *************************************************************************************/
function divideWithHandler(value, divisor)
{
	var result = 0;

	try
	{
		//to ignore the 'division by 0' error
		divisor = parseFloat(divisor);
		value = parseFloat(value);

		if(divisor != 0.00)
		{
			result = parseFloat((value / divisor) * 100);
		}
		else
		{
			result = 0;
		}	
	}
	catch(e)
	{
		result = 0;

	}

	return result;
}


/*************************************************************************************
 * doDivision - divide with the divison (same as the divideWithHandler, but without multiplying by 100) 
 * @param value - the value to be divided by
 * @param divisor 
 * 
 * @returns {String} - result of the division
 * 
 * 	2.5.0 - 07/01/2013 - adding doDivision function - AS
 *************************************************************************************/
function doDivision(value, divisor)
{
	var result = 0;

	try
	{
		//to ignore the 'division by 0' error
		divisor = parseFloat(divisor);
		value = parseFloat(value);

		if(divisor != 0.00)
		{
			result = parseFloat((value / divisor));
		}
		else
		{
			result = 0;
		}	
	}
	catch(e)
	{
		result = 0;

	}

	return result;
}


/*************************************************************************************
 * formatNumeric
 * 
 * @param value - The number you wish correctly format when < 0
 * 
 * @returns {String} - the formatted string in brackets and red if negative, or unchanged if positive. 
 * 
 *************************************************************************************/
function formatNumeric(value)
{
	var retVal = '0.00';
	try
	{
		if(isNaN(String(value)))
		{
			value = 0.00;
		}

		value = parseFloat(value);
		value = value.toFixed(2);
		
		if(value < 0)
		{
			value = String(value);
			value = replaceAll(value, '-', '');
			retVal = '<font color="red">(' + value + ')</font>';
		}
		else
		{
			retVal = value;
		}
	}
	catch(e)
	{
		retVal = e.message;
	}

	return retVal;
}


/*************************************************************************************
 * formatPercent
 * 
 * @param value - input value you wish to convert to a percentage
 * 
 * @returns {String} - the formatted string in brackets and red if negative, or unchanged if positive. 
 * 							Both instances with a % sign afterwards.
 * 
 *************************************************************************************/
function formatPercent(value)
{
	var retVal = '';
	try
	{

		if(isNaN(String(value)))
		{
			value = 0;
		}

		value = parseFloat(value);

		if(value < 0)
		{
			value = String(value);
			value = replaceAll(value, '-','');
			retVal = '<font color="red">(' + value + ')%</font>';
		}
		else
		{
			if(String(value) == 'NaN')
			{
				retVal = '0%';
			}
			else
			{
				retVal = String(value) + '%';
			}
		}
	}
	catch(e)
	{
		retVal = '#Error!# ' + e.message;
	}
	return retVal;
}


/**********************************************************************
 * errHandler - Used when an error has occurred
 * 
 * @param sourceFunctionName
 * @param errorObject
 * 
 **********************************************************************/
function errHandler(sourceFunctionName , errorObject)
{
	try
	{
		nlapiLogExecution('ERROR', sourceFunctionName, errorObject.message);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'ErrorHandler', e.message);
	}
}


/**********************************************************************
 * logData - Used when debugging
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function logData(source, data)
{
	nlapiLogExecution('DEBUG', source, data);
}


/**********************************************************************
 * auditData - Used when deployed for auditing purposes
 * 
 * @param source
 * @param data
 * 
 **********************************************************************/
function auditData(source, data)
{
	nlapiLogExecution('AUDIT', source, data);
}


/**********************************************************************
 * formatNumeric
 * 
 * If the object you're formatting is blank, it will return a zero length string.
 * If the value is negative, it will strip the minus sign, put brackets around, and change the font colour to red
 * 
 * @returns {String} - the Object, formatted to a numeric datatype
 **********************************************************************/
Object.prototype.formatNumeric = function()
{	
	var value = this;
	var retVal = '';	//default is blank

	try
	{
		if(String(value) != '')	//if they haven't passed through a zero length string
		{
			value = formatNumeric(value);	//format it, otherwise it will be left blank
			retVal = value;
		}
	}
	catch(e)
	{
		errHandler('formatNumeric Prototype', e);
	}
	return retVal; 
};


/**********************************************************************
 * formatPercent
 * 
 * If the object you're formatting is blank, it will return a zero length string.
 * If the value is negative, it will strip the minus sign, put brackets around, and change the font colour to red
 * Irrespective of whether it is positive or negative, if it is not blank, a % sign is appended
 * 
 * @returns {String} - the Object, formatted to a numeric datatype
 *********************************************************************/
Object.prototype.formatPercent = function()
{
	var value = this;
	var retVal = '';
	try
	{
		if(String(value) != '')	//if they haven't passed through a zero length string
		{
			value = parseFloat(value);
			value = value.toFixed(2);
			retVal = formatPercent(value);

		}
	}
	catch(e)
	{
		errHandler('formatNumeric Prototype', e);
	}
	return retVal; 
};

Object.prototype.toFixed = function(value)
{
	var retVal = 0;

	try
	{
		retVal = toFixed(this, value);
	}
	catch(e)
	{
		errHandler('Object Prototype toFixed', e);
	}


	return retVal;
};


/*******************************************************************
 * 
 * Gets the left most characters in the given string
 * 
 * @param str - the String you wish to get the left most characters of
 * 
 * @param n - the number of characters you wish to get
 * 
 * @returns - returns the sliced string
 * 
 *******************************************************************/
function Left(str, n)
{
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else
		return String(str).substring(0,n);
}

/*******************************************************************
 * 
 * Gets the right most characters in the given string
 * 
 * @param str - the String you wish to get the right most characters of
 * 
 * @param n - the number of characters you wish to get
 * 
 * @returns - returns the sliced string
 * 
 *******************************************************************/

function Right(str, n)
{
	if (n <= 0)
		return "";
	else if (n > String(str).length)
		return str;
	else {
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}



/*************************************************************************************
 * populateWorksheetData - function to populate the cellArray with names, tags, values and types
 * 
 * Fill the cellArray with cell references, tags and required format
 *  
 *************************************************************************************/
function populateWorksheetData()
{
	var rowId = 0;		//this is the array position

	var cellTag = '';
	var cellValue = '';
	var cellFormat = '';
	var cellName = '';
	var cellLink = '';
	var cellAccountGroup = '';	
	var columnLetter = '';
	var columnValue = '';

	try
	{	
		cellArray = new Array(6);	//Clear the array

		cellArray[0] = new Array();	//nameColumn = 0; name - e.g. D2
		cellArray[1] = new Array();	//tagColumn = 1; tag - e.g. ##D2##
		cellArray[2] = new Array();	//valueColumn = 2; value - e.g. 24
		cellArray[3] = new Array();	//typeColumn = 3; type - e.g. p
		cellArray[4] = new Array(); //linkColumn = 4; hyperlink
		cellArray[5] = new Array();	//accountGroupColumn = 5;//account group
		
		for (var colIndex = 0; colIndex < numOfColumnsRequired; colIndex++) //0 to 20 as we need 20 letters starting at C
		{
			for (var rowNumber = startRowNumber; rowNumber <= numOfRowsRequired; rowNumber++)	//47 rows
			{
				columnValue = parseInt(colIndex) + parseInt(asciiOffset); 			//Add value to get Column ASCII Number
				columnLetter = String.fromCharCode(columnValue);					//This is the Column Character

				cellName = columnLetter + String(rowNumber);						//Column Name
				cellTag = prefix + cellName + suffix;
				cellValue = '';
				cellFormat = getCellFormatByCellName(cellName);

				cellAccountGroup = getCellAccountGroupByCellName(cellName);
				cellLink = generateCellLinkByCellName(cellName, cellAccountGroup);
				
				//logData('populate Worksheet Data', 'CellName:' + cellName + '. cellTag: ' + cellTag + '. cellValue: ' + cellValue + '. cellFormat: ' + cellFormat + '. ArrayLength: ' + cellArray[nameColumn].length + '. rowId: ' + rowId);

				cellArray[nameColumn][rowId] = cellName;
				cellArray[tagColumn][rowId] = cellTag;
				cellArray[valueColumn][rowId] = cellValue;
				cellArray[typeColumn][rowId] = cellFormat;
				cellArray[linkColumn][rowId] = cellLink;
				cellArray[accountGroupColumn][rowId] = cellAccountGroup;

				rowId++;
			}
		}		
	}
	catch(e)
	{
		errHandler('populateWorksheet', e);
	}
}

/*************************************************************************************
 * getRowIdByName
 * 
 * @param {String} name - Name of the cell you wish to find the rowID of
 * 
 * @returns {Integer} rowId - the rowId in the array where the Name was found
 * 
 *************************************************************************************/
function getRowIdByName(cellName)
{
	var rowId = 0;

	try
	{
		if(cellArray[nameColumn].indexOf(cellName) != -1)
		{
			rowId = cellArray[nameColumn].indexOf(cellName);
		}
	}
	catch(e)
	{
		errHandler('getRowIdByName', e);
	}
	return rowId;
}

/*************************************************************************************
 * getRowIdByTag
 * 
 * @param {String} tag - tag of the cell you wish to find the rowID of
 * 
 * @returns {Integer} rowId - the rowId in the array where the tag was found
 * 
 *************************************************************************************/
function getRowIdByTag(tag)
{
	var rowId = 0;

	try
	{
		if(cellArray[tagColumn].indexOf(tag) != -1)
		{
			rowId = cellArray[tagColumn].indexOf(tag);
		}
	}
	catch(e)
	{
		errHandler('getRowIdByTag', e);
	}
	return rowId;
}

/*************************************************************************************
 * getCellValueByName
 * 
 * @param {String} name - Name of the cell you wish to find the value of
 * 
 * @returns {String} value - the value in the array where the Name was found
 * 
 *************************************************************************************/
function getCellValueByName(cellName)
{
	var value = '';
	var rowId = 0;

	try
	{
		rowId = cellArray[nameColumn].indexOf(cellName);

		if(rowId != -1)
		{
			value = cellArray[valueColumn][rowId];
		}
	}
	catch(e)
	{
		errHandler('getCellValueByName', e);
	}
	return value;
}



/*************************************************************************************
 * outputCellArrayToWorksheet - function to populate the content with cellArray data
 *  
 *************************************************************************************/
function outputCellArrayToWorksheet()
{
	var arrayTag = '';
	var arrayValue = '';
	var arrayFormat = '';
	var arrayAccountGroup = '';
	var arrayLink = '';
	
	try
	{
		for(var arrayIndex = 0; arrayIndex < cellArray[tagColumn].length; arrayIndex++)
		{
			//get the tag, value and format out of the cellArray
			arrayTag = cellArray[tagColumn][arrayIndex];
			arrayValue = cellArray[valueColumn][arrayIndex];
			arrayFormat = cellArray[typeColumn][arrayIndex];
			arrayAccountGroup = cellArray[accountGroupColumn][arrayIndex];
			arrayLink = cellArray[linkColumn][arrayIndex];

			logData('outputCellArrayToWorksheet', 'Tag: ' + arrayTag + '. Value: ' + arrayValue + '. Format: '+ arrayFormat + '. cellArray.length: ' + cellArray[tagColumn].length + '. arrayIndex: ' + arrayIndex + '. arrayAccountGroup: ' + arrayAccountGroup + '. arrayLink: ' + arrayLink);
			//replace each tag one by one
			
			//create the link here
			replaceContentTag(arrayTag, arrayValue, arrayFormat);
		}
	}
	catch(e)
	{
		errHandler('outputCellArrayToWorksheet', e);
	}
}


/*************************************************************************************
 * getColumnLetterByCode - pass in ASCII value, returns ASCII character
 * 
 * @param unicodeString - {Integer} the ASCII numeric value of the character e.g. 67
 * 
 * @returns {String} - the ASCII character of that value, e.g. C
 * 
 *************************************************************************************/
function getColumnLetterByCode(unicodeString)
{
	var columnLetter = '';
	try
	{
		unicodeString = parseInt(unicodeString);
		columnLetter = String.fromCharCode(unicodeString);
	}
	catch(e)
	{
		errHandler('getColumnLetterByCode', e);
	}
	return columnLetter;
}


/*************************************************************************************
 * getColumnCodeByLetter - pass in ASCII character, returns ASCII value
 * 
 * @param columnLetter - {String} the ASCII character e.g. C
 * 
 * @returns {Integer} - the ASCII value of that character, e.g. 67
 * 
 *************************************************************************************/
function getColumnCodeByLetter(columnLetter)
{
	var unicodeString = '';
	try
	{
		columnLetter = String(columnLetter);
		unicodeString = String.fromCharCode(columnLetter);
	}
	catch(e)
	{
		errHandler('getColumnCodeByLetter', e);
	}
	return unicodeString;
}


/*************************************************************************************
 * getMonthName - function to get the month's name as a string
 * 
 * @param month - month as an integer
 * 
 * @returns {String} - month as a string
 * 
 *************************************************************************************/
function getMonthName(month)
{
	var monthNameArray = new Array();
	var monthName = 'Invalid Value';

	monthNameArray = ['January', 'February', 'March','April', 'May', 'June', 'July', 'August', 'September', 'October','November','December'];

	try
	{
		month = parseInt(month);
		
		//when calculating the date range, it deduct 2 from the current month. when the current month is January (01) then the value will
		//be -1, which should be November (11). Hence to get the correct month the following calculation is used.
		if(month == -1)
		{
			month = (12 + month);
			month = parseInt(month);

		}

		for(var i = 0; i < monthNameArray.length; i++)
		{
			if((i +1) == month)
			{
				monthName = monthNameArray[i];
			}
		}
	}
	catch(e)
	{
		errHandler("getMonthName : " , e.message);
	} 
	
	return monthName;
}



/*************************************************************************************
 * getCellFormatByCellName - function to get the Cell's format as a String
 * 
 * @param {String} cellName - cellName as String
 * 
 * @returns {String} - Format as a string
 * 
 *************************************************************************************/
function getCellFormatByCellName(cellName)
{
	var retVal = '';

	try
	{
		if(cellsFormatNumeric.indexOf(cellName) != -1)
		{
			retVal = 'N';
		}
		else
		{
			if(cellsFormatPercent.indexOf(cellName) != -1)
			{
				retVal = 'P';
			}
			else
			{
				retVal = '';
			}
		}	
	}
	catch(e)
	{
		logData('getCellFormatByCellName', 'Cell Name: ' + cellName + ', retVal: ' + retVal);
		errHandler('getCellFormatByCellName' , e);
	} 

	return retVal;
}


/*************************************************************************************
 * setCellValueByCellName - function to set the Cell's value by passing in the cell name
 * 
 * @param {String} - cellName as String
 * @param {String} - cellValue as String
 * 
 *************************************************************************************/
function setCellValueByCellName(cellName, cellValue)
{
	var cellRowId = 0;
	var cellFormat = '';

	try
	{
		cellRowId = getRowIdByName(cellName);

		//cellFormat = getCellFormatByCellName(cellName);

		//logData('setCellValueByCellName', 'CellName: ' + cellName + 'CellValue: ' + cellValue + 'CellRowID: ' + cellRowId + 'CellFormat: ' + cellFormat);

		cellArray[valueColumn][cellRowId] = cellValue;
		
		//cellArray[typeColumn][cellRowId] = cellFormat;
	}
	catch(e)
	{
		errHandler('setCellValueByCellName', e);
	}
}


/**************************************************************************************
 * divideTwoCellsByNames - pass in two cell references, and the result of cell1 divided by cell2 is returned
 * 
 * @param cell1Name - Cell reference of the first number
 * @param cell2Name - Cell reference of the second number
 * 
 * @returns {Number} - the calculation of cell1 / cell2
 * 
 **************************************************************************************/
function divideTwoCellsByNames(cell1Name, cell2Name)
{
	var retVal = 0;
	var cell1Value = 0;
	var cell2Value = 0;
	
	try
	{
		cell1Value = getCellValueByName(cell1Name);
		cell2Value = getCellValueByName(cell2Name);

		//retVal = divideWithHandler(cell1Value, cell2Value);
		retVal = doDivision(cell1Value, cell2Value);
	}
	catch(e)
	{
		errHandler('divideTwoCellsByNames', e);
	}
	return retVal;
}



/**************************************************************************************
 * divideTwoCellsByNamesInToCell - pass in two cell references, and the result of (cell1/cell2) is put into the targetCell
 * 
 * @param cell1Name - Cell reference of the first number
 * @param cell2Name - Cell reference of the second number
 * @param targetCellName - Cell reference to where you wish the results to be put
 * 
 **************************************************************************************/
function divideTwoCellsByNamesInToCell(cell1Name, cell2Name, targetCellName)
{
	var cell1Value = 0;
	var cell2Value = 0;
	var targetCellValue = 0;

	try
	{
		cell1Value = getCellValueByName(cell1Name);	//read the cell's values
		cell2Value = getCellValueByName(cell2Name);
		targetCellValue = divideWithHandler(cell1Value, cell2Value); //divide them
		setCellValueByCellName(targetCellName, targetCellValue);		//put the results in the target cell
		logData('divideTwoCellsByNamesInToCell', 'cell1Name ' + cell1Name + '. cell2Name. ' + cell2Name + '. cell1Value ' + cell1Value + '. cell2Value ' + cell2Value + '. targetCellName ' + targetCellName + '. targetCellValue ' + targetCellValue);
	}
	catch(e)
	{
		errHandler('divideTwoCellsByNamesInToCell', e);
	}
}


/**************************************************************************************
 * divideTwoCellsByNamesToSourceCell - pass in two cell references, and the result of
 * (sourceCellName/cellDivisor) is put into the sourceCellName
 * 
 * @param sourceCellName - Cell reference of the first number
 * @param cellDivisor - Cell reference of the second number
 * 
 **************************************************************************************/
function divideTwoCellsByNamesToSourceCell(sourceCellName, cellDivisor)
{
	var sourceCellValue = 0;
	var cellDivisorValue = 0;
	var targetCellValue = 0;

	try
	{
		sourceCellValue = getCellValueByName(sourceCellName);	//read the cell's values
		cellDivisorValue = getCellValueByName(cellDivisor);
		targetCellValue = divideWithHandler(sourceCellValue, cellDivisorValue); //divide them
		setCellValueByCellName(sourceCellName, targetCellValue);		//put the results in the target cell
		logData('divideTwoCellsByNamesToSourceCell', 'sourceCellName ' + sourceCellName + '. cellDivisor. ' + cellDivisor + '. sourceCellValue ' + sourceCellValue + '. cellDivisorValue ' + cellDivisorValue + '. cellDivisorValue ' + cellDivisorValue + '. targetCellValue ' + targetCellValue);
	}
	catch(e)
	{
		errHandler('divideTwoCellsByNamesToSourceCell', e);
	}
}

/**************************************************************************************
 * divideCellByAmountInToCell - pass in 1 cell references and the amount, and the result 
 * of (cell/amount) is put into the targetCell
 * 
 * @param cell1Name - Cell reference of the first number
 * @param amount - Amount you wish to divide it by
 * @param targetCellName - Cell reference to where you wish the results to be put
 * 
 **************************************************************************************/
function divideCellByAmountInToCell(cellName, amount, targetCellName)
{
	var cellValue = 0;
	var targetCellValue = 0;

	try
	{
		cellValue = getCellValueByName(cellName);	//read the cell's values

		targetCellValue = divideWithHandler(cellValue, amount); 		//divide them
		setCellValueByCellName(targetCellName, targetCellValue);		//put the results in the target cell
		logData('divideCellByAmountInToCell', 'cellName ' + cellName + '. amount. ' + amount + '. cellValue ' + cellValue + '. targetCellName ' + targetCellName + '. targetCellValue ' + targetCellValue);
	}
	catch(e)
	{
		errHandler('divideCellByAmountInToCell', e);
	}
	
	return retVal;
}

/**************************************************************************************
 * isCellBlank - pass in a cell reference to see if it is blank or not
 * 
 * @param cellName - Cell reference of the first number
 * @returns retVal {Boolean} - whether the Cell is blank or not (true = blank, false = not blank)
 * 
 **************************************************************************************/
function isCellBlank(cellName)
{
	var retVal = true;
	var cell1Value = '';
	
	try
	{
		cell1Value = getCellValueByName(cellName);	//read the cell's values
		cell1Value = String(cell1Value);

		if(cell1Value == '')
		{
			retVal = true;
		}
		else
		{
			retVal= false;
		}
	}
	catch(e)
	{
		errHandler('isCellBlank', e);
	}
	
	return retVal;
}


/*********************************************************************
 * replaceContentTag - call this function to replace the text within the content variable with the
 * specified value, with the option of having it formatted.
 * 
 * @param tag - the string you wish to find
 * @param value - the string you with to replace it with
 * @param format - the format you wish the value to be formatted with (P - percent/N - numeric/'' - unformatted)
 * 
 * 2.6.1 - 10/01/2013 - changing the replaceContentTag to add the links only to the required cells - AS 
 **********************************************************************/
function replaceContentTag(tag, value, format)
{
	var arrayLink = '';
	var cellLinkAndValue = '';
	var tagStartLetter = '';
	var returnedValue = false;
	var tagNumber = '';
	var tagStringEnd = 0;
	
	try
	{
		arrayLink = getCellLinkByCellTag(tag);
		
		//getting the letter of the tag value
		tagStartLetter = tag.charAt(2);				//tag's format is like ##C8##
		
		//getting the number of the tag value (example 8, 9, 47)
		tagStringEnd =  tag.indexOf('#',2);
		tagNumber = tag.substring(3,tagStringEnd);
	
		//to format the value
		switch(format)
		{
			case 'p':
			case 'P':
				//format percent
				value = value.formatPercent();
				break;
			case 'n':
			case 'N':
				//format numeric
				value = value.formatNumeric();
				break;
			default:
				//no formatting
			
				break;
		}
		
		
		//applying the link for the cells depending on the tag's starting letter and the tag's number
		switch(tagStartLetter)
		{
		case 'C':
		case 'D':
		case 'G':
		case 'J':
		case 'M':
		case 'N':
		case 'Q':
		case 'T':
			//checking for the tagNumber
			returnedValue = checkTagNumber(tagNumber);
			
			//if tag's number is fount in the list in checkTagNumber function
			if(returnedValue == true)
			{
				//creating the link
				cellLinkAndValue = '<a href="' + arrayLink + '" target="_blank">' + value + '</a>';
			}
			else
			{
				//setting the value without a link
				cellLinkAndValue = value;

			}
			
			break;
		
		default :
			//setting the value only without creating a link
			cellLinkAndValue = value;
		break;
		
		}
	
		// replacing the tag by cell link and value
		content = replaceAll(content, tag, cellLinkAndValue);
		
		logData('replace content tag','Tag: ' + tag + '. cellLinkAndValue: ' + cellLinkAndValue);
	}
	catch(e)
	{
		errHandler('replaceContentTag', e);
	}
}




/*********************************************************************
 * checkTagNumber - checking the tagNumber to confirm whether the link should be appeard in the particular cell
 *  
 * @param tagNumber - the tag's number
 * @returns {Boolean} 
 * 
 * 2.7.0 - 10/01/2013 - adding checkTagNumber function	- AS
 **********************************************************************/
function checkTagNumber(tagNumber)
{
	var retVal = false;
	
	try
	{
		switch(tagNumber)
		{
		case '9':
		case '10':
		case '11':
		case '12':
		case '13':
		case '14':
		case '15':
		case '18':
		case '19':
		case '20':
		case '21':
		case '22':
		case '23':
		case '24':
		case '34':
		case '37':
		case '39':
		case '41':
			retVal = true;
			break;
		
		default:
			retVal = false;
		}	
	}
	catch(e)
	{
		errHandler('checkTagNumber', e);
	}
return retVal;
}



/*************************************************************************************
 * setCellLinkByCellName - set the Cell's Link by giving the Cell Name and the Cell Link Value
 * 
 * @param {String} cellName - Name of the cell you wish to set the link value of
 * @param {String} cellLink - the link you wish to set to the Cell
 * 
 *************************************************************************************/
function setCellLinkByCellName(cellName, cellLink)
{
	var rowId = 0;

	try
	{
		rowId = cellArray[nameColumn].indexOf(cellName);

		if(rowId != -1)
		{
			cellArray[linkColumn][rowId] = cellLink;
		}
	}
	catch(e)
	{
		errHandler('setCellLinkByCellName', e);
	}
}


/***************************************************************************************
 * multiplyCellByValue - Give the Cell Name and the value you wish to Multiply it by
 * 
 * @param cellName - Cell Name, e.g. C13
 * @param multiplier - Mulitplier - the value you wish to multiply it by
 * 
 ***************************************************************************************/
function multiplyCellByValue(cellName, multiplier)
{
	var rowId = 0;
	var cellValue = 0;
	
	try
	{
		rowId = getRowIdByName(cellName);
		
		if(rowId != -1)
		{
			cellValue = getCellValueByName(cellName);
			cellValue = cellValue * multiplier;
			setCellValueByCellName(cellName, cellValue);
		}
	}
	catch(e)
	{
		errHandler('multiplyCellByCellName', e);
	}
}


/***************************************************************************************
 * subtractCellByCellName - Give the Cell Name and the amount you wish to subtract it by
 * 
 * @param cellName - Cell Name, e.g. C13
 * @param subtract - the amount you wish to subtract it by
 * 
 ***************************************************************************************/
function subtractCellByCellName(cellName, subtract)
{
	var rowId = 0;
	var cellValue = 0;
	
	try
	{
		rowId = getRowIdByName(cellName);
		
		if(rowId != -1)
		{
			cellValue = getCellValueByName(cellName);
			cellValue = cellValue - subtract;
			setCellValueByCellName(cellName, cellValue);
		}
	}
	catch(e)
	{
		errHandler('subtractCellByCellName', e);
	}
}


/***************************************************************************************
 * subtractCellWithAnotherCellByCellName - Give the Cell Name and the amount you wish to subtract it by
 * 
 * @param cell1Name - Cell Name, e.g. C13
 * @param cell2Name - Cell Name, e.g. C14 - the Cell with the value you wish to subtract it by
 * 
 ***************************************************************************************/
function subtractCellWithAnotherCellByCellName(cell1Name, cell2Name)
{
	var cell1RowId = 0;
	var cell2RowId = 0;
	var cell1Value = 0;
	var cell2Value = 0;
	var value = 0;
	
	try
	{
		cell1RowId = getRowIdByName(cell1Name);
		cell2RowId = getRowIdByName(cell2Name);
		
		if((cell1RowId != -1) &&(cell2RowId != -1))
		{
			cell1Value = getCellValueByName(cell1Name);
			cell2Value = getCellValueByName(cell2Name);
			value = cell1Value - cell2Value;
			setCellValueByCellName(cell1Name, value);
		}
	}
	catch(e)
	{
		errHandler('subtractCellWithAnotherCellByCellName', e);
	}
}

/***************************************************************************************
 * subtractCellWithAnotherCellByCellNameInToCell - Give the Cell Name and the amount you wish to subtract it by
 * 
 * @param cell1Name - Cell Name, e.g. C13
 * @param cell2Name - Cell Name, e.g. C14 - the Cell with the value you wish to subtract it by
 * @param targetCell - The target cell you wish to put the answer in to
 * 
 ***************************************************************************************/
function subtractCellWithAnotherCellByCellNameInToCell(cell1Name, cell2Name, targetCell)
{
	var cell1RowId = 0;
	var cell2RowId = 0;
	var cell1Value = 0;
	var cell2Value = 0;
	var value = 0;
	
	try
	{
		cell1RowId = getRowIdByName(cell1Name);
		cell2RowId = getRowIdByName(cell2Name);
		
		if((cell1RowId != -1) &&(cell2RowId != -1))
		{
			cell1Value = getCellValueByName(cell1Name);
			cell2Value = getCellValueByName(cell2Name);
			value = cell1Value - cell2Value;
			setCellValueByCellName(targetCell, value);
		}
	}
	catch(e)
	{
		errHandler('subtractCellWithAnotherCellByCellNameInToCell', e);
	}
}


/***************************************************************************************
 * subtractAmountWithAmountInToCell - substracting two amounts and put the value into a cell by name
 * 
 * @param amount1 - the amount that amount 2 should be subtracted from
 * @param amount2 - the amount the amount 1 will be subtracted by
 * @param targetCell - The target cell you wish to put the answer in to
 * 
 * 2.6.0 - 10/01/2013  - adding subtractAmountWithAmountInToCell function 				
 ***************************************************************************************/
function subtractAmountWithAmountInToCell(amount1, amount2, targetCell)
{
	var value = 0;
	
	try
	{
			value = parseFloat(amount1) - parseFloat(amount2);
			setCellValueByCellName(targetCell, value);
		
	}
	catch(e)
	{
		errHandler('subtractAmountWithAmountInToCell', e);
	}
}


/**************************************************************************************
 * divideCellByNameWithAmount - pass in the cellName, and the amount you wish to divide it by and the
 * divided value is put back in to the cellName
 * 
 * @param cellName - Cell reference of the first number
 * @param amount - Amount to divide it in to
 * 
 **************************************************************************************/
function divideCellByNameWithAmount(cellName, amount)
{
	var cellValue = 0;
	var value = 0;
	
	try
	{
		value = getCellValueByName(cellName);
		cellValue = doDivision(value, amount);
		
		setCellValueByCellName(cellName, cellValue);
	}
	catch(e)
	{
		errHandler('divideCellByNameWithAmount', e);
		
	}
}

/**************************************************************************************
 * divideAmountByAmountInToCell - pass in the two amounts to divide and the results are
 * returned in to the target cell
 * 
 * @param amount1 - the first number
 * @param amount2 - the amount you wish to divide amount1 by
 * @param targetCellName - Cell you wish to put the result in
 * 
 * 2.5.1 - 08/01/2013 - edited divideAmountByAmountInToCell function 				
 **************************************************************************************/
function divideAmountByAmountInToCell(amount1, amount2, targetCellName)
{
	var cellValue = 0;
	
	try
	{
		//2.5.1 changed calling of function divideWithHandler to doDivision
		cellValue = doDivision(amount1, amount2);
		setCellValueByCellName(targetCellName, cellValue);
	}
	catch(e)
	{
		errHandler('divideAmountByAmountInToCell', e);
	}
}

/****************************************************************************************
 * getCellAccountGroupByCellName - getting the account group depending on the cell name
 * 
 * @param cellName
 * @returns {String}
 * 
 *  2.2.0 - 2/1/2013 - adding getCellAccountGroupByCellName function - AS
 ****************************************************************************************/
function getCellAccountGroupByCellName(cellName)
{
	var cellAccountGroup = '';

	try
	{
		for(var columnIndex = 0; columnIndex < cellAccountGroupArray.length; columnIndex++)
		{
			if(cellAccountGroupArray[columnIndex].indexOf(cellName) != -1)
			{
				cellAccountGroup = String(columnIndex + 1);
				//auditData('getCellAccountGroupByCellName', cellAccountGroup);
			}
				
		}
	}
	catch(e)
	{
		errHandler('getCellAccountGroupByCellName', e);
	}
	
	return cellAccountGroup;
}


/****************************************************************************************
 * generateCellLinkByCellName - Generate the link for each cell name
 * 
 * @param cellName			-name of the cell : example - V8, D8
 * @param cellAccountGroup	- Sumamry account group of the cell
 * @returns {String}		- the particular link belongs to the cell
 * 
 ****************************************************************************************/
function generateCellLinkByCellName(cellName, cellAccountGroup)
{
	var cellSearchLinkActuals ='https://system.netsuite.com/app/common/search/searchresults.nl?searchtype=Transaction&searchid=85&AC_CUSTRECORD_SUMMARY_REPORTING_GROUP=#accountgroup#&Transaction_TRANDATEmodi=WITHIN&Transaction_TRANDATErange=CUSTOM&Transaction_TRANDATEfrom=#fromdate#&Transaction_TRANDATEfromreltype=DAGO&Transaction_TRANDATEto=#todate#&Transaction_TRANDATEtoreltype=DAGO&Transaction_TRANDATE=CUSTOM&sortcol=Transaction_AMOUNT_raw&sortdir=ASC&csv=HTML&OfficeXML=F&style=NORMAL';
	var cellSearchLinkBudgets = 'https://system.netsuite.com/app/common/search/searchresults.nl?rectype=34&searchtype=Custom&ACM_CUSTRECORD_SUMMARY_REPORTING_GROUP=#accountgroup#&ACC_CUSTRECORD_BUDGETPERIOD=#budgetperiod#&sortcol=ACM_cfRECORD_301_raw&sortdir=ASC&csv=HTML&OfficeXML=F&pdf=&style=NORMAL&report=&grid=&searchid=86';
	var cellSearchLink = '';
	var fromDate = '1/1/2000';
	var toDate = '31/12/2099';
	var firstCharofCellName = '';
	var currentBudgetPeriod = '';
	var currentBudgetPeriodInternalId = 0;
	
	try
	{
		//initialising dates using in the code
		initialiseDates();
		
		//getting the first char of the cell name
		firstCharofCellName = cellName.charAt(0);
		
		
		currentBudgetPeriod = 'FY ' +currentFiscalYear + ' : ' + budgetName;
		
		//getting the budget period's internal ID
		currentBudgetPeriodInternalId = findBudgetPeriodId(currentBudgetPeriod);
		
		//cellName 'C' to 'L' 
		switch (firstCharofCellName)
		{
			case 'C':
				//getting the 'from' and 'to' date of rolling three months
				fromDate = '1/' + rollingStartMonth + '/' +currentFiscalYear;				
				toDate = todayDate;	
				//generate the link for actuals
				cellSearchLink = generateCellLinkByCellNameforActuals(cellSearchLinkActuals,cellAccountGroup,fromDate,toDate);
				break;
				
			case 'D':
			case 'N':
				// Main Budgets
				currentBudgetPeriod = 'FY '+ currentFiscalYear +' : Main';					//setting the budget period
				currentBudgetPeriodInternalId = findBudgetPeriodId(currentBudgetPeriod);	//getting the internal id of particular budget period
				//generate the link for budgets
				cellSearchLink = generateCellLinkByCellNameforBudgets(cellSearchLinkBudgets,cellAccountGroup,currentBudgetPeriodInternalId);
				break;
				
			case 'G': 
			case 'Q':
				//current budget period (Main/ RF1/RF2)
				currentBudgetPeriodInternalId = findBudgetPeriodId(currentBudgetPeriod);
				cellSearchLink = generateCellLinkByCellNameforBudgets(cellSearchLinkBudgets,cellAccountGroup,currentBudgetPeriodInternalId);
				break;

			case 'J':
				//rolling three months actuals for prior year
				fromDate = '1/' + rollingStartMonth + '/' +(rollingYear -1);				
				toDate = priorYearSameDate;		
				cellSearchLink = generateCellLinkByCellNameforActuals(cellSearchLinkActuals,cellAccountGroup,fromDate,toDate);
				break;
			
			case 'M':
				//year to date actuals
				fromDate = '1/4/' + currentFiscalYear;	
				toDate = todayDate;	
				cellSearchLink = generateCellLinkByCellNameforActuals(cellSearchLinkActuals,cellAccountGroup,fromDate,toDate);
				break;
										
			case 'T':
				//year to date actuals in prior year
				fromDate = '1/4/' + lastFiscalYear;						
				toDate = priorYearSameDate;	
				cellSearchLink = generateCellLinkByCellNameforActuals(cellSearchLinkActuals,cellAccountGroup,fromDate,toDate);
				break;
				
			default:
				cellSearchLink = '';
				break;
		}
		
	}
	catch(e)
	{
		errHandler('generateCellLinkByCellName', e);
	}
	
	auditData('generateCellLinkByCellName', (cellName + ' ' +cellSearchLink));
	return cellSearchLink;
}



/****************************************************************************************
 * generateCellLinkByCellNameforActuals - Generate the link for each cell name which are coming under actuals
 * 
 * @param cellSearchLinkActuals		- the link of the '(SYSTEM) TS Summary Report Detail' savedd search
 * @param cellAccountGroup			- Sumamry account group of the cell
 * @param fromDate					- the value which the '#fromdate# should be replaced with
 * @param toDate					- the value which the '#todate# should be replaced with
 * 
 * @returns {String}				- The link with the replaced data
 * 
 *****************************************************************************************/
function generateCellLinkByCellNameforActuals(cellSearchLinkActuals,cellAccountGroup,fromDate,toDate)
{
	
	try
	{
		cellSearchLinkActuals = replaceAll(cellSearchLinkActuals,'#accountgroup#', cellAccountGroup);
		cellSearchLinkActuals = replaceAll(cellSearchLinkActuals,'#fromdate#', fromDate);
		cellSearchLinkActuals = replaceAll(cellSearchLinkActuals,'#todate#', toDate);
		
	}
	catch(e)
	{
		errHandler('generateCellLinkByCellNameforActuals', e);
	}
	
	return cellSearchLinkActuals;

}


/****************************************************************************************
 * generateCellLinkByCellNameforBudgets - Generate the link for each cell name which are coming under actuals
 * 
 * @param cellSearchLinkBudgets		- the link of the 'TS Summary budget Details' saved search
 * @param cellAccountGroup			- Sumamry account group of the cell
 * @param currentBudgetPeriod		- the budget period
 * 
 * @returns {String}				- The link with the replaced data
 * 
 ****************************************************************************************/
function generateCellLinkByCellNameforBudgets(cellSearchLinkBudgets,cellAccountGroup,currentBudgetPeriodInternalId)
{	
	try
	{
		cellSearchLinkBudgets = replaceAll(cellSearchLinkBudgets,'#accountgroup#', cellAccountGroup);
		cellSearchLinkBudgets = replaceAll(cellSearchLinkBudgets,'#budgetperiod#', currentBudgetPeriodInternalId);
	}
	catch(e)
	{
		errHandler('generateCellLinkByCellNameforBudgets', e);
	}
	
	return cellSearchLinkBudgets;
}



/***************************************************************************
 * 
 * initialiseDates Function - Initialising dates used throughout the 
 * 								  script
 * 
 **************************************************************************/
function initialiseDates()
{
	//declaring local variables
	var fiscalToday = null;
	var currentFiscalDate = 0;
	var currentFiscalMonth = 0;
	
	var priorMonthDate = null;
	var currentDate =0;
	var lastYear = 0;
	var rollingDate = null;
	var rollingPriorDate = null;

	try 
	{
		context = nlapiGetContext();
		
		//todays date
		today = new Date();													// format - MMM dd yyyy
		fiscalToday = nlapiAddMonths(today, -3); 							//Getting today's fiscal date (as fiscal year starts on Apr)

		currentFiscalYear = fiscalToday.getFullYear();						//current fiscal year
		currentFiscalMonth = fiscalToday.getMonth() + 1;					// current month according to the fiscal calander
		currentFiscalDate = fiscalToday.getDate();
		currentFiscalDate = (currentFiscalDate + '/'+ currentFiscalMonth + '/'+ currentFiscalYear);	

		currentDate = today.getDate();										//current date
		currentMonth = today.getMonth()+1;									//+1 is because the first month starts from 0
		currentYear = today.getFullYear();	
		todayDate = currentDate + '/' + currentMonth + '/' + currentYear;	// Format - dd/mm/yyyy

		lastYear = (currentYear -1);										//last year
		lastFiscalYear = currentFiscalYear - 1;								//last fiscal year
		nextFiscalYear = currentFiscalYear + 1;								//next fiscal year

		priorMonthDate = nlapiAddMonths(today, -1); 						// the date similar to today's date in previous month. example -if today is 04/01/2013 then this would be 04/12/2012
		priorMonth = priorMonthDate.getMonth() + 1;							//prior month
		priorMonthsYear = priorMonthDate.getFullYear();						//year which belongs to the prior month. in the previous example , this is 2012.

		rollingDate = nlapiAddMonths(today, -2); 							//whole date before three months
		rollingStartMonth = rollingDate.getMonth() + 1;						// the starting month of 'rolling three months'
		rollingYear = rollingDate.getFullYear();							// the year which belongs to the rstarting month of 'rolling three months'

		rollingPriorDate = nlapiAddMonths(today, -3); 						//the previous month's date of rolling three month's starting month
		rollingStartPriorMonth =rollingPriorDate.getMonth() + 1;			//the previous month of rolling three month's starting month
		rollingPriorYear = rollingPriorDate.getFullYear();					//the year which belongsto the previous month of rolling three month's starting month

		fiscalyearEndDate = '31/3/' + nextFiscalYear;						//end date of the fiscal year
		formattedFiscalYearStartDate = nlapiStringToDate(fiscalyearEndDate);
		
		//setting budgetName
		setBudgetName();

		currentMonthName = getMonthName(currentMonth);					//Getting the name of the current month (eg. 'March')
		currentFullDate = currentDate + ' ' + currentMonthName + ' ' +currentYear ;

		
		//getting the same date as today, in the previous year		
		if(today <= formattedFiscalYearStartDate)
		{
			priorYearSameDate = currentDate + '/' + currentMonth + '/' + lastYear;
		}
		else 
		{
			priorYearSameDate = fiscalyearEndDate;
		}
		 

	} 
	catch (e) 
	{
		errHandler("initialiseDates : ", e);
	}
}


/***************************************************************************
 * 
 * setBudgetName Function - setting the budget name depending on the current month
 * 
 **************************************************************************/
function setBudgetName()
{
	try
	{
		//setting budgetName
		if(currentMonth > 7 && currentMonth < 12 )
		{
			budgetName ='RF1';
		}
		else if(currentMonth <8 && currentMonth >3)
		{
			budgetName = 'Main';
		}
		else
		{
			budgetName = 'RF2';
		}
	}
	catch(e)
	{
		errHandler("setBudgetName : ", e);
	}
}


/***************************************************************************
 * 
 * findBudgetPeriodId Function - to find the internal id of the budget period
 * 
 * @param currentBudgetPeriod	- the name of the current budget period
 * 
 * @returns {String}			- The internal id of the budget period
 ***************************************************************************/
function findBudgetPeriodId(currentBudgetPeriod)
{
	var budgetInternalId = 0;

	try
	{
		switch(currentBudgetPeriod)
		{
			case 'FY 2012 : Main' :
				budgetInternalId = 4;
				break;
				
			case 'FY 2012 : RF1' :
				budgetInternalId = 5;
				break;
				
			case 'FY 2012 : RF2' :
				budgetInternalId = 6;
				break;
				
			case 'FY 2013 : Main' :
				budgetInternalId = 7;
				break;
				
			case 'FY 2013 : RF1' :
				budgetInternalId = 8;
				break;
				
			case 'FY 2013 : RF2' :
				budgetInternalId = 9;
				break;
				
			case 'FY 2014 : Main' :
				budgetInternalId = 10;
				break;
				
			case 'FY 2014 : RF1' :
				budgetInternalId = 11;
				break;
				
			case 'FY 2014 : RF2' :
				budgetInternalId = 12;
				break;
				
			case 'FY 2015 : Main' :
				budgetInternalId = 13;
				break;
				
			case 'FY 2015 : RF1' :
				budgetInternalId = 14;
				break;
				
			case 'FY 2015 : RF2' :
				budgetInternalId = 15;
				break;
				
			default:
				budgetInternalId = -1;
				break;
		}	
	}
	catch(e)
	{
		errHandler("findBudgetPeriodId", e);
	}
	
	return budgetInternalId;
}


/*************************************************************************
 * getCellLinkByCellName - gets the Cell's Link by passing in the Cell Name
 * 
 * @param cellName
 * @returns {String}
 ***********************************************************************/
function getCellLinkByCellName(cellName)
{
	var rowId = 0;
	var retVal = '';
	
	try
	{
		rowId = getRowIdByName(cellName);
		retVal = cellArray[linkColumn][rowId];
	}
	catch(e)
	{
		errHandler('getCellLinkByCellName',e);
	}
	
	return retVal;
}

/*************************************************************************
 * getCellLinkByCellTag - gets the Cell's Link by passing in the Cell Tag
 * 
 * @param cellTag
 * @returns {String}
 **************************************************************************/
function getCellLinkByCellTag(cellTag)
{
	var rowId = 0;
	var retVal = '';
	
	try
	{
		rowId = getRowIdByTag(cellTag);
		retVal = cellArray[linkColumn][rowId];
	}
	catch(e)
	{
		errHandler('getCellLinkByCellTag',e);
	}
	
	return retVal;
}





/**********************************************************************************************************
 * Other functions not used in story tellers management spreadsheet
 *********************************************************************************************************/

/***********************************************************************************************
 * Compares two dates and checks if the departure date is greater than the return date.
 * @governance 0.
 *
 * @param  {date}    	    The departure or start date.
 * @param  {date}	        The return or finish date.
 * @return {invalidDate}     Returns 0 or -1 depending on if the check was successful or not.
 *
 * @since  2012
 ***************************************************************************************************/
function checkDate(departDate,returnDate)
{
	try
	{
		nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: depart date', departDate);
		nlapiLogExecution('DEBUG', 'Function: Check Date ** Var: return date', returnDate);

		var dateCheckDepart = nlapiStringToDate(departDate);
		var dateCheckReturn = nlapiStringToDate(returnDate);

		var invalidDate = 0;

		var datDepart = Date.parse(dateCheckDepart);
		var datReturn = Date.parse(dateCheckReturn);

		if(datDepart > datReturn)
		{
			invalidDate = 1;
			nlapiLogExecution('DEBUG', '***RETURN IS BEFORE DEPART****');
		}

		nlapiLogExecution('DEBUG', 'depart date', datDepart);
		nlapiLogExecution('DEBUG', 'return date', datReturn);

		return invalidDate;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Check date function encountered an error: ', e.message);

		return 0;
	}

}




/************************************************************************************************
 * Finds the difference between two dates in unix time and then returns this in a integer whole number.
 * @governance 0.
 *
 * @param  {date}    	    The departure or start date.
 * @param  {date}	        The return or finish date.
 * @return {invalidDate}     Returns the number of days between the two dates.
 *
 * @since  2012
 ************************************************************************************************/
//sample usage
//var sDate= '12/12/2011';
//var eDate = '13/12/2014';

//a = daysBetween(sDate,eDate);

function daysBetween(date1, date2) {

	var first= nlapiStringToDate(date1);
	var second= nlapiStringToDate(date2);

	// Copy date parts of the timestamps, discarding the time parts.
	var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
	var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

	// Do the math.
	var millisecondsPerDay = 1000 * 60 * 60 * 24;
	var millisBetween = two.getTime() - one.getTime();
	var days = millisBetween / millisecondsPerDay;

	// Round down.
	return Math.floor(days);
}



/**
 * Finds the difference between two dates 
 *
 * @param  {date}    	    The departure date.
 * @param  {date}	        The return date.
 * @return {dateDiffRound}     Returns the number of days between the two dates.
 *
 * @since  2012
*/
function dateDiff(departDate, returnDate)
{
	try
	{
		nlapiLogExecution('DEBUG', 'depart date', departDate);
		nlapiLogExecution('DEBUG', 'return date', returnDate);

		var dateDiffRound = 0;

		var newDepartDate = nlapiStringToDate(departDate);
		var newReturnDate = nlapiStringToDate(returnDate);	

		var datDepart = Date.parse(newDepartDate);
		var datReturn = Date.parse(newReturnDate);

		nlapiLogExecution('DEBUG', 'datDepart: ' + datDepart);
		nlapiLogExecution('DEBUG', 'datReturn: ' + datReturn);

		var dateDifference = ((datReturn - datDepart)/(24*60*60*1000)-1);
		nlapiLogExecution('DEBUG', 'dateDifference', dateDifference);

		if(dateDifference > 0)
		{
			dateDiffRound = Round(dateDifference, 1);
			nlapiLogExecution('DEBUG', 'dateDiffRound', dateDiffRound);
		}
		else 
		{
			dateDiffRound = dateDifference;
		}


		return dateDiffRound;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'date diff function encountered the following error: ', e.message);

		return false;
	}
}



/**
 * Takes in a string of data and escapes any apostrophes in the string.
 * @governance 0.
 *
 * @param  {str}    	String input
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */
function escapeApos(str)
{
	str=str.replace("'","\\'");

	return str;
}



/**
 * Takes in strings that may be in a text field or have new line statements in them and escapes them
 * @governance 0.
 *
 * @param  {str}    	String input.
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */
function escapeNewLine(str)
{
	try
	{
		nlapiLogExecution('DEBUG','The string is: ' + str);
		str=str.replace(/\\n/gi, " ");
		nlapiLogExecution('DEBUG','**ESCAPED** The string is now: ' + str);
		return str;
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG','Escape new line function had an error: ' + e.message);
		return false;
	}
}


/**
 * This function will manually escape a string escaping instances of line break and new line and replacing them with a whitespace. Use for converting a text area.
 * @governance 0.
 *
 * @param  {str}    	String input.
 * @return {str}     Returns the escaped string.
 *
 * @since  2011
 */
function reduceString(str)
{
	str=str.replace(/\n/g,' ');
	str=str.replace(/\r/g,'');

	return str;
}



/**********************************************************************************************************************
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
 **********************************************************************************************************************/
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
		return value;
	}
}


/**
 * Takes in strings that may be in a text field or have new line statements in them and escapes them
 * @governance 
 * When used on standard transactions: 20
 * When used on standard non-transactions: 10
 * When used on custom records: 4
 *
 * @param  {record}    	record name string.
 * @param  {recID}    	record name string. 
 * @return {recID}       Re.
 *
 * @since  2011
 */

function submit(record, recID)
{
	var retVal = false;

	try 
	{
		nlapiSubmitRecord(record);
		nlapiLogExecution('DEBUG', 'Record submitted', recID);
		retVal = true;
	}

	catch(e) 
	{
		nlapiLogExecution('DEBUG', 'Record not submitted', e.message);
		retVal = false;
	}
	
	return retVal;
}


/**
 * Takes in a variable and prints it out to the NetSuite execution log 
 * DOES NOT WORK WITH CLIENT SCRIPTS
 * @governance 0
 *
 * @param  {debug}    	Variable value.
 * @return {NA}       	Returns true.
 *
 * @since  2012
 */

function dbc(debug)
{
	nlapiLogExecution('DEBUG', 'Debug check: ' + debug);

	return true;
}


/**
 * Loads a record for user event scripts
 * ONLY WORKs WITH USER EVENT SCRIPTS
 * @governance 0
 *
 * @return {NA}       	Returns the record.
 *
 * @since  2012
 */
function loadRecordUE()
{
	var recType = '';
	var record = null;
	var recID = 0;

	recType = nlapiGetRecordType();

	// load current record
	try
	{
		record = nlapiLoadRecord(recType, recID);
	}

	catch(e)
	{
		nlapiLogExecution('DEBUG', 'Unsupported type', e.message);
	}

	return record;
}


/**
 * Removes white spaces before
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns
 */
function ltrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}


/**
 * Removes white spaces after
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns
 */
function rtrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}

/**
 * Removes white spaces before and after
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns
 */
function trimAll(str)
{
	str = ltrim(str);
	str = rtrim(str);
	return str;
}

/***********************************
 *  Gets the Fiscal Start Date in NetSuite Format
 ***********************************/
function getNSFiscalStartDate()
{	
	var NSFiscalStart = "";
	var Today = new Date();
	
	try
	{
		if (Today.getMonth() >= 9)
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - >=9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + Today.getFullYear();
		}	 
		else
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - <9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + String(parseInt(Today.getFullYear()) - 1);
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'NSFiscalStart Error', e.message);
	}

	return NSFiscalStart;
}


/***********************************
 *  Gets the Fiscal End Date in NetSuite Format
 ***********************************/
function getNSFiscalEndDate()
{

	var Today = new Date();
	var NSFiscalEnd = "";
	if (Today.getMonth() >= 9)
	{
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear() + 1);
	}	 
	else
	{
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear());
	}

	return NSFiscalEnd;
}


/**
 *  returns the business year 
 * 
 */
function thisyear()
{
	var today = new Date();
	var year = today.getFullYear();

	if (today.getMonth() >= 10)	
	{
		year = today.getFullYear()+1;
	}

	return year;

}

/**
 *  checks if date is in the range of startdate/enddate 
 *  
 * @param date 		- the date which need to be validated
 * @param startdate	- the starting date of the range
 * @param enddate	- the ending date of the range
 * @returns {Boolean}
 */
function isDateinRange(date,startdate,enddate)
{
	var input = dateConv(date,0);
	var start = dateConv(startdate,0);
	var end = dateConv(enddate,0);

	// Convert both dates to milliseconds
	var input_ms = input.getTime();
	var start_ms = start.getTime();
	var end_ms = end.getTime();

	if (input_ms>=start_ms && input_ms<=end_ms)
	{
		return true;
	}
	else
	{
		return false;
	}
}


/**
 *  used for dateConv
 */
function jsDate_To_nsDate(jsdate)
{	  	
	var theDay = jsdate.getDate();
	var theMonth = jsdate.getMonth()+1;
	var theYear = jsdate.getFullYear();
	var nsdate = '';
	
	nsdate = theDay+"/"+theMonth+"/"+theYear;

	return nsdate;
}


/**
 *  used for dateConv
 */
function nsDate_To_jsDate(nsdate)
{
	var dateStr = nsdate.split("/");  
	var theDay = dateStr[0];
	var theMonth = dateStr[1] - 1;
	var theYear = dateStr[2];    
	var jsdate = '';

	jsdate= new Date(theYear ,theMonth ,theDay);
	
	return jsdate;
}


/**
 *  used for dateConv
 *  mode 0 = NetSuite to JS | mode 1 = JS to NetSuite 
 */
function dateConv(date,mode)
{
	if (mode == 0)
		return nsDate_To_jsDate(date);

	if (mode == 1)
		return jsDate_To_nsDate(date);

}


/**
 * Displaying the message box
 * @param Data
 * @param Title
 */
function MessageBox(Data, Title)
{
	if(Title)
	{
		alert(Title + '\n\n' + Data);	
	}
	else
	{
		alert(Data);
	}

}



/**
 *  for look up invoices
 *  
 * @param invoiceNo - invoice number
 * @returns {String} -the internal ID of the invoice
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is',invoiceNo);                          
		invoiceSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');                      

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

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





/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************
 *
 * >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>!!!! DO NOT CALL THESE FUNCTIONS - THEY ARE EXAMPLES !!!!<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * 
 *
/****************************************************************************************************************************************************************************/
/****************************************************************************************************************************************************************************/


function listAllValuesEntity()
{
	var sCashSale = nlapiLoadRecord('customer', 715);

	var value;
	var itemVector = new Array();

	itemVector = sCashSale.getAllFields();

	for (var i = 0; i < itemVector.length; i++) 
	{
		value = sCashSale.getFieldValue(itemVector[i]);
		nlapiLogExecution('DEBUG', 'item fields '+itemVector[i]+' '+value);
	}

}


/**
 * list all values sub
 */

function listAllValues()
{
	var sCashSale = nlapiLoadRecord('cashsale', 9853);

	var value;
	var itemVector = new Array();

	itemVector = sCashSale.getAllLineItemFields('item');
	for (var i = 0; i < itemVector.length; i++) 
	{
		value = sCashSale.getLineItemValue('item', itemVector[i], 1);  // linenum 1 only
		nlapiLogExecution('DEBUG', 'item fields '+itemVector[i]+' '+value);
	}
}


/**
 *  process loyality scheme
 * @param type
 * @returns {Boolean}
 */
function ProcessLoyaltyScheme(type)
{
	var currentContext = '';
	currentContext = nlapiGetContext();
	var usageRemaining = currentContext.getRemainingUsage();
	//var TheRecord = '';
	var TheCurrentTXID = nlapiGetRecordId();
	var CurrentRecordType = '';

	if(TheCurrentTXID == -1)
	{
		nlapiLogExecution('ERROR', 'Current Transaction ID', 'Error: -1');
		return true;  //Don't stop it from saving...
	}

	CurrentRecordType = nlapiGetRecordType();


	nlapiLogExecution('DEBUG', 'Current Record ID and Type:', TheCurrentTXID  + ', ' + type);

	if(currentContext.getExecutionContext() != 'userinterface')
	{
		//we need it to work only on UserInterface for now...so silently allow it without processing.
		nlapiLogExecution('DEBUG', 'Execution Context:', currentContext.getExecutionContext());
		return true;
	}

	if(nlapiGetRole() == '3')
	{
		//only Administrator for now...
		nlapiLogExecution('DEBUG', 'Role Check: ', 'Administrator ');

	}
	else
	{
		//Non-administrator role can get lost for the time being.
		nlapiLogExecution('DEBUG', 'Role Issue','A non-administrator role ' );
		return true;
	}

	switch(type)
	{
		case 'create':
		case 'edit':
			break;
		
		default:
			//type is not supported here so just ignore it...
			nlapiLogExecution('DEBUG', 'Not Running', 'Unsupported type. Exiting script...');
		
		return true;
	}

	
	switch(CurrentRecordType.toString())
	{
		case 'salesorder':
		case 'cashsale':
			TheRecord = nlapiLoadRecord(CurrentRecordType, TheCurrentTXID);
			break;
		default:
			nlapiLogExecution('DEBUG', 'RecordType', CurrentRecordType );
		break;
	}

	nlapiLogExecution('DEBUG', 'Usage', usageRemaining);

	return true;
}

/**
 *  project search
 *  
 * @param assistant
 * @param expenditureCustomer
 * @param projectSearchResults
 * @param projectSearchFilters
 * @param projectSearchColumns
 * @returns
 */
function projectSearch(assistant, expenditureCustomer, projectSearchResults,projectSearchFilters,projectSearchColumns)
{
	// search filters
	projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
	projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
	projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	// search columns
	projectSearchColumns[0] = new nlobjSearchColumn('entityid');
	projectSearchColumns[1] = new nlobjSearchColumn('internalid');
	// do search
	projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

	return projectSearchResults;
}


/**
 * 	Add project field
 */
function addProjectField(assistant, projectDetails, projectSearchResults,projectSearchFilters,projectSearchColumns)
{
	// project fields
	assistant.addFieldGroup('groupproject','Project details');
	projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

	// project name array
	var projectNameArray = new Array();

	//add blank select option at top of list
	projectDetails.addSelectOption('','',true);

	for (var i = 0; i < projectSearchResults.length; i++)
	{
		projectNameArray = projectSearchResults[i].getValue(projectSearchColumns[0]).split(":");

		var projectName = projectNameArray[projectNameArray.length-2] + projectNameArray[projectNameArray.length-1];

		projectDetails.addSelectOption(projectSearchResults[i].getValue(projectSearchColumns[1]), projectName ,false);
	} //for

	return projectDetails;
}

/**
 * Add customer field
 * 
 * @param expCustomer
 * @param assistant
 * @returns
 */
function addCustomerField(expCustomer, assistant)
{
	// customer
	assistant.addFieldGroup('groupcustomer','Customer');
	expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

	// create search for customer records to use as select options in expCustomer
	var customerSearchFilters = new Array();
	var customerSearchColumns = new Array();

	//search filters			
	customerSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');				

	// search columns
	customerSearchColumns[0] = new nlobjSearchColumn('internalid');
	customerSearchColumns[1] = new nlobjSearchColumn('companyname');
	customerSearchColumns[2] = customerSearchColumns[1].setSort();

	// perform search
	var customerSearchResults = nlapiSearchRecord('customer', null, customerSearchFilters, customerSearchColumns);

	// if results are found to customer search, populate the expCustomer select options
	if (customerSearchResults)
	{
		//add blank select option at top of list
		expCustomer.addSelectOption('','',true);

		for (var i = 0; i < customerSearchResults.length; i++)
		{
			expCustomer.addSelectOption(customerSearchResults[i].getValue(customerSearchColumns[0]),customerSearchResults[i].getValue(customerSearchColumns[1]),false);
		} //for
	} //if

	return expCustomer;
}


/************
 *  Creates a new Automatically Generated ID
 *  
 * @param {Object} recordId Internal ID of the Settings Record
 ************/
function CreateNewID(recordId)
{

	//Declare the variables used within this function
	var prefix = '';
	var lastID = 0;
	var desiredLength = -1;
	var paddingCharacter = '0';
	var newID = 0;
	var generatedID = '';
	var padding = '';

	//First we need to get all the fields from the Custom Record
	try
	{
		prefix = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_prefix');
		lastID = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_lastid'));
		desiredLength = parseInt(nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_desiredlength'));
		paddingCharacter = nlapiLookupField('customrecord_fhl_uniqueid', recordId, 'custrecord_fhl_uid_paddingchar');

		//Pre-lim check to see if the PaddingCharacter will cause any headaches...
		if(paddingCharacter == null || paddingCharacter.length != 1)
		{
			nlapiLogExecution('error','GenerateNewID', 'PaddingCharacter: ' + paddingCharacter);
			return 'PaddingError';
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','GenerateNewID Error', e.message);
		return 'Error L32';
	}

	//increment the Last ID by 1
	newID = parseInt(lastID)+1;
	nlapiLogExecution('debug', 'newID: ' + newID + ', lastID = ' + lastID);
	try
	{
		//Submit this newly created field to the Custom Record
		nlapiSubmitField('customrecord_fhl_uniqueid', recordId,'custrecord_fhl_uid_lastid',newID,false);
	}
	catch(e)
	{
		//Field failed to submit field to record
		nlapiLogExecution('error','GenerateNewID Error', e.message);
	}

	//Create the Unique ID by concatenating all of the variables together
	generatedID = prefix + padding +  newID;

	while (generatedID.length<desiredLength)
	{
		padding = padding + paddingCharacter;
		generatedID = prefix + padding +  String(newID);
	}

	//At this point we should have a Unique ID of the desired length with the unique number on with the 	
	return generatedID;
}


/**
 * 
 */
function PurchaseInvoice_onSave()
{
	//1 is the settings for Vendor Bill
	var purchaseInvoiceSettingsRecordID = 1;
	var internalRefNum = null;

	try
	{
		internalRefNum = nlapiGetFieldValue('custbody_internalrefno');
	}
	catch(e)
	{
		//Cannot continue...
		nlapiLogExecution('error','PurchaseInvoiceSave', e.message);
		return true;
	}

	try
	{
		if(internalRefNum == null || internalRefNum.length <= 1 || internalRefNum == '')
		{
			internalRefNum = CreateNewID(purchaseInvoiceSettingsRecordID);	
			nlapiLogExecution('debug','Creating new id...','for internalrefnum');
			nlapiSetFieldValue('custbody_internalrefno', internalRefNum, false, false);
		}
	}
	catch(e)
	{
		nlapiLogExecution('error','PurchaseInvoice_onSave', e.message);
	}
	return true;	
}


/**
 * @returns
 * 
 *  1.1.2 - This function adds a button to any part of a form
 *  Client Script
 */
function addButton()
{
	this.SearchButton = document.createElement("input");
	this.SearchButton.type = "button";
	this.SearchButton.style.cssText = "font-size:11px;padding:0 6px;height:19px;margin:0 6px;font-weight:bold;cursor:pointer;";
	this.SearchButton.value = "Call";

	getFormElement(document.forms['main_form'], "comments").parentNode.appendChild(this.SearchButton);
}


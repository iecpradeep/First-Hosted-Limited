/*************************************************************************************************
 * Name:		checkFiscalDates
 * Script Type:	Client
 *
 * Version:		1.0.0 - Initial Release. Compares todays date and fiscal year end date
 * 				1.1.0 - If todays date and fiscal year end date matches, change the fiscal year dates
 *
 * Author:		L.Evans FHL
 * 
 * Purpose:		Checks the fiscal dates when page loads and updates as needed
 *************************************************************************************************/

var recordID = nlapiGetRecordId();
var formLocation = nlapiGetFieldText(name);
var recordName = "customrecord_employeelocation";
var loadedRecord = nlapiLoadRecord(recordName, recordID);
var fiscalFrom = loadedRecord.getFieldValue('custrecord_fiscalyearfrom');
var fiscalTo = loadedRecord.getFieldValue('custrecord_fiscalyearto');
var currentDate = '';
var today = '';
var day = '';
var month = '';
var year = '';
var dateArray = '';

/******************************************
 * 1.0.0
 * returns todays date
 * used later to compare against fiscal date
 *******************************************/

function checkDate()
{
	try
	{
		//getting todays day, month and year
		today = new Date();
		day = today.getDate();
		month = today.getMonth()+1;
		year = today.getFullYear();
		dateArray = new Array(day, month, year.toString());
		
		//joins day, month, year together with a "/" between the values
		currentDate = dateArray.join('/');
		
		return currentDate;
	}
	catch(e)
	{
		alert('checkDate error: ' + e.message);
	}
}

/**************************************************
 * 1.0.0
 * compares fiscal date to todays date
 * 
 * 1.1.0
 * then adds 1 to the fiscal year if the dates match
 ****************************************************/
function checkFiscalTo()
{
	var date = '';
	var jsDateFrom = '';
	var jsDateTo = '';
	var getYearFrom = '';
	var getYearTo = '';
	var toIntFrom = '';
	var toIntTo = '';
	var fiscalFromDay = '';
	var fiscalToDay = '';
	var fiscalFromMonth = '';
	var fiscalToMonth = '';
	var fiscalFromComplete = '';
	var fiscalToComplete = '';
	
	try
	{	
		//day and month value of fiscal year. Used later to complete the date
		fiscalFromDay = nlapiStringToDate(fiscalFrom).getDate();
		fiscalToDay = nlapiStringToDate(fiscalTo).getDate();
		fiscalFromMonth = nlapiStringToDate(fiscalFrom).getMonth() + 1;
		fiscalToMonth = nlapiStringToDate(fiscalFrom).getMonth() + 1;
		
		//todays date
		date = checkDate();
		
		//when the end of the fiscal year is reached, it needs to be changes to the next fiscal year
		if(fiscalTo == date)
		{			
			//convert 'NetSuite dates' to actual dates
			jsDateFrom = nlapiStringToDate(fiscalFrom);
			jsDateTo = nlapiStringToDate(fiscalTo);
			
			//get the year values
			getYearFrom = jsDateFrom.getFullYear();
			getYearTo = jsDateTo.getFullYear();
			
			//change to integer
			toIntFrom = parseInt(getYearFrom);
			toIntTo = parseInt(getYearTo);
			
			//add 1 to years
			fiscalFromYear = toIntFrom + 1;
			fiscalToYear = toIntTo + 1;
			
			//complete version of the date
			fiscalFromComplete = fiscalFromDay + "/"  + fiscalFromMonth + "/" + fiscalFromYear;
			fiscalToComplete = fiscalToDay + "/"  + fiscalToMonth + "/" +  fiscalToYear;	
			
			//set field value with the updated dates
			nlapiSetFieldValue('custrecord_fiscalyearfrom', fiscalFromComplete);
			nlapiSetFieldValue('custrecord_fiscalyearto', fiscalToComplete);
			
			//Log excution informing the user which employee location has changed.
			nlapiLogExecution('DEBUG', 'Fiscal Dates Changed On: ', formLocation);
		}
	}
	catch(e)
	{
		alert('Error: ' + e.message + '\ncheckFiscalTo' );
	}
}
/*****************************************************************************
 *	Name:		MRActualsVsBudgetCalculation
 *	Script Type:	scheduled script
 *	Client: StoryTellers
 *
 *	Version:	1.0.2 - 13/11/2012  First Release - AS
 *				1.1.0 - 16/11/2012 - changing the structure of the script AS
 *				1.2.0 - 18/11/2012 -deleting the Right, Left, getPostingPeriod
 *						functions and obtaining the search data depending on 
 *						the transaction date instead of posting period - AS
 *				1.3.0 -	21/11/2012 - Removing the budgets calculations as it 
 *						exceeds the usage limit of the script -AS	
 *				1.3.1 - Changed addAccountsList() function to get the account
 *						by internal ID - PL
 *				1.4.0 - Changing the prior year actuals to get the data from 
 *						prior fiscal year start to same date as today in the prior year,
 *						Adding code to get the prior year'l rolling three months actuals - AS
 * 				1.5.0 - 04/12/2012 - Adding functions to calculate the head count - AS
 * 				1.6.0 - 16/12/2012 - Error Handling - PAL
 * 				1.6.1 - 02/01/2013 - Adding initialiseDates function to the TSManagementLibrary - AS
 * 				1.6.2 - 03/01/2013 - adding some global variables to the library - AS
 * 				1.6.3 - 04/01/2013 - refactoring code - AS
 *				1.6.4 - 4/1/2013 - removing RF1 from scheduling - AS
 *
 * Author:	FHL 
 * Purpose:	to calculate the budgets and actuals for creating the management
 *  			spread sheet reports
 * 
 * Script: customscript_actuals_budget_calculation
 * Deploy: customdeploy_mr_actuals_vs_budget_calc
 * 
 * Library - TSManagementLibrary.js
 * 
 **********************************************************************/
//Declaring global variables
var accountInternalId =0;
var actualsSearch = new Array();
var actualsFilters = new Array();
var actualsColumns = new Array();

var currentmonth = 0; 
var currentFiscalDate = null;
var context = null;
var currentYear = 0;

var headCount = 0;
var headCountColumns = new Array();

var fiscalyearEndDate = null;
var formattedFiscalYearStartDate = null;
var fiscalYearStartDate = null;

var nextFiscalYear = 0; 

var priorMonth = 0;
var priorMonthsYear = 0;

var rollingStartPriorMonth;
var rollingPriorYear;

var startDate ='1/1/2000';
var endDate = '31/12/2099';


/***************************************************************************
 * 
 * actualsAndBudgetCalculation Function - The main function
 * 
 **************************************************************************/
function actualsAndBudgetCalculation()
{
	try
	{
		//Call initialiseDates function in the library which lists all the static variables used within the scope of the script
		initialiseDates();
		
		//calling addAccountList function which adds list of accounts to the custom record : Budgets and Actuals
		addAccountsList();

		//Year To Date actuals
		startDate = '1/4/' + currentFiscalYear;										//Setting start date for the search filter
		endDate = todayDate;														//Setting end date for the search filter
		actualsSearch = getActuals(startDate, endDate);								//Getting the actuals' transactions within this date range
		addActualsToCrs(actualsSearch,'custrecord_year_to_date_actuals');			//Adding the actuals to particular field in custom record type 

		//year to date actuals head count
		startDate = '30/4/' + currentFiscalYear;									//Setting start date for the search filter
		endDate = '30/' + priorMonth + '/' + priorMonthsYear;						//Head count is calculated from the start of the year to the previous month of the current date
		headCount = calculateHeadCount(startDate,endDate);
		addHeadCountToCrs(headCount, 'custrecord_year_to_date_actuals');

		//prior Year actuals (to same date as today's date in last year)
		startDate = '1/4/' + lastFiscalYear;										//Setting start date for the search filter
		endDate = priorYearSameDate;												//Setting end date for the search filter
		actualsSearch = getActuals(startDate, endDate);								//Getting the actuals' transactions within this date range
		addActualsToCrs(actualsSearch,'custrecord_prior_year_actuals');				//Adding the actuals to particular field in custom record type 

		//prior year actuals head count
		startDate = '30/4/' + lastFiscalYear;	
		endDate = '30/' + priorMonth + '/' + (priorMonthsYear-1);				
		headCount = calculateHeadCount(startDate,endDate);
		addHeadCountToCrs(headCount, 'custrecord_prior_year_actuals');

		//rolling three months actuals 
		startDate = '1/' + rollingStartMonth + '/' +currentFiscalYear;				//Setting start date for the search filter
		endDate = todayDate;														//Setting end date for the search filter
		actualsSearch = getActuals(startDate, endDate);								//Getting the actuals' transactions within this date range
		addActualsToCrs(actualsSearch,'custrecord_rolling_three_months_actuals');	//Adding the actuals to particular field in custom record type 

		//rolling three months actuals head count
		startDate = '30/' + rollingStartPriorMonth + '/' +currentFiscalYear;		//head count is calculated starting from the previous month of the date needed 
		endDate = '30/' + priorMonth + '/' + priorMonthsYear;
		headCount = calculateHeadCount(startDate,endDate);
		addHeadCountToCrs(headCount, 'custrecord_rolling_three_months_actuals');

		//prior year rolling three months actuals 
		startDate = '1/' + rollingStartMonth + '/' + (rollingYear -1);				//Setting start date for the search filter
		endDate = priorYearSameDate;														//Setting end date for the search filter
		actualsSearch = getActuals(startDate, endDate);								//Getting the actuals' transactions within this date range
		addActualsToCrs(actualsSearch,'custrecord_py_rolling_months_actuals');	//Adding the actuals to particular field in custom record type 

		//prior year rolling three months actuals head count 
		startDate = '30/' + rollingStartPriorMonth + '/' + (rollingPriorYear -1);				//Setting start date for the search filter
		endDate = '30/' + priorMonth + '/' + (priorMonthsYear-1);
		headCount = calculateHeadCount(startDate,endDate);
		addHeadCountToCrs(headCount, 'custrecord_py_rolling_months_actuals');

		//Getting the script's remaining usage limit
		nlapiLogExecution('audit', 'Before Budget remaining usage ', context.getRemainingUsage());

		//calling another scheduled script to get the Budgets - main
		callScheduleScript('customscript_mr_budget_main_calculation', 'customdeploy_mr_budget_main_calc');

		//calling another scheduled script to get the Budgets - RF2
		callScheduleScript('customscript_mr_budget_rf2_calculation', 'customdeploy_mr_budget_rf2_calc');

	}
	catch(e)
	{
		errorHandler("actualsAndBudgetCalculation : " +e);
	} 
}


/***************************************************************************
 * 
 * addAccountsList Function - Adding the list of accounts to the custom record 
 * 							  set
 * version 1.3.1 - Changed the function to get the account by internal ID - PL
 * 
 **************************************************************************/
function addAccountsList()
{
	//declaring the local variables
	var budgetAndActualRecord = null;
	var accountsSearch = new Array();
	var accountsFilter = new Array();
	var accountsColumns = new Array();
	var internalId = 0;

	try
	{
		//Creating custom record - budgets and actuals
		budgetAndActualRecord =nlapiCreateRecord('customrecord_budgets_and_actuals');

		//filter to obtain the accounts
		accountsFilter = ['type','anyof','Expense','OthIncome','COGS','Income','OthExpense'];       			

		//Getting particular columns
		accountsColumns[0] = new nlobjSearchColumn('internalid',null,null);		

		//Searching the accounts using filters and columns 
		accountsSearch = nlapiSearchRecord('account', null, accountsFilter, accountsColumns);	

		//if the accountsSearch array is not empty
		if(accountsSearch != null)
		{
			//looping through the accountsSearch array
			for(var accountIndex = 1; accountIndex <= accountsSearch.length; accountIndex++)
			{
				internalId =accountsSearch[accountIndex-1].getValue(accountsColumns[0]);								//Getting the internal id of the account

				//PL changed to put internalid in to Account field as it's a List/Record now
				budgetAndActualRecord.setFieldValue('custrecord_accnt', internalId); 									//Set Field value for 'Account'

				//Submitting the record
				nlapiSubmitRecord(budgetAndActualRecord,false, true);	

			}
		}
		
		budgetAndActualRecord.setFieldValue('custrecord_head_count', 'Head Count'); 	//setting the headcount value
		nlapiSubmitRecord(budgetAndActualRecord,false, true);	
	}
	catch(e)
	{
		errorHandler("addAccountsList : " +e);
	} 

}


/***************************************************************************
 * 
 * getActuals Function - Searching the transactions coming under the actuals
 * 
 * @param startDate		- start date of the transaction date filter
 * @param endDate 		- end date of the transaction date filter
 * @returns {Array} 	- actuals array
 * 
 **************************************************************************/
function getActuals(startDate, endDate)
{
	var actualsSearch = null;

	try
	{
		//filter to obtain the actuals
		actualsFilters = [['accounttype','anyof','Expense','OthIncome','COGS','Income','OthExpense'], 		
		                  'and',
		                  ['posting','is','T'],																//posting is true
		                  'and',
		                  ['trandate','within',startDate,endDate]];             							//transaction date is within the start date and the end date

		//Getting particular columns
		actualsColumns[0] = new nlobjSearchColumn('internalid','account','group');							// Getting the internal Id of the account 
		actualsColumns[1] = new nlobjSearchColumn('amount',null,'sum');		

		//Searching the actuals using filters and columns 
		actualsSearch = nlapiSearchRecord('transaction', null, actualsFilters, actualsColumns);		

	}
	catch(e)
	{
		errorHandler("getActuals : " +e);
	} 

	return actualsSearch;	

}



/****************************************************************************
 * 
 * addActualsToCrs Function - Adding the actuals to the custom record type - 
 * 							  	'Budgets and Actuals'
 * 
 * @param actualsSearch 	- the actuals array returned from the getActuals
 * 							  function
 * @param fieldInternalId	- the field id of the custom record type which 
 * 							  needs to be set by the function
 * 	
 ***************************************************************************/
function addActualsToCrs(actualsSearch, fieldInternalId )
{
	//Declaring the local variables
	var actualsRecord ='';
	var amount = 0;	
	var cusRecInternalId = 0;

	try
	{
		//if the actualsSearch array is not empty
		if(actualsSearch != null)
		{
			//looping through the actualsSearch array
			for(var index =1; index<=actualsSearch.length; index++)
			{	
				accountInternalId =actualsSearch[index-1].getValue(actualsColumns[0]);					//getting the account's internal id
				amount =actualsSearch[index-1].getValue(actualsColumns[1]);								//Getting the amount of transaction

				/*checking whether the actual account's internal id is matching with the account's 
				internal id that is already in the 'budgets and actuals' custom record type */
				cusRecInternalId = genericSearch('customrecord_budgets_and_actuals', 'custrecord_accnt', 'anyof',accountInternalId);

				//if the account is already there in the 'budget and actuals custom record list'
				if(cusRecInternalId!=0)
				{
					//loading the custom record - budgets and actuals
					actualsRecord =nlapiLoadRecord('customrecord_budgets_and_actuals', cusRecInternalId);

					//setting field value of custom record- 'budgets and actuals' and submitting the record*/
					actualsRecord.setFieldValue(fieldInternalId,amount); 							//Setting the particular field with the value of the 'amount'

					//Submitting the record
					nlapiSubmitRecord(actualsRecord,false, true);

				}

			}
		}

	}
	catch(e)
	{
		errorHandler("addActualsToCrs : " +e);
	} 
}



/*******************************************************************
 * scheduleScript - Author Pete
 * 
 * Function to Schedule a Scheduled Script, based on the Script ID and the Script Deployment ID
 * 
 * @param {integer} scriptDeployment - The Internal ID of the Script Deployment
 * @param {integer} scriptId - The Internal ID of the Script
 * @returns {string} retVal - Description of what happened
 * 
 *******************************************************************/
function callScheduleScript(scriptId,scriptDeployment)
{
	var retVal = '';
	var scheduleReturn = '';

	try
	{
		if(String(scriptDeployment) == '')
		{
			retVal = 'No Script Deployment Parameter passed through';
		}

		if(String(scriptId) == '')
		{
			retVal = 'No Script ID Parameter passed through';
		}

		scheduleReturn = nlapiScheduleScript(scriptId, scriptDeployment);
		retVal = scheduleReturn;

		nlapiLogExecution('AUDIT', 'Rescheduling Script', scheduleReturn);

	}
	catch(e)
	{
		errorHandler("callScheduleScript : " +e);
	}

	return retVal;
}


/**************************************************************************
 * generic search - finding the particular records and returns the internal ID
 * 
 * @param table 		- the search record type
 * @param fieldToSearch	- the filter to search
 * @param valueToSearch	- value to search
 * @param operator - the operator to use in the search filter
 * @returns {Number}	- internal ID of the particular record
 * 
 *************************************************************************/
function genericSearch(table, fieldToSearch,operator, valueToSearch)
{
	// Arrays
	var cusRecordSearchFilters = new Array();
	var cusRecordSearchColumns = new Array();
	var searchResult = null; 
	var internalID =0;
	var cusRecordSearchResults = new Array();

	try
	{
		//search filters                  
		cusRecordSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, operator,valueToSearch);                          

		// return columns
		cusRecordSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		cusRecordSearchResults = nlapiSearchRecord(table, null, cusRecordSearchFilters, cusRecordSearchColumns);

		if(cusRecordSearchResults!=null)
		{

			if(cusRecordSearchResults.length>0)
			{
				searchResult = cusRecordSearchResults[0];
				internalID = searchResult.getValue('internalid');

			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch : " +e);
	}     	      

	return internalID;
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


/**************************************************************************
 * calculateHeadCount function - calculating the head count
 * 
 * @param startDate 	- the date which the head count should be started from
 * @param endDate		- the date which the head count is calculated till.
 * @returns {Number}	- average head count
 * 
 *************************************************************************/
function calculateHeadCount(startDate,endDate)
{

	var headCountResults = new Array();
	var monthHeadCount = 0;
	var aveHeadCount = 0.0;
	var noOfMonths = 0;

	try
	{
		//converting the dates to strings for the purpose of comparing the dates
		startDate = nlapiStringToDate(startDate);	
		endDate = nlapiStringToDate(endDate);	

		//calculating the number of months to get the average of head count
		noOfMonths = (endDate.getFullYear() - startDate.getFullYear()) * 12;		//calculating no of months for the no of years between the startdate and end date
		noOfMonths = noOfMonths - startDate.getMonth();
		noOfMonths = noOfMonths + endDate.getMonth()+1;

		//looping through the code from the 'start date' to 'end date', for each month between those two dates 
		for(var date = startDate ; date <= endDate; date = nlapiAddMonths(date,1))
		{
			//calling the function, 'getHeadCount' to get the head count
			headCountResults = getHeadCount(date);
			
			//if results are not empty
			if(headCountResults !=null)
			{
				//get the head count of each month and add all the head counts 
				monthHeadCount = monthHeadCount + parseInt(headCountResults[0].getValue(headCountColumns[0]));
				nlapiLogExecution('audit','monthHeadCount', monthHeadCount);
			}
		}

		//if number of months not equal to 0 (to get rid of the 'division by 0' error)
		if(noOfMonths != 0)
		{
			aveHeadCount = monthHeadCount / noOfMonths;
		}
		else 
		{
			aveHeadCount = 0;
		}
	}
	catch(e)
	{
		errorHandler("calculateHeadCount : " +e);
	}

	return aveHeadCount;
}


/**************************************************************************
 * addHeadCountToCrs function - adding the head count results to the custom record set: budgets and actuals
 *  
 * @param headCount 				- the value for the head count
 * @param fieldInternalIDToAddTo	- the internal id of the field where the 'head count' value will stored in.
 *  
 *************************************************************************/
function addHeadCountToCrs(headCount, fieldInternalIDToAddTo)
{
	//Declaring the local variables
	var headCountRecord ='';
	var cusRecInternalId = 0;

	try
	{

		/*checking whether the actual account's internal id is matching with the account's 
				internal id that is already in the 'budgets and actuals' custom record type */
		cusRecInternalId = genericSearch('customrecord_budgets_and_actuals', 'custrecord_accnt', 'anyof',385);
		nlapiLogExecution('audit', 'addHeadCountToCrs cusRecInternalId', cusRecInternalId);

		//if the account is already there in the 'budget and actuals custom record list'
		if(cusRecInternalId!=0)
		{
			//loading the custom record - budgets and actuals
			headCountRecord =nlapiLoadRecord('customrecord_budgets_and_actuals', cusRecInternalId);

			//setting field value of custom record- 'budgets and actuals' and submitting the record*/
			headCountRecord.setFieldValue(fieldInternalIDToAddTo,headCount); 							//Setting the particular field with the value of the 'head count'

			//Submitting the record
			nlapiSubmitRecord(headCountRecord,false, true);

		}

	}
	catch(e)
	{
		errorHandler("addHeadCountToCrs : " +e);
	} 


}


/**************************************************************************
 * getHeadCount function - finding the head count before the particular date (date where the counting heads is starting from) 
 * 
 * @param searchDate 		- the date which the head count is calculated by
 
 * @returns {array}	- the array of number of internal IDs
 *  
 *************************************************************************/
function getHeadCount(searchDate)
{
	//Declaring local variables 
	var headCountFilters = new Array();
	var headCountResults = new Array();

	try
	{
		/*************************************************************************************************************************************************************
		 * To calculate the head count in the particular time period, we need the number of active employees who were in the company before that particular date
		 *  (as the system doesn't record the head count separately)
		 *************************************************************************************************************************************************************/
		//searching for the employees who were not inactive before the searchDate (in other words, its getting all the active employees before the searchDate)
		headCountFilters[0] = new nlobjSearchFilter('formuladate', null, 'notbefore', searchDate);	
		headCountFilters[0].setFormula('case when({systemnotes.field} = \'Inactive\') then(case when ({systemnotes.newvalue} = \'T\')  then {systemnotes.date} end) end');		// search the system notes to get the active employees
		headCountFilters[1]  = new nlobjSearchFilter('datecreated',null, 'before', searchDate);						// getting the employee records created before the particular date
		headCountFilters[2]  = new nlobjSearchFilter('custentity_excludefromheadcount',null, 'is', 'F');			//getting the employees included in the 'head count'

		//Getting particular columns 
		headCountColumns[0] = new nlobjSearchColumn('internalid',null,'count');						//Getting the number of internal IDs

		//Getting the head count using the columns and filters
		headCountResults = nlapiSearchRecord('employee', null, headCountFilters, headCountColumns);		

	}
	catch(e)
	{
		errorHandler("getHeadCount : " +e);
	} 

	return headCountResults;
}

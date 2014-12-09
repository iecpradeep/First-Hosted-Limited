/************************************************************************
 *	Name		:	MRBudgetMainCalc
 *	Script Type	:	scheduled script
 *	Client		: 	StoryTellers
 *
 *	Version:	1.0.0 - 21/11/2012 First Release - AS
 *				1.1.0 - 06/12/2012 	- Calculating and adding the head count to custom record set - AS
 *				1.1.1 - 02/01/2013 - Adding initialiseDates function to the TSManagementLibrary - AS
 *				1.1.2 - 03/01/2013 - adding some global variables to the library - AS
 *				1.2.2 - 04/01/2012 - Adding RF1 processes to this code and removing whole 'MRBudgetsRF1Calc' scheduled script- AS
 *				1.2.3 - 08/01/2012 - changing the dates in the addBudgetsToCrs - AS
 *
 *	Author:	FHL (AS)
 * 	Purpose:	to calculate the budgets -main for creating the management
 *  			spread sheet reports
 * 
 * Script: customscript_mr_budget_main_calculation
 * Deploy: customdeploy_mr_budget_main_calc
 * 
 * Library - TSManagementLibrary.js
 **********************************************************************/

//Declaring global variables
var accountIntId =0;

var budgetPeriod = '';
var budgetsSearch = new Array();
var budgetsFilters = new Array();
var budgetsColumns = new Array();

var context = null;

var headCount = 0;
var headCountColumns = new Array();

/***************************************************************************
 * 
 * calculateMain Function - The main function
 * 
 **************************************************************************/
function calculateMain()
{
	var startDate = '';
	var endDate = '';

	var headCountEndDate = null;
	var headCountStartDate = null;
	
	try
	{
		//Initialise all the static variables used within the scope of the script
		initialiseDates();
		
		//Calling the getBudgets Function to obtain the budgets
		getBudgets();

		nlapiLogExecution('Audit', 'After actuals remaining usage ', context.getRemainingUsage());
		
		//Year To Date budgets - main
		startDate = '1/4/' + currentFiscalYear;
		endDate = todayDate;
		
		//for head count
		headCountStartDate = '1/4/' + currentFiscalYear;
		headCountEndDate =  '1/' + priorMonth + '/' + priorMonthsYear;
		
		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs('Main',startDate, endDate, headCountStartDate,headCountEndDate,'custrecord_year_to_date_budgets_main');
		
		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs( 'RF1', startDate, endDate, headCountStartDate,headCountEndDate, 'custrecord_year_to_date_budgets_rf1');

		//rolling three months budgets -main
		startDate = '1/' + rollingStartMonth + '/' +currentFiscalYear;				//Setting start date for the search filter
		endDate = todayDate;														//Setting end date for the search filter
			
		//for head count
		headCountStartDate = '1/' + rollingStartPriorMonth + '/' +currentFiscalYear;
		headCountEndDate = '1/' + priorMonth + '/' + priorMonthsYear;
				
		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs('Main',startDate, endDate, headCountStartDate,headCountEndDate, 'custrecord_rolling_months_budgets_main');						
		
		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs('RF1',startDate, endDate,  headCountStartDate,headCountEndDate,'custrecord_rolling_months_budgets_rf1');
			
	}
		
	catch(e)
	{
		errorHandler("calculateMain :" +e);
	} 
}



/***************************************************************************
 * 
 * getBudgets Function - Searching the budgets
 * 
 * custrecord_budgetperiod - Budget period (Example : FY 2012 : main)
 *  
 **************************************************************************/
function getBudgets()
{
	try
	{
		//filtering the budget year by current fiscal year
		budgetsFilters[0] = new nlobjSearchFilter('formulatext', null, 'contains', ''+currentFiscalYear);		//filter the results by current fiscal year
		budgetsFilters[0].setFormula('SUBSTR({custrecord_budgetperiod}, 3,7)');									//returns the year in format 'yyyy'
	
		//Getting particular columns 
		budgetsColumns[0] = new nlobjSearchColumn('custrecord_budgetperiod',null,'group');						//getting grouped 'budget period' from 'budget main' custom record type 
		budgetsColumns[1] = new nlobjSearchColumn('custrecord_account','custrecordparentbudgetname','group');	//getting grouped account from 'budget main' custom record type		
		budgetsColumns[2] = new nlobjSearchColumn('custrecord_apr','custrecordparentbudgetname','sum');			// getting summed April budget amount from the child record : Budget List Items 						
		budgetsColumns[3] = new nlobjSearchColumn('custrecord_may','custrecordparentbudgetname','sum');			// getting summed May budget amount from the child record : Budget List Items
		budgetsColumns[4] = new nlobjSearchColumn('custrecord_jun','custrecordparentbudgetname','sum');			// getting summed June budget amount from the child record : Budget List Items
		budgetsColumns[5] = new nlobjSearchColumn('custrecord_jul','custrecordparentbudgetname','sum');			// getting summed July budget amount from the child record : Budget List Items
		budgetsColumns[6] = new nlobjSearchColumn('custrecord_aug','custrecordparentbudgetname','sum');			// getting summed August budget amount from the child record : Budget List Items
		budgetsColumns[7] = new nlobjSearchColumn('custrecord_sep','custrecordparentbudgetname','sum');			// getting summed September budget amount from the child record : Budget List Items
		budgetsColumns[8] = new nlobjSearchColumn('custrecord_oct','custrecordparentbudgetname','sum');			// getting summed October budget amount from the child record : Budget List Items
		budgetsColumns[9] = new nlobjSearchColumn('custrecord_nov','custrecordparentbudgetname','sum');			// getting summed November budget amount from the child record : Budget List Items
		budgetsColumns[10] = new nlobjSearchColumn('custrecord_dec','custrecordparentbudgetname','sum');		// getting summed December budget amount from the child record : Budget List Items
		budgetsColumns[11] = new nlobjSearchColumn('custrecord_jan','custrecordparentbudgetname','sum');		//getting summed January budget amount from the child record : Budget List Items					
		budgetsColumns[12] = new nlobjSearchColumn('custrecord_feb','custrecordparentbudgetname','sum');		// getting summed February budget amount from the child record : Budget List Items	
		budgetsColumns[13] = new nlobjSearchColumn('custrecord_mar','custrecordparentbudgetname','sum');		// getting summed March budget amount from the child record : Budget List Items
		budgetsColumns[14] = new nlobjSearchColumn('custrecord_department','custrecordparentbudgetname','group');		// getting summed Department from the child record : Budget List Items
				
		//Searching the budgets using the columns and filters
		budgetsSearch = nlapiSearchRecord('customrecord_budgetmain', null, budgetsFilters, budgetsColumns);		
	
	}
	catch(e)
	{
		errorHandler("getBudgets : " +e);
	} 
	
}


/***************************************************************************
 * 
 * addBudgetsToCrs Function - Adding the budgets to the custom record type - 
 * 							  	'Budgets and Actuals'
 *@param type		- budget type : Main, RF1 or RF2
 *@param startDate	- the budget's starting date 
 *@param endDate	- the budget's end date
 *@param fieldIntId	- the field id of the custom record type which 
 * 					  needs to be set by the function
 * 
 * 1.1.0 - 06/12/2012 	- Calculating and adding the head count to custom record set
 * 1.2.3 - 08/01/2012 	- changing the dates in the addBudgetsToCrs 
 **************************************************************************/
function addBudgetsToCrs(type, startDate, endDate ,  headCountStartDate,headCountEndDate,fieldIntId)
{
	//Declaring local variables
	var budgetType ='';
	var budgetRecord = '';
	var amount = 0;
	var monthAmount = 0;
	var cusRecInternalId =0;
	var postingDate ='';
	var budgetTypeStringStart = 0;
	var budgetTypeStringEnd = 0; 
	var monthHeadCount = 0;
	var aveHeadCount = 0.0;
	var noOfMonths = 0;
	var startingDate = '';
	var endingDate = '';
	
	try
	{
		
		//if the budgetsSearch array is not empty
		if(budgetsSearch != null)
		{
			//looping through the budgetsSearch array
			for(var index = 1; index <= budgetsSearch.length; index++)
			{
				accountIntId = budgetsSearch[index-1].getValue(budgetsColumns[1]);						//Getting the account id returned by the budgetSearch array
				budgetPeriod = budgetsSearch[index-1].getText(budgetsColumns[0]);						//getting the budget period (Format - FY 2011 : Main)
			
				budgetTypeStringStart = budgetPeriod.indexOf(':')+2;
				budgetTypeStringEnd =  budgetPeriod.length;
				budgetType= budgetPeriod.substring(budgetTypeStringStart,budgetTypeStringEnd);			//getting the budget type (either Main, RF1 or RF2)
				
				/*checking whether the budget account's internal id is matching with the account's 
				internal id that is already in the 'budgets and actuals' custom record type */
				cusRecInternalId = genericSearch('customrecord_budgets_and_actuals', 'custrecord_accnt', 'anyof',accountIntId);
				
				//if account's name is 'headcount'
				if(accountIntId == 385)
				{					
					//parsing the strings to date for comparison purpose
					startingDate = nlapiStringToDate(headCountStartDate);
					endingDate  = nlapiStringToDate(headCountEndDate);
					
					noOfMonths = (endingDate.getFullYear() - startingDate.getFullYear()) * 12;
					noOfMonths = noOfMonths - startingDate.getMonth();
					noOfMonths = noOfMonths + endingDate.getMonth()+1;
					nlapiLogExecution('audit', 'no of months', noOfMonths);
				}
				else
				{					
					startingDate = nlapiStringToDate(startDate);
					endingDate  = nlapiStringToDate(endDate);
				}
			
				//budget type is equal to the type parsed into the function and if the accountID exists in the 'budgets and actuals' custom record type
				if(budgetType == type && cusRecInternalId!= 0)
				{	
					//re-initialize the variable 
					amount= 0 ;
					
					//looping through the budgetsColumns array (index is starting from 2 because the the amounts columns are starting from 2)
					for(var ind =2; ((ind < budgetsColumns.length-1)); ind++)
					{  
						
						/************************************************************************************
						 * 	calling the function setBudgetPostingDate() to set the posting date to the budget
						 * 
						 * (the budget search returns only the amount for the each month, not the month name.
						 * Therefore to identify the month which the particular amount belongs to, this function
						 * is created.)
						 * **********************************************************************************/
						
						postingDate = setBudgetPostingDate(ind);							
						postingDate = nlapiStringToDate(postingDate);						//converting to posting date to date format for the comparison purpose
						nlapiLogExecution('audit', 'posting date',postingDate);	
						
						//if posting date is in between startingDate and endingDate
						if(postingDate >= startingDate && postingDate <= endingDate)					
						{
							nlapiLogExecution('audit', 'budget posting date', startingDate + ' ' + endingDate );
							monthAmount = budgetsSearch[index-1].getValue(budgetsColumns[ind]);
							
							//if the amount for the month is empty
							if(monthAmount == '')
							{
								//setting the monthAmount to 0 
								monthAmount = 0;
							}

							//Adding up the amounts of each month between the start date and end date
							amount = parseFloat(monthAmount) + amount;		
							
							//To get the head count and calculate the average head count (385 - internal ID of the 'headcount' account)
							if (accountIntId == 385)
							{
								monthHeadCount = amount;
								nlapiLogExecution('audit', 'month head count',monthHeadCount);	
								
								if(noOfMonths != 0)
								{
									aveHeadCount = monthHeadCount / noOfMonths;				//calculate the average of head count
								}
								else 
								{
									aveHeadCount = 0;
								}

							}
						}	
					}
					
					//Loading existing custom record - budgets and actuals with the same account id 
					budgetRecord = nlapiLoadRecord('customrecord_budgets_and_actuals', cusRecInternalId);
					
					//if the account name is 'headcount'
					if(accountIntId == 385)
					{
						//setting field values of custom record- 'budgets and actuals' and submitting the record
						budgetRecord.setFieldValue(fieldIntId,aveHeadCount); 						//Setting the particular field with the value of the 'aveHeadCount'
					}
					else
					{
						//setting field values of custom record- 'budgets and actuals' and submitting the record
						budgetRecord.setFieldValue(fieldIntId,amount); 						//Setting the particular field with the value of the 'amount'
	
					}
					
					//Submitting the record
					nlapiSubmitRecord(budgetRecord,false, true);
										
				}
			
			}	
		}
	}

	catch(e)
	{
		errorHandler("addBudgetsToCrs : " +e);
	} 
}


/************************************************************************************
 * setBudgetPostingDate function - to set the posting date to the budget
 * 
 * (the budget search returns only the amount for the each month, not the month name.
 * Therefore to identify the month which the particular amount belongs to, this function
 * is created.)
 * 
 * 1.1.1 - 19/12/2012 	- refactor - DW
 * 
 * @param ind - index of the record
 * @returns {String} - the posting date in format of dd/mm/yyyy
 * 
 * **********************************************************************************/
function setBudgetPostingDate(ind)
{
	var budgetsPostingDate = '';
	var currentMonth = 0;
	var budgetYear = currentFiscalYear;
	
	try
	{
		if(ind>=2 && ind <=10)
		{
			currentMonth = ind + 2;
		}
		else
		{
			currentMonth = ind - 10;
			budgetYear = currentFiscalYear + 1;
		}
		
		budgetsPostingDate = '1/' + currentMonth + '/' + budgetYear;
	
	}
	catch(e)
	{
		errorHandler("setBudgetPostingDate" +e);
	} 

	return budgetsPostingDate;
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
function genericSearch(table, fieldToSearch, operator, valueToSearch)
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
		errorHandler(e);
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
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());

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


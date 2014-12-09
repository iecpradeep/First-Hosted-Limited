/************************************************************************
 *	Name:		MRBudgetsRF2Calc
 *	Script Type:	scheduled script
 *	Client: StoryTellers
 *
 *	Version:	1.0.0 - 21/11/2012 First Release - AS
 *				1.1.0 - 06/12/2012 	- Calculating and adding the head count to custom record set - AS
 *				1.1.1 - 19/12/2012 	- refactor - DW
 *				1.1.2 - 02/01/2013 - Adding initialiseDates function to the TSManagementLibrary - AS
 *				1.1.3 - 03/01/2013 - adding some global variables to the library - AS
 *				1.2.0 - 04/01/2013 - Removing all the other functions except 'calculateRF2' and adding a new library  - AS
 *
 *	Author:	FHL (AS)
 *  Purpose:	to calculate the budgets -RF2 for creating the management
 *  			spread sheet reports
 * 
 * Script: customscript_mr_budget_rf2_calculation
 * Deploy: customdeploy_mr_budget_rf2_calc
 * 
 * Library - TSManagementLibrary.js, MRBudgetMainCalc.js
 * 
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
 * gettingData Function - The main function
 * 
 **************************************************************************/
function calculateRF2()
{
	var startDate = '';
	var endDate = '';

	var headCountEndDate = null;
	var headCountStartDate = null;
	
	try
	{
		//Initialise all the static variables used within the scope of the script
		initialiseDates();

		//Calling the getBudgets Function to obtain the actuals
		getBudgets();

		//Year To Date budgets - RF2
		startDate = '1/4/' + currentFiscalYear;
		endDate = todayDate;

		//for head count
		headCountStartDate = '1/4/' + currentFiscalYear;
		headCountEndDate =  '1/' + priorMonth + '/' + priorMonthsYear;

		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs('RF2',startDate, endDate, headCountStartDate,headCountEndDate, 'custrecord_year_to_date_budgets_rf2');

		//rolling three months budgets -RF2
		startDate = '1/' + rollingStartMonth + '/' + currentFiscalYear;				//Setting start date for the search filter
		endDate = todayDate;														//Setting end date for the search filter

		//for head count
		headCountStartDate = '1/' + rollingStartPriorMonth + '/' + currentFiscalYear;
		headCountEndDate = '1/' + priorMonth + '/' + priorMonthsYear;
	
		//Calling addBudgetsToCrs function to add the budgets to the custom record set
		addBudgetsToCrs('RF2',startDate, endDate, headCountStartDate,headCountEndDate, 'custrecord_rolling_months_budgets_rf2');
		
	}
	catch(e)
	{
		errorHandler(e);
	} 
}


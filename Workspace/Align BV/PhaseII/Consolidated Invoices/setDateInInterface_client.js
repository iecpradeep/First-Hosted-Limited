/*************************************************************************************************************************************************
 * Name			: setDateInInterface_client.js
 * Script Type	: Client Script : On field change
 * Client		: Align BV 
 * 
 * Version		: 1.0.0 - 28 Mar 2013 - 1st release - AS
 * 				  1.0.1 - 02 Apr 2013 - putting into standards - AS
 *				  1.0.2 - 03 May 2013 - setting the 'dateFrom' for 'schedule daily' to today's date
 *									  - setting the 'dateFrom' for 'schedule weekly' to -6 instead of -7
 * Author		: FHL
 * Purpose 		: Check the 'schedule' radio button and set the date according to the schedule field
 * 
 * Script 		: customscript_setdateinci 
 * Deploy		: set by the consolidatedInvoicesInterface.js suitelet
 * 
 * Library		: Library.js
 ***************************************************************************************************************************************************/

//declaring global variables
var today = new Date();
var radioValue = null;			//the variable to store the radio button's value
var nsDateTo = null;			//the variable to store the value of NetSuite date format of the 'date to'
var customer = '';
var customerGroup = '';
/************************************************************
 * setDateInInterface function - Main function (On field change)
 * 
 * version -  1.0.1 - 02 Apr 2013 - putting into standards
 * 
 * @param type 
 * @param name - internal id of the radio button
 ************************************************************/

function setDateInInterface(type, name)
{
	var calculatedDateFrom = null;			//the variable to store the value of normal date format of the 'date from'

	//if the internal ID of the radio button is 'scheduling'
	if (name == 'scheduling') 
	{
		initialise();
		calculatedDateFrom = calculateDateFrom(radioValue);		//calling calculateDateFrom function to calculate dateFrom
		setDate(calculatedDateFrom);							//calling setDate function to set the date
	}
}



/**********************************************************************
 * initialise Function - Initialise all the static variables used within the script
 * [todo] try catch
 **********************************************************************/
function initialise()
{
	var dateTo = null;				//the variable to store the value of normal date format of the 'date to'

	try
	{
		radioValue = nlapiGetFieldValue('scheduling');			//getting the value of the radio button
		dateTo = today;											//initialising dateTo to Today's date
		nsDateTo = jsDate_To_nsDate(today);						//converting the dateTo to NetSuite date format
		
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
	
}




/************************************************************
 * calculateDateFrom function - check the radio value and calculate the date from
 * 
 * @param radioButtonValue - radioButton's field value 
 * 
 * version - 1.0.2 - 03 May 2013 - setting the 'dateFrom' for 'schedule daily' to today's date - AS
 *								 - setting the 'dateFrom' for 'schedule weekly' to -6 instead of -7 - AS

 ************************************************************/
function calculateDateFrom(radioButtonValue)
{
	var dateFrom = null;
	
	try
	{
		nlapiLogExecution('error', 'calculateDateFrom radioButtonValue ', radioButtonValue);
		switch (radioButtonValue)
		{
			//if selected radio button is 'Schedule Daily'
			// version 1.0.2 - setting the 'dateFrom' for 'schedule daily' to today's date
			case 'scheduledaily':
				dateFrom  = today;			//calculate the 'Date From' by setting the date as today
			break;

			//if selected radio button is 'Schedule Weekly'
			// version 1.0.2 - setting the 'dateFrom' for 'schedule weekly' to -6 instead of -7
			case 'scheduleweekly':
				dateFrom  = nlapiAddDays(today, -6);			//calculate the 'Date From' by deducting seven days from today
			break;

			//if selected radio button is 'Schedule Monthly'
			case 'schedulemonthly':									
				dateFrom  = nlapiAddMonths(today,-1);			//calculate the 'Date From' by deducting one month from today
			break;

			default :
			break;
		}
	}
	catch(e)
	{
		errorHandler('calculateDateFrom : ', e);
	}
	
	return dateFrom;
}


/************************************************************
 * setDate function - setting the date in the fields
 * 
 * @param calcDateFrom - calculated dateFrom

 ************************************************************/
function setDate(calcDateFrom)
{
	var nsDateFrom = null;			//the variable to store the value of NetSuite date format of the 'date to'

	try
	{
		//if there is a schedule
		if(radioValue != 'noschedule')
		{
			nlapiSetFieldValue('dateTo', nsDateTo);				//setting the 'Date To' field value
			nsDateFrom = jsDate_To_nsDate(calcDateFrom);		//converting the date to NetSuite date format
			nlapiSetFieldValue('datefrom', nsDateFrom);			//setting the 'Date From' field value
			nlapiDisableField('dateto', true);					//disable 'Date To' field
			nlapiDisableField('datefrom', true);				//disable 'Date From' field

		}	
		else
		{
			nlapiSetFieldValue('dateto', '');					//setting the 'Date To' field value
			nlapiSetFieldValue('datefrom', '');					//setting the 'Date From' field value
			nlapiDisableField('dateto', false);					//enable 'Date To' field
			nlapiDisableField('datefrom', false);				//enable 'Date From' field

		}

	}
	catch(e)
	{
		errorHandler('setDate : ', e);
	}

}



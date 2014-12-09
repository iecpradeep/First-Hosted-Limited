/*************************************************************************************
 * Name:		Aepona Timesheet Event script - timesheet_event.js
 * 
 * Script Type:	User Event
 *
 * Version		1.3.6 - Adding of cost calculation to afterSubmit and calcDecimalTime - DB
 * 				1.3.5 - Adding of error catching for the beforeLoad function - AM
 * 
 * Author:		FHL
 * 
 * Purpose:		1. after submit weekly - calculate total cost based on employee bandings and add to timebill record
 * 				2. before load - add various fields to form based on current user - 
 * 					some fields are hidden and used by the client script (timesheet.js) associated with the 
 * 					track weekly time sheet form
 * 
 * 				3. after submit track time - redirect
 * 
 * Script: 		customscript_timesheet_event 
 * Deploy: 		customdeploy_timesheet_event - applies to Time
 * 
 * Notes:		Use Transaction>Employees>Weekly Time Sheet - ensure the form is Aepona Weekly Timesheet		
 * 
 * Library: 	library.js
 *************************************************************************************/

 var inDebug = false;
 var currentVersion = '1.3.6';

 
 /**
  * after submit weekly 
  *
  */
function afterSubmit_Weekly(type)
{
	var currentRecord = null;
	var currentRecordId = 0;
	var employee = null;
	var costBand = 0;
	var employeeCost = 0.00;
	var duration = 0;
	var durationDecimal = 0.00;
	var totalCost = 0.00;

	try 
	{
		// get record just submitted
		currentRecord = nlapiGetNewRecord();
		currentRecordId = currentRecord.getId();
		
		// get employee from current transaction 
		// lookup cost band from employee record
		// lookup employee cost from cost band table
		employee = currentRecord.getFieldValue('employee');
		costBand = nlapiLookupField('employee',employee,'custentity_employeecostband');
		employeeCost = parseFloat(nlapiLookupField('customrecord_employeecostbands',costBand,'custrecord_ecb_cost'));
				
		// get duration from current transaction and convert from hh:mm to decimal &
		// determine cost (rate * hours)
		duration = currentRecord.getFieldValue('hours');
		durationDecimal = calcDecimalTime(duration);
		totalCost = employeeCost * durationDecimal;
				
		// submit total cost to time transaction
		nlapiSubmitField('timebill',currentRecordId,'custcol_tt_cost',totalCost);		
	
	}  
	catch (e) 
	{
		errorHandler(e);
	} 
	
	return true;
} 

/**
 * after submit track time 
 *
 */
function afterSubmit_TrackTime(type)
{
	nlapiSetRedirectURL('TASKLINK','TRAN_TIMEBILL');
	return true;	
} 


/**
 * before load 
 * 
 * 	if weekly
 * 		get current record
 * 		add fields to form for previous time
 * 		add total fields to form
 * 		get current user/employee time validation fields and add to form & hide these fields
 *	else
 *		hide various fields
 *	
 *	if in edit mode - check if prev time sheets exist - if they do add buttons for save and delete
 */

function beforeLoad(type, form, request)
{
	
	//return true; //zzz
	// 1.3.5 - AM
	try
	{
		// create hidden checkbox to be used to show whether the entry mode is weekly time sheet or individual time entry mode.
		// The variable will be used by the client script on the form.
		var entryMode = form.addField('custpage_weekly','checkbox','Weekly');
		entryMode.setDisplayType('hidden');
	
		var currentContext = '';
		currentContext = nlapiGetContext();
		var TheCurrentTXID = nlapiGetRecordId();
	
		if(inDebug)
		{
			nlapiLogExecution('ERROR', 'Execution Context:', currentContext.getExecutionContext());
			nlapiLogExecution('ERROR', 'Current Record ID and Type:', TheCurrentTXID  + ', ' + type);
			nlapiLogExecution('ERROR', 'Request Parameter: ',  request);
		}
		
		//v1.3.5
		//This is a check to see if the request object is null
		
		if(request != null)
		{
			if (request.getParameter('weekly') == 'T') 
			{
				// Redirect to weekly time tracking form - deprecated.
				//nlapiSetRedirectURL('TASKLINK','TRAN_TIMEBILL_WEEKLY');	
				
				// Weekly mode
				entryMode.setDefaultValue('T');
				
				// add fields for previously entered time	
					
				var labelprevious = form.addField('custpage_labelprevious','text','+ Time previously entered');
				var previousmonday = form.addField('custpage_previousmonday','text','Mon');
				var previoustuesday = form.addField('custpage_previoustuesday','text','Tue');
				var previouswednesday = form.addField('custpage_previouswednesday','text','Wed');
				var previousthursday = form.addField('custpage_previousthursday','text','Thu');
				var previousfriday = form.addField('custpage_previousfriday','text','Fri');
				var previoussaturday = form.addField('custpage_previoussaturday','text','Sat');
				var previoussunday = form.addField('custpage_previoussunday','text','Sun');
				var previoustotal = form.addField('custpage_previoustotal','text','Total');
					
				// set display type to inline text and position outside main header block on right
				
				labelprevious.setDisplayType('inline');
				labelprevious.setLayoutType('outsidebelow','startrow');
				previousmonday.setDisplayType('inline');
				previousmonday.setLayoutType('outsidebelow');
				previoustuesday.setDisplayType('inline');
				previoustuesday.setLayoutType('outsidebelow');
				previouswednesday.setDisplayType('inline');
				previouswednesday.setLayoutType('outsidebelow');
				previousthursday.setDisplayType('inline');
				previousthursday.setLayoutType('outsidebelow');
				previousfriday.setDisplayType('inline');
				previousfriday.setLayoutType('outsidebelow');
				previoussaturday.setDisplayType('inline');
				previoussaturday.setLayoutType('outsidebelow');
				previoussunday.setDisplayType('inline');
				previoussunday.setLayoutType('outsidebelow');
				previoustotal.setDisplayType('inline');
				previoustotal.setLayoutType('outsidebelow');
				
				// set default values to 0:00.  
					
				previousmonday.setDefaultValue('0:00');
				previoustuesday.setDefaultValue('0:00');
				previouswednesday.setDefaultValue('0:00');
				previousthursday.setDefaultValue('0:00');
				previousfriday.setDefaultValue('0:00');
				previoussaturday.setDefaultValue('0:00');
				previoussunday.setDefaultValue('0:00');
				previoustotal.setDefaultValue('0:00');
				
				var labeltotal = form.addField('custpage_labeltotal','text','= Total Time Entered');
				var totalmonday = form.addField('custpage_totalmonday','text','Mon');
				var totaltuesday = form.addField('custpage_totaltuesday','text','Tue');
				var totalwednesday = form.addField('custpage_totalwednesday','text','Wed');
				var totalthursday = form.addField('custpage_totalthursday','text','Thu');
				var totalfriday = form.addField('custpage_totalfriday','text','Fri');
				var totalsaturday = form.addField('custpage_totalsaturday','text','Sat');
				var totalsunday = form.addField('custpage_totalsunday','text','Sun');
				var totaltotal = form.addField('custpage_totaltotal','text','Total');
				
				// set fields to inline text and position outside main header fields
				
				labeltotal.setDisplayType('inline');
				labeltotal.setLayoutType('outsidebelow','startrow');
				totalmonday.setDisplayType('inline');
				totalmonday.setLayoutType('outsidebelow');
				totaltuesday.setDisplayType('inline');
				totaltuesday.setLayoutType('outsidebelow');
				totalwednesday.setDisplayType('inline');
				totalwednesday.setLayoutType('outsidebelow');
				totalthursday.setDisplayType('inline');
				totalthursday.setLayoutType('outsidebelow');
				totalfriday.setDisplayType('inline');
				totalfriday.setLayoutType('outsidebelow');
				totalsaturday.setDisplayType('inline');
				totalsaturday.setLayoutType('outsidebelow');
				totalsunday.setDisplayType('inline');
				totalsunday.setLayoutType('outsidebelow');
				totaltotal.setDisplayType('inline');
				totaltotal.setLayoutType('outsidebelow');
			
				// set default values to 0:00
				
				totalmonday.setDefaultValue('0:00');
				totaltuesday.setDefaultValue('0:00');
				totalwednesday.setDefaultValue('0:00');
				totalthursday.setDefaultValue('0:00');
				totalfriday.setDefaultValue('0:00');
				totalsaturday.setDefaultValue('0:00');
				totalsunday.setDefaultValue('0:00');
				totaltotal.setDefaultValue('0:00');			
				
				var submissionGroup = form.addFieldGroup('submissionfieldgroup','Submission Options');
				
				var entryComplete = form.addField('custpage_entrycomplete','select','When "Save" Button is pressed','customlist_pr_submissionoptions','submissionfieldgroup');
				entryComplete.setDefaultValue('2');

				// add hidden fields for time validation - used by client script
				var mon_required = form.addField('custpage_ttvalidation_mon','checkbox','Mon');
				var tue_required = form.addField('custpage_ttvalidation_tue','checkbox','Tue');
				var wed_required = form.addField('custpage_ttvalidation_wed','checkbox','Wed');
				var thu_required = form.addField('custpage_ttvalidation_thu','checkbox','Thu');
				var fri_required = form.addField('custpage_ttvalidation_fri','checkbox','Fri');
				
				var mon_requiredhrs = form.addField('custpage_ttvalidation_monhrs','float','Monhrs');
				var tue_requiredhrs = form.addField('custpage_ttvalidation_tuehrs','float','Tuehrs');
				var wed_requiredhrs = form.addField('custpage_ttvalidation_wedhrs','float','Wedhrs');
				var thu_requiredhrs = form.addField('custpage_ttvalidation_thuhrs','float','Thuhrs');
				var fri_requiredhrs = form.addField('custpage_ttvalidation_frihrs','float','Frihrs');
				
				// get current user and time validation details
				
				var user = nlapiGetUser();
				
				mon_required.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_mon'));
				tue_required.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_tue'));
				wed_required.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_wed'));
				thu_required.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_thu'));
				fri_required.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_fri'));

				mon_requiredhrs.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_monhrs'));
				tue_requiredhrs.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_tuehrs'));
				wed_requiredhrs.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_wedhrs'));
				thu_requiredhrs.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_thuhrs'));
				fri_requiredhrs.setDefaultValue(nlapiLookupField('employee',user,'custentity_ttvalidation_frihrs'));

						
				mon_required.setDisplayType('hidden');
				tue_required.setDisplayType('hidden');
				wed_required.setDisplayType('hidden');
				thu_required.setDisplayType('hidden');
				fri_required.setDisplayType('hidden');
				
				mon_requiredhrs.setDisplayType('hidden');
				tue_requiredhrs.setDisplayType('hidden');
				wed_requiredhrs.setDisplayType('hidden');
				thu_requiredhrs.setDisplayType('hidden');
				fri_requiredhrs.setDisplayType('hidden');

			
			} //if
			else
			{
				// Not in weekly mode
				entryMode.setDefaultValue('F');

				// hide the customer field
				var custfield = form.getField('customer');
				custfield.setDisplayType('hidden');
				
				// hide the item field
				var itemfield = form.getField('item');
				itemfield.setDisplayType('hidden');

				// hide the time type field
				var timetypefield = form.getField('timetype');
				timetypefield.setDisplayType('hidden');
			}	
		}

		var helpGroup = form.addFieldGroup('helpfieldgroup','Help');
	
		var helpText = form.addField('custpage_helptext','inlinehtml','Help',null,'helpfieldgroup');
		helpText.setDefaultValue('help text will appear here');
		//helpText.setLayoutType('outside','startrow');
				
		var currentRole = nlapiGetRole();
		
		// add additional field for status - used to display information messages and version number.
		var status = form.addField('custpage_status','inlinehtml');
		status.setLayoutType('outsideabove');
		status.setDefaultValue('UE v' + currentVersion);
		//status.setDefaultValue('Role=' + currentRole);
		
	
		if (type == 'edit')
		{
			
			var timeRecord = nlapiGetNewRecord();
			
			var date = timeRecord.getFieldValue('trandate');
			var employee = timeRecord.getFieldValue('employee');
			
			var ddate = nlapiStringToDate(date);
			
			var day = ddate.getDay();
			
			if (day != 1)
			{
				var difference = 1-day;
				ddate = nlapiAddDays(ddate,difference);
				date = nlapiDateToString(ddate);
					
			} //if
			
			
			if (checkExistingTimeSheets(employee, date) == true && currentRole != '3') 
			{
				var deletebutton = form.getButton('delete');
				if (deletebutton) deletebutton.setDisabled(true);
	
				var savebutton = form.getButton('submitter');
				if (savebutton) savebutton.setDisabled(true);
	
				
			} //if
			
		} //if

	}
	catch(e)
	{
		nlapiLogExecution('ERROR','BeforeLoad Error ', e.message);
	}
		
} //function

/**************************************************************************
 * checkExistingTimeSheets(date)
 * Check for existing timesheets in the week commencing date.
 * Employee passed as internal id of employee.
 * Date should be passed as a string value.
 * Returns true if timesheet found, false if no timesheet found.
 */

function checkExistingTimeSheets(employee,date)
{
	var tsFilters = new Array();
	var tsColumns = new Array();

	// define search filters
	tsFilters[0] = new nlobjSearchFilter('custrecord_wtsemployee', null, 'anyof', employee);
	tsFilters[1] = new nlobjSearchFilter('custrecord_wtsdate', null, 'within', date);
	
	// define search return column
	tsColumns[0] = new nlobjSearchColumn('custrecord_wtshours');
	
	// perform search
	var tsResults = nlapiSearchRecord('customrecord_weeklytimesheet',null,tsFilters,tsColumns);

	// if result found return true, else return false.
	if (tsResults)
	{
		return true;
	} //if	
	else
	{
		return false;
	} //else
	
} //function checkExistingTimeSheets(date)

/*******************************************************
 * calcDecimalTime()
 * Converts time in the format hh:mm to decimal.
 */

function calcDecimalTime(timeString)
{
	var timeArray = new Array();
	
	timeArray = timeString.split(':',2);
	
	var hours = parseInt(timeArray[0]);
	var minutes = parseInt(timeArray[1]) + (hours*60);
	
	return (minutes / 60);
	
	
} //function
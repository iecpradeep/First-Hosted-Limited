/*****************************************
 * Name:	 Expense Report Customisations
 * Author:   FHL - D Birt - A Nixon - P Lewis
 * Client: 	 Aepona
 * Date:     16 Feb 2012
 * Version:  1.0.14 - Maintenance 1 version
 * 			 1.1.0 - Updated to work on exclusive system
 * 
 ******************************************/

/*************************************************************
 * Page Init function
 * Called when form is initialised, used to set default fields
 *************************************************************/

function pageInit()
{	

	//Disable line item tax and fx fields
	nlapiSetCurrentLineItemValue('expense', 'receipt', 'T', false, true);
	nlapiDisableLineItemField('expense','custcol_expenses_meal_deductions',true);
	nlapiDisableLineItemField('expense','custcol_rechargeable_customer',true);
	nlapiDisableLineItemField('expense','customer',true);
	nlapiDisableLineItemField('expense','grossamt',true);
	nlapiDisableLineItemField('expense','memo',true);
	nlapiDisableLineItemField('expense','foreignamount',true);
	nlapiDisableLineItemField('expense','isbillable',true);
	nlapiDisableLineItemField('expense','taxrate1',true);
	nlapiDisableLineItemField('expense','taxcode',true);
	nlapiDisableLineItemField('expense','tax1amt',true);
	nlapiDisableLineItemField('expense','exchangerate',true);
	nlapiDisableLineItemField('expense','amount',true);
	nlapiDisableLineItemField('expense','custcol_summary',true);
	nlapiDisableLineItemField('expense','department',true);
	nlapiDisableLineItemField('expense','currency',true);
	nlapiDisableLineItemField('expense','custcol1',true);
	nlapiDisableLineItemField('expense','receipt',true);
	nlapiDisableField('trandate', true);

	var paymentMethod = nlapiGetFieldValue('custbody_er_payment_method');
	var currentEmployee = nlapiGetFieldValue('entity');
	var account = nlapiGetFieldValue('account');
	var context = nlapiGetContext();
	var userRole = context.getRole();
	
	if(paymentMethod == 1)
	{
		var employeeCardID = nlapiGetFieldValue('custbody_employee_credit_card_id');
		nlapiSetFieldValue('account', parseInt(employeeCardID),false,true);	
	}
	else
	{
		nlapiSetFieldValue('account', 175 ,false ,true);
	}
	
	if(currentEmployee.length == 0)
	{
		try
		{
			var context = nlapiGetContext();
			var userName = context.getUser();

			nlapiSetCurrentLineItemValue('expense', 'custcol1', userName, false, true);
		}
		catch(e)
		{
			// error
		}	
	}
	else
	{
		var userName = nlapiGetFieldValue('entity');
		nlapiSetCurrentLineItemValue('expense', 'custcol1', userName, false, true);
		
		if(userRole != '1028' && userRole != '1016' && userRole != '1017' && userRole != '1022' && userRole != '1023')
		{
			try
			{
				var record = nlapiLoadRecord('employee', userName);

				var allowCreditCard = record.getFieldValue('custentity_allow_credit_card');
				var creditNumber = record.getFieldValue('custentity_credit_card_account');

				if(allowCreditCard == 'T')
				{
					// do nothing as they can have a card
				}
				else
				{
					nlapiSetFieldValue('custbody_er_payment_method', 2);
					nlapiDisableField('custbody_er_payment_method', true);
				}
			}
			catch(e)
			{
				// Not an Admin or in employee centre
			}
		}
		else
		{
			if(paymentMethod.length == 0)
			{
				nlapiSetFieldValue('custbody_er_payment_method', 2);
			}
		}
	}
		
	//document.getElementById('tbl_expense_copy').style.display = 'none';
	return true;

} //function pageInit()


/*************************************************************
 * Line Init function
 * Called when new line is initialised, used to restrict entry fields that
 * cannot be restricted via form customisation through UI
 *************************************************************/

function lineInit(type)
{
	try
	{
		var userName = nlapiGetFieldValue('entity');
		nlapiSetCurrentLineItemValue('expense', 'custcol1', userName, false, true);
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'an error occured...', e);
	}

	var paymentMethod = nlapiGetFieldValue('custbody_er_payment_method');

	if(paymentMethod == 1)
	{
		nlapiDisableLineItemField('expense','custcol1', false);
	}
	else
	{
		nlapiDisableLineItemField('expense','custcol1',true);
	}

	nlapiSetCurrentLineItemValue('expense', 'receipt', 'T', false, true);
	nlapiDisableLineItemField('expense','custcol_expenses_meal_deductions',true);
	nlapiDisableLineItemField('expense','custcol_rechargeable_customer',true);
	nlapiDisableLineItemField('expense','customer',true);
	nlapiDisableLineItemField('expense','grossamt',true);
	nlapiDisableLineItemField('expense','memo',true);
	nlapiDisableLineItemField('expense','foreignamount',true);
	nlapiDisableLineItemField('expense','isbillable',true);
	nlapiDisableLineItemField('expense','receipt',true);
	nlapiDisableLineItemField('expense','taxrate1',true);
	nlapiDisableLineItemField('expense','taxcode',true);
	nlapiDisableLineItemField('expense','tax1amt',true);
	nlapiDisableLineItemField('expense','exchangerate',true);
	nlapiDisableLineItemField('expense','amount',true);
	nlapiDisableLineItemField('expense','custcol_summary',true);
	nlapiDisableLineItemField('expense','department',true);
	nlapiDisableLineItemField('expense','currency',true);

	return true;

}  //function lineInit()

/*************************************************************
 * Page Init function
 * usage: Checks each line items custom record id and duplicates it
 * 		  if it appears on 2 lines duplicated the custom record and
 * 		  save it and return its unique ID.
 *************************************************************/

function reCalcField(type,name)
{
	var curline = nlapiGetCurrentLineItemIndex(type);
	//alert('line is ' + curline);

	if(parseInt(curline) == 1)
	{
		// do nothing
	}
	else
	{
		var currentCusRecID = nlapiGetLineItemValue(type,'custcol_line_rec_id', parseInt(curline));
		var lastCusRecID = nlapiGetLineItemValue(type,'custcol_line_rec_id', parseInt(curline)-1);

		if(currentCusRecID == lastCusRecID)
		{
			//alert('Cus line IDs are the same:: Current line rec ID: ' + currentCusRecID + ' Last record id: ' + lastCusRecID);

			var newLineRecord = nlapiCopyRecord('customrecord_expenseline', lastCusRecID);

			var newLineRecordId = nlapiSubmitRecord(newLineRecord);

			nlapiSetCurrentLineItemValue(type, 'custcol_line_rec_id', parseInt(newLineRecordId));

			nlapiCommitLineItem(type);
			//alert('Set the current line rec id to: ' + newLineRecordId);
		}
		else
		{
			// do nothing
		}
	}

	var lineItemCount = nlapiGetLineItemCount(type);
	var runningClaimAmount = parseInt(0);

	if (lineItemCount >= 1)
	{
		for(var i = 1; i<=lineItemCount; i++)
		{
			var lineItemAmount = nlapiGetLineItemValue(type, 'foreignamount', i);
			runningClaimAmount += parseFloat(lineItemAmount);
		} 
	}

	var endClaimAmount = toFixed(runningClaimAmount,2);
	parseFloat(endClaimAmount);
	nlapiSetFieldValue('custbody_claimamount', endClaimAmount);

	var lineEmployee = nlapiGetCurrentLineItemValue('expense','custcol1');
	if(lineEmployee == null)
	{
		var context = nlapiGetContext();
		var userName = context.getUser();
		nlapiSetCurrentLineItemValue('expense', 'custcol1', userName, false, true);
	}

	return true;
}

/*************************************************************
 * Name: fieldChangedPopup function
 * 
 * Detects when the line item expense category has changed and runs popup() 
 * Used as a fieldchanged client script on a expense report
 *************************************************************/

function fieldChangedPopup(type, name, linenum)
{
	var context = nlapiGetContext();
	var userName = context.getUser();	
	var userRole = context.getRole();
	
	try
	{
		if(name == 'custbody_er_payment_method')
		{	
			var paymentMethod = nlapiGetFieldValue('custbody_er_payment_method');
			if(paymentMethod == 1)
			{
				nlapiDisableLineItemField('expense','custcol1', false);
				var employeeCardID = nlapiGetFieldValue('custbody_employee_credit_card_id');
				nlapiSetFieldValue('account', parseInt(employeeCardID),false,true);	
			}
			else
			{
				nlapiDisableLineItemField('expense','custcol1',true);
				nlapiSetFieldValue('account', 175 ,false ,true);			
			}
		}
	}
	catch(e)
	{
		//alert('Credit card error: ' + e.message);
	}

	if(name == 'entity' && userRole != '1028' && userRole != '1016' && userRole != '1017' && userRole != '1022' && userRole != '1023')
	{
		var employee = nlapiGetFieldValue('entity');
		
		try
		{
			var record = nlapiLoadRecord('employee', employee);
			//get the value of allow credit card
			var allowCreditCard = record.getFieldValue('custentity_allow_credit_card');
			var creditNumber = record.getFieldValue('custentity_credit_card_account');

			if(allowCreditCard == 'T')
			{
				// do nothing as they can have a card
			}
			else
			{
				nlapiSetFieldValue('custbody_er_payment_method', 2);
				nlapiDisableField('custbody_er_payment_method', true);
			}
		}
		catch(e)
		{
			// Not an Admin or in employee centre
		}
	}

	var lineItemValue = nlapiGetCurrentLineItemValue(type,name);
	if(type == 'expense' && name == 'category' && lineItemValue > '0')
	{
		// Information to be passed to the popup
		var expenseCategory = nlapiGetCurrentLineItemValue('expense','category');
		var theDate = nlapiGetCurrentLineItemValue('expense','expensedate');
		var expenseCategoryText = nlapiGetCurrentLineItemText('expense','category');
		var expenseLocation = nlapiGetFieldValue('custbody_expenselocation');
		var expenseLocationText = nlapiGetFieldText('custbody_expenselocation');
		var currentEmployee = nlapiGetFieldValue('entity');
		var baseCurrency = nlapiGetFieldValue('custbody_employeebasecurrency');
		var baseCurrencyText = nlapiGetFieldText('custbody_employeebasecurrency');
		var subsidiary = nlapiGetFieldValue('subsidiary');
		var claimAmount = nlapiGetFieldValue('custbody_claimamount');
		var paymentMethod = nlapiGetFieldValue('custbody_er_payment_method');
		var tranId = nlapiGetFieldValue('tranid');

		// set to zero as this is the first time this record will be created
		var lineEdit = parseInt(0);
		var iteration = 0;

		// VAT CALCULATION
		nlapiLogExecution('DEBUG','expenseLocation',expenseLocation);
		nlapiLogExecution('DEBUG','expenseCategory',expenseCategory);
		nlapiLogExecution('DEBUG','subsidiary',subsidiary);

		// search for the times specificed in system
		var vatSearchFilters = new Array();
		var vatSearchColumns = new Array();
		// search filters
		vatSearchFilters[0] = new nlobjSearchFilter('custrecord_etc_entity', null, 'is', subsidiary);	
		vatSearchFilters[1] = new nlobjSearchFilter('custrecord_etc_expensecategory', null, 'is', expenseCategory);	
		// search columns
		vatSearchColumns[0] = new nlobjSearchColumn('custrecord_etc_taxcode');
		// do search
		var vatSearchResults = nlapiSearchRecord('customrecord_expensetaxcodes', null, vatSearchFilters, vatSearchColumns);

		var VAT = 0;

		if(vatSearchResults)
		{
			VAT = vatSearchResults[0].getValue(vatSearchColumns[0]);
			nlapiSetCurrentLineItemValue('expense', 'taxcode', VAT);
		}
		else
		{
			VAT = 14;
			nlapiSetCurrentLineItemValue('expense', 'taxcode', VAT);
		}


		//if the expense category is mileage (4) check for claims on this expense report
		if (expenseCategory == '4')
		{
			//counts how many line items there is
			var lineItemCount = nlapiGetLineItemCount(type);

			// declare the 2 variables to total up the current line items
			var runningExpenseMiles = parseInt(0);
			var currentExpenseMiles = parseInt(0);

			if (lineItemCount >= 1)
			{
				for(var i = 1; i<=lineItemCount; i++)
				{
					//get the line item (line items start at 1 not 0) and loop based on i
					var lineItemMiles = nlapiGetLineItemValue(type, 'custcol_mileagenoofmiles', i);
					//add the current line item to the running expense miles
					runningExpenseMiles += parseInt(lineItemMiles);
				} 
				//add put the running expense miles into a new variable
				var currentExpenseMiles = runningExpenseMiles;
			}
		}

		// check to make sure all the required fields are declared so the expense wizard can launch
		if(expenseCategory == null || expenseCategory.length == 0 ||expenseCategoryText == null || expenseLocation == null || expenseLocation.length == 0  ||baseCurrency == null || baseCurrency.length == 0 ||subsidiary == null || subsidiary.length == 0 ||currentEmployee == null || currentEmployee.length == 0 || paymentMethod == null || paymentMethod.length == 0)
		{
			alert('Current employee missing data to launch expense wizard, please check employee base currency, employee location & Payment method classification fields');
		}
		else
		{
			//Call the popup function and place information required to launch inside of it
			popup(expenseCategory, expenseCategoryText, expenseLocation, expenseLocationText, currentEmployee, iteration, baseCurrency, baseCurrencyText, subsidiary, currentExpenseMiles, theDate, claimAmount, lineEdit, tranId);
		}
	} // if
} // function fieldChangedPopup()

/***********************************************
 * opens the wizard in edit mode on button press
 ***********************************************/

function buttonPressEdit()
{	
	var expenseCategory = nlapiGetCurrentLineItemValue('expense','category');
	var theDate = nlapiGetCurrentLineItemValue('expense','expensedate');
	var expenseCategoryText = nlapiGetCurrentLineItemText('expense','category');
	var expenseLocation = nlapiGetFieldValue('custbody_expenselocation');
	var expenseLocationText = nlapiGetFieldText('custbody_expenselocation');
	var currentEmployee = nlapiGetFieldValue('entity');
	var baseCurrency = nlapiGetFieldValue('custbody_employeebasecurrency');
	var baseCurrencyText = nlapiGetFieldText('custbody_employeebasecurrency');
	var subsidiary = nlapiGetFieldValue('subsidiary');
	var claimAmount = nlapiGetFieldValue('custbody_claimamount');
	var paymentMethod = nlapiGetFieldValue('custbody_er_payment_method');
	var lineEdit = nlapiGetCurrentLineItemValue('expense', 'custcol_line_rec_id');
	var iteration = 0;

	if(lineEdit == null)
	{
		lineEdit == parseInt(0);
	}

	// VAT CALCULATION
	nlapiLogExecution('DEBUG','expenseLocation',expenseLocation);
	nlapiLogExecution('DEBUG','expenseCategory',expenseCategory);
	nlapiLogExecution('DEBUG','subsidiary',subsidiary);

	// search for the times specificed in system
	var vatSearchFilters = new Array();
	var vatSearchColumns = new Array();
	// search filters
	vatSearchFilters[0] = new nlobjSearchFilter('custrecord_etc_entity', null, 'is', subsidiary);	
	vatSearchFilters[1] = new nlobjSearchFilter('custrecord_etc_expensecategory', null, 'is', expenseCategory);	
	// search columns
	vatSearchColumns[0] = new nlobjSearchColumn('custrecord_etc_taxcode');
	// do search
	var vatSearchResults = nlapiSearchRecord('customrecord_expensetaxcodes', null, vatSearchFilters, vatSearchColumns);

	var VAT = 0;

	if(vatSearchResults)
	{
		VAT = vatSearchResults[0].getValue(vatSearchColumns[0]);
		nlapiSetCurrentLineItemValue('expense', 'taxcode', VAT);
	}
	else
	{
		VAT = 14;
		nlapiSetCurrentLineItemValue('expense', 'taxcode', VAT);
	}


	//if the expense category is mileage (4) check for claims on this expense report
	if (expenseCategory == '4')
	{
		//counts how many line items there is
		var lineItemCount = nlapiGetLineItemCount(type);

		// declare the 2 variables to total up the current line items
		var runningExpenseMiles = parseInt(0);
		var currentExpenseMiles = parseInt(0);

		if (lineItemCount >= 1)
		{
			for(var i = 1; i<=lineItemCount; i++)
			{
				//get the line item (line items start at 1 not 0) and loop based on i
				var lineItemMiles = nlapiGetLineItemValue(type, 'custcol_mileagenoofmiles', i);
				//add the current line item to the running expense miles
				runningExpenseMiles += parseInt(lineItemMiles);
			} 
			//add put the running expense miles into a new variable
			var currentExpenseMiles = runningExpenseMiles;
		}
	}

	// check to make sure all the required fields are declared so the expense wizard can launch
	if(expenseCategory == null || expenseCategory.length == 0 ||expenseCategoryText == null || expenseLocation == null || expenseLocation.length == 0  ||baseCurrency == null || baseCurrency.length == 0 ||subsidiary == null || subsidiary.length == 0 ||currentEmployee == null || currentEmployee.length == 0 || paymentMethod == null || paymentMethod.length == 0)
	{
		alert('Current employee missing data to launch expense wizard, please check employee base currency, employee location & Payment method classification fields');
	}
	else
	{
		//Call the popup function and place information required to launch inside of it
		popup(expenseCategory, expenseCategoryText, expenseLocation, expenseLocationText, currentEmployee, iteration, baseCurrency, baseCurrencyText, subsidiary, currentExpenseMiles, theDate, claimAmount, lineEdit);
	}

	return true;
}

/*************************************************************
 * Popup function
 * Creates the window the parameters from field changed popup
 *************************************************************/

function popup(category, categoryText, location, locationText, employee, iteration, baseCurrency, baseCurrencyText, subsidiary, currentExpenseMiles, date, claimAmount, lineedit, tranId)
{
	// Parameters to pass included in the URL for example: '&expensecategory='+category
	mywindow = window.open('/app/site/hosting/scriptlet.nl?script=110&deploy=1&custpage_expenseCategory='+ category + '&custpage_expensecategorytext=' + categoryText + '&custpage_expenselocation=' + location + '&expenseLocationText=' + locationText + '&custpage_iterate=' + iteration +'&custpage_currentEmployee=' + employee + '&custpage_basecurrency='+ baseCurrency + '&custpage_basecurrencytext=' + baseCurrencyText + '&custpage_subsidiary=' + subsidiary + '&custpage_currentExpenseMiles=' + currentExpenseMiles + '&custpage_date=' + date + '&custpage_claimamount=' + claimAmount + '&custpage_lineedit=' + lineedit + '&custpage_tranid=' + tranId, '_blank',"dependant=yes,height=600,width=750,scrollbars=0,titlebar=0,toolbar=no,menubar=0,resizable=no,location=no");	
} // function popup()





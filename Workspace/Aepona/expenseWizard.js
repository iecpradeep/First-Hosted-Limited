/************************************************************************************************************************
 * Name:		Expense report customisations
 * Script Type:	Suitelet
 *
 * Version:		3.4.00 - 10/02/2012 - Maintenance 1 v 4 first Sandbox Version - AN
 * 				3.4.08 - 05/03/2012 - Add breaks to subsistence print out switch for country - AN
 * 				3.4.09 - 07/03/2012 - Main and subsistence re-factored - AN
 * 				3.4.10 - 09/03/2012 - Added projectSearch - addProjectField - addCustomerField functions
 * 								  		These are the functions that need to go in all wizards Implemented in foreignVisa
 * 				3.4.11 - 13/03/2012 - Added breakfast addition to UK breakfast check in subsistence Fixed 
 * 				3.4.12 - 02/04/2012 - Fixed subsistence calculation issue
 * 				3.4.13 - 12/04/2012 - Subsistence calculation changes
 * 				3.4.14 - 19/04/2012 - Changes to log executions
 * 				3.4.15 - 23/04/2012 - Final fixes to subsistence calculation
 * 				3.4.16 - 09/05/2012 - Additional changes to subsistence, Added 2 new expense types to the general
 * 								 		 expense category, PR & Promotions + Advertising
 * 				3.4.17 - 28/05/2012 - Fixed two minor expense issues
 *         		3.4.18 - 03/08/2012 - Fixed Issue with calculation before 06:00
 *         		3.4.19 - 28/01/2013 - mileage calculation based on 'thisfiscalyear' operator was incorrect  - should be 'within' - SA
 *         		3.4.20 - 07/02/2013 - Base the fiscal year calc for mileage on the employee location specific date range - LE
 *         		3.4.21 - 22/02/2013 - Altered 3.4.20 so that the fiscal year range is adjusted depending on the expense date - LE
 *         		3.4.22 - 27/02/2013 - Added code for automatic reset of FiscalFrom and FiscalTo field - SA
 *         		3.4.23 - 12/03/2013 - Fixed minor issue in filed type, it was incorrectly written as "Date", instead of "date" - SA
 *         		3.4.24 - 13/03/2013 - Fixed minor issue in field type. it was incorrectly written as "Label", instead of "label" - SA
 *         
 *
 * Author:		A.Nixon - D.Birt - P.Lewis - L.Evans - FHL
 * Purpose:		A description of the purpose of this script, together with its method of deployment.
 *            
 ************************************************************************************************************************/

var fiscalFrom = null;
var fiscalTo = null;

/**
 * Popup expenseWizard.js
 * The wizard uses the parameters from the pop-up
 *  3.4.20 get the fiscal year for the employee location LE
 * 
 * @param request
 * @param response
 * @returns {Boolean}
 */
function expenseWizard(request, response)
{
	

	nlapiLogExecution('DEBUG', 'Script start', null);

	//get the name of the expense type
	var expenseCategoryText = request.getParameter('custpage_expensecategorytext');

	//get the type of the expense category
	var assistant = nlapiCreateAssistant("Expense Wizard - " + expenseCategoryText, true);
	assistant.setOrdered( true );

	/*************************************************************
	 * Get method
	 * Information is retrieved into the get method
	 *************************************************************/

	if (request.getMethod() == 'GET')
	{	
		//Request the parameters to get the popup to function correctly 
		var expenseCategory = request.getParameter('custpage_expenseCategory');
		var expenseLocation = request.getParameter('custpage_expenselocation');
		var expenseLocationtText = request.getParameter('expenseLocationText');
		var currentEmployee = request.getParameter('custpage_currentEmployee');
		var iteration = request.getParameter('custpage_iterate');
		var baseCurrency = request.getParameter('custpage_basecurrency');
		var baseCurrencyText = request.getParameter('custpage_basecurrencytext');
		var subsidiary = request.getParameter('custpage_subsidiary');
		var claimAmount = request.getParameter('custpage_claimamount');
		var lineEdit = request.getParameter('custpage_lineedit');
		var tranId = request.getParameter('custpage_tranid');
		var lineDate = request.getParameter('custpage_date');
		var employeeLocationId  = null;
		var employeeVehicleID = null;

		var expenseCategoryTextHiddenField = assistant.addField('custpage_expensecategorytext', 'text', 'hidden');
		expenseCategoryTextHiddenField.setDisplayType('hidden');
		expenseCategoryTextHiddenField.setDefaultValue(expenseCategoryText);	

		// Only do this on the initial (0) GET
		if(iteration == 0)
		{   
			var recCurrentEmployee = nlapiLoadRecord('employee', currentEmployee);    
			employeeLocationId = recCurrentEmployee.getFieldValue('custentity_employeelocation');	
			var recEmployeeLocation = nlapiLoadRecord('customrecord_employeelocation', employeeLocationId);

			// Getting Break point and vehicle ID
			var mileageBreakPoint = recEmployeeLocation.getFieldValue('custrecord_mileagebreakpoint');
			
			// 3.4.20 get the fiscal year for the employee location LE
			fiscalFrom = recEmployeeLocation.getFieldValue('custrecord_fiscalyearfrom');
			fiscalTo = recEmployeeLocation.getFieldValue('custrecord_fiscalyearto');			

			nlapiLogExecution('DEBUG', 'fiscalFrom is...', fiscalFrom);
			nlapiLogExecution('DEBUG', 'fiscalTo is...', fiscalTo);
			
			employeeVehicleID = recCurrentEmployee.getFieldValue('custentity_employeevehicle');

			// Add hidden fields that should only be on the first get
			var mileageBreakPointHiddenField = assistant.addField('custpage_mileagebreakpoint', 'integer', 'hidden');
			mileageBreakPointHiddenField.setDisplayType('hidden');
			mileageBreakPointHiddenField.setDefaultValue(mileageBreakPoint);
		}

		// any iterations after the first iteration
		if(iteration >= 1)
		{
			// parameters
			employeeLocationId = request.getParameter('custpage_employeelocId');
		}

		// hidden fields
		var lineEditHidden = assistant.addField('custpage_lineedit', 'text', 'hidden');
		lineEditHidden.setDisplayType('hidden');
		lineEditHidden.setDefaultValue(lineEdit);

		var expenseLocationHidden = assistant.addField('custpage_expenselocation', 'text', 'hidden');
		expenseLocationHidden.setDisplayType('hidden');
		expenseLocationHidden.setDefaultValue(expenseLocation);

		var claimHiddenField = assistant.addField('custpage_claimamount', 'text', 'hidden');
		claimHiddenField.setDisplayType('hidden');
		claimHiddenField.setDefaultValue(claimAmount);

		var dateHiddenField = assistant.addField('custpage_date', 'text', 'hidden');
		dateHiddenField.setDisplayType('hidden');
		dateHiddenField.setDefaultValue(lineDate);

		var tranIdHiddenField = assistant.addField('custpage_tranid', 'text', 'hidden');
		tranIdHiddenField.setDisplayType('hidden');
		tranIdHiddenField.setDefaultValue(tranId);

		var baseCurrencyHiddenField = assistant.addField('custpage_basecurrency', 'text', 'hidden');
		baseCurrencyHiddenField.setDisplayType('hidden');
		baseCurrencyHiddenField.setDefaultValue(baseCurrency);

		var baseCurrencyTextHiddenField = assistant.addField('custpage_basecurrencytext', 'text', 'hidden');
		baseCurrencyTextHiddenField.setDisplayType('hidden');
		baseCurrencyTextHiddenField.setDefaultValue(baseCurrencyText);

		var expenseCategoryHiddenField = assistant.addField('custpage_expensecategory','text','hidden');
		expenseCategoryHiddenField.setDisplayType('hidden');		
		expenseCategoryHiddenField.setDefaultValue(expenseCategory);

		var currentEmployeeHiddenField = assistant.addField('custpage_currentemployee', 'text', 'hidden');
		currentEmployeeHiddenField.setDisplayType('hidden');
		currentEmployeeHiddenField.setDefaultValue(currentEmployee);

		var employeeLocationIdHiddenField = assistant.addField('custpage_employeelocationid','text','hidden');
		employeeLocationIdHiddenField.setDisplayType('hidden');
		employeeLocationIdHiddenField.setDefaultValue(employeeLocationId);

		nlapiLogExecution('DEBUG','LINE 97 Employee location ID', employeeLocationId);

		//Switch based on expense categories
		switch(parseInt(expenseCategory))
		{

			//>> VISA
			case 22: 

				assistant = foreignVisa(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> OFFICE RENT
			case 15: 

				assistant = officeRent(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> SUBSCRIPTIONS
			case 34: 

				assistant = subscriptions(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> TRAINING
			case 17: 

				assistant = training(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> COMPUTER HARDWARE
			case 19: 

				assistant = computerHardware(assistant ,iteration,lineEdit,baseCurrencyText);
				break;

				//>> BANK CHARGES
			case 20: 

				assistant = bankCharges(assistant,iteration,lineEdit,baseCurrencyText);
				break;

				//>> PRINTING & STATIONERY & POSTING
			case 16: 

				assistant = printStationeryPostage(assistant,iteration,lineEdit,baseCurrencyText);
				break;

				//>> ACCOMMODATION	
			case 12: 

				assistant = accommodation(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> CUSTOMER ENTERTAINING	
			case 14:

				assistant = customerEntertainment(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> FLIGHTS
			case 3: 

				assistant = flights(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> RAIL
			case 31:

				assistant = rail(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> BUS
			case 30: 

				assistant = bus(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> TAXI
			case 7:

				assistant = taxi(assistant, iteration, lineEdit, baseCurrencyText);
				break;

				//>> DINNER
			case 29: 

				assistant = dinner(assistant, iteration, lineEdit, baseCurrencyText);
				break;	

				//>> CAR HIRE
			case 6: 

				assistant = carHire(assistant,iteration,lineEdit,baseCurrencyText);
				break;

				//>> PARKING
			case 5:

				assistant = parking(assistant,iteration,lineEdit,baseCurrencyText);
				break;

				//>> SUBSISTENCE
			case 10: 

				assistant = subsistence(assistant,iteration,lineEdit,baseCurrencyText,employeeLocationId);
				break;

				//>> MILEAGE
			case 4:

				assistant = mileage(assistant,iteration,lineEdit,baseCurrencyText,employeeLocationId,currentEmployee, expenseLocation, employeeVehicleID, tranId, lineDate);
				break;

			case 13: // computer sundries
			case 26: // fuel
			case 27: // mobile phone
			case 33: // landline calls
			case 28: // other 
			case 32: // internet access
			case 35: // Health care
			case 36: // PR & Promotions
			case 37: // Advertising

				assistant = general(assistant,iteration,lineEdit,baseCurrencyText);			
				break;

			default:

				nlapiLogExecution('DEBUG', 'DEFAULT', null);
			assistant.addStep('step1','Incorrect Expense type selected');
			if ( !assistant.isFinished() )
			{
				assistant.setCurrentStep(assistant.getStep( "step1") );
				var step = assistant.getCurrentStep();
				if (step.getName() == "step1")
				{  		
					var incorrectfield = assistant.addField("incorrect","textarea","",null,null).setDisplayType('disabled').setDefaultValue('An error with the selected expense type has occured');
				}
			}							
			break;	
		}

		nlapiLogExecution('DEBUG','end of get');
		response.writePage(assistant);
	}

	/**********************************
	 * 			POST method			  *
	 * 								  *
	 **********************************/

	else
	{
		assistant.setError( null );
		/* 1. if they clicked the finish button, mark setup as done and redirect to assistant page */
		if (assistant.getLastAction() == "finish")
		{
			//get
			var expenseCategory = request.getParameter('custpage_expensecategory');
			var currentEmployee = request.getParameter('custpage_currentemployee');
			var employeeLocId = request.getParameter('custpage_employeelocationid');
			var baseCurrency = request.getParameter('custpage_basecurrency');
			var baseCurrencyText = request.getParameter('custpage_basecurrencytext');
			var lineDate = request.getParameter('custpage_date');
			var lineEdit = request.getParameter('custpage_lineedit');
			var claimAmount = request.getParameter('custpage_claimamount');

			nlapiLogExecution('DEBUG', 'basecurrency', baseCurrency);

			var addNewScript = "";
			addNewScript = '<script type="text/javascript">';  //zzz

			//switch	
			switch(parseInt(expenseCategory))
			{

				case 22: // visa

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var visaCountry = request.getParameter ('visacountry');
						var visaDescription = request.getParameter('visadescription');
						var visaDuration = request.getParameter('visaduration');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('visapaymentcurrency');
						var transactionAmount = request.getParameter('visatransactionamount');
						var transactionCurrency = request.getParameter('visatransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Visa country: " + visaCountry;
						summaryText += "\\n Visa description: " + escapeApos(visaDescription);
						summaryText += "\\n Visa duration: " + visaDuration;
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						// commit information to the line record
						var record = nlapiCreateRecord('customrecord_expenseline');
						record.setFieldValue('custrecord_exp_reason', visaCountry);
						var internalId = nlapiSubmitRecord(record, true);
						nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_vis_country', visaCountry);
							record.setFieldValue('custrecord_expenseline_vis_visadesc', visaDescription);
							record.setFieldValue('custrecord_expenseline_vis_visaduration', visaDuration);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// subs values
							record.setFieldValue('custrecord_expenseline_vis_country', visaCountry);
							record.setFieldValue('custrecord_expenseline_vis_visadesc', visaDescription);
							record.setFieldValue('custrecord_expenseline_vis_visaduration', visaDuration);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 15: // office rent

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var officeName = escapeString(request.getParameter ('officename'));
						var rentPeriod = request.getParameter('rentperiod');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('rentpaymentcurrency');
						var transactionAmount = request.getParameter('renttransactionamount');
						var transactionCurrency = request.getParameter('renttransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Office name: " + escapeApos(officeName);
						summaryText += "\\n Rent period: " + rentPeriod;
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_ofr_office', officeName);
							record.setFieldValue('custrecord_expenseline_ofr_rentperiod', rentPeriod);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// subs values
							record.setFieldValue('custrecord_expenseline_ofr_office', officeName);
							record.setFieldValue('custrecord_expenseline_ofr_rentperiod', rentPeriod);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 34: // Subscriptions

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var descriptionofsubscription = request.getParameter('subscriptiondescription');
						var periodOfSubscription = request.getParameter('subscriptionperiod');
						var organisationJoined = request.getParameter('organisationjoined');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('subscriptionpaymentcurrency');
						var transactionAmount = request.getParameter('subscriptiontransactionamount');
						var transactionCurrency = request.getParameter('subscriptiontransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Description of subscription/membership: " + escapeApos(descriptionofsubscription);
						summaryText += "\\n Period of subscription/membership: " + periodOfSubscription;
						summaryText += "\\n Organisation joined / subscribed to: " + escapeApos(organisationJoined);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_sub_description', descriptionofsubscription);
							record.setFieldValue('custrecord_sub_period', periodOfSubscription);
							record.setFieldValue('custrecord_sub_org', organisationJoined);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// subs values
							record.setFieldValue('custrecord_sub_description', descriptionofsubscription);
							record.setFieldValue('custrecord_sub_period', periodOfSubscription);
							record.setFieldValue('custrecord_sub_org', organisationJoined);

							//standard values	
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 17: // TRAINING

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var descriptionOfTraining = request.getParameter('trainingdescription');
						var dateOfTraining = request.getParameter('trainingdate');
						var trainingProvider = request.getParameter('trainingprovider');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('trainingpaymentcurrency');
						var transactionAmount = request.getParameter('trainingtransactionamount');
						var transactionCurrency = request.getParameter('trainingtransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Description of training: " + escapeApos(descriptionOfTraining);
						summaryText += "\\n Date of training: " + dateOfTraining;
						summaryText += "\\n Training provider: " + escapeApos(trainingProvider);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_trn_desc', descriptionOfTraining);
							record.setFieldValue('custrecord_expenseline_trn_date', dateOfTraining);
							record.setFieldValue('custrecord_expenseline_trn_prvder', trainingProvider);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// training values
							record.setFieldValue('custrecord_expenseline_trn_desc', descriptionOfTraining);
							record.setFieldValue('custrecord_expenseline_trn_date', dateOfTraining);
							record.setFieldValue('custrecord_expenseline_trn_prvder', trainingProvider);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 16: // STATIONERY

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var printselection = request.getParameter('printselection');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('stationerypaymentcurrency');
						var transactionAmount = request.getParameter('stationerytransactionamount');
						var transactionCurrency = request.getParameter('stationerytransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Admin type: " + printselection;
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_psp_admincost', printselection);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// stationery values
							record.setFieldValue('custrecord_expenseline_psp_admincost', printselection);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 19: // Computer hardware

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var itemPurchased = request.getParameter('itempurchased');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('computerpaymentcurrency');
						var transactionAmount = request.getParameter('computertransactionamount');
						var transactionCurrency = request.getParameter('computertransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Item purchased: " + escapeApos(itemPurchased);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_chw_itemprch', itemPurchased);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// stationery values
							record.setFieldValue('custrecord_expenseline_chw_itemprch', chargeReason);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 20: // BANK CHARGES

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var chargeReason = request.getParameter('bankcharge');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('bankpaymentcurrency');
						var transactionAmount = request.getParameter('banktransactionamount');
						var transactionCurrency = request.getParameter('banktransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Description of charge: " + escapeApos(chargeReason);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_expenseline_bnk_chrgdesc', chargeReason);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// bank values
							record.setFieldValue('custrecord_expenseline_bnk_chrgdesc', chargeReason);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 12: // accommodation

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{			
						// get parameters
						var customer = request.getParameter('customer');
						var accommodationCountry = request.getParameter('accommodationcountry');
						var accommodationCity = request.getParameter('accommodationcity');
						var accommodationHotelName = request.getParameter('accommodationhotel');
						var accommodationDuration = request.getParameter('accommodationduration');
						var transactionAmount = request.getParameter('accomtransactionamount');
						var transactionCurrency = request.getParameter('accomtransactioncurrency');
						var paymentCurrency = request.getParameter('accommodationpaymentcurrency');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						nlapiLogExecution('DEBUG', 'Accom paymentCurrency', paymentCurrency);

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// search for currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						// add parameters to the summary text for the summary field
						var summaryText = "\'Country: " + accommodationCountry;
						summaryText += "\\n City: " + escapeApos(accommodationCity);
						summaryText += "\\n Hotel Name: " + escapeApos(accommodationHotelName);
						summaryText += "\\n Duration: " + accommodationDuration;
						summaryText += "\\n Amount: " + transactionAmount + " " + currencyName + "\'";			

						// commit information to the line record		
						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_acc_country', accommodationCountry);
							record.setFieldValue('custrecord_expenseline_acc_city', accommodationCity);
							record.setFieldValue('custrecord_expenseline_acc_hotelname', accommodationHotelName);
							record.setFieldValue('custrecord_expenseline_acc_duration', accommodationDuration);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// accom values
							record.setFieldValue('custrecord_expenseline_acc_country', accommodationCountry);
							record.setFieldValue('custrecord_expenseline_acc_city', accommodationCity);
							record.setFieldValue('custrecord_expenseline_acc_hotelname', accommodationHotelName);
							record.setFieldValue('custrecord_expenseline_acc_duration', accommodationDuration);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						//addNewScript += 'window.opener.nlapiSetFieldValue(\'custbody_claimamount\',\'' + claimAmount + '\');';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}

					break;

				case 14: // customer entertainings

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var custEntEntClient = request.getParameter('customer');
						var custEntNoOfAttendees = request.getParameter('customerentattendees');
						var custEntAttendeeNames = reduceString(request.getParameter('customerentattendeesnames'));
						var reason = reduceString(request.getParameter('expenditurereason'));
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var transactionAmount = request.getParameter('custransactionamount');
						var transactionCurrency = request.getParameter('cusenttransactioncurrency');
						var paymentCurrency = request.getParameter('customerentpaymentcurrency');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// search for currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Client: " + escapeApos(custEntEntClient);
						summaryText += "\\n Number of attendees: " + custEntNoOfAttendees;
						summaryText += "\\n Attendee names: " + escapeApos(custEntAttendeeNames);
						summaryText += "\\n Amount: " + transactionAmount + " " + currencyName + "\'";

						// commit information to the line record		
						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_rce_attno', custEntNoOfAttendees);
							record.setFieldValue('custrecord_expenseline_rce_attnames', custEntAttendeeNames);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', custEntEntClient);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// cust ent values
							record.setFieldValue('custrecord_expenseline_rce_attno', custEntNoOfAttendees);
							record.setFieldValue('custrecord_expenseline_rce_attnames', custEntAttendeeNames);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', custEntEntClient);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}

					break;

				case 3: // flights

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{

						var flightNoAirport = parseInt(request.getParameter('flightsnoairport'));

						if(flightNoAirport == 1)
						{
							var summaryText = "\'Invalid claim - No airports selected" + "\'";
							addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";	
						}
						else
						{
							var flightIdOriCountry = request.getParameter('flightsoriginid');
							var flightIdDesCountry = request.getParameter('flightsdestinationid');

							var flightOriginCountry = request.getParameter('flightsorigin');
							var flightCountryStopOver = escapeApos(reduceString(request.getParameter('stopcountry')));
							var flightCountryReturn = request.getParameter('returncountry');
							var flightOriginAirport = request.getParameter('flightoriginairport');
							var flightDestinationCountry = request.getParameter('flightsdestination');
							var flightAirportReturn = request.getParameter('flightreturnaiport');
							var flightDestinationAirport = request.getParameter('flightdestinationairport');
							var flightStopOverAirport = escapeApos(reduceString(request.getParameter('flightstopoverairport')));
							var paymentCurrency = request.getParameter('flightpaymentcurrency');
							var transactionAmount = parseFloat(request.getParameter('flighttransactionamount'));
							var transactionCurrency = request.getParameter('flighttransactioncurrency');
							var projectDetails = parseInt(request.getParameter('projectdetail'));
							var rechargeable = request.getParameter('rechargeable');
							var reason = reduceString(request.getParameter('expenditurereason'));
							var customer = request.getParameter('customer');

							var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
							var transactionLineAmount = transactionAmount * exchangeRate;
							parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

							// claim amount calculation
							claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
							claimAmount = toFixed(claimAmount,2);
							nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

							var transactionSearchFilters = new Array();
							var transactionSearchColumns = new Array();	
							transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
							transactionSearchColumns[0] = new nlobjSearchColumn('name');	
							var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
							var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

							if(flightCountryReturn == 'Yes')
							{
								var summaryText = "\'from country: " + flightIdOriCountry;
								summaryText += "\\n country stop overs: " + flightCountryStopOver;
								summaryText += "\\n Main destination country: " + flightIdDesCountry;

								summaryText += "\\n From airport: " + flightOriginAirport;
								summaryText += "\\n Airport stop overs: " + flightStopOverAirport;
								summaryText += "\\n Main desitination airport: " + flightDestinationAirport;
								summaryText += "\\n Return journey: ";
								summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

								if(lineEdit == 0)
								{
									nlapiLogExecution('DEBUG', 'origin country ' + flightIdOriCountry);
									nlapiLogExecution('DEBUG', 'stopover country ' + flightCountryStopOver);
									nlapiLogExecution('DEBUG', 'destination country ' + flightIdDesCountry);
									nlapiLogExecution('DEBUG', 'origin airport ' + flightOriginAirport);
									nlapiLogExecution('DEBUG', 'destination airport ' + flightDestinationAirport);
									nlapiLogExecution('DEBUG', 'stop over airport ' + flightStopOverAirport);

									var record = nlapiCreateRecord('customrecord_expenseline');
									record.setFieldValue('custrecord_expenseline_fli_from', flightIdOriCountry);
									record.setFieldValue('custrecord_expenseline_fli_stopover', flightCountryStopOver);
									record.setFieldValue('custrecord_expenseline_fli_returnyesno', flightCountryReturn);
									record.setFieldValue('custrecord_expenseline_fli_origairport', flightOriginAirport);
									record.setFieldValue('custrecord_expenseline_fli_maindest', flightIdDesCountry);
									record.setFieldValue('custrecord_expenseline_fli_destairport', flightDestinationAirport);
									record.setFieldValue('custrecord_expenseline_fli_airstopover', flightStopOverAirport);

									record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
									record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
									record.setFieldValue('custrecord_exp_amount', transactionAmount);
									record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
									record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
									record.setFieldValue('custrecord_exp_reason', reason);
									record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
									record.setFieldValue('custrecord_exp_project', projectDetails);
									record.setFieldValue('custrecord_exp_customer', customer);
									var internalId = nlapiSubmitRecord(record, true);
									nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
								}
								else
								{
									var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

									var record = nlapiCreateRecord('customrecord_expenseline');
									record.setFieldValue('custrecord_expenseline_fli_from', flightIdOriCountry);
									record.setFieldValue('custrecord_expenseline_fli_stopover', flightCountryStopOver);
									record.setFieldValue('custrecord_expenseline_fli_returnyesno', flightCountryReturn);
									record.setFieldValue('custrecord_expenseline_fli_origairport', flightOriginAirport);
									record.setFieldValue('custrecord_expenseline_fli_maindest', flightIdDesCountry);
									record.setFieldValue('custrecord_expenseline_fli_destairport', flightDestinationAirport);
									record.setFieldValue('custrecord_expenseline_fli_airstopover', flightStopOverAirport);

									record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
									record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
									record.setFieldValue('custrecord_exp_amount', transactionAmount);
									record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
									record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
									record.setFieldValue('custrecord_exp_reason', reason);
									record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
									record.setFieldValue('custrecord_exp_project', projectDetails);
									record.setFieldValue('custrecord_exp_customer', customer);
									var internalId = nlapiSubmitRecord(record, true);
									nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
								}

								//addNewScript += 'window.opener.nlapiSetFieldValue(\'custbody_claimamount\',\'' + claimAmount + '\');';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
								addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
								addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
							}
							else
							{
								var summaryText = "\'from country: " + flightOriginCountry;
								summaryText += "\\n country stop overs: " + flightCountryStopOver;
								summaryText += "\\n to country: " + flightDestinationCountry;

								summaryText += "\\n From airport: " + flightOriginAirport;
								summaryText += "\\n Airport stop overs: " + flightStopOverAirport;
								summaryText += "\\n To airport: " + flightDestinationAirport;
								summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

								if(lineEdit == 0)
								{
									nlapiLogExecution('DEBUG', 'origin country ' + flightIdOriCountry);
									nlapiLogExecution('DEBUG', 'stopover country ' + flightCountryStopOver);
									nlapiLogExecution('DEBUG', 'destination country ' + flightIdDesCountry);
									nlapiLogExecution('DEBUG', 'origin airport ' + flightOriginAirport);
									nlapiLogExecution('DEBUG', 'destination airport ' + flightDestinationAirport);
									nlapiLogExecution('DEBUG', 'stop over airport ' + flightStopOverAirport);

									var record = nlapiCreateRecord('customrecord_expenseline');
									record.setFieldValue('custrecord_expenseline_fli_from', flightIdOriCountry);
									record.setFieldValue('custrecord_expenseline_fli_stopover', flightCountryStopOver);
									record.setFieldValue('custrecord_expenseline_fli_returnyesno', flightCountryReturn);
									record.setFieldValue('custrecord_expenseline_fli_origairport', flightOriginAirport);
									record.setFieldValue('custrecord_expenseline_fli_maindest', flightIdDesCountry);
									record.setFieldValue('custrecord_expenseline_fli_destairport', flightDestinationAirport);
									record.setFieldValue('custrecord_expenseline_fli_airstopover', flightStopOverAirport);

									record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
									record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
									record.setFieldValue('custrecord_exp_amount', transactionAmount);
									record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
									record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
									record.setFieldValue('custrecord_exp_reason', reason);
									record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
									record.setFieldValue('custrecord_exp_project', projectDetails);
									record.setFieldValue('custrecord_exp_customer', customer);
									var internalId = nlapiSubmitRecord(record, true);
									nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);	

								}
								else
								{
									var record = nlapiCreateRecord('customrecord_expenseline');
									record.setFieldValue('custrecord_expenseline_fli_from', flightIdOriCountry);
									record.setFieldValue('custrecord_expenseline_fli_stopover', flightCountryStopOver);
									record.setFieldValue('custrecord_expenseline_fli_returnyesno', flightCountryReturn);
									record.setFieldValue('custrecord_expenseline_fli_origairport', flightOriginAirport);
									record.setFieldValue('custrecord_expenseline_fli_maindest', flightIdDesCountry);
									record.setFieldValue('custrecord_expenseline_fli_destairport', flightDestinationAirport);
									record.setFieldValue('custrecord_expenseline_fli_airstopover', flightStopOverAirport);

									record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
									record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
									record.setFieldValue('custrecord_exp_amount', transactionAmount);
									record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
									record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
									record.setFieldValue('custrecord_exp_reason', reason);
									record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
									record.setFieldValue('custrecord_exp_project', projectDetails);
									record.setFieldValue('custrecord_exp_customer', customer);
									var internalId = nlapiSubmitRecord(record, true);
									nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);

								}

								//	addNewScript += 'window.opener.nlapiSetFieldValue(\'custbody_claimamount\',\'' + claimAmount + '\');';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
								addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
								addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
								addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
							}	
						}
					}
					break;

				case 31: // rail

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var railOrigin = request.getParameter('railorigin');
						var railDestination = request.getParameter('raildestination');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('railpaymentcurrency');
						var transactionAmount = request.getParameter('railtransactionamount');
						var transactionCurrency = request.getParameter('railtransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						var summaryText = "\'Origin: " + escapeApos(railOrigin);
						summaryText += "\\n Destination: " + escapeApos(railDestination);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						// commit information to the line record		
						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_rai_from', railOrigin);
							record.setFieldValue('custrecord_expenseline_rai_to', railDestination);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// rail values
							record.setFieldValue('custrecord_expenseline_rai_from', railOrigin);
							record.setFieldValue('custrecord_expenseline_rai_to', railDestination);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 30: // bus

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var busOrigin = request.getParameter('busorigin');
						var busDestination = request.getParameter('busdestination');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentCurrency = request.getParameter('buspaymentcurrency');
						var transactionAmount = request.getParameter('bustransactionamount');
						var transactionCurrency = request.getParameter('bustransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Origin: " + escapeApos(busOrigin);
						summaryText += "\\n Destination: " + escapeApos(busDestination);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_expenseline_bus_from', busOrigin);
							record.setFieldValue('custrecord_expenseline_bus_to', busDestination);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// bus values
							record.setFieldValue('custrecord_expenseline_bus_from', busOrigin);
							record.setFieldValue('custrecord_expenseline_bus_to', busDestination);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 7:	// taxi

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var taxiOrigin = request.getParameter('taxiorigin');
						var taxiDestination = request.getParameter('taxidestination');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentAmount = request.getParameter('taxipaymentamount');
						var paymentCurrency = request.getParameter('taxipaymentcurrency');
						var transactionAmount = request.getParameter('taxitransactionamount');
						var transactionCurrency = request.getParameter('taxitransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Origin: " + escapeApos(taxiOrigin);
						summaryText += "\\n Destination: " + escapeApos(taxiDestination);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_txi_from', taxiOrigin);
							record.setFieldValue('custrecord_expenseline_txi_to', taxiDestination);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							// taxi values
							record.setFieldValue('custrecord_expenseline_txi_from', taxiOrigin);
							record.setFieldValue('custrecord_expenseline_txi_to', taxiDestination);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}

					break;

				case 29: // dining

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var dinnerNoOfAttendees = request.getParameter('diningattendeenumber');
						var dinnerAttendeeNames = reduceString(request.getParameter('diningattendeenames'));
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentAmount = request.getParameter('dinnerpaymentamount');
						var paymentCurrency = request.getParameter('dinnerpaymentcurrency');
						var transactionAmount = request.getParameter('dinnertransactionamount');
						var transactionCurrency = request.getParameter('dinnertransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);


						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Number of attendees: " + escapeApos(dinnerNoOfAttendees);
						summaryText += "\\n Attendee names: " + escapeApos(dinnerAttendeeNames);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_rss_attno', dinnerNoOfAttendees);
							record.setFieldValue('custrecord_expenseline_rss_attnames', dinnerAttendeeNames);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							record.setFieldValue('custrecord_expenseline_rss_attno', dinnerNoOfAttendees);
							record.setFieldValue('custrecord_expenseline_rss_attnames', dinnerAttendeeNames);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 6: // car

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var carHireDuration = request.getParameter('carhireduration');
						var carHirePoint = request.getParameter('carhirepoint');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentAmount = request.getParameter('carpaymentamount');
						var paymentCurrency = request.getParameter('carpaymentcurrency');
						var transactionAmount = request.getParameter('cartransactionamount');
						var transactionCurrency = request.getParameter('cartransactioncurrency');
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Duration: " + carHireDuration;
						summaryText += "\\n Car hire point: " + escapeApos(carHirePoint);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_chr_carhire', carHireDuration);
							record.setFieldValue('custrecord_expenseline_chr_hirepoint', carHirePoint);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							record.setFieldValue('custrecord_expenseline_chr_carhire', carHireDuration);
							record.setFieldValue('custrecord_expenseline_chr_hirepoint', carHirePoint);

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 5: // parking location

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var parkingLocation = request.getParameter('parkinglocationlocation');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentAmount = request.getParameter('parkingpaymentamount');
						var paymentCurrency = request.getParameter('parkingpaymentcurrency');
						var transactionAmount = request.getParameter('parkingtransactionamount');
						var transactionCurrency = request.getParameter('parkingtransactioncurrency');		 	
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						nlapiLogExecution('DEBUG', 'Accom exchangeRate', exchangeRate);

						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));
						nlapiLogExecution('DEBUG', 'Accom transactionLineAmount', transactionLineAmount);
						nlapiLogExecution('DEBUG', 'Accom transactionAmount', transactionAmount);

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Parking location: " + escapeApos(parkingLocation);
						summaryText += "\\n Transaction amount: " + transactionAmount + " " +currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');
							record.setFieldValue('custrecord_expenseline_prk_location', parkingLocation);

							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							record.setFieldValue('custrecord_expenseline_prk_location', parkingLocation);	

							//standard values
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;

				case 10: // Subsistence

					var projectOver = request.getParameter('projectoverride');
					nlapiLogExecution('DEBUG', 'Projectoverride', projectOver);

					var subsistenceDepartureTime = request.getParameter('subsistencedeparturetime');
					var subsistenceReturnTime = request.getParameter('subsistencereturntime');	
					var countryTravel = request.getParameter('custpage_uktravel');
					var amount = request.getParameter('subsistencetriptotal');
					var amountTwo = request.getParameter('subsistencehiddentotal');
					var subsistenceCurrency = request.getParameter('subsistencepaymentcurrency');
					var departureDate = request.getParameter('subsistencedeparturedate');
					var returnDate = request.getParameter('subsistencereturndate');
					var returnAMPM = request.getParameter('subsistenceampmreturn');
					var departAMPM = request.getParameter('subsistenceampmdeparture');
					var projectDetails = parseInt(request.getParameter('projectdetail'));
					var rechargeable = request.getParameter('rechargeable');
					var reason = reduceString(request.getParameter('expenditurereason'));

					nlapiLogExecution('DEBUG', 'countryTravel', countryTravel);
					nlapiLogExecution('DEBUG', 'amount', amountTwo);
					nlapiLogExecution('DEBUG', 'amount', amount);


					var subsistenceBmeal = request.getParameter('subsistencehiddenbmeal');
					var subsistenceLmeal = request.getParameter('subsistencehiddenlmeal');
					var subsistenceDmeal = request.getParameter('subsistencehiddendmeal');
					var subsistenceEmeal = request.getParameter('subsistencehiddenemeal');

					var subsistenceBmealAmount = request.getParameter('subsistenceamountbreakfast');
					var subsistenceLmealAmount = request.getParameter('subsistenceamountonemeal');
					var subsistenceDmealAmount = request.getParameter('subsistenceamounttwomeal');
					var subsistenceEmealAmount = request.getParameter('subsistenceamountlatemeal');

					var subsistenceDeductionTotal = request.getParameter('hiddendeductionstotal');
					var subsistenceFullDayTotal = request.getParameter('hiddenfulldaytotal');
					var subsistenceDayTwoTotal = request.getParameter('hiddendaytwototal');
					var subsistenceDayOneTotal = request.getParameter('hiddendayonetotal');


					if(amountTwo <= 0)
					{
						var summaryText = "\'Invalid claim - total claim is equal to or less than 0 "+ "\'";
					}
					else
					{
						var exchangeRate = nlapiExchangeRate(subsistenceCurrency, subsistenceCurrency, lineDate);

						if(subsistenceBmealAmount != null && subsistenceLmealAmount != null && subsistenceDmealAmount != null && subsistenceEmealAmount != null)
						{
							var mealText = "\' Breakfast: " + subsistenceBmeal + " (" + subsistenceBmealAmount +")";
							mealText += "\\n Lunch: " + subsistenceLmeal + " (" + subsistenceLmealAmount +")";
							mealText += "\\n Dinner: " + subsistenceDmeal + " (" + subsistenceDmealAmount +")";
							mealText += "\\n Late: " + subsistenceEmeal + " (" + subsistenceEmealAmount +")";
							mealText += "\\n Currency: "+ baseCurrencyText + "\'";

							addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_expenses_meal_deductions\'," + mealText + ", true, true);";		
						}

						var summaryText = "\'Departure date: " + departureDate;
						summaryText += "\\n Departure time: " + subsistenceDepartureTime + " " + departAMPM;
						summaryText += "\\n Return date: " + returnDate;
						summaryText += "\\n Return time: " + subsistenceReturnTime + " " + returnAMPM;

						switch(countryTravel)
						{
							case 1: // ROW
								summaryText += "\\n Country of travel: ROW";
								break;
							case 2: // UK
								summaryText += "\\n Country of travel: UK ";
								break;
							case 3: // US
								summaryText += "\\n Country of travel: US";
								break;
						}

						summaryText += "\\n Total full day: "  + subsistenceFullDayTotal;
						summaryText += "\\n Total day one: "  + subsistenceDayOneTotal;
						summaryText += "\\n Total day two: "  + subsistenceDayTwoTotal;
						summaryText += "\\n Total deductions: "  + subsistenceDeductionTotal;
						summaryText += "\\n Payment amount: " + amountTwo + " " + baseCurrencyText + "\'";

						var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);
						record.setFieldValue('custrecord_exp_amount', amountTwo);		
						record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));	
						record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
						record.setFieldText('custrecord_exp_currincurred', subsistenceCurrency);
						record.setFieldText('custrecord_exp_claimpaidin', subsistenceCurrency);
						var internalId = nlapiSubmitRecord(record, true);
						nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);


						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + lineEdit + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + amountTwo + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		

					}	

					addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		

					break;

				case 4: // mileage

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						try
						{
							var mileageOrigin = request.getParameter('mileageorigin');
							var mileageDestination = request.getParameter('mileagedestination');
							var mileageNoOfMiles = request.getParameter('mileagenoofmiles');
							var mileageVehicleType = request.getParameter('mileagevehtype');
							var mileageRate = request.getParameter('custpage_mileagerate');
							var mileageClaimAmount = request.getParameter('mileageclaimamount');
							var mileageTotalMiles = request.getParameter('mileagetotalmiles');
							var mileageVehicle = request.getParameter('mileagevehicleselection');
							var mileageBreakPoint = request.getParameter('mileagebreakpoint');
							var mileageCurrency = request.getParameter('mileagepaymentcurrency');
							var projectDetails = parseInt(request.getParameter('projectdetail'));
							var rechargeable = request.getParameter('rechargeable');
							var reason = reduceString(request.getParameter('expenditurereason'));
							var customer = request.getParameter('customer');

							nlapiLogExecution('DEBUG','mileageClaimAmount', mileageClaimAmount);
							nlapiLogExecution('DEBUG','vehicle', mileageVehicle);
							nlapiLogExecution('DEBUG','employee location', employeeLocId);
							nlapiLogExecution('DEBUG','MileageNoOfMiles', mileageNoOfMiles);
							nlapiLogExecution('DEBUG','breakpoint', mileageBreakPoint);
							nlapiLogExecution('DEBUG','VEH TYPE', mileageVehicleType);
							nlapiLogExecution('DEBUG','total miles', mileageTotalMiles);

							if(mileageVehicleType != 1)
							{
								var mileageVehicleSearchFilters = new Array();
								var mileageVehicleSearchColumns = new Array();	
								mileageVehicleSearchFilters[0] = new nlobjSearchFilter('custrecord_regno', null, 'is', mileageVehicle);
								mileageVehicleSearchColumns[0] = new nlobjSearchColumn('internalid');	
								var mileageVehicleSearch = nlapiSearchRecord('customrecord_employeevehicle', null, mileageVehicleSearchFilters, mileageVehicleSearchColumns);

								var vehicleInternalID = mileageVehicleSearch[0].getValue(mileageVehicleSearchColumns[0]); 
							}


							var exchangeRate = nlapiExchangeRate(mileageCurrency, mileageCurrency, lineDate);
							// isn't used in mileage
							var transactionLineAmount = transactionAmount * exchangeRate;
							nlapiLogExecution('DEBUG', 'Mileage exchangeRate', exchangeRate);
							nlapiLogExecution('DEBUG', 'Mileage vehicle internal ID: ' + vehicleInternalID);

							var summaryText = "\'Origin: " + mileageOrigin;
							summaryText += "\\n Destintation: " + mileageDestination;	

							if(lineEdit == 0)
							{
								var record = nlapiCreateRecord('customrecord_expenseline');
								record.setFieldValue('custrecord_expenseline_mil_orig', mileageOrigin);
								record.setFieldValue('custrecord_expenseline_mil_dest', mileageDestination);
								record.setFieldValue('custrecord_expenseline_mil_noofmiles', mileageNoOfMiles);
								record.setFieldValue('custrecord_expenseline_mil_vehtype', mileageVehicleType);

								if(mileageVehicleType != 1)
								{
									record.setFieldValue('custrecord_expenseline_mil_empveh', vehicleInternalID);
								}

								record.setFieldText('custrecord_exp_currincurred', mileageCurrency);
								record.setFieldText('custrecord_exp_claimpaidin', mileageCurrency);
								record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
								record.setFieldValue('custrecord_exp_reason', reason);
								record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
								record.setFieldValue('custrecord_exp_project', projectDetails);
								record.setFieldValue('custrecord_exp_customer', customer);
								nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
							}
							else
							{
								var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

								record.setFieldValue('custrecord_expenseline_mil_orig', mileageOrigin);
								record.setFieldValue('custrecord_expenseline_mil_dest', mileageDestination);
								record.setFieldValue('custrecord_expenseline_mil_noofmiles', mileageNoOfMiles);
								record.setFieldValue('custrecord_expenseline_mil_vehtype', mileageVehicleType);

								if(mileageVehicleType != 1)
								{
									record.setFieldValue('custrecord_expenseline_mil_empveh', vehicleInternalID);
								}

								//standard values
								record.setFieldText('custrecord_exp_currincurred', mileageCurrency);
								record.setFieldText('custrecord_exp_claimpaidin', mileageCurrency);
								record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
								record.setFieldValue('custrecord_exp_reason', reason);
								record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
								record.setFieldValue('custrecord_exp_project', projectDetails);
								record.setFieldValue('custrecord_exp_customer', customer);

								nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
							}

							switch(parseInt(employeeLocId))
							{
								case 1: // UK
								case 2: // US
								case 3: // CANADA
								case 5: // SRI LANKA
									nlapiLogExecution('DEBUG', 'claim amount', claimAmount);
									var claimAmount = mileageClaimAmount;
									claimAmount = toFixed(claimAmount,2);
									summaryText += "\\n Number of miles: " + mileageNoOfMiles;
									if(mileageVehicleType == 1)
									{
										summaryText += "\\n Vehicle is a bicycle";
									}
									else
									{
										summaryText += "\\n Registration: " + mileageVehicle;
									}
									summaryText += "\\n Payment amount: " + claimAmount + " " + baseCurrencyText + "\'";
									addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + claimAmount + '\', true, true);';
									addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
									addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_mileagenoofmiles' + '\',\'' + mileageNoOfMiles + '\', true, true);';
									break;
								case 4: // EUROPE	
									switch(parseInt(mileageVehicleType))
									{
										case 1: //bicycle
											nlapiLogExecution('DEBUG', 'Bicycle', mileageVehicleType);
											var claimAmount = mileageClaimAmount;
											claimAmount = toFixed(claimAmount,2);
											summaryText += "\\n Number of KMs: " + mileageNoOfMiles;
											summaryText += "\\n Payment amount: " + claimAmount + " " + baseCurrencyText + "\'";
											addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + claimAmount + '\', true, true);';
											addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
											addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_mileagenoofmiles' + '\',\'' + mileageNoOfMiles + '\', true, true);';
											break;	
										case 2: // motorcycle
										case 3: // van	
										case 4: // car

											if(mileageVehicle != null)
											{
												nlapiLogExecution('DEBUG', 'car motorcycle van', mileageVehicleType);
												//get the number plate which identifies the currently selected vehicle
												var expSearchFilters = new Array();
												var expSearchColumns = new Array();
												// search filters		
												expSearchFilters[0] = new nlobjSearchFilter('custrecord_regno', null, 'is', mileageVehicle);
												//expSearchFilters[1] = new nlobjSearchFilter('custrecord_employee', null, 'is', currentEmployee);
												// search columns
												expSearchColumns[0] = new nlobjSearchColumn('custrecord_enginesize');

												var expSearchResults = nlapiSearchRecord('customrecord_employeevehicle', null, expSearchFilters, expSearchColumns);

												//get the interal id of the engine size that has been returned
												var mileageEngineSize = expSearchResults[0].getValue(expSearchColumns[0]);

												// engine arrays					
												var engSearchFilters = new Array();
												var engSearchColumns = new Array();
												// engine search filters
												engSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', mileageEngineSize);
												// engine search columns
												engSearchColumns[0] = new nlobjSearchColumn('custrecord_euroband1rate');
												engSearchColumns[1] = new nlobjSearchColumn('custrecord_euroband2rate');

												var engSearchResults = nlapiSearchRecord('customrecord_euroenginesize', null, engSearchFilters, engSearchColumns);

												var band1Rate = engSearchResults[0].getValue(engSearchColumns[0]);
												var band2Rate = engSearchResults[0].getValue(engSearchColumns[1]);
												// mileage calculation  **identical to others**
												var mileageClaim = mileageCalculation(mileageBreakPoint, band1Rate, band2Rate, mileageNoOfMiles, mileageTotalMiles);	
												claimAmount = mileageClaim;	            
												//round the claim amount using toFixed function
												if(mileageNoOfMiles == null)
												{
													// this should never happen but is placed here just incase
													mileageNoOfMiles == 0;
												}   
												claimAmount = toFixed(claimAmount,2);
												summaryText += "\\n Number of KMs: " + mileageNoOfMiles;
												summaryText += "\\n Registration: " + mileageVehicle;
												summaryText += "\\n Payment amount: " + claimAmount + " " + baseCurrencyText + "\'";

												addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + claimAmount + '\', true, true);';
												addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
												addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_mileagenoofmiles' + '\',\'' + mileageNoOfMiles + '\', true, true);';
												break;
											}
											else
											{
												assistant.setCurrentStep(assistant.getStep( "step1") );
												return true;
											} 
									}		
									break; 							
							}

							// set the claim and summary fields
							record.setFieldValue('custrecord_exp_amount', mileageClaimAmount);
							record.setFieldValue('custrecord_exp_expensesummary', escapeNewLine(summaryText));
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);

							addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
							addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
							addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
							addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + reason + "\', true, true);";		
							addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						}
						catch(e)
						{

							nlapiLogExecution('ERROR', 'No project or vehicle found and user clicked next', e);
							addNewScript += 'close(); </script>';  	//zzz
							response.write(addNewScript);
							return true;
						}
					}
					else
					{

					}

					break;

				case 13: // computer sundries
				case 26: // fuel
				case 27: // mobile phone
				case 33: // landline calls
				case 28: // other 
				case 32: // internet access
				case 35: // health care
				case 36: // PR & Promotions
				case 37: // Advertising

					var projectOver = request.getParameter('projectoverride');

					if(projectOver == 0)
					{
						var reason = reduceString(request.getParameter('expenditurereason'));
						var paymentAmount = request.getParameter('paymentamount');
						var paymentCurrency = request.getParameter('paymentcurrency');
						var transactionAmount = request.getParameter('transactionamount');
						var transactionCurrency = request.getParameter('transactioncurrency');	
						var projectDetails = parseInt(request.getParameter('projectdetail'));
						var rechargeable = request.getParameter('rechargeable');
						var customer = request.getParameter('customer');

						nlapiLogExecution('DEBUG', 'reason', reason);
						nlapiLogExecution('DEBUG', 'paymentAmount', paymentAmount);
						nlapiLogExecution('DEBUG', 'paymentCurrency', paymentCurrency);
						nlapiLogExecution('DEBUG', 'transactionAmount', transactionAmount);
						nlapiLogExecution('DEBUG', 'transactionCurrency', transactionCurrency);

						var exchangeRate = nlapiExchangeRate(transactionCurrency, paymentCurrency, lineDate);
						var transactionLineAmount = transactionAmount * exchangeRate;
						nlapiLogExecution('DEBUG', 'Accom exchangeRate', exchangeRate);

						parseFloat(transactionLineAmount = toFixed(transactionLineAmount,2));
						nlapiLogExecution('DEBUG', 'Accom transactionLineAmount', transactionLineAmount);
						nlapiLogExecution('DEBUG', 'Accom transactionAmount', transactionAmount);

						// claim amount calculation
						claimAmount = parseFloat(claimAmount) + parseFloat(transactionLineAmount);
						claimAmount = toFixed(claimAmount,2);
						nlapiLogExecution('DEBUG', 'claimamount', claimAmount);

						//get the currency name
						var transactionSearchFilters = new Array();
						var transactionSearchColumns = new Array();	
						transactionSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', transactionCurrency);
						transactionSearchColumns[0] = new nlobjSearchColumn('name');	
						var transactionCurrencySearch = nlapiSearchRecord('currency', null, transactionSearchFilters[0], transactionSearchColumns[0]);				
						var currencyName = transactionCurrencySearch[0].getValue(transactionSearchColumns[0]);   

						var summaryText = "\'Transaction amount: " + transactionAmount + " " + currencyName + "\'";

						if(lineEdit == 0)
						{
							var record = nlapiCreateRecord('customrecord_expenseline');

							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}
						else
						{
							var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);

							//standard values
							record.setFieldValue('custrecord_exp_exchangerate', exchangeRate);
							record.setFieldValue('custrecord_exp_amount', transactionAmount);
							record.setFieldValue('custrecord_exp_currincurred', transactionCurrency);
							record.setFieldText('custrecord_exp_claimpaidin', paymentCurrency);
							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetails);
							record.setFieldValue('custrecord_exp_customer', customer);
							var internalId = nlapiSubmitRecord(record, true);
							nlapiLogExecution('DEBUG', 'the internal id is: ' + internalId);
						}

						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_line_rec_id' + '\',\'' + internalId + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'custcol_rechargeable_customer' + '\',\'' + rechargeable + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'customer' + '\',\'' + projectDetails + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'foreignamount' + '\',\'' + transactionLineAmount + '\', true, true);';
						addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'currency' + '\',\'' + baseCurrency + '\', true, true);';
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'custcol_summary\'," + summaryText + ", true, true);";		
						addNewScript += "window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'memo\',\'" + escapeApos(reason) + "\', true, true);";		
					}
					break;
			}

			//addNewScript += 'window.opener.nlapiSetCurrentLineItemValue(\'expense\',\'' + 'memo' + '\',\'' + 'z' + '\', false, true);';  //****EXAMPLE DO NOT DELETE****
			addNewScript += 'close(); </script>';  	//zzz
			response.write(addNewScript);

			return true;
		}	
		/* 2. if the user clicks next  */
		else if (assistant.getLastAction() == "next")
		{
			nlapiLogExecution('DEBUG','NEXT');
			// Get expense category and iteration
			var currentEmployee = request.getParameter('custpage_currentemployee');
			var expenseCategory = request.getParameter('custpage_expensecategory');
			var iteration = request.getParameter('custpage_iteration');
			var employeeLocationId = request.getParameter('custpage_employeelocationid');
			var baseCurrency = request.getParameter('custpage_basecurrency');
			var baseCurrencyText = request.getParameter('custpage_basecurrencytext');
			var expenditureCustomer = request.getParameter('expenditurecustomer');
			var date = request.getParameter('custpage_date');
			var claimAmount = request.getParameter('custpage_claimamount');
			var expenseLocation = request.getParameter('custpage_expenselocation');
			var expenseCategoryText = request.getParameter('custpage_expensecategorytext');
			var lineEdit = request.getParameter('custpage_lineedit');
			var tranId = request.getParameter('custpage_tranid');

			// array to store information
			var params = new Array();	

			if(expenseCategory == 22) // Office rent
			{
				var visaCountry = request.getParameter('visacountry');
				var visaDescription = reduceString(request.getParameter('visadescription'));
				var visaDuration = request.getParameter('visaduration');

				params["custpage_visacountry"] = visaCountry;
				params["custpage_visadescription"] = visaDescription;
				params["custpage_visaduration"] = visaDuration;

			}

			if(expenseCategory == 15) // Office rent
			{
				var officeName = request.getParameter('officename');
				var rentPeriod = request.getParameter('rentperiod');

				params["custpage_officename"] = officeName;
				params["custpage_rentperiod"] = rentPeriod;
			}

			if(expenseCategory == 34) // Subscription
			{
				var descriptionofsubscription = reduceString(request.getParameter('subscriptiondescription'));
				var periodOfSubscription = request.getParameter('subscriptionperiod');
				var organisationJoined = request.getParameter('organisationjoined');

				params["custpage_subscriptiondescription"] = descriptionofsubscription;
				params["custpage_subscriptionperiod"] = periodOfSubscription;
				params["custpage_organisationjoined"] = organisationJoined;

			}

			if(expenseCategory == 17) // Training
			{
				var descriptionOfTraining = reduceString(request.getParameter('trainingdescription'));
				var dateOfTraining = request.getParameter('datetraining');
				var trainingProvider = request.getParameter('trainingprovider');

				params["custpage_trainingdescription"] = descriptionOfTraining;
				params["custpage_datetraining"] = dateOfTraining;
				params["custpage_trainingprovider"] = trainingProvider;

			}

			if(expenseCategory == 19) // computer hardware
			{
				var itemPurchased = request.getParameter('itempurchased');

				params["custpage_itempurchased"] = itemPurchased;
			}

			if(expenseCategory == 20) // bank charges
			{
				var chargeReason = reduceString(request.getParameter('chargereason'));

				params["custpage_chargereason"] = chargeReason;
			}

			if(expenseCategory == 16) // stationery
			{
				var printingSelection = request.getParameter('printselection');

				params["custpage_printselection"] = printingSelection;
			}

			if(expenseCategory == 5) // parking location
			{
				var parkingLocation = request.getParameter('parkinglocationlocation');

				params["custpage_parkingLocation"] = parkingLocation;

			}

			if(expenseCategory == 6) // car hire
			{
				var carHireDuration = request.getParameter('carhireduration');
				var carHirePoint = request.getParameter('carhirepoint');

				params["custpage_carHireDuration"] = carHireDuration;
				params["custpage_carHirePoint"] = carHirePoint;
			}

			if(expenseCategory == 29) // dinner
			{
				var dinnerNoOfAttendees = request.getParameter('diningattendeenumber');
				nlapiLogExecution('DEBUG','BEFORE ATTENDEE');
				var dinnerAttendeeNames = reduceString(request.getParameter('diningattendeenames'));
				nlapiLogExecution('DEBUG','AFTER ATTENDEE');

				params["custpage_dinnerNoOfAttendees"] = dinnerNoOfAttendees;
				params["custpage_dinnerAttendeeNames"] = dinnerAttendeeNames;

			}
			if(expenseCategory == 7) // taxi
			{
				var taxiOrigin = request.getParameter('taxiorigin');
				var taxiDestination = request.getParameter('taxidestination');

				params["custpage_taxiorigin"] = taxiOrigin;
				params["custpage_taxidestination"] = taxiDestination;
			}

			if(expenseCategory == 30) // bus
			{
				var busOrigin = request.getParameter('busorigin');
				var busDestination = request.getParameter('busdestination');

				params["custpage_busorigin"] = busOrigin;
				params["custpage_busdestination"] = busDestination;
			}

			if(expenseCategory == 31) // rail
			{
				var railOrigin = request.getParameter('railorigin');
				var railDestination = request.getParameter('raildestination');

				params["custpage_railorigin"] = railOrigin;
				params["custpage_raildestination"] = railDestination;
			}

			if(expenseCategory == 12) // accommodation
			{
				var accommodationCountry = request.getParameter('accommodationcountry');
				var accommodationCity = request.getParameter('accommodationcity');
				var accommodationHotelName = request.getParameter('accommodationhotel');
				var accommodationDuration = request.getParameter('accommodationduration');

				params["custpage_accomodationcountry"] = accommodationCountry;
				params["custpage_accomodationcity"] =accommodationCity;
				params["custpage_accomodationhotel"] = accommodationHotelName;
				params["custpage_accomodationduration"] = accommodationDuration;

			}

			if(expenseCategory == 14) // customer entertainment
			{
				var custEntNoOfAttendees = request.getParameter('customerentattendees');
				var custEntAttendeeNames = reduceString(request.getParameter('customerentattendeesnames'));

				params["custpage_custentnoofattendees"] = custEntNoOfAttendees;
				params["custpage_custentattendeename"] = custEntAttendeeNames;
			}

			if(expenseCategory == 3) // flights
			{
				// get information to pass
				var flightsOriginCountry = request.getParameter('flightorigincountry');
				var flightsDestinationCountry = request.getParameter('flightdestcountry');
				var flightsStopOverCountry = request.getParameter('flightstopovercountry');
				var flightsReturn = request.getParameter('flightreturncountry');

				//putting information into array, this will then be added onto url
				params["custpage_flightstopovercountry"] = flightsStopOverCountry;
				params["custpage_flightreturn"] = flightsReturn;
				params["custpage_flightorigincountry"] = flightsOriginCountry;
				params["custpage_flightdestinationcountry"] = flightsDestinationCountry;		
			}

			if(expenseCategory == 4) // Mileage
			{
				//get information to pass
				var mileageVehType = request.getParameter('mileagevehicletype');
				var mileageDestination = request.getParameter('mileagedestination');
				var mileageOrigin = request.getParameter('mileageorigin');
				var mileageNoOfMiles = request.getParameter('mileagenoofmiles');
				var mileageBreakPoint = request.getParameter('custpage_mileagebreakpoint');
				var mileagetotalmiles = request.getParameter('custpage_mileagetotalmiles');
				var employeeLocation = request.getParameter('mileageemployeelocation');
				var mileageCurrency = request.getParameter('mileagepaymentcurrency');

				// putting information into array, this will then be added onto url
				params["custpage_mileagecurrency"] = mileageCurrency;
				params["custpage_mileageBreakPoint"] = mileageBreakPoint;
				params["custpage_vehicleId"] = mileageVehType;
				params["custpage_mileageDestination"] = mileageDestination;
				params["custpage_mileageOrigin"] = mileageOrigin;
				params["custpage_NoOfMiles"] = mileageNoOfMiles;
				params["custpage_mileageTotalmiles"] = mileagetotalmiles;
				params["custpage_employeeLocation"] = employeeLocation;
			}

			if(expenseCategory == 10) // subsistence
			{	
				//get information to pass
				var subsistenceDepartureDate = request.getParameter('subsistencedeparturedate');
				var subsistenceDepartureTime = request.getParameter('subsistencedeparturetime');
				var subsistenceReturnDate = request.getParameter('subsistencereturndate');
				var subsistenceReturnTime = request.getParameter('subsistencereturntime');
				var subsistenceReturnAMPM = request.getParameter('subsistenceampmreturn');
				var subsistenceDepartureAMPM = request.getParameter('subsistenceampmdeparture');

				nlapiLogExecution('DEBUG','subsistenceReturnAMPM ', subsistenceReturnAMPM);
				nlapiLogExecution('DEBUG','subsistenceDepartureAMPM ', subsistenceDepartureAMPM);

				// load the record or create it if doesn't exsit - this should only happen on the first pass
				if(lineEdit == 0)
				{
					var record = nlapiCreateRecord('customrecord_expenseline');
				}
				else
				{
					var record = nlapiLoadRecord('customrecord_expenseline', lineEdit);
				}

				if(parseInt(iteration) >= 2)
				{
					var override = 0;
					if(iteration == 2)
					{
						var overrideproject = request.getParameter('projectoverride');
						override = overrideproject;
					}
					if(override == 0)
					{
						var projectDetail = request.getParameter('projectdetail');
						var reason = reduceString(request.getParameter('expenditurereason'));
						var rechargeable = request.getParameter('rechargeable');

						params["custpage_projectdetail"] = projectDetail;
						params["custpage_expenditurereason"] = reason;
						params["custpage_rechargeable"] = rechargeable;
					}
				}

				switch(parseInt(iteration))
				{
					case 1: // step 1 -> step 2

						var subsistenceUkTravel = request.getParameter('subsistenceradiobutton');

						//calculations
						var dateDifferenceNumber = dateDiff(subsistenceDepartureDate, subsistenceReturnDate);
						var dateChecker = checkDate(subsistenceDepartureDate, subsistenceReturnDate);

						if(dateChecker == 1)
						{
							nlapiLogExecution('DEBUG', 'DATE CHECKER RETURNED 1');
							iteration = '0';
						}

						if(subsistenceDepartureDate == subsistenceReturnDate)
						{
							if(subsistenceReturnAMPM == subsistenceDepartureAMPM)
							{
								if(subsistenceReturnTime <= subsistenceDepartureTime)
								{
									nlapiLogExecution('DEBUG', 'subsistencereturntime <= subsistencedeparttime');
									iteration = '0';
								}
								else
								{
									nlapiLogExecution('DEBUG', 'Same depart and return, same AM and PM, same times');
								}
							}
							else
							{
								if(subsistenceDepartureAMPM == 'AM' && subsistenceReturnAMPM == 'PM')
								{
									nlapiLogExecution('DEBUG','error no difference found', null);
								}
								else
								{
									if(subsistenceDepartureAMPM == 'PM' && subsistenceReturnAMPM == 'AM')
									{
										nlapiLogExecution('DEBUG','Depart PM return AM check', null);
										iteration = '0';
									}
									else
									{
										nlapiLogExecution('DEBUG','error no difference found', null);
									}
								}
							}	
						}

						nlapiLogExecution('DEBUG', 'dateChecker', dateChecker);
						nlapiLogExecution('DEBUG', 'step 1 -> step 2 datediffnumber', dateDifferenceNumber);

						// commit information to record
						record.setFieldValue('custrecord_expenseline_daa_depdate', subsistenceDepartureDate);
						record.setFieldValue('custrecord_expenseline_daa_deptime', subsistenceDepartureTime);
						record.setFieldValue('custrecord_expenseline_daa_retdate', subsistenceReturnDate);
						record.setFieldValue('custrecord_expenseline_daa_rettime', subsistenceReturnTime);
						record.setFieldValue('custrecord_return_ampm', subsistenceReturnAMPM);
						record.setFieldValue('custrecord_departure_ampm', subsistenceDepartureAMPM);
						record.setFieldValue('custrecord_expenseline_daa_trvreg', subsistenceUkTravel);
						record.setFieldValue('custrecord_exp_customer', expenditureCustomer);

						params["custpage_subsistencedatediffnumber"] = dateDifferenceNumber;

						break; // case 1 end

					case 2: // step 2 -> step 3

						var noProject = request.getParameter('projectoverride');
						nlapiLogExecution('DEBUG', 'projectoverride', noProject);

						if(noProject == 1)
						{
							iteration = 0;
						}
						else
						{
							var subsistenceUkTravel = request.getParameter('custpage_uktravel');
							var subsistenceDateDiff = request.getParameter('custpage_datediff');

							if(subsistenceUkTravel == 3)
							{
								var subsistenceUsState = request.getParameter('subsistencestate');
								nlapiLogExecution('DEBUG', 'subsistenceUsState', subsistenceUsState);
								params["custpage_subsistenceuscity"] = subsistenceUsState;

								// set US field value
								record.setFieldValue('custrecord_dda_usstate', subsistenceUsState);
							}
							if(subsistenceUkTravel == 1)
							{
								var subsistenceROWTravel = request.getParameter('subsistenceselectcountry');
								nlapiLogExecution('DEBUG', 'subsistenceselectcountry step 2 -> step 3 ', subsistenceROWTravel);
								params["custpage_rowtravel"] = subsistenceROWTravel;

								// set ROW field value

								record.setFieldValue('custrecord_dda_rowtravel', subsistenceROWTravel);
							}

							record.setFieldValue('custrecord_exp_reason', reason);
							record.setFieldValue('custrecord_exp_rechrgtocust', rechargeable);
							record.setFieldValue('custrecord_exp_project', projectDetail);


							params["custpage_subsistencedatediffnumber"] = subsistenceDateDiff;	    			
							nlapiLogExecution('DEBUG', 'step 2 -> step 3 datediffnumber', subsistenceDateDiff);
						}
						break; // case 2 end

					case 3: // step 3 -> step 4

						var subsistenceUkTravel = request.getParameter('custpage_uktravel');
						var subsistenceDateDiff = request.getParameter('custpage_datediff');	    			

						// have any meals been claimed for? 2 = no ** 1 = yes
						var subsistenceClaimedFor = request.getParameter('subsistenceclaimedfor');

						record.setFieldValue('custrecord_expenseline_daa_mealspaid', subsistenceClaimedFor);

						nlapiLogExecution('DEBUG', 'subsistenceClaimedFor', subsistenceClaimedFor);
						if(subsistenceUkTravel == 1)
						{
							var subsistenceROWTravel = request.getParameter('subsistenceselectcountry');
							nlapiLogExecution('DEBUG', 'subsistenceselectcountry  step 3 -> step 4', subsistenceROWTravel);
							params["custpage_rowtravel"] = subsistenceROWTravel;
						}

						if(subsistenceUkTravel == 3)
						{
							var subsistenceUSCity = request.getParameter('subsistenceuscity');
							nlapiLogExecution('DEBUG', 'subsistenceuscity step 3 -> step 4', subsistenceUSCity);
							var subsistenceUSState = request.getParameter('subsistenceusstate');
							nlapiLogExecution('DEBUG','subsistenceusstate',subsistenceUSState);
							params["custpage_usstate"] = subsistenceUSState;
							params["custpage_uscity"] = subsistenceUSCity;

							record.setFieldValue('custrecord_dda_uscity', subsistenceUSCity);

						}

						if(subsistenceClaimedFor == '2')
						{
							// if no jump to summary
							iteration = 4;
						}
						else
						{
							// do nothing
						}
						params["custpage_subsistencedatediffnumber"] = subsistenceDateDiff;

						break; // case 3 end

					case 4: // step 4 --> 5

						var subsistenceUkTravel = request.getParameter('custpage_uktravel');
						var subsistenceDateDiff = request.getParameter('custpage_datediff');
						var subsistenceMealsTrue = request.getParameter('custpage_mealstrue');

						var subsistenceBMealNumber = request.getParameter('subsistencebreakfastmealnumber');
						var subsistenceLMealNumber = request.getParameter('subsistencelunchmealnumber');
						var subsistenceDMealNumber = request.getParameter('subsistencedinnermealnumber');
						var subsistenceEMealNumber = request.getParameter('subsistenceeveningmealnumber');

						nlapiLogExecution('DEBUG', 'Uk travel', subsistenceUkTravel);
						nlapiLogExecution('DEBUG', 'subsistenceBMealNumber', subsistenceBMealNumber);
						nlapiLogExecution('DEBUG', 'subsistenceLMealNumber', subsistenceLMealNumber);
						nlapiLogExecution('DEBUG', 'subsistenceDMealNumber', subsistenceDMealNumber);
						nlapiLogExecution('DEBUG', 'subsistenceEMealNumber', subsistenceEMealNumber);

						// submit numbers to record

						record.setFieldValue('custrecord_expenseline_daa_brkfst', parseInt(subsistenceBMealNumber));
						record.setFieldValue('custrecord_expenseline_daa_lunch', parseInt(subsistenceLMealNumber));
						record.setFieldValue('custrecord_expenseline_daa_dinner', parseInt(subsistenceDMealNumber));
						record.setFieldValue('custrecord_expenseline_daa_evemeal', parseInt(subsistenceEMealNumber));

						iteration = parseInt(4);

						// subsistence
						if(subsistenceUkTravel == 1)
						{
							var subsistenceROWTravel = request.getParameter('subsistenceselectcountry');
							nlapiLogExecution('DEBUG', 'subsistenceselectcountry  step 5 -> step 6', subsistenceROWTravel);
							params["custpage_rowtravel"] = subsistenceROWTravel;
						}
						if(subsistenceUkTravel == 3)
						{
							var subsistenceUSCity = request.getParameter('subsistenceuscity');
							var subsistenceUSState = request.getParameter('subsistenceusstate');
							nlapiLogExecution('DEBUG','POST subsistenceusstate', subsistenceUSState);
							nlapiLogExecution('DEBUG', 'POST subsistenceuscity', subsistenceUSCity);
							params["custpage_usstate"] = subsistenceUSState;
							params["custpage_uscity"] = subsistenceUSCity;
						}

						params["custpage_subsistencebmealnumber"] = subsistenceBMealNumber;
						params["custpage_subsistencelmealnumber"] = subsistenceLMealNumber;
						params["custpage_subsistencedmealnumber"] = subsistenceDMealNumber;
						params["custpage_subsistenceemealnumber"] = subsistenceEMealNumber;
						params["custpage_subsistencedatediffnumber"] = subsistenceDateDiff;
						params["custpage_subsistencemealstrue"] = subsistenceMealsTrue;

						break; // case 5 end 

				} 	

				// submit the record
				var internalId = nlapiSubmitRecord(record, true);

				// change the value of line edit to internal ID - If this was a loaded record it will stay the same
				lineEdit = internalId;

				// put information from get into params
				params["custpage_subsistencereturnampm"] = subsistenceReturnAMPM;
				params["custpage_subsistencedepartampm"] = subsistenceDepartureAMPM;
				params["custpage_subsitencedepartdate"] = subsistenceDepartureDate;
				params["custpage_subsistencedeparttime"] = subsistenceDepartureTime;
				params["custpage_susbsistencereturndate"] = subsistenceReturnDate;
				params["custpage_susbsitencereturntime"] = subsistenceReturnTime;
				params["custpage_subsistencetravel"] = subsistenceUkTravel;

			} // subsistence end

			nlapiLogExecution('DEBUG', 'POST baseCurrency', baseCurrency);

			params["custpage_tranid"] = tranId;
			params["custpage_lineedit"] = lineEdit;
			params["custpage_expenselocation"] = expenseLocation;
			params["custpage_claimamount"] = claimAmount;
			params["custpage_date"] = date;
			params["custpage_expenditurecustomer"] = expenditureCustomer;
			params["custpage_basecurrencytext"] = baseCurrencyText;
			params["custpage_basecurrency"] = baseCurrency;
			params["custpage_employeelocId"] = employeeLocationId;	
			params["custpage_currentEmployee"] = currentEmployee;
			params["custpage_expenseCategory"] = expenseCategory;
			params["custpage_iterate"] = iteration;
			params["custpage_expensecategorytext"] = expenseCategoryText;

			//redirect to self and relaunch with the specified parameters
			nlapiSetRedirectURL('SUITELET', 'customscript_expensewizard', 'customdeploy_expensewizard' , false, params);
		}

		else if(assistant.getLastAction() == "cancel")
		{
			/* -== Cancel button ==- */

			var addNewScript = "";
			addNewScript = '<script type="text/javascript">'; 
			addNewScript += 'close(); </script>';		
			response.write(addNewScript);
			return true;
		}

		else if(assistant.getLastAction() == "back")
		{		
			/* -== Back button ==- */

			nlapiLogExecution('DEBUG', 'back function',null);

			// Get expense category and iteration
			var currentEmployee = request.getParameter('custpage_currentemployee');
			var expenseCategory = request.getParameter('custpage_expensecategory');
			var iteration = request.getParameter('custpage_iteration');
			var employeeLocationId = request.getParameter('custpage_employeelocationid');
			var baseCurrency = request.getParameter('custpage_basecurrency');
			var baseCurrencyText = request.getParameter('custpage_basecurrencytext');
			var expenseLocation = request.getParameter('custpage_expenselocation');
			var expenseCategoryText = request.getParameter('custpage_expensecategorytext');
			var lineEdit = request.getParameter('custpage_lineedit');
			var tranId = request.getParameter('custpage_tranid');

			var params = new Array();	

			if(expenseCategory == 4) // Mileage
			{
				//get information to pass
				var mileageVehType = request.getParameter('mileagevehicletype');
				var mileageDestination = request.getParameter('mileagedestination');
				var mileageOrigin = request.getParameter('mileageorigin');
				var mileageNoOfMiles = request.getParameter('mileagenoofmiles');
				var mileageBreakPoint = request.getParameter('custpage_mileagebreakpoint');
				var mileagetotalmiles = request.getParameter('custpage_mileagetotalmiles');
				var employeeLocation = request.getParameter('mileageemployeelocation');

				// putting information into array, this will then be added onto url
				params["custpage_mileageBreakPoint"] = mileageBreakPoint;
				params["custpage_vehicleId"] = mileageVehType;
				params["custpage_mileageDestination"] = mileageDestination;
				params["custpage_mileageOrigin"] = mileageOrigin;
				params["custpage_NoOfMiles"] = mileageNoOfMiles;
				params["custpage_mileageTotalmiles"] = mileagetotalmiles;
				params["custpage_employeeLocation"] = employeeLocation;
			}

			// sends the iteration back to the first iteration		
			iteration = 0;		

			// create the parameters to go back a step
			params["custpage_tranid"] = tranId;
			params["custpage_lineedit"] = lineEdit;
			params["custpage_expensecategorytext"] = expenseCategoryText;
			params["custpage_expenselocation"] = expenseLocation;
			params["custpage_basecurrencytext"] = baseCurrencyText;
			params["custpage_basecurrency"] = baseCurrency;
			params["custpage_employeelocId"] = employeeLocationId;	
			params["custpage_currentEmployee"] = currentEmployee;
			params["custpage_expenseCategory"] = expenseCategory;
			params["custpage_iterate"] = iteration;

			nlapiSetRedirectURL('SUITELET', 'customscript_expensewizard', 'customdeploy_expensewizard' , false, params);
		}
	}
}


/** 
 * EFT - Expense function types
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function general(assistant,iteration,lineEdit,baseCurrencyText)
{

	nlapiLogExecution('DEBUG','GENERAL');
	// Add step(s)
	assistant.addStep('step1','Enter customer details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}

				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1:	

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{			
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var paymentCurrency = assistant.addField('paymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var transactionCurrency = assistant.addField("transactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var transactionAmount = assistant.addField("transactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						transactionAmount.setDefaultValue(lineAmount);
						transactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						transactionCurrency.setDefaultValue('');
						transactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // Switch
	} // IF

	return assistant;
}


/**
 * mileage calculation
 * 
 * 3.4.19 - 28/01/2013 - mileage calculation based on 'thisfiscalyear' operator was incorrect  - should be 'within'
 * 3.4.20 - use fiscal year dates from location, if entered
 * 3.4.24 - 13/03/2013 - Fixed minor issue in label. it was incorrectly written as "Label", instead of "label" - SA
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @param employeeLocationId
 * @param currentEmployee
 * @param expenseLocation
 * @param employeeVehicleID
 * @param tranId
 * @returns
 */
function mileage(assistant,iteration,lineEdit,baseCurrencyText,employeeLocationId,currentEmployee, expenseLocation, employeeVehicleID, tranId, lineDate)
{
	assistant.addStep('step1','Enter Mileage details');
	assistant.addStep('step2','Finish');

	var expDateYear = null;
	var expDateMonth = null;
	var expdateday = null;
	var fiscalFromDay = null;
	var fiscalToDay = null;
	var fiscalFromMonth = null;
	var fiscalToMonth = null;
	var newFiscalFrom = null;
	var newFiscalTo = null;
try
{
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // *** MILEAGE STEP 1 ***

				nlapiLogExecution('DEBUG', 'Mileage tran id ' + tranId);

				assistant.setCurrentStep(assistant.getStep( "step1") );

				assistant.addFieldGroup("groupMileage", "Mileage Details");
				var mileageOrigin = assistant.addField("mileageorigin","text","Origin",null,"groupMileage").setMandatory(true);
				var mileageDestination = assistant.addField("mileagedestination", "text", "Destination", null,"groupMileage").setMandatory(true);
				nlapiLogExecution('DEBUG', 'employeeloc 463', employeeLocationId);
				if(employeeLocationId == 4)
				{
					var mileageNoOfMiles = assistant.addField("mileagenoofmiles", "integer", "Number of KMs", null,"groupMileage").setMandatory(true);
				}
				else
				{
					var mileageNoOfMiles = assistant.addField("mileagenoofmiles", "integer", "Number of miles", null,"groupMileage").setMandatory(true);
				}

				var mileageVehicleType = assistant.addField("mileagevehicletype", "select", "Vehicle type", "53","groupMileage").setMandatory(true);
				var employeeLocation = assistant.addField("mileageemployeelocation", "select", "Location", "customrecord_employeelocation","groupMileage").setMandatory(true).setDisplayType('inline').setDefaultValue(expenseLocation);
				// get previous miles on the current expense report
				var previousMiles = request.getParameter('custpage_currentExpenseMiles');
				// get total mileage

				var expSearchFilters = new Array();
				var expSearchColumns = new Array();
				// search filters
				
				expSearchFilters[0] = new nlobjSearchFilter('employee', null, 'is', currentEmployee);
				
				nlapiLogExecution('DEBUG', 'expSearchFilters[0]', expSearchFilters[0]);
				
				/***************************************************************************************************** 
				 * 3.4.19 - mileage calculation based on 'thisfiscalyear' operator was incorrect  - should be 'within'
				 * 3.4.20 - use fiscal year dates from location, if entered. If not, use 'thisfiscalyear'
				 * 3.4.21 - altered 3.4.20 so that the fiscal year range is ajusted depending on the expense date
				 * 3.4.22 -  Added code for automatic reset of FiscalFrom and FiscalTo field 
				 ****************************************************************************************************/
			
				// checking if values have been entered for dates
				if((fiscalFrom != null) && (fiscalTo != null))
				{
										
					//used to alter fiscal year range
					expDateYear = nlapiStringToDate(lineDate).getFullYear();
					//nlapiLogExecution('DEBUG', 'expDateYear...', expDateYear);
					
					expDateMonth = nlapiStringToDate(lineDate).getMonth() + 1;
					expdateday = nlapiStringToDate(lineDate).getDate();
					
					//used to put final dates together
					fiscalFromDay = nlapiStringToDate(fiscalFrom).getDate();
					fiscalToDay = nlapiStringToDate(fiscalTo).getDate();
					fiscalFromMonth = nlapiStringToDate(fiscalFrom).getMonth() + 1;
					fiscalToMonth = nlapiStringToDate(fiscalTo).getMonth() + 1;
					
					
					
					fiscalFromYear = nlapiStringToDate(fiscalFrom).getFullYear();
					fiscalToYear = nlapiStringToDate(fiscalTo).getFullYear();
					
					//altering fiscal years
					previousExpenseYear = parseInt(expDateYear) - 1;
					nextExpenseYear = parseInt(expDateYear) + 1;
			        currentExpenseYear = parseInt(expDateYear);
			        
					//if the fiscal years are the same there is only 1 possible date range ... 1st Jan -> 31st Dec. ('thisfiscalyear')
					if(fiscalFromYear == fiscalToYear)
					{
						expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', 'thisfiscalyear');
						
					}
					
					else
					//Otherwise years will be different, so use the fiscal dates for the year the expense was incurred
					{
						// reduce fiscal from year by 1
						if(expDateMonth	< fiscalFromMonth)
						{
							newFiscalFrom = fiscalFromDay + "/" + fiscalFromMonth + "/" + previousExpenseYear;
							newFiscalTo = fiscalToDay + "/" + fiscalToMonth + "/" + currentExpenseYear;
							
							expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', newFiscalFrom, newFiscalTo);
							
							nlapiLogExecution('DEBUG', 'newFiscalFrom 1', newFiscalFrom);
							nlapiLogExecution('DEBUG', 'newFiscalTo 1', newFiscalTo);
						}
						     // increase fiscal To year by 1
						else if(expDateMonth > fiscalFromMonth)
						{
							newFiscalFrom = fiscalFromDay + "/" + fiscalFromMonth + "/" + currentExpenseYear;
						    newFiscalTo = fiscalToDay + "/" + fiscalToMonth + "/" + nextExpenseYear;
						    
						    expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', newFiscalFrom, newFiscalTo);
						    
						    nlapiLogExecution('DEBUG', 'newFiscalFrom2', newFiscalFrom);
							nlapiLogExecution('DEBUG', 'newFiscalTo2', newFiscalTo);
						}
						
						else if (expDateMonth == fiscalFromMonth)
						{
							//reduces fiscalFrom year by 1
							if(expdateday < fiscalFromDay)
								
							{
								newFiscalFrom = fiscalFromDay + "/" + fiscalFromMonth + "/" + previousExpenseYear;
								newFiscalTo = fiscalToDay + "/" + fiscalToMonth + "/" + currentExpenseYear;
								
								expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', newFiscalFrom, newFiscalTo);
								
								nlapiLogExecution('DEBUG', 'newFiscalFrom3', newFiscalFrom);
								nlapiLogExecution('DEBUG', 'newFiscalTo3', newFiscalTo);
							}
							
							// if expdateday >= fiscalFromDay, increases fiscalTo year by 1 
							else 
							{
								newFiscalFrom = fiscalFromDay + "/" + fiscalFromMonth + "/" + currentExpenseYear;
						        newFiscalTo = fiscalToDay + "/" + fiscalToMonth + "/" + nextExpenseYear;
						    
						        expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', newFiscalFrom, newFiscalTo);
						        
						        nlapiLogExecution('DEBUG', 'newFiscalFrom4', newFiscalFrom);
								nlapiLogExecution('DEBUG', 'newFiscalTo4', newFiscalTo);
						    }
						}
							
							
					}
				}
				else
				{
					//if either of the fiscal year fields are empty use 'thisfiscalyear' (1st Jan ->  31st Dec)
					expSearchFilters[1] = new nlobjSearchFilter('expensedate', null, 'within', 'thisfiscalyear');
				}

				expSearchFilters[2] = new nlobjSearchFilter('tranid', null, 'doesnotcontain', tranId);
				// search columns
				expSearchColumns[0] = new nlobjSearchColumn('entity');
				expSearchColumns[1] = new nlobjSearchColumn('trandate');
				expSearchColumns[2] = new nlobjSearchColumn('custcol_mileagenoofmiles');
				expSearchColumns[3] = new nlobjSearchColumn('expensedate');
				
				// perform search
				var expSearchResults = nlapiSearchRecord('expensereport', null, expSearchFilters, expSearchColumns);

				var runningTotal = 0;
				if (expSearchResults != null) 
				{
					nlapiLogExecution('DEBUG', 'expSearchResults', expSearchResults.length); 
						
					// Totals number of miles from earch results
					for (var i = 0; i < expSearchResults.length; i++) 
					{
						nlapiLogExecution('debug', 'mileage tran date', expSearchResults[i].getValue('expensedate') + ' miles' + expSearchResults[i].getValue('custcol_mileagenoofmiles') );
						
						if(expSearchResults[i].getValue('custcol_mileagenoofmiles') > 0)
						{
								
							runningTotal += parseInt(expSearchResults[i].getValue('custcol_mileagenoofmiles'));
							nlapiLogExecution('DEBUG', 'I = ' + i + ', running Mileage', expSearchResults[i].getValue('custcol_numberofmiles')); 
						}    
					}// end for				                                                                                  
				} //end if 

				nlapiLogExecution('DEBUG', 'previousmiles', previousMiles);
				var totalMileage = runningTotal;
				// adding previous miles on the current expense report to the total miles
				if(lineEdit == 0)
				{
					totalMileage = totalMileage + parseInt(previousMiles);
				}
				else
				{
					// as this is an edit don't add previous miles as this has already been done.
				}
				nlapiLogExecution('DEBUG', 'LINE344 totalmileage', totalMileage);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);			

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

				//set the iteration
				iteration = 1;

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// rail fields
					var lineMileOrig = lineRecord.getFieldValue('custrecord_expenseline_mil_orig');
					var lineMileDest = lineRecord.getFieldValue('custrecord_expenseline_mil_dest');
					var lineMileNoOfMiles = lineRecord.getFieldValue('custrecord_expenseline_mil_noofmiles');
					var lineMileVehType = lineRecord.getFieldValue('custrecord_expenseline_mil_vehtype');

					mileageOrigin.setDefaultValue(lineMileOrig);
					mileageDestination.setDefaultValue(lineMileDest);
					mileageNoOfMiles.setDefaultValue(lineMileNoOfMiles);
					mileageVehicleType.setDefaultValue(lineMileVehType);


					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					mileageOrigin.setDefaultValue('');
					mileageDestination.setDefaultValue('');
					mileageNoOfMiles.setDefaultValue('');
					mileageVehicleType.setDefaultValue('');
				}

				// hidden fields			
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				var mileageTotalMilesHiddenField = assistant.addField('custpage_mileagetotalmiles', 'integer', 'hidden');
				mileageTotalMilesHiddenField.setDisplayType('hidden');
				mileageTotalMilesHiddenField.setDefaultValue(totalMileage);

				break;

			case 1: // STEP 2

				//get information from URL for passing to the second post

				var mileageCurrency = request.getParameter('custpage_mileagecurrency');
				var mileageVehicleType = request.getParameter('custpage_vehicleId');
				var mileageNoOfMiles = parseInt(request.getParameter('custpage_NoOfMiles'));
				var mileageDestination = request.getParameter('custpage_mileageDestination');
				var mileageOrigin = request.getParameter('custpage_mileageOrigin');
				var mileageBreakPoint = parseInt(request.getParameter('custpage_mileageBreakPoint'));
				var mileageTotalMiles = parseInt(request.getParameter('custpage_mileageTotalmiles'));
				var employeeLocation = request.getParameter('custpage_employeeLocation');

				// europe no veh override
				var euNoVeh = 0;

				// assistant building
				assistant.setCurrentStep(assistant.getStep("step2"));	

				// set the currency for mileage records
				var mileagePaymentCurrency = assistant.addField('mileagepaymentcurrency','text','Claim to be paid in',null).setDisplayType('hidden').setDefaultValue(baseCurrencyText);

				// only do this if the employee location is not europe
				if(employeeLocationId != 4)
				{
					var expSearchFilters = new Array();
					var expSearchColumns = new Array();
					// search filters
					expSearchFilters[0] = new nlobjSearchFilter('custrecord_employeelocation', null, 'is', employeeLocationId);
					expSearchFilters[1] = new nlobjSearchFilter('custrecord_mileage_vehicletype', null, 'is', mileageVehicleType);
					// search columns
					expSearchColumns[0] = new nlobjSearchColumn('custrecord_band1rate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_band2rate');

					// perform search
					var expSearchResults = nlapiSearchRecord('customrecord_mileagerates', null, expSearchFilters, expSearchColumns);

					var band1Rate = expSearchResults[0].getValue(expSearchColumns[0]);
					var band2Rate = expSearchResults[0].getValue(expSearchColumns[1]);

					//information for non-europe employees
					nlapiLogExecution('DEBUG', 'Veh type', mileageVehicleType);
					nlapiLogExecution('DEBUG', 'Band 1 Rate', band1Rate);
					nlapiLogExecution('DEBUG', 'Band 2 Rate', band2Rate);
					nlapiLogExecution('DEBUG', 'Breakpoint', mileageBreakPoint);
					nlapiLogExecution('DEBUG', 'totalmiles', mileageTotalMiles);
					nlapiLogExecution('DEBUG', 'mileage no of miles', mileageNoOfMiles);
				}

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{

					var claimAmount = 0;

					// mileage calculation					
					switch(parseInt(employeeLocationId))
					{
						case 1: // UK Staff
						case 2: // US Staff
						case 3: // CANADA STAFF	
						case 5: // SRI LANKA STAFF
						case 6: // SINGAPORE STAFF
						case 7: // SPARE ONE
						case 8: // SPARE TWO
						case 9: // SPARE THREE
						case 10:// SPARE FOUR
						case 11:// SPARE FIVE
						case 12:// SPARE SIX
						case 13:// SPARE SEVEN
						case 14:// SPARE EIGHT
						case 15:// SPARE NINE
						case 16:// SPARE TEN
						case 17:// SPARE ELEVEN
						case 18:// SPARE TWELVE
						case 19:// SPARE THIRTEEN
						case 20:// SPARE FOURTEEN

							switch(parseInt(mileageVehicleType))
							{
								case 1: // bicycle

									nlapiLogExecution('DEBUG', 'NON-EU Bicycle');

									// project fields
									assistant.addFieldGroup('groupproject','Project details');
									var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

									// reason field
									assistant.addFieldGroup('groupreason','Expenditure reason');
									var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
									var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

									// add select options to rechargeable field
									rechargeable.addSelectOption('','',true);
									rechargeable.addSelectOption('T', 'Yes');
									rechargeable.addSelectOption('F', 'No');	

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

									if(lineEdit != 0)
									{
										// load the line record
										var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

										// standard fields
										var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
										var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
										var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

										projectDetails.setDefaultValue(lineProject);
										expReason.setDefaultValue(lineReason);
										rechargeable.setDefaultValue(lineRC);			
									}
									else
									{
										expReason.setDefaultValue('');
									}

									var mileageClaim = mileageCalculation(mileageBreakPoint, band1Rate, band2Rate, mileageNoOfMiles, mileageTotalMiles);	
									claimAmount = mileageClaim;

									break;

								case 2: // motorcycle
								case 3: // van	
								case 4: // car

									nlapiLogExecution('DEBUG', 'NON-EU other vehicles');

									var expSearchFilters = new Array();
									var expSearchColumns = new Array();
									// search filters

									nlapiLogExecution('DEBUG', 'Employee is', currentEmployee);
									nlapiLogExecution('DEBUG', 'vehicle type', mileageVehicleType);

									expSearchFilters[0] = new nlobjSearchFilter('custrecord_vehicletype', null, 'is', mileageVehicleType);
									expSearchFilters[1] = new nlobjSearchFilter('custrecord_employee', null, 'is', currentEmployee);
									// search columns
									expSearchColumns[0] = new nlobjSearchColumn('custrecord_regno');

									var regNoField = 0;

									var expSearchResults = nlapiSearchRecord('customrecord_employeevehicle', null, expSearchFilters, expSearchColumns);
									if (expSearchResults != null) 
									{
										// project fields
										assistant.addFieldGroup('groupproject','Project details');
										var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

										// reason field
										assistant.addFieldGroup('groupreason','Expenditure reason');
										var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
										var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

										// add select options to rechargeable field
										rechargeable.addSelectOption('','',true);
										rechargeable.addSelectOption('T', 'Yes');
										rechargeable.addSelectOption('F', 'No');	

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

										var mileageClaim = mileageCalculation(mileageBreakPoint, band1Rate, band2Rate, mileageNoOfMiles, mileageTotalMiles);	
										claimAmount = mileageClaim;

										assistant.addFieldGroup('groupvehicle','Vehicle');
										regNoField = assistant.addField('mileagevehicleselection', 'select', 'Choose your vehicle', null, 'groupvehicle').setMandatory(true);

										if(lineEdit != 0)
										{
											// load the line record
											var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

											// standard fields
											var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
											var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
											var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

											projectDetails.setDefaultValue(lineProject);
											expReason.setDefaultValue(lineReason);
											rechargeable.setDefaultValue(lineRC);			
										}
										else
										{
											expReason.setDefaultValue('');
										}

										// Totals number of miles from search results
										for (var i = 0; i < expSearchResults.length; i++) 
										{  
											regNoField.addSelectOption(expSearchResults[i].getValue(expSearchColumns[0]),expSearchResults[i].getValue(expSearchColumns[0])); 
										}//; end for       
									}
									else
									{
										// if no results found do this
										euNoVeh = 1;
										assistant.addFieldGroup('groupnovehicle','No vehicle found');
										var noVehicle = assistant.addField("novehicle", 'label', 'No vehicle found, close the wizard pop up, save expense report', null, 'groupnovehicle');
										var noVehicleTwo = assistant.addField("novehicletwo", 'label', ' as a draft and create a vehicle record from the employee centre', null , 'groupnovehicle');
									}
							} // veh type switch

							break;

						case 4: // EUROPE STAFF

							switch(parseInt(mileageVehicleType))
							{
								case 1: // bicycle
									var expSearchFilters = new Array();
									var expSearchColumns = new Array();
									// search filters
									expSearchFilters[0] = new nlobjSearchFilter('custrecord_employeelocation', null, 'is', employeeLocationId);
									expSearchFilters[1] = new nlobjSearchFilter('custrecord_mileage_vehicletype', null, 'is', parseInt(mileageVehicleType));
									// search columns
									expSearchColumns[0] = new nlobjSearchColumn('custrecord_band1rate');
									expSearchColumns[1] = new nlobjSearchColumn('custrecord_band2rate');

									// perform search
									var expSearchResults = nlapiSearchRecord('customrecord_mileagerates', null, expSearchFilters, expSearchColumns);

									var band1Rate = expSearchResults[0].getValue(expSearchColumns[0]);
									var band2Rate = expSearchResults[0].getValue(expSearchColumns[1]);
									// bicycle mileage calculation
									var bicycleClaim = mileageCalculation(mileageBreakPoint, band1Rate, band2Rate, mileageNoOfMiles, mileageTotalMiles);
									claimAmount = bicycleClaim;

									// project fields
									assistant.addFieldGroup('groupproject','Project details');
									var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

									// reason field
									assistant.addFieldGroup('groupreason','Expenditure reason');
									var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
									var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

									// add select options to rechargeable field
									rechargeable.addSelectOption('','',true);
									rechargeable.addSelectOption('T', 'Yes');
									rechargeable.addSelectOption('F', 'No');	

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

									break;

								case 2: // motorcycle
								case 3: // van	
								case 4: // car

									var expSearchFilters = new Array();
									var expSearchColumns = new Array();
									// search filters

									nlapiLogExecution('DEBUG', 'Employee is', currentEmployee);
									nlapiLogExecution('DEBUG', 'vehicle type', mileageVehicleType);

									expSearchFilters[0] = new nlobjSearchFilter('custrecord_vehicletype', null, 'is', mileageVehicleType);
									expSearchFilters[1] = new nlobjSearchFilter('custrecord_employee', null, 'is', currentEmployee);
									// search columns
									expSearchColumns[0] = new nlobjSearchColumn('custrecord_regno');

									var regNoField = 0;

									var expSearchResults = nlapiSearchRecord('customrecord_employeevehicle', null, expSearchFilters, expSearchColumns);
									if (expSearchResults != null) 
									{
										// project fields
										assistant.addFieldGroup('groupproject','Project details');
										var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

										// reason field
										assistant.addFieldGroup('groupreason','Expenditure reason');
										var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
										var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

										// add select options to rechargeable field
										rechargeable.addSelectOption('','',true);
										rechargeable.addSelectOption('T', 'Yes');
										rechargeable.addSelectOption('F', 'No');	

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

										if(lineEdit != 0)
										{
											// load the line record
											var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

											// standard fields
											var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
											var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
											var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

											projectDetails.setDefaultValue(lineProject);
											expReason.setDefaultValue(lineReason);
											rechargeable.setDefaultValue(lineRC);			
										}
										else
										{
											expReason.setDefaultValue('');
										}

										//nlapiLogExecution('DEBUG', 'expresults', expSearchResults.length);
										nlapiLogExecution('DEBUG','expSearchResults', expSearchResults.length);
										var vehicleRegistration = expSearchResults[0].getValue(expSearchColumns[0]);
										nlapiLogExecution('DEBUG', 'registration number', vehicleRegistration);
										//nlapiLogExecution('DEBUG', 'vehicleenginesize', vehicleenginesize);

										assistant.addFieldGroup('groupvehicle','Vehicle');
										regNoField = assistant.addField('mileagevehicleselection', 'select', 'Choose your vehicle', null, 'groupvehicle').setMandatory(true);

										// Totals number of miles from search results
										for (var i = 0; i < expSearchResults.length; i++) 
										{  
											regNoField.addSelectOption(expSearchResults[i].getValue(expSearchColumns[0]),expSearchResults[i].getValue(expSearchColumns[0])); 
											var regExpSearch = expSearchResults[i].getValue(expSearchColumns[0]);
											nlapiLogExecution('DEBUG', 'LINE 569 regExpSearch', regExpSearch);
										}//; end for          
									} //end if 
									else
									{
										// if no results found do this
										euNoVeh = 1;
										var noVehMessage = assistant.addField("noveh", 'label', 'No vehicle found');
										var whiteSpaceVeh = assistant.addField("whitespaceveh", 'label', '');
										var noVehicle = assistant.addField("novehicle", 'label', '1. Close the wizard pop up', null, 'groupnovehicle');
										var noVehicleTwo = assistant.addField("novehicletwo", 'label', '2. Save draft expense report', null, 'groupnovehicle');
										var noVehicleThree = assistant.addField("novehiclethree", 'label', ' 3. Change role to employee centre', null , 'groupnovehicle');
										var noVehicleFour = assistant.addField("novehiclefour", 'label', ' 4. Create a vehicle', null , 'groupnovehicle');

									}
									break;
							}						
							break;		

							break;
					}

					var mileageNoEuropeHiddenField = assistant.addField("mileagenovehicle", "text", "hidden").setDisplayType('hidden').setDefaultValue(euNoVeh);
					var mileageCurrencyHiddenField = assistant.addField("mileagecurrency", "text", "hidden").setDisplayType('hidden').setDefaultValue(mileageCurrency);
					var mileageVehicleTypeHiddenField = assistant.addField("mileagevehtype", "text", "hidden").setDisplayType('hidden').setDefaultValue(mileageVehicleType);
					var mileageTotalMilesHiddenField = assistant.addField("mileagetotalmiles", "integer", "hidden").setDisplayType('hidden').setDefaultValue(mileageTotalMiles);
					var mileageClaimAmountHiddenField = assistant.addField("mileageclaimamount", "float", "hidden").setDisplayType('hidden').setDefaultValue(claimAmount);
					var mileageemployeeLocIdHiddenField = assistant.addField("mileageemployeelocation","text","hidden").setDisplayType('hidden').setDefaultValue(employeeLocationId);
					var mileageNoOfMilesHiddenField = assistant.addField("mileagenoofmiles", "integer", "hidden").setDisplayType('hidden').setDefaultValue(mileageNoOfMiles);
					var mileageOriginHiddenField = assistant.addField("mileageorigin", "text", "hidden").setDisplayType('hidden').setDefaultValue(mileageOrigin);
					var mileageDestinationHiddenfield = assistant.addField("mileagedestination", "text", "hidden").setDisplayType('hidden').setDefaultValue(mileageDestination);		    
					var mileageBreakPointHiddenField = assistant.addField("mileagebreakpoint", "integer", "hidden").setDisplayType('hidden').setDefaultValue(mileageBreakPoint);

				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				// hidden
				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 
		}
	}
}
catch(e)
{
	nlapiLogExecution('ERROR', 'message', e);
}
	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @param employeeLocationId
 * @returns
 */
function subsistence(assistant,iteration,lineEdit,baseCurrencyText, employeeLocationId)
{
	// Add steps
	assistant.addStep('step1','Enter subsistence details');
	assistant.addStep('step2','Enter claim details');
	assistant.addStep('step3','Any meals paid for?');
	assistant.addStep('step4','Meal Details');
	assistant.addStep('step5','Summary');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{

			//>> SUBSISTENCE STEP 1
			
			case 0:

				assistant = subsistenceStepOne(assistant,iteration,lineEdit);
				break;

				//>> SUBSISTENCE STEP 2
			case 1:

				assistant = subsistenceStepTwo(assistant,iteration,lineEdit);
				break;

				//>> SUSBSITENCE STEP 3
			case 2:

				assistant = subsistenceStepThree(assistant,iteration,lineEdit);
				break;

				//>> SUBSISTENCE STEP 4
			case 3:	

				assistant = subsistenceStepFour(assistant,iteration,lineEdit);
				break;	

				//>> SUBSISTENCE STEP 5
			case 4:

				assistant = subsistenceStepFive(assistant,iteration,lineEdit,baseCurrencyText,employeeLocationId)
				break;		
		}	
	}

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @returns
 * 
 * 3.4.23 - 12/03/2013 - Fixed minor issue in date, it was incorrectly written as "Date" - SA
 */
function subsistenceStepOne(assistant,iteration,lineEdit)
{
	try
	{
		// set step
		assistant.setCurrentStep(assistant.getStep("step1"));	

		nlapiLogExecution('DEBUG', 'Step 1', iteration);

		// Declare fields
		var expCustomer = null;

		// Departure fields
		assistant.addFieldGroup("groupsubsistencedeparture", "Departure");
		
		//3.4.23 - 12/03/2013 - Fixed minor issue in date, it was incorrectly written as "Date" - SA
		var subsistenceDepartureDate = assistant.addField("subsistencedeparturedate", "date", "Departure date", null,"groupsubsistencedeparture").setMandatory(true);
		var subsistenceDepartureTime = assistant.addField("subsistencedeparturetime", "select", "Departure time", null,"groupsubsistencedeparture").setMandatory(true).setLayoutType('startrow');
		var subsistenceAmPmDeparture = assistant.addField("subsistenceampmdeparture", "select", "", null, "groupsubsistencedeparture").setMandatory(true).setLayoutType('endrow');

		// Add AM PM Departure select options
		subsistenceAmPmDeparture.addSelectOption('AM', 'AM');
		subsistenceAmPmDeparture.addSelectOption('PM', 'PM');		

		// Return fields
		assistant.addFieldGroup("groupsubsistencereturn", "Return");
		
		//3.4.23 - 12/03/2013 - Fixed minor issue in date, it was incorrectly written as "Date" - SA
		var subsistenceReturnDate = assistant.addField("subsistencereturndate", "date", "Return date", null, "groupsubsistencereturn").setMandatory(true);
		var subsistenceReturnTime = assistant.addField("subsistencereturntime", "select", "Return time", null, "groupsubsistencereturn").setMandatory(true).setLayoutType('startrow');
		var subsistenceAmPmReturn = assistant.addField("subsistenceampmreturn", "select", "", null, "groupsubsistencereturn").setMandatory(true).setLayoutType('endrow');

		// Add AM PM return select options 
		subsistenceAmPmReturn.addSelectOption('AM', 'AM');
		subsistenceAmPmReturn.addSelectOption('PM', 'PM');

		// Travel fields
		assistant.addFieldGroup("groupsubsistencetravel", "Which region are you travelling in?");
		var subsistenceTravelROW = assistant.addField("subsistenceradiobutton", "radio", "ROW", '1',"groupsubsistencetravel").setLayoutType('midrow');
		var subsistenceTravelUk = assistant.addField("subsistenceradiobutton", "radio", "UK", '2',"groupsubsistencetravel").setLayoutType('midrow');
		var subsistenceTravelUs = assistant.addField("subsistenceradiobutton", "radio", "US", '3',"groupsubsistencetravel").setLayoutType('endrow');

		// search for the times specificed in the custom record subsistencetime
		var timeSearchColumns = new Array();

		// search columns
		timeSearchColumns[0] = new nlobjSearchColumn('custrecord_subsistencetime');
		timeSearchColumns[1] = new nlobjSearchColumn('internalid');
		timeSearchColumns[2] = timeSearchColumns[1].setSort();

		// do the search
		var timeSearchResults = nlapiSearchRecord('customrecord_subsistencetime', null, null, timeSearchColumns);

		// populate the select fields with the time search results
		if (timeSearchResults != null) 
		{						
			for (var i = 0; i < timeSearchResults.length; i++) 
			{  
				subsistenceDepartureTime.addSelectOption(timeSearchResults[i].getValue(timeSearchColumns[0]),timeSearchResults[i].getValue(timeSearchColumns[0])); 
				subsistenceReturnTime.addSelectOption(timeSearchResults[i].getValue(timeSearchColumns[0]),timeSearchResults[i].getValue(timeSearchColumns[0])); 
			} // end for          
		} // end if 

		else
		{
			// if no results found do this
		}

		//increment implementation for next step
		iteration = 1;

		expCustomer = addCustomerField(expCustomer, assistant);

		if(lineEdit != 0)
		{
			// load the line record
			var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

			var lineDepartureDate = lineRecord.getFieldValue('custrecord_expenseline_daa_depdate');
			var lineDepartureTime = lineRecord.getFieldValue('custrecord_expenseline_daa_deptime');
			var lineAmPmDeparture = lineRecord.getFieldValue('custrecord_departure_ampm');

			var lineReturnDate = lineRecord.getFieldValue('custrecord_expenseline_daa_retdate');
			var lineReturnTime = lineRecord.getFieldValue('custrecord_expenseline_daa_rettime');
			var lineAmPmReturn = lineRecord.getFieldValue('custrecord_return_ampm');

			var lineTravelRegion = lineRecord.getFieldValue('custrecord_expenseline_daa_trvreg');

			subsistenceDepartureDate.setDefaultValue(lineDepartureDate);
			subsistenceDepartureTime.setDefaultValue(lineDepartureTime);
			subsistenceAmPmDeparture.setDefaultValue(lineAmPmDeparture);

			subsistenceReturnDate.setDefaultValue(lineReturnDate);
			subsistenceReturnTime.setDefaultValue(lineReturnTime);
			subsistenceAmPmReturn.setDefaultValue(lineAmPmReturn);

			assistant.getField('subsistenceradiobutton', lineTravelRegion).setDefaultValue(lineTravelRegion);

			// standard fields
			var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

			expCustomer.setDefaultValue(lineCustomer);
		}
		else
		{
			subsistenceDepartureDate.setDefaultValue('');
			subsistenceDepartureTime.setDefaultValue('');
			subsistenceAmPmDeparture.setDefaultValue('');

			subsistenceReturnDate.setDefaultValue('');
			subsistenceReturnTime.setDefaultValue('');
			subsistenceAmPmReturn.setDefaultValue('');

			// sets travel to ROW =]
			assistant.getField('subsistenceradiobutton', '1' ).setDefaultValue( '1' );
		}

		// hidden fields			
		var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
		iterationHiddenField.setDisplayType('hidden');		
		iterationHiddenField.setDefaultValue(iteration);
	}
	catch(e)
	{
		nlapiLogExecution('debug', 'subsistenceStepOne ', e);
	}
	
	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @returns
 */
function subsistenceStepTwo(assistant,iteration,lineEdit)
{

	try
	{
		
	nlapiLogExecution('DEBUG', 'Step 2', iteration);

	//Set the step
	assistant.setCurrentStep(assistant.getStep("step2"));	

	// get parameters for the next post
	var subsistenceDepartureDate = request.getParameter('custpage_subsitencedepartdate');
	var subsistenceDepartureTime = request.getParameter('custpage_subsistencedeparttime');
	var subsistenceReturnDate = request.getParameter('custpage_susbsistencereturndate');
	var subsistenceReturnTime = request.getParameter('custpage_susbsitencereturntime');
	var subsistenceUkTravel = request.getParameter('custpage_subsistencetravel');
	var subsistenceDateDiff = request.getParameter('custpage_subsistencedatediffnumber');
	var subsistenceReturnAMPM = request.getParameter('custpage_subsistencereturnampm');
	var subsistenceDepartureAMPM = request.getParameter('custpage_subsistencedepartampm');
	var subsistenceCurrency = request.getParameter('custpage_subsistencecurrency');
	var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

	nlapiLogExecution('DEBUG', 'step 2 subsistencedatediff', subsistenceDateDiff);

	// hidden fields for the information that needs to be passed to summary

	var subsistenceDepartureDateHidden = assistant.addField('subsistencedeparturedate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureDate);
	var subsistenceDepartureTimeHidden = assistant.addField('subsistencedeparturetime', 'text','hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureTime);
	var subsistenceReturnDateHidden = assistant.addField('subsistencereturndate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnDate);
	var subsistenceReturnTimeHidden = assistant.addField('subsistencereturntime', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnTime);
	var subsistenceReturnAMPMHidden = assistant.addField('subsistenceampmreturn', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnAMPM);
	var subsistenceDepartureAMPMHidden = assistant.addField('subsistenceampmdeparture', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureAMPM);
	var subsistenceCurrencyHidden = assistant.addField('subsistencecurrency', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceCurrency);

	// load the record
	var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

	//set iteration to 2
	iteration = 2;

	// declare arrays
	var projectSearchFilters = new Array();
	var projectSearchColumns = new Array();

	// search filters
	projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
	projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
	projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

	// search columns
	projectSearchColumns[0] = new nlobjSearchColumn('entityid');
	projectSearchColumns[1] = new nlobjSearchColumn('internalid');
	// do search
	var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

	// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
	var projectoverride = 0;

	// if their is something in project search....
	if (projectSearchResults)
	{

		//Switch that adds different select options based on the area of travel determined by the radio button selection in step 1
		switch (parseInt(subsistenceUkTravel))
		{
			case 1: // ROW

				assistant.addFieldGroup("groupsubsistencec ountry", "Where are you travelling?");

				// add field for country selection
				var subsistenceTravel = assistant.addField("subsistenceselectcountry", "select", "", null,"groupsubsistencecountry").setLayoutType('midrow').setMandatory(true);

				// initiate the arrays for the search
				var travelSearchFilters = new Array();
				var travelSearchColumns = new Array();
				// search filters		
				travelSearchFilters[0] = new nlobjSearchFilter('custrecord_displayonselect', null, 'is', "T");
				// search columns
				travelSearchColumns[0] = new nlobjSearchColumn('name');
				travelSearchColumns[1] = new nlobjSearchColumn('internalid');

				// Do the search
				var tavelSearchResults = nlapiSearchRecord('customrecord_perdiemrates', null, travelSearchFilters, travelSearchColumns);

				// populate the travel field with the different countrys from the search						
				for (var i = 0; i < tavelSearchResults.length; i++)
				{
					subsistenceTravel.addSelectOption(tavelSearchResults[i].getValue(travelSearchColumns[1]), tavelSearchResults[i].getValue(travelSearchColumns[0]));
				}

				var lineSubsistenceTravel = lineRecord.getFieldValue('custrecord_dda_rowtravel');

				subsistenceTravel.setDefaultValue(lineSubsistenceTravel);

				break;

			case 2: // UK

				// this should be skipped for UK
				break;

			case 3: // US

				// Add field group for us state
				assistant.addFieldGroup("groupsubsistencestate", "Which State are you travelling in?");
				// us state selection field
				var subsistenceState = assistant.addField("subsistencestate", "select", "Select state", null, "groupsubsistencestate").setMandatory(true);	

				// Declare arrays for search
				var stateSearchFilters = new Array();
				var stateSearchColumns = new Array();
				// search columns
				stateSearchColumns[0] = new nlobjSearchColumn('name');
				stateSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do the search
				var stateSearchResults = nlapiSearchRecord('customrecord_usstates', null, stateSearchFilters, stateSearchColumns);

				// populate the state field based on stateSearchResults
				for (var i = 0; i < stateSearchResults.length; i++)
				{
					subsistenceState.addSelectOption(stateSearchResults[i].getValue(stateSearchColumns[1]), stateSearchResults[i].getValue(stateSearchColumns[0]));
				}

				var lineUSState = lineRecord.getFieldValue('custrecord_dda_usstate');

				subsistenceState.setDefaultValue(lineUSState);

				break;							
		}

		// project fields
		assistant.addFieldGroup('groupproject','Project details');
		var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

		// reason field
		assistant.addFieldGroup('groupreason','Expenditure reason');
		var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
		var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

		// add select options to rechargeable field
		rechargeable.addSelectOption('','',true);
		rechargeable.addSelectOption('Yes', 'Yes');
		rechargeable.addSelectOption('No', 'No');	

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

		// ctDetails.addSelectOption(projectSearchResults[i].getValue(projectSearchColumns[1]),projectSearchResults[i].getValue(projectSearchColumns[0]),false);

		var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
		var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
		var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

		projectDetails.setDefaultValue(lineProject);
		expReason.setDefaultValue(lineReason);
		rechargeable.setDefaultValue(lineRC);			

		//for
	} //if
	else
	{
		var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
		projectoverride = 1;			
	}	

	var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
	var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

	nlapiLogExecution('DEBUG', 'Subsistence step 2 projectoverride', projectoverride);
	// The value of the radio button
	var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
	subsistenceUkTravelHidden.setDisplayType('hidden');
	subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel);

	// iteration number
	var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
	iterationHiddenField.setDisplayType('hidden');		
	iterationHiddenField.setDefaultValue(iteration);	

	// the difference between the 2 dates that is calcuated in POST step 1
	var dateDiffHiddenField = assistant.addField('custpage_datediff', 'text', 'hidden');
	dateDiffHiddenField.setDisplayType('hidden');
	dateDiffHiddenField.setDefaultValue(subsistenceDateDiff);

	return assistant;
	}
	catch(e)
	{
		nlapiLogExecution('debug', 'subsistenceStepThree ', e);
	}
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @returns
 */
function subsistenceStepThree(assistant,iteration,lineEdit)
{
	try
	{
	
	nlapiLogExecution('DEBUG', 'Step 3', iteration);

	//set assistant to step 3
	assistant.setCurrentStep(assistant.getStep("step3"));

	// get parameters from the URl for future information
	var subsistenceDepartureDate = request.getParameter('custpage_subsitencedepartdate');
	var subsistenceDepartureTime = request.getParameter('custpage_subsistencedeparttime');
	var subsistenceReturnDate = request.getParameter('custpage_susbsistencereturndate');
	var subsistenceReturnTime = request.getParameter('custpage_susbsitencereturntime');
	var subsistenceUkTravel = request.getParameter('custpage_subsistencetravel');
	var subsistenceDateDiff = request.getParameter('custpage_subsistencedatediffnumber');
	var subsistenceReturnAMPM = request.getParameter('custpage_subsistencereturnampm');
	var subsistenceDepartureAMPM = request.getParameter('custpage_subsistencedepartampm');
	var subsistenceCurrency = request.getParameter('custpage_subsistencecurrency');
	var subsistenceReason = request.getParameter('custpage_expenditurereason');
	var subsistenceProjectDetail = request.getParameter('custpage_projectdetail');
	var subsistenceRechargeable = request.getParameter('custpage_rechargeable');

	// hidden fields for the information that needs to be passed to summary after step 6			
	var subsistenceDepartureDateHidden = assistant.addField('subsistencedeparturedate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureDate);
	var subsistenceDepartureTimeHidden = assistant.addField('subsistencedeparturetime', 'text','hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureTime);
	var subsistenceReturnDateHidden = assistant.addField('subsistencereturndate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnDate);
	var subsistenceReturnTimeHidden = assistant.addField('subsistencereturntime', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnTime);
	var subsistenceReturnAMPMHidden = assistant.addField('subsistenceampmreturn', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnAMPM);
	var subsistenceDepartureAMPMHidden = assistant.addField('subsistenceampmdeparture', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureAMPM);
	var subsistenceCurrencyHidden = assistant.addField('subsistencecurrency', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceCurrency);
	var subsistenceReasonHidden = assistant.addField('expenditurereason', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReason);
	var subsistenceProjectDetailHidden = assistant.addField('projectdetail', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceProjectDetail);
	var subsistenceRechargeableHidden = assistant.addField('rechargeable', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceRechargeable);

	// load the record
	var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

	//set the iteration to 3 for next step
	iteration = 3;

	//Switch that adds different select options based on the area of travel determined by the radio button selection in step 1
	switch (parseInt(subsistenceUkTravel))
	{
		case 1: // ROW

			// gets the parameter to find out the country that was travelled 
			var  subsistenceROWTravel = request.getParameter('custpage_rowtravel');

			// ask if any meals have been claimed for
			assistant.addFieldGroup("groupsubsistenceclaimedfor", "Have any of your meals been paid for by other means - e.g. by yourself through receipted client entertaining, by another employee, by another contact or company, etc?");
			var subsistenceClaimedFor = assistant.addField("subsistenceclaimedfor", "select", null, null, "groupsubsistenceclaimedfor").setMandatory(true);

			// add select options to meals claimed for
			subsistenceClaimedFor.addSelectOption(1, 'Yes');
			subsistenceClaimedFor.addSelectOption(2, 'No');				

			// hidden field for the country they are travelling in
			var subsistenceROWTravelHidden = assistant.addField('subsistenceselectcountry', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceROWTravel);

			break;

		case 2: // UK			

			// ask if any meals have been claimed for
			assistant.addFieldGroup("groupsubsistenceclaimedfor", "Have any of your meals been paid for by other means - e.g. by yourself through receipted client entertaining, by another employee, by another contact or company, etc?");
			var subsistenceClaimedFor = assistant.addField("subsistenceclaimedfor", "select", null, null, "groupsubsistenceclaimedfor").setMandatory(true);

			// add select options to meals being claimed for
			subsistenceClaimedFor.addSelectOption(1, 'Yes');
			subsistenceClaimedFor.addSelectOption(2, 'No');

			break;

		case 3: // US

			// get the state specified in step 2
			var usstate = request.getParameter('custpage_subsistenceuscity');

			var citySearchFilters = new Array();
			var cityearchColumns = new Array();
			// search filters		
			citySearchFilters[0] = new nlobjSearchFilter('custrecord_citystate', null, 'anyof', usstate);
			citySearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
			//citySearchFilters[1] = new nlobjSearchFilter('id', null, 'equalto', '2699');
			// search columns
			cityearchColumns[0] = new nlobjSearchColumn('custrecord_cityname');
			cityearchColumns[1] = new nlobjSearchColumn('internalid');
			cityearchColumns[2] = cityearchColumns[0].setSort(); // sort columns by internal ID

			// perform the search
			var citySearchResults = nlapiSearchRecord('customrecord_usacities', null, citySearchFilters, cityearchColumns);

			assistant.addFieldGroup("groupsubsistenceuscity", "Which city did you stay in?");
			var subsistenceUsCity = assistant.addField("subsistenceuscity", "select", null, null, "groupsubsistenceuscity").setMandatory(true);

			// populate the city field
			for (var i = 0; i < citySearchResults.length; i++)
			{
				subsistenceUsCity.addSelectOption(citySearchResults[i].getValue(cityearchColumns[1]), citySearchResults[i].getValue(cityearchColumns[0]));
			}

			//ask if any meals have been claimed for
			assistant.addFieldGroup("groupsubsistenceclaimedfor", "Have any of your meals been paid for by other means - e.g. by yourself through receipted client entertaining, by another employee, by another contact or company, etc?");
			var subsistenceClaimedFor = assistant.addField("subsistenceclaimedfor", "select", null, null, "groupsubsistenceclaimedfor").setMandatory(true);

			// add select options to meals being claimed for
			subsistenceClaimedFor.addSelectOption(1, 'Yes');
			subsistenceClaimedFor.addSelectOption(2, 'No');

			// add a hidden field to the US state
			var subsistenceUSState = assistant.addField('subsistenceusstate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(usstate);

			break;	  
	}

	var lineClaimedFor = lineRecord.getFieldValue('custrecord_expenseline_daa_mealspaid');

	subsistenceClaimedFor.setDefaultValue(lineClaimedFor);		

	//iteration hidden field
	var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
	iterationHiddenField.setDisplayType('hidden');		
	iterationHiddenField.setDefaultValue(iteration);
	// radio button hidden field
	var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
	subsistenceUkTravelHidden.setDisplayType('hidden');
	subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel); 
	// date difference hidden field
	var dateDiffHiddenField = assistant.addField('custpage_datediff', 'text', 'hidden');
	dateDiffHiddenField.setDisplayType('hidden');
	dateDiffHiddenField.setDefaultValue(subsistenceDateDiff);

	return assistant;
	
	}
    catch(e)
  {
	nlapiLogExecution('debug', 'subsistenceStepthree ', e);
  }
}

/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @returns
 */
function subsistenceStepFour(assistant,iteration,lineEdit)
{
	
	try
	{
	nlapiLogExecution('DEBUG', 'Step 4', iteration);

	//set assistant to step 5
	assistant.setCurrentStep(assistant.getStep("step4"));

	//set the iteration for the next step
	iteration = 4;

	// get the parameters from the last step
	var subsistenceDepartureDate = request.getParameter('custpage_subsitencedepartdate');
	var subsistenceDepartureTime = request.getParameter('custpage_subsistencedeparttime');
	var subsistenceReturnDate = request.getParameter('custpage_susbsistencereturndate');
	var subsistenceReturnTime = request.getParameter('custpage_susbsitencereturntime');
	var subsistenceUkTravel = request.getParameter('custpage_subsistencetravel');
	var subsistenceDateDiff = request.getParameter('custpage_subsistencedatediffnumber');
	var subsistenceReturnAMPM = request.getParameter('custpage_subsistencereturnampm');
	var subsistenceDepartureAMPM = request.getParameter('custpage_subsistencedepartampm');
	var subsistenceCurrency = request.getParameter('custpage_subsistencecurrency');
	var subsistenceReason = request.getParameter('custpage_expenditurereason');
	var subsistenceProjectDetail = request.getParameter('custpage_projectdetail');
	var subsistenceRechargeable = request.getParameter('custpage_rechargeable');

	var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

	// if selected country of travel is ROW...
	if(subsistenceUkTravel == 1)
	{
		// get country of travel for ROW
		var  subsistenceROWTravel = request.getParameter('custpage_rowtravel');

		// hidden field for the country they are travelling in
		var subsistenceROWTravelHidden = assistant.addField('subsistenceselectcountry', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceROWTravel);
	}

	// if selected country of travel is USA...
	if(subsistenceUkTravel == 3)
	{
		var subsistenceUSCity = request.getParameter('custpage_uscity');
		var subsistenceUSState = request.getParameter('custpage_usstate');
		var subsistenceUSCityHidden = assistant.addField('subsistenceuscity', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceUSCity);
		var subsistenceUSStateHidden = assistant.addField('subsistenceusstate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceUSState);
	} 	

	// number of meals being claimed for debug check

	assistant.addFieldGroup("groupsubsistencemealamounts", "Please record how many of each meal type have been paid for by other means during your trip");

	// adds information to the screen
	var subsistenceBreakfastMealNumber = assistant.addField("subsistencebreakfastmealnumber", "integer", "Breakfast: ",null,"groupsubsistencemealamounts").setMandatory(true);
	var subsistenceLunchMealNumber = assistant.addField("subsistencelunchmealnumber", "integer", "Lunch: ",null,"groupsubsistencemealamounts").setMandatory(true);
	var subsistenceDinnerfastMealNumber = assistant.addField("subsistencedinnermealnumber", "integer", "Dinner: ",null,"groupsubsistencemealamounts").setMandatory(true);
	var subsistenceEveningMealNumber = assistant.addField("subsistenceeveningmealnumber", "integer", "Late meal: ",null,"groupsubsistencemealamounts").setMandatory(true);

	// set the values in the above fields

	var lineBnumber = lineRecord.getFieldValue('custrecord_expenseline_daa_brkfst');
	var lineLnumber = lineRecord.getFieldValue('custrecord_expenseline_daa_lunch');
	var lineDnumber = lineRecord.getFieldValue('custrecord_expenseline_daa_dinner');
	var lineEnumber = lineRecord.getFieldValue('custrecord_expenseline_daa_evemeal');

	// sets the default to 0 as we can't default in the traditional sense
	if(lineBnumber <= 0)
	{
		lineBnumber = 0;
	}
	if(lineLnumber <= 0)
	{
		lineLnumber = 0;
	}
	if(lineDnumber <= 0)
	{
		lineDnumber = 0;
	}
	if(lineEnumber <= 0)
	{
		lineEnumber = 0;
	}

	subsistenceBreakfastMealNumber.setDefaultValue(lineBnumber);		
	subsistenceLunchMealNumber.setDefaultValue(lineLnumber);		
	subsistenceDinnerfastMealNumber.setDefaultValue(lineDnumber);		
	subsistenceEveningMealNumber.setDefaultValue(lineEnumber);		

	// hidden fields	
	var subsistenceDepartureDateHidden = assistant.addField('subsistencedeparturedate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureDate);
	var subsistenceDepartureTimeHidden = assistant.addField('subsistencedeparturetime', 'text','hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureTime);
	var subsistenceReturnDateHidden = assistant.addField('subsistencereturndate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnDate);
	var subsistenceReturnTimeHidden = assistant.addField('subsistencereturntime', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnTime);
	var subsistenceReturnAMPMHidden = assistant.addField('subsistenceampmreturn', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnAMPM);
	var subsistenceDepartureAMPMHidden = assistant.addField('subsistenceampmdeparture', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureAMPM);
	var subsistenceCurrencyHidden = assistant.addField('subsistencecurrency', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceCurrency);
	var subsistenceReasonHidden = assistant.addField('expenditurereason', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReason);
	var subsistenceProjectDetailHidden = assistant.addField('projectdetail', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceProjectDetail);
	var subsistenceRechargeableHidden = assistant.addField('rechargeable', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceRechargeable);

	var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
	iterationHiddenField.setDisplayType('hidden');		
	iterationHiddenField.setDefaultValue(iteration);

	var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
	subsistenceUkTravelHidden.setDisplayType('hidden');
	subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel); 

	var dateDiffHiddenField = assistant.addField('custpage_datediff', 'text', 'hidden');
	dateDiffHiddenField.setDisplayType('hidden');
	dateDiffHiddenField.setDefaultValue(subsistenceDateDiff);

	var mealsTrueHiddenField = assistant.addField('custpage_mealstrue', 'text', 'hidden');
	mealsTrueHiddenField.setDisplayType('hidden');
	mealsTrueHiddenField.setDefaultValue(1);

	return assistant;
	
    }
    catch(e)
    {
	nlapiLogExecution('debug', 'subsistenceStepFour ', e);
    }
}


/******
 * History: 3.4.10 - Added breakfast rate addition to the breakfast UK check
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @param employeeLocationId
 * @returns
 * 
 * 3.4.24 - 13/03/2013 - Fixed minor issue in label. it was incorrectly written as "Label", instead of "label" - SA
 */
function subsistenceStepFive(assistant,iteration,lineEdit, baseCurrencyText,employeeLocationId)
{
	try
	{
	nlapiLogExecution('DEBUG', 'Step 5', iteration);

	// get parameters from the last step
	var subsistenceMealsClaimedFor = request.getParameter('custpage_subsistenceclaimedfor');
	var subsistenceDepartureDate = request.getParameter('custpage_subsitencedepartdate');
	var subsistenceDepartureTime = request.getParameter('custpage_subsistencedeparttime');
	var subsistenceReturnDate = request.getParameter('custpage_susbsistencereturndate');
	var subsistenceReturnTime = request.getParameter('custpage_susbsitencereturntime');
	var subsistenceUkTravel = request.getParameter('custpage_subsistencetravel');
	var subsistenceDateDiff = request.getParameter('custpage_subsistencedatediffnumber');
	var subsistenceReturnAMPM = request.getParameter('custpage_subsistencereturnampm');
	var subsistenceDepartureAMPM = request.getParameter('custpage_subsistencedepartampm');
	var subsistenceMealsTrue = request.getParameter('custpage_subsistencemealstrue');
	var subsistenceCurrency = request.getParameter('custpage_subsistencecurrency');
	var subsistenceReason = request.getParameter('custpage_expenditurereason');
	var subsistenceProjectDetail = request.getParameter('custpage_projectdetail');

	var subsistenceRechargeable = request.getParameter('custpage_rechargeable');

	//nlapiLogExecution('DEBUG', 'subsistence b meal number', subsistenceBMealNumber);
	nlapiLogExecution('DEBUG', 'DATE DIFF', subsistenceDateDiff);

	//set assistant to step 5
	assistant.setCurrentStep(assistant.getStep("step5"));

	//set the subsistence record currency
	var subsistencePaymentCurrency = assistant.addField('subsistencepaymentcurrency','text','Claim to be paid in',null).setDisplayType('hidden').setDefaultValue(baseCurrencyText);

	// hidden fields for the information that needs to be passed to POST step 6
	var subsistenceDepartureDateHidden = assistant.addField('subsistencedeparturedate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureDate);
	var subsistenceDepartureTimeHidden = assistant.addField('subsistencedeparturetime', 'text','hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureTime);
	var subsistenceReturnDateHidden = assistant.addField('subsistencereturndate', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnDate);
	var subsistenceReturnTimeHidden = assistant.addField('subsistencereturntime', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnTime);
	var subsistenceReturnAMPMHidden = assistant.addField('subsistenceampmreturn', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReturnAMPM);
	var subsistenceDepartureAMPMHidden = assistant.addField('subsistenceampmdeparture', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDepartureAMPM);
	var subsistenceCurrencyHidden = assistant.addField('subsistencecurrency', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceCurrency);
	var subsistenceReasonHidden = assistant.addField('expenditurereason', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceReason);
	var subsistenceProjectDetailHidden = assistant.addField('projectdetail', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceProjectDetail);
	var subsistenceRechargeableHidden = assistant.addField('rechargeable', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceRechargeable);

	//full days calculation
	switch(parseInt(subsistenceUkTravel))
	{

		case 3: // US

			nlapiLogExecution('DEBUG', 'step 6 USA employeeLocationId', employeeLocationId);

			// get the parameters for us city and state
			var usCity = request.getParameter('custpage_uscity');
			var usState = request.getParameter('custpage_usstate');

			nlapiLogExecution('DEBUG', 'step 6 US city', usCity);
			nlapiLogExecution('DEBUG', 'step 6 US state', usState);

			// finds out wether or not the city is major
			var usSearchFilters = new Array();
			var usSearchColumns = new Array();

			usSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', usCity);
			//usSearchFilters[1] = new nlobjSearchFilter('custrecord_citystate', null, 'is', usState);

			usSearchColumns[0] = new nlobjSearchColumn('custrecord_majorcity');

			var usSearchResults = nlapiSearchRecord('customrecord_usacities', null, usSearchFilters, usSearchColumns);	    			
			nlapiLogExecution('DEBUG', 'usSearchResults', usSearchResults.length);

			var majorCity = usSearchResults[0].getValue(usSearchColumns[0]);
			nlapiLogExecution('DEBUG', 'majorcity', majorCity);

			//gets the internal ids of US major city and US other on per diem table
			var usPerDiemFilters = new Array();
			var usPerDiemColumns = new Array();

			if(majorCity == 'T')
			{
				usPerDiemFilters[0] = new nlobjSearchFilter('name', null, 'is', 'US Major Cities');
			}
			else
			{
				if(majorCity == 'F')
				{
					usPerDiemFilters[0] = new nlobjSearchFilter('name', null, 'is', 'US Other');
				}
			}

			usPerDiemColumns[0] = new nlobjSearchColumn('internalid');

			var usPerDiemSearchResults = nlapiSearchRecord('customrecord_perdiemrates', null, usPerDiemFilters, usPerDiemColumns);	    			

			var perDiemInternalID = usPerDiemSearchResults[0].getValue(usPerDiemColumns[0]);

			//create search filters and columns array
			var expSearchFilters = new Array();
			var expSearchColumns = new Array();

			// search filters
			if(majorCity == 'T')
			{
				expSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', perDiemInternalID);
			}
			else
			{
				if (majorCity == 'F') 
				{
					expSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', perDiemInternalID);
				}
			}

			//determine which columns to search and get the rates based on country
			switch(parseInt(employeeLocationId))
			{
				case 1: // Uk staff			

					nlapiLogExecution('DEBUG', 'UK & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_ukfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_uktenrate'); 
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_stg'); 

					break; // case 1 end

				case 2: // US staff

					nlapiLogExecution('DEBUG', 'US & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_usfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_ustenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_usd'); 

					break; // case 2 end

				case 3: // can staff

					nlapiLogExecution('DEBUG', 'Can & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_canfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_cantenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_cad'); 

					break; // case 3 end

				case 4: // europe staff

					nlapiLogExecution('DEBUG', 'EU & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_eufiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_eutenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_eur'); 

					break; // case 4 end

				case 5: // sri lanka staff

					nlapiLogExecution('DEBUG', 'SL & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_slfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sltenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_usdsrilanka'); 

					break; /// case 5 end	

				case 6: // SINGAPORE

					nlapiLogExecution('DEBUG', 'SL & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sgpfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sgptenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sgp'); 

					break; // case 6 end

				case 7: // SPARE ONE

					nlapiLogExecution('DEBUG', 'Spare one & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareonefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareonetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareone'); 

					break; // case 7 end	

				case 8: // SPARE TWO

					nlapiLogExecution('DEBUG', 'Spare two & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetwofiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetwotenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparetwo'); 

					break; // case 8 end	

				case 9: // SPARE THREE

					nlapiLogExecution('DEBUG', 'Spare three & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparethreefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparethreetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparethree'); 

					break; /// case 9 end	

				case 10: // SPARE FOUR

					nlapiLogExecution('DEBUG', 'Spare four & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefourfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefourtenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefour'); 

					break; // case 10 end	

				case 11: // SPARE FIVE

					nlapiLogExecution('DEBUG', 'Spare five & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefivefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefivetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefive'); 

					break; // case 11 end		

				case 12: // SPARE SIX

					nlapiLogExecution('DEBUG', 'Spare six & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparesixfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparesixtenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparesix'); 

					break; // case 12 end

				case 13: // SPARE SEVEN

					nlapiLogExecution('DEBUG', 'Spare seven & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparesevenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareseventenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareseven'); 

					break; // case 13 end

				case 14: // SPARE EIGHT

					nlapiLogExecution('DEBUG', 'Spare eight & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareeightfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareeighttenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareeight'); 

					break; // case 14 end		

				case 15: // SPARE NINE

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareninefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareninetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparenine'); 

					break; // case 15 end		

				case 16: // SPARE TEN

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareten'); 

					break; // case 16 end		

				case 17: // SPARE ELEVEN

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareelevenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareeleventenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareeleven'); 

					break; // case 17 end	

				case 18: // SPARE TWELVE

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetwelvefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetwelvetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparetwelve'); 

					break; // case 18 end	

				case 19: // SPARE thirteen

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparethirteenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparethirteentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparethirteen'); 

					break; // case 19 end	

				case 20: // SPARE fourteen

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefourteenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefourteentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefourteen'); 

					break; // case 20 end		

			}

			var expSearchResults = nlapiSearchRecord('customrecord_perdiemrates', null, expSearchFilters, expSearchColumns);

			if(expSearchResults == null)
			{
				// no search results
				nlapiLogExecution('DEBUG', 'Found no ROW perdiem rates', null);
			}
			else
			{        
				// get rates
				var fiveHourRate = expSearchResults[0].getValue(expSearchColumns[0]);
				var tenHourRate = expSearchResults[0].getValue(expSearchColumns[1]);
				var twentyFourHourRate = expSearchResults[0].getValue(expSearchColumns[2]);

				//check rates script side
				nlapiLogExecution('DEBUG','us five rate', fiveHourRate);   
				nlapiLogExecution('DEBUG','us ten rate', tenHourRate);    
				nlapiLogExecution('DEBUG','us twenty four rate', twentyFourHourRate);  
			}

			// work out percentages for deductions                
			var fourteenPercent = ((14/100) * twentyFourHourRate);
			nlapiLogExecution('DEBUG', 'US fourtyfourPercent', fourtyfourPercentRound);  
			var fourteenPercentround = Round(fourteenPercent);
			nlapiLogExecution('DEBUG', 'US fourteenpercent rounded', fourteenPercentround);

			var twentyeightPercent = ((28/100) * twentyFourHourRate);
			nlapiLogExecution('DEBUG', 'US fourtyfourPercent', fourtyfourPercentRound);  
			var twentyeightPercentRound = Round(twentyeightPercent);
			nlapiLogExecution('DEBUG', 'US twentyeightpercent rounded', twentyeightPercentRound);

			var fourtyfourPercent = ((44/100) * twentyFourHourRate);
			nlapiLogExecution('DEBUG', 'US fourtyfourPercent', fourtyfourPercentRound);  
			var fourtyfourPercentRound = Round(fourtyfourPercent);
			nlapiLogExecution('DEBUG', 'US fourtyfourPercent rounded', fourtyfourPercentRound);             

			//build UI **this also sets the order each group is displayed**************************************************************
			assistant.addFieldGroup("grouptotal","Total").setCollapsible(false, false);												//1
			assistant.addFieldGroup("grouprates", "Rates available").setCollapsible(true, true);									//2
			assistant.addFieldGroup("groupfulldailyallowance", "Full daily allowance").setCollapsible(true, true);					//3
			assistant.addFieldGroup("grouppartialdailyallowanceoone", "Partial first day allowance").setCollapsible(true, true);	//4
			assistant.addFieldGroup("grouppartialdailyallowancetwo", "Partial last day allowance").setCollapsible(true, true);		//5
			assistant.addFieldGroup("groupdeductions", "Deductions").setCollapsible(true, true);									//6

			// populate the rates table 
			var oneMealRateLabel = assistant.addField("onemealratelabel", "label", "Five hour rate: " + fiveHourRate, null,"grouprates");
			var twoMealRateLabel = assistant.addField("twomealratelabel", "label", "Ten hour rate: " + tenHourRate, null,"grouprates");
			var maxRateLabel = assistant.addField("maxratelabel", "label", "Max rate: " + twentyFourHourRate, null,"grouprates");

			//calculations

			// single day calculation 
			if(subsistenceDateDiff < 0)
			{
				nlapiLogExecution('DEBUG','EU subsistenceDepartureAMPM', subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','EU subsistenceReturnAMPM', subsistenceReturnAMPM);

				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));
				nlapiLogExecution('DEBUG','EU timehundred', strSplitTime);	

				if(strSplitTime >= 1200)
				{
					strSplitTime = strSplitTime - 1200;
				}

				if(subsistenceDepartureAMPM == 'AM')
				{

				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						strSplitTime = strSplitTime + parseInt(1200);
						nlapiLogExecution('DEBUG','new strsplittime', strSplitTime);	
					}
				}


				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));          	
				nlapiLogExecution('DEBUG','ROW timehundred day 2', strSplitReturnTime);

				if(subsistenceReturnAMPM == 'AM')
				{

				}
				else
				{
					if(strSplitReturnTime != 1200 && strSplitReturnTime != 1230)
					{
						strSplitReturnTime = strSplitReturnTime + parseInt(1200);
						nlapiLogExecution('DEBUG','new strSplitReturnTime', strSplitReturnTime);	
					}
				}

				var totalTime = strSplitReturnTime - strSplitTime;
				nlapiLogExecution('DEBUG', 'totalTime', totalTime);

				if(totalTime < 500)
				{
					var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
					var partialDayOneTotal = parseInt(0);
					var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
				}
				else
				{
					if(totalTime < 1000)
					{
						var subsistenceFiveHourRate = assistant.addField("subsistencefiverate", "label", "Five hour: " + fiveHourRate, null, "grouppartialdailyallowanceoone");
						var partialDayOneTotal = parseInt(fiveHourRate);
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
					}
					else
					{
						if(totalTime < 2400)
						{
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
						}
						else
						{
							if(totalTime >= 2400)
							{
								var subsistenceTwentyFourHour = assistant.addField("subsistencetwentyrate", "label", "Max: " + twentyFourHourRate, null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(twentyFourHourRate);
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");    	       
							}
							else
							{
								var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(0);
								var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
							}
						}
					}
				}    	
			}
			else // multiple day calculation
			{

				/*
				 * -== Full day ==-
				 */

				var fulldaytotal = subsistenceDateDiff * twentyFourHourRate;
				nlapiLogExecution('DEBUG','US fulldaytotal', fulldaytotal);

				var subsistenceFullDayCalculation = assistant.addField("subsistencefulldaycalculation", "label", "Days: "+ subsistenceDateDiff + " x daily max rate: " + twentyFourHourRate, null, "groupfulldailyallowance");
				var subsistenceFullDayRate = assistant.addField("subsistencefulldayrate", "label", "Full day total: " + fulldaytotal, null, "groupfulldailyallowance");    		     

				/*
				 *  -== Partial Day 1 ==-
				 */

				// replace 12:00 to 1200  		        
				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));

				nlapiLogExecution('DEBUG','US timehundred', strSplitTime);				
				nlapiLogExecution('DEBUG','US subsistenceDepartureTime', subsistenceDepartureTime);

				// note to self, it has swapped return and departure...
				nlapiLogExecution('DEBUG','US subsistenceDepartureAMPM', subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','US subsistenceReturnAMPM', subsistenceReturnAMPM);

				if(subsistenceDepartureAMPM == 'AM') //zzz
				{
					nlapiLogExecution('DEBUG','US AM', null);
					// if starts at 12am (24:00) this becomes a 24 hour journey
					if(strSplitTime == 1200)
					{
						var subsistenceTwentyFourHour = assistant.addField("subsistencetwentyrate", "label", "Max: " + twentyFourHourRate, null, "grouppartialdailyallowanceoone");
						var partialDayOneTotal = parseInt(twentyFourHourRate);
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
					}
					else // between 601 and 1159 *1199*
					{
						if(strSplitTime > 600)
						/*
						 * 
						* Version Nu: 3.4.18
						*
						*/
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
						
					}
				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						nlapiLogExecution('DEBUG','UK PM', null);
						// if trip starts before 2PM
						if(strSplitTime <= 200 || strSplitTime >= 1200)
						{
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
						}    		       
						else
						{ 
							// if trip starts before or at 7pm
							if(strSplitTime <= 700)
							{
								var subsistenceFiveHourRate = assistant.addField("subsistencefiverate", "label", "Five hour: " + fiveHourRate, null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(fiveHourRate);
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
							}
							else // trip has started after 7pm and can not get the one meal bonus for that day
							{
								var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(0);
								var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
							}
						}
					}
					else
					{
						var partialDayOneTotal = parseInt(0);
						var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
						// nothing was found
					}
				}

				/*
				 *  -== Partial Day 2 ==-
				 */

				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));		
				nlapiLogExecution('DEBUG','ROW timehundred day 2', strSplitReturnTime);

				if(subsistenceReturnAMPM == 'AM')
				{
					if(strSplitReturnTime < 500 || strSplitReturnTime >= 1200) // below 5am therefore no 5 hour rate is awarded but the trip is before 6am  so breakfast is given
					{
						var subsistenceNoRateTwo = assistant.addField("susbsistencefiveratetwo", "label", "No rates given", null,"grouppartialdailyallowancetwo");    		        		
						var partialDayTwoTotal = parseInt(0);
						var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
					}
					else
					{
						// if before 10 AM
						if(strSplitReturnTime < 1000)
						{
							var subsistenceFiveRateTwo = assistant.addField("susbsistencefiveratetwo", "label", "Five hour: " + fiveHourRate, null,"grouppartialdailyallowancetwo");    		        		
							var partialDayTwoTotal = parseInt(fiveHourRate);
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
						}						
						else
						{
							if(strSplitReturnTime >= 1000) // if greater than 10 am give 5,10 and breakfast rates
							{
								var subsistenceTenRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Ten hour: " + tenHourRate, null,"grouppartialdailyallowancetwo");
								var partialDayTwoTotal = parseInt(tenHourRate);					
								var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
							}
						}
					}
				}
				else
				{
					if(subsistenceReturnAMPM == 'PM')
					{
						if(strSplitReturnTime < 1130 || strSplitReturnTime >= 1200)
						{
							var subsistenceTenRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Ten hour: " + tenHourRate, null,"grouppartialdailyallowancetwo");
							var partialDayTwoTotal = parseInt(tenHourRate);					
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");	
						}
						else
						{
							var subsistenceTwentyRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Max: " + twentyFourHourRate, null,"grouppartialdailyallowancetwo");
							var partialDayTwoTotal = parseInt(twentyFourHourRate);					
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");			
						}
					}	    		        
				}
			}

			/*
			 *  -==deductions==-
			 */

			if(subsistenceMealsTrue == 1)
			{
				var subsistenceBMeal = request.getParameter('custpage_subsistencebmealnumber');
				var subsistenceLMeal = request.getParameter('custpage_subsistencelmealnumber');
				var subsistenceDMeal = request.getParameter('custpage_subsistencedmealnumber');
				var subsistenceEMeal = request.getParameter('custpage_subsistenceemealnumber');

				nlapiLogExecution('DEBUG', 'DATE DIFF', subsistenceDateDiff);
				nlapiLogExecution('DEBUG', 'subsistence B meal', subsistenceBMeal);
				nlapiLogExecution('DEBUG', 'subsistence L meal', subsistenceLMeal);
				nlapiLogExecution('DEBUG', 'subsistence D meal', subsistenceDMeal);
				nlapiLogExecution('DEBUG', 'subsistence E meal', subsistenceEMeal);

				var deductionsTotal = 0;
				nlapiLogExecution('DEBUG', 'subsistence deductionsTotal', deductionsTotal);

				var subsistenceDeductBreakfastLabel = assistant.addField("subsistencedeductbreakfast", "label", "Breakfast: " + fourteenPercentround + " x " + subsistenceBMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourteenPercentround*subsistenceBMeal);
				nlapiLogExecution('DEBUG', 'subsistence deductionsTotal', deductionsTotal);

				var subsistenceDeductOneMealRate = assistant.addField("subsistencedeductonemealrate", "label", "Lunch: " + fourteenPercentround + " x " + subsistenceLMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourteenPercentround*subsistenceLMeal);
				nlapiLogExecution('DEBUG', 'subsistence deductionsTotal', deductionsTotal);

				var subsistenceDeductTwoMealRate = assistant.addField("subsistencededucttwomealrate", "label", "Dinner: " + twentyeightPercentRound + " x " + subsistenceDMeal, null, "groupdeductions");
				deductionsTotal += parseInt(twentyeightPercentRound*subsistenceDMeal);

				nlapiLogExecution('DEBUG', 'subsistence deductionsTotal', deductionsTotal);

				var	subsistenceDeductLateMealRate = assistant.addField("subsistencedeductlatemealrate","label", "Late meal:" + fourtyfourPercentRound + " x " + subsistenceEMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourtyfourPercentRound*subsistenceEMeal);
				nlapiLogExecution('DEBUG', 'subsistence deductionsTotal', deductionsTotal);
				// total deductions label		
				var totalDeductionsLabel = assistant.addField("subsistencedeductlabel","label", "Total deductions:" + deductionsTotal, null, "groupdeductions");		        	

				var subsistenceHiddenBreakfastAmount= assistant.addField("subsistenceamountbreakfast", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourteenPercentround)*parseInt(subsistenceBMeal)); 
				var subsistenceHiddenOneMealAmount= assistant.addField("subsistenceamountonemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourteenPercentround)*parseInt(subsistenceLMeal)); 
				var subsistenceHiddenTwoMealAmount= assistant.addField("subsistenceamounttwomeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(twentyeightPercentRound)*parseInt(subsistenceDMeal)); 
				var subsistenceHiddenLateMealAmount= assistant.addField("subsistenceamountlatemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourtyfourPercentRound)*parseInt(subsistenceEMeal)); 

			}


			/*
			 * -==Total==-
			 */
			var totalOfAll = parseInt(0);

			if(fulldaytotal == null)
			{
				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(fulldaytotal);

				var fullDayTotalLabel = assistant.addField("fulldaytotal", "label", "Full day total: " + fulldaytotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(fulldaytotal);

				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fulldaytotal));
			}

			if(partialDayOneTotal == null)
			{
				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(partialDayOneTotal);

				var DayOneTotalLabel = assistant.addField("dayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(partialDayOneTotal);

				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(partialDayOneTotal));
			}

			if(partialDayTwoTotal == null)
			{
				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(partialDayTwoTotal);

				var DayTwoTotalLabel = assistant.addField("daytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(partialDayTwoTotal);

				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(partialDayTwoTotal));

			}

			if(subsistenceMealsTrue == 1)
			{
				Round(deductionsTotal);
				var totalDeductions = assistant.addField("totaldeductions", "label", "Deductions: -" + deductionsTotal, null, "grouptotal");
				totalOfAll = totalOfAll - parseInt(deductionsTotal);

				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(deductionsTotal));
			}
			else
			{
				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);

			}

			parseFloat(totalOfAll);
			Round(totalOfAll);

			var triptotal = assistant.addField("subsistencetriptotal", "label", "Trip total: " +totalOfAll  + " " + baseCurrencyText, null, "grouptotal");

			var subsistenceHiddenTotal = assistant.addField("subsistencehiddentotal", 'text', 'hidden');
			subsistenceHiddenTotal.setDisplayType('hidden');
			subsistenceHiddenTotal.setDefaultValue(totalOfAll); 

			var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
			subsistenceUkTravelHidden.setDisplayType('hidden');
			subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel); 


			break;

		case 1: // ROW  		

			nlapiLogExecution('DEBUG', 'step 6 ROW employeeLocationId', employeeLocationId);

			//get country of travel
			var subsitenceROWTravel = request.getParameter('custpage_rowtravel');

			//create search filters and columns array
			var expSearchFilters = new Array();
			var expSearchColumns = new Array();
			// search filters
			expSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', subsitenceROWTravel);

			//determine which columns to search and get the rates based on country
			switch(parseInt(employeeLocationId))
			{
				case 1: // Uk staff			

					nlapiLogExecution('DEBUG', 'UK & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_ukfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_uktenrate'); 
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_stg'); 

					break; // case 1 end

				case 2: // US staff

					nlapiLogExecution('DEBUG', 'US & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_usfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_ustenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_usd'); 

					break; // case 2 end

				case 3: // can staff

					nlapiLogExecution('DEBUG', 'Can & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_canfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_cantenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_cad'); 

					break; // case 3 end

				case 4: // europe staff

					nlapiLogExecution('DEBUG', 'EU & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_eufiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_eutenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_eur'); 

					break; // case 4 end

				case 5: // sri lanka stFF

					nlapiLogExecution('DEBUG', 'SL & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_slfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sltenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_usdsrilanka'); 

					break; // case 5 end	

				case 6: // SINGAPORE

					nlapiLogExecution('DEBUG', 'SL & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sgpfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sgptenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sgp'); 

					break; // case 6 end

				case 7: // SPARE ONE

					nlapiLogExecution('DEBUG', 'Spare one & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareonefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareonetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareone'); 

					break; /// case 7 end	

				case 8: // SPARE TWO

					nlapiLogExecution('DEBUG', 'Spare two & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetwofiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetwotenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparetwo'); 

					break; /// case 8 end	

				case 9: // SPARE THREE

					nlapiLogExecution('DEBUG', 'Spare three & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparethreefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparethreetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparethree'); 

					break; /// case 9 end	

				case 10: // SPARE FOUR

					nlapiLogExecution('DEBUG', 'Spare four & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefourfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefourtenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefour'); 

					break; /// case 10 end	

				case 11: // SPARE FIVE

					nlapiLogExecution('DEBUG', 'Spare five & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefivefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefivetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefive'); 

					break; // case 11 end		

				case 12: // SPARE SIX

					nlapiLogExecution('DEBUG', 'Spare six & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparesixfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparesixtenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparesix'); 

					break; // case 12 end

				case 13: // SPARE SEVEN

					nlapiLogExecution('DEBUG', 'Spare seven & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparesevenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareseventenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareseven'); 

					break; // case 13 end

				case 14: // SPARE EIGHT

					nlapiLogExecution('DEBUG', 'Spare eight & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareeightfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareeighttenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareeight'); 

					break; // case 14 end		

				case 15: // SPARE NINE

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareninefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareninetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparenine'); 

					break; // case 15 end		

				case 16: // SPARE TEN

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareten'); 

					break; // case 16 end		

				case 17: // SPARE ELEVEN

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_spareelevenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_spareeleventenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_spareeleven'); 

					break; // case 17 end	

				case 18: // SPARE TWELVE

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparetwelvefiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparetwelvetenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparetwelve'); 

					break; // case 18 end	

				case 19: // SPARE thirteen

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparethirteenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparethirteentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparethirteen'); 

					break; // case 19 end	

				case 20: // SPARE fourteen

					nlapiLogExecution('DEBUG', 'Spare nine & employeeLocationId', employeeLocationId);

					expSearchColumns[0] = new nlobjSearchColumn('custrecord_sparefourteenfiverate');
					expSearchColumns[1] = new nlobjSearchColumn('custrecord_sparefourteentenrate');                
					expSearchColumns[2] = new nlobjSearchColumn('custrecord_sparefourteen'); 

					break; // case 20 end	
			}

			var expSearchResults = nlapiSearchRecord('customrecord_perdiemrates', null, expSearchFilters, expSearchColumns);	    			

			if(expSearchResults == null)
			{
				// no search results
				nlapiLogExecution('DEBUG', 'Found no ROW perdiem rates', null);
			}
			else
			{        
				// get rates
				var fiveHourRate = expSearchResults[0].getValue(expSearchColumns[0]);
				var tenHourRate = expSearchResults[0].getValue(expSearchColumns[1]);
				var twentyFourHourRate = expSearchResults[0].getValue(expSearchColumns[2]);

				//check rates script side
				nlapiLogExecution('DEBUG','ROW five rate', fiveHourRate);   
				nlapiLogExecution('DEBUG','ROW ten rate', tenHourRate);    
				nlapiLogExecution('DEBUG','ROW twenty four rate', twentyFourHourRate);  
			}

			// work out percentages for deductions                
			var fourteenPercent = ((14/100) * twentyFourHourRate);
			nlapiLogExecution('DEBUG', 'ROW fourteenpercent', fourteenPercent);
			var fourteenPercentround = Round(fourteenPercent);
			nlapiLogExecution('DEBUG', 'ROW fourteenpercent rounded', fourteenPercentround);

			var twentyeightPercent = ((28/100) * twentyFourHourRate); 
			nlapiLogExecution('DEBUG', 'ROW twentyeightpercent', twentyeightPercent);
			var twentyeightPercentRound = Round(twentyeightPercent);
			nlapiLogExecution('DEBUG', 'ROW twentyeightpercent rounded', twentyeightPercentRound);

			var fourtyfourPercent = ((44/100) * twentyFourHourRate);
			nlapiLogExecution('DEBUG', 'ROW fourtyfourpercent', fourtyfourPercent);             
			var fourtyfourPercentRound = Round(fourtyfourPercent);
			nlapiLogExecution('DEBUG', 'ROW fourtyfourpercent rounded', fourtyfourPercentRound);             

			//build UI **this also sets the order each group is displayed**********************************
			assistant.addFieldGroup("grouptotal","Total").setCollapsible(false, true);;												//1
			assistant.addFieldGroup("grouprates", "Rates available").setCollapsible(true, true);									//2
			assistant.addFieldGroup("groupfulldailyallowance", "Full daily allowance").setCollapsible(true, true);					//3
			assistant.addFieldGroup("grouppartialdailyallowanceoone", "Partial first day allowance").setCollapsible(true, true);	//4
			assistant.addFieldGroup("grouppartialdailyallowancetwo", "Partial last day allowance").setCollapsible(true, true);		//5
			assistant.addFieldGroup("groupdeductions", "Deductions").setCollapsible(true, true);									//6

			var oneMealRateLabel = assistant.addField("onemealratelabel", "label", "Five hour rate: " + fiveHourRate, null,"grouprates");
			var twoMealRateLabel = assistant.addField("twomealratelabel", "label", "Ten hour rate: " + tenHourRate, null,"grouprates");			
			var maxRateLabel = assistant.addField("maxratelabel", "label", "Max rate: " + twentyFourHourRate, null,"grouprates");


			//calculations
			if(subsistenceDateDiff < 0)
			{
				nlapiLogExecution('DEBUG','ROW one day subsistenceDepartureAMPM', subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','ROW one day subsistenceReturnAMPM', subsistenceReturnAMPM);

				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));
				nlapiLogExecution('DEBUG','ROW one day timehundred', strSplitTime);	

				if(strSplitTime >= 1200)
				{
					strSplitTime = strSplitTime - 1200;
				}
				if(subsistenceDepartureAMPM == 'AM')
				{

				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						strSplitTime = strSplitTime + parseInt(1200);
						nlapiLogExecution('DEBUG','new strsplittime', strSplitTime);	
					}
				}


				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));          	
				nlapiLogExecution('DEBUG','ROW timehundred day 2', strSplitReturnTime);

				if(subsistenceReturnAMPM == 'AM')
				{

				}
				else
				{
					if(strSplitReturnTime != 1200 && strSplitReturnTime != 1230)
					{
						strSplitReturnTime = strSplitReturnTime + parseInt(1200);
						nlapiLogExecution('DEBUG','new strsplittime', strSplitTime);	
					}
				}

				var totalTime = strSplitReturnTime - strSplitTime;
				nlapiLogExecution('DEBUG', 'totalTime', totalTime);

				if(totalTime < 500)
				{
					var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
					var partialDayOneTotal = parseInt(0);
					var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
				}
				else
				{
					if(totalTime < 1000)
					{
						var subsistenceFiveHourRate = assistant.addField("subsistencefiverate", "label", "Five hour: " + fiveHourRate, null, "grouppartialdailyallowanceoone");
						var partialDayOneTotal = parseInt(fiveHourRate);
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
					}
					else
					{
						if(totalTime < 2400)
						{
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
						}
						else
						{
							if(totalTime >= 2400)
							{
								var subsistenceTwentyFourHour = assistant.addField("subsistencetwentyrate", "label", "Max: " + twentyFourHourRate, null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(twentyFourHourRate);
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");    	       
							}
							else
							{
								var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(0);
								var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
							}
						}
					}
				}

			}
			else
			{
				/*
				 * -== Full day ==-
				 */

				var fulldaytotal = subsistenceDateDiff * twentyFourHourRate;
				nlapiLogExecution('DEBUG','UK fulldaytotal', fulldaytotal);

				var subsistenceFullDayCalculation = assistant.addField("subsistencefulldaycalculation", "label", "Days: "+ subsistenceDateDiff + " x daily max rate: " + twentyFourHourRate, null, "groupfulldailyallowance");
				var subsistenceFullDayRate = assistant.addField("subsistencefulldayrate", "label", "Full day total: " + fulldaytotal, null, "groupfulldailyallowance");    		     

				/*
				 *  -== Partial Day 1 ==-
				 */

				// replace 12:00 to 1200  		        
				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));

				nlapiLogExecution('DEBUG','EU timehundred', strSplitTime);				
				nlapiLogExecution('DEBUG','EU subsistenceDepartureTime', subsistenceDepartureTime);

				nlapiLogExecution('DEBUG','EU subsistenceDepartureAMPM', subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','EU subsistenceReturnAMPM', subsistenceReturnAMPM);

				if(subsistenceDepartureAMPM == 'AM')
				{
					nlapiLogExecution('DEBUG','EU AM', null);
					// if starts at 12am (24:00) this becomes a 24 hour journey
					if(strSplitTime == 1200)
					{
						var subsistenceTwentyFourHour = assistant.addField("subsistencetwentyrate", "label", "Max: " + twentyFourHourRate, null, "grouppartialdailyallowanceoone");
						var partialDayOneTotal = parseInt(twentyFourHourRate);
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
					}
					else // between 601 and 1159 *1199*
					{
						if(strSplitTime > 600)
						
							/*
							 * 
							* Version Nu: 3.4.18
							*
							*/
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");
						
					}

				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						nlapiLogExecution('DEBUG','UK PM', null);
						// if trip starts before 2PM
						if(strSplitTime <= 200 || strSplitTime >= 1200)
						{
							var subsistenceTenHourRate = assistant.addField("subsistencetenrate", "label", "Ten hour: " + tenHourRate, null, "grouppartialdailyallowanceoone");
							var partialDayOneTotal = parseInt(tenHourRate);
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
						}    		       
						else
						{ 
							// if trip starts before or at 7pm
							if(strSplitTime <= 700)
							{
								var subsistenceFiveHourRate = assistant.addField("subsistencefiverate", "label", "Five hour: " + fiveHourRate, null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(fiveHourRate);
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	
							}
							else // trip has started after 7pm and can not get the one meal bonus for that day
							{
								var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rates given", null, "grouppartialdailyallowanceoone");
								var partialDayOneTotal = parseInt(0);
								var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Partial first day total: " + partialDayOneTotal, null, "grouppartialdailyallowanceoone");	

							}
						}
					}
					else
					{
						// nothing found
					}
				}

				/*
				 *  -== Partial Day 2 ==-
				 */

				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));		
				nlapiLogExecution('DEBUG','ROW timehundred day 2', strSplitReturnTime);

				if(subsistenceReturnAMPM == 'AM')
				{
					if(strSplitReturnTime < 500 || strSplitReturnTime >= 1200) // below 5am therefore no 5 hour rate is awarded
					{
						var subsistenceNoRateTwo = assistant.addField("susbsistencefiveratetwo", "label", "No rates given", null,"grouppartialdailyallowancetwo");    		        		
						var partialDayTwoTotal = parseInt(0);
						var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
					}
					else
					{
						// if before 10 AM
						if(strSplitReturnTime < 1000)
						{
							var subsistenceFiveRateTwo = assistant.addField("susbsistencefiveratetwo", "label", "Five hour: " + fiveHourRate, null,"grouppartialdailyallowancetwo");    		        		
							var partialDayTwoTotal = parseInt(fiveHourRate);
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
						}						
						else
						{
							if(strSplitReturnTime >= 1000) // if greater than 10 am give 10 hour rate
							{
								var subsistenceTenRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Ten hour: " + tenHourRate, null,"grouppartialdailyallowancetwo");
								var partialDayTwoTotal = parseInt(tenHourRate);					
								var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");
							}
						}
					}
				}
				else
				{
					if(subsistenceReturnAMPM == 'PM')
					{
						if(strSplitReturnTime < 1130 || strSplitReturnTime >= 1200)
						{
							var subsistenceTenRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Ten hour: " + tenHourRate, null,"grouppartialdailyallowancetwo");
							var partialDayTwoTotal = parseInt(tenHourRate);					
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");	
						}
						else
						{
							var subsistenceTwentyRateTwo = assistant.addField("susbsistencetenratetwo", "label", "Max: " + twentyFourHourRate, null,"grouppartialdailyallowancetwo");
							var partialDayTwoTotal = parseInt(twentyFourHourRate);					
							var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouppartialdailyallowancetwo");			
						}
					}	    		        
				}
			}

			/*
			 *  -==deductions==-
			 */

			if(subsistenceMealsTrue == 1)
			{
				var subsistenceBMeal = request.getParameter('custpage_subsistencebmealnumber');
				var subsistenceLMeal = request.getParameter('custpage_subsistencelmealnumber');
				var subsistenceDMeal = request.getParameter('custpage_subsistencedmealnumber');
				var subsistenceEMeal = request.getParameter('custpage_subsistenceemealnumber');

				nlapiLogExecution('DEBUG', 'DATE DIFF', subsistenceDateDiff);
				nlapiLogExecution('DEBUG', 'subsistence B meal', subsistenceBMeal);
				nlapiLogExecution('DEBUG', 'subsistence L meal', subsistenceLMeal);
				nlapiLogExecution('DEBUG', 'subsistence D meal', subsistenceDMeal);
				nlapiLogExecution('DEBUG', 'subsistence E meal', subsistenceEMeal);

				var deductionsTotal = 0;

				var subsistenceDeductBreakfastLabel = assistant.addField("subsistencedeductbreakfast", "label", "Breakfast: " + fourteenPercentround + " x " + subsistenceBMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourteenPercentround*subsistenceBMeal);

				var subsistenceDeductOneMealRate = assistant.addField("subsistencedeductonemealrate", "label", "Lunch: " + fourteenPercentround + " x " + subsistenceLMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourteenPercentround*subsistenceLMeal);

				var subsistenceDeductTwoMealRate = assistant.addField("subsistencededucttwomealrate", "label", "Dinner: " + twentyeightPercentRound + " x " + subsistenceDMeal, null, "groupdeductions");
				deductionsTotal += parseInt(twentyeightPercentRound*subsistenceDMeal);

				var	subsistenceDeductLateMealRate = assistant.addField("subsistencedeductlatemealrate","label", "Late:" + fourtyfourPercentRound + " x " + subsistenceEMeal, null, "groupdeductions");
				deductionsTotal += parseInt(fourtyfourPercentRound*subsistenceEMeal);

				// total deductions label		
				var totalDeductionsLabel = assistant.addField("subsistencedeductlabel","label", "Total deductions:" + deductionsTotal, null, "groupdeductions");		        	

				var subsistenceHiddenBreakfastAmount= assistant.addField("subsistenceamountbreakfast", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourteenPercentround)*parseInt(subsistenceBMeal)); 
				var subsistenceHiddenOneMealAmount= assistant.addField("subsistenceamountonemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourteenPercentround)*parseInt(subsistenceLMeal)); 
				var subsistenceHiddenTwoMealAmount= assistant.addField("subsistenceamounttwomeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(twentyeightPercentRound)*parseInt(subsistenceDMeal)); 
				var subsistenceHiddenLateMealAmount= assistant.addField("subsistenceamountlatemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fourtyfourPercentRound)*parseInt(subsistenceEMeal)); 

			}


			/*
			 * -==Total==-
			 */

			var totalOfAll = parseInt(0);

			if(fulldaytotal == null)
			{
				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(fulldaytotal);

				var fullDayTotalLabel = assistant.addField("fulldaytotal", "label", "Full day total: " + fulldaytotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(fulldaytotal);

				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fulldaytotal));

			}
			if(partialDayOneTotal == null)
			{
				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(partialDayOneTotal);

				var DayOneTotalLabel = assistant.addField("dayonetotal", "label", "Partial first day total: " + partialDayOneTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(partialDayOneTotal);

				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(partialDayOneTotal));
			}

			if(partialDayTwoTotal == null)
			{
				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);

			}
			else
			{
				Round(partialDayTwoTotal);

				var DayTwoTotalLabel = assistant.addField("daytwototal", "label", "Partial last day total: " + partialDayTwoTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(partialDayTwoTotal);

				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(partialDayTwoTotal));

			}

			if(subsistenceMealsTrue == 1)
			{
				Round(deductionsTotal);
				var totalDeductions = assistant.addField("totaldeductions", "label", "Deductions: -" + deductionsTotal, null, "grouptotal");
				totalOfAll = totalOfAll - parseInt(deductionsTotal);

				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(deductionsTotal));
			}
			else
			{
				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}

			parseFloat(totalOfAll);
			Round(totalOfAll);

			var triptotal = assistant.addField("subsistencetriptotal", "label", "Trip total: " +totalOfAll + " " + baseCurrencyText, null, "grouptotal");

			var subsistenceHiddenTotal = assistant.addField("subsistencehiddentotal", 'text', 'hidden');
			subsistenceHiddenTotal.setDisplayType('hidden');
			subsistenceHiddenTotal.setDefaultValue(totalOfAll); 

			var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
			subsistenceUkTravelHidden.setDisplayType('hidden');
			subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel); 

			break; // case 1 end

			// >>>>>>>>>>>> SUBSISTENCE UK <<<<<<<<<<<<<
		case 2:

			nlapiLogExecution('DEBUG', 'SUBSISTENCE UK');

			//search for UK the rates
			var expSearchFilters = new Array();
			var expSearchColumns = new Array();
			// search filters
			expSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', employeeLocationId);
			// search columns
			expSearchColumns[0] = new nlobjSearchColumn('custrecord_breakfastrate');
			expSearchColumns[1] = new nlobjSearchColumn('custrecord_onemealrate');
			expSearchColumns[2] = new nlobjSearchColumn('custrecord_twomealrate');
			expSearchColumns[3] = new nlobjSearchColumn('custrecord_lateeverate');
			expSearchColumns[4] = new nlobjSearchColumn('custrecord_maxclaimable');

			// perform search
			var expSearchResults = nlapiSearchRecord('customrecord_employeelocation', null, expSearchFilters, expSearchColumns);
			if(expSearchResults == null)
			{
				// no search results found
				nlapiLogExecution('ERROR', 'Found no rates associated with employee location...', 'Employee location is: ' + employeeLocationId);
			}
			else
			{        
				// get rates
				var UKBreakfastRate = expSearchResults[0].getValue(expSearchColumns[0]);
				var UKOneMealRate = expSearchResults[0].getValue(expSearchColumns[1]);
				var UKTwoMealRate = expSearchResults[0].getValue(expSearchColumns[2]);
				var UKLateEveningRate = expSearchResults[0].getValue(expSearchColumns[3]);
				var UKMaxClaimable = expSearchResults[0].getValue(expSearchColumns[4]);

				//check rates script side
				nlapiLogExecution('DEBUG','UK breakfast rate', UKBreakfastRate);   
				nlapiLogExecution('DEBUG','UK one meal rate', UKOneMealRate);    
				nlapiLogExecution('DEBUG','UK two meal rate', UKTwoMealRate);  
				nlapiLogExecution('DEBUG','UK Late evening rate', UKLateEveningRate);
				nlapiLogExecution('DEBUG','UK max claimable', UKMaxClaimable);
			}                                                       

			//build UI - changes UI order based on this (in order of declaration)
			assistant.addFieldGroup("grouptotal","Total").setCollapsible(false, false);				
			assistant.addFieldGroup("grouprates", "Rates available").setCollapsible(true, true);
			assistant.addFieldGroup("groupfulldailyallowance", "Full daily entitlement").setCollapsible(true, true);
			assistant.addFieldGroup("grouppartialdailyallowancesingle", "Single day entitlement").setCollapsible(true, true);
			assistant.addFieldGroup("grouppartialdailyallowanceoone", "Partial first day entitlement").setCollapsible(true, true);
			assistant.addFieldGroup("grouppartialdailyallowancetwo", "Partial last day entitlement").setCollapsible(true, true);
			assistant.addFieldGroup("groupdeductions", "Deductions").setCollapsible(true, true);

			nlapiLogExecution('DEBUG', 'subsistencedatediff', subsistenceDateDiff);

			////////////////////////////////
			// ||****> RATES TABLE <<****||
			///////////////////////////////

			var breakfastRateLabel = assistant.addField("breakfastratelabel", "label", "Breakfast rate: " + UKBreakfastRate, null,"grouprates");
			var oneMealRateLabel = assistant.addField("onemealratelabel", "label", "5 hour rate: " + UKOneMealRate, null,"grouprates");
			var twoMealRateLabel = assistant.addField("twomealratelabel", "label", "10 hour rate: " + UKTwoMealRate, null,"grouprates");
			var lateMealRateLabel = assistant.addField("latemealratelabel", "label", "Late rate: " + UKLateEveningRate, null,"grouprates");
			var maxRateLabel = assistant.addField("maxratelabel", "label", "Max rate: " + UKMaxClaimable, null,"grouprates");

			/////////////////////////////////////////////
			// ||****> UK SINGLE DAY CALCULATION <<****||
			/////////////////////////////////////////////

			if(subsistenceDateDiff < 0)
			{
				nlapiLogExecution('DEBUG','UK one day subsistenceDepartureAMPM', subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','UK one day subsistenceReturnAMPM', subsistenceReturnAMPM);

				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));
				nlapiLogExecution('DEBUG','UK one day timehundred', strSplitTime);	

				var dayOneFinalTotal = 0;
				var partialDayOneTotal = 0;
				var breakfastYes = 0;

				if(strSplitTime >= 1200)
				{
					strSplitTime = strSplitTime - 1200;
				}

				if(subsistenceDepartureAMPM == 'AM')
				{
					if(strSplitTime <= 600)
					{
						var subsistenceBreakFastRate = assistant.addField("susbsistencebreakfastrate", "label", "Breakfast: " + UKBreakfastRate, null,"grouppartialdailyallowancesingle");
						partialDayOneTotal += parseInt(UKBreakfastRate);
					}
				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						strSplitTime = strSplitTime + parseInt(1200);
						nlapiLogExecution('DEBUG','new strsplittime', strSplitTime);	
					}
				}

				nlapiLogExecution('DEBUG', 'partialDayOneTotal 1: ' + partialDayOneTotal);

				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));          	
				nlapiLogExecution('DEBUG','UK one day timehundred day 2', strSplitReturnTime);

				if(subsistenceReturnAMPM == 'AM')
				{
					if(strSplitReturnTime >= 1200)
					{
						strSplitReturnTime = strSplitReturnTime - 1200;
					}
				}
				else
				{
					if(strSplitReturnTime != 1200 && strSplitReturnTime != 1230 )
					{
						strSplitReturnTime = strSplitReturnTime + 1200;
					}
				}

				nlapiLogExecution('DEBUG', 'calc strSplitReturnTime', strSplitReturnTime);
				nlapiLogExecution('DEBUG', 'calc strSplitTime', strSplitTime);
				var totalTime = strSplitReturnTime - strSplitTime;
				nlapiLogExecution('DEBUG', 'totalTime', totalTime);
				nlapiLogExecution('DEBUG', 'partialDayOneTotal 2: ' + partialDayOneTotal);


				if(totalTime < 500)
				{
					var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rate given", null, "grouppartialdailyallowancesingle");
				}
				else
				{
					if(totalTime < 1000)
					{
						var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancesingle");
						// day started before 6am so... give breakfast
						partialDayOneTotal += parseInt(UKOneMealRate);
					}
					else
					{
						if(totalTime < 2400)
						{
							var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancesingle");
							var subsistenceTwoMealRate = assistant.addField("subsistencetwomealrate", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowancesingle");

							// day started before 6am so... give breakfast onemeal twomeal
							partialDayOneTotal += parseInt(UKOneMealRate) +parseInt(UKTwoMealRate);

						}
						else
						{
							if(totalTime >= 2400)
							{
								var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancesingle");
								var subsistenceTwoMealRate = assistant.addField("subsistencetwomealrate", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowancesingle");
								partialDayOneTotal += parseInt(UKOneMealRate)+parseInt(UKTwoMealRate);
							}
							else
							{
								var subsistenceNoRate = assistant.addField("subsistencenorate", "label", "No rate given", null, "grouppartialdailyallowancesingle");
								partialDayOneTotal += 0;
							}
						}
					}
				}


				if(subsistenceReturnAMPM == 'AM')
				{

				}
				else
				{
					if(subsistenceReturnAMPM == 'PM')
					{
						if(strSplitReturnTime >= 2000)
						{
							var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowancesingle");
							partialDayOneTotal += parseInt(UKLateEveningRate);
						}
					}
				}

				var singleEntitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowancesingle");
				var subsistencePartialOneTotal = assistant.addField("subsistencenorateone", "label", "Single day entitlement: " + parseInt(partialDayOneTotal), null, "grouppartialdailyallowancesingle");	


				if(partialDayOneTotal>=UKMaxClaimable)
				{
					dayOneFinalTotal = UKMaxClaimable;
				}
				else
				{
					dayOneFinalTotal = partialDayOneTotal;
				}
			}
			else
			{
				///////////////////////////////
				// ||****> UK FULL DAY <<****||
				///////////////////////////////

				// Calculations
				var fulldaytotal = subsistenceDateDiff * UKMaxClaimable;
				nlapiLogExecution('DEBUG','UK fulldaytotal: '+ fulldaytotal);

				// UI Labels
				var subsistenceFullDayCalculation = assistant.addField("subsistencefulldaycalculation", "label", "Days: "+ subsistenceDateDiff + " x daily max rate: " + UKMaxClaimable, null, "groupfulldailyallowance");
				var subsistenceFullDayRate = assistant.addField("subsistencefulldayrate", "label", "Full day total: " + fulldaytotal, null, "groupfulldailyallowance");

				/////////////////////////////////////
				// ||****>> UK PARTIAL DAY 1 <<****||
				/////////////////////////////////////

				// replace 12:00 to 1200  		        
				var strSplitTime = parseInt(subsistenceDepartureTime.replace(":",""));

				// split time checks
				nlapiLogExecution('DEBUG','UK timehundred', strSplitTime);
				nlapiLogExecution('DEBUG','UK subsistenceDepartureTime', subsistenceDepartureTime);
				nlapiLogExecution('DEBUG','UK subsistenceDepartureAMPM', subsistenceDepartureAMPM);

				// declare the running total for day 1
				var partialDayOneTotal = parseInt(0);
				var dayOneFinalTotal = parseInt(0);

				if(subsistenceDepartureAMPM == 'AM')
				{
					nlapiLogExecution('DEBUG','UK AM', null);
					// if equal to 6amor less than or greater than or equal to 1200
					if(strSplitTime <= 600 || strSplitTime >= 1200)
					{
						nlapiLogExecution('DEBUG','UK less than 0600', null);

						var subsistenceBreakFastRate = assistant.addField("susbsistencebreakfastrate", "label", "Breakfast: " + UKBreakfastRate, null,"grouppartialdailyallowanceoone");
						var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowanceoone");
						var subsistenceTwoMealRate = assistant.addField("subsistencetwomealrate", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowanceoone");
						var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowanceoone");

						// total up day one entitlements
						partialDayOneTotal = parseInt(UKOneMealRate)+parseInt(UKTwoMealRate)+parseInt(UKBreakfastRate)+parseInt(UKLateEveningRate);

						// do a check for which is higher day one total or the max claimable
						// this is done so the user gets the highest rate possible

						if(partialDayOneTotal>=UKMaxClaimable)
						{
							dayOneFinalTotal = UKMaxClaimable;
						}
						else
						{
							dayOneFinalTotal = partialDayOneTotal;
						}

						var entitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowanceoone");
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "First day entitlement: " + dayOneFinalTotal, null, "grouppartialdailyallowanceoone");
					}
					else // between 601 and 1159 *1199*
					{
						nlapiLogExecution('DEBUG','UK more than 0600', null);
						var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowanceoone");
						var subsistenceTwoMealRate = assistant.addField("subsistencetwomealrate", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowanceoone");
						var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowanceoone");

						// total up day one entitlements
						partialDayOneTotal = parseInt(UKOneMealRate)+parseInt(UKTwoMealRate)+parseInt(UKLateEveningRate);

						// do a check for which is higher day one total or the max claimable
						// this is done so the user gets the highest rate possible		    						
						if(partialDayOneTotal>=UKMaxClaimable)
						{
							dayOneFinalTotal = UKMaxClaimable;
						}
						else
						{
							dayOneFinalTotal = partialDayOneTotal;
						}

						var entitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowanceoone");
						var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "First day entitlement: " + dayOneFinalTotal, null, "grouppartialdailyallowanceoone");
					}
				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM')
					{
						nlapiLogExecution('DEBUG','UK PM', null);
						// if trip starts before 2PM
						if(strSplitTime <= 200 || strSplitTime >= 1200)
						{
							var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowanceoone");
							var subsistenceTwoMealRate = assistant.addField("subsistencetwomealrate", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowanceoone");
							var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowanceoone");

							// total up day one entitlements
							partialDayOneTotal = parseInt(UKOneMealRate)+parseInt(UKTwoMealRate)+parseInt(UKLateEveningRate);

							// do a check for which is higher day one total or the max claimable
							// this is done so the user gets the highest rate possible		    						
							if(partialDayOneTotal>=UKMaxClaimable)
							{
								dayOneFinalTotal = UKMaxClaimable;
							}
							else
							{
								dayOneFinalTotal = partialDayOneTotal;
							}

							var entitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowanceoone");
							var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "First day entitlement: " + dayOneFinalTotal, null, "grouppartialdailyallowanceoone");
						}    		       
						else
						{ 
							// if trip starts before or at 7pm
							if(strSplitTime <= 700)
							{
								var subsistenceOneMealRate = assistant.addField("subsistenceonemealrate", "label", "5 hour: " + UKOneMealRate, null, "grouppartialdailyallowanceoone");
								var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowanceoone");

								// total up day one entitlement
								partialDayOneTotal = parseInt(UKOneMealRate)+parseInt(UKLateEveningRate);

								// do a check for which is higher day one total or the max claimable
								// this is done so the user gets the highest rate possible		    						
								if(partialDayOneTotal>=UKMaxClaimable)
								{
									dayOneFinalTotal = UKMaxClaimable;
								}
								else
								{
									dayOneFinalTotal = partialDayOneTotal;
								}


								var entitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowanceoone");
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "First day entitlement: " + dayOneFinalTotal, null, "grouppartialdailyallowanceoone");
							}

							else // trip has started after 7pm and can not get the one meal bonus for that day
							{
								var subsistenceLateNightMealRate = assistant.addField("subsistencelaterate", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowanceoone");

								partialDayOneTotal = parseInt(UKLateEveningRate);

								// do a check for which is higher day one total or the max claimable
								// this is done so the user gets the highest rate possible		    						
								if(partialDayOneTotal>=UKMaxClaimable)
								{
									dayOneFinalTotal = UKMaxClaimable;
								}
								else
								{
									dayOneFinalTotal = partialDayOneTotal;
								}

								var entitlementWhiteLabel = assistant.addField("entitlementwhitelabel", "label", "", null, "grouppartialdailyallowanceoone");
								var subsistencePartialOneTotal = assistant.addField("subsistencepartialdayonetotal", "label", "First day entitlement: " + dayOneFinalTotal, null, "grouppartialdailyallowanceoone");
							}
						}
					}
					else
					{
						nlapiLogExecution('ERROR','NO AM OR PM FOUND...');
					}
				}

				/////////////////////////////////////
				// ||****>> UK PARTIAL DAY 2 <<****||
				/////////////////////////////////////

				// replace 12:00 to 1200 
				var strSplitReturnTime = parseInt(subsistenceReturnTime.replace(":",""));
				var returnTrueTime = strSplitReturnTime + 1200;
				var departureTrueTime = strSplitTime + 1200;

				if(strSplitTime >= 1200)
				{
					strSplitTime = 0;
					//departureTrueTime = departureTrueTime - 1200;
					nlapiLogExecution('DEBUG','Departure time converted: ' + strSplitTime);
				}

				if(strSplitReturnTime >= 1200)
				{
					strSplitReturnTime = 0;	
					returnTrueTime = returnTrueTime - 1200;
					nlapiLogExecution('DEBUG','Return time converted: ' + strSplitReturnTime);
				}

				nlapiLogExecution('DEBUG','UK Whole number depart time: ' + strSplitTime + " " + subsistenceDepartureAMPM);
				nlapiLogExecution('DEBUG','UK Whole number return time: ' + strSplitReturnTime + " " + subsistenceReturnAMPM);
				nlapiLogExecution('DEBUG','UK depart PM time: ' + departureTrueTime);
				nlapiLogExecution('DEBUG','UK Return PM time: ' + returnTrueTime);

				var partialDayTwoTotal = parseInt(0);
				var dayTwoFinalTotal = parseInt(0);
				var breakfastAwarded = null;

				// BREAKFAST CHECK
				if(subsistenceDepartureAMPM == 'AM')
				{
					if(strSplitTime <= 600 ) // below 6 am therefore no 5 hour rate is awarded but the trip is before 6am  so breakfast is given
					{
						var subsistenceBreakFastRateTwo = assistant.addField("susbsistencebreakfastratetwo", "label", "Breakfast: " + UKBreakfastRate, null,"grouppartialdailyallowancetwo");

						breakfastAwarded = 1;
						partialDayTwoTotal += parseInt(UKBreakfastRate);
					}				
				}

				// check to see if the depart time is greater than the return time
				if(subsistenceDepartureAMPM == 'AM' && subsistenceReturnAMPM == 'AM' ||  subsistenceDepartureAMPM == 'PM' && subsistenceReturnAMPM == 'PM')
				{

					if(strSplitTime > strSplitReturnTime)
					{
						strSplitTime = 0;
						departureTrueTime = 0;

						nlapiLogExecution('DEBUG', '**Depart:AM/PM & Return:AM/PM** The depart time was greater than return time: Defaulting to: ' + strSplitTime);

						if (breakfastAwarded != 1) 
						{
							var subsistenceBreakFastRateTwo = assistant.addField("susbsistencebreakfastratetwo", "label", "Breakfast: " + UKBreakfastRate, null, "grouppartialdailyallowancetwo");
							partialDayTwoTotal += parseInt(UKBreakfastRate);
						}
					}
				}
				else
				{
					if(subsistenceDepartureAMPM == 'PM' && subsistenceReturnAMPM == 'AM')
					{
						strSplitTime = 0;
						departureTrueTime = 0;

						nlapiLogExecution('DEBUG', 'Depart is PM and return is AM defaulting depart time to:' + strSplitTime);

						if (breakfastAwarded != 1) 
						{
							var subsistenceBreakFastRateTwo = assistant.addField("susbsistencebreakfastratetwo", "label", "Breakfast: " + UKBreakfastRate, null, "grouppartialdailyallowancetwo");
							partialDayTwoTotal += parseInt(UKBreakfastRate);
						}
					}
				}

				if(subsistenceReturnAMPM == 'PM')  // trip started at 12am therefore all the rates below apply 
				{
					var timeDifference = 0;

					if(subsistenceDepartureAMPM == 'PM')
					{
						timeDifference = returnTrueTime - departureTrueTime;
					}
					else
					{
						timeDifference = returnTrueTime - strSplitTime;
					}

					nlapiLogExecution('DEBUG','UK departureTrueTime: ' + departureTrueTime);
					nlapiLogExecution('DEBUG','UK returnTrueTime: ' + returnTrueTime);

					nlapiLogExecution('DEBUG', 'the difference between the two times is: ' + timeDifference);

					// this should be impossible to achieve
					if(timeDifference < 0)
					{
						nlapiLogExecution('DEBUG', 'time diff is below 0 it is' + timeDifference + " - It has now been changed to 0..");

						timeDifference = 0;
					}

					nlapiLogExecution('DEBUG', 'the difference between the two times is: ' + timeDifference);

					if(timeDifference < 500)
					{
						// NO RATE GIVEN
					}
					if(timeDifference >= 500 && timeDifference < 1000)
					{
						var subsistenceOneMealRateTwo = assistant.addField("subsistenceonemealratetwo", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancetwo");
						partialDayTwoTotal += parseInt(UKOneMealRate);
					}
					else
					{	
						if(timeDifference >= 1000)
						{
							var subsistenceOneMealRateTwo = assistant.addField("subsistenceonemealratetwo", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancetwo");
							var subsistenceTwoMealRateTwo = assistant.addField("subsistencetwomealratetwo", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowancetwo");
							partialDayTwoTotal += parseInt(UKOneMealRate) + parseInt(UKTwoMealRate);
						}
						else
						{
							nlapiLogExecution('ERROR', 'NO TIME DIFFERENCE FOUND')
						}
					}

				}
				else
				{
					var timeDifference = strSplitReturnTime - strSplitTime;
					nlapiLogExecution('DEBUG', 'the difference between the two times is: ' + timeDifference);

					if(timeDifference < 500)
					{
						// NO RATE GIVEN
					}
					if(timeDifference >= 500 && timeDifference < 1000)
					{
						var subsistenceOneMealRateTwo = assistant.addField("subsistenceonemealratetwo", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancetwo");
						partialDayTwoTotal += parseInt(UKOneMealRate);
					}
					else
					{
						if(timeDifference >= 1000)
						{
							var subsistenceOneMealRateTwo = assistant.addField("subsistenceonemealratetwo", "label", "Five hour: " + UKOneMealRate, null, "grouppartialdailyallowancetwo");
							var subsistenceTwoMealRateTwo = assistant.addField("subsistencetwomealratetwo", "label", "Ten hour: " + UKTwoMealRate, null, "grouppartialdailyallowancetwo");
							partialDayTwoTotal += parseInt(UKTwoMealRate) + parseInt(UKOneMealRate);
						}
					}
				}

				// LATE CHECK 

				var lateAwarded = null;

				if(subsistenceDepartureAMPM == 'PM')
				{
					if(strSplitTime >= 800)
					{
						lateAwarded = 1;
						var subsistenceLateNightMealRateTwo = assistant.addField("subsistencelateratetwo", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowancetwo");
						partialDayTwoTotal += parseInt(UKLateEveningRate);
					}
					else
					{
						// do nothing - not above 800
					}
				}

				if (lateAwarded != 1) 
				{
					if (subsistenceReturnAMPM == 'PM') 
					{	
						if (strSplitReturnTime >= 800) 
						{
							var subsistenceLateNightMealRateTwo = assistant.addField("subsistencelateratetwo", "label", "Late: " + UKLateEveningRate, null, "grouppartialdailyallowancetwo");
							partialDayTwoTotal += parseInt(UKLateEveningRate);
						}
						else 
						{
							// do nothing - not above 800
						}
					}
				}		

				// do a check for which is higher day one total or the max claimable
				// this is done so the user gets the highest rate possible	

				if(partialDayTwoTotal>=UKMaxClaimable)
				{
					dayTwoFinalTotal = UKMaxClaimable;
				}
				else
				{
					dayTwoFinalTotal = partialDayTwoTotal;
				}

				var entitlementWhiteLabelTwo = assistant.addField("entitlementwhitelabeltwo", "label", "", null, "grouppartialdailyallowancetwo");
				var subsistencePartialTwoTotal = assistant.addField("subsistencepartialdaytwototal", "label", "Last day entitlement: " + dayTwoFinalTotal, null, "grouppartialdailyallowancetwo");			
			}

			//////////////////////////////////
			// ||****>> UK DEDUCTIONS <<****||
			//////////////////////////////////

			// Check to see if any meals are being claimed for at all
			if(subsistenceMealsTrue == 1)
			{

				var subsistenceBMeal = request.getParameter('custpage_subsistencebmealnumber');
				var subsistenceLMeal = request.getParameter('custpage_subsistencelmealnumber');
				var subsistenceDMeal = request.getParameter('custpage_subsistencedmealnumber');
				var subsistenceEMeal = request.getParameter('custpage_subsistenceemealnumber');

				nlapiLogExecution('DEBUG', 'DATE DIFF', subsistenceDateDiff);
				nlapiLogExecution('DEBUG', 'subsistence B meal', subsistenceBMeal);
				nlapiLogExecution('DEBUG', 'subsistence L meal', subsistenceLMeal);
				nlapiLogExecution('DEBUG', 'subsistence D meal', subsistenceDMeal);
				nlapiLogExecution('DEBUG', 'subsistence E meal', subsistenceEMeal);

				var deductionsTotal = 0;

				var subsistenceDeductBreakfastLabel = assistant.addField("subsistencedeductbreakfast", "label", "Breakfast: " + UKBreakfastRate + " x " + subsistenceBMeal, null, "groupdeductions");
				deductionsTotal += parseInt(UKBreakfastRate*subsistenceBMeal);

				var subsistenceDeductOneMealRate = assistant.addField("subsistencedeductonemealrate", "label", "Lunch: " + UKOneMealRate + " x " + subsistenceLMeal, null, "groupdeductions");
				deductionsTotal += parseInt(UKOneMealRate*subsistenceLMeal);

				var subsistenceDeductTwoMealRate = assistant.addField("subsistencededucttwomealrate", "label", "Dinner: " + UKTwoMealRate + " x " + subsistenceDMeal, null, "groupdeductions");
				deductionsTotal += parseInt(UKTwoMealRate*subsistenceDMeal);

				var	subsistenceDeductLateMealRate = assistant.addField("subsistencedeductlatemealrate","label", "Late meal:" + UKLateEveningRate + " x " + subsistenceEMeal, null, "groupdeductions");
				deductionsTotal += parseInt(UKLateEveningRate*subsistenceEMeal);

				// total deductions label		
				var totalDeductionsLabel = assistant.addField("subsistencedeductlabel","label", "Total deductions:" + deductionsTotal, null, "groupdeductions");		        	

				var subsistenceHiddenBreakfastAmount= assistant.addField("subsistenceamountbreakfast", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(UKBreakfastRate)*parseInt(subsistenceBMeal)); 
				var subsistenceHiddenOneMealAmount= assistant.addField("subsistenceamountonemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(UKOneMealRate)*parseInt(subsistenceLMeal)); 
				var subsistenceHiddenTwoMealAmount= assistant.addField("subsistenceamounttwomeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(UKTwoMealRate)*parseInt(subsistenceDMeal)); 
				var subsistenceHiddenLateMealAmount= assistant.addField("subsistenceamountlatemeal", 'integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(UKLateEveningRate)*parseInt(subsistenceEMeal)); 

			}

			//////////////////////////
			// ||****>> TOTAL <<****||
			//////////////////////////

			var totalOfAll = parseInt(0);

			if(fulldaytotal == null)
			{
				nlapiLogExecution('ERROR', 'FULL DAY TOTAL IS NULL');
				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}	
			else
			{
				Round(fulldaytotal);

				var fullDayTotalLabel = assistant.addField("fulldaytotal", "label", "Full day total: " + fulldaytotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(fulldaytotal);

				var hiddenFullDayTotal = assistant.addField('hiddenfulldaytotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(fulldaytotal));
			}

			if(partialDayOneTotal == null)
			{
				nlapiLogExecution('ERROR', 'PARTIAL DAY ONE TOTAL IS NULL');
				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}	
			else
			{
				Round(dayOneFinalTotal);

				var DayOneTotalLabel = assistant.addField("dayonetotal", "label", "Partial first day total: " + dayOneFinalTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(dayOneFinalTotal);

				var hiddenDayOneTotal = assistant.addField('hiddendayonetotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(dayOneFinalTotal));
			}

			if(partialDayTwoTotal == null)
			{
				nlapiLogExecution('ERROR', 'PARTIAL DAY TWO TOTAL IS NULL');

				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}
			else
			{
				Round(dayTwoFinalTotal);

				var DayTwoTotalLabel = assistant.addField("daytwototal", "label", "Partial last day total: " + dayTwoFinalTotal, null, "grouptotal");
				totalOfAll = totalOfAll + parseInt(dayTwoFinalTotal);

				var hiddenDayTwoTotal = assistant.addField('hiddendaytwototal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(dayTwoFinalTotal));

			}

			if(subsistenceMealsTrue == 1)
			{
				Round(deductionsTotal);

				var totalDeductions = assistant.addField("totaldeductions", "label", "Deductions: -" + deductionsTotal, null, "grouptotal");
				totalOfAll = totalOfAll - parseInt(deductionsTotal);

				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(parseInt(deductionsTotal));

			}
			else
			{
				var hiddenDeductionsTotal = assistant.addField('hiddendeductionstotal','integer', 'hidden').setDisplayType('hidden').setDefaultValue(0);
			}

			parseFloat(totalOfAll);
			Round(totalOfAll);

			var triptotal = assistant.addField("subsistencetriptotal", "label", "Trip total: " +totalOfAll  + " " + baseCurrencyText, null, "grouptotal");

			var subsistenceHiddenTotal = assistant.addField("subsistencehiddentotal", 'text', 'hidden');
			subsistenceHiddenTotal.setDisplayType('hidden');
			subsistenceHiddenTotal.setDefaultValue(totalOfAll); 

			var subsistenceUkTravelHidden = assistant.addField('custpage_uktravel','text', 'hidden');
			subsistenceUkTravelHidden.setDisplayType('hidden');
			subsistenceUkTravelHidden.setDefaultValue(subsistenceUkTravel);

			break; // case 2 end
	}

	var subsistenceHiddenBmeal = assistant.addField("subsistencehiddenbmeal", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceBMeal);
	var subsistenceHiddenLmeal = assistant.addField("subsistencehiddenlmeal", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceLMeal);
	var subsistenceHiddenDmeal = assistant.addField("subsistencehiddendmeal", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceDMeal);
	var subsistenceHiddenEmeal = assistant.addField("subsistencehiddenemeal", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(subsistenceEMeal);

	return assistant;
	
	}
    catch(e)
    {
	nlapiLogExecution('debug', 'subsistenceStepFive ', e);
    }
}

/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function parking(assistant,iteration,lineEdit,baseCurrencyText)
{
	// add step
	assistant.addStep('step1','Enter parking location details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // PARKING STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// Parking fields
				assistant.addFieldGroup("groupParklocation", "Parking Details");
				var parkingLocation = assistant.addField("parkinglocationlocation", "text", "Parking location", null,"groupParklocation").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// rail fields
					var lineParkingLocation = lineRecord.getFieldValue('custrecord_expenseline_prk_location');

					parkingLocation.setDefaultValue(lineParkingLocation);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					parkingLocation.setDefaultValue('');
				}


				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1: // PARKING STEP 2

				var parkingLocation = request.getParameter("custpage_parkingLocation");

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// hidden fields			
				var parkingLocation = assistant.addField("parkinglocationlocation", "text", "hidden").setDisplayType('hidden').setDefaultValue(parkingLocation);

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if(projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var parkingPaymentCurrency = assistant.addField('parkingpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var parkingTransactionCurrency = assistant.addField("parkingtransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var parkingTransactionAmount = assistant.addField("parkingtransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						parkingTransactionAmount.setDefaultValue(lineAmount);
						parkingTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						parkingTransactionCurrency.setDefaultValue('');
						parkingTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}

				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch
	} // if

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function carHire(assistant,iteration,lineEdit,baseCurrencyText)
{
	// add steps
	assistant.addStep('step1','Enter car hire details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // BUS STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// car hire fields
				assistant.addFieldGroup("groupcarhire", "Car Hire Details");
				var carHireDuration = assistant.addField("carhireduration", "integer", "Car hire (No of days)", null,"groupcarhire").setMandatory(true);
				var carHirePoint = assistant.addField("carhirepoint", "text", "Car hire point", null,"groupcarhire").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// rail fields
					var lineCarHireDuration = lineRecord.getFieldValue('custrecord_expenseline_chr_carhire');
					var lineCarHirePoint = lineRecord.getFieldValue('custrecord_expenseline_chr_hirepoint');

					carHireDuration.setDefaultValue(lineCarHireDuration);
					carHirePoint.setDefaultValue(lineCarHirePoint);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					carHireDuration.setDefaultValue('');
					carHirePoint.setDefaultValue('');
				}


				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1:	

				var carHireDuration = request.getParameter("custpage_carHireDuration");
				var carHirePoint = request.getParameter("custpage_carHirePoint");

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// hidden fields			
				var carHireDuration = assistant.addField("carhireduration",'text', 'hidden').setDisplayType('hidden').setDefaultValue(carHireDuration);	
				var carHirePoint = assistant.addField("carhirepoint", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(carHirePoint);		

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var carPaymentCurrency = assistant.addField('carpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var carTransactionCurrency = assistant.addField("cartransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var carTransactionAmount = assistant.addField("cartransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						carTransactionAmount.setDefaultValue(lineAmount);
						carTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						carTransactionCurrency.setDefaultValue('');
						carTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;
		} // switch
	} // if

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function dinner(assistant,iteration,lineEdit,baseCurrencyText)
{
	// Add step
	assistant.addStep('step1','Enter Dinner details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // DINNER STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// dining fields
				assistant.addFieldGroup("groupDining", "Dining Details");
				var dinnerNoOfAttendees = assistant.addField("diningattendeenumber", "integer", "Number of attendees", null,"groupDining").setMandatory(true);
				var dinnerAttendeeNames = assistant.addField("diningattendeenames", "textarea", "Attendee names", null,"groupDining").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					var lineDinnerNoAttendee = lineRecord.getFieldValue('custrecord_expenseline_rss_attno');
					var lineDinnerNameAttendee = lineRecord.getFieldValue('custrecord_expenseline_rss_attnames');

					dinnerNoOfAttendees.setDefaultValue(lineDinnerNoAttendee);
					dinnerAttendeeNames.setDefaultValue(lineDinnerNameAttendee);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					dinnerNoOfAttendees.setDefaultValue('');
					dinnerAttendeeNames.setDefaultValue('');
				}

				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1:	

				nlapiLogExecution('DEBUG', 'Case 1 Dinner');

				// get parameters from previous step
				var dinnerNoOfAttendees = request.getParameter('custpage_dinnerNoOfAttendees');
				var dinnerAttendeeNames = request.getParameter('custpage_dinnerAttendeeNames');

				// store the paramets for the post
				var dinnerNoOfAttendeesHidden = assistant.addField("diningattendeenumber", 'text','hidden').setDisplayType('hidden').setDefaultValue(dinnerNoOfAttendees);
				var dinnerAttendeeNamesHidden = assistant.addField("diningattendeenames", 'textarea', 'hidden').setDisplayType('hidden').setDefaultValue(dinnerAttendeeNames);

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var dinnerPaymentCurrency = assistant.addField('dinnerpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var dinnerTransactionCurrency = assistant.addField("dinnertransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var dinnerTransactionAmount = assistant.addField("dinnertransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						dinnerTransactionAmount.setDefaultValue(lineAmount);
						dinnerTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						dinnerTransactionCurrency.setDefaultValue('');
						dinnerTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} //switch
	} // if

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function taxi(assistant,iteration,lineEdit,baseCurrencyText)
{
	// add step
	assistant.addStep('step1','Enter taxi details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // taxi STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// taxi fields
				assistant.addFieldGroup("grouptaxi", "taxi Details");
				var taxiOrigin = assistant.addField("taxiorigin", "text", "From", null,"grouptaxi").setMandatory(true);
				var taxiDestination = assistant.addField("taxidestination", "text", "To", null,"grouptaxi").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var accomLineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// taxi fields
					var taxiLineOrigin = accomLineRecord.getFieldValue('custrecord_expenseline_txi_from');
					var taxiLineDestination = accomLineRecord.getFieldValue('custrecord_expenseline_txi_to');

					taxiOrigin.setDefaultValue(taxiLineOrigin);
					taxiDestination.setDefaultValue(taxiLineDestination);

					// standard fields
					var accomLineCustomer = accomLineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(accomLineCustomer);
				}
				else
				{
					taxiOrigin.setDefaultValue('');
					taxiDestination.setDefaultValue('');
				}

				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1:	

				var taxiOrigin = request.getParameter("custpage_taxiorigin");
				var taxiDestination = request.getParameter("custpage_taxidestination");

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// hidden fields			
				var taxiOriginHidden = assistant.addField("taxiorigin",'text', 'hidden').setDisplayType('hidden').setDefaultValue(taxiOrigin);	
				var taxiDestinationHidden = assistant.addField("taxidestination", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(taxiDestination);		

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var taxiPaymentCurrency = assistant.addField('taxipaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var taxiTransactionCurrency = assistant.addField("taxitransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var taxiTransactionAmount = assistant.addField("taxitransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						taxiTransactionAmount.setDefaultValue(lineAmount);
						taxiTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						taxiTransactionCurrency.setDefaultValue('');
						taxiTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // Switch
	} // IF

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function bus(assistant,iteration,lineEdit,baseCurrencyText)
{
	// Add step(s)
	assistant.addStep('step1','Enter bus details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // BUS STEP 1

				// set step
				assistant.setCurrentStep(assistant.getStep( "step1") );

				// bus fields
				assistant.addFieldGroup("groupBus", "Bus Details");
				var busOrigin = assistant.addField("busorigin", "text", "From", null,"groupBus").setMandatory(true);
				var busDestination = assistant.addField("busdestination", "text", "To", null,"groupBus").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var accomLineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// bus fields
					var busLineOrigin = accomLineRecord.getFieldValue('custrecord_expenseline_bus_from');
					var busLineDestination = accomLineRecord.getFieldValue('custrecord_expenseline_bus_to');

					busOrigin.setDefaultValue(busLineOrigin);
					busDestination.setDefaultValue(busLineDestination);

					// standard fields
					var accomLineCustomer = accomLineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(accomLineCustomer);
				}
				else
				{
					busOrigin.setDefaultValue('');
					busDestination.setDefaultValue('');
				}

				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);

				break;

			case 1:	

				var busOrigin = request.getParameter("custpage_busorigin");
				var busDestination = request.getParameter("custpage_busdestination");

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// hidden fields			
				var busOriginHidden = assistant.addField("busorigin",'text', 'hidden').setDisplayType('hidden').setDefaultValue(busOrigin);	
				var busDestinationHidden = assistant.addField("busdestination", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(busDestination);		

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var busPaymentCurrency = assistant.addField('buspaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var busTransactionCurrency = assistant.addField("bustransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var busTransactionAmount = assistant.addField("bustransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						busTransactionAmount.setDefaultValue(lineAmount);
						busTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						busTransactionCurrency.setDefaultValue('');
						busTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // Switch
	} // IF

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function rail(assistant,iteration,lineEdit,baseCurrencyText)
{
	// Add step
	assistant.addStep('step1','Enter rail details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{
			case 0: // RAIL STEP 1	

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step1"));

				// Rail fields
				assistant.addFieldGroup("groupRail", "Rail Details");
				var railOrigin = assistant.addField("railorigin", "text", "From", null,"groupRail").setMandatory(true);
				var railDestination = assistant.addField("raildestination", "text", "To", null,"groupRail").setMandatory(true);

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				//increment implementation for next step
				iteration = 1;

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

				if(lineEdit != 0)
				{
					// load the line record
					var accomLineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// rail fields
					var railLineOrigin = accomLineRecord.getFieldValue('custrecord_expenseline_rai_from');
					var railLineDestination = accomLineRecord.getFieldValue('custrecord_expenseline_rai_to');

					railOrigin.setDefaultValue(railLineOrigin);
					railDestination.setDefaultValue(railLineDestination);

					// standard fields
					var accomLineCustomer = accomLineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(accomLineCustomer);
				}
				else
				{
					railOrigin.setDefaultValue('');
					railDestination.setDefaultValue('');
				}


				// hidden iteration field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);	

				break; //case 0

			case 1:	

				var railOrigin = request.getParameter("custpage_railorigin");
				var railDestination = request.getParameter("custpage_raildestination");

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// hidden fields			
				var railOriginHidden = assistant.addField("railorigin",'text', 'hidden').setDisplayType('hidden').setDefaultValue(railOrigin);	
				var railDestinationHidden = assistant.addField("raildestination", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(railDestination);		

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// Amounts & currency
					assistant.addFieldGroup('groupamount','Amount');
					var railPaymentCurrency = assistant.addField('railpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var railTransactionCurrency = assistant.addField("railtransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var railTransactionAmount = assistant.addField("railtransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						railTransactionAmount.setDefaultValue(lineAmount);
						railTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						railTransactionCurrency.setDefaultValue('');
						railTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;
		}
	}	

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function flights(assistant,iteration,lineEdit,baseCurrencyText)
{
	// Add steps
	assistant.addStep('step1','Enter country details');
	assistant.addStep('step2','Enter airport & currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration)) // FLIGHT SWITCH
		{
			case 0: // FLIGHT STEP 1

				// set the step
				assistant.setCurrentStep(assistant.getStep( "step1"));

				// build the assistant
				assistant.addFieldGroup("groupFlight", "Country Details");
				var flightOriginCountry = assistant.addField("flightorigincountry", "select", "From", null,"groupFlight").setMandatory(true);
				var flightStopOverCountry = assistant.addField("flightstopovercountry", "textarea", "Stop over countries", null, "groupFlight");
				var flightDestinationCountry = assistant.addField("flightdestcountry", "select", "Main Destination", null,"groupFlight").setMandatory(true);
				var returnCountry = assistant.addField("flightreturncountry","select","Return?", null, "groupFlight").setMandatory(true);
				returnCountry.addSelectOption('','',true);
				returnCountry.addSelectOption('Yes', 'Yes');
				returnCountry.addSelectOption('No', 'No');	

				// set the iteration for the next step
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

				// search for the times specificed in system
				var flightSearchColumns = new Array();
				// search columns
				flightSearchColumns[0] = new nlobjSearchColumn('custrecord_exp_country');
				flightSearchColumns[1] = new nlobjSearchColumn('internalid');

				// Do the search
				var flightSearchResults = nlapiSearchRecord('customrecord_exp_country', null, null, flightSearchColumns);

				// add results to fields for selection
				if (flightSearchResults != null) 
				{		
					// add default value fields
					flightOriginCountry.addSelectOption('','',true);
					flightDestinationCountry.addSelectOption('','',true);
					// adding search results after the default
					for (var i = 0; i < flightSearchResults.length; i++) 
					{  
						flightOriginCountry.addSelectOption(flightSearchResults[i].getValue(flightSearchColumns[1]),flightSearchResults[i].getValue(flightSearchColumns[0])); 
						flightDestinationCountry.addSelectOption(flightSearchResults[i].getValue(flightSearchColumns[1]),flightSearchResults[i].getValue(flightSearchColumns[0])); 
					}// end for          
				} // end if 

				else
				{
					nlapiLogExecution('DEBUG', 'No Flight Countries Search results found');
				}

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// cflight fields
					var lineFlightFrom = lineRecord.getFieldValue('custrecord_expenseline_fli_from');
					var lineStopCountry = lineRecord.getFieldValue('custrecord_expenseline_fli_stopover');
					var lineMaindest = lineRecord.getFieldValue('custrecord_expenseline_fli_maindest');
					var lineReturn = lineRecord.getFieldValue('custrecord_expenseline_fli_returnyesno');

					flightOriginCountry.setDefaultValue(lineFlightFrom);
					flightStopOverCountry.setDefaultValue(lineStopCountry);
					flightDestinationCountry.setDefaultValue(lineMaindest);
					returnCountry.setDefaultValue(lineReturn);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					flightOriginCountry.setDefaultValue('');
					flightStopOverCountry.setDefaultValue('');
					flightDestinationCountry.setDefaultValue('');
				}

				//Iteration Hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);	

				break;

			case 1: // FLIGHT STEP 2

				// Set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// Get the origin and destin countrys and customer
				var flightsOriginCountry = request.getParameter('custpage_flightorigincountry');
				var flightsDestinationCountry = request.getParameter('custpage_flightdestinationcountry');
				var flightsStopOverCountry = request.getParameter('custpage_flightstopovercountry');
				var flightsReturnCountry = request.getParameter('custpage_flightreturn');
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// Overrule for post method, if this is 0 it does not overrule in post, if 1 it does overule	
				var flightsNoAirport = 0;

				assistant.addFieldGroup("groupFlight", "Flight Details");

				// Search for airports based on origin country
				var flightAirportSearchFilters = new Array();
				var flightAirportSearchColumns = new Array();
				flightAirportSearchFilters[0] = new nlobjSearchFilter('custrecord_exp_airportcountry', null, 'is', flightsOriginCountry);				
				flightAirportSearchColumns[0] = new nlobjSearchColumn('custrecord_exp_airportname');
				flightAirportSearchColumns[1] = new nlobjSearchColumn('internalid');
				flightAirportSearchColumns[2] = flightAirportSearchColumns[0].setSort(); // sort columns by name

				var flightAirportSearchResults = nlapiSearchRecord('customrecord_exp_worldairports', null, flightAirportSearchFilters, flightAirportSearchColumns);

				if (flightAirportSearchResults == null)
				{
					// Tell user the country they selected has no airports associated with it
					var flightsOriginNone = assistant.addField('flightsoriginonelabel', 'label', 'No origin airports found', null);

					// Set the overrule to 1
					flightsNoAirport = 1;	

					// Place the overrule in a field to pass to the post method
					var flightsNoAir = assistant.addField('flightsnoairport', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsNoAirport);
				}

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults != null)
				{

					// If no origin airports found
					if(flightsNoAirport == 1)
					{
						// Do nothing if this condition is met
						nlapiLogExecution('DEBUG', 'No Flight Origin Airport Search Results found');
					}
					else
					{
						// Search for airports based on destination country
						var flightDestAirportSearchFilters = new Array();
						var flightDestAirportSearchColumns = new Array();
						flightDestAirportSearchFilters[0] = new nlobjSearchFilter('custrecord_exp_airportcountry', null, 'is', flightsDestinationCountry);					
						flightDestAirportSearchColumns[0] = new nlobjSearchColumn('custrecord_exp_airportname');
						flightDestAirportSearchColumns[1] = new nlobjSearchColumn('internalid');
						flightDestAirportSearchColumns[2] = flightDestAirportSearchColumns[0].setSort(); // sort columns by name

						var flightDestAirportSearchResults = nlapiSearchRecord('customrecord_exp_worldairports', null, flightDestAirportSearchFilters, flightDestAirportSearchColumns);

						// Checking to see if the destination search results 
						if(flightDestAirportSearchResults == null)
						{
							// Inform the user no destination airports were found in their selected country
							var flightsDestinationNone = assistant.addField('flightsnonelabel', 'label', 'No destination airports found', null);

							// set the overrule to 1
							flightsNoAirport = 1;	

							// Place the overrule in a field to pass to the post method
							var flightsNoAir = assistant.addField('flightsnoairport', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsNoAirport);
						}

						// If no destination airports found
						if(flightsNoAirport == 1)
						{
							// Do nothing if this condition is met
							nlapiLogExecution('DEBUG', 'No Flight Destination Airport Search Results found');
						}

						else
						{	
							// Add origin field
							var flightOriginAirport = assistant.addField("flightoriginairport", "select", "From", null,"groupFlight").setMandatory(true);

							// populate the origin field
							for (var i = 0; i < flightAirportSearchResults.length; i++) 
							{  
								flightOriginAirport.addSelectOption(flightAirportSearchResults[i].getValue(flightAirportSearchColumns[0]),flightAirportSearchResults[i].getValue(flightAirportSearchColumns[0])); 
							}//; end for   

							var flightStopOverAirport = assistant.addField("flightstopoverairport", "textarea", "Stop over airports", null, "groupFlight");

							// add destination field
							var flightDestinationAirport = assistant.addField("flightdestinationairport", "select", "Main Destination", null,"groupFlight").setMandatory(true);

							// populate the destination field
							for (var i = 0; i < flightDestAirportSearchResults.length; i++) 
							{  
								flightDestinationAirport.addSelectOption(flightDestAirportSearchResults[i].getValue(flightDestAirportSearchColumns[0]),flightDestAirportSearchResults[i].getValue(flightDestAirportSearchColumns[0])); 
							}//; end for  


							// Find origin country name
							var flightSearchFilters = new Array();
							var flightSearchColumns = new Array();
							flightSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', flightsOriginCountry);
							flightSearchColumns[0] = new nlobjSearchColumn('custrecord_exp_country');
							var flightSearchResults = nlapiSearchRecord('customrecord_exp_country', null, flightSearchFilters, flightSearchColumns);
							var flightOriginCountry = flightSearchResults[0].getValue(flightSearchColumns[0]);

							// Find destination country name
							var flightDestSearchFilters = new Array();
							var flightDestSearchColumns = new Array();
							flightDestSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', flightsDestinationCountry);
							flightDestSearchColumns[0] = new nlobjSearchColumn('custrecord_exp_country');
							var flightDestSearchResults = nlapiSearchRecord('customrecord_exp_country', null, flightDestSearchFilters, flightDestSearchColumns);
							var flightDestinationCountry = flightDestSearchResults[0].getValue(flightDestSearchColumns[0]);

							// internal ids of flight stuff
							var flightsIDOriCountry = assistant.addField('flightsoriginid', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsOriginCountry);
							var flightsIDDesCountry = assistant.addField('flightsdestinationid', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsDestinationCountry);

							// Put the names found into hidden fields 
							var flightsOriginCountryHidden = assistant.addField('flightsorigin', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightOriginCountry);
							var flightsDestinationCountryHidden = assistant.addField('flightsdestination', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightDestinationCountry);
							var hiddenStopCountry = assistant.addField('stopcountry', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsStopOverCountry);				
							var hiddenReturnCountry = assistant.addField('returncountry', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(flightsReturnCountry);				

							// Amounts & currencys fields
							assistant.addFieldGroup("groupCost", "Flight cost");
							var flightPaymentCurrency = assistant.addField("flightpaymentcurrency","text","Claim to be paid in",null,"groupCost").setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
							var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupCost');
							var flightTransactionCurrency = assistant.addField("flighttransactioncurrency", "select", "Currency you incurred in", "currency", "groupCost").setMandatory(true);		
							var flightTransactionAmount = assistant.addField("flighttransactionamount", "currency", "Amount", null, "groupCost").setMandatory(true);

							// project fields
							assistant.addFieldGroup('groupproject','Project details');
							var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

							// reason field
							assistant.addFieldGroup('groupreason','Expenditure reason');
							var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
							var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

							// add select options to rechargeable field
							rechargeable.addSelectOption('','',true);
							rechargeable.addSelectOption('Yes', 'Yes');
							rechargeable.addSelectOption('No', 'No');	

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

							if(lineEdit != 0)
							{
								// load the line record
								var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

								var lineAirportFrom = lineRecord.getFieldValue('custrecord_expenseline_fli_origairport');
								var lineStopAirport = lineRecord.getFieldValue('custrecord_expenseline_fli_airstopover');
								var lineAirportDest = lineRecord.getFieldValue('custrecord_expenseline_fli_destairport');

								flightOriginAirport.setDefaultValue(lineAirportFrom);
								flightStopOverAirport.setDefaultValue(lineStopAirport);
								flightDestinationAirport.setDefaultValue(lineAirportDest);

								// standard fields
								var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
								var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
								var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
								var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
								var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

								flightTransactionAmount.setDefaultValue(lineAmount);
								flightTransactionCurrency.setDefaultValue(lineTransactionCurrency);
								projectDetails.setDefaultValue(lineProject);
								expReason.setDefaultValue(lineReason);
								rechargeable.setDefaultValue(lineRC);			
							}
							else
							{
								flightOriginAirport.setDefaultValue('');
								flightStopOverAirport.setDefaultValue('');

								flightTransactionCurrency.setDefaultValue('');
								flightTransactionAmount.setDefaultValue('');
								expReason.setDefaultValue('');
							}
						}
					}		
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}

				// hidden fields
				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden');
				iterationHiddenField.setDisplayType('hidden');		
				iterationHiddenField.setDefaultValue(iteration);	

				break;
		} // FLIGHT SWITCH END
	}

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function printStationeryPostage(assistant,iteration,lineEdit,baseCurrencyText)
{
	assistant.addStep('step1', 'Enter details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				// drop down for selection
				assistant.addFieldGroup('groupprinting', 'Adminstration costs');
				var printSelection = assistant.addField('printselection', 'select', 'Please select your admin cost', null,'groupprinting').setMandatory(true);

				printSelection.addSelectOption('','',true);
				printSelection.addSelectOption('Printing', 'Printing');
				printSelection.addSelectOption('Stationery', 'Stationery');	
				printSelection.addSelectOption('Postage', 'Postage');

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// printing fields
					var linePrintSelection = lineRecord.getFieldValue('custrecord_expenseline_psp_admincost');

					printSelection.setDefaultValue(linePrintSelection);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				nlapiLogExecution('DEBUG', 'End of step 1 stationery');

				break;

			case 1: // step 2

				nlapiLogExecution('DEBUG', 'start of step 2 stationery');
				var printSelection = request.getParameter("custpage_printselection");

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var printSelectionHidden = assistant.addField("printselection",'text', 'hidden').setDisplayType('hidden').setDefaultValue(printSelection);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var stationeryPaymentCurrency = assistant.addField('stationerypaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var stationeryTransactionCurrency = assistant.addField("stationerytransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var stationeryTransactionAmount = assistant.addField("stationerytransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						stationeryTransactionAmount.setDefaultValue(lineAmount);
						stationeryTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						stationeryTransactionCurrency.setDefaultValue('');
						stationeryTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}

				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function bankCharges(assistant,iteration,lineEdit,baseCurrencyText)
{

	assistant.addStep('step1', 'Enter details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup('groupcharge','Charge description');
				var chargeReason = assistant.addField('chargereason','textarea','Description of charge',null,'groupcharge').setMandatory(true);

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// bank fields
					var lineChargeReason = lineRecord.getFieldValue('custrecord_expenseline_bnk_chrgdesc');

					chargeReason.setDefaultValue(lineChargeReason);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					chargeReason.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				nlapiLogExecution('DEBUG', 'End of step 1 bank charge');

				break;

			case 1: // step 2

				nlapiLogExecution('DEBUG', 'start of step 2 bank charge');
				var chargeReason = request.getParameter("custpage_chargereason");

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var bankChargeHidden = assistant.addField("bankcharge",'text', 'hidden').setDisplayType('hidden').setDefaultValue(chargeReason);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var bankPaymentCurrency = assistant.addField('bankpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var bankTransactionCurrency = assistant.addField("banktransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var bankTransactionAmount = assistant.addField("banktransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						bankTransactionAmount.setDefaultValue(lineAmount);
						bankTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						bankTransactionCurrency.setDefaultValue('');
						bankTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function computerHardware(assistant,iteration,lineEdit,baseCurrencyText)
{
	assistant.addStep('step1', 'Enter details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup('groupitem','Charge description');
				var itemPurchased = assistant.addField('itempurchased','text','Item purchased?',null,'groupitem').setMandatory(true);

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if (customerSearchResults)
				{
					//add blank select option at top of list
					expCustomer.addSelectOption('','',true);

					for (var i = 0; i < customerSearchResults.length; i++)
					{
						expCustomer.addSelectOption(customerSearchResults[i].getValue(customerSearchColumns[0]),customerSearchResults[i].getValue(customerSearchColumns[1]),false);
					} //for
				} //if

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// computer fields
					var lineItemPurchased = lineRecord.getFieldValue('custrecord_expenseline_chw_itemprch');

					itemPurchased.setDefaultValue(lineItemPurchased);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					itemPurchased.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				break;

			case 1: // step 2

				var itemPurchased = request.getParameter("custpage_itempurchased");

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var itemPurchasedHidden = assistant.addField("itempurchased",'text', 'hidden').setDisplayType('hidden').setDefaultValue(itemPurchased);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var computerPaymentCurrency = assistant.addField('computerpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var computerTransactionCurrency = assistant.addField("computertransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var computerTransactionAmount = assistant.addField("computertransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						computerTransactionAmount.setDefaultValue(lineAmount);
						computerTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						computerTransactionCurrency.setDefaultValue('');
						computerTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end		

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function training(assistant ,iteration,lineEdit,baseCurrencyText)
{
	assistant.addStep('step1', 'Enter training details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup('grouptraining','Training description');
				var descriptionOfTraining = assistant.addField('trainingdescription','textarea','Description of training',null,'grouptraining').setMandatory(true);
				var dateOfTraining = assistant.addField('datetraining','date','Date of training',null,'grouptraining').setMandatory(true);
				var trainingProvider = assistant.addField('trainingprovider', 'text', 'Training provider', null, 'grouptraining').setMandatory(true);

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// training fields
					var lineDescriptionOfTraining = lineRecord.getFieldValue('custrecord_expenseline_trn_desc');
					var lineDateOfTraining = lineRecord.getFieldValue('custrecord_expenseline_trn_date');
					var lineTrainingProvider =  lineRecord.getFieldValue('custrecord_expenseline_trn_prvder');

					descriptionOfTraining.setDefaultValue(lineDescriptionOfTraining);
					dateOfTraining.setDefaultValue(lineDateOfTraining);
					trainingProvider.setDefaultValue(lineTrainingProvider);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					descriptionOfTraining.setDefaultValue('');
					dateOfTraining.setDefaultValue('');
					trainingProvider.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				break;

			case 1: // step 2

				var trainingDescription = request.getParameter("custpage_trainingdescription");
				var dateOfTraining = request.getParameter("custpage_datetraining");
				var trainingProvider = request.getParameter("custpage_trainingprovider");

				nlapiLogExecution('DEBUG','trainingDescription',trainingDescription);
				nlapiLogExecution('DEBUG','dateOfTraining',dateOfTraining);
				nlapiLogExecution('DEBUG','trainingProvider',trainingProvider);

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var trainingDescriptionHidden = assistant.addField("trainingdescription",'text', 'hidden').setDisplayType('hidden').setDefaultValue(trainingDescription);	
				var trainingDateHidden = assistant.addField("trainingdate",'text', 'hidden').setDisplayType('hidden').setDefaultValue(dateOfTraining);	
				var trainingProviderHidden = assistant.addField("trainingprovider",'text', 'hidden').setDisplayType('hidden').setDefaultValue(trainingProvider);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var trainingPaymentCurrency = assistant.addField('trainingpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var trainingTransactionCurrency = assistant.addField("trainingtransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var trainingTransactionAmount = assistant.addField("trainingtransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						trainingTransactionAmount.setDefaultValue(lineAmount);
						trainingTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						trainingTransactionCurrency.setDefaultValue('');
						trainingTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end

	return assistant;
}


/**
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function subscriptions(assistant, iteration, lineEdit, baseCurrencyText)
{
	assistant.addStep('step1', 'Enter subscription details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup('groupsubscription','Subscription description');
				var descriptionofsubscription = assistant.addField('subscriptiondescription','textarea','Description of subscription/membership',null,'groupsubscription').setMandatory(true);
				var periodOfSubscription = assistant.addField('subscriptionperiod','text','Period of subscription/membership',null,'groupsubscription').setMandatory(true);
				var organisationJoined = assistant.addField('organisationjoined', 'text', 'Organisation joined / subscribed to', null, 'groupsubscription').setMandatory(true);

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// subscription fields
					var lineDescriptionOfSub = lineRecord.getFieldValue('custrecord_sub_description');
					var linePeriodOfSub = lineRecord.getFieldValue('custrecord_sub_period');
					var lineOrganisationJoined =  lineRecord.getFieldValue('custrecord_sub_org');

					descriptionofsubscription.setDefaultValue(lineDescriptionOfSub);
					periodOfSubscription.setDefaultValue(linePeriodOfSub);
					organisationJoined.setDefaultValue(lineOrganisationJoined);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					descriptionofsubscription.setDefaultValue('');
					periodOfSubscription.setDefaultValue('');
					organisationJoined.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				break;

			case 1: // step 2

				var descriptionofsubscription = request.getParameter("custpage_subscriptiondescription");
				var periodOfSubscription = request.getParameter("custpage_subscriptionperiod");
				var organisationJoined = request.getParameter("custpage_organisationjoined");

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var subscriptionDescriptionHidden = assistant.addField("subscriptiondescription",'text', 'hidden').setDisplayType('hidden').setDefaultValue(descriptionofsubscription);	
				var periodOfSubscriptionHidden = assistant.addField("subscriptionperiod",'text', 'hidden').setDisplayType('hidden').setDefaultValue(periodOfSubscription);	
				var organisationJoinedHidden = assistant.addField("organisationjoined",'text', 'hidden').setDisplayType('hidden').setDefaultValue(organisationJoined);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var subscriptionPaymentCurrency = assistant.addField('subscriptionpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var subscriptionTransactionCurrency = assistant.addField("subscriptiontransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var subscriptionTransactionAmount = assistant.addField("subscriptiontransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						subscriptionTransactionAmount.setDefaultValue(lineAmount);
						subscriptionTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						subscriptionTransactionCurrency.setDefaultValue('');
						subscriptionTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}

				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end

	return assistant;
}


/**
 * Function: 	customerEntertainment
 * Purpose:		Allows the user to specify the country, city hotel
 * 				and the duration they stayed at hotel for the
 * 				accommodation expense type
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function officeRent(assistant, iteration, lineEdit, baseCurrencyText)
{
	assistant.addStep('step1', 'Enter rent details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup('grouprent','Office rent');
				var officeName = assistant.addField('officename','text','Office',null,'grouprent').setMandatory(true);
				var rentPeriod = assistant.addField('rentperiod','text','Period of rent',null,'grouprent').setMandatory(true);

				// set iteration to 1
				iteration = 1;

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// subscription fields
					var lineOfficeName = lineRecord.getFieldValue('custrecord_expenseline_ofr_office');
					var lineRentPeriod = lineRecord.getFieldValue('custrecord_expenseline_ofr_rentperiod');

					officeName.setDefaultValue(lineOfficeName);
					rentPeriod.setDefaultValue(lineRentPeriod);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					officeName.setDefaultValue('');
					rentPeriod.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			

				break;

			case 1: // step 2

				var officeName = request.getParameter("custpage_officename");
				var rentPeriod = request.getParameter("custpage_rentperiod");

				// Set the step
				assistant.setCurrentStep(assistant.getStep("step2"));

				// hidden fields			
				var officeNameHidden = assistant.addField("officename",'text', 'hidden').setDisplayType('hidden').setDefaultValue(officeName);	
				var rentPeriodHidden = assistant.addField("rentperiod",'text', 'hidden').setDisplayType('hidden').setDefaultValue(rentPeriod);	

				// customer
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & amount fields
					assistant.addFieldGroup('groupamount','Amount');
					var rentPaymentCurrency = assistant.addField('rentpaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var rentTransactionCurrency = assistant.addField("renttransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var rentTransactionAmount = assistant.addField("renttransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						rentTransactionAmount.setDefaultValue(lineAmount);
						rentTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						rentTransactionCurrency.setDefaultValue('');
						rentTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}	

				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				break;

		} // switch end
	} // if end

	return assistant;
}


/**
 * Function: 	accommodation
 * Purpose:		Allows the user to specify the country, city hotel
 * 				and the duration they stayed at hotel for the
 * 				accommodation expense type
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function accommodation(assistant, iteration, lineEdit, baseCurrencyText)
{
	assistant.addStep('step1', 'Enter accommodation details');
	assistant.addStep('step2', 'Enter currency details');
	// Check whether the assistant is finished 
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1		

				// set the step
				assistant.setCurrentStep(assistant.getStep('step1'));

				assistant.addFieldGroup("groupaccommodation", "Accommodation");
				var accomCountry = assistant.addField("accommodationcountry", "select", "Country", null,"groupaccommodation").setMandatory(true);
				var accomCity = assistant.addField("accommodationcity", "text", "City", null, "groupaccommodation").setMandatory(true);
				var accomHotel = assistant.addField("accommodationhotel", "text", "Hotel name", null,"groupaccommodation").setMandatory(true);
				var accomDuration =assistant.addField("accommodationduration", "integer", "Duration (No. of nights)", null,"groupaccommodation").setMandatory(true);

				// search for the times specificed in system
				var accomSearchColumns = new Array();
				// search columns
				accomSearchColumns[0] = new nlobjSearchColumn('name');
				accomSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var accomSearchResults = nlapiSearchRecord('customrecord_exp_country', null, null, accomSearchColumns);
				// set the iteration for the next step
				iteration = 1;

				//add results to fields for selection
				if (accomSearchResults != null) 
				{		
					accomCountry.addSelectOption('','',true);
					for (var i = 0; i < accomSearchResults.length; i++) 
					{  
						accomCountry.addSelectOption(accomSearchResults[i].getValue(accomSearchColumns[0]),accomSearchResults[i].getValue(accomSearchColumns[0])); 
					}//; end for          
				} //end if 
				else
				{
					// if no results found do this
				}

				// customer
				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var accomLineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// accommodation fields
					var accomLineCountry = accomLineRecord.getFieldValue('custrecord_expenseline_acc_country');
					var accomLineCity = accomLineRecord.getFieldValue('custrecord_expenseline_acc_city');
					var accomLineHotelName = accomLineRecord.getFieldValue('custrecord_expenseline_acc_hotelname');
					var accomLineDuration = accomLineRecord.getFieldValue('custrecord_expenseline_acc_duration');

					accomCountry.setDefaultValue(accomLineCountry);
					accomCity.setDefaultValue(accomLineCity);
					accomHotel.setDefaultValue(accomLineHotelName);
					accomDuration.setDefaultValue(accomLineDuration);

					// standard fields
					var accomLineCustomer = accomLineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(accomLineCustomer);
				}
				else
				{
					accomCountry.setDefaultValue('');
					accomCity.setDefaultValue('');
					accomHotel.setDefaultValue('');
					accomDuration.setDefaultValue('');			
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);	

				break;

			case 1:

				// get parameters
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");
				var accommodationCountry  = request.getParameter("custpage_accomodationcountry");
				var accommodationCity = request.getParameter("custpage_accomodationcity");
				var accommodationHotelName = request.getParameter("custpage_accomodationhotel");
				var accommodationDuration = request.getParameter("custpage_accomodationduration");

				// hidden information for print out to screen
				var accomCountry = assistant.addField("accommodationcountry", "text", "hidden").setDisplayType('hidden').setDefaultValue(accommodationCountry);
				var accomCity = assistant.addField("accommodationcity", "text", "hidden").setDisplayType('hidden').setDefaultValue(accommodationCity);
				var accomHotel = assistant.addField("accommodationhotel", "text", "hidden").setDisplayType('hidden').setDefaultValue(accommodationHotelName);
				var accomDuration =assistant.addField("accommodationduration", "text", "hidden").setDisplayType('hidden').setDefaultValue(accommodationDuration);

				// set the step
				assistant.setCurrentStep(assistant.getStep('step2'));

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// currency & Amount
					assistant.addFieldGroup('groupamount','Amount');
					var accomPaymentCurrency = assistant.addField('accommodationpaymentcurrency','text','Claim to be paid in','currency','groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var accomTransactionCurrency = assistant.addField("accomtransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var accomTransactionAmount = assistant.addField("accomtransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var accomLineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var accomLineAmount = accomLineRecord.getFieldValue('custrecord_exp_amount');
						var accomLineTransactionCurrency = accomLineRecord.getFieldValue('custrecord_exp_currincurred');
						var accomLineReason = accomLineRecord.getFieldValue('custrecord_exp_reason');
						var accomLineRC = accomLineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var accomLineProject = accomLineRecord.getFieldValue('custrecord_exp_project');

						accomTransactionAmount.setDefaultValue(accomLineAmount);
						accomTransactionCurrency.setDefaultValue(accomLineTransactionCurrency);
						projectDetails.setDefaultValue(accomLineProject);
						expReason.setDefaultValue(accomLineReason);
						rechargeable.setDefaultValue(accomLineRC);			
					}
					else
					{
						accomTransactionCurrency.setDefaultValue('');
						accomTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}
				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}

				// hidden fields
				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);	

				break;
		}
	}

	return assistant;
}


/**
 * Function: 	customerEntertainment
 * Purpose:		This function operates the expense type customer
 * 				entertainment, it allows the user to specify how many
 * 				attendees went on a dinner outing with them/their		
 * 				company and the names of the attendees.
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function customerEntertainment(assistant, iteration, lineEdit, baseCurrencyText)
{
	nlapiLogExecution('DEBUG','Customer entertainment');
	// Add steps
	assistant.addStep('step1','Enter customer entertaining details');
	assistant.addStep('step2','Enter currency details');

	// Check to see if assistant is finished
	if ( !assistant.isFinished() )
	{
		switch(parseInt(iteration))
		{	
			case 0: // step 1	`

				//set the step
				assistant.setCurrentStep(assistant.getStep( "step1"));

				// set the iteration for the next step
				iteration = 1;

				// Customer entertainment details
				assistant.addFieldGroup("groupEntertaining", "Customer entertaining");		
				var cusEntNoOfAttendees = assistant.addField("customerentattendees", "integer", "Number of attendees", null,"groupEntertaining").setMandatory(true);
				var cusEntAttendeenames = assistant.addField("customerentattendeesnames", "textarea", "Attendee names", null,"groupEntertaining").setMandatory(true);

				assistant.addFieldGroup('groupcustomer','Customer');
				var expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);

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

				if(lineEdit != 0)
				{
					// load the line record
					var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

					// customer entertainment fields
					var cusEntNoAttendees = lineRecord.getFieldValue('custrecord_expenseline_rce_attno');
					var cusEntAttendeeNames = lineRecord.getFieldValue('custrecord_expenseline_rce_attnames');

					cusEntNoOfAttendees.setDefaultValue(cusEntNoAttendees);
					cusEntAttendeenames.setDefaultValue(cusEntAttendeeNames);

					// standard fields
					var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

					expCustomer.setDefaultValue(lineCustomer);
				}
				else
				{
					cusEntNoOfAttendees.setDefaultValue('');
					cusEntAttendeenames.setDefaultValue('');
				}

				// add the iteration hidden field
				var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);				

				break;

			case 1: // step 2	

				nlapiLogExecution('DEBUG','Customer entertainment Step 2');

				// get parameters
				var custEntNoOfAttendees = request.getParameter('custpage_custentnoofattendees');
				var custEntAttendeeNames = request.getParameter('custpage_custentattendeename');
				var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

				// hidden fields for post
				var cusEntNoOfAttendees = assistant.addField("customerentattendees", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(custEntNoOfAttendees);	
				var cusEntAttendeenames = assistant.addField("customerentattendeesnames", 'text', 'hidden').setDisplayType('hidden').setDefaultValue(custEntAttendeeNames);	

				//set the step
				assistant.setCurrentStep(assistant.getStep( "step2"));

				// declare arrays
				var projectSearchFilters = new Array();
				var projectSearchColumns = new Array();

				// search filters
				projectSearchFilters[0] = new nlobjSearchFilter('parent', null, 'is', expenditureCustomer);
				projectSearchFilters[1] = new nlobjSearchFilter('allowexpenses', null, 'is', 'T');
				projectSearchFilters[2] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				// search columns
				projectSearchColumns[0] = new nlobjSearchColumn('entityid');
				projectSearchColumns[1] = new nlobjSearchColumn('internalid');
				// do search
				var projectSearchResults = nlapiSearchRecord('job', null, projectSearchFilters, projectSearchColumns);	

				// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
				var projectoverride = 0;

				// add select options 
				if (projectSearchResults)
				{
					// Amounts & currency
					assistant.addFieldGroup('groupamount','Amount');
					var cusEntPaymentCurrency = assistant.addField('customerentpaymentcurrency','text','Claim to be paid in', null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
					var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
					var cusEntTransactionCurrency = assistant.addField("cusenttransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
					var cusEntTransactionAmount = assistant.addField("custransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

					// project fields
					assistant.addFieldGroup('groupproject','Project details');
					var projectDetails = assistant.addField("projectdetail", 'select', 'Project', null, "groupproject").setMandatory(true);

					// reason field
					assistant.addFieldGroup('groupreason','Expenditure reason');
					var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
					var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

					// add select options to rechargeable field
					rechargeable.addSelectOption('','',true);
					rechargeable.addSelectOption('Yes', 'Yes');
					rechargeable.addSelectOption('No', 'No');	

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

					if(lineEdit != 0)
					{
						// load the line record
						var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

						// standard fields
						var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
						var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
						var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
						var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
						var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

						cusEntTransactionAmount.setDefaultValue(lineAmount);
						cusEntTransactionCurrency.setDefaultValue(lineTransactionCurrency);
						projectDetails.setDefaultValue(lineProject);
						expReason.setDefaultValue(lineReason);
						rechargeable.setDefaultValue(lineRC);			
					}
					else
					{
						cusEntTransactionCurrency.setDefaultValue('');
						cusEntTransactionAmount.setDefaultValue('');
						expReason.setDefaultValue('');
					}

				} //if
				else
				{
					var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
					projectoverride = 1;			
				}

				// hidden fields
				var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
				var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);							 

				nlapiLogExecution('DEBUG','Customer entertainment Step 2 end:');
		}	
	} 

	return assistant;
}


/**
 * Function: 	foreignVisa
 * Purpose:		This function is the main operator of the visa expense type
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function foreignVisa(assistant, iteration, lineEdit, baseCurrencyText)
{
	assistant.addStep('step1', 'Enter visa details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
			//>> FOREIGN VISA STEP 1
			
			case 0: 

				assistant = foreignVisaStepOne(assistant, iteration, lineEdit, baseCurrencyText);
				break;	

				//>> FOREIGN VISA STEP 2
			case 1: 

				assistant = foreignVisaStepTwo(assistant, iteration, lineEdit, baseCurrencyText);		 
				break;

		} // switch end
	} // if end

	return assistant;

} // function end foreignVisa


/**
 * Function: 	foreignVisaStepOne
 * Purpose:		This function is used as part of the foreign visa
 * 				function, it is the first step called in the switch
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function foreignVisaStepOne(assistant, iteration, lineEdit, baseCurrencyText)
{
	// set the step
	assistant.setCurrentStep(assistant.getStep('step1'));

	var visaCountry = null;
	var expCustomer = null;

	assistant.addFieldGroup('groupvisa','Visa details');

	visaCountry = addCountry(visaCountry, assistant);

	var visaDescription = assistant.addField('visadescription','textarea','Description of visa',null,'groupvisa').setMandatory(true);
	var visaDuration = assistant.addField("visaduration", "integer", "Visa duration (Months)", null,"groupvisa").setMandatory(true);

	// set iteration to 1
	iteration = 1;

	expCustomer = addCustomerField(expCustomer, assistant);

	if(lineEdit != 0)
	{
		// load the line record
		var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

		// subscription fields
		var lineVisaCountry = lineRecord.getFieldValue('custrecord_expenseline_vis_country');
		var lineVisaDescription = lineRecord.getFieldValue('custrecord_expenseline_vis_visadesc');
		var lineVisaDuration =  lineRecord.getFieldValue('custrecord_expenseline_vis_visaduration');

		visaCountry.setDefaultValue(lineVisaCountry);
		visaDescription.setDefaultValue(lineVisaDescription);
		visaDuration.setDefaultValue(lineVisaDuration);

		// standard fields
		var lineCustomer = lineRecord.getFieldValue('custrecord_exp_customer');

		expCustomer.setDefaultValue(lineCustomer);
	}
	else
	{
		visaCountry.setDefaultValue('');
		visaDescription.setDefaultValue('');
		visaDuration.setDefaultValue('');
	}

	// add the iteration hidden field
	var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);				

	return assistant;
}


/**
 * Function: 	foreignVisaStepTwo
 * Purpose:		This function is used as part of the foreign visa
 * 				function, it is the second step called in the switch
 * 
 * @param assistant
 * @param iteration
 * @param lineEdit
 * @param baseCurrencyText
 * @returns
 */
function foreignVisaStepTwo(assistant, iteration, lineEdit, baseCurrencyText)
{
	var visaCountry = request.getParameter("custpage_visacountry");
	var visaDescription = request.getParameter("custpage_visadescription");
	var visaDuration = request.getParameter("custpage_visaduration");

	// Set the step
	assistant.setCurrentStep(assistant.getStep("step2"));

	// hidden fields			
	var visaCountryHidden = assistant.addField("visacountry",'text', 'hidden').setDisplayType('hidden').setDefaultValue(visaCountry);	
	var visaDescriptionHidden = assistant.addField("visadescription",'text', 'hidden').setDisplayType('hidden').setDefaultValue(visaDescription);	
	var visaDurationHidden = assistant.addField("visaduration",'text', 'hidden').setDisplayType('hidden').setDefaultValue(visaDuration);	

	// customer
	var expenditureCustomer = request.getParameter("custpage_expenditurecustomer");

	var projectSearchResults = null;

	// declare arrays
	var projectSearchFilters = new Array();
	var projectSearchColumns = new Array();

	projectSearchResults = projectSearch(assistant, expenditureCustomer, projectSearchResults, projectSearchFilters,projectSearchColumns)

	// this will stop 'finish' from working if no project is found and will be set to 1 should this happen
	var projectoverride = 0;

	// add select options 
	if (projectSearchResults)
	{
		// currency & amount fields
		assistant.addFieldGroup('groupamount','Amount');
		var visaPaymentCurrency = assistant.addField('visapaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
		var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
		var visaTransactionCurrency = assistant.addField("visatransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
		var visaTransactionAmount = assistant.addField("visatransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

		var projectDetails = null;

		projectDetails = addProjectField(assistant, projectDetails,projectSearchResults, projectSearchFilters, projectSearchColumns);

		// reason field
		assistant.addFieldGroup('groupreason','Expenditure reason');
		var expReason = assistant.addField('expenditurereason','textarea','Reason',null,'groupreason').setMandatory(true);
		var rechargeable = assistant.addField('rechargeable', 'select', ' Rechargeable to customer?', null, 'groupreason').setMandatory(true);

		// add select options to rechargeable field
		rechargeable.addSelectOption('','',true);
		rechargeable.addSelectOption('Yes', 'Yes');
		rechargeable.addSelectOption('No', 'No');	


		if(lineEdit != 0)
		{
			// load the line record
			var lineRecord = nlapiLoadRecord('customrecord_expenseline', lineEdit);

			// standard fields
			var lineAmount = lineRecord.getFieldValue('custrecord_exp_amount');
			var lineTransactionCurrency = lineRecord.getFieldValue('custrecord_exp_currincurred');
			var lineReason = lineRecord.getFieldValue('custrecord_exp_reason');
			var lineRC = lineRecord.getFieldValue('custrecord_exp_rechrgtocust');
			var lineProject = lineRecord.getFieldValue('custrecord_exp_project');

			visaTransactionAmount.setDefaultValue(lineAmount);
			visaTransactionCurrency.setDefaultValue(lineTransactionCurrency);
			projectDetails.setDefaultValue(lineProject);
			expReason.setDefaultValue(lineReason);
			rechargeable.setDefaultValue(lineRC);			
		}
		else
		{
			visaTransactionCurrency.setDefaultValue('');
			visaTransactionAmount.setDefaultValue('');
			expReason.setDefaultValue('');
		}

	} //if
	else
	{
		var noProject = assistant.addField('noproject', 'label', 'No projects found', null);
		projectoverride = 1;			
	}	

	var hiddencustomer = assistant.addField('customer', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(expenditureCustomer);				
	var hiddenoverride = assistant.addField('projectoverride', 'text', 'hidden').setDisplayType('hidden').setDefaultValue(projectoverride);		

	return assistant;
}


/**AAF - ADDITIONAL FUNCTIONS
 * 
 * @param visaCountry
 * @param assistant
 * @returns
 */
function addCountry(visaCountry, assistant)
{
	visaCountry = assistant.addField("visacountry", "select", "Country", null,"groupvisa").setMandatory(true);
	// search for the times specificed in system
	var visaSearchColumns = new Array();
	// search columns
	visaSearchColumns[0] = new nlobjSearchColumn('name');
	visaSearchColumns[1] = new nlobjSearchColumn('internalid');
	// do search
	var visaSearchResults = nlapiSearchRecord('customrecord_exp_country', null, null, visaSearchColumns);
	// set the iteration for the next step
	iteration = 1;

	//add results to fields for selection
	if (visaSearchResults != null) 
	{		
		visaCountry.addSelectOption('','',true);
		for (var i = 0; i < visaSearchResults.length; i++) 
		{  
			visaCountry.addSelectOption(visaSearchResults[i].getValue(visaSearchColumns[0]),visaSearchResults[i].getValue(visaSearchColumns[0])); 
		}//; end for          
	} //end if 
	else
	{
		// if no results found do this
	}		

	return visaCountry;
}


/**
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
 * @param assistant
 * @param projectDetails
 * @param projectSearchResults
 * @param projectSearchFilters
 * @param projectSearchColumns
 * @returns
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


/**
 * @param value
 * @returns
 */
function Round(value)
{
	var n = value;
	n += 0.5;
	n = parseInt(n);

	return n;
}


/**
 * @param value
 * @param multiple
 * @returns
 */
function mRound(value, multiple)
{
	var n = value;

	if((n <= 0.5) && (n >=0))
	{
		return 0;
	}

	if(n > 0)        
		return Math.ceil(n/multiple) * multiple;    
	else if( n < 0)        
		return Math.floor(n/multiple) * multiple;    
	else        
		return multiple;
}


/**
 * function toFixed: round to specified decimal place
 * Usage: To round 42.14446 to 3 decimal places, you execute toFixed(42.14446, 3). The return value will be 42.144.
 * To round it DOWN, you need to subtract 0.0005 (=42.14396). Executing the above would then return 42.143.
 * To round it UP, you ADD 0.0005 (=42.14496) which, as it would still not be to the next number, still return 42.144. 
 * 
 * @param value
 * @param precision
 * @returns
 */
function toFixed(value, precision)
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


/**
 * function escapeString(str)
 * Usage: This function will manually escape a string
 * escaping instances of line break and carriage return
 * into a single \\n
 * 
 * @param str
 * @returns
 */
function escapeString(str)
{

	str=str.replace(/\n/g,'\\n');
	str=str.replace(/\r/g,'');

	return str;
}


/**
 * function reduceString(str)
 * Usage: This function will manually escape a string
 * escaping instances of line break and replacing them
 * with a whitespace.  Use for converting a textarea
 * to a free text field.
 * 
 * @param str
 * @returns
 */
function reduceString(str)
{
	str=str.replace(/\n/g,' ');
	str=str.replace(/\r/g,'');

	return str;
}


/**
 * usage: removes apostrophes from code
 * 
 * @param str
 * @returns
 */
function escapeApos(str)
{
	str=str.replace("'","\\'");

	return str;
}


/**
 * @param str
 * @returns
 */
function escapeNewLine(str)
{
	nlapiLogExecution('DEBUG','The string is: ' + str);
	str=str.replace(/\\n/gi, " ");
	nlapiLogExecution('DEBUG','**ESCAPED** The string is now: ' + str);
	return str;
}


/**
 * if total miles and numbers of miles is greater than break point
 * take the breakpoint away from total miles and put into var band1miles
 * take the remainder of these miles (band1miles) from total miles
 * take the remainder of this and do it by the lower rate / mile
 * then take the band1miles and do that by higher rate
 * add them together **Future note: all cases will be joined together, seperate for testing purposes
 * 
 * 3.4.19 - trace code added
 * 
 * 
 * @param breakPoint
 * @param band1Rate
 * @param band2Rate
 * @param noOfMiles
 * @param totalMiles
 * @returns {Number}
 */
function mileageCalculation(breakPoint, band1Rate, band2Rate, noOfMiles, totalMiles)
{

	var claimAmount = 0;
	
	
	nlapiLogExecution('DEBUG', 'Function: mileageCalculation ** Var: totalMiles', totalMiles);
	nlapiLogExecution('DEBUG', 'Function: mileageCalculation ** Var: breakPoint', breakPoint);

	nlapiLogExecution('DEBUG', 'Function: mileageCalculation ** Var: band1Rate', band1Rate);
	nlapiLogExecution('DEBUG', 'Function: mileageCalculation ** Var: band2Rate', band2Rate);
	nlapiLogExecution('DEBUG', 'Function: mileageCalculation ** Var: noOfMiles', noOfMiles);

	if(totalMiles > breakPoint)
	{
		claimAmount = noOfMiles * band2Rate;	
	}
	else
	{
		if(totalMiles + noOfMiles < breakPoint)
		{
			claimAmount = noOfMiles * band1Rate;
		}
		else
		{
			if(totalMiles + noOfMiles >= breakPoint)
			{
				var band1Miles = breakPoint - totalMiles;
				var newTotalMiles = noOfMiles - band1Miles;				
				var lowRateMiles = newTotalMiles * band2Rate;
				var highRateMiles = band1Miles * band1Rate;

				claimAmount = lowRateMiles + highRateMiles;			
			}
		}	
	}

	return claimAmount;
}


/**
 * Function: checkDate
 * usage: prevents the user from specifying return date before departure date
 * 
 * @param departDate
 * @param returnDate
 * @returns {Number}
 */
function checkDate(departDate,returnDate)
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


/**
 * Function: dateDiff
 * usage: finds the difference between 2 dates in unix time and then returns this in days
 * 
 * @param departDate
 * @param returnDate
 * @returns {Number}
 */
function dateDiff(departDate, returnDate)
{
	nlapiLogExecution('DEBUG', 'depart date', departDate);
	nlapiLogExecution('DEBUG', 'return date', returnDate);

	var dateDiffRound = 0;

	//var USdepart = convertMonth(departDate, 'netsuite');
	//var USreturn = convertMonth(returnDate, 'netsuite');

	var newDepartDate = nlapiStringToDate(departDate);
	var newReturnDate = nlapiStringToDate(returnDate);	

	var datDepart = Date.parse(newDepartDate);
	var datReturn = Date.parse(newReturnDate);

	nlapiLogExecution('DEBUG', 'datDepart: ' + datDepart);
	nlapiLogExecution('DEBUG', 'datReturn: ' + datReturn);

	var dateDifference = ((datReturn - datDepart)/(24*60*60*1000)-1);
	nlapiLogExecution('DEBUG', 'dateDifference', dateDifference);

	if(dateDifference > -1)
	{
		dateDiffRound = Round(dateDifference, 1)
		nlapiLogExecution('DEBUG', 'dateDiffRound', dateDiffRound);
	}
	else 
	{
		dateDiffRound = dateDifference;
	}


	return dateDiffRound;
}
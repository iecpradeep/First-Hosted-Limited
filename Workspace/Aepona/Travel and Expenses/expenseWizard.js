/*******************************************
 * Name:	 Expense Report Customisations
 * Author:   FHL - D Birt - A Nixon - P Lewis
 * Client: 	 Aepona
 * Date:     05 March 2012
 * Version:  3.4.08 - Maintenance 1 version
 ********************************************/

var expenseCategoryText;
var assistant;
var expCustomer;
var interation;

/*************************************************************
 * Popup expensewizard
 * The wizard uses the parameters from the pop-up
 *************************************************************/
function expenseWizard(request, response)
{
	var expenseCategory=22;

	initialise();
	
	/*************************************************************
	 * Get method
	 * Information is retrieved into the get method
	 *************************************************************/

	if (request.getMethod() == 'GET')
	{	

		// Switch Based on the selected expense type    
		switch(parseInt(expenseCategory))
		{
			// --- VISA ---
			case 22: 
				
				visa();
				break;
	
				// --- Office rent ---
		
		}
	}
	/**********************************
	 * 			POST method			  *
	 * 								  *
	 **********************************/

	else
	{
	}
}


/*********************************************
 * Function: initialise
 * usage: prevents the user from specifying return date before departure date
 */

function initialise()
{
	nlapiLogExecution('DEBUG', 'Script start', null);

	//get the name of the expense type
	expenseCategoryText = request.getParameter('custpage_expensecategorytext');

	//get the type of the expense category
	assistant = nlapiCreateAssistant("Expense Wizard - " + expenseCategoryText, true);
	assistant.setOrdered( true );
	iteration=0;
}


/*********************************************
 * Function: visa expense pages
 * usage: prevents the user from specifying return date before departure date
 */

function visa()
{
	
	// set left side steps
	assistant.addStep('step1', 'Enter visa details');
	assistant.addStep('step2', 'Enter currency details');

	if (!assistant.isFinished())
	{
		switch(parseInt(iteration))
		{	
		case 0: // enter visa details step 1	

			visaStep1();
			break;

		case 1: // enter currency details

			visaStep2();
			break;

		} 
	} 

}


/*********************************************
 * Function: visa page 1
 * usage: prevents the user from specifying return date before departure date
 */


function visaStep1()
{
	
	// set the step
	assistant.setCurrentStep(assistant.getStep('step1'));

	//==============================================
	// add the visa details group and fields
	//==============================================
	assistant.addFieldGroup('groupvisa','Visa details');
	var visaCountry = assistant.addField("visacountry", "select", "Country", null,"groupvisa").setMandatory(true);
	var visaDescription = assistant.addField('visadescription','textarea','Description of visa',null,'groupvisa').setMandatory(true);
	var visaDuration = assistant.addField("visaduration", "integer", "Visa duration (Months)", null,"groupvisa").setMandatory(true);

	// set iteration to 1 - this means the second page will be displayed after the postback
	iteration = 1;
	
	loadCountrys(visaCountry);		// load countrys into visaCountry
	
	//==============================================
	// customer group and fields
	//==============================================
	assistant.addFieldGroup('groupcustomer','Customer');
	expCustomer = assistant.addField('expenditurecustomer','select','Customer',null,'groupcustomer').setMandatory(true);
	loadCustomers(expCustomer);	// load customers into expCustomer
	
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
		
		// clear values
		visaCountry.setDefaultValue('');
		visaDescription.setDefaultValue('');
		visaDuration.setDefaultValue('');
	}

	// add the iteration hidden field
	var iterationHiddenField = assistant.addField('custpage_iteration','text','hidden').setDisplayType('hidden').setDefaultValue(iteration);			


}



/*********************************************
 * Function: visa page 1
 * usage: prevents the user from specifying return date before departure date
 */

function visaStep2()
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
		var visaPaymentCurrency = assistant.addField('visapaymentcurrency','text','Claim to be paid in',null,'groupamount').setMandatory(true).setDisplayType('Disabled').setDefaultValue(baseCurrencyText);
		var whitespace = assistant.addField('whitespace', 'label', '', null ,'groupamount');
		var visaTransactionCurrency = assistant.addField("visatransactioncurrency", "select", "Currency you incurred in", "currency", "groupamount").setMandatory(true);
		var visaTransactionAmount = assistant.addField("visatransactionamount", "currency", "Amount", null, "groupamount").setMandatory(true);

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




}


/*********************************************
 * Function: load customers
 * usage: prevents the user from specifying return date before departure date
 */

function loadCustomers(customer)
{
	

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
		customer.addSelectOption('','',true);

		for (var i = 0; i < customerSearchResults.length; i++)
		{
			customer.addSelectOption(customerSearchResults[i].getValue(customerSearchColumns[0]),customerSearchResults[i].getValue(customerSearchColumns[1]),false);
		} 
	} 


}






/************************************************************************
 *	Name:		paymentProposal
 *	Script Type:	Suitelet
 *	Client: Optegra
 *
 *	Version:	1.0.0 - 21/09/2012  
 *				1.0.1 - 01/11/2012 - Searching for expense reports - AS 
 *				1.0.2 - 04/12/2012 - Get credits - JM
 *				1.0.3 - 12/03/2013 - Set Bill credit reference to Invoice reference field in custom record set - SA
 *				1.1.0 - 08/04/2013 - Added a function to store the current employee name and the chosen location - SA
 *				1.1.1 - 11/04/2013 - brought Library function to Optegra project, so removed the error handler function from this script - SA
 *				1.1.2 - 11/04/2013 - Added a function which calls proposalmaintenance.js (suitlet) inorder to redirect proposal maintenance screen with default location filter. - SA
 *			
 *	Author:	FHL (AS)
 * 	Purpose:	To create the payment proposal
 * 
 * note : make sure the proposalMaintenance.js Suitelet deployment id is correct in the particular environment.
 * 
 * Script: customscriptcustomscript_paymentproposal
 * Deploy: ustomdeploy_payment_proposal_depolyment	 - Payment Proposal Script
 * 
 **********************************************************************/

//Declaring the global variables
var searchTransBills =new Array();
var searchTransExps =new Array();
var tranFilsBills = new Array();
var tranFilsExps = new Array();
var tranCols = new Array();
var arrayIndex = 0;
var allTransactions = new Array();
var tranFilsCredits = new Array();
var searchTransCredits = new Array();
var creatingCusRecord = null;
var fxAmtRemain = 0;
var tranIntID = 0;
var tranStatus = '';
var transType = '';

var fxamt = 0;
var amt = 0;
var amtRemain = 0;

var location =null;
var currentEmployee = null;

var context = null;
var environment = null;


/**********************************************************************
 * The Main Function 
 * 1.1.2 - 1.1.2 - Added a function which calls proposalmaintenance.js inorder to redirect proposal maintenance screen with default location filter - SA
 * @param request
 * @param response
 * 
 *********************************************************************/
function paymentProposal(request, response)
{
	//Declaring local variables
	var subsidiary = 0;

	//Getting the subsidiary of the logged in user
	subsidiary= nlapiGetSubsidiary();
	// 1.1.2 - for redirectToProposalMaintenance() block
	context = nlapiGetContext();
	environment = context.getEnvironment();

	//GET Call
	if ( request.getMethod() == 'GET') 
	{
		//Calling the createProposalForm function
		createProposalForm(subsidiary);
	}

	//POST call
	else
	{
		//Calling the createSavedSearch function
		createSavedSearch(subsidiary);

		storeChosenLocation();

		// 1.1.2
		redirectToProposalMaintenance();
	}

}


/**********************************************************************
 * createProposalForm function - Creating the interface for user to
 * 								 enter the data
 * 
 * 
 *	@param subsidiary
 * 
 **********************************************************************/
function createProposalForm(subsidiary)
{	
	//Declaring local variables
	var pPForm =null; 
	var locationField =null;
	var accountField =null;
	var dueDateField=null;
	var okButton=null;
	var cancelButton =null;	

	try
	{
		// Creating the form
		pPForm = nlapiCreateForm('Payment Proposal - Select Payments');

		// creating and adding the date fields to the form
		dueDateField = pPForm.addField('duedate', 'date', 'Due Date : ');
		dueDateField.setHelpText('Select the transactions\'\ due date you wish to obtain.', false);									//Setting the help text to the 'Due Date' Field 

		// Creating and adding the location field to the form as a select list
		locationField = pPForm.addField('location', 'multiselect', 'Location', null);
		locationField.setDisplaySize(150, 15);
		locationField.setHelpText('Select the location to obtain the transactions associated with', false);							//Setting the help text to the 'Location' Field 

		// Finding Locations(to find the location according to the user's subsidiary)
		findLocations(locationField, subsidiary);

		// Creating and adding the account field to the form as a multi-select list
		accountField = pPForm.addField('apaccount', 'multiselect','A/P Account', null);
		accountField.setDisplaySize(315, 8); 																						// Setting the display size of the multi-select box
		accountField.setHelpText('Select the \'Accounts Payable\' accounts to obtain the transactions associated with.\n\n'+ 
				'You can select multiple A/P Accounts by pressing \'Ctrl\' while selecting.', false);								//Setting the help text to the 'A/P Account' Field 

		// Finding the A/P Accounts(to find the A/P Accounts according to the user's subsidiary)
		findApAccounts(accountField, subsidiary);

		// setting the layouts of the fields
		dueDateField.setLayoutType('startrow', 'startcol');
		locationField.setLayoutType('startrow', 'startcol');
		accountField.setLayoutType('startrow', 'startcol');

		// Setting the fields mandatory
		locationField.setMandatory(true);
		accountField.setMandatory(true);
		dueDateField.setMandatory(true);

		// creating and adding the buttons
		okButton = pPForm.addSubmitButton('OK');
		cancelButton = pPForm.addButton('cancel', 'Cancel', 'history.back()');

		// writing the fields and buttons as a whole
		response.writePage(pPForm);

	}
	catch(e)
	{
		errorHandler("createProposalForm : " +e);
	} 
}

/**********************************************************************
 * findLocations Function - Finding locations related with the user's subsidiary to display in the 
 * 							'location' select field
 * 
 * 	@param locField
 * 	@param subsidiary
 * 
 **********************************************************************/
function findLocations(locField,subsidiary)
{
	//Declaring the local variables
	var locName= null ;
	var intId=null;
	var searchLoc = new Array();
	var locFilter = new Array();
	var locCol = new Array();

	try
	{
		//Adding filters to search the related active locations in user's subsidiary 
		locFilter[1] = new nlobjSearchFilter('subsidiary',null, 'anyof',subsidiary); 		//filtering by user's subsidiary  
		locFilter[0] = new nlobjSearchFilter('isinactive',null, 'is','F');					//filtering by active locations

		//Getting particular columns in location search results 
		locCol[0] = new nlobjSearchColumn('name');											//Getting location Name
		locCol[1] = new nlobjSearchColumn('internalid');									//Getting location's internal ID

		//Searching the locations using filters and columns 
		searchLoc = nlapiSearchRecord('location', null, locFilter, locCol);		

		if(searchLoc != null)
		{
			// Getting the values of particular columns returned from search results
			for(var index=0; index <searchLoc.length; index++)
			{
				// Getting the location name
				locName = searchLoc[index].getValue(locCol[0]);

				// Getting the internal ID of the location
				intId = searchLoc[index].getValue(locCol[1]);

				// Adding each location to the 'select' list
				locField.addSelectOption(intId, locName, false);

			}
		}
	}
	catch(e)
	{
		errorHandler("findLocations : " +e);
	} 
}




/**********************************************************************
 * findApAccounts Function - Finding A/P Accounts related with the user's subsidiary to display in the 
 * 							 'A/P Account' multi-select field
 * 
 * @param accField
 * @param subsidiary
 * 
 **********************************************************************/
function findApAccounts(accField,subsidiary)
{
	//Declaring the local variables
	var accFilter = new Array();
	var accCol = new Array();
	var apAccount =null;
	var accIntId=null;
	var searchAcc =new Array();

	try
	{
		//Adding filters to, search the related active payable accounts in user's subsidiary 
		accFilter[1] = new nlobjSearchFilter('subsidiary',null, 'anyof',subsidiary); 		//Filtering by user's subsidiary
		accFilter[2] = new nlobjSearchFilter('type', null, 'is', 'AcctPay');				//filtering by account type of 'account payable'
		accFilter[0] = new nlobjSearchFilter('isinactive',null, 'is','F');					//filtering by active accounts

		//Getting particular columns in accounts search results 
		accCol[0] = new nlobjSearchColumn('name');											//Getting account name
		accCol[1] = new nlobjSearchColumn('internalid');									//Getting the account's internal ID

		//Searching the accounts using filters and columns 
		searchAcc = nlapiSearchRecord('account', null, accFilter, accCol);

		//Getting the values of particular columns returned from search results
		for(var index=0; index < searchAcc.length; index++)
		{
			//Getting the account name
			apAccount = searchAcc[index].getValue(accCol[0]);

			//Getting the account's internal ID 
			accIntId = searchAcc[index].getValue(accCol[1]);

			//Adding each account to the 'multi-select' list
			accField.addSelectOption(accIntId, apAccount, false);

		}
	}
	catch(e)
	{
		errorHandler("findApAccounts : " +e);
	} 

}



/**********************************************************************
 * 
 * createSavedSearch Function - creating a saved search depending on 
 * 								the customer inputs
 * 
 * 1.0.2 - 04/12/2012 - Get credits
 * @param subsidiary
 * 
 *********************************************************************/
function createSavedSearch(subsidiary)
{

	//Calling the SearchBills Function to search the bills
	searchBills(subsidiary);

	searchCredits(subsidiary);	// 1.0.2 - 04/12/2012 - Get credits

	//Calling the searchExpRpts Function to search the expense reports and the vendor bills
	searchExpRpts(subsidiary);

	try
	{ 
		//Creating custom record - payment proposal
		creatingCusRecord =nlapiCreateRecord('customrecord_payment_proposal');

		//if allTransactions array is not empty
		if(allTransactions != null)
		{
			//looping through the transaction search results
			for(var index =1; index<=allTransactions.length; index++)
			{ 
				fxamt = allTransactions[index-1].getValue(tranCols[9]);							//Getting the amount (Foreign Currency) value
				amt = allTransactions[index-1].getValue(tranCols[14]);							//Getting the amount value
				amtRemain = allTransactions[index-1].getValue(tranCols[11]);					//Getting the amount remaining value

				//to ignore the 'division by 0' error
				if (amt != 0)
				{
					fxAmtRemain = ((fxamt/amt))*amtRemain;										//Calculating the amount remaining (Foreign Currency)
				}

				tranIntID = allTransactions[index-1].getValue(tranCols[15]);					//Getting the transaction's internal ID
				tranStatus = allTransactions[index-1].getValue(tranCols[10]);					//Getting the transaction's status
				transType =allTransactions[index-1].getValue(tranCols[4]);						//Getting the transaction type

				// set fields for new record

				setFields(index,tranIntID);

			}
		}

	}
	catch(e)
	{
		errorHandler("createSavedSearch : " +e);
	} 

}


/**********************************************************************
 * set fields for custom record set 
 * 
 * 1.0.3 - 12/03/2013 - Set Bill credit reference to Invoice reference field in custom record set - SA
 *********************************************************************/

function setFields(index,tranIntID)
{

	//********************************************************************************
	// check if the transaction is already in the payment proposal list and check for the open bills
	//	and expense reports approved by accountant
	//
	//********************************************************************************
	if(checkIfAlreadyAdded(tranIntID) == false)
	{

		if((tranStatus == 'approvedByAcct' && transType == 'ExpRept') || (tranStatus == 'open' && transType == 'VendBill') )
		{
			//setting field values of custom record- payment proposal and submitting the record
			creatingCusRecord.setFieldValue('custrecord_invoiceno', allTransactions[index-1].getValue(tranCols[0])); 			//Set Field value for 'Invoice Number -Supplier ref'
			creatingCusRecord.setFieldValue('custrecord_optinvoiceno', allTransactions[index-1].getValue(tranCols[1])); 		//Set Field value for 'Optegra Invoice Number'
			creatingCusRecord.setFieldValue('custrecord_transdate', allTransactions[index-1].getValue(tranCols[2]));			//Set Field value for 'Transaction Date'
			creatingCusRecord.setFieldValue('custrecord_vendname', allTransactions[index-1].getText(tranCols[5]));				//Set Field value for 'Payee Reference'
			creatingCusRecord.setFieldValue('custrecord_datedue', allTransactions[index-1].getValue(tranCols[3]));				//Set Field value for 'Date Due'
			creatingCusRecord.setFieldValue('custrecord_invoice_amount', allTransactions[index-1].getValue(tranCols[9]));		//Set Field value for 'Invoice amount'
			creatingCusRecord.setFieldValue('custrecord_location', allTransactions[index-1].getValue(tranCols[6]));				//Set Field value for 'location'
			creatingCusRecord.setFieldValue('custrecord_currency', allTransactions[index-1].getText(tranCols[12]));				//Set Field value for 'Currency'
			creatingCusRecord.setFieldValue('custrecord_amtremaining', fxAmtRemain);											//Set Field value for 'Amount Remaining'
			creatingCusRecord.setFieldValue('custrecord_creditnoteamt', '');													//Set Field value for 'credit Note Amonut'
			creatingCusRecord.setFieldValue('custrecord_includeexclude','T');													//Set Field value for 'Include/Exclude'
			creatingCusRecord.setFieldValue('custrecord_processedpayment', 'F');												//Set Field value for 'Processed payment'
			creatingCusRecord.setFieldValue('custrecord_transinternalid', tranIntID);											//Set Field value for 'Transaction Internal ID'
			creatingCusRecord.setFieldValue('custrecord_trantype', allTransactions[index-1].getText(tranCols[4]));				//Set Field value for 'Transaction type'

			//Submitting the record
			nlapiSubmitRecord(creatingCusRecord,false, true);	
		}

		else if((transType == 'VendCred') && (fxAmtRemain > 0))
		{
			//setting field values of custom record- payment proposal and submitting the record 

			//Set Field value for 'Invoice Number -Supplier ref'   : version 1.0.3 
			creatingCusRecord.setFieldValue('custrecord_invoiceno', allTransactions[index-1].getValue(tranCols[0])); 			//Set Field value for 'Invoice Number -Supplier ref'
			creatingCusRecord.setFieldValue('custrecord_optinvoiceno', allTransactions[index-1].getValue(tranCols[1])); 		//Set Field value for 'Optegra Invoice Number'
			creatingCusRecord.setFieldValue('custrecord_transdate', allTransactions[index-1].getValue(tranCols[2]));			//Set Field value for 'Transaction Date'
			creatingCusRecord.setFieldValue('custrecord_vendname', allTransactions[index-1].getText(tranCols[5]));				//Set Field value for 'Payee Reference'
			creatingCusRecord.setFieldValue('custrecord_datedue', allTransactions[index-1].getValue(tranCols[3]));				//Set Field value for 'Date Due'
			creatingCusRecord.setFieldValue('custrecord_invoice_amount', '');													//Set Field value for 'Invoice amount'
			creatingCusRecord.setFieldValue('custrecord_amtremaining', '');														//Set Field value for 'Amount Remaining'
			creatingCusRecord.setFieldValue('custrecord_location', allTransactions[index-1].getValue(tranCols[6]));				//Set Field value for 'location'
			creatingCusRecord.setFieldValue('custrecord_currency', allTransactions[index-1].getText(tranCols[12]));				//Set Field value for 'Currency'
			creatingCusRecord.setFieldValue('custrecord_creditnoteamt', fxAmtRemain);											//Set Field value for 'credit Note Amonut'
			creatingCusRecord.setFieldValue('custrecord_includeexclude','F');													//Set Field value for 'Include/Exclude'
			creatingCusRecord.setFieldValue('custrecord_processedpayment', 'F');												//Set Field value for 'Processed payment'
			creatingCusRecord.setFieldValue('custrecord_transinternalid', tranIntID);											//Set Field value for 'Transaction Internal ID'
			creatingCusRecord.setFieldValue('custrecord_trantype', allTransactions[index-1].getText(tranCols[4]));				//Set Field value for 'Transaction type'

			//Submitting the record
			nlapiSubmitRecord(creatingCusRecord,false, true);	



		}
	}

}

/**********************************************************************
 * 
 * searchBills Function - Searching the bills depending on the customer 
 * 							inputs
 * 
 * @param subsidiary
 * 
 *********************************************************************/
function searchBills(subsidiary)
{
	//Declaring local variables
	var enteredDueDate= null;
	var enteredLoc= null;
	var enteredAcc= null;


	try
	{
		//getting the values from the user input 
		enteredDueDate = request.getParameter('duedate');										//Getting 'due date'
		enteredLoc = request.getParameterValues('location');									//Getting 'location'
		enteredAcc = request.getParameterValues('apaccount');									//Getting 'a/p accounts'

		//Adding filters to, search the related transactions in user's subsidiary 
		tranFilsBills[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');					//Filtering by mainline is true			
		tranFilsBills[1] = new nlobjSearchFilter('location', null, 'is', enteredLoc);			//Filtering by user selected location
		tranFilsBills[2] = new nlobjSearchFilter('type',null, 'anyof','VendBill');				//filtering by transaction of types vender bills 
		tranFilsBills[3] = new nlobjSearchFilter('duedate', null, 'on', enteredDueDate);		//Filtering by user selected date
		tranFilsBills[4] = new nlobjSearchFilter('account', null, 'is', enteredAcc);			//Filtering by user selected accounts
		tranFilsBills[5] = new nlobjSearchFilter('subsidiary', null, 'is', subsidiary);			//filtering by user's subsidiary

		//Getting particular columns in transaction search results 
		tranCols[0] = new nlobjSearchColumn('tranid');											//Getting the transaction ID - Supplier Generated
		tranCols[1] = new nlobjSearchColumn('custbody_autogenreference');						//Getting the transaction ID - Auto generate				
		tranCols[2] = new nlobjSearchColumn('trandate');										//Getting the transaction date
		tranCols[3] = new nlobjSearchColumn('duedate');											//Getting the due date
		tranCols[4] = new nlobjSearchColumn('type');											//Getting the transaction type
		tranCols[5] = new nlobjSearchColumn('entity');											//Getting the supplier name
		tranCols[6] = new nlobjSearchColumn('location');										//Getting the location	
		tranCols[7] = new nlobjSearchColumn('account');											//Getting the account
		tranCols[8] = new nlobjSearchColumn('accounttype');										//Getting the account type
		tranCols[9] = new nlobjSearchColumn('fxamount');										//Getting the amount(Foreign currency)
		tranCols[11] = new nlobjSearchColumn('amountremaining');								//Getting the amount remaining
		tranCols[10] = new nlobjSearchColumn('status');											//Getting the status
		tranCols[12] = new nlobjSearchColumn('currency');										//Getting the Currency
		tranCols[13] = new nlobjSearchColumn('exchangerate');									//Getting the exchange rate
		tranCols[14] = new nlobjSearchColumn('amount');											//Getting the amount
		tranCols[15] = new nlobjSearchColumn('internalid');										//Getting the transaction internal id

		//Searching the transactions using filters and columns 
		searchTransBills = nlapiSearchRecord('transaction', null, tranFilsBills, tranCols);

		//if the searchTransBills array is not empty
		if(searchTransBills != null)
		{
			//looping through the searchTransBills array
			for(var index =0; index<searchTransBills.length; index++)
			{
				//Putting the values into the allTransactions array
				allTransactions[arrayIndex] = searchTransBills[index];
				arrayIndex++;
			}
		}
		else
		{
			arrayIndex =0;

		}
	}
	catch(e)
	{
		errorHandler("searchBills : " +e);
	} 

}



/**********************************************************************
 * 1.0.1 - 01/11/2012 - Searching for expense reports
 *
 * searchExpRpts Function - searching for expense reports
 *   
 * @param intID
 * @returns {Boolean}
 * 
 **********************************************************************/
function searchExpRpts(subsidiary)
{
	//Declaring local variables
	var enteredDate= null;
	var enteredLoc= null;
	var enteredAcc= null;

	try
	{
		//getting the values from the user input 
		enteredDate = request.getParameter('duedate');													//Getting 'due date'
		enteredLoc = request.getParameterValues('location');											//Getting 'location'
		enteredAcc = request.getParameterValues('apaccount');											//Getting 'a/p accounts'

		//Adding filters to, search the related transactions in user's subsidiary 
		tranFilsExps[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');							//Filtering by mainline is true			
		tranFilsExps[1] = new nlobjSearchFilter('location', null, 'is', enteredLoc);					//Filtering by user selected location
		tranFilsExps[2] = new nlobjSearchFilter('type',null, 'anyof','ExpRept');						//filtering by transaction of types expense reports
		tranFilsExps[3] = new nlobjSearchFilter('trandate', null, 'on', enteredDate);					//Filtering by user selected date
		tranFilsExps[4] = new nlobjSearchFilter('account', null, 'is', enteredAcc);						//Filtering by user selected accounts
		tranFilsExps[5] = new nlobjSearchFilter('subsidiary', null, 'is', subsidiary);					//filtering by user's subsidiary

		//Searching the transactions using filters and columns 
		searchTransExps = nlapiSearchRecord('transaction', null, tranFilsExps, tranCols);
		if(searchTransExps !=null)
		{
			for(var index =0; index<searchTransExps.length; index++)
			{
				allTransactions[arrayIndex] = searchTransExps[index];
				arrayIndex++;
			}
		}
		else
		{
			arrayIndex =0;			
		}
	}
	catch(e)
	{
		errorHandler("searchExpRpts : " +e);
	} 

}


/**********************************************************************
 * 1.0.2 - 04/12/2012 - Searching for vendor credits
 * 
 * searchCredits Function 
 *   
 * @param intID
 * @returns {Boolean}
 * 
 **********************************************************************/
function searchCredits(subsidiary)
{
	//Declaring local variables

	var enteredLoc= null;
	var enteredAcc= null;

	try
	{
		enteredLoc = request.getParameterValues('location');											//Getting 'location'
		enteredAcc = request.getParameterValues('apaccount');											//Getting 'a/p accounts'

		//Adding filters to, search the related transactions in user's subsidiary 
		tranFilsCredits[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');							//Filtering by mainline is true			
		tranFilsCredits[1] = new nlobjSearchFilter('location', null, 'is', enteredLoc);					//Filtering by user selected location
		tranFilsCredits[2] = new nlobjSearchFilter('type',null, 'anyof','VendCred');						//filtering by transaction of types expense reports
		tranFilsCredits[3] = new nlobjSearchFilter('account', null, 'is', enteredAcc);						//Filtering by user selected accounts
		tranFilsCredits[4] = new nlobjSearchFilter('subsidiary', null, 'is', subsidiary);					//filtering by user's subsidiary


		//Searching the transactions using filters and columns 
		searchTransCredits = nlapiSearchRecord('vendorcredit', null, tranFilsCredits, tranCols);

		if(searchTransCredits !=null)
		{
			for(var index = 0; index < searchTransCredits.length; index++)
			{
				allTransactions[arrayIndex] = searchTransCredits[index];
				arrayIndex++;
			}
		}
		else
		{
			arrayIndex =0;			
		}

	}
	catch(e)
	{
		errorHandler("searchExpRpts : " +e);
	} 

}
/**********************************************************************
 * checkIfAlreadyAdded Function - checking if the transaction is 
 * 								  already in the payment proposal list
 * 
 * @param intID
 * @returns {Boolean}
 * 
 **********************************************************************/
function checkIfAlreadyAdded(intID)
{
	var retVal = false;
	try
	{

		//Calling the genericSearch function which returns the internalid of the record
		if(genericSearch('customrecord_payment_proposal', 'custrecord_transinternalid', intID) !=0)
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("checkIfAlreadyAdded : " +e);
	} 

	return retVal;

}



/**************************************************************************
 * generic search - returns internal ID
 * 
 * @param table
 * @param fieldToSearch
 * @param valueToSearch
 * @returns {Number}
 * 
 *************************************************************************/
function genericSearch(table, fieldToSearch, valueToSearch)
{
	var internalID=0;

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	var itemSearchResult = null; 
	var itemSearchResults = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'equalto',valueToSearch);                          

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		itemSearchResults = nlapiSearchRecord(table, null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{

			if(itemSearchResults.length>0)
			{
				itemSearchResult = itemSearchResults[ 0 ];
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



/***********************************************************************
 * store employee name and chosen location
 * 
 * 1.1.0 - 08/04/2013 - Added a function to store the current employee name and the chosen location - SA
 ***********************************************************************/

function storeChosenLocation()
{
	var currentEmployee= null;
	var enteredLocation = null;

	var oldRecord =null;
	var cusRecordEmployee = null;
	var cusRecordLocation = null;
	var oldRecordId = 0;

	var newRecord = null;
	var newRecordId = 0;

	var pSearchFilters = new Array();
	var pSearchColumns = new Array();


	try
	{
		currentEmployee = nlapiGetUser();
		enteredLocation = 	request.getParameterValues('location');			

		// construct search for existing record
		pSearchFilters[0] = new nlobjSearchFilter('custrecord_locationfilter_employee',null, 'anyof',currentEmployee);			
		pSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var pSearchResults = nlapiSearchRecord('customrecord_locationfilter', null, pSearchFilters, pSearchColumns);	

		if (pSearchResults) 
		{			
			oldRecord = nlapiLoadRecord('customrecord_locationfilter', pSearchResults[0].getId());		
			oldRecord.setFieldValue('custrecord_locationfilter_employee', currentEmployee);
			oldRecord.setFieldValue('custrecord_locationfilter_location', enteredLocation);
			oldRecordId= nlapiSubmitRecord(oldRecord);

		}

		else 	
		{		
			newRecord = nlapiCreateRecord('customrecord_locationfilter');			
			newRecord.setFieldValue('custrecord_locationfilter_employee',currentEmployee);
			newRecord.setFieldValue('custrecord_locationfilter_location', enteredLocation);
			newRecordId = nlapiSubmitRecord(newRecord);

		}
	}
	catch(e)
	{
		errorHandler("storeChosenLocation : " +e);

	} 

}


/***********************************************************************
 *redirectToProposalMaintenance - redirect to proposal maintenance screen
 * 
 * 1.1.2 - Added a function which calls proposalmaintenance.js inorder to redirect proposal maintenance screen withd efault location filter - SA
 ***********************************************************************/
function redirectToProposalMaintenance()
{
	try
	{

		switch (environment)
		{
		case "SANDBOX":

			outputPage = '<html><body><script type="text/javascript">window.location.href="https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=195&deploy=1";</script><p>Error: No parameters passed.</p>';


			break;
		case "PRODUCTION":

			outputPage = '<html><body><script type="text/javascript">window.location.href="https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=194&deploy=1";</script><p>Error: No parameters passed.</p>';


			break;

		case "BETA":

			outputPage = '<html><body><script type="text/javascript">window.location.href="https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=194&deploy=1";</script><p>Error: No parameters passed.</p>';


			break;

		}

		response.write(outputPage);


	}
	catch(e)
	{
		errorHandler("redirectToProposalMaintenance: " +e);
	}

}


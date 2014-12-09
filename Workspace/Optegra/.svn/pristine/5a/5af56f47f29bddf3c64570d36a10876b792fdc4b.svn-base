/*************************************************************************
 * Name: createPayments.js
 * Script Type: Suitelett
 * Client: Optegra
 * 
 * Version: 1.0.0 - 08 June 2012 - 1st release - JM
 * 			1.0.1 - 05/12/2012 - exclude vendor credit from payment process - AS 
 * 			1.0.2 - 23/04/2013 - Show confirmation message after creating the payment - AS 
 * 			
 * 
 * Author: FHL
 * Purpose: Create payment records from selected payments
 * 
 * Script: customscript_createpayments   
 * Deploy: customdeploy_createpayments 
 * 
 * notes: use transformrecord  for vendorbill	Vendor Bill	vendorpayment	Vendor Payment
 * 
 **************************************************************************/

//Declaring the global variables
var location = null;
var account = null;
var searchResults = null;
var paymentFilters = new Array();
var paymentColumns = new Array();


/*********************************************************
 * The Main Function
 * 
 * @param request
 * @param response
 * 
 ********************************************************/

function createPayments(request, response)
{
	var outputPage = null;
	initialise();

	if ( request.getMethod() == 'GET') 
	{
		selectionForm();
		
	}
	else
	{
		//creating the payments
		selectsRecordsAndCreatesPayments();

		//1.0.2 - 23/04/2013 - Show confirmation message after creating the payment - AS 
		response.write(' The payments has been successfully created.');

	}

}



/**************************************************************
 * initialise 
 * 
 **************************************************************/

function initialise()
{
	//Getting the subsidiary of the logged in user
	subsidiary= nlapiGetSubsidiary();

}



/**************************************************************
 * user selects location to process for payment generation 
 * 
 **************************************************************/
function selectionForm()
{
	//Declaring local variables
	var pPForm = null; 
	var okButton = null;
	var cancelButton = null;	

	try
	{
		//Creating the form
		pPForm= nlapiCreateForm('Create Payments From Selections');

		//Creating and adding the location field to the form as a multi-select list
		location= pPForm.addField('location', 'multiselect', 'Location',null);
		location.setHelpText('Select the location you want the payments of the bills/expenses to be made.', false);
		location.setDisplaySize(150, 15);
		//Finding Locations
		findLocations(location,subsidiary);	
		
		//Creating and adding the account field to the form as a select list
		account= pPForm.addField('account', 'select', 'Account',null);
		account.setHelpText('Select the account you want the payments of the bills/expenses to be paid from.', false);
		
		//Finding accounts
		findBankAccounts(account,subsidiary);	
		
		//creating and adding the buttons
		okButton = pPForm.addSubmitButton('OK');
		cancelButton = pPForm.addButton('cancel', 'Cancel', 'history.back()');

		//writing the fields and buttons as a whole
		response.writePage(pPForm);

	}
	catch(e)
	{
		errorHandler("selectLocation: " + e);
	}

}


/**************************************************************
 * loop through selected records creating the payments 
 * 
 **************************************************************/

function selectsRecordsAndCreatesPayments()
{
	var returnedVal = false;

	try
	{
		// fetch the rows to process
		returnedVal = fetchRowsToProcess();

		// create the payments
		// and mark the payment proposal record as processed
		if(returnedVal==true)
		{
			createPaymentRecords();
		}

	}
	catch(e)
	{
		errorHandler("createPaymentsForSelectedRecords: " + e);
	}

}


/**************************************************************
 * create the payments 
 * 
 **************************************************************/

function createPaymentRecords()
{
	var transIntID = 0;					// transaction to pay internal ID
	var paymentProposalIntID = 0;		// payment proposal internal ID
	var paymentID = 0;					// new payment internal ID 
	var paymentAmt = 0;
	var intID = 0;						
	var location = null;
	var account = '';
	try
	{
		account = request.getParameter('account');
		
		//looping through the transaction search results and create payment for each
		for(var index = 0; index<searchResults.length;index++)
		{
			try
			{
				paymentProposalIntID = searchResults[index].getValue(paymentColumns[0]);		// payment proposal internal ID
				transIntID = searchResults[index].getValue(paymentColumns[3]);					// transaction internal ID
				paymentAmt = searchResults[index].getValue(paymentColumns[2]);					// payment amount
				location = searchResults[index].getValue(paymentColumns[4]);					// location
				
				// check if the transaction is approved
				if(checkBillExpenseStatus(transIntID)==true)
				{
					
					// create the payment and set the amount to pay
					paymentID = nlapiTransformRecord('vendorbill', transIntID, 'vendorpayment');
					paymentID.setFieldValue('total', paymentAmt); 	
					
					//amountpaid
					
					// set the payment amount
					paymentID.setFieldValue('location', location);
					paymentID.setFieldValue('account', account);
					intID = nlapiSubmitRecord(paymentID, false);
				
					//*****************************************************************************************************
					// for a successfully created payment - mark the customrecord_payment_proposal record as processed and updating the 'processing status description' field 
					//*****************************************************************************************************
					markPaymentProposalRecordAsProcessed(paymentProposalIntID, 'Payment Created', 'T');
				
				}
				else
				{
					//*****************************************************************************************************
					// for the expense reports not approved or bills not open - mark the customrecord_payment_proposal record as not processed and updating the 'processing status description' field 
					//*****************************************************************************************************
					markPaymentProposalRecordAsProcessed(paymentProposalIntID, 'Transaction Not Approved', 'F');
				
				}

			}
			catch(e)
			{
				//*****************************************************************************************************
				// for other errors - mark the customrecord_payment_proposal record as not processed and updating the 'processing status description' field with the error
				//*****************************************************************************************************
				markPaymentProposalRecordAsProcessed(paymentProposalIntID, e, 'F');

			}

		}

	}
	catch(e)
	{
		errorHandler("createpaymentrecords: " + e);
	}

}


/**************************************************************
 * check if the transaction is approved
 * 
 * @param intID
 * 
 **************************************************************/

function checkBillExpenseStatus(intID)
{
	var retVal = false;
	
	try
	{
		if((searchStatus('transaction','internalid', intID) =='approvedByAcct') || (searchStatus('transaction','internalid', intID) =='open'))
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler("checkBillExpenseStatus : " +e);
	} 
	return retVal;

}


/**************************************************************
 * mark Payment Proposal Record As Processed for successfully
 * created payments
 * 
 * @param intID
 * 
 **************************************************************/

function markPaymentProposalRecordAsProcessed(intID, processingDesc, processed)
{
	var paymentProposalRec = null;
	var paymentProposalIntID = 0;

	try
	{
		paymentProposalRec = nlapiLoadRecord('customrecord_payment_proposal', intID);		// load the payment proposal record
		paymentProposalRec.setFieldValue('custrecord_processedpayment', processed); 		// set the record as processed
		paymentProposalRec.setFieldValue('custrecord_processingstatus', processingDesc); 	// provide descriptive information about processing failures
			
		paymentProposalIntID = nlapiSubmitRecord(paymentProposalRec, false);				// submit
	
	}
	catch(e)
	{
		errorHandler("markPaymentProposalRecordAsProcessed: "+e);
	}

}



/**************************************************************
 * fetch the rows to process 
 * 
 * 1.0.1 - 05/12/2012 - exclude vendor credit from payment process
 * @returns {Boolean}
 * 
 **************************************************************/

function fetchRowsToProcess()
{
	var retVal=false;
	var selectedLocation = null;

	selectedLocation = request.getParameterValues('location');

	try
	{
		//search filters                  
		paymentFilters[0] = new nlobjSearchFilter('custrecord_location', null, 'is',selectedLocation);                          
		paymentFilters[1] = new nlobjSearchFilter('custrecord_includeexclude', null, 'is','T');                          
		paymentFilters[2] = new nlobjSearchFilter('custrecord_processedpayment', null, 'is','F');                          
		paymentFilters[3] = new nlobjSearchFilter('custrecord_trantype', null, 'isnot','Bill Credit');      // 1.0.1                    

		// return columns
		paymentColumns[0] = new nlobjSearchColumn('internalid');
		paymentColumns[1] = new nlobjSearchColumn('custrecord_optinvoiceno');
		paymentColumns[2] = new nlobjSearchColumn('custrecord_amtremaining');
		paymentColumns[3] = new nlobjSearchColumn('custrecord_transinternalid');
		paymentColumns[4] = new nlobjSearchColumn('custrecord_location');

		// perform search
		searchResults = nlapiSearchRecord('customrecord_payment_proposal', null, paymentFilters, paymentColumns);

		if(searchResults!=null)
		{
			if(searchResults.length>0)
			{
				retVal = true;
		
			}
		
		}
	}
	catch(e)
	{
		errorHandler("fetchRowsToProcess: " + e);
	}     	      

	return retVal;

}



/**************************************************************************
 * findLocations Function - Finding locations to display in the 'location' select field
 * 
 * @param locField
 * @param subsidiary
 *************************************************************************/

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

		//Getting the values of particular columns returned from search results
		for(var index=0; index <searchLoc.length; index++)
		{
			//Getting the location name
			locName = searchLoc[index].getValue(locCol[0]);

			//Getting the internal ID of the location
			intId = searchLoc[index].getValue(locCol[1]);

			//Adding each location to the 'select' list
			locField.addSelectOption(intId, locName, false);

		}

	}
	catch(e)
	{
		errorHandler("findLocations: " + e);
	}

}


/**************************************************************************
 * findBankAccounts Function - Finding Bank Accounts to display in the 'Account' select field
 * 
 * @param accField
 * @param subsidiary
 * 
 *************************************************************************/

function findBankAccounts(accField,subsidiary)
{
	//Declaring the local variables
	var accFilter = new Array();
	var accCol = new Array();
	var bankAccount =null;
	var accIntId=null;
	var searchAcc =new Array();

	try
	{
		//Adding filters to, search the related active payable accounts in user's subsidiary 
		accFilter[1] = new nlobjSearchFilter('subsidiary',null, 'anyof',subsidiary); 		//Filtering by user's subsidiary
		accFilter[2] = new nlobjSearchFilter('type', null, 'is', 'Bank');					//filtering by account type of 'bank'
		accFilter[0] = new nlobjSearchFilter('isinactive',null, 'is','F');					//filtering by active accounts

		//Getting particular columns in accounts search results 
		accCol[0] = new nlobjSearchColumn('name');											//Getting account name
		accCol[1] = new nlobjSearchColumn('internalid');									//Getting the account's internal ID
		accCol[2] = new nlobjSearchColumn('balance');
		
		//Searching the accounts using filters and columns 
		searchAcc = nlapiSearchRecord('account', null, accFilter, accCol);

		//Getting the values of particular columns returned from search results
		for(var index=0; index < searchAcc.length; index++)
		{
			//Getting the account name
			bankAccount = searchAcc[index].getValue(accCol[0]);
				
			//Getting the account's internal ID 
			accIntId = searchAcc[index].getValue(accCol[1]);

			//Adding each account to the 'multi-select' list
			accField.addSelectOption(accIntId, bankAccount, false);
			
		}
		
	}
	catch(e)
	{
		errorHandler("findAccounts : " +e);
	} 
	
}


/**************************************************************************
 * generic search - returns status of the transaction
 * 
 * @param table
 * @param fieldToSearch
 * @param valueToSearch
 * @returns {string}
 * 
 *************************************************************************/
function searchStatus(table, fieldToSearch, valueToSearch)
{
	var status='';

	// Arrays
	var transSearchFilters = new Array();
	var transSearchColumns = new Array();
	var transactionResult = null;
	var transSearchResults = new Array();

	try
	{
		//search filters                  
		transSearchFilters[0] = new nlobjSearchFilter(fieldToSearch, null, 'is',valueToSearch);                          

		// return columns
		transSearchColumns[0] = new nlobjSearchColumn('status');

		// perform search
		transSearchResults = nlapiSearchRecord(table, null, transSearchFilters, transSearchColumns);

		if(transSearchResults!=null)
		{
			if(transSearchResults.length>0)
			{
				transactionResult = transSearchResults[ 0 ];
				status = transactionResult.getValue('status');
			}
		}
	}
	catch(e)
	{
		errorHandler("genericSearch : " +e);
	}     	      

	return status;

}



/***************************************************************************
 * general error handler
 * 
 * @param e
 **************************************************************************/
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());

}



/****************************************************************************
 * get error message
 * 
 * @param e
 ***************************************************************************/

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
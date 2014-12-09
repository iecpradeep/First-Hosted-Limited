/*************************************************************************
 * Name: 		Bank Details CSV Export
 * Script Type: Suitelet
 * Client: 		Mortara Dolby
 * 
 * Version: 	1.0.0 - 14 Nov 2011 - 1st release - MJL
 * 				1.1.0 - 28 Mar 2012 - Updated release with user interface and 
 * 								  option to select bill payments
 * 				1.2.0 - 15 Jun 2012 - Refacotring by A.N.
 *
 * Author: 		Anthony Nixon, Matthew Lawrence, FHL
 * Purpose: 	Export bill payments to CSV for submission to Clydesdale Bank
 **************************************************************************/

//-->> GLOBAL VARIABLES <<-- 

// Declare search variables - A.N, 1.2
var filters = new Array();
var columns = new Array();
var searchResults = '';

// CSV variable - A.N, 1.2
var bcsv = '';

// CSV storage variables - A.N, 1.2
var entityID = 0;
var entity = '';
var bankAccount = '';
var sortCode = '';

// Variable for the file attachment - A.N, 1.2
var newAttachment = '';

// User information variables - A.N, 1.2
var userID = ''; 
var context = nlapiGetContext();
var userEmail = '';

// error checking
var successCSV = 0;
var buildCSV = 0;

// Recipients
//var recipients = new array();

var firstRecipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_first_recipient');
var secondRecipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_second_recipient');
var thirdRecipient = nlapiGetContext().getSetting('SCRIPT', 'custscript_third_recipient');

// reset variable
var params = new Array();

/**
 * 
 * Purpose: Main function to call sub functions and out put CSV e-mail
 * @returns {Boolean}
 */
function eftDetails() 
{
	try 
	{
		// define the search columns and filters and execute it
		defineSearch();

		// define the headers of the csv
		// csvHeaders();
		
		// build the CSV
		buildCSV = csvBuild();

		// 1 = creation success, 0 = failed
		if(buildCSV == 1)
		{
			csvEmail();
			
			// redirect the script to run the second part of the process
			
			createParams();
			
			nlapiSetRedirectURL('SUITELET', 'customscript_csv_refresh', 'customdeploy_csv_refresh' , false, params);
			
			nlapiLogExecution('DEBUG', 'Remaing script usage: ' + context.getRemainingUsage());
		}
		else
		{
			nlapiLogExecution('ERROR', '*FHL* - CSV failed to build');
		}
		
	} //end try

	catch(e) 
	{
		response.write('*FHL* - Error 37');
		nlapiLogExecution('ERROR', 'code crash', e.message);
	}

} //end function

function defineSearch()
{
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('custentity_bankacc', 'vendor', 'isnotempty');
	filters[2] = new nlobjSearchFilter('custentity_sortcode', 'vendor', 'isnotempty');
	filters[3] = new nlobjSearchFilter('type', null, 'is', 'VendPymt');
	filters[4] = new nlobjSearchFilter('custbody_export_csv', null, 'is', 'T');
	
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('tranid');
	columns[2] = new nlobjSearchColumn('entity');
	columns[3] = new nlobjSearchColumn('total');
	columns[4] = new nlobjSearchColumn('custentity_bankacc', 'vendor');
	columns[5] = new nlobjSearchColumn('custentity_sortcode', 'vendor');
	columns[6] = new nlobjSearchColumn('custbody_export_csv');

	searchResults = nlapiSearchRecord('vendorpayment', null, filters, columns);
	
	try
	{
		nlapiLogExecution('DEBUG', '*FHL* - No. of search results: ' + searchResults.length);
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', '*FHL* - No search results found: ' + e.message);
	}
	
	return true;
}

function csvHeaders()
{
	// set the CSV headers
	bcsv = bcsv + "Remitter Sort Code" + ',' ;
	bcsv = bcsv + "Remitter Account Number" + ',' ;
	bcsv = bcsv + "Beneficiary Name" + ',' ;
	bcsv = bcsv + "Reference" + ',' ;
	bcsv = bcsv + "Beneficiary Sort Code" + ',' ;
	bcsv = bcsv + "Beneficiary Account Number" + ',' ;
	bcsv = bcsv + "Amount" + '\n';

	return true;
}

function csvBuild()
{
	try
	{
		if (searchResults != null)
		{   
			for (var i = 0; i < searchResults.length; i++) 
			{	
				entityID = searchResults[i].getValue(columns[2]);
				internalID = searchResults[i].getValue(columns[0]);
				var exportCSV = searchResults[i].getValue(columns[6]);

				nlapiLogExecution('DEBUG', 'exportCSV? ' + exportCSV + ' internal ID: ' + internalID);

				try 
				{
					entity = nlapiLoadRecord('vendor', entityID);
				}
				catch(errorOne) 
				{
					try 
					{
						entity = nlapiLoadRecord('employee', entityID);
					}

					catch(errorTwo) 
					{
						//other
						nlapiLogExecution('ERROR', '*FHL* - Not vendor or employee: ' + errorTwo.message);
					}
				} //end catch

				bankAccount = entity.getFieldValue('custentity_bankacc');
				nlapiLogExecution('DEBUG', 'custentity_bankacc', bankAccount);

				sortCode = entity.getFieldValue('custentity_sortcode');
				nlapiLogExecution('DEBUG', 'custentity_sortcode', sortCode);

				// Add the search information into the CSV
				bcsv = bcsv + '"' + "826805" + '",';								// Remitter sort code
				bcsv = bcsv + '"' + "30101856" + '",';								// Remitter account no.
				bcsv = bcsv + '"' + searchResults[i].getText(columns[2]) + '",';	// Beneficiary name
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[1]) + '",';	// Reference
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[5]) + '",';	// Beneficiary sort code
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[4]) + '",'; 	// Beneficiary account no.
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[3]) + '"\n';	// Amount

			} //end for
			
			successCSV = 1;
			
			return successCSV;
		} //end if
		else 
		{
			response.write('No viable results found for CSV export.. /n/n Please make sure selected bill payments have a vendor with a bank account and a sortcode attached ');
			return successCSV;
		}	
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', '*FHL* - The following error has occured in csv creation: ' + e.message);
		
		return successCSV;
	}
}

function csvEmail()
{
	// creates .csv file from search results
	newAttachment = nlapiCreateFile('bankdetails.csv', 'CSV', bcsv);     
	
	nlapiLogExecution('DEBUG', 'bcsv' , bcsv);

	// emails .csv file as attachment
	userID = nlapiGetUser(); 
	userEmail = context.getEmail();

	// send the email
	nlapiSendEmail(userID, [firstRecipient,secondRecipient,thirdRecipient], 'Bank CSV', 'CSV file attached', null,'anthony.nixon@firsthosted.co.uk', null, newAttachment);
		
	return true;
}

function createParams()
{
	params["custparam_totalResults"] = searchResults.length;
	
	for(var i = 0; i < searchResults.length; i++)
	{
		params["custparam_internalid"+ i] = searchResults[i].getValue(columns[0]);
	}
	
	nlapiLogExecution('DEBUG', '*FHL* - list of params: ' + params);
}
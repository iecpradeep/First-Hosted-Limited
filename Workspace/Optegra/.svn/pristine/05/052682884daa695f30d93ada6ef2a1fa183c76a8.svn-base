/*************************************************************************
 * Name: bacsExport.js
 * Script Type: Suitelett
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 29 Jul 2012 - 1st release JM
 *
 * Author: FHL
 * Purpose: exports selections to a BACS formatted file and emails
 * 
 * Script : customscript_??? 
 * Deploy: customdeploy_???
**************************************************************************/

//-->> GLOBAL VARIABLES <<-- 

// Declare search variables - A.N, 1.2
var filters = new Array();
var columns = new Array();
var searchResults = null;

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

/**
 * Purpose: Main function to call sub functions and out put CSV e-mail
 * @returns {Boolean}
 */
function bacsexport() 
{
	try 
	{
		// define the search columns and filters and execute it
		defineSearch();

		// define the headers of the csv
		csvHeaders();
		
		// build the CSV
		buildCSV = csvBuild();

		// 1 = creation success, 0 = failed
		if(buildCSV == 1)
		{
			csvEmail();
		}
		else
		{
			nlapiLogExecution('ERROR', '*FHL* - CSV failed to build');
		}
		
	} //end try

	catch(e) 
	{
		nlapiLogExecution('ERROR', 'code crash', e.message);
	}

} //end function

function defineSearch()
{
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('type', null, 'is', 'VendPymt');
	filters[2] = new nlobjSearchFilter('custentity_bankacc', 'vendor', 'isnotempty');
	filters[3] = new nlobjSearchFilter('custentity_sortcode', 'vendor', 'isnotempty');
	filters[4] = new nlobjSearchFilter('custbody_export_csv', null, 'is', 'T');

	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('tranid');
	columns[2] = new nlobjSearchColumn('entity');
	columns[3] = new nlobjSearchColumn('total');
	columns[4] = new nlobjSearchColumn('custentity_bankacc', 'vendor');
	columns[5] = new nlobjSearchColumn('custentity_sortcode', 'vendor');

	searchResults = nlapiSearchRecord('vendorpayment', null, filters, columns);
	
	return true;
}

function csvHeaders()
{
	bcsv = bcsv + "Remitter Sort Code" + ',' ;
	bcsv = bcsv + "Remitter Account Number" + ',' ;
	bcsv = bcsv + "Beneficiary Name" + ',' ;
	bcsv = bcsv + "Reference" + ',' ;
	bcsv = bcsv + "Beneficiary Sort Code" + ',' ;
	bcsv = bcsv + "Beneficiary Account Number" + ',' ;
	bcsv = bcsv + "Amount" + '\n';
	
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
				bcsv = bcsv + '"' + "82-68-05" + '",';								// Remitter sort code
				bcsv = bcsv + '"' + "30101856" + '",';								// Remitter account no.
				bcsv = bcsv + '"' + searchResults[i].getText(columns[2]) + '",';	// Beneficiary name
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[1]) + '",';	// Reference
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[5]) + '",';	// Beneficiary sort code
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[4]) + '",'; 	// Beneficiary account no.
				bcsv = bcsv + '"' + searchResults[i].getValue(columns[3]) + '"\n';	// Amount

				successCSV = 1;
				
				return successCSV;
			} //end for
		} //end if
		else 
		{
			response.write('There are no results to show.');
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
	nlapiSendEmail(userID, userEmail, 'TEST EMAIL', 'CSV file attached', 'matthew.lawrence@firsthosted.co.uk', null, null, newAttachment);
	
	return true;
}


/*****************************************************************************************************
 * Name: createBACSFile.js
 * Script Type: Suitelet
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 01 Aug 2012 - 1st release - MJL
 * Version: 1.0.1 - 22 Aug 2012 - amendment - rounding issue when 19.81 used
 * 			1.0.2 - 12/02/2013 - Included missing date format d.mm.yyyy - SA
 *
 * Author: FHL
 * Purpose: Creates a BACS file based on records stored in the BACS custom record set
 * 
 * Script: customscript_createbacsfile
 * Deployment: customdeploy_createbacsfile
 * 
 * Sandbox URL: https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=198&deploy=1
 * Production URL: https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=156&deploy=1
 ******************************************************************************************************/

var bacsRecordIDs = null;
var currentBACSRec = null; 

var btxt = '';

var context = null;
var userID = 0;
var userEmail = '';

/**
 * Main routine
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Boolean value
 */
function createBACSFile(request, response)
{
	var isBACScreated = '';
	var retVal = false;

	isBACScreated = bacsBuild();

	if(isBACScreated == 'Created')
	{
		//emails BACS file and sets Include flags to false
		bacsEmail();
		resetIncludeFlags();

		nlapiLogExecution('AUDIT', 'Success', 'BACS file created and sent to ' + userEmail);
		response.write('BACS file created and emailed.');
		retVal = true;
	}
	else if (isBACScreated == 'No records')
	{
		nlapiLogExecution('AUDIT', 'Failure', 'No BACS records found.');
		response.write('No BACS records selected for export.');
	}
	else
	{
		errorHandler(e);
	}
	return retVal;
}

/**
 * Get information from BACS custom record and format
 * 1.0.1 rounding issue
 * 
 * @returns Boolean value
 */
function bacsBuild()
{
	var validAmount = '';
	var firstPartyAccName = '';
	var accName = '';
	var refNo = '';
	var validDate = '';
	var numAmount = 0;

	var retVal = '';

	try
	{
		bacsRecordIDs = lookupBACSRecords();

		if (bacsRecordIDs.length != 0)
		{
			for (var i = 0; i < bacsRecordIDs.length; i++) 
			{			
				currentBACSRec = nlapiLoadRecord('customrecord_bacs', bacsRecordIDs[i]);

				// Add the search information into the CSV
				btxt = btxt + currentBACSRec.getFieldValue('custrecord_bacssortcode');
				btxt = btxt + currentBACSRec.getFieldValue('custrecord_bacsbankaccount');
				btxt = btxt + ' ';
				btxt = btxt + '99';
				btxt = btxt + currentBACSRec.getFieldValue('custrecord_firstpartysortcode');
				btxt = btxt + currentBACSRec.getFieldValue('custrecord_firstpartyaccountnumber');
				btxt = btxt + '    ';



				// 1.0.1 rounding issue

				numAmount = currentBACSRec.getFieldValue('custrecord_bacsamount') * 100;
				numAmount = Math.round(numAmount,0);
				numAmount = parseInt(numAmount);

				validAmount = '00000000000' + numAmount;

				//validAmount = '00000000' + (currentBACSRec.getFieldValue('custrecord_bacsamount') * 100);
				validAmount = validAmount.substring((validAmount.length - 11), validAmount.length);
				btxt = btxt + validAmount;

				firstPartyAccName = currentBACSRec.getFieldValue('custrecord_firstpartyname');
				firstPartyAccName = firstPartyAccName + '                  '; // 18 spaces
				firstPartyAccName = firstPartyAccName.substring(0, 18);

				accName = currentBACSRec.getFieldValue('custrecord_bacsaccountname');
				accName = accName + '                  '; // 18 spaces
				accName = accName.substring(0, 18);

				refNo = currentBACSRec.getFieldValue('custrecord_bacsreference');
				refNo = refNo + '                  '; // 18 spaces
				refNo = refNo.substring(0, 18);

				btxt = btxt + firstPartyAccName;
				btxt = btxt + refNo;
				btxt = btxt + accName;

				validDate = currentBACSRec.getFieldValue('custrecord_bacsprocessingdate');
				validDate = parseDate(validDate);
				btxt = btxt + validDate;

				btxt = btxt + '\n';
			}
			retVal = 'Created';
		}
		else
		{
			retVal = 'No records';
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Error creating CSV: ' + e.message);
		retVal = 'Error';
	}
	return retVal;
}

/**
 * Create BACS file and attach to email
 */
function bacsEmail()
{
	var newAttachment = null;
	var retVal = false;

	try 
	{		
		nlapiLogExecution('AUDIT', 'btxt output', btxt);

		//creates BACS file
		newAttachment = nlapiCreateFile('bacsdetails.txt', 'PLAINTEXT', btxt);     

		//emails text file as attachment	
		context = nlapiGetContext();
		userID = nlapiGetUser(); 
		userEmail = context.getEmail();

		//send email
		//nlapiSendEmail(userID, 'matthew.lawrence@firsthosted.co.uk', 'TEST EMAIL', 'BACS file attached', null, null, null, newAttachment); //debug code
		nlapiSendEmail(userID, userEmail, 'BACS FILE', 'BACS file attached', null, null, null, newAttachment);

		retVal = true;
	}
	catch(e) 
	{
		errorHandler(e);
	}
	return retVal;
}

/**
 * Set include flags on newly exported records to false
 */
function resetIncludeFlags()
{
	for (var i = 0; i < bacsRecordIDs.length; i++)
	{
		nlapiSubmitField('customrecord_bacs', bacsRecordIDs[i], 'custrecord_include', 'F');
	}
}

/**
 * error handler
 * @param e
 */
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());
	response.write('Error: ' + errorMessage);
}

/**
 * error message
 * @param e
 */
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

/**
 * Parse date from custom record to BACS format 
 * 	version -	1.0.2 - 12/02/2013 - Included missing date format d.mm.yyyy
 */
function parseDate(dateStr)
{
	var day = '';
	var month = '';
	var year = '';
	var newDate = '';

	dateStr = dateStr.replace("/", ".");

	try 
	{	

		if ((dateStr.indexOf('.') == 2 && dateStr.lastIndexOf('.') == 5)) //Example date: 12.12.2012 
		{
			day = dateStr.substring(0,2);
			month = dateStr.substring(3,5);
			year = dateStr.substring(8,10);
		}
		else if ((dateStr.indexOf('.') == 1 && dateStr.lastIndexOf('.') == 3)) //Example date: 2.2.2012 
		{
			day = '0' + dateStr.substring(0,1);
			month = '0' + dateStr.substring(2,3);
			year = dateStr.substring(6,8);
		}
		//1.0.2 - Included missing date format d.mm.yyyy - SA
		else if ((dateStr.indexOf('.') == 1 && dateStr.lastIndexOf('.') == 4)) //Example date: 2.12.2012
		{
			day = '0' + dateStr.substring(0,1);
			month = dateStr.substring(2,4);
			year = dateStr.substring(7,9);
		}
		else //Example date: 12.2.2012 
		{
			day = dateStr.substring(0,2);
			month = '0' + dateStr.substring(3,4);
			year = dateStr.substring(7,9);
		}

		newDate = day + month + year;
	}
	catch(e) 
	{
		errorHandler(e);
	}
	

	return newDate;
}

/**
 * Get internal IDs for checked BACS records 
 * 
 * @returns array of internal IDs
 */
function lookupBACSRecords()
{
	//Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	var internalIDs = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('custrecord_include', null, 'is', 'T');    

		//return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		//perform search
		var itemSearchResults = nlapiSearchRecord('customrecord_bacs', null, invoiceSearchFilters, invoiceSearchColumns);

		if(itemSearchResults!=null)
		{
			for (var i = 0; i < itemSearchResults.length; i++)
			{
				internalIDs[i] = itemSearchResults[i].getId();
			} 
		}
	}
	catch(e)
	{
		errorHandler(e);
	}
	return internalIDs;
}
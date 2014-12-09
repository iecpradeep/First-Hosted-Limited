/*****************************************************************************************************
 * Name: Create MT103 File (createMT103File.js)
 * Script Type: Suitelet
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 07 Nov 2012 - 1st release - MJL
 * 			1.0.1 - 08 Nov 2012 - Adding processingForMT103() and constructMT103Message() functions - AS
 *			1.0.2 - 14 Feb 2013 - correcting a comment - SA
 *
 * Author: FHL
 * Purpose: Creates a MT103 file based on records stored in the MT103 custom record set
 * 
 * Script: customscript_createmt103file
 * Deployment: customdeploy_createmt103file
 * 
 * Sandbox URL: https://system.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=205&deploy=1
 * Production URL:
******************************************************************************************************/

//Declaring global Variables
var mt103RecordIDs = null;
var currentMT103Rec = null; 

var btxt = '';
var mt103 = '';

var context = null;
var userID = 0;
var userEmail = '';

var validDate = '';
var numAmount = 0;


/*****************************************************************
 * Main routine
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Boolean value
 ****************************************************************/
function createMT103File(request, response)
{
	var isMT103created = '';
	var retVal = false;
	
	try
	{
		//****************************************************
		// build mt103 messages for selected records
		//****************************************************
	
		isMT103created = mt103Build();
	
		if(isMT103created == 'Created')
		{
			//emails MT103 file and sets Include flags to false
			mt103Email();
			resetIncludeFlags();

			nlapiLogExecution('AUDIT', 'Success', 'MT103 file created and sent to ' + userEmail);
			response.write('MT103 file created and emailed.');
			retVal = true;
		}
		else if (isMT103created == 'No records')
		{
			nlapiLogExecution('AUDIT', 'Failure', 'No MT103 records found.');
		response.write('No MT103 records selected for export.');
		}
		/*else
		{
			
			errorHandler(e);
		}*/
	}
	catch(e)
	{
		errorHandler(e);		
	}
	return retVal;
}


/******************************************************************
 * Get information from MT103 custom record and format
 * 
 * MT103 Example for a Same Day Payment: please note that there is 
 * a cr/lf (13/10 - \r\n) between each line and the whole line is
 * delimited with a closing -\r\n
 * 
 * :20:TRANS REF 01
 * :32A:080717GBP100,01
 * :50K:/51507865
 * XYZ PLC
 * 20 SMITH ST
 * BOURNEMOUTH
 * GB
 * :57A://SC200000
 * BARCGB2102B
 * :59:/12345678
 * MR J SMITH
 * :70:PAYMENT IN FULL AND FINAL
 * SETTLEMENT FOR INVOICE NUMBER 513
 * DATED 05/06/08
 * -
 * 
 * 
 * 
 * @returns Boolean value
 ******************************************************************/
function mt103Build()
{

	var retVal = '';
	
	try
	{
		
		mt103RecordIDs = lookupMT103Records();
	
		
		if (mt103RecordIDs.length != 0)
		{
			for (var i = 0; i < mt103RecordIDs.length; i++) 
			{			
				currentMT103Rec = nlapiLoadRecord('customrecord_mt103', mt103RecordIDs[i]);
				
				// processing for the mt103 message
				processingForMT103();
				
				// construct the message
				constructMT103Message();

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



/*****************************************************************
 * process various mt103 fields for formatting purposes
 * 
 ****************************************************************/
function processingForMT103()
{
	validDate = currentMT103Rec.getFieldValue('custrecord_mt103_processingdate');
	nlapiLogExecution('debug','date', validDate);
	validDate = parseDate(validDate);
	nlapiLogExecution('debug','after date', validDate);

	// 1.0.1 rounding issue				
	numAmount = currentMT103Rec.getFieldValue('custrecord_mt103_amount');
	numAmount = Math.round(numAmount,0);
	numAmount = parseInt(numAmount);
}

/**
 * construct the mt103 record
 */

function constructMT103Message()
{
	mt103 = mt103 + ":20:" + "TRANS REF " +currentMT103Rec.getFieldValue('custrecord_mt103_reference') + "\r\n";
	mt103 = mt103  + ":32A:" + validDate + currentMT103Rec.getFieldValue('custrecord_mt103_currency') + numAmount+",01"+ "\r\n";
	mt103 = mt103  + ":50A:/" + currentMT103Rec.getFieldValue('custrecord_mt103_firstpartyaccountnumber')+ "\r\n";
	mt103 = mt103  + currentMT103Rec.getFieldValue('custrecord_mt103_firstpartyname') + "\r\n";
	mt103 = mt103  + ":57A:" +currentMT103Rec.getFieldValue('custrecord_mt103_firstpartysortcode')+ "\r\n";
	mt103 = mt103  + ":59:/" +currentMT103Rec.getFieldValue('custrecord_mt103_bankaccount')+  "\r\n";
	mt103 = mt103  + currentMT103Rec.getFieldValue('custrecord_mt103_accountname') + "\r\n";
	mt103 = mt103 + '-\r\n';
}



/******************************************************************
 * Create MT103 file and attach to email
 * 
 *****************************************************************/
function mt103Email()
{
	var newAttachment = null;
	var retVal = false;
	
	try 
	{		
		nlapiLogExecution('AUDIT', 'mt103 output', mt103);
		
		//creates MT103 file
		newAttachment = nlapiCreateFile('mt103details.txt', 'PLAINTEXT', mt103);     
		
		//emails text file as attachment	
		context = nlapiGetContext();
		userID = nlapiGetUser(); 
		userEmail = context.getEmail();
		
		//send email
		nlapiSendEmail(userID, 'matthew.lawrence@firsthosted.co.uk', 'TEST EMAIL', 'MT103 file attached', null, null, null, newAttachment); //debug code
		nlapiSendEmail(userID, 'achala.siriwardena@firsthosted.co.uk', 'TEST EMAIL', 'MT103 file attached', null, null, null, newAttachment); //debug code
			
		retVal = true;
	}
	catch(e) 
	{
		errorHandler(e);
	}
	return retVal;
}



/******************************************************************
 * Set include flags on newly exported records to false
 * 
 *****************************************************************/
function resetIncludeFlags()
{
	for (var i = 0; i < mt103RecordIDs.length; i++)
	{
		nlapiSubmitField('customrecord_mt103', mt103RecordIDs[i], 'custrecord_mt103_include', 'F');
	}
}


/*******************************************************************
 * error handler
 * @param e
 * 
 ******************************************************************/
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());
	response.write('Error: ' + errorMessage);
}


/*******************************************************************
 * error message
 * @param e
 * 
 ******************************************************************/
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


/*******************************************************************
 * Parse date from custom record to MT`03 format 
 * 1.0.2 - 14 Feb 2013 - correcting a comment - SA
 ******************************************************************/
function parseDate(dateStr)
{
	var day = '';
	var month = '';
	var year = '';
	var newDate = '';
	
	if ((dateStr.indexOf('.') == 2 && dateStr.lastIndexOf('.') == 5) || (dateStr.indexOf('/') == 2 && dateStr.lastIndexOf('/') == 5) ) //Example date: 12.12.2012 or 12/12/2012
	{
		day = dateStr.substring(0,2);
		month = dateStr.substring(3,5);
		year = dateStr.substring(8,10);
	}
	else if ((dateStr.indexOf('.') == 1 && dateStr.lastIndexOf('.') == 3) || (dateStr.indexOf('/') == 1 && dateStr.lastIndexOf('/') == 3)) //Example date: 2.2.2012 or 2/2/2012
	{
		day = '0' + dateStr.substring(0,1);
		month = '0' + dateStr.substring(2,3);
		year = dateStr.substring(6,8);
	}
	//version 1.0.2 - correcting a comment
	else if ((dateStr.indexOf('.') == 1 && dateStr.lastIndexOf('.') == 4) || (dateStr.indexOf('/') == 1 && dateStr.lastIndexOf('/') == 4)) //Example date: 2.12.2012 or 2/12/2012
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
	
	//newDate = day + month + year;
	newDate = year + month + day;

	return newDate;
}

/*******************************************************************
 * Get internal IDs for checked MT103 records 
 * 
 * @returns array of internal IDs
 ******************************************************************/
function lookupMT103Records()
{
	//Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	
	var internalIDs = new Array();
	
	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('custrecord_mt103_include', null, 'is', 'T');    

		//return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		//perform search
		var itemSearchResults = nlapiSearchRecord('customrecord_mt103', null, invoiceSearchFilters, invoiceSearchColumns);
		
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


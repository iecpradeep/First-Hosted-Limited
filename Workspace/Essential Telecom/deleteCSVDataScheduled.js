/****************************************************************************************************************************************
 * Name: 			deleteCSVDataScheduled.js
 * Script Type: 	Scheduled
 *
 * Version: 		1.0.0 - 25/02/2013 - 1st release - AM
 * 
 * Author: 			First Hosted Limited
 *
 * Purpose: 		A scheduled script to delete all existing data, then schedule the 
 * 					managementReport scheduled script immediately afterwards
 *
 * Script: 			The script record id - custscript_refreshalldata
 * Deploy: 			The script deployment record id - customdeploy_refreshalldata
 *
 * Notes: 			This script is NOT linked to a form, and never will be
 *
 * Library: 		n/a
 ****************************************************************************************************************************************/

var inDebug = true;
var errorText = '';

var scriptUsageLimit = 40;

var dataRecordName = 'customrecord_cdrdata'; 
var voucher  = 'customrecord_vouchers';
var purchasecdrs = 'customrecord_purchasecdrs';
var simcard = 'customrecord_sim_card';
var dailytopups = 'customrecord_dailytopupvouchers';
var cashsale = 'cashsale';

var journalentry = 'journalentry';


/*******************************************************************
 * refreshAllData
 * 
 * Main entry point for the scheduled script
 * 
 * @returns {Boolean}
 * 
 *******************************************************************/
function deleteCSVData()
{
	var retVal = true;
	
	try
	{
		deleteAllRecords(dataRecordName);	//'customrecord_cdrdata'
		deleteAllRecords(voucher);		//'customrecord_vouchers'
		deleteAllRecords(purchasecdrs);	//'customrecord_purchasecdrs'
		deleteAllRecords(simcard);		//'customrecord_sim_card'
		deleteAllRecords(dailytopups);	//'customrecord_dailytopupvouchers'	
		deleteAllRecords(cashsale);		//'cashsale'
		
		deleteAllJournals(journalentry);		//'journalentry'
	}
	catch(err)
	{
		errHandler('refreshAllData', err);
	}
	return retVal;
}


/*******************************************************************
 * deleteAllRecords
 * 
 * @param {String} recordType - Internal Record Name of the Record Type
 * 
 * @returns {Boolean} - Whether the function was successful
 * 
 *******************************************************************/
function deleteAllRecords(recordType)
{
	var deleteSearchResults = '';
	
	try
	{
		deleteSearchResults = nlapiSearchRecord(recordType, null, null, null);

		nlapiLogExecution('DEBUG', 'Delete All Records', 'Attempting to delete ' + deleteSearchResults.length + ' records...');

		for (var i = 0; i < deleteSearchResults.length; i++)
		{

			nlapiDeleteRecord(recordType, deleteSearchResults[i].getId());
		}

		nlapiLogExecution('DEBUG', 'Delete All Records', 'All records of type ' + recordType + ' have been deleted.');
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'deleteAllRecords', e.message);
	}
	return true;
}


/*******************************************************************
 * deleteAllJournals
 * 
 * @param {String} recordType - Internal Record Name of the Record Type
 * 
 * @returns {Boolean} - Whether the function was successful
 * 
 *******************************************************************/
function deleteAllJournals(recordType)
{
	var deleteSearchResults = '';
	
	var record = 0; 
	var nextRecord = 0;
	var incrementor = 1 ;
	
	try
	{
		deleteSearchResults = nlapiSearchRecord(recordType, null, null, null);

		nlapiLogExecution('DEBUG', 'Delete All Records', 'Attempting to delete ' + deleteSearchResults.length + ' records...');

		for (var i = 0; i < deleteSearchResults.length; i++)
		{
			if(recordType = journalentry)
			{
				record = deleteSearchResults[i].getId();
				nextRecord = deleteSearchResults[i + incrementor].getId();
				
				// because journals has credits and debits it duplicates the resulting records. 
				if(record != nextRecord )
				{
					nlapiDeleteRecord(recordType, deleteSearchResults[i].getId());
				}
			}
			else
			{
				nlapiDeleteRecord(recordType, deleteSearchResults[i].getId());
			}
		}

		nlapiLogExecution('DEBUG', 'Delete All Records', 'All records of type ' + recordType + ' have been deleted.');
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'deleteAllRecords', e.message);
	}
	return true;
}


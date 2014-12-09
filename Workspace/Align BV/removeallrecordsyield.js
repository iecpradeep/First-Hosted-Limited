/***********************************************************************************************************************
 * Name: 		remove all customers transactions and audit records
 * Script Type: scheduled
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 04/09/2012 - Initial release
 * 				1.0.2 - 21/09/2012 - amended - remove yield and replace with reschedule
 * 				1.0.3 - 25/09/2012 - amended - not all records were being removed
 * 				1.0.4 - 26/09/2012 - amended - fixed rescheduling bug
 * 
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		removeallrecordsyield.js
 * Deploy: 		
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=4126&c=3524453&h=20aacbc55b6f566ecd23&_xt=.js  
 * Production:
 * 
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * NOTE** USE WITH GREAT CARE - THIS SCRIPT WILL REMOVE ALL RECORDS FROM A DEPLOYMENT
 * 
 ***********************************************************************************************************************/


/**
 * remove all records
 *  			1.0.4 - 26/09/2012 - amended - fixed rescheduling bug
 */
function removeAllRecords()
{


	try
	{

		// delete audit trail
		while(deleteallrecords('customrecord_invoiceaudit','custrecord_description') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		} 
		
		// customer refund
		while(deleteallrecords('customerrefund','entity') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		}

		// cash refund
		while(deleteallrecords('cashrefund','entity') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		}

		// delete transactions
		while(deleteallrecords('transaction','type') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		}

		// delete customer children
		while(deleteallrecords('customer','parent') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		}

		// delete customers
		while(deleteallrecords('customer','entityid') == true)
		{
			nlapiLogExecution("AUDIT", "processing");
		}



		nlapiLogExecution("AUDIT", "finished all deletions", 'finished all deletions');

	}
	catch(e)
	{
		var context = nlapiGetContext();

		var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
		if ( status == 'QUEUED' )
		{
			nlapiLogExecution("AUDIT", "error encountered rescheduled", 'delete all error');
			nlapiLogExecution("AUDIT", "Useage limit up, rescheduled", "rescheduled");
		}
		else
		{
			nlapiLogExecution("AUDIT", "error: " + e, 'delete all error');	
		}

		

	}


}


/**
 * delete all records
 * 
 * 1.0.1 - 25/09/2012 - amended - not all records were being removed
 * 1.0.4 - 26/09/2012 - amended - fixed rescheduling bug
 * 
 * @param recordtype
 * @param columnname
 * @returns {Boolean}
 */
function deleteallrecords(recordtype,columnname)
{
	var keepLooping = false;
	var context = nlapiGetContext(); 

	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();
	
	var rescheduled = false;

	nlapiLogExecution("AUDIT", "Starting deletion: " + recordtype, 'Starting');
	

	try
	{

		//search filters                  
		itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'isnotempty');                          

		// search columns
		itemSearchColumns[0] = new nlobjSearchColumn(columnname);

		var searchresults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

		for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
		{
			try
			{
				//var searchresult = searchresults[ i ];
				nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());

				rescheduled = checkforreschedule(context);
				
				if(rescheduled==true)
				{
					break;
				}

			}
			catch(e)
			{
				//nlapiLogExecution("AUDIT", "caught error", e.message);
				rescheduled = checkforreschedule(context);
				
				if(rescheduled==true)
				{
					break;
				}
			}
			
		}

		nlapiLogExecution("AUDIT", "finished batch: " + recordtype + ' i=' + i + ' Length=' +searchresults.length , 'finished');
		if(i==searchresults.length)
		{
			reschedule(context);
		}

	}
	catch(e)
	{
		nlapiLogExecution("AUDIT", "deletion error: " + e, 'deletion error');
	}

	return keepLooping;
}


/**
 * check if usage limits hit - if so re-schedule script
 * 
 * 1.0.1 - 25/09/2012 - amended - not all records were being removed
 * 
 * @param context
 * @returns {Boolean}
 */

function checkforreschedule(context)
{
	
	var retVal=false;
	
	if ( context.getRemainingUsage() <= 100 ) //  && (i+1) < searchresults.length )
	{
		reschedule(context);
		retVal = true;
	} 

	return retVal;

}

/**
 * reschedule script
 * 
 * 1.0.4 - 25/09/2012 - added - not all records were being removed
 * 
 * @param context
 * @returns {Boolean}
 */


function reschedule(context)
{

	var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId());
	
	if ( status == 'QUEUED' )
	{
		nlapiLogExecution("AUDIT", "Useage limit up, rescheduled", "rescheduled");
	}
	else
	{
		nlapiLogExecution("AUDIT", "Useage limit up, NOT rescheduled:" + status, "rescheduled");
	}
	
}


/***********************************************************************************************************************
 * Name: 		Remove all audit records JM
 * Script Type: Scheduled
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 31/07/2012 - Initial release
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	
 * 
 * Script: 		removeallrecords.js
 * Deploy: 		customdeploy1
 * Sandbox: 	https://system.sandbox.netsuite.com/core/media/media.nl?id=1721&c=3524453&h=60f79e51e205d15a4c30&_xt=.js  
 * Production:
 * 
 ***********************************************************************************************************************/


/**
 * usage: deleteallrecords('customrecord_xml_load_audit','custrecord_description'); 
 * 
 */
function removeAllRecords()
{
	while(deleteallrecords('customrecord_invoiceaudit','custrecord_description') == true)
	{
		nlapiLogExecution("AUDIT", "processing");
	}
}

/**
 * @param recordtype
 * @param columnname
 * @returns {Boolean}
 */
function deleteallrecords(recordtype,columnname)
{
	var keepLooping = false;

	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	//search filters                  
	itemSearchFilters[0] = new nlobjSearchFilter(columnname, null, 'isnotempty');                          

	// search columns
	itemSearchColumns[0] = new nlobjSearchColumn(columnname);

	var searchresults = nlapiSearchRecord(recordtype, null, itemSearchFilters, itemSearchColumns);

	for ( var i = 0; searchresults != null && i < searchresults.length; i++ )
	{
		try
		{
			var searchresult = searchresults[ i ];
			nlapiDeleteRecord(searchresults[i].getRecordType(), searchresults[i].getId());

			if( (i % 5) == 0 )
			{
				setRecoveryPoint(); //every 5 customers, we want to set a recovery point so that, in case of an unexpected server failure, we resume from the current "i" index instead of 0
			}  
			checkGovernance();
			keepLooping = true;

		}
		catch(e)
		{
			nlapiLogExecution("AUDIT", "catched", e.message);
		}
	}
	return keepLooping;
}

/**
 * 
 */
function setRecoveryPoint()
{
	var state = nlapiSetRecoveryPoint(); //100 point governance
	if( state.status == 'SUCCESS' ) return;  //we successfully create a new recovery point
	if( state.status == 'RESUME' ) //a recovery point was previously set, we are resuming due to some unforeseen error
	{
		nlapiLogExecution("ERROR", "Resuming script because of " + state.reason+".  Size = "+ state.size);
		handleScriptRecovery();
	}
	else if ( state.status == 'FAILURE' )  //we failed to create a new recovery point
	{
		nlapiLogExecution("ERROR","Failed to create recovery point. Reason = "+state.reason + " / Size = "+ state.size);
		handleRecoveryFailure(state);
	}
}

/**
 * 
 */
function checkGovernance()
{
	var context = nlapiGetContext();
	if( context.getRemainingUsage() < 50 )
	{
		var state = nlapiYieldScript();
		if( state.status == 'FAILURE')
		{
			nlapiLogExecution("ERROR","Failed to yield script, exiting: Reason = "+state.reason + " / Size = "+ state.size);
			throw "Failed to yield script";
		} 
		else if ( state.status == 'RESUME' )
		{
			nlapiLogExecution("AUDIT", "Resuming script because of " + state.reason+".  Size = "+ state.size);
		}
		// state.status will never be SUCCESS because a success would imply a yield has occurred.  The equivalent response would be yield
	}
}

/**
 * @param failure
 */
function handleRecoverFailure(failure)
{
	if( failure.reason == 'SS_CANCELLED' ) 
	{
		throw "Script Cancelled due to UI interaction";
	}
		
	if( failure.reason == 'SS_EXCESSIVE_MEMORY_FOOTPRINT' ) 
	{ 
		cleanUpMemory(); setRecoveryPoint(); 
	}//avoid infinite loop
	if( failure.reason == 'SS_DISALLOWED_OBJECT_REFERENCE' )
	{
		throw "Could not set recovery point because of a reference to a non-recoverable object: "+ failure.information;
	}
}

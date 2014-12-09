/*********************************************************************************************************************************************************
 * Name: 			supplierrecord_event.js
 * Script Type: 	User Event
 * Client:			WineSuite
 * 
 * Version: 		1.0.0 – 24/05/2013 – 1st release - AM
 *
 * Author: 			FHL
 * Purpose: 		
 * 
 * Script: 		 	customscript_
 * Deploy:			customdeploy_
 * 					
 * Library: 		library.js
 * 	
 * 
 *********************************************************************************************************************************************************/




/**
 * @returns {Boolean}
 */
function beforeLoad()       
{
	var retVal = false;
	var startSPL = '';
	var supplierid = '';
	
	try
	{
		supplierid = nlapiGetRecordId();
		startSPL = "window.open('"+"/app/site/hosting/scriptlet.nl?script=70&deploy=1&compid=TSTDRV1027092&SID="+ supplierid+"')";;
		form.addButton('custpage_startspl', 'Generate Supplier Packing List', startSPL);
		retVal = true;
	}
	catch(e)
	{
		nlapiLogExecution('debug', 'beforeLoad', e.message);
	}
	
	return retVal;
}
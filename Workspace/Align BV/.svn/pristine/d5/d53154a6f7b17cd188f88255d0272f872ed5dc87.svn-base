
/*************************************************************************************************************************
 * Name: 		customer.js
 * Script Type: client
 * Client: 		Align Technology
 * 
 * Version: 	1.0.0 - 11/07/2012 - Initial release - JM
 * 				
 * Author: 		FHL
 * 
 * Purpose: 	client scipt for iTero customer form
 * 				set default values for customer form for header and detail
 * 
 * Script: 		no script record
 * Deploy: 		no deploy record
 * 
 ***********************************************************************************************************************/



/**
 * page init
 * 
 * @returns {Boolean}
 */
function PageInit() 
{
	nlapiSetFieldValue('autoname','F');
	nlapiSetFieldValue('subsidiary','2');
	nlapiSetFieldValue('receivablesaccount','1733');
	nlapiSetCurrentLineItemValue('addressbook', 'defaultshipping', 'F');
	return true;
}

/**
 * line update
 * 
 * @returns {Boolean}
 */
function LineVal() 
{	
	nlapiSetCurrentLineItemValue('addressbook', 'defaultshipping', 'F');
	return true; 
}


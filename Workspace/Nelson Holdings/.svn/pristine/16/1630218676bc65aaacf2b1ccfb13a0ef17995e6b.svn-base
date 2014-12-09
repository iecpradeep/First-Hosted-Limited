
/**********************************************************************************************************
 * Name:        setSODepositValues  (setSODepositValues.js)
 * Script Type: User Event Script
 * Client:     Nelson Holdings  
 * 
 * Version:     1.0.0 -     - first release - SA
 * 
 * Author:      FHL
 * Purpose:    whenever deposit is created against a sales order, need to set deposit amount in the custom field of sales order record (after relavent calculation.
 * 
 * Script:      customscript_setsodepositvalues  
 * Deploy:      customdeploy_setsodepositvalues  
 * 
 * 
 **********************************************************************************************************/

function setSOAmounts()
{
	var salesOrderID = nlapiGetFieldValue('salesorder');
	
 
	// if sales order is selected in deposit
	if (isNotBlank(salesOrderID))
	{
		// call teh library function where it does calculation and set deposit amount field in the SO
		updatedDepositedAmount(salesOrderID);		
		
	}
	return true;	
}

function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
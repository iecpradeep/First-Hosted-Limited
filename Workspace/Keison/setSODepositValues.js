
/**********************************************************************************************************
 * Name:        setSODepositValues  (setSODepositValues.js)
 * Script Type: User Event Script
 * Client:      Keison International Limited  
 * 
 * Version:     1.0.0 -     - first release - Brendon
 * Version:     1.0.1 -     - Amended - added library function which calculates and set field value in the SO
 * 
 * Author:      FHL
 * Purpose:    whenever deposit is created against a sales order, need to set deposit amount in the custom field of sales order record (after relevant calculation.
 * 
 * Script:      customscript_kil_setdepositamounts  
 * Deploy:      customdeploy_kilsetdepositamounts 
 * 
 * 
 **********************************************************************************************************/


function setSOAmounts()
{
	var salesOrderID = nlapiGetFieldValue('salesorder');
	
 
	// if sales order is selected in deposit
	if (isNotBlank(salesOrderID))
	{
		// call the library function where it does calculation and set deposit amount field in the SO
		updatedDepositedAmount(salesOrderID);		
		
	}
	return true;	
}

function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
/*******************************************************
 * Name: 					Export Payments to Coutts formatted CSV
 * Script Type: 			Client
 * Version: 				1.0.000
 * Date: 					22nd Mar 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Gets the selected invoices and creates a CSV to download
 * Checked by:			
 *******************************************************/


var numberOfLines = 0;
var numberOfSelectedLines = 0;
var selectedArray = new Array();
var invLine = '';
/****
 * test function
 */
function exportTransactions() 
{
	//alert('test printme');
	//nlapiLogExecution('DEBUG', 'Working','Executed PrintMe!');
	
	
	numberOfLines = nlapiGetLineItemCount('custpage_multiprint_invtab');
	//var test = nlapiGetLineItemCount('custpage_multiprint_invtab');
	
	var thisLine = 1;
	while(invLine != null)
	{
		invLine = nlapiGetLineItemValue('custpage_multiprint_invtab','custpage_invprintchk', thisLine);
		alert('Line : ' + thisLine + '\nInvLine: ' + invLine);
		thisLine++;
	}
	
	
	if(numberOfLines == null || numberOfLines <= 0)
	{
		alert('There are no Transactions here');
		
	}
	else
	{
		alert('There are ' + numberOfLines + ' lines in the Transaction List to print.');
	}	
	return true;
	
}


function fillSelectedArray()
{
	
	return selectedArray;
}


 /***********
  * Function to test the Field Changed
  * 
  * @param {Object} type
  * @param {Object} name
  * @param {Object} linenum
  */
function myFieldChanged(type, name, linenum)
{
	alert('FieldChanged type=' + type + '\nname=' + name + '\nlinenum=' + linenum);
} 


function myBeforeLoadFunc(type, form)
{
	if (type == 'view') 
	{
		
		form.setScript('customscript_exporttocsvclient');
		form.addButton('custpage_myviewbutton','Create VAT Sales Invoice','exportTransactions();');
		
	}
}
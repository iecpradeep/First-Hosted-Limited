/*******************************************************
 * Name: 					Export Payments to Coutts formatted CSV
 * Script Type: 			Suitelet
 * Version: 				1.0.000
 * Date: 					21st Mar 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Select the Invoices which need to be paid
 * Checked by:			
 *******************************************************/
var exportForm = null;
var savedSearchID = 'customsearch_couttsexport';
var savedSearchType = 'transaction';
var savedSearchResults = null;
var tabInvoices = null;
var tabHelp = null;
var slistInvoices = null;
var helpField = null;
var searchLinkField = null;

/*******
 *  This is the function called from the Script Deployment
 */
function createExportTabStrip() 
{

	buildTabSet();
	populateData();
	response.writePage(exportForm);
	
}


/****
 * Builds the Tab Set for the data
 */
function buildTabSet()
{
	//alert('test build tab set');
	exportForm = nlapiCreateForm('Export Invoices to Coutts CSV');
	exportForm.setScript('customscript_exporttocsvclient');
	searchLinkField = exportForm.addField('custpage_searchlink', 'url', 'Source Search');
	searchLinkField.setDefaultValue('https://system.netsuite.com/app/common/search/search.nl?cu=T&e=T&id=225');

	tabHelp = exportForm.addTab('custpage_multiprint_helptab', 'Help');
	helpField = exportForm.addField('custpage_howto', 'textarea', 'How to', null, 'custpage_multiprint_helptab');
	helpField.setDefaultValue('To use this Suitelet, you must select all of the Payment Details you wish to Export, then press the Export to CSV button.');
	
	tabInvoices = exportForm.addTab('custpage_multiprint_invtab', 'Invoices');

	slistInvoices = exportForm.addSubList('custpage_multiprint_invsublist', 'list', 'Invoices', 'custpage_multiprint_invtab'); 
	slistInvoices.addField('custpage_invprintchk', 'checkbox', 'Export');
	slistInvoices.addField('custpage_invdate', 'date', 'Date');
	slistInvoices.addField('custpage_invcompany', 'text', 'Company Name');
	slistInvoices.addField('custpage_invrefno', 'text', 'Ref No.');
	slistInvoices.addField('custpage_sortcode', 'text', 'Sort Code');
	slistInvoices.addField('custpage_accno', 'text', 'Account Num');
	slistInvoices.addField('custpage_invtype', 'text', 'Transaction Type');
	slistInvoices.addField('custpage_status', 'text', 'Status');
	
	// buttons enabling pagination
	//	slistInvoices.addButton('custpage_invprevpage', 'Prev Page');
	//	slistInvoices.addButton('custpage_invnextpage', 'Next Page');
	      
	//Create Export button
	var script = 'exportTransactions';
	slistInvoices.addButton('custpage_export', 'Export to CSV', script);
	

}


/**************
 * Populates the Tabs with data
 */

function populateData()
{
	try
	{
		//alert('test populate data');
		//savedSearchResults = nlapiLoadSearch(savedSearchType,savedSearchID);	
		
		
		
		// search for invoices
		
		var invLineNum = 1;		
		var invSearchResults = nlapiSearchRecord('transaction', 'customsearch_exportcsv', null, null);
		
		nlapiLogExecution('DEBUG', 'Inv result length', invSearchResults.length);
		//var invResult = 0;
		
	/*	for (var i = 0; invSearchResults != null && i < invSearchResults.length; i++) {
			invResult = invResult + ', ' + invSearchResults[i].getValue(invSearchColumns[7]);		
		}*/
		
		//Checking if any search results
		if (invSearchResults) 
		{
	        var invRowLimit = invSearchResults.length;
	        
	        //Looping search results and populating columns
	        for (var i = 0; i < invRowLimit; i++) 
			{

	
				
	        	slistInvoices.setLineItemValue('custpage_invprintchk', invLineNum, 'F');
	        	slistInvoices.setLineItemValue('custpage_invdate', invLineNum, invSearchResults[i].getValue('trandate')); 
	        	slistInvoices.setLineItemValue('custpage_invcompany', invLineNum, invSearchResults[i].getText('companyname')); 
	        	slistInvoices.setLineItemValue('custpage_invrefno', invLineNum, invSearchResults[i].getText('internalid')); 
	        	slistInvoices.setLineItemValue('custpage_sortcode', invLineNum, '40 43 0' + i); 
	        	slistInvoices.setLineItemValue('custpage_accno', invLineNum, '414226 6' + i); 
	        	slistInvoices.setLineItemValue('custpage_invtype', invLineNum, invSearchResults[i].getValue('type'));
	        	slistInvoices.setLineItemValue('custpage_status', invLineNum, invSearchResults[i].getValue('status'));
	        	invLineNum++;
	        }//end for    	
	    }//end if
		else
		{
			nlapiLogExecution('DEBUG', 'Inv is null?', 'nulllllllllllll');
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Test', 'Test: ' + e.message);
		//alert('test');
	}
}



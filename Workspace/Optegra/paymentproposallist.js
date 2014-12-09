/*****************************************
 * Name:	 Payment Proposal List
 * Author:   Pete Lewis, First Hosted Limited
 * Client: 	 Prototype for internal reference
 * Date:     28th June 2012
 * Version:  1.0.0
******************************************/

function viewPaymentProposalList() 
{
	
	//Creates search form
	var form = nlapiCreateForm('Payment Proposal List');
	
	//Creates "Delivery Notes" tab
	var tabInvoice = form.addTab('custpage_ppl_invtab', 'Invoices');
	tabInvoice.addField('custpage_ppl_invlocation', 'list', 'location');
	//Creates "Delivery Notes" sublist
	var sublistInvoice = form.addSubList('custpage_multiprint_sosublist', 'staticlist', 'Delivery Notes', 'custpage_multiprint_sotab'); 
	
	//Creates search columns
	slistSalesOrders.addField('custpage_soprintchk', 'checkbox', 'Print Delivery Note?');
	slistSalesOrders.addField('custpage_sodate', 'date', 'Date');
	slistSalesOrders.addField('custpage_socompany', 'text', 'Company Name');
	slistSalesOrders.addField('custpage_sorefno', 'text', 'Ref No.');
	slistSalesOrders.addField('custpage_sotype', 'text', 'Transaction Type');
	slistSalesOrders.addField('custpage_sodelnoteprinted', 'checkbox', 'Delivery Note Printed');
	slistSalesOrders.addField('custpage_soitemfulfilprinted', 'checkbox', 'Item Fulfilment Printed');
	slistSalesOrders.addField('custpage_soinvoicesent', 'checkbox', 'Invoice Sent');
	
	// buttons enabling pagination
//	slistSalesOrders.addButton('custpage_soprevpage', 'Prev Page');
//	slistSalesOrders.addButton('custpage_sonextpage', 'Next Page');
	
	// creates print button
	slistSalesOrders.addButton('custpage_printdelnote', 'Print Delivery Note');
	
	//Creates "Item Fulfilments" tab
	var tabItemFulfils = form.addTab('custpage_multiprint_iftab', 'Item Fulfilments');
	
//	var stabItemFulfils = form.addSubTab('custpage_multiprint_ifsubtab', 'Item Fulfilments', 'custpage_multiprint_maintab'); 

	//Creates "Item Fulfilments" sublist
	var slistItemFulfils = form.addSubList('custpage_multiprint_ifsublist', 'staticlist', 'Item Fulfilments', 'custpage_multiprint_iftab'); 

	//Creates search columns
	slistItemFulfils.addField('custpage_ifprintchk', 'checkbox', 'Print Item Fulfilment?');
	slistItemFulfils.addField('custpage_ifdate', 'date', 'Date');
	slistItemFulfils.addField('custpage_ifcompany', 'text', 'Company Name');
	slistItemFulfils.addField('custpage_ifrefno', 'text', 'Ref No.');
	slistItemFulfils.addField('custpage_iftype', 'text', 'Transaction Type');
	slistItemFulfils.addField('custpage_ifdelnoteprinted', 'checkbox', 'Delivery Note Printed');
	slistItemFulfils.addField('custpage_ifitemfulfilprinted', 'checkbox', 'Item Fulfilment Printed');
	slistItemFulfils.addField('custpage_ifinvoicesent', 'checkbox', 'Invoice Sent');
	
	// buttons enabling pagination
//	slistItemFulfils.addButton('custpage_ifprevpage', 'Prev Page');
//	slistItemFulfils.addButton('custpage_ifnextpage', 'Next Page');
	
	//Creates print button
	slistItemFulfils.addButton('custpage_printitemfulfil', 'Print Item Fulfilment');

	var tabInvoices = form.addTab('custpage_multiprint_invtab', 'Invoices');
	
//	var stabInvoices = form.addSubTab('custpage_multiprint_invsubtab', 'Invoices', 'custpage_multiprint_maintab'); 

	var slistInvoices = form.addSubList('custpage_multiprint_invsublist', 'staticlist', 'Invoices', 'custpage_multiprint_invtab'); 
	
	//Creates search columns
	slistInvoices.addField('custpage_invprintchk', 'checkbox', 'Print Invoice?');
	slistInvoices.addField('custpage_invdate', 'date', 'Date');
	slistInvoices.addField('custpage_invcompany', 'text', 'Company Name');
	slistInvoices.addField('custpage_invrefno', 'text', 'Ref No.');
	slistInvoices.addField('custpage_invtype', 'text', 'Transaction Type');
	slistInvoices.addField('custpage_invdelnoteprinted', 'checkbox', 'Delivery Note Printed');
	slistInvoices.addField('custpage_invitemfulfilprinted', 'checkbox', 'Item Fulfilment Printed');
	slistInvoices.addField('custpage_invinvoicesent', 'checkbox', 'Invoice Sent');
	
	// buttons enabling pagination
//	slistInvoices.addButton('custpage_invprevpage', 'Prev Page');
//	slistInvoices.addButton('custpage_invnextpage', 'Next Page');
	
	//Creates print button
	slistInvoices.addButton('custpage_printinvoice', 'Print Invoices');
	
	//Search for sales orders
	
	var soLineNum = 1;
	var soSearchFilters = new Array();
	var soSearchColumns = new Array();
	
	//Search filter creation
	soSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	soSearchFilters[1] = new nlobjSearchFilter('type', null, 'anyof', 'SalesOrd');
	
	//Search column creation
	soSearchColumns[0] = new nlobjSearchColumn('trandate');
	soSearchColumns[1] = new nlobjSearchColumn('entity');
	soSearchColumns[2] = new nlobjSearchColumn('tranid');
	soSearchColumns[3] = new nlobjSearchColumn('custbody_delnoteprinted');
	soSearchColumns[4] = new nlobjSearchColumn('custbody_fulfilprinted');
	soSearchColumns[5] = new nlobjSearchColumn('custbody_invoicesent');
	soSearchColumns[6] = new nlobjSearchColumn('internalid');
	soSearchColumns[7] = new nlobjSearchColumn('type');
	
	
	var soSearchResults = nlapiSearchRecord('transaction', null, soSearchFilters, soSearchColumns);
	nlapiLogExecution('DEBUG', 'SO result length', soSearchResults.length);
	var soResult = 0;
	
/*	for (var i = 0; soSearchResults != null && i < soSearchResults.length; i++) {
		soResult = soResult + ', ' + soSearchResults[i].getValue(soSearchColumns[7]);		
	} */
	
	//Checking if any search results
	if (soSearchResults) {
        var soRowLimit = soSearchResults.length;
        
        //Looping search results and populating columns
        for (var i = 0; i < soRowLimit; i++) {
            slistSalesOrders.setLineItemValue('custpage_soprintchk', soLineNum, 'F');
        	slistSalesOrders.setLineItemValue('custpage_sodate', soLineNum, soSearchResults[i].getValue(soSearchColumns[0])); 
        	slistSalesOrders.setLineItemValue('custpage_socompany', soLineNum, soSearchResults[i].getText(soSearchColumns[1])); 
        	slistSalesOrders.setLineItemValue('custpage_sorefno', soLineNum, soSearchResults[i].getText(soSearchColumns[2])); 
        	slistSalesOrders.setLineItemValue('custpage_sotype', soLineNum, soSearchResults[i].getText(soSearchColumns[7])); 
        	slistSalesOrders.setLineItemValue('custpage_sodelnoteprinted', soLineNum, soSearchResults[i].getValue(soSearchColumns[3])); 
        	slistSalesOrders.setLineItemValue('custpage_soitemfulfilprinted', soLineNum, soSearchResults[i].getValue(soSearchColumns[4]));
        	slistSalesOrders.setLineItemValue('custpage_soinvoicesent', soLineNum, soSearchResults[i].getValue(soSearchColumns[5]));
        	soLineNum++;	
        } //end for  	
    }//end if
	
	nlapiLogExecution('DEBUG', 'test', soResult); 

	//Search for item fulfilments
	
	var ifLineNum = 1;
	var ifSearchFilters = new Array();
	var ifSearchColumns = new Array();
	
	//Search filter creation
	ifSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	ifSearchFilters[1] = new nlobjSearchFilter('type', null, 'anyof', 'ItemShip');
	
	//Search column creation
	ifSearchColumns[0] = new nlobjSearchColumn('trandate');
	ifSearchColumns[1] = new nlobjSearchColumn('entity');
	ifSearchColumns[2] = new nlobjSearchColumn('tranid');
	ifSearchColumns[3] = new nlobjSearchColumn('custbody_delnoteprinted');
	ifSearchColumns[4] = new nlobjSearchColumn('custbody_fulfilprinted');
	ifSearchColumns[5] = new nlobjSearchColumn('custbody_invoicesent');
	ifSearchColumns[6] = new nlobjSearchColumn('internalid');
	ifSearchColumns[7] = new nlobjSearchColumn('type');
	
	var ifSearchResults = nlapiSearchRecord('transaction', null, ifSearchFilters, ifSearchColumns);
	nlapiLogExecution('DEBUG', 'IF result length', ifSearchResults.length);
	var ifResult = 0;
	
/*	for (var i = 0; ifSearchResults != null && i < ifSearchResults.length; i++) {
		ifResult = ifResult + ', ' + ifSearchResults[i].getValue(ifSearchColumns[7]);		
	}*/
	
	//Checking if any search results
	if (ifSearchResults) {
        var ifRowLimit = ifSearchResults.length;
        
        //Looping search results and populating columns
        for (var i = 0; i < ifRowLimit; i++) {      
        	slistItemFulfils.setLineItemValue('custpage_ifprintchk', ifLineNum, 'F');
        	slistItemFulfils.setLineItemValue('custpage_ifdate', ifLineNum, ifSearchResults[i].getValue(ifSearchColumns[0])); 
        	slistItemFulfils.setLineItemValue('custpage_ifcompany', ifLineNum, ifSearchResults[i].getText(ifSearchColumns[1])); 
        	slistItemFulfils.setLineItemValue('custpage_ifrefno', ifLineNum, ifSearchResults[i].getText(ifSearchColumns[2])); 
        	slistItemFulfils.setLineItemValue('custpage_iftype', ifLineNum, ifSearchResults[i].getText(ifSearchColumns[7])); 
        	slistItemFulfils.setLineItemValue('custpage_ifdelnoteprinted', ifLineNum, ifSearchResults[i].getValue(ifSearchColumns[3])); 
        	slistItemFulfils.setLineItemValue('custpage_ifitemfulfilprinted', ifLineNum, ifSearchResults[i].getValue(ifSearchColumns[4]));
        	slistItemFulfils.setLineItemValue('custpage_ifinvoicesent', ifLineNum, ifSearchResults[i].getValue(ifSearchColumns[5]));
        	ifLineNum++;
        }//end for    	
    }//end if
	
	nlapiLogExecution('DEBUG', 'test', ifResult);
	
	// search for invoices
	
	var invLineNum = 1;	
	var invSearchFilters = new Array();
	var invSearchColumns = new Array();
	
	//Search filter creation
	invSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	invSearchFilters[1] = new nlobjSearchFilter('type', null, 'anyof', 'CustInvc');
	
	//Search column creation
	invSearchColumns[0] = new nlobjSearchColumn('trandate');
	invSearchColumns[1] = new nlobjSearchColumn('entity');
	invSearchColumns[2] = new nlobjSearchColumn('tranid');
	invSearchColumns[3] = new nlobjSearchColumn('custbody_delnoteprinted');
	invSearchColumns[4] = new nlobjSearchColumn('custbody_fulfilprinted');
	invSearchColumns[5] = new nlobjSearchColumn('custbody_invoicesent');
	invSearchColumns[6] = new nlobjSearchColumn('internalid');
	invSearchColumns[7] = new nlobjSearchColumn('type');
	
	var invSearchResults = nlapiSearchRecord('transaction', null, invSearchFilters, invSearchColumns);
	nlapiLogExecution('DEBUG', 'Inv result length', invSearchResults.length);
	var invResult = 0;
	
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
        	slistInvoices.setLineItemValue('custpage_invdate', invLineNum, invSearchResults[i].getValue(invSearchColumns[0])); 
        	slistInvoices.setLineItemValue('custpage_invcompany', invLineNum, invSearchResults[i].getText(invSearchColumns[1])); 
        	slistInvoices.setLineItemValue('custpage_invrefno', invLineNum, invSearchResults[i].getText(invSearchColumns[2])); 
        	slistInvoices.setLineItemValue('custpage_invtype', invLineNum, invSearchResults[i].getText(invSearchColumns[7])); 
        	slistInvoices.setLineItemValue('custpage_invdelnoteprinted', invLineNum, invSearchResults[i].getValue(invSearchColumns[3])); 
        	slistInvoices.setLineItemValue('custpage_invitemfulfilprinted', invLineNum, invSearchResults[i].getValue(invSearchColumns[4]));
        	slistInvoices.setLineItemValue('custpage_invinvoicesent', invLineNum, invSearchResults[i].getValue(invSearchColumns[5]));
        	invLineNum++;
        }//end for    	
    }//end if
	
	nlapiLogExecution('DEBUG', 'test', invResult);
	
	response.writePage(form);
	
}

function PrintMe() 
{
	
	nlapiLogExecution('DEBUG', 'Working','Executed PrintMe!');
	return true;
	
}
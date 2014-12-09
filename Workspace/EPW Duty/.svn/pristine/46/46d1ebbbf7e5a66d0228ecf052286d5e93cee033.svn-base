/********************************************************************************
 * Customer:	Edward Parker Wines
 * Version:		Version 1.3.1
 * Date:		August - December 2011
 * Author:		First Hosted Limited
 * Notes:		Creation of VAT/Duty Invoice from existing invoice. 
 ********************************************************************************/

function createInvoice()
{
	
	var VATMulti = 1.20;
	var VATDiv = 0.20;
	var totalQty = 0;
	
	
	
	try 
	{
		
		// get number of item lines from current invoice
		
		var lineCount = nlapiGetLineItemCount('item');
		//alert( 'lineCount' + 'lineCount: ' + lineCount);
		
		// add up the total number of bottles and then determine the number of cases	
		for (var currentLine = 1; currentLine <= lineCount && lineCount != null; currentLine++)
		{
			var currentQty = parseInt(nlapiGetLineItemValue('item','quantity',currentLine));
			totalQty += currentQty;
			//alert( 'currentLine' + 'currentLine: ' + currentLine);
		} //for
		
		var caseQty = totalQty / 12;
		//alert( 'caseQty' + 'caseQty: ' + caseQty);
		var location = nlapiGetLineItemValue('item', 'location', 1);
		//alert( 'location' + 'location: ' + location);

		// get transaction total, transaction number and customer from current invoice
		
		var transTotal = nlapiGetFieldValue('total');
		var transNumber = nlapiGetFieldValue('tranid');
		var vatDescription = 'VAT amount payable on ' + transNumber;
		var transDescription = 'VAT & DUTY for ' + transNumber;
		var customer = nlapiGetFieldValue('entity');
		var salesRep = nlapiGetFieldValue('salesrep');
		var vatDue = parseInt(transTotal)*0.20;
		//alert( 'vatDue' + 'vatDue: ' + vatDue);
		// create a new invoice record
		
		var newRecord = nlapiCreateRecord('invoice',{recordmode: 'dynamic'});
		//alert( 'Called function newRecord' + 'newRecord: ' + newRecord);

		// set header information

		newRecord.setFieldValue('customform', '114');				
		newRecord.setFieldValue('entity', customer);
		newRecord.setFieldValue('memo', transDescription);
		if (salesRep != null) newRecord.setFieldValue('salesrep', salesRep);
		newRecord.setFieldValue('exchangerate',1.00);
		
		//alert( 'salesRep' + 'salesRep: ' + salesRep);
		
		// enter line items
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item','1619');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'price','-1');
		newRecord.setCurrentLineItemValue('item', 'description', vatDescription);
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'rate', transTotal);
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		//alert( 'transTotal' + 'transTotal: ' + transTotal);
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1619');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'rate', -transTotal);
		newRecord.setCurrentLineItemValue('item', 'description', 'Less: Amount previously paid');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '7');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		//alert( ' -transTotal' + ' -transTotal: ' +  -transTotal);
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1631');
		newRecord.setCurrentLineItemValue('item', 'quantity', caseQty);
		newRecord.setCurrentLineItemValue('item', 'rate', 20.25);
		newRecord.setCurrentLineItemValue('item', 'description', 'Duty per case');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		//alert( 'caseQty' + 'caseQty: ' + caseQty);
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1612');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'rate', 0.00);
		newRecord.setCurrentLineItemValue('item', 'description', 'Delivery charge at cost');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		//alert( 'item' + 'item ID: ' + 1612);
		// submit new record
		
		var id = nlapiSubmitRecord(newRecord);
		
		//alert( 'id' + 'ID: ' + id);
		
		// open record in EDIT mode in new window
		
		var newRecordURL = nlapiResolveURL('RECORD','invoice',id, 'EDIT');
		//alert( 'Called function newRecordURL' + 'newRecordURL: ' + newRecordURL);
		window.open(newRecordURL);
				
		return true;
	} 
	catch (e) 
	{
		alert('Create VAT Duty Script error:\n\n' + e.message);
		return false;	
	}
	
} //function



function createDutyInvoice()
{
	
	var VATMulti = 1.20;
	var VATDiv = 0.20;
	var totalQty = 0;
	
	
	//Pete's additions
	var totalDuty = 0;
	var lineDuty =0;
	var lineBottles =0;
	var lineSize = 0;
	var lineQty = 0;
	var lineDutyCase = 0;
	var lineDutyHalf = 0
	var thisDuty = 0;
	
	
	try 
	{
		
		// get number of item lines from current invoice
		
		var lineCount = nlapiGetLineItemCount('item');
	
		// add up the total number of bottles and then determine the number of cases	
		for (var currentLine = 1; currentLine <= lineCount && lineCount != null; currentLine++)
		{
			//var currentQty = parseInt(nlapiGetLineItemValue('item','quantity',currentLine));
			lineQty = parseInt(nlapiGetLineItemValue('item','quantity', currentLine));
			
			
			
			
			
			//totalQty += currentQty;
			totalQty +=lineQty;
			
		} //for
		
		var caseQty = totalQty / 12;
		
		var location = nlapiGetLineItemValue('item', 'location', 1);
		

		// get transaction total, transaction number and customer from current invoice
		
		var transTotal = nlapiGetFieldValue('total');
		var transNumber = nlapiGetFieldValue('tranid');
		var vatDescription = 'VAT amount payable on ' + transNumber;
		var transDescription = 'VAT & DUTY for ' + transNumber;
		var customer = nlapiGetFieldValue('entity');
		var salesRep = nlapiGetFieldValue('salesrep');
		var vatDue = parseInt(transTotal)*0.20;
		
		// create a new invoice record
		
		var newRecord = nlapiCreateRecord('invoice',{recordmode: 'dynamic'});
	

		// set header information

		newRecord.setFieldValue('customform', '114');				
		newRecord.setFieldValue('entity', customer);
		newRecord.setFieldValue('memo', transDescription);
		if (salesRep != null) newRecord.setFieldValue('salesrep', salesRep);
		newRecord.setFieldValue('exchangerate',1.00);
		

		
		// enter line items
		
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item','1619');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'price','-1');
		newRecord.setCurrentLineItemValue('item', 'description', vatDescription);
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'rate', transTotal);
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
				
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1619');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'rate', -transTotal);
		newRecord.setCurrentLineItemValue('item', 'description', 'Less: Amount previously paid');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '7');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1631');
		newRecord.setCurrentLineItemValue('item', 'quantity', caseQty);
		newRecord.setCurrentLineItemValue('item', 'rate', 20.25);
		newRecord.setCurrentLineItemValue('item', 'description', 'Duty per case');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		
		newRecord.selectNewLineItem('item');
		newRecord.setCurrentLineItemValue('item', 'item', '1612');
		newRecord.setCurrentLineItemValue('item', 'quantity', 1);
		newRecord.setCurrentLineItemValue('item', 'rate', 0.00);
		newRecord.setCurrentLineItemValue('item', 'description', 'Delivery charge at cost');
		newRecord.setCurrentLineItemValue('item', 'taxcode', '3309');
		newRecord.setCurrentLineItemValue('item', 'location', location);
		newRecord.commitLineItem('item');
		
		// submit new record
		
		var id = nlapiSubmitRecord(newRecord);
		

		
		// open record in EDIT mode in new window
		
		var newRecordURL = nlapiResolveURL('RECORD','invoice',id, 'EDIT');
				
		window.open(newRecordURL);
				
		return true;
	} 
	catch (e) 
	{
		alert(e);
		return false;	
	}
		
} //function



function SAFieldChanged(type, name, linenum)
{
	//DEBUG ******
	
	if (nlapiGetRole() == '1008')	//Only run when you're logged in as the Script Administrator
	{
		var TheValue = nlapiGetFieldValue(name);
		
		alert('SAFieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue);
		
		if((name =='custcol_contractvalue') || (name == 'quantity'))
		{
			
			//nlapiSetCurrentLineItemValue('item','amount',9469,false,false);
			//nlapiSetFieldValue('amount',10000,false,false);
			//SACalculateGP(type, name, linenum);
		}
	}
} 

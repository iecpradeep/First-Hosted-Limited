/**************************************************************************************************************************************************************************
 * Name: 			printSimSuitelet.js
 * Script Type: 	Suitelet
 * Client: 			Blueberry
 * 
 * Version: 		1.0.0 - 20/02/2013 - 1st release - AM
 *					1.1.0 - 21/02/2013 - adding getInvoiceLineFields(lineNumber),getInvoiceFields(), getCompanyInformation() functions - AS
 *					1.1.1 - 22/02/2013 - doing the calculations - AS
 *									   - adding the line items - AS	
 *					1.1.2 - 25/02/2013 - splitting the sim numbers - AS
 *					1.1.3 - 14/03/2013 - set the distriCommission to two decimal point - AS
 *					1.1.4 - 01/05/2013 - changing the names from Invoice to invoice - AS
 *
 * Author: 			FHL
 * Purpose: 		To print the sim card details in invoice separately.
 * 		
 * Script: 			custscript_printsimscards
 * Deploy: 			customdeploy_printsimcards
 * 
 * Library: 		library.js
 * 
 **************************************************************************************************************************************************************************/

//Declaring global variables
var logo = '';
var company = null; 
var companyAddress1 = '';
var companyAddress2  = '';
var companyCity = '';
var companyState  = '';
var companyPostCode  = '';
var companyCountry  = '';
var companytaxID  = '';
var invoiceID = '';
var invoiceRecord = '';
var invoicePartner = '';
var invoiceNumber = 0;
var invoiceBillTo = '';
var invoiceDate = '';
var paymentMethod = '';
var taxId = '';
var chequeNo = '';
var project = '';
var startDate = '';
var endDate = '';
var numOfItems = 0;

var itemName = '';
var itemQuantity = '';
var itemDescription = '';
var itemRate = '';
var itemAmount = '';
var itemTaxRate = '';
var itemTaxAmt = '';
var itemGrossAmt = '';
var itemSimCards = '';

var subTotal = 0; 
var distributorRate = 0;
var distriCommission = 0;

var totalTax = 0;
var taxCalc = 0;
var total = 0;
 var simNumber = '';
 var pdfxml = '';
/*************************************************************************************
 * printExpenseClaim
 * 
 * @returns {Boolean}
 * 
 * version 1.1.1 - doing the calculations - AS
 * 		 		 - adding the line items - AS	
 * 
 * version 1.1.3 - set the distriCommission to two decimal point - AS
 *************************************************************************************/
function printSimCards()
{
	var simCards = '';
	try
	{
		
		//getting the company information such as address 
		getCompanyInformation();
		
		invoiceID = request.getParameter('custparam_invoiceid');
		
		if(invoiceID == "" || invoiceID == null)
		{
			var errormsg = "<html><body><p>You cannot print the Sims as they have not been saved yet, or the Parameter has been passed through incorrectly.</p></body></html>";
			response.write(errormsg);
			return true;
			
		}

		// if a parameter has been passed
		if(invoiceID) 
		{	
			// load Invoice record
			invoiceRecord = nlapiLoadRecord('invoice',invoiceID);
			
			//getting invoice form's body fields
			getInvoiceFields();
			
			//create the header of the PDF
			pdfxml= '<?xml version="1.0"?>';
			pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
			pdfxml += '<pdf>';
			pdfxml += '<head><meta name="title" value="Invoice Sim Cards" />\n<style type="text/css">.style1{height: 23px;}</style></head>';
			pdfxml += '<body background-color="white" font-size="12"  size="A4-landscape">';
			
			//adding logo
			pdfxml += '<table style="width:100%;"><tr><td><img display="inline" src="'+ logo + '" dpi="100" /></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">&nbsp;</td><td>' + companyAddress1 +'<br/>' + companyAddress2 + '<br/>' + companyCity + '<br/>' + companyState + '&nbsp;'+ companyPostCode + '<br/>' + companyCountry +  '<br/> Tax ID # &nbsp;' + companytaxID +'</td></tr></table>';
			
			//adding company information
			pdfxml += '<p style="font-family: Arial, Helvetica, sans-serif; font-size: large; font-weight: bold;">Invoice Sim Cards</p>';
			pdfxml += '<table width="100%"><tr><td><table style="width: 60%;"><tbody>';
			
			//adding bill to information
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; width: 35%;"><strong> Bill To </strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + invoicePartner + '<br/>' + invoiceBillTo +  '</td></tr>';
			pdfxml += '</tbody></table></td>';
			pdfxml += '<td align="right" valign="top">';
			
			//adding Invoice date and Invoice number
			pdfxml += '<table style="width: 50%;"><tbody><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Date</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + invoiceDate +  '</td></tr>';
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Sale #</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + invoiceNumber + '</td></tr>';
			
			//space line after 'Sale #'
			pdfxml += '<tr><td></td></tr>';
				
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Payment Method</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + paymentMethod +'</td></tr>';
			//[TODO] - get the tax no correctly
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Tax ID</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + taxid +'</td></tr>';
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Cheque #</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + chequeNo +'</td></tr>';
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Project</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + project +'</td></tr>';
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>Start Date</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + startDate +'</td></tr>';
			pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small"><strong>End Date</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + endDate +'</td></tr>';
			pdfxml += '</tbody></table></td></tr></table><br/><table style="border: thin solid #000000; width:100%;">';
			
			//adding table headers
			pdfxml += '<tr>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Item</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Quantity</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Description</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Rate</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Amount</b></td>'; 
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Tax Rate</b></td>'; 
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Tax Amt</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Gross Amt</b></td>'; 
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Sim Numbers</b></td>'; 
			pdfxml += '</tr>';

			//Looping through each item line
			for(var i = 1; i <= numOfItems; i++)
			{
				// getting the value in item list's 'Sim Numbers' column to check whether there are sim cards
				simCards = invoiceRecord.getLineItemValue('item', 'custcol_simnumbers', i);		

			
				//if sim numbers are there 
				if(simCards != null)
				{
					//get item line fields
					getInvoiceLineFields(i);
				
					if(itemName == null || itemName == '')
					{
						var errormsg = "<html><body><p>You cannot print this Expense Claim as it was created before this function was implemented.</p></body></html>";
						response.write(errormsg);
						return true;
					}

					//setting the lines for the table	
					//version 1.1.1 - adding the line items - AS	
					pdfxml +='<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemName + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemQuantity + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemDescription + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemRate + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemAmount + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemTaxRate + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemTaxAmt + '</td>';
					pdfxml +='<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + itemGrossAmt + '</td>';
				
					pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">';
					
					//spliting the sim numbers (sim numbers are returned as one line value, hence needs to be splitted)
					forEachSimRecord();
					
					pdfxml = pdfxml.concat('</td></tr>');	
					
				}
			} 
			
			//doing the calculation to display at the end of the page
			//version 1.1.1 - doing the calculations
				
				distributorRate = parseFloat(distributorRate)/100;					//returns as a (-) value
				distriCommission = subTotal * distributorRate ; 					//calculating the distributor commission
				distriCommission = parseFloat(distriCommission).toFixed(2);			//version 1.1.3 
				
				/*
				 * calculating the tax after deducting the commission (as the tax should be calculate after deducting the
				 * distributor rate from the total tax amount (that's how NetSuite works) the calculation should be performed
				 * in few steps as follows: 
				 * 			var commissionForTax = totalTax * distributorRate ;
				 * 			taxCalc = totalTax - commissionForTax; 	
				 * 
				 *  these two processes are combined as one as follows:
				 * 			
				 * 			taxCalc = totalTax - (totalTax * distributorRate); 	
				 *  		taxCalc = totalTax (1 - (1 * distributorRate)); 
				 *  
				 *  but as the distributorRate is returning as a (-) value, it should be added to 1 instead of deducting from 1.
				 */
				taxCalc = totalTax * (1 + distributorRate);							
				taxCalc = parseFloat(taxCalc).toFixed(2);
				total = parseFloat(subTotal) + parseFloat(distriCommission) + parseFloat(taxCalc); 		//distriCommission is already a (-)value
				total = parseFloat(total).toFixed(2);
			
					
			//the table at the end of the page to display the totals
			pdfxml += '</table><br /><table width="100%" align="right"><tr><td align="right">&nbsp;<table width="300px" style="border: thin solid #000000;">';
			pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Subtotal</b></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + subTotal +'</td></tr>';
			pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Discount Item(Distributor Commission)</b></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + distriCommission +'</td></tr>';
			pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Tax</b></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + taxCalc +'</td></tr>';
			pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Total</b></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small">' + total +'</td></tr>';
			pdfxml += '</table></td></tr></table></body></pdf>';		

			nlapiLogExecution('DEBUG','This is the XML', pdfxml);

			try
			{
				var file = nlapiXMLToPDF(pdfxml);
				response.setContentType('PDF','invoiceSimCards.pdf');
				response.write(file.getValue());
			}
			catch(e)
			{
				var errormsg = "<html><body><p>Error: " + e.message +"</p></body></html>";
				response.write(errormsg);
			}//try
		} //if
		else
		{
			var errormsg = "<html><body><p>Error: You must save the Expense Claim before printing it. ExpenseRecordID = " + invoiceID+ ", ExpenseItems = </p></body></html>";
			response.write(errormsg);
		}		
		return true;
	}
	catch(e)
	{
		errorHandler('printSimCards ', e);
	}
}





/**************************************************************
 * getInvoiceInformation - getting the Invoice line fields
 * 
 * @param lineNumber - the line number
 * 
 * 1.1.0 - adding getInvoiceLineFields(lineNumber),getInvoiceFields(), getCompanyInformation() functions - AS
 *							
 *************************************************************/
function getInvoiceLineFields(lineNumber)
{
	
	try
	{
		itemName = nlapiEscapeXML(invoiceRecord.getLineItemText('item', 'item', lineNumber));
		itemQuantity = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'quantity', lineNumber));
		itemDescription = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'description', lineNumber));
		
		if(itemDescription == null)
		{
			itemDescription = '';
		}
		
		itemRate = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'rate', lineNumber));
		
		if(itemRate == null)
		{
			itemRate = '';
		}
		
		itemAmount = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'amount', lineNumber));
		itemTaxRate = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'taxrate1', lineNumber));
		itemTaxAmt = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'tax1amt', lineNumber));
		itemGrossAmt = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'grossamt', lineNumber));
		itemSimCards = nlapiEscapeXML(invoiceRecord.getLineItemValue('item', 'custcol_simnumbers', lineNumber));
	
		//calculating the sub total 
		subTotal = parseFloat(subTotal) + parseFloat(itemAmount);
		subTotal = parseFloat(subTotal).toFixed(2);					//passing the subtotal to float value to avoid errors
		
		//calculating the total tax
		totalTax = parseFloat(totalTax) + parseFloat(itemTaxAmt);	 
		totalTax = parseFloat(totalTax).toFixed(2);
		
		
	}
	
	catch(e)
	{
		errorHandler('getInvoiceLineFields ', e);
	}

}



/**
 * for Each Sim Update Sim Card Records
 *
 *	version 1.1.2 - splitting the sim numbers - AS
 */

function forEachSimRecord()
{
	var simArray = new Array();

	
	try
	{
		
		//number format : simNumber simNumber simNumber .. the numbers are seperated by new line eventhough it shows as ''.
		//hence splitting the numbers by '/n' to get the numbers separately
		simArray = itemSimCards.split('\n');
		
		for(var i = 0; i< simArray.length; i++)
		{
			//seetting the nnumbers separately in the table line with a break tab
			setSimNumber(simArray[i]);
			
		}
	
	}
	catch(e)
	{
		errorHandler("forEachSimRecord", e);		
	}

}


/*setting each sim number in a new line
 * 
 * version 1.1.2 - splitting the sim numbers - AS
 * 
 * @param simNumber - each sim Number in each line
 */
function setSimNumber(simNumber)
{
	//cannot put '+' sign at the end of the line, hence using concat (format is : + sim number + '<br/>' + sim number + <br/> )
	pdfxml = pdfxml.concat(simNumber + '<br/>');


}



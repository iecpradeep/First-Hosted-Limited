/**********************************************************************************************************
 * Name:        invoicePrint.js
 * Script Type: Suitelet
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 4 Jan 2013 - first release - LE
 *  
 * Author:      FHL
 * Purpose:     Prints sims in PDF
 * 
 * Script:      customscript_simprint
 * Deploy:      customdeploy_simprint  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var salesOrderNumber = '';
var pdfxml = '';
var invoiceNum = null;

function invoicePrint(request, response)
{
	initialise();			// init
	loadSalesOrder();		// load the sales order information
	printHeader();			// head
	printSims();			// body
	printFooter();			// footer
	renderPDF('sims.pdf');	// display PDF
}

/**
 * 
 * initialise
 * 
 */

function initialise()
{
	try
	{
		nlapiLogExecution('DEBUG', 'initialise');
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

/**
 * 
 * load sales order
 * 
 */
function loadSalesOrder()
{
	var invoiceID = null;
	var invoiceType = null;
	var thisRecord = null;
	
	
	try
	{
		//searching record info
		invoiceID = nlapiGetRecordId();
		invoiceType = nlapiGetRecordType();

		
		nlapiLogExecution('DEBUG', 'loadSalesOrder INVOICE NO: ', invoiceID);
		
		//loading record
//		thisRecord = nlapiLoadRecord(invoiceType, invoiceID);

		//searching record field values
	//	invoiceNum = thisRecord.getFieldValue('tranid');

		//nlapiLogExecution('ERROR', 'loadSalesOrder', invoiceNum);

	}
	catch(e)
	{
		errorHandler('loadSalesOrder', e);
	}
}


/**
 * 
 * Print head section
 * 
 */
function printHeader()
{
	try
	{

		pdfxml = '<?xml version="1.0"?>';
		pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		pdfxml += '<pdf>';
		
		pdfxml += '<head><meta name="title" value="Despatch Note" />\n<style type="text/css">.style1{height: 24px;}.style2{height: 87px;}.style3{height: 45px;} .style7{height: 24px;width: 129px;}</style></head>';
		
		pdfxml += '<body background-color="white" font-size="12">';

		pdfxml += '<table style="width:100%;">';

		pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Date</strong></td>';
		pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
		pdfxml += '#salesordernumber#';
		pdfxml += '</td></tr>';

		pdfxml += '</table>';


		// replacers

		pdfxml = pdfxml.replace('#salesordernumber#', salesOrderNumber);
	}
	catch(e)
	{
		errorHandler('printHeader', e);
	}
}


/**
 * 
 * Prints sims on a separate page
 * 
 */
function printSims()
{
	try
	{

	}
	catch(e)
	{
		errorHandler('printSims', e);
	}
}

/**
 * 
 * Prints footer on page
 * 
 */
function printFooter()
{
	try
	{

		pdfxml += '</body></pdf>';
	}
	catch(e)
	{
		errorHandler('printFooter', e);
	}
}

/**
 * 
 * render PDF image
 * 
 */
function renderPDF(fileName)
{
	var file = null;
	var errormsg = '';

	try
	{
		file = nlapiXMLToPDF(pdfxml);

		response.setContentType('PDF',fileName);
		response.write(file.getValue());
	}
	catch(e)
	{
		errormsg = "<html><body><p>Error: " + e.message +"</p></body></html>";
		errorHandler('printFooter', e);
		response.write(errormsg);
	}
	
}




/*
function labelPrinter(request, response)
{   

	var DeliverTo = '';
	// get item fulfillment id from URL parameter
	var ifRecordId = request.getParameter('custparam_cid');

	// if a parameter has been passed
	if (ifRecordId)
	{

		// load item fulfillment record
		var ifRecord = nlapiLoadRecord('itemfulfillment',ifRecordId);

		// get required header fields from fulfillment record and escape into xml
		var attn = nlapiEscapeXML(ifRecord.getFieldValue('shipattention'));
		var addressee = nlapiEscapeXML(ifRecord.getFieldValue('shipcompany'));
		var addr1 = nlapiEscapeXML(ifRecord.getFieldValue('shipaddr1'));
		var addr2 = nlapiEscapeXML(ifRecord.getFieldValue('shipaddr2'));
		var city = nlapiEscapeXML(ifRecord.getFieldValue('shipcity'));
		var country = nlapiEscapeXML(ifRecord.getFieldValue('shipcountry'));
		var specialinstructions = nlapiEscapeXML(ifRecord.getFieldValue('custbody_specialinstructions'));
				var ifnumber = ifRecord.getFieldValue('tranid');
		var SORecordID = ifRecord.getFieldValue('createdfrom');
		var SORecord  =  nlapiLoadRecord('salesorder', SORecordID);
		var SONumber = SORecord.getFieldValue('tranid');
		var YourOrderRef = nlapiEscapeXML(ifRecord.getFieldValue('custbody_yourref'));
		var NumOfItems = ifRecord.getLineItemCount('item');



		var pdfxml= '<?xml version="1.0"?>';
		pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		pdfxml += '<pdf>';
		pdfxml += '<head><meta name="title" value="Despatch Note" />\n<style type="text/css">.style1{height: 24px;}.style2{height: 87px;}.style3{height: 45px;} .style7{height: 24px;width: 129px;}</style></head>';
		pdfxml += '<body background-color="white" font-size="12">';

		for(var i=1;i <= NumOfItems; i++)
		{
			//ifRecord.selectLineItem('item',i);
			var ItemDescription = nlapiEscapeXML(ifRecord.getLineItemValue('item','itemdescription',i));
			var ItemQty = ifRecord.getLineItemValue('item','quantity',i);
			var TheDate = new Date();
			var NumberOfPallets = parseInt(ifRecord.getLineItemValue('item', 'custcol_numberofpallets', i));
			var TheType =  nlapiEscapeXML(ifRecord.getLineItemText('item','item', i));
			var YourRef = nlapiEscapeXML(ifRecord.getLineItemValue('item','custcol_custpartref', i));

			if(isNaN(NumberOfPallets)||NumberOfPallets == 0)
			{
				var errormsg = "<html><body><p>Error: You must ensure the Number of Pallets field on each line is filled out with a valid positive number before continuing.</p></body></html>";
				response.write(errormsg);
				return true;
			}

			for(var j = 1; j <= NumberOfPallets; j++)
			{

				pdfxml += '<table style="width:100%;">';
				pdfxml += '<tr><td><img display="inline" src="http://shopping.netsuite.com/core/media/media.nl?id=2&amp;c=655257&amp;h=b0c0bf076b9cc39fd089" dpi="190" /></td>';
				pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;"><br />Angel Business Centre<br />12 Westport Road, Burslem, Staffordshire<br />ST6 4AW, United Kingdom<br />Tel: +44 (0) 8454 810208 Fax: +44 (0) 8454 810209<br /><u>www.alliedinsulators.com</u> <u>sales@alliedinsulators.com</u></td></tr></table>';

				pdfxml += '<p style="font-family: Arial, Helvetica, sans-serif; font-size: 22pt; font-weight: bold; text-decoration: underline">PALLET NOTE</p>';
				pdfxml += '<table style="width: 100%;"><tbody><tr>';
				pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Despatch Note Number</strong></td>';
		        pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: x-large">';
		        pdfxml += '#despatchnotenumber#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Date</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
	            pdfxml += '#date#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td class="style2" style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Deliver to</strong></td>';
				pdfxml += '<td class="style2" style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#deliverto#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Special Instructions</strong></td>';
				pdfxml += '<td class="style2" style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#specialinstructions#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>OUR ORDER REF</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#ourorderref#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>YOUR ORDER REF</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#yourorderref#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Item</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#type#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Customer Ref</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#yourref#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td class="style1" style="font-family: Arial, Helvetica, sans-serif; font-size: large" width="50%"><strong>Description</strong></td>';
				pdfxml += '<td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-size: large">';
				pdfxml += '#itemdescription#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif;  font-size: large; font-weight: bold;" width="60%">QUANTITY THIS DESPATCH</td>';
				pdfxml += '<td style="border: medium solid #000000; font-weight: bold; font-family: Arial, Helvetica, sans-serif; font-size: x-large">';
				pdfxml += '#quantitythisdespatch#';
				pdfxml += '</td></tr>';

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: large; font-weight: bold;" width="60%" class="style1">NUMBER OF PALLETS THIS ITEM</td><td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-weight:bold; font-size: x-large" class="style3">';
				pdfxml += '#numberofpalletsthisitem#';
				pdfxml += '</td></tr><tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: x-large; font-weight: bold;" width="50%" class="style2">QUANTITY THIS PALLET</td><td style="border: medium solid #000000; font-family: Arial, Helvetica, sans-serif; font-weight:bold; font-size: x-large" class="style2">&nbsp;</td></tr></tbody></table>';

				pdfxml = pdfxml.replace('#despatchnotenumber#', String(ifnumber));
				pdfxml = pdfxml.replace('#date#', nlapiDateToString(TheDate));

				var DeliverToAddress = '';	//Build the Deliver To address so we don't get a list of nulls
				if(attn)
				{
					DeliverToAddress += attn + '<br />';
				}
				if(addressee)
				{
					DeliverToAddress += addressee + '<br />';
				}
				if(addr1)
				{
					DeliverToAddress += addr1 + '<br />';
				}
				if(addr2)
				{
					DeliverToAddress += addr2 + '<br />';
				}
				if(city)
				{
					DeliverToAddress += city + ', ';
				}
				if(country)
				{
					DeliverToAddress += country + '<br />';
				}

				if(DeliverToAddress)
				{
					//Deliver To Address is available to write.
				}
				else
				{
					DeliverToAddress = '&nbsp;';
				}
				pdfxml = pdfxml.replace('#deliverto#', DeliverToAddress);

				if(specialinstructions == null)
				{
					specialinstructions = '';
				}
				pdfxml = pdfxml.replace('#specialinstructions#', String(specialinstructions));			



				pdfxml = pdfxml.replace('#ourorderref#', SONumber);

				if(TheType == null)
				{
					TheType = '&nbsp;';
				}

				pdfxml = pdfxml.replace('#type#', TheType);

				if(YourOrderRef == null)
				{
					YourOrderRef = '&nbsp;';
				}

				pdfxml = pdfxml.replace('#yourorderref#', YourOrderRef);
				pdfxml = pdfxml.replace('#itemdescription#', String(ItemDescription));
				pdfxml = pdfxml.replace('#quantitythisdespatch#', String(ItemQty));
				pdfxml = pdfxml.replace('#numberofpalletsthisitem#', String(NumberOfPallets));
				if(YourRef == null)
				{
					YourRef = '&nbsp;';
				}
				pdfxml = pdfxml.replace('#yourref#', YourRef);

				pdfxml += '<br /><br /><hr width="95%"/><table style="width:100%;">';
				pdfxml += '<tr><td align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: small; text-align: center;"><br /><b>Allied Insulators Limited</b><br />';
				pdfxml += 'Registered Office: Mitten Clark Ltd, Festival Way, Festival Park, Stoke-on-Trent ST1 5TQ<br />Registered In England: Registered No. 072 84446. VAT No. GB 994 285761</td>';
				pdfxml += '<td class="style7"><img display="inline" dpi="300" src="http://shopping.netsuite.com/core/media/media.nl?id=4&amp;c=655257&amp;h=e0014554c420d1209bd5" />';
				pdfxml += '<img display="inline" dpi="300" src="http://shopping.netsuite.com/core/media/media.nl?id=3&amp;c=655257&amp;h=1fb602121e027ed52b1b" /></td></tr></table>';

				if(i ==NumOfItems && j == NumberOfPallets)
				{
					//this means it's the last page....
					nlapiLogExecution('DEBUG', 'Last Page?','i ==NumOfItems && j = NumberOfPallets');
				}
				else
				{

					pdfxml += '<pbr />';
				}


			}	// for loop - j


		} // for loop - i

		pdfxml += '</body></pdf>';
		try
		{
					var file = nlapiXMLToPDF(pdfxml);
		response.setContentType('PDF','PalletNote.pdf');
		response.write(file.getValue());
		}
catch(e)
{
			var errormsg = "<html><body><p>Error: " + e.message +"</p></body></html>";
		response.write(errormsg);
}
	} //if
	else
	{
		var errormsg = "<html><body><p>Error: You must save the Item Fulfilment before printing the Pallet Notes. ifRecordId = " + ifRecordId + ", NumOfItems = " + NumOfItems +"</p></body></html>";
		response.write(errormsg);
	}		


} //function
 */



/**
 * JM reference code
 */


/**
 * check each order line for sims and update customrecord_sim_card where found
 *
 */

function checkEachOrderLineForSims()
{

	var lines = null;
	var simNumbers = '';

	try
	{
		// [TODO] edit left in for speed of dev - remove at end
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			// Get the number of line items before submit
			lines = currentRecord.getLineItemCount('item');
			for ( var i = 1 ; i<= lines ; i++ )
			{
				simNumbers = nlapiGetLineItemValue('item', 'custcol_simnumbers', i);
				if(simNumbers)
				{
					forEachSimUpdateSimCardRecords(simNumbers);
				}
			}
		}

	}
	catch(e)
	{
		errorHandler("checkEachOrderLineForSims", e);		
	}


}



/**
 * for Each Sim Update Sim Card Records
 *
 */

function forEachSimUpdateSimCardRecords(simNumbersString)
{
	var simArray = new Array();
	var splitChar = '';

	try
	{

		splitChar = String.fromCharCode(5);

		simArray = simNumbersString.split(splitChar);

		for(var i=0; i<=simArray.length; i++)
		{
			//updateSimCard(simArray[i]);
		}

	}
	catch(e)
	{
		errorHandler("forEachSimUpdateSimCardRecords", e);		
	}

}



/**
 * loadSalesOrder
 *
 */
function loadSalesOrder2(type)
{

	try
	{
		// [TODO] edit left in for speed of dev - remove at end
		if((type == 'create') || (type == 'edit')) // && (executionEnv=='userevent'))
		{
			salesOrderIntID = nlapiGetRecordId();
			currentRecord = nlapiLoadRecord('salesorder', salesOrderIntID);
			partnerIntID = currentRecord.getFieldValue('partner');
			custIntID = currentRecord.getFieldValue('entity');
		}

	}
	catch(e)
	{
		errorHandler("loadSalesOrder", e);		
	}
}
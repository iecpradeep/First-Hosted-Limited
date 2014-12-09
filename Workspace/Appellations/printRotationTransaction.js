/******************************************
 * Printer Suitelet
 * Version 1.0.0
 * 21/11/11
 */
// CSS section and the header load function
var CSS_DEFINITION = '<style type="text/css">';
CSS_DEFINITION += 'h1 { font-family: Helvetica;} ';
CSS_DEFINITION += 'h3 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h4 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'h5 { font-family: Helvetica; text-align: center;} ';
CSS_DEFINITION += 'table { font-family: Helvetica; text-align: left; font-size: 11px; } ';
CSS_DEFINITION += 'table.headerinfo { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold; } ';
CSS_DEFINITION += 'table.matrix { margin: 0 0 15px 0; } ';
CSS_DEFINITION += 'table.matrix td { padding: 4px; } ';
CSS_DEFINITION += 'table.matrixheader { margin: 0 0 15px 0; } ';
//CSS_DEFINITION += 'td { border: 1; } ';
CSS_DEFINITION += 'td.allborder { border: 1px solid #000000; } ';
CSS_DEFINITION += 'td.bottomborder { border-bottom: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportborder { height:5mm; border-left: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportheader {  height:5mm; font-weight:bold; border-left: 1px solid #000000; border-top: 1px solid #000000; border-bottom: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportend { border-left: 1px solid #000000; border-right: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportheaderend { font-weight:bold; border-left: 1px solid #000000; border-top: 1px solid #000000; border-bottom: 1px solid #000000; border-right: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportfooter { border-left: 1px solid #000000; border-bottom: 1px solid #000000; } ';
CSS_DEFINITION += 'td.reportfooterend { border-left: 1px solid #000000; border-right: 1px solid #000000; border-bottom: 1px solid #000000; } ';
CSS_DEFINITION += 'p { font-family: Helvetica; text-align: left; font-size: 10px;} ';
CSS_DEFINITION += 'p.header { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold;} ';
CSS_DEFINITION += 'p.detail { font-family: Helvetica; text-align: left; font-size: 9px;} ';
CSS_DEFINITION += '.standard { font-family: Helvetica;} ';
CSS_DEFINITION += '.emphasised { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.rightalign { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.sizematrix { font-family: Helvetica; width:200px;} ';
CSS_DEFINITION += '.detailed { font-family: Helvetica; font-size:8px; text-align: center; } ';
CSS_DEFINITION += '</style>';

var fontStyle1 = ' class="standard" ';
var fontStyle2 = ' class="emphasised" ';
var fontStyle3 = ' class="rightalign" ';
var fontStyle4 = ' class="sizematrix" ';
var fontStyle5 = ' class="detailed" ';

function getHeadNode(){ // Supply the HEAD definition
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

function printRotationTransaction(request, response){

    //Accept into an array either a single transaction id or a comma list of ids (a,b,c ...)
    var soRecords = new Array;
    if (request.getParameter('custparam_tranids') != null && request.getParameter('custparam_tranids') != '') {
        var soRecords = request.getParameter('custparam_tranids').split(',');
    }
    else {
        soRecords[0] = request.getParameter('custparam_tranid');
    }
    
    var outputType = 'pdf'; //Can replace default for development & testing e.g. html to the browser
    if (request.getParameter('custparam_outputtype') != null && request.getParameter('custparam_outputtype') != '') 
        outputType = request.getParameter('custparam_outputtype');
    
    var tranType = 'invoice'; // Can replace e.g. with 'salesorder' will generate different transaction report as needed
    if (request.getParameter('custparam_trantype') != null && request.getParameter('custparam_trantype') != '') 
        tranType = request.getParameter('custparam_trantype');
    
    var pageSize = 'A4';
    var linesPerPage = 28; // The number of detail lines per page - change as needed
    var pageCounter = 0; // Used to index the page array
    var printPageshtml = new Array; // Store pages html content in array for layout after compiling
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
        var soRecordId = soRecords[soRec];
        
        if (soRecordId) {
            if (soRec == 0) { // Output the document and body preamble once at the start ...
                var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
                var pdfxml = '<' + outputType + '>';
                pdfxml += getHeadNode();
                pdfxml += '<body size=\"' + pageSize + '\" margin="0pt" padding="0pt" border="0pt" font-family="Helvetica">';
            }
            
            // Load the record & item lines ...
            var soRecord = nlapiLoadRecord(tranType, soRecordId, {
                recordmode: 'dynamic'
            });
            var tranid = soRecord.getFieldValue('tranid');
			
            var acctRef = soRecord.getFieldValue('custbody_customeraccountno');
            if (acctRef == null) 
                acctRef = '';
            var soDeliverDate = soRecord.getFieldValue('shipdate');
            if (soDeliverDate == null) 
                soDeliverDate = '';
            
            var lineCount = soRecord.getLineItemCount('item');
            
            var matrixArray = new Array(lineCount); //This stores the item column values for sorting / merging etc.
            for (m = 0; m < lineCount; m++) 
                matrixArray[m] = new Array(13);
			//Print columns
            var colWine = 0;
            var colGrower = 1;
            var colVintage = 2;
            var colQty = 3;
            var colUnits = 4;
            var colUnitPrice = 5;
            var colSubTotal = 6;
            var colVAT = 7;
			//Rotation sort and merge columns (hidden)
            var colItemid = 8;
            var colRotation = 9;
            var colRotationMerge = 10; 
            var colDutyStatus = 11; 
            var colUnitsID = 12; 
			
			var mergeRotations = new Array();			
			mergeRotations = getItemDuplicatesforTransaction(tranid, tranType); //The potential ones to merge are identified
			
            var grandtotal = 0;
            var grandtotalVAT = 0;
            var qtytotal = 0;
            
            var itemArray = new Array(); //Store line items in an array, for pagination if > page and consolidation
            for (var itemload = 1; itemload <= lineCount; itemload++) {
				matrixArray[itemload - 1][colItemid] = soRecord.getLineItemValue('item', 'item', itemload);
        		matrixArray[itemload - 1][colWine] = soRecord.getLineItemValue('item', 'custcol_wineprintcolumn', itemload);
        		matrixArray[itemload - 1][colGrower] = soRecord.getLineItemValue('item', 'custcol_growerprintcolumn', itemload);				
        		matrixArray[itemload - 1][colVintage] = soRecord.getLineItemText('item', 'custcol_tran_vintage', itemload);				
        		matrixArray[itemload - 1][colQty] = soRecord.getLineItemValue('item', 'quantity', itemload);
        		matrixArray[itemload - 1][colUnits] = soRecord.getLineItemText('item', 'units', itemload);
        		matrixArray[itemload - 1][colUnitsID] = soRecord.getLineItemValue('item', 'units', itemload);
        		matrixArray[itemload - 1][colUnitPrice] = soRecord.getLineItemValue('item', 'rate', itemload);
        		matrixArray[itemload - 1][colSubTotal] = soRecord.getLineItemValue('item', 'amount', itemload);
        		matrixArray[itemload - 1][colVAT] = (parseFloat(soRecord.getLineItemValue('item', 'taxrate1', itemload).replace('%','')) * matrixArray[itemload - 1][colSubTotal] / 100).toFixed(2);

        		matrixArray[itemload - 1][colDutyStatus] = soRecord.getLineItemValue('item', 'custcol_duty', itemload);
        		matrixArray[itemload - 1][colRotation] = soRecord.getLineItemValue('item', 'custcol_tran_rotation', itemload);
        		matrixArray[itemload - 1][colRotationMerge] = 0; // Default - no merge required
                for (var m = 0; m < mergeRotations.length; m++) {
					if (mergeRotations[m] == matrixArray[itemload - 1][colItemid]) matrixArray[itemload - 1][colRotationMerge] = m+1;
                }

				qtytotal = parseInt(matrixArray[itemload - 1][colQty]) + qtytotal;
				grandtotal = parseFloat(matrixArray[itemload - 1][colSubTotal]) + grandtotal;
				grandtotalVAT = parseFloat(matrixArray[itemload - 1][colVAT]) + grandtotalVAT;
                //var currentItem = nlapiLoadRecord('inventoryitem', currentItemId);
                //itemArray.push(currentItem); // Put items in array for use in 'for' loop below
            }
			
			//Now sort and detect lines we can merge
            matrixArray.sort(function(a, b){
                return b[colRotationMerge] - a[colRotationMerge]
            }); //Now sorted by any repeating rotation ids
            
            var prevRow = new Array();
            for (var tempmerge = 0; tempmerge < matrixArray[0].length; tempmerge++) 
                 prevRow[tempmerge] = null;
                 //prevRow[tempmerge] = matrixArray[0][tempmerge];
     
			var lineOutArray = new Array(); // The final output array          
			var currentLine = 0;
            for (var itemmerge = 0; itemmerge < matrixArray.length; itemmerge++) {
				//' ...You'd only roll it together if the product code, pack size, duty status and selling price are the same.'
                // Check for a matched row, add to previous if it is a match ...
                if (prevRow[colItemid] == matrixArray[itemmerge][colItemid] && prevRow[colUnitsID] == matrixArray[itemmerge][colUnitsID] && prevRow[colVintage] == matrixArray[itemmerge][colVintage] && prevRow[colUnitPrice] == matrixArray[itemmerge][colUnitPrice]) {
                //if (1 == 2){ // Debug - never executes
					lineOutArray[currentLine - 1][colQty] = parseInt(lineOutArray[currentLine - 1][colQty]) + parseInt(matrixArray[itemmerge][colQty]);
                    lineOutArray[currentLine - 1][colSubTotal] = parseFloat(lineOutArray[currentLine - 1][colSubTotal]) + parseFloat(matrixArray[itemmerge][colSubTotal]);
                    lineOutArray[currentLine - 1][colVAT] = parseFloat(lineOutArray[currentLine - 1][colVAT]) + parseFloat(matrixArray[itemmerge][colVAT]);
                }
                else { //Not to merge so advance to next
                    lineOutArray[currentLine] = matrixArray[itemmerge];
                    currentLine++;
                }
                // Make current row previous
                for (var tempmerge = 0; tempmerge < matrixArray[itemmerge].length; tempmerge++) 
                    prevRow[tempmerge] = matrixArray[itemmerge][tempmerge];
            }
            lineOutArray.sort(function(a, b){
                return a[colItemid] - b[colItemid]
            }); // Sort by itemid

			lineCount = lineOutArray.length;
            var tranPages = parseInt(lineCount / linesPerPage); // Whole pages
            if (lineCount % linesPerPage > 0) // Is running over to the next page
                tranPages++;
            
            for (var page = 1; page <= tranPages; page++) {
				var lineFrom = ((page - 1) * linesPerPage) + 1;
				var lineTo = lineFrom + linesPerPage - 1;
				if (lineTo > lineCount) 
					lineTo = lineCount; // At the last page
				var pagehtml = '';
				//--------- HTML output start
				pagehtml = createReportHeader(soRecordId, tranType); //Header
				pagehtml += '<table class="matrix" width="100%">'; // Columns / main body
				pagehtml += '<tr><td class="noborder"><b>Account Ref.</b></td><td colspan="2" class="noborder">' + acctRef + '</td><td colspan="2" class="noborder"><b>Estimated Delivery</b></td><td colspan="2" class="noborder">' + soDeliverDate + '</td><td></td></tr>';
				pagehtml += '<tr><td colspan="8"></td></tr>';
				pagehtml += '<tr><td class="reportheader">Wine</td><td class="reportheader">Grower</td><td class="reportheader" align="center">Vintage</td><td class="reportheader" align="right">Qty</td><td class="reportheader">Units</td><td class="reportheader" align="right">Unit Price</td><td class="reportheader" align="right">Sub Total</td><td class="reportheaderend" align="right">VAT</td></tr>';
				for (var i = lineFrom; i <= lineTo; i++) {
					//Debug version of output -                     pagehtml += '<tr><td class="reportborder">' + nlapiEscapeXML(lineOutArray[i - 1][colWine]) + '</td><td class="reportborder">' + nlapiEscapeXML(lineOutArray[i - 1][colGrower]) + '</td><td class="reportborder" align="center">' + lineOutArray[i - 1][colVintage] + ' (' + lineOutArray[i - 1][colRotationMerge] + ')</td><td class="reportborder" align="right">' + lineOutArray[i - 1][colQty] + '</td><td class="reportborder">' + lineOutArray[i - 1][colUnits] + '</td><td class="reportborder" align="right">' + (lineOutArray[i - 1][colUnitPrice]*1.00).toFixed(2) + '</td><td class="reportborder" align="right">' + (lineOutArray[i - 1][colSubTotal]*1.00).toFixed(2) + '</td><td class="reportend" align="right">' + (lineOutArray[i - 1][colVAT]*1.00).toFixed(2) + '</td></tr>';
					pagehtml += '<tr><td class="reportborder">' + nlapiEscapeXML(lineOutArray[i - 1][colWine]) + '</td><td class="reportborder">' + nlapiEscapeXML(lineOutArray[i - 1][colGrower]) + '</td><td class="reportborder" align="center">' + lineOutArray[i - 1][colVintage] + '</td><td class="reportborder" align="right">' + lineOutArray[i - 1][colQty] + '</td><td class="reportborder">' + lineOutArray[i - 1][colUnits] + '</td><td class="reportborder" align="right">' + (lineOutArray[i - 1][colUnitPrice] * 1.00).toFixed(2) + '</td><td class="reportborder" align="right">' + (lineOutArray[i - 1][colSubTotal] * 1.00).toFixed(2) + '</td><td class="reportend" align="right">' + (lineOutArray[i - 1][colVAT] * 1.00).toFixed(2) + '</td></tr>';
				}
				for (var f = 1; f < linesPerPage - (lineTo - lineFrom); f++) {
					pagehtml += '<tr>';
					for (var fp = 1; fp <= 7; fp++) 
						pagehtml += '<td class="reportborder"></td>';
					pagehtml += '<td class="reportend"></td></tr>';
				}
				pagehtml += '<tr>';
				for (var p = 1; p <= 7; p++) 
					pagehtml += '<td class="reportfooter"></td>';
				pagehtml += '<td class="reportfooterend"></td></tr>';
				pagehtml += '<tr><td colspan="8"></td></tr>';
				if (page == tranPages) {
					pagehtml += '<tr><td colspan="5"></td><td class="reportheader" align="center">Total Net + VAT</td><td align="right" class="reportheader">' + grandtotal.toFixed(2) + '</td><td align="right" class="reportheaderend">' + grandtotalVAT.toFixed(2) + '</td></tr>';
					pagehtml += '<tr><td colspan="5"></td><td class="reportheader" align="center">Total Gross (GBP)</td><td colspan="2" align="right" class="reportheaderend">' + (grandtotal + grandtotalVAT).toFixed(2) + '</td></tr>';
				}
                pagehtml += '</table>';
                pagehtml += createReportFooter(soRecordId, tranType, grandtotal.toFixed(2), page, tranPages); //Footer
                //--------- HTML output end	
                printPageshtml[pageCounter] = pagehtml;
                pageCounter++;
            }
        }
    }
    
    // Output the html array of pages to pdf document with pagination as needed   
    var labelsPerPageAcross = 1;
    var labelsPerPageDown = 1;
    var labelsPerPage = parseInt(labelsPerPageAcross * labelsPerPageDown);
    var pageWidth = 197;
    var pageHeight = 290;
    var pageMargin = 5; // mm
    var labeltdwidth = ((pageWidth / labelsPerPageAcross) - pageMargin).toFixed(0);
    var labeltdheight = ((pageHeight / labelsPerPageDown) - pageMargin).toFixed(0);
    var labelAlignment = 'vertical-align:top;margin-left:5mm;margin-top:5mm;';
    
    for (var label = 1; label <= printPageshtml.length; label++) {
        var pageIndex = label % labelsPerPage; // Modulo gives if first (1) or last (0) on page
        if (pageIndex == 1 || label == 1 || labelsPerPage == 1) //Build start table structure 
            //pdfxml += '<table vertical-align="middle" cellpadding="2mm"><tr>';
            pdfxml += '<table style="' + labelAlignment + '"><tr>';
        
        pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;">' + printPageshtml[label - 1] + '</td>';
        
        if (pageIndex == 0 || label == printPageshtml.length || labelsPerPage == 1) { //Build end table structure
            for (var rowPad = (labelsPerPage - pageIndex); rowPad < labelsPerPage; rowPad++) 
                pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" height="' + labeltdheight + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;vertical-align:middle;"></td>';
            pdfxml += '</tr></table>';
        }
        
        if (label > 1 && pageIndex == 0 && label != printPageshtml.length) // Throw a new page if needed
            pdfxml += '<pbr background-color="white" />';
    }
    
    pdfxml += '</body></' + outputType + '>'; // Close the document and render to chosen output
    if (outputType == 'html') {
        response.write(pdfxml);
    }
    else {
        var file = nlapiXMLToPDF(pdfxml);
        response.setContentType('PDF', 'printtransaction.pdf');
        response.write(file.getValue());
    }
    
}

function createReportHeader(recordID, report_type){
    var header = '';
    
    var soHRecord = nlapiLoadRecord(report_type, recordID);
    if (soHRecord) {
        var soHRef = soHRecord.getFieldValue('tranid');
        var cusRecord = soHRecord.getFieldValue('entity');
        var cusName = soHRecord.getFieldText('entity');
        var invNo = soHRecord.getFieldText('createdfrom');
        if (report_type == 'pickingnote') {
            soHRecord2 = nlapiLoadRecord('salesorder', soHRecord.getFieldValue('createdfrom'));
        }
        var poNumber = soHRecord.getFieldValue('otherrefnum');
        if (poNumber == null) 
            poNumber = '';
        
        var currencyText = soHRecord.getFieldValue('currencyname');
        if (currencyText == null) 
            currencyText = '';
        
        var dutyStatus = soHRecord.getFieldText('custbody_saletype');
        if (dutyStatus == null) 
            dutyStatus = '';
        
        var soDate = soHRecord.getFieldValue('trandate');
        if (soDate == null) 
            soDate = '';
        var soDeliverDate = soHRecord.getFieldValue('shipdate');
        if (soDeliverDate == null) 
            soDeliverDate = '';
        var soLateDate = soHRecord.getFieldValue('custbody_latedate');
        if (soLateDate == null) 
            soLateDate = '';
        var soPayDueDate = soHRecord.getFieldValue('duedate');
        if (soPayDueDate == null) 
            soPayDueDate = '';
        
        //Invoice Address - Start
        var invAddrHeader = 'Invoice Address';
        var invAddr = soHRecord.getFieldValue('billaddress');
        if (report_type == 'pickingnote') 
            invAddr = soHRecord2.getFieldValue('billaddress');
        if (invAddr == null) {
            invAddr = '';
            invAddrHeader = '';
        }
        var invCountry = soHRecord.getFieldValue('billcountry');
        if (report_type == 'pickingnote') 
            invCountry = soHRecord2.getFieldValue('billcountry');
        if (invCountry == 'GB' || invCountry == null) 
            invCountry = '';
        var invPhone = soHRecord.getFieldValue('billphone');
        if (report_type == 'PIN') 
            invPhone = soHRecord2.getFieldValue('billphone');
        if (invPhone == null) 
            invPhone = '';
        
        var invoiceAddress = '<table width="100%">';
        invoiceAddress += '<tr><td><b>Invoice Address:</b></td></tr>';
        invoiceAddress += '<tr><td>' + invAddr.replace(/\n/g, '<br />') + '</td></tr>';
        invoiceAddress += '<tr><td>' + invCountry + '</td></tr>';
        invoiceAddress += '</table>';
        //Invoice Address - End
        
        //Shipping / Delivery Address - Start
        var shipTitle = 'Delivery Address';
        var shipAddr = soHRecord.getFieldValue('shipaddress');
        if (shipAddr == null) 
            shipAddr = '';
        
        var shipCountry = soHRecord.getFieldValue('shipcountry');
        if (shipCountry == 'GB' || shipCountry == null) 
            shipCountry = '';
        var shipPhone = soHRecord.getFieldValue('shipphone');
        if (shipPhone == null) 
            shipPhone = '';
        
        var bondWarehouse = soHRecord.getFieldText('custbody_bondwarehouse');
        if (bondWarehouse == null) 
            bondWarehouse = '';
        var bondAcctno = soHRecord.getFieldValue('custbody_bondaccnumber');
        if (bondAcctno == null) 
            bondAcctno = '';
        
        var shipAddress = '<table width="100%">';
        shipAddress += '<tr><td><b>Deliver To:</b></td></tr>';
        shipAddress += '<tr><td>' + bondWarehouse + '</td></tr>';
        shipAddress += '<tr><td>' + bondAcctno + '</td></tr>';
        shipAddress += '<tr><td>' + shipAddr.replace(/\n/g, '<br />') + '</td></tr>';
        shipAddress += '<tr><td>' + shipCountry + '</td></tr>';
        shipAddress += '</table>';
        //Shipping / Delivery Address - End
        
		//Main details panel -  start
        var reportTitle = '';
        var logoURL = 'https://system.netsuite.com/core/media/media.nl?id=762&c=1336541&h=24ef45962620b6035454';
        //var headerPanel = '<table><tr><td><b>Customer Account :</b></td><td><b>' + cusName + '</b></td></tr>';
        var headerPanel = '<table>';
        switch (report_type) {
            case 'invoice':
                reportTitle = 'Invoice';
                headerPanel += '<tr><td><b>Invoice No.:</b></td><td>' + soHRef + '</td></tr><tr><td><b>Date</b></td><td>' + soDate + '</td></tr><tr><td><b>Order Ref.</b></td><td>' + nlapiEscapeXML(poNumber) + '</td></tr><tr><td><b>Duty Status</b></td><td>' + dutyStatus + '</td></tr><tr><td><b>Currency</b></td><td>' + currencyText + '</td></tr><tr><td><b>Payment Due Date:</b></td><td>' + soPayDueDate + '</td></tr>';
                logoURL = 'https://system.netsuite.com/core/media/media.nl?id=996&c=1336541&h=7eb2da1923cd0dbca491';
                break;
            case 'salesorder':
				//Custom code here ...
                break;
            case 'creditnote':
				//Custom code here ...
                break;
            case 'pickingnote':
				//Custom code here ...
                break;
        }
        headerPanel += '</table>';
		// Main details panel -  end
        
		// Logo and sales rep panel - start
        var salesRep = '';
        var salesRepTel = '';
        if (soHRecord.getFieldValue("salesrep") != null && soHRecord.getFieldValue("salesrep") != '') {
            var salesRepRec = nlapiLoadRecord('employee', soHRecord.getFieldValue("salesrep"));
            var firstname = salesRepRec.getFieldValue("firstname");
            if (firstname == null) 
                firstname = '';
            var lastname = salesRepRec.getFieldValue("lastname");
            if (lastname == null) 
                lastname = '';
            salesRep = firstname + ' ' + lastname;
            salesRepTel = salesRepRec.getFieldValue("phone");
        	if (salesRepTel == null) 
            	salesRepTel = '';
         }
        
        var logoPanel = '<table width="100%" style="padding-top:2mm;">';
        logoPanel += '<tr><td colspan="2"><img src="' + nlapiEscapeXML(logoURL) + '" /></td></tr>';
        logoPanel += '<tr><td colspan="2"></td></tr>';
        logoPanel += '<tr><td width="30%"><b>Your Salesperson:</b></td><td>' + nlapiEscapeXML(salesRep) + '</td></tr>';
        logoPanel += '<tr><td><b>Their Phone No. is:</b></td><td>' + nlapiEscapeXML(salesRepTel) + '</td></tr>';
        logoPanel += '</table>';
		// Logo and sales rep panel - end
        
        header = '<table width="100%">';
        header += '<tr><td width="50%">' + logoPanel + '</td><td width="50%" align="right">' + headerPanel + '</td></tr>';
        header += '<tr><td width="50%" align="center">' + invoiceAddress + '</td><td width="50%" align="center">' + shipAddress + '</td></tr>';
        header += '</table>';
        
    }
    
    return header;
}

function createReportFooter(recordID, report_type, grandTotal, page, pagetotal){
    var footer = '';
    
    var soFRecord = nlapiLoadRecord(report_type, recordID);
    if (soFRecord) {
		
        var custRecord = nlapiLoadRecord('customrecord_lhkbankdetails', 1);
        var LHKAddress = custRecord.getFieldValue('custrecord_bankaddress');
        var LHKAccount = custRecord.getFieldValue('custrecord17');
        var LHKDetails = custRecord.getFieldValue('custrecord_companydetails');

		var LHKBankAddress = '<table width="100%">';
        LHKBankAddress += '<tr><td style="vertical-align:top;"><b>Bank Address:</b></td><td>' + LHKAddress.replace(/\n/g, '<br />') + '</td></tr>';
        LHKBankAddress += '</table>';

		var LHKBankAccount = '<table width="100%">';
        LHKBankAccount += '<tr><td>' + LHKAccount.replace(/\n/g, '<br />') + '</td></tr>';
        LHKBankAccount += '</table>';


        footer = '<table width="100%">';
        //footer += '<tr style="page-break-after:avoid;"><td colspan="2"><table width="30%" align="right"><tr><td align="right"><b>Total</b></td><td ' + fontStyle5 + ' align="right"><b>' + grandTotal + '</b></td></tr></table></td></tr>';
        footer += '<tr style="page-break-after:avoid;"><td align="center" colspan="2" class="allborder"><b>Bank Account Details</b></td></tr>';
        footer += '<tr><td style="page-break-after:avoid;">' + LHKBankAccount + '</td><td style="page-break-after:avoid;">' + LHKBankAddress + '</td></tr>';
        footer += '<tr><td colspan="2" align="center" class="bottomborder"></td></tr>';
        footer += '<tr><td colspan="2" align="center" class="detailed"><p class="detailed">' + LHKDetails.replace(/\n/g, '</p><p class="detailed">') + '</p></td></tr>';
        footer += '<tr><td colspan="2" align="right" class="noborder">Page ' + page + '/' + pagetotal + '</td></tr>';
        footer += '</table>';
		
    }
    return footer;
}

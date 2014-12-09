/******************************************
 * Label Printer Suitelet
 * Version 2.0.3
 * 25/05/11
 */
function labelPrinter(request, response){
    // Modified March 23rd to accept multiple print requests via 'custparam_cids' if present
    // Else defaults to 'custparam_cid' as a single job as previously.
    
    var soRecords = new Array;
    
    if (request.getParameter('custparam_cids') != null) {
        var soRecords = request.getParameter('custparam_cids').split(',');
    }
    else {
        soRecords[0] = request.getParameter('custparam_cid');
    }
    
	var soFirstRecord = nlapiLoadRecord('salesorder', soRecords[0]);
	var labelDimension = soFirstRecord.getFieldValue('custbody_labeldimension');
	var labelHeight = "203"; // 4 x 8
	var labelWidth = "102";
    var sizeFactor = 1.0;

	// Grid lines html / css if active	
	var gridLineBottom = "";
	var gridLineBottomNoStyle = "";	
	//if (isTestUser()) {
    //    gridLineBottomNoStyle = 'border-bottom:1px plain #000000;';
    //    gridLineBottom = ' style=\"' + gridLineBottomNoStyle + '\"';
	//} 
	
    var styleFontFamily = ' style="font-family:courier;font-weight:bold;white-space:nowrap;" ';          
    var styleFontFamily2 = ' style="font-family:helvetica;font-weight:bold;white-space:nowrap;' + gridLineBottomNoStyle + '" ';          
	
    if (labelDimension == '2') { // 4 x 5
        labelHeight = "127";
        labelWidth = "102";
		sizeFactor = 0.75;
    }
	
    var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
    var pdfxml = '<pdf>';
    pdfxml += '<body width=\"' + labelWidth + 'mm\" height=\"' + labelHeight + 'mm\" margin="' + parseInt(sizeFactor * 8
	) + 'pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="' + parseInt(sizeFactor * 16) + '">';
    
    // Now multi-consignments if applicable
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
        //for (var soRec = 0; soRec < 2; soRec++) {
        if (soRec > 0) {
            pdfxml += '<pbr background-color="white"/>';
        }
        
        //var soRecordId = request.getParameter('custparam_cid');
        var soRecordId = soRecords[soRec];
        //var soRecordId = soRecords[0];
        
        if (soRecordId) {
            var soRecord = nlapiLoadRecord('salesorder', soRecordId);
            
            var barcode = soRecord.getFieldValue('custbody_labelbarcode');
			var barcodestandard = 'IDAutomation';
            //var barcodestandard = soRecord.getFieldText('custbody_barcodestandard');
            //if (barcodestandard == null || barcodestandard == '') 
            //    barcodestandard = "code-128";
            var consignmentnumber = soRecord.getFieldValue('tranid');
            var parceltext = '';
            var parceltotal = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelparcels'));
            var weight = parseFloat(soRecord.getFieldValue('custbody_labeltotalweight'));
            var service = soRecord.getFieldValue('custbody_labelservice');
            var senddepot = soRecord.getFieldValue('custbody_sendingdepot');
            var reqdepot = soRecord.getFieldValue('custbody_requestingdepot');
			var hubroute = getDepotRegionLookup(senddepot, true);
            var deldepot = soRecord.getFieldValue('custbody_receivingdepot');
            var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact'));
            var companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
            var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
            var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_parceldeliveryzone'));
            var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
            var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
            var addr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
            var addr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
            var addr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
            var addr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));

            var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode'));
            var postcode2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode2'));
			if (postcode2 != null) postcode = postcode2; //Override normal postcode e.g. RD1, RD2, etc.
			
			/*
			if (soRecord.getFieldValue('custbody_parcelarea2') == '33' || soRecord.getFieldValue('custbody_collectparcelarea2') == '33') postcode = 'RD1';
			if (soRecord.getFieldValue('custbody_parcelarea2') == '34' || soRecord.getFieldValue('custbody_collectparcelarea2') == '34') postcode = 'RD2';
			if (soRecord.getFieldValue('custbody_parcelarea2') == '35' || soRecord.getFieldValue('custbody_collectparcelarea2') == '35') postcode = 'RD3';
			if (soRecord.getFieldValue('custbody_parcelarea2') == '36' || soRecord.getFieldValue('custbody_collectparcelarea2') == '36') postcode = 'RD4';
			*/
			
            var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
            var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
			if (delname == null) delname = companyname;
            var specins = nlapiEscapeXML(soRecord.getFieldValue('custbody_specialinstructions'));
            var refno = nlapiEscapeXML(soRecord.getFieldValue('otherrefnum'));
            var recStatus = soRecord.getFieldValue('custbody_consignmentstatus');
 
            if (specins == null) 
                specins = '';
            if (refno == null) 
                refno = '';
            if (addr1 == null) 
                addr1 = '';
            if (addr2 == null) 
                addr2 = '';
            if (addr3 == null) 
                addr3 = '';
            if (addr4 == null) 
                addr4 = '';
            if (contactname == null) 
                contactname = '';
            if (telephone == null) 
                telephone = '';
            
			var fswfontSize = 36;
			var fswfontSize2 = 42;
			var fswbrtag = "<br />";
            if (fswflag == null) {
                // See if a timed delivery service and set 'P' for sfwflag
                if (service.search('07') > 0 || service.search('09') > 0 || service.search('10') > 0 || service.search('12') > 0) {
                    fswflag = 'P';
                }
                else {
                    fswflag = ' ';
                }
            }
			
            if (fswflag == ' ') {
				fswfontSize = 16;
				fswfontSize2 = 54;
				//fswbrtag = "";
			}
			            
            for (var i = 1; i <= parceltotal; i++) {
            
                if (i > 1) {
                    pdfxml += '<pbr background-color="white"/>';
                }
                
                if (i < 10) {
                    parceltext = '00' + i;
                    
                } //if
                else 
                    if (i < 100) {
                        parceltext = '0' + i;
                        
                    } //else if
                pdfxml += '<table table-layout="fixed" width="95mm" padding="0" border="0" margin="0">';
                if (barcodestandard == 'IDAutomation') {
                    pdfxml += '<tr><td align="left" cellmargin="0" rowspan="2" height="20mm"' + gridLineBottom + '><img height="90" src="http://www.bcgen.com/img/43202-dhughes-lin.aspx?Barcode=' + (barcode + parceltext) + '&amp;W=240&amp;H=240&amp;CS=0&amp;ST=F" /></td>';
                }
                else {
                    pdfxml += '<tr><td align="left" cellmargin="0" rowspan="2"' + gridLineBottom + '><barcode codetype="' + barcodestandard + '" bar-width="0.8" height="70" showtext="false" value="' + (barcode + parceltext) + '"/></td>';
                }
                //pdfxml += '<td></td></tr>';
                var thisNo = i;
                if (barcodestandard != "code-128" && barcodestandard != "IDAutomation") {
                    consignmentnumber = '';
                    parceltotal = '';
                    thisNo = '';
                }
                //pdfxml += '<tr><td ' + styleFontFamily2 + ' align="right"><b>' + consignmentnumber + '</b></td></tr>';
                pdfxml += '<td ' + styleFontFamily2 + ' align="right" vertical-align="middle"><br /><b>' + consignmentnumber + '</b></td></tr>';
                pdfxml += '<tr><td ' + styleFontFamily2 + ' align="right"><b>' + thisNo + '         ' + parceltotal + '</b></td></tr>';
                pdfxml += '<tr><td align="right" font-size="' + parseInt(sizeFactor * 12) + '" font-stretch="extra-condensed"><b>' + (barcode + parceltext) + '</b></td><td></td></tr>';
                              
                pdfxml += '<tr><td' + styleFontFamily + ' width="70mm" align="left" font-size="' + parseInt(sizeFactor * 16) + '" font-stretch="extra-condensed" cellpadding="0"><b>' + delname.slice(0, 30) + '</b></td><td width="25mm" align="right"><b>' + parseInt(senddepot * 1) + '&#160;&#160;&#160;&#160;&#160;&#160;' + parseInt(reqdepot * 1) + '</b></td></tr>';
                pdfxml += '<tr><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 16) + '" font-stretch="extra-condensed" cellpadding="0"><b>' + addr1.slice(0, 30) + '</b></td><td align="right">&#160;</td></tr>';
                pdfxml += '<tr><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 16) + '" font-stretch="extra-condensed"><b>' + addr2.slice(0, 30) + '</b></td><td align="right"><b>' + weight.toFixed(2) + '</b></td></tr>';
                pdfxml += '<tr><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 16) + '" font-stretch="extra-condensed"><b>' + addr3.slice(0, 30) + '</b></td><td align="right">&#160;</td></tr>';
                pdfxml += '<tr><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 16) + '" font-stretch="extra-condensed"><b>' + addr4.slice(0, 30) + '</b></td><td align="right" rowspan="2" font-size="' + parseInt(sizeFactor * 48) + '" font-stretch="extra-condensed"><b>' + service + '</b></td></tr>';
                pdfxml += '<tr><td align="left" font-size="' + parseInt(sizeFactor * 16) + '"><b>' + postcode + '</b></td></tr>';
                pdfxml += '</table>';
                
                pdfxml += '<table table-layout="fixed" width="95mm" padding="0" margin="0" style="border-top:solid white 1px;">';
                
                pdfxml += '<tr><td width="20mm" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed">&#160;</td><td' + styleFontFamily + ' width="40mm" align="left" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed"><b>' + companyname + '</b></td><td width="30mm" rowspan="5" align="right" valign="bottom"><table width="100%" style="background-color:black;"><tr><td width="25mm" background-color="black" font-size="' + parseInt(sizeFactor * 14) + '" color="white" style="text-align:center;vertical-align:middle;font-family:courier;">' + trandate + '</td></tr></table></td></tr>';
                pdfxml += '<tr><td font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed">&#160;</td><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed"><b>' + refno + '&#160;</b></td></tr>';
                pdfxml += '<tr><td font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed">&#160;</td><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed"><b>' + specins + '&#160;</b></td></tr>';
                pdfxml += '<tr><td font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed">&#160;</td><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed"><b>' + contactname + '&#160;</b></td></tr>';
                pdfxml += '<tr><td font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed">&#160;</td><td' + styleFontFamily + ' align="left" font-size="' + parseInt(sizeFactor * 10) + '" font-stretch="extra-condensed"><b>' + telephone + '&#160;</b></td></tr>';
                pdfxml += '</table>';
                
                //pdfxml += '<table table-layout="fixed" width="95mm" padding="0" margin="0" style="border-top:solid black 1px;"><tr><td>';
                pdfxml += '<table table-layout="fixed" width="50mm" padding="0" margin="0" style="border-right:solid white 1px;">';
                //pdfxml += '<tr><td align="left" font-size="' + parseInt(sizeFactor * 30) + '" font-stretch="extra-condensed" padding="0"><b>' + fswflag + '</b></td><td ' + styleFontFamily + ' rowspan="2" font-size="' + parseInt(sizeFactor * 16) + '">' + hubroute + '<br/><span font-size="' + parseInt(sizeFactor * 62) + '" align="right" style="font-family:Helvetica;margin-top:-16pt;"><b>' + parseInt(deldepot * 1) + '</b></span></td></tr>';
                pdfxml += '<tr><td font-stretch="extra-condensed" font-size="' + parseInt(sizeFactor * fswfontSize) + '" style="width:20mm;vertical-align:bottom;"><b>' + fswflag + fswbrtag +  '<span font-stretch="extra-condensed" font-size="' + parseInt(sizeFactor * fswfontSize2) + '" style="margin-top:2pt;vertical-align:bottom;">'+ parceldelzone + '</span></b></td><td ' + styleFontFamily + ' font-size="' + parseInt(sizeFactor * 16) + '">' + hubroute + '<br/><span font-size="' + parseInt(sizeFactor * 62) + '" align="right" style="font-family:Helvetica;margin-top:-16pt;vertical-align:bottom;"><b>' + parseInt(deldepot * 1) + '</b></span></td></tr>';
                //pdfxml += '<tr><td align="left" font-size="' + parseInt(sizeFactor * 48) + '" font-stretch="extra-condensed" padding="0" margin="0"><b>' + parceldelzone + '</b></td></tr>';
                
                //		pdfxml += '<table width="100%" border="0">';
                //		pdfxml += '<tr><td><table><tr><td font-size="24" align="left"><b>' + fswflag + '</b></td></tr><tr><td font-size="24" align="left"><b>' + parceldelzone + '</b></td></tr></table></td><td font-size="60" align="right"><b>'+ deldepot + '</b></td><td align="right">' + trandate + '</td></tr>';	
                
                var d = new Date();
                
                pdfxml += '<tr><td font-size="5" colspan="2" align="right" background-color="black" color="white" line-height="5pt">' + d.toUTCString() + '</td></tr>';
                
                pdfxml += '</table>'
                //pdfxml += '</td></tr></table>';	
            
            } //for	
            
            if (recStatus == '1') {
                soRecord.setFieldValue('custbody_consignmentstatus', '2');               
            }
			// Print counter added Jan 2012 for audit purposes
			var printCount = 0;
			if (soRecord.getFieldValue('custbody_labelprintcount') != null) printCount = parseInt(soRecord.getFieldValue('custbody_labelprintcount'));
			printCount++;
            soRecord.setFieldValue('custbody_labelprintcount', printCount);               
            var internalid = nlapiSubmitRecord(soRecord, false, true);

        } //if
        else {
            var errormsg = "<HTML><body>Error: You must save the consignment before printing the label.</body></html>";
            response.write(errormsg);
        }
    } //for
    pdfxml += '</body></pdf>';
    
    var file = nlapiXMLToPDF(pdfxml);
    response.setContentType('PDF', 'label.pdf');
    response.write(file.getValue());
    
} //function

function isTestUser() //Used to display trace dialogues as needed
{
	var testMode = false;
	//if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) testMode = true; // 8 = TESTCOMPANY
	if (parseInt(nlapiGetContext().getUser()) == 8) testMode = true; // 8 = TESTCOMPANY	
	return testMode;
}

function getDepotRegionLookup(sendingDepot, deliveringDepot, isText){
    var result = 'CENTRAL';
    //var result = 'SCOTTISH';
    
    /*
     var depotSearchFilters = new Array();
     var depotSearchColumns = new Array();
     
     depotSearchFilters[0] = new nlobjSearchFilter('custrecord_dbfdepotnumber', null, 'equalto', theDepot);
     depotSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
     
     depotSearchColumns[0] = new nlobjSearchColumn('custrecord_dbfdepotnumber');
     depotSearchColumns[1] = new nlobjSearchColumn('custrecord_depotroute');
     
     var depotSearchResults = nlapiSearchRecord('customrecord_depotlist', null, depotSearchFilters, depotSearchColumns);
     
     if (depotSearchResults && depotSearchColumns[1] != null) {
     if (isText){
     result = depotSearchResults[0].getText(depotSearchColumns[1]);
     } else {
     result = depotSearchResults[0].getValue(depotSearchColumns[1]);
     }
     }
     */
	
    return result;
}

/******************************************
 * Label Printer Suitelet
 * Version 1.0.0
 * 05/05/11
 */
function labelPalletPrinterV2(request, response){
    // Modified March 23rd to accept multiple print requests via 'custparam_cids' if present
    // Else defaults to 'custparam_cid' as a single job as previously.
    
    var soRecords = new Array;
    if (request.getParameter('custparam_cids') != null) {
        var soRecords = request.getParameter('custparam_cids').split(',');
    }
    else {
        soRecords[0] = request.getParameter('custparam_cid');
    }
    
    var outputType = 'pdf';
    if (request.getParameter('custparam_outputtype') != null && request.getParameter('custparam_outputtype') != '') 
        outputType = request.getParameter('custparam_outputtype');
    
    var labelCounter = 0; //Used for odd /even counter if alternating orientation
    var labelPageshtml = new Array; // Store pages in array for layout after compiling
    // Process each consignment in the list
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
        //for (var soRec = 0; soRec < 2; soRec++) {
        //if (soRec > 0) {
        //    pdfxml += '<pbr background-color="white"/>';
        //}
        
        var soRecordId = soRecords[soRec];
		
        if (soRecordId) {
            // Set up the label elements that are same on all labels for the consignment
            var soRecord = nlapiLoadRecord('salesorder', soRecordId);
            
            var labelDimension = soRecord.getFieldValue('custbody_labeldimensionpallets');
            if (labelDimension == null || labelDimension == '') 
                labelDimension = 4; //Hard coded backup
            //Lookup parameters for the label type used and set them here
            var labelRecord = nlapiLoadRecord('customrecord_labeldimension', labelDimension);
            var labelHeight = labelRecord.getFieldValue('custrecord_labelheight');
            var labelWidth = labelRecord.getFieldValue('custrecord_labelwidth');
            var labelAlignment = labelRecord.getFieldValue('custrecord_labelalignment');
            if (labelAlignment == null) 
                labelAlignment = '';
            
            var sizeFactor = parseFloat(labelRecord.getFieldValue('custrecord_labelscalingfactor'));
            var CopiesPerLabel = parseInt(labelRecord.getFieldValue('custrecord_labelcopiesperlabel'));
            var labelsPerPageAcross = parseInt(labelRecord.getFieldValue('custrecord_labelsperpage'));
            var labelsPerPageDown = parseInt(labelRecord.getFieldValue('custrecord_labelsperpagedown'));
            var labelsPerPage = parseInt(labelsPerPageAcross * labelsPerPageDown);
            
            //Inset label area 2mm around for label tolerances etc.
            var labelMargin = parseInt(labelRecord.getFieldValue('custrecord_labelmargin'));
            var labeltdwidth = ((labelWidth / labelsPerPageAcross) - labelMargin).toFixed(0);
            var labeltdheight = ((labelHeight / labelsPerPageDown) - labelMargin).toFixed(0);
            
            var alternateOrientation = false;
            if (labelRecord.getFieldValue('custrecord_labelalternateupdown') == 'T') 
                alternateOrientation = true; // Prints each label the other way around for proforma labels
                var useGridLines = false;
                if (labelRecord.getFieldValue('custrecord_labelgridlines') == 'T') 
                    useGridLines = true; // Prints grid lines and field labels
                var offStyle = "off";
                if (useGridLines) 
                    offStyle = "";
                var logoURL = "https://system.netsuite.com/core/media/media.nl?id=33&c=1169462&h=13e67f68b207fceb4d68"; //Blank image
                if (labelRecord.getFieldValue('custrecord_labellogo') == 'T') 
                    logoURL = "https://system.netsuite.com/core/media/media.nl?id=31&c=1169462&h=6636a3575a78454d2b47";
                //Added May 2012 - supress consignor name
                var displayConsignor = true;
                if (labelRecord.getFieldValue('custrecord_labelhideconsignorname') == 'T') 
                    displayConsignor = false;				
           
            if (soRec == 0) { // Output the xml/pdf preamble
                var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
                var pdfxml = '<' + outputType + '>';
                pdfxml += getHeadNode(true, sizeFactor);
                pdfxml += '<body width=\"' + labelWidth + 'mm\" height=\"' + labelHeight + 'mm\" margin="0pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="' + parseInt(sizeFactor * 14) + '">';
            }
            
            var currentItemId = soRecord.getLineItemValue('item', 'item', 1); //The service item
            var currentItem = nlapiLoadRecord('serviceitem', currentItemId);
            var serviceTime = soRecord.getLineItemValue('item', 'custcol_palletservicetime', 1);
            var whiteonblack = false;
            var serviceBG = "ffffff";
            var servicefontcolor = "000000";
            if (currentItem.getFieldValue('custitem_whiteonblack') == 'T') {
                whiteonblack = true;
                servicefontcolor = "ffffff";
                serviceBG = "000000";
            }
            var timedservice = false;
            var timedPrompt = ''; //Only appears if a timed  and or dedicated day service
            //var timedHHMM = soRecord.getLineItemValue('item', 'custcol_palletservicetime', 1);
            //var timedDate = soRecord.getLineItemValue('item', 'custcol_palletserviceday', 1);
            var timedHHMM = nlapiEscapeXML(soRecord.getFieldValue('custbody_pallettmservice_text'));
            var timedDate = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletddservice_date'));
            if (timedHHMM == null) 
                timedHHMM = '';
            if (timedDate == null) 
                timedDate = '';
            if (timedDate != '') 
                timedPrompt = 'Deliver on :' + timedDate + ' ';
            if (timedHHMM != '') 
                timedPrompt += 'At :' + timedHHMM + ' ';
            
            /*
             if (currentItem.getFieldValue('custitem_timeddeliveryservice') == 'T'){
             timedservice = true;
             var timedHHMM = nlapiEscapeXML(soRecord.getLineItemValue('item', 'custcol_palletservicetime', 1));
             var timedDate = nlapiEscapeXML(soRecord.getLineItemValue('item', 'custcol_palletserviceday', 1));
             if (timedHHMM != '' && timedDate != '') timedPrompt = 'Deliver on :' + timedDate + " at " + timedHHMM;
             }
             */
            if (serviceTime == null) 
                serviceTime = '';
            
            var totalpallets = soRecord.getFieldValue('custbody_labelparcels') * 1;
            var totalweight = soRecord.getFieldValue('custbody_labeltotalweight') * 1;
            var specins = nlapiEscapeXML(soRecord.getFieldValue('custbody_specialinstructions'));
            var serviceDesc = soRecord.getFieldValue('custbody_labelservice');
            var ServiceArray = serviceDesc.split(' ');
            var service = nlapiEscapeXML(ServiceArray[0]);
            var barcode = soRecord.getFieldValue('custbody_labelbarcode');
            var barcodestandard = soRecord.getFieldText('custbody_barcodestandard');
            if (barcodestandard == null || barcodestandard == '') 
                barcodestandard = "code-128";
            var consignmentnumber = soRecord.getFieldValue('tranid');			
			var leadingZero = "0";
			
			//if (request.getParameter('custparam_tpnnum') == 'Y') {
			var TPNnumber = soRecord.getFieldValue('externalid');
			if (TPNnumber != null && TPNnumber != '') {
				var TPNarray = TPNnumber.split(':');
				if (TPNarray.length > 1) {
					TPNnumber = TPNarray[1];
					//if (parseInt(soRecord.getFieldValue('class')) == 9) 
					consignmentnumber = TPNnumber;
					leadingZero = "";
				}
			}
			//}
			
            var senddepot = getDepotNum(soRecord.getFieldValue('custbody_palletcollectingdepot') * 1);
            var reqpalletdepot = getDepotNum(soRecord.getFieldValue('custbody_palletrequestingdepot') * 1);
            var reqdepot = getDepotNum(soRecord.getFieldValue('custbody_requestingdepot') * 1);
            var deldepot = getDepotNum(soRecord.getFieldValue('custbody_receivingdepot') * 1);
            var palletclass = soRecord.getFieldValue('class') * 1;
            var labelclass = '';
            var labelTelCo = 'The Pallet Network Ltd.<br />Tel : 0870 600 3001';
            if (parseInt(palletclass) != 1) {
                labelTelCo = 'Local Services<br />Tel : 01457 860 826';
                labelclass = soRecord.getFieldText('class').slice(0, 5); //Use the first chars of the class
                if (parseInt(palletclass) == 3) {
                    labelclass == "SCOT";
                    labelTelCo = 'NEP Scottish Services<br />Tel : 01457 860 826';
                }
            }
            var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact'));
            var companyname = '';
            if (displayConsignor) 
                companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
            var pickuppostcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddresspostcode')).toUpperCase();
            //var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
            var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletdeliveryzone'));
            var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
            
            var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
            var dateArray = trandate.split("/");
            var theLongDate = getLongNum(dateArray[0]) + getLongNum(dateArray[1]) + dateArray[2]; // Used in bar code
            trandate = getLongNum(dateArray[0]) + '/' + getLongNum(dateArray[1]) + '/' + dateArray[2]; // Used in bar code
            var addrArray = new Array();  addrArray[0] = delname;
            addrArray[1] = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
            addrArray[2] = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
            addrArray[3] = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
            addrArray[4] = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));
            
            if (addrArray[1] == null || addrArray[1] == '.') 
                addrArray[1] = '';
            if (addrArray[2] == null || addrArray[2] == '.') 
                addrArray[2] = '';
            if (addrArray[3] == null || addrArray[3] == '.') 
                addrArray[3] = '';
            if (addrArray[4] == null || addrArray[4] == '.') 
                addrArray[4] = '';
            
            var addrA = '';
            var foundB = 0;
            for (var locA = 1; locA <= 4; locA++) {
                if (addrArray[locA] != '') {
                    addrA = addrArray[locA];
                    foundB = parseInt(locA + 1);
                }
                if (foundB > 0) 
                    break;
            }
            
            var addrB = '';
            var foundC = 0;
            for (var locB = foundB; locB <= 4; locB++) {
                if (addrArray[locB] != '') {
                    addrB = addrArray[locB];
                    foundC = parseInt(locB + 1);
                }
                if (addrB != '' && addrB != addrA) 
                    break;
            }
            
            var addrC = '';
            for (var locC = foundC; locC <= 4; locC++) {
                if (addrArray[locC] != '') {
                    addrC = addrArray[locC];
                }
                if (addrC != '' && addrC != addrB) 
                    break;
            }
            
			var palletAddr2 = addrC; //Usually town / city
			if  (palletAddr2 == '') palletAddr2 = addrB; //Usually Road but may be city / town if missing from C
			
            var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode')).toUpperCase();
            var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
            var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
            var refno = nlapiEscapeXML(soRecord.getFieldValue('otherrefnum'));
            var recStatus = soRecord.getFieldValue('custbody_consignmentstatus');
            if (specins == null) 
                specins = '';
            //if (TPNnumber)
            	specins += " /" + TPNnumber;
            if (refno == null) 
                refno = '';
            // Now load the pallet list custom records for this consignment
            var palletSearchFilters = new Array();
            var palletSearchColumns = new Array();
            
            palletSearchFilters[0] = new nlobjSearchFilter('custrecord_palletlistconsignmentlookup', null, 'is', soRecordId);
            palletSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            
            palletSearchColumns[0] = new nlobjSearchColumn('custrecord_palletlistsizelookup');
            palletSearchColumns[1] = new nlobjSearchColumn('custrecord_palletlistquantity');
            palletSearchColumns[2] = new nlobjSearchColumn('custrecord_palletlistweight');
            palletSearchColumns[3] = new nlobjSearchColumn('custrecord_palletlistnotes');
            palletSearchColumns[4] = new nlobjSearchColumn('custrecord_palletlistheight');
            palletSearchColumns[5] = new nlobjSearchColumn('custrecord_palletlistwidth');
            palletSearchColumns[6] = new nlobjSearchColumn('custrecord_palletlistdepth');
            
            var palletSearchResults = nlapiSearchRecord('customrecord_palletconsignmentlist', null, palletSearchFilters, palletSearchColumns);
            var palletCounter = 0;
            if (palletSearchResults) {
                var totalLabels = palletSearchResults.length * CopiesPerLabel;
                //Cycle through every pallet list record testing for the presence and print labels if so ...
                for (var listNo = 0; listNo < palletSearchResults.length; listNo++) {
                    var custPalletSize = nlapiLoadRecord('customrecord_palletsize', palletSearchResults[listNo].getValue(palletSearchColumns[0]));
                    var palletSize = custPalletSize.getFieldValue('custrecord_labelabbreviation');
                    var palletSizeQty = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                    var parcelnotes = nlapiEscapeXML(palletSearchResults[listNo].getValue(palletSearchColumns[3]));
                    var parceltotal = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                    var weight = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[2]) / palletSizeQty);
                    
                    for (var i = 1; i <= palletSizeQty; i++) {
                        palletCounter++;
                        
                        var rotateHTML = "";
                        if (alternateOrientation && (labelCounter % 2 == 0)) 
                            rotateHTML = " rotate=\"180\" ";
                        
                        var barcode = senddepot + leadingZero + consignmentnumber + getLongNum(palletCounter) + theLongDate;
                        //var barcodetext = senddepot + '%20' + consignmentnumber + '%20' + getLongNum(i) + '%20' + theLongDate;
                        var barcodetext = senddepot + ' ' + leadingZero + consignmentnumber + ' ' + getLongNum(palletCounter) + ' ' + theLongDate;
                        
                        // All pallet labels are printed several times ...     
                        for (var printTwice = 0; printTwice < CopiesPerLabel; printTwice++) {
                            labelCounter++;
                            var labelhtml = '';
                            labelhtml += '<table>';
                            labelhtml += '<tr><td>'; // Top row left start
                            labelhtml += '    <table table-layout="fixed" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm" cellpadding="0" border="0" margin="0"><tr>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 50) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '" align="center"><b>' + labelTelCo + '</b></td>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 40) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '" align="center"><b>' + palletCounter + ' of ' + totalpallets + '<br />Weight: ' + weight + ' kg<br />of Total: ' + totalweight + ' kg</b></td>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 15) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '" align="left"><b>From :</b></td>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 40) + 'mm" font-size="' + parseInt(sizeFactor * 16) + 'mm" line-height="' + parseInt(sizeFactor * 15) + 'mm" align="center"><b>' + senddepot + '</b></td>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 35) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '" align="center"><b>On: ' + trandate + '</b></td>';
                            labelhtml += '    </tr></table>';
                            labelhtml += '    </td>'; // Top row left end - vertical barcode follows
                            labelhtml += '    <td rowspan="5" border="0" width="' + parseInt(sizeFactor * 21) + 'mm" height="' + parseInt(sizeFactor * labeltdheight) + 'mm" style="text-align:left;vertical-align:middle;"><img src="http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + barcode + '&amp;BH=' + parseFloat(sizeFactor * 2.1).toFixed(1) + '&amp;O=90&amp;CS=0&amp;ST=F" style="height: ' + parseInt(sizeFactor * (labeltdheight * 0.9)) + 'mm; width: ' + parseInt(sizeFactor * 21) + 'mm;margin-left:-5mm;" /></td></tr>';
                            //labelhtml += '    <td rowspan="5" border="0" width="' + parseInt(sizeFactor * 21) + 'mm" height="' + parseInt(sizeFactor * labeltdheight) + 'mm" style="text-align:left;vertical-align:middle;"><img src="http://www.bcgen.com/demo/linear-dbgs.aspx?Barcode=' + barcode + '&amp;BH=' + parseFloat(sizeFactor * 2.1).toFixed(1) + '&amp;O=90&amp;CS=0&amp;ST=F" style="height: ' + parseInt(sizeFactor * (labeltdheight * 0.9)) + 'mm; width: ' + parseInt(sizeFactor * 21) + 'mm;margin-left:-5mm;" /></td></tr>';
                            labelhtml += '   <tr><td style="vertical-align:top;">'; // Second row left start
                            labelhtml += '    <table border="0" cellpadding="0" table-layout="fixed" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm" height="' + parseInt(sizeFactor * 15) + 'mm" padding="0" margin="0" style="vertical-align:top;"><tr>';
                            if (palletclass == 1) { // Normal TPN zone / depot
                                labelhtml += '     <td colspan="2" width="' + parseInt(sizeFactor * 85) + 'mm" align="left">';
                                labelhtml += '      <table table-layout="fixed" width="' + parseInt(sizeFactor * 85) + 'mm" height="' + parseInt(sizeFactor * 15) + 'mm"><tr><td width="' + parseInt(sizeFactor * 25) + 'mm" background-color="#000000" style="text-align:center;vertical-align:middle;"><span font-size="' + parseInt(sizeFactor * 27) + 'mm" line-height="' + parseInt(sizeFactor * 24) + 'mm" style="color: white;padding: 25px 0px 0px 10px;"><b>' + parceldelzone + '</b></span>';
                                labelhtml += '      </td><td font-stretch="expanded" font-size="' + parseInt(sizeFactor * 38) + 'mm" width="' + parseInt(sizeFactor * 55) + 'mm" line-height="' + parseInt(sizeFactor * 28) + 'mm"><b>' + deldepot + '</b></td></tr></table>';
                                labelhtml += '     </td>';
                            }
                            else { // Local or trunk provider from class name
                                if (labelclass == 'SCOTT') 
                                    labelclass = 'SCOT';
                                labelhtml += '     <td colspan="2" width="' + parseInt(sizeFactor * 85) + 'mm" height="' + parseInt(sizeFactor * 15) + 'mm" font-size="' + parseInt(sizeFactor * 30) + 'mm" align="center" line-height="' + parseInt(sizeFactor * 28) + 'mm"><b>' + labelclass + '</b></td>';
                            }
                            labelhtml += '     <td>'; // Cell 3 - address from / to
                            labelhtml += '       <table cellpadding="0" table-layout="fixed" width="' + parseInt(sizeFactor * 67) + 'mm" height="33mm" padding="0" border="0" margin="0">';
                            labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '">' + companyname + '</td></tr>';
                            labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '">' + pickuppostcode + '</td></tr>';
                            //labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '"></td></tr>';
                            labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '" text-align="center">To :</td><td align="left" width="57mm" font-size="' + parseInt(sizeFactor * 11) + '">' + delname.slice(0, 30) + '</td></tr>';
                            if (addrA != '' && addrA != null) labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td align="left" width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '">' + addrA.slice(0, 25) + '</td></tr>';
                            if (addrB != '' && addrB != null) labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '">' + addrB.slice(0, 25) + '</td></tr>';
                            if (addrC != '' && addrC != null) labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 10) + '">' + addrC.slice(0, 25) + '</td></tr>';
                            labelhtml += '         <tr><td width="' + parseInt(sizeFactor * 10) + 'mm" font-size="' + parseInt(sizeFactor * 12) + '"></td><td width="' + parseInt(sizeFactor * 57) + 'mm" font-size="' + parseInt(sizeFactor * 15) + '" line-height="' + parseInt(sizeFactor * 5) + 'mm"><b>' + postcode + '</b></td></tr>';
                            labelhtml += '       </table>';
                            labelhtml += '     </td>'; // Cell 3  address end
                            labelhtml += '    </tr></table>';
                            labelhtml += '    </td></tr>'; // Second row left end
                            labelhtml += '    <tr><td>'; // Third row left start
                            labelhtml += '    <table border="0" table-layout="fixed" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm"  height="' + parseInt(sizeFactor * 10) + 'mm" padding="0" margin="0">';
                            labelhtml += '     <tr><td width="' + parseInt(sizeFactor * 55) + 'mm" height="' + parseInt(sizeFactor * 5) + 'mm" font-size="20" align="left" style="color: black; vertical-align: top;font-size: ' + parseInt(sizeFactor * 10) + 'mm;line-height: ' + parseInt(sizeFactor * 9) + 'mm;"><b>' + palletSize + '</b></td>';
                            labelhtml += '     <td width="' + parseInt(sizeFactor * 45) + 'mm" height="' + parseInt(sizeFactor * 5) + 'mm" align="left" style="background-color:#' + serviceBG + ';padding:3px;"><span style="color: #' + servicefontcolor + '; vertical-align: top; text-align: center;font-size: ' + parseInt(sizeFactor * 14) + 'mm;line-height: ' + parseInt(sizeFactor * 14) + 'mm;"><b>' + service + '</b></span></td>';
                            labelhtml += '     <td rowspan="2" width="' + parseInt(sizeFactor * 75) + 'mm" height="' + parseInt(sizeFactor * 5) + 'mm" font-size="12" align="center" style="vertical-align:top;"><table background-color="#ffffff" width="' + parseInt(sizeFactor * 65) + 'mm" height="' + parseInt(sizeFactor * 10) + 'mm" line-height="' + parseInt(sizeFactor * 5) + 'mm" border="0" margin="0"><tr><td>Ref: ' + refno + '<br />Contents: ' + parcelnotes + '<br />Note: ' + specins + '</td></tr></table></td></tr>';
                            labelhtml += '    <tr><td colspan="2" height="' + parseInt(sizeFactor * 5) + 'mm" align="left" style="padding-top:1mm;">' + timedPrompt + '</td></tr>';
                            labelhtml += '    </table>';
                            labelhtml += '    </td></tr>'; // Third row left end
                            labelhtml += '    <tr><td border="0" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm" height="' + parseInt(sizeFactor * 20) + 'mm" align="center"><img src="http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + barcode + '&amp;W=' + parseInt(sizeFactor * 590) + '&amp;BH=' + parseFloat(sizeFactor * 2.0).toFixed(1) + '&amp;CS=0&amp;ST=F" style="height: ' + parseInt(sizeFactor * 20) + 'mm; width: ' + parseInt(sizeFactor * 160) + 'mm;margin-top:-2mm;" /></td></tr>';
                            //labelhtml += '    <tr><td border="0" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm" height="' + parseInt(sizeFactor * 20) + 'mm" align="center"><img src="http://www.bcgen.com/demo/linear-dbgs.aspx?Barcode=' + barcode + '&amp;W=' + parseInt(sizeFactor * 590) + '&amp;BH=' + parseFloat(sizeFactor * 2.0).toFixed(1) + '&amp;CS=0&amp;ST=F" style="height: ' + parseInt(sizeFactor * 20) + 'mm; width: ' + parseInt(sizeFactor * 160) + 'mm;margin-top:-2mm;" /></td></tr>';
                            labelhtml += '    <tr><td border="0" width="' + parseInt(sizeFactor * (labeltdwidth - 30)) + 'mm" height="' + parseInt(sizeFactor * 5) + 'mm" align="center" font-size="' + parseInt(sizeFactor * 11) + '"><b>' + barcodetext + '</b></td></tr>';
                            labelhtml += '</table>';
                            
                            labelPageshtml[labelCounter - 1] = labelhtml; // Add this page to the array                           
                        } // for - print several copies per label
                    } // for - no. of pallets of this list record
                } // For pallet list records
            } // Pallet List search results
        } // If recordid
    } //for recordids
    // Output the html array of labels to pdf document with pagination as needed
    var page = 0;
    for (var label = 1; label <= labelPageshtml.length; label++) {
        var pageIndex = label % labelsPerPage; // Modulo gives if first (1) or last (0) on page
        var pageIndexAcross = pageIndex % labelsPerPageAcross; // Modulo gives if first (1) or last (0) on row
        //var pageIndexDown = pageIndex % labelsPerPageDown; // Modulo gives if first (1) or last (0) on row
        
        if (pageIndex == 1 || label == 1 || labelsPerPage == 1) { //Start table i.e. new or first page
            pdfxml += '<table style="' + labelAlignment + '">';
            page++;
        }
        
        if (pageIndexAcross == 1 || label == 1 || labelsPerPageAcross == 1) //Start row 
            pdfxml += '<tr>';
        
        //Output the label HTML content from array ...
        pdfxml += '<!-- Label:' + label + ' Page:' + page + ' PageIndex:' + pageIndex + ' PageIndexAcross:' + pageIndexAcross + ' -->';
        pdfxml += '<td border="0" align="center" width="' + labeltdwidth + 'mm" height="' + labeltdheight + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;height:' + labeltdheight + 'mm;">' + labelPageshtml[label - 1] + '</td>';
        
        if (pageIndexAcross == 0 || label == labelPageshtml.length || labelsPerPageAcross == 1) { //End row - pad as required if end of labels run
            for (var rowPad = (labelsPerPageAcross - pageIndexAcross); rowPad < labelsPerPageAcross; rowPad++) 
                pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" height="' + labeltdheight + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;height:' + labeltdheight + 'mm;padding:2mm;vertical-align:middle;"></td>';
            pdfxml += '</tr>';
        }
        
        if (pageIndex == 0 || label == labelPageshtml.length || labelsPerPage == 1) //Build end table structure
            pdfxml += '</table>';
        
        //if (label > 1 && pageIndex == 0 && label != labelPageshtml.length) // Throw a new page if needed
        //    pdfxml += '<pbr background-color="white" />';
    }
    
    pdfxml += '</body></' + outputType + '>';
    
    var backtoConsignmentManager = false;
    if (recStatus == '1') {
        if (soRecord.getFieldValue('custbody_printonsubmit') == 'T') 
            backtoConsignmentManager = true;
        soRecord.setFieldValue('custbody_consignmentstatus', '2');
        soRecord.setFieldValue('custbody_printonsubmit', 'F');
    }
    
    // Print counter added Jan 2012 for audit purposes
    /*
	var printCount = 0;
    if (soRecord.getFieldValue('custbody_labelprintcount') != null) 
        printCount = parseInt(soRecord.getFieldValue('custbody_labelprintcount'));
    printCount++;
    soRecord.setFieldValue('custbody_labelprintcount', printCount);
     */
	var internalid = nlapiSubmitRecord(soRecord, false, true);

    if (outputType == 'html') {
        response.write(pdfxml);
    }
    else {
        var file = nlapiXMLToPDF(pdfxml);
        response.setContentType('PDF', 'label.pdf');
        response.write(file.getValue());
        //if (backtoConsignmentManager) 
        //    nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
    }
    
    
} //function

function getPalletList(theConsignmentID){
	var palletIDs = "";

    var palletSearchFilters = new Array();
    var palletSearchColumns = new Array();
    
    palletSearchFilters[0] = new nlobjSearchFilter('custrecord_palletlistconsignmentlookup', null, 'is', theConsignmentID);
    
    palletSearchColumns[0] = new nlobjSearchColumn('custrecord_palletlistsizelookup');
    palletSearchColumns[1] = new nlobjSearchColumn('custrecord_palletlistquantity');
    palletSearchColumns[2] = new nlobjSearchColumn('custrecord_palletlistweight');
    //palletSearchColumns[3] = new nlobjSearchColumn('internalid');
    
    //var palletSearchResults = nlapiSearchRecord('customrecord_palletconsignmentlist', 'customsearch_palletslistlookup', palletSearchFilters, palletSearchColumns);
    var palletSearchResults = nlapiSearchRecord('customrecord_palletconsignmentlist', null, palletSearchFilters, palletSearchColumns);
    var palletCounter = 0;
    if (palletSearchResults != null) { // Compile the pallets list table
				for (p = 0; p < palletSearchResults.length; p++) {
					if (palletIDs != '') palletIDs += ',';
					palletIDs += '*** ' + p + ' ***';
					//palletIDs += palletSearchResults[p].getValue(palletSearchColumns[2]);
				}
    }
    return palletIDs;
}

function getHeadNode(gridLinesOn, sizeFactor){

    var lineColour = "000000"; // Black = lines visible
    var nolineColour = "ffffff"; // White = no lines visible
    if (gridLinesOn) 
        lineColour = "000000";
    
    var CSS_DEFINITION = '<style type="text/css">';
    //CSS_DEFINITION += 'td  { white-space:nowrap; }';	
    CSS_DEFINITION += 'td.linebottom  { border-bottom: 1px solid #' + lineColour + '; }';
    CSS_DEFINITION += 'td.linebottomoff  { border-bottom: 1px solid #' + nolineColour + '; }';
    CSS_DEFINITION += 'td.linetop  { border-top: 1px solid #' + lineColour + '; }';
    CSS_DEFINITION += 'td.linetopoff  { border-top: 1px solid #' + nolineColour + '; }';
    CSS_DEFINITION += 'td.lineright  { border-right: 1px solid #' + lineColour + '; }';
    CSS_DEFINITION += 'td.linerightoff  { border-right: 1px solid #' + nolineColour + '; }';
    CSS_DEFINITION += 'td.addressline  { font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 6) + 'mm;font-stretch:extra-condensed;white-space:nowrap;line-height:' + parseInt(sizeFactor * 4) + 'mm; }';
    CSS_DEFINITION += 'td.postcode  { font-family:helvetica;font-weight:bold;font-size:' + parseInt(sizeFactor * 24) + 'pt;white-space:nowrap;line-height:' + parseInt(sizeFactor * 95) + '%; }';
    CSS_DEFINITION += 'span.title  { color:#' + lineColour + ';font-family:helvetica;font-size:' + parseInt(sizeFactor * 6) + 'pt;white-space:nowrap; }';
    CSS_DEFINITION += 'span.titleoff  { color:#' + nolineColour + ';font-family:helvetica;font-size:' + parseInt(sizeFactor * 6) + 'pt;white-space:nowrap; }';
    CSS_DEFINITION += 'span.tpnsmall  { padding-left:' + parseInt(sizeFactor * 8) + 'px;color:#000000;font-family:helvetica;font-stretch:semi-condensed;font-size:' + parseInt(sizeFactor * 12) + 'pt;font-weight:bold;white-space:nowrap; }';
    CSS_DEFINITION += 'span.tpnmedium  { padding-left:' + parseInt(sizeFactor * 8) + 'px;color:#000000;font-family:helvetica;font-stretch:semi-condensed;font-size:' + parseInt(sizeFactor * 18) + 'pt;font-weight:bold;white-space:nowrap; }';
    CSS_DEFINITION += 'span.tpnlarge  { color:#000000;padding-top:' + parseInt(sizeFactor * 2) + 'px;font-family:helvetica;font-size:' + parseInt(sizeFactor * 30) + 'pt;line-height:' + parseInt(sizeFactor * 15) + 'pt;font-weight:bold;font-stretch:semi-condensed;white-space:nowrap; }';
    CSS_DEFINITION += 'span.tpnextralarge  { color:#000000;padding-top:' + parseInt(sizeFactor * 4) + 'px;vertical-align:bottom;font-family:helvetica;font-size:' + parseInt(sizeFactor * 19) + 'mm;line-height:' + parseInt(sizeFactor * 15) + 'mm;font-weight:bold;font-stretch:semi-expanded;white-space::nowrap; }';
    CSS_DEFINITION += 'td.consigneeline  { font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 8) + 'pt;line-height:' + parseInt(sizeFactor * 5) + 'pt;white-space:nowrap; }';
    CSS_DEFINITION += 'td.dateblock  { background-color:#000000;color:#ffffff;font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 12) + 'pt;white-space:nowrap;vertical-align:bottom; }';
    CSS_DEFINITION += 'td.identblock  { background-color:#000000;color:#ffffff;font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 6) + 'pt;white-space:nowrap;text-align:right; }';
    CSS_DEFINITION += '</style>';
    
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

function getLongNum(theNum){
    if (parseInt(theNum) <= 9) {
        return '0' + theNum;
    }
    else {
        return theNum;
    }
}

function getDepotNum(theNum){
    if (parseInt(theNum) < 10) {
        theNum = '00' + theNum;
    }
    else {
        if (parseInt(theNum) < 100) {
            theNum = '0' + theNum;
        }
    }//if
    return theNum;
}

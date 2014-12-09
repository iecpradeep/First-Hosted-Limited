/******************************************
 * Label Printer Suitelet
 * Version 2.1
 * 19/10/11
 * Version 3.0 - Support for Parcel Lists
 * October 2012
 */

function removeTags(theString){
	return nlapiEscapeXML((theString.replace('<','')).replace('>',''));
}

function removeBadText(theString){
var theStringBefore = theString;
	if (theString != null && theString != ''){
		theString = theString.replace('&',' ');
		theString = nlapiEscapeXML(theString);
		theString = theString.replace('n/a','');
	}
	nlapiLogExecution('DEBUG', 'removeBadText( ' + theStringBefore + ')', theString);
	return theString;
}

function labelPrinterV3(request, response, bulkprintcids, bulkprintfilename, labeldimensionid){
	// Modified July 4-6th 2011 to  use CSS & div layers so grid lines can be applied.
	// Modified March 23rd to accept multiple print requests via 'custparam_cids' if present ...
	// ... else defaults to 'custparam_cid' as a single job as previously.
	// modified October 2011 to use custom records to define printer layout settings
	// modified September 2012 to allow bulk printing requests
	// modified October 2012 to use custom records to define parcel groups - LDL requirement but a generic feature
	
    var mainMenu = false;
	var bulkPrint = false;
	var soRecords = new Array;
	if (bulkprintcids != null && bulkprintcids != '') {
		soRecords = bulkprintcids.split(',');
		bulkPrint = true;
	}
	else {
		if (request.getParameter('custparam_cids') != null && request.getParameter('custparam_cids') != '') {
			soRecords = request.getParameter('custparam_cids').split(',');
		}
		else {
			soRecords[0] = request.getParameter('custparam_cid');
		}
	}
		
	var adminLabelDimension = 10;
	var adminLabelDimensionNoConsignor = 14;
	
	var LabelVersion = 1;
	var outputType = 'pdf';
	if (!bulkPrint) {
		if (request.getParameter('custparam_outputtype') != null && request.getParameter('custparam_outputtype') != '') 
			outputType = request.getParameter('custparam_outputtype');
	}
	
	nlapiLogExecution('AUDIT', 'START? ' + bulkPrint, "TO PROCESS:"+ soRecords.length + " : bulkprintfilename:" + bulkprintfilename + " : labeldimensionid:" + labeldimensionid + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());

	var labelCounter = 0; //Used for odd /even counter if alternating orientation
	var labelPageshtml = new Array; // Store pages in array for layout after compiling
	// Process each consignment in the list
	for (var soRec = 0; soRec < soRecords.length; soRec++) {
		var soRecordId = soRecords[soRec];
		var soRecLabel = '';
		if (bulkPrint) soRecLabel = bulkprintfilename.substring(bulkprintfilename.length-1) + ":" + (soRec + 1) + "/" + soRecords.length;
		if (soRecordId) {
			var soRecord = nlapiLoadRecord('salesorder', soRecordId);
			
			var labelDimension = soRecord.getFieldValue('custbody_labeldimension');
			//if (labelDimension == 11 || labelDimension == 12) // New APC format
			if (parseInt(labelDimension) >= 7) // New APC format
				LabelVersion = 3;
			var lastLabelPrinted = soRecord.getFieldValue('custbody_lastlabelprinted');
			
			if (bulkPrint && labeldimensionid) 
				labelDimension = labeldimensionid;
			//Lookup parameters for the label type used and set them here
			var labelRecord = nlapiLoadRecord('customrecord_labeldimension', labelDimension);
			var displayConsignor = true;
			if (labelRecord.getFieldValue('custrecord_labelhideconsignorname') == 'T') 
				displayConsignor = false;
			
			/*
			//Override if not customer center ...
			if (!isCustomerCenter())
				{
				if (displayConsignor){
					labelDimension = adminLabelDimension;					
				} else {
					labelDimension = adminLabelDimensionNoConsignor;					
				}
				labelRecord = nlapiLoadRecord('customrecord_labeldimension', labelDimension);
			}
			*/
			
			nlapiLogExecution('AUDIT', 'START' + soRec + '/' + soRecords.length, " PROCESS:"+ soRecordId + " : bulkprintfilename:" + bulkprintfilename + " : labeldimensionid:" + labeldimensionid + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());

			var labelHeight = labelRecord.getFieldValue('custrecord_labelheight');
			var labelWidth = labelRecord.getFieldValue('custrecord_labelwidth');
			var labelAlignment = labelRecord.getFieldValue('custrecord_labelalignment');
			if (labelAlignment == null) 
				labelAlignment = '';
			var sizeFactor = parseFloat(labelRecord.getFieldValue('custrecord_labelscalingfactor'));
						
            var CopiesPerLabel = parseInt(labelRecord.getFieldValue('custrecord_labelcopiesperlabel'));
            var labelsPerPageAcross = parseInt(labelRecord.getFieldValue('custrecord_labelsperpage'));
            var labelsPerPageDown = parseInt(labelRecord.getFieldValue('custrecord_labelsperpagedown'));
			//var labelsPerPage = parseInt(labelRecord.getFieldValue('custrecord_labelsperpage'));
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
			
			if (soRec == 0) { // Output the xml/pdf preamble
				var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
				var pdfxml = '<' + outputType + '>';
				pdfxml += getHeadNode(true, sizeFactor);
				var newAlign = "";
				//if (version = 2)
				//	newAlign = 'align="right"';
				pdfxml += '<body width=\"' + labelWidth + 'mm\" height=\"' + labelHeight + 'mm\" ' + newAlign + ' margin="0pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="' + parseInt(sizeFactor * 8) + '">';
			}
			
			var parceltotal = parseInt(soRecord.getFieldValue('custbody_labelparcels'));
			var weight = parseFloat(soRecord.getFieldValue('custbody_labeltotalweight'));
			var trueWeight = parseFloat(soRecord.getFieldValue('custbody_trueweight'));
			if (trueWeight == null || trueWeight == '' || isNaN(trueWeight))
				trueWeight = weight;
				
			var service = soRecord.getFieldValue('custbody_labelservice');

			var volumed = soRecord.getFieldValue('custbody_usevolumetric');
			if (volumed == 'T'){
				volumed = "TRUE";
			} else {
				volumed = "FALSE";
			}

			var security = soRecord.getFieldValue('custbody_apcsecurity');
			if (security == 'T'){
				security = "TRUE";
			} else {
				security = "FALSE";
			}
			
			var insured = soRecord.getFieldValue('custbody_insurancerequired');
			var insuredAmount = 0.00;
			if (insured == 'T'){
				insured = "TRUE";
				insuredAmount = parseFloat(soRecord.getFieldValue('custbody_insuranceamount'));
			} else {
				insured = "FALSE";
			}
			
			var fragile = soRecord.getFieldValue('custbody_fragile');
			if (fragile == 'T'){
				fragile = "TRUE";
			} else {
				fragile = "FALSE";
			}
			
			var senddepot = soRecord.getFieldValue('custbody_sendingdepot');
			var reqdepot = soRecord.getFieldValue('custbody_requestingdepot');
			var deldepot = soRecord.getFieldValue('custbody_receivingdepot');

			var deldepotbarcode = deldepot;
            if (parseInt(deldepotbarcode) < 10) {
            	deldepotbarcode = '00' + parseInt(deldepotbarcode);
            } //if			
            if (parseInt(deldepotbarcode) >= 10 && parseInt(deldepotbarcode) < 100) {
            	deldepotbarcode = '0' + parseInt(deldepotbarcode);
            } //if

			var hubroute = getDepotRegionLookup(senddepot, true);
			
			if (lastLabelPrinted == null || lastLabelPrinted == ''|| lastLabelPrinted == parceltotal)
				lastLabelPrinted = 0;

			var identifier = soRecord.getFieldValue('custbody_identifier');
            var barcode = soRecord.getFieldValue('custbody_labelbarcode');
            var barcodestandard = 'IDAutomation';
            var parceltext = ''; // this will store the parcel suffix for each barcode printed
            var consignmentnumber = soRecord.getFieldValue('tranid');

            var isValidBarcode = true;
            if (barcode != null && barcode != '') {
                if (barcode.indexOf(consignmentnumber) < 0) { // Do not match so make anew
                    isValidBarcode = false;
                }
            }
            else { // No barcode so make one
                isValidBarcode = false;
            }
            if (!isValidBarcode) {
                var Externalnumber = soRecord.getFieldValue('externalid');
                if (Externalnumber != null && Externalnumber != '') {
                    var Externalarray = Externalnumber.split(':');
                    if (Externalarray.length > 1) {
                        Externalnumber = Externalarray[1];
                        //if (parseInt(soRecord.getFieldValue('class')) == 9) 
                        consignmentnumber = Externalnumber;
                        //leadingZero = "";
                    }
                }
                
                //create barcode
                var barcode = reqdepot;
                if (parseInt(barcode) < 10) {
                    barcode = '00' + parseInt(barcode);
                } //if			
                if (parseInt(barcode) >= 10 && parseInt(barcode) < 100) {
                    barcode = '0' + parseInt(barcode);
                } //if

                //barcode = barcodeDepot;
                barcode += soRecord.getFieldValue('custbody_apccustomerid');
                barcode += consignmentnumber;
                
            }
			            
			var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact')); 
			var pickupContactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupcontact')); 
			var companyname = '';
			var companyref = '';
			if (displayConsignor) {
				companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
			 	companyref = nlapiEscapeXML(soRecord.getFieldText('entity'));
			}
			var v2consignorRef = companyname;
			if (LabelVersion != 3){
				if (v2consignorRef != '')
					v2consignorRef += ' / ';
				v2consignorRef += companyref;
			}
			
			var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
			var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
			var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
			var addr1 = removeBadText(soRecord.getFieldValue('custbody_deliveryaddr1'));
			//var addr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
			//	if (addr1 != null && addr1 != '') addr1 = addr1.replace('n/a','');
			var addr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
				if (addr2 != null && addr2 != '') addr2 = addr2.replace('n/a','');
			var addr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
				if (addr3 != null && addr3 != '') addr3 = addr3.replace('n/a','');
			var addr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));
				if (addr4 != null && addr4 != '') addr4 = addr4.replace('n/a','');
				//Pickup Address
			var pickupAddr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr1'));
					if (pickupAddr1 != null && pickupAddr1 != '') pickupAddr1 = pickupAddr1.replace('n/a','');
			var pickupAddr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr2'));
					if (pickupAddr2 != null && pickupAddr2 != '') pickupAddr2 = pickupAddr2.replace('n/a','');
			var pickupAddr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr3'));
					if (pickupAddr3 != null && pickupAddr3 != '') pickupAddr3 = pickupAddr3.replace('n/a','');
			var pickupAddr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr4'));
					if (pickupAddr4 != null && pickupAddr4 != '') pickupAddr4 = pickupAddr4.replace('n/a','');
			
			var user = nlapiGetContext().getUser();
			var identity = '';
			if (nlapiGetContext().getExecutionContext() == 'suitelet') {
				if (!isCustomerCenter()) {
					var userRecord = nlapiLoadRecord('employee', user);
					identity = userRecord.getFieldValue('firstname') + ' ' + userRecord.getFieldValue('lastname');
				}
				else {
					var userRecord = nlapiLoadRecord('customer', user);
					identity = userRecord.getFieldValue('companyname');
					if (userRecord.getFieldValue('custentity_use_login_menu') == 'T')
						mainMenu = true;
				}
			} else {
				identity = 'Bulk Print';
			}
			
			var now = new Date();
			var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
			if (nowHours >= 24) 
				nowHours -= 24;
			if (now.getMonth() >= 3 || now.getMonth() <= 10) 
				nowHours += 1; //Daylight savings approximation!
			var identDT = identity + ' - ' + nlapiDateToString(now, 'date') + ' ' + nowHours + ':' + now.getMinutes() + ':' + now.getSeconds();
			if (bulkPrint) 
				identDT += " " + soRecLabel;
			
			var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode'));
			var pickupPostcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddresspostcode'));
			var postcode2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode2'));
			if (postcode2 != null) 
				postcode = postcode2; //Override normal postcode e.g. RD1, RD2, etc.
			var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
			if (telephone != null && telephone != '')
				telephone = telephone.replace('n/a','');
			var pickupTelephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickuptelno'));
			if (pickupTelephone != null && pickupTelephone != '')
				pickupTelephone = pickupTelephone.replace('n/a','');
			var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
			if (delname == null) 
				delname = companyname;
			var specins = nlapiEscapeXML(soRecord.getFieldValue('custbody_specialinstructions'));
			if (specins != null && specins != '')
				specins = specins.replace('n/a','');
			var refno = nlapiEscapeXML(soRecord.getFieldValue('custbody_otherrefnum'));
			if (refno == null || refno == '')
				refno = nlapiEscapeXML(soRecord.getFieldValue('otherrefnum'));
			var recStatus = soRecord.getFieldValue('custbody_consignmentstatus');
			
			var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_parceldeliveryzone'));
			if (parceldelzone == null || parceldelzone == '') {
				parceldelzone = getPostCodeLookupValue(postcode, 'parcelzone');
				soRecord.setFieldValue('custbody_parceldeliveryzone', parceldelzone);
			}

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
			if (pickupAddr1 == null) 
				pickupAddr1 = '';
			if (pickupAddr2 == null) 
				pickupAddr2 = '';
			if (pickupAddr3 == null) 
				pickupAddr3 = '';
			if (pickupAddr4 == null) 
				pickupAddr4 = '';
			if (contactname == null) 
				contactname = '';
			if (telephone == null) 
				telephone = '';
			
			var fswfontSize = 22;
			var fswbrtag = "<br />";
			if (fswflag == null) {
				// See if a timed delivery service and set 'P' for sfwflag
				if (service.search('07') > 0 || service.search('09') > 0 || service.search('10') > 0 || service.search('12') > 0) {
					fswflag = 'P';
				}
				else {
					if (service.search('NC') > 0) {
						fswflag = 'W';
					}
					else {
						fswflag = ' ';
					}
				}
			}
			
			var fswLabelV2 = '<table style="margin: 0pt; padding: 0pt;" width="100%"><tr><td class="zonedepot" style="vertical-align:middle; width:' + parseInt(sizeFactor * 26) + 'mm; height:' + parseInt(sizeFactor * 18) + 'mm;">' + parceldelzone + '</td></tr></table>';
			if (fswflag == ' ') {
				fswfontSize = 36;
				fswbrtag = "";
			} else {
				fswLabelV2 = '<table style="margin: 0pt; padding: 0pt;" width="100%"><tr><td rowspan="2" class="zonedepot2" style="vertical-align:top; width:' + parseInt(sizeFactor * 13) + 'mm; height:' + parseInt(sizeFactor * 18) + 'mm;">' + fswflag + '</td><td style="vertical-align:bottom; width:' + parseInt(sizeFactor * 13) + 'mm; height:' + parseInt(sizeFactor * 8) + 'mm;"></td></tr><tr><td vertical-align="bottom" class="zonedepot2" style="vertical-align:bottom; width:' + parseInt(sizeFactor * 13) + 'mm; height:' + parseInt(sizeFactor * 10) + 'mm;">' + parceldelzone + '</td></tr></table>';
			}
						
			var useParcelList = soRecord.getFieldValue('custbody_parcellist_printgroups');
			var parcelListArray = new Array(parceltotal); // to store custom values for average weight / reference
			var parcelListHTML = "";

			if (useParcelList == 'T') {
				// Now load the parcel list custom records for this consignment - optional if they exist
				var parcelListSearchFilters = new Array();
				var parcelListSearchColumns = new Array();
				
				parcelListSearchFilters[0] = new nlobjSearchFilter('custrecord_parcellist_consignment_lookup', null, 'is', soRecordId);
				parcelListSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
				
				parcelListSearchColumns[0] = new nlobjSearchColumn('custrecord_parcellist_consignment_lookup');
				parcelListSearchColumns[1] = new nlobjSearchColumn('custrecord_parcellist_parcels');
				parcelListSearchColumns[2] = new nlobjSearchColumn('custrecord_parcellist_weight');
				parcelListSearchColumns[3] = new nlobjSearchColumn('custrecord_parcellist_reference');
				
				var parcelListSearchResults = nlapiSearchRecord('customrecord_parcelconsignmentlist', null, parcelListSearchFilters, parcelListSearchColumns);
				var parcelListCounter = 0;
				if (parcelListSearchResults) {
					parcelListHTML += "<table width='100%'><tr><td>Parcel Ref. No.</td></tr>";
					for (var listNo = 0; listNo < parcelListSearchResults.length; listNo++) {
						var listnotes = nlapiEscapeXML(parcelListSearchResults[listNo].getValue(parcelListSearchColumns[3]));
						var listtotal = parseInt(parcelListSearchResults[listNo].getValue(parcelListSearchColumns[1]));
						var listweight = parseFloat(parcelListSearchResults[listNo].getValue(parcelListSearchColumns[2]) / listtotal); // Average weight per parcel
						parcelListHTML += "<tr><td>" + listnotes + "</td></tr>";
						for (var pl = 0; pl < listtotal; pl++) {
							if (parcelListCounter < parceltotal) {
								parcelListArray[parcelListCounter] = new Array(2);
								parcelListArray[parcelListCounter][0] = listweight.toFixed(1);
								parcelListArray[parcelListCounter][1] = listnotes;
								parcelListCounter++;
							}
						}
					}
					parcelListHTML += "</table>";
				}
			}
						
			var consUUID = '';
            var parcelCounter = 0;			
			var totalLabels = (parceltotal-lastLabelPrinted) * CopiesPerLabel;
			//for (var i = 1; i <= parceltotal; i++) {
			for (var i = (parseInt(lastLabelPrinted)+1); i <= parceltotal; i++) {
				
				parcelCounter++;
				
				var labelRefno = refno;
				if (parcelListHTML != ""){
					labelRefno = "";
				}
				
				var v2ContactRef = contactname;
				if (labelRefno != ''){
					if (v2ContactRef != '')
						v2ContactRef += " / ";
					v2ContactRef += labelRefno;
				}
				
				//labelCounter++;
				var rotateHTML = "";
				if (alternateOrientation && (labelCounter % 2 == 1)) 
					rotateHTML = " rotate=\"180\" ";
				
				if (i < 10) {
					parceltext = '00' + i;
				} //if
				else 
					if (i < 100) {
						parceltext = '0' + i;
					} //else if
				var thisNo = i;
                for (var printTwice = 0; printTwice < CopiesPerLabel; printTwice++) {
                    labelCounter++;
				var labelhtml = '';
				//--------- HTML output start	
				if (LabelVersion == 3) {
				    labelhtml += '<table ' + rotateHTML + ' align="right" style="table-layout:fixed;font-family: Sans-Serif; text-align:right; vertical-align:middle;margin: 0pt; padding: 0pt;" cellpadding="0">';
				    // ROW 1 - START - Logo | Barcode | Depots panel | Delivery
					// depot barcode
				    labelhtml += ' <tr id="row1"><td style="width: ' + parseInt(sizeFactor * 203) + 'mm;" height="100%">';
                    labelhtml += '  <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" cellmargin="0" cellpadding="0"><tr>';
  				    labelhtml += '  <td align="center" id="row1col2"><table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;"><tr><td align="center" style="width: ' + parseInt(sizeFactor * 103) + 'mm; height: ' + parseInt(sizeFactor * 25) + 'mm"><img src="http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + (barcode + parceltext) + '&amp;W=' + parseInt(sizeFactor * 210) + '&amp;BH=' + parseFloat(sizeFactor * 2.3) + '&amp;TM=0.0&amp;LM=0.15&amp;CS=0&amp;ST=F" /></td></tr>';
  					labelhtml += '    <tr><td class="apcmedium" align="center" style="width: ' + parseInt(sizeFactor * 103) + 'mm; height: ' + parseInt(sizeFactor * 4) + 'mm"><b>' + (barcode + parceltext) + '</b></td></tr>';
                    labelhtml += '  </table></td>'; // Row 1 Col 2
                    labelhtml += '  <td id="row1col3" style="width: ' + parseInt(sizeFactor * 36) + 'mm; height=100%">';
                    labelhtml += '    <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt; border:1px solid black;" width="' + parseInt(sizeFactor * 35) + 'mm" cellpadding="0">';
                    labelhtml += '     <tr>';
                    labelhtml += '      <td class="lineright" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '       <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '        <tr><td align="center" class="depotpaneldesc" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 3) + 'mm;">Send</td></tr>';
                    labelhtml += '        <tr><td align="right" class="depotPanel" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;"><b>' + parseInt(senddepot * 1) + '</b></td></tr>';
                    labelhtml += '       </table>';
                    labelhtml += '      </td><td width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '       <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '        <tr><td align="center" class="depotpaneldesc" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 3) + 'mm;">Request</td></tr>';
                    labelhtml += '        <tr><td align="right" class="depotPanel" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;">' + parseInt(reqdepot * 1) + '</td></tr>';
                    labelhtml += '       </table>';
                    labelhtml += '      </td>';
                    labelhtml += '     </tr>';
                    labelhtml += '     <tr>';
                    labelhtml += '      <td class="lineright" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '       <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '        <tr><td align="center" class="depotpaneldesc" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 3) + 'mm;">Item</td></tr>';
                    labelhtml += '        <tr><td  align="center" class="depotPanel" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;">' + thisNo + '</td></tr>';
                    labelhtml += '       </table>';
                    labelhtml += '      </td><td width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '       <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 18) + 'mm">';
                    labelhtml += '        <tr><td align="center" class="depotpaneldesc" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 3) + 'mm;">of</td></tr>';
                    labelhtml += '        <tr><td align="right" class="depotPanel" style="width: ' + parseInt(sizeFactor * 18) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;">' + parceltotal + '</td></tr>';
                    labelhtml += '       </table>';
                    labelhtml += '      </td>';
                    labelhtml += '     </tr>';
                    labelhtml += '     <tr>';
                    labelhtml += '      <td width="' + parseInt(sizeFactor * 36) + 'mm" colspan="2" style="border-width:0px;">';
                    labelhtml += '       <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="100%">';
                    labelhtml += '        <tr><td align="center" class="depotpaneldesc" style="height: ' + parseInt(sizeFactor * 3) + 'mm;">Weight</td></tr>';
                    labelhtml += '        <tr><td align="right" class="depotPanel" style="height: ' + parseInt(sizeFactor * 12) + 'mm;">' + weight.toFixed(2) + '</td></tr>';
                    labelhtml += '       </table>';
                    labelhtml += '      </td>';
                    labelhtml += '     </tr>';
                    labelhtml += '    </table>'; 
                    labelhtml += '  </td>'; // Row 1 Col 3
				    labelhtml += '  <td id="row1col4" style="width: ' + parseInt(sizeFactor * 64) + 'mm; height: ' + parseInt(sizeFactor * 30) + 'mm;" align="center"><img src="' +  nlapiEscapeXML(logoURL) + '" width="' + parseInt(sizeFactor * 121) + '" height="' + parseInt(sizeFactor * 98) + '" /></td>'; // Row
																																																																													// 1
																																																																													// Col
																																																																													// 4
                    labelhtml += ' </tr></table></td></tr>'; // Row 1
				    // ROW 2 - START
                    labelhtml += ' <tr><td class="linetop">'; // Row
																			// 2
                    labelhtml += '  <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" cellmargin="0" cellpadding="0"><tr>';
                    labelhtml += '     <td class="lineright" width="' + parseInt(sizeFactor * 70) + 'mm">';
                    labelhtml += '      <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 70) + 'mm" cellmargin="0" cellpadding="0">';
                    labelhtml += '        <tr><td><table width="100%"><tr><td class="apcv2labeldesc" style="width: ' + parseInt(sizeFactor * 20) + 'mm; height: 3mm;text-align: left;">Con number</td><td style="width: ' + parseInt(sizeFactor * 50) + 'mm;"> </td></tr>';                    
                    labelhtml += '        <tr><td id="ConsignmentNo" colspan="2" align="center" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 8) + 'mm;text-align: center;">' + consignmentnumber + '</td></tr></table></td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails linetop" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;">' + delname.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;">' + addr1.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;">' + addr2.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;">' + addr3.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;">' + addr4.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;"> </td></tr>';                    
                    labelhtml += '        <tr><td font-stretch="condensed" id="postcode" style="width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 18) + 'mm;text-align: right;"><b>' + postcode + '</b></td></tr>';                    
                    labelhtml += '      </table>';
                    labelhtml += '     </td>'; // Row 2 Col 1
                    labelhtml += '     <td width="' + parseInt(sizeFactor * 133) + 'mm"> '; // Row
                    labelhtml += '      <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 133) + 'mm" cellmargin="0" cellpadding="0">';
                    labelhtml += '        <tr><td colspan="2" align="right" font-stretch="condensed" style="width: ' + parseInt(sizeFactor * 133) + 'mm;" height="' + parseInt(sizeFactor * 15) + 'mm">';
                    labelhtml += '          <table style="table-layout: fixed; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 133) + 'mm" cellmargin="0" cellpadding="1mm">';
                    labelhtml += '           <tr><td align="right" font-stretch="condensed" style="width: ' + parseInt(sizeFactor * 30) + 'mm; background-color:White;">' + fswLabelV2 + '</td><td class="zonedepot lineright" align="center" style="width: ' + parseInt(sizeFactor * 50) + 'mm;padding-top: 5px;" font-stretch="condensed"><b>' + parseInt(deldepot * 1) + '</b></td><td id="service" align="center" style="width: ' + parseInt(sizeFactor * 53) + 'mm;">' + service + '</td></tr>';
                    labelhtml += '          </table>';
                    labelhtml += '        </td></tr>';
                    labelhtml += '        <tr><td class="lineright linetop" style="width: ' + parseInt(sizeFactor * 60) + 'mm;">'; // Subrow
                    labelhtml += '          <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="100%">';
                    labelhtml += '           <tr><td class="apcv2labeldesc" style="width: ' + parseInt(sizeFactor * 60) + 'mm; height: 2mm;text-align: left;">' + identDT + '</td></tr>';
                    labelhtml += '           <tr><td class="consignordetails" align="center" style="width: ' + parseInt(sizeFactor * 60) + 'mm; height: ' + parseInt(sizeFactor * 40) + 'mm;text-align: center;"><img align="center" src="http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + deldepotbarcode + '&amp;W=' + parseInt(sizeFactor * 500) + '&amp;BH=' + parseFloat(sizeFactor * 2.5).toFixed(2) + '&amp;TM=0.0&amp;LM=0.15&amp;CS=0&amp;ST=F" style="width: ' + parseInt(sizeFactor * 54) + 'mm" /></td></tr>';                    
                    labelhtml += '          </table>';
                    labelhtml += '      </td><td class="linetop" style="width: ' + parseInt(sizeFactor * 73) + 'mm;">'; // Right
                    labelhtml += '          <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" width="' + parseInt(sizeFactor * 73) + 'mm" height="100%" cellmargin="0" cellpadding="0">';
                    labelhtml += '           <tr><td><table width="100%"><tr><td class="apcv2labeldesc"  style="width: ' + parseInt(sizeFactor * 40) + 'mm; height: 2mm;text-align: left;">Consignor / Account</td><td style="width: ' + parseInt(sizeFactor * 33) + 'mm;"> </td></tr>';                    
                    labelhtml += '           <tr><td class="consignordetails" colspan="2" align="left" style="width: ' + parseInt(sizeFactor * 73) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;text-align: left;">' + v2consignorRef.slice(0, 30) + '</td></tr>';                    
                    labelhtml += '           <tr><td class="consignordetails" align="left" style="width: ' + parseInt(sizeFactor * 53) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;text-align: left;">' + v2consignorRef.slice(30, 45) + '</td>';                    
                    labelhtml += '           <td class="consignordetails" align="right" style="width: ' + parseInt(sizeFactor * 20) + 'mm; height: ' + parseInt(sizeFactor * 5) + 'mm;text-align: right;">' + companyref + '</td></tr></table></td></tr>';                    
                    labelhtml += '           <tr><td class="linetop"><table width="100%"><tr><td class="apcv2labeldesc"  style="width: ' + parseInt(sizeFactor * 30) + 'mm; height: 2mm;text-align: left;">FAO / Ref</td><td style="width: ' + parseInt(sizeFactor * 43) + 'mm;"> </td></tr>';                    
                    labelhtml += '           <tr><td class="consignordetails" colspan="2" align="left" style="width: ' + parseInt(sizeFactor * 73) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;text-align: left;">' + v2ContactRef + '</td></tr></table></td></tr>';                    
                    labelhtml += '           <tr><td class="linetop"><table width="100%"><tr><td class="apcv2labeldesc"  style="width: ' + parseInt(sizeFactor * 30) + 'mm; height: 2mm;text-align: left;">Delivery Tel</td><td style="width: ' + parseInt(sizeFactor * 43) + 'mm;"> </td></tr>';                    
                    labelhtml += '           <tr><td class="consignordetails" colspan="2" align="left" style="width: ' + parseInt(sizeFactor * 73) + 'mm; height: ' + parseInt(sizeFactor * 6) + 'mm;text-align: left;">' + telephone + '</td></tr></table></td></tr>';                    
                    labelhtml += '          </table>';
                    labelhtml += '         </td></tr>';
                    labelhtml += '         </table>';
                    labelhtml += '     </td>'; // Row 2 Col 2
                    labelhtml += '  </tr></table>';
                    labelhtml += ' </td></tr>'; // Row 2
				    // ROW 3 - START
                    labelhtml += ' <tr><td class="linetop">'; // Row
                    labelhtml += '  <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;" cellmargin="0" cellpadding="0" height="' + parseInt(sizeFactor * 8) + 'mm"><tr>';
                    labelhtml += '     <td class="lineright" width="' + parseInt(sizeFactor * 70) + 'mm">';
                    labelhtml += '        <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;"><tr><td class="apcv2labeldesc"  style="width: ' + parseInt(sizeFactor * 20) + 'mm; height: 3mm;text-align: left;">Send date</td><td style="width: ' + parseInt(sizeFactor * 50) + 'mm;"> </td></tr>';                    
                    labelhtml += '        <tr><td id="condate" colspan="2" align="center" style="width: ' + parseInt(sizeFactor * 70) + 'mm; text-align: right;">' + trandate + '</td></tr></table>';
                    labelhtml += '     </td>'; // Row 3 Col 1
                    labelhtml += '     <td width="' + parseInt(sizeFactor * 133) + 'mm">';
                    labelhtml += '        <table style="table-layout: fixed; vertical-align: top; margin: 0pt; padding: 0pt;"><tr><td class="apcv2labeldesc"  style="width: ' + parseInt(sizeFactor * 35) + 'mm; height: 3mm;text-align: left;">Special instructions</td><td style="width: ' + parseInt(sizeFactor * 98) + 'mm;"> </td></tr>';                    
                    labelhtml += '        <tr><td class="consignordetails" colspan="2" style="width: ' + parseInt(sizeFactor * 133) + 'mm; text-align: left;">' + specins + '</td></tr></table>';
                    labelhtml += '     </td>'; // Row 3 Col 2
                    labelhtml += '  </tr></table>';
                    labelhtml += ' </td></tr>'; // Row 3
                    labelhtml += '</table>'; // Main outer
				} else {				//--------------- Barcode / Con No. / Items Section ----------------
				labelhtml += '<table ' + rotateHTML + ' style="table-layout:fixed;font-family: Sans-Serif; vertical-align: middle;margin: 0pt; padding: 0pt;">';
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + '" rowspan="2" style="width: ' + parseInt(sizeFactor * 70) + 'mm;height:' + parseInt(sizeFactor * 24) + 'mm;background-image:url(http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + (barcode + parceltext) + '&amp;W=' + parseInt(sizeFactor * 240) + '&amp;BH=2.4&amp;TM=0.0&amp;LM=0.15&amp;CS=0&amp;ST=F);background-repeat:no-repeat;">';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" colspan="2" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Con Number</span>';
				labelhtml += '    <br /><span class="apcmedium" align="left" style="width: ' + parseInt(sizeFactor * 32) + 'mm;"><b>' + consignmentnumber + '</b></span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Item</span>';
				labelhtml += '    <br /><span class="apcmedium">' + thisNo + '</span>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">of</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parceltotal + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				//--------------- Address Section / Depots / Weight / Service ----------------
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" rowspan="3" style="vertical-align: top;width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 47) + 'mm;">';
				labelhtml += '  <table>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Destination</span></td><td style="font-size:' + parseInt(sizeFactor * 12) + 'pt;text-align:center;"><span style="font-size:' + parseInt(sizeFactor * 10) + 'pt;"><b>' + (barcode + parceltext) + '</b></span></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + delname.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr1.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr2.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr3.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr4.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="postcode"><b>' + postcode + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Send</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parseInt(senddepot * 1) + '</span>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Request</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parseInt(reqdepot * 1) + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td colspan="2" class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Weight</span>';
				labelhtml += '    <br /><br /><span class="apcmedium">' + weight.toFixed(2) + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td colspan="2" class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 23) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Service</span>';
				labelhtml += '    <br /><br /><span class="apclarge">' + service + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				//--------------- Consignor Section / Date ----------------
				labelhtml += '<tr>';
				labelhtml += '<td colspan="3" class="linebottom' + offStyle + '" style="vertical-align:top;width:' + parseInt(sizeFactor * 102) + 'mm;height:' + parseInt(sizeFactor * 22) + 'mm;">';
				labelhtml += '  <table>';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="width:20mm;"><span class="title' + offStyle + '">Consignor</span></td><td class="consigneeline" style="width:' + parseInt(sizeFactor * 47) + 'mm;"><b>' + companyname + '</b></td><td style="width:' + parseInt(sizeFactor * 35) + 'mm;" class="consigneeline" align="right"><b>' + companyref + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Senders Ref.</span></td><td colspan="2" class="consigneeline"><b>' + labelRefno + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Special Ins.</span></td><td colspan="2" class="consigneeline"><b>' + specins + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">F. A. O.</span></td><td  class="consigneeline"><b>' + contactname + '</b></td><td rowspan="2"><table align="right"><tr><td class="dateblock">' + trandate + '</td></tr></table></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Telephone</span></td><td class="consigneeline"><b>' + telephone + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += ' </td>';
				labelhtml += '</tr>';
				//--------------- Delivery Depot / Area / Logo ----------------
				labelhtml += '<tr>';
				labelhtml += '<td colspan="3" style="vertical-align: top;width: ' + parseInt(sizeFactor * 102) + 'mm; height: ' + parseInt(sizeFactor * 27) + 'mm;">';
				labelhtml += '  <table style="table-layout:fixed;">';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="width:' + parseInt(sizeFactor * 18) + 'mm;"><span class="title' + offStyle + '">Delivery Depot</span></td><td rowspan="2" class="lineright' + offStyle + '" style="width:' + parseInt(sizeFactor * 40) + 'mm;"><span class="apcsmall">' + hubroute + '</span><br /><span class="apcextralarge"><b>' + parseInt(deldepot * 1) + '</b></span></td><td rowspan="3" style="width:' + parseInt(sizeFactor * 44) + 'mm;text-align:right;"><img src="' + nlapiEscapeXML(logoURL) + '" style="width:' + parseInt(sizeFactor * 40) + 'mm;height:' + parseInt(sizeFactor * 20) + 'mm;"  /></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="font-size:' + fswfontSize + 'pt;"><b>' + fswflag + fswbrtag + parceldelzone + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="lineright' + offStyle + '"><table><tr><td class="identblock" style="font-size:' + parseInt(sizeFactor * 6) + 'pt;width:' + parseInt(sizeFactor * 60) + 'mm;">' + identDT + '</td></tr></table></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += ' </td>';
				labelhtml += '</tr>';
				//--------------- List of parcel details if present ----------------
				if (parcelListHTML != ""){
					labelhtml += '<tr>';
					labelhtml += ' <td class="linetop" colspan="3" style="vertical-align: top;">';
					labelhtml += parcelListHTML;
					labelhtml += ' </td>';
					labelhtml += '</tr>';					
				}
				labelhtml += '</table>';
				//--------- HTML output end
				}
				//pdfxml += labelhtml;
				labelPageshtml[labelCounter - 1] = labelhtml; // Add this page to the array
                } // No. of copies per label
			} //for	labels in a consignment         
			// Set to printed status if entered
			var backtoConsignmentManager = false;
			if (recStatus == '1') {
				if (soRecord.getFieldValue('custbody_printonsubmit') == 'T') 
					backtoConsignmentManager = true;
				soRecord.setFieldValue('custbody_consignmentstatus', '2');
				soRecord.setFieldValue('custbody_printonsubmit', 'F');
			}
			
			// Print counter added Jan 2012 for audit purposes
			var printCount = 0;
			if (soRecord.getFieldValue('custbody_labelprintcount') != null) 
				printCount = parseInt(soRecord.getFieldValue('custbody_labelprintcount'));
			printCount++;
			soRecord.setFieldValue('custbody_labelprintcount', printCount);
			soRecord.setFieldValue('custbody_lastlabelprinted', parceltotal);
			var internalid = nlapiSubmitRecord(soRecord, false, true);
			
		} //if
		else {
			var errormsg = "<HTML><body>Error: You must save the consignment before printing the label.</body></html>";
			response.write(errormsg);
		}
	} //for all consignments - assembly of html / pdf complete
	
	/*
	// Output the html array of labels to pdf document with pagination as needed
	for (var label = 1; label <= labelPageshtml.length; label++) {
		var pageIndex = label % labelsPerPage; // Modulo gives if first (1) or last (0) on page
		if (pageIndex == 1 || label == 1 || labelsPerPage == 1) //Build start table structure 
			//pdfxml += '<table vertical-align="middle" cellpadding="2mm"><tr>';
			pdfxml += '<table style="' + labelAlignment + '" cellpadding="2mm"><tr>';
		
		var labeltdwidth = (labelWidth / labelsPerPage).toFixed(0);
		pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;">' + labelPageshtml[label - 1] + '</td>';
		
		if (pageIndex == 0 || label == labelPageshtml.length || labelsPerPage == 1) { //Build end table structure
			for (var rowPad = (labelsPerPage - pageIndex); rowPad < labelsPerPage; rowPad++) 
				pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;vertical-align:middle;"></td>';
			pdfxml += '</tr></table>';
		}
		
		if (label > 1 && pageIndex == 0 && label != labelPageshtml.length) // Throw a new page if needed
			pdfxml += '<pbr background-color="white" />';
	}
	*/
	
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
		
	if (outputType == 'html') {
		response.write(pdfxml);
	}
	else {
		var file = nlapiXMLToPDF(pdfxml);
		if (bulkPrint) {
			//file.setFolder(14); // Label PDFs
			file.setFolder(1014); // Label PDFs
			file.setName(bulkprintfilename + '.pdf');
			var fileID = nlapiSubmitFile(file);
			//soRecord.setFieldValue('custbody_labefilelpdf', fileID);
		}
		else {
			response.setContentType('PDF', 'label.pdf');
			response.write(file.getValue());
		}
	}
	nlapiLogExecution('AUDIT', 'USAGE', "PROCESSED:" + soRecords.length + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());
    //if (mainMenu) {
    //	var params = new Array();
    //    nlapiSetRedirectURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login', false, params);
    //}
} //function

function labelPrinterV2(request, response, bulkprintcids, bulkprintfilename, labeldimensionid){
	// Modified July 4-6th 2011 to  use CSS & div layers so grid lines can be applied.
	// Modified March 23rd to accept multiple print requests via 'custparam_cids' if present
	// ... else defaults to 'custparam_cid' as a single job as previously.
	// modified October 2011 to use custom records to define printer layout settings
	
	var bulkPrint = false;
	var soRecords = new Array;
	if (bulkprintcids != null && bulkprintcids != '') {
		soRecords = bulkprintcids.split(',');
		bulkPrint = true;
	}
	else {
		if (request.getParameter('custparam_cids') != null && request.getParameter('custparam_cids') != '') {
			soRecords = request.getParameter('custparam_cids').split(',');
		}
		else {
			soRecords[0] = request.getParameter('custparam_cid');
		}
	}
	
	var outputType = 'pdf';
	if (!bulkPrint) {
		if (request.getParameter('custparam_outputtype') != null && request.getParameter('custparam_outputtype') != '') 
			outputType = request.getParameter('custparam_outputtype');
	}
	
	nlapiLogExecution('AUDIT', 'START? ' + bulkPrint, "TO PROCESS:"+ soRecords.length + " : bulkprintfilename:" + bulkprintfilename + " : labeldimensionid:" + labeldimensionid + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());

	var labelCounter = 0; //Used for odd /even counter if alternating orientation
	var labelPageshtml = new Array; // Store pages in array for layout after compiling
	// Process each consignment in the list
	for (var soRec = 0; soRec < soRecords.length; soRec++) {
		var soRecordId = soRecords[soRec];
		var soRecLabel = '';
		if (bulkPrint) soRecLabel = bulkprintfilename.substring(bulkprintfilename.length-1) + ":" + (soRec + 1) + "/" + soRecords.length;
		if (soRecordId) {
			var soRecord = nlapiLoadRecord('salesorder', soRecordId);
			
			var labelDimension = soRecord.getFieldValue('custbody_labeldimension');
			if (bulkPrint && labeldimensionid) 
				labelDimension = labeldimensionid;
			//Lookup parameters for the label type used and set them here
			var labelRecord = nlapiLoadRecord('customrecord_labeldimension', labelDimension);
			nlapiLogExecution('AUDIT', 'START :' + soRec, " PROCESS:"+ soRecordId + " : bulkprintfilename:" + bulkprintfilename + " : labeldimensionid:" + labeldimensionid + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());
			var labelHeight = labelRecord.getFieldValue('custrecord_labelheight');
			var labelWidth = labelRecord.getFieldValue('custrecord_labelwidth');
			var labelAlignment = labelRecord.getFieldValue('custrecord_labelalignment');
			if (labelAlignment == null) 
				labelAlignment = '';
			var sizeFactor = parseFloat(labelRecord.getFieldValue('custrecord_labelscalingfactor'));
			
			var labelsPerPage = parseInt(labelRecord.getFieldValue('custrecord_labelsperpage'));
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
				pdfxml += '<body width=\"' + labelWidth + 'mm\" height=\"' + labelHeight + 'mm\" margin="0pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="' + parseInt(sizeFactor * 8) + '">';
			}
			
			var parceltotal = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelparcels'));
			var weight = parseFloat(soRecord.getFieldValue('custbody_labeltotalweight'));
			var service = soRecord.getFieldValue('custbody_labelservice');
			var senddepot = soRecord.getFieldValue('custbody_sendingdepot');
			var reqdepot = soRecord.getFieldValue('custbody_requestingdepot');
			var deldepot = soRecord.getFieldValue('custbody_receivingdepot');
			var hubroute = getDepotRegionLookup(senddepot, true);
			
            var barcode = soRecord.getFieldValue('custbody_labelbarcode');
            var barcodestandard = 'IDAutomation';
            var parceltext = ''; // this will store the parcel suffix for each barcode printed
            var consignmentnumber = soRecord.getFieldValue('tranid');
            var isValidBarcode = true;
            if (barcode != null && barcode != '') {
                if (barcode.indexOf(consignmentnumber) < 0) { // Do not match so make anew
                    isValidBarcode = false;
                }
            }
            else { // No barcode so make one
                isValidBarcode = false;
            }
            if (!isValidBarcode) {
                var Externalnumber = soRecord.getFieldValue('externalid');
                if (Externalnumber != null && Externalnumber != '') {
                    var Externalarray = Externalnumber.split(':');
                    if (Externalarray.length > 1) {
                        Externalnumber = Externalarray[1];
                        //if (parseInt(soRecord.getFieldValue('class')) == 9) 
                        consignmentnumber = Externalnumber;
                        //leadingZero = "";
                    }
                }
                
                //create barcode
                var barcode = reqdepot;
                if (parseInt(barcode) < 10) {
                    barcode = '00' + parseInt(barcode);
                } //if			
                if (parseInt(barcode) >= 10 && parseInt(barcode) < 100) {
                    barcode = '0' + parseInt(barcode);
                } //if

                //barcode = barcodeDepot;
                barcode += soRecord.getFieldValue('custbody_apccustomerid');
                barcode += consignmentnumber;
                                
            }
			
			var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact'));
			var companyname = '';
			if (displayConsignor) 
				companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
			var companyref = nlapiEscapeXML(soRecord.getFieldText('entity'));
			var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
			var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
			var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
			var addr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
				if (addr1 != null && addr1 != '') addr1 = addr1.replace('n/a','');
			var addr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
				if (addr2 != null && addr2 != '') addr2 = addr2.replace('n/a','');
			var addr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
				if (addr3 != null && addr3 != '') addr3 = addr3.replace('n/a','');
			var addr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));
				if (addr4 != null && addr4 != '') addr4 = addr4.replace('n/a','');
			
			var user = nlapiGetContext().getUser();
			var identity = '';
			if (nlapiGetContext().getExecutionContext() == 'suitelet') {
				if (!isCustomerCenter()) {
					var userRecord = nlapiLoadRecord('employee', user);
					identity = userRecord.getFieldValue('firstname') + ' ' + userRecord.getFieldValue('lastname');
				}
				else {
					var userRecord = nlapiLoadRecord('customer', user);
					identity = userRecord.getFieldValue('companyname');
				}
			} else {
				identity = 'Bulk Print';
			}
			
			var now = new Date();
			var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
			if (nowHours >= 24) 
				nowHours -= 24;
			if (now.getMonth() >= 3 || now.getMonth() <= 10) 
				nowHours += 1; //Daylight savings approximation!
			var identDT = identity + ' - ' + nlapiDateToString(now, 'date') + ' ' + nowHours + ':' + now.getMinutes() + ':' + now.getSeconds();
			if (bulkPrint) 
				identDT += " " + soRecLabel;
			
			var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode'));
			var postcode2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode2'));
			if (postcode2 != null) 
				postcode = postcode2; //Override normal postcode e.g. RD1, RD2, etc.
			var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
			if (telephone != null && telephone != '')
				telephone = telephone.replace('n/a','');
			var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
			if (delname == null) 
				delname = companyname;
			var specins = nlapiEscapeXML(soRecord.getFieldValue('custbody_specialinstructions'));
			if (specins != null && specins != '')
				specins = specins.replace('n/a','');
			var refno = nlapiEscapeXML(soRecord.getFieldValue('otherrefnum'));
			var recStatus = soRecord.getFieldValue('custbody_consignmentstatus');
			
			var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_parceldeliveryzone'));
			if (parceldelzone == null || parceldelzone == '') {
				parceldelzone = getPostCodeLookupValue(postcode, 'parcelzone');
				soRecord.setFieldValue('custbody_parceldeliveryzone', parceldelzone);
			}

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
			
			var fswfontSize = 22;
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
				fswfontSize = 36;
				fswbrtag = "";
			}
			
			for (var i = 1; i <= parceltotal; i++) {
			
				labelCounter++;
				var rotateHTML = "";
				if (alternateOrientation && (labelCounter % 2 == 0)) 
					rotateHTML = " rotate=\"180\" ";
				
				if (i < 10) {
					parceltext = '00' + i;
				} //if
				else 
					if (i < 100) {
						parceltext = '0' + i;
					} //else if
				var thisNo = i;
				var labelhtml = '';
				//--------- HTML output start	
				//--------------- Barcode / Con No. / Items Section ----------------
				labelhtml += '<table ' + rotateHTML + ' style="table-layout:fixed;font-family: Sans-Serif; vertical-align: middle;margin: 0pt; padding: 0pt;">';
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + '" rowspan="2" style="width: ' + parseInt(sizeFactor * 70) + 'mm;height:' + parseInt(sizeFactor * 24) + 'mm;background-image:url(http://bcgen.com/img/52237-deltacomp-lin.aspx?Barcode=' + (barcode + parceltext) + '&amp;W=' + parseInt(sizeFactor * 240) + '&amp;BH=2.4&amp;TM=0.0&amp;LM=0.15&amp;CS=0&amp;ST=F);background-repeat:no-repeat;">';
				//labelhtml += '<td class="linebottom' + offStyle + '" rowspan="2" style="width: ' + parseInt(sizeFactor * 70) + 'mm;height:' + parseInt(sizeFactor * 24) + 'mm;background-image:url(http://www.bcgen.com/demo/linear-dbgs.aspx?Barcode=' + (barcode + parceltext) + '&amp;W=' + parseInt(sizeFactor * 240) + '&amp;BH=2.4&amp;TM=0.0&amp;LM=0.15&amp;CS=0&amp;ST=F);background-repeat:no-repeat;">';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" colspan="2" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 10) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Con Number</span>';
				labelhtml += '    <br /><span class="apcmedium" align="left" style="width: ' + parseInt(sizeFactor * 32) + 'mm;"><b>' + consignmentnumber + '</b></span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Item</span>';
				labelhtml += '    <br /><span class="apcmedium">' + thisNo + '</span>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">of</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parceltotal + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				//--------------- Address Section / Depots / Weight / Service ----------------
				labelhtml += '<tr>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" rowspan="3" style="vertical-align: top;width: ' + parseInt(sizeFactor * 70) + 'mm; height: ' + parseInt(sizeFactor * 47) + 'mm;">';
				labelhtml += '  <table>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Destination</span></td><td style="font-size:' + parseInt(sizeFactor * 12) + 'pt;text-align:center;"><span style="font-size:' + parseInt(sizeFactor * 10) + 'pt;"><b>' + (barcode + parceltext) + '</b></span></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + delname.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr1.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr2.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr3.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="addressline">' + addr4.slice(0, 30) + '</td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="postcode"><b>' + postcode + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + ' lineright' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Send</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parseInt(senddepot * 1) + '</span>';
				labelhtml += '</td>';
				labelhtml += '<td class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 16) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Request</span>';
				labelhtml += '    <br /><span class="apcmedium">' + parseInt(reqdepot * 1) + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td colspan="2" class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 12) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Weight</span>';
				labelhtml += '    <br /><br /><span class="apcmedium">' + weight.toFixed(2) + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				labelhtml += '<tr>';
				labelhtml += '<td colspan="2" class="linebottom' + offStyle + '" style="vertical-align: top;width: ' + parseInt(sizeFactor * 32) + 'mm; height: ' + parseInt(sizeFactor * 23) + 'mm;">';
				labelhtml += '    <span class="title' + offStyle + '">Service</span>';
				labelhtml += '    <br /><br /><span class="apclarge">' + service + '</span>';
				labelhtml += '</td>';
				labelhtml += '</tr>';
				//--------------- Consignor Section / Date ----------------
				labelhtml += '<tr>';
				labelhtml += '<td colspan="3" class="linebottom' + offStyle + '" style="vertical-align:top;width:' + parseInt(sizeFactor * 102) + 'mm;height:' + parseInt(sizeFactor * 22) + 'mm;">';
				labelhtml += '  <table>';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="width:20mm;"><span class="title' + offStyle + '">Consignor</span></td><td class="consigneeline" style="width:' + parseInt(sizeFactor * 47) + 'mm;"><b>' + companyname + '</b></td><td style="width:' + parseInt(sizeFactor * 35) + 'mm;" class="consigneeline" align="right"><b>' + companyref + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Senders Ref.</span></td><td colspan="2" class="consigneeline"><b>' + refno + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Special Ins.</span></td><td colspan="2" class="consigneeline"><b>' + specins + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">F. A. O.</span></td><td  class="consigneeline"><b>' + contactname + '</b></td><td rowspan="2"><table align="right"><tr><td class="dateblock">' + trandate + '</td></tr></table></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td><span class="title' + offStyle + '">Telephone</span></td><td class="consigneeline"><b>' + telephone + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += ' </td>';
				labelhtml += '</tr>';
				//--------------- Delivery Depot / Area / Logo ----------------
				labelhtml += '<tr>';
				labelhtml += '<td colspan="3" style="vertical-align: top;width: ' + parseInt(sizeFactor * 102) + 'mm; height: ' + parseInt(sizeFactor * 27) + 'mm;">';
				labelhtml += '  <table style="table-layout:fixed;">';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="width:' + parseInt(sizeFactor * 18) + 'mm;"><span class="title' + offStyle + '">Delivery Depot</span></td><td rowspan="2" class="lineright' + offStyle + '" style="width:' + parseInt(sizeFactor * 40) + 'mm;"><span class="apcsmall">' + hubroute + '</span><br /><span class="apcextralarge"><b>' + parseInt(deldepot * 1) + '</b></span></td><td rowspan="3" style="width:' + parseInt(sizeFactor * 44) + 'mm;text-align:right;"><img src="' + nlapiEscapeXML(logoURL) + '" style="width:' + parseInt(sizeFactor * 40) + 'mm;height:' + parseInt(sizeFactor * 20) + 'mm;"  /></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td style="font-size:' + fswfontSize + 'pt;"><b>' + fswflag + fswbrtag + parceldelzone + '</b></td>';
				labelhtml += '   </tr>';
				labelhtml += '   <tr>';
				labelhtml += '    <td colspan="2" class="lineright' + offStyle + '"><table><tr><td class="identblock" style="font-size:' + parseInt(sizeFactor * 6) + 'pt;width:' + parseInt(sizeFactor * 60) + 'mm;">' + identDT + '</td></tr></table></td>';
				labelhtml += '   </tr>';
				labelhtml += '  </table>';
				labelhtml += ' </td>';
				labelhtml += '</tr>';
				labelhtml += '</table>';
				//--------- HTML output end
				//pdfxml += labelhtml;
				labelPageshtml[labelCounter - 1] = labelhtml; // Add this page to the array
			} //for	labels in a consignment         
			// Set to printed status if entered
			var backtoConsignmentManager = false;
			if (recStatus == '1') {
				if (soRecord.getFieldValue('custbody_printonsubmit') == 'T') 
					backtoConsignmentManager = true;
				soRecord.setFieldValue('custbody_consignmentstatus', '2');
				soRecord.setFieldValue('custbody_printonsubmit', 'F');
			}
			
			// Print counter added Jan 2012 for audit purposes
			var printCount = 0;
			if (soRecord.getFieldValue('custbody_labelprintcount') != null) 
				printCount = parseInt(soRecord.getFieldValue('custbody_labelprintcount'));
			printCount++;
			soRecord.setFieldValue('custbody_labelprintcount', printCount);
			var internalid = nlapiSubmitRecord(soRecord, false, true);
			
		} //if
		else {
			var errormsg = "<HTML><body>Error: You must save the consignment before printing the label.</body></html>";
			response.write(errormsg);
		}
	} //for all consignments - assembly of html / pdf complete
	// Output the html array of labels to pdf document with pagination as needed
	for (var label = 1; label <= labelPageshtml.length; label++) {
		var pageIndex = label % labelsPerPage; // Modulo gives if first (1) or last (0) on page
		if (pageIndex == 1 || label == 1 || labelsPerPage == 1) //Build start table structure 
			//pdfxml += '<table vertical-align="middle" cellpadding="2mm"><tr>';
			pdfxml += '<table style="' + labelAlignment + '" cellpadding="2mm"><tr>';
		
		var labeltdwidth = (labelWidth / labelsPerPage).toFixed(0);
		pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;">' + labelPageshtml[label - 1] + '</td>';
		
		if (pageIndex == 0 || label == labelPageshtml.length || labelsPerPage == 1) { //Build end table structure
			for (var rowPad = (labelsPerPage - pageIndex); rowPad < labelsPerPage; rowPad++) 
				pdfxml += '<td align="center" width="' + labeltdwidth + 'mm" vertical-align="middle" style="width:' + labeltdwidth + 'mm;padding:2mm;vertical-align:middle;"></td>';
			pdfxml += '</tr></table>';
		}
		
		if (label > 1 && pageIndex == 0 && label != labelPageshtml.length) // Throw a new page if needed
			pdfxml += '<pbr background-color="white" />';
	}
	
	pdfxml += '</body></' + outputType + '>';
		
	if (outputType == 'html') {
		response.write(pdfxml);
	}
	else {
		var file = nlapiXMLToPDF(pdfxml);
		if (bulkPrint) {
			//file.setFolder(14); // Label PDFs
			file.setFolder(1014); // Label PDFs
			file.setName(bulkprintfilename + '.pdf');
			var fileID = nlapiSubmitFile(file);
			//soRecord.setFieldValue('custbody_labefilelpdf', fileID);
		}
		else {
			response.setContentType('PDF', 'label.pdf');
			response.write(file.getValue());
		}
	}
	nlapiLogExecution('AUDIT', 'USAGE', "PROCESSED:" + soRecords.length + " :USAGEREMAINING:" + nlapiGetContext().getRemainingUsage());
} //function

function getHeadNode(gridLinesOn, sizeFactor){

    var lineColour = "000000"; // Black = lines visible
    var nolineColour = "ffffff"; // White = no lines visible
    if (gridLinesOn) 
        lineColour = "000000";
    
    var CSS_DEFINITION = '<style type="text/css">';
    // New V2 Label definitions
    CSS_DEFINITION += '.td { vertical-align: top; padding: 0px; margin: 0px;}';
    CSS_DEFINITION += 'td.apcv2labeldesc { font-size: 2mm; height: 2mm; font-family: Helvetica; color: White; background-color: Black; padding: 1px ' + parseInt(sizeFactor * 5) + 'px 1px ' + parseInt(sizeFactor * 8) + 'px; }';
    CSS_DEFINITION += 'td.apcmedium  { padding-left:' + parseInt(sizeFactor * 4) + 'px;color:#000000;font-family: Courier;font-stretch:semi-expanded;font-size:' + parseInt(sizeFactor * 15) + 'pt;font-weight:bold;white-space:nowrap; }';
    CSS_DEFINITION += 'td.depotPanel { font-size: ' + parseInt(sizeFactor * 8) + 'mm; font-weight: bolder; font-family: Courier; text-align: right; vertical-align: top; padding: 0px 2px 0px 0px; }';
    CSS_DEFINITION += 'td.depotpaneldesc { font-size: ' + parseInt(sizeFactor * 7) + 'pt; font-family: Helvetica; color: White; background-color: Black; height: ' + parseInt(sizeFactor * 4) + 'mm; padding: 2px 0px 0px 0px; text-align: center; }';
    CSS_DEFINITION += '#ConsignmentNo { font-size: ' + parseInt(sizeFactor * 9) + 'mm; font-weight: bolder; font-family: Courier; padding-right: 5px; text-align: center; vertical-align: top; padding: 2px 5px 2px 5px; }';
    CSS_DEFINITION += '#service { font-size: ' + parseInt(sizeFactor * 8) + 'mm; font-family: Helvetica; font-weight: bolder; font-stretch:semi-expanded; color: Black; background-color: White; text-align: center; vertical-align: middle; margin-right: ' + parseInt(sizeFactor * 20) + 'px; }';
    CSS_DEFINITION += 'td.zonedepot { font-size: ' + parseInt(sizeFactor * 34) + 'mm; line-height:75%; font-weight: bolder; font-family: Helvetica; font-stretch:semi-expanded; text-align: center; vertical-align: middle; padding: 5px 0px 0px 0px; }';
    CSS_DEFINITION += 'td.zonedepot2 { font-size: ' + parseInt(sizeFactor * 16) + 'mm; line-height:75%; font-family: Helvetica; font-weight: bolder; font-stretch:expanded; text-align: center; margin-right: ' + parseInt(sizeFactor * 5) + 'px;  margin-top: 3px; }';
    CSS_DEFINITION += '#postcode { font-size: ' + parseInt(sizeFactor * 16) + 'mm; font-weight: bolder; font-family: Helvetica; text-align: center; vertical-align: bottom; padding-right: 5px; }';
    CSS_DEFINITION += 'td.consignordetails { font-size: ' + parseInt(sizeFactor * 5) + 'mm; height: ' + parseInt(sizeFactor * 5) + 'mm; font-family: Courier; font-weight: bold; text-align: left; vertical-align: middle; padding-left: 2px; }';
    CSS_DEFINITION += '#condate { font-size: ' + parseInt(sizeFactor * 5) + 'mm; font-weight: bold; font-family: Courier; text-align: center; vertical-align: top; padding-right: ' + parseInt(sizeFactor * 5) + 'px; }';
    // Original label definitions
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
    CSS_DEFINITION += 'span.apcsmall  { padding-left:' + parseInt(sizeFactor * 8) + 'px;color:#000000;font-family:helvetica;font-stretch:semi-condensed;font-size:' + parseInt(sizeFactor * 12) + 'pt;font-weight:bold;white-space:nowrap; }';
    CSS_DEFINITION += 'span.apcmedium  { padding-left:' + parseInt(sizeFactor * 8) + 'px;color:#000000;font-family:helvetica;font-stretch:semi-condensed;font-size:' + parseInt(sizeFactor * 18) + 'pt;font-weight:bold;white-space:nowrap; }';
    CSS_DEFINITION += 'span.apclarge  { color:#000000;padding-top:' + parseInt(sizeFactor * 2) + 'px;font-family:helvetica;font-size:' + parseInt(sizeFactor * 30) + 'pt;line-height:' + parseInt(sizeFactor * 15) + 'pt;font-weight:bold;font-stretch:semi-condensed;white-space:nowrap; }';
    CSS_DEFINITION += 'span.apcextralarge  { color:#000000;padding-top:' + parseInt(sizeFactor * 4) + 'px;vertical-align:bottom;font-family:helvetica;font-size:' + parseInt(sizeFactor * 19) + 'mm;line-height:' + parseInt(sizeFactor * 15) + 'mm;font-weight:bold;font-stretch:semi-expanded;white-space::nowrap; }';
    CSS_DEFINITION += 'td.consigneeline  { font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 8) + 'pt;line-height:' + parseInt(sizeFactor * 5) + 'pt;white-space:nowrap; }';
    CSS_DEFINITION += 'td.dateblock  { background-color:#000000;color:#ffffff;font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 12) + 'pt;white-space:nowrap;vertical-align:bottom; }';
    CSS_DEFINITION += 'td.identblock  { background-color:#000000;color:#ffffff;font-family:courier;font-weight:bold;font-size:' + parseInt(sizeFactor * 6) + 'pt;white-space:nowrap;text-align:right; }';
    CSS_DEFINITION += '</style>';
    
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 873 || parseInt(nlapiGetContext().getUser()) == 7) 
        testMode = true; // 8 = TESTCOMPANY	
    return testMode;
}

function isCustomerCenter(){
    var isCenter = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1015 || theRole == 1005 || theRole == 1006 || theRole == 1007 || theRole == 1008) 
        isCenter = true;
    return isCenter;
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

function bulkPrinterProcess_v1(request, response){
	var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_bulkprint_testmode');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
	var schedPrefix = 'sched';
	if (nlapiGetContext().getExecutionContext() == 'suitelet') schedPrefix = '';
	
    var savedsearchbulkprint = nlapiGetContext().getSetting('SCRIPT', 'custscript_bulkprint' + schedPrefix + '_savedsearch');
    if (savedsearchbulkprint == null || savedsearchbulkprint == '') 
        savedsearchbulkprint = 'customsearch_checkbulkprints'; // Default search

    var batchsizebulkprint = nlapiGetContext().getSetting('SCRIPT', 'custscript_bulkprint' + schedPrefix + '_labelsperbatch');
    if (batchsizebulkprint == null || batchsizebulkprint == '') 
        batchsizebulkprint = 250; // Default size of each print file

    var batchlabelidbulkprint = nlapiGetContext().getSetting('SCRIPT', 'custscript_bulkprint' + schedPrefix + '_labelselect');
    if (batchlabelidbulkprint == null || batchlabelidbulkprint == '') 
        batchlabelidbulkprint = 2; // Default size of each print file

    var bulkprintSearchFilters = new Array();
    var bulkprintSearchColumns = new Array();
    var bulkprintCols = ('name', 'trandate', 'tranid', 'internalid', 'custbody_sso_netsubtotal', 'custbody_sso_notaxtotal', 'custbody_sso_taxtotal', 'total')
    //for (var c=0; c<bulkprintCols.length; c++)
	//	bulkprintSearchColumns[c] = new nlobjSearchColumn(bulkprintCols[c]);

    bulkprintSearchColumns[0] = new nlobjSearchColumn('name');
    bulkprintSearchColumns[1] = new nlobjSearchColumn('trandate');
    bulkprintSearchColumns[2] = new nlobjSearchColumn('tranid');
    bulkprintSearchColumns[3] = new nlobjSearchColumn('internalid');
    bulkprintSearchColumns[4] = new nlobjSearchColumn('externalid');
    bulkprintSearchColumns[5] = new nlobjSearchColumn('custbody_currentlabelcount');
    bulkprintSearchColumns[6] = new nlobjSearchColumn('custbody_labeltotalweight');
    bulkprintSearchColumns[7] = new nlobjSearchColumn('custbody_labeldimension');
    bulkprintSearchColumns[8] = new nlobjSearchColumn('custbody_parceldeliveryzone');
    
    var bulkprintSearchResults = nlapiSearchRecord('salesorder', savedsearchbulkprint, bulkprintSearchFilters, bulkprintSearchColumns);
    //nlapiLogExecution('AUDIT', 'SEARCH ' + savedsearchbulkprint, "RESULTS : " + bulkprintSearchResults.length);
    
    if (bulkprintSearchResults) {
        var lastBatchSize = bulkprintSearchResults.length % batchsizebulkprint;
        var batchQty = parseInt(bulkprintSearchResults.length / batchsizebulkprint);
        //if (bulkprintSearchResults.length <= batchsizebulkprint) batchQty = 1;
        if (lastBatchSize != 0) batchQty += 1;
        var batchNo = 0; // Indexed offset for id counting per batch
        var labelNo = 0;
    	//nlapiLogExecution('AUDIT', 'BATCHINFO ' + savedsearchbulkprint,  "SIZE : " + batchsizebulkprint + " QTY : " + batchQty + " LAST : " + lastBatchSize);
        for (var bn = 0; bn < batchQty; bn++) {
            var batchCids = "";
            for (var bi = 0; ((bn < batchQty-1) && bi < batchsizebulkprint) || ((batchQty-1 == bn) && bi < lastBatchSize); bi++) {
                if (bulkprintSearchResults[(bn * batchsizebulkprint) + bi].getValue(bulkprintSearchColumns[3])) {
					if (batchCids != "") 
						batchCids += ",";
					batchCids += bulkprintSearchResults[(bn * batchsizebulkprint) + bi].getValue(bulkprintSearchColumns[3]);
				}
            }
            //if (batchCids != "" && bn == 3) {
            if (batchCids != "") {
				var batchFileName = savedsearchbulkprint + "_" + parseInt(bn + 1);
                nlapiLogExecution('AUDIT', 'BATCH ' + parseInt(bn + 1) + '/' + batchQty + ' : File : ' + batchFileName, "CIDS : " + batchCids);
                labelPrinterV3(request, response, batchCids, batchFileName, batchlabelidbulkprint);
            }
        }
    } // if (bulkprintSearchResults)
}

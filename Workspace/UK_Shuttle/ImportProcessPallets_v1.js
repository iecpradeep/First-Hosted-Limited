var CSS_DEFINITION = '<style type="text/css">';
CSS_DEFINITION += 'h1 { font-family: Helvetica; font-size: 18px;} ';
CSS_DEFINITION += '.signatureblock {width:400px; height:200px; border:solid black 1px;} ';
CSS_DEFINITION += 'table { font-family: Helvetica; text-align: left; font-size: 11px;} ';
CSS_DEFINITION += 'table.headerinfo { font-family: Helvetica; text-align: left; font-size: 12px; font-weight: bold} ';
CSS_DEFINITION += '.print { font-family: Helvetica; text-align: left; font-size: x-small;} ';
CSS_DEFINITION += '.standard { font-family: Helvetica; font-size:12px;} ';
CSS_DEFINITION += '.emphasised { font-family: Helvetica; font-weight:bold; font-size:12px;} ';
CSS_DEFINITION += '.rightalign { font-family: Helvetica; font-weight:bold;} ';
CSS_DEFINITION += '.detailed { font-family: Helvetica; font-size:8px;} ';
CSS_DEFINITION += '</style>';

var fontStyle1 = ' class=\"standard\" ';
var fontStyle2 = ' class=\"emphasised\" ';
var fontStyle3 = ' class=\"rightalign\" ';
var fontStyle4 = ' class=\"sizematrix\" ';
var fontStyle5 = ' class=\"detailed\" ';

var ErrMsg = '';
var submitResult = "";

function getHeadNode(){
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

// Common variables ...
var userid = 99999; // entity id of the current user
var companyName = 'TEST';
var companyAddr = 'n/a';
var theAcct = 'TEST';
var entityFilter = 'noneof';

function importPalletProcess(request, response, customerid, startdate, enddate){
    // Converts any imported consignments
    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_importplt_testmode');
    if (testMode == null) {
        testMode = false;
    }
    else {
        if (testMode == 'Y' || testMode == 'T') 
            testMode = true;
    }
    
    var invStartDate = 'today';
    if (startdate != '' && startdate != null) 
        invStartDate = startdate;
    
    var invEndDate = 'today';
    if (enddate != '' && enddate != null) 
        invEndDate = enddate;
    
    var outputType = 'html';
    var emailAddress = '';
    var userid = customerid; // entity id of the current user
    var theContext = nlapiGetContext(); // If not scheduled, look for URL parameters
    if (theContext.getExecutionContext() != 'scheduled') {
        if (request.getParameter('custparam_sdt') != '' && request.getParameter('custparam_sdt') != null) 
            invStartDate = request.getParameter('custparam_sdt');
        if (request.getParameter('custparam_edt') != '' && request.getParameter('custparam_edt') != null) 
            invEndDate = request.getParameter('custparam_edt');
        if (request.getParameter('custparam_entityid') != '' && request.getParameter('custparam_entityid') != null) 
            userid = request.getParameter('custparam_entityid');
        if (request.getParameter('custparam_outputtype') != null) 
            outputType = request.getParameter('custparam_outputtype');
        if (request.getParameter('custparam_emailaddr') != '' && request.getParameter('custparam_emailaddr') != null) 
            emailAddress = request.getParameter('custparam_emailaddr');
    }
    
    userRecord = nlapiLoadRecord('customer', userid);
    companyName = userRecord.getFieldValue('companyname');
    companyAddr = userRecord.getFieldValue('defaultaddress');
    theAcct = userRecord.getFieldValue('entityid');
    entityFilter = 'anyof';
    var fuelPercent = userRecord.getFieldValue('custentity_fuelsurcharge');   
    if (isNaN(fuelPercent) || fuelPercent == null || fuelPercent == '') {
        fuelPercent = 0.00;
    }
    else {
        fuelPercent = parseFloat(fuelPercent);
    }	
    
    var html = '';
    html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
    html += createReportHeader();
	
	// ----- Build Search for this customer ...
    var mySearchFilters = new Array();
    var mySearchColumns = new Array();
    
	/*
    mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
    mySearchFilters[1] = new nlobjSearchFilter('entity', null, entityFilter, userid);
    mySearchFilters[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', invEndDate);
    mySearchFilters[3] = new nlobjSearchFilter('trandate', null, 'onorafter', invStartDate);
    mySearchFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'noneof', (4, 5, 6)); // Ignore cancelled, processed & invoiced ones
    mySearchFilters[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
    mySearchFilters[6] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', ('2')); // Pallets only
    mySearchFilters[7] = new nlobjSearchFilter('custbody_apcimportfirstdate', null, 'isnotempty', null); // Consignments only
	*/
	
    //mySearchFilters[0] = new nlobjSearchFilter('entity', null, entityFilter, userid);

	var daterange = 'onorbefore';
	if (invStartDate == invEndDate)
		 daterange = 'on';
	
    mySearchFilters[0] = new nlobjSearchFilter('entity', null, entityFilter, userid);
    mySearchFilters[1] = new nlobjSearchFilter('trandate', null, daterange, invEndDate);
    mySearchFilters[2] = new nlobjSearchFilter('custbody_syntheticimport', null, 'isnot', 'T');			
    mySearchFilters[3] = new nlobjSearchFilter('custcol_donotreprice', null, 'isnot', 'T');
    if (invStartDate != invEndDate) mySearchFilters[4] = new nlobjSearchFilter('trandate', null, 'onorafter', invStartDate);
	
    mySearchColumns[0] = new nlobjSearchColumn('tranid');
    mySearchColumns[1] = new nlobjSearchColumn('custbody_labelservice');
    mySearchColumns[2] = new nlobjSearchColumn('custbody_palletparcel');
    mySearchColumns[3] = new nlobjSearchColumn('custbody_deliveryaddr4');
    mySearchColumns[4] = new nlobjSearchColumn('custbody_deliverypostcode');
    mySearchColumns[5] = new nlobjSearchColumn('custbody_labelparcels');
    mySearchColumns[6] = new nlobjSearchColumn('custbody_labeltotalweight');
    mySearchColumns[7] = new nlobjSearchColumn('custbody_fuelsurcharge');
    mySearchColumns[8] = new nlobjSearchColumn('otherrefnum');
    mySearchColumns[9] = new nlobjSearchColumn('internalid');
    mySearchColumns[10] = new nlobjSearchColumn('custbody_insurancesurcharge');
    mySearchColumns[11] = new nlobjSearchColumn('custbody_delname');
    mySearchColumns[12] = new nlobjSearchColumn('trandate');
    mySearchColumns[13] = new nlobjSearchColumn('custbody_deliveryaddr3');
    mySearchColumns[14] = new nlobjSearchColumn('custbody_consignmentstatus');
    mySearchColumns[15] = new nlobjSearchColumn('custbody_fuelsurchargeratepercent');
    mySearchColumns[16] = new nlobjSearchColumn('externalid');
    
    // Perform search ....
    var mySearchResults = nlapiSearchRecord('salesorder', 'customsearch_palletimport', mySearchFilters, mySearchColumns);
    var recordsProcessed = 0;
    var consignmentIDList = new Array; // Used to store the IDs for completion after the SSO is committed
	
    // Display results ....
    if (mySearchResults) {    
        var totalCartons = 0;
        var totalWeight = 0.00;
        var totalValue = 0.00;
        var insuranceTotal = 0.00;
        var insuranceItems = 0; // Tracks the offset if insurance items present
        var fuelsurchargeTotal = 0.00;
 		var d = new Date();
       
        for (i = 0; i < mySearchResults.length; i++) {
			ErrMsg = '';
			submitResult = "";
            var NSid = mySearchResults[i].getValue(mySearchColumns[0]);
            var docnum = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[16]));
			if (docnum != null) {
				var docArray = docnum.split(':');
				if (docArray.length == 2) 
					docnum = docArray[1];
			}
            var trandate = mySearchResults[i].getValue(mySearchColumns[12]);
            var custRef = mySearchResults[i].getValue(mySearchColumns[8]);
            var consignee = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[11]));
            var servicetype = nlapiEscapeXML(mySearchResults[i].getText(mySearchColumns[2]));
            
            consignmentIDList[i] = mySearchResults[i].getValue(mySearchColumns[9]);
            var theConsingmentRec = nlapiLoadRecord('salesorder', consignmentIDList[i]);

			if (theConsingmentRec.getFieldValue('custbody_syntheticimport') != 'T') {
				// Set up the right area / zone etc.
				var isValidPostCode = false;
				var shipCountry = 1;
				var shipPostCode = '';
				var type = 'delivery';
				var deliveryType = getDeliveryType(theConsingmentRec.getFieldValue('class'), theConsingmentRec.getFieldValue('custbody_receivingdepot'));
				if (deliveryType != 'HT') 
					type = 'pickup';
				
				var repricedStatus = '5'; // Processed by Default
				if (theConsingmentRec.getFieldValue('custbody_receivingdepot') == '' || theConsingmentRec.getFieldValue('custbody_receivingdepot') == null || theConsingmentRec.getFieldValue('custbody_receivingdepot') == '0') {
					repricedStatus = '1'; // Entered as not already a defined depot
					theConsingmentRec.setFieldValue('custbody_syntheticimport', 'T');
				}
				nlapiLogExecution('AUDIT', 'Receiving Depot Test New ' + theConsingmentRec.getFieldValue('custbody_receivingdepot'), 'Depot:' + theConsingmentRec.getFieldValue('custbody_receivingdepot') + ' Test=0:' + (theConsingmentRec.getFieldValue('custbody_receivingdepot') == '0'));
				
				var formCols = new Array('custrecord_formservicetype', 'custrecord_formusertype', 'custrecord_formdeliverytype');
				var formVals = new Array(2, 2, 3); //Pallet, Admin, HT
				var parentForm = '';
				if (deliveryType == 'HT') {
					parentForm = getFormMatrixFormID(formCols, formVals);
				}
				else {
					if (deliveryType == 'TH') {
						formVals[2] = 1;
						parentForm = getFormMatrixFormID(formCols, formVals);
					}
					else { // Must be TT
						formVals[2] = 2;
						parentForm = getFormMatrixFormID(formCols, formVals)
					}
				}
				//alert ('ParentForm = ' + parentForm);
				
				
				if (type == 'delivery') {
					shipPostCode = theConsingmentRec.getFieldValue('custbody_deliverypostcode');
					shipCountry = theConsingmentRec.getFieldValue('custbody_deliverycountryselect');
				} //if
				else {
					shipPostCode = theConsingmentRec.getFieldValue('custbody_pickupaddresspostcode');
					shipCountry = theConsingmentRec.getFieldValue('custbody_pickupcountryselect');
				} //else
				ErrMsg += " PostCode = " + shipPostCode + " : ";
				if (shipPostCode && shipCountry) {
					if (isValidPostcode(shipPostCode, shipCountry)) {
						var postcodePrefix = returnCountryPostcodePrefix(shipPostCode, shipCountry);
						theConsingmentRec.setFieldValue('custbody_postcodezone', postcodePrefix);
						var postcodeSearchFilters = new Array();
						var postcodeSearchColumns = new Array();
						
						postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
						postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
						
						postcodeSearchColumns[0] = new nlobjSearchColumn('name');
						postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_tpnzone');
						postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_pricingzone');
						postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deliverydepot');
						
						var postcodeSearchResults = nlapiSearchRecord('customrecord_pallet_postcodelookup', null, postcodeSearchFilters, postcodeSearchColumns);
						
						// retrieve area and depot number
						if (postcodeSearchResults) {
							var area = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
							var deldepot = postcodeSearchResults[0].getValue(postcodeSearchColumns[3]);
							var tpnzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
							
							// populate custom fields
							theConsingmentRec.setFieldValue('custbody_pallet_zone', area);
							if (type == 'delivery') {
								theConsingmentRec.setFieldValue('custbody_receivingdepot', deldepot);
								theConsingmentRec.setFieldValue('custbody_palletdeliveryzone', tpnzone);
							}
							else {
								theConsingmentRec.setFieldValue('custbody_palletcollectingdepot', deldepot);
								theConsingmentRec.setFieldValue('custbody_sendingdepot', deldepot);
							}
						//if (isTestUser()) alert('prefix = ' + postcodePrefix + '\ndepot = ' + deldepot);
						} //if				
						ErrMsg = 'ERROR:Pallet Zone ' + area + ' Depot ' + deldepot + ' ' + ' Delzone ' + tpnzone + ' ';
					} //if
					else {
						ErrMsg = 'ERROR:Postcode ' + shipPostCode + ' not a valid format.';
					}
				} //if
				// Area setup completed
				
				var pricedConsingmentRec = getPalletRates(theConsingmentRec);
				// re-schedule if running out ...
				if (theContext.getExecutionContext() == 'scheduled' && theContext.getRemainingUsage() <= 50 && (i + 1) < mySearchResults.length) {
					var status = nlapiScheduleScript(theContext.getScriptId(), theContext.getDeploymentId())
					if (status == 'QUEUED') 
						break;
				}
				else {
					var submitResult = "";
					if (pricedConsingmentRec) {
						var amount = pricedConsingmentRec.getLineItemValue('item', 'amount', 1);
						//var ServiceArray = mySearchResults[i].getValue(mySearchColumns[1]).split(' ');
						//var service = nlapiEscapeXML(ServiceArray[0]);
						var service = theConsingmentRec.getLineItemText('item', 'item', 1);
						//pricedConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115); //SR-GB 	
						
						//var parcels = parseInt(mySearchResults[i].getValue(mySearchColumns[5]));
						var parcels = parseInt(theConsingmentRec.getLineItemValue('item', 'custcol_numberofpallets', 1));
						totalCartons += parcels; // for footer ...
						//var parcelweight = parseFloat(mySearchResults[i].getValue(mySearchColumns[6]));
						var parcelweight = parseFloat(theConsingmentRec.getLineItemValue('item', 'custcol_totalweight_pallets', 1));
						totalWeight += parcelweight;
						
						var insurance = parseFloat(pricedConsingmentRec.getFieldValue('custbody_insurancesurcharge'));
						if (isNaN(insurance) || insurance == null || insurance == '') {
							insurance = 0.00;
						}
						else {
							insurance = parseFloat(insurance).toFixed(2);
						}
						theConsingmentRec.setFieldValue('custbody_insurancesurcharge', insurance);
						
						var fuelsurcharge = parseFloat(pricedConsingmentRec.getFieldValue('custbody_fuelsurcharge'));
						if (isNaN(fuelsurcharge) || fuelsurcharge == null || fuelsurcharge == '') {
							fuelsurcharge = 0.00;
						}
						else {
							fuelsurcharge = parseFloat(fuelsurcharge);
						}
						//if (fuelsurcharge == 0.00 && fuelPercent > 0.00) 
						if (fuelPercent > 0.00) 
							fuelsurcharge = (parseFloat(fuelPercent / 100) * parseFloat(amount)).toFixed(4);
						theConsingmentRec.setFieldValue('custbody_fuelsurcharge', fuelsurcharge);
						
						var town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[13]));
						if (town == null || town == '') 
							town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[3]));
						var postcode = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[4]));
						var fuel = mySearchResults[i].getValue(mySearchColumns[7]);
						
						var closeURL = '<a href="/app/accounting/transactions/salesordermanager.nl?type=closeremaining&whence=&trantype=salesorder&id=' + mySearchResults[i].getValue(mySearchColumns[9]) + '" target="_blank">Close ...</a>';
						
						//pricedConsignmentRec.setFieldValue('custbody_consignmentstatus', '5'); // Processed
						theConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115); //SR-GB 	
						theConsingmentRec.setLineItemValue('item', 'amount', 1, amount);
						theConsingmentRec.setLineItemValue('item', 'rate', 1, amount);
						theConsingmentRec.setLineItemValue('item', 'custcol_fuelsurchargeamount', 1, fuelsurcharge);
						
						var submitID = nlapiSubmitRecord(theConsingmentRec, false, true);
						//if (submitID != consignmentIDList[i]) {
						//	submitResult = "ERR";
						//}
						//else {
						//var commitConsignmentRec = nlapiLoadRecord('salesorder', consignmentIDList[i]);
						var commitConsignmentRec = nlapiLoadRecord('salesorder', submitID);
						commitConsignmentRec.setFieldValue('custbody_consignmentstatus', repricedStatus); // Processed
						commitConsignmentRec.setFieldValue('memo', 'Repriced OK :' + amount + ' status : ' + repricedStatus + ' : ' + d);
						if (parentForm != null && parentForm != '') 
							commitConsignmentRec.setFieldValue('customform', parentForm); // The relevant form for type
						nlapiSubmitRecord(commitConsignmentRec, false, true);
						submitResult = "UPD OK";
						//}
						nlapiLogExecution('AUDIT', 'Order :' + theAcct + ":" + NSid + ":" + deliveryType + ":" + parentForm, submitResult + ' : ' + NSid + ' : ' + docnum + ' : ' + trandate + ' : ' + service + ' : ' + servicetype + ' : ' + consignee + ' : ' + custRef + ' : ' + town + ' : ' + postcode + ' : ' + parcels + ' : ' + parcelweight + ' : ' + amount + ' : ' + fuelsurcharge + ' : ' + insurance);
						html += '<tr><td>' + submitResult + '</td><td>' + NSid + '</td><td>' + docnum + '</td><td>' + trandate + '</td><td>' + service + '</td><td>' + servicetype + '</td><td>' + consignee + '</td><td>' + custRef + '</td><td>' + town + '</td><td>' + postcode + '</td><td>' + parcels + '</td><td>' + parcelweight + '</td><td>' + amount + '</td><td>' + fuelsurcharge + '</td><td>' + insurance + '</td><td>' + closeURL + '</td></tr>';
					} //if (pricedConsingmentRec)
					else { // Set to cancelled w. Memo set to Errmsg - move to next...
						nlapiLogExecution('AUDIT', 'Pricing Error:TRANID:' + NSid + ":" + type, ErrMsg);
						var commitConsignmentRec = nlapiLoadRecord('salesorder', consignmentIDList[i]);
						commitConsignmentRec.setFieldValue('custbody_consignmentstatus', '11'); // For Repricing - keep trying / reporting
						commitConsignmentRec.setFieldValue('memo', 'ERROR:' + ErrMsg);
						if (parentForm != null && parentForm != '') 
							commitConsignmentRec.setFieldValue('customform', parentForm); // The relevant form for type
						submitResult = "ERR";
						nlapiSubmitRecord(commitConsignmentRec, false, true);
					} // if (pricedConsingmentRec)
					html += '<tr><td colspan=\"16\">Result : ' + ErrMsg + '</td></tr>';
					recordsProcessed++;
				} // If usage limit being reached / reschedule
			}
        } // for (i = 0; i < mySearchResults.length; i++) 
    }// if (mySearchResults)
	else {
        html += '<tr><td colspan=\"16\">There are no consignments for ' + invStartDate + '-' + invEndDate + '</td></tr>';
    }
	
	html += '</table>';
    
    var xml = '    <!DOCTYPE ' + outputType + ' PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
    if (emailAddress != '') {
        var TransportUserID = 779;
        nlapiSendEmail(TransportUserID, request.getParameter('custparam_emailaddr'), "SSO: " + companyName + " : " + invStartDate + ' - ' + invEndDate, xml, null, null, null, null);
    }
    
    if (theContext.getExecutionContext() != 'scheduled') {
        if (outputType == 'pdf') {
            xml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<' + outputType + '>\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
            var file = nlapiXMLToPDF(xml);
            response.setContentType('PDF', 'manifest.pdf');
            response.write(file.getValue());
        }
        else {
            response.write(xml);
        }
    }

    nlapiLogExecution('AUDIT', 'TPN:' + invStartDate + ' - ' + invEndDate, "PROCESSED:" + recordsProcessed + ":CUST:" + companyName  + ":ID:" + consignmentIDList[recordsProcessed-1] + ":USAGEREMAINING:" + theContext.getRemainingUsage());
	//if (ErrMsg.substring(0,8) != 'PostCode')  nlapiLogExecution('AUDIT', 'Errmsg:ID:' + consignmentIDList[recordsProcessed-1], ErrMsg);

}

function processImportPalletCustomers(request, response){

    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_importpltcustomers_testmode');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = nlapiGetContext().getSetting('SCRIPT', 'custscript_ignoreimportpltfreq');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
    var savedsearchCustomer = nlapiGetContext().getSetting('SCRIPT', 'custscript_importpltsearchcustomer');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
        savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
    var invStartDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt') != null) 
        invStartDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt'));
    
    var invEndDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt') != null) 
        invEndDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt'));
    
    var soRecords = new Array;
    if (nlapiGetContext().getExecutionContext() == 'suitelet') {
        if (request.getParameter('custparam_entityids') != null) {
            soRecords = request.getParameter('custparam_entityids').split(',');
        }
        else {
            if (request.getParameter('custparam_entityid') != null) {
                soRecords[0] = request.getParameter('custparam_entityid');
            }
            else { //Assume all customers so set to special value
                soRecords[0] = 'ALL';
            }
        }
    }
    else {
        soRecords[0] = 'ALL';
    }
    
    var outputType = 'html';
    var html = '';
    html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
    
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
        var soRecordId = soRecords[soRec];
        if (soRecordId) {
            var entitySearchFilters = new Array();
            var entitySearchColumns = new Array();
            
            entitySearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
            if (soRecordId != 'ALL') 
                entitySearchFilters[1] = new nlobjSearchFilter('internalid', null, 'anyof', soRecordId);
            
            entitySearchColumns[0] = new nlobjSearchColumn('companyname');
            entitySearchColumns[1] = new nlobjSearchColumn('custentity_currentconsolidatedinvoice');
            entitySearchColumns[2] = new nlobjSearchColumn('email');
            entitySearchColumns[3] = new nlobjSearchColumn('custentity_factorrefno');
            entitySearchColumns[4] = new nlobjSearchColumn('entityid');
            entitySearchColumns[5] = new nlobjSearchColumn('custentity_contact');
            entitySearchColumns[6] = new nlobjSearchColumn('internalid');
            entitySearchColumns[7] = new nlobjSearchColumn('custentity_consolidatedinvoicefrequency');
            
            var entitySearchResults = nlapiSearchRecord('customer', savedsearchCustomer, entitySearchFilters, entitySearchColumns);
            
            if (entitySearchResults) {
                for (theCustomer = 0; theCustomer < entitySearchResults.length; theCustomer++) {
                    var frequency = 2; // Weekly by default
                    if (entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != null && entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != '') 
                        frequency = entitySearchResults[theCustomer].getValue(entitySearchColumns[7]);
                    if (!ignoreFrequency) {
                        if (frequency == 1) { // Daily
                            invStartDate = invEndDate
                        }
                        else {
                            if (frequency == 2) { // Weekly
                                invStartDate = nlapiAddDays(invEndDate, -6)
                            }
                            else {
                                if (frequency == 3) { // End of Month
                                    var firstDayofMonth = '1/' + (invEndDate.getMonth() * 1 + 1) + '/' + invEndDate.getFullYear();
                                    invStartDate = nlapiStringToDate(firstDayofMonth);
                                }
                            }
                        }
                    }
                    
                    var sDTparam = invStartDate.getDate() + '/' + (invStartDate.getMonth() * 1 + 1) + '/' + invStartDate.getFullYear();
                    var eDTparam = invEndDate.getDate() + '/' + (invEndDate.getMonth() * 1 + 1) + '/' + invEndDate.getFullYear();
                    
                    if (testMode) {
                        html += '<tr><td>' + entitySearchResults[theCustomer].getValue(entitySearchColumns[4]) + "/" + entitySearchResults[theCustomer].getValue(entitySearchColumns[6]) + '</td><td>' + frequency + '</td><td>' + sDTparam + '</td><td>' + eDTparam + '</td></tr>';						
					} else {
                    	importPalletProcess(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
					}
                }
            } // if (entitySearchResults)
        } // if (soRecordId)
    } // for ...

    html += '</table>';
    html = '<!DOCTYPE ' + outputType + ' PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
    if (testMode) 
        response.write(html);

}

function processImportPalletCustomersSched(request, response){ // Scheduled script version
    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_importpltcust_testmode_sched');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = nlapiGetContext().getSetting('SCRIPT', 'custscript_importpltcustfreq_sched');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
    var savedsearchCustomer = nlapiGetContext().getSetting('SCRIPT', 'custscript_importsearchpltcust_sched');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
        savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
    var invStartDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt_sched') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt_sched') != null) 
        invStartDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_simportpltdt_sched'));
    
    var invEndDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt_sched') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt_sched') != null) 
        invEndDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportpltdt_sched'));
    
    var outputType = 'html';
    var html = '';
    html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
    
    var entitySearchFilters = new Array();
    var entitySearchColumns = new Array();
    
    entitySearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    
    entitySearchColumns[0] = new nlobjSearchColumn('companyname');
    entitySearchColumns[1] = new nlobjSearchColumn('custentity_currentconsolidatedinvoice');
    entitySearchColumns[2] = new nlobjSearchColumn('email');
    entitySearchColumns[3] = new nlobjSearchColumn('custentity_factorrefno');
    entitySearchColumns[4] = new nlobjSearchColumn('entityid');
    entitySearchColumns[5] = new nlobjSearchColumn('custentity_contact');
    entitySearchColumns[6] = new nlobjSearchColumn('internalid');
    entitySearchColumns[7] = new nlobjSearchColumn('custentity_consolidatedinvoicefrequency');
    
    var entitySearchResults = nlapiSearchRecord('customer', savedsearchCustomer, entitySearchFilters, entitySearchColumns);
    
    if (entitySearchResults) {
        for (theCustomer = 0; theCustomer < entitySearchResults.length; theCustomer++) {
            var frequency = 2; // Weekly by default
            if (entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != null && entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != '') 
                frequency = entitySearchResults[theCustomer].getValue(entitySearchColumns[7]);
            if (!ignoreFrequency) {
                if (frequency == 1) { // Daily
                    invStartDate = invEndDate
                }
                else {
                    if (frequency == 2) { // Weekly
                        invStartDate = nlapiAddDays(invEndDate, -6)
                    }
                    else {
                        if (frequency == 3) { // End of Month
                            var firstDayofMonth = '1/' + (invEndDate.getMonth() * 1 + 1) + '/' + invEndDate.getFullYear();
                            invStartDate = nlapiStringToDate(firstDayofMonth);
                        }
                    }
                }
            }
            
            var sDTparam = invStartDate.getDate() + '/' + (invStartDate.getMonth() * 1 + 1) + '/' + invStartDate.getFullYear();
            var eDTparam = invEndDate.getDate() + '/' + (invEndDate.getMonth() * 1 + 1) + '/' + invEndDate.getFullYear();
            
            if (testMode) 
                html += '<tr><td>' + entitySearchResults[theCustomer].getValue(entitySearchColumns[4]) + '</td><td>' + frequency + '</td><td>' + sDTparam + '</td><td>' + eDTparam + '</td></tr>';
            importPalletProcess(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
        }
    } // if (entitySearchResults)
    html += '</table>';
    html = '<!DOCTYPE ' + outputType + ' PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
    //if (testMode) 
    //    response.write(html);

}

// ============ GENERAL FUNCTIONS =================
function getLocalDate(){ //Adjusts for UTC and daylight savings
    var now = new Date();
    var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
    //March 27 - October 31 Daylight Savings is in BST
    if ((now.getMonth() >= 3 && now.getDate() > 27) && (now.getMonth() <= 10 && now.getDate() < 31)) 
        nowHours += 1; //Daylight savings
    if (nowHours >= 24) 
        now = nlapiAddDays(now, 1) //Is tomorrow already
    return now;
}

function getLongMonth(theMonth){
    var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return m[parseInt(theMonth - 1)];
}

function getLongDay(theDay){
    if (parseInt(theDay) <= 9) {
        return '0' + theDay;
    }
    else {
        return theDay;
    }
}

function createReportHeader(){
    var reportTitle = 'Imported Consignments for : ' + theAcct;
    
    var header = '<tr><td colspan=\"13\" align=\"center\"><h1>' + reportTitle + '</h1></td></tr>';
    //header += '<tr><td colspan=\"6\" ' + fontStyle1 + '><h1>TPN Delivery Manifest</h1></td><td></td><td colspan=\"5\" ' + fontStyle1 + ' align=\"right\"><h1>' + theLongDate + '</h1></td></tr>';
    //header += '<tr><td colspan=\"6\" ' + fontStyle1 + '><b>' + companyAddr.replace(/\n/g, '<br />') + '</b></td><td></td><td colspan=\"5\" ' + fontStyle1 + ' align=\"right\">Account:' + theAcct + '</td></tr>';
    //header += '<tr><td colspan=\"16\"></td></tr>';
    header += '<tr><td>PRICED?</td><td>ID</td><td>DOCNUM</td><td>DATE</td><td>SVCE</td><td>TYPE</td><td>CONSIGNEE</td><td>REF.</td><td>TOWN</td><td width="16mm" style="width:20mm">PCODE</td><td>ITEMS</td><td>WT.</td><td>PRICE</td><td>FUEL</td><td>INS</td><td>CLOSE</td></tr>';
    header += '<tr><td colspan=\"16\" style=\"border-top:solid black 2px;\"></td></tr>';
    return header;
}

function createReportFooter(totalConsignments, totalCartons, totalWeight){
    var signatureBlock = '<table  style=\"margin:10px;\"><tr><td ' + fontStyle2 + ' style=\"width:75px; vertical-align:bottom;\">Signature</td><td style=\"width:300px; border-bottom:dotted gray 1px;\"></td></tr><tr><td ' + fontStyle2 + ' style=\"width:75px; height:30px; vertical-align:bottom;\">Print</td><td style=\"width:300px; border-bottom:dotted gray 1px;\"></td></tr></table>';
    
    var footer = '<tr><td ' + fontStyle5 + ' align=\"right\" colspan=\"11\">SPCL Key: F = Fragile, S = Security</td></tr>';
    footer += '<tr><td colspan=\"16\" style=\"height:10px; border-top:solid black 2px;\"></td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"9\">Consignments are carried subject to Terms &amp; Conditions of Carriage,<br />copies of which are available upon request from your depot.</td><td align=\"right\" colspan=\"5\"><b>Total Consignments</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalConsignments + '</td></tr>';
    footer += '<tr><td colspan=\"9\" rowspan=\"3\" style=\"margin:5px; border-top:solid gray 1px; border-right:solid gray 1px; border-bottom:solid gray 1px; border-left:solid gray 1px;\">' + signatureBlock + '</td><td align=\"right\" colspan=\"7\"><b>Total Cartons</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalCartons + '</td></tr>';
    footer += '<tr><td align=\"right\" colspan=\"7\"><b>Total Weight</b></td><td ' + fontStyle2 + ' align=\"right\"><b>' + totalWeight.toFixed(2) + '</b></td></tr>';
    footer += '<tr><td colspan=\"9\"></td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"12\">Confidential Information. Copyright Nationwide Express Parcels 2011. All rights reserved.</td></tr>';
    return footer;
}

function getFormMatrixLookupValue(formId, colvalue, isText){
    var result = null;
    
    // search for postcode area record
    var formColumns = new Array;
    var formFilters = new Array;
    formFilters[0] = new nlobjSearchFilter('name', null, 'is', formId);
    formFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    
    formColumns[0] = new nlobjSearchColumn('name');
    formColumns[1] = new nlobjSearchColumn(colvalue);
    
    var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
    if (formResults) {
        if (isText) {
            result = formResults[0].getText(formColumns[1]);
        }
        else {
            result = formResults[0].getValue(formColumns[1]);
        }
        
        //if (isTestUser()) alert ( formId + " : " + colvalue + " => " + result.toLowerCase());
        
        return result.toLowerCase();
    }
}

function getFormMatrixFormID(colsSearch, colsValues){
    var result = null;

    var formColumns = new Array;
    var formFilters = new Array;
    if (colsSearch != null && colsValues != null) {
        if (colsSearch.length == colsValues.length) {
            for (var f = 0; f < colsSearch.length; f++) {
				formFilters[f] = new nlobjSearchFilter(colsSearch[f], null, 'anyof', colsValues[f]);
				//alert(colsSearch[f] + ":" + colsValues[f]);
			}			
            formColumns[0] = new nlobjSearchColumn('name');
           
            var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
            if (formResults) {
                result = formResults[0].getValue(formColumns[0]);
                //alert("getFormMatrixFormID ==> " + result);
                return result;
            }
        }
    }
}

function getFormShipType(customForm){
    return getFormMatrixLookupValue(customForm, 'custrecord_formservicetype', true);
}

function getFormOrderType(customForm){
    return getFormMatrixLookupValue(customForm, 'custrecord_formordertype', true);
}

function getFormDeliveryType(customForm){
    var theDeliveryID = getFormMatrixLookupValue(customForm, 'custrecord_formdeliverytype', false);
    if (parseInt(theDeliveryID) == 1) {
        return 'TH';
    }
    else 
        if (parseInt(theDeliveryID) == 2) {
            return 'TT';
        }
        else {
            return 'HT';
        }
}

function getDeliveryType(theClass,deliveryDepot){
    if (parseInt(theClass) == 6 || parseInt(theClass) == 10){
		if (parseInt(deliveryDepot) != 16) {
			return 'TT';
		}
		else {
			return 'TH';
		}
	}
	else  {
			return 'HT';
	}
}

function getServicesforArea(theArea, getText){ //Comma list of services available
    var services = '';
    var defSearchFilters = new Array();
    var defSearchColumns = new Array();
    
    defSearchFilters[0] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', theArea);
    //defSearchFilters[1] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
    
    defSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
    defSearchColumns[1] = defSearchColumns[0].setSort();
    defSearchColumns[2] = new nlobjSearchColumn('custrecord_servicearea');
    //defSearchColumns[3] = new nlobjSearchColumn('displayname');
    
    // perform search
    var defSearchResults = nlapiSearchRecord('customrecord_areaservice', 'customsearch_serviceareasitems', defSearchFilters, defSearchColumns);
    
    if (defSearchResults) {
        for (s = 0; s < defSearchResults.length; s++) {
            if (services != '') 
                services += ',';
            if (getText) {
                //services += defSearchResults[s].getText(defSearchColumns[0]) + "|" + defSearchResults[s].getValue(defSearchColumns[3]);
                services += defSearchResults[s].getText(defSearchColumns[0]);
            }
            else {
                services += defSearchResults[s].getValue(defSearchColumns[0]);
            }
        }
    }
    return services;
}

function getPalletRates(theConsRecord){
    
    //Check pallet list first and set totals for service
    //if (type == 'recmachcustrecord_palletlistconsignmentlookup') {
        var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
        var palletCount = nlapiGetLineItemCount('recmachcustrecord_palletlistconsignmentlookup');
        //alert('palletCount = ' + palletCount + '\npalletIndex = ' + palletIndex);
        
        if (palletCount > 0 || palletIndex > 0) {
            //var listCount = palletCount;
            //if (palletIndex > listCount) 
            //	listCount = palletIndex;
            var totalPallets = 0;
            var totalWeight = 0;
            for (var lc = 1; lc <= palletCount; lc++) { // 1 or more pallet lines exist already
                if (lc != palletIndex) {
                    var palletWeight = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', lc);
                    var pallets = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', lc);
                    if (!isNaN(palletWeight) && !isNaN(pallets)) {
                        //alert(lc + ' : weight = ' + palletWeight + '\npallets = ' + pallets);
                        totalWeight += parseInt(palletWeight);
                        totalPallets += parseInt(pallets);
                    }
                }
            }
            if (palletIndex > 0) { // First or additional item line				
                var newpalletWeight = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight');
                var newpallets = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity');
                if (!isNaN(newpalletWeight) && !isNaN(newpallets)) {
                    totalWeight += parseInt(newpalletWeight);
                    totalPallets += parseInt(newpallets);
                }
            }
            if (!isNaN(totalWeight) && !isNaN(totalPallets)) {
        		ErrMsg += 'Input valid pallet weight / quantity combination. Weight=' + totalWeight + ' Qty=' + totalPallets;
        		return false;
            }
        }
        
    //    return true;
    //}
    
	/*
    if (parseInt(nlapiGetCurrentLineItemIndex('item')) > 1) // 2nd item ...
    {
        alert('Only one delivery service item allowed per consignment / quotation.');
        nlapiCancelLineItem('item');
        nlapiSelectLineItem('item', 1);
        return false;
    }
    */
	
    // Retrieve the current item selected	
    var currentItem = theConsRecord.getLineItemValue('item', 'item', 1);
    var currentItemText = theConsRecord.getLineItemText('item', 'item', 1);
    var currentItemArray = currentItemText.split(' ');
	//alert(currentItemText);
	var theDate = new Date();

	//var theSaturdayServices = ["SAT", "SATL", "SATT", "STTL"];
	//for (var ss = 0; ss < theSaturdayServices.length; ss++) {
	//	//if (isTestUser()) alert ("Day=" + theDate.getDay() + "\n" + currentItem + " = " + theSaturdayServices[ss] + "?");
	//	if (currentItemArray[0] == theSaturdayServices[ss] && theDate.getDay() != 5) { //Saturday Service but not a Friday ...
    //    	ErrMsg += 'Please Note: Saturday Service selected but today is not Friday.\nPlease select another service.';
	//		return false;
	//	}
	//}
	
	//Loading the item record fails in Customer Center so using 'hack' above ...
    //var currentItemRecord = nlapiLoadRecord('serviceitem', currentItem);
    
    // Retrieve the current pallet size
    var palletSize = theConsRecord.getLineItemValue('item', 'custcol_palletsize',1);
    var palletQty = theConsRecord.getLineItemValue('item', 'custcol_numberofpallets',1);
    var palletWeight = theConsRecord.getLineItemValue('item', 'custcol_totalweight_pallets',1);
    //alert('palletQty = ' + palletQty + '\npalletWeight = ' + palletWeight);
    
    //if (palletSize == null || palletSize == '')
    if (palletQty == null || palletQty == '') {
        ErrMsg += 'Please Note: Input at least one valid pallet size / quantity combination. Please also ensure you click \'Add\' under the Pallet Size / Type.';
        return false;
    }
    
    if (palletWeight == null || palletWeight == '' || palletWeight <= 0) {
        ErrMsg += 'Please Note: Select at least one pallet size / weight combination. Please also ensure you click \'Add\' under the Pallet Size / Type.';
        return false;
    }
    else {
        //if (!checkMaximums(palletSize)) return false;
    }
    
    // Retrieve current pallet area
    var palletZone = theConsRecord.getFieldValue('custbody_pallet_zone');
    // Retrieve current postcode zone (prefix)
    var postcodeZone = theConsRecord.getFieldValue('custbody_postcodezone');
    
    if (palletZone == null || palletZone == '' || postcodeZone == null || postcodeZone == '') {
        ErrMsg += 'Please Note: The selected address has no pricing / zone details. palletZone = ' + palletZone + ' postcodeZone = ' + postcodeZone;
        return false;
    }
    
    // Retrieve current customer
    var currentCustomer = theConsRecord.getFieldValue('entity');
	var precedence = 0;
	var prevPalletZone = '';

    // ORDER OF PRECEDENCE #1
    // construct search for postcode override - Full prefix first then alpha only
    
    var pOverrideSearchFilters = new Array();
    var pOverrideSearchColumns = new Array();
    
    //if (isTestUser()) 
    //    ("Service :" + currentItem);
    pOverrideSearchFilters[0] = new nlobjSearchFilter('custrecord_pro_customer', null, 'is', currentCustomer);
    pOverrideSearchFilters[1] = new nlobjSearchFilter('custrecord_pro_service', null, 'is', currentItem);
    pOverrideSearchFilters[2] = new nlobjSearchFilter('custrecord_pro_postcode', null, 'is', postcodeZone);
    
    pOverrideSearchColumns[0] = new nlobjSearchColumn('custrecord_pro_fullpalletrate');
    pOverrideSearchColumns[1] = new nlobjSearchColumn('custrecord_pro_halfpalletrate');
    pOverrideSearchColumns[2] = new nlobjSearchColumn('custrecord_pro_qtrpalletrate');
    pOverrideSearchColumns[3] = new nlobjSearchColumn('custrecord_pro_micropalletrate');
    
    // perform search
    //var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride',null,pOverrideSearchFilters, pOverrideSearchColumns);
    var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride', 'customsearch_palletoverride', pOverrideSearchFilters, pOverrideSearchColumns);
    //var pOverrideSearchResults = false;
    
    // if no results then rerun search using alpha prefix only
    if (!pOverrideSearchResults) {
        var alphaPrefix = returnPostcodePrefixAlpha(postcodeZone);
        precedence = 1;
        pOverrideSearchFilters[2] = new nlobjSearchFilter('custrecord_pro_postcode', null, 'is', alphaPrefix);
        //var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride',null,pOverrideSearchFilters, pOverrideSearchColumns);
        var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride', 'customsearch_palletoverride', pOverrideSearchFilters, pOverrideSearchColumns);
        //pOverrideSearchResults = false;	
    } //if
    
    if (pOverrideSearchResults) {
        // Extract pricing from first record found
        if (precedence == 0) precedence = 11;
        var fullpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[0]);
        var halfpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[1]);
        var qtrpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[2]);
        var micropalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[3]);
        // Added Feb 2012 - logic to use half rate if quarter rate possible for the default service / zone
		if (!isNaN(qtrpalletrate)){
			qtrpalletrate = parseFloat(qtrpalletrate);			
		} else {
			qtrpalletrate = 0;
		}
		/*
        if (parseInt(qtrpalletrate) == 0) {
            var defaultPrices = getRatesforPalletItemZone(currentItem, palletZone);
            if (!isNaN(defaultPrices['qtrpalletrate']) && defaultPrices['qtrpalletrate'] > 0) 
                qtrpalletrate = defaultPrices['qtrpalletrate'];
			if (isTestUser()) alert ('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
        }  
        */      
		//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' Postcode=' + postcodeZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
    } //if
    else {
        // ORDER OF PRECEDENCE #2
        // construct search for customer-zone specific pricing
        
        // Before proceeding with custome-zone lookup perform a check for a pallet zone-override
        
        var pzoSearchFilters = new Array();
        var pzoSearchColumns = new Array();
        
        //alert(postcodeZone);	
        pzoSearchFilters[0] = new nlobjSearchFilter('custrecord_pzo_customer', null, 'is', currentCustomer);
        pzoSearchFilters[1] = new nlobjSearchFilter('custrecord_pzo_postcode', null, 'is', postcodeZone);
        
        pzoSearchColumns[0] = new nlobjSearchColumn('custrecord_pzo_zone');
        
        // perform search
        //var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride',null,pzoSearchFilters, pzoSearchColumns);
        var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride', 'customsearch_palletzoneoverride', pzoSearchFilters, pzoSearchColumns);
        
        // if zone-override found then reset postcodezone to override zone        
        if (pzoSearchResults) {
			//if (pzoSearchResults[0].getValue(pzoSearchColumns[0]) != pzoSearchResults[0].getValue(pzoSearchColumns[0]) && palletZone == '') {
				prevPalletZone = palletZone;
				palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
				precedence = 2;
				//postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
				//if (palletZone == null || palletZone == '') {
				//	ErrMsg += 'Note: customrecord_palletzoneoverride has no pricing / zone details. postcodeZone = ' + postcodeZone;
				//	return false;
				//}
			//}
        }
        else {
            // if no zone-override found then re-perform search based on alpha prefix only
            var alphaPrefix = returnPostcodePrefixAlpha(postcodeZone);
            pzoSearchFilters[1] = new nlobjSearchFilter('custrecord_pzo_postcode', null, 'is', alphaPrefix);
            //var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride',null,pzoSearchFilters, pzoSearchColumns);
            var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride', 'customsearch_palletzoneoverride', pzoSearchFilters, pzoSearchColumns);
            
            if (pzoSearchResults) {                
                //if (pzoSearchResults[0].getValue(pzoSearchColumns[0]) != pzoSearchResults[0].getValue(pzoSearchColumns[0]) && palletZone == '') {
                    prevPalletZone = palletZone;
                    palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
                    if (precedence == 0) precedence = 22;
                    //postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
                    //if (palletZone == null || palletZone == '') {
                    //	ErrMsg += 'Note: customrecord_palletzoneoverride has no pricing / zone details. postcodeZone = ' + postcodeZone;
                    //	return false;
                    //}
                //}
            } //if		
        } //else

		if (palletZone == '' || palletZone == null) palletZone = prevPalletZone; //Restore the zone as none present
		//nlapiLogExecution('AUDIT', 'PalletZone=' + palletZone + ' prevPalletZone=' + prevPalletZone, 'postcode = ' + fullpalletrate + ' alphaPrefix = ' + alphaPrefix);

        var pRateSearchFilters = new Array();
        var pRateSearchColumns = new Array();
        
        pRateSearchFilters[0] = new nlobjSearchFilter('custrecord_palletrate_customer', null, 'is', currentCustomer);
        pRateSearchFilters[1] = new nlobjSearchFilter('custrecord_palletrate_service', null, 'is', currentItem);
        pRateSearchFilters[2] = new nlobjSearchFilter('custrecord_palletrate_zone', null, 'is', palletZone);
        
        pRateSearchColumns[0] = new nlobjSearchColumn('custrecord_fullpalletrate');
        pRateSearchColumns[1] = new nlobjSearchColumn('custrecord_halfpalletrate');
        pRateSearchColumns[2] = new nlobjSearchColumn('custrecord_qtrpalletrate');
        pRateSearchColumns[3] = new nlobjSearchColumn('custrecord_micropalletrate');
        
        // perform search
        var pRateSearchResults = nlapiSearchRecord('customrecord_palletrate', 'customsearch_palletrate', pRateSearchFilters, pRateSearchColumns);               
        
        if (pRateSearchResults) {
            if (precedence == 0) precedence = 222;
            // Extract pricing from first record found
            var fullpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[0]);
            var halfpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[1]);
            var qtrpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[2]);
            var micropalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[3]);
            // Added Feb 2012 - logic to use half rate if quarter rate possible for the default service / zone
            if (!isNaN(qtrpalletrate)) {
                qtrpalletrate = parseFloat(qtrpalletrate);
            }
            else {
                qtrpalletrate = 0;
            }
			/*
            if (parseInt(qtrpalletrate) == 0) {
                var defaultPrices = getRatesforPalletItemZone(currentItem, palletZone);
                if (!isNaN(defaultPrices['qtrpalletrate']) && defaultPrices['qtrpalletrate'] > 0) 
                    qtrpalletrate = defaultPrices['qtrpalletrate'];
                	nlapiLogExecution('AUDIT', 'Precedence ' + precedence, 'qtrpalletrate = ' + qtrpalletrate);
                if (isTestUser()) 
                    alert('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
            }
            */
			//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' Postcode=' + postcodeZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
        }
        else {
        
            // ORDER OF PRECEDENCE #3
            // construct search for generic default pricing
            
            var pDefaultSearchFilters = new Array();
            var pDefaultSearchColumns = new Array();
            
            pDefaultSearchFilters[0] = new nlobjSearchFilter('custrecord_pallet_service', null, 'is', currentItem);
            pDefaultSearchFilters[1] = new nlobjSearchFilter('custrecord_zone', null, 'is', palletZone);
            
            pDefaultSearchColumns[0] = new nlobjSearchColumn('custrecord_defaultfullpalletrate');
            pDefaultSearchColumns[1] = new nlobjSearchColumn('custrecord_defaulthalfpalletrate');
            pDefaultSearchColumns[2] = new nlobjSearchColumn('custrecord_defaultqtrpalletrate');
            pDefaultSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultmicropalletrate');
            
            // perform search
            var pDefaultSearchResults = nlapiSearchRecord('customrecord_pallet_zoneservicepricing', 'customsearch_palletzoneservicepricing', pDefaultSearchFilters, pDefaultSearchColumns);
            
            if (pDefaultSearchResults) {
                // Extract pricing from first record found
                if (precedence == 0) precedence = 3;
                var fullpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[0]);
                var halfpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[1]);
                var qtrpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[2]);
                var micropalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[3]);
				//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' PalletZone=' + palletZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
           }
            else {
                // No pricing records found so return an error.
                ErrMsg += 'Please Note:\nThis service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available.';
                return false;
                
            } //else	
        } //else
    } //else
    // calculate rate based on pallet size(s) selected
    var rate = 0.0;
    
    //var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
    var palletIndex = 0;
    var palletCount = theConsRecord.getLineItemCount('recmachcustrecord_palletlistconsignmentlookup');
	var palletTotal = 0;
    //alert('palletCount = ' + palletCount + '\npalletIndex = ' + palletIndex);
    var sizeTrace = '';
    if (palletCount > 0 || palletIndex > 0) {
        for (var lc = 1; lc <= palletCount; lc++) { // 1 or more pallet lines exist already
            //if (lc != palletIndex) {
            var pallets = theConsRecord.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', lc);
            var palletSize = theConsRecord.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup', lc);
            var amount = 0.0;
            sizeTrace += ' [SIZ=' + palletSize + ' QTY=' + pallets;
            if (palletSize == getPalletSizeID('fullpallet')) 
                amount = parseInt(pallets) * fullpalletrate;
            if (palletSize == getPalletSizeID('halfpallet')) 
                amount = parseInt(pallets) * halfpalletrate;
            if (palletSize == getPalletSizeID('fullpalletovs')) 
                amount = parseInt(pallets) * fullpalletrate * 1.75;
            if (palletSize == getPalletSizeID('halfpalletovs')) 
                amount = parseInt(pallets) * halfpalletrate * 1.75;
            if (palletSize == getPalletSizeID('quarterpallet')) 
                amount = parseInt(pallets) * qtrpalletrate;
            if (palletSize == getPalletSizeID('micropallet')) 
                amount = parseInt(pallets) * micropalletrate;
            sizeTrace += ' AMT=' + amount + '] ';
           
            //nlapiLogExecution('AUDIT', "PalletSizes/Amounts", lc + ' : size = ' + palletSize + '\npallets = ' + pallets + '\namount = ' + amount);
			palletTotal += parseInt(pallets);
            rate += amount;
            //}
        }
    }
	
	 /*****************************************************
     *  Calculate fuel surcharge
     *  - To be moved into invoice.
     ****************************************************/
    var fuelSurchargePercent = parseFloat(theConsRecord.getFieldValue('custbody_fuelsurchargeratepercent'));
    var fuelSurcharge;
    
    if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) {
        fuelSurcharge = 0.00;
    }
    else {
        fuelSurcharge = (parseFloat(fuelSurchargePercent / 100.00) * parseFloat(rate)).toFixed(2);
    } //if
	ErrMsg += "Surcharge : " + fuelSurcharge;
    theConsRecord.setFieldValue('custbody_fuelsurcharge', fuelSurcharge);
    
    if (rate > 0) {
 
        //Added July 2012 - surcharges related to Olympics ...
        var deliveryType = getFormDeliveryType(theConsRecord.getFieldValue('customform'));
        var surchargePostCode = theConsRecord.getFieldValue('custbody_deliverypostcode');
        if (deliveryType == 'TT' || deliveryType == 'TH') {
            surchargePostCode = theConsRecord.getFieldValue('custbody_pickupaddresspostcode');
        }
        
        //var newSurcharge = parseFloat(getPostcodeSurcharge(surchargePostCode, false, palletTotal));
        var newSurcharge = 0;
        if (newSurcharge > 0) {
            theConsRecord.setFieldValue('custbody_surcharge_postcode', newSurcharge, false, false);
        }
        if (newSurcharge > 0) {
            rate += newSurcharge;
        }
               
       //if (isTestUser()) 
        ErrMsg += 'CurrentItem = ' + currentItemText + " Zone = " + palletZone + " Rate = " + rate + " newSurcharge = " + newSurcharge;
        theConsRecord.setLineItemValue('item', 'rate', 1, rate);
        theConsRecord.setLineItemValue('item', 'amount', 1, rate);
    	return theConsRecord;
        
    } //if
    else {
        ErrMsg += 'Please Note: This service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available.'
        ErrMsg += ' SizeTrace ' + sizeTrace;
        return false;
    }   
    
} //function

function returnPostcodePrefixAlpha(prefix){

    // create regular expression
    var prefixRegEx = /(^[A-Z]{1,2})([0-9]{1,2}$)/i;
    var alphaPrefix = prefix.replace(prefixRegEx, '$1');
    
    if (alphaPrefix == prefix) { // Must be not ending with a number but a letter e.g. SW1W ...
        prefixRegEx = /(^[A-Z]{1,2})([0-9]{1,2}[A-Z]{1}$)/i;
        alphaPrefix = prefix.replace(prefixRegEx, '$1');
    }
    return alphaPrefix.toUpperCase();
    
} //function

function getRatesforPalletItemZone(currentItem, palletZone){
var theRates = new Array();   
    if (currentItem && palletZone) {
        var pDefaultSearchFilters = new Array();
        var pDefaultSearchColumns = new Array();
        
        pDefaultSearchFilters[0] = new nlobjSearchFilter('custrecord_pallet_service', null, 'is', currentItem);
        pDefaultSearchFilters[1] = new nlobjSearchFilter('custrecord_zone', null, 'is', palletZone);
        
        pDefaultSearchColumns[0] = new nlobjSearchColumn('custrecord_defaultfullpalletrate');
        pDefaultSearchColumns[1] = new nlobjSearchColumn('custrecord_defaulthalfpalletrate');
        pDefaultSearchColumns[2] = new nlobjSearchColumn('custrecord_defaultqtrpalletrate');
        pDefaultSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultmicropalletrate');
        
        // perform search
        var pDefaultSearchResults = nlapiSearchRecord('customrecord_pallet_zoneservicepricing', 'customsearch_palletzoneservicepricing', pDefaultSearchFilters, pDefaultSearchColumns);
        
        if (pDefaultSearchResults) {
            // Extract pricing from first record found       
            theRates['fullpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[0]);
            theRates['halfpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[1]);
            theRates['qtrpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[2]);
            theRates['micropalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[3]);
        }
    }
	return theRates;
}

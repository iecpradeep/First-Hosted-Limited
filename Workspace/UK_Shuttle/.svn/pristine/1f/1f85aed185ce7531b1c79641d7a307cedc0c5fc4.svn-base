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

var html = '';
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

function importProcess(request, response, customerid, startdate, enddate){
    // Converts any imported consignments
    var theContext = nlapiGetContext(); // If not scheduled, look for URL parameters
    var testMode = null;
    if (theContext.getExecutionContext() == 'workflow') {
    	testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_import_testmode_wf');
    } else {
    	testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_import_testmode');
    }
    
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
    
    //if (theContext.getExecutionContext() != 'scheduled' && theContext.getExecutionContext() != 'workflow') {
    if (theContext.getExecutionContext() == 'suitelet') {
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
    mySearchFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'noneof', ('4','5','6')); // Ignore cancelled, processed & invoiced ones
    mySearchFilters[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
    mySearchFilters[6] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', ('1')); // Parcels only
    mySearchFilters[7] = new nlobjSearchFilter('custbody_apcimportfirstdate', null, 'isnotempty', null);
     */
	
	var daterange = 'onorbefore';
	if (invStartDate == invEndDate)
		 daterange = 'on';
	
    mySearchFilters[0] = new nlobjSearchFilter('entity', null, entityFilter, userid);
    mySearchFilters[1] = new nlobjSearchFilter('trandate', null, daterange, invEndDate);
    mySearchFilters[2] = new nlobjSearchFilter('custbody_syntheticimport', null, 'isnot', 'T');
    mySearchFilters[3] = new nlobjSearchFilter('custcol_donotreprice', 'item', 'isnot', 'T');
    
    if (invStartDate != invEndDate) mySearchFilters[3] = new nlobjSearchFilter('trandate', null, 'onorafter', invStartDate);
	
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
    mySearchColumns[17] = new nlobjSearchColumn('customform');
    mySearchColumns[18] = new nlobjSearchColumn('class');

    // Perform search ....
    var mySearchResults = nlapiSearchRecord('salesorder', 'customsearch_parcelimport', mySearchFilters, mySearchColumns);
    var recordsProcessed = 0;
    var consignmentIDList = new Array; // Used to store the IDs for completion after the SSO is committed
	var lastrecordID = 0;
	
    // Display results ....
    if (mySearchResults) {    
		var d = new Date();
        var totalCartons = 0;
        var totalWeight = 0.00;
        var totalValue = 0.00;
        var insuranceTotal = 0.00;
        var insuranceItems = 0; // Tracks the offset if insurance items present
        var fuelsurchargeTotal = 0.00;
        
        for (i = 0; i < mySearchResults.length; i++) {
			ErrMsg = '';
			submitResult = "";
            var NSid = mySearchResults[i].getValue(mySearchColumns[0]);
            var docnum = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[16]));
            var isSynthetic = false;
			if (docnum != null) {
				var docArray = docnum.split(':');
				if (docArray.length == 2) 
					docnum = docArray[1];
				if (docArray[0].indexOf('APC') < 0)
					isSynthetic = true; // E.g. the external ID has the form LDL:234233
			}
            var trandate = mySearchResults[i].getValue(mySearchColumns[12]);
            var custRef = mySearchResults[i].getValue(mySearchColumns[8]);
            var consignee = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[11]));
            var servicetype = nlapiEscapeXML(mySearchResults[i].getText(mySearchColumns[2]));
            var formID = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[17]));
            
            consignmentIDList[i] = mySearchResults[i].getValue(mySearchColumns[9]);
			lastrecordID = consignmentIDList[i];
            var theConsingmentRec = nlapiLoadRecord('salesorder', consignmentIDList[i]);
			if (theConsingmentRec.getFieldValue('custbody_syntheticimport') != 'T') {
				nlapiLogExecution('AUDIT', 'Load record : ' + consignmentIDList[i], 'docnum:' + docnum);
				var currentStatus = theConsingmentRec.getFieldValue('custbody_consignmentstatus');
				if (currentStatus == "" || currentStatus == null)
					currentStatus = "1"; // Entered by default
				var repricedStatus = '5'; // Processed by Default
				if (theConsingmentRec.getFieldValue('custbody_receivingdepot') == '' || theConsingmentRec.getFieldValue('custbody_receivingdepot') == null || theConsingmentRec.getFieldValue('custbody_receivingdepot') == '0' || isSynthetic) {
					repricedStatus = currentStatus; // Needs to be exported, so leave as it is not processed
					theConsingmentRec.setFieldValue('custbody_syntheticimport', 'T'); // This will screen it out from further pricing
				}
				//nlapiLogExecution('AUDIT', 'Receiving Depot Test New ' + theConsingmentRec.getFieldValue('custbody_receivingdepot'), 'Depot:' + theConsingmentRec.getFieldValue('custbody_receivingdepot') + ' Test=0:' + (theConsingmentRec.getFieldValue('custbody_receivingdepot') == '0'));
				
				// Set up the right area / zone etc.
				var isValidPostCode = false;
				var shipCountry = 1;
				var shipPostCode = '';
				var type = 'delivery';
				var addr4 = ''; // Needed if Ireland - Country == 2
				//if (parseInt(theConsingmentRec.getFieldValue('custbody_receivingdepot')) == 95) type = 'pickup';
				if (getDeliveryType(theConsingmentRec.getFieldValue('class'), theConsingmentRec.getFieldValue('custbody_receivingdepot')) != 'HT') 
					type = 'pickup';
				
				if (type == 'delivery') {
					shipPostCode = theConsingmentRec.getFieldValue('custbody_deliverypostcode');
					shipCountry = theConsingmentRec.getFieldValue('custbody_deliverycountryselect');
					addr4 = theConsingmentRec.getFieldValue('custbody_deliveryaddr4');
				} //if
				else {
					shipPostCode = theConsingmentRec.getFieldValue('custbody_pickupaddresspostcode');
					shipCountry = theConsingmentRec.getFieldValue('custbody_pickupcountryselect');
					addr4 = theConsingmentRec.getFieldValue('custbody_pickupaddr4');
				} //else           
				if (shipPostCode.substring(0, 2) == 'RD' || shipCountry == '2') { // Ireland service in imported record - process differently ...
					var serviceNo = parseInt(shipPostCode.substring(2)); //RD 1, 2,3,4
					var addrArray = new Array();
					if (addr4 != null && addr4 != '') 
						addrArray = addr4.split(','); //Look for postcode normally stored in addr4 appended to this field with a comma             
					if (addrArray != null && addrArray.length >= 2) {
						shipPostCode = addrArray[1];
						if (shipPostCode.toUpperCase() == "IRELAND") 
							shipPostCode = "EIRE";
						if (shipPostCode.toUpperCase() == "DUBLIN") 
							shipPostCode = "DUB";
					}
					else { //Default as no real one exists
						if (serviceNo == 1) 
							shipPostCode = "BT11 1AA";
						if (serviceNo == 2) 
							shipPostCode = "BT29 1AA";
						if (serviceNo == 3) 
							shipPostCode = "DUB";
						shipCountry = 2;
						if (serviceNo == 4) 
							shipPostCode = "EIRE";
						shipCountry = 2;
					}
					if (type == 'delivery') {
						theConsingmentRec.setFieldValue('custbody_deliverypostcode', shipPostCode);
						theConsingmentRec.setFieldValue('custbody_deliverycountryselect', shipCountry);
					} //if
					else {
						theConsingmentRec.setFieldValue('custbody_pickupaddresspostcode', shipPostCode);
						theConsingmentRec.setFieldValue('custbody_pickupcountryselect', shipCountry);
					} //else
				}
				
				ErrMsg += " PostCode = " + shipPostCode + " : ";
				
				if (shipPostCode && shipCountry) {
					if (isValidPostcode(shipPostCode, shipCountry)) {
						var postcodePrefix = returnCountryPostcodePrefix(shipPostCode, shipCountry);
						theConsingmentRec.setFieldValue('custbody_postcodezone', postcodePrefix);
						var postcodeSearchFilters = new Array();
						var postcodeSearchColumns = new Array();
						
						postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
						postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
						
						postcodeSearchColumns[0] = new nlobjSearchColumn('custrecord_area');
						postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_depotnumber');
						postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_parceldeliveryzone');
						postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deldays');
						
						var postcodeSearchResults = nlapiSearchRecord('customrecord_postcodetable', null, postcodeSearchFilters, postcodeSearchColumns);
						//var postcodeSearchResults = true;
						
						// retrieve area and depot number
						if (postcodeSearchResults) {
							var area = postcodeSearchResults[0].getValue(postcodeSearchColumns[0]);
							var depot = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
							var delzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
							var altArea = '';
							var currentItem = theConsingmentRec.getLineItemValue('item', 'item', 1);
							if (currentItem != '') 
								altArea = getAltAreaforServiceArea(area, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
							theConsingmentRec.setFieldValue('custbody_deliverydays', postcodeSearchResults[0].getValue(postcodeSearchColumns[3]));
							
							// Local exceptions custom list check - added July 2011
							//if (isTestUser()){
							//alert(getPostCodeLocalException(shipPostCode));
							var depotexception = getPostCodeLocalException(shipPostCode);
							if (depotexception != 0) 
								depot = depotexception; // This overrides the 'real' depot with the local
							//}
							
							// populate custom fields                   
							if (type == 'delivery') {
								theConsingmentRec.setFieldValue('custbody_parcelarea', area);
								if (altArea != area) 
									theConsingmentRec.setFieldValue('custbody_parcelarea2', altArea);
								theConsingmentRec.setFieldValue('custbody_receivingdepot', depot);
								theConsingmentRec.setFieldValue('custbody_parceldeliveryzone', delzone);
							} //if
							else {
								theConsingmentRec.setFieldValue('custbody_collectparcelarea', area);
								if (altArea != area) 
									theConsingmentRec.setFieldValue('custbody_collectparcelarea2', altArea);
								theConsingmentRec.setFieldValue('custbody_sendingdepot', depot);
							}
							var submitID = nlapiSubmitRecord(theConsingmentRec, false, true);
							theConsingmentRec = nlapiLoadRecord('salesorder', submitID);
							ErrMsg = 'Postcode Area ' + area + ' Depot ' + depot + ' ' + ' Delzone ' + delzone + ' ';
							nlapiLogExecution('AUDIT', 'Postcode ' + shipPostCode, ' postcodePrefix:' + postcodePrefix + ' Area:' + area + " Altarea:" + altArea + " Depot:" + depot + " Delzone:" + delzone);
						}
						else {
							ErrMsg = 'ERROR:Postcode ' + shipPostCode + ' does not exist.';
						}
					} //if
					else {
						ErrMsg = 'ERROR:Postcode ' + shipPostCode + ' not a valid format.';
					}
				} //if
				// Area setup completed
				var deliveryType = getDeliveryType(theConsingmentRec.getFieldValue('class'), theConsingmentRec.getFieldValue('custbody_receivingdepot'));
				var formCols = new Array('custrecord_formservicetype', 'custrecord_formusertype', 'custrecord_formdeliverytype');
				var formVals = new Array(1, 2, 3); //Parcel, Admin, HT
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
				
				var pricedConsingmentRec = getRates(theConsingmentRec);
				// re-schedule if running out ...
				if (theContext.getExecutionContext() == 'scheduled' && theContext.getRemainingUsage() <= 50 && (i + 1) < mySearchResults.length) {
					var status = nlapiScheduleScript(theContext.getScriptId(), theContext.getDeploymentId())
					if (status == 'QUEUED') 
						break;
				}
				else {
					if (pricedConsingmentRec) {
						var amount = pricedConsingmentRec.getLineItemValue('item', 'amount', 1);
						//var ServiceArray = mySearchResults[i].getValue(mySearchColumns[1]).split(' ');
						//var service = nlapiEscapeXML(ServiceArray[0]);
						var service = theConsingmentRec.getLineItemText('item', 'item', 1);
						//pricedConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115); //SR-GB 	
						
						//var parcels = parseInt(mySearchResults[i].getValue(mySearchColumns[5]));
						var parcels = parseInt(theConsingmentRec.getLineItemValue('item', 'custcol_consignment_numberofparcels', 1));
						totalCartons += parcels; // for footer ...
						//var parcelweight = parseFloat(mySearchResults[i].getValue(mySearchColumns[6]));
						var parcelweight = parseFloat(theConsingmentRec.getLineItemValue('item', 'custcol_totalweightparcels', 1));
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
						theConsingmentRec.setFieldValue('custbody_fuelsurcharge_4dp', fuelsurcharge);
						
						var town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[13]));
						if (town == null || town == '') 
							town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[3]));
						var postcode = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[4]));
						var fuel = mySearchResults[i].getValue(mySearchColumns[7]);
						
						var closeURL = '<a href="/app/accounting/transactions/salesordermanager.nl?type=closeremaining&whence=&trantype=salesorder&id=' + mySearchResults[i].getValue(mySearchColumns[9]) + '" target="_blank">Close ...</a>';
						
						theConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115); //SR-GB 	
						theConsingmentRec.setLineItemValue('item', 'amount', 1, amount);
						theConsingmentRec.setLineItemValue('item', 'rate', 1, amount);
						theConsingmentRec.setLineItemValue('item', 'custcol_fuelsurchargeamount', 1, fuelsurcharge);
						
						var submitID = nlapiSubmitRecord(theConsingmentRec, false, true);
						
						if (submitID != consignmentIDList[i]) {
							submitResult = "UPD ERR";
						}
						else {
							var commitConsignmentRec = nlapiLoadRecord('salesorder', submitID);
							commitConsignmentRec.setFieldValue('custbody_consignmentstatus', repricedStatus);
							commitConsignmentRec.setFieldValue('custbody_lastpriced_dt', nlapiDateToString(d, 'date'));
							commitConsignmentRec.setFieldValue('memo', 'Repriced OK :' + amount + ' status : ' + repricedStatus + ' : ' + d);
							if (parentForm != null && parentForm != '') {
								commitConsignmentRec.setFieldValue('customform', parentForm); // The relevant form for type
								commitConsignmentRec.setFieldValue('custbody_formid', parentForm);
							}
							nlapiSubmitRecord(commitConsignmentRec, false, true);
							submitResult = "UPD OK";
						}
						nlapiLogExecution('AUDIT', 'Order :' + theAcct + ":" + NSid + ":" + deliveryType + ":" + parentForm, submitResult + ' : ' + NSid + ' : ' + docnum + ' : ' + trandate + ' : ' + service + ' : ' + servicetype + ' : ' + consignee + ' : ' + custRef + ' : ' + town + ' : ' + postcode + ' : ' + parcels + ' : ' + parcelweight + ' : ' + amount + ' : ' + fuelsurcharge + ' : ' + insurance);
						html += '<tr><td>' + submitResult + '</td><td>' + NSid + '</td><td>' + docnum + '</td><td>' + trandate + '</td><td>' + service + '</td><td>' + servicetype + '</td><td>' + consignee + '</td><td>' + custRef + '</td><td>' + town + '</td><td>' + postcode + '</td><td>' + parcels + '</td><td>' + parcelweight + '</td><td>' + amount + '</td><td>' + fuelsurcharge + '</td><td>' + insurance + '</td><td>' + closeURL + '</td></tr>';
					} //if (pricedConsingmentRec)
					else { // Set to cancelled w. Memo set to Errmsg - move to next...
						nlapiLogExecution('AUDIT', 'Pricing Error:TRANID:' + NSid, ErrMsg);
						var commitConsignmentRec = nlapiLoadRecord('salesorder', consignmentIDList[i]);
						commitConsignmentRec.setFieldValue('custbody_consignmentstatus', '11'); // Repriced - will keep being re-scheduled until resolved					
						if (parentForm != null && parentForm != '') 
							commitConsignmentRec.setFieldValue('customform', parentForm); // The relevant form for type
						commitConsignmentRec.setFieldValue('memo', 'ERROR:' + ErrMsg);
						nlapiSubmitRecord(commitConsignmentRec, false, true);
					//break;
					} // if (pricedConsingmentRec)
					html += '<tr><td colspan=\"16\">Result : ' + ErrMsg + '</td></tr>';
					recordsProcessed++;
				} // If usage limit being reached / reschedule
			} // Synthetic != T
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
    
    if (theContext.getExecutionContext() == 'suitelet') {
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

    nlapiLogExecution('AUDIT', 'APC:' + invStartDate + ' - ' + invEndDate, "PROCESSED:" + recordsProcessed + ":CUST:" + theAcct  + ":LastID:" + lastrecordID + ":USAGEREMAINING:" + theContext.getRemainingUsage());

}

function updateJobWorkflow(request, response) {
	var theContext = nlapiGetContext();
	var externalid = theContext
			.getSetting('SCRIPT', 'custscript_externalid_wf');

	var externalidSearchFilters = new Array();
	var externalidSearchColumns = new Array();

	externalidSearchFilters[0] = new nlobjSearchFilter('externalid', null,
			'anyof', externalid);

	externalidSearchColumns[0] = new nlobjSearchColumn('internalid');

	var externalidSearchResults = nlapiSearchRecord('salesorder', null,
			externalidSearchFilters, externalidSearchColumns);

	if (externalidSearchResults) { //
		var soRecordId = externalidSearchResults[0]
				.getValue(externalidSearchColumns[0]);
		var theConsingmentRec = nlapiLoadRecord('salesorder', soRecordId, {
			recordmode : 'dynamic'
		});
		ErrMsg = '';
		nlapiLogExecution('AUDIT', 'PROCESSING:' + externalid, "EXTERNALID:"
				+ externalid + " ITEMID:"
				+ theConsingmentRec.getLineItemValue('item', 'item', 1));
		var userid = theConsingmentRec.getFieldValue('entity');
		importProcess(request, response, userid, null, null);
		/*
		var pricedConsingmentRec = getRates(theConsingmentRec);
		// re-schedule if running out ...
		if (pricedConsingmentRec) {
			
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
		    
			var d = new Date();
	        var totalCartons = 0;
	        var totalWeight = 0.00;
	        var totalValue = 0.00;
	        var insuranceTotal = 0.00;
	        var insuranceItems = 0; // Tracks the offset if insurance items present
	        var fuelsurchargeTotal = 0.00;

			var amount = pricedConsingmentRec.getLineItemValue('item',
					'amount', 1);
			// var ServiceArray =
			// mySearchResults[i].getValue(mySearchColumns[1]).split(' ');
			// var service = nlapiEscapeXML(ServiceArray[0]);
			var service = theConsingmentRec.getLineItemText('item', 'item', 1);
			// pricedConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115);
			// //SR-GB

			// var parcels =
			// parseInt(mySearchResults[i].getValue(mySearchColumns[5]));
			var parcels = parseInt(theConsingmentRec.getLineItemValue('item',
					'custcol_consignment_numberofparcels', 1));
			totalCartons += parcels; // for footer ...
			// var parcelweight =
			// parseFloat(mySearchResults[i].getValue(mySearchColumns[6]));
			var parcelweight = parseFloat(theConsingmentRec.getLineItemValue(
					'item', 'custcol_totalweightparcels', 1));
			totalWeight += parcelweight;

			var insurance = parseFloat(pricedConsingmentRec
					.getFieldValue('custbody_insurancesurcharge'));
			if (isNaN(insurance) || insurance == null || insurance == '') {
				insurance = 0.00;
			} else {
				insurance = parseFloat(insurance).toFixed(2);
			}
			theConsingmentRec.setFieldValue('custbody_insurancesurcharge',
					insurance);

			var fuelsurcharge = parseFloat(pricedConsingmentRec
					.getFieldValue('custbody_fuelsurcharge'));
			if (isNaN(fuelsurcharge) || fuelsurcharge == null
					|| fuelsurcharge == '') {
				fuelsurcharge = 0.00;
			} else {
				fuelsurcharge = parseFloat(fuelsurcharge);
			}
			// if (fuelsurcharge == 0.00 && fuelPercent > 0.00)
			if (fuelPercent > 0.00)
				fuelsurcharge = (parseFloat(fuelPercent / 100) * parseFloat(amount))
						.toFixed(4);
			theConsingmentRec.setFieldValue('custbody_fuelsurcharge',
					fuelsurcharge);
			theConsingmentRec.setFieldValue('custbody_fuelsurcharge_4dp',
					fuelsurcharge);

			var town = nlapiEscapeXML(theConsingmentRec.getFieldValue('custbody_deliveryaddr3'));
			if (town == null || town == '')
				town = nlapiEscapeXML(theConsingmentRec.getFieldValue('custbody_deliveryaddr4'));
			var postcode = nlapiEscapeXML(theConsingmentRec.getFieldValue('custbody_deliverypostcode'));
			var fuel = theConsingmentRec.getFieldValue('custbody_fuelsurcharge');

			theConsingmentRec.setLineItemValue('item', 'taxcode', 1, 115); // SR-GB
			theConsingmentRec.setLineItemValue('item', 'amount', 1, amount);
			theConsingmentRec.setLineItemValue('item', 'rate', 1, amount);
			theConsingmentRec.setLineItemValue('item',
					'custcol_fuelsurchargeamount', 1, fuelsurcharge);

			var submitID = nlapiSubmitRecord(theConsingmentRec, false, true);

			if (submitID != consignmentIDList[i]) {
				submitResult = "UPD ERR";
			} else {
				var commitConsignmentRec = nlapiLoadRecord('salesorder',
						submitID);
				commitConsignmentRec.setFieldValue(
						'custbody_consignmentstatus', repricedStatus);
				commitConsignmentRec.setFieldValue('memo', 'Repriced OK :'
						+ amount + ' status : ' + repricedStatus + ' : ' + d);
				if (parentForm != null && parentForm != '')
					commitConsignmentRec
							.setFieldValue('customform', parentForm); // The
																		// relevant
																		// form
																		// for
																		// type
				nlapiSubmitRecord(commitConsignmentRec, false, true);
				submitResult = "UPD OK";
			}
			nlapiLogExecution('AUDIT', 'Order :' + theAcct + ":" + NSid + ":"
					+ deliveryType + ":" + parentForm, submitResult + ' : '
					+ NSid + ' : ' + docnum + ' : ' + trandate + ' : '
					+ service + ' : ' + servicetype + ' : ' + consignee + ' : '
					+ custRef + ' : ' + town + ' : ' + postcode + ' : '
					+ parcels + ' : ' + parcelweight + ' : ' + amount + ' : '
					+ fuelsurcharge + ' : ' + insurance);
		} //if (pricedConsingmentRec)
		*/
	}

}

function updateJobs(request, response){
    // Reassigns drivers for passed consignments
	ErrMsg = '';
	html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
    html += createReportHeader('Update Jobs - Following Error(s) were found.');

    var theContext = nlapiGetContext();
	
    var soRecords = new Array;
    if (request.getParameter('custparam_cids') != null) {
        var soRecords = request.getParameter('custparam_cids').split(',');
    }
    else {
        soRecords[0] = request.getParameter('custparam_cid');
    }
    
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
        var soRecordId = soRecords[soRec];
        if (soRecordId) {
        
            var allocateParams = soRecordId.split(':');
            var serviceID = allocateParams[1];
            var soRecord = nlapiLoadRecord('salesorder', allocateParams[0], {
                recordmode: 'dynamic'
            });
			ErrMsg = '';
    		var currentItemID = soRecord.getLineItemValue('item', 'item', 1);            
            var recStatus = soRecord.getFieldValue('custbody_consignmentstatus');
            //if ((recStatus != '4' && recStatus != '6' && recStatus != '7') && (soRecord.getFieldValue('item') != serviceID)) { //Only change if different
 			if (currentItemID != serviceID) {
                //if (serviceID != '') 
                soRecord.setLineItemValue('item', 'item', 1, serviceID);
				var pricedConsingmentRec = getRates(soRecord);
                //soRecord.setFieldValue('custbody_consignmentstatus', '11'); // For Repricing
                if (pricedConsingmentRec) {
					var internalid = nlapiSubmitRecord(pricedConsingmentRec, false, true);
					html += '<tr><td colspan=\"16\">Error: update ID: ' + internalid + '</td></tr>';
				} else {
					html += '<tr><td colspan=\"16\">Result : ' + ErrMsg + '</td></tr>';
				}
            }
        }
    }
    
    // Go back to Consignment manager with parameters passed back ...
    var params = new Array();
    params['custparam_cn'] = request.getParameter('custparam_cn');
    params['custparam_ct'] = request.getParameter('custparam_ct');
    params['custparam_dt'] = request.getParameter('custparam_dt');
    params['custparam_dtfrom'] = request.getParameter('custparam_dtfrom');
    params['custparam_dr'] = request.getParameter('custparam_dr');
    params['version'] = request.getParameter('version');
    params['selectedtab'] = 'subtab7';

	var returnURL = "";
    var script = '';
	var deployment = '';
	
    
    if (params['version'] == '2') {
        //if (params['custparam_cm'] == null) { //Consignment or Transport Manager
        if (request.getParameter('custparam_cids') != null && request.getParameter('custparam_cids') != '') 
            nlapiLogExecution('AUDIT', 'Update Job(s)', "JOB(S):" + request.getParameter('custparam_cids'));
        
        if (params['custparam_tm'] == null) { //Consignment or Transport Manager
            script = 'customscript_consignmentmanager_v2';
            deployment = 'customdeploy_consignmentmanager_v2';
        }
        else {
            script = 'customscript_transportmanagerv2';
            deployment = 'customdeploy_transportmanagerv2';
        }
    }
    else {
        //if (params['custparam_cm'] == null) { //Consignment or Transport Manager
        if (params['custparam_tm'] == null) { //Consignment or Transport Manager
            script = 'customscript_consignmentmanager';
            deployment = 'customdeploy1';
        }
        else {
            script = 'customscript_transportmanager';
            deployment = 'customdeploy_transportmanager';
        }
    }
    if (theContext.getExecutionContext() == 'suitelet' && ErrMsg.indexOf("Error:") >= 0) {
		var processedURLMaster = "<a href='" + nlapiResolveURL('SUITELET', script, deployment) + "&custparam_cn=" + params['custparam_cn'] + "&custparam_ct=" + params['custparam_ct'] + "&custparam_dt=" + params['custparam_dt'] + "&custparam_dtfrom=" + params['custparam_dtfrom'] + "&custparam_dr=" + params['custparam_dr'] + "'>Click here to return to Consignment Manager.</a>";
        html += '<tr><td colspan=\"16\">End of Report : ' + processedURLMaster + '</td></tr>';
		html += '</table>';
		response.write(html);
	}
	else {	
		nlapiLogExecution('AUDIT', 'Update Job(s)', "JOB(S):" + request.getParameter('custparam_cids'));
		nlapiSetRedirectURL('SUITELET', script, deployment, false, params);
	}
}

function processImportCustomers(request, response){

    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_importcustomers_testmode');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = nlapiGetContext().getSetting('SCRIPT', 'custscript_ignoreimportfreq');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
    var savedsearchCustomer = nlapiGetContext().getSetting('SCRIPT', 'custscript_importsearchcustomer');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
        savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
    var invStartDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt') != null) 
        invStartDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt'));
    
    var invEndDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt') != null) 
        invEndDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt'));
    
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
                    	importProcess(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
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

function processImportCustomersSched(request, response){ // Scheduled script version
    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_importcustomer_testmode_sched');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = nlapiGetContext().getSetting('SCRIPT', 'custscript_importcustfrequency_sched');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
    var savedsearchCustomer = nlapiGetContext().getSetting('SCRIPT', 'custscript_importsearchcustomer_sched');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
        savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
    var invStartDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt_sched') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt_sched') != null) 
        invStartDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_simportdt_sched'));
    
    var invEndDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt_sched') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt_sched') != null) 
        invEndDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_eimportdt_sched'));
    
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
            nlapiLogExecution('AUDIT', 'importProcess:' + sDTparam + ' - ' + eDTparam, "CUST:" + entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
            importProcess(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
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

function createReportHeader(theTitle){
    var reportTitle = 'Imported Consignments for : ' + theAcct;
    if (theTitle) reportTitle = theTitle;
	
    var header = '<tr><td colspan=\"13\" align=\"center\"><h1>' + reportTitle + '</h1></td></tr>';
    //header += '<tr><td colspan=\"6\" ' + fontStyle1 + '><h1>APC Delivery Manifest</h1></td><td></td><td colspan=\"5\" ' + fontStyle1 + ' align=\"right\"><h1>' + theLongDate + '</h1></td></tr>';
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
	nlapiLogExecution('DEBUG', 'customrecord_formidmatrix', 'formId:' + formId);
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

function getFormShipType(theClass){
	var theType = '';
	var theClassRec = nlapiLoadRecord('class', theClass);
	if (theClassRec.getFieldValue('custrecord_class_parcelservice') == 'T') theType = 'parcel'
	if (theClassRec.getFieldValue('custrecord_class_palletservice') == 'T') theType = 'pallet'
    return theType;
}

function getFormOrderType(customForm){
    return 'CONSIGNMENT';
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
    ErrMsg += '\nForm:' + customForm + ' DeliveryID:' + theDeliveryID + ' ';
}

function getDeliveryType(theClass,deliveryDepot){
    if (parseInt(theClass) == 6 || parseInt(theClass) == 10){
		if (parseInt(deliveryDepot) == 95 || deliveryDepot == '95') {
			return 'TH';
		}
		else {
			return 'TT';
		}
	}
	else  {
			return 'HT';
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

// ============== Pricing logic below  - Parcels ==================

function getRates(theConsRecord){
    // Retrieve the current item selected and load the record	
    var currentItem = theConsRecord.getLineItemValue('item', 'item', 1);
 
  	var deliveryType = getDeliveryType(theConsRecord.getFieldValue('class'),theConsRecord.getFieldValue('custbody_receivingdepot'));
    var deliveryDays = parseInt(theConsRecord.getFieldValue('custbody_deliverydays'));
    if (deliveryDays == 1 && (currentItem == '35' || currentItem == '43' || currentItem == '44' || currentItem == '58')) {
        ErrMsg += ' This 2 day service is not available in a 1 day delivery zone.';
        return false;
    }
    
    /****************************************
     * New search for item parameter record
     **/
	ErrMsg = '1. Item : ' + currentItem + ' ';
    var ipSearchFilters = new Array();
    var ipSearchColumns = new Array();
    
    ipSearchFilters[0] = new nlobjSearchFilter('custrecord_ip_item', null, 'is', currentItem);
    
    ipSearchColumns[0] = new nlobjSearchColumn('custrecord_ip_maximumweight');
    ipSearchColumns[1] = new nlobjSearchColumn('custrecord_ip_xsservice');
    ipSearchColumns[2] = new nlobjSearchColumn('custrecord_ip_xsserviceflag');
    ipSearchColumns[3] = new nlobjSearchColumn('custrecord_ip_ncservice');
    ipSearchColumns[4] = new nlobjSearchColumn('custrecord_ip_ncserviceflag');
    ipSearchColumns[5] = new nlobjSearchColumn('custrecord_ip_singleitem');
    ipSearchColumns[6] = new nlobjSearchColumn('custrecord_ip_baseservice');
    ipSearchColumns[7] = new nlobjSearchColumn('custrecord_ip_serviceshortname');
    
    // perform search
    var ipSearchResults = nlapiSearchRecord('customrecord_itemparameters', null, ipSearchFilters, ipSearchColumns);
    
    if (!ipSearchResults) {
        ErrMsg += 'Item Parameter Error';
        return false;
        
    } //if
    // *** var itemRecord = nlapiLoadRecord('serviceitem',currentItem);
    
    // Retrieve flag from current item record
    // ***var ncServiceFlag = itemRecord.getFieldValue('custitem_ncserviceflag');
    var ncServiceFlag = ipSearchResults[0].getValue(ipSearchColumns[4]);
    
    //set APC integration non convey flag
    if (ncServiceFlag == 'T') {
        theConsRecord.setFieldValue('custbody_nonconvey', 'T');
    } //if
    else {
        theConsRecord.setFieldValue('custbody_nonconvey', 'F');
    } //else
    // Retrieve current parcel area
    var parcelArea = theConsRecord.getFieldValue('custbody_parcelarea');
	if (parcelArea == null || parcelArea == '') parcelArea = 0;
    var altArea = '';
    theConsRecord.setFieldValue('custbody_parcelarea2', '');
    if (currentItem != '') 
        altArea = getAltAreaforServiceArea(parcelArea, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
    //    alert("Area :" + parcelArea + " AltArea :" + altArea);
    if (parcelArea != altArea) 
        theConsRecord.setFieldValue('custbody_parcelarea2', altArea);
    if (theConsRecord.getFieldValue('custbody_parcelarea2') != '') 
        parcelArea = theConsRecord.getFieldValue('custbody_parcelarea2');
    
    //if (parcelArea.length ==0) parcelArea = theConsRecord.getFieldValue('custbody_collectparcelarea');
    
    //if (isTestUser()) alert('parcelArea = ' + parcelArea);
    //alert(getServicesforArea(parcelArea, false));
    
    // Retrieve current customer
    var currentCustomer = theConsRecord.getFieldValue('entity');
    
    // Open the parameters record
    var paramsRecord = nlapiLoadRecord('customrecord_parameters', 1);
    
    var changeService = false;
    var changeServiceTo;
    var changeToXS = false;
    var surcharge = 0;
    var useBaseService = false;
    var baseService = 0;
    var collectRate = 0;
    
    /*****************************************************
     *  Average parcel weight calculation
     ****************************************************/
    // Get number of parcels and parcel weight
    var numberOfParcels = parseInt(theConsRecord.getLineItemValue('item', 'custcol_consignment_numberofparcels', 1));
    var consignmentWeight = parseInt(theConsRecord.getLineItemValue('item', 'custcol_totalweightparcels', 1));
	ErrMsg += '\n2. Parcels + weight : ' + numberOfParcels + ' parcels ' + consignmentWeight + ' KG ';
	/*
	ErrMsg += ' : ';
    if (!isNaN(numberOfParcels) && !isNaN(consignmentWeight)) {
        if (numberOfParcels * consignmentWeight <= 0) 
			ErrMsg += 'Not a valid weight.';
            return false; // Not a valid weight
    }
    */
	// Calculate average weight of each parcel
    var parcelWeight = Math.round(consignmentWeight / numberOfParcels);
	ErrMsg += ' - Parcel avg. weight : ' + parcelWeight + ' KG ';    
    
    /*****************************************************
     *  Single service check - check to see if service can
     *  only have one parcel
     ****************************************************/
    // Retrieve flag from current item record
    // *** var singleService = itemRecord.getFieldValue('custitem_singleitem');
    var singleService = ipSearchResults[0].getValue(ipSearchColumns[5]);    
    if (singleService == 'T') {
        if (numberOfParcels > 1) {
            ErrMsg += 'Error: Only one parcel is allowed for this service. (E01)';
            return false;
        } //if		
    } //if
    /*****************************************************
     *  Maximum Weight check - check to see if average item
     *  weight exceeds the maximum weight for parcels
     *  defined in the params table
     ****************************************************/
    // Get maximum weight from params record
    var paramsMaxWeight = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_maxparcelweight'));
    ;
    
    // If weight exceeds maximum for system then error
    if (!isNaN(paramsMaxWeight) && parcelWeight > paramsMaxWeight) {
        ErrMsg += ' Error: The weight specified exceeds the maximum for parcels (' + paramsMaxWeight + ' kg).\nThis consignment must be palletised. (E02)';
        return false;
        
    } //if
    /*****************************************************
     *  XS Weight check - check to see if average item
     *  weight exceeds maximum for service and if so change
     *  to an XS service if available.  Only perform if item
     *  selected is not an XS service.
     ****************************************************/
    // Retrieve flag from current item record
    // *** var xsServiceFlag = itemRecord.getFieldValue('custitem_xsserviceflag');
    var xsServiceFlag = ipSearchResults[0].getValue(ipSearchColumns[2]);
	ErrMsg += '\n 3. XS : ' + xsServiceFlag;
    
    if (xsServiceFlag == 'F') {
        // Get maximum weight for service
        // *** var maxWeight = parseInt(itemRecord.getFieldValue('custitem_maximumweight'));
        var maxWeight = parseInt(ipSearchResults[0].getValue(ipSearchColumns[0]));
        
        // *** var xsService = itemRecord.getFieldValue('custitem_xsservice');
        var xsService = ipSearchResults[0].getValue(ipSearchColumns[1]);
        
        // If weight exceeds maximum for service
        if (!isNaN(maxWeight) && parcelWeight > maxWeight) {
            // If no XS service defined then error
            if (xsService == null || xsService == '') {
                ErrMsg += 'Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg)\n(E03)';
                return false;
                
            } //if
            else {
                // Construct search to check that the XS service is available for the current parcel area
                var xsSearchFilters = new Array();
                var xsSearchColumns = new Array();
                
                xsSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', xsService);
                xsSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', parcelArea);
                
                xsSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                
                // perform search
                var xsSearchResults = nlapiSearchRecord('customrecord_areaservice', null, xsSearchFilters, xsSearchColumns);
                
                // If XS available then prompt for change to XS service
                if (xsSearchResults) {
                    // check that xs service has a base service entry for price calculation purposes
                    //baseService = nlapiLookupField('serviceitem',xsService,'custitem_baseservice'); //zzz
                    
                    /****************************************
                     * New search for xs item parameter record
                     **/
                    var xsipSearchFilters = new Array();
                    var xsipSearchColumns = new Array();
                    
                    xsipSearchFilters[0] = new nlobjSearchFilter('custrecord_ip_item', null, 'is', xsService);
                    
                    xsipSearchColumns[0] = new nlobjSearchColumn('custrecord_ip_maximumweight');
                    xsipSearchColumns[1] = new nlobjSearchColumn('custrecord_ip_xsservice');
                    xsipSearchColumns[2] = new nlobjSearchColumn('custrecord_ip_xsserviceflag');
                    xsipSearchColumns[3] = new nlobjSearchColumn('custrecord_ip_ncservice');
                    xsipSearchColumns[4] = new nlobjSearchColumn('custrecord_ip_ncserviceflag');
                    xsipSearchColumns[5] = new nlobjSearchColumn('custrecord_ip_singleitem');
                    xsipSearchColumns[6] = new nlobjSearchColumn('custrecord_ip_baseservice');
                    xsipSearchColumns[7] = new nlobjSearchColumn('custrecord_ip_serviceshortname');
                    
                    
                    // perform search
                    var xsipSearchResults = nlapiSearchRecord('customrecord_itemparameters', null, xsipSearchFilters, xsipSearchColumns);
                    
                    if (!xsipSearchResults) {
                        ErrMsg += 'Item Parameter Error';
                        return false;
                        
                    } //if
                    baseService = xsipSearchResults[0].getValue(xsipSearchColumns[6]);
                    
                    // if no base service is specified then error
                    if (baseService == null || baseService == '') {
                        ErrMsg += 'Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg)\n(E04)';
                        return false;
                        
                    } //if				
                    else {
                        // prompt user to change service
                        ErrMsg += 'Error: The weight specified exceeds the maximum weight for this service. To automatically change to an oversize service press OK.  To return and edit manually press CANCEL.';                        
						var changeItem = true;
                        // cancel and return to line if user presses cancel
                        if (changeItem == false) {
                            return false;
                        } //if
                        else {
                            changeService = true;
                            changeServiceTo = xsService;
                            changeToXS = true;
                            useBaseService = true;
                            
                            // get xs weight surcharge from params record
                            surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xsweightsurcharge'));
                            
                        } //else
                    } //else	
                } //if
                else {
                    ErrMsg = 'Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg) (E05)';
                    return false;
                }
                
            } //else
        } //if max weight checks	
    } // if xsServiceFlag = 'F'
    else {
        // Item selected is an XS service, so get the base price to calculate from
        // *** baseService = nlapiLookupField('serviceitem',currentItem,'custitem_baseservice');
        var baseService = ipSearchResults[0].getValue(ipSearchColumns[6]);
        
        // if base service is specified then set flag to use base service 
        if (baseService != null || baseService != '') {
            useBaseService = true;
            surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xsweightsurcharge'));           
        } //if			
    } //else (xsServiceFlag = 'T')
    ErrMsg += ' useBaseService=' + useBaseService + ' surcharge=' + surcharge;
    /*****************************************************
     *  Sizing Checks - get sizing information in order to
     *  perform sizing checks
     ****************************************************/
    var parcelLength = parseInt(theConsRecord.getLineItemValue('item', 'custcol_length', 1));
    var parcelWidth = parseInt(theConsRecord.getLineItemValue('item', 'custcol_width', 1));
    var parcelHeight = parseInt(theConsRecord.getLineItemValue('item', 'custcol_height', 1));
	if (isNaN(parcelLength)) parcelLength = 0;
	if (isNaN(parcelWidth)) parcelWidth = 0;
	if (isNaN(parcelHeight)) parcelHeight = 0;
    ErrMsg += '\n 4. Sizing check : ' + parcelLength + ' x ' + parcelWidth + ' x ' + parcelHeight + ' ';

    // Only perform sizing checks if all dimensions are present
    
    if ((!isNaN(parcelLength) && parcelLength > 0) && (!isNaN(parcelWidth) && parcelWidth > 0) && (!isNaN(parcelHeight) && parcelHeight > 0)) {
    
        /*****************************************************
         *  Volumetric weight calculation
         *  (L * W * H)/6000
         ****************************************************/
        var volumetricWeight = Math.round((parcelLength * parcelWidth * parcelHeight) / 6000);
        
        //set column on item line
        nlapiSetCurrentLineItemValue('item', 'custcol_truevolumeweight', volumetricWeight, false, false);
        
        if (volumetricWeight > consignmentWeight && numberOfParcels == 1) {
            consignmentWeight = volumetricWeight;
            theConsRecord.setFieldValue('custbody_usevolumetric', 'T');
            
        } //if
        else {
            theConsRecord.setFieldValue('custbody_usevolumetric', 'F');
            
        } //else
        /*****************************************************
         *  Max Sizing check - no dimension to exceed 3.05m (305cm)
         ****************************************************/
        if (parcelLength > 305 || parcelWidth > 305 || parcelHeight > 305) {
            ErrMsg += ' Error: The parcel exceeds the maximum dimensions for carriage (300cm). (E06)';
            return false;
            
        } //if
        /*****************************************************
         *  XS Sizing check - check to see if item size
         *  requires an XS item and surcharge - any dimension
         *  exceeding 2.5m (250cm). If XS item already set then
         *  determine whether the surcharge is due to weight or
         *  sizing.
         ****************************************************/
        if (parcelLength > 250 || parcelWidth > 250 || parcelHeight > 250) {
            if (xsServiceFlag == 'F') {
            
                // If no XS service defined then error
                if (xsService == null || xsService == '') {
                    ErrMsg += 'Error: The dimensions specified exceed the maximum for this service (250cm). (E07)';
                    return false;
                    
                } //if
                else {
                    // If item has already been identified as oversize, then increase the surcharge to the length surcharge.
                    // Otherwise, search to make sure XS service is available for the current parcel area.
                    
                    if (changeService == true) {
                        surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xslengthsurcharge'));
                        ;
                        
                    } //if
                    else {
                        // Construct search to check that the XS service is available for the current parcel area
                        var xsSearchFilters = new Array();
                        var xsSearchColumns = new Array();
                        
                        xsSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', xsService);
                        xsSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', parcelArea);
                        
                        xsSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                        
                        // perform search
                        var xsSearchResults = nlapiSearchRecord('customrecord_areaservice', null, xsSearchFilters, xsSearchColumns);
                        
                        // If XS available then prompt for change to XS service
                        if (xsSearchResults) {
                            // check that xs service has a base service entry for price calculation purposes
                            //var baseService = nlapiLookupField('serviceitem', xsService, 'custitem_baseservice'); //zzz
                            
                            /****************************************
                             * New search for xs item parameter record
                             **/
                            var xsipSearchFilters = new Array();
                            var xsipSearchColumns = new Array();
                            
                            xsipSearchFilters[0] = new nlobjSearchFilter('custrecord_ip_item', null, 'is', xsService);
                            
                            xsipSearchColumns[0] = new nlobjSearchColumn('custrecord_ip_maximumweight');
                            xsipSearchColumns[1] = new nlobjSearchColumn('custrecord_ip_xsservice');
                            xsipSearchColumns[2] = new nlobjSearchColumn('custrecord_ip_xsserviceflag');
                            xsipSearchColumns[3] = new nlobjSearchColumn('custrecord_ip_ncservice');
                            xsipSearchColumns[4] = new nlobjSearchColumn('custrecord_ip_ncserviceflag');
                            xsipSearchColumns[5] = new nlobjSearchColumn('custrecord_ip_singleitem');
                            xsipSearchColumns[6] = new nlobjSearchColumn('custrecord_ip_baseservice');
                            xsipSearchColumns[7] = new nlobjSearchColumn('custrecord_ip_serviceshortname');
                            
                            // perform search
                            var xsipSearchResults = nlapiSearchRecord('customrecord_itemparameters', null, xsipSearchFilters, xsipSearchColumns);
                            
                            if (!xsipSearchResults) {
                                ErrMsg += 'Item Parameter Error';
                                return false;
                                
                            } //if
                            baseService = xsipSearchResults[0].getValue(xsipSearchColumns[6]);
                            
                            
                            // if no base service is specified then error
                            if (baseService == null || baseService == '') {
                                ErrMsg += 'Error: The dimensions specified exceed the maximum dimensions for this service.\n(E09';
                                return false;
                                
                            } //if				
                            else {
                                // prompt user to change service
                                ErrMsg += 'Error: The dimensions specified exceed the maximum dimensions for this service.\nTo automatically change to an oversize service press OK.  To return and edit manually press CANCEL.';
                                var changeItem = true;
                                
                                // cancel and return to line if user presses cancel
                                if (changeItem == false) {
                                    return false;
                                } //if
                                else {
                                    changeService = true;
                                    changeServiceTo = xsService;
                                    changeToXS = true;
                                    useBaseService = true;
                                    
                                    // get xs length surcharge from params record
                                    surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xslengthsurcharge'));
                                    
                                } //else change service
                            } //else (base service present)	
                        } //if xs available
                        else {
                            ErrMsg += 'Error: The dimensions specified exceed the maximum for this service (250cm).\n(E08)';
                            return false;
                        } //else
                    } //else (changeservice = false)			
                } //else (xs service defined)						
            } //if xsServiceflag == 'F'
            else {
                surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xslengthsurcharge'));
                ;
            }
            
        } //xs length
        /*****************************************************
         *  NC Sizing check - check to see if item size
         *  requires NC
         ****************************************************/
        //only check if service is not already being changed or xs item not selected or nc item not selected
        if (changeService == false && xsServiceFlag == 'F' && ncServiceFlag == 'F') {
        
            if (ncSizeCheck(parcelLength, parcelWidth, parcelHeight)) {
                // ***var ncService = itemRecord.getFieldValue('custitem_ncservice');
                var ncService = ipSearchResults[0].getValue(ipSearchColumns[3]);
                
                // If no NC service defined then error
                if (ncService == null || ncService == '') {
                    ErrMsg = 'Error: The dimensions specified exceed the maximum dimensions for this service.';
                    return false;
                    
                } //if				
                else {
                    // prompt user to change service
                    //var changeItem = confirm('Error: The dimensions specified exceed the maximum dimensions for this service.\nTo automatically change to a non-conveyorable service press OK.  To return and edit manually press CANCEL.');
                    ErrMsg += 'NC Error: The dimensions specified exceed the maximum dimensions for this service. To automatically change.';
                    var changeItem = true;
					
                    // cancel and return to line if user presses cancel
                    if (changeItem == false) {
                        return false;
                    } //if
                    else {
                        changeService = true;
                        changeServiceTo = ncService;
                        useBaseService = false;
                        
                        //set APC integration non convey flag
                        theConsRecord.setFieldValue('custbody_nonconvey', 'T');
                        
                        // get nc surcharge from params record
                        //surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_ncsurcharge'));
                    
                    } //else change service				
                } // nc service defined
            } //if over dimensions
        } //if changeService == false		
    } //if all dimensions present
    else {
        //reset volumetrics
        theConsRecord.setFieldValue('custbody_usevolumetric', 'F');
        theConsRecord.setLineItemValue('item', 'custcol_truevolumeweight', 1, 0);        
        
        if (xsServiceFlag == 'T') {
            if (consignmentWeight > 30) {
                surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xsweightsurcharge'));
            } //if
            else {
                surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_xslengthsurcharge'));
            } //else				
        } //if
    } //else
    /*****************************************************
     *  There-->There Checks
     ****************************************************/
	ErrMsg += '\n5. There-->There Checks : ';
    // get current custom form
    //var currentForm = theConsRecord.getFieldValue('customform');
    var currentForm = theConsRecord.getFieldValue('custbody_formid');
    if (!currentForm)
    	currentForm = theConsRecord.getFieldValue('customform');
    //if (getFormDeliveryType(currentForm) == 'TT') {
    if (deliveryType == 'TT') {
        // get collection address
        var collectAddressArea = theConsRecord.getFieldValue('custbody_collectparcelarea');
		if (collectAddressArea == null || collectAddressArea == '')
			collectAddressArea = 0;
        if (theConsRecord.getFieldValue('custbody_collectparcelarea2') != '' && theConsRecord.getFieldValue('custbody_collectparcelarea2') != null) 
            collectAddressArea = theConsRecord.getFieldValue('custbody_collectparcelarea2');
        var altCollectArea = '';
        theConsRecord.setFieldValue('custbody_collectparcelarea2', '');
        if (currentItem != '') 
            altArea = getAltAreaforServiceArea(collectAddressArea, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
        //if (isTestUser()) 
        //    ErrMsg = 'Collect Area :" + collectAddressArea + " Collect AltArea :" + altCollectArea;
        if (parcelArea != altCollectArea) 
            theConsRecord.setFieldValue('custbody_collectparcelarea2', altCollectArea);
        if (theConsRecord.getFieldValue('custbody_collectparcelarea2') != '' && theConsRecord.getFieldValue('custbody_collectparcelarea2') != null) 
            collectAddressArea = theConsRecord.getFieldValue('custbody_collectparcelarea2');
        
        // Construct search to see if collection area has correct services available
        // If the service selected is XS or the service is changing to XS
        // then check for XS services to that collection area.
        // If the service is not XS then check for ND16 and then TDAY
        
        var collectService = 19; // Set to ND16 by default;
		
        if (xsServiceFlag == 'T') {
        
            var xsSearchFilters = new Array();
            var xsSearchColumns = new Array();
            
            xsSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
            xsSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
            
            xsSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
            
            // perform search
            var xsSearchResults = nlapiSearchRecord('customrecord_areaservice', null, xsSearchFilters, xsSearchColumns);
            
            if (xsSearchResults) {
                collectService = currentItem;
            }
            else {
                ErrMsg = 'Error: XS Collection is not available for this area.\nPlease contact NEP directly to process you order.';
                
            } //else
        } //if XS
        else 
            if (changeToXS == true) {
            
            
            
                var xsSearchFilters = new Array();
                var xsSearchColumns = new Array();
                
                xsSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', changeServiceTo);
                xsSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
                
                xsSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                
                // perform search
                var xsSearchResults = nlapiSearchRecord('customrecord_areaservice', null, xsSearchFilters, xsSearchColumns);
                
                if (xsSearchResults) {
                    collectService = changeServiceTo;
                }
                else {
                    ErrMsg = 'Error: XS Collection is not available for this area.\nPlease contact NEP directly to process you order.';
                    
                } //else		
            } //if change to xs
            else 
                if (changeService == true || ncServiceFlag == 'T') {
                
                    var ncSearchFilters = new Array();
                    var ncSearchColumns = new Array();
                    
                    if (changeService == true) 
                        ncSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', changeServiceTo);
                    if (ncServiceFlag == 'T') 
                        ncSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
                    
                    
                    ncSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
                    
                    ncSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                    
                    // perform search
                    var ncSearchResults = nlapiSearchRecord('customrecord_areaservice', null, ncSearchFilters, ncSearchColumns);
                    
                    if (ncSearchResults) {
                    
                        if (changeService == true) 
                            collectService = changeServiceTo
                        if (ncServiceFlag == 'T') 
                            collectService = currentItem;
                    }
                    else {
                        ErrMsg = 'Error: NC Collection is not available for this area.\nPlease contact NEP directly to process you order.';
                        
                    } //else		
                } //if change to nc
                else {
                              
                    // check for ND16 then TDAY
                    
                    var ndSearchFilters = new Array();
                    var ndSearchColumns = new Array();
                    
                    ndSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', '19');
                    ndSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
                    
                    ndSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                    
                    // perform search
                    var ndSearchResults = nlapiSearchRecord('customrecord_areaservice', null, ndSearchFilters, ndSearchColumns);
                    
                    // If no ND16 then check for TDAY
                    if (!ndSearchResults) {
                        // Construct search to see if collection area has TDAY service available
                        var tdSearchFilters = new Array();
                        var tdSearchColumns = new Array();
                        
                        tdSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'anyof', '35');
                        tdSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
                        
                        tdSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
                        
                        // perform search
                        var tdSearchResults = nlapiSearchRecord('customrecord_areaservice', null, tdSearchFilters, tdSearchColumns);
                        
                        // If no ND16 or TDAY then error
                        if (!tdSearchResults) {
                            ErrMsg += ' Error: Price cannot be determined.  Please contact NEP directly to process this order.';                            
                        } //if no TDAY service
                        else {
                            collectService = 35;
                        } // TDAY service found
                    } // no ND16 service
                    else {
                        collectService = 19;                      
                    } // ND16 service found			
                } //else (not XS)
        if (useBaseService == true) {
            var collectRate = parseFloat(getParcelPrice(currentCustomer, baseService, parseInt(collectAddressArea), consignmentWeight));
        }
        else {
            var collectRate = parseFloat(getParcelPrice(currentCustomer, collectService, parseInt(collectAddressArea), consignmentWeight));
        }
        
        // If price cannot be determined for collection then error, else set surcharge to collection rate
        if (!collectRate) {
            ErrMsg += ' Error: Price cannot be determined.  Please contact NEP directly to process this order.';
        }
        if (collectRate == -1) {
            ErrMsg += ' Error: Price cannot be determined.  Please contact NEP directly to process this order.';
            
        } //if
        else {
            if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
                ErrMsg = 'CollectRate T-T = ' + collectRate + ' Surcharge T-T = ' + surcharge;
            collectRate += surcharge;
        } //else
    } //if customform
    /*****************************************************
     *  Calculate pricing
     ****************************************************/
	ErrMsg += '\n6. Calculate pricing : changeService ==' + changeService + ' useBaseService ==' + useBaseService;
	//ErrMsg += ' getParcelPrice(' + currentCustomer + ',' + currentItem + ',' + parcelArea + ',' + consignmentWeight + ')';
    // get pricing for delivery
    if (changeService == true) {
        // alert('changeService=T');
        if (useBaseService == true) {
            //alert('useBaseService=T');
            //alert('baseService=' + baseService);
            var rate = getParcelPrice(currentCustomer, baseService, parseInt(parcelArea), consignmentWeight);
            var cost = getCost(baseService, parcelArea);
        } //if
        else {
            //alert('useBaseService=F');
            //alert('baseService=' + baseService);
            //alert('changeServiceTo=' + changeServiceTo);
            //alert('consignmentWeight=' + consignmentWeight);
            var rate = getParcelPrice(currentCustomer, changeServiceTo, parseInt(parcelArea), consignmentWeight);
            var cost = getCost(changeServiceTo, parcelArea);
        } //else
    }
    else {
        if (useBaseService == true) {
            var rate = getParcelPrice(currentCustomer, baseService, parseInt(parcelArea), consignmentWeight);
            var cost = getCost(baseService, parcelArea);
        }
        else {
            var rate = getParcelPrice(currentCustomer, currentItem, parseInt(parcelArea), consignmentWeight);
            var cost = getCost(currentItem, parcelArea);
            
        } //else
    } //else
    // Trace for testing ...
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
    //    alert('Rate = ' + rate + '\nCost = ' + cost)

    // if rate cannot be determined then error 
	if (isNaN(rate)) rate = -1;

	ErrMsg += ' Rate ==> ' + rate; 
    if (rate == -1) {
        //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) {
        var servicesList = 'The services available for the selected customer address are :\n';
        var serviceArray = getServicesforArea(parcelArea, true).split(',');
        if (serviceArray.length > 0 && parcelArea.length > 0) {
            for (ss = 0; ss < serviceArray.length; ss++) {
                servicesList += "\n" + serviceArray[ss];
            }
            servicesList += '\n\nPlease choose from one of the services listed above - thank you.';
            ErrMsg = servicesList;
        }
        else {
            if (parcelArea.length == 0) {
                ErrMsg += ' Error: No parcel area available for the post code.\nPlease check and change the post code / address.';
            }
            else {
                ErrMsg += ' Error: Price / services options cannot be determined.\nPlease contact NEP directly to process this consignment.';
            }
        }
        return false;
    } //if
    else {
        /*****************************************************
         *  There-->Here Checks
         *  Calculate normally but add surcharge
         *  Modified Feb 2012 to include new PUR pricing model
         *  based on any COLL areas defined for the customer
         ****************************************************/
        // if custom form =  then process as there to here
    	if (deliveryType == 'TH') {
        //if (getFormDeliveryType(currentForm) == 'TH') {
            //get there-->here surcharge
            paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
            var PURcollservice = paramRecord.getFieldValue('custrecord_pur_collectservice');
            var PURbaseservice = paramRecord.getFieldValue('custrecord_pur_baseservice');
            var PURSurcharge = parseFloat(paramRecord.getFieldValue('custrecord_param_tpcollectionsurcharge'));
			var thSurcharge = 0.0;
            //1. See whether Customer has special collection rates for PURs
            var PURcustrate = getParcelPrice(currentCustomer, PURcollservice, parseInt(parcelArea), consignmentWeight);
            if (PURcustrate == -1) { // Use base services rate for PURs
               	nlapiLogExecution('AUDIT', 'TH Check - Base Rate: ' + theConsRecord.getFieldValue('tranid'), 'Base service = ' + PURbaseservice + ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
                var PURbaserate = getParcelPrice(currentCustomer, PURbaseservice, parseInt(parcelArea), consignmentWeight);
                if (PURbaserate == -1) { // Should never get here but ...
                    //alert('No PUR base price defined. Please contact support.');
                    return false;
                }
                else {
					//alert('Baserate T-H = ' + PURbaserate+ ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
                	if (rate < PURbaserate) thSurcharge = PURbaserate - rate ; // Add base rate surcharge if lower
                	thSurcharge += PURSurcharge; // Add fixed surcharge
                }
            } else { // Apply customer PUR rates ...
               	nlapiLogExecution('AUDIT', 'TH Check - Cust Rate: ' + theConsRecord.getFieldValue('tranid'), 'COLLrate T-H = ' + PURcustrate + ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
				if (rate < PURcustrate) thSurcharge = PURcustrate - rate ; // Surcharge the difference
			}           
            //add surcharge
            if (!isNaN(thSurcharge)) 
                surcharge += thSurcharge;            
        } //if there-->here
        rate += surcharge;
        rate += collectRate;       
    } //else
    
    /*****************************************************
     *  Calculate fragile surcharge
     *  No. of parcels x .50
     ****************************************************/
    var fragileCharge = 0.00;
    var fragile = nlapiGetFieldValue('custbody_fragile');
    if (fragile == 'T') {
    	theConsRecord.setFieldValue('custbody_labelfswflag', 'F', false, false);
        fragileCharge = parseFloat(0.50 * parseInt(numberOfParcels));
        rate += fragileCharge;
    } //if

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

    /*****************************************************
     *  Calculate insurance
     *  - To be moved into invoice.
     ****************************************************/
    var insuranceRequired = theConsRecord.getFieldValue('custbody_insurancerequired');
	if (theConsRecord.getFieldValue('custbody_apcimportfirstdate') != '' && theConsRecord.getFieldValue('custbody_apcimportfirstdate') != null)
		insuranceRequired = theConsRecord.getFieldValue('custbody_apcsecurity');
	if (insuranceRequired)
		theConsRecord.setFieldValue('custbody_insurancerequired', insuranceRequired);
    var insuranceCharge = 0.00; // Default no insurance charge
    var insuranceFuel = 0.00;
    var currentFuel = parseFloat(fuelSurcharge);
    if (insuranceRequired == 'T') {
        var insuranceAmount = parseInt(theConsRecord.getFieldValue('custbody_insuranceamount'));
              
        if (insuranceAmount == 0 || isNaN(insuranceAmount)) {
            insuranceCharge = 0.50;
            if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) {
                insuranceFuel = 0.00;
            }
            else {
                insuranceFuel = (parseFloat(fuelSurchargePercent / 100.00) * parseFloat(insuranceCharge)).toFixed(2);
                currentFuel = (parseFloat(theConsRecord.getFieldValue('custbody_fuelsurcharge')) + parseFloat(insuranceFuel)).toFixed(2);
            } //if
            theConsRecord.setFieldValue('custbody_fuelsurcharge', currentFuel);
        }
        else {
            insuranceCharge = (Math.ceil(insuranceAmount / 1000)) * 3;
        }
        
    } //if
    theConsRecord.setFieldValue('custbody_insurancesurcharge', insuranceCharge);
    
    //var TotalFee = parseFloat(rate) + insuranceCharge;
    
    /*****************************************************
     *  Fragile / Security / Weight flags
     ****************************************************/
    // order of precedence dictates that Security always
    // overrides both weight and fragile.  An item cannot be
    // both fragile and weight.
    
    if (insuranceRequired == 'T') {
        theConsRecord.setFieldValue('custbody_labelfswflag', 'S');
    } //if
    else {
        var fragile = theConsRecord.getFieldValue('custbody_fragile');
        if (fragile == 'T') {
            theConsRecord.setFieldValue('custbody_labelfswflag', 'F');
        } //if
    } //else
    
	//Added July 2012 - surcharges related to Olympics ...
	var deliveryType = getFormDeliveryType(currentForm);
	var surchargePostCode = theConsRecord.getFieldValue('custbody_deliverypostcode');
	if (deliveryType == 'TT' || deliveryType == 'TH') {
		surchargePostCode = theConsRecord.getFieldValue('custbody_pickupaddresspostcode');
	} 

	//var newSurcharge = parseFloat(getPostcodeSurcharge(surchargePostCode, false, numberOfParcels));
	var newSurcharge = 0.00;
	if (newSurcharge > 0){
		theConsRecord.setFieldValue('custbody_surcharge_postcode', newSurcharge, false, false);
	} 
    if (newSurcharge > 0) {
        rate += newSurcharge;
    }	

   	nlapiLogExecution('AUDIT', 'Rate Check: ' + theConsRecord.getFieldValue('tranid'), 'rate:' + rate + ' collectRate:'  + collectRate + ' surcharge:' + surcharge + ' deliveryType:' + deliveryType + ' item:' + currentItem + ' fuelpercent:' + fuelSurchargePercent + ' fuelsurcharge:' + fuelSurcharge + ' insurancesurcharge:' + insuranceCharge + ' newSurcharge:' + newSurcharge);
    
    //if item change required then change item
    if (changeService == true) {
        theConsRecord.setLineItemValue('item', 'item', 1, changeServiceTo);
    } //if
    theConsRecord.setLineItemValue('item', 'rate', 1, rate);
    theConsRecord.setLineItemValue('item', 'amount', 1, rate);
    theConsRecord.setFieldValue('custbody_purchasecost', cost);
    
    return theConsRecord;
    
} //function
/******************************************************************************************************
 *  Function getParcelPrice(currentCustomer, currentItem, parcelArea, consignmentWeight)
 *  This function searches for pricing and then calculates the price for the service.  The order of
 *  precedence for pricing is
 *  1. Customer-item-area specific
 *  2. Default pricing for service/area
 *  Function returns -1 if pricing can not be found.
 *****************************************************************************************************/
function getParcelPrice(currentCustomer, currentItem, parcelArea, consignmentWeight){
	currentCustomer += '';
	currentItem += '';
	parcelArea += '';
	consignmentWeight += '';
    //ErrMsg += '[consignmentWeight= ' + consignmentWeight + ' parcelArea=' + parcelArea + ' currentItem=' + currentItem + ' currentCustomer=' + currentCustomer + ']';
    //if (currentCustomer.length > 0 && currentItem.length > 0 && parcelArea.length > 0 && consignmentWeight.length > 0) {
    if (currentCustomer != '' && currentItem != '' && parcelArea != '' && consignmentWeight != '') {
        // construct search for customer-item specific pricing
        
        var pRateSearchFilters = new Array();
        var pRateSearchColumns = new Array();
        
        pRateSearchFilters[0] = new nlobjSearchFilter('custrecord_parcelrate_customer', null, 'is', currentCustomer);
        pRateSearchFilters[1] = new nlobjSearchFilter('custrecord_parcelrate_item', null, 'is', currentItem);
        pRateSearchFilters[2] = new nlobjSearchFilter('custrecord_parcelarea', null, 'is', parcelArea);
        
        pRateSearchColumns[0] = new nlobjSearchColumn('custrecord_parcelrate_baseprice');
        pRateSearchColumns[1] = new nlobjSearchColumn('custrecord_kilo1');
        pRateSearchColumns[2] = new nlobjSearchColumn('custrecord_perkg1');
        pRateSearchColumns[3] = new nlobjSearchColumn('custrecord_baseprice2');
        pRateSearchColumns[4] = new nlobjSearchColumn('custrecord_kilo2');
        pRateSearchColumns[5] = new nlobjSearchColumn('custrecord_perkg2');
        pRateSearchColumns[6] = new nlobjSearchColumn('custrecord_baseprice3');
        pRateSearchColumns[7] = new nlobjSearchColumn('custrecord_kilo3');
        pRateSearchColumns[8] = new nlobjSearchColumn('custrecord_perkg3');
        pRateSearchColumns[9] = new nlobjSearchColumn('custrecord_baseprice4');
        pRateSearchColumns[10] = new nlobjSearchColumn('custrecord_kilo4');
        pRateSearchColumns[11] = new nlobjSearchColumn('custrecord_perkg4');
        pRateSearchColumns[12] = new nlobjSearchColumn('custrecord_baseprice5');
        pRateSearchColumns[13] = new nlobjSearchColumn('custrecord_kilo5');
        pRateSearchColumns[14] = new nlobjSearchColumn('custrecord_perkg5');
        
        // perform search
        var pRateSearchResults = nlapiSearchRecord('customrecord_parcelrate', null, pRateSearchFilters, pRateSearchColumns);
        //ErrMsg += '[Search customrecord_parcelrate - parcelArea=' + parcelArea + ' currentItem=' + currentItem + ' currentCustomer=' + currentCustomer + ']';
        
        if (pRateSearchResults) {
            //alert('pRateSearchResults==T');
            
            // Extract fields from first record found
            var basePrice1 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[0]));
            var kilo1 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[1]));
            var perkg1 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[2]));

			if (isNaN(basePrice1)) basePrice1 = 0.00;
			if (isNaN(kilo1)) kilo1 = 0;
			if (isNaN(perkg1)) perkg1 = 0.00;
            
            var basePrice2 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[3]));
            var kilo2 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[4]));
            var perkg2 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[5]));
            
			if (isNaN(basePrice2)) basePrice2 = 0.00;
			if (isNaN(kilo2)) kilo2 = 0;
			if (isNaN(perkg2)) perkg2 = 0.00;

            var basePrice3 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[6]));
            var kilo3 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[7]));
            var perkg3 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[8]));
            
			if (isNaN(basePrice3)) basePrice3 = 0.00;
			if (isNaN(kilo3)) kilo3 = 0;
			if (isNaN(perkg3)) perkg3 = 0.00;

            var basePrice4 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[9]));
            var kilo4 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[10]));
            var perkg4 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[11]));
            
			if (isNaN(basePrice4)) basePrice4 = 0.00;
			if (isNaN(kilo4)) kilo4 = 0;
			if (isNaN(perkg4)) perkg4 = 0.00;

            var basePrice5 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[12]));
            var kilo5 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[13]));
            var perkg5 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[14]));
            
			if (isNaN(basePrice5)) basePrice5 = 0.00;
			if (isNaN(kilo5)) kilo5 = 0;
			if (isNaN(perkg5)) perkg5 = 0.00;
            
        } //if
        else {
            //alert('pRateSearchResults==F');
            
            // if no customer-item specific pricing records found then extract from area-service lookup
            
            // construct search for customer-item specific pricing
            
            var defSearchFilters = new Array();
            var defSearchColumns = new Array();
            
            defSearchFilters[0] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', parcelArea);
            defSearchFilters[1] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
            
            defSearchColumns[0] = new nlobjSearchColumn('custrecord_defaultbaseprice1');
            defSearchColumns[1] = new nlobjSearchColumn('custrecord_defaultkilo1');
            defSearchColumns[2] = new nlobjSearchColumn('custrecord_defaultperkg1');
            defSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultbaseprice2');
            defSearchColumns[4] = new nlobjSearchColumn('custrecord_defaultkilo2');
            defSearchColumns[5] = new nlobjSearchColumn('custrecord_defaultperkg2');
            defSearchColumns[6] = new nlobjSearchColumn('custrecord_defaultbaseprice3');
            defSearchColumns[7] = new nlobjSearchColumn('custrecord_defaultkilo3');
            defSearchColumns[8] = new nlobjSearchColumn('custrecord_defaultperkg3');
            defSearchColumns[9] = new nlobjSearchColumn('custrecord_defaultbaseprice4');
            defSearchColumns[10] = new nlobjSearchColumn('custrecord_defaultkilo4');
            defSearchColumns[11] = new nlobjSearchColumn('custrecord_defaultperkg4');
            defSearchColumns[12] = new nlobjSearchColumn('custrecord_defaultbaseprice5');
            defSearchColumns[13] = new nlobjSearchColumn('custrecord_defaultkilo5');
            defSearchColumns[14] = new nlobjSearchColumn('custrecord_defaultperkg5');
            
            // perform search
            var defSearchResults = nlapiSearchRecord('customrecord_areaservice', null, defSearchFilters, defSearchColumns);
            //ErrMsg += '[Search customrecord_areaservice - parcelArea=' + parcelArea + ' currentItem=' + currentItem + ']';
			
            if (defSearchResults) {
                //alert('defSearchResults==T');
                
                // Extract fields from first record found
                var basePrice1 = parseFloat(defSearchResults[0].getValue(defSearchColumns[0]));
                var kilo1 = parseInt(defSearchResults[0].getValue(defSearchColumns[1]));
                var perkg1 = parseFloat(defSearchResults[0].getValue(defSearchColumns[2]));
                
                if (isNaN(basePrice1)) 
                    basePrice1 = 0.00;
                if (isNaN(kilo1)) 
                    kilo1 = 0;
                if (isNaN(perkg1)) 
                    perkg1 = 0.00;
                
                var basePrice2 = parseFloat(defSearchResults[0].getValue(defSearchColumns[3]));
                var kilo2 = parseInt(defSearchResults[0].getValue(defSearchColumns[4]));
                var perkg2 = parseFloat(defSearchResults[0].getValue(defSearchColumns[5]));
                
                if (isNaN(basePrice2)) 
                    basePrice2 = 0.00;
                if (isNaN(kilo2)) 
                    kilo2 = 0;
                if (isNaN(perkg2)) 
                    perkg2 = 0.00;
                
                var basePrice3 = parseFloat(defSearchResults[0].getValue(defSearchColumns[6]));
                var kilo3 = parseInt(defSearchResults[0].getValue(defSearchColumns[7]));
                var perkg3 = parseFloat(defSearchResults[0].getValue(defSearchColumns[8]));
                
                if (isNaN(basePrice3)) 
                    basePrice3 = 0.00;
                if (isNaN(kilo3)) 
                    kilo3 = 0;
                if (isNaN(perkg3)) 
                    perkg3 = 0.00;
                
                var basePrice4 = parseFloat(defSearchResults[0].getValue(defSearchColumns[9]));
                var kilo4 = parseInt(defSearchResults[0].getValue(defSearchColumns[10]));
                var perkg4 = parseFloat(defSearchResults[0].getValue(defSearchColumns[11]));
                
                if (isNaN(basePrice4)) 
                    basePrice4 = 0.00;
                if (isNaN(kilo4)) 
                    kilo4 = 0;
                if (isNaN(perkg4)) 
                    perkg4 = 0.00;
                
                var basePrice5 = parseFloat(defSearchResults[0].getValue(defSearchColumns[12]));
                var kilo5 = parseInt(defSearchResults[0].getValue(defSearchColumns[13]));
                var perkg5 = parseFloat(defSearchResults[0].getValue(defSearchColumns[14]));
                
                if (isNaN(basePrice5)) 
                    basePrice5 = 0.00;
                if (isNaN(kilo5)) 
                    kilo5 = 0;
                if (isNaN(perkg5)) 
                    perkg5 = 0.00;
                
                //alert('basePrice1=' + basePrice1 + '\nkilo1=' + kilo1 + '\nperkg1=' + perkg1);
                //alert('basePrice2=' + basePrice2 + '\nkilo2=' + kilo2 + '\nperkg2=' + perkg2);
                //alert('basePrice3=' + basePrice3 + '\nkilo3=' + kilo3 + '\nperkg3=' + perkg3);
                //alert('basePrice4=' + basePrice4 + '\nkilo4=' + kilo4 + '\nperkg4=' + perkg4);
                //alert('basePrice5=' + basePrice5 + '\nkilo5=' + kilo5 + '\nperkg5=' + perkg5);
            
            } //if
            else {
                //alert('defSearchResults==F');
                nlapiLogExecution('AUDIT', 'getParcelPrice defSearchResults==F' , '[consignmentWeight= ' + consignmentWeight + ' parcelArea=' + parcelArea + ' currentItem=' + currentItem + ' currentCustomer=' + currentCustomer + ']');
                return -1;
            }
        } //else
        // calculate pricing
        var rate;
        
        if (consignmentWeight <= kilo1) {
            rate = basePrice1;
        } //if
        else 
            //if (consignmentWeight <= kilo2 || kilo2 == 0 || isNaN(kilo2)) {
            if (consignmentWeight <= kilo2 || kilo2 == 0) {
                rate = basePrice1 + ((consignmentWeight - kilo1) * perkg1);                
            } //else if
            else 
                //if (consignmentWeight <= kilo3 || kilo3 == 0 || isNaN(kilo3)) {
                if (consignmentWeight <= kilo3 || kilo3 == 0) {
                    //if (basePrice2 != null && !(isNaN(basePrice2))) {
                    if (basePrice2 != 0.00) {
                        rate = basePrice2 + ((consignmentWeight - kilo2) * perkg2);                       
                    } //if
                    else {
                        rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((consignmentWeight - kilo2) * perkg2);                       
                    } //else
                } //else if
                else 
                    //if (consignmentWeight <= kilo4 || kilo4 == 0 || isNaN(kilo4)) {
                    if (consignmentWeight <= kilo4 || kilo4 == 0) {
                        //if (basePrice3 != null && !(isNaN(basePrice3))) {
                        if (basePrice3 != 0.00) {
                            rate = basePrice3 + ((consignmentWeight - kilo3) * perkg3);                            
                        } //if
                        else {
                            rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((consignmentWeight - kilo3) * perkg3);                           
                        } //else
                    } //else if
                    else 
                        //if (consignmentWeight <= kilo5 || kilo5 == 0 || isNaN(kilo5)) {
                        if (consignmentWeight <= kilo5 || kilo5 == 0) {
                            //if (basePrice4 != null && !(isNaN(basePrice4))) {
                            if (basePrice4 != 0.00) {
                                rate = basePrice4 + ((consignmentWeight - kilo4) * perkg4);                                
                            } //if
                            else {
                                rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((kilo4 - kilo3) * perkg3) + ((consignmentWeight - kilo4) * perkg4);                                
                            } //else
                        } //else if
                        else 
                            if (consignmentWeight > kilo5) {
                                //if (basePrice5 != null && !(isNaN(basePrice5))) {
                                if (basePrice5 != 0.00) {
                                    rate = basePrice5 + ((consignmentWeight - kilo5) * perkg5);                                  
                                } //if
                                else {
                                    rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((kilo4 - kilo3) * perkg3) + ((kilo5 - kilo4) * perkg4) + ((consignmentWeight - kilo5) * perkg5);                                    
                                } //else
                            } //else if
                            else {
                                return -1;
                            } // else	
        return rate;
    }
    else {
        if (isTestUser() || consignmentWeight != '') {
            ErrMsg += 'getParcelPrice - missing parameter(s): Customer = ' + currentCustomer + ' Item = ' + currentItem + ' Area = ' + parcelArea + ' Weight = ' + consignmentWeight;
        }
        else {
            if (consignmentWeight == '') 
                ErrMsg += 'Please enter a weight in KG.';
        }
		nlapiLogExecution('AUDIT', 'getParcelPrice missingparams' , '[consignmentWeight= ' + consignmentWeight + ' parcelArea=' + parcelArea + ' currentItem=' + currentItem + ' currentCustomer=' + currentCustomer + ']');
        return -1;
    }
} // function getParcelPrice

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

function getCost(currentItem, parcelArea){
    //	alert(currentItem);
    //	alert(parcelArea);
    var cost = 0;
    
    var defSearchFilters = new Array();
    var defSearchColumns = new Array();
    
    defSearchFilters[0] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', parcelArea);
    defSearchFilters[1] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
    
    defSearchColumns[0] = new nlobjSearchColumn('custrecord_purchasebaserate');
    
    // perform search
    var defSearchResults = nlapiSearchRecord('customrecord_areaservice', null, defSearchFilters, defSearchColumns);
    
    if (defSearchResults) {
        // Extract fields from first record found
        cost = parseFloat(defSearchResults[0].getValue(defSearchColumns[0]));
        
    } //if
    // alert(cost);
    return cost;
    
} //function getCost

/******************************************************************************************************
 *  Function ncSizeCheck(parcelLength, parcelWidth, parcelHeight)
 *  This function determines whether a parcel is Non Conveyorable.
 *  Returns TRUE if parcel is non-conveyorable.
 *****************************************************************************************************/
function ncSizeCheck(parcelLength, parcelWidth, parcelHeight){

    // if larger in all three dimensions then return oversize
    
    if ((parcelLength > 75 && parcelWidth > 80 && parcelHeight > 75) ||
    (parcelLength > 75 && parcelWidth > 75 && parcelHeight > 80) ||
    (parcelLength > 80 && parcelWidth > 75 && parcelHeight > 75)) {
        return true;
    }
    
    // if larger in two dimensions then oversize
    
    if ((parcelLength > 75 && parcelWidth > 75) ||
    (parcelLength > 75 && parcelWidth > 75) ||
    (parcelLength > 75 && parcelHeight > 75) ||
    (parcelLength > 75 && parcelHeight > 75) ||
    (parcelHeight > 75 && parcelWidth > 75) ||
    (parcelHeight > 75 && parcelWidth > 75)) {
        return true;
    }
    
    // if larger in only width > 80cm
    
    if ((parcelLength <= 75 && parcelWidth > 80 && parcelHeight <= 75) ||
    (parcelLength <= 75 && parcelWidth <= 75 && parcelHeight > 80) ||
    (parcelLength > 80 && parcelWidth <= 75 && parcelHeight <= 75)) {
        // if larger in all three dimensions then return oversize
        
        if ((parcelLength > 100 && parcelWidth > 70 && parcelHeight > 75) ||
        (parcelLength > 100 && parcelWidth > 75 && parcelHeight > 70) ||
        (parcelLength > 70 && parcelWidth > 100 && parcelHeight > 75) ||
        (parcelLength > 75 && parcelWidth > 100 && parcelHeight > 70) ||
        (parcelLength > 70 && parcelWidth > 75 && parcelHeight > 100) ||
        (parcelLength > 75 && parcelWidth > 100 && parcelHeight > 70)) {
            return true;
        }
        
        // if larger in two dimensions then oversize
        
        if ((parcelLength > 100 && parcelWidth > 75) ||
        (parcelLength > 75 && parcelWidth > 100) ||
        (parcelLength > 75 && parcelHeight > 100) ||
        (parcelLength > 100 && parcelHeight > 75) ||
        (parcelHeight > 75 && parcelWidth > 100) ||
        (parcelHeight > 100 && parcelWidth > 75)) {
            return true;
        }
        
        // if larger in only height > 100cm
        
        if ((parcelLength <= 70 && parcelWidth > 100 && parcelHeight <= 75) ||
        (parcelLength <= 75 && parcelWidth > 100 && parcelHeight <= 70) ||
        (parcelLength <= 70 && parcelWidth <= 75 && parcelHeight > 100) ||
        (parcelLength <= 75 && parcelWidth <= 70 && parcelHeight > 100) ||
        (parcelLength > 100 && parcelWidth <= 75 && parcelHeight <= 70) ||
        (parcelLength > 100 && parcelWidth <= 70 && parcelHeight <= 75)) {
        
            // if larger in all three dimensions then return oversize
            
            if ((parcelLength > 125 && parcelWidth > 60 && parcelHeight > 75) ||
            (parcelLength > 125 && parcelWidth > 75 && parcelHeight > 60) ||
            (parcelLength > 60 && parcelWidth > 125 && parcelHeight > 75) ||
            (parcelLength > 75 && parcelWidth > 125 && parcelHeight > 60) ||
            (parcelLength > 60 && parcelWidth > 75 && parcelHeight > 125) ||
            (parcelLength > 75 && parcelWidth > 125 && parcelHeight > 60)) {
                return true;
            }
            
            // if larger in two dimensions then oversize
            
            if ((parcelLength > 125 && parcelWidth > 75) ||
            (parcelLength > 75 && parcelWidth > 125) ||
            (parcelLength > 75 && parcelHeight > 125) ||
            (parcelLength > 125 && parcelHeight > 75) ||
            (parcelHeight > 75 && parcelWidth > 125) ||
            (parcelHeight > 125 && parcelWidth > 75)) {
                return true;
            }
            
            
            
            if ((parcelLength <= 60 && parcelWidth <= 125 && parcelHeight <= 75) ||
            (parcelLength <= 75 && parcelWidth <= 125 && parcelHeight <= 60) ||
            (parcelLength <= 60 && parcelWidth <= 75 && parcelHeight <= 125) ||
            (parcelLength <= 75 && parcelWidth <= 60 && parcelHeight <= 125) ||
            (parcelLength <= 125 && parcelWidth <= 75 && parcelHeight <= 60) ||
            (parcelLength <= 125 && parcelWidth <= 60 && parcelHeight <= 75)) {
                return false;
            }
            else {
                return true;
            }
        }
        else {
            return true;
        }
    }
    else {
        return false;
    }
    
    return false;
    
} //function ncSizeCheck

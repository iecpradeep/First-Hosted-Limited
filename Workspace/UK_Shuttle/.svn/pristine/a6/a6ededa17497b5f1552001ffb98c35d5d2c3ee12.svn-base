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

function getHeadNode(){
    var htmlHead = '<head>'; //head start element
    htmlHead += CSS_DEFINITION;
    htmlHead += '</head>'; //head end element
    return htmlHead;
}

// Common variables ...
var maxConsignmentLines = 995;
var userid = 99999; // entity id of the current user
var companyName = 'TEST';
var companyAddr = 'n/a';
var theAcct = 'TEST';
var entityFilter = 'anyof';
var invoiceStatus = '';
var previnvoiceStatus = '';

function getLongMonth(theMonth){
    var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return m[parseInt(theMonth - 1)];
}
var abortScript = false;

function getLongDay(theDay){
    if (parseInt(theDay) <= 9) {
        return '0' + theDay;
    }
    else {
        return theDay;
    }
}

function createReportHeader(){

    var reportTitle = 'Consolidated Super Sales Order (SSO) for : ' + theAcct;
    
    var header = '<tr><td colspan=\"13\" align=\"center\"><h1>' + reportTitle + '</h1></td></tr>';
    header += '<tr><td>DOCNUM</td><td>DATE</td><td>SVCE</td><td>TYPE</td><td>CONSIGNEE</td><td>REF.</td><td>TOWN</td><td width="15mm" style="width:20mm">PCODE</td><td>ITEMS</td><td>WT.</td><td>PRICE</td><td>FUEL</td><td>CLOSE</td></tr>';
    header += '<tr><td colspan=\"13\" style=\"border-top:solid black 2px;\"></td></tr>';
    return header;
}

function createReportFooter(totalConsignments, totalCartons, totalWeight){
    var signatureBlock = '<table  style=\"margin:10px;\"><tr><td ' + fontStyle2 + ' style=\"width:75px; vertical-align:bottom;\">Signature</td><td style=\"width:300px; border-bottom:dotted gray 1px;\"></td></tr><tr><td ' + fontStyle2 + ' style=\"width:75px; height:30px; vertical-align:bottom;\">Print</td><td style=\"width:300px; border-bottom:dotted gray 1px;\"></td></tr></table>';
    
    var footer = '<tr><td ' + fontStyle5 + ' align=\"right\" colspan=\"11\">SPCL Key: F = Fragile, S = Security</td></tr>';
    footer += '<tr><td colspan=\"12\" style=\"height:10px; border-top:solid black 2px;\"></td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"6\">Consignments are carried subject to Terms &amp; Conditions of Carriage,<br />copies of which are available upon request from your depot.</td><td align=\"right\" colspan=\"5\"><b>Total Consignments</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalConsignments + '</td></tr>';
    footer += '<tr><td colspan=\"6\" rowspan=\"3\" style=\"margin:5px; border-top:solid gray 1px; border-right:solid gray 1px; border-bottom:solid gray 1px; border-left:solid gray 1px;\">' + signatureBlock + '</td><td align=\"right\" colspan=\"5\"><b>Total Cartons</b></td><td ' + fontStyle2 + ' align=\"right\">' + totalCartons + '</td></tr>';
    footer += '<tr><td align=\"right\" colspan=\"6\"><b>Total Weight</b></td><td ' + fontStyle2 + ' align=\"right\"><b>' + totalWeight.toFixed(2) + '</b></td></tr>';
    footer += '<tr><td colspan=\"6\"></td></tr>';
    footer += '<tr><td ' + fontStyle5 + ' colspan=\"12\">Confidential Information. Copyright Nationwide Express Parcels 2011. All rights reserved.</td></tr>';
    return footer;
}

function processInvoices(request, response, customerid, startdate, enddate){ // no parameter = default to todays's date ...
    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_ssocustomers_testmode');
    if (testMode == null || testMode == '') {
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
    
    var newSSO = false;
	
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
        if (request.getParameter('custparam_newsso') == 'T')
            newSSO = true;
    }

    var html = '';
    html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
    html += createReportHeader();
    
    // ----- Build Search for this customer ...
	userRecord = nlapiLoadRecord('customer', userid);
    var sortPrefs = userRecord.getFieldValue('custentity_invoice_sort_prefs');
	if (sortPrefs == null || sortPrefs == '') sortPrefs = 1;
	var sortPrefsRecord = nlapiLoadRecord('customrecord_customer_invoice_prefs', sortPrefs);	
    var sortPrefsSavedSearch = sortPrefsRecord.getFieldValue('custrecord_invoice_sortprefs_savedsearch');
    var sortPrefsSort1 = sortPrefsRecord.getFieldValue('custrecord_customer_inv_sort1');
    var sortPrefsSort2 = sortPrefsRecord.getFieldValue('custrecord_customer_inv_sort2');
	var sortPrefsKeepTotal1 = sortPrefsRecord.getFieldValue('custrecord_customer_inv_sort1_total');
	var sortTotal1Index = 0;
	var sortTotal2Index = 0;
	if (sortPrefsKeepTotal1 == 'T') {
		sortPrefsKeepTotal1 = true
	}
	else {
		sortPrefsKeepTotal1 = false;
	}
	var sortPrefsKeepTotal2 = sortPrefsRecord.getFieldValue('custrecord_customer_inv_sort2_total');
	if (sortPrefsKeepTotal2 == 'T') {
		sortPrefsKeepTotal2 = true
	}
	else {
		sortPrefsKeepTotal2 = false;
	}
	
    var mySearchFilters = new Array();
    var mySearchColumns = new Array();
    
    mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
    mySearchFilters[1] = new nlobjSearchFilter('entity', null, entityFilter, userid);
    mySearchFilters[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', invEndDate);
    mySearchFilters[3] = new nlobjSearchFilter('trandate', null, 'onorafter', invStartDate);
    //if (newSSO) {
    //    mySearchFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'noneof', (4)); // Ignore cancelled ones only	
    //}
    //else {
        mySearchFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'noneof', (4, 6)); // Ignore cancelled & invoiced ones
    //}
    mySearchFilters[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
	
	var sortTraceHTML = "Sort by: ";
    var defaultSearch = 'customsearch_allssotransactions_unsorted';
    //if (isTestUser()) {
        var searchCols = new Array('tranid', 'custbody_labelservice', 'custbody_palletparcel', 'custbody_deliveryaddr4', 'custbody_deliverypostcode', 'custbody_labelparcels', 'custbody_labeltotalweight', 'custbody_fuelsurcharge', 'otherrefnum', 'internalid', 'custbody_insurancesurcharge', 'custbody_delname', 'trandate', 'custbody_deliveryaddr3', 'custbody_consignmentstatus', 'custbody_fuelsurchargeratepercent', 'externalid', 'class', 'custbody_insuranceamount');
        var sortCol = searchCols.length; // Append sort column(s) to the end of array
        for (var sc = 0; sc < searchCols.length; sc++) {
            mySearchColumns[sc] = new nlobjSearchColumn(searchCols[sc]);
            if (searchCols[sc] == sortPrefsSort1 || searchCols[sc] == sortPrefsSort2) {
                mySearchColumns[sortCol] = mySearchColumns[sc].setSort();
				if (searchCols[sc] == sortPrefsSort1 && sortPrefsKeepTotal1) sortTotal1Index = parseInt(sc);				
				if (searchCols[sc] == sortPrefsSort2 && sortPrefsKeepTotal2) sortTotal2Index = parseInt(sc);				
 				sortTraceHTML += '[' + sc + '] ' + searchCols[sc] + ' ';
               sortCol++;
            }
        }
		sortTraceHTML += ' : Sort index 1 : ' + sortTotal1Index + ' : Sort index 2 : ' + sortTotal2Index + ' ';
		if (sortPrefsSavedSearch != '' && sortPrefsSavedSearch != null) defaultSearch = sortPrefsSavedSearch;  
   /* }
    else {
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
        mySearchColumns[17] = new nlobjSearchColumn('class');
        mySearchColumns[18] = new nlobjSearchColumn('custbody_insuranceamount');
		defaultSearch = 'customsearch_allssotransactions';
    }
	*/
	
    // Perform search .... 10 Units per run
    var mySearchResults = nlapiSearchRecord('salesorder', defaultSearch, mySearchFilters, mySearchColumns);
	if (theContext.getExecutionContext() != 'scheduled') nlapiLogExecution('AUDIT', 'SSO PARAMS:' + currentSSO, ' NAME:' + companyName + ' NEWSSO?:' + newSSO + ' fromDT:' + invStartDate + ' toDT:' + invEndDate);
    
	var mySearchNumber = 0;
	if (mySearchResults) mySearchNumber = mySearchResults.length;
	
	var SSOCommitFilters = new Array();
    var SSOCommitColumns = new Array();
    
    SSOCommitFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
    SSOCommitFilters[1] = new nlobjSearchFilter('entity', null, entityFilter, userid);
    SSOCommitFilters[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', invEndDate);
    SSOCommitFilters[3] = new nlobjSearchFilter('trandate', null, 'onorafter', invStartDate);
    SSOCommitFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (13)); // SSO in progress
    SSOCommitFilters[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only

    SSOCommitColumns[0] = new nlobjSearchColumn('tranid');

   // Perform search .... 10 Units per run
    var SSOCommitResults = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', SSOCommitFilters, SSOCommitColumns);
	var SSOCommitNumber = 0;
	if (SSOCommitResults) SSOCommitNumber = SSOCommitResults.length;
	
    // Process results .... 
	var usageAvailable = 10000;  
	if (theContext.getExecutionContext() != 'scheduled') usageAvailable = 1000;
	var usageRequired = 0; //Usage to commit all Processed -> Invoiced
	var useTwoPhaseCommit = false; 
	var unitsPerCommit = 30;
	var unitsPerExecution = 150;
    if (mySearchResults && SSOCommitNumber != mySearchResults.length) {
        //userRecord = nlapiLoadRecord('customer', userid);
        var currentSSO = userRecord.getFieldValue('custentity_currentconsolidatedinvoice');
        var userSSOScript = userRecord.getFieldValue('custentity_currentsso_script');
        if (userSSOScript == null) 
            userSSOScript = '';
        if (nlapiGetContext().getSetting('SCRIPT', 'custscript_ssocustomers_newsso_sched') == 'T' && userSSOScript == '') 
            newSSO = true;

        usageRequired = parseInt(mySearchResults.length * unitsPerCommit) + unitsPerExecution;
        // If the job is larger than the required usage will need to be 2-phase to avoid never completing correctly
		if (theContext.getRemainingUsage() < usageRequired) {
			useTwoPhaseCommit = true;
			usageRequired = unitsPerExecution;
		}
        //if (theContext.getExecutionContext() != 'scheduled' || userSSOScript == '' || userSSOScript == theContext.getDeploymentId()) {
		// Only run if a new job or if this is a re-run of a job exceeding usage
        if (userSSOScript == '' || userSSOScript == theContext.getDeploymentId()) {
            companyName = userRecord.getFieldValue('companyname');
            companyAddr = userRecord.getFieldValue('defaultaddress');
            theAcct = userRecord.getFieldValue('entityid');
            var fuelPercent = userRecord.getFieldValue('custentity_fuelsurcharge');
            var waiverSecurity = false;
			if (userRecord.getFieldValue('custentity_waiver_securityfee') == 'T') waiverSecurity = true;
			
            previnvoiceStatus = userRecord.getFieldValue('custentity_consolidatedinvoicefrequency');
			invoiceStatus = previnvoiceStatus;
			if (previnvoiceStatus != '') {
                var userStatusRecord = nlapiLoadRecord('customer', userid);
                userStatusRecord.setFieldValue('custentity_consolidatedinvoicefrequency', previnvoiceStatus);
                //userStatusRecord.setFieldValue('custentity_currentsso_script', theContext.getScriptId() + ':' + theContext.getDeploymentId());
                //invoiceStatus = '6';
                var statusID = nlapiSubmitRecord(userStatusRecord, false, true);
            }
            var newuserRecord = nlapiLoadRecord('customer', userid);
            if ((nlapiGetContext().getSetting('SCRIPT', 'custscript_ignorecustfrequency_sched') == 'T') && (currentSSO == null || currentSSO == '')) 
                newSSO = true;
            
            if (isNaN(fuelPercent) || fuelPercent == null || fuelPercent == '') {
                fuelPercent = 0.00;
            }
            else {
                fuelPercent = parseFloat(fuelPercent);
            }
            
            var SSOstatus = '';
            if (currentSSO == null || currentSSO == '') {
                newSSO = true;
            }
            else {
                var theSSOStatus = nlapiLoadRecord('salesorder', currentSSO);
                SSOstatus = theSSOStatus.getFieldValue('orderstatus');
                if (theSSOStatus.getFieldValue('orderstatus') == 'G') 
                    newSSO = true;
				var theprevSSOitems = theSSOStatus.getLineItemCount('item');
				if (theprevSSOitems >= maxConsignmentLines) // The max. number of lines means we must start a new invoice
                    newSSO = true;
            }
            
            if (testMode) 
                nlapiLogExecution('AUDIT', 'SSO SearchResults:' + currentSSO, ' ITEMS:' + mySearchResults.length + ' NEWSSO?:' + newSSO + ' STATUS:' + SSOstatus);
            
            var totalCartons = 0;
            var totalWeight = 0;
            var totalValue = 0.00;
            var insuranceTotal = 0.00;
            var insuranceItems = 0; // Tracks the offset if insurance items present
            var totalDescItems = 0; // Tracks the offset if total lines present
            var fuelsurchargeTotal = 0.00;
            var theSSOitems = 0;
            var fuelLine = 0;
			var sortTotal1 = 0.00;
			var sortTotalItems1 = 0;
			var sortTotalWeight1 = 0;
			var sortValue1 = '';
			var sortTotal2 = 0.00;
			var sortTotalItems2 = 0;
			var sortTotalWeight2 = 0;
			var sortValue2 = '';
            var consignmentIDList = new Array; // Used to store the IDs & amounts for completion after the SSO is committed
            //var SSOconsignmentIDList = new Array; // Used to store the IDs for completion after the SSO is committed
            var consignmentIDindex = 0;
            if (newSSO) {
                var theSSO = createnewSSO(userid);
                theSSOitems = 1;
            }
            else {
                var theSSO = nlapiLoadRecord('salesorder', currentSSO);
                theSSOitems = theSSO.getLineItemCount('item'); // This will over-write the last line - fuel - which will be re-calculated anyway.
                totalCartons = parseInt(theSSO.getFieldValue('custbody_labelparcels'));
				if (isNaN(totalCartons)) totalCartons = 0;
                totalWeight = parseInt(theSSO.getFieldValue('custbody_labeltotalweight'));
				if (isNaN(totalWeight)) totalWeight = 0;
                totalValue = parseFloat(theSSO.getFieldValue('custbody_sso_goodstotal'));
                insuranceTotal = parseFloat(theSSO.getFieldValue('custbody_sso_notaxtotal'));
                fuelsurchargeTotal = parseFloat(theSSO.getFieldValue('custbody_sso_fuelsurchargetotal'));
				//Load previous consignments, set the correct index and offset to continue
				for (var ci = 1; ci <= theSSOitems; ci++) {
					var thisSSOItem = parseInt(theSSO.getLineItemValue('item', 'item', ci));
					if (thisSSOItem != 114 && thisSSOItem != 141 && thisSSOItem != 128 && thisSSOItem != 146) { // Not insurance or fuel or total desc
						var theSSOconsID = theSSO.getLineItemValue('item', 'custcol_invoiceconsignmentnumber', ci);
						var theSSOamount = theSSO.getLineItemValue('item', 'amount', ci);
						consignmentIDList[consignmentIDindex] = new Array(4);
						consignmentIDList[consignmentIDindex][0] = theSSOconsID; // Save internal ID
						consignmentIDList[consignmentIDindex][1] = theSSOamount; // Save amount
						consignmentIDList[consignmentIDindex][2] = 0; // For internalid added when search runs
						consignmentIDList[consignmentIDindex][3] = theSSO.getLineItemText('item', 'item', ci); // The service name
						consignmentIDindex++;
					} else {
                        
                        if (thisSSOItem == 114 || thisSSOItem == 141) {
                            insuranceItems++;
                        }
                        else {
                            if (thisSSOItem == 146) { // Totals desc
								totalDescItems++;
							}
							else {
								if (thisSSOItem == 128) { // Fuel line found
									fuelLine = -1; //Overwrite last line
								}
							}
                        }
					}
				}
				theSSOitems = theSSOitems + fuelLine; //This will erase FUEL if present
				nlapiLogExecution('AUDIT', 'PREVIOUS ITEMS:' + theSSOitems, ' CONS:' + parseInt(consignmentIDindex-1) + ' INSC:' + insuranceItems + ' FUEL:' + fuelLine);
            }
            
            if (consignmentIDindex > 0) {
				//usageRequired = parseInt(mySearchResults.length * 10) + 100;
				nlapiLogExecution('AUDIT', 'PREVIOUS SSO:' + currentSSO, ' NAME:' + companyName + ' NEWSSO?:' + newSSO + ' 2PHASE?:' + useTwoPhaseCommit + ' theSSOitems:' + theSSOitems + ' totalValue:' + totalValue + ' totalWeight:' + totalWeight + ' insuranceTotal:' + insuranceTotal + ' insuranceItems:' + insuranceItems + ' fuelsurchargeTotal:' + fuelsurchargeTotal + ' totalCartons:' + totalCartons);
			}
			
            var d = new Date();
			if (newSSO) {
				theSSO.setFieldValue('customform', 101); // Will be set to SSO form after commit ...
				theSSO.setFieldValue('exchangerate', 1.0);
				theSSO.setFieldValue('orderstatus', 'A'); //Pending Approval
				theSSO.setFieldValue('trandate', d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
				theSSO.setFieldValue('custbody_ordertype', '3'); //SSO - Invoice
			}
			
            for (var i = 0; ((i < mySearchResults.length) && (consignmentIDindex <= maxConsignmentLines)); i++) {
				var ssoRecFound = false;
				var currentIDFound = '';
				if (consignmentIDList){
					for (var cf=0; cf < consignmentIDList.length; cf++){
						//nlapiLogExecution('AUDIT', 'FOUND:' + cf + '/' + consignmentIDList.length, ' i:' + i + ' consignmentIDList[cf][0]:' + consignmentIDList[cf][0] + ' mySearchResults[i].getValue(mySearchColumns[9]):' + mySearchResults[i].getValue(mySearchColumns[9]));
						if (consignmentIDList[cf][0] == mySearchResults[i].getValue(mySearchColumns[9])){ //internalid found so skip it
							ssoRecFound = true;
							currentIDFound = consignmentIDList[cf][0];
							consignmentIDList[cf][2] = mySearchResults[i].getValue(mySearchColumns[0]); // Set =  tranid
	                        //nlapiLogExecution('DEBUG', 'Already done - Set Array :' + cf, consignmentIDList[cf][0] + ':' + consignmentIDList[cf][1] + ':' + consignmentIDList[cf][2] + ':' + consignmentIDList[cf][3]);
							break;
						}
					}
				}
				if (!ssoRecFound) { //Not found so add it
					var docnum = mySearchResults[i].getValue(mySearchColumns[0]); //Netsuite tranid by default
					if (mySearchResults[i].getValue(mySearchColumns[16]) != null && mySearchResults[i].getValue(mySearchColumns[16]) != '') {
						var docArray = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[16])).split(':');
						if (docArray.length == 2) 
							docnum = docArray[1]; // The external reference over-rides ...		
					}
					
					var trandate = mySearchResults[i].getValue(mySearchColumns[12]);
					var ServiceArray = mySearchResults[i].getValue(mySearchColumns[1]).split(' ');
					var service = nlapiEscapeXML(ServiceArray[0]);
					var PURclass = parseInt(mySearchResults[i].getValue(mySearchColumns[17]));
					if (PURclass == 6 || PURclass == 10) 
						service += ' P'; // Shows a PUR
					var custRef = mySearchResults[i].getValue(mySearchColumns[8]);
					var consignee = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[11]));
					var servicetype = nlapiEscapeXML(mySearchResults[i].getText(mySearchColumns[2]));
					var fuelsurcharge = mySearchResults[i].getValue(mySearchColumns[7]);
					if (isNaN(fuelsurcharge) || fuelsurcharge == null || fuelsurcharge == '') {
						fuelsurcharge = 0.00;
					}
					else {
						fuelsurcharge = parseFloat(fuelsurcharge);
					}
					
					var town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[13]));
					if (town == null || town == '') 
						town = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[3]));
					var postcode = nlapiEscapeXML(mySearchResults[i].getValue(mySearchColumns[4]));
					var parcels = parseInt(mySearchResults[i].getValue(mySearchColumns[5]));
					totalCartons = parseInt(totalCartons) + parseInt(parcels); // for footer ...
					var parcelweight = parseInt(mySearchResults[i].getValue(mySearchColumns[6]));
					totalWeight = parseInt(totalWeight) + parseInt(parcelweight);
					var fuel = mySearchResults[i].getValue(mySearchColumns[7]);
					
					// Add this to the Consignment list array if the list is committed will be needed
					consignmentIDList[consignmentIDindex] = new Array(4);
					consignmentIDList[consignmentIDindex][0] = mySearchResults[i].getValue(mySearchColumns[9]);
					consignmentIDList[consignmentIDindex][2] = mySearchResults[i].getValue(mySearchColumns[0]);
					consignmentIDList[consignmentIDindex][3] = mySearchResults[i].getValue(mySearchColumns[1]);
					var theConsingmentRec = nlapiLoadRecord('salesorder', consignmentIDList[consignmentIDindex][0]);
					var amount = theConsingmentRec.getLineItemValue('item', 'amount', 1);
					consignmentIDList[consignmentIDindex][1] = amount;
                    //nlapiLogExecution('DEBUG', 'New Entry - Set Array :' + consignmentIDindex, consignmentIDList[consignmentIDindex][0] + ':' + consignmentIDList[consignmentIDindex][1] + ':' + consignmentIDList[consignmentIDindex][2] + ':' + consignmentIDList[consignmentIDindex][3]);
					
					var isDiscrep = 'F';
					if (theConsingmentRec.getLineItemValue('item', 'custcol_invoicemanuallyamended', 1) == 'T') 
						isDiscrep = 'T';
					
					if (fuelsurcharge == 0.00 && fuelPercent > 0.00) 
						fuelsurcharge = (parseFloat(fuelPercent / 100) * parseFloat(amount)).toFixed(4)
					fuelsurchargeTotal = fuelsurchargeTotal + (fuelsurcharge * 1.00);
					
					totalValue = totalValue + parseFloat(amount);                  
                    
					var sortOffset = 1;

                    if (sortTotal2Index > 0) { // See if a total required ....
                        var sortVal2 = mySearchResults[i].getValue(mySearchColumns[sortTotal2Index]);
                        if (!isNaN(sortVal2)) {
                            var textVal2 = mySearchResults[i].getText(mySearchColumns[sortTotal2Index]);
                            if (textVal2 != null && textVal2 != '') 
                                sortVal2 = textVal2;
                        }
                        if (sortVal2 == sortValue2 || sortValue2 == "") {
                            sortTotal2 = parseFloat(sortTotal2) + parseFloat(amount);
							sortTotalWeight2 = parseInt(sortTotalWeight2) + parseInt(parcelweight);
							sortTotalItems2 = parseInt(sortTotalItems2) + parseInt(parcels);
                            if (sortValue2 == "") 
                                sortValue2 = sortVal2;
                        }
                        if (sortVal2 != sortValue2 && sortValue2 != "") { // Add the total to web page and SSO
                            html += '<tr><td colspan=\"13\">Total for ' + sortValue2 + ' : ' + sortTotal2 + '</td></tr>';
                            totalDescItems++;
                            DescItemsIndex = theSSOitemindex + sortOffset;
							sortOffset++;
                            theSSO.setLineItemValue('item', 'item', DescItemsIndex, 146); // Description total internal id
                            theSSO.setLineItemValue('item', 'description', DescItemsIndex, 'Total amount for ' + sortValue2 + ' : ' + parseFloat(sortTotal2).toFixed(2) + ' :  Total Items ' + sortTotalItems2 + ' :  Total Weight ' + sortTotalWeight2 + ' KG  : ');
							nlapiLogExecution('AUDIT', 'SORT 2 :' + sortValue2, 'LINE:' + DescItemsIndex + ' VAL:' + sortValue2 + ' TOTAL:' + parseFloat(sortTotal2).toFixed(2) + ' ITEMS:' + sortTotalItems2 + ' WEIGHT:' + sortTotalWeight2);                                                        
                            sortValue2 = sortVal2;
                            sortTotal2 = parseFloat(amount);
							sortTotalItems2 = parseInt(parcels);
                            sortTotalWeight2 = parseInt(parcelweight);
                        }
                    }

                    if (sortTotal1Index > 0) { // See if a total required ....
                        var sortVal = mySearchResults[i].getValue(mySearchColumns[sortTotal1Index]);
                        if (!isNaN(sortVal)) {
                            var textVal = mySearchResults[i].getText(mySearchColumns[sortTotal1Index]);
                            if (textVal != null && textVal != '') 
                                sortVal = textVal;
                        }
                        if (sortVal == sortValue1 || sortValue1 == "") {
                            sortTotal1 = parseFloat(sortTotal1) + parseFloat(amount);
							sortTotalWeight1 = parseInt(sortTotalWeight1) + parseInt(parcelweight);
							sortTotalItems1 = parseInt(sortTotalItems1) + parseInt(parcels);
                            if (sortValue1 == "") 
                                sortValue1 = sortVal;
                        }
                        if (sortVal != sortValue1 && sortValue1 != "") { // Add the total to web page and SSO
                            html += '<tr><td colspan=\"13\">Total for ' + sortValue1 + ' : ' + sortTotal1 + '</td></tr>';
                            totalDescItems++;
                            DescItemsIndex = theSSOitemindex + sortOffset;
                            theSSO.setLineItemValue('item', 'item', DescItemsIndex, 146); // Description total internal id
                            theSSO.setLineItemValue('item', 'description', DescItemsIndex, 'Total amount for ' + sortValue1 + ' : ' + parseFloat(sortTotal1).toFixed(2) + ' :  Total Items ' + sortTotalItems1 + ' :  Total Weight ' + sortTotalWeight1 + ' KG  : ');
							nlapiLogExecution('AUDIT', 'SORT 1 :' + sortValue1, 'LINE:' + DescItemsIndex + ' VAL:' + sortValue1 + ' TOTAL:' + parseFloat(sortTotal1).toFixed(2) + ' ITEMS:' + sortTotalItems1 + ' WEIGHT:' + sortTotalWeight1);                            
                            sortValue1 = sortVal;
                            sortTotal1 = parseFloat(amount);
							sortTotalItems1 = parseInt(parcels);
                            sortTotalWeight1 = parseInt(parcelweight);
                        }
                    }

					var theSSOitemindex = parseInt(consignmentIDindex + insuranceItems + totalDescItems + 1);
					if (testMode) nlapiLogExecution('AUDIT', 'NEW ITEM:' + theSSOitemindex + '/' + mySearchResults.length, ' consignmentIDindex][0]:' + consignmentIDList[consignmentIDindex][0] + ' [consignmentIDindex][1]:' + consignmentIDList[consignmentIDindex][1] + ' [consignmentIDindex][2]:' + consignmentIDList[consignmentIDindex][2] + ' AMOUNT:' + amount);

					theSSO.setLineItemValue('item', 'item', theSSOitemindex, theConsingmentRec.getLineItemValue('item', 'item', 1));
					theSSO.setLineItemValue('item', 'quantity', theSSOitemindex, 1);
					theSSO.setLineItemValue('item', 'price', theSSOitemindex, -1); //Custom Pricing
					theSSO.setLineItemValue('item', 'rate', theSSOitemindex, amount);
					theSSO.setLineItemValue('item', 'amount', theSSOitemindex, amount);
					//theSSO.setLineItemValue('item', 'custcol_invoiceservice', i + theSSOitems + insuranceItems, theConsingmentRec.getLineItemValue('item', 'itemid', 1));
					theSSO.setLineItemValue('item', 'custcol_invoiceservice', theSSOitemindex, service);
					theSSO.setLineItemValue('item', 'taxcode', theSSOitemindex, 6); //S-GB 			
					theSSO.setLineItemValue('item', 'custcol_invoiceconsignmentnumber', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[9])); // internald		
					theSSO.setLineItemValue('item', 'custcol_invoiceconsignmentdate', theSSOitemindex, trandate);
					theSSO.setLineItemValue('item', 'custcol_invoicenumberofitems', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[5]));
					theSSO.setLineItemValue('item', 'custcol_invoiceweight', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[6]));
					theSSO.setLineItemValue('item', 'custcol_fuelsurchargeamount', theSSOitemindex, fuelsurcharge);
					theSSO.setLineItemValue('item', 'custcol_insuranceamount', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[10]));
					theSSO.setLineItemValue('item', 'custcol_invoicepalletparcel', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[2]));
					theSSO.setLineItemValue('item', 'custcol_invoicefullcost', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[2]));
					theSSO.setLineItemValue('item', 'custcol_invoicedeliverypostcode', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[4]));
					theSSO.setLineItemValue('item', 'custcol_invoicedeliverytown', theSSOitemindex, town);
					theSSO.setLineItemValue('item', 'custcol_invoiceconsignee', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[11]));
					theSSO.setLineItemValue('item', 'custcol_invoicerefno', theSSOitemindex, mySearchResults[i].getValue(mySearchColumns[8]));
					theSSO.setLineItemValue('item', 'custcol_invoicedocnum', theSSOitemindex, docnum);
					theSSO.setLineItemValue('item', 'custcol_invoicemanuallyamended', theSSOitemindex, isDiscrep);
					
					//Add insurance item if applicable ...
                    var insuranceSurcharge = 0.00;
                    if (!isNaN(mySearchResults[i].getValue(mySearchColumns[10]))) 
                        insuranceSurcharge = parseFloat(mySearchResults[i].getValue(mySearchColumns[10]));
                    var insuranceItemValue = 0;
                    if (!isNaN(mySearchResults[i].getValue(mySearchColumns[18]))) 
                        insuranceItemValue = parseInt(mySearchResults[i].getValue(mySearchColumns[18]));
                    
                    if (insuranceSurcharge > 0) {
                        if (insuranceItemValue > 0) { // Charge in any circumstances
                            insuranceItems++;
                            insuranceIndex = theSSOitemindex + 1;
                            theSSO.setLineItemValue('item', 'item', insuranceIndex, 114); // Insurance internal id
                            theSSO.setLineItemValue('item', 'amount', insuranceIndex, insuranceSurcharge.toFixed(2));
                            theSSO.setLineItemValue('item', 'price', insuranceIndex, -1); //Custom Pricing
                            theSSO.setLineItemValue('item', 'rate', insuranceIndex, insuranceSurcharge.toFixed(2));
                            theSSO.setLineItemValue('item', 'custcol_invoiceservice', insuranceIndex, 'Liability surcharge - Cons# ' + docnum);
                            theSSO.setLineItemValue('item', 'description', insuranceIndex, 'LIAB');
                            theSSO.setLineItemValue('item', 'taxcode', insuranceIndex, 14); //Z-GB 	
                            insuranceTotal = insuranceTotal + (insuranceSurcharge * 1.00);
                        }
                        else {
                            if (insuranceItemValue == 0 && !waiverSecurity) {
                                insuranceItems++;
                                insuranceIndex = theSSOitemindex + 1;
                                theSSO.setLineItemValue('item', 'item', insuranceIndex, 141); // SECURITY internal id
                                theSSO.setLineItemValue('item', 'amount', insuranceIndex, insuranceSurcharge.toFixed(2));
                                theSSO.setLineItemValue('item', 'price', insuranceIndex, -1); //Custom Pricing
                                theSSO.setLineItemValue('item', 'rate', insuranceIndex, insuranceSurcharge.toFixed(2));
                                theSSO.setLineItemValue('item', 'custcol_invoiceservice', insuranceIndex, 'Security surcharge - Cons# ' + docnum);
                                theSSO.setLineItemValue('item', 'description', insuranceIndex, 'SECY');
                                theSSO.setLineItemValue('item', 'taxcode', insuranceIndex, 6); //SR-GB 	
                                //insuranceTotal = insuranceTotal + (insuranceSurcharge * 1.00);
                                totalValue = totalValue + parseFloat(insuranceSurcharge); // Add to taxable total
                            }
                        }
                    } // if insurancesurcharge

                    if (useTwoPhaseCommit) { // This SSO is larger than usage limit so use 2-phase commit approach
                        //Set the 'lightweight' status using 10 units and move on ...
                        //var SSOCommitFields = ('orderstatus', 'custbody_consignmentstatus', 'memo');
                        //var SSOCommitData = ('A', '13', 'SSO internal id : ' + currentSSO + ' : ' + d); // In SSO Process status
                        //nlapiSubmitField('salesorder', mySearchResults[i].getValue(mySearchColumns[9]), SSOCommitFields, SSOCommitData); // In SSO Process status
                        //nlapiSubmitField('salesorder',mySearchResults[i].getValue(mySearchColumns[9]),'custbody_consignmentstatus', '13');
                        // Old way was 30 units per commit
                        // theConsingmentRec.setFieldValue('orderstatus', 'A'); // Set back to Pending Approval ...
                        theConsingmentRec.setFieldValue('custbody_consignmentstatus', '13'); // In SSO Process
                        theConsingmentRec.setFieldValue('memo', 'SSO phase 1 completed : ' + d);
                        nlapiSubmitRecord(theConsingmentRec, false, true);
                    }
								
					var closeURL = '<a href="/app/accounting/transactions/salesordermanager.nl?type=closeremaining&whence=&trantype=salesorder&id=' + mySearchResults[i].getValue(mySearchColumns[9]) + '" target="_blank">Close ...</a>';
					//nlapiLogExecution('DEBUG', 'LINE NEW :SSO:' + currentSSO, 'LINE:' + theSSOitemindex + ' IDX:' + consignmentIDindex + ' DOCNUM:' + docnum + ' DATE:' + trandate + ' SRVC:' + service + ' AMOUNT:' + amount);
					html += '<tr><td>' + docnum + '</td><td>' + trandate + '</td><td>' + service + '</td><td>' + servicetype + '</td><td>' + consignee + '</td><td>' + custRef + '</td><td>' + town + '</td><td>' + postcode + '</td><td>' + parcels + '</td><td>' + parcelweight + '</td><td>' + amount + '</td><td>' + fuelsurcharge + '</td><td>' + closeURL + '</td></tr>';
					consignmentIDindex++;
				} //if (!ssoRecFound)
				else {
					//nlapiLogExecution('DEBUG', 'LINE OLD :SSO:' + currentSSO, 'IDX:' + consignmentIDindex + ' RECID:' + currentIDFound);
					html += '<tr><td colspan=\"12\">Already processed IDX:' + consignmentIDindex + ' RECID:' + currentIDFound + '</td></tr>';
				}
                // re-schedule if running out ...          
                if (theContext.getExecutionContext() == 'scheduled' && theContext.getRemainingUsage() <= usageRequired && (i + 1) < mySearchResults.length) {
                    var params = new Array();
                    params['custscript_activesso'] = currentSSO;
                    var status = nlapiScheduleScript(theContext.getScriptId(), theContext.getDeploymentId(), params)
                    if (status == 'QUEUED') { // Is queued so set up for the next batch for this same SSO
                        theSSO.setFieldValue('custbody_sso_goodstotal', totalValue.toFixed(2));
                        theSSO.setFieldValue('custbody_sso_fuelsurchargetotal', fuelsurchargeTotal.toFixed(2));
                        theSSO.setFieldValue('custbody_sso_notaxtotal', parseFloat(insuranceTotal).toFixed(2));
                		theSSO.setFieldValue('custbody_sso_noofcons', parseInt(consignmentIDindex));
                        theSSO.setFieldValue('custbody_sso_netsubtotal', parseFloat(fuelsurchargeTotal + totalValue).toFixed(2));
                        theSSO.setFieldValue('custbody_labelparcels', totalCartons);
                        theSSO.setFieldValue('custbody_labeltotalweight', totalWeight);
                        theSSO.setFieldValue('custbody_insurancesurcharge', insuranceItems); // Tracks the offset if insurance items present
                        currentSSO = nlapiSubmitRecord(theSSO, false, true);
                        nlapiLogExecution('AUDIT', 'ABORT :SSO:' + currentSSO, 'ITEMS:' + (i + 1) + ':USAGE:' + theContext.getRemainingUsage());
                        newuserRecord.setFieldValue('custentity_currentconsolidatedinvoice', currentSSO);
                        //newuserRecord.setFieldValue('custentity_currentsso_script', '');
                        newuserRecord.setFieldValue('custentity_currentsso_script', theContext.getDeploymentId());
                        nlapiSubmitRecord(newuserRecord, false, true); // Use script ID to lock it and prevent others grabbing
                    }
                    abortScript = true;
                }
            } // for ...
            if (!abortScript || (theSSOitemindex == maxConsignmentLines)) { // Aborted as usage expired or reached max. order lines
                if (sortTotal1Index > 0) { // See if a final total required ....
                   	html += '<tr><td colspan=\"13\">Total for ' + sortValue1 + ' : ' + sortTotal1 + '</td></tr>';
                   	//DescItemsIndex = theSSOitemindex + 1;
					var DescItemsIndex = parseInt(consignmentIDindex + totalDescItems + insuranceItems + 1);
                    theSSO.setLineItemValue('item', 'item', DescItemsIndex, 146); // Description total internal id
                    theSSO.setLineItemValue('item', 'description', DescItemsIndex, 'Total amount for ' + sortValue1 + ' : ' + parseFloat(sortTotal1).toFixed(2) + ' :  Total Items ' + sortTotalItems1 + ' :  Total Weight ' + sortTotalWeight1 + ' KG  : ');
                    totalDescItems++;
                }
				//Add on the Fuel surcharge as a final item
                if (fuelsurchargeTotal > 0) {
					var theFuelItemIndex = parseInt(consignmentIDindex + totalDescItems + insuranceItems + 1);
                    //var theFuelItemIndex = theSSOitemindex + 1;
                    theSSO.setLineItemValue('item', 'item', theFuelItemIndex, 128); // Fuel surcharge internal id
                    theSSO.setLineItemValue('item', 'amount', theFuelItemIndex, fuelsurchargeTotal.toFixed(2));
                    theSSO.setLineItemValue('item', 'price', theFuelItemIndex, -1); //Custom Pricing
                    theSSO.setLineItemValue('item', 'rate', theFuelItemIndex, fuelsurchargeTotal.toFixed(2));
                    theSSO.setLineItemValue('item', 'custcol_invoiceservice', theFuelItemIndex, 'FUEL');
                    theSSO.setLineItemValue('item', 'description', theFuelItemIndex, 'Fuel surcharge for consignments above');
                    theSSO.setLineItemValue('item', 'taxcode', theFuelItemIndex, 6); //SR-GB 	
                }
                
                //Complete the SSO / customer updates ... 20 units per SSO
                theSSO.setFieldValue('orderstatus', 'B'); //Pending Billing
                theSSO.setFieldValue('custbody_sso_goodstotal', totalValue.toFixed(2));
                theSSO.setFieldValue('custbody_sso_fuelsurchargetotal', fuelsurchargeTotal.toFixed(2));
                theSSO.setFieldValue('custbody_sso_notaxtotal', parseFloat(insuranceTotal).toFixed(2));
                theSSO.setFieldValue('custbody_sso_noofcons', parseInt(consignmentIDindex));
                theSSO.setFieldValue('custbody_sso_netsubtotal', parseFloat(fuelsurchargeTotal + totalValue).toFixed(2));
                var theDateRange = invStartDate + ' - ' + invEndDate;
                if (invStartDate == invEndDate) 
                    theDateRange = invStartDate;
                theSSO.setFieldValue('memo', 'SSO : NET ' + totalValue.toFixed(2) + ' + FUEL ' + fuelsurchargeTotal.toFixed(2) + ' : ' + theDateRange + ' : ' + consignmentIDindex + ' Consignments : ' + totalWeight + ' KG');
                currentSSO = nlapiSubmitRecord(theSSO, false, true);
                var theSSOtranid = theSSO.getFieldValue('tranid');
                var invMgrURL = nlapiResolveURL('SUITELET', 'customscript_consolidatedconsignments', 'customdeploy_consolidatedconsigndeploy1');
                html += '<tr><td colspan=\"13\" style=\"border-top:solid black 2px;\"></td></tr>';
                html += '<tr><td colspan=\"13\">' + sortTraceHTML + '</td></tr>';
                html += '<tr><td colspan=\"5\"><a href=\"../../accounting/transactions/salesord.nl?id=' + currentSSO + '&whence=&cf=136\" target=\"_blank\">Click to view Consolidated Order ' + theSSOtranid + '</a> (internalid = ' + currentSSO + ')</td><td colspan=\"3\"></td><td colspan=\"5\"><a href=\"' + invMgrURL + '\">Back to Invoice Manager ...<a/></td></tr>';
                
                // The SSO is committed so update the associated consignments ...				
                
                if (!useTwoPhaseCommit) {
                     for (c = 0; c < consignmentIDList.length; c++) {
					 	/*
	 // Is 10 units of usage per commit
	 var SSOCommitFields = ('orderstatus', 'custbody_consignmentstatus', 'memo');
	 var SSOCommitData = ('A', '6', 'SSO internal id : ' + currentSSO + ' : ' + d);
	 nlapiSubmitField('salesorder', consignmentIDList[c][0], SSOCommitFields, SSOCommitData); // In SSO Process status
	 */
							// Old way was 30 units per commit
	                        //nlapiLogExecution('DEBUG', 'Status Complete - Read Array :' + c, consignmentIDList[c][0] + ':' + consignmentIDList[c][1] + ':' + consignmentIDList[c][2] + ':' + consignmentIDList[c][3] + ' USAGE:' + theContext.getRemainingUsage());
							if (consignmentIDList[c][0]){
								var commitConsignmentRec = nlapiLoadRecord('salesorder', consignmentIDList[c][0]);
								commitConsignmentRec.setFieldValue('orderstatus', 'A'); // Set back to Pending Approval ...
								//commitConsignmentRec.setLineItemValue('item', 'taxcode', 1, 6); //SR-GB
								//commitConsignmentRec.setLineItemValue('item', 'rate', 1, consignmentIDList[c][1]); //SR-GB
								//commitConsignmentRec.setLineItemValue('item', 'amount', 1, consignmentIDList[c][1]); //SR-GB
								commitConsignmentRec.setFieldValue('custbody_consignmentstatus', '6'); // Invoiced
								commitConsignmentRec.setFieldValue('memo', 'SSO internal id ref. : ' + currentSSO + ' : ' + d);
								nlapiSubmitRecord(commitConsignmentRec, false, true);
							}
	                        //nlapiLogExecution('DEBUG', 'Status Complete :' + c + ':' + consignmentIDList[c][0] , 'STATUS:' + commitConsignmentRec.getFieldValue('orderstatus') + ':USAGE:' + theContext.getRemainingUsage());
						}
                }
                else {
                    // Do nothing - will be cleaned up by another process as long as SSO status is 'invoiced'
                }
                
                // Now complete the SSO ... 50 units for completion
                var commitSSORec = nlapiLoadRecord('salesorder', currentSSO);
                //var commitSSOitems = commitSSORec.getLineItemCount('item');
				var taxTotal = 0.00; 
				if (commitSSORec.getFieldValue('taxtotal') != null && commitSSORec.getFieldValue('taxtotal') != '')
					taxTotal = parseFloat(commitSSORec.getFieldValue('taxtotal'));
				if (taxTotal == 0.00)
                	taxTotal = parseFloat(commitSSORec.getFieldValue('total') - commitSSORec.getFieldValue('custbody_sso_netsubtotal') - commitSSORec.getFieldValue('custbody_sso_notaxtotal'));
                //var taxTotal = 0.00;
                //for (t = 1; t <= commitSSOitems; t++) taxTotal = taxTotal + parseFloat(commitSSORec.getLineItemValue('item', 'tax1amt', t)); //SR-GB 	
                //commitSSORec.setFieldValue('orderstatus', 'B'); //Pending Billing
                //commitSSORec.setFieldValue('customform', 136); //SSO for invoicing form
                commitSSORec.setFieldValue('custbody_consignmentstatus', '6'); //Set to Invoiced              
                commitSSORec.setFieldValue('custbody_sso_taxtotal', taxTotal.toFixed(2));
                commitSSORec.setFieldValue('custbody_labelparcels', totalCartons);
                commitSSORec.setFieldValue('custbody_labeltotalweight', totalWeight);
                commitSSORec.setFieldValue('custbody_insurancesurcharge', insuranceItems); // Tracks the offset if insurance items present
                nlapiSubmitRecord(commitSSORec, false, true);
                
                //if (previnvoiceStatus == '6') { // Locked for Invoicing - prevents spawning more SSO's if exceeds usage limit / time delays
                newuserRecord.setFieldValue('custentity_consolidatedinvoicefrequency', '1');
                //}
                newuserRecord.setFieldValue('custentity_currentconsolidatedinvoice', currentSSO);
                newuserRecord.setFieldValue('custentity_currentsso_script', '');
                nlapiSubmitRecord(newuserRecord, false, true);
                
                nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ': Completed SSO:' + currentSSO, 'ITEMS:' + (commitSSORec.getLineItemCount('item') - 1) + '/' + mySearchResults.length + ': TAX:' + taxTotal.toFixed(2) + ': USAGE REMAINING:' + theContext.getRemainingUsage());
                
            }
        }
        else {
            nlapiLogExecution('AUDIT', 'Skipped SSO:' + currentSSO, 'ITEMS:' + theSSOitems + ': USAGE REQUIRED:' + usageRequired + ': USAGE AVAILABLE:' + theContext.getRemainingUsage());
        }
    }
    else {
        nlapiLogExecution('AUDIT', 'Completed SSO:' + currentSSO, 'ITEMS:' + theSSOitems + ' COMMITTED:' + SSOCommitNumber + ': USAGE AVAILABLE:' + theContext.getRemainingUsage());
        html += '<tr><td colspan=\"12\">There are no consignments for ' + invStartDate + '-' + invEndDate + '</td></tr>';
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
}

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    var theContext = nlapiGetContext();
    var theRole = parseInt(theContext.getRole());
    var theUser = parseInt(theContext.getUser());
    if (parseInt(theUser) == 7 || parseInt(theUser) == 873) 
        testMode = true; // 873 = TESTCOMPANY	
    return testMode;
}

function createnewSSO(userid){ //SSO = Super Sales Order ...
    var SSODefaults = new Array();
    SSODefaults['entity'] = userid; // the Customer
    return nlapiCreateRecord('salesorder', SSODefaults);
}

function processSSOCustomers(request, response){

    var testMode = nlapiGetContext().getSetting('SCRIPT', 'custscript_ssocustomers_testmode');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = nlapiGetContext().getSetting('SCRIPT', 'custscript_ignorecustfrequency');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
	var abortProcess = false;
    var savedsearchCustomer = nlapiGetContext().getSetting('SCRIPT', 'custscript_savedsearchcustomer');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
        savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
		//abortProcess = true;

    var invStartDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_sdt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_sdt') != null) {
		invStartDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_sdt'));
	} else {
		//abortProcess = true;
	}

    var invEndDate = getLocalDate();
    if (nlapiGetContext().getSetting('SCRIPT', 'custscript_edt') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_edt') != null) {
        invEndDate = nlapiStringToDate(nlapiGetContext().getSetting('SCRIPT', 'custscript_edt'));
	} else {
		//abortProcess = true;
	}
    
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
    
	if (!abortProcess) {
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
				entitySearchColumns[8] = new nlobjSearchColumn('custentity_currentsso_script');
				
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
						
						var mySearchFilters = new Array();
						var mySearchColumns = new Array();
						
						mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
						mySearchFilters[1] = new nlobjSearchFilter('entity', null, 'anyof', entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
						mySearchFilters[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', eDTparam);
						mySearchFilters[3] = new nlobjSearchFilter('trandate', null, 'onorafter', sDTparam);
						mySearchFilters[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (1, 11)); // Entered, Repriced
						mySearchFilters[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only - not SSOs
						mySearchColumns[0] = new nlobjSearchColumn('tranid');
						mySearchColumns[1] = new nlobjSearchColumn('custbody_consignmentstatus');
						// Perform search ....
						var mySearchResults = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', mySearchFilters, mySearchColumns);
						
						// Process results ....
						if (!mySearchResults) { // No Entered so proceed                    
							nlapiLogExecution('AUDIT', 'No outstanding Entered Orders for :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), "None Entered.");
							if (testMode) 
								html += '<tr><td>' + entitySearchResults[theCustomer].getValue(entitySearchColumns[4]) + '</td><td>' + frequency + '</td><td>' + sDTparam + '</td><td>' + eDTparam + '</td></tr>';
							processInvoices(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
						}
						else {
							var ErrMsg = '';
							for (var t = 0; t < mySearchResults.length; t++) 
								ErrMsg += mySearchResults[i].getText(mySearchColumns[1]).substring(0, 1) + ':' + mySearchResults[i].getValue(mySearchColumns[0]) + ' ';
							nlapiLogExecution('AUDIT', mySearchResults.length + ' outstanding Entered / Repricing orders for :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), ErrMsg);
						}
					}
				} // if (entitySearchResults)
			} // if (soRecordId)
		} // for ...
	} else {
		nlapiLogExecution('AUDIT', 'Process Aborted - parameters missing',  nlapiGetContext().getDeploymentId());
	}
    html += '</table>';
    html = '<!DOCTYPE ' + outputType + ' PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
    //if (testMode) 
    //    response.write(html);
}

function processSSOCustomersSched(request, response){ // Scheduled script version
	var theContext = nlapiGetContext();		
    var testMode = theContext.getSetting('SCRIPT', 'custscript_ssocustomers_testmode_sched');
    if (testMode == null) 
        testMode = false;
    if (testMode == 'Y' || testMode == 'T') 
        testMode = true;
    
    var ignoreFrequency = theContext.getSetting('SCRIPT', 'custscript_ignorecustfrequency_sched');
    if (ignoreFrequency == null || ignoreFrequency == 'F') {
        ignoreFrequency = false;
    }
    else {
        ignoreFrequency = true;
    }
    
	var abortProcess = false;
    var savedsearchCustomer = theContext.getSetting('SCRIPT', 'custscript_savedsearchcustomer_sched');
    if (savedsearchCustomer == null || savedsearchCustomer == '') 
		abortProcess = true;
        //savedsearchCustomer = 'customsearch_supersalesordercustomers'; // Default search
		
    var invStartDate = getLocalDate();
    if (theContext.getSetting('SCRIPT', 'custscript_sdt_sched') != '' && theContext.getSetting('SCRIPT', 'custscript_sdt_sched') != null) {
        invStartDate = nlapiStringToDate(theContext.getSetting('SCRIPT', 'custscript_sdt_sched'));
	} else {
		abortProcess = true;
	}
    
    var invEndDate = getLocalDate();
    if (theContext.getSetting('SCRIPT', 'custscript_edt_sched') != '' && theContext.getSetting('SCRIPT', 'custscript_edt_sched') != null) {
        invEndDate = nlapiStringToDate(theContext.getSetting('SCRIPT', 'custscript_edt_sched'));
    }
    else {
        abortProcess = true;
    }

    var outputType = 'html';
    var html = '';
    html += '<table ' + fontStyle1 + ' cellpadding=\"2\" width=\"100%\">';
	
    //if (!abortProcess && !testMode) {
    if (!abortProcess) {
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
		entitySearchColumns[8] = new nlobjSearchColumn('custentity_currentsso_script');

		nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ':entitySearchResults', "Usage Remaining : " + theContext.getRemainingUsage());

		var entitySearchResults = nlapiSearchRecord('customer', savedsearchCustomer, entitySearchFilters, entitySearchColumns);
		
		if (entitySearchResults) {
			for (theCustomer = 0; theCustomer < entitySearchResults.length; theCustomer++) {
				var frequency = 2; // Weekly by default
				if (entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != null && entitySearchResults[theCustomer].getValue(entitySearchColumns[7]) != '') 
					frequency = parseInt(entitySearchResults[theCustomer].getValue(entitySearchColumns[7]));
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
				
				var activeSSO = '';
				if (nlapiGetContext().getSetting('SCRIPT', 'custscript_activesso') != '' && nlapiGetContext().getSetting('SCRIPT', 'custscript_activesso') != null) 
					activeSSO = nlapiGetContext().getSetting('SCRIPT', 'custscript_activesso');
				
				var currentScript = entitySearchResults[theCustomer].getValue(entitySearchColumns[8]);
				if ((currentScript == null || currentScript == '') || ((currentScript != null && currentScript != '') && currentScript == nlapiGetContext().getDeploymentId())) { //Invoice run in progress || new invoice - check is not re-spawning using script parameter
					var sDTparam = invStartDate.getDate() + '/' + (invStartDate.getMonth() * 1 + 1) + '/' + invStartDate.getFullYear();
					var eDTparam = invEndDate.getDate() + '/' + (invEndDate.getMonth() * 1 + 1) + '/' + invEndDate.getFullYear();
					
					var mySearchFilters = new Array();
					var mySearchColumns = new Array();
					
					mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
					mySearchFilters[1] = new nlobjSearchFilter('entity', null, 'anyof', entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
					mySearchFilters[2] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (1, 11)); // Entered or Repricing
					mySearchFilters[3] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
					mySearchFilters[4] = new nlobjSearchFilter('trandate', null, 'onorbefore', eDTparam);
					mySearchFilters[5] = new nlobjSearchFilter('trandate', null, 'onorafter', sDTparam);
					mySearchColumns[0] = new nlobjSearchColumn('tranid');
					mySearchColumns[1] = new nlobjSearchColumn('custbody_consignmentstatus');
					// Perform search ....
					nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ':mySearchResults', "Usage Remaining : " + theContext.getRemainingUsage());

					var mySearchResults = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', mySearchFilters, mySearchColumns);
					
					var mySearchFilters2 = new Array();
					var mySearchColumns2 = new Array();
					
					// Added April 2012 
					/*
				 mySearchFilters2[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
				 mySearchFilters2[1] = new nlobjSearchFilter('entity', null, 'anyof', entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
				 mySearchFilters2[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', eDTparam);
				 mySearchFilters2[3] = new nlobjSearchFilter('trandate', null, 'onorafter', sDTparam);
				 mySearchFilters3[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (5)); // Processed
				 mySearchFilters2[4] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
				 mySearchFilters2[5] = new nlobjSearchFilter('amount', null, 'equalto', 0); //
				 mySearchColumns2[0] = new nlobjSearchColumn('tranid');
				 // Perform search ....
				 var mySearchResults2 = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', mySearchFilters2, mySearchColumns2);
				 var noItems = 0;
				 if (mySearchResults2 != null) noItems = mySearchResults2.length;
				 var mySearchFilters3 = new Array();
				 var mySearchColumns3 = new Array();
				 
				 mySearchFilters3[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
				 mySearchFilters3[1] = new nlobjSearchFilter('entity', null, 'anyof', entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
				 mySearchFilters3[2] = new nlobjSearchFilter('trandate', null, 'onorbefore', eDTparam);
				 mySearchFilters3[3] = new nlobjSearchFilter('trandate', null, 'onorafter', sDTparam);
				 mySearchFilters3[4] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (4, 6));
				 mySearchFilters3[5] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
				 mySearchColumns3[0] = new nlobjSearchColumn('tranid');
				 */
					// Perform search ....
					//var mySearchResults3 = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', mySearchFilters3, mySearchColumns3);
					// Process results ....
					//if ((!mySearchResults && !mySearchResults2 && noItems <= 50) || (!mySearchResults && parseInt(entitySearchResults[theCustomer].getValue(entitySearchColumns[6]))) == 262) { // No Entered so proceed                    
					//if ((!mySearchResults && noItems > 0 && noItems <= 200 && parseInt(entitySearchResults[theCustomer].getValue(entitySearchColumns[6])) != 972) || (parseInt(entitySearchResults[theCustomer].getValue(entitySearchColumns[6])) == 972 && nlapiGetContext().getDeploymentId() == "customdeploy_costcu_only")) { // No Entered so proceed                    
					if (!mySearchResults) { // No Entered so proceed                    
						nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ': No outstanding Entered Orders for :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[0]), " : " + sDTparam + " -" + eDTparam + " : Active SSO: " + activeSSO + " : Create? " + ignoreFrequency);
						if (testMode) 
							html += '<tr><td>' + entitySearchResults[theCustomer].getValue(entitySearchColumns[4]) + '</td><td>' + frequency + '</td><td>' + sDTparam + '</td><td>' + eDTparam + '</td></tr>';
						processInvoices(request, response, entitySearchResults[theCustomer].getValue(entitySearchColumns[6]), sDTparam, eDTparam)
					}
					else {
						var ErrMsg = '';
						var ErrItems = 0;
						if (mySearchResults) {
							for (var t = 0; t < mySearchResults.length; t++) {
								ErrItems = mySearchResults.length;
								var Estatus = '?';
								if (mySearchResults[t].getText(mySearchColumns[1]) != null) 
									Estatus = mySearchResults[t].getText(mySearchColumns[1]).substring(0, 1);
								var Etranid = "?";
								if (mySearchResults[t].getValue(mySearchColumns[0]) != null) 
									Etranid = mySearchResults[t].getValue(mySearchColumns[0]);
								ErrMsg += Estatus + ':' + Etranid + ' ';
							}
						}
						else {
							if (mySearchResults2) {
								ErrItems = mySearchResults2.length;
								ErrMsg = 'PURs found';
							}
							else {
								if (mySearchResults3) {
									ErrItems = mySearchResults3.length;
									ErrMsg = ErrItems + 'Items to be processed';
								}
							}
						}
						nlapiLogExecution('AUDIT', ErrItems + ' outstanding Entered / For Repricing orders for :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[0]), ErrMsg);
					}
				}
				else {
					nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ': Locked for invoicing :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[0]), "Active SSO: " + activeSSO);
				}
			}
		} // if (entitySearchResults)
	} else {
		nlapiLogExecution('AUDIT', theContext.getDeploymentId() + ': Process Aborted - parameters missing', 'testMode=' + testMode + ' custscript_savedsearchcustomer_sched=' + theContext.getSetting('SCRIPT', 'custscript_savedsearchcustomer_sched') + ' custscript_sdt_sched=' + nlapiGetContext().getSetting('SCRIPT', 'custscript_sdt_sched') + ' custscript_edt_sched=' + nlapiGetContext().getSetting('SCRIPT', 'custscript_edt_sched'));
	}
    html += '</table>';
    html = '<!DOCTYPE ' + outputType + ' PUBLIC \"-//W3C//DTD XHTML 1.0 Transitional//EN\" \"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd\">\n' + getHeadNode() + '\n<body ' + fontStyle5 + '>\n' + html + '\n</body>\n</' + outputType + '>';
    //if (testMode) 
    //    response.write(html);

}

function complete2PhaseCommit_sched(request, response){
    var entitySearchFilters = new Array();
    var entitySearchColumns = new Array();
    
    entitySearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    entitySearchFilters[1] = new nlobjSearchColumn('custentity_currentconsolidatedinvoice', null, 'noneof', 'none');
    
    entitySearchColumns[0] = new nlobjSearchColumn('companyname');
    entitySearchColumns[1] = new nlobjSearchColumn('custentity_currentconsolidatedinvoice');
    entitySearchColumns[2] = new nlobjSearchColumn('email');
    entitySearchColumns[3] = new nlobjSearchColumn('custentity_factorrefno');
    entitySearchColumns[4] = new nlobjSearchColumn('entityid');
    entitySearchColumns[5] = new nlobjSearchColumn('custentity_contact');
    entitySearchColumns[6] = new nlobjSearchColumn('internalid');
    entitySearchColumns[7] = new nlobjSearchColumn('custentity_consolidatedinvoicefrequency');
    entitySearchColumns[8] = new nlobjSearchColumn('custentity_currentsso_script');
    
    //var entitySearchResults = nlapiSearchRecord('customer', 'customsearch_twophasecommit_pending', entitySearchFilters, entitySearchColumns);
    var entitySearchResults = nlapiSearchRecord('customer', null, entitySearchFilters, entitySearchColumns);
    
    if (entitySearchResults) {
        for (theCustomer = 0; theCustomer < entitySearchResults.length; theCustomer++) {
        
            var currentSSO = entitySearchResults[theCustomer].getValue(entitySearchColumns[1]);
            var currentSSOstatus = parseInt(nlapiLookupField('salesorder', currentSSO, 'custbody_consignmentstatus'));
            
            nlapiLogExecution('AUDIT', '2 Phase Commit :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[1]), 'SSO:' + currentSSO + ' STATUS:' + currentSSOstatus);
            
            if (currentSSOstatus == 6) { //Invoiced so OK to clean up
                var mySearchFilters = new Array();
                var mySearchColumns = new Array();
                
                mySearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T'); // Supress detail lines ...
                mySearchFilters[1] = new nlobjSearchFilter('entity', null, 'anyof', entitySearchResults[theCustomer].getValue(entitySearchColumns[6]));
                mySearchFilters[2] = new nlobjSearchFilter('custbody_consignmentstatus', null, 'anyof', (13)); // SSO in process
                mySearchFilters[3] = new nlobjSearchFilter('memo', null, 'contains', currentSSO); // SSO in process
                mySearchFilters[4] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', ('1')); // Consignments only
                //mySearchFilters[5] = new nlobjSearchFilter('trandate', null, 'on', 'today');
                
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
                mySearchColumns[17] = new nlobjSearchColumn('class');
                // Perform search ....
                var mySearchResults = nlapiSearchRecord('salesorder', 'customsearch_allssotransactions', mySearchFilters, mySearchColumns);
                
                if (mySearchResults) { //Commit them
                    var commitLog = "";
                    for (var t = 0; t < mySearchResults.length; t++) {
                        if (mySearchResults[t].getValue(mySearchColumns[14]) == '13') {
                            commitLog += mySearchResults[t].getValue(mySearchColumns[9]) + " "
                            //nlapiSubmitField('salesorder', mySearchResults[t].getValue(mySearchColumns[9]), 'custbody_consignmentstatus', '6'); // Invoiced
                        }
                        nlapiLogExecution('AUDIT', '2 Phase Commit :' + entitySearchResults[theCustomer].getValue(entitySearchColumns[1]), 'COMMITTED:' + commitLog);
                    }
                }
            }
        }
    }
}

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

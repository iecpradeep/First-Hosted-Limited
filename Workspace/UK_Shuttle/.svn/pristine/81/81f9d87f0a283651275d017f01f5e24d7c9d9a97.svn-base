/******************************************
 * Email Depots Suitelet
 * Version 1.0.0
 * 03/08/11
 */
function emailDepots(request, response){

    //Process parameters / defaults
	var theContext = nlapiGetContext();
    var user = theContext.getUser();
    var role = theContext.getRole();
    
    var testMode = false;
    var testParam = null;
	
    var soRecords = new Array;    
	if (nlapiGetContext().getExecutionContext() == 'suitelet') {
    	testParam = theContext.getSetting('SCRIPT', 'custscript_emailtestmode');
		if (request.getParameter('custparam_depotids') != null) {
			soRecords = request.getParameter('custparam_depotids').split(',');
		}
		else {
			if (request.getParameter('custparam_depotid') != null) {
				soRecords[0] = request.getParameter('custparam_depotid');
			}
			else { //Assume all depots so set to special value
				soRecords[0] = 'ALL';
			}
		}
	} else {
		testParam = theContext.getSetting('SCRIPT', 'custscript_schedemailtest');
	    var testDepots = theContext.getSetting('SCRIPT', 'custscript_schedtestdepotslist');
	    if (testDepots == null || testDepots == ''){
	    	soRecords[0] = 'ALL';
	    } else {
	    	soRecords = testDepots.split(',');
	    }
	}
    
    if (testParam == 'Y') testMode = true;

    var testDate = theContext.getSetting('SCRIPT', 'custscript_schedtestdate');
    var d = new Date();
    if (testDate != null && testDate != ''){
    	d = nlapiStringToDate(testDate);
    }
    //var hours = d.getHours() + parseInt(d.getTimezoneOffset() / 60);
	var hours = parseFloat(d.getHours() + (d.getTimezoneOffset() / 60));
    if (hours < 24) d = nlapiAddDays(d, -1); // In same day as UK so set back 1 day to sync
    var dateselect = nlapiDateToString(d, 'date');
	
    if (nlapiGetContext().getExecutionContext() == 'suitelet') {
        if (request.getParameter('custparam_dt')) dateselect = request.getParameter('custparam_dt');
    }
	
    // Process each depot
    for (var soRec = 0; soRec < soRecords.length; soRec++) {
    
        var soRecordId = soRecords[soRec];
        
        var depotSearchFilters = new Array();
        var depotSearchColumns = new Array();
        
        depotSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
        depotSearchFilters[1] = new nlobjSearchFilter('custrecord_depotservicetype', null, 'anyof', [1]);
        depotSearchFilters[2] = new nlobjSearchFilter('custrecord_dbfdepotemail', null, 'isnotempty', null);
        if (soRecordId != 'ALL') 
            depotSearchFilters[3] = new nlobjSearchFilter('custrecord_dbfdepotnumber', null, 'equalto', soRecordId);
        
        depotSearchColumns[0] = new nlobjSearchColumn('custrecord_dbfdepottelnumber');
        depotSearchColumns[1] = new nlobjSearchColumn('custrecord_dbfdepotnumber');
        depotSearchColumns[2] = new nlobjSearchColumn('custrecord_dbfdepotemail');
        depotSearchColumns[3] = new nlobjSearchColumn('custrecord_dbfdepotcontact');
        depotSearchColumns[4] = new nlobjSearchColumn('custrecord_dbfdepotnumber');
        
        var depotSearchResults = nlapiSearchRecord('customrecord_depotlist', null, depotSearchFilters, depotSearchColumns);

        if (depotSearchResults) {
            for (var theDepot = 0; theDepot < depotSearchResults.length; theDepot++) {
            	var depotEmail = depotSearchResults[theDepot].getValue(depotSearchColumns[2]);
                if (depotEmail != '') {
                                        
                    var consignmentColumns = new Array;
                    var consignmentFilters = new Array;
                    
                    consignmentFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
                    consignmentFilters[1] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', [1]);
                    consignmentFilters[2] = new nlobjSearchFilter('trandate', null, 'on', dateselect);
                    consignmentFilters[3] = new nlobjSearchFilter('class', null, 'anyof', [8]);
                    consignmentFilters[3] = new nlobjSearchFilter('custbody_requestingdepot', null, 'is', depotSearchResults[theDepot].getValue(depotSearchColumns[4]));
                    
                    consignmentColumns[0] = new nlobjSearchColumn('name');
                    consignmentColumns[1] = new nlobjSearchColumn('number');
                    consignmentColumns[2] = new nlobjSearchColumn('trandate');
                    consignmentColumns[3] = new nlobjSearchColumn('custbody_labelservice');
                    consignmentColumns[4] = new nlobjSearchColumn('custbody_delname');
                    consignmentColumns[5] = new nlobjSearchColumn('externalid');
                    consignmentColumns[6] = new nlobjSearchColumn('custbody_currentlabelcount');
                    consignmentColumns[7] = new nlobjSearchColumn('custbody_labeltotalweight');
                    consignmentColumns[8] = new nlobjSearchColumn('custbody_routeoptimisedeta');
                    consignmentColumns[9] = new nlobjSearchColumn('custbody_deliverypostcode');
                    consignmentColumns[10] = new nlobjSearchColumn('class');
                    consignmentColumns[11] = consignmentColumns[8].setSort();
                    consignmentColumns[12] = new nlobjSearchColumn('custbody_pickupname');
                    
                    var consignmentResults = null;
                    if (testMode) {
                        consignmentResults = nlapiSearchRecord('transaction', null, consignmentFilters, consignmentColumns); //TEST SEARCH
                    }
                    else {
                        consignmentResults = nlapiSearchRecord('transaction', null, consignmentFilters, consignmentColumns); //LIVE SEARCH
                    }

                    if (consignmentResults) {
                    	var thisDepot = getParcelDepotNo();
                        var title = "APC Depot " + thisDepot + " - Deliveries for Depot " + depotSearchResults[theDepot].getValue(depotSearchColumns[4]) + " - " + consignmentResults.length + " Consignments for " + dateselect + "...";
                        var html = "<body><table>";
                        html += "<tr><td colspan='10' align='center'><b>PARCEL DELIVERY NOTIFICATION</b></td></tr>";
                        html += "<tr><td colspan='10'>To : " + depotEmail + "</td></tr>";
                        html += "<tr><td colspan='10'>Subject : " + title + "</td></tr>";
                        html += "<tr><td colspan='10'><p><b>Dear APC Partner,</b></p>";
                        html += "<p>Please see below details of your customers' consignments submitted for " + dateselect + ", to be delivered by APC Depot " + thisDepot + ".</p>";
                        html += "<p><b>These are estimated times of deliveries only and may vary throughout the day due to local issues unforeseen when the route is optimised.</b>";
                        html += "<br /></td></tr>";
                        html += "<tr><td><b>No.</b></td><td><b>Consignment</b></td><td><b>Date</b></td><td><b>Consignor</b></td><td><b>Consignee</b></td><td><b>Service</b></td><td><b>PostCode</b></td><td><b>Item(s)</b></td><td><b>Weight (kg)</b></td><td><b>ETA</b></td></tr>";
                        html += "<tr><td colspan='10'><hr /></td></tr>";
                        
                        rowLimit = consignmentResults.length;
                        
                        var lineNum = 1;
                        for (var i = 0; i < rowLimit; i++) {
							var theService = consignmentResults[i].getValue(consignmentColumns[3]);
							var theItems = consignmentResults[i].getValue(consignmentColumns[6]);
							if (theService == '' || theService == null){
								var soRecord = nlapiLoadRecord('salesorder', consignmentResults[i].getId());
            					var theServiceArray = soRecord.getLineItemText('item', 'item', 1).split(' '); //The service item
								theService = theServiceArray[0];
            					var theItems = soRecord.getLineItemValue('item', 'custcol_consignment_numberofparcels', 1); //The service item
            					//var currentItem = nlapiLoadRecord('serviceitem', currentItemId);
							}
                            html += "<tr><td>" + lineNum + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[5]) + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[2]) + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[12]) + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[4]) + "</td><td>" + theService + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[9]) + "</td><td>" + theItems + "</td><td>" + consignmentResults[i].getValue(consignmentColumns[7]) + "</td>";
                            var thisStatus = consignmentResults[i].getValue(consignmentColumns[8]);
                            var thisAPCDate = consignmentResults[i].getValue(consignmentColumns[2]);
                            if (thisStatus != '' && thisAPCDate != '') {
                                html += "<td>" + thisStatus + "</td></tr>";
                            }
                            else {
                                //html += "<td>&nbsp;</td></tr>";
                                html += "<td>n/a</td></tr>";
                            }
                            lineNum++;
                        }
                        
                        html += "<tr><td colspan='10'><hr /></td></tr>";
                        html += "<tr><td colspan='10'><p>Note: Any ETA marked 'n/a' could not be calculated, normally caused by an invalid post code.</p></td></tr>";
                        html += "<tr><td colspan='10'><p>This notification email is supplied as part of a working test of NEP's new Business Management system, designed to help us all manage our customers' business more efficiently and effectively. If you would like to know more about the system please contact :-</p>";
                        html += "<br />Ian Johnson, NEP - <a href='mailto:ian.johnson@nepparcels.co.uk'>mailto:ian.johnson@nepparcels.co.uk</a></td></tr>";
                        html += "</table></body>";
                        
						var TransportUserID = 779;
                        if (testMode) {
                            nlapiSendEmail(user, 'leighjdarby@gmail.com', "TEST MODE: " + title, html, null, null, null, null);
                            //nlapiSendEmail(TransportUserID, 'ian.johnson@nepparcels.co.uk', "TEST MODE: " + title, html, 'derekhughes@deltacomputingltd.co.uk', null, null, null);
                        } else {
                           nlapiSendEmail(TransportUserID, depotEmail, title, html, null, null, null, null);
                           //nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "LIVE MODE: " + title, html, null, null, null, null);
						}
                        nlapiLogExecution('DEBUG', 'DEPOT EMAIL:' + soRecordId + ' : ' + rowLimit + ' consignments', ' TEST:' + testMode + ' EMAIL:' + depotEmail + ' DATE:' + dateselect);
                    } // if any consignments for depot ...
                } // if email column != '' ...
            } //For depot ...
        } // if search results ...
    }
}

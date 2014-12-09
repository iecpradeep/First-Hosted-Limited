/* Parcel & Pallet Rates Automation - Event Script
 * Version 1.0.10
 * 05/11/10
 */
function parcelRate_event(type){

	var theContext = nlapiGetContext();
    var user = theContext.getUser();
    var mainMenu = false;
    var printOnSave = false;
    var newWindow = 'F';

    nlapiLogExecution('DEBUG', 'type:' + type + ' user: ' + user, 'class:' + nlapiGetFieldValue('class') + ' depot:' + nlapiGetFieldValue('custbody_receivingdepot'));
    if (type == 'create' || type == 'edit') {
    
        //Obtain a handle to the newly created consignment
        var soRecord = nlapiGetNewRecord();
        var soRecordId = soRecord.getId();
        
        var orderType = soRecord.getFieldValue('custbody_ordertype');
        
        if (orderType == '1') {
        
            nlapiSubmitField('salesorder', soRecordId, 'custbody_readytime_text', soRecord.getFieldValue('custbody_readytime'), false);
            nlapiSubmitField('salesorder', soRecordId, 'custbody_closetime_text', soRecord.getFieldValue('custbody_closetime'), false);
            
            var postcode = ''; // Secondary post code if applicable
            if (soRecord.getFieldValue('custbody_parcelarea2') == '33') 
                postcode = 'RD1';
            if (soRecord.getFieldValue('custbody_parcelarea2') == '34') 
                postcode = 'RD2';
            if (soRecord.getFieldValue('custbody_parcelarea2') == '35') 
                postcode = 'RD3';
            if (soRecord.getFieldValue('custbody_parcelarea2') == '36') 
                postcode = 'RD4';
            if (postcode != '') 
                nlapiSubmitField('salesorder', soRecordId, 'custbody_deliverypostcode2', postcode, false);
            
            var postcode2 = ''; // Secondary post code if applicable
            if (soRecord.getFieldValue('custbody_collectparcelarea2') == '33') 
                postcode2 = 'RD1';
            if (soRecord.getFieldValue('custbody_collectparcelarea2') == '34') 
                postcode2 = 'RD2';
            if (soRecord.getFieldValue('custbody_collectparcelarea2') == '35') 
                postcode2 = 'RD3';
            if (soRecord.getFieldValue('custbody_collectparcelarea2') == '36') 
                postcode2 = 'RD4';
            if (postcode2 != '') 
                nlapiSubmitField('salesorder', soRecordId, 'custbody_pickuppostcode2', postcode2, false);
            
            var labelCount = soRecord.getFieldValue('custbody_currentlabelcount');
            
            if (parseInt(labelCount) < 10) {
                labelCount = '00' + labelCount;
            } //if
            if (parseInt(labelCount) >= 10 && parseInt(labelCount) < 100) {
                labelCount = '0' + labelCount;
            } //if
            var reqDepot = soRecord.getFieldValue('custbody_requestingdepot');
            if (parseInt(reqDepot) < 10) {
                reqDepot = '00' + reqDepot;
            } //if			
            if (parseInt(reqDepot) >= 10 && parseInt(reqDepot) < 100) {
                reqDepot = '0' + reqDepot;
            } //if
            var trandate = soRecord.getFieldValue('trandate');
            var d = nlapiStringToDate(trandate);
            
            var day = d.getDate().toString();
            var month = (d.getMonth() + 1).toString();
            var year = d.getFullYear().toString();
            
            if (parseInt(day) < 10) {
                day = '0' + day;
            } //if
            if (parseInt(month) < 10) {
                month = '0' + month;
            } //if
            //Use correct NetSuite or External identifier for barcode / epod
            var consignmentnumber = nlapiLookupField('salesorder', soRecordId, 'tranid');
            var Externalnumber = soRecord.getFieldValue('externalid');
            //if (Externalnumber != null && Externalnumber != '' && soRecord.getFieldValue('custbody_syntheticimport') != 'T') {
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
            var barcode = reqDepot;
            barcode += soRecord.getFieldValue('custbody_apccustomerid');
            barcode += consignmentnumber;
            //barcode += labelCount;
            nlapiSubmitField('salesorder', soRecordId, 'custbody_labelbarcode', barcode, false);
            nlapiSubmitField('salesorder', soRecordId, 'custbody_taapdevicestatus', Externalnumber, false);
            
            //create identifier
            var identifier = year;
            identifier += month;
            identifier += day;
            identifier += reqDepot;
            identifier += soRecord.getFieldValue('custbody_apccustomerid');
            identifier += consignmentnumber;
            nlapiSubmitField('salesorder', soRecordId, 'custbody_identifier', identifier, false);
            

			            // Added May 2013 - create lookup record XRef
			if (soRecord.getFieldValue('custbody_otherrefnum') != null
					&& soRecord.getFieldValue('custbody_otherrefnum') != '') {
				var refnoList = new Array();
				var lookuprefColumns = new Array;
				var lookuprefFilters = new Array;
				var newRefObj = null;
				lookuprefFilters[0] = new nlobjSearchFilter('name', null,
						'contains', soRecord
								.getFieldValue('custbody_otherrefnum'));
				lookuprefFilters[1] = new nlobjSearchFilter(
						'custrecord_refno_customer_lookup', null, 'anyof',
						soRecord.getFieldValue('entity'));
				lookuprefColumns[0] = new nlobjSearchColumn('internalid');
				var lookuprefResults = nlapiSearchRecord(
						'customrecord_reference_lookup', null,
						lookuprefFilters, lookuprefColumns);
				if (lookuprefResults) {
					newRefObj = nlapiLoadRecord(
							'customrecord_reference_lookup',
							lookuprefResults[0].getValue(lookuprefColumns[0]));
				} else {
					newRefObj = nlapiCreateRecord('customrecord_reference_lookup');
				}
				newRefObj.setFieldValue('custrecord_consignment_refno_lookup',
						soRecordId);
				newRefObj.setFieldValue('custrecord_refno_customer_lookup',
						soRecord.getFieldValue('entity'));
				newRefObj.setFieldValue('custrecord_refno_lookup_consdate',
						soRecord.getFieldValue('trandate'));
				newRefObj.setFieldValue('name', soRecord
						.getFieldValue('custbody_otherrefnum'));
				var returnRefID = nlapiSubmitRecord(newRefObj, false);
				if (returnRefID)
					nlapiLogExecution('DEBUG','Refrecord: ' + returnRefID,'ref:' + soRecord
							.getFieldValue('custbody_otherrefnum') + ' tranid:' + soRecordId);
			}
            
            var orderClass = soRecord.getFieldValue('class');
            if (orderClass == '2') { //APC
                //create POD link
            	var depotRef = nlapiLookupField('customrecord_parameters',1,'custrecord_epodlink_depot_ref');
            	//var depotRef = 'zie';
                var link = "http://www.apc-overnight.com/epod/view-pod.php?";
                link += "&D='" + depotRef;
                link += "'&A='" + soRecord.getFieldText('entity');
                link += "'&I='";
                link += identifier;
                link += "\'";
                nlapiSubmitField('salesorder', soRecordId, 'custbody_epodlink', link, false);                
            }

            /*
            var consigneeEmail = soRecord.getFieldValue('custbody_consignee_email');
            var emailConsignee = soRecord.getFieldValue('custbody_send_consignee_email');
            if (orderClass == '1' || orderClass == '2') { //TPN or APC
                if (type == 'create' && consigneeEmail != '' && consigneeEmail != null && (emailConsignee == 'T' || emailConsignee == 'Y'))
                	emailEPOD(soRecordId);
                 nlapiLogExecution('DEBUG', type + ': Email Consignee:' + soRecordId, 'custbody_consignee_email:' + consigneeEmail + ' custbody_send_consignee_email:' + emailConsignee);
            }
            */
            
            var currentContext = nlapiGetContext();
            var orderStatus = soRecord.getFieldValue('custbody_consignmentstatus');
            if (type == 'create' && orderClass == '10' && orderStatus == '1' && isCustomerCenter() && currentContext.getExecutionContext() == 'userinterface') { // Pallet PUR entered status = email for TPN to process
                var params = new Array();
                params['custparam_cid'] = soRecordId;
                //nlapiSetRedirectURL('SUITELET', 28, 2, false, params);
                emailTPNPUR(soRecordId); // Used instead of Suitelet which isn't working ...
                //nlapiSendEmail(779, 'leigh@firsthosted.co.uk', "PUR EMAIL TEST", "PUR OrderID = " + soRecordId + "<br />Params = " + params['custparam_cid'] + "<br />" + nlapiResolveURL('SUITELET', 28, 1), null, null, null, null);
            } //if orderType==1	   

			var theDate = new Date();
			var currentItem = soRecord.getLineItemValue('item', 'item',1);
            var ipSearchFilters = new Array();
            var ipSearchColumns = new Array();            
            // Check for Saturday services
            //ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_servicelookup', null, 'is', currentItem);
            ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_saturdayservice', null, 'is', 'T');
            ipSearchColumns[0] = new nlobjSearchColumn('custrecord_palletparam_servicelookup');
            // perform search
            var ipSearchResults = nlapiSearchRecord('customrecord_itemparameterspallet', null, ipSearchFilters, ipSearchColumns);
			//if (isTestUser())
			//	nlapiLogExecution('DEBUG', 'SAT Test', 'ipSearchResults = ' + ipSearchResults);
            if (ipSearchResults) {
                for (var ss = 0; ss < ipSearchResults.length; ss++) {
					//if (isTestUser())
					//	nlapiLogExecution('DEBUG', 'SAT Test', 'currentItem = ' + currentItem + ' ipSearchResults[ss].getValue(ipSearchColumns[0] = ' + ipSearchResults[ss].getValue(ipSearchColumns[0]));
                    if (currentItem == ipSearchResults[ss].getValue(ipSearchColumns[0]) && theDate.getDay() == 5 && currentContext.getExecutionContext() == 'userinterface') { //Saturday Service and a Friday so alert Customer Services ...
                    	emailTPNSaturdayService(soRecordId); 
                    }
                }
            } //if
                        
            if (currentContext.getExecutionContext() == 'webservices') {
                var deliveryType = getDeliveryType(soRecord.getFieldValue('class'), soRecord.getFieldValue('custbody_receivingdepot'));
                if (deliveryType == 'HT') {
                    validateCountryPostcode('collect');
                }
                else {
                    if (deliveryType == 'TH') {
                        validateCountryPostcode('deliver');
                    }
                    else { // Must be TT
                        validateCountryPostcode('deliver');
                    }
                }
				nlapiSubmitField('salesorder', soRecordId, 'custbody_receivingdepot', soRecord.getFieldValue('custbody_receivingdepot'), false);
            }
			
            var saveNew = soRecord.getFieldValue('custbody_saveandnew');

            //if (saveNew == 'T' && type == 'create') {
            if (saveNew == 'T') {
                var formID = soRecord.getFieldValue('customform');
                var params = new Array();
                params['cf'] = formID;
                params['dt'] = 'T';
                params['pr'] = 'F';
                //nlapiLogExecution('DEBUG', 'custbody_saveandnew Script Id:' + soRecordId, 'custbody_saveandnew:' + saveNew + ' customform:' + formID);
                if (!isCustomerCenter()) 
                    nlapiSubmitField('salesorder', soRecordId, 'custbody_saveandnew', 'F', false); //Prevents re-occuring on edit as a backup
                nlapiSetRedirectURL('RECORD', 'salesorder', null, false, params);
                //nlapiRequestURL('https://system.sandbox.netsuite.com/app/accounting/transactions/salesord.nl?cf=' + formID + '&dt=T&pr=F');
                //window.location = 'app/accounting/transactions/salesord.nl?cf=' + formID + '&dt=T&pr=F';
            }
            else {
                    var params = new Array();
                    params['version'] = '1';
                    params['custparam_cid'] = soRecordId;
                    params['custparam_typeid'] = soRecord.getFieldValue('custbody_palletparcel');
                    params['custparam_printonsave'] = soRecord.getFieldValue('custbody_printonsubmit');
                    
                    if (nlapiGetContext().getSessionObject('cm_Params') != null) {
                        var prevparamStr = nlapiGetContext().getSessionObject('cm_Params');
                        var prevparams = prevparamStr.split('&');
                        
                        if (prevparams != null) {
                            var pn = 0;
                            for (var p = 0; p < prevparams.length; p++) {
                                if (prevparams[p] != null) {
                                    var thisParams = prevparams[p].split('=');
                                    if (thisParams[0] != null && thisParams[1] != null) {
                                        params[thisParams[0]] = thisParams[1];
                                        pn++;
                                    }
                                }
                            }
                            
                        }
                    }

                 if (!isCustomerCenter()) {                   
                    if (params['version'] == '2') {
                        //if (params['custparam_cm'] == null) { //Consignment or Transport Manager
                        if (params['custparam_tm'] == null) { //Consignment or Transport Manager
                            nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager_v2', 'customdeploy_consignmentmanager_v2', false, params);
                        }
                        else {
                            nlapiSetRedirectURL('SUITELET', 'customscript_transportmanagerv2', 'customdeploy_transportmanagerv2', false, params);
                        }
                    }
                    else {
                        //if (params['custparam_cm'] == null) { //Consignment or Transport Manager
                        
                        if (params['custparam_tm'] == null) { //Consignment or Transport Manager
                            nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1', false, params);
                        }
                        else {
                            nlapiSetRedirectURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager', false, params);
                        }
                    }
                } else {
                    var custRecord = nlapiLoadRecord('customer', user);
                    nlapiSubmitField('customer', user, 'custentity_lastconsignment_created', soRecordId, false);
                    /*
            		if (soRecord.getFieldValue('custbody_printonsubmit') == 'T')
            			printOnSave = true;
            		if (printOnSave && soRecord.getFieldValue('custbody_palletparcel') == '1'){
                        nlapiSetRedirectURL('SUITELET','customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter', false, params);
            		}
                    if (printOnSave && soRecord.getFieldValue('custbody_palletparcel') == '2')
                        nlapiSetRedirectURL('SUITELET','customscript_labelpalletprinter', 'customdeploy_deploypalletprinter', false, params);
                     */
                	if (custRecord.getFieldValue('custentity_use_login_menu') == 'T')
            			mainMenu = true;
                	if (custRecord.getFieldValue('custentity_login_menu_open_newwindow') == 'T')
            			newWindow = 'T';
                	var mainMenuURL = nlapiResolveURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login');
                    params['custparam_newwindow'] = newWindow;
                    nlapiLogExecution('DEBUG', 'mainMenu:' + mainMenu, ' isCustomerCenter():' + isCustomerCenter() + ' saveNew:' + saveNew);
                    if (mainMenu){
                    	//nlapiLogExecution('DEBUG', 'mainMenu redirect BEFORE:' + mainMenu, ' isCustomerCenter():' + isCustomerCenter() + ' saveNew:' + saveNew + ' URL:' + mainMenuURL);
                        nlapiSetRedirectURL('SUITELET', 'customscript_customercenter_login', 'customdeploy_customercenter_login', false, params);
                    	//nlapiLogExecution('DEBUG', 'mainMenu redirect AFTER:' + mainMenu, ' isCustomerCenter():' + isCustomerCenter() + ' saveNew:' + saveNew + ' URL:' + mainMenuURL);
                    }
                 }
            }
            
            /*
             if (soRecord.getFieldValue('custbody_printonsubmit') == 'T'){
             nlapiSubmitField('salesorder', soRecordId, 'custbody_printonsubmit', 'F', false);
             var params = new Array();
             params['custparam_cid'] = soRecordId;
             nlapiSetRedirectURL('SUITELET', 9, 1, false, params);
             }
             */
        } //if orderType==1		
    } //if create / edit
    return true;
    
} //function

function emailEPOD(soRecordId)
{
	var testMode = 'N';
	var soRecord = nlapiLoadRecord('salesorder', soRecordId);
	if (soRecord)
	{
		var parcelDepotID = getParcelDepotNo();
		var requestingCustomer = nlapiEscapeXML(soRecord.getFieldText('entity'));
		var contactname = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_deliverycontact'));
		var pucontactname = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_pickupcontact'));
		if (pucontactname == null)
			pucontactname = '';
		var puname = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_pickupname'));
		if (puname == null)
			puname = '';
		var companyname = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_delname'));
		var customerName = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_delname'));
		var conService = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_labelservice'));
		var conWeight = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_labeltotalweight'));
		var conParcels = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_labelparcels'));
		var conRefNo = nlapiEscapeXML(soRecord.getFieldValue('otherrefnum'));
		var conInstructions = nlapiEscapeXML(soRecord
				.getFieldValue('custbody_specialinstructions'));
		var conNumber = nlapiEscapeXML(soRecord.getFieldValue('tranid'));
		var conDate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
		var EPODlink = soRecord.getFieldValue('custbody_epodlink');
		var consigneeEmail = soRecord.getFieldValue('custbody_consignee_email');

		var consignorName = soRecord.getFieldValue('custbody_pickupcontact');
		var consignorTelno = soRecord.getFieldValue('custbody_pickuptelno');

		// load depot details if present
		var depotLookupID = soRecord.getFieldValue('custbody_depot_lookup');

		var depotAddress = '';
		var depotEmail = '';
		var depotContact = '';
		var depotTel = '';
		var depotFax = '';

		if (depotLookupID != '' && depotLookupID != null)
		{
			var depotRecord = nlapiLoadRecord('customrecord_depotlist',
					depotLookupID);
			depotEmail = depotRecord.getFieldValue('custrecord_dbfdepotemail');
			depotContact = depotRecord
					.getFieldValue('custrecord_dbfdepotcontact');
			depotTel = depotRecord
					.getFieldValue('custrecord_dbfdepottelnumber');
			depotAddress = depotRecord.getFieldValue('custrecord_dbfdepotadd1')
					+ '\n'
					+ depotRecord.getFieldValue('custrecord_dbfdepotadd2')
					+ '\n'
					+ depotRecord.getFieldValue('custrecord_dbfdepotadd3')
					+ '\n' + depotRecord.getFieldValue('custrecord_dbfcounty')
					+ '\n'
					+ depotRecord.getFieldValue('custrecord_dbfpostcode');
		}
		else
		{
			var depotSearchFilters = new Array();
			var depotSearchColumns = new Array();
			var consType = nlapiGetFieldText('custbody_palletparcel');
			if (consType != 'Parcel' && consType != 'Pallet')
				consType = 'Parcel';

			depotSearchFilters[0] = new nlobjSearchFilter('name', null, 'is',
					 nlapiGetFieldValue('custbody_receivingdepot')
							+ consType);

			// alert ('SEARCH : ' +
			// nlapiGetFieldValue('custbody_receivingdepot') + 'Parcel');
            nlapiLogExecution('DEBUG', 'custbody_receivingdepot:' + soRecordId, 'custbody_receivingdepot:' + nlapiGetFieldValue('custbody_receivingdepot') +  ' consType:' + consType);

			depotSearchColumns[0] = new nlobjSearchColumn('name');
			depotSearchColumns[1] = new nlobjSearchColumn(
					'custrecord_dbfdepotname');
			depotSearchColumns[2] = new nlobjSearchColumn(
					'custrecord_dbfdepotcontact');
			depotSearchColumns[3] = new nlobjSearchColumn(
					'custrecord_dbfdepotemail');
			depotSearchColumns[4] = new nlobjSearchColumn(
					'custrecord_dbfdepottelnumber');
			depotSearchColumns[5] = new nlobjSearchColumn(
					'custrecord_dbfdepotadd1');
			depotSearchColumns[6] = new nlobjSearchColumn(
					'custrecord_dbfdepotadd2');
			depotSearchColumns[7] = new nlobjSearchColumn(
					'custrecord_dbfdepotadd3');
			depotSearchColumns[8] = new nlobjSearchColumn(
					'custrecord_dbfcounty');
			depotSearchColumns[9] = new nlobjSearchColumn(
					'custrecord_dbfpostcode');
			depotSearchColumns[10] = new nlobjSearchColumn('internalid');

			// perform search

			var depotSearchResults = nlapiSearchRecord(
					'customrecord_depotlist', null, depotSearchFilters,
					depotSearchColumns);
			// if search returns results then show warning
			if (depotSearchResults)
			{
				depotName = depotSearchResults[0]
						.getValue(depotSearchColumns[1]);
				depotEmail = depotSearchResults[0]
						.getValue(depotSearchColumns[3]);
				depotContact = depotSearchResults[0]
						.getValue(depotSearchColumns[2]);
				depotTel = depotSearchResults[0]
						.getValue(depotSearchColumns[4]);
				depotAddress = depotSearchResults[0]
						.getValue(depotSearchColumns[5])
						+ '<br />'
						+ depotSearchResults[0].getValue(depotSearchColumns[6])
						+ '<br />'
						+ depotSearchResults[0].getValue(depotSearchColumns[7])
						+ '<br />'
						+ depotSearchResults[0].getValue(depotSearchColumns[8])
						+ '<br />'
						+ depotSearchResults[0].getValue(depotSearchColumns[9]);
				// soRecord.setFieldValue('custbody_depot_lookup',depotSearchResults[0].getValue(depotSearchColumns[10]));
			}
		}

		var title = "Sent to you from " + requestingCustomer
				+ " (automated email)";
		var html = "<body><table>";
		html += "<tr><td colspan='2' align='center'><b>DELIVERY NOTIFICATION</b></td></tr>";
		html += "<tr><td colspan='2'><br />Please see below details for a consignment that has just been entered into the system.<br />"
				+ "Item(s) will be collected today and should be delivered according to the service<br />chosen by the sender from tomorrow or next working day onwards.</td></tr>";
		html += "<tr><td><br />To :</td><td>" + customerName + "</td></tr>";
		html += "<tr><td>Consignment No. :</td><td>" + conNumber + "</td></tr>";
		if (conRefNo != null && conRefNo != '')
			html += "<tr><td>Your reference :</td><td>" + conRefNo
					+ "</td></tr>";
		html += "<tr><td>Consignment Date :</td><td>" + conDate + "</td></tr>";
		html += "<tr><td>Service :</td><td>" + conService + "</td></tr>";
		html += "<tr><td>Weight (Kg) :</td><td>" + conWeight + "</td></tr>";
		html += "<tr><td>No. of " + consType + "(s):</td><td>" + conParcels + "</td></tr>";
		if (conInstructions != null && conInstructions != '')
			html += "<tr><td>Instructions:</td><td>" + conInstructions
					+ "</td></tr>";
		if (consType == 'Parcel') {
			html += "<tr><td>Link to EPOD :</td><td><a href='"
				+ EPODlink
				+ "' target='_blank'>Click here to view tracking status (available from 9pm onwards)</a></td></tr>";
		}
		html += "<tr><td colspan='2'><br /><b>Delivery Depot Details</b></td></tr>";
		html += "<tr><td>Telephone:</td><td>" + depotTel + "</td></tr>";
		html += "<tr><td>Depot Name / Company:</td><td>" + depotName
				+ "</td></tr>";
		html += "<tr><td>Depot Address:</td><td>" + depotAddress + "</td></tr>";
		if ((consignorName != null && consignorName != '')
				|| (consignorTelno != null && consignorTelno != ''))
			html += "<tr><td colspan='2'><br /><b>Consignor Details at "
					+ requestingCustomer + "</b></td></tr>";
		if (consignorName != null && consignorName != '')
			html += "<tr><td>Contact name:</td><td>" + consignorName
					+ "</td></tr>";
		if (consignorTelno != null && consignorTelno != '')
			html += "<tr><td>Telephone:</td><td>" + consignorTelno
					+ "</td></tr>";
		html += "</table></body>";

		var TransportUserID = 779;
		var CustomerServicesUserID = 1677; 
		if (testMode == 'Y')
		{
			nlapiSendEmail(TransportUserID, 'leighjdaby@gmail.com',
					"TEST MODE: " + title, html, null, null, null, null);
			// nlapiLogExecution('DEBUG', "TEST MODE: " + title,
			// html.replace('<','[').replace('>',']'));
			nlapiLogExecution('DEBUG', "TEST MODE: " + title, html.replace(
					'body', 'div'));
		}
		else
		{
			nlapiSendEmail(TransportUserID, consigneeEmail,
					"CONSIGNMENT NOTIFICATION: " + title, html, null, null,
					null, null);
		}
	}
}

function webservice_depot(type){
	var deliveryType = getDeliveryType(nlapiGetFieldValue('class'), nlapiGetFieldValue('custbody_receivingdepot'));
    nlapiLogExecution('DEBUG', 'set depot:' + nlapiGetFieldValue('custbody_receivingdepot'), 'class:' + nlapiGetFieldValue('class') + ' depot:' + nlapiGetFieldValue('custbody_receivingdepot'));
    if (deliveryType == 'HT') {
        validateCountryPostcode('collect');
    }
    else {
        if (deliveryType == 'TH') {
            validateCountryPostcode('deliver');
        }
        else { // Must be TT
            validateCountryPostcode('deliver');
        }
    }
    return true;
}

function emailTPNPUR(soRecordId){

    var outputType = 'html';
    var testMode = 'N';	

    var CopiesPerLabel = 1; // Set to the number of copies per label
    var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
    var pdfxml = '<' + outputType + '>';
    pdfxml += '<body width=\"203mm\" height=\"102mm\" margin="4pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="14">';
    
    if (soRecordId) {
        // Set up the label elements that are same on all labels for the consignment
        var soRecord = nlapiLoadRecord('salesorder', soRecordId);
        
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
		
		var dateselect = soRecord.getFieldValue('trandate');
        var timedservice = false;
        var timedPrompt = ''; //Only appears if a timed  service
        var ddayPrompt = ''; //Only appears if a dedicated day service
        var timedHHMM = nlapiEscapeXML(soRecord.getFieldValue('custbody_pallettmservice_text'));
        var timedDate = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletddservice_date'));
        if (timedHHMM == null) 
            timedHHMM = '';
        if (timedDate == null) 
            timedDate = '';
        if (timedDate != '') 
            ddayPrompt = 'Deliver on : ' + timedDate + ' ';
        if (timedHHMM != '') 
            timedPrompt = 'At : ' + timedHHMM + ' ';
        
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
        
        var senddepot = getDepotNum(soRecord.getFieldValue('custbody_palletcollectingdepot') * 1);
        var reqpalletdepot = getDepotNum(soRecord.getFieldValue('custbody_palletrequestingdepot') * 1);
        var reqdepot = getDepotNum(soRecord.getFieldValue('custbody_requestingdepot') * 1);
        var deldepot = getDepotNum(soRecord.getFieldValue('custbody_receivingdepot') * 1);
        var depotHTML = "<table font-size='12' style='font-weight:bold'>";
        depotHTML += "<tr><td>Requesting Depot :</td><td>" + reqpalletdepot + "</td></tr><tr><td>Collecting Depot :</td><td>" + senddepot + "</td></tr><tr><td>Delivering Depot :</td><td>" + deldepot + "</td></tr>";
        depotHTML += "</table>";
        
        var palletclass = soRecord.getFieldValue('class') * 1;
        var labelclass = '';
        var labelTelCo = 'The Pallet Network Ltd.<br />Tel : 0870 600 3001';
        if (parseInt(palletclass) != 1) {
            labelTelCo = 'NEP Local Services<br />Tel : 01457 860 826';
            labelclass = soRecord.getFieldText('class').slice(0, 5); //Use the first chars of the class
            if (parseInt(palletclass) == 3) {
                labelclass == "SCOT";
                labelTelCo = 'NEP Scottish Services<br />Tel : 01457 860 826';
            }
        }
		var requestingCustomer = nlapiEscapeXML(soRecord.getFieldText('entity'));
        var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact'));
        var pucontactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupcontact'));
        if (pucontactname == null) 
            pucontactname = '';
        var puname = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupname'));
        if (puname == null) 
            puname = '';
        //var companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
        var companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
        var pickuppostcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddresspostcode')).toUpperCase();
        //var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
        var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletdeliveryzone'));
        var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
        
        var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
        var whencreated = nlapiEscapeXML(soRecord.getFieldValue('lastmodifieddate'));
        if (whencreated == null) 
            whencreated = '';
        
        var processedURLMaster = "<a href='https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=29&deploy=1&compid=1169462&h=7c1bcda25d347d759273&custparam_cid=" + soRecordId + "' target='_blank'>Click here to confirm when PUR # " + consignmentnumber + " is processed (details sent to TPN).</a>";
        
        var dateArray = trandate.split("/");
        var theLongDate = getLongNum(dateArray[0]) + getLongNum(dateArray[1]) + dateArray[2]; // Used in bar code
        trandate = getLongNum(dateArray[0]) + '/' + getLongNum(dateArray[1]) + '/' + dateArray[2]; // Used in bar code
        var addr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
        var addr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
        var addr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
        var addr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));
        var puaddr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr1'));
        var puaddr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr2'));
        var puaddr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr3'));
        var puaddr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr4'));
        var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode')).toUpperCase();
        var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
        var putelephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickuptelno'));
        var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
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
        
        if (puaddr1 == null) 
            puaddr1 = '';
        if (puaddr2 == null) 
            puaddr2 = '';
        if (puaddr3 == null) 
            puaddr3 = '';
        if (puaddr4 == null) 
            puaddr4 = '';
        
        var pickupAddrHTML = '       <table width="100%" cellpadding="0" padding="0" border="0" margin="0">';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + pucontactname + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puname + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr1.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr2.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr3.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr4.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="12"></td><td font-size="16"><b>' + pickuppostcode + '</b></td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10">Tel:</td><td font-size="12">' + putelephone + '</td></tr>';
        pickupAddrHTML += '       </table>';
        
        var deliveryAddrHTML = '       <table width="100%" cellpadding="0" padding="0" border="0" margin="0">';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + companyname + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr1.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr2.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr3.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr4.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="12"></td><td font-size="16"><b>' + postcode + '</b></td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10">Tel:</td><td font-size="12">' + telephone + '</td></tr>';
        deliveryAddrHTML += '       </table>';
        
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
        var palletListHTML = '<table border="1" width="100%">'; // Use to assemble the pallet list details
        if (palletSearchResults) {
            var title = "TPN Pallet Service - " + palletSearchResults.length + " Pickup Request(s) (PURS) need to be processed for " + dateselect;
            palletListHTML += '<tr><td colspan="2"><b>TOTAL PALLETS</b></td><td align="right"><b>' + totalpallets + '</b></td><td align="right"><b>TOTAL WEIGHT ' + totalweight + ' KG</b></td></tr>';
            palletListHTML += '<tr><td>Size</td><td>Notes</td><td align="right">Qty</td><td align="right">Pallet(s) Weight</td></tr>';
            //Cycle through every pallet list record ...
            for (var listNo = 0; listNo < palletSearchResults.length; listNo++) {
                var custPalletSize = nlapiLoadRecord('customrecord_palletsize', palletSearchResults[listNo].getValue(palletSearchColumns[0]));
                var palletSize = custPalletSize.getFieldValue('custrecord_labelabbreviation');
                var palletSizeQty = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                var parcelnotes = nlapiEscapeXML(palletSearchResults[listNo].getValue(palletSearchColumns[3]));
                var parceltotal = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                var totalpalletlistweight = palletSearchResults[listNo].getValue(palletSearchColumns[2]);
                var weight = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[2]) / palletSizeQty);
                
                palletListHTML += '<tr><td>' + palletSize + '</td><td>' + parcelnotes + '</td><td align="right">' + palletSizeQty + '</td><td align="right">' + totalpalletlistweight + ' (kg)</td></tr>';
                
            } // For pallet list records
            palletListHTML += '</table>'; // End of pallet list details
            pdfxml += '<table cellpadding="0" padding="0pt" border="0pt" margin="0pt">';
            pdfxml += '	   <tr><td colspan="2">' + processedURLMaster + '</td></tr>';
            pdfxml += '    <tr><td><img src="https://system.netsuite.com/core/media/media.nl?id=40&c=1169462&h=6cbb1761d793f08a9031" /></td><td font-size="14" align="left"><b>COLLECTION REQUEST FORM</b><br />Customer: ' + requestingCustomer + '<br />Cons. No.: ' + consignmentnumber + '<br />Created: ' + trandate + '<br />' + depotHTML + '<br />Cust. Ref: ' + refno + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td><b>COLLECTION ADDRESS:</b></td><td><b>DELIVERY ADDRESS:</b></td></tr>';
            pdfxml += '	   <tr><td>' + pickupAddrHTML + '</td><td>' + deliveryAddrHTML + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td><b>SERVICE</b></td><td><b>' + serviceDesc + '</b></td></tr>';
            pdfxml += '	   <tr><td>Dedicated Day Service details</td><td>' + ddayPrompt + '</td></tr>';
            pdfxml += '	   <tr><td>Timed Service details</td><td>' + timedPrompt + '</td></tr>';
            pdfxml += '	   <tr><td>Special Instructions</td><td>' + specins + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td colspan="2">' + palletListHTML + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td colspan="2">' + processedURLMaster + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '</table>';
            
        } // Pallet List search results
    } // If recordid
    pdfxml += '</body></' + outputType + '>';
    
    if (outputType == 'html') {
        var TransportUserID = 779;
        if (testMode == 'Y') {
            nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "TEST MODE: " + title, pdfxml, null, null, null, null);
            //nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "TEST MODE: " + title, pdfxml, 'derekhughes@deltacomputingltd.co.uk', null, null, null);
        }
        else {
            //nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "LIVE MODE: " + title, pdfxml, null, null, null, null);
            nlapiSendEmail(TransportUserID, 'Kevin.hall@nepparcels.co.uk', title, pdfxml, 'derekhughes@deltacomputingltd.co.uk', null, null, null);
        }
        //Go back to Consignment Manager ...
        //nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
    }
    else {
        var file = nlapiXMLToPDF(pdfxml);
        response.setContentType('PDF', 'label.pdf');
        response.write(file.getValue());
    }
}

function emailTPNSaturdayService(soRecordId){

    var outputType = 'html';
    var testMode = 'N';	

    var CopiesPerLabel = 1; // Set to the number of copies per label
    var pdfxml = '<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">'
    var pdfxml = '<' + outputType + '>';
    pdfxml += '<body width=\"203mm\" height=\"102mm\" margin="4pt" padding="0pt" border="0pt" font-family="Helvetica" font-size="14">';
    
    if (soRecordId) {
        // Set up the label elements that are same on all labels for the consignment
        var soRecord = nlapiLoadRecord('salesorder', soRecordId);
        
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
		
		var dateselect = soRecord.getFieldValue('trandate');
        var timedservice = false;
        var timedPrompt = ''; //Only appears if a timed  service
        var ddayPrompt = ''; //Only appears if a dedicated day service
        var timedHHMM = nlapiEscapeXML(soRecord.getFieldValue('custbody_pallettmservice_text'));
        var timedDate = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletddservice_date'));
        if (timedHHMM == null) 
            timedHHMM = '';
        if (timedDate == null) 
            timedDate = '';
        if (timedDate != '') 
            ddayPrompt = 'Deliver on : ' + timedDate + ' ';
        if (timedHHMM != '') 
            timedPrompt = 'At : ' + timedHHMM + ' ';
        
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
        
        var senddepot = getDepotNum(soRecord.getFieldValue('custbody_palletcollectingdepot') * 1);
        var reqpalletdepot = getDepotNum(soRecord.getFieldValue('custbody_palletrequestingdepot') * 1);
        var reqdepot = getDepotNum(soRecord.getFieldValue('custbody_requestingdepot') * 1);
        var deldepot = getDepotNum(soRecord.getFieldValue('custbody_receivingdepot') * 1);
        var depotHTML = "<table font-size='12' style='font-weight:bold'>";
        depotHTML += "<tr><td>Requesting Depot :</td><td>" + reqpalletdepot + "</td></tr><tr><td>Collecting Depot :</td><td>" + senddepot + "</td></tr><tr><td>Delivering Depot :</td><td>" + deldepot + "</td></tr>";
        depotHTML += "</table>";
        
        var palletclass = soRecord.getFieldValue('class') * 1;
        var labelclass = '';
        var labelTelCo = 'The Pallet Network Ltd.<br />Tel : 0870 600 3001';
        if (parseInt(palletclass) != 1) {
            labelTelCo = 'NEP Local Services<br />Tel : 01457 860 826';
            labelclass = soRecord.getFieldText('class').slice(0, 5); //Use the first chars of the class
            if (parseInt(palletclass) == 3) {
                labelclass == "SCOT";
                labelTelCo = 'NEP Scottish Services<br />Tel : 01457 860 826';
            }
        }
		var requestingCustomer = nlapiEscapeXML(soRecord.getFieldText('entity'));
        var contactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverycontact'));
        var pucontactname = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupcontact'));
        if (pucontactname == null) 
            pucontactname = '';
        var puname = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupname'));
        if (puname == null) 
            puname = '';
        //var companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfullcustomername'));
        var companyname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
        var pickuppostcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddresspostcode')).toUpperCase();
        //var fswflag = nlapiEscapeXML(soRecord.getFieldValue('custbody_labelfswflag'));
        var parceldelzone = nlapiEscapeXML(soRecord.getFieldValue('custbody_palletdeliveryzone'));
        var shipto = nlapiEscapeXML(soRecord.getFieldValue('shipaddress'));
        
        var trandate = nlapiEscapeXML(soRecord.getFieldValue('trandate'));
        var whencreated = nlapiEscapeXML(soRecord.getFieldValue('lastmodifieddate'));
        if (whencreated == null) 
            whencreated = '';
        
        var processedURLMaster = "<a href='https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=29&deploy=1&compid=1169462&h=7c1bcda25d347d759273&custparam_cid=" + soRecordId + "' target='_blank'>Click here to confirm when PUR # " + consignmentnumber + " is processed (details sent to TPN).</a>";
        
        var dateArray = trandate.split("/");
        var theLongDate = getLongNum(dateArray[0]) + getLongNum(dateArray[1]) + dateArray[2]; // Used in bar code
        trandate = getLongNum(dateArray[0]) + '/' + getLongNum(dateArray[1]) + '/' + dateArray[2]; // Used in bar code
        var addr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr1'));
        var addr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr2'));
        var addr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr3'));
        var addr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliveryaddr4'));
        var puaddr1 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr1'));
        var puaddr2 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr2'));
        var puaddr3 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr3'));
        var puaddr4 = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickupaddr4'));
        var postcode = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverypostcode')).toUpperCase();
        var telephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_deliverytelno'));
        var putelephone = nlapiEscapeXML(soRecord.getFieldValue('custbody_pickuptelno'));
        var delname = nlapiEscapeXML(soRecord.getFieldValue('custbody_delname'));
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
        
        if (puaddr1 == null) 
            puaddr1 = '';
        if (puaddr2 == null) 
            puaddr2 = '';
        if (puaddr3 == null) 
            puaddr3 = '';
        if (puaddr4 == null) 
            puaddr4 = '';
        
        var pickupAddrHTML = '       <table width="100%" cellpadding="0" padding="0" border="0" margin="0">';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + pucontactname + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puname + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr1.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr2.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr3.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + puaddr4.slice(0, 30) + '</td></tr>';
        pickupAddrHTML += '         <tr><td font-size="12"></td><td font-size="16"><b>' + pickuppostcode + '</b></td></tr>';
        pickupAddrHTML += '         <tr><td font-size="10">Tel:</td><td font-size="12">' + putelephone + '</td></tr>';
        pickupAddrHTML += '       </table>';
        
        var deliveryAddrHTML = '       <table width="100%" cellpadding="0" padding="0" border="0" margin="0">';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + companyname + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr1.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr2.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr3.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10"></td><td font-size="12">' + addr4.slice(0, 30) + '</td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="12"></td><td font-size="16"><b>' + postcode + '</b></td></tr>';
        deliveryAddrHTML += '         <tr><td font-size="10">Tel:</td><td font-size="12">' + telephone + '</td></tr>';
        deliveryAddrHTML += '       </table>';
        
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
        var palletListHTML = '<table border="1" width="100%">'; // Use to assemble the pallet list details
        if (palletSearchResults) {
            var title = "TPN - " + palletSearchResults.length + " pallets - Saturday delivery service requested " + dateselect;
            palletListHTML += '<tr><td colspan="2"><b>TOTAL PALLETS</b></td><td align="right"><b>' + totalpallets + '</b></td><td align="right"><b>TOTAL WEIGHT ' + totalweight + ' KG</b></td></tr>';
            palletListHTML += '<tr><td>Size</td><td>Notes</td><td align="right">Qty</td><td align="right">Pallet(s) Weight</td></tr>';
            //Cycle through every pallet list record ...
            for (var listNo = 0; listNo < palletSearchResults.length; listNo++) {
                var custPalletSize = nlapiLoadRecord('customrecord_palletsize', palletSearchResults[listNo].getValue(palletSearchColumns[0]));
                var palletSize = custPalletSize.getFieldValue('custrecord_labelabbreviation');
                var palletSizeQty = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                var parcelnotes = nlapiEscapeXML(palletSearchResults[listNo].getValue(palletSearchColumns[3]));
                var parceltotal = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[1]));
                var totalpalletlistweight = palletSearchResults[listNo].getValue(palletSearchColumns[2]);
                var weight = parseInt(palletSearchResults[listNo].getValue(palletSearchColumns[2]) / palletSizeQty);
                
                palletListHTML += '<tr><td>' + palletSize + '</td><td>' + parcelnotes + '</td><td align="right">' + palletSizeQty + '</td><td align="right">' + totalpalletlistweight + ' (kg)</td></tr>';
                
            } // For pallet list records
            palletListHTML += '</table>'; // End of pallet list details
            pdfxml += '<table cellpadding="0" padding="0pt" border="0pt" margin="0pt">';
            //pdfxml += '	   <tr><td colspan="2">' + processedURLMaster + '</td></tr>';
            pdfxml += '    <tr><td><img src="https://system.netsuite.com/core/media/media.nl?id=40&c=1169462&h=6cbb1761d793f08a9031" /></td><td font-size="14" align="left"><b>SATURDAY SERVICE REQUEST</b><br />Customer: ' + requestingCustomer + '<br />Cons. No.: ' + consignmentnumber + '<br />Created: ' + trandate + '<br />' + depotHTML + '<br />Cust. Ref: ' + refno + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td><b>COLLECTION ADDRESS:</b></td><td><b>DELIVERY ADDRESS:</b></td></tr>';
            pdfxml += '	   <tr><td>' + pickupAddrHTML + '</td><td>' + deliveryAddrHTML + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td><b>SERVICE</b></td><td><b>' + serviceDesc + '</b></td></tr>';
            pdfxml += '	   <tr><td>Dedicated Day Service details</td><td>' + ddayPrompt + '</td></tr>';
            pdfxml += '	   <tr><td>Timed Service details</td><td>' + timedPrompt + '</td></tr>';
            pdfxml += '	   <tr><td>Special Instructions</td><td>' + specins + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '	   <tr><td colspan="2">' + palletListHTML + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            //pdfxml += '	   <tr><td colspan="2">' + processedURLMaster + '</td></tr>';
            pdfxml += '	   <tr><td colspan="2"><hr /></td></tr>';
            pdfxml += '</table>';
            
        } // Pallet List search results
    } // If recordid
    pdfxml += '</body></' + outputType + '>';
    
    if (outputType == 'html') {
        var TransportUserID = 779;
        if (testMode == 'Y') {
            nlapiSendEmail(TransportUserID, 'leigh.darby@firsthosted.co.uk', "TEST MODE: " + title, pdfxml, null, null, null, null);
            //nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "TEST MODE: " + title, pdfxml, 'derekhughes@deltacomputingltd.co.uk', null, null, null);
        }
        else {
            //nlapiSendEmail(TransportUserID, 'leigh@firsthosted.co.uk', "LIVE MODE: " + title, pdfxml, null, null, null, null);
            nlapiSendEmail(TransportUserID, 'Kevin.hall@nepparcels.co.uk', title, pdfxml, 'derekhughes@deltacomputingltd.co.uk', null, null, null);
        }
        //Go back to Consignment Manager ...
        //nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
    }
    else {
        var file = nlapiXMLToPDF(pdfxml);
        response.setContentType('PDF', 'label.pdf');
        response.write(file.getValue());
    }
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

function isCustomerCenter(){
    var isCenter = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1005 || theRole == 1015 || theRole == 1006 || theRole == 1007 || theRole == 1008) 
        isCenter = true;
     return isCenter;
}

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 7 || parseInt(nlapiGetContext().getUser()) == 873) 
    //if (parseInt(nlapiGetContext().getUser()) == 392 || parseInt(nlapiGetContext().getUser()) == 873) 
        testMode = true; // 8 = TESTCOMPANY	
    return testMode;
}

function getDeliveryType(theClass,deliveryDepot){
    if (parseInt(theClass) == 6 || parseInt(theClass) == 10){
		if (parseInt(deliveryDepot) == parseInt(getParcelDepotNo()) || deliveryDepot == getParcelDepotNo()) {
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
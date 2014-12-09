/* Parcel Rates Automation
 * Version 3.0.0
 * 23/05/11
 *
 * Functions listed in order :-
 *
 *  onLoad(type)
 *  convertQuotation()
 *  postSourcing(type, name)
 *  fieldChanged(type, name)
 *  changeAddress(type)
 *  getRates()
 *  getParcelPrice(currentCustomer, currentItem, parcelArea, consignmentWeight)
 *  getCost(currentItem,parcelArea)
 *  isValidParcelPostcode(postcode)
 *  returnParcelPostcodePrefix(postcode)
 *  onSave()
 *  ncSizeCheck(parcelLength, parcelWidth, parcelHeight)
 *  launchEpod()
 *  labelPrinter()
 *  cancelconsignment()
 *
 */
var versionNo = '3.0.0';
var showVer = false;

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) testMode = true; // 8 = TESTCOMPANY
    if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 7 || parseInt(nlapiGetContext().getUser()) == 873) 
        testMode = true; // 8 = TESTCOMPANY	
    return testMode;
}

function isCustomerService(){
    var isService = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 3 || theRole == 1003 || theRole == 1009 || theRole == 1010) 
        isService = true;
    return isService;
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

function onLoad(type){

    var customForm = nlapiGetFieldValue('customform');
    var formId = nlapiGetFieldValue('custbody_formid');
	nlapiSetFieldValue('custbody_formchangeauto', 'T'); //Added June 2012 to allow imports form changing to work

    //if (isTestUser()) alert ('customForm = ' + customForm + '\nformId = ' + formId);
	
    if (customForm != '' && formId == '') 
        formId = customForm;
    
    var allowPUR = true;
    
    var now = new Date();
    var isFriday = false;
    var isWeekend = false;
    if (now.getDay() == 5) 
        isFriday = true;
    if (now.getDay() == 6 || now.getDay() == 0) 
        isWeekend = true;
    var nextdaymessage = '';
    if (isFriday) 
        nextdaymessage = '.\nAs it is a Friday date will be set for Monday';
    if (isWeekend) 
        nextdaymessage = '.\nAs it is the Weekend date will be set for Monday';
    
    var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
    if (nowHours >= 24) 
        nowHours -= 24;
    if ((now.getMonth() > 2 && now.getMonth() < 9) || (now.getMonth() == 2 && now.getDate() > 27) || (now.getMonth() == 9 && now.getDate() < 28)) {
		nowHours += 1; //Daylight savings approximation!
	}
    if (nowHours >= 12 || (nowHours == 11 && now.getMinutes() >= 30)) {
        allowPUR = false;
    }
    //alert(nowHours + " : " + now.getMinutes());
    
    //if (isTestUser()) alert(nlapiGetContext().getSessionObject('searchParams'));
    
    //alert(versionNo);
    if (type == 'edit' || type == 'view') {
        // Form change if customer services are viewing ...
        if (isCustomerService()) {
            // alert ('service=' + getFormMatrixLookupValue(formId,
			// 'custrecord_formparentform', true) + '\nformid=' + formId);
            var parentForm = getFormMatrixLookupValue(formId, 'custrecord_formparentform', true);
            if (parentForm != null && parentForm != '' && nlapiGetFieldValue('customform') != parentForm) {
					nlapiSetFieldValue('customform', parentForm, false, false);
			}
            
            // load depot details if present
            var depotLookupID = nlapiGetFieldValue('custbody_depot_lookup');

            var depotAddress = '';
            var depotEmail = '';
            var depotContact = '';
            var depotTel = '';
            var depotFax = '';

            if (depotLookupID != '') {
                var depotRecord = nlapiLoadRecord('customrecord_depotlist', depotLookupID);
                depotEmail = depotRecord.getFieldValue('custrecord_dbfdepotemail');
                depotContact = depotRecord.getFieldValue('custrecord_dbfdepotcontact');
                depotTel = depotRecord.getFieldValue('custrecord_dbfdepottelnumber');
                depotAddress = depotRecord.getFieldValue('custrecord_dbfdepotadd1') + '\n' + 
            	depotRecord.getFieldValue('custrecord_dbfdepotadd2') + '\n' +
            	depotRecord.getFieldValue('custrecord_dbfdepotadd3') + '\n' +
            	depotRecord.getFieldValue('custrecord_dbfcounty') + '\n' +
            	depotRecord.getFieldValue('custrecord_dbfpostcode') ;
            } else {
                var depotSearchFilters = new Array();
                var depotSearchColumns = new Array();
                
                depotSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', nlapiGetFieldValue('custbody_receivingdepot') + 'Parcel');
                
                //alert ('SEARCH : ' + nlapiGetFieldValue('custbody_receivingdepot') + 'Parcel');
                
                depotSearchColumns[0] = new nlobjSearchColumn('name');
                depotSearchColumns[1] = new nlobjSearchColumn('custrecord_dbfdepotname');
                depotSearchColumns[2] = new nlobjSearchColumn('custrecord_dbfdepotcontact');
                depotSearchColumns[3] = new nlobjSearchColumn('custrecord_dbfdepotemail');
                depotSearchColumns[4] = new nlobjSearchColumn('custrecord_dbfdepottelnumber');
                depotSearchColumns[5] = new nlobjSearchColumn('custrecord_dbfdepotadd1');
                depotSearchColumns[6] = new nlobjSearchColumn('custrecord_dbfdepotadd2');
                depotSearchColumns[7] = new nlobjSearchColumn('custrecord_dbfdepotadd3');
                depotSearchColumns[8] = new nlobjSearchColumn('custrecord_dbfcounty');
                depotSearchColumns[9] = new nlobjSearchColumn('custrecord_dbfpostcode');
                depotSearchColumns[10] = new nlobjSearchColumn('internalid');
                
                // perform search
                //customrecord_deliveryaddress
                var depotSearchResults = nlapiSearchRecord('customrecord_depotlist', null, depotSearchFilters, depotSearchColumns);
                // if search returns results then show warning
                if (depotSearchResults) {
                    depotEmail = depotSearchResults[0].getValue(depotSearchColumns[3]);
                    depotContact = depotSearchResults[0].getValue(depotSearchColumns[2]);
                    depotTel = depotSearchResults[0].getValue(depotSearchColumns[4]);
                    depotAddress = depotSearchResults[0].getValue(depotSearchColumns[5]) + '\n' + 
                 		depotSearchResults[0].getValue(depotSearchColumns[6]) + '\n' + 
                		depotSearchResults[0].getValue(depotSearchColumns[7]) + '\n' + 
                		depotSearchResults[0].getValue(depotSearchColumns[8]) + '\n' + 
                		depotSearchResults[0].getValue(depotSearchColumns[9]);
                    nlapiSetFieldValue('custbody_depot_lookup',depotSearchResults[0].getValue(depotSearchColumns[10]));
                }
            }
            
            nlapiSetFieldValue('custbody_depot_contact', depotContact);
            nlapiSetFieldValue('custbody_depot_telephone', depotTel);
            nlapiSetFieldValue('custbody_depot_email', depotEmail);
            nlapiSetFieldValue('custbody_depot_address', depotAddress);
            // if (!nlapiGetFieldValue('custbody_depot_lookup') &&
			// nlapiGetFieldValue('custbody_receivingdepot')){
            // nlapiSetFieldValue('custbody_depot_lookup',
			// parseInt(nlapiGetFieldValue('custbody_receivingdepot')) +
			// 'Parcel')
            //}

        }
    }
    
    if (type == 'create') {
        var defaultDriverrun = nlapiGetFieldValue('custbody_driverrun');
        
        var currentCustomer = nlapiGetFieldValue('entity');
        //var currentCustomerName = nlapiGetFieldValue('entityid');
        var currentCustomerName = nlapiGetFieldText('entity');
        //if (isTestUser()) alert(nlapiGetFieldValue('custbody_labeldimension'));
        
        var shipType = getFormShipType(formId);
        if (shipType == '') 
            shipType = getFormShipType(customForm);
        var orderType = getFormOrderType(formId)
        if (orderType == '') 
            orderType = getFormOrderType(customForm);
        var deliveryType = getFormDeliveryType(formId)
        if (deliveryType == '') 
            deliveryType = getFormDeliveryType(customForm);
        //if (isTestUser()) alert(shipType + "\n" + orderType + "\n" + deliveryType);
        
        var dl = getLocalDate();
        var dm = getDateMessageLookupValue('', dl); // If no messages will be local date back unchanged

        if (((deliveryType == 'TT' || deliveryType == 'TH') && !allowPUR) || isWeekend) {
            nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(dm), 'date'), false, false);
        }
		
        if ((deliveryType == 'TT' || deliveryType == 'TH') && !allowPUR) {
            alert('As the time is after 11.30 please set the date for your Pick Up Request \(PUR\) to the next working day' + nextdaymessage + '.\n\nThank you.');
			nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(dm), 'date'), false, false);
        }
        else {
            if (isWeekend) {
				alert('Note:' + nextdaymessage + '.\n\nThank you.');
				nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(dm), 'date'), false, false);
			} else {
				if (nowHours >= 19 || (nowHours == 18 && now.getMinutes() >= 30)) {
					alert("As the time is after 18:30 the date of your consignment will be set to the next working day.\n\nThank you.");
					nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(dm), 'date'), false, false);
				}
			}
        }
		
        if (dl.getTime() != dm.getTime())
        	dl = getNextWorkingDate(dm);
        nlapiSetFieldValue('trandate', nlapiDateToString(dl, 'date'), false, false);
        	
        if (orderType == 'quotation') {
            nlapiSetFieldValue('custbody_ordertype', '2', false, false);
        } //if
        //if (shipType == 'parcel') { // Same for quotations too
		var defaultService = 19; //ND16
        var custDefaultService =  nlapiGetFieldValue('custbody_default_parcel_service');
        if (custDefaultService != null && custDefaultService != '')
        	defaultService = custDefaultService;

        nlapiSetFieldValue('custbody_palletparcel', '1', false, false);
        nlapiSelectNewLineItem('item');
        nlapiSetCurrentLineItemValue('item', 'item', defaultService); // Item internal id
        //}
        
        var addressFound = false;
        /*
         if (isTestUser()) {
         
         var user = nlapiGetContext().getUser();
         var custRecord = nlapiLoadRecord('customer', user);
         var addressCount = custRecord.getLineItemCount('addressbook');
         var i = 1;
         
         while (i <= addressCount && addressFound == false) {
         var defShipping = custRecord.getLineItemValue('addressbook', 'defaultshipping', i);
         
         if (defShipping == 'T') {
         var addr = custRecord.getLineItemValue('addressbook', 'addrtext', i);
         var addrpostcode = custRecord.getLineItemValue('addressbook', 'zip', i);
         //if (isTestUser()) alert ('Address = ' + addr);
         
         // Fields for label population only
         var addr1 = custRecord.getLineItemValue('addressbook', 'addr1', i);
         var addr2 = custRecord.getLineItemValue('addressbook', 'addr2', i);
         var addr3 = custRecord.getLineItemValue('addressbook', 'addr3', i);
         var addr4 = custRecord.getLineItemValue('addressbook', 'addr4', i);
         var city = custRecord.getLineItemValue('addressbook', 'city', i);
         var county = custRecord.getLineItemValue('addressbook', 'state', i);
         var addrtelno = custRecord.getLineItemValue('addressbook', 'phone', i);
         var country = 1; //UK - NEP customers only
         addressFound = true;
         
         } //if
         i++;
         
         } //while
         }
         */
        //if (isTestUser()) alert ('CurrentForm = ' + customForm + ' FormID = ' + formId);
        
        if (deliveryType == 'HT' || deliveryType == 'TH') {
        
            if (!addressFound) {
                var addr = nlapiGetFieldValue('shipaddress');
                
                var addrLines = new Array();
                addrLines = addr.split("\n");
                
                var addrpostcode = nlapiGetFieldValue('shipzip');
                
                // Fields for label population only
                var addr1 = addrLines[0];
                var addr2 = addrLines[1];
                var addr3 = '';
                var addr4 = '';
                
                if (isTestUser()) {
                    addr1 = nlapiGetFieldValue('shipaddress1');
                    addr2 = nlapiGetFieldValue('shipaddress2');
                    addr3 = nlapiGetFieldValue('shipaddress3');
                }
                
                if (addrLines.length > 2 && addr3 == '') 
                    addr3 = addrLines[2];
                if (addrLines.length > 3 && addr4 == '') 
                    addr4 = addrLines[3];
                
                var city = nlapiGetFieldValue('shipcity');
                var county = nlapiGetFieldValue('shipstate');
                var addrtelno = nlapiGetFieldValue('shipphone');
            }
            
            if (deliveryType == 'HT') {
                nlapiSetFieldValue('custbody_pickupaddress', addr, false, false);
                nlapiSetFieldValue('custbody_pickupaddresspostcode', addrpostcode, false, false);
                //	    nlapiSetFieldValue('custbody_pickupcontact', addrcontact, false, false); //v2.8.7
                nlapiSetFieldValue('custbody_pickuptelno', addrtelno, false, false);
                
                // populate label fields
                nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
                nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
                if (addr3 != '') {
                    nlapiSetFieldValue('custbody_pickupaddr3', addr3, false, false);
                }
                else {
                    nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
                }
                if (addr4 != '') {
                    nlapiSetFieldValue('custbody_pickupaddr4', addr4, false, false);
                }
                else {
                    nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
                }
                
                //	    var companyname = custRecord.getFieldValue('companyname'); //v2.8.7
                //	    nlapiSetFieldValue('custbody_pickupname', companyname, false, false); //v2.8.7
            
            } //if
            if (deliveryType == 'TH') {
            
                nlapiSetFieldValue('custbody_deliveryaddress', addr, false, false);
                nlapiSetFieldValue('custbody_deliverypostcode', addrpostcode, true, false);
                //nlapiSetFieldValue('custbody_deliverycontact', addrcontact, false, false);
                
                nlapiSetFieldValue('custbody_deliverytelno', addrtelno, false, false);
                
                //nlapiSetFieldValue('custbody_delname', currentCustomerName, false, false);
                nlapiSetFieldValue('custbody_delname', nlapiGetFieldValue('shipaddressee'), false, false);
                
                //if (isTestUser()) alert ('onLoad Address1 = ' + addr1);
                // populate label fields
                nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
                nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);
                if (addr3 != '') {
                    nlapiSetFieldValue('custbody_deliveryaddr3', addr3, false, false);
                }
                else {
                    nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
                }
                if (addr4 != '') {
                    nlapiSetFieldValue('custbody_deliveryaddr4', addr4, false, false);
                }
                else {
                    nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
                }
                
            } //if
        } //if
        //nlapiSetFieldValue('otherrefnum','',true,false);
    } //if 
    
    //nlapiSetFieldValue('otherrefnum', '', true, false);  

    return true;
}

// Quotation conversion function - call from custom button
function convertQuotation(){
    var currentOrderType = nlapiGetFieldValue('custbody_ordertype');
    
    if (currentOrderType == '1') {
        alert('This quotation has already been converted to a Consignment.\n');
        return false;
    } //if
    else {
        var convert = confirm('Convert this quotation to a consignment?\n');
        
        if (convert == true) {
            nlapiSetFieldValue('custbody_ordertype', '1', false, false);
            NLMultiButton_doAction('multibutton_submitter', 'submitter')
            return true;
        } //if
        else {
            return false;
        } //else
    } //else
} //function convertQuotation
// Post Sourcing Function
function postSourcing(type, name){

    if (name == 'entity') {
        var customForm = nlapiGetFieldValue('customform');
        var formId = nlapiGetFieldValue('custbody_formid');
        var deliveryType = getFormDeliveryType(formId)
        if (deliveryType == '') 
            deliveryType = getFormDeliveryType(customForm);
            
        var currentCustomer = nlapiGetFieldValue('entity');
        var custRecord = nlapiLoadRecord('customer', currentCustomer);
        
        if (deliveryType == 'HT' || deliveryType == 'TH') {
            
            var addressCount = custRecord.getLineItemCount('addressbook');
            var i = 1;
            var addressFound = false;
            
            while (i <= addressCount && addressFound == false) {
                var defShipping = custRecord.getLineItemValue('addressbook', 'defaultshipping', i);
                
                if (defShipping == 'T') {
                    var addr = custRecord.getLineItemValue('addressbook', 'addrtext', i);
                    var addrpostcode = custRecord.getLineItemValue('addressbook', 'zip', i);
                    //if (isTestUser()) alert ('Address = ' + addr);
                    
                    // Fields for label population only
                    var addr1 = custRecord.getLineItemValue('addressbook', 'addr1', i);
                    var addr2 = custRecord.getLineItemValue('addressbook', 'addr2', i);
                    var addr3 = custRecord.getLineItemValue('addressbook', 'addr3', i);
                    var addr4 = custRecord.getLineItemValue('addressbook', 'addr4', i);
                    var city = custRecord.getLineItemValue('addressbook', 'city', i);
                    var county = custRecord.getLineItemValue('addressbook', 'state', i);
                    var country = 1; //UK - NEP customers only
                    addressFound = true;
                    
                } //if
                i++;
                
            } //while
            if (addressFound == true) {
                var addrtelno = custRecord.getFieldValue('phone');
                var addrcontact = custRecord.getFieldValue('custentity_contact');
                var companyname = custRecord.getFieldValue('companyname');
                
                //if (customForm == '103' || customForm == '104' || formId == '103' || formId == '104') {
                
                if (deliveryType == 'HT') {
                
                    nlapiSetFieldValue('custbody_pickupaddress', addr, false, false);
                    nlapiSetFieldValue('custbody_pickupaddresspostcode', addrpostcode, true, false);
                    nlapiSetFieldValue('custbody_pickupcontact', addrcontact, false, false);
                    nlapiSetFieldValue('custbody_pickuptelno', addrtelno, false, false);
                    
                    // populate label fields
                    nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
                    nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
                    if (addr3 != '' && addr3 != null) {
                        nlapiSetFieldValue('custbody_pickupaddr3', addr3, false, false);
                    }
                    else {
                        nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
                    }
                    if (addr4 != '' && addr4 != null) {
                        nlapiSetFieldValue('custbody_pickupaddr4', addr4, false, false);
                    }
                    else {
                        nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
                    }
                    nlapiSetFieldValue('custbody_pickupcountryselect', country, false, false);
                    
                    nlapiSetFieldValue('custbody_pickupname', companyname, false, false);
                    
                    
                } //if
                if (deliveryType == 'TH') {
                
                    nlapiSetFieldValue('custbody_deliveryaddress', addr, false, false);
                    nlapiSetFieldValue('custbody_deliverypostcode', addrpostcode, true, false);
                    nlapiSetFieldValue('custbody_deliverycontact', addrcontact, false, false);
                    nlapiSetFieldValue('custbody_deliverytelno', addrtelno, false, false);
                    
                    // populate label fields
                    nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
                    nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);
                    if (addr3 != '' && addr3 != null) {
                        nlapiSetFieldValue('custbody_deliveryaddr3', addr3, false, false);
                    }
                    else {
                        nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
                    }
                    if (addr4 != '' && addr4 != null) {
                        nlapiSetFieldValue('custbody_deliveryaddr4', addr4, false, false);
                    }
                    else {
                        nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
                    }
                    nlapiSetFieldValue('custbody_deliverycountryselect', country, false, false);
                    
                    nlapiSetFieldValue('custbody_delname', companyname, false, false);
                    
                } //if
            } //if
        } //if		

        var defaultService = 19; //ND16
        var custDefaultService =  custRecord.getFieldValue('custentity_default_parcel_service');
        if (custDefaultService != null && custDefaultService != '')
        	defaultService = custDefaultService;

        //nlapiSelectNewLineItem('item');
        nlapiSetCurrentLineItemValue('item', 'item', defaultService); // Item internal id

    } //else if	
    //if (isTestUser()) alert ('postSourcing end: Ship Address :\n1' + nlapiGetFieldValue('custbody_deliveryaddr1') + '\n2 = ' + nlapiGetFieldValue('custbody_deliveryaddr2') + '\n3 = ' + nlapiGetFieldValue('custbody_deliveryaddr3') + '\n4 = ' + nlapiGetFieldValue('custbody_deliveryaddr4'));
    
    return true;
    
} //function postSourcing
// Field change action
function fieldChanged(type, name){
	
	var isValid = true;
	var reCalcRates = false;
	//var user = nlapiGetContext().getUser();
	var canLookupPostCodes = nlapiGetFieldValue('custbody_post_code_search');
	//canLookupPostCodes = nlapiLookupField('customer', user, 'custentity_post_code_search');
	
    if (name == 'custbody_pickupaddressselect') {
        changeAddress('pickup');
        reCalcRates = true;
    } //else if
    else 
        if (name == 'custbody_deliveryaddressselect') {
            changeAddress('delivery');
            reCalcRates = true;
        } //else if
        else 
            if (name == 'otherrefnum') {
                document.getElementById('otherrefnum').focus();
            } //else if
            else 
            if (name == 'custbody_deliverypostcode') {
                isValid = validateCountryPostcode('delivery');
            } //else if
            else 
                if (name == 'custbody_pickupaddresspostcode') {
                    isValid = validateCountryPostcode('pickup');
                } //else if    'custcol_truevolumeweight'    
                else 
                    if (name == 'custbody_delpostcodesearch' && canLookupPostCodes == 'T') {  
                    	var searchpc = nlapiGetFieldValue('custbody_delpostcodesearch');
                    	if (searchpc !='' && searchpc != null){
                    		isValid = XMLSoapLookup(searchpc);
                    		reCalcRates = false;
                    	}
                    		            	
                } //else if    'custcol_truevolumeweight'
    
                //Recalculate rates if required ...
                if (reCalcRates && nlapiGetLineItemField('item', 'custcol_consignment_numberofparcels', 1).length == 0 && nlapiGetLineItemField('item', 'custcol_totalweightparcels', 1).length == 0) {
                    nlapiSelectLineItem('item', 1);
                    getRates();
                }
                else {
                    if (reCalcRates && nlapiGetFieldValue('custbody_deliverycountryselect') == '2') {
                        nlapiSelectLineItem('item', 1);
                        nlapiSetCurrentLineItemValue('item', 'item', 64); // ROAD internal id
            			document.getElementById('otherrefnum').focus();
                    }
                }
    
    if (name == 'custbody_insuranceamount' && (nlapiGetFieldValue('custbody_insuranceamount').length > 0)) 
        nlapiSetFieldValue('custbody_insurancerequired', 'T', false, false);
    
    return isValid;
    

/*
	if (name == 'custbody_pickupaddressselect') {
		changeAddress('pickup');
		reCalcRates = true;
	} else { 
		if (name == 'custbody_deliveryaddressselect') {
			changeAddress('delivery');
			reCalcRates = true;
		} else {
			if (name == 'otherrefnum') {
				document.getElementById('otherrefnum').focus();
			} else {//else if
				if (name == 'custbody_deliverypostcode') {
					isValid = validateCountryPostcode('delivery');
				} else {//else if
					if (name == 'custbody_pickupaddresspostcode') {
						isValid = validateCountryPostcode('pickup');
					}  else {   
						if (name == 'custbody_delpostcodesearch') {  
							var searchpc = nlapiGetFieldValue('custbody_delpostcodesearch');
							if (searchpc !='' && searchpc != null){
								if (canLookupPostCodes == 'T'){
									isValid = XMLSoapLookup(searchpc);
								} else {
									isValid = false;
								}
								if (!isValid){	
									var addrSearchFilters = new Array();
									var addrSearchColumns = new Array();

									addrSearchFilters[0] = new nlobjSearchFilter('name', null, 'contains', searchpc);                               
									addrSearchColumns[0] = new nlobjSearchColumn('name');
									addrSearchColumns[1] = new nlobjSearchColumn('internalid');

									var addrSearchResults = nlapiSearchRecord('customrecord_deliveryaddress', null, addrSearchFilters, addrSearchColumns);
									// if search returns results then set to it
									if (addrSearchResults) {
										nlapiSetFieldValue('custbody_deliverypostcode', addrSearchResults[0].getValue(addrSearchColumns[1], true);
										reCalcRates = true;
									}
								} else {
									reCalcRates = true;
								}
							}

						} //if (name == 'custbody_delpostcodesearch')
					} //if (name == 'custbody_pickupaddresspostcode')
				}
			}
		}
	}
	
	//Recalculate rates if required ...
	if (reCalcRates && nlapiGetLineItemField('item', 'custcol_consignment_numberofparcels', 1).length == 0 && nlapiGetLineItemField('item', 'custcol_totalweightparcels', 1).length == 0) {
		nlapiSelectLineItem('item', 1);
		getRates();
	}
	else {
		if (reCalcRates && nlapiGetFieldValue('custbody_deliverycountryselect') == '2') {
			nlapiSelectLineItem('item', 1);
			nlapiSetCurrentLineItemValue('item', 'item', 64); // ROAD internal id
			document.getElementById('otherrefnum').focus();
		}
	}

	if (name == 'custbody_insuranceamount' && (nlapiGetFieldValue('custbody_insuranceamount').length > 0)) 
		nlapiSetFieldValue('custbody_insurancerequired', 'T', false, false);

	return isValid;
  */
    
} //function fieldChanged

function changeAddress(type){
    var customForm = nlapiGetFieldValue('customform');
    var formId = nlapiGetFieldValue('custbody_formid');
    var deliveryType = getFormDeliveryType(formId)
    if (deliveryType == '') 
        deliveryType = getFormDeliveryType(customForm);
    
    if (type == 'pickup') {
        var addressSelect = nlapiGetFieldValue('custbody_pickupaddressselect');
    } //if
    else {
        var addressSelect = nlapiGetFieldValue('custbody_deliveryaddressselect');
    } //else
    if (addressSelect) {
        var addressRecord = nlapiLoadRecord('customrecord_deliveryaddress', addressSelect);
        var label = addressRecord.getFieldValue('custrecord_deladdressname');
        var addr1 = addressRecord.getFieldValue('custrecord_deladdress_addr1');
        var addr2 = addressRecord.getFieldValue('custrecord_deladdress_addr2');
        var city = addressRecord.getFieldValue('custrecord_deladdress_city');
        var county = addressRecord.getFieldValue('custrecord_deladdress_county');
        var country = addressRecord.getFieldValue('custrecord_countryaddress');
        var postcode = addressRecord.getFieldValue('custrecord_deladdress_postcode');        
        if (nlapiGetFieldValue('custbody_palletparcel') == '1') { //Parcel checks
            if (getPostCodeLookupValue(postcode, 'postcode') == null) {
                if (getPalletPostCodeLookupValue(postcode, 'postcode') != null && country == 2) { // It is a valid EIRE pallet, but not parcel so convert ..
                        postcode = getEIREorDUB(postcode);
                }
                else {
                    alert('Postcode ' + postcode + ' is not in the parcel services database, please edit this address.');
                }
            }
        }
        else { // Pallet checks 
            if (getPalletPostCodeLookupValue(postcode, 'postcode') == null) 
                alert('Postcode ' + postcode + ' is not in the pallet services database, please edit this address.');
        }
        var telephone = addressRecord.getFieldValue('custrecord_deladdresstelno');
        var contact = addressRecord.getFieldValue('custrecord_contactname');
        
        var addressText = label + '\n';
        if (addr1 != null) {
            addressText += addr1 + '\n';
        }
        else {
            addr1 = '';
        }
        if (addr2 != null) {
            addressText += addr2 + '\n';
        }
        else {
            addr2 = '';
        }
        if (city != null) {
            addressText += city + '\n';
        }
        else {
            city = '';
        }
        if (county != null) {
            addressText += county + '\n';
        }
        else {
            county = '';
        }
        addressText += postcode + '\n';
        if (label == null) 
            label = '';
        if (country == null) 
            country = '';
        if (telephone == null) 
            telephone = '';
        if (contact == null) 
            contact = '';
        
        if (type == 'pickup') {
            nlapiSetFieldValue('custbody_pickupaddress', addressText, false, false);
            if (telephone != null) 
                nlapiSetFieldValue('custbody_pickuptelno', telephone, true, false);
            if (contact != null) 
                nlapiSetFieldValue('custbody_pickupcontact', contact, false, false);
            
            // Set body fields for label printing purposes
            //if (label != null) 
            nlapiSetFieldValue('custbody_pickupname', label, false, false);
            //if (addr1 != null) 
            nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
            //if (addr2 != null) 
            nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
            //if (city != null) 
            nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
            //if (county != null) 
            nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
            //if (country != null) 
            nlapiSetFieldValue('custbody_pickupcountryselect', country, false, false);
            //if (telephone != null) 
            nlapiSetFieldValue('custbody_pickuptelno', telephone, false, false);
            //if (contact != null) 
            nlapiSetFieldValue('custbody_pickupcontact', contact, false, false);
            
            nlapiSetFieldValue('custbody_pickupaddresspostcode', postcode, true, false);
            
        }
        if (type == 'delivery' && deliveryType != 'TH') {
            nlapiSetFieldValue('custbody_deliveryaddress', addressText, false, false);
            //if (telephone != null) 
            nlapiSetFieldValue('custbody_deliverytelno', telephone, true, false);
            //if (contact != null) 
            nlapiSetFieldValue('custbody_deliverycontact', contact, false, false);
            
            // Set body fields for label printing purposes
            //if (label != null) 
            nlapiSetFieldValue('custbody_delname', label, false, false);
            //if (addr1 != null) 
            nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
            //if (addr2 != null) 
            nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);
            //if (city != null) 
            nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
            //if (county != null) 
            nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
            //if (country != null) 
            nlapiSetFieldValue('custbody_deliverycountryselect', country, false, false);
            
            nlapiSetFieldValue('custbody_deliverypostcode', postcode, true, false);
            
            
            /**********************************************
             * Check for duplicate orders
             **********************************************/
            // get current customer
            var currentCustomer = nlapiGetFieldValue('entity');
            
            // construct search
            
            var dupSearchFilters = new Array();
            var dupSearchColumns = new Array();
            
            dupSearchFilters[0] = new nlobjSearchFilter('entity', null, 'is', currentCustomer);
            dupSearchFilters[1] = new nlobjSearchFilter('trandate', null, 'within', 'today');
            dupSearchFilters[2] = new nlobjSearchFilter('shipzip', null, 'is', postcode);
            dupSearchFilters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
            
            dupSearchColumns[0] = new nlobjSearchColumn('tranid');
            dupSearchColumns[1] = new nlobjSearchColumn('custbody_delname');
            dupSearchColumns[2] = new nlobjSearchColumn('custbody_deliverypostcode');
            dupSearchColumns[3] = new nlobjSearchColumn('custbody_labelservice');
            dupSearchColumns[4] = new nlobjSearchColumn('custbody_labelparcels');
            
            // perform search
            
            var dupSearchResults = nlapiSearchRecord('salesorder', null, dupSearchFilters, dupSearchColumns);
            var dupalerttext = '';
            
            // if search returns results then show warning
            if (dupSearchResults) {
            
                dupalerttext += 'Warning: One or more consignments has already been entered for this delivery postcode:\n\n';
                
                for (duploop = 0; duploop < dupSearchResults.length; duploop++) {
                    dupalerttext += 'Consignment ' + dupSearchResults[duploop].getValue(dupSearchColumns[0]) + ': ';
                    dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[1]);
                    dupalerttext += ', ';
                    dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[2]);
                    dupalerttext += ', ';
                    dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[3]);
                    dupalerttext += '\n'
                    
                } //for
                alert(dupalerttext);
                
            } //if
        }
    } //if
    else {
        if (type == 'pickup') {
            nlapiSetFieldValue('custbody_pickupaddress', '', false, false);
            nlapiSetFieldValue('custbody_pickupaddresspostcode', '', false, false);
            nlapiSetFieldValue('custbody_pickuptelno', '', true, false);
            nlapiSetFieldValue('custbody_pickupaddr1', '', true, false);
            nlapiSetFieldValue('custbody_pickupaddr2', '', true, false);
            nlapiSetFieldValue('custbody_pickupaddr3', '', true, false);
            nlapiSetFieldValue('custbody_pickupaddr4', '', true, false);
            
        }
        if (type == 'delivery' && deliveryType != 'TH') {
            nlapiSetFieldValue('custbody_deliveryaddress', '', false, false);
            nlapiSetFieldValue('custbody_deliverypostcode', '', false, false);
            nlapiSetFieldValue('custbody_deliverytelno', '', true, false);
            nlapiSetFieldValue('custbody_deliveryaddr1', '', true, false);
            nlapiSetFieldValue('custbody_deliveryaddr2', '', true, false);
            nlapiSetFieldValue('custbody_deliveryaddr3', '', true, false);
            nlapiSetFieldValue('custbody_deliveryaddr4', '', true, false);
            
        }
        
    } //else
    //}
    //if (isTestUser()) alert ('changeAddress end: Ship Address :\n1' + nlapiGetFieldValue('custbody_deliveryaddr1') + '\n2 = ' + nlapiGetFieldValue('custbody_deliveryaddr2') + '\n3 = ' + nlapiGetFieldValue('custbody_deliveryaddr3') + '\n4 = ' + nlapiGetFieldValue('custbody_deliveryaddr4'));
} //function changePickupAddress
/******************************************************************************************************
 *  Function getRates()
 *  To be called on line submit action.
 *****************************************************************************************************/
function getRates(){
    if (showVer == true) 
        alert(versionNo);
    
    //if (isTestUser()) alert ('Ship Address1 = ' + nlapiGetFieldValue('custbody_deliveryaddr1'));
    
    // Mod Feb 23rd - only allow one line item per transaction ...
    //if (parseInt(nlapiGetLineItemCount('item')) > 1) // 2nd item ...
    if (parseInt(nlapiGetCurrentLineItemIndex('item')) > 1) // 2nd item ...
    {
        alert('Only one delivery service item allowed per consignment / quotation.');
        nlapiCancelLineItem('item');
        nlapiSelectLineItem('item', 1);
    }

    var PCsearchField = nlapiGetFieldValue('custbody_deliveryaddressselect');
    if (PCsearchField == '' || PCsearchField == null)
    	return false;
    
    // Retrieve the current item selected and load the record	
    var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
    var currentItemID = nlapiGetCurrentLineItemValue('item', 'id');
    var currentItemText = nlapiGetCurrentLineItemText('item', 'item');
	var theDate = new Date();
	var tranDate = nlapiStringToDate(nlapiGetFieldValue('trandate'));
	
    //var deliveryDays = parseInt(nlapiGetFieldValue('custbody_deliverydays'));
	var thisPostCode = nlapiGetFieldValue('custbody_postcodezone');
    var deliveryDays = parseInt(getPostCodeLookupValue(thisPostCode + " 1AA", 'deliverydays'));
    nlapiSetFieldValue('custbody_deliverydays', deliveryDays, false, false);
    var deliveryWeekTime = parseInt(getPostCodeLookupValue(thisPostCode + " 1AA", 'weektime'));
    
	var itemTime = 16;
 	if (currentItemText.length >= 4){
		var itemTime = currentItemText.substring(2,4);
		if (!isNaN(itemTime)){
			itemTime = parseInt(itemTime * 1);			
		}
		if (itemTime < deliveryWeekTime){
			alert(deliveryWeekTime + ':00 is the earliest service delivery time for this post code area.');
			return false;
		}
	}
	
    if (isTestUser()) 
        alert("Item :" + currentItemText + " Service Time :" + currentItemText.substring(2,4) + " Area Time :" + deliveryWeekTime);

    if (!checkEirePostCode(thisPostCode)) {
        if (deliveryDays == 1 && (currentItem == '35' || currentItem == '43' || currentItem == '44' || currentItem == '58')) {
            alert('This 2 day service is not available in a 1 day delivery zone.');
            return false;
        }
        else {
            if (deliveryDays > 1 && !(currentItem == '35' || currentItem == '43' || currentItem == '44' || currentItem == '58')) {
                alert('This 1 day service is not available in a 1+ day delivery zone.');
                return false;
            }
        }
    }
    else {
        //if (deliveryDays > 1 && !(currentItem == '86')) { // ROAD Service
        if (deliveryDays > 1 && !(currentItem == '64')) { // ROAD Service
            alert('This service is not available in this Ireland delivery zone.');
            return false;
        }
    }    

    var ipSatSearchFilters = new Array();
    var ipSatSearchColumns = new Array();
   
	// Check for Saturday services
    ipSatSearchFilters[0] = new nlobjSearchFilter('custrecord_staurdayservice', null, 'is', 'T'); // Note typo - too late to change ....!!    
    ipSatSearchColumns[0] = new nlobjSearchColumn('custrecord_ip_item');
    // perform search
    //if (isTestUser()) 
    
    var ipSatSearchResults = nlapiSearchRecord('customrecord_itemparameters', null, ipSatSearchFilters, ipSatSearchColumns);       
    if (ipSatSearchResults) {
        for (var ss = 0; ss < ipSatSearchResults.length; ss++) {
        	//alert ('Check for Saturday service: ' + ipSatSearchResults[ss].getValue(ipSatSearchColumns[0]));
            if (currentItem == ipSatSearchResults[ss].getValue(ipSatSearchColumns[0]) && tranDate.getDay() != 5) { //Saturday Service but not a Friday ...
                alert('Please Note: Saturday Service selected but consignment date is not Friday.\n\nPlease select another service.');
                return false;
            }
        }
    } //if
    
    // Do not reprice logic - set by Cust Services if special pricing applies
	var DNR = nlapiGetCurrentLineItemValue('item', 'custcol_donotreprice'); 
    if (DNR == 'T') { // Ignore pricing do it manually - added June 2012
        var amount = nlapiGetCurrentLineItemValue('item', 'amount');
        var formid = nlapiGetFieldValue('custbody_formid');
        if (formid == null || formid == '')
        	formid = nlapiGetFieldValue('customform');
        if (parseFloat(amount) > 0.00 || (parseFloat(amount) == 0.00 && formid != 140)) {
            nlapiSetCurrentLineItemValue('item', 'rate', amount, false, false);
            var fuelSurchargePercent = parseFloat(nlapiGetFieldValue('custbody_fuelsurchargeratepercent'));
            var fuelSurcharge;
            
            if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) {
                fuelSurcharge = 0.00;
            }
            else {
                fuelSurcharge = (parseFloat(fuelSurchargePercent / 100) * parseFloat(amount)).toFixed(4);
            } //if
            nlapiSetCurrentLineItemValue('item', 'custcol_fuelsurchargeamount', fuelSurcharge, false, false);           
            return true;
        }
        else {
            //alert('Manually priced.');
            return false;
        }
    }
		
	//if (nlapiGetFieldValue('custbody_nopriceonsave') == 'T') return true;

    //if (isTestUser()) 
    //    alert("Delivery Days :" + nlapiGetFieldValue('custbody_deliverydays'));
    // If this is an insurance line then break
    // if (currentItem == '114') 
    //    return true;
    
    /****************************************
     * New search for item parameter record
     **/
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
        alert('Item Parameter Error');
        return false;
        
    } //if
    // *** var itemRecord = nlapiLoadRecord('serviceitem',currentItem);
   
    // Retrieve flag from current item record
    // ***var ncServiceFlag = itemRecord.getFieldValue('custitem_ncserviceflag');
    var ncServiceFlag = ipSearchResults[0].getValue(ipSearchColumns[4]);
    
    //set APC integration non convey flag
    if (ncServiceFlag == 'T') {
        nlapiSetFieldValue('custbody_nonconvey', 'T', false, false);
    } //if
    else {
        nlapiSetFieldValue('custbody_nonconvey', 'F', false, false);
    } //else
    // Retrieve current parcel area
    var parcelArea = nlapiGetFieldValue('custbody_parcelarea');
    var altArea = '';
    nlapiSetFieldValue('custbody_parcelarea2', '');
    if (currentItem != '') 
        altArea = getAltAreaforServiceArea(parcelArea, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
    //    alert("Area :" + parcelArea + " AltArea :" + altArea);
    if (parcelArea != altArea) 
        nlapiSetFieldValue('custbody_parcelarea2', altArea);
    if (nlapiGetFieldValue('custbody_parcelarea2') != '') 
        parcelArea = nlapiGetFieldValue('custbody_parcelarea2');
    
    //if (parcelArea.length ==0) parcelArea = nlapiGetFieldValue('custbody_collectparcelarea');
    
    //if (isTestUser()) alert('parcelArea = ' + parcelArea);
    //alert(getServicesforArea(parcelArea, false));
    
    // Retrieve current customer
    var currentCustomer = nlapiGetFieldValue('entity');
    
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
    var numberOfParcels = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_consignment_numberofparcels'));
    var consignmentWeight = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_totalweightparcels'));
    // Pricing weight added Jan 2013 to allow true weight = consignmentWeight
    var pricingWeight = consignmentWeight;
    //if (isTestUser())alert ('numberOfParcels = ' + numberOfParcels + ' | consignmentWeight = ' + consignmentWeight);
        
    if (!isNaN(numberOfParcels) && !isNaN(consignmentWeight)) {
        if (numberOfParcels * consignmentWeight <= 0) {
			alert('Please enter a valid parcel / weight (min. 1 KG)');
			return false; // Not a valid weight
		}
    }
    else {
        var alertText = 'Please enter :-\n';
        if (isNaN(numberOfParcels)) 
            alertText += 'Number of parcel(s) (minimum 1). ';
        if (isNaN(consignmentWeight)) 
            alertText += '\nTotal weight in KG (min. 1 KG).';
        else {
         if (parseInt(consignmentWeight) < 1) 
            alertText += '\nTotal weight in KG (min. 1 KG).';
        }
        alert(alertText);
        return false;
    }
    
    // Calculate average weight of each parcel
    var parcelWeight = Math.round(consignmentWeight / numberOfParcels);
    
    /*****************************************************
     *  Single service check - check to see if service can
     *  only have one parcel
     ****************************************************/
    // Retrieve flag from current item record
    // *** var singleService = itemRecord.getFieldValue('custitem_singleitem');
    var singleService = ipSearchResults[0].getValue(ipSearchColumns[5]);
    
    if (singleService == 'T') {
        if (numberOfParcels > 1) {
            alert('Error: Only one parcel is allowed for this service. (E01)');
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
        alert('Error: The weight specified exceeds the maximum for parcels (' + paramsMaxWeight + ' kg).\nThis consignment must be palletised. (E02)');
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
                alert('Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg)\n(E03)');
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
                        alert('Item Parameter Error');
                        return false;
                        
                    } //if
                    baseService = xsipSearchResults[0].getValue(xsipSearchColumns[6]);
                    
                    // if no base service is specified then error
                    if (baseService == null || baseService == '') {
                        alert('Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg)\n(E04)');
                        return false;
                        
                    } //if				
                    else {
                        // prompt user to change service
                        var changeItem = confirm('Error: The weight specified exceeds the maximum weight for this service.\nTo automatically change to an oversize service press OK.  To return and edit manually press CANCEL.');
                        
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
                    alert('Error: The weight specified exceeds the maximum weight for this service (' + maxWeight + ' kg)\n(E05)');
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
    /*****************************************************
     *  Sizing Checks - get sizing information in order to
     *  perform sizing checks
     ****************************************************/
    var parcelLength = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_length'));
    var parcelWidth = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_width'));
    var parcelHeight = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_height'));
    
    // Only perform sizing checks if all dimensions are present
    
    if ((!isNaN(parcelLength) && parcelLength > 0) && (!isNaN(parcelWidth) && parcelWidth > 0) && (!isNaN(parcelHeight) && parcelHeight > 0)) {
    
        /*****************************************************
         *  Volumetric weight calculation
         *  (L * W * H)/6000
         ****************************************************/
        var volumetricWeight = Math.round((parcelLength * parcelWidth * parcelHeight) / 6000);
        
        //set column on item line
        nlapiSetCurrentLineItemValue('item', 'custcol_truevolumeweight', volumetricWeight, false, false);
        
        //if (volumetricWeight > consignmentWeight && numberOfParcels == 1) {
        if (volumetricWeight > consignmentWeight) {
            //consignmentWeight = volumetricWeight;
            pricingWeight = volumetricWeight;
            nlapiSetFieldValue('custbody_usevolumetric', 'T', false, false);
            
        } //if
        else {
            nlapiSetFieldValue('custbody_usevolumetric', 'F', false, false);
            
        } //else
        /*****************************************************
         *  Max Sizing check - no dimension to exceed 3.05m (305cm)
         ****************************************************/
        if (parcelLength > 305 || parcelWidth > 305 || parcelHeight > 305) {
            alert('Error: The parcel exceeds the maximum dimensions for carriage (300cm).\n(E06)');
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
                    alert('Error: The dimensions specified exceed the maximum for this service (250cm).\n(E07)');
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
                                alert('Item Parameter Error');
                                return false;
                                
                            } //if
                            baseService = xsipSearchResults[0].getValue(xsipSearchColumns[6]);
                            
                            
                            // if no base service is specified then error
                            if (baseService == null || baseService == '') {
                                alert('Error: The dimensions specified exceed the maximum dimensions for this service.\n(E09');
                                return false;
                                
                            } //if				
                            else {
                                // prompt user to change service
                                var changeItem = confirm('Error: The dimensions specified exceed the maximum dimensions for this service.\nTo automatically change to an oversize service press OK.  To return and edit manually press CANCEL.');
                                
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
                            alert('Error: The dimensions specified exceed the maximum for this service (250cm).\n(E08)');
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
        
            //if (ncSizeCheck(parcelLength, parcelWidth, parcelHeight)) {
            if (ncSizeCheckV2(parcelLength, parcelWidth, parcelHeight)) {
                // ***var ncService = itemRecord.getFieldValue('custitem_ncservice');
                var ncService = ipSearchResults[0].getValue(ipSearchColumns[3]);
                
                // If no NC service defined then error
                if (ncService == null || ncService == '') {
                    alert('Error: The dimensions specified exceed the maximum dimensions for this service.');
                    return false;
                    
                } //if				
                else {
                    // prompt user to change service
                    var changeItem = confirm('Error: The dimensions specified exceed the maximum dimensions for this service.\nTo automatically change to a non-conveyorable service press OK.  To return and edit manually press CANCEL.');
                    
                    // cancel and return to line if user presses cancel
                    if (changeItem == false) {
                        return false;
                    } //if
                    else {
                        changeService = true;
                        changeServiceTo = ncService;
                        useBaseService = false;
                        
                        //set APC integration non convey flag
                        nlapiSetFieldValue('custbody_nonconvey', 'T', false, false);
                        
                        // get nc surcharge from params record
                        //surcharge = parseFloat(nlapiLookupField('customrecord_parameters', 1, 'custrecord_param_ncsurcharge'));
                    
                    } //else change service				
                } // nc service defined
            } //if over dimensions
        } //if changeService == false		
    } //if all dimensions present
    else {
        //reset volumetrics, if not Customer Center, allow volumetric weight to override if greater - Jan 2013 updated
    	if (isCustomerService()){
    		if (consignmentWeight < parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_truevolumeweight'))){
    			nlapiSetFieldValue('custbody_usevolumetric', 'T', false, false);
    			//consignmentWeight = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_truevolumeweight'));
    			pricingWeight = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_truevolumeweight'));
    			nlapiSetCurrentLineItemValue('item', 'custcol_invoicemanuallyamended', 'T', false, false); // Discrep'd as the volumatrics were missing
    			//alert('consignmentWeight : ' + consignmentWeight + '\ncustcol_truevolumeweight : ' + nlapiGetCurrentLineItemValue('item', 'custcol_truevolumeweight'));
    		}
    	} else {
    		nlapiSetFieldValue('custbody_usevolumetric', 'F', false, false);
    		nlapiSetCurrentLineItemValue('item', 'custcol_truevolumeweight', 0, false, false);
    	}
        
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
    // get current custom form
    //var currentForm = nlapiGetFieldValue('customform');
    var currentForm = nlapiGetFieldValue('custbody_formid');
    
    if (getFormDeliveryType(currentForm) == 'TT') {
        // get collection address
        var collectAddressArea = nlapiGetFieldValue('custbody_collectparcelarea');
        if (nlapiGetFieldValue('custbody_collectparcelarea2') != '') 
            collectAddressArea = nlapiGetFieldValue('custbody_collectparcelarea2');
        var altCollectArea = '';
        nlapiSetFieldValue('custbody_collectparcelarea2', '');
        if (currentItem != '') 
            altArea = getAltAreaforServiceArea(collectAddressArea, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
        //if (isTestUser()) 
        //    alert("Collect Area :" + collectAddressArea + " Collect AltArea :" + altCollectArea);
        if (parcelArea != altCollectArea) 
            nlapiSetFieldValue('custbody_collectparcelarea2', altCollectArea);
        if (nlapiGetFieldValue('custbody_collectparcelarea2') != '') 
            collectAddressArea = nlapiGetFieldValue('custbody_collectparcelarea2');
        
        // Construct search to see if collection area has correct services available
        // If the service selected is XS or the service is changing to XS
        // then check for XS services to that collection area.
        // If the service is not XS then check for ND16 and then TDAY
        
        
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
                alert('Error: XS Collection is not available for this area.\nPlease contact NEP directly to process you order.');
                
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
                    alert('Error: XS Collection is not available for this area.\nPlease contact NEP directly to process you order.');
                    
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
                        alert('Error: NC Collection is not available for this area.\nPlease contact NEP directly to process you order.');
                        
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
                        var ndSearchResults = nlapiSearchRecord('customrecord_areaservice', null, tdSearchFilters, tdSearchColumns);
                        
                        // If no ND16 or TDAY then error
                        if (!tdSearchResults) {
                            alert('Error: Price cannot be determined.  Please contact NEP directly to process this order.');
                            
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
            //var collectRate = parseFloat(getParcelPrice(currentCustomer, baseService, collectAddressArea, consignmentWeight));
            var collectRate = parseFloat(getParcelPrice(currentCustomer, baseService, collectAddressArea, pricingWeight));
        }
        else {
            //var collectRate = parseFloat(getParcelPrice(currentCustomer, collectService, collectAddressArea, consignmentWeight));
            var collectRate = parseFloat(getParcelPrice(currentCustomer, collectService, collectAddressArea, pricingWeight));
        }
        
        // If price cannot be determined for collection then error, else set surcharge to collection rate
        if (!collectRate) {
            alert('Error: Price cannot be determined.  Please contact NEP directly to process this order.');
        }
        if (collectRate == -1) {
            alert('Error: Price cannot be determined.  Please contact NEP directly to process this order.');
            
        } //if
        else {
            if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
                alert('CollectRate T-T = ' + collectRate + ' Surcharge T-T = ' + surcharge);
            collectRate += surcharge;
        } //else
    } //if customform - T-T
    
	//alert('Type=' + nlapiGetFieldValue('custbody_ordertype'));
	//if (nlapiGetFieldValue('custbody_nopriceonsave') == 'T' && nlapiGetFieldValue('custbody_ordertype') == '1') return true;

    /*****************************************************
     *  Calculate pricing
     ****************************************************/
    // get pricing for delivery
    if (changeService == true) {
        // alert('changeService=T');
        if (useBaseService == true) {
            //alert('useBaseService=T');
            //alert('baseService=' + baseService);
            //var rate = getParcelPrice(currentCustomer, baseService, parcelArea, consignmentWeight);
            var rate = getParcelPrice(currentCustomer, baseService, parcelArea, pricingWeight);
            var cost = getCost(baseService, parcelArea);
        } //if
        else {
            //alert('useBaseService=F');
            //alert('baseService=' + baseService);
            //alert('changeServiceTo=' + changeServiceTo);
            //alert('consignmentWeight=' + consignmentWeight);
            //var rate = getParcelPrice(currentCustomer, changeServiceTo, parcelArea, consignmentWeight);
            var rate = getParcelPrice(currentCustomer, changeServiceTo, parcelArea, pricingWeight);
            var cost = getCost(changeServiceTo, parcelArea);
        } //else
    }
    else {
        if (useBaseService == true) {
            //var rate = getParcelPrice(currentCustomer, baseService, parcelArea, consignmentWeight);
            var rate = getParcelPrice(currentCustomer, baseService, parcelArea, pricingWeight);
            var cost = getCost(baseService, parcelArea);
        }
        else {
            //var rate = getParcelPrice(currentCustomer, currentItem, parcelArea, consignmentWeight);
            var rate = getParcelPrice(currentCustomer, currentItem, parcelArea, pricingWeight);
            var cost = getCost(currentItem, parcelArea);
            
        } //else
    } //else
    // Trace for testing ...
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) 
    //    alert('Rate = ' + rate + '\nCost = ' + cost)
    
    // if rate cannot be determined then error       
    
    if (rate == -1) {
        //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) {
        var servicesList = 'The services available for the selected customer address are :\n';
        var serviceArray = getServicesforArea(parcelArea, true).split(',');
        if (serviceArray.length > 0 && parcelArea.length > 0) {
            for (ss = 0; ss < serviceArray.length; ss++) {
                servicesList += "  " + serviceArray[ss];
            }
            servicesList += '\n\nPlease choose from one of the services listed above - thank you.';
            alert(servicesList);
        }
        else {
            if (parcelArea.length == 0) {
                alert('Error: No parcel area available for the post code.\nPlease check and change the post code / address.');
            }
            else {
                alert('Error: Price / services options cannot be determined.\nPlease contact NEP directly to process this consignment.');
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
        if (getFormDeliveryType(currentForm) == 'TH') {
            //get there-->here surcharge
            paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
            var PURcollservice = paramRecord.getFieldValue('custrecord_pur_collectservice');
            var PURbaseservice = paramRecord.getFieldValue('custrecord_pur_baseservice');
            var PURSurcharge = parseFloat(paramRecord.getFieldValue('custrecord_param_tpcollectionsurcharge'));
			var thSurcharge = 0.0;
            //1. See whether Customer has special collection rates for PURs
            var PURcustrate = getParcelPrice(currentCustomer, PURcollservice, parcelArea, consignmentWeight);
            if (PURcustrate == -1) { // Use base services rate for PURs
				if (isTestUser()) alert('Base service = ' + PURbaseservice + ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
                //var PURbaserate = getParcelPrice(currentCustomer, PURbaseservice, parcelArea, consignmentWeight);
                var PURbaserate = getParcelPrice(currentCustomer, PURbaseservice, parcelArea, pricingWeight);
                if (PURbaserate == -1) { // Should never get here but ...
                    alert('No PUR base price defined. Please contact support.');
                    return false;
                }
                else {
					//alert('Baserate T-H = ' + PURbaserate+ ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
                	if (rate < PURbaserate) thSurcharge = PURbaserate - rate ; // Add base rate surcharge if lower
                	thSurcharge += PURSurcharge; // Add fixed surcharge
                }
            } else { // Apply customer PUR rates ...
				if (isTestUser()) alert('Cust COLLrate T-H = ' + PURcustrate + ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
				if (rate < PURcustrate) thSurcharge = PURcustrate - rate ; // Surcharge the difference
			}           
            if (isTestUser()) 
                alert('Surcharge T-H = ' + thSurcharge);
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
    var waivefragilefee = nlapiGetFieldValue('custbody_waive_fragile_fee');
    if (fragile == 'T') {
        nlapiSetFieldValue('custbody_labelfswflag', 'F', false, false);
        if (waivefragilefee != 'T')
        	fragileCharge = parseFloat(0.50 * parseInt(numberOfParcels));
        rate += fragileCharge;
    } //if

    /*****************************************************
     *  Calculate fuel surcharge
     *  - To be moved into invoice.
     ****************************************************/
    var fuelSurchargePercent = parseFloat(nlapiGetFieldValue('custbody_fuelsurchargeratepercent'));
    var fuelSurcharge;
    
    if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) {
        fuelSurcharge = 0.00;
    }
    else {
        fuelSurcharge = (parseFloat(fuelSurchargePercent / 100.00) * parseFloat(rate)).toFixed(4);
    } //if
    nlapiSetFieldValue('custbody_fuelsurcharge', fuelSurcharge, false, false);
	
    //Added July 2012 - surcharges related to Olympics ...
	var deliveryType = getFormDeliveryType(currentForm);
	var surchargePostCode = nlapiGetFieldValue('custbody_deliverypostcode');
	if (deliveryType == 'TT' || deliveryType == 'TH') {
		surchargePostCode = nlapiGetFieldValue('custbody_pickupaddresspostcode');
	} 

	//var newSurcharge = parseFloat(getPostcodeSurcharge(surchargePostCode, true, numberOfParcels));
	var newSurcharge = 0.00;
	if (newSurcharge > 0){
		nlapiSetFieldValue('custbody_surcharge_postcode', newSurcharge, false, false);
	} 
    if (newSurcharge > 0) {
        rate += newSurcharge;
    }
	
    if (isTestUser()) 
        alert('Fuel percent = ' + fuelSurchargePercent + '\nFuel surcharge = ' + fuelSurcharge + '\nExtra surcharge = ' + newSurcharge + '\nRate = ' + rate);
    //rate = parseFloat(rate) + fuelSurcharge;
    
    //if item change required then change item
    if (changeService == true) {
        nlapiSetCurrentLineItemValue('item', 'item', changeServiceTo, false, true);
    } //if
    nlapiSetCurrentLineItemValue('item', 'rate', rate, false, false);
    nlapiSetCurrentLineItemValue('item', 'amount', rate, false, false);
    nlapiSetFieldValue('custbody_purchasecost', cost, false, false);
    
    return true;
    
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
    //if (currentCustomer.length > 0 && currentItem.length > 0 && parcelArea.length > 0 && consignmentWeight.length > 0) {
    if (currentCustomer != '' && currentItem != '' && parcelArea != '' && consignmentWeight != '') {
        // construct search for customer-item specific pricing
    	//alert('getParcelPrice('+ currentCustomer + ', ' + currentItem + ', ' + parcelArea + ', ' + consignmentWeight + ')');
    	
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
            
            var defSearchFilters = new Array();
            var defSearchColumns = new Array();
            
            defSearchFilters[0] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', parcelArea);
            defSearchFilters[1] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
			//if (isTestUser())
            //	alert ('[Search customrecord_areaservice - parcelArea=' + parcelArea + ' currentItem=' + currentItem + ']');
           
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
            alert('getParcelPrice - missing parameter(s): Customer = ' + currentCustomer + ' Item = ' + currentItem + ' Area = ' + parcelArea + ' Weight = ' + consignmentWeight);
        }
        else {
            if (consignmentWeight == '') 
                alert('Please enter a weight in KG.')
        }
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
// Tests to see if string is in correct UK style post code format, e.g. X99 9XX or XX99 9XX.
function isValidParcelPostcode(postcode, country){

    // create regular expression
    //var postcodeRegEx = /[A-Z]{1,2}[0-9]{1,2} ?[0-9][A-Z]{2}/i;
    //return postcodeRegEx.test(postcode);
    
    return getValidPostcode(postcode, countryID)
} //function
// Formats a postcode to uppercase and retrieves the first portion for use in postcode table lookup.

function returnParcelPostcodePrefix(postcode, country){
    //if (parseInt(country) == 1) return returnPostcodePrefix(postcode) // UK
    if (parseInt(country) == 2) {
        return returnEirePostCodePrefix(postcode) // EIRE
    }
    else {
        // convert to upper case, strip spaces
        postcode = postcode.toUpperCase();
        postcode = postcode.replace(' ', '');
        
        // create regular expression
        var postcodeRegEx = /(^[A-Z]{1,2}[0-9]{1,2})([0-9][A-Z]{2}$)/i;
        var prefix = postcode.replace(postcodeRegEx, '$1');
        
        return prefix;
        
    } //if	
} //function

function saveNew(){
	nlapiSetFieldValue('custbody_saveandnew', 'T');
	//if (isTestUser())
	//	alert('Add new job after saving.\ncustbody_saveandnew=' + nlapiGetFieldValue('custbody_saveandnew'));
	document.getElementById('submitter').click();
}

function onSave(){
    // retrieve column fields from item sublist line 1
    
    var service = nlapiGetLineItemValue('item', 'item', 1);
    
    /****************************************
     * New search for item parameter record
     **/
    var ipSearchFilters = new Array();
    var ipSearchColumns = new Array();
    
    ipSearchFilters[0] = new nlobjSearchFilter('custrecord_ip_item', null, 'is', service);
    
    ipSearchColumns[0] = new nlobjSearchColumn('custrecord_ip_serviceshortname');
    
    
    // perform search
    var ipSearchResults = nlapiSearchRecord('customrecord_itemparameters', null, ipSearchFilters, ipSearchColumns);
    
    if (!ipSearchResults) {
        alert('Item Parameter Error');
        return false;
        
    } //if
    var servicename = ipSearchResults[0].getValue(ipSearchColumns[0]);
    
    var parcels = nlapiGetLineItemValue('item', 'custcol_consignment_numberofparcels', 1);
    var totalweight = nlapiGetLineItemValue('item', 'custcol_totalweightparcels', 1);
    var volumeweight = nlapiGetLineItemValue('item', 'custcol_truevolumeweight', 1);
    var useVolumetric = nlapiGetFieldValue('custbody_usevolumetric');
    var specialinstructions = nlapiGetLineItemValue('item', 'custcol_itemspecialinstructions', 1);
    var length = nlapiGetLineItemValue('item', 'custcol_length', 1);
    var width = nlapiGetLineItemValue('item', 'custcol_width', 1);
    var height = nlapiGetLineItemValue('item', 'custcol_height', 1);
    var rate = nlapiGetLineItemValue('item', 'amount', 1);
    
    var custRef = nlapiGetFieldValue('otherrefnum');
    if (custRef != "" && custRef != null)
    	nlapiSetFieldValue('custbody_otherrefnum', custRef);
    
    // check if each has a value and if so write to custom body fields
    
    if (servicename != null) 
        nlapiSetFieldValue('custbody_labelservice', servicename, false, false);
    if (parcels != null) 
        nlapiSetFieldValue('custbody_labelparcels', parcels, false, false);
    if (specialinstructions != null) 
        nlapiSetFieldValue('custbody_specialinstructions', specialinstructions, false, false);
    if (length != null) 
        nlapiSetFieldValue('custbody_length', length, false, false);
    if (width != null) 
        nlapiSetFieldValue('custbody_width', width, false, false);
    if (height != null) 
        nlapiSetFieldValue('custbody_height', height, false, false);
    
    if (useVolumetric == 'T') {
        nlapiSetFieldValue('custbody_labeltotalweight', volumeweight, false, false);
    } //if
    else {
        nlapiSetFieldValue('custbody_labeltotalweight', totalweight, false, false);
    } //else
    //set true weight
    nlapiSetFieldValue('custbody_trueweight', totalweight, false, false);
    nlapiSetFieldValue('custbody_currentlabelcount', '1', false, false);
    
    // ** barcode creation moved to separate event script for processing after submit.
    
    // get current form details.  Note customform field only works when logged on as full access user.  formId is used
    // for customer centre.	
    var customForm = nlapiGetFieldValue('customform');
    var formId = nlapiGetFieldValue('custbody_formid');
    
    // get form parameters from form redirects table for both consignment and quotation for both external and internal
    var thereToHere_c_ext = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_t2h_account');
    var thereToThere_c_ext = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_t2t_account');
    var hereToThere_c_ext = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_h2t_account');
    
    var thereToHere_q_ext = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_t2h_account');
    var thereToThere_q_ext = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_t2t_account');
    var hereToThere_q_ext = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_h2t_account');
    
    var thereToHere_c_int = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_t2h_account_i');
    var thereToThere_c_int = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_t2t_account_i');
    var hereToThere_c_int = nlapiLookupField('customrecord_formselector', 1, 'custrecord_parcel_h2t_account_i');
    
    var thereToHere_q_int = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_t2h_account_i');
    var thereToThere_q_int = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_t2t_account_i');
    var hereToThere_q_int = nlapiLookupField('customrecord_formselector', 2, 'custrecord_parcel_h2t_account_i');
    
    var reqDepot = nlapiGetFieldValue('custbody_requestingdepot');
    /*
     if (reqDepot.length == 1)
     {
     reqDepot = '00' + reqDepot;
     } //if
     if (reqDepot.length == 2)
     {
     reqDepot = '0' + reqDepot;
     } //if
     */
    var sendDepot = nlapiGetFieldValue('custbody_sendingdepot');
    //if (sendDepot.length == 0) sendDepot = nlapiGetFieldValue('custbody_requestingdepot');
    if (sendDepot == null || sendDepot == '') 
        sendDepot = nlapiGetFieldValue('custbody_requestingdepot');
    /*
     if (sendDepot.length == 1)
     {
     sendDepot = '00' + sendDepot;
     } //if
     if (sendDepot.length == 2)
     {
     sendDepot = '0' + sendDepot;
     } //if
     */
        var recDepot = nlapiGetFieldValue('custbody_receivingdepot');
		if (isTestUser()) alert('Service = ' + service + ', Recdepot = ' + recDepot);
        //Routing over-ride for EIRE / NI and ROAD Service       
        if (parseInt(service) == 64) {
            if (parseInt(recDepot) == 69 || parseInt(recDepot) == 67) {
                recDepot = parseInt(recDepot) + 100;
                if (recDepot.length == 1) {
                    recDepot = '00' + recDepot;
                } //if
                if (recDepot.length == 2) {
                    recDepot = '0' + recDepot;
                } //if
                if (isTestUser()) 
                    alert('Recdepot = ' + recDepot);
            }
        }

    //if (isTestUser()) alert ('custbody_requestingdepot = ' + reqDepot + ' custbody_sendingdepot = ' + sendDepot + ' custbody_receivingdepot = ' + recDepot);
    nlapiSetFieldValue('custbody_sendingdepot', sendDepot, false, false);
    nlapiSetFieldValue('custbody_requestingdepot', reqDepot, false, false);
    nlapiSetFieldValue('custbody_receivingdepot', recDepot, false, false);
    
    /*
     
     // Here --> There
     if (customForm == hereToThere_c_int || customForm == hereToThere_c_ext
     || customForm == hereToThere_q_int || customForm == hereToThere_q_ext
     || formId == hereToThere_c_int || formId == hereToThere_c_ext
     || formId == hereToThere_q_int || formId == hereToThere_q_ext)
     {
     nlapiSetFieldValue('custbody_requestingdepot', 95, false, false);
     nlapiSetFieldValue('custbody_sendingdepot', 95, false, false);
     } //if
     
     
     // There --> Here
     if (customForm == thereToHere_c_int || customForm == thereToHere_c_ext
     || customForm == thereToHere_q_int || customForm == thereToHere_q_ext
     || formId == thereToHere_c_int || formId == thereToHere_c_ext
     || formId == thereToHere_q_int || formId == thereToHere_q_ext)
     {
     nlapiSetFieldValue('custbody_requestingdepot', 95, false, false);
     nlapiSetFieldValue('custbody_receivingdepot', 95, false, false);
     
     } //if
     
     // There --> There
     if (customForm == thereToThere_c_int || customForm == thereToThere_c_ext
     || customForm == thereToThere_q_int || customForm == thereToThere_q_ext
     || formId == thereToThere_c_int || formId == thereToThere_c_ext
     || formId == thereToThere_q_int || formId == thereToThere_q_ext)
     {
     nlapiSetFieldValue('custbody_requestingdepot', 95, false, false);
     } //if
     */
    /*****************************************************
     *  Calculate insurance
     *  - To be moved into invoice.
     *  Update April 2012 - add fuel surcharge if security 0.50 fee applies
     ****************************************************/
    var insuranceRequired = nlapiGetFieldValue('custbody_insurancerequired');
    var insuranceCharge = 0.00; // Default no insurance charge
    var insuranceFuel = 0.00;
    var fuelSurchargePercent = parseFloat(nlapiGetFieldValue('custbody_fuelsurchargeratepercent'));
    var currentFuel = parseFloat(nlapiGetFieldValue('custbody_fuelsurcharge'));
    
    if (insuranceRequired == 'T') {
        var insuranceAmount = parseInt(nlapiGetFieldValue('custbody_insuranceamount'));
        
        if (insuranceAmount == 0 || isNaN(insuranceAmount)) {
            insuranceCharge = 0.50;
			//if (isTestUser()) {
				if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) {
					insuranceFuel = 0.00;
				}
				else {
					insuranceFuel = (parseFloat(fuelSurchargePercent / 100.00) * parseFloat(insuranceCharge)).toFixed(4);	
					currentFuel = (parseFloat(nlapiGetFieldValue('custbody_fuelsurcharge')) + parseFloat(insuranceFuel)).toFixed(4);				
				} //if
				//alert('Fuel percent = ' + fuelSurchargePercent + '\nInsurance = ' + insuranceCharge + '\nFuel surcharge = ' + insuranceFuel + '\nNew fuel total = ' + currentFuel);
				nlapiSetFieldValue('custbody_fuelsurcharge',currentFuel, false, false);
			//}
        }
        else {
            insuranceCharge = (Math.ceil(insuranceAmount / 1000)) * 3;
        }
    } //if
    nlapiSetFieldValue('custbody_insurancesurcharge', insuranceCharge, false, false);
    
    /*****************************************************
     *  Fragile / Security / Weight flags
     ****************************************************/
    // order of precedence dictates that Security always
    // overrides both weight and fragile.  An item cannot be
    // both fragile and weight.
    var fragileCharge = 0.00; // Default no charge - added Feb 2013
    var fragileFuel = 0.00;
    currentFuel = parseFloat(nlapiGetFieldValue('custbody_fuelsurcharge'));
    
    if (insuranceRequired == 'T') {
        nlapiSetFieldValue('custbody_labelfswflag', 'S', false, false);
    } //if
    else {
        var fragile = nlapiGetFieldValue('custbody_fragile');
        if (fragile == 'T') {
            nlapiSetFieldValue('custbody_labelfswflag', 'F', false, false);
       } //if
    } //else
    
	var TotalFee = parseFloat(rate) + insuranceCharge + fragileCharge;

	// if delivery depot is 95/47 then change class to local, else set to APC
    // If collecting depot is not NEP then set class to PUR
    var parcelDepot = parseInt(nlapiGetFieldValue('custbody_receivingdepot') * 1);
    var parcelSendDepot = parseInt(nlapiGetFieldValue('custbody_sendingdepot') * 1);
    var parcelRequestDepot = parseInt(nlapiGetFieldValue('custbody_requestingdepot') * 1);
    var theClass = 2; //APC - Default
    //if ((parcelDepot == 95 || parcelDepot == 47) && (parcelSendDepot == 95 || parcelSendDepot == 47)) {
    var thisDepot = parseInt(getParcelDepotNo());
    if ((parcelDepot == thisDepot) && (parcelSendDepot == thisDepot)) {
        theClass = 4; // Local - Parcel
    }
    else {
        //if (parcelSendDepot != 95 && parcelSendDepot != 47) {
        if (parcelSendDepot != thisDepot) {
            theClass = 6; // PUR - Parcel as NEP not sending
        }
    }
    
    nlapiSetFieldValue('class', theClass);
    //alert ('Request=' + parcelRequestDepot + '\nSend=' + parcelSendDepot + '\nReceive=' + parcelDepot + '\nClass=' + theClass)   
    
    var shipAddress = nlapiGetFieldValue('custbody_deliveryaddress');
    //if (isTestUser()) alert ('onSave end: Ship Address :\n1' + nlapiGetFieldValue('custbody_deliveryaddr1') + '\n2 = ' + nlapiGetFieldValue('custbody_deliveryaddr2') + '\n3 = ' + nlapiGetFieldValue('custbody_deliveryaddr3') + '\n4 = ' + nlapiGetFieldValue('custbody_deliveryaddr4'));
    
    var shipPostCode = nlapiGetFieldValue('custbody_deliverypostcode');
    if (getPostCodeLookupValue(shipPostCode, 'postcode') == null || parcelDepot == 0) {
        alert('Postcode ' + shipPostCode + ' is not in the database, please edit this address.');
        return false;
    }
    
    var defaultDriverrun = nlapiGetFieldValue('custbody_driverrun');
    nlapiSetFieldValue('custbody_driverrun', defaultDriverrun, false, false);
    
    nlapiSetFieldValue('custbody_readytime_text', nlapiGetFieldValue('custbody_readytime') + '', false, false);
    nlapiSetFieldValue('custbody_closetime_text', nlapiGetFieldValue('custbody_closetime') + '', false, false);
    
    nlapiSetFieldValue('shipaddresslist', '', false, false);
    nlapiSetFieldValue('shipaddress', shipAddress, false, false);
    nlapiSetFieldValue('shipzip', shipPostCode);
    
    // Show total amount if the entry is a quotation and whether to use it ...
    var insuranceFee = '';
    if (insuranceAmount > 0.00) 
        insuranceFee = '\nInsurance details : ' + parseFloat(rate).toFixed(2) + ' plus an insurance fee of ' + insuranceCharge.toFixed(2);
    var fragileFee = '';
    if (fragileCharge > 0.00) 
    	fragileFee = '\nAlso includes a fragile item(s) fee of 0.50 per item : ' + parcels + ' parcel(s) x 0.50 = ' + fragileCharge.toFixed(2);
    //if (formId == '113' || formId == '120' || formId == '121' || formId == '122') {
    if (getFormOrderType(formId) == 'QUOTATION'){
        //if (convertQuote) nlapiSetFieldValue('custbody_ordertype', '1');
        var convertQuote = alert('The service rate to the Customer is : \u00A3 ' + TotalFee.toFixed(2) + insuranceFee + fragileFee + '\n\nAny standard surcharges will also apply.');
    }
    
	var d = new Date();
    nlapiSetFieldValue('custbody_lastpriced_dt', nlapiDateToString(d, 'date'));

    return true;
}

/******************************************************************************************************
 *  Function ncSizeCheck(parcelLength, parcelWidth, parcelHeight)
 *  This function determines whether a parcel is Non Conveyorable.
 *  Returns TRUE if parcel is non-conveyorable.
 *****************************************************************************************************/
function ncSizeCheckV2(parcelLength, parcelWidth, parcelHeight){
	if (parcelLength > 1250 || parcelWidth > 1250 || parcelHeight > 1250) { // no dimension can exceed 1250
		return true;
	} else {
		if (parcelLength > 1000 || parcelWidth > 1000 || parcelHeight > 1000) { // only dimension 1250 x 600 x 750 can exceed 1000
			if (parcelLength > 750 || parcelWidth > 750 || parcelHeight > 750) { 
				return true;
			} else {
				if (parcelLength > 600 || parcelWidth > 600 || parcelHeight > 600) { 
					return true;
				} else {
					return false; // largest dimension 1000-1250
				}
			}
		} else {
			if (parcelLength > 800 || parcelWidth > 800 || parcelHeight > 800) { // only dimension 1000 x 700 x 750 can exceed 800
				if (parcelLength > 750 || parcelWidth > 750 || parcelHeight > 750) { 
					return true;
				} else {
					if (parcelLength > 700 || parcelWidth > 700 || parcelHeight > 700) { 
						return true;
					} else {
						return false; // largest dimension 800-1000
					}
				}
			} else {
				if (parcelLength > 750 || parcelWidth > 750 || parcelHeight > 750) { // only dimension 800 x 750 x 750 can exceed 750
					return true;
				} else {
					return false;
				}
			}
		}
	}
}

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
function launchEpod(){
    var epodlink = nlapiGetFieldValue('custbody_epodlink');
    window.open(epodlink);    
    return true;  
}//function launchEpod

function labelPrinter(){
	nlapiSetFieldValue('custbody_printonsubmit', 'T');
	document.getElementById('submitter').click();
} //function labelPrinter

function cancelconsignment(){
    var currentstatus = nlapiGetFieldValue('custbody_consignmentstatus');
    var currentID = nlapiGetRecordId();
    
    if (parseInt(currentstatus) > 2) {
        alert('This consignment has already been processed by NEP and cannot be cancelled.\nPlease contact NEP directly, thank you.');
    } //if
    else {
        var userconfirm = confirm('Sure you wish to cancel this consignment?\nClick OK to confirm cancellation.');
        if (userconfirm == true) window.location = nlapiResolveURL('SUITELET', 'customscript_cancelconsignment', 'customdeploy_cancelconsignmentdeploy') + "&custparam_id=" + currentID;
    } //else	
} //function

function convertconsignment(){
    var currentstatus = nlapiGetFieldValue('custbody_consignmentstatus');
    var currentID = nlapiGetRecordId();
    
    if (parseInt(currentstatus) > 2 && parseInt(currentstatus) != 11) {
        alert('This consignment has already been processed by NEP and cannot be converted automatically.\nPlease contact NEP directly, thank you.');
    } //if
    else {
        var userconfirm = confirm('Sure you wish to convert this consignment?\nThe process cannot be undone; the form will change to a pallet job, you should then amend service and/or pallet details as needed before submitting.\nClick OK to confirm conversion to proceed.');
        if (userconfirm == true) window.location = nlapiResolveURL('SUITELET', 'customscript_convertconsignment', 'customdeploy_convertconsignment') + "&custparam_id=" + currentID;
    } //else	
} //function

function confirmconsignment(){
    var currentstatus = nlapiGetFieldValue('custbody_consignmentstatus');
    if (currentstatus == '4') {
        alert('This consignment has already been cancelled and cannot be confirmed.');
    } //if
    else {
        var userconfirm = true;
        if (currentstatus == '2') 
            userconfirm = confirm('Are you sure you wish to confirm this consignment as the label is not printed?\nClick OK to confirm or Cancel.');
        
        if (userconfirm == true) {
            nlapiSetFieldValue('custbody_consignmentstatus', '3', false, false);
            nlapiSetFieldValue('custbody_printonsubmit', 'F', false, false);
            NLMultiButton_doAction('multibutton_submitter', 'submitter');
        } //if
    }
} //function

function convertquote(){
    // Converts any type 2 sales order to type 1
    //var orderid = request.getParameter('custparam_tranid');
    //var soRecord = nlapiLoadRecord('salesorder', orderid, {recordmode: 'dynamic'});
    var recType = nlapiGetFieldValue('custbody_ordertype');
    var userconfirm = confirm('Are you sure you wish to convert this consignment?');
    
    if (recType == '2') {
        nlapiSetFieldValue('custbody_ordertype', '1', false, false);
        var d = new Date();
        var tranDate = nlapiDateToString(d, 'date');
        nlapiSetFieldValue('trandate', tranDate, false, false);
        NLMultiButton_doAction('multibutton_submitter', 'submitter');
        return true;
    }
    else {
        return false;
    }
}

function getLocalDate(){
    var d = new Date();
    var hours = parseFloat(d.getHours() + (d.getTimezoneOffset() / 60));
    if ((d.getMonth() >= 3 && d.getMonth() < 10) || (d.getMonth() == 2 && d.getDate() > 27)) 
        hours += 1; //Daylight savings approximation!
    if (hours > 24) 
        d = nlapiAddDays(d, 1); // Tomorrow already
    return d;
}

function getNextWorkingDate(startdate){
	var d = new Date();
	if (!startdate) {
		d = getLocalDate();
	} else {
		d = startdate;
	}
    var adddays = 1; //Default, will be adjusted if Fri-Sat ...
    var dow = d.getDay(); //Day of week
    if (dow == 5 || dow == 6) 
        adddays = (8 - dow); //i.e. Monday
    d = nlapiAddDays(d, adddays);
    return d;
}

function getDateMessageLookupValue(name, messageDate){
    if (messageDate == null || messageDate == '') messageDate = getLocalDate();
    var result = messageDate;
    
    var messageColumns = new Array;
    var messageFilters = new Array;
    messageFilters[0] = new nlobjSearchFilter('custrecord_message_servicetype', null, 'anyof', (1));
    //messageFilters[1] = new nlobjSearchFilter('custrecord_message_startdate', null, 'onorafter', nlapiDateToString(messageDate));
    //messageFilters[2] = new nlobjSearchFilter('custrecord_message_enddate', null, 'onorbefore', nlapiDateToString(messageDate));
    //if (name != '')
    //	messageFilters[3] = new nlobjSearchFilter('name', null, 'is', name);
    
    messageColumns[0] = new nlobjSearchColumn('name');
    messageColumns[1] = new nlobjSearchColumn('custrecord_message_startdate');
    messageColumns[2] = new nlobjSearchColumn('custrecord_message_enddate');
    messageColumns[3] = new nlobjSearchColumn('custrecord_message_text_description');
    messageColumns[4] = new nlobjSearchColumn('custrecord_message_showeverytime');
    messageColumns[5] = new nlobjSearchColumn('custrecord_message_servicetype');
    

	var messageResults = nlapiSearchRecord(
			'customrecord_service_message_dates', null, messageFilters,
			messageColumns);
	if (messageResults) {
		for ( var msg = 0; msg < messageResults.length; msg++) {
			var startDate = nlapiStringToDate(messageResults[msg].getValue(messageColumns[1]));
			var endDate = nlapiStringToDate(messageResults[msg].getValue(messageColumns[2]));
			//alert (startDate + ' - ' + endDate);
			if (startDate.getTime() <= messageDate.getTime()
					 && endDate.getTime() >= messageDate.getTime()) {
				
				var theContext =  nlapiGetContext();
				//var  showMessage = theContext.getSessionObject('showmessagetype2');
				var  showMessage = messageResults[msg].getValue(messageColumns[4]);
				if (showMessage != 'T' && !isCustomerService()){
		            // get current customer
		            var currentCustomer = nlapiGetFieldValue('entity');
		            if (!currentCustomer)
		            	currentCustomer = 9999;
		            
		            // construct search		            
		            var checkconsSearchFilters = new Array();
		            var checkconsSearchColumns = new Array();
		            
		            checkconsSearchFilters[0] = new nlobjSearchFilter('entity', null, 'is', currentCustomer);
		            checkconsSearchFilters[1] = new nlobjSearchFilter('trandate', null, 'onorafter', messageResults[msg].getValue(messageColumns[1]));
		            checkconsSearchFilters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T');
		            checkconsSearchFilters[3] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', (1));
		            
		            checkconsSearchColumns[0] = new nlobjSearchColumn('tranid');
		            checkconsSearchColumns[1] = new nlobjSearchColumn('custbody_delname');
		            
		            var checkconsSearchResults = nlapiSearchRecord('salesorder', null, checkconsSearchFilters, checkconsSearchColumns);		            
		            // If search returns no results then show warning
		            if (!checkconsSearchResults) {
		            	//alert(currentCustomer);
		            	showMessage = 'T';
		            }
				}
				if( showMessage == null || showMessage == "" || showMessage == 'T'){
					//if (messageResults[msg].getValue(messageColumns[4]) == 'T')
					//	theContext.setSessionObject('showmessagetype2', 'T');
					alert(messageResults[msg].getValue(messageColumns[0])
						+ "\n\n"
						+ messageResults[msg].getValue(messageColumns[3]));
				}
				
				//alert(startDate.getDate() + '==' + messageDate.getDate() + '\n' + startDate.getMonth() + '==' + messageDate.getMonth() + '\n' + startDate.getFullYear() + '==' + messageDate.getFullYear());
				if (!(startDate.getDate() == messageDate.getDate() && startDate.getMonth() == messageDate.getMonth() && startDate.getFullYear() == messageDate.getFullYear())) {
					result = endDate;
				}
				
				break;
			}
		}
	}
    
    return result;
}


function isSaturdayService(theServiceID, theDateStr){
	var isAllowed = false;
	var currentItem = nlapiLoadRecord('serviceitem', theServiceID);
	var theDate = nlapiStringToDate(theDateStr)
	if (theDate != null && currentItem != null){
		if(currentItem.getFieldValue('custitem_saturdays') == 'T' && theDate.getDate() == 6) isAllowed = true;
		}
	return isAllowed;
}
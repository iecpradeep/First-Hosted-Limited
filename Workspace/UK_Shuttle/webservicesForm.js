function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) testMode = true; // 8 = TESTCOMPANY
    if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 873) 
        testMode = true; // 8 = TESTCOMPANY	
    return testMode;
}

function isCustomerService(){
    var isService = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 3 || theRole == 1003) 
        isService = true;
    return isService;
}

function getFormMatrixLookupValue(formId, colvalue, isText){
    var result = null;
    
    var formColumns = new Array;
    var formFilters = new Array;
    formFilters[0] = new nlobjSearchFilter('name', null, 'is', formId);
    formFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
    
    formColumns[0] = new nlobjSearchColumn('name');
    formColumns[1] = new nlobjSearchColumn(colvalue);
    
    var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
    if (formResults) {
        if (isText) {
            result = formResults[0].getText(formColumns[1]).toLowerCase();
        }
        else {
            result = formResults[0].getValue(formColumns[1]);
        }
        
        //alert("getFormMatrixLookupValue : " + formId + "," + colvalue + "," + isText + " ==> " + result.toLowerCase());
        return result;
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
    //alert(customForm = " " + theDeliveryID);
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

function onSave(type){
	//nlapiSetFieldValue('custbody_formchangeauto', 'F'); //Added June 2012 to allow imports form changing to work
   	//alert("custbody_formchangeauto = " + nlapiGetFieldValue('custbody_formchangeauto'));
	return true;
}

function onLoad(type){
	var deliveryType = getDeliveryType(nlapiGetFieldValue('class'),nlapiGetFieldValue('custbody_receivingdepot'));
	var shipType = nlapiGetFieldValue('custbody_palletparcel');
	var customForm = nlapiGetFieldValue('customform');
	var custID = nlapiGetFieldValue('entity');
    var custAPCDELIVERY = 815; // APCDELIVERY  'placeholder' customer
    var custTPNDELIVERY = 846; // TPNDELIVERY customer
	//alert ("CustID = " + custID + "/ " + customForm);	
    //alert(versionNo);   
	thisRecord = nlapiLoadRecord('salesorder', nlapiGetRecordId());
	//var changeAuto = 'T';
	//if (thisRecord.getFieldValue('custbody_formchangeauto') == 'T') changeAuto = 'F';
    var savedForm = thisRecord.getFieldValue('customform');
	var currentForm = nlapiGetFieldValue('customform');
	//alert ('currentForm = ' + currentForm);
    //alert("custbody_formchangeauto = " + thisRecord.getFieldValue('custbody_formchangeauto') + '\nParent=' + savedForm + '\nCurrent=' + nlapiGetFieldValue('customform'));
    var correctForm = savedForm; //Assume correct until checked
    
    if (type == 'edit' && customForm != 156) { // Form 156 has no code is wide open
        //Form change if customer services are viewing ...
        if (isCustomerService()) {
            //alert ('OnLoad START - Delivery Type : ' + deliveryType + ' Ship Type : ' + shipType);
            var formCols = new Array('custrecord_formservicetype', 'custrecord_formusertype', 'custrecord_formdeliverytype');
            var formVals = new Array(shipType, 2, 3);
            if (deliveryType == 'HT') {
                correctForm = getFormMatrixFormID(formCols, formVals);
            }
            else {
                if (deliveryType == 'TH') {
                    formVals[2] = 1;
                    correctForm = getFormMatrixFormID(formCols, formVals);
                }
                else { // Must be TT
                    formVals[2] = 2;
                    correctForm = getFormMatrixFormID(formCols, formVals)
                }
            }
        }
    }
    else {
        if ((custID == custAPCDELIVERY || custID == custTPNDELIVERY) && customForm == 141) {
            if (custID == custTPNDELIVERY) 
                correctForm = 137;
        }      
    }
    
    //nlapiSetFieldValue('custbody_formchangeauto', changeAuto);
    //var submitID = nlapiSubmitRecord(thisRecord, false, true);
    //alert('savedForm = ' + savedForm + ' / correctForm = ' + correctForm);
    if (correctForm != savedForm || correctForm != currentForm) {
         nlapiSetFieldValue('customform', correctForm, false, false);
    	//thisRecord.setFieldValue('customform', savedForm);
    }
	
    if (type == 'create') {
    	var formId = nlapiGetFieldValue('custbody_formid');
    	//alert("customForm=" + customForm + "\nformId=" + formId);
    
        //var defaultDriverrun = nlapiGetFieldValue('custbody_driverrun');
        nlapiSetFieldValue('custbody_driverrun', '1', false, false); // Unallocated by default
        //nlapiSetFieldValue('custbody_labeldimension', '4', false, false); // 4 x 8 single label by default
        
        var currentCustomer = nlapiGetFieldValue('entity');
        var currentCustomerName = nlapiGetFieldText('entity');
        
        //if (isTestUser()) alert(customForm + ":" + formId);
        var shipType = getFormShipType(formId);
        if (shipType == '') 
            shipType = getFormShipType(customForm);
        var orderType = getFormOrderType(formId);
        if (orderType == '') 
            orderType = getFormOrderType(customForm);
        var deliveryType = getFormDeliveryType(formId)
        if (deliveryType == '') 
            deliveryType = getFormDeliveryType(customForm);
        
        nlapiSetFieldValue('custbody_ordertype', '1', false, false);
        if (orderType == 'quotation') {
            nlapiSetFieldValue('custbody_ordertype', '2', false, false);
        } //if
        if (shipType == 'pallet') { // Same for quotations too
            nlapiSetFieldValue('custbody_palletparcel', '2', false, false);
            nlapiSelectNewLineItem('item');
            nlapiSetCurrentLineItemValue('item', 'item', 91); // ND internal id
            nlapiSetCurrentLineItemValue('item', 'custcol_totalweight_pallets', 0);
            nlapiSetCurrentLineItemValue('item', 'custcol_numberofpallets', 0);
            nlapiCommitLineItem('item');
            setSizeDefaults(1)
        }
    } //if
    return true;
}
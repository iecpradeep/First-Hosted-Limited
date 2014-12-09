/********************************************************
 * Form Button Control
 * Version 1.1.0
 * 14/02/11
 */
function disableButtons(type, form, request){
    var currentContext = nlapiGetContext();
    var role = currentContext.getRole();
    var mainMenu = false;
    
    if (request) {
        //if (isTestUser()) {
            if (request.getParameter('cf') != null && currentContext.getExecutionContext() == 'userinterface' && (type == 'create' || type == 'edit')) {
                var serviceType = getFormMatrixLookup(request.getParameter('cf'), 'custrecord_formservicetype', true);
                if (serviceType == 'pallet') {
					//File obj / getURL() doesn't work for Customer Center ...
					//var TsandCsFile = nlapiLoadFile('Customer Center Documents/APC_ConditionsofCarriage.pdf');
					//var DimensionsFile = nlapiLoadFile('Customer Center Documents/pallet dimension guide.pdf');
					var pdfbtn = form.addButton('custpage_palletguide', 'Pallet Dimensions + Weight Guide', "window.open('https://system.netsuite.com/core/media/media.nl?id=32&c=1169462&h=efe11c9bd1a04db91fd9&_xt=.pdf','_blank')");
					var cocbtn = form.addButton('custpage_conditions', 'Conditions of Carriage', "window.open('https://system.netsuite.com/core/media/media.nl?id=30785&c=1169462&h=985fe3c9c8ea7b704ec6&_xt=.pdf','_blank')");
				}
                if (serviceType == 'parcel') {
					var cocbtn = form.addButton('custpage_conditions', 'Conditions of Carriage', "window.open('https://system.netsuite.com/core/media/media.nl?id=30784&c=1169462&h=a52a3a7c874217bd8b77&_xt=.pdf','_blank')");
				}
            }
            //alert('request.getParameter("menu"):' + request.getParameter('menu'));
            if (request.getParameter('menu') == 'T')
            	 mainMenu = true;
        //}
    }
    
    var formID = nlapiGetField('customform');
	var shipType = getFormShipType(formID);

    if (type == 'create' && currentContext.getExecutionContext() == 'userinterface') {
        //if (request.getParameter('dt') == 'F') alert('Please Note: Any consignments added now will be included in next working day\'s jobs. Thank you.');
        if (request.getParameter('dt') == 'F') {
            form.setTitle('IMPORTANT : Consignments added now included in next working day\'s jobs')
            //form.addField('custpage_datealert','label','IMPORTANT : Please Note: Any consignments added now will be included in tomorrow\'s jobs. Thank you.').setLayoutType('startrow');
            //form.setFieldValues({ custpage_datealert:request.getParameter('dt') });
            //var alertfield = nlapiGetField('custpage_datealert');
            //alertfield.setDefaultValue(request.getParameter('dt'));			
        }
		//Get handle to new record
		var custRec = nlapiGetNewRecord();
		var orderType = custRec.getFieldValue('custbody_ordertype');
		nlapiSetFieldValue('otherrefnum', shipType);
		
		if ((orderType == '1' || orderType == '2') && shipType != 'other') {
			//Get the button before relabeling or disabling
			var epodButton = form.getButton('custformbutton0');
			var printButton = form.getButton('custformbutton1')
			var subprintButton = form.getButton('print');
			var saveprintButton = form.getButton('saveprint');
			var copyButton = form.getButton('autofill');
			var submitButton = form.getButton('submitter');
			
			//Disable the button in the UI
			if (epodButton) 
				epodButton.setDisabled(true);
			if (printButton && !isTestUser()) 
				printButton.setDisabled(true);
			if (subprintButton) 
				subprintButton.setDisabled(true);
			if (saveprintButton) 
				saveprintButton.setDisabled(true);
			if (copyButton) 
				copyButton.setDisabled(true);
			if (submitButton && isTestUser()) 
				submitButton.setLabel('Save Consignment');
			
			form.addButton('custpage_saveandnew', 'Save & New Consignment', "saveNew()");
			
			var totalfield = nlapiGetField('total');
			if (totalfield) 
				totalfield.setDisplayType('hidden');
			var subtotalfield = nlapiGetField('subtotal');
			if (totalfield) 
				subtotalfield.setDisplayType('hidden');
			var itemtotal = nlapiGetField('item_total');
			if (itemtotal) 
				itemtotal.setDisplayType('hidden');
						
			//if (request.getParameter('dt') == 'F') custRec.setFieldValue('trandate', null);
			
			//Get form parameter if present
			var customform = request.getParameter('cf');
			//set form id
			custRec.setFieldValue('custbody_formid', customform);
			
			//var consignmentType = getFormMatrixLookup(customform, 'custrecord_formservicetype', false);
			var consignmentType = custRec.getFieldValue('custbody_palletparcel');
			
			form.addButton('custpage_back', 'Consignment Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1') + "','_self')");
			form.addPageLink('breadcrumb', 'Consignment Manager ...', nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1'));
			//if (isTestUser()) form.addField('custpage_printonsubmit','checkbox','Print Label after Submitting');
			
			if (consignmentType == 1) 
				form.addButton('custpage_palletguide', 'Pallet Dimensions + Weight Guide', "window.open('https://system.netsuite.com/core/media/media.nl?id=32&c=1169462&h=efe11c9bd1a04db91fd9&_xt=.pdf','_self')");
			
			//if (consignmentType == 2) 
			//	form.addButton('custpage_parcelguide', 'APC Parcel Services Guide', "window.open('https://system.netsuite.com/core/media/media.nl?id=57305&c=1169462&h=32f691acc3006a531e3a&_xt=.pdf','_self')");
			
			if (!isCustomerCenter()) {
				var cleardtParam = '&custparam_ignoredates=Y';
				form.addButton('custpage_backtransport', 'Transport Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam + "','_self')");
				form.addPageLink('breadcrumb', 'Transport Manager ...', nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam);
			}
			else {
		        if (mainMenu){
		           form.addButton('custpage_mainmenu', 'Main Menu', "window.open('" + nlapiResolveURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login') + "','_self')");
		        }

				if (orderType == '1') {
					form.setFieldValues({
						custbody_printonsubmit: 'F'
					});
				}
				else {
					form.setFieldValues({
						custbody_printonsubmit: 'F'
					});
				}
			}
		}
    } //if
    if (type == 'view' && currentContext.getExecutionContext() == 'userinterface') {
        //Get the button before relabeling or disabling
        var printButton = form.getButton('custformbutton1')
        var subprintButton = form.getButton('print');
        
        //Disable the button in the UI
        if (printButton) 
            printButton.setDisabled(true);
        if (subprintButton) 
            subprintButton.setDisabled(true);
        
        var totalfield = nlapiGetField('total');
        if (totalfield) 
            totalfield.setDisplayType('hidden');
        var subtotalfield = nlapiGetField('subtotal');
        if (totalfield) 
            subtotalfield.setDisplayType('hidden');
        var itemtotal = nlapiGetField('item_total');
        if (itemtotal) 
            itemtotal.setDisplayType('hidden');
        
        //Get handle to new record
        var custRec = nlapiGetNewRecord();
        
        //Get form parameter if present
        var customform = request.getParameter('cf');
        
        //set form id
        custRec.setFieldValue('custbody_formid', customform);
        form.addButton('custpage_back', 'Consignment Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1') + "','_self')");
        form.addPageLink('breadcrumb', 'Consignment Manager ...', nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1'));
               
        if (!isCustomerCenter()) {
            if (custRec.getFieldValue('custbody_consignmentstatus') != '3') 
                form.addButton('custpage_confirmconsignment', 'Confirm Consignment', 'confirmconsignment()');
            var cleardtParam = '&custparam_ignoredates=Y';
            form.addButton('custpage_backtransport', 'Transport Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam + "','_self')");
            form.addPageLink('breadcrumb', 'Transport Manager ...', nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam);
        }
        else {
            if (mainMenu){
            	form.addButton('custpage_mainmenu', 'Main Menu', "window.open('" + nlapiResolveURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login') + "','_self')");
            }
        }
        
    } //if	
    if (type == 'edit' && currentContext.getExecutionContext() == 'userinterface') {
        //Get the button before relabeling or disabling
        var printButton = form.getButton('custformbutton1')
        var subprintButton = form.getButton('print');
        
        //Disable the button in the UI
        if (printButton) 
            printButton.setDisabled(true);
        if (subprintButton) 
            subprintButton.setDisabled(true);
        
        var totalfield = nlapiGetField('total');
        if (totalfield) 
            totalfield.setDisplayType('hidden');
        var subtotalfield = nlapiGetField('subtotal');
        if (totalfield) 
            subtotalfield.setDisplayType('hidden');
        var itemtotal = nlapiGetField('item_total');
        if (itemtotal) 
            itemtotal.setDisplayType('hidden');
        
        //Get handle to new record
        var custRec = nlapiGetNewRecord();
		var soRecordID = custRec.getFieldValue('internalid');

        form.addButton('custpage_saveandnew', 'Save & New Consignment', "saveNew()");
		        
        //Get form parameter if present
        var customform = request.getParameter('cf');
        if (custRec.getFieldValue('custbody_ordertype') == '2') 
            form.addButton('custpage_convertconsignment', 'Convert to Consignment', 'convertQuotation()');
        
        //set form id
        custRec.setFieldValue('custbody_formid', customform);
        form.addButton('custpage_back', 'Consignment Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1') + "','_self')");
        form.addPageLink('breadcrumb', 'Consignment Manager ...', nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1'));
        
        if (custRec.getFieldValue('custbody_consignmentstatus') != '4') 
            form.addButton('custpage_cancelconsignment', 'Cancel Consignment', 'cancelconsignment()');
        //form.addButton('custpage_submitandprint', 'Print Label & Save', 'labelPrinter()');
        if (custRec.getFieldValue('custbody_palletparcel') == '1') 
             form.addButton('custpage_convertconsignment', 'Convert Parcel => Pallet Consignment', 'convertconsignment()');
                
        if (!isCustomerCenter()) {
            if (custRec.getFieldValue('custbody_consignmentstatus') != '3') 
                form.addButton('custpage_confirmconsignment', 'Confirm Consignment', 'confirmconsignment()');
            if (!isCustomerCenter()) {
                var cleardtParam = '&custparam_ignoredates=Y';
                form.addButton('custpage_backtransport', 'Transport Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam + "','_self')");
                form.addPageLink('breadcrumb', 'Transport Manager ...', nlapiResolveURL('SUITELET', 'customscript_transportmanager', 'customdeploy_transportmanager') + cleardtParam);
            }
        } else {
	        if (mainMenu){
		        form.addButton('custpage_mainmenu', 'Main Menu', "window.open('" + nlapiResolveURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login') + "','_self')");
		    }
        }
        
    } //if	
} //function

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    //if (nlapiGetContext().getRole() != '1001' || parseInt(nlapiGetContext().getUser()) == 8) testMode = true; // 8 = TESTCOMPANY
    if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 873) 
        testMode = true; // 8 = TESTCOMPANY	
    return testMode;
}

function getFormMatrixLookup(formId, colvalue, isText){
    var result = null;
    
    if (formId != null) {
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
                result = formResults[0].getText(formColumns[1]).toLowerCase();
            }
            else {
                result = formResults[0].getValue(formColumns[1]);
            }
        }
    }
    return result;
}

function getFormShipType(customForm){
    return getFormMatrixLookup(customForm, 'custrecord_formservicetype', true);
}

function isCustomerCenter(){
    var isCenter = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 14 || theRole == 1002|| theRole == 1001 || theRole == 1005 || theRole == 1006 || theRole == 1007 || theRole == 1008 || theRole == 1015) 
        isCenter = true;
    return isCenter;
}


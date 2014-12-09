function consignmentManager(request, response){

    var maxRowsAllowed = 2000;
    
    var theContext = nlapiGetContext();
    var thisCMscript = theContext.getScriptId();
    var thisCMdeployment = theContext.getDeploymentId();
    var thisCMscriptNo = "46";
    var versionParam = "&version=1";
    
    var thisTMscript = 'customscript_transportmanager';
    var thisTMdeployment = 'customdeploy_transportmanager';
    var thisTMscriptNo = "15";
    
    // Alternate version
    if (thisCMscript == 'customscript_consignmentmanager_v2') {
        versionParam = "&version=2";
        thisTMscript = 'customscript_transportmanagerv2';
        thisTMdeployment = 'customdeploy_transportmanagerv2';
        thisCMscriptNo = "45";
        thisTMscriptNo = "14";
    }
    
    // Added Jan 2013 to support form mapping
    var formLookup = new Array();
    
    var form = nlapiCreateForm('Consignment Manager (v3.1g - UKS)');
    if (request.getParameter('custparam_ct') != '' && request.getParameter('custparam_ct') != null) 
        form.setTitle('Consignment Manager - ' + request.getParameter('custparam_ct'));
    
    //Search / user mode and field populating
    var useAdvancedSearch = isAdvancedSearch();
    var useCustomerService = isCustomerService();
    var useTransport = isTransport();
    var noConsignmemnts = false;
    var useColorStatus = false;
    var mainMenu = false;
    //Search parameter defaults
    var paramNo = 0;
    var custID = 0;
    var custName = '';
    var custRef = '';
	var custRefLookup = '';
    var consignmentNo = '';
    var postCode = '';
    var deliveryName = '';
    var ignoredates = 'F';
    var driverRun = 0;
	var consignmentType = '';
	var extdocref = '';
	var service = '';
	var serviceType = '';
    
    var theContext = nlapiGetContext();
    var user = theContext.getUser();
    var role = theContext.getRole();
    
    var searchParams = ''; //Used to build URL to carry search parameters

    if (request.getParameter('ct') != '' && request.getParameter('ct') != null) {
        consignmentType = request.getParameter('ct');
        paramNo++;
    }
 
    if (request.getParameter('custparam_custname') != '' && request.getParameter('custparam_custname') != null) {
        custName = request.getParameter('custparam_custname');
        paramNo++;
    }
    
    if (request.getParameter('custparam_custref') != '' && request.getParameter('custparam_custref') != null) {
        custRef = request.getParameter('custparam_custref');
        paramNo++;
    }
    
    if (request.getParameter('custparam_consno') != '' && request.getParameter('custparam_consno') != null) {
        consignmentNo = request.getParameter('custparam_consno');
        paramNo++;
    }
    
    if (request.getParameter('custparam_postcode') != '' && request.getParameter('custparam_postcode') != null) {
        postCode = request.getParameter('custparam_postcode');
        paramNo++;
    }
    
    if (request.getParameter('custparam_delname') != '' && request.getParameter('custparam_delname') != null) {
        deliveryName = request.getParameter('custparam_delname');
        paramNo++;
    }
    
    if (request.getParameter('custparam_dr') != '' && request.getParameter('custparam_dr') != null) {
        driverRun = request.getParameter('custparam_dr');
        paramNo++;
    }
    
    if (request.getParameter('custparam_extdocref') != '' && request.getParameter('custparam_extdocref') != null) {
        extdocref = request.getParameter('custparam_extdocref');
        paramNo++;
    }
      
    if (request.getParameter('custparam_service') != '' && request.getParameter('custparam_service') != null) {
        service = request.getParameter('custparam_service');
        paramNo++;
    }
    else {
        if (request.getParameter('custpage_servicefield') != '' && request.getParameter('custpage_servicefield') != null) {
            service = request.getParameter('custpage_servicefield');
            paramNo++;
        }
    }
    
    if (request.getParameter('ct') != '' && request.getParameter('ct') != null) {
    	consignmentType = request.getParameter('ct');
        paramNo++;
    }
    else {
        if (request.getParameter('custpage_servicetypefield') != '' && request.getParameter('custpage_servicetypefield') != null) {
            consignmentType = request.getParameter('custpage_servicetypefield');
            paramNo++;
        }
    }

   	var dateselect = '';
    var dateFromselect = '';
    var dtParam = '';
    var showFutureDates = false;
    var drParam = '';
    
    // Date to ...
    if (request.getParameter('custparam_dt') != '' && request.getParameter('custparam_dt') != null) {
        dateselect = request.getParameter('custparam_dt');
        paramNo++;
    }
    if (dateselect == '' && (request.getParameter('custpage_datefield') != '' && request.getParameter('custpage_datefield') != null)) {
        dateselect = request.getParameter('custpage_datefield');
        paramNo++;
    }
    
    //if ((dateselect == '' && !useAdvancedSearch) || paramNo== 0) {
    if (dateselect == '') {
        dateselect = nlapiDateToString(getLocalDate(), 'date');
        showFutureDates = true;
    }
    
    // Date from ...	
    //dateField.setLabel('To Consignment Date');
    if (request.getParameter('custpage_selectdatefrom') != '' && request.getParameter('custpage_selectdatefrom') != null) {
        dateFromselect = request.getParameter('custpage_selectdatefrom');
        paramNo++;
    }
    //selectdatefromField.setDefaultValue(dateFromselect);
    
    if (request.getParameter('custparam_dtfrom') != '' && request.getParameter('custparam_dtfrom') != null) {
        dateFromselect = request.getParameter('custparam_dtfrom');
        paramNo++;
    }
    if (dateFromselect == '' && (request.getParameter('custpage_selectdatefrom') != '' && request.getParameter('custpage_selectdatefrom') != null)) {
        dateFromselect = request.getParameter('custpage_selectdatefrom');
        paramNo++;
    }
    
    //if ((dateFromselect == '' && !useAdvancedSearch) || paramNo== 0) {
    if (dateFromselect == '') {
    	var localDate = getLocalDate();
    	if ((useCustomerService))
    		localDate = nlapiAddDays(localDate, -1);
        dateFromselect = nlapiDateToString(localDate, 'date');
        //showFutureDates = true;
    }
    
    if (useCustomerService && paramNo == 0) 
        ignoredates = 'T';
    	//ignoredates = 'F';
    if ((request.getParameter('custpage_ignoredates') == 'T' || request.getParameter('custpage_ignoredates') == null) || (request.getParameter('custparam_ignoredates') == 'T' || request.getParameter('custparam_ignoredates') == null)) {
        if (request.getParameter('custpage_ignoredates') == 'T' || request.getParameter('custparam_ignoredates') == 'T') {
            ignoredates = 'T';
        }
        else {
            if (request.getParameter('custpage_datefield') != '' && request.getParameter('custpage_datefield') != null) 
                ignoredates = 'F';
        }
        paramNo++;
    }
    
    var custAPCDELIVERY = 815; // APCDELIVERY  'placeholder' customer
    var custTPNDELIVERY = 846; // TPNDELIVERY customer
    if (request.getParameter('custparam_cn') != null) {
        custID = request.getParameter('custparam_cn');
        paramNo++;
    }
    if (custID == 0 && request.getParameter('entityid') != null) {
        custID = request.getParameter('entityid');
        paramNo++;
    }
    
    var isDeliveryMode = false;
    var deliveryManifestScript = '';
    if (custID == custAPCDELIVERY || custID == custTPNDELIVERY) {
        isDeliveryMode = true;
    }
    
    var selectdatefromField = form.addField('custpage_selectdatefrom', 'date', 'From Consignment Date');
    if (dateFromselect != '' && dateFromselect != null) {
        selectdatefromField.setDefaultValue(dateFromselect);
        dtParam += '&custparam_dtfrom=' + dateFromselect;
    }
    
    var dateField = form.addField('custpage_datefield', 'date', 'To Consignment Date');
    if (dateselect != '' && dateselect != null) {
        dateField.setDefaultValue(dateselect);
		if (isDeliveryMode){
			deliveryDate = nlapiStringToDate(dateselect);
			var daystoadd = 1;
			if (deliveryDate.getDay() >= 5) 
				daystoadd = 8-deliveryDate.getDay(); // Is Friday-Sunday
			dateselect = nlapiDateToString(nlapiAddDays(deliveryDate, daystoadd));
		}
        dtParam += '&custparam_dt=' + dateselect;
    }
    
    var ignoredatesbox = form.addField('custpage_ignoredates', 'checkbox', 'Ignore Dates (search all consignments)');
    if (ignoredates != '' && ignoredates != null) {
        ignoredatesbox.setDefaultValue(ignoredates);
        dtParam += '&custparam_ignoredates=' + ignoredates;
    }
    
    if (request.getParameter('custpage_customerfield') != null) {
        custName = request.getParameter('custpage_customerfield');
        paramNo++;
    }
    else {
        if (request.getParameter('custparam_ct') != null) {
            custName = request.getParameter('custparam_ct');
            paramNo++;
        }
    }
	
    //Pagination - added October 2011
    var pageOffset = 0;
    if (request.getParameter('custparam_po') != null) 
        pageOffset = parseInt(request.getParameter('custparam_po'));
    var rowsPerPage = 40;
    var rowStart = parseInt((pageOffset) * rowsPerPage);
    var rowEnd = parseInt((pageOffset + 1) * rowsPerPage);
    var rowLimit = parseInt((pageOffset + 1) * rowsPerPage);
    
    if (useCustomerService) {
    
        var customerField = form.addField('custpage_customerfield', 'text', 'Customer Name');
        if (custName != '' && custName != null) {
            customerField.setDefaultValue(custName);
            paramNo++;
        }
        if (custName != '') {
            searchParams += '&custparam_custname=' + custName;
        }
        
        var customerSelectField = form.addField('entityid', 'select', 'Account Ref.', 'customer');
        if (custID > 0) {
            customerSelectField.setDefaultValue(custID);
            searchParams += '&entityid=' + custID;
        }
		
        var extdocrefField = form.addField('custpage_extdocreffield', 'text', 'APC/TPN Cons#');
        if (request.getParameter('custpage_extdocreffield') != '' && request.getParameter('custpage_extdocreffield') != null) {
            extdocref = request.getParameter('custpage_extdocreffield');
            paramNo++;
        }
        if (extdocref != '') {
            extdocrefField.setDefaultValue(extdocref);
            searchParams += '&custparam_extdocref=' + extdocref;
        } 
		      
        var serviceField = form.addField('custpage_servicefield', 'select', 'Service (e.g. ND16)', 'item');
        if (service != '' && service != null) {
            serviceField.setDefaultValue(service);
            paramNo++;
        }
        if (service != '') {
            searchParams += '&custparam_service=' + service;
        }
        
        var serviceTypeField = form.addField('custpage_servicetypefield', 'select', 'Service Type (pallet/parcel)', 'customlist_servicetype');
        if (consignmentType != '' && consignmentType != null) {
            serviceTypeField.setDefaultValue(consignmentType);
            paramNo++;
        }
        if (consignmentType != '') {
            searchParams += '&ct=' + consignmentType;
        }
        
		//if (isDeliveryMode) {
			var driverRunField = form.addField('custpage_driverrun', 'select', 'Driver Run', 'customrecord_driverrun');
			if (request.getParameter('custpage_driverrun') != '' && request.getParameter('custpage_driverrun') != null) {
				driverRun = request.getParameter('custpage_driverrun');
				paramNo++;
			}
			if (parseInt(driverRun) > 0) {
				driverRunField.setDefaultValue(driverRun);
				searchParams += '&custparam_dr=' + driverRun;
			}
		//}
    }
    
    if (useAdvancedSearch) {
        var customertheirrefField = form.addField('custpage_customertheirref', 'text', 'Customer Ref.');
        // var customertheirrefField = form.addField('custpage_customertheirref', 'select', 'Customer Ref.', 'customrecord_reference_lookup');
        if (request.getParameter('custpage_customertheirref') != '' && request.getParameter('custpage_customertheirref') != null) {
            custRef = request.getParameter('custpage_customertheirref');
            paramNo++;
        }
        if (custRef != '') {
            customertheirrefField.setDefaultValue(custRef);
            searchParams += '&custparam_custref=' + custRef;
            //custRefLookup = nlapiLookupField('customrecord_reference_lookup', custRef, 'name', true);
            custRefLookup = custRef;
        }
        
		var NSConsTitle = 'Consignment No.';
		if (useCustomerService) NSConsTitle = 'NetSuite Cons#';
        var consignmentNoField = form.addField('custpage_consignmentno', 'text', NSConsTitle);
        if (request.getParameter('custpage_consignmentno') != '' && request.getParameter('custpage_consignmentno') != null) {
            consignmentNo = request.getParameter('custpage_consignmentno');
            paramNo++;
        }
        if (consignmentNo != '') {
            consignmentNoField.setDefaultValue(consignmentNo);
            searchParams += '&custparam_consno=' + consignmentNo;
        }
        
        var postcodeField = form.addField('custpage_postcodefield', 'text', 'Delivery Postcode');
        if (request.getParameter('custpage_postcodefield') != '' && request.getParameter('custpage_postcodefield') != null) {
            postCode = request.getParameter('custpage_postcodefield');
            paramNo++;
        }
        if (postCode != '') {
            postcodeField.setDefaultValue(postCode);
            searchParams += '&custparam_postcode=' + postCode;
        }
        
        var deliverynameField = form.addField('custpage_deliverynamefield', 'text', 'Delivery Customer (Consignee)');
        if (request.getParameter('custpage_deliverynamefield') != '' && request.getParameter('custpage_deliverynamefield') != null) {
            deliveryName = request.getParameter('custpage_deliverynamefield');
            paramNo++;
        }
        if (deliveryName != '') {
            deliverynameField.setDefaultValue(deliveryName);
            searchParams += '&custparam_delname=' + deliveryName;
        }
        
    }
    
	theContext.setSessionObject('cm_Params', versionParam + searchParams + '&custparam_manifestdate=' + dtParam + "&custparam_cm=Y");
	
    // Show all consignments
    var showallconsignments = request.getParameter('custpage_selectall');
    if (showallconsignments == 'T') {
        selectall.setDefaultValue('T');
    }
    
    //if (isCustomerCenter() && paramNo == 0) { // First load as no parameters
    if (isCustomerCenter()) { // First login as t=xxxx parameter present
        var custRecord = nlapiLoadRecord('customer', user);
        if (request.getParameter('t') != null && request.getParameter('t') != '') { // First login as t=xxxx parameter present        
        	if (custRecord.getFieldValue('custentity_emptyconsignmentmanager') == 'T')
        		noConsignmemnts = true;
        }
		if (custRecord.getFieldValue('custentity_use_login_menu') == 'T')
			mainMenu = true;
    }
    
    // LDL or not customer center use colour status on print
    if (user == 1278 || user == 422 || isTestUser() || !(isCustomerCenter()))
        useColorStatus = true;
    
    var printManifestURL = nlapiResolveURL('SUITELET', 'customscript_printmanifest', 'customdeploy_printmanifest') + versionParam + dtParam + '&custparam_manifestdate=' + dateselect + '&custparam_showall=' + showallconsignments + '&custparam_cn='  + custID;
    var printManifestPalletURL = nlapiResolveURL('SUITELET', 'customscript_printmanifestpallets', 'customdeploy_printmanifestpallets_deploy') + versionParam + dtParam + '&custparam_manifestdate=' + dateselect + '&custparam_showall=' + showallconsignments + '&custparam_cn='  + custID;
    
    if (useAdvancedSearch) {
        form.addSubmitButton('Search');
        //form.addResetButton('Clear Search');
		var cleardtParam = '&custparam_ignoredates=Y';
    	form.addButton('custpage_clearsearch', 'Clear Search', "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + cleardtParam + "','_self')");
    }
    else {
        form.addSubmitButton('Refresh');
    }
    
    if (isCustomerCenter()) {
        form.addButton('custpage_enterconsignment', 'Enter Consignment', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_formselector', 'customdeploy_formselector') + versionParam + "','_self')");
        form.addButton('custpage_enterquotation', 'Enter Quotation', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_formselectorquotations', 'customdeploy1') + versionParam + "','_self')");
        if (isTestUser()){
        	form.addButton('custpage_quickquote', 'Quick Quote', "window.open('" + nlapiResolveURL('SUITELET','customscript_quotations_v2', 'customdeploy_quotations_v2') + "','_self')");
        }
        if (mainMenu){
        	form.addButton('custpage_mainmenu', 'Main Menu', "window.open('" + nlapiResolveURL('SUITELET','customscript_customercenter_login', 'customdeploy_customercenter_login') + "','_self')");
        }
        form.addButton('custpage_printmanifest', 'Print Manifest - Parcels', "window.open('" + printManifestURL + "')");
        form.addButton('custpage_printmanifestpallets', 'Print Manifest - Pallets', "window.open('" + printManifestPalletURL + "')");
        form.addButton('custpage_historyreport', 'Last 30 Days Report', "window.open('../../../app/common/search/searchresults.nl?searchid=410&saverun=T&whence=','_blank')");
    }
    else {
        //form.addPageLink('breadcrumb', 'Enter Consignment ...', 'https://system.netsuite.com/app/accounting/transactions/salesord.nl?whence=');
        form.addButton('custpage_enterconsignment', 'Enter Consignment', "window.open('../../../app/accounting/transactions/salesord.nl?whence=','_self')");
        form.addButton('custpage_quickquote', 'Quick Quote', "window.open('" + nlapiResolveURL('SUITELET','customscript_quotations_v2', 'customdeploy_quotations_v2') + "','_self')");
        form.addButton('custpage_backtransport', 'Transport Manager', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + "','_self')");
        if (role == 3) 
            form.addButton('custpage_backinvoicing', 'Invoicing Manager', "window.open('" + nlapiResolveURL('SUITELET', 'customscript_consolidatedconsignments', 'customdeploy_consolidatedconsigndeploy1') + versionParam + dtParam + "','_self')");
        form.addPageLink('breadcrumb', 'Transport Manager ...', nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam);
        if (role == 3) 
            form.addPageLink('breadcrumb', 'Invoicing Manager ...', nlapiResolveURL('SUITELET', 'customscript_consolidatedconsignments', 'customdeploy_consolidatedconsigndeploy1') + versionParam + dtParam);
    }
    
    var sublist = form.addSubList('sublist', 'list', 'Consignments');
    
    sublist.addField('custpage_col_seqno', 'integer', 'No.');
    sublist.addField('custpage_col_select', 'checkbox', 'Select');
    sublist.addField('custpage_col_edit', 'text', 'Edit');
    if (isDeliveryMode) {
        sublist.addField('custpage_col_deliveryseqno', 'select', 'Delivery No.', 'customrecord_deliveryseqno');
        sublist.addField('custpage_col_collectingdepot', 'text', 'Col');
    }
    else {
        sublist.addField('custpage_col_print', 'text', 'Print');
    }
    
	if (useCustomerService){
		if (!isDeliveryMode) sublist.addField('custpage_col_collectingdepot', 'text', 'Col');
        sublist.addField('custpage_col_receivingdepot', 'text', 'Del');		
        sublist.addField('custpage_col_requestingdepot', 'text', 'Req');
	}
	
    if (isCustomerCenter()) { //Filter to just this user company if Cust Center
        sublist.addField('custpage_col_epod', 'text', 'EPOD');
    }
    else {
        if (useTransport || isDeliveryMode) {
            sublist.addField('custpage_col_driver', 'select', 'Driver', 'customrecord_driverrun');
            //sublist.addField('custpage_col_allocate', 'text', 'Allocate');
        }
        else {
            sublist.addField('custpage_col_epod', 'text', 'EPOD');
            sublist.addField('custpage_col_driver', 'text', 'Driver');
        }
    }
    
    var StatusColName = 'Status';
    if (isCustomerService()) 
        StatusColName += ' | EPOD';
    sublist.addField('custpage_col_status', 'text', StatusColName);
    var DateColName = 'Created / Updated';
    if (isDeliveryMode) 
        DateColName = 'ETA / ATA';
    sublist.addField('custpage_col_date', 'text', DateColName);
    sublist.addField('custpage_col_consignment', 'text', 'Consignment No.');
    sublist.addField('custpage_col_trandate', 'text', 'Consignment Date');
    sublist.addField('custpage_col_service', 'text', 'Service');
    if (isDeliveryMode) 
        sublist.addField('custpage_col_dedicateddate', 'text', 'DD Date');
    var CustomerColName = 'Customer Ref.';
    if (isCustomerService()) 
        CustomerColName = 'Customer';
    //if (isCustomerService())
    sublist.addField('custpage_col_customer', 'text', CustomerColName);
    sublist.addField('custpage_col_consignee', 'text', 'Consignee');
    sublist.addField('custpage_col_town', 'text', 'Town / County');
    sublist.addField('custpage_col_postcode', 'text', 'Postcode');
    //sublist.addField('custpage_col_parcels', 'text', 'Qty');
    sublist.addField('custpage_col_parcels', 'select', 'Qty', 'customlist_consignment_weights');
    sublist.addField('custpage_col_type', 'text', 'Type');
    sublist.addField('custpage_col_weight', 'text', 'Weight (kg)');
    
    var consignmentColumns = new Array;
    var consignmentFilters = new Array;
    
    consignmentFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
    consignmentFilters[1] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', '1');
    var n = 2; // remaining filters are variant / conditional
    /*
    if (!isDeliveryMode) {
        consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'noneof', custAPCDELIVERY);
        n++;
        consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'noneof', custTPNDELIVERY);
        n++;
    }
    */
    
    var currentCustomer = '';
    var currentDriverRun = '';
    var entityList = new Array();
    if (isCustomerCenter()) { //Filter to just this user company if Cust Center
        entityList[0] = user;
        currentCustomer = user;
        consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'anyof', entityList);
        //consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'is', user);
        n++;
    }
    else {
        if (custID != 0) { // Use parameter input by URL
            //consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'is', request.getParameter('custparam_cn'));
            //currentCustomer = request.getParameter('custparam_cn');
            entityList[0] = custID;
        }
        else {
            if (custName != '') { //Search for customer(s) and get the entity(s) first
                var customerColumns = new Array;
                var customerFilters = new Array;
                customerFilters[0] = new nlobjSearchFilter('entityid', null, 'contains', custName);
                customerFilters[1] = new nlobjSearchFilter('companyname', null, 'contains', custName);
                customerColumns[0] = new nlobjSearchColumn('internalid');
                var customerResults = nlapiSearchRecord('customer', null, customerFilters, customerColumns);
                if (customerResults) {
                    //consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'is', customerResults[0].getValue(customerColumns[0]));
                    //currentCustomer = customerResults[0].getValue(customerColumns[0]);
                    //n++;
                    for (c = 0; c < customerResults.length; c++) 
                        entityList[c] = customerResults[c].getValue(customerColumns[0]);
                    currentCustomer = entityList[0];
                }
            }
        }
        if (entityList.length > 0) {
            consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'anyof', entityList);
            n++;
        }
        else { // Will show all customers except any filtered out below ...
        	/*
            consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'noneof', custAPCDELIVERY);
            n++;
            consignmentFilters[n] = new nlobjSearchFilter('entity', null, 'noneof', custTPNDELIVERY);
            n++;
            */
        }
    }
    
    if (custRef != '' && custRef != null) {
        var refnoList = new Array();
    	var lookuprefColumns = new Array;
        var lookuprefFilters = new Array;
        lookuprefFilters[0] = new nlobjSearchFilter('name', null, 'contains', custRef);
        if (entityList.length > 0 || isCustomerCenter())
        	lookuprefFilters[1] = new nlobjSearchFilter('custrecord_refno_customer_lookup', null, 'anyof', entityList);
        lookuprefColumns[0] = new nlobjSearchColumn('custrecord_consignment_refno_lookup');
        var lookuprefResults = nlapiSearchRecord('customrecord_reference_lookup', null, lookuprefFilters, lookuprefColumns);
        if (lookuprefResults) {
            for (c = 0; c < lookuprefResults.length; c++) 
                refnoList[c] = lookuprefResults[c].getValue(lookuprefColumns[0]);
            consignmentFilters[n] = new nlobjSearchFilter('internalid', null, 'anyof', refnoList);
        } else {
    		consignmentFilters[n] = new nlobjSearchFilter('custbody_otherrefnum', null, 'contains', custRef);
        }
		n++;
    }
    
    if (extdocref != '' && extdocref != null) {
		var docRefs = extdocref.split(',');
		var refNums = parseInt(docRefs.length);
		var allExtIDs = new Array();
		var theExtIDs = 'APC,TPN01,TPN02,LOCAL,APCINV,TPN01INV,TPN02INV,LOCALINV,APCDEL,TPN01DEL,LDL'.split(',');
		var extNums = parseInt(theExtIDs.length);
		for (var d = 0; d < refNums; d++) {
			for (var e = 0; e < extNums; e++) {
				allExtIDs[(d*refNums)+e] = theExtIDs[e] + ':' + docRefs[d];
			}
		}
		consignmentFilters[n] = new nlobjSearchFilter('externalid', null, 'anyof', allExtIDs.join().split(',')); //Required to fix NetSuite bug of June 7th
		//consignmentFilters[n] = new nlobjSearchFilter('externalid', null, 'anyof', allExtIDs);
		//var extParamsField = form.addField('extparamsalert', 'text', 'ExtIds anyof:');
        //extParamsField.setDisplayType('inline');
        //extParamsField.setDefaultValue(allExtIDs.join());
		n++;
    }
    
    if (service != '' && service != null) {
		var textService = nlapiLookupField('item', service, 'name');
        consignmentFilters[n] = new nlobjSearchFilter('custbody_labelservice', null, 'is', textService);
        //consignmentFilters[n] = new nlobjSearchFilter('item', null, 'is', service);
        n++;
    }
    
    if (serviceType != '' && serviceType != null) {
        consignmentFilters[n] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', serviceType);
        n++;
    }
    
    if (consignmentNo != '' && consignmentNo != null) {
        consignmentFilters[n] = new nlobjSearchFilter('tranid', null, 'contains', consignmentNo);
        n++;
    }
    
    if (postCode != '' && postCode != null) {
        consignmentFilters[n] = new nlobjSearchFilter('custbody_deliverypostcode', null, 'contains', postCode);
        n++;
    }
    
    if (deliveryName != '' && deliveryName != null) {
        consignmentFilters[n] = new nlobjSearchFilter('custbody_delname', null, 'contains', deliveryName);
        n++;
    }
    
    if (consignmentType != '' && consignmentType != null) {
        consignmentFilters[n] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', consignmentType);
        n++;
    }
    
    if (parseInt(driverRun) != 0) {
        currentDriverRun = driverRun;
        drParam = '&custparam_dr=' + driverRun;
        consignmentFilters[n] = new nlobjSearchFilter('custbody_driverrun', null, 'anyof', driverRun);
        n++;
    }
    
    if (ignoredates != 'T'  && !noConsignmemnts) {
        if (dateFromselect != '' && dateFromselect != null && dateFromselect != dateselect) {
            //showFutureDates = false;
            consignmentFilters[n] = new nlobjSearchFilter('trandate', null, 'onorafter', dateFromselect);
            n++;
        }
        
        if (dateselect != '' && dateselect != null) {
            var dateRange = 'on';
            if (showFutureDates) 
                dateRange = 'onorafter';
            if (dateFromselect != '' && dateFromselect != null && dateFromselect != dateselect) 
                dateRange = 'onorbefore';
            consignmentFilters[n] = new nlobjSearchFilter('trandate', null, dateRange, dateselect);
            n++;
        }
    }
    else {
        if (searchParams == '') { // Cannot allow a search of all consignments - need to provide >=1 search parameters
			consignmentFilters[n] = new nlobjSearchFilter('trandate', null, 'onorafter', '31/12/2030'); // i.e. no jobs listed
            n++;
        }
    }
   

 if (isTestUser()){      
        var testField = form.addField('testalert', 'text', 'Test data:');
        testField.setDisplayType('inline');
        testField.setDefaultValue(searchParams + '<br />custRefLookup=' + custRefLookup);
}
	
    if (currentCustomer != '' && !isDeliveryMode) {
        var custRecord = nlapiLoadRecord('customer', currentCustomer);
        var versionNoField = form.addField('readytime', 'text', 'Ready Time');
        versionNoField.setDisplayType('inline');
        versionNoField.setDefaultValue(custRecord.getFieldValue('custentity_readytime'));
    }
    
    //lastmodifieddate
    consignmentColumns[0] = new nlobjSearchColumn('trandate');
    consignmentColumns[1] = new nlobjSearchColumn('tranid');
    consignmentColumns[2] = new nlobjSearchColumn('custbody_delname');
    consignmentColumns[3] = new nlobjSearchColumn('custbody_deliveryaddr4');
    consignmentColumns[4] = new nlobjSearchColumn('custbody_deliverypostcode');
    consignmentColumns[5] = new nlobjSearchColumn('custbody_labelparcels');
    consignmentColumns[6] = new nlobjSearchColumn('custbody_labeltotalweight');
    consignmentColumns[7] = new nlobjSearchColumn('lastmodifieddate');
    consignmentColumns[8] = new nlobjSearchColumn('custbody_epodlink');
    consignmentColumns[9] = new nlobjSearchColumn('custbody_formid');
    consignmentColumns[10] = new nlobjSearchColumn('custbody_consignmentstatus');
    consignmentColumns[11] = new nlobjSearchColumn('entity');
    consignmentColumns[12] = new nlobjSearchColumn('custbody_driverrun');
    consignmentColumns[13] = new nlobjSearchColumn('custbody_palletparcel');
    consignmentColumns[14] = new nlobjSearchColumn('custbody_deliveryaddr3');
    consignmentColumns[15] = new nlobjSearchColumn('custbody_deliveryaddressselect');
    consignmentColumns[16] = new nlobjSearchColumn('datecreated');
    consignmentColumns[17] = new nlobjSearchColumn('custbody_labelservice');
    consignmentColumns[18] = new nlobjSearchColumn('custbody_taapmessageguid');
    consignmentColumns[19] = new nlobjSearchColumn('custbody_taapdevicestatus');
    if (isDeliveryMode) {
        consignmentColumns[20] = new nlobjSearchColumn('externalid');
        consignmentColumns[21] = new nlobjSearchColumn('custbody_routeoptimisedeta');
        consignmentColumns[22] = new nlobjSearchColumn('custbody_taapdevicelastpolled');
        consignmentColumns[23] = new nlobjSearchColumn('custbody_routeoptimisedseqno');
		consignmentColumns[24] = new nlobjSearchColumn('custbody_sendingdepot');
		consignmentColumns[25] = new nlobjSearchColumn('custbody_palletddservice_date');
		if (currentDriverRun == 21){
        	consignmentColumns[26] = consignmentColumns[4].setSort(); // By postcode
		} else {
        	consignmentColumns[26] = consignmentColumns[23].setSort();
		}
    }
    else {
        consignmentColumns[20] = new nlobjSearchColumn('custbody_printonsubmit');
        consignmentColumns[21] = new nlobjSearchColumn('otherrefnum');
    	consignmentColumns[22] = new nlobjSearchColumn('custbody_requestingparceldepot');
    	consignmentColumns[23] = new nlobjSearchColumn('custbody_saveandnew');
		consignmentColumns[24] = new nlobjSearchColumn('custbody_sendingdepot');
		consignmentColumns[25] = new nlobjSearchColumn('custbody_receivingdepot');
		consignmentColumns[26] = new nlobjSearchColumn('custbody_requestingdepot');
    }
	consignmentColumns[27] = new nlobjSearchColumn('custbody_apccustomerid');
	consignmentColumns[28] = new nlobjSearchColumn('custbody_lastlabelprinted');
    
    var consignmentResults = nlapiSearchRecord('salesorder', null, consignmentFilters, consignmentColumns);
    
    sublist.addMarkAllButtons();
    
    if (consignmentResults) {
        rowLimit = consignmentResults.length;
        if (rowLimit < rowEnd) 
            rowEnd = rowLimit;
                
        //if (parseInt(theContext.getUser()) == 7) {
        if ((request.getParameter('custparam_po') == null || request.getParameter('custparam_po') == '') && !isDeliveryMode) { // Set to last page by default
            pageOffset = parseInt((rowLimit - 1) / rowsPerPage).toFixed(0);
            rowStart = parseInt((pageOffset) * rowsPerPage);
            rowEnd = rowLimit; //As on last page
        }
        //}
        
        if (rowLimit < maxRowsAllowed) {
        
            // Label printing javascript for button assembly
            var cidArray = '';
            var currentDriverArray = '';
            var currentStatusArray = '';
            var currentServiceArray = ''; // Used to see which have been changed for updates
            var currentParcelsArray = ''; // Parcels changed array
            var cidTypeArray = ''; //If pallet / parcel - for cannot mix printing both test
            var cidDelNoteArray = ''; //If pallet / parcel - for cannot mix printing both test
            var cidPrintonSubmit = '';
            var cidSaveandNew = '';
            //var printScriptVersion = '9'; // Parcel label script - OLD VERSION
            var printScriptVersion = '50'; // Parcel label script - NEW VERSION
            var editScriptVersion = '42';
            //if (isTestUser())
            //	printScriptVersion = '65';
            var printScriptPalletVersion = '26'; // Pallet label script - NEW VERSION
            var printScriptOtherVersion = '60'; // for RCCs etc.
            var printScriptOtherDeliveryNote = '56'; // for RCCs etc.
            var updateScriptVersion = '12';
            var convertScriptVersion = '44';
            
            var formIDmap = new Array(); // Added Jan 2013 to lookup the correct form ID based on user type etc.
            
            for (var a = rowStart; a < rowEnd; a++) {
                var deliveryMode = getFormMatrixLookupValue(consignmentResults[a].getValue(consignmentColumns[9]), 'custrecord_formdeliverytype', false);
                var cidID = consignmentResults[a].getId();
                var cidType = consignmentResults[a].getValue(consignmentColumns[13]); //Pallet/parcel/other
                var driverID = consignmentResults[a].getValue(consignmentColumns[12]);
                if (driverID == null || driverID == '')
                	driverID = '29';
                var serviceID = consignmentResults[a].getValue(consignmentColumns[17]);
                var statusID = parseInt(consignmentResults[a].getValue(consignmentColumns[10]));
                var parcelVal = parseInt(consignmentResults[a].getValue(consignmentColumns[5]));
				if (!(statusID <= 3 || statusID == 11))
					statusID = 0;
                var cidScriptType = printScriptVersion;
                var cidScriptDelNoteType = 0;
                if (cidType == '2') 
                    cidScriptType = printScriptPalletVersion;
                if (cidType == '3') {
					cidScriptType = printScriptOtherVersion;
					cidScriptDelNoteType = printScriptOtherDeliveryNote;
				}
                if (consignmentResults[a].getValue(consignmentColumns[20]) == 'T' && cidType == '1') { //Check for immediate print
                    if (cidPrintonSubmit == '') {
                        cidPrintonSubmit = cidID;
                    }
                    else {
                        cidPrintonSubmit += ',' + cidID;
                    }
                }
                if (consignmentResults[a].getValue(consignmentColumns[23]) == 'T') { //Check for save and new
                    if (cidSaveandNew == '') {
                        cidSaveandNew = cidID;
                    }
                    else {
                        cidSaveandNew += ',' + cidID;
                    }
                }
                
                if (deliveryMode == 1) {
                    cidID = '0'; // Not for printing ...
                    cidType = '0';
                }
                if (cidArray == '') {
                    cidArray = cidID;
                    cidTypeArray = cidScriptType;
					cidDelNoteArray = cidScriptDelNoteType;
                    currentDriverArray = driverID;
                    currentServiceArray = serviceID;
                    currentStatusArray = statusID;
					currentParcelsArray = parcelVal;
                }
                else {
                    cidArray += ',' + cidID;
                    cidTypeArray += ',' + cidScriptType;
                    currentDriverArray += ',' + driverID;
					cidDelNoteArray += ',' + cidScriptDelNoteType;
                    currentServiceArray += ',' + serviceID;
                    currentStatusArray += ',' + statusID;
					currentParcelsArray += ',' + parcelVal;
                }
                
                if (rowLimit == 1){ // Add a trailing 0 to resolve array setup bug
                    cidArray += ',0';
                    cidTypeArray += ',0';
                    currentDriverArray += ',0';
					cidDelNoteArray += ',0';
                    currentServiceArray += ',0';
                    currentStatusArray += ',0';
					currentParcelsArray += ',0';
                }
            }
            
            //if (isTestUser() && cidPrintonSubmit != '') { //Check for immediate print
            /*           
            if (cidPrintonSubmit != '') { //Check for immediate print
                var params = new Array();
                params['custparam_cids'] = cidPrintonSubmit;
                nlapiSetRedirectURL('SUITELET', 'customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter', false, params);
                //window.open(nlapiResolveURL('SUITELET', 'customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter', false) + versionParam + '&custparam_cids=' + cidPrintonSubmit,'_self');
                //window.location = nlapiResolveURL('SUITELET', 'customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter', false) + versionParam + '&custparam_cids=' + cidPrintonSubmit;
            }
            */
            if (!isDeliveryMode) { // Add label select / print button
                // Added March 23rd - multi - select print jobs via cids parameter
                var printScript = "var scriptid = ''; var cids = ''; var cidArray = new Array(" + cidArray + ");"
                printScript += "var typecids = ''; var cidTypeArray = new Array(" + cidTypeArray + ");"
                printScript += "for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (nlapiGetLineItemValue('sublist', 'custpage_col_select', d) == 'T' && cidArray[d-1] != 0) { if (scriptid == '') scriptid = cidTypeArray[d-1]; if (cidTypeArray[d-1] != scriptid) { alert('A mixture of pallet/parcel/other consignment types selected. Please print labels of different kinds separately.'); return false; } else { if (cids != '') {cids += ',' + cidArray[d-1]} else {cids = cidArray[d-1]}}}}; if (cids != '') {window.location='./scriptlet.nl?script=' + scriptid + '&deploy=1" + versionParam + "&custparam_cids=' + cids} else {alert('Please tick boxes of jobs to print in the Select column first. Thank you.')};";
                sublist.addButton('custpage_printlabels', 'Print Labels', printScript);
                	
                var updateScript = "var scriptid = '" + updateScriptVersion + "'; var cids = ''; var cidArray = new Array(" + cidArray + ");"
                updateScript += "var typecids = ''; var cidTypeArray = new Array(" + cidTypeArray + ");"
                updateScript += "var currentStatusArray = new Array(" + currentStatusArray + ");"
                updateScript += "var currentParcelsArray = new Array(" + currentParcelsArray + ");"
                if (rowLimit-rowStart == 1)
                	updateScript += "nlapiSetLineItemValue('sublist', 'custpage_col_select', 1, 'T');";	
				updateScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " +  (rowLimit-rowStart) + "; d++){ if (nlapiGetLineItemValue('sublist', 'custpage_col_select', d) == 'T') { didArray[d-1] = getSelectValue(document.forms['sublist_form'].elements['custpage_col_parcels'+d]); } else { didArray[d-1] = 0 ;} if (didArray[d-1] == currentParcelsArray[d-1]) didArray[d-1]=0;}";
				updateScript += "updateParams = ''; for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (parseInt(cidArray[d-1]) != 0  && didArray[d-1] != 0) { if (currentStatusArray[d-1] >= 4 && currentStatusArray[d-1] != 11) { alert('Job cannot be updated as already processed.'); } else { if (cidTypeArray[d-1] != " + printScriptVersion + ") { alert('Job cannot be updated as not for parcels - please use edit instead.'); } else { if (updateParams != '') updateParams += ','; updateParams += cidArray[d-1] + ':' + parseInt(didArray[d-1]) + ':Q'; } } } }";
				//updateScript += "alert('updateParams=' + updateParams);";
                updateScript += "if (updateParams != '') { window.location='./scriptlet.nl?script=' + scriptid + '&deploy=1" + versionParam + searchParams + dtParam + "&custparam_cids=' + updateParams} else {alert('Please tick boxes of jobs to update in the Select column first and/or make changes to quantities. Thank you.')};";

                var moveDate = nlapiDateToString(getNextWorkingDate());
                var datemoveScript = "var scriptid = '" + updateScriptVersion + "'; var moveDate = '" + moveDate + "'; var cids = ''; var cidArray = new Array(" + cidArray + ");"
                datemoveScript += "var typecids = ''; var cidTypeArray = new Array(" + cidTypeArray + ");"
                datemoveScript += "for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (nlapiGetLineItemValue('sublist', 'custpage_col_select', d) == 'T' && cidArray[d-1] != 0) {var cidParam = cidArray[d-1] + ':' + moveDate + ':D'; if (cids != '') {cids += ',' + cidParam} else {cids = cidParam}}}; if (cids != '') { window.location='./scriptlet.nl?script=' + scriptid + '&deploy=1" + versionParam + dtParam + "&ct=" + consignmentType  + "&custparam_cids=' + cids} else {alert('Please tick boxes of jobs to print in the Select column first. Thank you.')};";

                sublist.addButton('custpage_updatejobs', 'Update Qty', updateScript);
                sublist.addButton('custpage_datemovejobs', 'Next Working Day', datemoveScript);

                if (isCustomerService()) {
                	if (custID > 0){
                		sublist.addButton('custpage_printparcelmanifest', 'Print Parcels Manifest', "window.location='" + printManifestURL + "'");
                		sublist.addButton('custpage_printpalletmanifest', 'Print Pallets Manifest', "window.location='" + printManifestPalletURL + "'");
                	}
                	if (cidTypeArray.indexOf(printScriptOtherVersion) != -1){
                	var printManifestScript = "var scriptid = ''; var cids = ''; var cidArray = new Array(" + cidArray + ");"
                	printManifestScript += "var typecids = ''; var cidTypeArray = new Array(" + cidDelNoteArray + ");"
                	printManifestScript += "for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (nlapiGetLineItemValue('sublist', 'custpage_col_select', d) == 'T' && cidArray[d-1] != 0 && cidTypeArray[d-1] != 0) { if (scriptid == '') scriptid = cidTypeArray[d-1]; if (cidTypeArray[d-1] != scriptid) { alert('A mixture of pallet/parcel/other consignment types selected. Please print labels of different kinds separately.'); return false; } else { if (cids != '') {cids += ',' + cidArray[d-1]} else {cids = cidArray[d-1]}}}}; if (cids != '') {window.location='./scriptlet.nl?script=' + scriptid + '&deploy=1" + versionParam + dtParam + "&ct=" + consignmentType + "&custparam_cids=' + cids} else {alert('Please tick boxes of jobs to print in the Select column first. Thank you.')};";
					sublist.addButton('custpage_printmanualmanifest', 'Print NEP Delivery PaperWork', printManifestScript);
                	}
                }
            }
			if (isDeliveryMode) {
				// Allocated Sequence no.s
				var sequenceScript = "var cids = ''; var cidArray = new Array(" + cidArray + ");";
				//sequenceScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " + cidArray.split(',').length + "; d++) didArray[d-1] = document.getElementById('hddn_sublist_custpage_col_deliveryseqno' + d + '_fs').value;";
				sequenceScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " + rowLimit + "; d++){ didArray[d-1] = getSelectValue(document.forms['sublist_form'].elements['custpage_col_deliveryseqno'+d]);}";
				sequenceScript += "allocateParams = ''; for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (parseInt(cidArray[d-1]) != 0  && !isNaN(didArray[d-1])) { if (allocateParams != '') allocateParams += ','; allocateParams += cidArray[d-1] + ':' + parseInt(didArray[d-1]); } }";
				//sequenceScript += "alert('allocateParams=' + allocateParams);";
				sequenceScript += "if (allocateParams != '') {window.location='./scriptlet.nl?script=44&deploy=1" + versionParam + "&custparam_cn=" + custID + "&custparam_dr=" + currentDriverRun + dtParam + "&custparam_cids=' + allocateParams}"; //Sequence them
				sublist.addButton('custpage_sequencedeliveries', 'Set Delivery Sequence', sequenceScript);
				var printManifestScript = "";
				var printScriptID = "";
				if (custID == custAPCDELIVERY) {
					printManifestScript = "window.location='" + nlapiResolveURL('SUITELET', 'customscript_printdriverdeliverymanifest', 'customdeploy_printdriverydeliverydeploy1') + versionParam + "&custparam_cn=" + custID + "&custparam_driverid=" + currentDriverRun + dtParam + "&custparam_manifestdate=" + dateselect + "'";
					printScriptID = "23";
				}
				if (custID == custTPNDELIVERY) {
					printManifestScript = "window.location='" + nlapiResolveURL('SUITELET', 'customscript_deliverymanifestpallets_v2', 'customdeploy_deliverymanifestpallets_v2') + versionParam + "&custparam_cn=" + custID + "&custparam_driverid=" + currentDriverRun + dtParam + "&custparam_manifestdate=" + dateselect + "'";
					printScriptID = "46";
				}
				sublist.addButton('custpage_printpalletmanifest', 'Print Delivery Manifest', printManifestScript);
                
                if (custID == custTPNDELIVERY) {
                    var printScript = "var scriptid = ''; var cids = ''; var cidArray = new Array(" + cidArray + ");"
                    printScript += "var typecids = ''; var cidTypeArray = new Array(" + cidTypeArray + ");"
                    printScript += "for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (nlapiGetLineItemValue('sublist', 'custpage_col_select', d) == 'T' && cidArray[d-1] != 0) { if (scriptid == '') scriptid = cidTypeArray[d-1]; if (cidTypeArray[d-1] != scriptid) { alert('Pallet and parcel consignments selected. Please print pallet and parcel consignment labels separately.'); return false; } else { if (cids != '') {cids += ',' + cidArray[d-1]} else {cids = cidArray[d-1]}}}}; if (cids != '') {window.location='./scriptlet.nl?script=" + printScriptID + "&deploy=1" + versionParam + "&custparam_manifestdate=" + dateselect + "&custparam_usecids=Y&custparam_cids=' + cids} else {alert('Please tick boxes of jobs to print in the Select column first. Thank you.')};";
                    //sublist.addButton('custpage_printdeliverynotes', 'Print Selected Delivery Note(s)', printScript);
                }
			}
            if (useTransport || isDeliveryMode) {
    			//Re-assign drivers button / script
				var cidArrayCheck = cidArray.split(',');
				var cidArrayPad = 0;
				if (cidArrayCheck.length == 1){ // Pad with a dummy entry to avoid javascript array creation error
					cidArray += ',0';
					currentDriverArray += ',0';
					cidArrayPad = 1;
				}
                var driverScript = "var cids = ''; var cidArrayLength = " + (rowLimit-rowStart) + "; var cidArray = new Array(" + cidArray + ");";
                driverScript += "var curdids = ''; var currentDriverArray = new Array(" + currentDriverArray + ");";
				if (useTransport) {
					driverScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++){ didArray[d-1] = parseInt(getSelectValue(document.forms['sublist_form'].elements['custpage_col_driver'+d])); if (didArray[d-1] == parseInt(currentDriverArray[d-1])) didArray[d-1] = 0; }";
				} else {
					driverScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++){ didArray[d-1] = parseInt(document.getElementById('hddn_sublist_custpage_col_driver' + d + '_fs').value); if (didArray[d-1] == parseInt(currentDriverArray[d-1])) didArray[d-1] = 0; }";
				}
                driverScript += "allocateParams = ''; for (var d = 1; d <= " + (rowLimit-rowStart) + "; d++) { if (parseInt(cidArray[d-1]) != 0 && didArray[d-1] != 0 ) { if (allocateParams != '') allocateParams += ','; allocateParams += cidArray[d-1] + ':' + didArray[d-1]; } }";
                //driverScript += "alert('allocateParams=' + allocateParams);";
                driverScript += "if (allocateParams != '') {window.location='./scriptlet.nl?script=43&deploy=1" + versionParam + "&custparam_cn=" + custID + "&custparam_dr=" + currentDriverRun + "&custparam_cm=Y" + dtParam + "&ct=" + consignmentType + "&custparam_cids=' + allocateParams}"; //Re-allocate them
                sublist.addButton('custpage_allocatedrivers', 'Allocate to Driver(s)', driverScript);
            }
            
            //if (parseInt(theContext.getUser()) == 7) {
            //Added October 31st - page buttons to control number of rows displayed per page
            var pageNo = 0;
            for (var p = 0; p < rowLimit; p++) {
                if (p > 0 && (p % rowsPerPage == 0)) {
                    var bookMark = "";
                    if (pageOffset == pageNo) 
                        bookMark = ">>> ";
                    sublist.addButton('custpage_pageno' + (pageNo + 1), bookMark + ((rowsPerPage * pageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + dtParam + drParam + searchParams + "&custparam_po=" + pageNo + "','_self')");
                    pageNo++;
                }
            }
            bookMark = "";
            if (pageOffset == pageNo) 
                bookMark = ">>> ";
            if (rowLimit > parseInt(rowsPerPage * pageNo)) 
                sublist.addButton('custpage_pageno' + (pageNo + 1), bookMark + ((rowsPerPage * pageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + dtParam + drParam + searchParams + "&custparam_po=" + pageNo + "','_self')");
            //}
            
            var lineNum = 1;
            
            for (var i = rowStart; i < rowEnd; i++) {
                //if (isTestUser() || useTransport) 
                //    nlapiLogExecution('AUDIT', 'Consignment_Manager:' + dateselect, "CONSIGNMENT ROW:" + i + ":REMAINING:" + theContext.getRemainingUsage());
                /*
                if (!isDeliveryMode && consignmentResults[i].getValue(consignmentColumns[20]) == 'T') { //Check for print & submit
                    var formID = consignmentResults[i].getValue(consignmentColumns[9]);
                    var params = new Array();
                    params['custparam_cid'] = consignmentResults[i].getId();
                    params['dt'] = 'T';
                    params['pr'] = 'F';
                    nlapiSubmitField('salesorder', consignmentResults[i].getId(), 'custbody_printonsubmit', 'F', false); //Prevents re-occuring on edit as a backup
                    nlapiSetRedirectURL('SUITELET', 'customscript_manualdeliverynote', 'customdeploy_manualdeliverynote', false, params);
                }
           		*/
		  
                if (!isDeliveryMode && consignmentResults[i].getValue(consignmentColumns[23]) == 'T') { //Check for save & new
                    var formID = consignmentResults[i].getValue(consignmentColumns[9]);
                    if (formID == 139) // Temp fix
                   	 formID = 104;
                   if (formID == 141) // Temp fix
                  	 formID = 134;

                    var params = new Array();
                    params['cf'] = formID;
                    params['dt'] = 'T';
                    params['pr'] = 'F';
                    nlapiSubmitField('salesorder', consignmentResults[i].getId(), 'custbody_saveandnew', 'F', false); //Prevents re-occuring on edit as a backup
                    nlapiSetRedirectURL('RECORD', 'salesorder', null, false, params);
                }
           
		        //if (parseInt(theContext.getRemainingUsage()) > 20) {				
                if (i < rowEnd) {
                    // Logic based on status to set links as needed ...
                    var thisStatus = parseInt(consignmentResults[i].getValue(consignmentColumns[10]));
                    //var thisStatusText = parseInt(consignmentResults[i].getText(consignmentColumns[10]));
                    var thisStatusText = consignmentResults[i].getText(consignmentColumns[10]);
                    if (consignmentResults[i].getValue(consignmentColumns[19]).length > 0 && useCustomerService) 
                    	thisStatusText += ' | ' + consignmentResults[i].getValue(consignmentColumns[19]);
                    
                    var orderType = consignmentResults[i].getText(consignmentColumns[13]);
                    if (parseInt(consignmentResults[i].getValue(consignmentColumns[5])) > 1 && consignmentResults[i].getValue(consignmentColumns[13]) != 3) 
                        orderType += 's'; // Plural
                    //var theDeliveryTime = consignmentResults[i].getValue(consignmentColumns[16]).getHours() = ":" + consignmentResults[i].getValue(consignmentColumns[16]).getMinutes();               
                    var theDeliveryType = getFormDeliveryType(consignmentResults[i].getValue(consignmentColumns[9]));
                    var theConsignee = consignmentResults[i].getValue(consignmentColumns[2]);
                    var theConsignmentNo = consignmentResults[i].getValue(consignmentColumns[1]);
                    //var theConsignmentDate = consignmentResults[i].getValue(consignmentColumns[16]);
                    var theConsignmentDate = consignmentResults[i].getValue(consignmentColumns[7]);
                    
                    // Temp fix only - Jan 2013
                    var formID = consignmentResults[i].getValue(consignmentColumns[9]);
					if (formID == '139') {
						if (isCustomerCenter()) {
							if (theDeliveryType == 'HT')
								formID = '104';
							if (theDeliveryType == 'TH')
								formID = '114';
							if (theDeliveryType == 'TT')
								formID = '115';
						} else {
							if (theDeliveryType == 'HT')
								formID = '103';
							if (theDeliveryType == 'TH')
								formID = '110';
							if (theDeliveryType == 'TT')
								formID = '109';
						}
					}
                    if (formID == '141')
                      	 formID = '134';

                    var editURL = "&nbsp;";
                    var editURLMaster = "<a href='scriptlet.nl?script=" + editScriptVersion + "&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + formID + "' target='_blank'>Edit</a>";
                    var viewURLMaster = "<a href='../../../app/accounting/transactions/salesord.nl?id=" + consignmentResults[i].getId() + "&e=F&whence=&cf=" + formID + "' target='_blank'>View</a>";
                    
                    var thisScriptVersion = printScriptVersion;
                    if (parseInt(consignmentResults[i].getValue(consignmentColumns[13])) == 2) 
                        thisScriptVersion = printScriptPalletVersion; // Pallet label script			
                    if (parseInt(consignmentResults[i].getValue(consignmentColumns[13])) == 3) 
                        thisScriptVersion = printScriptOtherVersion;		
                    var printURL = "&nbsp;";
                    var printURLMaster = "<a href='../../../app/site/hosting/scriptlet.nl?script=" + thisScriptVersion + "&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
					if (!isDeliveryMode){
						var depot1 = consignmentResults[i].getValue(consignmentColumns[24]);
						var depot2 = consignmentResults[i].getValue(consignmentColumns[25]);
						var depot3 = consignmentResults[i].getValue(consignmentColumns[26]);
						if (depot1 == '0' || depot1 == '') printURLMaster = "";
						if (depot2 == '0' || depot2 == '') printURLMaster = "";
						if (depot3 == '0' || depot3 == '') printURLMaster = "";
					}
                    //if (theDeliveryType != 'HT' && parseInt(consignmentResults[i].getValue(consignmentColumns[13])) == 2) 
                    //    printURLMaster = "<a href='../../../app/site/hosting/scriptlet.nl?script=28&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Email</a>";
                    
                    var epodURLMaster = "";
                    
                    if (consignmentResults[i].getValue(consignmentColumns[8]) != '' && consignmentResults[i].getValue(consignmentColumns[8]) != null) {
						var epodLink = consignmentResults[i].getValue(consignmentColumns[8]);
						var APCid = consignmentResults[i].getValue(consignmentColumns[27]);
                        if (consignmentResults[i].getValue(consignmentColumns[13]) == 1 && APCid.length < 4) {
                        	epodLink = epodLink.replace(APCid,'0' + APCid);
                        }
                        epodURLMaster = "<a href=" + String.fromCharCode(34) + epodLink + String.fromCharCode(34) + " target='_blank'>EPOD</a>";
                    }
					var epodURL = "&nbsp;";
                    
                    if (theDeliveryType == 'HT') {
                        theDeliveryType = ''; //Only display TH / TT
                    }
                    else {
                        if (theDeliveryType == 'TH') {
                            theConsignee = 'TO CONSIGNOR - There to Here';
                        }
                        theDeliveryType = ' (' + theDeliveryType + ')';
                    }
                    
                    var colorStatus = '';
                    var colorPrintStatus = '';
                    var numLabels = consignmentResults[i].getValue(consignmentColumns[5]);
                    var lastLabelPrinted = consignmentResults[i].getValue(consignmentColumns[28]);
                    //var allocateURL = "&nbsp;";
                    if ((useTransport || isDeliveryMode) && thisStatus != 3 && thisStatus != 4) {
                        colorStatus = '#ffbb55'; // Amber
                    } 

					if (lastLabelPrinted == 0 && (parseInt(thisStatus) <= 2 || parseInt(thisStatus) == 11)) {
						colorPrintStatus = '#ff9999';
					} else {
						if (lastLabelPrinted != numLabels && (parseInt(thisStatus) <= 2 || parseInt(thisStatus) == 11)) {
							colorPrintStatus = '#dddd99';
						} else {
							if (lastLabelPrinted == numLabels && (parseInt(thisStatus) <= 2 || parseInt(thisStatus) == 11))
								colorPrintStatus = '#99ff99';
						}
					}                    

                    
                    if (useCustomerService || useTransport) {
                        editURL = editURLMaster;
                        //if (!useTransport)
                        //    editURL = viewURLMaster;
                        printURL = printURLMaster;
                        epodURL = epodURLMaster;
                    }
                    else {
                        switch (thisStatus) {
                        case 11: // repriced
                        case 1:  // entered
                                editURL = editURLMaster;
                                printURL = printURLMaster;
                                break;
                            case 2: // Printed
                            	colorStatus = '#ffbbbb'; // Red
                                editURL = editURLMaster;
                                printURL = printURLMaster;
                                epodURL = epodURLMaster; // temp until web service auto updates to confirmed
                                break;
                            case 6: // Invoiced
                                editURL = editURLMaster;
                                printURL = printURLMaster;
                                epodURL = epodURLMaster; // temp until web service auto updates to confirmed
                                break;
                            case 3: // Confirmed - driver OK and allocated
                                editURL = editURLMaster;
                                printURL = printURLMaster;
                                epodURL = epodURLMaster; // temp until web service auto updates to confirmed
                                break;
                            case 4: // Cancelled
                                break;
                            default: // Processed - Web Services import etc.
                                editURL = viewURLMaster;
                                epodURL = epodURLMaster;
                                break;
                        }
                    }
                    
                    if (useColorStatus) // LDL etc
                    {
                    	printURL = printURL.replace('Print', "<span style='background-color:" + colorPrintStatus + "' title='" + lastLabelPrinted + "/" + numLabels + "'>Print</span>");
                    }
                    
                    var printonSubmit = "";
                    if (isDeliveryMode) {
                        if (consignmentResults[i].getValue(consignmentColumns[18]).length > 0) 
                            epodURL = "<a href=" + String.fromCharCode(34) + consignmentResults[i].getValue(consignmentColumns[18]) + String.fromCharCode(34) + " target='_blank'>EPOD</a>";
                        if (consignmentResults[i].getValue(consignmentColumns[20]).length > 0) 
                            theConsignmentNo = consignmentResults[i].getValue(consignmentColumns[20]);
                        if (consignmentResults[i].getValue(consignmentColumns[21]).length > 0) 
                            theConsignmentDate = consignmentResults[i].getValue(consignmentColumns[21]);
                        if (consignmentResults[i].getValue(consignmentColumns[19]) != 'For Delivery' && consignmentResults[i].getValue(consignmentColumns[22]) != null) {
                            var theATA = consignmentResults[i].getValue(consignmentColumns[22]) + "";
                            theATA = theATA.substring(10);
                            //ATAColumns = theATA.split(' ');
                            //ATAColumns = ATAColumns.split(':');
                            //theConsignmentDate += " / " + ATAColumns[0] + ":" +  ATAColumns[1];
                            theConsignmentDate += " / " + theATA;
							//thisStatusText += " - " + consignmentResults[i].getValue(consignmentColumns[19]);
                        }
                    }
                    else {
                        if (consignmentResults[i].getValue(consignmentColumns[18]) == 'T' && isTestUser()) 
                            printonSubmit = " *";
                    }
                    
                    //Ensure town field populated
                    var theTown = consignmentResults[i].getValue(consignmentColumns[14]); // Addr3
                    if (theTown.length == 0) 
                        theTown = consignmentResults[i].getValue(consignmentColumns[3]); //Addr4
                    if (theTown.length == 0 && consignmentResults[i].getValue(consignmentColumns[15]) != null && consignmentResults[i].getValue(consignmentColumns[15]) != '') {
                        var addressRecord = nlapiLoadRecord('customrecord_deliveryaddress', consignmentResults[i].getValue(consignmentColumns[15]));
                        if (addressRecord.getFieldValue('custrecord_deladdress_city') != null && addressRecord.getFieldValue('custrecord_deladdress_city') != '') 
                            theTown = addressRecord.getFieldValue('custrecord_deladdress_city');
                        if (theTown.length == 0 && (addressRecord.getFieldValue('custrecord_deladdress_county') != null && addressRecord.getFieldValue('custrecord_deladdress_county') != '')) 
                            theTown = addressRecord.getFieldValue('custrecord_deladdress_county');
                    }
                    
                    sublist.setLineItemValue('custpage_col_seqno', lineNum, (i + 1).toFixed(0));
                    sublist.setLineItemValue('custpage_col_select', lineNum, 'F');
                    // Edit link - modified to resolve direct URL issue by using a suitelet / redirect
                    sublist.setLineItemValue('custpage_col_edit', lineNum, editURL);
                    if (isDeliveryMode) {
                        var thisSeqNo = consignmentResults[i].getValue(consignmentColumns[23]);
                        if (thisSeqNo == null || thisSeqNo == '') 
                            thisSeqNo = 0;
                        sublist.setLineItemValue('custpage_col_deliveryseqno', lineNum, parseInt(thisSeqNo) + 1);
						var deliverydate = consignmentResults[i].getValue(consignmentColumns[25]);
                        if (deliverydate == null) 
                            deliverydate = '';
                        sublist.setLineItemValue('custpage_col_collectingdepot', lineNum, consignmentResults[i].getValue(consignmentColumns[24]));
                        sublist.setLineItemValue('custpage_col_dedicateddate', lineNum, deliverydate);
                    }
                    else {
                        sublist.setLineItemValue('custpage_col_print', lineNum, printURL);
                    }
                    if (useTransport || isDeliveryMode) {
                    	var theDriver = consignmentResults[i].getValue(consignmentColumns[12])
                    	if (theDriver == null || theDriver == '')
                    		theDriver = 29; // Unallocated
                    	sublist.setLineItemValue('custpage_col_driver', lineNum, theDriver);
                    }
                    else 
                        if (!isCustomerCenter()) {
                            var driverPrompt = '';
                            var driverid = consignmentResults[i].getValue(consignmentColumns[12]);
                            if (driverid != '' && driverid != null) {
                                var driverRec = nlapiLoadRecord('customrecord_driverrun', driverid);
                                var driverPrompt = driverRec.getFieldValue('custrecord_driverphonenumber');
                                if (driverPrompt != '' && driverPrompt != null) {
                                    driverPrompt = " title='Tel: " + driverPrompt + " (" + driverRec.getFieldValue('custrecord_drivername') + ")'";
                                    driverPrompt += " alt='Tel: " + driverPrompt + " (" + driverRec.getFieldValue('custrecord_drivername') + ")'";
                                }
                                var driverURLMaster = "<a href='../../../app/common/custom/custrecordentry.nl?rectype=15&id=" + driverid + "' target='_blank' " + driverPrompt + ">" + consignmentResults[i].getText(consignmentColumns[12]) + "</a>";
                                //sublist.setLineItemValue('custpage_col_driver', lineNum, consignmentResults[i].getText(consignmentColumns[12]));
                                sublist.setLineItemValue('custpage_col_driver', lineNum, driverURLMaster);
                            }
                            sublist.setLineItemValue('custpage_col_epod', lineNum, epodURL);
                        }
                        else {
                            sublist.setLineItemValue('custpage_col_epod', lineNum, epodURL);
                        }
                    if (isCustomerService)
                    	theConsignmentNo = viewURLMaster.replace("View",theConsignmentNo);
                    sublist.setLineItemValue('custpage_col_date', lineNum, theConsignmentDate);
                    //if (isTestUser()) sublist.setLineItemValue('custpage_col_trandate', lineNum, consignmentResults[i].getValue(consignmentColumns[0]));
                    sublist.setLineItemValue('custpage_col_trandate', lineNum, consignmentResults[i].getValue(consignmentColumns[0]));
                    //sublist.setLineItemValue('custpage_col_consignment', lineNum, consignmentResults[i].getValue(consignmentColumns[1]) + ' '  + theDeliveryTime + ' ' + theDeliveryType);
                    sublist.setLineItemValue('custpage_col_consignment', lineNum, theConsignmentNo + ' ' + theDeliveryType + ' ' + printonSubmit);
                    sublist.setLineItemValue('custpage_col_service', lineNum, consignmentResults[i].getValue(consignmentColumns[17]));
                    //if (role != '1001' && role != '1007') 
                    if (isCustomerService()) {
						sublist.setLineItemValue('custpage_col_customer', lineNum, consignmentResults[i].getText(consignmentColumns[11]));
						sublist.setLineItemValue('custpage_col_requestingdepot', lineNum, consignmentResults[i].getValue(consignmentColumns[26]));
						sublist.setLineItemValue('custpage_col_receivingdepot', lineNum, consignmentResults[i].getValue(consignmentColumns[25]));
						sublist.setLineItemValue('custpage_col_collectingdepot', lineNum, consignmentResults[i].getValue(consignmentColumns[24]));
					} else {
						sublist.setLineItemValue('custpage_col_customer', lineNum, consignmentResults[i].getValue(consignmentColumns[21]));
					}
					sublist.setLineItemValue('custpage_col_consignee', lineNum, theConsignee);
                    sublist.setLineItemValue('custpage_col_town', lineNum, theTown);
                    sublist.setLineItemValue('custpage_col_postcode', lineNum, consignmentResults[i].getValue(consignmentColumns[4]));
                    sublist.setLineItemValue('custpage_col_parcels', lineNum, consignmentResults[i].getValue(consignmentColumns[5]));
                    sublist.setLineItemValue('custpage_col_type', lineNum, orderType);
                    sublist.setLineItemValue('custpage_col_weight', lineNum, consignmentResults[i].getValue(consignmentColumns[6]));
                    sublist.setLineItemValue('custpage_col_status', lineNum, thisStatusText);
                    
                    lineNum++;
                }
                else {
                    sublist.setLineItemValue('custpage_col_edit', lineNum, 'Number of consignments exceeds limit (' + lineNum + " listed).");
                } // If remaining usage limit reached
            } //for
        }
        else {
            sublist.setLineItemValue('custpage_col_edit', 1, 'Number of consignments exceeds limit (' + rowLimit + " listed).");
        }
    } //if
          
    if (user != 303 && !isTestUser() && isCustomerCenter()) {
    
        // Quotations Sublist ...
        var qsublist = form.addSubList('qsublist', 'staticlist', 'Quotations');
        
        qsublist.addField('custpage_qcol_edit', 'text', 'Edit');
        qsublist.addField('custpage_qcol_convert', 'text', 'Convert');
        qsublist.addField('custpage_qcol_date', 'date', 'Date');
        qsublist.addField('custpage_qcol_consignment', 'text', 'Quotation No.');
        //if (role != '1001' && role != '1007') 
        if (!isCustomerCenter()) 
            qsublist.addField('custpage_qcol_customer', 'text', 'Customer');
        if (isTestUser()) 
            qsublist.addField('custpage_qcol_price', 'text', 'Price');
        qsublist.addField('custpage_qcol_consignee', 'text', 'Consignee');
        qsublist.addField('custpage_qcol_town', 'text', 'Town');
        qsublist.addField('custpage_qcol_postcode', 'text', 'Postcode');
        qsublist.addField('custpage_qcol_parcels', 'text', 'Parcels');
        qsublist.addField('custpage_qcol_weight', 'text', 'Weight');
        
        // Temp. hack for the -1 issue on rows - throw a dummy line at the start ...?!
        qsublist.setLineItemValue('custpage_qcol_edit', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_convert', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_date', 1, "");
        qsublist.setLineItemValue('custpage_qcol_consignment', 1, "&nbsp;");
        //if (role != '1001' && role != '1007') 
        if (!isCustomerCenter()) 
            qsublist.setLineItemValue('custpage_qcol_customer', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_consignee', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_town', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_postcode', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_parcels', 1, "&nbsp;");
        qsublist.setLineItemValue('custpage_qcol_weight', 1, "&nbsp;");
        
        var qlineNum = 2;
        
        var quotationColumns = new Array;
        var quotationFilters = new Array;
        
        quotationFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
        quotationFilters[1] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', '2');
        var qn = 2;
        //if (role == '1001' || role == '1007') { //Filter to just this user company if Cust Center
        if (isCustomerCenter()) {
            //quotationFilters[2] = new nlobjSearchFilter('entity', null, 'is', user);
            quotationFilters[2] = new nlobjSearchFilter('entity', null, 'anyof', entityList);
            qn = 3;
        }
        else {
            if (request.getParameter('custparam_cn') != null && request.getParameter('custparam_cn') != '') {
                quotationFilters[2] = new nlobjSearchFilter('entity', null, 'is', request.getParameter('custparam_cn'));
                qn = 3;
            }
        }
        
        if (showallconsignments != 'T' || dateselect == '') {
            quotationFilters[qn] = new nlobjSearchFilter('trandate', null, 'on', dateselect);
        }
        else {
            if (request.getParameter('custparam_dt') != null) 
                quotationFilters[qn] = new nlobjSearchFilter('trandate', null, 'on', request.getParameter('custparam_dt'));
        }
        
        quotationColumns[0] = new nlobjSearchColumn('trandate');
        quotationColumns[1] = new nlobjSearchColumn('tranid');
        quotationColumns[2] = new nlobjSearchColumn('custbody_delname');
        quotationColumns[3] = new nlobjSearchColumn('custbody_deliveryaddr4');
        quotationColumns[4] = new nlobjSearchColumn('custbody_deliverypostcode');
        quotationColumns[5] = new nlobjSearchColumn('custbody_labelparcels');
        quotationColumns[6] = new nlobjSearchColumn('custbody_labeltotalweight');
        quotationColumns[7] = new nlobjSearchColumn('entity');
        
        var quotationResults = nlapiSearchRecord('salesorder', null, quotationFilters, quotationColumns);
        
        if (quotationResults) {
            qsublist.setLineItemValue('custpage_qcol_edit', 1, "&nbsp;"); // To complete the dummy line work around for the -1 display ...!
            var qrowLimit = quotationResults.length;
            
            for (var q = 0; q < qrowLimit; q++) {
                qsublist.setLineItemValue('custpage_qcol_edit', qlineNum, "<a href='https://system.netsuite.com/app/accounting/transactions/transaction.nl?id=" + quotationResults[q].getId() + "&e=T'>Edit</a>");
                qsublist.setLineItemValue('custpage_qcol_convert', qlineNum, "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=15&deploy=1" + versionParam + "&custparam_id=" + quotationResults[q].getId() + "'>Convert</a>");
                qsublist.setLineItemValue('custpage_qcol_date', qlineNum, quotationResults[q].getValue(quotationColumns[0]));
                qsublist.setLineItemValue('custpage_qcol_consignment', qlineNum, quotationResults[q].getValue(quotationColumns[1]));
                //if (role != '1001' && role != '1007') 
                if (!isCustomerCenter()) 
                    qsublist.setLineItemValue('custpage_qcol_customer', qlineNum, nlapiLookupField('customer', quotationResults[q].getValue(quotationColumns[7]), 'companyname', false));
                qsublist.setLineItemValue('custpage_qcol_consignee', qlineNum, quotationResults[q].getValue(quotationColumns[2]));
                qsublist.setLineItemValue('custpage_qcol_town', qlineNum, quotationResults[q].getValue(quotationColumns[3]));
                qsublist.setLineItemValue('custpage_qcol_postcode', qlineNum, quotationResults[q].getValue(quotationColumns[4]));
                qsublist.setLineItemValue('custpage_qcol_parcels', qlineNum, quotationResults[q].getValue(quotationColumns[5]));
                qsublist.setLineItemValue('custpage_qcol_weight', qlineNum, quotationResults[q].getValue(quotationColumns[6]));
                
                qlineNum++;
                
            } //for
        }
        else {
            qsublist.setLineItemValue('custpage_qcol_edit', 1, "No records to show."); // To complete the dummy line work around for the -1 display ...!
        }
        //if    		
		if (isTestUser() || isCustomerCenterFinancials()) {
			//Pagination for invoices
			var pageInvOffset = 0;
			if (request.getParameter('custparam_invpo') != null) 
				pageInvOffset = parseInt(request.getParameter('custparam_invpo'));
			var InvrowsPerPage = 20;
			var InvrowStart = parseInt((pageInvOffset) * InvrowsPerPage);
			var InvrowEnd = parseInt((pageInvOffset + 1) * InvrowsPerPage);
			var InvrowLimit = parseInt((pageInvOffset + 1) * InvrowsPerPage);
			
			// Invoices Sublist ...
			var invsublist = form.addSubList('invsublist', 'staticlist', 'Invoices');
			
			invsublist.addField('custpage_icol_seqno', 'integer', 'No.');
			invsublist.addField('custpage_icol_view', 'text', 'View / Print');
			invsublist.addField('custpage_icol_date', 'date', 'Invoice Date');
			invsublist.addField('custpage_icol_consignment', 'text', 'Invoice No.');
			//if (role != '1001' && role != '1007') 
			if (!isCustomerCenter()) 
				invsublist.addField('custpage_icol_customer', 'text', 'Customer');
			//if (isTestUser()) 
			//    invsublist.addField('custpage_icol_price', 'text', 'Price');
			invsublist.addField('custpage_icol_consignee', 'text', 'Goods Total');
			invsublist.addField('custpage_icol_postcode', 'text', 'Fuel Surcharge');
			invsublist.addField('custpage_icol_town', 'text', 'Sub Total');
			invsublist.addField('custpage_icol_notaxtotal', 'text', 'Zero Rated');
			invsublist.addField('custpage_icol_parcels', 'text', 'Tax');
			invsublist.addField('custpage_icol_weight', 'text', 'Grand Total');
			
			// Temp. hack for the -1 issue on rows - throw a dummy line at the start ...?!
			invsublist.setLineItemValue('custpage_icol_view', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_date', 1, "");
			invsublist.setLineItemValue('custpage_icol_consignment', 1, "&nbsp;");
			//if (role != '1001' && role != '1007') 
			if (!isCustomerCenter()) 
				invsublist.setLineItemValue('custpage_icol_customer', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_consignee', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_town', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_postcode', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_parcels', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_notaxtotal', 1, "&nbsp;");
			invsublist.setLineItemValue('custpage_icol_weight', 1, "&nbsp;");
			
			var invlineNum = 2;
			
			var invoiceColumns = new Array;
			var invoiceFilters = new Array;
			
			invoiceFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			invoiceFilters[1] = new nlobjSearchFilter('custbody_ordertype', null, 'anyof', '3'); // SSOs only
			var invFilter = 2;
			//if (role == '1001' || role == '1007') { //Filter to just this user company if Cust Center
			if (isCustomerCenter()) {
				invoiceFilters[2] = new nlobjSearchFilter('entity', null, 'anyof', entityList);
				//invoiceFilters[2] = new nlobjSearchFilter('entity', null, 'is', user);
				invFilter = 3;
			}
			else {
				if (request.getParameter('custparam_cn') != null && request.getParameter('custparam_cn') != '') {
					invoiceFilters[2] = new nlobjSearchFilter('entity', null, 'is', request.getParameter('custparam_cn'));
					invFilter = 3;
				}
			}
			
			/*
	 if (showallconsignments != 'T' || dateselect == '') {
	 invoiceFilters[invFilter] = new nlobjSearchFilter('trandate', null, 'on', dateselect);
	 }
	 else {
	 if (request.getParameter('custparam_dt') != null)
	 invoiceFilters[invFilter] = new nlobjSearchFilter('trandate', null, 'on', request.getParameter('custparam_dt'));
	 }
	 */
			invoiceColumns[0] = new nlobjSearchColumn('trandate');
			invoiceColumns[1] = new nlobjSearchColumn('tranid');
			invoiceColumns[2] = new nlobjSearchColumn('custbody_sso_goodstotal');
			invoiceColumns[3] = new nlobjSearchColumn('custbody_sso_netsubtotal');
			invoiceColumns[4] = new nlobjSearchColumn('custbody_sso_fuelsurchargetotal');
			invoiceColumns[5] = new nlobjSearchColumn('custbody_sso_taxtotal');
			invoiceColumns[6] = new nlobjSearchColumn('total');
			invoiceColumns[7] = new nlobjSearchColumn('entity');
			invoiceColumns[8] = new nlobjSearchColumn('custbody_sso_notaxtotal');
			invoiceColumns[9] = invoiceColumns[0].setSort();
			
			var invoiceResults = nlapiSearchRecord('invoice', null, invoiceFilters, invoiceColumns);
			
			
			if (invoiceResults) {
				invsublist.setLineItemValue('custpage_icol_view', 1, InvrowsPerPage + " invoices per page)"); // To complete the dummy line work around for the -1 display ...!
				var InvrowLimit = invoiceResults.length;
				
				if (InvrowLimit < InvrowEnd) 
					InvrowEnd = InvrowLimit;
				
				//if (parseInt(theContext.getUser()) == 7) {
				if ((request.getParameter('custparam_invpo') == null || request.getParameter('custparam_invpo') == '')) { // Set to last page by default
					pageInvOffset = parseInt((InvrowLimit - 1) / InvrowsPerPage).toFixed(0);
					InvrowStart = parseInt((pageInvOffset) * InvrowsPerPage);
					InvrowEnd = InvrowLimit; //As on last page
				}
				//}
				
				if (InvrowLimit < maxRowsAllowed) {
				
					var InvPageNo = 0;
					for (var p = 0; p < InvrowLimit; p++) {
						if (p > 0 && (p % InvrowsPerPage == 0)) {
							var InvbookMark = "";
							if (pageInvOffset == InvPageNo) 
								InvbookMark = ">>> ";
							invsublist.addButton('custPage_InvPageno' + (InvPageNo + 1), InvbookMark + ((InvrowsPerPage * InvPageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + dtParam + drParam + searchParams + "&custparam_invpo=" + InvPageNo + "','_self')");
							InvPageNo++;
						}
					}
					InvbookMark = "";
					if (pageInvOffset == InvPageNo) 
						InvbookMark = ">>> ";
					if (InvrowLimit > parseInt(InvrowsPerPage * InvPageNo)) 
						invsublist.addButton('custPage_InvPageno' + (InvPageNo + 1), InvbookMark + ((InvrowsPerPage * InvPageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + dtParam + drParam + searchParams + "&custparam_invpo=" + InvPageNo + "','_self')");
					//}
					
					for (var i = InvrowStart; i < InvrowEnd; i++) {
						invsublist.setLineItemValue('custpage_icol_seqno', invlineNum, parseInt(i + 1).toFixed(0));
						invsublist.setLineItemValue('custpage_icol_view', invlineNum, "<a href='../../../app/accounting/transactions/transaction.nl?id=" + invoiceResults[i].getId() + "' target='_blank'>View / Print</a>");
						invsublist.setLineItemValue('custpage_icol_date', invlineNum, invoiceResults[i].getValue(invoiceColumns[0]));
						invsublist.setLineItemValue('custpage_icol_consignment', invlineNum, invoiceResults[i].getValue(invoiceColumns[1]));
						//if (role != '1001' && role != '1007') 
						if (!isCustomerCenter()) 
							invsublist.setLineItemValue('custpage_icol_customer', invlineNum, nlapiLookupField('customer', invoiceResults[i].getValue(invoiceColumns[7]), 'companyname', false));
						invsublist.setLineItemValue('custpage_icol_consignee', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[2]) * 1).toFixed(2));
						invsublist.setLineItemValue('custpage_icol_town', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[3]) * 1).toFixed(2));
						invsublist.setLineItemValue('custpage_icol_postcode', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[4]) * 1).toFixed(2));
						invsublist.setLineItemValue('custpage_icol_parcels', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[5]) * 1).toFixed(2));
						invsublist.setLineItemValue('custpage_icol_notaxtotal', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[8]) * 1).toFixed(2));
						invsublist.setLineItemValue('custpage_icol_weight', invlineNum, parseFloat(invoiceResults[i].getValue(invoiceColumns[6]) * 1).toFixed(2));
						
						invlineNum++;
						
					} //for
				}
			}
			else {
				invsublist.setLineItemValue('custpage_icol_view', 1, "No records to show."); // To complete the dummy line work around for the -1 display ...!
			}
		}

    }  
    if (1 == 2) {
//    if (isTestUser()) {
        var addrsublist = form.addSubList('addrsublist', 'staticlist', 'Customer Addresses');
        
        //addrsublist.addButton('btnnewaddress', 'New Address ...', "window.open('https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=23&label=Delivery+Address+Select&entity=" + user + "')");
        
        addrsublist.addField('custpage_acol_type', 'text', 'Address Type');
        addrsublist.addField('custpage_acol_name', 'text', 'Name (click to edit address)');
        addrsublist.addField('custpage_acol_addr1', 'text', 'Address 1');
        addrsublist.addField('custpage_acol_addr2', 'text', 'Address 2');
        addrsublist.addField('custpage_acol_city', 'text', 'City');
        addrsublist.addField('custpage_acol_county', 'text', 'County');
        addrsublist.addField('custpage_acol_postcode', 'text', 'Post Code');
        
        var alineNum = 1;
        
        var addrSearchFilters = new Array();
        var addrSearchColumns = new Array();
        
        //addrSearchFilters[0] = new nlobjSearchFilter('custrecord_deladdress_custid', null, 'is', user);
        addrSearchFilters[0] = new nlobjSearchFilter('custrecord_deladdress_custid', null, 'anyof', entityList);
        
        addrSearchColumns[0] = new nlobjSearchColumn('custrecord_customeraddrtype');
        addrSearchColumns[1] = new nlobjSearchColumn('custrecord_deladdress_addr1');
        addrSearchColumns[2] = new nlobjSearchColumn('custrecord_deladdress_addr2');
        addrSearchColumns[3] = new nlobjSearchColumn('custrecord_deladdress_postcode');
        addrSearchColumns[4] = new nlobjSearchColumn('custrecord_deladdressname');
        addrSearchColumns[5] = new nlobjSearchColumn('custrecord_deladdress_city');
        addrSearchColumns[6] = new nlobjSearchColumn('custrecord_deladdress_county');
        addrSearchColumns[7] = new nlobjSearchColumn('internalid');
        
        var addrSearchResults = nlapiSearchRecord('customrecord_deliveryaddress', null, addrSearchFilters, addrSearchColumns);
        if (addrSearchResults) {
            var arowLimit = addrSearchResults.length;
            for (var a = 0; a < arowLimit; a++) { //
                var editHREF = "<a href='https://system.netsuite.com/app/common/custom/custrecordentry.nl?rectype=23&id=" + addrSearchResults[a].getValue(addrSearchColumns[7]) + "&e=T'>";
                var addrType = addrSearchResults[a].getText(addrSearchColumns[0])
                if (addrType == '') 
                    addrType = 'Customer Delivery Address';
                
                addrsublist.setLineItemValue('custpage_acol_type', alineNum, addrType);
                addrsublist.setLineItemValue('custpage_acol_name', alineNum, editHREF + addrSearchResults[a].getValue(addrSearchColumns[4]) + "</a>");
                addrsublist.setLineItemValue('custpage_acol_addr1', alineNum, addrSearchResults[a].getValue(addrSearchColumns[1]));
                addrsublist.setLineItemValue('custpage_acol_addr2', alineNum, addrSearchResults[a].getValue(addrSearchColumns[2]));
                addrsublist.setLineItemValue('custpage_acol_city', alineNum, addrSearchResults[a].getValue(addrSearchColumns[5]));
                addrsublist.setLineItemValue('custpage_acol_county', alineNum, addrSearchResults[a].getValue(addrSearchColumns[6]));
                addrsublist.setLineItemValue('custpage_acol_postcode', alineNum, addrSearchResults[a].getValue(addrSearchColumns[3]));
                alineNum++;
            }
        }
    }
    
    response.writePage(form);
    
    if (isTestUser() || useTransport) 
        nlapiLogExecution('AUDIT', 'Consignment_Manager:' + dateselect, "CONSIGNMENTS:" + rowLimit + ":REMAINING:" + theContext.getRemainingUsage());
    
    //} //if
    //else
    //{

    //} //else	


} //function

function getLocalDate(){
    var d = new Date();
    var hours = parseFloat(d.getHours() + (d.getTimezoneOffset() / 60));
    if (hours > 24) 
        d = nlapiAddDays(d, 1); // Tomorrow already
    return d;
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

function isTestUser() //Used to display trace dialogues as needed
{
    var testMode = false;
    var theContext = nlapiGetContext();
    var theRole = parseInt(theContext.getRole());
    var theUser = parseInt(theContext.getUser());
    if (parseInt(theUser) == 8 || parseInt(theUser) == 873 || parseInt(theUser) == 7) 
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

function isAdvancedSearch(){
    var isSearch = false;
    var theContext = nlapiGetContext();
    var theRole = parseInt(theContext.getRole());
    var theUser = parseInt(theContext.getUser());
    //if (theRole == 3 || theRole == 1009) 
    //if (theRole == 1009) 
    if (theRole == 3 || theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1009 || theRole == 1015 || theRole == 1010  || theUser == 7 || theUser == 777 || isTransport()) 
        isSearch = true;
    return isSearch;
}

function isTransport(){
    var isTransport = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 1003 || theRole == 1014) 
        isTransport = true;
    return isTransport;
}

function isCustomerCenter(){
    var isCenter = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1005 || theRole == 1006 || theRole == 1007 || theRole == 1008 || theRole == 1015) 
        isCenter = true;
    return isCenter;
}

function isCustomerCenterFinancials(){
    var isCenter = false;
    var theRole = parseInt(nlapiGetContext().getRole());
    if (theRole == 14 || theRole == 1015) 
        isCenter = true;
    return isCenter;
}

function getUserDepotNo(){
    var depotNo = '95';
    var theContext = nlapiGetContext();
    if (parseInt(theContext.getRole()) == 1005) 
        depotNo = '25';
    if (parseInt(theContext.getRole()) == 1006) 
        depotNo = '29';
    return depotNo;
}

function addnewAddress(){
    alert('Add a new address ...');
}
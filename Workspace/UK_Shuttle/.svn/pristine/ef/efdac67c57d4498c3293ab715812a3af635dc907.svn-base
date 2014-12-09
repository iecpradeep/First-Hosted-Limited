function transportManager(request, response){
    var form = nlapiCreateForm('Transport Manager (v3.0)');
    var rowLimit = 200;
    var maxRowsAllowed = 2000;
	var useTotals = true;
	
	var theContext = nlapiGetContext();
	var thisTMscript = theContext.getScriptId();
	var thisTMdeployment = theContext.getDeploymentId();
	var	thisCMscriptNo = "12";
	var	thisTMscriptNo = "17";
	var thisCMscript = 'customscript_consignmentmanager';
	var thisCMdeployment = 'customdeploy1';
	var versionParam = "&version=1";
	
	// Alternate version
	if (thisTMscript == 'customscript_transportmanagerv2'){
		versionParam = "&version=2";
		thisCMscript = 'customscript_consignmentmanager_v2';
		thisCMdeployment = 'customdeploy_consignmentmanager_v2';
		thisCMscriptNo = "42";
		thisTMscriptNo = "40";
	}
	
	// Alternate version 3
	if (thisTMscript == 'customscript_transportmanager_v3'){
		versionParam = "&version=2";
		thisCMscript = 'customscript_consignmentmanager_v2';
		thisCMdeployment = 'customdeploy_consignmentmanager_v2';
		thisCMscriptNo = "42";
		thisTMscriptNo = "54";
	}
	
    var dateField = form.addField('custpage_datefield', 'date', 'Date'); // Set up below

    var classselectField = form.addField('custpage_classselectfield', 'select', 'Select a services view');
    var classlist = ['7', '4,5,11', '8,9'];
    var classnames = ['Collections (Pallet/Parcel)', 'Local / RCC (Pallet/Parcel)', 'Deliveries (Pallet/Parcel)'];
    var classselect = request.getParameter('custparam_class');
    if (classselect == null || classselect == '') {
        classselect = request.getParameter('custpage_classselectfield');
        if (classselect == null || classselect == '') {
            classselect = "7";
        }
    }
	
	for (var cl=0; cl<classlist.length; cl++){
		var classselected = false;
		if (classlist[cl] == classselect) classselected = true;
		classselectField.addSelectOption(classlist[cl], classnames[cl], classselected);
	}
	classselect = classselect.split(","); //For use as a search filter array below
	
    var custAPCDELIVERY = 815; // APCDELIVERY customer
    var custTPNDELIVERY = 846; // TPNDELIVERY customer
    
    if (request.getParameter('custpage_datefield') == '') //if (request.getMethod() == 'GET') 
    {
        //var d = new Date();
        var d = new getLocalDate();		
        dateField.setDefaultValue(nlapiDateToString(d, 'date'));
        var dateselect = nlapiDateToString(d, 'date');
    }
    else {
        var dateselect = request.getParameter('custparam_dt');
        if (!dateselect) 
            dateselect = request.getParameter('custpage_datefield');
        if (dateselect) {
            dateField.setDefaultValue(dateselect);
        }
        else {
        	//var d = new Date();
        	var d = new getLocalDate();		
            dateField.setDefaultValue(nlapiDateToString(d, 'date'));
            dateselect = nlapiDateToString(d, 'date');
        }
    }
	
	var showsaturday = false;
	if (request.getParameter('custpage_saturdayonly') == 'T') showsaturday = true;

	var showfriday = false;
	if (request.getParameter('custpage_fridayonly') == 'T') showfriday = true;

    var convDate = nlapiStringToDate(dateselect);
	convDate = nlapiAddDays(convDate, -1); // Yesterday by default
	if (convDate.getDay() == 0) convDate = nlapiAddDays(convDate, -2); // Yesterday = Sunday so show Friday
    var thisDate = nlapiStringToDate(dateselect);
	if (thisDate.getDay() == 0 || thisDate.getDay() == 6){ // Weekend
		   showsaturday = true;
		   var fridayonlyField = form.addField('custpage_fridayonly', 'checkbox', 'Show Monday Deliveries');
           if (showfriday) fridayonlyField.setDefaultValue('T');
	}
	if (thisDate.getDay() == 1){ // Monday - show friday
		   showfriday = true;
		   var saturdayonlyField = form.addField('custpage_saturdayonly', 'checkbox', 'Show Saturday Deliveries');
           if (showsaturday) saturdayonlyField.setDefaultValue('T');
	}
	
	/*
	if (showfriday || showsaturday) {
        var testField = form.addField('custpage_testalert', 'text', 'Test data:');
        testField.setDisplayType('inline');
        testField.setDefaultValue('<br />showfriday=' + showfriday + '<br />showsaturday=' + showsaturday);
    }
	*/

    var prevDateSelect = nlapiDateToString(convDate, 'date');
    dtParam = '&custparam_dt=' + dateselect + '&custparam_dtfrom=' + dateselect;
    prevdtParam = '&custparam_dt=' + prevDateSelect + '&custparam_dtfrom=' + prevDateSelect;
	
    var showallconsignments = 'F';
    //var showallconsignments = request.getParameter('custpage_selectall');
    //if (showallconsignments == 'T') {
    //    selectall.setDefaultValue('T');
    //}

	var transportMgrParams = '';
	var collectOnly = false;
	if (request.getParameter('custparam_collectonly') != '' && request.getParameter('custparam_collectonly') != null){
		if (request.getParameter('custparam_collectonly') == 'T') collectOnly = true;
		if (request.getParameter('custparam_collectonly') == 'F') collectOnly = false;		
	}
	var deliverOnly = false;
	if (request.getParameter('custparam_deliveronly') != '' && request.getParameter('custparam_deliveronly') != null) {
		if (request.getParameter('custparam_deliveronly') == 'T') deliverOnly = true;
		if (request.getParameter('custparam_deliveronly') == 'F') deliverOnly = false;
	}
	
	var cleardtParam = '&custparam_ignoredates=Y';
 
 	/*
    var allButton = form.addButton('custpage_collectanddeliver', 'Collect / Deliver', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam  + '&custparam_collectonly=F&custparam_deliveronly=F' + "','_self')");
    form.addPageLink('breadcrumb', 'Transport Manager - All', nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + '&custparam_collectonly=F&custparam_deliveronly=F');
    var collectonlyButton = form.addButton('custpage_collectonly', 'Collect Only', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam  + '&custparam_collectonly=T&custparam_deliveronly=F' + "','_self')");
    form.addPageLink('breadcrumb', 'Transport Manager - Collect Only', nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + dtParam + '&custparam_collectonly=T&custparam_deliveronly=F');
    var deliveronlyButton = form.addButton('custpage_deliveryonly', 'Deliver Only', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + '&custparam_collectonly=F&custparam_deliveronly=T'  + "','_self')");
    form.addPageLink('breadcrumb', 'Transport Manager - Deliver Only', nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + '&custparam_collectonly=F&custparam_deliveronly=T');
 	*/

    var classColumns = new Array;
    var classFilters = new Array;
	var classFilterNo = 0;

	if (collectOnly) {
		//collectonlyButton.setLabel('>>> Collect Only');
    	classFilters[classFilterNo] = new nlobjSearchFilter('custrecord_class_collectservice', null, 'is', 'T');
		classFilterNo++;
		useTotals = true;
	}
	if (deliverOnly) {
		//deliveronlyButton.setLabel('>>> Deliver Only');
    	classFilters[classFilterNo] = new nlobjSearchFilter('custrecord_class_deliveryservice', null, 'is', 'T');
		classFilterNo++;
		useTotals = true;
	}
	if (!deliverOnly && !collectOnly) {
		//allButton.setLabel('>>> Collect / Deliver');
		useTotals = true;
	}

	classFilters[classFilterNo] = new nlobjSearchFilter('internalid', null, 'anyof', classselect);
	var classparam = "";
	for (var cp=0;cp<classselect.length; cp++){
		if(classparam != "") classparam += ",";
		classparam += classselect[cp];
	}
	
	var collectPrompt = "";
	if (classparam == "7") collectPrompt = ">>> ";
	var localPrompt = "";
	if (classparam == "4,5,11") localPrompt = ">>> ";
	var deliverPrompt = "";
	if (classparam == "8,9") deliverPrompt = ">>> ";
	classparam = "&custparam_class=" + classparam;
		
    //form.addButton('custpage_refresh', 'Refresh', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + classparam + "','_self')");
    //form.addButton('custpage_collections', collectPrompt + 'Collections (APC/TPN)', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + cleardtParam + "&custparam_class=7','_self')");
    //form.addButton('custpage_locals', localPrompt + 'Local / RCC', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + cleardtParam + "&custparam_class=4,5,11','_self')");
    //form.addButton('custpage_deliveries', deliverPrompt + 'Deliveries (APC/TPN)', "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + cleardtParam + "&custparam_class=8,9','_self')");
    form.addButton('custpage_back', 'Consignment Manager', "window.open('" + nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + dtParam + "','_self')");
    form.addButton('custpage_enterconsignment', 'Enter Consignment', "window.open('../../../app/accounting/transactions/salesord.nl?whence=','_self')");
	form.addPageLink('breadcrumb', 'Consignment Manager ...', nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + cleardtParam);
    form.addSubmitButton('Refresh / Reload');

    classColumns[0] = new nlobjSearchColumn('internalid');
    classColumns[1] = new nlobjSearchColumn('name');
	classColumns[2] = new nlobjSearchColumn('custrecord_class_seqno');
	classColumns[3] = classColumns[2].setSort();
 	classColumns[4] = new nlobjSearchColumn('custrecord_class_palletservice');
 	classColumns[5] = new nlobjSearchColumn('custrecord_class_parcelservice');
 	classColumns[6] = new nlobjSearchColumn('custrecord_class_collectservice');
 	classColumns[7] = new nlobjSearchColumn('custrecord_class_deliveryservice');
 
	var classResults = nlapiSearchRecord('classification', null, classFilters, classColumns);
	
for (c = 0; c < classResults.length; c++) {
var currentClass = classResults[c].getValue(classColumns[0]);
//if (currentClass == 7){
	var subtab = form.addTab('subtab' + c, classResults[c].getValue(classColumns[1]));
	var sublist = form.addSubList('sublist' + c, 'list', classResults[c].getValue(classColumns[1]), 'subtab' + c);
    //Pagination - added May 2012
    var pageOffset = 0;
    if (request.getParameter('custparam_po' + c) != null) 
        pageOffset = parseInt(request.getParameter('custparam_po' + c));
    var rowsPerPage = 120;
    var rowStart = parseInt((pageOffset) * rowsPerPage);
    var rowEnd = parseInt((pageOffset + 1) * rowsPerPage);
    var rowLimit = parseInt((pageOffset + 1) * rowsPerPage);
    
	var isPalletService = false;
	if (classResults[c].getValue(classColumns[4]) == "T") 
		isPalletService = true;
		
	var isParcelService = false;
	if (classResults[c].getValue(classColumns[5]) == "T") 
		isParcelService = true;
		
	var isCollectService = false;
	if (classResults[c].getValue(classColumns[6]) == "T"){
		isCollectService = true;
		useTotals = true;
	} 
	var isDeliverService = false;
	if (classResults[c].getValue(classColumns[7]) == "T") {
		useTotals = true;
		isDeliverService = true;
	}
	
	var consignmentColumns = new Array;
	var consignmentFilters = new Array;
	var classDateselect = dateselect;
	if (isDeliverService) 
		classDateselect = prevDateSelect;
	consignmentFilters[0] = new nlobjSearchFilter('trandate', null, 'on', classDateselect);
	//consignmentFilters[1] = new nlobjSearchFilter('type', null, 'anyof', ('Consignment'));
	var classOperator = 'is';
	if (currentClass == 7) 
		classOperator = 'noneof'; // Summary class  - 7 simply returns all classes except itself ....
	consignmentFilters[1] = new nlobjSearchFilter('class', null, classOperator, currentClass);
	
	var nextFilter = 2;
	if (currentClass == 7) {
		consignmentFilters[2] = new nlobjSearchFilter('entity', null, 'noneof', custAPCDELIVERY);
		consignmentFilters[3] = new nlobjSearchFilter('entity', null, 'noneof', custTPNDELIVERY);
		nextFilter = 4;
	}
	
	if (isDeliverService) {
		//consignmentFilters[nextFilter] = new nlobjSearchFilter('custbody_palletddservice_date', null, 'on', classDateselect);
		//nextFilter++;		
		//consignmentFilters[nextFilter] = new nlobjSearchFilter('custbody_palletddservice_date', null, 'isempty');
		//nextFilter++;		
	}
	if ((showfriday || showsaturday) && !(showfriday && showsaturday)){
		//var saturdayServices = new Array('SAT', 'SATL', 'SATT', 'STTL');
		//var serviceOperator = 'anyof';
		//if (fridayonly) serviceOperator = 'noneof';
		var saturdayServices = 'SAT';
		var serviceOperator = 'contains';
		if (showfriday && !showsaturday) serviceOperator = 'doesnotcontain';
		consignmentFilters[nextFilter] = new nlobjSearchFilter('custbody_labelservice', null, serviceOperator, saturdayServices);
		nextFilter++;
	}
	
	//if (isDeliverService)
	//	consignmentFilters[nextFilter] = new nlobjSearchFilter('custbody_palletddservice_date', null, 'on', classDateselect);
	
	if (useTotals) {
    		consignmentFilters[nextFilter] = new nlobjSearchFilter('mainline', null, 'is', 'F');
    		consignmentFilters[nextFilter+1] = new nlobjSearchFilter('memo', null, 'isnot', 'VAT');
    		consignmentFilters[nextFilter+2] = new nlobjSearchFilter('custbody_ordertype', null, 'is', 1); //Consignment
			nextFilter += 3;
            grpName = new nlobjSearchColumn('name', null, 'group');
            countNumber = new nlobjSearchColumn('number', null, 'count');
            grpDate = new nlobjSearchColumn('trandate', null, 'group');
            grpDriverRun = new nlobjSearchColumn('custbody_driverrun', null, 'group');
            grpStatus = new nlobjSearchColumn('custbody_consignmentstatus', null, 'group');
            grpType = new nlobjSearchColumn('custbody_palletparcel', null, 'group');
            sumParcels = new nlobjSearchColumn('custcol_consignment_numberofparcels', null, 'sum');
            sumParcelsWeight = new nlobjSearchColumn('custcol_totalweightparcels', null, 'sum');
            sumPallets = new nlobjSearchColumn('custcol_numberofpallets', null, 'sum');
            sumPalletsWeight = new nlobjSearchColumn('custcol_totalweight_pallets', null, 'sum');
            colClass = new nlobjSearchColumn('class');
            var nameSort = grpName.setSort();
			if (isDeliverService) nameSort = grpDriverRun.setSort();
	} else {
		consignmentColumns[0] = new nlobjSearchColumn('Name');
		consignmentColumns[1] = new nlobjSearchColumn('Number');
		//consignmentColumns[1] = new nlobjSearchColumn('tranid');
		consignmentColumns[2] = new nlobjSearchColumn('trandate');
		consignmentColumns[3] = new nlobjSearchColumn('custbody_driverrun');
		consignmentColumns[4] = new nlobjSearchColumn('custbody_consignmentstatus');
		consignmentColumns[5] = new nlobjSearchColumn('custbody_formid');
		consignmentColumns[6] = new nlobjSearchColumn('custcol_consignment_numberofparcels');
		consignmentColumns[7] = new nlobjSearchColumn('custcol_totalweightparcels');
		consignmentColumns[8] = new nlobjSearchColumn('custcol_numberofpallets');
		consignmentColumns[9] = new nlobjSearchColumn('custcol_totalweight_pallets');
		consignmentColumns[10] = new nlobjSearchColumn('custbody_ordertype');
		consignmentColumns[11] = new nlobjSearchColumn('class');
		consignmentColumns[12] = new nlobjSearchColumn('custbody_palletparcel');
		consignmentColumns[13] = new nlobjSearchColumn('externalid');
		consignmentColumns[14] = new nlobjSearchColumn('custbody_taapdevicestatus');
		if (isDeliverService) {
			consignmentColumns[15] = new nlobjSearchColumn('custbody_deliverypostcode');
			consignmentColumns[16] = new nlobjSearchColumn('custbody_labelservice');
			consignmentColumns[17] = new nlobjSearchColumn('custbody_palletddservice_date');
			consignmentColumns[18] = new nlobjSearchColumn('custbody_delname');
			consignmentColumns[19] = new nlobjSearchColumn('custbody_palletcollectingdepot');
			consignmentColumns[20] = consignmentColumns[3].setSort();
		}
	}
	
	//if (isDeliverService) {
	if (currentClass == 8 && !useTotals) { // APC Delivery Class
		var consignmentResults = nlapiSearchRecord('salesorder', 'customsearch_alldailytransactions_2', consignmentFilters, consignmentColumns);
	}
	else {
		if (currentClass == 9 && !useTotals) { // TPN Delivery Class
			var consignmentResults = nlapiSearchRecord('salesorder', 'customsearch_transportmanagertotals', consignmentFilters, [grpName, nameSort, countNumber, grpDriverRun, grpDate, grpStatus, sumParcels, sumParcelsWeight, sumPallets, sumPalletsWeight]);
			//showallconsignments = 'T';
		}
		else {
			if (useTotals){
				//var consignmentResults = nlapiSearchRecord('transaction', 'customsearch_transportmanagertotals', consignmentFilters, consignmentColumns);						                    
				var consignmentResults = nlapiSearchRecord('salesorder', null, consignmentFilters, [grpName, nameSort, countNumber, grpDriverRun, grpDate, grpStatus, sumParcels, sumParcelsWeight, sumPallets, sumPalletsWeight]);
			} else {
				var consignmentResults = nlapiSearchRecord('salesorder', 'customsearch_alldailytransactions', consignmentFilters, consignmentColumns);			
			}
		}
	}
    
    if (consignmentResults) {
        rowLimit = consignmentResults.length;
        if (rowLimit < rowEnd) 
            rowEnd = rowLimit;
        
        //if (parseInt(theContext.getUser()) == 7) {
        if (request.getParameter('custparam_po' + c) == null || request.getParameter('custparam_po' + c) == '') { // Set to last page by default
            pageOffset = parseInt((rowLimit - 1) / rowsPerPage).toFixed(0);
            rowStart = parseInt((pageOffset) * rowsPerPage);
            rowEnd = rowLimit; //As on last page
        }
		
		if (rowLimit < maxRowsAllowed) {

		var driverColText = "Driver(s)";
		var indexColText = "Company";	   
        
        //if (isDeliverService && !useTotals) {
        if (isDeliverService) {
            var cidArray = '0'; //Will be for the printing id list     
            driverColText = "Driver"; // Only ever one per row
            indexColText = "Delivery Route";
            sublist.addMarkAllButtons();
            sublist.addField('custpage_' + c + '_col_printselect', 'checkbox', 'Mark'); // For printing delivery manifest(s)
            //var driverSelectField = form.addField('custpage_driverselectfield', 'select', 'Allocate Driver');
        
            //sublist.addField('custpage_' + c + '_col_currentdriverid', 'text', 'ID'); // For printing delivery manifest(s)
        }
		
		//if (isCollectService) useTotals = true;

        // Common columns for all
        sublist.addField('custpage_' + c + '_col_seqno', 'text', 'No.');
        sublist.addField('custpage_' + c + '_col_index', 'text', indexColText);
        
        if (isDeliverService && !useTotals) {
            sublist.addField('custpage_' + c + '_col_driverselect', 'select', 'Driver Allocation', 'customrecord_driverrun');
        }
        
        var showIndex = 0;
        var allocateArray = '0';
        var currentDriverArray = '0';	
        
        if (isParcelService) {
            if (!isDeliverService) 
                sublist.addField('custpage_' + c + '_col_drivers', 'text', 'Parcel ' + driverColText);
            sublist.addField('custpage_' + c + '_col_parcelconsignmentno', 'text', 'Parcel Consignments');
            sublist.addField('custpage_' + c + '_col_parcels', 'text', 'Parcels');
            sublist.addField('custpage_' + c + '_col_parcelsweight', 'text', 'Weight KG');
            sublist.addField('custpage_' + c + '_col_parcelscancelled', 'text', 'Cancelled Parcels');
        }

        //sublist.addField('custpage_' + c + '_col_driverrun', 'text', 'Cancelled');
        if (isPalletService) {
            if (isDeliverService && !useTotals) {
                sublist.addField('custpage_' + c + '_col_deliverpostcode', 'text', 'Deliver To');
                sublist.addField('custpage_' + c + '_col_service', 'text', 'Service');
                sublist.addField('custpage_' + c + '_col_palletconsignmentno', 'text', 'Pallets Consignee');
                sublist.addField('custpage_' + c + '_col_collectingdepot', 'text', 'From Depot');
                sublist.addField('custpage_' + c + '_col_dedicateddate', 'text', 'DD Date');
            }
            else {
                sublist.addField('custpage_' + c + '_col_palletdrivers', 'text', 'Pallet ' + driverColText);
                sublist.addField('custpage_' + c + '_col_palletconsignmentno', 'text', 'Pallet Consignments');
            }
            sublist.addField('custpage_' + c + '_col_pallets', 'text', 'Pallets');
            sublist.addField('custpage_' + c + '_col_palletsweight', 'text', 'Weight KG');
            sublist.addField('custpage_' + c + '_col_palletscancelled', 'text', 'Cancelled Pallets');
        }
  
        // Grand Totals row - at the top to avoid scrolling etc.
        var grandtotalConsignments = 0;
        var grandtotalParcelConsignments = 0;
        var grandtotalPalletConsignments = 0;
        var grandtotalParcels = 0;
        var grandtotalCancelledParcels = 0;
        var grandtotalParcelDrivers = 0;
        var grandtotalParcelsWeight = 0;
        var grandtotalPallets = 0;
        var grandtotalCancelledPallets = 0;
        var grandtotalPalletDrivers = 0;
        var grandtotalPalletsWeight = 0;
        
        //sublist.setLineItemValue('custpage_' + c + '_col_driverrun', 1, '&nbsp;');
        
		//Pointers / indexes for rows
		var lineNum = 2;
        var recNum = 0;
		
		var colorOKStatus = '#aaee66'; // Green
		var colorAlertStatus = '#ffbb55'; // Amber
		var colorUrgentStatus = '#ff8866'; // Red
		var colorNormalStatus = '#77bbff'; // Blue
        var colorStatus = '#eeeeee';
        var colorParcelStatus = '#eeeeee';
        var colorPalletStatus = '#eeeeee';
		
        var drivers = new Array(); // Normally 1 per customer, can be 2 if late pickup needed, exceptionally 3
        var driversPallets = new Array(); // Normally 1 per customer, can be 2 if late pickup needed, exceptionally 3
		       
        sublist.setLineItemValue('custpage_' + c + '_col_index', 1, '<b>TOTALS ' + classDateselect + '</b>');
        //sublist.setLineItemValue('custpage_' + c + '_col_consignmentno', 1, '<b>' + grandtotalConsignments + ' Consignments</b>');
        if (isParcelService) {
            sublist.setLineItemValue('custpage_' + c + '_col_drivers', 1, '<b>' + grandtotalParcelDrivers + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', 1, '<b>' + grandtotalParcelConsignments + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcels', 1, '<b>' + grandtotalParcels + '/b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelsweight', 1, '<b>' + grandtotalParcelsWeight + ' KG</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelscancelled', 1, '<b>' + grandtotalCancelledParcels + '</b>');
        }
        if (isPalletService) {
            sublist.setLineItemValue('custpage_' + c + '_col_palletdrivers', 1, '<b>' + grandtotalPalletDrivers + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', 1, '<b>' + grandtotalPalletConsignments + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_pallets', 1, '<b>' + grandtotalPallets + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_palletsweight', 1, '<b>' + grandtotalPalletsWeight + ' KG</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_palletscancelled', 1, '<b>' + grandtotalCancelledPallets + '</b>');
        }
        
        var totalConsignments = 0;
        var consList = '';
        var totalParcelConsignments = 0;
        var totalPalletConsignments = 0;
        var totalParcels = 0;
        var totalPURParcels = 0;
        var totalCancelledParcels = 0;
        var totalEPODParcels = 0;
        var totalParcelsWeight = 0;
        var totalPallets = 0;
        var totalCancelledPallets = 0;
        var totalPURPallets = 0;
        var totalEPODPallets = 0;
        var totalPalletsWeight = 0;
        
        var enteredConsignments = 0;
        var printedConsignments = 0;
        var processedConsignments = 0;
        var cancelledConsignments = 0;
        var PURConsignments = 0;
		
        var EPODAcceptedConsignments = 0;
        var EPODCollectedConsignments = 0;
        var EPODDeliveredConsignments = 0;
        var EPODDiscrepConsignments = 0;

        var enteredParcelConsignments = 0;
        var printedParcelConsignments = 0;
        var processedParcelConsignments = 0;
        var cancelledParcelConsignments = 0;
        var PURParcelConsignments = 0;
		
        var EPODAcceptedParcelConsignments = 0;
        var EPODCollectedParcelConsignments = 0;
        var EPODDeliveredParcelConsignments = 0;
        var EPODDiscrepParcelConsignments = 0;

        var enteredPalletConsignments = 0;
        var printedPalletConsignments = 0;
        var processedPalletConsignments = 0;
        var cancelledPalletConsignments = 0;
        var PURPalletConsignments = 0;
		
		var EPODPrompt = "";
        var EPODAcceptedPalletConsignments = 0;
        var EPODCollectedPalletConsignments = 0;
        var EPODDeliveredPalletConsignments = 0;
        var EPODDiscrepPalletConsignments = 0;

        var displaySummary = false;
        var lastCid = 0;
        var lastCustFormid = 0;
        
        if (useTotals) {
            var thisCustomer = consignmentResults[0].getValue('name', null, 'group'); // Set to the first customer id
            var thisDriverRun = consignmentResults[0].getValue('custbody_driverrun', null, 'group'); // Set to the first driver id
            var thisDriverRunText = consignmentResults[0].getText('custbody_driverrun', null, 'group'); // Set to the first driver id
            var thisCustomerText = consignmentResults[0].getText('name', null, 'group'); // Set to the first customer text
			//thisCustomerText += " (" + statusClass + "/" + PURConsignments + ")";
        }
		else {
			var thisCustomer = consignmentResults[0].getValue(consignmentColumns[0]); // Set to the first customer id
			var thisDriverRun = consignmentResults[0].getValue(consignmentColumns[3]); // Set to the first driver id
			var thisDriverRunText = consignmentResults[0].getText(consignmentColumns[3]); // Set to the first driver id
			var thisCustomerText = consignmentResults[0].getText(consignmentColumns[0]); // Set to the first customer text
		}

		var custFields = new Array('companyname','custentity_dailycollection');
		var custData = nlapiLookupField('customer', thisCustomer, custFields, false);
        var thisCustomerHTML = custData.companyname;
        var thisCustomerDailyCollect = custData.custentity_dailycollection;
        //var thisCustomerHTML = nlapiLookupField('customer', thisCustomer, 'companyname', false);
        //var thisCustomerDailyCollect = nlapiLookupField('customer', thisCustomer, 'custentity_dailycollection', false);
        if (thisCustomer == custAPCDELIVERY || thisCustomer == custTPNDELIVERY) 
            thisCustomerHTML += " (" + thisDriverRunText + ")";
        for (h = 0; h < (70 - thisCustomerHTML.length); h++) 
            thisCustomerHTML += '&nbsp;' //Pad with spaces

            //Added May 2012 - page buttons to control number of rows displayed per page
            var pageNo = 0;
            for (var p = 0; p < rowLimit; p++) {
                if (p > 0 && (p % rowsPerPage == 0)) {
                    var bookMark = "";
                    if (pageOffset == pageNo) 
                        bookMark = ">>> ";
                    //sublist.addButton('custpage_' + c + '_pageno' + (pageNo + 1), bookMark + ((rowsPerPage * pageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + "&custparam_po" + c + "=" + pageNo + "','_self')");
                    pageNo++;
                }
            }
            bookMark = "";
            if (pageOffset == pageNo) 
                bookMark = ">>> ";
            if (rowLimit > parseInt(rowsPerPage * pageNo)) 
                //sublist.addButton('custpage_' + c + '_pageno' + (pageNo + 1), bookMark + ((rowsPerPage * pageNo) + 1) + ' - ' + p, "window.open('" + nlapiResolveURL('SUITELET', thisTMscript, thisTMdeployment) + versionParam + dtParam + "&custparam_po" + c + "=" + pageNo + "','_self')");
            //}

            var lineNum = 2;
            
            for (var i = rowStart; i < rowEnd; i++) {
        	//for (var i = 0; i <= rowLimit; i++) {            
            //if (i == rowLimit) {
            if (i == rowEnd-1) {
                displaySummary = true;
           	}
            else {
				if (useTotals){
					var currentDriverRun = 	consignmentResults[i].getValue('custbody_driverrun', null, 'group');
					var currentCustomer = 	consignmentResults[i].getValue('name', null, 'group');								
				} else {
					var currentDriverRun = 	consignmentResults[i].getValue(consignmentColumns[3]);								
					var currentCustomer = 	consignmentResults[i].getValue(consignmentColumns[0]);								
				}
                if (isDeliverService) { // Sorted & grouped by drivers
                    if (thisDriverRun != currentDriverRun) {
						if (currentDriverRun == 21 || currentDriverRun == 30) {
							showallconsignments = 'F';
						}
						else {
							showallconsignments = 'F';
						}
						displaySummary = true;
					}
                }
                else {
                    if (thisCustomer != currentCustomer) 
                        displaySummary = true;
                }
            }
			
            if (displaySummary) {
			
			var driverParam = '';	
            if (isDeliverService) {
				thisCustomerText = "Driver Delivery Run " + thisDriverRunText;
				if (cidArray == '') {
					cidArray = thisDriverRun;
				}
				else {
					cidArray += ',' + thisDriverRun;
				}
				driverParam = "&custparam_dr=" + thisDriverRun;
			}
			
                var readyConsignments = totalConsignments - cancelledConsignments - PURConsignments;
                var readyParcelConsignments = totalParcelConsignments - totalCancelledParcels - totalPURParcels;
                var readyPalletConsignments = totalPalletConsignments - totalCancelledPallets - totalPURPallets;

 				var driverList = '';
				for (var d = 0 ; d < drivers.length; d++){
					driverList += drivers[d] + ' ';
				}
				
 				var driverListPallets = '';
				for (var dp = 0 ; dp < driversPallets.length; dp++){
					driverListPallets += driversPallets[dp] + ' ';
				}
				
      			colorStatus = '#eeeeee';
        		colorParcelStatus = '#eeeeee';
        		colorPalletStatus = '#eeeeee';

                // Work out status / colour traffic lights ...
                if ((readyConsignments == processedConsignments && driverList != '') || readyConsignments ==0) {
                    colorStatus = colorNormalStatus;					
                } else {
                    if (driverList != '' && driverList != null) {
                        colorStatus = colorNormalStatus;
                    }
                    else {
						if (thisCustomerDailyCollect == "T"){
                        	colorStatus = colorNormalStatus;							
						} else {
                        	colorStatus = colorAlertStatus;							
						}
                    }
                }

                if ((readyParcelConsignments == processedParcelConsignments  && driverList != '') || readyParcelConsignments == 0) {
                    colorParcelStatus = colorNormalStatus;					
                } else {
                    if (driverList != '' && driverList != null) {
                        colorParcelStatus = colorNormalStatus;
                    }
                    else {
						if (thisCustomerDailyCollect == "T"){
                        	colorParcelStatus = colorNormalStatus;							
						} else {
                        	colorParcelStatus = colorAlertStatus;							
						}
                    }
                }
				
					//EPODCollectedPalletConsignments = 0;
					//EPODDeliveredPalletConsignments = 0;
					//EPODAcceptedPalletConsignments = 0;                   
                    var unallocatedPallets = 0;
					if (driverListPallets != '')
						unallocatedPallets = driverListPallets.search(/unallocated/i);
						
                    if ((driverListPallets == '' || driverListPallets == null) || readyPalletConsignments == 0) {
                        colorPalletStatus = colorAlertStatus;
                    }
                    else {
                        //Check various EPOD statuses
                        //if (EPODCollectedPalletConsignments > 0 && EPODDiscrepPalletConsignments == 0) {
                        if ((EPODCollectedPalletConsignments == readyPalletConsignments) && EPODDiscrepPalletConsignments == 0) {
                            colorPalletStatus = colorOKStatus;
                        }
                        else {
                            if (EPODAcceptedPalletConsignments > 0 && EPODDiscrepPalletConsignments == 0 && unallocatedPallets == 0) {
                                colorPalletStatus = colorNormalStatus;
                            }
                            else {
                                if (EPODDiscrepPalletConsignments > 0) {
                                    colorPalletStatus = colorUrgentStatus;
                                }
                                else {
                                    colorPalletStatus = colorAlertStatus;
                                }
                            }
                        }
                    }

				/*
                if ((readyPalletConsignments == processedPalletConsignments  && driverListPallets != '') ||  readyPalletConsignments == 0) {				
                    colorPalletStatus = colorNormalStatus;				
                } else {
                    if (driverListPallets != '' && driverListPallets != null) {
                        colorPalletStatus = colorAlertStatus;
                    }
                    else {
                        colorPalletStatus = colorUrgentStatus;
                    }
                }
				*/
				
                var searchListURL = '';				
				var CMURL = nlapiResolveURL('SUITELET', thisCMscript, thisCMdeployment) + versionParam + "&custparam_cn=" + thisCustomer + "&custparam_dt=" + classDateselect + "&custparam_dtfrom=" + classDateselect + driverParam + "&ct=*CT*";
                searchListURL = "<a href='" + CMURL + "'>";
                
				var totalCollectDeliver = 0;
                sublist.setLineItemValue('custpage_' + c + '_col_seqno', lineNum, (lineNum - 1).toFixed(0));
                sublist.setLineItemValue('custpage_' + c + '_col_index', lineNum, thisCustomerText);
                if (isParcelService) {
                	sublist.setLineItemValue('custpage_' + c + '_col_drivers', lineNum, driverList);
                    if ((parseInt(totalParcelConsignments) > 0 || totalCancelledParcels > 0) || isDeliverService) sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', lineNum, searchListURL.replace("*CT*","1") + '<span style=\"background-color:' + colorParcelStatus + '\">' + totalParcelConsignments + '&nbsp;-&nbsp;' + thisCustomerHTML + '</span></a>');
                    //if ((parseInt(totalParcelConsignments) > 0 || totalCancelledParcels > 0) || isDeliverService) sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', lineNum, searchListURL.replace("*CT*","1") + '<span style=\"background-color:' + colorParcelStatus + '\">&nbsp;&nbsp;' + thisCustomerHTML + '</span></a>');
                    sublist.setLineItemValue('custpage_' + c + '_col_parcels', lineNum, '<b>' + totalParcels + '</b>');
                    sublist.setLineItemValue('custpage_' + c + '_col_parcelsweight', lineNum, '<b>' + totalParcelsWeight + ' KG</b>');
                    sublist.setLineItemValue('custpage_' + c + '_col_parcelscancelled', lineNum, totalCancelledParcels.toFixed(0));
                }
                if (isPalletService) {
					if (isDeliverService){
						totalCollectDeliver = EPODDeliveredPalletConsignments;
					} else {
						totalCollectDeliver = EPODCollectedPalletConsignments;
					}
                	sublist.setLineItemValue('custpage_' + c + '_col_palletdrivers', lineNum, driverListPallets);
                    if ((parseInt(totalPalletConsignments) > 0 || totalCancelledPallets > 0) || isDeliverService ) sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', lineNum, searchListURL.replace("*CT*","2") + '<span style=\"background-color:' + colorPalletStatus + '\">' + totalPalletConsignments + '/' + totalCollectDeliver + '&nbsp;-&nbsp;' + thisCustomerHTML + '</span></a>');
                    //if ((parseInt(totalPalletConsignments) > 0 || totalCancelledPallets > 0) || isDeliverService ) sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', lineNum, searchListURL.replace("*CT*","2") + '<span style=\"background-color:' + colorPalletStatus + '\">&nbsp;&nbsp;' + thisCustomerHTML + '</span></a>');
                    sublist.setLineItemValue('custpage_' + c + '_col_pallets', lineNum, '<b>' + totalPallets + '</b>');
                    sublist.setLineItemValue('custpage_' + c + '_col_palletsweight', lineNum, '<b>' + totalPalletsWeight + ' KG</b>');
                    sublist.setLineItemValue('custpage_' + c + '_col_palletscancelled', lineNum, totalCancelledPallets.toFixed(0));
                }
                //sublist.setLineItemValue('custpage_' + c + '_col_driverrun', lineNum, 'Cancelled : ' + cancelledConsignments);
                
                //Update grand totals
                if (!isNaN(totalParcels)) grandtotalParcels += totalParcels;
                if (!isNaN(totalCancelledParcels)) grandtotalCancelledParcels += totalCancelledParcels;
                if (!isNaN(totalParcelsWeight)) grandtotalParcelsWeight += totalParcelsWeight;
                if (!isNaN(totalPallets)) grandtotalPallets += totalPallets;
                if (!isNaN(totalCancelledPallets)) grandtotalCancelledPallets += totalCancelledPallets;
                if (!isNaN(totalPalletsWeight)) grandtotalPalletsWeight += totalPalletsWeight;
                if (!isNaN(totalConsignments)) grandtotalConsignments += totalConsignments;
                if (!isNaN(totalParcelConsignments)) grandtotalParcelConsignments += totalParcelConsignments;
                if (!isNaN(totalPalletConsignments)) grandtotalPalletConsignments += totalPalletConsignments;
                
                if (i != rowLimit) {
                    
                    
                    if (useTotals) {
                        thisCustomer = consignmentResults[i].getValue('name', null, 'group'); // Set to the first customer id
                        thisDriverRun = consignmentResults[i].getValue('custbody_driverrun', null, 'group'); // Set to the first driver id
                        thisDriverRunText = consignmentResults[i].getText('custbody_driverrun', null, 'group'); // Set to the first driver id
                        thisCustomerText = consignmentResults[i].getText('name', null, 'group'); // Set to the first customer text
						//thisCustomerText += " (" + statusClass + "/" + PURConsignments + ")";
                    }
                    else {
                        thisCustomer = consignmentResults[i].getValue(consignmentColumns[0]); // Set to the first customer id
                        thisDriverRun = consignmentResults[i].getValue(consignmentColumns[3]); // Set to the first driver id
                        thisDriverRunText = consignmentResults[i].getText(consignmentColumns[3]); // Set to the first driver id
                        thisCustomerText = consignmentResults[i].getText(consignmentColumns[0]); // Set to the first customer text
                    }

                    thisCustomerHTML = nlapiLookupField('customer', thisCustomer, 'companyname', false);
        			thisCustomerDailyCollect = nlapiLookupField('customer', thisCustomer, 'custentity_dailycollection', false);
                    if (thisCustomer == custAPCDELIVERY || thisCustomer == custTPNDELIVERY) 
                        thisCustomerHTML += " (" + thisDriverRunText + ")";
                    for (h = 0; h < (70 - thisCustomerHTML.length); h++) 
                        thisCustomerHTML += '&nbsp;' //Pad with spaces
					
                    totalParcels = 0;
                    totalCancelledParcels = 0;
                    totalParcelsWeight = 0;
                    totalPallets = 0;
					totalCancelledPallets = 0;
                    totalPalletsWeight = 0;
                    totalConsignments = 0;
					consList = '';
                    totalParcelConsignments = 0;
                    totalPalletConsignments = 0;
                    enteredConsignments = 0;
                    printedConsignments = 0;
                    processedConsignments = 0;
                    cancelledConsignments = 0;
					cancelledParcelConsignments = 0;
					cancelledPalletConsignments = 0;
                    PURConsignments = 0;
					PURParcelConsignments = 0;
					PURPalletConsignments = 0;
					
					EPODCollectedPalletConsignments = 0;
					EPODDeliveredPalletConsignments = 0;
					EPODAcceptedPalletConsignments = 0;
					
                    EPODConsignments = 0;
					EPODParcelConsignments = 0;
					EPODPalletConsignments = 0;
					drivers = [];
					driversPallets = [];
                }
				               
                displaySummary = false;
                if (allocateArray == '') {
                    allocateArray = '0';
					currentDriverArray = '0';
                }
                else {
                    allocateArray += ',0';
					currentDriverArray += ',0';
                }
                
				lineNum++;
				                             
           }
            else {
                recNum++;
            }
            
            if (i != rowLimit) { //Skip if rows exhausted at rowLimit we just needed to write the summary line ...
            	if (useTotals){
					var parcelSum = consignmentResults[i].getValue('custcol_consignment_numberofparcels', null, 'sum');
					var parcelWeightSum = consignmentResults[i].getValue('custcol_totalweightparcels', null, 'sum');				
					var palletSum = consignmentResults[i].getValue('custcol_numberofpallets', null, 'sum');
					var palletWeightSum = consignmentResults[i].getValue('custcol_totalweight_pallets', null, 'sum');				
				} else {
					var parcelSum = consignmentResults[i].getValue(consignmentColumns[6]);
					var parcelWeightSum = consignmentResults[i].getValue(consignmentColumns[7]);					
					var palletSum = consignmentResults[i].getValue(consignmentColumns[8]);
					var palletWeightSum = consignmentResults[i].getValue(consignmentColumns[9]);					
				}
                var noParcels = 0;
                if (parcelSum.length > 0) 
                    noParcels = parseInt(parcelSum);
                var weightParcels = 0;
                if (parcelWeightSum.length > 0) 
                    weightParcels = parseInt(parcelWeightSum);                
                var noPallets = 0;
                if (palletSum.length > 0) 
                    noPallets = parseInt(palletSum);				
                var weightPallets = 0;
                if (palletWeightSum.length > 0) 
                    weightPallets = parseInt(palletWeightSum);
                
                var editURL = "&nbsp;";
                var printURL = "&nbsp;";
                var epodURL = "&nbsp;";
                var statusEntered = '';
                var statusPrinted = '';
                var statusProcessed = '';
                var statusCancelled = '';
                var statusSum = 1;
				var statusClass = 0;
				if (useTotals){
					statusSum = parseInt(consignmentResults[i].getValue('number', null, 'count'));
					statusValue = parseInt(consignmentResults[i].getValue('custbody_consignmentstatus', null, 'group'));
					statusClass = consignmentResults[i].getValue('class', null, 'group');
				} else {
					statusValue = parseInt(consignmentResults[i].getValue(consignmentColumns[4]));
					statusClass = consignmentResults[i].getValue(consignmentColumns[11]);
				}
				
				if (statusClass == '6' || statusClass == '10'){ // PUR Classes
				//if (true){ // PUR Classes
					PURConsignments += statusSum;
					if (parseInt(noParcels) > 0) PURParcelConsignments += statusSum;
					if (parseInt(noPallets) > 0) PURPalletConsignments += statusSum;
				}
				
                // Logic based on status to set links as needed ...
                switch (statusValue) {
                    case 1: // entered
                        statusEntered = 'Entered';
                        enteredConsignments += statusSum;
						if (parseInt(noParcels) > 0) enteredParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) enteredPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							//epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                    case 2: // Printed
                        statusPrinted = 'Printed';
                        printedConsignments += statusSum;
						if (parseInt(noParcels) > 0) printedParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) printedPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							//epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                    case 3: // Driver Allocated
                        statusProcessed = 'Allocated';
                        processedConsignments += statusSum;
						if (parseInt(noParcels) > 0) processedParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) processedPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                    case 4: // Cancelled
                        statusCancelled = 'Cancelled';
                        cancelledConsignments += statusSum;
						if (parseInt(noParcels) > 0) cancelledParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) cancelledPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
						}
                        break;
						//EPOD Statuses ...
                    case 7: // Delivered
                        statusProcessed = 'Delivered';
                        EPODDeliveredConsignments += statusSum;
						if (parseInt(noParcels) > 0) EPODDeliveredParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) EPODDeliveredPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                    case 8: // Collected
                        statusProcessed = 'Collected';
                        EPODCollectedConsignments += statusSum;
						if (parseInt(noParcels) > 0) EPODCollectedParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) EPODCollectedPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                    case 9: // Accepted
                        statusProcessed = 'Accepted';
                        EPODAcceptedConsignments += statusSum;
						if (parseInt(noParcels) > 0) EPODAcceptedParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) EPODAcceptedPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                    case 10: // Discrep
                        statusProcessed = 'Discreped';
                        EPODDiscrepConsignments += statusSum;
						if (parseInt(noParcels) > 0) EPODDiscrepParcelConsignments += statusSum;
						if (parseInt(noPallets) > 0) EPODDiscrepPalletConsignments += statusSum;
						if (!useTotals) {
							editURL = "<a href='scriptlet.nl?script=14&deploy=1" + versionParam + "&custparam_tranid=" + consignmentResults[i].getId() + "&custparam_cf=" + consignmentResults[i].getValue(consignmentColumns[9]) + "'>" + consignmentResults[i].getValue(consignmentColumns[1]) + "</a>";
							printURL = "<a href='https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=9&deploy=1" + versionParam + "&custparam_cid=" + consignmentResults[i].getId() + "'>Print</a>";
							epodURL = "<a href='" + consignmentResults[i].getValue(consignmentColumns[8]) + "' target='_blank'>EPOD</a>";
						}
                        break;
                }
                
				//EPODPrompt += " " + statusSum + " " + statusProcessed;
				if (useTotals){
					var thisDriverID = consignmentResults[i].getValue('custbody_driverrun', null, 'group');
					var thisDriverText = consignmentResults[i].getText('custbody_driverrun', null, 'group');
					if (thisDriverText == '- None -') thisDriverText = ''; // The group empty value
				} else {
					var thisDriverID = consignmentResults[i].getValue(consignmentColumns[3]);
					var thisDriverText = consignmentResults[i].getText(consignmentColumns[3]);
				}
				var driverURLMaster = thisDriverText;
				if (driverURLMaster != '' && driverURLMaster != null) {

					var driverFound = false;
					//if (isParcelService && noParcels > 0) {
					if (noParcels > 0  && thisDriverText != 'Unallocated' && thisDriverText != 'Pallets' && thisDriverText != '') {
						for (var dr = 0; dr < drivers.length; dr++) {
							if (drivers[dr] == thisDriverText){
								driverFound = true;
							} 							
						}
					} else {
						driverFound = true;
					}
					
					var driverPalletsFound = false;
					//if (isPalletService && noPallets > 0) {
					if (noPallets > 0 && thisDriverText != 'Unallocated'  && thisDriverText != 'Pallets' && thisDriverText != '') {
						for (var dpr = 0; dpr < driversPallets.length; dpr++) {
							if (driversPallets[dpr] == thisDriverText) {
								driverPalletsFound = true;
							}
						}
					} else {
						driverPalletsFound = true;
					}
					
					if (((isParcelService && noParcels > 0) && !driverFound) || ((isPalletService && noPallets > 0) && !driverPalletsFound)) {
						/*
		 var driverid = consignmentResults[i].getValue(consignmentColumns[3]);
		 var driverRec = nlapiLoadRecord('customrecord_driverrun', driverid);
		 var driverPrompt = driverRec.getFieldValue('custrecord_driverphonenumber');
		 if (driverPrompt != '' && driverPrompt != null) {
		 driverPrompt = " title='Tel: " + driverPrompt + " (" + driverRec.getFieldValue('custrecord_drivername') + ")'";
		 driverPrompt += " alt='Tel: " + driverPrompt + " (" + driverRec.getFieldValue('custrecord_drivername') + ")'";
		 }
		 else {
		 driverPrompt = '';
		 }
		 //var driverURLMaster = "<a href='../../../app/common/custom/custrecordentry.nl?rectype=15&id=" + driverid + "' target='_blank' " + driverPrompt + ">" + consignmentResults[i].getText(consignmentColumns[3]) + "</a>";
		 var driverURLMaster = "<a href='#' target='_blank' " + driverPrompt + ">" + consignmentResults[i].getText(consignmentColumns[3]) + "</a>";
		 */
						if (!driverFound) 
							drivers[drivers.length] = driverURLMaster;
						if (!driverPalletsFound) 
							driversPallets[driversPallets.length] = driverURLMaster;
					}
				}
				
 				//if (showallconsignments == 'T' || isDeliverService) {
                                         
                     
                     if (showallconsignments == 'T') {
					 	var externalRefNo = '';
						if (consignmentResults[i].getValue(consignmentColumns[13]) != null) {
							var externalIDArray = consignmentResults[i].getValue(consignmentColumns[13]).split(":");
							externalRefNo = externalIDArray[1];
						}
                        sublist.setLineItemValue('custpage_' + c + '_col_index', lineNum, consignmentResults[i].getText(consignmentColumns[0]) + " - " + externalRefNo);

                         //sublist.setLineItemValue('custpage_' + c + '_col_consignmentno', lineNum, editURL);
                         if (isParcelService) {
                             sublist.setLineItemValue('custpage_' + c + '_col_drivers', lineNum, consignmentResults[i].getText(consignmentColumns[3]));
                             sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', lineNum, '&nbsp;');
                             sublist.setLineItemValue('custpage_' + c + '_col_parcels', lineNum, consignmentResults[i].getValue(consignmentColumns[6]));
                             sublist.setLineItemValue('custpage_' + c + '_col_parcelsweight', lineNum, consignmentResults[i].getValue(consignmentColumns[7]));
                         }
                         if (isPalletService) {
                             var deliverydate = consignmentResults[i].getValue(consignmentColumns[17]);
                             if (deliverydate == null) 
                                 deliverydate = '';
                             var thisservice = consignmentResults[i].getValue(consignmentColumns[16]);
							 if (thisservice == null) thisservice = '';
                             if (deliverydate != '' || thisservice.slice(0, 1) == 'E') 
                                 thisservice = '<b>' + thisservice + '</b>'
                             //sublist.setLineItemValue('custpage_' + c + '_col_currentdriverid', lineNum, consignmentResults[i].getValue(consignmentColumns[3]));
                             sublist.setLineItemValue('custpage_' + c + '_col_palletdrivers', lineNum, consignmentResults[i].getText(consignmentColumns[3]));
                             sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', lineNum, consignmentResults[i].getValue(consignmentColumns[18]));
                             sublist.setLineItemValue('custpage_' + c + '_col_collectingdepot', lineNum, consignmentResults[i].getValue(consignmentColumns[19]));
                             sublist.setLineItemValue('custpage_' + c + '_col_service', lineNum, thisservice);			
                             sublist.setLineItemValue('custpage_' + c + '_col_dedicateddate', lineNum, deliverydate);						
                             sublist.setLineItemValue('custpage_' + c + '_col_deliverpostcode', lineNum, consignmentResults[i].getValue(consignmentColumns[15]));						
                             sublist.setLineItemValue('custpage_' + c + '_col_pallets', lineNum, Math.round(noPallets) + ' ');
                             sublist.setLineItemValue('custpage_' + c + '_col_palletsweight', lineNum, Math.round(weightPallets) + " kg");
                         }
                         sublist.setLineItemValue('custpage_' + c + '_col_driverselect', lineNum, consignmentResults[i].getValue(consignmentColumns[3]));
                         cidArray += ",0";
                         lineNum++;
                         showIndex++;
                     }

                     
                     if (!useTotals) {
                         lastCid = consignmentResults[i].getId();
                         lastCustFormid = consignmentResults[i].getValue(consignmentColumns[5]);
                         consList += consignmentResults[i].getValue(consignmentColumns[3]) + "/" + consignmentResults[i].getValue(consignmentColumns[13]) + ",";
                         consList = consList.slice(0, 250);
                     }
                     
                     totalConsignments += statusSum;
                     
                     if (isParcelService) {
                         if (noParcels > 0 && statusCancelled == '') 
                             totalParcelConsignments += statusSum;
                         if (PURParcelConsignments > 0 && statusCancelled == '') 
                             totalPURParcels += PURParcelConsignments;
                         if (noParcels > 0 && statusCancelled != '') 
                             totalCancelledParcels += statusSum;
                         if (!isNaN(noParcels) && statusCancelled == '') 
                             totalParcels += parseInt(noParcels);
                         if (!isNaN(weightParcels) && statusCancelled == '') 
                             totalParcelsWeight += parseInt(weightParcels);
                     }
                     
                     if (isPalletService) {
                         if (noPallets > 0 && statusCancelled == '') 
                             totalPalletConsignments += statusSum;
                         if (PURPalletConsignments > 0 && statusCancelled == '') 
                             totalPURPallets += PURPalletConsignments;
                         if (noPallets > 0 && statusCancelled != '') 
                             totalCancelledPallets += statusSum;
                         if (!isNaN(noPallets) && statusCancelled == '') 
                             totalPallets += noPallets;
                         if (!isNaN(weightPallets) && statusCancelled == '') 
                             totalPalletsWeight += weightPallets;
                     }
                     
                     if (showallconsignments == 'T') {
                         if (allocateArray == '') {
                             allocateArray = consignmentResults[i].getId();
                             currentDriverArray = consignmentResults[i].getValue(consignmentColumns[3]);
                         }
                         else {
                             allocateArray += ',' + consignmentResults[i].getId();
                             currentDriverArray += ',' + consignmentResults[i].getValue(consignmentColumns[3]);
                         }
                     }
            } 
          }  //for ( ... i != rowLimit)
		     
        sublist.setLineItemValue('custpage_' + c + '_col_index', 1, '<b>TOTALS ' + classDateselect + '</b>');
        //sublist.setLineItemValue('custpage_' + c + '_col_consignmentno', 1, '<b>TOTAL: ' + grandtotalConsignments + '</b>');
        if (isParcelService) {
        	sublist.setLineItemValue('custpage_' + c + '_col_drivers', 1, '&nbsp;');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', 1, '<b>' + grandtotalParcelConsignments + ' Parcel Consignments</b>');
            //sublist.setLineItemValue('custpage_' + c + '_col_parcelconsignmentno', 1, '<b>Total Parcel Consignments</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcels', 1, '<b>' + grandtotalParcels + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelsweight', 1, '<b>' + grandtotalParcelsWeight + ' KG</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_parcelscancelled', 1, '<b>' + grandtotalCancelledParcels + '</b>');
        }
        if (isPalletService) {
        	sublist.setLineItemValue('custpage_' + c + '_col_palletdrivers', 1, '&nbsp;');
            sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', 1, '<b>' + grandtotalPalletConsignments + ' Pallet Consignments</b>');
            //sublist.setLineItemValue('custpage_' + c + '_col_palletconsignmentno', 1, '<b>Total Pallet Consignments</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_pallets', 1, '<b>' + grandtotalPallets + '</b>');
            sublist.setLineItemValue('custpage_' + c + '_col_palletsweight', 1, '<b>' + grandtotalPalletsWeight + ' KG</b>');           
            sublist.setLineItemValue('custpage_' + c + '_col_palletscancelled', 1, '<b>' + grandtotalCancelledPallets + '</b>');
        }	
			
        if (isDeliverService) {
			var printScript = "var cids = '';"
			if (parseInt(currentClass) == 9) { // TPN Deliveries
				printScriptID = "41"
			} else {
				printScriptID = "23"
			}
			var cidBtnArray = cidArray.split(',');
			printScript += "var cidArray = new Array(" + cidArray + ");"
			printScript += "var allocids = ''; var allocArray = new Array(" + allocateArray + ");";
			printScript += "var useAlloc = ''; allocateParams = ''; for (var a = 1; a <= " + cidBtnArray.length + "; a++) if (nlapiGetLineItemValue('sublist" + c + "', 'custpage_" + c + "_col_printselect', a) == 'T' && allocArray[a-1] != 0) if (allocArray[a-1] == 0) { alert('Please select from list below.') } else { if (allocids != '') {allocids += ',' + allocArray[a-1]} else {allocids = allocArray[a-1]}}; if (allocids != '') useAlloc = '&custparam_usecids=Y&custparam_cids=' + allocids;";
			//printScript += "for (var d = 1; d <= " + cidBtnArray.length + "; d++) if (nlapiGetLineItemValue('sublist" + c + "', 'custpage_" + c + "_col_printselect', d) == 'T' && cidArray[d-1] != 0) if (cidArray[d-1] == 0) { alert('Please select from list below.') } else { if (cids != '') {cids += ',' + cidArray[d-1]} else {cids = cidArray[d-1]}}; if (cids != '' || useAlloc != '') { alert ('./scriptlet.nl?script=" + printScriptID + "&deploy=1" + versionParam + "&custparam_manifestdate=" + classDateselect + "&custparam_driverids=' + cids + useAlloc); window.location='./scriptlet.nl?script=" + printScriptID + "&deploy=1" + versionParam + "&custparam_manifestdate=" + classDateselect + "&custparam_driverids=' + cids + useAlloc} else {alert('Please tick boxes of Delivery Runs to print in the Mark column first. Thank you.')};";
			printScript += "for (var d = 1; d <= " + cidBtnArray.length + "; d++) if (nlapiGetLineItemValue('sublist" + c + "', 'custpage_" + c + "_col_printselect', d) == 'T' && cidArray[d-1] != 0) if (cidArray[d-1] == 0) { alert('Please select from list below.') } else { if (cids != '') {cids += ',' + cidArray[d-1]} else {cids = cidArray[d-1]}}; if (cids != '' || useAlloc != '') { window.location='./scriptlet.nl?script=" + printScriptID + "&deploy=1" + versionParam + "&custparam_manifestdate=" + classDateselect + "&custparam_driverids=' + cids + useAlloc} else {alert('Please tick boxes of Delivery Runs to print in the Mark column first. Thank you.')};";
			sublist.addButton('custpage_printdeliveries', 'Print Marked Delivery Notes', printScript);
			
			//if (showallconsignments == 'T') {
			var allocateBtn = false;
			var allocateBtnArray = allocateArray.split(',');
			for (var abtn=0; abtn < allocateBtnArray.length; abtn++)
				if (allocateBtnArray[abtn] != 0) allocateBtn = true;
			if (allocateBtn){
				var driverScript = "var cids = ''; var cidArray = new Array(" + allocateArray + ");";
				driverScript += "var curdids = ''; var currentDriverArray = new Array(" + currentDriverArray + ");";
				driverScript += "var dids = ''; var didArray = new Array(); for (var d = 1; d <= " + allocateArray.split(',').length + "; d++) { didArray[d-1] = document.getElementById('hddn_sublist" + c + "_custpage_" + c + "_col_driverselect' + d + '_fs').value; if (didArray[d-1] == currentDriverArray[d-1] + '') didArray[d-1] = 0;}";
				driverScript += "allocateParams = ''; for (var d = 1; d <= " + allocateArray.split(',').length + "; d++) { if (parseInt(cidArray[d-1]) != 0 && !isNaN(didArray[d-1]) && didArray[d-1] != 0) { if (allocateParams != '') allocateParams += ','; allocateParams += cidArray[d-1] + ':' + didArray[d-1]; } }";
				//driverScript += "alert('allocateParams=' + allocateParams);";
				driverScript += "if (allocateParams != '') {window.location='./scriptlet.nl?script=43&deploy=1" + versionParam + dtParam + "&custparam_cids=' + allocateParams; } else { alert('Please change at least one Driver Allocation before clicking.'); }"; //Re-allocate them
				sublist.addButton('custpage_allocatedrivers', 'Allocate Deliveries to Drivers', driverScript);
			}
		}
		
        
        if (isPalletService && isCollectService && parseInt(totalPalletConsignments) > 0) {
            printManifestScript = "window.location='" + nlapiResolveURL('SUITELET', 'customscript_deliverymanifestpallets_v2', 'customdeploy_deliverymanifestpallets_v2') + versionParam + "&custparam_class=" + currentClass + dtParam + "&custparam_manifestdate=" + dateselect + "'";
            sublist.addButton('custpage_printpalletmanifest', 'Print Manifest', printManifestScript);
        }
		
		} //if (rowLimit < maxRowsAllowed) {
        else {
            sublist.setLineItemValue('custpage_' + c + '_col_index', 1, 'Number of consignments exceeds limit (' + rowLimit + " listed).");
        }
      //sublist.setLineItemValue('custpage_' + c + '_col_driverrun', 1, '&nbsp;');
    } // if(consignmentResults)
    //}
 }   
 
 response.writePage(form);
 
 if (versionParam == "&version=2")
 	nlapiLogExecution('AUDIT', 'Transport_Manager:' + classDateselect , "CONSIGNMENTS:" + totalConsignments  + ":REMAINING:" + theContext.getRemainingUsage());

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

function getUserDepotNo(){
	var depotNo = '95';
	if (parseInt(nlapiGetContext().getRole()) == 1005) depotNo = '25';
	if (parseInt(nlapiGetContext().getRole()) == 1006) depotNo = '29';
	return depotNo;
}

function isCustomerCenter(){
	var isCenter = false;
	if (parseInt(nlapiGetContext().getRole()) == 1001 || parseInt(nlapiGetContext().getRole()) == 1005 || parseInt(nlapiGetContext().getRole()) == 1006) isCenter = true;
	return isCenter;
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
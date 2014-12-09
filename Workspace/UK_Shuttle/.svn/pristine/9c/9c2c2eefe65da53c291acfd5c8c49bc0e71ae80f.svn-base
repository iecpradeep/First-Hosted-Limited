function optionSelector(request, response){

	var theContext = nlapiGetContext();
    var user = theContext.getUser();
    var role = theContext.getRole();
    var mainMenu = false;
    var newWindow = '';
    var newWindowHTML = '" target="_blank"'; // Could be set to empty if no pref set
    var printOnSave = '';
    var params = "&menu=T";
    var lastConsignmentID = null;
    var lastConsignmentTypeID = null;
    var closeTime = "";
    var FridayCloseTime = "";
    var readyTime = "";
    
    var dateToday = "T";
	var allowPUR = "T";
    var servicesAvailable = 1; //Default pallet & parcel - overridden if customer record different (see below)
    var servicesAvailableText = 'PALLET AND PARCEL';
    var PAYGcustomer = false; //Pay As You Go - overridden if customer record different (see below)
	var onHold = false;
	
    var dateTodayDT = getLocalDate();
	var sDTparam = dateTodayDT.getDate() + '/' + (dateTodayDT.getMonth() * 1 + 1) + '/' + dateTodayDT.getFullYear();
	var dateLastWeekDT = nlapiAddDays(dateTodayDT, -7)
	var sLWDTparam = dateLastWeekDT.getDate() + '/' + (dateLastWeekDT.getMonth() * 1 + 1) + '/' + dateLastWeekDT.getFullYear();
	
    var now = new Date();
    var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
    if (nowHours >= 24) 
        nowHours -= 24;
    
    if ((now.getMonth() > 2 && now.getMonth() < 9) || (now.getMonth() == 2 && now.getDate() > 27) || (now.getMonth() == 9 && now.getDate() < 28))
        nowHours += 1; //Daylight savings approximation!
    if (ignoredateToday != 'T') {
        if (nowHours >= 18 && nowHours <= 24) 
            dateToday = "F";
    }
    params += '&custparam_datetoday=' + dateToday;

    if (nowHours >= 12 || (nowHours == 11 && now.getMinutes() >= 30)) 
        allowPUR = "F";
    
    if ((request.getParameter('custparam_cid') != '' && request.getParameter('custparam_cid') != null)) {
    	lastConsignmentID = request.getParameter('custparam_cid');
    } else {
    	lastConsignmentID = nlapiLookupField('customer', user, 'custentity_lastconsignment_created', false);
    }
    params += '&custparam_cid=' + lastConsignmentID;

    if ((request.getParameter('custparam_typeid') != '' && request.getParameter('custparam_typeid') != null)) {
    	lastConsignmentTypeID = request.getParameter('custparam_typeid');
    } else {
    	if (lastConsignmentID){
    		lastConsignmentTypeID = nlapiLookupField('salesorder', lastConsignmentID, 'custbody_palletparcel', false);
    	}
    }
    params += '&custparam_typeid=' + lastConsignmentTypeID;

    if ((request.getParameter('custpage_newwindow') == 'T' || request.getParameter('custpage_newwindow') == null) || (request.getParameter('custparam_newwindow') == 'T' || request.getParameter('custparam_newwindow') == 'F')) {
        if (request.getParameter('custpage_newwindow') == 'T' || request.getParameter('custparam_newwindow') == 'T') {
            newWindow = 'T';
        }
        else {
        	if (request.getParameter('custpage_newwindow') == null && request.getParameter('custparam_newwindow') == null)
            newWindow = 'F';
        }
      
    }
    params += '&custparam_newwindow=' + newWindow;

    if (newWindow == 'F' || newWindow == '')
    	newWindowHTML = '"';
    
    if ((request.getParameter('custpage_printonsave') == 'T' || request.getParameter('custpage_printonsave') == null) || (request.getParameter('custparam_printonsave') == 'T' || request.getParameter('custparam_printonsave') == 'F')) {
        if (request.getParameter('custpage_printonsave') == 'T' || request.getParameter('custparam_printonsave') == 'T') {
        	printOnSave = 'T';
        }
        else {
        	if (request.getParameter('custpage_printonsave') == null && request.getParameter('custparam_printonsave') == null)
        	printOnSave = 'F';
        }
    }
    params += '&custparam_printonsave=' + printOnSave;

    if (isCustomerCenter()) { //Check if can ignore time cut-off and services ...
        var custRecord = nlapiLoadRecord('customer', user);
        var ignoredateToday = custRecord.getFieldValue('custentity_ignoreclosemessage');
        servicesAvailable = custRecord.getFieldValue('custentity_availableservicetypes');
        closeTime = custRecord.getFieldValue('custentity_closetime');
        FridayCloseTime = custRecord.getFieldValue('custentity_fridayclosetime');
        readyTime = custRecord.getFieldValue('custentity_readytime');
		if (servicesAvailable == null || servicesAvailable == '')
			servicesAvailable = 1; // restore as a precaution
		if (servicesAvailable != 1)  // Set the text to Pallet or Parcel
			servicesAvailableText = nlapiLookupField('customlist_servicetype', (4 - servicesAvailable), 'name').toUpperCase();
		if (custRecord.getFieldText('creditholdoverride') == 'On')
			onHold = true;
		if (custRecord.getFieldValue('custentity_payg') == 'T')
			PAYGcustomer = true;
		if (custRecord.getFieldValue('custentity_use_login_menu') == 'T')
			mainMenu = true;
		if (newWindow == '')
			newWindow = custRecord.getFieldValue('custentity_login_menu_open_newwindow');
		if (printOnSave == '')
			printOnSave = custRecord.getFieldValue('custentity_login_menu_print_onsave');
        var CustCommitFields = new Array('custentity_login_menu_open_newwindow', 'custentity_login_menu_print_onsave');
        var CustCommitData = new Array(newWindow, printOnSave);
		nlapiSubmitField('customer', user, CustCommitFields, CustCommitData, false);
	    nlapiLogExecution('DEBUG', 'nlapiSubmitField:' + user, 'newWindow:' + newWindow + ' printOnSave:' + printOnSave);
    }
    	
	if (!(isCustomerCenter() && mainMenu))
	//if (1==2)
		{
			nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
		}
		else
		{
			/*
			if (lastConsignmentID != '' && lastConsignmentTypeID != '') {
                var params = new Array();
                params['custparam_cid'] = lastConsignmentID;

				if (lastConsignmentTypeID == '1')
					nlapiSetRedirectURL('SUITELET','customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter', false, params);
				if (lastConsignmentTypeID == '2')
					nlapiSetRedirectURL('SUITELET','customscript_labelpalletprinter', 'customdeploy_deploypalletprinter', false, params);
    		} else {
    		*/			
			var theContext = nlapiGetContext();
			var thisCMscript = theContext.getScriptId();
			//var thisCMdeployment = theContext.getDeploymentId();
			var thisCMdeployment = "customdeploy1";
			var thisCMscriptNo = "12";
			var versionParam = "&version=1";

			var thisTMscript = 'customscript_transportmanager';
			var thisTMdeployment = 'customdeploy_transportmanager';
			var thisTMscriptNo = "17";

			// Alternate version
			if (thisCMscript == 'customscript_consignmentmanager_v2')
			{
				versionParam = "&version=2";
				thisTMscript = 'customscript_transportmanagerv2';
				thisTMdeployment = 'customdeploy_transportmanagerv2';
				thisCMscriptNo = "42";
				thisTMscriptNo = "40";
			}

			var quotesV2URL = nlapiResolveURL('SUITELET', 'customscript_quotations_v2', 'customdeploy_quotations_v2');
			var enterConsignmentURL = nlapiResolveURL('SUITELET', 'customscript_formselector', 'customdeploy_formselector')	+ versionParam;
			var parcelGuideURL = "https://system.netsuite.com/core/media/media.nl?id=57305&c=1169462&h=32f691acc3006a531e3a&_xt=.pdf";
			var palletGuideURL = "https://system.netsuite.com/core/media/media.nl?id=32&c=1169462&h=efe11c9bd1a04db91fd9&_xt=.pdf";
			var parcelLabellingGuideURL = "https://system.netsuite.com/core/media/media.nl?id=110156&c=1169462&h=ef8922af19cd72cca893&_xt=.pdf";
			var consManagerURL = nlapiResolveURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
			var parcelPrintURL = nlapiResolveURL('SUITELET','customscript_apcparcellabelprint', 'customdeploy_apcparcellabelprinter') + params;
			var palletPrintURL = nlapiResolveURL('SUITELET','customscript_labelpalletprinter', 'customdeploy_deploypalletprinter') + params;
			
			var manifestParams = "&custparam_dtfrom=" + sDTparam + "&custparam_dt=" + sDTparam + "&custparam_ignoredates=F&custparam_manifestdate=" + sDTparam + "&custparam_showall=null&custparam_cn=0";
			var parcelManifestTodayURL = nlapiResolveURL('SUITELET','customscript_printmanifest', 'customdeploy_printmanifest') + manifestParams;
			var palletManifestTodayURL = nlapiResolveURL('SUITELET','customscript_printmanifestpallets', 'customdeploy_printmanifestpallets_deploy') + manifestParams;
			var thirtyDayReportURL= '../../../app/common/search/searchresults.nl?searchid=410';
			
			//var consManagerTodayURL = consManagerURL + "&custparam_dt=" + nlapiDateToString(dateTodayDT, 'date');
			//var consManagerLastWeekURL = consManagerTodayURL + "&custparam_dtfrom=" + nlapiDateToString(nlapiAddDays(dateTodayDT, -7), 'date');
			var consManagerTodayURL = consManagerURL + "&custparam_dt=" + sDTparam;
			var consManagerLastWeekURL = consManagerTodayURL + "&custparam_dtfrom=" + sLWDTparam;
			//var consManagerURL = nlapiResolveURL('SUITELET', 'customscript_consignmentmanager_v2', 'customdeploy_consignmentmanager_v2');

			var parcelHTURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '110' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			var parcelTHURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '109' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			var parcelTTURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '108' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			
			var palletHTURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '117' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			var palletTHURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '116' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			var palletTTURL = '../../../app/accounting/transactions/salesord.nl?cf='
				+ '115' + '&dt=' + sDTparam + '&pr=' + allowPUR + params;
			
			var form = nlapiCreateForm('Main Menu - Please select an option from the list below');
			
			var parcelgroup = form.addFieldGroup('parcelgroup', 'Parcel Bookings');
			parcelgroup.setShowBorder(true);
			parcelgroup.setSingleColumn(true);

			var palletgroup = form.addFieldGroup('palletgroup', 'Pallet Bookings');
			palletgroup.setShowBorder(true);
			palletgroup.setSingleColumn(true);
			
			//if (isTestUser()) {
				var manifestgroup = form.addFieldGroup('manifestgroup',	'Reports and Daily Manifests');
				manifestgroup.setShowBorder(true);
				manifestgroup.setSingleColumn(true);
			//}

			var consmanagergroup = form.addFieldGroup('consmanagergroup', 'Consignment Management');
			consmanagergroup.setShowBorder(true);
			consmanagergroup.setSingleColumn(true);
			
			var prefsgroup = form.addFieldGroup('prefsgroup', 'Preferences - click \'Update Preferences\' button to save changes.');
			prefsgroup.setShowBorder(true);
			prefsgroup.setSingleColumn(true);
						
			var docsgroup = form.addFieldGroup('docsgroup', 'Help and Guideline Documents');
			docsgroup.setShowBorder(true);
			docsgroup.setSingleColumn(true);

			var labelsPrinted = '';
			
		if (lastConsignmentID != null && lastConsignmentID != '' && lastConsignmentTypeID != '' && lastConsignmentTypeID != null) {
			var orderRec = nlapiLoadRecord('salesorder', lastConsignmentID);

            if (isTestUser() && orderRec.getFieldValue('custbody_saveandnew') == 'T') { //Check for save & new
                var formID = orderRec.getFieldValue('custbody_formid');
                if (formID == 107) // Temp fix
               	 formID = 110;
               if (formID == 114) // Temp fix
              	 formID = 117;

               var saveNewUrl = '../../../app/accounting/transactions/salesord.nl?cf='
					+ formID + '&dt=' + dateToday + '&pr=' + allowPUR + '&menu=T';
               
                var params = new Array();
                params['cf'] = formID;
                params['dt'] = 'T';
                params['pr'] = 'F';
                nlapiSubmitField('salesorder', lastConsignmentID, 'custbody_saveandnew', 'F', false); //Prevents re-occuring on edit as a backup
                
                var html = '<html></head><meta HTTP-EQUIV=\"REFRESH\" content=\"0;url=' + saveNewUrl + '\"></head></html>';
                response.write(html);

                //nlapiSetRedirectURL('RECORD', 'salesorder', null, false, params);
            }
       
            if (orderRec.getFieldValue('custbody_consignmentstatus') <= 3) {
				var printgroup = form.addFieldGroup('printgroup',
						'Consignment Details - click link to print label(s)');
				printgroup.setShowBorder(true);
				printgroup.setSingleColumn(true);

				if (isTestUser()) {

	                var parcelPrintField = form.addField('custpage_cons_details0', 'text', ' ', null, 'printgroup');
					parcelPrintField.setDisplayType('inline');
					parcelPrintField
							.setDefaultValue('<table style="font-size: 8pt;font-weight: bold;"><tr><td>Consignment Date :</td><td>'
									+ orderRec.getFieldValue('trandate')
									+ '</td></tr>'
									+ '<tr><td>Driver Allocated :</td><td>'
									+ orderRec
											.getFieldText('custbody_driverrun')
									+ '</td></tr>' + '</table>');
				}
				var parcelPrintField = form.addField('custpage_cons_details1',
						'text', ' ', null, 'printgroup');
				parcelPrintField.setDisplayType('inline');
				parcelPrintField
						.setDefaultValue('<table style="font-size: 8pt;font-weight: bold;"><tr><td>Consignment No. :</td><td>'
								+ orderRec.getFieldValue('tranid')
								+ '</td></tr>'
								+ '<tr><td>Service :</td><td>'
								+ orderRec
										.getFieldValue('custbody_labelservice')
								+ '</td></tr>'
								+ '<tr><td>Item(s) :</td><td>'
								+ orderRec
										.getFieldValue('custbody_labelparcels')
								+ '</td></tr>' + '</table>');
				labelsPrinted = orderRec
						.getFieldValue('custbody_lastlabelprinted')
						+ '/'
						+ orderRec.getFieldValue('custbody_labelparcels')
						+ ' labels printed';
				var parcelPrintField = form.addField('custpage_cons_details2',
						'text', ' ', null, 'printgroup');
				parcelPrintField.setDisplayType('inline');
				parcelPrintField
						.setDefaultValue('<table style="font-size: 8pt;font-weight: bold;">'
								+ '<tr><td>Weight (Kg) :</td><td>'
								+ orderRec
										.getFieldValue('custbody_labeltotalweight')
								+ '</td></tr>'
								+ '<tr><td>Consignee :</td><td>'
								+ orderRec.getFieldValue('custbody_delname')
								+ '</td></tr>'
								+ '<tr><td>Postcode :</td><td>'
								+ orderRec
										.getFieldValue('custbody_deliverypostcode')
								+ '</td></tr></table>');
			} // orderRec.getFieldValue('custbody_consignmentstatus') <= 3
			else {
				lastConsignmentID = null;
			}
		}
			

		if (servicesAvailableText.indexOf('PARCEL') >= 0){

			// ============ PARCELS ===========

			var parcelHTField = form.addField('custpage_parcel_ht', 'text', '',
					null, 'parcelgroup');
			parcelHTField.setDisplayType('inline');
			parcelHTField.setDefaultValue('<a href="' + parcelHTURL + newWindowHTML
					+ '>Send a Parcel</a>');

			var parcelTHField = form.addField('custpage_parcel_th', 'text', '',
					null, 'parcelgroup');
			parcelTHField.setDisplayType('inline');
			parcelTHField.setDefaultValue('<a href="' + parcelTHURL + newWindowHTML
					+ '>Book a Collection (<b>There to Here</b>)</a>');

			var parcelTTField = form.addField('custpage_parcel_tt', 'text', '',
					null, 'parcelgroup');
			parcelTTField.setDisplayType('inline');
			parcelTTField
			.setDefaultValue('<a href="'
					+ parcelTTURL
					+ newWindowHTML
					+ '>Book a 3rd Party Parcel Collection (<b>There to There</b>)</a>');

			if (lastConsignmentID != null && lastConsignmentID != ''
				&& lastConsignmentTypeID == '1') {
				var parcelPrintField = form.addField('custpage_parcel_print',
						'text', '', null, 'printgroup');
				parcelPrintField.setDisplayType('inline');
				parcelPrintField
				.setDefaultValue('<a href="'
						+ parcelPrintURL
						+ '"><img src="../../../images/chiles/buttons/menu_print_notriangle.png" valign="middle" /><b>  Print Label</b></a>');

				if (labelsPrinted != '') {
					var parcelLabelsPrintField = form.addField(
							'custpage_parcel_printlabels', 'text', '', null,
					'printgroup');
					parcelLabelsPrintField.setDisplayType('inline');
					parcelLabelsPrintField.setDefaultValue(labelsPrinted);
				}
			}

			var Blank2Field = form.addField('custpage_blank2', 'text', '', null,
			'parcelgroup');
			Blank2Field.setDisplayType('inline');
			Blank2Field.setDefaultValue('');

		}

		if (servicesAvailableText.indexOf('PALLET') >= 0){

			// ============ PALLETS ===========

			var palletHTField = form.addField('custpage_pallet_ht', 'text', '',
					null, 'palletgroup');
			palletHTField.setDisplayType('inline');
			palletHTField.setDefaultValue('<a href="' + palletHTURL + newWindowHTML
					+ '>Send pallet(s)</a>');

			var palletTHField = form.addField('custpage_pallet_th', 'text', '',
					null, 'palletgroup');
			palletTHField.setDisplayType('inline');
			palletTHField.setDefaultValue('<a href="' + palletTHURL + newWindowHTML
					+ '>Book a pallet Collection (<b>There to Here</b>)</a>');

			var palletTTField = form.addField('custpage_pallet_tt', 'text', '',
					null, 'palletgroup');
			palletTTField.setDisplayType('inline');
			palletTTField
			.setDefaultValue('<a href="'
					+ palletTTURL
					+ newWindowHTML
					+ '>Book a 3rd Party pallet Collection (<b>There to There</b>)</a>');

			if (lastConsignmentID != '' && lastConsignmentTypeID == '2') {
				var palletPrintField = form.addField('custpage_pallet_print',
						'text', '', null, 'printgroup');
				palletPrintField.setDisplayType('inline');
				palletPrintField
				.setDefaultValue('<a href="'
						+ palletPrintURL
						+ '"><img src="../../../images/chiles/buttons/menu_print_notriangle.png" valign="middle" /><b>  Print Label</b></a>');

				if (labelsPrinted != '') {
					var palletLabelsPrintField = form.addField(
							'custpage_pallet_printlabels', 'text', '', null,
					'printgroup');
					palletLabelsPrintField.setDisplayType('inline');
					palletLabelsPrintField.setDefaultValue(labelsPrinted);
				}
			}

			var Blank3Field = form.addField('custpage_blank3', 'text', '', null,
			'palletgroup');
			Blank3Field.setDisplayType('inline');
			Blank3Field.setDefaultValue('');

		}
		
		// ============== DOCUMENTS ===============
		if (servicesAvailableText.indexOf('PARCEL') >= 0){
			var parcelGuideField = form.addField('custpage_parcelguide', 'text',
					'', null, 'docsgroup');
			parcelGuideField.setDisplayType('inline');
			parcelGuideField
			.setDefaultValue('<a href="'
					+ parcelGuideURL
					+ newWindowHTML
					+ '>A PDF Guide for APC parcel services, weight / size limits.</a>');

			var parcelLabelGuideField = form.addField('custpage_parcellabelguide',
					'text', '', null, 'docsgroup');
			parcelLabelGuideField.setDisplayType('inline');
			parcelLabelGuideField.setDefaultValue('<a href="'
					+ parcelLabellingGuideURL + newWindowHTML
					+ '>A PDF Guide for correct APC labelling of packages.</a>');
		}
		
		if (servicesAvailableText.indexOf('PALLET') >= 0){
			var palletGuideField = form.addField('custpage_palletguide', 'text',
					'', null, 'docsgroup');
			palletGuideField.setDisplayType('inline');
			palletGuideField
			.setDefaultValue('<a href="'
					+ palletGuideURL
					+ newWindowHTML
					+ '>A PDF Guide for pallet services, weight / size limits.</a>');
		}
		
		var Blank5Field = form.addField('custpage_blank5', 'text', '', null,
				'docsgroup');
		Blank5Field.setDisplayType('inline');
		Blank5Field.setDefaultValue('');

		/*
		var quotesV2Field = form.addField('custpage_quotesv2', 'text',
				'Parcel Quick Quote', null, 'parcelgroup');
		quotesV2Field.setDisplayType('inline');
		quotesV2Field
				.setDefaultValue('<a href="'
						+ quotesV2URL
						+ newWindowHTML + '>Obtain a parcel price quote for a given post code, weight and number of parcels.</a>');
		 */

		var consManagerTodayField = form.addField('custpage_consmanagertoday',
				'text', '', null, 'consmanagergroup');
		consManagerTodayField.setDisplayType('inline');
		consManagerTodayField.setDefaultValue('<a href="' + consManagerTodayURL
				+ newWindowHTML + '>View Today\'s Consignments</a>');

		var consManagerLastWeekField = form.addField(
				'custpage_consmanagerlastweek', 'text', '', null,
				'consmanagergroup');
		consManagerLastWeekField.setDisplayType('inline');
		consManagerLastWeekField.setDefaultValue('<a href="'
				+ consManagerLastWeekURL + newWindowHTML
				+ '>View Last Week\'s Consignments</a>');

		var consManagerField = form.addField('custpage_consmanager', 'text',
				'', null, 'consmanagergroup');
		consManagerField.setDisplayType('inline');
		consManagerField
				.setDefaultValue('<a href="'
						+ consManagerURL
						+ newWindowHTML
						+ '>Search by customer reference, date, service type, post code, etc.</a>');

		var Blank1Field = form.addField('custpage_blank1', 'text', '', null,
				'consmanagergroup');
		Blank1Field.setDisplayType('inline');
		Blank1Field.setDefaultValue('');

		// ================= PREFERENCES ================
		var newWindowbox = form.addField('custpage_newwindow', 'checkbox',
				'Open pages in new window / tab', null, 'prefsgroup');
		if (newWindow != '' && newWindow != null) {
			newWindowbox.setDefaultValue(newWindow);
		}

		if (closeTime != '' && closeTime != null) {
			var closeTimeField = form.addField('custpage_closetime', 'text',
					'Close Time is', null, 'prefsgroup');
			closeTimeField.setDisplayType('inline');
			closeTimeField.setDefaultValue('<b>' + closeTime
					+ '</b> - the time your business closes Monday-Thursday');
		}

		if (FridayCloseTime != '' && FridayCloseTime != null) {
			var FridayCloseTimeField = form.addField(
					'custpage_fridayclosetime', 'text', 'Friday Close Time is',
					null, 'prefsgroup');
			FridayCloseTimeField.setDisplayType('inline');
			FridayCloseTimeField.setDefaultValue('<b>' + FridayCloseTime
					+ '</b> - the time your business closes Friday');
		}

		if (readyTime != '' && readyTime != null) {
			var readyTimeField = form.addField('custpage_readytime', 'text',
					'Ready Time is', null, 'prefsgroup');
			readyTimeField.setDisplayType('inline');
			readyTimeField
					.setDefaultValue('<b>'
							+ readyTime
							+ '</b> - latest time to have consignments ready to collect');
		}

		var Blank6Field = form.addField('custpage_blank6', 'text', '', null,
				'prefsgroup');
		Blank6Field.setDisplayType('inline');
		Blank6Field.setDefaultValue('');

		// =============== MANIFESTS ================
		
		if (servicesAvailableText.indexOf('PARCEL') >= 0){
			var parcelManifestTodayField = form.addField(
					'custpage_parcelmanifesttoday', 'text', '', null,
			'manifestgroup');
			parcelManifestTodayField.setDisplayType('inline');
			parcelManifestTodayField.setDefaultValue('<a href="'
					+ parcelManifestTodayURL + newWindowHTML
					+ '>View\/print Today\'s Parcel Manifest</a>');
		}
		
		if (servicesAvailableText.indexOf('PALLET') >= 0){
			var palletManifestTodayField = form.addField(
					'custpage_palletmanifesttoday', 'text', '', null,
			'manifestgroup');
			palletManifestTodayField.setDisplayType('inline');
			palletManifestTodayField.setDefaultValue('<a href="'
					+ palletManifestTodayURL + newWindowHTML
					+ '>View\/print Today\'s Pallet Manifest</a>');
		}
		
		var thirtyDayReportField = form.addField('custpage_30dayreport',
				'text', '', null, 'manifestgroup');
		thirtyDayReportField.setDisplayType('inline');
		thirtyDayReportField.setDefaultValue('<a href="' + thirtyDayReportURL
				+ newWindowHTML + '>View Last 30 Day\'s Report</a>');

		var Blank4Field = form.addField('custpage_blank4', 'text', '', null,
				'manifestgroup');
		Blank4Field.setDisplayType('inline');
		Blank4Field.setDefaultValue('');

		/*
		 var printOnSavebox = form.addField('custpage_printonsave',
		 'checkbox', 'Print label after each booking', null,
		 'prefsgroup'); if (printOnSave != '' && printOnSave != null) {
		 printOnSavebox.setDefaultValue(printOnSave); }
		 */

		theContext.setSessionObject('mm_params', versionParam + params
				+ "&custparam_mm=Y");
		form.addSubmitButton('Update Preferences');

		response.writePage(form);

		//} // Else print on save
	}
}
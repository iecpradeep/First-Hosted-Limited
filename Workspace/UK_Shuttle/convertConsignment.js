function convertConsignment(request, response) {
	// Converts any type 2 sales order to type 1
	var orderid = request.getParameter('custparam_id');
	var currentRecord = nlapiLoadRecord('salesorder', orderid);

	var ErrMsg = '';
	
	if (currentRecord.getFieldValue('custbody_palletparcel') == '1') {

		var deliveryType = getDeliveryType(
				currentRecord.getFieldValue('class'), currentRecord
						.getFieldValue('custbody_receivingdepot'));
		// var shipType = currentRecord.getFieldValue('custbody_palletparcel');
		var shipType = '2';
		var customForm = currentRecord.getFieldValue('customform');
		var custID = currentRecord.getFieldValue('entity');

	    userRecord = nlapiLoadRecord('customer', custID);
	    var companyName = userRecord.getFieldValue('companyname');
	    var companyAddr = userRecord.getFieldValue('defaultaddress');
	    var theAcct = userRecord.getFieldValue('entityid');
	    var fuelPercent = userRecord.getFieldValue('custentity_fuelsurcharge');   
	    if (isNaN(fuelPercent) || fuelPercent == null || fuelPercent == '') {
	        fuelPercent = 0.00;
	    }
	    else {
	        fuelPercent = parseFloat(fuelPercent);
	    }	

	    var formCols = new Array('custrecord_formservicetype',
				'custrecord_formusertype', 'custrecord_formdeliverytype');
		var formVals = new Array(shipType, 2, 3);
		if (deliveryType == 'HT') {
			correctForm = getFormMatrixFormID(formCols, formVals);
		} else {
			if (deliveryType == 'TH') {
				formVals[2] = 1;
				correctForm = getFormMatrixFormID(formCols, formVals);
			} else { // Must be TT
				formVals[2] = 2;
				correctForm = getFormMatrixFormID(formCols, formVals)
			}
		}
		currentRecord.setFieldValue('customform',correctForm);
		currentRecord.setFieldValue('custbody_formid',correctForm);

		var d = getLocalDate();
		var tranDate = nlapiDateToString(d, 'date');
		currentRecord.setFieldValue('trandate', tranDate);

		// Set up the right area / zone etc.
		var isValidPostCode = false;
		var shipCountry = 1;
		var shipPostCode = '';
		var type = 'delivery';
		var deliveryType = getDeliveryType(currentRecord
				.getFieldValue('class'), currentRecord
				.getFieldValue('custbody_receivingdepot'));
		if (deliveryType != 'HT')
			type = 'pickup';

		var repricedStatus = '1'; // Entered by Default
		if (currentRecord.getFieldValue('custbody_receivingdepot') == ''
				|| currentRecord.getFieldValue('custbody_receivingdepot') == null
				|| currentRecord.getFieldValue('custbody_receivingdepot') == '0') {
			repricedStatus = '1'; // Entered as not already a defined
			// depot
			currentRecord.setFieldValue('custbody_syntheticimport', 'T');
		}
		var formCols = new Array('custrecord_formservicetype',
				'custrecord_formusertype', 'custrecord_formdeliverytype');
		var formVals = new Array(2, 2, 3); // Pallet, Admin, HT

		if (type == 'delivery') {
			shipPostCode = currentRecord
					.getFieldValue('custbody_deliverypostcode');
			shipCountry = currentRecord
					.getFieldValue('custbody_deliverycountryselect');
		} // if
		else {
			shipPostCode = currentRecord
					.getFieldValue('custbody_pickupaddresspostcode');
			shipCountry = currentRecord
					.getFieldValue('custbody_pickupcountryselect');
		} // else
		ErrMsg += " PostCode = " + shipPostCode + " : ";
		//nlapiLogExecution('DEBUG', 'DeliveryType: ' + type, shipPostCode + " : " + shipCountry);
		if (shipPostCode && shipCountry) {
			if (isValidPostcode(shipPostCode, shipCountry)) {
				var postcodePrefix = returnCountryPostcodePrefix(shipPostCode,
						shipCountry);
				currentRecord.setFieldValue('custbody_postcodezone',
						postcodePrefix);
				var postcodeSearchFilters = new Array();
				var postcodeSearchColumns = new Array();

				postcodeSearchFilters[0] = new nlobjSearchFilter('name', null,
						'is', postcodePrefix);
				postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive',
						null, 'is', 'F');

				postcodeSearchColumns[0] = new nlobjSearchColumn('name');
				postcodeSearchColumns[1] = new nlobjSearchColumn(
						'custrecord_tpnzone');
				postcodeSearchColumns[2] = new nlobjSearchColumn(
						'custrecord_pricingzone');
				postcodeSearchColumns[3] = new nlobjSearchColumn(
						'custrecord_deliverydepot');

				var postcodeSearchResults = nlapiSearchRecord(
						'customrecord_pallet_postcodelookup', null,
						postcodeSearchFilters, postcodeSearchColumns);

				// retrieve area and depot number
				if (postcodeSearchResults) {
					var area = postcodeSearchResults[0]
							.getValue(postcodeSearchColumns[2]);
					var deldepot = postcodeSearchResults[0]
							.getValue(postcodeSearchColumns[3]);
					var tpnzone = postcodeSearchResults[0]
							.getValue(postcodeSearchColumns[1]);

					// populate custom fields
					currentRecord.setFieldValue('custbody_pallet_zone',
							area);
					if (type == 'delivery') {
						currentRecord.setFieldValue(
								'custbody_receivingdepot', deldepot);
						currentRecord.setFieldValue(
								'custbody_palletdeliveryzone', tpnzone);
					} else {
						currentRecord.setFieldValue(
								'custbody_palletcollectingdepot', deldepot);
						currentRecord.setFieldValue(
								'custbody_sendingdepot', deldepot);
					}
					// if (isTestUser()) alert('prefix = ' + postcodePrefix +
					// '\ndepot = ' + deldepot);
				} // if
				ErrMsg = 'DELIVERY:Pallet Zone ' + area + ' Depot ' + deldepot
						+ ' ' + ' Delzone ' + tpnzone + ' ';
			} // if
			else {
				ErrMsg = 'ERROR:Postcode ' + shipPostCode
						+ ' not a valid format.';
			}
		} // if
		// Area setup completed

		// Work out form conversion parcel - pallet
		var palletSize = 1;
		var currentItem = currentRecord.getLineItemValue('item', 'item', 1);
		var numberOfParcels = parseInt(currentRecord.getLineItemValue('item',
				'custcol_consignment_numberofparcels', 1));
		var consignmentWeight = parseInt(currentRecord.getLineItemValue('item',
				'custcol_totalweightparcels', 1));

		currentRecord.setLineItemValue('item', 'item', 1, 91); // ND internal
																// id
		currentRecord.setLineItemValue('item', 'custcol_palletsize', 1, palletSize);
		currentRecord.setLineItemValue('item', 'custcol_numberofpallets', 1, 1);
		currentRecord.setLineItemValue('item', 'custcol_totalweight_pallets',
				1, consignmentWeight);

		var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
		var palletCount = nlapiGetLineItemCount('recmachcustrecord_palletlistconsignmentlookup');

		currentRecord.selectNewLineItem('recmachcustrecord_palletlistconsignmentlookup');
		currentRecord.setCurrentLineItemValue(
				'recmachcustrecord_palletlistconsignmentlookup',
				'custrecord_palletlistsizelookup', 1);
		currentRecord.setCurrentLineItemValue(
				'recmachcustrecord_palletlistconsignmentlookup',
				'custrecord_palletlistquantity', 1);
		currentRecord.setCurrentLineItemValue(
				'recmachcustrecord_palletlistconsignmentlookup',
				'custrecord_palletlistweight', consignmentWeight);

		var sizeRecord = nlapiLoadRecord('customrecord_palletsize',	palletSize);

			currentRecord.setCurrentLineItemValue(
					'recmachcustrecord_palletlistconsignmentlookup',
					'custrecord_palletlistdepth', sizeRecord.getFieldValue('custrecord_maxlength'));
			currentRecord.setCurrentLineItemValue(
					'recmachcustrecord_palletlistconsignmentlookup',
					'custrecord_palletlistwidth', sizeRecord
							.getFieldValue('custrecord_maxwidth'));
			currentRecord.setCurrentLineItemValue(
					'recmachcustrecord_palletlistconsignmentlookup',
					'custrecord_palletlistheight', sizeRecord
							.getFieldValue('custrecord_maxheight'));

		currentRecord
				.commitLineItem('recmachcustrecord_palletlistconsignmentlookup');

	    //currentRecord.setFieldValue('custbody_servicetype', '2');
	    currentRecord.setFieldValue('custbody_palletparcel', '2');

	    ErrMsgObj = new Object();
		ErrMsgObj.ErrMsg = ErrMsg;
		var pricedConsingmentRec = getPalletRates(currentRecord, ErrMsgObj);

		var amount = pricedConsingmentRec.getLineItemValue('item', 'amount', 1);
		var service = currentRecord.getLineItemText('item', 'item', 1);
		currentRecord.setFieldValue('custbody_labelservice', service);
				
		var parcels = parseInt(currentRecord.getLineItemValue('item', 'custcol_numberofpallets', 1));
		var parcelweight = parseFloat(currentRecord.getLineItemValue('item', 'custcol_totalweight_pallets', 1));
		
		var insurance = parseFloat(pricedConsingmentRec.getFieldValue('custbody_insurancesurcharge'));
		if (isNaN(insurance) || insurance == null || insurance == '') {
			insurance = 0.00;
		}
		else {
			insurance = parseFloat(insurance).toFixed(2);
		}
		currentRecord.setFieldValue('custbody_insurancesurcharge', insurance);
		
		var fuelsurcharge = parseFloat(pricedConsingmentRec.getFieldValue('custbody_fuelsurcharge'));
		if (isNaN(fuelsurcharge) || fuelsurcharge == null || fuelsurcharge == '') {
			fuelsurcharge = 0.00;
		}
		else {
			fuelsurcharge = parseFloat(fuelsurcharge);
		}
		if (fuelPercent > 0.00) 
			fuelsurcharge = (parseFloat(fuelPercent / 100) * parseFloat(amount)).toFixed(4);
		currentRecord.setFieldValue('custbody_fuelsurcharge', fuelsurcharge);
				
		//pricedConsignmentRec.setFieldValue('custbody_consignmentstatus', '5'); // Processed
		currentRecord.setLineItemValue('item', 'taxcode', 1, 115); //SR-GB 	
		currentRecord.setLineItemValue('item', 'amount', 1, amount);
		currentRecord.setLineItemValue('item', 'rate', 1, amount);
		currentRecord.setLineItemValue('item', 'custcol_fuelsurchargeamount', 1, fuelsurcharge);

		currentRecord.setFieldValue('class', '1'); //TPN Class by default
	    currentRecord.setFieldValue('custbody_palletrequestingdepot', getPalletDepotNo());
	    currentRecord.setFieldValue('custbody_sendingdepot', getPalletDepotNo()); 
	    currentRecord.setFieldValue('custbody_palletcollectingdepot', getPalletDepotNo()); 

	    currentRecord.setFieldValue('memo', 'Parcel => Pallet : ' + ErrMsgObj.ErrMsg);
	    
	    nlapiLogExecution('DEBUG', 'Convert Consignment: '
				+ currentRecord.getFieldValue('tranid'), 
				' trandate: ' + currentRecord.getFieldValue('trandate') + 
				' customform: ' + currentRecord.getFieldValue('customform') + 
				' depot: ' + deldepot + ' zone: ' + tpnzone + 
				' weight: ' + consignmentWeight + 
				' numberOfParcels: ' + numberOfParcels + 
				' servicetype: ' + currentRecord.getFieldValue('custbody_palletparcel'));
		var internalid = nlapiSubmitRecord(currentRecord, false, true);
		nlapiLogExecution('DEBUG', 'Conversion Results: ' + internalid, ErrMsgObj.ErrMsg);

	}

	// Go back to Consignment manager
	//window.location = './salesord.nl?id=' + dupSearchResults[parseInt(dupChoice)-1].getValue(dupSearchColumns[5]) + '&cf=' + formId + '&e=T&whence='
	//nlapiSetRedirectURL('SUITELET', 'customscript_consignmentmanager', 'customdeploy1');
    var formID = currentRecord.getFieldValue('customform');
    var params = new Array();
    params['cf'] = formID;
    params['dt'] = 'T';
    params['pr'] = 'F';
    params['custparam_cn'] = request.getParameter('custparam_cn');
    params['custparam_ct'] = request.getParameter('custparam_ct');
    params['ct'] = request.getParameter('ct');
    params['custparam_dt'] = request.getParameter('custparam_dt');
    params['custparam_dtfrom'] = request.getParameter('custparam_dtfrom');
    params['custparam_custref'] = request.getParameter('custparam_custref');
    params['custparam_custname'] = request.getParameter('custparam_custname');
    params['custparam_consno'] = request.getParameter('custparam_consno');
    params['custparam_postcode'] = request.getParameter('custparam_postcode');
    params['custparam_delname'] = request.getParameter('custparam_delname');
    params['custparam_extdocref'] = request.getParameter('custparam_extdocref');
    params['custparam_service'] = request.getParameter('custparam_service');
    params['custparam_servicetype'] = request.getParameter('custparam_servicetype');
    params['custparam_dr'] = request.getParameter('custparam_dr');
    params['version'] = request.getParameter('version');
    params['selectedtab'] = 'subtab7';

    //nlapiLogExecution('DEBUG', 'custbody_saveandnew Script Id:' + soRecordId, 'custbody_saveandnew:' + saveNew + ' customform:' + formID);
    if (!isCustomerCenter()) 
        nlapiSubmitField('salesorder', internalid, 'custbody_saveandnew', 'F', false); //Prevents re-occuring on edit as a backup
    nlapiSetRedirectURL('RECORD', 'salesorder', internalid, true, params);
	//nlapiSetRedirectURL('RECORD', 'customscript_consignmentmanager', 'customdeploy1');
}


/*
 * Post Code operations
 */

//To be used on field change action.  If field changed is postcode then validate the postcode, 
//lookup the area and populate the relevant fields on the form.
function validateCountryPostcode(type){
 var isValidPostCode = false;
 
 if (type == 'delivery') {
     shipPostCode = nlapiGetFieldValue('custbody_deliverypostcode');
     shipCountry = nlapiGetFieldValue('custbody_deliverycountryselect');
 } //if
 else {
     shipPostCode = nlapiGetFieldValue('custbody_pickupaddresspostcode');
     shipCountry = nlapiGetFieldValue('custbody_pickupcountryselect');
 } //else
 // var shipPostCode = nlapiGetFieldValue('shipzip'); //deprecated
 
 if (shipPostCode && shipCountry) {
     if (isValidPostcode(shipPostCode, shipCountry)) {
			//var surcharge = parseFloat(getPostcodeSurcharge(shipPostCode, true, 0));
			//if (surcharge > 0){
			//	nlapiSetFieldValue('custbody_surcharge_postcode', surcharge, false, false);
			//} 
         var postcodePrefix = returnCountryPostcodePrefix(shipPostCode, shipCountry);
         nlapiSetFieldValue('custbody_postcodezone', postcodePrefix, false, false);
         
         if (nlapiGetFieldValue('custbody_palletparcel') == '2') { //Pallet lookup
             // search for postcode area record
             var postcodeSearchFilters = new Array();
             var postcodeSearchColumns = new Array();
             
             postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
             postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
             
             postcodeSearchColumns[0] = new nlobjSearchColumn('name');
             postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_tpnzone');
             postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_pricingzone');
             postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deliverydepot');
             
             var postcodeSearchResults = nlapiSearchRecord('customrecord_pallet_postcodelookup', null, postcodeSearchFilters, postcodeSearchColumns);
             
             // retrieve area and depot number
             if (postcodeSearchResults) {
                 var area = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
                 var deldepot = postcodeSearchResults[0].getValue(postcodeSearchColumns[3]);
                 var tpnzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
                 
                 // populate custom fields
                 nlapiSetFieldValue('custbody_pallet_zone', area, false, false);
                 if (type == 'delivery') {
                     nlapiSetFieldValue('custbody_receivingdepot', deldepot, false, false);
                     nlapiSetFieldValue('custbody_palletdeliveryzone', tpnzone, false, false);
                 }
                 else {
                     nlapiSetFieldValue('custbody_palletcollectingdepot', deldepot, false, false);
						nlapiSetFieldValue('custbody_sendingdepot', deldepot, false, false);
                 }
					//if (isTestUser()) alert('prefix = ' + postcodePrefix + '\ndepot = ' + deldepot);
             } //if				
         }
         else { // Parcel lookup
             // search for postcode area record

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
             //if (postcodeSearchResults) {
					var area = postcodeSearchResults[0].getValue(postcodeSearchColumns[0]);
					var altArea = '';
					var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
					if (currentItem != '') 
						altArea = getAltAreaforServiceArea(area, currentItem); // Check if any special rules for certain areas e.g. Eire / NI	
					var depot = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
					var delzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
					nlapiSetFieldValue('custbody_deliverydays', postcodeSearchResults[0].getValue(postcodeSearchColumns[3]), false, false);
					
					// Local exceptions custom list check - added July 2011
					//if (isTestUser()){
						//alert(getPostCodeLocalException(shipPostCode));
						var depotexception = getPostCodeLocalException(shipPostCode);
						if (depotexception != 0) depot = depotexception; // This overrides the 'real' depot with the local
					//}
					
					// populate custom fields
					
					if (type == 'delivery') {
						nlapiSetFieldValue('custbody_parcelarea', area, false, false);
						if (altArea != area) 
							nlapiSetFieldValue('custbody_parcelarea2', altArea, false, false);
						nlapiSetFieldValue('custbody_receivingdepot', depot, false, false);
						nlapiSetFieldValue('custbody_parceldeliveryzone', delzone, false, false);
					} //if
					else {
						nlapiSetFieldValue('custbody_collectparcelarea', area, false, false);
						if (altArea != area) 
							nlapiSetFieldValue('custbody_collectparcelarea2', altArea, false, false);
						nlapiSetFieldValue('custbody_sendingdepot', depot, false, false);
					} //else
				/*
				}
				else { // Postcode does not exist
					alert('Postcode ' + shipPostCode + ' not in lookup database.');
				}//if searchresults parcel
				*/
        		isValidPostCode = true;
         }
      } //if
     else {
         alert('Postcode ' + shipPostCode + ' not a valid format.');
     }
 } //if
 return isValidPostCode;
 
} //function
//Tests to see if string is in correct UK style post code format, e.g. X99 9XX or XX99 9XX.
function isValidPostcode(postcode, countryID){
 if (countryID == 2) {
     return checkEirePostCode(postcode); // Ireland
 }
 else {
     return checkPostCode(postcode); // Uk by default
 }
} //function
//Lookup Post Code Table list custom record ...
function getPostCodeLookupValue(postcode, value){
 var postcodePrefix = returnPostcodePrefix(postcode);
 var result = null;
 
 // search for postcode area record
 var postcodeSearchFilters = new Array();
 var postcodeSearchColumns = new Array();
 
 postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
 postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
 
 postcodeSearchColumns[0] = new nlobjSearchColumn('name');
 if (value.toLowerCase() == 'area') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_area');
 if (value.toLowerCase() == 'depot') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_depotnumber');
 if (value.toLowerCase() == 'parcelzone') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_parceldeliveryzone');
 if (value.toLowerCase() == 'postcode') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('name');
 if (value.toLowerCase() == 'deliverydays') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_deldays');
 if (value.toLowerCase() == 'weektime') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_weektime');
 if (value.toLowerCase() == 'sattime') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_sattime');
 
 var postcodeSearchResults = nlapiSearchRecord('customrecord_postcodetable', null, postcodeSearchFilters, postcodeSearchColumns);
 
 // retrieve area and depot number
 if (postcodeSearchResults) {
     result = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
 }
 //alert ("Prefix = " + postcodePrefix + " result = " + result);
 return result;
}

//Lookup Post Code Table Pallet list custom record ...
function getPalletPostCodeLookupValue(postcode, value){
 //if (postcode.length > 3) {
     var postcodePrefix = returnPostcodePrefix(postcode);
 //}
 //else {
 //    var postcodePrefix = postcode;
 //}
 
 var result = null;
 
 // search for postcode area record
 var postcodeSearchFilters = new Array();
 var postcodeSearchColumns = new Array();
 
 postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
 postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
 
 postcodeSearchColumns[0] = new nlobjSearchColumn('name');
 if (value.toLowerCase() == 'area') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecordarea');
 if (value.toLowerCase() == 'class') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_palletclass');
 if (value.toLowerCase() == 'palletzone') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_pricingzone');
 if (value.toLowerCase() == 'postcode') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('name');
 if (value.toLowerCase() == 'depot') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_deliverydepot');
 if (value.toLowerCase() == 'internalid') 
     postcodeSearchColumns[1] = new nlobjSearchColumn('internalid');
 
 var postcodeSearchResults = nlapiSearchRecord('customrecord_pallet_postcodelookup', null, postcodeSearchFilters, postcodeSearchColumns);
 
 // retrieve area and depot number
 if (postcodeSearchResults) {
     result = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
 }
 
 return result;
}

//Lookup any entry in Custom List - customlist_localpostcodeexceptions
function getPostCodeLocalException(postcode){

 var theDepot = 0;
 
 //Strip off the leftmost prefix for testing
 var thePrefix = returnPostcodePrefix(postcode);
 var AlphaPC = ''; // will be the prefix first part e.g. WA
 var NumericPC = ''; // will be prefix last part e.g. 15
 for (var p = 0; p < thePrefix.length; p++) {
     var thePChar = thePrefix.substring(p, p + 1);
     if (/[A-z]/i.test(thePChar) && NumericPC == '') 
         AlphaPC += thePChar;
     if (/[0-9]/.test(thePChar)) 
         NumericPC += thePChar;
 }
 //alert('Prefix = ' + thePrefix + '\nAlpha = ' + AlphaPC + '\nNumeric = ' + NumericPC);
 
 var col = new Array();
 var SearchFilters = new Array();
 col[0] = new nlobjSearchColumn('name');
 col[1] = new nlobjSearchColumn('internalId');
 SearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
 //alert('Search start ...');
 var results = nlapiSearchRecord('customrecord_localpostcodeexceptions', null, null, col);
 //alert('Search end ...');
 
 for (var r = 0; results != null && r < results.length; r++) {
     var exceptionCode = results[r].getValue('name');
     var ExclAlpha = ''; // Alpha part always present
     var ExclNumeric = ''; // will be set if a numeric present
     for (var e = 0; e < exceptionCode.length; e++) {
         var theEChar = exceptionCode.substring(e, e + 1);
         if (/[A-z]/i.test(theEChar) && ExclNumeric == '') 
             ExclAlpha += theEChar;
         if (/[0-9]/.test(theEChar)) 
             ExclNumeric += theEChar;
     }
     if ((ExclNumeric == '' && ExclAlpha == AlphaPC) || (ExclNumeric == NumericPC && ExclAlpha == AlphaPC)) {
     	//alert('LOCAL Exception = ' + exceptionCode + '\nExclAlpha = ' + ExclAlpha + '\nExclNumeric = ' + ExclNumeric);
         theDepot = getParcelDepotNo();
         break;
     }
 }
 
 return theDepot;
}

function getValidPostcode(postcode, countryID){
 if (countryID == 2) {
     return checkEirePostCode(postcode); // Ireland
 }
 else {
     if (checkPostCode(postcode)) {
         return checkPostCode(postcode)
     }
     else {
         return null
     }
 }
} //function
//Formats a postcode to uppercase and retrieves the first portion for use in postcode table lookup.
function returnPostcodePrefix(postcode){
 var thePC = checkPostCode(postcode);
 if (thePC) {
     var pcArray = thePC.split(' ');
     return pcArray[0];
 }
 else {
     var thePC2 = checkEirePostCode(postcode); // Ireland
     if (thePC2) {
         var pcArray2 = thePC2.split(' ');
         return pcArray2[0];
     }
     else {
         return '';
     }
 }
}//function
function returnCountryPostcodePrefix(postcode, countryID){
 if (countryID == 2) {
     return checkEirePostCode(postcode); // Ireland
 }
 else {
 
     var thePC = checkPostCode(postcode);
     if (thePC) {
         var pcArray = thePC.split(' ');
         return pcArray[0];
     }
     else {
         return '';
     }
 }
} //function
function returnEirePostCodePrefix(toCheck){
 var isValid = '';
	// Open the parameters record
 var paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
 var EIREarray = paramRecord.getFieldValue('custrecord_param_eirecodes').split(',');
	for (var pc=0; pc < EIREarray.length; pc++){
		if (toCheck.substring(0,EIREarray[pc].length) == EIREarray[pc]){
			isValid = toCheck;
			break;
		}
	}
 return isValid;
}

function checkEirePostCode(toCheck){
 var isValid = '';
	// Open the parameters record
 var paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
 var EIREarray = paramRecord.getFieldValue('custrecord_param_eirecodes').split(',');
	for (var pc=0; pc < EIREarray.length; pc++){
		if (toCheck.substring(0,EIREarray[pc].length) == EIREarray[pc]){
			isValid = toCheck;
			break;
		}
	}
 return isValid;
}

function getEIREorDUB(theCountyCode){
 // convert a TPN county code to APC EIRE or DUB equivalent
	var theResult = 'EIRE'; // by default
 paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
 var EIRECodes = paramRecord.getFieldValue('custrecord_param_eirecodes').split(',');
 var EIRECounties = paramRecord.getFieldValue('custrecord_eiretowncounty').split(',');
 if (EIRECodes.length == EIRECounties.length) {
     for (var ec = 0; ec < EIRECodes.length; ec++) {
			if (EIRECodes[ec] == theCountyCode && EIRECounties[ec].indexOf("DUBLIN") >= 0) theResult = 'DUB';
		}
 }
	return theResult;
}

function getPostCodeforServiceArea(thePostCode, theService){
 var theCode = thePostCode; //Asume by default it is not changed ...
 var theArea = parseInt(getPostCodeLookupValue(thePostCode, 'area'));
 if (theArea == 1) { // N Ireland Belfast city
     if (theService == 'ROAD') 
         theCode = "RD1"
 }
 if (theArea == 2) { // Belfast
     if (theService == 'ROAD') 
         theCode = "RD2"
 }
 if (theArea == 3) { // Dublin
     if (theService == 'ROAD') 
         theCode = "RD3"
 }
 if (theArea == 4) { // EIRE
     if (theService == 'ROAD') 
         theCode = "RD4"
     if (theService == 'RD16') 
         theCode = "RD4"
     if (theService == 'TDAY') 
         theCode = "EIRE"
 }
 
 return theCode;
}

function getAltAreaforServiceArea(theArea, theService){
 var theCode = theArea; //Assume by default it is not changed ...
 if (theArea == 1) { // N Ireland Belfast city
     if (parseInt(theService) == 64) 
         theCode = 33;
 }
 if (theArea == 2) { // Belfast
     if (parseInt(theService) == 64) 
         theCode = 34;
 }
 if (theArea == 3) { // Dublin
     if (parseInt(theService) == 64) 
         theCode = 35; //ROAD
     if (parseInt(theService) == 65) 
         theCode = 35; //RD16
 }
 if (theArea == 4) { // EIRE
     if (parseInt(theService) == 64) 
         theCode = 36;
     if (parseInt(theService) == 65) 
         theCode = 36; //RD16
     if (parseInt(theService) == 35) 
         theCode = 4; //TDAY
 }
 return theCode;
}

/*==============================================================================
Application:   Utiity Function
Author:        John Gardner
Version:       V1.0
Date:          18th November 2003
Description:   Used to check the validity of a UK postcode
Version:       V2.0
Date:          8th March 2005
Description:   BFPO postcodes implemented.
The rules concerning which alphabetic characters are alllowed in
which part of the postcode were more stringently implementd.

Parameters:    toCheck - postcodeto be checked.
This function checks the value of the parameter for a valid postcode format. The
space between the inward part and the outward part is optional, although is
inserted if not there as it is part of the official postcode.
If the postcode is found to be in a valid format, the function returns the
postcode properly formatted (in capitals with the outward code and the inward
code separated by a space. If the postcode is deemed to be incorrect a value of
false is returned.

Example call:

if (checkPostCode (myPostCode)) {
alert ("Postcode has a valid format")
}
else {alert ("Postcode has invalid format")};

------------------------------------------------------------------------------*/
function checkPostCode(toCheck){

 // Permitted letters depend upon their position in the postcode.
 var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
 var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
 var alpha3 = "[abcdefghjkstuw]"; // Character 3
 var alpha4 = "[abehmnprvwxy]"; // Character 4
 var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
 // Array holds the regular expressions for the valid postcodes
 var pcexp = new Array();
 
 // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
 pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
 
 // Expression for postcodes: ANA NAA
 pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
 
 // Expression for postcodes: AANA  NAA
 pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));
 
 // Exception for the special postcode GIR 0AA
 pcexp.push(/^(GIR)(\s*)(0AA)$/i);
 
 // Standard BFPO numbers
 pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);
 
 // c/o BFPO numbers
 pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);
 
 // Load up the string to check
 var postCode = toCheck;
 
 // Assume we're not going to find a valid postcode
 var valid = false;
 
 // Check the string against the types of post codes
 for (var i = 0; i < pcexp.length; i++) {
     if (pcexp[i].test(postCode)) {
     
         // The post code is valid - split the post code into component parts
         pcexp[i].exec(postCode);
         
         // Copy it back into the original string, converting it to uppercase and
         // inserting a space between the inward and outward codes
         postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();
         
         // If it is a BFPO c/o type postcode, tidy up the "c/o" part
         postCode = postCode.replace(/C\/O\s*/, "c/o ");
         
         // Load new postcode back into the form element
         valid = true;
         
         // Remember that we have found that the code is valid and break from loop
         break;
     }
 }
 
 // Return with either the reformatted valid postcode or the original invalid 
 // postcode
 if (valid) {
     return postCode;
 }
 else 
     return false;
}

function getFormMatrixLookup(formId, colvalue, isText){
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

function getPostcodeSurcharge(postCode, showAlert, items){
 var surcharge = 0;
 var searchCode = checkPostCode(postCode);  
 if (searchCode) {
		// search for postcode area record
		var postcodeSearchFilters = new Array();
		var postcodeSearchColumns = new Array();
		
		postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', searchCode);
		postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		
		postcodeSearchColumns[0] = new nlobjSearchColumn('name');
		postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_surcharge_fromdate');
		postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_surcharge_todate');
		postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_surcharge_description');
		postcodeSearchColumns[4] = new nlobjSearchColumn('custrecord_surcharge_parcels');
		postcodeSearchColumns[5] = new nlobjSearchColumn('custrecord_surcharge_pallets');
		postcodeSearchColumns[6] = new nlobjSearchColumn('custrecord_surcharge_parcels_peritem');
		postcodeSearchColumns[7] = new nlobjSearchColumn('custrecord_surcharge_pallets_peritem');
		
		var postcodeSearchResults = nlapiSearchRecord('customrecord_postcodes_dates_surcharges', null, postcodeSearchFilters, postcodeSearchColumns);
		
		// retrieve area and depot number
		if (postcodeSearchResults) {
			var fromDate = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
			var toDate = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
			var desc = postcodeSearchResults[0].getValue(postcodeSearchColumns[3]);
			var packageAlert = "";
			if (nlapiGetFieldValue('custbody_palletparcel') == '2') { //Pallet
				surcharge = parseFloat(postcodeSearchResults[0].getValue(postcodeSearchColumns[5])) + (items * parseFloat(postcodeSearchResults[0].getValue(postcodeSearchColumns[7])));
				packageAlert = "Surcharge GBP: " + postcodeSearchResults[0].getValue(postcodeSearchColumns[5]) + "\nPer Pallet additional surcharge (GBP) : " + items + " x " + postcodeSearchResults[0].getValue(postcodeSearchColumns[7]);
			}
			else { // Parcel
				surcharge = parseFloat(postcodeSearchResults[0].getValue(postcodeSearchColumns[4])) + (items * parseFloat(postcodeSearchResults[0].getValue(postcodeSearchColumns[6])));
				packageAlert = "Surcharge GBP: " + postcodeSearchResults[0].getValue(postcodeSearchColumns[4]) + "\nPer Parcel additional surcharge (GBP) : " + items + " x " + postcodeSearchResults[0].getValue(postcodeSearchColumns[6]);
			}
			if (showAlert) alert ( "Please Note: there is a surcharge for post code " + searchCode + " owing to 2012 Olympics.\n\nFrom " + fromDate + " to " + toDate + "\n\nReason: " + desc + "\n\n" + packageAlert+ "\n\nTotal (GBP) : " + surcharge);
		}
	}
 return surcharge;
}


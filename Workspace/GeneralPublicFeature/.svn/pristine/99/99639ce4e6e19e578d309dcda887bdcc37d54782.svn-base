/*
 * HTML / CSS Definitions
 */

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

function getHeadNode()
{
	var htmlHead = '<head>'; //head start element
	htmlHead += CSS_DEFINITION;
	htmlHead += '</head>'; //head end element
	return htmlHead;
}

function createReportHeader()
{

	var reportTitle = 'Consolidated Super Sales Order (SSO) for : ' + theAcct;

	var header = '<tr><td colspan=\"13\" align=\"center\"><h1>' + reportTitle + '</h1></td></tr>';
	header += '<tr><td>DOCNUM</td><td>DATE</td><td>SVCE</td><td>TYPE</td><td>CONSIGNEE</td><td>REF.</td><td>TOWN</td><td width="15mm" style="width:20mm">PCODE</td><td>ITEMS</td><td>WT.</td><td>PRICE</td><td>FUEL</td><td>CLOSE</td></tr>';
	header += '<tr><td colspan=\"13\" style=\"border-top:solid black 2px;\"></td></tr>';
	return header;
}

function createReportFooter(totalConsignments, totalCartons, totalWeight)
{
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

/*
 *  User & Role Functions
 */

function isTestUser() //Used to display trace dialogues as needed
{
	var testMode = false;
	if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 7 || parseInt(nlapiGetContext().getUser()) == 873) 
		testMode = true; // 8 = TESTCOMPANY	
	return testMode;
}

function isCustomerService()
{
	var isService = false;
	var theRole = parseInt(nlapiGetContext().getRole());
	if (theRole == 3 || theRole == 1003 || theRole == 1009 || theRole == 1010) 
	{
		isService = true;
	}
	return isService;
}

function isCustomerCenter()
{
	var isCenter = false;
	var theRole = parseInt(nlapiGetContext().getRole());
	if (theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1005 || theRole == 1006 || theRole == 1007 || theRole == 1008 || theRole == 1015) 
	{
		isCenter = true;
	}
	return isCenter;
}

function isCustomerCenterFinancials()
{
	var isCenter = false;
	var theRole = parseInt(nlapiGetContext().getRole());
	if (theRole == 14 || theRole == 1015) 
	{
		isCenter = true;
	}
	return isCenter;
}

function isAdvancedSearch()
{
	var isSearch = false;
	var theContext = nlapiGetContext();
	var theRole = parseInt(theContext.getRole());
	var theUser = parseInt(theContext.getUser());
	//if (theRole == 3 || theRole == 1009) 
	//if (theRole == 1009) 
	if (theRole == 3 || theRole == 14 || theRole == 1001 || theRole == 1002 || theRole == 1009 || theRole == 1015 || theRole == 1010  || theUser == 7 || theUser == 777 || isTransport()) 
	{
		isSearch = true;
	}
	return isSearch;
}

function isTransport()
{
	var isTransport = false;
	var theRole = parseInt(nlapiGetContext().getRole());
	if (theRole == 1003 || theRole == 1014) 
	{
		isTransport = true;
	}
	return isTransport;
}

function getUserDepotNo()
{
	var depotNo = '95';
	var theContext = nlapiGetContext();
	if (parseInt(theContext.getRole()) == 1005) 
	{
		depotNo = '25';
	}
	if (parseInt(theContext.getRole()) == 1006) 
	{
		depotNo = '29';
	}
	return depotNo;
}

function getParcelDepotNo()
{
	var depotNo = '95';
	var paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
	if (paramRecord)
	{
		depotNo = paramRecord.getFieldValue('custrecord_parceldepot_id');
	}
	return depotNo;
}

function getPalletDepotNo()
{
	var depotNo = '16';
	var paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
	if (paramRecord)
	{
		depotNo = paramRecord.getFieldValue('custrecord_palletdepot_id');
	}
	return depotNo;
}
/*
 * Form and services types lookups
 */

function getmatrixFormID(theService, theOrderType, theDeliveryType, theUserType)
{
	var result = null;

	var formColumns = new Array;
	var formFilters = new Array;
	formFilters[0] = new nlobjSearchFilter('custrecord_formservicetype', null, 'is', theService);
	formFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	formFilters[2] = new nlobjSearchFilter('custrecord_formordertype', null, 'is', theOrderType);
	formFilters[3] = new nlobjSearchFilter('custrecord_formdeliverytype', null, 'is', theDeliveryType);
	formFilters[4] = new nlobjSearchFilter('custrecord_formusertype', null, 'is', theUserType);

	formColumns[0] = new nlobjSearchColumn('name');

	var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
	if (formResults) 
	{
		result = formResults[0].getValue(formColumns[0]);
	}

	//alert("getmatrixFormID : " + theService + "," + theOrderType + "," + theDeliveryType + "," + theUserType + " ==> " + result);
	return result;
}

function getFormMatrixLookupValue(formId, colvalue, isText)
{
	var result = null;

	var formColumns = new Array;
	var formFilters = new Array;
	formFilters[0] = new nlobjSearchFilter('name', null, 'is', formId);
	formFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

	formColumns[0] = new nlobjSearchColumn('name');
	formColumns[1] = new nlobjSearchColumn(colvalue);

	var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
	if (formResults) 
	{
		if (isText) 
		{
			result = formResults[0].getText(formColumns[1]);
		}
		else 
		{
			result = formResults[0].getValue(formColumns[1]);
		}

		//if (isTestUser()) alert ( formId + " : " + colvalue + " => " + result.toLowerCase());

		return result.toLowerCase();
	}
}

function getFormMatrixFormID(colsSearch, colsValues)
{
	var result = null;

	var formColumns = new Array;
	var formFilters = new Array;
	if (colsSearch != null && colsValues != null) 
	{
		if (colsSearch.length == colsValues.length) 
		{
			for (var f = 0; f < colsSearch.length; f++) 
			{
				formFilters[f] = new nlobjSearchFilter(colsSearch[f], null, 'anyof', colsValues[f]);
				//alert(colsSearch[f] + ":" + colsValues[f]);
			}			
			formColumns[0] = new nlobjSearchColumn('name');

			var formResults = nlapiSearchRecord('customrecord_formidmatrix', null, formFilters, formColumns);
			if (formResults) 
			{
				result = formResults[0].getValue(formColumns[0]);
				//alert("getFormMatrixFormID ==> " + result);
				return result;
			}
		}
	}
}

function getFormShipType(customForm)
{
	return getFormMatrixLookupValue(customForm, 'custrecord_formservicetype', true);
}

function getFormOrderType(customForm)
{
	return getFormMatrixLookupValue(customForm, 'custrecord_formordertype', true);
}

function getFormDeliveryType(customForm)
{
	var theDeliveryID = getFormMatrixLookupValue(customForm, 'custrecord_formdeliverytype', false);
	if (parseInt(theDeliveryID) == 1) 
	{
		return 'TH';
	}
	else 
		if (parseInt(theDeliveryID) == 2) 
		{
			return 'TT';
		}
		else 
		{
			return 'HT';
		}
}


function getDeliveryType(theClass,deliveryDepot)
{
	var thisDepot = getParcelDepotNo();
	if (parseInt(theClass) == 6 || parseInt(theClass) == 10)
	{
		if (parseInt(deliveryDepot) == thisDepot || deliveryDepot == thisDepot) 
		{
			//if (parseInt(deliveryDepot) == 95 || deliveryDepot == '95') {
			return 'TH';
		}
		else 
		{
			return 'TT';
		}
	}
	else  
	{
		return 'HT';
	}
}

/*
 *  Date & Time functions
 */

function getLongMonth(theMonth)
{
	var m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
	return m[parseInt(theMonth - 1)];
}

var abortScript = false;

function getLongDay(theDay)
{
	if (parseInt(theDay) <= 9) 
	{
		return '0' + theDay;
	}
	else 
	{
		return theDay;
	}
}

function getLocalDate()
{ //Adjusts for UTC and daylight savings
	var now = new Date();
	var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
	if (nowHours >= 24) 
	{
		nowHours -= 24;
	}
	if ((now.getMonth() > 2 && now.getMonth() < 9) || (now.getMonth() == 2 && now.getDate() > 27) || (now.getMonth() == 9 && now.getDate() < 28)) 
	{
		nowHours += 1; //Daylight savings approximation!
	}
	if (nowHours >= 24) 
	{
		now = nlapiAddDays(now, 1); //Is tomorrow already
	}
	return now;
}

function getNextWorkingDate(startdate)
{
	var d = new Date();
	if (!startdate) 
	{
		d = getLocalDate();
	} 
	else 
	{
		d = startdate;
	}
	var adddays = 1; //Default, will be adjusted if Fri-Sat ...
	var dow = d.getDay(); //Day of week
	if (dow == 5 || dow == 6) 
	{
		adddays = (8 - dow); //i.e. Monday
	}
	d = nlapiAddDays(d, adddays);
	return d;
}

/*
 * Pallet services
 */

function getServicesforArea(theArea, getText)
{ //Comma list of services available
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

	if (defSearchResults) 
	{
		for (var s = 0; s < defSearchResults.length; s++) 
		{
			if (services != '') 
			{
				services += ',';
			}
			if (getText) 
			{
				//services += defSearchResults[s].getText(defSearchColumns[0]) + "|" + defSearchResults[s].getValue(defSearchColumns[3]);
				services += defSearchResults[s].getText(defSearchColumns[0]);
			}
			else 
			{
				services += defSearchResults[s].getValue(defSearchColumns[0]);
			}
		}
	}
	return services;
}


function getPalletRates(theConsRecord, ErrMsgObj){

	var ErrMsg = "";
	//Check pallet list first and set totals for service
	//if (type == 'recmachcustrecord_palletlistconsignmentlookup') {
	var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
	var palletCount = nlapiGetLineItemCount('recmachcustrecord_palletlistconsignmentlookup');
	//alert('palletCount = ' + palletCount + '\npalletIndex = ' + palletIndex);

	if (palletCount > 0 || palletIndex > 0) 
	{
		//var listCount = palletCount;
		//if (palletIndex > listCount) 
		//	listCount = palletIndex;
		var totalPallets = 0;
		var totalWeight = 0;
		for (var lc = 1; lc <= palletCount; lc++) 
		{ // 1 or more pallet lines exist already
			if (lc != palletIndex) 
			{
				var palletWeight = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', lc);
				var pallets = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', lc);
				if (!isNaN(palletWeight) && !isNaN(pallets)) 
				{
					//alert(lc + ' : weight = ' + palletWeight + '\npallets = ' + pallets);
					totalWeight += parseInt(palletWeight);
					totalPallets += parseInt(pallets);
				}
			}
		}
		if (palletIndex > 0) 
		{ // First or additional item line				
			var newpalletWeight = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight');
			var newpallets = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity');
			if (!isNaN(newpalletWeight) && !isNaN(newpallets)) 
			{
				totalWeight += parseInt(newpalletWeight);
				totalPallets += parseInt(newpallets);
			}
		}
		if (!isNaN(totalWeight) && !isNaN(totalPallets)) 
		{
			ErrMsg += 'Input valid pallet weight / quantity combination. Weight=' + totalWeight + ' Qty=' + totalPallets;
			return false;
		}
	}

	//    return true;
	//}

	/*
    if (parseInt(nlapiGetCurrentLineItemIndex('item')) > 1) // 2nd item ...
    {
        alert('Only one delivery service item allowed per consignment / quotation.');
        nlapiCancelLineItem('item');
        nlapiSelectLineItem('item', 1);
        return false;
    }
	 */

	// Retrieve the current item selected	
	var currentItem = theConsRecord.getLineItemValue('item', 'item', 1);
	var currentItemText = theConsRecord.getLineItemText('item', 'item', 1);
	var currentItemArray = currentItemText.split(' ');
	//alert(currentItemText);
	var theDate = new Date();

	//var theSaturdayServices = ["SAT", "SATL", "SATT", "STTL"];
	//for (var ss = 0; ss < theSaturdayServices.length; ss++) {
	//	//if (isTestUser()) alert ("Day=" + theDate.getDay() + "\n" + currentItem + " = " + theSaturdayServices[ss] + "?");
	//	if (currentItemArray[0] == theSaturdayServices[ss] && theDate.getDay() != 5) { //Saturday Service but not a Friday ...
	//    	ErrMsg += 'Please Note: Saturday Service selected but today is not Friday.\nPlease select another service.';
	//		return false;
	//	}
	//}

	//Loading the item record fails in Customer Center so using 'hack' above ...
	//var currentItemRecord = nlapiLoadRecord('serviceitem', currentItem);

	// Retrieve the current pallet size
	var palletSize = theConsRecord.getLineItemValue('item', 'custcol_palletsize',1);
	var palletQty = theConsRecord.getLineItemValue('item', 'custcol_numberofpallets',1);
	var palletWeight = theConsRecord.getLineItemValue('item', 'custcol_totalweight_pallets',1);
	//alert('palletQty = ' + palletQty + '\npalletWeight = ' + palletWeight);

	//if (palletSize == null || palletSize == '')
	if (palletQty == null || palletQty == '') 
	{
		ErrMsg += 'Please Note: Input at least one valid pallet size / quantity combination. Please also ensure you click \'Add\' under the Pallet Size / Type.';
		return false;
	}

	if (palletWeight == null || palletWeight == '' || palletWeight <= 0) 
	{
		ErrMsg += 'Please Note: Select at least one pallet size / weight combination. Please also ensure you click \'Add\' under the Pallet Size / Type.';
		return false;
	}
	else 
	{
		//if (!checkMaximums(palletSize)) return false;
	}

	// Retrieve current pallet area
	var palletZone = theConsRecord.getFieldValue('custbody_pallet_zone');
	// Retrieve current postcode zone (prefix)
	var postcodeZone = theConsRecord.getFieldValue('custbody_postcodezone');

	if (palletZone == null || palletZone == '' || postcodeZone == null || postcodeZone == '') 
	{
		ErrMsg += 'Please Note: The selected address has no pricing / zone details. palletZone = ' + palletZone + ' postcodeZone = ' + postcodeZone;
		return false;
	}

	// Retrieve current customer
	var currentCustomer = theConsRecord.getFieldValue('entity');
	var precedence = 0;
	var prevPalletZone = '';

	// ORDER OF PRECEDENCE #1
	// construct search for postcode override - Full prefix first then alpha only

	var pOverrideSearchFilters = new Array();
	var pOverrideSearchColumns = new Array();

	//if (isTestUser()) 
	//    ("Service :" + currentItem);
	pOverrideSearchFilters[0] = new nlobjSearchFilter('custrecord_pro_customer', null, 'is', currentCustomer);
	pOverrideSearchFilters[1] = new nlobjSearchFilter('custrecord_pro_service', null, 'is', currentItem);
	pOverrideSearchFilters[2] = new nlobjSearchFilter('custrecord_pro_postcode', null, 'is', postcodeZone);

	pOverrideSearchColumns[0] = new nlobjSearchColumn('custrecord_pro_fullpalletrate');
	pOverrideSearchColumns[1] = new nlobjSearchColumn('custrecord_pro_halfpalletrate');
	pOverrideSearchColumns[2] = new nlobjSearchColumn('custrecord_pro_qtrpalletrate');
	pOverrideSearchColumns[3] = new nlobjSearchColumn('custrecord_pro_micropalletrate');

	// perform search
	//var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride',null,pOverrideSearchFilters, pOverrideSearchColumns);
	var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride', 'customsearch_palletoverride', pOverrideSearchFilters, pOverrideSearchColumns);
	//var pOverrideSearchResults = false;

	// if no results then rerun search using alpha prefix only
	if (!pOverrideSearchResults) 
	{
		var alphaPrefix = returnPostcodePrefixAlpha(postcodeZone);
		precedence = 1;
		pOverrideSearchFilters[2] = new nlobjSearchFilter('custrecord_pro_postcode', null, 'is', alphaPrefix);
		//var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride',null,pOverrideSearchFilters, pOverrideSearchColumns);
		var pOverrideSearchResults = nlapiSearchRecord('customrecord_palletrateoverride', 'customsearch_palletoverride', pOverrideSearchFilters, pOverrideSearchColumns);
		//pOverrideSearchResults = false;	
	} //if

	if (pOverrideSearchResults) 
	{
		// Extract pricing from first record found
		if (precedence == 0) precedence = 11;
		var fullpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[0]);
		var halfpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[1]);
		var qtrpalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[2]);
		var micropalletrate = pOverrideSearchResults[0].getValue(pOverrideSearchColumns[3]);
		// Added Feb 2012 - logic to use half rate if quarter rate possible for the default service / zone
		if (!isNaN(qtrpalletrate))
		{
			qtrpalletrate = parseFloat(qtrpalletrate);			
		} 
		else 
		{
			qtrpalletrate = 0;
		}
		/*
        if (parseInt(qtrpalletrate) == 0) {
            var defaultPrices = getRatesforPalletItemZone(currentItem, palletZone);
            if (!isNaN(defaultPrices['qtrpalletrate']) && defaultPrices['qtrpalletrate'] > 0) 
                qtrpalletrate = defaultPrices['qtrpalletrate'];
			if (isTestUser()) alert ('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
        }  
		 */      
		//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' Postcode=' + postcodeZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
	} //if
	else 
	{
		// ORDER OF PRECEDENCE #2
		// construct search for customer-zone specific pricing

		// Before proceeding with custome-zone lookup perform a check for a pallet zone-override

		var pzoSearchFilters = new Array();
		var pzoSearchColumns = new Array();

		//alert(postcodeZone);	
		pzoSearchFilters[0] = new nlobjSearchFilter('custrecord_pzo_customer', null, 'is', currentCustomer);
		pzoSearchFilters[1] = new nlobjSearchFilter('custrecord_pzo_postcode', null, 'is', postcodeZone);

		pzoSearchColumns[0] = new nlobjSearchColumn('custrecord_pzo_zone');

		// perform search
		//var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride',null,pzoSearchFilters, pzoSearchColumns);
		var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride', 'customsearch_palletzoneoverride', pzoSearchFilters, pzoSearchColumns);

		// if zone-override found then reset postcodezone to override zone        
		if (pzoSearchResults) 
		{
			//if (pzoSearchResults[0].getValue(pzoSearchColumns[0]) != pzoSearchResults[0].getValue(pzoSearchColumns[0]) && palletZone == '') {
			prevPalletZone = palletZone;
			palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
			precedence = 2;
			//postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
			//if (palletZone == null || palletZone == '') {
			//	ErrMsg += 'Note: customrecord_palletzoneoverride has no pricing / zone details. postcodeZone = ' + postcodeZone;
			//	return false;
			//}
			//}
		}
		else 
		{
			// if no zone-override found then re-perform search based on alpha prefix only
			var alphaPrefix = returnPostcodePrefixAlpha(postcodeZone);
			pzoSearchFilters[1] = new nlobjSearchFilter('custrecord_pzo_postcode', null, 'is', alphaPrefix);
			//var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride',null,pzoSearchFilters, pzoSearchColumns);
			var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride', 'customsearch_palletzoneoverride', pzoSearchFilters, pzoSearchColumns);

			if (pzoSearchResults) 
			{                
				//if (pzoSearchResults[0].getValue(pzoSearchColumns[0]) != pzoSearchResults[0].getValue(pzoSearchColumns[0]) && palletZone == '') {
				prevPalletZone = palletZone;
				palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
				if (precedence == 0) 
				{
					precedence = 22;
				}
				//postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
				//if (palletZone == null || palletZone == '') {
				//	ErrMsg += 'Note: customrecord_palletzoneoverride has no pricing / zone details. postcodeZone = ' + postcodeZone;
				//	return false;
				//}
				//}
			} //if		
		} //else

		if (palletZone == '' || palletZone == null) 
		{
			palletZone = prevPalletZone; //Restore the zone as none present
		}
		//nlapiLogExecution('AUDIT', 'PalletZone=' + palletZone + ' prevPalletZone=' + prevPalletZone, 'postcode = ' + fullpalletrate + ' alphaPrefix = ' + alphaPrefix);

		var pRateSearchFilters = new Array();
		var pRateSearchColumns = new Array();

		pRateSearchFilters[0] = new nlobjSearchFilter('custrecord_palletrate_customer', null, 'is', currentCustomer);
		pRateSearchFilters[1] = new nlobjSearchFilter('custrecord_palletrate_service', null, 'is', currentItem);
		pRateSearchFilters[2] = new nlobjSearchFilter('custrecord_palletrate_zone', null, 'is', palletZone);

		pRateSearchColumns[0] = new nlobjSearchColumn('custrecord_fullpalletrate');
		pRateSearchColumns[1] = new nlobjSearchColumn('custrecord_halfpalletrate');
		pRateSearchColumns[2] = new nlobjSearchColumn('custrecord_qtrpalletrate');
		pRateSearchColumns[3] = new nlobjSearchColumn('custrecord_micropalletrate');

		// perform search
		var pRateSearchResults = nlapiSearchRecord('customrecord_palletrate', 'customsearch_palletrate', pRateSearchFilters, pRateSearchColumns);               

		if (pRateSearchResults) 
		{
			if (precedence == 0) 
			{
				precedence = 222;
			}
			// Extract pricing from first record found
			var fullpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[0]);
			var halfpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[1]);
			var qtrpalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[2]);
			var micropalletrate = pRateSearchResults[0].getValue(pRateSearchColumns[3]);
			// Added Feb 2012 - logic to use half rate if quarter rate possible for the default service / zone
			if (!isNaN(qtrpalletrate)) 
			{
				qtrpalletrate = parseFloat(qtrpalletrate);
			}
			else 
			{
				qtrpalletrate = 0;
			}
			/*
            if (parseInt(qtrpalletrate) == 0) {
                var defaultPrices = getRatesforPalletItemZone(currentItem, palletZone);
                if (!isNaN(defaultPrices['qtrpalletrate']) && defaultPrices['qtrpalletrate'] > 0) 
                    qtrpalletrate = defaultPrices['qtrpalletrate'];
                	nlapiLogExecution('AUDIT', 'Precedence ' + precedence, 'qtrpalletrate = ' + qtrpalletrate);
                if (isTestUser()) 
                    alert('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
            }
			 */
			//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' Postcode=' + postcodeZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
		}
		else 
		{

			// ORDER OF PRECEDENCE #3
			// construct search for generic default pricing

			var pDefaultSearchFilters = new Array();
			var pDefaultSearchColumns = new Array();

			pDefaultSearchFilters[0] = new nlobjSearchFilter('custrecord_pallet_service', null, 'is', currentItem);
			pDefaultSearchFilters[1] = new nlobjSearchFilter('custrecord_zone', null, 'is', palletZone);

			pDefaultSearchColumns[0] = new nlobjSearchColumn('custrecord_defaultfullpalletrate');
			pDefaultSearchColumns[1] = new nlobjSearchColumn('custrecord_defaulthalfpalletrate');
			pDefaultSearchColumns[2] = new nlobjSearchColumn('custrecord_defaultqtrpalletrate');
			pDefaultSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultmicropalletrate');

			// perform search
			var pDefaultSearchResults = nlapiSearchRecord('customrecord_pallet_zoneservicepricing', 'customsearch_palletzoneservicepricing', pDefaultSearchFilters, pDefaultSearchColumns);

			if (pDefaultSearchResults) 
			{
				// Extract pricing from first record found
				if (precedence == 0) 
				{
					precedence = 3;
				}
				var fullpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[0]);
				var halfpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[1]);
				var qtrpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[2]);
				var micropalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[3]);
				//nlapiLogExecution('AUDIT', 'Precedence=' + precedence + ' ServiceItem=' + currentItem + ' PalletZone=' + palletZone, 'full = ' + fullpalletrate + ' half = ' + halfpalletrate + ' qtr = ' + qtrpalletrate + ' micro = ' + micropalletrate);
			}
			else 
			{
				// No pricing records found so return an error.
				ErrMsg += 'Please Note:\nThis service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available.';
				return false;

			} //else	
		} //else
	} //else
	// calculate rate based on pallet size(s) selected
	var rate = 0.0;

	//var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
	var palletIndex = 0;
	var palletCount = theConsRecord.getLineItemCount('recmachcustrecord_palletlistconsignmentlookup');
	var palletTotal = 0;
	//alert('palletCount = ' + palletCount + '\npalletIndex = ' + palletIndex);
	var sizeTrace = '';
	if (palletCount > 0 || palletIndex > 0) 
	{
		for (var lc = 1; lc <= palletCount; lc++) 
		{ // 1 or more pallet lines exist already
			//if (lc != palletIndex) {
			var pallets = theConsRecord.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', lc);
			var palletSize = theConsRecord.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup', lc);
			var amount = 0.0;
			sizeTrace += ' [SIZ=' + palletSize + ' QTY=' + pallets;
			if (palletSize == 1) 
			{
				amount = parseInt(pallets) * fullpalletrate;
			}
			if (palletSize == 2) 
			{
				amount = parseInt(pallets) * halfpalletrate;
			}
			if (palletSize == 6) 
			{
				amount = parseInt(pallets) * fullpalletrate * 1.75;
			}
			if (palletSize == 5) 
			{
				amount = parseInt(pallets) * halfpalletrate * 1.75;
			}
			if (palletSize == 3) 
			{
				amount = parseInt(pallets) * qtrpalletrate;
			}
			if (palletSize == 4) 
			{
				amount = parseInt(pallets) * micropalletrate;
			}
			sizeTrace += ' AMT=' + amount + '] ';

			//alert(lc + ' : size = ' + palletSize + '\npallets = ' + pallets + '\namount = ' + amount);
			palletTotal += parseInt(pallets);
			rate += amount;
			//}
		}
	}

	/*****************************************************
	 *  Calculate fuel surcharge
	 *  - To be moved into invoice.
	 ****************************************************/
	var fuelSurchargePercent = parseFloat(theConsRecord.getFieldValue('custbody_fuelsurchargeratepercent'));
	var fuelSurcharge;

	if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) 
	{
		fuelSurcharge = 0.00;
	}
	else 
	{
		fuelSurcharge = (parseFloat(fuelSurchargePercent / 100.00) * parseFloat(rate)).toFixed(2);
	} //if

	ErrMsg += "Surcharge : " + fuelSurcharge;
	theConsRecord.setFieldValue('custbody_fuelsurcharge', fuelSurcharge);

	if (rate > 0)
	{

		//Added July 2012 - surcharges related to Olympics ...
		var deliveryType = getFormDeliveryType(theConsRecord.getFieldValue('customform'));
		var surchargePostCode = theConsRecord.getFieldValue('custbody_deliverypostcode');
		if (deliveryType == 'TT' || deliveryType == 'TH') 
		{
			surchargePostCode = theConsRecord.getFieldValue('custbody_pickupaddresspostcode');
		}

		//var newSurcharge = parseFloat(getPostcodeSurcharge(surchargePostCode, false, palletTotal));
		var newSurcharge = 0;
		if (newSurcharge > 0) 
		{
			theConsRecord.setFieldValue('custbody_surcharge_postcode', newSurcharge, false, false);
		}
		if (newSurcharge > 0) 
		{
			rate += newSurcharge;
		}

		//if (isTestUser()) 
		ErrMsg += 'CurrentItem = ' + currentItemText + " Zone = " + palletZone + " Rate = " + rate + " newSurcharge = " + newSurcharge;
		theConsRecord.setLineItemValue('item', 'rate', 1, rate);
		theConsRecord.setLineItemValue('item', 'amount', 1, rate);
		ErrMsgObj.ErrMsg += ErrMsg;
		return theConsRecord;

	} //if
	else 
	{
		ErrMsg += 'Please Note: This service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available.';
		ErrMsg += ' SizeTrace ' + sizeTrace;
		ErrMsgObj.ErrMsg += ErrMsg;
		return false;
	}   

} //function

function returnPostcodePrefixAlpha(prefix)
{

	// create regular expression
	var prefixRegEx = /(^[A-Z]{1,2})([0-9]{1,2}$)/i;
	var alphaPrefix = prefix.replace(prefixRegEx, '$1');

	if (alphaPrefix == prefix) 
	{ // Must be not ending with a number but a letter e.g. SW1W ...
		prefixRegEx = /(^[A-Z]{1,2})([0-9]{1,2}[A-Z]{1}$)/i;
		alphaPrefix = prefix.replace(prefixRegEx, '$1');
	}
	return alphaPrefix.toUpperCase();

} //function

function getRatesforPalletItemZone(currentItem, palletZone)
{
	var theRates = new Array();   
	if (currentItem && palletZone) 
	{
		var pDefaultSearchFilters = new Array();
		var pDefaultSearchColumns = new Array();

		pDefaultSearchFilters[0] = new nlobjSearchFilter('custrecord_pallet_service', null, 'is', currentItem);
		pDefaultSearchFilters[1] = new nlobjSearchFilter('custrecord_zone', null, 'is', palletZone);

		pDefaultSearchColumns[0] = new nlobjSearchColumn('custrecord_defaultfullpalletrate');
		pDefaultSearchColumns[1] = new nlobjSearchColumn('custrecord_defaulthalfpalletrate');
		pDefaultSearchColumns[2] = new nlobjSearchColumn('custrecord_defaultqtrpalletrate');
		pDefaultSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultmicropalletrate');

		// perform search
		var pDefaultSearchResults = nlapiSearchRecord('customrecord_pallet_zoneservicepricing', 'customsearch_palletzoneservicepricing', pDefaultSearchFilters, pDefaultSearchColumns);

		if (pDefaultSearchResults) 
		{
			// Extract pricing from first record found       
			theRates['fullpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[0]);
			theRates['halfpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[1]);
			theRates['qtrpalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[2]);
			theRates['micropalletrate'] = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[3]);
		}
	}
	return theRates;
}

/*
 * Parcel Services
 */

function getParcelPrice(currentCustomer, currentItem, parcelArea, consignmentWeight)
{
	//if (currentCustomer.length > 0 && currentItem.length > 0 && parcelArea.length > 0 && consignmentWeight.length > 0) {
	if (currentCustomer != '' && currentItem != '' && parcelArea != '' && consignmentWeight != '') 
	{
		// construct search for customer-item specific pricing

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

		if (pRateSearchResults) 
		{
			//alert('pRateSearchResults==T');

			// Extract fields from first record found
			var basePrice1 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[0]));
			var kilo1 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[1]));
			var perkg1 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[2]));

			if (isNaN(basePrice1)) 
			{
				basePrice1 = 0.00;
			}
			if (isNaN(kilo1)) 
			{
				kilo1 = 0;
			}
			if (isNaN(perkg1)) 
			{
				perkg1 = 0.00;
			}

			var basePrice2 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[3]));
			var kilo2 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[4]));
			var perkg2 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[5]));

			if (isNaN(basePrice2)) 
			{
				basePrice2 = 0.00;
			}
			if (isNaN(kilo2)) 
			{
				kilo2 = 0;
			}
			if (isNaN(perkg2)) 
			{
				perkg2 = 0.00;
			}

			var basePrice3 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[6]));
			var kilo3 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[7]));
			var perkg3 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[8]));

			if (isNaN(basePrice3)) 
			{
				basePrice3 = 0.00;
			}
			if (isNaN(kilo3)) 
			{
				kilo3 = 0;
			}
			if (isNaN(perkg3)) 
			{
				perkg3 = 0.00;
			}

			var basePrice4 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[9]));
			var kilo4 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[10]));
			var perkg4 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[11]));

			if (isNaN(basePrice4)) 
			{
				basePrice4 = 0.00;
			}
			if (isNaN(kilo4)) 
			{
				kilo4 = 0;
			}
			if (isNaN(perkg4)) 
			{
				perkg4 = 0.00;
			}

			var basePrice5 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[12]));
			var kilo5 = parseInt(pRateSearchResults[0].getValue(pRateSearchColumns[13]));
			var perkg5 = parseFloat(pRateSearchResults[0].getValue(pRateSearchColumns[14]));

			if (isNaN(basePrice5)) 
			{
				basePrice5 = 0.00;
			}
			if (isNaN(kilo5)) 
			{
				kilo5 = 0;
			}
			if (isNaN(perkg5)) 
			{
				perkg5 = 0.00;
			}

		} //if
		else 
		{
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

			if (defSearchResults) 
			{
				//alert('defSearchResults==T');

				// Extract fields from first record found
				var basePrice1 = parseFloat(defSearchResults[0].getValue(defSearchColumns[0]));
				var kilo1 = parseInt(defSearchResults[0].getValue(defSearchColumns[1]));
				var perkg1 = parseFloat(defSearchResults[0].getValue(defSearchColumns[2]));

				if (isNaN(basePrice1)) 
				{
					basePrice1 = 0.00;
				}
				if (isNaN(kilo1)) 
				{
					kilo1 = 0;
				}
				if (isNaN(perkg1)) 
				{
					perkg1 = 0.00;
				}

				var basePrice2 = parseFloat(defSearchResults[0].getValue(defSearchColumns[3]));
				var kilo2 = parseInt(defSearchResults[0].getValue(defSearchColumns[4]));
				var perkg2 = parseFloat(defSearchResults[0].getValue(defSearchColumns[5]));

				if (isNaN(basePrice2)) 
				{
					basePrice2 = 0.00;
				}
				if (isNaN(kilo2)) 
				{
					kilo2 = 0;
				}
				if (isNaN(perkg2)) 
				{
					perkg2 = 0.00;
				}

				var basePrice3 = parseFloat(defSearchResults[0].getValue(defSearchColumns[6]));
				var kilo3 = parseInt(defSearchResults[0].getValue(defSearchColumns[7]));
				var perkg3 = parseFloat(defSearchResults[0].getValue(defSearchColumns[8]));

				if (isNaN(basePrice3)) 
				{
					basePrice3 = 0.00;
				}
				if (isNaN(kilo3)) 
				{
					kilo3 = 0;
				}
				if (isNaN(perkg3)) 
				{
					perkg3 = 0.00;
				}

				var basePrice4 = parseFloat(defSearchResults[0].getValue(defSearchColumns[9]));
				var kilo4 = parseInt(defSearchResults[0].getValue(defSearchColumns[10]));
				var perkg4 = parseFloat(defSearchResults[0].getValue(defSearchColumns[11]));

				if (isNaN(basePrice4)) 
				{
					basePrice4 = 0.00;
				}
				if (isNaN(kilo4)) 
				{
					kilo4 = 0;
				}
				if (isNaN(perkg4)) 
				{
					perkg4 = 0.00;
				}

				var basePrice5 = parseFloat(defSearchResults[0].getValue(defSearchColumns[12]));
				var kilo5 = parseInt(defSearchResults[0].getValue(defSearchColumns[13]));
				var perkg5 = parseFloat(defSearchResults[0].getValue(defSearchColumns[14]));

				if (isNaN(basePrice5)) 
				{
					basePrice5 = 0.00;
				}
				if (isNaN(kilo5)) 
				{
					kilo5 = 0;
				}
				if (isNaN(perkg5)) 
				{
					perkg5 = 0.00;
				}

				//alert('basePrice1=' + basePrice1 + '\nkilo1=' + kilo1 + '\nperkg1=' + perkg1);
				//alert('basePrice2=' + basePrice2 + '\nkilo2=' + kilo2 + '\nperkg2=' + perkg2);
				//alert('basePrice3=' + basePrice3 + '\nkilo3=' + kilo3 + '\nperkg3=' + perkg3);
				//alert('basePrice4=' + basePrice4 + '\nkilo4=' + kilo4 + '\nperkg4=' + perkg4);
				//alert('basePrice5=' + basePrice5 + '\nkilo5=' + kilo5 + '\nperkg5=' + perkg5);

			} //if
			else 
			{
				//alert('defSearchResults==F');

				return -1;
			}
		} //else
		// calculate pricing
		var rate;

		if (consignmentWeight <= kilo1) 
		{
			rate = basePrice1;
		} //if
		else 
		{
			//if (consignmentWeight <= kilo2 || kilo2 == 0 || isNaN(kilo2)) {
			if (consignmentWeight <= kilo2 || kilo2 == 0) 
			{
				rate = basePrice1 + ((consignmentWeight - kilo1) * perkg1);                
			} //else if
			else 
			{
				//if (consignmentWeight <= kilo3 || kilo3 == 0 || isNaN(kilo3)) {
				if (consignmentWeight <= kilo3 || kilo3 == 0) 
				{
					//if (basePrice2 != null && !(isNaN(basePrice2))) {
					if (basePrice2 != 0.00) 
					{
						rate = basePrice2 + ((consignmentWeight - kilo2) * perkg2);                       
					} //if
					else 
					{
						rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((consignmentWeight - kilo2) * perkg2);                       
					} //else
				} //else if
				else 
				{

					{
						//if (consignmentWeight <= kilo4 || kilo4 == 0 || isNaN(kilo4)) {
						if (consignmentWeight <= kilo4 || kilo4 == 0) 
						{
							//if (basePrice3 != null && !(isNaN(basePrice3))) {
							if (basePrice3 != 0.00) 
							{
								rate = basePrice3 + ((consignmentWeight - kilo3) * perkg3);                            
							} //if
							else 
							{
								rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((consignmentWeight - kilo3) * perkg3);                           
							} //else
						} //else if
						else
						{
							//if (consignmentWeight <= kilo5 || kilo5 == 0 || isNaN(kilo5)) {
							if (consignmentWeight <= kilo5 || kilo5 == 0) 
							{
								//if (basePrice4 != null && !(isNaN(basePrice4))) {
								if (basePrice4 != 0.00) 
								{
									rate = basePrice4 + ((consignmentWeight - kilo4) * perkg4);                                
								} //if
								else 
								{
									rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((kilo4 - kilo3) * perkg3) + ((consignmentWeight - kilo4) * perkg4);                                
								} //else
							} //else if
							else 
							{


								if (consignmentWeight > kilo5) 
								{
									//if (basePrice5 != null && !(isNaN(basePrice5))) {
									if (basePrice5 != 0.00) 
									{
										rate = basePrice5 + ((consignmentWeight - kilo5) * perkg5);                                  
									} //if
									else 
									{
										rate = basePrice1 + ((kilo2 - kilo1) * perkg1) + ((kilo3 - kilo2) * perkg2) + ((kilo4 - kilo3) * perkg3) + ((kilo5 - kilo4) * perkg4) + ((consignmentWeight - kilo5) * perkg5);                                    
									} //else
								} //else if
								else 
								{
									return -1;
								} // else	
							}
							return rate;
						}
					}
				}
			}
		}
	}
	else 
	{
		if (isTestUser() || consignmentWeight != '') 
		{
			alert('getParcelPrice - missing parameter(s): Customer = ' + currentCustomer + ' Item = ' + currentItem + ' Area = ' + parcelArea + ' Weight = ' + consignmentWeight);
		}
		else 
		{
			if (consignmentWeight == '') 
			{
				alert('Please enter a weight in KG.');
			}
		}
		return -1;
	}
} // function getParcelPrice

function getPURPrice(rate, currentForm, currentCustomer, parcelArea, consignmentWeight) 
{
	var surcharge = 0;
	var collectRate = 0;
	/*****************************************************
	 *  There-->Here Checks
	 *  Calculate normally but add surcharge
	 *  Modified Feb 2012 to include new PUR pricing model
	 *  based on any COLL areas defined for the customer
	 ****************************************************/
	// if custom form =  then process as there to here
	if (getFormDeliveryType(currentForm) == 'TH') 
	{
		//get there-->here surcharge
		paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
		var PURcollservice = paramRecord.getFieldValue('custrecord_pur_collectservice');
		var PURbaseservice = paramRecord.getFieldValue('custrecord_pur_baseservice');
		var PURSurcharge = parseFloat(paramRecord.getFieldValue('custrecord_param_tpcollectionsurcharge'));
		var thSurcharge = 0.0;
		//1. See whether Customer has special collection rates for PURs
		var PURcustrate = getParcelPrice(currentCustomer, PURcollservice, parcelArea, consignmentWeight);
		if (PURcustrate == -1) 
		{ // Use base services rate for PURs
			if (isTestUser())
			{
				alert('Base service = ' + PURbaseservice + ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
			}
			var PURbaserate = getParcelPrice(currentCustomer, PURbaseservice, parcelArea, consignmentWeight);
			if (PURbaserate == -1) 
			{ // Should never get here but ...
				alert('No PUR base price defined. Please contact support.');
				return false;
			} 
			else 
			{
				//alert('Baserate T-H = ' + PURbaserate+ ' area = ' + parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
				if (rate < PURbaserate)
				{
					thSurcharge = PURbaserate - rate; // Add base rate surcharge if lower
				}
				thSurcharge += PURSurcharge; // Add fixed surcharge
			}
		} 
		else 
		{ // Apply customer PUR rates ...
			if (isTestUser())
			{
				alert('Cust COLLrate T-H = ' + PURcustrate + ' area = '	+ parcelArea + ' rate = ' + rate + ' Surcharge = ' + PURSurcharge);
			}
			if (rate < PURcustrate)
			{
				thSurcharge = PURcustrate - rate; // Surcharge the difference
			}
		}
		if (isTestUser())
		{
			alert('Surcharge T-H = ' + thSurcharge);
		}
		//add surcharge
		if (!isNaN(thSurcharge))
		{
			surcharge += thSurcharge;
		}
	} //if there-->here
	rate += surcharge;
	rate += collectRate;
	return rate;
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
function checkPostCode(toCheck)
{

	// Permitted letters depend upon their position in the postcode.
	var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
	var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
	var alpha3 = "[abcdefghjkstuw]"; // Character 3
	var alpha4 = "[abehmnprvwxy]"; // Character 4
	var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
	// Array holds the regular expressions for the valid postcodes
	var pcexp = new Array();
	// Load up the string to check
	var postCode = toCheck;

	// Assume we're not going to find a valid postcode
	var valid = false;
	
	try
	{
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



		// Check the string against the types of post codes
		for (var i = 0; i < pcexp.length; i++) 
		{
			if (pcexp[i].test(postCode)) 
			{

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
	}
	catch(e)
	{
		errorHandler('checkPostCode', e);
	}


	// Return with either the reformatted valid postcode or the original invalid 
	// postcode
	if (valid) 
	{
		return postCode;
	}
	else 
	{
		return false;
	}

}

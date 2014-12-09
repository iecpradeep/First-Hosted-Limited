/**
 * Suitelet for the General Public Feature 
 * 
 * Version    Date            	Author           Remarks
 * 1.00       22nd Sep 2013     Peter Lewis
 *
 */

var styleHTML = '<style type="text/css">';
styleHTML += '.tableHeader{background-color: Black;text-align: center;font-weight: bold;font-size:large;color: White;padding: 0px;margin: 0px;border-style: none;border-width: 0px;}';
styleHTML += '.tableRow{background-color: White;text-align: center;font-weight: bold;color: Black;padding: 0px;margin: 0px;border-style: none;border-width: 0px;text-align:left;}';
styleHTML += '.leftHeader{background-image: url(\'https://system.na1.netsuite.com/core/media/media.nl?id=1571&c=3778446&h=dd0d9925ae29c8e1dbaa\');background-repeat: no-repeat;width: 9px;padding: 0px;margin: 0px;border-style: none;border-width: 0px;}';
styleHTML += '.leftTD{width: 9px;padding: 0px;margin: 0px;border-style: none;border-width: 0px;}';
styleHTML += '.rightHeader{background-image: url(\'https://system.na1.netsuite.com/core/media/media.nl?id=1572&c=3778446&h=87c2461567576ef21344\');background-repeat: no-repeat;width: 9px;padding: 0px;margin: 0px;border-style: none;border-width: 0px;}';
styleHTML += '.rightTD{width: 9px;padding: 0px;margin: 0px;border-style: none;border-width: 0px;}';
styleHTML += '.bodyStyle{font-family: Verdana, Tahoma, Arial;font-size: small;}';
styleHTML += '.tableRow{text-align:left;}';
styleHTML += '</style>';

var resultHTMLBlock = '';

var tableWidth = '1200px';

var currencySymbol = '&pound;';

var useCustomSettings = false;
var useHTML = false;

var inDebug = true;

var clientScriptId = 'customscript_gpfclient';

var gpfRequestRecordID = null;
var gpfRequestRecord = null;
var gpfRequestItemRecordID = null;
var gpfRequestItemRecord = null;

var contentHTML = '';
var contentForm = null;

var contentGroup = null;
var contentGroupTitle = ' ';

var accceptGroup = null;
var acceptGroupTitle = ' ';

var resultsGroup = null;
var resultsGroupTitle = ' ';

var parcelGroup = null;
var parcelGroupTitle = 'Enter each parcel carefully';

var headerGroup = null;
var headerGroupTitle = ' ';

var footerGroup = null;
var footerGroupTitle = ' ';


var fldContent = null;
var fldBillingPostcode = null;
var fldPickupPostcode = null;
var fldDeliveryPostcode = null;
var fldNumberOfParcels = null;
var fldResults = null;
var fldHeader = null;
var fldFooter = null;

var postedBillingPostcode = '';
var postedPickupPostcode = '';
var postedDeliveryPostcode = '';

var postcodePrefixBilling = '';
var postcodePrefixPickup = '';
var postcodePrefixDelivery = '';

var depotLookupBilling = '';
var depotLookupPickup = '';
var depotLookupDelivery = '';

var submit = null;
var submitButtonTitle = 'Quote and Book!';

var sublist = null;
var parcelSublistTitle = 'Parcel details';

var slField = null;


var inlineResults = false;
var linearTable = false;

var params = '';
var postcode = '';
var prefix = '';

var numOfLines = 0;
var lineWeight = 0;
var lineHeight = 0;
var lineLength = 0;
var lineWidth = 0;


var weight = 0;
var parcels = 0;
var consdate = '';
var service = '';

var consignmentTotalWeight = 0;

var requestMethod = '';

var htmlHeader = '';
var htmlFooter = '';
var htmlItemBlock = '';

var maxTotalWeight = 50;
var maxLargestDimension = 305;

var outputPage = '';
var outputPageName = 'General Public Feature';

var paramDebug = null;
var paramDebugName = 'CUSTPARAM_DEBUG';

var paramDate = null;
var paramDateName = 'CUSTPARAM_DATE';

var paramRecordType = null;
var paramRecordTypeName = 'CUSTPARAM_RECORDTYPE';

var paramTime = null;
var paramTimeName = 'CUSTPARAM_TIME';

var searchFilters = new Array();
var searchColumns = new Array();
var searchResults = null;

/**************************************
 * Item Fields for service information
 **************************************/
var itemTitleField = 'salesdescription';
var itemTitle = '';

var itemNameField = 'itemid';
var itemName = '';

var itemRecordTypeName = 'serviceitem';
var itemRecord = null;
var itemRecordId = -1;

var serviceTypeParcel = 1;
var serviceTypePallet = 2;
var serviceTypeOther = 3;


/**************************************************************************************************
 * 
 * entryScreenEntryPoint
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function entryScreenEntryPoint(request, response)
{
	try
	{
		initialise(request,response);

//		loadSettings(request, response);

		if(useHTML)
		{
			nlapiLogExecution('DEBUG', 'called Disp HTML', 'doing');
			displayHTMLEntryScreen(request, response);
		}
		else
		{
			nlapiLogExecution('DEBUG', 'called Disp FORM', 'doing');
			displayNetSuiteEntryScreen(request, response);
		}
	}
	catch(e)
	{
		errorHandler('entryScreenEntryPoint', e);
	}
}

/**************************************************************************************************
 * 
 * initialise
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function initialise(request,response)
{

	try
	{
		requestMethod = request.getMethod();
		useCustomSettings = request.getParameter('CUSTPARAM_USECUSTOM');
		useHTML = request.getParameter('CUSTPARAM_USEHTML');
		postedBillingPostcode = request.getParameter('custpage_billingpostcode');
		postedPickupPostcode = request.getParameter('custpage_pickuppostcode');
		postedDeliveryPostcode = request.getParameter('custpage_deliverypostcode');

	}
	catch(e)
	{
		errorHandler('initialise', e);
	}

}

/**************************************************************************************************
 * 
 * loadSettings
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function loadSettings(request,response)
{

	try
	{
		//Check to see if they require HTML
		if(useHTML == true)
		{
			//If they do want to use HTML, check if they want to load the Custom Settings
			if(useCustomSettings == true)
			{
//				load custom html settings

			}
			else
			{
//				load default html settings

			}
		}
		else
		{
			if(useCustomSettings == true)
			{
//				load custom page settings

			}
			else
			{
//				use default (Page default)

			}
		}
		//get the parameter for the settings record

		//if it's blank, find them all...

		//if there are some results, take the one with the lowest internal ID

		//if there are no results, display an error page


	}
	catch(e)
	{
		errorHandler('loadSettings', e);
	}

}

/**
 * @param pIsValid
 * @param pName
 * @param pRate
 * @returns
 */
function rateObject(pArea, pName, pRate)
{
	try
	{
		this.area = pArea;	
		this.name = pName;
		this.rate = pRate;
	}
	catch(e)
	{
		errorHandler('rateObject', e.message);
	}
}

/**************************************************************************************************
 * 
 * displayEntryScreen
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function displayHTMLEntryScreen(request,response)
{
	try
	{
		//generate HTML to display entry screen
		response.write('<html><head><title>Entry Screen</title></head><body><h1>Entry Screen! var method = ' + requestMethod + '</h1><form action="POST">');

		outputPage += '<input type="submit" value="Submit"></form></body></html>';
		//response.writePage(outputPage);
		response.write(outputPage);
	}
	catch(e)
	{
		errorHandler('displayEntryScreen', e);
	}
}


/**************************************************************************************************
 * 
 * displayNetSuiteEntryScreen
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function displayNetSuiteEntryScreen(request, response)
{
	try
	{
		//Create content viewing form
		contentForm = nlapiCreateForm(outputPageName);

		contentForm.setScript(clientScriptId);

		headerGroup = contentForm.addFieldGroup('headergroup', headerGroupTitle, null);

		fldHeader = contentForm.addField('custpage_logo', 'inlinehtml', '', null, 'headergroup');

		//var y = document.getElementById(\'submitter\');var x = document.getElementById(\'tbl_submitter\').removeChild(y); 
		fldHeader.setDefaultValue('<img src="https://system.na1.netsuite.com/core/media/media.nl?id=1874&c=3778446&h=c34620d0640632d03b14" alt="QuickQuote" onload="var j = document.getElementById(\'tbl_submitter\');j.remove(j);"/>' + styleHTML);

		contentGroup = contentForm.addFieldGroup('contentgroup', contentGroupTitle);

		fldBillingPostcode = contentForm.addField('custpage_billingpostcode', 'text', 'Billing Postcode', null, 'contentgroup');
		fldBillingPostcode.setHelpText('Enter the Billing post code here. This is the post code where the payment information is related to.', false);
		fldBillingPostcode.setMandatory(true);
		
		if(postedBillingPostcode)
		{
			fldBillingPostcode.setDefaultValue(postedBillingPostcode); 
			fldBillingPostcode.setDisplayType('disabled');
		}

		fldPickupPostcode = contentForm.addField('custpage_pickuppostcode', 'text', 'Pickup Postcode', null, 'contentgroup');
		fldPickupPostcode.setHelpText('Enter the Pickup post code here. This is the post code where the consignment will be picked up from.', false);
		fldPickupPostcode.setMandatory(true);
		
		if(postedPickupPostcode)
		{
			fldPickupPostcode.setDefaultValue(postedPickupPostcode); 
			fldPickupPostcode.setDisplayType('disabled');
		}

		fldDeliveryPostcode = contentForm.addField('custpage_deliverypostcode', 'text', 'Delivery Postcode', null, 'contentgroup');
		fldDeliveryPostcode.setHelpText('Enter the Delivery post code here. This is the post code where the consignment will be delivered to.', false);
		fldDeliveryPostcode.setMandatory(true);
		
		if(postedDeliveryPostcode)
		{		
			fldDeliveryPostcode.setDefaultValue(postedDeliveryPostcode); 
			fldDeliveryPostcode.setDisplayType('disabled');
		}

		parcelGroup = contentForm.addFieldGroup( 'parcelgroup', parcelGroupTitle);

		if(requestMethod == 'GET')
		{
			inlineResults = request.getParameter('CUSTPARAM_INLINERESULTS');

			sublist = contentForm.addSubList('parcels','inlineeditor', parcelSublistTitle);

			slField = sublist.addField('custcol_weight', 'float', 'Weight (Max ' + maxTotalWeight  + 'Kg)');
			//slField.setDefaultValue('1');
			slField.setMandatory(true);

			slField = sublist.addField('custcol_length', 'float', 'Length (Max ' + maxLargestDimension + 'cm)');
			//slField.setDefaultValue('1');
			slField.setMandatory(true);

			slField = sublist.addField('custcol_width', 'float', 'Width (Max ' + maxLargestDimension + 'cm)');
			//slField.setDefaultValue('1');
			slField.setMandatory(true);

			slField = sublist.addField('custcol_height', 'float', 'Height (Max ' + maxLargestDimension + 'cm)');
			//slField.setDefaultValue('1');
			slField.setMandatory(true);

			footerGroup = contentForm.addFieldGroup('footergroup', footerGroupTitle, null);

			fldFooter = contentForm.addField('custpage_footer', 'inlinehtml', ' ', null, 'footergroup');

			//var buttonCode = '<input align="right" type="image" src="https://system.na1.netsuite.com/core/media/media.nl?id=1875&c=3778446&h=97680b317fc6a0da9117" value="Quote and Book" id="mysubmitter" name="mysubmitter" onclick="if (!document.forms[\'main_form\'].onsubmit || document.forms[\'main_form\'].onsubmit()) { document.forms[\'main_form\'].elements[\'_button\'].value= \'mysubmitter\'; document.forms[\'main_form\'].submit(); }; return false;">';

			fldFooter.setDefaultValue('<br /><br /><h1>Enter all parcels, along with their details, one by one.<br /><br />Once you have finished, press ' + submitButtonTitle + '</h1><br />');

			//Create submit button
			submit = contentForm.addSubmitButton(submitButtonTitle);
		}
		else
		{
			fldHeader.setDefaultValue('<img src="https://system.na1.netsuite.com/core/media/media.nl?id=1876&c=3778446&h=9174611bcd26da986904" alt="QuickQuote" />'); // onload="var y = document.getElementById(\'submitter\');var x = document.getElementById(\'tbl_submitter\').removeChild(y);"/>');

			resultsGroup = contentForm.addFieldGroup('resultsgroup', 'Your Results', null);
			resultsGroup.setShowBorder(true);
			resultsGroup.setSingleColumn(false);

			yourParcelsGroup = contentForm.addFieldGroup('yourparcelsgroup', 'Your Results', null);
			yourParcelsGroup.setShowBorder(true);
			yourParcelsGroup.setSingleColumn(false);

			fldResults = contentForm.addField('custpage_results', 'inlinehtml', 'Results', null, 'resultsgroup');

			gpfRequestRecord = nlapiCreateRecord('customrecord_gpfrequest');
			gpfRequestRecord.setFieldValue('custrecord_gpfr_billpostcodesearch', postedBillingPostcode);
			gpfRequestRecord.setFieldValue('custrecord_gpfr_delpostcodesearch', postedDeliveryPostcode);
			gpfRequestRecord.setFieldValue('custrecord_gpfr_pickuppostcodesearch', postedPickupPostcode);

			gpfRequestRecordID = nlapiSubmitRecord(gpfRequestRecord);

			numOfLines = request.getLineItemCount('parcels');

			//nlapiLogExecution('DEBUG', 'Got lineNum!', '<b>' + numOfLines + '</b><br />');

			//check number of lines...

			//build start of table

			for(var i=1; i <= numOfLines; i++)
			{
				lineWeight = request.getLineItemValue('parcels', 'custcol_weight', i);
				lineLength = request.getLineItemValue('parcels', 'custcol_length', i);
				lineWidth = request.getLineItemValue('parcels', 'custcol_width', i);
				lineHeight = request.getLineItemValue('parcels', 'custcol_height', i);

				consignmentTotalWeight += parseFloat(lineWeight);

//				contentHTML += '<h1>Buy this service! Number ' + i + ' </h1><br />';
//				contentHTML += 'Weight: <b>' + lineWeight + ' Kg</b><br />';
//				contentHTML += 'Length: <b>' + lineLength + 'cm</b><br />';
//				contentHTML += 'Width: <b>' + lineWidth + ' cm</b><br />';
//				contentHTML += 'Height: <b>' + lineHeight + 'cm</b><br /><br />';
				//contentHTML += '<a href="#" border="0"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1570&c=3778446&h=ab4a997c618ae309c46f" /></a><br /><br />';

				//nlapiLogExecution('DEBUG', 'Got i!', '<pre>' + i + '</pre>');

				gpfRequestItemRecord = nlapiCreateRecord('customrecord_gpfrequestitem');

				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_request', gpfRequestRecordID);
				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_parcelnumber', i);
				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_weight', lineWeight);
				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_length', lineLength);
				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_width', lineWidth);
				gpfRequestItemRecord.setFieldValue('custrecord_gpfri_height', lineHeight);

				gpfRequestItemRecordID = nlapiSubmitRecord(gpfRequestItemRecord);
			}

			//build end of table

			//Search postcode table
			depotLookupBilling = '';
			depotLookupPickup = '';
			depotLookupDelivery = '';

			nlapiLogExecution('DEBUG', 'displayNetSuiteEntryScreen', 'About to do the lookup...');

			depotLookupBilling = getDepotFromPostcode(postedBillingPostcode);
			depotLookupPickup = getDepotFromPostcode(postedPickupPostcode);
			depotLookupDelivery = getDepotFromPostcode(postedDeliveryPostcode);

			if(inDebug)
			{
				contentHTML += "<br /><br />depotLookupBilling: " + depotLookupBilling + ", depotLookupPickup: " + depotLookupPickup + ", depotLookupDelivery: " + depotLookupDelivery + ", Total Weight: " + consignmentTotalWeight + "Kg.";
			}

			contentHTML += "<table style='width:" + tableWidth + ";'>";
			//#########################################################################################################

			displayResults(request, response);

			//##############################################################################################################################
			contentHTML += "</table>";

			fldResults.setDefaultValue(contentHTML);
		}

		response.writePage(contentForm);
	}
	catch(e)
	{
		errorHandler('displayNetSuiteEntryScreen', e);
	}
}

/**************************************************************************************************
 * 
 * getDepotFromPostcode - pass in the postcode to get the associated depot
 * 
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 * 
 **************************************************************************************************/
function getDepotFromPostcode(postCode)
{
	var retVal = '0';
	var depotSearchFilters = new Array();
	var depotSearchColumns = new Array();
	var depotSearchResults = null;

	try
	{
		if(postCode)
		{
			//get postcode prefix
			prefix = getPostCodePrefix(postCode);

			//search custom record type for postcode (postcode table list)
			depotSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', prefix);
			depotSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

			depotSearchColumns[0] = new nlobjSearchColumn('custrecord_depotnumber');
			//depotSearchColumns[1] = new nlobjSearchColumn('custrecord_area');
			//depotSearchColumns[2] = new nlobjSearchColumn('custrecord_parceldeliveryzone');
			//depotSearchColumns[3] = new nlobjSearchColumn('custrecord_deldays');

			depotSearchResults = nlapiSearchRecord('customrecord_postcodetable', null, depotSearchFilters, depotSearchColumns);

			if (depotSearchResults) 
			{
				nlapiLogExecution('DEBUG', 'getDepotFromPostcode', 'depotSearchResults: ' + depotSearchResults.length + ', postCode: ' + postCode);
				retVal = depotSearchResults[0].getValue(depotSearchColumns[0]);
				nlapiLogExecution('DEBUG', 'getDepotFromPostcode', 'retVal: ' + retVal + ', postCode: ' + postCode);
			}
			else
			{
				nlapiLogExecution('AUDIT', 'getDepotFromPostcode', 'depotSearchResults is null');
			}
		}
		else
		{
			retVal = false;
		}
	}
	catch(e)
	{
		errorHandler('getDepotFromPostcode', e);	
	}

	return retVal;
}


/**************************************************************************************************
 * 
 * getDepotFromPostcode - pass in the postcode to get the associated depot
 * 
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 * 
 **************************************************************************************************/
function getPostCodePrefix(postCode)
{
	var prefix = '';
	var postCodeArray = new Array();
	try
	{
		//get prefix code
		prefix = checkUKPostCodeFormat(postCode);

		//get the Postcode Anywhere regex to get the postcode district, AKA prefix
		postCodeArray = prefix.split(' ');
		prefix = postCodeArray[0];


		nlapiLogExecution('DEBUG', 'getPostCodePrefix', 'prefix: ' + prefix + ', postCode: ' + postCode);

	}
	catch(e)
	{
		errorHandler('getPostCodePrefix', e);
	}

	return prefix;
}

/********************************************************************************
 * 
 * checkUKPostCodeFormat - checks the format of the passed in Post Code as a parameter
 * 
 * @param {String} toCheck - the Post Code to check
 * 
 * @returns {String} - The postcode if it is valid, or FALSE if it is not
 * 
 ********************************************************************************/
function checkUKPostCodeFormat(toCheck)
{

	// Permitted letters depend upon their position in the postcode.
	var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
	var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
	var alpha3 = "[abcdefghjkstuw]"; // Character 3
	var alpha4 = "[abehmnprvwxy]"; // Character 4
	var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
	// Load up the string to check
	var postCode = '';
	// Assume we're not going to find a valid postcode
	var valid = false;
	// Array holds the regular expressions for the valid postcodes
	var pcexp = new Array();

	var retVal = '';

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

		// Load up the string to check
		postCode = toCheck;

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

		if (valid) 
		{
			retVal = postCode;
		}
		else
		{
			retVal = '';
		}
	}
	catch(e)
	{
		errorHandler('checkUKPostCodeFormat', e);
	}
	return retVal;
}


/**************************************************************************************************
 * 
 * displayResults
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns {Void} Any output is written via response object
 **************************************************************************************************/
function displayResults(request,response)
{
	var item = 166; //################### magic number ffs
	var area = -1;
	var depot = -1;
	var delzone =  -1;

	var serviceItemSearch = null;
	var serviceItemFilters = new Array();
	var serviceItemColumns = new Array();

	var postcodeSearchFilters = new Array();
	var postcodeSearchColumns = new Array();
	var postcodeSearchResults = null;
	//depotLookupBilling = getDepotFromPostcode(postedBillingPostcode);
	//depotLookupPickup = getDepotFromPostcode(postedPickupPostcode);
	//depotLookupDelivery = getDepotFromPostcode(postedDeliveryPostcode);

	try
	{
		//postcodePrefixBilling = '';
		//postcodePrefixPickup = '';
		postcodePrefixDelivery = getPostCodePrefix(postedDeliveryPostcode);


		//generate HTML to display results screen


		postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefixDelivery);
		postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

		postcodeSearchColumns[0] = new nlobjSearchColumn('custrecord_area');
		postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_depotnumber');
		postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_parceldeliveryzone');
		postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deldays');

		postcodeSearchResults = nlapiSearchRecord('customrecord_postcodetable', null, postcodeSearchFilters, postcodeSearchColumns);
		//var postcodeSearchResults = true;

		// retrieve area and depot number
		//if (postcodeSearchResults) {
		
		
		
		area = postcodeSearchResults[0].getValue(postcodeSearchColumns[0]);
		
//		area = 


		depot = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
		delzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
		//nlapiSetFieldValue('custbody_deliverydays', postcodeSearchResults[0].getValue(postcodeSearchColumns[3]), false, false);

		//contentHTML += '<br /><br />Delivery days: ' + postcodeSearchResults[0].getValue(postcodeSearchColumns[3]) + '.<br /><br />';

		if(inDebug)
		{
			for(var j=0; j < postcodeSearchResults.length; j++)
			{
				contentHTML += '<br />area: <b>' + postcodeSearchResults[j].getValue(postcodeSearchColumns[0]) + '</b>.<br />';
				contentHTML += '<br />depot number: <b>' + postcodeSearchResults[j].getValue(postcodeSearchColumns[1]) + '</b>.<br />';
				contentHTML += '<br />Delivery zone: <b>' + postcodeSearchResults[j].getValue(postcodeSearchColumns[2]) + '</b>.<br />';
				contentHTML += '<br />Delivery days: <b>' + postcodeSearchResults[j].getValue(postcodeSearchColumns[3]) + '</b>.<br />';
			}
		}



		//get all items for this area


		serviceItemFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		serviceItemFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', area);
		serviceItemFilters[2] = new nlobjSearchFilter('custitem_internaluseonly', 'custrecord_service', 'is', 'F');
//		//serviceItemFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
//		if(numOfLines > 1)
//			{
//			//singleitem false
//			serviceItemFilters[3] = new nlobjSearchFilter('custitem_internaluseonly', 'custrecord_service', 'is', 'T');
//			}
//		else
//			{
//			//singleitem true
//			serviceItemFilters[3] = new nlobjSearchFilter('custitem_internaluseonly', 'custrecord_service', 'is', 'F');
//			}
//		
//		serviceItemFilters[4] = new nlobjSearchFilter('custitem_servicetype', null, 'is', serviceTypeParcel);
//		
		
		serviceItemColumns[0] = new nlobjSearchColumn('custrecord_service');

		serviceItemSearch = nlapiSearchRecord('customrecord_areaservice', null, serviceItemFilters, serviceItemColumns);

		if(serviceItemSearch)
		{

			contentHTML += '<table>';



			//for each item, get rate
			for(var iCount = 0; iCount < serviceItemSearch.length; iCount++)
			{
				item = serviceItemSearch[iCount].getValue(serviceItemColumns[0]);

				//create html
//				rate = getParcelPrice(area, consignmentTotalWeight, item);//TODO

				rate = getRates(area, consignmentTotalWeight, item);
				
				itemRecordId = item;
				itemRecord = nlapiLoadRecord(itemRecordTypeName, itemRecordId);
				itemName = itemRecord.getFieldValue(itemNameField);
				itemTitle = itemRecord.getFieldValue(itemTitleField);
				if(itemTitle == null)
				{

					itemTitle = itemName;
				}
				itemRecord = null;

				var rateOutput = 'Call!';

				if((rate <= 0)||(rate == null ))
				{
					//ignore this bad boy


					nlapiLogExecution('AUDIT', 'checkItemType', itemRecordTypeName + ', with ID: ' + item);


//					resultHTMLBlock = '<tr>';
//					resultHTMLBlock += '<td class="leftHeader">&nbsp;</td><td class="tableHeader"><b>' + itemTitle + '</b></td><td class="rightHeader">&nbsp;</td><td>&nbsp;</td>';

//					resultHTMLBlock += '</tr><tr>';
//					resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow">Service Code: ' + itemName + '</td><td class="rightTD">&nbsp;</td>';

//					resultHTMLBlock += '</tr><tr>';					
//					resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><b>Price: ' + currencySymbol + 'Call!</b></td><td class="rightTD">&nbsp;</td>';

//					resultHTMLBlock += '</tr><tr>';
//					resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><a href="#"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&c=3778446&h=c5496d18d4981c181e7f" alt="Buy this service" /></a></td>';
//					resultHTMLBlock += '</tr><tr><td>&nbsp;</td></tr>';

//					contentHTML += resultHTMLBlock;
				}
				else
				{
					//TODO:Generate HTML to display results

					rateOutput = rate.toString();
					rateOutput = formatMoney(rateOutput);


					if(!inlineResults)
					{
						resultHTMLBlock = '<tr>';
						resultHTMLBlock += '<td><b>' + itemTitle + '</b></td><td>&nbsp;</td><td>Service Code: ' + itemName + '</td><td>&nbsp;</td><td><b>Price: ' + currencySymbol + rateOutput + '</b></td><td>&nbsp;</td>';
						resultHTMLBlock += '<td><a href="#"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&c=3778446&h=c5496d18d4981c181e7f" alt="Buy this service" /></a></td>';
						resultHTMLBlock += '</tr>';
					}
					else
					{
						//TODO: LinearTable
						if(linearTable)
						{
							//put the results in to a linear table

							if(iCount == 1)
							{
								//first record

							}

							resultHTMLBlock = '<tr>';
							resultHTMLBlock += '<td class="leftHeader">&nbsp;</td><td class="tableHeader"><b>' + itemTitle + '</b></td><td class="rightHeader">&nbsp;</td><td>&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow">Service Code: ' + itemName + '</td><td class="rightTD">&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';					
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><b>Price: ' + currencySymbol + rateOutput + '</b></td><td class="rightTD">&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><a href="#"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&c=3778446&h=c5496d18d4981c181e7f" alt="Buy this service" /></a></td>';
							resultHTMLBlock += '</tr><tr><td>&nbsp;</td></tr>';


//							var hCount = 1;
//							
//							if(hCount % 4 == 0)
//							{
//
//							}
//
//							if(iCount == (serviceItemSearch.length -1))
//							{
//								//last record
//							}


						}
						else
						{
							resultHTMLBlock = '<tr>';
							resultHTMLBlock += '<td class="leftHeader">&nbsp;</td><td class="tableHeader"><b>' + itemTitle + '</b></td><td class="rightHeader">&nbsp;</td><td>&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow">Service Code: ' + itemName + '</td><td class="rightTD">&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';					
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><b>Price: ' + currencySymbol + rateOutput + '</b></td><td class="rightTD">&nbsp;</td>';

							resultHTMLBlock += '</tr><tr>';
							resultHTMLBlock += '<td class="leftTD">&nbsp;</td><td class="tableRow"><a href="#"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&c=3778446&h=c5496d18d4981c181e7f" alt="Buy this service" /></a></td>';
							resultHTMLBlock += '</tr><tr><td>&nbsp;</td></tr>';
						}

					}

					contentHTML += resultHTMLBlock;
				}
			}
			contentHTML += '</table>';
		}
		else
		{
			contentHTML += '<br /><h1>No services we offer match your specific criteria.</h1>';
		}
	}
	catch(e)
	{
		errorHandler('displayResults', e);
	}
}




/*******************************************************************************************
 * 
 * 
 * 
 *******************************************************************************************/
function getParcelPrice(parcelArea, consignmentWeight, currentItem)
{
	var rate = -1;

//	var pRateSearchFilters = new Array();
//	var pRateSearchColumns = new Array();

	var defSearchFilters = new Array();
	var defSearchColumns = new Array();

	//if (currentCustomer.length > 0 && currentItem.length > 0 && parcelArea.length > 0 && consignmentWeight.length > 0) {
	if (parcelArea != '' && consignmentWeight != '') 
	{
		// construct search for customer-item specific pricing

		//alert('pRateSearchResults==F');           
		// if no customer-item specific pricing records found then extract from area-service lookup

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
		defSearchColumns[15] = new nlobjSearchColumn('custrecord_service');
		defSearchColumns[16] = new nlobjSearchColumn('custrecord_servicearea');

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

			var service = defSearchResults[0].getValue(defSearchColumns[15]);
			var servicearea = defSearchResults[0].getValue(defSearchColumns[16]);
			
			nlapiLogExecution('AUDIT', 'service and servicearea', 'service ' + service + ' servicearea ' + servicearea);
			nlapiLogExecution('AUDIT', 'getParcelPrice', 'basePrice1=' + basePrice1 + ', kilo1=' + kilo1 + ', perkg1=' + perkg1 
								+ ', basePrice2=' + basePrice2 + ', kilo2=' + kilo2 + ', perkg2=' + perkg2);
			nlapiLogExecution('AUDIT', 'getParcelPrice', 'basePrice3=' + basePrice3 + ', kilo3=' + kilo3 + ', perkg3=' + perkg3 
								+ ', basePrice4=' + basePrice4 + ', kilo4=' + kilo4 + ', perkg4=' + perkg4 + ', basePrice5=' + basePrice5 + ', kilo5=' 
								+ kilo5 + ', perkg5=' + perkg5);
			//else
			// calculate pricing
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
									rate = -1;
								} // else	
							}
						}
					}
				}
			}
		} //if
		else 
		{
			rate = -1;
		}
	}
	else 
	{
		if (consignmentWeight != '') 
		{
			nlapiLogExecution('AUDIT', 'getParcelPrice', 'Area = ' + parcelArea + ' Weight = ' + consignmentWeight);
			//alert('getParcelPrice - missing parameter(s): Customer = ' + currentCustomer + ' Item = ' + currentItem + ' Area = ' + parcelArea + ' Weight = ' + consignmentWeight);
		}
		else 
		{
			if (consignmentWeight == '') 
			{
				nlapiLogExecution('AUDIT', 'getParcelPrice', 'Please enter a weight in KG.');
				//alert('Please enter a weight in KG.');
			}
		}

	}

	return rate;
} // function getParcelPrice


/*************************************************************************************************
 * 
 * addParcelOption - builds the HTML Output of the details you specify
 * 
 * @returns {String}
 * 
 *************************************************************************************************/
function addParcelOption()
{

	var parcelHTML = '';
	try
	{
		parcelHTML += '<table><tr><td class="leftHeader"> </td><td class="tableHeader">Next Day</td><td class="rightHeader"> </td><td> </td><td class="leftHeader"> </td><td class="tableHeader">2 Days</td><td class="rightHeader"> </td><td> </td><td class="leftHeader"> </td><td class="tableHeader">3 Days +</td><td class="rightHeader"> </td></tr><tr><td class="leftTD"> </td><td class="tableRow">NDROW1DATA1</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW1DATA2</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW1DATA3</td><td class="rightTD"> </td></tr><tr><td class="leftTD"> </td><td class="tableRow">NDROW2DATA1</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW2DATA2</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW2DATA3</td><td class="rightTD"> </td></tr><tr><td class="leftTD"> </td><td class="tableRow">NDROW3DATA1</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW3DATA2</td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow">NDROW3DATA3</td><td class="rightTD"> </td>/tr><tr><td class="leftTD"> </td><td class="tableRow"> </td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow"> </td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow"> </td><td class="rightTD"> </td></tr><tr><td class="leftTD"> </td><td class="tableRow"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&amp;c=3778446&amp;h=c5496d18d4981c181e7f" alt="Buy this service"></td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&amp;c=3778446&amp;h=c5496d18d4981c181e7f" alt="Buy this service"></td><td class="rightTD"> </td><td> </td><td class="leftTD"> </td><td class="tableRow"><img src="https://system.na1.netsuite.com/core/media/media.nl?id=1573&amp;c=3778446&amp;h=c5496d18d4981c181e7f" alt="Buy this service"></td><td class="rightTD"> </td></tr></table>';

		return parcelHTML;
	}
	catch(e)
	{
		errorHandler('addParcelOption', e);
	}
}

/****************************************************************************
 * formatMoney - input a numeric value, and the output is to 2 decimal places
 * 
 * @param input - decimal value
 * 
 * @returns {String} - formatted value
 * 
 ****************************************************************************/
function formatMoney(input)
{
	var retVal = '';
	var dotPos = 0;
	try
	{
		dotPos = input.indexOf('.');
		if(dotPos == -1)
		{
			retVal = input + '.00';
		}
		else
		{
			if((input.length - dotPos) == 2)
			{
				retVal = input + '0';
			}
			else
			{
				retVal = input;// + '0aaaa';
			}
		}
	}
	catch(e)
	{
		errorHandler('formatMoney', e);	
	}
	return retVal;
}

/***************************************
 * 
 * moneyFormat - prototype to return a properly formatted Money Decimal
 * 
 * @returns - the value, in the desired format
 */
Number.prototype.moneyFormat = function () 
{
	// round it to 2dp and make it a string
	stringAmount = this.round (2).toString();

	// check for a decimal point
	position = stringAmount.indexOf ('.');
	if (position == -1) 
	{
		// there isn't one, so just add the .00
		stringAmount += ".00";
	}
	else
	{
		// how far from the end is it?
		fromEnd = stringAmount.length - position;

		// there's two possibilities, either it's already at 2dp (fromEnd == 3), or there's only
		// one dp
		if (fromEnd != 3) 
		{
			stringAmount += "0";
		}
	}

	return stringAmount;
};


/**************************************************************************************************
 * 
 * Error Handler
 * 
 * @param sourceName - the name of the function which caused the error
 * @param e - the error object itself
 * 
 **************************************************************************************************/
function errorHandler(sourceName, e)
{
	if ( e instanceof nlobjError )
	{
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}



/****************************************************************************
 * 
 *  Function getRates()
 *  To be called on line submit action.
 *  
 ****************************************************************************/
function getRates(area, consignmentTotalWeight, item)//TODO
{
//	if (showVer == true)
//	{
//		alert('versionNo ' + versionNo);
//	}
	
	//if (isTestUser()) alert ('Ship Address1 = ' + nlapiGetFieldValue('custbody_deliveryaddr1'));
	
	// Mod Feb 23rd - only allow one line item per transaction ...
	//if (parseInt(nlapiGetLineItemCount('item')) > 1) // 2nd item ...
//	if (parseInt(nlapiGetCurrentLineItemIndex('item')) > 1) // 2nd item ...
//	{
//		alert('Only one delivery service item allowed per consignment / quotation.');
//		nlapiCancelLineItem('item');
//		nlapiSelectLineItem('item', 1);
//	}
//	
//	var PCsearchField = nlapiGetFieldValue('custbody_deliveryaddressselect');
//	
//	if (PCsearchField == '' || PCsearchField == null)
//	{
//		return false;
//	}
	
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
	
	if (currentItemText.length >= 4)
	{
		var itemTime = currentItemText.substring(2,4);
		
		if (!isNaN(itemTime))
		{
			itemTime = parseInt(itemTime * 1);			
		}
		if (itemTime < deliveryWeekTime)
		{
//			alert(deliveryWeekTime + ':00 is the earliest service delivery time for this post code area.');
			return false;
		}
	}
	
	if (!checkEirePostCode(thisPostCode)) 
	{
		if (deliveryDays == 1 && (currentItem == '35' || currentItem == '43' || currentItem == '44' || currentItem == '58')) 
		{
//			alert('This 2 day service is not available in a 1 day delivery zone.');
			return false;
		}
		else 
		{
			if (deliveryDays > 1 && !(currentItem == '35' || currentItem == '43' || currentItem == '44' || currentItem == '58')) 
			{
//				alert('This 1 day service is not available in a 1+ day delivery zone.');
				return false;
			}
		}
	}
	else {
		//if (deliveryDays > 1 && !(currentItem == '86')) { // ROAD Service
		if (deliveryDays > 1 && !(currentItem == '64')) // ROAD Service
		{ 
//			alert('This service is not available in this Ireland delivery zone.');
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
	
	if (ipSatSearchResults) 
	{
		for (var ss = 0; ss < ipSatSearchResults.length; ss++) 
		{
			//alert ('Check for Saturday service: ' + ipSatSearchResults[ss].getValue(ipSatSearchColumns[0]));
			if (currentItem == ipSatSearchResults[ss].getValue(ipSatSearchColumns[0]) && tranDate.getDay() != 5) 
			{ //Saturday Service but not a Friday ...
				alert('Please Note: Saturday Service selected but consignment date is not Friday.\n\nPlease select another service.');
				return false;
			}
		}
	} //if
	
	// Do not reprice logic - set by Cust Services if special pricing applies
	var DNR = nlapiGetCurrentLineItemValue('item', 'custcol_donotreprice'); 
	
	if (DNR == 'T') // Ignore pricing do it manually - added June 2012
	{ 
		var amount = nlapiGetCurrentLineItemValue('item', 'amount');
		var formid = nlapiGetFieldValue('custbody_formid');
		if (formid == null || formid == '')
			formid = nlapiGetFieldValue('customform');
		if (parseFloat(amount) > 0.00 || (parseFloat(amount) == 0.00 && formid != 140)) 
		{
			nlapiSetCurrentLineItemValue('item', 'rate', amount, false, false);
			var fuelSurchargePercent = parseFloat(nlapiGetFieldValue('custbody_fuelsurchargeratepercent'));
			var fuelSurcharge;
			
			if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) 
			{
				fuelSurcharge = 0.00;
			}
			else 
			{
				fuelSurcharge = (parseFloat(fuelSurchargePercent / 100) * parseFloat(amount)).toFixed(4);
			} //if
			nlapiSetCurrentLineItemValue('item', 'custcol_fuelsurchargeamount', fuelSurcharge, false, false);           
			return true;
		}
		else 
		{
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
	
	if (!ipSearchResults) 
	{
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
	
	if (getFormDeliveryType(currentForm) == 'TT') 
	{
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
		
		
		if (xsServiceFlag == 'T') 
		{	
			var xsSearchFilters = new Array();
			var xsSearchColumns = new Array();
			
			xsSearchFilters[0] = new nlobjSearchFilter('custrecord_service', null, 'is', currentItem);
			xsSearchFilters[1] = new nlobjSearchFilter('custrecord_servicearea', null, 'is', collectAddressArea);
			
			xsSearchColumns[0] = new nlobjSearchColumn('custrecord_service');
			
			// perform search
			var xsSearchResults = nlapiSearchRecord('customrecord_areaservice', null, xsSearchFilters, xsSearchColumns);
			
			if (xsSearchResults) 
			{
				collectService = currentItem;
			}
			else 
			{
				alert('Error: XS Collection is not available for this area.\nPlease contact NEP directly to process you order.');
			} //else
		} //if XS
		else 
			if (changeToXS == true) 
			{
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
					
					if (ncSearchResults) 
					{
						if (changeService == true) 
						{
							collectService = changeServiceTo;
						}
						if (ncServiceFlag == 'T') 
						{
							collectService = currentItem;
						}
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


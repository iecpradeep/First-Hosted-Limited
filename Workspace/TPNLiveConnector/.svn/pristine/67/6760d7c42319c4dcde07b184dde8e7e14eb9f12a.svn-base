/*******************************************************************************
 * Module Description
 * 
 * Date created    Author          
 * 02 Oct 2013     Anthony Nixon
 * Last update: 18th December 2013, Peter Lewis (Custom Form)
 *
 *******************************************************************************/

/***|Globals|***/
//soap vars
var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var postXML = '';
var responseObject = null;
var genericHeader = '';
var genericFooter = '';
var soapHeaders = new Array();
var responseObject = null; 
var recievingUrl = '';
var encodedCredentials = '';
var postObject = '';
var objResponseXML = null;


//code variables
var mandatoryPopulated = null;
var paramString = '';
var scriptParams = new Array();
var correctType = false;
var scheduleStatus = null;
var context = null;

//date variables
var d=new Date();
var rec = null;
var day = null;
var month = null;
var date = null;

//netsuite/tpn fields
var docket = '';
var oldDocket = '';
var thirdPartyID = null;
var customerRef = '';
var depotRef = '';
var createdDate = null;
var requestingDepotNumber = null;
var collectionDepotNumber = null;
var deliveryDepotNumber = null;
var consigneeName = '';
var consigneeAddress = null;
var consigneeAddress1 = '';
var consigneeAddress2 = '';
var consigneeAddress3 = '';
var consigneeAddress4 = '';
var consigneePostcode = '';
var consigneeContactName = null;
var consigneeTelephone = null;
var consigneeEmail = null;
var consignorName = null;
var consignorAddress = '';
var consignorAddress1 = '';
var consignorAddress2 = '';
var consignorAddress3 = '';
var consignorAddress4 = '';
var consignorPostcode = '';
var consignorContactName = null;
var consignorTelephone = '';
var consignorEmail = '';
var deliveryServiceCode = '';
var collectionServiceCode = '';
var deliveryDateTime = '';
var consignmentPublicNote = '';
var deliveryCharge = '';
var collectionCharge = '';
var hubCharge = '';
var customerAccountCode = '';
var customerName = '';
var customerContactName = '';
var customerTelephone = '';
var customerOwnPaperwork = false;
var numberOfQuarterPallets = 0;
var weightOfQuarterPallets = 0;
var numberOfHalfPallets = 0;
var weightOfHalfPallets = 0;
var numberOfHalfOSPallets = 0;
var weightOfHalfOSPallets = 0;
var numberOfFullPallets = 0;
var weightOfFullPallets = 0;
var numberOfFullOSPallets = 0;
var weightOfFullOSPallets = 0;
var sumInsured = 0;
var premiumPayable = 0;
var insuredInNameOF = '';
var insuredEmailAddress = '';
var enteredBy = '';

//NS variables
var recordInternalID = null;
var palletCount = 0;
var consigneeAddressRecord = null;
var consignorAddressRecord = null;
var customerInternalID = null;
var deliverItemRecord = null;
var currentUser = null;
var updatedCollectionDepot = null;
var updatedDeliveryDepot = null;
var consignmentExported = null;

var todaysDate = new Date();
var todaysDateNS = '';

//script params
var formId = null;
var thereToHereFormId = null;
var hereToThereFormId = null;
var thereToThereFormId = null;
var thereToHereExtFormId = null;
var hereToThereExtFormId = null;
var thereToThereExtFormId = null;

//error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;


/*******************************************************************************
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Operation types: create, edit, delete, xedit,
 *                      approve, cancel, reject (SO, ER, Time Bill, PO & RMA only)
 *                      pack, ship (IF only)
 *                      dropship, specialorder, orderitems (PO only) 
 *                      paybills (vendor payments)
 * @returns {Void}
 *******************************************************************************/
function consignmentImportEntryPoint(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'type: ' + type);
		correctType = checkType(type);

		nlapiLogExecution('DEBUG', 'script of the correct type?: ' + correctType);
		if(correctType == true)
		{
			initialise();

			if(formId == thereToHereFormId || formId == hereToThereFormId || formId == thereToThereFormId || formId == thereToHereExtFormId || formId == hereToThereExtFormId || formId == thereToThereExtFormId )
			{
				if(consignmentExported != 2)
				{
					currentUser = findNSUserName();
					getConsignmentData(); 
					logAllFields();
					buildStringForParam();
					importRecordIntoTpn();

					if(errorCounter > 0)
					{
						tpnErrorLogger();
					}
				}
				else
				{
					nlapiLogExecution('DEBUG', 'Consignment was exported from TPN. Import halting');
				}
			}
			else
			{
				nlapiLogExecution('DEBUG', 'Incorrect formId: ' + formId);
			}	

		}

	}
	catch(e)
	{
		errorHandler('consignmentImportEntryPoint', e);
	}
}

/*******************************************************************************
 * @param 	type
 * @returns correctType - checks to see if the type was create from the record
 ******************************************************************************/
function checkType(type)
{
	try
	{
		// default false - if false script will not run
		var correctType = false;

		nlapiLogExecution('DEBUG', ' type: ' + type);

		//TODO: put this to CREATE once it's been done.
		if(type == "edit" || type == "create")
		{
			correctType = true;
		}

		return correctType;
	}	
	catch(e)
	{
		errorHandler('checkType', e);
	}
}

/*******************************************************************************
 * Initialise any globals to default values, get params etc etc
 * 
 ******************************************************************************/
function initialise()
{
	try
	{
		context = nlapiGetContext();

		todaysDate = getTodaysDate();
		todaysDateNS = nlapiDateToString(todaysDate);

		day = d.getDate();
		month = parseInt(d.getMonth()+1);
		date = day  + "/" + month + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

		recordInternalID = nlapiGetRecordId();

		rec = nlapiLoadRecord('salesorder',recordInternalID);
		consignmentExported = rec.getFieldValue('custbody_exportedfromtpn');
		customerInternalID = rec.getFieldValue('entity');

		formId = rec.getFieldValue('custbody_formid');
		nlapiLogExecution('AUDIT', '############ custbody_formid form id: ' + formId);
		//TODO: Check here
		if(isBlank(formId))
		{
			formId = rec.getFieldValue('customform');
			nlapiLogExecution('AUDIT', '############ customform form id: ' + formId);
		}
		currentUser = context.getUser();

		hereToThereFormId = context.getSetting('SCRIPT', 'custscript_importheretothere');
		thereToHereFormId = context.getSetting('SCRIPT', 'custscript_importtheretohere');
		thereToThereFormId = context.getSetting('SCRIPT', 'custscript_importtheretothere');

		hereToThereExtFormId = context.getSetting('SCRIPT', 'custscript_importheretothere_ext');
		thereToHereExtFormId = context.getSetting('SCRIPT', 'custscript_importtheretohere_ext');
		thereToThereExtFormId = context.getSetting('SCRIPT', 'custscript_importtheretothere_ext');
		//_importheretothere_ext
		//_importtheretohere_ext
		//_importtheretothere_ext

//		nlapiLogExecution('DEBUG', 'here to there form id: ' + hereToThereFormId);
//		nlapiLogExecution('DEBUG', 'there to here form id: ' + thereToHereFormId);
//		nlapiLogExecution('DEBUG', 'there to there form id: ' + thereToThereFormId);

//		nlapiLogExecution('DEBUG', 'here to there Ext form id: ' + hereToThereExtFormId);
//		nlapiLogExecution('DEBUG', 'there to here Ext form id: ' + thereToHereExtFormId);
//		nlapiLogExecution('DEBUG', 'there to there Ext form id: ' + thereToThereExtFormId);

		nlapiLogExecution('DEBUG', 'Was the consignment exported from TPN: ' + consignmentExported);
		nlapiLogExecution('DEBUG', 'customer ID: ' + customerInternalID);

		mandatoryPopulated = true;
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function findNSUserName()
{
	try
	{
		// declare temp variables
		var userIDFilters = new Array();
		var userIDColumns = new Array();
		var userIDSearch = null;
		var userID = null;

		// filter by the account name
		userIDFilters[0] = new nlobjSearchFilter('internalid',null,'is', currentUser);

		// return the users netsuite id
		userIDColumns[0] = new nlobjSearchColumn('entityid');

		// conduct the search
		userIDSearch = nlapiSearchRecord('employee', null, userIDFilters, userIDColumns);

		if(userIDSearch)
		{
			userID = userIDSearch[0].getValue(userIDColumns[0]);

			return userID;
		}
	}
	catch(e)
	{
		errorHandler('findNSUserName', e);
	}
}

/*******************************************************************************
 * Get relevant fields from netsuite
 * No field can be null, must be blank or populated
 * 
 ******************************************************************************/
function getConsignmentData()
{
	try
	{		
		// get field values from netsuite record
		getNumberFields();

		nlapiLogExecution('DEBUG', 'got number fields');

		getConsigneeFields();

		nlapiLogExecution('DEBUG', 'got consignee fields');

		getConsignorFields();

		nlapiLogExecution('DEBUG', 'got consignor fields');

		getVariousConsignmentFields();

		nlapiLogExecution('DEBUG', 'got various fields');

		getPalletFields();

		nlapiLogExecution('DEBUG', 'got pallet fields');

		getInsuranceFields();

		nlapiLogExecution('DEBUG', 'got insurance fields');


		//mandatoryChecks();	
	}
	catch(e)
	{
		errorHandler('getConsignmentData', e);
	}
}

function getNumberFields()
{
	try
	{
		// not mandatory - should be blank
		docket = '';

		// not mandatory - should be blank
		oldDocket = '';

		// mandatory - Records tranID from NS
		thirdPartyID = rec.getFieldValue('tranid');

		// not mandatory
		customerRef = rec.getFieldValue('otherrefnum');

		//customerRef = '';

		/**notused**/
		depotRef = '';

		// mandatory - format is DD/MM/YYYY HH:MM:SS
		createdDate = date;

		//mandatory
		requestingDepotNumber = rec.getFieldValue('custbody_palletrequestingdepot');

		// mandatory
		collectionDepotNumber =  rec.getFieldValue('custbody_palletcollectingdepot');

		if(collectionDepotNumber == null)
		{
			collectionDepotNumber = rec.getFieldValue('custbody_sendingdepot');
		}

		//mandatory 
		//deliveryDepotNumber = rec.getFieldValue('custbody_receivingdepot');



	}
	catch(e)
	{
		errorHandler('getNumberFields', e);
	}
}

function getVariousConsignmentFields()
{
	try
	{

		deliveryServiceCode = rec.getLineItemValue('item','item', 1);

		deliveryServiceCode = getDeliveryServiceCode();

		nlapiLogExecution('DEBUG', 'Dev service name' + deliveryServiceCode);

		collectionServiceCode = 'EC';

		//  not mandatory - either date, time, date & time depending on delivery service - REVIEW
		deliveryDateTime = rec.getFieldValue('custbody_pallettmservice_time');

		if(deliveryDateTime == null)
		{
			deliveryDateTime = date;
		}

		// change
		consignmentPublicNote = '';

		// UNUSUED
		deliveryCharge = '';
		collectionCharge = '';
		hubCharge = '';

		// not mandatory - REVIEW
		customerAccountCode = rec.getFieldText('entity');
		customerName = '';
		customerContactName = rec.getFieldValue('custbody_pickupcontact');
		customerTelephone = rec.getFieldValue('custbody_pickuptelno');

		// not mandatory - either true or false - default is false REVIEW
		customerOwnPaperwork = rec.getFieldValue('custbody_palletownpaperwork');

		if(customerOwnPaperwork == 'f')
		{
			customerOwnPaperwork = false;
		}
		else
		{
			customerOwnPaperwork = true;
		}
	}
	catch(e)
	{
		errorHandler('getVariousConsignmentFields', e);
	}
}

function getDeliveryServiceCode()
{
	try
	{
		// declare temp variables
		var deliveryIDFilters = new Array();
		var deliveryIDColumns = new Array();
		var deliveryIDSearch = null;
		var deliveryID = null;

		// filter by the account name
		deliveryIDFilters[0] = new nlobjSearchFilter('internalid',null,'is', deliveryServiceCode);

		// return the deliverys netsuite id
		deliveryIDColumns[0] = new nlobjSearchColumn('itemid');

		// conduct the search
		deliveryIDSearch = nlapiSearchRecord('item', null, deliveryIDFilters, deliveryIDColumns);

		if(deliveryIDSearch)
		{
			deliveryID = deliveryIDSearch[0].getValue(deliveryIDColumns[0]);

			return deliveryID;
		}
	}
	catch(e)
	{
		errorHandler('getDeliveryServiceCode', e);
	}
}

/********************************************************************************************************
 * getConsignorFields
 * 
 * 
 * 
 ********************************************************************************************************/
function getConsigneeFields() 
{	
	try
	{
		//Changed this from custbody_deliverycontact to custbody_delname
		consigneeName = rec.getFieldValue('custbody_delname');

		// split and put into the relevant address boxes
		consigneeAddress = rec.getFieldValue('custbody_deliveryaddressselect');

		if(consigneeAddress.length <= 0)
		{
			// uh...
			// consigneeAddress = something else
		}

		consigneeAddressRecord  = nlapiLoadRecord('customrecord_deliveryaddress', consigneeAddress);
		nlapiLogExecution('AUDIT', '############# consigneeAddress VALUE: ', consigneeAddress);

		consigneeAddress1 = left(consigneeAddressRecord.getFieldValue('custrecord_deladdress_addr1'), 50);
		consigneeAddress2 = left(consigneeAddressRecord.getFieldValue('custrecord_deladdress_addr2'), 50);
		consigneeAddress3 = left(consigneeAddressRecord.getFieldValue('custrecord_deladdress_city'), 50);
		consigneeAddress4 = left(consigneeAddressRecord.getFieldValue('custrecord_deladdress_county'), 50);
		consigneePostcode = left(consigneeAddressRecord.getFieldValue('custrecord_deladdress_postcode'), 50);

		
		nlapiLogExecution('AUDIT', '############# consigneePostcode VALUE: ', consigneePostcode);

		nlapiLogExecution('DEBUG', 'Delivery depot number prior: ', deliveryDepotNumber);


		//nlapiLogExecution('AUDIT', '##### BEFORE deliveryDepotNumber #####', '####:' + deliveryDepotNumber + ':####');
		deliveryDepotNumber = getDepotFromPostCode(consigneePostcode);
		//nlapiLogExecution('AUDIT', '##### AFTER deliveryDepotNumber #####', '####:' + deliveryDepotNumber + ':####');

//		if(consigneePostcode != null)
//		{	
//		nlapiLogExecution('ERROR', '## consigneePostcode != null ##', consigneePostcode);
//		updatedDeliveryDepot = getDepotFromPostCode(consigneePostcode);

//		if(updatedDeliveryDepot != -1)
//		{
//		deliveryDepotNumber = updatedDeliveryDepot;
//		}
//		}

		nlapiLogExecution('DEBUG', 'Delivery depot number After: ', deliveryDepotNumber);

		// not mandatory
		consigneeContactName = rec.getFieldValue('custbody_deliverycontact');

		// not mandatory
		consigneeTelephone = rec.getFieldValue('custbody_deliverytelno');

		// not mandatory
		consigneeEmail = rec.getFieldValue('custbody_consignee_email');
	}
	catch(e)
	{
		errorHandler('getConsigneeFields', e);
	}
}


/********************************************************************************************************
 * getConsignorFields
 * 
 * 
 * 
 ********************************************************************************************************/
function getConsignorFields()
{
	try
	{
		// mandatory - Needs to be split and put into the relevant address boxes
		consignorAddress = rec.getFieldValue('custbody_pickupaddressselect');

		nlapiLogExecution('DEBUG', 'consignor Address output: ' + consignorAddress);

		if(consignorAddress == null)
		{
			// always get the first line for the company if this is being used
			consignorAddressRecord = nlapiLoadRecord('customer', customerInternalID);

			nlapiLogExecution('DEBUG', 'company name: ' + consignorAddressRecord.getFieldValue('companyname'));

			consignorAddress1 = consignorAddressRecord.getLineItemValue('addressbook', 'addr1', 1);

			nlapiLogExecution('DEBUG', 'consignorAddress1: ' + consignorAddress1);

			consignorAddress2 = left(consignorAddressRecord.getLineItemValue('addressbook', 'addr2', 1), 50);
			consignorAddress3 = left(consignorAddressRecord.getLineItemValue('addressbook', 'city', 1), 50);
			consignorAddress4 = left(consignorAddressRecord.getLineItemValue('addressbook', 'state', 1), 50);
			consignorPostcode = left(consignorAddressRecord.getLineItemValue('addressbook', 'zip', 1), 50);
			
			
			
			

		}
		else
		{
			consignorAddressRecord  = nlapiLoadRecord('customrecord_deliveryaddress', consignorAddress);

			consignorAddress1 = left(consignorAddressRecord.getFieldValue('custrecord_deladdress_addr1'), 50);
			consignorAddress2 = left(consignorAddressRecord.getFieldValue('custrecord_deladdress_addr2'), 50);
			consignorAddress3 = left(consignorAddressRecord.getFieldValue('custrecord_deladdress_city'), 50);
			consignorAddress4 = left(consignorAddressRecord.getFieldValue('custrecord_deladdress_county'), 50);
			consignorPostcode = left(consignorAddressRecord.getFieldValue('custrecord_deladdress_postcode'), 50);
		}

		// mandatory
		consignorName = rec.getFieldValue('custbody_deliverycontact');

		//Added 5/12/2013 - if the consignor address is na etc then put Address 1 in instead.
		if((consignorName == 'na') || (consignorName == '') || (consignorName == 'n/a') || (consignorName == null)|| (consignorName == '.'))
		{
			consignorName = consignorAddress1;
		}

		//nlapiLogExecution('DEBUG', 'Collection depot number prior: ', collectionDepotNumber);

		// What's this for?
//		if(consignorPostcode != null)
//		{	
//		updatedCollectionDepot = getDepotFromPostCode(consignorPostcode);

//		if(updatedDeliveryDepot != -1)
//		{
//		deliveryDepotNumber = updatedCollectionDepot;
//		}
//		}

		nlapiLogExecution('DEBUG', 'Collection depot number after: ', collectionDepotNumber);

		// not mandatory
		consignorContactName = rec.getFieldValue('custbody_pickupcontact');

		// not mandatory
		consignorTelephone = rec.getFieldValue('custbody_pickuptelno');

		// not mandatory
		consignorEmail = '';
	}
	catch(e)
	{
		errorHandler('getConsignorFields', e);
	}
}


/********************************************************************************************************
 * getPalletFields
 * 
 * 
 ********************************************************************************************************/
function getPalletFields()
{
	try
	{
		palletCount = rec.getLineItemCount('recmachcustrecord_palletlistconsignmentlookup');

		// i starts at one because the NS sublist starts at 1 
		for(var i = 1; i <= palletCount; i++)
		{

			var palletSize = rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup', i);

			// in reference to the internal ID for each of the pallet size types, see custom record pallet size list	
			switch(parseInt(palletSize))
			{
			case 1:
				numberOfFullPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				weightOfFullPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 2:
				numberOfFullOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				weightOfFullOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 3:
				numberOfHalfPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				weightOfHalfPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 4:
				numberOfHalfOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				weightOfHalfOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;

			case 5:
				numberOfQuarterPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				weightOfQuarterPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;	
			default:

				break;
			}
		}
	}
	catch(e)
	{
		errorHandler('getPalletFields', e);
	}
}

/*************************************************************************************
 * getInsuranceFields
 * 
 * 
 *************************************************************************************/
function getInsuranceFields()
{
	try
	{
		// mandatory - but 0 if not required REVIEW
		sumInsured = rec.getFieldValue('custbody_insuranceamount');
		if(sumInsured == null)
		{
			sumInsured = 0;
		}

		// not mandatory REVIEW
		insuredInNameOF = '';
		insuredEmailAddress = '';
		enteredBy = currentUser;
	}
	catch(e)
	{
		errorHandler('getInsuranceFields', e);
	}
}

/**************************************************************************************
 * unescapeXml
 * 
 * @param escapedXml
 * @returns {String}
 **************************************************************************************/
function unescapeXml(escapedXml)
{
	var unescaped = escapedXml.replace(/&gt;/g, '>');
	unescaped = unescaped.replace(/&lt;/g, '<');
	return unescaped;    
}


/**************************************************************************************
 * getDepotFromPostCode
 * 
 * @param inputPostCode
 * @returns {String}
 **************************************************************************************/
function getDepotFromPostCode(inputPostCode)
{
	var retVal = '';
	var errorFound = false;

	try
	{

		inputPostCode = nlapiEscapeXML(inputPostCode);
		//inputPostCode = 'BH15 2AF';
		nlapiLogExecution('ERROR', '##### inputPostCode: ', ':' + inputPostCode + ':');


		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/GetDepotFromPostcode';

		// build SOAP request
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject +='<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
		postObject +='<soap12:Body>';
		postObject += '<GetDepotFromPostcode xmlns="TPNImportExport">';
		postObject +='<inputPostcode>' + inputPostCode +'</inputPostcode>';
		postObject +='</GetDepotFromPostcode>';
		postObject +='</soap12:Body>';
		postObject +='</soap12:Envelope>';

		nlapiLogExecution('ERROR', '##### postObject: ', postObject);

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');

		responseCode = responseObject.getCode();
		responseBody = responseObject.getBody();

		nlapiLogExecution('ERROR', '## responseCode: ', responseCode);
		nlapiLogExecution('ERROR', '## responseBody: ', nlapiEscapeXML(responseBody));

		// tpn error handler
		errorFound = tpnErrorHandler(responseBody);

		if(errorFound != true)
		{


			responseBody = unescapeXml(responseBody);
			responseBody = responseBody.replace(' xmlns="TPNImportExport"', '');

			objResponseXML = nlapiStringToXML(responseBody.toString());
			nlapiLogExecution('AUDIT', '### Get Depot From Postcode responseBody.toString(): ', responseBody.toString());


			if(objResponseXML == null)
			{
				nlapiLogExecution('DEBUG', 'Issue converting string, characters in responseXML: ', responseXML.length);
			}
			else
			{
				// check to see if any child nodes are present
				nlapiLogExecution('DEBUG', '### objResponseXML response xml', objResponseXML.hasChildNodes());

				resultsNode = objResponseXML;

				nlapiLogExecution('DEBUG', '### objResponseXML resultsNode', resultsNode);

				if(objResponseXML.hasChildNodes())
				{
					// select the string nodes inside of the below node
					resultsNode =  nlapiSelectValue(objResponseXML, '//GetDepotFromPostcodeResult');

					// log number of nodes
					nlapiLogExecution('AUDIT', '### Get Depot From Postcode Result: ', resultsNode);

					var testOutput = '';
					testOutput = resultsNode.replace('<', '.');
					nlapiLogExecution('AUDIT', '### Get Depot From Postcode testOutput: ', testOutput);
				}
			}

			retVal = resultsNode;
			nlapiLogExecution('DEBUG', '### Get Depot From Postcode retVal: ', retVal);
		}
	}
	catch(e)
	{
		errorHandler('sendSoapRequest', e);
	}
	nlapiLogExecution('DEBUG', '### returning retVal: ', retVal);
	return retVal;
}

/**************************************************************************************************
 * mandatoryChecks
 * 
 * 
 **************************************************************************************************/
function mandatoryChecks()
{
	try
	{
		// Check that mandatory fields are populated
		if(thirdPartyId.length < 0)
		{
			mandatoryPopulated = false;
		}

		if(requestingDepotNumber.length < 0)
		{
			mandatoryPopulated = false;
		}

		if(collectionDepotNumber.length < 0)
		{
			mandatoryPopulated = false;
		}
	}
	catch(e)
	{
		errorHandler('mandatoryChecks', e);
	}
}
/**************************************************************************************************
 * buildStringForParam
 * 
 * 
 **************************************************************************************************/
function buildStringForParam()
{
	try
	{
		paramString = docket;
		paramString += ',';
		paramString += oldDocket;
		paramString += ',';
		paramString += thirdPartyID;
		paramString += ',';
		paramString += nullCheck(customerRef);
		paramString += ',';
		paramString += depotRef;
		paramString += ',';
		paramString += createdDate;
		paramString += ',';
		paramString += requestingDepotNumber;
		paramString += ',';
		paramString += collectionDepotNumber;
		paramString += ',';
		paramString += deliveryDepotNumber;
		paramString += ',';
		paramString += nullCheck(consignorName);
		paramString += ',';
		paramString += nullCheck(consignorAddress1);
		paramString += ',';
		paramString += nullCheck(consignorAddress2);
		paramString += ',';
		paramString += nullCheck(consignorAddress3);
		paramString += ',';
		paramString += nullCheck(consignorAddress4);
		paramString += ',';
		paramString += nullCheck(consignorPostcode);
		paramString += ',';
		paramString += nullCheck(consignorContactName);
		paramString += ',';
		paramString += nullCheck(consignorTelephone);
		paramString += ',';
		paramString += nullCheck(consignorEmail);
		paramString += ',';
		paramString += nullCheck(consigneeName);
		paramString += ',';
		paramString += nullCheck(consigneeAddress1);
		paramString += ',';
		paramString += nullCheck(consigneeAddress2);
		paramString += ',';
		paramString += nullCheck(consigneeAddress3);
		paramString += ',';
		paramString += nullCheck(consigneeAddress4);
		paramString += ',';
		paramString += consigneePostcode;
		paramString += ',';
		paramString += nullCheck(consigneeContactName);
		paramString += ',';
		paramString += nullCheck(consigneeTelephone);
		paramString += ',';
		paramString += nullCheck(consigneeEmail);
		paramString += ',';
		paramString += deliveryServiceCode;
		paramString += ',';
		paramString += collectionServiceCode;
		paramString += ',';
		paramString += nullCheck(deliveryDateTime);
		paramString += ',';
		paramString += nullCheck(consignmentPublicNote);
		paramString += ',';
		paramString += nullCheck(deliveryCharge);
		paramString += ',';
		paramString += nullCheck(collectionCharge);
		paramString += ',';
		paramString += nullCheck(hubCharge);
		paramString += ',';
		paramString += nullCheck(customerAccountCode);
		paramString += ',';
		paramString += nullCheck(customerName);
		paramString += ',';
		paramString += nullCheck(customerContactName);
		paramString += ',';
		paramString += nullCheck(customerTelephone);
		paramString += ',';
		paramString += customerOwnPaperwork;
		paramString += ',';
		paramString += numberOfQuarterPallets;
		paramString += ',';
		paramString += weightOfQuarterPallets;
		paramString += ',';
		paramString += numberOfHalfPallets;
		paramString += ',';
		paramString += weightOfHalfPallets;
		paramString += ',';
		paramString += numberOfHalfOSPallets;
		paramString += ',';
		paramString += weightOfHalfOSPallets;
		paramString += ',';
		paramString += numberOfFullPallets;
		paramString += ',';
		paramString += weightOfFullPallets;
		paramString += ',';
		paramString += numberOfFullOSPallets;
		paramString += ',';
		paramString += weightOfFullOSPallets;
		paramString += ',';
		paramString += sumInsured;
		paramString += ',';
		paramString += premiumPayable;
		paramString += ',';
		paramString += nullCheck(insuredInNameOF);
		paramString += ',';
		paramString += nullCheck(insuredEmailAddress);
		paramString += ',';
		paramString += nullCheck(enteredBy);

		nlapiLogExecution('AUDIT', 'paramString complete: ', paramString);

	}
	catch(e)
	{
		errorHandler('buildStringForParam', e);
	}
}

/**************************************************************************************************
 * buildTestString
 * 
 * 
 **************************************************************************************************/
function buildTestString()
{
	try
	{
		docket = "4817238";
		oldDocket = "";
		thirdPartyID = "test1";
		customerRef = "";
		depotRef = "";
		createdDate = "22/10/2013 20:56";
		requestingDepotNumber = "16";
		collectionDepotNumber = "16";
		deliveryDepotNumber = "16";
		consigneeName = "Brian Connelly";
		consigneeAddress1 = "36 Cavendish Road";
		consigneeAddress2 = "Hazel Grove";
		consigneeAddress3 = "Stockport";
		consigneeAddress4 = "Greater Manchester";
		consigneePostcode = "SK7 6HX";
		consigneeContactName = "test";
		consigneeTelephone = "123753755353";
		consigneeEmail = "erterterer@erterterr.com";
		consignorName = "AAA Safety Supplies";
		consignorAddress1 = ".";
		consignorAddress2 = ".";
		consignorAddress3 = ".";
		consignorAddress4 = ".";
		consignorPostcode = "SK76HX";
		consignorContactName = ".";
		consignorTelephone = "01457 860826";
		consignorEmail = ".";
		deliveryServiceCode = "ND";
		collectionServiceCode = "ND";
		deliveryDateTime = "";
		consignmentPublicNote = "";
		deliveryCharge = "0";
		collectionCharge = "0";
		hubCharge = "0";
		customerAccountCode = "AAA";
		customerName = "AAA Safety Supplies";
		customerContactName = ".";
		customerTelephone = ".";
		customerOwnPaperwork = "FALSE";
		numberOfQuarterPallets = "3";
		weightOfQuarterPallets = "102";
		numberOfHalfPallets = "2";
		weightOfHalfPallets = "66";
		numberOfHalfOSPallets = "0";
		weightOfHalfOSPallets = "0";
		numberOfFullPallets = "2";
		weightOfFullPallets = "180.00";
		numberOfFullOSPallets = "0";
		weightOfFullOSPallets = "0";
		sumInsured = "";
		premiumPayable = "";
		insuredInNameOF = "";
		insuredEmailAddress = "";
		enteredBy = "";
	}
	catch(e)
	{
		errorHandler('buildTestString', e);
	}
}


/**************************************************************************************************
 * importRecordIntoTpn
 * 
 * 
 * 
 **************************************************************************************************/
function importRecordIntoTpn()
{
	try
	{
		scriptParams.custscript_record_internal_id = recordInternalID;
		scriptParams.custscript_csvinformation = paramString;

		//TODO: Disabled Creation of Scheduled Script to check the correct info is being passed through.

		scheduledStatus = nlapiScheduleScript('customscript_consignment_import_sch', 'customdeploy_consignment_import_sch_dply', scriptParams);
		//nlapiLogExecution('ERROR', 'SCHEDULED SCRIPT IS DISABLED' , '#####################################################');
		nlapiLogExecution('DEBUG', 'Scheduled status is: ' + scheduledStatus);
		//logAllFields();
	}
	catch(e)
	{
		errorHandler('importRecordIntoTpn', e);
	}
}



/**************************************************************************************************
 * logAllFields
 * 
 * 
 * 
 **************************************************************************************************/
function logAllFields()
{
	nlapiLogExecution('DEBUG', 'mandatoryPopulated: ' + mandatoryPopulated);
	nlapiLogExecution('DEBUG', 'docket (ExternalID): TPN02:' + docket);
	nlapiLogExecution('DEBUG', 'oldDocket: ' + oldDocket);
	nlapiLogExecution('DEBUG', 'thirdPartyID: ' + thirdPartyID );
	nlapiLogExecution('DEBUG', 'customerRef: ' + customerRef);
	nlapiLogExecution('DEBUG', 'depotRef: ' + depotRef);
	nlapiLogExecution('DEBUG', 'createdDate' + createdDate);
	nlapiLogExecution('DEBUG', 'requestingDepotNumber: ' + requestingDepotNumber);
	nlapiLogExecution('DEBUG', 'collectionDepotNumber: ' + collectionDepotNumber);
	nlapiLogExecution('DEBUG', 'deliveryDepotNumber: ' + deliveryDepotNumber);
	nlapiLogExecution('DEBUG', 'consigneeName: ' + consigneeName);
	nlapiLogExecution('DEBUG', 'consigneeAddress: ' + consigneeAddress);
	nlapiLogExecution('DEBUG', 'consigneeAddress1: ' + consigneeAddress1);
	nlapiLogExecution('DEBUG', 'consigneeAddress2: ' + consigneeAddress2);
	nlapiLogExecution('DEBUG', 'consigneeAddress3: ' + consigneeAddress3);
	nlapiLogExecution('DEBUG', 'consigneeAddress4: ' + consigneeAddress4);
	nlapiLogExecution('AUDIT', '## consigneePostcode: ' + consigneePostcode);
	nlapiLogExecution('DEBUG', 'consigneeContactName: ' + consigneeContactName);
	nlapiLogExecution('DEBUG', 'consigneeTelehpone: ' + consigneeTelephone);
	nlapiLogExecution('DEBUG', 'consigneeEmail: ' + consigneeEmail);
	nlapiLogExecution('DEBUG', 'consignorName: ' + consignorName);
	nlapiLogExecution('DEBUG', 'consignorAddress: ' + consignorAddress);
	nlapiLogExecution('DEBUG', 'consignorAddress1: ' + consignorAddress1);
	nlapiLogExecution('DEBUG', 'consignorAddress2: ' + consignorAddress2);
	nlapiLogExecution('DEBUG', 'consignorAddress3: ' + consignorAddress3);
	nlapiLogExecution('DEBUG', 'consignorAddress4: ' + consignorAddress4);
	nlapiLogExecution('DEBUG', 'consignorPostcode: ' + consignorPostcode);
	nlapiLogExecution('DEBUG', 'consignorContactName: ' + consignorContactName);
	nlapiLogExecution('DEBUG', 'consignorTelephone: ' + consignorTelephone);
	nlapiLogExecution('DEBUG', 'consignorEmail: ' + consignorEmail);
	nlapiLogExecution('DEBUG', 'deliveryServiceCode: ' + deliveryServiceCode);
	nlapiLogExecution('DEBUG', 'collectionServiceCode: ' + collectionServiceCode);
	nlapiLogExecution('DEBUG', 'deliveryDateTime: ' + deliveryDateTime);
	nlapiLogExecution('DEBUG', 'consignmentPublicNote: ' + consignmentPublicNote);
	nlapiLogExecution('DEBUG', 'deliveryCharge: ' + deliveryCharge );
	nlapiLogExecution('DEBUG', 'collectionCharge: ' + collectionCharge);
	nlapiLogExecution('DEBUG', 'hubCharge: ' + hubCharge );
	nlapiLogExecution('DEBUG', 'customerAccountCode: ' + customerAccountCode);
	nlapiLogExecution('DEBUG', 'customerName: ' + customerName );
	nlapiLogExecution('DEBUG', 'customerContactName: ' + customerContactName );
	nlapiLogExecution('DEBUG', 'customerTelephone: ' + customerTelephone);
	nlapiLogExecution('DEBUG', 'customerOwnPaperwork: ' + customerOwnPaperwork);
	nlapiLogExecution('DEBUG', 'numberOfQuarterPallets: ' + numberOfQuarterPallets);
	nlapiLogExecution('DEBUG', 'weightOfQuarterPallets: ' + weightOfQuarterPallets);
	nlapiLogExecution('DEBUG', 'numberOfHalfPallets: ' + numberOfHalfPallets);
	nlapiLogExecution('DEBUG', 'weightOfHalfPallets: ' + weightOfHalfPallets);
	nlapiLogExecution('DEBUG', 'numberOfHalfOSPallets: ' + numberOfHalfOSPallets);
	nlapiLogExecution('DEBUG', 'weightOfHalfOSPallets: ' + weightOfHalfOSPallets);
	nlapiLogExecution('DEBUG', 'numberOfFullPallets: ' + numberOfFullPallets);
	nlapiLogExecution('DEBUG', 'weightOfFullPallets: ' + weightOfFullPallets);
	nlapiLogExecution('DEBUG', 'numberOfFullOSPallets: ' + numberOfFullOSPallets);
	nlapiLogExecution('DEBUG', 'weightOfFullOSPallets' + weightOfFullOSPallets);
	nlapiLogExecution('DEBUG', 'sumInsured: ' + sumInsured);
	nlapiLogExecution('DEBUG', 'premiumPayable: ' + premiumPayable);
	nlapiLogExecution('DEBUG', 'insuredInNameOF: ' + insuredInNameOF );
	nlapiLogExecution('DEBUG', 'insuredEmailAddress: ' + insuredEmailAddress);
	nlapiLogExecution('DEBUG', 'enteredBy: ' + enteredBy);
}


/**************************************************************************************************
 * 
 * 
 * 
 * @param inputString
 * @returns {Boolean}
 **************************************************************************************************/
function tpnErrorHandler(inputString)
{
	var errorString = null;
	var errorFlag = false;

	try
	{
		errorString = inputString.indexOf("error");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("fail");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("-1");	
		if(errorString != -1)
		{
			errorFlag = true;
		}
		errorString = inputString.indexOf("null");	
		if(errorString != -1)
		{
			errorFlag = true;
		}

		if(errorFlag == true)
		{
			nlapiLogExecution('DEBUG', 'errors found');
			errorCounter++;
			errorMainString += errorCounter+":" +inputString + " , ";
		}
	}
	catch(e)
	{
		errorHandler('tpnErrorHandler', e);
	}

	return errorFlag;
}


/***************************************************************************************************
 * 
 * tpnErrorLogger - Logs the Error in a TPN Error Record
 * 
 ***************************************************************************************************/
function tpnErrorLogger()
{
	var tpnErrorLogRecord = null;
	var errorMethod = null;
	var tpnErrorLogRecordID = null;

	try
	{
		// 3 = edit consignment value
		errorMethod = 1;

		tpnErrorLogRecord = nlapiCreateRecord('customrecord_tpnresponseoutput');
		tpnErrorLogRecord.setFieldValue('custrecord_tro_outputmessage', errorMainString);		
		tpnErrorLogRecord.setFieldValue('custrecord_tro_tpnmethod', errorMethod);
		tpnErrorLogRecordID = nlapiSubmitRecord(tpnErrorLogRecord);

		nlapiLogExecution('DEBUG', 'Errors submitted under record: ' + tpnErrorLogRecordID);

	}
	catch(e)
	{
		errorHandler('tpnErrorLogger', e);
	}
}

/***************************************************************************************************
 * 
 *  nullCheck - function to replace null, blank, empty with just a space
 * 
 * 	@param inputString {String} - the input you wish to check
 * 	@returns - either the original String, or a ' ' if it null/blank etc
 * 
 ***************************************************************************************************/
function nullCheck(inputString)
{
	var retVal = '';

	try
	{
		if(inputString == '' || inputString == null || inputString == 'null' || inputString == 'na' || inputString == 'n/a')
		{
			retVal = '';
		}
		else
		{
			retVal = inputString;
		}
	}
	catch(e)
	{
		errorHandler('nullCheck', e);	
	}
	return retVal;
}

/********************************************************************************************
 * 
 * trim Prototype for String
 * 
 * 
 ********************************************************************************************/
String.prototype.trim = function() 
{ 
	return this.replace(/^\s+|\s+$/g, ''); 
};






/*********************************************************************************************
 * 
 * getTodaysDate - Calculates the date in GMT time zone.
 * 
 * @returns {Date}
 * 
 *********************************************************************************************/
function getTodaysDate()
{
	var retVal = new Date();
	var currentServerDate = new Date();
	var currentTimeHours = 0;

	try
	{
		currentTimeHours = currentServerDate.getHours();
		if(currentTimeHours < 8)
		{
			retVal = subtractDaysFromDate(currentServerDate, 1);
		}
		else
		{
			retVal = currentServerDate;
		}
	}
	catch(e)
	{
		errorHandler('getTodaysDate', e);
	}
	return retVal;
}


/********************************************************************************************
 * 
 * subtractDaysFromDate - Pass in the Date and the Days to subtract, returns calculated date
 * 
 * @param date - The date you wish to start from
 * @param days - The number of days you wish to subtract
 *
 * @returns {Date} - The calculated date
 * 
 ********************************************************************************************/
function subtractDaysFromDate(date, days) 
{
	return new Date(
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate() - days,
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
	);
}


/***************************************************************************************************
 * isBlank - Is the string you are passing through considered blank?
 * 
 * @param inputString - The String you wish to check
 * 
 * @returns {Boolean} - The outcome. True if it is blank/null, false if it isn't.
 ***************************************************************************************************/
function isBlank(inputString)
{
	var retVal = false;
	try
	{
		if((inputString == '') || (inputString == null) || (inputString.length == 0))
		{
			retVal = true;
		}
	}
	catch(e)
	{
		errorHandler('isBlank', e);
	}
	return retVal;
}

/***************************************************************************************************
 * left - get the left most characters
 * 
 * @param str - input string
 * @param n - how many characters you want the string to be
 * @returns - the string
 ***************************************************************************************************/
function left(str, n)
{
	if ((n <= 0) || (n == null))
	{
		return "";
	}
	else if (n > String(str).length)
	{
		return str;
	}
	else
	{
		return String(str).substring(0,n);
	}
}

/***************************************************************************************************
 * right - get the right most characters
 * 
 * @param str - input string
 * @param n - how many characters you want the string to be
 * @returns - the string
 ***************************************************************************************************/
function right(str, n)
{
	if ((n <= 0) || (n == null))
	{
		return "";
	}
	else if (n > String(str).length)
	{
		return str;
	}
	else 
	{
		var iLen = String(str).length;
		return String(str).substring(iLen, iLen - n);
	}
}


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
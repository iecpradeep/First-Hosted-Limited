/*******************************************************************************
 * Module Description
 * 
 * Date Created    Author/s     
 * 03 Oct 2013     Peter Lewis
 * 				   Anthony Nixon
 * Last update: 19th December 2013, Peter Lewis (Synthetic Imports check box and Class)
 * 
 *******************************************************************************/

/***|Globals|***/

var FullRecordId = 1;	//fullpallet	F \ PALLET	1250	120	100	210
var FullOversizeRecordId = 2;	//fullpalletovs	F OS \ PALLET	1250	250	100	210
var HalfRecordId = 3;	//halfpallet	H \ PALLET	500	120	100	100
var	HalfOversizeRecordId = 4;	//halfpalletovs	H OS \ PALLET	500	250	100	100
var	QuarterRecordId	= 5; //quarterpallet	Q \ PALLET	250	120	100	60

var context = null;
var docketNumber = null;
var consignmentType = null;
var orphanAccount = null;
var TPNAccount = null;
var splitDocketNumbers = null;
var docketArray = new Array();
var inboundNumber = null;

//var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var serviceURI = 'http://www.tpnonline.net/TPNImportExport/service.asmx?op=';
var userName = '';
var password = '';
var serviceOperation = 'ConsignmentExport';
var postXML = '';
var responseObject = null;
var genericHeader = '';
var genericFooter = '';

//SOAP variables
var soapHeaders = new Array();
var responseObject = null; 
var recievingUrl = '';
var encodedCredentials = '';
var postObject = '';

//docket SOAP variables
var responseBody = null;
var responseCode = null;
var recordArray = null;
var splitRecords = null;

//docket information
var splitDate = null;
var serviceItem = null;
var customerInternalID = null;
var existingDocket = null;
var consignmentAPCLabelType = 7;

//netsuite/tpn fields
var docket = '';
var oldDocket = '';
var thirdPartyID = null;
var customerRef = null;
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
var customerAccountName = null;
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
var premiumPayable = '';
var insuredInNameOF = '';
var insuredEmailAddress = '';
var enteredBy = '';
var correctEmail = '';

//record used for the Pallet Consignment Sublist (Matched Records)
var palletConsignmentRecord = null;

//vars for this record
var palletRecHeight = 0;
var palletRecWidth = 0;
var palletRecDepth = 0;
var palletRecordObj = null;
var palletRecID = null;
var wasExported = null; 
var palletTotalWeight = 0;
var palletTotalPallets = 0;

//serviceType vars
var serviceTypeParcel = 1;
var serviceTypePallet = 2;	//needed for TPN
var serviceTypeOther = 3;

//form variables
var formID = 0;
var thisDepot = null;
var depotInt = 0;

//error vars
var errorCounter = 0;
var errorMainString = '';
var responseBody = null;

//Date Overwriting
var dateSection = '';

//Delivery Address Record Fields
var addressRecordName = '';

var todaysDate = new Date();
var todaysDateNS = '';

//delivery date vars
var cutOffTime = null;
var daysToAdd = null;
var gmtDay = null;
var gmtHours = null;
var gmtYear = null;
var gmtMonth = null;
var gmtDayOfWeek = null;
var deliveryDate = new Date();


/*******************************************************************************
 * @param {String} type Context Types: scheduled, ondemand, userinterface, aborted, skipped
 * @returns {Void}
 *
 *******************************************************************************/
function getExportDocketNumberEntryPoint(type) 
{
	try
	{
		// initialise any important vars
		initialise();
		processDocketNumbers();
	}
	catch(e)
	{
		errorHandler('getExportDocketNumberEntryPoint', e);
	}
}

function initialise()
{
	try
	{
		// there internal ID of TPN to identify consignment origin in NetSuite
		wasExported = 2;
		context = nlapiGetContext();
		docketNumber = context.getSetting('SCRIPT', 'custscript_docketnumber');
		orphanAccount = context.getSetting('SCRIPT', 'custscript_orphanaccount');
		consignmentType = context.getSetting('SCRIPT', 'custscript_consignmenttypedocket');
		TPNAccount = context.getSetting('SCRIPT', 'custscript_tpnaccount');
		userName = context.getSetting('SCRIPT','custscript_usernamegetdocket');
		password = context.getSetting('SCRIPT','custscript_passwordgetdocket');
		hereToThereFormID = context.getSetting('SCRIPT', 'custscript_heretothere');
		thereTohereFormID = context.getSetting('SCRIPT', 'custscript_theretohere');
		thereToThereFormID = context.getSetting('SCRIPT', 'custscript_theretothere');
		thisDepot = context.getSetting('SCRIPT', 'custscript_thisdepot');
		inboundNumber = context.getSetting('SCRIPT', 'custscript_inboundtpndelclass');
		outboundNumber = context.getSetting('SCRIPT', 'custscript_outboundtpndelclass');

		todaysDate = getTodaysDate();
		todaysDateNS = nlapiDateToString(todaysDate);

		nlapiLogExecution('DEBUG', 'This depot:' + thisDepot);
		nlapiLogExecution('DEBUG', 'User name:' + userName);
		nlapiLogExecution('DEBUG', 'Password:' + password);
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function processDocketNumbers()
{
	try
	{

		if(docketNumber != null)
		{	
			splitDocketNumbers = docketNumber.split(',');	

			nlapiLogExecution('Debug', 'Number of docket numbers: ' + parseInt(splitDocketNumbers.length));

			// a fail safe if the consignment number is null
			if(consignmentType == null)
			{
				nlapiLogExecution('Debug', 'Consignment type is null, setting to 4');
				consignmentType = 4;
			}

			sendSOAPRequest();
		}
		else
		{
			nlapiLogExecution('DEBUG', 'No valid dockets were found');
		}
	}
	catch(e)
	{
		errorHandler('processDocketNumbers', e);
	}
}

function sendSOAPRequest(serviceTypeName)
{
	try
	{
		//convert the credentials to Base 64 in order to pass through via SOAP
		encodedCredentials = nlapiEncrypt(userName + ":" + password, 'base64');

		//initialise SOAP headers
		soapHeaders['Content-type'] =  "text/xml";
		soapHeaders['SOAPAction'] = 'TPNImportExport/ConsignmentExport';

		// build SOAP request
		postObject = '<?xml version="1.0" encoding="utf-8"?>';
		postObject +='<soap12:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap12="http://www.w3.org/2003/05/soap-envelope">';
		postObject +='<soap12:Body>';
		postObject +='<ConsignmentExport xmlns="TPNImportExport">';
		postObject +='<Username>' + userName + '</Username>';
		postObject +='<Password>' + password + '</Password>';
		postObject +='<DocketNumbers>';

		// to do intelligent splitting based on number of dockets
		for(var i = 0; i < splitDocketNumbers.length ; i++)
		{
			// -1 because the last result is always null due to the split
			postObject +='<string>' + splitDocketNumbers[i] + '</string>';
		}
		postObject +='</DocketNumbers>';
		postObject +='</ConsignmentExport>';
		postObject +='</soap12:Body>';
		postObject +='</soap12:Envelope>';

		// connecting to TPN by sending the SOAP request and getting the response
		responseObject = nlapiRequestURL(serviceURI, postObject, soapHeaders, 'POST');
		responseCode = responseObject.getCode();
		responseBody = responseObject.getBody();

		nlapiLogExecution('DEBUG', 'response code: ', responseCode);
		nlapiLogExecution('DEBUG', 'response body: ', responseBody);

		responseBody = responseObject.getBody();
		tpnErrorHandler(responseBody);

		// the "success" code from TPN is 200
		if(responseCode == 200)
		{
			nlapiLogExecution('DEBUG', 'Correct code recieved, processing Dockets');
			processDockets();
		}
		else
		{
			nlapiLogExecution('DEBUG', 'Incorrect code unable to process dockets');
		}
	}
	catch(e)
	{
		errorHandler('sendSOAPRequest', e);
	}
}

function processDockets()
{
	try 
	{
		responseBody = responseObject.getBody();
		recordArray = responseBody.split("\n");
		splitRecords = new Array();

		// creating a 2D array [x][y]
		for(var i=0; i<recordArray.length; i++)
		{
			splitRecords[i] = recordArray[i].split(",");	
		}

		// scroll through the x array - [x][y]
		for(var i=0; i < splitRecords.length-1; i++)	
		{
			// pull information from the y array - [x][y]

			// declare temps 
			var tempConsignmentRecord = null;
			var tempConsignmentId = null;
			var deliveryAddressRecord = null;
			var deliveryAddressRecordID = null;

			// initialise the docket variables
			docket = splitRecords[i][0].trim(); // done
			oldDocket = splitRecords[i][1]; /**notused**/
			thirdPartyID = splitRecords[i][2]; // not needed on export
			customerRef = splitRecords[i][3]; // done
			depotRef = splitRecords[i][4]; /**notused**/
			createdDate = splitRecords[i][5]; // done
			requestingDepotNumber = splitRecords[i][6]; // done
			collectionDepotNumber = splitRecords[i][7]; // done
			deliveryDepotNumber = splitRecords[i][8]; // done
			consigneeName = splitRecords[i][9]; // done
			consigneeAddress1 = splitRecords[i][10]; // done
			consigneeAddress2 = splitRecords[i][11]; // done
			consigneeAddress3 = splitRecords[i][12]; // done
			consigneeAddress4 = splitRecords[i][13]; // done
			consigneePostcode = splitRecords[i][14]; // done
			consigneeContactName = splitRecords[i][15]; // done
			consigneeTelephone = splitRecords[i][16]; // done
			consigneeEmail = splitRecords[i][17]; // done
			consignorName = splitRecords[i][18]; // done
			consignorAddress1 = splitRecords[i][19]; // done
			consignorAddress2 = splitRecords[i][20]; // done
			consignorAddress3 = splitRecords[i][21]; // done
			consignorAddress4 = splitRecords[i][22]; // done
			consignorPostcode = splitRecords[i][23]; // done
			consignorContactName = splitRecords[i][24]; // done
			consignorTelephone = splitRecords[i][25]; // done
			consignorEmail = splitRecords[i][26]; // done
			deliveryServiceCode = splitRecords[i][27]; // done
			collectionServiceCode = splitRecords[i][28]; /** notused - no place for this to go **/ 
			deliveryDateTime = splitRecords[i][29]; /** notused - unable to find place for this to go **/
			consignmentPublicNote = splitRecords[i][30]; /** notused - unable to find place for this to go **/
			deliveryCharge = splitRecords[i][31]; /** notused - unable to find place for this to go **/
			collectionCharge = splitRecords[i][32]; /** notused - unable to find place for this to go **/
			hubCharge = splitRecords[i][33]; /** notused - unable to find place for this to go **/
			customerAccountCode = splitRecords[i][34]; // done
			customerAccountName = splitRecords[i][35]; // done 
			customerContactName = splitRecords[i][36]; /** notused - unable to find place for this to go **/
			customerTelephone = splitRecords[i][37]; /** notused - unable to find place for this to go **/
			customerOwnPaperwork = splitRecords[i][38]; // done
			numberOfQuarterPallets = splitRecords[i][39]; // done
			weightOfQuarterPallets = splitRecords[i][40]; // done
			numberOfHalfPallets = splitRecords[i][41]; // done
			weightOfHalfPallets = splitRecords[i][42]; // done
			numberOfHalfOSPallets = splitRecords[i][43]; // done
			weightOfHalfOSPallets = splitRecords[i][44]; // done
			numberOfFullPallets = splitRecords[i][45]; // done
			weightOfFullPallets = splitRecords[i][46]; // done
			numberOfFullOSPallets = splitRecords[i][47]; // done
			weightOfFullOSPallets = splitRecords[i][48]; // done
			sumInsured = splitRecords[i][49]; // done
			premiumPayable = splitRecords[i][50]; /** notused - unable to find place for this to go**/
			insuredInNameOF = splitRecords[i][51]; /** notused - unable to find place for this to go**/
			insuredEmailAddress = splitRecords[i][52]; /** notused - unable to find place for this to go**/
			enteredBy = splitRecords[i][53]; /** notused - unable to find place for this to go**/

			// only do for the first docket
			if(i == 0)
			{
				docket = docket.split("<ConsignmentExportResult>");
				docket = docket[1];
			}

			// search for exsiting records with this docket on it
			existingDocket = findExistingDockets();

			if(existingDocket == true)
			{
				nlapiLogExecution('DEBUG', 'Docket: ' + docket + ' exists, moving to next');
			}
			else
			{

				// create a record per x array
				tempConsignmentRecord = nlapiCreateRecord('salesorder', false);

				// determine form ID
				selectCorrectForm();

				// set netsuite form 
				tempConsignmentRecord.setFieldValue('customform', formID); 

				//#####################################################################################
				//TODO: set the APC First Date


				nlapiLogExecution('AUDIT', '### todaysDateNS: ', todaysDateNS);

				tempConsignmentRecord.setFieldValue('custbody_apcimportfirstdate', todaysDateNS);

				//#####################################################################################

				// set the docket number
				//tempConsignmentRecord.setFieldValue('otherrefnum', docket);
				tempConsignmentRecord.setFieldValue('externalid', 'TPN02:' + docket);
				tempConsignmentRecord.setFieldValue('custbody_tpnconsignmentidentifier', 'TPN02:' + docket);

				// split the TPN date to only have the date and not date and time
				splitDate = createdDate.split(" ");
				createdDate = splitDate[0];

				//Modified 9th January 2014 - If the Req
				
				
				if((requestingDepotNumber == depotInt) && (collectionDepotNumber == depotInt))
				{
					nlapiLogExecution('AUDIT', 'Req Col Depots Identical...setting date to CreatedDate', '#############################');
					//leave the created date alone...
					//createdDate = createdDate; //##############################################################################################################################################
				}
				else
				{
					if(dateSection != '')
					{
						createdDate = dateSection;
					}
					else
					{
						//TODO: if it's after 7am get the next working day

						gmtDayOfWeek = todaysDate.getUTCDay();
						gmtDay = todaysDate.getUTCDate();
						gmtYear = todaysDate.getUTCFullYear();
						gmtMonth = todaysDate.getUTCMonth();
						gmtHours = todaysDate.getUTCHours();

						getDeliveryDate();

						createdDate = nlapiDateToString(deliveryDate);

					}
				}





				tempConsignmentRecord.setFieldValue('trandate', createdDate);

				//Changed 12/11/2013 @ 08:58 - added Parcel field.
				tempConsignmentRecord.setFieldValue('custbody_palletparcel', serviceTypePallet);




//				// the request depots - these will be used to determine the form type
//				tempConsignmentRecord.setFieldValue('custbody_palletrequestdepot', requestingDepotNumber);
//				tempConsignmentRecord.setFieldValue('custbody_palletcollectingdepot', collectionDepotNumber);
//				tempConsignmentRecord.setFieldValue('custbody_sendingdepot',collectionDepotNumber);
//				tempConsignmentRecord.setFieldValue('custbody_receivingdepot ',deliveryDepotNumber);

				// setting the delivery contact
				tempConsignmentRecord.setFieldValue('custbody_deliverycontact', consigneeName);

				//set the synthetic job type (9th December 2013 - PAL)
				tempConsignmentRecord.setFieldValue('custbody_syntheticimport', 'T');


				// uses the service name in a search to get the internal id of service name
				serviceItem = getItemFromServiceName(deliveryServiceCode);

				// creates a new line item with the service on
				tempConsignmentRecord.selectNewLineItem('item');
				tempConsignmentRecord.setCurrentLineItemValue('item', 'item', serviceItem);

				// Add all the pallet weights and number of pallets togeva
				palletTotalWeight = parseInt(weightOfQuarterPallets) + parseInt(weightOfFullOSPallets) + parseInt(weightOfFullPallets) + parseInt(weightOfHalfPallets) + parseInt(weightOfHalfOSPallets);
				palletTotalPallets = parseInt(numberOfQuarterPallets) + parseInt(numberOfHalfPallets) + parseInt(numberOfHalfOSPallets) + parseInt(numberOfFullPallets) + parseInt(numberOfFullOSPallets);

				nlapiLogExecution('DEBUG', 'Pallet total weight: ' + palletTotalWeight);
				nlapiLogExecution('DEBUG', 'Pallet total pallet: ' + palletTotalPallets);

				// Completed. Set the line item details
				tempConsignmentRecord.setCurrentLineItemValue('item','custcol_totalweight_pallets', palletTotalWeight);
				tempConsignmentRecord.setCurrentLineItemValue('item','custcol_numberofpallets', palletTotalPallets);

				//TODO: Line Item Classifaction
				if((deliveryDepotNumber == depotInt) && (collectionDepotNumber != depotInt))
				{
					tempConsignmentRecord.setCurrentLineItemValue('item','class', inboundNumber);
				}
				else
				{
					tempConsignmentRecord.setCurrentLineItemValue('item','class', outboundNumber);
				}

				tempConsignmentRecord.commitLineItem('item');

				//TODO: Custbody_deliverypostcode
				//Custbody_deliverypostcode (consigneePostcode??)
				tempConsignmentRecord.setFieldValue('custbody_deliverypostcode', consigneePostcode);

				// Custbody_delname
				//Custbody_delname (consigneeContactName??)
				tempConsignmentRecord.setFieldValue('custbody_delname', consigneeContactName);

				//Custbody_labelservice (deliveryServiceCode)
				tempConsignmentRecord.setFieldValue('custbody_labelservice', deliveryServiceCode);


				tempConsignmentRecord.setFieldValue('custbody_labelparcels', palletTotalPallets);
				tempConsignmentRecord.setFieldValue('custbody_labeltotalweight', palletTotalWeight);

				customerInternalID = getCustomerIDByAccountName(customerAccountCode, orphanAccount);
				tempConsignmentRecord.setFieldValue('entity', customerInternalID);

				//TODO: Line Item Classifaction
				if((deliveryDepotNumber == depotInt) && (collectionDepotNumber != depotInt))
				{
					tempConsignmentRecord.setFieldValue('class', inboundNumber);
				}
				else
				{
					//TODO Class for transaction here
					tempConsignmentRecord.setFieldValue('class', outboundNumber);
				}

				//This code has been replaced with a more functional check further down.
//				// check the email address 
//				correctEmail = consigneeEmail.search("@");

//				if(correctEmail == -1)
//				{
//				consigneeEmail = '';
//				}

				// create a address record for the consignee				
				deliveryAddressRecord = nlapiCreateRecord('customrecord_deliveryaddress');

				//if Address1 is blank, use Contact Name.
				if(consigneeAddress1 == '')
				{
					deliveryAddressRecord.setFieldValue('name', consigneeContactName + ', ' + consigneePostcode);
				}
				else
				{
					deliveryAddressRecord.setFieldValue('name', consigneeAddress1 + ', ' + consigneePostcode);
				}


				deliveryAddressRecord.setFieldValue('custrecord_deladdressname',consigneeContactName);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_custid',customerInternalID);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_addr1',consigneeAddress1);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_addr2',consigneeAddress2);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_city',consigneeAddress3);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_county',consigneeAddress4);
				deliveryAddressRecord.setFieldValue('custrecord_deladdress_postcode', consigneePostcode);
				deliveryAddressRecord.setFieldValue('custrecord_deladdresstelno', consigneeTelephone);
				deliveryAddressRecord.setFieldValue('custrecord_contactname', consigneeContactName);

				//do email address check

				consigneeEmail = checkEmail(consigneeEmail);
				deliveryAddressRecord.setFieldValue('custrecord_consignee_email', consigneeEmail);


				// deliveryAddressRecord.setFieldValue('custrecord_countryaddress',); - TO DO
				// deliveryAddressRecord.setFieldValue('custpage_eiretownselect',); - TO DO

				// currently ignoring mandatory fields as data from TPN not always consistent
				deliveryAddressRecordID = nlapiSubmitRecord(deliveryAddressRecord, true, true); 

				// unable to use above ID with delivery field so instead put information in manually
				tempConsignmentRecord.setFieldValue('custbody_deliveryaddress', consigneeAddress3 + '\n' + consigneeAddress1 + '\n' + consigneeAddress2 + '\n' + consigneeAddress4 + "\n" + consigneePostcode);
				tempConsignmentRecord.setFieldValue('custbody_delpostcodesearch', consigneePostcode);
				tempConsignmentRecord.setFieldValue('custbody_deliverytelno', consigneeTelephone);
				tempConsignmentRecord.setFieldValue('custbody_consignee_email', consigneeEmail);
				tempConsignmentRecord.setFieldValue('custbody_deliveryaddressselect', deliveryAddressRecordID);

				// put in the consignor information manually

				if(consignorContactName == null)
				{
					tempConsignmentRecord.setFieldValue('custbody_pickupcontact', consignorContactName);

				}
				else
				{
					tempConsignmentRecord.setFieldValue('custbody_pickupcontact', consignorName);
				}

				tempConsignmentRecord.setFieldValue('custbody_pickupaddress', consignorAddress3 + '\n' + consignorAddress1 + '\n' + consignorAddress2 +'\n'+ consignorAddress4 + '\n' + consignorPostcode);
				tempConsignmentRecord.setFieldValue('custbody_pickuptelno', consignorTelephone);		

				// convert customerOwnPaperwork to work with check box
				if(customerOwnPaperwork == 'true')
				{
					customerOwnPaperwork = 'T';
				}
				else
				{
					customerOwnPaperwork = 'F';
				}

				tempConsignmentRecord.setFieldValue('custbody_palletownpaperwork',customerOwnPaperwork);
				tempConsignmentRecord.setFieldValue('custbody_insuranceamount',sumInsured);
				tempConsignmentRecord.setFieldValue('custbody_palletrequestdepot', requestingDepotNumber);
				tempConsignmentRecord.setFieldValue('custbody_requestingdepot', requestingDepotNumber);
				tempConsignmentRecord.setFieldValue('custbody_palletcollectingdepot', collectionDepotNumber);
				tempConsignmentRecord.setFieldValue('custbody_sendingdepot',collectionDepotNumber);
				nlapiLogExecution('DEBUG', 'Setting recieving  depot to: ' + deliveryDepotNumber);
				tempConsignmentRecord.setFieldValue('custbody_receivingdepot', deliveryDepotNumber);

				deliveryDateTime = getNetSuiteTime(deliveryDateTime);

				tempConsignmentRecord.setFieldValue('custbody_pallettmservice_time', deliveryDateTime);

				// set this to two as it was imported from tpn
				tempConsignmentRecord.setFieldValue('custbody_exportedfromtpn', wasExported);

				//extra fields which neeed
				//##################################################
				//custbody_quarterpalletsallowed - checkbox set T
				tempConsignmentRecord.setFieldValue('custbody_quarterpalletsallowed', 'T');

				//custbody_pickupaddresspostcode
				tempConsignmentRecord.setFieldValue('custbody_pickupaddresspostcode', consigneePostcode);

				//custbody_palletdeliveryzone ????????
				tempConsignmentRecord.setFieldValue('custbody_palletdeliveryzone', 'A');

				//custbody_labeldimension
				tempConsignmentRecord.setFieldValue('custbody_labeldimension', consignmentAPCLabelType);

				//custbody_formchangeauto - checkbox set T
				tempConsignmentRecord.setFieldValue('custbody_formchangeauto', 'T');

				//custbody_default_pallet_service - set to service type
				tempConsignmentRecord.setFieldValue('custbody_default_pallet_service', serviceItem);

				//custbody_currentlabelcount - set to 0
				tempConsignmentRecord.setFieldValue('custbody_currentlabelcount', 0);

				//#################################################	

				nlapiLogExecution('DEBUG', 'Submitting');

				// submit the record
				tempConsignmentId = nlapiSubmitRecord(tempConsignmentRecord, true, true);

				nlapiLogExecution('DEBUG', 'Submitted the consignment... building pallet');

				// build the pallets

				if(numberOfQuarterPallets > 0)
				{
					createPalletConsignmentRecordLinks(tempConsignmentId, QuarterRecordId, weightOfQuarterPallets, numberOfQuarterPallets);		
				}

				if(numberOfHalfPallets > 0)
				{
					createPalletConsignmentRecordLinks(tempConsignmentId, HalfRecordId, weightOfHalfPallets, numberOfHalfPallets);
				}

				if(numberOfHalfOSPallets > 0)
				{							
					createPalletConsignmentRecordLinks(tempConsignmentId, HalfOversizeRecordId, weightOfHalfOSPallets, numberOfHalfOSPallets);
				}

				if(numberOfFullPallets > 0)
				{
					createPalletConsignmentRecordLinks(tempConsignmentId, FullRecordId, weightOfFullPallets, numberOfFullPallets);
				}

				if(numberOfFullOSPallets > 0)
				{
					createPalletConsignmentRecordLinks(tempConsignmentId, FullOversizeRecordId, weightOfFullOSPallets, numberOfFullOSPallets);
				}

				nlapiLogExecution('DEBUG', 'Docket: TPN02:' + docket + ' exported from TPN successfully');
			}
		}

		nlapiLogExecution('DEBUG', 'Number of records retrieved: '+ parseInt(splitRecords.length-1));
	}
	catch(e)
	{
		errorHandler('processDockets', e);
	}
}

function selectCorrectForm()
{
	try
	{		
		// temp vars
		var requestingDepotNumberInt = null;
		var collectionDepotNumberInt = null;
		var deliveryDepotNumberInt = null;

//		nlapiLogExecution('DEBUG', 'hereToThereFormID: ' + hereToThereFormID);
//		nlapiLogExecution('DEBUG', 'thereTohereFormID: ' + thereTohereFormID);
//		nlapiLogExecution('DEBUG', 'thereToThereFormID: ' + thereToThereFormID);

//		nlapiLogExecution('DEBUG', 'Requesting depot: ' + requestingDepotNumber);
//		nlapiLogExecution('DEBUG', 'Collection depot: ' + collectionDepotNumber);
//		nlapiLogExecution('DEBUG', 'delivery depot: ' + deliveryDepotNumber);

		requestingDepotNumberInt = parseInt(requestingDepotNumber);
		collectionDepotNumberInt = parseInt(collectionDepotNumber);
		deliveryDepotNumberInt = parseInt(deliveryDepotNumber);

//		nlapiLogExecution('DEBUG', 'Requesting depot int: ' + requestingDepotNumberInt);
//		nlapiLogExecution('DEBUG', 'Collection depot int: ' + collectionDepotNumberInt);
//		nlapiLogExecution('DEBUG', 'delivery depot int: ' + deliveryDepotNumberInt);


		if(requestingDepotNumberInt == collectionDepotNumberInt)
		{
			// here to there
			formID = hereToThereFormID;
		}
		else
		{	
			if(requestingDepotNumberInt == deliveryDepotNumberInt) 
			{
				// there to here
				formID = thereTohereFormID;
			}
			else
			{
				// there to there
				formID = thereToThereFormID;
			}
		}
	}
	catch(e)
	{
		errorHandler('selectCorrectForm', e);
	}
}

function findExistingDockets()
{
	try
	{
		var retVal = false;

		// declare temp variables
		var docketIDFilters = new Array();
		var docketIDColumns = new Array();
		var docketIDSearch = null;
		var docketID = null;

		// filter by the account name
		//docketIDFilters[0] = new nlobjSearchFilter('otherrefnum',null,'equalto', docket);
		docketIDFilters[0] = new nlobjSearchFilter('custbody_tpnconsignmentidentifier',null,'is', 'TPN02:' + docket);

		// return the dockets netsuite id
		//docketIDColumns[0] = new nlobjSearchColumn('otherrefnum');
		docketIDColumns[0] = new nlobjSearchColumn('custbody_tpnconsignmentidentifier');

		// conduct the search
		docketIDSearch = nlapiSearchRecord('salesorder', null, docketIDFilters, docketIDColumns);

		if(docketIDSearch)
		{
			docketID = docketIDSearch[0].getValue(docketIDColumns[0]);

			if(docketID.length > 0 )
			{
				retVal = true;
			}
		}

		return retVal;
	}
	catch(e)
	{
		errorHandler('findExistingDockets', e);
	}

}

function getItemFromServiceName(serviceName)
{
	var retVal = 0;

	try
	{
		if(serviceName)
		{
			// declare temp variables
			var itemIDFilters = new Array();
			var itemIDColumns = new Array();
			var itemIDSearch = null;

			// filter by the account name
			itemIDFilters[0] = new nlobjSearchFilter('name',null,'is', serviceName);

			// return the items netsuite id
			itemIDColumns[0] = new nlobjSearchColumn('internalid');

			// conduct the search
			itemIDSearch = nlapiSearchRecord('item', null, itemIDFilters, itemIDColumns);

			if(itemIDSearch)
			{
				retVal = itemIDSearch[0].getValue(itemIDColumns[0]);
			}
			else
			{
				//need to create the item Record
			}
		}
		else
		{
			//no valid value passed
		}
	}
	catch(e)
	{
		errorHandler('getItemFromServiceName', e);
	}
	return retVal;
}

function createPalletConsignmentRecordLinks(headerTransactionInternalId, palletSizeRecordId, weight, quantity)
{
	try
	{
		nlapiLogExecution('DEBUG', 'Creating a pallet for consignment record: ' + headerTransactionInternalId);

		palletRecordObj = nlapiLoadRecord('customrecord_palletsize', palletSizeRecordId);
		palletRecDepth = palletRecordObj.getFieldValue('custrecord_maxlength');
		palletRecWidth = palletRecordObj.getFieldValue('custrecord_maxwidth');
		palletRecHeight = palletRecordObj.getFieldValue('custrecord_maxheight');

		palletConsignmentRecord = nlapiCreateRecord('customrecord_palletconsignmentlist');
		palletConsignmentRecord.setFieldValue('custrecord_palletlistsizelookup', palletSizeRecordId);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistquantity', quantity);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistweight', weight);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistconsignmentlookup', headerTransactionInternalId);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistheight', palletRecHeight);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistwidth', palletRecWidth);
		palletConsignmentRecord.setFieldValue('custrecord_palletlistdepth', palletRecDepth);

		palletRecID = nlapiSubmitRecord(palletConsignmentRecord);

		nlapiLogExecution('Debug', 'palletRecID: ' + palletRecID);

	}
	catch(e)
	{
		errorHandler('createPalletConsignmentRecordLinks', e);	
	}
}

/**
 *  Lib - Conduct a basic search with 1 filter and 1 column
 */
function getCustomerIDByAccountName(accountName, orphanAccount)
{
	try
	{
		// declare temp variables
		var customerIDFilters = new Array();
		var customerIDColumns = new Array();
		var customerIDSearch = null;
		var customerIDResult = null;
		var customerRecord = null;
		var isAccountName = true;

		nlapiLogExecution('DEBUG', 'this depot: ' , thisDepot);
		depotInt = parseInt(thisDepot, 10);

		nlapiLogExecution('DEBUG', 'depot Int: ', depotInt);

		nlapiLogExecution('DEBUG', 'delivery depot: ' + parseInt(deliveryDepotNumber, 10));
		nlapiLogExecution('DEBUG', 'collection depot: ' + parseInt(collectionDepotNumber, 10));

		// check to see if consignment is inbound
		if((deliveryDepotNumber == depotInt) && (collectionDepotNumber != depotInt))
		{
			customerIDResult = TPNAccount;
		}
		else
		{
			nlapiLogExecution('DEBUG', 'Account name: ' + accountName);
			if(accountName.length == 0)
			{
				isAccountName = false;
			}

			// if there is an account name do the standard search

			if(isAccountName == true)
			{
				// filter by the account name
				customerIDFilters[0] = new nlobjSearchFilter('entityid',null,'is', accountName);

				// return the customers netsuite id
				customerIDColumns[0] = new nlobjSearchColumn('internalid');

				// conduct the search
				customerIDSearch = nlapiSearchRecord('customer', null, customerIDFilters, customerIDColumns);

				if(customerIDSearch)
				{
					customerIDResult = customerIDSearch[0].getValue(customerIDColumns[0]);
				}
				else
				{
					// no record for this account found
					customerRecord = nlapiCreateRecord('customer');
					customerRecord.setFieldValue('entityid', accountName);
					customerRecord.setFieldValue('companyname', accountName);	
					customerIDResult = nlapiSubmitRecord(customerRecord, true, true);	
				}
			}
			else
			{
				nlapiLogExecution('DEBUG', 'No customer account found, assigning to orphan customer');
				// if there is no account name, used the orphan account
				customerIDResult = orphanAccount;
			}
		}

		return customerIDResult;
	}
	catch(e)
	{
		errorHandler('getCustomerIDByAccountName', e);
	}
}

function getDeliveryDate()
{
	cutOffTime = 7;

	try
	{
		if(gmtHours > cutOffTime)
		{
			workOutDaysToAdd();

			nlapiLogExecution('DEBUG', 'Days to add worked out');

			deliveryDate.setDate(gmtDay + daysToAdd);

			nlapiLogExecution('DEBUG', 'Delivery date gotten');
		}
	}
	catch(e)
	{
		errorHandler('getDeliveryDate', e);
	}
}

function workOutDaysToAdd()
{
	try
	{		
		switch(gmtDayOfWeek)
		{
		case 0: // sunday

			daysToAdd = 1;
			break;
		case 1: // monday

			daysToAdd = 1;
			break;
		case 2: // tuesday

			daysToAdd = 1;
			break;
		case 3: // wednesday

			daysToAdd = 1;
			break;
		case 4: // thursday

			daysToAdd = 1;
			break;
		case 5: // friday

			daysToAdd = 3;
			break;
		case 6: // saturday

			daysToAdd = 2;
			break;

		default:
			daysToAdd = 1;
		break;

		}
	}
	catch(e)
	{
		errorHandler('workOutDaysToAdd', e);
	}
}

/**************************************************************************************************************
 * 
 * getNetSuiteTime - Gets the time in 24hour format, and returns it 
 * 
 * 
 **************************************************************************************************************/
function getNetSuiteTime(time24)
{
	var retVal = '00:00 am';	
	var timeArray = new Array();
	var suffix = 'am';
	var hourValue = 0;
	var removeDateSplit = new Array();
	var removeDateSplitLength = 0;
	var removeDateSplitHour = '00';
	var removeDateSplitPosition = 0;

	try
	{
		dateSection = '';

		timeArray = time24.split(':');
		if(timeArray)
		{
			if(timeArray.length >= 2)
			{
				if(timeArray[0].length > 2)
				{
					nlapiLogExecution('AUDIT', 'time24 Parameter', time24);

					//invalid time...do checks here
					removeDateSplit = timeArray[0].split('/');

					if(removeDateSplit.length > 1)
					{
						//there was a slash...
						nlapiLogExecution('ERROR', 'getNetSuiteTime', 'A slash was found in the Time string: ' + timeArray[0]);
						removeDateSplitLength = removeDateSplit[2].length;
						switch (removeDateSplitLength)
						{
						case 6:
						case 7:
							// Get the Date Part and make it the TranDate - Fixed 29th November @ 1:13 am

							removeDateSplitHour = removeDateSplit[2];
							nlapiLogExecution('AUDIT', 'Date Section removeDateSplitHour', '"' + removeDateSplitHour + '"');

							removeDateSplitPosition = removeDateSplitHour.lastIndexOf(' ');
							nlapiLogExecution('AUDIT', 'Date Section removeDateSplitPosition', '"' + removeDateSplitPosition + '"');

							removeDateSplitHour = removeDateSplitHour.substring(removeDateSplitPosition + 1, removeDateSplitLength - 1);
							nlapiLogExecution('AUDIT', 'Date Section Print', '"' + removeDateSplitHour + '"');


							removeDateSplitPosition =  timeArray[0].indexOf(' ');
							nlapiLogExecution('AUDIT', '### Date Section removeDateSplitPosition v2', '"' + removeDateSplitPosition + '"');
							dateSection = timeArray[0].substring(0, removeDateSplitPosition);
							nlapiLogExecution('ERROR', '### Date Section Print v1', '"' + dateSection + '"');

							//dateSection = removeDateSplitHour.substring(0, removeDateSplitPosition);
							//nlapiLogExecution('AUDIT', 'Date Section Print v2', '"' + dateSection + '"');


							timeArray[0] = removeDateSplitHour;
							nlapiLogExecution('AUDIT', '### Date Section timeArray[0] ', '"' + timeArray[0]  + '"');


							break;
						default:
							nlapiLogExecution('AUDIT', 'DEFAULT triggered on Date Section Print', '"' + dateSection + '"');
						timeArray[0] = '11';
						break;
						}
					}
					else
					{
						//not sure...
						nlapiLogExecution('ERROR', 'getNetSuiteTime', 'Something odd was found in the Time string: ' + timeArray[0]);
						timeArray[0] = '11';
					}
				}
				if(timeArray[0] > 11)
				{
					hourValue = timeArray[0];
					hourValue = parseInt(hourValue);
					hourValue -= 12;
					timeArray[0] = hourValue;
					suffix = 'pm';
				}
				retVal = timeArray[0] + ':' + timeArray[1] + ' ' + suffix;
			}
		}
	}
	catch(e)
	{
		errorHandler('getNetSuiteTime', e);
	}
	return retVal;
}







/********************************************************************************************
 * 
 * checkEmail
 * 
 * @param {String} email address to validate
 * @returns {Boolean} whether the email address is valid or not 
 * 
 ********************************************************************************************/
function checkEmail(email)
{
	var retVal = '';
	try
	{
		if(validateEmailAddress(email))
		{

			retVal = email;
			nlapiLogExecution('AUDIT', 'Email Address is valid', 'Email Address: ' + email);
		}
		else
		{
			//it's invalid
			retVal = '';
			//nlapiLogExecution('AUDIT', 'INVALID EMAIL ADDRESS', 'INVALID EMAIL ADDRESS: ' + email);
		}
	}
	catch(e)
	{
		errorHandler('checkEmail', e);
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


/********************************************************************************************
 * 
 * addDaysToDate - Pass in the Date and the Days to add, returns calculated date
 * 
 * @param date - The date you wish to start from
 * @param days - The number of days you wish to add
 *
 * @returns {Date} - The calculated date
 * 
 ********************************************************************************************/
function addDaysToDate(date, days) 
{
	return new Date(
			date.getFullYear(), 
			date.getMonth(), 
			date.getDate() + days,
			date.getHours(),
			date.getMinutes(),
			date.getSeconds(),
			date.getMilliseconds()
	);
}


/*******************************************************************************************
 * 
 * getNextWorkingDayDiff - Pass in the current Day and returns the number of days you need 
 * 						   to Add to get the next working day
 * 
 * @param dayOfWeek {Number} - The current day of week
 * 
 * @returns {Number} - The number of days you need to add
 * 
 *******************************************************************************************/
function getNextWorkingDayDiff(dayOfWeek)
{
	var retVal = -1;

	try
	{
		switch(dayOfWeek)
		{
		case 0: //Sunday
		case 1: //Monday
		case 2: //Tuesday
		case 3: //Wednesday
		case 4: //Thursday
			retVal = 1; //Next day is just Add 1
			break;

		case 5: //Friday (Should never happen...)
			retVal = 3; //Sat Sun Mon = Add 3
			break;
		case 6: //Saturday (Sshould never happen...)
			retVal = 2; //Sun Mon = Add 2
			break;
		}
	}
	catch(e)
	{
		errorHandler('getNextWorkingDay', e);
	}
	return retVal;
}

/********************************************************************************************
 * 
 * getDateForTodaysDeliveries - Pass in the Date to return the correct TranDate for this delivery
 * 
 * @param date - The date you wish to pass through
 *
 * @returns {Date} - The calculated TranDate
 * 
 ********************************************************************************************/
function getDateForTodaysDeliveries(date) 
{
	var currentHour = -1;
	var currentNetSuiteDateTime = new Date();
	var currentDayOfWeek = -1;

	try
	{
		currentHour = currentNetSuiteDateTime.getHours();
		currentDayOfWeek = currentNetSuiteDateTime.getDay();

		switch(currentHour)
		{
		case 0:
		case 1:
		case 2:
		case 3:
		case 4:
		case 5:
		case 6:
		case 7:
		case 8:
		case 9:
		case 10:
		case 11:
		case 12:
		case 13:
		case 14:
		case 15:
		case 16:
		case 17:
		case 18:
		case 19:
		case 20:
		case 21:
		case 22:
		case 23:
			break;

		}
	}
	catch(e)
	{
		errorHandler('checkDateForTodaysDeliveries', e);
	}
}






/********************************************************************************************
 * 
 * validateEmailAddress - Validate an Email Address using a RegEx
 * 
 * @param {String} email address to validate
 * @returns {Boolean} whether the email address is valid or not 
 * 
 ********************************************************************************************/

function validateEmailAddress(email) 
{   
	var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/; 
	var retVal = true;
	try
	{
		if(reg.test(email) == false) 
		{   
			retVal = false; 
		} 
	}
	catch(e)
	{
		errorHandler('validateEmailAddress', e);
	}
	return retVal;
}




//#################################################################################################################################################################################
//#################################################################################################################################################################################

//-------------------- E R R O R    H A N D L I N G --------------------

//#################################################################################################################################################################################
//#################################################################################################################################################################################


/**************************************************************************************************************
 * 
 * tpnErrorHandler
 * 
 * 
 * 
 **************************************************************************************************************/

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

		if(errorFlag == true)
		{
			errorCounter++;
			errorMainString += errorCounter+":" +inputString + " , ";
		}
	}
	catch(e)
	{
		errorHandler('tpnErrorHandler', e);
	}
}

function tpnErrorLogger()
{
	var tpnErrorLogRecord = null;
	var errorMethod = null;
	var tpnErrorLogRecordID = null;

	try
	{
		if(errorMainString != null)
		{
			if(errorMainString.length >0)
			{	
				// 3 = edit consignment value
				errorMethod = 1;

				tpnErrorLogRecord = nlapiCreateRecord('customrecord_tpnresponseoutput');
				tpnErrorLogRecord.setFieldValue('custrecord_tro_outputmessage', errorMainString);		
				tpnErrorLogRecord.setFieldValue('custrecord_tro_tpnmethod', errorMethod);
				tpnErrorLogRecordID = nlapiSubmitRecord(tpnErrorLogRecord);

				nlapiLogExecution('DEBUG', 'Errors submitted under record: ' + tpnErrorLogRecordID);
			}
		}
	}
	catch(e)
	{
		errorHandler('tpnErrorLogger', e);
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
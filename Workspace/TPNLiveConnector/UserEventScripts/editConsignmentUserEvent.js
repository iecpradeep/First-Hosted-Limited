/*******************************************************************************
 * Module Description
 * 
 * Date            Author           
 * 03 Oct 2013     Anthony Nixon
 * Last update: 17th December 2013, Peter Lewis
 *
 *******************************************************************************/

/***|Globals|***/
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
var premiumPayable = '';
var insuredInNameOF = '';
var insuredEmailAddress = '';
var enteredBy = '';

//general vars
var consignmentExported = null;
var tpnMaster = null;
var homeDepot = null;
var customerInternalID = null;
var scheduledStatus = null;
var newType = null;
var tpnLiveAccount = null;
var docketNumber = null;
var totalPallets = 0;
var orderStatus = null;

//form vars
var formId = null;
var thereToHereFormId = null;
var hereToThereFormId = null;
var thereToThereFormId = null;
var thereToHereExtFormId = null;
var hereToThereExtFormId = null;
var thereToThereExtFormId = null;

// hardcoded number vars - see comment number to identify each in body of code
//#1
var correctStatus = 4;
//#2

function editConsignmentEntryPoint(type)
{
	try
	{
		nlapiLogExecution('DEBUG', 'Record mode: ' + type);

		// check that the script is of the correct type
		correctType = checkType(type);
		nlapiLogExecution('DEBUG', 'script of the correct type?: ' + correctType);

		if(correctType == true)
		{
			initialise();
			checkForMaster();

			// if the exported consignment origin does not equal 1 (netsuite) then we must check if TPN is the master for this consignment
			nlapiLogExecution('DEBUG', 'consign exported: ' + consignmentExported);

			if(formId == thereToHereFormId || formId == hereToThereFormId || formId == thereToThereFormId || formId == thereToHereExtFormId || formId == hereToThereExtFormId || formId == thereToThereExtFormId )
			{
				if(consignmentExported == 1)
				{				

					getConsignmentData();
					checkForCancelledOrders();
					buildStringForParam();
					importRecordIntoTpn();	
				}
				else
				{
					nlapiLogExecution('DEBUG', 'Unable to edit consignment in TPN as consignment was exported');
				}
			}
			else
			{
				nlapiLogExecution('DEBUG', 'Incorrect form ID: ' + formId);
			}
		}
	}
	catch(e)
	{
		errorHandler('editConsignmentEntryPoint', e);
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

		// replacement
		if(type == 'edit')
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
		day = d.getDate();
		vmonth = parseInt(d.getMonth());
		month = month +1;
		date = day  + "/" + month + "/" + d.getFullYear() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

		rec = nlapiLoadRecord('salesorder',nlapiGetRecordId());
		formId = rec.getFieldValue('customform');

		context = nlapiGetContext();
		homeDepot = context.getSetting('SCRIPT', 'custscript_thisdepot');
		tpnLiveAccount = context.getSetting('SCRIPT', 'custscript_tpn_live_account');
		hereToThereFormId = context.getSetting('SCRIPT', 'custscript_editheretothere');
		thereToHereFormId = context.getSetting('SCRIPT', 'custscript_edittheretohere');
		thereToThereFormId = context.getSetting('SCRIPT', 'custscript_edittheretothere');

		nlapiLogExecution('DEBUG', 'here to there form id: ' + hereToThereFormId);
		nlapiLogExecution('DEBUG', 'there to here form id: ' + thereToHereFormId);
		nlapiLogExecution('DEBUG', 'there to there form id: ' + thereToThereFormId);

		customerInternalID = rec.getFieldValue('entity');
		consignmentExported = rec.getFieldValue('custbody_exportedfromtpn');		

		tpnMaster = false;
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}

function checkForMaster()
{
	try
	{

		if(tpnLiveAccount == customerInternalID)
		{
			tpnMaster = true;
		}
		else
		{
			tpnMaster = false;
		}

		nlapiLogExecution('DEBUG', 'Tpn master: ' + tpnMaster);
	}
	catch(e)
	{
		errorHandler('checkConsignmentTPNType', e);
	}
}

function getConsignmentData()
{
	try
	{
		// get field values from netsuite record
		thirdPartyID = rec.getFieldValue('tranid');
		//docketNumber = rec.getFieldValue('otherrefnum');
		docketNumber = rec.getFieldValue('externalid');
		depotRef = '';
		customerRef = '';

		getConsigneeFields();

		nlapiLogExecution('DEBUG', 'got consignee fields');

		getConsignorFields();

		nlapiLogExecution('DEBUG', 'got consignor fields');

		getPalletFields();

		nlapiLogExecution('DEBUG', 'got pallet fields');
	}
	catch(e)
	{
		errorHandler('getConsignmentdata', e);
	}
}

function getConsigneeFields() 
{	
	try
	{
		consigneeName = rec.getFieldValue('custbody_deliverycontact');

		// split and put into the relevant address boxes
		consigneeAddress = rec.getFieldValue('custbody_deliveryaddressselect');

		if(consigneeAddress == null)
		{
			// uh...
			// cosigneeAddress = something else
		}
		else
		{
			if(consigneeAddress.length >= 0 )
			{
				consigneeAddressRecord  = nlapiLoadRecord('customrecord_deliveryaddress', consigneeAddress);

				consigneeAddress1 = consigneeAddressRecord.getFieldValue('custrecord_deladdress_addr1');
				consigneeAddress2 = consigneeAddressRecord.getFieldValue('custrecord_deladdress_addr2');
				consigneeAddress3 = consigneeAddressRecord.getFieldValue('custrecord_deladdress_city');
				consigneeAddress4 = consigneeAddressRecord.getFieldValue('custrecord_deladdress_county');
				consigneePostcode = consigneeAddressRecord.getFieldValue('custrecord_deladdress_postcode');
			}
		}

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

function getConsignorFields()
{
	try
	{
		// mandatory
		consignorName = rec.getFieldValue('custbody_pickupcontact');

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

			consignorAddress2 = consignorAddressRecord.getLineItemValue('addressbook', 'addr2', 1);
			consignorAddress3 = consignorAddressRecord.getLineItemValue('addressbook', 'city', 1);
			consignorAddress4 = consignorAddressRecord.getLineItemValue('addressbook', 'state', 1);
			consignorPostcode = consignorAddressRecord.getLineItemValue('addressbook', 'zip', 1);	
		}
		else
		{
			consignorAddressRecord  = nlapiLoadRecord('customrecord_deliveryaddress', consignorAddress);

			consignorAddress1 = consignorAddressRecord.getFieldValue('custrecord_deladdress_addr1');
			consignorAddress2 = consignorAddressRecord.getFieldValue('custrecord_deladdress_addr2');
			consignorAddress3 = consignorAddressRecord.getFieldValue('custrecord_deladdress_city');
			consignorAddress4 = consignorAddressRecord.getFieldValue('custrecord_deladdress_county');
			consignorPostcode = consignorAddressRecord.getFieldValue('custrecord_deladdress_postcode');
		}
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

function getPalletFields()
{
	try
	{
		palletCount = rec.getLineItemCount('recmachcustrecord_palletlistconsignmentlookup');

		// i starts at one because the NS sublist starts at 1 
		for(var i = 1; i <= palletCount; i++)
		{
			// not mandatory - default to 0 REVIEW
			var palletSize = rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup', i);

			// in reference to the internal ID for each of the pallet size types, see custom record pallet size list	
			switch(parseInt(palletSize))
			{
			case 1:
				numberOfFullPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				totalPallets += parseInt(numberOfFullPallets);
				weightOfFullPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 2:
				numberOfFullOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				totalPallets += parseInt(numberOfFullOSPallets);
				weightOfFullOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 3:
				numberOfHalfPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				totalPallets += parseInt(numberOfHalfPallets);
				weightOfHalfPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;
			case 4:
				numberOfHalfOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				totalPallets += parseInt(numberOfHalfOSPallets);
				weightOfHalfOSPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;

			case 5:
				numberOfQuarterPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', i));
				totalPallets += parseInt(numberOfQuarterPallets);
				weightOfQuarterPallets += parseInt(rec.getLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', i));
				break;	
			default:

				break;
			}
		}

		nlapiLogExecution('DEBUG', 'Total pallets: ' + totalPallets);
	}
	catch(e)
	{
		errorHandler('getPalletFields', e);
	}
}

function checkForCancelledOrders()
{
	try
	{
		orderStatus = rec.getFieldValue('custbody_consignmentstatus');
		if(orderStatus == correctStatus) // #1 - used to identify that the field matches the cancelled identifier 
		{
			orderStatus = 'TRUE';
		}
		else
		{
			orderStatus = 'FALSE';
		}
		
		nlapiLogExecution('DEBUG', 'Order status:' + orderStatus);
	}
	catch(e)
	{
		errorHandler('checkforCancelledOrders',e);
	}
}

function buildStringForParam()
{
	try
	{
		paramString += tpnMaster; // 0
		paramString += ',';
		paramString += thirdPartyID;
		paramString += ',';
		paramString += consigneeName;
		paramString += ',';
		paramString += consigneeAddress1;
		paramString += ',';
		paramString += consigneeAddress2;
		paramString += ',';
		paramString += consigneeAddress3; // 5
		paramString += ',';
		paramString += consigneeAddress4;
		paramString += ',';
		paramString += consigneeContactName;
		paramString += ',';
		paramString += consigneeTelephone;
		paramString += ',';
		paramString += consigneeEmail;
		paramString += ',';
		paramString += consignorName; // 10
		paramString += ',';
		paramString += consignorAddress1; 
		paramString += ',';
		paramString += consignorAddress2;
		paramString += ',';
		paramString += consignorAddress3;
		paramString += ',';
		paramString += consignorAddress4;
		paramString += ',';
		paramString += consignorContactName; // 15
		paramString += ',';
		paramString += consignorTelephone;
		paramString += ',';
		paramString += consignorEmail;
		paramString += ',';
		paramString += customerRef;
		paramString += ',';
		paramString += depotRef;
		paramString += ',';
		paramString += orderStatus; // 20
		paramString += ',';
		paramString += docketNumber; // 21
		paramString += ',';
		paramString += numberOfQuarterPallets; // 22
		paramString += ',';
		paramString += weightOfQuarterPallets; // 23
		paramString += ',';
		paramString += numberOfHalfPallets; // 24
		paramString += ',';
		paramString += weightOfHalfPallets; // 25
		paramString += ',';
		paramString += numberOfHalfOSPallets; // 26
		paramString += ',';
		paramString += weightOfHalfOSPallets; // 27
		paramString += ',';
		paramString += numberOfFullPallets; // 28
		paramString += ',';
		paramString += weightOfFullPallets; // 29
		paramString += ',';
		paramString += numberOfFullOSPallets; // 30
		paramString += ',';
		paramString += weightOfFullOSPallets; // 31
		paramString += ',';
		paramString += palletCount; // 32

		

		nlapiLogExecution('DEBUG', 'paramString complete: ', paramString);
	}
	catch(e)
	{
		errorHandler('buildStringForParam', e);
	}
}

function importRecordIntoTpn()
{
	try
	{
		scriptParams.custscript_stringinformation = paramString;
		scheduledStatus = nlapiScheduleScript('customscript_consignment_edt_sch', 'customdeploy_consignment_edit_sch_deploy', scriptParams);
		nlapiLogExecution('DEBUG', 'Scheduled status is: ' + scheduledStatus);
	}
	catch(e)
	{
		errorHandler('importRecordIntoTpn', e);
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

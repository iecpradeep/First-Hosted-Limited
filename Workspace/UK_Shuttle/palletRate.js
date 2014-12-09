/**************************************************************************************************
 * 
 * Pallet Rates Automation
 * Version 1.8.4
 * 15/12/2013 - Peter Lewis, Enabling Solutions
 * 
 * #### This script is under source control - DO NOT MODIFY! ####
 * #### ANY CHANGES YOU MAKE WILL BE LOST IN THE NEXT CODE UPDATE ####
 * 
 **************************************************************************************************/
var versionNo = '1.8.4';
var showVer = false;

var currentFormID = 0;
var batchNumberHereToThereFormID = 0;
var batchNumberThereToHereFormID = 0;
var batchNumberThereToThereFormID = 0;
var batchNumberingEnabled = 'F';
var canBeBatchNumbered = '0';
var paramRecord = null;

var windowOpener = null;
var passedValues = new Array();
var batchQuantity = 0;
var currentQuantity = 0;
var batchNumberRecordName = 'customrecord_batchnumber';
var itemId = 0;

var batchNumberEntrySuiteletID = 'customscript_batchnumberentry';
var batchNumberEntrySuiteletDeploymentID = 'customdeploy_batchnumberentry';
var batchNumberEntrySuiteletURL = '';


function isTestUser() //Used to display trace dialogues as needed
{
	var testMode = false;
	if (parseInt(nlapiGetContext().getUser()) == 8 || parseInt(nlapiGetContext().getUser()) == 7 || parseInt(nlapiGetContext().getUser()) == 873) 
	{
		testMode = true; // 8 = TESTCOMPANY	
	}
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
			result = formResults[0].getText(formColumns[1]).toLowerCase();
		}
		else
		{
			result = formResults[0].getValue(formColumns[1]);
		}

		//alert("getFormMatrixLookupValue : " + formId + "," + colvalue + "," + isText + " ==> " + result.toLowerCase());
		return result;
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
	//alert(customForm = " " + theDeliveryID);
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

function onLoad(type)
{
	paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record

	var customForm = nlapiGetFieldValue('customform');
	var formId = nlapiGetFieldValue('custbody_formid');
	nlapiSetFieldValue('custbody_formchangeauto', 'T'); //Added June 2012 to allow imports form changing to work
	//alert("customForm=" + customForm + "\nformId=" + formId);
	var useLocalOnly = nlapiGetFieldValue('custbody_localpalletclassonly');

	var allowPUR = true;    
	var now = new Date();
	var isFriday = false;
	var isWeekend = false;

	if (now.getDay() == 5) 
	{
		isFriday = true;
	}
	if (now.getDay() == 6 || now.getDay() == 0) 
	{
		isWeekend = true;
	}
	var nextdaymessage = '';
	if (isFriday) 
	{
		nextdaymessage = '.\nAs it is a Friday please set date for Monday';
	}
	if (isWeekend) 
	{
		nextdaymessage = '.\nAs it is the weekend please set date for Monday';
	}

	var nowHours = now.getHours() + parseInt(now.getTimezoneOffset() / 60);
	if (nowHours >= 24) 
	{
		nowHours -= 24;
	}
	if ((now.getMonth() > 2 && now.getMonth() < 9) || (now.getMonth() == 2 && now.getDate() > 27) || (now.getMonth() == 9 && now.getDate() < 28)) 
	{
		nowHours += 1; //Daylight savings approximation!
	}
	if (nowHours >= 12 || (nowHours == 11 && now.getMinutes() >= 30)) 
	{
		allowPUR = false;
	}

	//if (now.getMonth() == 11 && now.getDate() >= 10)
	//	nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(), 'date'), false, false);


	//if (isTestUser()) alert(nlapiGetContext().getSessionObject('cm_Params'));

	//alert(versionNo);
	//if (type == 'edit') {
	//Form change if customer services are viewing ...
	if (isCustomerService()) 
	{
		//alert ('service=' + getFormMatrixLookupValue(formId, 'custrecord_formparentform', true) + '\nformid=' + formId);				
		var parentForm = getFormMatrixLookupValue(formId, 'custrecord_formparentform', true);
		if (parentForm != null && parentForm != '' && nlapiGetFieldValue('customform') != parentForm) 
		{
			nlapiSetFieldValue('customform', parentForm, false, false);
		}
	}
	//}

	//if (type == 'create' || type == 'edit') {
	if (type == 'create') 
	{
		var defaultDriverrun = nlapiGetFieldValue('custbody_driverrun_pallets');
		if (defaultDriverrun != '' && defaultDriverrun != null) 
		{
			nlapiSetFieldValue('custbody_driverrun', defaultDriverrun, false, false); // Unallocated by default
		}
		else 
		{
			nlapiSetFieldValue('custbody_driverrun', '1', false, false); // Unallocated by default
		}        

		var currentCustomer = nlapiGetFieldValue('entity');
		var currentCustomerName = nlapiGetFieldText('entity');

		var defaultService = 91; //ND 
		var custDefaultService =  nlapiGetFieldValue('custbody_default_pallet_service');
		if (custDefaultService != null && custDefaultService != '')
		{
			defaultService = custDefaultService;
		}

		var ignoreNoLateEntry = nlapiGetFieldValue('custbody_nopalletalert');

		if (ignoreNoLateEntry == 'F' && parseInt(nowHours) >= 15)
		{
			ignoreNoLateEntry = false;
		}
		else 
		{
			ignoreNoLateEntry = true;
		}

		//if (isTestUser()) alert(customForm + ":" + formId);
		var shipType = getFormShipType(formId);
		if (shipType == '') 
		{
			shipType = getFormShipType(customForm);
		}
		var orderType = getFormOrderType(formId);
		if (orderType == '') 
		{
			orderType = getFormOrderType(customForm);
		}
		var deliveryType = getFormDeliveryType(formId);
		if (deliveryType == '') 
		{
			deliveryType = getFormDeliveryType(customForm);
		}

		var dl = getLocalDate();
		var dm = getDateMessageLookupValue('', dl); // If no messages will be local date back unchanged

		//if (((deliveryType == 'TT' || deliveryType == 'TH') && !allowPUR) || !ignoreNoLateEntry || isWeekend) {
		if (((deliveryType == 'TT' || deliveryType == 'TH') && !allowPUR) || isWeekend) 
		{
			nlapiSetFieldValue('trandate', nlapiDateToString(getNextWorkingDate(dm), 'date'), false, false);
		}

		if ((deliveryType == 'TT' || deliveryType == 'TH') && !allowPUR) 
		{
			alert('As the time is after 11.30 the date for your Pick Up Request \(PUR\) will be set to the next working day' + nextdaymessage + '.\n\nThank you.');
		}
		else 
		{
			if (!ignoreNoLateEntry) 
			{
				//alert('As the time is after 15:00 the date for your consignment will be set to the next working day' + nextdaymessage + '.\n\nThank you.');
				alert("As the time is after 15:00 we cannot guarantee collection of this pallet consignment today, the date of your consignment may be set to the next working day.\n\nPlease be aware to allow vehicle routing all customers' freight must be notified by 15:00hrs.\n\nThank you.");
			}
			else 
			{
				if (isWeekend) 
				{
					alert('Note:' + nextdaymessage + '.\n\nThank you.');
				}
			}
		}		

		if (dl.getTime() != dm.getTime())
		{
			dl = getNextWorkingDate(dm);
		}
		nlapiSetFieldValue('trandate', nlapiDateToString(dl, 'date'), false, false);        

		nlapiSetFieldValue('custbody_ordertype', '1', false, false);
		if (orderType == 'quotation') 
		{
			nlapiSetFieldValue('custbody_ordertype', '2', false, false);
		} //if
		if (shipType == 'pallet') 
		{ // Same for quotations too
			nlapiSetFieldValue('custbody_palletparcel', '2', false, false);
			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item', 'item', defaultService); // Item internal id
			nlapiSetCurrentLineItemValue('item', 'custcol_totalweight_pallets', 0);
			nlapiSetCurrentLineItemValue('item', 'custcol_numberofpallets', 0);
			nlapiCommitLineItem('item');
			setSizeDefaults(1);
		}

		var addressFound = false;
		if (deliveryType == 'HT' || deliveryType == 'TH') 
		{
			if (!addressFound) 
			{
				var addr = nlapiGetFieldValue('shipaddress');

				var addrLines = new Array();
				addrLines = addr.split("\n");

				var addrpostcode = nlapiGetFieldValue('shipzip');

				// Fields for label population only
				var addr1 = addrLines[0];
				var addr2 = addrLines[1];
				var addr3 = '';
				var addr4 = '';

				//if (isTestUser()) {
				//    addr1 = nlapiGetFieldValue('shipaddress1');
				//    addr2 = nlapiGetFieldValue('shipaddress2');
				//    addr3 = nlapiGetFieldValue('shipaddress3');
				//}

				if (addrLines.length > 2 && addr3 == '') 
				{
					addr3 = addrLines[2];
				}
				if (addrLines.length > 3 && addr4 == '') 
				{
					addr4 = addrLines[3];
				}

				var city = nlapiGetFieldValue('shipcity');
				var county = nlapiGetFieldValue('shipstate');
				var addrtelno = nlapiGetFieldValue('shipphone');
				var depotno = getPalletPostCodeLookupValue(addrpostcode, 'depot');
				//Change March 2012 - all HT are from hub depot even if out of area ...

				var collectDepot = paramRecord.getFieldValue('custrecord_palletdepot_id');
				//if (parseInt(depotno) != parseInt(collectDepot) && collectDepot != null && collectDepot != '') depotno = collectDepot;
				depotno = collectDepot;
				//if (isTestUser()) 
				//    alert('prefix = ' + addrpostcode + '\ndepot = ' + depotno);

			}

			if (deliveryType == 'HT') 
			{
				//Change March 2012 - all HT are from hub depot even if out of area ...
				paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
				var collectDepot = paramRecord.getFieldValue('custrecord_palletdepot_id');
				if (parseInt(depotno) != parseInt(collectDepot) && collectDepot != null && collectDepot != '') 
				{
					depotno = collectDepot;
				}

				nlapiSetFieldValue('custbody_pickupaddress', addr, false, false);
				nlapiSetFieldValue('custbody_pickupaddresspostcode', addrpostcode, false, false);
				nlapiSetFieldValue('custbody_palletcollectingdepot', depotno, false, false);
				nlapiSetFieldValue('custbody_sendingdepot', depotno, false, false);

				//	    nlapiSetFieldValue('custbody_pickupcontact', addrcontact, false, false); //v2.8.7
				nlapiSetFieldValue('custbody_pickuptelno', addrtelno, false, false);

				// populate label fields
				nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
				nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
				if (addr3 != '') 
				{
					nlapiSetFieldValue('custbody_pickupaddr3', addr3, false, false);
				}
				else 
				{
					nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
				}

				if (addr4 != '') 
				{
					nlapiSetFieldValue('custbody_pickupaddr4', addr4, false, false);
				}
				else 
				{
					nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
				}

				//	    var companyname = custRecord.getFieldValue('companyname'); //v2.8.7
				//	    nlapiSetFieldValue('custbody_pickupname', companyname, false, false); //v2.8.7

			} //if
			if (deliveryType == 'TH') 
			{

				nlapiSetFieldValue('custbody_deliveryaddress', addr, false, false);
				nlapiSetFieldValue('custbody_deliverypostcode', addrpostcode, true, false);
				nlapiSetFieldValue('custbody_receivingdepot', depotno, false, false);
				//nlapiSetFieldValue('custbody_deliverycontact', addrcontact, false, false);

				nlapiSetFieldValue('custbody_deliverytelno', addrtelno, false, false);

				//nlapiSetFieldValue('custbody_delname', currentCustomerName, false, false);
				nlapiSetFieldValue('custbody_delname', nlapiGetFieldValue('shipaddressee'), false, false);

				//if (isTestUser()) alert ('onLoad Address1 = ' + addr1);
				// populate label fields
				nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
				nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);

				if (addr3 != '') 
				{
					nlapiSetFieldValue('custbody_deliveryaddr3', addr3, false, false);
				}
				else 
				{
					nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
				}

				if (addr4 != '') 
				{
					nlapiSetFieldValue('custbody_deliveryaddr4', addr4, false, false);
				}
				else 
				{
					nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
				}

			} //if
		} //if
		//if (type == 'edit')
		//	nlapiSetFieldValue('otherrefnum','',true,false);
	} //if
	return true;
}


/******************************************************************************
 * postSourcing
 * 
 * @param type
 * @param name
 * @returns {Boolean}
 ******************************************************************************/
//Post Sourcing Function
function postSourcing(type, name)
{

	if (name == 'entity') 
	{
		var customForm = nlapiGetFieldValue('customform');
		var formId = nlapiGetFieldValue('custbody_formid');
		var deliveryType = getFormDeliveryType(formId);
		if (deliveryType == '') 
		{
			deliveryType = getFormDeliveryType(customForm);
		}

		var currentCustomer = nlapiGetFieldValue('entity');
		var custRecord = nlapiLoadRecord('customer', currentCustomer);

		if (deliveryType == 'HT' || deliveryType == 'TH') 
		{

			var addressCount = custRecord.getLineItemCount('addressbook');
			var i = 1;
			var addressFound = false;

			while (i <= addressCount && addressFound == false) 
			{
				var defShipping = custRecord.getLineItemValue('addressbook', 'defaultshipping', i);

				if (defShipping == 'T') 
				{
					var addr = custRecord.getLineItemValue('addressbook', 'addrtext', i);
					var addrpostcode = custRecord.getLineItemValue('addressbook', 'zip', i);
					//if (isTestUser()) alert ('Address = ' + addr);

					// Fields for label population only
					var addr1 = custRecord.getLineItemValue('addressbook', 'addr1', i);
					var addr2 = custRecord.getLineItemValue('addressbook', 'addr2', i);
					var addr3 = custRecord.getLineItemValue('addressbook', 'addr3', i);
					var addr4 = custRecord.getLineItemValue('addressbook', 'addr4', i);
					var city = custRecord.getLineItemValue('addressbook', 'city', i);
					var county = custRecord.getLineItemValue('addressbook', 'state', i);
					var country = 1; //UK - NEP customers only
					addressFound = true;

				} //if
				i++;

			} //while
			if (addressFound == true) 
			{
				var addrtelno = custRecord.getFieldValue('phone');
				var addrcontact = custRecord.getFieldValue('custentity_contact');
				var companyname = custRecord.getFieldValue('companyname');

				//if (customForm == '103' || customForm == '104' || formId == '103' || formId == '104') {

				if (deliveryType == 'HT') 
				{
					nlapiSetFieldValue('custbody_pickupaddress', addr, false, false);
					nlapiSetFieldValue('custbody_pickupaddresspostcode', addrpostcode, true, false);
					nlapiSetFieldValue('custbody_pickupcontact', addrcontact, false, false);
					nlapiSetFieldValue('custbody_pickuptelno', addrtelno, false, false);

					// populate label fields
					nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
					nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
					if (addr3 != '' && addr3 != null) 
					{
						nlapiSetFieldValue('custbody_pickupaddr3', addr3, false, false);
					}
					else 
					{
						nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
					}
					if (addr4 != '' && addr4 != null) 
					{
						nlapiSetFieldValue('custbody_pickupaddr4', addr4, false, false);
					}
					else 
					{
						nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
					}

					nlapiSetFieldValue('custbody_pickupcountryselect', country, false, false);
					nlapiSetFieldValue('custbody_pickupname', companyname, false, false);
				} //if

				if (deliveryType == 'TH') 
				{
					nlapiSetFieldValue('custbody_deliveryaddress', addr, false, false);
					nlapiSetFieldValue('custbody_deliverypostcode', addrpostcode, true, false);
					nlapiSetFieldValue('custbody_deliverycontact', addrcontact, false, false);
					nlapiSetFieldValue('custbody_deliverytelno', addrtelno, false, false);

					// populate label fields
					nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
					nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);
					if (addr3 != '' && addr3 != null) 
					{
						nlapiSetFieldValue('custbody_deliveryaddr3', addr3, false, false);
					}
					else 
					{
						nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
					}
					if (addr4 != '' && addr4 != null) 
					{
						nlapiSetFieldValue('custbody_deliveryaddr4', addr4, false, false);
					}
					else 
					{
						nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
					}

					nlapiSetFieldValue('custbody_deliverycountryselect', country, false, false);
					nlapiSetFieldValue('custbody_delname', companyname, false, false);
				} //if
			} //if
		} //if		

		var defaultService = 91; //ND
		var custDefaultService =  custRecord.getFieldValue('custentity_default_pallet_service');
		if (custDefaultService != null && custDefaultService != '')
		{
			defaultService = custDefaultService;
		}

		//nlapiSelectNewLineItem('item');
		nlapiSetCurrentLineItemValue('item', 'item', defaultService); // Item internal id
	} //else if	
	//if (isTestUser()) alert ('postSourcing end: Ship Address :\n1' + nlapiGetFieldValue('custbody_deliveryaddr1') + '\n2 = ' + nlapiGetFieldValue('custbody_deliveryaddr2') + '\n3 = ' + nlapiGetFieldValue('custbody_deliveryaddr3') + '\n4 = ' + nlapiGetFieldValue('custbody_deliveryaddr4'));

	return true;

} //function postSourcing



/******************************************************************************************
 * fieldChanged
 * 
 * @param type
 * @param name
 * @returns {Boolean}
 ******************************************************************************************/
//Field change action
function fieldChanged(type, name)
{
	//alert(type + '\n' + name);
	var isValid = true;
	var reCalcRates = false;
	var canLookupPostCodes = nlapiGetFieldValue('custbody_post_code_search');
	//canLookupPostCodes = nlapiLookupField('customer', user, 'custentity_post_code_search');

	//if (name == 'custcol_palletserviceday') {
	//	alert(getDTservices(false, true));
	//} //else if

	if (name == 'custbody_pickupaddressselect') 
	{
		changeAddress('pickup');
		reCalcRates = true;
	} //else if

	if (name == 'custbody_deliveryaddressselect') 
	{
		changeAddress('delivery');
		reCalcRates = true;
	} //else if

	if (name == 'custbody_deliverypostcode') 
	{
		isValid = validateCountryPostcode('delivery');
		//if (isTestUser()) alert('prefix = ' + nlapiGetFieldValue('custbody_postcodezone') + '\nclass = ' + getPalletPostCodeLookupValue(nlapiGetFieldValue('custbody_postcodezone'), 'class'));
	} //else if

	if (name == 'custbody_pickupaddresspostcode') 
	{
		isValid = validateCountryPostcode('pickup');
		//if (isTestUser()) alert('prefix = ' + nlapiGetFieldValue('custbody_postcodezone') + '\nclass = ' + getPalletPostCodeLookupValue(nlapiGetFieldValue('custbody_postcodezone'), 'class'));
	} //else if 

	if (name == 'custbody_delpostcodesearch' && canLookupPostCodes == 'T')
	{  
		var searchpc = nlapiGetFieldValue('custbody_delpostcodesearch');
		if (searchpc !='' && searchpc != null)
		{
			isValid = XMLSoapLookup(searchpc);
			reCalcRates = false;
		}

	} //else if    'custcol_truevolumeweight'

	if (name == 'custrecord_palletlistsizelookup') 
	{
		setSizeDefaults(nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup'));
	}

	if (name == 'custrecord_palletlistweight' || name == 'custrecord_palletlistheight' || name == 'custrecord_palletlistwidth' || name == 'custrecord_palletlistdepth') 
	{
		checkMaximums(nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup'));
	}

	if (type = 'item' && (name == 'custcol_numberofpallets' || name == 'custcol_totalweight_pallets')) 
	{
		return false; //Do not edit these as summary fields totalled by scripting of pallet list
	}


	//TODO: check for canBeBatchNumbered
	if(name == 'custcol_batchnumberqty')
	{
		
		itemId = nlapiGetCurrentLineItemValue('item', 'item');
		currentQuantity = nlapiGetCurrentLineItemValue('item', 'quantity');
		batchQuantity = nlapiGetCurrentLineItemValue('item', 'custcol_batchnumberqty');
		canBeBatchNumbered = nlapiGetCurrentLineItemValue('item', 'custcol_canbebatchnumbered');

		alert('Batch number quantity\ncurrentQuantity: ' + currentQuantity + '\nbatchQuantity: ' + batchQuantity +  '\ncanBeBatchNumbered: ' + canBeBatchNumbered );
		
		if(canBeBatchNumbered == '1')
		{
			alert('batch numbering available');
			if(batchQuantity == currentQuantity)
			{
				//alert('Batch Quantity: ' + batchQuantity);
				batchNumberEntrySuiteletURL = nlapiResolveURL('SUITELET', batchNumberEntrySuiteletID, batchNumberEntrySuiteletDeploymentID, false); //false means get the Internal link
				windowOpener = window.open(batchNumberEntrySuiteletURL + '&custscript_unitqty=' + currentQuantity + '&custscript_itemid=' + itemId, '_blank', "height=500, width=600, scrollbars=yes, dependent=yes");
			}
		}
		else
		{
			if(batchQuantity > 0)
			{
				alert('You cannot associate batch numbers for this line item as it cannot be batch numbered.');
				nlapiSetCurrentLineItemValue('item', 'custcol_batchnumberqty', 0, false, true);
				isValid = false;
			}
		}
	}



	return isValid;

} //function fieldChanged


/******************************************************************************************
 * changeAddress
 * 
 * @param type
 ******************************************************************************************/
function changeAddress(type)
{
	var customForm = nlapiGetFieldValue('customform');
	var formId = nlapiGetFieldValue('custbody_formid');
	var deliveryType = getFormDeliveryType(formId);
	if (deliveryType == '') 
	{
		deliveryType = getFormDeliveryType(customForm);
	}

	if (type == 'pickup') 
	{
		var addressSelect = nlapiGetFieldValue('custbody_pickupaddressselect');
	} //if
	else 
	{
		var addressSelect = nlapiGetFieldValue('custbody_deliveryaddressselect');
	} //else

	if (addressSelect) 
	{
		var addressRecord = nlapiLoadRecord('customrecord_deliveryaddress', addressSelect);
		var label = addressRecord.getFieldValue('custrecord_deladdressname');
		var addr1 = addressRecord.getFieldValue('custrecord_deladdress_addr1');
		var addr2 = addressRecord.getFieldValue('custrecord_deladdress_addr2');
		var city = addressRecord.getFieldValue('custrecord_deladdress_city');
		var county = addressRecord.getFieldValue('custrecord_deladdress_county');
		var country = addressRecord.getFieldValue('custrecord_countryaddress');
		var postcode = addressRecord.getFieldValue('custrecord_deladdress_postcode');
		var telephone = addressRecord.getFieldValue('custrecord_deladdresstelno');
		var contact = addressRecord.getFieldValue('custrecord_contactname');

		var addressText = label + '\n';
		if (addr1 != null) 
		{
			addressText += addr1 + '\n';
		}
		if (addr2 != null) 
		{
			addressText += addr2 + '\n';
		}
		if (city != null) 
		{
			addressText += city + '\n';
		}
		if (county != null) 
		{
			addressText += county + '\n';
		}
		addressText += postcode + '\n';

		if (type == 'pickup') 
		{
			nlapiSetFieldValue('custbody_pickupaddress', addressText, false, false);
			if (telephone != null) 
			{
				nlapiSetFieldValue('custbody_pickuptelno', telephone, true, false);
			}

			if (contact != null) 
			{
				nlapiSetFieldValue('custbody_pickupcontact', contact, false, false);
			}

			// Set body fields for label printing purposes
			if (label != null) 
			{
				nlapiSetFieldValue('custbody_pickupname', label, false, false);
			}

			if (addr1 != null) 
			{
				nlapiSetFieldValue('custbody_pickupaddr1', addr1, false, false);
			}

			if (addr2 != null) 
			{
				nlapiSetFieldValue('custbody_pickupaddr2', addr2, false, false);
			}

			if (city != null) 
			{
				nlapiSetFieldValue('custbody_pickupaddr3', city, false, false);
			}

			if (county != null) 
			{
				nlapiSetFieldValue('custbody_pickupaddr4', county, false, false);
			}

			if (country != null) 
			{
				nlapiSetFieldValue('custbody_pickupcountryselect', country, false, false);
			}

			if (telephone != null) 
			{
				nlapiSetFieldValue('custbody_pickuptelno', telephone, false, false);
			}

			if (contact != null) 
			{
				nlapiSetFieldValue('custbody_pickupcontact', contact, false, false);
			}

			nlapiSetFieldValue('custbody_pickupaddresspostcode', postcode, true, false);

		}

		if (type == 'delivery' && deliveryType != 'TH') 
		{
			nlapiSetFieldValue('custbody_deliveryaddress', addressText, false, false);

			if (telephone != null) 
			{
				nlapiSetFieldValue('custbody_deliverytelno', telephone, true, false);
			}

			if (contact != null) 
			{
				nlapiSetFieldValue('custbody_deliverycontact', contact, false, false);
			}

			// Set body fields for label printing purposes
			if (label != null) 
			{
				nlapiSetFieldValue('custbody_delname', label, false, false);
			}

			if (addr1 != null) 
			{
				nlapiSetFieldValue('custbody_deliveryaddr1', addr1, false, false);
			}

			if (addr2 != null) 
			{
				nlapiSetFieldValue('custbody_deliveryaddr2', addr2, false, false);
			}
			if (city != null) 
			{
				nlapiSetFieldValue('custbody_deliveryaddr3', city, false, false);
			}
			if (county != null) 
			{
				nlapiSetFieldValue('custbody_deliveryaddr4', county, false, false);
			}
			if (country != null) 
			{
				nlapiSetFieldValue('custbody_deliverycountryselect', country, false, false);
			}

			nlapiSetFieldValue('custbody_deliverypostcode', postcode, true, false);


			/**********************************************
			 * Check for duplicate orders
			 **********************************************/
			// get current customer
			var currentCustomer = nlapiGetFieldValue('entity');

			// construct search

			var dupSearchFilters = new Array();
			var dupSearchColumns = new Array();

			dupSearchFilters[0] = new nlobjSearchFilter('entity', null, 'is', currentCustomer);
			dupSearchFilters[1] = new nlobjSearchFilter('trandate', null, 'within', 'today');
			dupSearchFilters[2] = new nlobjSearchFilter('shipzip', null, 'is', postcode);
			dupSearchFilters[3] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			dupSearchFilters[4] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', '1');

			dupSearchColumns[0] = new nlobjSearchColumn('tranid');
			dupSearchColumns[1] = new nlobjSearchColumn('custbody_delname');
			dupSearchColumns[2] = new nlobjSearchColumn('custbody_deliverypostcode');
			dupSearchColumns[3] = new nlobjSearchColumn('custbody_labelservice');
			dupSearchColumns[4] = new nlobjSearchColumn('custbody_labelparcels');

			// perform search

			var dupSearchResults = nlapiSearchRecord('salesorder', null, dupSearchFilters, dupSearchColumns);
			var dupalerttext = '';

			// if search returns results then show warning
			if (dupSearchResults) 
			{

				dupalerttext += 'Warning: One or more pallet consignments has already been entered for this delivery postcode:\n\n';

				for (var duploop = 0; duploop < dupSearchResults.length; duploop++) 
				{
					dupalerttext += 'Consignment ' + dupSearchResults[duploop].getValue(dupSearchColumns[0]) + ': ';
					dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[1]);
					dupalerttext += ', ';
					dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[2]);
					dupalerttext += ', ';
					dupalerttext += dupSearchResults[duploop].getValue(dupSearchColumns[3]);
					dupalerttext += '\n';

				} //for
				alert(dupalerttext);

			} //if
		}
	} //if
	else 
	{
		if (type == 'pickup') 
		{
			nlapiSetFieldValue('custbody_pickupaddress', '', false, false);
			nlapiSetFieldValue('custbody_pickupaddresspostcode', '', false, false);
			nlapiSetFieldValue('custbody_pickuptelno', '', true, false);
			nlapiSetFieldValue('custbody_pickupaddr1', '', true, false);
			nlapiSetFieldValue('custbody_pickupaddr2', '', true, false);
			nlapiSetFieldValue('custbody_pickupaddr3', '', true, false);
			nlapiSetFieldValue('custbody_pickupaddr4', '', true, false);

		}
		if (type == 'delivery' && deliveryType != 'TH') 
		{
			nlapiSetFieldValue('custbody_deliveryaddress', '', false, false);
			nlapiSetFieldValue('custbody_deliverypostcode', '', false, false);
			nlapiSetFieldValue('custbody_deliverytelno', '', true, false);
			nlapiSetFieldValue('custbody_deliveryaddr1', '', true, false);
			nlapiSetFieldValue('custbody_deliveryaddr2', '', true, false);
			nlapiSetFieldValue('custbody_deliveryaddr3', '', true, false);
			nlapiSetFieldValue('custbody_deliveryaddr4', '', true, false);

		}

	} //else
	//}
	//if (isTestUser()) alert ('changeAddress end: Ship Address :\n1' + nlapiGetFieldValue('custbody_deliveryaddr1') + '\n2 = ' + nlapiGetFieldValue('custbody_deliveryaddr2') + '\n3 = ' + nlapiGetFieldValue('custbody_deliveryaddr3') + '\n4 = ' + nlapiGetFieldValue('custbody_deliveryaddr4'));
} //function changePickupAddress


/****************************************
 * validateItem
 * 
 * @returns {Boolean}
 */
function validateItem()
{
	paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record

	// Retrieve the current item selected and load the record	
	if (parseInt(nlapiGetCurrentLineItemIndex('item')) > 1) // 2nd item ...
	{
		alert('Only one delivery service item allowed per consignment / quotation.');
		nlapiCancelLineItem('item');
		nlapiSelectLineItem('item', 1);
	}

	var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
	var itemRecord = nlapiLoadRecord('serviceitem', currentItem);

	// Retrieve current postcode zone (prefix)
	var postcodeZone = nlapiGetFieldValue('custbody_postcodezone');

	// Check to see if service item is using Parcel or Pallet rates
	var itemType = itemRecord.getFieldValue('custitem_servicetype');

	// if parcel service then return error and terminate
	if (itemType == '1') 
	{
		alert('Error: The service selected is a parcel service.  Please select a Pallet service.');
		return false;
	} //if
	// Construct a search to check the exception table for matches on postcode and service

	var excSearchFilters = new Array();
	var excSearchColumns = new Array();

	excSearchFilters[0] = new nlobjSearchFilter('custrecord_exceptionpostcode', null, 'is', postcodeZone);
	excSearchFilters[1] = new nlobjSearchFilter('custrecord_exceptionservice', null, 'is', currentItem);

	excSearchColumns[0] = new nlobjSearchColumn('custrecord_exceptionpostcode');
	excSearchColumns[1] = new nlobjSearchColumn('custrecord_exceptionservice');

	// perform search
	var excSearchResults = nlapiSearchRecord('customrecord_pallet_exceptions', null, excSearchFilters, excSearchColumns);

	// if search returns a result then error
	if (excSearchResults != null) 
	{
		//alert('Error: This service is not available to this postcode area.  Please select another service.');
		alert('Please Note: This service is not available to this postcode area.  Please select another service from the following:\n' + getPalletServicesforZone(postcodeZone, true));		
		return false;
	} //if

} //function validateItem



/******************************************************************************************
 * setSizeDefaults
 * 
 * @param theLineNo
 ******************************************************************************************/
function setSizeDefaults(theLineNo)
{
	if (theLineNo != '' && theLineNo != null)
	{
		var palletSize = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup');

		if (palletSize != null && palletSize != '') 
		{
			var sizeRecord = nlapiLoadRecord('customrecord_palletsize', palletSize);

			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistdepth', sizeRecord.getFieldValue('custrecord_maxlength'), false, false);
			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistwidth', sizeRecord.getFieldValue('custrecord_maxwidth'), false, false);
			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistheight', sizeRecord.getFieldValue('custrecord_maxheight'), false, false);

		} //if
		else 
		{
			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistdepth', null, false, false);
			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistwidth', null, false, false);
			nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistheight', null, false, false);
		} //else
	}
} //function setSizeDefaults


/******************************************************************************************
 * checkMaximums
 * 
 * @param theLineNo
 * @returns {Boolean}
 ******************************************************************************************/
function checkMaximums(theLineNo)
{
	if (theLineNo != '' && theLineNo != null) 
	{
		var size = nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup');
		if (size != null) 
		{
			var errorString = '';
			var qtrpallets = nlapiGetFieldValue('custbody_quarterpalletsallowed');
			var qtrPalletID = getPalletSizeID('quarterpallet');
			//alert ("qtrpallets/qtrPalletID: " + qtrpallets + " / " + qtrPalletID);
			if (size == qtrPalletID && qtrpallets == 'F') 
			{
				errorString = 'Quarter pallets are currently not available for your account.\nPlease conact NEP if you wish to discuss using this pallet size option.\nThank you.';
			}
			else 
			{
				var sizeRecord = nlapiLoadRecord('customrecord_palletsize', size);

				var maxLength = sizeRecord.getFieldValue('custrecord_maxlength');
				var maxWidth = sizeRecord.getFieldValue('custrecord_maxwidth');
				var maxHeight = sizeRecord.getFieldValue('custrecord_maxheight');
				var maxWeight = sizeRecord.getFieldValue('custrecord_maxweight');
				var inputField = sizeRecord.getFieldValue('custrecord_palletinputfield');

				var userLength = parseInt(nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistdepth'));
				var userWidth = parseInt(nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistwidth'));
				var userHeight = parseInt(nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistheight'));

				var userWeights = parseInt(nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight'));
				var quantity = parseInt(nlapiGetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity'));

				var userWeight = (userWeights / quantity);


				if (userWeight > maxWeight) 
				{
					nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistweight', maxWeight, null, null);
					errorString += ('The average weight of the ' + sizeRecord.getFieldValue('name') + ' pallet(s) exceeds the maximum pallet weight for this pallet size (' + maxWeight + ' kg per pallet)\n');
				}
				if (userLength > maxLength) 
				{
					nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistdepth', maxLength, null, null);
					errorString += ('The length of the pallet(s) exceeds the maximum pallet length for this pallet size (' + maxLength + ' cm)\n');
				}
				if (userWidth > maxWidth) 
				{
					nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistwidth', maxWidth, null, null);
					errorString += ('The width of the pallet(s) exceeds the maximum pallet width for this pallet size (' + maxWidth + ' cm)\n');
				}
				if (userHeight > maxHeight) 
				{
					nlapiSetCurrentLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistheight', maxHeight, null, null);
					errorString += ('The height of the pallet(s) exceeds the maximum pallet height for this pallet size (' + maxHeight + ' cm)\n');
				}
			}

			if (errorString != '') 
			{
				alert('Alert: \n\n' + errorString + '\n\nPlease select another pallet size / quantity or contact NEP to process this order.\n\nPlease also refer to the NEP "Pallet Dimensions \+ Weight Guide" - simply click on the button in the top / bottom area of the form.');
				return false;

			} //if
			else 
			{
				return true;
			}

		} //if
	}
	else 
		return true;

} //function checkMaximums


/******************************************************************************************
 * checkPalletMaximums
 * 
 * @param size
 * @returns {Boolean}
 ******************************************************************************************/
function checkPalletMaximums(size)
{
	if (size != null) 
	{
		var sizeRecord = nlapiLoadRecord('customrecord_palletsize', size);

		var maxLength = sizeRecord.getFieldValue('custrecord_maxlength');
		var maxWidth = sizeRecord.getFieldValue('custrecord_maxwidth');
		var maxHeight = sizeRecord.getFieldValue('custrecord_maxheight');
		var maxWeight = sizeRecord.getFieldValue('custrecord_maxweight');
		var inputField = sizeRecord.getFieldValue('custrecord_palletinputfield');

		var userWeights = parseInt(nlapiGetFieldValue('custpage_' + inputField + 'weight'));
		var quantity = parseInt(nlapiGetFieldValue('custpage_' + inputField + 'qty'));

		var userWeight = (userWeights / quantity);

		var errorString = '';

		if (userWeight > maxWeight) 
		{
			errorString += ('The average weight of the ' + sizeRecord.getFieldValue('name') + ' pallet(s) exceeds the maximum pallet weight for this pallet size (' + maxWeight + ' kg per pallet)\n');
		}

		if (errorString != '') 
		{
			alert('Alert: \n\n' + errorString + '\nPlease select another pallet size / quantity or contact NEP to process this order.\nPlease also refer to the NEP "Pallet Dimensions \+ Weight Guide" - simply click on the button.');
			return false;

		} //if
		else 
		{
			return true;
		}

	} //if
} //function checkMaximums




/******************************************************************************************
 * validateLine
 * Called after a User clicks Add on a line item
 * 
 * @param type
 * @returns {Boolean}
 ******************************************************************************************/
function validateLine(type)
{
	paramRecord = nlapiLoadRecord('customrecord_parameters', 1); //Get the params record
	batchNumberingEnabled = paramRecord.getFieldValue('custrecord_param_batchnumberedinventory');
	batchNumberHereToThereFormID = paramRecord.getFieldValue('custrecord_param_bnform_ht');
	currentFormID = nlapiGetFieldValue('customform');

	//alert(type);
	if (showVer == true) 
	{
		alert(versionNo);
	}

	//Check pallet list first and set totals for service
	if (type == 'recmachcustrecord_palletlistconsignmentlookup') 
	{
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
				//alert('totalWeight = ' + totalWeight + '\ntotalPallets = ' + totalPallets);
				nlapiSetCurrentLineItemValue('item', 'custcol_numberofpallets', totalPallets);
				nlapiSetCurrentLineItemValue('item', 'custcol_totalweight_pallets', totalWeight);
			}
		}

		return true;
	}

	currentLineNumber = parseInt(nlapiGetCurrentLineItemIndex('item'));
	canBeBatchNumbered = nlapiGetCurrentLineItemValue('item', 'custcol_canbebatchnumbered');
	if (currentLineNumber == 1) // 2nd item ...
	{
		if(canBeBatchNumbered == '1')
		{
			alert('This Item cannot be the first item on the list.\nYou must choose a Service, not a Batch Numbered Inventory Item.');
			return false;
		}
	}
	else
		{
		//TODO: put the batch numbering form check in here


		currentFormID = currentFormID.toString();

		switch(currentFormID)
		{
		case batchNumberHereToThereFormID.toString():
		case batchNumberThereToHereFormID.toString():
		case batchNumberThereToThereFormID.toString():

			if(batchNumberingEnabled == 'T')
			{
//				alert('This is ok\n\nAttempting to launch the suitelet in a popup now...');
//
//				//TODO: //get quantity
//
//				//TODO: //get bn quantity
//
//				batchQuantity = parseInt(nlapiGetCurrentLineItemValue('item', 'custcol_batchnumberqty'));
//			
//				currentQuantity = parseInt(nlapiGetCurrentLineItemValue('item', 'quantity'));
//
//				alert('batchQuantity: ' + batchQuantity + '\ncurrentQuantity: ' + currentQuantity);
//				if(batchQuantity != currentQuantity)
//				{
//					alert('The Batch Number quantity does not match the Item Quantity.\nThere must be a one to one relationship between Pallets and Batch Numbers.');
//					return false;
//				}
//			

				
				
			}
			else
			{
				alert('Batch Numbered Inventory is not enabled on your account.\n\nYou are not allowed to add any more line items to this sublist.');
				return false;
			}
		break;

		default:
			alert('Only one delivery service item allowed per consignment / quotation.');
		nlapiCancelLineItem('item');
		nlapiSelectLineItem('item', 1);
		return false;
		break;
		}



	}

	var PCsearchField = nlapiGetFieldValue('custbody_deliveryaddressselect');

	if (PCsearchField == '' || PCsearchField == null)
	{
		return false;    
	}

	// Retrieve the current item selected	
	var currentItem = nlapiGetCurrentLineItemValue('item', 'item');
	var currentItemText = nlapiGetCurrentLineItemText('item', 'item');
	var currentItemArray = currentItemText.split(' ');
	//alert(currentItemText);
	var theDate = new Date();
	var DNR = nlapiGetCurrentLineItemValue('item', 'custcol_donotreprice');

	if (DNR == 'T') 
	{ // Ignore pricing do it manually - added June 2012
		var amount = nlapiGetCurrentLineItemValue('item', 'amount');
		var formid = nlapiGetFieldValue('custbody_formid');
		if (formid == null || formid == '')
		{
			formid = nlapiGetFieldValue('customform');
		}
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

	/****************************************
	 * New search for item parameter record
	 **/      
	//if (isTestUser()) {
	var ipSearchFilters = new Array();
	var ipSearchColumns = new Array();

	// Check for Saturday services
	//ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_servicelookup', null, 'is', currentItem);
	ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_saturdayservice', null, 'is', 'T');        
	ipSearchColumns[0] = new nlobjSearchColumn('custrecord_palletparam_servicelookup');
	// perform search
	var ipSearchResults = nlapiSearchRecord('customrecord_itemparameterspallet', null, ipSearchFilters, ipSearchColumns);       
	if (ipSearchResults) 
	{
		for (var ss = 0; ss < ipSearchResults.length; ss++) 
		{
			if (currentItem == ipSearchResults[ss].getValue(ipSearchColumns[0]) && theDate.getDay() != 5) 
			{ //Saturday Service but not a Friday ...
				alert('Please Note: Saturday Service selected but today is not Friday.\nPlease select another service.');
				return false;
			}
		}
	} //if

	// Check for Date / Time services
	ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_servicelookup', null, 'is', currentItem);
	//ipSearchFilters[0] = new nlobjSearchFilter('custrecord_palletparam_saturdayservice', null, 'is', 'T');       
	ipSearchColumns[0] = new nlobjSearchColumn('custrecord_palletparam_servicelookup');
	ipSearchColumns[1] = new nlobjSearchColumn('custrecord_palletparam_dedicatedday');
	ipSearchColumns[2] = new nlobjSearchColumn('custrecord_palletparam_dedicatedtime');
	// perform search
	var ipSearchResults = nlapiSearchRecord('customrecord_itemparameterspallet', null, ipSearchFilters, ipSearchColumns);

	var ddrequired = false;
	var dtrequired = false;
	if (ipSearchResults) 
	{
		if ('T' == ipSearchResults[0].getValue(ipSearchColumns[1])) 
		{
			ddrequired = true;
		}
		if ('T' == ipSearchResults[0].getValue(ipSearchColumns[2])) 
		{
			dtrequired = true;
		}
	} //if
	var ddvalue = nlapiGetCurrentLineItemValue('item', 'custcol_palletserviceday');
	if (ddvalue == null) 
	{
		ddvalue = '';
	}
	var dtvalue = nlapiGetCurrentLineItemValue('item', 'custcol_palletservicetime'); 
	if (dtvalue == null) 
	{
		dtvalue = '';
	}

	var isDtDdErr = false;
	var isDtDdErrMsg = 'Dedicated day / time entry error for selected service:\n' + currentItemText + '\n\n';
	if (ddrequired)
	{
		if (ddvalue == '') 
		{
			isDtDdErr = true;
			isDtDdErrMsg += '\nPlease provide a day (date) for this service.';
		} 
		else 
		{ //ddvalue != ''
			//alert(ddvalue + " == " + nlapiDateToString(getNextWorkingDate()) + " ?");
			if(currentItemArray[0].substring(0,2) == 'DD' && nlapiDateToString(getNextWorkingDate()) == ddvalue)
			{					
				isDtDdErr = true;
				isDtDdErrMsg += '\nThis service is not for next working day, please use a next day or time service.';
			}
		}
	}       
	if (!ddrequired && ddvalue != '')
	{
		isDtDdErr = true;
		isDtDdErrMsg += '\nNo specified date (day) required for this service.';
		nlapiSetCurrentLineItemValue('item', 'custcol_palletserviceday', ''); 
	}       
	if (dtrequired)
	{
		if (dtvalue == '') 
		{
			isDtDdErr = true;
			isDtDdErrMsg += '\nPlease provide a time (HH:MM) for this service.';
		} 
		else 
		{ //dtvalue != ''
			var HH = parseInt(dtvalue.substring(0,2));
			//alert(HH);
			if(HH < 9 || HH > 14)
			{
				isDtDdErr = true;
				isDtDdErrMsg += '\nPlease provide a time between 0900 and 1400 for this service.';
				if(HH > 14 && HH <= 18)
				{
					isDtDdErrMsg += '\nPlease contact NEP directly regarding possible collections after 1400.';
				}
			}
		}
	}       
	if (!dtrequired && dtvalue != '')
	{
		isDtDdErr = true;
		isDtDdErrMsg += '\nNo specified time required for this service';
		nlapiSetCurrentLineItemValue('item', 'custcol_palletservicetime', ''); 
	} 
	if (isDtDdErr) 
	{ 
		alert(isDtDdErrMsg);
		return false;
	}		      
	//}

	//Loading the item record fails in Customer Center so using above ...
	//var currentItemRecord = nlapiLoadRecord('serviceitem', currentItem);

	// Retrieve the current pallet size
	var palletSize = nlapiGetCurrentLineItemValue('item', 'custcol_palletsize');
	var palletQty = nlapiGetCurrentLineItemValue('item', 'custcol_numberofpallets');
	var palletWeight = nlapiGetCurrentLineItemValue('item', 'custcol_totalweight_pallets');
	//alert('palletQty = ' + palletQty + '\npalletWeight = ' + palletWeight);

	//if (palletSize == null || palletSize == '')
	if (palletQty == null || palletQty == '') 
	{
		alert('Please Note: Input at least one valid pallet size / quantity combination.\nPlease also ensure you click \'Add\' under the Pallet Size / Type.');
		return false;
	}

	if (palletWeight == null || palletWeight == '' || palletWeight <= 0) 
	{
		alert('Please Note: Select at least one pallet size / weight combination.\nPlease also ensure you click \'Add\' under the Pallet Size / Type.');
		return false;
	}
	else 
	{
		//if (!checkMaximums(palletSize)) return false;
	}

	// Retrieve current pallet area
	var palletZone = nlapiGetFieldValue('custbody_pallet_zone');
	// Retrieve current postcode zone (prefix)
	var postcodeZone = nlapiGetFieldValue('custbody_postcodezone');

	//alert('palletZone: ' + palletZone + '\npostcodeZone: ' + postcodeZone);

	if (palletZone == null || palletZone == '' || postcodeZone == null || postcodeZone == '') 
	{
		alert('Please Note: The selected address has no pricing / zone details. Please contact NEP directly.\nThank you.');
		return false;
	}

	// Retrieve current customer
	var currentCustomer = nlapiGetFieldValue('entity');
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
		if (precedence == 0) 
		{
			precedence = 11;
		}
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
            if (isTestUser()) 
                alert('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
        }
		 */
	}//if
	else 
	{
		// ORDER OF PRECEDENCE #2
		// construct search for customer-zone specific pricing

		// Before proceeding with custome-zone lookup perform a check for a zone-override

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
			precedence = 2;
			//postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
			prevPalletZone = palletZone;
			palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
		} //if		
		else 
		{
			// if no zone-override found then re-perform search based on alpha prefix only
			var alphaPrefix = returnPostcodePrefixAlpha(postcodeZone);
			pzoSearchFilters[1] = new nlobjSearchFilter('custrecord_pzo_postcode', null, 'is', alphaPrefix);
			//var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride',null,pzoSearchFilters, pzoSearchColumns);
			var pzoSearchResults = nlapiSearchRecord('customrecord_palletzoneoverride', 'customsearch_palletzoneoverride', pzoSearchFilters, pzoSearchColumns);

			if (pzoSearchResults) 
			{
				//postcodeZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);
				if (precedence == 0) 
				{
					precedence = 22;
				}
				prevPalletZone = palletZone;
				palletZone = pzoSearchResults[0].getValue(pzoSearchColumns[0]);                
			} //if		
		} //else

		//if (isTestUser()) alert ('PalletZone=' + palletZone + '\nPrevPalletZone=' + prevPalletZone);

		if (palletZone == '' || palletZone == null) 
		{
			palletZone = prevPalletZone; //Restore the zone as none present
		}

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
			// Extract pricing from first record found
			precedence = 2;
			//if (isTestUser()) 
			//    alert('Precedence = ' + precedence + '\nPC Zone=' + postcodeZone + '\nPrefix=' + alphaPrefix + '\nPalletZone=' + palletZone + '\nPrevPalletZone=' + prevPalletZone);

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
                if (isTestUser()) 
                    alert('qtrpalletrate = halfpalletrate = ' + qtrpalletrate);
            }
			 */
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
				precedence = 3;
				//if (isTestUser()) alert ('Precedence = ' + precedence + '\nPC Zone=' + postcodeZone + '\nPrefix=' + alphaPrefix + '\nPalletZone=' + palletZone + '\nPrevPalletZone=' + prevPalletZone);

				var fullpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[0]);
				var halfpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[1]);
				var qtrpalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[2]);
				var micropalletrate = pDefaultSearchResults[0].getValue(pDefaultSearchColumns[3]);
			}
			else 
			{
				// No pricing records found so return an error.
				alert('Please Note:\nThis pallet(s) / service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available. Please choose from one of the following services instead:\n\n' + getPalletServicesforZone(palletZone, true));
				return false;

			} //else	
		} //else
	} //else
	// calculate rate based on pallet size(s) selected
	var rate = 0.0;

	var palletIndex = nlapiGetCurrentLineItemIndex('recmachcustrecord_palletlistconsignmentlookup');
	var palletCount = nlapiGetLineItemCount('recmachcustrecord_palletlistconsignmentlookup');
	var palletTotal = 0;
	//alert('palletCount = ' + palletCount + '\npalletIndex = ' + palletIndex);

	if (palletCount > 0 || palletIndex > 0) 
	{
		for (var lc = 1; lc <= palletCount; lc++) 
		{ // 1 or more pallet lines exist already
			//if (lc != palletIndex) {
			var pallets = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistquantity', lc);
			var palletSize = nlapiGetLineItemValue('recmachcustrecord_palletlistconsignmentlookup', 'custrecord_palletlistsizelookup', lc);
			var amount = 0.0;

			if (palletSize == getPalletSizeID('fullpallet')) 
			{
				amount = parseInt(pallets) * fullpalletrate;
			}
			if (palletSize == getPalletSizeID('halfpallet')) 
			{
				amount = parseInt(pallets) * halfpalletrate;
			}
			if (palletSize == getPalletSizeID('fullpalletovs')) 
			{
				amount = parseInt(pallets) * fullpalletrate * 1.75;
			}
			if (palletSize == getPalletSizeID('halfpalletovs')) 
			{
				amount = parseInt(pallets) * halfpalletrate * 1.75;
			}
			if (palletSize == getPalletSizeID('quarterpallet')) 
			{
				amount = parseInt(pallets) * qtrpalletrate;
			}
			if (palletSize == getPalletSizeID('micropallet')) 
			{
				amount = parseInt(pallets) * micropalletrate;
			}

			//alert(lc + ' : size = ' + palletSize + '\npallets = ' + pallets + '\namount = ' + amount);
			palletTotal += parseInt(pallets);
			rate += amount;
			//}
		}
	}


	if (rate > 0) 
	{
		//Added July 2012 - surcharges related to Olympics ...
		var deliveryType = getFormDeliveryType(nlapiGetFieldValue('customform'));
		var surchargePostCode = nlapiGetFieldValue('custbody_deliverypostcode');
		if (deliveryType == 'TT' || deliveryType == 'TH') 
		{
			surchargePostCode = nlapiGetFieldValue('custbody_pickupaddresspostcode');
		}

		//var newSurcharge = parseFloat(getPostcodeSurcharge(surchargePostCode, true, palletTotal));
		var newSurcharge = 0.00;
		if (newSurcharge > 0) 
		{
			nlapiSetFieldValue('custbody_surcharge_postcode', newSurcharge, false, false);
		}
		if (newSurcharge > 0) 
		{
			rate += newSurcharge;
		}

		//if (isTestUser()) 
		//    alert('CurrentItem = ' + currentItemText + "\nZone = " + palletZone + "\nNewSurcharge ="  + newSurcharge + "\nRate = " + rate);
		nlapiSetCurrentLineItemValue('item', 'rate', rate, false, false);
		nlapiSetCurrentLineItemValue('item', 'amount', rate, false, false);
		return true;

	} //if
	else 
	{
		alert('Please Note:\nThis pallet(s) / service / destination combination (' + currentItemText + ' / ' + postcodeZone + ') is not available. Please choose from one of the following services instead:\n\n' + getPalletServicesforZone(palletZone, true));
		return false;
	}


} //function
//This function returns the prefix consisting of the alpha digits only from an existing prefix


/***********************
 * 
 */
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



/******************************************************************************************************
 * 
 ******************************************************************************************************/
function saveNew()
{
	nlapiSetFieldValue('custbody_saveandnew', 'T');
	document.getElementById('submitter').click();
	//alert('Add another after saving?');
}


/******************************************************************************************************
 * 
 * @returns {Boolean}
 ******************************************************************************************************/
function onSave()
{

	//retrieve column fields from item sublist line 1
	nlapiSelectLineItem('item', 1);
	var service = nlapiGetLineItemText('item', 'item', 1);
	var rate = nlapiGetLineItemValue('item', 'rate', 1);

	if (parseFloat(rate) == 0.01) // Not been set - use amount instead
	{
		rate = nlapiGetLineItemValue('item', 'amount', 1);
	}

	var pallets = nlapiGetLineItemValue('item', 'custcol_numberofpallets', 1);
	var totalweight = nlapiGetLineItemValue('item', 'custcol_totalweight_pallets', 1);
	//var palletsize = nlapiGetLineItemText('item', 'custcol_palletsize', 1);
	var palletinstructions = nlapiGetLineItemValue('item', 'custcol_itemspecialinstructions', 1);
	var dddate = nlapiGetLineItemValue('item', 'custcol_palletserviceday', 1);
	var tmtime = nlapiGetLineItemValue('item', 'custcol_palletservicetime', 1);
	var tmtimetext = nlapiGetLineItemValue('item', 'custcol_palletservicetime', 1) + '';

	//if (isTestUser()) 
	//    ("DD Date :" + dddate + "\nDD Time :" + tmtime + "\npalletinstructions :" + palletinstructions);

	// check if each has a value and if so write to custom body fields

	nlapiSetFieldValue('custbody_labelservice', service, false, false);
	nlapiSetFieldValue('custbody_labelparcels', pallets, false, false);
	nlapiSetFieldValue('custbody_labeltotalweight', totalweight, false, false);
	//nlapiSetFieldValue('custbody_labelpalletsize', palletsize, false, false);
	nlapiSetFieldValue('custbody_specialinstructions', palletinstructions, false, false);
	nlapiSetFieldValue('custbody_palletddservice_date', dddate, false, false);
	nlapiSetFieldValue('custbody_pallettmservice_time', tmtime, false, false);
	nlapiSetFieldValue('custbody_pallettmservice_text', tmtimetext, false, false);

	var useLocalOnly = nlapiGetFieldValue('custbody_localpalletclassonly');
	var palletSvcDepot = nlapiGetFieldValue('custbody_receivingdepot') * 1;
	var palletSvcSendDepot = nlapiGetFieldValue('custbody_palletcollectingdepot') * 1;

	if (palletSvcSendDepot == null || palletSvcSendDepot == '') 
	{
		palletSvcSendDepot = nlapiGetFieldValue('custbody_sendingdepot') * 1;
	}

	var palletSvcRequestDepot = nlapiGetFieldValue('custbody_palletrequestingdepot') * 1;
	var pcClass = getPalletPostCodeLookupValue(nlapiGetFieldValue('custbody_deliverypostcode'), 'class');

	var theClass = 1; //TPN - Default
	var palletDepot = getPalletDepotNo();
	//var palletDepot = 46;
	if (pcClass != null && pcClass != '') 
	{
		theClass = pcClass; // Will be SCOT if for that region
	}
	if ((palletSvcDepot == palletDepot && palletSvcSendDepot == palletDepot) || (useLocalOnly == 'T' && palletSvcDepot != palletDepot && palletSvcSendDepot == palletDepot)) 
	{
		theClass = 5; // Local - Pallet
	}
	else 
	{
		if (palletSvcSendDepot != palletDepot*1) 
		{
			theClass = 10; // PUR - palletSvc as NEP not sending
		}
	}

	nlapiSetFieldValue('class', theClass);

	nlapiSetFieldValue('custbody_currentlabelcount', 1, false, false);

	var custRef = nlapiGetFieldValue('otherrefnum');
	if (custRef != "" && custRef != null)
	{
		nlapiSetFieldValue('custbody_otherrefnum', custRef);
	}

	/*****************************************************
	 *  Calculate fuel surcharge
	 *  - To be moved into invoice.
	 ****************************************************/
	var fuelSurchargePercent = parseFloat(nlapiGetFieldValue('custbody_fuelsurchargeratepercent'));
	var fuelSurcharge;

	if (fuelSurchargePercent == 0 || isNaN(fuelSurchargePercent)) 
	{
		fuelSurcharge = 0.00;
	}
	else 
	{
		fuelSurcharge = (parseFloat(fuelSurchargePercent / 100) * parseFloat(rate)).toFixed(4);
	} //if
	nlapiSetFieldValue('custbody_fuelsurcharge', fuelSurcharge, false, false);

	var shipAddress = nlapiGetFieldValue('custbody_deliveryaddress');  
	nlapiSetFieldValue('shipaddresslist', '', false, false);
	nlapiSetFieldValue('shipaddress', shipAddress, false, false);

	//if (isTestUser()) 
	//    alert("Service :" + service + "\npallets :" + pallets + "\ntotalweight :" + totalweight + "\n" + nlapiGetFieldValue('custbody_postcodezone') + ' ==> Request=' + parcelRequestDepot + '\nSend=' + parcelSendDepot + '\nReceive=' + parcelDepot + '\nClass=' + theClass + '\nFuel percent = ' + fuelSurchargePercent + '\nRate = ' + rate + '\nFuel surcharge = ' + fuelSurcharge)    

	var d = new Date();
	nlapiSetFieldValue('custbody_lastpriced_dt', nlapiDateToString(d, 'date'));

	//alert ('theClass: ' + theClass + '\npcClass: ' + pcClass + '\npalletDepot: ' + palletDepot + '\npalletSvcDepot: ' + palletSvcDepot + '\npalletSvcSendDepot: ' + palletSvcSendDepot + '\npalletSvcRequestDepot: ' + palletSvcRequestDepot);

	return true;
}


/******************************************************************************************************
 * cancelconsignment
 * 
 ******************************************************************************************************/
function cancelconsignment()
{
	var currentstatus = nlapiGetFieldValue('custbody_consignmentstatus');
	var currentID = nlapiGetRecordId();

	if (currentstatus == '3') 
	{
		alert('This consignment has already been processed by NEP and cannot be cancelled.\nPlease contact NEP directly, thank you.');
	} //if
	else 
	{
		var userconfirm = confirm('Sure you wish to cancel this consignment?\nClick OK to confirm cancellation.');
		if (userconfirm == true) 
		{
			window.location = nlapiResolveURL('SUITELET', 'customscript_cancelconsignment', 'customdeploy_cancelconsignmentdeploy') + "&custparam_id=" + currentID;
		}
	} //else	
} //function


/******************************************************************************************************
 * labelPrinter
 * 
 * @returns {Boolean}
 ******************************************************************************************************/
function labelPrinter()
{
	var cid = nlapiGetRecordId();
	var currentstatus = nlapiGetFieldValue('custbody_consignmentstatus');

	if (currentstatus == '4') 
	{
		alert('Pleasse note : This consignment has been cancelled and cannot be printed.\nPlease contact NEP directly if you have any questions, thank you.');
	} //if
	else 
	{
		nlapiSetFieldValue('custbody_consignmentstatus', '2', false, false);
		//NLMultiButton_doAction('multibutton_submitter', 'submitter');

		var printlink = "https://system.netsuite.com/app/site/hosting/scriptlet.nl?script=19&deploy=1&custparam_cid=" + cid;

		window.open(printlink);

		return true;
	} //else
} //function labelPrinter



/******************************************************************************************************
 * getLocalDate
 * 
 * @returns {Date}
 ******************************************************************************************************/
function getLocalDate()
{
	var d = new Date();
	var hours = parseFloat(d.getHours() + (d.getTimezoneOffset() / 60));

	if ((d.getMonth() >= 3 && d.getMonth() < 10) || (d.getMonth() == 2 && d.getDate() > 27)) 
	{
		hours += 1; //Daylight savings approximation!
	}
	if (hours > 24) 
	{
		d = nlapiAddDays(d, 1); // Tomorrow already
	}
	return d;
}


/******************************************************************************************************
 * getNextWorkingDate
 * 
 * @param startdate
 * @returns {Date}
 ******************************************************************************************************/
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


/******************************************************************************************************
 * getDateMessageLookupValue
 * 
 * @param name
 * @param messageDate
 * @returns
 ******************************************************************************************************/
function getDateMessageLookupValue(name, messageDate)
{
	if (messageDate == null || messageDate == '') 
	{
		messageDate = getLocalDate();
	}

	var result = messageDate;

	var messageColumns = new Array;
	var messageFilters = new Array;

	messageFilters[0] = new nlobjSearchFilter('custrecord_message_servicetype', null, 'anyof', (2));
	//messageFilters[1] = new nlobjSearchFilter('custrecord_message_startdate', null, 'onorafter', nlapiDateToString(messageDate));
	//messageFilters[2] = new nlobjSearchFilter('custrecord_message_enddate', null, 'onorbefore', nlapiDateToString(messageDate));
	//if (name != '')
	//	messageFilters[3] = new nlobjSearchFilter('name', null, 'is', name);

	messageColumns[0] = new nlobjSearchColumn('name');
	messageColumns[1] = new nlobjSearchColumn('custrecord_message_startdate');
	messageColumns[2] = new nlobjSearchColumn('custrecord_message_enddate');
	messageColumns[3] = new nlobjSearchColumn('custrecord_message_text_description');
	messageColumns[4] = new nlobjSearchColumn('custrecord_message_showeverytime');
	messageColumns[5] = new nlobjSearchColumn('custrecord_message_servicetype');


	var messageResults = nlapiSearchRecord('customrecord_service_message_dates', null, messageFilters,messageColumns);
	if (messageResults) 
	{
		for ( var msg = 0; msg < messageResults.length; msg++) 
		{
			var startDate = nlapiStringToDate(messageResults[msg].getValue(messageColumns[1]));
			var endDate = nlapiStringToDate(messageResults[msg].getValue(messageColumns[2]));

			if (startDate.getTime() <= messageDate.getTime()  && endDate.getTime() >= messageDate.getTime()) 
			{

				var theContext =  nlapiGetContext();
				//var  showMessage = theContext.getSessionObject('showmessagetype2');
				var  showMessage = messageResults[msg].getValue(messageColumns[4]);
				if (showMessage != 'T' && !isCustomerService())
				{
					// get current customer
					var currentCustomer = nlapiGetFieldValue('entity');

					// construct search		            
					var checkconsSearchFilters = new Array();
					var checkconsSearchColumns = new Array();

					checkconsSearchFilters[0] = new nlobjSearchFilter('entity', null, 'is', currentCustomer);
					checkconsSearchFilters[1] = new nlobjSearchFilter('trandate', null, 'onorafter', messageResults[msg].getValue(messageColumns[1]));
					checkconsSearchFilters[2] = new nlobjSearchFilter('mainline', null, 'is', 'T');
					checkconsSearchFilters[3] = new nlobjSearchFilter('custbody_palletparcel', null, 'anyof', (2));

					checkconsSearchColumns[0] = new nlobjSearchColumn('tranid');
					checkconsSearchColumns[1] = new nlobjSearchColumn('custbody_delname');

					var checkconsSearchResults = nlapiSearchRecord('salesorder', null, checkconsSearchFilters, checkconsSearchColumns);		            
					// If search returns no results then show warning
					if (!checkconsSearchResults) 
					{
						//alert(currentCustomer);
						showMessage = 'T';
					}
				}

				if( showMessage == null || showMessage == "" || showMessage == 'T')
				{
					//if (messageResults[msg].getValue(messageColumns[4]) == 'T')
					//	theContext.setSessionObject('showmessagetype2', 'T');
					alert(messageResults[msg].getValue(messageColumns[0])
							+ "\n\n"
							+ messageResults[msg].getValue(messageColumns[3]));
				}

				//alert(startDate.getDate() + '==' + messageDate.getDate() + '\n' + startDate.getMonth() + '==' + messageDate.getMonth() + '\n' + startDate.getFullYear() + '==' + messageDate.getFullYear());
				if (!(startDate.getDate() == messageDate.getDate() && startDate.getMonth() == messageDate.getMonth() && startDate.getFullYear() == messageDate.getFullYear())) 
				{
					result = endDate; 
				}

				break;
			}
		}
	}

	return result;
}


/******************************************************************************************************
 * isSaturdayService
 * 
 * @param theServiceID
 * @param theDateStr
 * @returns {String}
 * 
 ******************************************************************************************************/
function isSaturdayService(theServiceID, theDateStr)
{
	var isAllowed = false;
	var currentItem = nlapiLoadRecord('serviceitem', theServiceID);
	var theDate = nlapiStringToDate(theDateStr);

	if (theDate != null && currentItem != null)
	{
		if(currentItem.getFieldValue('custitem_saturdays') == 'T' && theDate.getDate() == 6) 
		{
			isAllowed = true;
		}
	}
	return isAllowed;
}


/******************************************************************************************************
 * getDTservices
 * 
 * @param getTimed
 * @param getDated
 * @returns {String}
 ******************************************************************************************************/
function getDTservices(getTimed, getDated)
{
	var services = '';
	var defSearchFilters = new Array();
	var defSearchColumns = new Array();

	defSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

	defSearchColumns[0] = new nlobjSearchColumn('name');

	var defSearchResults = nlapiSearchRecord('serviceitem', 'customsearch_datedpalletservices', defSearchFilters, defSearchColumns);

	if (defSearchResults) 
	{
		for (var s = 0; s < defSearchResults.length; s++) 
		{
			services += defSearchResults[s].getValue(defSearchColumns[0]);
		}
	}
	return services;
}


/******************************************************************************************************
 * getPalletServicesforZone
 * 
 * @param theZone
 * @param getText
 * @returns {String}
 ******************************************************************************************************/
function getPalletServicesforZone(theZone, getText)
{ //Comma list of services available
	var services = '';
	var defSearchFilters = new Array();
	var defSearchColumns = new Array();

	defSearchFilters[0] = new nlobjSearchFilter('custrecord_zone', null, 'is', theZone);
	defSearchFilters[1] = new nlobjSearchFilter('custrecord_defaultfullpalletrate', null, 'isnotempty');

	defSearchColumns[0] = new nlobjSearchColumn('custrecord_pallet_service');
	defSearchColumns[1] = defSearchColumns[0].setSort();
	defSearchColumns[2] = new nlobjSearchColumn('custrecord_zone');
	defSearchColumns[3] = new nlobjSearchColumn('custrecord_defaultfullpalletrate');
	defSearchColumns[4] = new nlobjSearchColumn('custrecord_defaulthalfpalletrate');
	defSearchColumns[5] = new nlobjSearchColumn('custrecord_defaultqtrpalletrate');
	defSearchColumns[6] = new nlobjSearchColumn('custrecord_defaultmicropalletrate');

	var defSearchResults = nlapiSearchRecord('customrecord_pallet_zoneservicepricing', null, defSearchFilters, defSearchColumns);

	if (defSearchResults) 
	{
		var SizeArrayNames = ["Full", "Half", "Quarter", "Micro"];
		var SizeArray = ["", "", "", ""];
		var qtrpallets = nlapiGetFieldValue('custbody_quarterpalletsallowed');
		var micropallets = nlapiGetFieldValue('custbody_micropalletsallowed');
		for (var sz = 0; sz < SizeArray.length; sz++) 
		{
			for (var s = 0; s < defSearchResults.length; s++) 
			{
				if (!(sz == 2 && qtrpallets == 'F') && !(sz == 3 && micropallets == 'F')) 
				{
					if (defSearchResults[s].getValue(defSearchColumns[sz + 3]) != null && defSearchResults[s].getValue(defSearchColumns[sz + 3]) != '') 
					{
						if (SizeArray[sz] != '') 
						{
							SizeArray[sz] += ',';
						}
						if (getText) 
						{
							SizeArray[sz] += " " + defSearchResults[s].getText(defSearchColumns[0]);
						}
						else 
						{
							SizeArray[sz] += defSearchResults[s].getValue(defSearchColumns[0]);
						}
					}
				}
			}
		}
		/*
        for (var fz = 1; fz < SizeArray.length; fz++) 
			if (SizeArray[fz] == SizeArray[0]) {
				SizeArray[fz] = ""; //Not needed as the same as full
				SizeArrayNames[0] += " / " + SizeArrayNames[fz];
			}
		 */
		for (var tz = 0; tz < SizeArray.length; tz++) 
		{
			if (SizeArray[tz] != "") 
			{
				services += "\n" + SizeArrayNames[tz] + " Pallet : " + SizeArray[tz] + "\n";
			}
		}
	}
	return services;
}


/******************************************************************************************************
 * getRatesforPalletItemZone 
 * 
 * @param currentItem
 * @param palletZone
 * @returns {___theRates0}
 ******************************************************************************************************/
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




//########################################################################################################################################################################
//#
//#
//#
//#
//#
//########################################################################################################################################################################




/**************************************************************************************************
 * soBNCaptureClientValidateLine
 *   
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * 
 * @returns {Boolean} True to continue changing field value, false to abort value change
 **************************************************************************************************/
function soBNCaptureClientValidateLine(type)
{
	var retVal = true;
	var currentQuantity = 0;
	var batchQuantity = 0;
	var batchNumberArray = null;
	var batchNumberArrayLength = 0;
	var batchNumberString = '';
	var batchNumberText = '';

	try
	{

		if(type == 'item')
		{
			//get current quantity
			currentQuantity = nlapiGetCurrentLineItemValue(type, 'quantity');
			currentQuantity = parseInt(currentQuantity);

			//get batch number quantity
			batchQuantity = nlapiGetCurrentLineItemValue(type, 'custcol_batchnumberqty');
			batchQuantity = parseInt(batchQuantity);

			//If they want to use the Batch Numbering 
			if(batchQuantity > 0)
			{
				//get batch number internal id array
				batchNumberString = nlapiGetCurrentLineItemValue(type, 'custcol_batchnumberselect');
				batchNumberArray = batchNumberString.split(',');

				//get the numbers
				batchNumberArrayLength = batchNumberArray.length;
				batchNumberArrayLength = parseInt(batchNumberArrayLength);

				//alert('currentQuantity: ' + currentQuantity + '\nbatchQuantity: ' + batchQuantity + '\nbatchNumberString: ' + batchNumberString + '\nbatchNumberArrayLength: ' + batchNumberArrayLength);


				//if current and batch and batchLength match
				if((batchQuantity == currentQuantity) && (batchQuantity == batchNumberArrayLength))
				{
					//alert('YES!!!');


					for(var i=0; i < batchNumberArrayLength; i++)
					{
						alert('BNA: ' + batchNumberArray[i]);
						//load each batch number record and get the ID of it
						batchNumberText += nlapiLookupField(batchNumberRecordName, batchNumberArray[i], 'name', false) + '\n';
					}
					//put in the print field 'custcol_batchnumberprint'
					nlapiSetCurrentLineItemValue(type, 'custcol_batchnumberprint', batchNumberText, false, true);

					retVal = true;
				}
				else
				{
					alert('The number of batch numbers you have selected does not match the inventory quantity required to fulfil this order.');
					retVal = false;
				}
			}

		}

	}
	catch(e)
	{
		errorHandler('dataCaptureClientValidateField', e);
	}
	return retVal;
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
	alert('Error in ' + sourceName + '\n\nError: ' + e.message);
	if ( e instanceof nlobjError )
	{
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}
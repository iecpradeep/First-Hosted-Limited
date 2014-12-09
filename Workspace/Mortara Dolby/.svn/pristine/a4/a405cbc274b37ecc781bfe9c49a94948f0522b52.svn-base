/************************************************************************************************************
 * Name:			Addresses for Service Report
 * Script Type:		Suitelet (called by Client on Field Change)
 * Client:			Mortara Dolby
 *
 * Version:	1.0.0 - 29 Jun 2012 - first release - MJL
 *          1.0.1 - 05 Jul 2012 - added default flags to suitelet - MJL
 *          1.0.2 - 05 Jul 2012 - changed suitelet from posting full addresses to posting internal IDs - MJL
 *          1.0.3 - 13 Jul 2012 - changed suitelet trigger from customer field to new checkbox - MJL
 *          1.0.4 - 30 Jul 2012 - if address line has no label, addressee is substituted - MJL
 *          1.0.5 - 07 Aug 2012 - bug fix - if customer is changed, address fields are cleared - MJL
 *          1.0.6 - 03 Oct 2012 - added setting of default addresses on selection of customer - MJL
 *          1.0.7 - 19 Oct 2012 - made accessible on all forms - MJL
 *          1.0.8 - 24 Oct 2012 - load default addresses on form load - MJL
 *          1.0.9 - 24 Oct 2012 - only calls getDefaultAddresses function if customerID != 0 - MJL
 *          1.0.10 - 24 Oct 2012 - added error trapping when getting default addresses - MJL
 *
 * Author:	FHL
 * Purpose:	Gets addresses from Customer record on to a suitelet and posts back to the Case form 
 * 
 * Suitelet: Case Address Suitelet
 * Script: customscript_case_address_suitelet
 * Deployment: customdeploy_case_address_suitelet
 * 
 * Client script: Fire Address Suitelet
 * Script: customscript_fireaddresses_suitelet
 * Deployment: customdeploy_fireaddresses_suitelet
 ************************************************************************************************************/

var customerID = 0;

var form = null;
var fldShipAddresses = null;
var fldBillAddresses = null;
var fldSelectedShipAddr = null;
var fldSelectedBillAddr = null;
var fldIsDefaultShip = null;
var fldIsDefaultBill = null;
var fldAddrLineCount = null;
var submitButton = null;

var objCustomer = null;
var addrLineCount = 0;
var arrAddresses = new Array();

var selectedShipAddr = null;
var selectedBillAddr = null;

/**
 * Calls the suitelet on field change
 * 
 * 1.0.3 changed suitelet trigger field to checkbox
 * 1.0.5 bug fix: if customer is changed, address fields are cleared
 * 1.0.6 added call to getDefaultAddresses function
 * 1.0.7 made accessible on all forms
 * 1.0.9 only calls getDefaultAddresses function if customerID != 0
 * 
 * @param type - the selected sublist ID
 * @param name - the ID of the changed field
 */
function fireAddrSuitelet_OnFieldChange(type, name)
{	
	//var formID = 0; //1.0.7
	var scriptID = 0;
	var context = nlapiGetContext();
	var chkAddress = '';

	//1.0.3 changed trigger to Change Addresses checkbox
	if (name == 'custevent_sl_changeaddresses') 
	{
		//only run if form is DM Service Case Form (FHL)
		formID = nlapiGetFieldValue('customform');
		
		//if (formID == '54') //1.0.7
		//{
			//1.0.3 only run if Change Addresses flag is true
			chkAddress = nlapiGetFieldValue(name);
		
			if (chkAddress == 'T')
			{	
				//get customer ID
				customerID = nlapiGetFieldValue('company');
				
				//1.0.3 fire suitelet if customer is selected
				if (customerID.length > 0)
				{
					//get script ID parameter from deployment
					scriptID = context.getSetting('SCRIPT', 'custscript_addrsuitelet_intid');
					
					//pass parameters to the popup function
					addrPopup(scriptID, customerID);
				}
				else
				{	
					alert('A customer must be chosen before any addresses can be selected.');
					nlapiSetFieldValue('custevent_sl_changeaddresses', 'F');
				}
			}
		//}
	}
	else if (name == 'company') //1.0.5
	{
		nlapiSetFieldValue('custevent_sl_changeaddresses', 'F', false, true);
		nlapiSetFieldValue('custevent_sl_shippingaddress', '', false, true);
		nlapiSetFieldValue('custevent_sl_billingaddress', '', false, true);

		//1.0.6	
		customerID = nlapiGetFieldValue(name);

		if (customerID != 0) //1.0.9
		{
			getDefaultAddresses();
		}
	}
}

/**
 * Creates the popup containing the suitelet
 * 
 * @param scriptID - internal ID of the script record
 * @param customerID - internal ID of the customer record
 */
function addrPopup(scriptID, customerID)
{
	var addrSuiteletURL = null;
	var scriptDeployID = '1';
    var width = 926; 
    var height = 277; 
	var params = 'width=' + width +', height =' + height;
	params += ', directories=no';
    params += ', location=yes'; 
    params += ', menubar=no'; 
    params += ', resizable=yes'; 
    params += ', scrollbars=no'; 
    params += ', status=no'; 
    params += ', toolbar=no'; 
    params += ', fullscreen=no';
    
    //automatically build the URL with the follow parameters
    addrSuiteletURL = nlapiResolveURL('SUITELET', scriptID, scriptDeployID);
    addrSuiteletURL += '&custpage_customerid=' + customerID; 

    //open the window with the URL and the parameters
    window.open(addrSuiteletURL, 'Addresses', params);
}

/**
 * 1.0.6 gets default addresses from Customer and posts to Case
 * 1.0.10 added code to trap any errors
 */
function getDefaultAddresses()
{	
	var shipAddrLineNo = 0;
	var billAddrLineNo = 0;
	var defaultShip = 0;
	var defaultBill = 0;
	
	try
	{
		objCustomer = nlapiLoadRecord('customer', customerID);

		shipAddrLineNo = objCustomer.findLineItemValue('addressbook', 'defaultshipping', 'T');
		billAddrLineNo = objCustomer.findLineItemValue('addressbook', 'defaultbilling', 'T');

		if (shipAddrLineNo > 0 && billAddrLineNo > 0)
		{
			defaultShip = objCustomer.getLineItemValue('addressbook', 'addressid', shipAddrLineNo);
			defaultBill = objCustomer.getLineItemValue('addressbook', 'addressid', billAddrLineNo);
		}

		if (defaultShip > 0 && defaultBill > 0)
		{
			nlapiSetFieldValue('custevent_sl_shippingaddress', defaultShip, false, true);
			nlapiSetFieldValue('custevent_sl_billingaddress', defaultBill, false, true);
		}
	}
	catch (e)
	{
		alert('An error occurred while setting default addresses: \n\n' + e.message);
	}
}

/**
 * Initiates the suitelet and gets parameters from URL
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns true
 */
function addressSearch(request, response)
{
	var retVal = false;
	
	//get parameters from URL
	customerID = request.getParameter('custpage_customerid');
	
	if (request.getMethod() == 'GET')
	{
		//create Address form
		createAddrForm(request, response);
	}
	else
	{
		//post addresses back to Case
		postAddresses(request, response);
	}
	return retVal;
}

/**
 * Creates the address form and calls get addresses function
 * 
 * 1.0.1 added default flags to suitelet form
 * 1.0.8 added call to loadDefaultAddresses function
 * 
 * @param {nlobjRequest} request Request object
 * @param {nlobjResponse} response Response object
 * @returns retVal - boolean value
 */
function createAddrForm(request, response)
{
	var form = null;
	var areAddrSet = null;
	var strArrayDump = '';
	var retVal = null;

	//create new form
	form = nlapiCreateForm('Addresses', true);
	
	//add fields and populate
	fldShipAddresses = form.addField('custpage_shipaddresses', 'select', 'Select Shipping Address');
	fldShipAddresses.addSelectOption('', '', true);
	fldIsDefaultShip = form.addField('custpage_isdefaultship', 'checkbox', 'Default Shipping').setDisplayType('disabled');
	fldSelectedShipAddr = form.addField('custpage_selshipaddress', 'textarea', 'Selected Shipping Address').setDisplayType('disabled');
	
	fldBillAddresses = form.addField('custpage_billaddresses', 'select', 'Select Billing Address').setBreakType('startcol');
	fldBillAddresses.addSelectOption('', '', true);
	fldIsDefaultBill = form.addField('custpage_isdefaultbill', 'checkbox', 'Default Billing').setDisplayType('disabled');
	fldSelectedBillAddr = form.addField('custpage_selbilladdress', 'textarea', 'Selected Billing Address').setDisplayType('disabled');
	
	fldArrayDump = form.addField('custpage_arraydump', 'textarea', 'Array Dump').setDisplayType('hidden');

	//create button
	submit = form.addSubmitButton();
	
	//add select options for addresses to dropdown fields
	areAddrSet = getAddresses();
	
	//1.0.8 load default addresses
	if (areAddrSet == true)
	{
		areAddrSet = loadDefaultAddresses();
	}
	
	//if addresses are set...
	if (areAddrSet == true)
	{	
		//dump address details from array into a string value
		for(var i = 0; i < arrAddresses.length; i++)
		{
			for(var j = 0; j < arrAddresses[i].length; j++)
			{
				strArrayDump += arrAddresses[i][j];
				
				if (j != (arrAddresses[i].length - 1) || i != (arrAddresses.length - 1))
				{
					strArrayDump += '|';
				}
			}
		}
		
		nlapiLogExecution('AUDIT', 'Array dump', strArrayDump);
		
		//post array dump to hidden field
		form.setFieldValues({custpage_arraydump: strArrayDump});
		
		//set field changed script
		form.setScript('customscript_addrtxtfields');
		
		//write the form to the page
		response.writePage(form);
		
		retVal = true;
	}
	else
	{
		response.write('No addresses found.');
		retVal = false;
	}

	return retVal;
}

/**
 * Gets addresses from customer record
 * 
 * 1.0.4 if address line has no label, addressee is substituted
 * 
 * @returns Boolean value
 */
function getAddresses()
{
	var retVal = null;
	
	try
	{
		//get number of addresses from customer record
		objCustomer = nlapiLoadRecord('customer', customerID);
		addrLineCount = objCustomer.getLineItemCount('addressbook');
		
		//get address details and add options to dropdown fields
		for (var i = 1; i <= addrLineCount; i++)
		{
			arrAddresses[i-1] = new Array(5);
			arrAddresses[i-1][0] = objCustomer.getLineItemValue('addressbook', 'addressid', i);
			arrAddresses[i-1][1] = objCustomer.getLineItemValue('addressbook', 'addrtext', i);
			arrAddresses[i-1][2] = objCustomer.getLineItemValue('addressbook', 'label', i);
			
			//1.0.4
			if (arrAddresses[i-1][2] == null)
			{
				arrAddresses[i-1][2] = objCustomer.getLineItemValue('addressbook', 'addressee', i);
			}
			
			arrAddresses[i-1][3] = objCustomer.getLineItemValue('addressbook', 'defaultshipping', i);
			arrAddresses[i-1][4] = objCustomer.getLineItemValue('addressbook', 'defaultbilling', i);
		
			fldShipAddresses.addSelectOption(arrAddresses[i-1][0], arrAddresses[i-1][2]);
			fldBillAddresses.addSelectOption(arrAddresses[i-1][0], arrAddresses[i-1][2]);
		}
		retVal = true;
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot populate address fields', e.message);
		retVal = false;
	}
	return retVal;
}

/**
 * 1.0.8 sets default addresses on load of suitelet form
 * 
 * @returns Boolean value
 */
function loadDefaultAddresses()
{
	var retVal = false;
	var defaultIndex = 0;
	var idIndex = 0;
	var textIndex = 1;	

	for (var i = 0; i < arrAddresses.length; i++)
	{
		defaultIndex = arrAddresses[i].indexOf('T', 3);
		
		if (defaultIndex != -1)
		{
			if (defaultIndex == 3)
			{
				fldShipAddresses.setDefaultValue(arrAddresses[i][idIndex]);
				fldSelectedShipAddr.setDefaultValue(arrAddresses[i][textIndex]);
				fldIsDefaultShip.setDefaultValue(arrAddresses[i][defaultIndex]);
				retVal = true;
			}
			else if (defaultIndex == 4)
			{
				fldBillAddresses.setDefaultValue(arrAddresses[i][idIndex]);
				fldSelectedBillAddr.setDefaultValue(arrAddresses[i][textIndex]);
				fldIsDefaultBill.setDefaultValue(arrAddresses[i][defaultIndex]);
				retVal = true;
			}
		}
	}
	return retVal;
}

/**
 * Posts the selected address back to the Case form
 * 
 * 1.0.2 changed from posting full addresses to posting internal IDs
 * 
 * @returns Boolean value
 */
function postAddresses(request, response)
{	
	var addNewScript = '';
	var retVal = null;
	
	try
	{
		//get values from the suitelet form		
		selectedShipAddr = request.getParameter('custpage_shipaddresses');
		selectedBillAddr = request.getParameter('custpage_billaddresses');
		
		//populate address fields on the Case form and close suitelet
		addNewScript = '<script type="text/javascript">';
		addNewScript += 'window.opener.nlapiSetFieldValue(\'custevent_sl_shippingaddress\',\'' + selectedShipAddr + '\', true, true);';
		addNewScript += 'window.opener.nlapiSetFieldValue(\'custevent_sl_billingaddress\',\'' + selectedBillAddr + '\', true, true);';
		addNewScript += 'close(); </script>';
		response.write(addNewScript);
		
		retVal = true;
	}
	catch (e)
	{
		nlapiLogExecution('ERROR', 'Cannot post addresses to Case form', e.message);
		retVal = false;
	}
	return retVal;
}
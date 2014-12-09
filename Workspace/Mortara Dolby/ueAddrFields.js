/***********************************************************************************************
 * Name: Add Service Report Buttons
 * Script Type: User Event
 * Client: Mortara Dolby
 * 
 * Version: 1.0.0 - 2 May 2012 - 1st release - MJL
 *
 * Author: Matthew Lawrence, Mike Lewis, FHL
 * Purpose: Add a button on to the case record before load that creates or amends a Sales Order
 * 
 * Sales Order Button:
 * User Event script: Add Create Sales Order Button
 * Script ID: customscript_ue_addsalesorderbutton  
 * Deployment ID: customdeploy_ue_addsalesorderbutton
 * 
 * Service Report Button:
 * User Event script: Add Print Service Report Button
 * Script ID: customscript_ue_addprintsrbutton  
 * Deployment ID: customdeploy_ue_addprintsrbutton
 ***********************************************************************************************/

 function addAddressFields(type, form)
 {
 //	var context = nlapiGetContext();
 	var fldShipAddr = null;
	var fldBillAddr = null;
	
 	fldShipAddr = form.addField('custpage_sl_billingaddress', 'select', 'Billing Address', null, 'custom32');
	fldBillAddr = form.addField('custpage_sl_shippingaddress', 'select', 'Shipping Address', null, 'custom32');
	
	fldShipAddr.addSelectOption('', '');
	fldShipAddr.addSelectOption('test1', 'Test 1');
	fldShipAddr.addSelectOption('test2', 'Test 2');
	
	fldBillAddr.addSelectOption('', '');
	fldBillAddr.addSelectOption('test1', 'Test 1');
	fldBillAddr.addSelectOption('test2', 'Test 2');
	
	form.setScript();
 }

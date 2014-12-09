/*******************************************************
 * Name:		Dolby Client Stock Req Script
 * Script Type:	Client side script
 * Version:		1.1.0
 * Date:		16th - 18th September 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/


 function myFieldChanged(type, name, linenum)
{
	 
	
	
	 
	 
	return true;
	//just return as we dont want them to see our debug messages!!
	
	if(nlapiGetRole() == '3')
		{	
		var TheValue = nlapiGetFieldValue(name);
		var TheText = nlapiGetFieldText(name);
		
		alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
		
		}
	 
	return true;


	alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
	
	
	
	if (name == 'custentity_creditlimit')
		{
			//Test here.
			//alert('CreditLimit: ' + TheValue + '...' + TheText);		
			var TheCreditLimit = 0;
			var NewCreditLimit = '';
			
			NewCreditLimit = nlapiLoadRecord('customrecord_creditlimit', TheValue);
			
			TheCreditLimit = NewCreditLimit.getFieldValue('custrecord_creditvalue');
			//nlapiLogExecution('DEBUG','Field Text',TheText);
			nlapiSetFieldValue('creditlimit', TheCreditLimit);
		}
	
	return true;
	
	
	if (name == 'custcol_item_number') {
		alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
		
		//custcol_num_of_episodes	- number of episodes
		//custcol_item_number	- item number
		//amount	- total licence fee
		//
		
		var numOfEpisodes = nlapiGetLineItemValue('item', 'custcol_num_of_episodes', linenum);
		alert('Current line index: ' + linenum + ', current num of eps: ' + numOfEpisodes + ', name: ' + name);
		nlapiSetLineItemValue('item', 'quantity', linenum, numOfEpisodes);
		alert('');
	}
	
	
	if(name=='entity')
	{
		//alert('entity selected!');
		//var TheSupplier;
		//TheSupplier = nlapiGetFieldValue(entity);
		//alert(TheSupplier);
		
		try 
		{
	
			TheSupplier = nlapiLoadRecord('vendor',TheValue);
			
			var minValue =0;
			minValue = TheSupplier.getFieldValue('custentity_minordervalue');
			alert('Supplier loaded successfully!!!\n\nMin value = ' + minValue);
		} 
		catch (e) 
		{
			alert('error loading record');
		}
	}
} 
 
 
 
 
 
 
 
 
 
 
 function OnSave()
 {

//	 if(nlapiGetRole() != '3')
	//	 {
	//	 return true;		 
	//	 }
		 
	 var InDebug = false;	//set to TRUE to see all of the DEBUG messages...
	 
 	var TheXFer; // = new nlobjRecord();
 	
 	/*
 	 * custrecord_sr_location
 	 * custrecord_sr_qty
 	 * custrecord_sr_item
 	 * custrecord_sr_reason
 	 * custrecord_sr_employee
 	 * custrecord_sr_case
 	 * custrecord_sr_status
 	 * custrecord_sr_type
 	 * 
 	 * The number of lot numbers entered (0) is not equal to the item quantity (3)
 	 * 
 	 * Lot numbers must be entered using this format: LOT#(Quantity).n
 	 * For example, to enter a quantity of 100 items as Lot number ABC1234, enter "ABC1234(100)" in the Lot Numbers field.
 	 * 
 	 */
 	
 	
 	
 	try
 	{
 		
 		if(nlapiGetFieldValue('custrecord_sr_transferorderid').length != 0)
 			{
 				alert('You have already created a Transfer Order from this request.\n\nAs other transactions are created off this record, it can no longer be modified.\n\nPlease contact support for more information.');
 				
 				if(InDebug == true)
 					{
 					return false; 	
 					}
 			}
 		
 		var TheToLocation = nlapiGetFieldValue('custrecord_sr_location');			//Get To location from Stock Requisition
 		
			if(InDebug == true)
				{
					alert('To Location:\n\n' +  TheToLocation);
				}
 		
 		//return true;
 		
 		//nlapiLogExecution('DEBUG', 'Message', TheToLocation);
 		var TheFromLocation = '28';													//Set From location
 		
			if(InDebug == true)
				{
				 	alert('TheFromLocation:\n\n' +  TheFromLocation);
				}
 		//
 		
 		var TheQuantity = nlapiGetFieldValue('custrecord_sr_qty');					//Get Quantity from Stock Requisition
		
 		if(InDebug == true)
		{
			alert('TheQuantity:\n\n' +  TheQuantity);
		}
 		var TheItem = nlapiGetFieldValue('custrecord_sr_item');						//Get Item from Stock Requisition
		if(InDebug == true)
		{
			alert('TheItem:\n\n' +  TheItem);
		}
 		
 		var TheReason = nlapiGetFieldValue('custrecord_sr_reason');					//Get Reason from Stock Requisition
		if(InDebug == true)
		{
			alert('TheReason:\n\n' +  TheReason);
		}
		
 		var TheEmployee = nlapiGetFieldText('custrecord_sr_employee');				//Get Employee from Stock Requisition
		if(InDebug == true)
		{
			alert('TheEmployee:\n\n' +  TheEmployee);
		}
		
 		var TheEmployeeID = nlapiGetFieldValue('custrecord_sr_employee');				//Get Employee from Stock Requisition
 		if(InDebug == true)
		{
			alert('TheEmployeeID:\n\n' +  TheEmployeeID);
		}
 		
 		//var TheCase = nlapiGetFieldValue('custrecord_sr_case');						//Get Case from Stock Requisition
 		//alert('TheCase:\n\n' +  TheCase);
 		
 		//var TheStatus = nlapiGetFieldValue('custrecord_sr_status');					//Get Status from Stock Requisition
 		//alert('TheStatus:\n\n' +  TheStatus);
 		
 		//var TheType = nlapiGetFieldValue('custrecord_sr_type');						//Get Type from Stock Requisition
 		//alert('TheType:\n\n' +  TheType);
 		
 		var TheSerialNumbers = nlapiGetFieldValue('custrecord_sr_serialnumbers');	//Get Serial Numbers from Stock Requisition
		if(InDebug == true)
		{
			alert('TheSerialNumbers:\n\n' +  TheSerialNumbers);
		}
 		
		
		//error handling...
		// *******************************************************
		if((TheToLocation.length == 0) || (TheToLocation == TheFromLocation))
			{
				alert('You cannot chose this location to transfer stock in to.\n\nPlease retry the operation.\n\n' + TheToLocation);
				return false;
			}
		
		if(TheItem == '')
			{
			alert('The Item selected is not valid.\n\nPlease try again.\n\n' + TheItem.length);
			return false;
			
			}
		
		if(TheQuantity <1)
			{
				alert('You have entered an invalid Quantity.\n\nPlease try again.\n\n' + TheQuantity.length);
				return false;			
			}
		
		if(TheEmployee == '')
			{
				alert('You must select a valid Employee.\n\n' + TheEmployee.length);
				return false;			
			}
		
		if(trim(TheReason) == '')
		{
			alert('You must enter a reason for this Stock Requisition.\n\n' + TheReason.length);
			return false;			
		}
		
		
		// *******************************************************
		
 		//Set the memo to be the employee etc
 		var TheMemo = TheEmployee + ' initiated transfer.\nReason:\n' + TheReason;
 		
 		TheXFer = nlapiCreateRecord('transferorder');
 		
 		TheXFer.setFieldValue('transferlocation', TheToLocation.toString());
 		TheXFer.setFieldValue('location', TheFromLocation);
 		TheXFer.setFieldValue('custrecord_sr_qty', TheQuantity);
 		TheXFer.setFieldValue('memo', TheMemo);
 		TheXFer.setFieldValue('employee', TheEmployeeID);
 		
 		TheXFer.selectNewLineItem('item');
 		TheXFer.setCurrentLineItemValue('item','item',TheItem); 
 		TheXFer.setCurrentLineItemValue('item', 'quantity', TheQuantity);
 		
 		if(TheSerialNumbers.length != 0)
 			{
 		 		TheRec.setCurrentLineItemValue('item', 'serialnumbers', TheSerialNumbers);	
 			}

 		TheXFer.commitLineItem('item');   		
 		TheXFer.setFieldValue('orderstatus', 'B'); 	//Set to Pending Fulfillment
 		

 		
 		var TheSavedXFer = nlapiSubmitRecord(TheXFer, true);
 		
 		nlapiSetFieldValue('custrecord_sr_transferorderid', TheSavedXFer);
 		
 		//nlapiTransformRecord('transferorder','itemfulfillment');
 		
		if(InDebug == true)
		{
			alert('About to Fulfill...(' + TheId + ')');
		}
		
 		var TheFulfill = nlapiTransformRecord('transferorder', TheSavedXFer, 'itemfulfillment', null);
 		
		if(InDebug == true)
		{
			alert("Transformed to item fulfillment with "+ TheFulfill.getLineItemCount('item') + " item(s)");
		}
 		//TheFulfill.setFieldValue('customform', '110');
		if(InDebug == true)
		{
			alert('At SetLineItem...');
		}
 		
 		//TheFulfill.selectNewLineItem('item');


		//for(var i = 1; i<= TheFulfill.getLineItemCount('item'); i++){
		//	TheFulfill.setLineItemValue('item', 'itemreceive', i, 'T');
		//}
		
		TheFulfill.setLineItemValue('item', 'itemreceive', 1, 'T');
		//TheFulfill.commitLineItem('item'); 
		TheFulfill.setFieldValue('shipstatus', 'C');
		TheFulfill.setFieldValue('custbody_ordetype', 3);
		
		TheFulfill.setFieldValue('memo',TheMemo);
 		
		if(InDebug == true)
		{
			alert('Submitting Fulfill...(shipstatus: ' + TheFulfill.getFieldValue('shipstatus') + ')');
		}
 		
 		var TheSavedFulfill = nlapiSubmitRecord(TheFulfill, true);
 		
 		
 		
 		
		if(InDebug == true)
		{
			alert('The FulfillID: ' + TheSavedFulfill + '\n\nTransfer Order ID: ' + TheSavedXFer);
		}
 	
 		
 		
 		var TheReceipt;
 		var TheReceiptID = 0;
 		
		if(InDebug == true)
		{
			alert('At ItemReceipt...');
		}
 		TheReceipt = nlapiTransformRecord('transferorder', TheSavedXFer, 'itemreceipt', null);
 		
		if(InDebug == true)
		{
			alert("created item receipt with "+ TheReceipt.getLineItemCount('item') + " item(s)");
		}
		
		for(var i = 1; i<= TheReceipt.getLineItemCount('item'); i++){
			TheReceipt.setLineItemValue('item', 'itemreceive', i, 'T');
		}
		TheReceipt.setFieldValue('custbody_ordetype', 3);
		
		TheReceipt.setFieldValue('custbody_receivedbylist', '6');	//Hard coded for now as the Received By list is a custom list(!)
		if(InDebug == true)
		{
			alert('About to submit transformed TransferOrder to ItemReceipt...');
		}
		
		TheReceiptID = nlapiSubmitRecord(TheReceipt, true);
 		
		if(InDebug == true)
		{
			alert('ID of TransferOrder trail:\nFulfillment: ' + TheSavedFulfill + '\n\nTransfer: ' + TheSavedXFer + '\n\nItem Reciept: ' + TheReceiptID);
		}
 		
 	}
 	catch (e)
 	{
 		alert('An error has occurred whilst attempting to transfer the selected Item:\n' + e.message);
 		return false;
 	}
 	
 	return true;
 }
 
 
 
 
//Removes white spaces before and after
 function trim(str)
 {
 	return ltrim(rtrim(str));
 }
  
 //Removes white spaces before
 function ltrim(str) {
 	var chars = "\\s";
 	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
 }
  
 //Removes white spaces after
 function rtrim(str) {
 	var chars = "\\s";
 	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
 }
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 
 /*
 
 
 function transferInventory(items, fromLoc, toLoc, qtyField)
 {
		var xfr = nlapiCreateRecord('transferorder');
		xfr.setFieldValue('location', fromLoc);
		xfr.setFieldValue('transferlocation', toLoc);
		
		var atLine = 1;
		KOTNUtil.each(items, function(idx, item){
			xfr.insertLineItem('item', atLine);
			xfr.setLineItemValue('item', 'item', atLine, item.id);
			xfr.setLineItemValue('item', 'quantity', atLine, item[qtyField]);
			atLine++;
		});
		
		xfr.setFieldValue('orderstatus', 'B');
		var xfrId = nlapiSubmitRecord(xfr, true);
		if(xfrId){
			(function(){
				nlapiLogExecution("DEBUG", "about to create fulfillment for xfer id:"+ xfrId);
				var ff = nlapiTransformRecord('transferorder', xfrId, 'itemfulfillment');
				nlapiLogExecution("DEBUG", "created item fulfillment with :"+ ff.getLineItemCount('item') + " items");
				for(var i = 1; i<= ff.getLineItemCount('item'); i++){
						ff.setLineItemValue('item', 'itemreceive', i, 'T');
				}
				ff.setFieldValue('shipstatus', 'C');
				var ffId = nlapiSubmitRecord(ff, true);
				if(ffId){
					(function(){
						var ir = nlapiTransformRecord('transferorder', xfrId, 'itemreceipt');
						nlapiLogExecution("DEBUG", "created item receipt with :"+ ir.getLineItemCount('item') + " items");
						for(var i = 1; i<= ir.getLineItemCount('item'); i++){
								ir.setLineItemValue('item', 'itemreceive', i, 'T');
						}
						nlapiSubmitRecord(ir, true);
				})();
				}
			})();
		}

	} */
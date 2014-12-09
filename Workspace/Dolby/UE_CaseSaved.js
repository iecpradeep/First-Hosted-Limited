/*******************************************************
 * Name:		Dolby Medical Stock Requisition Transfer Order Creation Script
 * Script Type:	User Event
 * Version:		1.0.0
 * Date:		1st November 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/


function CaseAfterSubmit(type)
{
	
	//return true;
	
	
	var TheCaseRecord = '';
	var TheCaseRecordID = 0;
	var StockReqCount = 0;
	var FromLocation = '28';
	var StockReqs = new Array();
	var StockReqCount = 0;
	var InDebug = false;
	
	if(1 == 2)
		{
		alert('DEBUG Testing' + TheCaseRecord + TheCaseRecordID + StockReqCount);
		}
	
	//On both Create and Edit of the Transaction...
	if (type == 'create' || type == 'edit')
		{
			//execute the script
			TheCaseRecordID = nlapiGetRecordId();
			TheRecordType = nlapiGetRecordType();	//We know it'll be a Case... :)
			TheCaseRecord = nlapiLoadRecord(TheRecordType , TheCaseRecordID , null);
			nlapiLogExecution('DEBUG', 'Dump:', TheRecordType + ', ' + TheCaseRecordID);
			 

		 
		 StockReqCount = TheCaseRecord.getLineItemCount('recmachcustrecord_sr_case');
		 FromLocation = TheCaseRecord.getFieldValue('custevent_sr_from_location');
		 
		 nlapiLogExecution('DEBUG', 'StockReqCount (recmachcustrecord_sr_case)', StockReqCount);
		 	//alert('Total line items in recmachcustrecord_sr_case: ' + StockReqCount);
			
		if(StockReqCount == null)
			{
				//forget it...
			//alert('Total line items in recmachcustrecord_sr_case: null!!');
			
			return true;	//silently ignore it...
			}
		else
			{
			StockReqCount = parseInt(StockReqCount);
			
			//alert('Total line items in recmachcustrecord_sr_case: ' + StockReqCount);
			
			var FulfillID = 0;
			var EmployeeID = 0;
			var ReqID = 0;
			var FulFillChecked = 'F';
			var RequireTX = false;
			
			var DoCreate = false;
			var DoFulFill = false;
			var Response = false;
			var DoTransfer = false;
			var XFerOrderID = 0;
			
			var StockNeedsXFer = 0;
			
			if(3 ==2)
				{
				nlapiLogExecution('DEBUG', 'Transfer Order Failed', DoCreate + DoFulFill + DoTransfer + EmployeeID + ReqID + FulfillID + FulFillChecked + Response);	
				
				}
			
			
			if(StockReqCount > 0)
				//alert('Entered For Loop for 1 and multiple.\n\nStockReqCount: ' + StockReqCount);
		
				for(var i=1; i <= StockReqCount; i++)
				{
					//FulFillChecked = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_req_fulfilled', i);
					//FulfillID = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', i);
					XFerOrderID = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid', i);
					
					//alert('In For Loop with I = ' + i + '.\nFulFillChecked: ' + FulFillChecked + '\n\nFulfillID: ' + FulfillID);
					
					//alert('XFerOrderID: ' +  XFerOrderID);
					
					if(XFerOrderID == null || parseInt(XFerOrderID) < 1 || XFerOrderID == '')
						{
							//alert('XFerOrderID is NULL or < 1');
							
						
							RequireTX = true;
							StockNeedsXFer++;
							StockReqs[StockNeedsXFer] = i;
							nlapiLogExecution('DEBUG', 'StockReqs Length, i ', StockReqs.length + ', ' + i);
							//Response = CreateTransfer(i, true, false, FromLocation, TheCaseRecord);
							/*
							if(Response == -1)
							{
								nlapiLogExecution('DEBUG', 'Transfer Order Failed', 'Could not create the Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
								return true;
							}
							else
							{
								TheCaseRecord.setLineItemValue('recmachcustrecord_sr_case','custrecord_transferorderid', i, Response);
							}
					
							*/
						}
					else
					{
						nlapiLogExecution('ERROR', 'Transfer Order Creation Failed', 'Could not Fulfill the Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
					}
				}

			
			//do check to see if there's anything in there
			if(RequireTX == true)
				{
				nlapiLogExecution('DEBUG', 'Dump 119:', TheRecordType + ', ' + TheCaseRecordID);
				
				
				
				/*
				 * custrecord_sr_item				Item ID
				 * custrecord_sr_qty				Item Quantity
				 * custrecord_sr_serialnumbers		Item Serial Numbers
				 * custrecord_sr_employee			Employee ID
				 * custrecord_sr_reason				Requisition Reason
				 * custrecord_sr_location			Location to Transfer to
				 * custrecord_sr_status				Requisition Status
				 * custrecord_sr_case				Related Case
				 * custrecord_sr_type				Stock type
				 * custrecord_sr_transferorderid	Transfer Order ID
				 * custrecord_req_fulfilled			Whether to Fulfill or not
				 * custrecord_fulfillmentid			Fulfillment ID
				 */
				
				
				
																						//Set From location
				
				nlapiLogExecution('DEBUG', 'Transfer Order From Location',FromLocation);
				nlapiLogExecution('DEBUG', 'CaseRecord Info: ', TheCaseRecord.getId());
				nlapiLogExecution('DEBUG', 'StockReqs[0]', StockReqs[0]);
				nlapiLogExecution('DEBUG', 'StockReqs[1]', StockReqs[1]);
				
				var TheToLocation = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_location', StockReqs[1]);;		//Get To location from Stock Requisition
				var TheQuantity = 0;					//Get Quantity from Stock Requisition
				var TheItem = 0;						//Get Item from Stock Requisition
				var TheReason = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_reason', StockReqs[1]);				//Get Reason from Stock Requisition
				var TheEmployee = TheCaseRecord.getLineItemText('recmachcustrecord_sr_case','custrecord_sr_employee', StockReqs[1]);			//Get Employee from Stock Requisition
				var TheEmployeeID = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_employee', StockReqs[1]);			//Get Employee from Stock Requisition
				var TheSerialNumbers = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', StockReqs[1]);	//Get Serial Numbers from Stock Requisition
				var TheSavedXFer = 0;
				//Set the memo to be the employee etc
				var TheMemo = TheEmployee + ' initiated transfer.\nReason:\n' + TheReason;

				//this is to get rid of the warnings on Eclipse...
				if(InDebug == true)
					{
					nlapiLogExecution('DEBUG', 'Transfer Order Failed', InDebug + FulFillID + TheSavedFulfill + TheReceiptID + TheReceipt + TheFulfill);
					}
				
				
			 	//try
			 	//{
			 	
			 		//alert('Got to CreateTransfer! LineNum ' + LineNum);
			 		
					//error handling...
					// *******************************************************
					if((TheToLocation.length == 0) || (TheToLocation == FromLocation))
						{
							nlapiLogExecution('ERROR', 'Transfer Order Failed','You cannot chose this location to transfer stock in to.\nPlease retry the operation.' + TheToLocation);
							return false;
						}



					
					

			 		

			 			
			 			nlapiLogExecution('DEBUG', 'Transfer Order','Create is true. linenum length is ' + StockReqs.length);
			 	 		
				 	 		TheXFer = nlapiCreateRecord('transferorder');
				 	 		
				 	 		TheXFer.setFieldValue('transferlocation', TheToLocation.toString());
				 	 		TheXFer.setFieldValue('location', FromLocation);
				 	 		TheXFer.setFieldValue('custrecord_sr_qty', TheQuantity);
				 	 		TheXFer.setFieldValue('memo', TheMemo);
				 	 		TheXFer.setFieldValue('employee', TheEmployeeID);
				 	 		TheXFer.setFieldValue('custbody_caselink', TheCaseRecord.getId());
				 	 		
				 	 		
				 	 		for(var i = 1; i < StockReqs.length; i++)

				 	 			{
				 	 			
				 	 				TheQuantity = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_qty', StockReqs[i]);					//Get Quantity from Stock Requisition
				 	 				TheItem = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_item', StockReqs[i]);						//Get Item from Stock Requisition
				 	 				TheSerialNumbers = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', StockReqs[i]);		//Get Serial Numbers from Stock Requisition		
				 	 				

				 	 				TheXFer.selectNewLineItem('item');
						 	 		TheXFer.setCurrentLineItemValue('item','item',TheItem); 
						 	 		TheXFer.setCurrentLineItemValue('item', 'quantity', TheQuantity);
						 	 		
						 	 		if(TheSerialNumbers != null)
						 	 			{
						 	 				TheXFer.setCurrentLineItemValue('item', 'serialnumbers', TheSerialNumbers);	
						 	 			}
						
						 	 		TheXFer.commitLineItem('item');   		
				 	 		
				 	 			
				 	 			}

				 	 		TheXFer.setFieldValue('orderstatus', 'B'); 	//Set to Pending Fulfillment
				 	 		
				 	 		TheSavedXFer = nlapiSubmitRecord(TheXFer, true);
				 	 		//alert('Create is true. TheSavedXfer: ' + TheSavedXFer);
				 	 		
				 	 		//######################################################################
				 	 		for(var i = 1; i < StockReqs.length; i++)

			 	 			{
				 	 			TheCaseRecord.selectLineItem('recmachcustrecord_sr_case', StockReqs[i]);
				 	 			TheCaseRecord.setCurrentLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',TheSavedXFer);
				 	 			TheCaseRecord.commitLineItem('recmachcustrecord_sr_case');
			 	 			}

				 	 		
				 	 		nlapiLogExecution('DEBUG', 'The Saved XFer ID: ', TheSavedXFer);

			 //	}
			 //	catch (e)
			 //	{
			 //		nlapiLogExecution('DEBUG', 'Transfer Order Failed', 'An error has occurred whilst attempting to transfer the Item.\n\n' + e.message);
			 //		
			 //	}
			 	// *******************************************************
				nlapiSubmitRecord(TheCaseRecord);				
				
				}
			}
				
		return true; 
		 
		
		}
	else
		{
		//Silently ignore it as we don't want to count the rest of the actions (e.g. Delete etc)
		nlapiLogExecution('DEBUG', 'Type not needed', 'Ignoring...');
		
		}

}




/***********************
 * 
 * @param LineNum - ID of the Line the Item is on
 * @param Create - Whether to create the Transfer Order or not. DO NOT SET BOTH Create AND FulFill TO TRUE!!!
 * @param FulFill - Whether to Fulfill and Receive the Transfer Order or not. DO NOT SET BOTH Create AND FulFill TO TRUE!!!
 * @returns {Int} - Whether the Function was successful
 */
function CreateTransfer(TheRecordType, TheCaseRecordID, FromLocation, StockReqs)
{
	/*
	 * custrecord_sr_item				Item ID
	 * custrecord_sr_qty				Item Quantity
	 * custrecord_sr_serialnumbers		Item Serial Numbers
	 * custrecord_sr_employee			Employee ID
	 * custrecord_sr_reason				Requisition Reason
	 * custrecord_sr_location			Location to Transfer to
	 * custrecord_sr_status				Requisition Status
	 * custrecord_sr_case				Related Case
	 * custrecord_sr_type				Stock type
	 * custrecord_sr_transferorderid	Transfer Order ID
	 * custrecord_req_fulfilled			Whether to Fulfill or not
	 * custrecord_fulfillmentid			Fulfillment ID
	 */
	
	var TheCaseRecord = nlapiLoadRecord(TheRecordType, TheCaseRecordID, null);
	var InDebug = true;
	//var FulFillID = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', LineNum);
	
	
	var TheFromLocation = FromLocation;																								//Set From location
	
	nlapiLogExecution('DEBUG', 'Transfer Order From Location',TheFromLocation);
	nlapiLogExecution('DEBUG', 'CaseRecord Info: ', TheCaseRecord.getId());
	
	var TheToLocation = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_location', StockReqs[0]);;		//Get To location from Stock Requisition
	var TheQuantity = 0;					//Get Quantity from Stock Requisition
	var TheItem = 0;						//Get Item from Stock Requisition
	var TheReason = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_reason', StockReqs[0]);				//Get Reason from Stock Requisition
	var TheEmployee = TheCaseRecord.getLineItemText('recmachcustrecord_sr_case','custrecord_sr_employee', StockReqs[0]);			//Get Employee from Stock Requisition
	var TheEmployeeID = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_employee', StockReqs[0]);			//Get Employee from Stock Requisition
	var TheSerialNumbers = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', StockReqs[0]);	//Get Serial Numbers from Stock Requisition
	var TheSavedXFer = 0;
	//Set the memo to be the employee etc
	var TheMemo = TheEmployee + ' initiated transfer.\nReason:\n' + TheReason;

	//this is to get rid of the warnings on Eclipse...
	if(InDebug == true)
		{
		nlapiLogExecution('DEBUG', 'Transfer Order Failed', InDebug + FulFillID + TheSavedFulfill + TheReceiptID + TheReceipt + TheFulfill);
		}
	
	
 	try
 	{
 	
 		//alert('Got to CreateTransfer! LineNum ' + LineNum);
 		
		//error handling...
		// *******************************************************
		if((TheToLocation.length == 0) || (TheToLocation == TheFromLocation))
			{
				nlapiLogExecution('ERROR', 'Transfer Order Failed','You cannot chose this location to transfer stock in to.\nPlease retry the operation.' + TheToLocation);
				return false;
			}



		
		
		// *******************************************************
 		

 		
 			if(trim(TheReason) == '')
			{
				nlapiLogExecution('ERROR', 'Transfer Order Failed','You must enter a reason for this Stock Requisition.' + TheReason.length);
				return false;			
			}

 			
 			nlapiLogExecution('DEBUG', 'Transfer Order','Create is true. linenum length is ' + StockReqs.length);
 	 		
	 	 		TheXFer = nlapiCreateRecord('transferorder');
	 	 		
	 	 		TheXFer.setFieldValue('transferlocation', TheToLocation.toString());
	 	 		TheXFer.setFieldValue('location', TheFromLocation);
	 	 		TheXFer.setFieldValue('custrecord_sr_qty', TheQuantity);
	 	 		TheXFer.setFieldValue('memo', TheMemo);
	 	 		TheXFer.setFieldValue('employee', TheEmployeeID);
	 	 		TheXFer.setFieldValue('custbody_caselink', TheCaseRecord.getId());
	 	 		
	 	 		
	 	 		for(var i = 0; i < LineNumArray.length; i++)

	 	 			{
	 	 			
	 	 				TheQuantity = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_qty', LineNumArray[i]);					//Get Quantity from Stock Requisition
	 	 				TheItem = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_item', LineNumArray[i]);						//Get Item from Stock Requisition
	 	 				TheSerialNumbers = TheCaseRecord.getLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', LineNumArray[i]);		//Get Serial Numbers from Stock Requisition		
	 	 				

	 	 				
	 	 				
	 	 			
	 	 				TheXFer.selectNewLineItem('item');
			 	 		TheXFer.setCurrentLineItemValue('item','item',TheItem); 
			 	 		TheXFer.setCurrentLineItemValue('item', 'quantity', TheQuantity);
			 	 		
			 	 		if(TheSerialNumbers != null)
			 	 			{
			 	 			TheXFer.setCurrentLineItemValue('item', 'serialnumbers', TheSerialNumbers);	
			 	 			}
			
			 	 		TheXFer.commitLineItem('item');   		
	 	 		
	 	 			
	 	 			}

	 	 		
	 	 		
	 	 		
	 	 		
	 	 		TheXFer.setFieldValue('orderstatus', 'B'); 	//Set to Pending Fulfillment
	 	 		
	
	 	 		
	 	 		TheSavedXFer = nlapiSubmitRecord(TheXFer, true);
	 	 		//alert('Create is true. TheSavedXfer: ' + TheSavedXFer);
	 	 		
	 	 		//######################################################################
	 	 		for(var i = 0; i < LineNumArray.length; i++)

 	 			{
	 	 			TheCaseRecord.selectLineItem('recmachcustrecord_sr_case', LineNumArray[i]);
	 	 			TheCaseRecord.setCurrentLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',TheSavedXFer);
	 	 			TheCaseRecord.commitLineItem('recmachcustrecord_sr_case');
 	 			}

	 	 		
	 	 		nlapiLogExecution('DEBUG', 'The Saved XFer ID: ', TheSavedXFer);

	 	 		nlapiSubmitRecord(TheCaseRecord);	//Once all is said and done, pass the Case Record back to the main function
	 	 		return true;
 	}
 	catch (e)
 	{
 		nlapiLogExecution('DEBUG', 'Transfer Order Failed', 'An error has occurred whilst attempting to transfer the selected Item on line number ' + LineNum + ':\n' + e.message);
 		nlapiSubmitRecord(TheCaseRecord);
 	}
 	
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
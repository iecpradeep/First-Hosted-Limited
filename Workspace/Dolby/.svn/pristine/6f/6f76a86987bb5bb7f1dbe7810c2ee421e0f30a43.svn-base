/*******************************************************
 * Name:		Dolby Medical Master Client Script
 * Script Type:	Client Script
 * Version:		1.6.6
 * Date:		August 2011 - February 2012
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/


/*******************************************************
 * 
 *  Supplier Field Changed event
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 */
 function myFieldChanged(type, name, linenum)
{

	var TheValue = nlapiGetFieldValue(name);
	//var TheText = nlapiGetFieldText(name);
	//alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
	
	if (name == 'custentity_creditlimit')
		{
			var TheCreditLimit = 0;
			var NewCreditLimit = '';
			
			NewCreditLimit = nlapiLoadRecord('customrecord_creditlimit', TheValue);
			TheCreditLimit = NewCreditLimit.getFieldValue('custrecord_creditvalue');
			nlapiSetFieldValue('creditlimit', TheCreditLimit);
		}
	return true;

	if (name == 'custcol_item_number') {
		alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
		//custcol_num_of_episodes	- number of episodes
		//custcol_item_number	- item number
		//amount	- total licence fee

		//var numOfEpisodes = nlapiGetLineItemValue('item', 'custcol_num_of_episodes', linenum);
		//alert('Current line index: ' + linenum + ', current num of eps: ' + numOfEpisodes + ', name: ' + name);
		//nlapiSetLineItemValue('item', 'quantity', linenum, numOfEpisodes);
		//alert('');
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





/*************************************
 * 
 * Called when the Purchase Order is saved
 * 
 * 
 *************************************/



function OnSave()
{
	var sCurSign = '\u00A3';
	var TheSupplier;
	var PurchaseValue = 0;
	var MinValue = 0;
	var EntityID;
	var AllowZeroStatus = 'F';
	var RoleAllowed = false;
	var CurrentRole= parseInt(nlapiGetRole());
	
	var Roles = new Array();
	Roles[0] = 3;	//Administrator
	Roles[1] = 1032;	//DM Purchasing
	
	/***
	 *  Roles[2] = 1000; //Full Access
	 ***/	
	
	for(var I=0;I < Roles.length; I++)
	{
		if(CurrentRole == Roles[I])
		{
			RoleAllowed = true;
		}
	}
	
	try
	{
		EntityID = nlapiGetFieldValue('entity');
		TheSupplier = nlapiLoadRecord('vendor',EntityID);
		MinValue = TheSupplier.getFieldValue('custentity_minordervalue');
		AllowZeroStatus = nlapiGetFieldValue('custbody_allowzeropurchase');
	}
	catch (e)
	{
		alert('You must select a valid supplier before attempting to save this Purchase Order.');
		return false;
	}
	
	PurchaseValue= nlapiGetFieldValue('subtotal');
	//alert('subtotal:' + PurchaseValue);
	//alert('MinValue:' + MinValue);
	
	//alert('MinValue: ' +MinValue);
	//alert('PurchaseValue (Subtotal): ' + PurchaseValue);
	//nlapiLogExecution('DEBUG','MinValue', MinValue);
	
	PurchaseValue = parseFloat(PurchaseValue); //stupid javascript!
	if(MinValue == null||MinValue == "")
	{
		//alert('This Supplier does not have a Minimum Purchase Value.');
		nlapiLogExecution('DEBUG','No minimum purchase value has been entered for this supplier','information');
		return true;
	}
	MinValue = parseFloat(MinValue);
		
	if(PurchaseValue >= MinValue)
	{
		//alert('Correct.\n\nMinValue = ' + MinValue + '\n\nPurchaseValue = ' + PurchaseValue);
		return true;
	}
	else
	{
		if(PurchaseValue == 0)
		{
			if(AllowZeroStatus == 'T')
			{
				if(RoleAllowed == false)
				{
					//this is not ok...
					alert('You do not have permission to save this record with a Zero Value.\n\nThis order has not been saved.');
					return false;
				}
				else
				{
					return true;
				}
			}
			else
			{
				alert('In order to save this record with a Zero Value, the "Allow Zero Value Purchase" checkbox must be checked.\n\nThis order has not been saved.');
				return false;
			}
		}
		else
		{
			alert('The minimum order value for this supplier is ' + sCurSign +  MinValue.formatMoney(2,'.',',') + '\nThis Purchase Order is ' + sCurSign + PurchaseValue.formatMoney(2,'.',',') + '\n\nThis order has not been saved.');
			return false;	
		}
	}	
}


/*****************************************
 * Called when the Case's Field is changed
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 * 
 *****************************************/

function CaseFieldChanged(type, name, linenum)
{
	
	//only show for dolby6
	 if(nlapiGetUser() == '4')
	 {
	 
		return true;
		
		var TheValue = nlapiGetFieldValue(name);
		var TheText = nlapiGetFieldText(name);
		
		if(linenum == null)
		{
			alert('FieldChanged type = ' + type + '\nname = ' + name + '\nnvalue = ' + TheValue + '\ntext = ' + TheText);
		}
		else
		{
			if(type=='recmachcustrecord_sr_case')
			{
				alert(nlapiGetLineItemValue('recmachcustrecord_sr_case', name, linenum) + '\n\n' + nlapiGetLineItemText('recmachcustrecord_sr_case', name, linenum));
				//alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
			}
		}
	 }
 	else
	{
		return true;
	}
	
	
	return true;
	
	if((name=='custevent_contractcontractitem')||(name=='custevent_customercontractitem')||(name=='custevent_case_contractitem'))
	{	
		
		var TheValue = nlapiGetFieldValue(name);
		var TheText = nlapiGetFieldText(name);
		alert('FieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
	
		alert(name + ' changed!');
		//var TheSupplier;
		//TheSupplier = nlapiGetFieldValue(entity);
		//alert(TheSupplier);
		
		try 
		{
	
			//TheSupplier = nlapiLoadRecord('vendor',TheValue);
			
		//	var minValue =0;
			//minValue = TheSupplier.getFieldValue('custentity_minordervalue');
			//alert('Supplier loaded successfully!!!\n\nMin value = ' + minValue);
		} 
		catch (e) 
		{
			alert('error loading record');
		}
	}
	
	return true;
} 


/**********************************************
 * 
 * Called when the Sales Order's Field is changed
 * 
 * @param {Object} type
 * @param {Object} name
 * @param {Object} linenum
 * 
 **********************************************/


function SalesOrderFieldChanged(type, name, linenum)
{
	//only show for administrator
	/*if(nlapiGetRole() != '3')
		{
			return true;
		}
	*/

	
	if(name == 'custcol_parentcase')
	{
		
		//var ParentVal = nlapiGetCurrentLineItemValue('item', 'custcol_parentcase');
		
		//alert('Parent Value: ' + ParentVal);
		
	}
	
	if((name == 'custcol_customercase') ||(name == 'custcol_contractcase')) 
	{
	//this is not the preferential one...
		try
		{
			
			
	
			//var TheValue = nlapiGetFieldValue(name);
			//var TheText = nlapiGetFieldText(name);
			//alert('To not see these alerts, log out of the Adminstrator role.\n\n' + 'Type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum + '\nvalue = ' + TheValue + '\ntext = ' + TheText);
	
		
		
			var CustVal = 0;
			var ContVal = 0;
			var ParentVal = 0;
			
			ContVal = nlapiGetCurrentLineItemValue('item', 'custcol_contractcase');
			CustVal = nlapiGetCurrentLineItemValue('item', 'custcol_customercase');
			ParentVal = nlapiGetCurrentLineItemValue('item', 'custcol_parentcase');
			
			if(ParentVal == CustVal)
				{
				nlapiLogExecution('DEBUG','Same', ParentVal);
				
				}
			
			//alert('Contract Value: '  + ContVal + '\n\nCustomer Value: ' + CustVal + '\n\nParent Value: ' + ParentVal);
			
			//return true;
			
			
			if(ContVal == '' && CustVal == '')
			{
				nlapiSetCurrentLineItemValue('item','custcol_parentcase','', false, false);
			}
					
			if(ContVal != '')
			{
				nlapiSetCurrentLineItemValue('item','custcol_parentcase',ContVal, false, false);
			}
			else
			{
				nlapiSetCurrentLineItemValue('item','custcol_parentcase',CustVal, false, false);
			}
	}
		catch(e)
		{
			alert('Error whilst assigning the Parent Case (SalesOrderFieldChanged)\n\n' + e.message);
			
		}
	}
	return true;
}


/*************************************************
 * 
 *  When the Case is saved, call this function
 *  
 * 
 *************************************************/

function CaseSaved()
{
	 
	//only show for dolby6
// if(nlapiGetUser() == '4')
// {
	 var StockReqCount = 0;
	 var from_location = '28';
	 
	 StockReqCount = nlapiGetLineItemCount('recmachcustrecord_sr_case');
	 from_location = nlapiGetFieldValue('custevent_sr_from_location');
	 
	 
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
		
		var DoCreate = false;
		var DoFulFill = false;
		var Response = false;
		var DoTransfer = false;
		var XFerOrderID = 0;
		
		if(3 ==2)
			{
			alert(DoCreate + DoFulFill + DoTransfer + EmployeeID + ReqID);	
			
			}
		
		
		if(StockReqCount > 0)
			//alert('Entered For Loop for 1 and multiple.\n\nStockReqCount: ' + StockReqCount);
	
			for(var i=1; i <= StockReqCount; i++)
			{
				FulFillChecked = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_req_fulfilled', i);
				FulfillID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', i);
				XFerOrderID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid', i);
				
				//alert('In For Loop with I = ' + i + '.\nFulFillChecked: ' + FulFillChecked + '\n\nFulfillID: ' + FulfillID);
				
				//alert('XFerOrderID: ' +  XFerOrderID);
				
				if(XFerOrderID == null || parseInt(XFerOrderID) < 1 || XFerOrderID == '')
					{
						//alert('XFerOrderID is NULL or < 1');
						
						if(FulfillID.length == 0) //Not been fulfilled...
						{

							if(FulFillChecked == 'T')
								{
								//alert('(Not created) FulFillChecked is set to T on line ' + i);
								Response = CreateTransfer(i, true, false, from_location);
								if(Response == -1)
									{
									alert('Could not create Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
									return true;
									}
								else
									{
										nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_transferorderid', i, Response);
									}
								
								Response = CreateTransfer(i, false, true, from_location);
								
								if(Response == -1)
								{
									alert('Could not Fulfill the Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
									return true;
								}
								else
								{
									nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', i, Response);
								}
								
								
								
								}
							else
								{
								//alert('(Not created) FulFillChecked is not set to T on line ' + i);
								Response = CreateTransfer(i, true, false, from_location);
									if(Response == -1)
									{
										alert('Could not create the Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
										return true;
									}
									else
									{
									nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_transferorderid', i, Response);
									}
								}
							
						}
						else
							{
							alert('(not created!!) Transfer Order Fulfilled with fulfillid = ' + FulfillID + ' on line number ' + i);
							}						
						
					}
				else
					{
					
						if(FulfillID.length == 0) //Not been fulfilled...
							{
		
								if(FulFillChecked == 'T')
									{
									//alert('(Created?) FulFillChecked is set to T on line ' + i);
									//Response = CreateTransfer(i, true, false);
		
									Response = CreateTransfer(i, false, true, from_location);
									//alert('Create (false, true) ID: ' + Response);
									if(Response == -1)
									{
										alert('Could not Fulfill the Transfer Order.\n\nPlease make sure there is sufficient stock, and that you have sufficient permissions to execute it.');
										return true;
									}
									else
									{
									nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', i, Response);
									}
									
									}
								else
									{
									//alert('FulFillChecked: ' + FulFillChecked);
									//alert('(Created?) FulFillChecked is not set to T on line ' + i + '.\nWe shouldn\'t need to do anything here!');
									//Response = CreateTransfer(i, true, false);
									//nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', i, Response);
									//should already be there!
									
									}
								
							}
						else
							{
							//alert('Transfer Order Fulfilled with fulfillid = ' + FulfillID + ' on line number ' + i);
							}
					}
				
				if(Response == false)
					{
						alert('CreateTransfer(LineNume, Create, FulFill, from_location) failed for line num '+ i);
					}
					else
					{					
						//alert('Response for line num '+ i  +  ': ' + Response);
					}
				}
			}
		//}

	return true; 
	 
}

/************************************************
 * 
 * @param LineNum - ID of the Line the Item is on
 * @param Create - Whether to create the Transfer Order or not. DO NOT SET BOTH Create AND FulFill TO TRUE!!!
 * @param FulFill - Whether to Fulfill and Receive the Transfer Order or not. DO NOT SET BOTH Create AND FulFill TO TRUE!!!
 * @returns {Int} - Whether the Function was successful
 ************************************************/

function CreateTransfer(LineNum, Create, FulFill, FromLocation)
{
	/*
	 * custrecord_sr_item						Item ID
	 * custrecord_sr_qty						Item Quantity
	 * custrecord_sr_serialnumbers		Item Serial Numbers
	 * custrecord_sr_employee				Employee ID
	 * custrecord_sr_reason					Requisition Reason
	 * custrecord_sr_location				Location to Transfer to
	 * custrecord_sr_status					Requisition Status
	 * custrecord_sr_case						Related Case
	 * custrecord_sr_type						Stock type
	 * custrecord_sr_transferorderid		Transfer Order ID
	 * custrecord_req_fulfilled				Whether to Fulfill or not
	 * custrecord_fulfillmentid				Fulfillment ID
	 */
	
	var InDebug = true;
	var FulFillID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', LineNum);
	
	var TheToLocation = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_location', LineNum);			//Get To location from Stock Requisition
	var TheFromLocation = FromLocation;																					//Set From location
	var TheQuantity = nlapiGetLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_qty', LineNum);					//Get Quantity from Stock Requisition
	var TheItem = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_item', LineNum);						//Get Item from Stock Requisition
	var TheReason = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_reason', LineNum);					//Get Reason from Stock Requisition
	var TheEmployee = nlapiGetLineItemText('recmachcustrecord_sr_case','custrecord_sr_employee', LineNum);				//Get Employee from Stock Requisition
	var TheEmployeeID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_employee', LineNum);				//Get Employee from Stock Requisition
	var TheSerialNumbers = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', LineNum);	//Get Serial Numbers from Stock Requisition
	var TheFulfill = '';
	var TheSavedFulfill = '';
	var TheReceipt;
	var TheReceiptID = 0;
	var TheSavedXFer = 0;
	//Set the memo to be the employee etc
	var TheMemo = TheEmployee + ' initiated transfer.\nReason:\n' + TheReason;

	//this is to get rid of the warnings on Eclipse...
	if(2 ==3)
		{
		alert(InDebug + FulFillID + TheSavedFulfill + TheReceiptID);
		}
	
	
 	try
 	{
 	
 		//alert('Got to CreateTransfer! LineNum ' + LineNum);
 		
		//error handling...
		// *******************************************************
		if((TheToLocation.length == 0) || (TheToLocation == TheFromLocation))
			{
				alert('You cannot chose this location to transfer stock in to.\n\nPlease retry the operation.\n\n' + TheToLocation);
				return -1;
			}


		if(trim(TheReason) == '')
		{
			alert('You must enter a reason for this Stock Requisition.\n\n' + TheReason.length);
			return -1;			
		}
		
		
		// *******************************************************
 		
 		var x = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid', LineNum);
 		//alert('Line Number ' + LineNum + '\'s Transfer Order is: ' + x);
 		if(x == null || x.length != 0)
 			{
 			//alert('You have already created a Transfer Order from this request.\n\nAs other transactions are created off this record, it can no longer be modified.\n\nPlease contact support for more information.');
 			//alert('x != null');	
 			//return -1;
 			}
 		
 		
 		if(Create == true)
 			{
 			
 				//alert('Create is true. linenum is ' + LineNum);
 	 		
	 	 		TheXFer = nlapiCreateRecord('transferorder');
	 	 		
	 	 		TheXFer.setFieldValue('transferlocation', TheToLocation.toString());
	 	 		TheXFer.setFieldValue('location', TheFromLocation);
	 	 		TheXFer.setFieldValue('custrecord_sr_qty', TheQuantity);
	 	 		TheXFer.setFieldValue('memo', TheMemo);
	 	 		TheXFer.setFieldValue('employee', TheEmployeeID);
	 	 		
	 	 		TheXFer.selectNewLineItem('item');
	 	 		TheXFer.setCurrentLineItemValue('item','item',TheItem); 
	 	 		TheXFer.setCurrentLineItemValue('item', 'quantity', TheQuantity);
	 	 		
	 	 		if(TheSerialNumbers != null)
	 	 			{
	 	 		 		TheRec.setCurrentLineItemValue('item', 'serialnumbers', TheSerialNumbers);	
	 	 			}
	
	 	 		TheXFer.commitLineItem('item');   		
	 	 		TheXFer.setFieldValue('orderstatus', 'B'); 	//Set to Pending Fulfillment
	 	 		
	
	 	 		
	 	 		TheSavedXFer = nlapiSubmitRecord(TheXFer, true);
	 	 		//alert('Create is true. TheSavedXfer: ' + TheSavedXFer);
	 	 		
	 	 		//######################################################################
	 	 		nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',LineNum, TheSavedXFer);
	 	 		
	 	 		//nlapiSetLineItemValue(type, fldnam, linenum, value)
	 	 		//nlapiCommitLineItem('recmachcustrecord_sr_case');
	 	 		
	 	 		return TheSavedXFer;
 			
 			
 			}
 		else
 			{
 				//alert('Create is not true. Set to ' + Create);
 			}
 		
 		if(FulFill == true)
 			{
 			//need to get the TransferOrderID here so we can Fulfill and Receive it.
 			
 			//alert('FulFill is true. Linenum is ' + LineNum);
 			
 			if(TheSavedXFer == 0)
 				{
 				TheSavedXFer = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',LineNum);
 				//alert('Creating Fulfillment...TheSavedXFer Was 0, now: ' + TheSavedXFer);
 				}
 			
 			
 	 		TheFulfill = nlapiTransformRecord('transferorder', TheSavedXFer, 'itemfulfillment', null);
 	 		
 			TheFulfill.setLineItemValue('item', 'itemreceive', 1, 'T');
 			TheFulfill.setFieldValue('shipstatus', 'C');
 			TheFulfill.setFieldValue('custbody_ordetype', 3);
 			TheFulfill.setFieldValue('memo',TheMemo);
 	 		
 	 		TheSavedFulfill = nlapiSubmitRecord(TheFulfill, true);
 	  		TheReceipt = nlapiTransformRecord('transferorder', TheSavedXFer, 'itemreceipt', null);
 			
 			for(var ic = 1; ic<= TheReceipt.getLineItemCount('item'); ic++)
 			{
 				TheReceipt.setLineItemValue('item', 'itemreceive', ic, 'T');
 			}
 			TheReceipt.setFieldValue('custbody_ordetype', 3);
 			
 			TheReceipt.setFieldValue('custbody_receivedbylist', '6');	//Hard coded for now as the Received By list is a **custom list**(!)

 			TheReceiptID = nlapiSubmitRecord(TheReceipt, true);
 			
 			
 			return TheSavedFulfill;
 			}
 		else
 			{
 				//alert('FulFill is not true. Set to ' + FulFill);
 			}
 		
 		//if it got this far then ace!
 		//return -1;
 		
 	}
 	catch (e)
 	{
 		alert('An error has occurred whilst attempting to transfer the selected Item on line number ' + LineNum + ':\n' + e.message);
 		return -1;
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

/***********************************************************************
 * 
 * Create a single Transfer Order with mulitple Stock Requisitions, 
 * but only add the ones which are not already part of a Transfer Order
 * 
 * @param type
 * 
 ***********************************************************************/
function OnSaveCaseXferOrder()
{
	//only show for dolby6
	//if(nlapiGetUser() == '4')
	//{
		
		//alert('Dolby6 started...');
		
		
		var StockReqCount = 0;
		var StockHasTO = 0;
		//var InDebug = true;
		//var FulFillID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_fulfillmentid', LineNum);
		
		var TheToLocation = 0;//nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_location', LineNum);			//Get To location from Stock Requisition
		var TheFromLocation = '28';																								//Set From location
		var TheQuantity = 0; //nlapiGetLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_qty', LineNum);				//Get Quantity from Stock Requisition
		var TheItem = 0;//nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_item', LineNum);						//Get Item from Stock Requisition
		var TheEmployeeID = 0; //nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_employee', 1);				//Get Employee from Stock Requisition. must be the same as the rest.
		var TheSerialNumbers = 0;//nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', LineNum);	//Get Serial Numbers from Stock Requisition
		var TheSavedXFer = 0;
		var TheMemo = 'Transfer Order created from Stock Requisition script on the Case form.';
		 var TheXFer = '';
		 
		 StockReqCount = nlapiGetLineItemCount('recmachcustrecord_sr_case');
		
		 for(var i=1;i <=StockReqCount; i++)
			 {
			 TheSavedXFer = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',i);
			 if(TheSavedXFer == '' || TheSavedXFer == null)
				 {
					 //alert('Doesnt have XFerID! '+ TheSavedXFer);
					 StockHasTO++;
				 }
			 else
				 {
				 	//alert('Does have XFerID' + TheSavedXFer);
				 	
				 }
			 }
		 
		 
		 
		 
		 if(StockHasTO == 0)
			 {
			 //No Transfer Orders need creating :)
			 //alert('No stock needs Transfer Order Creation...');
			 return true;
			 }
		 else
			 {
			 try
			 {
				TheEmployeeID = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_employee', 1);
				TheToLocation = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_location', 1); 	//Get To location from Stock Requisition. Must be the same as all others
				TheXFer = nlapiCreateRecord('transferorder');
				TheXFer.setFieldValue('transferlocation', TheToLocation.toString());
				TheXFer.setFieldValue('location', TheFromLocation);
				TheXFer.setFieldValue('custrecord_sr_qty', TheQuantity);
				TheXFer.setFieldValue('memo', TheMemo);
				TheXFer.setFieldValue('employee', TheEmployeeID);
			 }
			 catch(e)
			 {
				 nlapiLogExecution('Error', 'Error creating Transfer Order', 'Error message: ' + e.message);
				 alert('Error creating Transfer Order Error message: ' + e.message);
			 }
			 
			 try
			 {
				TheXFer.setFieldValue('orderstatus', 'B'); 	//Set to Pending Fulfillment
			 }
			 catch(e)
			 {
				 nlapiLogExecution('Error', 'Error changing orderstatus to B Transfer Order', 'Error message: ' + e.message);
				 alert('Error changing orderstatus to B Transfer Order. Error message: ' + e.message);
			 }

			 //for loop to go through all the ones that need to be on the Transfer Order then...
			 try
			 {
				for(var i = 1; i <= StockReqCount; i++)
				 {
				 TheSavedXFer = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',i);
				 
				 if(TheSavedXFer != '' || TheSavedXFer != null)
					 {
					 	//get values from the Items sublist...
						TheQuantity = nlapiGetLineItemValue('recmachcustrecord_sr_case', 'custrecord_sr_qty', i);					//Get Quantity from Stock Requisition
						TheItem = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_item', i);						//Get Item from Stock Requisition
						//alert(TheItem);
						TheReason = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_reason', i);					//Get Reason from Stock Requisition
						TheSerialNumbers = nlapiGetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_serialnumbers', i);	//Get Serial Numbers from Stock Requisition
					 
						//add to Transfer Order
			 	 		TheXFer.selectNewLineItem('item');
			 	 		TheXFer.setCurrentLineItemValue('item','item',TheItem); 
			 	 		TheXFer.setCurrentLineItemValue('item', 'quantity', TheQuantity);
			 	 		
			 	 		if(TheSerialNumbers != null)
			 	 			{
			 	 		 		TheRec.setCurrentLineItemValue('item', 'serialnumbers', TheSerialNumbers);	
			 	 			}

		 	 			TheXFer.commitLineItem('item');   
		 	 			nlapiSetLineItemValue('recmachcustrecord_sr_case','custrecord_sr_transferorderid',i, TheSavedXFer);
					 
					 }
				 }
			 }
			 catch(e)
			 {
				 //failed.
				 nlapiLogExecution('ERROR','Couldnt add line item to Transfer Order',e.message);
				 alert('Error Couldnt add line item to Transfer Order. Error message: ' + e.message);
			 }

			 try
			 {
				  TheSavedXFer = nlapiSubmitRecord(TheXFer, true);
			 }
			 catch(e)
			 {
				 //failed.
				 nlapiLogExecution('ERROR','Could not save Transfer Order',e.message);
				 alert('Error Could not save Transfer Order. Error message: ' + e.message);
			 }
			 //var TheDate = new Date();
			 //nlapiLogExecution('DEBUG','Finished DM Client Transfer Order Creation.', TheDate.toUTCString());
			 //alert('Finished DM Client Transfer Order Creation.\n\n' + TheDate.toUTCString());
		}
	//}	 
return true;
}

function OnSaveCER()
{
	try
	{
		var TheName = nlapiGetFieldValue('name');
		nlapiSetFieldValue('custrecord_citem_serial', TheName);
		return true;
	}
	catch(e)
	{
		alert('Error saving Customer Equipment Record: ' + e.message);	
	}	
}


Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
   return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
   };
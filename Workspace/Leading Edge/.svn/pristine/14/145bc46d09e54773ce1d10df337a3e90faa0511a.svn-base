/*******************************************************
 * Name:		Leading Edge script
 * Script Type:	Javascript
 * Version:		1.2.0
 * Date:		05 May 2011 - 29th June 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/


function myPageInit(type)	//customer form
{	
	nlapiSetFieldValue('parent','7',false, false);

	//var cn = nlapiGetFieldValue('parent');
	//alert('myPageInit type=' + type + '\n' + cn);
}

function DefaultLineItem()
{
	
	try
	{
		//check to see if there's any line items in there first...
		var lineitemcount = nlapiGetLineItemCount('item');
	
		if(lineitemcount == 0)
		{
			// add new lines to a sublist
			nlapiSelectNewLineItem('item');
		
			// set the item and location values on the currently selected line
			nlapiSetCurrentLineItemValue('item', 'item', 1275);	//1275 is the Default Line Item...........
		
			// commit the line to the database
			nlapiCommitLineItem('item');
		}
	}
	catch(e)
	{
		alert('Deafult Line Item Error: ' + e.message);
	}
	return true;
}




function SAPageInit(type)	//customer form
{	
	//nlapiSetFieldValue('parent','7',false, false);

	//var cn = nlapiGetFieldValue('parent');
	if(nlapiGetUser() == '3')
	{
		alert('Welcome Administrator!\n\nPlease be aware that this role causes many test scripts to run.');
	}
	//alert('Version 1.90 debugging mode is on.\n\nmyPageInit type=' + type + '\nUserID= ' + nlapiGetUser());
}

function SASaveRecord()
{	
	alert('SASaveRecord');	
	return true;
} 

function SAValidateField(type, name, linenum)
{	
	//if(name == 'parent')	
	//{		
	//var cn = nlapiGetFieldText('parent');
	alert('myValidateField type=' + type + '\nname=' + name + '\nlinenum=' + linenum); // + '\nparent=' + cn);	
	//}	
return true;
}

function SAFieldChanged(type, name, linenum)
{
	//DEBUG ******
	//alert('SAFieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum);
	
	if((name =='custcol_contractvalue') || (name == 'quantity'))
	{
		
	//nlapiSetCurrentLineItemValue('item','amount',9469,false,false);
	//nlapiSetFieldValue('amount',10000,false,false);
	//if (parseInt(nlapiGetUser()) == 3) {
	//alert('SAFieldChanged type = ' + type + '\nname = ' + name + '\nlinenum = ' + linenum);
	//}
		SACalculateRateCardGP();
	//	}
	//	else
	//	{
	//		SACalculateGP(type, name, linenum);
	//	}
			
	}
	
	
	
	if ((name == 'item') && (type == 'item'))
	{
		var TheItem = nlapiGetCurrentLineItemValue('item','item');
		
		nlapiSetFieldValue('custbody_itemid',TheItem, false, false);
		
		//alert('ITEM ITEM FIELD CHANGED!!!!\n\n\n\nThe Item record is here: ' + TheItem);
		
	}
} 
	
function SAPostSourcing(type, name)
{	
	alert('SAPostSourcing type=' + type + ', name=' + name);
} 

function SALineInit(type)
{	
	alert('SALineInit type=' + type);
}

function SAValidateLine(type)
{	
	alert('SAValidateLine type=' + type);
return true;
}

function SAValidateInsert(type)
{	
	alert('SAValidateInsert type=' + type);
} 

function SAValidateDelete(type)
{	
	alert('SAValidateDelete type=' + type);
} 

function SARecalc(type)
{	
	alert('SARecalc type=' + type);
}

function SACalculateGP(linenum, itemID)
{
	//need hidden field to hold the ItemID value!!!!!!!!!!!!!
	
	try {
		var TheItemID = nlapiGetFieldValue('custbody_itemid');
		//alert('ItemID = ' + TheItemID);
		
		var theItem;
		var itemType = 'Inventory Item';
		
		if(TheItemID == '1275')	//This is hard coded in, as the 1275 is the only non-service item in there atm.
		{
			theItem = nlapiLoadRecord('noninventoryitem', TheItemID);
			itemType = 'Non-Inventory Item';
		}
		else
		{
			theItem = nlapiLoadRecord('serviceitem', TheItemID);
			itemType = 'Service Item';
		}

		//alert(itemType + ' loaded');		
		
		var TheDate = nlapiGetFieldValue('trandate');

		
		if(TheDate.length == 0)
		{
			var myDate = new Date();
			nlapiSetFieldText('trandate', myDate.getDate(),false,false);
			TheDate = nlapiGetFieldText('trandate');
		}
		else{
			//alert(TheDate);	
		}
			
		var ArDate = TheDate.split("/");
		var TheRate = 0;
		
		//alert('TheDate: ' + TheDate);
		//alert('ArDate: ' + ArDate[1]);
		switch(ArDate[1])
		{
			case '1':
				TheRate = theItem.getFieldValue('custitem_jan');
				break;
			case '2':
				TheRate = theItem.getFieldValue('custitem_feb');
				break;
			case '3':
				TheRate = theItem.getFieldValue('custitem_mar');
				break;
			case '4':
				TheRate = theItem.getFieldValue('custitem_apr');
				break;
			case '5':
				TheRate = theItem.getFieldValue('custitem_may');
				break;
			case '6':
				TheRate = theItem.getFieldValue('custitem_jun');	
				break;
			case '7':
				TheRate = theItem.getFieldValue('custitem_jul');	
				break;
			case '8':
				TheRate = theItem.getFieldValue('custitem_aug');
				break;
			case '9':
				TheRate = theItem.getFieldValue('custitem_sep');
				break;
			case '10':
				TheRate = theItem.getFieldValue('custitem_oct');
				break;
			case '11':
				TheRate = theItem.getFieldValue('custitem_nov');
				break;
			case '12':
				TheRate = theItem.getFieldValue('custitem_dec');
				break;
			default:
				alert('Unsupported month: ' + ArDate[1]);
				break;
		}			
			
		var GP = 0;
		if(TheRate.length == 0)
		{
			alert('No rate is available for this month on the item you have selected.');
		}
		else
		{
			//alert('The rate for this is: ' + TheRate);
			var TheQty = nlapiGetCurrentLineItemValue('item', 'quantity');
			var TheValue = nlapiGetCurrentLineItemValue('item', 'custcol_contractvalue');
			
			if(TheRate >=1)
			{
				//alert('Actual Rate of ' + TheRate);
				//actual rate
				GP = TheQty * TheRate;
			}
			else
			{
				//alert('Percentage Rate of ' + TheRate)
				//percentage
				GP = TheValue * TheRate;
			}
			
			nlapiSetCurrentLineItemValue('item','amount',GP,false,false);
			nlapiSetCurrentLineItemValue('item','altsalesamt',GP,false,false);		
		}
		//alert('The Item: ' + theItem + '\nname = ' +name + '\nlinenum = ' + linenum + '\ntype = ' + type);
	} 
	catch (e)
 	{
		alert('Error calculating the GP: ' + e);	
	}
}




function inboundJournal(totalValue)
{
	
	var journalRecord = nlapiCreateRecord('journal');
	
	var today = nlapiDateToString(new Date());
	
	
	// set header fields
	journalRecord.setFieldValue('trandate',today);
	journalRecord.setFieldValue('reversaldefer','F');
	
	// set line item credit (total value)
	journalRecord.selectNewLineItem('line');
	journalRecord.setCurrentLineItemValue('line','account',380);
	journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
	journalRecord.commitLineItem('line');   
	
	
	// set line item debit (cash value)
	journalRecord.selectNewLineItem('line');
	journalRecord.setCurrentLineItemValue('line','account',380);
	journalRecord.setCurrentLineItemValue('line','debit',parseFloat(cashValue));
	journalRecord.commitLineItem('line');           
	
	
	
	id = nlapiSubmitRecord(journalRecord,true);
	
	return true;
      
} //function createJournal



function OnSave_UpdatePrices()
{
	
	// load an item record
	//var record = nlapiLoadRecord('inventoryitem', 536);
	var theRecord = nlapiLoadRecord('inventoryitem',nlapiGetRecordId());
	
	//alert(nlapiGetRecordId());
	
	//theRecord.setLineItemValue('price1', 'price', '1', 999);
	//theRecord.setLineItemValue('price1', 'price', '3', 2999);
		
		
	//Set the pricing matrix header field (Qty) in the second column to 600

	//nlapiSetMatrixValue('price1', 'price', '2', 600);    


	//Set values on line one. First you must select the line, then set all values,
	//then commit the line.

	var SalesPrice = theRecord.getFieldValue('custitem_salesprice');
	var TWWLPrice = theRecord.getFieldValue('custitem_twwlprice');
	var TradePrice = theRecord.getFieldValue('custitem_tradeprice');
	var OnlinePrice = theRecord.getFieldValue('custitem_onlineprice');
	
	
	//Sales Price
	nlapiSelectLineItem('price1', '1'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 
		
	//TWWL
	nlapiSelectLineItem('price1', '2'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1');
	
	//Trade Price
	nlapiSelectLineItem('price1', '3'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 
		
	//Online Price
	nlapiSelectLineItem('price1', '4'); 
	nlapiSetCurrentLineItemMatrixValue('price1', 'price', 1, '11'); 
	nlapiCommitLineItem('price1'); 	
	//nlapiSubmitRecord(theRecord,false,false);
	
	return true;

	
}


function SACalculateRateCardGP()
{	
//	if(nlapiGetUser() == 3)
//	{
		//User ID = 3
		//alert('Paul Tindal detected.');
//	}
//	else
//	{
//		alert('You cannot run the Rate Card code at this time as it is retricted to UserID 3');
//		return true;		
//	}
	
	var TheItemID = '';
	
	var RateCardID = 0;
	var RateCard = '';
	var RateDate = '';
	var RateYear = '';

	var TranDate = '';
	var TheRate = 0;
	
	try 
	{
		
		//get ItemID
		TheItemID = nlapiGetFieldValue('custbody_itemid');
		
		if(TheItemID == null || TheItemID == '1275')
		
		{
			alert('The Rate for this Item cannot be calculated at the moment as the Item specified is invalid.\nID:' + TheItemID);
			return true;
		}		

		//InternalID of the Record = customrecord_ratecard
			
		//get trandate
		TranDate = nlapiGetFieldValue('trandate');
					
		if (TranDate.length == 0) 
		{	//we need to set the TranDate to today now.
			nlapiSetFieldValue('trandate', nlapiDateToString(new Date()));
			TranDate = new Date();
		}
		else 
		{
			TranDate = nlapiStringToDate(TranDate);
		}
		
		//get rate month
		RateMonth = TranDate.getMonth();
		
		//get rate year
		RateYear = TranDate.getFullYear();
		
		//If it's Jan Feb or Mar, decrement 1 from the Year
		if(RateMonth < 3)
		{
			RateYear = RateYear - 1;	
		}
		
		
		
		//alert('RateYear: ' + RateYear);
		
		var RateFilter = new Array();
		RateFilter[0] = new nlobjSearchFilter('custrecord_ratecard_year', null, 'is', parseInt(RateYear));
		RateFilter[1] = new nlobjSearchFilter('custrecord_ratecard_item', null, 'is', TheItemID);

	   
		var RateColumn = new Array();
		RateColumn[0] = new nlobjSearchColumn('name');
		RateColumn[1] = new nlobjSearchColumn('custrecord_ratecard_year');
		RateColumn[2] = new nlobjSearchColumn('custrecord_ratecard_item');
   		RateColumn[3] = new nlobjSearchColumn('internalid');
	   
	   var SearchResults = nlapiSearchRecord('customrecord_ratecard', null, RateFilter, RateColumn);
	   
	   if(SearchResults == null)
	   {
			alert('No Rate Card for this Item currently exists.\n\nPlease notify your System Administrator.');
	   		return true;
	   }

   		for(var i=0;i<SearchResults.length;i++)
		{
			if(SearchResults[i].getValue('custrecord_ratecard_year') == RateYear)
			{
				RateCardID = SearchResults[i].getValue('internalid');
				//alert('Internal ID Test: ' + SearchResults[i].getId());
				//alert('Rate is equal to the Rate Year!!!!\n\nInternal ID: ' + RateCardID);
			}
		//Debug code...
		//	else
		//	{
			//	alert('Results count: ' + SearchResults.length + '\n\nPos ' + i + ' Name:' + SearchResults[i].getValue('name') + '\n\nPos ' + i + ' Year:' + SearchResults[i].getValue('custrecord_ratecard_year') + '\n\nTranDate Year: ' + RateYear);
		//	}
		}
			if(RateCardID == 0)
			{
				alert('WARNING:\n\nThere are no Rate Cards for this Item for this financial year.\n\nPlease contact your Administrator immediately.');
				return true;
			}
	//		else
	//		{
	//			alert('YES!! here: ' + RateCardID);
	//		}
			
		//alert('Results count: ' + SearchResults.length + '\n\nPos 0:' + SearchResults[0].getValue('name') + '\n\nPos 1:' + SearchResults[1].getValue('name'));

		
		//open the record
		RateCard = nlapiLoadRecord('customrecord_ratecard', RateCardID);		
		
		//do the calc etc		
		
		//alert('got to end');
		//	return true;

		

		switch(RateMonth)
		{
			case 0:
			case '0':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_january');
				break;
			case 1:
			case '1':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_february');
				break;
			case 2:
			case '2':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_march');
				break;
			case 3:
			case '3':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_april');
				break;
			case 4:
			case '4':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_may');
				break;
			case 5:
			case '5':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_june');	
				break;
			case 6:
			case '6':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_july');	
				break;
			case 7:
			case '7':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_august');
				break;
			case 8:
			case '8':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_september');
				break;
			case 9:
			case '9':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_october');
				break;
			case 10:
			case '10':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_november');
				break;
			case 11:
			case '11':
				TheRate = RateCard.getFieldValue('custrecord_ratecard_december');
				break;
			default:
				alert('Unsupported month: ' + RateMonth);
				break;
		}			
			
		var GP = 0;
		if(TheRate.length == 0||TheRate == '0'||TheRate == 0)
		{
			nlapiSetCurrentLineItemValue('item','amount',GP,false,false);
			nlapiSetCurrentLineItemValue('item','altsalesamt',GP,false,false);		
			alert('No rate is available for this month on the item you have selected, or it is a zero-rated item for this month.');
		}
		else
		{
			//alert('The rate for this is: ' + TheRate);
			var TheQty = nlapiGetCurrentLineItemValue('item', 'quantity');
			var TheValue = nlapiGetCurrentLineItemValue('item', 'custcol_contractvalue');
			
			if(TheRate >=1)
			{
				//alert('Actual Rate is: ' + TheRate + '\nTheRate: ' + TheRate);
				//actual rate
				GP = TheQty * TheRate;
			}
			else
			{
				//alert('Percentage Rate of ' + TheRate)
				//percentage
				GP = TheValue * TheRate;
			}
			
			nlapiSetCurrentLineItemValue('item','amount',GP,false,false);
			nlapiSetCurrentLineItemValue('item','altsalesamt',GP,false,false);		
		}
		//alert('The Item: ' + theItem + '\nname = ' +name + '\nlinenum = ' + linenum + '\ntype = ' + type);
	} 
	catch (e)
 	{
		alert('WARNING:\n\nError calculating the GP: ' + e + '\n\nPlease contact your System Administrator immediately.');	
	}
}


function MessageBox(Data, Title)
{
	if(Title)
	{
		alert(Title + '\n\n' + Data);	
	}
	else
	{
		alert(Data);
	}
	
}

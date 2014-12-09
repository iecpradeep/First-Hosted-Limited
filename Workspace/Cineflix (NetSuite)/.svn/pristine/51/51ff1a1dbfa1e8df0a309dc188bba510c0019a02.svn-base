/*****************************************************************************************************
 * Name: Cineflix Client script (itemFunctions.js)
 * Script Type: Client
 * Client: Cineflix
 * 
 * Version: 1.0.0 - 02 Feb 2011 - 1st release - PAL
 * 			 2.0.1 - 08 Nov 2011 - PAL
 * 			 3.0.0 - August 2012 - PAL
 * 			 3.1.0 - 22nd February 2013 - PAL
 * 					 - Case S4461 - Remove validation on Pending and Verbal
 *
 * Author: FHL
 * Purpose: Client functions to assist in validation and calculation of Cineflix's Netsuite Implementation
 * 
 * Script: n/a
 * Deployment: n/a
 * 
 * Sandbox URL: n/a
 * Production URL: n/a
 ******************************************************************************************************/

function onsave_FillQuarterDetails()
{
	// Declare variables
	var ItemInternalID = 0;
	var ItemRecord = '';
	var ItemIPRights = 0;
	var TXTypeOfSale = 0;

	try
	{

		//get internal id of the item you wish to load
		ItemInternalID = nlapiGetFieldValue('custbody_purchaseitem');
		//load item record
		ItemRecord = nlapiLoadRecord('noninventoryitem',ItemInternalID);
		//get up rights value from the item
		ItemIPRights = ItemRecord.getFieldValue('custitem_iprights');
		//get the custbody_type_of_sale value
		TXTypeOfSale = nlapiGetFieldValue('custbody_type_of_sale');


		if(TXTypeOfSale == null || TXTypeOfSale == '')
		{
			alert('You must select a Type of Sale before attempting to save this record.');
			return false;
		}
		//do case statements
		switch(String(ItemIPRights))
		{
		case '1':
			if(TXTypeOfSale == '2' || TXTypeOfSale == '3' )
			{
				alert("You have selected Cineflix Acquired IP with either Library or Pre-sale.\nThis is not a valid combination." );
				return false;
			}
			break;
			
		case '2':
			if(TXTypeOfSale == '2' || TXTypeOfSale == '3')
			{
				alert("You have selected 3rd Party IP with either Library or Pre-sale.\nThis is not a valid combination." );
				return false;
			}
			break;
			
		case '3':
			if(TXTypeOfSale == '1' )
			{
				alert("You have selected Cineflix IP with 3rd Party.\nThis is not a valid combination." );
				return false;
			}
			break;
			
		default:
			//should not get here, or nothing is selected in the item itself
			alert('An unhandled code execution path has been found.\n\nItemIPRights: ' + ItemIPRights);
			break;
		}
	}
	catch(e)
	{
		alert('An error occurred whilst attempting to check the IP Rights and Type of Sale.\n\nError: ' + e.message);
	}

	try
	{
		var NumOfItems = nlapiGetLineItemCount('item');

		if(NumOfItems >= 1)
		{
			//copy the first lineitem's name to "title to purchase" field for reporting purposes
			var TheSelectedItem = nlapiGetLineItemValue('item', 'item', 1);

			//alert('Item line num 1:\n\n' + TheSelectedItem);
			//nlapiSetFieldText('custbody_purchaseitem',TheSelectedItem,false,false);
			nlapiSetFieldValue('custbody_purchaseitem',TheSelectedItem,false,false);
			//alert('Test: ' + nlapiGetFieldValue('custbody_purchaseitem'));
		}
		else
		{
			//no line items in this record
			alert('No line items on this record. Number: ' + NumOfItems);
		}

	}
	catch(e)
	{
		alert('An error occurred whilst writing the Title to Purchase field.\n\nError: ' + e.message);
	}


	try
	{
		if (nlapiGetRecordType() == 'estimate') 
		{

			var ThisStatus = nlapiGetFieldValue('entitystatus');

			var ThisEndDate = nlapiGetFieldValue('enddate');
			var ThisEndDateLen = ThisEndDate.length;

			var ThisExpectedLFStart = nlapiGetFieldValue('custbody_expected_licence_fee_start_dt');
			var ThisLFLen = ThisExpectedLFStart.length;

			//alert('End Date Len: ' + ThisEndDateLen);
			//alert('LFStart Len: ' + ThisLFLen);
			//alert('Estimate Status: ' + ThisStatus);	
			//remove ThisStatus == 8 || 
			if(ThisStatus == 18)
			{
				//exempt
				//alert('Do not need to make the fields mandatory here...');
			}
			else
			{
				//not exempt
				//alert('They need to be mandatory...');


				if(ThisEndDateLen == 0)
				{
					alert('You must ensure you have selected a valid Expected Close Date before continuing.');
					return false;
				}

				if(ThisLFLen == 0 )
				{	
					//Case S3642
					//Case S4461
					if((ThisStatus == 8) || (ThisStatus == 19)|| (ThisStatus == 10)|| (ThisStatus == 11))
					{
						//ignore
					}
					else
					{
						alert('You must ensure you have selected a valid Expected Licence Period Start Date before continuing.');
						return false;
					}
				}		
			}



			var TheCompany = nlapiGetFieldText('entity');
			if (TheCompany == '') 
			{
				//something up
				alert('This Estimate cannot be saved without a Client associated with it.');
				return false;
			}
			else {
				nlapiSetFieldValue('title', TheCompany, false, false);
			}
		}	

		if (nlapiGetRecordType() == 'salesorder') 
		{
			var TheCompany = nlapiGetFieldText('entity');
			if (TheCompany == '') 
			{
				//something up
				alert('This Deal cannot be saved without a Client associated with it.');
				return false;
			}
			else {
				nlapiSetFieldValue('title', TheCompany, false, false);
			}
		}	

		if (nlapiGetRecordType() == 'opportunity') 
		{
			//alert('Opportunity');
			var lineNum = nlapiGetLineItemCount('item');
			//alert('The line item count for Items is: ' + lineNum);

			if(lineNum == 0)
			{
				alert('This Opportunity cannot be saved without selecting a Title first.');
				return false;

			}

			/*
			var fPurchaseItemValue = nlapiGetFieldValue('custbody_purchaseitem');
			var fPurchaseItemText = nlapiGetFieldText('custbody_purchaseitem');
			//alert('value: ' + fPurchaseItemValue + '\n\nText: ' + fPurchaseItemText);

			if(fPurchaseItemText.length==0)
			{
				alert('You must select a Title before you can save this Opportunity.');	
				return false;
			}
			 */




			var TheCompany = nlapiGetFieldText('entity');
			if (TheCompany == '') 
			{
				//something up
				alert('This Opportunity cannot be saved without a Client associated with it.');
				return false;
			}
			else 
			{
				nlapiSetFieldValue('title', TheCompany, false, false);
			}
		}	
	}
	catch(ex)
	{
		alert('The following error was returned whilst trying to save the record:\n\n' + ex.message);
	}

	try
	{		
		var dtexpectedclosedate;

		if ((nlapiGetRecordType() == 'estimate') || (nlapiGetRecordType() == 'salesorder')) 
		{
			dtexpectedclosedate = nlapiGetFieldValue('enddate');	
		}
		else
		{
			dtexpectedclosedate = nlapiGetFieldValue('expectedclosedate');			
		}


		var dttrandate = nlapiGetFieldValue('trandate');
		var dtexpectedfeestartdt = nlapiGetFieldValue('custbody_expected_licence_fee_start_dt');

		if(dtexpectedclosedate.length === null)
		{

			alert('You have not selected an Expected Close Date!');
			return false;	
		}	
		else
		{
			nlapiSetFieldValue('custbody_expected_close_quarter', getQuarter(dtexpectedclosedate.toString()) ,false,false);
			nlapiSetFieldValue('custbody_quarter_initiated', getQuarter(dttrandate.toString()) ,false,false);
			nlapiSetFieldValue('custbody_quarter_expected_lic_fee_dt', getQuarter(dtexpectedfeestartdt.toString()) ,false,false);
			//return true;
		}




		/*
		//This is the Rejected Status logic...
		alert('Rejected Status Logic...');
		alert('entitystatus: ' + nlapiGetFieldValue('entitystatus'));
		alert('Rejected Reason: ' + nlapiGetFieldValue('custbody_rejected_reason'));
		alert('Entered Rejection: ' + nlapiGetFieldValue('custbody_rejected_reason_other'));
		 */

		if (nlapiGetFieldValue('entitystatus') == "18")
		{
			if (nlapiGetFieldValue('custbody_rejected_reason') == "6")
			{
				if (nlapiGetFieldValue('custbody_rejected_reason_other') == '')
				{
					alert('You have not entered a rejected reason.\nYou must enter one before continuing.');
					return false;
				}
				else
				{
					//That's ok
				}
			} //if
			else
			{
				//alert('Getting value of rejected reason: ' + nlapiGetFieldValue('custbody_rejected_reason'));
				if (nlapiGetFieldValue('custbody_rejected_reason') == '') 
				{
					alert('You have not selected a valid rejected reason.');
					return false;
				}
				else
				{

				}
			} 
		} //if
		else
		{

		} //rejected status logic
	} //if
	catch(exception)
	{
		alert('An error has occurred.\nPlease retry the operation.\n(FillQuarterDetails)\n' + exception);
		return false;
	}
	return true;
}

function getQuarter(CloseDate)

//This is the logic for the Quarters information...

{
	try
	{
		var dateStr = CloseDate.split("/");
		//var xDate = new Date(CloseDate);
		var theValue = '';
		var theMonth = parseInt(dateStr[1]);
		var theYear = parseInt(dateStr[2]);


		//alert('The Year = ' + theYear + '\nThe Month = ' + theMonth);
		if(theYear <= 2010)
		{
			switch(theMonth)
			{

			// Quarter 3 Feb Mar Apr
			case 2:
			case 3: 
			case 4:
				theValue = 'Q3 ' + theYear.toString();
				break;

				// Quarter 4 for May Jun Jul
			case 5:
			case 6:
			case 7:
				theValue = 'Q4 ' + theYear.toString();
				break;

				//Quarter 1 Aug Sep Oct 
			case 8:
			case 9: 
			case 10:
				theValue = 'Q1 ' + (theYear + 1).toString();
				break;
				// Quarter 2 Nov Dec  
			case 11:
			case 12:
				theValue = 'Q2 ' + (theYear + 1).toString(); 
				break;

				// Quarter 2  Jan 
			case 1:	
				theValue = 'Q2 ' + theYear.toString();
				break;
			}
		}

		if(theYear == 2011)
		{

			switch(theMonth)
			{

			// Quarter 3 Feb Mar Apr
			case 2:
			case 3: 
			case 4:
				theValue = 'Q3 ' + theYear.toString();
				break;

				// Quarter 4 for May Jun Jul Aug Sep
			case 5:
			case 6:
			case 7:
			case 8:
			case 9: 
				theValue = 'Q4 ' + theYear.toString();
				break;

				//Quarter 1 Oct Nov Dec
			case 10:
			case 11:
			case 12:
				theValue = 'Q1 ' + (theYear + 1).toString();
				break;

				// Quarter 2  Jan 2011
			case 1:	
				theValue = 'Q2 ' + theYear.toString();
				break;
			}
		}

		if(theYear >= 2012)
		{
			switch(theMonth)
			{
			// Quarter 2 Jan Feb Mar
			case 1:	
			case 2:
			case 3: 
				theValue = 'Q2 ' + theYear;
				break;

				// Quarter 3 Apr May Jun
			case 4:
			case 5:
			case 6:
				theValue = 'Q3 ' + theYear;
				break;

				// Quarter 4 for Jul Aug Sep
			case 7:
			case 8:
			case 9: 
				theValue = 'Q4 ' + theYear;
				break;

				//Q1 Oct Nov Dec
			case 10:
			case 11:
			case 12:
				theValue = 'Q1 ' + (parseInt(theYear) + 1).toString();
				break;
			}	
		}
		//alert('The value: ' + theValue);
		return theValue;	
	}
	catch(exception)
	{

		alert('An error has occurred.\nPlease retry the operation.\n(GetQuarter)\n' + exception);
		return false;
	}
}


Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
};

function onadd_calculateForiegnAmount(type, name, linenum)
{

	/*
	alert('Called calculate now!');

	if(linenum==null)
	{

		alert('Temporary debug message:\n\nmyFieldChanged type=' + type + ', name=' + name + ', data=' + nlapiGetFieldValue(name));
	}
	else
	{

		alert('Temporary debug message:\n\nmyFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
	}
	 */






	try 
	{	

		if(type=='item' && name=='item' && linenum=='1')
		{
			//copy the first lineitem's name to "title to purchase" field for reporting purposes

			var TheSelectedItem = nlapiGetCurrentLineItemValue('item','item');
			//alert('Item line num 1:\n\n' + TheSelectedItem);
			//nlapiSetFieldText('custbody_purchaseitem',TheSelectedItem,false,false);
			nlapiSetFieldValue('custbody_purchaseitem',TheSelectedItem,false,false);
		}


		if (name == 'rate' || name == 'amount' || name == 'quantity') 
		{
			//this is the item sublist
			//var lineIndex = nlapiGetCurrentLineItemIndex('item');
			var theItemAmount = nlapiGetCurrentLineItemValue('item', 'amount');
			//var theItemQuantity = nlapiGetCurrentLineItemValue('item', 'quantity');
			var theForeignAmount = 0;
			var theExchangeRate = nlapiGetFieldValue('exchangerate');


			theForeignAmount = parseFloat(parseFloat(theItemAmount) * theExchangeRate);

			nlapiSetCurrentLineItemValue('item', 'custcol_foreign_amount', 'C$' + theForeignAmount.formatMoney(2, '.', ','), false, false);

			//alert('After Set');
		}

		if (name == 'item') 
		{
			//this is the sublist
			var theItem = nlapiGetCurrentLineItemValue('item', 'item');
			var theNumOfEps = nlapiLookupField('noninventoryitem',theItem,'custitem_num_of_episodes');

			nlapiSetCurrentLineItemValue('item', 'quantity', theNumOfEps, false, false);

			//alert('After Set');
		}


		else 
		{
			//do nothing. just silently moooooove on!
			//alert('test else');



		}	




		if (name == 'entitystatus')
		{
			//alert('test in entitystatus!');
			//alert(nlapiGetFieldValue('entitystatus'));
			if (nlapiGetFieldValue('entitystatus') == "18")
			{

				nlapiDisableField('custbody_rejected_reason',false);
			} //if
			else
			{
				nlapiDisableField('custbody_rejected_reason',true);
			} //else

			if (nlapiGetFieldValue('entitystatus') == "12")
			{	
				//	alert('Role: ' + nlapiGetRole());

				//3 is Administrator
				//1002 is Cineflix Sales
				//1007 is Cineflix Sales/Acquisitions
				if((nlapiGetRole()=='1002') || (nlapiGetRole()=='1007'))
				{
					alert('As you are logged in with a Sales Role, you cannot set this Estimate to be In Negotiation.\n\nPlease select a valid Sales Status.');
					nlapiSetFieldValue('entitystatus','9');
					return false;

				}	//if
			} //if
		} //if

		if (name == 'custbody_rejected_reason')
		{
			//alert(nlapiGetFieldValue('custbody_rejected_reason'));
			if (nlapiGetFieldValue('custbody_rejected_reason') == "6")
			{
				nlapiDisableField('custbody_rejected_reason_other',false);
			} //if
			else
			{
				nlapiDisableField('custbody_rejected_reason_other',true);
				nlapiSetFieldText('custbody_rejected_reason_other','',false, false); //Wipe the value now we know they don't need it...
			} //else
		} //if		


		return true;
	}
	catch(theException)
	{
		alert('An error has occurred: ' + theException + '\n\nName: ' + name + '\nType: ' + type);
		return false;
	}

//	alert('hello');
//	return;
}

//On the Estimates save record event, execute this:
function OnSave_CopyNameForEstimates()
{
	try
	{
		var TheCompany = nlapiGetFieldValue('entity');
		if(TheCompany == '')
		{
			//something up
			alert('This Estimate cannot be saved without a Client associated with it.');
			return false;
		}
		else
		{
			nlapiSetFieldValue('title',TheCompany,false,false);	
		}		
	}
	catch(ex)
	{
		alert('The following error was returned whilst trying to save the record: ' + ex);
	}
}

function myPageInit(type)
{	
	alert('myPageInit');	
	alert('type=' + type);
}

function mySaveRecord()
{	
	alert('mySaveRecord');	
	return true;
} 

function myValidateField(type, name, linenum)
{	
	if(name == 'custentity_my_custom_field')	
	{		
		alert('myValidateField');		
		alert('type=' + type);		
		alert('name=' + name);		
		alert('linenum=' + linenum);	
	}	
	return true;
}

function myFieldChanged(type, name, linenum)
{
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
} 

function myPostSourcing(type, name)
{	
	alert('myPostSourcing type=' + type + ', name=' + name);
} 

function myLineInit(type)
{	
	alert('myLineInit');	
	alert('type=' + type);
}

function myValidateLine(type)
{	
	alert('myValidateLine type=' + type);
	return true;
}

function myValidateInsert(type)
{	
	alert('myValidateInsert type=' + type);
} 

function myValidateDelete(type)
{	
	alert('myValidateDelete type=' + type);
} 

function myRecalc(type)
{	
	alert('myRecalc type=' + type);
}


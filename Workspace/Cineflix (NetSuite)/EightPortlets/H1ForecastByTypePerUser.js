/*******************************************************
 * Name: 		H1ForecastByTypePerUser.js - Cineflix Custom Portlet script
 * Script Type:	Client
 *
 * Version:		1.0.0 – 7/8/2012 – 1st release - PAL
 * 					1.1.0 - 16/8/2012 - Added "noResults" functionality and moved getPortletSettings function to bottom
 * 					2.0.0 - 29th October 2012 PAL
 * 						- Modified getNSFiscalEndDate to work with H1.
 * 						- Modified Opportunity filter to work with expectedclosedate and not trandate
 * 						- Changed column header to 2013 H1 Target
 * 						- Removed [HACK]s
 * 
 * Date:			November 2011 - 29th October 2012
 * Author:		FHL
 * Purpose:		H1 Forecast by Type Per User - To display the forecasts
 * 				for the H1 period for user.
 *          
 *******************************************************/


//Global variables
var Initiated = 0.3;
var Pending = 0.7;
var Verbal = 0.9;
var DealMemo = 1.0;
var InNegotiation = 1.0;

var InitiatedText = "Initiated (30%)";
var PendingText = "Pending (70%)";
var VerbalText = "Verbal (90%)";
var DealMemoText = "Deal Memo (100%)"; 
var InNegotiationText = "In Negotiation (100%)";

var InDebug = false;
var portSuccess = null;
var content = "";
var InNegCount = 0;
var TypeInNegValue = 0;
var noResults = true;
var TeamName = "User";
var TheType = 0;	//Current Type Counter
var Types = new Array();

Types[0] = 1;
Types[1] = 4;
Types[2] = 6;
Types[3] = 5;
Types[4] = 2;
Types[5] = 3;




/****************************
 * H1 Forecast by Type of Sale - User (Mine!)
 * 
 * @param {Object} portlet
 * @param {Object} column
 */
function H1forecastTypeOfSaleUser(portlet, column)
{   

	var userId = nlapiGetUser(); 
	var portSuccess = getPortletSettings(userId);

	if(portSuccess == 1)
	{
		if (InDebug) 
		{
			content += "<p> User Settings loaded correctly..</p>";
		}
	}
	else
	{
		if (InDebug) 
		{
			content += "<p> User Settings loaded incorrectly..</p>";

			// end code as don't want to proceed without portlet settings
			//portlet.setHtml(content);
			//return true;
		}
	}


	/************************
	 *  7 		Forecast
	 *  9 		1.0 Forecast
	 *  19 	1.5 Prospect
	 *  8 		2.5 Initiated
	 *  10 	3.0 Pending
	 *  11 	4.0 Verbal
	 *  20 	4.5 Deal Memo  	 
	 *  12 	5.0 In Negotiation	 
	 *  18 	5.5 Rejected
	 *  13 	Actual 
	 * 
	 *************************/

//	Initialising variables...
	var SumInitiatedTotal = 0;
	var SumPendingTotal = 0;
	var SumVerbalTotal = 0;
	var SumDealMemoTotal = 0;
	var SumInNegTotal = 0;
	var SumSignedTotal = 0;
	var SumLikelyTotal = 0;
	var SumTargetTotal = 0;
	var SumCADTotal = 0;

//	/These are to be reset every iteration of the employee
	var TypeInitiatedTotal = 0;
	var TypePendingTotal = 0;
	var TypeVerbalTotal = 0;
	var TypeDealMemoTotal = 0;
	var TypeInNegTotal = 0;
	var TypeSignedTotal = 0;
	var TypeLikelyTotal = 0;
	var TypeTargetTotal = 0;
	var TypeCADTotal = 0;

	var TypeName = 'TBA';

	portlet.setTitle('H1 Forecast by Type of Sale - ' + TeamName);


//	Employee search
	var empfilter = new Array();
	empfilter[0] = new nlobjSearchFilter('salesrep', null, 'is', 'T');		// Must be a Sales Rep
	empfilter[1] = new nlobjSearchFilter('internalid', null, 'is', userId);	//Must be current User.

	var empcolumn = new Array();
	empcolumn[0] = new nlobjSearchColumn('internalid');	//We need the InternalID
	empcolumn[1] = new nlobjSearchColumn('entityid');	//And their first name...
	empcolumn[2] = new nlobjSearchColumn('custentity_team');	//And their team name...
	empcolumn[3] = empcolumn[1].setSort();	//Sort the columns...

	var searchEmployeeResult = nlapiSearchRecord('employee',null,empfilter,empcolumn);

	if(searchEmployeeResult == null)
	{
		portlet.setHtml( "<p>You are not a Sales Rep, therefore you cannot view this Portlet.</p>" );
		return true;
	}
	
	//Set the headers...
	content+= "<tr><td>&nbsp;</td><td title='Type of Sale'><font size='2.4'><u><b>Type of Sale</b></u></font></td>";
	if( Initiated != 0)
	{
		content+= "<td align='right' title='Initiated Total'><font size='2.4'>&nbsp<u><b> " + InitiatedText + "</b></u></font></td> " ;
	}
	
	if( Pending != 0)
	{
		content+= "<td align='right' title='Pending Total'><font size='2.4'>&nbsp<u><b>" + PendingText + "</b></u></font></td>";
	}
	content+= "<td align='right' title='Verbal Total'><font size='2.4'>&nbsp<u><b>" + VerbalText + "</b></u></font></td>";
	content+= "<td align='right' title='Deal Memo Total'><font size='2.4'>&nbsp<u><b>" + DealMemoText + "</b></u></font></td>";
	content+= "<td align='right' title='In Negotiation Total'><font size='2.4'>&nbsp<u><b>" + InNegotiationText + "</b></u></font></td>";
	content+= "<td align='right' title='Actual Total'><font size='2.4'>&nbsp<u><b> Actual</b></u></font></td>";
	content+= "<td align='right' title='Likely Outcome for H1 " + thisyear() + "'><font size='2.4'>&nbsp<u><b> Likely Outcome for H1 "+thisyear()+"</b></u></font></td>";
	content+= "<td align='right' title='H1 " + thisyear() + " Target'><font size='2.4'>&nbsp<u><b>H1 "+thisyear()+" Target</b></u></font></td>";
	content+= "<td align='right' title='% Target Achieved for H1 " + thisyear() + "'><font size='2.4'>&nbsp<u><b>% H1 "+thisyear()+" Target Achieved</b></u></font></td>";
	content+= "<td align='right' title='Deals Required to reach target'><font size='2.4'>&nbsp<u><b>Deals Required</b></u></font></td></tr>";

	for(var TheType = 0; TheType < Types.length; TheType++)
	{
		TypeName = getTypeName(Types[TheType]);
		TypeInitiatedTotal = 0;
		TypePendingTotal = 0;
		TypeVerbalTotal = 0;
		TypeDealMemoTotal = 0;
		TypeInNegTotal = 0;
		TypeSignedTotal = 0;
		TypeLikelyTotal = 0;
		TypeTargetTotal = 0;
		TypeCADTotal = 0;

		var estfilter = new Array();
		estfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
		estfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', userId);
		estfilter[2] = new nlobjSearchFilter('enddate', null, 'onorafter', getNSFiscalStartDate()); 
		estfilter[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', getNSFiscalEndDate());
		estfilter[4] = new nlobjSearchFilter('entitystatus', null, 'anyOf', [8, 10, 11, 20, 12]);
		estfilter[5] = new nlobjSearchFilter('mainline', null, 'is', 'T');
		estfilter[6] = new nlobjSearchFilter('custbody_type_of_sale', null, 'is', Types[TheType]);

		/*  8 	2.5 Initiated
		 *  10 	3.0 Pending
		 *  11 	4.0 Verbal
		 *  20 	4.5 Deal Memo  	 
		 *  12 	5.0 In Negotiation
		 *  */

		var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale');
		var amount = new nlobjSearchColumn('amount');
		var enddate = new nlobjSearchColumn('enddate');
		var entitystatus = new nlobjSearchColumn('entitystatus');
		var internalid = new nlobjSearchColumn('internalid');
		
		var searchresults = nlapiSearchRecord('estimate', null, estfilter, [amount, type_of_salecolumn, enddate, entitystatus, internalid]);

		if(searchresults == null)
		{
			if(InDebug)
			{
				content+="<p>No estimates this financial year</p>";
			}
		}
		else
		
		{
			noResults = false;
			for(var thisEstimate = 0; thisEstimate < searchresults.length; thisEstimate++)
			{

				//initiated 8
				if( Initiated != 0)
				{	
					if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,8))
					{

						TypeInitiatedTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						SumInitiatedTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
					}
				}

				if ( Pending != 0)
				{
					//Pending 10
					if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,10))
					{
						TypePendingTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						SumPendingTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
					}
				}

				//Verbally Agreed 11
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,11))
				{
					TypeVerbalTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					SumVerbalTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				//Deal Memo 20
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,20))
				{
					TypeDealMemoTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					SumDealMemoTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				//In Negotiation 12
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,12))
				{
					TypeInNegValue = parseInt(searchresults[thisEstimate].getValue('amount'));
					TypeInNegTotal  += TypeInNegValue;
					SumInNegTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					
					if(InDebug)
					{
						InNegCount++;
					content += "<p>InNegCount: " + InNegCount +", TypeInNegValue: " + TypeInNegValue + ", SumInNegTotal: " + SumInNegTotal + ", InternalID: " +searchresults[thisEstimate].getValue('internalid') + ", end date: ";
					content += searchresults[thisEstimate].getValue('enddate') + "</p>";
					}
				}
//				Commented out - AM
				//SumLikelyTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
			}
		}

		try 
		{	
			var dealfilter = new Array();
			dealfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
			dealfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', userId);
			dealfilter[2] = new nlobjSearchFilter('trandate', null, 'onorafter', getNSFiscalStartDate()); 
			dealfilter[3] = new nlobjSearchFilter('trandate', null, 'onorbefore', getNSFiscalEndDate());
			dealfilter[4] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			dealfilter[5] = new nlobjSearchFilter('custbody_type_of_sale', null, 'is', Types[TheType]);

			var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale');
			var amount = new nlobjSearchColumn('amount');
			var trandate = new nlobjSearchColumn('trandate');

			var dealsearchresults = nlapiSearchRecord('salesorder', null, dealfilter, [amount, type_of_salecolumn, trandate]);


			if(dealsearchresults == null)
			{
				if (InDebug) 
				{
					content += "<p>No deals so far</p>";
				}
			}
			else
			{
				noResults = false;
				for(var thisDeal = 0; thisDeal < dealsearchresults.length; thisDeal++)
				{
					
					TypeSignedTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					SumSignedTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					
					if (InDebug) 
					{
						content += "<p>in loop for Deal num: " + thisDeal + ", TypeSignedTotal: " + TypeSignedTotal + ", SumSignedTotal: " + SumSignedTotal +"</p>";
					}


				}
			}
		} 
		catch (e) 
		{
			if (InDebug) 
			{
				content += "<p>Error calculating this Deal : " + e.message + "</p>";
			}
		}


		try 
		{
			//projectedtotal
			//weightedtotal
			var oppfilter = new Array();

			oppfilter[0] = new nlobjSearchFilter('projectedtotal', null, 'greaterThan', 0).setSummaryType('sum');
			oppfilter[1] = new nlobjSearchFilter('custbody_type_of_sale', null, 'is', Types[TheType]);
			oppfilter[2] = new nlobjSearchFilter('expectedclosedate', null, 'onorafter', getNSFiscalStartDate()); 
			oppfilter[3] = new nlobjSearchFilter('expectedclosedate', null, 'onorbefore', getNSFiscalEndDate());			   
			oppfilter[4] = new nlobjSearchFilter('salesrep',null, 'is', userId);

			var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale', null, 'group');

			//Change to Projected Total if needs be...
			var projectedtotal = new nlobjSearchColumn('projectedtotal', null, 'sum');

			var oppsearchresults = nlapiSearchRecord('opportunity', null, oppfilter, [projectedtotal, type_of_salecolumn]);

			if(oppsearchresults == null)
			{
				if (InDebug) 
				{
					content += "<p><u>No Opportunities found for " + TypeName + " for this financial year</u></p>";
				}
			}
			else
			{
				noResults = false;
				switch(parseInt(oppsearchresults.length)) 
				{
					case null:
						if (InDebug) 
						{
							content += "<p><u>No Opportunities found for " + TypeName + " for this financial year</u></p>";
						}
						break;
					case 1:
						var projectedtotal = oppsearchresults[0].getValue('projectedtotal', null, 'sum');

						TypeTargetTotal = projectedtotal;
						SumTargetTotal += parseInt(projectedtotal);
						break;
					default:
						if (InDebug) 
						{
							content += "<p>Invalid length : " + oppsearchresults.length + "</p>";
						}
					break;
				}

			}
		} 
		catch (e) 
		{
			if (InDebug) 
			{
				content += "<p>Error on Opportunities : " + e.message + "</p>";
			}
		}

		try
		{
			//Set the row data now...		
			content+= "<tr><td BGCOLOR='" + row_change(TheType) + "'>&nbsp;</td>" ;
			content+= "<td align='left' BGCOLOR='" + row_change(TheType) + "' title='Type of Sale'><font size='2.4'>" + TypeName + "</font></td>";
			if( Initiated != 0)
			{
				content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Initiated Total for " + TypeName + " is $" + parseInt(TypeInitiatedTotal * Initiated) 
						+ "'><font size='2.4'>&nbsp$" + parseInt(TypeInitiatedTotal * Initiated).formatMoney(0, '.', ',') + "</font></td>" ;
			}
			if( Pending != 0)
			{
				content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Pending Total for " + TypeName + " is $" + parseInt(TypePendingTotal * Pending) 
						+ "'><font size='2.4'>&nbsp$" + parseInt(TypePendingTotal * Pending).formatMoney(0, '.', ',') + "</font></td>";
			}
			content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Verbally Agreed Total for " + TypeName + " is $" 
					+ parseInt(TypeVerbalTotal * Verbal)  + "'><font size='2.4'>&nbsp$" + parseInt(TypeVerbalTotal * Verbal).formatMoney(0, '.', ',')   + "</font></td>";
			
			content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Deal Memo Total for " + TypeName + " is $" + parseInt(TypeDealMemoTotal * DealMemo) 
					+ "'><font size='2.4'>&nbsp$" + parseInt(TypeDealMemoTotal * DealMemo).formatMoney(0, '.', ',')  + "</font></td>";
			
			content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='In Negotiation Total for " + TypeName + " is $" 
					+ parseInt(TypeInNegTotal * InNegotiation) + "'><font size='2.4'>&nbsp$" + parseInt(TypeInNegTotal * InNegotiation).formatMoney(0, '.', ',')   
					+ "</font></td>";
			
			content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Actual Total for " + TypeName + " is $" + TypeSignedTotal  
					+ "'><font size='2.4'>&nbsp$" + TypeSignedTotal.formatMoney(0, '.', ',')  + "</font></td>";


			//this is where we calculate EmpLikelyTotal
			if( Initiated != 0)
			{	
				TypeLikelyTotal = parseInt((parseFloat(TypeInitiatedTotal) * Initiated));
			}
			if( Pending != 0)
			{
				TypeLikelyTotal += parseInt((parseFloat(TypePendingTotal) * Pending));
			}
			TypeLikelyTotal += parseInt((parseFloat(TypeVerbalTotal) * Verbal));
			TypeLikelyTotal += parseInt((parseFloat(TypeDealMemoTotal) * DealMemo));
			TypeLikelyTotal += parseInt((parseFloat(TypeInNegTotal) * InNegotiation));
			TypeLikelyTotal += parseInt(TypeSignedTotal);

			SumLikelyTotal += TypeLikelyTotal;

			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Likely Outcome for H1 " + thisyear() + " for " + TypeName + " is $" 
					+ TypeLikelyTotal.formatMoney(0, '.', ',') + "'><font size='2.4'>$" + TypeLikelyTotal.formatMoney(0, '.', ',') + "</font></td>"; 
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='H1 " + thisyear() + " Target for " + TypeName + " is $" 
					+ TypeTargetTotal.formatMoney(0, '.', ',')  + "'><font size='2.4'>$" + TypeTargetTotal.formatMoney(0, '.', ',')  + "</font></td>";


			if(isNaN(parseInt((TypeLikelyTotal / TypeTargetTotal) * 100)))
			{
				TypeFYTotal = "n/a";
			}
			else
			{
				TypeFYTotal = parseInt((TypeLikelyTotal / TypeTargetTotal) * 100);
			}

			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='% Target Achieved for H1 " + thisyear() + " for " + TypeName + " is " + TypeFYTotal 
					+ "%'><font size='2.4'>" + TypeFYTotal + "%</font></td>";


			TypeCADTotal += parseInt(TypeTargetTotal - TypeLikelyTotal);

			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Deals Required to reach H1 target for " + TypeName + " is " + TypeCADTotal 
					+ "'><font size='2.4'>" + isNegative(TypeCADTotal) + "</font></td></tr>";
		} 
		catch (e) 
		{
			content+=    "format money issue..." + e.message + "<br>";
		}

	} //Type For loop...


	try
	{


		//Set the column footer totals...
		content+= "<tr><td BGCOLOR='"+row_change(Types.length) +"'>&nbsp;</td>" ;
		content+= "<td align='left' BGCOLOR='"+row_change(Types.length) +"' title='Column Totals'><font size='2.4'><u><b>Column Totals</b></u></font></td>";
		if( Initiated != 0)
		{
			content+= "<td align='right' BGCOLOR='" +row_change(Types.length) + "' title='Initiated Total is $" + parseInt(SumInitiatedTotal * Initiated).formatMoney(0, '.', ',') 
					+ "'><font size='2.4'><u><b>$" + parseInt(SumInitiatedTotal * Initiated).formatMoney(0, '.', ',') + "</b></u></font></td>" ;
		}
		if( Pending != 0)
		{
			content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='Pending Total is $" + parseInt(SumPendingTotal * Pending).formatMoney(0, '.', ',') 
					+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumPendingTotal * Pending).formatMoney(0, '.', ',') + "</b></u></font></td>";
		}
 
		
//		Altered Verbal Weighting - AM
		content+= "<td align='right' BGCOLOR='" + row_change(TheType) + "' title='Verbally Agreed Total for " + TypeName + " is $" 
				+ parseInt(SumVerbalTotal * Verbal)  + "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumVerbalTotal * Verbal).formatMoney(0, '.', ',')   
				+ "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='Deal Memo Total is $" + parseInt(SumDealMemoTotal * DealMemo).formatMoney(0, '.', ',')  
				+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumDealMemoTotal * DealMemo).formatMoney(0, '.', ',')  + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='In Negotiation Total is $" + parseInt(SumInNegTotal*InNegotiation).formatMoney(0, '.', ',')   
				+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumInNegTotal*InNegotiation).formatMoney(0, '.', ',')   + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='Actual Total for is $" + SumSignedTotal.formatMoney(0, '.', ',')  
				+ "'><font size='2.4'>&nbsp;<u><b>$" + SumSignedTotal.formatMoney(0, '.', ',')  + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='Likely Outcome for H1 " + thisyear() + " is $" + SumLikelyTotal.formatMoney(0, '.', ',') 
				+ "'><font size='2.4'><u><b>$" + SumLikelyTotal.formatMoney(0, '.', ',') + "</b></u></font></td>"; 
		
		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='H1 " + thisyear() + " Target is $" + SumTargetTotal.formatMoney(0, '.', ',')  
				+ "'><font size='2.4'><u><b>$" + SumTargetTotal.formatMoney(0, '.', ',')  + "</b></u></font></td>";

		var SumFYTotal = 0;

		if(isNaN(parseInt((SumLikelyTotal / SumTargetTotal) * 100)))
		{
			SumFYTotal = "n/a";
		}
		else
		{
			SumFYTotal = String(parseInt((SumLikelyTotal / SumTargetTotal) * 100));
		}

		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='% Target Achieved for H1 " + thisyear() + " is " + SumFYTotal 
				+ "%'><font size='2.4'><u><b>" + SumFYTotal + "%</b></u></font></td>";


		SumCADTotal += parseInt(SumTargetTotal - SumLikelyTotal);


		content+= "<td align='right' BGCOLOR='"+row_change(Types.length) +"' title='Deals Required to reach H1 target is $" + SumCADTotal.formatMoney(0, '.', ',') 
				+ "'><font size='2.4'><u><b> " + isNegative(SumCADTotal) + "</b></u></font></td></tr>";

	}

	catch(e)
	{
		content+= "<p>Error on #413: " + e.message + "</p>";
	}

	if(InDebug)
	{
		var context = nlapiGetContext();
		content+= "<p>Usage remaining: " + context.getRemainingUsage() + "</p>";
	}

	if(noResults == true)
	{
		content = "<p>There are no results to show.</p>";
	}
	portlet.setHtml( content );
	return true;


}



/***********************
 *  7 		Forecast
 *  9 		1.0 Forecast
 *  19 	1.5 Prospect
 *  8 		2.5 Initiated
 *  10 	3.0 Pending
 *  11 	4.0 Verbal
 *  20 	4.5 Deal Memo  	 
 *  12 	5.0 In Negotiation	 
 *  18 	5.5 Rejected
 *  13 	Actual 
 * 
 * @param {Integer} EmployeeID
 * @param {Integer} EntityStatus
 * 
 ************************/


/*********
 * If the value is negative, it will return the formatted money option in bold and green.
 * @param {Object} input
 */
function isNegative(input)// puts brackets around negative CAD values and 
{

	var output = input;

	if (input<0)
	{
		output = "<font color='green'><b>($"+ parseInt(input * -1).formatMoney(0,'.',',') + ")</b></font>";
	}
	else
	{
		output = "$" + parseInt(Math.abs(input)).formatMoney(0,'.',',');
	}

	return output;
}


/***********
 * Returns a colour depending on whether the number is odd or even
 * @param {Object} input - The Row Number
 */
function row_change(input)// changes the colour of the row 
{
	if (input%2 == 0)
		return "#f0f0f0";
	else
		return "#fefefe";


}


/***********************************
 *  Gets the Fiscal Start Date in NetSuite Format
 ***********************************/
function getNSFiscalStartDate()
{	
	var NSFiscalStart = "";
	var Today = new Date();
	var StartDate = Today.getFullYear();
	nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST');
	try
	{


		if (Today.getMonth() >= 9)
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - >=9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'StartDate: ' + StartDate);
			NSFiscalStart = "1/10/" + StartDate;
		}	 
		else
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - <9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'StartDate: ' + StartDate);
			NSFiscalStart = "1/10/" + String(parseInt(StartDate) - 1);
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'NSFiscalStart Error', e.message);
	}
	
	if(InDebug)
		{
		content+="<p>NSFiscalStart: " + NSFiscalStart + "</p>";
		}
	return NSFiscalStart;
}

/***********************************
 *  Gets the Fiscal End Date in NetSuite Format
 *  
 *  * Altered to end within 6 months - A.D.M
 *  * Modified by PAL 29th October to allow the End Date to be calculated for the next year depending on today's date
 *  
 ***********************************/
function getNSFiscalEndDate()
{

	var Today = new Date();
	var EndDate = Today.getFullYear();
	var NSFiscalEnd = "";
	
	if (Today.getMonth() < 9)	//If the month is in the first 9 months of the year
	{
		NSFiscalEnd = "31/3/" + Today.getFullYear();
	}	 
	else
	{
		NSFiscalEnd = "31/3/" + String(parseInt(Today.getFullYear()) + 1);
	}
	
	return NSFiscalEnd;
}

/**************************
 *  Returns the Current Fiscal Year
 *  
 *  (Cineflix, Oct start date)
 *  
 **************************/
function thisyear()// returns the fiscal year 
{
	var today = new Date();
	var year = today.getFullYear();

	if (today.getMonth() >= 9)	 
		year = today.getFullYear()+1;
	return year;
}

function InQuarter(date, quarter)
{
	try {		
		nlapiLogExecution('DEBUG', 'InQuarter date Test...', date);
		if((date == null) || (quarter == null))
		{
			nlapiLogExecution('ERROR','InQuarter Issue...','InQuarter...date: ' + date + ', quarter: ' + quarter);
			return false;
		}

//		var ThisYear = thisyear();
		var TheDate = dateConv(date, 0); //Convert the NetSuite date to JS Date
		var TheMonth = TheDate.getMonth();


		quarter = quarter.toLowerCase();

		//	if(TheMonth <= 8)
		//	{
		//		nlapiLogExecution("DEBUG","GetMonth "+ date,"test..." + TheDate.getMonth() + ", Quarter: " + quarter);
		//	}



		switch(String(quarter))
		{
			case "q1":
				if(TheMonth == 9 || TheMonth == 10 || TheMonth == 11)
				{
					return true;
				}
				else
				{
					return false;
				}
				break;
			case "q2":
				if(TheMonth == 0 || TheMonth == 1 || TheMonth == 2)
				{
					return true;
				}
				else
				{
					return false;
				}
				break;
			case "q3":
				if(TheMonth == 3 || TheMonth == 4 || TheMonth == 5)
				{
					return true;
				}
				else
				{
					return false;
				}
				break;
			case "q4":
				if(TheMonth == 6 || TheMonth == 7 || TheMonth == 8)
				{
					return true;
				}
				else
				{
					return false;
				}
				break;
			default:
				return false;	
			break;
		}
		return false;
	} 
	catch (e) 
	{
		nlapiLogExecution('ERROR', 'InQuarter Error:', e.message);
		return false;
	}
}

function isDateinRange(date,startdate,enddate)// checks if date is in the range of startdate/enddate 
{
	try
	{
		var input = dateConv(date,0);
		var start = dateConv(startdate,0);
		var end = dateConv(enddate,0);

		// Convert both dates to milliseconds
		var input_ms = input.getTime();
		var start_ms = start.getTime();
		var end_ms = end.getTime();

		if (input_ms>=start_ms && input_ms<=end_ms)
			return true;
		else
			return false;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','IsInDateRange Error:', e.message);
		return false;
	}

}

function jsDate_To_nsDate(jsdate)// used for dateConv
{	  	

	try
	{
		var theDay = jsdate.getDate();
		var theMonth = jsdate.getMonth()+1;
		var theYear = jsdate.getFullYear();

		var nsdate = theDay+"/"+theMonth+"/"+theYear;

		return nsdate;
	}
	catch(e)
	{		
		nlapiLogExecution('ERROR','jsDate_To_nsDate Error:', e.message);
		return false;
	}
}

function nsDate_To_jsDate(nsdate)// used for dateConv 
{
	try 
	{
		var dateStr = nsdate.split("/");  
		var theDay = dateStr[0];
		var theMonth = dateStr[1] - 1;
		var theYear = dateStr[2];


		var jsdate= new Date(theYear, theMonth, theDay);
		return jsdate;
	} 
	catch (e) 
	{
		nlapiLogExecution('ERROR', 'nsDate_To_jsDate Error', e.message);
		return false;
	}
}

//mode 0 = NetSuite to JS | mode 1 = JS to NetSuite 
/***************************************
 * 
 * NetSuite to JS = Mode 0, JS to NetSuite = Mode 1
 * 
 * @param {Object} date to convert
 * @param {Object} mode
 * 
 ***************************************/

function dateConv(date,mode)
{
	try 
	{
		//nlapiLogExecution('DEBUG', 'DateConv', 'Date : ' + date + ', Mode : ' + mode);


		if (mode == 0)
			return nsDate_To_jsDate(date);

		if (mode == 1)
			return jsDate_To_nsDate(date);

	} 
	catch (e) 
	{
		nlapiLogExecution('DEBUG', 'DateConv Error', e.message);
		return e.message;
	}


}


Object.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
};


Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
};







/******************* 
 *  3rd Party			1	
 *  Library				2
 *  Pre-sale			3	
 *  Ancillary			4	
 *  Format				5	
 *  Format Option	6	Yes
 *  Scripted			7	Yes
 *  
 * @param {Number} InternalID of Type
 * 
 ************************/
function getTypeName(InternalID)
{
	try
	{	
		InternalID = parseInt(InternalID);

		switch(InternalID)
		{
			case 1:
				return "3rd Party";
				break;
			case 2:
				return "Library";
				break;	
			case 3:
				return "Pre-sale";
				break;
			case 4:
				return "Ancillary";
				break;	
			case 5:
				return "Format Option";
				break;
			case 6:
				return "Format Commission";
				break;	
			case 7:
				return "Scripted";
				break;	
			default:
				return "Undefined";
			break;
		}
	}
	catch(e)
	{
		return "Error getting Type Name";
	}
}

/*******
 * Pass in the status and the status required...returns true if it's the same :)
 * @param {Object} status
 * @param {Object} statusrequired
 */  
function IsStatus(status, statusrequired)
{
	try 
	{		
		nlapiLogExecution('DEBUG', 'IsStatus  Test...', status);
		if((status == null) || (statusrequired == null))
		{
			nlapiLogExecution('ERROR','IsStatus Issue...','status...: ' + status + ', statusrequired: ' + statusrequired);
			return false;
		}


		if(parseInt(status) == parseInt(statusrequired))
		{
			return true;
		}
		else
		{
			//nlapiLogExecution('DEBUG', 'IsStatus False:', status + ', ' + statusrequired);
			return false;
		}

	} 
	catch (e) 
	{
		nlapiLogExecution('ERROR', 'IsStatus Error:', e.message);
		return false;
	}

}



/****************************
 * Retrieves the users portlet settings from a custom records and populates the above global variables
 * 
 * @param {int} userId
 * 
 * returns true or false depending on success
 */
function getPortletSettings(userId)
{
	if (InDebug) 
	{
		content += "<p>userId: " + userId + ", name: " + nlapiLookupField('employee',userId,'entityid') + "</p>";
	}
	var allowPortCust = nlapiLookupField('employee', userId, 'custentity_allowportletcustomisation');

	// declare search arrays
	var portSearchFilters = new Array();
	var portSearchColumns = new Array();

	// set the results to null
	var portSearchResults = null;

	// search columns
	portSearchColumns[0] = new nlobjSearchColumn('custrecord_ps_verbaltext');
	portSearchColumns[1] = new nlobjSearchColumn('custrecord_ps_verbalvalue');
	portSearchColumns[2] = new nlobjSearchColumn('custrecord_ps_inittext');
	portSearchColumns[3] = new nlobjSearchColumn('custrecord_ps_initvalue');
	portSearchColumns[4] = new nlobjSearchColumn('custrecord_ps_pendingtext');
	portSearchColumns[5] = new nlobjSearchColumn('custrecord_ps_pendingvalue');
	portSearchColumns[6] = new nlobjSearchColumn('custrecord_ps_dealmemotext');
	portSearchColumns[7] = new nlobjSearchColumn('custrecord_ps_dealmemovalue');
	portSearchColumns[8] = new nlobjSearchColumn('custrecord_ps_innegotiationtext');
	portSearchColumns[9] = new nlobjSearchColumn('custrecord_ps_innegotiationvalue');


	if(allowPortCust == 'T')
	{
		if(InDebug) 
		{
			content += "<p>Port customization Enabled</p>";
		}
		// search for the portlet settings specificed in NetSuite custom record

		// search filters
		portSearchFilters[0] = new nlobjSearchFilter('custrecord_ps_employee', null, 'is', userId);	
		//portSearchFilters[1] = new nlobjSearchFilter('custrecord_ps_team', null, 'is', TeamNumber);	

		// execute search
		portSearchResults = nlapiSearchRecord('customrecord_portlet_settings', null, portSearchFilters, portSearchColumns);

		if (InDebug) 
		{
			content += "<p>Number of results: " + portSearchResults.length + "</p>";
		}	

		if(!portSearchResults)
		{	
			if (InDebug) 
			{
				content += "<p>Current employee has no settings, reseting to default settings</p>";
			}	

			// default search
			portSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', 1);	

			// re execute search with default settings
			portSearchResults = nlapiSearchRecord('customrecord_portlet_settings', null, portSearchFilters, portSearchColumns);	
		}	
		else		
		{

		}
	}
	else
	{
		// default search
		// search filters
		portSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'is', 1);	

		// execute search
		portSearchResults = nlapiSearchRecord('customrecord_portlet_settings', null, portSearchFilters, portSearchColumns);

		if (InDebug) 
		{
			content += "<p>default search userId: " + userId + ", name: </p>";
		}
	}

	if(portSearchResults && portSearchResults != null && portSearchResults.length > 0)
	{
		try
		{
			// percentage value
			Initiated = portSearchResults[0].getValue(portSearchColumns[3]);
			Pending = portSearchResults[0].getValue(portSearchColumns[5]);
			Verbal = portSearchResults[0].getValue(portSearchColumns[1]);
			DealMemo = portSearchResults[0].getValue(portSearchColumns[7]);
			InNegotiation = portSearchResults[0].getValue(portSearchColumns[9]);

			// text from portlet customisation record
			InitiatedText = portSearchResults[0].getValue(portSearchColumns[2]);
			PendingText = portSearchResults[0].getValue(portSearchColumns[4]);
			VerbalText = portSearchResults[0].getValue(portSearchColumns[0]);
			DealMemoText = portSearchResults[0].getValue(portSearchColumns[6]);
			InNegotiationText = portSearchResults[0].getValue(portSearchColumns[8]);

			// successful
			return 1;
		}
		catch(e) // unable to find a certain result		
		{
			if (InDebug) 
			{
				content += "<p> Unable to get results for Portlet Search </p>";
			}
		}
	}
	else
	{
		// no results found
	}
}
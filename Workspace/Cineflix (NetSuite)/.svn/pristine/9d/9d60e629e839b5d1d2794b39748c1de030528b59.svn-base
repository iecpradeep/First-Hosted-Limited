/*******************************************************
 * Name:			Cineflix Custom Portlet script
 * Purpose:			H1 Forecast by Sales Rep, All Teams
 * Script Type:		Javascript
 * Version:			1.0
 * 					1.1 29/06/2012 Changed getNSFiscalEndDate 
 * 					to only be within 6 months. - A.D.M
 *   				1.2 19/07/2012 - Altered the Verbal Weighting
 * 					line 562. - A.D.M	
 * 					2.0.0 - 29th October 2012 PAL
 * 						- Modified getNSFiscalEndDate to work with H1.
 * 						- Modified Opportunity filter to work with expectedclosedate and not trandate
 * 						- Changed column header to 2013 H1 Target
 * 						- Removed [HACK]s
 * 
 * Date:			November 2011 - 29th October 2012
 * Author:			Pete Lewis, Anthony Nixon, First Hosted Limited.
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
var TheTeam = 2; // team number internal ID
var TeamNumber = 2; // internal ID of the team number ** see customlist_team **
var TeamName = "Team Two";




/****************************
 * Demo Portlet
 * 
 * @param {Object} portlet
 * @param {Object} column
 */
function H1ForecastTeamTwo(portlet, column)
{   
	// get the current user id
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

	TheTeam[0] = 1;
	TheTeam[1] = 2;
	TheTeam[2] = 3;

	/************************
	 *  7 		Forecast
	 *  9 	1.0 Forecast
	 *  19 	1.5 Prospect
	 *  8 	2.5 Initiated
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
	var SumFYTotal = 0;
	var SumTargetTotal = 0;
	var SumCADTotal = 0;

//	These are to be reset every iteration of the employee
	var EmpInitiatedTotal = 0;
	var EmpPendingTotal = 0;
	var EmpVerbalTotal = 0;
	var EmpDealMemoTotal = 0;
	var EmpInNegTotal = 0;
	var EmpSignedTotal = 0;
	var EmpLikelyTotal = 0;
	var EmpFYTotal = 0;
	var EmpTargetTotal = 0;
	var EmpCADTotal = 0;

	var SalesRepName = '';

//	Employee search
	var empfilter = new Array();
	empfilter[0] = new nlobjSearchFilter('salesrep', null, 'is', 'T');		// Must be a Sales Rep
	empfilter[1] = new nlobjSearchFilter('custentity_team', null, 'anyOf', TheTeam);	//Must be in this Team...

	var empcolumn = new Array();
	empcolumn[0] = new nlobjSearchColumn('internalid');	//We need the InternalID
	empcolumn[1] = new nlobjSearchColumn('entityid');	//And their first name...
	empcolumn[2] = new nlobjSearchColumn('custentity_team');	//And their team name...
	empcolumn[3] = empcolumn[1].setSort();	//Sort the columns...

	var searchEmployeeResult = nlapiSearchRecord('employee',null,empfilter,empcolumn);

	if(searchEmployeeResult == null)
	{
		portlet.setHtml( "<p>There are no Sales Reps in these Teams</p>" );
		return true;
	}

	var numOfEmployees = searchEmployeeResult.length;

	if (InDebug) 
	{
		content += "<p>numOfEmployees: " + numOfEmployees + ".....</p><p>" + getNSFiscalStartDate() + "....." + getNSFiscalEndDate() + "</p>";
	}

	portlet.setTitle('##### H1 Forecast by Sales Person - ' + TeamName);

	//Set the headers...
	content+= "<tr><td>&nbsp;</td><td title='Sales Rep'><font size='2.4'><u><b>Sales Rep</b></u></font></td>";
	if( Initiated != 0)
	{	
		content+= "<td align='right' title='Initiated Total'><font size='2.4'><u><b>" + InitiatedText + "</b></u></font></td>" ;
	}
	if( Pending != 0)
	{
		content+= "<td align='right' title='Pending Total'><font size='2.4'><u><b>" + PendingText + "</b></u></font></td>";
	}
	content+= "<td align='right' title='Verbally Agreed Total'><font size='2.4'><u><b> "+ VerbalText + "</b></u></font></td>";
	content+= "<td align='right' title='Deal Memo Total'><font size='2.4'><u><b>" + DealMemoText + "</b></u></font></td>";
	content+= "<td align='right' title='In Negotiation Total'><font size='2.4'><u><b>" + InNegotiationText + "</b></u></font></td>";
	content+= "<td align='right' title='Actual Total'><font size='2.4'><u><b>Actual</b></u></font></td>";
	content+= "<td align='right' title='Likely Outcome for H1 " + thisyear() + "'><font size='2.4'><u><b> Likely Outcome for H1 "+thisyear()+"</b></u></font></td>";
	content+= "<td align='right' title='H1 " + thisyear() + " Target'><font size='2.4'><u><b>H1 "+thisyear()+" Target</b></u></font></td>";
	content+= "<td align='right' title='% Target Achieved for H1 " + thisyear() + "'><font size='2.4'><u><b>% H1 "+thisyear()+" Target Achieved</b></u></font></td>";
	content+= "<td align='right' title='Deals Required to reach target'><font size='2.4'><u><b>Deals Required</b></u></font></td></tr>";

	for(var emp = 0; emp < numOfEmployees; emp++)
	{
		SalesRepName = searchEmployeeResult[emp].getValue(empcolumn[1]);

		EmpInitiatedTotal = 0;
		EmpPendingTotal = 0;
		EmpVerbalTotal = 0;
		EmpDealMemoTotal = 0;
		EmpInNegTotal = 0;
		EmpSignedTotal = 0;
		EmpLikelyTotal = 0;
		EmpFYTotal = 0;
		EmpTargetTotal = 0;
		EmpCADTotal = 0;

		var estfilter = new Array();
		estfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
		estfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', searchEmployeeResult[emp].getValue(empcolumn[0]));
		estfilter[2] = new nlobjSearchFilter('enddate', null, 'onorafter', getNSFiscalStartDate()); 
		estfilter[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', getNSFiscalEndDate());
		estfilter[4] = new nlobjSearchFilter('entitystatus', null, 'anyOf', [8, 10, 11, 20, 12]);
		estfilter[5] = new nlobjSearchFilter('mainline', null, 'is', 'T');

		/*  8 	2.5 Initiated
		 *  10 	3.0 Pending
		 *  11 	4.0 Verbal
		 *  20 	4.5 Deal Memo  	 
		 *  12 	5.0 In Negotiation
		 *  */

		var salesrepcolumn = new nlobjSearchColumn('salesrep');
		var amount = new nlobjSearchColumn('amount');
		var enddate = new nlobjSearchColumn('enddate');
		var entitystatus = new nlobjSearchColumn('entitystatus');

		var searchresults = nlapiSearchRecord('estimate', null, estfilter, [amount, salesrepcolumn, enddate, entitystatus]);

		if(searchresults == null)
		{
			if(InDebug)
			{
				content+="<p>No estimates this financial year for " + SalesRepName + "</p>";
			}
		}
		else
		{
			for(var thisEstimate = 0; thisEstimate < searchresults.length; thisEstimate++)
			{

				if (InDebug) 
				{
					content += "<p>in Estimate loop for " + SalesRepName + " - " + thisEstimate + "</p>";
				}

				if( Initiated != 0)
				{
					//initiated 8
					if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,8))
					{
						EmpInitiatedTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						SumInitiatedTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						nlapiLogExecution('EMERGENCY', 'Initiation test results: ' + searchresults[thisEstimate].getValue('amount'));

					}
				}

				if( Pending != 0)
				{
					//Pending 10
					if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,10))
					{
						EmpPendingTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						SumPendingTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
						nlapiLogExecution('EMERGENCY', 'Estimate test results: ' + searchresults[thisEstimate].getValue('amount'));
					}
				}

				//Verbally Agreed 11
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,11))
				{
					EmpVerbalTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					SumVerbalTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				//Deal Memo 20
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,20))
				{
					EmpDealMemoTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					SumDealMemoTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				//In Negotiation 12
				if(IsStatus(searchresults[thisEstimate].getValue('entitystatus') ,12))
				{
					EmpInNegTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
					SumInNegTotal  += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				EmpFYTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
				SumFYTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
			}
		}

		try 
		{	
			var dealfilter = new Array();
			dealfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
			dealfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', searchEmployeeResult[emp].getValue(empcolumn[0]));
			dealfilter[2] = new nlobjSearchFilter('trandate', null, 'onorafter', getNSFiscalStartDate()); 
			dealfilter[3] = new nlobjSearchFilter('trandate', null, 'onorbefore', getNSFiscalEndDate());
			dealfilter[4] = new nlobjSearchFilter('mainline', null, 'is', 'T');

			var salesrepcolumn = new nlobjSearchColumn('salesrep');
			var amount = new nlobjSearchColumn('amount');
			var trandate = new nlobjSearchColumn('trandate');

			var dealsearchresults = nlapiSearchRecord('salesorder', null, dealfilter, [amount, salesrepcolumn, trandate]);

			if(dealsearchresults == null)
			{
				if (InDebug) 
				{
					content += "<p>No deals so far</p>";
				}
			}
			else
			{
				for(var thisDeal = 0; thisDeal < dealsearchresults.length; thisDeal++)
				{
					if (InDebug) 
					{
						content += "<p>in deal loop for " + SalesRepName + " - " + thisDeal + "</p>";
					}

					EmpSignedTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					SumSignedTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));

					EmpFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					SumFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
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
			oppfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', searchEmployeeResult[emp].getValue(empcolumn[0]));
			oppfilter[2] = new nlobjSearchFilter('expectedclosedate', null, 'onorafter', getNSFiscalStartDate()); 
			oppfilter[3] = new nlobjSearchFilter('expectedclosedate', null, 'onorbefore', getNSFiscalEndDate());			   

			var salesrepcolumn = new nlobjSearchColumn('salesrep', null, 'group');

			//Change to Projected Total if needs be...
			var projectedtotal = new nlobjSearchColumn('projectedtotal', null, 'sum');

			var oppsearchresults = nlapiSearchRecord('opportunity', null, oppfilter, [projectedtotal, salesrepcolumn]);

			if(oppsearchresults == null)
			{
				if (InDebug) 
				{
					content += "<p><u>No Opportunities found for " + SalesRepName + " for this financial year</u></p>";
				}
			}
			else
			{

				switch(parseInt(oppsearchresults.length)) 
				{
					case null:
						if (InDebug) 
						{
							content += "<p>No sales...</p>";
						}
						break;
					case 1:
						var projectedtotal = oppsearchresults[0].getValue('projectedtotal', null, 'sum');

						EmpTargetTotal = projectedtotal;
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
			content += "<tr><td BGCOLOR='" + row_change(emp) + "'>&nbsp;</td>";
			content += "<td align='left' BGCOLOR='" + row_change(emp) + "' title='Sales Rep'><font size='2.4'>" + SalesRepName + "</font></td>";
			if( Initiated != 0)
			{
				content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Initiated Total for " + SalesRepName + " is $" 
						+ parseInt(EmpInitiatedTotal * Initiated) + "'><font size='2.4'>$" + parseInt(EmpInitiatedTotal * Initiated).formatMoney(0, '.', ',') + "</font></td>";
			}
			if( Pending != 0)
			{	
				content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Pending Total for " + SalesRepName + " is $" 
						+ parseInt(EmpPendingTotal * Pending) + "'><font size='2.4'>$" + parseInt(EmpPendingTotal * Pending).formatMoney(0, '.', ',') + "</font></td>";
			}
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Verbally Agreed Total for " + SalesRepName + " is $" 
					+ parseInt(EmpVerbalTotal * Verbal) + "'><font size='2.4'>$" + parseInt(EmpVerbalTotal * Verbal).formatMoney(0, '.', ',') + "</font></td>";
			
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Deal Memo Total for " + SalesRepName + " is $" 
					+ parseInt(EmpDealMemoTotal * DealMemo) + "'><font size='2.4'>$" + parseInt(EmpDealMemoTotal * DealMemo).formatMoney(0, '.', ',') + "</font></td>";
			
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='In Negotiation Total for " + SalesRepName + " is $" 
					+ parseInt(EmpInNegTotal * InNegotiation) + "'><font size='2.4'>$" + parseInt(EmpInNegTotal * InNegotiation).formatMoney(0, '.', ',') + "</font></td>";
			
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Actual Total for " + SalesRepName + " is $" + EmpSignedTotal 
					+ "'><font size='2.4'>$" + EmpSignedTotal.formatMoney(0, '.', ',') + "</font></td>";

			//this is where we calculate EmpLikelyTotal
			if( Initiated != 0)
			{
				EmpLikelyTotal = parseInt((parseFloat(EmpInitiatedTotal) * Initiated));
			}
			if( Pending != 0)
			{
				EmpLikelyTotal += parseInt((parseFloat(EmpPendingTotal) * Pending));
			}
			EmpLikelyTotal += parseInt((parseFloat(EmpVerbalTotal) * Verbal));
			EmpLikelyTotal += parseInt(parseFloat(EmpDealMemoTotal) * DealMemo);
			EmpLikelyTotal += parseInt(parseFloat(EmpInNegTotal) * InNegotiation);
			EmpLikelyTotal += parseInt(EmpSignedTotal);
			SumLikelyTotal += EmpLikelyTotal;

			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Likely Outcome for H1 " + thisyear() + " for " + SalesRepName + " is $" 
					+ EmpLikelyTotal.formatMoney(0, '.', ',') + "'><font size='2.4'>$" + EmpLikelyTotal.formatMoney(0, '.', ',') + "</font></td>";
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='H1 " + thisyear() + " Target for " + SalesRepName + " is $" 
					+ EmpTargetTotal.formatMoney(0, '.', ',') + "'><font size='2.4'>$" + EmpTargetTotal.formatMoney(0, '.', ',') + "</font></td>";

			if (isNaN(parseInt((EmpLikelyTotal / EmpTargetTotal) * 100))) 
			{
				EmpFYTotal = "n/a";
			}
			else 
			{
				EmpFYTotal = parseInt((EmpLikelyTotal / EmpTargetTotal) * 100);
			}
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='% Target Achieved for H1 " + thisyear() + " for " + SalesRepName 
					+ " is " + EmpFYTotal + "%'><font size='2.4'>" + EmpFYTotal + "%</font></td>";
			
			EmpCADTotal += parseInt(EmpTargetTotal - EmpLikelyTotal);
			content += "<td align='right' BGCOLOR='" + row_change(emp) + "' title='Deals Required to reach H1 target for " + SalesRepName + " is " + EmpCADTotal 
					+ "'><font size='2.4'>" + isNegative(EmpCADTotal) + "</font></td></tr>";
		} 
		catch (e) 
		{
			content += "format money issue..." + e.message + "<br>";
		}
	} //Employee For loop...

	try
	{
		//Set the column footer totals...
		content+= "<tr><td BGCOLOR='"+row_change(numOfEmployees) +"'>&nbsp;</td>" ;
		content+= "<td align='left' BGCOLOR='"+row_change(numOfEmployees) +"' title='Column Totals'><font size='2.4'><u><b>Column Totals</b></u></font></td>";
		
		if( Initiated != 0)
		{
			content+= "<td align='right' BGCOLOR='" +row_change(numOfEmployees) + "' title='Initiated Total is $" + parseInt(SumInitiatedTotal * Initiated).formatMoney(0, '.', ',') 
					+ "'><font size='2.4'><u><b>$" + parseInt(SumInitiatedTotal * Initiated).formatMoney(0, '.', ',') + "</b></u></font></td>" ;
		}
		if( Pending != 0)
		{
			content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='Pending Total is $" + parseInt(SumPendingTotal * Pending).formatMoney(0, '.', ',') 
					+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumPendingTotal * Pending).formatMoney(0, '.', ',') + "</b></u></font></td>";
		}
		
		
//		Altered Verbal Weighting
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='Verbally Agreed Total is $" + parseInt(SumVerbalTotal * Verbal).formatMoney(0, '.', ',')  
				+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumVerbalTotal * Verbal).formatMoney(0, '.', ',')  + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='Deal Memo Total is $" + parseInt(SumDealMemoTotal*DealMemo).formatMoney(0, '.', ',')  
				+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumDealMemoTotal*DealMemo).formatMoney(0, '.', ',')  + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='In Negotiation Total is $" + parseInt(SumInNegTotal*InNegotiation).formatMoney(0, '.', ',')   
				+ "'><font size='2.4'>&nbsp;<u><b>$" + parseInt(SumInNegTotal*InNegotiation).formatMoney(0, '.', ',')   + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='Actual Total for is $" + SumSignedTotal.formatMoney(0, '.', ',')  
				+ "'><font size='2.4'>&nbsp;<u><b>$" + SumSignedTotal.formatMoney(0, '.', ',')  + "</b></u></font></td>";
		
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='Likely Outcome for H1 " + thisyear() + " is $" 
				+ SumLikelyTotal.formatMoney(0, '.', ',') + "'><font size='2.4'><u><b>$" + SumLikelyTotal.formatMoney(0, '.', ',') + "</b></u></font></td>"; 
		
		content+= "<td align='right' BGCOLOR='"+row_change(numOfEmployees) +"' title='H1 " + thisyear() + " Target is $" + SumTargetTotal.formatMoney(0, '.', ',')  
				+ "'><font size='2.4'><u><b>$" + SumTargetTotal.formatMoney(0, '.', ',')  + "</b></u></font></td>";


		if(isNaN(parseInt((SumLikelyTotal / SumTargetTotal) * 100)))
		{
			SumFYTotal = "n/a";
		}
		else
		{
			SumFYTotal = String(parseInt((SumLikelyTotal / SumTargetTotal) * 100));
		}
		content+= "<td align='right' BGCOLOR='"+row_change(emp) +"' title='% Target Achieved for H1 " + thisyear() + " is " + SumFYTotal + "%'><font size='2.4'><u><b>" 
				+ SumFYTotal + "%</b></u></font></td>";
		
		SumCADTotal += parseInt(SumTargetTotal - SumLikelyTotal);
		
		content+= "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Deals Required to reach target is $" + SumCADTotal.formatMoney(0, '.', ',') 
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
function getPending(EmployeeID, EntityStatus)
{
	var output = 0;

	if(EntityStatus == null)
	{
		EntityStatus = 8;
	}
	// Sales Order search
	var  filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('type', null, 'is', 'SalesOrd');
	filters[2] = new nlobjSearchFilter('employee', null, 'is', EmployeeID);
	filters[3] = new nlobjSearchFilter('entitystatus', null, 'is', EntityStatus);

	var  columns = new Array();
	columns[0] = new nlobjSearchColumn('total');
	columns[1] = new nlobjSearchColumn('trandate');

	var searchSalesOrdersResults = nlapiSearchRecord('transaction',null,filters,columns);

	if(searchSalesOrdersResults == null)
	{
		output = 0;
	}
	else
	{

		for(var i=0;i<searchSalesOrdersResults.length;i++)
		{

			output = parseFloat(output) + parseFloat(searchSalesOrdersResults[i].getValue(columns[0]));	
		}
	}


	return 'CAD$ ' + output.formatMoney(0, '.', ',');
}


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
	nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST');
	try
	{
		var Today = new Date();
		var StartDate = Today.getFullYear();

		if (Today.getMonth() >= 9)
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - >=9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + StartDate;
		}	 
		else
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - <9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + String(parseInt(StartDate) - 1);
		}
	}
	catch(e)
	{
		nlapiLogExecution('DEBUG', 'NSFiscalStart Error', e.message);
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
	try 
	{

		nlapiLogExecution('DEBUG', 'InQuarter date Test...', date);
		if((date == null) || (quarter == null))
		{
			nlapiLogExecution('ERROR','InQuarter Issue...','InQuarter...date: ' + date + ', quarter: ' + quarter);
			return false;
		}

		//var ThisYear = thisyear();
		var TheDate = dateConv(date, 0); //Convert the NetSuite date to JS Date
		var TheMonth = TheDate.getMonth();


		quarter = quarter.toLowerCase();

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

/*******
 * Pass in the status and the status required...returns true if it's the same :)
 * @param {Object} status
 * @param {Object} statusrequired
 */  
function IsStatus(status, statusrequired)
{
	try 
	{		
		// nlapiLogExecution('DEBUG', 'IsStatus  Test...', status);
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
		portSearchFilters[1] = new nlobjSearchFilter('custrecord_ps_team', null, 'is', TeamNumber);

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
			portSucess = 1;
		}
		catch(e) // unable to find a certain result		
		{
			if (InDebug) 
			{
				content += "<p> Unable to get results for port search </p>";
			}
		}
	}
	else
	{
		// no results found
	}
}

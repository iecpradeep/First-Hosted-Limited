/*******************************************************
 * Name: YTDSalesBySalesRepPerUser.js - Cineflix Custom Portlet script
 * Script Type:	Client
 *
 * Version:	1.0.1 – 11/07/2012 – 1st release - AM
 *
 * Author:	FHL
 * Purpose:	YTD Sales by Sales Rep Per User - gathers information 
 * 			of sales from salesorder, opportunity, estimates records 
 * 			regarding the user if they are a Sales Rep and within 
 * 			the fiscal year.
 *          
 *******************************************************/

var portletFieldName = 'custentity_allowportletcustomisation';	//on emp record
var InDebug = false;
var content = "";
var TheTeam = new Array();		//change this if you wish...
var TeamName = 'All Teams';

//These are to be used to store the Total Values
var SumQ1Total = 0;
var SumQ2Total = 0;
var SumQ3Total = 0;
var SumQ4Total = 0;
var SumTotalYTD = 0;
var SumFYTotal = 0;
var SumTargetTotal = 0;
var SumCADTotal = 0;

///These are to be reset every iteration of the employee
var EmpQ1Total = 0;
var EmpQ2Total = 0;
var EmpQ3Total = 0;
var EmpQ4Total = 0;
var EmpTotalYTD = 0;
var EmpFYTotal = 0;
var EmpTargetTotal = 0;
var EmpCADTotal = 0;


/****************************
 * Year to Date Sales  Portlet
 * 
 * @param {Object} portlet
 * @param {Object} column
 */
function YTDSalesRepUser(portlet, column)
{ 
	var userId = nlapiGetUser();
	
	portlet.setTitle('Year to Date Result by Sales Person');

	//TheTeam Array replicates the values in the Teams Custom List on Cineflix System
	TheTeam[0] = 1;	
	TheTeam[1] = 2;
	TheTeam[2] = 3;

	var SalesRepName = '';
	var noResults = true;

	// Employee search
	var empfilter = new Array();
	empfilter[0] = new nlobjSearchFilter('salesrep', null, 'is', 'T');		// Must be a Sales Rep
	empfilter[1] = new nlobjSearchFilter('internalid', null, 'is', userId );

	var empcolumn = new Array();
	empcolumn[0] = new nlobjSearchColumn('internalid');	//We need the InternalID
	empcolumn[1] = new nlobjSearchColumn('entityid');	//And their first name...
	empcolumn[2] = new nlobjSearchColumn('custentity_team');	//And their team name...
	empcolumn[3] = empcolumn[1].setSort();	//Sort the columns...

	var searchEmployeeResult = nlapiSearchRecord('employee',null,empfilter,empcolumn);

	if(searchEmployeeResult == null)
	{
		portlet.setHtml( "<p>Access Unauthorised</p>" );
		return true;
	}

	var numOfEmployees = searchEmployeeResult.length;
	if (InDebug) 
	{
		content += "<p>numOfEmployees: " + numOfEmployees + ".....</p><p>" + getNSFiscalStartDate() + "....." + getNSFiscalEndDate() + "</p>";
	}
	//EmpTeam = searchEmployeeResult[0].getText(empcolumn[2]);


	//Set the headers...
	content+= "<tr><td>&nbsp;</td><td title='Sales Rep'><font size='2.4'><u><b>Sales Rep</b></u></font></td>"+
	"<td align='right' title='Q1 Actual'><font size='2.4'><u><b>Q1 Actual</b></u></font></td>" +
	"<td align='right' title='Q2 Actual'><font size='2.4'><u><b>Q2 Actual</b></u></font></td>"+
	"<td align='right' title='Q3 Actual'><font size='2.4'><u><b>Q3 Actual</b></u></font></td>"+
	"<td align='right' title='Q4 Actual'><font size='2.4'><u><b>Q4 Actual</b></u></font></td>"+
	"<td align='right' title='Total Year to Date'><font size='2.4'><u><b>Total YTD</b></u></font></td>"+
	"<td align='right' title='Full Target for " + thisyear() + "'><font size='2.4'><u><b>"+thisyear()+" Full Target</b></u></font></td>"+
	"<td align='right' title='Target Achieved for " + thisyear() + "'><font size='2.4'><u><b>% "+thisyear()+" Target Achieved</b></u></font></td>"+
	"<td align='right' title='Deals Required in CAD$ to reach target'><font size='2.4'><u><b>CAD$ of Deals Req.</b></u></font></td></tr>";

	// employee data - A.N
	for(var emp = 0; emp < numOfEmployees; emp++)
	{
		SalesRepName = searchEmployeeResult[emp].getValue(empcolumn[1]);

		EmpQ1Total = 0;
		EmpQ2Total = 0;
		EmpQ3Total = 0;
		EmpQ4Total = 0;
		EmpTotalYTD = 0;
		EmpFYTotal = 0;
		EmpTargetTotal = 0;
		EmpCADTotal = 0;

		var estfilter = new Array();
		estfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
		estfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', userId);
		estfilter[2] = new nlobjSearchFilter('enddate', null, 'onorafter', getNSFiscalStartDate()); 
		estfilter[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', getNSFiscalEndDate());
		estfilter[4] = new nlobjSearchFilter('entitystatus', null, 'anyOf', 12, 20);
		estfilter[5] = new nlobjSearchFilter('mainline', null, 'is', 'T');


		var salesrepcolumn = new nlobjSearchColumn('salesrep');
		var amount = new nlobjSearchColumn('amount');
		var enddate = new nlobjSearchColumn('enddate');

		var searchresults = nlapiSearchRecord('estimate', null, estfilter, [amount, salesrepcolumn, enddate]);

		if(searchresults == null)
		{	
			if(InDebug)
			{
				content+="<p>No estimates this financial year for Sales Rep " + emp + "</p>";
				content += " " + content +"";
			}

		}
		else
		{
			noResults = false;

			for(var thisEstimate = 0; thisEstimate < searchresults.length; thisEstimate++)
			{
				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q1"))
				{
					SumQ1Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					EmpQ1Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q2"))
				{
					SumQ2Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					EmpQ2Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q3"))
				{
					SumQ3Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					EmpQ3Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q4"))
				{
					SumQ4Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					EmpQ4Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				EmpFYTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
				SumTotalYTD += parseInt(searchresults[thisEstimate].getValue('amount'));
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
				noResults = false;
				
				for(var thisDeal = 0; thisDeal < dealsearchresults.length; thisDeal++)
				{
					if (InDebug) 
					{
						content += "<p>in loop</p>";
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q1"))
					{
						if (InDebug) 
						{
							content += "<p>q1!!!</p>";
						}

						SumQ1Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						EmpQ1Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q2"))
					{
						if (InDebug) 
						{
							content += "<p>q2!!!</p>";
						}

						SumQ2Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						EmpQ2Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q3"))
					{
						if (InDebug) 
						{
							content += "<p>q3!!!</p>";
						}
						SumQ3Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						EmpQ3Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q4"))
					{
						if (InDebug) 
						{
							content += "<p>q4!!!</p>";
						}
						SumQ4Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						EmpQ4Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					EmpFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					SumTotalYTD += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					//SumFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
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
			var oppfilter = new Array();
			//projectedtotal
			//weightedtotal
			oppfilter[0] = new nlobjSearchFilter('projectedtotal', null, 'greaterThan', 0).setSummaryType('sum');
			oppfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', userId);
			oppfilter[2] = new nlobjSearchFilter('trandate', null, 'onorafter', getNSFiscalStartDate()); 
			oppfilter[3] = new nlobjSearchFilter('trandate', null, 'onorbefore', getNSFiscalEndDate());



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
					SumFYTotal += parseInt(projectedtotal);

					break;
				default:
					if (InDebug) {
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

		try {
			//Set the row data now...
			content+= "<tr><td BGCOLOR='"+row_change(emp) +"'>&nbsp;</td>" ;
			content+="<td align='left' BGCOLOR='"+row_change(emp) +"' title='Sales Rep: " + SalesRepName + "'><font size='2.4'>" + SalesRepName +  "</font></td>";
			content+=  "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Q1 Actual for " + SalesRepName + " is $" + EmpQ1Total + "'><font size='2.4'>$" + parseInt(EmpQ1Total).formatMoney(0,".",",")   +  "</font></td>" ;
			content+=  "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Q2 Actual  for " + SalesRepName + " is $" + EmpQ2Total + "'><font size='2.4'>$" + parseInt(EmpQ2Total).formatMoney(0,".",",")  +  "</font></td>";
			content+=  "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Q3 Actual  for " + SalesRepName + " is $" + EmpQ3Total + "'><font size='2.4'>$" + parseInt(EmpQ3Total).formatMoney(0,".",",") +  "</font></td>";
			content+=   "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Q4 Actual  for " + SalesRepName + " is $" + EmpQ4Total + "'><font size='2.4'>$" + parseInt(EmpQ4Total).formatMoney(0,".",",")  +  "</font></td>";
			content+=   "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Total YTD  for " + SalesRepName + " is $" + EmpFYTotal + "'><font size='2.4'>$" + parseInt(EmpFYTotal).formatMoney(0,".",",") +  "</font></td>";
			content+=    "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Full Target  for " + SalesRepName + " is $" + EmpTargetTotal + "'><font size='2.4'>$" + parseInt(EmpTargetTotal).formatMoney(0,".",",") +  "</font></td>";
			content+=    "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Target Achieved  for " + SalesRepName + "'><font size='2.4'>";
		}  
		catch (e) 
		{
			content+=    "format money issue...";
		}

		if(isNaN(parseInt((EmpFYTotal / EmpTargetTotal) * 100)))
		{
			content+= "n/a";
		}
		else
		{
			content+= String(parseInt((EmpFYTotal / EmpTargetTotal) * 100));
		}

		content+= " %</font></td>";
		content+= "<td align='right' BGCOLOR='"+row_change(emp) +"' title='Deals Required'><font size='2.4'>";
		if(EmpTargetTotal == 0)
		{
			content+= isNegative(0 - parseInt(EmpFYTotal));
		}
		else
		{
			content+= isNegative(parseInt(EmpTargetTotal - EmpFYTotal));
		}

		SumCADTotal += parseInt(EmpTargetTotal - EmpFYTotal);
		content+=  "</font></td></tr>";

	} //Employee For loop...

	//Set the headers...
	content+= "<tr><td>&nbsp;</td><td><font size='2.4'><u><b>Column Totals:</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>$" + parseInt(SumQ1Total).formatMoney(0,".",",") + "</b></u></font></td>" ;
	content+=    "<td align='right' ><font size='2.4'><u><b>$" +  parseInt(SumQ2Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>$" +  parseInt(SumQ3Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>$" +  parseInt(SumQ4Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>$" +  parseInt(SumTotalYTD).formatMoney(0,".",",")   + "</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>$" + parseInt(SumFYTotal).formatMoney(0,".",",")   +"</b></u></font></td>";
	content+=    "<td align='right' ><font size='2.4'><u><b>";

	if(isNaN(parseInt(( SumTotalYTD / SumFYTotal) * 100)))
	{
		content+= "n/a";
	}
	else
	{
		content+= String(parseInt((SumTotalYTD / SumFYTotal) * 100));
	}

	content += "%</b></u></font></td>";
	content +=    "<td align='right' title='Total deals required to reach the " + thisyear() + " target is $" 
	+ SumCADTotal.formatMoney(0,".",",") + "'><font size='2.4'><u><b>" + isNegative(SumCADTotal) + "</b></u></font></td></tr>";


	if(InDebug)
	{
		var context = nlapiGetContext();
		content+= "<p>Usage remaining: " + context.getRemainingUsage() + "</p>";
	}

	if(noResults)
	{
		portlet.setHtml( "<p>You have no sales to display</p>" );
	}
	else
	{
		portlet.setHtml( content );
	}
	
	return true;


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
 * @param {Integer} EmployeeID
 * @param {Integer} EntityStatus
 *************************/

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



function isNegative(input)// puts brackets around negative CAD values 
{

	var output = input;

	if (input<0)
	{
		output = "<font color='green'><b>($"+ parseInt(Math.abs(output)).formatMoney(0,'.',',') + ")</b></font>";
	}
	else
	{
		output = "$" + parseInt(Math.abs(output)).formatMoney(0,'.',',');
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
			NSFiscalStart = "1/10/" + StartDate;
		}	 
		else
		{
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
 ***********************************/
function getNSFiscalEndDate()
{	
	var Today = new Date();
	var EndDate = Today.getFullYear();
	var NSFiscalEnd = "";
	if (Today.getMonth() >= 9)
	{
		NSFiscalEnd = "30/9/" + parseInt(EndDate + 1);
	}	 
	else
	{
		NSFiscalEnd = "30/9/" + parseInt(EndDate);
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

		//nlapiLogExecution('DEBUG', 'InQuarter date Test...', date);
		if((date == null) || (quarter == null))
		{
			//nlapiLogExecution('ERROR','InQuarter Issue...','InQuarter...date: ' + date + ', quarter: ' + quarter);
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
		//nlapiLogExecution('ERROR', 'InQuarter Error:', e.message);
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






Number.prototype.formatMoney = function(c, d, t)
{

	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 

};
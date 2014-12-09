/*******************************************************
 * Name:				Cineflix Custom Portlet script
 * Purpose:			Year to date Sales by Type of Sale, Team 1
 * Script Type:		Javascript
 * Version:			1.9.000
 * Date:					November 2011 - 14th November 2012
 * Author:				Pete Lewis, First Hosted Limited.
 *******************************************************/




//Todo:

//- Parameter to pass in the Team Number?


/****************************
 * Demo Portlet
 * 
 * @param {Object} portlet
 * @param {Object} column
 */
function YTDByTypeAllTeam1(portlet, column)
{   

	var InDebug = false;
	var content = "";
	var TheTeam = 1;//new Array();		//change this if you wish...
	var TeamName = "Team One";

	var Types = new Array();

	Types[0] = 1;
	Types[1] = 4;
	Types[2] = 6;
	Types[3] = 5;
	Types[4] = 2;
	Types[5] = 3;

//	Types[6] = 7;
//	6 and 7 are inactive

//	Initialising variables...
	var SumQ1Total = 0;
	var SumQ2Total = 0;
	var SumQ3Total = 0;
	var SumQ4Total = 0;
	var SumFYTotal = 0;
	var SumTargetTotal = 0;
	var SumCADTotal = 0;

//	/These are to be reset every iteration of the employee
	var TypeQ1Total = 0;
	var TypeQ2Total = 0;
	var TypeQ3Total = 0;
	var TypeQ4Total = 0;
	var TypeFYTotal = 0;
	var TypeTargetTotal = 0;
//	var TypeCADTotal = 0;

	var TypeName = 'TBA';



	portlet.setTitle('Year to Date Result by Type of Sale - ' + TeamName);




	//Set the headers...
	content+= "<tr><td>&nbsp;</td><td title='Type of Sale'><font size='2.4'><u><b>Type of Sale</b></u></font></td>"+
	"<td align='right' title='Type of Sale Q1 Actual'><font size='2.4'><u><b>Q1 Actual</b></u></font></td>" +
	"<td align='right' title='Type of Sale Q2 Actual'><font size='2.4'><u><b>Q2 Actual</b></u></font></td>"+
	"<td align='right' title='Type of Sale Q3 Actual'><font size='2.4'><u><b>Q3 Actual</b></u></font></td>"+
	"<td align='right' title='Type of Sale Q4 Actual'><font size='2.4'><u><b>Q4 Actual</b></u></font></td>"+
	"<td align='right' title='Type of Sale Total Year to Date'><font size='2.4'><u><b>Total YTD</b></u></font></td>"+
	"<td align='right' title='Type of Sale Full Target for " + thisyear() + "'><font size='2.4'><u><b>"+thisyear()+" Full Target</b></u></font></td>"+
	"<td align='right' title='Type of Sale Target Achieved for " + thisyear() + "'><font size='2.4'><u><b>% "+thisyear()+" Target Achieved</b></u></font></td>"+
	"<td align='right' title='Type of Sale Deals Required in CAD$ to reach target'><font size='2.4'><u><b>CAD$ of Deals Req.</b></u></font></td></tr>";


	//portlet.setHtml( content );
	//return true;  		             

	for(var TheType = 0; TheType < Types.length; TheType++)
	{

		TypeName = getTypeName(Types[TheType]);

		TypeQ1Total = 0;
		TypeQ2Total = 0;
		TypeQ3Total = 0;
		TypeQ4Total = 0;
		//TypeTotalYTD = 0;
		TypeFYTotal = 0;
		TypeTargetTotal = 0;
		TypeCADTotal = 0;

		var estfilter = new Array();
		estfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
		estfilter[1] = new nlobjSearchFilter('custbody_type_of_sale', null, 'anyOf', Types[TheType]);
		estfilter[2] = new nlobjSearchFilter('enddate', null, 'onorafter', getNSFiscalStartDate()); 
		estfilter[3] = new nlobjSearchFilter('enddate', null, 'onorbefore', getNSFiscalEndDate());
		estfilter[4] = new nlobjSearchFilter('entitystatus', null, 'anyOf', 12, 20);
		estfilter[5] = new nlobjSearchFilter('mainline', null, 'is', 'T');
		estfilter[6] = new nlobjSearchFilter('custentity_team', 'salesrep','is', TheTeam);

		//search join for Sales Rep : Team
		//  filters[2] = new nlobjSearchFilter( 'salesrep', 'customer', 'anyOf', -5, null );

		//content+= "<p>Emp: " + searchEmployeeResult[emp].getValue(empcolumn[0]) + ".....</p>";


		var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale');
		var amount = new nlobjSearchColumn('amount');
		var enddate = new nlobjSearchColumn('enddate');


		var searchresults = nlapiSearchRecord('estimate', null, estfilter, [amount, type_of_salecolumn, enddate]);

		if(searchresults == null)
		{
			if(InDebug)
			{
				content+="<p>No estimates this financial year for " + TypeName + "</p>";
			}

		}
		else
		{

			for(var thisEstimate = 0; thisEstimate < searchresults.length; thisEstimate++)
			{
				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q1"))
				{
					SumQ1Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					TypeQ1Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q2"))
				{
					SumQ2Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					TypeQ2Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q3"))
				{
					SumQ3Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					TypeQ3Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				if(InQuarter(searchresults[thisEstimate].getValue('enddate'), "q4"))
				{
					SumQ4Total += parseInt(searchresults[thisEstimate].getValue('amount'));
					TypeQ4Total += parseInt(searchresults[thisEstimate].getValue('amount'));
				}

				TypeFYTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
				SumFYTotal += parseInt(searchresults[thisEstimate].getValue('amount'));
			}
		}





		try 
		{	
			var dealfilter = new Array();
			dealfilter[0] = new nlobjSearchFilter('amount', null, 'greaterThan', 0);
			//dealfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', searchEmployeeResult[emp].getValue(empcolumn[0]));
			dealfilter[1] = new nlobjSearchFilter('custbody_type_of_sale', null, 'anyOf', Types[TheType]);
			dealfilter[2] = new nlobjSearchFilter('trandate', null, 'onorafter', getNSFiscalStartDate()); 
			dealfilter[3] = new nlobjSearchFilter('trandate', null, 'onorbefore', getNSFiscalEndDate());
			dealfilter[4] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			dealfilter[5] = new nlobjSearchFilter('custentity_team', 'salesrep','is', TheTeam);

			var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale');
			var amount = new nlobjSearchColumn('amount');
			var trandate = new nlobjSearchColumn('trandate');

			var dealsearchresults = nlapiSearchRecord('salesorder', null, dealfilter, [amount, type_of_salecolumn, trandate]);

			if(dealsearchresults == null)
			{
				if (InDebug) 
				{
					content += "<p>No deals so far for " + getTypeName(TheType)  + "</p>";
				}
			}
			else
			{

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
						TypeQ1Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q2"))
					{
						if (InDebug) 
						{
							content += "<p>q2!!!</p>";
						}

						SumQ2Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						TypeQ2Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q3"))
					{
						if (InDebug) 
						{
							content += "<p>q3!!!</p>";
						}
						SumQ3Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						TypeQ3Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					if(InQuarter(dealsearchresults[thisDeal].getValue('trandate'), "q4"))
					{
						if (InDebug) 
						{
							content += "<p>q4!!!</p>";
						}
						SumQ4Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
						TypeQ4Total += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					}

					TypeFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
					SumFYTotal += parseInt(dealsearchresults[thisDeal].getValue('amount'));
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
			//oppfilter[1] = new nlobjSearchFilter('salesrep', null, 'is', searchEmployeeResult[emp].getValue(empcolumn[0]));
			oppfilter[1] = new nlobjSearchFilter('custbody_type_of_sale', null, 'is', Types[TheType]);
			oppfilter[2] = new nlobjSearchFilter('trandate', null, 'onorafter', getNSFiscalStartDate()); 
			oppfilter[3] = new nlobjSearchFilter('trandate', null, 'onorbefore', getNSFiscalEndDate());
			//oppfilter[4] = new nlobjSearchFilter('mainline', null, 'is', 'T');
			oppfilter[4] = new nlobjSearchFilter('custentity_team', 'salesrep','is', TheTeam);




			var type_of_salecolumn = new nlobjSearchColumn('custbody_type_of_sale', null, 'group');

			//Change to Projected Total if needs be...
			var projectedtotal = new nlobjSearchColumn('projectedtotal', null, 'sum');

			var oppsearchresults = nlapiSearchRecord('opportunity', null, oppfilter, [projectedtotal, type_of_salecolumn]);

			if(oppsearchresults == null)
			{
				if (InDebug) {
					content += "<p><u>No Opportunities found for " + TypeName + " for this financial year</u></p>";
				}
			}
			else
			{

				switch(parseInt(oppsearchresults.length)) 
				{
				case null:
					if (InDebug) {
						content += "<p><u>No Opportunities found for " + TypeName + " for this financial year</u></p>";
					}
					break;
				case 1:
					var projectedtotal = oppsearchresults[0].getValue('projectedtotal', null, 'sum');

					TypeTargetTotal = projectedtotal;
					SumTargetTotal += parseInt(projectedtotal);
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



		//content+= "<p> SumQ1Total " + SumQ1Total + ".... SumFYTotal " +  SumFYTotal + " ... EmpQ1Total: " + EmpQ1Total + "</p> <p>&nbsp;</p>";

		try {
			//Set the row data now...
			content+= "<tr><td BGCOLOR='"+row_change(TheType) +"'>&nbsp;</td>" ;
			content+= "<td align='left' BGCOLOR='"+row_change(TheType) +"' title='Type of Sale: " + TypeName + ", Team: " + TheTeam +"'><font size='2.4'>" + TypeName +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Q1 Actual for " + TypeName + " is $" + TypeQ1Total + "'><font size='2.4'>$" + parseInt(TypeQ1Total).formatMoney(0,".",",")   +  "</font></td>" ;
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Q2 Actual  for " + TypeName + " is $" + TypeQ2Total + "'><font size='2.4'>$" + parseInt(TypeQ2Total).formatMoney(0,".",",")  +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Q3 Actual  for " + TypeName + " is $" + TypeQ3Total + "'><font size='2.4'>$" + parseInt(TypeQ3Total).formatMoney(0,".",",") +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Q4 Actual  for " + TypeName + " is $" + TypeQ4Total + "'><font size='2.4'>$" + parseInt(TypeQ4Total).formatMoney(0,".",",")  +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Total YTD  for " + TypeName + " is $" + TypeFYTotal + "'><font size='2.4'>$" + parseInt(TypeFYTotal).formatMoney(0,".",",") +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Full Target  for " + TypeName + " is $" + TypeTargetTotal + "'><font size='2.4'>$" + parseInt(TypeTargetTotal).formatMoney(0,".",",") +  "</font></td>";
			content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Target Achieved  for " + TypeName + "'><font size='2.4'>";
		} 
		catch (e) 
		{
			content+=    "<b>Format money issue -370-</b><br>";
		}




		if(isNaN(parseInt((TypeFYTotal / TypeTargetTotal) * 100)))
		{
			content+= "n/a";
			//parseInt((EmpFYTotal / EmpTargetTotal) * 100)
		}
		else
		{
			content+= String(parseInt((TypeFYTotal / TypeTargetTotal) * 100));
		}



		content+= " %</font></td>";
		content+= "<td align='right' BGCOLOR='"+row_change(TheType) +"' title='Deals Required'><font size='2.4'>";
		if(TypeTargetTotal == 0)
		{
			content+= isNegative(0 - parseInt(TypeFYTotal));

		}
		else
		{
			content+= isNegative(parseInt(TypeTargetTotal - TypeFYTotal));
		}

		SumCADTotal += parseInt(TypeTargetTotal - TypeFYTotal);
		content+=  "</font></td></tr>";

	} //Type For() loop...


	//Set the Footer Data now...
	content+= "<tr><td>&nbsp;</td><td><font size='2.4'><u><b>Column Totals:</b></u></font></td>";
	content+=    "<td align='right' title='Q1 Actual Sum is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" + parseInt(SumQ1Total).formatMoney(0,".",",") + "</b></u></font></td>" ;
	content+=    "<td align='right' title='Q2 Actual Sum is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" +  parseInt(SumQ2Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' title='Q3 Actual Sum is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" +  parseInt(SumQ3Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' title='Q4 Actual Sum is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" +  parseInt(SumQ4Total).formatMoney(0,".",",")  + "</b></u></font></td>";
	content+=    "<td align='right' title='Total FY Sum is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" +  parseInt(SumFYTotal).formatMoney(0,".",",")   + "</b></u></font></td>";
	content+=    "<td align='right' title='Full Target is $" + parseInt(SumQ1Total).formatMoney(0,".",",") + "'><font size='2.4'><u><b>$" + parseInt(SumTargetTotal).formatMoney(0,".",",")   +"</b></u></font></td>";
	content+=    "<td align='right' title='Target achieved'><font size='2.4'><u><b>";

	if(isNaN(parseInt(( SumFYTotal / SumTargetTotal) * 100)))
	{
		content+= "n/a";
	}
	else
	{
		content+= String(parseInt((SumFYTotal / SumTargetTotal) * 100));
	}

	content += "%</b></u></font></td>";
	content+=    "<td align='right' title='Total deals required to reach the " + thisyear() + " target is $" + SumCADTotal.formatMoney(0,".",",") + "'><font size='2.4'><u><b>";

	content += isNegative(SumCADTotal);
	content += "</b></u></font></td></tr>";

	if(InDebug)
	{
		var context = nlapiGetContext();
		content+= "<p>Usage remaining: " + context.getRemainingUsage() + "</p>";
	}

	portlet.setHtml( content );
	return true;
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
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - >=9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + Today.getFullYear();
		}	 
		else
		{
			nlapiLogExecution('DEBUG', 'NSFiscalStart test', 'TEST - <9');
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getMonth()', 'Today.getMonth()' + Today.getMonth());
			nlapiLogExecution('DEBUG', 'NSFiscalStart Today.getFullYear()', 'Today.getFullYear()' + Today.getFullYear());
			NSFiscalStart = "1/10/" + String(parseInt(Today.getFullYear()) - 1);
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
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear() + 1);
	}	 
	else
	{
		NSFiscalEnd = "30/9/" + parseInt(Today.getFullYear());
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

		var ThisYear = thisyear();
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

/*
Array.prototype.InternalID = function(x)
{
	this.InternalID = x;
	return this.InternalID;
}
 */

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

Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
};
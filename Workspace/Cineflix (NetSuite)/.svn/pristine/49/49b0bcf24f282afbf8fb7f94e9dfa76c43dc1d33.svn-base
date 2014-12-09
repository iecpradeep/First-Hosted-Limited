/*******************************************************
 * Name:		Cineflix Long Term Position Custom Portlet script
 * Script Type:	Javascript
 * Version:		1.1.0
 * Date:		November 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/




function LongTermPositionPortlet(portlet, column)
{   
	portlet.setTitle('Long term position (extract)');

	var content = "";

	//Set the headers...
	content+= "<th><td><font size='2.4'><u><b>Title</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Broadcasters</b></u></font></td>" +
	"<td><font size='2.4'><u><b>Currency</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Deal Value</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Initiated</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Pending</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Verbally agreed</b></u></font></td>"+
	"<td><font size='2.4'><u><b>In Negotiation</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Signed in " + thisyear() + "</b></u></font></td>"+  
	"<td><font size='2.4'><u><b>Signed in " + (parseInt(thisyear()) - 1) + "</b></u></font></td>"+    	   
	"<td><font size='2.4'><u><b>Signed in " + (parseInt(thisyear()) - 2) + "</b></u></font></td>"+
	"<td><font size='2.4'><u><b>Signed in " + (parseInt(thisyear()) - 3) + "</b></u></font></td>"+
	"<td><font size='2.4'><u><b>% "+thisyear()+" Target Achieved</b></u></font></td>"+
	"<td><font size='2.4'><u><b>CAD$ of Deals Req.</b></u></font></td></th>";


	//var context = nlapiGetContext();
	// content+= "<p>Usage remaining: " + context.getRemainingUsage() + "</p>";

	//Searches...

	// Name search
	var filter = new Array();
	filter[0] = new nlobjSearchFilter('salesrep', null, 'is', 'T');
	filter[1] = new nlobjSearchFilter('custentity_team', null, 'is', '1');
	//filter[2] = new nlobjSearchFilter('salesrep', null, 'is', 'T');
	//filter[1] = new nlobjSearchFilter('salesrep', null, 'is', 'T'); //inactive?


	var column = new Array();
	column[0] = new nlobjSearchColumn('internalid');
	column[1] = new nlobjSearchColumn('entityid');
	//column[1] = new nlobjSearchColumn('addressee');

	var searchEmployeeResult = nlapiSearchRecord('employee',null,filter,column);
	//10 units


	// Sales Order search
	var  filters = new Array();
	filters[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filters[1] = new nlobjSearchFilter('type', null, 'is', 'SalesOrd');

	var  columns = new Array();
	columns[0] = new nlobjSearchColumn('salesrep');
	columns[1] = new nlobjSearchColumn('total');
	columns[2] = new nlobjSearchColumn('enddate');


//	var searchSalesOrdersResults = nlapiSearchRecord('transaction',null,filters,columns);
	//20 units
	// Opportunity search 
	var  filterstarget = new Array();
	filterstarget[0] = new nlobjSearchFilter('mainline', null, 'is', 'T');
	filterstarget[1] = new nlobjSearchFilter('type', null, 'is', 'Opprtnty');

	var  columnstarget = new Array();
	columnstarget[0] = new nlobjSearchColumn('salesrep');
	columnstarget[1] = new nlobjSearchColumn('total');
	columnstarget[2] = new nlobjSearchColumn('trandate');
	columnstarget[3] = new nlobjSearchColumn('entitystatus');

//	var searchOpportunityResults = nlapiSearchRecord('transaction',null,filterstarget,columnstarget);
	//30 units used

	// End of searches...

	if(searchEmployeeResult == null)
	{
		content+= "<tr><td>&nbsp;</td><td BGCOLOR='"+row_change(1) +"'><font size='2'>No search results</font></td>";
	}
	else
	{
		for(var x=0;x < searchEmployeeResult.length; x++)
		{

			//search opportunities
			//search 

			content+= "<tr><td>&nbsp;</td><td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>"+ searchEmployeeResult[x].getValue(column[1]) + "</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>Error: "+ searchEmployeeResult[x].getValue(column[0]) + "</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>CAD</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>For "+ searchEmployeeResult[x].getValue(column[1]) + "</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>Calculating...</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>X</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> Verbally Agreed?</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> In Neg</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> 2012</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> 2011</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> 2010</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> 2009</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'> % Achieved</font></td>";
			content+= "<td BGCOLOR='"+row_change(x) +"' title='UserID: "+ searchEmployeeResult[x].getValue(column[0]) + "'><font size='2'>CAD$ " + isNegative(searchEmployeeResult[x].getValue(column[0])) + "</font></td></tr>";

		}
	}

	var context = nlapiGetContext();
	content+= "<p>Usage remaining: " + context.getRemainingUsage() + "</p>";       
	portlet.setHtml(content);
	return true;



	// totals array... 
	var total = new Array();
	for (var z = 0; z<7; z++){
		total[z] = 0; 
	}


	// draw table values... 
	for (var i = 0; i< searchResult.length; i++)	//for each employee in the search results...
	{
		content+= "<tr><td>&nbsp;</td><td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ searchResult[i].getValue(column[1]) + "</font></td>";
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),1,searchResultstarget,columnstarget)  + "</font></td>";    	   
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),2,searchResultstarget,columnstarget)  + "</font></td>";
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),3,searchResultstarget,columnstarget)  + "</font></td>";    	   
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),4,searchResultstarget,columnstarget)  + "</font></td>";
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),0,searchResults,columns) + "</font></td>";    	   
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ getTotal(searchResult[i].getValue(column[0]),0,searchResultstarget,columnstarget) + "</font></td>";
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ (getTotal(searchResult[i].getValue(column[0]),0,searchResults,columns)/getTotal(searchResult[i].getValue(column[0]),0,searchResultstarget,columnstarget))*100 + "</font></td>";    	   
		content+= "<td BGCOLOR='"+row_change(i) +"'><font size='2'>"+ isNegative((getTotal(searchResult[i].getValue(column[0]),0,searchResultstarget,columnstarget)-getTotal(searchResult[i].getValue(column[0]),0,searchResults,columns))) + "</font></td>";

		content += "</tr>";

		// get totals   
		total[0] += parseFloat(getTotal(searchResult[i].getValue(column[0]),1,searchResultstarget,columnstarget));
		total[1] += parseFloat(getTotal(searchResult[i].getValue(column[0]),2,searchResultstarget,columnstarget));
		total[2] += parseFloat(getTotal(searchResult[i].getValue(column[0]),3,searchResultstarget,columnstarget));
		total[3] += parseFloat(getTotal(searchResult[i].getValue(column[0]),4,searchResultstarget,columnstarget));
		total[4] += parseFloat(getTotal(searchResult[i].getValue(column[0]),0,searchResults,columns));
		total[5] += parseFloat(getTotal(searchResult[i].getValue(column[0]),0,searchResultstarget,columnstarget));
	}

	// draw totals...
	content+= "<tr><td>&nbsp;</td><td BGCOLOR='#EDC393'><font size='2'><b>YTD Total</b></font></td>";
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[0]  + "</b></font></td>";    	   
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[1]  + "</b></font></td>";
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[2]  + "</b></font></td>";    	   
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[3] + "</b></font></td>";
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[4] + "</b></font></td>";    	   
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ total[5] + "</b></font></td>";
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ ((total[4]/total[5])*100) + "</b></font></td>";    	   
	content+= "<td BGCOLOR='#EDC393'><font size='2'><b>"+ isNegative(total[5]-total[4]) + "</b></font></td>";

	content += "</tr>";


	portlet.setHtml(content);
}



function getTotal(internalID, mode,searchResults,columns)// mode 0 = all year, 1-4 selects quarter of the year 
{
	var single_amounts = new Array();
	var j = 0;

	if (mode == 0){
		for (var i = 0; i<searchResults.length; i++){

			if  (searchResults[i].getValue(columns[0]) == internalID && isDateinRange(searchResults[i].getValue(columns[2]),"1/10/"+ (thisyear()-1) + "","30/9/"+ thisyear()+ "") == true)
			{
				single_amounts[j] = searchResults[i].getValue(columns[1]);
				j++;
			}
		}}

	if (mode == 1){
		for (var i = 0; i<searchResults.length; i++){

			if  (searchResults[i].getValue(columns[0]) == internalID && isDateinRange(searchResults[i].getValue(columns[2]),"1/10/"+ (thisyear()-1) + "","30/9/"+ thisyear()+ "") == true && searchResults[i].getValue(columns[3])== "3.0 Pending")
			{
				single_amounts[j] = searchResults[i].getValue(columns[1]);
				j++;
			}
		}}

	if (mode == 2){
		for (var i = 0; i<searchResults.length; i++){

			if  (searchResults[i].getValue(columns[0]) == internalID && isDateinRange(searchResults[i].getValue(columns[2]),"1/10/"+ (thisyear()-1) + "","30/9/"+ thisyear()+ "") == true && searchResults[i].getValue(columns[3])== "4.0 Verbal")
			{
				single_amounts[j] = searchResults[i].getValue(columns[1]);
				j++;
			}
		}}

	if (mode == 3){
		for (var i = 0; i<searchResults.length; i++){

			if  (searchResults[i].getValue(columns[0]) == internalID && isDateinRange(searchResults[i].getValue(columns[2]),"1/10/"+ (thisyear()-1) + "","30/9/"+ thisyear()+ "") == true && searchResults[i].getValue(columns[3])== "5. In Negotiation")
			{
				single_amounts[j] = searchResults[i].getValue(columns[1]);
				j++;
			}
		}}

	if (mode == 4){
		for (var i = 0; i<searchResults.length; i++){

			if  (searchResults[i].getValue(columns[0]) == internalID && isDateinRange(searchResults[i].getValue(columns[2]),"1/10/"+ (thisyear()-1) + "","30/9/"+ thisyear()+ "") == true && searchResults[i].getValue(columns[3])== "Actual")
			{
				single_amounts[j] = searchResults[i].getValue(columns[1]);
				j++;
			}
		}}


	var total = 0;

	for (var x = 0; x<j; x++)
	{
		total+= parseFloat((single_amounts[x])); 
	}


	return total;
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
		output ="<font color='green'><b>($"+ parseInt(Math.abs(output)).formatMoney(0,'.',',') + ")</b></font>";
	}
	else
	{
		output = "$" + parseInt(Math.abs(output)).formatMoney(0,'.',',');
	}

	return output;
}

function row_change(input)// changes the colour of the row 
{
	if (input%2 == 0)
		return "#f0f0f0";
	else
		return "#fefefe";


}

function thisyear()// returns the business year 
{
	var today = new Date();
	var year = today.getFullYear();

	if (today.getMonth() >= 10)	 
		year = today.getFullYear()+1;


	return year;

}

function isDateinRange(date,startdate,enddate)// checks if date is in the range of startdate/enddate 
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

function jsDate_To_nsDate(jsdate)// used for dateConv
{	  	
	var theDay = jsdate.getDate();
	var theMonth = jsdate.getMonth()+1;
	var theYear = jsdate.getFullYear();

	var nsdate = theDay+"/"+theMonth+"/"+theYear;

	return nsdate;

}

function nsDate_To_jsDate(nsdate)// used for dateConv 
{

	var dateStr = nsdate.split("/");  
	var theDay = dateStr[0];
	var theMonth = dateStr[1] - 1;
	var theYear = dateStr[2];


	var jsdate= new Date(theYear ,theMonth ,theDay);
	return jsdate;

}

function dateConv(date,mode)//mode 0 = NetSuite to JS | mode 1 = JS to NetSuite 
{
	if (mode == 0)
		return nsDate_To_jsDate(date);

	if (mode == 1)
		return jsDate_To_nsDate(date);

}



Number.prototype.formatMoney = function(c, d, t)
{
	var n = this, c = isNaN(c = Math.abs(c)) ? 2 : c, d = d == undefined ? "," : d, t = t == undefined ? "." : t, s = n < 0 ? "-" : "", i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : ""); 
};

















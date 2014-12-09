/*
 *    Welcome the script of many random features.
 *    First revision - 9th February 2011.
 *    Multiple revisions since then! Probably on like number 37982 now!!!
 */

function onsave_makeMandatory()
{
	// This little script ensures that the Department is mandatory.
	// To ensure other fields are mandatory, simply copy and paste the below 
	// code and change the GetFieldValue parameter, and alert() message
		
	try
	{
		var theField = nlapiGetFieldValue('department');
		
		if(theField.length == 0)
		{
			alert('You have not selected a Department!');
			return false;	
		}	
		else
		{
			return true;
		}
	}
	catch(exception)
	{
		alert('A user error has occurred!\n' + exception);
	}
}

function onsave_FillQuarterDetails()
{
	try
	{
		var theField = nlapiGetFieldValue('expectedclosedate');
		
		if(theField.length == 0)
		{
			alert('You have not selected an Expected Close Date!');
			return false;	
		}	
		else
		{
			return getQuarter(theField);
		}
	}
	catch(exception)
	{
		alert('A user error has occurred!\n' + exception);
	}
}

function getQuarter(CloseDate)
{
	var xDate = new Date(CloseDate);
	var theValue = '';
	var theYear = xDate.getFullYear();
	//xDate.getMonth();
	
	var months=new Array(12);
	months[0]="January";
	months[1]="February";
	months[2]="March";
	months[3]="April";
	months[4]="May";
	months[5]="June";
	months[6]="July";
	months[7]="August";
	months[8]="September";
	months[9]="October";
	months[10]="November";
	months[11]="December";
	
	//alert("The selected month is " + months[xDate.getMonth()]);
	// Test alert:
	// alert('xDate = \"' + xDate.getMonth() + '\".');
	
	switch(parseInt(xDate.getMonth()))
	{
		// Quarter 2 spans the years, so we have to account for that
		case 10:
		case 11:
			theValue = 'Q2 ' + theYear + 1;
			break;
		case 0:
			theValue = 'Q2 ' + theYear;
			break;
		
		// Quarter 3 for Feb, Mar, Apr
		case 1:
		case 2: 
		case 3:
			theValue = 'Q3 ' + theYear;
			break;
		
		// Quarter 4 for May, Jun, Jul
		case 4:
		case 5:
		case 6:
			theValue = 'Q4 ' + theYear;
			break;
		
		// Quarter 1 for Aug, Sep, Oct
		case 7:
		case 8: 
		case 9:
			theValue = 'Q1 ' + theYear + 1;
			break;
	}
	//Test alert box
	//alert(theValue);
	
	nlapiSetFieldValue('custbody_expected_close_quarter',theValue,false,false);
	return true;
}


function itemSelect_CopyValue(type, name)
{
	alert(name);
	alert(parseInt(type));
	
	var lineCount = nlapiGetLineItemCount('item');
	alert(lineCount);
	
	for (var lineNum = 1; lineNum <= lineCount; lineNum++)
	{
		var checked = nlapiGetLineItemValue('item','custcol_removeline',lineNum);
		
		//alert(checked);
		if (checked == 'F') 
		{	
			nlapiSelectLineItem('item',lineNum);
			nlapiRemoveLineItem('item');
			lineNum--;
				
		} //if
		
	} //for
	
	
	
}






















/* Created by Toby Davidson - Probe IT

*/

function compareDate()
{
var lineship = nlapiGetCurrentLineItemValue('item','custcol_shipdate');
var lineshipdate = new Date(lineship);
var us_lineshipdate = convertToUSDate(lineshipdate);

var headership = nlapiGetFieldValue('shipdate');
var headershipdate = new Date(headership);
var us_headershipdate = convertToUSDate(headershipdate);

alert(lineship);
alert(us_lineshipdate);

alert(headership);
alert(us_headershipdate);

If (isNotBlank(us_lineshipdate))
	{
	If (isNotBlank(us_headershipdate))
		{	
		if (us_lineshipdate > us_headershipdate)
			{	
				alert('line ship date is after header ship date');
				lineship = nlapiStringToDate(us_lineshipdate); 
				var uk_lineship = convertToUKDate(lineship);
				nlapiSetFieldValue('shipdate','uk_lineship');	
			}	
		}
	}
	return true;
}

function isBlank(fld){return (fld==null||fld=='');}
function isNotBlank(fld){return (fld!=null&&fld!='');}

function convertToUSDate(Date)
{
var parts = Date.split('/');
var us_shipdate = parts[2]+'/'+parts[1]+'/'+parts[0];
return us_shipdate;
}

function convertToUKDate(Date)
{
var parts = Date.split('/');
var us_shipdate = parts[1]+'/'+parts[2]+'/'+parts[0];
return uk_shipdate;
}
/* Created by Toby Davidson - Probe IT

*/

function initialiseDate()
{
var lineship = nlapiGetCurrentLineItemValue('item','custcol_shipdate');
if (isBlank(lineship))
	{
	nlapiSetCurrentLineItemValue('item', 'custcol_shipdate', nlapiGetFieldValue('shipdate'));
	}
}

function compareDate()
{
var lineship = nlapiGetCurrentLineItemValue('item','custcol_shipdate');
if (isBlank(lineship))
	{
	nlapiSetCurrentLineItemValue('item', 'custcol_shipdate', nlapiGetFieldValue('shipdate'));
	}
var us_lineshipdate = convertDate(lineship);

var headership = nlapiGetFieldValue('shipdate');
var us_headershipdate = convertDate(headership);

var linedate2 = new Date(us_lineshipdate);
var shipdate2 = new Date(us_headershipdate);


if (isNotBlank(linedate2))
	{
	if (isNotBlank(shipdate2))
		{	
		if (linedate2 != shipdate2)
			{	
				var uk_lineship = convertDate(us_lineshipdate);
				nlapiSetFieldValue('shipdate', uk_lineship);	
			}	
		}
	}
	return true;
}

function setSOLineDate()

{

var hdrshipdate = nlapiGetFieldValue('shipdate');

var newshipdate = new Date(hdrshipdate);


	if (isNotBlank(hdrshipdate))


	{
	
		nlapiSetCurrentLineItemValue('item', 'custcol_shipdate', nlapiDateToString(newshipdate), true, true);

	}

	
	else
	
	{
	
		alert('You must fill in the Delivery Date field at the top of the SO before adding line items');

	}


return true;

}

function isBlank(fld){return (fld==null||fld=='');}
function isNotBlank(fld){return (fld!=null&&fld!='');}

function convertDate(changeDate)
{
var parts = changeDate.split('/');
var shipdate = parts[1]+'/'+parts[0]+'/'+parts[2];
return shipdate;
}
/* Created by Toby Davidson - Probe IT
This script populates a date into the line on a PO from the duedate field at the top of the form.
*/

function setPOLineDate()
{
var duedate = nlapiGetFieldValue('duedate');
var newdate = new Date(duedate);

	if (isNotBlank(duedate))
	{
	nlapiSetCurrentLineItemValue('item', 'custcol_po_requiredline_date', nlapiDateToString(newdate), true, true);
	}
	else
	{
	alert('You must fill in the Due Date field at the top of the PO before adding line items');
	}
return true;
}

function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
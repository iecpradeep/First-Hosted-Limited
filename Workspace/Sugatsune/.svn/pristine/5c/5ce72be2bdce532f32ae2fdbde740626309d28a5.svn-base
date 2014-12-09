/* Script Created by T Davidson - Probe IT 5/4/2011
Script looks up a script parameter and checks to see if the correct form is being used based on whether or not
the customer has an active credit limit or not.

It is either triggered by a page initialise value, or field changed on the entity field.

*/

function pageInit(type)
{
var updateform = nlapiGetFieldValue('custbody_probe_formselected');
var customer = nlapiGetFieldValue('entity');
if ((type == 'create') && (updateform == 'F') && (isNotBlank(customer)))
	{
	var context = nlapiGetContext();
	var creditlimitform = context.getSetting('SCRIPT', 'custscript_credlimform');
	var nocreditlimitform = context.getSetting('SCRIPT', 'custscript_nocredlimform');

	var creditlimit = nlapiLookupField('customer', customer, 'creditlimit');
	var form = nlapiGetFieldValue('customform');
	if ((creditlimit > 0) && (form != creditlimitform))
		{
		nlapiSetFieldValue('customform', creditlimitform);
		}
		else
		{
		if ((creditlimit == 0) && (form != nocreditlimitform))
			{
			nlapiSetFieldValue('customform', nocreditlimitform);
			}
		}
	}

return true;
}

function fieldChanged(type, name)
{
var updateform = nlapiGetFieldValue('custbody_probe_formselected');
if ((name == 'entity') && (updateform == 'F'))
	{
	var context = nlapiGetContext();
	var creditlimitform = context.getSetting('SCRIPT', 'custscript_credlimform');
	var nocreditlimitform = context.getSetting('SCRIPT', 'custscript_nocredlimform');
	var customer = nlapiGetFieldValue('entity');
	var creditlimit = nlapiLookupField('customer', customer, 'creditlimit');
	
	if (creditlimit > 0)
		{
		nlapiSetFieldValue('customform', creditlimitform);
		nlapiSetFieldValue('custbody_probe_formselected', 'T');
		}
	else
		{
		if (creditlimit == 0)
			{
			nlapiSetFieldValue('customform', nocreditlimitform);
			
			}
		}
	}
return true;
}

function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
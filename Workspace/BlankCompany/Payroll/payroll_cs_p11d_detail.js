
function p11ddFieldChanged(type, fieldname, linenum)
{
	
	if (fieldname == 'custrecord_pr_p11dd_gross_amt' || fieldname == 'custrecord_pr_p11dd_amt_employee')
	{
		var grossAmount = setFloat(nlapiGetFieldValue('custrecord_pr_p11dd_gross_amt'));
        var amountTaxedPaid = setFloat(nlapiGetFieldValue('custrecord_pr_p11dd_amt_employee'));
        var netAmount = grossAmount - amountTaxedPaid;
        nlapiSetFieldValue('custrecord_pr_p11dd_net_amount', netAmount);
    }
}

function p11ddPageInit(type)
{
   // alert('hello')
}

function p11ddSave()
{
    return true;
}
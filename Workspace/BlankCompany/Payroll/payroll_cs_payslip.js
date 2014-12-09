
function prSlipFieldChanged(type, fieldname, linenum)
{


    if(fieldname == 'custrecord_ps_employee')
    {
        var YTDBool = nlapiGetFieldValue("custrecord_pr_ps_ytd") == 'T';

        if(YTDBool)
        {
            //set name field from employee
            var empName = nlapiGetFieldText('custrecord_ps_employee');
            if(!isNullOrEmpty(empName))
            {
                nlapiSetFieldValue('name',"YTD Payslip for " + empName);
            }
        }
    }

    if(fieldname == 'custrecord_pr_ps_pay_date')
    {
        var YTDBool = nlapiGetFieldValue("custrecord_pr_ps_ytd") == 'T';
        if(YTDBool)
        {
            var payDate = nlapiGetFieldValue("custrecord_pr_ps_pay_date");

            var jurisdiction = nlapiGetFieldValue("custrecord_pr_ps_country");

            if(!isNullOrEmpty(payDate) && !isNullOrEmpty(jurisdiction))
            {
                var taxYearEnding = getTaxYear(payDate,jurisdiction);
                if(!isNullOrEmpty(taxYearEnding))
                {
                    nlapiSetFieldValue('custrecord_ps_year',taxYearEnding);
                }
            }
        }
    }
}

function prSlipOnSave()
{
    var returnValue = true;
	return returnValue;
}

function prSlipPageInit(type)
{
    //clear values for mandatory fields so user enters amounts
    if(type =='create')
    {
        nlapiSetFieldValue('custrecord_ps_gross_wage',"");
        nlapiSetFieldValue('custrecord_ps_tax_deduct',"");
    }


}



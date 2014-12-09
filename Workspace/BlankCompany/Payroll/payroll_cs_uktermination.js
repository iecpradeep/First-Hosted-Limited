var payrollInitBool = false;
var payrollInitPendingBool = false;
var payroll = {};
var ctxObj = nlapiGetContext();
var useSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");
var lastEmpId = "";

function prPageInit(type)
{
    if(!useSubsidiaryBool)
    {
        initPayroll();
    }

    var isWeek1Month1 = nlapiGetFieldValue('custrecord_pr_p45_week1month1') == 'T';

    nlapiDisableField('custrecord_pr_p45_p11weekno',isWeek1Month1);
    nlapiDisableField('custrecord_pr_p45_p11monthno',isWeek1Month1);
    nlapiDisableField('custrecord_pr_p45_totalpay_td',isWeek1Month1);
    nlapiDisableField('custrecord_pr_p45_totaltax_td',isWeek1Month1);
}


function prFieldChanged(type, fieldname, linenum)
{
    switch(fieldname)
    {
        case 'custrecord_pr_p45_week1month1':

        var isCheckedBool = nlapiGetFieldValue(fieldname) == 'T';

        if(isCheckedBool)
        {
            // clear the field contents
            nlapiSetFieldValue('custrecord_pr_p45_p11weekno','',false);
            nlapiSetFieldValue('custrecord_pr_p45_p11monthno','',false);
            nlapiSetFieldValue('custrecord_pr_p45_totalpay_td','',false);
            nlapiSetFieldValue('custrecord_pr_p45_totaltax_td','',false);
        }

        nlapiDisableField('custrecord_pr_p45_p11weekno',isCheckedBool);
        nlapiDisableField('custrecord_pr_p45_p11monthno',isCheckedBool);
        nlapiDisableField('custrecord_pr_p45_totalpay_td',isCheckedBool);
        nlapiDisableField('custrecord_pr_p45_totaltax_td',isCheckedBool);

        break;
        case 'custrecord_pr_p45_p11weekno':

        var valueStr = nlapiGetFieldValue(fieldname);

        if(valueStr != '')
        {
            nlapiSetFieldValue('custrecord_pr_p45_p11monthno','',false);
        }

        nlapiDisableField('custrecord_pr_p45_p11monthno',(valueStr != ''));


        break;
        case 'custrecord_pr_p45_p11monthno':

        var valueStr = nlapiGetFieldValue(fieldname);

        if(valueStr != '')
        {
            nlapiSetFieldValue('custrecord_pr_p45_p11weekno','',false);
        }

        nlapiDisableField('custrecord_pr_p45_p11weekno',(valueStr != ''));

        break;
        case 'custrecord_pr_p45_leavingdate':

        var dateStr = nlapiGetFieldValue('custrecord_pr_p45_leavingdate');
        var empId = nlapiGetFieldValue('custrecord_pr_p45_employee');

        // set totals.
        getTaxTotals(empId,dateStr);

        break;
    }

    return true;
}

function prValidateField(type, fieldname, linenum)
{
    return true;
}


function prPostSourcing(type,fieldname,linenum)
{
    switch(fieldname)
    {
        case 'custrecord_pr_p45_employee':

            var empId = nlapiGetFieldValue('custrecord_pr_p45_employee');

            if(useSubsidiaryBool)
            {
                var subsidiaryId = nlapiGetFieldValue('custrecord_pr_p45_subsidiary');
                initPayroll(subsidiaryId);
            }

            // now default the fields.
            nlapiSetFieldValue('custrecord_pr_p45_payeoffice',payroll.config['cfg_ukhmrc_taxoffice']);
            nlapiSetFieldValue('custrecord_pr_p45_payereference',payroll.config['cfg_ukhmrc_taxref']);
            nlapiSetFieldValue('custrecord_pr_p45t_employer_name',payroll.config['cmp_name']);

            // need to lookup the release date and gender as they are not exposed to sourcing.
            if(!isNullOrEmpty(lastEmpId))
            {
                nlapiSetFieldValue('custrecord_pr_p45_week1month1','',false);
                nlapiSetFieldValue('custrecord_pr_p45_p11weekno','',false);
                nlapiSetFieldValue('custrecord_pr_p45_p11monthno','',false);
                nlapiSetFieldValue('custrecord_pr_term_taxyear','',false);
                nlapiSetFieldValue('custrecord_pr_p45_totalpay_td','',false);
                nlapiSetFieldValue('custrecord_pr_p45_totaltax_td','',false);
                nlapiSetFieldValue('custrecord_pr_p45_totalpay','',false);
                nlapiSetFieldValue('custrecord_pr_p45_totaltax','',false);
                nlapiSetFieldValue('custrecord_pr_p45_leavingdate','',false);
            }

            if(!isNullOrEmpty(empId))
            {
                var empObj = nlapiLookupField('employee',empId,['releasedate','gender']);

                if(empObj.releasedate != '')
                {
                    nlapiSetFieldValue('custrecord_pr_p45_leavingdate',empObj.releasedate);
                }

                if(empObj.gender != 'b')
                {
                    nlapiSetFieldValue('custrecord_pr_p45_gender',(empObj.gender == 'm') ? 1 : 2);
                }
            }

            lastEmpId = empId;

            break;

    }
}

function getTaxTotals(employeeId,releaseDateStr)
{
    var overlappingBool = false;
   	var errorStr = "";

   	try
   	{
   		var response = nlapiRequestURL(nlapiResolveURL("SUITELET","customscript_pr_sl_uk_jumplet","customdeploy_pr_sl_uk_jumplet"),{
   			"custparam_jumptype" : 'jsonterm',
   			"custparam_eid" : employeeId ,
   			"custparam_tdate" : releaseDateStr},null);

   		// check the response code first.
   		if(response.getCode() != "200")
   		{
   			// a problem occurred making the call.
   			errorStr = "GET_TERMINATION_REQUEST_FAILED: The json call returned the status code " + response.getCode();
   		}
   		else
   		{
   			var resultObj = JSON.parse(response.getBody());

   			if(!resultObj.success)
   			{
   				// a problem occurred whilst obtaining the data display a message.
   				errorStr = "GET_TERMINATION_RESPONSE_FAILED: The json call returned success of false " + resultsObj.message;
   			}
   			else
   			{
                nlapiSetFieldValue('custrecord_pr_p45_week1month1',resultObj.result.lastpayslip.w1m1);
                nlapiSetFieldValue('custrecord_pr_p45_p11weekno',resultObj.result.lastpayslip.weekno);
                nlapiSetFieldValue('custrecord_pr_p45_p11monthno',resultObj.result.lastpayslip.monthno);

                nlapiSetFieldValue('custrecord_pr_term_taxyear',resultObj.result.taxyearid);
                nlapiSetFieldValue('custrecord_pr_p45_totalpay_td',resultObj.result.paytotal);
                nlapiSetFieldValue('custrecord_pr_p45_totaltax_td',resultObj.result.taxtotal);

                // now lets populate the other
               nlapiSetFieldValue('custrecord_pr_p45_totalpay',resultObj.result.paythisemp);
               nlapiSetFieldValue('custrecord_pr_p45_totaltax',resultObj.result.taxthisemp);
   			}
   		}
   	}
   	catch(ex)
   	{
   		errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() : ex.toString();
   	}

   	if(errorStr)
   	{
   		alert("We have been unable to determine whether this request overlaps with other active requests. This problem may have occurred because your session has timed out. Please login again and retry. \n\n" + errorStr);
   	}
}


function prSaveRecord()
{
    var saveRecordBool = true;

    if(nlapiGetFieldValue('custrecord_pr_p45_week1month1') != 'T' && (nlapiGetFieldValue('custrecord_pr_p45_p11weekno') == '' && nlapiGetFieldValue('custrecord_pr_p45_p11monthno') == ''))
    {
        alert('Week1/Month1 has not been checked please enter either a week or month no');
        saveRecordBool = false;
    }

    return saveRecordBool;
}
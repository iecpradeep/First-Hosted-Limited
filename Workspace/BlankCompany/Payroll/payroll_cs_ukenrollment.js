var payrollInitBool = false;
var payrollInitPendingBool = false;
var payroll = {};
var ctxObj = nlapiGetContext();
var useSubsidiaryBool = ctxObj.getFeature("SUBSIDIARIES");

function prPageInit(type)
{
    if(!useSubsidiaryBool)
    {
        initPayroll();
    }

    var formId = nlapiGetFieldValue('custrecord_pr_enrol_form');

    if(formId == HMRC_FORM_P45)
    {
        var isCheckedBool = nlapiGetFieldValue('custrecord_pr_enrol_previous_week1month1') == 'T';

        nlapiDisableField('custrecord_pr_enrol_previous_weekno_2',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_monthno',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_totalpay',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_totaltax',isCheckedBool);

    }
}


function prFieldChanged(type, fieldname, linenum)
{
    switch(fieldname)
    {
        case 'custrecord_pr_enrol_previous_week1month1':

        var isCheckedBool = nlapiGetFieldValue(fieldname) == 'T';

        if(isCheckedBool)
        {
            // clear the field contents
            nlapiSetFieldValue('custrecord_pr_enrol_previous_weekno_2','',false);
            nlapiSetFieldValue('custrecord_pr_enrol_previous_monthno','',false);
            nlapiSetFieldValue('custrecord_pr_enrol_previous_totalpay','',false);
            nlapiSetFieldValue('custrecord_pr_enrol_previous_totaltax','',false);
        }

        nlapiDisableField('custrecord_pr_enrol_previous_weekno_2',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_monthno',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_totalpay',isCheckedBool);
        nlapiDisableField('custrecord_pr_enrol_previous_totaltax',isCheckedBool);


        break;
        case 'custrecord_pr_enrol_previous_weekno_2':

        var valueStr = nlapiGetFieldValue(fieldname);

        if(valueStr != '')
        {
            nlapiSetFieldValue('custrecord_pr_enrol_previous_monthno','',false);
        }

        nlapiDisableField('custrecord_pr_enrol_previous_monthno',(valueStr != ''));


        break;
        case 'custrecord_pr_enrol_previous_monthno':

        var valueStr = nlapiGetFieldValue(fieldname);

        if(valueStr != '')
        {
            nlapiSetFieldValue('custrecord_pr_enrol_previous_weekno_2','',false);
        }

        nlapiDisableField('custrecord_pr_enrol_previous_weekno_2',(valueStr != ''));

        break;

        case 'custrecord_pr_enrol_employee':

        /*var empId = nlapiGetFieldValue("custrecord_pr_enrol_employee");
         var paramArr = [
             'custparam_employee=' + empId,
             'cf=' + nlapiGetFieldValue('customform')
         ];

         setWindowChanged(window, false);

         // unfortunately we can't link to the record prior to creating it without using a tasklink where we require the internal
         // rectype.
         var matchStr = window.location.search;
         var rxRecType = /rectype=(\d*)/;
         var recTypeStr = "";

         if(rxRecType.test(matchStr))
         {
             recTypeStr = matchStr.match(rxRecType)[1];
         }

         if(recTypeStr != null && recTypeStr != '')
         {
             document.location = nlapiResolveURL("TASKLINK","EDIT_CUST_" + recTypeStr) + "&" + paramArr.join("&");
         }
         else
         {
             alert("Unable to resolve record type, auto refresh disabled.");
         }*/

        break;
    }
}

function prPostSourcing(type,fieldname,linenum)
{
    switch(fieldname)
    {
        case 'custrecord_pr_enrol_employee':

        if(useSubsidiaryBool)
        {
            var subsidiaryId = nlapiGetFieldValue('custrecord_pr_enrol_subsidiary');
            initPayroll(subsidiaryId);
        }

        // now default the fields.
        nlapiSetFieldValue('custrecord_pr_enrol_new_hmrcoffice',payroll.config['cfg_ukhmrc_taxoffice']);
        nlapiSetFieldValue('custrecord_pr_enrol_new_hmrcref',payroll.config['cfg_ukhmrc_taxref']);
        nlapiSetFieldValue('custrecord_pr_enrol_employer_name',payroll.config['cmp_name']);

        break;
    }
}

function prValidateField(type, fieldname, linenum)
{
    var isValidBool = true;

    switch(fieldname)
    {
        case 'custrecord_pr_enrol_new_taxcode':


        case "custrecord_pr_enrol_previous_taxcode":
        case "custrecord_pr_enrol_new_taxcode":

        isValidBool = nlapiGetFieldValue(fieldname) == '' || isValidUkTaxCode(nlapiGetFieldValue(fieldname));

        if(!isValidBool)
        {
            alert("The HMRC Tax code you have entered is invalid.");
        }

        break;
        case "custrecord_pr_enrol_nino":

        isValidBool = nlapiGetFieldValue(fieldname) == '' || isValidUkNIN(nlapiGetFieldValue(fieldname));

        if(!isValidBool)
        {
            alert("The National Insurance number entered is invalid.");
        }

        break;
    }

    return isValidBool;
}

function prSaveRecord()
{
    var saveBool = true;
    var formId = nlapiGetFieldValue('custrecord_pr_enrol_form');

    switch(formId)
    {
        case HMRC_FORM_P45:

        if(nlapiGetFieldValue('custrecord_pr_enrol_previous_week1month1') != 'T')
        {
            if(saveBool && nlapiGetFieldValue('custrecord_pr_enrol_previous_weekno_2') == '' && nlapiGetFieldValue('custrecord_pr_enrol_previous_weekno_2') == '')
            {
                alert('Please enter the previous employment Week No or Month No');
                saveBool = false;
            }

            // previous total pay to date / previous total tax to date and on of week no and month are mandatory
            if(nlapiGetFieldValue('custrecord_pr_enrol_previous_totalpay') == '' || nlapiGetFieldValue('custrecord_pr_enrol_previous_totaltax') == '')
            {
                alert('Please enter the previous employment Total Pay To Date and Total Tax To Date have been entered.');
                saveBool = false;
            }

            // check the address need to enter a minimum of 2 lines
            if(saveBool)
            {
                var addressLineCount = 0;
                if(nlapiGetFieldValue('custrecord_pr_enrol_employee_address1') != '') { addressLineCount++ }
                if(nlapiGetFieldValue('custrecord_pr_enrol_employee_address2') != '') { addressLineCount++ }
                if(nlapiGetFieldValue('custrecord_pr_enrol_employee_address3') != '') { addressLineCount++ }
                if(nlapiGetFieldValue('custrecord_pr_enrol_employee_address4') != '') { addressLineCount++ }

                if(addressLineCount < 2)
                {
                    alert("Please enter at least two lines for the Employee's Private Address.");
                    saveBool = false;
                }
            }

            if(saveBool)
            {
                var isStatementA = nlapiGetFieldValue('custrecord_pr_enrol_circumstance') == '1';

                if(isStatementA)
                {
                    var taxCodeStr = nlapiGetFieldValue('custrecord_pr_enrol_new_taxcode').toLowerCase();

                    if(taxCodeStr != 'br' && taxCodeStr != '0t')
                    {
                        alert('Tax Code for Statement A: first job must be BR or 0T');
                        isValidBool = false;
                    }
                }
            }
        }


        break;
    }



    return saveBool;
}





/**
 * function initialises the payroll object.
 * @param {Object} subsidiaryId
 */
function initPayroll(subsidiaryId)
{
	var errorStr = "";

	if(isNullOrEmpty(subsidiaryId))
	{
		subsidiaryId = "";
	}

	try
	{
		payrollInitPendingBool = true;
		var jsonUrlStr = nlapiResolveURL("SUITELET","customscript_sl_pr_json","customdeploy_sl_pr_json");
		var response = nlapiRequestURL(jsonUrlStr,{"custparam_subsidiary": subsidiaryId},null,null);
		payrollInitPendingBool = false;

		if(response.getCode() != "200")
		{
			// a problem occurred in running the script.
			errorStr = "PAYROLL_INIT_REQUEST_ERROR: The json call returned the status code " + response.getCode();
		}
		else
		{
			var resultArr = JSON.parse(response.getBody());

			if(!resultArr['success'])
			{
				// a problem occurred whilst obtaining the data display a message.
				errorStr = "PAYROLL_INIT_SCRIPT_ERROR: The json call returned success of false " + resultArr["message"];
				payrollInitBool = false;
			}
			else
			{
				payroll = resultArr["result"];
				payrollInitBool = true;
			}
		}
	}
	catch(ex)
	{
		errorStr = (ex.getCode != null) ? ex.getCode() + '\n' + ex.getDetails() : ex.toString();
		payrollInitBool = false;
	}

	if(!isNullOrEmpty(errorStr))
	{
		alert("We have been unable to initialise payroll details . This problem may have occurred because your session has timed out. Please login again and retry. \n\n" + errorStr);
	}
}
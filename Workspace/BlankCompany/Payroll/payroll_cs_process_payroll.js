var markedIndexArr = [];
var processCompleteBool = false;
var processCountInt = 0;
var processErrorInt = 0;
var currentIndexInt = 0;

var processQueueArr = [];
var concurrencyInt = 5;
var totalInt = 0;
var errorInt = 0;
var completeInt = 0;
var processingInt = 0;
var processTimeMs = 0;
var queueProcessingBool = false;
var processByExtJs = true;
var avgProcessTimeMs = 20000;
var remainingMs = 0;
var processWin = null;
var baseUrlStr = null;

function prPageInit()
{
	// load the subsidiary configuration
	
	var threadCountInt = parseInt(nlapiGetFieldValue("custpage_threads"));
	concurrencyInt = (!isNaN(threadCountInt)) ? threadCountInt : 1;
}




function createPayslipFieldChanged(type, fieldname, linenum)
{
	if (fieldname == 'custpage_pay_run_id')
	{
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_pay_period')
	{
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_autopay' || fieldname == 'custpage_use_aba')
	{
		custpage_create_payslipsMarkAll(false);
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);	
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_sort_field')
	{
		nlapiSetFieldValue('custpage_refresh', 'T');
		setWindowChanged(window, false);
		document.main_form.submit();
	}
	
	if (fieldname == 'custpage_autopay_stage')
	{
		var endStage = nlapiGetFieldValue('custpage_autopay_stage');
		
		if (endStage == STEP_PAYMENT || endStage == STEP_EMAIL)
		{
			custpage_create_payslipsMarkAll(false);
			nlapiSetFieldValue('custpage_refresh', 'T');
			setWindowChanged(window, false);	
			document.main_form.submit();
		}
		
	}
	
}


function createPayslipOnSave()
{
	if(nlapiGetFieldValue('custpage_autopay') == 'T')
	{
		return true;
	}

	// if a process is not currently running obtain the data for processing:
	if(!queueProcessingBool)
	{
		var payslipCount = nlapiGetLineItemCount('custpage_create_payslips');
		processQueueArr = [];

		// create an array of the indexes we want to process.
		for(var i = 1; i <= payslipCount; i++) 
		{
			if (nlapiGetLineItemValue('custpage_create_payslips', 'checked', i) == 'T') 
			{
				processQueueArr.push(
				{
					custparam_ts : parseInt(new Date().getTime() / 1000,10),
					custparam_index: i,
					custparam_empid : nlapiGetLineItemValue('custpage_create_payslips', 'custrecord_ps_employee',i), 
					custparam_psid : nlapiGetLineItemValue('custpage_create_payslips', 'internalid', i),
					custparam_pay : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_pay', i),
					custparam_allowances : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_allowances', i),
					custparam_deductions : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_deductions', i),
					custparam_bonus : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_bonus', i),
					custparam_commission : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_commission', i),
					custparam_expenses : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_expenses', i),
					custparam_prid : nlapiGetFieldValue("custpage_pay_run_id"),
                    custparam_retry : 'F'
				});
			}
		}
		if(processQueueArr.length == 0)
		{
			alert("Please select one or more payslips to proceed.");
            return false;
		}
		else
		{
            // pop window.
            initProcess();
            return false;
		}
	}
}

function processPay()
{
	if(processQueueArr.length == 0)
	{
		if(processingInt == 0)
		{
            // Clear Loader
            Ext.getCmp('toolmsg').update('');
            Ext.getCmp('prprocessbar').setVisible(false);

            // update status on box.
            if(errorInt > 0)
            {
                document.title = 'Processing complete with errors';
                Ext.getCmp('toolmsg').update('Completed with ' + errorInt + ' error(s)');
                Ext.select('div:not(.pr-process-error)',true,'messagedata').setVisibilityMode(Ext.Element.DISPLAY).setVisible(false);
                Ext.getCmp('prbtnretry').setVisible(true);
                Ext.getCmp('prbtnpayrun').setVisible(true);

                Ext.getCmp('warningmsg').update('<div style="padding-top: 10px; color: #f00">One or more payslips have failed to process. Please review the process activity for more details.</div>');
            }
            else
            {
                // display confirmation and redirect in 5 seconds.
                document.title = 'Processing complete';
                Ext.getCmp('prbtnapproval').setVisible(true);
                Ext.getCmp('toolmsg').update('Completed processed all ' + totalInt + ' payslip(s)');
                Ext.getCmp('warningmsg').update('<div style="padding-top: 10px">The process has completed successfully you will be automatically redirected to approval in a few seconds, or click "proceed to approval"</div>');

                setTimeout('setWindowChanged(window, false);document.main_form.submit();',5000);
            }
		}
	}
	else
	{
		var paramArr = processQueueArr.shift();
		processingInt++;		

		var urlStr = nlapiResolveURL("SUITELET","customscript_pr_payslip_processor","customdeploy_pr_payslip_processor");
		for(var paramStr in paramArr)
		{
			urlStr += "&" + paramStr + "=" + paramArr[paramStr];		
		}

        if(processByExtJs)
        {
            Ext.Ajax.request({
                url : urlStr,
                method : 'GET',
                success: processPaySlipExtHandler,
                failure: processPaySlipExtHandler
            });
        }
        else
        {
		    nlapiRequestURL(urlStr,null,null,processPaySlipNlHandler);
        }
	}
}


function processPaySlipExtHandler(responseObj)
{
	try{
		var jsonStr = responseObj.responseText;

		var jsonObj = Ext.decode(jsonStr);

		if(jsonObj != null)
		{
			var messageStr = jsonObj.payslip.message;
			var statusStr = jsonObj.payslip.status;
			var indexStr = jsonObj.payslip.tableindex;
            var retryChar = jsonObj.payslip.retry;
            var nowDate = new Date();
            var tsStr = "[" + ((nowDate.getHours() < 10) ? "0" + nowDate.getHours().toString() : nowDate.getHours()) + ":" + ((nowDate.getMinutes() < 10) ? "0" + nowDate.getMinutes().toString() : nowDate.getMinutes()) + ":" + ((nowDate.getSeconds() < 10) ? "0" + nowDate.getSeconds().toString() : nowDate.getSeconds()) + "]";
            var payslipId = nlapiGetLineItemValue('custpage_create_payslips', 'internalid', indexStr);

            completeInt += (statusStr != "ERROR") ? 1 : 0;

            if(baseUrlStr == null)
            {
                baseUrlStr = nlapiResolveURL('RECORD','customrecord_pr_payslip',payslipId);
                baseUrlStr = baseUrlStr.substr(0,(baseUrlStr.lastIndexOf('=') + 1));
            }

            payslipUrlStr = baseUrlStr + payslipId;

            if(statusStr != "ERROR")
            {
                processTimeMs += jsonObj.payslip.processtime;
                avgProcessTimeMs = parseInt(processTimeMs /completeInt,10);
                remainingMs = (avgProcessTimeMs * (totalInt - (completeInt + errorInt)) / concurrencyInt);
                Ext.get('messagedata').insertFirst({tag : 'div',cls : 'pr-process-complete', html : tsStr + ' <img src="/images/icons/highlights/icon_lists_checkMark.png" /> <a href="' + payslipUrlStr + '" target="_blank">' + nlapiGetLineItemValue('custpage_create_payslips', 'custrecord_ps_employee_display',indexStr) + '</a>'});
            }
            else
            {
                if(messageStr.indexOf('UNEXPECTED') != -1 && retryChar == 'F')
                {
                    // requeue as this is an unexpected error.
                    Ext.get('messagedata').insertFirst({tag : 'div',cls : 'pr-process-warn',html : tsStr + ' <img src="/images/icons/highlights/icon_lists_exclamationMark.png" /> <a href="' + payslipUrlStr + '" target="_blank">' + nlapiGetLineItemValue('custpage_create_payslips', 'custrecord_ps_employee_display',indexStr) + '</a> has been re-queued due to unexpected error.'});

                    // requeue
                    processQueueArr.push(
                    {
                        custparam_ts : parseInt(new Date().getTime() / 1000,10),
                        custparam_index: indexStr,
                        custparam_empid : nlapiGetLineItemValue('custpage_create_payslips', 'custrecord_ps_employee',indexStr),
                        custparam_psid : nlapiGetLineItemValue('custpage_create_payslips', 'internalid', indexStr),
                        custparam_pay : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_pay', indexStr),
                        custparam_allowances : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_allowances', indexStr),
                        custparam_deductions : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_deductions', indexStr),
                        custparam_bonus : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_bonus', indexStr),
                        custparam_commission : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_commission', indexStr),
                        custparam_expenses : nlapiGetLineItemValue('custpage_create_payslips', 'custpage_expenses', indexStr),
                        custparam_prid : nlapiGetFieldValue("custpage_pay_run_id"),
                        custparam_retry : 'T'
                    });
                }
                else
                {
                    Ext.get('messagedata').insertFirst({tag : 'div',cls : 'pr-process-error',html : tsStr + ' <img src="/images/icons/highlights/icon_lists_xMark.png" /> ' + nlapiGetLineItemValue('custpage_create_payslips', 'custrecord_ps_employee_display',indexStr) + ' has failed ' + messageStr});
                    errorInt += 1;
                }
            }

            processingInt--;
            document.title = 'Processing payslips ' + (totalInt - (errorInt + completeInt)) + ' remaining';
            var i = (errorInt + completeInt) / totalInt;
            var pct = Math.round(i * 100);
            var msgStr = pct == '100' ? '100% complete' : pct + '% complete (Est Rem. ' + msToStr(remainingMs) + ' )';

            Ext.getCmp('prprocessbar').updateProgress(i,msgStr);

			processPay();
		}
	}
	catch(ex)
	{
		var errorStr = (ex instanceof nlobjError) ? ex.getCode() + '\n' + ex.getDetails() + '\n' + ex.getStackTrace().join("\n") : ex.toString();
		alert("A problem occurred processing the pay detail generate. " + errorStr);
	}
}


function msToStr(milliseconds)
{
    var seconds = parseInt(milliseconds / 1000,10);
    var numyears = Math.floor(seconds / 31536000);
    var numdays = Math.floor((seconds % 31536000) / 86400);
    var numhours = Math.floor(((seconds % 31536000) % 86400) / 3600);
    var numminutes = Math.floor((((seconds % 31536000) % 86400) % 3600) / 60);
    var numseconds = (((seconds % 31536000) % 86400) % 3600) % 60;

    var outputArr = [];
   if(numhours > 0)
   {
       outputArr.push(numhours + " hrs");
   }

   if(numminutes > 0)
   {
       outputArr.push(numminutes + " mins");
   }

   if(numseconds > 0)
   {
      outputArr.push(numseconds + " secs");
   }

   return outputArr.join(" ");
}


function initProcess()
{
    totalInt = processQueueArr.length;
    var payslipCount = nlapiGetLineItemCount('custpage_create_payslips');

    remainingMs = (totalInt > concurrencyInt) ? ((avgProcessTimeMs * totalInt) / concurrencyInt) : avgProcessTimeMs;

    // update the message status
    if(processWin == null)
    {
        var myProgressBar = new Ext.ProgressBar({
            id: 'prprocessbar',
            progressText: '',
            hidden: true
        });

        var myToolBar = [
            {
                xtype: 'container',
                id: 'toolmsg',
                html: totalInt + ' of ' + payslipCount + ' payslips selected'
            },
            '->',
            {
              text : 'Cancel',
              id : 'prbtncancel',
              handler : function()
              {
                  Ext.getCmp('processwin').hide();
              }
            },
            {
                text : 'Begin',
                handler : function(){
                    queueProcessingBool = true;
                    Ext.getCmp('toolmsg').update('Processing <img src="/extapp/RM/resources/images/default/grid/loading.gif" align="absmiddle" />');
                    Ext.getCmp('prwininstruction').setVisible(false);
                    Ext.getCmp('prprocessbar').updateProgress(0,"Initialising.. Est Time To Complete " + msToStr(remainingMs)).setVisible(true);
                    Ext.getCmp('messages').setVisible(true);
                    Ext.getCmp('prbtncancel').setVisible(false);
                    this.setVisible(false);
                    document.title = 'Processing payslips ' + processQueueArr.length + ' remaining';



                    for(var i=0; i < concurrencyInt && processQueueArr.length > 0; i++)
                    {
                        processPay();
                    }
                }
            },
            {
                text : 'Return To Payrun',
                hidden : true,
                id : 'prbtnpayrun',
                handler : function(){
                    setWindowChanged(window, false);
                    document.location = nlapiResolveURL("RECORD","customrecord_pr_pay_run",nlapiGetFieldValue("custpage_pay_run_id"),false);
                }
            },
            {
                text : 'Retry',
                hidden : true,
                id : 'prbtnretry',
                handler : function(){
                    setWindowChanged(window, false);
                    document.location.reload();
                }
            },
            {
                text : 'Proceed To Approval',
                hidden : true,
                id : 'prbtnapproval',
                handler : function(){
                    setWindowChanged(window, false);
                    document.main_form.submit();
                }
            }

        ];

        processWin = new Ext.Window({
            title			: "Process Payslips",
            id              : 'processwin',
            modal			: true,
            width			: 500,
            autoHeight      : true,
            closeAction		: 'hide',
            closeable       : false,
            bodyStyle       : 'padding: 10px',
            items: [
                {
                    xtype: 'container',
                    id: 'prwininstruction',
                    html: '<p>There are ' + totalInt + ' payslips to process, which will take approximately ' + msToStr(remainingMs) + ' to complete. Click "Begin" to start processing.</p>'
                },
                {
                    xtype:'fieldset',
                    columnWidth: 1,
                    title: 'Process Activity',
                    collapsible: false,
                    hidden: true,
                    id : 'messages',
                    items : [
                        {
                            xtype: 'container',
                            height: 75,
                            autoScroll: true,
                            id: 'messagedata',
                            html: ''
                        }
                    ]
                },
                myProgressBar,
                {
                    xtype: 'container',
                    bodyStyle: 'padding-top: 15px',
                    html: '<div style="padding-top: 10px"><b>Note:</b> While Processing do not close the tab, or change roles or account in other windows.</div>',
                    id: 'warningmsg',
                    hidden: false
                }

             ],
            bbar        : myToolBar
            });
    }
    else
    {
        // need to update the various fields
        Ext.getCmp('toolmsg').update(totalInt + ' of ' + payslipCount + ' payslips selected');
        Ext.getCmp('prwininstruction').update('<p>There are ' + totalInt + ' payslips to process, which will take approximately ' + msToStr(remainingMs) + ' to complete. Click "Begin" to start processing.</p>');
    }
    processWin.show();

}



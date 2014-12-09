function ScheduledScript(type)
{
	var filter=null;
	var ctx=nlapiGetContext();
	var startafterid=ctx.getSetting("SCRIPT","custscript_bb1_psq_startafterid");
	if (startafterid)
	{
		filter=new nlobjSearchFilter("internalidnumber","item","greaterthan",startafterid);
	}

	var results=nlapiSearchRecord("transaction","customsearch_bb1_periodsalesqty",filter);
	if (!results)
	{
		nlapiLogExecution("debug","No results to process");
		return;
	}

	nlapiLogExecution("debug","Starting processing: "+results.length+" records, "+(startafterid ? "after record ID "+startafterid:"from first record"));

	var emailuserid=ctx.getSetting("SCRIPT","custscript_bb1_psq_emailoncompletion");

	var suspendid;
	var processed=0, changed=0;
	var l=Math.min(1000,results.length);

	for(var i=0; i<l; i++)
	{
		var r=results[i];
		var qty=r.getValue("quantity",null,"sum");
		if (!qty) qty=0;
		var oldqty=r.getValue("custitem_bb1_periodsalesqty","item","max");
		if (!oldqty) oldqty=0;

		if (qty!=oldqty) 
		{
			var recid=r.getValue("internalid","item","group");
			var rectype=nlapiLookupField("item",recid,"recordtype");
			try
			{
				nlapiSubmitField(rectype,recid,"custitem_bb1_periodsalesqty",qty);
				changed++;
			}
			catch(err)
			{
				if (err.getDetails) err=err.getDetails();
				nlapiLogExecution("error","Error updating "+rectype+" "+recid+" ("+oldqty+"/"+qty+")",err);
			}

			if (SuspendRequired())
			{
				suspendid=r.getId();
				break;
			}		
		}

		ctx.setPercentComplete(Math.round((i/l)*1000)/10);
		processed++;
	}

	if (!suspendid && l==1000) suspendid=results[l-1].getValue("internalid","item","group");

	if (suspendid)
	{
		nlapiLogExecution("debug","Suspending: processed "+processed+" records ("+changed+" changed); will restart after item ID "+suspendid);
		var params=[];
		params["custscript_bb1_psq_startafterid"]=suspendid;
		params["custscript_bb1_psq_emailoncompletion"]=emailuserid;
		var status=nlapiScheduleScript("customscript_bb1_server_periodsalesqty",null,params);
		if (status!="QUEUED") nlapiLogExecution("debug","Failed to reschedule script: "+status);
		return;
	}

	nlapiLogExecution("debug","Completed: processed "+processed+" records ("+changed+" changed)");

	if (emailuserid)
	{
		var subject="Recalculation of Period Sales Quantity Complete";
		var body="This calculation is now completed.";
		nlapiSendEmail(emailuserid,emailuserid,subject,body);
	}
}


function SuspendRequired()
{
	var ctx=nlapiGetContext();
	return (ctx.getRemainingUsage()<100);
}


function Suitelet(request,response)
{
	var form=nlapiCreateForm("Recalculate Period Sales Quantity");

	if (request.getMethod()=="POST")
	{
		var emailme=(request.getParameter("custpage_emailme")=="T");
		var params=[];
		if (emailme) params["custscript_bb1_psq_emailoncompletion"]=nlapiGetUser();

		var status=nlapiScheduleScript("customscript_bb1_server_periodsalesqty",null,params);

		var msg;
		if (status=="QUEUED")
		{
			msg="Recalculation started.";
			if (emailme) msg=msg+"  You will receive an email once all items have been recalculated.";
		}
		else
		{
			msg="Unable to start recalculation - it may already be in progress.";
		}

		form.addField("custpage_help","help",msg);
	}
	else
	{
		var fld=form.addField("custpage_help","help",'The Period Sales Quantity field is updated nightly and shows total quantity sales over a predefined period.  To modify the period used in this calculation click <a href="/app/common/search/search.nl?cu=T&e=T&id=15" target="_blank">here</a> to edit the saved search "SCRIPT SEARCH - Period Sales Qty" and modify its Date criteria.  The new date criteria set on this search will then be used to calculate this field until it is changed again.');
		fld.setLayoutType("outsideabove");

		fld=form.addField("custpage_emailme","checkbox","Email Me When Recalculation is complete");
		fld.setDefaultValue("T");

		form.addSubmitButton("Start Recalculation Now");
	}

	response.writePage(form);
}
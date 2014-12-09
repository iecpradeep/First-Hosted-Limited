

/**
 * 
 */
function UpdateNextPOs()
{
//	Find all items which have next PO fields set and make associative array of them

	var results=GetLargeSearch("item","customsearch_bb1_po_itemstoclear","internalidnumber");
	var l=results.length;
	nlapiLogExecution("debug","Items To Clear: "+l);
	var setitems=[];
	for(var i in results) setitems[results[i].getValue("internalid")]=results[i].getRecordType();

//	Find all item which need to be set

	results=GetLargeSearch("item","customsearch_bb1_po_itemstoset","internalidnumber",true);
	nlapiLogExecution("debug","Items To Set: "+results.length);

	InitProgress(l+results.length);

//	Loop thru found and set only those items which need updating
//	Remove each from setitems

	for(i in results)
	{
		if (CheckSuspend(50)) return;

		var r=results[i];
		var itemid=r.getValue("internalid",null,"GROUP");

		var itemnextdeldate=Nvl(r.getValue("custitem_bb1_nextdeldate",null,"GROUP"),"");
		var itemamtduein=Nvl(r.getValue("custitem_bb1_amtduein",null,"GROUP"),"");
		var trxnextdeldate=Nvl(r.getValue("formuladate",null,"MIN"),"");
		var trxamtduein=Nvl(r.getValue("formulanumeric",null,"SUM"),"");
		if (trxamtduein==0) trxamtduein="";

		if (itemnextdeldate!=trxnextdeldate || itemamtduein!=trxamtduein)
		{
			var itemtype=nlapiLookupField("item",itemid,"recordtype");

			nlapiLogExecution("debug","Updating item "+itemid,trxnextdeldate+", "+trxamtduein);
			nlapiSubmitField(itemtype,itemid,["custitem_bb1_nextdeldate","custitem_bb1_amtduein"],
					[trxnextdeldate,trxamtduein]);
		}

		if (setitems[itemid]) delete setitems[itemid];
	}

//	Finally clear remaining items

	for(i in setitems)
	{
		if (CheckSuspend(50)) return;

		var itemtype=setitems[i];
		if (!itemtype) continue;

		var itemid=i;
		nlapiLogExecution("debug","Clearing item "+itemid);
		nlapiSubmitField(itemtype,itemid,["custitem_bb1_nextdeldate","custitem_bb1_amtduein"],["",""]);
	}
}


/**
 * @param rectype
 * @param searchid
 * @param keyfield
 * @param isgrouped
 * @returns {Array}
 */
function GetLargeSearch(rectype,searchid,keyfield,isgrouped)
{
	var filter=null;
	var results=[];
	var keyfieldid=(keyfield=="internalidnumber") ? "internalid" : keyfield;

	do
	{
		if (CheckSuspend(50)) return results;

		var r=nlapiSearchRecord(rectype,searchid,filter);
		if (!r) return results

		results=results.concat(r);

		var l=r.length-1;
		var lastkey=r[l].getValue(keyfieldid,null,isgrouped ? "GROUP" : null);
		filter=new nlobjSearchFilter(keyfield,null,"greaterthan",lastkey);		
	}
	while(true)
}


function Nvl(v,n)
{
	if (!v) return n; else return v;
}


var ProgressMax=0, ProgressCounter=0;

/**
 * @param c
 */
function InitProgress(c)
{
	ProgressMax=c;
}


/**
 * @param u
 * @returns {Boolean}
 */
function CheckSuspend(u)
{
	var ctx=nlapiGetContext();
	if (ctx.getRemainingUsage()>=u) 
	{
		if (ProgressMax>0)
		{
			if (ProgressCounter<ProgressMax) ProgressCounter++;
			var p=(ProgressCounter/ProgressMax)*100;
			ctx.setPercentComplete(p.toFixed(1));
		}
		return false;
	}

	nlapiLogExecution("debug","Out of usage - suspending and requeueing.");
	if (nlapiScheduledScript(ctx.getScriptId())!="QUEUED")
		nlapiLogExecution("error","Requeue failed.");

	return true;
}
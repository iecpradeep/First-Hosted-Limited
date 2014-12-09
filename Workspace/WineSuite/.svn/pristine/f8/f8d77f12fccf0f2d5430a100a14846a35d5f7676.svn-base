function updatesearchkeyword() {
	
	/*lastitem = nlapiSearchRecord('customrecord_lastupdateditem', null, null, (new nlobjSearchColumn('custrecord_lastitem')));
	lastitemid = 0;
	lastrecordid = 0;
	if(lastitem) {
		lastrecordid =  lastitem[0].getId();
		lastitemid = lastitem[0].getValue('custrecord_lastitem');
	} else {
		lastrecord = 	nlapiCreateRecord('customrecord_lastupdateditem');
		lastrecordid = nlapiSubmitRecord(lastrecord);
	}*/
	
	
	var lastitemid = nlapiGetContext().getSetting('SCRIPT', 'custscript_linternalid');
		
	var filters = new Array();
	if(lastitemid)
	filters.push(new nlobjSearchFilter("internalidnumber", null, 'greaterthan', lastitemid));
	
	var cols = new Array();
	cols.push(new nlobjSearchColumn('searchkeywords'));
	cols.push(new nlobjSearchColumn('salesdescription'));
	cols.push(new nlobjSearchColumn('displayname'));
	cols.push(new nlobjSearchColumn('custitem_item_name'));
	cols.push(new nlobjSearchColumn('custitem_item_grower'));
	cols.push(new nlobjSearchColumn('itemid'));
	cols.push(new nlobjSearchColumn('custitem_country'));
	cols.push(new nlobjSearchColumn('custitem_item_region'));
	cols.push(new nlobjSearchColumn('custitem_search_aux'));
	cols.push(new nlobjSearchColumn('custitem_item_appellation'));
	
	var context = nlapiGetContext();

 
	searchresults = nlapiSearchRecord('inventoryitem', 87, filters, cols);
	
	if(searchresults) {
		for(var i = 0; i < searchresults.length; i++) {
			var usageRemaining = context.getRemainingUsage();
			nlapiLogExecution('DEBUG', 'LOG', usageRemaining + 'HERE2 ' + i);
			if(usageRemaining > 40 && i < 900) {
				try {
					lastitemid = searchresults[i].getId();
					newsearchkeyword = searchresults[i].getValue('salesdescription') + searchresults[i].getValue('searchkeywords') + searchresults[i].getValue('displayname') + searchresults[i].getText('custitem_item_name') + ' ' + searchresults[i].getText('custitem_item_grower')+' '+searchresults[i].getValue('itemid')+ ' ' + searchresults[i].getText('custitem_country')+ ' ' + searchresults[i].getText('custitem_item_region')+ ' ' + searchresults[i].getText('custitem_item_appellation');
					//nlapiLogExecution('DEBUG', 'LOG', lastitemid);
					var record = nlapiLoadRecord('inventoryitem', lastitemid);
	
					record.setFieldValue('custitem_search_aux', newsearchkeyword);
					
				//	if(searchresults[i].getValue('custitem_search_aux')!=newsearchkeyword) record.setFieldValue('custitem_search_aux', newsearchkeyword);
					if(searchresults[i].getValue('custitem_search_aux')!=newsearchkeyword)
						nlapiSubmitRecord(record, true);
					
					
					
					
				} catch (e) {//nlapiLogExecution('ERROR', 'error', e + ' ' + lastitemid);
				}
			} else {
				
				var sparams = new Array();
				sparams['custscript_linternalid'] = lastitemid;
				var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId(),sparams)
				nlapiLogExecution('DEBUG', 'nlapiScheduleScript', context.getScriptId() + ' ' +status);
				if ( status == 'QUEUED' )
					 break;
			}
		}
		
		//nlapiSubmitField('customrecord_lastupdateditem', lastrecordid, 'custrecord_lastitem', lastitemid);
	}
}

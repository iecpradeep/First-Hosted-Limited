

function updateWhatsNewItems() 
{
	var filter = new Array();
  	//filter.push(new nlobjSearchFilter('created', null, 'before', 'daysago5'));
	//filter.push(new nlobjSearchFilter('custitem_whatsnew', null, 'is', 'T'));
  	var itemsBefore5Days = nlapiSearchRecord('item', 214, null, null);
   	if(itemsBefore5Days) { 
		var subtotal = 0;
		for(var i = 1; i < itemsBefore5Days.length; i++) {
			try{
				var columns = itemsBefore5Days[i].getAllColumns();
				var newitemid= itemsBefore5Days[i].getValue(columns[0]);
				//var typerecord=itemsBefore5Days[i].getRecordType();			
				nlapiSubmitField("inventoryitem", newitemid, 'custitem_whatsnew', 'F');
			}
			catch(e){}			
		}
   	}
	filter = new Array();
	//filter.push(new nlobjSearchFilter('created', null, 'after', 'daysago5'));
	filter.push(new nlobjSearchFilter('custitem_whatsnew', null, 'is', 'F'));
	var itemsAfter5Days = nlapiSearchRecord('item', 213, filter, null);
   	if(itemsAfter5Days) {
		var subtotal = 0;
		for(var i = 1; i < itemsAfter5Days.length; i++) {
			try{
				var columns = itemsAfter5Days[i].getAllColumns();
				var newitemid= itemsAfter5Days[i].getValue(columns[0]);
				//var typerecord=itemsAfter5Days[i].getRecordType();
			
				nlapiSubmitField("inventoryitem", newitemid, 'custitem_whatsnew', 'T');
			}
			catch(e){}
		}
   	}
}



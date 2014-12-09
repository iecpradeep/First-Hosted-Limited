function setItemVariableAmount() {
	var filter = new Array();
	//filter.push(new nlobjSearchFilter('custitem_isvariableamount', null, 'is', 'F'))
	
	var column = new Array();
	column.push(new nlobjSearchColumn('internalid'))
	column[0].setSort(true);
  	var itemsearch = nlapiSearchRecord('item', null, filter, column);
	var newitemid= 0;
   	if(itemsearch && itemsearch.length) { 
		var subtotal = 0;
		for(var i = 0; i < itemsearch.length; i++) {
			try{
				 newitemid= itemsearch[i].getId();
				var typerecord=itemsearch[i].getRecordType();
				
				nlapiSubmitField(typerecord, newitemid, 'isdonationitem', 'T');
			//	nlapiSubmitField(typerecord, newitemid, 'custitem_isvariableamount', 'T');
			}
			catch(e){nlapiLogExecution('ERROR', 'E',newitemid+e);}			
		}
   	}
	
}
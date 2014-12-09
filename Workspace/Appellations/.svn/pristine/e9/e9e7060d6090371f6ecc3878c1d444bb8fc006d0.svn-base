function getMinimumDeliveryDate(params) {
	
    var minimumDateDelivery = new Date();
	minimumDateDelivery.setUTCHours(22);
	//nlapiLogExecution('DEBUG', 'minimumDateDelivery',minimumDateDelivery);
	minimumDateDelivery.addBusDays(2);
		
	var deliverydate = minimumDateDelivery;
	nlapiLogExecution('DEBUG', 'params', params.getParameter("items"));	
	items = params.getParameter("items").split('*');
	nlapiLogExecution('DEBUG', 'items.length', items.length);	
		for (var j = 0; j <items.length-1; j++) //check all the sales order lines 
		{
			iteminfo = items[j].split('~');
			var itemid = iteminfo[0]; 
			
			var rotationNumber = iteminfo[1]; 
			nlapiLogExecution('DEBUG', 'rotationNumber', rotationNumber);	
			if(rotationNumber=="") continue;
			var quantityordered = iteminfo[2]; 	
			nlapiLogExecution('DEBUG', 'rotationNumber',rotationNumber);	
			try {
				var rotationRecord = nlapiLoadRecord('customrecord_rotation', rotationNumber);			
				
				var custrecord_loycurrentavailable =  rotationRecord.getFieldValue('custrecord_rotation_item_units_available');
				
				var custrecord_loyqtyordered =  rotationRecord.getFieldValue('custrecord_loycurrentavailable');
				
				var custrecord_lotqtysold =  rotationRecord.getFieldValue('custrecord_lotqtysold');
				
				var custrecord_rotation_expecteddelivery =  nlapiStringToDate(rotationRecord.getFieldValue('custrecord_rotation_expecteddelivery'));
				
				var lineDate = minimumDateDelivery;
				
				var today = new Date();
				
				nlapiLogExecution('DEBUG', custrecord_rotation_expecteddelivery + '>' + today, custrecord_rotation_expecteddelivery > today);	
				if(custrecord_loycurrentavailable < quantityordered || custrecord_rotation_expecteddelivery > today) {
					
					if(custrecord_loyqtyordered >= quantityordered && 	custrecord_lotqtysold == 0) {
							lineDate = custrecord_rotation_expecteddelivery;
							if(lineDate)
								lineDate.addBusDays(7);
							
							//nlapiLogExecution('DEBUG', 'custrecord_rotation_expecteddelivery',custrecord_rotation_expecteddelivery);	
							//nlapiLogExecution('DEBUG', 'lineDate',lineDate.addBusDays(5);	
							nlapiLogExecution('DEBUG', 'custrecord_loyqtyordered >= quantityordered', custrecord_loyqtyordered +' >= ' +  quantityordered);	
					} else {
						var filters = new Array();
						var columns = new Array();
						
						filters[0] = new nlobjSearchFilter('custrecord_lotitem', null, 'is', itemid);
						filters[1] = new nlobjSearchFilter('custrecord_loyqtyordered', null, 'greaterthanorequalto', quantityordered);
						filters[2] = new nlobjSearchFilter('custrecord_rotation_expecteddelivery', null, 'onorafter', 'today');
						
						columns[0] = new nlobjSearchColumn('custrecord_rotation_expecteddelivery');
						var searchresult = nlapiSearchRecord('customrecord_rotation', null,   filters, columns);			
					//	nlapiLogExecution('DEBUG', 'searchresult', custrecord_loyqtyordered +' >= ' + searchresult.length);	
						if(searchresult && searchresult.length) {
						searchresult.sort(function(a,b){ return nlapiStringToDate(a.getValue('custrecord_rotation_expecteddelivery')) - nlapiStringToDate(b.getValue('custrecord_rotation_expecteddelivery'))});
							
							lineDate = nlapiStringToDate(searchresult[0].getValue('custrecord_rotation_expecteddelivery'))
						//	nlapiLogExecution('DEBUG', 'lineDate', lineDate);	
							if(lineDate)
								lineDate.addBusDays(7);
						}
					}
				}
					
				//nlapiLogExecution('DEBUG', 'lineDate > deliverydate', lineDate +' > ' +  deliverydate);	
				if(lineDate > deliverydate || !deliverydate) {
					
					deliverydate = lineDate;
				}
			} catch(e) {
				nlapiLogExecution('ERROR', 'error', e + " rotation:"+rotationNumber);
			}
			//nlapiLogExecution('DEBUG', 'deliverydate ' + rotationNumber, deliverydate);	
		}
		
	response.write(nlapiDateToString(deliverydate));

}

Number.prototype.mod = function(n) {
return ((this%n)+n)%n;
}

Date.prototype.addBusDays = function(dd) {
var wks = Math.floor(dd/5);
var dys = dd.mod(5);
var dy = this.getDay();
if (dy === 6 && dys > -1) {
   if (dys === 0) {dys-=2; dy+=2;}
   dys++; dy -= 6;}
if (dy === 0 && dys < 1) {
   if (dys === 0) {dys+=2; dy-=2;}
   dys--; dy += 6;}
if (dy + dys > 5) dys += 2;
if (dy + dys < 1) dys -= 2;
this.setDate(this.getDate()+wks*7+dys);
}



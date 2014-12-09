function custompageinit() {
	nlapiSetFieldValue("custbody_deliverydate_hidden","");
	nlapiSetFieldValue("custbody_delivery_date","");
}

function custompagerecalc(type, action) {

	
		var minimumDateDelivery = new Date();
		minimumDateDelivery.addBusDays(5);
		
		var deliverydate = minimumDateDelivery;
		
		
		for (var j = 1; j <=nlapiGetLineItemCount('item'); j++) //check all the sales order lines 
		{
			var itemid = nlapiGetLineItemValue('item','item',j); 
		
			var rotationNumber = nlapiGetLineItemValue('item','custcol_rotation_website',j); 
		
			if(!rotationNumber) continue;
			var rotationRecord = nlapiLoadRecord('customrecord_rotation', rotationNumber);
			
			var quantityordered = nlapiGetLineItemValue('item','quantity',j); 	
			
			var custrecord_loycurrentavailable =  rotationRecord.getFieldValue('custrecord_loycurrentavailable');
			
			var custrecord_loyqtyordered =  rotationRecord.getFieldValue('custrecord_loycurrentavailable');
			
			var custrecord_lotqtysold =  rotationRecord.getFieldValue('custrecord_lotqtysold');
			
			var custrecord_rotation_expecteddelivery =  nlapiStringToDate(rotationRecord.getFieldValue('custrecord_rotation_expecteddelivery'));
			
			var lineDate = minimumDateDelivery;
			
			
			
			if(custrecord_loycurrentavailable < quantityordered) {
				if(custrecord_loyqtyordered >= quantityordered && 	custrecord_lotqtysold == 0) {
						lineDate = custrecord_rotation_expecteddelivery;
				} else {
					var filters = new Array();
					var columns = new Array();
					
					filters[0] = new nlobjSearchFilter('custrecord_lotitem', null, 'is', itemid);
					filters[1] = new nlobjSearchFilter('custrecord_loyqtyordered', null, 'greaterthanorequalto', quantityordered);
					
					columns[0] = new nlobjSearchColumn('custrecord_rotation_expecteddelivery');
					var searchresult = nlapiSearchRecord('customrecord_rotation', null,   filters, columns);			
					
					if(searchresult && searchresult.length) {
					searchresult.sort(function(a,b){ return nlapiStringToDate(a.getValue('custrecord_rotation_expecteddelivery')) - nlapiStringToDate(b.getValue('custrecord_rotation_expecteddelivery'))});
						
						lineDate = nlapiStringToDate(searchresult[0].getValue('custrecord_rotation_expecteddelivery'));
					}
				}
			}
				
			
			//nlapiLogExecution('ERROR', 'lineDate > deliverydate '+ lineDate + '>' +deliverydate, lineDate > deliverydate);
			if(lineDate > deliverydate || !deliverydate) {
				
				deliverydate = lineDate;
			}
			//nlapiLogExecution('ERROR', 'deliverydate'+deliverydate);
				
		}
		//var a = new Array();
		//a['User-Agent-x'] = 'SuiteScript-Call';
		//nlapiRequestURL('https://checkout.netsuite.com/c.1336541/site/cookiecreator.html?name=mmmmm&value=xxxxxxx', null, a);
		//nlapiSetFieldValue("custbody_deliverydate_hidden",nlapiDateToString(deliverydate));
		//nlapiSetFieldValue("custbody_delivery_date",nlapiDateToString(deliverydate));
	
	//	var response = nlapiRequestURL('https://checkout.netsuite.com/c.1336541/site/cookiecreator.html?name=mmmmm&value=xxxxxxx');
		//var bodyz = response.getBody();
		
		nlapiSetFieldValue("custbody_deliverydate_hidden",nlapiDateToString(deliverydate), true, true);
		nlapiSetFieldValue("custbody_delivery_date",nlapiDateToString(deliverydate), true, true );
		
		nlapiLogExecution('ERROR', 'END!' + new Date(), deliverydate);

	return true;
	
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



// JavaScript Document
function getDuty(params) {
	items = params.getParameter("items").split('*');
	var targetCurrency = params.getParameter('tcur');
	var exchangeRate = 1;
	var totalDuty = 0;
	var litres = null;
	nlapiLogExecution('DEBUG', 'items',items);
	
	try {
	
		if(targetCurrency != "")
		{
			exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
		}
		for (var j = 0; j <items.length; j++) //check all the sales order lines 
		{
			iteminfo = items[j].split('~');
			var itemid = iteminfo[0];
			var rotationNumber = iteminfo[1];
			var quantityordered = iteminfo[2]; 	
			
			if(itemid == 5969) continue; //Duty Item
			
			var rotationRecord = nlapiLoadRecord('customrecord_rotation', rotationNumber);	
			var uom =  rotationRecord.getFieldValue('custrecord_item_uom');
			var pouom =  rotationRecord.getFieldText('custrecord_rotation_polineunits');
			var ordertype = rotationRecord.getFieldValue('custrecord_rotation_ordertype');
			nlapiLogExecution('DEBUG', 'ordertype',ordertype);	
			
				var multiple = 1;
				if(pouom.indexOf(' x ') != -1) {
					
					x = pouom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
			
			if( ordertype == 2 || (multiple == 1 && quantityordered == 1 && ordertype == 1) )	{
				var uomSearchFilters = new Array();
				var uomSearchColumns = new Array();
				uomSearchFilters[0] = new nlobjSearchFilter('custrecord_baseunitlitres_uom', null, 'is', uom);	
				uomSearchColumns[0] = new nlobjSearchColumn('custrecord_baseunitlitres_litres');
				
				
				var uomSearchResults = nlapiSearchRecord('customrecord_baseunitlitres', null, uomSearchFilters, uomSearchColumns);
						
				if (uomSearchResults)
				{
					litres = uomSearchResults[0].getValue(uomSearchColumns[0]);
					
				} 
				
				var itemDutyBand = nlapiLookupField('inventoryitem',itemid,'custitem_duty_band');
					
						//lookup duty rate based on duty band
				var dutyRate = nlapiLookupField('customrecord_dutyrates',itemDutyBand,'custrecord_rate');
				nlapiLogExecution('DEBUG', 'multiple',multiple);
				nlapiLogExecution('DEBUG', 'dutyRate',dutyRate);
				nlapiLogExecution('DEBUG', 'quantityordered',quantityordered);
				nlapiLogExecution('DEBUG', 'exchangeRate',exchangeRate);
				nlapiLogExecution('DEBUG', 'litres',litres);
				totalDuty += parseFloat(dutyRate) * parseFloat(multiple) * parseFloat(quantityordered) * parseFloat(exchangeRate) * parseFloat(litres);
				nlapiLogExecution('DEBUG', 'totalDuty',totalDuty);
			}
		}
	
	} catch (e) {
		
	}
	
	response.write(totalDuty);
}
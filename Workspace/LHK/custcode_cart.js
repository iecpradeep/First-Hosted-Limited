function customPageLogin(type) {

	
		count = nlapiGetLineItemCount('item');
		newitem_rate =  parseFloat(nlapiGetLineItemValue('item','item',count));
		newitem_qty = parseInt(nlapiGetLineItemValue('item', 'quantity',count));
		newitem_item = nlapiGetLineItemValue('item', 'item',count);
		newitem_rot = nlapiGetLineItemValue('item', 'custcol_rotation_website',count);
		newitem_extra = nlapiGetLineItemValue('item', 'custcol_extra_item_details',count);
		

		nlapiLogExecution('DEBUG', 'nlapiGetLineItemCount', nlapiGetLineItemCount('item'));
		for (var j = 1; j <nlapiGetLineItemCount('item'); j++) //check all the sales order lines 
		{
			var itemid = nlapiGetLineItemValue('item','item',j); 
			var rotationNumber = nlapiGetLineItemValue('item','custcol_rotation_website',j);
			var price = parseFloat(nlapiGetLineItemValue('item','rate',j)); 
			var qty = nlapiGetLineItemValue('item','quantity',j);
			var extra = nlapiGetLineItemValue('item','custcol_extra_item_details',j);
			/*nlapiLogExecution('DEBUG', 'newitem_extra', newitem_item +"=="+ itemid);
			nlapiLogExecution('DEBUG', 'newitem_extra', rotationNumber +"=="+ newitem_rot);
			nlapiLogExecution('DEBUG', 'newitem_extra', newitem_rate +"=="+ price);
			nlapiLogExecution('DEBUG', 'newitem_extra', newitem_extra +"=="+ extra);
			nlapiLogExecution('DEBUG', 'newitem_extra', newitem_item == itemid && rotationNumber == newitem_rot && newitem_rate != price && newitem_extra == extra);*/
			if(newitem_item == itemid && rotationNumber == newitem_rot && newitem_extra == extra) {
				
				
				/*extradet =  (extra.substring(0, extra.indexOf('*'))).split("~");
				units = extradet[1];
				
				
				//var itemrecord = nlapiLoadRecord('inventoryitem', itemid);
	
				var multiple = 1;
				if(units.indexOf(' x ') != -1) {
					
					x = units.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
	
				var quantityLevels = nlapiGetMatrixCount('price1', 'price');
				newqty = qty + newitem_qty;
				nlapiSetCurrentLineItemValue('item', 'quantity', newqty, true, true);
				
				if ( quantityLevels > 1 ){
					
					for ( var k=1; k<=quantityLevels;k++) {
						
						
						if(nlapiGetMatrixValue( 'price1', 'price', k) && nlapiGetMatrixValue( 'price1', 'price', k) !=0) {
							var casel = newqty * multiple;
							qtylvl = nlapiGetMatrixValue( 'price1', 'price', k);
							qtylvlprice = 	nlapiGetLineItemMatrixValue( 'price1', 'price', '1', k);
							
							if(casel >= qtylvl) {
								nlapiSetCurrentLineItemValue('item', 'rate', qtylvlprice, true, true);
							}
							
						}
					}
			 
			
				}*/
				
				//nlapiSetLineItemValue('item','rate',j,0.00); 
				//nlapiSetLineItemValue('item','amount',j,0.00);
				//nlapiSetLineItemValue('item','quantity',j,0); 
			    nlapiSelectLineItem('item', j);
				nlapiRemoveLineItem('item', j)
			} 
			
		}

    //nlapiSetCurrentLineItemValue('item', 'quantity', 0);        
    return true;
			
}
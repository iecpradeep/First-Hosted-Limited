// JavaScript Document
function formatCurrency(num) {
	num = num.toString().replace(/\$|\,/g,'');
	if(isNaN(num))
	{
		num = "0";
	}	
	sign = (num == (num = Math.abs(num)));
	num = Math.floor(num*100+0.50000000001);
	cents = num%100;
	num = Math.floor(num/100).toString();
	if(cents<10)
	{
		cents = "0" + cents;
	}	
	for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
	{
		num = num.substring(0,num.length-(4*i+3)) + ',' + num.substring(num.length-(4*i+3));		
	}	
	return (((sign)?'':'-') + num + '.' + cents);
}

function getPricebyQty (params) {
	
	var qty = params.getParameter('qty');
	var rotationid = params.getParameter('rid');
	var price = params.getParameter('price');
	var rotrecord = nlapiLoadRecord('customrecord_rotation', rotationid);
	var itemid = rotrecord.getFieldValue("custrecord_lotitem");
	var units = rotrecord.getFieldText("custrecord_rotation_polineunits");
	nlapiLogExecution('ERROR', 'units', units);
	var multiple = 1;
	if(units.indexOf(' x ') != -1) {
		
		x = units.match(/[\d\.]+/g);
		multiple = x[0];
	
	}
	price = price.match(/[\d\.]+/g);
	
	var itemrecord = nlapiLoadRecord('inventoryitem', itemid);
	
	var quantityLevels = itemrecord.getMatrixCount('price1', 'price');
	if ( quantityLevels > 1 ){
		
		for ( var j=1; j<=quantityLevels; j++) {
			
			
			if(itemrecord.getMatrixValue( 'price1', 'price', j) && itemrecord.getMatrixValue( 'price1', 'price', j) !=0) {
				var casel = qty * multiple;
				qtylvl = itemrecord.getMatrixValue( 'price1', 'price', j);
				qtylvlprice = itemrecord.getLineItemMatrixValue( 'price1', 'price', '1', j);
				
				if(casel >= qtylvl) {
				 	price = qtylvlprice;
				}
			}
		}
 

	}
	
	/*nlapiLogExecution('ERROR', 'qty', qty);
	nlapiLogExecution('ERROR', 'rotationid', rotationid);
	nlapiLogExecution('ERROR', 'price', price);
	nlapiLogExecution('ERROR', 'rotrecord', rotrecord);
	nlapiLogExecution('ERROR', 'multiple', multiple);*/
	newprice = price * qty * multiple;
	//newprice = parseFloat(newprice);
	response.write(formatCurrency(newprice.toFixed(2)));
	
}

function getPriceLevels(params) {
	
	var qty = params.getParameter('qty');
	var rotationid = params.getParameter('rid');
	var price = params.getParameter('price');
	var rotrecord = nlapiLoadRecord('customrecord_rotation', rotationid);
	var units = rotrecord.getFieldText("custrecord_rotation_polineunits");
	var itemid = rotrecord.getFieldValue("custrecord_lotitem");
	var rates = "";
	var multiple = 1;
	if(units.indexOf(' x ') != -1) {
		
		x = units.match(/[\d\.]+/g);
		multiple = x[0];
	
	}
	price = price.match(/[\d\.]+/g);
	
	rates += price * multiple;
	
	
	var itemrecord = nlapiLoadRecord('inventoryitem', itemid);
	
	var quantityLevels = itemrecord.getMatrixCount('price1', 'price');
	
	if ( quantityLevels > 1 ){
		
		for ( var j=1; j<=quantityLevels; j++) {
			
			
			if(itemrecord.getMatrixValue( 'price1', 'price', j) && itemrecord.getMatrixValue( 'price1', 'price', j) !=0) {
				
				qtylvl = itemrecord.getMatrixValue( 'price1', 'price', j);
				qtylvlprice = itemrecord.getLineItemMatrixValue( 'price1', 'price', '1', j);
				if(rates != "") {
				 	rates += "|";
				}
				newrate = qtylvlprice * multiple;
				rates += newrate;
				
			}
		}
 

	}
	
	response.write(rates);
}
function formatCurrency(num) {
num = num.toString().replace(/\$|\,/g,'');
if(isNaN(num))
num = "0";
sign = (num == (num = Math.abs(num)));
num = Math.floor(num*100+0.50000000001);
cents = num%100;
num = Math.floor(num/100).toString();
if(cents<10)
cents = "0" + cents;

for (var i = 0; i < Math.floor((num.length-(1+i))/3); i++)
num = num.substring(0,num.length-(4*i+3))+','+
num.substring(num.length-(4*i+3));
return (((sign)?'':'-') + num + ((cents != "00")?'.' + cents:''));
}

// JavaScript Document
function getAvailableRotation(params){
	//var itemid = params.getParameter("itemid");
	var rotation = params.getParameter("rotid");
	var cid = params.getParameter("cid");
	var itemid;
	var ordertype;
	var winename;
	var uom;
	var itemname;
	/*var rotunit = params.getParameter("unit");
	var duty = params.getParameter("duty");*/
	var qtyRequested = params.getParameter("qty");
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	if(moneySymbol == 1)
	{
		moneySymbol = '&pound';
	}
	if(moneySymbol == 2)
	{
		moneySymbol = '&#36;';
	}
	if(moneySymbol == 3)
	{
		moneySymbol = '&euro;';
	}
	if(moneySymbol == 4)
	{
		moneySymbol = 'sFr.';
	}
	if(moneySymbol == 5)
	{
		moneySymbol = 'HK$';
	}
	
	var exchangeRate = 0;
	if(targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	var returnobj = new Object();
	try {
		
		
		rotationrecord = nlapiLoadRecord("customrecord_rotation", rotation);
		rotcurqty = rotationrecord.getFieldValue('custrecord_rotation_item_units_available');
		rotinbasket = rotationrecord.getFieldValue('custrecord_inbasket');
		itemid = rotationrecord.getFieldValue("custrecord_lotitem");
		uom = rotationrecord.getFieldText('custrecord_rotation_polineunits');
		winename = rotationrecord.getFieldText('custrecord_rotation_wine_name');
		var grower = rotationrecord.getFieldText('custrecord_rotation_wine_grower');
		var vintage = rotationrecord.getFieldText('custrecord_po_wine_vinatge');
		ordertype = rotationrecord.getFieldText('custrecord_rotation_ordertype');
		
		if(grower) 
			winename += ', ' + grower;
				
		itemname = rotationrecord.getFieldText("custrecord_lotitem");
		if(rotinbasket && rotcurqty) rotcurqty = parseInt(rotcurqty) - parseInt(rotinbasket);
			

		if(rotcurqty >= parseInt(qtyRequested)) {		
			
			
			
			
						
						
			var multiple = 1;
			if(uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
			
			}
			
			
			var itemrecord = nlapiLoadRecord('inventoryitem', itemid);
			price = itemrecord.getLineItemMatrixValue('price1', 'price', '1','1');
			var quantityLevels = itemrecord.getMatrixCount('price1', 'price');
			if ( quantityLevels > 1 ){
				
				for ( var j=1; j<=quantityLevels; j++) {
					
					
					if(itemrecord.getMatrixValue( 'price1', 'price', j) && itemrecord.getMatrixValue( 'price1', 'price', j) !=0) {
						var casel = qtyRequested * multiple;
						qtylvl = itemrecord.getMatrixValue( 'price1', 'price', j);
						qtylvlprice = itemrecord.getLineItemMatrixValue( 'price1', 'price', '1', j);
						
						if(casel >= qtylvl) {
							price = qtylvlprice;
						}
					}
				}
		 
		
			}
			
			if(exchangeRate != 0)
			{
				price = price * exchangeRate;
			}
			newprice = price * multiple;
			newprice = formatCurrency(Math.round(newprice.toFixed(2)))+'.00';		
			extradetails = vintage + '~' + uom + '~' + ordertype + '~' + winename +'*';
			extradetails = extradetails.replace(/\'/g, "@POSTRO");
			

			returnobj.extradetails = extradetails;
			returnobj.newprice = newprice;
			returnobj.rotid = rotationrecord.getId();
			
			/*//update in basket
			var newinbasket = parseInt(rotationrecord.getFieldValue('custrecord_inbasket')) + 1;
			rotationrecord.setFieldValue("custrecord_inbasket",newinbasket);
			nlapiSubmitRecord(rotationrecord);*/
			
		} else {
			var rotunit = rotationrecord.getFieldValue("custrecord_rotation_polineunits");
			var duty =  rotationrecord.getFieldValue("custrecord_rotation_ordertype");
			
			var filters = new Array();
			filters.push(new nlobjSearchFilter('custrecord_lotitem', null, 'is', itemid));
			filters.push(new nlobjSearchFilter('custrecord_rotation_polineunits', null, 'is', rotunit));
			filters.push(new nlobjSearchFilter('custrecord_rotation_ordertype', null, 'is', duty));
			filters.push(new nlobjSearchFilter('custrecord_rotation_item_units_available', null, 'greaterthanorequalto', qtyRequested));
			
			var columns = new Array();
			columns.push(new nlobjSearchColumn('internalid'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_item_units_available'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_polineunits'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_wine_name'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_wine_grower'));
			columns.push(new nlobjSearchColumn('custrecord_po_wine_vinatge'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_ordertype'));
			columns.push(new nlobjSearchColumn('custrecord_inbasket'));
			columns.push(new nlobjSearchColumn('custrecord_rotation_owcstatus'));
			
			var rotationresults = nlapiSearchRecord('customrecord_rotation', null, filters, columns); 
			
			if(rotationresults) {
				for(var i = 0; i < rotationresults.length; i++) {
					var id = rotationresults[i].getId();
					var img = (rotationresults[i].getValue('custrecord_lotimage1') != '')?rotationresults[i].getValue('custrecord_lotimage1'):'';
					var qty = rotationresults[i].getValue('custrecord_rotation_item_units_available');
					var desc = rotationresults[i].getValue('custrecord_lotdescription');
					var name = rotationresults[i].getValue('name');
					uom = rotationresults[i].getText('custrecord_rotation_polineunits');
					winename = rotationresults[i].getText('custrecord_rotation_wine_name');
					var grower = rotationresults[i].getText('custrecord_rotation_wine_grower');
					var vintage = rotationresults[i].getText('custrecord_po_wine_vinatge');
					ordertype = rotationresults[i].getText('custrecord_rotation_ordertype');
					var eta = (rotationresults[i].getValue('custrecord_rotation_expecteddelivery')==null?'':  rotationresults[i].getValue('custrecord_rotation_expecteddelivery'));
					var inbasket = rotationresults[i].getValue('custrecord_inbasket');
					var condition =  rotationresults[i].getText('custrecord_rotation_owcstatus');
					
					if(grower) 
						winename += ', ' + grower;
				
					if(inbasket && qty)
						qty = parseInt(qty) - parseInt(inbasket);
						
					if(qty < parseInt(qtyRequested)) continue;
					
					var multiple = 1;
					if(uom.indexOf(' x ') != -1) {
						
						x = uom.match(/[\d\.]+/g);
						multiple = x[0];
					
					}
					
					
					var itemrecord = nlapiLoadRecord('inventoryitem', itemid);
					price = itemrecord.getLineItemMatrixValue('price1', 'price', '1','1');
					var quantityLevels = itemrecord.getMatrixCount('price1', 'price');
					if ( quantityLevels > 1 ){
						
						for ( var j=1; j<=quantityLevels; j++) {
							
							
							if(itemrecord.getMatrixValue( 'price1', 'price', j) && itemrecord.getMatrixValue( 'price1', 'price', j) !=0) {
								var casel = qtyRequested * multiple;
								qtylvl = itemrecord.getMatrixValue( 'price1', 'price', j);
								qtylvlprice = itemrecord.getLineItemMatrixValue( 'price1', 'price', '1', j);
								
								if(casel >= qtylvl) {
									price = qtylvlprice;
								}
							}
						}
				 
				
					}
					
					if(exchangeRate != 0)
					{
						price = price * exchangeRate;
					}
					newprice = price * multiple;
					newprice = formatCurrency(Math.round(newprice.toFixed(2)))+'.00';		
					extradetails = vintage + '~' + uom + '~' + ordertype + '~' + winename +'*';
					extradetails = extradetails.replace(/\'/g, "@POSTRO");
					
		
					returnobj.extradetails = extradetails;
					returnobj.newprice = newprice;
					returnobj.rotid = id;
					
					/*//update in basket
					var rotationtoreturn = nlapiLoadRecord("customrecord_rotation", id);
					var newinbasket = parseInt(rotationtoreturn.getFieldValue('custrecord_inbasket')) + 1;
					rotationtoreturn.setFieldValue("custrecord_inbasket",newinbasket);
					nlapiSubmitRecord(rotationtoreturn);*/
					
				}
			}
		}
		
		try {
			//send notification if out of stock
			if(!returnobj.rotid) {
				var customer = nlapiLoadRecord("customer", cid);
				var customername = customer.getFieldValue("firstname") + " " + customer.getFieldValue("lastname");
				if(customername == " ") {
					customername = customer.getFieldValue("companyname");
				}
				var customeremail = customer.getFieldValue("email");
				var author = -5; //tom.mann@lhkfinewines.com
				var emailcontents = customername+"["+customeremail+"] has requested for "+itemname+" - "+winename+" (Duty: "+ordertype+", Unit Size: "+uom+", Qty Requested: "+qtyRequested+")."
				nlapiSendEmail(author, "info@lhkfinewines.com",'Re-Order Items - Out of Stock' , emailcontents);
			}
			
		} catch (e) {
			nlapiLogExecution('ERROR', 'e notif', e);
		}
		
		
	} catch (e) {
		nlapiLogExecution('ERROR', 'e', e);
	}
	
	myJSON= JSON.stringify({rotations:returnobj});
	
	response.write(myJSON);
}
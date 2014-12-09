// JavaScript Document
function setTerms() {
	var currentContext = nlapiGetContext();
	//nlapiLogExecution('DEBUG', 'start', 'beforeSave_cust'+currentContext.getExecutionContext());
	if(currentContext.getExecutionContext() != 'webstore') return true;
	try {
		customer = nlapiGetFieldValue('entity') 
		
		if(customer > 0) {
			terms =  nlapiLookupField('customer', customer, 'terms');
			if(!terms) {
				nlapiSetFieldValue('terms','1',true,true) 
				 nlapiSubmitField('customer', customer, 'terms', '1');
				 nlapiLogExecution('DEBUG', 'start', 'TERM SET' + customer);
			}
			
			
		}
	} catch (e) {
		nlapiLogExecution('ERROR', 'e', e);
	}
}




function beforeSave_cust() {
	
	var currentContext = nlapiGetContext();
	nlapiLogExecution('DEBUG', 'start', 'beforeSave_cust'+currentContext.getExecutionContext());
	if(currentContext.getExecutionContext() != 'webstore') return true;
	saletype = nlapiGetFieldValue("custbody_saletype");
	addresstype = nlapiGetFieldValue("custbody1");
	var solocation = -1;
	var casenumber = 0;
	nlapiSetFieldValue('custbody_salessource','-4');
	
	salesrep =  nlapiGetFieldValue("salesrep");
	//nlapiSetFieldValue('salesrep','');
	//nlapiSetFieldValue('salesrep',salesrep,true,true);
	
	var bondwarehouse = nlapiGetFieldValue("custbody_bondwarehouse");
	if(saletype == 2 && addresstype == 3)  nlapiSetFieldValue('shippingcost',0);	
	if(addresstype == 3) {
		 nlapiSetFieldValue("shipaddresslist", '');	
		 nlapiSetFieldValue("shipaddress", '');	
	} else if(addresstype == 2) {
		 nlapiSetFieldValue("shipaddresslist", '');	
		 nlapiSetFieldValue("shipaddress", '');	
		 nlapiGetFieldValue("custbody_bondwarehouse",bondwarehouse);
		/*customer = nlapiGetFieldValue("entity");
		whouse = nlapiGetFieldValue("custbody3");
		whousename = nlapiGetFieldText("custbody3");
		account = nlapiGetFieldValue("custbody2");
		var bondid = "";
		var filters = new Array();
		filters.push(new nlobjSearchFilter('custrecord_customername', null,'is', customer));
		filters.push(new nlobjSearchFilter('custrecord_bondwarehouse', null,'is', whouse));
		filters.push(new nlobjSearchFilter('custrecord2', null,'is', account));
		
		ar custbonddetails = nlapiSearchRecord('customrecord_custbonddetails', null, filters); // make search
		
		if(!custbonddetails || !custbonddetails.length) {
			try {
					var customerbonddetails = nlapiCreateRecord("customrecord_custbonddetails");
					customerbonddetails.setFieldValue("name",whousename);
					customerbonddetails.setFieldValue("custrecord_bondwarehouse",whouse);
					customerbonddetails.setFieldValue("custrecord_customername",customer);
					customerbonddetails.setFieldValue("custrecord2",account);
					bondid =nlapiSubmitRecord(customerbonddetails);
			} catch(e){ nlapiLogExecution('ERROR', 'customer error', e); }
		} else {
			bondid = custbonddetails[0].getId();	
		}
		if(bondid)
		 	nlapiSetFieldValue("custbody_bondwarehouse", bondid);	*/
	}
	
	if(saletype != 2 || (saletype == 2 && addresstype == 3)) {
		nlapiSetFieldValue('shippingtaxcode',15,true,true);
	}
	else { nlapiSetFieldValue('shippingtaxcode',6) }
	nlapiLogExecution('DEBUG', 'taxtotal', nlapiGetFieldValue('taxtotal'));
	for (var j = 1; j <=nlapiGetLineItemCount('item'); j++) {
		nlapiSelectLineItem('item',j)
		
		try {
			extradet = nlapiGetCurrentLineItemValue('item','custcol_extra_item_details');
			qty = nlapiGetCurrentLineItemValue('item','quantity');
			if(extradet) {
				extradet =  (extradet.substring(extradet.indexOf(':') + 2, extradet.indexOf('*'))).split("~");
				var uom = extradet[1];
				var multiple = 1;
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
				casenumber += parseInt(multiple) * qty;
			}
		} catch(x) {}
		if(saletype != 2 || (saletype == 2 && addresstype == 3)) {
			rate = nlapiGetCurrentLineItemValue('item','rate');
			nlapiSetCurrentLineItemValue('item','taxcode',15,true,true);
			nlapiSetCurrentLineItemValue('item','tax1amt',"0",true,true);
			nlapiSetCurrentLineItemValue('item','rate',rate,true,true);
			
	
		} else if(addresstype){ 	
			rate = nlapiGetCurrentLineItemValue('item','rate');
			nlapiSetCurrentLineItemValue('item','taxcode',6,true,true);
			nlapiSetCurrentLineItemValue('item','rate',rate,true,true);
		} else {
			rate = nlapiGetCurrentLineItemValue('item','rate');
			nlapiSetCurrentLineItemValue('item','taxcode',15,true,true);
			nlapiSetCurrentLineItemValue('item','tax1amt',"0",true,true);
			nlapiSetCurrentLineItemValue('item','rate',rate,true,true);
		}
		
		
		try {
			custcol_rotation_website = nlapiGetCurrentLineItemValue('item','custcol_rotation_website');
			if(custcol_rotation_website && nlapiGetCurrentLineItemValue('item','item') != 5969) {
				var rotationRecord = nlapiLoadRecord('customrecord_rotation', custcol_rotation_website);
				nlapiSetCurrentLineItemValue('item','custcol_tran_rotation',custcol_rotation_website,true,true);
				nlapiSetCurrentLineItemValue('item','custcol_wineprintcolumn',rotationRecord.getFieldText('custrecord_rotation_wine_name'),true,true);
				nlapiSetCurrentLineItemValue('item','custcol_growerprintcolumn',rotationRecord.getFieldText('custrecord_rotation_wine_grower'),true,true);
				nlapiSetCurrentLineItemValue('item','custcol_tran_vintage',rotationRecord.getFieldValue('custrecord_po_wine_vinatge'),true,true);
				nlapiSetCurrentLineItemValue('item','location',rotationRecord.getFieldValue('custrecord_rotation_location'),true,true);
				nlapiSetCurrentLineItemValue('item','custcol_fhl_uom',rotationRecord.getFieldValue('custrecord_item_uom'),true,true);
				nlapiSetCurrentLineItemValue('item','custcol_fhl_purchase_rate',rotationRecord.getFieldValue('custrecord_rotation_gbp_unitcost'),true,true);
				nlapiSetCurrentLineItemValue('item','custcol_rotationqty',rotationRecord.getFieldValue('custrecord_rotation_item_units_available'),true,true);
				
				rotloc = rotationRecord.getFieldValue('custrecord_rotation_location');
				if(solocation != -1 && solocation != rotloc) {
					solocation = 0;
				} else if(solocation != 0) {
					solocation = rotloc;
				}
				
				
				
			}
			
		} catch(e) {
			
		}
		nlapiCommitLineItem('item')
		
	}
	
	if(solocation != -1 && solocation != 0) {
		nlapiSetFieldValue("location", solocation);		
	}
	
	if(nlapiGetFieldValue('shipmethod') == 3361) {
		var exchangeRate = 1;
		targetCurrency = nlapiGetFieldValue('currency');
		
		if(targetCurrency != "GBP")
		{
			exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
		}
		
		var totlshipcost = 30 * exchangeRate * casenumber;
		nlapiSetFieldValue("shippingcost", totlshipcost);		
		
		
	}
	
	
		nlapiLogExecution('DEBUG', 'taxtotal', nlapiGetFieldValue('taxtotal'));
	
	
	
	nlapiLogExecution('DEBUG', 'taxtotal', nlapiGetFieldValue('taxtotal'));
	return true;
	
}

function recalc() {
	var currentContext = nlapiGetContext();
	nlapiLogExecution('DEBUG', 'start', 'beforeSave_cust'+currentContext.getExecutionContext());
	if(currentContext.getExecutionContext() != 'webstore' &&  nlapiGetFieldValue("customform") != 104) return true;
	saletype = nlapiGetFieldValue("custbody_saletype");
	addresstype = nlapiGetFieldValue("custbody1");
	shippingtaxcode = nlapiGetFieldValue("shippingtaxcode");
	if(saletype != 2 || (saletype == 2 && addresstype == 3) || addresstype=="") {
		ishippingtaxcode = 15;
		nlapiSetFieldValue('shippingtaxcode',15,true,true);
	} else { 
		ishippingtaxcode = 6;
		
	}
	
	if(ishippingtaxcode != shippingtaxcode) nlapiSetFieldValue('shippingtaxcode',ishippingtaxcode,true,true) 
	
	for (var j = 1; j <=nlapiGetLineItemCount('item'); j++) {
		var rate = nlapiGetLineItemValue('item','rate',j);
		var taxcode = nlapiGetLineItemValue('item','taxcode',j);
		var taxamount = "";
		var itaxcode = 15;
		var	itaxamount = "0";
		
		if(saletype != 2 || (saletype == 2 && addresstype == 3) || addresstype=="") {
			itaxcode = 15;		
		} else { 	
			itaxcode = 6;			
		} 
		
		if(taxcode != itaxcode) {
			nlapiSelectLineItem('item',j)
			nlapiSetCurrentLineItemValue('item','taxcode',itaxcode,true,true);
			nlapiSetCurrentLineItemValue('item','rate',rate,true,true);
			nlapiCommitLineItem('item')
		
		}
	}
	
}

function recalc_addTax(type) {
	var currentContext = nlapiGetContext();
	try {
		if(currentContext.getExecutionContext() != 'webstore' || type != 'item') return true;
		
		
		//default to 20% tax
		
		for (var j = 1; j <=nlapiGetLineItemCount('item'); j++) {
			nlapiSelectLineItem('item',j)
			
			rate = nlapiGetCurrentLineItemValue('item','rate');
			nlapiSetCurrentLineItemValue('item','taxcode',6,true,true);
			nlapiSetCurrentLineItemValue('item','rate',rate,true,true);
			
			nlapiCommitLineItem('item')
			
		}
	
	} catch (e) {
		nlapiLogExecution('ERROR', 'e', e);
	}

	return true;
	
}

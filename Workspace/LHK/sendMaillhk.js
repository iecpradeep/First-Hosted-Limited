// JavaScript Document
function sendEmail()
{
	var currentContext = nlapiGetContext();
	if(currentContext.getExecutionContext() != 'webstore') return;
	
	var author = 6415; //info@lhkfinewines.com 
	var saleorderaux = nlapiGetRecordId();
	nlapiLogExecution('DEBUG', 'id', saleorderaux);
	var saleorder = nlapiLoadRecord('salesorder', saleorderaux);
	var saleorderid = saleorderaux;
	
	var customerid = saleorder.getFieldValue('entity');
	var mycustomer = nlapiLoadRecord('customer', customerid);
	var customername =  mycustomer.getFieldValue('firstname');
	var custcategory =  mycustomer.getFieldValue('category');
	
	nlapiLogExecution('DEBUG', 'customername', customername);
	nlapiLogExecution('DEBUG', 'custcategory', custcategory);
	var trandate = saleorder.getFieldValue('trandate');
	var dutystat = saleorder.getFieldText('custbody_saletype');
	var currency = saleorder.getFieldText('currency');
	var addresstype =  saleorder.getFieldValue("custbody1");
	var custbody_bondwarehouse = saleorder.getFieldValue("custbody_bondwarehouse");
	var custbody_bondaddress ="";
	var isdutyexists = 0;
	
	
	
	
	if(custbody_bondwarehouse) {
		try{
		
			var bond = nlapiLoadRecord("customrecord_custbonddetails",custbody_bondwarehouse);
			waccnum = bond.getFieldValue("custrecord2");
			wname = bond.getFieldText("custrecord_bondwarehouse");
			wadd = bond.getFieldValue("custrecord_bondwarehouseaddress");
			if(waccnum) custbody_bondaddress += waccnum + "<br>";
			if(wname) custbody_bondaddress += wname + "<br>";
			if(wadd) custbody_bondaddress +=  wadd.replace("\n", "<br/>","g");
		
		} catch(e) {
			
		}
		
	}
	
	
	if(currency == 'GBP')
	{
		currencysymbol = '&pound;';
	}
	if(currency == 'USD')
	{
		currencysymbol = '&#36;';
	}
	if(currency == 'EUR')
	{
		currencysymbol = '&euro;';
	}
	if(currency == 'CHF')
	{
		currencysymbol = 'sFr.';
	}
	if(currency == 'HKD')
	{
		currencysymbol = 'HK$';
	}	
	
	var deliverydate = saleorder.getFieldValue('custbody_delivery_date');
	
	var custmail = mycustomer.getFieldValue('email');
	var cc = new Array();
	cc.push("info@lhkfinewines.com");
	var contactlinenum = mycustomer.getLineItemCount('contactroles');
	if(contactlinenum > 0 && custcategory != "1") {
		customername = mycustomer.getLineItemValue('contactroles','contactname' ,1);
		custmail = mycustomer.getLineItemValue('contactroles','email' ,1);
		cc.push(mycustomer.getFieldValue('email'));
	}
	
	
	
	
	var orderid = saleorder.getFieldValue('tranid');
	var memo = saleorder.getFieldValue('memo');
	nlapiLogExecution('DEBUG', 'tranid', orderid);
	nlapiLogExecution('DEBUG', 'memo', saleorder.getFieldValue('memo'));
	
	var shippinginfo = '';
	var shipaddressee = saleorder.getFieldValue('shipaddressee');
	if(shipaddressee!=null)
		shippinginfo += shipaddressee + '<br>';
	
	var shippaddr1 = saleorder.getFieldValue('shipaddr1');
	if(shippaddr1 !=null)
		shippinginfo += shippaddr1 + '<br>';
	
	var shippaddr2 = saleorder.getFieldValue('shipaddr2');
	if(shippaddr2 !=null)
		shippinginfo += shippaddr2 + '<br>';

	shippinginfo += saleorder.getFieldValue('shipcity') + ' ' + saleorder.getFieldValue('shipstate') + ' ' + saleorder.getFieldValue('shipzip') + '<br>';
	var shipcountry = saleorder.getFieldValue('shipcountry');
	if(shipcountry!=null)
	{
		if(shipcountry=='US')
			shipcountry = 'United States';
		else if(shipcountry=='GB')
			shipcountry = 'United Kingdom';
		shippinginfo += shipcountry + '<br>';
	}
	
	var shipphone = saleorder.getFieldValue('custbodycustphone');
	if(shipphone)
		shippinginfo += 'Phone: ' + shipphone ;
	
	if(addresstype == 2) { shippinginfo = custbody_bondaddress;}
	else if(addresstype == 3) { shippinginfo = "";}
	
	
	



	var billinginfo = '<b>Billing Information: </b><br><br>';
	var billaddressee = saleorder.getFieldValue('billaddressee');
	if(billaddressee!=null)
		billinginfo += billaddressee + '<br>';
	
	var billaddr1 = saleorder.getFieldValue('billaddr1');
	if(billaddr1 !=null)
		billinginfo += billaddr1 + '<br>';
	
	var billaddr2 = saleorder.getFieldValue('billaddr2');
	if(billaddr2 !=null)
		billinginfo += billaddr2 + '<br>';

	billinginfo += saleorder.getFieldValue('billcity') + ' ' + saleorder.getFieldValue('billstate') + ' ' + saleorder.getFieldValue('billzip') + '<br>';
	var billcountry = saleorder.getFieldValue('billcountry');
	if(billcountry!=null)
	{
		if(billcountry=='US')
			billcountry = 'United States';
		billinginfo += billcountry + '<br>';
	}
	
	
	
	var shipvia = saleorder.getFieldText('shipmethod');
	var shipmeth = saleorder.getFieldValue('shipmethod');
	var taxtotal = saleorder.getFieldValue('taxtotal');
	var total = saleorder.getFieldValue('total');
	var subtotal = saleorder.getFieldValue('subtotal');
	var shippingtotal = saleorder.getFieldValue('shippingcost');
	if(shipmeth == 3356 || shipmeth == 3624) {
		shippingtotal = "POA";
	}
	
	var myhtml = '<html><head><style>.smalltext { font-size: 9pt; }  .texttable  { font-size: 10pt; padding: 2 0 2 0 ; border-style: solid; border-width: 1 1 1 1; border-color: white; vertical-align: top;}.texttablebold  { font-size: 10pt; padding: 2 0 2 0; font-weight: bold; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;} .texttablectr  { font-size: 10pt; text-align: center; padding: 2 0 2 0; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;} .texttablert  { font-size: 10pt; text-align: right; padding: 2 0 2 0; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;} table {	margin:0px;padding:0px;}#shopcart tr td{padding-right: 5px;padding-left: 5px;}</style></head>';
	myhtml += '<body style="font-family: Arial,sans-serif; font-size: 10pt; padding:10px;">Dear '+customername+',<br><br>Thank you for shopping with LHK Fine Wines. Your order has been received - please find your order details below. If you need to change anything to do with this order please <a href="http://shopping.netsuite.com/s.nl/c.1336541/sc.10/category.140/it.C/.f">contact us</a> as soon as possible.<br><br>Order No: '+orderid+'<br>Order Date: '+trandate;
	if(dutystat)
		myhtml += '<br>Duty Status: ' + dutystat;
	myhtml += '<br>Currency: ' + currency + '<br><br><span style="font-weight:bold; text-decoration:underline">Order Summary:</span><br><br>';
	//myhtml+= '<table id="shopcart" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family:Arial, sans-serif;font-size:12px;"><tr style="background-color:#cccccc; font-weight:bold" height="35px" align="center"><td width="8%" align="center"> Quantity</td><td width="7%" align="left"> Unit</td><td width="15%" align="left"> Wine</td><td width="5%" align="center"> Vintage</td><td width="5%" align="center">Price / Item</td><td width="7%" align="center">Duty</td><td width="4%" align="center">VAT</td><td width="7%" align="center">Gross Amount</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';
	myhtml+= '<table id="shopcart" cellspacing="0" cellpadding="0" border="0" width="100%" style="font-family:Arial, sans-serif;font-size:12px;"><tr style="background-color:#cccccc; font-weight:bold" height="35px" align="center"><td width="9%" align="center"> Qty</td><td width="8%" align="left"> Unit</td><td width="15%" align="left"> Wine</td><td width="6%" align="center"> Vintage</td><td width="6%" align="center">Price / Item</td><td width="5%" align="center">VAT</td><td width="8%" align="center">Gross Amount</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';
	var soitems = saleorder.getLineItemCount('item') ;
	var duty = 0;
	var dutytax = 0;
	var dutyrow = "";
	isdutyexists =saleorder.findLineItemValue('item','item',"5969")
	for(var i = 1 ; i<= soitems ; i++)
	{
		//3675 terms and conditions
		var itemid = saleorder.getLineItemValue('item','item' ,i);
		var description = saleorder.getLineItemValue('item','description' ,i);
		var rate = saleorder.getLineItemValue('item','rate' ,i);
		var linetotal = saleorder.getLineItemValue('item','amount' ,i);
		
		var taxrate1 = saleorder.getLineItemValue('item','taxrate1' ,i);
		var itemname = saleorder.getLineItemValue('item','custcol_pos_posdisplayname' ,i);
		var qty = saleorder.getLineItemValue('item','quantity' ,i);
		var itemoptions = saleorder.getLineItemValue('item','options',i);
		var withtaxamount = saleorder.getLineItemValue('item','grossamt' ,i);
		custcol_rotation_website = saleorder.getLineItemValue('item','custcol_rotation_website' ,i);
		if(taxrate1)
			taxrate1 = parseFloat(taxrate1.substring(0, taxrate1.indexOf('%')))/ 100;
		else
		    taxrate1 = 0;
			
		
		
		
		
		//checks if item is not non-inventory duty item
		if(itemid == 5969) {
			duty = 	linetotal;
			//dutytax = itemtax;
			dutytotal = withtaxamount;
			//continue;
		}
		
		
		
		
	
		
		
		
		vintage = '';
		sunit = '';
		dstat = '';
		wname = '';
		itemduty = 0;
		if(itemoptions==null||itemoptions=="" ) {
			itemoptions = "&nbsp;";
		} else {
			extradet =  (itemoptions.substring(itemoptions.indexOf('Extra Item Details') + 19, itemoptions.indexOf('*'))).split("~");
			vintage = extradet[0];
			sunit = extradet[1];
			dstat = extradet[2];
			wname = extradet[3];
			
			//rotation = itemoptions.substring(itemoptions.indexOf('Rotation') + 18,itemoptions.indexOf('Extra Item Details'));
			nlapiLogExecution('DEBUG', 'rotation', custcol_rotation_website);
			nlapiLogExecution('DEBUG', 'isdutyexists', isdutyexists);
			//if(isdutyexists > 0)
			//	itemduty = getDuty(itemid+'~'+custcol_rotation_website+'~'+qty,currency) 
			nlapiLogExecution('DEBUG', 'itemduty', itemduty);
		}
		
		
		//itemtax = ( parseFloat(linetotal) +  parseFloat(itemduty) ) * parseFloat(taxrate1);
		//gross = parseFloat(itemtax) +  parseFloat(linetotal) +  parseFloat(itemduty);
		
		itemtax = parseFloat(linetotal) * parseFloat(taxrate1);
		gross = parseFloat(itemtax) +  parseFloat(linetotal);
		nlapiLogExecution('DEBUG', 'taxrate1', taxrate1);
		nlapiLogExecution('DEBUG', 'itemtax', itemtax);
		nlapiLogExecution('DEBUG', 'gross', gross);
		
		if(description==null)
			description='';
		if(rate==null)
			rate='';
		else
			rate = currencysymbol + rate;
		if(linetotal==null)
			linetotal='';
		else
			linetotal=currencysymbol + linetotal;
		if(itemname==null)
			itemname='';
		if(qty==null)
			qty='';
		if(itemoptions==null)
			itemoptions='';
		
		
		if(itemid == 5969) {
			vintage = "";
			sunit = "";
			dstat = "";
			wname = "Duty";
			dutyrow ='<tr><td align="center"> '+qty+'</td><td align="left"> '+sunit+'</td><td align="left"> '+wname+'</td><td align="center"> '+vintage+'</td><td align="right">'+rate+'</td><td align="right">'+currencysymbol+ '' +itemtax.toFixed(2)+'</td><td align="right" style="padding-right:15px;">'+currencysymbol+ '' +gross.toFixed(2)+'</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';
			continue;
		}
		
			/*myhtml+='<tr><td align="center"> '+qty+'</td><td align="left"> '+sunit+'</td><td align="left"> '+wname+'</td><td align="center"> '+vintage+'</td><td align="right">'+rate+'</td><td align="center" >'+currencysymbol+ '' +itemduty.toFixed(2)+'</td><td align="right">'+currencysymbol+ '' +itemtax.toFixed(2)+'</td><td align="right" style="padding-right:15px;">'+currencysymbol+ '' +gross.toFixed(2)+'</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';*/
			myhtml+='<tr><td align="center"> '+qty+'</td><td align="left"> '+sunit+'</td><td align="left"> '+wname+'</td><td align="center"> '+vintage+'</td><td align="right">'+rate+'</td><td align="right">'+currencysymbol+ '' +itemtax.toFixed(2)+'</td><td align="right" style="padding-right:15px;">'+currencysymbol+ '' +gross.toFixed(2)+'</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';
		
	}
	if(dutyrow) myhtml+=dutyrow;
	subtotal = parseFloat(subtotal) - parseFloat(duty);
	//taxtotal = parseFloat(taxtotal) - parseFloat(dutytax);
	myhtml+='<tr><td align="center" colspan="7" style="border-top:2px solid #cccccc;">&nbsp;</td></tr>';
	myhtml+='<tr><td colspan="6"  align="right">Sub-Total</td><td align="right" style="padding-right:15px;">'+ currencysymbol +subtotal.toFixed(2)+'</td></tr>';
	
	myhtml+='<tr><td align="center" colspan="7" style="">&nbsp;</td></tr><tr><td colspan="6"  align="right">Shipping</td><td align="right" style="padding-right:15px;">'+currencysymbol+shippingtotal+'</td></tr><tr><td align="right" colspan="7" style="">&nbsp;</td></tr>';
	
	if(duty) {
		myhtml+='<tr><td colspan="6"  align="right">Total Duty</td><td align="right" style="padding-right:15px;">'+ currencysymbol + duty+'</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr>';
	}
	
	myhtml += '<tr><td colspan="6"  align="right">Total VAT</td><td align="right" style="padding-right:15px;">'+currencysymbol+taxtotal+'</td></tr><tr><td colspan="5">&nbsp;</td><td align="center" colspan="2" style="border-bottom:2px solid #cccccc;">&nbsp;</td></tr><tr><td align="center" colspan="7" style="">&nbsp;</td></tr><tr style="font-weight:bold;"><td colspan="6"  align="right">Grand Total</td><td align="right" style="padding-right:15px;">'+currencysymbol+total+'</td></tr><tr><td colspan="5">&nbsp;</td><td align="center" colspan="2" style="border-bottom:2px solid #cccccc;">&nbsp;</td></tr></table>';
	myhtml+='<br>Estimated Delivery Date: ' + deliverydate+'<br><br>';
	
	//email footer
	if(shippinginfo)
		myhtml+= '<span style="font-weight:bold; text-decoration:underline">Order Shipping Information:</span><br><br>'+shippinginfo;
	myhtml+='<br><br>If you would like to track the status of your order, please go to <a href="https://checkout.netsuite.com/app/center/nlvisitor.nl?c=1336541&amp;sc=6">https://checkout.netsuite.com/app/center/nlvisitor.nl?c=1336541&amp;sc=6</a> to access your account. Log in using the email address and password you provided during checkout.<br><br>Thank you for your business.<br><br>LHK Fine Wines<br><br></body></html>';
	
	var records = new Object();
	records['transaction'] = saleorderid;
	if(custmail!=null) {
		nlapiSubmitField('customer', customerid, 'custentity_dutyqty', 0);
		nlapiSendEmail(author, custmail,'Your order no. '+orderid+' has been received' , myhtml, cc, null, records);
	}
	try {
		var sorec = nlapiLoadRecord("salesorder",saleorderid);
		salesrep =  sorec.getFieldValue('salesrep'); 
		if(salesrep) {
			sphone = nlapiLookupField('employee', salesrep, 'phone')	
			sorec.setFieldValue('custbody_salesreptelno',sphone); 
		}
		
		if(isdutyexists > 0) {
			//update duty item
			
			var dutyrrt= sorec.getLineItemValue("item","rate",isdutyexists);
			var taxcpde= sorec.getLineItemValue("item","taxcode",isdutyexists);
			
			
			nlapiLogExecution('DEBUG', 'dutyrrt',dutyrrt);	
			nlapiLogExecution('DEBUG', 'taxcpde',taxcpde);	
			sorec.selectLineItem('item',isdutyexists);
			sorec.setCurrentLineItemValue('item','item',28);
			sorec.setCurrentLineItemValue('item','taxcode',taxcpde);
			sorec.setCurrentLineItemValue('item','rate',dutyrrt);
			sorec.setCurrentLineItemValue('item','quantity','1');
			sorec.setCurrentLineItemValue('item','location','');
			sorec.commitLineItem('item')
			
		}
		nlapiSubmitRecord(sorec,true,true);
	}catch(ex) {nlapiLogExecution('ERROR', 'e',ex);}
	return true;
}


// JavaScript Document
function getDuty(params,targetCurrency) {
	items = params.split('*');
	
	var exchangeRate = 1;
	var totalDuty = 0;
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
	
	return totalDuty;
}
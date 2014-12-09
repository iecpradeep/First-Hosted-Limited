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

if(!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(needle) {
		for(var i = 0; i < this.length; i++) {
			if(this[i] === needle) {
				return i;
			}
		}
		return -1;
	};
}
	

function getRotation(params)
{

	var id = params.getParameter('id');
	var ispremiur = params.getParameter('ispremiur');
	var uomfilter = params.getParameter('uom');
	var condmfilter = params.getParameter('cond');
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	var dutystatus = params.getParameter('dutystatus');
	
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
	var html='';
	

	var columns = new Array();

	columns.push(new nlobjSearchColumn('name'));
	columns.push(new nlobjSearchColumn('internalid'));
	columns.push(new nlobjSearchColumn('custrecord_lotimage1'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_item_units_available'));
	columns.push(new nlobjSearchColumn('custrecord_lotdescription'));
	columns.push(new nlobjSearchColumn('custrecord_item_uom'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_polineunits'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_polineunits'));
	columns.push(new nlobjSearchColumn('custitem_item_name','custrecord_lotitem'));
    columns.push(new nlobjSearchColumn('custrecord_rotation_wine_grower'));
	columns.push(new nlobjSearchColumn('custrecord_po_wine_vinatge'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_ordertype'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_expecteddelivery'));
	columns.push(new nlobjSearchColumn('custrecord_inbasket'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_owcstatus'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_location'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_enprimeur'));
	var record = nlapiLoadRecord('inventoryitem', id);
	
	var filters = new Array();			
	filters.push(new nlobjSearchFilter('custrecord_lotitem', null, 'is', id));
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	if(uomfilter) {
		filters.push(new nlobjSearchFilter('custrecord_rotation_polineunits', null, 'is', uomfilter));
		if(condmfilter)
			filters.push(new nlobjSearchFilter('custrecord_rotation_owcstatus', null, 'is', condmfilter));
		else
			filters.push(new nlobjSearchFilter('custrecord_rotation_owcstatus', null, 'noneof', new Array(1, 2, 4)));
	}
	
	if(ispremiur == 'T') {
		filters.push(new nlobjSearchFilter('custrecord_rotation_enprimeur', null, 'is', 'T'));
	}
	
	if(dutystatus) {
		if(dutystatus == "1" || dutystatus == "3") {
			dutystatus = new Array();
			dutystatus.push("1");
			dutystatus.push("3");
			filters.push(new nlobjSearchFilter('custrecord_rotation_ordertype', null, 'anyof', dutystatus));
		} else {
			filters.push(new nlobjSearchFilter('custrecord_rotation_ordertype', null, 'is', dutystatus));	
		}
		
	}

	var search = nlapiSearchRecord('customrecord_rotation',null,filters, columns);
	//html = html + "<div id='gallery'>";
	if(search && record)
	{
			
		//DUE SOON
		var duesoonList = nlapiSearchRecord('transaction', 293) // make search
		var duesoonArr = new Array();
		if(duesoonList) {
			for(var ix = 0; ix < duesoonList.length; ix++) {
				var duesooncolumns = duesoonList[ix].getAllColumns();
				duesoonArr.push(duesoonList[ix].getValue(duesooncolumns[0]));
			}
		}
		
		rn = search.length;
		
		if(ispremiur == 'T') {
			rn = 1;
		}
		
		var filter = new Array();
		filter.push(new nlobjSearchFilter('internalid', null, 'is', id));
		
	   	var sumresults = nlapiSearchRecord('item', 61, filter);
	   	sumqty = 0;
		
		if(sumresults) {
			var col = sumresults[0].getAllColumns();
			sumqty = sumresults[0].getValue(col[8]);
		}
		for ( var i = 0, k = 0; i < rn; i++ )
		{
			var searchresult = search[i];

			var id = searchresult.getValue('internalid');
			var img = (searchresult.getValue('custrecord_lotimage1') != '')?searchresult.getValue('custrecord_lotimage1'):'';
			var qty = searchresult.getValue('custrecord_rotation_item_units_available');
			var desc = searchresult.getValue('custrecord_lotdescription');
			var name = searchresult.getValue('name');
			var uom = searchresult.getText('custrecord_rotation_polineunits');
			var winename = searchresult.getText('custitem_item_name','custrecord_lotitem');
			var grower = searchresult.getText('custrecord_rotation_wine_grower');
			var vintage = searchresult.getText('custrecord_po_wine_vinatge');
			var ordertype = searchresult.getText('custrecord_rotation_ordertype');
			var eta = (searchresult.getValue('custrecord_rotation_expecteddelivery')==null?'':  searchresult.getValue('custrecord_rotation_expecteddelivery'));
			var inbasket = searchresult.getValue('custrecord_inbasket');
			var condition =  searchresult.getText('custrecord_rotation_owcstatus');
			var loc =  searchresult.getValue('custrecord_rotation_location');
			var enpremeiur =  searchresult.getValue('custrecord_rotation_enprimeur');

			if(ispremiur == 'T') {
				qty = sumqty;
			}
			
			if(qty <= 0) {
			/*	if(eta == '')
					continue;
				else 
					qty='';*/
				continue;
			}
			
			if(inbasket && qty && parseInt(qty) <=  parseInt(inbasket)) continue;
			
			if(inbasket && qty)
				qty = parseInt(qty) - parseInt(inbasket);
			
			var isnotdelivered = false;
			if(eta) {
				eta = nlapiStringToDate(eta);	
				today = new Date();
				if(eta > today) isnotdelivered = true;
				//eta = eta.format('d/m/y');
				eta = nlapiDateToString(eta);
			}
			
			if(grower) 
				winename += ', ' + grower; 
				
			if(!vintage)
			 	vintage = record.getFieldText('custitem_item_vintage');
				
			if(!uom)
			 	uom = record.getFieldText('saleunit');
			
			if(!winename)
			 	winename = record.getFieldText('custitem_item_name') + (record.getFieldText('custitem_item_grower')==''?'': ', ' + record.getFieldText('custitem_item_grower'));
				
			if(!ordertype) {
				ordertype = record.getFieldText("custitem_dutystatus");
				
				
				
			} 
			if(ordertype == 'Duty Paid (Private)')
					ordertype = 'Duty Paid';	
				
			//var colour = searchresult.getText('custrecord_item_uom');

			//html=html+"<span> Rotation:" + name + " img:<a id='image' href='" + img + "' class='image' ><img src='"+img+"' height='50' width='50' /> </a> Qty:"+qty+"  Desc:"+desc+"  UOM:"+uom
			//html=html+"    <a href='javascript:addToCart(\""+id+"\")'>Buy</a> | ";
			//html=html+"    <a id='testA' href='javascript:oneClick(\""+id+"\")'>OneClick Ordering</a></span><br>";
			
			
			
			var multiple = 1;
			if(uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
			
			}
			price = record.getLineItemMatrixValue('price1', 'price', '1','1');
			if(exchangeRate != 0)
			{
				price = price * exchangeRate;
			}			
			
			newprice = price * multiple;
			
			extradetails = vintage + '~' + uom + '~' + ordertype + '~' + winename +'*';
			extradetails = extradetails.replace(/\'/g, "@POSTRO");
			
			//price quantity feature
			var quantityLevels = record.getMatrixCount('price1', 'price');
			var pq = "";			
			if ( quantityLevels > 1 ){
		
				for ( var j=1; j<=quantityLevels; j++) {
					
					
					if(record.getMatrixValue( 'price1', 'price', j) && record.getMatrixValue( 'price1', 'price', j) !=0) {
					
					
						qtylvl = record.getMatrixValue( 'price1', 'price', j);
						qtylvlprice = record.getLineItemMatrixValue( 'price1', 'price', '1', j);
						
						casel = qtylvl / multiple;
						caseprice = qtylvlprice * multiple;
						if( newprice != caseprice) {
							if(pq) {
								pq += ', ';
							}
							//&#36; USD
							//&pound; GBP
							//&euro; EUR
							//sFr. CHF
							//HK$ HKD
							
							pq += casel + '+ cases ' + moneySymbol + caseprice.toFixed(2) + ' each';
							
						}
						/*if(uom.indexOf(/Cases/i) != -1) {
							pq += 'cases '
						} else {
							pq += 'bottles '	
						}*/
					}
				}
		 
		
			}

			orgPrice=record.getLineItemMatrixValue('price1', 'price', '1','1')*1

			if(pq) pq = "<div class='special-offer-container'><span class='offimg'></span><span class='offtext'>" + pq + "</span></div>";
			else pq = "<div class='special-offer-container'></div>";
			showbuttons = '';
			if(qty == '') {
				showbuttons += 'style="display:none;"';
				pq = '';
			}
			rowcolor =  (k%2==1)?'zebra':'';
			
			var price =  moneySymbol + formatCurrency(Math.round(newprice.toFixed(2)))+'.00';
			var avl = "";
			if(qty >0 && !isnotdelivered) {
				avl = 'In Stock';
			} else {
				avl = eta;	
			}
			
			if(avl == 'In Stock' && duesoonArr.length) {
				if(duesoonArr.indexOf(id) > -1){
					avl = "Due Soon"	
				}
			}
			
			if(enpremeiur == 'T' || loc == '4') {
				avl="EP";
			}
			
			html += '<tr><td class="data_product-rotations '+ rowcolor +'"><div class="data_container"><span class="colour_entry" style="display:none;">'+record.getFieldText("custitem_colour")+'</span><span class="vintage_entry" style="display:none;">'+vintage+'</span><span class="wine-name_entry" style="display:none;">'+winename+'</span><span class="price_entry">' +price+'</span><span id="orig-price-'+id+'" style="display:none;" >'+Math.round(orgPrice.toFixed(2))+'</span><span style="display:none;" id="price_entry-'+id+'">'+ price+'</span><span class="format_entry">'+uom+'</span><span class="duty-status_entry">'+ordertype+'</span><span class="availavility_entry">'+avl+'</span><span class="quantity_entry" id="quantity_entry_'+id+'">'+qty+'</span><span class="condition_entry">'+condition+'</span>'+(img != '' ? '<span class="img-product_entrytitle"><a class="imgtozoom" href="' + img + '" rel="lightbox" id="img-'+i+'" title="'+winename+'"><img src="'+img+'" class="img-product_entry" /></a></span>':'<span class="img-product_entry no-img">&nbsp;</span>')+'<span class="score_entry" style="display:none;">'+record.getFieldText("custitem_scoreshown")+'</span><span  class="buttons_entry" '+showbuttons+'><div ><span class="rotation-qty-entry"> Qty <input size="2" type="text" value="" id="qty-'+id+'" class="inputText " name="rotationqty"></span><a href="javascript:addToCart(\''+id+'\',\''+extradetails+'\')" class="add-to-basket_button" >Add to Basket</a></div></span></div>'+pq+'<div class="oneclicklink" '+showbuttons+'><a class="one-click-text" href="javascript:oneClick(\''+id+'\',\''+extradetails+'\')">Sign in to enable 1-click ordering</a></div></td></tr>';
		   k++;
		}
	}
	if(html) {
		html = '<table border="0" cellspacing="0" cellpadding="0" class="product-rotations-container"><tr><td><table cellpadding="0" cellspacing="0" class="product-rotations"><tr class="product-rotations-title"><td style="height:30px !important"><span class="colour_entry" style="display:none;">Colour</span><span class="vintage_entry" style="display:none;">Vintage</span><span class="wine-name_entry" style="display:none;">Wine Name</span><span class="price_entry">Price</span><span class="format_entry">Format</span><span class="duty-status_entry">Duty Status</span><span class="availavility_entry">Availability</span><span class="quantity_entry">Stock</span><span class="condition_entry">Condition</span><span class="img-product_entrytitle">Image</span><span class="score_entry" style="height:0px !important;display:none;">Score</span><span class="buttons_entry">&nbsp;</span></tr></table></td></tr>'+ html + "</table>";
	}
	response.write(html);	
}



Date.prototype.format=function(format){var returnStr='';var replace=Date.replaceChars;for(var i=0;i<format.length;i++){var curChar=format.charAt(i);if(i-1>=0&&format.charAt(i-1)=="\\"){returnStr+=curChar;}else if(replace[curChar]){returnStr+=replace[curChar].call(this);}else if(curChar!="\\"){returnStr+=curChar;}}return returnStr;};Date.replaceChars={shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths:['January','February','March','April','May','June','July','August','September','October','November','December'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],longDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d:function(){return(this.getDate()<10?'0':'')+this.getDate();},D:function(){return Date.replaceChars.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.replaceChars.longDays[this.getDay()];},N:function(){return this.getDay()+1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this-d)/86400000);},W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this-d)/86400000)+d.getDay()+1)/7);},F:function(){return Date.replaceChars.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+1);},M:function(){return Date.replaceChars.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+1;},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0));},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+6)%7)+3);return d.getFullYear();},Y:function(){return this.getFullYear();},y:function(){return(''+this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return Math.floor((((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1000/24);},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+this.getSeconds();},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+m;},e:function(){return"Not Yet Supported";},I:function(){return"Not Yet Supported";},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00';},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d\\TH:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};

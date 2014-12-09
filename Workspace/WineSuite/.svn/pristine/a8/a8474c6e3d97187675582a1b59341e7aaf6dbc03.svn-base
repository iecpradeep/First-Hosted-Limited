// JavaScript Document

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
return (((sign)?'':'-') + num + '.' + cents);
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
	


function getSpecialCategories(){
	var ret = "";
	var filters = new Array();
	//filters.push(new nlobjSearchFilter('internalid', null, 'is', '-115'));
	
	var columns = new Array();
	columns.push(new nlobjSearchColumn('name'));
	columns.push(new nlobjSearchColumn('internalid'));
	
	
	var catList = nlapiSearchRecord('sitecategory', null, filters,columns) // make search
	if(catList) {
		for( i = 0; i < catList.length; i++) {
			ret += "<li><a href='http://shopping.netsuite.com/s.nl/c.1336541/sc.15/category."+catList[i].getValue('internalid')+"/.f'>"+catList[i].getValue('name')+"</a></li>";
		//	rec = nlapiLoadRecord(catList[i].getRecordType(),catList[i].getId());
		}
	}
	
	response.write(ret);
		
}

function getItemFilter(arrValues, arrfilters) {
	var filters = new Array();
	for(i=0;i<arrValues.length-1;i++){//recorre los filtros y los valores y crea un filtro por cada uno que encuentra
		if(arrfilters[i] == 'price1')
		{
			filters.push(new nlobjSearchFilter('price', null, 'lessthan', '30'));
		}
		else
		{
			if(arrfilters[i] == 'price2')
			{
				filters.push(new nlobjSearchFilter('price', null, 'between', '30', '100'));
			}
			else
			{
				if(arrfilters[i] == 'price3')
				{
					filters.push(new nlobjSearchFilter('price', null, 'between', '100', '200'));
				}
				else
				{
					if(arrfilters[i] == 'price4')
					{
						filters.push(new nlobjSearchFilter('price', null, 'greaterthan', '200'));
					}
					else
					{
						if(arrfilters[i] == 'price')
						{
							var priceValues = new Array();
							priceValues = arrValues[i].split('-');
							filters.push(new nlobjSearchFilter('price', null, 'between',priceValues[0], priceValues[1]));
						}
						else
						{
							if(arrfilters[i] == 'searchkeywords')
							{								
								filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',arrValues[i]));
							}
							else
							{
								if(arrfilters[i] == 'inPrimeur')
								{
									filters.push(new nlobjSearchFilter('custitem_inprimeur', null, 'is','F'));
								}
								else
								{
									if(arrfilters[i] == 'custitem_vintage_search')
									{
										var vintageValues = new Array();
										vintageValues = arrValues[i].split('-');										
										if(vintageValues.length > 1)
										{											
											filters.push(new nlobjSearchFilter(arrfilters[i], null, 'between', vintageValues[0], vintageValues[1]));
										}
										else
										{											
											filters.push(new nlobjSearchFilter(arrfilters[i], null, 'equalto', arrValues[i]));
										}
									}
									else
									{									
										if(arrfilters[i] == 'keywords')
										{
											filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains', arrValues[i]));
										}
										else
										{
											if( (arrfilters[i] == 'saleunit' || arrfilters[i] == 'custitem_country') && arrValues[i] && arrValues[i].indexOf(",") != -1) {
												sizeValues = arrValues[i].split(',');	
												filters.push(new nlobjSearchFilter(arrfilters[i], null, 'anyof', sizeValues ));
											} else {
											    if(arrfilters[i] == 'custitem_item_classification' && arrValues[i]==9999)
											    {		
													var arrAux = new Array();
													arrAux[0]=2;
													arrAux[1]=4;
													arrAux[2]=9;


													filters.push(new nlobjSearchFilter(arrfilters[i], null, 'noneof',  arrAux));

												}else{
												if(arrfilters[i] == 'custitem_btlsize' && arrValues[i].indexOf(",")!=-1)
											    	{
														var arrAux =  arrValues[i].split(",")
														filters.push(new nlobjSearchFilter(arrfilters[i], null, 'anyof',  arrAux));	
												
												}else{	
												
if(arrfilters[i] == 'custrecord_rotation_polineunits' || arrfilters[i] == 'custrecord_item_uom')
{
	sizeValues = arrValues[i].split(',');	
	filters.push(new nlobjSearchFilter(arrfilters[i], 'custrecord_lotitem', 'anyof', sizeValues ));	
}else{
	filters.push(new nlobjSearchFilter(arrfilters[i], null, 'is', arrValues[i] ));
}

}

												}
											}
										}										
									}									
								}								
							}									
						}						
					}
				}
			}
		}		
	}	
	
	return filters;
}
function getFeaturedItems(params) {
	var types = params.getParameter('types');	
	var itemids = params.getParameter('itemids');
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	
	
	var ret = "";
	try {
		var itemids = itemids.split("*");
		var types = types.split("*");
		var lineNum = itemids.length;
	
		var filters=request.getParameter('filters');//obtiene los nombres de los filtros
		var values=request.getParameter('values');//obtiene los valores de los filtros
		
		
		var columns = new Array();
		columns.push(new nlobjSearchColumn('type'));
		var itemfilters = new Array();
		
		if(filters) {
			var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
			var arrValues=values.split("*");//separa el string con el valor de los filtros con *
			itemfilters = getItemFilter(arrValues,arrfilters);
		}
		itemfilters.push(new nlobjSearchFilter('internalid', null, 'anyof', itemids ));
		var itemsList = nlapiSearchRecord('item', null, itemfilters,columns) // make search
		
		
		
		if(itemsList) {
			for( i = 0; i < itemsList.length; i++) {
						nlapiLogExecution("DEBUG", 'itemid', itemsList[i].getId());
						if(itemsList[i].getValue('type') == "InvtPart") {
							ret += _getFeaturedItem(itemsList[i].getId(), targetCurrency, moneySymbol);
						} else if(itemsList[i].getValue('type') == "Kit"){
						//	ret += getKitMembers_ItemsView(itemsList[i].getId(), targetCurrency, moneySymbol);
							ret += getKitMembers(itemsList[i].getId(), targetCurrency, moneySymbol);
						}
			}
		}
		
	} catch(e) {
		nlapiLogExecution("DEBUG", 'ERROR', e);
	}
	
	response.write(ret);
}

function _getFeaturedItem(itemid, targetCurrency, moneySymbol) {
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
	if(targetCurrency && targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	var record = nlapiLoadRecord('inventoryitem', itemid);
	var html = "";
		var content = "";
	
		var img = "";
				
		if(record.getFieldValue('storedisplaythumbnail')) {
			 var f = nlapiLoadFile(record.getFieldValue('storedisplaythumbnail')); 	
			 img = f.getURL();
		}
		var storedetaileddescription = record.getFieldValue('storedetaileddescription');
		if(!storedetaileddescription) storedetaileddescription =  record.getFieldValue('storedescription');
		if(!storedetaileddescription) storedetaileddescription = "";
		
		var itemurl =record.getFieldValue('itemurl');
		var winename = record.getFieldValue('displayname');
		price = record.getLineItemMatrixValue('price1', 'price', '1','1');
		var uom = record.getFieldText('custitem_btlsize');
		
			var multiple = 1;			
			
			if(uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
			
			}
			//price = itemsList[i].getValue(columns[3]);
			if(exchangeRate != 0)
			{
				price =  parseFloat(price) * exchangeRate;
			}	
			newprice = parseFloat(price)*parseFloat(multiple);
			if(multiple > 1) {			
				pricehtml= moneySymbol + formatCurrency(Math.round(newprice))+' per case of '+multiple;		
			} else {
				pricehtml = moneySymbol + formatCurrency(Math.round(newprice))+' per '+uom.split(" ")[0];
			}
		html = '<div class="list-spoffer-items" style=""><div class="so-square" ><div id="imgContainer" class="img-so" style="float: left;width: 100px;height: 97px;margin-bottom: 10px;padding: 0 20px;"><img class="img_product" src="'+img+'" width="100px" /></div>';
		html += '<div class="so-details" style="">';
		html += '<div class="so-title" style="text-align:center"><p><a href="http://shopping.netsuite.com/s.nl/c.1336541/it.A/id.'+itemid+'/.f" style="" onclick="createCookie(\''+itemid+'-s-breadcrumb\',\'\')">'+winename+'</a></p></div>';
		html += '<div class="so-info"  style="">'+storedetaileddescription;
		
		html += '</div></div>';
		html += '<div style="float:right;"><div class="sp_price price" style="padding-right: 10px; float: left; width: auto;">'+ pricehtml+'</div><div class="sp_viewbtn"><a  href="http://shopping.netsuite.com/s.nl/c.1336541/it.A/id.'+itemid+'/.f" class="call-to-action_button_search" onclick="createCookie(\''+itemid+'-s-breadcrumb\',\'\')">VIEW</a></div></div>';
	
		
		html += '</div></div>';
	
	
	return html;
	
}

function getKitMembers_ItemsView(itemid, targetCurrency, moneySymbol) {
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
	if(targetCurrency && targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	var record = nlapiLoadRecord('kititem', itemid);
	var lineNum = record.getLineItemCount('member');
	var html = "";
		var content = "";
	if(lineNum > 0) {
		var img = "";
				
		if(record.getFieldValue('storedisplayimage')) {
			 var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
			 img = f.getURL();
		}
		var storedetaileddescription = record.getFieldValue('storedetaileddescription');
		if(!storedetaileddescription) storedetaileddescription =  record.getFieldValue('storedescription');
		if(!storedetaileddescription) storedetaileddescription = "";
		var winename = record.getFieldValue('displayname');
		html = '<div class="product_container" ><span id="sp_itemid" style="display:none">'+itemid+'</span><div class="product_info_container">';
		html += '<div id="imgContainer">'+(img != '' ? '<img src="'+img+'" class="img_product" alt="Image Product"  id="img_to_resize"  style="display:none"/>':'')+'</div>';
		html += '<div class="sp_product_info_text"><div class="sp_title-product">'+winename+'</div><div class="sp_desc-product">'+storedetaileddescription+'</div></div>';
		html += '</div>';
		html += '<div class="description_modules" style="clear:both" id="mymembers"><table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
		html += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width"></th></tr></thead><tbody>';
		var k = 0;
		for( j = 1; j <= lineNum; j++) {
			var memid = record.getLineItemValue('member', 'item', j);
			content = "";
			var filters = new Array();			
			filters.push(new nlobjSearchFilter('internalid', null, 'is', memid));
			var itemsList = nlapiSearchRecord('item', 38, filters, null);
			if(itemsList) {
				
				for(var i=0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();
					rowcolor =  (k%2==1)?'zebra':'data_product-rotations';
					k++;
					staffreco = 'display:none';
					
					inew = 'display:none';
					
					content += "<tr id='" + i + "' class='list-items-row "+rowcolor+"'>";
					content += "<td align='left' style='text-align:left' class='icon-cont'  ><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px' style='display:none'></span><span class='inew' width='8px' height='10px' style='"+inew+"'></span><span class='staffreco' width='11px' height='10px' style='"+staffreco+"'></span></td>";
					
					bottlesize = '';
					qty = itemsList[i].getValue(columns[8]);
					if(itemsList[i].getValue(columns[8]) > 0) {
						var avl = 'In Stock';	
					} else {
						var avl = 'Out of Stock';	
					}
					
					if(itemsList[i].getValue(columns[31])) {
						delivery =   nlapiStringToDate(itemsList[i].getValue(columns[31]));
						today = new Date();
						if(delivery > today) {
							
							avl = itemsList[i].getValue(columns[31]);
							qty = '';
						}
					}
					img = itemsList[i].getValue(columns[30]);
				if(!img)
					img = '/core/media/media.nl?id=2398&c=1336541&h=3f8fd85eb9a0688dde6a';
				//try
				//{
					//var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));
					//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('storedisplayimage'));
					//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('imageurl'));
					//if(record.getFieldValue('storedisplayimage')) {
						 //var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
						 //img = f.getURL();
					//}
	
					var itemPrice =  itemsList[i].getValue(columns[4])//record.getLineItemMatrixValue('price1', 'price', 1, 1);
					//nlapiLogExecution('ERROR', 'itemPrice', itemPrice);
					if(exchangeRate != 0)
					{
						itemPrice = itemPrice * exchangeRate;
					}
					var multiple = 1;
					var uom = itemsList[i].getText(columns[22]);
					
					if(uom && !uom.match("Case")){
						x=uom.split(" ");
						bottlesize=x[1]+" cl";	
						caseSize="";			
					}
	
					if(uom && uom.indexOf(' x ') != -1) {
						
						x = uom.match(/[\d\.]+/g);
						multiple = x[0];
						bottlesize=x[1]+" cl";	
						caseSize=itemsList[i].getText(columns[22])
											
					}
	
					newprice = itemPrice * multiple;
					
					
					//nlapiLogExecution('ERROR', 'newprice', newprice);
					//price quantity feature
					var quantityLevels = itemsList[i].getValue(columns[24])//record.getMatrixCount('price1', 'price');
					var pq = "";
	
					if ( quantityLevels != "1+" && quantityLevels != "" && quantityLevels.indexOf("+")!=-1 )
					{
				
						qtylvlprice=itemsList[i].getValue(columns[25]);
						//for ( var j=1; j<=quantityLevels; j++) {
						//	if(record.getMatrixValue( 'price1', 'price', j) && record.getMatrixValue( 'price1', 'price', j) !=0) {
						//		qtylvl = record.getMatrixValue( 'price1', 'price', j);
						//		qtylvlprice = record.getLineItemMatrixValue( 'price1', 'price', '1', j);
						//		
								
						//		
								qtylvl=parseFloat(quantityLevels.replace(/\+/g,""));
								casel = qtylvl / multiple;
								caseprice = qtylvlprice * multiple;
								if( newprice != caseprice) {
									if(pq) {
										pq += ', ';
									}
									//casel
									if(caseSize!="")
										pq +=  casel +'+ cases ' + moneySymbol + caseprice.toFixed(2) + ' each';
									if(caseSize=="")
										pq +=  casel +'+ bottles ' + moneySymbol + caseprice.toFixed(2) + ' each';
	
								}	
															
							//}
						//}
				 
				
					}	
					
					var dtyStatus = itemsList[i].getText(columns[16]);
					if(dtyStatus && dtyStatus.toUpperCase() != 'IN BOND' && dtyStatus.toUpperCase() != 'DUTY PAID')
					{
						dtyStatus = ' ';
					}
					var condition = itemsList[i].getText(columns[23]);
					if(condition == "- None -")
					{
						condition = " ";
					}
					getvars = "";
					if(dtyStatus != ' ') {
						getvars = "&dutystatus="+ itemsList[i].getValue(columns[16]);
					}
					content += '<td>'+ (itemsList[i].getValue(columns[15])==''?'': ' ' + itemsList[i].getText(columns[15])) +'</td><td>'+(itemsList[i].getValue(columns[28])==0?'NV':itemsList[i].getText(columns[5]))+'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ' ' + itemsList[i].getText(columns[14])) +'</td><td>' + moneySymbol +formatCurrency(Math.round(newprice.toFixed(2)))+'</td><td>'+itemsList[i].getText(columns[22])+'</td><td>'+ dtyStatus +'</td><td>'+avl+'</td><td>'+qty+'</td><td>' + condition + '</td><td>'+(itemsList[i].getValue(columns[17])=="- None -"?'':itemsList[i].getValue(columns[17]))+'</td><td  class="buy-now-cont"><a id="buybtn_'+ itemsList[i].getValue(columns[0])+'" href="'+itemsList[i].getValue(columns[18])+'?uom='+itemsList[i].getValue(columns[22])+'&cond='+itemsList[i].getValue(columns[23])+getvars+'" class="call-to-action_button_search" >VIEW</a></td>';
				//}
				//catch(e)
				//{}
				content += "</tr>";
				}
				
			}
			
			html += content;
		}
		html += "</tbody>";
		html += '</table></div></div>';
	}
	
	return html;
}

function getKitMembers(itemid, targetCurrency, moneySymbol) {
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
	if(targetCurrency && targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	var record = nlapiLoadRecord('kititem', itemid);
	var lineNum = record.getLineItemCount('member');
	var html = "";
		var content = "";
	if(lineNum > 0) {
		var img = "";
				
		if(record.getFieldValue('storedisplaythumbnail')) {
			 var f = nlapiLoadFile(record.getFieldValue('storedisplaythumbnail')); 	
			 img = f.getURL();
		}
		var storedetaileddescription = record.getFieldValue('storedetaileddescription');
		if(!storedetaileddescription) storedetaileddescription =  record.getFieldValue('storedescription');
		if(!storedetaileddescription) storedetaileddescription = "";
		
		var itemurl =record.getFieldValue('itemurl');
		var winename = record.getFieldValue('displayname');
		
		price = record.getLineItemMatrixValue('price1', 'price', '2','1');
		if(!price) price = 0;
		if(exchangeRate != 0)
		{
			price = price * exchangeRate;
		}	
			
		html = '<div class="list-spoffer-items" style=""><div class="so-square" style=""><div id="imgContainer" class="img-so" style="float: left;width: 100px;height: 97px;margin-bottom: 10px;padding: 0 20px;"><img class="img_product" src="'+img+'" width="100px" /></div>';
		html += '<div class="so-details" style="">';
		html += '<div class="so-title" style="text-align:center"><p><a href="http://shopping.netsuite.com/s.nl/c.1336541/it.A/id.'+itemid+'/.f" style="" onclick="createCookie(\''+itemid+'-s-breadcrumb\',\'\')">'+winename+'</a></p></div>';
		html += '<div class="so-info"  style="">'+storedetaileddescription;
		html += '<div style="clear:both; padding-top: 15px; padding-bottom: 15px;" id="mymembers"><div class="kit-table-tit">This Case Contains:</div><div class="myTabletit"><div class="myTabletit1">Qty</div><div class="myTabletit2">Unit</div><div class="myTabletit3">Description</div></div><table width="500" cellpadding="0" cellspacing="0" class="" id="myTable" style="border-top: 1px solid #666; ">';
		
		
		for( j = 1; j <= lineNum; j++) {
			
			var memid = record.getLineItemValue('member', 'item', j);
			var memdesc = record.getLineItemValue('member', 'memberdescr', j);
			var memqty = record.getLineItemValue('member', 'quantity', j);
			var memunit = record.getLineItemValue('member', 'memberunit', j);
			content = "";
			content += "<tr>";
			content += "<td class='myTableqty' style='padding:1px'>"+memqty+"</td><td class='myTableunit' style='padding:1px'>"+memunit+"</td><td class='myTabledsc' style='padding:1px'>"+memdesc+"</td>";
			content += "</tr>"
			
			
			html += content;
		}
		html += "</tbody>";
		html += "</table>";
		html += '</div></div></div>';
		html += '<div style="float:right;"><div class="sp_price price" style="padding-right: 10px; float: left; width: auto;">'+ moneySymbol + price.toFixed(2)+' per Case</div><div class="sp_viewbtn" style=""><a  href="http://shopping.netsuite.com/s.nl/c.1336541/it.A/id.'+itemid+'/.f" class="call-to-action_button_search" onclick="createCookie(\''+itemid+'-s-breadcrumb\',\'\')">VIEW</a></div></div>';
	
		
		html += '</div></div>';
	}
	
	return html;
}

function getSpecialOffers(params) {
	var types = params.getParameter('types');	
	var itemids = params.getParameter('itemids');
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	
	
	var ret = "";
	try {
		var itemids = itemids.split("*");
		var types = types.split("*");
		var lineNum = itemids.length;
	
		var filters=request.getParameter('filters');//obtiene los nombres de los filtros
		var values=request.getParameter('values');//obtiene los valores de los filtros
		
		
		var columns = new Array();
		columns.push(new nlobjSearchColumn('type'));
		var itemfilters = new Array();
		
		if(filters) {
			var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
			var arrValues=values.split("*");//separa el string con el valor de los filtros con *
			itemfilters = getItemFilter(arrValues,arrfilters);
		}
		itemfilters.push(new nlobjSearchFilter('internalid', null, 'anyof', itemids ));
		var itemsList = nlapiSearchRecord('item', null, itemfilters,columns) // make search
		
		
		
		if(itemsList) {
			for( i = 0; i < itemsList.length; i++) {
						nlapiLogExecution("DEBUG", 'itemid', itemsList[i].getId());
						if(itemsList[i].getValue('type') == "InvtPart") {
							ret += getRotation(itemsList[i].getId(), targetCurrency, moneySymbol);
						} else if(itemsList[i].getValue('type') == "Kit"){
							//ret += getKitMembers_ItemsView(itemsList[i].getId(), targetCurrency, moneySymbol);
							ret += getKitMembers(itemsList[i].getId(), targetCurrency, moneySymbol);
						}
			}
		}
		
	} catch(e) {
		nlapiLogExecution("DEBUG", 'ERROR', e);
	}
	
	response.write(ret);
}


function getRotation(itemid, targetCurrency, moneySymbol)
{

	
	nlapiLogExecution("DEBUG", 'getRotation', 'getrotation'+itemid);
	nlapiLogExecution("DEBUG", 'getRotation', 'targetCurrency'+targetCurrency);
	nlapiLogExecution("DEBUG", 'getRotation', 'moneySymbol'+moneySymbol);
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
	if(targetCurrency && targetCurrency != "")
	{
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	nlapiLogExecution("DEBUG", 'getRotation', 'here'+targetCurrency);
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
	columns.push(new nlobjSearchColumn('custrecord_rotation_wine_name'));
    	columns.push(new nlobjSearchColumn('custrecord_rotation_wine_grower'));
	columns.push(new nlobjSearchColumn('custrecord_po_wine_vinatge'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_ordertype'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_expecteddelivery'));
	columns.push(new nlobjSearchColumn('custrecord_inbasket'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_owcstatus'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_location'));
	columns.push(new nlobjSearchColumn('custrecord_rotation_enprimeur'));
	var record = nlapiLoadRecord('inventoryitem', itemid);
	
	var filters = new Array();			
	filters.push(new nlobjSearchFilter('custrecord_lotitem', null, 'is', itemid));
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
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
		
		
		
		var filter = new Array();
		filter.push(new nlobjSearchFilter('internalid', null, 'is', itemid));
		
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
			var desc = record.getFieldValue('storedetaileddescription');
			var name = searchresult.getValue('name');
			var uom = searchresult.getText('custrecord_rotation_polineunits');
			var winename = searchresult.getText('custrecord_rotation_wine_name');
			var grower = searchresult.getText('custrecord_rotation_wine_grower');
			var vintage = searchresult.getText('custrecord_po_wine_vinatge');
			var ordertype = searchresult.getText('custrecord_rotation_ordertype');
			var eta = (searchresult.getValue('custrecord_rotation_expecteddelivery')==null?'':  searchresult.getValue('custrecord_rotation_expecteddelivery'));
			var inbasket = searchresult.getValue('custrecord_inbasket');
			var condition =  searchresult.getText('custrecord_rotation_owcstatus');
			var loc =  searchresult.getValue('custrecord_rotation_location');
			var enpremeiur =  searchresult.getValue('custrecord_rotation_enprimeur');

			
			
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
			/*
			if(eta) {
				eta = nlapiStringToDate(eta);	
				eta = eta.format('d.m.y');
			}
			*/
			if(grower) 
				winename += ', ' + grower; 
				
			if(!vintage)
			 	vintage = record.getFieldText('custitem_item_vintage');
				
			if(!uom)
			 	uom = record.getFieldText('saleunit');
			
			if(!winename)
			 	winename = record.getFieldText('custitem_item_name') + (record.getFieldText('custitem_item_grower')==''?'': ', ' + record.getFieldText('custitem_item_grower'));
				
			if(!ordertype)
				ordertype = record.getFieldText("custitem_dutystatus");
			
			
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
			
			
			/*if(!desc) desc = "";
			html += '<tr >';
			html += '<td class="data_product-rotations '+ rowcolor +'">'+(img != '' ? '<span class="img-product_entrytitle"><a href="' + img + '" rel="lightbox" id="img-'+i+'"><img src="'+img+'" class="img-product_entry" /></a></span>':'<span class="img-product_entry no-img">&nbsp;</span>')+'</td>'
			html += '<td class="data_product-rotations '+ rowcolor +'">'+winename+'<br>'+desc+'</td>'
			html += '<td class="data_product-rotations '+ rowcolor +'"><div ><span class="rotation-qty-entry"> Qty <input size="2" type="text" value="" id="qty-'+id+'" class="inputText " name="rotationqty"></span><a href="javascript:addToCart(\''+id+'\',\''+extradetails+'\',\''+itemid+'\')"  class="add-to-basket_button" >Add to Basket</a></div></span></div>'+pq+'<div class="oneclicklink" '+showbuttons+'><a class="one-click-text" href="javascript:oneClick(\''+id+'\',\''+extradetails+'\',\''+itemid+'\')">Sign in to enable 1-click ordering</a></div></td>'
			html += '</tr>';*/
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
			html += '<tr><td class="data_product-rotations '+ rowcolor +'"><div class="data_container"><span class="colour_entry" style="display:none;">'+record.getFieldText("custitem_colour")+'</span><span class="vintage_entry" style="display:none;">'+vintage+'</span><span class="wine-name_entry"  style="display:none;">'+winename+'</span><span class="price_entry">' + moneySymbol + formatCurrency(Math.round(newprice.toFixed(2)))+'</span><span id="orig-price-'+id+'" style="display:none;" >'+Math.round(orgPrice.toFixed(2))+'</span><span style="display:none;" id="price_entry-'+id+'">'+ Math.round(newprice.toFixed(2))+'</span><span class="format_entry">'+uom+'</span><span class="duty-status_entry">'+ordertype+'</span><span class="availavility_entry">'+ avl+'</span><span class="quantity_entry" id="quantity_entry_'+id+'">'+qty+'</span><span class="condition_entry">'+condition+'</span><span class="img-product_entry no-img">&nbsp;</span><span class="score_entry" style="display:none;">'+record.getFieldText("custitem_scoreshown")+'</span><span  class="buttons_entry" '+showbuttons+'><div ><span class="rotation-qty-entry"> Qty <input size="2" type="text" value="" id="qty-'+id+'" class="inputText " name="rotationqty"></span><a href="javascript:addToCart(\''+id+'\',\''+extradetails+'\',\''+itemid+'\')" class="add-to-basket_button" >Add to Basket</a></div></span></div>'+pq+'<div class="oneclicklink" '+showbuttons+'><a class="one-click-text" href="javascript:oneClick(\''+id+'\',\''+extradetails+'\',\''+itemid+'\')">Sign in to enable 1-click ordering</a></div></td></tr>';
		   k++;
		}
	}
	if(html) {
			var storedetaileddescription = record.getFieldValue('storedetaileddescription');
			if(!storedetaileddescription) storedetaileddescription = "";
			var img = "";
						
			if(record.getFieldValue('storedisplaythumbnail')) {
				 var f = nlapiLoadFile(record.getFieldValue('storedisplaythumbnail')); 	
				 img = f.getURL();
			}
				winename = record.getFieldValue('displayname');
				container = '<div class="product_container" ><span id="sp_itemid" style="display:none">'+itemid+'</span><div class="product_info_container">';
				container += '<div id="imgContainer">'+(img != '' ? '<img src="'+img+'" class="img_product" alt="Image Product"  id="img_to_resize"  style="display:none"/>':'')+'</div>';
				container += '<div class="sp_product_info_text"><div class="sp_title-product">'+winename+'</div><div class="sp_desc-product">'+storedetaileddescription+'</div></div>';
				container += '</div>';
				container += '<div class="description_modules" style="clear:both" id="myrortation">';
				html = container + '<table border="0" cellspacing="0" cellpadding="0" class="product-rotations-container"><tr><td><table cellpadding="0" cellspacing="0" class="product-rotations"><tr class="product-rotations-title"><td style="height:30px !important"><span class="colour_entry" style="display:none;">Colour</span><span class="vintage_entry" style="display:none;">Vintage</span><span class="wine-name_entry" style="display:none;">>Wine Name</span><span class="price_entry">Price</span><span class="format_entry">Format</span><span class="duty-status_entry">Duty Status</span><span class="availavility_entry">Availability</span><span class="quantity_entry">Stock</span><span class="condition_entry">Condition</span><span class="img-product_entrytitle">Image</span><span class="score_entry" style="height:0px !important;display:none;">Score</span><span class="buttons_entry">&nbsp;</span></tr></table></td></tr>'+ html + "</table>";
				html += '</div></div>';
	}
	//nlapiLogExecution("DEBUG", 'html', html);
	return html;	
}


Date.prototype.format=function(format){var returnStr='';var replace=Date.replaceChars;for(var i=0;i<format.length;i++){var curChar=format.charAt(i);if(i-1>=0&&format.charAt(i-1)=="\\"){returnStr+=curChar;}else if(replace[curChar]){returnStr+=replace[curChar].call(this);}else if(curChar!="\\"){returnStr+=curChar;}}return returnStr;};Date.replaceChars={shortMonths:['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],longMonths:['January','February','March','April','May','June','July','August','September','October','November','December'],shortDays:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],longDays:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],d:function(){return(this.getDate()<10?'0':'')+this.getDate();},D:function(){return Date.replaceChars.shortDays[this.getDay()];},j:function(){return this.getDate();},l:function(){return Date.replaceChars.longDays[this.getDay()];},N:function(){return this.getDay()+1;},S:function(){return(this.getDate()%10==1&&this.getDate()!=11?'st':(this.getDate()%10==2&&this.getDate()!=12?'nd':(this.getDate()%10==3&&this.getDate()!=13?'rd':'th')));},w:function(){return this.getDay();},z:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((this-d)/86400000);},W:function(){var d=new Date(this.getFullYear(),0,1);return Math.ceil((((this-d)/86400000)+d.getDay()+1)/7);},F:function(){return Date.replaceChars.longMonths[this.getMonth()];},m:function(){return(this.getMonth()<9?'0':'')+(this.getMonth()+1);},M:function(){return Date.replaceChars.shortMonths[this.getMonth()];},n:function(){return this.getMonth()+1;},t:function(){var d=new Date();return new Date(d.getFullYear(),d.getMonth(),0).getDate()},L:function(){var year=this.getFullYear();return(year%400==0||(year%100!=0&&year%4==0));},o:function(){var d=new Date(this.valueOf());d.setDate(d.getDate()-((this.getDay()+6)%7)+3);return d.getFullYear();},Y:function(){return this.getFullYear();},y:function(){return(''+this.getFullYear()).substr(2);},a:function(){return this.getHours()<12?'am':'pm';},A:function(){return this.getHours()<12?'AM':'PM';},B:function(){return Math.floor((((this.getUTCHours()+1)%24)+this.getUTCMinutes()/60+this.getUTCSeconds()/3600)*1000/24);},g:function(){return this.getHours()%12||12;},G:function(){return this.getHours();},h:function(){return((this.getHours()%12||12)<10?'0':'')+(this.getHours()%12||12);},H:function(){return(this.getHours()<10?'0':'')+this.getHours();},i:function(){return(this.getMinutes()<10?'0':'')+this.getMinutes();},s:function(){return(this.getSeconds()<10?'0':'')+this.getSeconds();},u:function(){var m=this.getMilliseconds();return(m<10?'00':(m<100?'0':''))+m;},e:function(){return"Not Yet Supported";},I:function(){return"Not Yet Supported";},O:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+'00';},P:function(){return(-this.getTimezoneOffset()<0?'-':'+')+(Math.abs(this.getTimezoneOffset()/60)<10?'0':'')+(Math.abs(this.getTimezoneOffset()/60))+':00';},T:function(){var m=this.getMonth();this.setMonth(0);var result=this.toTimeString().replace(/^.+ \(?([^\)]+)\)?$/,'$1');this.setMonth(m);return result;},Z:function(){return-this.getTimezoneOffset()*60;},c:function(){return this.format("Y-m-d\\TH:i:sP");},r:function(){return this.toString();},U:function(){return this.getTime()/1000;}};
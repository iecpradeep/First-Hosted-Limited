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
	
//llama a la busqueda de items y dibuja la estructura principal de la pagina
function ItemSearch(params)
{
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	if(moneySymbol == 1)
	{
		moneySymbol = '&pound;';
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

	var options = new Object(); // Object of configuration 
	options.columns = new Array(); // Array of search columns (NS)
	options.columnFrom = 'internalid'; // Column where the data is gone to be taked (must be at the columns array)
	var c = new nlobjSearchColumn(options.columnFrom); 
	c.setSort();
	options.columns.push(c); 
	options.columns.push(new nlobjSearchColumn('name'));
	options.columns.push(new nlobjSearchColumn('custitem_item_region'));
	options.columns.push(new nlobjSearchColumn('custitem_country'));
	options.columns.push(new nlobjSearchColumn('custitem_item_vintage'));
	options.columns.push(new nlobjSearchColumn('custitem_btlsize'));
	options.columns.push(new nlobjSearchColumn('saleunit'));
	options.columns.push(new nlobjSearchColumn('storedetaileddescription'));	
	options.filters = new Array(); // Array of search filters (NS)
	options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	//options.filters.push(new nlobjSearchFilter('custitem_quantityonhand', null, 'greaterthan', '0'));
	/////////////////////
	var filters=request.getParameter('filters');//obtiene los nombres de los filtros
	var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
	var values=request.getParameter('values');//obtiene los valores de los filtros
	var arrValues=values.split("*");//separa el string con el valor de los filtros con *
	var myshort=request.getParameter('myshort');//para acortar.

	var myenpremiur=request.getParameter('enpremiur');//para acortar.

	var mystaff=request.getParameter('staff');//para acortar.

	
	

	for(i=0;i<arrValues.length-1;i++){//recorre los filtros y los valores y crea un filtro por cada uno que encuentra
		if(arrfilters[i] == 'price1')
		{
			options.filters.push(new nlobjSearchFilter('price', null, 'lessthan', '30'));
		}
		else
		{
			if(arrfilters[i] == 'price2')
			{
				options.filters.push(new nlobjSearchFilter('price', null, 'between', '30', '100'));
			}
			else
			{
				if(arrfilters[i] == 'price3')
				{
					options.filters.push(new nlobjSearchFilter('price', null, 'between', '100', '200'));
				}
				else
				{
					if(arrfilters[i] == 'price4')
					{
						options.filters.push(new nlobjSearchFilter('price', null, 'greaterthan', '200'));
					}
					else
					{
						if(arrfilters[i] == 'price')
						{
							var priceValues = new Array();
							priceValues = arrValues[i].split('-');
							options.filters.push(new nlobjSearchFilter('price', null, 'between',priceValues[0], priceValues[1]));
						}
						else
						{
							if(arrfilters[i] == 'searchkeywords')
							{					
							    keysarr = new Array();
								if(arrValues[i]) {
									keysarr = arrValues[i].split(" "); 
								}
								
								if(keysarr.length > 1) {
									for(keysindex = 0; keysindex < keysarr.length; keysindex++) {
										if(keysarr[keysindex])
											options.filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',keysarr[keysindex]));
									}
									
								} else {
									options.filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',arrValues[i]));
								}
							}
							else
							{
								if(arrfilters[i] == 'inPrimeur')
								{
									options.filters.push(new nlobjSearchFilter('custitem_inprimeur', null, 'is','F'));
								}
								else
								{
									if(arrfilters[i] == 'custitem_vintage_search')
									{
										var vintageValues = new Array();
										vintageValues = arrValues[i].split('-');										
										if(vintageValues.length > 1)
										{											
											options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'between', vintageValues[0], vintageValues[1]));
										}
										else
										{											
											options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'equalto', arrValues[i]));
										}
									}
									else
									{									
										if(arrfilters[i] == 'keywords')
										{
											options.filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains', arrValues[i]));
											
										}
										else
										{
											if( (arrfilters[i] == 'saleunit' || arrfilters[i] == 'custitem_country') && arrValues[i] && arrValues[i].indexOf(",") != -1) {
												sizeValues = arrValues[i].split(',');	
												options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'anyof', sizeValues ));
											} else {
											    if(arrfilters[i] == 'custitem_item_classification' && arrValues[i]==9999)
											    {		
													var arrAux = new Array();
													arrAux[0]=2;
													arrAux[1]=4;
													arrAux[2]=9;


													options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'noneof',  arrAux));

												}else{
												if(arrfilters[i] == 'custitem_btlsize' && arrValues[i].indexOf(",")!=-1)
											    	{
														var arrAux =  arrValues[i].split(",")
														options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'anyof',  arrAux));	
												
												}else{	
												
if(arrfilters[i] == 'custrecord_rotation_polineunits' || arrfilters[i] == 'custrecord_item_uom')
{
	sizeValues = arrValues[i].split(',');	
	options.filters.push(new nlobjSearchFilter(arrfilters[i], 'custrecord_lotitem', 'anyof', sizeValues ));	
}else{
	options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'is', arrValues[i] ));
	
}
	if(arrfilters[i] == 'custitem_whatsnew' && arrValues[i] == "T") {
		options.filters.push(new nlobjSearchFilter("custrecord_rotation_purchase_date", 'custrecord_lotitem', 'onorafter', 'daysago5' ));
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
	/////////////////////
	//options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied	
	//options.restrictType = false;

	var mySearch=38	

	if(mystaff!=1) mySearch=114;// Make the search
	inprem = "";
	if(myenpremiur!=1) { 
		mySearch=61// Make the search
		inprem = "&isinpremiur=T";
	}
	var itemsList = nlapiSearchRecord('item', mySearch, options.filters) // make search


	if(itemsList != null)
	{
		mycount=itemsList.length;
		if(itemsList.length>25 && myshort==1) mycount=25;
		if(itemsList.length>75 && myshort==3) mycount=75;

	}	



	var content = "";
	content += "<tr><td>";
	//dibuja las breadcrumbs
	//<a class="crumb" href="/s.nl/c.1336541/sc.7/category.-107/it.C/.f" onmouseout="this.className='crumb';" onmouseover="this.className='crumbover';">
	content += "<div id='breadcrumbs' class='crumb' onmouseout=\"this.className='crumb';\" onmouseover=\"this.className='crumbover';\" style='margin-left: 3px;'><a href='http://shopping.netsuite.com/s.nl/c.TSTDRV675102/n.5/it.I/id.7/.f?' >Wines&nbsp;&gt;&nbsp;</a>";	
	content += "</td></div>";
	content += "</tr>";
	
	content += "<tr><td><div id='resultText' ></div></td></tr>";
	if(itemsList != null && itemsList != undefined)
	{
		if(myshort!=1)content += "<tr style='display:none'><td class='pageNumber'>1</td><td id='itemsQuantity'>" + mycount + "</td></tr>";
	}
	else
	{
		content += "<tr style='display:none'><td class='pageNumber'>1</td><td id='itemsQuantity'>0</td></tr>";
	}
	
	content += "<tr><td>";
	content += "<br><br>";
	if(itemsList != null && itemsList != undefined && itemsList.length != 0) {
		content += "<span class='inew' width='8px' height='10px' style='padding-left:15px;margin-right:10px'>New!</span><span class='staffreco' width='8px' height='10px' style='padding-left:15px'>Staff Pick</span><span class='plus-ico' width='10px' height='10px' style='padding-left:15px'>Click on plus mark to see full descriptions</span><div id='linksStock1'></div>";
		
	} else {
		content += "<span class='noresultsfound'><strong>No results found</strong></span>";
	}
	content += "<br><br><br>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina
	if(itemsList != null && itemsList != undefined)
	{			
		 if(myshort!=1)content += writePagination(mycount);
	}	
	content += "</td></tr>";
	/*content += "<tr>";
	//dibuja el combo de cantidad de items por pagina
	content += "<td><select id='perpage'>";
	content += "<option value='25'>25</option>";
	content += "<option value='50'>50</option>";
	content += "<option value='100'>100</option>";	
	content += "</select></td>";	
	content += "</tr>";*/
	
	content += "<tr><td>";
	content += '<div class="description_modules hide-border">';
	if(itemsList != null && itemsList != undefined)
	{
		
		content += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
		content += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width" style="width:15px"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width" style="width:85px" >Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width" style="width:74px" ></th></tr></thead><tbody>';
		//dibuja los items

		
		//DUE SOON
		var duesoonList = nlapiSearchRecord('transaction', 293) // make search
		var duesoonArr = new Array();
		if(duesoonList) {
			for(var ix = 0; ix < duesoonList.length; ix++) {
				var duesooncolumns = duesoonList[ix].getAllColumns();
				duesoonArr.push(duesoonList[ix].getValue(duesooncolumns[0]));
			}
		}
		
		for(var i = 0; i < mycount; i++) {
			var columns = itemsList[i].getAllColumns();
			rowcolor =  (i%2==1)?'zebra':'data_product-rotations';
			if(i > 24)
			{			
				content += "<tr id='" + i + "' style='display:none'  class='list-items-row "+rowcolor+"'>";
			}
			else
			{
				content += "<tr id='" + i + "' class='list-items-row "+rowcolor+"'>";
			}
			
			if(itemsList[i].getValue(columns[19])=='T') staffreco = 'display:inline-block';
			else staffreco = 'display:none';
			
			if(itemsList[i].getValue(columns[20])=='T') inew = 'display:inline-block';
			else inew = 'display:none';
			
			content += "<td align='left' style='text-align:left' class='icon-cont'><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px'></span><span class='inew' width='8px' height='10px' style='"+inew+"'></span><span class='staffreco' width='11px' height='10px' style='"+staffreco+"'></span></td>";
			
			bottlesize = '';
			qty = itemsList[i].getValue(columns[8]);
			if(qty < 1) qty = "";
			if(itemsList[i].getValue(columns[8]) > 0) {
				var avl = 'In Stock';	
			} else {
				var avl = 'Out of Stock';	
			}
			
			nlapiLogExecution('DEBUG', 'itemsList[i].getValue(columns[31])',itemsList[i].getValue(columns[31]));
			if(itemsList[i].getValue(columns[31])) {
				delivery =   nlapiStringToDate(itemsList[i].getValue(columns[31]));
				today = new Date();
				if(delivery > today) {
					
					avl = itemsList[i].getValue(columns[31]);
					//qty = '';
				}
			}
			
			//check if due soon
			if(avl == 'In Stock' && duesoonArr.length) {
				if(duesoonArr.indexOf(itemsList[i].getValue(columns[34])) > -1){
					avl = "Due Soon"	
				}
			}
					
			if(itemsList[i].getValue(columns[35])== 'T'  || itemsList[i].getValue(columns[36])== '4'){
				avl="EP";
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
				if(dtyStatus == 'Duty Paid (Private)') {
					dtyStatus = 'Duty Paid';
				} if(dtyStatus && dtyStatus.toUpperCase() != 'IN BOND' && dtyStatus.toUpperCase() != 'DUTY PAID')
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
					getvars = inprem +"&dutystatus="+ itemsList[i].getValue(columns[16]);
				}
				content += '<td>'+ (itemsList[i].getValue(columns[15])==''?'': ' ' + itemsList[i].getText(columns[15])) +'</td><td>'+(itemsList[i].getValue(columns[28])==0?'NV':itemsList[i].getText(columns[5]))+'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ', ' + itemsList[i].getText(columns[14])) +'</td><td>' + moneySymbol +formatCurrency(Math.round(newprice.toFixed(2)))+'.00</td><td>'+itemsList[i].getText(columns[22])+'</td><td>'+ dtyStatus +'</td><td>'+avl+'</td><td>'+qty+'</td><td>' + condition + '</td><td>'+(itemsList[i].getValue(columns[17])=="- None -"?'':itemsList[i].getValue(columns[17]))+'</td><td  class="buy-now-cont"><a id="buybtn_'+ itemsList[i].getValue(columns[0])+'" href="'+itemsList[i].getValue(columns[18])+'?uom='+itemsList[i].getValue(columns[22])+'&cond='+itemsList[i].getValue(columns[23])+getvars+'" class="call-to-action_button_search" >VIEW</a></td>';
			//}
			//catch(e)
			//{}
			content += "</tr>";
			if(pq) { 
				pq = "<div class='special-offer-container'><span class='offimg'></span><span class='offtext'>" + pq + "</span></div>";
				if(i > 24)
				{			
				content += "<tr id='sp" + i + "' style='display:none' class='sprow "+rowcolor+"'>";
				}
				else
				{
			 	content += "<tr id='sp" + i + "' class='sprow "+rowcolor+"'>";
				}
				content += "<td colspan='13' style='text-align:left;padding-left:10px'>"+pq+"</td></tr>";
			}
			content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>' + (caseSize==''?'&nbsp;':caseSize) + '</li><li>'+(itemsList[i].getText(columns[13])==''?'&nbsp;':itemsList[i].getText(columns[13]))+'</li><li>'+(itemsList[i].getValue(columns[28])==0?'NV':itemsList[i].getText(columns[5]))+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > '+(itemsList[i].getValue(columns[27])==''?'&nbsp;':itemsList[i].getText(columns[27]))+'</li><li>'+(itemsList[i].getValue(columns[14])==''?'&nbsp;':itemsList[i].getText(columns[14]))+'</li></ul></div></div></div></td></tr>';
		}		
		content += "</tbody>";
		content += "</table>";
	}
	content += '</div>';
	content += "</td></tr>";
	//guarda la pagina actual
	if(itemsList != null && itemsList != undefined)
	{
		content += "<tr style='display:none'><td class='pageNumber'>1</td><td id='itemsQuantity'>" + mycount + "</td></tr>";
	}
	else
	{
		content += "<tr style='display:none'><td class='pageNumber'>1</td><td id='itemsQuantity'>0</td></tr>";
	}
	content += "<tr><td>";
		//dibuja el paginador para ir para la pagina anterior y la proxima pagina
	if(itemsList != null && itemsList != undefined)
	{		
		 if(myshort!=1)content += writePagination(mycount);
		
	}	
	content += "</td></tr>";
	content += '<div id="exchangeRateValue" style="display:none">' + exchangeRate + '</div>';	
	response.write(content);
}

function writePagination(mycount)
{
	var content = "<div class='search-pagination' style='vertical-align:middle;'>";
	content += "<div width='50%' align='left' style='float:left;vertical-align:middle'><a  href='#' style='display:none' class='firstPage firstp'>&lt;&lt;</a>";
	content += "<span class='pagination_line firstp' style='display:none'>&nbsp;|&nbsp</span>";
	content += "<a href='#' style='display:none'  class='previousPage prevp'> &lt; Prev</a>";
	content += "<span class='pagination_line prevp' style='display:none'>&nbsp;|&nbsp</span><span class='labelPageNumber'>";
	content += "PAGE 1 of " + Math.ceil((mycount / 25)) + "</span><span class='pagination_line nextp' style='display:none'>&nbsp;|&nbsp;</span>";
	content += "<a  href='#' class='nextPage nextp' style='display:none'>Next &gt;</a> <span class='pagination_line lastp' style='display:none'>&nbsp;|&nbsp</span> <a href='#' class='lastp lastPage' style='display:none'>&gt;&gt;</a>";
	content += "</div>";
	content += "<div width='200px' align='right'>Items per page&nbsp;<select id='perpage' name='perpage'>";
	//content += "<option value='1' selected>1</option>";
	//content += "<option value='2'>2</option>";
	//content += "<option value='4'>4</option>";	
	content += "<option value='25' selected>25</option>";
	content += "<option value='50'>50</option>";
	content += "<option value='100'>100</option>";	
	content += "</select></div>";
	content += "</div>";
	return content;
}




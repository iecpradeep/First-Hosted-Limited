

//llama a la busqueda de items y dibuja la estructura principal de la pagina
function LHKItemSearch(params)
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
	for(var i=0;i<arrValues.length-1;i++){//recorre los filtros y los valores y crea un filtro por cada uno que encuentra
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
								options.filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',arrValues[i]));
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
											if(arrfilters[i] == 'saleunit' && arrValues[i] && arrValues[i].indexOf(",") != -1) {
												sizeValues = arrValues[i].split(',');	
												options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'anyof', sizeValues ));
											} else {
												options.filters.push(new nlobjSearchFilter(arrfilters[i], null, 'is', arrValues[i] ));
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
	var itemsList = nlapiSearchRecord('item', 38, options.filters);// Make the search
	if(itemsList != null)
	{
		mycount=itemsList.length;
		//if(itemsList.length>300 && options.filters.length==1) mycount=300;
		if(itemsList.length>25) mycount=25;
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
		content += "<tr style='display:none'><td class='pageNumber'></td><td id='itemsQuantity'>Loading...</td></tr>";
	}
	else
	{
		content += "<tr style='display:none'><td class='pageNumber'>1</td><td id='itemsQuantity'>0</td></tr>";
	}
	
	content += "<tr><td>";
	content += "<br><br>";
	if(itemsList != null && itemsList != undefined && itemsList.length != 0) {
		content += "<span class='inew' width='8px' height='10px' style='padding-left:15px;margin-right:10px'>New!</span><span class='staffreco' width='8px' height='10px' style='padding-left:15px'>Staff Pick</span>";
	} else {
		content += "<span class='noresultsfound'><strong>No results found</strong></span>";
	}
	content += "<br><br><br>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina
	if(itemsList != null && itemsList != undefined)
	{			
		 //content += writePagination(mycount);
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
		content += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width"></th></tr></thead><tbody>';
		//dibuja los items

		

		
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

			var avl = '';
				
			if(itemsList[i].getValue(columns[8]) > 0) {
				avl = 'In Stock';	
			} else {
				avl = 'Out of Stock';	
			}
			
			img = '/core/media/media.nl?id=90&c=1336541&h=32445535e21bfc895cec';
			//try
			//{
				//var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('storedisplayimage'));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('imageurl'));
				//if(record.getFieldValue('storedisplayimage')) {
					 //var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					 //img = f.getURL();
				//}

				var itemPrice =  itemsList[i].getValue(columns[4]);//record.getLineItemMatrixValue('price1', 'price', 1, 1);
				if(exchangeRate != 0)
				{
					itemPrice = itemPrice * exchangeRate;
				}
				var multiple = 1;
				var uom = itemsList[i].getText(columns[22]);
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
					bottlesize=x[1]+" cl";	
				}

				newprice = itemPrice * multiple;
				
				//price quantity feature
				var quantityLevels = itemsList[i].getValue(columns[24]);//record.getMatrixCount('price1', 'price');
				var pq = "";
				if ( quantityLevels != "1+" && quantityLevels != "" ){
			
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
								pq +=  casel +'+ cases ' + moneySymbol + caseprice.toFixed(2) + ' each';
							}							
						//}
					//}
			 
			
				}	
				
				var dtyStatus = itemsList[i].getText(columns[16]);
				if(dtyStatus != 'IN BOND' && dtyStatus != 'DUTY PAID')
				{
					dtyStatus = ' ';
				}
				var condition = itemsList[i].getText(columns[23]);
				if(condition == "- None -")
				{
					condition = " ";
				}
				content += '<td>'+ (itemsList[i].getValue(columns[15])==''?'': ' ' + itemsList[i].getText(columns[15])) +'</td><td>'+ itemsList[i].getText(columns[5])+'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ' ' + itemsList[i].getText(columns[14])) +'</td><td>' + moneySymbol +newprice.toFixed(2)+'</td><td>'+itemsList[i].getText(columns[22])+'</td><td>'+ dtyStatus +'</td><td>'+avl+'</td><td>'+itemsList[i].getValue(columns[8])+'</td><td>' + condition + '</td><td>'+(itemsList[i].getValue(columns[17])==""?'':itemsList[i].getText(columns[17]))+'</td><td  class="buy-now-cont"><a id="buybtn_'+ itemsList[i].getValue(columns[0])+'" href="'+itemsList[i].getValue(columns[18])+'?uom='+itemsList[i].getValue(columns[22])+'&cond='+itemsList[i].getValue(columns[23])+'" class="call-to-action_button" >BUY NOW</a></td>';
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
			
			content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>' + itemsList[i].getText(columns[22]) + '</li><li>'+itemsList[i].getText(columns[13])+'</li><li>'+itemsList[i].getText(columns[5])+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > TBD</li><li>'+(itemsList[i].getValue(columns[14])==''?'&nbsp;':itemsList[i].getText(columns[14]))+'</li></ul></div></div></div></td></tr>';
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
		 //content += writePagination(mycount);
		
	}	
	content += "</td></tr>";
	content += '<div id="exchangeRateValue" style="display:none">' + exchangeRate + '</div>';	
	response.write(content);
}

function writePagination(mycount)
{
	var content = "<div class='search-pagination' style='vertical-align:middle;'>";
	content += "<div width='50%' align='left' style='float:left;vertical-align:middle'>";
	content += "<span class='pagination_line firstp'>More Results Loading Please Wait..</span>";
	content += "</div>";
	content += "</div>";
	return content;
}




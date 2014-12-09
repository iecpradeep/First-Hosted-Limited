function searchFilter(filters, actualFilter)
{
	var found = 0;
	for(var i=0;i<filters.length-1;i++)
	{
		if(filters[i] == actualFilter)
		{
			found = 1;
			i = filters.length;
		}
		if(actualFilter == 'price' || actualFilter == 'price1' || actualFilter == 'price2' || actualFilter == 'price3' || actualFilter == 'price4')
		{
			if(filters[i] == 'price' || filters[i] == 'price1' || filters[i] == 'price2' || filters[i] == 'price3' || filters[i] == 'price4')
			{
				found = 1;
				i = filters.length;
			}
		}
		if(actualFilter == 'custitem_vintage_search' || actualFilter == 'custitem_item_vintage')
		{
			if(filters[i] == 'custitem_vintage_search' || filters[i] == 'custitem_item_vintage')
			{
				found = 1;
				i = filters.length;
			}
		}
	}
	return found;
}

function getOptions(arrfilters, arrValues) {
	
	var filters = new Array();
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	//filters.push(new nlobjSearchFilter('custitem_quantityonhand', null, 'greaterthan', '0'));
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
								keysarr = new Array();
								if(arrValues[i]) {
									keysarr = arrValues[i].split(" "); 
								}
								
								if(keysarr.length > 1) {
									for(keysindex = 0; keysindex < keysarr.length; keysindex++) {
										if(keysarr[keysindex])
											filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',keysarr[keysindex]));
									}
									
								} else {
									filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',arrValues[i]));
								}
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
												
												}else if(arrfilters[i] == 'internalid' && arrValues[i].indexOf(",")!=-1)
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

//escribe en formato html todos los filtros que seran aplicados mas adelante, escribe el texto y la cantidad de items encontrados por cada filtro
function writeCategoriesAndFilters(params)
{
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	nlapiLogExecution('ERROR', 'target currency', targetCurrency);
	nlapiLogExecution('ERROR', 'money symbol', moneySymbol);	
	if(moneySymbol == 1)
	{
		moneySymbol = '&pound;';
		if(targetCurrency == "")
		{
			targetCurrency = 'GBP';
		}
	}
	if(moneySymbol == 2)
	{
		moneySymbol = '&#36;';
		if(targetCurrency == "")
		{
			targetCurrency = 'USD';
		}
	}
	if(moneySymbol == 3)
	{
		moneySymbol = '&euro;';
		if(targetCurrency == "")
		{
			targetCurrency = 'EUR';
		}
	}
	if(moneySymbol == 4)
	{
		moneySymbol = 'sFr.';
		if(targetCurrency == "")
		{
			targetCurrency = 'CHF';
		}
	}
	if(moneySymbol == 5)
	{
		moneySymbol = 'HK$';
		if(targetCurrency == "")
		{
			targetCurrency = 'HKD';
		}
	}
	var exchangeRate = 0;
	if(targetCurrency != "")
	{		
		exchangeRate = nlapiExchangeRate('GBP', targetCurrency);
	}
	var options = new Object();	
	var filters=request.getParameter('filters');//obtiene los nombres de los filtros
	var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
	var values=request.getParameter('values');//obtiene los valores de los filtros
	var arrValues=values.split("*");//separa el string con el valor de los filtros con *	
	
	options.filters = getOptions(arrfilters, arrValues); // Array of search filters (NS)
	var content = "<div id='baseFilters'>";
	var filternum = 0;
	foundFilter = searchFilter(arrfilters, 'custitem_colour');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerColour
		itemsList = nlapiSearchRecord('item', 26, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			filternum++;
			if(itemsList.length > 0)
			{
				content += "<li>Wine Colour<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();					
					content += "<li>";										
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{							
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_colour:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";																				
						}
						else
						{							
							//escribe la cantidad de items correspondiente encontrados para ese resultado							
							content += " <span>(" + itemsList[i].getValue(columns[c]) + ")</span>" + "</a>";														
						}
					}
					content += "</li>";													
				}
				content += "</ul></li>";
			}			
		}
	}
	
	foundFilter = searchFilter(arrfilters, 'price1');	
	if(foundFilter == 0)
	{
		less30 = nlapiSearchRecord('item', 34, options.filters, null);
		bet30n100 = nlapiSearchRecord('item', 35, options.filters, null);
		bet100n200 = nlapiSearchRecord('item', 36, options.filters, null);
		more200 = nlapiSearchRecord('item', 37, options.filters, null);		
		
		pricefilter = 0;
		if(less30 && less30.length > 0) pricefilter++;
		if(bet30n100 && bet30n100.length > 0) pricefilter++;
		if(bet100n200 && bet100n200.length > 0) pricefilter++;
		if(more200 && more200.length > 0) pricefilter++;
		
		if(pricefilter > 0) {
			filternum++;
			content += "<li>Price Per Bottle<ul>";
			
			var initialPrice = 10;
			var finalPrice = 30;
			var lastFinalPrice = 0;
			
			//llama a la saved search itemsPriceLessThan30
			if(less30 != null && less30 != undefined)
			{
				if(less30.length > 0)
				{
					if(exchangeRate != 0)
					{
						initialPrice = initialPrice * exchangeRate;
						initialPrice = Math.floor(initialPrice);
						finalPrice = finalPrice * exchangeRate;
						finalPrice = Math.ceil(finalPrice);
					}
					content += "<li><a href='#' id='filter:" + 0 + "' name='price1:" +  less30.length + ":Price less than 30' class='newFilter'>" + moneySymbol + initialPrice + " to " + moneySymbol + finalPrice + " <span>(" +  less30.length + ")</span></a></li>";
				}					
			}
			//llama a la saved search itemsPriceBetween30And100
				
			if(bet30n100 != null && bet30n100 != undefined)
			{
				if(bet30n100.length > 0)
				{
					lastFinalPrice = finalPrice;
					initialPrice = 30;
					finalPrice = 100;
					if(exchangeRate != 0)
					{
						initialPrice = initialPrice * exchangeRate;
						initialPrice = Math.floor(initialPrice);
						if(exchangeRate != 1)
						{
							if(initialPrice < lastFinalPrice)
							{
								initialPrice = initialPrice + 2;
							}
						}
						else
						{
							initialPrice = initialPrice + 1;
						}
						finalPrice = finalPrice * exchangeRate;
						finalPrice = Math.ceil(finalPrice);
					}
					content += "<li><a href='#' id='filter:" + 0 + "' name='price2:" + bet30n100.length + ":Price 30-100' class='newFilter'>" + moneySymbol + initialPrice + " to " + moneySymbol + finalPrice + " <span>(" +  bet30n100.length + ")</span></a></li>";
				}
			}	
			//llama a la saved search itemsPriceBetween100And200			
			if(bet100n200 != null && bet100n200 != undefined)
			{
				if(bet100n200.length > 0)
				{
					lastFinalPrice = finalPrice;
					initialPrice = 100;
					finalPrice = 200;
					if(exchangeRate != 0 || exchangeRate != 1)
					{
						initialPrice = initialPrice * exchangeRate;
						initialPrice = Math.floor(initialPrice);
						if(exchangeRate != 1)
						{
							if(initialPrice < lastFinalPrice)
							{
								initialPrice = initialPrice + 2;
							}
						}
						else
						{
							initialPrice = initialPrice + 1;
						}
						finalPrice = finalPrice * exchangeRate;
						finalPrice = Math.ceil(finalPrice);
					}
					
					content += "<li><a href='#' id='filter:" + 0 + "' name='price3:" + bet100n200.length + ":Price 100-200' class='newFilter'>" + moneySymbol + initialPrice + " to " + moneySymbol + finalPrice + "  <span>(" +  bet100n200.length + ")</span></a></li>";
				}
			}
			//llama a la saved search itemsPriceMoreThan200
			if(more200 != null && more200 != undefined)
			{
				if(more200.length > 0)
				{
					lastFinalPrice = finalPrice;
					finalPrice = 200;
					if(exchangeRate != 0 || exchangeRate != 1)
					{						
						finalPrice = finalPrice * exchangeRate;
						if(exchangeRate != 1)
						{
							if(initialPrice < lastFinalPrice)
							{
								finalPrice = finalPrice + 2;
							}
						}
						else
						{
							finalPrice = finalPrice + 1;
						}
						finalPrice = Math.floor(finalPrice);
					}
					content += "<li><a href='#' id='filter:" + 0 + "' name='price4:" + more200.length  + ":Price more than 200' class='newFilter'>More than " + moneySymbol + finalPrice + "  <span>(" +  more200.length + ")</span></a></li>";
				}					
			}
			
			content += "</ul></li>";
		}
	}
	
	foundFilter = searchFilter(arrfilters, 'custitem_item_vintage');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerVintage
		itemsList = nlapiSearchRecord('item', 27, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			filternum++;
			if(itemsList.length > 0)
			{
				content += "<li class='vintage'>Vintage<ul>";
				//recorre todos los resultados encontrados
				var middlelist =  Math.ceil(itemsList.length/2)
				for(var i = middlelist-1, d = itemsList.length - 1; i >= 0; i--,d--) {
					var columns = itemsList[i].getAllColumns();
					var columns2 = itemsList[d].getAllColumns();
					content += "<li>";	
					content += "<ul id='double'>";
					
					content += "<li>";
					for(var e = 0; e < columns2.length; e++) {
						if (e==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + d + "' name='custitem_item_vintage:" + itemsList[d].getValue(columns2[e]) + ":" + itemsList[d].getText(columns2[e]) + "' class='newFilter' >" +(itemsList[d].getText(columns2[e])==0?'NV':itemsList[d].getText(columns2[e]))+ " ";	
							  // itemsList[i].getText(columns[c])						
						}
						else
						{							
							//escribe la cantidad de items correspondiente encontrados para ese resultado							
							content += " <span>(" + itemsList[d].getValue(columns2[e]) + ")</span>" + "</a>";															
						}
					}
					content += "</li>";	
					content += "<li>";
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_item_vintage:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" +(itemsList[i].getText(columns[c])==0?'NV':itemsList[i].getText(columns[c]))+ " ";	
							  // itemsList[i].getText(columns[c])						
						}
						else
						{							
							//escribe la cantidad de items correspondiente encontrados para ese resultado							
							content += " <span>(" + itemsList[i].getValue(columns[c]) + ")</span>" + "</a>";															
						}
					}
					content += "</li>";	
					content += '</ul>';
					content += "</li>";						
				}
				content += "</ul></li>";
			}					
		}
	}
	content += "</div>";
	//campo reservado para guardar la url de la pagina anterior para formar una nueva url
	content += "<div id='oldURL' value=''></div>";
	//content += "<tr><td>" + price1 + "--" + price2 + "</td></tr>"
	response.write(content);
}



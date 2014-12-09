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
function writeCategoriesAndFilters()
{
	var options = new Object();
	//options.filters = new Array(); // Array of search filters (NS)
	//options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	//options.filters.push(new nlobjSearchFilter('custitem_quantityonhand', null, 'greaterthan', '0'));
	var filters=request.getParameter('filters');//obtiene los nombres de los filtros
	var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
	var values=request.getParameter('values');//obtiene los valores de los filtros
	var arrValues=values.split("*");//separa el string con el valor de los filtros con *	
	
	options.filters = getOptions(arrfilters, arrValues); // Array of search filters (NS)
	var content = "<div id='advancedFilters' style='width:100%;float:left'>";
	var filternum = 0;
	var foundFilter = searchFilter(arrfilters, 'custitem_item_region');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerCountry
		itemsList = nlapiSearchRecord('item', 25, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>Region<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();					
					content += "<li>";					
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							content +="<a href='#' id='filter:" + i + "' name='custitem_item_region:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";
						}
						else
						{
							content += " <span>(" + itemsList[i].getValue(columns[c]) + ")</span>" + "</a>";
						}												
					}
					content += "</li>";					
				}
				content += "</ul></li>";
			}			
		}
	}
	
	foundFilter = searchFilter(arrfilters, 'custitem_item_appellation');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerAppellation
		itemsList = nlapiSearchRecord('item', 32, options.filters, null);
		if(itemsList != null && itemsList != undefined)
		{
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>Appellation<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();					
					content += "<li>";										
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_item_appellation:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";
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
	
	foundFilter = searchFilter(arrfilters, 'custitem_item_classification');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerClassification
		itemsList = nlapiSearchRecord('item', 33, options.filters, null);
		if(itemsList != null && itemsList != undefined)
		{			
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>AC Status<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();					
					content += "<li>";										
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_item_classification:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";																				
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
	
	foundFilter = searchFilter(arrfilters, 'custitem_btlsize');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerUnitSize
		itemsList = nlapiSearchRecord('item', 31, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>Unit Size<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();	
					content += "<li>";										
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_btlsize:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";																				
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
	
	foundFilter = searchFilter(arrfilters, 'custitem_dutystatus');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerDutyStatus
		itemsList = nlapiSearchRecord('item', 39, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>Duty Status<ul>";
				//recorre todos los resultados encontrados
				for(var i = 0; i < itemsList.length; i++) {
					var columns = itemsList[i].getAllColumns();
					content += "<li>";										
					for(var c = 0; c < columns.length; c++) {
						if (c==0)
						{
							//escribe el nombre del resultado
							//convert to title case
							content +="<a href='#' id='filter:" + i + "' name='custitem_dutystatus:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c]).replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();})+ " ";						
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
	
	foundFilter = searchFilter(arrfilters, 'custitem_scoreshown');
	if(foundFilter == 0)
	{
		//llama a la saved search itemsPerDutyStatus
		itemsList = nlapiSearchRecord('item', 41, options.filters, null);	
		if(itemsList != null && itemsList != undefined)
		{
			if(itemsList.length > 0)
			{
				filternum++;
				content += "<li class='vintage'>Score Shown<ul>";
				//recorre todos los resultados encontrados
				len =  itemsList.length;
				col  = itemsList[len-1].getAllColumns();
				if(itemsList[len-1].getText(col[0]) == "100") {
					len = len -1;
					content += "<li>";
					content +="<a href='#' id='filter:" + i + "' name='custitem_scoreshown:" + itemsList[len].getValue(col[0]) + ":" + itemsList[len].getText(col[0]) + "' class='newFilter' >" + itemsList[len].getText(col[0])+ " ";	
					content += " <span>(" + itemsList[len].getValue(col[1]) + ")</span>" + "</a>";
					content += "</li>";	
				}
				for(var i = 0; i < len; i++) {
					var columns = itemsList[i].getAllColumns();					
					content += "<li>";
					
					for(var c = 0; c < columns.length; c++) {
						
						if (c==0)
						{
							//escribe el nombre del resultado
							content +="<a href='#' id='filter:" + i + "' name='custitem_scoreshown:" + itemsList[i].getValue(columns[c]) + ":" + itemsList[i].getText(columns[c]) + "' class='newFilter' >" + itemsList[i].getText(columns[c])+ " ";						
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
	content += "</div>";
	//campo reservado para guardar la url de la pagina anterior para formar una nueva url
	content += "<div id='oldURL' value=''></div>";
	//content += "<tr><td>" + price1 + "--" + price2 + "</td></tr>"
	response.write(content);
}



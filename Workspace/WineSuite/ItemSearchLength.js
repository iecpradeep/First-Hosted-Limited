

//llama a la busqueda de items y dibuja la estructura principal de la pagina
function getLength(params)
{
	try
	{
		var sid = 38;
		var options = new Object(); // Object of configuration 
		options.columns = new Array(); // Array of search columns (NS)
		options.columnFrom = 'internalid'; // Column where the data is gone to be taked (must be at the columns array)
		var c = new nlobjSearchColumn(options.columnFrom); 
		c.setSort();
		options.columns.push(c); 
		options.columns.push(new nlobjSearchColumn('name'));	
		options.filters = new Array(); // Array of search filters (NS)
		options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
		//options.filters.push(new nlobjSearchFilter('custitem_quantityonhand', null, 'greaterthan', '0'));
		/////////////////////		
		var filters=request.getParameter('filters');//obtiene los nombres de los filtros
		if(filters != null || filters != undefined)
		{
			var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
			var values=request.getParameter('values');//obtiene los valores de los filtros
			var arrValues=values.split("*");//separa el string con el valor de los filtros con *
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
										options.filters.push(new nlobjSearchFilter('custitem_search_aux', null, 'contains',arrValues[i]));
									}
									else
									{
										if(arrfilters[i] == 'inPrimeur')
										{
											options.filters.push(new nlobjSearchFilter('custitem_inprimeur', null, 'is','F'));
											sid = 65;
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
		options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied	
		options.restrictType = false;
		var itemsList = nlapiSearchRecord('item', sid, options.filters);// Make the search	
		//return itemsList.length;	
		if(itemsList)
		{
			response.write('<script> var cantidad = ' + itemsList.length + '</script>');
		}else{
			response.write('<script> var cantidad = 0 </script>');
		}
	}
	catch(e)
	{
		response.write('<script> var cantidad = 0 </script>');
	}
}
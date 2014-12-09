

//llama a la busqueda de items y dibuja la estructura principal de la pagina
function writeWhatsNewItems()
{
	var filters = new Array();
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('custitem_whatsnew', null, 'is', 'T'));
	var itemsList = nlapiSearchRecord('item', 38, filters);// Make the search
	var content = "";
	content += "<tr><td>";
	content += "<br/>";
	content += "<span class='inew' width='8px' height='10px' style='padding-left:15px;margin-right:10px'>New!</span><span class='staffreco' width='8px' height='10px' style='padding-left:15px'>Staff Pick</span>";
	content += "<br/><br/><br/>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina
	if(itemsList != null && itemsList != undefined)
	{			
		content += writePagination(itemsList);
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
	content += "<tr><a href='#' id='result' ></a></tr>";
	content += "<tr><td>";
	content += '<div class="description_modules hide-border">';
	if(itemsList != null && itemsList != undefined)
	{
		
		content += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
		content += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width"></th></tr></thead><tbody>';
		//dibuja los items
		for(var i = 0; i < itemsList.length; i++) {
			var columns = itemsList[i].getAllColumns();
			if(i > 24)
			{			
				content += "<tr id='" + i + "' style='display:none'  class='list-items-row'>";
			}
			else
			{
				content += "<tr id='" + i + "' class='list-items-row'>";
			}
			
			if(itemsList[i].getValue(columns[19])=='T') staffreco = 'display:inline-block';
			else staffreco = 'display:none';
			
			if(itemsList[i].getValue(columns[20])=='T') inew = 'display:inline-block';
			else inew = 'display:none';
			
			content += "<td align='left' style='text-align:left'  class='icon-cont'><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px'></span><span class='inew' width='8px' height='10px' style='"+inew+"'></span><span class='staffreco' width='11px' height='10px' style='"+staffreco+"'></span></td>";
			
			bottlesize = '';
			if(itemsList[i].getValue(columns[6])){
				bottlesizes = nlapiLoadRecord('customrecord_bottlesizes', itemsList[i].getValue(columns[6]));
				if(bottlesizes.getFieldValue('custrecord7') < 1) {
					size= bottlesizes.getFieldValue('custrecord7') * 100;
					bottlesize= size + ' cl'
				} else {
					bottlesize= bottlesizes.getFieldValue('custrecord7') + ' l'
				}
			}
			if(itemsList[i].getValue(columns[8]) > 0) {
				var avl = 'In Stock';	
			} else {
				var avl = 'Out of Stock';	
			}
			
			img = '/core/media/media.nl?id=90&c=1336541&h=32445535e21bfc895cec';
			try
			{
				var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('storedisplayimage'));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('imageurl'));
				if(record.getFieldValue('storedisplayimage')) {
					 var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					 img = f.getURL();
				}

				var itemPrice = record.getLineItemMatrixValue('price1', 'price', 1, 1);
				var multiple = 1;
				var uom = itemsList[i].getText(columns[22]);
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
				newprice = itemPrice * multiple;
				
				
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
								pq += casel + '+ cases &pound;' + caseprice.toFixed(2) + ' each';
							}
							/*if(uom.indexOf(/Cases/i) != -1) {
								pq += 'cases '
							} else {
								pq += 'bottles '	
							}*/
						}
					}
			 
			
				}
				
				content += '<td>'+  (itemsList[i].getValue(columns[15])==''?'': ' ' + itemsList[i].getText(columns[15])) +'</td><td>'+ itemsList[i].getText(columns[5]) +'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ' ' + itemsList[i].getText(columns[14])) +'</td><td>$'+newprice.toFixed(2)+'</td><td>'+itemsList[i].getText(columns[7])+'</td><td>'+(itemsList[i].getValue(columns[16])==""?' ':itemsList[i].getText(columns[16]))+'</td><td>'+avl+'</td><td>'+itemsList[i].getValue(columns[8])+'</td><td>TBD</td><td>'+(itemsList[i].getValue(columns[17])==""?'':itemsList[i].getText(columns[17]))+'</td><td class="buy-now-cont"><a href="'+itemsList[i].getValue(columns[18])+'" class="call-to-action_button" >BUY NOW</a></td>';
				//content += "<td>" + itemsList[i].getValue(columns[1]) + " " + itemsList[i].getText(columns[2]) + " " + itemsList[i].getText(columns[3]) + "</td><td>" + itemPrice + "</td><td>" + itemsList[i].getText(columns[5]) + "</td><td>" + itemsList[i].getText(columns[6]) + " " + itemsList[i].getText(columns[7]) + "</td><td>" + itemsList[i].getValue(columns[8]) + "</td>";
			}
			catch(e)
			{
				//content += "<td>" + itemsList[i].getValue(columns[1]) + " " + itemsList[i].getText(columns[2]) + " " + itemsList[i].getText(columns[3]) + "</td><td>" + itemsList[i].getValue(columns[4]) + "</td><td>" + itemsList[i].getText(columns[5]) + "</td><td>" + itemsList[i].getText(columns[6]) + " " + itemsList[i].getText(columns[7]) + "</td><td>" + itemsList[i].getValue(columns[8]) + "</td>";
				content += '<td>'+ itemsList[i].getText(columns[15]) +'</td><td>'+ itemsList[i].getText(columns[5]) +'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ' ' + itemsList[i].getText(columns[14])) +'</td><td>$'+itemsList[i].getValue(columns[4])+'</td><td>'+itemsList[i].getText(columns[7])+'</td><td>'+(itemsList[i].getValue(columns[16])==''?'':itemsList[i].getText(columns[16]))+'</td><td>'+avl+'</td><td>'+itemsList[i].getValue(columns[8])+'</td><td>TBD</td><td>'+(itemsList[i].getValue(columns[17])==''?'':itemsList[i].getText(columns[17]))+'</td><td class="buy-now-cont"><a href="'+itemsList[i].getValue(columns[18])+'" class="call-to-action_button" >BUY NOW</a></td>';
			}
			
			content += "</tr>";
			if(pq) { 
				pq = "<div class='special-offer-container'><span class='offimg'></span><span class='offtext'>" + pq + "</span></div>";
				if(i > 24)
				{			
					content += "<tr id='sp" + i + "' style='display:none' class='sprow'>";
				}
				else
				{
					content += "<tr id='sp" + i + "' class='sprow'>";
				}
				content += "<td colspan='13' style='text-align:left;padding-left:10px'>"+pq+"</td></tr>";
			}
			content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>TBD</li><li>'+itemsList[i].getText(columns[13])+'</li><li>'+itemsList[i].getText(columns[5])+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > TBD</li><li>'+(itemsList[i].getValue(columns[14])==''?'&nbsp;':itemsList[i].getText(columns[14]))+'</li></ul></div></div></div></td></tr>';
		}		
		content += "</tbody>";
		content += "</table>";
	}
	content += '</div>';
	content += "</td></tr>";
	//guarda la pagina actual
	if(itemsList != null && itemsList != undefined)
	{
		content += "<tr style='display:none'><td id='pageNumber'>1</td><td id='itemsQuantity'>" + itemsList.length + "</tr>";
	}
	else
	{
		content += "<tr style='display:none'><td id='pageNumber'>1</td><td id='itemsQuantity'>0</tr>";
	}
	content += "<tr><td>";
	//content += "<br/><br/>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina		
	if(itemsList != null && itemsList != undefined)
	{
		/*content += "<td align='right'><a href='#' id='previousPage'> << </a></td>";
		content += "<td align='center' id='labelPageNumber'> Page 1 of " + Math.ceil((itemsList.length / 25)) + "</td>";
		content += "<td align='left'><a href='#' id='nextPage'> >> </a></td>";*/		
		content += writePagination(itemsList);
	}	
	content += "</td></tr>";	
	response.write(content);
}

function writePagination(itemsList)
{
	var content = "<div class='search-pagination' style='vertical-align:middle;'>";
	content += "<div width='50%' align='left' style='float:left;vertical-align:middle'><a id='firstPage' href='#' style='display:none' class='firstPage firstp'>&lt;&lt;</a>";
	content += "<span class='pagination_line firstp' style='display:none'>&nbsp;|&nbsp</span>";
	content += "<a id='previousPage' href='#' style='display:none'  class='previousPage prevp'> &lt; Prev</a>";
	content += "<span class='pagination_line prevp' style='display:none'>&nbsp;|&nbsp</span><span class='labelPageNumber'>";
	content += "PAGE 1 of " + Math.ceil((itemsList.length / 25)) + "</span><span class='pagination_line nextp' style='display:none'>&nbsp;|&nbsp;</span>";
	content += "<a id='nextPage' href='#' class='nextPage nextp' style='display:none'>Next &gt;</a> <span class='pagination_line lastp' style='display:none'>&nbsp;|&nbsp</span> <a id='lastPage' href='#' class='lastp lastPage' style='display:none'>&gt;&gt;</a>";
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
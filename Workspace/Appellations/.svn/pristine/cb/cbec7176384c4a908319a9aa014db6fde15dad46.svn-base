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

//llama a la busqueda de items y dibuja la estructura principal de la pagina
function staffRecommendedItems(params)
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
	
	var filters = new Array();
	filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	filters.push(new nlobjSearchFilter('custitem_staffrecommended', null, 'is', 'T'));
	var itemsList = nlapiSearchRecord('item', 38, filters);// Make the search
	var content = "";
	if(itemsList != null && itemsList != undefined)
	{
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
	content += "<option value='25'>25 Results per page</option>";
	content += "<option value='50'>50 Results per page</option>";
	content += "<option value='100'>100 Results per page</option>";	
	content += "</select></td>";	
	content += "</tr>";*/
	content += "<tr><a href='#' id='result' ></a></tr>";
	content += "<tr><td>";
	content += '<div class="description_modules">';
	if(itemsList != null && itemsList != undefined)
	{
		
		content += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
		content += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width"></th></tr></thead><tbody>';
		//dibuja los items
		for(var i = 0; i < itemsList.length; i++) {
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
			
			content += "<td align='left' style='text-align:left;white-space:nowrap'  class='icon-cont'><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px'></span><span class='inew' width='8px' height='10px' style='"+inew+"'></span><span class='staffreco' width='11px' height='10px' style='"+staffreco+"'></span></td>";
			
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
			
			img = '/core/media/media.nl?id=2398&c=1336541&h=3f8fd85eb9a0688dde6a';
			/*try
			{
				var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('storedisplayimage'));
				//nlapiLogExecution('ERROR', 'storedisplayimage', record.getFieldValue('imageurl'));
				if(record.getFieldValue('storedisplayimage')) {
					 var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					 img = f.getURL();
				}*/

				var itemPrice =  itemsList[i].getValue(columns[4])//record.getLineItemMatrixValue('price1', 'price', 1, 1);
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
				var quantityLevels = itemsList[i].getValue(columns[24])//record.getMatrixCount('price1', 'price');
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
				if(dtyStatus && dtyStatus.toUpperCase() != 'IN BOND' && dtyStatus.toUpperCase() != 'DUTY PAID')
				{
					dtyStatus = ' ';
				}
				var condition = itemsList[i].getText(columns[23]);
				if(condition == "- None -")
				{
					condition = " ";
				}
				content += '<td>'+ (itemsList[i].getValue(columns[15])==''?'': ' ' + itemsList[i].getText(columns[15])) +'</td><td>'+ itemsList[i].getText(columns[5])+'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td>'+ itemsList[i].getText(columns[21]) + (itemsList[i].getValue(columns[14])==''?'': ' ' + itemsList[i].getText(columns[14])) +'</td><td>' + moneySymbol +formatCurrency(newprice.toFixed(2))+'</td><td>'+itemsList[i].getText(columns[22])+'</td><td>'+ dtyStatus +'</td><td>'+avl+'</td><td>'+itemsList[i].getValue(columns[8])+'</td><td>' + condition + '</td><td>'+(itemsList[i].getValue(columns[17])==""?'':itemsList[i].getText(columns[17]))+'</td><td  class="buy-now-cont"><a id="'+ itemsList[i].getValue(columns[0])+'" href="'+itemsList[i].getValue(columns[18])+'?uom='+itemsList[i].getValue(columns[22])+'&cond='+itemsList[i].getValue(columns[23])+'" class="call-to-action_button" >VIEW</a></td>';
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
			content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>TBD</li><li>'+itemsList[i].getText(columns[13])+'</li><li>'+itemsList[i].getText(columns[5])+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > '+(itemsList[i].getValue(columns[27])==''?'&nbsp;':itemsList[i].getText(columns[27]))+'</li><li>'+(itemsList[i].getValue(columns[14])==''?'&nbsp;':itemsList[i].getText(columns[14]))+'</li></ul></div></div></div></td></tr>';
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
	content += "<br/><br/>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina		
	if(itemsList != null && itemsList != undefined)
	{
		/*content += "<td align='right'><a href='#' id='previousPage'> << </a></td>";
		content += "<td align='center' id='labelPageNumber'> Page 1 of " + Math.ceil((itemsList.length / 25)) + "</td>";
		content += "<td align='left'><a href='#' id='nextPage'> >> </a></td>";*/		
		content += writePagination(itemsList);
	}	
	content += "</td></tr>";
	} else {
		content = '<tr><td><br><br><span class="noresultsfound"><strong>No results found</strong></span><br><br><br></td></tr>';
	}
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





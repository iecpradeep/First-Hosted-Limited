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


function getRelatedItems(params) {
	var itemRecord = loadItem(params.getParameter('id'));
	content = "";
	if(itemRecord.getLineItemCount('presentationitem') > 0) {
		content +='<div class="related-itemsdesc no-border-bottom" id="relatedDesc"><h2 class="related-items">You might also like</h2><br>';
		content += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable" width="779px">';
		content += '<thead><tr class="tasting-table-title"><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width">Wine Name</th><th class="price_width">Price</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Availability</th><th class="quantity_width">Stock</th><th class="condition_width">Condition</th><th class="score_width">Score</th><th class="call-to-action_button_width"></th></tr></thead><tbody>';
		
		for ( var i = 1; i <= itemRecord.getLineItemCount('presentationitem'); i++)
		{
			relid = itemRecord.getLineItemValue('presentationitem', 'item', i)
			relrecord = nlapiLoadRecord('inventoryitem', relid);
			rowcolor =  (i%2==1)?'zebra':'data_product-rotations';
			if(relrecord.getFieldValue('isinactive') == 'F' && relrecord.getFieldValue('isonline') == 'T') {
				content += "<tr id='" + i + "' class='list-items-row "+rowcolor+"''>";
				
				if(relrecord.getFieldValue('custitem_staffrecommended')=='T') staffreco = 'display:inline-block';
				else staffreco = 'display:none';
				
				if(relrecord.getFieldValue('custitem_whatsnew')=='T') inew = 'display:inline-block';
				else inew = 'display:none';
				
				content += "<td align='left' style='text-align:left' class='icon-cont'><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px'></span><span class='inew' width='8px' height='10px' style='"+inew+"'></span><span class='staffreco' width='11px' height='10px' style='"+staffreco+"'></span></td>";
				
				bottlesize = '';
			/*	if(relrecord.getFieldValue('custitem1')){
					bottlesizes = nlapiLoadRecord('customrecord_bottlesizes', relrecord.getFieldValue('custitem1'));
					if(bottlesizes.getFieldValue('custrecord7') < 1) {
						size= bottlesizes.getFieldValue('custrecord7') * 100;
						bottlesize= size + 'cl'
					} else {
						bottlesize= bottlesizes.getFieldValue('custrecord7') + 'l'
					}
				}*/
				
				
				
				var filters = new Array();
				filters.push(new nlobjSearchFilter('custrecord_lotitem', null, 'is', relid));
				
				var columns = new Array();
				columns.push(new nlobjSearchColumn('custrecord_rotation_item_units_available'));
				columns.push(new nlobjSearchColumn('custrecord_rotation_polineunits'));
				columns.push(new nlobjSearchColumn('custrecord_rotation_ordertype'));
				columns.push(new nlobjSearchColumn('custrecord_rotation_owcstatus'));
				
				var rotsearch = nlapiSearchRecord('customrecord_rotation', null, filters,columns);// Make the search
				
				var qty = 0;
				var casesize = "";
				var dtyStatus = "";
				var cond = "";
				if(rotsearch && rotsearch.length) {
					for(var j = 0; j < rotsearch.length; j++) {
						if(rotsearch[j].getValue('custrecord_rotation_item_units_available'))
							qty += parseInt(rotsearch[j].getValue('custrecord_rotation_item_units_available'));
					
						if(!casesize)
							casesize = rotsearch[j].getText('custrecord_rotation_polineunits');
							
						if(!dtyStatus) {
							dtyStatus = rotsearch[j].getText('custrecord_rotation_ordertype');
							
							cond = rotsearch[j].getText('custrecord_rotation_owcstatus');
						}
					}
					
				}
				
				if(qty > 0) {
					var avl = 'In Stock';	
				} else {
					var avl = 'Out of Stock';	
				}
				
				if(qty==0) qty = '';
				
				
				var itemPrice = relrecord.getLineItemMatrixValue('price1', 'price', 1, 1);
				var multiple = 1;
				if(casesize && !casesize.match("Case")){
					x=casesize.split(" ");
					bottlesize=x[1]+" cl";
				}

				if(casesize && casesize.indexOf(' x ') != -1) {
					
					x = casesize.match(/[\d\.]+/g);
					bottlesize=x[1]+" cl";	
					
					multiple = x[0];
										
				}
				newprice = itemPrice * multiple;
				if(!casesize) casesize = "";
				
				img = '/core/media/media.nl?id=2398&c=1336541&h=3f8fd85eb9a0688dde6a';
				
				if(relrecord.getFieldValue('storedisplayimage')) {
					 var f = nlapiLoadFile(relrecord.getFieldValue('storedisplaythumbnail')); 	
					 img = f.getURL();
				}
	
					
					content += '<td>'+ relrecord.getFieldText("custitem_colour") +'</td><td>'+ relrecord.getFieldText("custitem_item_vintage") +'</td><td style="display:none;"> '+ relrecord.getFieldText("custitem_item_region")  +'</td><td>'+ relrecord.getFieldText("custitem_item_name") + (relrecord.getFieldValue("custitem_item_grower")==''?'': ' ' + relrecord.getFieldText("custitem_item_grower")) +'</td><td>£'+ formatCurrency(Math.round(newprice.toFixed(2)))+".00"+'</td><td>'+ relrecord.getFieldText("saleunit")+'</td><td>'+dtyStatus+'</td><td>'+avl+'</td><td>'+qty+'</td><td>' + cond + '</td><td>'+(relrecord.getFieldValue("custitem_scoreshown")==""?'': relrecord.getFieldText("custitem_scoreshown"))+'</td><td  class="buy-now-cont"><a id="'+relid+'" href="http://shopping.netsuite.com/s.nl/c.1336541/id.'+relid+'/.f?i=A" class="call-to-action_button_search" >VIEW</a></td>';
					
					
				content += "</tr>";
				content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>'+casesize+'</li><li>&nbsp;'+ relrecord.getFieldText("custitem_maturity")+'</li><li>'+ relrecord.getFieldText("custitem_item_vintage")+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+ relrecord.getFieldText("custitem_country") +' > '+ relrecord.getFieldText("custitem_item_region")  +' > '+relrecord.getFieldText("custitem_item_appellation") +'</li><li>'+(relrecord.getFieldValue("custitem_item_grower")==''?'&nbsp;': relrecord.getFieldText("custitem_item_grower"))+'</li></ul></div></div></div></td></tr>';
			}
		}
		
		
		content += "</tbody>";
		content += "</table></div>";
	}
	
	response.write(content);
}

function loadItem(itemId) {
        try {   
                itemRecord = nlapiLoadRecord('inventoryitem', itemId);
        } catch(SSS_RECORD_TYPE_MISMATCH) {   
				try {   
						itemRecord = nlapiLoadRecord('kititem', itemId);
				} catch(SSS_RECORD_TYPE_MISMATCH) { 		
						try {   
								itemRecord = nlapiLoadRecord('noninventoryitem', itemId);
						} catch(SSS_RECORD_TYPE_MISMATCH) {     
								try {
										itemRecord = nlapiLoadRecord('discountitem', itemId);
								} catch(SSS_RECORD_TYPE_MISMATCH) {
										try {
												itemRecord = nlapiLoadRecord('assemblyitem', itemId);
										} catch(SSS_RECORD_TYPE_MISMATCH) {
												try {
													itemRecord = nlapiLoadRecord('serviceitem', itemId);
												} catch(SSS_RECORD_TYPE_MISMATCH) {
														try {
															itemRecord = nlapiLoadRecord('descriptionitem', itemId);
														} catch(e) {
																return "";
														}
												}
										}
								}
						}
				}
        }

        return itemRecord;
}
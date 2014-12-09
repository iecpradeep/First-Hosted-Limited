var color = new Array();
	color['Red'] = '0';
	color['White'] = '1';
	color['Rose'] = '2';

//llama a la busqueda de items y dibuja la estructura principal de la pagina
function clientsReserves(params)
{
	cid = params.getParameter("cid");
	var myshort=request.getParameter('myshort');//para acortar.
	if(!cid) cid = 0; 
	var filters = new Array();
	
	filters.push(new nlobjSearchFilter('custrecord_parent_customer', null, 'is', cid));
	itemsList = nlapiSearchRecord('customrecord_sold_items_storage', 59, filters, null);

	if(itemsList != null && itemsList != undefined)
	{
		mycount=itemsList.length;
		if(itemsList.length>25 && myshort==1) mycount=25;
	var generatePDFUrl = "https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=59&deploy=1&compid=1336541&h=9f0a0095e0e901ca48b8&cid="+cid;
	//var generateCSVUrl = "http://66.147.244.155/~greendr2/vendornet-opensky/toexcel.php?cid="+cid;
	var generateCSVUrl = "https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=60&deploy=1&compid=1336541&h=65e6ec98d31490b4b04a&cid="+cid;
	var content = "";
	//content += "<tr><td align='right'><a href='#' onclick='popitup("+'"'+generatePDFUrl+'"'+")'><img src='https://checkout.netsuite.com/c.1336541/site/images/mywines-pdf-icon.gif' border='0'></a> &nbsp; <a href='#' onclick='popitup("+'"'+generateCSVUrl+'"'+")'><img src='https://checkout.netsuite.com/c.1336541/site/images/mywines-excel-icon.gif' border='0'></a></td></tr><tr>";
	content += "<tr><td>";
	//content += "<br/><br/>";
	content += "<span class='inew' width='8px' height='10px' style='padding-left:15px;margin-right:10px'>New!</span><span class='staffreco' width='8px' height='10px' style='padding-left:15px'>Staff Pick</span><span class='plus-ico' width='10px' height='10px' style='padding-left:15px'>Click on plus mark to see full descriptions</span><div id='linksStock1'><img src='/site/images/downloadStocklist-img.jpg'><a id='stockexcel' href='#' onclick='popitup("+'"'+generateCSVUrl+'"'+")'><img src='/site/images/excel-icon.jpg'></a><a id='stockpdf' href='#' onclick='popitup("+'"'+generatePDFUrl+'"'+")'><img src='/site/images/pdf-icon.jpg'></a><img src='/site/images/downloadStocklist-img1.jpg'></div>";
	content += "<br/><br/><br/>";
	//dibuja el paginador para ir para la pagina anterior y la proxima pagina
	/*if(itemsList != null && itemsList != undefined)
	{*/
		if(myshort!=1)content += writePagination(itemsList);
	//}	
	content += "</td></tr>";
	content += "<tr><a href='#' id='result' ></a></tr>";
	
		
		content += "<tr><td>";
		content += '<div class="description_modules hide-border">';
		
		content += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
		content += '<thead><tr class="tasting-table-title"><th style="width:20px"></th><th class="trigger-also-like_btn_width"></th><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th style="display:none">Region</th><th class="wine-name_width" style="width:100px;">Wine Name</th><th class="grower_width" style="width:50px;">Grower</th><th class="price_width">Price Paid</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Date In</th><th class="quantity_width">Stock</th><th class="availability_width">Rotation</th><th class="availability_width" style="width:70px;">OWC Status</th></tr></thead><tbody>';
		//dibuja los items
		var currentRegion = "";
		
		for(var i = 0; i < mycount; i++) {
			var columns = itemsList[i].getAllColumns();
			rowcolor =  (i%2==1)?'zebra':'data_product-rotations';
			
			if(i > 24)
			{		
				
				
				content += "<tr id='" + i + "' style='display:none'  class='list-items-row "+rowcolor+"'>";
			}
			else
			{
				/*if(itemsList[i].getValue(columns[2]) != currentRegion) {
					currentRegion = itemsList[i].getValue(columns[2]);
					content += "<tr id='r-"+i+"' class='regionseparator'><td align='left' colspan='12' style='color:red;font-weight:bold;text-align:left'>"+itemsList[i].getText(columns[3])+ ' > '+itemsList[i].getText(columns[2]) +"</td></tr>";
				}	*/
				content += "<tr id='" + i + "' class='list-items-row "+rowcolor+"'>";
			}			
			content += "<td class='icon-cont'><input type='checkbox' id='check_"+i+"' name='selectedItems' value='"+itemsList[i].getValue(columns[0])+"'></td>";
			content += "<td align='left' style='text-align:left;white-space:nowrap'  ><span id='plus-" + i + "'  class='plus plused' width='8px' height='10px'></span><span class='inew' width='8px' height='10px' style='inew'></span><span class='staffreco' width='11px' height='10px' style='staffreco'></span></td>";
			
		
				var uom = itemsList[i].getText(columns[6]);
  				
				if(uom && !uom.match("Case")){
					x=uom.split(" ");
					bottlesize=x[1]+" cl";	
					caseSize="";			
				}

				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
					bottlesize=x[1]+" cl";	
					caseSize=itemsList[i].getText(columns[6])
										
				}
			/*if(itemsList[i].getValue(columns[7]) > 0) {
				var avl = 'In Stock';	
			} else {
				var avl = 'Out of Stock';	
			}*/
			img = itemsList[i].getValue(columns[20]);
			if(!img)
				img = '/core/media/media.nl?id=2398&c=1336541&h=3f8fd85eb9a0688dde6a';
			try
			{
				/*var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));				
				if(record.getFieldValue('storedisplayimage')) {
					var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					img = f.getURL();
				}
*/
				var itemPrice = itemsList[i].getValue(columns[18]);
			/*	var multiple = 1;
				var uom = itemsList[i].getText(columns[6]);
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
				newprice = itemPrice * multiple;*/
				
				content += '<td class="color-col">'+ itemsList[i].getText(columns[12]) +'</td><td class="vintage-col">'+ itemsList[i].getText(columns[4]) +'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td class="winename-col">'+ itemsList[i].getText(columns[14]) +'</td><td class="grower-col">'+ (itemsList[i].getValue(columns[11])==''||itemsList[i].getValue(columns[11])==88?'': itemsList[i].getText(columns[11])) +'</td><td class="price-col">&pound;'+itemPrice+'</td><td class="format-col">'+(itemsList[i].getValue(columns[6])==""?' ':itemsList[i].getText(columns[6]))+'</td><td class="dutystatus-col">'+(itemsList[i].getValue(columns[13])==""?' ':itemsList[i].getText(columns[13]))+'</td><td class="avl-col">'+itemsList[i].getValue(columns[15])+'</td><td class="qty-col">'+itemsList[i].getValue(columns[7])+'</td><td class="avl-col rot-col">'+itemsList[i].getValue(columns[16])+'</td><td class="avl-col buy-now-cont stat-col">'+(itemsList[i].getValue(columns[17])==""?' ':itemsList[i].getText(columns[17]))+'</td>';				
			}
			catch(e)
			{				
				//content += '<td class="color-col">'+ itemsList[i].getText(columns[13]) +'</td><td class="vintage-col">'+ itemsList[i].getValue(columns[5]) +'</td><td style="display:none;"> '+itemsList[i].getText(columns[2]) +'</td><td class="winename-col">'+ itemsList[i].getText(columns[15])+ (itemsList[i].getValue(columns[12])==''?'': ' ' + itemsList[i].getText(columns[12])) +'</td><td class="price-col">&pound;'+itemsList[i].getValue(columns[4])+'</td><td  class="color-col">'+itemsList[i].getValue(columns[7])+'</td><td class="dutystatus-col">'+(itemsList[i].getValue(columns[14])==''?'':itemsList[i].getText(columns[14]))+'</td><td class="avl-col>'+avl+'</td><td class="qty-col">'+itemsList[i].getValue(columns[8])+'</td><td class="cndtn-col">TBD</td><td class="score-col">'/*+(itemsList[i].getValue(columns[17])==''?'':itemsList[i].getText(columns[17]))*/+'</td><td class="score-col"></td>';
			}
			
			content += "</tr>";
			content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="12" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><ul><li><strong>Bottle Size:</strong></li><li><strong>Case Size:</strong></li><li><strong>Maturity:</strong></li><li><strong>Vintage:</strong></li></ul><ul class="detailsval"><li>('+bottlesize+')</li><li>'+caseSize+'</li><li>'+itemsList[i].getText(columns[10])+'</li><li>'+itemsList[i].getText(columns[4])+'</li></ul></div><div class="right-details"><ul><li><strong>Origin:</strong></li><li><strong>Producer:</strong></li><li>Conditions apply</li></ul><ul class="detailsval"><li>'+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > '+(itemsList[i].getValue(columns[19])==''?'&nbsp;':itemsList[i].getText(columns[19]))+'</li><li>'+(itemsList[i].getValue(columns[11])==''?'&nbsp;':itemsList[i].getText(columns[11]))+'</li></ul></div></div></div></td></tr>';
			if(itemsList[i].getValue(columns[2]) != currentRegion) {
				currentRegion = itemsList[i].getValue(columns[2]);
				content += "<tr id='r-"+i+"' class='regionseparator' style='display:none'><td align='left' colspan='12' style='color:red;font-weight:bold;text-align:left'>"+itemsList[i].getText(columns[3])+ ' > '+itemsList[i].getText(columns[2]) +"</td></tr>";
			}	
			//content += '<tr class="selected detailsrow"  id="moreInfo-' + i + '" style="display:none"><td align="left" colspan="13" ><div class="togle selected detailsrow"  ><div class="img-togle"><img src="'+img+'" /></div><div class="details"><div class="title">Product Details</div><div class="left-details"><strong>Bottle Size:</strong> ('+bottlesize+')<br /><strong>Case Size:</strong> TBD<br /><strong>Maturity:</strong> '+itemsList[i].getText(columns[11])+'<br /><strong>Vintage: </strong> '+itemsList[i].getText(columns[5]) +'</div><div class="right-details"> <strong>Origin:</strong> '+itemsList[i].getText(columns[3]) +' > '+itemsList[i].getText(columns[2]) +' > TBD<br /><strong>Producer:</strong> '+(itemsList[i].getValue(columns[12])==''?'':itemsList[i].getText(columns[12]))+'<br />Conditions apply </div></div></div></td></tr>';
		}		
		content += "</tbody>";
		content += "</table>";
	
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
			if(myshort!=1) content += writePagination(itemsList);
		}	
		content += "</td></tr>";	
		
		content += "<tr><td>&nbsp;</td></tr>";
		content += "<tr align='left'><td align='right'><input type='button' id='sell' style='color:#414042 !important;' value='Sell'></td></tr>";
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
	content += "<option value='25' selected>25</option>";
	content += "<option value='50'>50</option>";
	content += "<option value='100'>100</option>";	
	content += "</select></div>";
	content += "</div>";
	return content;
}


function  SendEmail(params, response){
	var author = "-5"; //email from
	var recipient = "info@lhkwines.com"; //email to
	//recipient = "berly88@gmail.com";
	var itemIds = params.getParameter('itemIds');
	var clientEmail = params.getParameter('clientEmail');
	var clientName = params.getParameter('clientName');
	nlapiLogExecution('ERROR', 'itemIds', itemIds);	
	var subject = "Client Reserves";
	var emailBody = "<table width='781' border='0' style='font-family:verdana; font-size:8pt;'><tr><td colspan='4' style='font-family:verdana; font-size:11pt; font-weight:bold'>Inquiry from "+ clientName +" (" + clientEmail +")</td></tr></table><br><br>";
	
	emailBody += '<style>body{font-family:Tahoma, Verdana, Geneva, sans-serif;font-size:11px;color:#414042;	list-style:none;list-style-type:none;} table.product-list-items td, table.product-list-items th{padding: 8px 0px 8px 4px;text-align:center;}table.product-list-items th {color:#8e194d;font-weight:normal;font-family:Tahoma, Verdana, Geneva, sans-serif;font-size:11px;}table.product-list-items .call-to-action_button{position:relative;top:-4px;}.img-togle{float:left;padding-left:26px;}.img-togle img{width:77px;margin-right:15px;height:77px;}.selected{background:#e2e3e5;}.togle.selected{background:#e2e3e5;margin-left:-4px;float:left;width:100%;padding:0px 0px 10px 4px;position:relative;}.list-items-row td{padding:10px 0 5px 4px !important;font-size:11px;}.details{float:left;text-align:left;line-height:17px;width:auto;}.left-details{float:left;display:block;width:auto;margin-right:21px;}.right-details{float:left;display:block;width:auto;}.details .title{color: #8E194D;float: left;width: 100%;position:relative;top:-3px;line-height:normal;margin-bottom:2px;}.tasting-table-title, .product-table-title, .product-rotations-title{background:#ffcd32;padding:10px;}.tasting-table-title td, .product-rotations-title td{color:#8e194d;}</style>';
	emailBody += '<table cellpadding="0" cellspacing="0" class="product-list-items tablesorter" id="myTable">';
	emailBody += '<tr class="tasting-table-title"><th class="colour_width">Colour</th><th class="vintage_width" >Vintage</th><th class="wine-name_width">Wine Name</th><th class="wine-name_width">Grower</th><th class="price_width">Price Paid</th><th class="format_width">Format</th><th class="duty-status_width">Duty Status</th><th class="availability_width">Date In</th><th class="quantity_width">Qty</th><th class="condition_width" style="display:none">Condition</th><th class="availability_width">Rotation</th><th class="availability_width">OWC Status</th></tr>';
	msg = "ok";
	itemRows = itemIds.split('*');
	
	if(itemRows.length > 1) {
		for(i=1; i < itemRows.length; i++) {
			try {
				//nlapiLogExecution('ERROR', 'itemid', itemIds[i]);
				columns = itemRows[i].split(',');
				
				for(j=0; j < columns.length; j++) {
					if(columns[j]) {
						columns[j] = columns[j].replace(/comma/g,',');
					}
				}
				rowcolor =  (i%2==1)?'style="background:#f3f3f4"':'style="background:#ffffff"';
				emailBody += '<tr class="list-items-row" '+rowcolor+'><td>'+ columns[1] +'</td><td>'+ columns[2] +'</td><td> '+columns[3]  +'</td><td> '+columns[13]+'</td><td>'+ columns[4] +'</td><td>'+columns[5]+'</td><td>'+columns[6]+'</td><td>'+columns[7]+'</td><td>'+columns[8]+'</td><td style="display:none">'+columns[9]+'</td><td>'+columns[11]+'</td><td>'+columns[12]+'</td></tr>';
				
			} catch (e) {
				msg="notok";
				nlapiLogExecution('ERROR', 'sending client reserve email', e);	
				break;
			}
		}
	}
	
	emailBody += "</table>";
	if(msg == "ok") {
		try{
			nlapiSendEmail(author, recipient, subject, emailBody);
		} catch (e) {
			msg="notok";
			nlapiLogExecution('ERROR', 'sending client reserve email', e);
		}
	}
	response.write(msg);
}

function GeneratePDF(params)
{
	cid = params.getParameter("cid");
	
	if(!cid) cid = 0;
	customer = "";
	if(cid) customer =  nlapiLookupField('customer', cid, 'firstname')+ ' ' +nlapiLookupField('customer', cid, 'lastname');
	if(cid && !customer.replace(/\s/g,'').length) customer = nlapiLookupField('customer', cid, 'companyname');
	var email = "<body style='font-family:Tahoma, Verdana, Geneva, sans-serif;color:#414042;	list-style:none;list-style-type:none;'>";
	email += "<table style='margin:20px 0 20px 0;width: 100%;text-align: center;' border='0'><tr><td><img src='http://shopping.netsuite.com/c.1336541/site/images/LHK-banner-clientreserves.jpg'/></td><td align='right' valign='middle' style='padding-top:30px'>Client Reserves - "+customer+"</td></tr></table>";
	//email += "<table><tr><td><strong>Client Reserves Report</strong></td></tr></table>";
	email += "<table style='margin:20px 0 20px 0;font-size: 8pt;width: 100%;text-align: center;' border='0' id='tableitems'>";
	email += "<thead><tr>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='40'>Colour</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='40' >Vintage</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='70'>Wine Name</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='35'>Grower</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='40' >Price Paid</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;'>Format</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Duty Status</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Date In</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Qty</th>";
	
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Rotation</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >OWC Status</th>";
	//email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Score</th>";
	email += "</tr></thead><tbody>";
	
	//nlapiLogExecution('ERROR', 'cid',cid);
	var filters = new Array();
	filters.push(new nlobjSearchFilter('custrecord_parent_customer', null, 'is', cid));
	itemsList = nlapiSearchRecord('customrecord_sold_items_storage', 59, filters, null);
	
	if(itemsList) {
		var cols = itemsList[0].getAllColumns();
		/*function callbackFunc(a,b){
			//nlapiLogExecution('DEBUG', 'sort ', a.getValue('custitem_item_region'));
			
			//country
			//if(a.getText(cols[3]) == b.getText(cols[3])){
			//region
				if(a.getValue(cols[20]) == b.getValue(cols[20])){
			
					//appellation
					//if(a.getText(cols[14]) == b.getText(cols[14])){
						//color
						if(color[a.getText(cols[7])] == color[b.getText(cols[7])]){
							
							//vintage
							if(a.getText(cols[4]) == b.getText(cols[4])){
								
								//winename
								if(a.getText(cols[1]) == b.getText(cols[1])){
									return 0;
								}
								
								return (a.getText(cols[1])  < b.getText(cols[1])) ? -1 : 1;
							}
							return (a.getText(cols[4])  > b.getText(cols[4])) ? -1 : 1;
						}
						
						return (color[a.getText(cols[7])]  < color[b.getText(cols[7])]) ? -1 : 1;
				//	}
					
				//	return (a.getText(cols[14])  < b.getText(cols[14])) ? -1 : 1;
				}
			
				return (a.getValue(cols[20]) - b.getValue(cols[20]));
			//}
//			return (a.getText(cols[3])  < b.getText(cols[3])) ? -1 : 1;
		}
		itemsList.sort(callbackFunc);*/
		var currentRegion = "";
		for(var i = 0; i < itemsList.length; i++) {
			var columns = itemsList[i].getAllColumns();
			//nlapiLogExecution('ERROR', 'itemsList',itemsList[i].getId());
			rowcolor =  (i%2==1)?'#ffffff;':'#f3f3f4;';
			var uom = itemsList[i].getText(columns[6]);
  				
			if(uom && !uom.match("Case")){
				x=uom.split(" ");
				bottlesize=x[1]+" cl";	
				caseSize="";			
			}

			if(uom && uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
				bottlesize=x[1]+" cl";	
				caseSize=itemsList[i].getText(columns[6])
									
			}
			if(itemsList[i].getValue(columns[7]) > 0) {
				var avl = 'In Stock';	
			} else {
				var avl = 'Out of Stock';	
			}
			
			try
			{
				/*var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));				
				if(record.getFieldValue('storedisplayimage')) {
					 var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					img = f.getURL();
				}*/
				var itemPrice = itemsList[i].getValue(columns[18]);
			/*	var multiple = 1;
				var uom = itemsList[i].getText(columns[6]);
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
				newprice = itemPrice * multiple;*/
				if(itemsList[i].getValue(columns[2]) != currentRegion) {
					currentRegion = itemsList[i].getValue(columns[2]);
					email += "<tr><td colspan='10' style='color:red;font-weight:bold;'>"+itemsList[i].getText(columns[3])+ ' > '+itemsList[i].getText(columns[2]) +"</td></tr>";
				}				
				email += "<tr style='background-color:"+rowcolor+";' align='center'><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+ itemsList[i].getText(columns[12]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+ itemsList[i].getText(columns[4]) +"</td><td style='display:none;'> "+itemsList[i].getText(columns[2]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color:"+rowcolor+";vertical-align:middle;height:25px;font-size:8pt;'><p text-align='center' align='center'>"+ itemsList[i].getText(columns[14]) +"</p></td><td align='center' style='color: #414042;padding: 4px;background-color:"+rowcolor+";vertical-align:middle;height:25px;font-size:8pt;'><p text-align='center' align='center'>"+ (itemsList[i].getValue(columns[11])==''?'': itemsList[i].getText(columns[11])) +"</p></td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>&pound;"+itemPrice+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;white-space:nowrap'>"+(itemsList[i].getValue(columns[6])==""?' ':itemsList[i].getText(columns[6]))+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;white-space:nowrap'>"+(itemsList[i].getValue(columns[13])==""?' ':itemsList[i].getText(columns[13]))+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;;'>"+itemsList[i].getValue(columns[15])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+itemsList[i].getValue(columns[7])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;;'>"+itemsList[i].getValue(columns[16])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;;'>"+(itemsList[i].getValue(columns[17])==""?' ':itemsList[i].getText(columns[17]))+"</td></tr>";	
				
			}
			catch(e)
			{				
				//email += "<tr  style='background-color:#F0F0F6;'><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align:middle;height:25px;font-size:8pt;'>"+ itemsList[i].getText(columns[13]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+ itemsList[i].getValue(columns[5]) +"</td><td style='display:none;'> "+itemsList[i].getText(columns[2]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+ itemsList[i].getText(columns[15]) + (itemsList[i].getValue(columns[12])==''?'': ' ' + itemsList[i].getText(columns[12])) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>&pound;"+itemsList[i].getValue(columns[4])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+itemsList[i].getValue(columns[7])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;;'>"+(itemsList[i].getValue(columns[14])==''?'':itemsList[i].getText(columns[14]))+"</td><td align='center' style='color: #414042;padding:4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;;'>"+avl+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+itemsList[i].getValue(columns[8])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>TBD</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>"+/*(itemsList[i].getValue(columns[17])==''?'':itemsList[i].getText(columns[17]))+*/"</td></tr>";
			}
		}
	}
	email += "<tr><td colspan='5'></td></tr>";
	email += "</tbody></table>";
	email += "</body>";
	
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n"+email+"\n</pdf>";
	var file = nlapiXMLToPDF( xml );
	
	response.setContentType('PDF','Client Reserves Report - '+customer+'.pdf');
	response.write( file.getValue() );	
}

function GenerateCSV(params)
{

    var retObj = new Object();
	cid = params.getParameter("cid");
	
	if(!cid) cid = 0;
	customer = "";
	if(cid) customer =  nlapiLookupField('customer', cid, 'firstname')+ ' ' +nlapiLookupField('customer', cid, 'lastname');
	if(cid && !customer.replace(/\s/g,'').length) customer = nlapiLookupField('customer', cid, 'companyname');
	var email = "<html><body style='font-family:Tahoma, Verdana, Geneva, sans-serif;color:#414042;	list-style:none;list-style-type:none;'><table><tr><td><img src='http://shopping.netsuite.com/c.1336541/site/images/LHK-banner-clientreserves.jpg'/></td>";
	email += "<td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><th align='right' valign='middle' style='padding-top:30px'>Client Reserves - "+customer+"</th></tr><tr><td></td></tr></table>";
	email += "<table><tr><td></td></tr><tr><td></td></tr><tr><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><td></td><th></th></tr><tr><td></td></tr><tr><td></td></tr><tr><td></td></tr></table>";
	//email = "<html><body style='font-family:Tahoma, Verdana, Geneva, sans-serif;color:#414042;	list-style:none;list-style-type:none;'><table style='margin:20px 0 20px 0;width: 80%;' border='0'><tr><td><img src='http://shopping.netsuite.com/c.1336541/site/images/LHK-banner-clientreserves.jpg'/></td><td align='right' valign='middle' style='padding-top:30px; font-weight:bold;'>Client Reserves - "+customer+"</td></tr></table>";
	email += "<table style='margin:20px 0 20px 0;font-size: 8pt;width: 80%;text-align: center;' border='0' id='tableitems'>";
	email += "<thead><tr>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;'>Colour</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='70' >Vintage</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Wine Name</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Grower</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' width='70' >Price Paid</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;'>Format</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Duty Status</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Date In</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Qty</th>";
	
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Rotation</th>";
	email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >OWC Status</th>";
	//email += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Score</th>";
	email += "</tr></thead><tbody>";
	
	//nlapiLogExecution('ERROR', 'cid',cid);
	var filters = new Array();
	filters.push(new nlobjSearchFilter('custrecord_parent_customer', null, 'is', cid));
	itemsList = nlapiSearchRecord('customrecord_sold_items_storage', 59, filters, null);
	
	if(itemsList) {
		var cols = itemsList[0].getAllColumns();
		/*function callbackFunc(a,b){
			//nlapiLogExecution('DEBUG', 'sort ', a.getValue('custitem_item_region'));
			
			//country
			//if(a.getText(cols[3]) == b.getText(cols[3])){
			//region
				if(a.getValue(cols[20]) == b.getValue(cols[20])){
			
					//appellation
					//if(a.getText(cols[14]) == b.getText(cols[14])){
						//color
						if(color[a.getText(cols[7])] == color[b.getText(cols[7])]){
							
							//vintage
							if(a.getText(cols[4]) == b.getText(cols[4])){
								
								//winename
								if(a.getText(cols[1]) == b.getText(cols[1])){
									return 0;
								}
								
								return (a.getText(cols[1])  < b.getText(cols[1])) ? -1 : 1;
							}
							return (a.getText(cols[4])  > b.getText(cols[4])) ? -1 : 1;
						}
						
						return (color[a.getText(cols[7])]  < color[b.getText(cols[7])]) ? -1 : 1;
				//	}
					
				//	return (a.getText(cols[14])  < b.getText(cols[14])) ? -1 : 1;
				}
			
				return (a.getValue(cols[20]) - b.getValue(cols[20]));
			//}
//			return (a.getText(cols[3])  < b.getText(cols[3])) ? -1 : 1;
		}
		itemsList.sort(callbackFunc);*/
		var currentRegion = "";
		for(var i = 0; i < itemsList.length; i++) {
			var columns = itemsList[i].getAllColumns();
			//nlapiLogExecution('ERROR', 'itemsList',itemsList[i].getId());
			rowcolor =  "";
			var uom = itemsList[i].getText(columns[6]);
  				
			if(uom && !uom.match("Case")){
				x=uom.split(" ");
				bottlesize=x[1]+" cl";	
				caseSize="";			
			}

			if(uom && uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
				bottlesize=x[1]+" cl";	
				caseSize=itemsList[i].getText(columns[6])
									
			}
			if(itemsList[i].getValue(columns[7]) > 0) {
				var avl = 'In Stock';	
			} else {
				var avl = 'Out of Stock';	
			}
			
			try
			{
				/*var record = nlapiLoadRecord('inventoryitem', itemsList[i].getValue(columns[0]));				
				if(record.getFieldValue('storedisplayimage')) {
					 var f = nlapiLoadFile(record.getFieldValue('storedisplayimage')); 	
					img = f.getURL();
				}*/
				var itemPrice = itemsList[i].getValue(columns[18]);
			/*	var multiple = 1;
				var uom = itemsList[i].getText(columns[6]);
				if(uom && uom.indexOf(' x ') != -1) {
					
					x = uom.match(/[\d\.]+/g);
					multiple = x[0];
				
				}
				newprice = itemPrice * multiple;*/
				if(itemsList[i].getValue(columns[2]) != currentRegion) {
					currentRegion = itemsList[i].getValue(columns[2]);
					email += "<tr><td align='left' colspan='10' style='color:red;font-weight:bold;text-align:left'>"+itemsList[i].getText(columns[3])+ ' > '+itemsList[i].getText(columns[2]) +"</td></tr>";
				}			
				email += "<tr style='background-color:"+rowcolor+";'><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+ itemsList[i].getText(columns[12]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+ itemsList[i].getText(columns[4]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color:"+rowcolor+";vertical-align:middle;height:25px;fon-size:11px;'>"+ itemsList[i].getText(columns[14]) +"</td><td align='center' style='color: #414042;padding: 4px;background-color:"+rowcolor+";vertical-align:middle;height:25px;fon-size:11px;'>"+ (itemsList[i].getValue(columns[11])==''?'': itemsList[i].getText(columns[11])) +"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>&pound;"+itemPrice+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+(itemsList[i].getValue(columns[6])==""?' ':itemsList[i].getText(columns[6]))+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+(itemsList[i].getValue(columns[13])==""?' ':itemsList[i].getText(columns[13]))+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+itemsList[i].getValue(columns[15])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+itemsList[i].getValue(columns[7])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+itemsList[i].getValue(columns[16])+"</td><td align='center' style='color: #414042;padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;fon-size:11px;'>"+(itemsList[i].getValue(columns[17])==""?' ':itemsList[i].getText(columns[17]))+"</td></tr>";	
				
			}
			catch(e)
			{				
			}
		}
	}
	email += "</tbody></table>";
	email += "</table></body></html>";
	/*var params = new Array();   
	params['filename'] = escape('Client Reserves - ' + customer); 
	params['body'] =email; 
	var r = nlapiSetRedirectURL("EXTERNAL",'http://greendrakepartners.com/vendornet-opensky/toexcel.php','',false, params); */
	response.setContentType('HTMLDOC','Client Reserves - ' + customer + '.xls');	
	response.write(email);
	
}

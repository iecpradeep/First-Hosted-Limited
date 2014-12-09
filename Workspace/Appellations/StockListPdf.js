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
	
/**
 * Example Data
 * var options = new Object(); // Object of configuration 
 * options.columns = new Array(); // Array of search columns (NS)
 * options.columnFrom = 'internalid'; // Column where the data is gone to be taked (must be at the columns array)
 * var c = new nlobjSearchColumn(options.columnFrom); 
 * c.setSort();
 * options.columns.push(c); 
 * options.columns.push(new nlobjSearchColumn('companyname'));
 * options.filters = new Array(); // Array of search filters (NS)
 * options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
 * options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied
 * options.resultColumns = ['internalid', 'companyname']; // names for the object where the data is gone to be placed, if have less titles uses the  
 * options.restrictType = 'customer'; // If the search have diferent types, you can get the one you put here.
 * var rows = loadRows('customer', options); // Make the search
 */

/**
 * Other magic from SMart
 */
 //carga todos los items de un sitio y hace una llamada recursiva para superar la restriccion de 1000 items impuesta por netsuite
function loadRows(recordType, options, saveSearchId, fromNextId){
        var defaultOptions = { columns: [], filters: [], columnSorted: '', restrictType: false, resultColumns: [] };
//nlapiLogExecution('DEBUG', 'loadRows ', fromNextId);
        if(saveSearchId == undefined)
                saveSearchId = null;

        if(options == undefined || options == null){
                options = defaultOptions;
        } else {
                for(var option in defaultOptions){
                        if(options[option] == undefined || options[option] == null)
                                options[option] = defaultOptions[option];
                }
        }

        if(fromNextId == undefined || fromNextId == null)
                fromNextId = false;

        if(fromNextId && options.columnSorted != '')
                options.filters.push(new nlobjSearchFilter(options.columnSorted, null, 'greaterthan', fromNextId));

        var search = nlapiSearchRecord(recordType, saveSearchId, options.filters);

        if(fromNextId && options.columnSorted != '')
                options.filters.pop();

        var rowsList = new Array();

        if(search){
            var lastId = '';
            var countSearch = search.length;
            for(var i = 0; i < countSearch; i++){
                var listCols = search[i].getAllColumns();
                var row =  search[i];
        
                if(options.restrictType){
                    if(search[i].getRecordType() == options.restrictType)
                        rowsList.push(row);
                } else {
                    rowsList.push(row);
                }
                if(options.columnSorted != ''){
					if(saveSearchId != null)
                        lastId = search[i].getValue(listCols[0]); 
                    else
                        lastId = search[i].getValue(options.columnFrom);
				}
				//lastId = search[i].getValue(options.columnFrom);
            }
            if(countSearch == 1000 && lastId != ''){
				rowsList = rowsList.concat(loadRows(recordType, options, saveSearchId, lastId));
            }
        }
        return rowsList;
}
//llama a la busqueda de items y dibuja la estructura principal de la pagina
function stockList(params)
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
	options.filters = new Array(); // Array of search filters (NS)
	options.filters.push(new nlobjSearchFilter('isinactive', null, 'is', 'F'));
	var filters=request.getParameter('filters');//obtiene los nombres de los filtros
	if(filters)
		var arrfilters=filters.split("*");//separa el string con los nombres de los filtros con *
	var values=request.getParameter('values');//obtiene los valores de los filtros
	if(values)
		var arrValues=values.split("*");//separa el string con el valor de los filtros con *
	var myshort=request.getParameter('myshort');//para acortar.

	for(i=0;arrValues && i<arrValues.length-1;i++){//recorre los filtros y los valores y crea un filtro por cada uno que encuentra
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
	var context = nlapiGetContext();
	
	options.columnSorted = 'internalidnumber'; // Column where the filter is gone to be applied
	options.resultColumns = ['internalid', 'name', 'custitem_item_region', 'custitem_country', 'custitem_item_vintage', 'custitem1', 'saleunit', 'custitem_colour','custitem_dutystatus', 'custitem_item_grower', 'custitem_scoreshown', 'custitem_quantityonhand', 'price', 'image']; // names for the object where the data is gone to be placed, if have less titles uses the  
	options.restrictType = false;
	//var itemsList = loadRows('item', options, 68); // Make the search
	var itemsList = nlapiSearchRecord('item', 68, options.filters, null);
	var cols = itemsList[0].getAllColumns();
	var color = new Array();
	color['Red'] = '0';
	color['White'] = '1';
	color['Rose'] = '2';
	
	
	
	
	function callbackFunc(a,b){
		//nlapiLogExecution('DEBUG', 'sort ', a.getValue('custitem_item_region'));
		
		//country
		//if(a.getText(cols[3]) == b.getText(cols[3])){
		//region sort
			if(a.getValue(cols[15]) == b.getValue(cols[15])){
		
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
		
			return (a.getValue(cols[15]) - b.getValue(cols[15]));
		//}
		//return (a.getText(cols[3])  < b.getText(cols[3])) ? -1 : 1;
	}
	itemsList.sort(callbackFunc);
	var content = "";
	var currentTime = new Date()
	var month = currentTime.getMonth() + 1;
	var day = currentTime.getDate();
	var year = currentTime.getFullYear();
	content += "<table  width='100%'><tr><td width='70%' rowspan='4'><img src='http://shopping.netsuite.com/c.1336541/site/images/LHK-banner-stocklist.jpg' /></td><td width='30%' align='right' style='color:#666666;font-size:9pt;text-align:right;font-family: Tahoma,Geneva,sans-serif;font-weight:bold;'>"+day + "/" +  month+ "/" + year+"</td></tr><tr><td style='color:#666666;font-size:8pt;text-align:right;font-family: Tahoma,Geneva,sans-serif;' align='right' valign='bottom'>Tel: +44 (0) 207 872 5499</td></tr><tr><td style='color:#666666;font-size:8pt;text-align:right;font-family: Tahoma,Geneva,sans-serif;' align='right' valign='top'>info@lhkfinewines.com</td></tr><tr><td style='color:#666666;font-size:8pt;text-align:right;font-family: Tahoma,Geneva,sans-serif;' height='10px'>&nbsp;</td></tr></table>";
	//content += "<table width='100%' style='margin:20px 0' cellpadding='0' border='0'><tr style='border-top:1px solid #999;'><td></td></tr></table>";
	content += "<table width='100%' cellpadding='1' border='0' style='margin-top:30px; margin-bottom: 10px'><tr><td style='vertical-align:top; text-align:left;background-color:red;' width='10px' align='left' valign='top' height='20px'></td><td style='font-size:8pt;color:#666666;text-align:left;font-family: Tahoma,Geneva,sans-serif;vertical-align:bottom;margin-left:10px;' width='80%'  align='left' valign='middle'>New Purchases in the last 5 days</td><td style='border:1px solid #000000; font-size:8pt;color:#666666;text-align:right;font-family: Tahoma,Geneva,sans-serif;vertical-align:bottom;display:none;'  align='right' valign='bottom' width='20%'>Key to critics - click arrow to view</td></tr></table>";
	content += "<table style='font-size: 8pt;width: 100%;text-align: center;font-family: Tahoma,Geneva,sans-serif;' border='0' id='tableitems'>";
	content += "<thead><tr>";
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;'  width='6px'></th>";
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;'  width='40'>colour</th>";
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;' width='40' >vintage</th>";
	content += "<th align='left' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;'  width='60'>name</th>";
	content += "<th align='left' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;'>unit</th>";
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;' >qty</th>";
	content += "<th align='left' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000;white-space:nowrap; border-top: 1px solid #000000;border-left: 1px solid #000000;' >status</th>";
	content += "<th align='left' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;' width='40' >price</th>";
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;' width='40' >due</th>";
	//content += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Availability</th>";
	
	
	<!--content += "<th align='center' style='background-color: #ffcd32;font-size: 8pt;padding: 4px;color:#8e194d;' >Condition</th>";-->
	content += "<th align='center' style='background-color: #cccccc;font-weight:bold;font-size: 8pt;padding: 4px;color:#000000; border-top: 1px solid #000000;border-left: 1px solid #000000;border-right: 1px solid #000000;' >score</th>";
	content += "</tr></thead><tbody>";
	//dibuja los items
	
	var currentRegion = "";
		
	//DUE SOON
		var duesoonList = nlapiSearchRecord('transaction', 293) // make search
		var duesoonArr = new Array();
		if(duesoonList) {
			for(var ix = 0; ix < duesoonList.length; ix++) {
				var duesooncolumns = duesoonList[ix].getAllColumns();
				duesoonArr.push(duesoonList[ix].getValue(duesooncolumns[0]));
			}
		}
		
		
	for(var i = 0, k=0; i < itemsList.length; i++) {
		var columns = itemsList[i].getAllColumns();
		nlapiLogExecution('DEBUG', 're', context.getRemainingUsage());
		if(itemsList[i].getValue(columns[11]) > 0) {
			avl = 'In Stock';	
		}else {
			avl = '';	
		}
		
		if(itemsList[i].getValue(columns[18])) {
			delivery =   nlapiStringToDate(itemsList[i].getValue(columns[18]));
			today = new Date();
			if(delivery > today) {
				
				//avl = itemsList[i].getValue(columns[18]);
				//qty = '';
			}
		}
		
		//check if due soon
		if(avl == 'In Stock' && duesoonArr.length) {
			if(duesoonArr.indexOf(itemsList[i].getValue(columns[20])) > -1){
				//avl = "Due Soon"	
				avl = ""
			}
		}
		
		if(itemsList[i].getValue(columns[21])== 'T'  || itemsList[i].getValue(columns[22])== '4'){
			avl="EP";
		}
		
		
		if(itemsList[i].getValue(columns[2]) != currentRegion) {
			currentRegion = itemsList[i].getValue(columns[2]);
			content += "<tr  style='border-top: 1px solid #000000;border-left: 1px solid #000000;border-right: 1px solid #000000;'><td colspan='10' style='color:red;font-weight:bold;border-left: 1px solid #000000;border-right: 1px solid #000000;'>"+itemsList[i].getText(columns[3])+ ' > '+itemsList[i].getText(columns[2]) +"</td></tr>";
		}
		rowcolor =  (k%2==1)?'#ffffff;':'#f3f3f4;';
		content += "<tr id='" + i + "' style='background-color:"+rowcolor+";text-align:center;'>";

			var itemPrice =  itemsList[i].getValue(columns[12])//record.getLineItemMatrixValue('price1', 'price', 1, 1);
			if(exchangeRate != 0)
			{
				itemPrice = itemPrice * exchangeRate;
			}
			var multiple = 1;
			var uom = itemsList[i].getText(columns[6]);
			if(uom && uom.indexOf(' x ') != -1) {
				
				x = uom.match(/[\d\.]+/g);
				multiple = x[0];
				bottlesize=x[1]+" cl";	
			}

			newprice = itemPrice * multiple;
			
			var dtyStatus = itemsList[i].getText(columns[8]);
				if(dtyStatus && dtyStatus.toUpperCase() != 'IN BOND' && dtyStatus.toUpperCase() != 'DUTY PAID')
				{
					dtyStatus = ' ';
				}
		
			var grower = ', ' + itemsList[i].getText(columns[9]);
				if(!itemsList[i].getValue(columns[9]))
				{
					grower = ' ';
				}
				
			var score = itemsList[i].getText(columns[10]);
				if(!itemsList[i].getValue(columns[10]))
				{
					score = ' ';
				}
				
			var vintage = itemsList[i].getText(columns[4]);
				if(vintage == 0)
				{
					vintage = 'NV';
				}
				
			var color = itemsList[i].getText(columns[7]);
				if(!itemsList[i].getValue(columns[7]))
				{
					color = ' ';
				}
			
			var condition = itemsList[i].getText(columns[13]);
				if(!itemsList[i].getValue(columns[13]))
				{
					condition = " ";
				}
			
			
			var isnew = rowcolor;
			//var fontcolorr = "#414042";
			var fontcolorr = "#000000";
			if(itemsList[i].getValue(cols[16])) {
				var current_date = new Date()
				var dayslapse = days_between(nlapiStringToDate(itemsList[i].getValue(cols[16])),current_date);
				
				if(dayslapse < 6) {
					isnew =  "red";
					fontcolorr = "red";
				} 
			}
			
			var unitb = itemsList[i].getText(columns[6]);
			if(unitb && unitb.indexOf(' x ') != -1) {
				
				unitb=unitb+" cl";	
			}
			
			content += "<td align='center' valign='middle' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";background-color: "+isnew+";vertical-align: middle;font-size:8pt;height:25px;'>&nbsp;</td><td align='center' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" +  color + "</td><td align='center' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + vintage + "</td><td align='left' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;font-size:8pt;text-align:left;'>" + itemsList[i].getText(columns[1])  + grower + "</td><td align='left' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;white-space:nowrap; text-align:left;'>" + unitb + "</td><td align='center' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + itemsList[i].getValue(columns[11]) + "</td><td align='left' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + dtyStatus + "</td><td align='right' style='border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + moneySymbol + formatCurrency(Math.round(newprice.toFixed(2)))+".00"+ "</td><td align='center' style='border-top: 1px solid #000000;border-left: 1px solid #000000;color: "+fontcolorr+";padding: 1px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + avl+"</td><td align='center' style=' border-top: 1px solid #000000;border-left: 1px solid #000000;border-right: 1px solid #000000;color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;'>" + score+ "</td>";
			
			//<td align='center' style='color: "+fontcolorr+";padding: 4px;background-color: "+rowcolor+";vertical-align: middle;height:25px;font-size:8pt;text-align:center;white-space:nowrap;'>" + avl+  "</td>
			k++;
	
		content += "</tr>";
	}
	content += "<tr  style='border-top: 1px solid #000000;'><td colspan='10'>&nbsp;</td></tr>";
	content += "</tbody>";
	content += "</table>";
	
	
		
	nlapiLogExecution('DEBUG', 're', context.getRemainingUsage());
	
	
	pdfcontent = "<head><macrolist><macro id='myfooter'> <p align='center' style='font-family: Tahoma,Geneva,sans-serif;font-size:9pt;'>Page <pagenumber/> of <totalpages/> </p></macro></macrolist></head><body footer='myfooter' footer-height='2em'>"+content+"</body>"
	var xml = "<?xml version=\"1.0\"?>\n<!DOCTYPE pdf PUBLIC \"-//big.faceless.org//report\" \"report-1.1.dtd\">\n<pdf>\n"+pdfcontent+"\n</pdf>";
	
	
	var file = nlapiXMLToPDF( xml.replace(/& /gi,'&amp;') );
	// set content type, file name, and content-disposition (inline means display in browser)
	response.setContentType('PDF','InventoryReport.pdf', 'inline');
	nlapiLogExecution('DEBUG', 're', context.getRemainingUsage());
	// write response to the client
	response.write( file.getValue() );
}


function days_between(date1, date2) {

    // The number of milliseconds in one day
    var ONE_DAY = 1000 * 60 * 60 * 24

    // Convert both dates to milliseconds
    var date1_ms = date1.getTime()
    var date2_ms = date2.getTime()

    // Calculate the difference in milliseconds
    var difference_ms = Math.abs(date1_ms - date2_ms)
    
    // Convert back to days and return
    return Math.round(difference_ms/ONE_DAY)

}


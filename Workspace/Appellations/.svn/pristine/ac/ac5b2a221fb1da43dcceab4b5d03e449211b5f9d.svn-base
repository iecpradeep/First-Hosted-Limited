// JavaScript Document
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

function checkordereditems(params) {
	var myReturn = new Array();
	var itemids = params.getParameter("itemids");	
	var cid = params.getParameter("cid");
	var targetCurrency = params.getParameter('tcur');
	var moneySymbol = params.getParameter('cursymbol');
	if(moneySymbol == 1)
	{
		moneySymbol = '&pound';
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
	itemids = itemids.split('~');
	if(itemids) {
		var filters = new Array();
		filters.push(new nlobjSearchFilter('item', null, 'anyof', itemids));
		filters.push(new nlobjSearchFilter('entity', null, 'is', cid));
		
		/*var columns = new Array();
		columns.push(new nlobjSearchColumn('linesequencenumber'));
		columns.push(new nlobjSearchColumn('item'));*/
		
		var searchres = nlapiSearchRecord("salesorder", 209, filters);
		var previtem = "";
		if(searchres) {
			for(var i = 0; i <searchres.length; i++) {			
				var columns = searchres[i].getAllColumns();
				if(previtem == searchres[i].getValue(columns[1])) continue;
				previtem = searchres[i].getValue(columns[1])
				
				var itemObj = new Object();
				itemObj.itemid = searchres[i].getValue(columns[1]);
				nlapiLogExecution('ERROR', 'itemid', itemObj.itemid);
				var custcol_rotation_website =  searchres[i].getValue(columns[3]);
				if(!custcol_rotation_website) custcol_rotation_website = searchres[i].getValue(columns[2]);
				if(custcol_rotation_website) {
					
					var rotation = nlapiLoadRecord("customrecord_rotation",custcol_rotation_website);
				//	var record = nlapiLoadRecord('inventoryitem', rotation.getFieldValue('custrecord_lotitem'));
					
					itemObj.rotid = custcol_rotation_website;
					
					if(rotation)
					{
						 
							
							var id = rotation.getId();
							var img = (rotation.getFieldValue('custrecord_lotimage1') != '')?rotation.getFieldValue('custrecord_lotimage1'):'';
							var qty = rotation.getFieldValue('custrecord_rotation_item_units_available');
							var desc = rotation.getFieldValue('custrecord_lotdescription');
							var name = rotation.getFieldValue('name');
							var uom = rotation.getFieldText('custrecord_rotation_polineunits');
							var uomid = rotation.getFieldValue('custrecord_rotation_polineunits');
							var winename = rotation.getFieldText('custrecord_rotation_wine_name');
							var grower = rotation.getFieldText('custrecord_rotation_wine_grower');
							var vintage = rotation.getFieldText('custrecord_po_wine_vinatge');
							var ordertype = rotation.getFieldText('custrecord_rotation_ordertype');
							var ordertypeid = rotation.getFieldValue('custrecord_rotation_ordertype');
							var eta = (rotation.getFieldValue('custrecord_rotation_expecteddelivery')==null?'':  rotation.getFieldValue('custrecord_rotation_expecteddelivery'));
							var inbasket = rotation.getFieldValue('custrecord_inbasket');
							var condition =  rotation.getFieldText('custrecord_rotation_owcstatus');
							
							var  display= searchres[i].getValue(columns[12]);
							
							if(inbasket && qty)
								qty = parseInt(qty) - parseInt(inbasket);
							
							
							if(grower) 
								winename += ', ' + grower; 
								
							if(!vintage)
								vintage = searchres[i].getValue(columns[13]);
								
							if(!uom)
								uom = searchres[i].getValue(columns[14]);
							
							if(!winename)
								winename = searchres[i].getValue(columns[15]); + (searchres[i].getValue(columns[16])==''?'': ', ' + searchres[i].getText(columns[16]));
								
							if(!ordertype)
								ordertype =searchres[i].getValue(columns[17]);;
							
							var multiple = 1;
							if(uom.indexOf(' x ') != -1) {
								
								x = uom.match(/[\d\.]+/g);
								multiple = x[0];
							
							}
							price = searchres[i].getValue(columns[18]);
							if(exchangeRate != 0)
							{
								price = price * exchangeRate;
							}			
							
							newprice = price * multiple;
							
							extradetails = vintage + '~' + uom + '~' + ordertype + '~' + winename +'*';
							extradetails = extradetails.replace(/\'/g, "@POSTRO");
							
				
							orgPrice=searchres[i].getValue(columns[18])*1;
				
							
							itemObj.newprice = formatCurrency(Math.round(newprice.toFixed(2)))+'.00';
							itemObj.vintage = vintage;
							itemObj.winename = winename;
							itemObj.uom = uom;
							itemObj.ordertype = ordertype;
							itemObj.extradetails = extradetails;
							itemObj.qty = qty;
							itemObj.display = display;
							itemObj.uomid = uomid;
							itemObj.ordertypeid = ordertypeid;
							nlapiLogExecution('ERROR', 'itemObj.newprice ', itemObj.newprice);
							
					}
					
					
				}
				myReturn.push(itemObj);
			}
			
		}
		
	}
	nlapiLogExecution('ERROR', 'myReturn', myReturn.length);
	myJSON = JSON.stringify(myReturn);

	response.write(myJSON);
	
}


function getAvailableRotation(params){
	var itemid = params.getParameter("itemid");
	var rotunit = params.getParameter("unit");
	var duty = params.getParameter("duty");
	var qty = params.getParameter("qty");
		
}
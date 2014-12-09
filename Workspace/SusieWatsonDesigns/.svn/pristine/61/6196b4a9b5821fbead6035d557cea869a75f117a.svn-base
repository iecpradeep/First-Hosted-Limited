
//Cart AJAX Server Functions


function ProcessAjaxRequest(request, response) {
	var data = "";
	var actions = request.getParameter('action');
	actions = actions.split(",");
	for (var i=0; i < actions.length; i++) {
		switch (actions[i]) {
		case "containsbackorders":
			data += ContainsBackorders(request, response);
			break;
		case "getshippingmethods":
			data += GetAvailableShippingMethods(request, response);
			break;
		case "gettradepackquantities":
			data += GetTradePackQuantities(request, response);
			break;
		}
	}
	if (data[data.length-1]==",") data = data.substr(0,data.length-1);
	response.write("{"+data+"}");
}

/* Check if the cart contains out of stock items */

function ContainsBackorders(request, response) {
	var contains_backorders = false;
	var items = request.getParameter('items');
	var itemid = items.split(",");
	var oos_items = [];
	for (var i=0; i < itemid.length; i++) {
		if (itemid[i]!="") {
			var filters = new Array();
			filters[0] = new nlobjSearchFilter("internalid", null, "is", itemid[i], null);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn("quantityavailable");    
			var results = nlapiSearchRecord("item", null, filters, columns);
			if (results && results.length>0 && results[0].getValue("quantityavailable")<=0) {
				contains_backorders = true;
				oos_items[oos_items.length] = results[0].getId();
			}
		}
	}
	return 'containsbackorders:'+(oos_items.length>0 ? '['+oos_items.toString()+']' : 'null')+',';
}

/* Get available shipping methods */

function GetAvailableShippingMethods(request, response) {
	var items = request.getParameter('items');
	var pricelevel = request.getParameter('pricelevel');
	var total = request.getParameter('total');
	total = (total && !isNaN(parseFloat(total))) ? parseFloat(total) : 0;
	var itemtypes = GetItemTypes(items);
	var allowed_shippingid = GetShippingIds(pricelevel, total, itemtypes);
	return 'getshippingmethods:"'+allowed_shippingid.toString()+'",';
}

function GetItemTypes(items) {
	var itemtypes = new Object();
	var itemid = items.split(",");
	for (var i=0; i < itemid.length; i++) {
		if (itemid[i]!="") {
			var filters = new Array();
			filters[0] = new nlobjSearchFilter("internalid", null, "is", itemid[i], null);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn("class");    
			var results = nlapiSearchRecord("item", null, filters, columns);
			if (results && results.length>0) {
				var itemtype = results[0].getText("class");
				if (/ceramics/i.test(itemtype))
					itemtypes['ceramics'] = true;
				else if (/linen/i.test(itemtype))
					itemtypes['linens'] = true;
				else if (/(cards)|(prints)/i.test(itemtype))
					itemtypes['prints'] = true;
				else if (/fabric/i.test(itemtype))
					itemtypes['fabrics'] = true;
				else
					itemtypes['others'] = true;
			}
		}
	}
	return itemtypes;
}

function GetShippingIds(pricelevel, total, itemtypes) {
	if (/trade/i.test(pricelevel)) {
		if (total>500 && itemtypes.ceramics)
			return ["1352"];
		else if (total>250 && itemtypes.linens && !itemtypes.ceramics && !itemtypes.fabrics)
			return ["1352"];
		else if (total>150 && itemtypes.prints && itemtypes.length==1)
			return ["1352"];
		else if (itemtypes.fabrics)
			return ["1178"];
		else
			return ["1177"];
	}
	else if (/retail/i.test(pricelevel)) {
		if (itemtypes.prints && itemtypes.length==1)
			return ["1179"];
	}
	return ["1166"];
}

/* Get the trade pack quantities for the passed in items */

function GetTradePackQuantities(request, response) {
	var items = request.getParameter('items');
	var itemid = items.split(",");
	var pack_qtys = "";
	for (var i=0; i < itemid.length; i++) {
		if (itemid[i]!="") {
			var filters = new Array();
			filters[0] = new nlobjSearchFilter("internalid", null, "is", itemid[i], null);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn("custitem_bb1_tademinqty");    
			var results = nlapiSearchRecord("item", null, filters, columns);
			if (results && results.length>0 && results[0].getValue("custitem_bb1_tademinqty")>1) {
				pack_qtys += '{id:' + results[0].getId() + ',packqty:' + results[0].getValue("custitem_bb1_tademinqty") + '},';
			}
		}
	}
	return 'tradepackquantities:'+(pack_qtys.length>0 ? '['+pack_qtys.substr(0,pack_qtys.length-1)+']' : 'null')+',';
}

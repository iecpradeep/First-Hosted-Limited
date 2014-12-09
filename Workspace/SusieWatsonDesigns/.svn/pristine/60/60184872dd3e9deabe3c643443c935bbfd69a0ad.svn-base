

/**
 * @param request
 * @param response
 */
function GetAvailableShippingMethods(request, response) {
	var items = request.getParameter('items');
	var pricelevel = request.getParameter('pricelevel');
	var total = request.getParameter('total');
	total = (total && !isNaN(parseFloat(total))) ? parseFloat(total) : 0;
	var itemtypes = GetItemTypes(items);
	var allowed_shippingid = GetShippingIds(pricelevel, total, itemtypes);
	response.write(allowed_shippingid.toString());
}


/**
 * @param items
 * @returns {___itemtypes0}
 */
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


/**
 * @param pricelevel
 * @param total
 * @param itemtypes
 * @returns {Array}
 */
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
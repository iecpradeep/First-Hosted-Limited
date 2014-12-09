function CollectionAjaxRequests(request, response) {
	var action = request.getParameter('action');
	switch (action) {
	case "additem":
		AddItemToCollection(request, response); break;
	case "getitems":
		GetCollectionItems(request, response); break;
	case "selectitem":
		SetItemSelection(request, response); break;
	case "selectallitems":
		SetAllItemsSelected(request, response); break;
	case "removeitem":
		RemoveItemFromCollection(request, response); break;
	case "gettotalprice":
		GetTotalPrice(request, response); break;
	case "getbackgrounds":
		GetBackgrounds(request, response); break;
	case "setbackground":
		SetBackground(request, response); break;
	case "getcollection":
		GetCollection(request, response); break;
	case "setitemquantity":
		SetItemQuantity(request, response); break;
	case "getaddtocartlist":
		GetAddToCartList(request, response); break;
	case "savecollection":
		SaveCollection(request, response); break;
	case "checkforunsavedcollection":
		CheckForUnsavedCollections(request, response); break;
	case "overwritesavedcollection":
		OverwriteSavedCollection(request, response); break;
	case "deleteunsavedcollection":
		DeleteUnsavedCollection(request, response); break;
	}
}

function AddItemToCollection(request, response) {
	var json = '{success: false}', errored = false;
	var itemid = request.getParameter('itemid');

	if (CheckItemIDIsValid(itemid)) { // 10 units
		var cd = GetCurrentCollectionID(request, true); // 10-60 units
		if (cd && cd!="") {
			var items = nlapiSearchRecord('customrecord_bb1_cdi', null, [new nlobjSearchFilter('isinactive', null, 'is', 'F'), new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd)]); // 10 units
			if (items && items.length >= 92) {
				json = '{success: false, error: "You have reached the maximum number of items allowed in a collection. You must remove some items before you can add any more."}';
			}
			else {
				try {
					var cdiid = GetCDItemInternalID(cd, itemid); // 10 units
					if (cdiid)
						nlapiSubmitField("customrecord_bb1_cdi", cdiid, "isinactive", "F"); // 10 units
					else
						cdiid = CreateCDItemRecord(cd, itemid, 1); // 30 units
					json = '{success: true}';
				}
				catch(e) { json = '{success: false, error: ' + GetErrorDescription(e).JSEncode() + '}'; LogError(e); }
			}
		}
	}

	response.write(json);
}

function GetCollectionItems(request, response) {
	var json = '{success: false}', page_count = 0, record_count = 0, totalprice = 0, row_start = 1, row_end = 1;
	var page_size = parseInt(nlapiGetContext().getSetting("SCRIPT", "custscript_bb1_cd_items_pagesize"));
	var page = request.getParameter('page');
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("custrecord_bb1_cdi_qty");
		columns[1] = new nlobjSearchColumn("custrecord_bb1_cdi_selected");
		columns[2] = new nlobjSearchColumn("storedisplayname", "custrecord_bb1_cdi_item");
		columns[3] = new nlobjSearchColumn("storedescription", "custrecord_bb1_cdi_item");
		columns[4] = new nlobjSearchColumn("onlineprice", "custrecord_bb1_cdi_item");
		columns[5] = new nlobjSearchColumn("itemurl", "custrecord_bb1_cdi_item");
		columns[6] = new nlobjSearchColumn("thumbnailurl", "custrecord_bb1_cdi_item");
		columns[7] = new nlobjSearchColumn("imageurl", "custrecord_bb1_cdi_item");
		columns[8] = new nlobjSearchColumn("salestaxcode", "custrecord_bb1_cdi_item");
		//columns[9] = new nlobjSearchColumn("category", "custrecord_bb1_cdi_item");
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, columns);
		var items_json = "";
		if (results && results.length>0) {
			results.sort(SortCollectionItemResults);
			var tax_rates = GetTaxRates();
			page_count = Math.ceil(results.length / page_size);
			if (page > page_count) page = page_count;
			record_count = results.length;
			switch (page) {
			case "all":
				row_start = 0;
				row_end = results.length;
				break;
			case "last":
				page = page_count;
				row_start = (page - 1) * page_size;
				row_end = row_start + page_size - 1;
				break;
			default:
				page = (page && !isNaN(parseInt(page))) ? parseInt(page) : 1;
				row_start = (page <= 1) ? 0 : (page - 1) * page_size;
				row_end = row_start + page_size - 1;
			}
			for (var i=0; i < results.length; i++) {
				var selected = (results[i].getValue("custrecord_bb1_cdi_selected")=="T");
				var quantity = results[i].getValue("custrecord_bb1_cdi_qty");
				var price = results[i].getValue("onlineprice", "custrecord_bb1_cdi_item");
				var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_cdi_item");
				var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
				var price_float = (price&&!isNaN(parseFloat(price))) ? parseFloat(price) : 0;
				var price_inc_float = Math.round(price_float*(1+salestaxrate)*100)/100;
				if (selected) totalprice += price_inc_float * quantity;
				if (row_start <= i && i <= row_end) {
					items_json += '{id: "' + results[i].getId() + '",';
					items_json += 'qty: ' + quantity + ',';
					items_json += 'selected: ' + selected + ',';
					items_json += 'name: ' + results[i].getValue("storedisplayname", "custrecord_bb1_cdi_item").JSEncode() + ',';
					//items_json += 'description: ' + results[i].getValue("storedescription", "custrecord_bb1_cdi_item").JSEncode() + ',';
					//items_json += 'category: '+results[i].getValue("category", "custrecord_bb1_cdi_item").JSEncode() + ',';
					items_json += 'price: ' + price_inc_float.toFixed(2).JSEncode() + ',';
					items_json += 'url: ' + results[i].getValue("itemurl", "custrecord_bb1_cdi_item").JSEncode() + ',';
					items_json += 'thumbnail: ' + results[i].getValue("thumbnailurl", "custrecord_bb1_cdi_item").JSEncode() + ',';
					items_json += 'image: ' + results[i].getValue("imageurl", "custrecord_bb1_cdi_item").JSEncode() + '},';
				}
			}
		}
		json = '{success: true, page:'+page+', page_size:'+page_size+', page_count:'+page_count+', record_count:'+record_count+', total_price:'+totalprice.toFixed(2)+', items:['+items_json.substr(0,items_json.length-1)+']}';
	}
	response.write(json);
}

function SortCollectionItemResults(a, b) {
	var a_rank = parseInt(a.getId());
	var b_rank = parseInt(b.getId());
	return a_rank - b_rank;
}

function SetItemSelection(request, response) {
	var cd = GetCurrentCollectionID(request);
	var cdi = request.getParameter('itemid');
	var selected = (request.getParameter('selected')=="true");
	if (cd && cdi && cdi!="") {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('internalid', null, 'is', cdi);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters);
		if (results && results.length>0) {
			nlapiSubmitField("customrecord_bb1_cdi", cdi, "custrecord_bb1_cdi_selected", (selected?"T":"F"));
			response.write('{success:true}');
			return;
		}
	}
	response.write('{success:false}');
}

function SetAllItemsSelected(request, response) {
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters);
		if (results && results.length>0) {
			for (var i=0; i < results.length; i++)
				nlapiSubmitField("customrecord_bb1_cdi", results[i].getId(), "custrecord_bb1_cdi_selected", "T");
			response.write('{success:true}');
			return;
		}
	}
	response.write('{success:false}');
}

function RemoveItemFromCollection(request, response) {
	var json = '{success: false}', errored = false;
	var cd = GetCurrentCollectionID(request);
	var cdi = request.getParameter('itemid');

	if (cd && cdi && cdi!="") {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('internalid', null, 'is', cdi);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters);
		if (results && results.length > 0) {
			try {
				//nlapiDeleteRecord("customrecord_bb1_cdi", results[0].getId());
				nlapiSubmitField("customrecord_bb1_cdi", results[0].getId(), ["isinactive", "custrecord_bb1_cdi_qty", "custrecord_bb1_cdi_selected", "custrecord_bb1_cdi_designerdata"], ["T", "1", "F", ""]); // 10 units
			}
			catch(e) { errored = true; LogError(e); }
			if (!errored) json = '{success:true}';
		}
	}

	response.write(json);
}

function GetAddToCartList(request, response) {
	var json = '{success:false}';
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_selected', null, 'is', 'T');
		filters[3] = new nlobjSearchFilter('custrecord_bb1_cdi_qty', null, 'greaterthan', 0);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("custrecord_bb1_cdi_item");
		columns[1] = new nlobjSearchColumn("custrecord_bb1_cdi_qty");
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, columns);
		if (results && results.length>0) {
			var list = "";
			for (var i=0; i < results.length; i++)
				list += results[i].getValue("custrecord_bb1_cdi_item") + "," + results[i].getValue("custrecord_bb1_cdi_qty") + ";";
			json = '{success:true, addtocartlist: "'+list+'"}';
		}
	}
	response.write(json);
}

function SetItemQuantity(request, response) {
	var json = '{success:false}';
	var cd = GetCurrentCollectionID(request);
	var cdi = request.getParameter('itemid');
	var qty = request.getParameter('qty');
	if (cd && cdi && cdi!="" && qty && parseInt(qty)>0) {
		qty = parseInt(qty);
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('internalid', null, 'is', cdi);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, null);
		if (results && results.length>0) {
			nlapiSubmitField("customrecord_bb1_cdi", cdi, "custrecord_bb1_cdi_qty", qty);
			json = '{success:true}';
		}
	}
	response.write(json);
}

function GetTotalPrice(request, response) {
	var json = '{success: false}', totalprice = 0;
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("custrecord_bb1_cdi_qty");
		columns[1] = new nlobjSearchColumn("custrecord_bb1_cdi_selected");
		columns[2] = new nlobjSearchColumn("onlineprice", "custrecord_bb1_cdi_item");
		columns[3] = new nlobjSearchColumn("salestaxcode", "custrecord_bb1_cdi_item");
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, columns);
		if (results && results.length>0) {
			var tax_rates = GetTaxRates();
			for (var i=0; i < results.length; i++) {
				var selected = (results[i].getValue("custrecord_bb1_cdi_selected")=="T");
				var quantity = results[i].getValue("custrecord_bb1_cdi_qty");
				var price = results[i].getValue("onlineprice", "custrecord_bb1_cdi_item");
				var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_cdi_item");
				var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
				var price_float = (price&&!isNaN(parseFloat(price))) ? parseFloat(price) : 0;
				var price_inc_float = Math.round(price_float*(1+salestaxrate)*100)/100;
				if (selected) totalprice += price_inc_float * quantity;
			}
		}
		json = '{success: true, total_price:'+totalprice.toFixed(2)+'}';
	}
	response.write(json);
}

function GetBackgrounds(request, response) {
	var json = '{success: false}';
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		json = '';
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("name");
		columns[1] = new nlobjSearchColumn("custrecord_bb1_cdb_image");
		columns[2] = new nlobjSearchColumn("custrecord_bb1_cdb_rank");
		var results = nlapiSearchRecord('customrecord_bb1_cdb', null, filters, columns);
		if (results && results.length>0) {
			results.sort(SortBackgroundResults);
			for (var i=0; i < results.length; i++) {
				var id = results[i].getId();
				var name = results[i].getValue("name");
				var image = results[i].getText("custrecord_bb1_cdb_image");
				json += '"'+id+'": "'+name+'",';
			}
		}
		json = '{success: true, backgrounds: {"": "", ' + json.substr(0,json.length-1) + '}}';
	}
	response.write(json);
}

function SortBackgroundResults(a, b) {
	var a_rank = parseInt(a.getValue("custrecord_bb1_cdb_rank"));
	var b_rank = parseInt(b.getValue("custrecord_bb1_cdb_rank"));
	return a_rank - b_rank;
}

function SetBackground(request, response) {
	var json = '{success: false}';
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var bgid = request.getParameter('background'), bgurl = "";
		bgid = (bgid && bgid!="") ? bgid : "";
		if (bgid != "") {
			var filters = new Array();
			filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
			filters[1] = new nlobjSearchFilter('internalid', null, 'is', bgid, null);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn("custrecord_bb1_cdb_image");
			var results = nlapiSearchRecord('customrecord_bb1_cdb', null, filters, columns);
			if (results && results.length>0)
				bgurl = results[0].getText("custrecord_bb1_cdb_image");
			else
				bgid = "";
		}
		nlapiSubmitField("customrecord_bb1_cd", cd, "custrecord_bb1_cd_background", bgid);
		json = '{success: true, background_url: "'+bgurl+'"}';
	}
	response.write(json);
}

function GetCollection(request, response) {
	var json = '{success: false}', items_json = '';
	var cd = GetCurrentCollectionID(request);
	if (cd) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_designerdata', null, 'isnotempty', null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("custrecord_bb1_cdi_qty");
		columns[1] = new nlobjSearchColumn("custrecord_bb1_cdi_selected");
		columns[2] = new nlobjSearchColumn("storedisplayname", "custrecord_bb1_cdi_item");
		columns[3] = new nlobjSearchColumn("onlineprice", "custrecord_bb1_cdi_item");
		columns[4] = new nlobjSearchColumn("itemurl", "custrecord_bb1_cdi_item");
		columns[5] = new nlobjSearchColumn("thumbnailurl", "custrecord_bb1_cdi_item");
		columns[6] = new nlobjSearchColumn("imageurl", "custrecord_bb1_cdi_item");
		columns[7] = new nlobjSearchColumn("salestaxcode", "custrecord_bb1_cdi_item");
		columns[8] = new nlobjSearchColumn("custrecord_bb1_cdi_designerdata");
		var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, columns);
		if (results && results.length>0) {
			for (var i=0; i < results.length; i++) {
				//var selected = (results[i].getValue("custrecord_bb1_cdi_selected")=="T");
				//var quantity = results[i].getValue("custrecord_bb1_cdi_qty");
				//var price = results[i].getValue("onlineprice", "custrecord_bb1_cdi_item");
				//var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_cdi_item");
				//var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
				//var price_float = (price&&!isNaN(parseFloat(price))) ? parseFloat(price) : 0;
				//var price_inc_float = Math.round(price_float*(1+salestaxrate)*100)/100;
				//if (selected) totalprice += price_inc_float * quantity;
				items_json += '{id: "'+results[i].getId()+'",'
				//items_json += 'qty: '+quantity+','
				//items_json += 'selected: '+selected+','
				//items_json += 'name: "'+results[i].getValue("storedisplayname", "custrecord_bb1_cdi_item")+'",'
				//items_json += 'price: "'+price_inc_float.toFixed(2)+'",'
				//items_json += 'url: "'+results[i].getValue("itemurl", "custrecord_bb1_cdi_item")+'",'
				//items_json += 'thumbnail: "'+results[i].getValue("thumbnailurl", "custrecord_bb1_cdi_item")+'",'
				items_json += 'image: "'+results[i].getValue("imageurl", "custrecord_bb1_cdi_item")+'",'
				items_json += 'data: '+results[i].getValue("custrecord_bb1_cdi_designerdata")+'},'
			}
		}
		var cd_filters = new Array();
		cd_filters[0] = new nlobjSearchFilter('internalid', null, 'is', cd, null);
		var cd_columns = new Array();
		cd_columns[0] = new nlobjSearchColumn("custrecord_bb1_cd_background");
		cd_columns[1] = new nlobjSearchColumn("custrecord_bb1_cdb_image", "custrecord_bb1_cd_background");
		var cd_results = nlapiSearchRecord("customrecord_bb1_cd", null, cd_filters, cd_columns);
		json = '{success: true, background_id: "'+cd_results[0].getValue("custrecord_bb1_cd_background")+'", background_url: "'+cd_results[0].getText("custrecord_bb1_cdb_image", "custrecord_bb1_cd_background")+'", items:['+items_json.substr(0,items_json.length-1)+']}';
	}
	response.write(json);
}

function SaveCollection(request, response) { // Can update a maximum of 92 unique items
	var json = '{success: false}', errored = false;
	var data = request.getParameter('data')
	var cd = GetCurrentCollectionID(request); // 10-60 units
	if (cd) {
		var items = (data && data!="") ? eval(data) : null;
		var custid = nlapiLookupField("customrecord_bb1_cd",cd,"custrecord_bb1_cd_customer"); // 10 units
		// Get current list of collection items
		var items_to_reset = {};
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd);
		filters[2] = new nlobjSearchFilter('custrecord_bb1_cdi_designerdata', null, 'isnotempty'); // only need items that are not already blank
		var items_to_reset_rs = nlapiSearchRecord('customrecord_bb1_cdi', null, filters); // 10 units
		if (items_to_reset_rs) {
			for (var i=0; i < items_to_reset_rs.length; i++) {
				items_to_reset[(new String(items_to_reset_rs[i].getId()))] = true;
			}
		}
		if (items) {
			for (var i=0; i < items.length; i++) {
				var item = items[i].item;
				var item_data = unescape(items[i].data);
				if (typeof items_to_reset[item] != undefined)
					delete items_to_reset[item];
				try {
					nlapiSubmitField("customrecord_bb1_cdi",item,"custrecord_bb1_cdi_designerdata",item_data); // 10 units
				}
				catch(e) { errored = true; LogError(e); }
			}
		}
		for (var itemid in items_to_reset) { // remove any items that were not part of the update (another way to do this is to send all items as part of save collection data, but this is likely safer)
			try {
				nlapiSubmitField("customrecord_bb1_cdi", itemid, "custrecord_bb1_cdi_designerdata", ""); // 10 units
			}
			catch(e) { errored = true; LogError(e); }
		}
		if (!errored) json = '{success: true, registered: '+(custid&&custid!=""?"true":"false")+'}';
	}
	response.write(json);
}

function CheckForUnsavedCollections(request, response) {
	var json = '{success: false}';
	try {
		var user = nlapiGetUser();
		if (user && user!="" && user!="-4") {
			var sessionid = GetSessionID(request);
			if (SearchForUnsavedCollection(sessionid))
				json = '{success: true, signed_in: true, existing_collections: true}';
			else
				json = '{success: true, signed_in: true, existing_collections: false}';
		}
		else {
			json = '{success: true, signed_in: false }';
		}
	}
	catch(e) { json = '{success: false, error: "' + GetErrorDescription(e) + '"}'; LogError(e); }
	response.write(json);
}

function OverwriteSavedCollection(request, response) {
	var json = '{success: false}';
	try {
		var user = nlapiGetUser();
		if (user && user!="" && user!="-4") {
			var sessionid = GetSessionID(request);
			var new_cd = SearchForUnsavedCollection(sessionid);
			if (new_cd) {
				var cd = GetCurrentCollectionID(request);
				nlapiSubmitField("customrecord_bb1_cd", new_cd, "custrecord_bb1_cd_customer", user);
				nlapiSubmitField("customer", user, "custentity_bb1_cd_active", new_cd);
				nlapiSubmitField("customrecord_bb1_cd", cd, ["custrecord_bb1_cd_customer", "isinactive"], ["", "T"]); // mark for deletion
				json = '{success: true}';
			}
		}
		else {
			json = '{success: false, error: "Not signed in" }';
		}
	}
	catch(e) { json = '{success: false, error: "' + GetErrorDescription(e) + '"}'; LogError(e); }
	response.write(json);
}

function DeleteUnsavedCollection(request, response) {
	var json = '{success: false}';
	try {
		var user = nlapiGetUser();
		if (user && user!="" && user!="-4") {
			var sessionid = GetSessionID(request);
			var new_cd = SearchForUnsavedCollection(sessionid);
			if (new_cd) {
				nlapiSubmitField("customrecord_bb1_cd", new_cd, ["custrecord_bb1_cd_customer", "isinactive"], ["", "T"]); // mark for deletion
				json = '{success: true}';
			}
		}
		else {
			json = '{success: false, error: "Not signed in" }';
		}
	}
	catch(e) { json = '{success: false, error: "' + GetErrorDescription(e) + '"}'; LogError(e); }
	response.write(json);
}

function SearchForUnsavedCollection(sessionid) {
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
	filters[1] = new nlobjSearchFilter('custrecord_bb1_cd_sessionid', null, 'is', sessionid, null);
	filters[2] = new nlobjSearchFilter('custrecord_bb1_cd_customer', null, 'anyof', '@NONE@', null);
	var results = nlapiSearchRecord('customrecord_bb1_cd', null, filters, null);
	return (results && results.length>0) ? results[0].getId() : null;
}

function GetCurrentCollectionID(request, create_if_none) { // 10-60 units
	var cd = null;
	var sessionid = GetSessionID(request);
	try {
		var user = nlapiGetUser();
		if (user && user!="" && user!="-4") {
			var cust_fields = nlapiLookupField("customer", user, ["custentity_bb1_cd_active","custentity_bb1_cd_active_sessionid"]); // 10 units
			cd = cust_fields["custentity_bb1_cd_active"];
			if (cd && cd!="") {
				if (sessionid != cust_fields["custentity_bb1_cd_active_sessionid"])
					nlapiSubmitField("customrecord_bb1_cd", cd, "custrecord_bb1_cd_sessionid", sessionid); // 10 units
			}
			else if (create_if_none)
				cd = CreateCDRecord(user, sessionid, true); // 30-40 units
		}
	}
	catch (e) { LogError(e); }
	if (cd==null) {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
		filters[1] = new nlobjSearchFilter('custrecord_bb1_cd_sessionid', null, 'is', sessionid, null);
		var results = nlapiSearchRecord('customrecord_bb1_cd', null, filters, null); // 10 units
		if (results && results.length>0) 
			cd = results[0].getId();
		else if (create_if_none)
			cd = CreateCDRecord(user, sessionid, true); // 30-40 units
	}
	return cd;
}

function GetCDItemInternalID(cd, itemid) { // 10 units
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('custrecord_bb1_cdi_parent', null, 'is', cd, null);
	filters[1] = new nlobjSearchFilter('custrecord_bb1_cdi_item', null, 'is', itemid, null);
	var results = nlapiSearchRecord('customrecord_bb1_cdi', null, filters, null); // 10 units
	if (results && results.length>0)
		return results[0].getId();
	return null;
}

function CheckItemIDIsValid(itemid) { // 10 units
	if (itemid && itemid!="") {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter('internalid', null, 'is', itemid, null);
		filters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
		filters[2] = new nlobjSearchFilter('isonline', null, 'is', 'T', null);
		var results = nlapiSearchRecord('item', null, filters, null); // 10 units
		if (results && results.length>0)
			return true;
	}
	return false;
}

function GetSessionID(request) {
	var cookies = request.getHeader("Cookie");
	var sessionid = cookies.match(/NLVisitorId=([^;]*);?/); //JSESSIONID, NLVisitorId,NLShopperId
	return (sessionid && sessionid.length>1) ? sessionid[1] : null;
}

function CreateCDRecord(userid, sessionid, active) { // 30 units if not logged in - 40 units if logged in
	userid = (userid && userid!="" && userid!="-4") ? userid : null;
	var new_cd = nlapiCreateRecord("customrecord_bb1_cd"); // 10 units
	new_cd.setFieldValue("name", "Auto name");
	if (userid) new_cd.setFieldValue("custrecord_bb1_cd_customer", userid);
	new_cd.setFieldValue("custrecord_bb1_cd_sessionid", sessionid);
	var cd = nlapiSubmitRecord(new_cd, true); // 20 units
	if (cd && userid && active) nlapiSubmitField("customer", userid, "custentity_bb1_cd_active", cd); // 10 units
	return cd;
}

function CreateCDItemRecord(cd, itemid, qty) { // 30 units
	var cdi = nlapiCreateRecord("customrecord_bb1_cdi"); // 10 units
	cdi.setFieldValue("custrecord_bb1_cdi_parent", cd);
	cdi.setFieldValue("custrecord_bb1_cdi_item", itemid);
	cdi.setFieldValue("custrecord_bb1_cdi_qty", qty);
	return nlapiSubmitRecord(cdi, true); // 20 units
}

function GetTaxRates() { // 10 units
	var tax_array = new Object();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('rate');
	var results = nlapiSearchRecord('salestaxitem', null, filters, columns); // 10 units
	if (results) {
		for (var i=0; i < results.length; i++) {
			var taxrate = results[i].getValue('rate');
			tax_array[results[i].getValue('internalid')] = (taxrate && taxrate!='') ? parseFloat(taxrate.replace(/[^\d.]/g,""))/100 : 0;
		}
	}
	return tax_array;
}

Date.prototype.JSEncode = function () {
	if (this == "Invalid Date") return '"Invalid Date"';
	return this.toSource().replace(/^\(new Date\(|\)\)$/g, ''); //'new Date(' + this.getFullYear() + ',' + this.getMonth() + ',' + this.getDate() + ')';
};

String.prototype.JSEncode = function () {
	var escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;
	var meta = {    // table of character substitutions
			'\b': '\\b',
			'\t': '\\t',
			'\n': '\\n',
			'\f': '\\f',
			'\r': '\\r',
			'"' : '\\"',
			'\\': '\\\\'
	};

	escapable.lastIndex = 0;
	return escapable.test(this) ?
			'"' + this.replace(escapable, function (a) {
				var c = meta[a];
				return typeof c === 'string' ? c :
					'\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
			}) + '"' :
				'"' + this + '"';
};

function LogError(e) {
	nlapiLogExecution('ERROR', 'Exception caught:', GetErrorDescription(e));
}

function GetErrorDescription(e) {
	return (e instanceof nlobjError) ? e.getCode() + ': ' + e.getDetails() : e.toString();
}
function AddItemToWeddingList(request, response) {
	var user = nlapiGetUser();
	var itemid = request.getParameter('item');
	var qty = request.getParameter('qty');
	qty = (qty && !isNaN(parseInt(qty))) ? parseInt(qty) : 1;

	if (user && user!="" && user!="-4" && itemid && itemid!="") {
		var cust_fields = nlapiLookupField("customer", user, ["custentity_bb1_weddinglist_active","custentity_bb1_weddinglist_activeclosed"]);
		var wl = cust_fields["custentity_bb1_weddinglist_active"];
		var closed = (cust_fields["custentity_bb1_weddinglist_activeclosed"]=="T") ? true : false;

		var itemoptions = request.getParameter('itemoptions');
		if (!isEmpty(itemoptions)) {
			var itemoptions2 = itemoptions.split("||");
			var filters = [new nlobjSearchFilter('parent', null, 'is', itemid),
			               new nlobjSearchFilter('matrixchild', null, 'is', 'T')];
			for (var i=0, l=itemoptions2.length; i < l; i++) {
				var itemoption = itemoptions2[i].split("|");
				filters.push(new nlobjSearchFilter(itemoption[0].replace("custcol", "custitem"), null, 'anyof', itemoption[1]));
			}
			var matrixchild = nlapiSearchRecord('item', null, filters);
			if (matrixchild && matrixchild.length > 0) {
				itemid = matrixchild[0].getId();
			}
		}

		if (wl && wl!="") {
			if (!closed) {
				var filters = new Array();
				filters[0] = new nlobjSearchFilter('custrecord_bb1_wli_parent', null, 'is', wl, null);
				filters[1] = new nlobjSearchFilter('custrecord_bb1_wli_item', null, 'is', itemid, null);
				var columns = new Array();
				columns[0] = new nlobjSearchColumn("custrecord_bb1_wli_qty");
				columns[1] = new nlobjSearchColumn("custrecord_bb1_wli_purchased");
				var results = nlapiSearchRecord('customrecord_bb1_wli', null, filters, columns);
				if (results && results.length>0) {
					var wliid = results[0].getId();
					var old_qty = parseInt(results[0].getValue("custrecord_bb1_wli_qty"));
					var purchased = parseInt(results[0].getValue("custrecord_bb1_wli_purchased"));
					if (wliid && wliid!="") {
						if (qty > 0) {
							nlapiSubmitField("customrecord_bb1_wli", wliid, "custrecord_bb1_wli_qty", qty + old_qty);
						}
						else {
							if (purchased == 0)
								nlapiDeleteRecord("customrecord_bb1_wli", wliid);
						}
					}
				}
				else {
					var wli = nlapiCreateRecord("customrecord_bb1_wli");
					wli.setFieldValue("custrecord_bb1_wli_parent", wl);
					wli.setFieldValue("custrecord_bb1_wli_item", itemid);
					wli.setFieldValue("custrecord_bb1_wli_qty", qty);
					wliid = nlapiSubmitRecord(wli, true);
				}
			}
		}
	}
	var redirect = request.getParameter("redirect");
	redirect = (redirect&&redirect!="") ? decodeURIComponent(redirect) : null;
	//if (referer && referer!="") response.sendRedirect("EXTERNAL", referer);
	if (redirect) response.write('<html><head><META http-equiv="refresh" content="3;URL='+redirect+'"><script type="text/javascript"> location.href="'+redirect+'"; </script></head><body><p>If you are not automatically redirect within 3 seconds <a href="'+redirect+'">please click this link</a> to return home.</body></html>');
}

function ManageWeddingList(request, response) {
	var page_size = nlapiGetContext().getSetting("SCRIPT", "custscript_bb1_wl_pagesize");
	var user = nlapiGetUser();
	var action = request.getParameter('action');
	var itemid = request.getParameter('item');
	var qty = request.getParameter('qty');
	qty = (qty && !isNaN(parseInt(qty))) ? parseInt(qty) : 1;
	var page = request.getParameter('page');
	page = (page && page=="all") ? 0 : (page && !isNaN(parseInt(page))) ? parseInt(page) : 1;
	if (user && user!="" && user!="-4") {
		var cust_fields = nlapiLookupField("customer", user, ["custentity_bb1_weddinglist_active","custentity_bb1_weddinglist_activeclosed"]);
		var wl = cust_fields["custentity_bb1_weddinglist_active"];
		var closed = (cust_fields["custentity_bb1_weddinglist_activeclosed"]=="T") ? true : false;
		if (wl && wl!="") {
			switch (action) {
			case "get":
				response.write(GetManageWeddingListPage(wl, closed, page, page_size));
				break;
			case "update":
				response.write(UpdateWeddingListQtys(request, wl, closed));
				break;
			}
		}
		else
			response.write("document.write('<p>You must create a wedding list first.<br /><br />To create a new list, click the <em>weddings > create a list</em> link in the top menu and register your details.</p>');");
	}
	else
		response.write("document.write('<p>You must be logged in to access this page.</p>'); $(document).ready(function() { $('#login-link > a').click(); });");
}

function ViewPurchasedItemsList(request, response) {
	var page_size = nlapiGetContext().getSetting("SCRIPT", "custscript_bb1_wl_pi_pagesize");
	var user = nlapiGetUser();
	var action = request.getParameter('action');
	var page = request.getParameter('page');
	page = (page && page=="all") ? 0 : (page && !isNaN(parseInt(page))) ? parseInt(page) : 1;
	if (user && user!="" && user!="-4") {
		var wl = nlapiLookupField("customer", user, "custentity_bb1_weddinglist_active");
		if (wl && wl!="") {
			switch (action) {
			case "get":
				response.write(GetPurchasedItemsListPage(wl, page, page_size));
				break;
			default:
				response.write("document.write('<p>No valid action specified.<br /><br />To view this page, log in, go to my account and click the <em>view purchased items</em> link in the menu.<br /><br />Please contact us if you continue to experience problems.</p>');");
			}
		}
		else
			response.write("document.write('<p>You must create a wedding list first.<br /><br />To create a new list, click the <em>weddings > create a list</em> link in the top menu and register your details.</p>');");
	}
	else
		response.write("document.write('<p>You must be logged in to access this page.</p>'); $('#login-link > a').click();");
}

function BrowseWeddingList(request, response) {
	var page_size = nlapiGetContext().getSetting("SCRIPT", "custscript_bb1_wl_browse_pagesize");
	var action = request.getParameter('action');
	var search_id = request.getParameter('search_id');
	var search_name1 = request.getParameter('search_name1');
	var search_name2 = request.getParameter('search_name2');
	var search_date = request.getParameter('search_date');
	var page = request.getParameter('page');
	page = (page && page=="all") ? 0 : (page && !isNaN(parseInt(page))) ? parseInt(page) : 1;
	var sortby = request.getParameter('sortby');
	sortby = (sortby && sortby.toLowerCase()=="price") ? sortby.toLowerCase() : "category";
	var sortorder = request.getParameter('sortorder');
	sortorder = (sortorder && sortorder.toLowerCase()=="desc") ? sortorder.toLowerCase() : "asc";
	switch (action) {
	case "get":
		response.write(GetBrowseWeddingListPage(search_id, page, page_size, sortby, sortorder));
		break;
	case "search":
		response.write(GetSearchWeddingListResultsPage(search_name1, search_name2, search_date, page, page_size));
		break;
	}
}

function GetManageWeddingListPage(list, closed, page, page_size) {
	var json = "", page_count = 0, record_count = 0, totalprice = 0;
	var tax_rates = GetTaxRates();
	var weddingdate = nlapiLookupField("customrecord_bb1_wl", list, "custrecord_bb1_wl_weddingdate");
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_parent", "is", "F", null);
	filters[2] = new nlobjSearchFilter("custrecord_bb1_wli_parent", null, "is", list, null);
	filters[3] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_item", "is", "F", null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("custrecord_bb1_wli_item");
	columns[1] = new nlobjSearchColumn("storedisplayname", "custrecord_bb1_wli_item");
	columns[2] = new nlobjSearchColumn("onlineprice", "custrecord_bb1_wli_item");
	columns[3] = new nlobjSearchColumn("quantityavailable", "custrecord_bb1_wli_item");
	columns[4] = new nlobjSearchColumn("thumbnailurl", "custrecord_bb1_wli_item");
	columns[5] = new nlobjSearchColumn("imageurl", "custrecord_bb1_wli_item");
	//columns[6] = new nlobjSearchColumn("category", "custrecord_bb1_wli_item");
	columns[6] = new nlobjSearchColumn("class", "custrecord_bb1_wli_item");
	columns[7] = new nlobjSearchColumn("custrecord_bb1_wli_qty");
	columns[8] = new nlobjSearchColumn("custrecord_bb1_wl_weddingdate", "custrecord_bb1_wli_parent");
	columns[9] = new nlobjSearchColumn("itemurl", "custrecord_bb1_wli_item");
	columns[10] = new nlobjSearchColumn("custrecord_bb1_wli_purchased");
	columns[11] = new nlobjSearchColumn("salestaxcode", "custrecord_bb1_wli_item");     
	columns[12] = new nlobjSearchColumn("displayname", "custrecord_bb1_wli_item");
	var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, columns);

	if (results && results.length>0) {

		var itemids = [];
		for (var j=0; j < results.length; j++) {
			itemids.push(results[j].getValue("custrecord_bb1_wli_item"));
		}

		// Get matrix parents first
		var filters = [new nlobjSearchFilter("internalid", null, "anyof", itemids),
		               new nlobjSearchFilter("matrixchild", null, "is", "T")];
		var columns = [new nlobjSearchColumn("thumbnailurl", "parent"),
		               new nlobjSearchColumn("imageurl", "parent"),
		               new nlobjSearchColumn("itemurl", "parent")];
		var matrixParents = nlapiSearchRecord("item", null, filters, columns);

		var matrixParentLookup = {};
		if (matrixParents && matrixParents.length > 0) {
			for (var j=0; j < matrixParents.length; j++) {
				matrixParentLookup[matrixParents[j].getId()] = matrixParents[j];
			}
		}

		results.sort(SortManageWeddingListResults);
		page_count = Math.ceil(results.length / page_size);
		record_count = results.length;
		var row_start = (page==0) ? 0 : (page<=1) ? 0 : (page-1)*page_size;
		var row_end = (page==0) ? results.length : row_start + page_size - 1;
		for (var i=row_start; i <= row_end && i < results.length; i++) {
			var itemid = results[i].getValue("custrecord_bb1_wli_item");
			var category = results[i].getText("class", "custrecord_bb1_wli_item");
			category = category.split(" > ");
			category = category[category.length-1];
			var price = results[i].getValue("onlineprice", "custrecord_bb1_wli_item");
			price = (price && !isNaN(parseFloat(price))) ? parseFloat(price) : 0;
			var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_wli_item");
			var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
			var price_inc = price*(1+salestaxrate);

			var storedisplayname = Nvl(results[i].getValue("storedisplayname", "custrecord_bb1_wli_item"), results[i].getValue("displayname", "custrecord_bb1_wli_item"));
			var itemurl = results[i].getValue("itemurl", "custrecord_bb1_wli_item");
			var thumbnailurl = results[i].getValue("thumbnailurl", "custrecord_bb1_wli_item");
			var imageurl = results[i].getValue("imageurl", "custrecord_bb1_wli_item");
			if (matrixParentLookup[itemid] != null) {
				storedisplayname = results[i].getValue("displayname", "custrecord_bb1_wli_item");
				itemurl = matrixParentLookup[itemid].getValue("itemurl", "parent");
				thumbnailurl = matrixParentLookup[itemid].getValue("thumbnailurl", "parent");
				imageurl = matrixParentLookup[itemid].getValue("imageurl", "parent");
			}

			json += '{"id":"'+results[i].getId()+'",';
			json += '"itemid":'+itemid.JSEncode()+',';
			json += '"description":'+storedisplayname.JSEncode()+',';
			json += '"price":"'+price_inc+'",';
			json += '"available":"'+results[i].getValue("quantityavailable", "custrecord_bb1_wli_item")+'",';
			json += '"thumbnail":'+thumbnailurl.JSEncode()+',';
			json += '"image":'+imageurl.JSEncode()+',';
			json += '"category":'+category.JSEncode()+',';
			json += '"url":'+itemurl.JSEncode()+',';
			json += '"qty":"'+results[i].getValue("custrecord_bb1_wli_qty")+'",';
			json += '"purchased":"'+results[i].getValue("custrecord_bb1_wli_purchased")+'"},';
		}
		for (var i=0; i < results.length; i++) {
			var price = results[i].getValue("onlineprice", "custrecord_bb1_wli_item");
			price = (price && !isNaN(parseFloat(price))) ? parseFloat(price) : 0;
			var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_wli_item");
			var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
			var price_inc = price*(1+salestaxrate);
			var quantity = results[i].getValue("custrecord_bb1_wli_qty");
			quantity = (quantity && !isNaN(parseInt(quantity))) ? parseInt(quantity) : 0;
			totalprice += price * quantity;
		}
	}
	json = (json!='') ? '[' + json.substr(0, json.length-1) + ']' : '[]';
	json = '{"closed":'+closed+', "weddingdate":"'+weddingdate+'", "totalprice":'+totalprice+', "page":'+page+', "page_size":'+page_size+', "page_count":'+page_count+', "record_count":'+record_count+', "results":'+json+'}';
	var js = "window['bb1_manage_wedding_list'] = new bb1ManageWeddingList("+json+");\r\n";
	js += "window['bb1_manage_wedding_list'].display();\r\n";
	return js;
}

function SortManageWeddingListResults(a, b) {
	var a_category = a.getText("class", "custrecord_bb1_wli_item").toLowerCase();
	a_category = a_category.split(" > ");
	a_category = a_category[a_category.length-1];
	var b_category = b.getText("class", "custrecord_bb1_wli_item").toLowerCase();
	b_category = b_category.split(" > ");
	b_category = b_category[b_category.length-1];
	if (a_category < b_category)
		return -1;
	else if (a_category > b_category)
		return 1;
	else {
		var a_name = a.getValue("storedisplayname", "custrecord_bb1_wli_item").toLowerCase();
		var b_name = b.getValue("storedisplayname", "custrecord_bb1_wli_item").toLowerCase();
		if (a_name < b_name)
			return -1;
		else if (a_name > b_name)
			return 1;
		else
			return 0;
	}
}

function GetTaxRates() {
	var tax_array = new Object();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F', null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('rate');
	var results = nlapiSearchRecord('salestaxitem', null, filters, columns);
	if (results) {
		for (var i=0; i < results.length; i++) {
			var taxrate = results[i].getValue('rate');
			tax_array[results[i].getValue('internalid')] = (taxrate && taxrate!='') ? parseFloat(taxrate.replace(/[^\d.]/g,""))/100 : 0;
		}
	}
	return tax_array;
}

function UpdateWeddingListQtys(request, list, closed) {
	if (!closed) {
		var parms = request.getAllParameters();
		for (parm in parms) {
			if (parm.search(/^item_/i)==0) {
				var id = parm.substr(5);
				var qty = parseInt(parms[parm]);
				if (id!="" && !isNaN(qty)) {
					var purchased = parseInt(nlapiLookupField("customrecord_bb1_wli",id,"custrecord_bb1_wli_purchased"));
					if (qty>0) {
						if (qty>=purchased)
							nlapiSubmitField("customrecord_bb1_wli",id,"custrecord_bb1_wli_qty",qty);
					}
					else {
						if (purchased==0)
							nlapiDeleteRecord("customrecord_bb1_wli", id);
					}
				}
			}
		}
	}
	var redirect = request.getParameter("redirect");
	redirect = (redirect&&redirect!="") ? decodeURIComponent(redirect) : null;
	return (redirect) ? '<html><head><META http-equiv="refresh" content="3;URL='+redirect+'"><script type="text/javascript"> location.href="'+redirect+'"; </script></head><body><p>If you are not automatically redirect within 3 seconds <a href="'+redirect+'">please click this link</a> to return home.</body></html>' : '';
}

function GetBrowseWeddingListPage(list, page, page_size, sortby, sortorder) {
	var json = "", js = "", message = "", image = "", listid = "", listholdername1 = "", listholdername2 = "", weddingdate = "", page_count = 0, record_count = 0, totalprice = 0;
	if (!list||!(/^(WL)?\d+$/i.test(list))) {
		js = "document.write('<p>No valid wedding list number was entered. Please go back and and re-enter your search.</p>');";
		return js;
	}
	if (/WL/i.test(list.substr(0, 2)))
		list_id = list.substr(2);
	var tax_rates = GetTaxRates();
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_parent", "is", "F", null);
	filters[2] = new nlobjSearchFilter("custrecord_bb1_wl_closed", "custrecord_bb1_wli_parent", "is", "F", null);
	filters[3] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_item", "is", "F", null);
	//filters[4] = new nlobjSearchFilter("name", "custrecord_bb1_wli_parent", "is", list, null);
	filters[4] = new nlobjSearchFilter("custrecord_bb1_wli_parent", null, "is", list_id, null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("custrecord_bb1_wli_item");
	columns[1] = new nlobjSearchColumn("storedisplayname", "custrecord_bb1_wli_item");
	columns[2] = new nlobjSearchColumn("onlineprice", "custrecord_bb1_wli_item");
	columns[3] = new nlobjSearchColumn("quantityavailable", "custrecord_bb1_wli_item");
	columns[4] = new nlobjSearchColumn("thumbnailurl", "custrecord_bb1_wli_item");
	columns[5] = new nlobjSearchColumn("imageurl", "custrecord_bb1_wli_item");
	//columns[6] = new nlobjSearchColumn("category", "custrecord_bb1_wli_item");
	columns[6] = new nlobjSearchColumn("class", "custrecord_bb1_wli_item");
	columns[7] = new nlobjSearchColumn("custrecord_bb1_wli_qty");
	columns[8] = new nlobjSearchColumn("itemurl", "custrecord_bb1_wli_item");
	columns[9] = new nlobjSearchColumn("custrecord_bb1_wli_purchased");
	columns[10] = new nlobjSearchColumn("salestaxcode", "custrecord_bb1_wli_item");     
	columns[11] = new nlobjSearchColumn("custrecord_bb1_wl_p1_firstname", "custrecord_bb1_wli_parent");
	columns[12] = new nlobjSearchColumn("custrecord_bb1_wl_p1_surname", "custrecord_bb1_wli_parent");
	columns[13] = new nlobjSearchColumn("custrecord_bb1_wl_p2_firstname", "custrecord_bb1_wli_parent");
	columns[14] = new nlobjSearchColumn("custrecord_bb1_wl_p2_surname", "custrecord_bb1_wli_parent");
	columns[15] = new nlobjSearchColumn("custrecord_bb1_wl_image", "custrecord_bb1_wli_parent");
	columns[16] = new nlobjSearchColumn("custrecord_bb1_wl_message", "custrecord_bb1_wli_parent");
	columns[17] = new nlobjSearchColumn("custrecord_bb1_wl_weddingdate", "custrecord_bb1_wli_parent");
	columns[18] = new nlobjSearchColumn("custrecord_bb1_wli_parent");
	columns[19] = new nlobjSearchColumn("displayname", "custrecord_bb1_wli_item");
	var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, columns);

	if (!results || results.length == 0) {
		filters[4] = new nlobjSearchFilter("custrecord_bb1_wl_oldcode", "custrecord_bb1_wli_parent", "is", list, null);
		results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, columns);
	}

	if (results && results.length>0) {

		var ds = new Array();
		var itemids = [];
		for (var j=0; j < results.length; j++) {
			if (parseInt(results[j].getValue("custrecord_bb1_wli_purchased")) < parseInt(results[j].getValue("custrecord_bb1_wli_qty")))
				ds[ds.length] = results[j];
			itemids.push(results[j].getValue("custrecord_bb1_wli_item"));
		}
		results = ds;

		if (results && results.length>0) {

			// Get matrix parents first
			var filters = [new nlobjSearchFilter("internalid", null, "anyof", itemids),
			               new nlobjSearchFilter("matrixchild", null, "is", "T")];
			var columns = [new nlobjSearchColumn("thumbnailurl", "parent"),
			               new nlobjSearchColumn("imageurl", "parent"),
			               new nlobjSearchColumn("itemurl", "parent")];
			var matrixParents = nlapiSearchRecord("item", null, filters, columns);

			var matrixParentLookup = {};
			if (matrixParents && matrixParents.length > 0) {
				for (var j=0; j < matrixParents.length; j++) {
					matrixParentLookup[matrixParents[j].getId()] = matrixParents[j];
				}
			}

			switch (sortorder) {
			case "desc":
				switch (sortby) {
				case "price":
					results.sort(SortBrowseWeddingListResultsByPriceDesc);
					break;
				case "category": default:
					results.sort(SortBrowseWeddingListResultsByCategoryAsc);
				}
				break;
			default:
				switch (sortby) {
				case "price":
					results.sort(SortBrowseWeddingListResultsByPriceAsc);
					break;
				case "category": default:
					results.sort(SortBrowseWeddingListResultsByCategoryAsc);
				}
			}
			listid = results[0].getValue("custrecord_bb1_wli_parent");
			listholdername1 = results[0].getValue("custrecord_bb1_wl_p1_firstname","custrecord_bb1_wli_parent")+' '+results[0].getValue("custrecord_bb1_wl_p1_surname","custrecord_bb1_wli_parent");
			listholdername2 = results[0].getValue("custrecord_bb1_wl_p2_firstname","custrecord_bb1_wli_parent")+' '+results[0].getValue("custrecord_bb1_wl_p2_surname","custrecord_bb1_wli_parent");
			message = results[0].getValue("custrecord_bb1_wl_message","custrecord_bb1_wli_parent");
			image = results[0].getText("custrecord_bb1_wl_image","custrecord_bb1_wli_parent");
			weddingdate = results[0].getValue("custrecord_bb1_wl_weddingdate","custrecord_bb1_wli_parent");
			page_count = Math.ceil(results.length / page_size);
			record_count = results.length;
			var row_start = (page==0) ? 0 : (page<=1) ? 0 : (page-1)*page_size;
			var row_end = (page==0) ? results.length : row_start + page_size - 1;
			for (var i=row_start; i <= row_end && i < results.length; i++) {
				var itemid = results[i].getValue("custrecord_bb1_wli_item");
				var category = results[i].getText("class", "custrecord_bb1_wli_item");
				category = category.split(" > ");
				category = category[category.length-1];
				var price = results[i].getValue("onlineprice", "custrecord_bb1_wli_item");
				price = (price && !isNaN(parseFloat(price))) ? parseFloat(price) : 0;
				var salestaxcode = results[i].getValue("salestaxcode", "custrecord_bb1_wli_item");
				var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
				var price_inc = price*(1+salestaxrate);

				var storedisplayname = Nvl(results[i].getValue("storedisplayname", "custrecord_bb1_wli_item"), results[i].getValue("displayname", "custrecord_bb1_wli_item"));
				var itemurl = results[i].getValue("itemurl", "custrecord_bb1_wli_item");
				var thumbnailurl = results[i].getValue("thumbnailurl", "custrecord_bb1_wli_item");
				var imageurl = results[i].getValue("imageurl", "custrecord_bb1_wli_item");
				if (matrixParentLookup[itemid] != null) {
					storedisplayname = results[i].getValue("displayname", "custrecord_bb1_wli_item");
					itemurl = matrixParentLookup[itemid].getValue("itemurl", "parent");
					thumbnailurl = matrixParentLookup[itemid].getValue("thumbnailurl", "parent");
					imageurl = matrixParentLookup[itemid].getValue("imageurl", "parent");
				}

				json += '{"id":"'+results[i].getId()+'",';
				json += '"itemid":'+itemid.JSEncode()+',';
				json += '"description":'+storedisplayname.JSEncode()+',';
				json += '"price":"'+price_inc+'",';
				json += '"available":"'+results[i].getValue("quantityavailable", "custrecord_bb1_wli_item")+'",';
				json += '"thumbnail":'+thumbnailurl.JSEncode()+',';
				json += '"image":'+imageurl.JSEncode()+',';
				json += '"category":'+category.JSEncode()+',';
				json += '"url":'+itemurl.JSEncode()+',';
				json += '"qty":"'+results[i].getValue("custrecord_bb1_wli_qty")+'",';
				json += '"purchased":"'+results[i].getValue("custrecord_bb1_wli_purchased")+'"},';
			}
		}
		else {
			js = "document.write('<p>Thank you for logging on to our wedding list. Unfortunately all our lovely gifts have been purchased already.</p>');";
			return js;
		}
	}
	else {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
		//filters[1] = new nlobjSearchFilter("name", null, "is", list, null);
		filters[1] = new nlobjSearchFilter("internalid", null, "is", list_id, null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("custrecord_bb1_wl_closed");
		var results = nlapiSearchRecord("customrecord_bb1_wl", null, filters, columns);
		if (results && results.length==1 && results[0].getValue("custrecord_bb1_wl_closed")=="T")
			js = "document.write('<p>This wedding list is now closed. You cannot view this wedding list any longer.</p>');";
		else
			js = "document.write('<p>No wedding list was found. Please go back and and re-enter your search.</p>');";
		return js;
	}
	json = (json!='') ? '[' + json.substr(0, json.length-1) + ']' : '[]';
	json = '{"listid":"'+listid+'", "listholdername1":"'+listholdername1+'", "listholdername2":"'+listholdername2+'", "weddingdate":"'+weddingdate+'", "image":"'+image+'", "message":"'+escape(message)+'", "page":'+page+', "page_size":'+page_size+', "page_count":'+page_count+', "record_count":'+record_count+', "sortby":"'+sortby+'", "sortorder":"'+sortorder+'", "results":'+json+'}';
	js = "window['bb1_browse_wedding_list'] = new bb1BrowseWeddingList("+json+");\r\n";
	js += "window['bb1_browse_wedding_list'].display();\r\n";
	return js;
}

function SortBrowseWeddingListResultsByPriceAsc(a, b) {
	var a_price = a.getValue("onlineprice", "custrecord_bb1_wli_item");
	a_price = (a_price && !isNaN(parseFloat(a_price))) ? parseFloat(a_price) : 0;
	var b_price = b.getValue("onlineprice", "custrecord_bb1_wli_item");
	b_price = (b_price && !isNaN(parseFloat(b_price))) ? parseFloat(b_price) : 0;
	return a_price - b_price;
}

function SortBrowseWeddingListResultsByPriceDesc(a, b) {
	var a_price = a.getValue("onlineprice", "custrecord_bb1_wli_item");
	a_price = (a_price && !isNaN(parseFloat(a_price))) ? parseFloat(a_price) : 0;
	var b_price = b.getValue("onlineprice", "custrecord_bb1_wli_item");
	b_price = (b_price && !isNaN(parseFloat(b_price))) ? parseFloat(b_price) : 0;
	return b_price - a_price;
}

function SortBrowseWeddingListResultsByCategoryAsc(a, b) {
	var a_category = a.getText("class", "custrecord_bb1_wli_item").toLowerCase();
	a_category = a_category.split(" > ");
	a_category = a_category[a_category.length-1];
	var b_category = b.getText("class", "custrecord_bb1_wli_item").toLowerCase();
	b_category = b_category.split(" > ");
	b_category = b_category[b_category.length-1];
	if (a_category < b_category)
		return -1;
	else if (a_category > b_category)
		return 1;
	else {
		var a_name = a.getValue("storedisplayname", "custrecord_bb1_wli_item").toLowerCase();
		var b_name = b.getValue("storedisplayname", "custrecord_bb1_wli_item").toLowerCase();
		if (a_name < b_name)
			return -1;
		else if (a_name > b_name)
			return 1;
		else
			return 0;
	}
}

function GetSearchWeddingListResultsPage(name1, name2, date, page, page_size) {
	var json = "", js = "", page_count = 0, record_count = 0;
	var search_name = (name1&&/[a-zA-Z]+/.test(name1) ? name1+" " : "") + (name2&&/[a-zA-Z]+/.test(name2) ? name2 : "");
	var search_date = (date&&date!="" ? date : "");
	if (search_name=="" && search_date=="") {
		js = "document.write('<p>No valid search was entered. Please go back and and re-enter your search.</p>');";
		return js;
	}
	var filters = new Array();
	filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_parent", "is", "F", null);
	filters[2] = new nlobjSearchFilter("custrecord_bb1_wl_closed", "custrecord_bb1_wli_parent", "is", "F", null);
	if (search_name!="")
		filters[filters.length] = new nlobjSearchFilter("name", "custrecord_bb1_wli_parent", "haskeywords", search_name, null);
	if (search_date!="")
		filters[filters.length] = new nlobjSearchFilter("custrecord_bb1_wl_weddingdate", "custrecord_bb1_wli_parent", "on", search_date, null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("custrecord_bb1_wli_parent",null,"group");
	columns[1] = new nlobjSearchColumn("name","custrecord_bb1_wli_parent","group");
	columns[2] = new nlobjSearchColumn("custrecord_bb1_wl_p1_firstname","custrecord_bb1_wli_parent","group");
	columns[3] = new nlobjSearchColumn("custrecord_bb1_wl_p1_surname","custrecord_bb1_wli_parent","group");
	columns[4] = new nlobjSearchColumn("custrecord_bb1_wl_p2_firstname","custrecord_bb1_wli_parent","group");
	columns[5] = new nlobjSearchColumn("custrecord_bb1_wl_p2_surname","custrecord_bb1_wli_parent","group");
	columns[6] = new nlobjSearchColumn("custrecord_bb1_wl_image","custrecord_bb1_wli_parent","group");
	columns[7] = new nlobjSearchColumn("custrecord_bb1_wl_message","custrecord_bb1_wli_parent","group");
	columns[8] = new nlobjSearchColumn("custrecord_bb1_wl_weddingdate","custrecord_bb1_wli_parent","group");
	var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, columns);
	if (results && results.length>0) {
		results.sort(SortSearchWeddingListResultsByNameAsc);
		page_count = Math.ceil(results.length / page_size);
		record_count = results.length;
		var row_start = (page==0) ? 0 : (page<=1) ? 0 : (page-1)*page_size;
		var row_end = (page==0) ? results.length : row_start + page_size - 1;
		for (var i=row_start; i <= row_end && i < results.length; i++) {
			json += '{"id":"'+results[i].getValue("name","custrecord_bb1_wli_parent","group")+'",';
			json += '"p1_firstname":'+results[i].getValue("custrecord_bb1_wl_p1_firstname","custrecord_bb1_wli_parent","group").JSEncode()+',';
			json += '"p1_surname":'+results[i].getValue("custrecord_bb1_wl_p1_surname","custrecord_bb1_wli_parent","group").JSEncode()+',';
			json += '"p2_firstname":'+results[i].getValue("custrecord_bb1_wl_p2_firstname","custrecord_bb1_wli_parent","group").JSEncode()+',';
			json += '"p2_surname":'+results[i].getValue("custrecord_bb1_wl_p2_surname","custrecord_bb1_wli_parent","group").JSEncode()+',';
			json += '"image":'+results[i].getText("custrecord_bb1_wl_image","custrecord_bb1_wli_parent","group").JSEncode()+',';
			json += '"message":"'+escape(results[i].getValue("custrecord_bb1_wl_message","custrecord_bb1_wli_parent","group"))+'",';
			json += '"weddingdate":"'+results[i].getValue("custrecord_bb1_wl_weddingdate","custrecord_bb1_wli_parent","group")+'"},';
		}
	}
	else {
		js = "document.write('<p>No results were found. Please go back and and re-enter your search.</p>');";
		return js;
	}
	json = (json!='') ? '[' + json.substr(0, json.length-1) + ']' : '[]';
	json = '{"page":'+page+', "page_size":'+page_size+', "page_count":'+page_count+', "record_count":'+record_count+', "results":'+json+'}';
	var js = "window['bb1_search_wedding_list'] = new bb1SearchWeddingList("+json+");\r\n";
	js += "window['bb1_search_wedding_list'].display();\r\n";
	return js;
}

function SortSearchWeddingListResultsByNameAsc(a, b) {
	var a_name = a.getValue("custrecord_bb1_wl_p1_firstname")+' '+a.getValue("custrecord_bb1_wl_p1_surname")+' & '+a.getValue("custrecord_bb1_wl_p2_firstname")+' '+a.getValue("custrecord_bb1_wl_p2_surname");
	var b_name = b.getValue("custrecord_bb1_wl_p1_firstname")+' '+b.getValue("custrecord_bb1_wl_p1_surname")+' & '+b.getValue("custrecord_bb1_wl_p2_firstname")+' '+b.getValue("custrecord_bb1_wl_p2_surname");
	a_name = a_name.toLowerCase();
	b_name = b_name.toLowerCase();
	return a_name - b_name;
}

function GetPurchasedItemsListPage(list, page, page_size) {
	var json = "", js = "", page_count = 0, record_count = 0;
	var giftids = GetWeddingListItemIds(list);

	var filters = new Array();
	filters[0] = new nlobjSearchFilter("voided", null, "is", "F", null);
	filters[1] = new nlobjSearchFilter("custcol_bb1_weddinggift2", null, "anyof", giftids, null);
	var columns = new Array();
	columns[0] = new nlobjSearchColumn("internalid");
	columns[1] = new nlobjSearchColumn("custbody_bb1_weddinggift_from");
	columns[2] = new nlobjSearchColumn("custbody_bb1_weddinggift_message");
	columns[3] = new nlobjSearchColumn("trandate");
	columns[4] = new nlobjSearchColumn("billaddress1");
	columns[5] = new nlobjSearchColumn("billcity");
	columns[6] = new nlobjSearchColumn("billzip");
	columns[7] = new nlobjSearchColumn("billcountry");
	columns[8] = new nlobjSearchColumn("storedisplayname", "item");
	columns[9] = new nlobjSearchColumn("itemurl", "item");
	columns[10] = new nlobjSearchColumn("custcol_bb1_weddinggift2");
	columns[11] = new nlobjSearchColumn("quantity");
	columns[12] = new nlobjSearchColumn("item");
	columns[13] = new nlobjSearchColumn("displayname", "item");
	var results = nlapiSearchRecord("salesorder", null, filters, columns);

	if (results && results.length>0) {

		var itemids = [];
		for (var j=0; j < results.length; j++) {
			itemids.push(results[j].getValue("item"));
		}

		// Get matrix parents first
		var filters = [new nlobjSearchFilter("internalid", null, "anyof", itemids),
		               new nlobjSearchFilter("matrixchild", null, "is", "T")];
		var columns = [new nlobjSearchColumn("thumbnailurl", "parent"),
		               new nlobjSearchColumn("imageurl", "parent"),
		               new nlobjSearchColumn("itemurl", "parent")];
		var matrixParents = nlapiSearchRecord("item", null, filters, columns);

		var matrixParentLookup = {};
		if (matrixParents && matrixParents.length > 0) {
			for (var j=0; j < matrixParents.length; j++) {
				matrixParentLookup[matrixParents[j].getId()] = matrixParents[j];
			}
		}

		results.sort(SortPurchasedItemsResultsByDateDesc);

		var ds = new Array(), k = 0;
		for (var j=0; j < results.length; j++) {

			var itemid = results[j].getValue("item");
			var storedisplayname = Nvl(results[j].getValue("storedisplayname", "item"), results[j].getValue("displayname", "item"));
			var itemurl = results[j].getValue("itemurl", "item");
			if (matrixParentLookup[itemid] != null) {
				storedisplayname = results[j].getValue("displayname", "item");
				itemurl = matrixParentLookup[itemid].getValue("itemurl", "parent");
			}

			if ((k==0) || (ds[k-1].internalid!=results[j].getId())) {
				ds[k] = new Object();
				ds[k].internalid = results[j].getId();
				ds[k].name = results[j].getValue("custbody_bb1_weddinggift_from");
				ds[k].giftid = results[j].getValue("custcol_bb1_weddinggift2");
				ds[k].itemnames = new Array(storedisplayname);
				ds[k].itemurls = new Array(itemurl);
				ds[k].quantities = new Array(results[j].getValue("quantity"));
				ds[k].message = results[j].getValue("custbody_bb1_weddinggift_message");
				ds[k].address = results[j].getValue("billaddress1")+", "+results[j].getValue("billcity")+" "+results[j].getValue("billzip")+(results[j].getValue("billcountry")!="GB"?" "+results[j].getText("billcountry"):"");
				ds[k].date = results[j].getValue("trandate");
				k++;
			}
			else {
				ds[k-1].itemnames[ds[k-1].itemnames.length] = storedisplayname;
				ds[k-1].itemurls[ds[k-1].itemurls.length] = itemurl;
				ds[k-1].quantities[ds[k-1].quantities.length] = results[j].getValue("quantity");
			}
		}
		page_count = Math.ceil(ds.length / page_size);
		record_count = ds.length;
		var row_start = (page==0) ? 0 : (page<=1) ? 0 : (page-1)*page_size;
		var row_end = (page==0) ? ds.length : row_start + page_size - 1;
		for (var i=row_start; i <= row_end && i < ds.length; i++) {
			json += '{"name":"'+ds[i].name+'",';
			json += '"id":"'+ds[i].giftid+'",';
			json += '"items":["'+ds[i].itemnames.join('","')+'"],';
			json += '"itemurls":["'+ds[i].itemurls.join('","')+'"],';
			json += '"quantities":['+ds[i].quantities.join(',')+'],';
			json += '"message":"'+escape(ds[i].message)+'",';
			json += '"address":"'+escape(ds[i].address)+'",';
			json += '"datepurchased":"'+ds[i].date+'"},';
		}
	}
	else {
		js = "document.write('<p>No items have been purchased yet.</p>');";
		return js;
	}
	json = (json!='') ? '[' + json.substr(0, json.length-1) + ']' : '[]';
	json = '{"page":'+page+', "page_size":'+page_size+', "page_count":'+page_count+', "record_count":'+record_count+', "results":'+json+'}';
	js = "window['bb1_purchased_items_list'] = new bb1PurchasedItemsList("+json+");\r\n";
	js += "window['bb1_purchased_items_list'].display();\r\n";
	return js;
}

function SortPurchasedItemsResultsByDateDesc(a, b) {
	var a_date = nlapiStringToDate(a.getValue("trandate"));
	var b_date = nlapiStringToDate(b.getValue("trandate"));
	if (a_date < b_date) {
		return 1;
	}
	else if (a_date > b_date) {
		return -1;
	}
	else {
		var a_id = parseInt(a.getId());
		var b_id = parseInt(b.getId());
		return a_id - b_id;
	}
}

function GetWeddingListItemIds(wl) {
	var a = new Array();
	if (wl&&wl!="") {
		var filters = new Array();
		filters[0] = new nlobjSearchFilter("isinactive", null, "is", "F", null);
		filters[1] = new nlobjSearchFilter("isinactive", "custrecord_bb1_wli_parent", "is", "F", null);
		filters[2] = new nlobjSearchFilter("custrecord_bb1_wli_parent", null, "is", wl, null);
		var results = nlapiSearchRecord("customrecord_bb1_wli", null, filters, null);
		if (results) {
			for (var i=0; i < results.length; i++) {
				a[i] = parseInt(results[i].getId());
			}
		}
	}
	return a;
}

function BuyGiftForm(request, response) {
	var order_submitted = request.getParameter('custpage_ordersubmitted');
	if (order_submitted=="T") {
		SubmitBuyGiftForm(request, response);
	}
	else {
		DisplayBuyGiftForm(request, response);
	}
}

function DisplayBuyGiftForm(request, response) {
	var context = nlapiGetContext();
	var template_file_id = context.getSetting("SCRIPT", "custscript_bb1_wl_buygift_pagehtml");
	var template_file = nlapiLoadFile(template_file_id);
	var page_template = template_file.getValue(); 
	var wlid = request.getParameter('wl');
	if (!wlid || wlid=="") {
		var content_section = "<h1>An error occurred</h1><p>No wedding list has been been specified. Please contact us for support.</p>";
		var html = page_template.replace("<CONTENT_SECTION>", content_section);
		response.write(html);
		return;
	}
	var itemids = request.getParameterValues("itemid");
	if (!itemids || itemids.length==0) {
		var content_section = "<h1>An error occurred</h1><p>No wedding items have been been specified. Please contact us for support.</p>";
		var html = page_template.replace("<CONTENT_SECTION>", content_section);
		response.write(html);
		return;
	}
	var giftids = request.getParameterValues("giftid");
	var qtys = request.getParameterValues("quantity");
	var cart_html = BuildBuyGiftCartHTML(itemids, giftids, qtys);
	var content_section = '<div class="form doves"><h1>Buy a gift</h1><p>You have selected the following gifts</p><p>* Must be filled in</p><form id="buygift" name="buygift" method="post"  action="#">'+cart_html+'<fieldset><div class="clear"><h2><span>Guest details</span></h2></div><legend>Guest details</legend><p>These details will be passed on to the List Holder(s) in their regular update of purchases.</p><div class="field clear"><div class="label"><label for="custpage_giftfrom">*Who the gift is from</label></div><div class="element"><input type="text" name="custpage_giftfrom" id="custpage_giftfrom" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_giftmessage">A personalised gift message</label></div><div class="element"><textarea name="custpage_giftmessage" id="custpage_giftmessage" rows="5" cols="37"></textarea></div></div></fieldset><fieldset><div class="clear"><h2><span>Your contact details</span></h2></div><legend>Your contact details</legend><p>These details will only be used if we have a query regarding your purchase.</p><div class="field clear"><div class="label"><label for="custpage_title">Title</label></div><div class="element"><input type="text" name="custpage_title" id="custpage_title" class="text" size="20" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_firstname">*First name</label></div><div class="element"><input type="text" name="custpage_firstname" id="custpage_firstname" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_lastname">*Surname</label></div><div class="element"><input type="text" name="custpage_lastname" id="custpage_lastname" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_phone">*Telephone number</label></div><div class="element"><input type="text" name="custpage_phone" id="custpage_phone" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_email">*Email address</label></div><div class="element"><input type="text" name="custpage_email" id="custpage_email" class="text required email" size="40" value="" /></div></div><div class="field radio clear"><div class="label">&nbsp;</div><div class="element">				<input type="checkbox" name="custpage_subscribe" id="custpage_subscribe" class="radio" checked="checked" value="T" /><label for="custpage_subscribe">Susie Watson Designs will send you relevant product information from time to time and will not pass this information on to any other third parties. If you would prefer not to receive this information please uncheck the box.</label></div></div></fieldset><fieldset><div class="clear"><h2><span>Payment details</span></h2></div><legend>Payment details</legend><div class="field clear"><div class="label"><label for="custpage_paymentmethod">*Select your payment method</label></div><div class="element">				<select name="custpage_paymentmethod" id="custpage_paymentmethod" class="required"><option value=""></option><option value="5">Visa</option><option value="4">Master Card</option><option value="7" debit="true">Switch</option><option value="9" debit="true">Solo</option><option value="8" debit="true">Maestro</option><option value="11" debit="true">Laser</option><option value="10" debit="true">JCB</option><option value="3">Discover</option></select></div></div><div class="field clear"><div class="label"><label for="custpage_cardname">*Name on card</label></div><div class="element">				<input type="text" name="custpage_cardname" id="custpage_cardname" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_cardnumber">*Card number</label></div><div class="element">				<input type="text" name="custpage_cardnumber" id="custpage_cardnumber" class="text required creditcard" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_cardvalidfrom">*Valid from date</label></div><div class="element">				<input type="text" name="custpage_cardvalidfrom" id="custpage_cardvalidfrom" class="text creditcarddate" size="20" value="" /></div><div class="message"><label for="custpage_cardvalidfrom"><em>(mm/yyyy)</em></label></div></div><div class="field clear"><div class="label"><label for="custpage_cardexpires">*Expiry date</label></div><div class="element">				<input type="text" name="custpage_cardexpires" id="custpage_cardexpires" class="text required creditcarddate" size="20" value="" /></div><div class="message"><label for="custpage_cardexpires"><em>(mm/yyyy)</em></label></div></div><div class="field clear"><div class="label"><label for="custpage_cardissuenumber">*Issue number<br />(if shown on card)</label></div><div class="element">				<input type="text" name="custpage_cardissuenumber" id="custpage_cardissuenumber" class="text" size="20" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_csc">*Card Verification Value<br />(as show on back of card)</label></div><div class="element">				<input type="text" name="custpage_csc" id="custpage_csc" class="text required" size="20" value="" /></div></div></fieldset><fieldset><div class="clear"><h2><span>Statement address</span></h2></div><legend>Statement address</legend><div class="field clear"><div class="label"><label for="custpage_billaddress1">*Address 1</label></div><div class="element"><input type="text" name="custpage_billaddress1" id="custpage_billaddress1" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_billaddress2">Address 2</label></div><div class="element"><input type="text" name="custpage_billaddress2" id="custpage_billaddress2" class="text" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_billcity">*Town</label></div><div class="element"><input type="text" name="custpage_billcity" id="custpage_billcity" class="text required" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_billcounty">County</label></div><div class="element"><input type="text" name="custpage_billcounty" id="custpage_billcounty" class="text" size="40" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_billpostcode">*Postcode</label></div><div class="element"><input type="text" name="custpage_billpostcode" id="custpage_billpostcode" class="text required" size="20" value="" /></div></div><div class="field clear"><div class="label"><label for="custpage_billcountry">*Country</label></div><div class="element"><select name="custpage_billcountry" id="custpage_billcountry" class="required"><option value="AF">Afghanistan</option><option value="AL">Albania</option><option value="DZ">Algeria</option><option value="AS">American Samoa</option><option value="AD">Andorra</option><option value="AO">Angola</option><option value="AI">Anguilla</option><option value="AQ">Antarctica</option><option value="AG">Antigua and Barbuda</option><option value="AR">Argentina</option><option value="AM">Armenia</option><option value="AW">Aruba</option><option value="AU">Australia</option><option value="AT">Austria</option><option value="AZ">Azerbaijan</option><option value="BS">Bahamas</option><option value="BH">Bahrain</option><option value="BD">Bangladesh</option><option value="BB">Barbados</option><option value="BY">Belarus</option><option value="BE">Belgium</option><option value="BZ">Belize</option><option value="BJ">Benin</option><option value="BM">Bermuda</option><option value="BT">Bhutan</option><option value="BO">Bolivia</option><option value="BA">Bosnia and Herzegovina</option><option value="BW">Botswana</option><option value="BV">Bouvet Island</option><option value="BR">Brazil</option><option value="IO">British Indian Ocean Territory</option><option value="BN">Brunei Darussalam</option><option value="BG">Bulgaria</option><option value="BF">Burkina Faso</option><option value="BI">Burundi</option><option value="KH">Cambodia</option><option value="CM">Cameroon</option><option value="CA">Canada</option><option value="CV">Cap Verde</option><option value="KY">Cayman Islands</option><option value="CF">Central African Republic</option><option value="TD">Chad</option><option value="CL">Chile</option><option value="CN">China</option><option value="CX">Christmas Island</option><option value="CC">Cocos (Keeling) Islands</option><option value="CO">Colombia</option><option value="KM">Comoros</option><option value="CD">Congo, Democratic People"s Republic</option><option value="CG">Congo, Republic of</option><option value="CK">Cook Islands</option><option value="CR">Costa Rica</option><option value="CI">Cote d"Ivoire</option><option value="HR">Croatia/Hrvatska</option><option value="CU">Cuba</option><option value="CY">Cyprus</option><option value="CZ">Czech Republic</option><option value="DK">Denmark</option><option value="DJ">Djibouti</option><option value="DM">Dominica</option><option value="DO">Dominican Republic</option><option value="TP">East Timor</option><option value="EC">Ecuador</option><option value="EG">Egypt</option><option value="SV">El Salvador</option><option value="GQ">Equatorial Guinea</option><option value="ER">Eritrea</option><option value="EE">Estonia</option><option value="ET">Ethiopia</option><option value="FK">Falkland Islands (Malvina)</option><option value="FO">Faroe Islands</option><option value="FJ">Fiji</option><option value="FI">Finland</option><option value="FR">France</option><option value="GF">French Guiana</option><option value="PF">French Polynesia</option><option value="TF">French Southern Territories</option><option value="GA">Gabon</option><option value="GM">Gambia</option><option value="GE">Georgia</option><option value="DE">Germany</option><option value="GH">Ghana</option><option value="GI">Gibraltar</option><option value="GR">Greece</option><option value="GL">Greenland</option><option value="GD">Grenada</option><option value="GP">Guadeloupe</option><option value="GU">Guam</option><option value="GT">Guatemala</option><option value="GG">Guernsey</option><option value="GN">Guinea</option><option value="GW">Guinea-Bissau</option><option value="GY">Guyana</option><option value="HT">Haiti</option><option value="HM">Heard and McDonald Islands</option><option value="VA">Holy See (City Vatican State)</option><option value="HN">Honduras</option><option value="HK">Hong Kong</option><option value="HU">Hungary</option><option value="IS">Iceland</option><option value="IN">India</option><option value="ID">Indonesia</option><option value="IR">Iran (Islamic Republic of)</option><option value="IQ">Iraq</option><option value="IE">Ireland</option><option value="IM">Isle of Man</option><option value="IL">Israel</option><option value="IT">Italy</option><option value="JM">Jamaica</option><option value="JP">Japan</option><option value="JE">Jersey</option><option value="JO">Jordan</option><option value="KZ">Kazakhstan</option><option value="KE">Kenya</option><option value="KI">Kiribati</option><option value="KP">Korea, Democratic People"s Republic</option><option value="KR">Korea, Republic of</option><option value="KW">Kuwait</option><option value="KG">Kyrgyzstan</option><option value="LA">Lao People"s Democratic Republic</option><option value="LV">Latvia</option><option value="LB">Lebanon</option><option value="LS">Lesotho</option><option value="LR">Liberia</option><option value="LY">Libyan Arab Jamahiriya</option><option value="LI">Liechtenstein</option><option value="LT">Lithuania</option><option value="LU">Luxembourg</option><option value="MO">Macau</option><option value="MK">Macedonia</option><option value="MG">Madagascar</option><option value="MW">Malawi</option><option value="MY">Malaysia</option><option value="MV">Maldives</option><option value="ML">Mali</option><option value="MT">Malta</option><option value="MH">Marshall Islands</option><option value="MQ">Martinique</option><option value="MR">Mauritania</option><option value="MU">Mauritius</option><option value="YT">Mayotte</option><option value="MX">Mexico</option><option value="FM">Micronesia, Federal State of</option><option value="MD">Moldova, Republic of</option><option value="MC">Monaco</option><option value="MN">Mongolia</option><option value="ME">Montenegro</option><option value="MS">Montserrat</option><option value="MA">Morocco</option><option value="MZ">Mozambique</option><option value="MM">Myanmar</option><option value="NA">Namibia</option><option value="NR">Nauru</option><option value="NP">Nepal</option><option value="NL">Netherlands</option><option value="AN">Netherlands Antilles</option><option value="NC">New Caledonia</option><option value="NZ">New Zealand</option><option value="NI">Nicaragua</option><option value="NE">Niger</option><option value="NG">Nigeria</option><option value="NU">Niue</option><option value="NF">Norfolk Island</option><option value="MP">Northern Mariana Islands</option><option value="NO">Norway</option><option value="OM">Oman</option><option value="PK">Pakistan</option><option value="PW">Palau</option><option value="PS">Palestinian Territories</option><option value="PA">Panama</option><option value="PG">Papua New Guinea</option><option value="PY">Paraguay</option><option value="PE">Peru</option><option value="PH">Philippines</option><option value="PN">Pitcairn Island</option><option value="PL">Poland</option><option value="PT">Portugal</option><option value="PR">Puerto Rico</option><option value="QA">Qatar</option><option value="RE">Reunion Island</option><option value="RO">Romania</option><option value="RU">Russian Federation</option><option value="RW">Rwanda</option><option value="BL">Saint Barthlemy</option><option value="KN">Saint Kitts and Nevis</option><option value="LC">Saint Lucia</option><option value="MF">Saint Martin</option><option value="VC">Saint Vincent and the Grenadines</option><option value="SM">San Marino</option><option value="ST">Sao Tome and Principe</option><option value="SA">Saudi Arabia</option><option value="SN">Senegal</option><option value="CS">Serbia</option><option value="SC">Seychelles</option><option value="SL">Sierra Leone</option><option value="SG">Singapore</option><option value="SK">Slovak Republic</option><option value="SI">Slovenia</option><option value="SB">Solomon Islands</option><option value="SO">Somalia</option><option value="ZA">South Africa</option><option value="GS">South Georgia</option><option value="ES">Spain</option><option value="LK">Sri Lanka</option><option value="SH">St. Helena</option><option value="PM">St. Pierre and Miquelon</option><option value="SD">Sudan</option><option value="SR">Suriname</option><option value="SJ">Svalbard and Jan Mayen Islands</option><option value="SZ">Swaziland</option><option value="SE">Sweden</option><option value="CH">Switzerland</option><option value="SY">Syrian Arab Republic</option><option value="TW">Taiwan</option><option value="TJ">Tajikistan</option><option value="TZ">Tanzania</option><option value="TH">Thailand</option><option value="TG">Togo</option><option value="TK">Tokelau</option><option value="TO">Tonga</option><option value="TT">Trinidad and Tobago</option><option value="TN">Tunisia</option><option value="TR">Turkey</option><option value="TM">Turkmenistan</option><option value="TC">Turks and Caicos Islands</option><option value="TV">Tuvalu</option><option value="UG">Uganda</option><option value="UA">Ukraine</option><option value="AE">United Arab Emirates</option><option value="GB" selected>United Kingdom</option><option value="US">United States</option><option value="UY">Uruguay</option><option value="UM">US Minor Outlying Islands</option><option value="UZ">Uzbekistan</option><option value="VU">Vanuatu</option><option value="VE">Venezuela</option><option value="VN">Vietnam</option><option value="VG">Virgin Islands (British)</option><option value="VI">Virgin Islands (USA)</option><option value="WF">Wallis and Futuna Islands</option><option value="EH">Western Sahara</option><option value="WS">Western Samoa</option><option value="YE">Yemen</option><option value="ZM">Zambia</option><option value="ZW">Zimbabwe</option></select></div></div></fieldset><fieldset><div class="field radio clear"><div class="label">&nbsp;</div><div class="element">				<input type="checkbox" name="custpage_tac" id="custpage_tac" class="radio required" value="T" /><label for="custpage_tac">I agree to the <a href="http://www.susiewatsondesigns.co.uk/info/Terms-conditions" target="_blank">Terms and Conditions</a></label></div></div><div class="field submit clear"><div class="label">&nbsp;</div><div class="element"><input type="submit" name="buy-submit" id="buy-submit" class="submit" value="Pay now" /></div></div></fieldset>	<input type="hidden" name="custpage_wl" id="custpage_wl" value="'+wlid+'" /><input type="hidden" name="custpage_ordersubmitted" id="custpage_ordersubmitted" value="T" /></form></div>';
	var html = page_template.replace("<CONTENT_SECTION>", content_section);
	response.write(html);
}

function SubmitBuyGiftForm(request, response) {
	var context = nlapiGetContext();
	var template_file_id = context.getSetting("SCRIPT", "custscript_bb1_wl_buygift_pagehtml");
	var template_file = nlapiLoadFile(template_file_id);
	var page_template = template_file.getValue(); 
	try {
		var wlid = request.getParameter('custpage_wl');
		if (!wlid || wlid=="") {
			var content_section = "<h1>An error occurred</h1><p>No wedding list has been been specified. Please contact us for support.</p>";
			var html = page_template.replace("<CONTENT_SECTION>", content_section);
			response.write(html);
			return;
		}
		var wl_fields = nlapiLookupField("customrecord_bb1_wl",wlid,["custrecord_bb1_wl_customer","name"]);
		var wl_name = wl_fields["name"];
		var custid = wl_fields["custrecord_bb1_wl_customer"];
		if (!custid || custid=="") {
			var content_section = "<h1>An error occurred</h1><p>Wedding list holder not found. Order cannot be placed. Please contact us for support.</p>";
			var html = page_template.replace("<CONTENT_SECTION>", content_section);
			response.write(html);
			return;
		}
		var itemids = request.getParameterValues("itemid");
		if (!itemids || itemids.length==0) {
			var content_section = "<h1>An error occurred</h1><p>No wedding items have been been specified. Please contact us for support.</p>";
			var html = page_template.replace("<CONTENT_SECTION>", content_section);
			response.write(html);
			return;
		}
		var giftids = request.getParameterValues("giftid");
		var qtys = request.getParameterValues("qty");
		// check if lead exists
		var filters = new Array();
		filters[0] = new nlobjSearchFilter("firstname", null, "is", request.getParameter("custpage_firstname"), null);
		filters[1] = new nlobjSearchFilter("lastname", null, "is", request.getParameter("custpage_lastname"), null);
		filters[2] = new nlobjSearchFilter("email", null, "is", request.getParameter("custpage_email"), null);
		var results = nlapiSearchRecord("customer", null, filters, null);
		var cid = null;
		var buyer_name = request.getParameter("custpage_firstname")+" "+request.getParameter("custpage_lastname");
		var buyer_email = request.getParameter("custpage_email");
		if (results && results.length>0) {
			cid = results[0].getId();
		}
		else {
			try {
				var c = nlapiCreateRecord("lead");
				c.setFieldValue("isperson", "T");
				c.setFieldValue("entityid", buyer_name); // make sure entityid is unique
				c.setFieldValue("salutation", request.getParameter("custpage_title"));
				c.setFieldValue("firstname", request.getParameter("custpage_firstname"));
				c.setFieldValue("lastname", request.getParameter("custpage_lastname"));
				c.setFieldValue("phone", request.getParameter("custpage_phone"));
				c.setFieldValue("email", buyer_email);
				c.setFieldValue("leadsource", 58);
				c.setFieldValue("category", 6);
				c.setFieldValue("unsubscribe", (request.getParameter("custpage_subscribe")=="T" ? "F" : "T"));
				/*c.insertLineItem("creditcards", 1);
    c.setLineItemValue("creditcards", "paymentmethod", 1, request.getParameter("custpage_paymentmethod"));
    c.setLineItemValue("creditcards", "ccname", 1, request.getParameter("custpage_cardname"));
    c.setLineItemValue("creditcards", "ccnumber", 1, request.getParameter("custpage_cardnumber"));
    c.setLineItemValue("creditcards", "validfrom", 1, request.getParameter("custpage_cardvalidfrom"));
    c.setLineItemValue("creditcards", "ccexpiredate", 1, request.getParameter("custpage_cardexpires"));
    c.setLineItemValue("creditcards", "debitcardissueno", 1, request.getParameter("custpage_cardissuenumber"));
    c.setLineItemValue("creditcards", "ccsecuritycode", 1, request.getParameter("custpage_csc"));
    c.setLineItemValue("creditcards", "ccdefault", 1, "T");*/
				cid = nlapiSubmitRecord(c, true);
			}
			catch (e) { LogError(e); }
		}
		var so = nlapiCreateRecord("salesorder");
		so.setFieldValue("entity", custid);
		so.setFieldValue("location", 3);
		so.setFieldValue("department", 11);
		so.setFieldValue("memo", "Wedding Gift ("+wl_name+")");
		if (cid) so.setFieldValue("custbody_bb1_weddinggift_buyer", cid);
		so.setFieldValue("custbody_bb1_weddinggift_from", request.getParameter("custpage_giftfrom"));
		so.setFieldValue("custbody_bb1_weddinggift_message", request.getParameter("custpage_giftmessage"));
		so.setFieldValue("paymentmethod", request.getParameter("custpage_paymentmethod"));
		//so.setFieldValue("creditcard", 1); // if using card details stored on the customers record
		so.setFieldValue("getauth", "T");
		so.setFieldValue("ccname", request.getParameter("custpage_cardname"));
		so.setFieldValue("ccnumber", request.getParameter("custpage_cardnumber"));
		so.setFieldValue("validfrom", request.getParameter("custpage_cardvalidfrom"));
		so.setFieldValue("ccexpiredate", request.getParameter("custpage_cardexpires"));
		so.setFieldValue("debitcardissueno", request.getParameter("custpage_cardissuenumber"));
		so.setFieldValue("ccsecuritycode", request.getParameter("custpage_csc"));
		so.setFieldValue("cczipcode", request.getParameter("custpage_billpostcode"));
		so.setFieldValue("ccstreet", request.getParameter("custpage_billaddress1"));
		so.setFieldValue("billaddresslist", "-2");
		so.setFieldValue("billaddress", buyer_name+"\r\n"+request.getParameter("custpage_billaddress1")+"\r\n"+request.getParameter("custpage_billaddress2")+"\r\n"+request.getParameter("custpage_billcity")+"r\n"+request.getParameter("custpage_billcounty")+"\r\n"+request.getParameter("custpage_billpostcode")+"\r\n"+request.getParameter("custpage_billcountry"));
		so.setFieldValue("billattention", request.getParameter("custpage_firstname")+" "+request.getParameter("custpage_lastname"));
		so.setFieldValue("billaddr1", request.getParameter("custpage_billaddress1"));
		so.setFieldValue("billaddr2", request.getParameter("custpage_billaddress2"));
		so.setFieldValue("billcity", request.getParameter("custpage_billcity"));
		so.setFieldValue("billstate", request.getParameter("custpage_billcounty"));
		so.setFieldValue("billzip", request.getParameter("custpage_billpostcode"));
		so.setFieldValue("billcountry", request.getParameter("custpage_billcountry"));
		so.setFieldValue("billphone", request.getParameter("custpage_phone"));
		so.setFieldValue("shipmethod", "");
		so.setFieldValue("shipdate", "");
		so.setFieldValue("shippingcost", 0);
		//storeorder
		var linecount = 1;
		for (var i=0; i < itemids.length; i++) {
			var itemid = itemids[i];
			var giftid = giftids[i];
			var qty_int = (qtys[i]&&!isNaN(parseInt(qtys[i]))) ? parseInt(qtys[i]) : 0;
			if (itemid!="" && giftid!="" && qty_int>0) {
				so.insertLineItem("item", linecount);
				so.setLineItemValue("item", "item", linecount, itemid);
				so.setLineItemValue("item", "quantity", linecount, qty_int);
				so.setLineItemValue("item", "custcol_bb1_weddinggift", linecount, giftid);
				so.setLineItemValue("item", "custcol_bb1_weddinggift2", linecount, giftid);
				so.setLineItemValue("item", "price", linecount, 5);
				linecount++;
			}
		}
		var soid = nlapiSubmitRecord(so, true);
		SendGiftPurchaseEmail(soid, buyer_name, buyer_email);
		var content_section = "<h1>success</h1><p>Thanks for using our wedding gift service. You will receive an email shortly to confirm your purchase.</p><p>Do not refresh this page otherwise your order will be re-submitted.</p>";
		var html = page_template.replace("<CONTENT_SECTION>", content_section);
		response.write(html);
	}
	catch (e) {
		var content_section = "<h1>An error occurred</h1><p>Please return to the previous page and make sure your details are correct then re-submit the form. If you continue to see this message please contact us for support</p><p>"+(e.getDetails?e.getDetails():e.toString())+"</p>";
		var html = page_template.replace("<CONTENT_SECTION>", content_section);
		response.write(html);
	}
}

function SendGiftPurchaseEmail(id, name, recipient) {
	try {
		if (!id || id=="") return;
		var sender = nlapiGetContext().getSetting("SCRIPT", "custscript_bb1_wl_buygift_emailsender");
		var filters = new Array();
		filters[0] = new nlobjSearchFilter("internalid", null, "is", id, null);
		filters[1] = new nlobjSearchFilter("mainline", null, "is", "F", null);
		filters[2] = new nlobjSearchFilter("shipping", null, "is", "F", null);
		filters[3] = new nlobjSearchFilter("taxline", null, "is", "F", null);
		var columns = new Array();
		columns[0] = new nlobjSearchColumn("tranid");
		columns[1] = new nlobjSearchColumn("storedisplayname", "item");
		columns[2] = new nlobjSearchColumn("quantity");
		columns[3] = new nlobjSearchColumn("amount");
		columns[4] = new nlobjSearchColumn("taxamount");
		columns[5] = new nlobjSearchColumn("grossamount");
		columns[6] = new nlobjSearchColumn("total");
		columns[7] = new nlobjSearchColumn("displayname", "item");
		columns[8] = new nlobjSearchColumn("item");
		//columns[7] = new nlobjSearchColumn("custbody_bb1_weddinggift_list");
		//columns[8] = new nlobjSearchColumn("custbody_bb1_weddinggift_from");
		//columns[9] = new nlobjSearchColumn("custbody_bb1_weddinggift_message");
		//columns[10] = new nlobjSearchColumn("line");
		var results = nlapiSearchRecord("salesorder", null, filters, columns);
		if (results && results.length>0) {

			var itemids = [];
			for (var j=0; j < results.length; j++) {
				itemids.push(results[j].getValue("item"));
			}

			// Get matrix parents first
			var filters = [new nlobjSearchFilter("internalid", null, "anyof", itemids),
			               new nlobjSearchFilter("matrixchild", null, "is", "T")];
			var columns = [new nlobjSearchColumn("thumbnailurl", "parent"),
			               new nlobjSearchColumn("imageurl", "parent"),
			               new nlobjSearchColumn("itemurl", "parent")];
			var matrixParents = nlapiSearchRecord("item", null, filters, columns);

			var matrixParentLookup = {};
			if (matrixParents && matrixParents.length > 0) {
				for (var j=0; j < matrixParents.length; j++) {
					matrixParentLookup[matrixParents[j].getId()] = matrixParents[j];
				}
			}

			var ordernum = results[0].getValue("tranid");
			var subtotal = "";
			var vattotal = "";
			var total = results[0].getValue("total");
			var html = "<html><head><style>.smalltext { font-size: 9pt; }.texttable  { font-size: 10pt; padding: 2 0 2 0 ; border-style: solid; border-width: 1 1 1 1; border-color: white; vertical-align: top;}.texttablebold  { font-size: 10pt; padding: 2 0 2 0; font-weight: bold; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;}.texttablectr  { font-size: 10pt; text-align: center; padding: 2 0 2 0; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;}.texttablert  { font-size: 10pt; text-align: right; padding: 2 0 2 0; border-style: solid; border-width: 1 0 0 0; border-color: white; vertical-align: top;}</style></head>";
			html += "<body style='font-family: Verdana,Arial,Helvetica,sans-serif; font-size: 10pt;'>Dear "+name+",<br><br>Thank you for shopping at Susie Watson Designs.<br><br>Your order no. "+ordernum+" has been received.<br><br>Order Summary:<br><br>";
			html += "<table width='100%' border=0 cellspacing=0 cellpadding=0><tr><td valign='top'><table width='100%' border='0' cellspacing='0' cellpadding='0'><tr><td class='smalltext' width='44.44%' align='LEFT'><div class='listheadernosort'>Item</div></td><td class='smalltext' width='11.11%' align='CENTER'><div class='listheadernosort'>Qty</div></td><td class='smalltext' width='11.11%' align='RIGHT'><div class='listheadernosort'>Amount</div></td><td class='smalltext' width='11.11%' align='RIGHT'><div class='listheadernosort'>Tax</div></td><td class='smalltext' width='11.12%' align='RIGHT'><div class='listheadernosort'>Gross Amount</div></td></tr>";
			for (var i=0; i < results.length; i++) {
				var itemid = results[i].getValue("item");
				var description = results[i].getValue("storedisplayname","item");
				if (matrixParentLookup[itemid] != null) {
					description = results[i].getValue("displayname", "item");
				}
				var quantity = results[i].getValue("quantity");
				var amount = results[i].getValue("amount");
				var vat = results[i].getValue("taxamount");
				var grossamount = parseFloat(amount) + parseFloat(vat); //results[i].getValue("grossamount");
				grossamount = grossamount.toFixed(2);
				html += "<tr><td class=texttable>"+description+"</td><td class=texttablectr>"+quantity+"</td><td class=texttablert>&pound;"+amount+"</td><td class=texttablert>&pound;"+vat+"</td><td class=texttablert>&pound;"+grossamount+"</td></tr>";
			}
			html += "<tr id='ordersummary_total'><td class=texttablert colspan=4><b>Total</b></td><td class=texttablert><b>&pound;"+total+"</b></td></tr></table></td></tr></table>"; //<tr id='ordersummary_subtotal'><td class=texttablert colspan=3>Subtotal</td><td class=texttablert>&pound;"+subtotal+"</td><td class=texttable>&nbsp;</td><td class=texttable>&nbsp;</td></tr><tr id='ordersummary_Tax'><td class=texttablert colspan=3>VAT</td><td class=texttablert>&pound;"+vattotal+"</td><td class=texttable>&nbsp;</td><td class=texttable>&nbsp;</td></tr>
			html += "<br><br>Thank you for your business.<br><br>Susie Watson Designs</body></html>";
			nlapiSendEmail(sender, recipient, "Gift purchase confirmation", html, null, null, {transaction: id});
		}
	}
	catch (e) { LogError(e); }
}

/**
 * @param itemids
 * @param giftids
 * @param qtys
 * @returns {String}
 */
function BuildBuyGiftCartHTML(itemids, giftids, qtys) {
	var total = 0;
	var tax_rates = GetTaxRates();
	var html = '<fieldset><table cellpadding="0" cellspacing="0" border="0" width="730"><tr><th width="120">Product</th><th width="350">Description</th><th width="120" class="quantity">Quantity</th><th width="140" class="quantity">Price per item</th></tr><tr class="first"><th colspan="4"></th></tr>';
	for (var i=0; i < itemids.length; i++) {
		var itemid = itemids[i];
		var giftid = giftids[i];
		var qty = qtys[i];
		var qty_int = (qty&&!isNaN(parseInt(qty))) ? parseInt(qty) : 0;
		if (itemid!="" && giftid!="" && qty_int>0) {
			var filters = new Array();
			filters[0] = new nlobjSearchFilter("internalid", null, "is", itemid, null);
			var columns = new Array();
			columns[0] = new nlobjSearchColumn("storedisplayname");
			columns[1] = new nlobjSearchColumn("thumbnailurl");
			columns[2] = new nlobjSearchColumn("imageurl");
			columns[3] = new nlobjSearchColumn("onlineprice");
			columns[4] = new nlobjSearchColumn("itemurl");
			columns[5] = new nlobjSearchColumn("salestaxcode");
			columns[6] = new nlobjSearchColumn("storedisplayname", "parent");
			columns[7] = new nlobjSearchColumn("itemurl", "parent");
			columns[8] = new nlobjSearchColumn("thumbnailurl", "parent");
			columns[9] = new nlobjSearchColumn("imageurl", "parent");
			columns[10] = new nlobjSearchColumn("parent");
			columns[11] = new nlobjSearchColumn("displayname");
			var results = nlapiSearchRecord("item", null, filters, columns);
			if (results && results.length>0) {
				var storedisplayname = results[0].getValue("storedisplayname");
				var thumbnailurl = results[0].getValue("thumbnailurl");
				var imageurl = results[0].getValue("imageurl");
				var itemurl = results[0].getValue("itemurl");
				if (!isEmpty(results[0].getValue("parent"))) {
					storedisplayname = results[0].getValue("displayname");
					itemurl = results[0].getValue("itemurl", "parent");
					thumbnailurl = results[0].getValue("thumbnailurl", "parent");
					imageurl = results[0].getValue("imageurl", "parent");
				}
				//if (thumbnailurl.length > 0) thumbnailurl = thumbnailurl.replace(/^http:\/\/[^\/]+/i, "");
				//if (imageurl.length > 0) imageurl = imageurl.replace(/^http:\/\/[^\/]+/i, "");
				var image = (thumbnailurl && thumbnailurl!="") ? '<a href="'+imageurl+'" class="thickbox"><img src="'+thumbnailurl+(thumbnailurl.indexOf('?')==-1?'?':'&')+'resizeid=-3&resizeh=50&resizew=50" width="50" height="50" alt="" /></a>' : '';
				var onlineprice = results[0].getValue("onlineprice");
				var price_float = (onlineprice&&!isNaN(parseFloat(onlineprice))) ? parseFloat(onlineprice) : 0;
				var salestaxcode = results[0].getValue("salestaxcode");
				var salestaxrate = (tax_rates[salestaxcode]) ? tax_rates[salestaxcode] : 0;
				var price_inc_float = Math.round(price_float*(1+salestaxrate)*100)/100;
				var price = (price_inc_float!=0) ? '&pound;'+price_inc_float.toFixed(2) : '-';
				html += '<tr><td>'+image+'</td><td>'+storedisplayname+'</td><td class="quantity">'+qty+'<input type="hidden" name="qty" value="'+qty+'" /><input type="hidden" name="giftid" value="'+giftid+'" /><input type="hidden" name="itemid" value="'+itemid+'" /></td><td class="quantity">'+price+'</td></tr>';
				total += qty_int * price_inc_float;
			}
		}
	}
	total = Math.round(total*100)/100;
	html += '</table><table cellpadding="0" cellspacing="0" border="0" width="730" class="total"><tr><td align="right">Total: '+(total!=0 ? '&pound;'+total.toFixed(2) : '-')+'</td></tr></table>';
	html += '</fieldset>';
	return html;
}

function LogError(e) {
	if (e instanceof nlobjError)
		nlapiLogExecution('ERROR', 'Exception caught:', e.getCode() + '\n' + e.getDetails());
	else
		nlapiLogExecution('ERROR', 'Exception caught:', e.toString());
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

function isEmpty(val) {

	return (val == null || val == "");

}

function Nvl() {

	for (var i=0, l=arguments.length; i < l; i++) {
		var arg = arguments[i];
		if (typeof arg == "undefined" || (typeof arg == "object" && arg == null) || isNaN(arg) || arg == "")
			continue;
		else
			break;
	}
	return arg;

}
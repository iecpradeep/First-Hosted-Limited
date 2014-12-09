/********************************************************************************
 * Customer:	Edward Parker Wines
 * Version:		Version 1.5
 * Date:		07/09/2011-12/10/2011
 * Author:		First Hosted Limited
 * Developers:  Stephen Boot
 * Notes:		Functions for search with pagination and sorting
 ********************************************************************************/

// Item class
function Item(internalid, thumbnailurl, displayname, special, onlineprice, itemurl, country, vintage, sizeid, size, bodyid, dontshowprice)
{
	this.internalid = internalid;
	this.thumbnailurl = thumbnailurl;
	this.displayname = displayname;
	this.special = special;
	this.onlineprice = onlineprice;
	this.itemurl = itemurl;
	
	this.country = country;
	this.vintage = vintage;
	this.sizeid = sizeid;
	this.size = size;
	this.bodyid = bodyid;
	
	this.dontshowprice = dontshowprice;
	
	this.getClientItemConstructor = function()
	{
		var price = '';
		if (this.dontshowprice == 'T')
		{
			price = '';
		}
		else
		{
			price = '&pound;' + nlapiFormatCurrency(this.onlineprice) + ' (Incl. VAT)';
		}
		return "new Item('" + this.internalid + "','" + this.thumbnailurl + "','" + this.displayname + "','" + this.special + "','" + price + "','" + this.itemurl + "', '" + this.size + "')";
	};
	 
	return true;
}

function searchItemsLeft(params)
{
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');
	
	nlapiLogExecution('DEBUG', 'Start', '');
	
	var sortBy = params.getParameter('sort'); //sortBy
	var pageNum = params.getParameter('pn'); //pageNum
	var pageSize = params.getParameter('ps'); //pageSize
	var dontshowprice = params.getParameter('library'); //T or F (dontshowprice)
	var name = params.getParameter('name'); //name
	var country = params.getParameter('country'); //country
	var producer = params.getParameter('producer');//producer
	var price = params.getParameter('price');
	var grape = params.getParameter('grape'); //grape
	var colour = params.getParameter('colour'); //colour/type
	var vintage = params.getParameter('vintage'); //vintage
	var size = params.getParameter('size'); //bottle size
	var bodytype = params.getParameter('bodytype');
	nlapiLogExecution('DEBUG', 'Params', '');

	var filterqty = 0;
	var filters = new Array();
	
	//bottle size
	if(size != null && size != "")
	{
		var mylistsize = nlapiLoadRecord("customlist", 8);
		var sizename = "";
		for(var j = 1; j <= mylistsize.getLineItemCount('customvalue') ; j++)
		{
			sizename = mylistsize.getLineItemValue('customvalue', 'valueid', j);
			if(sizename.toLowerCase() == size.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestorebottlesize', null, 'anyOf', sizename); //bottle size
				filterqty++;
				break;
			}
		}	
	}
	nlapiLogExecution('DEBUG', 'Size', size);
	//vintage
	if(vintage != null && vintage != "")
	{
		var mylistvintage = nlapiLoadRecord("customlist", 7);
		var vintagename = "";
		for(var j = 1; j<= mylistvintage.getLineItemCount('customvalue') ;j++)
		{ 
			vintagename	= mylistvintage.getLineItemValue('customvalue', 'valueid', j);
			if(vintagename.toLowerCase() == vintage.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestorevintage', null, 'anyOf', vintagename); //vintage
				filterqty++;
				break;
			}
		}		
	}
	nlapiLogExecution('DEBUG', 'Vintage', vintage);	
	//colour/type
	if(colour != null && colour != "")
	{
		var mylistcol = nlapiLoadRecord("customlist", 3);
		var colname = "";
		for(var j = 1; j<= mylistcol.getLineItemCount('customvalue') ;j++)
		{ 
			colname	= mylistcol.getLineItemValue('customvalue', 'valueid', j);
			if(colname.toLowerCase() == colour.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestorecolour', null, 'anyOf', colname); //colour/type
				filterqty++;
				break;
			}
		}			
	}
	nlapiLogExecution('DEBUG', 'Colour', colour);
	//country
	if(country != null && country != "")
	{
		var mylistcountry = nlapiLoadRecord("customlist", 2);
		var countryname = "";
		for(var j = 1; j<= mylistcountry.getLineItemCount('customvalue') ;j++)
		{ 
			countryname	= mylistcountry.getLineItemValue('customvalue', 'valueid', j);
			if(countryname.toLowerCase() == country.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestorecountry', null, 'anyOf', countryname); //country
				filterqty++;
				break;
			}
		}
	}
	nlapiLogExecution('DEBUG', 'Country', country);	
	//producer
	if(producer != null && producer != "")
	{
		var mylistproducer = nlapiLoadRecord("customlist", 11);
		var producername = "";
		for(var j = 1; j<= mylistproducer.getLineItemCount('customvalue') ;j++)
		{ 
			producername = mylistproducer.getLineItemValue('customvalue', 'valueid', j);
			if(producername.toLowerCase() == producer.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestoreproducer', null, 'anyOf', producername); //producer
				filterqty++;
				break;
			}
		}
	}
	nlapiLogExecution('DEBUG', 'Producer', producer);
	//grape
	if(grape != null && grape != "")
	{
		var mylistgrape = nlapiLoadRecord("customlist", 4);
		var grapename = "";
		for(var j = 1; j<= mylistgrape.getLineItemCount('customvalue') ;j++)
		{ 
			grapename	= mylistgrape.getLineItemValue('customvalue', 'valueid', j);
			if(grapename.toLowerCase() == grape.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem1', null, 'anyOf', grapename); //grape
				filterqty++;
				break;
			}
		}
	}
	nlapiLogExecution('DEBUG', 'Grape', grape);
	//bodytype
	if(bodytype != null && bodytype != "")
	{
		var mylistbodytype = nlapiLoadRecord("customlist", 10);
		var bodytypename = "";
		for(var j = 1; j<= mylistbodytype.getLineItemCount('customvalue') ;j++)
		{ 
			bodytypename	= mylistbodytype.getLineItemValue('customvalue', 'valueid', j);
			if(bodytypename.toLowerCase() == bodytype.toLowerCase())
			{
				filters[filterqty] = new nlobjSearchFilter ('custitem_onlinestorebody', null, 'anyOf', bodytypename); //bodytype
				filterqty++;
				break;
			}					
		}				
	}
	nlapiLogExecution('DEBUG', 'Body Type', bodytype);
	//dontshowprice
	if(dontshowprice != null && dontshowprice != "")
	{
		if (dontshowprice == 'F')
		{
			filters[filterqty] = new nlobjSearchFilter ('dontshowprice', null, 'is', dontshowprice); //dontshowprice
			filterqty++;
		}
	}
	nlapiLogExecution('DEBUG', 'Don\'t Show Price', dontshowprice);
	
	filters[filterqty] = new nlobjSearchFilter ('isonline', null, 'is', 'T'); //isonline
	filterqty++;
	
	filters[filterqty] = new nlobjSearchFilter ('isinactive', null, 'is', 'F'); //isinactive
	filterqty++;
	
	// Define search columns
	var columns = [];
	columns[0] = new nlobjSearchColumn('internalid');
	columns[1] = new nlobjSearchColumn('thumbnailurl');
	columns[2] = new nlobjSearchColumn('displayname');
	columns[3] = new nlobjSearchColumn('onlineprice');
	columns[4] = new nlobjSearchColumn('itemurl');
	columns[5] = new nlobjSearchColumn('dontshowprice');
	columns[6] = new nlobjSearchColumn('custitem_onlinestorecountry');
	columns[7] = new nlobjSearchColumn('custitem_onlinestorevintage');
	columns[8] = new nlobjSearchColumn('custitem_onlinestorebottlesize');
	columns[9] = new nlobjSearchColumn('custitem_onlinestorebody');
	columns[10] = new nlobjSearchColumn('salestaxcode');
	columns[11] = new nlobjSearchColumn('searchkeywords');
	columns[12] = new nlobjSearchColumn('custitem_special');

	// Execute the Item search. 
	nlapiLogExecution('DEBUG', 'Before search', filters.length);
	var searchResults = nlapiSearchRecord('item', null, filters, columns);
	nlapiLogExecution('DEBUG', 'Search', '');
	
	var arItems = [];
	var taxcodeid = 0;
	var vat = null;

	try
	{
		if(searchResults != null)
		{
			for (var i = 0; i < searchResults.length; i++)
			{
				var onlineprice = searchResults[i].getValue(columns[3]);
				
				// Include tax
				var tempTaxcodeId = searchResults[i].getValue(columns[10]);
				if (taxcodeid != tempTaxcodeId)
				{
					taxcodeid = tempTaxcodeId;
					vat = nlapiLoadRecord('salestaxitem', taxcodeid);
				}
				
				if (vat != null)
				{
					onlineprice *= (1+(parseFloat(vat.getFieldValue('rate').replace('%',''))/100));
				}
				
				// Do displayname and searchkeywords filtration here
				if (name != null && name != "")
				{
					var searchString = searchResults[i].getValue(columns[2]) + "," + searchResults[i].getValue(columns[11]);
					var arSearchString = name.replace(/\s+/g, ",").split(",");
					
					var matchesFound = 0;
					
					for (var j = 0; j < arSearchString.length; j++)
					{
						var nameRegEx = new RegExp(arSearchString[j], "i");
						
						if (nameRegEx.test(searchString))
						{
							matchesFound++;
						}
					}
					
					if (matchesFound == arSearchString.length)
					{
						// Do onlineprice filtration here due to no filter available (and also below if no search string present)
						if(price != null && price != "")
						{
							var minprice = 0;
							var maxprice = 0;
							var pricevar = 'price';
							
							switch(price)
							{
							case "over20":
								minprice = 20;
								maxprice = 9999999;
								break;
							case "under8":
								maxprice = 7.99;
								break;
							case "under12":
								maxprice = 11.99;
								minprice = 8;
								break;
							case "under20":
								maxprice = 19.99;
								minprice = 12;
								break;
							}
							
							if (onlineprice <= maxprice && onlineprice >= minprice)
							{
								arItems.push(new Item(searchResults[i].getValue(columns[0]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[1]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[2]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[12]).replace(/'/g, "\\'"),
								onlineprice,
								searchResults[i].getValue(columns[4]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[6]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[7]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[8]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[8]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[9]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[5])));
							}
						}
						else
						{
							arItems.push(new Item(searchResults[i].getValue(columns[0]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[1]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[2]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[12]).replace(/'/g, "\\'"),
								onlineprice,
								searchResults[i].getValue(columns[4]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[6]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[7]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[8]).replace(/'/g, "\\'"),
								searchResults[i].getText(columns[8]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[9]).replace(/'/g, "\\'"),
								searchResults[i].getValue(columns[5])));
						}
					}
				}
				else
				{
					// Do onlineprice filtration here due to no filter available
					if(price != null && price != "")
					{
						var minprice = 0;
						var maxprice = 0;
						var pricevar = 'price';
						
						switch(price)
						{
						case "over20":
							minprice = 20;
							maxprice = 9999999;
							break;
						case "under8":
							maxprice = 7.99;
							break;
						case "under12":
							maxprice = 11.99;
							minprice = 8;
							break;
						case "under20":
							maxprice = 19.99;
							minprice = 12;
							break;
						}
						
						if (onlineprice <= maxprice && onlineprice >= minprice)
						{
							arItems.push(new Item(searchResults[i].getValue(columns[0]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[1]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[2]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[12]).replace(/'/g, "\\'"),
							onlineprice,
							searchResults[i].getValue(columns[4]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[6]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[7]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[8]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[8]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[9]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[5])));
						}
					}
					else
					{
						arItems.push(new Item(searchResults[i].getValue(columns[0]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[1]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[2]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[12]).replace(/'/g, "\\'"),
							onlineprice,
							searchResults[i].getValue(columns[4]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[6]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[7]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[8]).replace(/'/g, "\\'"),
							searchResults[i].getText(columns[8]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[9]).replace(/'/g, "\\'"),
							searchResults[i].getValue(columns[5])));
					}
				}
			}
			nlapiLogExecution('DEBUG', 'Results', searchResults.length);
		}
		else
		{
			nlapiLogExecution('DEBUG', 'Results', 'no results');
		}
	}
	catch(SSS_USAGE_LIMIT_EXCEEDED)
	{	
		response.write("alert('Usage limit exceeded.');");
	}
	
	// Sort items
	switch(sortBy)
	{
	case 'displayname':
		arItems = sortByProperty(arItems, sortBy);
		break;
	case 'country':
		arItems = sortByProperty(arItems, sortBy);
		break;
	case 'onlineprice':
		arItems = sortByProperty(arItems, sortBy, sortNumeric);
		break;
	case 'vintage':
		arItems = sortByProperty(arItems, sortBy);
		break;
	case 'sizeid':
		arItems = sortByProperty(arItems, sortBy, sortNumeric);
		break;
	case 'bodyid':
		arItems = sortByProperty(arItems, sortBy, sortNumeric);
		break;
	}
	
	response.write('maxPages=' + Math.ceil(arItems.length/pageSize) + ';');
	response.write('maxResults=' + arItems.length + ';');
	
	// Output search filter params for persistence
	response.write('filterState="' + 'sort=' + sortBy + '&pn=' + pageNum + '&ps=' + pageSize + '&library=' + dontshowprice + '&name=' + name + '&country=' + country + '&producer=' + producer +'&price=' + price + '&grape=' + grape + '&colour=' + colour + '&vintage=' + vintage + '&size=' + size + '&bodytype=' + bodytype + '";');
	
	// Output array of client constructors for current page of Items
	var offset = (pageNum-1)*pageSize;
	
	var script = 'var items=[';
	for (var i = 0; i < pageSize && offset + i < arItems.length; i++)
	{
		if (i != 0)
		{
			script += ',';
		}
		script += arItems[offset + i].getClientItemConstructor();
	}
	script += '];';
	
	response.write(script);
}

function sortAlpha(a,b)
{
	var a0 = a[0].toLowerCase();
	var b0 = b[0].toLowerCase();
	
	return (b0 < a0) - (a0 < b0);
}

function sortNumeric(a,b)
{
	return a[0] - b[0];
}

function sortByProperty(items, property, sortFunc)
{
	// Sort alphabetically by default
	if (sortFunc == null)
	{
		sortFunc = sortAlpha;
	}
	
	var tempArray = [];
	for (var i = 0; i < items.length; i++)
	{
		eval('tempArray.push([items[' + i + '].' + property + ',' + i + ']);');
	}

	tempArray.sort(sortFunc);
	
	var resultArray = [];
	for (var i = 0; i < tempArray.length; i++)
	{
		resultArray.push(items[tempArray[i][1]]);
	}
	
	return resultArray;
}

function loadCombos(params)
{
	response.setContentType('JAVASCRIPT', 'script.js', 'inline');

	nlapiLogExecution('DEBUG', 'loadCombos', '');
	
	var html = '';

	//vintages
	var mylistvintage = nlapiLoadRecord("customlist", 7);
	html += "var vintages='";
	html += "<option value=\"\">Vintage</option>";
	for(var j = 1; j<= mylistvintage.getLineItemCount('customvalue') ;j++)
	{ 
		vintagename	= mylistvintage.getLineItemValue('customvalue', 'value', j);
		vintageid = mylistvintage.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+vintageid+"\" class=\"selOpt\">"+vintagename.replace("'","\\'")+"</option>";		
	}				
	html+= "';";
	//bodytypes
	var mylistbodytype = nlapiLoadRecord("customlist", 10);
	html += "var bodytypes='";
	html += "<option value=\"\">Body</option>";
	for(var j = 1; j<= mylistbodytype.getLineItemCount('customvalue') ;j++)
	{ 
		bodytypename = mylistbodytype.getLineItemValue('customvalue', 'value', j);
		bodytypeid = mylistbodytype.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+bodytypeid+"\" class=\"selOpt\">"+bodytypename.replace("'","\\'")+"</option>";		
	}				
	html+= "';";
	//bottle sizes
	var mylistsize = nlapiLoadRecord("customlist",8);
	html += "var bottlesizes='";
	html += "<option value=\"\">Bottle size</option>";
	for(var j = 1; j <= mylistsize.getLineItemCount('customvalue') ; j++)
	{
		sizename = mylistsize.getLineItemValue('customvalue', 'value', j);
		sizeid = mylistsize.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+sizeid+"\" class=\"selOpt\">"+sizename.replace("'","\\'")+"</option>";
	}		
	html+= "';";
	//grapes
	var mylistgrape = nlapiLoadRecord("customlist", 4);
	html += "var grapes='";
	html += "<option value=\"\">Grape</option>";
	for(var j = 1; j<= mylistgrape.getLineItemCount('customvalue') ;j++)
	{ 
		grapename = mylistgrape.getLineItemValue('customvalue', 'value', j);
		grapeid = mylistgrape.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+grapeid+"\" class=\"selOpt\">"+grapename.replace("'","\\'")+"</option>";
	}				
	html+= "';";
	//producers
	var mylistproducer = nlapiLoadRecord("customlist", 11);
	html += "var producers='";
	html += "<option value=\"\">Producer</option>";
	for(var j = 1; j<= mylistproducer.getLineItemCount('customvalue') ;j++)
	{ 
		producername = mylistproducer.getLineItemValue('customvalue', 'value', j);
		producerid = mylistproducer.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+producerid+"\" class=\"selOpt\">"+producername.replace("'","\\'")+"</option>";
	}
	html+= "';";
	//colour/type
	var mylistcol = nlapiLoadRecord("customlist", 3);
	html += "var colours='";
	html += "<option value=\"\">Colour/Type</option>";
	for(var j = 1; j<= mylistcol.getLineItemCount('customvalue') ;j++)
	{ 
		colname	= mylistcol.getLineItemValue('customvalue', 'value', j);
		colid = mylistcol.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+colid+"\" class=\"selOpt\">"+colname.replace("'","\\'")+"</option>";
	}				
	html+= "';";
		
	//country
	var mylistcountry = nlapiLoadRecord("customlist", 2);
	html += "var countries='";
	html += "<option value=\"\">Country/Region</option>";
	for(var j = 1; j<= mylistcountry.getLineItemCount('customvalue') ;j++)
	{ 
		countryname	= mylistcountry.getLineItemValue('customvalue', 'value', j);
		countryid = mylistcountry.getLineItemValue('customvalue', 'valueid', j);
		html+= "<option value=\""+countryid+"\" class=\"selOpt\">"+countryname.replace("'","\\'")+"</option>";
	}
	html+= "';";
	
	html += "var prices = '" +
	"<option value=\"\">Price</option>" +
	"<option value=\"under8\" class=\"selOpt\">Under &pound;8.00</option>" +
	"<option value=\"under12\" class=\"selOpt\">&pound;8.00 - &pound;11.99</option>" +
	"<option value=\"under20\" class=\"selOpt\">&pound;12.00 - &pound;19.99</option>" +
	"<option value=\"over20\" class=\"selOpt\">Over &pound;20.00</option>" +
	"';";

	response.write(html);
}

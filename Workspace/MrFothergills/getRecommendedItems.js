/*******************************************************
 * Name:		Suitelet for getting HTML for displaying 
 * 				Recommended Products at the top of 
 * 				categories. To be used with AJAX. 
 * Description:	At current time, only works if you have 
 * 				one web site. 
 * Script Type:	Script
 * 
 * Version:		0.1 - 06/06/2012 - Initial release - SB
 * 				1.0 - 06/07/2012
 * 				1.1beta
 * 				1.1.1 - 21/05/2013 - Include assembly items - SB
 * 
 * Author:		S.Boot, FHL
 *******************************************************/

var debug = request.getParameter('debug'); // Set this to any value during development. In production, do not use

/**
 * Main function
 */
function getRecommendedItems()
{
	var categoryId = -1;
	
	if (request.getParameter('sc') != null)
	{
		categoryId = parseInt(request.getParameter('sc'));
	}
	
	var filters = [];
	
	filters[0] = new nlobjSearchFilter('custitem_mrf_category_recommended', null, 'anyOf', categoryId);
	
	var searchResults = nlapiSearchRecord('inventoryitem', 20, filters, null);
	var searchResults2 = nlapiSearchRecord('assemblyitem', 20, filters, null); // 1.1.1
	
	var output = '';
	var count = 0;
	
	if (searchResults || searchResults2)
	{
		output = '<div id="recommendeditems" style="display:none;"><div id="products2" class="outline"><h2>Recommended products</h2><table><tr>';
	}
	
	if (searchResults)
	{
		for (var i = 0; i < searchResults.length && count < 4; i++) // We only want 4 results max
		{
			var searchResult = searchResults[i];
			var item = new Item(searchResult.getValue('internalid'),
					searchResult.getValue('custitem_mrf_ext_recimage'),
					searchResult.getValue('storedisplayname'),
					searchResult.getValue('storedescription'),
					searchResult.getValue('itemurl'),
					searchResult.getValue('onlineprice'));
			
			output += item.getOutput();
			
			count++;
		}
	}
	
	if (searchResults2)
	{
		for (var i = 0; i < searchResults2.length && count < 4; i++) // We only want 4 results max
		{
			var searchResult = searchResults2[i];
			var item = new Item(searchResult.getValue('internalid'),
					searchResult.getValue('custitem_mrf_ext_recimage'),
					searchResult.getValue('storedisplayname'),
					searchResult.getValue('storedescription'),
					searchResult.getValue('itemurl'),
					searchResult.getValue('onlineprice'));
			
			output += item.getOutput();
			
			count++;
		}
	}
	
	if (searchResults || searchResults2)
	{
		output += '</tr></table></div><div class="spacer10 outline"></div></div>';
	}
	
	response.write(output);
}

/**
 * @param id
 * @param thumbnail
 * @param storedisplayname
 * @param storedescription
 * @param itemurl
 * @param price
 * @returns
 */
function Item(id, thumbnail, storedisplayname, storedescription, itemurl, price)
{
	this.id = id;
	this.thumbnail = thumbnail;
	this.storedisplayname = storedisplayname;
	this.storedescription = storedescription;
	this.itemurl = itemurl;
	this.price = price;
	
	this.getOutput = function()
	{
		var output = '<td><div class="product2 outline">';
		output += '<a href="' + this.itemurl + '"><img src="' + this.thumbnail + '" alt="' + this.storedisplayname + '"></a>';
		output += '<h3>' + this.storedisplayname + '</h3>';
		output += '<p class="shortdesc">' + this.storedescription + '</p>';
		output += '<p class="buttons"><a href="' + this.itemurl + '" class="button">More info</a><span class="price">&pound;' + parseFloat(this.price).toFixed(2) + '</span></p>';
		output += '</div></td>';
		
		return output;
	};
}
var pageNum = 1;
var pageSize = 12;
var maxCols = 3;
var sortBy = 'displayname';
var maxPages = 1;
var maxResults = 0;
var filterState = '';

function loadCombos()
{
	$.ajax({
	   url: "/app/site/hosting/scriptlet.nl?script=1&deploy=1&compid=732208&h=b62c07c618d143226b81",
	   dataType: 'script',
	   success: function(msg){
		   $("#selvintage").append(vintages);
			$("#selsize").append(bottlesizes);
			$("#selbodytype").append(bodytypes);
			$("#selcountry").append(countries);
			$("#selcolour").append(colours);
			$("#selproducer").append(producers);
			$("#selgrape").append(grapes);
			$("#selprice").append(prices);
	   }
	}).done(function(msg){
		persistCombos();
	});
}

// Item class
function Item(id, thumbnail, displayname, special, price, url, size)
{
	this.id = id;
	this.thumbnail = thumbnail;
	if (filterState != ''){
		this.url = url + '?' + filterState;
	} else {
		this.url = url;
	}
	this.displayname = displayname;
	this.special = special;
	this.price = price;
	this.size = size;
	
	this.getHtml = function()
	{
		var thumb = '';
		if (this.thumbnail != '')
		{
			thumb = '<img src="' + this.thumbnail + '" alt="' + this.displayname + '" />';
		}
		var html = '<td valign="top">' +
			'	<div class="f-item">' +
			'		<div class="f-image"><table style="height:100%;margin:0 auto;"><tr><td><a href="' + this.url + '">' + thumb + '</a></td></tr></table></div>' +
			'		<div class="f-desc">' +
			'			<div class="f-name"><a href="' + this.url + '">' + this.displayname + ' <span style="color:red;">' + this.special + '</span></a></div>' +
			'			<div class="f-price">' + this.price + '</div>' +
			'			<div class="f-add-cart"><table cellpadding="0" cellspacing="0" border="0"><tr><td>' +
			'				<table cellpadding="0" cellspacing="0" border="0"><tr>' +
			"					<td class=\"add-to-c\" style=\"font-family:Verdana, Geneva, Tahoma, sans-serif; font-size:11px; color:#939598;\">" +
			"						" + this.size + "<br />" +
			"						<a href=\"" + this.url + "\"><img src=\"/img/view-more.jpg\" vspace=\"5\" border=\"0\" align=\"absmiddle\" /></a>" +
			"					</td></tr>" +
			'				</table>' +
			'			</td></tr></table></div>' +
			'		</div>' +
			'	</div>' +
			'</td>';
		
		return html;
	};
	 
	return true;
}

function searchItemsLeft(library, reqPage)
{
	if (reqPage != null)
	{
		pageNum = reqPage;
	}
	else
	{
		pageNum = 1;
	}
	
	if($("#selcountry").val()!="")
		country = $("#selcountry").val();
	else
		country = "";
	if($("#selproducer").val()!="")
		producer = $("#selproducer").val();
	else
		producer = "";
	if($("#selprice").val()!="")
		price = $("#selprice").val();
	else
		price = "";
	if($("#selgrape").val()!="")
		grape = $("#selgrape").val();
	else
		grape = "";
	if($("#selcolour").val()!="")
		colour = $("#selcolour").val();	
	else
		colour = "";
	if($("#selvintage").val()!="")
		vintage = $("#selvintage").val();
	else
		vintage = "";
	if($("#selsize").val()!="")
		size = $("#selsize").val();
	else
		size = "";
	if($("#selbodytype").val()!="")
		bodytype = $("#selbodytype").val();
	else
		bodytype = "";
	if($("#search").val()!="")
		name = $("#search").val();
	else
		name = "";
		
	$.ajax({
		url: "/app/site/hosting/scriptlet.nl?script=2&deploy=1&compid=732208&h=b4b502a435edaabe78ee&sort=" + sortBy + "&pn=" + pageNum + "&ps=" + pageSize + "&library=" + library + "&name=" + name + "&colour=" + colour + "&price=" + price + "&size=" + size + "&country=" + country + "&grape=" + grape + "&vintage=" + vintage + "&bodytype=" + bodytype + "&producer=" +producer,
		dataType: 'script',
		success: function(){
			var myhtml = '<div class="main-banner"><img alt="Edward Parker Wines" src="/img/' + (library == 'T' ? 'library' : 'wine') + '-search-results.jpg" border="0" /></div>' +
				'<div class="filter-bar">Sort by: <select class="filter-sort"><option value="displayname">Name</option><option value="country">Country/Region</option><option value="onlineprice">Price Low&gt;High</option><option value="vintage">Vintage Early&gt;Late</option><option value="sizeid">Bottle Size Low&gt;High</option><option value="bodyid">Body Light&gt;Full</option></select> <span class="pages-desc"></span> <a class="btn-left"><img src="/img/button-left-disabled.gif" alt="&lt;" /></a><span class="pages-list"></span><a class="btn-right"><img src="/img/button-right-disabled.gif" alt="&gt;" /></a></div>' +
				'<div class="featured-items"></div>' +
				'<div class="filter-bar">Sort by: <select class="filter-sort"><option value="displayname">Name</option><option value="country">Country/Region</option><option value="onlineprice">Price Low&gt;High</option><option value="vintage">Vintage Early&gt;Late</option><option value="sizeid">Bottle Size Low&gt;High</option><option value="bodyid">Body Light&gt;Full</option></select> <span class="pages-desc"></span> <a class="btn-left"><img src="/img/button-left-disabled.gif" alt="&lt;" /></a><span class="pages-list"></span><a class="btn-right"><img src="/img/button-right-disabled.gif" alt="&gt;" /></a></div>' +
				'<div class="blank"></div>';
			$('.body-epw').html(myhtml);
			
			var i = 0;
			myhtml = '';
			while (i < items.length)
			{
				for (var j = 0; j < maxCols; j++) // Output each column
				{
					if (i < items.length)
					{
						myhtml += items[i].getHtml();
						i++;
					}
					else
					{
						myhtml += '<td></td>';
					}
				}
				
				if (i < items.length) // Further rows
				{
					myhtml += '</tr><tr>';
				}
			}
			$('.featured-items').html('<table cellpadding="0" cellspacing="0" border="0"><tr>' + myhtml + '</tr></table>');
			
			// .filter-bar
			myhtml = '&nbsp;';
			for (var i = 1; i <= maxPages; i++)
			{
				if (pageNum == i)
				{
					myhtml += i + '&nbsp;';
				}
				else
				{
					myhtml += "<a href=\"javascript:searchItemsLeft('" + library + "', " + i + ");\">" + i + "</a>&nbsp;";
				}
			}
			$('.pages-list').html(myhtml);
			
			if (pageNum > 1)
			{
				$('.btn-left').attr('href', "javascript:searchItemsLeft('" + library + "', " + (pageNum-1) + ");");
				$('.btn-left img').attr('src', "/img/button-left.gif");
			}
			
			if (pageNum < maxPages)
			{
				$('.btn-right').attr('href', "javascript:searchItemsLeft('" + library + "', " + (pageNum+1) + ");");
				$('.btn-right img').attr('src', "/img/button-right.gif");
			}
			
			$('.pages-desc').html('Results ' + (pageNum*pageSize-pageSize+1) + '-' + (pageNum*pageSize-pageSize+items.length) + ' of ' + maxResults);
			
			$('.filter-sort').change(function(){
				sortBy = $(this).children('option:selected').val();
				searchItemsLeft(library, pageNum);
			});
			
			$('.filter-sort option').each(function(){
				if ($(this).val() == sortBy)
				{
					$(this).attr('selected', 'selected');
				}
			});
		}
	});
}

function returnSearch()
{
	var params = getUrlParams();
	if (params.length != 0)
	{
		$('#search').val(params['name']);
		$('#selcountry').val(params['country']);
		$('#selproducer').val(params['producer']);
		$('#selprice').val(params['price']);
		$('#selgrape').val(params['grape']);
		$('#selcolour').val(params['colour']);
		$('#selvintage').val(params['vintage']);
		$('#selsize').val(params['size']);
		$('#selbodytype').val(params['bodytype']);
	}
	
	$.ajax({
		url: "/app/site/hosting/scriptlet.nl?script=2&deploy=1&compid=732208&h=b4b502a435edaabe78ee&sort=" + 
			params['sort'] + "&pn=" + params['pn'] + "&ps=" + 
			params['ps'] + "&library=" + params['library'] + "&name=" + 
			params['name'] + "&colour=" + params['colour'] + "&price=" + 
			params['price'] + "&size=" + params['size'] + "&country=" + 
			params['country'] + "&grape=" + params['grape'] + "&vintage=" + 
			params['vintage'] + "&bodytype=" + params['bodytype'] + "&producer=" + params['producer'],
		dataType: 'script',
		success: function(){
			var myhtml = '<div class="main-banner"><img alt="Edward Parker Wines" src="/img/' + (params['library'] == 'T' ? 'library' : 'wine') + '-search-results.jpg" border="0" /></div>' +
				'<div class="filter-bar">Sort by: <select class="filter-sort"><option value="displayname">Name</option><option value="country">Country/Region</option><option value="onlineprice">Price Low&gt;High</option><option value="vintage">Vintage Early&gt;Late</option><option value="sizeid">Bottle Size Low&gt;High</option><option value="bodyid">Body Light&gt;Full</option></select> <span class="pages-desc"></span> <a class="btn-left"><img src="/img/button-left-disabled.gif" alt="&lt;" /></a><span class="pages-list"></span><a class="btn-right"><img src="/img/button-right-disabled.gif" alt="&gt;" /></a></div>' +
				'<div class="featured-items"></div>' +
				'<div class="filter-bar">Sort by: <select class="filter-sort"><option value="displayname">Name</option><option value="country">Country/Region</option><option value="onlineprice">Price Low&gt;High</option><option value="vintage">Vintage Early&gt;Late</option><option value="sizeid">Bottle Size Low&gt;High</option><option value="bodyid">Body Light&gt;Full</option></select> <span class="pages-desc"></span> <a class="btn-left"><img src="/img/button-left-disabled.gif" alt="&lt;" /></a><span class="pages-list"></span><a class="btn-right"><img src="/img/button-right-disabled.gif" alt="&gt;" /></a></div>' +
				'<div class="blank"></div>';
			$('.body-epw').html(myhtml);
			
			var i = 0;
			myhtml = '';
			while (i < items.length)
			{
				for (var j = 0; j < maxCols; j++) // Output each column
				{
					if (i < items.length)
					{
						myhtml += items[i].getHtml();
						i++;
					}
					else
					{
						myhtml += '<td></td>';
					}
				}
				
				if (i < items.length) // Further rows
				{
					myhtml += '</tr><tr>';
				}
			}
			$('.featured-items').html('<table cellpadding="0" cellspacing="0" border="0"><tr>' + myhtml + '</tr></table>');
			
			// .filter-bar
			myhtml = '&nbsp;';
			for (var i = 1; i <= maxPages; i++)
			{
				if (params['pn'] == i)
				{
					myhtml += i + '&nbsp;';
				}
				else
				{
					myhtml += "<a href=\"javascript:searchItemsLeft('" + params['library'] + "', " + i + ");\">" + i + "</a>&nbsp;";
				}
			}
			$('.pages-list').html(myhtml);
			
			if (params['pn'] > 1)
			{
				$('.btn-left').attr('href', "javascript:searchItemsLeft('" + params['library'] + "', " + (parseInt(params['pn'])-1) + ");");
				$('.btn-left img').attr('src', "/img/button-left.gif");
			}
			
			if (params['pn'] < maxPages)
			{
				$('.btn-right').attr('href', "javascript:searchItemsLeft('" + params['library'] + "', " + (parseInt(params['pn'])+1) + ");");
				$('.btn-right img').attr('src', "/img/button-right.gif");
			}
			
			$('.pages-desc').html('Results ' + (params['pn']*params['ps']-params['ps']+1) + '-' + (params['pn']*params['ps']-params['ps']+items.length) + ' of ' + maxResults);
			
			$('.filter-sort').change(function(){
				sortBy = $(this).children('option:selected').val();
				searchItemsLeft(params['library'], pageNum);
			});
			
			$('.filter-sort option').each(function(){
				if ($(this).val() == sortBy)
				{
					$(this).attr('selected', 'selected');
				}
			});
		}
	}).done(function(msg){
		$('.filter-sort').val(getUrlParams()['sort']);
	});
}

function getUrlParams()
{
	var params = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for(var i = 0; i < hashes.length; i++)
	{
		hash = hashes[i].split('=');
		params.push(hash[0]);
		params[hash[0]] = hash[1];
	}
	return params;
}

function persistCombos(){
	var params = getUrlParams();
	if (params.length > 1)
	{
		$('#search').val(params['name']);
		$('#selcountry').val(params['country']);
		$('#selproducer').val(params['producer']);
		$('#selprice').val(params['price']);
		$('#selgrape').val(params['grape']);
		$('#selcolour').val(params['colour']);
		$('#selvintage').val(params['vintage']);
		$('#selsize').val(params['size']);
		$('#selbodytype').val(params['bodytype']);
		$('.return-search a').show();
	}
}

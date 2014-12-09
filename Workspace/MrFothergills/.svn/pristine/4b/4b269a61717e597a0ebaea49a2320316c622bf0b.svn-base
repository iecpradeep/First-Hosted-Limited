/*******************************************************
 * Name:		JavaScript for item list layout
 * Script Type:	Script
 * Date:		1.0.0 - 05/07/2012 - Initial version - SB
 * 				1.0.1 - 08/08/2012 - Bugfix to search parameter in URL string - SB
 * 				1.0.2 - 08/08/2012 - Bugfix on A-Z searches - SB
 * 				1.0.3 - 29/08/2012 - Bugfix searchParam - SB
 * 
 * Author:		Stephen Boot
 *******************************************************/

// Pagination helper
function Page(){
	this.hasPagination = false;
	this.lowItem = 0;
	this.highItem = 0;
	this.totalItems = 0;

	this.getTotalPages = function(){
		if(this.hasPagination && this.totalItems >= this.highItem){
			return parseInt($('td.bglt').parent().children('.medtext,.medtextbold').last().text());
		}else{
	 		return 1;
		}
	};

	this.getCurrentPage = function(){
		if(this.hasPagination && this.totalItems >= this.highItem){
			return parseInt($('td.bglt').text());
		}else{
			return 1;
		}
	};

	this.getMaxOnPage = function(){
		if(this.getTotalPages == 1){
			return this.totalItems;
		}else if(this.getCurrentPage() < this.getTotalPages()){
			return this.highItem-this.lowItem+1;
		}else{
			return (this.lowItem-1)/(this.getTotalPages()-1);
		}
	};

	this.updateTotalItems = function(){
		var searchParam = 'search=';
		if (!$('#searchid').val())
		{
			var searchVar = $.getUrlVar('search');
			searchParam += searchVar ? searchVar : '';
		}
		
		// Numbering
		$('.pageTotalItems').html(this.totalItems);
		$('.pageTotal').html(this.getTotalPages());
		$('.pageCurrent').html(this.getCurrentPage());
		
		// Append existing sort parameters
		var sortParams = '';
		
		if ($.getUrlVar('sort1desc') && !($('#searchid').val()))
		{
			sortParams = '&sort1desc=' + $.getUrlVar('sort1desc') + '&sort1=' + $.getUrlVar('sort1');
		}

		// Previous link
		if (this.getCurrentPage() > 1){
			if(this.getCurrentPage() == 2){
				$('.pagerprev').attr('href','?' + searchParam + sortParams);
				if($('#searchid').val()){
					$('.pagerprev').attr('href',"javascript:formSearch(\'/s.nl\');");
				}
			}else{
				$('.pagerprev').attr('href','?' + searchParam + '&range=' + ((this.getCurrentPage()-2)*this.getMaxOnPage()+1) + ',' + (this.lowItem-1) + ',' + this.totalItems+sortParams);
				if($('#searchid').val()){
					$('.pagerprev').attr('href',"javascript:formSearch(\'/s.nl?range=" + ((this.getCurrentPage()-2)*this.getMaxOnPage()+1) + ',' + (this.lowItem-1) + ',' + this.totalItems+sortParams + "\');");
				}
			}
			$('.pagerprev').show();
		}else{
			$('.pagerprev').hide();
		}

		// Next link
		if (this.highItem < this.totalItems){
			if (((this.getCurrentPage()+1)*(this.highItem-this.lowItem+1)) > this.totalItems)
			{
				$('.pagernext').attr('href','?' + searchParam + '&range=' + (this.highItem+1) + ',' + this.totalItems + ',' + this.totalItems + sortParams);
				if($('#searchid').val()){
					$('.pagernext').attr('href',"javascript:formSearch(\'/s.nl?range=" + (this.highItem+1) + ',' + this.totalItems + ',' + this.totalItems + sortParams + "\');");
				}
			}else{
				$('.pagernext').attr('href','?' + searchParam + '&range=' + (this.highItem+1) + ',' + ((this.getCurrentPage()+1)*(this.highItem-this.lowItem+1)) + ',' + this.totalItems + sortParams);
				if($('#searchid').val()){
					$('.pagernext').attr('href',"javascript:formSearch(\'/s.nl?range=" + (this.highItem+1) + ',' + ((this.getCurrentPage()+1)*(this.highItem-this.lowItem+1)) + ',' + this.totalItems + sortParams + "\');");
				}
			}
			$('.pagernext').show();
		}else{
			$('.pagernext').hide();
		}

		// Page number links
		$('.pager a').each(function(){
			if (!($(this).hasClass('pagerprev')) && !($(this).hasClass('pagernext')))
			{
				$(this).remove();
			}
		});
		
		for (var i = 1; i <= this.getTotalPages(); i++){
			var highestItem = Math.min(i*this.getMaxOnPage(), this.totalItems);
			if (i == 1 && i == this.getCurrentPage())
			{
				if($('#searchid').val()){
					$('.pagernext').before('<a href="javascript:formSearch(\'/s.nl\');" class="currentpage">'+i+'</a> ');
				}else{
					$('.pagernext').before('<a href="?' + searchParam + sortParams + '" class="currentpage">'+i+'</a> ');
				}
			}
			else if (i == 1)
			{
				if($('#searchid').val()){
					$('.pagernext').before('<a href="javascript:formSearch(\'/s.nl\');">'+i+'</a> ');
				}else{
					$('.pagernext').before('<a href="?' + searchParam + sortParams + '">'+i+'</a> ');
				}
			}
			else if (i == this.getCurrentPage())
			{
				if($('#searchid').val()){
					$('.pagernext').before('<a href="javascript:formSearch(\'/s.nl?range=' + (this.getMaxOnPage()*(i-1)+1) + ',' + highestItem + ',' + this.totalItems + sortParams + '\');" class="currentpage">'+i+'</a> ');
				}else{
					$('.pagernext').before('<a href="?' + searchParam + '&amp;range=' + (this.getMaxOnPage()*(i-1)+1) + ',' + highestItem + ',' + this.totalItems + sortParams + '" class="currentpage">' + i + '</a> ');
				}
			}else{
				if($('#searchid').val()){
					$('.pagernext').before('<a href="javascript:formSearch(\'/s.nl?range=' + (this.getMaxOnPage()*(i-1)+1) + ',' + highestItem + ',' + this.totalItems + sortParams + '\');">'+i+'</a> ');
				}else{
					$('.pagernext').before('<a href="?' + searchParam + '&amp;range=' + (this.getMaxOnPage()*(i-1)+1) + ',' + highestItem + ',' + this.totalItems + sortParams + '">' + i + '</a> ');
				}
			}
		}
	};

	return true;
}

function formSearch(action)
{
	document.getElementById('main_form').action = action;
	document.getElementById('main_form').submit();
}

function itemListSort(select)
{
	if ($('#searchid').val())
	{
		var sort1 = '';
		
		switch($(select).val())
		{
		case 'Item_ONLINECUSTOMERPRICE':
			sort1 = 'Item_ONLINEPRICE';
			break;
		case 'Item_NAME':
			sort1 = 'Item_DISPLAYNAME';
			break;
		}
		
		$('#sort1').val(sort1);
		document.getElementById('main_form').submit();
	}
	else
	{
		var searchParam = '';
		var searchVar = $.getUrlVar('search');
		searchParam = searchVar ? '&search=' + searchVar : '';
		
		window.location.href = '?sort1desc=F&sort1=' + $(select).val() + searchParam;
	}
}

var page = new Page();
$(document).ready(function(){
	// Move breadcrumbs
	$('#breadcrumbs').prepend($('#nlcrumbtrail'));
	$('#nlcrumbtrail').show();
	
	// Custom pagination
	page.updateTotalItems();
	
	// Hide native pagination
	$('td.bglt').parent().parent().parent().parent().parent().parent().parent().parent().parent().hide();

	// Re-format quantity pricing
	$('.item table.bglt').each(function(){
		var fromPrice = $(this).children().children(':last-child').prev().children(':last-child').html();
		$(this).hide().after(' from ' + fromPrice);
	});
});

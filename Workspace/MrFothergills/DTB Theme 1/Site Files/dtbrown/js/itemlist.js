/*******************************************************
 * Name:		JavaScript for item list layout
 * Script Type:	Script
 * Version:		1.0.0 - 13/04/2012 - Initial release - SB
 * 				1.3.0 - 04/06/2012 - SB
 * 				1.3.1 - 12/12/2012 - Indent submenu categories in left nav - SB
 * 
 * Author:		Stephen Boot, FHL
 *******************************************************/
 
var recommendedItemsURL = '/app/site/hosting/scriptlet.nl?script=18&deploy=1&compid=3322617&h=3a12cbc2a0e0f5901042';

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
		// Numbering
		$('.pageTotalItems').html(this.totalItems);
		$('.pageTotal').html(this.getTotalPages());
		$('.pageCurrent').html(this.getCurrentPage());
		
		// Append existing sort parameters
		var sortParams = '';
		
		if ($.getUrlVar('sort1desc'))
		{
			sortParams = '&sort1desc=' + $.getUrlVar('sort1desc') + '&sort1=' + $.getUrlVar('sort1');
		}

		// Previous link
		if (this.getCurrentPage() > 1){
			if(this.getCurrentPage() == 2){
				$('.pagerprev').attr('href','?' + sortParams);
			}else{
				$('.pagerprev').attr('href','?range='+((this.getCurrentPage()-2)*this.getMaxOnPage()+1)+','+(this.lowItem-1)+','+this.totalItems + sortParams);
			}
			$('.pagerprev').show();
		}else{
			$('.pagerprev').hide();
		}

		// Next link
		if (this.highItem < this.totalItems){
			if (((this.getCurrentPage()+1)*(this.highItem-this.lowItem+1)) > this.totalItems)
			{
				$('.pagernext').attr('href','?range='+(this.highItem+1)+','+this.totalItems+','+this.totalItems + sortParams);
			}else{
				$('.pagernext').attr('href','?range='+(this.highItem+1)+','+((this.getCurrentPage()+1)*(this.highItem-this.lowItem+1))+','+this.totalItems + sortParams);
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
				$('.pagernext').before('<a href="?' + sortParams + '" class="currentpage">'+i+'</a> ');
			}
			else if (i == 1)
			{
				$('.pagernext').before('<a href="?' + sortParams + '">'+i+'</a> ');
			}
			else if (i == this.getCurrentPage())
			{
				$('.pagernext').before('<a href="?range='+(this.getMaxOnPage()*(i-1)+1)+','+highestItem+','+this.totalItems + sortParams+'" class="currentpage">'+i+'</a> ');
			}else{
				$('.pagernext').before('<a href="?range='+(this.getMaxOnPage()*(i-1)+1)+','+highestItem+','+this.totalItems + sortParams+'">'+i+'</a> ');
			}
		}
	};

	return true;
}

function itemListSort(select)
{
	window.location.href = select.options[select.options.selectedIndex].value;
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
	
	// Add recommended items
	$.get(recommendedItemsURL + '&sc=' + categoryId, 
		function(data){
			$('#alphalist').before(data);
			$('#recommendeditems').slideDown();
		}
	);
	
	// Re-format quantity pricing
	$('.item table.bglt').each(function(){
		var fromPrice = $(this).children().children(':last-child').prev().children(':last-child').html();
		$(this).hide().after(' from ' + fromPrice);
	});
	
	// 1.3.1
	$('.navportlet td[colspan="1"]').next().html('&nbsp;&nbsp;&nbsp;');
});

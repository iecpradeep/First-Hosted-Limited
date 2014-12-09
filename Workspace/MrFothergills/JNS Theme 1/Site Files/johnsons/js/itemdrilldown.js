/*******************************************************
 * Name:		JavaScript for item drilldown template
 * Script Type:	Script
 * Version:		1.0.0 - 13/04/2012 - Initial release - SB
 * 				1.0.1 - 05/07/2012 - Added functionality - SB
 * 				1.0.2 - 01/08/2012 - Hide more elements if no data available - SB
 * 							Don't show cart page when adding to cart - SB
 * 				1.1.3 - 13/08/2012 - Commented out iframe add-to-cart - SB
 * 				1.1.4 - 31/10/2012 - Do not change parent, just replace link with text - SB
 * 
 * 
 * Author:		S.Boot
 *******************************************************/
var sowindoors = [];
var sowoutside = [];
var flowerharvest = [];

$(function(){
	// Format the breadcrumbs
	$('#nlcrumbtrail').append($('h1').text());
	$('#breadcrumbs').prepend($('#nlcrumbtrail'));
		
	// Make item info tabular
	$('#itemtabs').tabs();
	
	// Hide tab if no content available
	var itemtabIndex = 0;
	$('#itemtabs>div').each(function(){
		if($(this).html().trim().length == 0){
			$('#itemtabs').tabs('remove', $(this).attr('id'));
		}
		
		itemtabIndex++;
	});
	
	// Code to hide blank fields
	$('.data').each(function(){
		if ($(this).text() == ''){
			$(this).parent().remove();
		}
	});
	
	// Remove data links
	$('.data a').each(function(){
		$(this).after(($(this).text()))
			.remove(); // 1.1.4
	});
	
	// Hide correlated items if there aren't any
	if ($.trim($('#products3 table tr').html()) == ''){
		$('#products3').hide();
	}
	
	// Hide images with no src attribute
	$('img').each(function(){
		if ($(this).attr('src') == ''){
			$(this).hide();
		}
	});
	
	// Copy/append promotional text of related items
	$('.special:gt(0)').each(function(){
		if ($(this).text().length > 0){
			$('.itemspecial:last').after('<div class="itemspecial"><h3><span class="data">' + $(this).html() + '</span></h3></div>');
		}
	});
	
	// Sowing/Planting Guide
	$('#sowindoors>a>span').each(function(){
		sowindoors.push(getMonthNum($(this).text()));
	});
	
	$('#sowoutside>a>span').each(function(){
		sowoutside.push(getMonthNum($(this).text()));
	});
	
	$('#flowerharvest>a>span').each(function(){
		flowerharvest.push(getMonthNum($(this).text()));
	});
	
	var chartNum = 0;
	$('#datechart table tr').each(function(){
		var monthNum = 1;
		$(this).children('td').each(function(){
			if (isMonthActive(monthNum, chartNum)){
				$(this).addClass(getMonthClass(chartNum));
			}
			monthNum++;
		});
		chartNum++;
	});
	
	// Hide chart if no data available
	if ($('#datechart td.dcindoors').length == 0
		&& $('#datechart td.dcoutdoors').length == 0
		&& $('#datechart td.dcflower').length == 0){
		$('#datechart').hide();
	}
	
	/*// Make add-to-cart buttons submit to hidden iframe to avoid showing cart
	$('form[action^="/app/site/backend/additemtocart.nl"]').each(function(){
		$(this).attr('target', 'server_commands');
	});
	$('form[action^="/app/site/backend/intl/additemtocart.nl"]').each(function(){
		$(this).attr('target', 'server_commands');
	});
	
	$('form[action^="/app/site/backend/additemtocart.nl"]').each(function(){
		$(this).submit(function(){
			window.location.href = window.location.href;
		});
	});
	$('form[action^="/app/site/backend/intl/additemtocart.nl"]').each(function(){
		$(this).submit(function(){
			window.location.href = window.location.href;
		});
	});*/
});

function getMonthNum(monthName)
{
	switch(monthName){
	case 'January':
		return 1;
	case 'February':
		return 2;
	case 'March':
		return 3;
	case 'April':
		return 4;
	case 'May':
		return 5;
	case 'June':
		return 6;
	case 'July':
		return 7;
	case 'August':
		return 8;
	case 'September':
		return 9;
	case 'October':
		return 10;
	case 'November':
		return 11;
	case 'December':
		return 12;
	}
}

function isMonthActive(monthNum, chartNum)
{
	switch(chartNum){
	case 1:
		for(var month in sowindoors){
			if (sowindoors[month] == monthNum){
				return true;
			}
		}
		break;
	case 2:
		for(var month in sowoutside){
			if (sowoutside[month] == monthNum){
				return true;
			}
		}
		break;
	case 3:
		for(var month in flowerharvest){
			if (flowerharvest[month] == monthNum){
				return true;
			}
		}
		break;
	}
	
	return false;
}

function getMonthClass(chartNum)
{
	switch(chartNum){
	case 1:
		return 'dcindoors';
	case 2:
		return 'dcoutdoors';
	case 3:
		return 'dcflower';
	}
}

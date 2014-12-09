/*******************************************************
 * Name:		JavaScript for creating dropdown submenus under Tabs using sitemap.html
 * Script Type:	Script
 * Version:		1.1
 * Date:		3 Jul 2012 - 6 Jul 2012
 * Author:		Stephen Boot, FHL
 *******************************************************/

//var sitemapURL = [brand-specific.js];
var rootNode = new Node('#', 'ROOT', []);

$(document).ready(function(){
	// Load sitemap into temp div
	$('body').append('<div id="sitemapmenu" style="display:none;"></div>');
	$('#sitemapmenu').load(sitemapURL + ' table:last', function(){
		// Parse sitemap into hierarchical array
		$('#sitemapmenu td:last-child').each(function(){
			var level = 10 - parseInt($(this).attr('colspan'));
			var name = $(this).children('a').html();
			var url = $(this).children('a').attr('href');

			if (level <= 2) // No need to go lower than Tab sub-sub-menu
			{
				var tempChildren = rootNode.childNodes;
				
				for (var l = 0; l < level; l++)
				{
					tempChildren = tempChildren[tempChildren.length-1].childNodes;
				}
				
				tempChildren.push(new Node(url, name, []));
			}
		});
		
		// Assign HTML to tabs
		$('#tabmenu li>a').each(function(){
			getChildNodes(this);
		});
		$('#tabmenu').mouseleave(function(){
			$('.tabsubmenuwrapper').slideUp();
		});
	});
});

// Submenu class
function Node(href, name, childNodes)
{
	this.hasChildren = function(){
		return (this.childNodes.length > 0) ? true : false;
	};
	this.href = href;
	this.name = name;
	this.childNodes = childNodes;
  
	this.getSubmenuHTML = function()
	{
		var indicator = '';
		var children = '';
		
		if (this.hasChildren())
		{
			indicator = '<span style="float:right;">&gt;</span>';
			
			var subSubmenuHTML = '';
			for (var i = 0; i < this.childNodes.length; i++)
			{
				subSubmenuHTML += '<li><a href="' + this.childNodes[i].href + '">' + this.childNodes[i].name + '</a></li>';
			}
			
			children = '<div class="tabsubsubmenuwrapper"><ul class="tabsubsubmenu">' + subSubmenuHTML + '</ul></div>';
		}
		
		return '<li><a href="' + this.href + '">' + this.name + indicator + '</a>' + children + '</li>';
	};

	return true;
}

function getChildNodes(tab)
{
	for (var i = 0; i < rootNode.childNodes.length; i++)
	{
		if ($(tab).html() == rootNode.childNodes[i].name)
		{
			appendSubmenu(rootNode.childNodes[i].childNodes, tab);
		}
	}
}

function appendSubmenu(nodes, rootNode)
{
	if (nodes.length > 0)
	{
		var submenuHTML = '';
		var columns = 0;
		
		for(var i = 0; i < nodes.length; i++)
		{
			if (i % 20 == 0)
			{
				columns++;
			}
			
			if (i > 0 && i % 20 == 0)
			{
				submenuHTML += '</ul><ul class="tabsubmenu shadowbox">';
			}
			
			submenuHTML += nodes[i].getSubmenuHTML();
		}
		
		submenuHTML = '<div class="tabsubmenuwrapper" style="width:' + columns * 200 + 'px;"><ul class="tabsubmenu shadowbox">' + submenuHTML;
	
		submenuHTML += '</ul></div>';

		$('#tabmenu>li>a').mouseenter(function(){
			$(this).parent().siblings().children('.tabsubmenuwrapper').slideUp();
		});
		
		$(rootNode).after(submenuHTML).mouseenter(function(){
			$(this).parent().siblings().children('.tabsubmenuwrapper').slideUp();
			$(this).siblings('.tabsubmenuwrapper').stop(true, true).slideDown().mouseleave(function(){
				$(this).slideUp();
			});
		});
		
		$('.tabsubmenu>li>a').mouseenter(function(){
			$(this).parent().siblings().children('.tabsubsubmenuwrapper').slideUp();
			$(this).siblings('.tabsubsubmenuwrapper').stop(true, true).slideDown().mouseleave(function(){
				$(this).slideUp();
			});
		});
	}
}

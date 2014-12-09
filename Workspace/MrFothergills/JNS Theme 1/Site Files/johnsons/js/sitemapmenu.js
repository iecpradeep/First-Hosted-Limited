/*******************************************************
 * Name: 		sitemapmenu.js
 * Description:	Generate dropdown submenus under Tabs using sitemap.html
 * Script Type:	JavaScript
 * Version:		1.0.0 - 03/07/2012 - Initial release - SB
 * 				1.1.0 - 06/07/2012 - Bugfixes - SB
 * 				1.1.1 - 21/09/2012 - Put delay in menu to stop cascading effect 
 * 					when the mouse accidentally hovers over multiple tabs - SB
 * 				1.1.2 - 27/09/2012 - If submenus or subsubmenus spill off-page, 
 * 					move them within the page. 
 * 					Also hide subsubmenus when submenu has slid up - SB
 *
 * Author:		S.Boot
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
		
		// Opening the tabsubmenu
		$('#tabmenu>li>a')
		.mouseenter(function(){
			$(this).parent().siblings().children('.tabsubmenuwrapper').slideUp();
		});
		
		var timer = null;
		
		// Opening the tab
		$(rootNode)
		.after(submenuHTML)
		.mouseenter(function(){
			timer = setTimeout("openTab('#" + $(this).attr('id') + "');", 200); // 200ms should be enough time to stop cascading effect
		}).mouseleave(function(){
			clearTimeout(timer);
		});
		
		// Opening the tabsubsubmenu
		$('.tabsubmenu>li>a')
		.mouseenter(function(){
			$(this).parent().siblings().children('.tabsubsubmenuwrapper').slideUp();
			$(this).siblings('.tabsubsubmenuwrapper').stop(true, true)
			.slideDown(function(){
				// If this tabsubsubmenu is off the page, shift it over to the right side of its parent
				if ($(this).offset().left + $(this).width() > 
					$('#outerwrapper').offset().left + $('#outerwrapper').width())
				{
					$(this).offset({
						left: $(this).offset().left - $(this).width()*2
					});
				}
			}).mouseleave(function(){
				$(this).slideUp();
			});
		});
	}
}

function openTab(tab)
{
	$(tab).parent().siblings().children('.tabsubmenuwrapper').slideUp();
	$(tab).siblings('.tabsubmenuwrapper').stop(true, true)
	.slideDown(function(){
		// If this tabsubmenu is off the page, shift it over
		if ($(this).offset().left + $(this).width() > 
			$('#outerwrapper').offset().left + $('#outerwrapper').width())
		{
			$(this).offset({
				left: -($(this).width() - 
					($('#outerwrapper').offset().left
						+ $('#outerwrapper').width()))
			});
		}
	}).mouseleave(function(){
		$(this).slideUp();
		$('.tabsubsubmenuwrapper').hide();
	});
}
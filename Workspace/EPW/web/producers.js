/*******************************************************
 * Name:		EPW client script for Producers Categories
 * Script Type:	Script
 * Version:		1.0
 * Date:		19th August 2011
 * Author:		Stephen Boot, FHL
 *******************************************************/

// Requires jQuery
$(function(){
	// Node click function
	$('.prods-cat').each(function(){
		$(this).click(function(){
			var catid = $(this).parent().attr('id').replace('prods-list', '');
			
			if ($('#prods-list' + catid + ' .prods-list').html() == '')
			{
				// Fill nodes
				$.ajax({
				   url: "/app/site/hosting/scriptlet.nl?script=81&deploy=1&compid=732208&h=84abd43636ecbe96138f&cat=" + catid,
				   dataType: 'script',
				   success: function(){
				   	var myhtml = '';
				   	for(var i = 0; i < producers.length; i++)
				   	{
				   		myhtml += '<div class="prods-cell"><a href="/' + producers[i][1] + '">' + producers[i][0] + '</a></div>';
						}
						$('#prods-list' + catid + ' .prods-list').html(myhtml);
				   }
				});
			}

			// Close open nodes
			$('.prods-list').hide();
			// Open this node
			$(this).next().fadeIn('slow');
		});
	});
});
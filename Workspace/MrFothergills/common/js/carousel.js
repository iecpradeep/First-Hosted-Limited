/*************************************************************************************
 * Name:		Carousel
 * Script Type:	Client JavaScript
 *
 * Version:		1.0.0 - 12/10/2012 - Initial version - SB
 * 				1.0.1 - 14/10/2012 - Make into generic class - SB
 * 				1.0.2 - 15/10/2012 - Finish implementation of slide left/right - SB
 * 				1.0.3 - 03/01/2013 - Implement draggable for ease of use on mobile devices - SB
 *
 * Author:		S. Boot
 * 
 * Purpose:		Show a carousel of offers
 * 
 * Script: 		carousel.js
 * Deploy: 		
 * 
 *************************************************************************************/

/**
 * Carousel class
 */
function Carousel(selector)
{
	// The actual carousel (not its aperture)
	this.selector = selector;
	
	// 1.0.3
	$(this.selector).draggable({
		axis: 'x', 
		stop: function(event, ui)
		{
			var totalWidth = 0;
			
			$(this).children().each(function(){
			    totalWidth += $(this).width() + parseInt($(this).css('margin-left').replace('px', '')) + parseInt($(this).css('margin-right').replace('px', ''));
			});
			
			// If slider too far right, reset position to 0
			if (parseInt($(this).css('left').replace('px','')) > 0)
			{
				$(this).css('left', '0');
			}
			// Else if slider too far left, reset position to -length of carousel + aperture width
			else if (parseInt($(this).css('left').replace('px','')) < -totalWidth + $(this).parent().width())
			{
				$(this).css('left', (-totalWidth + $(this).parent().width()) + 'px');
			}
		}
	});
	
	/**
	 * Slide the carousel to the left
	 */
	this.slideLeft = function()
	{
		// If position is more than or equal to -length of carousel + aperture width x2
		if (parseInt($(this.selector).css('left').replace('px','')) >= -this.totalLength() + $(this.selector).parent().width()*2)
		{
			// Slide left by aperture width amount
			$(this.selector).animate({
				left: (parseInt($(this.selector).css('left').replace('px','')) - $(this.selector).parent().width()) + 'px'
			}, 500);
		}
		// Else if position is more than -length of carousel + aperture width
		else if (parseInt($(this.selector).css('left').replace('px','')) > -this.totalLength() + $(this.selector).parent().width())
		{
			// Slide aperture left to origin
			$(this.selector).animate({
				left: (-this.totalLength() + $(this.selector).parent().width()) + 'px'
			}, 500);
		}
	};
	
	/**
	 * Slide the carousel to the right
	 */
	this.slideRight = function()
	{
		// If position is less than or equal to -aperture width
		if (parseInt($(this.selector).css('left').replace('px','')) <= -($(this.selector).parent().width()))
		{
			// Slide right by aperture width amount
			$(this.selector).animate({
				left: (parseInt($(this.selector).css('left').replace('px','')) + $(this.selector).parent().width()) + 'px'
			}, 500);
		}
		// Else if position is less than origin
		else if (parseInt($(this.selector).css('left').replace('px','')) < 0)
		{
			// Slide aperture right to origin
			$(this.selector).animate({
				left: 0
			}, 500);
		}
	};
	
	/**
	 * Debug function for forcing the carousel to return to its origin
	 */
	this.reset = function()
	{
		$(this.selector).css('left', '0');
	};
	
	/**
	 * Get the total length of the carousel
	 */
	this.totalLength = function()
	{
		var totalWidth = 0;
		
		$(this.selector).children().each(function(){
		    totalWidth += $(this).width() + parseInt($(this).css('margin-left').replace('px', '')) + parseInt($(this).css('margin-right').replace('px', ''));
		});
		
		return totalWidth;
	};
}
/*******************************************************
 * Name:		slider.js
 * Script Type:	JavaScript
 *
 * Version:	1.0.0 - Initial release - SB
 * 			1.0.1 - 12/08/2012 - Unlimited slides - SB
 * 								 Default slide duration to 2 seconds if none specified - SB
 * 			1.0.2 - 29/08/2012 - Not interested in parent slider - SB
 *
 * Author:	Stephen Boot
 * Purpose:	Rotate HTML banners etc.
 *******************************************************/

var transitionSpeed = 500;
var slide = [];

function slider(i)
{
	$('.slide:not(:nth-child(' + (i + 1) + '))').fadeOut(transitionSpeed);
	
	$('.slide:nth-child(' + (i + 1) + ')').fadeIn(transitionSpeed, function(){
		setTimeout('slider((' + i + ' == ' + ($('.slide').length - 1) + ') ? 0 : ' + (i + 1) + ');', (slide[i] ? slide[i] : 7000));
	});
}

$(document).ready(function(){
	slider(0);
});
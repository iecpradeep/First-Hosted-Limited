/********************************************************************
* Name:			fhl.homeslider.js
* Script Type:	JavaScript
*
* Version:	1.0.0 - 2013-03-14 - Initial release - SB
* 			1.1.0 - 2013-03-21 - Dot control jumpTo() - SB
*
* Author:	S.Boot FHL
*
* Purpose:	Requests JSON data from fhl.homeslider.suitelet.js
* 			Populates sliders with data
* 			Handles slide functionality & animation
*
* Notes:	
*
* Library:	Requires jQuery-1.3.2 from /swd/scripts/all-scripts.js
********************************************************************/

var HOMESLIDERSUITELETURL = '/app/site/hosting/scriptlet.nl?script=177&deploy=1&compid=917016&h=6ff7d17b33d4eefdf918';
var HOMESLIDERWAITMILLISECONDS = 4000;
var HOMESLIDERANIMMILLISECONDS = 1000;
var slider = null;

// Main
$(document).ready(function(){
	// Hide static fallback image
	$('#full-screen-background a').hide();
	
	// Call Suitelet to return JSON and execute homeSliderSuiteletSuccess
	$.getJSON(HOMESLIDERSUITELETURL, homeSliderSuiteletSuccess);
});

/**
 * Main slider set up and init
 * @param data
 */
function homeSliderSuiteletSuccess(data)
{
	var slides = new Array();
	
	// Instantiate Slides
	$.each(data.slides, function(key, slideData) {
		var slide = new Slide(key,
				slideData.title, 
				slideData.linkText, 
				slideData.optionalText, 
				slideData.image, 
				slideData.link);
		
		slides.push(slide);
	});

	// Create new Slider
	slider = new Slider(slides);
	
	// Get Slider HTML
	var sliderHTML = slider.toHTML();
	
	// Put Slider on page
	$('#content-slider-1').html(sliderHTML);
	
	// Show the Slider
	$('#content-slider-1').fadeIn(400, function(){
		// Auto-start Slider
		slider.play();
	});
}

/**
 * Slider class
 * @param slides
 * @returns
 */
function Slider(slides)
{
	this.slides = slides;
	this.playMode = false;
	this.interval = null;
	this.currentSlide = 0;
	
	var slider = this;
	
	// Export to HTML
	this.toHTML = function(){
		var html = '<div class="slides">';
		var dotsHTML = '';
		
		// Loop through slides
		for (var i = 0; i < slider.slides.length; i++)
		{
			var slideHTML = slider.slides[i].toHTML();
			html += slideHTML;
			
			// The first dot is active by default
			if (i == 0)
			{
				dotsHTML += '<li id="dot' + i + '" class="active"><div onclick="slider.jumpTo(' + i + ');"></div></li>';
			}
			else
			{
				dotsHTML += '<li id="dot' + i + '"><div onclick="slider.jumpTo(' + i + ');"></div></li>';
			}
		}
		
		html += '</div>' +
			'<input class="left-arrow" type="image" src="/c.917016/swd/images/fhl.homeslider/Left-Arrow.png" onclick="slider.moveRight();" value="Left">' +
			'<input class="right-arrow" type="image" src="/c.917016/swd/images/fhl.homeslider/Right-Arrow.png" onclick="slider.moveLeft();" value="Right">' +
			'<input class="pause" type="image" src="/c.917016/swd/images/fhl.homeslider/Pause.png" onclick="slider.pause();" value="Pause">' +
			'<input class="play" type="image" src="/c.917016/swd/images/fhl.homeslider/Play.png" onclick="slider.play();" value="Play">' +
			'<div class="dot-control">' + 
			'<table><tr><td><img src="/c.917016/swd/images/fhl.homeslider/corner-topleft.png" alt=""></td>' +
			'<td class="dot-control-bg"></td>' +
			'<td><img src="/c.917016/swd/images/fhl.homeslider/corner-topright.png" alt=""></td></tr>' +
			'<tr><td><img src="/c.917016/swd/images/fhl.homeslider/corner-bottomleft.png" alt=""></td>' +
			'<td class="dot-control-bg"></td>' +
			'<td><img src="/c.917016/swd/images/fhl.homeslider/corner-bottomright.png" alt=""></td></tr></table>' +
			'<ul>' +
			dotsHTML +
			'</ul>' +
			'</div>';
		
		return html;
	};
	
	// Play mode
	this.play = function(){
		slider.playMode = true;
		
		// Every HOMESLIDERWAITMILLISECONDS, call this.moveLeft
		slider.interval = setInterval(slider.moveLeft, HOMESLIDERWAITMILLISECONDS);
		
		// Toggle pause/play buttons
		$('.play').hide();
		$('.pause').show();
	};
	
	// Pause mode
	this.pause = function(){
		slider.playMode = false;
		
		// Clear the interval
		clearInterval(slider.interval);
		
		// Toggle pause/play buttons
		$('.pause').hide();
		$('.play').show();
	};
	
	// Move Left
	this.moveLeft = function(){
		// Clear the interval so double-play doesn't occur
		clearInterval(slider.interval);
		
		// Remember previous slide
		var prevSlide = slider.currentSlide;
		
		// Change currentSlide to next slide
		if (slider.currentSlide == slider.slides.length-1)
		{
			// At end - first slide needs to come next
			slider.currentSlide = 0;
		}
		else
		{
			// Increment slide
			slider.currentSlide++;
		}
		
		// Change active dot
		slider.activeDot(slider.currentSlide);
		
		// Animate previous slide out
		$('.content-slider .slide' + prevSlide)
			.stop(true, true)
			.animate({left:'-=' + $('.content-slider').width()}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Animate current slide in
		$('.content-slider .slide' + slider.currentSlide)
			.stop(true, true)
			.css({'left': $('.content-slider').width()})
			.animate({left:'-=' + $('.content-slider').width()}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Continue playing if play mode active
		if (slider.playMode)
		{
			slider.play();
		}
	};
	
	// Move Right
	this.moveRight = function(){
		// Clear the interval so double-play doesn't occur
		clearInterval(slider.interval);
		
		// Remember previous slide
		var prevSlide = slider.currentSlide;
		
		// Change currentSlide to previous slide
		if (slider.currentSlide == 0)
		{
			// At beginning - last slide needs to come previous
			slider.currentSlide = slider.slides.length-1;
		}
		else
		{
			// Decrement slide
			slider.currentSlide--;
		}
		
		// Change active dot
		slider.activeDot(slider.currentSlide);
		
		// Animate previous slide out
		$('.content-slider .slide' + prevSlide)
			.stop(true, true)
			.animate({left:'+=' + $('.content-slider').width()}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Animate current slide in
		$('.content-slider .slide' + slider.currentSlide)
			.stop(true, true)
			.css({'left': -$('.content-slider').width()})
			.animate({left: 0}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Continue playing if play mode active
		if (slider.playMode)
		{
			slider.play();
		}
	};
	
	// Jump to specific slide
	this.jumpTo = function(slideIndex){
		// Clear the interval so double-play doesn't occur
		clearInterval(slider.interval);
		
		// Remember previous slide
		var prevSlide = slider.currentSlide;
		
		slider.currentSlide = slideIndex;
		
		// Change active dot
		slider.activeDot(slider.currentSlide);
		
		// Animate previous slide out
		$('.content-slider .slide' + prevSlide)
			.stop(true, true)
			.animate({left:'-=' + $('.content-slider').width()}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Animate current slide in
		$('.content-slider .slide' + slider.currentSlide)
			.stop(true, true)
			.css({'left': $('.content-slider').width()})
			.animate({left:'-=' + $('.content-slider').width()}, 
					HOMESLIDERANIMMILLISECONDS, 'swing');
		
		// Continue playing if play mode active
		if (slider.playMode)
		{
			slider.play();
		}
	};
	
	// Change dot
	this.activeDot = function(slideIndex){
		$('.dot-control ul li').removeClass('active');
		$('#dot' + slideIndex).addClass('active');
	};
}

/**
 * Slide class
 * @param title
 * @param linkText
 * @param optionalText
 * @param image
 * @param link
 * @returns
 */
function Slide(index, title, linkText, optionalText, image, link)
{
	this.index = index;
	this.title = title;
	this.linkText = linkText;
	this.optionalText = optionalText;
	this.image = image;
	this.link = link;
	
	// Export to HTML
	this.toHTML = function(){
		var optional = '';
		if (this.optionalText != '')
		{
			optional = '<p>' + this.optionalText + '</p>';
		}
		
		var html = '<div class="slide slide' + index + '">' +
		'<div class="title-box">' + 
		'<table><tr><td><img src="/c.917016/swd/images/fhl.homeslider/corner-topleft.png" alt=""></td>' +
		'<td class="dot-control-bg"></td>' +
		'<td><img src="/c.917016/swd/images/fhl.homeslider/corner-topright.png" alt=""></td></tr>' +
		'<tr><td class="dot-control-bg"></td><td class="dot-control-bg">' +
		'<div class="box-content">' +
		'<h1>' + this.title + '</h1>' +
		'<h2><a href="' + this.link + '">' + this.linkText + '</a></h2>' +
		optional +
		'</div>' +
		'</td><td class="dot-control-bg"></td></tr>' +
		'<tr><td><img src="/c.917016/swd/images/fhl.homeslider/corner-bottomleft.png" alt=""></td>' +
		'<td class="dot-control-bg"></td>' +
		'<td><img src="/c.917016/swd/images/fhl.homeslider/corner-bottomright.png" alt=""></td></tr></table></div>' +
		'<a href="' + this.link + '">' +
		'<img class="slide-img" src="' + this.image + '" alt="' + this.title + '">' +
		'</a>' +
		'</div>';
		
		return html;
	};
}
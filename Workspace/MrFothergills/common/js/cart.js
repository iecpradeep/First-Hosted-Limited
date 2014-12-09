/*************************************************************************************
 * Name:		cart
 * Script Type:	Client JavaScript
 *
 * Version:		1.0.0 - 2013-03-13 - Initial release - SB
 * 				1.0.1 - 2013-03-22 - Functional & graphical implementation - SB
 * 				1.0.2 - 2013-04-01 - Spinner and extra buttons - SB
 * 				1.0.3 - 2013-04-02 - Mini-cart functions - SB
 * 				1.0.4 - 2013-04-03 - CSS class tweak to remove button - SB
 * 				1.0.5 - 2013-04-05 - NLShopperId cookie bugfix for siteId > 1 - SB
 * 				1.0.6 - 2013-04-15 - Parse formatted prices correctly - SB
 * 				1.0.7 - 2013-04-16 - Encode URI Component - SB
 * 				1.0.8 - 2013-04-19 - Floating point issue when dividing decimals - SB
 * 				1.0.9 - 2013-04-23 - Support JSONP - SB
 * 				1.1.0 - 2013-04-24 - Break out of for loop to avoid multi-counting - SB
 * 				1.1.1 - 2013-06-21 - Add Brand to JSON request - SB
 * 				1.1.2 - 2013-07-05 - Put errors in item line description - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Handle request & response of offers in cart
 * 
 * Notes:		Requires jQuery-1.7.1 and offershelper.js
 ******/

// Constants
//var CARTSUITELETURL = 'https://forms.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=139&deploy=1&compid=3322617&h=2f949b7912532d9894e7'; // SB1
//var CARTSUITELETURL = 'https://forms.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=184&deploy=1&compid=3322617_SB2&h=c5a27383762efacb4401'; // SB2
var CARTSUITELETURL = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=184&deploy=1&compid=3322617&h=31abdd36abb6d6783614'; // Production
var CURRENCYSYMBOL = '&pound;';

// Globals
var cart = null;
var offerCart = null;

/**
 * Main function called from offershelper.js
 * @param redirectToCheckout
 */
function cartMain(redirectToCheckout)
{
	var request = '';
	
	// 1.0.3 Extract mini-cart HTML if we're in mini-cart iframe
	if (window.self !== window.top)
	{
		// 1.0.3 Hide page until complete
		$('#outerwrapper').hide();
		$('body').css({'background': 'none'});
	}
	
	// Hide shopping basket and buttons
	$('#handle_cartMainPortlet #carttable').hide();
	$('#handle_cartMainPortlet #tbl_checkout').hide();
	$('#handle_cartMainPortlet #tbl_cancel').hide();
	$('#handle_cartMainPortlet #tbl_recalc').hide();
	
	// Remove any previous cart HTML
	$('#offers-cart-suitelet').html('');
	
	// Show helptext
	$('.helptext').show();
	
	cart = getCartObject();
	
	// 1.0.2 Add spinner
	$('body').append('<div class="cart-spinner"></div>');
	$('.cart-spinner').css({
		'position': 'absolute',
		'top': '0',
		'left': '0',
		'width': '100%',
		'height': '100%',
		'opacity': '.8',
		'background-color': '#fff'
	}).append('<img src="/site/common/img/ajax-loader.gif" alt="Please wait...">');
	$('.cart-spinner img').css({
		'position': 'absolute',
		'top': '50%',
		'left': '50%',
		'margin': '-17.5px 0 0 -17.5px' // Offset = minus half-width and height
	});

	// Get request as JSON
	request = JSON.stringify(cart.toJSON());
	
	// 1.0.7 Encode URI Component
	request = encodeURIComponent(request) + '&callback=?'; // 1.0.9

	if (redirectToCheckout)
	{
		// Call the Suitelet, then redirect to checkout
		$.getJSON(CARTSUITELETURL, request, function(data){$('#checkout').click();});
	}
	else
	{
		// Request offers data from Suitelet and if successful, write offers info to page
		$.getJSON(CARTSUITELETURL, request, cartSuiteletSuccess);
	}
}

/**
 * If request for offers data is successful
 * @param data
 */
function cartSuiteletSuccess(data)
{
	var html = '';
	var totalSavings = 0;
	var grandTotal = 0;
	var offers = new Array();
	var cartItemCount = 0;
	
	// 1.1.0 For each orderLine in the basket
	for (var i = 0; i < cart.orderLines.length; i++)
	{
		// Parse returned JSON data into objects
		$.each(data.orderLines, function(index, orderLine){
			// Check we're dealing with the same item
			if (cart.orderLines[i].itemCode == orderLine.itemCode)
			{
				// Set attributes with returned data
				cart.orderLines[i].image = orderLine.image;
				cart.orderLines[i].priceIncTax = parseFloat(orderLine.priceIncTax);
			}
		});
		
		cartItemCount += cart.orderLines[i].quantity;
	}

	cart.shipping = parseFloat(data.shipping);
	totalSavings = parseFloat(data.totalSavings);
	grandTotal = parseFloat(data.grandTotal);
	
	// Loop over offers JSON and instantiate OfferLines
	$.each(data.offers, function(index, offer){
		var offerLine = new OfferLine(
			offer.image, 
			offer.description, 
			parseFloat(offer.saving)
		);
		
		offers.push(offerLine);
	});
	
	// Create offerCart
	offerCart = new OfferCart(totalSavings, grandTotal, offers);
	
	// Convert cart and offers to HTML
	html = cart.toHTML() + offerCart.toHTML();
	
	// Output HTML on cart page
	$('#offers-cart-suitelet').html(html);
	
	// 1.0.3 Update mini-cart
	$('#itemtotal').html($('#cartitemtotal').html());
	$('#cartitemcount').html(cartItemCount);
	$('#pandp').html($('#cartpandp').html());
	$('#total').html($('#cartgrandtotal').html());
	
	// 1.0.3 Extract mini-cart HTML if we're in mini-cart iframe
	if (window.self !== window.top)
	{
		// 1.0.3 Overwrite whole iframe body with mini cart HTML
		$('body').html(
			$('#basket').html()
		);
		
		// Show page
		$('#outerwrapper').show();
	}
	
	// 1.0.2 Set up buttons and elements on cart page
	$('#xcancel,#ycancel').attr('onclick', $('#cancel').attr('onclick'));
	if (cartItemCount > 0)
	{
		$('#xcheckout,#ycheckout').attr('onclick', 'cartMain(true);');
	}
	else
	{
		$('#xcheckout,#ycheckout').hide();
	}
	$('#xapplygift').attr('onclick', $('#applygift').attr('onclick'));
	$('.checkoutwarning').remove().insertAfter('#offers-gc label');
	$('#cleargift').remove().insertAfter('#xapplygift');
	if ($('[name="gc"]').length == 1)
	{
		$('#xgc').val($('[name="gc"]').val());
	}
	else
	{
		$('#offers-gc').hide();
	}
	
	// 1.0.2 Remove spinner
	$('.cart-spinner').remove();
}

/**
 * 1.0.3 Mini-cart function called from offershelper.js
 * For use on ALL themed pages except basket page.
 */
function miniCartMain()
{
	// Open cart page in an iframe
	$('#basket').html('<iframe id="minicartiframe" src="' + cartURL() + '" frameborder="0" style="width:inherit;height:inherit;overflow:hidden;"/>');
}

/**
 * Cart class
 * @param customerId
 * @param reference
 * @param campaign
 * @param orderLines
 * @returns
 */
function Cart(customerId, reference, campaign, orderLines, brand)
{
	this.customerId = customerId;
	this.reference = reference;
	this.campaign = campaign;
	this.orderLines = orderLines;
	this.brand = brand;
	
	this.shipping = 0;

	// Generate basket payload as JSON
	this.toJSON = function()
	{
		var orderLinesJSON = new Array();
		
		// Loop over order lines and append XML
		for (var i = 0; i < this.orderLines.length; i++)
		{
			orderLinesJSON.push(orderLines[i].toJSON());
		}

		var json = {
			customer: this.customerId,
			reference: this.reference,
			campaign: this.campaign,
			detail: orderLinesJSON,
			brand: this.brand
		};

		return json;
	};
	
	// Export as HTML
	this.toHTML = function()
	{
		var orderLinesHTML = '';
		var subTotal = 0;
		
		// Loop over order lines and append XML
		for (var i = 0; i < orderLines.length; i++)
		{
			orderLinesHTML += orderLines[i].toHTML();
			subTotal += orderLines[i].getTotal();
		}
		
		var html = '<table id="ordercart" class="offercart">' +
			'<colgroup>' +
			'<col style="width:15%;">' +
			'<col style="width:5%;">' +
			'<col style="width:30%;">' +
			'<col style="width:15%;">' +
			'<col style="width:10%;">' +
			'<col style="width:15%;">' +
			'<col style="width:10%;">' +
			'</colgroup>' +
			'<tr>' +
			'<th class="listheadernosort" style="text-align:center;">Item Code</th>' +
			'<th class="listheadernosort">&nbsp;</th>' +
			'<th class="listheadernosort">Description</th>' +
			'<th class="listheadernosort" style="text-align:center;">Quantity</th>' +
			'<th class="listheadernosort" style="text-align:right;">Price</th>' +
			'<th class="listheadernosort" style="text-align:right;">Total</th>' +
			'<th class="listheadernosort">&nbsp;</th>' +
			'</tr>' +
			orderLinesHTML +
			'<tr><td colspan="3" class="cart-total">&nbsp;</td><td colspan="2" class="cart-subtotal">Sub Total Before Offers</td>' + 
			'<td id="cartitemtotal" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(subTotal) + '</td><td class="cart-total"></td></tr>' +
			'<tr><td colspan="3" class="cart-total">&nbsp;</td><td colspan="2" class="cart-subtotal">Delivery</td>' +
			'<td id="cartpandp" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.shipping) + '</td><td class="cart-total"></td></tr>' +
			'<tr class="cart-hr"><td colspan="7"></td></tr>' +
			'<tr><td colspan="4" class="cart-total">&nbsp;</td><td class="cart-total">Total</td>' +
			'<td class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.shipping + subTotal) + '</td><td class="cart-total"></td></tr>' +
			'</table>';
		
		return html;
	};
}

 /**
  * OrderLine class
  * 
  * @param quantity
  * @param itemCode
  * @param description
  * @param price
  * @param itemType
  * @returns
  */
function OrderLine(qIdent, quantity, itemCode, description, price, itemType)
{
	this.qIdent = qIdent;
	this.quantity = quantity;
	this.itemCode = itemCode;
	this.description = description;
	this.price = price;
	this.itemType = itemType;
	
	this.image = '';
	this.priceIncTax = 0;

	// Export as JSON
	this.toJSON = function()
	{
		var json = {
			quantity: this.quantity,
			itemCode: this.itemCode,
			description: this.description,
			price: this.price
		};
		
		return json;
	};
	
	// Export as HTML
	this.toHTML = function()
	{
		var html = '<tr>' +
			'<td class="texttablectr">' + this.itemCode + '</td>' +
			'<td class="texttablectr"><img src="' + this.image + '" alt=""></td>' +
			'<td class="texttable">' + this.description + '</td>' +
			'<td class="texttablectr"><input id="x' + qIdent + '" name="x' + qIdent + '" type="text" value="' + this.quantity + '" class="input" style="text-align:center;" maxlength="6" size="6" onchange="document.forms[\'cart\'].elements[\'' + qIdent + '\'].value=this.value;"></td>' +
			'<td class="texttablert">' + CURRENCYSYMBOL + formatMonetary(this.priceIncTax) + '</td>' +
			'<td class="texttablert">' + CURRENCYSYMBOL + formatMonetary(this.getTotal()) + '</td>' +
			'<td class="texttablert"><input type="button" class="bgbutton" value="Remove" onclick="document.forms[\'cart\'].elements[\'' + qIdent + '\'].value=\'0\';document.forms[\'cart\'].submit();"></td>' + // 1.0.4
			'</tr>';
		
		return html;
	};
	
	// Get total price
	this.getTotal = function(){
		var total = this.priceIncTax * this.quantity;
		
		return total;
	};
}

/**
 * Instantiate cart
 * @returns {Cart}
 */
function getCartObject()
{
	var appendSiteID = '';
	var customerId = getCustomerID(); // Function in NetSuite theme head
	var reference = '';
	var campaign = $('#campaigncode').val();
	var orderLines = getOrderLines();
	
	// 1.0.5 NLShopperId cookie name has siteId appended to it if siteId > 1
	if(siteId > 1) // siteId defined in brand-specific.js
	{
		appendSiteID = siteId;
	}
	
	reference = getCookie('NLShopperId' + appendSiteID); // Function in offershelper.js
	
	var cart = new Cart(customerId, 
			reference, 
			campaign, 
			orderLines,
			brandId); // From brand-specific.js
	
	return cart;
}

/**
 * Instantiates the HTML Line Items in the basket as OrderLine objects
 * @returns {Array}
 */
function getOrderLines()
{
	var orderLines = new Array();
	
	// Grab HTML Line Item values
	$('[id^=carttablerow]').each(function(){
		var orderLine = null;
		
		var qIdent = $(this).children(':nth-child(4)').children('input').attr('id');
		var quantity = $(this).children(':nth-child(4)').children('input').val();
		var itemCode = $(this).children(':nth-child(1)').text();
		var description = $(this).children(':nth-child(2)').text();
		var price = $(this).children(':nth-child(7)').text();
		var itemType = 'ITEM';
		
		// 1.1.2 - Put errors/messages on item line description column
		var legacyDesc = $(this).children(':nth-child(3)').html();
		if (legacyDesc.indexOf('<') >= 0)
		{
			legacyDesc = legacyDesc.substr(legacyDesc.indexOf('<'), legacyDesc.length-legacyDesc.indexOf('<'));
			description += legacyDesc;
		}
		
		quantity = parseFloat(quantity);
		
		price = parsePriceToFloat(price); // 1.0.6
		
		// Price inc tax calculated as Total/Qty
		// 1.0.8 *100 works around JavaScript inexact floating point issue
		price = (price*100)/(quantity*100);
		
		// Instantiate OrderLine object
		orderLine = new OrderLine(qIdent, quantity, itemCode, description, price, itemType);
		
		// Adds OrderLine object to orderLines array
		orderLines.push(orderLine);
	});
	
	return orderLines;
}

/**
 * 1.0.6 Converts a string price to a float
 * Currency and global thousand separator settings are negligible
 * However, pence/cents MUST be included
 * E.g. "£19,800.00"
 * E.g. "$1,000.00"
 * E.g. "19.000,00€"
 * @param price
 * @returns {Number}
 */
function parsePriceToFloat(price)
{
	var priceFloat = 0.00;
	var negative = false;
	
	if (price.indexOf('-') > -1)
	{
		negative = true;
	}
	
	// Remove any non-digit character
	priceFloat = price.replace(/\D/ig, '');
	
	// parseFloat
	priceFloat = parseFloat(priceFloat);
	
	// Divide by 100 to add pence
	priceFloat /= 100;
	
	if (negative)
	{
		priceFloat = -priceFloat;
	}
	
	return priceFloat;
}

/**
 * OfferCart class
 * @param totalSavings
 * @param grandTotal
 * @param offers
 * @returns
 */
function OfferCart(totalSavings, grandTotal, offers)
{
	this.totalSavings = totalSavings;
	this.grandTotal = grandTotal;
	this.offers = offers;
	
	// Export as HTML
	this.toHTML = function(){
		var offerLinesHTML = '';
		
		// Loop over order lines and append XML
		for (var i = 0; i < offers.length; i++)
		{
			offerLinesHTML += offers[i].toHTML();
		}
		
		var html = '<table id="offercart" class="offercart">' +
			'<colgroup>' +
			'<col style="width:15%;">' +
			'<col style="width:5%;">' +
			'<col style="width:30%;">' +
			'<col style="width:25%;">' +
			'<col style="width:15%;">' +
			'<col style="width:10%;">' +
			'</colgroup>' +
			'<tr><th class="listheadernosort" colspan="6">Special Offers to Apply</th></tr>' +
			offerLinesHTML +
			'<tr class="cart-hr"><td colspan="6"></td></tr>' +
			'<tr><td colspan="3" class="cart-total">&nbsp;</td><td class="cart-total">Total with offers</td>' +
			'<td id="cartgrandtotal" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.grandTotal - this.totalSavings) + '</td>' +
			'<td class="cart-total">&nbsp;</td></tr>' +
			'</table>';
		
		return html;
	};
}

/**
 * OfferLine class
 * @param image
 * @param description
 * @param saving
 * @returns
 */
function OfferLine(image, description, saving)
{
	this.image = image;
	this.description = description;
	this.saving = saving;
	
	// Export as HTML
	this.toHTML = function(){
		var html = '<tr>' +
			'<td class="texttablectr">Offer</td>' +
			'<td class="texttablectr"><img src="' + this.image + '" alt=""></td>' +
			'<td class="texttable" colspan="2">' + this.description + '</td>' +
			'<td class="texttablert">' + CURRENCYSYMBOL + '-' + formatMonetary(this.saving) + '</td>' +
			'<td class="texttablert">&nbsp;</td>' +
			'</tr>';
		
		return html;
	};
}
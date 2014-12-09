/*******************************************************
 * Name:		Offers Helper
 * Script Type:	Client
 *
 * Version:		1.0.0 - 07/09/2012 - Initial version - SB
 * 				1.0.1 - 19/09/2012 - Fixed page refresh timing - SB
 * 				1.0.2 - 26/09/2012 - Initial addPromo() function that will apply promos - SB
 * 				1.0.3 - 27/09/2012 - Fixed bug where adding URL parameter breaks URL - SB
 * 				1.0.4 - 27/09/2012 - Initial showOffer() function to display offer description - SB
 * 				1.0.5 - 03/10/2012 - Implemented rest of addPromo() to add customer's offers - SB
 * 				1.0.6 - 08/10/2012 - Added extra space at end of URL to force FieldChange - SB
 * 										Implemented clearBasket() function - SB
 *				1.0.7 - 15/10/2012 - Clear basket in alternative way so it can be done on 
 *										non-checkout page - SB
 *				1.0.8 - 18/10/2012 - Add offers to Special Offers page - SB
 *				1.0.9 - 19/10/2012 - Remove any anchors, which would cause the page not to refresh - SB
 *				1.1.0 - 19/10/2012 - Moved carousel init code here - SB
 *										Also a workaround to make carousel work in IE - SB
 *				1.1.1 - 24/10/2012 - Workaround for NetSuite defect #233757 
 *										(new cart line not rendered upon custom FieldChanged event) - SB
 *				1.1.2 - 24/10/2012 - Add campaign input button - SB
 *				1.1.3 - 25/10/2012 - Removed defunct offer info code - SB
 *				1.1.4 - 28/10/2012 - Store chosen offers in a cookie when logged out - SB
 *				1.1.5 - 29/10/2012 - Sandbox/Live currently have different URLs - SB
 *				1.1.6 - 30/10/2012 - Tax correction - SB
 *										Set cookies on netsuite.com domain, if third-party in use - SB
 *										Update shipping in mini-cart - SB
 *										List selected offers in Basket - SB
 *				1.1.7 - 31/10/2012 - Remember logged-out campaign - SB
 *				1.1.8 - 31/10/2012 - Clear remembered offers when campaign changes - SB
 *										Completely remove tax from checkout - SB
 *				1.1.9 - 12/11/2012 - Brand segregation - SB
 *				1.2.0 - 16/11/2012 - Enable passing ccode in via URL param - SB
 *				1.2.1 - 23/11/2012 - Fixed incorrect getOfferStringByCustomerIdURL deployment URL production - SB
 *				1.2.2 - 23/11/2012 - Added old IE indexOf workaround - SB
 * 				1.2.3 - 28/11/2012 - Production only script IDs after Sandbox refresh - SB
 * 				1.2.4 - 11/01/2013 - Changed the way selected offers get attached to cart - SB
 * 				2.0.0 - 20/03/2013 - New basket. Incorporate offers rework - SB
 * 				2.0.1 - 02/04/2013 - Call mini cart - SB
 * 				2.0.2 - 03/04/2013 - Checkout functionality - SB
 * 				2.0.3 - 05/04/2013 - Apply new Checkout Answer to Review & Submit page - SB
 * 				2.0.4 - 11/04/2013 - Add 3 additional offer fields - SB
 * 				2.1.0 - 11/04/2013 - Remove custom customer record functionality - SB
 * 				2.1.1 - 15/04/2013 - Remove cookies on thank you page - SB
 * 				2.1.2 - 15/04/2013 - Add thousands separator to monetary amount - SB
 * 				2.1.3 - 19/04/2013 - Retry getting calculation record if it hasn't been calculated - SB
 * 				2.1.4 - 23/04/2013 - Support JSONP - SB
 * 				2.1.5 - 03/07/2013 - Hide savings message if the customer didn't save any money - SB
 * 				2.1.6 - 03/07/2013 - Hide gift certificate inputs - SB
 * 				2.1.7 - 03/07/2013 - Hide unwanted rows/cols on Thank You page and resize squashed widths - SB
 * 				2.1.8 - 05/07/2013 - Buttons above and below - SB
 * 				2.1.9 - 16/07/2013 - Review & Submit T&Cs right, plus phone field text - SB
 *
 * Author:		S.Boot
 * 				A.Morganti
 * 
 * Purpose:		Add buttons and user-interactivity to 
 * 				checkout process
 * 
 * Script: 		offershelper.js
 * Deploy: 		This script is Deployed here: 
 * 					https://system.sandbox.netsuite.com/app/site/setup/sitetheme.nl?id=105&nl=F&e=T
 * 
 *******************************************************/

//var brandId = [brand-specific.js];
//var checkoutSiteCategoryId = [brand-specific.js];

// 1.1.5 Live URLs
var getOfferIdByPromoCodeURL = '/app/site/hosting/scriptlet.nl?script=65&deploy=1&compid=3322617&h=1b394da6aeaa9e98b140&pc=';
var getOfferStringByCustomerIdURL = '/app/site/hosting/scriptlet.nl?script=64&deploy=1&compid=3322617&h=9e1082d82a57fbf15763&customer=';
var loadOffersCartSuiteletURL = '/app/site/hosting/scriptlet.nl?script=66&deploy=1&compid=3322617&h=7ab99d555c6c3532365c&customer=';
var getOfferDescriptionURL = '/app/site/hosting/scriptlet.nl?script=68&deploy=1&compid=3322617&h=11e408d2389f4d46d1b6&offerid=';
//var CHECKOUTSUITELETURL = '/app/site/hosting/scriptlet.nl?script=142&deploy=1&compid=3322617&h=c791dfd3bd60a6e3ed86'; // SB1
//var CHECKOUTSUITELETURL = 'https://forms.sandbox.netsuite.com/app/site/hosting/scriptlet.nl?script=133&deploy=1&compid=3322617_SB2&h=b98178631488c41952fd'; // SB2
var CHECKOUTSUITELETURL = 'https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=185&deploy=1&compid=3322617&h=703416045186e823b206'; // Production

var clearBasketURL = '/app/site/backend/emptycart.nl';
var offerId = 0;
var offerArray = new Array();
var offerCarousel = null; // 1.1.0

$(document).ready(function()
{
	// 1.2.0 ccode URL param should override ccode inserted anywhere else
	if ($.getUrlVar('ccode'))
	{
		setCookie(unqSitePrefix + 'ccode', decodeURIComponent($.getUrlVar('ccode')), 30);
	}

	// 1.1.7
	var ccode = getCookie(unqSitePrefix + 'ccode');
	if ($('#campaigncode').val() == '' && ccode)
	{
		$('#campaigncode').val(ccode);
	}

	// 1.1.2
	displayOffers();

	// 1.1.2 Handler for calling displayOffers from the page
	$('#campaigncodego').click(function(){
		changeCampaign();
	});

	// 1.1.2 Stop form submitting on enter
	$('#campaigncode').keydown(function(event){
		if(event.keyCode == 13) {
			changeCampaign();
			event.preventDefault();
			return false;
		}
	});
	
	// If we're on the special offers page, hide the checkout button
	if ($('#offers-cart-suitelet-special').length > 0)
	{
		$('#xcheckout').hide();
	}
	
	// Hide Gift Certificate inputs
	$('#offers-gc').hide();
	$('[name="gc"]').parent().parent().parent().parent().parent().parent().hide();
	$('[name="gc"]').parent().parent().parent().parent().parent().parent().next().hide();
	
	// 2.1.9
	$('#phone').css('margin-right', '2px').after(TXT_PHONEFIELD);
	
	// If shippingmethodtable exists and custbody_mrf_deliveryinstructions does't exist,
	// we're on the Shipping Method page
	if ($('#shippingmethodtable').length > 0 && 
			$('#custbody_mrf_deliveryinstructions').length == 0)
	{
		// Auto-submit form
		$('#submitter').click();
	}
	
	// If paymethhider exists, we're on the payment page
	if ($('#paymethhider').length > 0)
	{
		// Get total via checkoutSuitelet.js
		checkoutSuitelet(displayTotalInPaymentPage);
		
		// Hide Gift Cert input
		var gcRow = $('#applygift').parent().parent().parent().parent().parent().parent().parent();
		$(gcRow).hide();
		$(gcRow).prev().hide();
		$(gcRow).next().hide();
		
		// Insert new Gift Cert panel
		var gcPanel = '<div id="offers-gc"><p><label for="xgc">Enter Gift Certificate</label></p><input id="xgc" onchange="document.forms[\'paymeth\'].gc.value=this.value;" size="15" maxlength="40"><input id="xapplygift" name="xapplygift" class="bgbutton" type="button" value="Apply"></div>';
		$(gcRow).prev().prev().before('<tr><td colspan="2">' + gcPanel + '</td></tr>');
		
		// Set up Gift Cert buttons
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
	}
	
	// If the custbody_mrf_deliveryinstructions field exists, we're on the Review & Submit page
	if($('#custbody_mrf_deliveryinstructions').length > 0)
	{
		// 2.0.2 Remove nlcrumbtrail
		$('#nlcrumbtrail').hide();
		
		// Show help text
		$('.helptext').show();
		
		// 2.0.3 Move address & payment panels to new structure
		var shippingAddress = $('#shippingaddress').detach();
		var billingAddress = $('#billingaddress').detach();
		var paymentMethod = $('#paymentmethodtable').detach();
		
		// Insert new structure
		$('#submitordertable').before('<table class="offercart"><tr><th class="smalltext listheadernosort" style="width:33%;text-align:center;">Your Shipping Address</th>' +
			'<th class="smalltext listheadernosort" style="width:34%;text-align:center;">Your Billing Address</th>' +
			'<th class="smalltext listheadernosort" style="text-align:center;">Payment Method</th></tr></table>' +
			'<div id="xsubmitordertable"><div class="left"/><div class="centre"/><div class="right"/></div>');
		
		// Centre panels
		$(shippingAddress).css({'margin': '0 auto'});
		$(billingAddress).css({'margin': '0 auto'});
		$(paymentMethod).css({'margin': '0 auto'});
		
		// Create panel layout
		$('#xsubmitordertable .left').css({
			'float': 'left',
			'width': '33%'
		})
		.append(shippingAddress);
		$('#xsubmitordertable .centre').css({
			'float': 'left',
			'width': '33%'
		})
		.append(billingAddress);
		$('#xsubmitordertable .right').css({
			'float': 'left',
			'width': '33%'
		})
		.append(paymentMethod);
		
		// Hide native title and create new one
		$('#xsubmitordertable b').hide();
		
		// 2.0.2 Hide campaign code field
		$('#custbody_campaign').parent().parent().parent().hide();
		
		// 2.0.2 Hide native NetSuite checkout table
		$('#carttable').hide();
		
		// 2.0.3 Button amendments
		var submitter = $('#submitter').detach();
		$('#tbl_submitter').parent().parent().parent().parent().before($(submitter));
		$('#submitter').val('Submit Order >>');
		
		var updater = $('#tbl_submitter').parent().next().children('span').children('.nlbutton').detach();
		$(submitter).before($(updater));
		$(updater).attr('id', 'yrecalc');
		$(submitter).attr('id', 'ycheckout');
		
		var cancel = '<input type="button" id="ycancel" class="nlbutton" value="&lt;&lt; Continue Shopping" onclick="location.href=cartURL();">';
		$('#yrecalc').before(cancel);
		
		// 2.1.9 Move T&Cs right
		$('.tcs-label').parent().css('text-align', 'right');
		
		// Show new checkout answer
		checkoutMain();

		// Procedure to add offers to order
		triggerOffers();
	}
	else
	{
		// Show the Submit Order button
		$('#submitter').show();
	}
	
	// 2.1.1 If .checkoutthankstext exists, we're on the thank you page
	if ($('.checkoutthankstext').length > 0)
	{
		// Clear ccode cookies
		clearCookies();
		
		// 2.1.7 - Hide unwanted rows/columns
		$('#ordersummary_Tax').hide();
		$('#ordersummary_Tax').parent().children('tr').children('td:nth-child(3)').hide();
		$('#ordersummary_Tax').parent().children('tr').children('td:nth-child(5)').hide();
		$('#ordersummary_Tax').parent().children('tr').children('td:nth-child(6)').hide();
		$('#ordersummary_total').children('[colspan="5"]').attr('colspan', '3');
		$('#ordersummary_total').parent().parent().css('width', '940px');
		
		// Make sure table columns aligned a certain way in old attributes are aligned properly with CSS instead
		$('[align="RIGHT"]>div').css('text-align', 'right');
		$('.texttablectr').addClass('texttable');
		$('.texttablectr').removeClass('texttablectr');
	}
	
	// 2.1.7 - Expand squashed widths on order history page
	if ($('#type').val() == 'salesord')
	{
		$('#main_form>table').css({'width':'940px','margin':'0 20px'});
		$('.pt_container').parent().parent().parent().parent().css('width', '100%');
		$('#detail_table_lay').css('width', '100%');
		$('#detail_table_lay table').css('width', '100%');
		$('#items_pane').parent().parent().parent().parent().css({'width':'940px','margin':'0 20px'});
		$('#items_pane').parent().parent().parent().parent().find('table').css('width', '100%');
		$('#tbl_secondarycancelorder').css('margin', '0 20px');
		
		// Remove shipping carrier field
		$('#shipcarrier_fs_lbl').parent().parent().hide();
	}
});

/**
 * Displays the total amount on the Payment page
 * @param data
 */
function displayTotalInPaymentPage(data)
{
	var total = 0;
	
	// Check if data has been processed
	if (data.status == 'Processed')
	{
		var grandTotal = parseFloat(data.grandTotal);
		var totalSavings = parseFloat(data.totalSavings);
		
		total = grandTotal - totalSavings;
		
		// CURRENCYSYMBOL defined in cart.js
		total = CURRENCYSYMBOL + formatMonetary(total);
		
		$('#paytotal').html('TOTAL &nbsp;&nbsp;&nbsp;' + total);
	}
	else
	{
		// Wait 5 seconds and try getting the data again
		setTimeout(function(){checkoutSuitelet(displayTotalInPaymentPage);}, 5000);
	}
}

/**
 * Show warning before changing campaign code
 */
function changeCampaign()
{
	if ($('#campaigncode').val().length > 0 &&
			$('#campaigncode').val() != getCookie(unqSitePrefix + 'ccode'))
	{
		if (confirm('If you change your promotional code, different offers may apply.\nDo you wish to continue?'))
		{
			displayOffers();
		}
	}
}

/**
 * 1.1.2
 * 1.2.1 - Remove clear cookies code
 * 2.0.2 - Users don't choose offers any more
 * Loads the graphical offers
 */
function displayOffers()
{
	// 1.1.7 Store campaign code in cookie if the field exists and has changed since page load
	if ($('#campaigncode').length > 0 && $('#campaigncode').val() != getCookie(unqSitePrefix + 'ccode'))
	{
		setCookie(unqSitePrefix + 'ccode', $('#campaigncode').val(), 30);
	}

	// Set HTML to "Fetching offers..."
	$('#offers-cart-suitelet-special').html('<p style="font-weight:bold;color:red;">Fetching offers...</p>');

	// Load customer unique offers in Special Offers page
	$('#offers-cart-suitelet-special')
	.load(loadOffersCartSuiteletURL + getCustomerID() + '&cache=' + Math.random() + '&ccode=' + encodeURIComponent($('#campaigncode').val()) + '&brand=' + brandId); // 1.0.8
	
	// 2.0.0 Display new cart if on Cart page
	if ($('#offers-cart-suitelet').length > 0)
	{
		cartMain(false); // Defined in cart.js
	}
	else // 2.0.1 Call mini cart function
	{
		miniCartMain(); // Defined in cart.js
	}
}

/**
 * Trigger addition of offers upon page load
 */
function triggerOffers()
{
	// Get Campaign Code from cookie
	var ccode = getCookie(unqSitePrefix + 'ccode');
	
	// Call Campaign Code's onchange event
	var ajaxUrl3 = '/app/site/backend/setcheckoutvalue.nl?sc=' + 
		checkoutSiteCategoryId + 
		'&redirect=none&custbody_campaign=' + 
		encode(ccode + '<' + Math.random() + '>');
	
	$.ajax({url: ajaxUrl3})
	.done(function(){
		// Set the ccode into the field
		$('#custbody_campaign').val(ccode);
		
		// Show the Submit Order button
		$('#submitter').show();
	});
}

/**
 * Removes all entered offers and items
 * 1.2.0 - clear cookies too
 */
function clearBasket()
{
	if (confirm('Are you sure you wish to remove all items from your basket?'))
	{
		window.location.href = clearBasketURL;
		
		clearCookiesNotLoggedIn();
	}
}

/**
 * 1.1.1
 * Round an amount and fix it to 2 decimal places
 * 2.1.2 Add thousands separator
 * @param amount
 * @returns string
 */
function formatMonetary(amount)
{
	var negative = false;
	var price = (Math.round(amount*100)/100).toFixed(2);
	var formattedPrice = '';
	var zeros = 2;
	
	if (price < 0)
	{
		negative = true;
		price = Math.abs(price);
	}
	
	// Make price string specific to user's region settings
	price = '' + price;
	//price = price.replace('.', decimalseparator); // decimalseparator defined in NetSuite-generated JavaScript // TODO but not available at this point
	
	for (var i = price.length - 1; i >= 0; i--)
	{
		if (i < price.length - 6)
		{
			zeros ++;
			if (zeros == 3) // Number of integers before separator
			{
				//formattedPrice = groupseparator + formattedPrice; // groupseparator defined in NetSuite-generated JavaScript // TODO but not available at this point
				formattedPrice = ',' + formattedPrice;
				zeros = 0;
			}
			
		}
		
		formattedPrice = price[i] + formattedPrice;
	}
	
	if(negative)
	{
		formattedPrice = '-' + formattedPrice;
	}
	
	return formattedPrice;
}

/**
 * 1.1.4 - Get a cookie
 * @param c_name
 * @returns string
 */
function getCookie(c_name)
{
	var retVal = '';
	var i, x, y; 
	var ARRcookies = new Array();

	ARRcookies = document.cookie.split(";");

	for (i = 0; i < ARRcookies.length; i++)
	{
		x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
		y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
		x = x.replace(/^\s+|\s+$/g, "");
		if (x == c_name)
		{
			retVal= unescape(y);
			break;
		}
	}

	return retVal;
}

/**
 * 1.1.4 - Set a cookie
 * @param c_name
 * @param value
 * @param exdays
 */
function setCookie(c_name, value, exdays)
{
	var exdate = new Date();
	var hostname = window.location.hostname;
	var domain = '';
	var cookieString = '';

	// If we're in sandbox
	if (isSandbox())
	{
		domain = 'sandbox.netsuite.com';
	}
	else
	{
		// If we're not on a netsuite domain
		if (hostname.search(/^(.+\.)*netsuite\.com$/) < 0)
		{
			domain = hostname;

			// 1.1.6 Set the cookie on the NetSuite domain (for checkout etc.)
			document.getElementById('server_commands').src 
			= 'https://checkout.netsuite.com/c.' + getTestDriveNum() + '/site/common/offerscookie.html?name=' + unqSitePrefix + 'offers&value=' + value;
		}
		else
		{
			domain = 'netsuite.com';
		}
	}


	exdate.setDate(exdate.getDate() + exdays);
	var c_value = escape(value)	+ ((exdays == null) ? "" : "; expires=" + exdate.toUTCString() + "; path=/; domain=" + domain);

	cookieString = c_name + "=" + c_value;

	document.cookie = cookieString;


}

/**
 * clear cookies
 * 1.2.1 added 20/11/2012
 * 2.0.2 Offers not chosen any more
 */
function clearCookies()
{
	var ccode = getCookie(unqSitePrefix + 'ccode');

	// If the customer is logged in, clear the cookies
	if(getCustomerID())
	{
		// Expire the campaign cookie
		if (ccode)
		{
			setCookie(unqSitePrefix + 'ccode', '', -1); // 1.1.7
		}
	}
}

/**
 * clear cookies
 * 1.2.1 added 20/11/2012
 * 2.0.2 Offers not chosen any more
 */
function clearCookiesNotLoggedIn()
{
	var ccode = getCookie(unqSitePrefix + 'ccode');

	// Expire the campaign cookie
	if (ccode)
	{
		setCookie(unqSitePrefix + 'ccode', '', -1); // 1.1.7
	}
}

// 1.2.2 - Bugfix for IE<9. Array.indexOf method not implemented
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(obj, start)
	{
		for ( var i = (start || 0), j = this.length; i < j; i++)
		{
			if (this[i] === obj)
			{
				return i;
			}
		}
		return -1;
	};
}

/**
 * Main checkout page table generation function
 */
function checkoutMain()
{
	// Call checkoutSuitelet
	checkoutSuitelet(checkoutSuiteletSuccess);
}

/**
 * Get data from checkoutSuitelet and execute function upon success
 * @param successFunction
 */
function checkoutSuitelet(successFunction)
{
	var reference = '';
	var appendSiteID = '';
	
	// NLShopperId cookie name has siteId appended to it if siteId > 1
	if(siteId > 1) // siteId defined in brand-specific.js
	{
		appendSiteID = siteId;
	}
	
	reference = getCookie('NLShopperId' + appendSiteID) + '&callback=?'; // 2.1.4
	
	// Call checkout Suitelet and get Checkout Answer from latest record
	$.getJSON(CHECKOUTSUITELETURL + '&reference=' + reference, successFunction);
}

/**
 * Upon successful getting of the checkout
 * @param data
 */
function checkoutSuiteletSuccess(data)
{
	var checkout = null;
	var html = '';
	var checkoutLines = new Array();
	
	// Check if data has been processed
	if (data.status == 'Processed')
	{
		// Loop over checkout lines
		for (var i = 0; i < data.checkoutLines.length; i++)
		{
			var quantity = parseFloat(data.checkoutLines[i].quantity);
			var description = data.checkoutLines[i].description;
			var offerDescription = data.checkoutLines[i].offerDescription;
			var offerImage = data.checkoutLines[i].offerImage;
			// 2.0.4
			var offerDescription1 = data.checkoutLines[i].offerDescription1;
			var offerImage1 = data.checkoutLines[i].offerImage1;
			var offerDescription2 = data.checkoutLines[i].offerDescription2;
			var offerImage2 = data.checkoutLines[i].offerImage2;
			var offerDescription3 = data.checkoutLines[i].offerDescription3;
			var offerImage3 = data.checkoutLines[i].offerImage3;
			var itemCode = data.checkoutLines[i].itemCode;
			var image = data.checkoutLines[i].image;
			var priceIncTax = parseFloat(data.checkoutLines[i].priceIncTax);
			
			// Put into array of CheckoutLine objects
			checkoutLines.push(
				new CheckoutLine(quantity, itemCode, image, description, priceIncTax, offerDescription, offerImage, offerDescription1, offerImage1, offerDescription2, offerImage2, offerDescription3, offerImage3)
			);
		}
		
		// Put data into Checkout and CheckoutLine objects
		checkout = new Checkout(parseFloat(data.shipping), 
				parseFloat(data.totalSavings), 
				parseFloat(data.grandTotal), 
				checkoutLines);
		
		// Output Checkout HTML
		html = checkout.toHTML();
		
		// Add cancel button
		var cancel = '<input type="button" id="xcancel" class="nlbutton" value="&lt;&lt; Continue Shopping" onclick="location.href=cartURL();">';
		
		// Add extra recalc button
		var recalc = '<input id="xrecalc" class="nlbutton" type="button" name="change" value="Change Order">';
		
		// Add extra submit button
		var submitter = '<input id="xcheckout" class="bgbutton checkout-button" type="button" name="submitter" value="Submit Order &gt;&gt;">';
		
		// Output checkout HTML
		$('#carttable').before(cancel + recalc + submitter + html);
		
		// Add click event to extra recalc button
		$('#xrecalc').click(function(){$('#yrecalc').click();});
		
		// Add click event to extra submit button
		$('#xcheckout').click(function(){$('#ycheckout').click();});
	}
	else
	{
		// Wait 5 seconds and try getting the data again
		setTimeout(function(){checkoutSuitelet(checkoutSuiteletSuccess);}, 5000);
	}
}

/**
 * Checkout Class
 */
function Checkout(shipping, totalSavings, grandTotal, checkoutLines)
{
	this.shipping = shipping;
	this.totalSavings = totalSavings;
	this.grandTotal = grandTotal;
	this.checkoutLines = new Array();
	
	// Export as HTML
	this.toHTML = function(){
		var checkoutLinesHTML = '';
		var savingsHTML = '';
		var subTotal = 0;
		
		// Loop over checkoutLines and append HTML
		for (var i = 0; i < checkoutLines.length; i++)
		{
			checkoutLinesHTML += checkoutLines[i].toHTML();
			subTotal += checkoutLines[i].getTotal();
		}
		
		// 2.1.5 - Show savings messasge if customer saved money
		if (this.totalSavings)
		{
			savingsHTML = '<div class="cart-savings">You saved on this order: ' + 
				CURRENCYSYMBOL + formatMonetary(this.totalSavings) + 
				'</div>'; // CURRENCYSYMBOL defined in cart.js
		}
		
		var html = '<table id="ordercart" class="offercart">' +
		'<colgroup>' +
		'<col style="width:15%;">' +
		'<col style="width:5%;">' +
		'<col style="width:40%;">' +
		'<col style="width:15%;">' +
		'<col style="width:10%;">' +
		'<col style="width:15%;">' +
		'</colgroup>' +
		'<tr>' +
		'<th class="smalltext listheadernosort" style="text-align:center;">Item Code</th>' +
		'<th class="smalltext listheadernosort">&nbsp;</th>' +
		'<th class="smalltext listheadernosort">Description</th>' +
		'<th class="smalltext listheadernosort" style="text-align:center;">Quantity</th>' +
		'<th class="smalltext listheadernosort" style="text-align:right;">Price</th>' +
		'<th class="smalltext listheadernosort" style="text-align:right;">Total</th>' +
		'</tr>' +
		checkoutLinesHTML +
		'<tr><td colspan="3" class="cart-total">&nbsp;</td><td colspan="2" class="cart-subtotal">Sub Total Before Offers</td>' + 
		'<td id="cartitemtotal" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.grandTotal - this.shipping) + '</td></tr>' +
		'<tr><td colspan="3" class="cart-total">&nbsp;</td><td colspan="2" class="cart-subtotal">Special Offers</td>' + 
		'<td id="cartitemtotal" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + '-' + formatMonetary(this.totalSavings) + '</td></tr>' +
		'<tr><td colspan="3" class="cart-total">&nbsp;</td><td colspan="2" class="cart-subtotal">Delivery</td>' +
		'<td id="cartpandp" class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.shipping) + '</td></tr>' +
		'<tr class="cart-hr"><td colspan="6"></td></tr>' +
		'<tr><td colspan="4" class="cart-total">&nbsp;</td><td class="cart-total">Total</td>' +
		'<td class="cart-total" style="text-align:right;">' + CURRENCYSYMBOL + formatMonetary(this.grandTotal - this.totalSavings) + '</td></tr>' +
		'</table>' + 
		savingsHTML;
		
		return html;
	};
}

/**
 * CheckoutLine Class
 */
function CheckoutLine(quantity, itemCode, image, description, priceIncTax, offerDescription, offerImage, offerDescription1, offerImage1, offerDescription2, offerImage2, offerDescription3, offerImage3)
{
	this.quantity = quantity;
	this.itemCode = itemCode;
	this.image = image;
	this.description = description;
	this.priceIncTax = priceIncTax;
	this.offerDescription = offerDescription;
	this.offerImage = offerImage;
	// 2.0.4
	this.offerDescription1 = offerDescription1;
	this.offerImage1 = offerImage1;
	this.offerDescription2 = offerDescription2;
	this.offerImage2 = offerImage2;
	this.offerDescription3 = offerDescription3;
	this.offerImage3 = offerImage3;
	
	// Export as HTML
	this.toHTML = function(){
		var html = '';
		
		//2.0.4
		var offerDesc = this.offerDescription;
		
		if (this.offerDescription1)
		{
			offerDesc += '<br>' + this.offerDescription1;
		}
		if (this.offerDescription2)
		{
			offerDesc += '<br>' + this.offerDescription2;
		}
		if (this.offerDescription3)
		{
			offerDesc += '<br>' + this.offerDescription3;
		}
		
		html = '<tr>' +
		'<td class="texttablectr">' + this.itemCode + '</td>' +
		'<td class="texttablectr"><img src="' + this.image + '" alt=""></td>' +
		'<td class="texttable">' + this.description + '<br>' +
		'<span class="cart-offerdesc">' + offerDesc + '</span></td>' +
		'<td class="texttablectr">' + this.quantity + '</td>' +
		'<td class="texttablert">' + CURRENCYSYMBOL + formatMonetary(this.priceIncTax) + '</td>' +
		'<td class="texttablert">' + CURRENCYSYMBOL + formatMonetary(this.getTotal()) + '</td>' +
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
 * Tells customer how to apply offer
 */
function addPromo()
{
	alert('To apply this offer, please choose an applicable product. ');
}
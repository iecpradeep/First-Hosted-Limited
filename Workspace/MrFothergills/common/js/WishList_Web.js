/*******************************************************
 * Name:		WishList_Web.js
 * Script Type:	JavaScript
 *
 * Version:	1.0.0 - Initial release - GP
 * 			1.0.1 - 14/12/2012 - Add AddItem() function to add item post-login - SB
 * 									Fix AddItem() where customer aborts login - SB
 * 									Brand-segregation for login URL - SB
 * 									Move to common folder - SB
 *
 * Author:	GProxy (originally from eCommerce bundle)
 * Purpose:	JavaScript handler for Wish List
 *******************************************************/

// Wish List Cart Functions
var catalogue = getTestDriveNum();
//var addToWishListUrl = "https://forms.netsuite.com/app/site/hosting/scriptlet.nl?script=11&deploy=1&compid=3322617&h=e0ea4a9d5be48ece77c8";
var addToWishListUrl = "/app/site/hosting/scriptlet.nl?script=11&deploy=1&compid=3322617&h=e0ea4a9d5be48ece77c8";

//var siteId = [brand-specific.js];
//var checkoutSiteCategoryId = [brand-specific.js];

AddItem(); // 1.0.1

function AddItem()
{
	var idItem = readCookie(unqSitePrefix + 'idItem');
	var idCustomer = getCustomerID();
	
	if(idItem != null && idItem != "" && idCustomer)
	{
		eraseCookie(unqSitePrefix + 'idItem');
		
		var url = window.location.href;
		while(url.indexOf("&") != -1)
		{
			url = url.replace("&", "*");
		}
		
		window.location.href = addToWishListUrl + '&idCustomer=' + idCustomer + '&idItem=' + idItem + '&url=' + url;   
		
		window.alert('The item has been added to your WishList.');
	}
}

function readCookie(name) 
{
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) 
	{
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name)
{
	createCookie(name,"",10);
}

function AddToWishList(idItem,price)
{
	if(confirmLogin() == "")
	{
		if (confirm('To add items to your Wish List, you need to log in or create an account. \nContinue?'))
		{
			createCookie(unqSitePrefix + 'idItem', idItem, 10);
			window.location.href = 'https://checkout.netsuite.com/s.nl?c='+catalogue+'&n=' + siteId + '&sc=' + checkoutSiteCategoryId + '&login=T&reset=T&redirect_count=1&did_javascript_redirect=T'; // 1.0.1
		}
	}
	else
	{
		var idCustomer = getCustomerID();
		var url = window.location.href;
		while(url.indexOf("&") != -1)
		{
			url = url.replace("&", "*");
		}
		
		window.location.href = addToWishListUrl + '&idCustomer=' + idCustomer + '&idItem=' + idItem + '&url=' + url;   
		
		window.alert('The item has been added to your WishList.');
	}
}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}
/**********************************************************************************************************
 * Name:		WishList
 * Script Type:	Suitelet
 *
 * Version:		1.0.0 - 13/06/2012 - Initial version - SB
 * 				1.0.1 - 13/11/2012 - Brand segregation (relative URLs) - SB
 * 				1.0.2 - 06/12/2012 - CSS changes to fit with web site theme - SB
 *
 * Author:		S.Boot
 * 
 * Purpose:		WishList functions
 * 
 * Script: 		WishList_MRF.js
 * Deploy:		customdeploy1
 * 
 **********************************************************************************************************/

var WishList_ID = 10;
var removeItemUrl = "/app/site/hosting/scriptlet.nl?script=13&deploy=1&compid=3322617&h=60e155328ef8302d1bd0";
var clearWishListUrl = "/app/site/hosting/scriptlet.nl?script=12&deploy=1&compid=3322617&h=e9096022b6b50dfce5a5";

var customWishList = 'custentity_itemswishlist';

var DEBUG = true;

function ViewWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var catalogue = params.getParameter('accountnbr');
	WishList_ID = params.getParameter('wlid');
	
	var cssUrl = params.getParameter('css');
	var imageRemoveUrl = "'/images/icons/store/btn_removeFromCart.gif'";
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}
	
	//var customer = nlapiLoadRecord('lead', idCustomer);
	
	var itemsWL = customer.getFieldValue(customWishList);
	var html = '<!DOCTYPE html><html><head><link rel="stylesheet" href="/core/styles/pagestyles.nl?ct=100&amp;bglt=ffffff&amp;bgmd=64b9d3&amp;bgdk=808080&amp;bgon=64b9d3&amp;bgoff=64b9d3&amp;bgbar=64b9d3&amp;tasktitletext=FFFFFF&amp;crumbtext=FFFFFF&amp;headertext=FFFFFF&amp;ontab=FFFFFF&amp;offtab=FFFFFF&amp;text=000000&amp;link=000000&amp;bgbody=d2d0d3&amp;bghead=ffffff&amp;portlet=64b9d3&amp;portletlabel=ffffff&amp;bgbutton=64b9d3&amp;bgrequiredfld=ffff99&amp;font=Arial%2CHelvetica%2Csans-serif&amp;size_site_content=11pt&amp;size_site_title=13pt&amp;size=1.0&amp;nlinputstyles=T&amp;NS_VER=2012.2.0&amp;3"><link href="' + cssUrl + '" rel="stylesheet" type="text/css"></head>';
	html = html + "<script language='javascript'>";
	html = html + "function RedirectGProxy(){window.open('http://www.gproxy.com');}";
	if(itemsWL == null || itemsWL == "")
	{
		html = html + "</script>";
		html = html + "<body style='background:transparent;'><table class='effectStatic'><tr><td class='arial12bold'><label>There are no items in your WishList</label></td></tr>";
		html = html + "<tr><td>&nbsp;</td></tr>";
	}
	else
	{	
		html = html + "function ajax_do(idItem, qty){window.parent.location.href = '/app/site/backend/additemtocart.nl?c=" + catalogue + "&buyid=' + idItem + '&qty=' + qty + '&redirect=/s.nl/c." + catalogue + "/it.I/id." + WishList_ID  + "/.f';}";
		html = html + "var itemsCart = new Array(); function send(){var _multi = '';for (var i=0;i<itemsCart.length;i++){var _itm = itemsCart[i];_multi += _itm.id.replace('qty_','')+','+_itm.qty+';'; ajax_do(_itm.id.replace('qty_',''), _itm.qty);} window.parent.location.href = '/s.nl/c." + catalogue + "/sc.3/.f';}";
		html = html + "function popItemX_ID(parid){for(var i=0;i<itemsCart.length;i++){if (itemsCart[i].id==parid){itemsCart.splice(i,1);}}}";
		html = html + "function qtyChanged(event){event = event || window.event;var qty = event.target || event.srcElement;popItemX_ID(qty.id);val=document.getElementById(qty.id).value;itemsCart[itemsCart.length]={id:qty.id,qty:val};}";
		html = html + "function Redirect(item){window.parent.location = '/s.nl/c." + catalogue + "/it.A/id.' + item + '/.f';}";
		html = html + "function RemoveItem(item){window.location = '" + removeItemUrl + "&idCustomer=" + idCustomer + "&accountnbr=" + catalogue + "&idItem=' + item + '" + "&wlid=" + WishList_ID + "';}";
		html = html + "function ClearWishList(){window.location.href = '" + clearWishListUrl + "&accountnbr=" + catalogue + "&idCustomer=" + idCustomer + "&wlid=" + WishList_ID + "';}";
		html = html + "function AddToCart(item){var qtyId = 'qty_' + item;var qty = document.getElementById(qtyId).value;ajax_do(item, qty);}";
		html = html + "</script>";
			
		var itemsWLArray = new Array();
		itemsWLArray = itemsWL.split(";");
		
		html = html + "<body style='background:transparent;'><table id='carttable' width='99%' border='0' cellpadding='0' cellspacing='0' class='effectStatic'><tr class='carttableheader'>";
    	html = html + "<td width='220' class='smalltext'><div class='listheadernosort'>Name</div></td>";
    	html = html + "<td class='smalltext'><div class='listheadernosort'>Description</div></td>";
    	html = html + "<td width='70' class='smalltext'><div class='listheadernosort'>Price</div></td>";
    	html = html + "<td width='70' class='smalltext'><div class='listheadernosort'>Qty</div></td>";
    	html = html + "<td width='44' class='smalltext'><div class='listheadernosort'>&nbsp;</div></td>";
		html = html + "<td width='70' class='smalltext'><div class='listheadernosort'>&nbsp;</div></td></tr>";
    	for(var i = 0; i < itemsWLArray.length - 1; i++)
		{
			var item = itemsWLArray[i];
			
			// Get item type
			var arrSearchFilters = new Array();
			arrSearchFilters[0] = new nlobjSearchFilter('internalid', null, 'anyOf', item);
			
			var arrSearchColumns = new Array();
			nlapiLogExecution('DEBUG','Item', item);

			arrSearchColumns[0] = new nlobjSearchColumn('internalid');
			arrSearchColumns[1] = new nlobjSearchColumn('type');
			
			var itemResults =  nlapiSearchRecord('item', null, arrSearchFilters, arrSearchColumns);
	
			var rectype = itemResults[0].getRecordType();
			
			var itemRecord = nlapiLoadRecord(rectype, item);
			var itemName = itemRecord.getFieldValue('storedisplayname');
			var bgcolor = null;
			if(i % 2 == 0)
			{
				bgcolor = '#EBEBEB';
			}
			else
			{
				bgcolor = '#F8F8F8';
			}
    		html = html + "<tr><td height='25' bgcolor=" + bgcolor + " class='texttable'><label onClick='Redirect( " + item + ")'><a href='#'>" + itemName + "</a></label></td>";
    		var itemDescription = itemRecord.getFieldValue('storedescription');
    		if(itemDescription == null)
			{
				itemDescription = "";
			}
    		html = html + "<td bgcolor=" + bgcolor + " class='texttable'>" + itemDescription + "</td>";
    		var price = itemRecord.getLineItemMatrixValue('price1', 'price', 9, 1); // 9 is online price
			if(price == null)
			{
				price = "";
			}
			else
			{
				price = "&pound;" + price;
			}
	    	html = html + "<td bgcolor=" + bgcolor + " class='texttablert'>" + price + "</td>";
	    	html = html + "<td bgcolor=" + bgcolor + " class='texttable'><input type='text' style='width:40px;' value='1' id='qty_" + item + "' name='qty_" + item +  "' onblur='qtyChanged(event)'></td>";
	    	html = html + "<td bgcolor=" + bgcolor + " class='texttable'><img src=" + imageRemoveUrl + "  onClick='RemoveItem(" + item + ")' border='0'></td>";
	    	html = html + "<td bgcolor=" + bgcolor + " class='texttablectr' align='right'><input type='button' class='bgbutton' value='Add to Basket' onclick='AddToCart(" + item + ")'></td></tr>";
		}
      		html = html + "</table>";
	      	html = html + "<table width='100%' border='0' cellpadding='0' cellspacing='0' class='border'>";
  		html = html + "<tr><td colspan='7'><table class='effectStatic' width='100%' border='0' cellspacing='0' cellpadding='0'>";
  		html = html + "<tr><td align='right'>&nbsp;</td><td width='1'></td><td width='104'><input type='button' class='nlbutton' value='Clear Wish List' onclick='ClearWishList()'></td>";
		html = html + "</tr></table></td></tr></table>";
	}
	html = html + "<table>";
	html = html + "<tr><td >&nbsp;</td></tr>";
	//html = html + "<tr><td style='font-size:12px' class='arial11normal'>Provided by <label onClick='RedirectGProxy()'><a href='#'>GProxy Design</a></label></td></tr>";
	html = html + "</table>";
	html = html + "</body></html>";
	response.write(html);
	response.setHeader('Custom-Header-Demo', 'Demo');
}


function AddToWishList(params)
{	
	var idCustomer = params.getParameter('idCustomer');
	var idItem = params.getParameter('idItem');

	var url = params.getParameter('url');
	while(url.indexOf("*") != -1)
	{
		url = url.replace("*","&");
	}

	if ((isNaN(idCustomer) == true) ||(idCustomer == null) || (idCustomer == 0) || (idCustomer == ''))
	{
		var html = "<!DOCTYPE html><html><script language='javascript'>";
		html = html + "function Redirect(){window.parent.location = '" + url + "';}";
		html = html + "</script>";
		html = html + "<body onLoad='Redirect()'></body></html>";
		response.write( html );
		response.setHeader('Custom-Header-Demo', 'Demo');
		return true;
	}
	else	
	{
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
		var columns = new Array();
		columns[0] = new nlobjSearchColumn( 'entityid' );
		var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
		if(searchresults != null && searchresults.length > 0)
		{
			customer = nlapiLoadRecord('customer', idCustomer);
		}
		else
		{
			customer = nlapiLoadRecord('lead', idCustomer);
		}
	
		if(customer.getFieldValue('lastname') == null)
		{
			customer.setFieldValue('lastname','.');
		}
		
		var itemsWL = customer.getFieldValue(customWishList);
		if(itemsWL == null)
		{
			itemsWL = idItem + ";";
			customer.setFieldValue(customWishList, itemsWL);	
			nlapiSubmitRecord(customer, true);
		}
		else
		{
			var exists = false;	
			var itemsArray = new Array();
			itemsArray = itemsWL.split(';');
			for(var i = 0; i < itemsArray.length - 1; i++)
			{
				var itemID = itemsArray[i];
				if(itemID == idItem)
				{	
					exists = true;
				}
			}
			if(!exists)
			{
				itemsWL = itemsWL + idItem + ";";
				customer.setFieldValue(customWishList, itemsWL);	
				nlapiSubmitRecord(customer, true);
			}
		}	
		var html = "<!DOCTYPE html><html><script language='javascript'>";
		html = html + "function Redirect(){window.parent.location = '" + url + "';}";
		html = html + "</script>";
		html = html + "<body onLoad='Redirect()'></body></html>";
		response.write( html );
		response.setHeader('Custom-Header-Demo', 'Demo');
	}
}

function RemoveFromWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var idItem = params.getParameter('idItem');
	var catalogue = params.getParameter('accountnbr');
	WishList_ID = params.getParameter('wlid');
	
	var viewWishListUrl = "'/s.nl/c."+catalogue+"/it.I/id." + WishList_ID  + "/.f'";
		
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}
	
	//var customer = nlapiLoadRecord('lead', idCustomer);
	
	var itemsWL = customer.getFieldValue(customWishList);
	var itemsArray = new Array();
	itemsArray = itemsWL.split(';');
	var newItems = "";
	for(var i = 0; i < itemsArray.length - 1; i++)
	{
		var itemID = itemsArray[i];
		if(itemID != idItem)
		{
			newItems = newItems + itemsArray[i] + ";";
		}
	}
	customer.setFieldValue(customWishList, newItems);	
	nlapiSubmitRecord(customer, true);
	
	var html = "<!DOCTYPE html><html><script language='javascript'>";
	html = html + "function Redirect(){window.parent.location = " + viewWishListUrl + ";}";
	html = html + "</script>";
	html = html + "<body onLoad='Redirect()'></body></html>";
	response.write( html );
	response.setHeader('Custom-Header-Demo', 'Demo');
}

function ClearWishList(params)
{
	var idCustomer = params.getParameter('idCustomer');
	var catalogue = params.getParameter('accountnbr');
	WishList_ID = params.getParameter('wlid');
	
	var viewWishListUrl = "'/s.nl/c."+catalogue+"/it.I/id." + WishList_ID  + "/.f'";
	
	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'internalid', null, 'is', idCustomer, null );
	var columns = new Array();
	columns[0] = new nlobjSearchColumn( 'entityid' );
	var searchresults = nlapiSearchRecord( 'customer', null, filters, columns );
	if(searchresults != null && searchresults.length > 0)
	{
		customer = nlapiLoadRecord('customer', idCustomer);
	}
	else
	{
		customer = nlapiLoadRecord('lead', idCustomer);
	}
	
	//var customer = nlapiLoadRecord('lead', idCustomer);
	
	customer.setFieldValue(customWishList, null);
	nlapiSubmitRecord(customer, true);
	
	var html = "<!DOCTYPE html><html><script language='javascript'>";
	html = html + "function Redirect(){window.parent.location = " + viewWishListUrl + ";}";
	html = html + "</script>";
	html = html + "<body onLoad='Redirect()'></body></html>";
	response.write( html );
	response.setHeader('Custom-Header-Demo', 'Demo');
}

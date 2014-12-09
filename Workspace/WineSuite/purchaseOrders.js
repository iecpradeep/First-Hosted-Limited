/**
* @fileOverview
* @name Innov.CL.LHK.PurchaseOrder.js
* @author Innov - Eli Beltran
* 09-4-2012
* @version 1.0
* Deployed as Client-Script in Purchase Order
* @description:
*/

var pageInit = function(type)
{
	if(type == 'create' || type == 'edit')
	{
		nlapiDisableLineItemField('item', 'custcol_fhl_uom', 'T'); //Disable the UOM Field
	}
};

function isBlank(test)
{ 
	if ( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32)  )
	{
		return true;
	}
	else
	{
		return false;
	}
}
/**
* @fileOverview
* @name Innov.CL.LHK.Rotation.Inventory.Transfer.js
* @author Innov - Eli Beltran
* 08-07-2012
* @version 1.0
* Deployed as Client-Script in Rotation Inventory Transfer
* @description:
*/

var pageInit = function(type)
{
	if(type == 'create')
	{
		nlapiSetFieldValue('custrecord_lhk_rit_transfer_price', '0.00');
		nlapiSetFieldValue('custrecord_lhk_rit_transfer_amount', '0.00');
	}
};

var fieldChanged = function(type,name)
{
	
	if(name == 'custrecord_lhk_rit_transferqty')
	{
		calculate();
	}
	
	if(name == 'custrecord_lhk_rit_transfer_price')
	{
		calculate();
	}
	
	if(name == 'custrecord_lhk_rit_transferqty')
	{
		var availableQty = parseInt(nlapiGetFieldValue('custrecord_lhk_rit_availableqty'));
		var transferQty = parseInt(nlapiGetFieldValue('custrecord_lhk_rit_transferqty'));

		if(transferQty > availableQty)
		{
			alert('You cannot transfer more than the available quantity.');
			nlapiSetFieldValue('custrecord_lhk_rit_transferqty', availableQty);
		}
	}
	return true;
};

var saveRecord = function(type)
{

	var fromLocation = nlapiGetFieldValue('custrecord_lhk_rit_fromlocation');
	var toLocation =  nlapiGetFieldValue('custrecord_lhk_rit_tolocation');

	if(fromLocation == toLocation)
	{
		alert('You must transfer from different location.');
		return false;
	}
	else
	{
		return true;
	}
};

var calculate = function()
{
	var quantity = parseFloat(nlapiGetFieldValue('custrecord_lhk_rit_transferqty'));
	var transferPrice = parseFloat(nlapiGetFieldValue('custrecord_lhk_rit_transfer_price'));
	
	var amount = quantity * transferPrice;
	nlapiSetFieldValue('custrecord_lhk_rit_transfer_amount', amount);
};




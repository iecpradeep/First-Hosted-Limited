/**
* @fileOverview
* @name Innov.CL.LHK.Rotation.Inventory.Adjustment.js
* @author Innov - Eli Beltran
* 08-08-2012
* @version 1.0
* Deployed as Client-Script in Rotation Inventory Adjustment
* @description:
*/

var pageInit = function(type){
	if(type == 'create')
	{
		var rotationName = nlapiGetFieldText('custrecord_lhk_ria_originalrotation');
		nlapiSetFieldValue('custrecord_lhk_ria_newrotation', rotationName + '-IA');

		var originalPackSize = nlapiGetFieldValue('custrecord_lhk_ria_originalpacksize');
		nlapiSetFieldValue('custrecord_lhk_ria_newunitstype', originalPackSize);

		var baseuom = nlapiGetFieldValue('custrecord_ria_base_uom'); //Base UOM
		var unitType = nlapiGetFieldValue('custrecord_lhk_ria_originalpacksize'); //Rotation Pack Size

		var obj = nlapiLoadRecord('unitstype', baseuom);
		var count = obj.getLineItemCount('uom');
		for(var i = 1; i <= count; i++)
		{
			var internalid = obj.getLineItemValue('uom', 'internalid', i);
			if(internalid == unitType)
			{
				var conversionrate = obj.getLineItemValue('uom', 'conversionrate', i);
				nlapiSetFieldValue('custrecord_ria_unit_conversion', conversionrate);
			}
		}

		//Get Per Unit Cost
		var cost = nlapiGetFieldValue('custrecord_ria_currency_cost');
		var gbpCost = nlapiGetFieldValue('custrecord_ria_gbp_unit_cost');
		var conversion = nlapiGetFieldValue('custrecord_ria_unit_conversion');

		var unitCost = parseFloat(cost) / parseFloat(conversion);
		nlapiSetFieldValue('custrecord_ria_per_unit_cost', unitCost.toFixed(2)); //Currency Cost

		var gbpCostCalc = parseFloat(gbpCost) / parseFloat(conversion);
		nlapiSetFieldValue('custrecord_ria_new_gbp_unit_cost', gbpCostCalc.toFixed(2)); //Currency Cost

	}
}

var fieldChanged = function(type,name){


	if(name == 'custrecord_lhk_ria_newunitstype')//New Rotation Pack Size
	{
		var baseuom = nlapiGetFieldValue('custrecord_ria_base_uom'); //Base UOM
		var unitType = nlapiGetFieldValue('custrecord_lhk_ria_newunitstype'); //New Rotation Pack Size
		var qtyToBreak = nlapiGetFieldValue('custrecord_lhk_ria_qtytobreak'); //Qty Cases to Break

		var obj = nlapiLoadRecord('unitstype', baseuom);
		var count = obj.getLineItemCount('uom');
		for(var i = 1; i <= count; i++)
		{
			var internalid = obj.getLineItemValue('uom', 'internalid', i);
			if(internalid == unitType)
			{
				var conversionrate = obj.getLineItemValue('uom', 'conversionrate', i);
				nlapiSetFieldValue('custrecord_ria_new_unit_conversion', conversionrate);

				if(!isBlank(qtyToBreak) && !isBlank(conversionrate))
				{
					calculateCase();
				}
			}
		}
	}

	if(name == 'custrecord_lhk_ria_qtytobreak')
	{
		calculateCase();
	}
	
	if(name == 'custrecord_lhk_ria_qtytobreak')
	{
		var qtyToBreak = parseInt(nlapiGetFieldValue('custrecord_lhk_ria_qtytobreak'));
		var availableBottle = parseInt(nlapiGetFieldValue('custrecord_lhk_ria_unitsavailable'));
		
		var res = availableBottle - qtyToBreak;
		if(res < 0)
		{
			nlapiSetFieldValue('custrecord_lhk_ria_qtytobreak', 1)
		}
	}

	return true;
}

var calculateCase = function(){
	var qtyToBreak = nlapiGetFieldValue('custrecord_lhk_ria_qtytobreak');
	var unitConversion = nlapiGetFieldValue('custrecord_ria_unit_conversion');
	var newUnitConversion = nlapiGetFieldValue('custrecord_ria_new_unit_conversion');

	var newCaseAvailable = parseFloat(qtyToBreak) * parseFloat(unitConversion);
	nlapiSetFieldValue('custrecord_ria_new_case_bottle', newCaseAvailable);

	var newCaseBottle = parseFloat(newCaseAvailable) / parseFloat(newUnitConversion);
	nlapiSetFieldValue('custrecord_new_case_bottle', newCaseBottle);

	var newUnitConversion = parseFloat(nlapiGetFieldValue('custrecord_ria_new_unit_conversion'));
	var newPerUnitCost = parseFloat(nlapiGetFieldValue('custrecord_ria_per_unit_cost'));

	var newGBPConversion = parseFloat(nlapiGetFieldValue('custrecord_ria_new_unit_conversion'));
	var newPerUnitGBPCost = parseFloat(nlapiGetFieldValue('custrecord_ria_new_gbp_unit_cost'));

	var newUnitCost = newUnitConversion * newPerUnitCost;
	nlapiSetFieldValue('custrecord_ria_new_currency_cost', newUnitCost.toFixed(2));

	var newUnitGBPCost = newGBPConversion * newPerUnitGBPCost;
	nlapiSetFieldValue('custrecord_ria_gpb_cost', newUnitGBPCost.toFixed(2));

}

var check = function(){
	var unitsAvailable = parseInt(nlapiGetFieldValue('custrecord_lhk_ria_unitsavailable'));
	var adjustmentQty = parseInt(nlapiGetFieldValue('custrecord_lhk_ria_newrotationqty'));

	if(adjustmentQty > unitsAvailable)
	{
		//not possible
		alert('You cannot create adjustment more than the available quantity.');
		nlapiSetFieldValue('custrecord_lhk_ria_newrotationqty', unitsAvailable);
	}
}

function isBlank(test){ if ( (test == '') || (test == null) ||(test == undefined) || (test.toString().charCodeAt() == 32)  ){return true}else{return false}}
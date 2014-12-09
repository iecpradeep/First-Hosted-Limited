
/*******************************************************
 * Name:		LHK Sales Order Client Script
 * Script Type:	Client
 * Version:		1.2.1
 * 				1.2.2 - MAL Added Internal ID for bank details
 * Date:		21 Feb 2013
 * Author:		FHL
 * 
 *******************************************************/

// 1.2.2 - MAL Added Internal ID for bank details from bank details custom records. (bdlist)
var bdListGBP = 1;
var bdListEUR = 2;
var bdListCHF = 3;
var bdListUSD = 0;

var formInitialised = function()
{
	nlapiDisableLineItemField('item', 'tax1amt', true);
	nlapiDisableLineItemField('item', 'grossamt', true);
	nlapiDisableLineItemField('item', 'taxrate1', true);
	nlapiDisableLineItemField('item', 'taxcode', true);
	nlapiDisableLineItemField('item', 'units', true);
	nlapiDisableLineItemField('item', 'amount', true);
	nlapiDisableLineItemField('item', 'units_display', true);
	nlapiDisableLineItemField('item', 'description', true);
	nlapiDisableLineItemField('item', 'custcol_fhl_purchase_rate', true);
	nlapiDisableLineItemField('item', 'custcol_fhl_gp', true);
	nlapiDisableLineItemField('item', 'custcol_lotreservcation', true);
	nlapiDisableLineItemField('item', 'custcol_so_rotation_deldate', true);
	nlapiDisableLineItemField('item', 'custcol_rotation_uom', true);
	nlapiDisableLineItemField('item', 'options', true);
	nlapiDisableLineItemField('item', 'custcol_fhl_gppc', true);
	nlapiDisableLineItemField('item', 'custcol_fhl_uom', true);
	nlapiSetFieldValue('custbody_bd_list', 1);
};

function afterSourcing(type,name)
{
	//alert(name);
	
	if (type == 'item' && name == 'custcol_tran_rotation')
	{
			var rotuom = nlapiGetCurrentLineItemValue('item','custcol_rotation_uom');
			nlapiSetCurrentLineItemValue('item','units',rotuom);
			var rotdeldate = nlapiGetCurrentLineItemValue('item', 'custcol_so_rotation_deldate');
			nlapiSetFieldValue ('custbody_delivery_date', rotdeldate);
			
			return true;
	} //if
	
	if (type == 'item' && name == 'units')
	{
			var unitConversionRate = nlapiGetCurrentLineItemValue('item','unitconversionrate');
			var baseprice = nlapiGetCurrentLineItemValue('item','custcol_itembaseprice');
			var unitbaseprice = parseFloat(unitConversionRate * baseprice);

			nlapiSetCurrentLineItemValue('item','custcol_lhk_itemunitbaseprice', unitbaseprice.toFixed(2));
			return true;	
	} //if
		
	return true;		
}


var fieldChanged = function(type,name)
{
	//Set the Bank Details based on the Currency type of the transaction - Mapped to Bank Details custom record
	if(name == 'currency')
	{
		var TranCurrency = parseInt(nlapiGetFieldValue('currency'));
		var currency = new Currency();

		if(TranCurrency == currency.GBP)
		{
			nlapiSetFieldValue('custbody_bd_list', bdListGBP);
		}
		if(TranCurrency == currency.USD)
		{
			nlapiSetFieldValue('custbody_bd_list', bdListUSD);
		}
		if(TranCurrency == currency.EUR)
		{
			nlapiSetFieldValue('custbody_bd_list', bdListEUR);
		}
		if(TranCurrency == currency.CHF)//CHF
		{
			nlapiSetFieldValue('custbody_bd_list', bdListCHF);
		}
		return true;
	}

	if (name == 'custbody_saletype')
	{
		//Get current sale type
		var saleType = nlapiGetFieldValue('custbody_saletype');
		var saleTypeList = new SaleType();

		//if sales type = in bond, then disable ship to address selector, otherwise enable it
		if(saleType == saleTypeList.IN_BOND)
		{
			nlapiSetFieldValue('shipaddresslist','',false,false);
			nlapiSetFieldValue('shipaddress','',false,false);
			nlapiDisableField('shipaddresslist',true);
		}
		else
		{
			nlapiDisableField('shipaddresslist', false);

		} //else
		return true;
	}

	if (name == 'location')
	{
		// get current sale type
		var saleType = nlapiGetFieldValue('custbody_saletype');

		if(!isBlank(saleType))
		{
			// get allowable locations from sale type record
			var inbondAllowed = nlapiLookupField('customrecord_saletype', saleType, 'custrecord_stockfrominbond');
			var dutyPaidAllowed = nlapiLookupField('customrecord_saletype',saleType,'custrecord_stockfromdutypaid');

			// get current location and parameters
			var location = nlapiGetFieldValue(name);
			var inbondLocation = nlapiLookupField('location', location,'custrecord_inbondlocation');
			var dutypaidLocation = nlapiLookupField('location', location,'custrecord_dutypaidlocation');

			if (inbondLocation == 'T' && inbondAllowed == 'F')
			{
				alert('Error: You have selected an In-bond location for a sale type where In-bond locations are not allowed.\nSelect a different location or sale type.');
				return false;
			} //if
		}
	}
	if (name == 'shipaddresslist')
	{
		var shipaddress = nlapiGetFieldValue('shipaddresslist');
		if (shipaddress != '' && shipaddress != null)
		{
			nlapiSetFieldValue('custbody_bondwarehouse','',false,false);
		} //if

		return true;
	}	
	return true;
};

//Recalc Function
var recalcLine = function()
{
	
	var totalcost = parseFloat(0.00);
	var itemcost = parseFloat(0.00);
	var totalgp = parseFloat(0.00);
	var exchangerate = nlapiGetFieldValue('exchangerate');
	var exdutytotal = parseFloat(0.00);

	//Loop on all lines
	for(var i = 1; i <= nlapiGetLineItemCount('item'); i++)
	{
		var itemType = nlapiGetLineItemValue('item', 'itemtype', i);

		if(itemType == 'InvtPart')
		{
			var item_cost = parseFloat(nlapiGetLineItemValue('item', 'custcol_fhl_purchase_rate', i)); //Rot GBP Cost
			var item_gp = parseFloat(nlapiGetLineItemValue('item','custcol_fhl_gp',i));
			var item_qty = parseInt(nlapiGetLineItemValue('item', 'quantity', i));
			var item_rate = parseInt(nlapiGetLineItemValue('item', 'rate', i));

			if(isNaN(item_cost))
			{
				item_cost = parseFloat(0.00);
			}

			if(item_cost >= 0)
			{
				item_cost = item_cost * item_qty;
				totalcost += item_cost;
				totalgp += item_gp;
			}
		
			exdutytotal += item_rate * item_qty;
		}
	}

	nlapiSetFieldValue('custbody_fhl_gross_cost', nlapiFormatCurrency(totalcost * exchangerate)); //Set Gross Cost

	var headersubtotal = nlapiGetFieldValue('subtotal');
	if (headersubtotal > 0)
	{
		var headercost = nlapiGetFieldValue('custbody_fhl_gross_cost'); //Gross Cost
		//var headergp = nlapiFormatCurrency((headersubtotal - headercost)); //Subtotal - Gross Cost
		var headergp = nlapiFormatCurrency(totalgp);
		
		var headergppc = (((headergp/exdutytotal)*100));

		headergp = Math.round(headergp*100)/100;
		headergppc = Math.round(headergppc*100)/100;

		nlapiSetFieldValue('custbody_fhl_gross_profit',headergp); //Set Gross Profit
		nlapiSetFieldValue('custbody_fhl_gross_margin',headergppc);
	}
};


/**
 * @returns {Boolean}
 */
function addLine()
{
	// get current sale type
	var saleType = nlapiGetFieldValue('custbody_saletype');
	var item = nlapiGetCurrentLineItemValue('item','item');

	// Do the Line and Header Gross Profit Calculations - BR
	var purchaserate = nlapiGetCurrentLineItemValue('item','custcol_fhl_purchase_rate');
	var exchangerate = nlapiGetFieldValue('exchangerate');	
	var salerate = nlapiGetCurrentLineItemValue('item','rate');
	salerate = parseFloat(salerate) * parseFloat(exchangerate);
	
	if (item != '4721')
	{
		var saleqty = nlapiGetCurrentLineItemValue('item','quantity');
		var saletotal = (salerate*saleqty);
		var purchasetotal = (purchaserate*saleqty);
		//var currentheadergc = parseFloat(nlapiGetFieldValue('custbody_fhl_gross_cost'));

		var grossprofit = parseFloat((saletotal-purchasetotal));

		if(grossprofit < 0) { grossprofit = 0; }
		if(saletotal < 0) { saletotal = 0; }

		var grossprofitpc = parseFloat(((grossprofit/saletotal)*100));

		if(isNaN(grossprofitpc)) { grossprofitpc = 0; }

		grossprofitpc = Math.round(grossprofitpc*100)/100;
		//currentheadergc = (currentheadergc+purchasetotal);


		nlapiSetCurrentLineItemValue('item','custcol_fhl_gp',nlapiFormatCurrency(grossprofit));
		nlapiSetCurrentLineItemValue('item','custcol_fhl_gppc',grossprofitpc);
		//nlapiSetFieldValue('custbody_fhl_gross_cost',currentheadergc);	
	} //if

	//lookup default tax code from Sale Type table and set tax item
	if (saleType != null && saleType != '')
	{
		var taxCode = nlapiLookupField('customrecord_saletype',saleType,'custrecord_taxcode');

		if (taxCode != null && taxCode != '')
		{
			nlapiSetCurrentLineItemValue('item', 'taxcode', taxCode,false,true);
		} //if
	} //if

	// **** Set print rate field
	nlapiSetCurrentLineItemValue('item','custcol_printrate', salerate.toFixed(2) );
		
	return true;

	/*
	// if sale type is in bond then set tax item to Out of Scope
	if (saleType == '1')
	{
		nlapiSetCurrentLineItemValue('item','taxcode',18);
	} //if
	*/
} //function validateLine()

/**
 * @returns {Boolean}
 */
function onSave()
{

	// get current sale type
	var saleType = nlapiGetFieldValue('custbody_saletype');
	var recalcDuty = false;

	if (saleType == '2' || saleType == '5')
	{

		//check to see if duty has already been added
		var dutyAdded = nlapiGetFieldValue('custbody_dutyadded');

		if (dutyAdded == 'T')
		{
			var confirmRecalculate = confirm('Duty has already been added to this order.\n\nTo recalculate press OK, or press Cancel to save without recalculating.');

			if (confirmRecalculate == false)
			{
				return true;
			}
			else
			{
				recalcDuty = true;
			}

		} //if

		//cycle through each item line, calculating duty. Delete duty line if found and recalcDuty = true.

		var lineCount = nlapiGetLineItemCount('item');
		var totalDuty = 0.00;

		for (var i=1; i <= lineCount; i++)
		{
			var unitOfMeasure = nlapiGetLineItemValue('item','custcol_fhl_uom',i);

			//alert('UOM=' + unitOfMeasure + ',' + nlapiGetLineItemText('item','custcol_fhl_uom',i));

			var unitConversionRate = nlapiGetLineItemValue('item','unitconversionrate',i);
			var quantity = nlapiGetLineItemValue('item','quantity',i);
			var item = nlapiGetLineItemValue('item','item',i);
			var chargeDuty = nlapiGetLineItemValue('item','custcol_chargedutyonsale',i);

			if (item == '4721' && recalcDuty == true)
			{
				nlapiSelectLineItem('item',i);
				//alert('line selected');
				nlapiRemoveLineItem('item',i);
				//alert('line removed');
				//nlapiCommitLineItem('item');
			} //if
			else if (isNotBlank(unitOfMeasure) && chargeDuty == 'T')
			{
				// construct search for base unit litres
				var uomSearchFilters = new Array();
				var uomSearchColumns = new Array();

				uomSearchFilters[0] = new nlobjSearchFilter('custrecord_baseunitlitres_uom', null, 'anyof', unitOfMeasure);

				uomSearchColumns[0] = new nlobjSearchColumn('custrecord_baseunitlitres_litres');


				// perform search
				var uomSearchResults = nlapiSearchRecord('customrecord_baseunitlitres', null, uomSearchFilters, uomSearchColumns);

				if (uomSearchResults)
				{
					litres = uomSearchResults[0].getValue(uomSearchColumns[0]);

				} //if
				
				if(isBlank(litres))
				{
					litres = 0;
				}
	
				// lookup item duty band
				
				try
				{
					var itemDutyBand = nlapiLookupField('inventoryitem',item,'custitem_duty_band');

					//lookup duty rate based on duty band
					var dutyRate = nlapiLookupField('customrecord_dutyrates',itemDutyBand,'custrecord_rate');

				}
				catch (e)
				{

				}
				
				totalDuty += parseFloat(dutyRate) * parseFloat(quantity) * parseFloat(unitConversionRate) * parseFloat(litres);
			} //if isnotblank
			else
			{
				//alert('UOM is Blank');
			} //else

		} //for


		if (totalDuty != 0)
		{
			nlapiSelectNewLineItem('item');
			nlapiSetCurrentLineItemValue('item','item',4721,false,true);
			nlapiSetCurrentLineItemValue('item','quantity',1,false,true);
			nlapiSetCurrentLineItemValue('item','rate',totalDuty.toFixed(2),false,true);
			nlapiSetCurrentLineItemValue('item','amount',totalDuty.toFixed(2),false,true);
			nlapiSetCurrentLineItemValue('item','description','Duty',false,true);
			nlapiCommitLineItem('item');

			nlapiSetFieldValue('custbody_dutyadded','T',false,true);
		} //if
	} //if

	return true;
} //function calculateDuty()


/**
 * @param poLineNumber
 * @param reservationID
 * @returns {Boolean}
 */
function updateLinesOnSale(poLineNumber, reservationID)
{
	//write the values for the Reservation record back to the Invoice Line Number. Set the cost estimate type to Custom.
	// Accessed and used by Reservation suitelet
	// Created by Toby Davidson
	//alert(reservationID);
	nlapiSelectLineItem('item', poLineNumber);
	nlapiSetCurrentLineItemValue('item','custcol_lotreservcation',reservationID,true, true);
	nlapiSetCurrentLineItemText('item','costestimatetype','Custom',true, true);
	nlapiCommitLineItem('item');

	return true;
}

//Library Functions
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}

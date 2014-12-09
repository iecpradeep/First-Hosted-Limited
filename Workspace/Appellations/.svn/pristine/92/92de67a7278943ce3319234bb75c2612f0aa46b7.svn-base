/*******************************************************
 * Name:		LHK Sales Order Client Script
 * Script Type:	Client
 * Version:		1.2.0
 * Date:		25 October 2011
 * Author:		FHL
 *******************************************************/

function formInitialised()
{
	nlapiDisableLineItemField('item', 'tax1amt', true);
	nlapiDisableLineItemField('item', 'grossamt', true);
	nlapiDisableLineItemField('item', 'taxrate1', true);
	nlapiDisableLineItemField('item', 'taxcode', true);
	nlapiDisableLineItemField('item', 'units', true);
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
	nlapiSetFieldValue('custbody_bd_list',1);
}

function afterSourcing(type,name)
{
	if (type == 'item' && name == 'custcol_tran_rotation')
	{
		var rotuom = nlapiGetCurrentLineItemValue('item','custcol_rotation_uom');
		nlapiSetCurrentLineItemValue('item','units',rotuom);
		var rotdeldate = nlapiGetCurrentLineItemValue('item', 'custcol_so_rotation_deldate');
		nlapiSetFieldValue ('custbody_delivery_date', rotdeldate);
		return true;
	}
}


function fieldChanged(type,name)
{

	if (name == 'currency')
	{
		var TranCurrency = parseInt(nlapiGetFieldValue('currency'));
		if (TranCurrency == 1)//GBP
		{
			nlapiSetFieldValue('custbody_bd_list',1);				
		}
		if (TranCurrency == 2)//USD
		{
			nlapiSetFieldValue('custbody_bd_list',3);				
		}
		if (TranCurrency == 4)//EUR
		{
			nlapiSetFieldValue('custbody_bd_list',2);				
		}
		if (TranCurrency == 5)//CHF
		{
			nlapiSetFieldValue('custbody_bd_list',4);				
		}


		return true;

	}



	if (name == 'custbody_saletype')
	{
		// get current sale type
		var saleType = nlapiGetFieldValue('custbody_saletype');

		// if sales type = in bond, then disable ship to address selector, otherwise enable it
		if (saleType == '1')
		{
			nlapiSetFieldValue('shipaddresslist','',false,false);
			nlapiSetFieldValue('shipaddress','',false,false);
			nlapiDisableField('shipaddresslist',true);

		} //if
		else
		{
			nlapiDisableField('shipaddresslist',false);

		} //else

		return true;

	} //if name==custbody_saletype

	if (name == 'location')
	{
		// get current sale type
		var saleType = nlapiGetFieldValue('custbody_saletype');

		if (saleType != '' && saleType != null)
		{
			// get allowable locations from sale type record
			var inbondAllowed = nlapiLookupField('customrecord_saletype',saleType,'custrecord_stockfrominbond');
			var dutyPaidAllowed = nlapiLookupField('customrecord_saletype',saleType,'custrecord_stockfromdutypaid');

			// get current location and parameters
			var location = nlapiGetFieldValue(name);
			var inbondLocation = nlapiLookupField('location',location,'custrecord_inbondlocation');
			var dutypaidLocation = nlapiLookupField('location',location,'custrecord_dutypaidlocation');

			if (inbondLocation == 'T' && inbondAllowed == 'F')
			{
				alert('Error: You have selected an In-bond location for a sale type where In-bond locations are not allowed.\nSelect a different location or sale type.');
				return false;

			} //if
		}


	} //if name==location

	//if (name == 'custbody_bondwarehouse')
	//{
	// retrieve bond warehouse details and populate ship address
	//	var bondWarehouse = nlapiGetFieldValue('custbody_bondwarehouse');
	//	
	//	if (bondWarehouse != '' && bondWarehouse != null) 
	//	{
	//		var address = nlapiLookupField('customrecord_custbonddetails', bondWarehouse, 'custrecord_bondwarehouseaddress');
	//		nlapiSetFieldValue(shipaddress,address,false,false);
	//	}

	//	return true;

	//} //if

	if (name == 'shipaddresslist')
	{
		var shipaddress = nlapiGetFieldValue('shipaddresslist');

		if (shipaddress != '' && shipaddress != null)
		{
			nlapiSetFieldValue('custbody_bondwarehouse','',false,false);

		}  //if

		return true;	

	} //if name==shipaddresslist

	return true;

} //function fieldChanged(type,name)

function recalcLine()
{
	var totalcost = 0;
	var itemcost = 0;
	for ( i = 1; i <= nlapiGetLineItemCount('item'); i++)
	{
		var item_cost = parseFloat(nlapiGetLineItemValue('item', 'custcol_fhl_purchase_rate', i));
		var item_qty = nlapiGetLineItemValue('item', 'quantity', i);
		if (nlapiGetLineItemValue('item', 'custcol_fhl_purchase_rate', i) >= 0)
		{
			item_cost = item_cost*item_qty;
			totalcost += item_cost;
		}
	}
	nlapiSetFieldValue('custbody_fhl_gross_cost', nlapiFormatCurrency(totalcost));


	var headersubtotal = nlapiGetFieldValue('subtotal');
	if (headersubtotal > 0)
	{
		var headercost = nlapiGetFieldValue('custbody_fhl_gross_cost');
		var headergp = nlapiFormatCurrency((headersubtotal-headercost));
		var headergppc = (((headergp/headersubtotal)*100));
		headergp = Math.round(headergp*100)/100;
		headergppc = Math.round(headergppc*100)/100;
		nlapiSetFieldValue('custbody_fhl_gross_profit',headergp);
		nlapiSetFieldValue('custbody_fhl_gross_margin',headergppc);
	}

}


function addLine()
{

	//alert('addLine');

	// get current sale type
	var saleType = nlapiGetFieldValue('custbody_saletype');



	// Do the Line and Header Gross Profit Calculations - BR

	var purchaserate = nlapiGetCurrentLineItemValue('item','custcol_fhl_purchase_rate');
	var exchangerate = nlapiGetFieldValue('exchangerate');
	var salerate = nlapiGetCurrentLineItemValue('item','rate');
	salerate = parseFloat(salerate) * parseFloat(exchangerate);
	var saleqty = nlapiGetCurrentLineItemValue('item','quantity');
	var saletotal = (salerate*saleqty);
	var purchasetotal = (purchaserate*saleqty);
	//var currentheadergc = parseFloat(nlapiGetFieldValue('custbody_fhl_gross_cost'));

	var grossprofit = parseFloat((saletotal-purchasetotal));

	if(grossprofit < 0) { grossprofit = 0 }
	if(saletotal < 0) { saletotal = 0 }

	var grossprofitpc = parseFloat(((grossprofit/saletotal)*100));

	if(isNaN(grossprofitpc)) { grossprofitpc = 0; }

	grossprofitpc = Math.round(grossprofitpc*100)/100;
	//currentheadergc = (currentheadergc+purchasetotal);

	nlapiSetCurrentLineItemValue('item','custcol_fhl_gp',nlapiFormatCurrency(grossprofit));
	nlapiSetCurrentLineItemValue('item','custcol_fhl_gppc',grossprofitpc);
	//nlapiSetFieldValue('custbody_fhl_gross_cost',currentheadergc);





	//lookup default tax code from Sale Type table and set tax item
	if (saleType != null && saleType != '')
	{
		var taxCode = nlapiLookupField('customrecord_saletype',saleType,'custrecord_taxcode');

		if (taxCode != null && taxCode != '') 
		{
			nlapiSetCurrentLineItemValue('item', 'taxcode', taxCode,false,true);
		} //if
	} //if

	return true;

	/*
	// if sale type is in bond then set tax item to Out of Scope
	if (saleType == '1')
	{
		nlapiSetCurrentLineItemValue('item','taxcode',18);	
	} //if
	 */

} //function validateLine()

function onSave()
{

	// get current sale type
	var dutyItemId = 2822;
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


		//cycle through each item line, calculating duty.  Delete duty line if found and recalcDuty = true.

		var lineCount = nlapiGetLineItemCount('item');
		var totalDuty = 0.00;

		for (var i=1; i <= lineCount; i++)
		{
			var unitOfMeasure = nlapiGetLineItemValue('item','custcol_fhl_uom',i);

			//alert('UOM=' + unitOfMeasure + ',' + nlapiGetLineItemText('item','custcol_fhl_uom',i));

			var unitConversionRate = nlapiGetLineItemValue('item','unitconversionrate',i);
			var quantity = nlapiGetLineItemValue('item','quantity',i);
			var item = nlapiGetLineItemValue('item','item',i);

			if ((item == dutyItemId) && (recalcDuty == true))
			{
				nlapiSelectLineItem('item',i);
				//alert('line selected');
				nlapiRemoveLineItem('item',i);
				//alert('line removed');
				//nlapiCommitLineItem('item');
			} //if
			else if (isNotBlank(unitOfMeasure))
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

				//alert('dutyrate=' + dutyRate + '\nQty=' + quantity + '\nunitConversionRate=' + unitConversionRate + 'litres=' + litres);



				totalDuty += parseFloat(dutyRate) * parseFloat(quantity) * parseFloat(unitConversionRate) * parseFloat(litres);



			} //if isnotblank
			else
			{
				//alert('UOM is Blank');
			} //else

		} //for

		//alert(totalDuty.toFixed(2));


		var dutyItemId = 2822;

		if (totalDuty != 0) 
		{
			nlapiInsertLineItem('item',(lineCount + 1));
			nlapiSetCurrentLineItemValue('item','item',dutyItemId,false,true);
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


function updateLinesOnSale(poLineNumber, reservationID)
{
	//write the values for the Reservation record back to the Invoice Line Number.  Set the cost estimate type to Custom.  
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
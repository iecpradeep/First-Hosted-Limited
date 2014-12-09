function generateDatasheet(button)
{
	var linkURL = nlapiResolveURL('SUITELET', 'customscript5','customdeploy1', null)
		+ '&itemid=' + nlapiGetRecordId();
	window.open(linkURL);
}

function datasheet(request, response)
{
	var itemid = request.getParameter('itemid');
	var item = nlapiLoadRecord('inventoryitem', itemid);
	
	// Decypher weight values
	var weightUnit = item.getFieldText('weightunit').toLowerCase();
	var weightMetric = '', weightImperial = '';

	if (item.getFieldValue('weight') != null)
	{
		if (weightUnit == 'kg')
		{
			weightMetric = item.getFieldValue('weight');
			weightImperial = parseFloat(weightMetric) / 2.20462262; // kg to lbs (source - Google)
			weightImperial = Math.round(weightImperial * 100) / 100;
		}
		else if (weightUnit == 'g')
		{
			weightMetric = item.getFieldValue('weight');
			weightMetric = parseFloat(weightMetric) / 1000;
			weightImperial = parseFloat(weightMetric) / 2.20462262; // kg to lbs (source - Google)
			weightImperial = Math.round(weightImperial * 100) / 100;
		}
		else if (weightUnit == 'lb')
		{
			weightImperial = item.getFieldValue('weight');
			weightMetric = parseFloat(weightImperial) / 0.45359237; // lbs to kg (source - Google)
			weightMetric = Math.round(weightMetric * 100) / 100;
		}
		else if (weightUnit == 'oz')
		{
			weightImperial = item.getFieldValue('weight');
			weightImperial = parseFloat(weightImperial) / 16;
			weightMetric = parseFloat(weightImperial) / 0.45359237; // lbs to kg (source - Google)
			weightMetric = Math.round(weightMetric * 100) / 100;
		}
	}
	
	// Product Image
	var prodImgTag = '';
	
	if (item.getFieldValue('storedisplayimage') != null)
	{
		var image = nlapiLoadFile(item.getFieldValue('storedisplayimage'));
		//prodImgTag = '<img src="' + nlapiResolveURL('RECORD', 'fileitem', item.getFieldValue('storedisplayimage')) + '" />';
		prodImgTag = '<img src="https://system.netsuite.com' + nlapiEscapeXML(image.getURL()) + '" />';
	}
	
	// XML for PDF
	var xml = '<?xml version="1.0"?>\n<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">\n' +
		'<pdf lang="en_GB" xml:lang="en-GB">\n' +
		'<head>\n' +
		'<style type="text/css">\n' +
		'body{size:A4-landscape;font-family:Arial,sans-serif;font-size:8pt;}\n' +
		'table.mainTable{width:100%;margin-bottom:1em;}\n' +
		'table.subTable{border:1pt solid #000;}\n' +
		'.mainTable td{border:1pt solid #000;padding:0;}\n' +
		'p{width:100%;}\n' +
		'.redBG{background-color:#f00;vertical-align:bottom;}\n' +
		'.yellowBG{background-color:#ff0;}\n' +
		'.blackBG{background-color:#000;}\n' +
		'.textCentre{text-align:center;}\n' +
		'.textRight{text-align:right;}\n' +
		'</style>\n' +
		'</head>\n' +
		'<body>\n' +
		'<table class="mainTable">\n' +
		'<tr>\n' +
		'<td colspan="10">\n' +
		'<img src="https://system.netsuite.com/core/media/media.nl?id=475&amp;c=691423&amp;h=7a488c8f3e84bef76fc7" style="width:4.68cm;height:1.35cm;" />\n' +
		'</td>\n' +
		'<td class="yellowBG" style="vertical-align:middle;border-right-width:0;padding-left:1em;">\n' +
		'<p><b>SRP</b></p>\n' +
		'</td>\n' +
		'<td class="yellowBG" style="vertical-align:middle;border-left-width:0;">\n' +
		'<p><b>' + item.getFieldValue('custitem_srp') + '</b></p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>PRODUCT DESCRIPTION</b></p>\n' +
		'</td>\n' +
		'<td colspan="11" style="vertical-align:middle;">\n' +
		'<p><b>' + item.getFieldValue('displayname') + '</b></p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>ITEM/UPC CODE</b></p>\n' +
		'</td>\n' +
		'<td colspan="11" style="vertical-align:middle;">\n' +
		'<p><b>' + item.getFieldValue('itemid') + '</b></p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td class="redBG" style="height:3em;">\n' +
		'<p><b>Purchasing Units.</b></p>\n' +
		'</td>\n' +
		'<td class="redBG">\n' +
		'<p class="textCentre"><b>Metric (cm and kg)</b></p>\n' +
		'</td>\n' +
		'<td class="redBG">\n' +
		'<p class="textCentre"><b>Imperial (lbs and <br />inches)</b></p>\n' +
		'</td>\n' +
		'<td colspan="4" rowspan="20">\n' +
		'<p><b>Product Photo</b><br />\n' +
		prodImgTag + '\n' +
		'</p>\n' +
		'</td>\n' +
		'<td colspan="2" rowspan="20" style="border-right-width:0;">\n' +
		'<p><b>Packaging Photo</b></p>\n' +
		'</td>\n' +
		'<td colspan="3" rowspan="20" style="border-left-width:0;">\n' +
		'<p>Type</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Unit Weight</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + weightMetric + 'kg</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + weightImperial + 'lbs</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p>Indv Pack Length</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_length') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_length_lbs_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p>Ind Pack Width</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_width') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_width_lbs_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p>Ind Pack Height</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_height') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_height_lbs_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Inner Quantity</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_quantity') + '</p>\n' +
		'</td>\n' +
		'<td class="blackBG">\n' +
		'&nbsp;\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p>Inner Net Weight</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_net_weight_kg') + 'kg</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_net_weight_lbs') + 'lbs</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p>Inner Gross Weight</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_gross_weight_kg') + 'kg</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_gross_weight_lbs') + 'lbs</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p>Inner Length</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_length_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_length_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p>Inner Width</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_width_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_width_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p>Inner Height</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_height_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_height_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Master Quantity</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_master_quantity') + '</p>\n' +
		'</td>\n' +
		'<td class="blackBG">\n' +
		'&nbsp;\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p>Outer Net Weight</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_net_weight_kg') + 'kg</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_net_weight_lbs') + 'lbs</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p>Outer Gross Weight</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_gross_weight_kg') + 'kg</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_gross_weight_lbs') + 'lbs</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p>Outer Length</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_length_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_length_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p>Outer Width</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_width_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;border-bottom-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_width_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p>Outer Height</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_height_cm') + 'cm</p>\n' +
		'</td>\n' +
		'<td style="border-top-width:0;">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_outer_height_inch') + 'inch</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>EAN number</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ean13barcode') + '</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>CBM</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_cbm') + '</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>MOQ</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>Min Order Quantity</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p class="textCentre">PCS</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>Lead Times</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>FOB Yantian</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>Currency</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>Quantity</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p>Sub Total</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="textRight">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td colspan="3" class="redBG">\n' +
		'<p><b>CUSTOMER QUOTATION</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="textRight">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td class="yellowBG">\n' +
		'<p>Unit Cost FOB</p>\n' +
		'</td>\n' +
		'<td class="yellowBG">\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_unit_cost_fob') + '</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="textRight">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Harmonized</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_harmonized') + '</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td class="textRight">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Duty Rate</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_duty_rate') + '</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'<td colspan="5">\n' +
		'<p>&nbsp;</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Port of Departure</p>\n' +
		'</td>\n' +
		'<td colspan="9">\n' +
		'<p>' + item.getFieldValue('custitem_port_of_departure') + '</p>\n' +
		'</td>\n' +
		'<td colspan="2" class="yellowBG" style="border-bottom-width:0;">\n' +
		'<p><b>EST LANDED PRICE</b></p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p>Testing Completed</p>\n' +
		'</td>\n' +
		'<td colspan="9">\n' +
		'<p>' + item.getFieldValue('custitem_testing_completed') + '</p>\n' +
		'</td>\n' +
		'<td colspan="2" class="yellowBG" style="border-top-width:0;">\n' +
		'<p>' + item.getFieldValue('custitem_est_landed_price') + '</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'</table>\n' +
		'<table class="subTable">\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>RRP</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_srp') + '</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>Master Carton</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_master_quantity') + '</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>Inner Carton</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_inner_quantity') + '</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>Length (indv. packaging)</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_length') + 'cm</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>Width (indv. packaging)</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_width') + 'cm</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'<tr>\n' +
		'<td>\n' +
		'<p><b>Height (indv. packaging)</b></p>\n' +
		'</td>\n' +
		'<td>\n' +
		'<p class="textCentre">' + item.getFieldValue('custitem_ind_pack_height') + 'cm</p>\n' +
		'</td>\n' +
		'</tr>\n' +
		'</table>\n' +
		'</body>\n</pdf>';

	var file = nlapiXMLToPDF(xml);
	response.setContentType('PDF', item.getFieldValue('displayname') + ' - ' + item.getFieldValue('itemid') + '.pdf');
	response.write(file.getValue());
}

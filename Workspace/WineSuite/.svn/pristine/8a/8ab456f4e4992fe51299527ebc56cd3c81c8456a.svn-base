/**************************************************************************************************************************************************************************
 * Name: 			supplierpackinglist_suitelet.js
 * Script Type: 	Suitelet
 * Client: 			WineSuite
 * 
 * Version: 		1.0.0 - 11/11/2011 - 1st release - BR
 * 
 * Author: 			FHL
 * Purpose: 		To search Open PO lines for the Supplier and create a Packing List Print Out
 * 		
 * Script: 			custscript_supplierpackinglist
 * Deploy: 			customdeploy_supplierpackinglist
 * 
 * Library: 		No Library.js [TODO]
 * 
 **************************************************************************************************************************************************************************/

//Declaring global variables
var supplierColumns = new Array();
var supplierFilters = new Array();

var contactColumns = new Array();
var contactFilters = new Array();

var polinefilters = new Array();
var supplierFilters = new Array();

var polinecolumns = new Array();

var billaddress = null;
var shipaddress = null;

var select = '';

var supplier = '';

var suppliersearchresults = null;
var contactsearchresults = null;
var suppliernameval = null;
var form = null;
var supplierfld = null;
var billtofld = null;
var shipfromfld = null;
var pricontactfld = null;
var emailaddressfld = null;
var phonefld = null;
var polines = null;
var selectedcol = null;
var ordernocol = null;
var vintagecol = null;
var winecol = null;
var growercol = null;
var sizecol = null;
var quantitycol = null;
var currencycol = null;
var ratecol = null;
var pricecol = null;
var orderdatecol = null;
var deldatecol = null;
var addmarkall = null;
var addrefresh = null;

var shipphone = null;
var shipcontact = null;
var supplieremail = null;

var suppliersearchresults = null;

var pdfxml = '';

var file = '';
var errormsg = '';

var lineCount = '';
var suppliercontactval = '';
var supplieremailval = '';
var supplierphoneval = '';
var supplierbilladdressval = '';
var suppliershippaddressval = '';

var vintageval = null;
var ordernum = null;
var wineval = null;
var growerval = null;
var sizeval = null;
var unitsval = null;
var currencyval =  null;
var unitpriceval = null;
var buypriceval = null;
var orderdateval = null;
var deldateval = null;
var company = null;
var contact = null;
var email = null;
var phone = null;

var debug = true;


/**************************************************************************************
 * supplierPackingList
 * 
 * @param request
 * @param response
 **************************************************************************************/
function supplierPackingList(request, response)
{
	if ( request.getMethod() == 'GET' )
	{
		supplier = parseInt(request.getParameter('SID'));

//		Search the Supplier Record to return header address for Shipping and Billing
		supplierColumns[0] = new nlobjSearchColumn('billaddress',null,null);
		supplierColumns[1] = new nlobjSearchColumn('shipaddress',null,null);
		supplierColumns[2] = new nlobjSearchColumn('companyname',null,null);
		supplierColumns[3] = new nlobjSearchColumn('contact',null,null);
		supplierColumns[4] = new nlobjSearchColumn('email',null,null);
		supplierColumns[5] = new nlobjSearchColumn('phone',null,null);
		supplierColumns[6] = new nlobjSearchColumn('billaddressee',null,null);
		supplierColumns[7] = new nlobjSearchColumn('billaddress1',null,null);
		supplierColumns[8] = new nlobjSearchColumn('billaddress2',null,null);
		supplierColumns[9] = new nlobjSearchColumn('billcity',null,null);
		supplierColumns[10] = new nlobjSearchColumn('billstate',null,null);	
		supplierColumns[11] = new nlobjSearchColumn('billcountry',null,null);
		supplierColumns[12] = new nlobjSearchColumn('billzipcode',null,null);
		supplierColumns[13] = new nlobjSearchColumn('shipaddressee',null,null);
		supplierColumns[14] = new nlobjSearchColumn('shipaddress1',null,null);
		supplierColumns[15] = new nlobjSearchColumn('shipaddress2',null,null);
		supplierColumns[16] = new nlobjSearchColumn('shipcity',null,null);
		supplierColumns[17] = new nlobjSearchColumn('shipstate',null,null);		
		supplierColumns[18] = new nlobjSearchColumn('shipcountry',null,null);
		supplierColumns[19] = new nlobjSearchColumn('shipzip',null,null);
		
		
//		supplierColumns[6] = new nlobjSearchColumn('formulatext',null, null);
//		supplierColumns[6].setFormula("{contactprimary.email}");
//		supplierColumns[7] = new nlobjSearchColumn('formulatext',null, null);
//		supplierColumns[7].setFormula("{contactprimary.entityid}");
//		supplierColumns[8] = new nlobjSearchColumn('formulatext',null, null);
//		supplierColumns[8].setFormula("{contactprimary.phone}");
		

		supplierFilters[0] = new nlobjSearchFilter('internalid',null,'is', supplier);
		

		suppliersearchresults = nlapiSearchRecord('vendor', null, supplierFilters, supplierColumns);

		if ( suppliersearchresults != null )
		{
			for (var i=0; i < suppliersearchresults.length; i++)
			{
				billaddress = suppliersearchresults[i].getValue(supplierColumns[0]);
				shipaddress = suppliersearchresults[i].getValue(supplierColumns[1]);
				company = suppliersearchresults[i].getValue(supplierColumns[2]);
				contact = suppliersearchresults[i].getValue(supplierColumns[3]);
				email = suppliersearchresults[i].getValue(supplierColumns[4]);
				phone = suppliersearchresults[i].getValue(supplierColumns[5]);

				billaddressee = suppliersearchresults[i].getValue(supplierColumns[6]);
				billaddress1 = suppliersearchresults[i].getValue(supplierColumns[7]);
				billaddress2 = suppliersearchresults[i].getValue(supplierColumns[8]);
				billcity = suppliersearchresults[i].getValue(supplierColumns[9]);
				billstate = suppliersearchresults[i].getValue(supplierColumns[10]);
				billcountry = suppliersearchresults[i].getValue(supplierColumns[11]);		
				billzipcode = suppliersearchresults[i].getValue(supplierColumns[12]);
				
				shipaddressee = suppliersearchresults[i].getValue(supplierColumns[13]);
				shipaddress1 = suppliersearchresults[i].getValue(supplierColumns[14]);
				shipaddress2 = suppliersearchresults[i].getValue(supplierColumns[15]);
				shipcity = suppliersearchresults[i].getValue(supplierColumns[16]);
				shipstate = suppliersearchresults[i].getValue(supplierColumns[17]);
				shipcountry = suppliersearchresults[i].getValue(supplierColumns[18]);
				shipzip = suppliersearchresults[i].getValue(supplierColumns[19]);
				
//				supplieremail = suppliersearchresults[i].getValue(supplierColumns[6]);
//				shipcontact = suppliersearchresults[i].getValue(supplierColumns[7]);
//				shipphone = suppliersearchresults[i].getValue(supplierColumns[8]);
			}
		}
//		End Supplier Search
	
		
//		Search the Contact Record to get the Shipping and Logistics person contact details
		contactColumns[0] = new nlobjSearchColumn('email',null,null);
		contactColumns[1] = new nlobjSearchColumn('entityid',null,null);
		contactColumns[2] = new nlobjSearchColumn('phone',null,null);

		contactFilters[0] = new nlobjSearchFilter('formulatext',null,'haskeywords', 'shipping logistics');
		contactFilters[0].setFormula("{role}");
		contactFilters[1] = new nlobjSearchFilter('internalid','vendor','is', supplier);

		contactsearchresults = nlapiSearchRecord('contact', null, contactFilters, contactColumns);
		
		if ( contactsearchresults != null )
		{
			for (var i=0 ; i < contactsearchresults.length ; i++)
			{
				supplieremail = contactsearchresults[i].getValue(contactColumns[0]);
				shipcontact = contactsearchresults[i].getValue(contactColumns[1]);
				shipphone = contactsearchresults[i].getValue(contactColumns[2]);
			}
		}
		
//		End Contact Search

//		Create the form for dynamic display and selection of lines to printed
		form = nlapiCreateForm("Supplier Packing List");
		supplierfld = form.addField('custpage_supplier','select', 'Supplier','vendor').setDefaultValue(supplier);
		
		// Labels added in for spacing.
		bill = form.addField('custpage_b','label', '');
		billa = form.addField('custpage_b1','label', '');
		billb = form.addField('custpage_b2','label', '');
		
		pricontactfld = form.addField('custpage_pricontact','text', 'Shipping Contact','contact').setDefaultValue(shipcontact);
		emailaddressfld = form.addField('custpage_emailaddress','text', 'Email Address').setDefaultValue(supplieremail);
		phonefld = form.addField('custpage_phone','text', 'Phone').setDefaultValue(shipphone);
		
		
		
//		billtofld = form.addField('custpage_billto','textarea', 'Billing Address').setDefaultValue(billaddress);
//		shipfromfld = form.addField('custpage_shipfrom','textarea', 'Warehouse Address').setDefaultValue(shipaddress);
		
		billaddressee = form.addField('custpage_billaddressee','text', 'Billing Addressee').setDefaultValue(billaddressee);
		billaddress1 = form.addField('custpage_billaddress1','text', 'Billing Address').setDefaultValue(billaddress1);
		billaddress2 = form.addField('custpage_billaddress2','text', 'Billing Address').setDefaultValue(billaddress2);
		billcity = form.addField('custpage_billcity','text', 'Billing City').setDefaultValue(billcity);
		billstate = form.addField('custpage_billstate','text', 'Billing County').setDefaultValue(billstate);
		billcountry = form.addField('custpage_billcountry','text', 'Billing Country').setDefaultValue(billcountry);
		billzipcode = form.addField('custpage_billzipcode','text', 'Billing Zip Code').setDefaultValue(billzipcode);

		
		shipaddressee = form.addField('custpage_shipaddressee','text', 'Warehouse Addressee').setDefaultValue(shipaddressee);
		shipaddress1 = form.addField('custpage_shipaddress1','text', 'Warehouse Address').setDefaultValue(shipaddress1);
		shipaddress2 = form.addField('custpage_shipaddress2','text', 'Warehouse Address').setDefaultValue(shipaddress2);
		shipcity = form.addField('custpage_shipcity','text', 'Warehouse City').setDefaultValue(shipcity);
		shipstate = form.addField('custpage_shipstate','text', 'Warehouse County').setDefaultValue(shipstate);
		shipcountry = form.addField('custpage_shipcountry','text', 'Warehouse Country').setDefaultValue(shipcountry);
		shipzip = form.addField('custpage_shipzip','text', 'Warehouse Zip Code').setDefaultValue(shipzip);
		
		
		
		form.addSubTab('polines', 'Open PO Lines');
		form.addSubTab('uselessone', 'The Uneeded Tab');

		polines = form.addSubList('sublist_polines', 'list', 'Hello World', 'polines');
		selectedcol = polines.addField('custcol_selected','checkbox', 'Print');
		ordernocol = polines.addField('tranid','text', 'Order No');
		vintagecol = polines.addField('custcol_povintagetxt','text', 'Vintage');
		winecol = polines.addField('custcol_wineprintcolumn','text', 'Wine');
		growercol = polines.addField('custcol_growerprintcolumn','text', 'Grower');
		sizecol = polines.addField('unit','text', 'Size');
		quantitycol = polines.addField('quantityuom','integer', 'Qty Of Pack Size');
		currencycol = polines.addField('custcol_pocurrencytxt','text', 'Currency');
		ratecol = polines.addField('formulacurrency','currency', 'Unit Price');
		pricecol = polines.addField('fxamount','currency', 'Total');
		orderdatecol = polines.addField('trandate','date', 'Order Date');
		deldatecol = polines.addField('custbody_receiveby','date', 'Delivery Date');
//		addmarkall = polines.addMarkAllButtons(); [TODO] Mark All Buttons only work with a LIST
		addrefresh = polines.addRefreshButton();
//		End Form creation

//		Search the Purchase Order Record for columns to print and filters to exclude items which have been received
		ordernocol = new nlobjSearchColumn('tranid',null,null);
		vintagecol = new nlobjSearchColumn('custcol_povintagetxt',null,null);
		winecol = new nlobjSearchColumn('custcol_wineprintcolumn',null,null);
		growercol = new nlobjSearchColumn('custcol_growerprintcolumn',null,null);
		sizecol = new nlobjSearchColumn('unit',null,null);
		quantitycol = new nlobjSearchColumn('quantityuom',null,null);
		currencycol = new nlobjSearchColumn('custcol_pocurrencytxt',null,null);
		ratecol = new nlobjSearchColumn('formulacurrency').setFormula("{fxamount}/{quantityuom}");
		pricecol = new nlobjSearchColumn('fxamount',null,null);
		orderdatecol = new nlobjSearchColumn('trandate',null,null);
		deldatecol = new nlobjSearchColumn('custbody_receiveby',null,null);

		polinecolumns = [ordernocol, vintagecol, winecol, growercol, sizecol, quantitycol, currencycol, ratecol, pricecol, orderdatecol, deldatecol];

		polinefilters[0] = new nlobjSearchFilter('entity',null,'is', supplier);
		polinefilters[1] = new nlobjSearchFilter('taxline',null,'is', 'F');
		polinefilters[2] = new nlobjSearchFilter('unit',null,'noneof','@NONE@');
		polinefilters[3] = new nlobjSearchFilter('formulatext',null,'startswith', 'Y');
		polinefilters[3].setFormula("CASE WHEN {quantity}-{quantityshiprecv} > 0 THEN 'Yes' ELSE 'No' END");  

		polinesearchresults = nlapiSearchRecord('purchaseorder', null, polinefilters, polinecolumns);

		if ( polinesearchresults != null )
		{
			for (var i=0;i<polinesearchresults.length;i++)
			{
				polines.setLineItemValues(polinesearchresults);
			}
		}
		
//		End Purchase Order Search
				
//		Write the Form
		form.addSubmitButton('Print Supplier Packing List');
		response.writePage(form);

	} //if
	else
	{
		//POST method

		supplier = parseInt(request.getParameter('custpage_supplier'));

		//Search the Supplier Record to return header address for Shipping and Billing
		supplierColumns[0] = new nlobjSearchColumn('entityid',null,null);

		supplierFilters[0] = new nlobjSearchFilter('internalid',null,'is', supplier);

		suppliersearchresults = nlapiSearchRecord('vendor', null, supplierFilters, supplierColumns);

		if ( suppliersearchresults != null )
		{
			for (var i=0; i < suppliersearchresults.length ; i++)
			{
				suppliernameval = suppliersearchresults[i].getValue(supplierColumns[0]);
			}
		}

		lineCount = parseInt(request.getLineItemCount('sublist_polines'));
		
		suppliercontactval = request.getParameter('custpage_pricontact');
		supplieremailval = request.getParameter('custpage_emailaddress');
		supplierphoneval = request.getParameter('custpage_phone');
		supplierbilladdressval = request.getParameter('custpage_billto');
		suppliershippaddressval = request.getParameter('custpage_shipfrom');
		
		billaddressee = request.getParameter('custpage_billaddressee');
		billaddress1 = request.getParameter('custpage_billaddress1');
		billaddress2 = request.getParameter('custpage_billaddress2');
		billcity = request.getParameter('custpage_billcity');
		billstate = request.getParameter('custpage_billstate');
		billcountry = request.getParameter('custpage_billcountry');
		billzipcode = request.getParameter('custpage_billzipcode');
		
		shipaddressee = request.getParameter('custpage_shipaddressee');
		shipaddress1 = request.getParameter('custpage_shipaddress1');
		shipaddress2 = request.getParameter('custpage_shipaddress2');
		shipcity = request.getParameter('custpage_shipcity');
		shipstate = request.getParameter('custpage_shipstate');
		shipcountry = request.getParameter('custpage_shipcountry');
		shipzip = request.getParameter('custpage_shipzip');
		
		pdfxml = '<?xml version="1.0"?>';
		pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
		pdfxml += '<pdf>';
		pdfxml += '<head>';
		pdfxml += '</head>';
		pdfxml += '<body>\n';
		pdfxml += '<table style="font-family: Arial, Helvetica, sans-serif; font-size: small; width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td width="100%" colspan="11" valign="top">';
//		pdfxml += '<p><img display="inline" src="http://shopping.netsuite.com/c.1336541/site/images/[TODO].PNG" dpi="100" /></p>';
		
		// Supplier Billing Address
		pdfxml += '<table style="font-family: Arial, Helvetica, sans-serif; font-size: small; float:left; width:250;">';
		pdfxml += '<tr><td><b>Supplier Billing Address:</b></td></tr>';
		pdfxml += '<tr><td>'+billaddressee+'</td></tr>';
		pdfxml += '<tr><td>'+billaddress1+'</td></tr>';
		pdfxml += '<tr><td>'+billaddress2+'</td></tr>';
		pdfxml += '<tr><td>'+billcity+'</td></tr>';
		pdfxml += '<tr><td>'+billstate+'</td></tr>';
		pdfxml += '<tr><td>'+billcountry+'</td></tr>';
		pdfxml += '<tr><td>'+billzipcode+'</td></tr>';
		pdfxml += '</table>';
		
		// Supplier Warehouse Address
		pdfxml += '<table style="font-family: Arial, Helvetica, sans-serif; font-size: small; float:left; width:250;">';
		pdfxml += '<tr><td><b>Supplier Warehouse Address:</b></td></tr>';
		pdfxml += '<tr><td>'+shipaddressee+'</td></tr>';
		pdfxml += '<tr><td>'+shipaddress1+'</td></tr>';
		pdfxml += '<tr><td>'+shipaddress2+'</td></tr>';
		pdfxml += '<tr><td>'+shipcity+'</td></tr>';
		pdfxml += '<tr><td>'+shipstate+'</td></tr>';
		pdfxml += '<tr><td>'+shipcountry+'</td></tr>';
		pdfxml += '<tr><td>'+shipzip+'</td></tr>';
		pdfxml += '</table>';
		
		// Supplier and Contact details
		pdfxml += '<table style="font-family: Arial, Helvetica, sans-serif; font-size: small;width=30%;">';
		pdfxml += '<tr align="left"><td><b>Supplier:</b></td>';
		pdfxml += '<td align="left">'+ suppliernameval +'</td></tr>';
		pdfxml += '<tr align="left"><td><b>Contact:</b></td>';
		pdfxml += '<td align="left">'+suppliercontactval+'</td></tr>';
		pdfxml += '<tr align="left"><td><b>Email:</b></td>';
		pdfxml += '<td align="left">'+supplieremailval+'</td></tr>';
		pdfxml += '<tr align="left"><td><b>Phone:</b></td>';
		pdfxml += '<td align="left">'+supplierphoneval+'</td></tr>';
		pdfxml += '</table>';
		
		pdfxml += '<table style="border: medium solid #000000; width:100%;"><tr>';
		pdfxml += '<td width="80" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Order No</b></td>';
		pdfxml += '<td width="80" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Vintage</b></td>';
		pdfxml += '<td width="150" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Wine</b></td>';
		pdfxml += '<td width="150" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Grower</b></td>';
		pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Size</b></td>';
		pdfxml += '<td width="70" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Units</b></td>';
		pdfxml += '<td width="85" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Currency</b></td>';
		pdfxml += '<td width="80" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Unit Price</b></td>';
		pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Total</b></td>';
		pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Order Date</b></td>';
		pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small; background-color: Silver;"><b>Delivery Date</b></td></tr></table>';


		

		for (var lineNum = 1; lineNum <= lineCount; lineNum++)
		{			
			select = request.getLineItemValue('sublist_polines','custcol_selected',lineNum);
			//pdfxml += lineNum + ' ' + select + '<br>';
			
			if (select == 'T')
			{
				pdfxml += '<table style="border-bottom: medium solid #000000; width=100%;border-right: medium solid #000000;border-left: medium solid #000000;"><tr>\n';
				
//				pdfxml += constructXML(request.getLineItemValue('sublist_polines','tranid',lineNum));
				
				ordernum = request.getLineItemValue('sublist_polines','tranid',lineNum);
				if (ordernum == null)
				{
					ordernum = '';
				}
				pdfxml += '<td width="80" valign="top" align="left" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+ordernum+'</td>\n';
				
				vintageval = request.getLineItemValue('sublist_polines','custcol_povintagetxt',lineNum);
				if (vintageval == null)
				{
					vintageval = '';
				}
				pdfxml += '<td width="80" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+vintageval+'</td>\n';
				
				wineval = request.getLineItemValue('sublist_polines','custcol_wineprintcolumn',lineNum);
				if (wineval == null)
				{
					wineval = '';
				}
				pdfxml += '<td width="150" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+wineval+'</td>\n';
				
				growerval = request.getLineItemValue('sublist_polines','custcol_growerprintcolumn',lineNum);
				if (growerval == null)
				{
					growerval = '';
				}
				pdfxml += '<td width="150" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+growerval+'</td>\n';
				
				sizeval = request.getLineItemValue('sublist_polines','unit',lineNum);
				if (sizeval == null)
				{
					sizeval = '';
				}
				pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+sizeval+'</td>\n';
				
				unitsval = request.getLineItemValue('sublist_polines','quantityuom',lineNum);
				if (unitsval == null)
				{
					unitsval = '';
				}
				pdfxml += '<td width="70" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+unitsval+'</td>\n';
				
				currencyval = request.getLineItemValue('sublist_polines','custcol_pocurrencytxt',lineNum);
				if (currencyval == null)
				{
					currencyval = '';
				}
				pdfxml += '<td width="85" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+currencyval+'</td>\n';
				
				unitpriceval = request.getLineItemValue('sublist_polines','formulacurrency',lineNum);
				if (unitpriceval == null)
				{
					unitpriceval = '';
				}
				pdfxml += '<td width="80" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+unitpriceval+'</td>\n';
				
				buypriceval = request.getLineItemValue('sublist_polines','fxamount',lineNum);
				if (buypriceval == null)
				{
					buypriceval = '';
				}
				pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+buypriceval+'</td>\n';
				
				orderdateval = request.getLineItemValue('sublist_polines','trandate',lineNum);
				if (orderdateval == null)
				{
					orderdateval = '';
				}
				pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+orderdateval+'</td>\n';
				
				deldateval = request.getLineItemValue('sublist_polines','custbody_receiveby',lineNum);
				if (deldateval == null)
				{
					deldateval = '';
				}
				pdfxml += '<td width="100" valign="top" align="center" style="font-family: Arial, Helvetica, sans-serif; font-size: x-small;">'+deldateval+'</td>\n';
				
				pdfxml += '</tr>\n</table>';
				
			} //if	
		} //for
		
		pdfxml += '</td></tr></table>';		
		pdfxml += '</body></pdf>';
	
		try
		{	
			
			file = nlapiXMLToPDF(pdfxml);	
			file.setFolder(105);
			file.setIsOnline(true);
			
			// Set the File name so it can be stored in the folder 'Printed Docs Temp Folder ** Do Not Delete**'
			file.setName('Report_'+supplier+'.pdf');
			// Save the File
			var fileid = nlapiSubmitFile(file);
	
			//Display the PDF file
			response.setContentType('PDF',fileid);
			response.write(file.getValue());
		}
		catch(e)
		{
			errormsg = "<pdfxml><body><p><b>Error: " + e.message +"</b></p></body></pdfxml>";
			response.write(errormsg);
		}
	}
}

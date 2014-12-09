
function pageInit()
{
// page init
}



function reservationSuitelet(request, response){
	
	context = nlapiGetContext();
	if (request.getMethod() == 'GET')
	{
			var customer = request.getParameter('customer');
			var transactionNumber = request.getParameter('transactionNumber');
			var updateType = request.getParameter('updateType');
			var numLines = request.getParameter('numLines');
			
			var form = nlapiCreateForm('Assign Reservations');
			form.setScript('customscript87');
			var customerf = form.addField('custpage_field_customer', 'select', 'Customer','Customer');
			customerf.setDefaultValue(customer);
			customerf.setDisplayType('inline');
			
			var TransactionNumberf = form.addField('custpage_field_transaction', 'select', 'Transaction', 'transaction');
			TransactionNumberf.setDefaultValue(transactionNumber);
			TransactionNumberf.setDisplayType('inline');
			
			var updateTypef = form.addField('custpage_field_updatetype', 'integer', 'Update Type');
			updateTypef.setDefaultValue(updateType);
			updateTypef.setDisplayType('hidden');

			
			var transactionLineItems	 = form.addTab('custpage_purchase_tab', 'Wine Ordered');
			var sublist = form.addSubList('custpage_transactionlines','list','Units For Reservation Process', 'custpage_purchase_tab');
			
			var selected = sublist.addField('custpage_selected','checkbox', 'Process Reservation');	
			var item = sublist.addField('item','select', 'item', 'item');
			item.setDisplayType('inline');
			var quantityordlf= sublist.addField('quantity', 'integer', 'Total Base Units Ordered Ordered');
			var uomf = sublist.addField('custcol_fhl_uom', 'select', 'Units Of Measure', 'unitstype');
			uomf.setDisplayType('inline');
			var rate = sublist.addField('rate', 'currency', 'Rate');
			var Amount = sublist.addField('amount', 'currency', 'Amount');
			var unitconversionratef= sublist.addField('custcol_unitconversionrate', 'integer', 'Units Conversion Rate');
			unitconversionratef.setDisplayType('inline');
			var rotationf = sublist.addField('custcol_tran_rotation', 'select', 'Rotation', 'customrecord_rotation');
			rotationf.setDisplayType('inline');
			var reservationf = sublist.addField('custcol_lotreservcation', 'select', 'Reservation', 'customrecord_lot_reservation');
			
			var linef = sublist.addField('custcol_line_ref', 'integer', 'line');
			linef.setDisplayType('hidden');
			
			var columns = new Array();
			columns[columns.length] = new nlobjSearchColumn('item',null,null);
			columns[columns.length] = new nlobjSearchColumn('duedate',null,null);
			columns[columns.length] = new nlobjSearchColumn('rate',null,null);
			columns[columns.length] = new nlobjSearchColumn('amount',null,null);
			columns[columns.length] = new nlobjSearchColumn('quantity',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_line_ref',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_lotreservcation',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_tran_rotation',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_fhl_uom',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_unitconversionrate',null,null);
			
		
			var filters = new Array();
			filters[filters.length] = new nlobjSearchFilter('internalid',null,'anyof', transactionNumber);
			filters[filters.length] = new nlobjSearchFilter('item',null,'noneof', 4721);
			filters[filters.length] = new nlobjSearchFilter('custcol_line_ref',null,'greaterthan', 0);
			
		var searchresults = nlapiSearchRecord('salesorder', null, filters, columns);
		if ( searchresults != null )
			{
			for (var i=0;i<searchresults.length;i++)
				{
					sublist.setLineItemValues(searchresults);
				}
			}
				
			
		response.writePage( form );
		
		
	}
}




//Library Functions	
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}
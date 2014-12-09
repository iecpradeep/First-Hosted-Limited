
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
			var trnColRotation = request.getParameter('trnColRotation');
			var trnColReservation = request.getParameter('trnColReservation');
			var updateType = request.getParameter('updateType');
			var quantity = request.getParameter('quantity');
			var rate = request.getParameter('rate');
			var lineNum = request.getParameter('lineNum');
			var uom = request.getParameter('uom');
			var units = request.getParameter('units');

			
			var form = nlapiCreateForm('Stock Reservations Processing');
			form.setScript('customscript_fhl_reservation_update');
			var customerf = form.addField('custpage_field_customer', 'select', 'Customer','Customer');
			customerf.setDefaultValue(customer);
			customerf.setDisplayType('inline');
			
			var TransactionNumberf = form.addField('custpage_field_transaction', 'select', 'Transaction', 'transaction');
			TransactionNumberf.setDefaultValue(transactionNumber);
			TransactionNumberf.setDisplayType('inline');
			
			var bottlesOrderedf = form.addField('custpage_field_bottlesorderedf', 'integer', 'Quantity Ordered');
			bottlesOrderedf.setDefaultValue(quantity);
			bottlesOrderedf.setDisplayType('inline');
			
			var orderedUnitf = form.addField('custpage_field_orderedunitf', 'integer', 'Qnty Per Ordered Unit');
			orderedUnitf.setDefaultValue(units);
			orderedUnitf.setDisplayType('inline');
			
			var uomf = form.addField('custpage_field_uomf', 'select', 'Units Of Measure', 'unitstype');
			uomf.setDefaultValue(uom);
			uomf.setDisplayType('inline');
			
			var salePricef = form.addField('custpage_field_rate', 'currency', 'Sale Price');
			salePricef.setDefaultValue(rate);
			salePricef .setDisplayType('inline');	
			
			var trnLineNumberf = form.addField('custpage_field_linenum', 'integer', 'Transaction Line No.');
			trnLineNumberf.setDefaultValue(lineNum);
			trnLineNumberf.setDisplayType('hidden');
			
			var rotationNamef = form.addField('custpage_field_rotation', 'select', 'Rotation', 'customrecord_rotation');
			if (isNotBlank(trnColRotation)){rotationNamef.setDefaultValue(trnColRotation);}
			rotationNamef.setDisplayType('inline');
			
			var updateTypef = form.addField('custpage_field_updatetype', 'integer', 'Update Type');
			updateTypef.setDefaultValue(updateType);
			updateTypef.setDisplayType('hidden');

			var rotationDescriptionf = form.addField('custpage_field_description', 'text', 'Description');
	
			var reservationf = form.addField('custpage_field_reservation', 'select', 'Lot Reservation', 'customrecord_lot_reservation');
			reservationf.setDefaultValue(trnColReservation);
	
			
			var ExpensesTab = form.addTab('custpage_purchase_tab', 'Available Purchase Orders');
			var sublist = form.addSubList('custpage_purchases_available','list','Purchases Available', 'custpage_purchase_tab');
			
			var selected = sublist.addField('custpage_selected','checkbox', 'Select');
			var poidfield = sublist.addField('internalid', 'integer', 'ID');
			//poidfield.setDisplayType('hidden');
			var duedatelf = sublist.addField('duedate', 'date', 'Expected Delivery Date');
			var ratelf= sublist.addField('rate', 'currency', 'Purchase Rate');
			var gp = sublist.addField('gp', 'currency', 'Gross Profit');
			gp.setDisplayType('entry');
			var quantityordlf= sublist.addField('quantity', 'currency', 'Total Ordered');			
			var quantitylf= sublist.addField('custcol_fhl_amountreserved', 'integer', 'Previously Reserved');
			quantitylf.setDisplayType('entry');
			var toBeReservedlf= sublist.addField('custcol_fhl_amounttobereserved', 'integer', 'This Reservation');
			toBeReservedlf.setDisplayType('entry');			
			var linef = sublist.addField('custcol_line_ref', 'integer', 'line');
			//linef.setDisplayType('hidden');
			
		
			if (isBlank(trnColRotation)){trnColRotation = nlapiGetFieldValue('custpage_field_rotation');}
			alert(trnColRotation);
			var columns = new Array();
			columns[columns.length] = new nlobjSearchColumn('internalid',null,null);
			columns[columns.length] = new nlobjSearchColumn('duedate',null,null);
			columns[columns.length] = new nlobjSearchColumn('rate',null,null);
			columns[columns.length] = new nlobjSearchColumn('quantity',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_fhl_amountreserved',null,null);
			columns[columns.length] = new nlobjSearchColumn('custcol_line_ref',null,null);
			
		
			var filters = new Array();
			filters[filters.length] = new nlobjSearchFilter('custcol_tran_rotation',null,'anyof', trnColRotation);
			

			
		var searchresults = nlapiSearchRecord('purchaseorder', null, filters, columns);
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

function createReservationList()
{
		var strSublist = 'custpage_purchases_available';
		var intSublistCount = Number(nlapiGetLineItemCount('custpage_purchases_available'));
		if(intSublistCount > 0)
		{	
				for (var i = 1; i <= intSublistCount; i++)
				{
					var selected = nlapiGetLineItemValue(strSublist, 'custpage_selected', i);
					if (selected == 'T') 
					{
					var custrecord_fhl_po_reservation_pono = nlapiGetLineItemValue(strSublist, 'internalid', i);
					
					var newReservationListRecord = nlapiCreateRecord('customrecord_fhl_po_reservation_list');

					newReservationListRecord.setFieldValue('custrecord_fhl_po_reservation_pono', custrecord_fhl_po_reservation_pono);
					
					try
						{
						var reservationListID = nlapiSubmitRecord(newReservationListRecord);
						}
						catch (reservationListLineError)
						{
						alert('Error in Creating Reservation List' + reservationListLineError);
						}
					}
				}
		}
return reservationListID;


}



function createReservationRecord()
{
		
		var strSublist = 'custpage_purchases_available';
		var intSublistCount = Number(nlapiGetLineItemCount('custpage_purchases_available'));
		if(intSublistCount > 0)
		{
				for (var i = 1; i <= intSublistCount; i++)
				{
					var selected = nlapiGetLineItemValue(strSublist, 'custpage_selected', i);
					if (selected == 'T') 
					{
					var custrecord_lotres_lot = nlapiGetFieldValue('custpage_field_rotation');
					var custrecord_lotres_saleid = nlapiGetFieldValue('custpage_field_transaction');
					var custrecord_lotres_salelineid = nlapiGetFieldValue('custpage_field_linenum');
					var custrecord_lotres_salelinerate = nlapiGetFieldValue('custpage_field_rate');
					var custrecord_lotres_salelineqty = nlapiGetFieldValue('custpage_field_bottlesorderedf');
					var custrecord_lotres_purchid = nlapiGetLineItemValue(strSublist, 'internalid', i);
					var custrecord_lotres_purchlineid = nlapiGetLineItemValue(strSublist, 'custcol_line_ref', i);
					var custrecord_lotres_purchlinerate = (nlapiGetLineItemValue(strSublist, 'rate', i) * nlapiGetFieldValue('custpage_field_orderedunitf'));
					var custrecord_lotres_purchqty = nlapiGetLineItemValue(strSublist, 'quantity', i);
					
					
					
					var newReservationRecord = nlapiCreateRecord('customrecord_lot_reservation');

					newReservationRecord.setFieldValue('custrecord_lotres_lot', custrecord_lotres_lot);
					newReservationRecord.setFieldValue('custrecord_lotres_saleid', custrecord_lotres_saleid);
					newReservationRecord.setFieldValue('custrecord_lotres_salelineid', custrecord_lotres_salelineid);
					newReservationRecord.setFieldValue('custrecord_lotres_salelinerate', custrecord_lotres_salelinerate);
					newReservationRecord.setFieldValue('custrecord_lotres_salelineqty', custrecord_lotres_salelineqty);
					newReservationRecord.setFieldValue('custrecord_lotres_purchid', custrecord_lotres_purchid);
					newReservationRecord.setFieldValue('custrecord_lotres_purchlineid', custrecord_lotres_purchlineid);
					newReservationRecord.setFieldValue('custrecord_lotres_purchlinerate', custrecord_lotres_purchlinerate);
					newReservationRecord.setFieldValue('custrecord_lotres_purchqty', custrecord_lotres_purchqty);
					
					try
						{
						var reservationID = nlapiSubmitRecord(newReservationRecord);
						}
						catch (reservationLineError)
						{
						nlapiLogExecution('ERROR','Error in Submission', reservationLineError);
						}
					}
				}
		}
return reservationID;

}

function updateReservation(reservationID)
{
			var amountRequired = nlapiGetFieldValue('quantity');
			var strSublist = 'custpage_purchases_available';
			var intSublistCount = Number(nlapiGetLineItemCount(strSublist));
			
			
			var arr = [];
			
			//cache to output array
			if(intSublistCount>0)
			{
				for (var j=1; j<=intSublistCount;j++)
				{
					
					var selected = nlapiGetLineItemValue(strSublist, 'custpage_selected', j);
					var poidfield = nlapiGetLineItemValue(strSublist, 'internalid', j);
					var line = nlapiGetLineItemValue(strSublist, 'custcol_line_ref', j);
					var duedate = nlapiGetLineItemValue(strSublist, 'duedate', j);
					var amountRequired = nlapiGetLineItemValue(strSublist, 'custcol_fhl_amounttobereserved', j);						
					var rotation = nlapiGetFieldValue('custpage_field_rotation');
					
					if(isBlank(rotation))
					{
					alert('There is no Rotation selected on the line item.  Please close the reservation screen and update the rotation on the line.');
					return false;
					}

					
					arr.push
					(
						{
							'selected':selected,
							'poidfield':poidfield,
							'line':line,
							'duedate':duedate,
							'amountRequired':amountRequired,
							'rotation':rotation
						}
					);
					
				}
			}
		var returncode = updateReservationRecords(arr, reservationID);
		if (returncode ==0)
		{
		alert('Reservation Records Created Successfully, Updating Purchase Order');
		 //var suiteletURL = nlapiResolveURL('SUITELET','customscript_probe_expense_validation','customdeploy_expense_validation');
		//window.location = suiteletURL;
		}
		else
		{
				if (returncode ==1)
				{
				alert('Reservation Records Updated Successfully, Updating Purchase Order');
				 //var suiteletURL = nlapiResolveURL('SUITELET','customscript_probe_expense_validation','customdeploy_expense_validation');
				//window.location = suiteletURL;
				}
		}
}

function updateReservationRecords(arr, reservationID)
{
	if (arr.length > 0)
	{
		var returncode = 1;
		var error = 0;
		
		for (var i=0;i<arr.length;i++)
		{
			var reservationItem = arr[i];

			var selected = reservationItem.selected;
			if (selected == 'T') 
			{
			
			var poidfield = reservationItem.poidfield;
			var line = reservationItem.line;
			var duedate = reservationItem.duedate;
			var amountRequired = reservationItem.amountRequired;	
			var rotation = reservationItem.rotation;
			
								var record = nlapiLoadRecord('purchaseorder', poidfield);	
									record.selectLineItem('item', line); 
								var currentReserved = parseFloat(record.getCurrentLineItemValue('item','custcol_fhl_amountreserved'));

								var reservationListID = record.getCurrentLineItemValue('item','custcol_fhl_po_reservationlist');
								if((isNaN(reservationListID))||(reservationListID == null))
									{
									var reservationListID = createReservationList();
									record.setCurrentLineItemValue('item', 'custcol_fhl_po_reservationlist', reservationListID);
									}
								
									var updatefield = nlapiSubmitField('customrecord_lot_reservation', reservationID, 'custrecord_fhl_rl_reservation_list', reservationListID);
								
								if (isNaN(currentReserved)){currentReserved = 0;}
								currentReserved += parseFloat(amountRequired);
								record.setCurrentLineItemValue('item', 'custcol_fhl_amountreserved', currentReserved);
								record.commitLineItem('item');   
								try
								{
								var newId = nlapiSubmitRecord(record, false);		
								}
								catch(error)
								{}

						var rotationrecord = nlapiLoadRecord('customrecord_rotation', rotation);	
						var currentAllocated = rotationrecord.getFieldValue('custrecord_loycurrentavailable');
						var currentSold = rotationrecord.getFieldValue('custrecord_lotqtysold');
						if(isBlank(currentSold))
						{
						currentSold = parseFloat(amountRequired);
						}
						else
						{
						currentSold += parseFloat(amountRequired);
						}
						
						var newRemaining = (currentAllocated - parseFloat(amountRequired));
						rotationrecord.setFieldValue('custrecord_loycurrentavailable', newRemaining);
						rotationrecord.setFieldValue('custrecord_lotqtysold', currentSold);
						
					try
					{
						var newRotationId = nlapiSubmitRecord(rotationrecord, true);		
					}
					catch (e)
					{
					error = 1;
					alert('Failed!! ' + e);
					}
				
			}
				
			
			
		}	
	}
	
	if (error == 1){returncode = 2;}
return returncode;
}	

function updateReservedAmount()
{
		var strSublist = 'custpage_purchases_available';
		var intSublistCount = Number(nlapiGetLineItemCount('custpage_purchases_available'));
		if(intSublistCount > 0)
		{
				var salePrice = parseFloat(nlapiGetFieldValue('custpage_field_rate'));
				var saleQuantity = parseFloat(nlapiGetFieldValue('custpage_field_orderedunitf'));
				
				for (var i = 1; i <= intSublistCount; i++)
				{
					
					var selected = nlapiGetLineItemValue(strSublist, 'custpage_selected', i);
					if (selected == 'T') 
					{
					var quantity = (nlapiGetFieldValue('custpage_field_bottlesorderedf')* saleQuantity);
					var purchasePrice =  parseFloat(nlapiGetLineItemValue(strSublist, 'rate', i));
					var margin = parseFloat(salePrice - (purchasePrice * saleQuantity));
					margin = round(margin);
					nlapiSetLineItemValue('custpage_purchases_available', 'gp', i, parseFloat(margin));
					nlapiSetLineItemValue('custpage_purchases_available', 'custcol_fhl_amounttobereserved', i, quantity);
					}
				}
		}
	
return true;
}

function processReservation()
{

var updateType = nlapiGetFieldValue('custpage_field_updatetype');
var reservationID = 0;
if (updateType == 2)
	{
	reservationID = createReservationRecord();
	nlapiSetFieldValue('custpage_field_reservation', reservationID, true, true);
	var updated = updateReservation(reservationID)
	}
	else if (updateType == 1)
	{
	var reservationID = nlapiGetFieldValue('custpage_field_reservation');
		if (reservationID > 0)
		{
			updateReservation(reservationID)
		}
	}
	
	window.close()


return true;
}


//Library Functions	
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}
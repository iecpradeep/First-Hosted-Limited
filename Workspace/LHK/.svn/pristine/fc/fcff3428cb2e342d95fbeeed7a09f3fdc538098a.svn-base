function populateUnitsForSuitelet()
{
//This Script is called on line validate of the sales order to populate a hidden custom column on the sales order transaction.
//The column is required because the unitconversionrate variable is only visible to clint script and is required to be populated through to the 
//suitelet.
var units = nlapiGetCurrentLineItemValue('item','unitconversionrate');
nlapiSetCurrentLineItemValue('item', 'custcol_unitconversionrate', units);
return true;
}

function queueReservationUpdate(type, name)
{
if ((name == 'custcol_tran_rotation') || (name == 'quantity'))
	{
	nlapiSetFieldValue('custbody_fhlreservationstatus', 2);
	}
return true;
}

function triggerReservationSuitelet(type, name)
{
		
		if (name =='custpage_selected')
		{
			var strSublist = 'custpage_transactionlines';
			var intSublistCount = Number(nlapiGetLineItemCount('custpage_transactionlines'));
			if(intSublistCount > 0)
			{
					for (var i = 1; i <= intSublistCount; i++)
					{
						var runSuitelet = nlapiGetLineItemValue(strSublist, 'custpage_selected', i);
						if (runSuitelet == 'T') 
						{
							var customer = 	nlapiGetFieldValue('custpage_field_customer');
							var transactionNumber = nlapiGetFieldValue('custpage_field_transaction');
							
							
							
							var trnColReservation = nlapiGetLineItemValue(strSublist, 'custcol_lotreservcation', i);
							var trnColRotation = nlapiGetLineItemValue(strSublist, 'custcol_tran_rotation', i);
							var quantity = nlapiGetLineItemValue(strSublist, 'quantity', i);
							var rate = nlapiGetLineItemValue(strSublist, 'rate', i);
							var uom = nlapiGetLineItemValue(strSublist, 'custcol_fhl_uom', i);
							var units = nlapiGetLineItemValue(strSublist,'custcol_unitconversionrate', i);
							var item = nlapiGetLineItemValue(strSublist,'item', i);
							
							var lineNum = i;
							
							var reservationID = createNewReservation(trnColReservation, trnColRotation, transactionNumber, customer, trnColRotation, quantity, rate, lineNum, uom, units);
							nlapiSetLineItemValue(strSublist, 'custpage_selected', i, 'F');
							nlapiCommitLineItem(strSublist);
							
						}
					
					}
			}
		}
return true;
}
			
			
			
function createNewReservation(trnColReservation, trnColRotation, transactionNumber, customer, trnColRotation, quantity, rate, lineNum, uom, units)
{
		if(isBlank(trnColReservation))
			{
			var updateType = 2;
			}
			else
			{
			var updateType = 1;
			}
   		var suiteletURL = nlapiResolveURL('SUITELET','customscript_lhk_create_reservation','customdeploy_lhk_create_reservation');
	
		suiteletURL += '&customer='+customer;
		suiteletURL += '&transactionNumber='+transactionNumber;
		suiteletURL += '&trnColReservation='+trnColReservation;
		suiteletURL += '&trnColRotation='+trnColRotation;
		suiteletURL += '&updateType='+updateType;
		suiteletURL += '&quantity='+quantity;
		suiteletURL += '&rate='+rate;
		suiteletURL += '&lineNum='+lineNum;
		suiteletURL += '&uom='+uom;
		suiteletURL += '&units='+units;
		
		winName = 'Reservation System';
		winAttr = 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=700,height=600'

		popupWin = window.open(suiteletURL,winName,winAttr);
return true;
}


function updateSalesOrder()
{
var transactionNumber = nlapiGetFieldValue('custpage_field_transaction');
var Record = nlapiLoadRecord('salesorder', transactionNumber);
var numLines = Record.getLineItemCount('item');

for (var i=1; i <= numLines; i++)
	{
		var reservationID = null;
		
		var filters = new Array();
		filters[0] = new nlobjSearchFilter( 'custrecord_lotres_saleid', null, 'anyof', transactionNumber );
		filters[1] = new nlobjSearchFilter( 'custrecord_lotres_salelineid', null, 'equalto', i );

		var searchresults = nlapiSearchRecord( 'customrecord_lot_reservation', null, filters, null);
		for ( var q = 0; searchresults != null && q < searchresults.length; q++ )
			{
				var searchresult = searchresults[ q ];
				var reservationID = searchresult.getId( );

			}
		if(isNotBlank(reservationID))
		{
		Record.selectLineItem('item', i); 
		Record.setCurrentLineItemValue('item', 'custcol_lotreservcation', reservationID, true, true);
		Record.commitLineItem('item'); 
		}
		else
		{
		Record.selectLineItem('item', i); 
		Record.setCurrentLineItemValue('item', 'custcol_lotreservcation', null, true, true);
		Record.commitLineItem('item'); 
		}
	}
nlapiSetFieldValue('custbody_fhlreservationstatus', 1);
var id = nlapiSubmitRecord(Record, true);
var soURL = nlapiResolveURL('RECORD', 'salesorder', transactionNumber); 
alert('Processed Records - Redirecting to Sales Order.');
window.ischanged = false;
window.location = soURL;
}

//Library Functions	
function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}

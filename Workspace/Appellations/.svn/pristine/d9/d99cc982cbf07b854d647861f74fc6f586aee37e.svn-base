function reservationSave(type)
{
	if (type = 'create')
	{
		nlapiSetFieldValue('custbody_fhlreservationstatus',2);
	}

	return true;
}

function validateLine(type)
{
	if (type = 'edit')
	{
		var reservationStatus = nlapiGetFieldValue('custbody_fhlreservationstatus');
		if(reservationStatus == 2)
		{
			var transactionNumber = nlapiGetRecordId();
			var numLines = nlapiGetLineItemCount('item');
			var lineNum = nlapiGetCurrentLineItemIndex('item');
			var customer = 	nlapiGetFieldValue('entity');

			var trnColReservation = nlapiGetCurrentLineItemValue('item', 'custcol_lotreservcation');
			var trnColRotation = nlapiGetCurrentLineItemValue('item', 'custcol_tran_rotation');
			var quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
			var rate = nlapiGetCurrentLineItemValue('item', 'rate');
			var uom = nlapiGetCurrentLineItemValue('item', 'custcol_fhl_uom');
			var units = nlapiGetCurrentLineItemValue('item','unitconversionrate');
			var item = nlapiGetCurrentLineItemValue('item','item');

			var dutyItemId = 2822;

			if (item != dutyItemId)
			{
				if (isNotBlank(trnColReservation)) 
				{
					updateExistingReservation(trnColReservation, customer, transactionNumber, trnColRotation, quantity, rate, lineNum, uom, units);
				}
				else  
				{
					createNewReservation(trnColReservation, trnColRotation, transactionNumber, customer, trnColRotation, quantity, rate, lineNum, uom, units);
				}
			}

		}
	}	
	return true;
}

function updateExistingReservation(trnColReservation, customer, transactionNumber, trnColRotation, quantity, rate, lineNum, uom, units)
{

	//alert('Updating Existing Reservation');
	var updateType = 1;

	var suiteletURL = nlapiResolveURL('SUITELET','customscript_fhl_reservation_suitelet','customdeploy_fhl_reservation_suitelet');

	suiteletURL += '&customer='+customer;
	suiteletURL += '&transactionNumber='+transactionNumber;
	suiteletURL += '&trnColRotation='+trnColRotation;
	suiteletURL += '&trnColReservation='+trnColReservation;
	suiteletURL += '&updateType='+updateType;
	suiteletURL += '&quantity='+quantity;
	suiteletURL += '&rate='+rate;
	suiteletURL += '&lineNum='+lineNum;
	suiteletURL += '&uom='+uom;
	suiteletURL += '&units='+units;

	winName = 'Reservation System';
	winAttr = 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=700,height=600';

	popupWin = window.open(suiteletURL,winName,winAttr);

	return true;
}

function createNewReservation(trnColReservation, trnColRotation, transactionNumber, customer, trnColRotation, quantity, rate, lineNum, uom, units)
{
	//alert('lineNum'+lineNum);
	var updateType = 2;
	var suiteletURL = nlapiResolveURL('SUITELET','customscript_fhl_reservation_suitelet','customdeploy_fhl_reservation_suitelet');

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
	winAttr = 'toolbar=no,location=no,directories=no,status=yes,menubar=no,scrollbars=yes,resizable=yes,copyhistory=no,width=700,height=600';

	popupWin = window.open(suiteletURL,winName,winAttr);
	return true;
}


function isBlank(fld) 
{
	return (fld==null||fld=='');
}
function isNotBlank(fld) 
{
	return (fld!=null&&fld!='');
}
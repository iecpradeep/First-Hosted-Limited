/**
* @fileOverview
* @name Innov.UE.LHK.SO.Rotation.js
* @author Innov - Eli Beltran
* 07-13-2012
* @version 1.0
* Deployed as User-Event Script on Sales Order Record
* @description: When Sales Order is deleted, get all the Rotation Record on item lines
* - Inactivate the (custom record) Lot Numbered, Set the Status to SO-Closed
* - Disassociate the Rotation Record to the Lot Numbered
* - Disassociate the Rotation Record to the Sales Order Record
*/

var reservationSuiteletInternalID = 52;
var log = new Log('DEBUG');




var beforeSubmit = function(type){

	numberLinesInOrder();

	log.write('Type: ' + type);

	if(type == 'delete')
	{
		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);
		var obj = nlapiLoadRecord(recordType, recordId);

		var itemCount = obj.getLineItemCount('item');
		log.write('Item Count: ' + itemCount);

		if(itemCount > 0)
		{
			for(var i = 1; i <= itemCount; i++)
			{
				var rotationRecordId = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
				var deductQuantity = obj.getLineItemValue('item', 'quantity', i); //quantity
				var unitconversionrate = obj.getLineItemValue('item', 'unitconversionrate', i); //units

				//Delete Rotation Record set to inactive
				if(!isBlank(rotationRecordId))
				{
					processDelRotationEvent(rotationRecordId, deductQuantity, unitconversionrate);
				}
			}
		}
	}
}



var processDelRotationEvent = function(rotationRecordId, quantity, unitconversionrate){

	log.write('Delete Sales Order Event');

	var obj = nlapiLoadRecord('customrecord_rotation', rotationRecordId);

	//Deduct Quantity Sold in Rotation Record
	var sold1 = obj.getFieldValue('custrecord_rotation_item_units_sold'); //6
	var sold2 = obj.getFieldValue('custrecord_lotqtysold'); //1

	var quantity2 = parseInt(unitconversionrate) * parseInt(quantity); //6 * 1

	var newSoldQty = parseInt(sold1) - parseInt(quantity); //0
	var newSoldQty2 = parseInt(sold2) - parseInt(quantity2); //6 - 6 = 0

	obj.setFieldValue('custrecord_rotation_item_units_sold', newSoldQty); //Case(s)/Bottle(s) Sold
	obj.setFieldValue('custrecord_lotqtysold', newSoldQty2); //Base Units Sold

	log.write('Old Case(s)/Bottle(s) Sold Qty: ' + sold1 + ' | New Case(s)/Bottle(s) Sold Qty: ' + newSoldQty);
	log.write('Old Base Units Sold Qty: ' + sold2 + ' | New Base Units Sold Qty: ' + newSoldQty2);

	//Add Quantity available in Rotation Record
	var available1 = obj.getFieldValue('custrecord_rotation_item_units_available'); //Case(s)/Bottle(s) Available
	var available2 = obj.getFieldValue('custrecord_loycurrentavailable'); //Base Units Available

	var newAvailableQty = parseInt(available1) + parseInt(quantity);
	var newAvailableQty2 = parseInt(available2) + parseInt(quantity2);

	obj.setFieldValue('custrecord_rotation_item_units_available', newAvailableQty);	 //Case(s)/Bottle(s) Available
	obj.setFieldValue('custrecord_loycurrentavailable', newAvailableQty2);	 //Base Units Available

	log.write('Old Case(s)/Bottle(s) Available Qty: ' + available1 + ' | New Case(s)/Bottle(s) Available : ' + newAvailableQty);
	log.write('Old Base Units Available Qty: ' + available2 + ' | New Base Units Available Qty: ' + newAvailableQty2);

	try
	{
		nlapiSubmitRecord(obj, true);
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var afterSubmit = function(type){

	log.write('---- After Submit start ----');
	log.write('Type: ' + type);

	if(type == 'create')
	{
		var triggerReservationSuitelet = 0;

		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();
		var obj = nlapiLoadRecord(recordType, recordId);

		if(!isBlank(obj))
		{
			var itemCount = obj.getLineItemCount('item');
			log.write('Item Count: ' + itemCount);
			if(itemCount > 0)
			{
				for(var i = 1; i <= itemCount; i++)
				{
					//Get Line Item Values
					var item = obj.getLineItemValue('item', 'item', i); //Item
					var rate = obj.getLineItemValue('item', 'rate', i); //Rate
					var quantity = obj.getLineItemValue('item', 'quantity', i); //Quantity
					var unitconversionrate = obj.getLineItemValue('item', 'unitconversionrate', i); //units
					var quantityRotation = obj.getLineItemValue('item', 'custcol_rotationqty', i); //Rotation Quantity Available
					var rotationId = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //Rotation
					var reservation = obj.getLineItemValue('item', 'custcol_lotreservcation', i); //Reservation
					var itemtype = obj.getLineItemValue('item', 'itemtype', i); //InvtPart
					//Create Reservation if condition was met

					//Applicable only to Inventory items
					if(itemtype == 'InvtPart')
					{
						if(parseInt(quantityRotation) >= parseInt(quantity))
						{
							//Create Reservation Record
							var poID = nlapiLookupField('customrecord_rotation', rotationId, 'custrecord_lhk_po_link');

							log.write(poID);

							if(!isBlank(poID))
							{
								var reservationId = createReservationList(poID);
								if(!isBlank(reservationId))
								{
									var reservationID = createReservationRecord(rotationId, recordId, rate, quantity, poID, reservationId, i);
									log.write('Reservation record: ' + reservationID);
								}
							}
						}
						else
						{
							triggerReservationSuitelet++;
						}
					}
					
					if(!isBlank(rotationId))
					{
						updateRotationRecord(rotationId);
					}
				}
			}
		}

		log.write('Trigger Suitelet: ' + triggerReservationSuitelet);

		if(triggerReservationSuitelet > 0)
		{
			var salesOrderNumber = nlapiGetRecordId();
			var customer = 	nlapiGetFieldValue('entity');
			var numLines = nlapiGetLineItemCount('item');

			createNewReservation(salesOrderNumber, customer, numLines);
		}
	}

	if(type == 'edit')
	{
		var triggerReservationSuitelet = 0;

		var recordType = nlapiGetRecordType();
		var recordId = nlapiGetRecordId();
		var obj = nlapiLoadRecord(recordType, recordId);

		if(!isBlank(obj))
		{
			var itemCount = obj.getLineItemCount('item');
			log.write('Item Count: ' + itemCount);
			if(itemCount > 0)
			{
				for(var i = 1; i <= itemCount; i++)
				{
					//Get Line Item Values
					var item = obj.getLineItemValue('item', 'item', i); //Item
					var rate = obj.getLineItemValue('item', 'rate', i); //Rate
					var quantity = obj.getLineItemValue('item', 'quantity', i); //Quantity
					var quantityRotation = obj.getLineItemValue('item', 'custcol_rotationqty', i); //Rotation Quantity Available
					var rotationId = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //Rotation
					var reservation = obj.getLineItemValue('item', 'custcol_lotreservcation', i); //Reservation
					var unitconversionrate = obj.getLineItemValue('item', 'unitconversionrate', i); //units
					var itemtype = obj.getLineItemValue('item', 'itemtype', i); //InvtPart

					if(!isBlank(rotationId)) //Rotation ID Exist
					{
						//Applicable only to Inventory items
						if(itemtype == 'InvtPart')
						{
							if(parseInt(quantityRotation) >= parseInt(quantity)) //There are enough rotation record for this item line
							{
								//Create Reservation Record
								var poID = nlapiLookupField('customrecord_rotation', rotationId, 'custrecord_lhk_po_link');

								//Check if Reservation record exists...
								var objReservation = searchReservationRecord(rotationId, recordId); //Search for the Reservation Record

								if(!isBlank(poID) && !isBlank(objReservation)) //Reservation already exist...Modify
								{
									log.write('Reservation Modification for this item line');

									//Modify Reservation record
									var reservationQty = objReservation.getFieldValue('custrecord_lotres_salelineqty');
									var reservationId = objReservation.getFieldValue('id');

									objReservation.setFieldValue('custrecord_lotres_salelineid', i);
									objReservation.setFieldValue('custrecord_lotres_salelinerate', rate);
									objReservation.setFieldValue('custrecord_lotres_salelineqty', quantity);
									//Modify Rotation Record

									nlapiSubmitRecord(objReservation, true); //Save Reservation record
								}
								else
								{

									//Create Reservation record...
									var poID = nlapiLookupField('customrecord_rotation', rotationId, 'custrecord_lhk_po_link');

									log.write('Creating Reservation Record');

									if(!isBlank(poID))
									{
										var reservationId = createReservationList(poID);
										if(!isBlank(reservationId))
										{
											var reservationID = createReservationRecord(rotationId, recordId, rate, quantity, poID, reservationId, i);
											log.write('Reservation record: ' + reservationID);
										}
									}
								}
							}
							else
							{
								triggerReservationSuitelet++;
							}
						}
					}

					if(!isBlank(rotationId))
					{
						updateRotationRecord(rotationId);
					}

				}
			}
		}

		log.write('Trigger Suitelet: ' + triggerReservationSuitelet);

		if(triggerReservationSuitelet > 0)
		{
			var salesOrderNumber = nlapiGetRecordId();
			var customer = 	nlapiGetFieldValue('entity');
			var numLines = nlapiGetLineItemCount('item');

			createNewReservation(salesOrderNumber, customer, numLines);
		}

	}

	log.write('---- After Submit end ----');
}


var searchLotNumber = function(rotationRecordId, salesOrderId){
	var result = [];

	var filters =
	[
		new nlobjSearchFilter('custrecord_lotres_lot', null, 'is', rotationRecordId, null),
		new nlobjSearchFilter('custrecord_lotres_saleid', null, 'is', salesOrderId, null)
	];

	var s = nlapiSearchRecord('customrecord_lot_reservation',null, filters, null);
	return s;
}

var processLotNumber = function(lotId){
	var SO_CLOSED = '2';
	var obj = nlapiLoadRecord('customrecord_lot_reservation', lotId);
	obj.setFieldValue('custrecord_lot_numbered_status', SO_CLOSED);
	obj.setFieldValue('isinactive', 'T');
	obj.setFieldValue('custrecord_lotres_saleid', ''); //Remove Relation to SO
	obj.setFieldValue('custrecord_lotres_lot', ''); //Remove Relation to Rotation Record
	try
	{
		var id = nlapiSubmitRecord(obj, true);
		log.write('Processed Lot Numbered: ' + id);
	}
	catch(ex)
	{
		log.error(ex);
	}
}

var createReservationRecord = function(rotationId, recordId, rate, quantity, poID, reservationId, i){

	var createReservation = nlapiCreateRecord('customrecord_lot_reservation');
	createReservation.setFieldValue('custrecord_lotres_lot', rotationId); //Rotation Record
	createReservation.setFieldValue('custrecord_lotres_saleid', recordId);  //Sales Order Id
	createReservation.setFieldValue('custrecord_lotres_salelineid', i);
	createReservation.setFieldValue('custrecord_lotres_salelinerate', rate);
	createReservation.setFieldValue('custrecord_lotres_salelineqty', quantity);
	createReservation.setFieldValue('custrecord_lotres_purchid', poID);
	createReservation.setFieldValue('custrecord_fhl_rl_reservation_list', reservationId);

	try
	{
		var poRate = nlapiLookupField('customrecord_rotation', rotationId, 'custrecord_rotation_gbp_unitcost');
		var poQty = nlapiLookupField('customrecord_rotation', rotationId, 'custrecord_rotation_item_units_purchased');

		createReservation.setFieldValue('custrecord_lotres_purchlineid', i); //PO Line ID
		createReservation.setFieldValue('custrecord_lotres_purchlinerate', poRate); //GBP Unit Cost
		createReservation.setFieldValue('custrecord_lotres_purchqty', poQty); //Base Unit Purchased
		var reservationId = nlapiSubmitRecord(createReservation, true);
	}
	catch(ex)
	{
		log.error(ex);
	}

	return reservationId;

}

var createReservationList = function(poID)
{
	var createReservationListRecord = nlapiCreateRecord('customrecord_fhl_po_reservation_list');
	createReservationListRecord.setFieldValue('custrecord_fhl_po_reservation_pono', poID);

	var reservationListID = 0;

	try
	{
		reservationListID = nlapiSubmitRecord(createReservationListRecord, true);
	}
	catch(ex)
	{
		log.error(ex);
	}
	return reservationListID;
}


//Before Submit
function numberLinesInOrder()
{
	var numLines = nlapiGetLineItemCount('item');
	for (var c=1; c <= numLines; c++)
	{
		var line = nlapiSelectLineItem('item', c);
		nlapiSetCurrentLineItemValue('item','custcol_line_ref', c);
		nlapiCommitLineItem('item');
	}
	return true;
}

//Tobys

function reservationSetup(type)
{

	var salesOrderNumber = nlapiGetRecordId();
	var customer = 	nlapiGetFieldValue('entity');
	var numLines = nlapiGetLineItemCount('item');
	var updateReservations = nlapiGetFieldValue('custbody_fhlreservationstatus');
	var triggerReservationSuitelet = 'F';

	var numLines = nlapiGetLineItemCount('item');
	for(var c=1; c <= numLines; c++)
	{
		var line = nlapiSelectLineItem('item', c);
		var custcol_lotreservcation = nlapiGetCurrentLineItemValue('item','custcol_lotreservcation');
		if((isBlank(custcol_lotreservcation)) || (updateReservations == 2))
		{
			var triggerReservationSuitelet = 'T';
		}
	}

	if (triggerReservationSuitelet ==  'T')
	{
		createNewReservation(salesOrderNumber, customer, numLines)
	}

	return true;

}

function createNewReservation(salesOrderNumber, customer, numLines)
{
		var updateType = 2;
		var params = new Array();

   		params['customer'] = customer;
		params['transactionNumber'] = salesOrderNumber;
		params['updateType'] = updateType;
		params['numLines'] = numLines;


		var url_servlet = nlapiSetRedirectURL('SUITELET',reservationSuiteletInternalID, 1, null, params);
		return true;
}

var searchReservationRecord = function(rotationId, soId){
	var result = [];

	var filters =
	[
		new nlobjSearchFilter('custrecord_lotres_lot', null, 'is', rotationId, null),
		new nlobjSearchFilter('custrecord_lotres_saleid', null, 'is', soId, null)
	];

	var s = nlapiSearchRecord('customrecord_lot_reservation',null, filters, null);

	if(!isBlank(s))
	{
		var id = s[0].getId();
		var obj = nlapiLoadRecord('customrecord_lot_reservation', id);

		if(!isBlank(obj))
		{
			return obj;
		}
	}
}
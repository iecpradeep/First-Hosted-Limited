/**
* @fileOverview
* @name Innov.Innov.UE.LHK.ItemReceipt.SO.js
* @author Innov - Eli Beltran
* 07-18-2012
* @version 1.0
* Deployed as User-Event Script on Item Receipt
* @description: Update the Rotation Record
* - Quantity Received less the Base Units Sold
* - Quantity Received plus the Base Units Available
* Will only work on items Item Receipt = Return Auth type.
* - Remove Relation of Lot Reservation to Rotation Record once the sale line qty is zeroed
* 07-25-2012
* Added function: 'beforeLoad'
*	Set the Exchange Rate based on the stored value of Exchange Rate (static) (custom field on PO)
*/

var log = new Log('DEBUG');

var beforeLoad = function(type, form, request){
	if(type == 'create' || type == 'edit')
	{
		var purchaseOrderId = nlapiGetFieldValue('createdfrom');
		if(!isBlank(purchaseOrderId))
		{
			var exchangeRateFromPO = nlapiLookupField('purchaseorder', purchaseOrderId, 'custbody_exchange_rate_static');
			log.write('Exchange Rate from PO: ' + exchangeRateFromPO);
			nlapiSetFieldValue('exchangerate', exchangeRateFromPO);
		}
	}
};

var afterSubmit = function(type){

	log.write('Type: ' + type);

	if(type == 'create')
	{
		var recordType = nlapiGetRecordType(); //itemreceipt
		var recordId = nlapiGetRecordId();

		log.write('Record Type: ' + recordType + ' | Record Id: ' + recordId);

		var obj = nlapiLoadRecord(recordType, recordId);
		var orderType = obj.getFieldValue('ordertype');
		var createdfrom = obj.getFieldValue('createdfrom');

		log.write('Order Type: ' + orderType + ' | Created From: ' + createdfrom);

		var soNum = nlapiLookupField('returnauthorization', createdfrom, 'createdfrom');

		if(orderType == 'RtnAuth') //Will Only Work on Return Authorization
		{
			var itemCount = obj.getLineItemCount('item');
			log.write('Item Count: ' + itemCount);

			if(itemCount > 0)
			{
				for(var i = 1; i <= itemCount; i++)
				{
					var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', i); //rotation record
					var quantity = obj.getLineItemValue('item', 'quantity', i); //Amount Reserved (linked to SO)

					log.write('Rotation Record: ' + rotationRecord + ' | Quantity: ' + quantity);

					if(!isBlank(rotationRecord) && !isBlank(quantity))
					{
						try
						{
							updateRotationRecord(type, rotationRecord, quantity, recordId);
							//Remove Sales Order link to Lot Reservation
							if(!isBlank(soNum))
							{
								var s = searchLotNumber(rotationRecord, soNum);
								if(s != null)
								{
									for (var a = 0; a < s.length; a++)
									{
										var lotId = s[a].getId();
										if(!isBlank(lotId))
										{
											validateReservation(lotId, quantity);
										}

									}
								}
							}
						}
						catch(ex)
						{
							log.error(ex);
						}
					}
				}
			}
		}
	}
};

var updateRotationRecord = function(type, rotationRecord, quantity, recordId){

	var log = new Log('DEBUG');

	if(type == 'create')
	{
		//Load Rotation Record
		var obj = nlapiLoadRecord('customrecord_rotation', rotationRecord); // Shipping Status = 'With Supplier'

		if(!isBlank(obj))
		{
			var baseUnitSold = obj.getFieldValue('custrecord_lotqtysold');
			var baseUnitAvailable = obj.getFieldValue('custrecord_loycurrentavailable');

			//Deduct Returned to Base Units Sold
			var newBaseUnitSold = parseInt(baseUnitSold) - parseInt(quantity);

			//Returned Item put back to Base Units Available
			var newBaseUnitAvailable = parseInt(baseUnitAvailable) + parseInt(quantity);
			//Set new Received Value;

			try
			{
				obj.setFieldValue('custrecord_lotqtysold', newBaseUnitSold);
				obj.setFieldValue('custrecord_loycurrentavailable', newBaseUnitAvailable);
				var id = nlapiSubmitRecord(obj, true);
				log.write('Updated Rotation Record ID: ' + id);
			}
			catch(ex)
			{
				log.error(ex);
			}
		}
	}
};

var searchLotNumber = function(rotationRecordId, salesOrderId){
//	var result = [];

	var filters =
	[
		new nlobjSearchFilter('custrecord_lotres_lot', null, 'is', rotationRecordId, null),
		new nlobjSearchFilter('custrecord_lotres_saleid', null, 'is', salesOrderId, null)
	];

	var s = nlapiSearchRecord('customrecord_lot_reservation',null, filters, null);
	return s;
};

var validateReservation = function(lotId, quantity){
	var obj = nlapiLoadRecord('customrecord_lot_reservation', lotId);
	var reserveQty = obj.getFieldValue('custrecord_lotres_salelineqty');
	var newReserveQty = parseInt(reserveQty) - parseInt(quantity);
	if(newReserveQty == 0)
	{
		//All Reserve Qty is used up...
		obj.setFieldValue('isinactive', 'T');
		obj.setFieldValue('custrecord_lotres_saleid', ''); //Remove Relation to SO
		obj.setFieldValue('custrecord_lotres_lot', ''); //Remove Relation to Rotation Record
	}
	else
	{
		obj.setFieldValue('custrecord_lotres_salelineqty', newReserveQty);
	}

	try
	{
		var id = nlapiSubmitRecord(obj, true);
		log.write('Processed Lot Numbered: ' + id);
	}
	catch(ex)
	{
		log.error(ex);
	}

};
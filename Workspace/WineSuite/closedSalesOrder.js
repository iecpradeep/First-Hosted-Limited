/**
* @fileOverview
* @name Innov.SS.LHK.Closed.SO.js
* @author Innov - Eli Beltran
* 07-17-2012
* @version 1.0
* Deployed as Scheduled Script on Sales Order Record - Runs every hour to look for closed Sales Order for the day.
* The 'Close Sales Order' button doesn't trigger any context type on user-event script so this is the workaround
* Base Units Sold move to Base Units Available.
* Close The Reservation Record (set to inactive)
*/

	var log = new Log('DEBUG');

var closedSO = function()
{
	var searchID = '181'; //https://system.netsuite.com/app/common/search/searchresults.nl?searchid=181&saverun=T&whence=
	var results = nlapiSearchRecord('salesorder', searchID, null, null);

	for (var i = 0; results != null && i< results.length; i++)
	{
			var objContext = nlapiGetContext();
			var intUsageRemaining = objContext.getRemainingUsage();


			if (intUsageRemaining <= 1000)
			{
				nlapiScheduleScript('customscript_innov_closed_so', 'customdeploy1', params);
				break;
				return 0;
			}
			
			var internalid = results[i].getId();
			var obj = nlapiLoadRecord('salesorder', internalid);
			var itemCount = obj.getLineItemCount('item');
			if(itemCount > 0)
			{
				for(var a = 1; a <= itemCount; a++)
				{
					var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', a); //rotation record
					var qty = obj.getLineItemValue('item', 'quantity', a); //rotation record
				
					log.write('Rotation Record: ' + rotationRecord + ' | Quantity: ' + qty + ' | SO ID: ' + internalid);
					
			
					if(!isBlank(rotationRecord))
					{
						try
						{
							updateRotationRecord(rotationRecord, qty);
							
							var s = searchLotNumber(rotationRecord, internalid);
						
							if(s != null)
							{
								for (var a = 0; a < s.length; a++)
								{
									var lotId = s[a].getId();
									if(!isBlank(lotId))
									{
										deleteLotNumber(lotId);
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
};

var updateRotationRecord = function(rotationRecord, qty){
	
	var obj = nlapiLoadRecord('customrecord_rotation', rotationRecord);
	
	var stat = obj.getFieldValue('custrecord_rotation_status');
	
	if(stat != '2') //So Close
	{
		
		var unitsSold = parseInt(obj.getFieldValue('custrecord_lotqtysold'));
		var unitsAvailable = parseInt(obj.getFieldValue('custrecord_loycurrentavailable'));
		
		var newBaseUnitSold = parseInt(unitsSold) - parseInt(qty); //Base Units Available - Re-stock
		var newBaseUnitsAvailable = parseInt(qty) + parseInt(unitsAvailable); //Base Units Available - Re-stock
		
		//Set Field
		obj.setFieldValue('custrecord_lotqtysold', newBaseUnitSold);
		obj.setFieldValue('custrecord_loycurrentavailable', newBaseUnitsAvailable);
		obj.setFieldValue('custrecord_rotation_status', '2'); //SO Closed
		
		//Submit
		try
		{
			var id = nlapiSubmitRecord(obj, true);
			log.write('Modified Rotation Record: ' + id);
		}
		catch(ex)
		{
			log.error(ex);
		}
	}
	
};


var searchLotNumber = function(rotationRecordId, salesOrderId)
{
//	var result = [];

	var filters =
	[
		new nlobjSearchFilter('custrecord_lotres_lot', null, 'is', rotationRecordId, null),
		new nlobjSearchFilter('custrecord_lotres_saleid', null, 'is', salesOrderId, null)
	];

	var s = nlapiSearchRecord('customrecord_lot_reservation',null, filters, null);
	return s;
};

var deleteLotNumber = function(lotId){
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
};
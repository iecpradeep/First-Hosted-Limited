var closedPO = function()
{
	var log = new Log('DEBUG');
	var searchID = '173';
	var results = nlapiSearchRecord('purchaseorder', searchID, null, null);

	for (var i = 0; results != null && i< results.length; i++)
	{
			var objContext = nlapiGetContext();
			var intUsageRemaining = objContext.getRemainingUsage();

			if (intUsageRemaining <= 1000)
			{
				nlapiScheduleScript('customscript_innov_closed_po', 'customdeploy1');
				break;
				return 0;
			}
			
			var internalid = results[i].getId();
			var obj = nlapiLoadRecord('purchaseorder', internalid);
			var itemCount = obj.getLineItemCount('item');
			if(itemCount > 0)
			{
				for(var a = 1; a <= itemCount; a++)
				{
					var rotationRecord = obj.getLineItemValue('item', 'custcol_tran_rotation', a); //rotation record
				
					log.write('Rotation Record: ' + rotationRecord);
			
					if(!isBlank(rotationRecord))
					{
						try
						{
							updateRotationRecord(rotationRecord);
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

var updateRotationRecord = function(rotationRecord){
	var PO_CLOSED = '1';
	//Set status of rotation record to po-closed
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_status', PO_CLOSED); //Item Receipt Record
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rot_tbd', 'T'); //Item Receipt Record
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'isinactive', 'T'); //Item Receipt Record
}
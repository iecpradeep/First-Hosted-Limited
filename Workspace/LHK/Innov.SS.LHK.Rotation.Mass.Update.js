/**
 * @fileOverview
 * @name Innov.SS.LHK.Rotation.Mass.Update.js
 * @author Eli eli@innov.co.uk
 * xx-xx-xx
 * @version 1.0
 * Deployed as scheduled script
 * @description:
 */

var log = new Log('DEBUG');

var scheduledUpdate = function(){

	var objContext = nlapiGetContext();

	var filters =
	[
		new nlobjSearchFilter('isinactive', null, 'is', 'F'),
		new nlobjSearchFilter('custrecord_innov_script_update', null, 'is', 'T')
	];

	var rotation = nlapiSearchRecord('customrecord_rotation', null, filters, null);

	for(var a = 0; rotation != null && a< rotation.length; a++)
	{
		var _id = rotation[a].getId();
		log.write('--- Rotation ID: ' + _id);
		var intUsageRemaining = objContext.getRemainingUsage();

		if (intUsageRemaining <= 1000)
		{
			log.write('BREAK! Remaining Usage: ' + intUsageRemaining);
			var status = nlapiScheduleScript(objContext.getScriptId(), objContext.getDeploymentId());
			if(status == 'QUEUED')
			break;
		}
		try
		{
			
			var obj = nlapiLoadRecord('customrecord_rotation', _id);
			var linkedRecord = obj.getFieldValue('custrecord_lhk_po_link');

			if(!isBlank(linkedRecord))
			{
				var linkType = nlapiLookupField('transaction', linkedRecord, 'type');
				if(linkType == 'PurchOrd')
				{
					var ordType = nlapiLookupField('purchaseorder', linkedRecord, 'custbody_po_order_type');
					if(ordType == 1 || ordType == 3 || ordType == 4)
					{
						//set to Duty Paid
						nlapiSubmitField('customrecord_rotation', _id, 'custrecord_rotation_ordertype', '1');
					}
					else if(ordType == 2 || ordType == 5)
					{
						//set to In Bond
						nlapiSubmitField('customrecord_rotation', _id, 'custrecord_rotation_ordertype', '2');
					}
				}
			}
			nlapiSubmitField('customrecord_rotation', _id, 'custrecord_innov_script_update', 'F');
			log.write('Updated: ' + _id + ' | Remaining: ' + intUsageRemaining);
		}
		catch(ex)
		{
			log.error(ex);
		}
	}
}
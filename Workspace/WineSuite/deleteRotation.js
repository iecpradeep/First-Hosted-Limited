var log = new Log('DEBUG');

var deleteRotation = function()
{
	var poNum = nlapiGetContext().getSetting('SCRIPT', 'custscript_rotation_ponumber');	
	log.write('Purchase Order Number : ' + poNum + ' as parameter');

	var filters =
	[
		new nlobjSearchFilter('custrecord_rotation_ponumber', null, 'is', poNum),
	];	
	
	var results = nlapiSearchRecord('customrecord_rotation', null, filters, null);

	for (var i = 0; results != null && i< results.length; i++)
	{
		var rotationRecord = results[i].getId(); //Rotation Record ID
		
		try
		{
			updateRotationRecord(rotationRecord);
		}
		catch(ex)
		{
			log.error(ex);
		}
	}
};

var updateRotationRecord = function(rotationRecord)
{
	var PO_CLOSED = '1';
	//Set status of rotation record to po-closed
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rotation_status', PO_CLOSED); //Item Receipt Record
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'custrecord_rot_tbd', 'T'); //Item Receipt Record
	nlapiSubmitField('customrecord_rotation', rotationRecord, 'isinactive', 'T'); //Item Receipt Record
	
	log.write('Rotation Record: ' + rotationRecord + ' in now inactive');
};
function getDocNumber()
{

	var autogen = nlapiGetFieldValue('custbody_autogenhkdocnumber');
	var existingdocnumber = nlapiGetFieldValue('custbody_hkdocnumber');

	if (autogen == 'T' && (existingdocnumber == null || existingdocnumber == ''))
	{

		var docid = 2;

		var prefix = nlapiLookupField('customrecord_hkdocnumbers',docid, 'custrecord_hkdocprefix');
		var year = nlapiLookupField('customrecord_hkdocnumbers',docid, 'custrecord_hkyear');
		var currentdocnumber = nlapiLookupField('customrecord_hkdocnumbers',docid, 'custrecord_hkcurrentnumber');
		var suffix = nlapiLookupField('customrecord_hkdocnumbers',docid, 'custrecord_hksuffix');

		var docnumber = prefix + year + currentdocnumber + suffix;

		var currentdocnumberint = Number(currentdocnumber);
		var newdocnumberint = currentdocnumberint + 1;

		var newdocnumber = String(newdocnumberint);

		if (newdocnumberint < 10)
		{
			newdocnumber = '000' + newdocnumber;
		}
		else if (newdocnumberint >= 10 && newdocnumberint < 100)
		{
			newdocnumber = '00' + newdocnumber;
		}
		else if (newdocnumberint >=100 && newdocnumberint < 1000)
		{
			newdocnumber = '0' + newdocnumber;
		}

		nlapiSubmitField('customrecord_hkdocnumbers',docid,'custrecord_hkcurrentnumber', newdocnumber);

		nlapiSetFieldValue('custbody_hkdocnumber',docnumber);

	
	} //if

	// update last modified date

	var d = new Date();

	nlapiSetFieldValue('custbody_datelastmodified',nlapiDateToString(d));

	var deliverystring = '';

	var ship1 = nlapiGetFieldValue('custbody6');
	var ship2 = nlapiGetFieldValue('custbody7');
	var ship3 = nlapiGetFieldValue('custbody8');
	var ship4 = nlapiGetFieldValue('custbody9');
	var ship5 = nlapiGetFieldValue('custbody10');
	var ship6 = nlapiGetFieldValue('custbody20');
	var ship7 = nlapiGetFieldValue('custbody21');
	var ship8 = nlapiGetFieldValue('custbody22');
	var ship9 = nlapiGetFieldValue('custbody23');
	var ship10 = nlapiGetFieldValue('custbody24');

	if (ship1)
	{
		deliverystring = deliverystring + 'Shipment 1 - ' + ship1 + '\n';
	}
	if (ship2)
	{
		deliverystring = deliverystring + 'Shipment 2 - ' + ship2 + '\n';
	}
	if (ship3)
	{
		deliverystring = deliverystring + 'Shipment 3 - ' + ship3 + '\n';
	}
	if (ship4)
	{
		deliverystring = deliverystring + 'Shipment 4 - ' + ship4 + '\n';
	}
	if (ship5)
	{
		deliverystring = deliverystring + 'Shipment 5 - ' + ship5 + '\n';
	}
	if (ship6)
	{
		deliverystring = deliverystring + 'Shipment 6 - ' + ship6 + '\n';
	}
	if (ship7)
	{
		deliverystring = deliverystring + 'Shipment 7 - ' + ship7 + '\n';
	}
	if (ship8)
	{
		deliverystring = deliverystring + 'Shipment 8 - ' + ship8 + '\n';
	}
	if (ship9)
	{
		deliverystring = deliverystring + 'Shipment 9 - ' + ship9 + '\n';
	}
	if (ship10)
	{
		deliverystring = deliverystring + 'Shipment 10 - ' + ship10;
	}

	nlapiSetFieldValue('custbody11',deliverystring);

	return true;

} //function
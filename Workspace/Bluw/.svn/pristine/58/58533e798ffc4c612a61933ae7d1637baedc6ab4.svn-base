function getDocNumber()
{

	var autogen = nlapiGetFieldValue('custbody_autogenhkdocnumber');
	var existingdocnumber = nlapiGetFieldValue('custbody_hkdocnumber');

	if (autogen == 'T' && (existingdocnumber == null || existingdocnumber == ''))
	{

		var docid = 5;

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

	return true;

} //function
/*******************************************************
 * Name:		Pure Sport AutoBarcode
 * Script Type:	Client
 * Version:		1.0.0
 * Date:		3rd October 2011
 * Author:		Pete Lewis, First Hosted Limited.
 *******************************************************/
function AutoBarcode()
{
	
	//get last used Barcode...

	var nextBarcode = parseInt(nlapiLookupField('customrecord_barcode_generator',1,'custrecord_next_barcode'));
	var Barcode = nlapiGetFieldValue('custitem_barcode');
	
	
	if(Barcode == null || Barcode == '' || Barcode.length == 0)
		{
			switch(Right(nextBarcode,1))
			{
				case '0':
				case '1':
				case '2':
					nextBarcode = parseInt(nextBarcode) + 17;
					break;
				default:
					nextBarcode = parseInt(nextBarcode) + 7;
					break;
			}
	
		nlapiSubmitField('customrecord_barcode_generator',1,'custrecord_next_barcode',nextBarcode);
			
		}
	else
		{
		//already a barcode in here...
		alert('You cannot create a new barcode for this item as there is already one associated with it. (' + Barcode + ')');
		}
	return true;
}


/**
 * @param str
 * @param n
 * @returns
 */
function Right(str, n)
/***
        IN: str - the string we are RIGHTing
            n - the number of characters we want to return

        RETVAL: n characters from the right side of the string
***/
{
        if (n <= 0)     // Invalid bound, return blank string
           return "";
        else if (n > String(str).length)   // Invalid bound, return
           return str;                     // entire string
        else { // Valid bound, return appropriate substring
           var iLen = String(str).length;
           return String(str).substring(iLen, iLen - n);
        }
}
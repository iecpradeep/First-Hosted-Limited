//[todo] use names instead of fixed IntIDs


/*****************************************************************************
 * Name:		cataloguerequest.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 12/06/2013 - Initial release - DB
 * 				1.0.1 - 27/06/2013 - Make context switchable between Customer and Catalogue Request - SB
 * 				1.0.2 - 28/06/2013 - Reset flag incorrect - SB
 *
 * Authors:		D.Birt FHL
 * 				S.Boot FHL
 * 
 * Purpose:		
 * 
 * Script: 		customscript_cataloguerequestue
 * Deploy: 		customdeploy1
 * 				customdeploy2
 * 
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:               redundant replace by catRequest.js
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * Notes:       #####################################################
 * 
 * Library: 	Library.js
 *************************************************************************************/

var catReqRecord = null;
var catReqRecordUsed = false;
var newCatRequest = null;
var customer = null;

var catalogue1 = 'F';
var catalogue2 = 'F';
var catalogue3 = 'F';
var catalogue4 = 'F';
var catalogue5 = 'F';


var shipAddr1 = '';
var shipAddr2 = '';
var shipAddr3 = '';
var shipCity = '';
var shipState = '';
var shipZip = '';

/**
 * After Submit
 * @returns
 */
function afterSubmit(type)
{
	try 
	{

		// get current record
		var updateRecord = nlapiGetNewRecord();
		catReqRecord = updateRecord;

		shipAddr1 = updateRecord.getFieldValue('custrecord_cr_addr1');
		shipAddr2 = updateRecord.getFieldValue('custrecord_cr_addr2');
		shipAddr3 = updateRecord.getFieldValue('custrecord_cr_addr3');
		shipCity = updateRecord.getFieldValue('custrecord_cr_city');
		shipState = updateRecord.getFieldValue('custrecord_cr_state');
		shipZip = updateRecord.getFieldValue('custrecord_cr_zip');
		
		catalogue1 = updateRecord.getFieldValue('custrecord_cr_cata');
		catalogue2 = updateRecord.getFieldValue('custrecord_cr_catb');
		catalogue3 = updateRecord.getFieldValue('custrecord_cr_catc');
		catalogue4 = updateRecord.getFieldValue('custrecord_cr_catd');
		catalogue5 = updateRecord.getFieldValue('custrecord_cr_catall');


		// get current date and convert to string in user's date format

		var d = new Date();
		var date = nlapiDateToString(d); 

		// get customer from current record

		var customer = updateRecord.getId();
		var brand = updateRecord.getFieldValue('custrecord_cr_brand');

		if (catalogue1 == 'T')
		{
			var catalogueMapping = null;

			// get catalogue request type 1 mapping
			switch(brand) 
			{
			case '1':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',1,'custrecord_crmapping_catalogue');
				break;

			case '2':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',6,'custrecord_crmapping_catalogue');
				break;

			case '3':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',11,'custrecord_crmapping_catalogue');
				break;
			}  //switch


			// create new catalogue request object
			newCatRequest = newCatReqRecord();

			if (shipAddr1)
			{
				updateShippingAddress();
			}

			// set field values

			newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
			newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

			// submit record

			nlapiSubmitRecord(newCatRequest);

		} //if

		if (catalogue2 == 'T')
		{
			var catalogueMapping = null;

			// get catalogue request type 2 mapping
			switch(brand) 
			{
			case '1':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',2,'custrecord_crmapping_catalogue');
				break;

			case '2':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',7,'custrecord_crmapping_catalogue');
				break;

			case '3':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',12,'custrecord_crmapping_catalogue');
				break;


			}  //switch			

			// create new catalogue request object
			newCatRequest = newCatReqRecord();

			if (shipAddr1)
			{
				updateShippingAddress();
			}

			// set field values

			newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
			newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

			// submit record

			nlapiSubmitRecord(newCatRequest);


		} //if

		if (catalogue3 == 'T')
		{
			var catalogueMapping = null;

			// get catalogue request type 3 mapping
			switch(brand) 
			{
			case '1':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',3,'custrecord_crmapping_catalogue');
				break;

			case '2':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',8,'custrecord_crmapping_catalogue');
				break;

			case '3':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',13,'custrecord_crmapping_catalogue');
				break;


			}  //switch			
			// create new catalogue request object
			newCatRequest = newCatReqRecord();

			if (shipAddr1)
			{
				updateShippingAddress();
			}

			// set field values

			newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
			newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

			// submit record

			nlapiSubmitRecord(newCatRequest);

		} //if

		if (catalogue4 == 'T')
		{
			var catalogueMapping = null;

			// get catalogue request type 4 mapping
			switch(brand) 
			{
			case '1':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',4,'custrecord_crmapping_catalogue');
				break;

			case '2':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',9,'custrecord_crmapping_catalogue');
				break;

			case '3':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',14,'custrecord_crmapping_catalogue');
				break;


			}  //switch			

			// create new catalogue request object
			newCatRequest = newCatReqRecord();

			if (shipAddr1)
			{
				updateShippingAddress();
			}

			// set field values

			newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
			newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

			// submit record

			nlapiSubmitRecord(newCatRequest);

		} //if

		if (catalogue5 == 'T')
		{
			var catalogueMapping = null;

			// get catalogue request type 1 mapping
			switch(brand) 
			{
			case '1':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',5,'custrecord_crmapping_catalogue');
				break;

			case '2':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',10,'custrecord_crmapping_catalogue');
				break;

			case '3':
				catalogueMapping = nlapiLookupField('customrecord_cataloguerequestmapping',15,'custrecord_crmapping_catalogue');
				break;


			}  //switch			

			// create new catalogue request object
			newCatRequest = newCatReqRecord();

			if (shipAddr1)
			{
				updateShippingAddress();
			}

			// set field values

			newCatRequest.setFieldValue('custrecord_cr_catalogue', catalogueMapping);
			newCatRequest.setFieldValue('custrecord_cr_daterequested', date);

			// submit record

			nlapiSubmitRecord(newCatRequest);

		} //if


		return true;	
	}

	catch (e) 
	{
		errorHandler('afterSubmit', e);
	}

}

/**
 * Reuse existing Catalogue Request record
 * Use it as the basis for other Requests if necessary
 * Create new record if non exist already
 * @returns nlobjRecord
 */
function newCatReqRecord()
{
	var newRecord = null;

	try
	{
		if (catReqRecordUsed)
		{
			newRecord = nlapiCopyRecord('customrecord_cataloguerequest', catReqRecord.getId());
		}
		else
		{
			newRecord = nlapiLoadRecord('customrecord_cataloguerequest', catReqRecord.getId());
			catReqRecordUsed = true;
		}
	}
	catch (e)
	{
		errorHandler('newCatReqRecord', e);
	}

	return newRecord;
}



/**
 * update Shipping Address
 * 
 */
function updateShippingAddress()
{

	try
	{
		newCatRequest.setFieldValue('custrecord_cr_addr1', shipAddr1);
		newCatRequest.setFieldValue('custrecord_cr_addr2', shipAddr2);
		newCatRequest.setFieldValue('custrecord_cr_addr3', shipAddr3);
		newCatRequest.setFieldValue('custrecord_cr_city', shipCity);
		newCatRequest.setFieldValue('custrecord_cr_state', shipState);
		newCatRequest.setFieldValue('custrecord_cr_zip', shipZip);
	}
	catch (e)
	{
		errorHandler('updateShippingAddress', e);
	}


}


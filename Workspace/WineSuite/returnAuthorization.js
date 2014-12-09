/*************************************************************************************************
 * Name:		returnAuthorization.js
 * Script Type:	User Event
 *
 * Version:		1.0.0 - 01/07/2013 - Revised Release - AM
 * 				1.0.1 - 01/07/2013 - Get Sale Type and Location field values to set the correct 
 * 										Sale Type on the return authorisation rotation - AM
 *
 * Author:		FHL
 * 
 * Purpose:		Checks the fiscal dates when page loads and updates as needed
 * 
 * Notes:		--------------------Old Header--------------------------------
 *				@fileOverview
 * 				@name Innov.UE.LHK.Return.Authorization.js
 * 				@author Innov - Eli Beltran
 * 				08-15-2012
 * 				@version 1.0
 * 				@version 1.0
 * 					Deployed as User-Event Script on SO Return Authorization
 * 				@description:
 * 				1. Rotation fields are blanked on the Return line
 * 				2. Stock level at location increased by selected values
 * 				3. New Rotation created per line in the format of SOR-Customer-Order#-Line
 * 				4. Set Rotation Fields:
 * 					a. Units Qty set into custrecord_rotation_item_units_purchased
 * 					b. 0 set into custrecord_rotation_item_units_sold
 * 					c. Units Qty set into custrecord_rotation_item_units_available
 * 
 *************************************************************************************************/

/**
 * 
 * @param type
 * @returns {Boolean}
 * 
 */
function afterSubmit(type)
{
	var location = 0; 
	var saleType = 0; 
	var count = null;
	var quantity = null;
	var rotationID = null;
	var copyRotation = null;
	var newRotationName = null;
	var obj = null;
	var createdfrom = null;
	var customer = null;
	var raNum = null;
	var newRotationId = null;
	var internalId = null;
	var name = null;
	var poOrderTypesId = null;

	try
	{
		if(type == 'create' || type == 'edit')
		{
			recordType = nlapiGetRecordType();
			recordId = nlapiGetRecordId();

			if(recordType == 'returnauthorization')
			{
				obj = nlapiLoadRecord(recordType, recordId);
				createdfrom = obj.getFieldValue('createdfrom');
				customer = obj.getFieldText('entity');
				raNum = obj.getFieldValue('tranid');
				
				//Get the location and Sale Type from the Return Authorisation to reset on the updated SOR Rotation
				location = obj.getFieldValue('location'); 
				saleType = obj.getFieldText('custbody_saletype');
				
				//Look up the name of the Sale Type on the Return Authorisation and use it to get the internal Id
				poOrderTypesId = genericSearch('customrecord_po_order_types', 'name', saleType);
				
				nlapiLogExecution('ERROR', 'afterSubmit PO name', name);
				nlapiLogExecution('ERROR', 'afterSubmit internalId', internalId);
				nlapiLogExecution('ERROR', 'afterSubmit saleType', saleType);
				nlapiLogExecution('ERROR', 'afterSubmit location', location);
				nlapiLogExecution('ERROR', 'afterSubmit poOrderTypesId', poOrderTypesId);
								
				if(isBlank(createdfrom))
				{
					//Halt Script if Vendor Credit is not from Bill
					return false;
				}

				count = obj.getLineItemCount('item');

				if(count > 0)
				{
					for(var i = 1; i <= count; i++)
					{
						quantity = obj.getLineItemValue('item', 'quantity', i);
						rotationID = obj.getLineItemValue('item', 'custcol_tran_rotation', i);
						
						if(!isBlank(rotationID))
						{
							//Copy Rotation Record
							copyRotation = nlapiCopyRecord('customrecord_rotation', rotationID);
							newRotationName = 'SOR-' + customer + '-' + raNum + '-' + i;

							unitconversionrate = obj.getLineItemValue('item', 'unitconversionrate', i); //units
							baseUnitPurchased = parseInt(quantity) * parseInt(unitconversionrate);

							copyRotation.setFieldValue('name', newRotationName);
							copyRotation.setFieldValue('custrecord_rotation_item_units_purchased', quantity); //Case(s)/Bottle(s) on PO
							copyRotation.setFieldValue('custrecord_loyqtyordered', baseUnitPurchased); //Base Units Purchased
							copyRotation.setFieldValue('custrecord_loycurrentavailable', baseUnitPurchased); //Base Units Available
							copyRotation.setFieldValue('custrecord_rotation_item_units_available', quantity); //Case(s)/Bottle(s) Available
							copyRotation.setFieldValue('custrecord_rotation_item_units_sold', 0); //Base Units Purchased
							copyRotation.setFieldValue('custrecord_lotqtysold', 0); //Base Units Purchased
							copyRotation.setFieldValue('custrecord_lhk_po_link', recordId); //PO Link - Replaced by Return Auth record		

							//Set the new values to the new Return Authorisations
							copyRotation.setFieldValue('custrecord_rotation_ordertype', poOrderTypesId);
							copyRotation.setFieldValue('custrecord_rotation_location', location);

							newRotationId = nlapiSubmitRecord(copyRotation, true);
							nlapiLogExecution('DEBUG', 'New Rotation record: ' + newRotationId + ' | ' + newRotationName);
							obj.setLineItemValue('item', 'custcol_tran_rotation', i, newRotationId);
						}
					}

					nlapiSubmitRecord(obj, true);
				}
			}
		}
	}
	catch(e)
	{
		errorHandler('afterSubmit ',e);
		nlapiLogExecution('ERROR', 'afterSubmit', e.message);
	}
}





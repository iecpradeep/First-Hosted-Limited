/*******************************************************
 * Name:             Enlogic script
 * Script Type:      User Event
 * Version:          1.2.0
 * Date:             11th May 2012
 * Author:           Peter Lewis, First Hosted Limited.
 *******************************************************/



/**
 * after Entity Submit - Once the record has been saved, set any processing to occur here.
 * 
 * @param type. Automatically passed from NetSuite - this is the event type being actioned, e.g. Create, Edit, Delete...
 * @returns {Boolean}. This is whether it was successful or not.
 */

function afterEntitySubmit(type)
{
	try
	{
		if (type == 'create') 
		{
			var currentUserId = nlapiGetUser();
			var currentRecordType = nlapiGetRecordType();
			var currentRecordID = nlapiGetRecordId();
			var entityRecord = nlapiLoadRecord(currentRecordType,currentRecordID);
			var createdBy = entityRecord.getFieldValue('custentity_createdby');
			
			if(createdBy == null||createdBy == '')
			{
				createdBy = nlapiLookupField('employee', currentUserId,'entityid');
				entityRecord.setFieldValue('custentity_createdby',createdBy);
				nlapiSubmitRecord(entityRecord);
			}
		}
	}
	catch(e)
	{
		nlapiLogExecution('ERROR','Entity After Submit Error', e.message);
	}

	return true;
}


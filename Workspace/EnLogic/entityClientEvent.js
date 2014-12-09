/*******************************************************
 * Name:             Enlogic Script
 * Script Type:      Client Script
 * Version:          1.6.0
 * Date:             11th May 2012
 * Author:           Peter Lewis, First Hosted Limited.
 *******************************************************/
//Test Upload amorganti



/**
 * after Entity Submit - Once the record has been saved, set any processing to occur here.
 * 
 * @param type. Automatically passed from NetSuite - this is the event type being actioned, e.g. Create, Edit, Delete...
 * @returns {Boolean}. This is whether it was successful or not.
 */

function clientEntitySave()
{
	try
	{

			var currentUserId = nlapiGetUser();
	
	
			var currentRecordID = nlapiGetRecordId();
			
			//alert('Current Record ID: "' + String(currentRecordID).length + '"');
			
			
			return true;

			//'custentity_createdby'
			
			if (String(nlapiGetFieldValue('custentity_createdby')).length == 0) 
			{
				alert("Please provide a value for fieldA");
				return false;
			}
			alert("Are you sure you want to Save the record?");
			return true;
			
			
			
			if(createdBy == null||createdBy == '')
			{
				createdBy = nlapiLookupField('employee', currentUserId,'entityid');
				entityRecord.setFieldValue('custentity_createdby',createdBy);
				nlapiSubmitRecord(entityRecord);
			}

	}
	catch(e)
	{
		nlapiLogExecution('ERROR','Entity Client On Save Error', e.message);
	}

	return true;
}


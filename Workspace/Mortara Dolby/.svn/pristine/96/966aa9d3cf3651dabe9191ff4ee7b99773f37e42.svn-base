/********************************************************************************************
 * Name: Set Applied To Sales Order Flag To False
 * Script Type: User Event
 * Client: Mortara Dolby
 * 
 * Version: 1.0.0 - 03 May 2012 - 1st release - MJL
 *          1.0.1 - 08 Aug 2012 - sets Applied to SO flag to false on creation of case - MJL
 *
 * Author: Matthew Lawrence, FHL
 * Purpose: Sets the Applied to Sales Order check box on a Service Line Item to false 
 * 			if an existing record is copied
 * 
 * Script: customscript_sl_setappliedtofalse
 * Deployments: customdeploy_case_setappliedtofalse (Case)
 * 				customdeploy_sl_setappliedtofalse (Service Line Item)  
 ********************************************************************************************/

/**
 * Sets Applied to SO flag to false if Event Type is Create
 */
function setAppliedToFalse(type)
{	
	if (type = 'create')
	{
		nlapiSubmitField(nlapiGetRecordType(), nlapiGetRecordId(), 'custrecord_sl_appliedtosalesorder', 'F');
	}
}

/**
 * Sets Applied to SO flag to false if Event Type is Create
 * 1.0.1 sets Applied to SO flag to false on creation of case - MJL
 */
function setAppliedToFalse_Case(type)
{	
	var recType = nlapiGetRecordType();
	var recID = nlapiGetRecordId();
	var recCase = null;
	
	var soField = '';
	var lineCount = 0;
	var caseNo = '';

	nlapiLogExecution('AUDIT', 'Event type', type);
	nlapiLogExecution('AUDIT', 'Record Type', recType);
	
	if (type == 'create' || type == 'edit')
	{
		if (recType == 'customrecord_servicelineitem')
		{
			nlapiSubmitField(recType, recID, 'custrecord_sl_appliedtosalesorder', 'F');
			nlapiLogExecution('AUDIT', 'recID', recID);
		}
		else
		{
			recCase = nlapiGetNewRecord();
			
			try
			{
				soField = String(recCase.getFieldValue('custevent_sl_salesorder'));
				nlapiLogExecution('AUDIT', 'soField', soField);
				
				if ((soField == 'null') || (soField.length == 0))
				{	
					caseNo = recCase.getFieldValue('casenumber');
					lineCount = recCase.getLineItemCount('recmachcustrecord_sl_case');
					
					nlapiLogExecution('DEBUG', 'line count', lineCount);
					
					for(var i = 1; i <= lineCount; i++)
					{
						recCase.setLineItemValue('recmachcustrecord_sl_case', 'custrecord_sl_appliedtosalesorder', i, 'F');
						nlapiLogExecution('DEBUG', 'Line ' + i, recCase.getLineItemValue('recmachcustrecord_sl_case', 'custrecord_sl_appliedtosalesorder', i));
					}
				}
			}
			catch(e)
			{
				nlapiLogExecution('ERROR', 'Cannot alter Applied To SO field for case ' + caseNo, e.message);
			}
		}
	}
}

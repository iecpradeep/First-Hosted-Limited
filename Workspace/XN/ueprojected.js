/*******************************************************
 * Name:		Project Values script
 * Script Type:	User Event
 * Version:		1.0.0
 * Date:		20th June 2011
 * Author:		Peter Lewis, First Hosted Limited
 *******************************************************/

/*
 * Function called after record submit
 * 
 * custbody_reportingtotal 
 * 
 * so: subtotal
 * op: projectedtotal
 * qu: subtotal
 * 
 */

function afterSubmitUE(type)
{
	nlapiLogExecution('DEBUG', 'type argument', 'type is ' + type);  
	saveTransaction();
	nlapiLogExecution('DEBUG', 'Status', '*** END After Submit Script Debug ***');
}



function saveTransaction()
{
	var theRecord;
	var theNewValue = 0;
			
	try 
	{
		//try and load salesorder
		theRecord = nlapiLoadRecord('salesorder',nlapiGetRecordId());
		theNewValue = theRecord.getFieldValue('subtotal');
		nlapiLogExecution('DEBUG', 'Loaded', 'Loaded Sales Order. Saved ' + theNewValue);
	} 
	catch (e) 
	{
		
		try 
		{
			//try and load opportunity
			theRecord = nlapiLoadRecord('opportunity',nlapiGetRecordId());
			theNewValue = theRecord.getFieldValue('projectedtotal');
			nlapiLogExecution('DEBUG', 'Loaded', 'Loaded Opportunity. Saved ' + theNewValue);
		} 
		catch (e) 
		{
				
			try 
			{
				//try and load quotation
				theRecord = nlapiLoadRecord('estimate',nlapiGetRecordId());
				theNewValue = theRecord.getFieldValue('subtotal');
				nlapiLogExecution('DEBUG', 'Loaded', 'Loaded Quotation. Saved ' + theNewValue);
			} 
			catch (e) 
			{
				nlapiLogExecution('DEBUG', 'Error', 'No loaded types found. e:' + e.toString);
				return false;
			}
		}
	}

	theRecord.setFieldValue('custbody_reportingtotal', theNewValue);		//set the last saved status to the current status
	nlapiSubmitRecord(theRecord,false,false);	//submit the record for saving.
		
	return true;
}















/*******************************************************
 * Name:		Pure Rugby Cash Sale script
 * Script Type:	User Event
 * Version:		1.0.2
 * Date:		18 April 2011
 * Author:		FHL
 *******************************************************/

/*
 * cashSale function, called after record sumbit
 */

function cashSale()
{
	var context = nlapiGetContext();
	
	
	if (type == 'create' && context.getExecutionContext() == 'webservices') 
	{

		nlapiLogExecution('DEBUG', 'Status', '*** START ***');


		//Obtain a handle to the newly created cash sale
		var csRecord = nlapiGetNewRecord();
		var csRecordId = csRecord.getId();

		nlapiLogExecution('DEBUG', 'Cash Sale Id', csRecordId);
 		
		// cash sale journal for allocating payment amounts
		var totalValue = csRecord.getFieldValue('total');
		var cashValue = csRecord.getFieldValue('custbody_epos_cash_amount');
		var cardValue = csRecord.getFieldValue('custbody_epossalecardamount');

		nlapiLogExecution('DEBUG', 'Total Value', totalValue);
		nlapiLogExecution('DEBUG', 'Cash Value', cashValue);
		nlapiLogExecution('DEBUG', 'Card Value', cardValue);

		
		var jnl = createJournal(totalValue,cashValue,cardValue);

		nlapiLogExecution('DEBUG', 'Journal Id', jnl);
		nlapiLogExecution('DEBUG', 'Status', '*** END ***');
	} //if
	return true;
} //function

function createJournal(totalValue, cashValue, cardValue)
{
	
	var journalRecord = nlapiCreateRecord('journalentry');
	
	var today = nlapiDateToString(new Date());
	
	totalValue = parseFloat(totalValue);
	cashValue = parseFloat(cashValue);
	cardValue = parseFloat(cardValue);
	
	// set header fields
	journalRecord.setFieldValue('trandate',today);
	journalRecord.setFieldValue('reversaldefer','F');
	
	// set line item credit (total value)
	journalRecord.selectNewLineItem('line');
	journalRecord.setCurrentLineItemValue('line','account',427);
	journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
	journalRecord.commitLineItem('line');   
	
	if (!isNaN(cashValue) && cashValue > 0)
	{
		// set line item debit (cash value)
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',152);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(cashValue));
		journalRecord.commitLineItem('line');  		
	} //if
	
	if (!isNaN(cardValue) && cardValue > 0)
	{
		// set line item debit (card value)
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',428);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(cardValue));
		journalRecord.commitLineItem('line');  		
	} //if
	
	id = nlapiSubmitRecord(journalRecord,true);

	return id;
	
} //function createJournal

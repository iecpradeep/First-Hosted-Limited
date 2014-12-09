/***********************************************
* Name:	 Sales Order Email Acknowledgement 
* Author:   FHL
* Client: 	 Dolby Medical
* Date:     9 Feb 2012
* Version:  1.1.000006
************************************************/

function soAckEmail(type) 
{
	
	if(type == 'delete')
	{
		nlapiLogExecution('DEBUG', 'Order Acknowledge Script','The Transaction is Deleted, thus does not need to be emailed.');
		return true;
	}
	
	//get invoice ID
	var invID = nlapiGetRecordId();
	var invType = nlapiGetRecordType();
	nlapiLogExecution('DEBUG', 'Inv ID', invID);
	
	//load inv record
	var invRecord = nlapiLoadRecord(invType, invID);
	var SoID = invRecord.getFieldValue('createdfrom');
	nlapiLogExecution('DEBUG', 'SO ID', SoID); 
	
	var SoRecord = nlapiLoadRecord('salesorder', SoID);
	var soNum = SoRecord.getFieldValue('tranid');
	var soDate = SoRecord.getFieldValue('trandate');
	
	//nlapiLogExecution('DEBUG', 'SO Num', soNum);
	//nlapiLogExecution('DEBUG', 'SO Date', soDate);
	
	//get a PDF from SO to attach to email
	var soPDFFile = nlapiPrintRecord('TRANSACTION', SoID, 'PDF', null);
	
	//get email address from inv record
	var soEmail = invRecord.getFieldValue('custbody_dm_soackemail');
	//get internal ID of current user
	var userID = nlapiGetUser();
	
	//send email w/ SO attached   
	var email = 2;
	
	nlapiLogExecution('DEBUG', 'userID', userID);
	
	//	if (email == 1) {
	nlapiSendEmail(userID, soEmail, 'Order # ' + soNum, "Attached is Sales Order number " + soNum + ", dated " + soDate, null, null, null, soPDFFile);
	//   }
	

}

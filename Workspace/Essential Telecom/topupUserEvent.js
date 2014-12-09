/**********************************************************************************************************
 * Name:        topupUserEvent
 * Script Type: User Event
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  			1.0.1 - 06/02/2013 - getting the voucherPartnerID to calculate the extra commission
 *  			1.0.2 - 07/02/2013 - adding the additional commission where the sim partner and voucher partner is not the same for physical vouchers - AS
 * 								   - remove the voucher type check for physical vouchers
 * 				1.0.3 - 28/02/2013 - getting the 'voucher type' by 'name' instead of 'internal id' - AS 				
 * 				1.0.4 - 01/03/2013 - adding the validations for few functions - AS
 * 								   - getting the 'top up type' using 'voucher type' instead of using 'top up type' - AS
 * 				1.0.5 - 30/05/2013 - Commenting out lookupItemToInvoiceAndVoucherCommissionRateToUse, 
 * 										createJournalVoucherCommission,createJournalDistributorCommission functions - AS
 *								   - adding lookupItemToCreateInvoice,createJournalForAllocatingTopupsToCustomer functions - AS
 * 								   - retrieving type field value - AS
 *								   - adding allocatingTopupJRNL link to the daily topup record - AS
 * 				1.0.6 - 11/06/2013 - adding calculateDistributorCommission() function - AS
 * 								   - adding if statement in topupUserEvent() function - AS
 * 								   - removing the magic numbers - AS
 * 								   - changing createJournalDistributorCommission() function to calculateDistributorCommission() function - AS
  *				   				   - changing the invoice creation to credit note creation - AS	
 *				   				   - removing journal creation code from the calculateDistributorCommission function - AS
 *				   				   - setting more fields in  daily top up record - AS
 *				   				   - commenting out createJornalPLToBS(), lookupItemToCreateCreditNote() functions - AS
 *				1.0.7 - 18/06/2013 - Adding the AR account to the new customers - AS
 * 
 * Author:      FHL
 * Purpose:     When a top up record is written, this user event fires to create the Credit Notes and journals
 * Fires on:	create in customrecord_dailytopupvouchers  
 * 
 * Script:      customscript_topupuserevent
 * Deploy:     	customdeploy_topupuserevent  
 * 
 * Libraries:   library.js
 **********************************************************************************************************/
//static variables
var TOPUPBANKACCOUNTNAME = '';
var TOPUPBANKACCOINTINTID = 0;
var JOURNALLOCATION = '';
var COMMISSIONACCOUNTNAME = 0;
var COMMISSIONACCOUNTINTID = 0;
var CREDITNOTEFORMNAME = '';
var CREDITNOTEFORMINTID = 0;
var COMMISSIONITEMNAME = '';
var COMMISSIONITEMINTID = 0;

var creditNoteRecord = null;
var usageDate = null;
var voucherCommIntID = 0;
var msisdn = '';
var serialNumber = '';
var pin = '';
//var topUptype = '';
var topUpValue = 0;
var journalLocationIntID = 0;
var simPartnerIntID = 0;
var custIntID = 0;
var itemCode = '';
var itemIntID = 0;
var voucherCommission = 0;
var createCreditNote = 'F';		// T/F
var journalVoucherDesc = '';
var createdCreditNote = 0;
var balSheetTransferIntID = 0;		// custitem_balsheetxfer - comes from item
var incomeAccountIntID = 0;			// income account - comes from item
//var distributorAccIntID = 0;		// AR account for distributor commissions
var creditNoteIntId = 0;
var plbsJRNL = 0;
var TAXNAME = '';
var allocatingTopupJRNL = 0;		//
var voucherJRNL = 0;
var distributorJRNL = 0;
var distribCommission = 0;
var voucherType = 0;
var distributorName = '';	
var simRecord = null;
var voucherPartnerIntID = 0 ; 
var voucherTypeName = '';
var errorMsg = '';
var distComm = 0;
var dailyTopupType = '';
var topUpRecord = null;
var comTotal = 0;
var diffSimVoucherPartners = 'F';
var cusName = '';
var CUSTOMERARACCOUNTNAME = '';
var CUSTOMERARACCOUNTINTID = 0;
var DESC = '';
/**
 * main - starting point
 * version 1.0.5 - 1 Commenting out lookupItemToInvoiceAndVoucherCommissionRateToUse, 
 * 						createJournalVoucherCommission,createJournalDistributorCommission functions - AS
 * 				 - 2 adding lookupItemToCreateInvoice, createJournalForAllocatingTopupsToCustomer functions - AS
 *        
 *		   1.0.6 - 1 adding calculateDistributorCommission() function - AS
 *				   2 adding if statement in topupUserEvent() function - AS 
 *				   3 commenting out createJornalPLToBS(), lookupItemToCreateCreditNote() function - AS
 */				
function topupUserEvent(type)
{
	initialise();
	loadTopUpRecord();
	lookupVoucher();
	determineCustomerAndPartner();
	
	//version 1.0.6 - 2
	//only the sold sims and the sold physical vouchers should affect the process of toping up
	if((simPartnerIntID > 0 && voucherTypeName != 'Physical Voucher') || (voucherTypeName == 'Physical Voucher' && voucherPartnerIntID > 0 && simPartnerIntID > 0))
	{
		createCustomerIfNotExist();
		//lookupItemToInvoiceAndVoucherCommissionRateToUse();		//version 1.0.5 - 1
		//lookupItemToCreateCreditNote();							//version 1.0.5 - 2, 1.0.6 -3
		//getItemAccounts();
		calculateDistributorCommission();							//version 1.0.6 - 1
		
		//if there's a distributor commission
		if(comTotal > 0)
		{
			postCreditNoteIntoNetsuite();
			
			/********************************************************************
			 * set the memo field with the current credit memo number in order to get
			 * the credit memo ref displayed in the customer statement. 
			 * As the credit memo is not created in postCreditNoteIntoNetsuite() and 
			 * the credit memo number is an  auto-generated field, the credit memo number 
			 * cannot be fetched in the current credit memo.
			 * hence the created credit memo is loaded again n setting the memo field and submitted again.
			 *******************************************************************/
			creditNoteRecord = nlapiLoadRecord('creditmemo', creditNoteIntId);
			
			//getting the transaction id of the credit note to show in the memo
			createdCreditNote = nlapiLookupField('creditmemo', creditNoteIntId, 'tranid');
		
			DESC = 'Top Up Credit Note : ' +createdCreditNote + ' Receipts from Distributor';
			
			creditNoteRecord.setFieldValue('memo', DESC);
			nlapiSubmitRecord(creditNoteRecord);
			
			//version 1.0.6 - 3
			//createJournalDisriCommission();								//transfer from item's income account to clearing account
			//createJournalVoucherCommission();						//version 1.0.5 - 1
			//createJournalDistributorCommission();					//version 1.0.5 - 1
		}

		
		createJournalForAllocatingTopupsToCustomer();				//version 1.0.5 - 2
		updateSimRecord();
		updateDailyTopUpRecord();
	}
	else
	{
		errorMsg = 'The Sim has not been sold yet';
	}

}



/**
 * initialise
 * 
 * version 1.0.6 - removing the magic numbers - AS
 */
function initialise()
{
	try
	{
		//  Note: 'BB Credit Memo' custom transaction form's internal id is 104
		CREDITNOTEFORMINTID = 104;
		
		TAXNAME = 'Z-GB';
		TAXINTID = genericSearch('salestaxitem', 'name', TAXNAME);
		
		TOPUPBANKACCOUNTNAME = 'Top-up Bank Clearing Account';
		TOPUPBANKACCOINTINTID = genericSearch('account', 'name', TOPUPBANKACCOUNTNAME);
		
		COMMISSIONITEMNAME = 'Daily Top Up Commissions';
		COMMISSIONITEMINTID = genericSearch('item', 'name', COMMISSIONITEMNAME);
		
		COMMISSIONACCOUNTNAME = 'Distributor Top Up Commissions';
		COMMISSIONACCOUNTINTID = genericSearch('account', 'name', COMMISSIONACCOUNTNAME);
	
		JOURNALLOCATION = 'United Kingdom';
		VOUCERCOMMISSIONS = 'Voucher Commissions';

		CUSTOMERARACCOUNTNAME = 'Sim Customer A/R';
		CUSTOMERARACCOUNTINTID = genericSearch('account', 'name', CUSTOMERARACCOUNTNAME);
		
		journalLocationIntID = genericSearch('location', 'name', JOURNALLOCATION);
		//distributorAccIntID = 337;	
	}
	catch(e)
	{
		errorHandler("initialise", e);		
	}
}



/**
 * load top up record from custom recordset
 * version 1.0.5 - retrieving type field value - AS
 */
function loadTopUpRecord()
{
	var recordID = 0;
	
	try
	{
		//getting the current topup record id
		recordID = nlapiGetRecordId();
		topUpRecord = nlapiLoadRecord('customrecord_dailytopupvouchers', recordID);		//loading the topup record
		
		usageDate = topUpRecord.getFieldValue('custrecord_usagedate');					//getting the usage date
		usageDate = convertDate(usageDate);												// converting the usage date from '14/08/2012 15:10' format to '14/08/2012'								
			
		msisdn = topUpRecord.getFieldValue('custrecord_msisdn');						//getting the msisdn number
		serialNumber = topUpRecord.getFieldValue('custrecord_serialnumber');			//getting the voucher's serial number
		
		//pin = topUpRecord.getFieldValue('custrecord_pin');
		
		//version 1.0.5
		dailyTopupType = topUpRecord.getFieldValue('custrecord_type');					//getting the 'Type' field value	
		topUpValue = topUpRecord.getFieldValue('custrecord_value');						//getting the top up value	

	}
	catch(e)
	{
		errorHandler("loadTopUpRecord", e);		
	}
}



/**
 * lookupVoucher to retrieve the voucher type and the voucher partner
 *
 * version 1.0.1 - getting the voucherPartnerID to calculate the extra commission
 * version 1.0.3 - getting the 'voucher type' by 'name' instead of 'internal id' 
 */
function lookupVoucher()
{
	var voucherIntID = 0;
	var voucherRecord = null;

	try
	{
		if(serialNumber)
		{
			voucherIntID = genericSearch('customrecord_vouchers','custrecord_vouchernumber',serialNumber);
	
			if(voucherIntID >0)
			{
				voucherRecord = nlapiLoadRecord('customrecord_vouchers', voucherIntID);
			
				voucherType = voucherRecord.getFieldValue('custrecord_vouchertype');
			
				//getting the 'voucher type' by 'name' instead of 'internal id'	
				// version 1.0.3
				voucherTypeName = genericSearchReturnName('customlist_vouchertype', 'internalid',voucherType);
	
				//version 1.0.1 
				if(voucherTypeName == 'Physical Voucher') 
				{
					voucherPartnerIntID = voucherRecord.getFieldValue('custrecord_voucherpartner');
				}
			}
			else
			{
				errorMsg = 'There are no voucher records found for the Serial Number';
			}
		}
	}
	catch(e)
	{
		errorHandler("lookupVoucher", e);		
	}

}



/**
 * determine customer and partner from sim record
 * 
 * version 1.0.4 - adding the validations for few functions - AS
 * 								   
 */
function determineCustomerAndPartner()
{
	var simIntID = 0;
	
	try
	{
		msisdn = parseInt(msisdn);				//passing the msisdn to integer as the sim record's phone number field is type of decimal number
		simIntID = genericSearchOperator('customrecord_sim_card','custrecord_sim_phone_number',msisdn,'equalto');
	
		nlapiLogExecution('audit', 'determineCustomerAndPartner simIntID', simIntID);
		
		//version 1.0.4
		if(simIntID > 0)
		{
			simRecord = nlapiLoadRecord('customrecord_sim_card', simIntID);

			simPartnerIntID = simRecord.getFieldValue('custrecord_sim_partner');
			custIntID = simRecord.getFieldValue('custrecord_sim_customer');
			cusName = nlapiLookupField('customer', custIntID, 'entityid');
			
		}
		else
		{
			errorMsg = 'There are no Sim records for the particular MSISDN';
		}
		
	}
	catch(e)
	{
		errorHandler("determineCustomerAndPartner", e);				
	}             

}



/**
 * where a customer does not exist, create one
 * 
 */
function createCustomerIfNotExist()
{
	var telNo='';

	try
	{
		if(custIntID == 0 || custIntID == '' || custIntID == null)
		{
			//***************************************************
			// create the customer
			//***************************************************
			telNo = simRecord.getFieldValue('custrecord_sim_phone_number');
			nlapiLogExecution('audit', 'createCustomerIfNotExist telNo', telNo);
			
			custIntID = createCustomer(telNo);

		}
		
	}
	catch(e)
	{
		errorHandler("createCustomerIfNotExist", e);				
	}             

}


/**
 * create a customer for the telephone number
 *
 * version 1.0.7 - 18/06/2013 - Adding the AR account to the new customers
 */
function createCustomer(telNo)
{
	var custIntID = 0;
	var newCust = null;
	
	try
	{
		// search to see if it already exists
		custIntID = genericSearch('customer','entityid',telNo);
		
		if(custIntID==0)
		{
			newCust = nlapiCreateRecord('customer');
	
			newCust.setFieldValue('entityid', telNo);
			newCust.setFieldValue('lastname', telNo);
			newCust.setFieldValue('firstname', telNo);
			newCust.setFieldValue('autoname', 'F');
			newCust.setFieldValue('isperson', 'T');
			newCust.setFieldValue('receivablesaccount', CUSTOMERARACCOUNTINTID);		//version 1.0.7	
			custIntID = nlapiSubmitRecord(newCust, true);
	
		}

	}
	catch(e)
	{
		errorHandler("createCustomer", e);		
	}

	return custIntID;
	
}



/**
 * lookup the item and voucher commission rate to use based on the top up type
 * version 1.0.4 - adding the validations for few functions - AS
 * 				 - getting the 'top up type' using 'voucher type' instead of using 'top up type'
 */
function lookupItemToInvoiceAndVoucherCommissionRateToUse()
{
	var lookupTypeIntID = 0;
	var lookupTypeRecord = null;
	
	try
	{
		//version 1.0.4 - getting the 'top up type' using 'voucher type' instead of using 'top up type'
		lookupTypeIntID = genericSearch('customrecord_topuptypelookup','custrecord_topuptype',voucherType);
		
		//version 1.0.4 - adding the validations for few functions
		if(lookupTypeIntID >0)
		{
			lookupTypeRecord = nlapiLoadRecord('customrecord_topuptypelookup', lookupTypeIntID);
		
			itemIntID = lookupTypeRecord.getFieldValue('custrecord_invoiceitem');
			voucherCommission = lookupTypeRecord.getFieldValue('custrecord_commissionpercent');
			voucherCommIntID = lookupTypeRecord.getFieldValue('custrecord_commissionaccount');
		
			createInvoice = lookupTypeRecord.getFieldValue('custrecord_createinvoice');
			journalVoucherDesc = lookupTypeRecord.getFieldValue('custrecord_commissiondesc');
		}
		else
		{
			errorMsg = 'Topup Lookup Type is not found';
		}
		
	}
	catch(e)
	{
		errorHandler("lookupItemToInvoiceAndVoucherCommissionRateToUse", e);				
	}             

}


/**
 * lookup the item based on the daily top up type
 * 
 */
function lookupItemToCreateCreditNote()
{
	var itemLookupRecordIntID = 0;
	var itemLookupRecord = null;
	
	try
	{
		//version 1.0.4 - getting the 'top up type' using 'voucher type' instead of using 'top up type'
		itemLookupRecordIntID = genericSearch('customrecord_itemlookup','custrecord_dailytopuptype',dailyTopupType);
		
		//version 1.0.4 - adding the validations for few functions
		if(itemLookupRecordIntID >0)
		{
			//loading the 'item Lookup for daily topups' record
			itemLookupRecord = nlapiLoadRecord('customrecord_itemlookup', itemLookupRecordIntID);
		
			//getting the item
			itemIntID = itemLookupRecord.getFieldValue('custrecord_netsuiteitem');
			
			createCreditNote = itemLookupRecord.getFieldValue('custrecord_createcreditnote');

		}
		else
		{
			errorMsg = 'no Item matching to Daily top up type is found';
		}
		
	}
	catch(e)
	{
		errorHandler("lookupItemToCreateCreditNote", e);				
	}             

}


/**
 * get item account details for income and balance sheet transfer
 * version 1.0.4 - adding the validations for few functions - AS
 */
function getItemAccounts()
{
	try
	{
		// version 1.0.4
		if(COMMISSIONITEMINTID > 0)
		{
			incomeAccountIntID = nlapiLookupField('item', COMMISSIONITEMINTID, 'incomeaccount');
			balSheetTransferIntID = nlapiLookupField('item', COMMISSIONITEMINTID, 'custitem_balsheetxfer');

		}
		else
		{
			errorMsg = 'Item is not found';
		}
	}
	catch(e)
	{
		errorHandler("getItemAccounts", e);		
	}

}



/**
 * post Credit Note into netsuite
 * 
 * version 1.0.6 - changing the invoice creation to credit note creation - AS
 */
function postCreditNoteIntoNetsuite()
{

	
	try
	{
		// set values for the  Credit Note header
		createCreditNoteHeader();
		createCreditNoteDetailLine();				//setting values for the line items
		creditNoteIntId = nlapiSubmitRecord(creditNoteRecord, true);
		
		//getting the transaction id of the credit note to show in the memo
		createdCreditNote = nlapiLookupField('creditmemo', creditNoteIntId, 'tranid');

	}
	catch(e)
	{
		errorHandler("postCreditNoteIntoNetsuite", e);				
	}             

}


/**
 * create Credit Note header
 */
function createCreditNoteHeader()
{
	
	
	try
	{
		
		creditNoteRecord = nlapiCreateRecord("creditmemo");
		
		creditNoteRecord.setFieldValue('customform', CREDITNOTEFORMINTID); 
		creditNoteRecord.setFieldValue('location',journalLocationIntID);

		creditNoteRecord.setFieldValue('partner',simPartnerIntID);
		creditNoteRecord.setFieldValue('trandate', usageDate);
		creditNoteRecord.setFieldValue('entity', simPartnerIntID);		 
		creditNoteRecord.setFieldValue('otherrefnum', distComm);	
		creditNoteRecord.setFieldValue('autoapply', 'T');	
		
	}
	catch(e)
	{
		errorHandler("createCreditNoteHeader", e);				
	}             

}


/**
 * post Credit note line to NetSuite
 */
function createCreditNoteDetailLine()
{
	try
	{
		// create credit note line
		creditNoteRecord.selectNewLineItem('item');
		creditNoteRecord.setCurrentLineItemValue('item', 'item', COMMISSIONITEMINTID);      
		creditNoteRecord.setCurrentLineItemValue('item', 'amount', comTotal);
		creditNoteRecord.setCurrentLineItemValue('item', 'taxcode', TAXINTID);
		creditNoteRecord.commitLineItem('item');
		
	}
	catch(e)
	{
		errorHandler("createCreditNoteDetailLine", e);				
	}             

}



/**
 * create journal to transfer from PL to BS
 *
 */

function createJournalDisriCommission()
{	
	var journalDesc = '';
	
	try
	{
		journalDesc = 'Top up Distributor Commission for Distributor: ' + distributorName;
		
		//format : createJournal(totalValue, debitAccount, creditAccount, dept, location, subsidiary, jClass, invDate, desc, entity, vatCode)
		distriCommJRNL = createJournal(comTotal, COMMISSIONACCOUNTINTID,TOPUPBANKACCOINTINTID, 0, journalLocationIntID, 0, 0, usageDate, journalDesc, simPartnerIntID,0);

	}
	catch(e)
	{
		errorHandler("createJournalDisriCommission", e);		
	}

}




/**
 * create journal to transfer from PL to BS
 *
 */
function createJournalForAllocatingTopupsToCustomer()
{	
	var journalDesc = '';
	var total = 0;
	var cusReceivableAccount = '';
	var accountingPref = '';
	var cusReceivableAccountIntID = 0;
	
	try
	{
		
		journalDesc = 'Allocating the topup value to Customer: ' + cusName;
		
		//accountingPref  = nlapiLoadConfiguration('accountingpreferences');
		cusReceivableAccount = nlapiLookupField('customer', custIntID, 'receivablesaccount');
		cusReceivableAccountIntID = genericSearch('account', 'name', cusReceivableAccount);
		
		nlapiLogExecution('audit', 'cusRecievableAccountIntID', cusReceivableAccount);
		nlapiLogExecution('audit', 'cusRecievableAccountIntID', cusReceivableAccountIntID);
		//	accountingPref.getFieldValue('araccount');
		
		total = topUpValue;

		// format : createJournal(totalValue, debitAccount, creditAccount, dept, location, subsidiary, jClass, invDate, desc, entity, vatCode)
		allocatingTopupJRNL = createJournal(total, TOPUPBANKACCOINTINTID,cusReceivableAccountIntID, 0, journalLocationIntID, 0, 0, usageDate, journalDesc, custIntID,0);
		
	}
	catch(e)
	{
		errorHandler("createJournalForAllocatingTopupsToCustomer", e);		
	}

}


/**
 * create voucher commission journal
 *
 */
function createJournalVoucherCommission()
{
	var journalDesc = '';
	var total = 0;
	
	try
	{
		journalDesc = journalVoucherDesc;
		
		// work out the voucher commission
		// after removing the % sign from the percentage
		voucherCommission = parseFloat(voucherCommission)/100;
		total = topUpValue * voucherCommission;
		total = Math.round(total*100)/100;

		
		// totalValue, toAcc, fromAcc, dept, location, subsidiary, jClass, invDate,  desc, entity, vatCode
		voucherJRNL = createJournal(total, voucherCommIntID, incomeAccountIntID, 0, journalLocationIntID, 0,0, usageDate, journalDesc,0,0);
		
	}
	catch(e)
	{
		errorHandler("createJournalVoucherCommission", e);		
	}
	
}



/**
 * calculate distributor commission 
 *  version 1.0.2 - adding the additional commission where the sim partner and voucher partner is not the same for physical vouchers - AS
 *  version 1.0.3 - getting the 'voucher type' by 'name' instead of 'internal id' - AS 				
 * 	
 * version 1.0.6 - removing journal creation code from the calculateDistributorCommission function - AS
 * 				 - changing createJournalDistributorCommission() function to calculateDistributorCommission() function - AS
 */
function calculateDistributorCommission()
{

	try
	{
		// work out the distributor commission
		distComm = lookupDistributorCommissionRate();

		// version 1.0.2 , version 1.0.3
		if(voucherTypeName != 'Physical Voucher')
		{
			distribCommission = parseFloat(distComm)/100;
			comTotal = topUpValue * distribCommission;
			comTotal = Math.round(comTotal*100)/100;
		}
		else if(voucherTypeName == 'Physical Voucher' && voucherPartnerIntID > 0)
		{
			if(simPartnerIntID != voucherPartnerIntID ) 
			{
				distComm = 1;
				distribCommission = parseFloat(distComm)/100;
				comTotal = topUpValue * distribCommission;
				comTotal = Math.round(comTotal*100)/100;		
				diffSimVoucherPartners = 'T';
			}
		}
		else
		{
			errorMsg = 'The physical voucher has not been sold yet';

		}

	}
	catch(e)
	{
		errorHandler("calculateDistributorCommission", e);		
	}


}



/**
 * lookup the distributor commission rate
 *  version - 1.0.2 - remove the voucher type check for physical vouchers
 *  version 1.0.3 - getting the 'voucher type' by 'name' instead of 'internal id' 
 */
function lookupDistributorCommissionRate()
{
	var partnerRecord = null;
	var retVal = 0;
	
	try
	{
		partnerRecord = nlapiLoadRecord('partner', simPartnerIntID);
		
		distributorName = partnerRecord.getFieldValue('entityid');
		
		// 1=physical - 2=paypoint - 3=online - 4=telephone
		//voucherType = genericSearchColumnReturn('item','itemid',itemIntID,'custitem_vouchertype');	
	
		//version 1.0.2 , 1.0.3
		/*********************************
		 * checking for physical voucher commission doesn't need as it is already calculated when the Credit Notes is created.
		 * but if the sim partner and the voucher partner is not the same, then the (0.01 * topup) of commission is paid to the sim partner.
		 * This is done in the createJournalDistributorCommission() function
		 ****************************/
		
		switch(voucherTypeName)
		{
		case 'Paypoint': 
			distribCommission = partnerRecord.getFieldValue('custentity_paypointdisc');
			break;
			
		case 'On-line' :
			distribCommission = partnerRecord.getFieldValue('custentity_onlinedisc');
			break;
		
		case 'Telephone':
			distribCommission = partnerRecord.getFieldValue('custentity_telephonedisc');
			break;
			
		}
		
		retVal = distribCommission;
		
	}
	catch(e)
	{
		errorHandler("lookupDistributorCommissionRate", e);				
	}             

	return retVal;

}



/**
 * update the sim record with the customer 
 *  
 */
function updateSimRecord()
{
	try
	{
		if(custIntID!=0)
		{
			simRecord.setFieldValue('custrecord_sim_customer', custIntID);
		}
		
		simIntID = nlapiSubmitRecord(simRecord, true);
			
	}
	catch(e)
	{
		errorHandler("updateSimRecord", e);				
	}             

}



/**
 * update Daily TopUp Record
 * 
 * version 1.0.5 - adding allocatingTopupJRNL link to the daily topup record - AS
 * version 1.0.6 - setting more fields in  daily top up record - AS
 */
function updateDailyTopUpRecord()
{
	var topUpIntID = 0;
	var statusDesc = '';
	
	try
	{
		statusDesc = 'Posted Successfully';
		
		if(creditNoteIntId!=0)
		{
			topUpRecord.setFieldValue('custrecord_districomcretitnote', creditNoteIntId);
		}
		
		if(plbsJRNL!=0)
		{
			topUpRecord.setFieldValue('custrecord_balsheetjrnl', plbsJRNL);
		}
		
		if(voucherJRNL!=0)
		{
			topUpRecord.setFieldValue('custrecord_voucherjrnl',voucherJRNL);
		}

		if(distributorJRNL!=0)
		{
			topUpRecord.setFieldValue('custrecord_distributorjrnl', distributorJRNL);
		}
		
		nlapiLogExecution('debug', 'allocatingTopupJRNL', allocatingTopupJRNL);
		//version 1.0.5
		if(allocatingTopupJRNL!= 0)
		{
			topUpRecord.setFieldValue('custrecord_allocatetopupjrnl', allocatingTopupJRNL);
		}

		// update status
		//if(invIntId==0 || plbsJRNL==0 || voucherJRNL==0 || distributorJRNL==0 || allocatingTopupJRNL == 0)
		if(creditNoteIntId==0 && allocatingTopupJRNL == 0)
		{
			//statusDesc = 'Failed, please review details';
			statusDesc = errorMsg;
		}
		
		topUpRecord.setFieldValue('custrecord_status', statusDesc);				//version 1.0.6
		topUpRecord.setFieldValue('custrecord_dailyvouchertype', voucherType); 	//version 1.0.6
		topUpRecord.setFieldValue('custrecord_districompercentage', distComm);	//version 1.0.6
		topUpRecord.setFieldValue('custrecord_districomamount', comTotal);		//version 1.0.6
		topUpRecord.setFieldValue('custrecord_diffsimvoucherpartners', diffSimVoucherPartners);		//version 1.0.6
			
		topUpIntID = nlapiSubmitRecord(topUpRecord, true);
		
	}
	catch(e)
	{
		errorHandler("updateDailyTopUpRecord", e);
	}

}


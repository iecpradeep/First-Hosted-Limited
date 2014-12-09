// set debug false when deploying live
// OTHERWISE THE LOCATION WILL BE SET WRONG ON INVOICES POSTED TO LIVE


/*************************************************************************
 * Name: loadXML.js
 * Script Type: user event
 * Client: Optegra/Augentis
 * 
 * Version: 1.0.0 - 04 May 2012 - 1st release - JM
 * Version: 1.0.1 - 29 May 2012 - amended - fields removed to depersonalise - JM
 * Version: 1.0.2 - 30 May 2012 - amended - explicitly set tax code to exempt - MJL
 * Version: 1.0.3 - 08 Jun 2012 - amended - cr and dr wrong way around for journal postings - JM
 * Version: 1.0.4 - 13 Jun 2012 - amended - added more exception handling - now outputs to audit trail - MJL
 * Version: 1.0.5 - 13 Jun 2012 - amended - changed journal post to have both sides of the journal the same i.e. no class - JM
 * Version: 1.0.6 - 15 Jun 2012 - amended - adding journal post that credits def. revenue based on date criteria - MJL
 * Version: 1.0.7 - 19 Jun 2012 - amended - added additional error reporting - added a file number field - corrected def revenune date check
 * Version: 1.0.8 - 20 Jun 2012 - amended - added journal field to audit, corrected joural posts as per CF spreadsheet - created new future journal routine
 * Version: 1.0.9 - 26 Jun 2012 - amended - populated memo with invoice number so saved search will pick invoice number
 * 										  - if there are any invoice post failure, the journals posted will need to be removed
 * 										  - lookupChargeBand and apply parent of customer ID - uses custom recordset customrecord_chargebandings JM
 * 										  - date format change for reverse date - added debug flag
 * Version: 1.1.0 - 04 Jul 2012 - amended - form 137 use for invoice transactions + parameter added to script
 * Version: 1.1.1 - 11 JuL 2012 - amended - trap invalid subsidiary error: Invalid location reference 
 * 								- amended - Income Account ID changed have to use account referred to on item for the reversal rather than it being a fixed parameter
 * Version: 1.1.2 - 16 Aug 2012 - amended - add consumables value to transaction line 
 * Version: 1.1.3 - 1 Nov 2012  - amended - Accommodate new hospital 1600 London JM
 * Version: 1.1.4 - 8 Nov 2012  - amended - prevent large invoices from processing by blocking certain charge bandings - JM
 * Version: 1.1.5 - 15 Jan 2013  - amended - large invoice banding location specific correction - JM - new parameter added - custscript_chargebandsyork
 * Version: 1.1.6 - 04Jun 2013  - amended - Changed invoice form to 137 , amended the parameter and amended the comment where it was previously typed 113 (*not yet deployed in live). - SA
 * Version: 1.1.7 - 18Jun 2013  - amended - Fixed the name issue. when creating customer previously location value trying to set to incorrect field. - SA
 *
 * Author: FHL
 * Purpose: Loads XML file, splits out values and creates invoice record
 * is called by a user event called customscript_usereventxmlpost
 * 
 * Script: customscript_usereventxmlpost 
 * Deploy: customdeploy_usereventxmlpost
 *
 * fields added to transaction columns applied to sale item
 * 
 *  Anaesthetists Amount - custcol_anaesthetists_amount                                                                               
 *  Anaesthetists Name - custcol_anaesthetists_name  
 *
 *  Surgeon Amount - custcol_surgeon_amount  
 *  Surgeon Name - custcol_surgeon_name
 *
 *  Hospital - custcol_hospital
 *  
 *  also relies on custitem_consumables_cos on the item record
 *   
 *  Script parameters used:
 *  
 *  surgeonAccrualID: 'custscript_consultant_fees_accrual_intid' = 2655
 *  anaesthAccrualID: 'custscript_anaesthetists_fees_arul_intid' = 26orderSplitLines57
 *  consumerID: 'custscript_consumer_pack_accrual_intid' = 2677
 *  COSAccrualID: 'custscript_cos_accrual_intid' = 2662
 *  journalDeptID: 'custscript_journal_department_intid' = 8
 *	journalLocationID: 'custscript_location_intid' = 21
 *	
 *  journalSubsidiary: 'custscript_subsidiary_intid' = 6
 *	journalClass: custscript_class_intid' = 39
 *  invoicePayMethod: 'custscript_paymethod_intid' = 8
 *	invoiceSalesRep: 'custscript_salesrep_intid' = 24871
 *	invoicePartner: 'custscript_partner_intid' = 24870
 *	invoiceTaxCode: 'custscript_invoice_taxcode_intid' = 215
 *  
 *  invoiceIncomeAcc: 'custscript_income_acc_intid' = 2619
 *	deferredRevenueAcc: 'custscript_deferred_revenue_intid' = 2653
 *  stockgenID: 'custscript_stock_gen_intid' = 2666
 *  anaesthFeesID: 'custscript_anaesthetist_fees_intid' = 2713
 *  surgeonFeesID: 'custscript_consultant_fees_intid' = 2676
 *	medicalSuppliesID: 'custscript_medical_accrual_intid' = 2843
 *	
 *  
 *  [todo] set the customer status to Customer-won closed
 *  		this has now been defaulted to Customer-won closed so should be ok - live test required
 *  [todo] custom form id setting for optegra 137
 *  	   
 * 
 * live implementaton:
 * 		locationIntId = lookupLocationLive(msgSender);orderSplitLines
 * 		certain custom fields added by customer removed custbody3 etc
 *
 **************************************************************************/

var invoice='';
var itemObj=new Object();
var itemsArray = new Array();

var journalIntIds = new Array();
var journalCount = 0;

var itemsCount=0;
var invoiceXML='';

var invoiceRecord;
var invID;
var newCust = null;

var serviceDate='';
var lineAmount = '';
var invoiceSplit;
var invoiceElement = '';
var elementSplit;
var msgSender = '';
var msgRecipient = '';
var invoiceNo = '';
var invoiceDate = '';
var invoiceAmt = '';
var surgeonAmt = '';
var anaesthAmt = '';
var surgeonName = '';
var anaesthName = '';
var facilityAmt='';
var hospital='';
var journalNumbers='';
var errorItemCode = '';


var familyName = '';  //orderSplit = XMLSalesOrder.split('</');
var givenName = '';
var title = '';
var sex = '';
var dateOfBirth = '';
var nhsNo = 0;
var patientNo = 0;
var msgID = 0;
var auditRec=null;
var chargeBand='';
var address1='';
var address2='';
var town='';
var county='';
var postCode = '';
var worktel='';
var mobile='';
var email='';

var consumerPackCost=0;
var anaesthAccrualID=0;
var anaesthFeesID=0;
var surgeonAccrualID=0;
var surgeonFeesID=0;
var consumerID=0;
var stockgenID=0;
var COSAccrualID=0;
var medicalSuppliesID=0;

var journalDeptID=0;
var journalLocationID=0;
var journalSubsidiary=0;
var journalClass=0;

var invoicePayMethod=0;
var invoiceSalesRep=0;
var invoicePartner=0;

var invoiceTaxCode = 0;

var invoiceIncomeAcc = 0;
var deferredRevenueAcc = 0;

var sd= '';
var optegraInvoiceForm = 0;
var debug = false;				// [TODO] always check this value before deployment

var largeInvoice = false;			// 1.1.4
var largeinvoiceChargeBands = '';	// 1.1.4

var largeinvoiceChargeBandsYorkshire = '';	// 1.1.5



//processInvoiceLines();


/**
 * places XML file into array and passes
 * variables to split function  
 */
function processInvoiceLines(type)
{
	
	nlapiLogExecution('error', 'type', type);
	
	var process='FALSE';
	// load the audit record (which contains the XML payload).
	loadAuditRecord(type);

	if(auditRec.getFieldValue('custrecord_processed')=='FALSE')
	{
		loadParameters();

		// load the xml from the audit record
		invoiceXML = auditRec.getFieldValue('custrecord_payload');
		invoiceXML = UNencodeXML(invoiceXML);

		// this code only deals with the invoice files
		if(invoiceXML.indexOf('DGLInvoice') != -1)
		{
			invoiceSplit = invoiceXML.split('</');

			// get the details from the xml structure
			for(var i = 0; i < invoiceSplit.length; i++)
			{
				invoiceElement = invoiceSplit[i];
				getInvoiceHeaderDetails();
				getInvoiceLineDetails();
			}

			// 1.1.4 - trap large NHS Invoices
			if(largeInvoice==true)
			{
				nlapiLogExecution('AUDIT', 'Large NHS Invoice Not Processed', invoiceNo);
				auditTrail('LARGE', 'Invoice deemed Large NHS therefore not processed');
			}
			else
			{

				// check if the invoice already exists - do not post if it has
				if(lookupInvoice(invoiceNo)=='not found' && invoiceNo.length>0)
				{
					postInvoiceIntoNetsuite();
				}
				else
				{
					invoiceNo = 'Already posted: ' + invoiceNo; 
					nlapiLogExecution('AUDIT', 'Invoice already posted', lookupInvoice(invoiceNo));
					auditTrail('FAILED', 'Invoice already posted');
					nlapiLogExecution('AUDIT', 'Invoice already posted', invoiceXML);
				}
			}
		}
	}
}

/**
 * load the audit record which also contains the xml payload
 * @param type
 */
function loadAuditRecord(type)
{

	var recordID = nlapiGetRecordId();

	auditRec = nlapiLoadRecord('customrecord_xml_load_audit', recordID);

	nlapiLogExecution('DEBUG', 'xml', auditRec.getFieldValue('custrecord_payload'));

}


/**
 * load parameters for the script
 * 1.1.4 ignore large invoice charge bands
 * 1.1.5 introduce location specific 'ignore large invoice' logic
 */

function loadParameters()
{
	try
	{
		
		COSAccrualID = nlapiGetContext().getSetting('SCRIPT', 'custscript_cos_accrual_intid');
		medicalSuppliesID = nlapiGetContext().getSetting('SCRIPT', 'custscript_medical_accrual_intid');
		
		surgeonAccrualID = nlapiGetContext().getSetting('SCRIPT', 'custscript_consultant_fees_accrual_intid');
		surgeonFeesID = nlapiGetContext().getSetting('SCRIPT', 'custscript_consultant_fees_intid');
		anaesthAccrualID = nlapiGetContext().getSetting('SCRIPT', 'custscript_anaesthetists_fees_arul_intid');
		anaesthFeesID = nlapiGetContext().getSetting('SCRIPT', 'custscript_anaesthetist_fees_intid');

		consumerID = nlapiGetContext().getSetting('SCRIPT', 'custscript_consumer_pack_accrual_intid');
		stockgenID = nlapiGetContext().getSetting('SCRIPT', 'custscript_stock_gen_intid');
		
		journalDeptID = nlapiGetContext().getSetting('SCRIPT', 'custscript_journal_department_intid');
		journalLocationID = nlapiGetContext().getSetting('SCRIPT', 'custscript_location_intid');
		journalSubsidiary = nlapiGetContext().getSetting('SCRIPT', 'custscript_subsidiary_intid');

		journalClass = nlapiGetContext().getSetting('SCRIPT', 'custscript_class_intid');

		invoicePayMethod = nlapiGetContext().getSetting('SCRIPT', 'custscript_paymethod_intid');
		invoiceSalesRep = nlapiGetContext().getSetting('SCRIPT', 'custscript_salesrep_intid');
		invoicePartner = nlapiGetContext().getSetting('SCRIPT', 'custscript_partner_intid');

		invoiceTaxCode = nlapiGetContext().getSetting('SCRIPT', 'custscript_invoice_taxcode_intid');

		// changed from fixed parameter to look up from the item
		//invoiceIncomeAcc = nlapiGetContext().getSetting('SCRIPT', 'custscript_income_acc_intid');
		invoiceIncomeAcc = 0;
		
		deferredRevenueAcc = nlapiGetContext().getSetting('SCRIPT', 'custscript_deferred_revenue_intid');

		optegraInvoiceForm = nlapiGetContext().getSetting('SCRIPT', 'custscript_optegrainvoiceintid');
		
		// 1.1.4 - charge bands to flag as large NHS Invoices [todo] softcode as param
		// ,2,70,
		largeinvoiceChargeBands = nlapiGetContext().getSetting('SCRIPT', 'custscript_chargebandsignore');
		
		// 1.1.5 introduce location specific 'ignore large invoice' logic
		// ,2,6,7,8,9,20,21,24,25,26,30,31,32,34,35,38,39,41,43,
		largeinvoiceChargeBandsYorkshire = nlapiGetContext().getSetting('SCRIPT', 'custscript_chargebandsyork');
		
		
	}
	catch(e)
	{

		errorHandler(e);
		auditTrail('FAILED', 'Cannot create invoice ' + getErrorMessage(e));

	}
}





/**
 * post invoice details to netsuite
 * 1.0.9 remove journals for failures
 * 1.1.1 amended - trap invalid subsidiary error: Invalid location reference
 */
function postInvoiceIntoNetsuite()
{

	var entity='';
	var item='';
	var auditDesc='Success';
	var dateInvoice = null;
	var errorMessage = '';


	// location (clinic) is based on the message sender name in the DGL XML invoice
	
	if(debug == true)
	{
		journalLocationID = lookupLocation(msgSender);
	}
	else
	{
		journalLocationID = lookupLocationLive(msgSender);
	}
	

	try
	{

		// set values for the invoice header
		invoiceHeader();

		for(var x=0; x<=itemsArray.length-1;x++)
		{

			// set details for the invoice detail line
			invoiceDetailLine(x);

			// post journals for surgeon and anaesthnatist
			journalPosts();

		}

		// submit header and detail records
		invID = nlapiSubmitRecord(invoiceRecord, true);
		nlapiLogExecution('AUDIT', 'success', 'invoice ' + invoiceNo);

		auditTrail('TRUE', 'Posted');
	}
	catch(e)
	{
		
		// [TODO] change to deal with error code instead of desc
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'failure', 'failed to post invoice');
		errorMessage = getErrorMessage(e);
		
		if (errorMessage.indexOf('Please choose an item to add') > 0)
		{
			errorMessage = 'Item Code(s) ' + errorItemCode + ' do not exist'; 
		}

		if (errorMessage.indexOf('Invalid location reference') > 0)
		{
			errorMessage = 'This Patient ID: ' + patientNo + ' belongs to a different subsidiary'
		}

		journalNumbers = 'Journals removed ' + journalNumbers;

		auditTrail('FAILED', errorMessage);

		// backout any journals posted 1.0.9
		removeJournals();


		
	}             

}


/**
 * set invoice header details
 *   
 */
function invoiceHeader()
{


	invoiceRecord = nlapiCreateRecord("invoice");
	
	// set internal ID for Optegra form 137
	invoiceRecord.setFieldValue('customform', optegraInvoiceForm); 
	
	invoiceRecord.setFieldValue('tranid', invoiceNo);
	invoiceRecord.setFieldValue('recordtype', 'invoice');

//	invoiceRecord.setFieldValue('department',journalDeptID);
	invoiceRecord.setFieldValue('location',journalLocationID);
//	invoiceRecord.setFieldValue('class',journalClass);

	invoiceRecord.setFieldValue('description', 'DGL auto post invoice: ' + invoiceNo);
	invoiceRecord.setFieldValue('memo', 'DGL auto post invoice: ' + invoiceNo);

	
	if(invoicePayMethod!=0)
	{
		//invoiceRecord.setFieldValue('custbody1',invoicePayMethod);		// live modification 03/7/2012
		invoiceRecord.setFieldValue('salesrep',invoiceSalesRep);
		invoiceRecord.setFieldValue('partner',invoicePartner);
	}

//	if(journalSubsidiary!=0)
//	{
//	invoiceRecord.setFieldValue('subsidiary',journalSubsidiary);
//	}



	dateInvoice = reverseDate(invoiceDate);

	invoiceRecord.setFieldValue('trandate', dateInvoice);



	// lookup customer, if it does not exist, create it
	entity = lookupCustomer(patientNo);

	if(entity.length==0)
	{
		entity = createCustomer();                
	}

	invoiceRecord.setFieldValue('entity', entity);              

}


/**
 * set invoice line item details
 * 1.1.2 - 16/8/2012 - add consumable pack cost to tran
 */

function invoiceDetailLine(x)
{
	itemObj = itemsArray[x]; 
	
	item = lookupItem(itemObj.code); // lookup item
	
	invoiceRecord.selectNewLineItem('item');
	invoiceRecord.setCurrentLineItemValue('item', 'item', item);      
	invoiceRecord.setCurrentLineItemValue('item', 'description', itemObj.desc);
	invoiceRecord.setCurrentLineItemValue('item', 'amount', itemObj.serviceAmount);

	invoiceRecord.setCurrentLineItemValue('item', 'taxcode', invoiceTaxCode);

	invoiceRecord.setCurrentLineItemValue('item', 'custcol_surgeon_amount', itemObj.surgeonAmount);

	nlapiLogExecution('DEBUG', 'AM', "" + itemObj.anaesthetistAmount);

	invoiceRecord.setCurrentLineItemValue('item', 'custcol_anaesthetists_amount', itemObj.anaesthetistAmount);
	invoiceRecord.setCurrentLineItemValue('item', 'custcol_surgeon_name', itemObj.surgeonName);
	invoiceRecord.setCurrentLineItemValue('item', 'custcol_anaesthetists_name', itemObj.anaesthName);
	invoiceRecord.setCurrentLineItemValue('item', 'custcol_hospital', itemObj.hospital);
	invoiceRecord.setCurrentLineItemValue('item', 'custcol_servicedate', itemObj.serviceDate);

	invoiceRecord.setCurrentLineItemValue('item', 'custcol_consumables', consumerPackCost);		// 1.1.2 add consumable pack cost to tran
	
	
	
	serviceDate = itemObj.serviceDate;
	lineAmount = itemObj.serviceAmount;

	invoiceRecord.commitLineItem('item');
}

/**
 * post journals for surgeon and anaesthnatist
 * zzz fixed nominal codes require revision  
 * 1.0.6 added journal post for deferred revenue
 */
function journalPosts()
{

	var today = new Date();
	var desc='';

	var objServDate = nlapiStringToDate(serviceDate);
	
	// journal for deferred revenue - this is where the procedure happens in the future
		
	if(objServDate > today)
	{
		nlapiLogExecution('DEBUG', 'future post', 'future post');

		journalPostsFuture();
	}
	else	
	{
		nlapiLogExecution('DEBUG', 'not future post', 'not future post');

		// journal for surgeon
		if(itemObj.surgeonAmount != 0)
		{
			desc = 'Surgeon commission for invoice ' + invoiceNo;
			createJournal(itemObj.surgeonAmount,  surgeonFeesID,surgeonAccrualID, journalDeptID, journalLocationID, journalSubsidiary,journalClass, invoiceDate, desc);
		}

		//journal for anaesthnatist
		if(itemObj.anaesthetistAmount !=0)
		{
			desc = 'Anaesthetist commission for invoice ' + invoiceNo;
			createJournal(itemObj.anaesthetistAmount, anaesthFeesID, anaesthAccrualID, journalDeptID,journalLocationID, journalSubsidiary,journalClass, invoiceDate, desc);
		}

		//journal for consumable pack
		if(consumerPackCost !=0)
		{
			desc = 'Consumable pack for invoice ' + invoiceNo;
			createJournal(consumerPackCost, consumerID, stockgenID, journalDeptID,journalLocationID, journalSubsidiary, journalClass, invoiceDate, desc);
			consumerPackCost=0;
		}

		nlapiLogExecution('AUDIT', 'Journals posted', journalNumbers);
	}
	
}


/**
 * post journals for surgeon and anaesthnatist etc
 *   
 * 1.0.8 - deals with future posts 
 */
function journalPostsFuture()
{

	var desc='';
	
	// journal for surgeon
	if(itemObj.surgeonAmount != 0)
	{
		desc = 'Surgeon commission (future) for invoice ' + invoiceNo;
		createJournal(itemObj.surgeonAmount, COSAccrualID, surgeonAccrualID, journalDeptID, journalLocationID, journalSubsidiary,journalClass, invoiceDate, desc);
	}

	//journal for anaesthnatist
	if(itemObj.anaesthetistAmount !=0)
	{
		desc = 'Anaesthetist commission (future) for invoice ' + invoiceNo;
		createJournal(itemObj.anaesthetistAmount, COSAccrualID, anaesthAccrualID, journalDeptID,journalLocationID, journalSubsidiary,journalClass, invoiceDate, desc);
	}
	
	//journal for consumable pack
	if(consumerPackCost !=0)
	{
		desc = 'Consumable pack (future) for invoice ' + invoiceNo;
		createJournal(consumerPackCost, COSAccrualID, medicalSuppliesID, journalDeptID,journalLocationID, journalSubsidiary, journalClass, invoiceDate, desc);
		consumerPackCost=0;
	}
	
	desc = 'Deferred revenue for invoice ' + invoiceNo;
	createJournal(lineAmount, invoiceIncomeAcc, deferredRevenueAcc, journalDeptID,journalLocationID, journalSubsidiary, journalClass, invoiceDate, desc);

	nlapiLogExecution('AUDIT', 'Journals (future) posted', journalNumbers);
}



/**
 * get invoice header details
 * 1.0.9 memo populated
 * 1.1.0 live modification made 4/7/2012 - use charge band rather than chargeband name
 */
function getInvoiceHeaderDetails()
{

	//msg details
	if(invoiceElement.indexOf('<MsgID>') != -1)
	{
		msgID = splitOutValue(invoiceElement, 'MsgID');
	}

	if(invoiceElement.indexOf('<MsgSenderLicenseName>') != -1)
	{
		msgSender = splitOutValue(invoiceElement, 'MsgSenderLicenseName');
	}

	if(invoiceElement.indexOf('<MsgRecipient>') != -1)
	{
		msgRecipient = splitOutValue(invoiceElement, 'MsgRecipient');
	}

	//Invoice details
	if(invoiceElement.indexOf('<InvoiceNo>') != -1)
	{
		invoiceNo = splitOutValue(invoiceElement, 'InvoiceNo');
	}

	if(invoiceElement.indexOf('<InvoiceDate>') != -1)
	{
		invoiceDate = splitOutValue(invoiceElement, 'InvoiceDate');
	}

	if(invoiceElement.indexOf('<InvoiceTotal>') != -1)
	{
		invoiceAmt = splitOutValue(invoiceElement, 'InvoiceTotal');
	}

	// live modification - need to use the charge band number instead of the band name - 1.1.0
	// 1.1.4 - check for large NHS Invoice
	if(invoiceElement.indexOf('<ChargeBand>') != -1)
	{
		chargeBand = splitOutValue(invoiceElement, 'ChargeBand');
		checkIfInvoiceIsLargeNHS();
	}
	//if(invoiceElement.indexOf('<ChargeBandName>') != -1)
	//{
	//	chargeBand = splitOutValue(invoiceElement, 'ChargeBandName');
	//}


	//Patient detail
	if(invoiceElement.indexOf('<FamilyName>') != -1)
	{
		familyName = splitOutValue(invoiceElement, 'FamilyName');
	}

	if(invoiceElement.indexOf('<GivenName>') != -1)
	{
		givenName = splitOutValue(invoiceElement, 'GivenName');
	}

	if(invoiceElement.indexOf('<Title>') != -1)
	{
		title = splitOutValue(invoiceElement, 'Title');
	}

	if(invoiceElement.indexOf('<Sex>') != -1)
	{
		sex = splitOutValue(invoiceElement, 'Sex');
	}

	if(invoiceElement.indexOf('<DateOfBirth>') != -1)
	{
		dateOfBirth = splitOutValue(invoiceElement, 'DateOfBirth');
		nsDateOfBirth = convertToNSDate(dateOfBirth);
	}

	// address

	if(invoiceElement.indexOf('<Address1>') != -1)
	{
		address1 = splitOutValue(invoiceElement, 'Address1');
	}
	if(invoiceElement.indexOf('<Address2>') != -1)
	{
		address2 = splitOutValue(invoiceElement, 'Address2');
	}
	if(invoiceElement.indexOf('<Town>') != -1)
	{
		town = splitOutValue(invoiceElement, 'Town');
	}
	if(invoiceElement.indexOf('<County>') != -1)
	{
		county = splitOutValue(invoiceElement, 'County');
	}

	if(invoiceElement.indexOf('<Email>') != -1)
	{
		email = splitOutValue(invoiceElement, 'Email');
	}

	if(invoiceElement.indexOf('<WorkTel>') != -1)
	{
		worktel = splitOutValue(invoiceElement, 'WorkTel');
	}
	if(invoiceElement.indexOf('<Mobile>') != -1)
	{
		mobile = splitOutValue(invoiceElement, 'Mobile');
	}


	if(invoiceElement.indexOf('<Postcode>') != -1)
	{
		postCode = splitOutValue(invoiceElement, 'Postcode');
	}

	if(invoiceElement.indexOf('<NHSNumber>') != -1)
	{
		nhsNo = splitOutValue(invoiceElement, 'NHSNumber');
	}

	if(invoiceElement.indexOf('<PatientNumber>') != -1)
	{
		patientNo = splitOutValue(invoiceElement, 'PatientNumber');
	}
	
	// check if the patient number is blank - if so use the family name
	
	if(patientNo.length<4)
	{
		patientNo = familyName;
		givenName = familyName;
	}

}

/**
 * check and set for large NHS Invoice
 * 1.1.4 - added - check for large NHS Invoice
 * 1.1.5 - amended - introduce location specific for 'ignore invoices'
 * 
 */

function checkIfInvoiceIsLargeNHS()
{
	var cbCheck = '';
	
	cbCheck = "," + chargeBand + ",";
	
	
	if(msgSender=='Optegra Yorkshire')
	{
		if(largeinvoiceChargeBandsYorkshire.indexOf(cbCheck) != -1)
		{
			largeInvoice = true;
		}
	}
	else
	{
		if(largeinvoiceChargeBands.indexOf(cbCheck) != -1)
		{
			largeInvoice = true;
		}
	}
	

}


/**
 * get invoice header details
 *   
 */
function getInvoiceLineDetails()
{

	//========================================
	// items
	//========================================
	if(invoiceElement.indexOf('<ServiceCode>')!=-1)
	{
		itemObj=new Object();
		itemObj.code= splitOutValue(invoiceElement,'ServiceCode');
	}
	if(invoiceElement.indexOf('<Description>')!=-1)
	{
		itemObj.desc = splitOutValue(invoiceElement,'Description');
	}
	if(invoiceElement.indexOf('<ServiceTotal>')!=-1)
	{
		itemObj.serviceAmount = splitOutValue(invoiceElement,'ServiceTotal');
	}

	if(invoiceElement.indexOf('<SurgeonAmount>')!=-1)
	{
		itemObj.surgeonAmount = splitOutValue(invoiceElement,'SurgeonAmount');
	}

	if(invoiceElement.indexOf('<ServiceDate>')!=-1)
	{
		itemObj.serviceDate = splitOutValue(invoiceElement,'ServiceDate');
		itemObj.serviceDate = reverseDate(itemObj.serviceDate);
	}

	if(invoiceElement.indexOf('<SurgeonName>')!=-1)
	{
		itemObj.surgeonName = splitOutValue(invoiceElement,'SurgeonName');
	}
	if(invoiceElement.indexOf('<AnaesthetistAmount>')!=-1)
	{
		itemObj.anaesthetistAmount = splitOutValue(invoiceElement,'AnaesthetistAmount');
	}
	if(invoiceElement.indexOf('<AnaesthetistName>')!=-1)
	{
		itemObj.anaesthName = splitOutValue(invoiceElement,'AnaesthetistName');
	}

	if(invoiceElement.indexOf('<FacilityAmount>')!=-1)
	{
		itemObj.facilityAmt = splitOutValue(invoiceElement,'FacilityAmount');
	}


	if(invoiceElement.indexOf('<Hospital>')!=-1)
	{
		itemObj.hospital = splitOutValue(invoiceElement,'Hospital');
		itemsArray[itemsCount] = itemObj;
		itemsCount = itemsCount + 1;
	}

}


/**
 * splits out values and returns 
 */
function splitOutValue(element, elementTag)
{
	var retValue = '';
	var splitArray;

	//if element is not empty...
	if(element.indexOf(elementTag) != -1)
	{
		//...remove tags and return value
		element = element + '</' + elementTag + '>';
		splitArray = element.split(elementTag);

		retValue = splitArray[1];
		retValue = '' + retValue.substring(1, retValue.length - 2).toString();
	}
	return retValue;
}

/**
 * loads XML from repository
 */
function loadXML(xmlFile)
{
	var output = '';
	var response = nlapiRequestURL(xmlFile, null, null);
	var output = response.getBody();

	return output;
}

/**
 * convert reverse date ie yyyymmdd date string to NS date
 */
function convertToNSDate(dateOfBirth)
{
	var retVal = '';
	var year = '';
	var month = '';
	var day = '';
	var dateObj = '';

	year = dateOfBirth.substring(0, 4);
	month = dateOfBirth.substring(4, 2);
	day = dateOfBirth.substring(6, 2);

	dateObj = new Date(year, month, day);

	retVal = nlapiDateToString(dateObj);

	return retVal;
}

/**
 * create journal entries for consultants
 * 1.0.3 - reversed the from and too accounts as DR and CR were the wrong way around
 * 1.0.5 - added set class field 
 */
function createJournal(totalValue, toAcc, fromAcc, dept, location, subsidiary, jClass, invDate,  Desc)
{
	var dateInvoice = null;
	var journal = '';
	//var id = null;

	try
	{
		// get the journal record
		var journalRecord = nlapiCreateRecord('journalentry');

		// get todays date and put the soDate into a new variable
		var today = nlapiDateToString(new Date());

		//convert everything to a float as we are dealing with numbers
		totalValue = parseFloat(totalValue);
		fromAcc = parseFloat(fromAcc);
		toAcc = parseFloat(toAcc);


		dateInvoice = reverseDate(invDate);

		journalRecord.setFieldValue('trandate',dateInvoice);

		journalRecord.setFieldValue('custbody_customerdepartment', dept);
		journalRecord.setFieldValue('reversaldefer','F');
		journalRecord.setFieldValue('approved','T');

		if(subsidiary != 0)
		{
			journalRecord.setFieldValue('subsidiary',subsidiary);
		}

		// credit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',fromAcc);
		journalRecord.setCurrentLineItemValue('line','credit',parseFloat(totalValue));
		journalRecord.setCurrentLineItemValue('line','department',dept);
		journalRecord.setCurrentLineItemValue('line','location',location);
		journalRecord.setCurrentLineItemValue('line','class',jClass);
		journalRecord.setCurrentLineItemValue('line','memo','Journal automatically created Invoice XML Load. ' + Desc);
		journalRecord.commitLineItem('line');   
		
		// debit
		journalRecord.selectNewLineItem('line');
		journalRecord.setCurrentLineItemValue('line','account',toAcc);
		journalRecord.setCurrentLineItemValue('line','debit',parseFloat(totalValue));
		journalRecord.setCurrentLineItemValue('line','department',dept);
		journalRecord.setCurrentLineItemValue('line','location',location);
		journalRecord.setCurrentLineItemValue('line','class',jClass);
		journalRecord.setCurrentLineItemValue('line','memo','Journal automatically created Invoice XML Load. ' + Desc);
		journalRecord.commitLineItem('line');                  

		id = nlapiSubmitRecord(journalRecord,true);
		nlapiLogExecution('AUDIT', 'Posted journal', Desc);
		
		journal = nlapiLookupField('journalentry',id,'tranid');		
		journalNumbers = journalNumbers + ' ' + journal;
		
		// store the internal ID's for the journals in case we have to delete then later i.e. if the invoice fails
		journalIntIds[journalCount] = id;		// zero based
		journalCount = journalCount + 1;

		
	}
	catch(e)
	{
		errorHandler(e);
	}             

	id=0;
	return id;
} //function createJournal


/**
 * looks up customer int ID from entity ID
 */
function lookupCustomer(companyID)
{
	var internalID='';

	// Arrays
	var customerSearchFilters = new Array();
	var customerSearchColumns = new Array();

	try
	{
		//search filters                  
		customerSearchFilters[0] = new nlobjSearchFilter('entityid', null, 'is',companyID);                          

		// search columns
		customerSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var customerSearchResults = nlapiSearchRecord('customer', null, customerSearchFilters, customerSearchColumns);

		if(customerSearchResults!=null)
		{
			if(customerSearchResults.length>0)
			{
				var customerSearchResult = customerSearchResults[ 0 ];
				internalID = customerSearchResult.getValue( 'internalid' );
			}
		}
	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', "Cannot get customer " + getErrorMessage(e));
	}             

	return internalID;

}



/**
 * create a customer
 * 1.0.9 - lookup charge band
 * 1.1.0 - status required [todo] customer closed won
 */

function createCustomer()
{
	var custID=0;
	var name='';
	var locationIntId = 0;
	var parentCustIntId = 0;
	var locationName='';

	try
	{
		newCust = nlapiCreateRecord('customer');

		//name = title + ' ' + givenName + ' ' + familyName;

		//Set the title field on the Customer record
		newCust.setFieldValue('entityid', patientNo);
		newCust.setFieldValue('salutation', title);
		newCust.setFieldValue('lastname', familyName);
		newCust.setFieldValue('firstname', givenName);
		newCust.setFieldValue('autoname', 'F');

		newCust.setFieldValue('subsidiary', journalSubsidiary);
		
		// zzz ALTER ALTER
		//newCust.setFieldValue('custentity3', journalLocationID); // live modification 03/7/2012
		//1.1.7 SA - Fixed field name
		newCust.setFieldValue('custentity_customerlocation', journalLocationID); 
		
		newCust.setFieldValue('isperson', 'T');

		
		nlapiLogExecution('DEBUG', 'before charge band lookup', msgSender);
		

		// fields removed JM ver 1.0.1
		//newCust.setFieldValue('email', email);
		//newCust.setFieldValue('phone', mobile);

		//setCustomerAddress();
		
		// 1.0.9 - lookup charge band - set the parent customer id from this
	
		if(debug == true)
		{
			locationIntId = lookupLocation(msgSender);
		}
		else
		{
			locationIntId = lookupLocationLive(msgSender);
		}


		locationName = nlapiLookupField('location',locationIntId,'name');
		
		nlapiLogExecution('DEBUG', 'charge band lookup', locationName + ':' + chargeBand);
		
		parentCustIntId = lookupChargeBand(chargeBand,locationName);
		
		if(parentCustIntId!=0)
		{
			newCust.setFieldValue('parent', parentCustIntId);
		}
		
		// [todo] set the customer status to Customer-won closed - test
		//newCust.setFieldText('entitystatus', 'CUSTOMER-Closed Won');
		// this has now been defaulted to Customer-won closed so should be ok - live test required
		

		custID = nlapiSubmitRecord(newCust, true);

	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot create customer ' + getErrorMessage(e));
	}             

	return custID;

}
/**
 * Populate address sublist with customer address
 * @param newCust
 * @returns {Boolean}
 */
function setCustomerAddress()
{
	var retVal = false;

	try
	{
		newCust.selectNewLineItem('addressbook');
		//newCust.setCurrentLineItemValue('addressbook', 'addressee', title + ' ' + familyName + ' ' + givenName);
		newCust.setCurrentLineItemValue('addressbook', 'phone', worktel);
		newCust.setCurrentLineItemValue('addressbook', 'addr1', address1);
		newCust.setCurrentLineItemValue('addressbook', 'addr2', address2);
		newCust.setCurrentLineItemValue('addressbook', 'city', town);
		newCust.setCurrentLineItemValue('addressbook', 'zip', postCode);
		newCust.commitLineItem('addressbook');

		retVal = true;
	}
	catch(e)
	{
		nlapiLogExecution('ERROR', 'Error setting customer address', e.message);
	}
	return retVal;
}

/**
 * exception email
 */

function exceptioneMail()
{

	//var sendEmail = nlapiSendEmail(userId, 'kwolfe@netsuite.com', 'Purhase Order Notification', 'Purchase order approved', null, null, 'transaction', null);

}



/**
 * update the audit record to indicate success or failure of a posting
 * @param success
 * @returns {Number}
 */
function auditTrail(success, status)
{

	var auditID=0;
	var desc='';

	try
	{

		desc = 'XML Invoice: ' + invoiceNo;

		auditRec.setFieldValue('custrecord_description', desc);
		auditRec.setFieldValue('custrecord_processed', success);
		auditRec.setFieldValue('custrecord_status', status);
		auditRec.setFieldValue('custrecord_fileidentifier', '_' + msgID + '.invoice');
		auditRec.setFieldValue('custrecord_journals',journalNumbers);
		
		
		nlapiLogExecution('error', 'invoiceNo', 'invoiceNo');

		auditRec.setFieldValue('custrecord_invoicenumber',invoiceNo);
		
		
		
		auditID = nlapiSubmitRecord(auditRec, true);
		nlapiLogExecution('DEBUG', 'POSTED AUDIT UPDATE', 'AUDIT UPDATE');

	}
	catch(e)
	{
		errorHandler(e);
	}             

	return auditID;

}

/**
 * @param e
 */
function errorHandler(e)
{
	var errorMessage = '';

	errorMessage = getErrorMessage(e);
	nlapiLogExecution('ERROR', 'unexpected error', e.toString());

}

function getErrorMessage(e)
{
	var retVal='';

	if (e instanceof nlobjError)
	{
		retVal =  e.getCode() + '\n' + e.getDetails();
	}
	else
	{
		retVal = e.toString();
	}
	
	return retVal;
}

/**
 * fix internal location ID based on Hospital
 * [todo] this will need to be changed to be a lookup
 * 1.1.3 - London added 
 */
function lookupLocation(hospitalDesc)
{
	/*
	?Optegra Birmingham?
	?Optegra Guildford?
	?Optegra Solent?
	?Optegra Manchester?
	?Optegra Yorkshire? */

	nlapiLogExecution('DEBUG', 'lookuplocation', hospitalDesc);
	
	try 
	{
		var hospitalInternalID=0;
		hospitalInternalID = 23;

		if(hospitalDesc=='Optegra Birmingham')
		{
			hospitalInternalID=23;
		}
		if(hospitalDesc=='Optegra Guildford')
		{
			hospitalInternalID=21;
		}
		if(hospitalDesc=='Optegra Solent')
		{
			hospitalInternalID=17;
		}
		if(hospitalDesc=='Optegra Manchester')
		{
			hospitalInternalID=22;
		}
		if(hospitalDesc=='Optegra Yorkshire')
		{
			hospitalInternalID=19;
		}
		if(hospitalDesc=='Optegra Leeds')
		{
			hospitalInternalID=26;
		}
		
		// 1.1.3 - London added
		if(hospitalDesc=='Optegra London')
		{
			hospitalInternalID=31;
		}


		return hospitalInternalID;
	}

	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot get location');
	}
}



/**
 * fix internal location ID based on Hospital
 * [todo] this will need to be changed to be a lookup
 * 1.1.3 - London added 
 */
function lookupLocationLive(hospitalDesc)
{
	/*
	?Optegra Birmingham?
	?Optegra Guildford?
	?Optegra Solent?
	?Optegra Manchester?
	?Optegra Yorkshire? */

	try 
	{
		var hospitalInternalID=0;
		hospitalInternalID = 24;

		if(hospitalDesc=='Optegra Birmingham')
		{
			hospitalInternalID=24;
		}
		if(hospitalDesc=='Optegra Guildford')
		{
			hospitalInternalID=17;
		}
		if(hospitalDesc=='Optegra Solent')
		{
			hospitalInternalID=19;
		}
		if(hospitalDesc=='Optegra Manchester')
		{
			hospitalInternalID=22;
		}
		if(hospitalDesc=='Optegra Yorkshire')
		{
			hospitalInternalID=20;
		}
		if(hospitalDesc=='Optegra Leeds')
		{
			hospitalInternalID=21;
		}
		
		// 1.1.3 - London added
		if(hospitalDesc=='Optegra London')
		{
			hospitalInternalID=26;
		}

		return hospitalInternalID;
	}

	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot get location');
	}
}




/**
 * lookupinvoice
 */
function lookupInvoice(invoiceNo)
{
	var internalID='';

	// Arrays
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();

	try
	{
		//search filters                  
		invoiceSearchFilters[0] = new nlobjSearchFilter('tranid', null, 'is',invoiceNo);                          
		invoiceSearchFilters[1] = new nlobjSearchFilter('mainline', null, 'is', 'T');                      

		// return columns
		invoiceSearchColumns[0] = new nlobjSearchColumn('internalid');

		// perform search
		var itemSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);

		internalID='not found';
		
		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
			}
		}
	}
	catch(e)
	{
		internalID='not found';
		errorHandler(e);
	}     	      

	return internalID;
}


/**
 * lookup charge band
 * example usage: lookupChargeBand(2,'1400 Manchester');
 * 1.0.9 added
 */
function lookupChargeBand(band, clinicName)
{
	var customerID=0;

	// Arrays
	var cbSearchFilters = new Array();
	var cbSearchColumns = new Array();

	try
	{
		
		nlapiLogExecution('DEBUG', 'looking up charge band', band + ':' + clinicName);
		
		
		//search filters                  
		cbSearchFilters[0] = new nlobjSearchFilter('custrecord_band', null, 'equalto',band);                          
		cbSearchFilters[1] = new nlobjSearchFilter('custrecord_clinic', null, 'is', clinicName);                      

		// return columns
		cbSearchColumns[0] = new nlobjSearchColumn('custrecord_customer');

		// perform search
		var cbSearchResults = nlapiSearchRecord('customrecord_chargebandings', null, cbSearchFilters, cbSearchColumns);

		
		if(cbSearchResults!=null)
		{
			if(cbSearchResults.length>0)
			{
				var cbSearchResult = cbSearchResults[ 0 ];
				customerID= cbSearchResult.getValue('custrecord_customer');
				nlapiLogExecution('DEBUG', 'customer found', customerID);
			}
		}
		else
		{
			nlapiLogExecution('AUDIT', 'Charge Band not found', band + ':' + clinicName);
			customerID = 0;
		}
	}
	catch(e)
	{
		customerID=0;
		errorHandler(e);
	}     	      

	return customerID;
}


/**
 * convert xml converted characters back
 * @param xml
 * @returns {String}
 */
function UNencodeXML(xmldecode)
{
	var retVal='';

	xmldecode = xmldecode.replace(/&amp;/g,'&');
	xmldecode = xmldecode.replace(/&lt;/g,'<');
	xmldecode = xmldecode.replace(/&gt;/g,'>');
	xmldecode = xmldecode.replace(/&quot;/g,'\'');
//	xmlz = xmlz.replace('&apos;',''');
	xmldecode = xmldecode.replace(/&#xD;/g,'\r');
	xmldecode = xmldecode.replace(/&#xA;/g,'\n');  

	retVal = xmldecode;

	return retVal;
}

/**
 * reverse date i.e. 20120517 to 17.05.2012
 * 1.0.9 - remove leading zeros from days and months or nlapistringtodate fails
 */

function reverseDate(dateStr)
{

	var retVal = null; 
	var day='';
	var month='';
	var year = '';
	var newDate='';

	year = dateStr.substring(0,4);
	month = dateStr.substring(4,6);
	day = dateStr.substring(6,8);
	
	if(day.substring(0,1)=='0')
	{
		day = day.substring(1,2);
	}
	if(month.substring(0,1)=='0')
	{
		month = month.substring(1,2);
	}
	
	newDate = day +"." + month + "." + year;

	nlapiLogExecution('DEBUG', 'Date string', dateStr);
	nlapiLogExecution('DEBUG', 'Date string', newDate);

	retVal =  newDate;

	nlapiLogExecution('DEBUG', 'Date object', retVal.toString());

	return retVal;

}


/**
 * remove journals where the invoice fails to post
 * 1.0.9 remove journals for failures
 */

function removeJournals()
{
	
	try
	{
		for(var x=0; x<=journalIntIds.length-1;x++)
		{
			var id = nlapiDeleteRecord('journalentry', journalIntIds[x]);
		}

		nlapiLogExecution('AUDIT', 'Journals removed: ', journalNumbers);
	}

	catch(e)
	{
		errorHandler(e);
		nlapiLogExecution('AUDIT', 'Journals removal failed: ', journalNumbers);

	}             

}


/**
 * looks up item internal ID from item name
 * 1.0.5 class looked up from item
 * 1.1.1 changed income_acc_intid to be looked up from item rather than being a fixed parameter
 */
function lookupItem(itemID)
{
	var internalID='';

	// Arrays
	var itemSearchFilters = new Array();
	var itemSearchColumns = new Array();

	try
	{
		//search filters 
		itemSearchFilters[0] = new nlobjSearchFilter('itemid', null, 'is', itemID);                          

		// return columns
		itemSearchColumns[0] = new nlobjSearchColumn('internalid');
		itemSearchColumns[1] = new nlobjSearchColumn('custitem_consumables_cos');
		itemSearchColumns[2] = new nlobjSearchColumn('class');
		itemSearchColumns[3] = new nlobjSearchColumn('incomeaccount');

		// perform search
		var itemSearchResults = nlapiSearchRecord('item', null, itemSearchFilters, itemSearchColumns);

		consumerPackCost = '';
		journalClass = '';

		if(itemSearchResults!=null)
		{
			if(itemSearchResults.length>0)
			{
				var itemSearchResult = itemSearchResults[ 0 ];
				internalID = itemSearchResult.getValue('internalid');
				consumerPackCost = itemSearchResult.getValue('custitem_consumables_cos');
				journalClass = itemSearchResult.getValue('class');
				invoiceIncomeAcc = itemSearchResult.getValue('incomeaccount'); 	// 1.1.1 get from item rather than fixed param 
				
				
			}
		}
		else
		{
			errorItemCode = errorItemCode + itemID + ' ';
		}

	}
	catch(e)
	{
		errorHandler(e);
		auditTrail('FAILED', 'Cannot find item ' + getErrorMessage(e));
	}             


	return internalID;

}




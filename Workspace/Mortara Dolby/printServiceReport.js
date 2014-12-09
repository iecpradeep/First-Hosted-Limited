/********************************************************************************************************************
 * Name: 		Print Service Report
 * Script Type: Suitelet
 * Client: 		Mortara Dolby
 * 
 * Version: 	1.0.0 - 2 May 2012 - 1st release - MAL
 * 				1.0.1 - 13 July 2012 AM
 * 				Display delivery address instead of billing (removed as of 1.0.26 - MJL)
 * 				address and alter table heading lengths to 100%
 * 				1.0.2 - 03 Oct 2012 - moved Equip. Detail field before Work Detail field - MJL
 * 				1.0.3 - 03 Oct 2012 - removed extra details from Contact field - MJL
 * 				1.0.4 - 03 Oct 2012 - added Contact email and telephone no. from Case - MJL
 * 				1.0.5 - 03 Oct 2012 - added Engineer email and telephone no. from Employee record - MJL
 * 				1.0.6 - 03 Oct 2012 - added Contract number from Case record - MJL
 * 				1.0.7 - 05 Oct 2012 - added Visit Schedule field - MJL
 * 				1.0.8 - 05 Oct 2012 - added Visit Reason field - MJL
 * 				1.0.9 - 05 Oct 2012 - added Case Subject field - MJL
 * 				1.0.10 - 05 Oct 2012 - added Cycle Count + Software Revision field to Equipment Detail section - MJL
 * 				1.0.11 - 05 Oct 2012 - rearrangement of report layout - MJL
 * 				1.0.12 - 05 Oct 2012 - added company details to report footer - MJL
 *  			1.0.13 - 24 Oct 2012 - added border to Service Detail section - MJL
 *  			1.0.14 - 24 Oct 2012 - parsed as float to fix ".00" error - MJL
 *  			1.0.15 - 31 Oct 2012 - prevented Comment lines giving NaN values - MJL
 *              1.0.16 - 18 Feb 2013 - moved company address to top of the report - MJL
 *              1.0.17 - 18 Feb 2013 - get company address from Company Information screen - MJL
 *              1.0.18 - 18 Feb 2013 - moved case no. to top right corner - MJL
 *              1.0.19 - 18 Feb 2013 - changed from mobile phone field to office phone field - MJL
 *              1.0.20 - 18 Feb 2013 - default certain fields to N/A if empty - MJL
 *              1.0.21 - 18 Feb 2013 - changed Subject label to Job - MJL
 *              1.0.22 - 18 Feb 2013 - removed Cycle Count field - MJL
 *              1.0.23 - 18 Feb 2013 - added Electrical Safety Test Done? field - MJL
 *              1.0.24 - 18 Feb 2013 - added Engineer Signature - MJL
 *              1.0.25 - 20 Feb 2013 - moved VAT info from footer to below company address - MJL
 *              1.0.26 - 28 Feb 2013 - get selected shipping address text from customer - MJL
 *              1.0.27 - 28 Feb 2013 - layout changes - cosmetic - MJL
 *
 * Author: 		Michael A Lewis, Matthew J Lawrence, FHL
 * Purpose: 	Prints the PDF layout for the Service Report
 * 
 * Suitelet: 	printServiceReport
 * Deployment: 	Does not need to be deployed
 ********************************************************************************************************************/

//Global Variables
//case variables
var caseID = null;
var caseRecord = null;

//Field variables
var comments = null; // Comments
var company = null; // Company
var CompanyID = 0;// Company internal ID
var contact = null; // Company contact
var cer = null; // CER
var cerDetail = null; // CER Detail
var workDetail = null; // Work Detail
//var salesOrder = null; // Sales Order
var chargeability = null; // Chargeability
var srDate = null; // Date of Service Report
var address = null; // Address
var custSigned = null; // Customer Signed?
var signedDate = null; // Signed Date
var signedBy = null; // Name of person signed
var assignedTo = null; // Assigned to ( Engineer )
var problemType = null; // Type ( problem etc )
var caseNumber = null; // Case Number
var caseRecord = null;
var shipAddress = null;
var testEquipment = null;
var itemDescription = new Array();
var serialNumber = new Array();

//1.0.4
var contactEmail = '';
var contactPhoneNo = '';

//1.0.5
var engineerID = 0;
var engineerEmail = '';
var engineerPhoneNo = '';

//1.0.6
var contractNo = '';

//1.0.7
var visitSchedule = '';

//1.0.8
var visitReason = '';

//1.0.9
var caseSubject = '';

//1.0.10
var cycleCount = '';
var softwareRevision = '';

//1.0.12
//1.0.25 refactored name - MJL
var vatInfo = '';

//1.0.17
var companyAddress = '';

//1.0.24
var isElectricalTestDone = '';

//Search Variables
var serviceLineItem = new Array();
var slItemDescription = new Array();
var slItemQuantity = new Array();
var slItemCost = new Array();
var slItemUnitCost = new Array();
var createPdf = null;
var pdfxml = ''; // Does not work with null
var itemSearch = '';
var searchResults = '';

/**
 *  Main body of the script
 */
function printServiceReport() 
{
	var pdfXML = '';
	caseID = request.getParameter('custparam_caseid');

	//Loads the support case record with the matching caseID
	caseRecord = nlapiLoadRecord('supportcase', caseID);

	// if the caseID is empty or null then it will not reference the correct Case
	if(caseID == "" || caseID == null)
	{
		var errormsg = "<html><body><p>You cannot print this Service Report as it has not been saved yet, or the Service Report Parameter has been passed through incorrectly.</p></body></html>";
		response.write(errormsg);
	}
	else
	{	

		//*********************************************
		//get required header fields from case record and escape into xml
		//*********************************************
		getHeaderFields();

		//*********************************************
		// returns all the items for a case (into 5 arrays)
		// camelCase - slItemSearch - itemSearch
		//*********************************************

		itemSearch = slItemSearch(caseID);           

		//*********************************************
		// 1.0.17 get company address from Company Information screen - MJL
		// 1.0.12 get report footer from parameter - MJL
		// create XML document
		// create the PDF from the xml document
		//*********************************************
		
		getCompanyAddress();
		getVATInfo(); //1.0.25 refactored name MJL
		pdfXML = createXML();
		createPDF(pdfXML);
	}
}

/**
 * Takes the XML and makes a PDF file
 * @param pdfXML
 */
function createPDF(pdfXML)
{

	try
	{
		var file = nlapiXMLToPDF(pdfXML);
		response.setContentType('PDF', caseID + ' caseID.pdf');
		response.write(file.getValue());
	}
	catch(e)
	{
		var errormsg = "<html><body><p>PDF Error: " + e.message +"</p></body></html>";
		response.write(errormsg);
	}


}


/**
 * Gets header fields
 * Creates yes or no from T or F
 * 
 * 1.0.4 added Contact email and telephone no. from Case - MJL
 * 1.0.5 added Engineer email and telephone no. from Employee record - MJL
 * 1.0.6 get Contract number from Case record - MJL
 * 1.0.7 get Visit Schedule from Case - MJL
 * 1.0.8 get Visit Reason from Case - MJL
 * 1.0.9 get Subject from Case - MJL
 * 1.0.10 get Cycle Count/Software Revision from Case (Cycle Count removed as of 1.0.23)- MJL
 * 1.0.19 changed from mobile phone field to office phone field - MJL
 * 1.0.20 default these to N/A if empty - MJL
 * 1.0.22 removed Cycle Count field - MJL
 * 1.0.24 Electrical Safety Test Done?
 */
function getHeaderFields()
{
	// gets header fields
	company = nlapiEscapeXML(caseRecord.getFieldText('company')); // Company Text
	CompanyID = nlapiEscapeXML(caseRecord.getFieldValue('company')); // Company ID
	contact = nlapiEscapeXML(caseRecord.getFieldText('contact')); //Company Contact
	comments = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_comments')); // Comments
	cer = nlapiEscapeXML(caseRecord.getFieldText('custevent_case_contractitem')); // CER
	cerDetail = nlapiEscapeXML(caseRecord.getFieldValue('custevent_contractitemsdetails')); // CER Detail
	workDetail = nlapiEscapeXML(caseRecord.getFieldText('custevent_sl_workdetail')); // Work Detail
	chargeability = nlapiEscapeXML(caseRecord.getFieldText('custevent_sl_chargeability')); // Chargeability
	srDate = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_servicedate')); // Date of Service Report
	//address = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_address')); // Address
	custSigned = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_customersigned')); // Customer Signed?
	signedDate = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_signeddate')); // Signed Date
	assignedTo = nlapiEscapeXML(caseRecord.getFieldText('custevent_sl_engineer')); // Assigned to ( Engineer )
	engineerID = nlapiEscapeXML(caseRecord.getFieldValue('custevent_sl_engineer')); //1.0.5 Engineer internal ID
	problemType = nlapiEscapeXML(caseRecord.getFieldValue('category')); // Type ( problem etc )
	caseNumber = nlapiEscapeXML(caseRecord.getFieldValue('casenumber')); // Case Number
	//customerAddress = nlapiEscapeXML(nlapiLookupField('customer', CompanyID, 'address')); // Get customer address
	shipAddress = nlapiEscapeXML(getSelectedAddress()); //1.0.26 get selected shipping address text - MJL
	//shipAddress = 'Finance Dept\nMonklands Hospital\nCorporate Service Buildings\nMonkscourt Avenue\nAirdrie\nML6 0JS';
	testEquipment = caseRecord.getFieldValues('custevent_sl_testequipmentused'); // Test Equipment Used
    isElectricalTestDone = nlapiEscapeXML(caseRecord.getFieldText('custevent_elecsafetest')); //1.0.24 Electrical Safety Test Done?

	//1.0.4
	contactEmail = nlapiEscapeXML(caseRecord.getFieldValue('email'));
	contactPhoneNo = nlapiEscapeXML(caseRecord.getFieldValue('phone'));
	
	//1.0.5
	if(engineerID.length > 0)
	{
		engineerEmail = nlapiEscapeXML(nlapiLookupField('employee', engineerID, 'email'));
		engineerPhoneNo = nlapiEscapeXML(nlapiLookupField('employee', engineerID, 'altphone')); //1.0.19 change from mobile to office phone field - MJL
	}
	
	//1.0.6
	contractNo = nlapiEscapeXML(caseRecord.getFieldText('custevent_case_contract')); 
	
	//1.0.7
	visitSchedule = nlapiEscapeXML(caseRecord.getFieldText('custevent_visit_schedule'));
	
	//1.0.8
	visitReason = nlapiEscapeXML(caseRecord.getFieldText('custevent_visit_reason'));

	//1.0.9
	caseSubject = nlapiEscapeXML(caseRecord.getFieldValue('title'));
	
	//1.0.10 (Cycle Count removed as of 1.0.22)
	softwareRevision = nlapiEscapeXML(caseRecord.getFieldValue('custevent_software_revision'));
	
	if (testEquipment != null) 
	{
		if (testEquipment.length > 0) 
		{
			for (var i = 0; i < testEquipment.length; i++) 
			{
				itemDescription[i] = nlapiLookupField('customrecord_testequipreg', testEquipment[i], 'custrecord_ter_itemdesc');
				serialNumber[i] = nlapiLookupField('customrecord_testequipreg', testEquipment[i], 'custrecord_ter_serialnumber');
			}
		}
	}
			
	// Adds line breaks
	if (shipAddress != null)
	{
		shipAddress = shipAddress.replace(/\n/gi,'<br />');
	}
	
	if (workDetail != null)
	{
		workDetail = workDetail.replace(/\n/gi,'<br />');
	}
	
	// Call Custsigned function - Creates a yes or no from T or F
	custSigned = returnYes(custSigned);	
	
	//1.0.20 default these to N/A if empty - MJL
	comments = defaultIfEmpty(comments);
	contractNo = defaultIfEmpty(contractNo);
	visitSchedule = defaultIfEmpty(visitSchedule);
	visitReason = defaultIfEmpty(visitReason);
	softwareRevision = defaultIfEmpty(softwareRevision);
	isElectricalTestDone = defaultIfEmpty(isElectricalTestDone);
}

/**
 * 1.0.17 get company address from Company Information screen
 */
function getCompanyAddress()
{
    var objConfig = null;
    var companyName = '';
    var address = '';
    var telno = '';
    var faxno = '';
    var website = '';
   
    //Load Company Information
    objConfig = nlapiLoadConfiguration('companyinformation');
    
    //Get raw information
    companyName = objConfig.getFieldValue('legalname');
    address = objConfig.getFieldValue('addresstext');
    telno = objConfig.getFieldValue('phone');
    faxno = objConfig.getFieldValue('fax');
    website = objConfig.getFieldValue('url');
    
    //Place info into correct format
    companyAddress += companyName + '\n';
    companyAddress += address + '\n';
    companyAddress += '\n';
    companyAddress += 'Tel: ' + telno + '\n';
    companyAddress += 'Fax: ' + faxno + '\n';
    companyAddress += 'Web: ' + website + '\n';
    
    //Escape characters for use in XML
    companyAddress = companyAddress.replace(/\n/g, '<br />');
    companyAddress = companyAddress.replace(/&/gi, '&amp;');
    
    nlapiLogExecution('AUDIT', 'Company address', companyAddress);  
}

/**
 * 1.0.12 loads report footer from script parameter
 * 1.0.25 refactored name - MJL
 */
function getVATInfo()
{
	var context = null;
	
	context = nlapiGetContext();
	vatInfo = context.getSetting('SCRIPT', 'custscript_sr_footer');
	vatInfo = vatInfo.replace(/\n/g, '<br />');
	
	nlapiLogExecution('AUDIT', 'VAT Information', vatInfo);
}

/**
 * 1.0.20 Sets string to N/A if empty or null
 * 
 * @param str
 * @returns
 */
function defaultIfEmpty(str)
{
    if(str == '' || str == null)
    {
        str = 'N/A';
    }
    return str;
}

/**
 * Creates a yes or no from T or F
 * @param custSigned
 * @returns
 */
function returnYes(custSigned)
{
	if (custSigned == 'T')
	{
		custSigned = 'Yes';
	}
	else
	{
		custSigned = 'No';
	}

	return custSigned;
}


/**
 * Carries out the search for the line items on the case.
 * @param caseID
 * @returns {Boolean}
 */

function slItemSearch(caseID)
{
	//nlapiLogExecution('DEBUG', 'Gets to slItemSearch First Log');
	var filter = '';
	var columns = new Array();
	var retVal = false;

	filter = new nlobjSearchFilter('custrecord_sl_case', null, 'is', caseID); 

	columns[0] = new nlobjSearchColumn('custrecord_sl_item');
	columns[1] = new nlobjSearchColumn('custrecord_sl_description');
	columns[2] = new nlobjSearchColumn('custrecord_sl_quantity');
	columns[3] = new nlobjSearchColumn('custrecord_sl_totalcost');
	columns[4] = new nlobjSearchColumn('custrecord_sl_unitcost');

	searchResults = nlapiSearchRecord('customrecord_servicelineitem', null, filter, columns);

	if (searchResults != null)
	{
		//nlapiLogExecution('DEBUG', 'Gets into IF statement');

		for (var i = 0; i < searchResults.length; i++)
		{
			//nlapiLogExecution('DEBUG', 'Gets into For statement');
			serviceLineItem[i] = nlapiEscapeXML(searchResults[i].getText(columns[0]));
			slItemDescription[i] = nlapiEscapeXML(searchResults[i].getValue(columns[1]));
			slItemQuantity[i] = nlapiEscapeXML(searchResults[i].getValue(columns[2]));
			slItemCost[i] = nlapiEscapeXML(searchResults[i].getValue(columns[3]));
			slItemUnitCost[i] = nlapiEscapeXML(searchResults[i].getValue(columns[4]));
		}
		retVal = true;
	}
	else
	{
		retVal = false;
	}
	return retVal;
}

/**
 * Creates the PDF file
 * 
 * 1.0.2 moved Equip. Detail field before Work Detail field - MJL
 * 1.0.3 remove extra details from Contact field - MJL
 * 1.0.4 added Contact email and telephone no. from Case - MJL
 * 1.0.5 added Engineer email and telephone no. from Employee record - MJL
 * 1.0.6 added Contract number from Case record - MJL
 * 1.0.7 added Visit Schedule field - MJL
 * 1.0.8 added Visit Reason field - MJL
 * 1.0.9 added Case Subject - MJL
 * 1.0.10 added Cycle Count and Software Revision fields to Equipment Detail - MJL
 * 1.0.11 layout changes - cosmetic - MJL
 * 1.0.12 added company details to report footer - MJL
 * 1.0.13 added border to Service Detail section - MJL
 * 1.0.14 parsed as float to fix ".00" error - MJL
 * 1.0.15 prevent NaN values from occurring - MJL
 * 1.0.16 moved address to top of the report - MJL
 * 1.0.18 moved case no. to top right corner - MJL
 * 1.0.21 changed Subject label to Job - MJL
 * 1.0.22 removed Cycle Count field - MJL
 * 1.0.23 added Electrical Safety Test Done? field - MJL
 * 1.0.24 added Engineer Signature - MJL
 * 1.0.25 moved VAT info from footer to below company address - MJL
 * 1.0.27 layout changes - cosmetic - MJL
 * 
 * @returns {String}
 */
function createXML()
{
	var pdfxml='';
	//Creates headers
	pdfxml += '<?xml version="1.0"?>';
	pdfxml += '<!DOCTYPE pdf PUBLIC "-//big.faceless.org//report" "report-1.1.dtd">';
	pdfxml += '<pdf>';
	pdfxml += '<head><meta name="title" value="Service Report" />\n<style type="text/css">.style1{height: 23px;} .bot{ position:absolute left:10px top:150px; }</style></head>';
	pdfxml += '<body background-color="white" font-size="12" size="A4">';
	pdfxml += '<table style="width:100%;"><tr><td><img display="inline" src="http://shopping.netsuite.com/core/media/media.nl?id=61426&amp;c=1259692&amp;h=1286689e8f0130b1803b" dpi="320" /></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px;">&nbsp;</td>';
	
	//1.0.18 Move case no. to top right corner - MJL
    pdfxml += '<td><p align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: large; font-weight: bold;">Service Report No. ' + caseNumber + '</p>';
    pdfxml += '</td></tr></table>';
	
    //1.0.16 moved address to top of the report - MJL
    //1.0.25 added VAT info below address - MJL
    pdfxml += '<div><table style="width: 100%;"><tbody>';
    pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + companyAddress + '<br />' + vatInfo + '</td></tr>';
    pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">&nbsp;</td></tr>';
    pdfxml += '</tbody></table></div>';

	//1.0.13 Service Detail section border - MJL
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Service Detail</b></td></tr></table>';
	pdfxml += '<table style="border: thin solid #000000; width: 100%;"><tr><td><table style="width: 90%;"><tbody>'; //1.0.27 changed column width from 70% to 90% - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Engineer</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + assignedTo + '</td></tr>';
	
	//1.0.5 Engineer email and phone number fields - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Engineer Email</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + engineerEmail + '</td></tr>';
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Engineer Phone</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + engineerPhoneNo + '</td></tr>';
	
	//Chargeability field
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Chargeability</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + chargeability +'</td></tr>';
	
	//1.0.6 Contract field - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Contract</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + contractNo +'</td></tr>';
	
	//1.0.7 Visit Schedule field - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Visit Schedule</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + visitSchedule +'</td></tr>';
	
	//1.0.8 Visit Reason field - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Visit Reason</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + visitReason +'</td></tr>';
	
	//1.0.9 Case Subject field - MJL
	//1.0.21 Changed Subject label to Job - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Job</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + caseSubject +'</td></tr>';
	
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Date</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + srDate + '</td></tr>';
	pdfxml += '</tbody></table></td>';
	pdfxml += '<td align="right" valign="top">';
	pdfxml += '<table style="width: 85%;"><tbody>'; //1.0.27 changed column width from 70% to 85% - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Customer</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + company + '</td></tr>';
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Address</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + shipAddress + '</td></tr>';
	
	//1.0.3 Contact field - MJL
	//nlapiLogExecution('DEBUG', 'contact info', contact);
	contact = contact.slice((contact.indexOf(': ') + 2), contact.length);
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Contact</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + contact + '</td></tr>';
	
	//1.0.4 Contact email and phone number - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Email</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + contactEmail + '</td></tr>';
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Telephone</strong></td><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + contactPhoneNo + '</td></tr>';
	
	//1.0.11 removed additional <br /> tag to get all info on one page - MJL
	pdfxml += '</tbody></table></td></tr></table><br />';

	// Creates CER Detail - 1.0.2 moved before Work Detail - MJL
	// Altered Table Heading Length - AM
	// Swap (cerDetail) and ('Serial :' + cer around) - AM
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Equipment Detail</b></td></tr></table>';
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Name: </b>' + cerDetail + '</td></tr>'; //1.0.11 added 'Name: ' prefix - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Serial: </b>' + cer + '</td></tr>';
	
	//1.0.10 Cycle Count and Software Revision fields - MJL
	//1.0.22 Cycle Count removed - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Software Revision: </b>' + softwareRevision + '</td></tr>';
	pdfxml += '</table><br />';
	
	// Creates Work Detail
	// Altered Table Heading Length - AM
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Work Detail</b></td></tr></table>';
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Description: </b>' + workDetail + '</td></tr>';
	
	//1.0.23 added Electrical Safety Test Done? field - MJL
	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>Electrical Safety Test Done? </b>' + isElectricalTestDone +'</td></tr>';
	pdfxml += '</table><br />';
	
	// Creates Comments
	// Altered Table Heading Length - AM
	pdfxml += '<table style="border: thin solid #000000; width:100%;">';
	pdfxml += '<tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Work Detail Comments</b></td></tr></table>';
	pdfxml += '<table style="border: thin solid #000000; width:100%;"><tr>';
	pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + comments +'</b></td></tr>';
	pdfxml += '</table><br />';

	// If there are any Test Equipment items used they are listed here...
	if (testEquipment != null) 
	{		
		if (testEquipment.length > 0) 
		{
			// Creates Test Equipment
			// Altered Table Heading Length - AM
			pdfxml += '<table style="border: thin solid #000000; width:100%;">';
			pdfxml += '<tr>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Test Equipment Used</b></td></tr></table>';
			pdfxml += '<table style="border: thin solid #000000; width:100%;">';

			for (var i = 0; i < testEquipment.length; i++) 
			{
				// Escapes XML on each instance of the testEquipment[i]
				testEquipment[i] = nlapiEscapeXML(testEquipment[i]);								
				itemDescription[i] = nlapiEscapeXML(itemDescription[i]);
				serialNumber[i] = nlapiEscapeXML(serialNumber[i]);

				pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + serialNumber[i] + '  ' + itemDescription[i] + '</b></td></tr>';	
			}
			pdfxml += '</table><br />';
		}
	}
	
	if (searchResults != null)
	{
		// Creates Table Parts Used
		pdfxml += '<table style="border: thin solid #000000; width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Parts Used</b></td></tr></table>';

		// Create line item headers here
		pdfxml += '<table style="border: thin solid #000000; width:100%;">';
		pdfxml += '<tr>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Item</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Description</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Quantity</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Unit</b></td>';
		pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>Total</b></td>';
		pdfxml += '</tr>';

		// For loop to add line items from case
		var Total = 0;
		for (var i = 0; i < searchResults.length; i++)
		{	
			pdfxml += '<tr>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + serviceLineItem[i] + '</b></td>';
			pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + slItemDescription[i] + '</b></td>';
			pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + slItemQuantity[i] + '</b></td>';
			
			//1.0.15 prevents NaN value on blank item cost - MJL
			if (slItemUnitCost[i].length == 0)
			{
				pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + String(slItemUnitCost[i]) + '</b></td>';
				pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + String(slItemCost[i]) + '</b></td>';
			}
			else
			{
				//1.0.14 ".00" error fix - MJL
				pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + parseFloat(slItemUnitCost[i]).toFixed(2) + '</b></td>';
				pdfxml += '<td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: White;"><b>' + parseFloat(slItemCost[i]).toFixed(2) + '</b></td>';
			}
			
			pdfxml += '</tr>';
			
			//1.0.15 prevents NaN value on total - MJL
			if (slItemCost[i].length > 0)
			{
				Total += parseFloat(slItemCost[i]);
			}			
		}	
		pdfxml += '</table>';

		// Create final table for total
		pdfxml += '<table width="100%" align="right" valign="baseline"><tr><td align="right">&nbsp;<table width="300px" style="border: thin solid #000000;">';
		pdfxml += '<tr><td width="50%" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px; background-color: Silver;"><b>TOTAL</b></td><td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + Total.toFixed(2) + '</td></tr>';
		pdfxml += '</table></td></tr>';
		pdfxml += '</table>';
	}
	
	//1.0.12 added company details to report footer - MJL - one page
	//1.0.25 moved to top of report under company address - MJL
	pdfxml += '<div><table style="width: 100%;"><tbody>';
	//pdfxml += '<td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + vatInfo + '</td>';
	
	// Customer signature and date
    //1.0.24 added Engineer Signature - MJL
	pdfxml += '<tr><td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><p align="right"><strong>Customer Signature __________________________________</strong></p><br />';
	pdfxml += '<p align="right"><strong>Engineer Signature __________________________________</strong></p><br />';
	pdfxml += '<p align="right"><strong>Date ____ / ____ / ________</strong></p></td></tr>';
	pdfxml += '</tbody></table></div>';
	
//	// Create table for signature and date - original layout - two pages
//	pdfxml += '<br />';
//	pdfxml += '<div><table style="width: 100%;"><tbody>';
//	pdfxml += '<tr><td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Customer Signature __________________________________</strong></td></tr>';
//	pdfxml += '</tbody></table><table style="width: 100%;"><tbody><tr><td>&nbsp;</td></tr><tr><td align="right" style="font-family: Arial, Helvetica, sans-serif; font-size: 10px"><strong>Date ____ / ____ / ________</strong></td></tr>';
//	pdfxml += '</tbody></table></div>';
//	
//	pdfxml += '<div><table style="width: 100%;"><tbody>';
//	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">&nbsp;</td></tr>';
//	pdfxml += '<tr><td style="font-family: Arial, Helvetica, sans-serif; font-size: 10px">' + vatInfo + '</td></tr>';
//	pdfxml += '</tbody></table></div>';
		
	pdfxml += '</body></pdf>'; // End of PDF
	//nlapiLogExecution('DEBUG','This is the XML', pdfxml);

	return pdfxml;
}	// createPdfXml end

/**
 * Gets shipping address selected on case record
 * 
 * 1.0.26 added
 * 
 * @returns {String}
 */
function getSelectedAddress()
{		
	var shipAddressID = 0;
	var shipLine = 0;
	var recCustomer = null;
	var addressText = '';

	//Get address internal ID from case record
	shipAddressID = caseRecord.getFieldValue('custevent_sl_shippingaddress');
	
	//Find address text from ID and return
	recCustomer = nlapiLoadRecord('customer', CompanyID);
	shipLine = recCustomer.findLineItemValue('addressbook', 'internalid', shipAddressID);
	addressText = recCustomer.getLineItemValue('addressbook', 'addrtext', shipLine);
	
	//nlapiLogExecution('DEBUG', 'Shipping address text', addressText);
	
	return addressText;
}
/**************************'*****************************************************************************
 * Name: Service Report Sales Order
 * Script Type: Suitelet
 * Client: Mortara Dolby
 * 
 * Version: 1.0.0 - 24 Apr 2012 - 1st release - MJL
 *          1.0.1 - 22 May 2012 - added set Sales Rep function - MJL
 *          1.0.2 - 24 May 2012 - altered Department field - MJL
 *          1.0.3 - 06 Jun 2012 - added shipping and billing address check - MJL (removed as of 1.0.7)
 *          1.0.4 - 26 Jun 2012 - integration of the lot number suitelet into SO post - MJL
 *          1.0.5 - 28 Jun 2012 - suitelet now redirects to newly created/amended order on submit - MJL
 *          1.0.6 - 05 Jul 2012 - added shipping and billing addresses to SO post - MJL
 *          1.0.7 - 05 Jul 2012 - added success audit trail post to execution log - MJL
 *          1.0.8 - 19 Jul 2012 - added more descriptive error catch message - MJL
 *          1.0.9 - 27 Jul 2012	- added audit post to execution log on failure - MJL
 *          1.0.10 - 27 Jul 2012 - fixed bug - set price level to Custom on order lines - MJL
 *          1.0.11 - 07 Aug 2012 - parameterised sales rep information - MJL
 *          1.0.12 - 09 Aug 2012 - added try-catch blocks to functions - MJL
 *          2.0.0 - 25 Feb 2013 - major release - generate Quotations instead of Sales Orders - AM
 *
 * Author: Matthew Lawrence, Anthony Morganti, FHL
 * Purpose: Generate a sales order record from a case using Service Line Items
 * 
 * Suitelet script: Service Report Sales Order
 * Script ID: customscript_suitelet_createsalesorder
 * Deployment ID: customdeploy_suitelet_createsalesorder
 * 
 * Notes: [TODO] set editmode to false on deployment
 * 		  [TODO] Alter to set Inventory Detail subrecord instead of Serial/Lot Number field on enable of Advanced Bin Tracking.....
 * 		  Code marked with todos ready for alteration from Sales Order to Quotation
 *******************************************************************************************************/

/**
 * Global variables
 */
var caseID = 0;
var caseRec = null;
var soID = 0;
var serviceLineCount = 0;

var serviceLineItem = new Array();
var serviceLineItemDescription = new Array();
var serviceLineItemLotNumber = new Array();
var serviceLineItemQuantity = new Array();
var serviceLineItemCost = new Array();
var serviceLineItemUnitCost = new Array();
var serviceLineItemSOApply = new Array();

/**
 * On button press, execute this function
 * Loads case record and check to see if a Sales Order has already been created
 * 
 * 1.0.12 added try-catch blocks to functions - MJL
 */
function checkForExistingSalesOrder()
{	
	var retVal = false;
	
	try //1.0.12
	{
		//load case record
		caseID = request.getParameter('custparam_caseid');
		caseRec = nlapiLoadRecord('supportcase', caseID);
		
		//get contents of SO field on case
		soID = caseRec.getFieldValue('custevent_sl_salesorder');
		
		if (soID == 0 || soID == '' || soID == null) 
		{	
			//if field empty, create sales order
			soID = createSalesOrder(caseRec);
		
			//nlapiLogExecution('DEBUG', 'soID', soID);
		
			if(soID != 0 || soID != '' || soID != null || soID != '0')
			{
				setSalesOrderField(soID);
				retVal = true;
			}
		}
		else
		{	
			//if field not empty, load the SO record
			retVal = amendSalesOrder(caseRec, soID);
			retVal = true;
		}
	}
	catch(e)
	{
		failure('An error has occurred when checking for a Quotation.', e.message);
	}
	return retVal;
}

/**
 * Creates new SO record and populates with service line items from case
 * 
 * 1.0.8 added more descriptive error catch message
 */
function createSalesOrder(caseRec)
{
	var isHeaderSet = null;
	var newSalesOrder = null;
	var newSalesOrderID = null;
	var successMessage = 'created';
	
	try
	{
		//create new sales order
		newSalesOrder = nlapiCreateRecord('estimate');

		//search for line items associated with case
		serviceLineCount = serviceLineSearch(caseID);
	
		if(serviceLineCount > 0)
		{	
			//set SO header
			isHeaderSet = setOrderHeader(newSalesOrder);
			
			//only set SO line item details if the header details have been set
			if(isHeaderSet == true)
			{	
				//set SO lines
				setOrderLines(newSalesOrder, serviceLineCount);
				
				//nlapiLogExecution('DEBUG', 'Before submit');
				
				//submit record
				newSalesOrderID = nlapiSubmitRecord(newSalesOrder, true);
				
				//nlapiLogExecution('DEBUG', 'After submit');
				
				if (newSalesOrderID != 0 || newSalesOrderID != null)
				{
					//set applied to SO flag to true on service line items
					setAppliedFlag(serviceLineCount);
					
					//display new sales order record
					success(newSalesOrderID, successMessage);
				}
				else
				{
					failure('Failed to submit the Quotation.', '');
				}
			}
			else
			{
				failure('Failed to create the Quotation.', '');
			}
		}
		else
		{
			failure('There are no lines to transfer to the Quotation.', '');
		}
	}
	catch(e)
	{
		failure('An error has occurred when creating a Quotation.', e.message);
	}
	return newSalesOrderID;
} 

/**
 * Displays message on success of Sales Order creation/amendment
 * 
 * 1.0.5 now displays created/amended SO on submit
 * 1.0.7 added success audit trail post to execution log
 */
function success(soID, successMessage)
{
	var soNum = null;
	
	//1.0.7
	soNum = nlapiLookupField('estimate', soID, 'tranid');
	nlapiLogExecution('AUDIT', 'Success', 'Quotation ' + soNum + ' ' + successMessage);
	
	//1.0.5 display new/altered record
	nlapiSetRedirectURL('RECORD', 'estimate', soID, true); //[TODO] set editmode to false on deployment
}

/**
 * Displays message on failure of Sales Order creation/amendment
 * 
 * 1.0.4 added error catch for unavailable lot numbers in location
 * 1.0.9 added audit post to execution log on failure
 */
function failure(message, error)
{
	if (error.indexOf('decommit previously committed orders') != -1)
	{
		nlapiLogExecution('AUDIT', 'Failure', message + ' Error: ' + error); //1.0.9
		response.write("<h3>Information</h3><p> The lot number associated with this item is not available at this location.</p>");
	}
	else
	{
		nlapiLogExecution('AUDIT', 'Failure', message + ' Error: ' + error); //1.0.9
		response.write("<h3>Information</h3><p>" + message + "</p>" + error);
	}
}

/**
 * Sets header details on new SO record using data
 * from Service Report subtab on case
 * 
 * 1.0.2 altered Department field
 * 1.0.6 added address field posts
 * 1.0.12 added try-catch blocks to functions - MJL
 * 2.0.0 remove fields not common to SO and Quote - MJL
 */
function setOrderHeader(newSalesOrder)
{
	var context = nlapiGetContext();
	var soCustomForm = 0;
	var caseCustomer = '';
	var caseSubject = '';
	//var customerOrderNo = 0;
	//var orderSource = 0;
	var salesChannel = 0;
	var department = 0;
	var location = 0;
	var engineer = 0;
	//var shipTo = 0;
	var billTo = 0;
	
	var retVal = false;
	
	try //1.0.12
	{
		//get header values from case
		soCustomForm = context.getSetting('SCRIPT', 'custscript_socustomformid'); //[zzz] change to 128 for live and 138 for demo
		caseCustomer = caseRec.getFieldValue('company');
		caseNo = caseRec.getFieldValue('casenumber');
		caseSubject = caseRec.getFieldValue('title'); //2.0.1
		//customerOrderNo = caseRec.getFieldValue('custevent_sl_custordernum'); //2.0.1
		//orderSource = caseRec.getFieldValue('custevent_sl_ordersource'); //2.0.1
		salesChannel = caseRec.getFieldValue('custevent_sl_saleschannel');
		department = caseRec.getFieldValue('custevent_sl_department'); //1.0.2
		location = caseRec.getFieldValue('custevent_sl_location'); //2.0.1
		engineer = caseRec.getFieldValue('custevent_sl_engineer');
		//shipTo = caseRec.getFieldValue('custevent_sl_shippingaddress'); //1.0.6
		billTo = caseRec.getFieldValue('custevent_sl_billingaddress'); //1.0.6
		
		//nlapiLogExecution('DEBUG', 'Department', department);
		
		//set header values on sales order
		//[TODO] ensure that Quotation form matches
		newSalesOrder.setFieldValue('customform', soCustomForm);
		newSalesOrder.setFieldValue('entity', caseCustomer);
		newSalesOrder.setFieldValue('title', caseSubject); //2.0.1
		newSalesOrder.setFieldValue('custbody_parentcase', caseID);
		//newSalesOrder.setFieldValue('otherrefnum', customerOrderNo); //2.0.1
		//newSalesOrder.setFieldValue('custbody_order_source', orderSource); //2.0.1
		newSalesOrder.setFieldValue('class', salesChannel);
		newSalesOrder.setFieldValue('department', department);
		newSalesOrder.setFieldValue('location', location); //2.0.1
		
		//nlapiLogExecution('DEBUG', 'Ship Address ID', shipTo);
		nlapiLogExecution('DEBUG', 'Bill Address ID', billTo);
		
		//newSalesOrder.setFieldValue('shipaddresslist', shipTo); //2.0.1
		newSalesOrder.setFieldValue('billaddresslist', billTo); //1.0.6
		
		//set sales rep from engineer field on case record
		retVal = setSalesRep(engineer, newSalesOrder);
	}
	catch(e)
	{
		failure('There was an error in setting the Quotation header details.', '');
	}
	return retVal;
}

/**
 * Sets line items details on new SO record using data 
 * from Service Report subtab on case
 * 
 * 1.0.4 integration of the lot number suitelet into SO post
 * 1.0.8 added condition to lot number post
 * 1.0.10 set price level to Custom
 * 1.0.12 added try-catch blocks to functions - MJL
 * 2.0.0 added call to new setLotNumber function - MJL
 */
function setOrderLines(newSalesOrder, serviceLineCount)
{	
	var context = nlapiGetContext();
	var inReleasePreview = null;
	
	try //1.0.12
	{
		inReleasePreview = context.getEnvironment();
		
		//for every line item, set details on SO
		for (var i = 0; i < serviceLineCount; i++)
		{	
			newSalesOrder.selectNewLineItem('item');
			
			newSalesOrder.setCurrentLineItemValue('item', 'item', serviceLineItem[i]);
			//nlapiLogExecution('DEBUG', 'Item', newSalesOrder.getCurrentLineItemValue('item', 'item'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'description', serviceLineItemDescription[i]);
			//nlapiLogExecution('DEBUG', 'Item description', newSalesOrder.getCurrentLineItemValue('item', 'description'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'quantity', serviceLineItemQuantity[i]);
			//nlapiLogExecution('DEBUG', 'Item quantity', newSalesOrder.getCurrentLineItemValue('item', 'quantity'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'price', -1); //1.0.10
			//nlapiLogExecution('DEBUG', 'Price Level', newSalesOrder.getCurrentLineItemValue('item', 'price'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'rate', parseFloat(serviceLineItemUnitCost[i]));
			//nlapiLogExecution('DEBUG', 'Unit cost', newSalesOrder.getCurrentLineItemValue('item', 'rate'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'amount', parseFloat(serviceLineItemCost[i]));
			//nlapiLogExecution('DEBUG', 'Total cost', newSalesOrder.getCurrentLineItemValue('item', 'amount'));
			
			//1.0.8
			if (String(serviceLineItemLotNumber[i]).length > 0)
			{
				nlapiLogExecution('AUDIT', 'Item Lot Number ID', serviceLineItemLotNumber[i]);
				
				//If in ReleasePreview then use setLotNumber()
				if (inReleasePreview == 'BETA')
				{
					setLotNumber(newSalesOrder, serviceLineItemLotNumber[i], serviceLineItemQuantity[i]); //2.0.0
				}
				else
				{
					newSalesOrder.setCurrentLineItemValue('item', 'serialnumbers', serviceLineItemLotNumber[i]); //2.0.0
				}				
				//nlapiLogExecution('DEBUG', 'Lot number', newSalesOrder.getCurrentLineItemText('item', 'serialnumbers'));
				//nlapiLogExecution('DEBUG', 'Lot number int ID', newSalesOrder.getCurrentLineItemValue('item', 'serialnumbers'));
			}
			
			newSalesOrder.setCurrentLineItemValue('item', 'custcol_customercase', caseID);
			//nlapiLogExecution('DEBUG', 'Customer case', newSalesOrder.getCurrentLineItemText('item', 'custcol_customercase'));
			//nlapiLogExecution('DEBUG', 'Customer case int ID', newSalesOrder.getCurrentLineItemValue('item', 'custcol_customercase'));
			
			newSalesOrder.setCurrentLineItemValue('item', 'custcol_servicelineitem', 'T');
			newSalesOrder.commitLineItem('item');	
			
			//nlapiLogExecution('DEBUG', 'Item ' + (i + 1) + ' commits');
		}
	}
	catch (e)
	{
		failure('An error has occurred when adding line items to the Quotation.', e.message);
	}
}

/**
 * Loads existing SO from case and populates with additional service line items
 * 
 * 1.0.7 added success audit trail post to execution log
 * 1.0.8 added more descriptive error catch message
 */
function amendSalesOrder(caseRec, soID)
{		
	var salesOrderRec = null;
	var serviceLineCount = 0;
	var salesOrderID = null;
	var successMessage = 'amended';
	
	try
	{
		//load SO record
		salesOrderRec = nlapiLoadRecord('estimate', soID);
		
		//search for line items associated with case with applied to SO flag as 'F'
		serviceLineCount = untickedLineItemSearch(caseID);
		
		//if new line items present...
		if (serviceLineCount > 0)
		{
			//set line item details
			setOrderLines(salesOrderRec, serviceLineCount);
			
			//submit record
			salesOrderID = nlapiSubmitRecord(salesOrderRec);
			
			//set applied to SO flag to true on new service line items 
			setAppliedFlag(serviceLineCount);
			
			//1.0.8 display amended sales order
			success(salesOrderID, successMessage);	
		}
		else
		{
			failure('There are no lines to transfer to the Quotation.', '');
		}	
	}
	catch(e)
	{
		//1.0.8
		failure('An error has occurred when amending the Quotation.', e.message);
	}
	return salesOrderID;
}

/**
 * Searches for service line items assigned to a case
 * 
 * 1.0.4 gets lot number if present
 */
function serviceLineSearch(caseID)
{
	var filter = '';
	var columns = new Array();
	var results = '';
	var serviceLineItemCount = 0;
	
	//filter for results against a particular case
	filter = new nlobjSearchFilter('custrecord_sl_case', null, 'is', caseID); 
	
	//return all fields
	columns[0] = new nlobjSearchColumn('custrecord_sl_item');
	columns[1] = new nlobjSearchColumn('custrecord_sl_description');
	columns[2] = new nlobjSearchColumn('custrecord_sl_lotnumber'); //1.0.4
	columns[3] = new nlobjSearchColumn('custrecord_sl_quantity');
	columns[4] = new nlobjSearchColumn('custrecord_sl_totalcost');
	columns[5] = new nlobjSearchColumn('custrecord_sl_unitcost');
	columns[6] = new nlobjSearchColumn('custrecord_sl_appliedtosalesorder');
	
	results = nlapiSearchRecord('customrecord_servicelineitem', null, filter, columns);
	
	//if results are present...
	if (results != null)
	{
		//get values for all fields
		for (var i = 0; i < results.length; i++)
		{
			serviceLineItem[i] = results[i].getValue(columns[0]);
			serviceLineItemDescription[i] = results[i].getValue(columns[1]);
			serviceLineItemLotNumber[i] = results[i].getValue(columns[2]); //1.0.4
			serviceLineItemQuantity[i] = results[i].getValue(columns[3]);
			serviceLineItemCost[i] = results[i].getValue(columns[4]);
			serviceLineItemUnitCost[i] = results[i].getValue(columns[5]);
			serviceLineItemSOApply[i] = results[i].getValue(columns[6]);
		}
		serviceLineItemCount = results.length;
	}
	return serviceLineItemCount;
}

/**
 * Searches for unticked service line items assigned to a case
 * 
 * 1.0.4 gets lot number if present
 */
function untickedLineItemSearch(caseID)
{
	var filters = new Array();
	var columns = new Array();
	var results = '';
	var serviceLineItemCount = 0;
	
	//filter for results against a particular case with applied to SO flag as 'F'
	filters[0] = new nlobjSearchFilter('custrecord_sl_case', null, 'is', caseID); 
	filters[1] = new nlobjSearchFilter('custrecord_sl_appliedtosalesorder', null, 'is', 'F'); 
	
	//return all fields
	columns[0] = new nlobjSearchColumn('custrecord_sl_item');
	columns[1] = new nlobjSearchColumn('custrecord_sl_description');
	columns[2] = new nlobjSearchColumn('custrecord_sl_lotnumber'); //1.0.4
	columns[3] = new nlobjSearchColumn('custrecord_sl_quantity');
	columns[4] = new nlobjSearchColumn('custrecord_sl_totalcost');
	columns[5] = new nlobjSearchColumn('custrecord_sl_unitcost');
	columns[6] = new nlobjSearchColumn('custrecord_sl_appliedtosalesorder');
	
	results = nlapiSearchRecord('customrecord_servicelineitem', null, filters, columns);
	
	//if results are present..
	if (results != null)
	{	
		for (var i = 0; i < results.length; i++)
		{
			//get values for all fields
			serviceLineItem[i] = results[i].getValue(columns[0]);
			serviceLineItemDescription[i] = results[i].getValue(columns[1]);
			serviceLineItemLotNumber[i] = results[i].getValue(columns[2]); //1.0.4
			serviceLineItemQuantity[i] = results[i].getValue(columns[3]);
			serviceLineItemCost[i] = results[i].getValue(columns[4]);
			serviceLineItemUnitCost[i] = results[i].getValue(columns[5]);
			serviceLineItemSOApply[i] = results[i].getValue(columns[6]);
		}
		serviceLineItemCount = results.length;
	}
	return serviceLineItemCount;
}

/**
 * Sets the Applied to Sales Order flag to true for each Service Line Item on the case
 */
function setAppliedFlag(serviceLineCount)
{	
	var filters = new Array();
	var column = '';
	var results = null;
	
	var internalids = new Array();
	
	var serviceLineItemRecord = null;
	var appliedToSOFlag = '';
	
	var retVal = false;
	
	//filter for results against a particular case
	filters[0] = new nlobjSearchFilter('custrecord_sl_case', null, 'is', caseID); 
	filters[1] = new nlobjSearchFilter('custrecord_sl_appliedtosalesorder', null, 'is', 'F'); 
	
	//get internal ids
	column = new nlobjSearchColumn('internalid');
	
	results = nlapiSearchRecord('customrecord_servicelineitem', null, filters, column);
	
	//if results present...
	if (results != null)
	{
		//place ids into array
		for (var i = 0; i < results.length; i++)
		{
			internalids[i] = results[i].getValue(column);
		}
	
		for (var i = 0; i < results.length; i++)
		{	
			//load each record 
			serviceLineItemRecord = nlapiLoadRecord('customrecord_servicelineitem', internalids[i]);
			
			//get each flag value
			appliedToSOFlag = serviceLineItemRecord.getFieldValue('custrecord_sl_appliedtosalesorder');
			
			//if flag is 'F'...
			if(appliedToSOFlag == 'F')
			{
				//set flag to 'T' and submit record
				serviceLineItemRecord.setFieldValue('custrecord_sl_appliedtosalesorder', 'T');
				nlapiSubmitRecord(serviceLineItemRecord);
				retVal = true;
			}
		}	
	}
	return retVal;
}

/**
 * Posts the ID of the new sales order into the relevant field on the case
 */
function setSalesOrderField(soID)
{
	var salesOrderField = '';
	var retVal = false;
	
	//get Sales Order field value
	salesOrderField = caseRec.getFieldValue('custevent_sl_salesorder');
	
//	nlapiLogExecution('DEBUG', 'salesOrderField', salesOrderField);
	
	//if field empty...
	if (salesOrderField == 0 || salesOrderField == '' || salesOrderField == null)
	{
		//set sales order field with soID and submit
		caseRec.setFieldValue('custevent_sl_salesorder', soID);
		nlapiSubmitRecord(caseRec);
		retVal = true;
	}
	return retVal;
}

/**
 * Sets the sales rep on the Sales Team subtab
 * 
 * 1.0.1 addition of this
 * 1.0.11 parameterised sales rep information
 */
function setSalesRep(engineer, newSalesOrder)
{
	var objSalesRep = new Object();	
	var context = nlapiGetContext();
	var retVal = false;
	
	//1.0.11
	objSalesRep.employee = engineer;
	objSalesRep.salesRole = context.getSetting('SCRIPT', 'custscript_so_salesrep_role');			//'-2'
	objSalesRep.isPrimary = context.getSetting('SCRIPT', 'custscript_so_salesrep_isprimary');		//'T'
	objSalesRep.contribution = context.getSetting('SCRIPT', 'custscript_so_salesrep_contribution'); //100

	nlapiLogExecution('DEBUG', 'Employee', objSalesRep.employee);
	nlapiLogExecution('DEBUG', 'Sales Roles', objSalesRep.salesRole);
	nlapiLogExecution('DEBUG', 'Is Primary', objSalesRep.isPrimary);
	nlapiLogExecution('DEBUG', 'Contribution', objSalesRep.contribution);
	
	try
	{
		newSalesOrder.selectNewLineItem('salesteam');
		newSalesOrder.setCurrentLineItemValue('salesteam', 'employee', objSalesRep.employee);
		newSalesOrder.setCurrentLineItemValue('salesteam', 'salesrole', objSalesRep.salesRole);
		newSalesOrder.setCurrentLineItemValue('salesteam', 'isprimary', objSalesRep.isPrimary);
		newSalesOrder.setCurrentLineItemValue('salesteam', 'contribution', objSalesRep.contribution);
		newSalesOrder.commitLineItem('salesteam');	
		retVal = true;
	}
	catch(e)
	{
		failure('Failed to set Sales Rep.', '');
		nlapiLogExecution('DEBUG', 'Failed to set Sales Rep', e.message);
		retVal = false;	
	}
	return retVal;
}

/**
 * Creates Inventory Detail Subrecord and set lot number
 * Only called if Advanced Bin/Numbered Inventory Management is active in Enable Features
 * 
 * 2.0.0 added
 */
function setLotNumber(quotation, lotNo, quantity)
{	
	var subRecord = null;
	
	try
	{
		subRecord = quotation.createCurrentLineItemSubrecord('item', 'inventorydetail');
		subRecord.selectNewLineItem('inventoryassignment');
		subRecord.setCurrentLineItemValue('inventoryassignment', 'issueinventorynumber', lotNo);
		subRecord.setCurrentLineItemValue('inventoryassignment', 'quantity', quantity);
		
		subRecord.commitLineItem('inventoryassignment');
		subRecord.commit();
	}
	catch (e)
	{
		failure('Failed to set Lot Number', '');
		nlapiLogExecution('ERROR', 'Failed to set Lot Number', e.message);
	}
}
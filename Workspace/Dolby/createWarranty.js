/*************************************
 * 
 *  Toby's Script
 * 
 * 
 * @param {Object} type
 */


function createWarranty(type)
{
		nlapiLogExecution('DEBUG', 'Running createWarranty ', 'Entered State '); 
		//create warranty records post save
		var custrecord_salesorderlink = nlapiGetRecordId();
		var soRecord = nlapiLoadRecord('itemreceipt', custrecord_salesorderlink);
		var custrecord_purchaseorder = soRecord.getFieldValue('createdfrom');
		nlapiLogExecution('DEBUG', 'Transaction Number ', 'poNumber : ' + custrecord_purchaseorder); 
		var orderType = nlapiLookupField('purchaseorder', custrecord_purchaseorder, 'custbody_ordetype');
		nlapiLogExecution('DEBUG', 'OrderType ', 'orderType : ' + orderType); 
		var poDate = soRecord.getFieldValue('trandate');
		
		var custrecord_purchaseorderdate = convertAmericanDate(poDate);
		var warrantyStartDate = fixDate(poDate);
		var warrantyDate = new Date(warrantyStartDate);
		
		
		
		
		
		

		var numLines = soRecord.getLineItemCount('item');
		for (var c=1; c <= numLines; c++)
			{				
						nlapiLogExecution('DEBUG', 'Cycling through Lines  ', 'numlines : ' + numLines); 
						var serialNumbers = new Array();
						var line = soRecord.selectLineItem('item', c);				
						var custrecord_lotitem = soRecord.getCurrentLineItemValue('item', 'item');	
						var custrecord_lotitemtext = soRecord.getCurrentLineItemText('item', 'item');	
						
						/*****
						*
						*get warranty Information from Item record
						*
						****/
						
						nlapiLogExecution('DEBUG', 'Getting Item Information for Warranty  ', 'Line Num : ' + c + ' item : ' + custrecord_lotitem); 
						var itemfilters = new Array();
						itemfilters[0] = new nlobjSearchFilter('internalid', null, 'is', custrecord_lotitem);
			
						var itemcolumns = new Array();
						itemcolumns[0] = new nlobjSearchColumn('custitem_warrantyoffered');
						itemcolumns[1] = new nlobjSearchColumn('custitem_supplierwarranty');
						itemcolumns[2] = new nlobjSearchColumn('custitem_customerwarranty');
			
						var itemsearchresults = nlapiSearchRecord( 'item', null, itemfilters, itemcolumns);
						if (itemsearchresults != null)
						{
							for (var d = 0; itemsearchresults != null && d< itemsearchresults.length; d++)
								{
									
									var itemsearchresult = itemsearchresults[d];
									var custitem_warrantyoffered = itemsearchresult.getValue('custitem_warrantyoffered');
									var custrecord_supplierwarrantyperiod = itemsearchresult.getValue('custitem_supplierwarranty');
									var custitem_customerwarranty = itemsearchresult.getValue('custitem_customerwarranty');
									nlapiLogExecution('DEBUG', 'Item Variables Set  ', 'custitem_warrantyoffered : ' + c + ' : custrecord_supplierwarrantyperiod: ' + custrecord_supplierwarrantyperiod); 
								}
						}
						
						if(custitem_warrantyoffered == 'T')
						{
						nlapiLogExecution('DEBUG', 'In Warranty Creation Section  ', 'custitem_warrantyoffered : ' );
						var custrecord_quantity = soRecord.getCurrentLineItemValue('item', 'quantity');
						if (isBlank(custrecord_supplierwarrantyperiod)){custrecord_supplierwarrantyperiod = 12;}
						
						var custrecord_warrantyserialnumber = soRecord.getCurrentLineItemValue('item', 'serialnumbers');
						
						
						var splits = /[\n\r]/g;
						var splitSerials = custrecord_warrantyserialnumber.split(splits);
						nlapiLogExecution('DEBUG', 'Trying to splits ',  splitSerials);
						if ( splitSerials != null )
							{
							for (var s=0;s<splitSerials.length;s++)
								{
								var NewSerialNumber= nlapiCreateRecord('customrecord_serialnumbers');	
								NewSerialNumber.setFieldValue('name',splitSerials[s]);
								try
										{
										nlapiLogExecution('DEBUG', 'Trying to newSerial ', 'Doing it now');
										var serialID = nlapiSubmitRecord(NewSerialNumber);
										serialNumbers[s]=serialID;
										}
										catch (sererr)
										{
										nlapiLogExecution('ERROR','Error in Submission of NewSerialNumber', sererr);
										}
								}
							}
							else
							{
							custrecord_warrantyserialnumber = 'No Serial Number';
							}
						if (orderType != 2)
						{
						nlapiLogExecution('DEBUG', 'In orderType 1 Loop ', 'orderType : ' + orderType); 
						var warrantyEndDate = nlapiAddMonths(warrantyDate, custrecord_supplierwarrantyperiod);
						nlapiLogExecution('DEBUG', 'warrantyEndDate ', 'warrantyEndDate : ' + warrantyEndDate); 
						var truncWarrantyEndDate = truncDate(warrantyEndDate);
						
						for (var i=1; i <= custrecord_quantity; i++)
							{							
								var newWarrantyRecord = nlapiCreateRecord('customrecord_warrantydetails');
								newWarrantyRecord.setFieldValue('custrecord_warrantyserialnumber',serialNumbers[i-1]);
								newWarrantyRecord.setFieldValue('custrecord_purchaseorder',custrecord_purchaseorder);
								newWarrantyRecord.setFieldValue('custrecord_supplierwarrantyperiod',custrecord_supplierwarrantyperiod);
								newWarrantyRecord.setFieldValue('custrecord_warrantyenddate',truncWarrantyEndDate);
								newWarrantyRecord.setFieldValue('custrecord_wrrantystatus', 1);
								var serialName = nlapiLookupField('customrecord_serialnumbers', serialNumbers[i-1], 'name');
								newWarrantyRecord.setFieldValue('name', (serialName+':'+custrecord_lotitemtext));
								
								
								
								try
									{
									nlapiLogExecution('DEBUG', 'Trying to newWarrantyRecord ', 'Doing it now');
									var WarrantyID = nlapiSubmitRecord(newWarrantyRecord);
									nlapiLogExecution('DEBUG', 'Created Warranty', WarrantyID);
									
									var newWarrantyItem = nlapiCreateRecord('customrecord_warrantyitem');
									newWarrantyItem.setFieldValue('custrecord_warrantyitem',custrecord_lotitem);
									newWarrantyItem.setFieldValue('custrecord_warranty_serial_item',serialNumbers[i-1]);
									newWarrantyItem.setFieldValue('custrecord_warrantyrecord',WarrantyID);
									newWarrantyItem.setFieldValue('custrecord_itemactive','T');
									var WarrantyItemID = nlapiSubmitRecord(newWarrantyItem);
									}
									catch (warrantyLineError)
									{
									nlapiLogExecution('ERROR','Error in Submission of newWarrantyRecord', warrantyLineError);
									}
							}	
			
						
						} 
					soRecord.commitLineItem('item');
					}	
			}
			try
			{
			var soID = nlapiSubmitRecord(soRecord);
			nlapiLogExecution('DEBUG', 'Submitted the PO ', soID);
			}
			catch (soError)
			{
			nlapiLogExecution('ERROR','Error in Submission of SO', soError);
			}	
		
		
return true;
}


function assignWarranty()
{


var orderType = nlapiGetFieldValue('custbody_ordetype');
var custrecord_fulfilmentlink = nlapiGetRecordId();
nlapiLogExecution('DEBUG', 'Running Aiign Warranty for fulfilment : ', 'custrecord_fulfilmentlink is : ' + custrecord_fulfilmentlink); 
var ifRecord = nlapiLoadRecord('itemfulfillment', custrecord_fulfilmentlink);
var custrecord_salesorder = ifRecord.getFieldValue('createdfrom');


//get infomration from sales order

var fields = ['trandate', 'entity']
var soinfo = nlapiLookupField('salesorder', custrecord_salesorder, fields);
var soDate = soinfo.trandate;
var customer = soinfo.entity;

if (orderType == 1)
	{

	var CustomerWarrantyStartDate = fixDate(soDate);
	var warrantyDate = new Date(CustomerWarrantyStartDate);
		var numLines = ifRecord.getLineItemCount('item');
			for (var c=1; c <= numLines; c++)
				{				
				
						var line = ifRecord.selectLineItem('item', c);				
						//ifRecord.setCurrentLineItemValue('item','custcol_line_ref', c);
						var custrecord_lotitem = ifRecord.getCurrentLineItemValue('item', 'item');	
						
						/*****
						*
						*get warranty Information from Item record
						*
						****/
						
						
						var itemfilters = new Array();
						itemfilters[0] = new nlobjSearchFilter('internalid', null, 'is', custrecord_lotitem);
			
						var itemcolumns = new Array();
						itemcolumns[0] = new nlobjSearchColumn('custitem_warrantyoffered');
						itemcolumns[1] = new nlobjSearchColumn('custitem_customerwarranty');
			
						var itemsearchresults = nlapiSearchRecord( 'item', null, itemfilters, itemcolumns);
						if (itemsearchresults != null)
						{
							for (var d = 0; itemsearchresults != null && d< itemsearchresults.length; d++)
								{
									var itemsearchresult = itemsearchresults[d];
									var custitem_warrantyoffered = itemsearchresult.getValue('custitem_warrantyoffered');
									var custitem_customerwarranty = itemsearchresult.getValue('custitem_customerwarranty');
								}
						}

						
						if(custitem_warrantyoffered == 'T')
						{
						if (isBlank(custitem_customerwarranty)){custitem_customerwarranty = 12;}
						
						var warrantyserialnumbers = ifRecord.getCurrentLineItemValue('item', 'serialnumbers');
						var quantity = ifRecord.getCurrentLineItemValue('item', 'quantity');
						
						var splits = /[\n\r]/g;
						var splitSerials = warrantyserialnumbers.split(splits);
						var serialNumbers = new Array();
						for (var s=0;s<splitSerials.length;s++)
								{

								
								var serialfilters = new Array();
								serialfilters[serialfilters.length] = new nlobjSearchFilter('name',null,'is',splitSerials[s]);

								var serialsearchresults = nlapiSearchRecord('customrecord_serialnumbers', null, serialfilters, null);
								if ( serialsearchresults != null )
									{
									for (var n=0; n<serialsearchresults.length; n++)
										{
										var serialsearchresult = serialsearchresults[n];
										serialNumbers[n] = serialsearchresult.getId( );
										}
									}
									else
									{
									
									for (var t=0;t<=quantity;t++)
										{
										serialNumbers[t] = 'No Serial Number';
										}
									}									
								
								for (var qty=1;qty<=quantity ; qty++)
									{
									var columns = new Array();
									columns[columns.length] = new nlobjSearchColumn('custrecord_warrantyrecord',null,null);
									
									var filters = new Array();
									filters[filters.length] = new nlobjSearchFilter('custrecord_warranty_serial_item',null,'anyof',serialNumbers[qty-1]);
									
									var searchresults = nlapiSearchRecord('customrecord_warrantyitem', null, filters, columns);
									if ( searchresults != null )
										{
										for (var i=0;i<searchresults.length;i++)
											{
											var searchresult = searchresults[ i ];
											
												var warrantyrecord = searchresult.getValue( 'custrecord_warrantyrecord' );
												var waRecord = nlapiLoadRecord('customrecord_warrantydetails', warrantyrecord);
												waRecord.setFieldValue('custrecord_salesorderdate', soDate);
												waRecord.setFieldValue('custrecord_salesorderlink', custrecord_salesorder);
												waRecord.setFieldValue('custrecord_customer', customer);
												waRecord.setFieldValue('custrecord_customerwarrantyperiod', custitem_customerwarranty);
												
												//Calculate and set warranty end date
												var warrantyEndDate = nlapiAddMonths(warrantyDate, custitem_customerwarranty);
												var truncWarrantyEndDate = truncDate(warrantyEndDate);
												waRecord.setFieldValue('custrecord_custwarrantyenddate',truncWarrantyEndDate);
												try
													{
													var WarrantyID = nlapiSubmitRecord(waRecord);
													nlapiLogExecution('DEBUG', 'Submitted the  WarrantyID ',  WarrantyID);
													}
													catch (waError)
													{
													nlapiLogExecution('ERROR','Error in Submission of wa', waError);
													}
												}
												
												
												
												
										}
										else
										{
										nlapiLogExecution('ERROR','No Warranty items Found Matching', 'All Done');
										}
										
									}
								
								}
						}
				}
	}
	if (orderType == 2)
	{
									nlapiLogExecution('DEBUG', 'Changeing Warranty Item on Warranty ',  'orderType is : ' + orderType);
									var numLines = ifRecord.getLineItemCount('item');
									for (var c=1; c <= numLines; c++)
										{
										var line = ifRecord.selectLineItem('item', c);
										var existingWarrantySerialNumber = ifRecord.getCurrentLineItemValue('item', 'custcol_warrantryreplaceserialnumber');	
										if (isNotBlank(existingWarrantySerialNumber))
											{
											var columns = new Array();
											columns[columns.length] = new nlobjSearchColumn('custrecord_warrantyrecord',null,null);
											
											var filters = new Array();
											filters[filters.length] = new nlobjSearchFilter('custrecord_warrantyserialnumber',null,'anyof',existingWarrantySerialNumber);
											filters[filters.length] = new nlobjSearchFilter('custrecord_itemactive',null,'is','T');
											var searchresults = nlapiSearchRecord('customrecord_warrantyitem', null, filters, columns);
											if ( searchresults != null )
												{
												for (var i=0;i<searchresults.length;i++)
													{
													var searchresult = searchresults[ i ];
															
															var custrecord_warrantyreplacementserialnumber = ifRecord.getCurrentLineItemValue('item', 'serialnumbers');
															var custrecord_lotitem = ifRecord.getCurrentLineItemValue('item', 'item');
															var warrantyItem = searchresult.getId( );
															var warrantyrecord = searchresult.getValue( 'custrecord_warrantyrecord' );
															try
																{
																	//inactivate previous Item
																	nlapiSubmitField('customrecord_warrantyitem', warrantyItem,'custrecord_inactive', 'F');
																	
																	var newWarrantyItem = nlapiCreateRecord('customrecord_warrantyitem');
																	newWarrantyItem.setFieldValue('custrecord_warrantyitem',custrecord_lotitem);
																	newWarrantyItem.setFieldValue('custrecord_warranty_serial_item',custrecord_warrantyreplacementserialnumber);
																	newWarrantyItem.setFieldValue('custrecord_warrantyrecord',warrantyrecord);
																	newWarrantyItem.setFieldValue('custrecord_itemactive','T');
																	var WarrantyItemID = nlapiSubmitRecord(newWarrantyItem);
																}
																catch (warrantyLineError)
																{
																nlapiLogExecution('ERROR','Error in Submission of newWarrantyRecord', warrantyLineError);
																}
														}
															
													}
											}	
											else
											{return false;}
										}
									}
return true;
}	
	
function createWarrantyPurchaseOrder()
{
var customer = nlapiGetFieldValue('entity');

var warrantyPurchaseOrder = nlapiCreateRecord('purchaseorder', {recordmode: 'dynamic'});

warrantyPurchaseOrder.setFieldValue('location', 29);
warrantyPurchaseOrder.setFieldValue('customform', 126);
warrantyPurchaseOrder.setFieldValue('tobeemailed', 'F');

var numLines = nlapiGetLineItemCount('item');
			for (var c=1; c <= numLines; c++)
				{				
				
				nlapiLogExecution('DEBUG', 'Going for the loop', 'c is : ' + c); 
				var line = nlapiSelectLineItem('item', c);		
				var item = nlapiGetCurrentLineItemValue('item', 'item');	
				var warrantyRecord	= nlapiGetCurrentLineItemValue('item', 'custcol_warranty');	
				warrantyStatus = nlapiLookupField('customrecord_warrantydetails', warrantyRecord, 'custrecord_wrrantystatus');
				warrantyPurchaseOrder.selectNewLineItem('item');
				warrantyPurchaseOrder.setCurrentLineItemValue('item', 'item', item);
				if (warrantyStatus == 1)
					{
					warrantyPurchaseOrder.setCurrentLineItemValue('item', 'rate', 0);
					}
				warrantyPurchaseOrder.setCurrentLineItemValue('item', 'custcol_warranty', warrantyRecord);								
				warrantyPurchaseOrder.commitLineItem('expense'); 	
				}
	
try
	{
	nlapiLogExecution('DEBUG', 'Trying to newWarrantyRecord ', 'Doing it now');
	var WarrantyPO = nlapiSubmitRecord(warrantyPurchaseOrder);
					
	}
	catch (warrantyPOError)
	{
	nlapiLogExecution('ERROR','Error in Submission of newWarrantyPORecord', warrantyPOError);
	}
return true;
}

	

function fixDate(poDate)
{


var splitDate = poDate.split("/");

var days = splitDate[0];
var months = splitDate[1];
var yearstime = splitDate[2];

var years = yearstime.split(" ");


if (days <10)
	{days = '0'+days;
	nlapiLogExecution('DEBUG', 'days has been padded ', days);
	}
if (months <10)
	{months = '0'+months;
	nlapiLogExecution('DEBUG', 'months has been padded ', months);
	}

var warrantyDate = months +'/'+days+'/'+years[0];

nlapiLogExecution('DEBUG', 'ReturnedDate is  ', warrantyDate);

return warrantyDate;
}

function convertAmericanDate(pdate)
{
var splitDate = pdate.split("/");

var months = splitDate[0];
var days = splitDate[1];
var yearstime = splitDate[2];

var years = yearstime.split(" ");


if (days <10)
	{days = '0'+days;
	nlapiLogExecution('DEBUG', 'days has been padded ', days);
	}
if (months <10)
	{months = '0'+months;
	nlapiLogExecution('DEBUG', 'months has been padded ', months);
	}

var rpDate =  days+'/'+months+'/'+years[0];

nlapiLogExecution('DEBUG', 'ReturnedDate is  ',  rpDate);

return  rpDate;
}


function truncDate(warrantyEndDate)
{

nlapiLogExecution('DEBUG', 'warrantyEndDate ', warrantyEndDate);
var dayOfMonth = warrantyEndDate.getUTCDate();
	nlapiLogExecution('DEBUG', 'dayOfMonth ', dayOfMonth);
var monthOfYear = warrantyEndDate.getUTCMonth();
	nlapiLogExecution('DEBUG', 'monthOfYear ', monthOfYear);
var Year = warrantyEndDate.getUTCFullYear();


monthOfYear += 1;

warrantyEndingDate = dayOfMonth + '/' + monthOfYear + '/' + Year;

return warrantyEndingDate;
}
function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
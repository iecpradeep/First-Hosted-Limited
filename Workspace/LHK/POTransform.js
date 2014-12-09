// Expense Entry CLear Out - Toby Davidson
// Author: Toby Davidson
// Date: 12/7/2010	


function dz_ee_ProcessedRecordClearOut()
{
var context = nlapiGetContext();
var maximumusage = 0;
var usage = 0;
var remainingusage = 0;
var previousremainingusage = 10000;
var moreRequired = 0;
var field = 'custrecord_pottransformstatus';
var record = 'customrecord_potransform';

for ( var  loop = 1; loop < 2; loop++ ) 
	{
	
					var dz_ee_filters = new Array();
					dz_ee_filters[dz_ee_filters.length] = new nlobjSearchFilter( field, null, 'anyof', '@NONE@');
					
					nlapiLogExecution('DEBUG', 'record = ' + record);
					var dz_ee_searchresults = nlapiSearchRecord( record, null, dz_ee_filters, null );
						if (dz_ee_searchresults != null)
						{
						nlapiLogExecution('DEBUG', 'Number of Records for ' + record, dz_ee_searchresults.length);
						if (dz_ee_searchresults.length == 1000) {moreRequired = 1;}
						
						for ( var t = 0; dz_ee_searchresults != null && t < dz_ee_searchresults.length ; t++ )
							{
								var paid = 0;
								var poTransformed = 0;
								var transformStatus = 3;
								var updateTransformStatus = 1;
		
								var dz_ee_searchresult = dz_ee_searchresults[ t ];
								dz_ee_RecordId = dz_ee_searchresult.getId();
									var record = nlapiLoadRecord('customrecord_potransform', dz_ee_RecordId);
									var custrecord_pottotal = record.getFieldValue('custrecord_pottotal');
									var custrecord_potinvnet = record.getFieldValue('custrecord_potinvnet');
									var custrecord_terms = record.getFieldValue('custrecord_terms');
									var exchangerate = record.getFieldValue('custrecord_potexchangerate');
									var custrecord_pottrannumber = record.getFieldValue('custrecord_pottrannumber');
									
									nlapiLogExecution('DEBUG','variables are set for  : ' + dz_ee_RecordId, 'custrecord_pottotal : ' + custrecord_pottotal + '  | custrecord_potinvnet : ' + custrecord_potinvnet  + ' | custrecord_terms : ' + custrecord_terms );
										var PO = record.getFieldValue('custrecord_po');
										
										var fields = ['custbody_processed']
										var columns = nlapiLookupField('purchaseorder', PO, fields);
										var custbody_processed = columns.custbody_processed
										
										
										if (custbody_processed = 'F')
											{
											var custrecord_invdate = record.getFieldValue('custrecord_invdate');   
											var custrecord_paiddate = record.getFieldValue('custrecord_paiddate');   
											
											
											try
												{
												var vendorBill = nlapiTransformRecord('purchaseorder', PO, 'vendorbill');
												
												vendorBill.setFieldValue('trandate', custrecord_invdate);
												vendorBill.setFieldValue('terms', custrecord_terms);
												vendorBill.setFieldValue('exchangerate', exchangerate);
												vendorBill.setFieldValue('tranid', custrecord_pottrannumber);
												var billUpdated = nlapiSubmitRecord(vendorBill);
												poTransformed=1;
												transformStatus=1;
												nlapiLogExecution('DEBUG', 'I have successfully created bill : ' + billUpdated);
												}
												catch(e)
												{
												nlapiLogExecution('DEBUG','Error Within the bill  : ' + dz_ee_RecordId, 'Error : ' + e);
												}
											
											
											if(isNotBlank(custrecord_paiddate))
												{
												try
													{
													var billPayment = nlapiTransformRecord('vendorbill', billUpdated, 'vendorpayment');
			
													billPayment.setFieldValue('trandate', custrecord_paiddate);
													var numLines = billPayment.getLineItemCount('apply');
													for (var c=1; c <= numLines; c++)
														{	
														var line = billPayment.selectLineItem('apply', c);				
														billPayment.setCurrentLineItemValue('apply','apply', 'T');
														billPayment.setCurrentLineItemValue('apply','applydate', custrecord_paiddate);
														billPayment.commitLineItem('apply');
														}
												
													
													
													
													
													
													var paymentUpdated = nlapiSubmitRecord(billPayment);
													paid =1;
													transformStatus=2;
													nlapiLogExecution('DEBUG', 'I have successfully created payment : ' + billPayment);
													}
													catch(err)
													{
													nlapiLogExecution('DEBUG','Error Within payment  : ' + dz_ee_RecordId,  'Error : ' + err);
													}
												}
												
											
											if(poTransformed==1)
											{
											nlapiSubmitField('purchaseorder', PO, 'custbody_processed', 'T');
											nlapiLogExecution('DEBUG','processed PO Record  : ' + PO);
											}
											if(paid==1)
											{
											nlapiSubmitField('vendorbill', billUpdated, 'custbody_processed', 'T');
											nlapiLogExecution('DEBUG','processed BillRecord  : ' + billUpdated);
											}
											
										}
										else
										{
										updateTransformStatus = 0;
										}
									
								
								//This section monitors the usage remaining and requeues the script to run if there are still records to process.
								
								remainingusage = context.getRemainingUsage();
								usage = (previousremainingusage - remainingusage);
								previousremainingusage = remainingusage;
								
								if (usage > maximumusage) {maximumusage = usage;}  
								if ( context.getRemainingUsage() <= maximumusage && (t+1) < dz_ee_searchresults.length )
								{
									nlapiLogExecution('AUDIT', 'Hit the limit.  got to ', t);
									var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
									if ( status == 'QUEUED' )
									break;  
									 
								}
							if(updateTransformStatus = 1)
								{
								nlapiSubmitField('customrecord_potransform', dz_ee_RecordId, 'custrecord_pottransformstatus', transformStatus);
								}
							}
						}
	
			
						if ( moreRequired == 1 )
						{
							nlapiLogExecution('AUDIT', 'There were 1000 results.  Queued for reexecution to check', moreRequired);
							var status = nlapiScheduleScript(context.getScriptId(), context.getDeploymentId())
							if ( status == 'QUEUED' )
							break;  
						}			 
	}			
return true;
}


function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
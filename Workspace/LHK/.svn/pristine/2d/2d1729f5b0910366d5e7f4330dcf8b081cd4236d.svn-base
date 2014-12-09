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
var field = 'custbody_lhk_transform';

var record = new Array()

//record[record.length] = 'vendorpayment';
//record[record.length] = 'vendorbill';
//record[record.length] = 'itemreceipt';
//record[record.length] = 'purchaseorder';
//record[record.length] = 'customrecord_updaterecords';
//record[record.length] = 'customrecord_potransform';
//record[record.length] = 'salesorder';
record[record.length] = 'customrecord_sold_items_storage';



for ( var  loop = 0; loop < record.length; loop++ )
{
				nlapiLogExecution('DEBUG', '1. loop is  = ' + loop);
				var dz_ee_filters = new Array();
				dz_ee_filters[0] = new nlobjSearchFilter( 'custrecord_parent_customer', null, 'anyof', '2976' );
                                //dz_ee_filters[1] = new nlobjSearchFilter( 'mainline', null, 'is', 'T' );

				nlapiLogExecution('DEBUG', 'record = ' + record[loop]);
				//
				var dz_ee_searchresults = nlapiSearchRecord( record[loop], null, dz_ee_filters, null );
				//var dz_ee_searchresults = nlapiSearchRecord( record[loop], null, null, null );
					if (dz_ee_searchresults != null)
					{
					nlapiLogExecution('DEBUG', 'Number of Records for ' + record[loop], dz_ee_searchresults.length);
					if (dz_ee_searchresults.length == 1000) {moreRequired = 1;}
					
					for ( var t = 0; dz_ee_searchresults != null && t < dz_ee_searchresults.length; t++ )
						{
							var dz_ee_searchresult = dz_ee_searchresults[ t ];
							dz_ee_RecordId = dz_ee_searchresult.getId();
							//var shipdate = nlapiLookupField('salesorder', dz_ee_RecordId, 'shipdate');
							try{
								nlapiDeleteRecord(record[loop], dz_ee_RecordId);
								//var itemFulfillment = nlapiTransformRecord('salesorder', dz_ee_RecordId, 'itemfulfillment'); 
								//var fulfillmentId = nlapiSubmitRecord(itemFulfillment, true); 
								//var fulfilset = nlapiLoadRecord('itemfulfillment', itemfulfillment);
								//fulfilset.setFieldValue('trandate', shipdate);
								//fulfilset.setFieldValue('shipstatus', 3 );
								//var fulfilid = nlapiSubmitRecord(fulfilset, true);
								nlapiLogExecution('DEBUG','Trying to Delete Record : ' + dz_ee_RecordId);
								}
								catch(e)
								{
								nlapiLogExecution('DEBUG','Problem trying to Transform Record : ' + dz_ee_RecordId, e);
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
function countPOLines()
{
var record = 'purchaseorder';
var context = nlapiGetContext();
var maximumusage = 0;
var usage = 0;
var remainingusage = 0;
var previousremainingusage = 10000;
var moreRequired = 0;

for ( var  loop = 1; loop < 2; loop++ ) 
	{
	
					var dz_ee_filters = new Array();
					dz_ee_filters[dz_ee_filters.length] = new nlobjSearchFilter( 'custbody_polinecountchecked', null, 'is', 'F');
					dz_ee_filters[dz_ee_filters.length] = new nlobjSearchFilter( 'mainline', null, 'is', 'T');
					
					nlapiLogExecution('DEBUG', 'record = ' + record);
					var dz_ee_searchresults = nlapiSearchRecord( record, null, dz_ee_filters, null );
						if (dz_ee_searchresults != null)
						{
						
						nlapiLogExecution('DEBUG', 'Number of Records for ' + record, dz_ee_searchresults.length);
						if (dz_ee_searchresults.length == 1000) {moreRequired = 1;}
						
						for ( var t = 0; dz_ee_searchresults != null && t < dz_ee_searchresults.length ; t++ )
							{
							var sameLines = 1;
							var dz_ee_searchresult = dz_ee_searchresults[ t ];
							dz_ee_RecordId = dz_ee_searchresult.getId();
							var poRecord = nlapiLoadRecord('purchaseorder', dz_ee_RecordId);
							var poNumLines = poRecord.getLineItemCount('item');
	
							var pot_filters = new Array();
							pot_filters[pot_filters.length] = new nlobjSearchFilter( 'custrecord_po', null, 'anyof', dz_ee_RecordId);
							pot_filters[pot_filters.length] = new nlobjSearchFilter( 'custrecord_transactiontype', null, 'anyof', 16);
					
							var pot_searchresults = nlapiSearchRecord( 'customrecord_potransform', null, pot_filters, null );
								if (pot_searchresults != null)
								{
								var poTransformCount = pot_searchresults.length;
								
								if (poTransformCount!=poNumLines)
									{
									sameLines = 0;
									}
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
							
							if(sameLines!=1)
								{
								nlapiLogExecution('DEBUG', 'Different Number of POs for TRN : ' + dz_ee_RecordId);
								}
								poRecord.setFieldValue('custbody_polinecountchecked', 'T');
								var poChecked = nlapiSubmitRecord(poRecord);
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
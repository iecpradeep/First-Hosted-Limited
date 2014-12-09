// Update Existing Records not supported by CSV - Brendon Rice
// Author: Brendon Rice
// Date: 20/02/2012


function updateRecords()
{
var record = 'customrecord_updaterecords';

for ( var  loop = 1; loop < 2; loop++ ) 
	{
					
					nlapiLogExecution('DEBUG', 'record = ' + record);
					var dz_ee_filters = new Array();
					dz_ee_filters[dz_ee_filters.length] = new nlobjSearchFilter( 'custrecord_processed', null, 'is', 'F');
					
					var dz_ee_searchresults = nlapiSearchRecord( record, null, dz_ee_filters, null );
						if (dz_ee_searchresults != null)
						{					
						for ( var t = 0; dz_ee_searchresults != null && t < dz_ee_searchresults.length ; t++ )
							{
								var dz_ee_searchresult = dz_ee_searchresults[ t ];
								dz_ee_RecordId = dz_ee_searchresult.getId();
									var record = nlapiLoadRecord('customrecord_updaterecords', dz_ee_RecordId);
									var custrecord_recordid = record.getFieldValue('custrecord_recordid');
									//var custrecord_updatevalue = record.getFieldValue('custrecord_updatevalue');
											try
												{
												var UpdateRecord = nlapiLoadRecord('purchaseorder',custrecord_recordid,null);

												UpdateRecord.setFieldValue('location', 4);

												var ReceiptUpdated = nlapiSubmitRecord(UpdateRecord);
												record.setFieldValue('custrecord_processed', 'T');
												var recordupdatedid = nlapiSubmitRecord(record);
												nlapiLogExecution('DEBUG', 'Successfully updated : ' + UpdateRecord);
												}
												catch(e)
												{
												nlapiLogExecution('DEBUG','Error Within the update record : ' + dz_ee_RecordId, 'Error : ' + e);
												}
									
							}
						}
		 
	}			
return true;
}
function scheduleContractCases(type)
{


				var custrecord_createvisits	= nlapiGetFieldValue('custrecord_createvisits');
				
				if (isNotBlank(custrecord_createvisits))
				{
				var contractNumber = nlapiGetRecordId();	
				var custrecord_citem_contract				= nlapiGetFieldValue('custrecord_citem_contract');
				var custrecord_citem_dateinstalled 		= nlapiGetFieldValue('custrecord_citem_dateinstalled');
				var custrecord_citem_numberofvisits	= nlapiGetFieldValue('custrecord_citem_numberofvisits');
				var custrecord_citem_warrantyperiod 	= nlapiGetFieldValue('custrecord_citem_warrantyperiod');
				var custrecord_citem_visitfrequency 	= nlapiGetFieldValue('custrecord_citem_visitfrequency');
				var custrecord_citem_salesorder			= nlapiGetFieldValue('custrecord_citem_salesorder');
				
				var warrantyVisit = nlapiStringToDate(custrecord_citem_dateinstalled);
				warrantyVisit = nlapiAddMonths(warrantyVisit, custrecord_citem_visitfrequency);
				
				for(var i = 1; i <= custrecord_citem_numberofvisits; i++)
					{
					var record = nlapiCreateRecord('supportcase');
					record.setFieldValue('company', custrecord_citem_contract);
					record.setFieldValue('startdate', nlapiDateToString(warrantyVisit));
					record.setFieldValue('custevent_case_duedate', nlapiDateToString(warrantyVisit));
					record.setFieldValue('custevent_case_contractitem', contractNumber);
					record.setFieldValue('title', 'Warranty Contract Visit : ' + i);
					try
						{
						var newId = nlapiSubmitRecord(record, true);
						nlapiSetFieldValue('custrecord_createvisits', 'F');
						}
					catch(e)
						{
						nlapiLogExecution('ERROR', 'FAILED TO SUBMIT RECORD', e);
						return false;
						}
					
					warrantyVisit = nlapiAddMonths(warrantyVisit, custrecord_citem_visitfrequency);
					}
				}
return true;

function isBlank(fld) {return (fld==null||fld==''||fld=='undefined');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
}
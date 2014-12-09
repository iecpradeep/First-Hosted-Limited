function scheduleContractCases(type)
{

 	var filters = new Array();
	filters[0] = new nlobjSearchFilter( 'custrecord_createvisits', null, 'is', 'T' );

	
	// Execute the search. You must specify the internal ID of the record type.
	var searchresults = nlapiSearchRecord( 'customrecord_contractitem', null, filters, null );
	
	for ( var x = 0; searchresults != null && x < searchresults.length; x++ ) 
		{
			nlapiLogExecution('DEBUG', 'x is :  ', x); 
			var searchresult = searchresults[ x ];
			var contractRecordId = searchresult.getId();
			nlapiLogExecution('DEBUG', 'Contract Record is is :  ', contractRecordId); 
				
				var CIRecord = nlapiLoadRecord('customrecord_contractitem', contractRecordId);	
				var custrecord_citem_contract				= CIRecord.getFieldValue('custrecord_citem_contract');
				var custrecord_citem_contractitem		= CIRecord.getFieldValue('custrecord_citem_contractitem');
				var custrecord_citem_dateinstalled 		= CIRecord.getFieldValue('custrecord_citem_dateinstalled');
				var custrecord_citem_salesorder			= CIRecord.getFieldValue('custrecord_citem_salesorder');
				var custrecord_citem_customer			= CIRecord.getFieldValue('custrecord_citem_customer'); 
				
				var itemRecord = nlapiLoadRecord('kititem', custrecord_citem_contractitem);
				
				var numLines = itemRecord.getLineItemCount('member');
				for ( var i = 1; numLines != null && i <= numLines; i++ ) 
				{
				itemRecord.selectLineItem('member', i);
				var warranty_item 	= itemRecord.getLineItemValue('member', 'item', i)
				
				var itemfilters = new Array();
				itemfilters[0] = new nlobjSearchFilter('internalid', null, 'is', warranty_item);
	
				var itemcolumns = new Array();
				itemcolumns[0] = new nlobjSearchColumn('type');
	
				var itemsearchresults = nlapiSearchRecord( 'item', null, itemfilters, itemcolumns);
				if (itemsearchresults != null)
					{
						for (var d = 0; itemsearchresults != null && d< itemsearchresults.length; d++)
							{
								nlapiLogExecution('DEBUG', 'd is :  ', d); 
								nlapiLogExecution('DEBUG', 'itemsearchresults.length is :  ', itemsearchresults.length); 
								itemsearchresults.length
								var itemsearchresult = itemsearchresults[d];
								var itemtype = itemsearchresult.getRecordType();
								var warrantyItemRecord = nlapiLoadRecord(itemtype, warranty_item);
								var visitTitle = warrantyItemRecord.getFieldValue('itemid');
								var ofset = warrantyItemRecord.getFieldValue('custitem_visitfrequency');
								if((isBlank(ofset)) || isNaN(ofset))
								{
								ofset = 180;
								}
								var warrantyVisit = nlapiStringToDate(custrecord_citem_dateinstalled);
								warrantyVisit = nlapiAddDays(warrantyVisit, ofset);
				
								var record = nlapiCreateRecord('supportcase');
								record.setFieldValue('company', custrecord_citem_contract);					
								record.setFieldValue('startdate', nlapiDateToString(warrantyVisit));
								record.setFieldValue('custevent_case_duedate', nlapiDateToString(warrantyVisit));
								record.setFieldValue('custevent_case_contractitem', contractRecordId);
								record.setFieldValue('title', visitTitle);
								try
									{
									var newId = nlapiSubmitRecord(record, true);
									nlapiLogExecution('DEBUG', 'newId for new Visit record is :  ', newId); 
									}
								catch(e)
									{
									nlapiLogExecution('ERROR', 'FAILED TO SUBMIT RECORD', e);
									return false;
									}
							}
				}
				
			}
				try
					{
					CIRecord.setFieldValue('custrecord_createvisits', 'F');
					var ContractRecordID = nlapiSubmitRecord(CIRecord, true);
					}
				catch(error)
					{
					nlapiLogExecution('ERROR', 'FAILED TO SUBMIT RECORD', error);
					}
					
				
		}
return true;
}



function isBlank(fld) {return (fld==null||fld==''||fld=='undefined');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}
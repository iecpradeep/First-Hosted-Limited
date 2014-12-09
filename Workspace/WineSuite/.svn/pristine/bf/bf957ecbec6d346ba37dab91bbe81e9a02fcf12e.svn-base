function setReservationStatus(type)
{
	if (type == 'create')
	{
	nlapiSetFieldValue('custbody_fhlreservationstatus', 1);
	}
	
	if (type == 'edit')
	{
	nlapiSetFieldValue('custbody_fhlreservationstatus', 2);
	}
}


function onSave(type)
{
	if (type == 'edit')
	{
	var totalGP = 0;
	var totalCost = 0;
	var trnType = nlapiGetRecordType();
	var context = nlapiGetContext();
	var transactionNumber = nlapiGetRecordId();
	var numLines = nlapiGetLineItemCount('item');
	var customer = 	nlapiGetFieldValue('entity');
	nlapiLogExecution('DEBUG', 'Transaction ' + transactionNumber , 'has  : ' + numLines + ' Line Items'); 	
	
	if (numLines > 0)
		{
		// numLines > 0
		var i = 1;
		for (i=1; i <= numLines; i++)
			{
			nlapiLogExecution('DEBUG', 'Going for the loop', 'i is : ' + i); 
			nlapiSelectLineItem('item', i);
			
					var columns = new Array();
					columns[columns.length] = new nlobjSearchColumn('custrecord_lotres_purchlinerate',null,null);

					
				
					var filters = new Array();
					filters[filters.length] = new nlobjSearchFilter('custrecord_lotres_saleid',null,'anyof', transactionNumber);
					filters[filters.length] = new nlobjSearchFilter('custrecord_lotres_salelineid',null,'equalTo', i);
		
					
				var searchresults = nlapiSearchRecord('customrecord_lot_reservation', null, filters, columns);
				if ( searchresults != null )
					{
					for (var b=0;b<searchresults.length;b++)
						{
						var searchresult = searchresults[ b ];
						var reservationID = searchresult.getId( );
						var purchaseRate = searchresult.getValue( 'custrecord_lotres_purchlinerate' );
						
						var rate = parseFloat(nlapiGetCurrentLineItemValue('item', 'rate'));
						var quantity = nlapiGetCurrentLineItemValue('item', 'quantity');
						nlapiSetCurrentLineItemValue('item','custcol_lotreservcation',reservationID,true, true);
						nlapiSetCurrentLineItemText('item','costestimatetype','Custom',true, true);
						nlapiSetCurrentLineItemValue('item', 'custcol_fhl_purchase_rate', nlapiFormatCurrency(purchaseRate), true, true);
						var gp = ((rate - purchaseRate)*quantity);
						var gc = (purchaseRate*quantity);
						totalGP += gp;
						totalCost += gc;
						nlapiSetCurrentLineItemValue('item', 'custcol_fhl_gp', nlapiFormatCurrency(gp), true, true);
							try
							{
							nlapiCommitLineItem('item');
							}
						catch (err)
							{
							nlapiLogExecution('ERROR', 'ERROR on Update of the line', 'ERROR CODE : ' + err);
							}	
						}
					//nlapiSetFieldValue('custbody_fhl_gross_profit', nlapiFormatCurrency(totalGP));
					var GM = (totalGP / totalCost) * 100;
					GM = round(GM);
					//nlapiSetFieldValue('custbody_fhl_gross_margin', GM);
					}
				
			}
			
	
	return true;
	}
	}
}

function round(n) {return Math.round(n*100+((n*1000)%10>4?1:0))/100;}


function isBlank(fld) {return (fld==null||fld=='');}
function isNotBlank(fld) {return (fld!=null&&fld!='');}

function isTrue(fld) {return (fld=='T'||fld=='Y'||fld==true);}
function isNotTrue(fld) {return (fld!='T'&&fld!='Y'&&fld!=true);}
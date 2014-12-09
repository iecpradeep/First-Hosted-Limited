function on_field_change(type, name)
{

	var shipment_id = 0;

	if (name == 'custcol1')
	{

		shipment_id = nlapiGetCurrentLineItemValue('item', 'custcol1');
	}

	if (shipment_id == '1')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody6'));
	}	

	if (shipment_id == '2')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody7'));
	}

	if (shipment_id == '3')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody8'));
	}

	if (shipment_id == '4')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody9'));
	}

	if (shipment_id == '5')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody10'));
	}
	if (shipment_id == '6')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody20'));
	}
	if (shipment_id == '7')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody21'));
	}
	if (shipment_id == '8')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody22'));
	}
	if (shipment_id == '9')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody23'));
	}
	if (shipment_id == '10')
	{
		nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody24'));
	}




	return true;
}

// Calculate estimated commission for a sales order or opportunity
function calculateCommission()
{
	// get current partner internal id
	var partner = nlapiGetFieldValue('partner');

	if (partner)
	{
		
		// load partner record
		var partnerRecord = nlapiLoadRecord('partner',partner);
		
		// retrieve commission rate from partner record
		var commissionRate = (parseInt(partnerRecord.getFieldValue('custentity_partnercommrate')))/100;

		if (commissionRate != null && commissionRate > 0)
		{
			// get order gross total and tax total and calculate net
			var orderTotal = nlapiGetFieldValue('total');
			var taxTotal = nlapiGetFieldValue('taxtotal');
			
			var netTotal = orderTotal - taxTotal;
					
			// calculate commission
			var commission = netTotal * commissionRate;
			
			// set commission fields
			nlapiSetFieldValue('custbody_estcommission',commission,false,false);
						
		} //if
		
	} //if
	
	return true;
	
} //function

function calculateCommission()
{
	// get current partner internal id
	var partner = nlapiGetFieldValue('partner');
	alert('partner=' + partner);
	if (partner)
	{
		
		// load partner record
		var partnerRecord = nlapiLoadRecord('partner',partner);
		
		// retrieve commission rate from partner record
		var commissionRate = (parseInt(partnerRecord.getFieldValue('custentity_partnercommrate')))/100;
		alert('commrate=' + commissionRate);
		if (commissionRate != null && commissionRate > 0)
		{
			// get order gross total and tax total and calculate net
			var orderTotal = nlapiGetFieldValue('total');
			var taxTotal = nlapiGetFieldValue('taxtotal');
			
			alert('ordertotal=' + orderTotal);
			alert('taxtotal=' + taxTotal);
			
			var netTotal = orderTotal - taxTotal;
			alert('netTotal=' + netTotal);
					
			// calculate commission
			var commission = netTotal * commissionRate;
			alert('commission=' + commission);
			
			
			
		} //if
		
	} //if
	
	return true;
	
} //function

function on_field_change(type, name)
{

	if (name == 'custcol1')
	{
		var shipment_id = nlapiGetCurrentLineItemValue('item', 'custcol1');
	
		if (shipment_id != '' && shipment_id != null)
		{
			switch(shipment_id) 
			{
				case '1':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody6'));
				break;
			
				case '2':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody7'));
				break;
			
				case '3':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody8'));
				break;
			
				case '4':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody9'));
				break;
			
				case '5':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody10'));
				break;
			
				case '6':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody20'));
				break;
			
				case '7':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody21'));
				break;
	
				case '8':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody22'));
				break;
			
				case '9':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody23'));
				break;
			
				case '10':
					nlapiSetCurrentLineItemValue('item', 'custcol2',nlapiGetFieldValue('custbody24'));
				break;
				
			}  //switch
	
		} //if
		else
		{
				nlapiSetCurrentLineItemValue('item', 'custcol2',null,('custbody24'),false,false);
		} //else
	
	} //if

	if (name == 'custbody6' || name == 'custbody7' || name == 'custbody8' || name == 'custbody9'
		|| name == 'custbody10' || name == 'custbody20' || name == 'custbody21' || name == 'custbody22'
		|| name == 'custbody23' || name == 'custbody24') 
	{
		var targetshipdate = nlapiGetFieldValue(name);
		var targetshipid;
		
		switch (name)
		{
			case 'custbody6':
				targetshipid = '1';		
			break;
			
			case 'custbody7':
				targetshipid = '2';		
			break;

			case 'custbody8':
				targetshipid = '3';		
			break;
			
			case 'custbody9':
				targetshipid = '4';		
			break;

			case 'custbody10':
				targetshipid = '5';		
			break;

			case 'custbody20':
				targetshipid = '6';		
			break;

			case 'custbody21':
				targetshipid = '7';		
			break;

			case 'custbody22':
				targetshipid = '8';		
			break;

			case 'custbody23':
				targetshipid = '9';		
			break;

			case 'custbody24':
				targetshipid = '10';		
			break;
			
		} //switch		
		 
		// cycle through order lines looking for matching shipment Id then change the date
		
		var lineCount = nlapiGetLineItemCount('item');
		
		if (lineCount != 0 && lineCount != null)
		{
			
			
			for (i=1; i <= lineCount; i++)
			{
				var lineshipid = nlapiGetLineItemValue('item','custcol1',i);
				
				if (lineshipid == targetshipid) 
				{
					nlapiSetLineItemValue('item', 'custcol2', i, targetshipdate);
				} //if
					
			} //for		
		
		} //if
		
	} //if

	return true;

} //function

function calculateCommission()
{
	
	// cycle through order lines and check shipment details
	
	var shipidmissing = 0;
	var shipdatemissing = 0;
	
	var lineCount = nlapiGetLineItemCount('item');
	
	if (lineCount != 0 && lineCount != null)
	{
			
		for (i=1; i <= lineCount; i++)
		{
			var lineshipid = nlapiGetLineItemValue('item','custcol1',i);
			var lineshipdate = nlapiGetLineItemValue('item','custcol2',i);
			
			if (lineshipid == null || lineshipid == '') 
			{
				shipidmissing = 1;
			} //if

			if (lineshipdate == null || lineshipdate == '') 
			{
				shipdatemissing = 1;
			} //if				
		} //for		
	
		if (shipidmissing == 1)
		{
			alert('Warning: One or more lines are missing a shipment ID.');
		} //if
		
		if (shipdatemissing == 1)
		{
			alert('Warning: One or more lines do not have a shipment date.');
		
		} //if
	
	
	
	} //if
	
	
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

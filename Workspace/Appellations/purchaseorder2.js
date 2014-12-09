function lineAdded()
{
	
	var POType = nlapiGetFieldValue('custbody_po_order_type');
		// if PO type is in bond or DP(Private) then set tax item to Exempt
		
			
			if (POType == '2'|| POType == '3')
			{
			nlapiSetCurrentLineItemValue('item','taxcode',13, true, true);				
			} //if
return true;
}
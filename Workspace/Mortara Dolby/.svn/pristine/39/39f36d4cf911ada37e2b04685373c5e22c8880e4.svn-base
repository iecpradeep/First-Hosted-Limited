function populateAddressFields(type, name)
{
	var companyID = 0;
	var recCompany = null;
	var addrLineCount = 0;
	var fldShipAddr = null;
	var fldBillAddr = null;
	var addrDetails = new Array();
	var addrLabels = new Array();
	
	if (name == 'company')
	{
		companyID = nlapiGetFieldValue(name);
		recCompany = nlapiLoadRecord('customer', companyID);
		
		addrLineCount = recCompany.getLineItemCount('addressbook');
		
		fldBillAddr = recCompany.getField('custpage_sl_billingaddress');
		fldShipAddr = recCompany.getField('custpage_sl_shippingaddress');
		
		for (var i = 1; i < addrLineCount; i++)
		{
			addrDetails[i-1] = recCompany.getLineItemValue('addressbook', 'internalid', i);
			addrLabels[i-1] = recCompany.getLineItemValue('addressbook', 'label', i);
		}
		
		if (addrDetails.length == addrLabels.length)
		{
			for (var i = 0; i < addrDetails.length; i++)
			{
				fldBillAddr.addSelectOption(addrDetails[i], addrLabels[i]);
				fldShipAddr.addSelectOption(addrDetails[i], addrLabels[i]);
			}
		}

	}
}

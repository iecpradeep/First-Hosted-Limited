function addAddressPrefix(type, name)
{
	var customForm = 0;
	var addr1 = '';
	var addr2 = '';
	var entityID = 0;
	var prefixedLabel = '';
	
	customForm = nlapiGetFieldValue('customform');
	
	if (customForm == 54)
	{
		if (type == 'addressbook' && name != 'label')
		{
			addr1 = nlapiGetCurrentLineItemValue(type, 'addr1');
			addr2 = nlapiGetCurrentLineItemValue(type, 'addr2');

			entityID = nlapiGetFieldValue('entityid');
			prefixedLabel = entityID + ' ' + ':' + ' ' + addr1 + ' ' + addr2;

			nlapiSetCurrentLineItemValue(type, 'label', prefixedLabel);
		}
	} 	
}

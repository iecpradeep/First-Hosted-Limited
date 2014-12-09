function availabletopromise()
{
	var lot = nlapiGetFieldValue('id');
	var invoiceSearchFilters = new Array();
	var invoiceSearchColumns = new Array();
	invoiceSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'F');
	invoiceSearchFilters[1] = new nlobjSearchFilter('custcol_tran_rotation', null, 'anyof', lot);
	
	invoiceSearchColumns[0] = new nlobjSearchColumn('quantity');
	
	var invoiceSearchResults = nlapiSearchRecord('invoice', null, invoiceSearchFilters, invoiceSearchColumns);
	var qtysold = 0;
	if (invoiceSearchResults)
	{
		for (var j=0; j<invoiceSearchResults.length; j++)
		{
			qtysold += parseFloat(invoiceSearchResults[j].getValue(invoiceSearchColumns[0]));
		}
	}
	
	var purchaseSearchFilters = new Array();
	var purchaseSearchColumns = new Array();
	
	purchaseSearchFilters[0] = new nlobjSearchFilter('mainline', null, 'is', 'F');
	purchaseSearchFilters[1] = new nlobjSearchFilter('custcol_tran_rotation', null, 'anyof', lot);
	
	purchaseSearchColumns[0] = new nlobjSearchColumn('quantity');
	
	var purchaseSearchResults = nlapiSearchRecord('purchaseorder', null, purchaseSearchFilters, purchaseSearchColumns);
	var qtypurchased = 0;
		if (purchaseSearchResults)
		{
			for (var j=0; j<purchaseSearchResults.length; j++)
			{
				qtypurchased += parseFloat(purchaseSearchResults[j].getValue(purchaseSearchColumns[0]));
			}
		}
	nlapiSetFieldValue('custrecord_loyqtyordered',qtypurchased,false,false);
	nlapiSetFieldValue('custrecord_lotqtysold',qtysold,false,false);
	qtyavailable = qtypurchased-qtysold;
	nlapiSetFieldValue('custrecord_loycurrentavailable',qtyavailable,false,false);
	return true;
}
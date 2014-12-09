//[TODO:] Coding Standards :-)



var value = '';

/***********************
 * fieldChanged - fired when any field within NetSuite is changed
 * 
 * @param type
 * @param name
 * @param linenum
 */
function fieldChanged(type, name, linenum)
{
	if(type == 'expense') 
	{
		if(name == 'amount')
		{
			nlapiSetCurrentLineItemValue('expense', 'taxcode', null, true, false);
		}

		//nlapiSetCurrentLineItemText('expense', 'taxcode', ' ', true, false);
		//value = nlapiGetCurrentLineItemValue(type, name);
		//alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum + '\n\nvalue=' + value);
	}
} 





function setTaxLineToExempt()
{
	//nlapiSetLineItemValue('expense', 'taxcode', 1, 87);

	nlapiSelectLineItem('expense', 1);
	nlapiSetCurrentLineItemValue('expense', 'taxcode', null, true, false);
	//nlapiCommitLineItem('expense');
}
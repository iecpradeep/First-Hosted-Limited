function addrSuitelet()
{
	var form = nlapiCreateForm('Addresses', true);
	
	var billSelect = form.addField('custpage_sl_billingaddress', 'select', 'Billing Address');
	var shipSelect = form.addField('custpage_sl_shippingingaddress', 'select', 'Shipping Address');
	
	billSelect.addSelectOption('', '');
	billSelect.addSelectOption('test1', 'Test 1');
	billSelect.addSelectOption('test2', 'Test 2');
//	billSelect.setMandatory(true);
	
	shipSelect.addSelectOption('', '');
	shipSelect.addSelectOption('test1', 'Test 1');
	shipSelect.addSelectOption('test2', 'Test 2');
//	shipSelect.setMandatory(true);
	
	var script = printInternalIDs(form);
	
	var submit = form.addButton('custpage_sl_btnsubmit', 'Submit', printInternalIDs(billSelect, shipSelect));
	
	response.writePage(form);
}

function printInternalIDs(billSelect, shipSelect)
{	
	nlapiLogExecution('DEBUG', 'Test', billSelect.length + ' ' + shipSelect);
	
	var hello = 'hello world';

//	if (billSelect.length != 0 && shipSelect.length != 0)
//	{
		nlapiLogExecution('DEBUG', 'Test', hello);
//	}
//	else
//	{
		nlapiLogExecution('DEBUG', 'Failed', 'Field(s) not populated');
//	}
}

function beforeLoad(type)
{
	var currentContext = nlapiGetContext();
	
	if(type == 'view' && currentContext.getExecutionContext() == 'userinterface')
	{    

		var currentTransaction = nlapiGetRecordId();
		
		var linkURL = nlapiResolveURL('SUITELET',23,1);
				
		form.addButton('custpage_createvatduty','TEST2',"document.location='"+linkURL+"&custparam_tranid="+currentTransaction+"'");

	}

	return true;
}

function testSuitelet(request,response)
{
	var transactionId = request.getParameter('custparam_tranid');
	
	var transRecord = nlapiLoadRecord('invoice',transactionId);
	
	var customer = transRecord.getFieldValue('entity');
	
	// create a new invoice record
	
	var newRecord = nlapiCreateRecord('invoice',{recordmode: 'dynamic'});
		
	// set header information
	
	newRecord.setFieldValue('entity', customer);
	newRecord.setFieldValue('memo', 'TEST - DB');
	newRecord.setFieldValue('exchangerate', 1.00);
	newRecord.setFieldValue('class', '2');	
		
	// enter line items
	
	newRecord.selectNewLineItem('item');
	newRecord.setCurrentLineItemValue('item', 'item','10');
	newRecord.setCurrentLineItemValue('item', 'quantity',1);
	newRecord.setCurrentLineItemValue('item', 'price','-1');
	newRecord.setCurrentLineItemValue('item', 'description','TEST TEST TEST');
	newRecord.setCurrentLineItemValue('item', 'taxcode','4'); 						//std rate
	newRecord.setCurrentLineItemValue('item', 'rate',1000);
	newRecord.commitLineItem('item');
					
	// submit new record
	
	var id = nlapiSubmitRecord(newRecord);
		
	// open record in EDIT mode in new window
	
	var newRecordURL = nlapiResolveURL('RECORD', 'invoice', id, 'EDIT');
	
	window.open(newRecordURL);
	
	return true;
	
}




function test()
{
	alert('version 1.1');
	
	var customer = nlapiGetFieldValue('entity');
	
	// create a new invoice record
	
	var newRecord = nlapiCreateRecord('invoice',{recordmode: 'dynamic'});
	
	
	// set header information
	
	newRecord.setFieldValue('entity', customer);
	newRecord.setFieldValue('memo', 'TEST - DB');
	newRecord.setFieldValue('exchangerate', 1.00);
	newRecord.setFieldValue('class', '2');	
	
	
	// enter line items
	
	newRecord.selectNewLineItem('item');
	newRecord.setCurrentLineItemValue('item', 'item','10');
	newRecord.setCurrentLineItemValue('item', 'quantity',1);
	newRecord.setCurrentLineItemValue('item', 'price','-1');
	newRecord.setCurrentLineItemValue('item', 'description','TEST TEST TEST');
	newRecord.setCurrentLineItemValue('item', 'taxcode','4'); 						//std rate
	newRecord.setCurrentLineItemValue('item', 'rate',1000);
	newRecord.commitLineItem('item');
			
	// submit new record
	
	var id = nlapiSubmitRecord(newRecord);
		
	// open record in EDIT mode in new window
	
	var newRecordURL = nlapiResolveURL('RECORD', 'invoice', id, 'EDIT');
	
	window.open(newRecordURL);
	
	NLMultiButton_doAction('multibutton_submitter','submitter')
	
	return true;
}

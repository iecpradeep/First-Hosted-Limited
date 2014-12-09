function setDefaults()
{
	var form = nlapiGetFieldValue('customform');
	
	switch (form)
	{
		case '142':
		//dt brown
		nlapiSetFieldValue('department','3',false,false);
		break;
		
		case '143':
		//fothergills
		nlapiSetFieldValue('department','1',false,false);
		break;
		
		case '144':
		//woolmans
		nlapiSetFieldValue('department','2',false,false);
		break;
	
	}

	return true;
		
}

function onChange(type,name)
{
	if (name=='custbody_brand_customer')
	{
		var customer = nlapiGetFieldValue(name);
		
		nlapiSetFieldValue('entity',customer,false,false);
		return true;
		
	}

}

function printButton()
{
	var employee = 0;
	var form = nlapiGetFieldValue('customform');
	
	switch (form)
	{
		case '142':
		//dt brown
		employee = 588;
		break;
		
		case '143':
		//fothergills
		employee = 589;
		break;
		
		case '144':
		//woolmans
		employee = 590;
		break;
	
	}

	nlapiSendEmail(employee,'br@firsthosted.co.uk','ORDER CONFIRMATION','Order Confirmation Body Text');
	
	return true;
	
	
}

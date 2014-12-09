function main_createfile()
{
	
	writeFile();
	return true;	
	
} //function main_createfile()


/***************************************************
 * function getOrders()
 * Purpose:	Search out orders for ROI subsidiary
 * Returns: Array of orders
 ***************************************************/

function getOrders()
{
	var subsidiaryId = 10; //internal ID of ROI subsidiary
	
	var orderColumns = new Array;
	
	orderColumns[0] = new nlobjSearchColumn('tranid');
	
	var orderFilters = new Array;
	
	orderFilters[0] = new nlobjSearchFilter('subsidiary',null,'is',subsidiaryId);
	orderFilters[1] = new nlobjSearchFilter('status',null,'is','Pending Fulfillment');
	orderFilters[2] = new nlobjSearchFilter('type',null,'is','Sales Order');
	
	
	var orderSearchResults = nlapiSearchRecord('transaction',null,orderFilters,orderColumns);
	
	
		
	
} //function getOrders()

/***************************************************
 * function writeFile()
 * Purpose:	Create file and attach to email
 * Returns: boolean
 ***************************************************/

function writeFile()
{


	var connectionstringarray = new Array();
	var connectionstring = '';
	
	for (i=0;i<2000; i++)
	{
		connectionstringarray[i] = 'TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST|TEST\n';
	}

	for (j=0;j<2000; j++)
	{
		connectionstring = connectionstring + connectionstringarray[j];
	}

	var newAttachment = nlapiCreateFile('testfile.csv', 'PLAINTEXT', connectionstring);

	var newEmail = nlapiSendEmail(1, 'darren.birt@firsthosted.co.uk', 'TEST EMAIL', 'File attached', null, null, null, newAttachment); 

	return true;
	
} //function writeFile()


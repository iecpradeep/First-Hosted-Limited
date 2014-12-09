function printMatrix(thisType) {
	// Get current record id and submit to suitelet for XML ==> PDF printing
	//var reportType = nlapiGetContext().getSetting('SCRIPT', 'custscript_reporttype');
	//alert('Param=' + reportType);
	var deployid = '1';
	switch (thisType) {
        case 'ORD':
            deployid = '1';
            break;
        case 'INV':
            deployid = '1';
            break;
        case 'CRN':
            deployid = '2';
            break;
        case 'PIN':
            deployid = '1';
            break;
	}
	alert('type=' + thisType);
	var thisid = nlapiGetRecordId();
	if(thisType == '' || thisType == null ) thisType = 'ORD'; // Sales Order
	var url = '/app/site/hosting/scriptlet.nl?script=2&deploy=' + deployid + '&custparam_soid=' + thisid + '&custparam_reptype=' + thisType;
	alert(url);
	window.open(url,false);
}


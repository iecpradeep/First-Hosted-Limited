function customerSavedSearch(request,response)
{
	// specify the record type only, no filters
	var CustFilters = new Array();
	//var CustColumns = new Array();
	var colName = new nlobjSearchColumn('companyname');
	var colPhone = new nlobjSearchColumn('phone');

    var searchForm = nlapiCreateForm('Customer Search (v1.0)');
	var sublist = searchForm.addSubList('resultssublist', 'list', 'Search Results', 'subtab');
	sublist.addField('customername', 'text', 'Customer Name');
	sublist.addField('telephone', 'text', 'Phone');
	
	var searchresults = nlapiSearchRecord('customer', null, CustFilters, [colName, colPhone]);
	if (searchresults) {
		for (var i = 0; i < searchresults.length; i++) {
			sublist.setLineItemValue('customername', i+1, searchresults[i].getValue('companyname'));
			sublist.setLineItemValue('telephone', i+1, searchresults[i].getValue('phone'));
		}
		//alert(searchresults.length + ' Customers found:\n' + customerList)
	} else {
		sublist.setLineItemValue('customername', 1, 'No Customers found by search.');
	}
	
	response.writePage(searchForm);

}

function customerSavedSearchParams(request,response)
{
	// specify record type only, filters using parameters
	var CustFilters = new Array();
	var customerDateCreated = nlapiGetContext().getSetting('SCRIPT', 'custscript_customer_createddate');
    if (customerDateCreated != null && customerDateCreated != '') {
        CustFilters[0] = new nlobjSearchFilter('datecreated', null, 'on', customerDateCreated);;
    }

	//var CustColumns = new Array();
	var colName = new nlobjSearchColumn('companyname');
	var colPhone = new nlobjSearchColumn('phone');

    var searchForm = nlapiCreateForm('Customer Search (v1.0)');
	var sublist = searchForm.addSubList('resultssublist', 'list', 'Search Results', 'subtab');
	sublist.addField('customername', 'text', 'Customer Name');
	sublist.addField('telephone', 'text', 'Phone');
	
	var searchresults = nlapiSearchRecord('customer', null, CustFilters, [colName, colPhone]);
	if (searchresults) {
		for (var i = 0; i < searchresults.length; i++) {
			sublist.setLineItemValue('customername', i+1, searchresults[i].getValue('companyname'));
			sublist.setLineItemValue('telephone', i+1, searchresults[i].getValue('phone'));
		}
		//alert(searchresults.length + ' Customers found:\n' + customerList)
	} else {
		sublist.setLineItemValue('customername', 1, 'No Customers found by search.');
	}
	
	response.writePage(searchForm);

}
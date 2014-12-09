// JavaScript Document
function setCustomerDefaultTerm(params) {
	customer = params.getParameter("cid");
	try {
		if(customer && parseInt(customer) > 0) {
			terms =  nlapiLookupField('customer', customer, 'terms');
			if(!terms) {
				 cust = nlapiLoadRecord('customer',customer);
				 cust.setFieldValue('terms', '9');
				 nlapiSubmitRecord(cust,false,true);
				 nlapiLogExecution('DEBUG', 'start', 'TERM SET' + customer);
			}
			
			
		}
	} catch (e) {
		nlapiLogExecution('ERROR', 'e', e);
	}
}
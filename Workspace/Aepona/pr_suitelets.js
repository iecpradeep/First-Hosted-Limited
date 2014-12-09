/*****************************************
 * Name:	 PR Suitelets
 * Author:   FHL
 * Client: 	 Aepona
 * Date:     21 March 2013
 * Version:  1.0.0
******************************************/


function supplierMaintenance(request,response)
{
	
	if (request.getMethod() == 'GET')
	{

		var form = nlapiCreateForm('Edit Supplier Contact Details');

	
		var supplierId = request.getParameter('custpage_supplierid');
	
		var supplierRecord = nlapiLoadRecord('vendor', supplierId);

		var supplierName = supplierRecord.getFieldValue('companyname');
		var currentEmail = supplierRecord.getFieldValue('email');
		var currentPhone = supplierRecord.getFieldValue('phone');
		var currentFax = supplierRecord.getFieldValue('fax');
		
		var supplierNameField = form.addField('custpage_suppliername','text','Supplier Name',null);
		var supplierEmailField = form.addField('custpage_supplieremail','email','Supplier Email',null);
		var supplierPhoneField = form.addField('custpage_supplierphone','phone','Supplier Phone',null);
		var supplierFaxField = form.addField('custpage_supplierfax','phone','Supplier Fax',null);
		var supplierInternalId = form.addField('custpage_supplierinternalid','text','SID',null);
		
		supplierNameField.setDefaultValue(supplierName);
		supplierEmailField.setDefaultValue(currentEmail);
		supplierPhoneField.setDefaultValue(currentPhone);
		supplierFaxField.setDefaultValue(currentFax);
		supplierInternalId.setDefaultValue(supplierId);
		    
		supplierNameField.setDisplayType('inline');
		supplierEmailField.setDisplayType('normal');
		supplierPhoneField.setDisplayType('normal');
		supplierFaxField.setDisplayType('normal');
		supplierInternalId.setDisplayType('hidden');
		

		
		form.addSubmitButton('Save');
		form.addButton('custpage_cancel','Cancel',"window.close()");
		
		
		response.writePage(form);
	
	}
	else //POST method
	{
		
		var supplierId = request.getParameter('custpage_supplierinternalid');
		var newEmail = request.getParameter('custpage_supplieremail');
		var newPhone = request.getParameter('custpage_supplierphone');
		var newFax = request.getParameter('custpage_supplierfax');
		
		nlapiSubmitField('vendor',supplierId,'email',newEmail);
		nlapiSubmitField('vendor',supplierId,'phone',newPhone);
		nlapiSubmitField('vendor',supplierId,'fax',newFax);

		var form = nlapiCreateForm('Supplier Contact Details');
		
		var statusField = form.addField('custpage_status','text');
		statusField.setDefaultValue('Changes successfully submitted.');
		statusField.setDisplayType('inline');
		
		form.addButton('custpage_close','Close',"window.close()");

		response.writePage(form);
				
	}
	
	
	
	
	
	
	
	
}
function createOnlineForm(request, response)
{
   if ( request.getMethod() == 'GET' )
   {
        var form = nlapiCreateForm('Online Market Research Lead Form');
        var field = form.addField('custpage_companyname','text', 'Company Name');
        //field.setLayoutType('normal','startcol')
	form.addField('custpage_address1','text', 'Address Line 1');
	form.addField('custpage_address2','text', 'Address Line 2');
	form.addField('custpage_city','text', 'City');
        form.addField('custpage_county','text', 'County');
	form.addField('custpage_zip','text', 'Postcode');
        var field = form.addField('custpage_companyemail','email', 'Email');
	field.setLayoutType('normal','startcol')
        form.addField('custpage_telephone','phone', 'Phone No.');
	form.addField('custpage_website','url', 'Web Site');
	form.addField('custpage_comments','textarea', 'Comments');
        
        var category = form.addField('custpage_categoryfield','select','Category');
        category.addSelectOption('','');
        category.addSelectOption('a','Audio');
        category.addSelectOption('b','Shoes');
        category.addSelectOption('c','Tools');
        category.addSelectOption('d','Clothes');
        category.addSelectOption('e','Music');
 
        form.addTab('tab_contact', 'Contact Details');
	var contact = form.addSubList('contact','inlineeditor','Contact Editor', 'tab_contact');
        contact.addField('custpage_firstname','text', 'First Name', 'tab_contact');
        contact.addField('custpage_lastname','text', 'Last Name', 'tab_contact');
        contact.addField('custpage_title','text', 'Title', 'tab_contact');
        contact.addField('custpage_contactemail','email', 'Email', 'tab_contact');
        contact.addField('custpage_contactphone','phone', 'Phone', 'tab_contact');
	 
        form.addSubmitButton('Submit');
        response.writePage(form);
	
   }
   else
	createCustomer(request, response);
}

function createCustomer(request, response)
{
	var custName = request.getParameter('custpage_companyname');
	var custPhone = request.getParameter('custpage_telephone');
	var custEmail = request.getParameter('custpage_companyemail');
	var custWebsite = request.getParameter('custpage_website');
	var custComment = request.getParameter('custpage_comments');
	var custAddr1 = request.getParameter('custpage_address1');
	var custAddr2 = request.getParameter('custpage_address2');
	var custCity = request.getParameter('custpage_city');
	var custCounty = request.getParameter('custpage_county');
	var custPostcode = request.getParameter('custpage_zip');
	
	var custContactFName = request.getParameter('custpage_firstname');
	var custContactLName = request.getParameter('custpage_lastname');
	var custContactTitle = request.getParameter('custpage_title');
	var custContactEmail = request.getParameter('custpage_contactemail');
	var custContactPhone = request.getParameter('custpage_contactphone');

	var recCust = nlapiCreateRecord('lead');
        recCust.setFieldValue('companyname',custName);
        recCust.setFieldValue('phone',custPhone);
	recCust.setFieldValue('comments',custComment);
	recCust.setFieldValue('url',custWebsite);
	recCust.setFieldValue('email',custEmail);
	recCust.setFieldValue('addr1',custAddr1);
	recCust.setFieldValue('addr2',custAddr2);
	recCust.setFieldValue('city',custCity);
	recCust.setFieldValue('state',custCounty);
	recCust.setFieldValue('zip',custPostcode);
	


        //recCust.selectNewLineItem('contact');
        //recCust.setCurrentLineItemValue('contact','contact',custContactFName);
	//recCon.setFieldValue('lastname',custContactLName);
	//recCust.setCurrentLineItemValue('contact', 'title',custContactTitle);
	//recCust.setCurrentLineItemValue('contact', 'phone',custContactPhone);
	//recCust.setCurrentLineItemValue('contact', 'email',custContactEmail);
	//recCust.commitLineItem('contact');
	//var con_id = nlapiSubmitRecord(recCon,true,true);
	
	//var recCon = nlapiCreateRecord('contact');
        //recCon.setFieldValue('company',custName);
        //recCon.setFieldValue('firstname',custContactFName);
	//recCon.setFieldValue('lastname',custContactLName);
	//recCon.setFieldValue('title',custContactTitlemment);
	//recCon.setFieldValue('phone',custContactPhone);
	//recCon.setFieldValue('email',custContactEmail);
	//var con_id = nlapiSubmitRecord(recCon,true,true);
	
	var cust_id = nlapiSubmitRecord(recCust,true,true);
	response.write('<HTML><HEAD></HEAD><BODY>Record Saved</BODY></HTML>');
}
function setClick(params)
{
	// - /app/site/hosting/scriptlet.nl?script=48&deploy=1  

	var id = params.getParameter('id');
	var enable = params.getParameter('enable');

	customer = nlapiLoadRecord('lead', id);

        customer.setFieldValue("custentity_one_click",enable);

	var tempId = nlapiSubmitRecord(customer, true, true);	
}

function getClick(params)
{
	// 	- /app/site/hosting/scriptlet.nl?script=47&deploy=1  
	var id = params.getParameter('id');
	customer = nlapiLoadRecord('lead', id);
        enable=customer.getFieldValue("custentity_one_click");
	//response.write("<script> var oneCliclEnable='"+enable+"';</script>")	
	response.write("var oneCliclEnable='"+enable+"';")	

}

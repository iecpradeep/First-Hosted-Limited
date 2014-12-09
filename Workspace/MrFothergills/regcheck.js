/**************************************************
 * Name:		regcheck.js
 * Script Type: Suitelet
 *
 * Version:	  	1.0.1 - 18/11/2012 - Initial release - LG
 * 				1.0.2 - 29/11/2012 - Added parameters - SB
 * 										Output JavaScript - SB
 * 				1.0.3 - 30/11/2012 - Add filter 'giveaccess' to only return accounts with access - SB
 *
 * Author:	  	FHL
 *
 * Purpose:     Check if a customer exists using email and brand 
 * 					and output JavaScript for use in the browser. 
 *
 * Script:		customscript_regcheck
 * Deploy:		customdeploy_regcheck /app/site/hosting/scriptlet.nl?script=116&deploy=1&compid=3322617&h=39cebdda22b0a20563fb
 *
 * Notes:		Outputs String (containing JavaScript)
 *
 * Library:		Library.js
 ****************************************************/

/**
 * Check if customer exists using email and brand ID
 */
function regCheck()
{
	var custIntID = 0;
	var customerExists = 'customerExists = true;';
	var brandId = 0;
	var email = '';
	
	try
	{
		if (request.getParameter('brand'))
		{
			brandId = parseInt(request.getParameter('brand'));
		}
		
		if (request.getParameter('email'))
		{
			email = request.getParameter('email');
		}
		
		custIntID = genericSearchJSON('customer', [{"column":"custentity_mrf_cust_brand", "value":brandId}, 
		                                           {"column":"email", "value":email}, 
		                                           {"column":"giveaccess", "value":"T"}]);
		
		if (custIntID < 1)
		{
			customerExists = 'customerExists = false;';
		}
		
		response.setContentType('JAVASCRIPT', 'script.js', 'inline');
		response.write(customerExists);
	}
	catch(e)
	{
		errorHandler('regCheck', e);
	}
}
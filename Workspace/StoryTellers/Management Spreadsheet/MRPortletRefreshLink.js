/*****************************************************************************
 *	Name:		MRPortletRefreshLink
 *	Script Type:	suitelet
 *	Client: StoryTellers
 *
 *	Version:	1.0.0 - 07/12/2012  First Release - AS
 *				
 * Author:	FHL (AS)
 * Purpose:	to run the refreshAllData_scheduled script
 *  		 
 * Script: customscript_mr_portlet_refresh_link  
 * Deploy: customdeploy_mr_portlet_refresh_link  
 * 
 **********************************************************************/

var scriptId = '67';
var deploymentId = '1';

/**********************************************************************
 * The Main Function 
 * 
 * @param request
 * @param response
 * 
 *********************************************************************/
function callScheduleScript(request, response)
{
	//GET Call
	if ( request.getMethod() == 'GET') 
	{
		//calling the 'refreshAllData_scheduled' schedule script 
		nlapiScheduleScript(scriptId, deploymentId);
		
		//closing the new opened window
		response.write('<html><body><script type="text/javascript">self.close()</script></body></html>');
		

	}

	//POST call
	else
	{
		
	}

}

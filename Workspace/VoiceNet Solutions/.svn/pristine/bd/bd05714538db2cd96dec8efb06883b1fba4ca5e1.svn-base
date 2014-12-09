/*************************************************************************************
 * Name:		Voicenet User List
 * Script Type:	Portlet
 *
 * Version:		1.0.0 - 08/10/2012 - Initial version - AM
 *
 * Author:		A.Morganti
 * 
 * Purpose:		
 * 
 * Script: 		voicenetPortlet.js	[todo]
 * Deploy: 		customdeploy_vn_portlet_userlist_v1 - not v1
 * 
 *************************************************************************************/
//TODO: Headers
//TODO: Comments
//TODO: Refactoring
//TODO: Logical Structure
//TODO: Get it to work
//TODO: Not in that order!



/**
 * portlet - shows voicenet users
 * 
 * @param portlet
 * @param column
 */
function userListPortletHTML(portlet, column)
{
	
	// [todo] remove vn proper camel case

	var vnUsersSearchFilters = new Array();
    var vnUsersSearchColumns = new Array();
    var vnUsersSearchResults = new Array();
    var content = '';
    
	try
	{
	    
	    vnUsersSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	    vnUsersSearchColumns[0] = new nlobjSearchColumn('custrecord_voicenet_user');
	    vnUsersSearchColumns[1] = new nlobjSearchColumn('custrecord_voicenet_phonenumber');
	    vnUsersSearchColumns[2] = new nlobjSearchColumn('custrecord_voicenet_signedin');
	    
	    vnUsersSearchResults = nlapiSearchRecord('customrecord_voicenet_profile', null, vnUsersSearchFilters, vnUsersSearchColumns);
	    
	    portlet.setTitle('VoiceNet Users');
	    content = "<table align=center border=0 cellpadding=3 cellspacing=0 width=100% style='font-size:8pt;'>";
	    //content += "<tr><td>Name</td><td>Tel.</td><td>Mobile</td></tr>";
	    content += "<tr><td>Name</td><td>Phone</td><td>Signed In?</td></tr>";

	    if (vnUsersSearchResults) 
	    {
			for (var u=0; u < vnUsersSearchResults.length; u++)
			{
				// Build Click to dial URL ...
//				var dialURL = "#";
//	    		content += "<tr><td>" + nlapiEscapeXML(vnUsersSearchResults[u].getText(vnUsersSearchColumns[0])) + "</td><td><a href='" + dialURL 
//				+ "'>" + nlapiEscapeXML(vnUsersSearchResults[u].getValue(vnUsersSearchColumns[1])) + "</a></td><td>" 
//				+ nlapiEscapeXML(vnUsersSearchResults[u].getValue(vnUsersSearchColumns[2])) + "</td></tr>";
	    		content += "<tr><td>" + nlapiEscapeXML(vnUsersSearchResults[u].getText(vnUsersSearchColumns[0])) + "</td><td>" 
	    				+ nlapiEscapeXML(vnUsersSearchResults[u].getValue(vnUsersSearchColumns[1])) + "</td><td>" 
	    				+ nlapiEscapeXML(vnUsersSearchResults[u].getValue(vnUsersSearchColumns[2])) + "</td></tr>";
			}
	    }
	    
	    content += "</table>";
	    content = '<td><span>' + content + '</span></td>';
	    portlet.setHtml(content);
	}
	catch(e)
	{
		portlet.setHtml("userListPortletHTML: " + e.message);
		errorHandler('userListPortletHTML', e);
	}

}

/**
 * [todo] desc - split into two functions
 * 
 * @param portlet
 */
function userListPortlet(portlet)
{
	var dialURL = '';
	try
	{
		var theContext = nlapiGetContext();
	    var thisUser = theContext.getUser();
//		var foundUser = false;
		var fromPhone = "";
//		var userRecord = nlapiLoadRecord('employee', thisUser);
	
	    var vnThisUserSearchFilters = new Array();
	    var vnThisUserSearchColumns = new Array();
	    
	    vnThisUserSearchFilters[0] = new nlobjSearchFilter('custrecord_voicenet_user', null, 'anyof', (thisUser));
	    vnThisUserSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	    
	    vnThisUserSearchColumns[0] = new nlobjSearchColumn('custrecord_voicenet_user');
	    vnThisUserSearchColumns[1] = new nlobjSearchColumn('custrecord_voicenet_phonenumber');
	    vnThisUserSearchColumns[2] = new nlobjSearchColumn('custrecord_voicenet_signedin');
	    
	    var vnThisUserSearchResults = nlapiSearchRecord('customrecord_voicenet_profile', null, vnThisUserSearchFilters, vnThisUserSearchColumns);
		if (vnThisUserSearchResults) fromPhone = nlapiEscapeXML(vnThisUserSearchResults[0].getValue(vnThisUserSearchColumns[1]));
	
	    var vnUsersSearchFilters = new Array();
	    var vnUsersSearchColumns = new Array();
	    
	    vnUsersSearchFilters[0] = new nlobjSearchFilter('isinactive', null, 'is', 'F');
	    
	    vnUsersSearchColumns[0] = new nlobjSearchColumn('custrecord_voicenet_user');
	    vnUsersSearchColumns[1] = new nlobjSearchColumn('custrecord_voicenet_phonenumber');
	    vnUsersSearchColumns[2] = new nlobjSearchColumn('custrecord_voicenet_signedin');
	    
	    var vnUsersSearchResults = nlapiSearchRecord('customrecord_voicenet_profile', null, vnUsersSearchFilters, vnUsersSearchColumns);
	    
	    portlet.setTitle('VoiceNet Users ' + thisUser);
	    if (vnUsersSearchResults != null && vnUsersSearchResults.length > 0) 
	    {
	        for (var i = 0; i < vnUsersSearchResults.length; i++) 
	        {
				if (vnUsersSearchResults[i].getText(vnUsersSearchColumns[0]) == thisUser)
				{
					foundUser = true;
				}
					
				 dialURL = "/app/site/hosting/scriptlet.nl?script=126&deploy=1&fromphone=" + fromPhone + "&tophone=" 
				 			+ nlapiEscapeXML(vnUsersSearchResults[i].getValue(vnUsersSearchColumns[1]));
	            portlet.addLine('#' + (i + 1) + ': ' + nlapiEscapeXML(vnUsersSearchResults[i].getText(vnUsersSearchColumns[0])), dialURL, 0);
	        }
	    }
	}	
	catch(e)
	{
		portlet.addLine('Error on line #' + i.toString() + ': ' + e.message, dialURL, 0);
	}
}


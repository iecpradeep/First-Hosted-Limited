/*************************************************************************************
 * Name:		Published Search Form Helper
 * Script Type:	JavaScript
 *
 * Version:		1.0.0 - 21/06/2012 - Initial version - SB
 * 				1.0.1 - 11/11/2012 - Demoted A-Z Saved Search ID to brand-specific.js - SB
 *
 * Author:		S. Boot
 * Purpose:		Auto-submit A-Z search forms and hide search form
 * Script: 		pubsearch.js
 *************************************************************************************/

//var aToZSearchId = [brand-specific.js];

$(document).ready(function(){
	
	if($('#searchid').val() == aToZSearchId) // DTB A-Z Saved Search ID
	{
		// Hide the form
		$('#main_form').parent().hide();
		
		// If not submitted this URL param will be present
		if(window.location.href.indexOf('CUSTITEM_MRF_ITEM_ATOZ') >= 0)
		{
			document.forms.main_form.submit();
		}
	}
	
});
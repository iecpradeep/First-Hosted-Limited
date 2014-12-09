/**
 * Module Description
 * 
 * Version    Date            Author           Remarks
 * 1.00       01 Jul 2013     Peter Lewis, First Hosted Ltd
 *
 */

var clientDetails = '';
var date = new Date();
var resellerId = 'Reseller / Dealer';
var brandId = 'XritePhotoEurope';
var confirmedTermsYesValue = '1';


/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function clientPageInit(type)
{


	//http://api.hostip.info/get_html.php
	try
	{

		clientDetails = myIP() + '. Date: ' + date.toDateString() + ', ' + date.toTimeString();
		nlapiSetFieldValue('custentity_applicantclientdetails', clientDetails);
		nlapiSetFieldValue('custentity_customertype', resellerId);
		nlapiDisableField('custentity_customertype', true);
		nlapiSetFieldValue('custentity_defaultbrand', brandId);
		nlapiDisableField('custentity_defaultbrand', true);

	}
	catch(e)
	{
		alert('Error: ' + e.message);
	}
}


function clientOnSave()
{
	var confirmedTerms = '';
	try
	{
//		confirmedTerms = nlapiGetFieldValue('custentity_confirmedterms');
//
//		if(confirmedTerms != confirmedTermsYesValue)
//		{
//			alert('You must accept the Terms and Conditions before submitting this form.');
//			return false;
//		}
	}
	catch(e)
	{
		alert('Error saving record: ' + e.message);
	}

	return true;
}

function myIP() 
{
	var retVal = '';
	try
	{
		if (window.XMLHttpRequest)
		{
			xmlhttp = new XMLHttpRequest();
		}
		else 
		{
			xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
		}

		xmlhttp.open("GET","http://api.hostip.info/get_html.php",false);
		xmlhttp.send();

		hostipInfo = xmlhttp.responseText; //.split("\n");
		//alert('Craig - ' + hostipInfo);

//		for (var i=0; hostipInfo.length >= i; i++) 
//		{
//		ipAddress = hostipInfo[i].split(":");
//		if ( ipAddress[0] == "IP" ) 
//		{
//		return ipAddress[1];
//		}
//		}

		retVal = hostipInfo;
	}
	catch(e)
	{
		//return unable to connect
		retVal = '';
	}
	
	return retVal;

}
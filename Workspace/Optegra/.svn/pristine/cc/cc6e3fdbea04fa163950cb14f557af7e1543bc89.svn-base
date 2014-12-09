/*************************************************************************************
 * Name:		proposalMaintenance.js
 * Script Type:	[Suitelet]
 *
 * Version:		1.0.1 - 11th Apr 2013  - First release  - SA
 *
 * Author:		FHL
 * 
 * Purpose:		When they load maintenance screen, the footer filter locations to be defaulted to which they choose in the select payment screen.
 * 
 * Script: 		customscript_proposalmaintenance 
 * Deploy: 		customdeploy_proposalmaintenance 
 * 
 * Notes:		make sure the "Payment Proposal List Selected Results - do not edit"saved search is exist and the search ID is correct in the particular environment .
 * 
 * Library: 	Library.js
 *************************************************************************************/

var context = null;
var currentUser =  null;
var environment = null;
var locationRec = null;
var locationrecId = 0;
var locationFieldValues = new Array();

var locationString = "";
var searchURL = "";


/*****************
 * main Function
 *****************/

function main(request, response)
{
	initialise();
	process(request, response);

}


/*****************
 * 
 * initialise
 * 
 ****************/
function initialise()
{
	try
	{
		context = nlapiGetContext();
		currentUser = nlapiGetUser();
		environment = context.getEnvironment();

	}
	catch(e)
	{
		errorHandler("initialise: " +e);
	}
}

/**
 * 
 * main process
 * 
 */
function process(request, response)
{

	loadLocationrecord();
	buildSearchURL();
	redirectToSearch(request, response);

}


/**
 * 
 * loadLocationrecord (custom record set)
 * 
 */
function loadLocationrecord()
{
	var genericSearchResults = null;

	try
	{
		genericSearchResults = genericSearch('customrecord_locationfilter', 'custrecord_locationfilter_employee', currentUser);

		if (genericSearchResults == 'not found') 
		{

			//no last location record found for this current user, so set locationRec = null
			locationRec = null;			
		}

		else
		{
			//locationrecId = genericSearchResults;
			locationRec = nlapiLoadRecord('customrecord_locationfilter', genericSearchResults);

			locationFieldValues = locationRec.getFieldValues('custrecord_locationfilter_location');

		}

	}
	catch(e)
	{
		errorHandler("loadLocationrecord : " +e);
	}

}

/**
 * 
 * buildSearchURL for payment proposal screen
 * 
 */
function buildSearchURL()
{
	try
	{

		if(locationRec == null)
		{

			locationString = "@ALL@";

		}
		else
		{
			for(var i = 0; i < locationFieldValues.length; i++)
			{				
				if (i ==0)
				{			
					locationString = locationFieldValues[i];
				}

				if (i !=0)
				{
					locationString += "%05" + locationFieldValues[i];
				}

			}

		}

		switch (environment)
		{
		case "SANDBOX":

			searchURL = "https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid=426&CUSTRECORD_LOCATION=";

			break;
		case "PRODUCTION":

			searchURL = "https://system.netsuite.com/app/common/search/searchresults.nl?searchid=426&CUSTRECORD_LOCATION=";

			break;

		case "BETA":

			searchURL = "https://system.na1.netsuite.com/app/common/search/searchresults.nl?searchid=426&CUSTRECORD_LOCATION=";

			break;


		}

	}
	catch(e)
	{
		errorHandler("buildSearchURL: " +e);
	}

}

/**
 * 
 * redirect to Search
 * 
 */
function redirectToSearch(request, response)
{ var params = new Array();
	try
	{
		redirectURL = searchURL + locationString;	

		outputPage = '<html><body><script type="text/javascript">window.location.href="' + redirectURL + '";</script><p>Error: No parameters passed.</p>';

		response.write(outputPage);

	}
	catch(e)
	{
		errorHandler("redirectToSearch: " +e);
	}

}






















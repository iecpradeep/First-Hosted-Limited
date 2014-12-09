/*****************************************************************************
 *	Name		:	alignVATCheckSoap.js
 *  Script Type	:	suitelet
 *	Client		: 	Align
 *
 *	Version		:	1.0.0 - 13/05/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To connect to VAT checker through SOAP
 * 
 *  Script		: 	customscript_checkvatcode
 * 	Deploy		: 	customdeploy_checkvatcode
 * 
 * 	Library		: 	library.js
 * 
 ***************************************************************************/
//declaring global variables
var form = '';
var sr = '';

/***************************************************************************
 * accessVATChecker Function - The main function
 * 
 * @param request
 * @param response
 **************************************************************************/
function accessVATChecker(request,response)
{
	try
	{
		//getting the method type
		if (request.getMethod() == 'GET')
		{
			//Creates custom form
			createSelectionForm();
			response.writePage(form);			//writing the form 
		}
		//if 'POST' method called (clicking the button)
		else
		{
			initialise();						//calling initialise function
			//connectToVATCheckSite();				//calling connectToVATCheckSite function
		loadResults();
		confirmMessage = '<html><body><script type="text/javascript">window.confirm("Do You Want To Mark These results As Printed?");</script>';
		

		
		var outputPage = confirmMessage;
		if(confirmMessage)
		{

			 outputPage += '<html><body><script type="text/javascript">window.print();</script>';

		}
		}
	}
	catch(e)
	{
		errorHandler('accessVATChecker', e);
	}

}

/***************************************************************************
 * initialise Function - initialise the static variables used in the script
 * 
 **************************************************************************/
function initialise()
{
	try
	{

		//username and the password  to connect to the Metapack qa site
		//username = 'destinynetsuite';			
		//password = 'fu2afrEt';
	}
	catch(e)
	{
		errorHandler('initialise', e);
	}
}




/***************************************************************************
 * createSelectionForm Function - creating the selection form to get the user input
 * 
 **************************************************************************/
function createSelectionForm()
{
	try
	{
		form = nlapiCreateForm('VAT CHECK FOR ALIGN USING SOAP');			//creating the form
		form.addSubmitButton('Execute the SOAP');										//adding the submit button
	}
	catch(e)
	{
		errorHandler('createSelectionForm', e);
	}
}



/***************************************************************************
 * connectToVATCheckSite Function - connect to the metapack using SOAP
 * 
 **************************************************************************/
function connectToVATCheckSite()
{
	//declaring local variables
	var headers = new Array();
	var responseObject = null; 
	var url = '';
	var body = '';
	var encodedCredentials = '';

	var xmlBody = '';
	var parentNodes = null;
	var childNodeElement = null;
	var childNodeValue = null;
	var childNodeName = '';
	var childNodes = null;
	var resultingString = '';
	var retVal = false;
	var date1 = null;
	var date2 = null;
	var startTime = 0;
	var endTime = 0;
	var timeForResponse = 0;
	try
	{

		//passing the credentials to Base 64 in order to pass trough SOAP
		//encodedCredentials = nlapiEncrypt(username + ":" + password, 'base64');

		// build SOAP request
		setupSOAPRequest();

		//initialising SOAP headers
		headers['Content-type'] =  "text/xml charset=\"UTF-8\"";
		headers['User-Agent'] = 'SOAP Toolkit 3.0';
		headers['Authorization'] = '';
		//headers['Authorization'] = 'Basic ' + encodedCredentials;
		headers['SOAPAction'] = "";
		headers['Host'] = 'ec.europa.eu';
		headers['Pragma'] = 'no-cache';
		
		date1 = new Date();
		startTime = date1.getTime(); 
		
		//wsdl url of the destiny's qa account in metapack
		url = 'http://ec.europa.eu/taxation_customs/vies/services/checkVatService';
		

		//connecting to the metapack by sending the SOAP request
		responseObject = nlapiRequestURL(url,sr,headers,'POST');

		nlapiLogExecution('debug', 'responseObject', responseObject);
		if(responseObject != null)
		{
			//getting the body of the results
			body = responseObject.getBody();

			//passing the body to xml format (Reason - the results are not in actual XML format)
			xmlBody = nlapiStringToXML(body);

		/*	//getting the Parent Nodes of the 'findDeliveryOptionsReturn/findDeliveryOptionsReturn' path
			parentNodes = nlapiSelectNodes(xmlBody, '//findDeliveryOptionsReturn/findDeliveryOptionsReturn');

			//going through each node
			for(var i = 0; i < parentNodes.length; i++)
			{ 
				//getting the child nodes in order to count the no of child nodes in particular Parent Node
				childNodes = parentNodes[i].childNodes;

				if(childNodes.length > 0)
				{
					//getting the 1st child node
					childNodeElement = parentNodes[0].firstChild;

					//getting the name of the particular child Node
					childNodeName = childNodeElement.nodeName;

					//getting the value of the Child Node
					childNodeValue = nlapiSelectValue(parentNodes[i], childNodeName);

					resultingString = resultingString + childNodeName + ' : ' + childNodeValue + '\n';

					for(var j = 0; j < childNodes.length -1; j++)
					{
						//getting the subsequent child nodes
						childNodeElement = childNodeElement.nextSibling;	
						childNodeName = childNodeElement.nodeName;								//getting the node name
						childNodeValue = nlapiSelectValue(parentNodes[i], childNodeName);		//getting the value of the particular node name

						resultingString = resultingString + childNodeName + ' : ' + childNodeValue + '\n';
					}
				}

				resultingString = resultingString + '\n\n\n';
			}	
*/
		}
	}
	catch(e)
	{
		errorHandler('connectToVATCheckSite', e);
	}

	//wring the results with the name and the value pairs in to the displaying screen
	
	if(body.indexOf('true')!=-1)
	{
		retVal = true;
	}
	
	
	
	response.write('' + body);  
	response.write('VAT Check Response ' + retVal);  

	date2 = new Date();
	endTime = date2.getTime(); 
	
	timeForResponse = endTime - startTime;
	
	response.write(' time for response ' +timeForResponse);  

}


/***************************************************************************
 * setup SOAP request string
 * 
 **************************************************************************/

function setupSOAPRequest()
{

	try
	{
		sr = '<?xml version=\"1.0\" encoding=\"UTF-8\" standalone="no"?>'+
		'<SOAP-ENV:Envelope xmlns:SOAPSDK1="http://www.w3.org/2001/XMLSchema" xmlns:SOAPSDK2="http://www.w3.org/2001/XMLSchema-instance" xmlns:SOAPSDK3="http://schemas.xmlsoap.org/soap/encoding/" xmlns:SOAP-ENV="http://schemas.xmlsoap.org/soap/envelope/">'+
		'<SOAP-ENV:Body>'+
		'<checkVat xmlns="urn:ec.europa.eu:taxud:vies:services:checkVat:types">'+
		  '<countryCode xmlns:SOAPSDK4="urn:ec.europa.eu:taxud:vies:services:checkVat:types">CZ</countryCode>'+
		 '<vatNumber xmlns:SOAPSDK5="urn:ec.europa.eu:taxud:vies:services:checkVat:types">25268597</vatNumber>'+
		'</checkVat>'+
		'</SOAP-ENV:Body>'+
		'</SOAP-ENV:Envelope>';

	}
	catch(e)
	{
		errorHandler('setupSOAPRequest', e);
	}


}


function loadResults()
{ 
	var fils = new Array();
//	nlapiRequestURL('https://system.na1.netsuite.com/app/common/search/searchresults.nl?searchid=230',null,null,'POST');
//	response.sendRedirect('RECORD', 'savedsearch', '230');
//	response.write('<html><body><script type="text/javascript">self.close()</script></body></html>');
	

	loadedSavedSearch = nlapiLoadSearch('transaction', 'customsearch230');
	//nlapiLogExecution('debug', 'loadedSavedSearch.getFilters();', loadedSavedSearch.getFilters());
	//ppsFilters[0] = new nlobjSearchFilter('custrecord_batchnumber', null, 'between', selectedStartBatchNo, selectedEndBatchNo);
	//loadedSavedSearch.addFilters(ppsFilters);

	//loadedSavedSearch.saveSearch(reportName, savedSearchID);

	
	savedSearchInternalID = loadedSavedSearch.getId();
	

/*	confirmMessage = '<html><body><script type="text/javascript">window.confirm("Do You Want To Mark These results As Printed?");</script>';
	

	
	var outputPage = confirmMessage;
	if(confirmMessage)
	{

		 outputPage += '<html><body><script type="text/javascript">window.print();</script>';

	}*/
	var outputPage = '<html><body><script type="text/javascript">window.location.href=\'https://system.na1.netsuite.com/app/common/search/searchresults.nl?searchid=230\';</script><p>Error: No parameters passed.</p>';

	



response.write(outputPage);
	//load.saveSearch('Align Ac view', 'customsearch230');
	
//	var outputPage = '<html><body><script type="text/javascript">window.location.href="https://system.na1.netsuite.com/app/common/search/searchresults.nl?searchid=230";</script><p>Error: No parameters passed.</p>';


	/*var file = nlapiPrintRecord('TRANSACTION', 4031, 'PDF');
	response.setContentType(file.getType());
	response.write(file.getValue());*/
	//var outputPage = '<html><body><script type="text/javascript">window.print();</script>';

	//response.write(outputPage);
}


/*

function loadResults()
{
	var ppsFilters = new Array();

	var locationName = '';
	var reportName = '';
	var savedSearchID = '';
	var savedSearchInternalID = 0;
	var outputPage = '';
	var confirmMessage = '';
	
	try
	{
	
			loadedSavedSearch = nlapiLoadSearch('customrecord_mrf_pickpackship', savedSearchID);
			//ppsFilters[0] = new nlobjSearchFilter('custrecord_batchnumber', null, 'between', selectedStartBatchNo, selectedEndBatchNo);
			//loadedSavedSearch.addFilters(ppsFilters);

			//loadedSavedSearch.saveSearch(reportName, savedSearchID);

			
			savedSearchInternalID = loadedSavedSearch.getId();
			nlapiLogExecution('debug', 'savedSearchInternalID', savedSearchInternalID);
			confirmMessage = '<html><body><script type="text/javascript">window.confirm("Do You Want To Mark These results As Printed?");</script>';
			outputPage = confirmMessage;
			outputPage += '<html><body><script type="text/javascript">window.location.href=\'https://system.sandbox.netsuite.com/app/common/search/searchresults.nl?searchid='+savedSearchInternalID + '&whence=\';</script><p>Error: No parameters passed.</p>';

		
		response.write(outputPage);
		
	
		
	}
	catch(e)
	{
		errorHandler('loadResults', e);
	}
}
*/

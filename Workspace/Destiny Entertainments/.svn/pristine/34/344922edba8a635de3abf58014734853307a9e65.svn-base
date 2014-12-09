/*****************************************************************************
 *	Name		:	metapack_API_SOAP.js
 *  Script Type	:	suitelet
 *	Client		: 	Destiny Entertainments
 *
 *	Version		:	1.0.0 - 15/04/2013  First Release - AS
 *				
 * 	Author		:	FHL 
 * 	Purpose		:	To connect to Metapack through SOAP
 * 
 *  Script		: 	customscript_metapack
 * 	Deploy		: 	customdeploy_metapack_deploy
 * 
 * 	Library		: 	library.js
 * 
 ***************************************************************************/
//declaring global variables
var form = '';
var username = '';
var password = '';
var sr = '';

/***************************************************************************
 * accessMetapack Function - The main function
 * 
 * @param request
 * @param response
 **************************************************************************/
function accessMetapack(request,response)
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
			connectToMetapack();				//calling connectToMetapack function
		}
	}
	catch(e)
	{
		errorHandler('accessMetapack', e);
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
		username = 'destinynetsuite';			
		password = 'fu2afrEt';
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
		form = nlapiCreateForm('Metapack API Test Harness using XML and SOAP');			//creating the form
		form.addSubmitButton('Execute the SOAP');										//adding the submit button
	}
	catch(e)
	{
		errorHandler('createSelectionForm', e);
	}
}



/***************************************************************************
 * connectToMetapack Function - connect to the metapack using SOAP
 * 
 **************************************************************************/
function connectToMetapack()
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

	try
	{

		//passing the credentials to Base 64 in order to pass trough SOAP
		encodedCredentials = nlapiEncrypt(username + ":" + password, 'base64');

		// build SOAP request
		setupSOAPRequest();

		//initialising SOAP headers
		headers['Content-type'] =  "text/xml";
		headers['User-Agent-x'] = 'SuiteScript-Call';
		headers['Authorization'] = 'Basic ' + encodedCredentials;
		headers['soapAction'] = ' ';


		//wsdl url of the destiny's qa account in metapack
		url = 'http://dm-qa.metapack.com/api/4.x/services/AllocationService?wsdl';

		//connecting to the metapack by sending the SOAP request
		responseObject = nlapiRequestURL(url,sr,headers,'POST');

		if(responseObject != null)
		{
			//getting the body of the results
			body = responseObject.getBody();

			//passing the body to xml format (Reason - the results are not in actual XML format)
			xmlBody = nlapiStringToXML(body);

			//getting the Parent Nodes of the 'findDeliveryOptionsReturn/findDeliveryOptionsReturn' path
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

		}
	}
	catch(e)
	{
		errorHandler('connectToMetapack', e);
	}

	//wring the results with the name and the value pairs in to the displaying screen
	response.write('' + resultingString);  


}


/***************************************************************************
 * setup SOAP request string
 * 
 **************************************************************************/

function setupSOAPRequest()
{

	try
	{


		sr = 
			'<?xml version=\"1.0\" encoding=\"UTF-8\"?>' +
			'<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">'+
			'<soapenv:Body>'+
			'<ns1:findDeliveryOptions soapenv:encodingStyle="http://schemas.xmlsoap.org/soap/encoding/" xmlns:ns1="urn:DeliveryManager/services">'+
			'<consignment xsi:type="ns2:Consignment" xmlns:ns2="urn:DeliveryManager/types">'+
			'<alreadyPalletisedGoodsFlag xsi:type="xsd:boolean">false</alreadyPalletisedGoodsFlag>'+
			'<cardNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierConsignmentCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			' <carrierName xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierServiceCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<carrierServiceName xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<cartonNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<consignmentCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<consignmentLevelDetailsFlag xsi:type="xsd:boolean">false</consignmentLevelDetailsFlag>'+
			'<consignmentValue xsi:type="xsd:double">0.0</consignmentValue>'+
			'<consignmentWeight xsi:type="xsd:double">113.5786666667</consignmentWeight>'+

			' <custom1 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom10 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom2 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom5 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom6 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom7 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<custom8 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			'<custom9 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<cutOffDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			//'<deliveryPrice xsi:type="xsd:double" xsi:nil="true"/>'+
			'<despatchDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<earliestDeliveryDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<fragileGoodsFlag xsi:type="xsd:boolean">false</fragileGoodsFlag>'+
			'<guaranteedDeliveryDate xsi:type="xsd:dateTime" xsi:nil="true"/>'+
			'<hazardousGoodsFlag xsi:type="xsd:boolean">false</hazardousGoodsFlag>'+

			'<insuranceValue xsi:type="xsd:double">0.0</insuranceValue>'+
			'<liquidGoodsFlag xsi:type="xsd:boolean">false</liquidGoodsFlag>'+
			'<maxDimension xsi:type="xsd:double">88</maxDimension>'+
			'<moreThanOneMetreGoodsFlag xsi:type="xsd:boolean">false</moreThanOneMetreGoodsFlag>'+
			'<moreThanTwentyFiveKgGoodsFlag xsi:type="xsd:boolean">false</moreThanTwentyFiveKgGoodsFlag>'+
			'<orderNumber xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">EXAMPLE-12</orderNumber>'+

			'<parcelCount xsi:type="xsd:int">1</parcelCount>'+
			'<parcels soapenc:arrayType="ns2:Parcel[1]" xsi:type="soapenc:Array" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">'+
			'<item xsi:type="ns2:Parcel">'+
			'<code xsi:type="soapenc:string" xsi:nil="true"/>'+
			'<dutyPaid xsi:type="xsd:double">0.0</dutyPaid>'+
			'<number xsi:type="xsd:int">0</number>'+
			'<parcelDepth xsi:type="xsd:double">0.0</parcelDepth>'+

			'<parcelHeight xsi:type="xsd:double">88</parcelHeight>'+
			'<parcelValue xsi:type="xsd:double">0.0</parcelValue>'+
			'<parcelWeight xsi:type="xsd:double">113.5786666667</parcelWeight>'+
			'<parcelWidth xsi:type="xsd:double">88</parcelWidth>'+
			'<products xsi:type="ns2:Product" xsi:nil="true"/>'+
			'</item>'+
			'</parcels>'+

			'<pickTicketNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<pickupPoint xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<podRequired xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<properties xsi:type="ns2:Property" xsi:nil="true"/>'+
			'<recipientAddress xsi:type="ns2:Address">'+
			'<countryCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">CAN</countryCode>'+
			'<line1 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">12-16 Laystall Street</line1>'+
			'<line2 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">London</line2>'+

			'<line3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<line4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<postCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">SK1P 1J1</postCode>'+
			'<type xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'</recipientAddress>'+
			'<recipientCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientContactPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientEmail xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			'<recipientMobilePhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientName xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">Automatic test EXAMPLE-12</recipientName>'+
			'<recipientNotificationType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<recipientVatNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderAddress xsi:type="ns2:Address">'+
			'<countryCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">GBR</countryCode>'+
			'<line1 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">12-16 Laystall Street</line1>'+

			'<line2 xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">London</line2>'+
			'<line3 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<line4 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<postCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">EC1R 4PF</postCode>'+
			'<type xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'</senderAddress>'+
			'<senderCode xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">DEFAULT</senderCode>'+

			'<senderContactPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderEmail xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderMobilePhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderName xsi:type="soapenc:string" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/">Automatic test warehouse name</senderName>'+
			'<senderNotificationType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderPhone xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<senderVatNumber xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<shipmentTypeCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+

			'<shippingAccount xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<signatoryOnCustoms xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<specialInstructions1 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<specialInstructions2 xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<status xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<termsOfTradeCode xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<transactionType xsi:type="soapenc:string" xsi:nil="true" xmlns:soapenc="http://schemas.xmlsoap.org/soap/encoding/"/>'+
			'<twoManLiftFlag xsi:type="xsd:boolean">false</twoManLiftFlag>'+

			'</consignment>'+
			'<filter xsi:type="ns3:AllocationFilter" xsi:nil="true" xmlns:ns3="urn:DeliveryManager/types"/>'+
			'<calculateTaxAndDuty xsi:type="xsd:boolean"> false </calculateTaxAndDuty>'+
			'</ns1:findDeliveryOptions>'+
			'</soapenv:Body>'+
			'</soapenv:Envelope>';

	}
	catch(e)
	{
		errorHandler('setupSOAPRequest', e);
	}


}


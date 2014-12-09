/**********************************************************************************************************
 * Name:        calcClient
 * Script Type: Client
 * Client:      Essential Telecom
 * 
 * Version:     1.0.0 - 21 Dec 2012 - first release - JM
 *  
 * Author:      FHL
 * Purpose:     Allow multiple vouchers to be selected & calculate distributor commission for physical vouchers
 * 
 * Script:      customscript_voucherselectorclient  
 * Deploy:      customdeploy_voucherselectorclient
 * 
 * Libraries:   library.js
 **********************************************************************************************************/

var xmlPayload = '';

function calcClient(type)
{


	//alert('hello world');
	initialise();
	constructXMLPayload();
	writeItemsToCRS();
	loadCalcEngine();

}

/**
 * initialise
 * 
 */


function initialise()
{


}

/**
 * writeItemsToCRS
 * 
 */

function writeItemsToCRS()
{

	var currentLineNumber=0;
	var retVal = true;

//	try
//	{



	var linesInBasket = nlapiGetLineItemCount('item');


	for(var x=1; x<=linesInBasket; x++)
	{
		xmlPayload = xmlPayload + constructXMLPayload(x);
	}

	var newRec = nlapiCreateRecord('customrecord_offershipcalc');

	newRec.setFieldValue('custrecord_item', 'payload records');
	newRec.setFieldValue('custrecord_desc', 'payload');
	newRec.setFieldValue('custrecord_xmlpayload', xmlPayload);



	newRec = nlapiSubmitRecord(newRec, false);



	//}
//	catch(e)
//	{
//	errorHandler("writeItemsToCRS", e);
	//	alert('error writeItemsToCRS')
//	}     	      

	return retVal;

}

function dosomething()
{

	var x = 0;
	var y = 0;
	var z = 0;
	var s = '';


	for(var a=0; a<100; a++)
	{

		x = Math.floor(Math.random()*11);
		y = Math.floor(Math.random()*11);
		z = x * y;

		s=s+'a'+z;

	}



}

/**
 * loadCalcEngine
 * 
 */


function loadCalcEngine(type)
{

	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	var params = ''; 
	var width = 500; 
	var height = 400; 
	//var response = null;


	try
	{

		params = 'width=' + width +', height =' + height;
		params += ', directories=no';
		params += ', location=yes'; 
		params += ', menubar=no'; 
		params += ', resizable=yes'; 
		params += ', scrollbars=no'; 
		params += ', status=no'; 
		params += ', toolbar=no'; 
		params += ', fullscreen=no';

		//pass through script ID and deploy ID as parameters
		context = nlapiGetContext();

		scriptNo = 118;
		deployNo = 1;

		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);

//		alert(suiteletURL);

		var response = nlapiRequestURL( suiteletURL, null, null );
		var body = response.getBody();
		var headers = response.getAllHeaders();

		alert(body);


		//response = 

//		window.open(suiteletURL, 'Vouchers', params);

	}
	catch(e)
	{
		alert('error loadCalcEngine');
		//errorHandler("voucherSelectorClient", e);
	}     	      

}



/**
 * construct XML Payload
 * 
 */

function constructXMLPayload(x)
{

	var fieldVal = '';
	var tag = '';
	var retVal = '';

	try
	{

		retVal = "<record>";

		retVal = retVal + createXMLField('line',x);
		retVal = retVal + createXMLField('item',x);
		retVal = retVal + createXMLField('description',x);
		retVal = retVal + createXMLField('amount',x);
		retVal = retVal + createXMLField('rate',x);
		retVal = retVal + createXMLField('taxcode',x);
		retVal = retVal + createXMLField('taxrate1',x);
		retVal = retVal + createXMLField('quantity',x);
		retVal = retVal + createXMLField('price',x);

		retVal = retVal + "</record>";


	}
	catch(e)
	{

	}    

	return retVal;

}

/**
 * construct XML Payload
 * 
 */


function createXMLField(tag,x)
{

	var retVal = ''; 

	try
	{

		retVal = nlapiGetLineItemValue('item', tag ,x);
		retVal = "<" + tag + ">" +retVal + "</" + tag + ">";  

	}
	catch(e)
	{

	}     	      

	return retVal;

}





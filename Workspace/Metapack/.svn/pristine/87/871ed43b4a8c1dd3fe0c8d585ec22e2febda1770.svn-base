/*****************************************************************************
 *	Name		:	conEngine.js
 *	Script Type	:	user event - after record submit item fulfilment. 
 *	Applies To	: 	item fulfilments
 *
 *	Client		: 	
 *
 *	Version		:	1.0.0 - 05/07/2013  First Release - AS
 *						
 * 	Author		:	FHL 
 * 	Purpose		:	to integrate the Netsuite and Metapack
 * 
 * 	Script		: 	
 * 	Deploy		:   
 * 
 * 	Library		: SOAPScriptLibrary.js
 * 
 *  Notes 		: The whole fulfilment is regarded as one consignment. 
 *  			  One consignment may have several packages.
 * 
 ***************************************************************************/
//declaring global variables
var createdFrom = '';	
var username = '';
var password = '';
var SOAPTemplate = '';
var NOOFVARIABLES = 0;
var status = '';
var fulfilmentItemQty = 0;
var fulfilmentTotal = 0.0;
var itemFound = 'F';
var itemRate = 0.00;
var noOfFulfilmentLineItems = 0;
var weightUnit = '';
var noOfPackages = 0;
var packageWeightInStandardUnit = 0;
var totalWeightInStandardUnit = 0;
var totalWeightInKg = 0;
var KGSPERLB = 0;
var KGSPERGRAM = 0;
var KGSPEROZ = 0 ;
var shippingCountry = '';
var shippingAddressLine1 = '';
var shippingAddressLine2 = '';
var shippingAddressPostCode = '';
var customerName = '';
var company = '';
var companyAddress1 = '';
var companyCity = '';
var companyPostCode = '';
var companyCountry = '';
var wsdlUrl = '';
var populatedSOAPMessage = ''; 
var SOAPResponse = '';

var alreadyPalletisedGoodsFlag = false;
var consignmentLevelDetailsFlag = false;
var consignmentValue = 0.0;
var consignmentWeight = 0.1;
var deliveryPrice = 0.0;
var fragileGoodsFlag = false;
var hazardousGoodsFlag = false;
var liquidGoodsFlag = false;
var insuranceValue = 0.0;
var maxDimension = 0;
var moreThanOneMetreGoodsFlag = false;
var moreThanTwentyFiveKgGoodsFlag = false;
var orderNumber = 0;
var parcelCount = 1;
var dutyPaid = 0.0;
var number = 0;
var parcelDepth = 0.0;
var parcelHeight = 0.0;
var parcelValue = 0.0;
var parcelWeight = 0.1;
var parcelWidth = 0.0;
var reciepientCountryCode = 'GBR';
var reciepientLine1 = '12-16 Laystall Street';
var reciepientLine2 = 'London';
var reciepientPostCode = 'EC1R 4PF';
var recipientName ='Automatic test EXAMPLE-5';
var senderCountryCode = 'GBR';
var senderLine1 = '12-16 Laystall Street';
var senderLine2 = 'London';
var senderPostCode = 'EC1R 4PF';
var senderCode = 'DEFAULT';
var senderName = 'Automatic';
var twoManLiftFlag = false;
var calculateTaxAndDuty = false;
var fulfilmentRecordIntID = 0;

/**********************************************************************
 * integrateMetapack - main Function 
 **********************************************************************/
function integrateMetapack(type)
{
	if(type == 'create' || type == 'edit')
	{
		
		initialise();
		process();
	}

}

/**********************************************************************
 * initialise Function - initialise the static variables used in the script 
 **********************************************************************/
function initialise()
{
	try
	{
		getCompanyInformation();
		
		username = 'destinynetsuite';		// [todo] place in config table much later
		password = 'fu2afrEt';				// [todo] place in config table much later
		NOOFVARIABLES = 22;
		KGSPERLB = 0.453592;
		KGSPEROZ = 0.0283495;
		KGSPERGRAM = 0.001;
		
		//wsdl url of the destiny's qa account in metapack
		wsdlUrl = 'http://dm-qa.metapack.com/api/4.x/services/AllocationService?wsdl';
	}
	catch(e)
	{
		errorHandler("initialise", e);
	}
}

/**********************************************************************
 * process Function - doing the processing 
 **********************************************************************/
function process()
{ 
	var payloadRecord = '';

	
	try
	{
		getRequiredData();
		
		//if shipping status is 'packed'
		if(status == 'B')
		{
			SOAPTemplate = getAndCreateSOAPMessageTemplate('createAndAllocateConsignments');

			nlapiLogExecution('debug', 'process SOAPTemplate', SOAPTemplate);

			makeSOAPRequiredData();
			populatedSOAPMessage = populateSOAPMessageWithData();
			SOAPResponse = sendSOAPRequest(populatedSOAPMessage, username,password,wsdlUrl);
			nlapiLogExecution('debug', 'SOAPResponse', SOAPResponse);
			payloadRecord = createConsignmentPayloadRecord();
			nlapiLogExecution('debug', 'payloadRecord', payloadRecord);
		}
	}
	catch(e)
	{
		errorHandler("process", e);
		
	}
}


/**********************************************************************
 * getRequiredDate Function - get the required data (SO and Item fulfilment data) from NetSuite for creating the SOAP request
 * status : A - Picked
 * 			B - Packed
 * 			C - Shipped
 **********************************************************************/
function getRequiredData()
{
	try
	{
		getFulfilmentData();
	
		//if shipping status is 'packed'
		if(status == 'B')
		{
			getSalesOrderData();
		}
	
	}
	catch(e)
	{
		errorHandler("getRequiredDate", e);
		
	}
}

/**********************************************************************
 * getFulfilmentData Function - getting the data from the item fulfilment record 
  **********************************************************************/
function getFulfilmentData()
{
	

	try
	{
		//getting the shipping status . either be pick/ pack / shipped if the 'Pick, Pack and Ship' feature is enabled
		status = nlapiGetFieldValue('shipstatus');
		fulfilmentRecordIntID = nlapiGetRecordId();
		
		//if shipping status is 'packed'
		if(status == 'B')
		{
			//getting the Sales order ref that the item fulfilment record is related to
			createdFrom =  nlapiGetFieldValue('createdfrom');

			//getting the weight unit (lb/kb/g/oz)
			weightUnit= nlapiGetFieldValue('tranweightunit');
			nlapiLogExecution('debug', 'weightUnit', weightUnit);

			noOfFulfilmentLineItems = nlapiGetLineItemCount('item');		//getting the no of items from fulfilment record			

			fulfilmentDate = nlapiGetFieldValue('trandate');				//getting fulfilment date

			//getting the no of packages from fulfilment record
			noOfPackages = nlapiGetLineItemCount('package');
			nlapiLogExecution('debug', 'noOfPackages', noOfPackages);

			//getting shipping address data
			shippingCountry = nlapiGetFieldValue('shipcountry');				//getting the shipping country. Format : A2 format of ISO Country codes . example US, GB
			nlapiLogExecution('debug', 'shippingCountry', shippingCountry);		

			shippingAddressLine1 = nlapiGetFieldValue('shipaddr1');				//getting shipping address line 1
			shippingAddressLine2 = nlapiGetFieldValue('shipcity');				//getting shipping city
			shippingAddressPostCode = nlapiGetFieldValue('shipzip');			//getting shipping post code

			customerName =  nlapiGetFieldValue('shipcompany');					//getting the customer 

			//getting the package weight and calculating the fulfilment(consignment) weight
			for(var x = 1; x <= noOfPackages; x++)
			{
				packageWeightInStandardUnit = nlapiGetLineItemValue('package', 'packageweight', x);
				nlapiLogExecution('debug', 'packageWeightInStandardUnit', packageWeightInStandardUnit);
				totalWeightInStandardUnit = parseFloat(packageWeightInStandardUnit) + parseFloat(totalWeightInStandardUnit);
			}
			nlapiLogExecution('debug', 'totalWeightInStandardUnit', totalWeightInStandardUnit);
		}
	}
	catch(e)
	{
		errorHandler("getFulfilmentData", e);
		
	}
}




/**********************************************************************
 * getSalesOrderData Function - getting sales order fields and line items of SO related the item fulfilment record
 **********************************************************************/
function getSalesOrderData()
{
	//declaring local variables
	var noOfSOLineItems = 0;
	var journalIntID = 0;
	var returnedValue = '';
	var totalItemAmount = 0 ; 
	
	try
	{
		//loading sales order related to fulfilment
		salesOrderRecord = nlapiLoadRecord('salesorder', createdFrom);

		noOfSOLineItems = salesOrderRecord.getLineItemCount('item');			//get no of line items in SO
	
		//looping through each line item in SO
		for(var i = 1; i <= noOfSOLineItems; i++)
		{
			SOItemIntId = salesOrderRecord.getLineItemValue('item', 'item', i);		//getting  line item internal id
				
			//calling the compareFulfilItems function
			compareFulfilItems();

			if(itemFound == 'T')
			{
				itemRate = salesOrderRecord.getLineItemValue('item', 'rate', i);		
				itemRate = parseFloat(itemRate);
				
				totalItemAmount = calculatePrice();								//calling calculatePrice function
				nlapiLogExecution('debug', 'getSOData totalItemAmount' , totalItemAmount);
				
				
				itemFound = 'F'; 		//setting itemFound back to false

				fulfilmentTotal = parseFloat(fulfilmentTotal) + parseFloat(totalItemAmount);
				nlapiLogExecution('debug', 'getSOData fulfilmentTotal' , fulfilmentTotal);
				totalItemAmount = 0.0;
			}
			
		}

		
	}
	catch(e)
	{
		errorHandler('getSOFieldsAndItemLines', e);
	}

}


/**********************************************************************
 * compareFulfilItems Function - compare the SO line items and the fulfilment line items
 * 
 **********************************************************************/
function compareFulfilItems()
{ 
	var retVal = '';
	
	try
	{
				
		//looping through each line item
		for(var i = 1; i <= noOfFulfilmentLineItems; i++)
		{
			itemIntId = nlapiGetLineItemValue('item', 'item', i);			//getting  line item internal id of the fulfilment item
				
			nlapiLogExecution('debug', 'compareFulfilItems itemIntId', itemIntId);
			nlapiLogExecution('debug', 'compareFulfilItems SOItemIntId', SOItemIntId);
			
			//if the fulfilment item and the SO item is equal
			if(SOItemIntId == itemIntId)
			{
				//set Item is found
				itemFound = 'T';
				nlapiLogExecution('debug', 'itemFound', itemFound);
			
				fulfilmentItemQty = nlapiGetLineItemValue('item', 'quantity', i);	//getting the amount of the line item		
				//locationIntID = nlapiGetLineItemValue('item', 'location', i);	//getting location int ID
				
		
				return retVal;
							
			}
		}
	}
	catch(e)
	{
		errorHandler('compareFulfilItems', e);
	}

}


/**********************************************************************
 * calculatePrice Function - calculating the amount (total amount without VAT) of the item
 * 
 * @param itemInternalID - internal id of the item in particular line item
 **********************************************************************/
function calculatePrice()
{
	var itemAmount = 0.00;
	
	try
	{
		fulfilmentItemQty = parseInt(fulfilmentItemQty, 0);
		itemAmount = fulfilmentItemQty * itemRate;
		itemAmount = convertToFloat(itemAmount);

	}	
	catch(e)
	{
		errorHandler('calculatePrice', e);

	}
	return itemAmount;
}



/*****************************************************************************
 * makeSOAPRequiredData Function - make the fields that are required in the SOAP request to Metapack
 * 
 ****************************************************************************/
function makeSOAPRequiredData()
{
	try
	{
		alreadyPalletisedGoodsFlag = false;
		consignmentLevelDetailsFlag = false;
		consignmentValue = convertToFloat(fulfilmentTotal);
		
		
		consignmentWeight = convertToKg();
		nlapiLogExecution('debug', 'consignmentWeight', consignmentWeight);
		
		fragileGoodsFlag =  false;						//[TODO] -check
		liquidGoodsFlag = false;						//[TODO] -check
		
		//maxDimension = 				//[TODO] calculate max dimension (used some multiplication factor) 
		
		moreThanOneMetreGoodsFlag = false; 				//[TODO] -get the dimensions
		/*//passing the values to floats in order to make the calculations
		dimension1 = parseFloat(dimension1);
		dimension2 = parseFloat(dimension2);
		dimension3 = parseFloat(dimension3);

		//get the max dimension
		maxDimension = Math.max(dimension1,dimension2,dimension3);
		maxDimension = parseFloat(maxDimension);
		//setting the flag if the max Dimension is greater than 1 metre
		if(maxDimension > 1)
		{
			moreThanOneMetreGoodsFlag = true;
		}
*/
		
		if(consignmentWeight > 25 )
		{
			moreThanTwentyFiveKgGoodsFlag = true;
		}

		
		orderNumber = 1;				//[TODO] - check this
		
		/*
		 * if no of packages are more, check a way to repeatedly include the parcel's xml code into SOAP Message
		 */
		parcelCount = noOfPackages; 
		dutyPaid = 0.0; 					//[TODO] - check this
		number = parseInt(number,0);		//[TODO] - check this
		parcelDepth = 0.0;					//[TODO] - calculate n check whether required
		parcelHeight = 0.0;					//[TODO] - calculate n check whether required
		parcelValue = 0.0;					//[TODO] - calculate n check whether required
		parcelWeight = consignmentWeight;					//[TODO] - calculate n check whether required
		parcelWidth = 0.0;					
		
		
		/*insuranceValue = parseFloat(insuranceValue);
		parcelDepth = parseFloat(dimension1);
		parcelHeight = parseFloat(dimension2);
		parcelValue = parseFloat(averageCost);
		parcelWeight = parseFloat(volumetricWeight);
		parcelWidth = parseFloat(dimension3);*/

		//getting the country code of the recipient from the 'ISO Country' custom record set
		reciepientCountryCode = genericSearchReturnAnyField('customrecord_isocountrycodes', 'custrecord_a2', shippingCountry, 'custrecord_a3')
		reciepientLine1 = shippingAddressLine1;
		reciepientLine2 = shippingAddressLine2;
		reciepientPostCode = shippingAddressPostCode;
		recipientName = customerName;
		
		//getting the country code of the recipient from the 'ISO Country' custom record set
		senderCountryCode = genericSearchReturnAnyField('customrecord_isocountrycodes', 'custrecord_a2', companyCountry, 'custrecord_a3')
		senderLine1 = companyAddress1;
		senderLine2 = companyCity;
		senderPostCode = companyPostCode;
		senderName = company;
		
		twoManLiftFlag = false;  //[TODO] - check this
	}
	catch(e)
	{
		errorHandler("makeSOAPRequiredData : " , e);
	} 

}

/*****************************************************************************
 * convertToKg Function - convert the weight to kgs from standard weight unit use by the client.
 * (Reason : the Metapack processes the data in kg) * 
 ****************************************************************************/
function convertToKg()
{
	var retVal = 0;
	
	try
	{
		
		switch(weightUnit)
		{
		case 'lbs':
			totalWeightInKg = totalWeightInStandardUnit * KGSPERLB;
			break;
			
		case 'oz':
			totalWeightInKg = totalWeightInStandardUnit * KGSPEROZ;
			break;
			
		case 'g':
			totalWeightInKg = totalWeightInStandardUnit * KGSPERGRAM;
			break;
			
		case 'kg':
			totalWeightInKg = totalWeightInStandardUnit;
			break ;
			
		}
		totalWeightInKg = convertToFloat(totalWeightInKg);
	}
	catch(e)
	{
		errorHandler('convertToKg', e);
		
		
	}
	return totalWeightInKg;
}





/*****************************************************************************
 * populateSOAPMessageWithData Function - populate the SOAP message with actual data
 * 
 ****************************************************************************/
function populateSOAPMessageWithData()
{
	var decodedXML = '';
	try
	{
		SOAPTemplate = replaceAll(SOAPTemplate,'##alreadyPalletisedGoodsFlag##', alreadyPalletisedGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##consignmentLevelDetailsFlag##', consignmentLevelDetailsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##consignmentValue##', consignmentValue);
		SOAPTemplate = replaceAll(SOAPTemplate,'##consignmentWeight##', consignmentWeight);
		SOAPTemplate = replaceAll(SOAPTemplate,'##deliveryPrice##', deliveryPrice);
		SOAPTemplate = replaceAll(SOAPTemplate,'##fragileGoodsFlag##', fragileGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##hazardousGoodsFlag##', hazardousGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##insuranceValue##', insuranceValue);
		SOAPTemplate = replaceAll(SOAPTemplate,'##liquidGoodsFlag##', liquidGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##maxDimension##', maxDimension);
		SOAPTemplate = replaceAll(SOAPTemplate,'##moreThanOneMetreGoodsFlag##', moreThanOneMetreGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##moreThanTwentyFiveKgGoodsFlag##', moreThanTwentyFiveKgGoodsFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##orderNumber##', orderNumber);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelCount##', parcelCount);
		SOAPTemplate = replaceAll(SOAPTemplate,'##dutyPaid##', dutyPaid);
		SOAPTemplate = replaceAll(SOAPTemplate,'##number##', number);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelDepth##', parcelDepth);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelHeight##', parcelHeight);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelValue##', parcelValue);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelWeight##', parcelWeight);
		SOAPTemplate = replaceAll(SOAPTemplate,'##parcelWidth##', parcelWidth);
		SOAPTemplate = replaceAll(SOAPTemplate,'##reciepientCountryCode##', reciepientCountryCode);
		SOAPTemplate = replaceAll(SOAPTemplate,'##reciepientLine1##', reciepientLine1);
		SOAPTemplate = replaceAll(SOAPTemplate,'##reciepientLine2##', reciepientLine2);
		SOAPTemplate = replaceAll(SOAPTemplate,'##reciepientPostCode##', reciepientPostCode);
		SOAPTemplate = replaceAll(SOAPTemplate,'##recipientName##', recipientName);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderCountryCode##', senderCountryCode);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderLine1##', senderLine1);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderLine2##', senderLine2);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderPostCode##', senderPostCode);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderCode##', senderCode);
		SOAPTemplate = replaceAll(SOAPTemplate,'##senderName##', senderName);
		SOAPTemplate = replaceAll(SOAPTemplate,'##twoManLiftFlag##', twoManLiftFlag);
		SOAPTemplate = replaceAll(SOAPTemplate,'##calculateTaxAndDuty##', calculateTaxAndDuty);
		
		//SOAPTemplate = replaceAll(SOAPTemplate,'\n', '');
		
		//encodedXML = encodeXML(SOAPTemplate);
		decodedXML = decodeXML(SOAPTemplate);
		//encodedXML = replaceAll(encodedXML, '> ', '>');
	}
	catch(e)
	{
		errorHandler('populateSOAPMessageWithData', e);
	}
	nlapiLogExecution('debug', 'decodedXML', decodedXML);
	
	return decodedXML;
}

/**************************************************************
 * createConsignmentPayload - create consignment payload record (saving the SOAP request and response)
**************************************************************/
function createConsignmentPayloadRecord()
{
	var conPayloadRecord = ''; 
	var submittedRecord = '';
	var SOAPResponseBody = '';
	var xmlSOAPResponse = '';
	var populatedSOAPMessage1 = '';
	var SOAPResponse1 = '';
	var SOAPResponse2 = '';
	var SOAPResponse3 = '';
	var SOAPResponse4 = '';
	var SOAPResponse5 = '';
	var SOAPResponse6 = '';
	var SOAPResponse7 = '';
	var SOAPResponse8 = '';
	var faultStringIndex = 0;
	var allocatedStatusIndex = 0;
	var processStatusIntID = 0;

	var processingStatus = '';
	
	try
	{
		populatedSOAPMessage1 = populatedSOAPMessage.substring(0, 3500);
		populatedSOAPMessage2 = populatedSOAPMessage.substring(3500, 7000);
		//if any response from the Metapack
		if(SOAPResponse != null)
		{
			//getting the SOAPResponse of the results
			SOAPResponseBody = SOAPResponse.getBody();
			nlapiLogExecution('debug', 'SOAPResponse', SOAPResponse);
			//passing the SOAPResponse to xml format in order to use the xml functions (Reason - the results are not in actual XML format)
			xmlSOAPResponse = nlapiStringToXML(SOAPResponse);
			nlapiLogExecution('debug', 'xmlSOAPResponse', xmlSOAPResponse);
			
			SOAPResponse1 = SOAPResponseBody.substring(0, 3500);
			SOAPResponse2 = SOAPResponseBody.substring(3500, 7000);
			SOAPResponse3 = SOAPResponseBody.substring(7000, 10500);
			SOAPResponse4 = SOAPResponseBody.substring(10500,14000);
			SOAPResponse5 = SOAPResponseBody.substring(14000, 17500);
			SOAPResponse6 = SOAPResponseBody.substring(17500, 21000);
			SOAPResponse7 = SOAPResponseBody.substring(21000, 24500);
			SOAPResponse8 = SOAPResponseBody.substring(24500,29000);
			
			conPayloadRecord = nlapiCreateRecord('customrecord_consignmentpayload');
			
			//checking whether the response returns error
			faultStringIndex = SOAPResponseBody.indexOf('faultstring', 0);
			
			//checking for the status of the allocation 
			allocatedStatusIndex = SOAPResponseBody.indexOf('Allocated', 0);
			
			
			if(faultStringIndex >0)
			{
				processingStatus = 'Failed';
			
			}
			else if(allocatedStatusIndex > 0)
			{
				processingStatus = 'Success';
				
			}
			else
			{
				processingStatus = 'To Be Processed';
			}
			
			//getting the internal id of the particular processingStatus from the 'Metapack SOAP Process Status' list
			processStatusIntID = genericSearch('customlist_metapackprocessstatus', 'name', processingStatus);
			
			//set the 'Process status' field (Note : this field is list record)
			conPayloadRecord.setFieldValue('custrecord_processstatus',processStatusIntID);
			
			conPayloadRecord.setFieldValue('custrecord_soapresponse1',SOAPResponse1);
			conPayloadRecord.setFieldValue('custrecord_soapresponse2',SOAPResponse2);
			conPayloadRecord.setFieldValue('custrecord_soapresponse3',SOAPResponse3);
			conPayloadRecord.setFieldValue('custrecord_soapresponse4',SOAPResponse4);
			conPayloadRecord.setFieldValue('custrecord_soapresponse5',SOAPResponse5);
			conPayloadRecord.setFieldValue('custrecord_soapresponse6',SOAPResponse6);
			conPayloadRecord.setFieldValue('custrecord_soapresponse7',SOAPResponse7);
			conPayloadRecord.setFieldValue('custrecord_soapresponse8',SOAPResponse8);
			conPayloadRecord.setFieldValue('custrecord_soaprequest1',populatedSOAPMessage1);
			conPayloadRecord.setFieldValue('custrecord_soaprequest2',populatedSOAPMessage2);
			conPayloadRecord.setFieldValue('custrecord_soreference',createdFrom);
			conPayloadRecord.setFieldValue('custrecord_fulfilmentref',fulfilmentRecordIntID);
			submittedRecord = nlapiSubmitRecord(conPayloadRecord);
		}
		
	}
	catch(e)
	{
		errorHandler('createConsignmentPayload', e);
	}

	return submittedRecord;
}

/**************************************************************************************************
 * General Public Feature - Client Script
 * 
 * Version    Date            Author           Remarks
 * 1.00       28 Sep 2013     Peter Lewis
 *
 **************************************************************************************************/

var inDebug = true;
var numberOfLineItems = 0;

var prefix = '';

var length = 0;
var width = 0;
var depth = 0;
var weight = 0;

var maxTotalWeight = 50;

var maxDimensionX = 305;
var maxDimensionY = 30;
var maxDimensionZ = 30;

var totalWeight = 0;

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType 
 * 
 * @param {String} type Access mode: create, copy, edit
 * @returns {Void}
 */
function gpClientPageInit(type)
{
	try
	{

		//var el = null; //document.getElementById('tbl_submitter');

		//el = Document.getElementById('tbl_submitter');

		//el.removeChild('submitter');
		//alert('did it work?');
	}
	catch(e)
	{
		errorHandler('gpClientPageInit', e);

	}
	//alert('initiated');
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @returns {Boolean} True to continue save, false to abort save
 */
function gpClientSaveRecord()
{
	//alert('record saved');
	var retVal = true;
	try
	{
		numberOfLineItems = nlapiGetLineItemCount('parcels');

		if(numberOfLineItems == 0)
		{
			alert('In order to progress with this quote, you must enter at least one Parcel.');
			retVal = false;
		}
		else
		{

			totalWeight = 0;

			for(var i = 1; i <= numberOfLineItems; i++)
			{
				weight = parseFloat(nlapiGetLineItemValue('parcels','custcol_weight', i));
				totalWeight += weight;

				//check parcel dimensions
				width = parseFloat(nlapiGetLineItemValue('parcels','custcol_width', i));
				length = parseFloat(nlapiGetLineItemValue('parcels','custcol_length', i));
				height = parseFloat(nlapiGetLineItemValue('parcels','custcol_height', i));

				if(inDebug)
				{
					alert('Checking details on line ' + String(i) + '...Weight: ' 
							+ weight + 'Kg, Height: ' + height + 'cm, Length: ' 
							+ length + 'cm, Width: ' + width + 'cm.');
				}


				if((height > maxDimensionX) && (width > maxDimensionY) && (length > maxDimensionZ))	//height is large, all fail
				{
					alert('The dimensions of the parcel you are trying to send exceeds the maximum permitted size.');
					retVal = false;
				}
				else if((height > maxDimensionY) && (width > maxDimensionX) && (length > maxDimensionZ))	//width is large, all fail
				{
					alert('The dimensions of the parcel you are trying to send exceeds the maximum permitted size.');
					retVal = false;
				}
				else if((height > maxDimensionY) && (width > maxDimensionZ) && (length > maxDimensionX))	//length is large, all fail
				{
					alert('The dimensions of the parcel you are trying to send exceeds the maximum permitted size.');
					retVal = false;
				}
				else	//nothing is large or oversized
				{
					if(inDebug)
					{
						alert('Not failed on all three, doing extra checks');
					}


					if((height > maxDimensionX)||(width> maxDimensionX)||(length > maxDimensionX))
					{
						//too large
						alert('The Parcel on line ' + i + ' is too large for our conveyor.\nPlease contact us if you wish to deliver this.');
						retVal = false;
					}
					else
					{
						if(height <= maxDimensionY)
						{
							if(length > maxDimensionX)
							{
								//failed
							}
							else
							{
								if(width > maxDimensionY)
								{

								}
								else
								{

								}
							}
						}
						else
						{
							//treat as if it's XS

						}
					}
				}
			}

			//if(totalWeight > maxTotalWeight)
			//{
			//	retVal = false;
			//	alert('The weight entered is greater than ' + maxTotalWeight + 'Kg.\nPlease contact us for non-conveyorable parcels.');
			//}
		}

	}
	catch(e)
	{
		errorHandler('gpClientSaveRecord', e);
	}

	return retVal;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Boolean} True to continue changing field value, false to abort value change
 */
function gpClientValidateField(type, name, linenum)
{
	//alert('Validate Field');
	return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @param {Number} linenum Optional line item number, starts from 1
 * @returns {Void}
 */
function gpClientFieldChanged(type, name, linenum)
{
	//alert('Field Changed');
	var validPostcode = false;
	var enteredValue = '';

	try
	{
		if(linenum) //This is a sublist field change
		{
			switch(name)
			{
			case 'custcol_weight':

				enteredValue = nlapiGetCurrentLineItemValue('parcels', name);

				if(enteredValue <= 0)
				{
					alert('Please ensure you have entered a valid weight.');
				}
				break;

			case 'custcol_height':

				enteredValue = nlapiGetCurrentLineItemValue('parcels', name);

				if(enteredValue <= 0)
				{
					alert('Please ensure you have entered a valid height.');
				}
				break;

			case 'custcol_width':

				enteredValue = nlapiGetCurrentLineItemValue('parcels', name);

				if(enteredValue <= 0)
				{
					alert('Please ensure you have entered a valid width.');
				}
				break;

			case 'custcol_length':

				enteredValue = nlapiGetCurrentLineItemValue('parcels', name);

				if(enteredValue <= 0)
				{
					alert('Please ensure you have entered a valid length.');
				}
				break;

			default:
				if(inDebug)
				{
					alert('Name: ' + name + '\nType: ' + type + '\nlineNum: ' + linenum);
				}
			break;
			}
		}
		else
		{
			enteredValue = nlapiGetFieldValue(name);

			switch(name)
			{

//			postedBillingPostcode = request.getParameter('custpage_billingpostcode');
//			postedPickupPostcode = request.getParameter('custpage_pickuppostcode');
//			postedDeliveryPostcode = request.getParameter('custpage_deliverypostcode');

			case 'custpage_billingpostcode':

				validPostcode = checkUKPostCodeFormat(enteredValue);

				if(!validPostcode)
				{
					alert('You have entered an invalid billing postcode.\n\nPlease ensure the postcode entered is correct, then retry.');
					nlapiSetFieldValue(name, '',false, false);
				}
				break;
			case 'custpage_pickuppostcode':

				validPostcode = checkUKPostCodeFormat(enteredValue);

				if(!validPostcode)
				{
					alert('You have entered an invalid pickup postcode.\n\nPlease ensure the postcode entered is correct, then retry.');
					nlapiSetFieldValue(name, '',false, false);
				}
				break;
			case 'custpage_deliverypostcode':

				validPostcode = checkUKPostCodeFormat(enteredValue);

				if(!validPostcode)
				{
					alert('You have entered an invalid delivery postcode.\n\nPlease ensure the postcode entered is correct, then retry.');
					nlapiSetFieldValue(name, '',false, false);
				}
				break;			

			default:
				break;

			}

		}
	}
	catch(e)
	{
		alert('Error Getting Data:\n' + e.message);
	}
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 * 
 * @param {String} type Sublist internal id
 * @param {String} name Field internal id
 * @returns {Void}
 */
function gpClientPostSourcing(type, name) 
{
	//alert('Post Sourcing.\nType= ' + type + '\nName= ' + name);
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function gpClientLineInit(type) 
{
	//alert('Line Initialised.\nType= ' + type);
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to save line item, false to abort save
 */
function gpClientValidateLine(type)
{
	var weight = 0;
	var height = 0;
	var length = 0;
	var width = 0;
	var retVal = true;

	try
	{
		weight = nlapiGetCurrentLineItemValue('parcels', 'custcol_weight');
		height = nlapiGetCurrentLineItemValue('parcels', 'custcol_height');
		length = nlapiGetCurrentLineItemValue('parcels', 'custcol_length');
		width = nlapiGetCurrentLineItemValue('parcels', 'custcol_width');

		if(inDebug)
		{
			alert('Line Validated.\nType= ' + type + '\nWeight= ' + weight + '\nheight= ' + height + '\nlength= ' + length + '\nwidth= ' + width);
		}


		if(weight <=0)
		{
			alert('Please enter a valid weight.');
			retVal = false;
		}

		if(height <=0)
		{
			alert('Please enter a valid height.');
			retVal = false;
		}

		if(length <=0)
		{
			alert('Please enter a valid length.');
			retVal = false;
		}

		if(width <=0)
		{
			alert('Please enter a valid width.');
			retVal = false;
		}

		if(weight > maxTotalWeight)
		{
			retVal = false;
			alert('The weight entered is greater than ' + maxTotalWeight + 'Kg.\nPlease contact us for non-conveyorable parcels.');
		}		
		
		if(height > maxDimensionX)
		{
			retVal = false;
			alert('The height entered is greater than ' + maxDimensionX + 'Kg.\nPlease contact us for non-conveyorable parcels.');
		}
		
		if(depth > maxDimensionY)
		{
			retVal = false;
			alert('The width entered is greater than ' + maxDimensionY + 'Kg.\nPlease contact us for non-conveyorable parcels.');
		}
	
		if(length > maxDimensionZ)
		{
			retVal = false;
			alert('The length entered is greater than ' + maxDimensionZ + 'Kg.\nPlease contact us for non-conveyorable parcels.');
		}
	}
	catch(e)
	{
		alert('error '+ e.message);
	}


	return retVal;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Void}
 */
function gpClientRecalc(type)
{
	//alert('Line Recalc.\nType= ' + type);
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item insert, false to abort insert
 */
function gpClientValidateInsert(type)
{
	//alert('Validate Insert.\nType= ' + type);  
	return true;
}

/**
 * The recordType (internal id) corresponds to the "Applied To" record in your script deployment. 
 * @appliedtorecord recordType
 *   
 * @param {String} type Sublist internal id
 * @returns {Boolean} True to continue line item delete, false to abort delete
 */
function gpClientValidateDelete(type)
{
	//alert('Validate Delete.\nType= ' + type);  
	return true;
}


/**************************************************************************************************
 * 
 * validateCountryPostcode - Validates the Post Code for a given Country
 * 
 * Version 1.00 assumes the Country is the United Kingdom
 * 
 * @param shipCountry - Not used yet. Assumes all lookups are in the United Kingdom
 * @param shipPostcode - The postcode itself
 * @returns {Boolean} - Returns true if it is a valid postcode, or false if it is not 
 **************************************************************************************************/
function validateCountryPostcode(shipCountry, shipPostcode)
{
	var isValidPostCode = false;

	var postcodePrefix = '';

	var postcodeZoneFieldName = 'custbody_postcodezone';

	var palletParcelFieldName = 'custbody_palletparcel';
	var palletParcelFieldValue = '';

	var postcodeSearchFilters = new Array();
	var postcodeSearchColumns = new Array();
	var postcodeSearchResults = null;

	var area = null;
	var altArea = '';
	var currentItem = null;
	var depot = null;
	var delzone = null;

	var typeParcel = '2';
	var typePallet = '1';

	if (shipPostCode && shipCountry) 
	{
		if (checkUKPostCodeFormat(shipPostCode)) 
		{
			postcodePrefix = returnCountryPostcodePrefix(shipPostCode, shipCountry);
			nlapiSetFieldValue(postcodeZoneFieldName, postcodePrefix, false, false);

			palletParcelFieldValue = nlapiGetFieldValue(palletParcelFieldName);

			if (palletParcelFieldValue == typePallet) 
			{ //Pallet lookup
//				// search for postcode area record
//				var postcodeSearchFilters = new Array();
//				var postcodeSearchColumns = new Array();

//				postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
//				postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

//				postcodeSearchColumns[0] = new nlobjSearchColumn('name');
//				postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_tpnzone');
//				postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_pricingzone');
//				postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deliverydepot');

//				var postcodeSearchResults = nlapiSearchRecord('customrecord_pallet_postcodelookup', null, postcodeSearchFilters, postcodeSearchColumns);

//				// retrieve area and depot number
//				if (postcodeSearchResults) 
//				{
//				var area = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);
//				var deldepot = postcodeSearchResults[0].getValue(postcodeSearchColumns[3]);
//				var tpnzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);

//				// populate custom fields
//				nlapiSetFieldValue('custbody_pallet_zone', area, false, false);
//				if (type == 'delivery') 
//				{
//				nlapiSetFieldValue('custbody_receivingdepot', deldepot, false, false);
//				nlapiSetFieldValue('custbody_palletdeliveryzone', tpnzone, false, false);
//				}
//				else 
//				{
//				nlapiSetFieldValue('custbody_palletcollectingdepot', deldepot, false, false);
//				nlapiSetFieldValue('custbody_sendingdepot', deldepot, false, false);
//				}
//				//if (isTestUser()) alert('prefix = ' + postcodePrefix + '\ndepot = ' + deldepot);
//				} //if				
			}
			else 
			{ // Parcel lookup
				// search for postcode area record
				postcodeSearchFilters[0] = new nlobjSearchFilter('name', null, 'is', postcodePrefix);
				postcodeSearchFilters[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');

				postcodeSearchColumns[0] = new nlobjSearchColumn('custrecord_area');
				postcodeSearchColumns[1] = new nlobjSearchColumn('custrecord_depotnumber');
				postcodeSearchColumns[2] = new nlobjSearchColumn('custrecord_parceldeliveryzone');
				postcodeSearchColumns[3] = new nlobjSearchColumn('custrecord_deldays');

				postcodeSearchResults = nlapiSearchRecord('customrecord_postcodetable', null, postcodeSearchFilters, postcodeSearchColumns);
				//var postcodeSearchResults = true;

				// retrieve area and depot number
				//if (postcodeSearchResults) {
				area = postcodeSearchResults[0].getValue(postcodeSearchColumns[0]);

				depot = postcodeSearchResults[0].getValue(postcodeSearchColumns[1]);
				delzone = postcodeSearchResults[0].getValue(postcodeSearchColumns[2]);

				//nlapiSetFieldValue('custbody_deliverydays', postcodeSearchResults[0].getValue(postcodeSearchColumns[3]), false, false);


				//alert(getPostCodeLocalException(shipPostCode));
				var depotexception = getPostCodeLocalException(shipPostCode);
				if (depotexception != 0) 
				{
					depot = depotexception; // This overrides the 'real' depot with the local
				}


				isValidPostCode = true;
			}
		} //if
		else 
		{
			alert('Postcode ' + shipPostCode + ' not a valid format.');
		}
	} //if
	return isValidPostCode;

} //function




/********************************************************************************
 * 
 * checkUKPostCodeFormat - checks the format of the passed in Post Code as a parameter
 * 
 * @param {String} toCheck - the Post Code to check
 * 
 * @returns {String} - The postcode if it is valid, or FALSE if it is not
 * 
 ********************************************************************************/

function checkUKPostCodeFormat(toCheck)
{

	// Permitted letters depend upon their position in the postcode.
	var alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
	var alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
	var alpha3 = "[abcdefghjkstuw]"; // Character 3
	var alpha4 = "[abehmnprvwxy]"; // Character 4
	var alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
	// Load up the string to check
	var postCode = '';
	// Assume we're not going to find a valid postcode
	var valid = false;
	// Array holds the regular expressions for the valid postcodes
	var pcexp = new Array();

	var retVal = '';

	try
	{
		// Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
		pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1,2})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

		// Expression for postcodes: ANA NAA
		pcexp.push(new RegExp("^(" + alpha1 + "{1}[0-9]{1}" + alpha3 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

		// Expression for postcodes: AANA  NAA
		pcexp.push(new RegExp("^(" + alpha1 + "{1}" + alpha2 + "?[0-9]{1}" + alpha4 + "{1})(\\s*)([0-9]{1}" + alpha5 + "{2})$", "i"));

		// Exception for the special postcode GIR 0AA
		pcexp.push(/^(GIR)(\s*)(0AA)$/i);

		// Standard BFPO numbers
		pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);

		// c/o BFPO numbers
		pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);

		// Load up the string to check
		postCode = toCheck;

		// Check the string against the types of post codes
		for (var i = 0; i < pcexp.length; i++) 
		{
			if (pcexp[i].test(postCode)) 
			{

				// The post code is valid - split the post code into component parts
				pcexp[i].exec(postCode);

				// Copy it back into the original string, converting it to uppercase and
				// inserting a space between the inward and outward codes
				postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();

				// If it is a BFPO c/o type postcode, tidy up the "c/o" part
				postCode = postCode.replace(/C\/O\s*/, "c/o ");

				// Load new postcode back into the form element
				valid = true;

				// Remember that we have found that the code is valid and break from loop
				break;
			}
		}

		if (valid) 
		{
			retVal = postCode;
		}
		else
		{
			retVal = '';
		}
	}
	catch(e)
	{
		errorHandler('checkUKPostCodeFormat', e);
	}
	return retVal;
}


/**************************************************************************************************
 * 
 * Error Handler
 * 
 * @param sourceName - the name of the function which caused the error
 * @param e - the error object itself
 * 
 **************************************************************************************************/
function errorHandler(sourceName, e)
{
	if ( e instanceof nlobjError )
	{
		alert('Error:\n\nUnexpected error in ' + sourceName + '. Code: ' + e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
		nlapiLogExecution( 'ERROR', 'system error occured in: ' + sourceName, e.getCode() + '\n' + e.getDetails() + '\n' + e.getStackTrace());
	}
	else
	{
		alert( 'Error:\n\nUnexpected error in ' + sourceName + '.\nError Message is ' + e.message);
		nlapiLogExecution( 'ERROR', 'unexpected error in: ' + sourceName, e.message);
	}
}



/***************************************************************************************************
 * 
 * @param x
 * @param y
 * @param z
 * @param kg
 * @returns {Number}
 * 
 **************************************************************************************************/ 
function getNearestServiceForItem(x,y,z,kg)
{
	var retVal = -1;

	try
	{

	}
	catch(e)
	{
		errorHandler('getNearestServiceForItem', e);
	}
	return retVal;
}


/***************************************************************************************************
 * 
 * checkForValidSize - pass in the size parameters and the function will check to see if it is 
 * convyerable parcel or not.
 * 
 * @param x - x axis size
 * @param y - y axis size
 * @param z - z axis size
 * @param kg - weight in kilograms
 * @returns {Boolean} - whether it can be conveyed or not
 ***************************************************************************************************/
function checkForValidSizes(x,y,z,kg)
{
	var retVal = false;
	var invalidSizeMessage = 'The sizes you have entered are not conveyable parcels.\n\nPlease contact us.';

	try
	{
		if((x > maxDimensionX)&&(y > maxDimensionY)||(x > maxDimensionY))
		{
			alert(invalidSizeMessage);
		}
		if((y > maxDimensionX)&&(y > maxDimensionY)||(x > maxDimensionY))
		{
			alert(invalidSizeMessage);
		}
		if((x > maxDimensionX)&&(y > maxDimensionY)||(x > maxDimensionY))
		{
			alert(invalidSizeMessage);
		}
	}
	catch(e)
	{
		errorHandler('checkForValidSizes', e);	
	}
	return retVal;
}

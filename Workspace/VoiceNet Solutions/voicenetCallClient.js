/*********************************************************************************************************************************************************
 * Name: 			voicenetCallClient.js
 * Script Type: 	Client
 * Client:			Cloud Computing Services
 * 
 * Version: 		1.0.0 – 15/01/2013 – 1st release - AM
 *
 * Author: 			FHL
 * Purpose: 		Calls a Suitelet when relevant button is pressed
 * 
 * Script: 		 	customscript_voicenetcallclient
 * Deploy:			customdeploy_voicenetcallclientcontact  - Contact
 * 					customdeploy_voicenetcallclientcustomer - Customer
 * 					customdeploy_voicenetcallclientemployee - Employee	
 * 					customdeploy_voicenetcallclientpartner 	- Partner
 * 					customdeploy_voicenetcallclientsupplier - Supplier
 * 					
 * Library: 		library.js
 * 
 * Parameters:		custscript_scriptid
 * 					custscript_deployid		
 * 
 *********************************************************************************************************************************************************/

//Global Variables.
var labelColumn = 0;
var fieldNameColumn = 1;
var phoneNumberColumn = 2;
var recordIntID = 0;
var recordType = null; 
var phoneImage = 'https://system.netsuite.com/core/media/media.nl?id=4383&c=1030551&h=3afa2693cdbdfc77650b';
var phoneNumber = '';

//Create a 2D Array.
var arrayPhone = new Array(3);

//Add variables to the 2D Array.
arrayPhone[labelColumn] = new Array();
arrayPhone[fieldNameColumn] = new Array();
arrayPhone[phoneNumberColumn] = new Array();



/*****************************************************************************
 * Must run before the jQuery
 * 
 * Bugfix for IE. Array.indexOf method not implemented
 *****************************************************************************/
if (!Array.prototype.indexOf)
{
	Array.prototype.indexOf = function(obj, start)
	{
		for(var i = (start || 0), j = this.length; i < j; i++)
		{
			if (this[i] === obj)
			{
				return i;
			}
		}
		return -1;
	};
}

/*****************************************************************************
 * Must run before the jQuery
 * 
 * Check if contains is defined and if it is check the object.
 *****************************************************************************/
if (typeof String.prototype.contains === 'undefined') 
{ 
	String.prototype.contains = function(it) 
	{ 
		return this.indexOf(it) != -1; 
	};
}


// Call this function to get all field values before jQuery runs.
dynamicallyPopulateTelephonyFieldsArray();


/*****************************************************************************
 * jQuery - This code CANNOT be added into a function and runs on the forms it is deployed: Contact, Customer, Employee, Partner, Supplier
 * 																 
 * 	
 *****************************************************************************/
for(var i = 0; i < arrayPhone[labelColumn].length; i++)
{
	arrayPhone[phoneNumberColumn][i] = jQuery(arrayPhone[labelColumn][i]).parent().parent().children(':last').text();

	//alert('phoneNumber ' + arrayPhone[phoneNumberColumn][i] + '\nlabelColumn ' + arrayPhone[labelColumn][i] + '\nfieldNameColumn ' + arrayPhone[fieldNameColumn][i]);

	jQuery(arrayPhone[labelColumn][i])
	.parent()
	.parent()
	.children(':last')
	.html(
			jQuery(arrayPhone[labelColumn][i])		// Adds button to end of this tag.
			.parent()
			.parent()
			.children(':last').html() + '<a href="javascript:void(0)"><img style="border-style:none;" src="' + phoneImage + '" onclick="voicenetCallClient(' + String.fromCharCode(39) +  String(arrayPhone[fieldNameColumn][i]) + String.fromCharCode(39)  + '); return false" /></a>'
	);
}


/*****************************************************************************
 * dynamicallyPopulateTelephonyFieldsArray
 *
 *
 * Get all fields from the record. Check if they contain 'phone'. If so append '#' and
 * '_fs_lbl'
 *****************************************************************************/
function dynamicallyPopulateTelephonyFieldsArray()
{
	var recordId = '';
	var recordType = '';
	var fieldName = '';
	var fieldLabel = '';
	var sourceRecord = null;
	var allFields = null;

	try
	{
		recordId = nlapiGetRecordId();
		recordType = nlapiGetRecordType();
		
		sourceRecord = nlapiLoadRecord(recordType, recordId);
		allFields = sourceRecord.getAllFields();

		if(allFields != null)
		{
			for(var i=0;i < allFields.length; i++)
			{
				try
				{
					if(allFields[i].contains('phone'))
					{
						fieldLabel = '#' + allFields[i] + '_fs_lbl';
						fieldName = allFields[i];
						addFieldLabelAndName(fieldLabel, fieldName);
					}
				}
				catch(e)
				{
					alert('dynamicallyPopulateTelephonyFieldsArray allFields' +  e.message);
//					errHandler('getAllFieldsOnRecord' , e);
				}
			}	
		}
		
	}
	catch(e)
	{
		alert('dynamicallyPopulateTelephonyFieldsArray' + e.message);
//		errHandler('dynamicallyPopulateTelephonyFieldsArray' , e);
	}
}


/*****************************************************************************
 * voicenetCallClient -	
 * 
 * Calls the client script in a suitelet window 
 * 
 *****************************************************************************/
function voicenetCallClient(fieldName)
{
	try
	{
		phoneNumber = getPhoneNumberByFieldName(fieldName);
		recordIntID = nlapiGetRecordId();
		recordType = nlapiGetRecordType();
		loadSuitelet();
	}
	catch(e)
	{
//		alert('voicenetCallClient ' + e.message);
		errHandler('voicenetCallClient : ', e);
	}
}


/*****************************************************************************
 * loadSuitelet - Loads a 
 * 
 * 
 *****************************************************************************/
function loadSuitelet()
{	
	var context = null;
	var scriptNo = 0;
	var deployNo = 0;
	var suiteletURL = null;
	var params = ''; 
	var height = 300; 
	var width = 800; 

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
		scriptNo = context.getSetting('SCRIPT', 'custscript_scriptid');
		deployNo = context.getSetting('SCRIPT', 'custscript_deployid');
		suiteletURL = nlapiResolveURL('SUITELET', scriptNo, deployNo);
		
		phoneNumber = trimAll(phoneNumber);
		
		suiteletURL = suiteletURL + '&custparam_phonenumber=' + phoneNumber;
		suiteletURL = suiteletURL + '&custparam_type=' + recordType;
		suiteletURL = suiteletURL + '&custparam_intid=' + recordIntID;
		
		window.open(suiteletURL, 'Call', params);
	}
	catch(e)
	{
//		alert('loadSuitelet ' + e.message);
		errHandler("loadSuitlet", e);
	}     	      
}


/*************************************************************************
 * getPhoneNumberByFieldName - gets the Phone Number by passing in the Field Name
 * 
 * @param fieldName
 * @returns {String}
 ***********************************************************************/
function getPhoneNumberByFieldName(fieldName)
{
	var rowId = -1;
	var retVal = '';

	try
	{
		rowId = getRowIdByFieldName(fieldName);
		retVal = arrayPhone[phoneNumberColumn][rowId];
	}
	catch(e)
	{
//		alert('getPhoneNumberByFieldName ' + e.message);
		errHandler('getPhoneNumberByFieldName',e);
	}

	return retVal;
}


/*****************************************************************************
 * getRowIdByFieldName
 * 
 * @param {String} fieldName - Name of the field you wish to find the rowID of
 * @returns {Integer} rowId - the rowId in the array where the fieldName was found
 *****************************************************************************/
function getRowIdByFieldName(fieldName)
{
	var rowId = -1;

	try
	{
		if(arrayPhone[fieldNameColumn].indexOf(fieldName) != -1)
		{
			rowId = arrayPhone[fieldNameColumn].indexOf(fieldName);
		}
		else
		{
			rowId = -1;
		}
	}
	catch(e)
	{
//		alert('getRowIdByFieldName ' + e.message);
		errHandler('getRowIdByFieldName', e);
	}

	return rowId;
}


/*****************************************************************************
 * getPhoneNumberByFieldLabel - gets the Phone Number by passing in the Field Label
 * 
 * @param fieldLabel
 * @returns {String}
 *****************************************************************************/
function getPhoneNumberByFieldLabel(fieldLabel)
{
	var rowId = -1;
	var retVal = '';

	try
	{
		rowId = getRowIdByFieldLabel(fieldLabel);
		retVal = arrayPhone[phoneNumberColumn][rowId];
	}
	catch(e)
	{
//		alert('getPhoneNumberByFieldLabel '+e.message);
		errHandler('getPhoneNumberByFieldLabel',e);
	}

	return retVal;
}


/*****************************************************************************
 * getRowIdByFieldLabel
 * 
 * @param {String} fieldLabel - Label of the field you wish to find the rowID of
 * @returns {Integer} rowId - the rowId in the array where the fieldName was found
 *****************************************************************************/
function getRowIdByFieldLabel(fieldLabel)
{
	var rowId = -1;

	try
	{
		if(arrayPhone[labelColumn].indexOf(fieldLabel) != -1)
		{
			rowId = arrayPhone[labelColumn].indexOf(fieldLabel);
		}
	}
	catch(e)
	{
//		alert('getRowIdByFieldLabel ' + e.message);
		errHandler('getRowIdByFieldLabel', e);
	}
	return rowId;
}


/*****************************************************************************
 * Removes white spaces before and after
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns str - the string with white spaces removed
 *****************************************************************************/
function trimAll(str)
{
	str = ltrim(str);
	str = rtrim(str);
	return str;
}


/*****************************************************************************
 * Removes white spaces before
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns str - the string with white spaces removed before
 *****************************************************************************/
function ltrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("^[" + chars + "]+", "g"), "");
}


/*****************************************************************************
 * Removes white spaces after
 *
 * @param str - the string that needs the white spaces to be removed
 * @returns str - the string with white spaces removed after
 *****************************************************************************/
function rtrim(str) 
{
	var chars = "\\s";
	return str.replace(new RegExp("[" + chars + "]+$", "g"), "");
}


/*****************************************************************************
 * addFieldLabelAndName - gets the Phone Number by passing in the Field Label
 * 
 * @param fieldLabel
 * @param fieldName
 * @returns {String}
 *****************************************************************************/
function addFieldLabelAndName(fieldLabel, fieldName)
{
	var rowId = -1;
	var retVal = '';
	var newRowId = 0;

	try
	{
		//check to see if the name is already in the array
		rowId = getRowIdByFieldName(fieldName);

		if(rowId == -1)
		{
			newRowId = getNewRowID();
			arrayPhone[fieldNameColumn][newRowId] = fieldName;
			arrayPhone[labelColumn][newRowId] = fieldLabel;
			
		}
		else
		{
			//[TODO] already in the array???? decide what to do here?
		}
	}
	catch(e)
	{
//		alert('addFieldLabelAndName ' + e.message);
		errHandler('addFieldLabelAndName',e);
	}

	return retVal;
}


/*****************************************************************************
 * getNewRowID - gets the next empty array position for you
 * 
 * @returns {number} - the next RowId you may use in arrayPhone for a new element
 *****************************************************************************/
function getNewRowID()
{
	var arrayLength = null;
	var retVal = -1;

	try
	{
		arrayLength = arrayPhone[fieldNameColumn].length;
		
		if(arrayLength == null)
		{
			retVal = 0;
		}
		else
		{
			retVal = arrayLength;
		}
	}
	catch(e)
	{
//		alert('getNewRowID ' + e.message);
		errHandler('getNewRowID',e);
	}
	return retVal;
}


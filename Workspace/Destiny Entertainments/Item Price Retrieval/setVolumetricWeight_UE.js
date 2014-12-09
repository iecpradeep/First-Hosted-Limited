/*************************************************************************************
 * Name:		setVoulmetricWeight.js
 * Script Type:	User event
 *
 * Version:		1.0.0 - 07 May 2013 - first release - SA
 *				1.0.1 - 09 May 2013 - adding if statement - AS
 *									- changing the internal ID of divisionFactor - AS
 *									- Adding getItemData function - AS
 *									- adding getDivisionFactor function - AS
 *
 * Author:		FHL
 * 
 * Purpose:		calculate volumetric weight and set the field value.
 * 
 * Script: 		customscript_setvolumetricweight 
 * Deploy: 		customdeploy_setvolumetricweight
 * 
 * Notes:		
 * 
 * Library: 	Library.js
 *************************************************************************************/

var dimension1 = 0;
var dimension2 = 0;
var dimension3 = 0;
var divisionFactor = 0;

var dimensionalWeight = 0;
var weight = 0;
var weightInKg = 0;

var weightUnit = null;

var recordType = null;
var recordId = 0;

/***********************************************
 * Main
 * 
 ***********************************************/
function Main(type)
{
	
	//Note : if this 'type' checking is not set, then even xedit will work, but in
	//xedit mode it cannot get the field values, so the script will not work properly
	if(type == 'create' || type == 'edit')
	{
		//initialising the static variables use in the script
		initialise();
			
		//doing the processing
		process();
	}
	
	
}

/**********************************************
 * 
 * initialise
 * 
 *********************************************/
function initialise()
{
	try
	{
		recordType = nlapiGetRecordType();
		recordId = nlapiGetRecordId();

	}
	catch(e)
	{
		errorHandler("initialise", e);
	}
}

/**************************************************
 * 
 * main process
 * 
 *************************************************/
function process()
{
	try
	{
		getItemData();
		calculateDimensionalWeight();
		calculateWeightInKg();
		setVolumetricWeight();

	}
	catch(e)
	{
		errorHandler("process", e);
	}
}


/**********************************************
 * getItemData - get required field values from the item record
 * 
 * version 1.0.1 - 09 May 2013 - changing the internal ID of divisionFactor - AS
 *							   - Adding getItemData function - AS
 *********************************************/
function getItemData()
{ 
	var itemPriceRetrievalSettingsRecord = null; 
	try
	{

		// get the field values from item record
		dimension1 = nlapiGetFieldValue('custitem_dimension1');
		dimension2 = nlapiGetFieldValue('custitem_dimension2');
		dimension3 = nlapiGetFieldValue('custitem_dimension3');		
		
		divisionFactor = getDivisionFactor();

		weight = nlapiGetFieldValue('weight');
		
		if(weight == '')
		{
			weight = 0.0;
			weight = parseFloat(weight);
		}

	}
	catch(e)
	{
		errorHandler("getItemData", e);
	}
}


/***************************************************
 * 
 * dimensional Weight - calculate dimensional weight
 * 
 * version 1.0.1 - adding if statement - AS
 ****************************************************/
function calculateDimensionalWeight()
{
	try
	{
		//version 1.0.1
		if((dimension1 != '') || (dimension2 != '') || (dimension3 != '') || (divisionFactor != '') )
		{
			// calculate the dimensional weight by multiplying the field values
			dimensionalWeight = (dimension1 * dimension2 * dimension3) / divisionFactor;
		}
	
		
	}
	catch(e)
	{
		errorHandler("calculateDimensionalWeight", e);
	}
}

/*************************************************************************
 * 
 *  weightInKg  - if weight entered in other than k.g then convert to kg.
 * 
 ************************************************************************/
function calculateWeightInKg()
{
	try
	{
		// get the weight unit from item record, e.g kg, lb etc 
		weightUnit = nlapiGetFieldValue('weightunit');
		
		switch (weightUnit)
		{

			// if weight unit is lb then convert to kg, 2.20462 is the number using to convert lb to kg  , lb = 1
		case '1':

			weightInKg = weight / 2.20462;

			break;

			// if weight unit is oz then convert to kg, 35.274 is the number using to convert oz to kg, oz = 2	
		case '2':

			weightInKg = weight / 35.274;

			break;

			// if weight unit is kg then simply divide by 1 , to keep as it is.	oz = 3	
		case '3':

			weightInKg = weight / 1;

			break;
			// if weight unit is gram then convert to kg, 1000 is the number using to convert g to kg, oz = 4		
		case '4':

			weightInKg = weight / 1000;

			break;

		}

	}
	catch(e)
	{
		errorHandler("calculateWeightInKg", e);
	}
}

/*********************************************************************************************************************
 * 
 * setVolumetricWeight - compare dimensional weight and weight in kg, set the higher value to volumetric weight field.
 * 
 ********************************************************************************************************************/
function setVolumetricWeight()
{
	try
	{

		// compare dimensional weight and weight in kg, get which ever is higher  and set to volumetric field.	

		if ((dimensionalWeight > weightInKg) && (dimensionalWeight > 0))
		{	
			// putting into float and restrict to 2 decimal ( library function)
			dimensionalWeight = parseFloat(dimensionalWeight);
			nlapiSubmitField(recordType, recordId, 'custitem_volumetricweight', dimensionalWeight);

		}
		else if ((dimensionalWeight < weightInKg) && (weightInKg > 0))
		{
			//putting into float and restrict to 2 decimal ( library function)
			weightInKg = convertToFloat(weightInKg);
			nlapiSubmitField(recordType, recordId, 'custitem_volumetricweight', weightInKg);

		}

		else
		{
			nlapiSubmitField(recordType, recordId, 'custitem_volumetricweight', '');

		}

	}
	catch(e)
	{
		errorHandler("setVolumetricWeight", e);
	}
}




/**************************************************************************
 * getDivisionFactor - get the division factor from custom record set called 'Item Price Retrieval Settings'
 * 
 * version 1.0.1 - adding getDivisionFactor function - AS
 *************************************************************************/
function getDivisionFactor()
{
	var searchColumns = new Array();
	var searchResults = null;
	var returningValue = 0;
	
	try
	{
		// return columns
		searchColumns[0] = new nlobjSearchColumn('custrecord_iprs_volumetricdivisionfactor');

		// perform search
		var searchResults = nlapiSearchRecord('customrecord_iprsettings', null, null, searchColumns);

		if(searchResults!=null)
		{

			if(searchResults.length>0)
			{
				searchResult = searchResults[ 0 ];
				returningValue = searchResult.getValue('custrecord_iprs_volumetricdivisionfactor');
			}

		}

	}
	catch(e)
	{
		errorHandler("getDivisionFactor", e);
	} 

	return returningValue;
}
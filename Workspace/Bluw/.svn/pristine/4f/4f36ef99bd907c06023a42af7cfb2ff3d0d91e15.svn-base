function fieldChanged(type, name)
{
	//
	// Calculate total battery weight
	// and calculate total weight when a field has changed
	//
	
	if (name == 'custitem_number_of_batteries' || name == 'custitem_batterytype' || 
		name == 'custitem_product_weight' || name == 'custitem_packaging_weight') // If required fields for calculation trigger have changed
	{
		calcBatteryWeight();
	}
}

function beforeSubmit(type)
{
	//
	// Calculate total battery weight
	// and calculate total weight upon submitting of a record
	//
	
	calcBatteryWeight();
}

function calcBatteryWeight()
{
	//
	// Calculate total battery weight
	// and calculate total weight
	//
	
	// Get number of batteries input
	var numBatteries = parseFloat(nlapiGetFieldValue('custitem_number_of_batteries'));
	
	var batteryTypeId = nlapiGetFieldValue('custitem_batterytype');
	var totalBatteryWeight, batteryRecord, batteryWeight;
	
	// Get weight of battery type chosen
	batteryTypeId ? batteryRecord = nlapiLoadRecord('customrecord_batterytype', batteryTypeId) : batteryRecord = null;
	batteryRecord ? batteryWeight = batteryRecord.getFieldValue('custrecord_batteryweight') : batteryWeight = null;
	
	// If both number of batteries and weight valid, set total weight
	if (!isNaN(numBatteries) && !isNaN(batteryWeight) && batteryRecord)
	{
		totalBatteryWeight = numBatteries*batteryWeight;
		nlapiSetFieldValue('custitem_totalweightofbatteries', totalBatteryWeight);
	}
	else // Blank total battery weight field
	{
		nlapiSetFieldValue('custitem_totalweightofbatteries', '');
	}
	
	// Total weight calculation
	var prodWeight = nlapiGetFieldValue('custitem_product_weight');
	var packWeight = nlapiGetFieldValue('custitem_packaging_weight');
	
	if (prodWeight.length > 0 && packWeight.length > 0 && !isNaN(totalBatteryWeight))
	{
		var totalWeight = parseFloat(prodWeight) + parseFloat(packWeight) + parseFloat(totalBatteryWeight);
		nlapiSetFieldValue('custitem_total_weight', totalWeight);
	}
	else if (prodWeight.length > 0 && packWeight.length > 0)
	{
		var totalWeight = parseFloat(prodWeight) + parseFloat(packWeight);
		nlapiSetFieldValue('custitem_total_weight', totalWeight);
	}
	else // Blank total field
	{
		nlapiSetFieldValue('custitem_total_weight', '');
	}
}

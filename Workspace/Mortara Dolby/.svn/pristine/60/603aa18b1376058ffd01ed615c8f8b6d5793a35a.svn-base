/**
 * Get internal ID of a body field
 */
function getBodyFieldID(type, name, linenum)
{
	//only run for current user
	if (nlapiGetUser() == 3)
	{
		//Set field id
		if (name == '')
		{
			//Throw alert showing internal ID
			var reqID = nlapiGetFieldValue(name);
			alert('Internal ID: ' + reqID);
		}
	}
}

/**
 * Get internal ID of a sublist field
 */
function getSublistFieldID(type, name, linenum)
{
	//only run for current user
	if (nlapiGetUser() == 3)
	{
		//Set sublist and field ids
		//if (type == '' && name == '')
		//{
			//Throw alert showing ID
			//nlapiSelectLineItem(type, linenum);
			var reqID = nlapiGetCurrentLineItemValue(type, name);
			alert('Internal ID: ' + name);
		//}
	}
}
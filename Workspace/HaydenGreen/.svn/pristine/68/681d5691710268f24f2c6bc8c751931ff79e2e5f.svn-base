/*******************************************************
 * Name: 					copyTitle
 * Script Type: 			Client
 * Version: 				1.0.000
 * Date: 					23rd March 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Copy Title from CreatedFrom drop down
 * Checked by:			
 *******************************************************/

var createdFrom = '';

 function onSaveFillTitle()
 {
 	try
	{
		
		//var opportunityRec = nlapiLookupField('opportunity',createdFrom,'title');
		createdFrom = nlapiGetFieldText('opportunity');
		nlapiSetFieldValue('custbody_opportunity', createdFrom);
	}
	catch(e)
	{
				
	}
	return true;
 }

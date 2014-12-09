/**********************************************************************************************************
 * Name:		custNameRegCS.js
 * 
 * Script Type:	Client Script
 * 
 * Version:		1.0.0 - 14/06/2013 - Initial release - SB
 * 				1.0.1 - 02/07/2013 - Swap functionality so custom salutation field drives Mr/Mrs field - SB
 *
 * Author:		S.Boot FHL
 * 
 * Purpose:		Populate the mandatory custom Salutation field
 * 
 * Script: 		
 * Deploy: 		
 * 
 * Libraries:	Library.js
 *  	
 **********************************************************************************************************/

function fieldChanged(type, name, lineNum)
{
	try
	{
//		if (name == 'salutation')
//		{
//			if (nlapiGetFieldValue('salutation'))
//			{
//				nlapiSetFieldText('custentity_salutation', nlapiGetFieldValue('salutation'), true, true);
//			}
//		}
		
		if (name == 'custentity_salutation')
		{
			nlapiSetFieldValue('salutation', nlapiGetFieldText('custentity_salutation'), true, true);
		}
	}
	catch(e)
	{
		errorHandler('fieldChanged', e);
	}
}
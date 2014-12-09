/********************************************************************
 * 
 * 
 * ************************ NOT USED IN SB 1 ************************
 * 
 * 
 * 
 * Name:		itemSelectorUE.js
 * Script Type:	User Event
 *
 * Version:		1.0.1 � 09/01/2013 � 1st release - AM
 * 				1.0.1 - 11/01/2013 - Addition of library.js and errorHandler - AM
 *
 * Author:		FHL
 * 
 * Purpose:		To create a button on the Sales Order Form
 * 
 * Script: 		customscript_itemselector
 * Deploy: 		customdeploy_itemselector
 *
 * 
 * Library: 	library.js
 * 
 ********************************************************************/


/**
 * before record load
 * 
 * @param type
 * @param form
 */
function beforeLoadButton(type, form)
{
	try
	{ 
		if(type == 'create' || type == 'edit')
		{     		
			form.addButton('custpage_customer','Get Items by Catalogue', "itemSelectorClient");
			form.setScript('customscript_itemselectorclient');	
		}	
	}
	catch(e)
	{
		errorHandler("beforeLoadButton ", e);
	}
}
/*******************************************************
 * Name:		Expense report customisations
 * Script Type:	
 *
 * Version:	1.0.0 - 21/06/2012 - Initial version

 * Author:	A.Nixon - D.Birt - P.Lewis - FHL
 * Purpose:	
 *            
 *******************************************************/

var context = nlapiGetContext();
var userName = context.getUser();	
var userRole = context.getRole();

// gets the item number 
function getItemNumber(type, name, linenum)
{
	// get variables
	try
	{
		var itemNumber = nlapiGetCurrentLineItemValue('item','item');
		
		alert(itemNumber);
	}
	catch(e)
	{
		
	}
	
	return true;
}
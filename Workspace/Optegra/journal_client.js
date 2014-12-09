/*****************************************
 * Name:	 Journal Entry Customisations
 * Author:   FHL - D Birt
 * Client: 	 Optegra
 * Date:     17 June 2012
 * Version:  1.0.0
 * 			 1.0.1 04/04/2013 - LG
******************************************/

/*************************************************************
 * On Save function
 * Used to detect differences between dr/cr in departments
 *************************************************************/

function onSave()
{
	
	var lineCount = nlapiGetLineItemCount('line');
	var department;
	var departmentText;
	var departmentName = new Array();
	var departmentBalance = new Array();
	var debit = 0.00;
	var credit = 0.00;
	var error = false;
	var alertString = '';
	var alertDetail = '';
	var balance = 0;
	
			
	for (var i=1; i<=lineCount; i++)
	{
		department = parseInt(nlapiGetLineItemValue('line','location',i));
		departmentText = nlapiGetLineItemText('line','location',i);
		credit = parseFloat(nlapiGetLineItemValue('line','credit',i));
		debit = parseFloat(nlapiGetLineItemValue('line','debit',i));
		
		
		departmentName[department] = departmentText;
		
		// if department balance array element is undefined then set to 0.00
		if (departmentBalance[department] == 'undefined' || departmentBalance[department] == null)
		{

			departmentBalance[department] = 0.00;
		}
		
		// if debit exists then debit dept balance
		if (!isNaN(debit))
		{

			departmentBalance[department] -= debit;			
		} //if

		// if credit exists then credit dept balance
		if (!isNaN(credit))
		{

			departmentBalance[department] += credit;				
		} //if
	
		
	} //for	
	

	// loop through array elements, if dept exists and balance is not 0 then add to error detail
	for (var j=0; j < departmentName.length; j++)
	{
		
		if (departmentName[j] != 'undefined' && departmentName[j] != null)
		{
			
			balance = parseFloat(departmentBalance[j]);
			
			if (balance != 0)
			{
				//1.0.1 04/04/2013 - LG
				if ((balance < 0.01) && (balance > -0.01))  
				{
					//rounding issue causing zero to be represented by a very small floating point number
					alert('error trapped. \nValue: ' + balance);
				}
				else
				{
					error = true;
					
					//alertDetail = 'test';
					alertDetail += departmentName[j] + ' = ' + balance + '\n';
				}
			} //if			
			
			
		} //if
		
	} //for

	// if error condition has occurred then ask for confirmation on save.
	if (error == true)
	{
		alertString = 'This journal is out of balance by Location/Department as follows:\n\n';
		alertString += alertDetail;
		alertString += '\nPress OK to continue and save, or CANCEL to edit the journal.';
		
		var response = confirm(alertString);
		
		if (response == true)
		{
			return true;
		}
		else
		{
			return false;
		}
		
		
	} //if
	else
	{
		return true;
		
	} //else
	
	
} //function onSave

/**
 * validate line
 * 
 * @param type
 * @returns {Boolean}
 */
function myValidateLine(type)
{	
	//alert('myValidateLine\nType=' + type);

	var retVal = true;
	var currentLocation = nlapiGetCurrentLineItemValue('line','location');
	
	if(String(currentLocation).length == 0)
	{
		alert('You must enter a Location before proceeding.');
		retVal = false;
	}	
	return retVal;
}
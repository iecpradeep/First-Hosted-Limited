/*******************************************************
 * Name: 					Add Resources to Task
 * Script Type: 			Client
 * Version: 				1.0.000
 * Date: 					20th Mar 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				On the active Project Task, add all Employees who are marked as a Programme Resource.
 * Checked by:			
 *******************************************************/

var searchEmployeeResult = null;
var currentAssignees = null;
var addResult = false;

/*******************************
 *  Main function called when the Add Resources 
 *  button is pressed on the Project Activity
 *  
 *******************************/
function addResourcesToTask()
{
	
	try
	{
		currentAssignees = getCurrentAssignees();
	
		if(currentAssignees >0)
		{
			alert('You already have assignees against this Project Activity.\n\nPlease remove them and retry this operation.');
		}
		else
		{
			//alert('assignees: ' + currentAssignees);
			searchEmployeeResult =  getAllResources();
			
			if(searchEmployeeResult == false)
			{
				alert('No Employees were returned in the search...');
			}
			else
			{
				//alert('No Assignees and we have Employees to add!');
				addResult = addResources(searchEmployeeResult);
				if(addResult == false)
				{
					alert('All resources have been added.\nPlease save the Project Activity now.');	
				}
				else
				{
					alert('An error occurred.\nPlease remove all assignees and retry.');	
				}
			}
		}
	}
	catch(e)
	{
		alert('An error has occurred whilst trying to add resources to the Project Activity.\n\nError message: ' + e.message);
	}

	return true;
}

/***************************************
 * Adds all the resources to the Assignees sublist of the current record, based on the 
 * 
 * @param {Object} employeesList nlobjSearchResult of Employees
 * 
 * @Returns whether the function was successful or not
 ***************************************/
function addResources(employeesList)
{
	var anyFailed = true;	
	
	try
	{
		if(employeesList == null||employeesList.length == 0)
		{
			alert('The Employees List passed through has an invalid value.');
			return false;
		}
		
		//iterate through each search result
		for(var i = 0;i < employeesList.length; i++)
		{
			//select new Assignee Line Item, fill in the values from the Search Results, then committ it
			nlapiSelectNewLineItem('assignee');
			nlapiSetCurrentLineItemValue('assignee','resource',employeesList[i].getValue('internalid'), true, true);
			nlapiSetCurrentLineItemValue('assignee','units','5', false, false);	
			nlapiSetCurrentLineItemValue('assignee','estimatedwork','0');	
			nlapiCommitLineItem('assignee');	
		}
	}
	catch(e)
	{
		anyFailed = false;
		alert('Error on adding resources: ' + e.message);
	}

	return anyFailed;
}
 
 /*********
  * Gets all the active Employees who are Project and Programme Project Resources
  * 
  * @Returns nlobjSearchResult of Employees if correct, otherwise returns false if none are found
  *  
  *********/
 function getAllResources()
 {
 	try
	{
		//do search for all Employees where not inactive, is project resource, is programme resource
		var empFilter = new Array();
		empFilter[0] = new nlobjSearchFilter('isjobresource', null, 'is', 'T');								//Must be a job resource
		empFilter[1] = new nlobjSearchFilter('isinactive', null, 'is', 'F');										//Must be Active...
		empFilter[2] = new nlobjSearchFilter('custentity_programmeresource', null, 'is', 'T');		//Must be a programme resource
		
		var empColumn = new Array();
		empColumn[0] = new nlobjSearchColumn('internalid');	//We need the InternalID
		empColumn[1] = new nlobjSearchColumn('entityid');	//And their first name...
		empColumn[2] = new nlobjSearchColumn('laborcost');	//And their team name...
		empColumn[3] = empColumn[0].setSort();	//Sort the columns...
		
		searchEmployeeResult = nlapiSearchRecord('employee',null,empFilter,empColumn);
		
		if(searchEmployeeResult == null)
		{
		       return false;
		}
		return searchEmployeeResult;
	}
	catch(e)
	{
		alert('An error occurred whilst trying to find all Employees.\n\nError message: ' + e.message);
		return false;
	}
 }
 
 /****
  * Get Current Assignees gets the numeric value of the number of 
  * Assignees currently in the Assignee sublist on the active record
  * @Returns the count of Employees.
  */
 function getCurrentAssignees()
 {
 	try
	{
		var lineNum = nlapiGetLineItemCount('assignee');
		return lineNum;
	}
	catch(e)
	{
		alert('An error has occurred whilst getting the : ' + e.message);
		return 0;
	}
 }
 
 /***********
  * Function to test the Field Changed
  * 
  * @param {Object} type
  * @param {Object} name
  * @param {Object} linenum
  */
function myFieldChanged(type, name, linenum)
{
	//alert('myFieldChanged type=' + type + ', name=' + name + ', linenum=' + linenum);
} 
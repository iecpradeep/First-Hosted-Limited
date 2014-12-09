/*******************************************************
 * Name: 					Create Project Hierarchy
 * Script Type: 			Client
 * Version: 				1.4.000
 * Date: 					16th Mar 2012
 * Author: 					Peter Lewis, FHL
 * Purpose: 				Creates the Phase Project Hierarchy.
* 								Requires the Umbrella Project to be created first, as it is run from that.
 * 							The Project Type must be set to Programme, and the Umbrella Project
 * 							must be saved first as we need the Project ID
 * Checked by:			Anthony Nixon, FHL
 *******************************************************/


//Declare all the global variables used throughout the functions
var startDate = 0;
var entityId = null;
var entityIdText = null;
var choice = null;
var projectId = 0;
var currentProjectType = null;
var phasesCreated = null;
var anyFailed = false;

var projectTask = '';
var projectTaskId = 0;
var projectRecord = '';
var projectRecordId = 0;

//set defaults for the Projects
//Alter it here to modify it for all Phase Projects
var jobType = 4;
var jobStatus = 2;
var jobCategory = 2;
var jobAllowTime = 'T';
var jobAllowAllResourcesForTasks = 'T';
var jobLimitTimeToAssignees = 'F';
var jobIsUtilizedTime = 'T';
var jobIsProductiveTime = 'T';
var jobIsExemptTime = 'F';
var jobAllowExpenses = 'T';
var jobMaterializeTime = 'F';
var jobIncludeCRMTasksInTotals = 'T';

function createHierarchy()
{
	try 
	{
	
			phasesCreated = nlapiGetFieldValue('custentity_phasesgenerated');
			
			if (phasesCreated != 'F') 
			{
				alert('The Phases for this Project have already been created.\nNo more Phases will be created.');
				return false;
			}
			
			currentProjectType = nlapiGetFieldValue('jobtype');
			startDate = nlapiGetFieldValue('startdate');
			//alert('Current Project Type is : ' + currentProjectType);
			
			if (currentProjectType == 3) 
			{
				entityIdText = nlapiGetFieldValue('entityid');
				//alert(entityIdText);
				if (entityIdText == 'To Be Generated') 
				{
					alert('You must save this Project before you attempt to create all the Phases for it.');
					return false;
				}
				else 
				{
					choice = confirm('This will create all of the Phases Projects for the current Project.\n\nAre you sure you wish to execute this script?');
					if (choice == true) 
					{
						entityId = nlapiGetFieldValue('custentity_entityid');
						projectId = nlapiGetRecordId();
						
						currentProjectType = nlapiLookupField('job', projectId, 'jobtype');
						
						if (currentProjectType != 3) 
						{
							alert('You must save the Project in its current state and then retry the operation.');
							return false;
						}
						
						
						alert('WARNING - Creating the Phases will take up to 1 minute.\n\nDO NOT navigate away from this page until you see the "Complete" alert.');
						//Create Phase 00
						if (createPhase00() == false) 
						{
							anyFailed = true;
							alert('Phase 00 failed to create');
						}
						
						//Create Phase 01
						if (createPhase01() == false) 
						{
							anyFailed = true;
							alert('Phase 01 failed to create');
						}
						//Create Phase 02
						if (createPhase02() == false) 
						{
							anyFailed = true;
							alert('Phase 02 failed to create');
						}
						//Create Phase 03
						if (createPhase03() == false) 
						{
							anyFailed = true;
							alert('Phase 03 failed to create');
						}
						//Create Phase 04
						if (createPhase04() == false) 
						{
							anyFailed = true;
							alert('Phase 04 failed to create');
						}
						//Create Phase 05
						if (createPhase05() == false) 
						{
							anyFailed = true;
							alert('Phase 05 failed to create');
						}
						//Create Admin Phase
						if (createAdminPhase() == false) 
						{
							anyFailed = true;
							alert('Admin Phase failed to create');
						}
						//Create Other Phase
						if (createOtherPhase() == false) 
						{
							anyFailed = true;
							alert('Other Phase failed to create');
						}
						//Create StoryWeb Phase
						if (createStoryWebPhase() == false) 
						{
							anyFailed = true;
							alert('StoryWeb Phase failed to create');
						}
						
						
						if (anyFailed == true) 
						{
							alert('One or more Phases failed to generate.\n\nPlease retry the operation.');
							//set the custentity_phasesgenerated field to False
							nlapiSetFieldValue('custentity_phasesgenerated', 'F');
							return true;
						}
						else 
						{
							//set the custentity_phasesgenerated field to True
							nlapiSetFieldValue('custentity_phasesgenerated', 'T');
							nlapiSetFieldValue('allowtime', 'F');
							nlapiSetFieldValue('allowexpenses', 'F');
							nlapiSetFieldValue('materializetime', 'F');
							alert('All Phases have been generated successfully!\n\nYou will now have to assign Employees to each Project Activity to allow them to Track Time against the Phases.\n\n\nYou must save this Project BEFORE making anymore changes.');
							return true;
						}
						
					}
					else 
					{
						return false;
					}
				}
			}
			else 
			{
				//incorrect type. We only want to create the hierarchy for Programme projects
				alert('You cannot create Phases on this Project.\n\nPlease ensure the Project Type is set to Programme before continuing.');
				return false;
			}
		
		
	}
	catch(e)
	{
		alert('An error has occurred: ' + e.message);
	}

}

function createPhase00()
{
	try
	{
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '00 Masterplan');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			//alert('Phase 00 project');
			return false;
		}
		else
		{
		
			//alert('Phase 00 Saved. ID is ' + projectRecordId + '\n\nCreating Project Tasks now...');
			
			/***
			 * TT : Programme : 00 Masterplan : Meetings
			 * TT : Programme : 00 Masterplan : Output
			 * TT : Programme : 00 Masterplan : Planning
			 * TT : Programme : 00 Masterplan : Research
			 ****/
		
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Research');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			//alert('Project Task ID: ' + projectTaskId);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			//alert('Project Task ID: ' + projectTaskId);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Meetings');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			//alert('Project Task ID: ' + projectTaskId);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Output');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			//alert('Project Task ID: ' + projectTaskId);		
		
			return true;
		}
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 00 Masterplan\n\n' + e.message);
		return false;
	}
	

}


/**
 *  Create the Phase 01 Project
 */
function createPhase01()
{
	try
	{
		//TT : Programme : 01 Story phase
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '01 Story phase');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			//alert('Phase 00 project');
			return false;
		}
		else
		{
			//TT : Programme : 01 Story phase : Management
			//TT : Programme : 01 Story phase : Planning
			//TT : Programme : 01 Story phase : Story creative
			//TT : Programme : 01 Story phase : Story narrative
		
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Management');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story creative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story narrative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			return true;
		}
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 01 Story phase\n\n' + e.message);
		return false;
	}
	
	
}

function createPhase02()
{
	try
	{
		//TT : Programme : 02 Connection phase
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '02 Connection phase');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : 02 Connection phase : Development and design
			//TT : Programme : 02 Connection phase : Management
			//TT : Programme : 02 Connection phase : Planning
			//TT : Programme : 02 Connection phase : Support
			//TT : Programme : 02 Connection phase : Tools
	
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Development and design');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Management');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Support');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Tools');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 02 Connection phase\n\n' + e.message);
		return false;
	}
	

}

function createPhase03()
{	
	try
	{
		//TT : Programme : 03 Action Phase
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '03 Action Phase');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : 03 Action Phase : Development and design
			//TT : Programme : 03 Action Phase : Management
			//TT : Programme : 03 Action Phase : Planning
			//TT : Programme : 03 Action Phase : Support
			//TT : Programme : 03 Action Phase : Tools
	
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Development and design');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Management');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Support');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Tools');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}	
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 03 Action Phase\n\n' + e.message);
		return false;
	}
	
}

function createPhase04()
{
	try
	{
		//TT : Programme : 04 Reinforcement phase
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '04 Reinforcement phase');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : 04 Reinforcement phase : Development and design
			//TT : Programme : 04 Reinforcement phase : Management
			//TT : Programme : 04 Reinforcement phase : Planning
			//TT : Programme : 04 Reinforcement phase : Support
			//TT : Programme : 04 Reinforcement phase : Tools
	
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Development and design');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Management');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Support');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Tools');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}		
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 04 Reinforcement phase\n\n' + e.message);
		return false;
	}

}

function createPhase05()
{
	try
	{
		//TT : Programme : 05 Living Story phase
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', '05 Living Story phase');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : 05 Living Story phase : Management
			//TT : Programme : 05 Living Story phase : Planning
			//TT : Programme : 05 Living Story phase : Story creative
			//TT : Programme : 05 Living Story phase : Story narrative
	
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Management');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story creative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story narrative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}	
	}
	catch(e)
	{
		alert('An error has occurred whilst creating 05 Living Story phase\n\n' + e.message);
		return false;
	}
	
}

function createAdminPhase()
{
	try
	{
		//TT : Programme : Administration
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', 'Administration');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : Administration : Planning
			//TT : Programme : Administration : Story creative
			//TT : Programme : Administration : Story narrative
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story creative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Story narrative');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}	
	}
	catch(e)
	{
		alert('An error has occurred whilst creating the Administration Phase\n\n' + e.message);
		return false;
	}
	
}

function createOtherPhase()
{

	try
	{
		//TT : Programme : Other client related activity
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', 'Other client related activity');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : Other client related activity : Other client related activity
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Other client related activity');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
	
			return true;
		}
	
	}
	catch(e)
	{
		alert('An error has occurred whilst creating the Other client related activity Phase\n\n' + e.message);
		return false;
	}
	
	
}

function createStoryWebPhase()
{
	try
	{
		//TT : Programme : StoryWeb
		projectRecord = nlapiCreateRecord('job');
		projectRecord.setFieldValue('companyname', 'StoryWeb');
		projectRecord.setFieldValue('parent',projectId);
		
		//set the defaults defined at the top of the file...
		projectRecord.setFieldValue('jobtype', jobType);
		projectRecord.setFieldValue('entitystatus', jobStatus);
		projectRecord.setFieldValue('category', jobCategory);
		
		projectRecord.setFieldValue('allowtime',jobAllowTime);
		projectRecord.setFieldValue('allowallresourcesfortasks', jobAllowAllResourcesForTasks);
		projectRecord.setFieldValue('limittimetoassignees', jobLimitTimeToAssignees);
		projectRecord.setFieldValue('isutilizedtime', jobIsUtilizedTime);
		projectRecord.setFieldValue('isproductivetime',jobIsProductiveTime);
		projectRecord.setFieldValue('isexempttime',jobIsExemptTime);
		projectRecord.setFieldValue('allowexpenses',jobAllowExpenses);
		projectRecord.setFieldValue('materializetime',jobMaterializeTime);
		projectRecord.setFieldValue('includecrmtasksintotals',jobIncludeCRMTasksInTotals);
		
		projectRecordId = nlapiSubmitRecord(projectRecord);
		
		if(isNaN(projectRecordId))
		{
			return false;
		}
		else
		{
			//TT : Programme : StoryWeb : Planning
			//TT : Programme : StoryWeb : Set up and administration
			//TT : Programme : StoryWeb : Training and support
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Planning');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Set up and administration');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);
			
			projectTask = nlapiCreateRecord('projecttask');
			projectTask.setFieldValue('title','Training and support');
			projectTask.setFieldValue('company', projectRecordId);
			projectTaskId = nlapiSubmitRecord(projectTask);		
			return true;
		}	
	}
	catch(e)
	{
		alert('An error has occurred whilst creating the StoryWeb Phase\n\n' + e.message);
		return false;
	}
}
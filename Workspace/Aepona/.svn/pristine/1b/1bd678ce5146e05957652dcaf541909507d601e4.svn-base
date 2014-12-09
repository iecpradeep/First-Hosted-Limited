/*******************************************************
 * Name:		Aepona Opportunity Event script
 * Script Type:	User Event
 * Version:		1.1.9
 * Date:		09 February 2012
 * Author:		FHL
 *******************************************************/

function calculateUSD(type)
{
	if (type == 'create' || type == 'edit') 
	{
		//Obtain a handle to the newly created Opportunity
		var oppRecord = nlapiGetNewRecord();
		var oppRecordId = oppRecord.getId();
				
		var currency = oppRecord.getFieldValue('currency');
		var total = parseFloat(oppRecord.getFieldValue('custbody_netbooking')); //changed from total field in v1.1.8
		var fxrate = 1.00;
		
		// target currency of 1 = USD.  No date specified so use current date.
		fxrate = parseFloat(nlapiExchangeRate(currency,1));
		
		
		var totalusd = total * fxrate;
		
	
		nlapiSubmitField('opportunity',oppRecordId,'custbody_netbookingusd',totalusd.toFixed(2),false);
		
				
	} //if
	
	return true;
	
} //function

function createProject(type)
{
	if (type == 'create') 
	{
		//Obtain a handle to the newly created Opportunity
		var oppRecord = nlapiGetNewRecord();
		var oppRecordId = oppRecord.getId();
				
		//check to see if opportunity has project assigned
		var project = oppRecord.getFieldValue('job');

		if (project == null || project == '')
		{
			// get current opportunity title and number
			
			var oppTitle = oppRecord.getFieldValue('title');
			var oppNumber = oppRecord.getFieldValue('tranid');
			var oppCompany = oppRecord.getFieldValue('entity');
			
			var projectId = 'PJ' + oppNumber.slice(3) + ': ' + oppTitle;
			var projectCode = 'PJ' + oppNumber.slice(3);
			
			var newProject = nlapiCreateRecord('job');
			
			newProject.setFieldValue('parent',oppCompany);
			newProject.setFieldValue('companyname',oppTitle);
			newProject.setFieldValue('entityid',projectId);
			newProject.setFieldValue('custentity_tt_projecttype',2); //set to pre-sales project type

			newProject.setFieldValue('allowtime','T');
			newProject.setFieldValue('allowallresourcesfortasks','F');
			newProject.setFieldValue('limittimetoassignees','F');
			newProject.setFieldValue('isutilizedtime','T');
			newProject.setFieldValue('isproductivetime','F');
			newProject.setFieldValue('isexempttime','F');
			newProject.setFieldValue('allowexpenses','T');
			newProject.setFieldValue('materializetime','F');
			newProject.setFieldValue('includecrmtasksintotals','T');
			newProject.setFieldValue('custentity_projectcode', projectCode); //Project Code added v1.1.9
			
			var id = nlapiSubmitRecord(newProject);
			
			oppRecord.setFieldValue('job',id);
			oppRecord.setFieldValue('custbody_reportingproject',id); //link to pseudo project field for reporting purposes added v1.1.7
			
		
		} //if
	
				
	} //if

	if (type == 'edit') 
	{
		
		try 
		{
			//Obtain a handle to the newly created Opportunity
			var oppRecord = nlapiGetNewRecord();
			
			var id = oppRecord.getFieldValue('job');
			oppRecord.setFieldValue('custbody_reportingproject',id); //link to pseudo project field for reporting purposes added v1.1.7
		
		}
		catch (e) 
		{
		
		}
	
	} //if
	
	return true;
	
} //function
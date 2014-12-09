function createEvent()
{
	
	try 
	{
		var isticked = nlapiGetFieldValue('custevent_addtocalendar');
			
		//if add to calendar option is selected
		if (isticked == 'T')
		{
			
			// get calendar event id and start date
			var recordId = nlapiGetFieldValue('custevent_calendareventid');
			var startdate = nlapiGetFieldValue('startdate');
			
			// if a calendar event already exists then just update the start date on that event
			if (recordId != null  && recordId != '')
			{
				nlapiSubmitField('task',recordId,'startdate',startdate);
			}
			// else create a new task record
			else
			{
				// get project (internal id), project (name), title and notes from current project task 
				var company = nlapiGetFieldValue('company');
				var companyText = nlapiGetFieldText('company');
				var title = nlapiGetFieldValue('title');
				var notes = nlapiGetFieldValue('message');
				
				// get first allocated resource from resources sublist
				var resource = nlapiGetLineItemValue('assignee','resource',1);
				
				
				// construct long title including project name and details for crm task
				var longTitle = companyText + ": " + title;
				var details = "Task created from project " + companyText + "\n\n" + notes;
	
				// create new crm task record
				var newRecord = nlapiCreateRecord('task');
				
				// set fields on new record	
				newRecord.setFieldValue('startdate',startdate);
				newRecord.setFieldValue('company',company);
				newRecord.setFieldValue('title',longTitle);
				newRecord.setFieldValue('assigned',resource);
				newRecord.setFieldValue('owner',resource);		
				newRecord.setFieldValue('timedevent','F');
				newRecord.setFieldValue('message',details);
			
				// submit new crm task record to db
				var newId = nlapiSubmitRecord(newRecord);
				
				// write back internal id of record to project task record
				nlapiSetFieldValue('custevent_calendareventid',newId,false,false);
	
			} //else
				
	
		} //if

		return true;
	
	} //try 
	catch (e) 
	{
		return false;
		
	}  //catch

} //function

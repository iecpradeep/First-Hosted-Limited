/*****************************************************************************
 * Name: project_event.js
 * Script Type: 
 * Client: Aepona
 * 
 * Version: 1.0.0 - 27th Jan 2012 - 1st release - ??
 * Version: 1.0.1 - 27th March 2012 - modified to write to bespoke eventlog
 * version: 1.0.2 - 5th  March 2013 - created a 'Project Internal ID' field in the project tt look up record, applied Load record instead of get newRecord - SA
 * version: 1.0.3 - 8th  April 2013 - commented out context type, which was excluding inline editing and massupdate. - SA
 * version: 1.0.4 - 18th April 2013 - Included Isincative field. If real project turn to inactive, then TT type project record also turn to inactive. - SA
 * version: 1.0.5 - 18th April 2013 - removed comment from context type, and included xedit . Now it will execute all the context except 'delete' - SA
 * version: 1.0.6 - 19th April 2013 - Added error handler - SA
 * version: 1.0.7 - 19th April 2013 - Changed back to net new record instead of load record, because in delete write  loadrecord does not work- SA
 * version: 1.0.8 - 19th April 2013 - Added delete write, when an actual project deletes, TT project also must be deleted - SA
 * version: 1.0.9 - 19th April 2013 - Added event log for delete scenario - SA
 * 
 * 
 * Author: FHL
 * Purpose: project event functions
 *****************************************************************************/
var projectRecord = null;
var projectType = null;
var isProjectActive = 'F';

var pSearchFilters = new Array();
var pSearchColumns = new Array();
var pSearchResults =null;

var oldRecord = null;
var oldId = null;

var newRecord = null;
var newId = null;

var genericSearchResult = null;

/*********************
 * updateProjectLink
 *********************/
function updateProjectLink()
{
	try
	{
		logFHLEvent('project_event.js: updateProjectLink','start');		// 1.0.1 jm added eventlog 
		logFHLEvent('project_event.js: updateProjectLink',type);		// 1.0.1 jm added eventlog 

		// version: 1.0.7 
		projectRecord = nlapiGetNewRecord(); 
		project = projectRecord.getId();

		projectType = projectRecord.getFieldValues('custentity_tt_projecttype');
		//1.0.4
		isProjectActive = projectRecord.getFieldValue('isinactive');

		if (type == 'edit' || type == 'create' || type == 'xedit')  //  1.0.5
		{
			// construct search for existing record
			pSearchFilters[0] = new nlobjSearchFilter('custrecord_ttlookup_project',null, 'anyof', project);			
			pSearchColumns[0] = new nlobjSearchColumn('custrecord_ttlookup_type');	
			//1.0.4
			pSearchColumns[1] = new nlobjSearchColumn('isinactive');
			// perform search
			pSearchResults = nlapiSearchRecord('customrecord_tt_projecttypelookup', null, pSearchFilters, pSearchColumns);

			logFHLEvent('project_event.js: updateProjectLink','after search');		// 1.0.1 jm added eventlog 

			// if record found then update it, otherwise create one
			if (pSearchResults)
			{
				logFHLEvent('project_event.js: updateProjectLink','record found, update it');		// 1.0.1 jm added eventlog 

				// version: 1.0.2 
				oldRecord = nlapiLoadRecord('customrecord_tt_projecttypelookup', pSearchResults[0].getId());
				oldRecord.setFieldValue('custrecord_projectinternalid',project);
				oldRecord.setFieldValues('custrecord_ttlookup_type',projectType);	
				//1.0.4
				oldRecord.setFieldValue('isinactive', isProjectActive);
				oldId = nlapiSubmitRecord(oldRecord);

				logFHLEvent('project_event.js: updateProjectLink','customrecord_tt_projecttypelookup field updated');		// 1.0.1 jm added eventlog 

			} //if

			else
			{
				logFHLEvent('project_event.js: updateProjectLink','record not found, create new');		// 1.0. jm added eventlog 

				newRecord = nlapiCreateRecord('customrecord_tt_projecttypelookup');
				newRecord.setFieldValue('custrecord_ttlookup_project',project);
				newRecord.setFieldValue('custrecord_ttlookup_type',projectType);			
				// version: 1.0.2 
				newRecord.setFieldValue('custrecord_projectinternalid',project);
				newId = nlapiSubmitRecord(newRecord);

				logFHLEvent('project_event.js: updateProjectLink','new record submitted');		// 1.0.1 jm added eventlog 

			} //else

		} //if

		//1.0.8 - when an original project has deleted, then project TT lookup record also must be deleted. - SA
		if (type == 'delete') 
		{
			genericSearchResult = genericSearch('customrecord_tt_projecttypelookup','custrecord_projectinternalid', project);

			if (genericSearchResult != 'not found' )
			{
				logFHLEvent('project_event.js: updateProjectLink','record found, Delete it');		// 1.0.8 SA added eventlog 
				nlapiDeleteRecord('customrecord_tt_projecttypelookup',genericSearchResult);
				logFHLEvent('project_event.js: updateProjectLink','customrecord_tt_projecttypelookup record has been deleted');		// 1.0.8 SA added eventlog 
			}

		}	

		logFHLEvent('project_event.js: updateProjectLink','end');		// 1.0.1 jm added eventlog 
	}
	catch (e)
	{
		errorHandler('updateProjectLink', e);

	}

	return true;

} //function




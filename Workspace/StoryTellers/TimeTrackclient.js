/*******************************************************
 * Name: Time Tracking
 * Script Type: Client
 * Storytellers Account ID: 3301199
 * 
 * Current Version: 1.3.0
 * 
 * Revision 1.0.0 : 16th Mar 2012 PAL
 * Revision 1.3.0 : 21st Sep 2012 PAL updating to proposed changes of Time Entry
 * Revision 2.0.0 : 27th Sep 2012 PAL Completed changes of Time Entry to auto source and auto populate based on context of Customer.
 * 
 * Author: Peter Lewis, FHL
 * 
 * Purpose: Checks the selected Service Item for which the Employee wishes 
 * to Track Time against, to ensure Time can be Tracked against it
 * 
 * Checked by:		Pete Lewis, FHL
 * 
 *******************************************************/

var currentUserId = 0;
var timeEmployeeId = 0;
var timeActivityId = 0;
var timeActivityDetailId = 0;
var activityDetailRecord = null;
var timeProjectId = 0;
var timeServiceItemId = 0;
var projectType = '';
var timeProjectName = '';
var storyTellersProjectName = 'The Storytellers (Internal)';

var fhUserId = 511;
var inDebug = false;

 function onSaveCheckItem()
 {
 	try 
	{
		var allowTimeTracking = nlapiGetFieldValue('custcol_tt_allowtimetracking');
		//alert('allowTimeTracking ' +  allowTimeTracking);
		if (allowTimeTracking == 'T' || allowTimeTracking == null) 
		{
			//We are checking the Time Entry on the Weekly Time Sheet using line functions, so when it's null, they are on the Weekly Entry sheet
			return true;
		}
		else 
		{
			alert('You have not selected a valid Service Item for which you can Track Time against.\nTime Tracking Service Items start with "TT"\n\nPlease correct this and retry.');
			return false;
		}
	} 
	catch (e) 
	{
		alert('Something has gone wrong. Please contact your Administrator.\n\nTT Error Message: ' + e.message);
		return true;
	}
 }

/****************
 * Runs on the Validate Line.
 * Checks the Allow Time Tracking checkbox to see if the Service Item is allowed
 * @param {Object} type
 */
 function validateTimeItem(type)
 {
 	//return true;
  	try 
	{
	 	var allowTimeTracking = nlapiGetCurrentLineItemValue(type, 'custcol_tt_allowtimetracking');
 		//alert('myRecalc type=' + type + '\nAllow? ' + allowTimeTracking);
		if (allowTimeTracking == 'F') 
		{	
			//False only happens if they are in the weekly time tracking sheet and have selected an invalid service item	
			alert('You have not selected a valid Service Item for which you can Track Time against.\nTime Tracking Service Items start with "TT"\n\nPlease correct this and retry.');
			return false;
		}
		else
		{
			//null or T is acceptable. Null means standard time tracking
			return true;
		}
	} 
	catch (e) 
	{
		alert('Something has gone wrong. Please contact your Administrator.\n\nTT Error Message: ' + e.message);
		return true;
	}
}

function timeOnFieldChange(type, name, linenum)
{
	try
	{
		switch(name)
		{
			case 'customer':
				timeProjectId = nlapiGetFieldValue('customer');
				if(timeProjectId == null)
				{
					//weekly time view
					timeProjectId = nlapiGetCurrentLineItemValue('timeitem','customer');
					//alert('Entity ID: ' + timeProjectId);
					projectType = nlapiLookupField('entity', timeProjectId ,'custentity_ts_cp_activity_type');
					if (projectType == null) 
					{
						//projectType = nlapiLookupField('customer', timeProjectId, 'custentity_ts_cp_activity_type');
						timeProjectName = nlapiGetCurrentLineItemText('timeitem','customer');
						if(timeProjectName == storyTellersProjectName)
						{
							projectType = 2;
							
						}
						else
						{
							projectType = 1;
						}
					}
				/*	else
					{
						alert('project type id: ' + projectType);
					}
				*/					
					nlapiSetCurrentLineItemValue('timeitem','custcol_ts_type',projectType);

				}
				else
				{
					//Daily time view
					if (inDebug) 
					{
						alert('Daily time view?\nLen: ' + timeProjectId);
						alert('Type: ' + type + '\nName: '+ name + '\nCustomer ID: ' + timeProjectId + '\nCol Get: ' + nlapiGetCurrentLineItemValue( 'timeitem','customer'));
						alert('Customer changed. projectType selected is now: ' + projectType);
					}
					
				}

				break;
				
			case 'custcol_ts_detail_activity':		
		
				timeActivityDetailId = nlapiGetCurrentLineItemValue('timeitem','custcol_ts_detail_activity');

				
				if(timeActivityDetailId == null)
				{
					timeActivityDetailId = nlapiGetFieldValue('custcol_ts_detail_activity');
					timeActivityDetailId = parseInt(timeActivityDetailId);
					if (isNaN(timeActivityDetailId)) 
					{
						//This is sometimes tripped when sourcing the data from other fields
						return true;
					}
					else
					{
						try
						{
							//load
							activityDetailRecord = nlapiLoadRecord('customrecord_ts_detail', timeActivityDetailId);
							timeServiceItemId = activityDetailRecord.getFieldValue('custrecord_ts_detail_serviceitem');
							if(inDebug)
							{
								alert('N1 Item ID : ' + timeServiceItemId);
							}
						
							nlapiSetFieldValue('item', timeServiceItemId);	
							projectType = nlapiGetFieldValue('custcol_ts_type');
							if(projectType == 2)
							{
								//alert('Project Type is 2');
								nlapiSetFieldValue('isbillable','F');
							}
						}
						catch(e)
						{
							alert('(N1) error loading record: ' + e.message);
						}
						return true;
					}
				}
				else
				{
					timeActivityDetailId = parseInt(timeActivityDetailId);
					if(isNaN(timeActivityDetailId))
					{
						
					}
					else
					{
						try
						{
							//load
							activityDetailRecord = nlapiLoadRecord('customrecord_ts_detail', timeActivityDetailId);
							timeServiceItemId = activityDetailRecord.getFieldValue('custrecord_ts_detail_serviceitem');		
							nlapiSetCurrentLineItemValue('timeitem','item', timeServiceItemId);
							if(projectType == 2)
							{
								//alert('isbillable: ' + nlapiGetCurrentLineItemValue('timeitem','isbillable'));
								nlapiSetCurrentLineItemValue('timeitem','isbillable','F');
							}
						}
						catch(e)
						{
							alert('(N2) error loading record: ' + e.message);
						}
					}
					//alert('Time Activity Detail ID: ' + String(parseInt(timeActivityDetailId)));
					//return true;

					//alert('Current User is First Hosted\nService Item ID is ' + timeServiceItemId);
				}
			break;
		default:
			//alert('Field Changed. Name: ' + name);
			if(name.left(7) == 'custcol')
			{
				if(inDebug)
				{
					alert('Custom Column!\n' + name);					
				}
			}
			break;
		}
	}
	catch(e)
	{
		alert('Error: ' + e.message);
	}

}

function timePageInit(type)
{	
	if(inDebug)
	{
		currentUserId = parseInt(nlapiGetUser());
		if(currentUserId == fhUserId)
		{		
			alert('(InDebug) type=' + type + '\nUser: ' + currentUserId);
		}
	}
}


String.prototype.left = function(n) 
{
    return this.substring(0, n);
};




































